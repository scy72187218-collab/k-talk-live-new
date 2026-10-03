/* Fresh secret-room guest screen.
   IMPORTANT: host secret room is locked out from this file.
   This code runs ONLY while html.kt-remote-viewing is active and the selected room is secret/password.
*/
(function(){
  if(window.__ktSecretGuestFresh20261004)return;
  window.__ktSecretGuestFresh20261004=true;

  function info(){try{return window.__ktLastLiveRoom||{};}catch(e){return {};}}
  function isSecretGuest(){
    try{
      if(!document.documentElement.classList.contains('kt-remote-viewing'))return false; // HOST LOCK
      var r=info();
      var t=[r.room_type,r.room_name,r.title].filter(Boolean).join(' ').toLowerCase();
      return /비밀|secret|password/.test(t);
    }catch(e){return false;}
  }
  function esc(v){return String(v==null?'':v).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}

  function callAny(names){
    for(var i=0;i<names.length;i++){
      try{
        var f=window[names[i]];
        if(typeof f==='function'){f();return true;}
      }catch(e){}
    }
    return false;
  }

  function btn(cls,icon,label,fn){
    var b=document.createElement('button');
    b.type='button';b.className='kt-sgf-btn '+cls;
    b.innerHTML='<i>'+icon+'</i><span>'+label+'</span>';
    b.onclick=fn;return b;
  }

  function getGuests(){
    var a=[];
    try{if(Array.isArray(window.ktSecretGuestStreams))a=window.ktSecretGuestStreams;}catch(e){}
    try{if(!a.length&&window.state&&Array.isArray(state.secretGuestStreams))a=state.secretGuestStreams;}catch(e){}
    try{if(!a.length&&window.state&&Array.isArray(state.guestStreams))a=state.guestStreams;}catch(e){}
    try{if(!a.length&&Array.isArray(window.ktGuestStreams))a=window.ktGuestStreams;}catch(e){}
    return a||[];
  }
  function streamOf(x){return x&&(x.stream||x.mediaStream||x.srcObject||x);}

  function style(){
    if(document.getElementById('ktSecretGuestFreshStyle20261004'))return;
    var s=document.createElement('style');
    s.id='ktSecretGuestFreshStyle20261004';
    s.textContent=
      '#screen .kt-sgf{position:fixed!important;inset:0!important;z-index:2147482000!important;background:#000!important;color:#fff!important;overflow:hidden!important;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif!important}'+
      '#screen .kt-sgf *{box-sizing:border-box!important}'+
      '#screen .kt-sgf-room{height:100dvh!important;display:flex!important;flex-direction:column!important;gap:4px!important;padding:4px 7px calc(66px + env(safe-area-inset-bottom))!important;background:#000!important}'+
      '#screen .kt-sgf-head{height:58px!important;flex:0 0 58px!important;border-radius:16px!important;background:linear-gradient(180deg,#17171a,#0d0d10)!important;display:grid!important;grid-template-columns:1fr auto 1fr!important;align-items:center!important;padding:5px 10px!important}'+
      '#screen .kt-sgf-left{display:flex!important;align-items:center!important;gap:7px!important;min-width:0!important}'+
      '#screen .kt-sgf-back{width:34px!important;height:34px!important;border-radius:50%!important;border:1px solid #ffffff35!important;background:#111!important;color:#fff!important;font-size:28px!important}'+
      '#screen .kt-sgf-title{font-size:20px!important;font-weight:950!important;white-space:nowrap!important}'+
      '#screen .kt-sgf-title b{color:#ff2e67!important}'+
      '#screen .kt-sgf-att{justify-self:center!important;height:29px!important;min-width:88px!important;border-radius:18px!important;border:2px solid #ff2bbd!important;background:#130714!important;color:#ffd52f!important;box-shadow:0 0 8px #ff2bbd!important;font-size:11px!important;font-weight:950!important}'+
      '#screen .kt-sgf-brand{justify-self:end!important;color:#ff3d78!important;font-size:20px!important;font-weight:950!important;white-space:nowrap!important}'+
      '#screen .kt-sgf-air{height:32px!important;flex:0 0 32px!important;display:flex!important;align-items:center!important;gap:8px!important;padding:0 8px!important;font-size:14px!important;font-weight:950!important}.kt-sgf-air .on{color:#ff315f!important}'+
      '#screen .kt-sgf-led{height:52px!important;flex:0 0 52px!important;position:relative!important;border:2px solid #ff28c4!important;border-radius:22px!important;background-color:#120712!important;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px)!important;background-size:13px 13px!important;overflow:hidden!important;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466!important}'+
      '#screen .kt-sgf-led-track{position:absolute!important;inset:0 auto 0 0!important;height:100%!important;display:flex!important;align-items:center!important;white-space:nowrap!important;animation:ktSgfMarquee 12s linear infinite!important;font-size:24px!important;font-weight:950!important;color:#ffd62d!important;text-shadow:0 0 7px #ff8b00!important}.kt-sgf-led-track span{padding-right:80px!important}.kt-sgf-led-track b{color:#ff59c9!important}@keyframes ktSgfMarquee{from{transform:translateX(45%)}to{transform:translateX(-100%)}}'+
      '#screen .kt-sgf-actions{height:42px!important;flex:0 0 42px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important}'+
      '#screen .kt-sgf-actions button{border:0!important;border-radius:11px!important;background:#15151a!important;color:#fff!important;font-size:11px!important;font-weight:950!important;padding:0 4px!important}'+
      '#screen .kt-sgf-main{position:relative!important;flex:1 1 auto!important;min-height:210px!important;border:1px solid rgba(255,196,73,.12)!important;border-radius:10px!important;background:#111!important;overflow:hidden!important}'+
      '#screen .kt-sgf-grid{position:absolute!important;inset:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:3px!important;padding:3px!important}'+
      '#screen .kt-sgf-cell{position:relative!important;overflow:hidden!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:8px!important;background:linear-gradient(145deg,#15151a,#09090c)!important;display:flex!important;align-items:center!important;justify-content:center!important}'+
      '#screen .kt-sgf-cell.host{border-color:rgba(255,208,90,.25)!important}'+
      '#screen .kt-sgf-cell video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;background:#111!important;transform:none!important}'+
      '#screen .kt-sgf-wait{display:flex!important;flex-direction:column!important;align-items:center!important;gap:3px!important;color:#bdbdc7!important;font-size:10px!important;font-weight:850!important}.kt-sgf-wait b{width:30px!important;height:30px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.25)!important;display:grid!important;place-items:center!important;font-size:20px!important;color:#fff!important}'+
      '#screen .kt-sgf-label{position:absolute!important;left:5px!important;bottom:5px!important;z-index:3!important;padding:2px 6px!important;border-radius:999px!important;background:rgba(0,0,0,.62)!important;color:#fff!important;font-size:9px!important;font-weight:900!important}'+
      '#screen .kt-sgf-earn{position:fixed!important;right:8px!important;bottom:calc(69px + env(safe-area-inset-bottom))!important;z-index:2147482999!important;width:128px!important;padding:6px 7px!important;border:1px solid #d2a936!important;border-radius:11px!important;background:rgba(16,16,18,.94)!important;color:#fff!important;font-size:8px!important;line-height:1.2!important;text-align:center!important}.kt-sgf-earn b{color:#ffe071!important;font-size:10px!important}.kt-sgf-earn small{display:block!important;color:#ddd!important;font-size:7px!important;margin-top:2px!important}'+
      '#screen .kt-sgf-bottom{position:fixed!important;left:8px!important;right:8px!important;bottom:calc(8px + env(safe-area-inset-bottom))!important;height:52px!important;display:flex!important;align-items:center!important;gap:6px!important;z-index:2147483000!important}'+
      '#screen .kt-sgf-bottom input{flex:1 1 auto!important;min-width:0!important;height:46px!important;border-radius:24px!important;border:1px solid #42434c!important;background:#1b1b20!important;color:#fff!important;padding:0 16px!important;font-size:15px!important;font-weight:800!important}'+
      '#screen .kt-sgf-btn{width:46px!important;height:46px!important;min-width:46px!important;flex:0 0 46px!important;border-radius:50%!important;border:1px solid #3c3d45!important;background:#17171d!important;color:#fff!important;padding:0!important;display:grid!important;place-items:center!important}.kt-sgf-btn i{font-style:normal!important;font-size:22px!important}.kt-sgf-btn span{display:none!important}'+
      '@media(max-width:390px){#screen .kt-sgf-room{padding-left:4px!important;padding-right:4px!important}.kt-sgf-brand,.kt-sgf-title{font-size:17px!important}.kt-sgf-att{min-width:82px!important;font-size:10px!important}.kt-sgf-actions{height:38px!important;flex-basis:38px!important}.kt-sgf-actions button{font-size:10px!important}.kt-sgf-btn{width:42px!important;height:42px!important;min-width:42px!important;flex-basis:42px!important}.kt-sgf-bottom input{height:42px!important}}';
    document.head.appendChild(s);
  }

  function render(){
    if(!isSecretGuest())return;
    style();
    var screen=document.getElementById('screen');if(!screen)return;
    var r=info(),host=esc(r.host_name||'호스트');
    screen.innerHTML=
      '<section class="kt-sgf"><div class="kt-sgf-room">'+
        '<div class="kt-sgf-head"><div class="kt-sgf-left"><button class="kt-sgf-back" type="button">‹</button><div class="kt-sgf-title"><b>●</b> 비밀방</div></div><button class="kt-sgf-att" type="button">🌹 출석체크</button><div class="kt-sgf-brand">K-Talk LIVE</div></div>'+
        '<div class="kt-sgf-air"><span class="on">● ON AIR</span><span class="kt-sgf-clock">00:00:00</span></div>'+
        '<div class="kt-sgf-led"><div class="kt-sgf-led-track"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>'+
        '<div class="kt-sgf-actions"><button data-a="rank">🔥 일일 랭킹</button><button data-a="mission">🎯 미션</button><button data-a="viewers">시청자 <b id="ktSgfViewers">0</b>명 시청중 🏃</button></div>'+
        '<div class="kt-sgf-actions"><button data-a="flip">↻ 되돌리기</button><button data-a="treasure">🎁 보물상자</button><button data-a="match">⚔ 매치</button></div>'+
        '<div class="kt-sgf-main"><div class="kt-sgf-grid">'+
          '<div class="kt-sgf-cell host"><video id="ktRemoteLiveVideo" autoplay playsinline muted></video><span class="kt-sgf-label">'+host+'</span></div>'+
          '<div class="kt-sgf-cell" data-g="0"><div class="kt-sgf-wait"><b>+</b><span>게스트</span></div></div>'+
          '<div class="kt-sgf-cell" data-g="1"><div class="kt-sgf-wait"><b>+</b><span>게스트</span></div></div>'+
          '<div class="kt-sgf-cell" data-g="2"><div class="kt-sgf-wait"><b>+</b><span>게스트</span></div></div>'+
          '<div class="kt-sgf-cell" data-g="3"><div class="kt-sgf-wait"><b>+</b><span>게스트</span></div></div>'+
        '</div></div>'+
        '<div class="kt-sgf-earn">🔒 내 수익 · 본인만 표시 <b>0원</b><small>🌹 0송이　 일반회원 · 35%</small></div>'+
        '<div class="kt-sgf-bottom"></div>'+
      '</div></section>';

    var q=function(x){return screen.querySelector(x);};
    q('.kt-sgf-back').onclick=function(){try{if(typeof window.ktLeaveRemoteLive==='function')window.ktLeaveRemoteLive();}catch(e){}};
    q('.kt-sgf-att').onclick=function(){callAny(['openAttendanceBenefits']);};
    q('[data-a="rank"]').onclick=function(){callAny(['openDailyRanking','showDailyRanking','ktOpenDailyRanking','openRanking']);};
    q('[data-a="mission"]').onclick=function(){callAny(['openMission','openMissionPanel','ktOpenMission','showMission']);};
    q('[data-a="flip"]').onclick=function(){callAny(['ktBottomCameraFlip','toggleCameraFacing','switchCamera','flipCamera','rotateCamera']);};
    q('[data-a="treasure"]').onclick=function(){callAny(['openTreasureBox','openTreasure','ktOpenTreasureBox','showTreasureBox']);};
    q('[data-a="match"]').onclick=function(){callAny(['openMatch','startMatch','ktOpenMatch','showMatch']);};

    var bottom=q('.kt-sgf-bottom');
    var input=document.createElement('input');input.type='text';input.placeholder='입력하세요...';input.maxLength=100;
    input.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();try{if(typeof window.ktRemoteSendChat==='function')window.ktRemoteSendChat();}catch(x){}}};
    bottom.appendChild(input);
    bottom.appendChild(btn('send','➤','보내기',function(){try{if(typeof window.ktRemoteSendChat==='function')window.ktRemoteSendChat();}catch(e){}}));
    var join=btn('join','👥','게스트',function(){callAny(['ktRequestGuestJoin']);});join.id='ktRemoteGuestRequest';bottom.appendChild(join);
    bottom.appendChild(btn('rose','🌹','장미',function(){callAny(['ktRemoteOpenGifts','openGifts']);}));
    bottom.appendChild(btn('gift','🎁','선물',function(){callAny(['ktRemoteOpenGifts','openGifts']);}));
    bottom.appendChild(btn('share','↗','공유',function(){try{if(typeof window.shareApp==='function')window.shareApp();else if(navigator.share)navigator.share({title:'K-Talk LIVE',url:location.href}).catch(function(){});}catch(e){}}));

    sync();
  }

  function sync(){
    if(!isSecretGuest())return;
    var root=document.querySelector('#screen .kt-sgf');if(!root)return;
    var v=root.querySelector('#ktRemoteLiveVideo'),hs=null;
    try{hs=window.__ktRemoteHostStream||null;}catch(e){}
    if(v&&hs&&v.srcObject!==hs){v.srcObject=hs;v.muted=true;var p=v.play();if(p&&p.catch)p.catch(function(){});}
    var gs=getGuests();
    root.querySelectorAll('[data-g]').forEach(function(cell){
      var i=Number(cell.getAttribute('data-g')||0),it=gs[i],st=streamOf(it),vv=cell.querySelector('video');
      if(st&&st.getTracks){
        if(!vv){cell.innerHTML='';vv=document.createElement('video');vv.autoplay=true;vv.playsInline=true;vv.muted=true;cell.appendChild(vv);var l=document.createElement('span');l.className='kt-sgf-label';l.textContent=(it&&it.name)||('게스트 '+(i+1));cell.appendChild(l);}
        if(vv.srcObject!==st){vv.srcObject=st;var p2=vv.play();if(p2&&p2.catch)p2.catch(function(){});}
      }else if(vv){cell.innerHTML='<div class="kt-sgf-wait"><b>+</b><span>게스트</span></div>';}
    });
    var c=root.querySelector('.kt-sgf-clock');
    if(c){var d=new Date();c.textContent=[d.getHours(),d.getMinutes(),d.getSeconds()].map(function(n){return String(n).padStart(2,'0');}).join(':');}
  }

  function ensure(){
    if(!isSecretGuest())return; // HOST LOCK: do nothing to host room
    var root=document.querySelector('#screen .kt-sgf');
    if(!root){render();return;}
    sync();
  }

  style();
  ensure();
  [60,180,400,900,1600].forEach(function(ms){setTimeout(ensure,ms);});
  window.addEventListener('kt-remote-host-selected',function(){[60,180,420].forEach(function(ms){setTimeout(ensure,ms);});});
  window.addEventListener('kt-livekit-state',function(){setTimeout(sync,50);});
  window.addEventListener('kt-guest-approval-received',function(){[20,80,220].forEach(function(ms){setTimeout(ensure,ms);});});
  setInterval(ensure,800);
})();