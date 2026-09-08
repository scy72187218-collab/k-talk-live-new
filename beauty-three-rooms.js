/* K-Talk 보정 연결: 1인/구독자/비밀방에 기존 1~100 보정창과 기본 자연 보정을 연결. 13명방은 기존 전용 연결을 그대로 사용. */
(function(){
  if(window.__ktBeautyThreeRoomsInstalled)return;
  window.__ktBeautyThreeRoomsInstalled=true;

  function clamp(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }

  function currentRoom(){
    if(document.querySelector('.ktsolo-main'))return 'solo';
    if(document.querySelector('.ktsubscriber-main'))return 'subscriber';
    if(document.querySelector('.ktsecret-main'))return 'secret';
    return '';
  }

  function applyLiveBeauty(){
    try{
      if(!currentRoom()||!window.state)return;
      var v=document.getElementById('ktLiveVideo');
      if(!v)return;
      state.beautyOn=true;
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

  function installBridge(){
    if(window.__ktBeautyThreeRoomsBridgeInstalled)return;
    window.__ktBeautyThreeRoomsBridgeInstalled=true;

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

  function loadBeauty(done){
    if(window.__ktBeautyNaturalUpgradeInstalled){installBridge();if(done)done();return;}
    var old=document.querySelector('script[data-kt-beauty-natural-upgrade]');
    if(old){
      old.addEventListener('load',function(){installBridge();if(done)done();},{once:true});
      return;
    }
    var s=document.createElement('script');
    s.src='beauty-natural-upgrade.js?v=20260909-all4';
    s.async=false;
    s.setAttribute('data-kt-beauty-natural-upgrade','1');
    s.onload=function(){installBridge();applyLiveBeauty();if(done)done();};
    document.head.appendChild(s);
  }

  function openBeauty(){
    loadBeauty(function(){
      try{if(window.openBeautyPanel)window.openBeautyPanel();}catch(e){}
    });
  }
  window.ktOpenLiveBeauty=openBeauty;

  function addButton(selector,buttonClass){
    var tools=document.querySelector(selector);
    if(!tools||tools.querySelector('[data-kt-live-beauty]'))return;
    tools.style.setProperty('grid-template-columns','repeat(7,minmax(0,1fr))','important');
    var b=document.createElement('button');
    b.type='button';
    b.className=buttonClass;
    b.setAttribute('data-kt-live-beauty','1');
    b.setAttribute('aria-label','보정');
    b.innerHTML='<i>🪞</i><span>보정</span>';
    b.onclick=openBeauty;
    tools.insertBefore(b,tools.lastElementChild||null);
  }

  function apply(){
    var room=currentRoom();
    if(!room)return;
    loadBeauty(function(){
      if(room==='solo')addButton('.ktsolo-tools','ktsolo-tool');
      if(room==='subscriber')addButton('.ktsubscriber-tools','ktsubscriber-tool');
      if(room==='secret')addButton('.ktsecret-tools','ktsecret-tool');
      applyLiveBeauty();
    });
  }

  var observer=new MutationObserver(function(){setTimeout(apply,0);});
  try{observer.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setInterval(apply,900);
  setTimeout(apply,0);
})();
