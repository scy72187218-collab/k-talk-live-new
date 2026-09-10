/* K-Talk 혜택센터: 10,000개 받은 보상과 구독자 40% 정상 금액만 표시. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktBenefit10000Subscriber40Installed)return;
  window.__ktBenefit10000Subscriber40Installed=true;

  var oldOpen=window.openBenefitCenter;
  if(typeof oldOpen!=='function')return;

  window.openBenefitCenter=function(){
    var r=oldOpen.apply(this,arguments);
    setTimeout(function(){
      try{
        var top=document.querySelector('.kt-benefit-top');
        if(!top)return;
        var cards=top.children;

        if(cards[0]){
          var b0=cards[0].querySelector('b');
          var s0=cards[0].querySelector('strong');
          if(b0)b0.textContent='받은 보상';
          if(s0)s0.textContent='10,000개';
        }

        if(cards[1]){
          var b1=cards[1].querySelector('b');
          var s1=cards[1].querySelector('strong');
          if(b1)b1.textContent='정상 금액';
          if(s1)s1.textContent='300,000원';
        }

        if(cards[2]){
          var b2=cards[2].querySelector('b');
          var s2=cards[2].querySelector('strong');
          if(b2)b2.textContent='구독자 40%';
          if(s2)s2.textContent='120,000원';
        }

        var note=document.querySelector('.kt-benefit-net-note');
        if(note)note.textContent='🌹 1개 30원 기준 · 10,000개 = 300,000원 · 구독자 40% = 120,000원';
      }catch(e){}
    },0);
    return r;
  };
})();
