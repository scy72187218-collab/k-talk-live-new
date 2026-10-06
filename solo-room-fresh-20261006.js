/* Fresh 1-person live room. 2026-10-06. Only solo broadcast is changed. */
(function(){
  if(window.__ktSoloFresh20261006)return;
  window.__ktSoloFresh20261006=true;
  var old=window.startBroadcast;
  if(typeof old!=="function")return;
  function isSolo(){
    try{
      var t=String((window.state&&state.liveRoomType)||"");
      var n=String((window.state&&state.liveRoomName)||"");
      var title=String(((document.getElementById("liveTitle")||{}).value)||"");
      return t==="solo"||n.indexOf("1인")>=0||title.indexOf("1인 방송")>=0;
    }catch(e){return false;}
  }
  function esc(s){return String(s==null?"":s).replace(/[&<>"']/g,function(x){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x];});}
  window.ktSoloFreshChat=function(){
    var i=document.getElementById("ktSoloFreshInput"); if(!i)return;
    var v=String(i.value||"").trim(); if(!v)return;
    var l=document.getElementById("ktSoloFreshChat"); if(l){
      var d=document.createElement("div"); d.textContent="나  "+v; l.appendChild(d);
      while(l.children.length>5)l.removeChild(l.firstChild);
    }
    i.value="";
  };
  function hideLegacySoloUi(){
    try{
      document.body.classList.add("kt-solo-fresh-active");
      ["creator","livePrep","ktLiveRoom","ktSoloRoom"].forEach(function(id){
        var el=document.getElementById(id); if(el)el.style.setProperty("display","none","important");
      });
      document.querySelectorAll(".creator,.creator-tools,.creator-bottom,.live-prep,.kt-bottom,.bottom").forEach(function(el){
        el.style.setProperty("display","none","important");
      });
    }catch(e){}
  }
  function render(){
    var s=document.getElementById("screen"); if(!s)return;
    hideLegacySoloUi();
    s.innerHTML='<style>'
      +'body.kt-solo-fresh-active .bottom,body.kt-solo-fresh-active .kt-bottom,body.kt-solo-fresh-active .creator,body.kt-solo-fresh-active .creator-tools,body.kt-solo-fresh-active .creator-bottom,body.kt-solo-fresh-active .live-prep{display:none!important}#screen{padding:0!important;margin:0!important;height:100dvh!important;background:#000!important;overflow:hidden!important}.bottom,.kt-bottom{display:none!important}'
      +'.kt-solo-fresh{position:relative;width:100%;height:100dvh;background:#000;color:#fff;overflow:hidden;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}'
      +'.kt-solo-fresh video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scaleX(-1);background:#111}'
      +'.ksf-top{position:absolute;z-index:5;left:12px;right:12px;top:calc(10px + env(safe-area-inset-top));display:flex;align-items:center;gap:8px}.ksf-live{font-weight:950;font-size:18px;text-shadow:0 1px 5px #000}.ksf-live b{color:#ff315f}.ksf-att{margin-left:auto;border:1px solid #ff55c9;background:#1c0c1dbf;color:#fff;border-radius:999px;padding:8px 12px;font-weight:900}.ksf-close{border:0;background:#111b;color:#fff;width:38px;height:38px;border-radius:50%;font-size:22px}'
      +'.ksf-chat{position:absolute;z-index:5;left:12px;right:78px;bottom:78px;max-height:150px;overflow:hidden;font-size:13px;font-weight:800;text-shadow:0 1px 4px #000}.ksf-chat div{margin:4px 0}'
      +'.ksf-bar{position:absolute;z-index:8;left:8px;right:8px;bottom:calc(10px + env(safe-area-inset-bottom));height:54px;display:flex;align-items:center;gap:7px}.ksf-input{flex:1;min-width:0;height:42px;border-radius:22px;border:1px solid #ffffff55;background:#161616c9;color:#fff;padding:0 15px;font-size:14px;outline:none}.ksf-icon{flex:0 0 42px;width:42px;height:42px;border-radius:50%;border:1px solid #ffffff42;background:#111c;color:#fff;font-size:21px;display:grid;place-items:center;padding:0}.ksf-gift img{width:25px;height:25px;object-fit:contain}'
      +'@media(max-width:390px){.ksf-bar{gap:4px;left:5px;right:5px}.ksf-icon{flex-basis:38px;width:38px;height:38px;font-size:19px}.ksf-input{height:40px;padding:0 11px}}'
      +'</style><section class="kt-solo-fresh"><video id="ktSoloFreshVideo" autoplay playsinline muted></video>'
      +'<div class="ksf-top"><div class="ksf-live"><b>● LIVE</b> · 1인 방송</div><button class="ksf-att" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()">출석체크</button><button class="ksf-close" onclick="if(window.leaveBroadcastToDashboard)leaveBroadcastToDashboard()">×</button></div>'
      +'<div id="ktSoloFreshChat" class="ksf-chat"></div>'
      +'<div class="ksf-bar"><input id="ktSoloFreshInput" class="ksf-input" placeholder="입력하세요..." onkeydown="if(event.key===\'Enter\')ktSoloFreshChat()">'
      +'<button class="ksf-icon" aria-label="사람" onclick="if(window.openGuestList)openGuestList()">👥</button>'
      +'<button class="ksf-icon" aria-label="장미" onclick="if(window.openGifts)openGifts()">🌹</button>'
      +'<button class="ksf-icon ksf-gift" aria-label="선물박스" onclick="if(window.openGifts)openGifts()"><img src="gift-box.svg" alt="선물"></button>'
      +'<button class="ksf-icon" aria-label="공유" onclick="if(window.shareApp)shareApp()">↗</button></div></section>';
    var v=document.getElementById("ktSoloFreshVideo");
    try{if(v&&window.state&&state.stream){v.srcObject=state.stream;var p=v.play();if(p&&p.catch)p.catch(function(){});}}catch(e){}
  }
  window.startBroadcast=async function(){
    if(!isSolo())return await old.apply(this,arguments);
    var ok=true;
    try{
      var live=!!(window.state&&state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks().some(function(t){return t.readyState==="live";}));
      if(!live&&window.ensureLiveCamera)ok=await window.ensureLiveCamera((state&&state.cameraFacing)||"user");
    }catch(e){ok=false;}
    if(ok!==false){render();setTimeout(hideLegacySoloUi,0);setTimeout(hideLegacySoloUi,120);setTimeout(hideLegacySoloUi,500);}
    return ok;
  };
})();