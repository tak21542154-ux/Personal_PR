# evidence/ 의 공개 원문과 볼트 링크 구조로 '실제 내용' 썸네일 3장을 만든다.
#  - my-skills: 스킬 정의 파일을 편집기 모양으로
#  - agent-corps: 에이전트 정의 파일 16개를 카드 격자로
#  - obsidian-vault: 노트 사이 링크 구조(이름 없이 점과 선만)
# 사용: python -X utf8 tools/render-panels.py   (저장소 루트에서; Microsoft Edge 필요)
import html
import math
import os
import re
import subprocess

import networkx as nx
from PIL import Image, ImageDraw, ImageFilter

ROOT = os.getcwd().replace("\\", "/")
EDGE = next(p for p in ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"] if os.path.exists(p))
TMP = "_s/panels"
os.makedirs(TMP, exist_ok=True)
VAULT = os.path.expanduser("~/Desktop/agent-workspace/집PC")


def shot(page_html, out, w=1280, h=800):
    tmp = f"{ROOT}/{TMP}/_p.html"
    open(tmp, "w", encoding="utf-8").write(page_html)
    dst = f"{ROOT}/{out}"
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    subprocess.run([EDGE, "--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", f"--window-size={w},{h}", "--virtual-time-budget=4000", f"--screenshot={dst}", "file:///" + tmp], capture_output=True, timeout=120)
    os.remove(tmp)
    print("→", out, os.path.getsize(dst) // 1024, "KB")


BASE_CSS = """*{box-sizing:border-box;margin:0}html,body{width:1280px;height:800px;overflow:hidden}body{font-family:"Segoe UI","Malgun Gothic",sans-serif}"""

# 1) 스킬 정의 파일 편집기
skill = open("evidence/skills/detail-page-craft/SKILL.md", encoding="utf-8").read().splitlines()
body = skill[:34]
def md_line(i, ln):
    e = html.escape(ln) or "&nbsp;"
    cls = "t"
    if ln.startswith("---"): cls = "fm"
    elif ln.startswith("# "): cls = "h1"
    elif ln.startswith("## "): cls = "h2"
    elif re.match(r"^(name|description|tools|model):", ln): cls = "kv"
    elif ln.startswith(">"): cls = "q"
    elif ln.startswith(("- ", "* ")) or re.match(r"^\d+\.", ln): cls = "li"
    return f'<div class="ln"><i>{i + 1}</i><span class="{cls}">{e}</span></div>'
code = "".join(md_line(i, l) for i, l in enumerate(body))
tree = [("detail-page-craft", True, 0), ("SKILL.md", False, 1), ("templates", True, 1), ("examples", True, 1), ("session-wrap", True, 0), ("daily-wrap", True, 0), ("second-brain", True, 0), ("jd-analysis", True, 0)]
tr = "".join(f'<div class="tr{" on" if n == "SKILL.md" else ""}" style="padding-left:{14 + d * 16}px">{"▸ " if dir_ else "· "}{n}</div>' for n, dir_, d in tree)
page = f"""<!doctype html><meta charset="utf-8"><style>{BASE_CSS}
body{{background:#e7ebef;color:#24292f}}
.win{{position:absolute;inset:36px 48px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 22px 44px rgba(20,30,40,.14),0 2px 6px rgba(20,30,40,.08);display:grid;grid-template-columns:260px 1fr;grid-template-rows:44px 1fr}}
.bar{{grid-column:1/3;background:#f6f8fa;border-bottom:1px solid #e3e7ea;display:flex;align-items:center;gap:8px;padding:0 16px;font-size:13px;color:#5b636b}}
.bar b{{width:11px;height:11px;border-radius:50%;background:#cfd6dc;display:block}}.bar span{{margin-left:10px;letter-spacing:.06em}}
.side{{background:#f6f8fa;padding:14px 0;font-size:14px;color:#5b636b;border-right:1px solid #e3e7ea}}
.tr{{padding:6px 14px}}.tr.on{{background:#eaeef2;color:#111417;border-left:3px solid #8c2346}}
.code{{padding:14px 0;font:15px/1.62 "Consolas","Malgun Gothic",monospace;overflow:hidden}}
.ln{{display:flex;white-space:pre;padding-right:24px}}.ln i{{flex:0 0 52px;text-align:right;padding-right:18px;color:#9aa3ab;font-style:normal}}
.ln span{{overflow:hidden;text-overflow:clip}}
.fm{{color:#8c959f}}.kv{{color:#0550ae}}.h1{{color:#8c2346;font-weight:700}}.h2{{color:#6639ba;font-weight:700}}.q{{color:#6e7781}}.li{{color:#24292f}}.t{{color:#1f2328}}
</style><div class="win"><div class="bar"><b></b><b></b><b></b><span>SKILL.md — detail-page-craft</span></div><div class="side">{tr}</div><div class="code">{code}</div></div>"""
shot(page, "assets/img/my-skills/skill-file.png")

# 2) 에이전트 정의 파일 카드 격자
cards = []
for fn in sorted(os.listdir("evidence/agents")):
    t = open(f"evidence/agents/{fn}", encoding="utf-8").read()
    fm = dict(re.findall(r"^(\w+):\s*(.*)$", t.split("---")[1], flags=re.M))
    desc = fm.get("description", "")
    ko = desc.split(" — ")[0].strip()
    role = re.split(r"[,(]", desc.split(" — ")[1].split(".")[0])[0].strip() if " — " in desc else ""
    tools = [x.strip() for x in fm.get("tools", "").split(",") if x.strip()][:4]
    cards.append((ko, role, tools, fm.get("model", "")))
cells = "".join(
    f'<div class="c"><div class="top"><b>{html.escape(k)}</b><em>{html.escape(m)}</em></div><p>{html.escape(r[:26])}</p><div class="tl">' + "".join(f"<span>{html.escape(x)}</span>" for x in tl[:3]) + "</div></div>"
    for k, r, tl, m in cards
)
page = f"""<!doctype html><meta charset="utf-8"><style>{BASE_CSS}
body{{background:#e7ebef}}
.win{{position:absolute;inset:40px 48px;background:#fff;border-radius:16px;box-shadow:0 22px 44px rgba(20,30,40,.14),0 2px 6px rgba(20,30,40,.08);overflow:hidden}}
.bar{{height:46px;background:#f6f8fa;border-bottom:1px solid #e3e7ea;display:flex;align-items:center;gap:7px;padding:0 18px}}
.bar i{{width:10px;height:10px;border-radius:50%;background:#cfd6dc;display:block}}.bar b{{margin-left:12px;font:600 12px "Segoe UI";letter-spacing:.14em;color:#5b636b}}
.g{{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:18px}}
.c{{border:1px solid #e3e7ea;border-radius:12px;padding:12px 14px;background:#fbfcfd;height:148px;display:flex;flex-direction:column;gap:6px}}
.top{{display:flex;justify-content:space-between;align-items:baseline}}.top b{{font-size:15px;color:#111417}}.top em{{font-style:normal;font-size:11px;color:#8c2346;border:1px solid #8c2346;border-radius:9px;padding:1px 7px}}
.c p{{font-size:12.5px;color:#5b636b;line-height:1.45;flex:1}}.tl{{display:flex;flex-wrap:wrap;gap:5px}}.tl span{{font:11px "Consolas";background:#eef1f4;border-radius:5px;padding:2px 6px;color:#3b4148}}
</style><div class="win"><div class="bar"><i></i><i></i><i></i><b>AGENTS / DEFINITION FILES</b></div><div class="g">{cells}</div></div>"""
shot(page, "assets/img/agent-corps/agent-cards.png")

# 3) 볼트의 링크 구조(이름 없이)
notes = {}
for dp, dn, fn in os.walk(VAULT):
    if ".obsidian" in dp:
        continue
    for f in fn:
        if f.endswith(".md"):
            p = os.path.join(dp, f)
            top = os.path.relpath(dp, VAULT).split(os.sep)[0]
            notes[os.path.splitext(f)[0]] = (p, top)
G = nx.Graph()
for name, (p, top) in notes.items():
    G.add_node(name, top=top)
for name, (p, top) in notes.items():
    try:
        txt = open(p, encoding="utf-8", errors="ignore").read()
    except OSError:
        continue
    for m in re.findall(r"\[\[([^\]|#]+)", txt):
        m = m.strip()
        if m in notes and m != name:
            G.add_edge(name, m)
comp = max(nx.connected_components(G), key=len)
H = G.subgraph(comp).copy()
pos = nx.spring_layout(H, seed=7, k=0.9 / math.sqrt(max(1, len(H))), iterations=160)
xs = [p[0] for p in pos.values()]; ys = [p[1] for p in pos.values()]
W, Hh, S = 1280, 800, 2
img = Image.new("RGB", (W * S, Hh * S), (255, 255, 255))
d = ImageDraw.Draw(img)
def P(n):
    x = (pos[n][0] - min(xs)) / (max(xs) - min(xs)); y = (pos[n][1] - min(ys)) / (max(ys) - min(ys))
    return 70 * S + x * (W - 140) * S, 60 * S + y * (Hh - 120) * S
for a, b in H.edges():
    d.line([P(a), P(b)], fill=(222, 227, 232), width=S)
tops = sorted({H.nodes[n]["top"] for n in H})
pal = [(140, 35, 70), (214, 110, 40), (120, 90, 200), (60, 120, 200), (40, 160, 90), (200, 150, 20), (120, 130, 142)]
col = {t: pal[i % len(pal)] for i, t in enumerate(tops)}
for n in sorted(H, key=lambda x: H.degree(x)):
    r = (2.2 + math.sqrt(H.degree(n)) * 1.6) * S
    x, y = P(n)
    d.ellipse([x - r, y - r, x + r, y + r], fill=col[H.nodes[n]["top"]])
img = img.resize((W, Hh), Image.LANCZOS)
os.makedirs("assets/img/obsidian-vault", exist_ok=True)
img.save("assets/img/obsidian-vault/graph.png", optimize=True)
print("→ assets/img/obsidian-vault/graph.png", len(H), "notes,", H.number_of_edges(), "links")

# 4) 외부 스킬 스택: 설치된 스킬 이름(직접 만든 것 제외)을 종류별 색으로
import json
own = {"session-wrap", "daily-wrap", "second-brain", "detail-page-craft", "jd-analysis"}
names = sorted(n for n in os.listdir(os.path.expanduser("~/.claude/skills")) if n not in own and not n.startswith(("_", "synced")) and os.path.isdir(os.path.join(os.path.expanduser("~/.claude/skills"), n)))
def kind(n):
    return "aws" if n.startswith(("aws-", "amazon-", "launch-with-aws", "signing-in-to-aws")) else "tool"
chips = "".join(f'<span class="{kind(n)}">{html.escape(n)}</span>' for n in names)
page = f"""<!doctype html><meta charset="utf-8"><style>{BASE_CSS}
body{{background:#e7ebef}}
.win{{position:absolute;inset:40px 48px;background:#fff;border-radius:16px;box-shadow:0 22px 44px rgba(20,30,40,.14),0 2px 6px rgba(20,30,40,.08);overflow:hidden}}
.bar{{height:46px;background:#f6f8fa;border-bottom:1px solid #e3e7ea;display:flex;align-items:center;gap:7px;padding:0 18px}}
.bar i{{width:10px;height:10px;border-radius:50%;background:#cfd6dc;display:block}}.bar b{{margin-left:12px;font:600 12px "Segoe UI";letter-spacing:.14em;color:#5b636b}}
.lg{{margin-left:auto;font:12px "Malgun Gothic";color:#5b636b;display:flex;gap:14px}}.lg u{{text-decoration:none}}.lg u:before{{content:"";display:inline-block;width:10px;height:10px;border-radius:3px;margin-right:6px;vertical-align:-1px;background:#111417}}.lg u.a:before{{background:#c9822b}}
.g{{display:flex;flex-wrap:wrap;gap:10px;padding:22px;align-content:flex-start}}
.g span{{font:15px "Consolas","Segoe UI";padding:9px 14px;border-radius:9px;background:#eef1f4;color:#3b4148;border:1px solid #e3e7ea}}
.g span.aws{{background:#fbf1e3;border-color:#efd9b6;color:#7a4a0e}}
</style><div class="win"><div class="bar"><i></i><i></i><i></i><b>INSTALLED SKILL SETS</b><div class="lg"><u>gstack · 도구</u><u class="a">AWS</u></div></div><div class="g">{chips}</div></div>"""
shot(page, "assets/img/external-skill-stacks/installed-skills.png")

# 5) 에이전트 환경: 훅 이벤트 지도(이벤트 이름과 개수만, 명령 내용은 싣지 않음)
st = json.load(open(os.path.expanduser("~/.claude/settings.json"), encoding="utf-8"))
ev = st.get("hooks", {})
cells = "".join(f'<div class="e"><b>{html.escape(k)}</b><em>×{len(v)}</em></div>' for k, v in ev.items())
page = f"""<!doctype html><meta charset="utf-8"><style>{BASE_CSS}
body{{background:#e7ebef;color:#111417}}
.win{{position:absolute;inset:40px 48px;background:#fff;border-radius:14px;overflow:hidden;box-shadow:0 22px 44px rgba(20,30,40,.14),0 2px 6px rgba(20,30,40,.08)}}
.bar{{height:46px;background:#f6f8fa;border-bottom:1px solid #e3e7ea;display:flex;align-items:center;gap:8px;padding:0 18px;font-size:13px;color:#5b636b}}.bar b{{width:11px;height:11px;border-radius:50%;background:#cfd6dc;display:block}}.bar span{{margin-left:10px;letter-spacing:.1em}}
.t{{padding:22px 26px 6px;font:600 15px "Segoe UI";color:#5b636b;letter-spacing:.06em}}
.g{{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;padding:12px 26px 26px}}
.e{{background:#fbfcfd;border:1px solid #e3e7ea;border-radius:12px;padding:40px 20px;display:flex;justify-content:space-between;align-items:baseline}}
.e b{{font:17px "Consolas";color:#111417}}.e em{{font-style:normal;font:700 19px "Consolas";color:#8c2346}}
</style><div class="win"><div class="bar"><b></b><b></b><b></b><span>settings.json — hooks</span></div><div class="t">HOOK EVENTS · {len(ev)}</div><div class="g">{cells}</div></div>"""
shot(page, "assets/img/claude-setup/hook-events.png")
