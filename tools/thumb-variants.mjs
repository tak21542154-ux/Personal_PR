// 썸네일 생성기(make-thumbs.mjs)의 카테고리별 변형 그림. 같은 카테고리에서도 서로 다른 모양이 나오게 한다.
// 각 함수는 rng 를 받아 688x432 내용 영역에 그릴 SVG 문자열을 돌려준다. 0번 변형은 make-thumbs.mjs 의 기본 그림이다.
export function makeVariants({ R, Ln, Ci, Pl, bars, INK, MID, SOFT, LINE, ACC }) {
  return {
    growth: [
      null,
      (r) => { // 메일 작성기 + 대상 목록
        let s = R(28, 28, 372, 376, "#fff", 12, LINE) + R(44, 46, 60, 8, SOFT, 4) + R(116, 42, 200, 16, "#f6f8fa", 8) + R(44, 78, 60, 8, SOFT, 4) + R(116, 74, 240, 16, "#f6f8fa", 8) + Ln(28, 112, 400, 112, LINE, 1);
        for (let i = 0; i < 7; i++) s += R(44, 132 + i * 24, 140 + r() * 190, 8, i === 2 ? INK : SOFT, 4);
        s += R(44, 340, 96, 40, ACC, 10) + R(66, 356, 52, 8, "#fff", 4);
        for (let i = 0; i < 5; i++) { const y = 28 + i * 76; s += R(420, y, 240, 66, "#fff", 12, LINE) + Ci(448, y + 33, 16, i === 1 ? ACC : "#d3dae0") + R(476, y + 18, 90 + r() * 40, 9, INK, 4) + R(476, y + 36, 70, 7, SOFT, 4) + R(600, y + 24, 44, 18, i < 2 ? "#f6e9ee" : "#eef1f4", 9); }
        return s;
      },
      (r) => { // 칸반
        let s = "";
        for (let c = 0; c < 4; c++) {
          const x = 28 + c * 160;
          s += R(x, 28, 148, 376, "#f6f8fa", 12) + R(x + 14, 44, 60, 9, INK, 4) + Ci(x + 126, 49, 9, c === 3 ? ACC : "#d3dae0");
          const n = 2 + Math.floor(r() * 3);
          for (let i = 0; i < n; i++) { const y = 72 + i * 92, hot = i === 0 && c === 2; s += R(x + 10, y, 128, 80, "#fff", 10, hot ? ACC : LINE, hot ? 2 : 1) + R(x + 22, y + 14, 90 + r() * 20, 9, INK, 4) + R(x + 22, y + 34, 70, 7, SOFT, 4) + R(x + 22, y + 54, 40, 14, c === 3 ? ACC : "#e3e7ea", 7); }
        }
        return s;
      },
      (r) => { // 영상 재생기와 목록
        let s = R(28, 28, 400, 240, INK, 14) + `<path d="M196 118 L196 178 L252 148 Z" fill="#fff"/>` + R(44, 240, 368, 6, "#3b4148", 3) + R(44, 240, 200, 6, ACC, 3) + Ci(244, 243, 8, "#fff");
        s += R(28, 288, 400, 12, INK, 5) + R(28, 312, 300, 8, SOFT, 4) + R(28, 332, 240, 8, SOFT, 4);
        for (let i = 0; i < 4; i++) { const y = 28 + i * 94; s += R(448, y, 212, 84, "#fff", 10, LINE) + R(458, y + 10, 92, 64, i === 0 ? ACC : "#e3e7ea", 6) + `<path d="M496 ${y + 30} L496 ${y + 54} L518 ${y + 42} Z" fill="#fff"/>` + R(562, y + 18, 80, 9, INK, 4) + R(562, y + 38, 60, 7, SOFT, 4) + R(562, y + 54, 40, 7, SOFT, 4); }
        return s;
      }
    ],
    skills: [
      null,
      (r) => { // 스킬 카드 격자
        let s = "";
        for (let i = 0; i < 6; i++) { const x = 28 + (i % 3) * 218, y = 28 + Math.floor(i / 3) * 192, sel = i === 1; s += R(x, y, 204, 178, "#fff", 14, sel ? ACC : LINE, sel ? 3 : 1) + R(x + 18, y + 18, 40, 40, sel ? ACC : "#e3e7ea", 10) + R(x + 18, y + 78, 100 + r() * 50, 11, INK, 5) + R(x + 18, y + 100, 150, 7, SOFT, 4) + R(x + 18, y + 116, 110, 7, SOFT, 4) + R(x + 18, y + 142, 56, 20, sel ? "#f6e9ee" : "#eef1f4", 10); }
        return s;
      },
      (r) => { // 설정 파일 편집기
        let s = R(28, 28, 170, 376, "#f6f8fa", 12);
        for (let i = 0; i < 9; i++) { const o = i % 3 === 0 ? 0 : 16; s += R(44 + o, 50 + i * 38, 14, 12, i === 4 ? ACC : "#b7c0c7", 3) + R(66 + o, 51 + i * 38, 70 + r() * 30, 9, i === 4 ? INK : SOFT, 4); }
        s += R(214, 28, 446, 376, "#fff", 12, LINE);
        const ind = [0, 0, 24, 24, 24, 0, 24, 48, 48, 24, 0, 24, 24, 0];
        for (let i = 0; i < 14; i++) { const y = 50 + i * 26; if (i === 6) s += R(222, y - 7, 424, 22, "rgba(140,35,70,.09)", 4); s += R(232, y, 18, 8, "#dfe5e9", 4) + R(268 + ind[i], y, 60 + r() * 190, 8, i === 6 ? ACC : i % 3 === 0 ? INK : SOFT, 4); }
        return s;
      }
    ],
    automation: [
      null,
      (r) => { // 일정 달력 + 로그
        let s = R(28, 28, 420, 376, "#fff", 12, LINE);
        for (let c = 0; c < 7; c++) s += R(48 + c * 56, 46, 30, 8, SOFT, 4);
        for (let w = 0; w < 5; w++) for (let c = 0; c < 7; c++) { const on = r() > 0.55, x = 48 + c * 56, y = 78 + w * 60; s += R(x - 6, y - 6, 48, 48, on ? "#f6e9ee" : "#f6f8fa", 10) + Ci(x + 18, y + 18, on ? 8 : 5, on ? ACC : "#cfd6dc"); }
        s += R(468, 28, 192, 376, INK, 12);
        for (let i = 0; i < 12; i++) s += R(486, 52 + i * 28, 20 + r() * 26, 7, i % 5 === 1 ? ACC : MID, 3) + R(520, 52 + i * 28, 40 + r() * 90, 7, "#8a949c", 3);
        return s;
      },
      (r) => { // 파이프라인 레인
        let s = "";
        for (let i = 0; i < 4; i++) { const y = 28 + i * 94; s += R(28, y, 632, 82, "#fff", 12, LINE) + R(46, y + 22, 90, 10, INK, 5) + R(46, y + 42, 56, 7, SOFT, 4); for (let k = 0; k < 6; k++) { const done = k < 2 + i + (i === 2 ? 1 : 0); s += R(170 + k * 80, y + 28, 68, 26, done ? (i === 1 && k === 3 ? ACC : INK) : "#e3e7ea", 8); } }
        return s;
      },
      (r) => { // 상태 계기판 + 로그
        let s = "";
        for (let i = 0; i < 4; i++) {
          const cx = 98 + i * 164, cy = 100, v = 0.3 + r() * 0.65, a = Math.PI * 2 * v;
          s += R(28 + i * 164, 28, 150, 150, "#fff", 12, LINE) + Ci(cx, cy, 44, "none", "#e3e7ea", 10) + `<path d="M${cx} ${cy - 44} A44 44 0 ${v > 0.5 ? 1 : 0} 1 ${(cx + 44 * Math.sin(a)).toFixed(1)} ${(cy - 44 * Math.cos(a)).toFixed(1)}" fill="none" stroke="${i === 2 ? ACC : INK}" stroke-width="10" stroke-linecap="round"/>` + R(cx - 16, cy - 5, 32, 10, INK, 5);
        }
        s += R(28, 198, 632, 206, "#fff", 12, LINE);
        for (let i = 0; i < 6; i++) { const y = 222 + i * 30; s += Ci(54, y + 4, 6, i === 3 ? ACC : "#cfd6dc") + R(76, y, 60 + r() * 30, 8, INK, 4) + R(180, y, 160 + r() * 200, 8, SOFT, 4) + R(590, y - 2, 44, 14, "#eef1f4", 7); }
        return s;
      }
    ],
    agents: [
      null,
      (r) => { // 조직도
        const box = (x, y, acc) => R(x, y, 120, 52, acc ? ACC : "#fff", 12, acc ? ACC : INK, 2) + Ci(x + 24, y + 26, 11, acc ? "#fff" : INK) + R(x + 44, y + 17, 56, 8, acc ? "rgba(255,255,255,.8)" : INK, 4) + R(x + 44, y + 32, 40, 6, acc ? "rgba(255,255,255,.5)" : SOFT, 3);
        let s = Ln(344, 80, 344, 120, "#b3bcc3", 3) + Ln(124, 120, 564, 120, "#b3bcc3", 3);
        [124, 344, 564].forEach((x) => (s += Ln(x, 120, x, 150, "#b3bcc3", 3)));
        s += box(284, 28, true);
        [64, 284, 504].forEach((x) => (s += box(x, 150, false)));
        [124, 344, 564].forEach((x, i) => { s += Ln(x, 202, x, 232, "#b3bcc3", 3) + Ln(x - 60, 232, x + 60, 232, "#b3bcc3", 3) + Ln(x - 60, 232, x - 60, 262, "#b3bcc3", 3) + Ln(x + 60, 232, x + 60, 262, "#b3bcc3", 3); s += R(x - 112, 262, 104, 46, "#fff", 10, LINE) + R(x + 8, 262, 104, 46, i === 1 ? "#f6e9ee" : "#fff", 10, LINE) + R(x - 100, 280, 60, 8, SOFT, 4) + R(x + 20, 280, 60, 8, i === 1 ? ACC : SOFT, 4); });
        s += R(28, 336, 632, 68, "#f6f8fa", 12);
        for (let i = 0; i < 6; i++) s += Ci(60 + i * 48, 370, 14, i % 2 ? "#d3dae0" : INK);
        return s;
      }
    ],
    knowledge: [
      null,
      (r) => { // 폴더 트리 + 문서 미리보기
        let s = R(28, 28, 210, 376, "#f6f8fa", 12);
        [[0, 1], [1, 0], [1, 0], [0, 1], [1, 0], [1, 0], [1, 0], [0, 1], [1, 0]].forEach(([ind, folder], i) => { s += (folder ? `<path d="M${44 + ind * 18} ${58 + i * 38} h12 l4 5 h14 v18 h-30 z" fill="${i === 3 ? ACC : "#b7c0c7"}"/>` : R(44 + ind * 18, 56 + i * 38, 22, 22, "#d3dae0", 4)) + R(82 + ind * 18, 60 + i * 38, 70 + r() * 30, 9, i === 4 ? INK : SOFT, 4); });
        s += R(256, 28, 404, 376, "#fff", 12, LINE) + R(280, 52, 190, 16, INK, 6) + R(280, 80, 60, 8, ACC, 4);
        for (let i = 0; i < 9; i++) s += R(280, 112 + i * 26, 240 + r() * 100, 8, SOFT, 4);
        s += R(280, 352, 92, 30, "#f6e9ee", 15) + R(388, 352, 70, 30, "#eef1f4", 15);
        return s;
      },
      (r) => { // 위키 문서
        let s = R(28, 28, 150, 376, "#f6f8fa", 12);
        for (let i = 0; i < 8; i++) s += R(44, 52 + i * 34, 90 - (i % 3) * 18, 8, i === 2 ? ACC : SOFT, 4);
        s += R(198, 28, 462, 376, "#fff", 12, LINE) + R(222, 50, 240, 18, INK, 6) + R(222, 84, 400, 8, SOFT, 4) + R(222, 102, 360, 8, SOFT, 4);
        s += R(222, 130, 416, 120, "#eef1f4", 10) + `<path d="M240 232 L300 170 L350 210 L400 160 L480 232 Z" fill="#cfd6dc"/>` + Ci(560, 170, 22, ACC);
        for (let i = 0; i < 4; i++) s += R(222, 272 + i * 26, 260 + r() * 140, 8, SOFT, 4);
        return s;
      }
    ],
    brand: [
      null,
      (r) => { // 타임라인 카드
        let s = Ln(40, 216, 648, 216, "#b3bcc3", 4);
        [0, 1, 2, 3].forEach((i) => { const x = 60 + i * 150, up = i % 2 === 0, y0 = up ? 60 : 280; s += Ci(x + 60, 216, 12, i === 3 ? ACC : INK) + Ln(x + 60, up ? 150 : 232, x + 60, up ? 204 : 280, "#b3bcc3", 3) + R(x, y0, 120, 90, "#fff", 12, i === 3 ? ACC : LINE, i === 3 ? 3 : 1) + R(x + 14, y0 + 18, 50, 12, i === 3 ? ACC : INK, 5) + R(x + 14, y0 + 42, 90, 7, SOFT, 4) + R(x + 14, y0 + 58, 70, 7, SOFT, 4); });
        return s;
      }
    ],
    creative: [
      null,
      (r) => { // 영상 편집 타임라인
        let s = R(28, 28, 400, 224, INK, 12) + `<path d="M196 100 L196 160 L252 130 Z" fill="#fff"/>` + R(448, 28, 212, 224, "#f6f8fa", 12, LINE);
        for (let i = 0; i < 5; i++) s += R(464, 48 + i * 40, 180, 28, "#fff", 8, LINE) + Ci(480, 62 + i * 40, 8, i === 1 ? ACC : "#cfd6dc") + R(498, 58 + i * 40, 90 + r() * 40, 7, SOFT, 4);
        for (let t = 0; t < 3; t++) { const y = 272 + t * 44; s += R(28, y, 632, 36, "#f6f8fa", 8); let x = 36; let k = 0; while (x < 600) { const w = 40 + r() * 110; s += R(x, y + 4, Math.min(w, 640 - x), 28, t === 1 && k % 3 === 0 ? ACC : t === 0 ? INK : "#b7c0c7", 6); x += w + 8; k++; } }
        s += Ln(300, 262, 300, 404, ACC, 3);
        return s;
      },
      (r) => { // 슬라이드 덱
        let s = R(28, 28, 460, 258, "#fff", 12, LINE) + R(52, 56, 220, 18, INK, 6) + R(52, 88, 160, 9, ACC, 4);
        for (let i = 0; i < 4; i++) s += R(52, 120 + i * 24, 180 + r() * 100, 8, SOFT, 4);
        s += R(300, 120, 164, 140, "#eef1f4", 10) + Ci(382, 176, 26, ACC) + R(330, 224, 104, 10, INK, 5);
        for (let i = 0; i < 5; i++) s += R(28 + i * 128, 308, 116, 88, "#fff", 10, i === 0 ? ACC : LINE, i === 0 ? 3 : 1) + R(40 + i * 128, 322, 60, 8, INK, 4) + R(40 + i * 128, 346, 90, 18, "#eef1f4", 6);
        s += R(508, 28, 152, 258, "#f6f8fa", 12) + bars(524, 52, [90, 70, 100, 60, 80, 50], 8, 20, SOFT);
        return s;
      }
    ],
    data: [
      null,
      (r) => { // 막대 + 선 대시보드
        let s = "";
        for (let i = 0; i < 3; i++) s += R(28 + i * 216, 28, 200, 74, "#fff", 10, LINE) + R(44 + i * 216, 44, 50, 8, SOFT, 4) + R(44 + i * 216, 62, 80 + r() * 40, 18, i === 1 ? ACC : INK, 5);
        s += R(28, 118, 310, 286, "#fff", 10, LINE) + R(348, 118, 312, 286, "#fff", 10, LINE);
        for (let i = 0; i < 9; i++) { const h = 30 + r() * 190; s += R(48 + i * 31, 384 - h, 20, h, i === 6 ? ACC : "#cfd6dc", 4); }
        const pts = []; let v = 300; for (let i = 0; i < 12; i++) { v += (r() - 0.62) * 50; v = Math.max(160, Math.min(370, v)); pts.push([368 + i * 25, v]); }
        s += Pl(pts, INK, 3) + Pl(pts.map(([x, y]) => [x, y + 24]), ACC, 3);
        return s;
      },
      (r) => { // 터미널 + 대화
        let s = R(28, 28, 400, 376, INK, 12) + Ci(50, 50, 5, "#4a525a") + Ci(68, 50, 5, "#4a525a") + Ci(86, 50, 5, "#4a525a");
        for (let i = 0; i < 12; i++) { const y = 84 + i * 26; s += R(48, y, 12, 8, i % 4 === 0 ? ACC : MID, 4) + R(72, y, 50 + r() * 200, 8, i % 4 === 0 ? "#e3e7ea" : "#7a848c", 4); }
        s += R(448, 28, 212, 376, "#f6f8fa", 12);
        s += R(464, 52, 150, 44, "#fff", 14, LINE) + R(480, 68, 100, 8, SOFT, 4) + R(500, 120, 144, 44, INK, 14) + R(516, 136, 90, 8, "rgba(255,255,255,.8)", 4) + R(464, 188, 170, 60, "#fff", 14, LINE) + R(480, 204, 120, 8, SOFT, 4) + R(480, 222, 90, 8, SOFT, 4) + R(500, 272, 144, 44, ACC, 14) + R(516, 288, 90, 8, "rgba(255,255,255,.8)", 4);
        return s;
      }
    ],
    ops: [
      null,
      (r) => { // 배차 보드: 목록 + 지도
        let s = R(28, 28, 250, 376, "#fff", 12, LINE);
        for (let i = 0; i < 6; i++) { const y = 44 + i * 58; s += R(40, y, 226, 48, i === 1 ? "#f6e9ee" : "#f6f8fa", 10) + R(52, y + 12, 90, 9, INK, 4) + R(52, y + 28, 120, 7, SOFT, 4) + R(212, y + 14, 40, 18, i === 1 ? ACC : "#e3e7ea", 9); }
        s += R(298, 28, 362, 376, "#eef1f4", 12);
        for (let i = 1; i < 7; i++) s += Ln(298, 28 + i * 54, 660, 28 + i * 54, "#e1e6ea", 2);
        for (let i = 1; i < 6; i++) s += Ln(298 + i * 60, 28, 298 + i * 60, 404, "#e1e6ea", 2);
        s += Pl([[340, 350], [420, 280], [470, 300], [540, 200], [610, 140]], INK, 4);
        [[340, 350], [470, 300], [610, 140]].forEach(([x, y], i) => (s += Ci(x, y, 14, i === 2 ? ACC : "#fff", INK, 3)));
        return s;
      }
    ]
  };
}
