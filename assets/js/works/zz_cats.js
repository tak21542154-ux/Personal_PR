/* 분류 정리(2026-11-02): 항목은 처음 12개 분야로 적었지만 한 분야에 2~3개뿐인 곳이 많아 7개 분야로 다시 묶었습니다.
   - 대표 항목은 아래 TOP 표로 분야를 정하고, 하위 항목은 옛 분야를 ALIAS 로 새 분야에 옮깁니다. 옛 분야는 w.cat0 에 남깁니다(썸네일 그림 선택용).
   - kidGroups: 구성 기능이 10개 이상인 대표 항목은 소분류로 나눠 보여 줍니다. 모든 하위 항목이 한 번씩 들어가야 합니다(check.mjs 가 검사). */
(function () {
  var S = window.SITE;
  var ALIAS = { fintech: "fintech", ops: "platform", growth: "growth", commerce: "growth", ai: "ai", agents: "ai", skills: "ai", automation: "tools", data: "tools", creative: "docs", brand: "docs", knowledge: "knowledge" };
  var TOP = {
    fintech: ["finqai", "alpha-service", "trading-engine", "finq-engineering", "finq-ai-features", "toktokstock"],
    platform: ["bokguon", "mobility-erp", "grid-dispatch", "parkcare", "academy-inventory"],
    growth: ["ese", "weekend-rent", "ax-outreach", "marketing-annual", "youtube-channel", "sales-training", "video-pipeline"],
    ai: ["meari", "agent-corps", "ai-company", "my-skills", "claude-setup", "external-skill-stacks", "tg-agent-kit"],
    tools: ["control-console", "crawler-runner", "office-automation", "dev-utilities", "sunhan-hr"],
    docs: ["strategy-office-docs", "company-intro-ir", "brand-launch-plans", "design-assets", "personal-pr-site"],
    knowledge: ["operations-docs-2021", "knowledge-notes", "obsidian-vault"]
  };
  var topCat = {};
  Object.keys(TOP).forEach(function (c) { TOP[c].forEach(function (id) { topCat[id] = c; }); });
  S.works.forEach(function (w) { w.cat0 = w.cat; w.cat = topCat[w.id] || ALIAS[w.cat] || w.cat; });

  S.kidGroups = {
    "finqai": [
      ["앱·화면", ["alpha-desktop-app", "finq-admin", "workspace-tool-windows", "unified-portfolio-dashboard", "portfolio-aggregation", "paper-trading-screens", "account-lifecycle-screens", "accessibility-and-help", "app-failure-handling"]],
      ["홈페이지·랜딩·유입", ["kai-homepage", "homepage-tools", "landing-rule-check", "finq-admin-php", "homepage-account-sso", "visit-analytics", "trial-guard", "signup-reliability"]],
      ["계정·결제·운영", ["account-security", "audit-trail", "payment-license-extension", "deposit-bot", "go-live-readiness", "license-trial-alerts", "admin-ops-monitors", "operator-reports"]],
      ["알림·CRM·발송", ["alert-fanout", "customer-notifications", "open-trigger-webhook", "crm-lifecycle", "sender-tools", "telegram-assistant", "community-support-board"]],
      ["문서·디자인·런칭", ["finq-user-docs", "finq-ir", "mobile-design-system", "frontend-design-rules", "launch-kit"]]
    ],
    "trading-engine": [
      ["연동·시세", ["broker-bridge", "broker-adapters", "quote-layer", "market-hours-venues", "symbol-search-real-data", "multi-instance-manager"]],
      ["주문·안전", ["order-risk-gate", "order-ambiguity", "order-integrity-guards", "safety-guards", "honest-error-text", "scheduled-strategy-engine"]],
      ["전략·시뮬레이션", ["strategy-library", "coin-strategy-engines", "futures-strategy-engine", "paper-engine", "backtest-simulate-engine", "backtest-holdout-lab", "market-overview-dashboard"]]
    ],
    "finq-engineering": [
      ["테스트·검증", ["kis-e2e-suite", "broker-verify", "full-suite", "check-all", "ui-measure-harness", "compliance-scans", "contract-tests", "watch-api"]],
      ["배포·릴리스", ["deploy-drift", "ci-workflows", "client-build-scripts", "desktop-release", "store-kit"]],
      ["자율 개발·운영 감시", ["prod-smoke", "finq-dev-loop", "lane-board", "dev-notify", "fleet-design", "runtime-health-ops"]]
    ],
    "finq-ai-features": [
      ["분석·신호", ["signal-scanner", "ai-stock-analysis-copilot", "portfolio-insight", "ai-reports", "free-llm-market-commentary"]],
      ["전략 자동화", ["ai-workflows", "autoresearch", "strategy-optimizer", "ocr-strategy-propose", "condition-search-marketplace"]]
    ],
    "alpha-service": [
      ["제품 설계·리뉴얼", ["alpha-skeleton", "alpha-design", "alpha-ui-renewal", "renewal-collab-hub", "alpha-backend-audit-2026-03"]],
      ["고객 문서·시장 진입", ["alpha-gtm-kit", "alpha-guide-system", "customer-doc-set", "trading-specs"]],
      ["고객 응대·이슈", ["alpha-issue-tracking", "cx-qa-framework", "broker-setup-playbook"]]
    ],
    "meari": [
      ["음성·대화 품질", ["meari-voice-poc", "meari-tts-bench", "meari-evals", "meari-voice-preview", "meari-corpus-protect"]],
      ["서비스 기능", ["meari-memory-vault", "meari-ownership-model", "meari-web-push", "meari-security"]],
      ["테스트·운영", ["meari-regression", "meari-selftest", "meari-db-migrate", "meari-ops", "meari-prelaunch", "meari-loop-watch"]],
      ["기획·문서·제안", ["meari-compliance-docs", "meari-design-docs", "meari-b2b-proposal"]]
    ],
    "agent-corps": [
      ["기획·전략·리서치", ["captain-marvel-research", "captain-strategy", "nick-fury-orchestrator", "friday-career"]],
      ["개발·품질·보안", ["vision-backend", "shuri-frontend", "spiderman-landingpage", "msmarvel-ui-designer", "strange-qa", "shehulk-security-auditor", "hawkeye-diagnostics", "heimdall-botops", "echo-voice"]],
      ["운영·마케팅·커머스", ["pepper-ops", "wanda-marketing", "deadpool-community", "starlord-dropship"]],
      ["컴플라이언스·법률·행정", ["coulson-compliance", "daredevil-legal", "happy-hogan-admin", "labelgroup-compliance", "labelgroup-grants", "labelgroup-scout"]]
    ],
    "strategy-office-docs": [
      ["제안서·제휴", ["external-proposal-series", "ga-partnership-package", "accident-rental-partner-proposals", "cooperation-proposal-batch", "consignment-product-docs", "new-business-tracks"]],
      ["투자·IR", ["corporate-ir-series", "ir-decks"]],
      ["정부지원·규제", ["support-regulatory-reports", "ax-voucher-docs", "gov-application-docs"]],
      ["문서 생성 체계", ["doc-factory", "partner-proposal-builders", "brandkit-module"]]
    ],
    "ese": [
      ["소싱·가격·품질", ["ese-market-sourcing", "ese-pricing", "ese-size-ocr", "ese-quality-gates"]],
      ["주문·운영", ["ese-order-loop", "ese-inquiry-draft", "ese-schedules", "ese-net-report"]],
      ["기획·재무", ["ese-plan-2s2", "ese-finance-center", "social-commerce-detail-plan"]]
    ],
    "operations-docs-2021": [
      ["업무 양식·가이드", ["work-report-forms", "guidebook-system", "new-hire-ojt-kit", "office-asset-register", "site-change-requests"]],
      ["고객·영업 응대", ["customer-call-scripts", "promo-db-routing", "stock-education-series"]],
      ["행사·문화", ["company-anniversary-events", "culture-program-2021", "year-end-2021-package"]]
    ],
    "obsidian-vault": [
      ["볼트·위키", ["ai-brain-wiki", "strategy-vault", "agent-context-pack", "local-llm-env"]],
      ["저장소 정리·백업", ["storage-map", "nas-scan-pipeline", "nas-backup-design", "file-cleanup-project", "pc-scan-tool", "phone-backup-verify"]]
    ],
    "dev-utilities": [
      ["환경·백업·진단", ["claude-backup-migrate", "freeze-diagnosis", "session-link", "screen-timelapse"]],
      ["문서·입력 도구", ["hwp-extractor", "md-to-pdf", "macros"]],
      ["안전·점검", ["git-guard", "safe-sync", "misc-tools"]]
    ]
  };
})();
