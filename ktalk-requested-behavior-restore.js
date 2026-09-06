/* K-Talk LIVE only: re-apply requested behavior without touching room layouts or other projects. */
(function(){
  if(window.__ktRequestedBehaviorRestoreLoaded)return;
  var host=String(location.hostname||'');
  if(host!=='k-talk-live-final.vercel.app'&&host!=='k-talk-new-room.vercel.app'&&host!=='localhost')return;
  window.__ktRequestedBehaviorRestoreLoaded=true;

  var SOUND_KEY='kt_remote_sound_enabled';

  function removeSoundButton(){
    var b=document.getElementById('ktRemoteSoundBtn');
    if(b&&b.parentNode)b.parentNode.removeChild(b);
  }

  function remoteVideo(){return document.getElementById('ktRemoteLive');}

  function unlockRemoteSound(){
    removeSoundButton();
    var v=remoteVideo();
    if(!v)return;
    try{
      v.muted=false;
      v.defaultMuted=false;
      v.volume=1;
      v.removeAttribute('muted');
      v.dataset.ktSoundOn='1';
      localStorage.setItem(SOUND_KEY,'1');
      var p=v.play();
      if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  ['pointerdown','touchstart','click'].forEach(function(ev){
    document.addEventListener(ev,function(){
      if(remoteVideo())unlockRemoteSound();
    },{capture:true,passive:true});
  });

  function restoreRememberedSound(){
    removeSoundButton();
    var v=remoteVideo();
    if(!v)return;
    try{
      if(localStorage.getItem(SOUND_KEY)==='1'&&v.readyState>=1){
        v.muted=false;
        v.defaultMuted=false;
        v.volume=1;
        v.removeAttribute('muted');
      }
    }catch(e){}
  }

  var mo=new MutationObserver(function(){
    removeSoundButton();
    restoreRememberedSound();
  });
  mo.observe(document.documentElement,{subtree:true,childList:true});
  setInterval(function(){removeSoundButton();restoreRememberedSound();},900);

  function liveInviteUrl(){
    try{
      var u=new URL(location.href);
      u.searchParams.set('invite','live');
      return u.toString();
    }catch(e){return location.href;}
  }

  window.ktSendLiveInviteMessage=async function(){
    var url=liveInviteUrl();
    var title='K-Talk LIVE 방송 초대';
    var text='K-Talk LIVE 방송에 초대합니다. 들어오고 싶으면 이 주소를 눌러 주세요.';
    try{
      if(navigator.share){
        await navigator.share({title:title,text:text,url:url});
        return;
      }
    }catch(e){if(e&&e.name==='AbortError')return;}
    try{
      if(navigator.clipboard&&navigator.clipboard.writeText){
        await navigator.clipboard.writeText(text+' '+url);
        alert('방송 초대 메시지를 복사했습니다. 카톡이나 문자에 붙여서 보내세요.');
        return;
      }
    }catch(e){}
    try{if(window.shareApp)shareApp();}catch(e){}
  };

  window.ktLiveBottomAudience=function(){
    try{
      if(window.showSheet){
        showSheet('방송 초대','<div class="kt-live-audience-card"><b>💌 방송 초대 메시지</b><p>초대 메시지만 보냅니다. 받은 사람이 직접 눌러야 방송에 들어옵니다.</p><button type="button" onclick="if(window.ktSendLiveInviteMessage)ktSendLiveInviteMessage()">💌 초대 메시지 보내기</button></div>');
        return;
      }
      window.ktSendLiveInviteMessage();
    }catch(e){}
  };

  /* Keep the requested guest-mic rule alive even if another script reorders loaders. */
  function ensureSongMicRule(){
    if(window.__ktSongGuestMicLockLoaded)return;
    if(document.querySelector('script[data-kt-song-guest-mic-restore]'))return;
    var s=document.createElement('script');
    s.src='song-guest-mic-lock.js?v=20260906-songmic03';
    s.defer=true;
    s.setAttribute('data-kt-song-guest-mic-restore','1');
    document.head.appendChild(s);
  }
  setTimeout(ensureSongMicRule,120);
  setTimeout(ensureSongMicRule,900);
})();
