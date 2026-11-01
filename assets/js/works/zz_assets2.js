/* 문서 표지·대표 쪽, 실제 화면을 합성한 이미지, 공개 원문을 렌더한 이미지를 항목에 붙입니다. zz_assets.js 다음, zz_groups.js 앞에서 읽습니다.
   만드는 도구: tools/render-covers.py · build-covers.py · render-panels.py (회사명·상대 이름·참여 수치가 보이는 자리는 가린 뒤 넣음) */
(function () {
  var A = window.SITE.assets = window.SITE.assets || {};
  function put(id, o) {
    var t = A[id] = A[id] || {};
    if (o.img) t.img = o.img;
    if (o.shots) t.shots = (t.shots || []).concat(o.shots);
  }
  var I = "assets/img/";

  /* 문서군: 제안서·소개서·계획서의 표지나 대표 쪽 */
  put("strategy-office-docs", { img: I + "strategy-office-docs/proposal-deck.png", shots: [
    [I + "strategy-office-docs/seminar-value.png", "설계사 세미나 덱: 가치 제안 쪽(바닥글의 회사명·지점명은 가렸습니다)"],
    [I + "strategy-office-docs/seminar-solution.png", "설계사 세미나 덱: 솔루션 쪽"]
  ] });
  put("marketing-annual", { img: I + "marketing-annual/events-2021.png" });
  put("youtube-channel", { img: I + "youtube-channel/improvement-proposal.png" });
  put("operations-docs-2021", { img: I + "operations-docs-2021/manual-cover.png", shots: [[I + "operations-docs-2021/manual-contents.png", "관리부 업무 매뉴얼의 목차 쪽"]] });
  put("sales-training", { img: I + "sales-training/training-cover.png", shots: [[I + "sales-training/training-curriculum.png", "전사 집체 교육 1일차 커리큘럼 쪽"]] });
  put("video-pipeline", { img: I + "video-pipeline/storyboard.png" });
  put("brand-launch-plans", { img: I + "brand-launch-plans/plan-cover.png", shots: [[I + "brand-launch-plans/plan-pitch.png", "기획안의 문제 제기 쪽"]] });

  /* 서비스·시스템: 실제 화면 또는 프로토타입 화면 */
  put("parkcare", { img: I + "parkcare/hero.png" });
  put("trading-engine", { img: I + "trading-engine/reserved-trade.png" });
  put("finq-engineering", { img: I + "finq-engineering/flow-design.png" });

  /* 에이전트·스킬·지식: 공개 원문이나 실제 링크 구조를 그대로 렌더 */
  put("my-skills", { img: I + "my-skills/skill-file.png" });
  put("agent-corps", { img: I + "agent-corps/agent-cards.png" });
  put("obsidian-vault", { img: I + "obsidian-vault/graph.png" });
  put("external-skill-stacks", { img: I + "external-skill-stacks/installed-skills.png" });
  put("claude-setup", { img: I + "claude-setup/hook-events.png" });
})();
