/* K-Talk 13명방 오른쪽 퀵 버튼만 복구: 좋아요 -> 효과 -> 보물상자 -> 매치. 다른 방은 건드리지 않음. */
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
  window.ktGroup13QuickMatch=match;
  window.ktGroup13QuickEffect=effect;
  window.ktGroup13QuickTreasure=treasure;

  function apply(){
    var main=document.querySelector('.ktg13-main');
    if(!main)return;
    ensureStyle();

    var box=main.querySelector('.ktg13-right-quick');
    if(!box){
      box=document.createElement('div');
      box.className='ktg13-right-quick';
      main.appendChild(box);
    }

    var likeBtn=box.querySelector('[aria-label="좋아요"]');
    if(!likeBtn){
      likeBtn=document.createElement('button');
      likeBtn.className='ktg13-like';
      likeBtn.type='button';
      likeBtn.setAttribute('onclick','ktGroup13QuickLike()');
      likeBtn.setAttribute('aria-label','좋아요');
      likeBtn.innerHTML='<b>💗</b><span>좋아요</span><em id="ktg13LikeCount">'+String(window.__ktGroup13LikeCount)+'</em>';
    }

    var effectBtn=box.querySelector('[aria-label="효과"]');
    if(!effectBtn){
      effectBtn=document.createElement('button');
      effectBtn.type='button';
      effectBtn.setAttribute('onclick','ktGroup13QuickEffect()');
      effectBtn.setAttribute('aria-label','효과');
      effectBtn.innerHTML='<b>✨</b><span>효과</span>';
    }

    var chest=box.querySelector('[aria-label="보물상자"]');
    if(!chest){
      chest=document.createElement('button');
      chest.className='ktg13-treasure';
      chest.type='button';
      chest.setAttribute('onclick','ktGroup13QuickTreasure()');
      chest.setAttribute('aria-label','보물상자');
      chest.innerHTML='<b>🎁</b><span>보물상자</span>';
    }

    var matchBtn=box.querySelector('[aria-label="매치"]');
    if(!matchBtn){
      matchBtn=document.createElement('button');
      matchBtn.type='button';
      matchBtn.setAttribute('onclick','ktGroup13QuickMatch()');
      matchBtn.setAttribute('aria-label','매치');
      matchBtn.innerHTML='<b>⚔</b><span>매치</span>';
    }

    box.innerHTML='';
    box.appendChild(likeBtn);
    box.appendChild(effectBtn);
    box.appendChild(chest);
    box.appendChild(matchBtn);
  }

  var observer=new MutationObserver(function(){apply();});
  try{observer.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setInterval(apply,800);
  setTimeout(apply,0);
})();
