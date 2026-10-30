# COVERAGE — 반영 범위 검증

`node tools/coverage.mjs` 가 생성합니다. 항목 id 가 사이트에 없으면 종료 코드 1.

총 항목 329개 · 카테고리 12개

## A. 요청한 1~12번

> 번호는 요청 시 제시한 12개 항목 표 기준입니다 (1 핀큐AI, 2 알파 재판매, 3 복구온, 4 모빌리티 ERP·GRID, 5 파크케어, 6 미용학원, 7 ESE, 8 AX 컨설팅 콜드메일, 9 메아리, 10 에이전트·스킬·일정봇·컨트롤 콘솔, 11 톡톡스탁·센터 확장·와디즈, 12 사업자추출·매크로·FSS·hey_jarvis·가계부). 묶음 항목(4, 8, 10, 11, 12)은 구성 요소마다 별도 항목으로 풀었습니다.

### 1. 핀큐AI 본체·홈페이지
- ✅ `finqai` — 핀큐AI
- ✅ `kai-homepage` — 한국AI투자센터 홈페이지와 핀큐AI 랜딩
- ✅ `finq-admin-php` — 핀큐AI 홈페이지 내부 어드민
- ✅ `finq-admin` — 핀큐AI 어드민 (웹·모바일)
- ✅ `alpha-desktop-app` — 핀큐AI 데스크톱 앱 (PC 클라이언트)
- ✅ `broker-bridge` — 증권사 로컬 연동 브릿지
- ✅ `broker-adapters` — 멀티 브로커·거래소 어댑터 레이어
- ✅ `paper-engine` — 모의투자 엔진
- ✅ `safety-guards` — 운영 안전장치 3종
- ✅ `desktop-release` — 데스크톱 릴리스 파이프라인
- ✅ `store-kit` — 스토어 제출 키트
- ✅ `trial-guard` — 체험 신청 스팸 방어와 신규 유저 경로 검증
- ✅ `ci-workflows` — CI 워크플로 7종
- ✅ `homepage-tools` — 카페24 홈페이지 검증·배포 도구

### 2. 알파 재판매·운영
- ✅ `alpha-service` — 알파시스템 · 한국AI투자센터
- ✅ `alpha-design` — 알파 제품 설계
- ✅ `alpha-gtm-kit` — 알파 시장 진입 키트 (리런칭 HTML 7종)
- ✅ `alpha-guide-system` — 알파 사용가이드 문서 체계
- ✅ `alpha-ui-renewal` — 알파 프로그램 UI 리뉴얼 제안
- ✅ `customer-doc-set` — 알파·센터 고객용 문서 세트

### 3. 복구온
- ✅ `bokguon` — 복구온
- ✅ `bokguon-ops` — 복구온 서버 운영 도구
- ✅ `bokguon-dev-loop` — 복구온 자율 개발 루프 (라운드 기반 방법론)
- ✅ `ir-decks` — 투자 제안서 · IR 덱 생성기

### 4. 모빌리티 ERP·GRID 탁송
- ✅ `mobility-erp` — 모빌리티 ERP
- ✅ `grid-dispatch` — GRID 탁송 통합 시스템
- ✅ `smart-dispatch` — 스마트 배차 (랜딩·기획안·배차 사진 분석·문자 웹훅)
- ✅ `idle-vehicle-erp` — 유휴 차량 공급사 입력 ERP
- ✅ `shuttle-call-bot` — 셔틀 콜 봇
- ✅ `kakao-skill-keybox` — 카카오 챗봇 스킬 서버와 키박스 안내 이미지
- ✅ `accident-sop` — 사고접수 원스톱 SOP와 탁송 요청 변환기
- ✅ `dispatch-baseline` — 탁송 배차 기준선·이력 분석 파이프라인

### 5. 파크케어
- ✅ `parkcare` — 파크케어
- ✅ `allcare-landing` — 자동차 올케어 랜딩 (파크케어의 초기 이름)

### 6. 미용학원 재고관리
- ✅ `academy-inventory` — 미용학원 재고관리

### 7. ESE 오픈마켓 자동화
- ✅ `ese` — ESE 오픈마켓 자동화
- ✅ `ese-pricing` — 마진 하한 보정과 선별 점수
- ✅ `ese-size-ocr` — 치수표 OCR과 상세 이미지 가공
- ✅ `ese-order-loop` — 주문·문의 감시와 발주 안내
- ✅ `ese-plan-2s2` — 2S2 쇼핑몰 자동화 기획안
- ✅ `ese-finance-center` — ESE 자금 센터와 결산 리포트
- ✅ `ese-schedules` — ESE 운영 스케줄 12개
- ✅ `weekend-rent` — 위켄드렌트 판매 채널 등록 자동화

### 8. AX 컨설팅·콜드메일
- ✅ `ax-outreach` — AX 컨설팅 아웃리치
- ✅ `ax-outreach-ledger` — AX 컨설팅 협업 장부와 텔레그램 봇
- ✅ `ax-partner-mail` — 핀큐AI 제휴 콜드메일
- ✅ `lead-harvest` — 리드 수집·보강과 개인화 진단 문단 생성기
- ✅ `lead-verify-workflow` — 리드 검증 멀티에이전트 워크플로
- ✅ `sales-doc-generators` — 영업 산출물 생성기
- ✅ `sales-kit` — 세일즈 키트와 자동화 레시피 카탈로그
- ✅ `outreach-reports` — 콜드메일 통합 현황·인수인계·폴더 감사 리포트
- ✅ `gov-notice-collector` — 정부지원 공고 수집·분류기

### 9. 메아리
- ✅ `meari` — 메아리
- ✅ `meari-voice-poc` — 음성 복제 PoC 하니스
- ✅ `meari-tts-bench` — TTS 품질 벤치 하네스
- ✅ `meari-evals` — 대화 품질 평가(eval) 스위트
- ✅ `meari-regression` — 실브라우저 회귀 테스트 159개
- ✅ `meari-compliance-docs` — 기획서와 윤리·컴플라이언스 문서팩
- ✅ `meari-ops` — 운영 백업·배포 스크립트와 런북
- ✅ `meari-b2b-proposal` — 상조 제휴 제안서와 5분 시연 대본
- ✅ `meari-loop-watch` — 메아리 개발 루프·상주 감시·외부 헬스 감시

### 10. 에이전트·스킬·일정봇·컨트롤 콘솔
- ✅ `agent-corps` — 에이전트 군단 운영 체계
- ✅ `skill-session-wrap` — session-wrap
- ✅ `skill-daily-wrap` — daily-wrap
- ✅ `skill-second-brain` — second-brain
- ✅ `secretary-bot` — 일정봇
- ✅ `control-console` — 1인 스튜디오 관제 콘솔
- ✅ `mission-control` — 미션 컨트롤
- ✅ `hooks-system` — 훅 체계
- ✅ `mcp-setup` — MCP 연결 구성
- ✅ `global-guidelines` — 전역 지침 v3와 PC 환경 설치 패키지

### 11. 톡톡스탁·센터 확장·와디즈
- ✅ `toktokstock` — 톡톡스탁
- ✅ `center-model` — 센터 운영 모델
- ✅ `reward-campaign` — 리워드 펀딩 캠페인 설계
- ✅ `branch-manual` — 지사(센터) 설립 매뉴얼과 모집
- ✅ `remote-ops` — 재택 인력 운영 모델

### 12. 사업자추출·매크로·FSS·hey_jarvis·가계부
- ✅ `seller-extractor` — 마켓 판매자 정보 추출 프로그램
- ✅ `macros` — 키보드·마우스 매크로 모음
- ✅ `fss-crawler` — 금융당국 등록 목록 수집기
- ✅ `hey-jarvis` — 헤이 자비스
- ✅ `deposit-bot` — 입금 확인·가계부 봇
- ✅ `tg-agent-kit` — 텔레그램 AI 에이전트 스타터 키트

## B. 에이전트 26개 (Claude 전역 23 + omp 3)

- ✅ `captain-marvel-research` — 캡틴 마블
- ✅ `captain-strategy` — 캡틴 아메리카
- ✅ `coulson-compliance` — 에이전트 콜슨
- ✅ `daredevil-legal` — 데어데블
- ✅ `deadpool-community` — 데드풀
- ✅ `echo-voice` — 에코
- ✅ `friday-career` — 프라이데이
- ✅ `happy-hogan-admin` — 해피 호건
- ✅ `hawkeye-diagnostics` — 호크아이
- ✅ `heimdall-botops` — 헤임달
- ✅ `labelgroup-compliance` — 라벨그룹 컴플라이언스
- ✅ `labelgroup-grants` — 라벨그룹 지원사업 탐색
- ✅ `labelgroup-scout` — 라벨그룹 스카우트
- ✅ `msmarvel-ui-designer` — 미즈 마블
- ✅ `nick-fury-orchestrator` — 닉 퓨리
- ✅ `pepper-ops` — 페퍼 포츠
- ✅ `shehulk-security-auditor` — 쉬헐크
- ✅ `shuri-frontend` — 쉬리
- ✅ `spiderman-landingpage` — 스파이더맨
- ✅ `starlord-dropship` — 스타로드
- ✅ `strange-qa` — 닥터 스트레인지
- ✅ `vision-backend` — 비전
- ✅ `wanda-marketing` — 완다
- ✅ `omp-architect` — 아키텍트 (자비스)
- ✅ `omp-editor` — 에디터 (덤-이)
- ✅ `omp-heimdall` — 이관 담당

## C. 스킬·훅·MCP

- ✅ session-wrap → `skill-session-wrap`
- ✅ daily-wrap → `skill-daily-wrap`
- ✅ second-brain → `skill-second-brain`
- ✅ detail-page-craft → `skill-detail-page`
- ✅ jd-analysis → `skill-jd-analysis`
- ✅ 아침 입사지원 보고(예약 스킬) → `skill-morning-report`
- ✅ gstack 세트(외부) → `skill-stack-gstack`
- ✅ AWS 세트(외부) → `skill-stack-aws`
- ✅ Paseo·Orca·Codex·번들(외부) → `skill-stack-agent-tools`

## D. 업무 자동화·스케줄

- ✅ 작업 스케줄러: ESE 12개 → `ese-schedules`
- ✅ 작업 스케줄러: 핀큐 개발·운영 감시 9개 → `finq-dev-loop`
- ✅ 작업 스케줄러: 메아리 6개 → `meari-loop-watch`
- ✅ 작업 스케줄러: 관제 콘솔·기록 보관·로그 회전 → `pc-ops-schedules`
- ✅ 작업 스케줄러: 일정봇 → `secretary-bot`
- ✅ 작업 스케줄러: 라벨 스카우트 → `labelgroup-scout`
- ✅ 작업 스케줄러: AX 아웃리치 발송 → `ax-outreach`
- ✅ run_hidden.vbs → `run-hidden`
- ✅ Paseo 스케줄 17개(함대) → `fleet-design`
- ✅ Orca 자동화 16개 → `orca-automations`
- ✅ 모빌리티 ERP 개발 루프 → `mobility-erp-loop`
- ✅ 운영 스모크 → `prod-smoke`
- ✅ 배포 드리프트 → `deploy-drift`
- ✅ 전수 테스트 → `full-suite`
- ✅ 보조 게이트·패리티 → `check-all`
- ✅ 화면 실측 하네스 → `ui-measure-harness`
- ✅ 컴플라이언스 스캔 → `compliance-scans`
- ✅ 알림·리스너 → `dev-notify`
- ✅ 레인 게시판 → `lane-board`
- ✅ 무료 모델 라우팅 → `omp-free-routing`

## E. 디스크별

### C:\ (사용자 도구 설정·스크립트)
✅ `agent-corps` · ✅ `hooks-system` · ✅ `mcp-setup` · ✅ `auto-mode-rules` · ✅ `global-guidelines` · ✅ `system-prompt-v2` · ✅ `memory-system` · ✅ `run-hidden` · ✅ `bokguon-ops` · ✅ `freeze-diagnosis` · ✅ `session-link` · ✅ `claude-backup-migrate` · ✅ `pc-ops-schedules`

### D:\ (dev·바탕화면_데이터)
✅ `bokguon` · ✅ `mobility-erp` · ✅ `grid-dispatch` · ✅ `parkcare` · ✅ `academy-inventory` · ✅ `secretary-bot` · ✅ `control-console` · ✅ `mission-control` · ✅ `okr-sheet` · ✅ `ese` · ✅ `sunhan-hr` · ✅ `rental-company-db` · ✅ `crawler-runner` · ✅ `ese-plan-2s2` · ✅ `smart-dispatch` · ✅ `gov-monitor` · ✅ `expo-alert` · ✅ `daily-report-prep` · ✅ `weekly-report-auto` · ✅ `strategy-vault` · ✅ `job-posting-auto` · ✅ `weekend-rent` · ✅ `idle-vehicle-erp` · ✅ `marketing-agents` · ✅ `tg-claude-bridge` · ✅ `hub-location-analysis` · ✅ `ojt-manual-pipeline` · ✅ `doc-factory` · ✅ `sales-training` · ✅ `ai-company` · ✅ `file-cleanup-project` · ✅ `pc-scan-tool` · ✅ `seller-extractor` · ✅ `fss-crawler` · ✅ `macros` · ✅ `agent-context-pack` · ✅ `rental-stats-pipeline` · ✅ `dispatch-baseline` · ✅ `accident-sop` · ✅ `meeting-transcribe` · ✅ `brandkit-module` · ✅ `address-geocoding-pitfalls` · ✅ `pptx-edit-pitfalls` · ✅ `station-walk-pipeline` · ✅ `broker-setup-playbook` · ✅ `customer-call-scripts` · ✅ `work-report-forms` · ✅ `company-anniversary-events` · ✅ `year-end-2021-package` · ✅ `sns-content-templates` · ✅ `toktokstock-admin-manual` · ✅ `daily-market-briefing` · ✅ `youtube-weekly-analysis` · ✅ `stock-education-series` · ✅ `competitor-benchmark-set` · ✅ `mobility-mobile-proto` · ✅ `workspace-protocol` · ✅ `new-business-tracks` · ✅ `support-regulatory-reports` · ✅ `youtube-channel`

### E:\ (FINQ_AI·AX·claude_code·볼트)
✅ `finqai` · ✅ `finq-dev-loop` · ✅ `lane-board` · ✅ `fleet-design` · ✅ `prod-smoke` · ✅ `deploy-drift` · ✅ `full-suite` · ✅ `check-all` · ✅ `ui-measure-harness` · ✅ `conduct-framework` · ✅ `compliance-scans` · ✅ `handoff-docs` · ✅ `store-kit` · ✅ `desktop-release` · ✅ `ai-reports` · ✅ `deposit-bot` · ✅ `sender-tools` · ✅ `dev-notify` · ✅ `broker-bridge` · ✅ `broker-adapters` · ✅ `paper-engine` · ✅ `autoresearch` · ✅ `ai-workflows` · ✅ `safety-guards` · ✅ `trial-guard` · ✅ `finq-admin-php` · ✅ `ci-workflows` · ✅ `meari` · ✅ `meari-voice-poc` · ✅ `meari-tts-bench` · ✅ `meari-evals` · ✅ `meari-regression` · ✅ `meari-compliance-docs` · ✅ `meari-ops` · ✅ `meari-loop-watch` · ✅ `ax-outreach` · ✅ `ax-outreach-ledger` · ✅ `ax-partner-mail` · ✅ `lead-harvest` · ✅ `gov-notice-collector` · ✅ `lead-verify-workflow` · ✅ `sales-doc-generators` · ✅ `sales-kit` · ✅ `git-guard` · ✅ `safe-sync` · ✅ `outreach-reports` · ✅ `hey-jarvis` · ✅ `tg-agent-kit` · ✅ `ese-quality-gates` · ✅ `ese-market-sourcing` · ✅ `ese-inquiry-draft` · ✅ `ese-net-report` · ✅ `learnings-log` · ✅ `phone-backup-verify` · ✅ `bokguon-checks` · ✅ `mobile-design-system` · ✅ `renewal-collab-hub` · ✅ `deploy-team-command` · ✅ `algorithmic-poster` · ✅ `promo-video-flow` · ✅ `youtube-ops` · ✅ `mass-training` · ✅ `marketing-annual` · ✅ `frontend-design-rules` · ✅ `kis-e2e-suite` · ✅ `contract-tests` · ✅ `signal-scanner` · ✅ `ocr-strategy-propose` · ✅ `coin-strategy-engines` · ✅ `visit-analytics` · ✅ `watch-api` · ✅ `trading-specs` · ✅ `client-build-scripts` · ✅ `finq-ir` · ✅ `meari-selftest` · ✅ `meari-db-migrate` · ✅ `meari-prelaunch` · ✅ `meari-corpus-protect` · ✅ `meari-design-docs` · ✅ `cost-context-rules` · ✅ `generic-prompt-template` · ✅ `obsidian-vault` · ✅ `career-doc-system` · ✅ `delegation-method` · ✅ `nas-scan-pipeline` · ✅ `local-llm-env` · ✅ `screen-timelapse` · ✅ `open-trigger-webhook` · ✅ `license-trial-alerts` · ✅ `alert-fanout` · ✅ `market-hours-venues` · ✅ `strategy-library` · ✅ `order-risk-gate` · ✅ `quote-layer` · ✅ `go-live-readiness` · ✅ `order-ambiguity` · ✅ `strategy-optimizer` · ✅ `portfolio-insight` · ✅ `crm-lifecycle` · ✅ `meari-security` · ✅ `scheduled-strategy-engine` · ✅ `multi-instance-manager` · ✅ `honest-error-text` · ✅ `order-integrity-guards` · ✅ `backtest-simulate-engine` · ✅ `audit-trail` · ✅ `account-security` · ✅ `customer-notifications` · ✅ `telegram-assistant` · ✅ `portfolio-aggregation` · ✅ `condition-search-marketplace` · ✅ `ai-stock-analysis-copilot` · ✅ `free-llm-market-commentary` · ✅ `symbol-search-real-data` · ✅ `signup-reliability` · ✅ `community-support-board` · ✅ `operator-reports` · ✅ `payment-license-extension` · ✅ `futures-strategy-engine` · ✅ `runtime-health-ops` · ✅ `homepage-account-sso` · ✅ `market-overview-dashboard` · ✅ `landing-rule-check` · ✅ `backtest-holdout-lab` · ✅ `app-failure-handling` · ✅ `unified-portfolio-dashboard` · ✅ `workspace-tool-windows` · ✅ `paper-trading-screens` · ✅ `admin-ops-monitors` · ✅ `account-lifecycle-screens` · ✅ `accessibility-and-help` · ✅ `meari-memory-vault` · ✅ `meari-ownership-model` · ✅ `meari-voice-preview` · ✅ `meari-web-push`

### NAS (homes·경영전략부·영상·디자인)
✅ `alpha-service` · ✅ `hermes-cron` · ✅ `ai-brain-wiki` · ✅ `alpha-gtm-kit` · ✅ `ebook-macro` · ✅ `alpha-ui-renewal` · ✅ `alpha-guide-system` · ✅ `guidebook-system` · ✅ `branch-manual` · ✅ `homepage-planning` · ✅ `chainmachine-plan` · ✅ `company-intro-ir` · ✅ `performance-marketing` · ✅ `event-system` · ✅ `newsletter` · ✅ `video-pipeline` · ✅ `guide-videos` · ✅ `design-assets` · ✅ `hibuff-plan` · ✅ `gov-application-docs` · ✅ `small-automations` · ✅ `nas-backup-design` · ✅ `storage-map` · ✅ `toktokstock` · ✅ `reward-campaign` · ✅ `customer-doc-set` · ✅ `alpha-issue-tracking` · ✅ `cx-qa-framework` · ✅ `site-change-requests` · ✅ `social-commerce-detail-plan` · ✅ `conversion-funnel-reporting` · ✅ `program-brand-kits` · ✅ `moim-project` · ✅ `promo-db-routing` · ✅ `culture-program-2021` · ✅ `office-asset-register` · ✅ `new-hire-ojt-kit` · ✅ `alpha-backend-audit-2026-03`

## F. 의도적으로 넣지 않은 것

- 개인정보(회원·고객 DB, 연락처 명단, 발송 로그) — 개인정보 보호
- 개인·계약·증빙 성격의 자료 — 공개 대상 아님
- 대외 표기의 근거가 확인되지 않은 홍보 자료 — 확인 전 게시 보류
- 자격증명·인증 관련 스크립트, 서드파티 앱 조작 도구 — 보안·약관
- 외부 클론·설치물·캐시 — 직접 만든 것이 아님
- 내려받은 외부 문서(공고·지침·사업계획서) — 직접 만든 것이 아님
- 키·토큰·.env·인증서 파일 — 비밀 값
