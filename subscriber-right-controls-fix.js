/* 구독자방 오른쪽 버튼만: 뒤집기·좋아요·효과·보물상자는 그대로 두고, 매치만 보이는 보물상자 글씨 바로 밑에서 조금 위로 붙인다. */
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
      +'#ktSubscriberMatchFloating{position:fixed!important;z-index:9998!important;display:flex!important;width:50px!important;height:50px!important;min-width:50px!important;min-height:50px!important;border-radius:50%!important;border:1px solid #ffffff38!important;background:#101014e8!important;color:#fff!important;font-size:18px!important;font-weight:950!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:0!important;box-sizing:border-box!important;touch-action:manipulation!important;visibility:visible!important;opacity:1!important}'
      +'#ktSubscriberMatchFloating small{display:block!important;font-size:9px!important;line-height:1!important;margin-top:2px!important;white-space:nowrap!important;color:#fff!important}'
      +'@media(max-width:390px){.ktsubscriber-room .ktsubscriber-stage{grid-template-columns:minmax(0,1fr) 54px!important}.ktsubscriber-room .ktsubscriber-right{gap:5px!important}.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>button{display:flex!important;width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;font-size:17px!important}.ktsubscriber-room .ktsubscriber-stage .ktsubscriber-right>.like{height:58px!important;min-height:58px!important}#ktSubscriberMatchFloating{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;font-size:17px!important}}';
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

  function removeFloating(){
    var f=document.getElementById('ktSubscriberMatchFloating');
    if(f)f.remove();
  }

  function install(){
    var room=document.querySelector('.ktsubscriber-room');
    var box=document.querySelector('.ktsubscriber-right');
    if(!room||!box){removeFloating();return;}
    ensureStyle();

    var treasures=[].slice.call(box.querySelectorAll(':scope > button')).filter(function(btn){
      return labelOf(btn)==='보물상자';
    });
    if(treasures.length>1){
      treasures.slice(1).forEach(function(btn){try{btn.remove();}catch(e){}});
      treasures=treasures.slice(0,1);
    }
    var treasure=treasures[0]||[].slice.call(box.querySelectorAll(':scope > button')).find(function(btn){
      return labelOf(btn)==='보물상자';
    });
    if(!treasure)return;

    [].slice.call(box.children||[]).forEach(function(el){
      if(isMatch(el)){try{el.remove();}catch(e){}}
    });

    var match=document.getElementById('ktSubscriberMatchFloating');
    if(!match){
      match=document.createElement('div');
      match.id='ktSubscriberMatchFloating';
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
      document.body.appendChild(match);
    }

    /* 실제 보물상자 글씨 기준에서 매치만 8px 위로 당긴다. */
    var r=treasure.getBoundingClientRect();
    var label=treasure.querySelector('small');
    var lr=label?label.getBoundingClientRect():r;
    var size=window.innerWidth<=390?48:50;
    var left=Math.round(r.left+(r.width-size)/2);
    var top=Math.round(lr.bottom-6);
    match.style.setProperty('left',left+'px','important');
    match.style.setProperty('top',top+'px','important');
  }

  install();
  [60,180,420,900,1500,2500].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,700);
  window.addEventListener('resize',install);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktSubscriberRightFiveFixTimer);
      window.__ktSubscriberRightFiveFixTimer=setTimeout(install,40);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
