/* 항목 작성 헬퍼. 짧은 키로 적고 여기서 표준 항목으로 바꿉니다.
   c 카테고리 · i id · n 이름 · e 영문 · l 한 줄 · s 상태 · t 유형 · k 스택 · p 기간
   y 왜(문단 배열) · h 어떻게(문단 배열) · f 기능 · tl [[날짜, 제목, 설명]] · pt [[이름, 설명]] · g 검색 태그
   img 대표 이미지(로고·화면, 없으면 생성 썸네일) · url 대표 링크 · links [[이름, 주소]] 바로가기
   shots [[이미지, 설명]] 단계별 화면 · feat 대표 · 묶음은 zz_groups.js 에서 정합니다 */
window.SITE.works = window.SITE.works || [];
window.w = function (o) {
  window.SITE.works.push({
    id: o.i, cat: o.c, name: o.n, en: o.e, line: o.l, status: o.s, type: o.t, stack: o.k, period: o.p,
    tags: o.g || [], why: o.y, how: o.h, parts: o.pt || [], features: o.f || [],
    timeline: (o.tl || []).map(function (x) { return { date: x[0], title: x[1], desc: x[2] }; }),
    img: o.img, url: o.url, links: (o.links || []).map(function (x) { return { label: x[0], href: x[1] }; }),
    shots: (o.shots || []).map(function (x) { return { src: x[0], cap: x[1] }; }),
    featured: !!o.feat
  });
};
