/* K-Talk 파장만 복구: 올려준 사진처럼 무지개 파장을 사람마다 1개씩 표시. 다른 UI/기능 변경 없음. */
(function(){
  if(window.__ktParticipantPhotoWaveOnly20260915)return;
  window.__ktParticipantPhotoWaveOnly20260915=true;

  var style=document.createElement('style');
  style.id='ktParticipantPhotoWaveOnly20260915Style';
  style.textContent=''
    +'@keyframes ktParticipantPhotoWaveBeat{0%{transform:scaleY(.48)}45%{transform:scaleY(.82)}100%{transform:scaleY(1)}}'
    +'#screen .ktsolo-main,#screen .ktg13-host,#screen .ktg13-guest,#screen .ktsubscriber-host,#screen .ktsubscriber-guest,#screen .ktsecret-slot,#screen .ktsecret-guest-slot{position:relative!important;overflow:hidden!important}'
    +'#screen .kt-photo-participant-wave{position:absolute!important;left:0!important;right:0!important;bottom:0!important;height:42px!important;z-index:8!important;display:block!important;pointer-events:none!important;background:url("k-talk-rainbow-waveform.svg?v=20260915-photo-wave1") center bottom/100% 100% no-repeat!important;opacity:.98!important;transform-origin:center bottom!important;animation:ktParticipantPhotoWaveBeat .34s ease-in-out infinite alternate!important;filter:drop-shadow(0 0 5px rgba(255,45,220,.58))!important}'
    +'#screen .ktsolo-main>.kt-photo-participant-wave{bottom:34px!important;height:58px!important}'
    +'@media(max-width:390px){#screen .kt-photo-participant-wave{height:38px!important}#screen .ktsolo-main>.kt-photo-participant-wave{bottom:30px!important;height:54px!important}}';
  document.head.appendChild(style);

  function streamHasVideo(stream){
    try{return !!(stream&&stream.getVideoTracks&&stream.getVideoTracks().some(function(t){return t&&t.readyState==='live';}));}catch(e){return false;}
  }

  function videoHasPerson(v){
    try{
      if(!v)return false;
      if(streamHasVideo(v.srcObject))return true;
      if(!v.srcObject&&v.readyState>=2&&(v.currentSrc||v.src))return true;
    }catch(e){}
    return false;
  }

  function tileOccupied(tile,isLocalHost){
    if(!tile)return false;
    if(isLocalHost){
      try{if(window.state&&streamHasVideo(state.stream))return true;}catch(e){}
    }
    try{
      var d=tile.dataset||{};
      if(d.userId||d.guestId||d.participantId||d.liveUser||d.occupied==='1'||d.connected==='1')return true;
      var videos=tile.querySelectorAll('video');
      for(var i=0;i<videos.length;i++)if(videoHasPerson(videos[i]))return true;
      var img=tile.querySelector('img');
      if(img&&img.getAttribute('src')&&!tile.querySelector('.ktg13-guest-wait,.ktsubscriber-guest-wait,.ktsecret-guest-wait,.ktsecret-guest-waiting'))return true;
      if(isLocalHost&&tile.querySelector('video,img'))return true;
    }catch(e){}
    return false;
  }

  function directWave(tile){
    if(!tile)return null;
    for(var i=0;i<tile.children.length;i++){
      var c=tile.children[i];
      if(c.classList&&c.classList.contains('kt-photo-participant-wave'))return c;
    }
    return null;
  }

  function setWave(tile,on,index){
    if(!tile)return;
    var wave=directWave(tile);
    if(!on){if(wave)try{wave.remove();}catch(e){};return;}
    if(!wave){
      wave=document.createElement('div');
      wave.className='kt-photo-participant-wave';
      wave.setAttribute('aria-hidden','true');
      tile.appendChild(wave);
    }
    wave.style.animationDelay=(-((index%7)*0.04)).toFixed(2)+'s';
    wave.style.animationDuration=(0.28+((index%5)*0.025)).toFixed(3)+'s';
  }

  function sync(){
    var index=0;
    document.querySelectorAll('.ktsolo-room .ktsolo-main').forEach(function(tile){setWave(tile,tileOccupied(tile,true),index++);});
    document.querySelectorAll('.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest').forEach(function(tile){setWave(tile,tileOccupied(tile,tile.classList.contains('ktg13-host')),index++);});
    document.querySelectorAll('.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest').forEach(function(tile){setWave(tile,tileOccupied(tile,tile.classList.contains('ktsubscriber-host')),index++);});
    document.querySelectorAll('.ktsecret-room .ktsecret-slot,.ktsecret-room .ktsecret-guest-slot').forEach(function(tile){setWave(tile,tileOccupied(tile,tile.classList.contains('host')),index++);});
  }

  sync();
  [50,150,350,700,1200].forEach(function(ms){setTimeout(sync,ms);});
  setInterval(sync,900);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktParticipantPhotoWaveOnlyTimer20260915);
      window.__ktParticipantPhotoWaveOnlyTimer20260915=setTimeout(sync,35);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','class','data-user-id','data-guest-id','data-participant-id','data-live-user','data-occupied','data-connected']});
  }catch(e){}
})();

/* 요청한 다섯 방송방 파장 시각 스타일만 라디오형으로 통일. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktFiveRoomRadioWave20260915)return;
  window.__ktFiveRoomRadioWave20260915=true;
  var s=document.createElement('style');
  s.id='ktFiveRoomRadioWaveStyle20260915';
  s.textContent=''
    +'@keyframes ktFiveRoomRadioWaveBeat{0%{transform:scaleY(.72)}35%{transform:scaleY(1.05)}62%{transform:scaleY(.88)}100%{transform:scaleY(1.16)}}'
    +'#screen .ktsolo-wave,#screen .ktsecret-wave{position:absolute!important;left:8px!important;right:8px!important;bottom:8px!important;width:auto!important;height:58px!important;z-index:7!important;display:block!important;pointer-events:none!important;background:url("k-talk-rainbow-waveform.svg?v=20260915-radio5") center/100% 100% no-repeat!important;opacity:1!important;transform-origin:center center!important;animation:ktFiveRoomRadioWaveBeat .52s ease-in-out infinite alternate!important;filter:drop-shadow(0 0 7px rgba(255,36,208,.72)) drop-shadow(0 0 12px rgba(44,186,255,.28))!important}'
    +'#screen .ktsolo-wave>i,#screen .ktsecret-wave>i{display:none!important}'
    +'#screen .ktsolo-main>.kt-photo-participant-wave{bottom:8px!important;height:58px!important;opacity:.96!important;transform-origin:center center!important;filter:drop-shadow(0 0 6px rgba(255,36,208,.62))!important}'
    +'#screen .ktsubscriber-wave{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:100%!important;height:52px!important;min-height:52px!important;flex:0 0 52px!important;z-index:7!important;display:block!important;pointer-events:none!important;background:url("k-talk-rainbow-waveform.svg?v=20260915-radio5") center/100% 100% no-repeat!important;opacity:1!important;transform-origin:center center!important;animation:ktFiveRoomRadioWaveBeat .52s ease-in-out infinite alternate!important;filter:drop-shadow(0 0 7px rgba(255,36,208,.72)) drop-shadow(0 0 12px rgba(44,186,255,.28))!important}'
    +'#screen .ktsubscriber-wave>i{display:none!important}'
    +'#screen .ktg13-room:not([data-kt-room="15"]) .ktg13-main::after{content:""!important;position:absolute!important;left:4px!important;right:4px!important;bottom:2px!important;height:56px!important;z-index:8!important;pointer-events:none!important;background:url("k-talk-rainbow-waveform.svg?v=20260915-radio5") center/100% 100% no-repeat!important;opacity:1!important;transform-origin:center center!important;animation:ktFiveRoomRadioWaveBeat .52s ease-in-out infinite alternate!important;filter:drop-shadow(0 0 7px rgba(255,36,208,.72)) drop-shadow(0 0 12px rgba(44,186,255,.28))!important}'
    +'@media(max-width:390px){#screen .ktsolo-wave,#screen .ktsecret-wave{bottom:6px!important;height:54px!important}#screen .ktsolo-main>.kt-photo-participant-wave{bottom:6px!important;height:54px!important}#screen .ktsubscriber-wave{height:48px!important;min-height:48px!important;flex-basis:48px!important}#screen .ktg13-room:not([data-kt-room="15"]) .ktg13-main::after{height:50px!important}}';
  document.head.appendChild(s);
})();
