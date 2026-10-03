/* K-Talk: 노래가 재생되는 동안 승인 게스트 마이크만 자동 잠금.
   호스트/운영진은 제외. 노래 종료 시 게스트 마이크를 이전 상태로 복원.
   방 UI/배치/카메라/선물/채팅은 변경하지 않음. */
(function(){
  if(window.__ktSongGuestMicAutoLock20260928)return;
  window.__ktSongGuestMicAutoLock20260928=true;

  var REF='zupwbfmacwzexyvznlzq';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var BASE='https://'+REF+'.supabase.co/rest/v1/';
  var lastGuestControlId='';
  var savedTrackStates=[];
  var songLocked=false;
  var hookedAudio=null;
  var pollBusy=false;

  function enc(v){return encodeURIComponent(String(v==null?'':v));}

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }

  function isAdmin(){
    try{return typeof window.ktIsOwnerAdmin==='function'&&window.ktIsOwnerAdmin();}catch(e){return false;}
  }

  function isLocalHost(){
    try{
      return !!document.querySelector(
        '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,#screen .ktsubscriber-room,#screen .ktsecret-room'
      )&&!document.documentElement.classList.contains('kt-remote-viewing');
    }catch(e){return false;}
  }

  function remoteHostId(){
    var id='';
    try{id=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'').trim();}catch(e){}
    if(!id)try{id=String(sessionStorage.getItem('kt_remote_host_id')||'').trim();}catch(e){}
    return id;
  }

  function isApprovedGuest(){
    if(isLocalHost()||isAdmin())return false;
    try{
      if(document.querySelector('#screen .kt-guest-hostlike-room'))return true;
      if(document.querySelector('#screen .kt-approved-guest-grid'))return true;
      var vid='viewer_'+deviceId();
      return !!(window.__ktApprovedGuestIds20260924&&window.__ktApprovedGuestIds20260924[vid]);
    }catch(e){return false;}
  }

  function guestAudioTracks(){
    var streams=[];
    try{if(window.__ktApprovedGuestSelfStream)streams.push(window.__ktApprovedGuestSelfStream);}catch(e){}
    try{if(window.__ktLocalGuestCameraStream20260926)streams.push(window.__ktLocalGuestCameraStream20260926);}catch(e){}
    try{
      var v=document.querySelector(
        '#screen .kt-guest-hostlike-room .kgh-cell.self video,'+
        '#screen .kt-approved-guest-grid .kt-approved-guest-cell.self video'
      );
      if(v&&v.srcObject)streams.push(v.srcObject);
    }catch(e){}

    var seen={},tracks=[];
    streams.forEach(function(s){
      try{
        (s&&s.getAudioTracks?s.getAudioTracks():[]).forEach(function(t){
          if(!t||seen[t.id])return;
          seen[t.id]=1;tracks.push(t);
        });
      }catch(e){}
    });
    return tracks;
  }

  function lockGuestMic(){
    if(!isApprovedGuest()||isAdmin())return;
    var tracks=guestAudioTracks();
    if(!tracks.length)return;
    if(!songLocked){
      savedTrackStates=tracks.map(function(t){return {track:t,enabled:t.enabled!==false};});
    }
    tracks.forEach(function(t){try{t.enabled=false;}catch(e){}});
    songLocked=true;
  }

  function unlockGuestMic(){
    if(!songLocked)return;
    savedTrackStates.forEach(function(x){
      try{
        if(x&&x.track&&x.track.readyState!=='ended')x.track.enabled=!!x.enabled;
      }catch(e){}
    });
    savedTrackStates=[];
    songLocked=false;
  }

  async function postControl(lock){
    if(!isLocalHost()&&!isAdmin())return;
    var host=deviceId();
    var type=lock?'song_guest_mic_lock':'song_guest_mic_unlock';
    try{
      await fetch(BASE+'ktalk_live_messages',{
        method:'POST',
        headers:headers({Prefer:'return=minimal'}),
        body:JSON.stringify({
          host_id:host,
          sender_id:'songctl:'+host,
          sender_name:isAdmin()?'운영진':'호스트',
          message:lock?'노래 시작 · 게스트 마이크 잠금':'노래 종료 · 게스트 마이크 해제',
          message_type:type
        })
      });
    }catch(e){}
  }

  window.ktSongGuestMicLockStart=function(){
    postControl(true);
  };

  window.ktSongGuestMicLockEnd=function(){
    postControl(false);
  };

  function hookAudio(audio){
    if(!audio||audio===hookedAudio)return;
    hookedAudio=audio;
    var onPlay=function(){window.ktSongGuestMicLockStart();};
    var onStop=function(){window.ktSongGuestMicLockEnd();};
    try{
      audio.addEventListener('play',onPlay);
      audio.addEventListener('ended',onStop);
      audio.addEventListener('pause',onStop);
      audio.addEventListener('error',onStop);
      if(!audio.paused&&!audio.ended)onPlay();
    }catch(e){}
  }

  function hookSoundFunctions(){
    ['ktPlaySoundPreview','ktPlayRemoteSound'].forEach(function(name){
      var old=window[name];
      if(typeof old!=='function'||old.__ktSongGuestMicWrapped)return;
      var fn=function(){
        var r=old.apply(this,arguments);
        setTimeout(function(){try{hookAudio(window.ktSoundAudio);}catch(e){}},0);
        setTimeout(function(){try{hookAudio(window.ktSoundAudio);}catch(e){}},60);
        return r;
      };
      fn.__ktSongGuestMicWrapped=true;
      window[name]=fn;
    });

    var stop=window.ktStopSoundPreview;
    if(typeof stop==='function'&&!stop.__ktSongGuestMicWrapped){
      var sfn=function(){
        var r=stop.apply(this,arguments);
        try{window.ktSongGuestMicLockEnd();}catch(e){}
        return r;
      };
      sfn.__ktSongGuestMicWrapped=true;
      window.ktStopSoundPreview=sfn;
    }

    try{hookAudio(window.ktSoundAudio);}catch(e){}
  }

  async function pollGuestControl(){
    if(pollBusy||!isApprovedGuest()||isAdmin())return;
    var host=remoteHostId();
    if(!host)return;
    pollBusy=true;
    try{
      var since=new Date(Date.now()-30000).toISOString();
      var url=BASE+'ktalk_live_messages?select=id,message_type,created_at'
        +'&host_id=eq.'+enc(host)
        +'&message_type=in.'+enc('(song_guest_mic_lock,song_guest_mic_unlock)')
        +'&created_at=gte.'+enc(since)
        +'&order=created_at.desc&limit=1';
      var r=await fetch(url,{cache:'no-store',headers:headers()});
      if(r&&r.ok){
        var rows=await r.json();
        var row=rows&&rows[0];
        if(row){
          var id=String(row.id||'');
          if(id&&id!==lastGuestControlId){
            lastGuestControlId=id;
            if(String(row.message_type)==='song_guest_mic_lock')lockGuestMic();
            else if(String(row.message_type)==='song_guest_mic_unlock')unlockGuestMic();
          }
        }
      }
    }catch(e){}
    pollBusy=false;
  }

  hookSoundFunctions();
  [100,350,800,1600].forEach(function(ms){setTimeout(hookSoundFunctions,ms);});
  setInterval(hookSoundFunctions,800);
  setInterval(pollGuestControl,700);

  window.addEventListener('pagehide',function(){try{unlockGuestMic();}catch(e){}});
})();