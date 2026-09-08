/* K-Talk 13명 방 오른쪽 퀵 버튼: 좋아요/선물/매치/보정/효과만 추가. 다른 방과 기존 13명 방 배치는 건드리지 않음. */
(function(){
  if(window.__ktGroup13RightQuickInstalled)return;
  window.__ktGroup13RightQuickInstalled=true;

  window.__ktGroup13LikeCount=Number(window.__ktGroup13LikeCount||0);

  function clamp(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }

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
      +'.ktg13-right-quick .ktg13-beauty{border-color:rgba(189,120,255,.64);background:linear-gradient(145deg,rgba(87,44,130,.95),rgba(35,20,58,.95));box-shadow:0 0 10px rgba(171,90,255,.32)}'
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

  function applyLiveBeauty(){
    try{
      var v=document.getElementById('ktLiveVideo');
      if(!v||!window.state)return;
      var skin=clamp(state.beautySkin,88);
      var bright=clamp(state.beautyBright,70);
      var sharp=clamp(state.beautySharp,50);
      var face=clamp(state.beautyFace,50);
      var eyes=clamp(state.beautyEyes,52);
      var nose=clamp(state.beautyNose,50);
      var mouth=clamp(state.beautyMouth,52);
      var tone=clamp(state.beautyTone,58);
      var jaw=clamp(state.beautyJaw,50);
      var brightness=1.00+(bright/100)*.18+(eyes-50)*.0007;
      var saturation=.98+(sharp/100)*.10+(mouth-50)*.0014;
      var contrast=.94+(sharp/100)*.08+(nose-50)*.0007;
      var blur=.10+(skin/100)*.55;
      var sepia=Math.max(0,(tone-45)*.0018);
      var scale=1+(face-50)*.0008+(50-jaw)*.00035;
      v.style.setProperty('filter','brightness('+brightness.toFixed(3)+') saturate('+saturation.toFixed(3)+') contrast('+contrast.toFixed(3)+') blur('+blur.toFixed(2)+'px) sepia('+sepia.toFixed(3)+')','important');
      v.style.setProperty('transform','scaleX(-1) scale('+scale.toFixed(3)+')','important');
    }catch(e){}
  }

  function installBeautyBridge(){
    if(window.__ktGroup13BeautyBridgeInstalled)return;
    window.__ktGroup13BeautyBridgeInstalled=true;

    var oldSet=window.setBeautyValue;
    if(typeof oldSet==='function'){
      window.setBeautyValue=function(){
        var r=oldSet.apply(this,arguments);
        setTimeout(applyLiveBeauty,0);
        return r;
      };
    }

    var oldActive=window.setBeautyActiveValue;
    if(typeof oldActive==='function'){
      window.setBeautyActiveValue=function(){
        var r=oldActive.apply(this,arguments);
        setTimeout(applyLiveBeauty,0);
        return r;
      };
    }

    var oldAI=window.applyAIBeautyPreset;
    if(typeof oldAI==='function'){
      window.applyAIBeautyPreset=async function(){
        var r=await oldAI.apply(this,arguments);
        applyLiveBeauty();
        return r;
      };
    }

    var oldReset=window.resetBeautyAll;
    if(typeof oldReset==='function'){
      window.resetBeautyAll=function(){
        var r=oldReset.apply(this,arguments);
        setTimeout(applyLiveBeauty,0);
        return r;
      };
    }
  }

  function loadBeautyUpgrade(done){
    if(window.__ktBeautyNaturalUpgradeInstalled){installBeautyBridge();if(done)done();return;}
    var old=document.querySelector('script[data-kt-beauty-natural-upgrade]');
    if(old){
      old.addEventListener('load',function(){installBeautyBridge();if(done)done();},{once:true});
      return;
    }
    var s=document.createElement('script');
    s.src='beauty-natural-upgrade.js?v=20260909-group13';
    s.async=false;
    s.setAttribute('data-kt-beauty-natural-upgrade','1');
    s.onload=function(){installBeautyBridge();applyLiveBeauty();if(done)done();};
    document.head.appendChild(s);
  }

  function beauty(){
    loadBeautyUpgrade(function(){
      try{
        if(window.openBeautyPanel){window.openBeautyPanel();return;}
      }catch(e){}
      try{if(window.showSheet)window.showSheet('AI 보정','<div class="rowbox"><b>AI 보정</b><br>피부·주름·눈·코·입·턱을 1~100으로 조절합니다.</div>');}catch(e){}
    });
  }

  window.ktGroup13QuickLike=like;
  window.ktGroup13QuickGift=gift;
  window.ktGroup13QuickMatch=match;
  window.ktGroup13QuickBeauty=beauty;
  window.ktGroup13QuickEffect=effect;

  function apply(){
    var main=document.querySelector('.ktg13-main');
    if(!main)return;
    ensureStyle();
    loadBeautyUpgrade(function(){applyLiveBeauty();});

    var host=main.querySelector('.ktg13-host');
    if(host){
      host.style.removeProperty('background-image');
      host.style.removeProperty('background-size');
      host.style.removeProperty('background-position');
    }

    if(main.querySelector('.ktg13-right-quick'))return;
    var box=document.createElement('div');
    box.className='ktg13-right-quick';
    box.innerHTML=''
      +'<button class="ktg13-like" type="button" onclick="ktGroup13QuickLike()" aria-label="좋아요"><b>💗</b><span>좋아요</span><em id="ktg13LikeCount">'+String(window.__ktGroup13LikeCount)+'</em></button>'
      +'<button type="button" onclick="ktGroup13QuickGift()" aria-label="선물"><b>🎁</b><span>선물</span></button>'
      +'<button type="button" onclick="ktGroup13QuickMatch()" aria-label="매치"><b>⚔</b><span>매치</span></button>'
      +'<button class="ktg13-beauty" type="button" onclick="ktGroup13QuickBeauty()" aria-label="보정"><b>🪞</b><span>보정</span></button>'
      +'<button type="button" onclick="ktGroup13QuickEffect()" aria-label="효과"><b>✨</b><span>효과</span></button>';
    main.appendChild(box);
    applyLiveBeauty();
  }

  loadBeautyUpgrade(function(){installBeautyBridge();});
  var observer=new MutationObserver(function(){apply();});
  try{observer.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setInterval(apply,800);
  setTimeout(apply,0);
})();

/* 1인/구독자/비밀방에도 같은 1~100 보정을 연결한다. */
(function(){
  if(document.querySelector('script[data-kt-beauty-three-rooms]'))return;
  var s=document.createElement('script');
  s.src='beauty-three-rooms.js?v=20260909-all4';
  s.async=false;
  s.setAttribute('data-kt-beauty-three-rooms','1');
  document.head.appendChild(s);
})();
