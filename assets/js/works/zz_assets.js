/* 대표 이미지(로고·화면), 바로가기 링크, 단계별 화면을 항목 id 별로 붙입니다.
   img: 카드·상세 상단 이미지(없으면 tools/make-thumbs.mjs 가 만든 생성 썸네일)
   logo: 생성 썸네일에 얹을 로고(make-thumbs 전용)
   links: [[이름, https 주소]]  ·  shots: [[이미지 경로, 설명]] — 보여줄 수 있는 것만. 앱 화면은 격리 DB의 데모 데이터입니다.
   공개 전 점검: 고객·직원 정보, 계정, 가격표, 수익·수익률, 내부 주소가 보이지 않는 것만 씁니다.
   (tools/build-assets.py 가 만든 뒤 사람이 고쳐도 됩니다) */
window.SITE.assets = {
  "youtube-channel": {
    "logo": "assets/img/logos/kai.jpg"
  },
  "finqai": {
    "img": "assets/img/finqai/landing.png",
    "links": [
      [
        "공개 홈페이지·랜딩",
        "https://xn--ai-ro2im86dohhp4oltbovl.com/finqai.php"
      ]
    ],
    "shots": [
      [
        "assets/img/finqai/01-userflow.png",
        "화면 흐름 설계: 온보딩, 증권사 연결, 트레이딩, 예약 매매, AI, 알림, 어드민"
      ],
      [
        "assets/img/finqai/02-broker-onboarding.png",
        "증권사 연결 첫 화면"
      ],
      [
        "assets/img/finqai/03-instance-add.png",
        "인스턴스 추가: 자산군과 증권사 선택"
      ],
      [
        "assets/img/finqai/04-menu.png",
        "AI·모니터링 메뉴"
      ],
      [
        "assets/img/finqai/05-reserved-register.png",
        "예약 매매 등록: 사전 동의한 조건 입력"
      ],
      [
        "assets/img/finqai/06-reserved-trade.png",
        "예약 매매 목록과 실행 상태"
      ],
      [
        "assets/img/finqai/07-strategy-settings.png",
        "매수 전략 설정"
      ]
    ]
  },
  "trading-engine": {
    "shots": [
      [
        "assets/img/finqai/05-reserved-register.png",
        "조건과 거래소(KRX·NXT·자동 라우팅)를 고르는 예약 매매 등록"
      ],
      [
        "assets/img/finqai/06-reserved-trade.png",
        "등록한 조건의 실행 상태와 정지 사유 안내"
      ]
    ]
  },
  "finq-ai-features": {
    "img": "assets/img/finq-ai-features/menu.png"
  },
  "alpha-service": {
    "img": "assets/img/alpha-service/renewal-cover.png",
    "links": [
      [
        "한국AI투자센터 홈페이지",
        "https://xn--ai-ro2im86dohhp4oltbovl.com/"
      ]
    ],
    "shots": [
      [
        "assets/img/alpha-service/guide-login.png",
        "2021 PC 사용 가이드: 로그인 단계"
      ],
      [
        "assets/img/alpha-service/guide-settings.png",
        "2021 PC 사용 가이드: 매매 환경 설정"
      ]
    ]
  },
  "meari": {
    "links": [
      [
        "랜딩 페이지 (서비스 일시 중단 중)",
        "https://meari.xn--ai-ro2im86dohhp4oltbovl.com/"
      ]
    ]
  },
  "bokguon": {
    "img": "assets/img/bokguon/landing.png",
    "shots": [
      [
        "assets/img/bokguon/01-admin-dashboard.png",
        "관리자 대시보드(데모 데이터)"
      ],
      [
        "assets/img/bokguon/02-site-map.jpg",
        "현장 지도: 시군구별 사건 위치"
      ],
      [
        "assets/img/bokguon/03-notice-form.png",
        "공고·사건 등록 폼"
      ],
      [
        "assets/img/bokguon/04-insurer-home.png",
        "보험사 포털 홈"
      ],
      [
        "assets/img/bokguon/05-insurer-case.png",
        "보험사 사건 등록"
      ]
    ]
  },
  "mobility-erp": {
    "img": "assets/img/mobility-erp/vehicles.png",
    "shots": [
      [
        "assets/img/mobility-erp/02-vehicle-status.png",
        "차량 대기 현황(데모 데이터)"
      ],
      [
        "assets/img/mobility-erp/03-control-map.jpg",
        "차량 관제센터 지도"
      ],
      [
        "assets/img/mobility-erp/04-schedules.png",
        "차량별 스케줄 타임라인"
      ],
      [
        "assets/img/mobility-erp/05-rental-search.png",
        "공개 렌터카 가격 비교 화면"
      ]
    ]
  },
  "grid-dispatch": {
    "img": "assets/img/grid-dispatch/driver-wireframe.png",
    "shots": [
      [
        "assets/img/grid-dispatch/driver-wireframe.png",
        "기사용 모바일 웹 와이어프레임 v2: 출발 전 사진에서 도착 사진까지"
      ]
    ]
  },
  "weekend-rent": {
    "img": "assets/img/weekend-rent/banner.jpg"
  },
  "toktokstock": {
    "img": "assets/img/toktokstock/edu-chart.jpg"
  },
  "design-assets": {
    "img": "assets/img/design-assets/setup-guide-thumb.jpg"
  },
  "company-intro-ir": {
    "img": "assets/img/company-intro-ir/cover.png",
    "shots": [
      [
        "assets/img/company-intro-ir/center-process.png",
        "센터 설립 프로세스 슬라이드"
      ]
    ]
  },
  "control-console": {
    "img": "assets/img/control-console/console.png"
  },
  "personal-pr-site": {
    "img": "assets/img/personal-pr-site/home.png",
    "shots": [
      [
        "assets/img/personal-pr-site/home.png",
        "홈: 카테고리 12개와 대표 항목 37개"
      ],
      [
        "assets/img/personal-pr-site/detail.png",
        "상세: 왜 만들었는지, 어떻게 동작하는지, 바로가기 링크"
      ]
    ],
    "links": [
      [
        "이 사이트",
        "https://tak21542154-ux.github.io/Personal_PR/"
      ],
      [
        "GitHub 저장소",
        "https://github.com/tak21542154-ux/Personal_PR"
      ]
    ]
  },
  "ese": {
    "logo": "assets/img/logos/2s2.png"
  },
  "marketing-annual": {
    "logo": "assets/img/logos/kai.jpg"
  },
  "sales-training": {
    "logo": "assets/img/logos/kai.jpg"
  },
  "video-pipeline": {
    "logo": "assets/img/logos/kai.jpg"
  },
  "operations-docs-2021": {
    "logo": "assets/img/logos/kai.jpg"
  }
};
