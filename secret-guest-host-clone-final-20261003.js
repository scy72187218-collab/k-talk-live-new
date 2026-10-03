/* K-Talk secret guest FINAL
   Secret guest view uses the same room shell as secret host.
   Bottom row is guest-only: input, send, join, rose, gift, share.
   Old 9-room/legacy guest UI is removed only inside secret remote view. */
(function(){
  if(window.__ktSecretGuestHostCloneFinal20261003)return;
  window.__ktSecretGuestHostCloneFinal20261003=true;

  function esc(v){return String(v==null?'':v).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  function roomInfo(){
    try{return window.__ktLastLiveRoom||{};}catch(e){return {};}
  }

  function isSecretRemote(){
    try{
      if(!document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var r=roomInfo();
      var t=[r.room_type,r.room_name,r.title].filter(Boolean).join(' ').toLowerCase();
      return /비밀|secret|password/.test(t);
    }catch(e){return false;}
  }

  function getGuestStreams(){
    var lists=[];
    try{if(Array.isArray(window.ktSecretGuestStreams))lists=window.ktSecretGuestStreams;}catch(e){}
    try{if(!lists.length&&window.state&&Array.isArray(state.secretGuestStreams))lists=state.secretGuestStreams;}catch(e){}
    try{if(!lists.length&&window.state&&Array.isArray(state.guestStreams))lists=state.guestStreams;}catch(e){}
    try{if(!lists.length&&Array.isArray(window.ktGuestStreams))lists=window.ktGuestStreams;}catch(e){}
    return lists||[];
  }

  function itemStream(item){
    if(!item)return null;
    return item.stream||item.mediaStream||item.srcObject||item;
  }

  function makeButton(cls,icon,fn,aria){
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-sg-bottom-btn '+cls;
    b.innerHTML='<i>'+icon+'</i>';
    if(aria)b.setAttribute('aria-label',aria);
    b.onclick=fn;
    return b;
  }

  function render(){
    if(!isSecretRemote())return;
    var root=document.querySelector('#screen .kt-remote-live');
    if(!root)return;
    if(root.dataset.ktSecretGuestHostCloneFinal==='1')return;

    var r=roomInfo();
    var hostName=esc(r.host_name||'호스트');

    root.className='kt-remote-live kt-secret-guest-host-clone-final';
    root.dataset.ktSecretGuestHostCloneFinal='1';
    root.innerHTML=
      '<section class="ktsecret-room kt-sg-room">'+
        '<div class="ktsecret-head">'+
          '<div class="ktsecret-left"><button class="ktsecret-back kt-sg-back" type="button">‹</button><div class="ktsecret-title"><i>●</i> 비밀방</div></div>'+
          '<button class="ktsecret-att" type="button"><img src="attendance-wing.svg" alt=""><span>출석체크</span><img src="attendance-wing.svg" alt=""></button>'+
          '<div class="ktsecret-brand">K-Talk LIVE</div>'+
        '</div>'+
        '<div class="ktsecret-airrow"><span class="on">● ON AIR</span><span class="kt-sg-clock">00:00:00</span></div>'+
        '<div class="ktsecret-led"><div class="ktsecret-led-track"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>'+
        '<div class="ktsecret-main kt-sg-main">'+
          '<div class="ktsecret-six-grid kt-sg-grid">'+
            '<div class="ktsecret-slot host"><video id="ktRemoteLiveVideo" autoplay playsinline muted></video><span class="ktsecret-slot-label">'+hostName+'</span></div>'+
            '<div class="ktsecret-slot kt-sg-guest" data-i="0"><div class="ktsecret-guest-wait"><b>+</b><span>게스트</span></div></div>'+
            '<div class="ktsecret-slot kt-sg-guest" data-i="1"><div class="ktsecret-guest-wait"><b>+</b><span>게스트</span></div></div>'+
            '<div class="ktsecret-slot kt-sg-guest" data-i="2"><div class="ktsecret-guest-wait"><b>+</b><span>게스트</span></div></div>'+
            '<div class="ktsecret-slot kt-sg-guest" data-i="3"><div class="ktsecret-guest-wait"><b>+</b><span>게스트</span></div></div>'+
          '</div>'+
        '</div>'+
        '<div class="kt-sg-earn-wrap"><div class="kt-sg-earn">🔒 내 수익 · 본인만 표시 <b>0원</b><small>🌹 0송이　 일반회원 · 35%</small><small>구독자회원 40% · 소속사 65%</small></div></div>'+
        '<div class="kt-sg-bottom"></div>'+
      '</section>';

    var back=root.querySelector('.kt-sg-back');
    if(back)back.onclick=function(){try{if(typeof window.ktLeaveRemoteLive==='function')window.ktLeaveRemoteLive();}catch(e){}};

    var attend=root.querySelector('.ktsecret-att');
    if(attend)attend.onclick=function(){try{if(typeof window.openAttendanceBenefits==='function')window.openAttendanceBenefits();}catch(e){}};

    var bar=root.querySelector('.kt-sg-bottom');
    var input=document.createElement('input');
    input.type='text';
    input.placeholder='입력하세요...';
    input.maxLength=100;
    input.autocomplete='off';
    input.onkeydown=function(ev){if(ev.key==='Enter'){ev.preventDefault();try{if(typeof window.ktRemoteSendChat==='function')window.ktRemoteSendChat();}catch(e){}}};
    bar.appendChild(input);
    bar.appendChild(makeButton('send','➤',function(){try{if(typeof window.ktRemoteSendChat==='function')window.ktRemoteSendChat();}catch(e){}},'채팅 보내기'));
    var join=makeButton('join','👥',function(){try{if(typeof window.ktRequestGuestJoin==='function')window.ktRequestGuestJoin();}catch(e){}},'방송 참여 신청');
    join.id='ktRemoteGuestRequest';
    bar.appendChild(join);
    bar.appendChild(makeButton('rose','🌹',function(){try{if(typeof window.ktRemoteOpenGifts==='function')window.ktRemoteOpenGifts();else if(typeof window.openGifts==='function')window.openGifts();}catch(e){}},'장미'));
    bar.appendChild(makeButton('gift','🎁',function(){try{if(typeof window.ktRemoteOpenGifts==='function')window.ktRemoteOpenGifts();else if(typeof window.openGifts==='function')window.openGifts();}catch(e){}},'선물'));
    bar.appendChild(makeButton('share','↗',function(){try{if(typeof window.shareApp==='function')window.shareApp();else if(navigator.share)navigator.share({title:'K-Talk LIVE',url:location.href}).catch(function(){});}catch(e){}},'공유'));

    syncVideo();
    syncGuests();
    updateClock();
  }

  function syncVideo(){
    if(!isSecretRemote())return;
    var v=document.getElementById('ktRemoteLiveVideo');
    if(!v)return;
    var s=null;
    try{s=window.__ktRemoteHostStream||null;}catch(e){}
    if(s&&v.srcObject!==s){
      v.srcObject=s;
      v.muted=true;v.defaultMuted=true;
      var p=v.play();if(p&&p.catch)p.catch(function(){});
    }
  }

  function syncGuests(){
    if(!isSecretRemote())return;
    var root=document.querySelector('#screen .kt-remote-live.kt-secret-guest-host-clone-final');
    if(!root)return;
    var list=getGuestStreams();
    root.querySelectorAll('.kt-sg-guest').forEach(function(cell,i){
      var item=list[i],s=itemStream(item);
      var old=cell.querySelector('video');
      if(s&&s.getTracks){
        if(!old){
          cell.innerHTML='';
          old=document.createElement('video');
          old.autoplay=true;old.playsInline=true;old.muted=true;
          cell.appendChild(old);
          var lab=document.createElement('span');
          lab.className='ktsecret-slot-label';
          lab.textContent=(item&&item.name)||('게스트 '+(i+1));
          cell.appendChild(lab);
        }
        if(old.srcObject!==s){old.srcObject=s;var p=old.play();if(p&&p.catch)p.catch(function(){});}
      }else if(old){
        cell.innerHTML='<div class="ktsecret-guest-wait"><b>+</b><span>게스트</span></div>';
      }
    });
  }

  function updateClock(){
    if(!isSecretRemote())return;
    var el=document.querySelector('#screen .kt-secret-guest-host-clone-final .kt-sg-clock');
    if(!el)return;
    var d=new Date(),h=String(d.getHours()).padStart(2,'0'),m=String(d.getMinutes()).padStart(2,'0'),s=String(d.getSeconds()).padStart(2,'0');
    el.textContent=h+':'+m+':'+s;
  }

  function ensureStyle(){
    if(document.getElementById('ktSecretGuestHostCloneFinalStyle20261003'))return;
    var s=document.createElement('style');
    s.id='ktSecretGuestHostCloneFinalStyle20261003';
    s.textContent=
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final{position:fixed!important;inset:0!important;background:#000!important;overflow:hidden!important;z-index:999!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-room{height:100dvh!important;padding-bottom:calc(68px + env(safe-area-inset-bottom))!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-main{flex:0 0 43dvh!important;min-height:240px!important;max-height:470px!important;margin-top:-8px!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-slot video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;background:#111!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-slot.host video{transform:none!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-earn-wrap{position:fixed!important;right:8px!important;bottom:calc(74px + env(safe-area-inset-bottom))!important;z-index:2147483000!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-earn{width:132px!important;padding:7px 8px!important;border:1px solid #d2a936!important;border-radius:12px!important;background:rgba(16,16,18,.94)!important;color:#fff!important;font-size:8px!important;line-height:1.25!important;text-align:center!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-earn b{color:#ffe071!important;font-size:10px!important}.kt-sg-earn small{display:block!important;color:#ddd!important;font-size:7px!important;margin-top:2px!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-bottom{position:fixed!important;left:8px!important;right:8px!important;bottom:calc(8px + env(safe-area-inset-bottom))!important;height:52px!important;display:flex!important;align-items:center!important;gap:6px!important;z-index:2147483001!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-bottom>input{flex:1 1 auto!important;min-width:0!important;height:46px!important;border-radius:24px!important;border:1px solid #42434c!important;background:#1b1b20!important;color:#fff!important;padding:0 16px!important;font-size:15px!important;font-weight:800!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-bottom>.kt-sg-bottom-btn{width:46px!important;height:46px!important;min-width:46px!important;flex:0 0 46px!important;border-radius:50%!important;border:1px solid #3c3d45!important;background:#17171d!important;color:#fff!important;padding:0!important;display:grid!important;place-items:center!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-bottom>.kt-sg-bottom-btn i{font-style:normal!important;font-size:22px!important;line-height:1!important}';
    document.head.appendChild(s);
  }

  function sweep(){
    ensureStyle();
    if(!isSecretRemote())return;
    var root=document.querySelector('#screen .kt-remote-live');
    if(!root)return;
    if(root.dataset.ktSecretGuestHostCloneFinal!=='1'){render();return;}
    /* remove anything injected after the final clone */
    Array.from(root.children).forEach(function(el){
      if(!el.classList.contains('kt-sg-room'))try{el.remove();}catch(e){}
    });
    syncVideo();
    syncGuests();
    updateClock();
  }

  ensureStyle();
  sweep();
  [60,180,400,900,1600].forEach(function(ms){setTimeout(sweep,ms);});
  window.addEventListener('kt-remote-host-selected',function(){[50,160,400].forEach(function(ms){setTimeout(sweep,ms);});});
  window.addEventListener('kt-livekit-state',function(){setTimeout(sweep,50);});
  window.addEventListener('kt-guest-approval-received',function(){[20,80,220].forEach(function(ms){setTimeout(sweep,ms);});});
  setInterval(sweep,700);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSecretGuestHostCloneFinalTimer);
      window.__ktSecretGuestHostCloneFinalTimer=setTimeout(sweep,35);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();