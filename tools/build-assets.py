# 후보 이미지(_s/cand)에서 공개해도 되는 것만 골라 크기를 줄여 assets/img 에 넣고 zz_assets.js 를 만든다.
# 사용: python -X utf8 tools/build-assets.py   (저장소 루트에서)
# 고른 기준: 고객·직원 정보, 계정, 가격표, 수익·수익률, 내부 주소가 보이지 않는 이미지만.
import json
import os
from PIL import Image

C = "_s/cand"
O = "assets/img"


def prep(src, dst, maxw=None, q=82, crop=None):
    im = Image.open(os.path.join(C, src))
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))  # 투명 배경은 흰색으로 깐다
        im = Image.alpha_composite(bg, im)
    im = im.convert("RGB")
    if crop:
        im = im.crop(crop)
    if maxw and im.width > maxw:
        r = maxw / im.width
        im = im.resize((maxw, int(im.height * r)), Image.LANCZOS)
    p = os.path.join(O, dst)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    if dst.lower().endswith((".jpg", ".jpeg")):
        im.save(p, "JPEG", quality=q, optimize=True, progressive=True)
    else:
        im.save(p, "PNG", optimize=True)
    return "assets/img/" + dst


A = {}


def add(i, **kw):
    A.setdefault(i, {}).update(kw)


def shots(i, lst):
    A.setdefault(i, {}).setdefault("shots", []).extend(lst)


# 핀큐AI
add("finqai", img=prep("finqai/web-finqai-php.png", "finqai/landing.png", maxw=1280),
    links=[["공개 홈페이지·랜딩", "https://xn--ai-ro2im86dohhp4oltbovl.com/finqai.php"]])
fl = prep("finqai/flow-userflow-spec-260521.png", "finqai/01-userflow.png", maxw=1500)
p2 = prep("finqai/manual-00-broker-onboarding.png", "finqai/02-broker-onboarding.png", maxw=1100)
p3 = prep("finqai/step-instance-add.png", "finqai/03-instance-add.png", maxw=520)
p4 = prep("finqai/step-menu-grid.png", "finqai/04-menu.png", maxw=520)
p5 = prep("finqai/step-reserved-register.png", "finqai/05-reserved-register.png", maxw=520)
p6 = prep("finqai/step-reserved-trade.png", "finqai/06-reserved-trade.png", maxw=520)
p7 = prep("finqai/store-03-system.png", "finqai/07-strategy-settings.png", maxw=520)
shots("finqai", [
    [fl, "화면 흐름 설계: 온보딩, 증권사 연결, 트레이딩, 예약 매매, AI, 알림, 어드민"],
    [p2, "증권사 연결 첫 화면"],
    [p3, "인스턴스 추가: 자산군과 증권사 선택"],
    [p4, "AI·모니터링 메뉴"],
    [p5, "예약 매매 등록: 사전 동의한 조건 입력"],
    [p6, "예약 매매 목록과 실행 상태"],
    [p7, "매수 전략 설정"],
])
shots("trading-engine", [
    [p5, "조건과 거래소(KRX·NXT·자동 라우팅)를 고르는 예약 매매 등록"],
    [p6, "등록한 조건의 실행 상태와 정지 사유 안내"],
])
add("finq-ai-features", img=prep("finq-ai-features/menu-grid-ai-features.png", "finq-ai-features/menu.png", maxw=520))

# 알파시스템
add("alpha-service", img=prep("alpha-service/renewal-p1.png", "alpha-service/renewal-cover.png", maxw=1000),
    links=[["한국AI투자센터 홈페이지", "https://xn--ai-ro2im86dohhp4oltbovl.com/"]])
shots("alpha-service", [
    [prep("alpha-service/guide-pc-p9.png", "alpha-service/guide-login.png", maxw=760), "2021 PC 사용 가이드: 로그인 단계"],
    [prep("alpha-service/guide-pc-p11.png", "alpha-service/guide-settings.png", maxw=760), "2021 PC 사용 가이드: 매매 환경 설정"],
])

# 메아리 (대표 이미지는 기존 화면 캡처 유지)
add("meari", links=[["랜딩 페이지 (서비스 일시 중단 중)", "https://meari.xn--ai-ro2im86dohhp4oltbovl.com/"]])

# 복구온
add("bokguon", img=prep("bokguon/demo-landing.png", "bokguon/landing.png", maxw=1280))
shots("bokguon", [
    [prep("bokguon/demo-admin-1.png", "bokguon/01-admin-dashboard.png", maxw=1200), "관리자 대시보드(데모 데이터)"],
    [prep("bokguon/demo-admin-2.png", "bokguon/02-site-map.jpg", maxw=1200), "현장 지도: 시군구별 사건 위치"],
    [prep("bokguon/demo-admin-3.png", "bokguon/03-notice-form.png", maxw=1200), "공고·사건 등록 폼"],
    [prep("bokguon/demo-insurer-home.png", "bokguon/04-insurer-home.png", maxw=1200), "보험사 포털 홈"],
    [prep("bokguon/demo-insurer-2.png", "bokguon/05-insurer-case.png", maxw=1200), "보험사 사건 등록"],
])

# 모빌리티 ERP
add("mobility-erp", img=prep("mobility-erp/demo-vehicle-status.png", "mobility-erp/vehicles.png", maxw=1280))
shots("mobility-erp", [
    [prep("mobility-erp/app-0.png", "mobility-erp/01-login.png", maxw=1200), "로그인 화면"],
    [prep("mobility-erp/demo-vehicle-status.png", "mobility-erp/02-vehicle-status.png", maxw=1200), "차량 대기 현황(데모 데이터)"],
    [prep("mobility-erp/demo-control.png", "mobility-erp/03-control-map.jpg", maxw=1200), "차량 관제센터 지도"],
    [prep("mobility-erp/demo-schedules.png", "mobility-erp/04-schedules.png", maxw=1200), "차량별 스케줄 타임라인"],
    [prep("mobility-erp/public-0-nophone-crop.png", "mobility-erp/05-rental-search.png", maxw=1200), "공개 렌터카 가격 비교 화면"],
])

# GRID 탁송
gw = prep("grid-dispatch/wireframe-v2-driver-flow.png", "grid-dispatch/driver-wireframe.png", maxw=810)
add("grid-dispatch", img=gw)
shots("grid-dispatch", [[gw, "기사용 모바일 웹 와이어프레임 v2: 출발 전 사진에서 도착 사진까지"]])

# 그 밖의 대표 이미지
add("weekend-rent", img=prep("weekend-rent/main-banner-pc.png", "weekend-rent/banner.jpg", maxw=1200, q=86))
add("toktokstock", img=prep("toktokstock/edu-chart-cover.jpg", "toktokstock/edu-chart.jpg", maxw=1000))
add("design-assets", img=prep("design-assets/event-thumb-004.png", "design-assets/setup-guide-thumb.jpg", maxw=1200, q=84))
add("company-intro-ir", img=prep("company-intro-ir/ir-v3-p01-cover.png", "company-intro-ir/cover.png", maxw=1280))
shots("company-intro-ir", [[prep("company-intro-ir/ir-v3-p21-process.png", "company-intro-ir/center-process.png", maxw=1200), "센터 설립 프로세스 슬라이드"]])
add("control-console", img=prep("control-console/console-live-0.png", "control-console/console.png", maxw=1280))
add("parkcare", img=prep("parkcare/live-top.png", "parkcare/hero.png", crop=(90, 130, 730, 510), maxw=800),
    links=[["공개 페이지 (프로토타입 데모)", "https://tak21542154-ux.github.io/portfolio/parkcare.html"]])
add("personal-pr-site", links=[["이 사이트", "https://tak21542154-ux.github.io/Personal_PR/"], ["GitHub 저장소", "https://github.com/tak21542154-ux/Personal_PR"]])

# 생성 썸네일에 얹을 로고
lg = prep("alpha-service/logo-2s2.png", "logos/2s2.png", maxw=400)
kai = prep("alpha-service/logo-kai-2.jpg", "logos/kai.jpg", maxw=700)
add("ese", logo=lg)
for i in ["marketing-annual", "sales-training", "video-pipeline", "operations-docs-2021"]:
    add(i, logo=kai)

head = """/* 대표 이미지(로고·화면), 바로가기 링크, 단계별 화면을 항목 id 별로 붙입니다.
   img: 카드·상세 상단 이미지(없으면 tools/make-thumbs.mjs 가 만든 생성 썸네일)
   logo: 생성 썸네일에 얹을 로고(make-thumbs 전용)
   links: [[이름, https 주소]]  ·  shots: [[이미지 경로, 설명]] — 보여줄 수 있는 것만. 앱 화면은 격리 DB의 데모 데이터입니다.
   공개 전 점검: 고객·직원 정보, 계정, 가격표, 수익·수익률, 내부 주소가 보이지 않는 것만 씁니다.
   (tools/build-assets.py 가 만든 뒤 사람이 고쳐도 됩니다) */
window.SITE.assets = """
with open("assets/js/works/zz_assets.js", "w", encoding="utf-8") as f:
    f.write(head + json.dumps(A, ensure_ascii=False, indent=2) + ";\n")

total = 0
for dp, _, fs in os.walk(O):
    if dp.replace("\\", "/").startswith("assets/img/thumb"):
        continue
    for fn in fs:
        total += os.path.getsize(os.path.join(dp, fn))
print("assets", total // 1024, "KB;", len(A), "items")
