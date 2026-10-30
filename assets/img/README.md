# 이미지 넣는 법

1. 이 폴더에 화면 캡처를 넣습니다. (가로 1280px 권장, png/jpg)
2. `assets/js/data.js` 에서 해당 항목에 추가합니다.

   img: "assets/img/finqai.png",          // 카드·상세 대표 이미지
   url: "https://...",                    // 있으면 상세에 Visit Site 버튼
   shots: [ { src: "assets/img/finqai-1.png", cap: "대시보드" } ],   // 상세 갤러리

비워 두면 글자 자리표시자가 보입니다.

주의: 고객 정보, 계정, 수익 수치, 내부 URL이 보이는 화면은 쓰지 않습니다.
