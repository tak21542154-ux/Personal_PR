/* 사이트 기본 정보와 카테고리. 항목(works)은 assets/js/works/*.js 에 카테고리별로 나눠 둡니다. */
window.SITE = {
  name: "유경탁",
  en: "YU KYUNGTAK",
  hero: ["ONE MAKER.", "A WHOLE AI TEAM."],
  heroSub: "기획부터 운영까지, 1인 AI 팀으로 제품을 만드는 사업가",
  intro: {
    title: "Overview",
    ko: "흩어져 있던 서비스와 프로그램, 자동화, 에이전트를 한곳에 모았습니다.",
    body: "투자 서비스, 업무 플랫폼, 영업·커머스 자동화, AI 서비스, 그리고 이 모든 일을 나눠 맡는 AI 에이전트 군단까지. 각 항목은 왜 만들어졌는지, 어떻게 동작하는지를 그대로 설명합니다."
  },
  contact: { email: "tak2154@naver.com", phone: "010-4694-5203", note: "" },
  categories: [
    { id: "fintech",    no: "01", en: "FinTech Service",     ko: "핀테크 서비스",        desc: "시스템 트레이딩 서비스의 기획, 제품, 운영." },
    { id: "ops",        no: "02", en: "Business Platform",   ko: "업무 운영 플랫폼",     desc: "현업의 반복 업무를 한 화면으로 모으는 B2B 시스템." },
    { id: "growth",     no: "03", en: "Sales Automation",    ko: "영업·마케팅 자동화",   desc: "대상 발굴부터 발송, 캠페인까지 이어지는 영업 도구." },
    { id: "commerce",   no: "04", en: "Commerce Automation", ko: "커머스 자동화",        desc: "소싱, 등록, 주문, 리포트로 이어지는 오픈마켓 운영." },
    { id: "ai",         no: "05", en: "AI Service",          ko: "AI 서비스",            desc: "AI로 새로운 경험을 만드는 소비자 서비스." },
    { id: "agents",     no: "06", en: "AI Agent Corps",      ko: "AI 에이전트 군단",     desc: "역할별로 정의해 둔 전담 AI 요원들." },
    { id: "skills",     no: "07", en: "Skills & Workflow",   ko: "스킬·워크플로",        desc: "반복 작업을 한 번의 호출로 바꾸는 스킬과 작업 체계." },
    { id: "automation", no: "08", en: "Ops Automation",      ko: "운영 자동화·봇",       desc: "정해진 시간에 돌며 점검하고 알리는 스케줄과 봇." },
    { id: "data",       no: "09", en: "Data & Tools",        ko: "데이터·크롤러·도구",   desc: "수집, 변환, 점검을 맡는 작은 도구들." },
    { id: "creative",   no: "10", en: "Landing & IR",        ko: "랜딩·IR·문서",         desc: "서비스를 설명하고 설득하는 페이지와 제안 문서." },
    { id: "brand",      no: "11", en: "Brand & Business",    ko: "브랜드·사업 이력",     desc: "직접 세우고 운영해 온 브랜드와 사업." },
    { id: "knowledge",  no: "12", en: "Knowledge & Infra",   ko: "지식·인프라",          desc: "기록이 쌓이고 일이 흩어지지 않게 하는 기반." }
  ],
  works: []
};
