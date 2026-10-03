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

  function callAny(names){
    for(var i=0;i<names.length;i++){
      try{
        var fn=window[names[i]];
        if(typeof fn==='function'){fn();return true;}
      }catch(e){}
    }
    return false;
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
        '<div class="kt-sg-actions kt-sg-actions-1">'+
          '<button type="button" data-act="rank">🔥 일일 랭킹</button>'+
          '<button type="button" data-act="mission">🎯 미션</button>'+
          '<button type="button" class="kt-sg-viewers">시청자 <b id="ktSgViewerCount">0</b>명 시청중 🏃</button>'+
        '</div>'+
        '<div class="kt-sg-actions kt-sg-actions-2">'+
          '<button type="button" data-act="flip">↻ 되돌리기</button>'+
          '<button type="button" data-act="treasure">🎁 보물상자</button>'+
          '<button type="button" data-act="match">⚔ 매치</button>'+
        '</div>'+
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

    var actRank=root.querySelector('[data-act="rank"]');
    if(actRank)actRank.onclick=function(){callAny(['openDailyRanking','showDailyRanking','ktOpenDailyRanking','openRanking']);};
    var actMission=root.querySelector('[data-act="mission"]');
    if(actMission)actMission.onclick=function(){callAny(['openMission','openMissionPanel','ktOpenMission','showMission']);};
    var actFlip=root.querySelector('[data-act="flip"]');
    if(actFlip)actFlip.onclick=function(){callAny(['ktBottomCameraFlip','toggleCameraFacing','switchCamera','flipCamera','rotateCamera']);};
    var actTreasure=root.querySelector('[data-act="treasure"]');
    if(actTreasure)actTreasure.onclick=function(){callAny(['openTreasureBox','openTreasure','ktOpenTreasureBox','showTreasureBox']);};
    var actMatch=root.querySelector('[data-act="match"]');
    if(actMatch)actMatch.onclick=function(){callAny(['openMatch','startMatch','ktOpenMatch','showMatch']);};

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
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-room{width:100%!important;height:100dvh!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;background:#000!important;color:#fff!important;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif!important;padding:4px 7px calc(5px + env(safe-area-inset-bottom))!important;gap:4px!important;box-sizing:border-box!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-head{flex:0 0 58px!important;border-radius:16px!important;background:linear-gradient(180deg,#17171a,#0d0d10)!important;display:grid!important;grid-template-columns:1fr auto 1fr!important;align-items:center!important;padding:5px 10px!important;box-sizing:border-box!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-left{display:flex!important;align-items:center!important;gap:7px!important;min-width:0!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-back{width:34px!important;height:34px!important;border-radius:50%!important;border:1px solid #ffffff35!important;background:#111!important;color:#fff!important;font-size:28px!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-title{font-size:20px!important;font-weight:950!important;white-space:nowrap!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-title i{font-style:normal!important;color:#ff2e67!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-brand{justify-self:end!important;color:#ff3d78!important;font-size:20px!important;font-weight:950!important;white-space:nowrap!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-att{justify-self:center!important;height:29px!important;min-width:88px!important;padding:0 3px!important;border-radius:18px!important;border:2px solid #ff2bbd!important;background-color:#130714!important;background-image:radial-gradient(circle,#ff35ce 1.4px,transparent 2px)!important;background-size:8px 8px!important;color:#ffd52f!important;font-size:11px!important;font-weight:950!important;box-shadow:0 0 8px #ff2bbd!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:1px!important;white-space:nowrap!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-att img{width:14px!important;height:14px!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-airrow{flex:0 0 32px!important;display:flex!important;align-items:center!important;gap:8px!important;padding:0 8px!important;font-size:14px!important;font-weight:950!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-airrow .on{color:#ff315f!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-led{flex:0 0 52px!important;position:relative!important;border:2px solid #ff28c4!important;border-radius:22px!important;background-color:#120712!important;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px)!important;background-size:13px 13px!important;overflow:hidden!important;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-led-track{position:absolute!important;left:0!important;top:0!important;height:100%!important;display:flex!important;align-items:center!important;white-space:nowrap!important;animation:ktsecretMarquee 12s linear infinite!important;font-size:24px!important;font-weight:950!important;color:#ffd62d!important;text-shadow:0 0 7px #ff8b00!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-led-track span{display:inline-block!important;padding-right:80px!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-led-track b{color:#ff59c9!important}'+
      '@keyframes ktsecretMarquee{from{transform:translateX(45%)}to{transform:translateX(-100%)}}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-main{position:relative!important;flex:0 0 43dvh!important;min-height:240px!important;max-height:470px!important;margin-top:-8px!important;overflow:hidden!important;border-radius:10px!important;background:#111!important;border:1px solid rgba(255,196,73,.12)!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-six-grid{position:absolute!important;inset:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:3px!important;padding:3px!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-slot{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:8px!important;background:linear-gradient(145deg,#15151a,#09090c)!important;display:flex!important;align-items:center!important;justify-content:center!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-slot.host{border-color:rgba(255,208,90,.25)!important;box-shadow:inset 0 0 0 1px rgba(255,208,90,.04)!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-slot-label{position:absolute!important;left:5px!important;bottom:5px!important;z-index:3!important;padding:2px 6px!important;border-radius:999px!important;background:rgba(0,0,0,.62)!important;color:#fff!important;font-size:9px!important;font-weight:900!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-guest-wait{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;color:#bdbdc7!important;font-size:10px!important;font-weight:850!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .ktsecret-guest-wait b{display:grid!important;place-items:center!important;width:30px!important;height:30px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.25)!important;font-size:20px!important;color:#fff!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-room{height:100dvh!important;padding-bottom:calc(68px + env(safe-area-inset-bottom))!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-actions{flex:0 0 48px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-actions button{min-width:0!important;border:0!important;border-radius:12px!important;background:#15151a!important;color:#fff!important;font-size:11px!important;font-weight:950!important;padding:0 5px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-actions-2{flex-basis:46px!important}'+
      '#screen .kt-remote-live.kt-secret-guest-host-clone-final .kt-sg-main{flex:0 0 34dvh!important;min-height:220px!important;max-height:390px!important;margin-top:0!important}'+
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

    /* keep exactly ONE host-style action pair and ONE earnings box.
       Old 9-room/legacy scripts sometimes inject duplicate copies into this room. */
    var room=root.querySelector('.kt-sg-room');
    if(room){
      var keep1=room.querySelector('.kt-sg-actions-1');
      var keep2=room.querySelector('.kt-sg-actions-2');
      Array.from(room.querySelectorAll('div,section,nav')).forEach(function(el){
        if(el===keep1||el===keep2)return;
        try{
          var t=String(el.textContent||'').replace(/\\s+/g,'');
          if((t.indexOf('일일랭킹')>=0&&t.indexOf('미션')>=0&&t.indexOf('시청자')>=0)||
             (t.indexOf('되돌리기')>=0&&t.indexOf('보물상자')>=0&&t.indexOf('매치')>=0)){
            el.remove();
          }
        }catch(e){}
      });

      room.querySelectorAll('#ktGuestEarnHud,#myEarnHud,.ktsecret-earn-row,.kgh-earn,.kt-guest-earn-hud').forEach(function(el){
        try{if(!el.closest('.kt-sg-earn-wrap'))el.remove();}catch(e){}
      });

      /* old system/chat leftovers are not part of the clean guest phone view */
      Array.from(room.querySelectorAll('div,span,p')).forEach(function(el){
        try{
          if(el.closest('.kt-sg-bottom,.kt-sg-earn-wrap,.ktsecret-head,.ktsecret-airrow,.ktsecret-led,.ktsecret-main,.kt-sg-actions'))return;
          var t=String(el.textContent||'').trim();
          if(/방송\\s*나감/.test(t))el.remove();
        }catch(e){}
      });
    }
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