/* K-Talk 파장 자동 생성만 수정: 1인/9명/13명/구독자/비밀방에서 카메라가 열린 사람 칸에만 사진처럼 촘촘한 무지개 막대 파장을 각각 따로 움직이게 표시. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktAutoParticipantWaveV10)return;
  window.__ktAutoParticipantWaveV10=true;

  function addStyle(){
    if(document.getElementById('ktAutoParticipantWaveV10Style'))return;
    var s=document.createElement('style');
    s.id='ktAutoParticipantWaveV10Style';
    s.textContent=`
      @keyframes ktAutoParticipantBarMove{
        0%{transform:scaleY(var(--kt-bar-min,.22))}
        35%{transform:scaleY(var(--kt-bar-mid,.62))}
        68%{transform:scaleY(var(--kt-bar-max,.94))}
        100%{transform:scaleY(var(--kt-bar-end,.42))}
      }

      /* 기존 비밀방 게스트6 빈칸 배치는 그대로 유지 */
      html body #screen .ktsecret-room .ktsecret-extra-pair{
        display:grid!important;
        grid-template-columns:minmax(0,1fr)!important;
        grid-template-rows:repeat(2,minmax(0,1fr))!important;
        gap:2px!important;
        min-width:0!important;
        min-height:0!important;
        overflow:hidden!important;
      }
      html body #screen .ktsecret-room .ktsecret-extra-pair>.ktsecret-slot{
        width:100%!important;
        height:100%!important;
        min-width:0!important;
        min-height:0!important;
      }

      /* 기존 아래쪽 공용 파장만 숨김. 사람 칸 파장만 사용 */
      html body #screen .ktsubscriber-room .ktsubscriber-wave,
      html body #screen .ktsecret-room .ktsecret-wave,
      html body #screen .ktsecret-room .kt-secret-wave,
      html body #screen .ktsecret-room .secret-wave,
      html body #screen .ktg13-main>.ktg13-wave-bars,
      html body #screen .ktg13-main .ktg13-wave-bars,
      html body #screen .ktsubscriber-room .kt-person-live-wave,
      html body #screen .ktsecret-room .kt-person-live-wave{
        display:none!important;
        animation:none!important;
      }
      html body #screen .ktg13-main::after{content:none!important;display:none!important}

      /* 파장은 카메라가 열린 사람 칸 안쪽 아래에만 표시 */
      html body #screen .ktsolo-main,
      html body #screen .ktg13-host,
      html body #screen .ktg13-guest,
      html body #screen .ktsubscriber-host,
      html body #screen .ktsubscriber-guest,
      html body #screen .ktsecret-slot,
      html body #screen .ktsecret-guest-slot{position:relative!important;overflow:hidden!important}

      html body #screen .ktsolo-main>.kt-open-camera-wave,
      html body #screen .ktg13-host>.kt-open-camera-wave,
      html body #screen .ktg13-guest>.kt-open-camera-wave,
      html body #screen .ktsubscriber-host>.kt-open-camera-wave,
      html body #screen .ktsubscriber-guest>.kt-open-camera-wave,
      html body #screen .ktsecret-slot>.kt-open-camera-wave,
      html body #screen .ktsecret-guest-slot>.kt-open-camera-wave{
        position:absolute!important;
        left:2px!important;
        right:2px!important;
        width:auto!important;
        z-index:8!important;
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        gap:1px!important;
        padding:0 1px!important;
        overflow:hidden!important;
        pointer-events:none!important;
        opacity:1!important;
        background:none!important;
        filter:drop-shadow(0 0 3px rgba(255,45,220,.62))!important;
        animation:none!important;
      }
      html body #screen .ktsolo-main>.kt-open-camera-wave{bottom:36px!important;height:62px!important}
      html body #screen .ktg13-host>.kt-open-camera-wave,
      html body #screen .ktg13-guest>.kt-open-camera-wave,
      html body #screen .ktsubscriber-host>.kt-open-camera-wave,
      html body #screen .ktsubscriber-guest>.kt-open-camera-wave,
      html body #screen .ktsecret-slot>.kt-open-camera-wave,
      html body #screen .ktsecret-guest-slot>.kt-open-camera-wave{bottom:0!important;height:44px!important}

      html body #screen .kt-open-camera-wave:before{content:none!important;display:none!important}
      html body #screen .kt-open-camera-wave i{
        display:block!important;
        flex:1 1 0!important;
        min-width:1px!important;
        max-width:4px!important;
        height:100%!important;
        margin:0!important;
        border-radius:999px!important;
        transform-origin:center center!important;
        will-change:transform!important;
        box-shadow:0 0 3px currentColor!important;
        animation:ktAutoParticipantBarMove var(--kt-bar-speed,.28s) ease-in-out var(--kt-bar-delay,0s) infinite alternate!important;
      }

      @media(max-width:390px){
        html body #screen .ktsolo-main>.kt-open-camera-wave{bottom:30px!important;height:58px!important}
        html body #screen .ktg13-host>.kt-open-camera-wave,
        html body #screen .ktg13-guest>.kt-open-camera-wave,
        html body #screen .ktsubscriber-host>.kt-open-camera-wave,
        html body #screen .ktsubscriber-guest>.kt-open-camera-wave,
        html body #screen .ktsecret-slot>.kt-open-camera-wave,
        html body #screen .ktsecret-guest-slot>.kt-open-camera-wave{height:40px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function trackCameraOpen(stream){
    try{
      if(!stream||!stream.getVideoTracks)return false;
      var tracks=stream.getVideoTracks();
      if(!tracks||!tracks.length)return false;
      return tracks.some(function(t){return t&&t.readyState==='live'&&t.enabled!==false;});
    }catch(e){return false;}
  }

  function explicitCameraState(tile){
    if(!tile)return null;
    try{
      if(tile.classList.contains('kt-camera-locked'))return false;
      var v=tile.querySelector('video');
      if(v&&v.dataset&&v.dataset.kt913CameraLocked==='1')return false;
      if(v&&v.style&&v.style.visibility==='hidden')return false;
      var btn=tile.querySelector(':scope > .kt-inside-av-controls .kt-inside-camera');
      if(btn){
        if(btn.dataset.off==='1'||btn.classList.contains('off'))return false;
        if(btn.dataset.off==='0')return true;
      }
      var roomBtn=tile.querySelector(':scope > .kt-room-camera-toggle,:scope > .kt-host-camera-toggle,:scope > .kt-913-camera');
      if(roomBtn){
        if(roomBtn.classList.contains('locked')||roomBtn.dataset.locked==='1')return false;
        if(roomBtn.dataset.locked==='0')return true;
      }
    }catch(e){}
    return null;
  }

  function tileCameraOpen(tile,localHost){
    if(!tile)return false;
    var explicit=explicitCameraState(tile);
    if(explicit===false)return false;

    if(localHost){
      try{
        if(window.state&&trackCameraOpen(state.stream))return true;
      }catch(e){}
    }

    try{
      var videos=tile.querySelectorAll('video');
      for(var i=0;i<videos.length;i++){
        var v=videos[i];
        if(v.dataset&&v.dataset.kt913CameraLocked==='1')continue;
        if(v.style&&v.style.visibility==='hidden')continue;
        if(trackCameraOpen(v.srcObject))return true;
        if(!v.srcObject&&v.readyState>=2&&!!(v.currentSrc||v.src))return true;
      }
    }catch(e){}

    return explicit===true;
  }

  function ensureSecretSeventhSlot(){
    var grid=document.querySelector('.ktsecret-room .ktsecret-six-grid');
    if(!grid)return;
    if(grid.querySelector(':scope > .ktsecret-extra-pair'))return;
    var slots=[].slice.call(grid.querySelectorAll(':scope > .ktsecret-slot'));
    if(slots.length<6)return;
    var last=slots[slots.length-1];
    var pair=document.createElement('div');
    pair.className='ktsecret-extra-pair';
    grid.insertBefore(pair,last);
    pair.appendChild(last);
    var extra=document.createElement('div');
    extra.className='ktsecret-slot ktsecret-extra-slot';
    extra.innerHTML='<div class="ktsecret-guest-wait"><b>+</b><span>게스트 6</span></div>';
    pair.appendChild(extra);
  }

  function directWaves(tile){
    var out=[];
    if(!tile)return out;
    for(var i=0;i<tile.children.length;i++){
      var c=tile.children[i];
      if(c.classList&&c.classList.contains('kt-open-camera-wave'))out.push(c);
    }
    return out;
  }

  function buildBars(wave,index){
    var count=48;
    if(wave.dataset.ktBars==='48'&&wave.children.length===count)return;
    wave.innerHTML='';
    wave.dataset.ktBars='48';
    for(var i=0;i<count;i++){
      var bar=document.createElement('i');
      var hue=(318+(i*7.45))%360;
      var min=(0.14+((i*13+index*3)%22)/100).toFixed(2);
      var mid=(0.42+((i*9+index*5)%34)/100).toFixed(2);
      var max=(0.66+((i*17+index*7)%31)/100).toFixed(2);
      var end=(0.22+((i*11+index*2)%32)/100).toFixed(2);
      var speed=(0.20+((i*7+index)%12)/100).toFixed(2)+'s';
      var delay=(-((i*5+index*3)%22)/100).toFixed(2)+'s';
      bar.style.setProperty('--kt-bar-min',min);
      bar.style.setProperty('--kt-bar-mid',mid);
      bar.style.setProperty('--kt-bar-max',max);
      bar.style.setProperty('--kt-bar-end',end);
      bar.style.setProperty('--kt-bar-speed',speed);
      bar.style.setProperty('--kt-bar-delay',delay);
      bar.style.background='hsl('+hue+' 100% 56%)';
      bar.style.color='hsl('+hue+' 100% 56%)';
      wave.appendChild(bar);
    }
  }

  function setOneWave(tile,on,index){
    if(!tile)return;
    var waves=directWaves(tile);
    if(!on){
      waves.forEach(function(w){try{w.remove();}catch(e){}});
      return;
    }
    var wave=waves.shift();
    waves.forEach(function(extra){try{extra.remove();}catch(e){}});
    if(!wave){
      wave=document.createElement('div');
      wave.className='kt-open-camera-wave';
      wave.setAttribute('aria-hidden','true');
      tile.appendChild(wave);
    }
    buildBars(wave,index);
  }

  function sync(){
    addStyle();
    ensureSecretSeventhSlot();
    var idx=0;

    /* 1인방: 호스트 카메라가 열려 있을 때만 파장 */
    document.querySelectorAll('.ktsolo-room .ktsolo-main').forEach(function(tile){
      setOneWave(tile,tileCameraOpen(tile,true),idx++);
    });

    /* 9명방·13명방: 호스트/게스트 각각 카메라가 열린 칸만 파장 */
    document.querySelectorAll('.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest').forEach(function(tile){
      var host=tile.classList.contains('ktg13-host');
      setOneWave(tile,tileCameraOpen(tile,host),idx++);
    });

    /* 구독자방: 호스트/게스트 각각 카메라가 열린 칸만 파장 */
    document.querySelectorAll('.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest').forEach(function(tile){
      var host=tile.classList.contains('ktsubscriber-host');
      setOneWave(tile,tileCameraOpen(tile,host),idx++);
    });

    /* 비밀방: 호스트/게스트 각각 카메라가 열린 칸만 파장 */
    document.querySelectorAll('.ktsecret-room .ktsecret-slot,.ktsecret-room .ktsecret-guest-slot').forEach(function(tile){
      var host=tile.classList.contains('host');
      setOneWave(tile,tileCameraOpen(tile,host),idx++);
    });
  }

  sync();
  [50,120,260,500,900,1500].forEach(function(ms){setTimeout(sync,ms);});
  setInterval(sync,900);
  document.addEventListener('play',function(e){if(e.target&&e.target.tagName==='VIDEO')setTimeout(sync,0);},true);
  document.addEventListener('loadeddata',function(e){if(e.target&&e.target.tagName==='VIDEO')setTimeout(sync,0);},true);
  document.addEventListener('emptied',function(e){if(e.target&&e.target.tagName==='VIDEO')setTimeout(sync,0);},true);
  document.addEventListener('click',function(e){
    if(e.target&&e.target.closest&&e.target.closest('.kt-inside-camera,.kt-room-camera-toggle,.kt-host-camera-toggle,.kt-913-camera'))setTimeout(sync,40);
  },true);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktAutoParticipantWaveTimerV10);
      window.__ktAutoParticipantWaveTimerV10=setTimeout(sync,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','class','style','data-off','data-locked','data-user-id','data-guest-id','data-participant-id','data-live-user','data-occupied','data-connected']});
  }catch(e){}
})();
