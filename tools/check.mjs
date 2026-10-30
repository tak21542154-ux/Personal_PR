// 데이터 검증 게이트. 사용: node tools/check.mjs
// 오류가 하나라도 있으면 종료 코드 1. 루프와 커밋 전에 반드시 통과시킨다.
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const ctx = {}; ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/data.js"), "utf8"), ctx);
const worksDir = path.join(root, "assets/js/works");
const workFiles = fs.readdirSync(worksDir).filter((f) => f.endsWith(".js")).sort((a, b) => (a === "_core.js" ? -1 : b === "_core.js" ? 1 : a.localeCompare(b)));
workFiles.forEach((f) => vm.runInContext(fs.readFileSync(path.join(worksDir, f), "utf8"), ctx, { filename: f }));
const S = ctx.window.SITE;

const errors = [], warns = [];
const err = (m) => errors.push(m), warn = (m) => warns.push(m);

const cats = new Set(S.categories.map((c) => c.id));
const ids = new Set();
const flat = (w) => JSON.stringify(w);

// 금지 표현 (핀큐AI 컴플라이언스 + 팩트뱅크 금지선). 부정·면책 문구는 사람이 판단하므로 경고가 아니라 오류로 두고 문장을 고친다.
// 개인 사안 등 사적 용어는 저장소 밖(tools/.private-terms.json, 무시 파일)에서 읽는다.
let PRIVATE = [];
try { PRIVATE = JSON.parse(fs.readFileSync(path.join(root, "tools/.private-terms.json"), "utf8")).map((x) => [new RegExp(x.pattern), x.msg]); } catch (e) { /* 없으면 건너뜀 */ }
const BANNED = [
  [/자동\s*매매/, "'자동매매' 금지 → 시스템 트레이딩"],
  [/수익\s*보장|원금\s*보장|확정\s*수익|무손실|안전한\s*투자/, "수익·원금 보장류 표현 금지"],
  [/일임/, "'일임' 표현 금지"],
];
// 개인정보·비밀값
const PII = [
  [/\b\d{6}-?[1-4]\d{6}\b/, "주민등록번호 형태"],
  [/(sk-[A-Za-z0-9_-]{16,}|gh[pousr]_[A-Za-z0-9]{20,}|AIza[0-9A-Za-z_-]{20,}|xox[bp]-[0-9A-Za-z-]{10,}|AKIA[0-9A-Z]{12,})/, "API 키 형태"],
  [/(비밀번호|password|passwd)\s*[:=]\s*\S+/i, "비밀번호 값"],
  [/BEGIN (RSA |EC )?PRIVATE KEY/, "개인키"],
];
const allowedEmail = (S.contact.email || "").toLowerCase();
const allowedPhone = (S.contact.phone || "").replace(/\D/g, "");

S.works.forEach((w, i) => {
  const tag = `works[${i}] ${w.id || "(id 없음)"}`;
  ["id", "cat", "name", "en", "line", "status", "type", "period"].forEach((k) => { if (!w[k]) err(`${tag}: ${k} 비어 있음`); });
  if (w.id) {
    if (!/^[a-z0-9-]+$/.test(w.id)) err(`${tag}: id 는 영문 소문자·숫자·하이픈만`);
    if (ids.has(w.id)) err(`${tag}: id 중복`);
    ids.add(w.id);
  }
  if (w.cat && !cats.has(w.cat)) err(`${tag}: 없는 카테고리 ${w.cat}`);
  const why = w.why || [], how = w.how || [];
  if (!why.length) err(`${tag}: why(왜 만들어졌나) 없음`);
  if (!how.length && !(w.parts && w.parts.length)) err(`${tag}: how(어떻게 동작하나) 없음`);
  if (!(w.features && w.features.length)) warn(`${tag}: features 없음`);
  if (!(w.timeline && w.timeline.length)) warn(`${tag}: timeline 없음`);
  const whyLen = why.join("").length, howLen = how.join("").length;
  if (whyLen < 90) warn(`${tag}: why 가 짧음(${whyLen}자, 기준 90)`);
  if (howLen < 120 && !(w.parts && w.parts.length)) warn(`${tag}: how 가 짧음(${howLen}자, 기준 120)`);
  if (w.line && w.line.length > 60) warn(`${tag}: line 이 60자 초과(${w.line.length})`);
  if (w.img && !fs.existsSync(path.join(root, w.img))) err(`${tag}: 이미지 없음 ${w.img}`);
  (w.shots || []).forEach((s) => { if (!fs.existsSync(path.join(root, s.src))) err(`${tag}: 갤러리 이미지 없음 ${s.src}`); });

  const text = flat(w);
  BANNED.concat(PRIVATE).forEach(([re, msg]) => { if (re.test(text)) err(`${tag}: ${msg}`); });
  if (/제작했|구현했|구현 완료|구현을 마쳤|직접 만든|직접 제작|직접 구현/.test(text)) warn(`${tag}: 자기 홍보성 표현(제품 시점으로 바꿀 것)`);
  PII.forEach(([re, msg]) => { if (re.test(text)) err(`${tag}: ${msg}`); });
  (text.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []).forEach((m) => { if (m.toLowerCase() !== allowedEmail) err(`${tag}: 허용되지 않은 이메일 ${m}`); });
  (text.match(/0\d{1,2}-\d{3,4}-\d{4}/g) || []).forEach((m) => { if (m.replace(/\D/g, "") !== allowedPhone) err(`${tag}: 허용되지 않은 전화번호 ${m}`); });
});

// 루트 문서·도구·페이지에도 사적 용어와 대화체 호칭이 없어야 한다 (이 파일 자체는 제외)
const rootFiles = ["COVERAGE.md", "LOOP_STATE.md", "DESIGN.md", "index.html", "product.html", "robots.txt", "tools/coverage.mjs", "assets/js/main.js", "assets/js/data.js"];
rootFiles.forEach((rf) => {
  let t = ""; try { t = fs.readFileSync(path.join(root, rf), "utf8"); } catch (e) { return; }
  PRIVATE.forEach(([re, msg]) => { if (re.test(t)) err(`${rf}: ${msg}`); });
});

// 묶음 정의 검증: 모든 id 존재, 하위 항목은 한 대표 항목에만, 대표 항목이 하위 항목이 되지 않음
{
  const G = S.groups || {}, kid = new Map();
  Object.entries(G).forEach(([p, ks]) => {
    if (!ids.has(p)) err(`묶음: 대표 항목 ${p} 없음`);
    if (G[p].length === 0) err(`묶음: ${p} 의 하위 항목이 비어 있음`);
    ks.forEach((k) => {
      if (!ids.has(k)) err(`묶음: ${p} 의 하위 항목 ${k} 없음`);
      if (kid.has(k)) err(`묶음: ${k} 가 ${kid.get(k)} 와 ${p} 에 중복`);
      if (G[k]) err(`묶음: ${k} 는 대표 항목인데 ${p} 의 하위 항목으로도 들어감`);
      kid.set(k, p);
    });
  });
  S.works.forEach((w) => {
    (w.links || []).forEach((l) => {
      if (!/^https:\/\//.test(l.href)) err(`${w.id}: 링크는 https 만 (${l.href})`);
      if (/localhost|127\.0\.0\.1|192\.168\.|10\.\d+\.\d+\.\d+|\.local/.test(l.href)) err(`${w.id}: 내부 주소 링크 ${l.href}`);
    });
  });
  const tops = S.works.filter((w) => !kid.has(w.id));
  console.log(`대표 항목 ${tops.length}개 / 하위 항목 ${kid.size}개`);
}

// 카테고리마다 최소 1개
S.categories.forEach((c) => { if (!S.works.some((w) => w.cat === c.id)) warn(`카테고리 ${c.id} 에 항목이 없음`); });

// 모든 works 파일이 두 HTML 에 연결되어 있는지
for (const f of ["index.html", "product.html"]) {
  const h = fs.readFileSync(path.join(root, f), "utf8");
  workFiles.forEach((wf) => { if (!h.includes("assets/js/works/" + wf)) err(`${f}: works/${wf} 스크립트 태그 없음`); });
}

// HTML 이 가리키는 로컬 자산이 있는지
for (const f of ["index.html", "product.html"]) {
  const h = fs.readFileSync(path.join(root, f), "utf8");
  [...h.matchAll(/(?:src|href)="(assets\/[^"]+)"/g)].forEach((m) => { if (!fs.existsSync(path.join(root, m[1]))) err(`${f}: 자산 없음 ${m[1]}`); });
}

const byCat = {};
S.works.forEach((w) => { byCat[w.cat] = (byCat[w.cat] || 0) + 1; });
console.log(`항목 ${S.works.length}개 / 카테고리 ${S.categories.length}개`);
console.log(Object.entries(byCat).map(([k, v]) => `${k}:${v}`).join("  "));
warns.forEach((m) => console.log("경고:", m));
errors.forEach((m) => console.log("오류:", m));
console.log(errors.length ? `검증 실패 (오류 ${errors.length}, 경고 ${warns.length})` : `검증 통과 (경고 ${warns.length})`);
process.exit(errors.length ? 1 : 0);
