/* K-Talk 파장만 수정: 13명방은 그대로 두고 1인/구독자/비밀방도 13명방 방식처럼 사람(카메라) 칸마다 파장 1개만 표시. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktMatchGroup13WaveV3)return;
  window.__ktMatchGroup13WaveV3=true;

  function addStyle(){
    var old=document.getElementById('ktMatchGroup13WaveV3Style');
    if(old)return;
    var s=document.createElement('style');
    s.id='ktMatchGroup13WaveV3Style';
    s.textContent=`
      @keyframes ktMatch13WaveMove{0%{transform:scaleY(.52)}45%{transform:scaleY(.82)}100%{transform:scaleY(1)}}

      /* 1인/구독자/비밀방의 아래쪽 공용 파장과 이전 임시 파장만 숨긴다. 13명방은 건드리지 않는다. */
      html body #screen .ktsolo-room .ktsolo-wave,
      html body #screen .ktsubscriber-room .ktsubscriber-wave,
      html body #screen .ktsecret-room .ktsecret-wave,
      html body #screen .ktsecret-room .kt-secret-wave,
      html body #screen .ktsecret-room .secret-wave,
      html body #screen .ktsolo-room .kt-person-live-wave,
      html body #screen .ktsubscriber-room .kt-person-live-wave,
      html body #screen .ktsecret-room .kt-person-live-wave{
        display:none!important;
        animation:none!important;
      }

      /* 13명방에서 보이는 카메라 파장과 같은 모양/움직임 */
      html body #screen .ktsolo-main>.kt-open-camera-wave,
      html body #screen .ktsubscriber-host>.kt-open-camera-wave,
      html body #screen .ktsubscriber-guest>.kt-open-camera-wave,
      html body #screen .ktsecret-slot>.kt-open-camera-wave,
      html body #screen .ktsecret-guest-slot>.kt-open-camera-wave{
        position:absolute!important;
        left:0!important;
        right:0!important;
        bottom:0!important;
        width:auto!important;
        height:42px!important;
        z-index:6!important;
        display:block!important;
        padding:0!important;
        overflow:hidden!important;
        pointer-events:none!important;
        opacity:.98!important;
        background:none!important;
        filter:drop-shadow(0 0 5px rgba(255,45,220,.55))!important;
        animation:none!important;
      }
      html body #screen .ktsolo-main>.kt-open-camera-wave:before,
      html body #screen .ktsubscriber-host>.kt-open-camera-wave:before,
      html body #screen .ktsubscriber-guest>.kt-open-camera-wave:before,
      html body #screen .ktsecret-slot>.kt-open-camera-wave:before,
      html body #screen .ktsecret-guest-slot>.kt-open-camera-wave:before{
        content:""!important;
        position:absolute!important;
        left:0!important;
        right:0!important;
        top:0!important;
        bottom:0!important;
        background-image:url("k-talk-rainbow-waveform.svg?v=20260911-wave10")!important;
        background-repeat:no-repeat!important;
        background-position:center bottom!important;
        background-size:100% 100%!important;
        transform-origin:center bottom!important;
        will-change:transform!important;
        animation:ktMatch13WaveMove var(--kt-wave-speed,.22s) ease-in-out var(--kt-wave-delay,0s) infinite alternate!important;
      }
      html body #screen .ktsolo-main>.kt-open-camera-wave i,
      html body #screen .ktsubscriber-host>.kt-open-camera-wave i,
      html body #screen .ktsubscriber-guest>.kt-open-camera-wave i,
      html body #screen .ktsecret-slot>.kt-open-camera-wave i,
      html body #screen .ktsecret-guest-slot>.kt-open-camera-wave i{display:none!important}

      /* 1인방은 선물칸 바로 위가 카메라의 보이는 아래쪽이므로 그 위치만 유지 */
      html body #screen .ktsolo-main>.kt-open-camera-wave{bottom:66px!important;height:58px!important}

      @media(max-width:390px){
        html body #screen .ktsolo-main>.kt-open-camera-wave{bottom:60px!important;height:54px!important}
        html body #screen .ktsubscriber-host>.kt-open-camera-wave,
        html body #screen .ktsubscriber-guest>.kt-open-camera-wave,
        html body #screen .ktsecret-slot>.kt-open-camera-wave,
        html body #screen .ktsecret-guest-slot>.kt-open-camera-wave{height:38px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function liveVideo(v){
    if(!v||!v.isConnected)return false;
    try{
      var st=v.srcObject;
      if(st&&st.getVideoTracks){
        var tr=st.getVideoTracks();
        for(var i=0;i<tr.length;i++)if(tr[i]&&tr[i].readyState==='live'&&tr[i].enabled!==false)return true;
      }
    }catch(e){}
    try{return v.readyState>=2&&!!(v.currentSrc||v.src);}catch(e){return false;}
  }

  function tileHasPerson(tile){
    if(!tile)return false;
    var videos=tile.querySelectorAll('video');
    for(var i=0;i<videos.length;i++)if(liveVideo(videos[i]))return true;
    /* 13명방처럼 실제 사람 사진이 들어온 게스트 칸도 열린 사람 칸으로 본다. */
    var photo=tile.querySelector('img.ktsecret-guest-photo,img.ktsubscriber-guest-photo,img[data-kt-live-person]');
    return !!(photo&&photo.getAttribute('src'));
  }

  function removeLegacyPersonWave(){
    document.querySelectorAll('.ktsolo-room .kt-person-live-wave,.ktsubscriber-room .kt-person-live-wave,.ktsecret-room .kt-person-live-wave').forEach(function(w){try{w.remove();}catch(e){}});
  }

  function setOneWave(tile,on,index){
    if(!tile)return;
    var waves=[].slice.call(tile.querySelectorAll(':scope > .kt-open-camera-wave'));
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
    wave.innerHTML='';
    var speeds=['.18s','.21s','.24s','.19s','.23s','.20s'];
    var delays=['-.03s','-.11s','-.17s','-.07s','-.14s','-.20s'];
    wave.style.setProperty('--kt-wave-speed',speeds[index%speeds.length]);
    wave.style.setProperty('--kt-wave-delay',delays[index%delays.length]);
  }

  function sync(){
    addStyle();
    removeLegacyPersonWave();
    var idx=0;
    /* 13명방은 손대지 않는다. */
    document.querySelectorAll('.ktsolo-room .ktsolo-main').forEach(function(tile){setOneWave(tile,tileHasPerson(tile),idx++);});
    document.querySelectorAll('.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest').forEach(function(tile){setOneWave(tile,tileHasPerson(tile),idx++);});
    document.querySelectorAll('.ktsecret-room .ktsecret-slot,.ktsecret-room .ktsecret-guest-slot').forEach(function(tile){setOneWave(tile,tileHasPerson(tile),idx++);});
  }

  sync();
  [80,220,500,900].forEach(function(ms){setTimeout(sync,ms);});
  document.addEventListener('play',function(e){if(e.target&&e.target.tagName==='VIDEO')setTimeout(sync,0);},true);
  document.addEventListener('loadeddata',function(e){if(e.target&&e.target.tagName==='VIDEO')setTimeout(sync,0);},true);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktMatchGroup13WaveTimer);
      window.__ktMatchGroup13WaveTimer=setTimeout(sync,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
