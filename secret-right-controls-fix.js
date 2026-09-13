/* 비밀방 오른쪽 버튼만: 뒤집기·좋아요·효과·보물상자·매치를 세로로 유지하고 위로 올림. */
(function(){
  if(window.__ktSecretRightControlsFixInstalled)return;
  window.__ktSecretRightControlsFixInstalled=true;

  function ensureStyle(){
    var old=document.getElementById('ktSecretRightControlsFixStyle');
    if(old)old.remove();
    var s=document.createElement('style');
    s.id='ktSecretRightControlsFixStyle';
    s.textContent=''
      +'.ktsecret-room .ktsecret-earn-row #myEarnHud{width:110px!important;max-width:110px!important;min-width:0!important;padding:2px 3px!important}'
      +'.ktsecret-room .ktsecret-earn-row #myEarnHud span{font-size:6.5px!important}.ktsecret-room .ktsecret-earn-row #myEarnHud b{font-size:9px!important}'
      +'.ktsecret-right{right:5px!important;bottom:150px!important;gap:5px!important;display:flex!important;flex-direction:column!important;align-items:center!important;z-index:20!important}'
      +'.ktsecret-right>.kt-room-camera-flip{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;border-radius:50%!important;font-size:18px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:0!important}'
      +'.ktsecret-right>.like,.ktsecret-right>.ktsecret-effect-small,.ktsecret-right>.ktsecret-gift-small,.ktsecret-right>.ktsecret-match-restored{width:43px!important;height:43px!important;min-width:43px!important;min-height:43px!important;border-radius:50%!important;font-size:16px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:0!important;border:0!important;background:transparent!important;box-shadow:none!important;outline:0!important;color:#fff!important;font-weight:950!important;box-sizing:border-box!important}'
      +'.ktsecret-right>.like{height:48px!important;min-height:48px!important;border-radius:16px!important;background:transparent!important}'
      +'.ktsecret-right>.ktsecret-effect-small small,.ktsecret-right>.ktsecret-effect-small span,.ktsecret-right>.ktsecret-gift-small small,.ktsecret-right>.ktsecret-gift-small span,.ktsecret-right>.ktsecret-match-restored span,.ktsecret-right>.like small,.ktsecret-right>.kt-room-camera-flip small{display:block!important;font-size:8px!important;line-height:1!important;margin-top:1px!important;white-space:nowrap!important;font-weight:950!important}'
      +'.ktsecret-right>.like b{font-size:8px!important;line-height:1!important;margin-top:1px!important}'
      +'@media(max-width:390px){.ktsecret-room .ktsecret-earn-row #myEarnHud{width:100px!important;max-width:100px!important;padding:2px 2px!important}.ktsecret-right{right:4px!important;bottom:145px!important;gap:4px!important}.ktsecret-right>.kt-room-camera-flip{width:46px!important;height:46px!important;min-width:46px!important;min-height:46px!important}.ktsecret-right>.like,.ktsecret-right>.ktsecret-effect-small,.ktsecret-right>.ktsecret-gift-small,.ktsecret-right>.ktsecret-match-restored{width:41px!important;height:41px!important;min-width:41px!important;min-height:41px!important}.ktsecret-right>.like{height:46px!important;min-height:46px!important}}';
    document.head.appendChild(s);
  }

  function findButton(side,kind){
    var list=[].slice.call(side.children||[]);
    return list.find(function(btn){
      if(!btn)return false;
      var text=String(btn.textContent||'').replace(/\s+/g,'');
      var oc=String(btn.getAttribute&&btn.getAttribute('onclick')||'');
      if(kind==='flip')return (btn.classList&&btn.classList.contains('kt-room-camera-flip'))||text.indexOf('뒤집기')>-1;
      if(kind==='like')return (btn.classList&&btn.classList.contains('like'))||text.indexOf('좋아요')>-1;
      if(kind==='effect')return oc.indexOf('ktSecretEffect')>-1||text.indexOf('효과')>-1;
      if(kind==='gift')return oc.indexOf('openGifts')>-1||text.indexOf('보물상자')>-1;
      if(kind==='match')return (btn.classList&&btn.classList.contains('ktsecret-match-restored'))||text.indexOf('매치')>-1;
      return false;
    })||null;
  }

  function isMatch(el){
    if(!el)return false;
    var text=String(el.textContent||'').replace(/\s+/g,'');
    return (el.classList&&el.classList.contains('ktsecret-match-restored'))||text.indexOf('매치')>-1;
  }

  function removeExtraMatches(side,keep){
    [].slice.call(side.children||[]).forEach(function(el){
      if(el!==keep&&isMatch(el)){
        try{el.remove();}catch(e){}
      }
    });
  }

  function isAlreadyOrdered(side,arr){
    var current=[].slice.call(side.children||[]).filter(function(el){return arr.indexOf(el)>-1;});
    if(current.length!==arr.length)return false;
    for(var i=0;i<arr.length;i++)if(current[i]!==arr[i])return false;
    return true;
  }

  function install(){
    var side=document.querySelector('.ktsecret-right');
    if(!side)return;
    ensureStyle();

    var like=findButton(side,'like');
    var effect=findButton(side,'effect');
    var gift=findButton(side,'gift');
    var match=side.querySelector(':scope > .ktsecret-match-restored')||findButton(side,'match');
    var flip=findButton(side,'flip');

    if(effect)effect.classList.add('ktsecret-effect-small');
    if(gift)gift.classList.add('ktsecret-gift-small');

    if(gift&&!String(gift.textContent||'').match(/보물상자/)){
      var gs=document.createElement('span');
      gs.textContent='보물상자';
      gift.appendChild(gs);
    }

    if(effect&&!String(effect.textContent||'').match(/효과/)){
      var es=document.createElement('span');
      es.textContent='효과';
      effect.appendChild(es);
    }

    if(!match){
      match=document.createElement('div');
      match.className='ktsecret-match-restored';
      match.setAttribute('role','button');
      match.setAttribute('tabindex','0');
      match.setAttribute('aria-label','매치');
      match.innerHTML='⚔<span>매치</span>';
      match.onclick=function(){
        try{if(window.openHostMatchArena){window.openHostMatchArena('1대1');return;}}catch(e){}
        try{if(window.openMatchArena)window.openMatchArena('1대1');}catch(e){}
      };
      match.onkeydown=function(e){if(e&&(e.key==='Enter'||e.key===' ')){e.preventDefault();this.click();}};
      side.appendChild(match);
    }

    removeExtraMatches(side,match);

    var order=[flip,like,effect,gift,match].filter(Boolean);
    if(!isAlreadyOrdered(side,order)){
      order.forEach(function(btn){side.appendChild(btn);});
    }
  }

  install();
  [80,240,600].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(mutations){
      var needs=false;
      for(var i=0;i<mutations.length;i++){
        if(mutations[i].target&&((mutations[i].target.classList&&mutations[i].target.classList.contains('ktsecret-right'))||(mutations[i].target.querySelector&&mutations[i].target.querySelector('.ktsecret-right')))){needs=true;break;}
      }
      if(!needs)return;
      clearTimeout(window.__ktSecretRightControlsFixTimer);
      window.__ktSecretRightControlsFixTimer=setTimeout(install,80);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
