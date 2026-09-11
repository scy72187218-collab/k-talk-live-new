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

/* 사용방법 화면을 열 때만 뒤의 동영상 화면을 숨긴다. 다른 페이지/기능은 건드리지 않음. */
(function(){
  if(window.__ktHelpHideVideoInstalled)return;
  window.__ktHelpHideVideoInstalled=true;

  if(!document.getElementById('ktHelpHideVideoStyle')){
    var s=document.createElement('style');
    s.id='ktHelpHideVideoStyle';
    s.textContent='body.kt-help-screen-open #screen{visibility:hidden!important;background:#000!important}';
    document.head.appendChild(s);
  }

  function enterHelp(){
    try{document.body.classList.add('kt-help-screen-open');}catch(e){}
    try{if(window.ktStopPageMedia)window.ktStopPageMedia();}catch(e){}
    try{
      document.querySelectorAll('.kt-public-video,#homeVideo,#ktLibraryPlayer').forEach(function(v){
        try{v.pause();v.muted=true;}catch(err){}
      });
    }catch(e){}
  }

  function leaveHelp(){
    try{document.body.classList.remove('kt-help-screen-open');}catch(e){}
  }

  var oldMenu=window.openMenu;
  if(typeof oldMenu==='function'&&!oldMenu.__ktHelpHideVideo){
    var wrappedMenu=function(){
      enterHelp();
      return oldMenu.apply(this,arguments);
    };
    wrappedMenu.__ktHelpHideVideo=true;
    window.openMenu=wrappedMenu;
  }

  var oldClose=window.closeSheet;
  if(typeof oldClose==='function'&&!oldClose.__ktHelpHideVideo){
    var wrappedClose=function(){
      leaveHelp();
      return oldClose.apply(this,arguments);
    };
    wrappedClose.__ktHelpHideVideo=true;
    window.closeSheet=wrappedClose;
  }

  document.addEventListener('click',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var b=t.closest('[data-bottom]');
    if(!b)return;
    if(b.dataset.bottom==='help')enterHelp();
    else leaveHelp();
  },true);
})();
