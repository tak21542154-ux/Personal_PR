# 지원서에 첨부하는 PDF 포트폴리오를 만든다: 표지 + 개요·전체 지도 + 증빙 안내 + 대표 항목 한 쪽씩 + 연락처(A4 세로, 흰 바탕).
# 사용: node tools/dump-site.mjs > _s/site.json && python -X utf8 tools/build-pdf.py [항목 id ...]   (저장소 루트에서, Microsoft Edge 필요)
# 항목 id 를 주면 그 항목들만 한 쪽씩 싣는다(생략하면 아래 PDF_ITEMS).
# 결과: dist/YU_KYUNGTAK_portfolio.pdf
import base64
import datetime
import html
import io
import json
import os
import re
import subprocess
import sys

import qrcode
from PIL import Image

PDF_ITEMS = ["finqai", "strategy-office-docs", "bokguon", "mobility-erp", "grid-dispatch", "meari", "ese", "agent-corps", "my-skills", "alpha-service", "toktokstock", "marketing-annual"]
ids = [a for a in sys.argv[1:] if not a.startswith("-")] or PDF_ITEMS

SITE = json.load(open("_s/site.json", encoding="utf-8"))
ONLINE = "https://tak21542154-ux.github.io/Personal_PR/"
TODAY = datetime.date.today().isoformat()
OUT = "dist/YU_KYUNGTAK_portfolio.pdf"
TMP = "_s/portfolio_pdf.html"
EDGE = next(p for p in ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"] if os.path.exists(p))

esc = lambda s: html.escape(str(s if s is not None else ""), quote=True)
byid = {w["id"]: w for w in SITE["works"]}
cats = SITE["categories"]
cname = {c["id"]: c for c in cats}
corder = {c["id"]: i for i, c in enumerate(cats)}
kinds = SITE["evidenceKinds"]
kidx = {k["k"]: i for i, k in enumerate(kinds)}
kname = {k["k"]: k["t"] for k in kinds}
EV = SITE["evidence"]
ct = SITE["contact"]
tops = [w for w in SITE["works"] if not w["parent"]]
tops = [w for _, w in sorted(enumerate(tops), key=lambda x: (corder.get(x[1]["cat"], 99), x[0]))]
picked = [byid[i] for i in ids]
LIM = {w["id"]: [6, 5, 3] for w in picked}
STEP = {}
FIRST_ITEM_PAGE = 4
page_of = {w["id"]: FIRST_ITEM_PAGE + i for i, w in enumerate(picked)}
TOTAL = FIRST_ITEM_PAGE + len(picked)  # 마지막 쪽(연락처) 번호


def ev_of(w):
    own = EV.get(w["id"])
    g = list(own["g"]) if own else []
    if w["shots"] and "demo" not in g:
        g.append("demo")
    g.sort(key=lambda k: kidx.get(k, 99))
    return {"g": g, "f": own["f"] if own else [], "l": own["l"] if own else []}


def thumb(w):
    p = f"assets/img/thumb/{w['id']}.png"
    im = Image.open(p).convert("RGB").resize((800, 600), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=88, optimize=True)
    return "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode()


def qr(url):
    img = qrcode.make(url, box_size=8, border=1).convert("RGB")
    buf = io.BytesIO()
    img.save(buf, "PNG")
    return "data:image/png;base64," + base64.b64encode(buf.getvalue()).decode()


def paras(lst):
    return "".join(f"<p>{esc(t)}</p>" for t in lst)


BUDGET = 1550  # 한 쪽에 들어가는 글자 수(왜+어떻게). 넘으면 뒤쪽 문단은 온라인판에 맡긴다


def fit(why, how):
    """왜·어떻게 문단을 글자 수 예산 안에서 통째로 담는다. 잘린 게 있으면 True 를 함께 돌려준다."""
    used, out_w, out_h, cut = 0, [], [], False
    for t in why:
        out_w.append(t); used += len(t)
    for t in how:
        if used + len(t) > BUDGET and out_h:
            cut = True
            continue
        if used + len(t) > BUDGET + 300 and not out_h:
            # 첫 문단이 너무 길면 문장 단위로 자른다
            sents = re.split(r"(?<=[.다])\s+", t)
            acc = ""
            for st in sents:
                if used + len(acc) + len(st) > BUDGET:
                    break
                acc += (" " if acc else "") + st
            out_h.append(acc or t[: BUDGET - used]); cut = True
            used = BUDGET
            continue
        out_h.append(t); used += len(t)
    return out_w, out_h, cut


def item_page(w, n):
    ev = ev_of(w)
    c = cname[w["cat"]]
    meta = "".join(f"<div><dt>{a}</dt><dd>{esc(b)}</dd></div>" for a, b in [("상태", w["status"]), ("유형", w["type"]), ("스택", w["stack"]), ("기간", w["period"])] if b and b != "-")
    chips = "".join(f'<span class="chip chip--{k}">{esc(kname.get(k, k))}</span>' for k in ev["g"])
    lim = LIM[w["id"]]
    facts = "".join(f"<div><dt>{esc(a)}</dt><dd>{esc(b)}</dd></div>" for a, b in ev["f"][:lim[2]])
    pub = [(l["label"], l["href"]) for l in w["links"]] + [tuple(x) for x in ev["l"]]
    seen, links = set(), []
    for l, h in pub:
        if h not in seen:
            seen.add(h); links.append((l, h))
    links_html = " ".join(f'<a href="{esc(h)}">{esc(l)} ↗</a>' for l, h in links[:3])
    feats = "".join(f"<li>{esc(f)}</li>" for f in w["features"][:lim[0]])
    tl = "".join(f'<li><time>{esc(t["date"])}</time><b>{esc(t["title"])}</b></li>' for t in w["timeline"][:lim[1]])
    kids = len(SITE["groups"].get(w["id"], []))
    fw, fh, cut = fit(w["why"], w["how"])
    note = (f"구성 기능 {kids}개의 설명" if kids else "") + (("과 " if kids else "") + "생략한 문단" if cut else "")
    note = (note + "은 온라인판에서 볼 수 있습니다.") if note else ""
    return f'''<section class="pg item">
<div class="top"><span><b>{c["no"]}</b> {esc(c["ko"])}</span><span>YU KYUNGTAK · PORTFOLIO</span></div>
<p class="en">{esc(w["en"])}</p>
<h2>{esc(w["name"])}</h2>
<p class="line">{esc(w["line"])}</p>
<div class="hd"><img src="{thumb(w)}" alt=""><div class="side"><dl class="meta">{meta}</dl><div class="evb"><h4>증빙</h4><p class="chips">{chips}</p><dl class="facts">{facts}</dl>{('<p class="lk">' + links_html + '</p>') if links_html else ''}</div></div></div>
<div class="cols"><h4>왜 만들어졌나</h4>{paras(fw)}<h4>어떻게 동작하나</h4>{paras(fh)}</div>
<div class="bt"><div><h4>주요 기능</h4><ul>{feats}</ul></div><div><h4>이력</h4><ol>{tl}</ol></div></div>
<div class="ft"><span>{note}</span><span>{n} / {TOTAL}</span></div>
</section>'''


# 전체 지도
mapcols = ""
for c in cats:
    its = [w for w in tops if w["cat"] == c["id"]]
    li = "".join(f'<li class="{"in" if w["id"] in page_of else ""}">{esc(w["name"])}{(" <i>p." + str(page_of[w["id"]]) + "</i>") if w["id"] in page_of else ""}</li>' for w in its)
    mapcols += f'<div class="mc"><h3><b>{c["no"]}</b> {esc(c["ko"])} <em>{len(its)}</em></h3><ul>{li}</ul></div>'

legend = "".join(f'<li><b>{esc(k["t"])}</b><span>{esc(k["d"])}</span></li>' for k in kinds)
q = qr(ONLINE)
total_items = len(SITE["works"])

CSS = """
@page{size:A4;margin:0}
*{box-sizing:border-box}
html,body{margin:0;background:#fff}
body{font-family:"Pretendard","Malgun Gothic","Apple SD Gothic Neo","Noto Sans KR",sans-serif;color:#111417;font-size:9.2pt;line-height:1.6;-webkit-print-color-adjust:exact;print-color-adjust:exact;word-break:keep-all}
:root{--ink:#111417;--sub:#5f666d;--line:#dfe3e7;--gray:#f4f5f6;--accent:#8c2346}
a{color:inherit;text-decoration:none}
.pg{width:210mm;height:297mm;padding:15mm 16mm 12mm;position:relative;overflow:hidden;page-break-after:always;display:flex;flex-direction:column}
.pg:last-child{page-break-after:auto}
.top{display:flex;justify-content:space-between;font-size:7.6pt;letter-spacing:.12em;text-transform:uppercase;color:var(--sub);padding-bottom:3mm;border-bottom:.3mm solid var(--ink)}
.top b{color:var(--accent);margin-right:2mm}
.en{margin:7mm 0 0;font-size:8pt;letter-spacing:.16em;color:var(--sub)}
h2{margin:1mm 0 1.5mm;font-size:25pt;line-height:1.18;letter-spacing:-.03em}
.line{margin:0 0 5mm;font-size:11pt;color:var(--sub);line-height:1.5}
h4{margin:4.5mm 0 1.4mm;font-size:7.4pt;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);break-after:avoid}
p{margin:0 0 2mm}
.hd{display:grid;grid-template-columns:72mm 1fr;gap:7mm;align-items:start}
.hd img{width:72mm;height:54mm;object-fit:cover;border:.25mm solid var(--line);display:block}
.meta{margin:0;border-top:.3mm solid var(--ink)}
.meta div{display:grid;grid-template-columns:14mm 1fr;gap:3mm;padding:1.4mm 0;border-bottom:.2mm solid var(--line);font-size:8.4pt}
.meta dt{color:var(--sub)}.meta dd{margin:0;font-weight:500}
.evb{margin-top:3.5mm;padding:3mm 3.5mm;background:var(--gray)}
.evb h4{margin:0 0 1.5mm}
.chips{display:flex;flex-wrap:wrap;gap:1.2mm;margin:0 0 1.5mm}
.chip{display:inline-block;padding:.4mm 2.4mm;border:.25mm solid var(--ink);background:#fff;font-size:7.4pt;font-weight:500}
.chip--live,.chip--src{background:var(--ink);color:#fff}
.facts{margin:0}.facts div{display:grid;grid-template-columns:21mm 1fr;gap:2mm;padding:1mm 0;border-top:.2mm solid var(--line);font-size:7.5pt;line-height:1.42}.facts dt{color:var(--sub)}.facts dd{margin:0}
.lk{margin:1.5mm 0 0!important;font-size:7.6pt;display:flex;flex-wrap:wrap;gap:1mm 4mm}.lk a{border-bottom:.25mm solid var(--ink)}
.cols{margin-top:1mm;column-count:2;column-gap:9mm;font-size:8.6pt;line-height:1.6}
.cols h4:first-child{margin-top:3mm}
.bt{margin-top:3mm;display:grid;grid-template-columns:1.3fr .7fr;gap:9mm}
.bt ul,.bt ol{margin:0;padding:0;list-style:none;font-size:8.3pt}
.bt li{padding:1.1mm 0 1.1mm 4mm;border-top:.2mm solid var(--line);position:relative;line-height:1.5}
.bt ul li::before{content:"";position:absolute;left:0;top:2.7mm;width:1.4mm;height:1.4mm;background:var(--accent)}
.bt ol li{padding-left:0;display:grid;grid-template-columns:15mm 1fr;gap:2mm}.bt time{color:var(--sub);font-variant-numeric:tabular-nums}
.ft{margin-top:auto;display:flex;justify-content:space-between;padding-top:3mm;border-top:.2mm solid var(--line);font-size:7.4pt;color:var(--sub)}
/* 표지 */
.cover h1{margin:auto 0 0;font-size:84pt;line-height:.9;letter-spacing:-.05em;font-weight:800}
.cover .tag{margin:9mm 0 2mm;font-size:19pt;font-weight:700;letter-spacing:-.02em;line-height:1.3}
.cover .sub{font-size:11pt;color:var(--sub);margin:0 0 14mm}
.cover .row{display:grid;grid-template-columns:1fr 1fr 34mm;gap:6mm;align-items:end;border-top:.3mm solid var(--ink);padding-top:5mm;font-size:9pt}
.cover .row dt{font-size:7pt;letter-spacing:.14em;text-transform:uppercase;color:var(--sub)}.cover .row dd{margin:1mm 0 0;font-weight:500}
.cover .row img{width:34mm;height:34mm;display:block}
.cover .small{font-size:7.6pt;letter-spacing:.14em;text-transform:uppercase;color:var(--sub);display:flex;justify-content:space-between}
/* 개요·지도·증빙 */
.stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:.3mm solid var(--ink);margin:7mm 0 8mm}
.stats div{padding:3mm 0 0}.stats strong{display:block;font-size:26pt;line-height:1;letter-spacing:-.03em}.stats span{font-size:7.6pt;color:var(--sub)}
.big{font-size:14.5pt;font-weight:700;line-height:1.5;letter-spacing:-.01em;margin:0 0 3mm}
.map{display:grid;grid-template-columns:1fr 1fr;gap:5mm 9mm;margin-top:6mm}
.mc h3{margin:0 0 2mm;padding-bottom:1.6mm;border-bottom:.3mm solid var(--ink);font-size:9pt}.mc h3 b{color:var(--accent);margin-right:1.5mm}.mc h3 em{font-style:normal;color:var(--sub);float:right;font-size:8pt}
.mc ul{margin:0;padding:0;list-style:none;font-size:8.3pt;line-height:1.75;color:var(--sub)}.mc li.in{color:var(--ink);font-weight:600}.mc li i{font-style:normal;color:var(--accent);font-size:7.4pt;margin-left:1.5mm}
.legend{list-style:none;margin:5mm 0 0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:0 9mm}
.legend li{padding:3mm 0;border-top:.2mm solid var(--line);font-size:8.6pt}.legend b{display:block;font-size:9.4pt}.legend span{color:var(--sub)}
.verify .big{margin-top:9mm}
.contact .big{font-size:30pt;line-height:1.25;margin:auto 0 8mm;letter-spacing:-.03em}
.contact dl{margin:0;border-top:.3mm solid var(--ink)}.contact dl div{display:grid;grid-template-columns:28mm 1fr;padding:3mm 0;border-bottom:.2mm solid var(--line);font-size:10pt}.contact dt{color:var(--sub);font-size:8pt;letter-spacing:.12em;text-transform:uppercase}.contact dd{margin:0}
"""

cover = f'''<section class="pg cover">
<div class="small"><span>Portfolio</span><span>{TODAY}</span></div>
<h1>YU<br>KYUNGTAK</h1>
<p class="tag">{esc(SITE["hero"][0])} {esc(SITE["hero"][1])}</p>
<p class="sub">{esc(SITE["heroSub"])}</p>
<dl class="row"><div><dt>Email</dt><dd>{esc(ct["email"])}</dd></div><div><dt>Tel · Online</dt><dd>{esc(ct["phone"])}<br><a href="{ONLINE}">tak21542154-ux.github.io/Personal_PR</a></dd></div><img src="{q}" alt="온라인 포트폴리오 QR"></dl>
</section>'''

overview = f'''<section class="pg">
<div class="top"><span><b>00</b> Overview</span><span>YU KYUNGTAK · PORTFOLIO</span></div>
<p class="en" style="margin-top:9mm">OVERVIEW</p>
<p class="big">{esc(SITE["intro"]["ko"])}</p>
<p style="font-size:9.6pt;color:var(--sub)">{esc(SITE["intro"]["body"])}</p>
<div class="stats"><div><strong>{len(cats)}</strong><span>서비스 분야</span></div><div><strong>{len(tops)}</strong><span>대표 제품·체계</span></div><div><strong>{total_items}</strong><span>구성 기능을 포함한 전체 항목</span></div><div><strong>2016</strong><span>첫 창업</span></div></div>
<h4>전체 지도 — 굵은 글씨는 이 PDF에 한 쪽씩 실었습니다</h4>
<div class="map">{mapcols}</div>
<div class="ft"><span>나머지 항목과 구성 기능은 온라인판에서 볼 수 있습니다.</span><span>2 / {TOTAL}</span></div>
</section>'''

verify = f'''<section class="pg verify">
<div class="top"><span><b>00</b> How to verify</span><span>YU KYUNGTAK · PORTFOLIO</span></div>
<p class="en" style="margin-top:9mm">HOW TO VERIFY</p>
<p class="big">항목마다 확인 방법을 적었습니다.</p>
<p style="font-size:9.6pt">공개 주소가 있는 것은 눌러서, 비공개인 것은 저장소의 첫·마지막 커밋 날짜와 최신 커밋 해시, 화면 공유 시연이나 읽기 전용 열람으로 확인하실 수 있습니다. 직접 만든 스킬 5개와 에이전트 16개의 정의 파일은 온라인판의 evidence 폴더에서 원문으로 읽을 수 있습니다. 상대 이름, 지분, 정산율, 금액은 싣지 않았습니다.</p>
<ul class="legend">{legend}</ul>
<h4 style="margin-top:9mm">온라인판</h4>
<p style="font-size:9.4pt"><a href="{ONLINE}">{ONLINE}</a></p>
<p style="font-size:9.4pt"><a href="https://github.com/tak21542154-ux/Personal_PR/tree/main/evidence/agents">에이전트 정의 파일 ↗</a> &nbsp; <a href="https://github.com/tak21542154-ux/Personal_PR/tree/main/evidence/skills">직접 만든 스킬 파일 ↗</a></p>
<div class="ft"><span>이 PDF는 {TODAY} 기준입니다.</span><span>3 / {TOTAL}</span></div>
</section>'''

contact = f'''<section class="pg contact">
<div class="top"><span><b>—</b> Contact</span><span>YU KYUNGTAK · PORTFOLIO</span></div>
<p class="big">제품 도입<br>프로젝트 의뢰<br>채용 문의</p>
<dl><div><dt>Email</dt><dd>{esc(ct["email"])}</dd></div><div><dt>Tel</dt><dd>{esc(ct["phone"])}</dd></div><div><dt>Online</dt><dd><a href="{ONLINE}">{ONLINE}</a></dd></div></dl>
<div class="ft"><span>© {TODAY[:4]} {esc(SITE["name"])}</span><span>{TOTAL} / {TOTAL}</span></div>
</section>'''

SCRIPT = "<script>window.addEventListener('load',function(){document.querySelectorAll('.pg').forEach(function(p,i){if(p.scrollHeight>p.clientHeight+1)p.setAttribute('data-over',(p.scrollHeight-p.clientHeight)+'')})})</script>"


def assemble():
    return f'<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>{esc(SITE["name"])} 포트폴리오 · {esc(SITE["en"])}</title><style>{CSS}</style></head><body>{cover}{overview}{verify}{"".join(item_page(w, page_of[w["id"]]) for w in picked)}{contact}{SCRIPT}</body></html>'


# 공개 전 점검: 사적 용어, 비밀값, 허용 외 이메일
priv = []
try:
    for x in json.load(open("tools/.private-terms.json", encoding="utf-8")):
        pat, flags = x["pattern"], 0
        if pat.startswith("(?i)"):
            pat, flags = pat[4:], re.I
        priv.append((re.compile(pat, flags), x["msg"]))
except FileNotFoundError:
    pass


def check(doc):
    text = re.sub(r"data:image/[a-z]+;base64,[A-Za-z0-9+/=]+", "", doc)
    bad = [(m, re.search(r, text).group(0)) for r, m in priv if re.search(r, text)]
    assert not bad, bad
    assert not re.findall(r"(sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{20,}|BEGIN (?:RSA |EC )?PRIVATE KEY)", text)
    assert {m for m in re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)} <= {ct["email"]}


os.makedirs("_s", exist_ok=True)
os.makedirs("dist", exist_ok=True)
url = "file:///" + os.path.abspath(TMP).replace("\\", "/")
for rnd in range(12):
    doc = assemble()
    check(doc)
    open(TMP, "w", encoding="utf-8").write(doc)
    dom = subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--virtual-time-budget=6000", "--dump-dom", url], capture_output=True, text=True, encoding="utf-8", timeout=180).stdout
    over = []
    for i, (cls, attrs) in enumerate(re.findall(r'<section class="pg([^"]*)"([^>]*)>', dom), 1):
        m = re.search(r'data-over="(\d+)"', attrs)
        if m:
            over.append((i, int(m.group(1))))
    if not over:
        break
    for i, px in over:
        if i < FIRST_ITEM_PAGE or i - FIRST_ITEM_PAGE >= len(picked):
            sys.exit(f"{i}쪽이 넘칩니다({px}px) — 표지·개요·연락처 쪽은 손으로 고쳐야 합니다")
        w = picked[i - FIRST_ITEM_PAGE]
        lim = LIM[w["id"]]
        # 넘치면 이 순서로 한 칸씩 줄인다: (칸, 줄일 값) — 칸 0=주요 기능, 1=이력, 2=증빙 사실
        steps = [(0, 5), (1, 4), (0, 4), (1, 3), (0, 3), (1, 2), (2, 2), (0, 2), (2, 1)]
        done = STEP.setdefault(w["id"], 0)
        if done < len(steps):
            k, v = steps[done]
            lim[k] = min(lim[k], v)
            STEP[w["id"]] = done + 1
        print(f"줄임: {i}쪽 {w['name']} → 기능 {lim[0]}, 이력 {lim[1]}, 사실 {lim[2]} (넘침 {px}px)")
else:
    sys.exit("열두 번 줄여도 넘칩니다")
subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--no-pdf-header-footer", f"--print-to-pdf={os.path.abspath(OUT)}", url], capture_output=True, timeout=240)
print(OUT, round(os.path.getsize(OUT) / 1024 / 1024, 2), "MB,", len(picked), "개 항목")
