# 공개 화면 이미지에서 실제 회사명이 보이는 자리(사이드바 머리글·하단 저작권 줄)를 일반 문구로 덮는다.
# 사용: python -X utf8 tools/mask-brand.py   (저장소 루트에서, 여러 번 실행해도 결과가 같다)
import os
from PIL import Image, ImageDraw, ImageFont

D = "assets/img/mobility-erp"
FONT = "C:/Windows/Fonts/malgunbd.ttf"
FONT_R = "C:/Windows/Fonts/malgun.ttf"
FILES = ["vehicles.png", "02-vehicle-status.png", "03-control-map.jpg", "04-schedules.png"]


def mask(path):
    im = Image.open(path).convert("RGB")
    w, h = im.size
    s = w / 1280.0
    side = int(225 * s)
    bg = im.getpixel((int(10 * s), int(90 * s)))  # 사이드바 바탕색
    d = ImageDraw.Draw(im)
    # 머리글: 회사명·직함 → 제품명
    d.rectangle([0, 0, side, int(62 * s)], fill=bg)
    d.text((int(18 * s), int(14 * s)), "Mobility ERP", font=ImageFont.truetype(FONT, int(15 * s)), fill=(255, 255, 255))
    d.text((int(18 * s), int(38 * s)), "관리자", font=ImageFont.truetype(FONT_R, int(10 * s)), fill=(150, 156, 164))
    # 하단: 고객센터·저작권 줄
    d.rectangle([0, int(748 * s), side, min(h, int(792 * s))], fill=bg)
    if path.lower().endswith((".jpg", ".jpeg")):
        im.save(path, "JPEG", quality=88, optimize=True, progressive=True)
    else:
        im.save(path, "PNG", optimize=True)


def mask_admin(path):
    # 복구온 콘솔 사이드바 머리글 아래 작은 문구("... ADMIN" 앞의 회사명)를 ADMIN 으로 바꾼다
    im = Image.open(path).convert("RGB")
    s = im.width / 1200.0
    bg = im.getpixel((int(150 * s), int(45 * s)))
    d = ImageDraw.Draw(im)
    d.rectangle([int(14 * s), int(38 * s), int(130 * s), int(54 * s)], fill=bg)
    d.text((int(18 * s), int(39 * s)), "A D M I N", font=ImageFont.truetype(FONT, int(9 * s)), fill=(110, 120, 135))
    if path.lower().endswith((".jpg", ".jpeg")):
        im.save(path, "JPEG", quality=88, optimize=True, progressive=True)
    else:
        im.save(path, "PNG", optimize=True)


for f in FILES:
    p = os.path.join(D, f)
    if os.path.exists(p):
        mask(p)
        print("masked", p)

for f in ["01-admin-dashboard.png", "02-site-map.jpg", "03-notice-form.png"]:
    p = os.path.join("assets/img/bokguon", f)
    if os.path.exists(p):
        mask_admin(p)
        print("masked", p)
