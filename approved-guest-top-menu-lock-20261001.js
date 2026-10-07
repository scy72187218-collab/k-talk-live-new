/* K-Talk 2026-10-01
   승인된 게스트 화면의 상단 빠른메뉴만 통일.
   범위: 원격 게스트 승인 화면. 호스트방/영상/통신/퇴장/승인 로직은 변경하지 않음. */
(function(){
  if(window.__ktApprovedGuestTopMenuLock20261001)return;
  window.__ktApprovedGuestTopMenuLock20261001=true;

  function approvedRemoteRoots(){
    var out=[];
    try{
      /* 5555: 일반 게스트/시청자 화면도 같은 상단 메뉴를 써야 한다.
         호스트 화면은 건드리지 않고 원격 게스트 화면(.kt-remote-live)만 대상으로 한다. */
      document.querySelectorAll('.kt-remote-live').forEach(function(x){out.push(x);});
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
      /* 4444: 구독자 게스트는 현재 정상 호스트 화면을 따로 사용하므로
         이 구형 상단 빠른메뉴(되돌리기/상자/매치)를 만들거나 이동하지 않는다. */
      var r=window.__ktLastLiveRoom||{};
      var rt=[r.room_type,r.room_name,r.title,window.__ktRemoteRoomName,window.__ktRemoteRoomType].filter(Boolean).join(' ');
      if(/subscriber|구독자/i.test(rt)){
        root.querySelectorAll('.kt-viewer-quick-20261001,.kt-remote-guest-upper-quick-5555').forEach(function(x){try{x.remove();}catch(e){}});
        return;
      }
      var hostlike=root.querySelector('.kt-guest-hostlike-room');
      if(hostlike){
        var q=hostlike.querySelector('.kgh-quick');
        if(q){
          q.style.setProperty('display','grid','important');
          q.style.setProperty('grid-template-columns','repeat(3,1fr)','important');
          q.innerHTML=exactButtons();
        }
      }

      /* 기존 빠른메뉴가 있으면 같은 3개로 통일 */
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

      /* 일반 게스트 화면은 기존에 빠른메뉴 자체가 없었다.
         일일 랭킹/미션/시청자 줄 바로 아래에만 새 3칸 메뉴를 추가한다. */
      if(!root.querySelector('.kgh-quick,.kt-viewer-quick-20261001')){
        var stats=[].slice.call(root.children||[]).find(function(el){
          var t=String(el&&el.textContent||'').replace(/\s+/g,'');
          return /일일랭킹/.test(t)&&/미션/.test(t)&&/시청자/.test(t);
        });
        if(!stats){
          stats=[].slice.call(root.querySelectorAll('div,section,nav')).find(function(el){
            if(el.closest('.kt-remote-bottom,.kt-remote-chat'))return false;
            var t=String(el&&el.textContent||'').replace(/\s+/g,'');
            return /일일랭킹/.test(t)&&/미션/.test(t)&&/시청자/.test(t);
          });
        }

        /* 5555: 어떤 기기에서는 통계 3칸이 중첩 div로 나뉘어
           위 검색이 실패한다. 버튼/텍스트 3개를 기준으로 공통 부모를 찾는다.
           하단 입력창·채팅·도구 영역은 절대 대상으로 잡지 않는다. */
        if(!stats){
          var parts=[].slice.call(root.querySelectorAll('button,div,span')).filter(function(el){
            if(el.closest('.kt-remote-bottom,.kt-remote-chat,.kgh-tools'))return false;
            var t=String(el&&el.textContent||'').replace(/\s+/g,'');
            return /^(?:🔥)?일일랭킹$|^(?:🎯)?미션$|시청자.*시청/.test(t);
          });
          parts.some(function(el){
            var p=el.parentElement;
            for(var i=0;p&&i<4;i++,p=p.parentElement){
              if(p===root)break;
              var t=String(p&&p.textContent||'').replace(/\s+/g,'');
              if(/일일랭킹/.test(t)&&/미션/.test(t)&&/시청자/.test(t)){
                stats=p;return true;
              }
            }
            return false;
          });
        }
        if(stats&&stats.parentNode){
          var bar=document.createElement('div');
          bar.className='kt-viewer-quick-20261001';
          bar.style.cssText='display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;width:100%!important;min-height:35px!important;flex:0 0 35px!important;position:relative!important;z-index:40!important;';
          bar.innerHTML=exactButtons();
          [].slice.call(bar.querySelectorAll('button')).forEach(function(b){
            b.style.cssText='border:0!important;border-radius:11px!important;background:#101014!important;color:#fff!important;font-size:11px!important;font-weight:900!important;min-width:0!important;';
          });
          stats.insertAdjacentElement('afterend',bar);
        }
      }
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