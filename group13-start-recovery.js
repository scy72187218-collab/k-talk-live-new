/* K-Talk 13명 방송 전용 복구: 5초 멈춤 방지 + 호스트/게스트 12칸 + 하단 선물판. 다른 방은 건드리지 않음. */
(function(){
  if(window.__ktGroup13StartRecoveryInstalled)return;
  window.__ktGroup13StartRecoveryInstalled=true;

  var clockTimer=0;
  var starting=false;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function isGroup13(){
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      var title=(document.getElementById('liveTitle')||{}).value||'';
      return t==='group'||t==='group13'||String(n).indexOf('13명')>-1||String(title).indexOf('13명')>-1;
    }catch(e){return false;}
  }

  function cancelCountdowns(){
    try{
      ['ktLiveStartCountdown','ktCreatorCountdown'].forEach(function(id){
        var el=document.getElementById(id);if(el)el.remove();
      });
    }catch(e){}
    try{window.__ktLiveStarting=false;}catch(e){}
  }

  function guestSlots(){
    var out='';
    for(var i=1;i<=12;i++)out+='<div class="kt13r-guest"><span>게스트 '+i+'</span></div>';
    return out;
  }

  function gift(img,emoji,count,label){
    var art=img?'<img src="'+img+'" alt="'+esc(label)+'">':'<b class="kt13r-gift-emoji">'+emoji+'</b>';
    return '<button class="kt13r-gift" type="button" onclick="if(window.openGifts)openGifts()">'+art+'<strong>'+count+'</strong><small>'+label+'</small></button>';
  }

  function startClock(){
    if(clockTimer)clearInterval(clockTimer);
    var started=Date.now();
    function tick(){
      var el=document.getElementById('kt13rClock');if(!el)return;
      var s=Math.floor((Date.now()-started)/1000),h=Math.floor(s/3600),m=Math.floor((s%3600)/60),x=s%60;
      el.textContent=String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(x).padStart(2,'0');
    }
    tick();clockTimer=setInterval(tick,1000);
  }

  function renderGroup13(){
    cancelCountdowns();
    var screen=document.getElementById('screen');
    var creator=document.getElementById('creator');
    if(!screen)return false;
    try{if(creator)creator.classList.remove('show','live-prep-open','creator-recording','creator-review');}catch(e){}
    try{document.body.classList.remove('kt-home','kt-video-mode');}catch(e){}

    var title='13명 방송';
    try{title=(state.liveRoomName||title);}catch(e){}

    screen.innerHTML='<style id="kt13rStyle">'
      +'#screen{padding:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom,.kt-bottom{display:none!important}'
      +'.kt13r-room{height:100dvh;width:100%;padding:5px 6px calc(6px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:4px;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;overflow:hidden}'
      +'.kt13r-head{flex:0 0 48px;border-radius:14px;background:#111116;display:flex;align-items:center;gap:8px;padding:5px 9px}.kt13r-air{color:#ff355f;font-size:15px;font-weight:950;white-space:nowrap}.kt13r-clock{font-size:13px;font-weight:950}.kt13r-title{min-width:0;flex:1;text-align:center;font-size:15px;font-weight:950;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kt13r-brand{color:#ff4a9f;font-size:14px;font-weight:950;white-space:nowrap}'
      +'.kt13r-led{flex:0 0 35px;border:1px solid #ff36c9;border-radius:15px;display:flex;align-items:center;justify-content:center;background:#170817;color:#ffe257;font-size:12px;font-weight:950;box-shadow:0 0 9px #ff36c966}'
      +'.kt13r-stats{flex:0 0 30px;display:grid;grid-template-columns:repeat(3,1fr);gap:4px}.kt13r-stats span{display:grid;place-items:center;border-radius:10px;background:#111116;color:#fff;font-size:9px;font-weight:900}'
      +'.kt13r-main{position:relative;flex:1 1 0;min-height:0;display:grid;grid-template-columns:43% 57%;gap:3px;overflow:hidden}.kt13r-host{position:relative;min-width:0;min-height:0;border-radius:8px;overflow:hidden;background:#131317;border:1px solid #34343a}.kt13r-host video{width:100%;height:100%;display:block;object-fit:cover;transform:scaleX(-1);background:#111}.kt13r-host-label{position:absolute;left:7px;top:7px;padding:4px 8px;border-radius:999px;background:#000a;color:#fff;font-size:10px;font-weight:950}'
      +'.kt13r-guests{min-width:0;min-height:0;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:repeat(4,1fr);gap:2px}.kt13r-guest{min-width:0;min-height:0;display:grid;place-items:center;border:1px solid #34343b;border-radius:6px;background:linear-gradient(145deg,#19191e,#0f1013);color:#c6c6ce;font-size:8px;font-weight:900}'
      +'.kt13r-wave{position:absolute;left:0;right:0;bottom:0;height:31px;pointer-events:none;background:url("k-talk-rainbow-waveform.svg?v=20260909-group13-recovery") center/100% 100% no-repeat;filter:drop-shadow(0 0 4px #ff49ce88);z-index:5}'
      +'.kt13r-earn{flex:0 0 28px;display:flex;align-items:center;justify-content:center;border:1px solid #9c7b24;border-radius:10px;background:#161208;color:#ffe071;font-size:10px;font-weight:950}'
      +'.kt13r-gifts{flex:0 0 58px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px}.kt13r-gift{min-width:0;border:1px solid #35353c;border-radius:8px;background:linear-gradient(#111116,#08080b);color:#fff;padding:2px 1px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden}.kt13r-gift img{width:30px;height:25px;object-fit:contain}.kt13r-gift-emoji{height:25px;font-size:21px;line-height:25px}.kt13r-gift strong{font-size:8px;color:#ffe24d;line-height:1}.kt13r-gift small{font-size:6px;color:#fff;font-weight:900;line-height:1.05;white-space:nowrap}'
      +'.kt13r-tools{flex:0 0 45px;display:grid;grid-template-columns:repeat(6,1fr);gap:3px}.kt13r-tools button{border:0;background:none;color:#fff;font-size:8px;font-weight:900;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1px}.kt13r-tools i{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#17171c;border:1px solid #383840;font-style:normal;font-size:15px}'
      +'@media(max-width:390px){.kt13r-room{padding-left:4px;padding-right:4px}.kt13r-head{flex-basis:44px}.kt13r-brand{font-size:12px}.kt13r-title{font-size:13px}.kt13r-gifts{flex-basis:54px}.kt13r-gift img{width:27px;height:22px}.kt13r-tools{flex-basis:42px}}'
      +'</style>'
      +'<section class="kt13r-room">'
        +'<div class="kt13r-head"><span class="kt13r-air">● ON AIR</span><span id="kt13rClock" class="kt13r-clock">00:00:00</span><b class="kt13r-title">'+esc(title)+'</b><span class="kt13r-brand">♛ K-Talk LIVE</span></div>'
        +'<div class="kt13r-led">✨ 13명 방송 · 호스트 1명 + 게스트 12명 ✨</div>'
        +'<div class="kt13r-stats"><span>🔥 일일 랭킹</span><span>👥 게스트 추가</span><span>👁 시청자 0명</span></div>'
        +'<div class="kt13r-main"><div class="kt13r-host"><video id="kt13rVideo" autoplay muted playsinline></video><span class="kt13r-host-label">호스트</span></div><div class="kt13r-guests">'+guestSlots()+'</div><div class="kt13r-wave"></div></div>'
        +'<div class="kt13r-earn">🔒 내 수익 · 0원 · 본인만 표시</div>'
        +'<div class="kt13r-gifts">'
          +gift('rose-single.svg','',1,'장미')
          +gift('', '🌹',5,'장미5')
          +gift('', '💐',10,'장미10')
          +gift('rose-bouquet-50.svg','',50,'장미50')
          +gift('rose-bouquet-100.svg','',100,'장미100')
          +gift('', '🎁',500,'선물')
          +gift('gift-box.svg','',1000,'보물상자')
        +'</div>'
        +'<div class="kt13r-tools">'
          +'<button onclick="if(window.ktGroup13OpenMessage)ktGroup13OpenMessage();else if(window.openMessages)openMessages()"><i>💬</i>메시지</button>'
          +'<button onclick="if(window.shareApp)shareApp()"><i>👥</i>친구</button>'
          +'<button onclick="if(window.ktGroup13Ranking)ktGroup13Ranking()"><i>🏆</i>랭킹</button>'
          +'<button onclick="if(window.ktGroup13Invite)ktGroup13Invite()"><i>＋</i>추가</button>'
          +'<button onclick="if(window.ktGroup13Effect)ktGroup13Effect();else if(window.openEditEffectPanel)openEditEffectPanel()"><i>✨</i>효과</button>'
          +'<button onclick="if(window.ktGroup13More)ktGroup13More()"><i>⋯</i>더보기</button>'
        +'</div>'
      +'</section>';

    try{
      var v=document.getElementById('kt13rVideo');
      if(v&&window.state&&state.stream){v.srcObject=state.stream;v.muted=true;v.setAttribute('playsinline','');var p=v.play();if(p&&p.catch)p.catch(function(){});}
    }catch(e){}
    startClock();
    return true;
  }

  function install(){
    var current=window.startBroadcast;
    if(typeof current!=='function'||current.__ktGroup13Recovery)return;
    var old=current;
    var wrapped=async function(){
      if(!isGroup13())return old.apply(this,arguments);
      if(starting)return false;
      starting=true;
      cancelCountdowns();
      try{
        if(window.ensureLiveCamera){
          try{await window.ensureLiveCamera((window.state&&state.cameraFacing)||'user');}catch(e){}
        }
        return renderGroup13();
      }finally{
        starting=false;
      }
    };
    wrapped.__ktGroup13Recovery=true;
    window.startBroadcast=wrapped;
  }

  setTimeout(install,0);
  setTimeout(install,300);
  setTimeout(install,900);
  setTimeout(install,1600);
})();
