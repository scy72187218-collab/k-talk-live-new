/* K-Talk secret guest screen rebuilt from current host room.
   Host room is untouched. This file runs ONLY for a remote viewer entering a secret room.
   Visual structure mirrors the host room; only the bottom row is guest-specific.
*/
(function(){
  if(window.__ktSecretGuestFromHost20261004)return;
  window.__ktSecretGuestFromHost20261004=true;

  function roomInfo(){
    try{return window.__ktLastLiveRoom||{};}catch(e){return {};}
  }
  function isSecretRemote(){
    try{
      if(!document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var r=roomInfo();
      var t=[r.room_type,r.room_name,r.title,window.__ktRemoteRoomName,window.__ktRemoteRoomType].filter(Boolean).join(' ').toLowerCase();
      return /비밀|secret|password/.test(t);
    }catch(e){return false;}
  }
  function esc(v){
    return String(v==null?'':v).replace(/[&<>"]/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];
    });
  }
  function callAny(names){
    for(var i=0;i<names.length;i++){
      try{
        var f=window[names[i]];
        if(typeof f==='function'){f();return true;}
      }catch(e){}
    }
    return false;
  }
  function getGuestStreams(){
    var a=[];
    try{if(Array.isArray(window.ktSecretGuestStreams))a=window.ktSecretGuestStreams;}catch(e){}
    try{if(!a.length&&window.state&&Array.isArray(state.secretGuestStreams))a=state.secretGuestStreams;}catch(e){}
    try{if(!a.length&&window.state&&Array.isArray(state.guestStreams))a=state.guestStreams;}catch(e){}
    try{if(!a.length&&Array.isArray(window.ktGuestStreams))a=window.ktGuestStreams;}catch(e){}
    return a||[];
  }
  function streamOf(x){return x&&(x.stream||x.mediaStream||x.srcObject||x);}

  function ensureStyle(){
    if(document.getElementById('ktSecretGuestFromHostStyle20261004'))return;
    var s=document.createElement('style');
    s.id='ktSecretGuestFromHostStyle20261004';
    s.textContent=''
      +'#screen .kt-sgfh{position:fixed!important;inset:0!important;background:#000!important;color:#fff!important;z-index:2147482000!important;overflow:hidden!important;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif!important}'
      +'#screen .kt-sgfh *{box-sizing:border-box!important}'
      +'#screen .kt-sgfh-room{height:100dvh!important;display:flex!important;flex-direction:column!important;gap:4px!important;padding:4px 7px calc(64px + env(safe-area-inset-bottom))!important;background:#000!important}'
      +'#screen .kt-sgfh-head{flex:0 0 58px!important;border-radius:16px!important;background:linear-gradient(180deg,#17171a,#0d0d10)!important;display:grid!important;grid-template-columns:1fr auto 1fr!important;align-items:center!important;padding:5px 10px!important}'
      +'#screen .kt-sgfh-left{display:flex!important;align-items:center!important;gap:7px!important;min-width:0!important}'
      +'#screen .kt-sgfh-back{width:34px!important;height:34px!important;border-radius:50%!important;border:1px solid #ffffff35!important;background:#111!important;color:#fff!important;font-size:28px!important}'
      +'#screen .kt-sgfh-title{font-size:20px!important;font-weight:950!important;white-space:nowrap!important}.kt-sgfh-title i{font-style:normal!important;color:#ff2e67!important}'
      +'#screen .kt-sgfh-att{justify-self:center!important;height:29px!important;min-width:88px!important;padding:0 6px!important;border-radius:18px!important;border:2px solid #ff2bbd!important;background-color:#130714!important;background-image:radial-gradient(circle,#ff35ce 1.4px,transparent 2px)!important;background-size:8px 8px!important;color:#ffd52f!important;font-size:11px!important;font-weight:950!important;box-shadow:0 0 8px #ff2bbd!important}'
      +'#screen .kt-sgfh-brand{justify-self:end!important;color:#ff3d78!important;font-size:20px!important;font-weight:950!important;white-space:nowrap!important}'
      +'#screen .kt-sgfh-air{flex:0 0 32px!important;display:flex!important;align-items:center!important;gap:8px!important;padding:0 8px!important;font-size:14px!important;font-weight:950!important}.kt-sgfh-air .on{color:#ff315f!important}'
      +'#screen .kt-sgfh-led{flex:0 0 52px!important;position:relative!important;border:2px solid #ff28c4!important;border-radius:22px!important;background-color:#120712!important;background-image:radial-gradient(circle,#ff35ce 2px,transparent 2.7px)!important;background-size:13px 13px!important;overflow:hidden!important;box-shadow:0 0 9px #ff28c4,0 0 22px #ff28c466!important}'
      +'#screen .kt-sgfh-led-track{position:absolute!important;left:0!important;top:0!important;height:100%!important;display:flex!important;align-items:center!important;white-space:nowrap!important;animation:ktSgfhMarquee 12s linear infinite!important;font-size:24px!important;font-weight:950!important;color:#ffd62d!important;text-shadow:0 0 7px #ff8b00!important}.kt-sgfh-led-track span{display:inline-block!important;padding-right:80px!important}.kt-sgfh-led-track b{color:#ff59c9!important}@keyframes ktSgfhMarquee{from{transform:translateX(45%)}to{transform:translateX(-100%)}}'
      +'#screen .kt-sgfh-actions{flex:0 0 43px!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important}'
      +'#screen .kt-sgfh-actions button{border:0!important;border-radius:11px!important;background:#15151a!important;color:#fff!important;font-size:11px!important;font-weight:950!important;padding:0 4px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
      +'#screen .kt-sgfh-main{position:relative!important;flex:1 1 auto!important;min-height:250px!important;border-radius:10px!important;background:#111!important;border:1px solid rgba(255,196,73,.12)!important;overflow:hidden!important}'
      +'#screen .kt-sgfh-grid{position:absolute!important;inset:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:3px!important;padding:3px!important}'
      +'#screen .kt-sgfh-cell{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:8px!important;background:linear-gradient(145deg,#15151a,#09090c)!important;display:flex!important;align-items:center!important;justify-content:center!important}'
      +'#screen .kt-sgfh-cell.host{grid-row:auto!important;grid-column:auto!important;border-color:rgba(255,208,90,.25)!important;box-shadow:inset 0 0 0 1px rgba(255,208,90,.04)!important}'
      +'#screen .kt-sgfh-cell video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;background:#111!important;transform:none!important}'+'#screen .kt-sgfh-chat{position:absolute!important;left:8px!important;right:8px!important;bottom:8px!important;z-index:15!important;max-height:96px!important;overflow:hidden!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;pointer-events:none!important}.kt-sgfh-chat-line{margin-top:4px!important;font-size:12px!important;font-weight:850!important;text-shadow:0 1px 4px #000!important;animation:ktSgfhChatRise .24s ease-out both!important}.kt-sgfh-chat-line b{color:#65c8ff!important;margin-right:6px!important}.kt-sgfh-chat-line span{color:#fff!important}@keyframes ktSgfhChatRise{from{transform:translateY(14px);opacity:0}to{transform:translateY(0);opacity:1}}'
      +'#screen .kt-sgfh-label{position:absolute!important;left:5px!important;bottom:5px!important;z-index:3!important;padding:2px 6px!important;border-radius:999px!important;background:rgba(0,0,0,.62)!important;color:#fff!important;font-size:9px!important;font-weight:900!important}'
      +'#screen .kt-sgfh-wait{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:3px!important;color:#bdbdc7!important;font-size:10px!important;font-weight:850!important}.kt-sgfh-wait b{display:grid!important;place-items:center!important;width:30px!important;height:30px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.25)!important;font-size:20px!important;color:#fff!important}'
      +'#screen .kt-sgfh-earn{position:fixed!important;right:8px!important;bottom:calc(69px + env(safe-area-inset-bottom))!important;z-index:2147482999!important;width:108px!important;height:52px!important;border:1px solid #d2a936!important;border-radius:10px!important;background:linear-gradient(135deg,#17140be8,#0d0d12e8)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;padding:3px!important;font-size:7px!important;line-height:1.1!important}.kt-sgfh-earn b{color:#ffe071!important;font-size:9px!important}.kt-sgfh-earn small{display:block!important;font-size:6px!important;color:#ddd!important;margin-top:2px!important}'
      +'#screen .kt-sgfh-bottom{position:fixed!important;left:8px!important;right:8px!important;bottom:calc(8px + env(safe-area-inset-bottom))!important;height:50px!important;display:flex!important;align-items:center!important;gap:6px!important;z-index:2147483000!important}'
      +'#screen .kt-sgfh-bottom input{flex:1 1 auto!important;min-width:0!important;height:44px!important;border-radius:22px!important;border:1px solid #42434c!important;background:#1b1b20!important;color:#fff!important;padding:0 15px!important;font-size:14px!important;font-weight:800!important;pointer-events:auto!important;touch-action:manipulation!important}'
      +'#screen .kt-sgfh-bottom button{width:44px!important;height:44px!important;min-width:44px!important;flex:0 0 44px!important;border-radius:50%!important;border:1px solid #3c3d45!important;background:#17171d!important;color:#fff!important;padding:0!important;display:grid!important;place-items:center!important;font-size:21px!important;pointer-events:auto!important;touch-action:manipulation!important}#screen .kt-sgfh-bottom [data-b="send"]{font-size:28px!important;font-weight:300!important;transform:rotate(-18deg)!important}'
      +'@media(max-width:390px){#screen .kt-sgfh-room{padding-left:4px!important;padding-right:4px!important}.kt-sgfh-title,.kt-sgfh-brand{font-size:17px!important}.kt-sgfh-att{min-width:82px!important;font-size:10px!important}.kt-sgfh-actions{flex-basis:39px!important}.kt-sgfh-actions button{font-size:10px!important}.kt-sgfh-bottom button{width:40px!important;height:40px!important;min-width:40px!important;flex-basis:40px!important}.kt-sgfh-bottom input{height:40px!important;font-size:13px!important}}';
    document.head.appendChild(s);
  }

  function render(){
    if(!isSecretRemote())return;
    var root=document.querySelector('#screen .kt-remote-live');
    if(!root)return;
    if(root.dataset.ktSgfhBuilt==='1')return;

    ensureStyle();
    var r=roomInfo();
    var host=esc(r.host_name||'호스트');
    root.dataset.ktSgfhBuilt='1';
    root.innerHTML=''
      +'<section class="kt-sgfh"><div class="kt-sgfh-room">'
      +'<div class="kt-sgfh-head"><div class="kt-sgfh-left"><button class="kt-sgfh-back" type="button">‹</button><div class="kt-sgfh-title"><i>●</i> 비밀방</div></div><button class="kt-sgfh-att" type="button">🌹 출석체크</button><div class="kt-sgfh-brand">K-Talk LIVE</div></div>'
      +'<div class="kt-sgfh-air"><span class="on">● ON AIR</span><span class="kt-sgfh-clock">00:00:00</span></div>'
      +'<div class="kt-sgfh-led"><div class="kt-sgfh-led-track"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>'
      +'<div class="kt-sgfh-actions"><button data-a="rank">🔥 일일 랭킹</button><button data-a="mission">🎯 미션</button><button data-a="viewers">시청자 <b id="ktSgfhViewers">0</b>명 시청중 🏃</button></div>'
      +'<div class="kt-sgfh-actions"><button data-a="flip">↻ 되돌리기</button><button data-a="treasure">🎁 보물상자</button><button data-a="match">⚔ 매치</button></div>'
      +'<div class="kt-sgfh-main"><div class="kt-sgfh-grid">'
      +'<div class="kt-sgfh-cell host"><video id="ktRemoteLiveVideo" autoplay playsinline muted></video><span class="kt-sgfh-label">'+host+'</span></div>'
      +'<div class="kt-sgfh-cell" data-g="0"><div class="kt-sgfh-wait"><b>+</b><span>게스트</span></div></div>'
      +'<div class="kt-sgfh-cell" data-g="1"><div class="kt-sgfh-wait"><b>+</b><span>게스트</span></div></div>'
      +'<div class="kt-sgfh-cell" data-g="2"><div class="kt-sgfh-wait"><b>+</b><span>게스트</span></div></div>'
      +'<div class="kt-sgfh-cell" data-g="3"><div class="kt-sgfh-wait"><b>+</b><span>게스트</span></div></div>'
      +'</div><div class="kt-sgfh-chat" id="ktSgfhChat"></div></div>'
      +'<div class="kt-sgfh-earn">🔒 내 수익 <b>0원</b><small>🌹 0송이 · 일반회원 35%</small></div>'
      +'<div class="kt-sgfh-bottom"><input id="ktSgfhChatInput" type="text" maxlength="100" placeholder="입력하세요..." aria-label="채팅 입력">'
      +'<button type="button" data-b="send" aria-label="채팅 보내기">◁</button><button type="button" data-b="join">👥</button><button type="button" data-b="rose">🌹</button><button type="button" data-b="gift">🎁</button><button type="button" data-b="share">↗</button></div>'
      +'</div></section>';

    var q=function(sel){return root.querySelector(sel);};
    q('.kt-sgfh-back').onclick=function(){try{if(typeof window.ktLeaveRemoteLive==='function')window.ktLeaveRemoteLive();}catch(e){}};
    q('.kt-sgfh-att').onclick=function(){callAny(['openAttendanceBenefits']);};
    q('[data-a="rank"]').onclick=function(){callAny(['openDailyRanking','showDailyRanking','ktOpenDailyRanking','openRanking']);};
    q('[data-a="mission"]').onclick=function(){callAny(['openMission','openMissionPanel','ktOpenMission','showMission']);};
    q('[data-a="flip"]').onclick=function(){callAny(['ktBottomCameraFlip','toggleCameraFacing','switchCamera','flipCamera','rotateCamera']);};
    q('[data-a="treasure"]').onclick=function(){callAny(['openTreasureBox','openTreasure','ktOpenTreasureBox','showTreasureBox']);};
    q('[data-a="match"]').onclick=function(){callAny(['openMatch','startMatch','ktOpenMatch','showMatch']);};

    var input=q('#ktSgfhChatInput');
    async function sendChatNow(){
      try{
        var text=String(input&&input.value||'').trim();
        if(!text)return;
        if(typeof window.ktRemoteSendChat!=='function')return;
        var ok=await window.ktRemoteSendChat(text);
        if(!ok)return;
        if(input)input.value='';
        var box=q('#ktSgfhChat');
        if(box){
          var line=document.createElement('div');
          line.className='kt-sgfh-chat-line';
          line.innerHTML='<b>나</b><span>'+esc(text)+'</span>';
          box.appendChild(line);
          while(box.children.length>5)box.removeChild(box.firstChild);
        }
      }catch(e){}
    }
    q('[data-b="send"]').onclick=sendChatNow;
    if(input)input.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();sendChatNow();}};
    var join=q('[data-b="join"]');
    if(join){join.id='ktRemoteGuestRequest';join.onclick=function(){callAny(['ktRequestGuestJoin']);};}
    q('[data-b="rose"]').onclick=function(){callAny(['ktRemoteOpenGifts','openGifts','ktOpenGiftShop']);};
    q('[data-b="gift"]').onclick=function(){callAny(['ktRemoteOpenGifts','openGifts','ktOpenGiftShop']);};
    q('[data-b="share"]').onclick=function(){try{if(typeof window.shareApp==='function')window.shareApp();else if(navigator.share)navigator.share({title:'K-Talk LIVE',url:location.href}).catch(function(){});}catch(e){}};

    syncMedia();
    syncClock();
  }

  function syncMedia(){
    if(!isSecretRemote())return;
    var root=document.querySelector('#screen .kt-remote-live[data-kt-sgfh-built="1"]');
    if(!root)return;

    var hostVideo=root.querySelector('#ktRemoteLiveVideo');
    var hs=null;
    try{hs=window.__ktRemoteHostStream||window.__ktLastApprovedGuestHostStream||null;}catch(e){}
    if(hostVideo&&hs&&hostVideo.srcObject!==hs){
      hostVideo.srcObject=hs;
      hostVideo.muted=true;
      var p=hostVideo.play();if(p&&p.catch)p.catch(function(){});
    }

    var guests=getGuestStreams();
    root.querySelectorAll('[data-g]').forEach(function(cell){
      var i=Number(cell.getAttribute('data-g')||0);
      var item=guests[i],st=streamOf(item);
      var v=cell.querySelector('video');
      if(st&&st.getTracks){
        if(!v){
          cell.innerHTML='';
          v=document.createElement('video');
          v.autoplay=true;v.playsInline=true;v.muted=true;
          cell.appendChild(v);
          var lab=document.createElement('span');
          lab.className='kt-sgfh-label';
          lab.textContent=(item&&item.name)||('게스트 '+(i+1));
          cell.appendChild(lab);
        }
        if(v.srcObject!==st){v.srcObject=st;var p2=v.play();if(p2&&p2.catch)p2.catch(function(){});}
      }else if(v){
        cell.innerHTML='<div class="kt-sgfh-wait"><b>+</b><span>게스트</span></div>';
      }
    });
  }

  function syncClock(){
    var c=document.querySelector('#screen .kt-remote-live[data-kt-sgfh-built="1"] .kt-sgfh-clock');
    if(!c)return;
    var d=new Date();
    c.textContent=[d.getHours(),d.getMinutes(),d.getSeconds()].map(function(n){return String(n).padStart(2,'0');}).join(':');
  }

  function ensure(){
    if(!isSecretRemote())return;
    render();
    syncMedia();
    syncClock();
  }

  ensureStyle();
  ensure();
  [60,180,400,900,1600].forEach(function(ms){setTimeout(ensure,ms);});
  window.addEventListener('kt-remote-host-selected',function(){[50,160,400].forEach(function(ms){setTimeout(ensure,ms);});});
  window.addEventListener('kt-livekit-state',function(){setTimeout(syncMedia,50);});
  window.addEventListener('kt-guest-approval-received',function(){[20,80,220].forEach(function(ms){setTimeout(syncMedia,ms);});});
  setInterval(function(){if(isSecretRemote()){syncMedia();syncClock();}},700);
})();