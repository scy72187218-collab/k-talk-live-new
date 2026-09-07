/* K-Talk 비밀방 전용 비밀번호 기능. 다른 방 UI/동작은 건드리지 않음. */
(function(){
  if(window.__ktSecretPasswordInstalled)return;
  window.__ktSecretPasswordInstalled=true;

  function isSecretRoom(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      var title=(document.getElementById('liveTitle')||{}).value||'';
      return t==='password'||String(n).indexOf('비밀')>-1||String(title).indexOf('비밀')>-1;
    }catch(e){return false;}
  }

  function getSaved(){
    try{return String(localStorage.getItem('kt_secret_room_password')||'').replace(/\D/g,'').slice(0,4);}catch(e){return '';}
  }

  function savePassword(v){
    v=String(v||'').replace(/\D/g,'').slice(0,4);
    try{localStorage.setItem('kt_secret_room_password',v);}catch(e){}
    if(window.state)state.liveRoomPassword=v;
    return v;
  }

  function ensureStyle(){
    if(document.getElementById('ktSecretPasswordStyle'))return;
    var s=document.createElement('style');
    s.id='ktSecretPasswordStyle';
    s.textContent='\
      #ktSecretPasswordBox{display:none;margin:8px 0 2px;padding:10px 11px;border:1px solid rgba(255,190,60,.45);border-radius:14px;background:rgba(30,20,5,.52);color:#fff} \
      #ktSecretPasswordBox.on{display:block} \
      #ktSecretPasswordBox label{display:block;margin-bottom:6px;color:#ffe16b;font-size:12px;font-weight:950} \
      #ktSecretPasswordRow{display:flex;gap:7px;align-items:center} \
      #ktSecretPassword{flex:1;min-width:0;height:40px;border-radius:11px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.09);color:#fff;font-size:18px;font-weight:900;letter-spacing:7px;text-align:center;outline:none} \
      #ktSecretPasswordSave{height:40px;padding:0 13px;border:0;border-radius:11px;background:linear-gradient(135deg,#ffb62f,#ff7a2f);color:#17100a;font-weight:950} \
      #ktSecretPasswordHelp{margin-top:5px;color:#ddd;font-size:10px} \
      #ktSecretPasswordError{display:none;margin-top:5px;color:#ff7c92;font-size:11px;font-weight:900} \
      .kt-secret-live-pill{position:absolute;z-index:12;right:12px;top:104px;padding:6px 10px;border-radius:999px;border:1px solid #ffbf42;background:rgba(18,12,5,.78);color:#ffe16b;font-size:10px;font-weight:950;box-shadow:0 0 8px rgba(255,190,60,.35)}';
    document.head.appendChild(s);
  }

  function ensurePasswordBox(){
    ensureStyle();
    var card=document.querySelector('.prep-card');
    if(!card)return null;
    var box=document.getElementById('ktSecretPasswordBox');
    if(!box){
      box=document.createElement('div');
      box.id='ktSecretPasswordBox';
      box.innerHTML='<label>🔒 비밀방 비밀번호</label><div id="ktSecretPasswordRow"><input id="ktSecretPassword" type="password" inputmode="numeric" maxlength="4" placeholder="4자리" aria-label="비밀방 비밀번호 4자리"><button id="ktSecretPasswordSave" type="button">저장</button></div><div id="ktSecretPasswordHelp">비밀방에 들어올 때 사용할 숫자 4자리를 입력하세요.</div><div id="ktSecretPasswordError">비밀번호 4자리를 입력해 주세요.</div>';
      var start=card.querySelector('.prep-start');
      card.insertBefore(box,start||null);
      var input=box.querySelector('#ktSecretPassword');
      var saved=(window.state&&state.liveRoomPassword)||getSaved();
      if(saved)input.value=saved;
      input.addEventListener('input',function(){this.value=this.value.replace(/\D/g,'').slice(0,4);var er=document.getElementById('ktSecretPasswordError');if(er)er.style.display='none';});
      box.querySelector('#ktSecretPasswordSave').addEventListener('click',function(){
        var v=savePassword(input.value);
        var er=document.getElementById('ktSecretPasswordError');
        if(er)er.style.display=v.length===4?'none':'block';
        if(v.length===4){ this.textContent='저장됨'; setTimeout(function(){var b=document.getElementById('ktSecretPasswordSave');if(b)b.textContent='저장';},900); }
      });
    }
    box.classList.toggle('on',isSecretRoom());
    return box;
  }

  function updatePrep(){
    var box=ensurePasswordBox();
    if(!box)return;
    box.classList.toggle('on',isSecretRoom());
    if(isSecretRoom()){
      var input=document.getElementById('ktSecretPassword');
      var saved=(window.state&&state.liveRoomPassword)||getSaved();
      if(input&&saved&&!input.value)input.value=saved;
    }
  }

  var oldSelect=window.selectPrepRoom;
  if(typeof oldSelect==='function'){
    window.selectPrepRoom=function(el,type,name,max){
      var r=oldSelect.apply(this,arguments);
      if(window.state&&type==='password'){
        state.liveRoomType='password';state.liveRoomName='비밀방';state.liveRoomMax=max||7;
      }
      setTimeout(updatePrep,0);
      return r;
    };
  }

  var oldOpenRoomPrep=window.openRoomPrep;
  if(typeof oldOpenRoomPrep==='function'){
    window.openRoomPrep=function(name,max){
      var r=oldOpenRoomPrep.apply(this,arguments);
      if(String(name||'').indexOf('비밀')>-1&&window.state){
        state.liveRoomType='password';state.liveRoomName='비밀방';state.liveRoomMax=max||7;
      }
      setTimeout(updatePrep,30);
      return r;
    };
  }

  var oldStart=window.startBroadcast;
  if(typeof oldStart==='function'){
    window.startBroadcast=function(){
      if(isSecretRoom()){
        updatePrep();
        var input=document.getElementById('ktSecretPassword');
        var v=savePassword(input?input.value:((window.state&&state.liveRoomPassword)||getSaved()));
        if(v.length!==4){
          var er=document.getElementById('ktSecretPasswordError');if(er)er.style.display='block';
          if(input){input.focus();input.select();}
          return;
        }
      }
      return oldStart.apply(this,arguments);
    };
  }

  function addLivePill(){
    if(!isSecretRoom())return;
    if(document.querySelector('.kt-secret-live-pill'))return;
    var root=document.getElementById('screen');
    if(!root)return;
    var hasLive=root.querySelector('#ktLiveClock')||root.textContent.indexOf('ON AIR')>-1;
    if(!hasLive)return;
    var pill=document.createElement('button');
    pill.type='button';pill.className='kt-secret-live-pill';pill.textContent='🔒 비밀번호';
    pill.onclick=function(){
      var old=(window.state&&state.liveRoomPassword)||getSaved();
      var v=prompt('비밀방 비밀번호 4자리',old||'');
      if(v===null)return;
      v=savePassword(v);
      if(v.length!==4)alert('숫자 4자리로 입력해 주세요.');
    };
    root.appendChild(pill);
  }

  new MutationObserver(function(){updatePrep();setTimeout(addLivePill,0);}).observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(updatePrep,100);
})();
