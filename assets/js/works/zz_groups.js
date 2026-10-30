/* 묶음 정의: 대표 항목 id → 하위 항목 id. 모든 하위 항목은 대표 항목 페이지에서 한꺼번에 설명하고,
   개별 페이지(product.html?id=…)도 그대로 열립니다. 새 항목은 가능하면 알맞은 대표 항목 아래에 넣습니다. */
window.SITE.groups = {
  "finqai": ["alpha-desktop-app", "finq-admin", "finq-admin-php", "kai-homepage", "homepage-tools", "trial-guard", "visit-analytics", "go-live-readiness", "license-trial-alerts", "alert-fanout", "open-trigger-webhook", "crm-lifecycle", "finq-user-docs", "finq-ir", "deposit-bot", "sender-tools", "launch-kit", "mobile-design-system", "frontend-design-rules", "account-security", "audit-trail", "customer-notifications", "telegram-assistant", "portfolio-aggregation", "signup-reliability", "community-support-board", "operator-reports", "payment-license-extension", "homepage-account-sso", "landing-rule-check", "app-failure-handling", "unified-portfolio-dashboard", "workspace-tool-windows", "paper-trading-screens", "admin-ops-monitors", "account-lifecycle-screens", "accessibility-and-help"],
  "trading-engine": ["broker-bridge", "broker-adapters", "paper-engine", "strategy-library", "order-risk-gate", "quote-layer", "order-ambiguity", "market-hours-venues", "safety-guards", "coin-strategy-engines", "scheduled-strategy-engine", "multi-instance-manager", "honest-error-text", "order-integrity-guards", "backtest-simulate-engine", "backtest-holdout-lab", "futures-strategy-engine", "symbol-search-real-data", "market-overview-dashboard"],
  "finq-engineering": ["kis-e2e-suite", "broker-verify", "prod-smoke", "deploy-drift", "full-suite", "check-all", "ui-measure-harness", "compliance-scans", "contract-tests", "watch-api", "ci-workflows", "client-build-scripts", "desktop-release", "store-kit", "finq-dev-loop", "lane-board", "dev-notify", "fleet-design", "runtime-health-ops"],
  "alpha-service": ["alpha-skeleton", "alpha-design", "alpha-ui-renewal", "alpha-gtm-kit", "alpha-guide-system", "customer-doc-set", "alpha-issue-tracking", "cx-qa-framework", "broker-setup-playbook", "alpha-backend-audit-2026-03", "renewal-collab-hub", "trading-specs"],
  "finq-ai-features": ["ai-workflows", "autoresearch", "ai-reports", "strategy-optimizer", "portfolio-insight", "signal-scanner", "ocr-strategy-propose", "condition-search-marketplace", "ai-stock-analysis-copilot", "free-llm-market-commentary"],
  "meari": ["meari-voice-poc", "meari-tts-bench", "meari-evals", "meari-regression", "meari-compliance-docs", "meari-ops", "meari-b2b-proposal", "meari-selftest", "meari-db-migrate", "meari-prelaunch", "meari-corpus-protect", "meari-security", "meari-design-docs", "meari-loop-watch", "meari-memory-vault", "meari-ownership-model", "meari-voice-preview", "meari-web-push"],
  "bokguon": ["bokguon-checks", "bokguon-dev-loop", "bokguon-ops"],
  "mobility-erp": ["mobility-erp-loop", "mobility-mobile-proto", "idle-vehicle-erp", "accident-sop", "ojt-manual-pipeline"],
  "grid-dispatch": ["smart-dispatch", "shuttle-call-bot", "kakao-skill-keybox", "dispatch-baseline", "hub-location-analysis", "tg-claude-bridge", "rental-company-db", "rental-stats-pipeline", "station-walk-pipeline"],
  "ax-outreach": ["ax-outreach-ledger", "ax-partner-mail", "lead-harvest", "gov-notice-collector", "lead-verify-workflow", "sales-doc-generators", "sales-kit", "outreach-reports"],
  "marketing-annual": ["performance-marketing", "competitor-benchmark-set", "event-system", "moim-project", "reward-campaign", "conversion-funnel-reporting"],
  "ese": ["ese-pricing", "ese-size-ocr", "ese-order-loop", "ese-plan-2s2", "ese-finance-center", "ese-quality-gates", "ese-market-sourcing", "ese-inquiry-draft", "ese-net-report", "ese-schedules", "social-commerce-detail-plan"],
  "agent-corps": ["captain-marvel-research", "captain-strategy", "coulson-compliance", "daredevil-legal", "deadpool-community", "echo-voice", "friday-career", "happy-hogan-admin", "hawkeye-diagnostics", "heimdall-botops", "labelgroup-compliance", "labelgroup-grants", "labelgroup-scout", "msmarvel-ui-designer", "nick-fury-orchestrator", "pepper-ops", "shehulk-security-auditor", "shuri-frontend", "spiderman-landingpage", "starlord-dropship", "strange-qa", "vision-backend", "wanda-marketing"],
  "ai-company": ["marketing-agents", "omp-architect", "omp-editor", "omp-heimdall"],
  "my-skills": ["skill-session-wrap", "skill-daily-wrap", "skill-second-brain", "skill-detail-page", "skill-jd-analysis", "skill-morning-report", "generic-prompt-template", "deploy-team-command", "delegation-method"],
  "claude-setup": ["hooks-system", "mcp-setup", "auto-mode-rules", "global-guidelines", "system-prompt-v2", "memory-system", "cost-context-rules"],
  "external-skill-stacks": ["skill-stack-gstack", "skill-stack-aws", "skill-stack-agent-tools"],
  "control-console": ["mission-control", "secretary-bot", "orca-automations", "run-hidden", "pc-ops-schedules", "omp-free-routing", "hermes-cron", "engine-token-alert"],
  "office-automation": ["daily-report-prep", "weekly-report-auto", "job-posting-auto", "okr-sheet", "expo-alert", "gov-monitor", "small-automations", "meeting-transcribe", "stt-bot-infra"],
  "crawler-runner": ["fss-crawler", "seller-extractor", "early-experiments"],
  "dev-utilities": ["claude-backup-migrate", "screen-timelapse", "freeze-diagnosis", "session-link", "macros", "hwp-extractor", "md-to-pdf", "git-guard", "safe-sync", "misc-tools"],
  "tg-agent-kit": ["hey-jarvis"],
  "parkcare": ["allcare-landing"],
  "video-pipeline": ["promo-video-flow"],
  "design-assets": ["sns-content-templates", "algorithmic-poster", "ebook-macro"],
  "company-intro-ir": ["homepage-planning", "newsletter"],
  "strategy-office-docs": ["new-business-tracks", "support-regulatory-reports", "doc-factory", "ir-decks", "ax-voucher-docs", "gov-application-docs", "brandkit-module"],
  "toktokstock": ["toktokstock-admin-manual", "group-brands", "gerion-research"],
  "sales-training": ["mass-training", "branch-manual", "center-model", "remote-ops"],
  "brand-launch-plans": ["chainmachine-plan", "hibuff-plan", "bluevisor-gtm"],
  "obsidian-vault": ["ai-brain-wiki", "strategy-vault", "storage-map", "nas-scan-pipeline", "nas-backup-design", "file-cleanup-project", "pc-scan-tool", "phone-backup-verify", "agent-context-pack", "local-llm-env"],
  "youtube-channel": ["youtube-ops", "youtube-weekly-analysis", "guide-videos", "daily-market-briefing", "program-brand-kits"],
  "knowledge-notes": ["address-geocoding-pitfalls", "pptx-edit-pitfalls", "learnings-log", "workspace-protocol", "handoff-docs", "conduct-framework", "career-doc-system"],
  "operations-docs-2021": ["work-report-forms", "office-asset-register", "new-hire-ojt-kit", "culture-program-2021", "promo-db-routing", "site-change-requests", "customer-call-scripts", "guidebook-system", "company-anniversary-events", "year-end-2021-package", "stock-education-series"]
};

/* 자산(이미지·링크·단계별 화면)을 항목에 합친다 */
(function () {
  var A = window.SITE.assets || {};
  window.SITE.works.forEach(function (w) {
    var a = A[w.id]; if (!a) return;
    if (a.img) w.img = a.img;
    if (a.links) w.links = (w.links || []).concat(a.links.map(function (x) { return { label: x[0], href: x[1] }; }));
    if (a.shots) w.shots = (w.shots || []).concat(a.shots.map(function (x) { return { src: x[0], cap: x[1] }; }));
  });
})();
