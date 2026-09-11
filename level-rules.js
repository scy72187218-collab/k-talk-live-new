/* K-Talk 레벨 상승 비용 규칙만 설정. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktLevelCostRulesInstalled)return;
  window.__ktLevelCostRulesInstalled=true;

  /* 올라갈 목표 레벨 기준: 2~10은 5,000 / 11부터는 10,000 */
  window.ktLevelUpCostForTarget=function(targetLevel){
    var lv=parseInt(targetLevel,10);
    if(!isFinite(lv)||lv<2)lv=2;
    return lv<=10?5000:10000;
  };

  /* 현재 레벨에서 다음 1레벨 올리는 비용 */
  window.ktNextLevelCost=function(currentLevel){
    var lv=parseInt(currentLevel,10);
    if(!isFinite(lv)||lv<1)lv=1;
    return window.ktLevelUpCostForTarget(lv+1);
  };
})();
