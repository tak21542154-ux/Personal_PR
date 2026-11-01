# 문서 표지·대표 쪽 후보(_s/cand2)와 실제 화면을 골라 가리고, 크기를 줄여 assets/img/<id>/ 에 넣는다.
# 가리는 곳: 회사명·상대 이름·숫자가 든 자리. 결과는 눈으로 확인한 뒤 zz_assets2.js 에 연결한다.
# 사용: python -X utf8 tools/build-covers.py   (저장소 루트에서, 먼저 tools/render-covers.py 로 후보를 뽑아 둔다)
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

C = "_s/cand2"
O = "assets/img"
FONT = "C:/Windows/Fonts/malgunbd.ttf"


def load(p):
    return Image.open(p).convert("RGB")


def save(im, iid, name, maxw=1280):
    if im.width > maxw:
        im = im.resize((maxw, int(im.height * maxw / im.width)), Image.LANCZOS)
    d = os.path.join(O, iid)
    os.makedirs(d, exist_ok=True)
    p = os.path.join(d, name)
    if name.lower().endswith((".jpg", ".jpeg")):
        im.save(p, "JPEG", quality=86, optimize=True, progressive=True)
    else:
        im.save(p, "PNG", optimize=True)
    return p.replace("\\", "/")


def fill(im, box, color=None):
    """상자 안을 주변 바탕색으로 덮는다."""
    x0, y0, x1, y1 = [int(v) for v in box]
    if color is None:
        color = im.getpixel((max(0, x0 - 4), max(0, y0 - 4)))
    ImageDraw.Draw(im).rectangle([x0, y0, x1, y1], fill=color)


def shadow_paste(base, im, xy, blur=14, off=(0, 8), alpha=90):
    sh = Image.new("RGBA", base.size, (0, 0, 0, 0))
    ImageDraw.Draw(sh).rectangle([xy[0] + off[0], xy[1] + off[1], xy[0] + im.width + off[0], xy[1] + im.height + off[1]], fill=(20, 30, 40, alpha))
    sh = sh.filter(ImageFilter.GaussianBlur(blur))
    base.paste(sh, (0, 0), sh)
    base.paste(im, xy)


made = {}

# 마케팅 연간 운영: 2021년 이벤트 포스터 여섯 장(설명 글은 빼고 포스터만)
a = load(f"{C}/marketing-annual/s1/p2.png")
b = load(f"{C}/marketing-annual/s1/p3.png")
def posters(im, top, bot):
    return im.crop((60, top, im.width - 60, bot))
ra, rb = posters(a, 84, 648), posters(b, 84, 648)  # 포스터 줄까지만(아래 캡션의 참여 수치는 뺀다)
rb = rb.crop((0, 0, rb.width, 452))
M = Image.new("RGB", (ra.width, ra.height + rb.height + 20), (244, 246, 248))
fill(ra, (770, 440, ra.width, ra.height), color=(255, 255, 255))  # 짧은 포스터 아래 캡션(참여 수치)
fill(rb, (95, 321, 335, 392), color=(255, 255, 255))  # 당첨자 표(마스킹된 아이디) — 두 번째 줄 8월 포스터
rb = rb.crop((0, 0, rb.width, 452))  # 포스터 아래 캡션은 잘라낸다
M.paste(ra, (0, 0)); M.paste(rb, (0, ra.height + 20))
made["marketing-annual"] = save(M, "marketing-annual", "events-2021.png")

# 유튜브: 개선안 제안서의 컨셉·타겟 설정 쪽
y = load(f"{C}/youtube-channel/s0/p3.png")
made["youtube-channel"] = save(y, "youtube-channel", "improvement-proposal.png")

# 운영·관리 문서: 업무 매뉴얼 표지와 조직도 쪽
made["operations-docs-2021"] = save(load(f"{C}/operations-docs-2021/s0/p1.png"), "operations-docs-2021", "manual-cover.png")
save(load(f"{C}/operations-docs-2021/s0/p2.png"), "operations-docs-2021", "manual-contents.png")

# 영업 교육: 전사 집체 교육 표지와 커리큘럼
made["sales-training"] = save(load(f"{C}/sales-training/s0/p1.png"), "sales-training", "training-cover.png")
save(load(f"{C}/sales-training/s0/p2.png"), "sales-training", "training-curriculum.png")

# 영상 제작: 모션 그래픽 콘티(스토리보드) 쪽 — 직원 이름이 든 쪽은 쓰지 않는다
v = load(f"{C}/video-pipeline/s0/p1.png")
fill(v, (0, 140, v.width, 172), color=(255, 255, 255))  # 외부 참고 링크 줄은 가린다
made["video-pipeline"] = save(v, "video-pipeline", "storyboard.png")

# 신규 브랜드·서비스 기획: 기획안 표지와 개요 쪽
made["brand-launch-plans"] = save(load(f"{C}/brand-launch-plans/s0/p1.png"), "brand-launch-plans", "plan-cover.png")
save(load(f"{C}/brand-launch-plans/s0/p2.png"), "brand-launch-plans", "plan-pitch.png")

# 전략사업실 제안서: 설계사 세미나 덱의 가치 제안·솔루션 쪽을 겹쳐 놓은 모음(바닥글의 회사명·지점명은 가림)
def clean_slide(p):
    im = load(p)
    w, h = im.size
    fill(im, (0, h * 0.955, w * 0.80, h), color=im.getpixel((12, int(h * 0.97))))
    return im
s3 = clean_slide(f"{C}/strategy-office-docs/s2/p3.png")
s5 = clean_slide(f"{C}/strategy-office-docs/s2/p5.png")
W, H = 1280, 800
D = Image.new("RGB", (W, H), (231, 235, 239))
sw = 760
a1 = s5.resize((sw, int(s5.height * sw / s5.width)), Image.LANCZOS)
a2 = s3.resize((sw, int(s3.height * sw / s3.width)), Image.LANCZOS)
shadow_paste(D, a1, (W - sw - 60, 70))
shadow_paste(D, a2, (60, H - a2.height - 70))
made["strategy-office-docs"] = save(D, "strategy-office-docs", "proposal-deck.png")
save(s3, "strategy-office-docs", "seminar-value.png")
save(s5, "strategy-office-docs", "seminar-solution.png")


# 파크케어: 프로토타입 페이지 첫 화면(회사명은 뺀 사본으로 캡처한 것)
if os.path.exists("_s/pc/hero.png"):
    made["parkcare"] = save(load("_s/pc/hero.png"), "parkcare", "hero.png")

# 시스템 트레이딩 엔진: 예약 매매 화면 세 장을 나란히
phones = [load(f"{O}/finqai/{n}") for n in ["05-reserved-register.png", "06-reserved-trade.png", "07-strategy-settings.png"]]
T = Image.new("RGB", (1280, 800), (226, 231, 236))
ph = 680
x = 160
for im in phones:
    im2 = im.resize((int(im.width * ph / im.height), ph), Image.LANCZOS)
    shadow_paste(T, im2, (x, 60), blur=16, off=(0, 10), alpha=110)
    x += im2.width + 60
made["trading-engine"] = save(T, "trading-engine", "reserved-trade.png")

# 핀큐AI 개발 체계: 화면 흐름 설계도의 한가운데
fl = load(f"{O}/finqai/01-userflow.png")
made["finq-engineering"] = save(fl.crop((150, 560, 1500, 1420)), "finq-engineering", "flow-design.png")

for k, v in made.items():
    print(k, "→", v)
