/* 증빙: 항목마다 '어떻게 확인할 수 있는지'를 적습니다.
   g  증빙 종류(live·src·open·doc). 화면 캡처가 있으면 demo 는 화면에서 자동으로 붙습니다.
   f  [[이름, 내용]] 확인할 수 있는 사실 — 저장소 값은 2026-11-02 에 실측한 것입니다.
   l  [[이름, https 주소]] 직접 열어볼 수 있는 주소·원문
   저장소 이름과 경로는 적지 않고, 최신 커밋 해시 앞 7자리만 적습니다. 열람 때 이 값과 맞는지 대조하면 됩니다.
   공개 전 점검: 키·계정·내부 주소·고객 정보·회사명은 적지 않습니다. */
window.SITE.evidenceKinds = [
  { k: "live", t: "공개 주소", d: "누구나 눌러서 바로 확인할 수 있는 운영 주소입니다." },
  { k: "demo", t: "화면", d: "실제 화면 또는 격리한 데모 데이터 화면입니다. 항목 하단 '단계별 화면'에서 볼 수 있습니다." },
  { k: "src", t: "원문 공개", d: "이 저장소의 evidence 폴더에서 파일 원문을 읽을 수 있습니다." },
  { k: "open", t: "열람·시연", d: "비공개 저장소·로컬 폴더에 있습니다. 요청하시면 화면 공유 시연 또는 읽기 전용 열람으로 보여드립니다." },
  { k: "doc", t: "문서 근거", d: "보관 중인 문서·산출물입니다. 요청하시면 보여드리고, 상대 이름이나 수치가 든 문서는 구성과 이력 중심으로 보여드립니다." }
];

(function () {
  var E = {};
  var GH = "https://github.com/tak21542154-ux/Personal_PR/blob/main/evidence/";
  var TREE = "https://github.com/tak21542154-ux/Personal_PR/tree/main/evidence/";
  function e(id, g, f, l) { E[id] = { g: g, f: f || [], l: l || [] }; }

  var FINQ = ["핀큐AI 저장소(비공개)", "2026-10-22 단독 저장소로 분리 · 이후 커밋 241건 · 2026-10-22 ~ 2026-10-28 · 최신 06bb210"];
  var MONO = ["분리 전 이력(비공개 모노레포)", "커밋 874건 · 2026-03-15 ~ 2026-08-23 · 최신 9d2d663"];
  var PROPOSAL = ["확인 방법", "파일 제목·버전 이력·수정일과 슬라이드 구성은 화면 공유로 보여드립니다. 상대 이름이나 수치가 든 본문은 보여드리지 않습니다."];

  /* 핀큐AI 계열 */
  e("finqai", ["live", "open"], [["공개 홈페이지", "랜딩 페이지가 공개 주소로 운영 중입니다(응답 확인 2026-11-02)."], FINQ, MONO]);
  e("trading-engine", ["open"], [FINQ]);
  e("finq-engineering", ["open"], [FINQ, ["검증 방식", "저장소 안의 테스트·측정 스크립트를 열람할 수 있습니다."]]);
  e("finq-ai-features", ["open"], [FINQ]);
  e("alpha-service", ["live", "open"], [["공개 홈페이지", "한국AI투자센터 홈페이지가 공개 주소로 운영 중입니다(응답 확인 2026-11-02)."], MONO]);

  /* 업무 플랫폼 */
  e("bokguon", ["open"], [["저장소(비공개)", "커밋 15건 · 2026-10-12 ~ 2026-10-28 · 최신 5b3ed4c"], ["화면 출처", "관리자·보험사 화면은 격리한 DB의 데모 데이터입니다."]]);
  e("mobility-erp", ["open"], [["저장소(비공개)", "커밋 197건 · 2026-03-12 ~ 2026-10-27 · 최신 9e7c810"], ["화면 출처", "차량 현황·관제·스케줄 화면은 격리한 DB의 데모 데이터이고, 회사명은 가렸습니다."]]);
  e("grid-dispatch", ["doc"], [["근거", "기사용 화면 와이어프레임과 사고 접수부터 정산까지의 흐름 문서가 보관돼 있습니다."]]);
  e("strategy-office-docs", ["doc"], [PROPOSAL]);
  e("academy-inventory", ["doc"]);

  /* 영업·마케팅 / 커머스 */
  e("ax-outreach", ["open"], [["저장소(비공개)", "커밋 6건 · 2026-10-17 ~ 2026-10-28 · 최신 3a49ecf"]]);
  e("sales-training", ["doc"]);
  e("marketing-annual", ["doc"]);
  e("ese", ["open"], [["오토 포스터·쇼핑몰 자동화", "비공개 모노레포 안의 폴더로 있습니다."], MONO]);
  e("weekend-rent", ["doc"]);

  /* AI 서비스 */
  e("meari", ["live", "open"], [["공개 랜딩", "랜딩 페이지 응답 확인 2026-11-02. 서비스 본체는 의도적으로 일시 중단 중입니다."], ["저장소(비공개)", "커밋 286건 · 2026-10-07 ~ 2026-10-28 · 최신 8644748"]]);
  e("tg-agent-kit", ["doc"]);

  /* 에이전트 군단 · 스킬 · 환경 */
  e("agent-corps", ["src", "open"], [["공개 정의 파일", "에이전트 23개 중 16개의 정의 파일 원문을 공개합니다(역할·성격·전문 분야·작업 규칙·도구 권한)."], ["비공개 7개", "회사·개인 사정이 들어 있어 올리지 않았습니다. 요청하시면 화면 공유로 보여드립니다."]], [["에이전트 정의 파일 폴더", TREE + "agents"]]);
  e("ai-company", ["doc"]);
  e("my-skills", ["src", "open"], [["공개 스킬", "직접 만든 9개 중 5개(세션 정리·하루 정리·세컨드 브레인 점검 스크립트·상세페이지 기획·채용공고 분석)의 정의 파일과 스크립트를 공개합니다."], ["비공개 4개", "개인 구직 정보나 개인 폴더 구조가 들어 있어 올리지 않았습니다."]], [["스킬 폴더", TREE + "skills"], ["증빙 폴더 안내", GH + "README.md"]]);
  e("claude-setup", ["open"], [["근거", "훅·MCP·권한 설정 파일은 키와 로컬 경로가 있어 올리지 않았습니다. 화면 공유로 보여드립니다."]]);
  e("external-skill-stacks", ["live"], [["성격", "오픈소스·공식 스킬 세트를 설치해 쓰는 것으로, 직접 만든 것이 아닙니다."]], [["gstack 원본 저장소", "https://github.com/garrytan/gstack"]]);

  /* 자동화·도구 */
  e("office-automation", ["open"]);
  e("dev-utilities", ["open"]);
  e("crawler-runner", ["open"]);
  e("control-console", ["open"], [["구성", "저장소 없이 로컬 폴더에서 돌리고, 화면은 상세 상단 캡처로 확인할 수 있습니다."]]);
  e("sunhan-hr", ["open"], [["비공개 모노레포 안의 폴더", "해당 폴더의 코드와 문서를 열람할 수 있습니다."], MONO]);

  /* 랜딩·IR·문서 / 브랜드 / 지식 */
  e("company-intro-ir", ["doc"]);
  e("video-pipeline", ["doc"]);
  e("design-assets", ["doc"]);
  e("toktokstock", ["doc"]);
  e("brand-launch-plans", ["doc"]);
  e("operations-docs-2021", ["doc"]);
  e("youtube-channel", ["doc"]);
  e("knowledge-notes", ["doc"]);
  e("obsidian-vault", ["open"]);
  e("parkcare", ["open"], [["성격", "프로토타입 데모입니다. 공개 페이지에 회사명이 있어 주소는 싣지 않았습니다."]]);
  e("personal-pr-site", ["live", "src"], [["공개 저장소", "이 사이트의 소스 전체가 공개돼 있습니다. 이력은 익명 처리를 위해 새로 구성했습니다."]], [["GitHub 저장소", "https://github.com/tak21542154-ux/Personal_PR"]]);

  /* 하위 항목: 전략사업실 제안서·투자 제안서 문서군 */
  e("external-proposal-series", ["doc"], [PROPOSAL]);
  e("corporate-ir-series", ["doc"], [PROPOSAL]);
  e("ga-partnership-package", ["doc"], [PROPOSAL]);
  e("accident-rental-partner-proposals", ["doc"], [PROPOSAL]);
  e("cooperation-proposal-batch", ["doc"], [PROPOSAL]);
  e("consignment-product-docs", ["doc"], [PROPOSAL]);
  e("partner-proposal-builders", ["doc"], [PROPOSAL]);

  /* 하위 항목: 에이전트 정의 파일 16개 */
  ["captain-marvel-research", "captain-strategy", "coulson-compliance", "deadpool-community", "echo-voice", "hawkeye-diagnostics", "msmarvel-ui-designer", "nick-fury-orchestrator",
    "pepper-ops", "shehulk-security-auditor", "shuri-frontend", "spiderman-landingpage", "starlord-dropship", "strange-qa", "vision-backend", "wanda-marketing"].forEach(function (a) {
    e(a, ["src"], [["공개 원문", "역할·성격·전문 분야·작업 규칙·도구 권한이 적힌 정의 파일입니다. 내부 경로·보안 메모는 뺐습니다."]], [["정의 파일 원문", GH + "agents/" + a + ".md"]]);
  });
  ["labelgroup-compliance", "labelgroup-grants", "labelgroup-scout", "daredevil-legal", "friday-career", "happy-hogan-admin", "heimdall-botops"].forEach(function (a) {
    e(a, ["open"], [["비공개", "회사·개인 사정이 들어 있어 정의 파일을 올리지 않았습니다. 요청하시면 화면 공유로 보여드립니다."]]);
  });

  /* 하위 항목: 직접 만든 스킬 */
  e("skill-session-wrap", ["src"], [["공개 원문", "정의 파일과 대기 목록 점검·세션 등록 스크립트입니다."]], [["SKILL.md", GH + "skills/session-wrap/SKILL.md"], ["queue-session.py", GH + "skills/session-wrap/queue-session.py"], ["check-pending.py", GH + "skills/session-wrap/check-pending.py"]]);
  e("skill-daily-wrap", ["src"], [["공개 원문", "정의 파일과 정리 기한 점검 스크립트입니다."]], [["SKILL.md", GH + "skills/daily-wrap/SKILL.md"], ["check-due.py", GH + "skills/daily-wrap/check-due.py"]]);
  e("skill-second-brain", ["src", "open"], [["공개 원문", "볼트 점검 스크립트(healthcheck.py)만 올렸습니다. 정의 파일에는 개인 폴더 구조가 있어 뺐습니다."]], [["healthcheck.py", GH + "skills/second-brain/healthcheck.py"]]);
  e("skill-detail-page", ["src"], [["공개 원문", "정의 파일, 기획서 템플릿, 실제 상품 하나로 돌려 본 예시와 합성 스크립트입니다."]], [["SKILL.md", GH + "skills/detail-page-craft/SKILL.md"], ["기획서 템플릿", GH + "skills/detail-page-craft/templates/detail-page-brief-template.md"], ["예시", GH + "skills/detail-page-craft/examples/example-55464-layered-tank-dress.md"]]);
  e("skill-jd-analysis", ["src"], [["공개 원문", "채용공고를 회사 관점에서 역해석하는 정의 파일입니다."]], [["SKILL.md", GH + "skills/jd-analysis/SKILL.md"]]);

  window.SITE.evidence = E;
})();
