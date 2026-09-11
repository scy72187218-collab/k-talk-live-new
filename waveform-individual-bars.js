/* K-Talk 파장 위치만 수정: 13명방은 그대로 두고, 1인/구독자/비밀방에서 카메라가 실제로 열린 사람 칸에만 현재 무지개 파장을 표시. 다른 UI/기능은 건드리지 않음. */
(function(){
  if(window.__ktActiveCameraWavePlacementInstalled)return;
  window.__ktActiveCameraWavePlacementInstalled=true;

  function addStyle(){
    if(document.getElementById('ktActiveCameraWavePlacementStyle'))return;
    var s=document.createElement('style');
    s.id='ktActiveCameraWavePlacementStyle';
    s.textContent=`
      /* 기존 아래쪽 공용 파장은 1인/구독자/비밀방에서만 숨긴다. 13명방은 절대 건드리지 않는다. */
      html body .ktsolo-room .ktsolo-wave,
      html body .ktsubscriber-room .ktsubscriber-wave,
      html body .ktsecret-room .ktsecret-wave,
      html body .ktsecret-room .kt-secret-wave,
      html body .ktsecret-room .secret-wave{
        display:none!important;
      }

      /* 지금 사용 중인 무지개 파장을 카메라가 켜진 사람 칸 위에만 표시한다. */
      html body .ktsolo-main > .kt-person-live-wave,
      html body .ktsubscriber-host > .kt-person-live-wave,
      html body .ktsubscriber-guest > .kt-person-live-wave,
      html body .ktsecret-slot > .kt-person-live-wave,
      html body .ktsecret-guest-slot > .kt-person-live-wave{
        position:absolute!important;
        left:0!important;
        right:0!important;
        bottom:0!important;
        width:auto!important;
        height:42px!important;
        z-index:6!important;
        display:block!important;
        pointer-events:none!important;
        overflow:hidden!important;
        opacity:.98!important;
        background-image:url("k-talk-rainbow-waveform.svg?v=20260911-wave10")!important;
        background-repeat:no-repeat!important;
        background-position:center bottom!important;
        background-size:100% 100%!important;
        transform-origin:center bottom!important;
        animation:ktRainbowWaveBeat .62s ease-in-out infinite alternate!important;
        filter:drop-shadow(0 0 5px rgba(255,45,220,.55))!important;
      }

      html body .ktsolo-main > .kt-person-live-wave{
        bottom:66px!important;
        height:58px!important;
      }

      @media(max-width:390px){
        html body .ktsolo-main > .kt-person-live-wave{bottom:60px!important;height:54px!important}
        html body .ktsubscriber-host > .kt-person-live-wave,
        html body .ktsubscriber-guest > .kt-person-live-wave,
        html body .ktsecret-slot > .kt-person-live-wave,
        html body .ktsecret-guest-slot > .kt-person-live-wave{height:38px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function hasLiveVideo(video){
    if(!video||!video.isConnected)return false;
    try{
      var stream=video.srcObject;
      if(stream&&stream.getVideoTracks){
        var tracks=stream.getVideoTracks();
        for(var i=0;i<tracks.length;i++){
          if(tracks[i]&&tracks[i].readyState==='live'&&tracks[i].enabled!==false)return true;
        }
        return false;
      }
    }catch(e){}
    try{
      return video.readyState>=2&&!video.paused&&!video.ended&&!!(video.currentSrc||video.src);
    }catch(e){return false;}
  }

  function setWave(tile,on){
    if(!tile)return;
    var wave=null;
    try{wave=tile.querySelector(':scope > .kt-person-live-wave');}catch(e){wave=tile.querySelector('.kt-person-live-wave');}
    if(on){
      if(!wave){
        wave=document.createElement('div');
        wave.className='kt-person-live-wave';
        wave.setAttribute('aria-hidden','true');
        tile.appendChild(wave);
      }
    }else if(wave){
      try{wave.remove();}catch(e){if(wave.parentNode)wave.parentNode.removeChild(wave);}
    }
  }

  function syncTile(tile){
    if(!tile)return;
    var video=tile.querySelector('video');
    setWave(tile,hasLiveVideo(video));
  }

  function sync(){
    addStyle();

    /* 1인방: 호스트 카메라가 켜졌을 때만 */
    document.querySelectorAll('.ktsolo-room .ktsolo-main').forEach(syncTile);

    /* 구독자방: 호스트/게스트 중 실제 카메라 영상이 열린 칸만 */
    document.querySelectorAll('.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest').forEach(syncTile);

    /* 비밀방: 호스트/게스트 중 실제 카메라 영상이 열린 칸만 */
    document.querySelectorAll('.ktsecret-room .ktsecret-slot,.ktsecret-room .ktsecret-guest-slot').forEach(syncTile);
  }

  addStyle();
  sync();
  setTimeout(sync,80);
  setTimeout(sync,250);
  setTimeout(sync,700);

  document.addEventListener('play',function(e){
    var v=e.target;
    if(v&&v.tagName==='VIDEO')setTimeout(sync,0);
  },true);

  document.addEventListener('loadeddata',function(e){
    var v=e.target;
    if(v&&v.tagName==='VIDEO')setTimeout(sync,0);
  },true);

  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktActiveCameraWavePlacementTimer);
      window.__ktActiveCameraWavePlacementTimer=setTimeout(sync,20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
