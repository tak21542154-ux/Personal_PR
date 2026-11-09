# 사이트 내용을 인터넷 없이 열리는 HTML 파일 하나로 묶는다(이력서·지원서에 첨부하는 용도).
# 사용: node tools/dump-site.mjs > _s/site.json && python -X utf8 tools/build-single.py   (저장소 루트에서)
# 결과: dist/YU_KYUNGTAK_portfolio.html — 글자는 그대로, 대표 항목 썸네일은 WebP 로 줄여 파일 안에 넣는다. 글꼴·스크립트 외부 요청 없음.
import base64
import datetime
import html
import io
import json
import os
import re
import sys

from PIL import Image

SITE = json.load(open("_s/site.json", encoding="utf-8"))
PDF_MODE = "--pdf" in sys.argv  # PDF 인쇄용: 구성 기능은 접힌 채로 두지 않고 온라인판 안내 한 줄로 바꾼다
OUT = "_s/single_pdf.html" if PDF_MODE else "dist/YU_KYUNGTAK_portfolio.html"
ONLINE = "https://tak21542154-ux.github.io/Personal_PR/"
TODAY = datetime.date.today().isoformat()

esc = lambda s: html.escape(str(s if s is not None else ""), quote=True)
byid = {w["id"]: w for w in SITE["works"]}
cats = SITE["categories"]
corder = {c["id"]: i for i, c in enumerate(cats)}
kinds = SITE["evidenceKinds"]
kidx = {k["k"]: i for i, k in enumerate(kinds)}
kname = {k["k"]: k["t"] for k in kinds}
EV = SITE["evidence"]

# 대표 항목: 분야 순서 → 원래 순서
tops = [w for w in SITE["works"] if not w["parent"]]
tops = [w for _, w in sorted(enumerate(tops), key=lambda x: (corder.get(x[1]["cat"], 99), x[0]))]
kids_of = SITE["groups"]


def ev_of(w):
    own = EV.get(w["id"])
    base = own or (EV.get(w["parent"]) if w["parent"] else None)
    g = list(base["g"]) if base else []
    if w["shots"] and "demo" not in g:
        g.append("demo")
    if not g:
        return None
    g.sort(key=lambda k: kidx.get(k, 99))
    return {"g": g, "f": base["f"] if base else [], "l": own["l"] if own else [], "inherited": not own}


def thumb(w):
    p = f"assets/img/thumb/{w['id']}.png"
    if not os.path.exists(p):
        return ""
    im = Image.open(p).convert("RGB").resize((640, 480), Image.LANCZOS)
    buf = io.BytesIO()
    im.save(buf, "WEBP", quality=80, method=6)
    return "data:image/webp;base64," + base64.b64encode(buf.getvalue()).decode()


def paras(lst, cls=""):
    return "".join(f'<p{" class=%s" % cls if cls else ""}>{esc(t)}</p>' for t in lst)


def meta(w):
    rows = [("상태", w["status"]), ("유형", w["type"]), ("스택", w["stack"]), ("기간", w["period"])]
    rows = [(a, b) for a, b in rows if b and b != "-"]
    return '<dl class="meta">' + "".join(f"<div><dt>{a}</dt><dd>{esc(b)}</dd></div>" for a, b in rows) + "</dl>"


def links_html(links, cls="links"):
    if not links:
        return ""
    return f'<p class="{cls}">' + " ".join(f'<a href="{esc(h)}" target="_blank" rel="noopener">{esc(l)} ↗</a>' for l, h in links) + "</p>"


def evidence_html(w):
    ev = ev_of(w)
    if not ev:
        return ""
    chips = "".join(f'<span class="chip chip--{k}">{esc(kname.get(k, k))}</span>' for k in ev["g"])
    facts = "".join(f"<div><dt>{esc(a)}</dt><dd>{esc(b)}</dd></div>" for a, b in ev["f"])
    pub = [(l["label"], l["href"]) for l in w["links"]] + [tuple(x) for x in ev["l"]]
    seen = set(); pub2 = []
    for l, h in pub:
        if h not in seen:
            seen.add(h); pub2.append((l, h))
    note = "<p class=\"note\">대표 항목과 같은 저장소·화면에서 확인할 수 있습니다.</p>" if ev["inherited"] and w["parent"] else ""
    return f'<div class="ev"><h4>증빙</h4><p class="chips">{chips}</p>{note}' + (f'<dl class="facts">{facts}</dl>' if facts else "") + links_html(pub2, "links") + "</div>"


def kid_html(k):
    body = paras(k["why"]) + paras(k["how"])
    if k["features"]:
        body += "<ul class=\"feat\">" + "".join(f"<li>{esc(f)}</li>" for f in k["features"]) + "</ul>"
    ev = EV.get(k["id"])
    if ev and ev["l"]:
        body += links_html([tuple(x) for x in ev["l"]], "links")
    return f'<details class="kid"><summary><b>{esc(k["name"])}</b><span>{esc(k["line"])}</span></summary><div class="kb">{body}</div></details>'


def kids_html(w):
    ids = kids_of.get(w["id"], [])
    if not ids:
        return ""
    kg = SITE["kidGroups"].get(w["id"])
    if kg:
        groups = [(g[0], [byid[i] for i in g[1] if i in byid]) for g in kg]
    else:
        groups = [("", [byid[i] for i in ids if i in byid])]
    inner = ""
    for label, ks in groups:
        inner += '<div class="kgrp">' + (f'<h5>{esc(label)} <em>{len(ks)}</em></h5>' if label else "") + "".join(kid_html(k) for k in ks) + "</div>"
    if PDF_MODE:
        return f'<p class="more">구성 기능 {len(ids)}개의 설명은 온라인판에서 볼 수 있습니다.</p>'
    return f'<details class="kids"><summary>구성 기능 {len(ids)}개 펼쳐 보기</summary>{inner}</details>'


def timeline_html(w):
    if not w["timeline"]:
        return ""
    return '<ol class="tl">' + "".join(f'<li><time>{esc(t["date"])}</time><b>{esc(t["title"])}</b> <span>{esc(t["desc"])}</span></li>' for t in w["timeline"]) + "</ol>"


def item_html(w):
    th = thumb(w)
    img = f'<img src="{th}" alt="{esc(w["name"])} 미리보기" width="640" height="480">' if th else ""
    parts = ""
    if w["parts"]:
        parts = '<dl class="parts">' + "".join(f"<div><dt>{esc(a)}</dt><dd>{esc(b)}</dd></div>" for a, b in w["parts"]) + "</dl>"
    feats = '<ul class="feat">' + "".join(f"<li>{esc(f)}</li>" for f in w["features"]) + "</ul>" if w["features"] else ""
    return f'''<article class="item" id="{esc(w["id"])}">
<div class="ph">{img}</div>
<div class="tx">
<p class="en">{esc(w["en"])}</p>
<h3>{esc(w["name"])}</h3>
<p class="line">{esc(w["line"])}</p>
{meta(w)}
{evidence_html(w)}
<h4>왜 만들어졌나</h4>{paras(w["why"])}
<h4>어떻게 동작하나</h4>{paras(w["how"])}{parts}
{('<h4>주요 기능</h4>' + feats) if feats else ''}
{('<h4>이력</h4>' + timeline_html(w)) if w["timeline"] else ''}
{kids_html(w)}
</div>
</article>'''


# 목차
toc = ""
sections = ""
for i, c in enumerate(cats):
    its = [w for w in tops if w["cat"] == c["id"]]
    toc += f'<li><a href="#cat-{c["id"]}"><b>{c["no"]}</b> {esc(c["ko"])}</a><span>{len(its)}</span><ul>' + "".join(f'<li><a href="#{esc(w["id"])}">{esc(w["name"])}</a></li>' for w in its) + "</ul></li>"
    sections += f'<section class="cat" id="cat-{c["id"]}"><div class="ch"><span class="no">{c["no"]}</span><div><h2>{esc(c["ko"])}</h2><p>{esc(c["desc"])}</p></div></div>' + "".join(item_html(w) for w in its) + "</section>"

nav = "".join(f'<a href="#cat-{c["id"]}">{esc(c["ko"])}</a>' for c in cats)
legend = "".join(f'<li><b>{esc(k["t"])}</b><span>{esc(k["d"])}</span></li>' for k in kinds)
ct = SITE["contact"]
total = len(SITE["works"])

CSS = """
:root{--ink:#111417;--sub:#5f666d;--line:#e3e6e9;--gray:#f5f6f7;--accent:#8c2346}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:64px}
body{margin:0;background:#fff;color:var(--ink);font-family:"Pretendard","Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",system-ui,-apple-system,sans-serif;line-height:1.75;-webkit-font-smoothing:antialiased;word-break:keep-all}
a{color:inherit}
.wrap{max-width:1120px;margin:0 auto;padding:0 32px}
nav.gnb{position:sticky;top:0;z-index:5;background:rgba(255,255,255,.96);border-bottom:1px solid var(--line)}
nav.gnb .wrap{display:flex;gap:22px;overflow-x:auto;white-space:nowrap;padding:14px 32px;font-size:13px}
nav.gnb a{text-decoration:none;color:var(--sub)}nav.gnb a:hover{color:var(--accent)}
header.top{padding:84px 0 44px;border-bottom:1px solid var(--ink)}
header small{letter-spacing:.16em;font-size:12px;color:var(--sub);text-transform:uppercase}
h1{font-size:clamp(54px,12vw,140px);line-height:.92;letter-spacing:-.045em;margin:20px 0 26px;font-weight:800}
.tag{font-size:clamp(20px,3vw,34px);font-weight:700;line-height:1.3;letter-spacing:-.02em;margin:0 0 10px}
.sub{color:var(--sub);font-size:16px;margin:0 0 26px}
.contact{display:flex;flex-wrap:wrap;gap:8px 28px;font-size:14px}.contact b{font-weight:500;color:var(--sub);margin-right:8px}
.stats{display:grid;grid-template-columns:repeat(4,1fr);border-top:1px solid var(--line);margin-top:44px}
.stats div{padding:20px 0 4px}.stats strong{display:block;font-size:44px;line-height:1;letter-spacing:-.03em}.stats span{font-size:12px;color:var(--sub)}
.intro{display:grid;grid-template-columns:1fr 2fr;gap:40px;padding:56px 0;border-bottom:1px solid var(--line)}
.intro h2,.toc h2,.how h2{font-size:15px;letter-spacing:.14em;text-transform:uppercase;margin:0}
.intro p{margin:0 0 12px}.intro .ko{font-size:22px;font-weight:700;line-height:1.5;letter-spacing:-.01em}
.toc{padding:48px 0;border-bottom:1px solid var(--line)}
.toc ol{list-style:none;margin:24px 0 0;padding:0;display:grid;grid-template-columns:repeat(3,1fr);gap:0 32px}
.toc>ol>li{padding:16px 0;border-top:1px solid var(--line)}
.toc>ol>li>a{font-weight:700;text-decoration:none;font-size:15px}.toc>ol>li>a b{color:var(--accent);margin-right:6px;font-size:12px}
.toc>ol>li>span{float:right;font-size:12px;color:var(--sub)}
.toc ul{list-style:none;margin:8px 0 0;padding:0;font-size:13px;line-height:1.9}.toc ul a{text-decoration:none;color:var(--sub)}.toc ul a:hover{color:var(--accent)}
.how{padding:48px 0;border-bottom:1px solid var(--line);display:grid;grid-template-columns:1fr 2fr;gap:40px}
.how ul{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:0 32px}
.how li{padding:14px 0;border-top:1px solid var(--line);font-size:13px}.how li b{display:block;font-size:14px;margin-bottom:2px}.how li span{color:var(--sub)}
.how p{font-size:13px;color:var(--sub);margin:0 0 16px}
.cat{padding-top:72px}
.ch{display:flex;gap:28px;align-items:flex-start;padding-bottom:26px;border-bottom:1px solid var(--ink)}
.ch .no{font-size:clamp(48px,8vw,92px);line-height:.9;font-weight:800;letter-spacing:-.04em;color:var(--accent)}
.ch h2{margin:6px 0 6px;font-size:clamp(26px,4vw,40px);letter-spacing:-.025em;line-height:1.2}.ch p{margin:0;color:var(--sub);font-size:15px}
.item{display:grid;grid-template-columns:320px 1fr;gap:40px;padding:48px 0;border-bottom:1px solid var(--line)}
.item .ph{position:sticky;top:84px;align-self:start}.item .ph img{width:100%;height:auto;border:1px solid var(--line);display:block}
.en{margin:0;font-size:12px;letter-spacing:.14em;color:var(--sub)}
.item h3{margin:4px 0 6px;font-size:28px;letter-spacing:-.025em;line-height:1.3}
.line{margin:0 0 18px;font-size:16px;color:var(--sub)}
.item h4{margin:28px 0 8px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
.item p{margin:0 0 12px;font-size:15px}
.meta{display:grid;grid-template-columns:repeat(4,1fr);gap:0 18px;margin:0;border-top:1px solid var(--ink)}
.meta div{padding:10px 0;border-bottom:1px solid var(--line)}.meta dt{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--sub)}.meta dd{margin:2px 0 0;font-size:13.5px;font-weight:500}
.ev{margin:22px 0 0;padding:18px 20px;background:var(--gray)}
.ev h4{margin:0 0 10px}
.chips{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 8px!important}
.chip{display:inline-block;padding:3px 11px;border:1px solid var(--ink);background:#fff;font-size:12px;font-weight:500}
.chip--live,.chip--src{background:var(--ink);color:#fff}
.facts,.parts{margin:8px 0 0;display:grid;gap:0}
.facts div,.parts div{display:grid;grid-template-columns:150px 1fr;gap:14px;padding:9px 0;border-top:1px solid var(--line);font-size:13.5px}
.facts dt,.parts dt{color:var(--sub)}.facts dd,.parts dd{margin:0}
.parts{border-bottom:1px solid var(--line);margin-bottom:6px}
.note{font-size:13px!important;color:var(--sub)}
.links{display:flex;flex-wrap:wrap;gap:8px 12px;margin:10px 0 0!important;font-size:13px!important}
.links a{border-bottom:1px solid var(--ink);text-decoration:none;padding-bottom:1px}.links a:hover{color:var(--accent);border-color:var(--accent)}
.feat{margin:0 0 6px;padding-left:18px;font-size:14.5px;list-style:square}.feat li{margin:3px 0}.feat li::marker{color:var(--accent)}
.tl{list-style:none;margin:0;padding:0;font-size:13.5px}
.tl li{display:grid;grid-template-columns:96px auto 1fr;gap:4px 12px;padding:7px 0;border-top:1px solid var(--line)}.tl time{color:var(--sub);font-variant-numeric:tabular-nums}.tl span{color:var(--sub)}
details.kids{margin-top:30px;border-top:1px solid var(--ink)}
details.kids>summary{cursor:pointer;padding:14px 0;font-weight:700;font-size:15px;list-style:none}
details.kids>summary::-webkit-details-marker{display:none}details.kids>summary::after{content:" +";color:var(--accent)}details.kids[open]>summary::after{content:" –"}
.kgrp{margin:6px 0 22px}.kgrp h5{margin:14px 0 4px;font-size:13px;padding-bottom:8px;border-bottom:1px solid var(--ink)}.kgrp h5 em{font-style:normal;color:var(--accent);margin-left:4px}
details.kid{border-bottom:1px solid var(--line)}
details.kid>summary{cursor:pointer;list-style:none;padding:11px 26px 11px 0;position:relative;display:flex;flex-direction:column;gap:1px}
details.kid>summary::-webkit-details-marker{display:none}details.kid>summary::after{content:"+";position:absolute;right:4px;top:10px;color:var(--sub)}details.kid[open]>summary::after{content:"–";color:var(--accent)}
details.kid b{font-size:14.5px}details.kid summary span{font-size:12.5px;color:var(--sub)}
.kb{padding:2px 0 16px}.kb p{font-size:13.5px;margin:0 0 9px}.kb .feat{font-size:13px}
p.more{margin:26px 0 0;padding-top:12px;border-top:1px solid var(--ink);font-size:13px;color:var(--sub)}
footer{margin-top:80px;padding:40px 0 70px;border-top:1px solid var(--ink);font-size:13px;color:var(--sub)}
footer b{color:var(--ink)}
@media (max-width:860px){.wrap{padding:0 20px}nav.gnb .wrap{padding:12px 20px}.stats{grid-template-columns:repeat(2,1fr)}.intro,.how{grid-template-columns:1fr;gap:18px}.how ul{grid-template-columns:1fr}.toc ol{grid-template-columns:1fr}.item{grid-template-columns:1fr;gap:20px}.item .ph{position:static}.meta{grid-template-columns:repeat(2,1fr)}.facts div,.parts div{grid-template-columns:1fr;gap:2px}.tl li{grid-template-columns:80px 1fr}.tl span{grid-column:2}}
@media print{@page{margin:14mm}nav.gnb{display:none}header.top{padding-top:0}.cat{page-break-before:always}.item{break-inside:avoid-page}.item .ph{position:static}a{text-decoration:none}}
"""

PRINT_JS = "" if PDF_MODE else "<script>window.addEventListener('beforeprint',function(){document.querySelectorAll('details').forEach(function(d){d.open=true})});</script>"

doc = f"""<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{esc(SITE['name'])} 포트폴리오 · {esc(SITE['en'])}</title>
<meta name="description" content="{esc(SITE['heroSub'])}">
<style>{CSS}</style></head><body>
<nav class="gnb"><div class="wrap">{nav}</div></nav>
<header class="top"><div class="wrap">
<small>Portfolio · {TODAY}</small>
<h1>{esc(SITE['en'])}</h1>
<p class="tag">{esc(SITE['hero'][0])} {esc(SITE['hero'][1])}</p>
<p class="sub">{esc(SITE['heroSub'])}</p>
<p class="contact"><span><b>Email</b>{esc(ct['email'])}</span><span><b>Tel</b>{esc(ct['phone'])}</span><span><b>Online</b><a href="{ONLINE}" target="_blank" rel="noopener">{ONLINE}</a></span></p>
<div class="stats"><div><strong>{len(cats)}</strong><span>서비스 분야</span></div><div><strong>{len(tops)}</strong><span>대표 제품·체계</span></div><div><strong>{total}</strong><span>구성 기능을 포함한 전체 항목</span></div><div><strong>2016</strong><span>첫 창업</span></div></div>
</div></header>
<main class="wrap">
<section class="intro"><h2>Overview</h2><div><p class="ko">{esc(SITE['intro']['ko'])}</p><p>{esc(SITE['intro']['body'])}</p></div></section>
<section class="toc"><h2>Contents</h2><ol>{toc}</ol></section>
<section class="how"><div><h2>How to verify</h2></div><div><p>항목마다 확인 방법을 적었습니다. 공개 주소가 있는 것은 눌러서, 비공개인 것은 최신 커밋 해시와 화면 공유 시연·읽기 전용 열람으로 확인하실 수 있습니다. 직접 만든 스킬 5개와 에이전트 16개의 정의 파일은 온라인판의 evidence 폴더에서 원문으로 읽을 수 있습니다. 상대 이름·지분·정산율·금액은 싣지 않았습니다.</p><ul>{legend}</ul></div></section>
{sections}
</main>
<footer><div class="wrap"><p><b>{esc(SITE['name'])}</b> · {esc(ct['email'])} · {esc(ct['phone'])}</p><p>이 파일은 온라인 포트폴리오({ONLINE})의 {TODAY} 기준 사본입니다. 최신 내용과 화면·증빙 링크는 온라인판을 보세요.</p></div></footer>
{PRINT_JS}
</body></html>"""

# 공개 전 점검: 사적 용어, 비밀값
priv = []
try:
    for x in json.load(open("tools/.private-terms.json", encoding="utf-8")):
        pat = x["pattern"]
        flags = 0
        if pat.startswith("(?i)"):
            pat, flags = pat[4:], re.I
        priv.append((re.compile(pat, flags), x["msg"]))
except FileNotFoundError:
    pass
text = re.sub(r"data:image/webp;base64,[A-Za-z0-9+/=]+", "", doc)
bad = [(m, re.search(r, text).group(0)) for r, m in priv if re.search(r, text)]
secret = re.findall(r"(sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{20,}|BEGIN (?:RSA |EC )?PRIVATE KEY)", text)
mails = {m for m in re.findall(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)}
assert not bad, bad
assert not secret, secret
assert mails <= {ct["email"]}, mails

os.makedirs(os.path.dirname(OUT), exist_ok=True)
open(OUT, "w", encoding="utf-8").write(doc)
print(OUT, round(os.path.getsize(OUT) / 1024 / 1024, 2), "MB;", len(tops), "대표 항목,", total, "전체 항목")
