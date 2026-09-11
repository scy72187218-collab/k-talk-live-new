/* 비밀방 오른쪽 버튼만: 뒤집기·좋아요·효과·보물상자·매치를 세로로 유지하고 위로 올림. */
(function(){
  if(window.__ktSecretRightControlsFixInstalled)return;
  window.__ktSecretRightControlsFixInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktSecretRightControlsFixStyle'))return;
    var s=document.createElement('style');
    s.id='ktSecretRightControlsFixStyle';
    s.textContent=''
      +'.ktsecret-right{right:5px!important;bottom:185px!important;gap:6px!important;display:flex!important;flex-direction:column!important;align-items:center!important;z-index:20!important}'
      +'.ktsecret-right>button,.ktsecret-right>.ktsecret-match-restored{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;border-radius:50%!important;font-size:18px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:0!important;border:1px solid #ffffff38!important;background:#101014d9!important;color:#fff!important;font-weight:950!important;box-sizing:border-box!important}'
      +'.ktsecret-right>.like{height:58px!important;min-height:58px!important;border-radius:18px!important}'
      +'.ktsecret-right>button small,.ktsecret-right>button span,.ktsecret-right>.ktsecret-match-restored span{display:block!important;font-size:9px!important;line-height:1!important;margin-top:2px!important;white-space:nowrap!important;font-weight:950!important}'
      +'.ktsecret-right>.like b{font-size:9px!important;line-height:1!important;margin-top:2px!important}'
      +'@media(max-width:390px){.ktsecret-right{right:4px!important;bottom:180px!important;gap:5px!important}.ktsecret-right>button,.ktsecret-right>.ktsecret-match-restored{width:47px!important;height:47px!important;min-width:47px!important;min-height:47px!important}.ktsecret-right>.like{height:56px!important;min-height:56px!important}}';
    document.head.appendChild(s);
  }

  function findButton(side,kind){
    var list=[].slice.call(side.children||[]);
    return list.find(function(btn){
      if(!btn)return false;
      var text=String(btn.textContent||'').replace(/\s+/g,'');
      var oc=String(btn.getAttribute&&btn.getAttribute('onclick')||'');
      if(kind==='flip')return btn.classList&&btn.classList.contains('kt-room-camera-flip')||text.indexOf('뒤집기')>-1;
      if(kind==='like')return btn.classList&&btn.classList.contains('like')||text.indexOf('좋아요')>-1;
      if(kind==='effect')return oc.indexOf('ktSecretEffect')>-1||text.indexOf('효과')>-1;
      if(kind==='gift')return oc.indexOf('openGifts')>-1||text.indexOf('보물상자')>-1;
      if(kind==='match')return btn.classList&&btn.classList.contains('ktsecret-match-restored')||text.indexOf('매치')>-1;
      return false;
    })||null;
  }

  function install(){
    var side=document.querySelector('.ktsecret-right');
    if(!side)return;
    ensureStyle();

    var like=findButton(side,'like');
    var effect=findButton(side,'effect');
    var gift=findButton(side,'gift');
    var match=findButton(side,'match');
    var flip=findButton(side,'flip');

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
    }

    [flip,like,effect,gift,match].forEach(function(btn){if(btn)side.appendChild(btn);});
  }

  install();
  [60,180,420,900,1500].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktSecretRightControlsFixTimer);
      window.__ktSecretRightControlsFixTimer=setTimeout(install,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
