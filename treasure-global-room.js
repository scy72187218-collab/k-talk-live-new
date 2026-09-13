/* K-Talk: 기존 보물상자 기능은 그대로 두고, 카메라 뒤집기만 실제 전면/후면 전환으로 보정. */
(function(){
  function loadTreasureCore(){
    var s=document.createElement('script');
    s.src='treasure-global-room-core.js?v=20260913-treasure3';
    s.async=false;
    document.head.appendChild(s);
  }

  function loadTreasureHostResults(){
    var s=document.createElement('script');
    s.src='treasure-host-results.js?v=20260911-hostresults1';
    s.async=false;
    document.head.appendChild(s);
  }

  function installRealCameraFlip(){
    if(window.__ktRealCameraFlipInstalled)return;
    if(typeof window.ktSoloFlipCamera!=='function')return;
    window.__ktRealCameraFlipInstalled=true;

    function setVideo(el,stream,facing){
      if(!el)return;
      try{
        el.srcObject=stream;
        el.muted=true;
        el.setAttribute('playsinline','');
        el.style.setProperty('transform',facing==='environment'?'none':'scaleX(-1)','important');
        var p=el.play();
        if(p&&p.catch)p.catch(function(){});
      }catch(e){}
    }

    async function getVideoStream(facing){
      try{
        return await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{exact:facing},width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30,max:30}},
          audio:false
        });
      }catch(e){
        return await navigator.mediaDevices.getUserMedia({
          video:{facingMode:{ideal:facing},width:{ideal:1280},height:{ideal:720},frameRate:{ideal:30,max:30}},
          audio:false
        });
      }
    }

    async function switchTo(facing){
      var oldStream=null;
      try{oldStream=window.state&&state.stream?state.stream:null;}catch(e){}
      var audioTracks=[];
      try{audioTracks=oldStream&&oldStream.getAudioTracks?oldStream.getAudioTracks().filter(function(t){return t.readyState==='live';}):[];}catch(e){}
      try{if(oldStream&&oldStream.getVideoTracks)oldStream.getVideoTracks().forEach(function(t){try{t.stop();}catch(e){}});}catch(e){}

      var fresh=await getVideoStream(facing);
      var videoTrack=fresh&&fresh.getVideoTracks?fresh.getVideoTracks()[0]:null;
      if(!videoTrack)throw new Error('camera track missing');

      var combined=new MediaStream();
      combined.addTrack(videoTrack);
      audioTracks.forEach(function(t){try{combined.addTrack(t);}catch(e){}});
      if(window.state){state.stream=combined;state.cameraFacing=facing;}

      try{if(typeof window.ktAttachCreatorCamera==='function')await window.ktAttachCreatorCamera(combined);}catch(e){}

      var seen=[];
      document.querySelectorAll('#ktLiveVideo,.ktsolo-main video,.ktg13-host video,.ktsubscriber-host video,.ktsecret-host video,.ktg9-host video').forEach(function(v){
        if(seen.indexOf(v)>-1)return;
        seen.push(v);
        setVideo(v,combined,facing);
      });
      try{if(window.camera)setVideo(window.camera,combined,facing);}catch(e){}
      return true;
    }

    window.ktSoloFlipCamera=async function(btn){
      if(btn&&btn.dataset.busy==='1')return;
      if(btn)btn.dataset.busy='1';
      var oldFacing='user';
      try{oldFacing=(window.state&&state.cameraFacing)||'user';}catch(e){}
      var next=oldFacing==='environment'?'user':'environment';
      try{
        await switchTo(next);
        if(btn){
          btn.title=next==='environment'?'전면 카메라로 바꾸기':'후면 카메라로 바꾸기';
          btn.setAttribute('aria-label','카메라 앞뒤 전환');
        }
      }catch(err){
        try{await switchTo(oldFacing);}catch(e){}
      }finally{
        if(btn)btn.dataset.busy='0';
      }
    };
  }

  /* 선물창 안의 보물상자만 분리: 10개/50개/100개를 각각 자기 수량으로 작동시킨다. */
  function installGiftTreasurePicks(){
    if(window.__ktGiftTreasureSeparateInstalled)return;
    if(typeof window.openGifts!=='function'||typeof window.selectTreasure!=='function')return;
    window.__ktGiftTreasureSeparateInstalled=true;

    if(!document.getElementById('ktGiftTreasureSeparateStyle')){
      var st=document.createElement('style');
      st.id='ktGiftTreasureSeparateStyle';
      st.textContent=''
        +'.kt-treasure-inside-gifts{margin:8px 10px 10px;padding:10px;border:1px solid rgba(255,208,71,.42);border-radius:14px;background:rgba(27,18,5,.74);color:#fff}'
        +'.kt-treasure-inside-gifts>div:first-child{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:8px}'
        +'.kt-treasure-inside-gifts b{font-size:13px;color:#ffe266}.kt-treasure-inside-gifts span{font-size:10px;color:#ddd}'
        +'.kt-treasure-inside-gifts .kt-treasure-amount-row{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}'
        +'.kt-treasure-inside-gifts button{height:42px;border:1px solid #ffd45b;border-radius:12px;background:linear-gradient(180deg,#3a2507,#171005);color:#fff;font-size:13px;font-weight:950;touch-action:manipulation}'
        +'.kt-treasure-inside-gifts button:active{transform:scale(.97)}';
      document.head.appendChild(st);
    }

    var oldOpenGifts=window.openGifts;
    window.openGifts=function(){
      var r=oldOpenGifts.apply(this,arguments);
      setTimeout(function(){
        var root=document.querySelector('.kt-gift-final');
        if(!root)return;

        /* 일반 선물처럼 처리되던 기존 보물상자 100개 카드는 숨기고 아래 전용 3버튼만 사용 */
        root.querySelectorAll('.kt-gift-final-card').forEach(function(card){
          var name=card.querySelector('b');
          if(name&&String(name.textContent||'').trim()==='보물상자'){
            card.style.setProperty('display','none','important');
            card.setAttribute('aria-hidden','true');
          }
        });

        if(root.querySelector('.kt-treasure-inside-gifts'))return;
        var box=document.createElement('div');
        box.className='kt-treasure-inside-gifts';
        box.innerHTML=''
          +'<div><b>🎁 보물상자</b><span>수량별로 각각 따로 작동</span></div>'
          +'<div class="kt-treasure-amount-row">'
            +'<button type="button" data-kt-treasure-amount="10">10개</button>'
            +'<button type="button" data-kt-treasure-amount="50">50개</button>'
            +'<button type="button" data-kt-treasure-amount="100">100개</button>'
          +'</div>';

        var foot=root.querySelector('.kt-gift-final-foot');
        if(foot)root.insertBefore(box,foot);else root.appendChild(box);

        box.addEventListener('click',function(e){
          var btn=e.target&&e.target.closest?e.target.closest('button[data-kt-treasure-amount]'):null;
          if(!btn)return;
          e.preventDefault();
          e.stopPropagation();
          var n=parseInt(btn.getAttribute('data-kt-treasure-amount'),10)||0;
          if(n!==10&&n!==50&&n!==100)return;
          if(typeof window.selectTreasure==='function')window.selectTreasure(n);
        });
      },0);
      return r;
    };
  }

  loadTreasureCore();
  loadTreasureHostResults();
  setTimeout(installRealCameraFlip,0);
  setTimeout(installRealCameraFlip,300);
  setTimeout(installRealCameraFlip,1000);
  setTimeout(installGiftTreasurePicks,0);
  setTimeout(installGiftTreasurePicks,300);
  setTimeout(installGiftTreasurePicks,1000);
})();
