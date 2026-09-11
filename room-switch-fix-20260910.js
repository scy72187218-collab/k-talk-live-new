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
