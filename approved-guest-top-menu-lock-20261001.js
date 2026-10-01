/* K-Talk 2026-10-01
   승인된 게스트 화면의 상단 빠른메뉴만 통일.
   범위: 원격 게스트 승인 화면. 호스트방/영상/통신/퇴장/승인 로직은 변경하지 않음. */
(function(){
  if(window.__ktApprovedGuestTopMenuLock20261001)return;
  window.__ktApprovedGuestTopMenuLock20261001=true;

  function approvedRemoteRoots(){
    var out=[];
    try{
      document.querySelectorAll('.kt-remote-live.kt-guest-hostlike-active').forEach(function(x){out.push(x);});
      document.querySelectorAll('.kt-remote-live').forEach(function(x){
        if(x.querySelector('.kt-guest-hostlike-room,.kt-approved-guest-room'))out.push(x);
      });
    }catch(e){}
    return out.filter(function(x,i,a){return a.indexOf(x)===i;});
  }

  function exactButtons(){
    return '<button type="button">↩ 되돌리기</button>'+
           '<button type="button">📦 패키지 상자</button>'+
           '<button type="button">⚔ 매치</button>';
  }

  function normalizeRoot(root){
    if(!root)return;
    try{
      var hostlike=root.querySelector('.kt-guest-hostlike-room');
      if(hostlike){
        var q=hostlike.querySelector('.kgh-quick');
        if(q){
          q.style.setProperty('display','grid','important');
          q.style.setProperty('grid-template-columns','repeat(3,1fr)','important');
          q.innerHTML=exactButtons();
        }
      }

      /* 예전 게스트 화면이 남아 있어도 "보물상자"가 다시 나타나지 않게
         빠른메뉴처럼 보이는 컨테이너만 골라 같은 4개로 통일한다. */
      var candidates=[].slice.call(root.querySelectorAll('div,nav,section'));
      candidates.forEach(function(box){
        if(box.closest('.kgh-tools,.kt-remote-bottom,.kt-remote-chat'))return;
        var direct=[].slice.call(box.children||[]).filter(function(el){return el&&el.tagName==='BUTTON';});
        if(direct.length<2||direct.length>6)return;
        var txt=direct.map(function(b){return String(b.textContent||'').replace(/\s+/g,'');}).join('|');
        if(!/(보물상자|패키지|되돌리기|매치)/.test(txt))return;
        if(/일일랭킹|시청자|미션/.test(txt))return;
        box.style.setProperty('display','grid','important');
        box.style.setProperty('grid-template-columns','repeat(3,1fr)','important');
        box.innerHTML=exactButtons();
      });
    }catch(e){}
  }

  function run(){
    approvedRemoteRoots().forEach(normalizeRoot);
  }

  run();
  [20,80,180,400,800,1500,3000].forEach(function(ms){setTimeout(run,ms);});
  setInterval(run,1000);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktApprovedGuestTopMenuLockTimer20261001);
      window.__ktApprovedGuestTopMenuLockTimer20261001=setTimeout(run,20);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();