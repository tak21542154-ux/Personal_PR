(function () {
  var S = window.SITE;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var catOf = function (id) { return S.categories.filter(function (c) { return c.id === id; })[0] || S.categories[0]; };
  var initial = function (w) { return esc((w.en || w.name).charAt(0)); };
  /* 썸네일: 대표 이미지(로고·화면) → 없으면 생성 썸네일 → 그것도 없으면 첫 글자 */
  var thumbOf = function (w) { return w.img || ("assets/img/thumb/" + w.id + ".png"); };
  /* 카드·대표 칸: 항상 앱 창 틀의 생성 썸네일(실제 화면이 있으면 그 화면이 창 안에 담김). 상세 상단: 실제 이미지 우선 */
  var cardThumb = function (w) { return "assets/img/thumb/" + w.id + ".png"; };
  var vis = function (w, card) {
    var src = card ? cardThumb(w) : thumbOf(w);
    var fb = card && w.img ? ' onerror="this.onerror=function(){this.remove()};this.src=\'' + esc(w.img) + '\'"' : ' onerror="this.remove()"';
    return "<i>" + initial(w) + '</i><img src="' + esc(src) + '" alt="' + esc(w.name) + ' 미리보기" loading="lazy"' + fb + '>';
  };
  var whyOf = function (w) { return w.why || (w.body ? w.body.slice(0, 1) : []); };
  var howOf = function (w) { return w.how || (w.body ? w.body.slice(1) : []); };
  var params = new URLSearchParams(location.search);

  /* 카테고리 순서대로 정렬 (같은 카테고리 안에서는 작성 순서 유지) */
  (function () {
    var order = {}; S.categories.forEach(function (c, i) { order[c.id] = i; });
    S.works = S.works.map(function (w, i) { return { w: w, i: i }; }).sort(function (a, b) { return (order[a.w.cat] - order[b.w.cat]) || (a.i - b.i); }).map(function (x) { return x.w; });
  })();

  /* 묶음 적용: 하위 항목은 대표 항목 안에서 설명하고, 목록에는 대표 항목만 올린다 */
  var byId = {};
  S.works.forEach(function (w) { byId[w.id] = w; w.kids = []; });
  Object.keys(S.groups || {}).forEach(function (pid) {
    var p = byId[pid]; if (!p) return;
    S.groups[pid].forEach(function (kid) { var k = byId[kid]; if (k && k !== p) { k.parent = p; p.kids.push(k); } });
  });
  var tops = S.works.filter(function (w) { return !w.parent; });

  /* 공통: 이름, 연도, 연락 버튼, 헤더, 모바일 메뉴 */
  document.querySelectorAll("[data-site]").forEach(function (el) { el.textContent = S[el.getAttribute("data-site")]; });
  var yr = $("#yr"); if (yr) yr.textContent = new Date().getFullYear();

  var btn = $("#ctBtn"), note = $("#ctNote");
  if (btn) {
    if (S.contact.email) { btn.href = "mailto:" + S.contact.email; if (note) note.textContent = S.contact.email + (S.contact.phone ? "  ·  " + S.contact.phone : ""); }
    else if (note) note.textContent = S.contact.note;
  }

  var hd = $("#hd"), burger = $("#burger"), gnb = $("#gnb");
  function onScroll() { if (!hd.classList.contains("is-solid")) hd.classList.toggle("is-on", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();
  burger.addEventListener("click", function () {
    var open = !gnb.classList.contains("is-open");
    gnb.classList.toggle("is-open", open);
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", open);
    document.body.classList.toggle("noscroll", open);
  });
  gnb.addEventListener("click", function (e) { if (e.target.tagName === "A") { gnb.classList.remove("is-open"); burger.classList.remove("is-open"); document.body.classList.remove("noscroll"); } });

  function reveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!("IntersectionObserver" in window)) { els.forEach(function (e) { e.classList.add("in"); }); return; }
    var io = new IntersectionObserver(function (ents) { ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }); }, { threshold: 0.12 });
    els.forEach(function (e) { io.observe(e); });
  }

  function cardHtml(w) {
    var c = catOf(w.cat);
    return '<a class="card" href="product.html?id=' + esc(w.id) + '"><div class="card__vis"><span class="card__tag">' + esc(c.en) + '</span><span class="card__st">' + esc(w.status) + '</span>' + vis(w, true) +
      (w.kids.length ? '<span class="card__k">기능 ' + w.kids.length + '</span>' : '') + '</div>' +
      '<div class="card__b"><time>' + esc(w.period) + '</time><h3>' + esc(w.name) + '</h3><p>' + esc(w.line) + '</p><span class="more more--s">View More <b>+</b></span></div></a>';
  }

  /* ───── 메인 ───── */
  if (document.body.classList.contains("home")) {
    $("#heroT").innerHTML = S.hero.map(esc).join("<br>");
    $("#heroSub").textContent = S.heroSub;
    $("#ovKo").textContent = S.intro.ko;
    $("#ovP").textContent = S.intro.body;
    $("#nCat").textContent = S.categories.length;
    $("#nWork").textContent = tops.length;

    /* Services: 카테고리 격자 */
    var svc = $("#svc");
    svc.innerHTML = S.categories.map(function (c) {
      var n = tops.filter(function (w) { return w.cat === c.id; }).length;
      return '<a class="svc__c" href="?cat=' + c.id + '#works" data-cat="' + c.id + '">' +
        '<span class="svc__no">' + c.no + '</span><span class="svc__en">' + esc(c.en) + '</span><strong class="svc__ko">' + esc(c.ko) + '</strong>' +
        '<span class="svc__d">' + esc(c.desc) + '</span><span class="svc__n">' + n + ' items</span></a>';
    }).join("");
    svc.addEventListener("click", function (e) {
      var a = e.target.closest(".svc__c"); if (!a) return;
      e.preventDefault(); setFilter(a.getAttribute("data-cat"));
      $("#works").scrollIntoView({ behavior: "smooth" });
    });

    /* 대표 제품 띠 */
    var f = tops.filter(function (w) { return w.featured; })[0] || tops[0];
    $("#featTxt").innerHTML = '<h2 class="band__t">' + esc(f.en) + '</h2><p class="band__ko">' + esc(f.name) + ' — ' + esc(f.line) + '</p><p class="band__p">' + esc(whyOf(f)[0] || "") + '</p><a class="more" href="product.html?id=' + esc(f.id) + '">View More <b>+</b></a>';
    $("#featMark").innerHTML = vis(f, true); $("#featMark").parentNode.classList.add("has-img");

    /* Works: 검색 + 필터 + 더보기 (대표 항목만, 검색은 하위 기능까지) */
    var chips = $("#chips"), grid = $("#grid"), q = $("#q"), more = $("#moreBtn"), cnt = $("#cnt");
    var cur = "all", term = "", shown = 12, STEP = 12;
    var urlCat = params.get("cat");
    if (urlCat && S.categories.some(function (c) { return c.id === urlCat; })) cur = urlCat;
    if (params.get("q")) { term = params.get("q").toLowerCase(); q.value = params.get("q"); }

    chips.innerHTML = '<button class="chip" data-f="all">All</button>' + S.categories.map(function (c) { return '<button class="chip" data-f="' + c.id + '">' + esc(c.en) + '</button>'; }).join("");
    chips.addEventListener("click", function (e) { var b = e.target.closest(".chip"); if (b) setFilter(b.getAttribute("data-f")); });
    q.addEventListener("input", function () { term = q.value.trim().toLowerCase(); shown = STEP; draw(); });
    more.addEventListener("click", function () { shown += STEP; draw(true); });

    function setFilter(id) {
      cur = id; shown = STEP;
      var u = new URL(location.href); if (id === "all") u.searchParams.delete("cat"); else u.searchParams.set("cat", id);
      history.replaceState(null, "", u.pathname + u.search + "#works");
      draw();
    }
    function hay1(w) { return [w.name, w.en, w.line, w.type, w.stack, (w.tags || []).join(" ")].join(" "); }
    function hay(w) { return (hay1(w) + " " + w.kids.map(hay1).join(" ")).toLowerCase(); }
    function draw(keep) {
      chips.querySelectorAll(".chip").forEach(function (b) { var on = b.getAttribute("data-f") === cur; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
      var list = tops.filter(function (w) { return (cur === "all" || w.cat === cur) && (!term || hay(w).indexOf(term) > -1); });
      var from = keep ? Math.max(0, shown - STEP) : 0;
      var part = list.slice(from, shown);
      var html = part.map(cardHtml).join("");
      if (keep) grid.insertAdjacentHTML("beforeend", html); else grid.innerHTML = html || '<p class="empty">조건에 맞는 항목이 없습니다.</p>';
      grid.querySelectorAll(".card").forEach(function (e, i) { e.style.animationDelay = ((i % STEP) * 35) + "ms"; });
      cnt.textContent = list.length + " items";
      more.hidden = shown >= list.length;
    }
    draw();
    if (urlCat && location.hash === "#works") setTimeout(function () { $("#works").scrollIntoView(); }, 50);
    reveal();
  }

  /* ───── 상세 ───── */
  if (document.body.classList.contains("detail")) {
    var id = params.get("id");
    var w = byId[id];
    var root = $("#detail");
    if (!w) { root.innerHTML = '<section class="sec"><div class="wrap"><h1 class="h2">찾는 페이지가 없습니다</h1><p><a class="more" href="index.html#works">Works 로 돌아가기 <b>+</b></a></p></div></section>'; }
    else {
      var c = catOf((w.parent || w).cat);
      var top = w.parent || w;
      /* 이전·다음: 하위 항목은 같은 묶음 안에서, 대표 항목은 같은 카테고리 대표 항목끼리 */
      var sib = w.parent ? w.parent.kids : tops.filter(function (x) { return x.cat === w.cat; });
      var si = sib.indexOf(w);
      var prev = sib[(si - 1 + sib.length) % sib.length], next = sib[(si + 1) % sib.length];
      var related = (w.parent ? w.parent.kids : tops.filter(function (x) { return x.cat === w.cat; })).filter(function (x) { return x !== w; }).slice(0, 3);
      document.title = w.name + " · " + S.name;
      var meta = [["Status", w.status], ["Type", w.type], ["Stack", w.stack], ["Period", w.period]].filter(function (m) { return m[1] && m[1] !== "-"; });
      var why = whyOf(w), how = howOf(w);
      var sec = function (cls, label, small, inner) { return '<section class="sec ' + cls + '"><div class="wrap dgrid"><div class="dgrid__l"><h2 class="h2 h2--sm">' + (small ? '<small>' + small + '</small>' : '') + label + '</h2></div><div class="dgrid__r">' + inner + '</div></div></section>'; };
      var paras = function (a) { return a.map(function (p) { return '<p class="lead">' + esc(p) + '</p>'; }).join(""); };

      /* 바로가기 링크: links 와 url 을 합쳐 보여 준다 */
      var links = (w.links || []).slice();
      if (w.url && !links.some(function (l) { return l.href === w.url; })) links.unshift({ label: "Visit Site", href: w.url });
      var linksHtml = links.length ? '<div class="dh__links" aria-label="바로가기">' + links.map(function (l) { return '<a class="btn-s" href="' + esc(l.href) + '" target="_blank" rel="noopener">' + esc(l.label) + ' <b>↗</b></a>'; }).join("") + '</div>' : "";

      /* 묶음의 하위 기능: 설명을 한 페이지에서 이어서 읽고, 필요하면 개별 페이지로 */
      var kidsHtml = "";
      if (w.kids.length) {
        kidsHtml = '<section class="sec"><div class="wrap"><h2 class="h2 h2--sm"><small>Included</small>구성 기능 <span class="kids__n">' + w.kids.length + '</span></h2><p class="sub">항목을 눌러 펼치면 왜 만들어졌고 어떻게 동작하는지를 이 페이지에서 이어서 읽을 수 있습니다.</p><div class="kids">' +
          w.kids.map(function (k, ki) {
            var kw = (whyOf(k)[0] || ""); if (kw.length > 120) kw = kw.slice(0, 118).replace(/\s+\S*$/, "") + "…";
            var body = whyOf(k).concat(howOf(k)).map(function (p) { return '<p>' + esc(p) + '</p>'; }).join("") +
              ((k.features && k.features.length) ? '<ul class="kid__ul">' + k.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join("") + '</ul>' : "") +
              '<a class="more more--s" href="product.html?id=' + esc(k.id) + '">개별 페이지 <b>+</b></a>';
            return '<details class="kid" data-reveal' + (ki >= 10 ? ' hidden data-more' : '') + '><summary><strong>' + esc(k.name) + '</strong><span class="kid__l">' + esc(k.line) + '</span><span class="kid__w">' + esc(kw) + '</span>' +
              ((k.features && k.features.length) ? '<span class="kid__f">' + k.features.slice(0, 3).map(function (f) { return '<em>' + esc(f) + '</em>'; }).join("") + '</span>' : '') + '</summary><div class="kid__b">' + body + '</div></details>';
          }).join("") + '</div>' + (w.kids.length > 10 ? '<p class="kids__btn"><button type="button" class="more" id="kidsMore">나머지 ' + (w.kids.length - 10) + '개 펼치기 <b>+</b></button></p>' : '') + '</div></section>';
      }

      /* 타임라인: 대표 항목은 하위 기능의 첫 이정표를 함께 시간순으로 보여 준다 */
      var tl = (w.timeline || []).map(function (t) { return { date: t.date, title: t.title, desc: t.desc }; });
      if (w.kids.length) {
        w.kids.forEach(function (k) {
          var ts = (k.timeline || []).filter(function (t) { return t.date; }).slice().sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
          if (ts.length) tl.push({ date: ts[0].date, title: k.name + " · " + ts[0].title, desc: ts[0].desc });
        });
        tl.sort(function (a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
        if (tl.length > 24) { var step = tl.length / 24; tl = Array.apply(null, Array(24)).map(function (_, i) { return tl[Math.floor(i * step)]; }); }
      }

      root.innerHTML =
        '<section class="dh"><div class="wrap dh__in">' +
        '<nav class="crumb" aria-label="경로"><a href="index.html">Home</a><span>/</span><a href="index.html?cat=' + esc(c.id) + '#works">' + esc(c.en) + '</a><span>/</span>' +
        (w.parent ? '<a href="product.html?id=' + esc(w.parent.id) + '">' + esc(w.parent.name) + '</a><span>/</span>' : '') + '<em>' + esc(w.name) + '</em></nav>' +
        '<h1 class="dh__t">' + esc(w.en) + '</h1><p class="dh__ko">' + esc(w.name) + '</p><p class="dh__line">' + esc(w.line) + '</p>' +
        '<dl class="meta">' + meta.map(function (m) { return '<div><dt>' + m[0] + '</dt><dd>' + esc(m[1]) + '</dd></div>'; }).join("") + '</dl>' + linksHtml +
        '<div class="dh__vis has-img">' + vis(w) + '</div></div></section>' +
        (why.length ? sec("", "Why", "왜 만들어졌나", paras(why)) : "") +
        (how.length || (w.parts && w.parts.length) ? sec("gray", "How", "어떻게 동작하나", paras(how) +
          (w.parts && w.parts.length ? '<dl class="parts">' + w.parts.map(function (p) { return '<div><dt>' + esc(p[0]) + '</dt><dd>' + esc(p[1]) + '</dd></div>'; }).join("") + '</dl>' : "")) : "") +
        (w.features && w.features.length ? sec("", "Features", "주요 기능", '<ul class="feat">' + w.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join("") + '</ul>') : "") +
        (w.shots && w.shots.length ? '<section class="sec shots"><div class="wrap"><h2 class="h2 h2--sm"><small>Process</small>단계별 화면</h2><ol class="shots__g">' + w.shots.map(function (s, i) { return '<li><figure><a href="' + esc(s.src) + '" target="_blank" rel="noopener"><img src="' + esc(s.src) + '" alt="' + esc(s.cap || w.name) + '" loading="lazy"></a><figcaption><b>' + (i < 9 ? "0" : "") + (i + 1) + '</b> ' + esc(s.cap || "") + '</figcaption></figure></li>'; }).join("") + '</ol></div></section>' : '') +
        kidsHtml +
        (tl.length ? '<section class="sec gray"><div class="wrap dgrid"><div class="dgrid__l"><h2 class="h2 h2--sm"><small>Launch to</small>Now</h2><p class="sub">런칭 과정부터 현재까지</p></div>' +
          '<ol class="tl">' + tl.map(function (t) { return '<li data-reveal><time>' + esc(t.date) + '</time><div><h3>' + esc(t.title) + '</h3><p>' + esc(t.desc) + '</p></div></li>'; }).join("") + '</ol></div></section>' : '') +
        (related.length ? '<section class="sec"><div class="wrap"><h2 class="h2 h2--sm"><small>' + (w.parent ? 'More in' : 'More in') + '</small>' + esc(w.parent ? w.parent.name : c.en) + '</h2><div class="grid grid--3">' + related.map(cardHtml).join("") + '</div></div></section>' : '') +
        '<section class="sec pn"><div class="wrap pn__in">' +
        '<a href="product.html?id=' + esc(prev.id) + '"><small>Prev</small><strong>' + esc(prev.name) + '</strong></a>' +
        (w.parent ? '<a href="product.html?id=' + esc(w.parent.id) + '" class="pn__all">' + esc(w.parent.name) + '</a>' : '<a href="index.html?cat=' + esc(c.id) + '#works" class="pn__all">All ' + esc(c.en) + '</a>') +
        '<a href="product.html?id=' + esc(next.id) + '" class="pn__n"><small>Next</small><strong>' + esc(next.name) + '</strong></a></div></section>';
      var km = $("#kidsMore");
      if (km) km.addEventListener("click", function () {
        document.querySelectorAll(".kid[data-more]").forEach(function (d) { d.hidden = false; });
        km.parentNode.remove();
      });
      /* 세로로 긴 화면(폰 캡처)은 폭을 줄여 가운데에 둔다 */
      document.querySelectorAll(".shots__g img").forEach(function (im) {
        var mark = function () { var li = im.closest("li"); if (im.naturalHeight > im.naturalWidth * 1.3) li.classList.add(im.naturalWidth >= 1400 ? "is-wide" : "is-tall"); };
        if (im.complete) mark(); else im.addEventListener("load", mark);
      });
      reveal();
    }
  }
})();
