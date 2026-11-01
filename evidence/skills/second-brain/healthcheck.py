# -*- coding: utf-8 -*-
"""세컨드 브레인 볼트 헬스체크 — 자동 계산 가능한 항목만 산출.

가이드 5문항 중
  [3] 고립된 페이지 · [4] 정보 공백 · [2] 오래된 주장 후보
를 계산한다. [1] 모순점과 [5] 다음 단계는 내용 판단이 필요하므로 사람/모델이 읽고 정한다.

사용법:  python healthcheck.py [볼트경로]
"""
import collections
import datetime
import io
import os
import re
import sys

sys.stdout.reconfigure(encoding="utf-8")

VAULT = sys.argv[1] if len(sys.argv) > 1 else r"<볼트 경로>"
STALE_DAYS = 14          # status/진행중 인데 이 일수 넘게 미갱신이면 경고
GAP_MIN_NOTES = 3        # 이 개수 이상 노트에서 언급되면 '정보 공백' 후보

# 서식 관례라 공백 후보에서 제외할 것들
NOISE = {
    "Why", "How to apply", "확인필요", "'확인필요'", "없음", "있는 그대로",
    "주의", "참고", "결론", "요약", "중요", "핵심", "합계", "위치", "전체",
    "active", "blocked", "planned", "완료", "미적용", "신규", "정정",
}

def strip_code(body):
    """코드블록·인라인코드를 제거한다.

    옵시디언은 ```블록``` 과 `백틱` 안의 [[위키링크]]를 링크로 치지 않는다.
    제거하지 않으면 문법 설명 문서가 '미해결 링크'로 오탐된다.
    """
    body = re.sub(r"```.*?```", " ", body, flags=re.S)
    body = re.sub(r"~~~.*?~~~", " ", body, flags=re.S)
    body = re.sub(r"`[^`\n]*`", " ", body)
    return body

def load(vault):
    notes, alias, text = {}, {}, {}
    for root, _dirs, files in os.walk(vault):
        if ".obsidian" in root:
            continue
        for fn in files:
            if not fn.endswith(".md"):
                continue
            path = os.path.join(root, fn)
            name = fn[:-3]
            notes[name] = path
            body = io.open(path, encoding="utf-8", errors="ignore").read()
            text[name] = body
            m = re.search(r"^---\n(.*?)\n---", body, re.S)
            if m:
                am = re.search(r"aliases:\s*\n((?:\s*-\s*.+\n)+)", m.group(1))
                if am:
                    for a in re.findall(r"-\s*(.+)", am.group(1)):
                        alias[a.strip()] = name
    return notes, alias, text

def main():
    if not os.path.isdir(VAULT):
        print("볼트 경로를 찾을 수 없습니다:", VAULT)
        return 1

    notes, alias, text = load(VAULT)
    today = datetime.date.today()

    def resolve(link):
        link = link.strip()
        return link if link in notes else alias.get(link)

    out = collections.defaultdict(set)
    inn = collections.defaultdict(set)
    unresolved = collections.defaultdict(set)
    for name, body in text.items():
        for link in re.findall(r"\[\[([^\]|#]+)", strip_code(body)):
            target = resolve(link)
            if target is None:
                unresolved[name].add(link.strip())
            elif target != name:
                out[name].add(target)
                inn[target].add(name)

    bar = "=" * 60
    print(bar)
    print("세컨드 브레인 헬스체크 —", today)
    print("볼트:", VAULT)
    print(bar)
    print("\n노트 %d개 · 링크 %d개" % (len(notes), sum(len(v) for v in out.values())))

    # [3] 고립된 페이지
    iso = sorted(n for n in notes if not out[n] and not inn[n])
    print("\n[3] 고립된 페이지: %d개" % len(iso))
    if iso:
        for n in iso:
            print("    -", n)
    else:
        print("    → 없음. 모든 노트가 최소 1개 이상 연결됨")

    weak = sorted(n for n in notes if len(out[n]) + len(inn[n]) == 1)
    print("\n    링크 1개뿐(가장자리로 밀림): %d개" % len(weak))
    for n in weak:
        print("    -", n)

    # 미해결 링크
    allun = sorted({l for s in unresolved.values() for l in s})
    print("\n    미해결 링크: %d종 %s" % (len(allun), allun if allun else ""))
    for src, links in sorted(unresolved.items()):
        print("      %s -> %s" % (src, sorted(links)))

    # [2] 오래된 주장 후보
    print("\n[2] 오래된 주장 후보 — status/진행중 인데 %d일 넘게 미갱신" % STALE_DAYS)
    rows = []
    for name, path in notes.items():
        if "status/진행중" in text[name]:
            mt = datetime.date.fromtimestamp(os.path.getmtime(path))
            rows.append(((today - mt).days, mt, name))
    stale = sorted((r for r in rows if r[0] >= STALE_DAYS), reverse=True)
    if stale:
        for age, mt, name in stale:
            print("    %3d일 전 (%s)  %s" % (age, mt, name))
    else:
        print("    → 없음")
    print("    (진행중 노트 총 %d개 중 %d개)" % (len(rows), len(stale)))

    # [4] 정보 공백
    print("\n[4] 정보 공백 — %d개 이상 노트에서 굵게 언급되나 전용 노트 없음" % GAP_MIN_NOTES)
    known = set(notes) | set(alias)
    cnt = collections.Counter()
    for name, body in text.items():
        seen = set()
        for term in re.findall(r"\*\*([^*\n]{2,22})\*\*", strip_code(body)):
            term = term.strip(" .·—-:`'\"")
            if not term or term in seen or term in known or term in NOISE:
                continue
            if re.fullmatch(r"[\d\s,./%~+()개GB건년월일주원\-]+", term):
                continue
            seen.add(term)
            cnt[term] += 1
    gaps = [(c, t) for t, c in cnt.items() if c >= GAP_MIN_NOTES]
    if gaps:
        for c, t in sorted(gaps, reverse=True)[:15]:
            print("    %2d개 노트  %s" % (c, t))
        print("    ※ 서식 관례가 섞일 수 있으니 사람이 걸러서 볼 것")
    else:
        print("    → 없음")

    # 허브
    print("\n[참고] 허브 상위 8")
    for c, n in sorted(((len(out[n]) + len(inn[n]), n) for n in notes), reverse=True)[:8]:
        print("    %3d  %s" % (c, n))

    print("\n" + bar)
    print("[1] 모순점 · [5] 다음 단계 → 내용 판단 필요. 위 결과를 근거로 직접 작성할 것")
    print("⚠️ 지시 전까지 어떤 파일도 수정하지 말 것 (볼트 CLAUDE.md §4)")
    print(bar)
    return 0

if __name__ == "__main__":
    sys.exit(main())
