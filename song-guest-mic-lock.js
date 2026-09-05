/* K-Talk LIVE: while a host song is playing, lock ordinary guest microphones only.
   Host and staff microphones stay available. When the song ends, guest mics restore automatically. */
(function(){
  if(window.__ktSongGuestMicLockLoaded)return;
  window.__ktSongGuestMicLockLoaded=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var hostSongActive=false;
  var guestStream=null;
  var guestMicBeforeLock=null;
  var lastGuestLocked=null;
  var syncBusy=false;

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY};
    if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});
    return h;
  }

  function hostId(){
    var id='guest';
    try{id=(window.state&&(state.profileId||state.currentAccountId||state.accountId))||id;}catch(e){}
    try{id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    return String(id||'guest').slice(0,80);
  }

  function viewerId(){
    var id='';
    try{id=localStorage.getItem('ktalk_viewer_id')||'';}catch(e){}
    return String(id||'').slice(0,80);
  }

  function isStaff(){
    var vals=[];
    try{
      if(window.state){
        vals.push(state.role,state.userRole,state.accountRole,state.memberRole,state.grade,state.memberGrade,state.levelName);
      }
    }catch(e){}
    try{
      ['ktalk_role','ktalk_user_role','ktalk_account_role','ktalk_member_role','ktalk_grade','ktalk_member_grade','ktalk_level_name'].forEach(function(k){vals.push(localStorage.getItem(k));});
    }catch(e){}
    var s=vals.filter(Boolean).join(' ').toLowerCase();
    return s.indexOf('운영')>-1||s.indexOf('관리')>-1||s.indexOf('최고')>-1||s.indexOf('admin')>-1||s.indexOf('operator')>-1||s.indexOf('staff')>-1||s.indexOf('moderator')>-1;
  }

  function isHostRoom(){
    return !!document.getElementById('ktSept2Live')&&!document.getElementById('ktRemoteLive');
  }

  function isGuestViewer(){
    return !!document.getElementById('ktRemoteLive');
  }

  function isSongAudio(a){
    if(!a||String(a.tagName).toUpperCase()!=='AUDIO')return false;
    var src=String(a.currentSrc||a.src||'');
    try{
      var tracks=window.ktCreatorTracks||[];
      for(var i=0;i<tracks.length;i++){
        var u=String((tracks[i]&&tracks[i].url)||'');
        if(u&&(src===u||src.indexOf(u)>-1||u.indexOf(src)>-1))return true;
      }
    }catch(e){}
    var mark=(String(a.id||'')+' '+String(a.className||'')+' '+String(a.dataset&&a.dataset.ktSong||'')).toLowerCase();
    if(/song|music|sound|creator/.test(mark))return true;
    if(/commons\.wikimedia|upload\.wikimedia/.test(src))return true;
    return false;
  }

  function anySongPlaying(){
    try{
      var arr=[].slice.call(document.querySelectorAll('audio'));
      return arr.some(function(a){return isSongAudio(a)&&!a.paused&&!a.ended;});
    }catch(e){return false;}
  }

  async function setHostMicLock(lock){
    if(!isHostRoom())return;
    lock=!!lock;
    if(hostSongActive===lock)return;
    hostSongActive=lock;
    try{
      await fetch(SB+'/rest/v1/ktalk_guest_sessions?host_id=eq.'+encodeURIComponent(hostId())+'&active=eq.true&status=eq.accepted',{
        method:'PATCH',
        headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),
        body:JSON.stringify({mic_locked:lock,updated_at:new Date().toISOString()})
      });
    }catch(e){}
  }

  function scheduleSongState(){
    setTimeout(function(){setHostMicLock(anySongPlaying());},40);
    setTimeout(function(){setHostMicLock(anySongPlaying());},250);
  }

  document.addEventListener('play',function(ev){
    if(isHostRoom()&&isSongAudio(ev.target))setHostMicLock(true);
  },true);
  document.addEventListener('pause',function(ev){
    if(isHostRoom()&&isSongAudio(ev.target))scheduleSongState();
  },true);
  document.addEventListener('ended',function(ev){
    if(isHostRoom()&&isSongAudio(ev.target))scheduleSongState();
  },true);

  /* Catch programmatic audio playback too. */
  try{
    var oldPlay=HTMLMediaElement.prototype.play;
    if(!oldPlay.__ktSongMicWrapped){
      var wrapped=function(){
        if(isHostRoom()&&isSongAudio(this))setHostMicLock(true);
        return oldPlay.apply(this,arguments);
      };
      wrapped.__ktSongMicWrapped=true;
      HTMLMediaElement.prototype.play=wrapped;
    }
  }catch(e){}

  /* Capture only the stream requested when a viewer is joining as a guest. */
  try{
    var md=navigator.mediaDevices;
    if(md&&typeof md.getUserMedia==='function'&&!md.getUserMedia.__ktGuestMicCaptureWrapped){
      var oldGum=md.getUserMedia.bind(md);
      var gum=async function(constraints){
        var s=await oldGum(constraints);
        try{
          if(isGuestViewer()&&constraints&&constraints.audio){
            guestStream=s;
            window.__ktGuestMicStream=s;
          }
        }catch(e){}
        return s;
      };
      gum.__ktGuestMicCaptureWrapped=true;
      md.getUserMedia=gum;
    }
  }catch(e){}

  function applyGuestLock(lock){
    if(isStaff())lock=false;
    lock=!!lock;
    if(lastGuestLocked===lock)return;
    var s=guestStream||window.__ktGuestMicStream;
    if(!s||!s.getAudioTracks)return;
    var tracks=s.getAudioTracks();
    if(!tracks.length)return;
    if(lock){
      guestMicBeforeLock=tracks.map(function(t){return t.enabled!==false;});
      tracks.forEach(function(t){t.enabled=false;});
      var b=document.getElementById('ktGuestJoinBtn');
      if(b)b.textContent='🎵 노래 중 · 마이크 잠김';
    }else{
      tracks.forEach(function(t,i){t.enabled=guestMicBeforeLock?guestMicBeforeLock[i]!==false:true;});
      guestMicBeforeLock=null;
      var btn=document.getElementById('ktGuestJoinBtn');
      if(btn&&btn.textContent.indexOf('노래 중')>-1)btn.textContent='✓ 게스트 참여 중';
    }
    lastGuestLocked=lock;
  }

  async function pollGuestMicLock(){
    if(syncBusy||!isGuestViewer())return;
    var vid=viewerId();
    if(!vid)return;
    syncBusy=true;
    try{
      var u=SB+'/rest/v1/ktalk_guest_sessions?select=mic_locked,status,active&guest_id=eq.'+encodeURIComponent(vid)+'&active=eq.true&status=eq.accepted&order=updated_at.desc&limit=1';
      var r=await fetch(u,{headers:headers()});
      if(r.ok){
        var rows=await r.json();
        var x=rows&&rows[0];
        applyGuestLock(!!(x&&x.mic_locked));
      }
    }catch(e){}
    syncBusy=false;
  }

  setInterval(function(){
    if(isHostRoom())scheduleSongState();
    if(isGuestViewer())pollGuestMicLock();
    else if(lastGuestLocked===true)applyGuestLock(false);
  },550);

  window.addEventListener('pagehide',function(){
    if(isHostRoom()){
      try{
        fetch(SB+'/rest/v1/ktalk_guest_sessions?host_id=eq.'+encodeURIComponent(hostId())+'&active=eq.true&status=eq.accepted',{
          method:'PATCH',headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),
          body:JSON.stringify({mic_locked:false,updated_at:new Date().toISOString()}),keepalive:true
        });
      }catch(e){}
    }
  });
})();