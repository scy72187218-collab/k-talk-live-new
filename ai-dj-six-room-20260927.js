/* K-Talk AI DJ 전용 6명방
   비밀방과 같은 3x2 모양만 사용한다.
   비밀방과는 완전히 별도이며 비밀번호를 사용하지 않는다.
   내부 통신은 기존 group9 경로를 그대로 사용해 다른 통신 코드는 건드리지 않는다. */
(function(){
  if(window.__ktAiDjSixRoom20260927)return;
  window.__ktAiDjSixRoom20260927=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function isAiDj(){
    try{
      return !!(window.state&&state.ktAiDjRoom) &&
        String((state.liveRoomName||'')+' '+((document.getElementById('liveTitle')||{}).value||'')).indexOf('AI DJ')>-1;
    }catch(e){return false;}
  }

  function bars(){
    var s='';
    for(var i=0;i<34;i++)s+='<i style="--d:'+(0.52+(i%7)*0.08).toFixed(2)+'s;--h:'+(10+(i*11)%30)+'px"></i>';
    return s;
  }

  function render(){
    if(!isAiDj())return false;
    var screen=document.getElementById('screen');
    if(!screen)return false;

    var dj='';
    try{dj=window.KT_AI_DJ_PHOTO||'';}catch(e){}
    var clock=(document.getElementById('ktLiveClock')||{}).textContent||'00:00:00';

    screen.innerHTML=''
      +'<style id="ktAiDjSixStyle20260927">'
      +'#screen{padding:0!important;margin:0!important;width:100%!important;max-width:none!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#000!important}.bottom{display:none!important}'
      +'.kt-ai-dj-six-room{width:100%;height:100dvh;display:flex;flex-direction:column;overflow:hidden;background:#000;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:4px 7px calc(5px + env(safe-area-inset-bottom));gap:4px}'
      +'.ktadj6-head{flex:0 0 62px;border-radius:16px;background:linear-gradient(180deg,#17171a,#0d0d10);display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:5px 9px}'
      +'.ktadj6-left{display:flex;align-items:center;gap:7px;min-width:0}.ktadj6-back{width:34px;height:34px;border-radius:50%;border:1px solid #ffffff35;background:#111;color:#fff;font-size:28px}.ktadj6-title{font-size:19px;font-weight:950;white-space:nowrap}.ktadj6-title i{font-style:normal;color:#ff2e67}.ktadj6-brand{justify-self:end;color:#ff3d78;font-size:18px;font-weight:950;white-space:nowrap}'
      +'.ktadj6-att{justify-self:center;height:28px;min-width:86px;padding:0 5px;border-radius:18px;border:2px solid #ff2bbd;background:#130714;color:#ffd52f;font-size:10px;font-weight:950;box-shadow:0 0 8px #ff2bbd}'
      +'.ktadj6-air{flex:0 0 32px;display:flex;align-items:center;gap:8px;padding:0 8px;font-size:13px;font-weight:950}.ktadj6-air .on{color:#ff315f}.ktadj6-public{margin-left:auto;border:1px solid #53cfff88;border-radius:999px;background:#081b24;color:#8fe8ff;padding:4px 8px;font-size:9px;font-weight:950}'
      +'.ktadj6-led{flex:0 0 50px;position:relative;border:2px solid #ff28c4;border-radius:20px;background:#120712;overflow:hidden;box-shadow:0 0 9px #ff28c4}.ktadj6-led-track{position:absolute;left:0;top:0;height:100%;display:flex;align-items:center;white-space:nowrap;animation:ktadj6mar 12s linear infinite;font-size:20px;font-weight:950;color:#ffd62d;text-shadow:0 0 7px #ff8b00}.ktadj6-led-track span{display:inline-block;padding-right:90px}.ktadj6-led-track b{color:#ff59c9}@keyframes ktadj6mar{from{transform:translateX(45%)}to{transform:translateX(-100%)}}'
      +'.ktadj6-main{position:relative;flex:1 1 0;min-height:0;overflow:hidden;border-radius:10px;background:#111;border:1px solid rgba(255,196,73,.35)}'
      +'.ktadj6-grid{position:absolute;inset:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(2,minmax(0,1fr));gap:3px;padding:3px}'
      +'.ktadj6-slot{position:relative;min-width:0;min-height:0;overflow:hidden;border:1px solid rgba(255,255,255,.18);border-radius:8px;background:linear-gradient(145deg,#15151a,#09090c);display:flex;align-items:center;justify-content:center}'
      +'.ktadj6-slot.dj{border-color:rgba(255,208,90,.76);box-shadow:inset 0 0 0 1px rgba(255,208,90,.14)}'
      +'.ktadj6-dj-photo{position:absolute;inset:0;background:#111 center/cover no-repeat}.ktadj6-dj-shade{position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(0,0,0,.64))}'
      +'.ktadj6-label{position:absolute;left:5px;bottom:5px;z-index:4;padding:2px 6px;border-radius:999px;background:rgba(0,0,0,.68);color:#fff;font-size:9px;font-weight:900}.ktadj6-slot.dj .ktadj6-label{color:#ffe071}'
      +'.ktadj6-wait{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;color:#bdbdc7;font-size:10px;font-weight:850}.ktadj6-wait b{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;border:1px solid rgba(255,255,255,.25);font-size:20px;color:#fff}'
      +'.ktadj6-wave{position:absolute;left:7px;right:7px;bottom:7px;height:36px;z-index:3;display:flex;align-items:end;gap:2px;opacity:.9}.ktadj6-wave i{flex:1;min-width:2px;height:var(--h);border-radius:3px;background:#ff38c6;animation:ktadj6wave var(--d) ease-in-out infinite alternate}.ktadj6-wave i:nth-child(4n+2){background:#28d9ff}.ktadj6-wave i:nth-child(4n+3){background:#41e968}.ktadj6-wave i:nth-child(4n){background:#ffd43b}@keyframes ktadj6wave{from{transform:scaleY(.4)}to{transform:scaleY(1)}}'
      +'.ktadj6-tools{flex:0 0 54px;display:grid;grid-template-columns:repeat(7,1fr);gap:2px}.ktadj6-tool{border:0;background:none;color:#fff;min-width:0;font-weight:900;display:grid;justify-items:center;gap:2px}.ktadj6-tool i{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#1b1b20,#0b0b0f);border:1px solid #35363d;font-style:normal;font-size:17px}.ktadj6-tool span{font-size:8px;white-space:nowrap}'
      +'@media(max-width:390px){.kt-ai-dj-six-room{padding-left:4px;padding-right:4px;gap:3px}.ktadj6-head{flex-basis:58px}.ktadj6-title,.ktadj6-brand{font-size:16px}.ktadj6-led{flex-basis:46px}.ktadj6-led-track{font-size:18px}.ktadj6-tools{flex-basis:50px}.ktadj6-tool i{width:33px;height:33px;font-size:15px}}'
      +'</style>'
      +'<section class="kt-ai-dj-six-room ktsecret-room" data-kt-ai-dj="1" data-kt-room="ai-dj-6">'
        +'<div class="ktadj6-head"><div class="ktadj6-left"><button class="ktadj6-back" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">‹</button><div class="ktadj6-title"><i>●</i> AI DJ 방</div></div><button class="ktadj6-att" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()">출석체크</button><div class="ktadj6-brand">K-Talk LIVE</div></div>'
        +'<div class="ktadj6-air"><span class="on">● ON AIR</span><span id="ktLiveClock">'+esc(clock)+'</span><span class="ktadj6-public">🔓 공개방 · 비밀번호 없음</span></div>'
        +'<div class="ktadj6-led"><div class="ktadj6-led-track"><span>🎧 ✨ <b>K-Talk AI DJ</b> 음악방에 오신 것을 환영합니다 ✨ 🎧</span><span>🎧 ✨ <b>K-Talk AI DJ</b> 신청곡을 말씀해 주세요 ✨ 🎧</span></div></div>'
        +'<div class="ktadj6-main">'
          +'<div class="ktadj6-grid">'
            +'<div class="ktadj6-slot dj ktsecret-slot host"><div class="ktadj6-dj-photo" style="background-image:url(&quot;'+esc(dj)+'&quot;)"></div><div class="ktadj6-dj-shade"></div><span class="ktadj6-label">AI DJ</span><div class="ktadj6-wave">'+bars()+'</div></div>'
            +'<div class="ktadj6-slot ktsecret-slot"><div class="ktadj6-wait"><b>+</b><span>게스트 1</span></div></div>'
            +'<div class="ktadj6-slot ktsecret-slot"><div class="ktadj6-wait"><b>+</b><span>게스트 2</span></div></div>'
            +'<div class="ktadj6-slot ktsecret-slot"><div class="ktadj6-wait"><b>+</b><span>게스트 3</span></div></div>'
            +'<div class="ktadj6-slot ktsecret-slot"><div class="ktadj6-wait"><b>+</b><span>게스트 4</span></div></div>'
            +'<div class="ktadj6-slot ktsecret-slot"><div class="ktadj6-wait"><b>+</b><span>게스트 5</span></div></div>'
          +'</div>'
        +'</div>'
        +'<div class="ktadj6-tools">'
          +'<button class="ktadj6-tool" onclick="if(window.ktAiDjOpenRequest20260927)ktAiDjOpenRequest20260927()"><i>🎵</i><span>신청곡</span></button>'
          +'<button class="ktadj6-tool" onclick="if(window.ktAiDjVoiceSongRequest20260927)ktAiDjVoiceSongRequest20260927()"><i>🎤</i><span>말하기</span></button>'
          +'<button class="ktadj6-tool" onclick="if(window.openGifts)openGifts()"><i>🌹</i><span>장미</span></button>'
          +'<button class="ktadj6-tool" onclick="if(window.openGifts)openGifts()"><i>🎁</i><span>선물</span></button>'
          +'<button class="ktadj6-tool" onclick="if(window.shareApp)shareApp()"><i>↗</i><span>공유</span></button>'
          +'<button class="ktadj6-tool" onclick="if(window.openEditEffectPanel)openEditEffectPanel()"><i>✨</i><span>효과</span></button>'
          +'<button class="ktadj6-tool" onclick="if(window.openLiveSettings)openLiveSettings()"><i>•••</i><span>더보기</span></button>'
        +'</div>'
      +'</section>';

    try{
      if(typeof window.ktAiDjStart24h20260927==='function'){
        setTimeout(function(){
          try{window.ktAiDjStart24h20260927();}catch(e){}
        },80);
      }
    }catch(e){}
    return true;
  }

  window.ktRenderAiDjSixRoom20260927=render;

  var wrapped=null;
  function hook(){
    if(window.__ktAiDjSixStartHooked20260927)return;
    if(typeof window.startBroadcast!=='function')return;
    wrapped=window.startBroadcast;
    window.startBroadcast=async function(){
      var ai=isAiDj();
      var r=await wrapped.apply(this,arguments);
      if(ai){
        [20,80,180,420].forEach(function(ms){setTimeout(render,ms);});
      }
      return r;
    };
    window.__ktAiDjSixStartHooked20260927=true;
  }

  hook();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(hook,ms);});
})();