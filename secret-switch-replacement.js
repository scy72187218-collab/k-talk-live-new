/* K-Talk 비밀방 스위치 교체 보강: 잘 작동하는 다른 방송 스위치 방식 그대로 사용. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktSecretSwitchReplacementInstalled)return;
  window.__ktSecretSwitchReplacementInstalled=true;

  function savePassword(v){
    v=String(v||'').replace(/\D/g,'').slice(0,4);
    try{localStorage.setItem('kt_secret_room_password',v);}catch(e){}
    try{if(window.state)state.liveRoomPassword=v;}catch(e){}
    return v;
  }

  function savedPassword(){
    try{
      var fromState=(window.state&&state.liveRoomPassword)||'';
      if(fromState)return String(fromState).replace(/\D/g,'').slice(0,4);
      return String(localStorage.getItem('kt_secret_room_password')||'').replace(/\D/g,'').slice(0,4);
    }catch(e){return '';}
  }

  function ensureStyle(){
    if(document.getElementById('ktSecretSwitchReplacementStyle'))return;
    var s=document.createElement('style');
    s.id='ktSecretSwitchReplacementStyle';
    s.textContent=''
      +'#creator .room-switch-row{position:relative!important;z-index:40!important;pointer-events:auto!important}'
      +'#creator .room-switch-row .room-switch{position:relative!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'#creator .room-switch-row .room-switch:nth-child(4){z-index:45!important}'
      +'#ktSecretPasswordBox{display:none;margin:5px 0 2px;padding:7px 8px;border:1px solid rgba(255,190,60,.45);border-radius:13px;background:rgba(30,20,5,.52);color:#fff}'
      +'#ktSecretPasswordBox.on{display:block!important;margin-bottom:58px!important}'
      +'#ktSecretPasswordBox label{display:block;margin-bottom:4px;color:#ffe16b;font-size:11px;font-weight:950}'
      +'#ktSecretPasswordRow{display:flex;gap:7px;align-items:center}'
      +'#ktSecretPassword{flex:1;min-width:0;height:34px;border-radius:11px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.09);color:#fff;font-size:16px;font-weight:900;letter-spacing:7px;text-align:center;outline:none}'
      +'#ktSecretPasswordSave{height:34px;padding:0 13px;border:0;border-radius:11px;background:linear-gradient(135deg,#ffb62f,#ff7a2f);color:#17100a;font-weight:950}'
      +'#ktSecretPasswordHelp{margin-top:3px;color:#ddd;font-size:9px}'
      +'#ktSecretPasswordError{display:none;margin-top:4px;color:#ff7c92;font-size:10px;font-weight:900}';
    document.head.appendChild(s);
  }

  function ensurePasswordBox(){
    ensureStyle();
    var card=document.querySelector('#creator .prep-card')||document.querySelector('.prep-card');
    if(!card)return null;
    var box=document.getElementById('ktSecretPasswordBox');
    if(!box){
      box=document.createElement('div');
      box.id='ktSecretPasswordBox';
      box.innerHTML='<label>🔒 비밀방 비밀번호</label><div id="ktSecretPasswordRow"><input id="ktSecretPassword" type="password" inputmode="numeric" maxlength="4" placeholder="4자리" aria-label="비밀방 비밀번호 4자리"><button id="ktSecretPasswordSave" type="button">저장</button></div><div id="ktSecretPasswordHelp">비밀방에 들어올 때 사용할 숫자 4자리를 입력하세요.</div><div id="ktSecretPasswordError">비밀번호 4자리를 입력해 주세요.</div>';
      var start=card.querySelector('.prep-start');
      card.insertBefore(box,start||null);
      var input=box.querySelector('#ktSecretPassword');
      var old=savedPassword();
      if(old)input.value=old;
      input.addEventListener('input',function(){
        this.value=this.value.replace(/\D/g,'').slice(0,4);
        var er=document.getElementById('ktSecretPasswordError');if(er)er.style.display='none';
      });
      var save=box.querySelector('#ktSecretPasswordSave');
      save.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();
        var v=savePassword(input.value);
        var er=document.getElementById('ktSecretPasswordError');
        if(er)er.style.display=v.length===4?'none':'block';
        if(v.length===4){
          save.textContent='저장됨';
          setTimeout(function(){if(save)save.textContent='저장';},800);
        }
      });
    }
    return box;
  }

  function activateSecret(btn){
    try{
      if(window.state){state.liveRoomType='password';state.liveRoomName='비밀방';state.liveRoomMax=7;}
    }catch(e){}
    document.querySelectorAll('#creator .room-switch-row .room-switch,.room-switch-row .room-switch').forEach(function(b){b.classList.remove('on');});
    if(btn)btn.classList.add('on');
    var title=document.getElementById('liveTitle');
    if(title){title.value='비밀방';title.dataset.autoRoom='1';}

    /* 다른 방과 같은 선택 함수도 같이 호출하되, 실패해도 아래 직접 연결은 유지한다. */
    try{if(typeof window.selectPrepRoom==='function')window.selectPrepRoom(btn,'password','비밀방',7);}catch(e){}

    var box=ensurePasswordBox();
    if(box){
      box.classList.add('on');
      var input=document.getElementById('ktSecretPassword');
      var old=savedPassword();
      if(input&&old&&!input.value)input.value=old;
    }
  }

  function hideSecretBox(){
    var box=document.getElementById('ktSecretPasswordBox');
    if(box)box.classList.remove('on');
  }

  function roomButtonFromEvent(e){
    try{return e.target&&e.target.closest?e.target.closest('#creator .room-switch-row .room-switch,.room-switch-row .room-switch'):null;}catch(err){return null;}
  }

  /* inline onclick이 막히는 기기에서도 손을 떼는 순간 직접 선택되게 한다. */
  document.addEventListener('pointerup',function(e){
    var btn=roomButtonFromEvent(e);if(!btn)return;
    var list=Array.prototype.slice.call((btn.parentElement||document).querySelectorAll('.room-switch'));
    var idx=list.indexOf(btn);
    if(idx===3)activateSecret(btn);else hideSecretBox();
  },true);

  document.addEventListener('click',function(e){
    var btn=roomButtonFromEvent(e);if(!btn)return;
    var list=Array.prototype.slice.call((btn.parentElement||document).querySelectorAll('.room-switch'));
    var idx=list.indexOf(btn);
    if(idx===3)activateSecret(btn);else hideSecretBox();
  },true);

  ensureStyle();
})();
