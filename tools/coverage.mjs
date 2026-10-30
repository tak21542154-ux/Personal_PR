// 반영 범위 검증: 요청한 1~12번 항목, 에이전트·스킬·자동화, 디스크별 자산이 사이트 항목 id 에 모두 매핑되는지 확인.
// 사용: node tools/coverage.mjs  (누락이 있으면 종료 코드 1, COVERAGE.md 를 새로 씀)
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/data.js"), "utf8"), ctx);
const wd = path.join(root, "assets/js/works");
fs.readdirSync(wd).filter((f) => f.endsWith(".js")).sort((a, b) => (a === "_core.js" ? -1 : b === "_core.js" ? 1 : a.localeCompare(b)))
  .forEach((f) => vm.runInContext(fs.readFileSync(path.join(wd, f), "utf8"), ctx, { filename: f }));
const byId = new Map(ctx.SITE.works.map((w) => [w.id, w]));

// 요청한 1~12번 (사이트 항목 번호 목록)
const REQUESTED = [
  ["1. 핀큐AI 본체·홈페이지", ["finqai", "kai-homepage", "finq-admin-php", "finq-admin", "alpha-desktop-app", "broker-bridge", "broker-adapters", "paper-engine", "safety-guards", "desktop-release", "store-kit", "trial-guard", "ci-workflows", "homepage-tools"]],
  ["2. 알파 재판매·운영", ["alpha-service", "alpha-design", "alpha-gtm-kit", "alpha-guide-system", "alpha-ui-renewal", "customer-doc-set"]],
  ["3. 복구온", ["bokguon", "bokguon-ops", "bokguon-dev-loop", "ir-decks"]],
  ["4. 모빌리티 ERP·GRID 탁송", ["mobility-erp", "grid-dispatch", "smart-dispatch", "idle-vehicle-erp", "shuttle-call-bot", "kakao-skill-keybox", "accident-sop", "dispatch-baseline"]],
  ["5. 파크케어", ["parkcare", "allcare-landing"]],
  ["6. 미용학원 재고관리", ["academy-inventory"]],
  ["7. ESE 오픈마켓 자동화", ["ese", "ese-pricing", "ese-size-ocr", "ese-order-loop", "ese-plan-2s2", "ese-finance-center", "ese-schedules", "weekend-rent"]],
  ["8. AX 컨설팅·콜드메일", ["ax-outreach", "ax-outreach-ledger", "ax-partner-mail", "lead-harvest", "lead-verify-workflow", "sales-doc-generators", "sales-kit", "outreach-reports", "gov-notice-collector"]],
  ["9. 메아리", ["meari", "meari-voice-poc", "meari-tts-bench", "meari-evals", "meari-regression", "meari-compliance-docs", "meari-ops", "meari-b2b-proposal", "meari-loop-watch"]],
  ["10. 에이전트·스킬·일정봇·컨트롤 콘솔", ["agent-corps", "skill-session-wrap", "skill-daily-wrap", "skill-second-brain", "secretary-bot", "control-console", "mission-control", "hooks-system", "mcp-setup", "global-guidelines"]],
  ["11. 톡톡스탁·센터 확장·와디즈", ["toktokstock", "center-model", "reward-campaign", "branch-manual", "remote-ops"]],
  ["12. 사업자추출·매크로·FSS·hey_jarvis·가계부", ["seller-extractor", "macros", "fss-crawler", "hey-jarvis", "deposit-bot", "tg-agent-kit"]]
];

const AGENTS = ["captain-marvel-research", "captain-strategy", "coulson-compliance", "daredevil-legal", "deadpool-community", "echo-voice", "friday-career", "happy-hogan-admin", "hawkeye-diagnostics", "heimdall-botops", "labelgroup-compliance", "labelgroup-grants", "labelgroup-scout", "msmarvel-ui-designer", "nick-fury-orchestrator", "pepper-ops", "shehulk-security-auditor", "shuri-frontend", "spiderman-landingpage", "starlord-dropship", "strange-qa", "vision-backend", "wanda-marketing", "omp-architect", "omp-editor", "omp-heimdall"];
const SKILLS = [["session-wrap", "skill-session-wrap"], ["daily-wrap", "skill-daily-wrap"], ["second-brain", "skill-second-brain"], ["detail-page-craft", "skill-detail-page"], ["jd-analysis", "skill-jd-analysis"], ["아침 입사지원 보고(예약 스킬)", "skill-morning-report"], ["gstack 세트(외부)", "skill-stack-gstack"], ["AWS 세트(외부)", "skill-stack-aws"], ["Paseo·Orca·Codex·번들(외부)", "skill-stack-agent-tools"]];
const AUTOMATION = [
  ["작업 스케줄러: ESE 12개", "ese-schedules"], ["작업 스케줄러: 핀큐 개발·운영 감시 9개", "finq-dev-loop"], ["작업 스케줄러: 메아리 6개", "meari-loop-watch"],
  ["작업 스케줄러: 관제 콘솔·기록 보관·로그 회전", "pc-ops-schedules"], ["작업 스케줄러: 일정봇", "secretary-bot"], ["작업 스케줄러: 라벨 스카우트", "labelgroup-scout"], ["작업 스케줄러: AX 아웃리치 발송", "ax-outreach"],
  ["run_hidden.vbs", "run-hidden"], ["Paseo 스케줄 17개(함대)", "fleet-design"], ["Orca 자동화 16개", "orca-automations"], ["모빌리티 ERP 개발 루프", "mobility-erp-loop"], ["운영 스모크", "prod-smoke"], ["배포 드리프트", "deploy-drift"], ["전수 테스트", "full-suite"], ["보조 게이트·패리티", "check-all"], ["화면 실측 하네스", "ui-measure-harness"], ["컴플라이언스 스캔", "compliance-scans"], ["알림·리스너", "dev-notify"], ["레인 게시판", "lane-board"], ["무료 모델 라우팅", "omp-free-routing"]
];
const DISKS = {
  "C:\\ (사용자 도구 설정·스크립트)": ["agent-corps", "hooks-system", "mcp-setup", "auto-mode-rules", "global-guidelines", "system-prompt-v2", "memory-system", "run-hidden", "bokguon-ops", "freeze-diagnosis", "session-link", "claude-backup-migrate", "pc-ops-schedules"],
  "D:\\ (dev·바탕화면_데이터)": ["bokguon", "mobility-erp", "grid-dispatch", "parkcare", "academy-inventory", "secretary-bot", "control-console", "mission-control", "okr-sheet", "ese", "sunhan-hr", "rental-company-db", "crawler-runner", "ese-plan-2s2", "smart-dispatch", "gov-monitor", "expo-alert", "daily-report-prep", "weekly-report-auto", "strategy-vault", "job-posting-auto", "weekend-rent", "idle-vehicle-erp", "marketing-agents", "tg-claude-bridge", "hub-location-analysis", "ojt-manual-pipeline", "doc-factory", "sales-training", "ai-company", "file-cleanup-project", "pc-scan-tool", "seller-extractor", "fss-crawler", "macros", "agent-context-pack", "rental-stats-pipeline", "dispatch-baseline", "accident-sop", "meeting-transcribe", "brandkit-module", "address-geocoding-pitfalls", "pptx-edit-pitfalls", "station-walk-pipeline", "broker-setup-playbook", "customer-call-scripts", "work-report-forms", "company-anniversary-events", "year-end-2021-package", "sns-content-templates", "toktokstock-admin-manual", "daily-market-briefing", "youtube-weekly-analysis", "stock-education-series", "competitor-benchmark-set", "mobility-mobile-proto", "workspace-protocol", "new-business-tracks", "support-regulatory-reports", "youtube-channel"],
  "E:\\ (FINQ_AI·AX·claude_code·볼트)": ["finqai", "finq-dev-loop", "lane-board", "fleet-design", "prod-smoke", "deploy-drift", "full-suite", "check-all", "ui-measure-harness", "conduct-framework", "compliance-scans", "handoff-docs", "store-kit", "desktop-release", "ai-reports", "deposit-bot", "sender-tools", "dev-notify", "broker-bridge", "broker-adapters", "paper-engine", "autoresearch", "ai-workflows", "safety-guards", "trial-guard", "finq-admin-php", "ci-workflows", "meari", "meari-voice-poc", "meari-tts-bench", "meari-evals", "meari-regression", "meari-compliance-docs", "meari-ops", "meari-loop-watch", "ax-outreach", "ax-outreach-ledger", "ax-partner-mail", "lead-harvest", "gov-notice-collector", "lead-verify-workflow", "sales-doc-generators", "sales-kit", "git-guard", "safe-sync", "outreach-reports", "hey-jarvis", "tg-agent-kit", "ese-quality-gates", "ese-market-sourcing", "ese-inquiry-draft", "ese-net-report", "learnings-log", "phone-backup-verify", "bokguon-checks", "mobile-design-system", "renewal-collab-hub", "deploy-team-command", "algorithmic-poster", "promo-video-flow", "youtube-ops", "mass-training", "marketing-annual", "frontend-design-rules", "kis-e2e-suite", "contract-tests", "signal-scanner", "ocr-strategy-propose", "coin-strategy-engines", "visit-analytics", "watch-api", "trading-specs", "client-build-scripts", "finq-ir", "meari-selftest", "meari-db-migrate", "meari-prelaunch", "meari-corpus-protect", "meari-design-docs", "cost-context-rules", "generic-prompt-template", "obsidian-vault", "career-doc-system", "delegation-method", "nas-scan-pipeline", "local-llm-env", "screen-timelapse", "open-trigger-webhook", "license-trial-alerts", "alert-fanout", "market-hours-venues", "strategy-library", "order-risk-gate", "quote-layer", "go-live-readiness", "order-ambiguity", "strategy-optimizer", "portfolio-insight", "crm-lifecycle", "meari-security", "scheduled-strategy-engine", "multi-instance-manager", "honest-error-text", "order-integrity-guards", "backtest-simulate-engine", "audit-trail", "account-security", "customer-notifications", "telegram-assistant", "portfolio-aggregation", "condition-search-marketplace", "ai-stock-analysis-copilot", "free-llm-market-commentary", "symbol-search-real-data", "signup-reliability", "community-support-board", "operator-reports", "payment-license-extension", "futures-strategy-engine", "runtime-health-ops", "homepage-account-sso", "market-overview-dashboard", "landing-rule-check", "backtest-holdout-lab", "app-failure-handling", "unified-portfolio-dashboard", "workspace-tool-windows", "paper-trading-screens", "admin-ops-monitors", "account-lifecycle-screens", "accessibility-and-help", "meari-memory-vault", "meari-ownership-model", "meari-voice-preview", "meari-web-push"],
  "NAS (homes·경영전략부·영상·디자인)": ["alpha-service", "hermes-cron", "ai-brain-wiki", "alpha-gtm-kit", "ebook-macro", "alpha-ui-renewal", "alpha-guide-system", "guidebook-system", "branch-manual", "homepage-planning", "chainmachine-plan", "company-intro-ir", "performance-marketing", "event-system", "newsletter", "video-pipeline", "guide-videos", "design-assets", "hibuff-plan", "gov-application-docs", "small-automations", "nas-backup-design", "storage-map", "toktokstock", "reward-campaign", "customer-doc-set", "alpha-issue-tracking", "cx-qa-framework", "site-change-requests", "social-commerce-detail-plan", "conversion-funnel-reporting", "program-brand-kits", "moim-project", "promo-db-routing", "culture-program-2021", "office-asset-register", "new-hire-ojt-kit", "alpha-backend-audit-2026-03"]
};
// 의도적으로 사이트에 넣지 않은 자산과 사유
const EXCLUDED = [
  ["개인정보(회원·고객 DB, 연락처 명단, 발송 로그)", "개인정보 보호"],
  ["개인·계약·증빙 성격의 자료", "공개 대상 아님"],
  ["대외 표기의 근거가 확인되지 않은 홍보 자료", "확인 전 게시 보류"],
  ["자격증명·인증 관련 스크립트, 서드파티 앱 조작 도구", "보안·약관"],
  ["외부 클론·설치물·캐시", "직접 만든 것이 아님"],
  ["내려받은 외부 문서(공고·지침·사업계획서)", "직접 만든 것이 아님"],
  ["키·토큰·.env·인증서 파일", "비밀 값"]
];

const missing = [];
const check = (id) => { if (!byId.has(id)) { missing.push(id); return "❌"; } return "✅"; };
let md = `# COVERAGE — 반영 범위 검증\n\n\`node tools/coverage.mjs\` 가 생성합니다. 항목 id 가 사이트에 없으면 종료 코드 1.\n\n총 항목 ${ctx.SITE.works.length}개 · 카테고리 ${ctx.SITE.categories.length}개\n\n## A. 요청한 1~12번

> 번호는 요청 시 제시한 12개 항목 표 기준입니다 (1 핀큐AI, 2 알파 재판매, 3 복구온, 4 모빌리티 ERP·GRID, 5 파크케어, 6 미용학원, 7 ESE, 8 AX 컨설팅 콜드메일, 9 메아리, 10 에이전트·스킬·일정봇·컨트롤 콘솔, 11 톡톡스탁·센터 확장·와디즈, 12 사업자추출·매크로·FSS·hey_jarvis·가계부). 묶음 항목(4, 8, 10, 11, 12)은 구성 요소마다 별도 항목으로 풀었습니다.

`;
REQUESTED.forEach(([t, ids]) => { md += `### ${t}\n` + ids.map((i) => `- ${check(i)} \`${i}\`${byId.has(i) ? " — " + byId.get(i).name : ""}`).join("\n") + "\n\n"; });
md += `## B. 에이전트 ${AGENTS.length}개 (Claude 전역 23 + omp 3)\n\n` + AGENTS.map((i) => `- ${check(i)} \`${i}\`${byId.has(i) ? " — " + byId.get(i).name : ""}`).join("\n") + "\n\n";
md += `## C. 스킬·훅·MCP\n\n` + SKILLS.map(([l, i]) => `- ${check(i)} ${l} → \`${i}\``).join("\n") + "\n\n";
md += `## D. 업무 자동화·스케줄\n\n` + AUTOMATION.map(([l, i]) => `- ${check(i)} ${l} → \`${i}\``).join("\n") + "\n\n";
md += `## E. 디스크별\n\n`;
for (const [d, ids] of Object.entries(DISKS)) md += `### ${d}\n` + ids.map((i) => `${check(i)} \`${i}\``).join(" · ") + "\n\n";
md += `## F. 의도적으로 넣지 않은 것\n\n` + EXCLUDED.map(([a, b]) => `- ${a} — ${b}`).join("\n") + "\n";
fs.writeFileSync(path.join(root, "COVERAGE.md"), md, "utf8");

const uniq = [...new Set(missing)];
const total = REQUESTED.flatMap((x) => x[1]).length + AGENTS.length + SKILLS.length + AUTOMATION.length + Object.values(DISKS).flat().length;
console.log(`매핑 ${total}건 점검 · 항목 ${ctx.SITE.works.length}개`);
console.log(uniq.length ? `누락 id ${uniq.length}개: ${uniq.join(", ")}` : "누락 없음");
process.exit(uniq.length ? 1 : 0);
