// 대표 항목마다 카드용 썸네일(800x600 PNG)을 만든다. 실제 화면·표지(w.img)가 있는 항목은 그 화면을 앱 창 안에 담는다.
// 카테고리마다 제품 화면처럼 보이는 그림(차트, 대시보드, 퍼널, 상품 격자, 대화, 노드, 명령 팔레트, 흐름, 표, 레이아웃, 로고, 노트)을
// 앱 창 안에 그리고, 항목 id 로 값을 달리해서 같은 카테고리여도 모양이 달라지게 한다.
// 사용: node tools/make-thumbs.mjs [id ...]   (id 를 생략하면 대표 항목 전체)
// Microsoft Edge 헤드리스가 필요하다. 결과는 assets/img/thumb/<id>.png
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import { makeVariants } from "./thumb-variants.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "assets/img/thumb");
const tmpDir = path.join(root, "_s", "thumb-tmp");
fs.mkdirSync(outDir, { recursive: true }); fs.mkdirSync(tmpDir, { recursive: true });

const ctx = {}; ctx.window = ctx; vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(root, "assets/js/data.js"), "utf8"), ctx);
const wd = path.join(root, "assets/js/works");
const files = fs.readdirSync(wd).filter((f) => f.endsWith(".js")).sort((a, b) => (a === "_core.js" ? -1 : b === "_core.js" ? 1 : a.localeCompare(b)));
files.forEach((f) => vm.runInContext(fs.readFileSync(path.join(wd, f), "utf8"), ctx, { filename: f }));
const S = ctx.SITE, G = S.groups || {};
const kidSet = new Set(Object.values(G).flat());
const tops = S.works.filter((w) => !kidSet.has(w.id));
const want = process.argv.slice(2);
const list = want.length ? S.works.filter((w) => want.includes(w.id)) : tops;

const edge = ["C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "C:/Program Files/Microsoft/Edge/Application/msedge.exe"].find((p) => fs.existsSync(p));
if (!edge) { console.error("Edge 를 찾지 못했습니다"); process.exit(1); }

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ── 색과 도형 도우미 ── */
const INK = "#111417", MID = "#5b636b", SOFT = "#c9d0d6", LINE = "#e3e7ea", ACC = "#8c2346";
const hash = (s) => { let h = 2166136261; for (const c of s) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
const rng = (seed) => { let a = seed || 1; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const R = (x, y, w, h, fill = SOFT, rx = 4, stroke = "none", sw = 1) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const Ln = (x1, y1, x2, y2, stroke = SOFT, sw = 2, extra = "") => `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" ${extra}/>`;
const Ci = (cx, cy, r, fill = SOFT, stroke = "none", sw = 2) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
const Pl = (pts, stroke = INK, sw = 3, fill = "none") => `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" stroke-linecap="round"/>`;
const bars = (x, y, widths, h = 8, gap = 14, fill = SOFT) => widths.map((w, i) => R(x, y + i * (h + gap), w, h, fill, h / 2)).join("");

/* ── 카테고리별 그림 (내용 영역 688x432, 여백 28) ── */
const MOTIF = {
  fintech(r) {
    let s = "";
    for (let i = 0; i < 5; i++) s += Ln(28, 40 + i * 76, 470, 40 + i * 76, LINE, 1);
    let v = 330; const pts = [];
    for (let i = 0; i < 19; i++) {
      const o = v, c = v + (r() - 0.64) * 84; v = Math.max(70, Math.min(350, c));
      const hi = Math.min(o, c) - r() * 26 - 8, lo = Math.max(o, c) + r() * 26 + 8, x = 44 + i * 23, up = c < o;
      s += Ln(x, hi, x, lo, up ? ACC : MID, 2) + R(x - 6, Math.min(o, c), 12, Math.max(6, Math.abs(c - o)), up ? ACC : "#a9b2b9", 2);
      pts.push([x, (o + c) / 2]);
    }
    s += Pl(pts, INK, 3);
    s += R(496, 28, 164, 376, "#f6f8fa", 10, LINE);
    s += bars(512, 48, [90, 120, 70], 8, 14, SOFT);
    for (let i = 0; i < 3; i++) s += R(512, 128 + i * 52, 132, 38, "#fff", 6, LINE) + R(520, 142 + i * 52, 56, 8, SOFT, 4) + R(590, 142 + i * 52, 44, 8, i === 1 ? ACC : INK, 4);
    s += R(512, 340, 132, 46, ACC, 8) + R(550, 358, 56, 10, "#fff", 5);
    return s;
  },
  ops(r) {
    let s = "";
    for (let i = 0; i < 4; i++) s += R(28 + i * 164, 28, 152, 84, "#fff", 10, LINE) + R(44 + i * 164, 44, 46, 8, SOFT, 4) + R(44 + i * 164, 64, 70 + r() * 30, 20, i === 0 ? ACC : INK, 5) + R(44 + i * 164, 94, 36, 8, "#dfe5e9", 4);
    s += R(28, 128, 400, 276, "#fff", 10, LINE) + R(28, 128, 400, 38, "#f6f8fa", 10, "none");
    s += R(44, 143, 60, 8, SOFT, 4) + R(150, 143, 80, 8, SOFT, 4) + R(340, 143, 50, 8, SOFT, 4);
    for (let i = 0; i < 6; i++) {
      const y = 180 + i * 36;
      s += Ln(28, y - 6, 428, y - 6, LINE, 1) + R(44, y + 6, 76, 8, INK, 4) + R(150, y + 6, 100 + r() * 60, 8, SOFT, 4) + R(340, y, 60, 20, i === 2 ? ACC : "#e5eaee", 10);
    }
    s += R(448, 128, 212, 276, "#fff", 10, LINE);
    for (let i = 0; i < 8; i++) { const h = 40 + r() * 150; s += R(466 + i * 24, 384 - h, 16, h, i === 5 ? ACC : "#cfd6dc", 4); }
    s += Ln(462, 384, 646, 384, LINE, 2);
    return s;
  },
  growth(r) {
    let s = "";
    const ws = [380, 320, 250, 180, 110];
    ws.forEach((w, i) => { const x = 28 + (380 - w) / 2; s += R(x, 36 + i * 72, w, 56, i === 0 ? INK : i === 4 ? ACC : ["#3b4148", "#6a737b", "#99a2a9"][i - 1], 10) + R(x + 18, 56 + i * 72, 60 + r() * 20, 8, "rgba(255,255,255,.7)", 4); });
    s += R(436, 36, 224, 150, "#fff", 12, LINE);
    s += `<path d="M452 70 L548 124 L644 70" fill="none" stroke="${INK}" stroke-width="3" stroke-linejoin="round"/>` + R(452, 62, 192, 104, "none", 8, INK, 3);
    s += Ci(630, 52, 14, ACC) + R(624, 48, 12, 8, "#fff", 4);
    for (let i = 0; i < 4; i++) s += Ci(452, 226 + i * 46, 10, i < 3 ? ACC : "#e3e7ea") + R(476, 220 + i * 46, 110 + r() * 60, 10, i < 3 ? INK : SOFT, 5) + R(476, 236 + i * 46, 70, 6, SOFT, 3);
    return s;
  },
  commerce(r) {
    let s = R(28, 24, 250, 34, "#f6f8fa", 17, LINE) + Ci(48, 41, 6, "none", MID, 2);
    for (let i = 0; i < 3; i++) s += R(300 + i * 76, 28, 66, 26, i === 0 ? INK : "#fff", 13, LINE);
    for (let i = 0; i < 6; i++) {
      const x = 28 + (i % 3) * 218, y = 78 + Math.floor(i / 3) * 178;
      s += R(x, y, 204, 164, "#fff", 12, LINE) + R(x + 10, y + 10, 184, 84, i === 1 || i === 4 ? "#f1e3e8" : "#eef1f4", 8);
      s += `<path d="M${x + 60} ${y + 78} L${x + 90} ${y + 40} L${x + 118} ${y + 66} L${x + 134} ${y + 50} L${x + 160} ${y + 78} Z" fill="${i === 1 || i === 4 ? "#dcb6c3" : "#d3dae0"}"/>`;
      s += R(x + 10, y + 108, 120 + r() * 40, 9, INK, 4) + R(x + 10, y + 128, 70, 8, ACC, 4);
      if (i === 0 || i === 4) s += R(x + 150, y + 124, 44, 20, ACC, 10);
    }
    return s;
  },
  ai(r) {
    let s = "";
    const chat = [[28, 36, 250, 0], [200, 98, 260, 1], [28, 170, 230, 0], [160, 234, 300, 1]];
    chat.forEach(([x, y, w, me]) => { s += R(x, y, w, 50, me ? INK : "#eef1f4", 16) + R(x + 18, y + 14, w * 0.6, 8, me ? "rgba(255,255,255,.75)" : SOFT, 4) + R(x + 18, y + 30, w * 0.38, 8, me ? ACC : "#d3dae0", 4); });
    s += R(28, 330, 400, 56, "#fff", 28, LINE) + Ci(400, 358, 18, ACC) + R(48, 354, 130, 8, SOFT, 4);
    s += R(468, 36, 192, 350, "#f6f8fa", 14, LINE);
    for (let i = 0; i < 17; i++) { const h = 20 + Math.abs(Math.sin(i * 0.55 + r())) * 150; const x = 484 + i * 10.5; s += R(x, 211 - h / 2, 6, h, Math.abs(i - 8) < 3 ? ACC : INK, 3); }
    s += R(520, 340, 88, 24, "#fff", 12, LINE) + Ci(534, 352, 5, ACC);
    return s;
  },
  agents(r) {
    let s = "";
    const cx = 344, cy = 216, n = 8, pts = [];
    for (let i = 0; i < n; i++) { const a = (Math.PI * 2 * i) / n + r() * 0.35, d = 120 + r() * 60; pts.push([cx + Math.cos(a) * d * 1.45, cy + Math.sin(a) * d * 0.95, 20 + r() * 12]); }
    pts.forEach(([x, y]) => (s += Ln(cx, cy, x, y, "#cfd6dc", 2)));
    for (let i = 0; i < n; i++) s += Ln(pts[i][0], pts[i][1], pts[(i + 1) % n][0], pts[(i + 1) % n][1], "#e3e7ea", 2);
    pts.forEach(([x, y, rr], i) => { s += Ci(x, y, rr, i % 4 === 1 ? ACC : "#fff", i % 4 === 1 ? ACC : INK, 3) + R(x - 20, y + rr + 8, 40, 7, SOFT, 3); });
    s += Ci(cx, cy, 44, INK) + Ci(cx, cy, 30, "none", "rgba(255,255,255,.55)", 2) + R(cx - 14, cy - 5, 28, 10, ACC, 5);
    return s;
  },
  skills(r) {
    let s = R(28, 28, 632, 54, "#fff", 12, INK, 2) + Ln(52, 66, 62, 44, INK, 4) + R(84, 50, 150, 10, SOFT, 5) + R(590, 46, 52, 18, "#eef1f4", 9);
    for (let i = 0; i < 6; i++) {
      const y = 102 + i * 50, sel = i === 1;
      if (sel) s += R(28, y, 632, 44, "#f6e9ee", 10);
      s += R(44, y + 8, 28, 28, sel ? ACC : "#e3e7ea", 8) + R(90, y + 11, 90 + r() * 70, 9, INK, 4) + R(90, y + 27, 150 + r() * 120, 7, SOFT, 4) + R(580, y + 12, 64, 20, sel ? ACC : "#eef1f4", 10);
    }
    return s;
  },
  automation(r) {
    let s = Ln(28, 54, 660, 54, "#d3dae0", 2);
    for (let i = 0; i < 7; i++) s += Ln(44 + i * 100, 46, 44 + i * 100, 62, "#b3bcc3", 2) + R(30 + i * 100, 24, 28, 8, SOFT, 4);
    [0, 2, 5].forEach((i) => (s += Ci(44 + i * 100, 54, 8, ACC)));
    [28, 190, 352, 514].forEach((x, i) => {
      s += R(x, 100, 146, 80, i === 0 ? ACC : "#fff", 12, i === 0 ? ACC : INK, 2) + R(x + 18, 124, 70, 9, i === 0 ? "rgba(255,255,255,.85)" : INK, 4) + R(x + 18, 146, 100, 7, i === 0 ? "rgba(255,255,255,.55)" : SOFT, 4);
      if (i < 3) s += Ln(x + 150, 140, x + 184, 140, INK, 3) + `<path d="M${x + 178} 132 L${x + 188} 140 L${x + 178} 148" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
    });
    for (let i = 0; i < 3; i++) { const y = 216 + i * 64, on = i !== 1; s += R(28, y, 632, 52, "#fff", 12, LINE) + R(48, y + 16, 150 + r() * 70, 9, INK, 4) + R(48, y + 32, 90, 6, SOFT, 3) + R(590, y + 14, 52, 24, on ? ACC : "#d3dae0", 12) + Ci(on ? 628 : 604, y + 26, 9, "#fff"); }
    return s;
  },
  data(r) {
    let s = R(28, 28, 360, 376, "#fff", 10, LINE) + R(28, 28, 360, 36, "#f6f8fa", 10);
    s += R(44, 42, 60, 8, INK, 4) + R(150, 42, 50, 8, INK, 4) + R(250, 42, 70, 8, INK, 4);
    for (let i = 0; i < 9; i++) { const y = 80 + i * 36; s += Ln(28, y - 8, 388, y - 8, LINE, 1) + R(44, y, 50 + r() * 30, 8, SOFT, 4) + R(150, y, 30 + r() * 30, 8, i === 3 ? ACC : "#d3dae0", 4) + R(250, y, 60 + r() * 50, 8, SOFT, 4); }
    s += R(408, 28, 252, 376, "#fff", 10, LINE) + Ln(432, 370, 640, 370, MID, 2) + Ln(432, 370, 432, 52, MID, 2);
    const pts = []; for (let i = 0; i < 26; i++) { const x = 446 + i * 7.4, y = 340 - i * 7.4 + (r() - 0.5) * 80; pts.push([x, Math.max(70, Math.min(350, y))]); }
    pts.forEach(([x, y], i) => (s += Ci(x, y, 4, i % 6 === 0 ? ACC : "#9aa3ab")));
    s += Ln(446, 345, 636, 120, ACC, 3, 'stroke-dasharray="2 8"');
    return s;
  },
  creative(r) {
    let s = R(28, 28, 232, 312, "#fff", 10, LINE) + R(44, 44, 200, 150, "#eef1f4", 8) + R(60, 60, 90, 120, ACC, 8) + Ci(206, 100, 26, INK) + R(44, 214, 150, 12, INK, 4) + R(44, 238, 190, 8, SOFT, 4) + R(44, 256, 120, 8, SOFT, 4) + R(44, 288, 80, 28, INK, 14);
    s += R(284, 28, 376, 196, "#fff", 10, LINE) + R(300, 44, 344, 100, "#e8ecef", 8) + R(300, 160, 160, 12, INK, 4) + R(300, 184, 240, 8, SOFT, 4);
    s += `<path d="M300 144 L380 80 L440 120 L500 70 L644 144 Z" fill="#cfd6dc"/>`;
    s += R(284, 244, 180, 96, "#fff", 10, LINE) + R(300, 260, 100, 10, INK, 4) + R(300, 282, 140, 7, SOFT, 4) + R(300, 298, 110, 7, SOFT, 4);
    s += R(480, 244, 180, 96, "#f6e9ee", 10) + Ci(520, 292, 24, ACC) + R(560, 278, 76, 9, INK, 4) + R(560, 296, 56, 7, "#d9b8c5", 4);
    ["#111417", "#8c2346", "#5b636b", "#c9d0d6", "#eef1f4"].forEach((c, i) => (s += Ci(44 + i * 38, 378, 14, c, c === "#eef1f4" ? LINE : "none", 2)));
    return s;
  },
  brand(r) {
    let s = "";
    const cells = [
      (x, y) => Ci(x + 70, y + 70, 36, "none", INK, 10),
      (x, y) => `<path d="M${x + 70} ${y + 30} L${x + 108} ${y + 52} L${x + 108} ${y + 94} L${x + 70} ${y + 116} L${x + 32} ${y + 94} L${x + 32} ${y + 52} Z" fill="${ACC}"/>`,
      (x, y) => R(x + 32, y + 32, 76, 76, INK, 18) + R(x + 50, y + 66, 40, 9, "#fff", 4),
      (x, y) => `<path d="M${x + 70} ${y + 28} L${x + 112} ${y + 108} L${x + 28} ${y + 108} Z" fill="none" stroke="${INK}" stroke-width="10" stroke-linejoin="round"/>` + Ci(x + 70, y + 86, 10, ACC)
    ];
    cells.forEach((f, i) => { const x = 28 + (i % 2) * 320, y = 28 + Math.floor(i / 2) * 170; s += R(x, y, 306, 156, "#fff", 12, LINE) + f(x + 83, y + 6); s += R(x + 16, y + 132, 80 + r() * 30, 8, SOFT, 4); });
    s += Ln(40, 392, 648, 392, "#d3dae0", 3);
    [0, 1, 2, 3].forEach((i) => (s += Ci(80 + i * 170, 392, 9, i === 3 ? ACC : INK) + R(60 + i * 170, 410, 44, 7, SOFT, 3)));
    return s;
  },
  knowledge(r) {
    let s = R(28, 28, 632, 40, "#f6f8fa", 20, LINE) + Ci(52, 48, 7, "none", MID, 2) + R(72, 44, 140, 8, SOFT, 4);
    const nodes = []; for (let i = 0; i < 9; i++) nodes.push([60 + r() * 230, 110 + r() * 270, 9 + r() * 10]);
    nodes.forEach((a, i) => nodes.forEach((b, j) => { if (j > i && ((i * 7 + j * 3) % 5 === 0)) s += Ln(a[0], a[1], b[0], b[1], "#cfd6dc", 2); }));
    nodes.forEach(([x, y, rr], i) => (s += Ci(x, y, rr, i === 2 ? ACC : "#fff", i === 2 ? ACC : INK, 3)));
    for (let i = 0; i < 5; i++) { const y = 96 + i * 60; s += R(340, y, 320, 50, "#fff", 10, LINE) + R(356, y + 12, 22, 26, i === 1 ? ACC : "#e3e7ea", 4) + R(392, y + 13, 110 + r() * 90, 9, INK, 4) + R(392, y + 30, 150 + r() * 70, 7, SOFT, 4); }
    return s;
  }
};

/* 이미지 크기(PNG·JPEG 헤더만 읽음) */
const imgDims = (file) => {
  try {
    const b = fs.readFileSync(file);
    if (b.readUInt32BE(0) === 0x89504e47) return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
    for (let i = 2; i < b.length - 9;) {
      if (b[i] !== 0xff) { i++; continue; }
      const m = b[i + 1];
      if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) };
      i += 2 + b.readUInt16BE(i + 2);
    }
  } catch { /* 읽기 실패는 무시 */ }
  return null;
};
/* 실제 화면·표지는 앱 창 안에 담는다. 화면 비율(1.4~1.7)이면 가득 채우고, 그 밖의 비율은 흐린 배경 위에 통째로 놓는다 */
const frameOf = (w) => {
  const A = (S.assets && S.assets[w.id]) || {};
  if (A.framed) return A.framed;
  if (!w.img) return null;
  const d = imgDims(path.join(root, w.img));
  const ratio = d ? d.w / d.h : 1;
  return { src: w.img, fit: ratio >= 1.4 && ratio <= 1.7 ? "cover" : "contain" };
};

/* 같은 카테고리 안에서는 변형을 차례로 돌려 쓴다(대표 항목 순서 기준이라 일부만 다시 만들어도 모양이 같다) */
const VAR = makeVariants({ R, Ln, Ci, Pl, bars, INK, MID, SOFT, LINE, ACC });
const seen = {};
const viOf = {};
tops.forEach((w) => { seen[w.cat] = seen[w.cat] || 0; viOf[w.id] = seen[w.cat]++; });
const motifFor = (w, r) => {
  const base = MOTIF[w.cat] || MOTIF.knowledge;
  const vs = (VAR[w.cat] || [null]).map((f) => f || base);
  return vs[(viOf[w.id] || 0) % vs.length](r);
};

const html = (w) => {
  const r = rng(hash(w.id));
  const A = (S.assets && S.assets[w.id]) || {};
  const lg = A.logo || "";
  const logo = lg ? pathToFileURL(path.join(root, lg)).href : "";
  const fr = frameOf(w); // { src, fit: "cover" | "contain" }
  const frUrl = fr ? pathToFileURL(path.join(root, fr.src)).href : "";
  const motif = fr ? "" : motifFor(w, r);
  const title = (w.en || w.name).toUpperCase().slice(0, 30);
  return `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
html,body{width:800px;height:600px;overflow:hidden;background:#e7ebef}
body{position:relative;font-family:"Segoe UI","Malgun Gothic",sans-serif}
.win{position:absolute;left:56px;top:62px;width:688px;height:476px;background:#fff;border-radius:16px;box-shadow:0 22px 44px rgba(20,30,40,.14),0 2px 6px rgba(20,30,40,.08);overflow:hidden}
.bar{height:44px;display:flex;align-items:center;gap:7px;padding:0 18px;background:#f6f8fa;border-bottom:1px solid ${LINE}}
.bar i{width:10px;height:10px;border-radius:50%;background:#cfd6dc;display:block}
.bar b{margin-left:12px;font:600 12px "Segoe UI",sans-serif;letter-spacing:.14em;color:${MID}}
.bar span{margin-left:auto;font:600 11px "Malgun Gothic",sans-serif;color:${ACC};border:1px solid ${ACC};border-radius:10px;padding:2px 9px}
.bar img{margin-left:auto;height:28px;max-width:140px;object-fit:contain}
svg{display:block;position:absolute;left:0;top:44px}
.shot{position:absolute;left:0;top:44px;width:688px;height:432px;overflow:hidden;background:#f1f4f6}
.shot.cover img{width:100%;height:100%;object-fit:cover;object-position:top center;display:block}
.shot.contain{display:flex;align-items:center;justify-content:center}
.shot.contain .bg{position:absolute;left:-30px;top:-30px;right:-30px;bottom:-30px;background-size:cover;background-position:center;filter:blur(26px) saturate(1.15);opacity:.5}
.shot.contain img{position:relative;max-height:380px;max-width:600px;object-fit:contain;border-radius:8px;box-shadow:0 12px 30px rgba(20,30,40,.24)}
</style>
<div class="win"><div class="bar"><i></i><i></i><i></i><b>${esc(title)}</b>${logo ? `<img src="${logo}">` : `<span>${esc(w.status || "")}</span>`}</div>
${fr ? `<div class="shot ${fr.fit === "contain" ? "contain" : "cover"}">${fr.fit === "contain" ? `<div class="bg" style="background-image:url('${frUrl}')"></div>` : ""}<img src="${frUrl}"></div>`
  : `<svg width="688" height="432" viewBox="0 0 688 432" xmlns="http://www.w3.org/2000/svg">${motif}</svg>`}</div>`;
};

/* 전체를 다시 만들 때는 대표 항목에 없는 옛 썸네일을 지운다 */
if (!want.length) {
  const keep = new Set(tops.map((w) => w.id + ".png"));
  for (const f of fs.readdirSync(outDir)) if (f.endsWith(".png") && !keep.has(f)) fs.rmSync(path.join(outDir, f), { force: true });
}

let ok = 0;
for (const w of list) {
  const hp = path.join(tmpDir, w.id + ".html");
  const png = path.join(outDir, w.id + ".png");
  fs.writeFileSync(hp, html(w), "utf8");
  try {
    execFileSync(edge, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1", "--window-size=800,600", "--virtual-time-budget=1500", `--screenshot=${png}`, pathToFileURL(hp).href], { stdio: "ignore", timeout: 60000 });
    ok++;
  } catch (e) { console.error("실패", w.id, String(e.message).slice(0, 80)); }
  fs.rmSync(hp, { force: true });
}
fs.rmSync(tmpDir, { recursive: true, force: true });
console.log(`썸네일 ${ok}/${list.length} 생성 → assets/img/thumb`);
