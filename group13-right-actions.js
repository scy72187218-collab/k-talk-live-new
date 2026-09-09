/* K-Talk 1인/13명 방송 오른쪽 퀵 버튼만 통일: 좋아요/효과/보물상자/매치. 구독자/비밀방 및 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktSoloGroup13RightQuickInstalled)return;
  window.__ktSoloGroup13RightQuickInstalled=true;

  window.__ktGroup13LikeCount=Number(window.__ktGroup13LikeCount||0);

  function ensureStyle(){
    if(document.getElementById('ktSoloGroup13RightQuickStyle'))return;
    var s=document.createElement('style');
    s.id='ktSoloGroup13RightQuickStyle';
    s.textContent=''
      +'.ktg13-right-quick{position:absolute;right:7px;top:50%;transform:translateY(-50%);z-index:40;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:auto}'
      +'.ktg13-right-quick button{width:54px;height:54px;border-radius:50%;border:1px solid rgba(255,255,255,.22);background:rgba(28,28,32,.92);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0;box-shadow:0 2px 8px rgba(0,0,0,.4);font-family:inherit;font-weight:950;touch-action:manipulation}'
      +'.ktg13-right-quick button b{font-size:22px;line-height:1}'
      +'.ktg13-right-quick button span{font-size:9px;line-height:1.05;margin-top:3px;white-space:nowrap}'
      +'.ktg13-right-quick .ktg13-like{height:66px;border-radius:20px;border-color:rgba(255,62,170,.55);background:rgba(70,32,57,.94);box-shadow:0 0 8px rgba(255,52,171,.26)}'
      +'.ktg13-right-quick .ktg13-like b{font-size:25px}'
      +'.ktg13-right-quick .ktg13-like em{font-style:normal;font-size:10px;line-height:1;margin-top:3px}'
      +'.ktg13-right-quick .ktg13-treasure{border-color:rgba(255,203,72,.62);background:linear-gradient(145deg,rgba(92,63,13,.96),rgba(37,27,9,.96));box-shadow:0 0 10px rgba(255,194,55,.28)}'
      +'.ktsolo-right.kt-synced-actions button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:0!important;touch-action:manipulation!important}'
      +'.ktsolo-right.kt-synced-actions button b{font-size:17px;line-height:1}'
      +'.ktsolo-right.kt-synced-actions button small{display:block!important;font-size:8px!important;line-height:1.05!important;margin-top:2px!important;white-space:nowrap!important}'
      +'.ktsolo-right.kt-synced-actions .like b{font-size:18px}'
      +'.ktsolo-right.kt-synced-actions .kt-solo-treasure{border-color:rgba(255,203,72,.62)!important;background:linear-gradient(145deg,rgba(92,63,13,.96),rgba(37,27,9,.96))!important}'
      +'@media(max-width:390px){.ktg13-right-quick{right:4px;gap:5px}.ktg13-right-quick button{width:44px;height:44px}.ktg13-right-quick .ktg13-like{height:54px;border-radius:17px}.ktg13-right-quick button b{font-size:18px}.ktg13-right-quick button span,.ktg13-right-quick .ktg13-like em{font-size:8px}}';
    document.head.appendChild(s);
  }

  function hostLike(){
    try{
      if(window.addHostLike){window.addHostLike(1);return;}
    }catch(e){}
    window.__ktGroup13LikeCount++;
    var n=document.getElementById('ktg13LikeCount');
    if(n)n.textContent=String(window.__ktGroup13LikeCount);
  }

  function effect(kind){
    try{
      if(kind==='solo'&&window.ktSoloEffect){window.ktSoloEffect();return;}
      if(kind==='group13'&&window.ktGroup13Effect){window.ktGroup13Effect();return;}
    }catch(e){}
    try{if(window.openEditEffectPanel){window.openEditEffectPanel();return;}}catch(e){}
  }

  function treasure(){
    try{if(window.openTreasure){window.openTreasure();return;}}catch(e){}
    try{if(window.openGifts){window.openGifts();return;}}catch(e){}
  }

  function match(){
    try{if(window.openHostMatchArena){window.openHostMatchArena('1대1');return;}}catch(e){}
    try{if(window.openMatchArena){window.openMatchArena('1대1');return;}}catch(e){}
    try{
      if(window.ktRenderMatchArena){
        if(window.showSheet)window.showSheet('호스트 매치','<div class="kt-match-arena"></div>');
        window.ktRenderMatchArena('1대1');
      }
    }catch(e){}
  }

  window.ktUnifiedQuickLike=hostLike;
  window.ktUnifiedQuickEffect=effect;
  window.ktUnifiedQuickTreasure=treasure;
  window.ktUnifiedQuickMatch=match;

  function applyGroup13(){
    var main=document.querySelector('.ktg13-main');
    if(!main)return;
    ensureStyle();

    var box=main.querySelector('.ktg13-right-quick');
    if(!box){
      box=document.createElement('div');
      box.className='ktg13-right-quick';
      main.appendChild(box);
    }
    if(box.getAttribute('data-kt-actions')==='same4')return;
    box.setAttribute('data-kt-actions','same4');
    box.innerHTML=''
      +'<button class="ktg13-like" type="button" onclick="ktUnifiedQuickLike()" aria-label="좋아요"><b>💗</b><span>좋아요</span><em id="ktg13LikeCount">'+String(window.__ktGroup13LikeCount)+'</em></button>'
      +'<button type="button" onclick="ktUnifiedQuickEffect(\'group13\')" aria-label="효과"><b>✨</b><span>효과</span></button>'
      +'<button class="ktg13-treasure" type="button" onclick="ktUnifiedQuickTreasure()" aria-label="보물상자"><b>🎁</b><span>보물상자</span></button>'
      +'<button type="button" onclick="ktUnifiedQuickMatch()" aria-label="매치"><b>⚔</b><span>매치</span></button>';
  }

  function applySolo(){
    var box=document.querySelector('.ktsolo-right');
    if(!box)return;
    ensureStyle();
    if(box.getAttribute('data-kt-actions')==='same4')return;
    box.setAttribute('data-kt-actions','same4');
    box.classList.add('kt-synced-actions');
    box.innerHTML=''
      +'<button class="like" type="button" onclick="ktUnifiedQuickLike()" aria-label="좋아요"><b>💗</b><small>좋아요</small><em id="hostLikeCount" style="font-style:normal;display:block;font-size:8px">0</em></button>'
      +'<button type="button" onclick="ktUnifiedQuickEffect(\'solo\')" aria-label="효과"><b>✨</b><small>효과</small></button>'
      +'<button class="kt-solo-treasure" type="button" onclick="ktUnifiedQuickTreasure()" aria-label="보물상자"><b>🎁</b><small>보물상자</small></button>'
      +'<button type="button" onclick="ktUnifiedQuickMatch()" aria-label="매치"><b>⚔</b><small>매치</small></button>';
  }

  function apply(){
    applySolo();
    applyGroup13();
  }

  var observer=new MutationObserver(function(){apply();});
  try{observer.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setInterval(apply,800);
  setTimeout(apply,0);
})();

/* 기존 보정 연결은 그대로 유지한다. */
(function(){
  if(document.querySelector('script[data-kt-beauty-three-rooms]'))return;
  var s=document.createElement('script');
  s.src='beauty-three-rooms.js?v=20260909-all4';
  s.async=false;
  s.setAttribute('data-kt-beauty-three-rooms','1');
  document.head.appendChild(s);
})();

/* 1인 방송은 사용자가 승인한 첫 번째 사진 구성을 별도 잠금한다. */
(function(){
  if(document.querySelector('script[data-kt-solo-first-photo-lock]'))return;
  var s=document.createElement('script');
  s.src='solo-first-photo-lock.js?v=20260909-1342';
  s.async=false;
  s.setAttribute('data-kt-solo-first-photo-lock','1');
  document.head.appendChild(s);
})();
