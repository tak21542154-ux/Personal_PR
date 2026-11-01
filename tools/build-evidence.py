# 직접 만든 스킬·에이전트 정의 파일을 공개용으로 정제해 evidence/ 에 복사한다.
# 원문에서 바뀌는 것: 내부 경로·서버명·보안 점검 메모·호칭이 든 줄을 빼고, 회사·사람 이름을 일반어로 바꾼다. 나머지는 원문 그대로다.
# 걸러낼 말과 로컬 경로는 저장소 밖(tools/.evidence-redact.json, 무시 파일)에서 읽는다.
#   { "drop": "<이 정규식에 걸리는 줄은 문서에서 뺀다>", "subs": [["<정규식 또는 문자열>", "<바꿀 말>", "re|lit"]], "jd": "<jd-analysis 폴더>" }
# 사용: python -X utf8 tools/build-evidence.py   (저장소 루트에서, 여러 번 실행해도 결과가 같다)
import json
import os
import re
import shutil

HOME = os.path.expanduser("~")
AG = os.path.join(HOME, ".claude", "agents")
SK = os.path.join(HOME, ".claude", "skills")
OUT = "evidence"

with open("tools/.evidence-redact.json", encoding="utf-8") as f:
    CFG = json.load(f)
DROP = re.compile(CFG["drop"])
SUBS = [(a if kind == "re" else re.escape(a), b) for a, b, kind in CFG["subs"]]
JD = CFG["jd"]

# 공개하는 에이전트(회사·개인 사정이 든 7개는 뺀다)
AGENTS = [
    "captain-marvel-research", "captain-strategy", "coulson-compliance", "deadpool-community", "echo-voice",
    "hawkeye-diagnostics", "msmarvel-ui-designer", "nick-fury-orchestrator", "pepper-ops", "shehulk-security-auditor",
    "shuri-frontend", "spiderman-landingpage", "starlord-dropship", "strange-qa", "vision-backend", "wanda-marketing",
]
# 공개하는 스킬: (이름, 원본 폴더, 가져올 파일). second-brain 의 SKILL.md 는 개인 폴더 구조가 들어 있어 뺀다.
SKILLS = [
    ("session-wrap", os.path.join(SK, "session-wrap"), ["SKILL.md", "check-pending.py", "queue-session.py"]),
    ("daily-wrap", os.path.join(SK, "daily-wrap"), ["SKILL.md", "check-due.py"]),
    ("second-brain", os.path.join(SK, "second-brain"), ["healthcheck.py"]),
    ("detail-page-craft", os.path.join(SK, "detail-page-craft"),
     ["SKILL.md", "templates/detail-page-brief-template.md", "examples/example-55464-layered-tank-dress.md", "examples/example-55464-sim-build.py"]),
    ("jd-analysis", JD, ["SKILL.md"]),
]
NOTE = "> 공개용 정제본: 내부 경로·서버명·보안 점검 메모·호칭이 든 줄은 뺐고, 회사·사람 이름은 일반어로 바꿨습니다. 나머지는 원문 그대로입니다."


def clean(text, md):
    out = []
    for ln in text.splitlines():
        for a, b in SUBS:
            ln = re.sub(a, b, ln)
        if md and DROP.search(ln):  # 코드 파일은 줄을 빼면 깨지므로 치환만 한다
            continue
        out.append(ln.rstrip())
    # 목록 번호를 다시 매긴다(빠진 줄 때문에 번호가 끊기지 않게)
    if md:
        n = 0
        for i, ln in enumerate(out):
            m = re.match(r"^(\d+)\.\s", ln)
            if m:
                n += 1
                out[i] = re.sub(r"^\d+\.", f"{n}.", ln, count=1)
            elif ln.strip() == "" or ln.startswith("#"):
                n = 0
    s = "\n".join(out)
    return re.sub(r"\n{3,}", "\n\n", s).strip() + "\n"


def add_note(s):
    # 첫 번째 제목 줄 바로 아래에 안내문을 넣는다(머리말은 그대로 둔다)
    lines = s.split("\n")
    for i, ln in enumerate(lines):
        if ln.startswith("# "):
            lines[i + 1:i + 1] = ["", NOTE]
            break
    return "\n".join(lines)


def write(path, s):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(s)


if os.path.isdir(OUT):
    shutil.rmtree(OUT)

na = ns = 0
for a in AGENTS:
    s = clean(open(os.path.join(AG, a + ".md"), encoding="utf-8").read(), True)
    write(os.path.join(OUT, "agents", a + ".md"), add_note(s))
    na += 1
for name, base, files in SKILLS:
    for rel in files:
        src = os.path.join(base, rel)
        if not os.path.exists(src):
            print("없음", src)
            continue
        s = clean(open(src, encoding="utf-8").read(), rel.endswith(".md"))
        if rel == "SKILL.md" and "\n# " in s:
            s = add_note(s)
        write(os.path.join(OUT, "skills", name, rel), s)
        ns += 1

readme = """# 증빙 (Evidence)

이 폴더는 직접 만든 **스킬 5개의 정의 파일·스크립트**와 **에이전트 16개의 정의 파일**을 그대로 읽어볼 수 있게 둔 곳입니다.
홈페이지의 각 항목에서 '증빙'으로 연결됩니다.

- `skills/` — Claude Code 스킬(SKILL.md)과 딸린 스크립트·템플릿. 세션 정리, 하루 정리, 세컨드 브레인 볼트 점검, 상세페이지 기획, 채용공고 분석.
- `agents/` — 역할·성격·전문 분야·작업 규칙·도구 권한이 적힌 에이전트 정의 파일.

## 원문과 다른 점
내부 경로·서버명·보안 점검 메모·호칭이 든 줄은 뺐고, 회사·사람 이름은 일반어로 바꿨습니다. 나머지는 원문 그대로입니다.
회사·개인 사정이 든 에이전트 7개와 스킬 4개는 올리지 않았습니다. 요청하시면 화면 공유로 보여드립니다.

## 공개하지 않는 것
서비스 소스 코드(핀큐AI·복구온·모빌리티 ERP 등)는 비공개 저장소에 있습니다. 홈페이지 각 항목의 '증빙' 칸에 저장소의 첫·마지막 커밋 날짜와
최신 커밋 해시 앞 7자리를 적었습니다. 면접 자리에서 화면 공유 시연이나 읽기 전용 열람으로 확인하실 수 있습니다.

`python -X utf8 tools/build-evidence.py` 가 이 폴더를 다시 만듭니다.
"""
write(os.path.join(OUT, "README.md"), readme)
print(f"에이전트 {na}개, 스킬 파일 {ns}개 → {OUT}/")
