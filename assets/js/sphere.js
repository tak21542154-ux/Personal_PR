/* 히어로의 가는 선 구체 (캔버스). 모션 줄이기 설정이면 정지 화면 한 장만 그립니다. */
(function () {
  var cv = document.getElementById("sphere");
  if (!cv) return;
  var ctx = cv.getContext("2d");
  var still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var w = 0, h = 0, dpr = 1, t = 0;

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = cv.getBoundingClientRect();
    w = r.width; h = r.height;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function set(n, phase, rot, alpha) {
    var R = Math.min(w, h) * 0.44, cx = w / 2, cy = h / 2;
    ctx.strokeStyle = "rgba(0,0,0," + alpha + ")";
    ctx.lineWidth = 0.6;
    for (var k = 0; k < n; k++) {
      var a = (k / n) * Math.PI + phase;
      var rx = R * Math.abs(Math.cos(a));
      var ry = R * (0.86 + 0.14 * Math.sin(k * 0.35 + t));
      ctx.beginPath();
      ctx.ellipse(cx, cy, Math.max(rx, 1), ry, rot + k * 0.012, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    set(56, t * 0.25, t * 0.12, 0.42);
    set(40, 1.1 + t * 0.18, 1.2 - t * 0.09, 0.3);
    if (!still) { t += 0.006; requestAnimationFrame(draw); }
  }

  size(); draw();
  window.addEventListener("resize", function () { size(); if (still) draw(); });
})();
