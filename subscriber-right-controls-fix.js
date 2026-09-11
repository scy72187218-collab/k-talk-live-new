/* 구독자방 오른쪽 버튼만: 뒤집기·좋아요·효과·보물상자·매치 5개를 보이게 한다. 매치는 다른 방처럼 숨김 규칙에 걸리지 않는 독립 컨트롤로 유지. */
(function(){
  if(window.__ktSubscriberRightFiveFixInstalled)return;
  window.__ktSubscriberRightFiveFixInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktSubscriberRightFiveFixStyle'))return;
    var s=document.createElement('style');
    s.id='ktSubscriberRightFiveFixStyle';
    s.textContent=''
      +'.ktsubscriber-room .ktsubscriber-stage{grid-template-columns:minmax(0,1fr) 56px!important}'
      +'.ktsubscriber-room .ktsubscriber-right{gap:6px!important;overflow:visible!important}'
      +'.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>button{display:flex!important;width:50px!important;height:50px!important;min-width:50px!important;min-height:50px!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:0!important;font-size:18px!important}'
      +'.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>.like{height:60px!important;min-height:60px!important;border-radius:20px!important}'
      +'.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>button small{display:block!important;font-size:9px!important;line-height:1!important;margin-top:2px!important;white-space:nowrap!important}'
      +'.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>.like b{font-size:9px!important;line-height:1!important}'
      +'.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>.kt-subscriber-match-restored{display:flex!important;width:50px!important;height:50px!important;min-width:50px!important;min-height:50px!important;border-radius:50%!important;border:1px solid #ffffff38!important;background:#101014d9!important;color:#fff!important;font-size:18px!important;font-weight:950!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:0!important;box-sizing:border-box!important;touch-action:manipulation!important}'
      +'.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>.kt-subscriber-match-restored small{display:block!important;font-size:9px!important;line-height:1!important;margin-top:2px!important;white-space:nowrap!important}'
      +'@media(max-width:390px){.ktsubscriber-room .ktsubscriber-stage{grid-template-columns:minmax(0,1fr) 54px!important}.ktsubscriber-room .ktsubscriber-right{gap:5px!important}.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>button{display:flex!important;width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;font-size:17px!important}.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>.like{height:58px!important;min-height:58px!important}.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>.kt-subscriber-match-restored{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;font-size:17px!important}}';
    document.head.appendChild(s);
  }

  function labelOf(el){
    if(!el)return '';
    var small=el.querySelector&&el.querySelector('small');
    return String((small&&small.textContent)||(el.getAttribute&&el.getAttribute('aria-label'))||'').trim();
  }

  function isMatch(el){
    if(!el)return false;
    var label=(el.getAttribute&&el.getAttribute('aria-label'))||'';
    return label==='매치'||labelOf(el)==='매치';
  }

  function install(){
    var box=document.querySelector('.ktsubscriber-right');
    if(!box)return;
    ensureStyle();

    /* 구독자방 보물상자가 두 개 생기면 위의 첫 번째만 남기고 맨 아래 중복만 제거한다. */
    var treasures=[].slice.call(box.querySelectorAll(':scope > button')).filter(function(btn){
      return labelOf(btn)==='보물상자';
    });
    if(treasures.length>1){
      treasures.slice(1).forEach(function(btn){try{btn.remove();}catch(e){}});
      treasures=treasures.slice(0,1);
    }

    /* 다른 방에서 쓰는 방식처럼 매치는 BUTTON이 아닌 독립 컨트롤로 고정해 5번째 버튼 숨김 규칙을 피한다. */
    var allMatches=[].slice.call(box.children||[]).filter(isMatch);
    var match=allMatches.find(function(el){
      return el.classList&&el.classList.contains('kt-subscriber-match-restored')&&el.tagName!=='BUTTON';
    })||null;

    allMatches.forEach(function(el){
      if(el!==match){try{el.remove();}catch(e){}}
    });

    if(!match){
      match=document.createElement('div');
      match.className='kt-subscriber-match-restored';
      match.setAttribute('role','button');
      match.setAttribute('tabindex','0');
      match.setAttribute('aria-label','매치');
      match.innerHTML='⚔<small>매치</small>';
      match.onclick=function(){
        try{if(window.openHostMatchArena){window.openHostMatchArena('1대1');return;}}catch(e){}
        try{if(window.openMatchArena)window.openMatchArena('1대1');}catch(e){}
      };
      match.onkeydown=function(e){
        if(e&&(e.key==='Enter'||e.key===' ')){e.preventDefault();this.click();}
      };
    }

    var treasure=treasures[0]||[].slice.call(box.querySelectorAll(':scope > button')).find(function(btn){
      return labelOf(btn)==='보물상자';
    });

    if(treasure&&treasure.nextElementSibling!==match){
      box.insertBefore(match,treasure.nextElementSibling);
    }else if(!match.parentNode){
      box.appendChild(match);
    }
  }

  install();
  [60,180,420,900,1500].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktSubscriberRightFiveFixTimer);
      window.__ktSubscriberRightFiveFixTimer=setTimeout(install,40);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
