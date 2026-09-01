(function(){
  var testMessages=[];

  function stopLocalStream(){
    try{
      if(window.state && state.stream){
        state.stream.getTracks().forEach(function(track){track.stop();});
        state.stream=null;
      }
      if(window.camera)camera.srcObject=null;
    }catch(e){}
  }

  function renderMessages(){
    var box=document.getElementById('ktTestChatList');
    if(!box)return;
    box.innerHTML=testMessages.map(function(m){
      return '<div style="margin:5px 0;padding:7px 9px;border-radius:12px;background:#ffffff12;color:#fff;font-size:13px"><b style="color:#ffdc70">'+m.name+'</b> '+m.text+'</div>';
    }).join('');
    box.scrollTop=box.scrollHeight;
  }

  window.sendTestChat=function(){
    var input=document.getElementById('ktTestChatInput');
    if(!input)return;
    var text=input.value.trim();
    if(!text)return;
    testMessages.push({name:'나',text:text});
    input.value='';
    renderMessages();
  };

  window.toggleTestMic=function(btn){
    try{
      var tracks=state.stream?state.stream.getAudioTracks():[];
      if(!tracks.length)return;
      tracks.forEach(function(t){t.enabled=!t.enabled;});
      btn.textContent=tracks[0].enabled?'🎤 마이크':'🔇 음소거';
    }catch(e){}
  };

  window.toggleTestCamera=function(btn){
    try{
      var tracks=state.stream?state.stream.getVideoTracks():[];
      if(!tracks.length)return;
      tracks.forEach(function(t){t.enabled=!t.enabled;});
      btn.textContent=tracks[0].enabled?'📷 카메라':'🚫 카메라';
    }catch(e){}
  };

  window.endTestBroadcast=function(){
    stopLocalStream();
    testMessages=[];
    if(window.home)window.home();
  };

  window.startBroadcast=async function(){
    var titleEl=document.getElementById('liveTitle');
    var title=titleEl&&titleEl.value?titleEl.value:'K-Talk 테스트 방송';
    var ok=true;
    if(window.ensureLiveCamera){
      ok=await window.ensureLiveCamera((window.state&&state.cameraFacing)||'user');
    }

    if(window.creator)creator.classList.remove('show');
    document.body.classList.remove('kt-home');

    testMessages=[
      {name:'K-Talk',text:'테스트 방송방입니다. 실제 외부 송출은 되지 않습니다.'},
      {name:'시청자1',text:'채팅 화면 확인 중입니다.'}
    ];

    screen.innerHTML='<section style="height:100dvh;min-height:620px;position:relative;overflow:hidden;background:#050309;color:#fff">'
      +'<div style="position:absolute;inset:0;background:radial-gradient(circle at 25% 20%,#4c124f55,transparent 32%),radial-gradient(circle at 80% 30%,#0f497755,transparent 30%),#050309"></div>'
      +'<video id="ktTestVideo" autoplay playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#09070d"></video>'
      +'<div style="position:absolute;inset:0;background:linear-gradient(180deg,#00000055,transparent 35%,#00000022 58%,#000000dd 100%);pointer-events:none"></div>'
      +'<div style="position:absolute;left:12px;right:12px;top:12px;z-index:3;display:flex;align-items:center;gap:8px">'
      +'<span style="padding:7px 10px;border-radius:999px;background:#ff315f;font-size:12px;font-weight:950">● TEST LIVE</span>'
      +'<div style="min-width:0;flex:1"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+title.replace(/</g,'&lt;')+'</b><small style="color:#ddd">외부 송출 없음 · 내 화면 테스트</small></div>'
      +'<button onclick="endTestBroadcast()" style="width:40px;height:40px;border-radius:50%;border:1px solid #ffffff44;background:#111a;color:#fff;font-size:20px">×</button>'
      +'</div>'
      +'<div style="position:absolute;right:10px;bottom:118px;z-index:4;display:grid;gap:9px">'
      +'<button onclick="openGifts()" style="width:52px;height:52px;border-radius:50%;border:1px solid #ffd65a88;background:#2b1c08dd;color:#fff;font-size:22px">🎁</button>'
      +'<button onclick="toggleTestMic(this)" style="width:52px;height:52px;border-radius:50%;border:1px solid #ffffff38;background:#09090ddd;color:#fff;font-size:12px;font-weight:900">🎤 마이크</button>'
      +'<button onclick="toggleTestCamera(this)" style="width:52px;height:52px;border-radius:50%;border:1px solid #ffffff38;background:#09090ddd;color:#fff;font-size:12px;font-weight:900">📷 카메라</button>'
      +'</div>'
      +'<div style="position:absolute;left:10px;right:72px;bottom:78px;z-index:4">'
      +'<div id="ktTestChatList" style="max-height:155px;overflow:auto;padding-right:3px"></div>'
      +'</div>'
      +'<div style="position:absolute;left:10px;right:10px;bottom:14px;z-index:5;display:flex;gap:8px;align-items:center">'
      +'<input id="ktTestChatInput" onkeydown="if(event.key===\'Enter\')sendTestChat()" placeholder="테스트 채팅 입력" style="flex:1;min-width:0;height:48px;border-radius:24px;border:1px solid #ffffff33;background:#0c0b10dd;color:#fff;padding:0 16px;outline:0;font-size:14px">'
      +'<button onclick="sendTestChat()" style="height:48px;padding:0 18px;border:0;border-radius:24px;background:linear-gradient(135deg,#ff3f8f,#875dff);color:#fff;font-weight:950">전송</button>'
      +'<button onclick="endTestBroadcast()" style="height:48px;padding:0 14px;border:0;border-radius:24px;background:#e02d4c;color:#fff;font-weight:950">종료</button>'
      +'</div>'
      +'</section>';

    var video=document.getElementById('ktTestVideo');
    if(ok && video && window.state && state.stream){
      video.srcObject=state.stream;
      try{await video.play();}catch(e){}
    }else if(video){
      video.style.display='none';
      var fallback=document.createElement('div');
      fallback.style.cssText='position:absolute;inset:0;display:grid;place-items:center;text-align:center;color:#fff;background:radial-gradient(circle,#51245f,#111018 58%,#060608);font-size:18px;font-weight:900';
      fallback.innerHTML='📷<br><span style="font-size:14px;color:#ddd">카메라 권한이 없으면 이 배경으로 테스트합니다.</span>';
      video.parentNode.insertBefore(fallback,video.nextSibling);
    }
    renderMessages();
  };
})();
