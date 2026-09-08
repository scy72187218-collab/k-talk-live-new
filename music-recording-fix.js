/* K-Talk loader: keep the existing music fix unchanged, then load the approved 13-person room preview. */
(function(){
  function load(src){
    var s=document.createElement('script');
    s.src=src;
    s.async=false;
    document.head.appendChild(s);
  }
  load('music-recording-base.js?v=20260907-group13');
  load('group13-approved-room.js?v=20260907-group13');
  load('mic-prompt-fix.js?v=20260907-mic1');
  load('audio-quality-upgrade.js?v=20260907-audio1');
  load('install-k-talk.js?v=20260907-icon1');
  load('secret-center-people.js?v=20260908-secretpeople1');
  load('beauty-ai-actions.js?v=20260908a');
  load('private-monitor-20260908.js?v=20260908-private1');
})();
