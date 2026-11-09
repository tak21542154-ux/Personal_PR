/* 사이트 기본 정보와 카테고리. 항목(works)은 assets/js/works/*.js 에 카테고리별로 나눠 둡니다. */
window.SITE = {
  name: "유경탁",
  en: "YU KYUNGTAK",
  hero: ["ONE MAKER.", "A WHOLE AI TEAM."],
  heroSub: "기획부터 운영까지, 1인 AI 팀으로 제품을 만드는 빌더",
  intro: {
    title: "Overview",
    ko: "흩어져 있던 서비스와 프로그램, 자동화, 에이전트를 한곳에 모았습니다.",
    body: "투자 서비스, 업무 플랫폼, 영업·커머스 자동화, AI 서비스, 그리고 이 모든 일을 나눠 맡는 AI 에이전트 군단까지. 각 항목은 왜 만들어졌는지, 어떻게 동작하는지를 그대로 설명합니다."
  },
  contact: { email: "tak2154@naver.com", phone: "010-4694-5203", note: "" },
  categories: [
    { id: "fintech",   no: "01", en: "FinTech Service",       ko: "핀테크·투자 서비스",     desc: "시스템 트레이딩 서비스의 기획·제품·운영과 그 검증 체계." },
    { id: "platform",  no: "02", en: "Business Platform",     ko: "모빌리티·업무 플랫폼",   desc: "현업의 반복 업무를 한 화면으로 모으는 B2B 시스템과 서비스 프로토타입." },
    { id: "growth",    no: "03", en: "Sales & Commerce",      ko: "영업·마케팅·커머스",     desc: "대상 발굴, 교육, 콘텐츠, 채널 운영과 오픈마켓 자동화." },
    { id: "ai",        no: "04", en: "AI Service & Agents",   ko: "AI 서비스·에이전트·스킬", desc: "AI 서비스와, 일을 나눠 맡는 에이전트·스킬·환경 구성." },
    { id: "tools",     no: "05", en: "Automation & Tools",    ko: "자동화·운영 도구",       desc: "정해진 시간에 돌며 점검하고 알리는 봇과 작은 도구들." },
    { id: "docs",      no: "06", en: "Proposals & Docs",      ko: "제안서·IR·기획 문서",    desc: "상대를 설득하는 제안 문서, 소개서, 기획안과 랜딩." },
    { id: "knowledge", no: "07", en: "Knowledge & Ops Docs",  ko: "지식·운영 문서 체계",    desc: "기록이 쌓이고 일이 흩어지지 않게 하는 기반." }
  ],
  works: []
};
