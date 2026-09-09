/* K-Talk 보정 연결: 13명 방송 + 구독자 방송에만 기존 1~100 보정창과 기본 자연 보정을 연결. 다른 방은 건드리지 않음. */
(function(){
  if(window.__ktBeautyThreeRoomsInstalled)return;
  window.__ktBeautyThreeRoomsInstalled=true;

  function clamp(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }

  function currentRoom(){
    if(document.querySelector('.ktg13-main'))return 'group13';
    if(document.querySelector('.ktsubscriber-main'))return 'subscriber';
    return '';
  }

  function applyDefaults(){
    if(!currentRoom()||!window.state)return;
    try{
      state.beautyOn=true;
      if(!(Number(state.beautySkin)>0))state.beautySkin=88;
      if(!(Number(state.beautyWrinkle)>0))state.beautyWrinkle=72;
      if(!(Number(state.beautyBright)>0))state.beautyBright=70;
      if(!(Number(state.beautySharp)>0))state.beautySharp=50;
      if(!(Number(state.beautyTone)>0))state.beautyTone=58;
      if(!(Number(state.beautyFace)>0))state.beautyFace=50;
      if(!(Number(state.beautyEyes)>0))state.beautyEyes=52;
      if(!(Number(state.beautyNose)>0))state.beautyNose=50;
      if(!(Number(state.beautyMouth)>0))state.beautyMouth=52;
    }catch(e){}
  }

  function applyLiveBeauty(){
    try{
      if(!currentRoom()||!window.state)return;
      var v=document.getElementById('ktLiveVideo');
      if(!v)return;
      applyDefaults();
      var skin=clamp(state.beautySkin,88);
      var bright=clamp(state.beautyBright,70);
      var sharp=clamp(state.beautySharp,50);
      var face=clamp(state.beautyFace,50);
      var eyes=clamp(state.beautyEyes,52);
      var nose=clamp(state.beautyNose,50);
      var mouth=clamp(state.beautyMouth,52);
      var tone=clamp(state.beautyTone,58);
      var brightness=1.00+(bright/100)*.18+(eyes-50)*.0007;
      var saturation=.98+(sharp/100)*.10+(mouth-50)*.0014;
      var contrast=.94+(sharp/100)*.08+(nose-50)*.0007;
      var blur=.10+(skin/100)*.55;
      var sepia=Math.max(0,(tone-45)*.0018);
      var scale=1+(face-50)*.0008;
      v.style.setProperty('filter','brightness('+brightness.toFixed(3)+') saturate('+saturation.toFixed(3)+') contrast('+contrast.toFixed(3)+') blur('+blur.toFixed(2)+'px) sepia('+sepia.toFixed(3)+')','important');
      v.style.setProperty('transform','scaleX(-1) scale('+scale.toFixed(3)+')','important');
    }catch(e){}
  }

  function decoratePanel(){
    if(!currentRoom())return;
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('beauty-control-sheet'))return;
      var controls=sheet.querySelector('.kt-beauty-controls-pro');
      if(controls){
        var eyes=controls.querySelector('[data-beauty-kind="eyes"]');
        var nose=controls.querySelector('[data-beauty-kind="nose"]');
        var mouth=controls.querySelector('[data-beauty-kind="mouth"]');
        if(eyes)eyes.innerHTML='<b>◉</b><span>눈</span><i></i>';
        if(nose)nose.innerHTML='<b>♢</b><span>코</span><i></i>';
        if(mouth)mouth.innerHTML='<b>👄</b><span>입</span><i></i>';
      }
      var group=sheet.querySelector('.kt-beauty-single-group');
      if(group){
        group.style.setProperty('display','block','important');
        group.style.setProperty('visibility','visible','important');
        group.style.setProperty('opacity','1','important');
        var range=group.querySelector('#beautySingleRange');
        if(range){range.min='1';range.max='100';range.style.setProperty('width','100%','important');}
        if(!group.querySelector('.kt-beauty-range-scale')){
          var scale=document.createElement('div');
          scale.className='kt-beauty-range-scale';
          scale.innerHTML='<span>1</span><strong>1 ~ 100 조절</strong><span>100</span>';
          group.appendChild(scale);
        }
      }
      var pro=sheet.querySelector('.kt-beauty-pro');
      if(pro&&!pro.querySelector('.kt-beauty-room-note')){
        var note=document.createElement('div');
        note.className='kt-beauty-room-note';
        note.textContent='13명·구독자 방송 기본 자연 보정 ON · 눈/코/입 각각 1~100 조절';
        var tabs=pro.querySelector('.kt-beauty-pro-tabs');
        if(tabs&&tabs.parentNode)tabs.parentNode.insertBefore(note,tabs.nextSibling);
      }
    }catch(e){}
  }

  if(!document.getElementById('ktBeauty13SubscriberStyle')){
    var st=document.createElement('style');
    st.id='ktBeauty13SubscriberStyle';
    st.textContent=''
      +'#sheet.beauty-control-sheet .kt-beauty-range-scale{display:flex!important;align-items:center!important;justify-content:space-between!important;margin-top:5px!important;font-size:11px!important;color:#ddd!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-range-scale strong{font-size:12px!important;color:#fff!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-room-note{margin:7px 0 4px!important;padding:7px 9px!important;border-radius:10px!important;background:rgba(128,70,255,.16)!important;color:#fff!important;font-size:11px!important;font-weight:850!important;text-align:center!important}';
    document.head.appendChild(st);
  }

  function installBridge(){
    if(window.__ktBeauty13SubscriberBridgeInstalled)return;
    window.__ktBeauty13SubscriberBridgeInstalled=true;

    var oldInfo=window.getBeautyControlInfo;
    if(typeof oldInfo==='function'){
      window.getBeautyControlInfo=function(kind){
        if(currentRoom()&&kind==='mouth')return {label:'입 조절',key:'beautyMouth',def:52};
        return oldInfo.apply(this,arguments);
      };
    }

    var oldSet=window.setBeautyValue;
    if(typeof oldSet==='function'){
      window.setBeautyValue=function(){
        var r=oldSet.apply(this,arguments);
        if(currentRoom())setTimeout(applyLiveBeauty,0);
        return r;
      };
    }

    var oldActive=window.setBeautyActiveValue;
    if(typeof oldActive==='function'){
      window.setBeautyActiveValue=function(){
        var r=oldActive.apply(this,arguments);
        if(currentRoom())setTimeout(applyLiveBeauty,0);
        return r;
      };
    }

    var oldAI=window.applyAIBeautyPreset;
    if(typeof oldAI==='function'){
      window.applyAIBeautyPreset=async function(){
        var r=await oldAI.apply(this,arguments);
        if(currentRoom())applyLiveBeauty();
        return r;
      };
    }

    var oldReset=window.resetBeautyAll;
    if(typeof oldReset==='function'){
      window.resetBeautyAll=function(){
        var r=oldReset.apply(this,arguments);
        if(currentRoom()){
          applyDefaults();
          setTimeout(function(){applyLiveBeauty();decoratePanel();},0);
        }
        return r;
      };
    }
  }

  function openBeauty(){
    if(!currentRoom())return;
    applyDefaults();
    installBridge();
    try{
      if(window.openBeautyPanel){
        window.openBeautyPanel();
        setTimeout(decoratePanel,0);
      }
    }catch(e){}
  }
  window.ktOpenLiveBeauty=openBeauty;

  function addSubscriberButton(){
    var tools=document.querySelector('.ktsubscriber-tools');
    if(!tools||tools.querySelector('[data-kt-live-beauty]'))return;
    tools.style.setProperty('grid-template-columns','repeat(7,minmax(0,1fr))','important');
    var b=document.createElement('button');
    b.type='button';
    b.className='ktsubscriber-tool';
    b.setAttribute('data-kt-live-beauty','1');
    b.setAttribute('aria-label','보정');
    b.innerHTML='<i>🪞</i><span>보정</span>';
    b.onclick=openBeauty;
    tools.insertBefore(b,tools.lastElementChild||null);
  }

  function apply(){
    var room=currentRoom();
    if(!room)return;
    applyDefaults();
    installBridge();
    if(room==='subscriber')addSubscriberButton();
    applyLiveBeauty();
    decoratePanel();
  }

  var observer=new MutationObserver(function(){setTimeout(apply,0);});
  try{observer.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setInterval(apply,900);
  setTimeout(apply,0);
})();
