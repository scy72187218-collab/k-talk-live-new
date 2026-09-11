/* 구독자방 오른쪽 버튼만: 뒤집기·좋아요·효과·보물상자·매치 5개를 보이게 하고 조금 키운다. */
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
      +'.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>.kt-subscriber-match-restored{display:flex!important}'
      +'@media(max-width:390px){.ktsubscriber-room .ktsubscriber-stage{grid-template-columns:minmax(0,1fr) 54px!important}.ktsubscriber-room .ktsubscriber-right{gap:5px!important}.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>button{display:flex!important;width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;font-size:17px!important}.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>.like{height:58px!important;min-height:58px!important}}';
    document.head.appendChild(s);
  }

  function labelOf(btn){
    if(!btn)return '';
    var small=btn.querySelector('small');
    return String((small&&small.textContent)||btn.getAttribute('aria-label')||'').trim();
  }

  function isMatch(btn){
    if(!btn)return false;
    var label=btn.getAttribute('aria-label')||'';
    return label==='매치'||labelOf(btn)==='매치';
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

    var buttons=[].slice.call(box.querySelectorAll(':scope > button'));
    var match=buttons.find(isMatch);
    if(!match){
      match=document.createElement('button');
      match.type='button';
      match.className='kt-subscriber-match-restored';
      match.setAttribute('aria-label','매치');
      match.innerHTML='⚔<small>매치</small>';
      match.onclick=function(){
        try{if(window.openHostMatchArena){window.openHostMatchArena('1대1');return;}}catch(e){}
        try{if(window.openMatchArena)window.openMatchArena('1대1');}catch(e){}
      };
    }else{
      match.classList.add('kt-subscriber-match-restored');
    }

    /* 기본 구독자방의 5번째 버튼 숨김 규칙보다 우선해서 매치는 항상 표시한다. */
    try{match.style.setProperty('display','flex','important');}catch(e){}

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
