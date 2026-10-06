/* K-Talk host instant AI join/leave announcer (2026-10-06)
   Scope: voice notification only. No layout/button/video/chat changes. */
(function(){
  if(window.__ktHostInstantJoinLeaveAI20261006)return;
  window.__ktHostInstantJoinLeaveAI20261006=true;
  var last={};
  function hostSide(){
    try{
      var local=String(window.__ktLocalHostId||window.__ktHostDeviceId||'').trim();
      var remote=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'').trim();
      return !!local&&!remote;
    }catch(e){return false;}
  }
  function say(key,text){
    if(!hostSide()||!text)return;
    var now=Date.now();
    if(last[key]&&now-last[key]<1200)return;
    last[key]=now;
    try{
      if(typeof window.ktSpeak==='function'){window.ktSpeak(text);return;}
      if(!('speechSynthesis' in window))return;
      var u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=1.08;u.pitch=1;u.volume=1;
      speechSynthesis.speak(u);
    }catch(e){}
  }
  window.addEventListener('kt-any-guest-approved',function(e){
    var d=e&&e.detail||{},id=String(d.viewer_id||'guest');
    var name=String(d.name||'').trim();
    if(!name)try{name=String((window.__ktApprovedGuestNames20260924||{})[id]||'게스트');}catch(_e){name='게스트';}
    say('in:'+id,(name||'게스트')+'님이 들어왔습니다.');
  });
  window.addEventListener('kt-any-guest-left',function(e){
    var d=e&&e.detail||{},id=String(d.viewer_id||'guest');
    var name=String(d.name||'').trim();
    if(!name)try{name=String((window.__ktApprovedGuestNames20260924||{})[id]||'게스트');}catch(_e){name='게스트';}
    say('out:'+id,(name||'게스트')+'님이 나갔습니다.');
  });
})();
