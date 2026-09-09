/* K-Talk 13명 방 오른쪽 퀵 버튼: 좋아요/선물/매치/효과/보물상자만 표시. 13명 방 보정은 제외. */
(function(){
  if(window.__ktGroup13RightQuickInstalled)return;
  window.__ktGroup13RightQuickInstalled=true;

  window.__ktGroup13LikeCount=Number(window.__ktGroup13LikeCount||0);

  function ensureStyle(){
    if(document.getElementById('ktGroup13RightQuickStyle'))return;
    var s=document.createElement('style');
    s.id='ktGroup13RightQuickStyle';
    s.textContent=''
      +'.ktg13-right-quick{position:absolute;right:7px;top:50%;transform:translateY(-50%);z-index:40;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:auto}'
      +'.ktg13-right-quick button{width:54px;height:54px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(28,28,32,.92);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0;box-shadow:0 2px 8px rgba(0,0,0,.4);font-family:inherit;font-weight:950;touch-action:manipulation}'
      +'.ktg13-right-quick button b{font-size:22px;line-height:1}'
      +'.ktg13-right-quick button span{font-size:10px;line-height:1.05;margin-top:3px;white-space:nowrap}'
      +'.ktg13-right-quick .ktg13-like{height:66px;border-radius:20px;border-color:rgba(255,62,170,.55);background:rgba(70,32,57,.94);box-shadow:0 0 8px rgba(255,52,171,.26)}'
      +'.ktg13-right-quick .ktg13-like b{font-size:25px}'
      +'.ktg13-right-quick .ktg13-like em{font-style:normal;font-size:11px;line-height:1;margin-top:3px}'
      +'.ktg13-right-quick .ktg13-treasure{border-color:rgba(255,203,72,.62);background:linear-gradient(145deg,rgba(92,63,13,.96),rgba(37,27,9,.96));box-shadow:0 0 10px rgba(255,194,55,.28)}'
      +'@media(max-width:390px){.ktg13-right-quick{right:4px;gap:5px}.ktg13-right-quick button{width:44px;height:44px}.ktg13-right-quick .ktg13-like{height:54px;border-radius:17px}.ktg13-right-quick button b{font-size:18px}.ktg13-right-quick button span,.ktg13-right-quick .ktg13-like em{font-size:8.5px}}';
    document.head.appendChild(s);
  }

  function like(){
    window.__ktGroup13LikeCount++;
    var n=document.getElementById('ktg13LikeCount');
    if(n)n.textContent=String(window.__ktGroup13LikeCount);
  }

  function gift(){
    try{if(window.openGifts){window.openGifts();return;}}catch(e){}
  }

  function match(){
    try{if(window.openMatchArena){window.openMatchArena('1대1');return;}}catch(e){}
    try{if(window.ktRenderMatchArena){window.showSheet&&window.showSheet('호스트 매치','<div class="kt-match-arena"></div>');window.ktRenderMatchArena('1대1');return;}}catch(e){}
    try{if(window.showSheet)window.showSheet('매치','<div class="rowbox"><b>호스트 매치</b><br>매치 기능을 선택할 수 있습니다.</div>');}catch(e){}
  }

  function effect(){
    try{if(window.ktGroup13Effect){window.ktGroup13Effect();return;}}catch(e){}
    try{if(window.openEditEffectPanel){window.openEditEffectPanel();return;}}catch(e){}
  }

  function treasure(){
    try{if(window.openTreasure){window.openTreasure();return;}}catch(e){}
    try{if(window.openGifts){window.openGifts();return;}}catch(e){}
  }

  window.ktGroup13QuickLike=like;
  window.ktGroup13QuickGift=gift;
  window.ktGroup13QuickMatch=match;
  window.ktGroup13QuickEffect=effect;
  window.ktGroup13QuickTreasure=treasure;

  function apply(){
    var main=document.querySelector('.ktg13-main');
    if(!main)return;
    ensureStyle();

    var host=main.querySelector('.ktg13-host');
    if(host){
      host.style.removeProperty('background-image');
      host.style.removeProperty('background-size');
      host.style.removeProperty('background-position');
    }

    var old=main.querySelector('.ktg13-right-quick');
    if(old){
      var beauty=old.querySelector('[aria-label="보정"]');
      if(beauty)beauty.remove();
      if(!old.querySelector('[aria-label="보물상자"]')){
        var chest=document.createElement('button');
        chest.className='ktg13-treasure';
        chest.type='button';
        chest.setAttribute('aria-label','보물상자');
        chest.setAttribute('onclick','ktGroup13QuickTreasure()');
        chest.innerHTML='<b>🎁</b><span>보물상자</span>';
        var effectBtn=old.querySelector('[aria-label="효과"]');
        if(effectBtn&&effectBtn.nextSibling)old.insertBefore(chest,effectBtn.nextSibling);
        else old.appendChild(chest);
      }
      return;
    }

    var box=document.createElement('div');
    box.className='ktg13-right-quick';
    box.innerHTML=''
      +'<button class="ktg13-like" type="button" onclick="ktGroup13QuickLike()" aria-label="좋아요"><b>💗</b><span>좋아요</span><em id="ktg13LikeCount">'+String(window.__ktGroup13LikeCount)+'</em></button>'
      +'<button type="button" onclick="ktGroup13QuickGift()" aria-label="선물"><b>🎁</b><span>선물</span></button>'
      +'<button type="button" onclick="ktGroup13QuickMatch()" aria-label="매치"><b>⚔</b><span>매치</span></button>'
      +'<button type="button" onclick="ktGroup13QuickEffect()" aria-label="효과"><b>✨</b><span>효과</span></button>'
      +'<button class="ktg13-treasure" type="button" onclick="ktGroup13QuickTreasure()" aria-label="보물상자"><b>🎁</b><span>보물상자</span></button>';
    main.appendChild(box);
  }

  var observer=new MutationObserver(function(){apply();});
  try{observer.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setInterval(apply,800);
  setTimeout(apply,0);
})();

/* 1인/구독자/비밀방에는 기존 1~100 보정을 그대로 연결한다. */
(function(){
  if(document.querySelector('script[data-kt-beauty-three-rooms]'))return;
  var s=document.createElement('script');
  s.src='beauty-three-rooms.js?v=20260909-all4';
  s.async=false;
  s.setAttribute('data-kt-beauty-three-rooms','1');
  document.head.appendChild(s);
})();
