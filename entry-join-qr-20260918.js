/* K-Talk 첫 화면 가입 아이콘 + 현재 사이트 QR.
   방송/카메라/채팅/방 기능은 변경하지 않음. */
(function(){
  if(window.__ktEntryJoinQr20260918)return;
  window.__ktEntryJoinQr20260918=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function siteUrl(){
    try{
      return location.origin+location.pathname;
    }catch(e){
      return location.href.split('#')[0].split('?')[0];
    }
  }

  function qrTargetUrl(){
    var u=siteUrl();
    return u+(u.indexOf('?')>-1?'&':'?')+'from=qr';
  }

  function showQrEntryHint(){
    try{
      var p=new URLSearchParams(location.search||'');
      if(p.get('from')!=='qr')return;
    }catch(e){return;}
    if(document.getElementById('ktQrEntryHint'))return;
    var d=document.createElement('div');
    d.id='ktQrEntryHint';
    d.className='kt-qr-entry-hint';
    d.textContent='QR로 처음 접속해 영상이 멈춰 있으면 화면을 한 번 눌러 주세요.';
    document.body.appendChild(d);
    function hide(){try{if(d&&d.parentNode)d.remove();}catch(e){}}
    setTimeout(hide,9000);
    document.addEventListener('pointerdown',hide,{once:true,capture:true});
  }

  function ensureStyle(){
    if(document.getElementById('ktEntryJoinQrStyle'))return;
    var s=document.createElement('style');
    s.id='ktEntryJoinQrStyle';
    s.textContent=''
      +'.kt-entry-actions{position:fixed;right:10px;top:58px;z-index:9998;display:flex;flex-direction:column;gap:7px;pointer-events:auto}'
      +'.kt-entry-actions button{min-width:64px;height:38px;padding:0 10px;border-radius:999px;border:1px solid rgba(255,255,255,.25);background:rgba(8,8,14,.88);color:#fff;font-size:11px;font-weight:950;box-shadow:0 3px 14px rgba(0,0,0,.45);backdrop-filter:blur(7px);touch-action:manipulation}'
      +'.kt-entry-actions .join{border-color:#ff5fcf;background:linear-gradient(135deg,rgba(119,20,130,.94),rgba(219,35,137,.94))}'
      +'.kt-entry-actions .qr{border-color:#5ba9ff}'
      +'.kt-join-card{padding:3px 0}.kt-join-card .join-title{font-size:20px;font-weight:950;color:#fff;margin-bottom:10px}.kt-join-card .join-note{font-size:11px;line-height:1.5;color:#cfcfd8;margin-bottom:10px}'
      +'.kt-join-card input{width:100%;height:46px;border-radius:13px;border:1px solid #ffffff2d;background:#0f0f16;color:#fff;padding:0 13px;font-size:15px;outline:none}'
      +'.kt-join-card .join-go{width:100%;height:46px;margin-top:9px;border:0;border-radius:13px;background:linear-gradient(135deg,#ff2f8d,#8f49ff);color:#fff;font-size:15px;font-weight:950}'
      +'.kt-qr-card{text-align:center;color:#fff}.kt-qr-card img{display:block;width:240px;height:240px;max-width:82vw;margin:8px auto 12px;background:#fff;padding:8px;border-radius:16px}.kt-qr-card .url{padding:9px 10px;border-radius:11px;background:#0c0c12;border:1px solid #ffffff1d;font-size:10px;word-break:break-all;color:#d9eaff}.kt-qr-card .copy{width:100%;height:42px;margin-top:9px;border:0;border-radius:12px;background:#2d7cf2;color:#fff;font-weight:950}'
      +'.kt-qr-entry-hint{position:fixed;left:50%;top:10px;transform:translateX(-50%);z-index:100000;max-width:88vw;padding:6px 10px;border-radius:999px;background:rgba(0,0,0,.78);border:1px solid rgba(255,255,255,.28);color:#fff;font-size:10px;font-weight:900;line-height:1.3;text-align:center;box-shadow:0 3px 12px rgba(0,0,0,.35);pointer-events:none}'
      +'body:not(.kt-video-mode):not(.kt-home) .kt-entry-actions{display:none}';
    document.head.appendChild(s);
  }

  function joined(){
    try{return localStorage.getItem('ktalk_joined')==='1';}catch(e){return false;}
  }

  function nickname(){
    try{return String(localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_profile_name')||'').trim();}catch(e){return '';}
  }

  window.ktOpenEntryJoin=function(){
    ensureStyle();
    if(joined()){
      var n=nickname()||'K-Talk 회원';
      var html='<div class="kt-join-card"><div class="join-title">👤 가입 완료</div><div class="join-note"><b>'+esc(n)+'</b>님으로 가입되어 있습니다.</div><button class="join-go" type="button" onclick="closeSheet()">확인</button></div>';
      if(typeof window.showSheet==='function')window.showSheet('👤 K-Talk 가입',html);
      return false;
    }
    var html='<div class="kt-join-card">'
      +'<div class="join-title">👤 K-Talk 간편가입</div>'
      +'<div class="join-note">사용할 닉네임을 입력하고 가입 버튼을 누르세요.</div>'
      +'<input id="ktEntryJoinName" maxlength="20" autocomplete="nickname" placeholder="닉네임 입력">'
      +'<button class="join-go" type="button" onclick="ktCompleteEntryJoin()">가입하기</button>'
      +'</div>';
    if(typeof window.showSheet==='function')window.showSheet('👤 K-Talk 가입',html);
    return false;
  };

  window.ktCompleteEntryJoin=function(){
    var el=document.getElementById('ktEntryJoinName');
    var name=String(el?el.value:'').trim();
    if(name.length<2){try{alert('닉네임을 2글자 이상 입력해 주세요.');}catch(e){}return false;}
    var id='';
    try{id=localStorage.getItem('ktalk_member_id')||'';}catch(e){}
    if(!id)id='member_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,9);
    try{
      localStorage.setItem('ktalk_member_id',id);
      localStorage.setItem('ktalk_joined','1');
      localStorage.setItem('ktalk_nickname',name);
      localStorage.setItem('ktalk_profile_name',name);
      if(!localStorage.getItem('ktalk_profile_v1:local')){
        localStorage.setItem('ktalk_profile_v1:local',JSON.stringify({name:name,bio:'',photo:'',followers:0,likes:0,link:''}));
      }
    }catch(e){}
    try{if(window.state){state.joined=true;state.nickname=name;state.userName=name;}}catch(e){}
    try{if(typeof window.ktSpeak==='function')window.ktSpeak(name+'님, K-Talk 가입을 환영합니다.');}catch(e){}
    if(typeof window.showSheet==='function'){
      window.showSheet('✅ 가입 완료','<div class="kt-join-card"><div class="join-title">가입이 완료되었습니다.</div><div class="join-note"><b>'+esc(name)+'</b>님, K-Talk을 이용하실 수 있습니다.</div><button class="join-go" type="button" onclick="closeSheet()">시작하기</button></div>');
    }
    return false;
  };

  window.ktOpenSiteQr=function(){
    ensureStyle();
    var url=siteUrl();
    var target=qrTargetUrl();
    var qr='https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data='+encodeURIComponent(target);
    var html='<div class="kt-qr-card">'
      +'<b style="font-size:18px">📱 K-Talk 접속 QR</b>'
      +'<img src="'+qr+'" alt="K-Talk 사이트 QR 코드">'
      +'<div class="url">'+esc(url)+'</div>'
      +'<button class="copy" type="button" onclick="ktCopySiteAddress()">주소 복사</button>'
      +'</div>';
    if(typeof window.showSheet==='function')window.showSheet('▣ QR 코드',html);
    return false;
  };

  window.ktCopySiteAddress=function(){
    var url=siteUrl();
    if(navigator.clipboard&&navigator.clipboard.writeText){
      navigator.clipboard.writeText(url).then(function(){try{alert('주소를 복사했습니다.');}catch(e){};}).catch(function(){window.prompt('주소를 길게 눌러 복사하세요.',url);});
    }else{
      window.prompt('주소를 길게 눌러 복사하세요.',url);
    }
    return false;
  };

  function installEntryButtons(){
    ensureStyle();
    var show=!!document.querySelector('.video-home,.kt-dashboard');
    var old=document.getElementById('ktEntryActions');
    if(!show){if(old)old.remove();return;}
    if(old)return;
    var box=document.createElement('div');
    box.id='ktEntryActions';
    box.className='kt-entry-actions';
    box.innerHTML='<button class="join" type="button" onclick="ktOpenEntryJoin()">👤 가입</button>'
      +'<button class="qr" type="button" onclick="ktOpenSiteQr()">▣ QR</button>';
    document.body.appendChild(box);
  }

  showQrEntryHint();

  var screen=document.getElementById('screen');
  if(screen){
    new MutationObserver(function(){setTimeout(installEntryButtons,0);}).observe(screen,{childList:true,subtree:true});
  }
  window.addEventListener('pageshow',installEntryButtons);
  window.addEventListener('focus',installEntryButtons);
  [0,120,400,1000,2200].forEach(function(ms){setTimeout(installEntryButtons,ms);});
})();