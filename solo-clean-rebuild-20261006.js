/* Clean solo room rebuild - isolated from all other rooms. */
(function(){
 if(window.__ktSoloCleanRebuild)return; window.__ktSoloCleanRebuild=true;
 var previousStart=window.startBroadcast;
 function soloSelected(){
   try{
     var t=String((window.state&&state.liveRoomType)||"");
     var n=String((window.state&&state.liveRoomName)||"");
     return t==="solo"||n==="1인 방송";
   }catch(e){return false;}
 }
 function hideOutside(){
   document.body.classList.add("kt-solo-clean-active");
 }
 function render(){
   var screen=document.getElementById("screen"); if(!screen)return;
   hideOutside();
   screen.innerHTML='<style id="ktSoloCleanStyle">'
   +'body.kt-solo-clean-active .header,body.kt-solo-clean-active .bottom,body.kt-solo-clean-active .kt-bottom,body.kt-solo-clean-active .creator,body.kt-solo-clean-active .creator-tools,body.kt-solo-clean-active .creator-bottom,body.kt-solo-clean-active .live-prep{display:none!important}'
   +'body.kt-solo-clean-active #screen{padding:0!important;margin:0!important;height:100dvh!important;min-height:100dvh!important;overflow:hidden!important;background:#000!important}'
   +'.ksolo{position:relative;width:100%;height:100dvh;background:#000;overflow:hidden;color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}.ksolo video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scaleX(-1);background:#111}'
   +'.ksolo-top{position:absolute;z-index:10;left:10px;right:10px;top:calc(10px + env(safe-area-inset-top));display:flex;align-items:center;gap:8px}.ksolo-live{font-size:17px;font-weight:950;text-shadow:0 1px 5px #000}.ksolo-live b{color:#ff2e59}.ksolo-att{margin-left:auto;border:1px solid #ff55c8;background:#190b19dd;color:#fff;border-radius:999px;height:38px;padding:0 13px;font-weight:900}.ksolo-close{width:38px;height:38px;border:0;border-radius:50%;background:#111c;color:#fff;font-size:22px}'
   +'.ksolo-msgs{position:absolute;z-index:8;left:12px;right:70px;bottom:76px;max-height:150px;overflow:hidden;font-size:13px;font-weight:800;text-shadow:0 1px 4px #000}.ksolo-msgs div{margin:4px 0}'
   +'.ksolo-bottom{position:absolute;z-index:12;left:6px;right:6px;bottom:calc(8px + env(safe-area-inset-bottom));display:flex;align-items:center;gap:5px}.ksolo-input{flex:1;min-width:0;height:42px;border-radius:22px;border:1px solid #ffffff55;background:#151515d9;color:#fff;padding:0 13px;outline:none}.ksolo-btn{flex:0 0 40px;width:40px;height:40px;border-radius:50%;border:1px solid #ffffff44;background:#111d;color:#fff;font-size:20px;padding:0;display:grid;place-items:center}.ksolo-btn img{width:25px;height:25px;object-fit:contain}'
   +'</style><section class="ksolo"><video id="ktSoloCleanVideo" autoplay playsinline muted></video>'
   +'<div class="ksolo-top"><div class="ksolo-live"><b>● LIVE</b> · 1인 방송</div><button class="ksolo-att" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()">출석체크</button><button class="ksolo-close" onclick="if(window.ktSoloCleanExit)ktSoloCleanExit()">×</button></div>'
   +'<div id="ktSoloCleanMsgs" class="ksolo-msgs"></div>'
   +'<div class="ksolo-bottom"><input id="ktSoloCleanInput" class="ksolo-input" placeholder="입력하세요..." onkeydown="if(event.key===\'Enter\')ktSoloCleanSend()">'
   +'<button class="ksolo-btn" aria-label="사람">👥</button>'
   +'<button class="ksolo-btn" aria-label="장미" onclick="if(window.openGifts)openGifts()">🌹</button>'
   +'<button class="ksolo-btn" aria-label="선물박스" onclick="if(window.openGifts)openGifts()"><img src="gift-box.svg" alt=""></button>'
   +'<button class="ksolo-btn" aria-label="공유" onclick="if(window.shareApp)shareApp()">↗</button></div></section>';
   var v=document.getElementById("ktSoloCleanVideo");
   try{if(v&&window.state&&state.stream){v.srcObject=state.stream;var p=v.play();if(p&&p.catch)p.catch(function(){});}}catch(e){}
 }
 window.ktSoloCleanSend=function(){
   var i=document.getElementById("ktSoloCleanInput"),m=document.getElementById("ktSoloCleanMsgs"); if(!i||!m)return;
   var t=String(i.value||"").trim(); if(!t)return; var d=document.createElement("div"); d.textContent="나  "+t;m.appendChild(d);while(m.children.length>5)m.removeChild(m.firstChild);i.value="";
 };
 window.ktSoloCleanExit=function(){
   document.body.classList.remove("kt-solo-clean-active");
   try{if(window.leaveBroadcastToDashboard)return leaveBroadcastToDashboard();}catch(e){}
   try{location.reload();}catch(e){}
 };
 window.startBroadcast=async function(){
   if(!soloSelected())return typeof previousStart==="function"?previousStart.apply(this,arguments):false;
   var ok=true;
   try{
     var live=!!(window.state&&state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks().some(function(t){return t.readyState==="live";}));
     if(!live&&window.ensureLiveCamera)ok=await window.ensureLiveCamera((state&&state.cameraFacing)||"user");
   }catch(e){ok=false;}
   if(ok!==false)render();
   return ok;
 };
})();