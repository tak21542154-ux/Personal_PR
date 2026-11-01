#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
강화판 상세페이지 시안 빌드 — 55464 «레이어드 라운드넥 나시 원피스».

detail_template 의 시각 언어(색·표·가이드)를 그대로 재사용하고,
스킬(detail-page-craft) 구성안의 카피 블록(헤드라인 + POINT 3단)을 얹는다.
= "ESE 기본판 + 카피" 강화판의 첫 프로토타입.

사용법: python -X utf8 _sim_55464_build.py
산출물: _sim_55464/index.html + _sim_55464/img/* (9장)
"""
import os, sys, shutil

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)
sys.path.insert(0, ROOT)
sys.path.insert(0, os.path.join(ROOT, 'scripts'))

from detail_template import (BG, INK, SUB, LINE, ACCENT, BRAND,
                             _esc, _img, _section_title, _measured_table,
                             _spec_table, _notice)

OUT = os.path.join(HERE, '_sim_55464')
IMGDIR = os.path.join(OUT, 'img')
os.makedirs(IMGDIR, exist_ok=True)

SRC = r"<작업 폴더>"
FILES = ['main.jpg', '01.jpg', '03.jpg', '04.jpg', '05.jpg', '06.jpg', '07.jpg', '13.jpg', '14.jpg']
for f in FILES:
    shutil.copy2(os.path.join(SRC, f), os.path.join(IMGDIR, f))

NAME = "[롱/신축성좋음] 레이어드 라운드넥 나시 원피스 여성 데일리원피스 하객룩"

def _sim_strip():
    return ('<div style="background:#fff7e0;border-bottom:1px solid #f0e0b0;padding:10px 16px;'
            'text-align:center;font-size:12px;color:#8a6d1f;">강화판 시안 v1 — ESE 기본판 + 카피 블록'
            ' (미발행 검토본 · 2026-10-17)</div>')

def _brand_head():
    return ('<div style="max-width:860px;margin:0 auto;padding:34px 20px 26px;text-align:center;">'
            '<div style="font-size:12px;letter-spacing:5px;color:%s;font-weight:700;">%s</div>'
            '<div style="font-size:17px;color:%s;margin-top:12px;font-weight:600;'
            'letter-spacing:-0.3px;line-height:1.5;">%s</div></div>'
            % (ACCENT, BRAND, INK, _esc(NAME)))

def _headline(main, sub):
    return ('<div style="max-width:860px;margin:4px auto 26px;padding:0 20px;text-align:center;">'
            '<div style="font-size:23px;font-weight:700;color:%s;line-height:1.5;'
            'letter-spacing:-0.6px;">%s</div>'
            '<div style="font-size:14px;color:%s;margin-top:12px;line-height:1.8;">%s</div></div>'
            % (INK, main, SUB, sub))

def _caption(kicker, title):
    return ('<div style="max-width:860px;margin:40px auto 18px;padding:0 20px;text-align:center;">'
            '<div style="font-size:11px;letter-spacing:3px;color:%s;font-weight:600;">%s</div>'
            '<div style="font-size:18px;color:%s;font-weight:600;margin-top:8px;'
            'letter-spacing:-0.3px;">%s</div>'
            '<div style="width:26px;height:2px;background:%s;margin:14px auto 0;"></div></div>'
            % (SUB, kicker, INK, title, ACCENT))

def _evidence(txt):
    return ('<div style="max-width:860px;margin:-6px auto 18px;padding:0 20px;text-align:center;">'
            '<div style="font-size:12.5px;color:%s;line-height:1.8;">%s</div></div>' % (SUB, txt))

def _img_block(fname, cap):
    return _img('img/' + fname, NAME, cap)

parts = []
parts.append('<!DOCTYPE html><html lang="ko"><head><meta charset="utf-8">'
             '<meta name="viewport" content="width=device-width,initial-scale=1">'
             '<title>시안 — %s</title></head><body style="margin:0;">' % _esc(NAME))
parts.append('<div style="background:%s;padding:0 0 40px;font-family:\'Apple SD Gothic Neo\','
             '\'Malgun Gothic\',sans-serif;-webkit-text-size-adjust:100%%;">' % BG)

# 0) 시안 표시띠
parts.append(_sim_strip())

# 1) 브랜드 헤더
parts.append(_brand_head())

# 2) 헤드라인 (강화 — 카피 블록)
parts.append(_headline('겹쳐 입으면 두 배로,<br>사이드 타이 랩 나시 원피스',
                       '겹쳐도, 혼자서도 — 스판 3% 편한 핏 · FREE 44~66'))

# 3) 히어로 컷
parts.append(_img_block('main.jpg', 600))

# 4) 레이어드 제안
parts.append(_caption('LAYERED LOOK', '셔츠 위에 툭 — 레이어드 제안'))
parts.append(_img_block('01.jpg', 1000))

# 5) POINT 01 — 신축
parts.append(_caption('POINT 01', '하루종일 편한 비결 — 스판 3%'))
parts.append(_evidence('폴리70% · 레이온27% · 스판3% / 원본 검사표: 신축성 있음'))
parts.append(_img_block('04.jpg', 1000))

# 6) POINT 02 — 랩 실루엣
parts.append(_caption('POINT 02', '사이드 타이 랩 — 겹쳐도 살아있는 실루엣'))
parts.append(_evidence('허리단면 37cm · 총장 109cm / 차콜 · 블랙 2색'))
parts.append(_img_block('05.jpg', 1000))
parts.append(_img_block('13.jpg', 1000))

# 7) POINT 03 — 단독/레이어드 양용
parts.append(_caption('POINT 03', '비침 없음·적당한 두께 — 혼자 입어도 든든하게'))
parts.append(_evidence('원본 검사표: 비침 없음 · 안감 없음 · 두께 적당 / 단독세탁 OK'))
parts.append(_img_block('06.jpg', 1000))

# 8) 스타일링 모아보기
parts.append(_caption('STYLING', '데일리부터 하객룩까지'))
parts.append(_img_block('03.jpg', 1000))
parts.append(_img_block('07.jpg', 1000))

# 9) SIZE — 실측표 + 모델 + 원본 표
parts.append(_section_title("SIZE", "실측 사이즈예요"))
parts.append(_measured_table({'어깨': 37, '가슴': 47, '암홀': 22, '허리': 37, '총장': 109}))
parts.append('<div style="max-width:860px;margin:16px auto 6px;padding:0 20px;text-align:center;">'
             '<div style="font-size:12.5px;color:%s;line-height:1.8;">'
             '모델 162cm · Top 44 · FREE(블랙) 착용 — 정사이즈(44~66)</div></div>' % SUB)
parts.append(_img_block('14.jpg', 1000))

# 10) DETAIL — 소재·특성
parts.append(_section_title("DETAIL", "이런 옷이에요"))
parts.append(_spec_table({
    'fabric': '폴리70% · 레이온27% · 스판3%',
    'color': '차콜(Charcoal) · 블랙(Black)',
    '신축성': '있음', '비침': '없음', '안감': '없음', '두께감': '적당',
    '무게': '460g', '세탁': '단독세탁', '제조국': '대한민국',
}))

# 11) GUIDE
parts.append(_section_title("GUIDE", "주문 전에 확인해 주세요"))
parts.append(_notice('danharoo'))

# 12) 브랜드 푸터
parts.append('<div style="max-width:860px;margin:44px auto 0;padding:24px 20px 0;text-align:center;'
             'border-top:1px solid %s;">'
             '<div style="font-size:11px;letter-spacing:4px;color:%s;font-weight:700;">%s</div>'
             '<div style="font-size:11.5px;color:%s;margin-top:8px;line-height:1.8;">'
             '오늘 하루가 조금 더 산뜻해지길 바라요<br>좋은 옷을 합리적인 가격에 전해드릴게요!</div>'
             '</div>' % (LINE, ACCENT, BRAND, SUB))

parts.append('</div></body></html>')

html = "".join(parts)
out_file = os.path.join(OUT, 'index.html')
with open(out_file, 'w', encoding='utf-8') as f:
    f.write(html)
print('저장:', out_file, '(%d bytes)' % len(html.encode('utf-8')))
print('이미지:', len(FILES), '장 →', IMGDIR)
