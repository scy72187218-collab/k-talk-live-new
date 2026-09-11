/* K-Talk 방 선택 스위치만 보강: 1인/13명/구독자/비밀방. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktRoomSwitchFix20260910Installed)return;
  window.__ktRoomSwitchFix20260910Installed=true;

  function roomInfo(btn){
    var text=String((btn&&btn.textContent)||'').replace(/\s+/g,'').trim();
    if(text.indexOf('13명')>-1)return {type:'group',name:'13명 방송',max:13};
    if(text.indexOf('구독자')>-1)return {type:'subscriber',name:'구독자 방송',max:10};
    if(text.indexOf('비밀')>-1)return {type:'password',name:'비밀방',max:7};
    return {type:'solo',name:'1인 방송',max:1};
  }

  function savedPassword(){
    try{return String(localStorage.getItem('kt_secret_room_password')||'').replace(/\D/g,'').slice(0,4);}catch(e){return '';}
  }

  function savePassword(v){
    v=String(v||'').replace(/\D/g,'').slice(0,4);
    try{localStorage.setItem('kt_secret_room_password',v);}catch(e){}
    try{if(window.state)state.liveRoomPassword=v;}catch(e){}
    return v;
  }

  function ensurePasswordBox(){
    var card=document.querySelector('.live-prep .prep-card')||document.querySelector('.prep-card');
    if(!card)return null;
    var box=document.getElementById('ktSecretPasswordBox');
    if(!box){
      box=document.createElement('div');
      box.id='ktSecretPasswordBox';
      box.innerHTML='<label>🔒 비밀방 비밀번호</label><div id="ktSecretPasswordRow"><input id="ktSecretPassword" type="password" inputmode="numeric" maxlength="4" placeholder="4자리" aria-label="비밀방 비밀번호 4자리"><button id="ktSecretPasswordSave" type="button">저장</button></div><div id="ktSecretPasswordHelp">비밀방에 들어올 때 사용할 숫자 4자리를 입력하세요.</div><div id="ktSecretPasswordError">비밀번호 4자리를 입력해 주세요.</div>';
      var start=card.querySelector('.prep-start');
      card.insertBefore(box,start||null);
      var input=box.querySelector('#ktSecretPassword');
      input.value=(window.state&&state.liveRoomPassword)||savedPassword();
      input.addEventListener('input',function(){
        this.value=this.value.replace(/\D/g,'').slice(0,4);
        var er=document.getElementById('ktSecretPasswordError');if(er)er.style.display='none';
      });
      box.querySelector('#ktSecretPasswordSave').addEventListener('click',function(ev){
        ev.preventDefault();ev.stopPropagation();
        var v=savePassword(input.value);
        var er=document.getElementById('ktSecretPasswordError');
        if(er)er.style.display=v.length===4?'none':'block';
        if(v.length===4){
          this.textContent='저장됨';
          setTimeout(function(){var b=document.getElementById('ktSecretPasswordSave');if(b)b.textContent='저장';},800);
        }
      });
    }
    return box;
  }

  function showPasswordBox(on){
    var box=on?ensurePasswordBox():document.getElementById('ktSecretPasswordBox');
    if(!box)return;
    box.classList.toggle('on',!!on);
    box.style.setProperty('display',on?'block':'none','important');
    if(on){
      var input=document.getElementById('ktSecretPassword');
      var saved=(window.state&&state.liveRoomPassword)||savedPassword();
      if(input&&saved&&!input.value)input.value=saved;
    }
  }

  function selectRoom(btn){
    if(!btn)return;
    var info=roomInfo(btn);
    document.querySelectorAll('.room-switch').forEach(function(b){
      var on=b===btn;
      b.classList.toggle('on',on);
      b.setAttribute('aria-pressed',on?'true':'false');
    });
    try{
      if(window.state){
        state.liveRoomType=info.type;
        state.liveRoomName=info.name;
        state.liveRoomMax=info.max;
      }
    }catch(e){}
    var title=document.getElementById('liveTitle');
    if(title){title.value=info.name;title.dataset.autoRoom='1';}
    if(typeof window.selectPrepRoom==='function'){
      try{window.selectPrepRoom(btn,info.type,info.name,info.max);}catch(e){}
    }
    showPasswordBox(info.type==='password');
    setTimeout(function(){showPasswordBox(info.type==='password');},30);
  }

  if(!document.getElementById('ktRoomSwitchFixStyle')){
    var st=document.createElement('style');
    st.id='ktRoomSwitchFixStyle';
    st.textContent=''
      +'.live-prep .room-switch-row{position:relative!important;z-index:30!important;pointer-events:auto!important}'
      +'.live-prep .room-switch{position:relative!important;z-index:31!important;pointer-events:auto!important;touch-action:manipulation!important;-webkit-tap-highlight-color:transparent!important}'
      +'#ktSecretPasswordBox{display:none;margin:6px 0 58px;padding:8px;border:1px solid rgba(255,190,60,.45);border-radius:13px;background:rgba(30,20,5,.72);color:#fff;position:relative;z-index:32}'
      +'#ktSecretPasswordBox.on{display:block!important}'
      +'#ktSecretPasswordBox label{display:block;margin-bottom:5px;color:#ffe16b;font-size:12px;font-weight:950}'
      +'#ktSecretPasswordRow{display:flex;gap:7px;align-items:center}'
      +'#ktSecretPassword{flex:1;min-width:0;height:38px;border-radius:11px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.10);color:#fff;font-size:17px;font-weight:900;letter-spacing:7px;text-align:center;outline:none}'
      +'#ktSecretPasswordSave{height:38px;padding:0 14px;border:0;border-radius:11px;background:linear-gradient(135deg,#ffb62f,#ff7a2f);color:#17100a;font-weight:950}'
      +'#ktSecretPasswordHelp{margin-top:4px;color:#ddd;font-size:9px}'
      +'#ktSecretPasswordError{display:none;margin-top:4px;color:#ff7c92;font-size:10px;font-weight:900}';
    document.head.appendChild(st);
  }

  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.live-prep .room-switch'):null;
    if(!btn)return;
    e.preventDefault();
    e.stopImmediatePropagation();
    selectRoom(btn);
  },true);

  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter'&&e.key!==' ')return;
    var btn=e.target&&e.target.closest?e.target.closest('.live-prep .room-switch'):null;
    if(!btn)return;
    e.preventDefault();
    selectRoom(btn);
  },true);
})();

/* 2026-09-11 비밀방: 호스트·게스트 칸만 위쪽에 보이도록 정리. 다른 UI는 변경하지 않음. */
(function(){
  if(document.getElementById('ktSecretGuestLift20260911'))return;
  var st=document.createElement('style');
  st.id='ktSecretGuestLift20260911';
  st.textContent=''
    +'.ktsecret-room .ktsecret-six-grid{top:0!important;right:0!important;bottom:145px!important;left:0!important}'
    +'@media(max-width:390px){.ktsecret-room .ktsecret-six-grid{bottom:132px!important}}';
  document.head.appendChild(st);
})();

/* 2026-09-11 비밀방 채팅: 채팅 칸 배경 없이 카메라 화면 위에 글씨만 떠 보이게. 다른 UI는 변경하지 않음. */
(function(){
  if(document.getElementById('ktSecretFloatingChat20260911'))return;
  var st=document.createElement('style');
  st.id='ktSecretFloatingChat20260911';
  st.textContent=''
    +'.ktsecret-room .ktsecret-chat{background:transparent!important;border:0!important;border-radius:0!important;box-shadow:none!important;padding:0 5px 5px!important;pointer-events:none!important}'
    +'.ktsecret-room .ktsecret-chat:empty:before{background:transparent!important;text-shadow:0 1px 3px #000,0 0 5px #000!important}'
    +'.ktsecret-room .ktsecret-chat-line{background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;text-shadow:0 1px 3px #000,0 0 5px #000!important}';
  document.head.appendChild(st);
})();

/* 4개 방송방 채팅 입력: 글 입력칸 바로 오른쪽에 '보내기' 버튼을 붙인다. */
(function(){
  if(window.__ktChatSendInlineInstalled)return;
  window.__ktChatSendInlineInstalled=true;
  var st=document.createElement('style');
  st.id='ktChatSendInlineStyle';
  st.textContent=''
    +'#sheetBody #ktsoloChatInput,#sheetBody #ktsubscriberChatInput,#sheetBody #ktsecretChatInput,#sheetBody #ktg13ChatInput{display:inline-block!important;vertical-align:top!important;width:calc(100% - 94px)!important;height:44px!important;margin:0!important;box-sizing:border-box!important}'
    +'#sheetBody #ktsoloChatInput + .act,#sheetBody #ktsubscriberChatInput + .act,#sheetBody #ktsecretChatInput + .act,#sheetBody #ktg13ChatInput + .act{display:inline-flex!important;vertical-align:top!important;width:86px!important;height:44px!important;margin:0 0 0 8px!important;padding:0 10px!important;align-items:center!important;justify-content:center!important;box-sizing:border-box!important;font-weight:950!important}';
  document.head.appendChild(st);
})();

/* 1인/13명/비밀방 오른쪽 좋아요·효과·보물상자·매치: 테두리만 제거. 다른 스타일/기능은 그대로. */
(function(){
  if(document.getElementById('ktRightActionBorderless20260911'))return;
  var st=document.createElement('style');
  st.id='ktRightActionBorderless20260911';
  st.textContent=''
    +'.ktsolo-right button,.ktg13-right-quick button,.ktsecret-right button{border:0!important}';
  document.head.appendChild(st);
})();

/* 비밀방 하단만 정리: 수익은 파형 바로 위 오른쪽, 채팅은 왼쪽. 다른 방/기능은 변경하지 않음. */
(function(){
  if(window.__ktSecretBottomOnly20260911)return;
  window.__ktSecretBottomOnly20260911=true;

  function apply(){
    var room=document.querySelector('.ktsecret-room');
    if(!room)return;
    var main=room.querySelector('.ktsecret-main');
    var earn=room.querySelector('.ktsecret-earn-row');
    var chat=room.querySelector('.ktsecret-chat');
    if(!main||!earn)return;

    if(earn.parentNode!==main)main.appendChild(earn);
    earn.style.setProperty('position','absolute','important');
    earn.style.setProperty('right','6px','important');
    earn.style.setProperty('bottom','74px','important');
    earn.style.setProperty('left','auto','important');
    earn.style.setProperty('width','160px','important');
    earn.style.setProperty('height','64px','important');
    earn.style.setProperty('padding','0','important');
    earn.style.setProperty('z-index','14','important');
    earn.style.setProperty('display','flex','important');
    earn.style.setProperty('align-items','flex-end','important');
    earn.style.setProperty('justify-content','flex-end','important');
    earn.style.setProperty('overflow','visible','important');

    var hud=earn.querySelector('#myEarnHud');
    if(hud){
      hud.style.setProperty('position','static','important');
      hud.style.setProperty('inset','auto','important');
      hud.style.setProperty('left','auto','important');
      hud.style.setProperty('right','auto','important');
      hud.style.setProperty('top','auto','important');
      hud.style.setProperty('bottom','auto','important');
      hud.style.setProperty('transform','none','important');
    }

    if(chat){
      chat.style.setProperty('left','8px','important');
      chat.style.setProperty('right','174px','important');
      chat.style.setProperty('bottom','70px','important');
    }
  }

  if(!document.getElementById('ktSecretBottomOnlyStyle20260911')){
    var st=document.createElement('style');
    st.id='ktSecretBottomOnlyStyle20260911';
    st.textContent=''
      +'.ktsecret-room .ktsecret-gifts{bottom:3px!important}'
      +'.ktsecret-room .ktsecret-earn-row #myEarnHud{position:static!important;inset:auto!important;transform:none!important}'
      +'@media(max-width:390px){.ktsecret-room .ktsecret-earn-row{right:5px!important;bottom:68px!important;width:145px!important;height:58px!important}.ktsecret-room .ktsecret-chat{right:154px!important;bottom:64px!important}.ktsecret-room .ktsecret-gifts{bottom:3px!important}}';
    document.head.appendChild(st);
  }

  var ob=new MutationObserver(function(){apply();});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(apply,0);
  setTimeout(apply,120);
})();

/* 2026-09-11 파장: 1인·13명·구독자·비밀방 모두 카메라/참여자 화면 안에서만 표시. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktWaveCameraOnly20260911)return;
  window.__ktWaveCameraOnly20260911=true;

  if(!document.getElementById('ktWaveCameraOnlyStyle20260911')){
    var st=document.createElement('style');
    st.id='ktWaveCameraOnlyStyle20260911';
    st.textContent=''
      +'.ktsolo-main,.ktsubscriber-stage,.ktg13-main,.ktsecret-main{position:relative!important;overflow:hidden!important}'
      +'.ktsolo-main>.ktsolo-wave{left:0!important;right:0!important;bottom:72px!important;width:auto!important}'
      +'.ktsubscriber-stage>.ktsubscriber-wave{position:absolute!important;left:0!important;right:59px!important;bottom:4px!important;width:auto!important;height:34px!important;z-index:8!important}'
      +'.ktg13-main::after{left:0!important;right:0!important;bottom:2px!important}'
      +'.ktsecret-main>.ktsecret-wave{left:3px!important;right:3px!important;bottom:145px!important;width:auto!important;height:34px!important;z-index:8!important}'
      +'@media(max-width:390px){.ktsubscriber-stage>.ktsubscriber-wave{right:49px!important}.ktsecret-main>.ktsecret-wave{bottom:132px!important}}';
    document.head.appendChild(st);
  }

  function apply(){
    var soloMain=document.querySelector('.ktsolo-room .ktsolo-main');
    var soloWave=document.querySelector('.ktsolo-room .ktsolo-wave');
    if(soloMain&&soloWave&&soloWave.parentNode!==soloMain)soloMain.appendChild(soloWave);

    var subStage=document.querySelector('.ktsubscriber-room .ktsubscriber-stage');
    var subWave=document.querySelector('.ktsubscriber-room .ktsubscriber-wave');
    if(subStage&&subWave&&subWave.parentNode!==subStage)subStage.appendChild(subWave);

    var secretMain=document.querySelector('.ktsecret-room .ktsecret-main');
    var secretWave=document.querySelector('.ktsecret-room .ktsecret-wave');
    if(secretMain&&secretWave&&secretWave.parentNode!==secretMain)secretMain.appendChild(secretWave);
  }

  var ob=new MutationObserver(function(){apply();});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(apply,0);
  setTimeout(apply,80);
  setTimeout(apply,220);
})();

/* 2026-09-11 파장 최종: 실제 카메라/사진이 열린 칸 하단에만 표시. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktWaveInsideOpenCamera20260911)return;
  window.__ktWaveInsideOpenCamera20260911=true;

  if(!document.getElementById('ktWaveInsideOpenCameraStyle20260911')){
    var st=document.createElement('style');
    st.id='ktWaveInsideOpenCameraStyle20260911';
    st.textContent=''
      +'.ktsolo-wave,.ktsubscriber-wave,.ktsecret-wave,.kt-secret-wave,.secret-wave{display:none!important}'
      +'.ktg13-main::after{display:none!important;content:none!important}'
      +'.kt-open-camera-wave{position:absolute!important;left:0!important;right:0!important;bottom:0!important;height:26px!important;z-index:5!important;display:block!important;pointer-events:none!important;background-image:url("k-talk-rainbow-waveform.svg?v=20260907-wavebottom1")!important;background-repeat:no-repeat!important;background-position:center!important;background-size:100% 100%!important;opacity:.96!important;filter:drop-shadow(0 0 4px rgba(255,65,210,.35))!important;transform-origin:center bottom!important;animation:ktOpenCameraWaveBeat .62s ease-in-out infinite alternate!important}'
      +'.ktsolo-main>.kt-open-camera-wave{left:0!important;right:62px!important;bottom:143px!important;height:34px!important}'
      +'.ktsecret-slot,.ktsubscriber-host,.ktsubscriber-guest,.ktg13-host,.ktg13-guest{position:relative!important;overflow:hidden!important}'
      +'.ktsecret-slot-label,.ktsubscriber-host-label,.ktsubscriber-guest b,.ktg13-host-label{z-index:6!important}'
      +'@keyframes ktOpenCameraWaveBeat{0%{transform:scaleY(.58)}28%{transform:scaleY(1.10)}52%{transform:scaleY(.76)}76%{transform:scaleY(1.18)}100%{transform:scaleY(.68)}}';
    document.head.appendChild(st);
  }

  function hasMedia(el){
    if(!el)return false;
    if(el.classList.contains('ktsolo-main'))return !!el.querySelector('video');
    if(el.classList.contains('ktsubscriber-host')||el.classList.contains('ktg13-host')||el.classList.contains('host'))return !!el.querySelector('video,img,canvas');
    if(el.querySelector('video,img,canvas,.ktsecret-guest-photo'))return true;
    try{
      var bg=getComputedStyle(el).backgroundImage||'';
      if(bg&&bg!=='none'&&bg.indexOf('linear-gradient')===-1&&bg.indexOf('radial-gradient')===-1)return true;
    }catch(e){}
    return false;
  }

  function setWave(el,on){
    if(!el)return;
    var wave=el.querySelector(':scope > .kt-open-camera-wave');
    if(on){
      if(!wave){
        wave=document.createElement('div');
        wave.className='kt-open-camera-wave';
        el.appendChild(wave);
      }
    }else if(wave){
      wave.remove();
    }
  }

  function apply(){
    var solo=document.querySelector('.ktsolo-room .ktsolo-main');
    if(solo)setWave(solo,hasMedia(solo));

    document.querySelectorAll('.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest').forEach(function(el){setWave(el,hasMedia(el));});
    document.querySelectorAll('.ktsecret-room .ktsecret-slot').forEach(function(el){setWave(el,hasMedia(el));});
    document.querySelectorAll('.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest').forEach(function(el){setWave(el,hasMedia(el));});
  }

  var ob=new MutationObserver(function(){apply();});
  try{ob.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style','src']});}catch(e){}
  setTimeout(apply,0);
  setTimeout(apply,80);
  setTimeout(apply,220);
})();
