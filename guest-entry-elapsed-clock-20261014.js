/* Owner: guest visit elapsed time, zero at each entry; host clocks untouched. */
(function(){
  if(window.__ktGuestEntryElapsedClock20261014)return;
  window.__ktGuestEntryElapsedClock20261014=true;
  var joinedAt=0,missingAt=0;
  function format(ms){var n=Math.max(0,Math.floor(ms/1000));return [Math.floor(n/3600),Math.floor(n/60)%60,n%60].map(function(v){return String(v).padStart(2,'0');}).join(':');}
  function paint(){
    var root=document.querySelector('#screen .kt-remote-live');
    if(!root){if(!missingAt)missingAt=Date.now();if(Date.now()-missingAt>5000)joinedAt=0;return;}
    missingAt=0;if(!joinedAt)joinedAt=Date.now();
    var text=format(Date.now()-joinedAt);
    root.querySelectorAll('#ktLiveClock,#ktRemoteClock,.kt-sgfh-clock,[data-kt-live-clock]').forEach(function(el){if(el.textContent!==text)el.textContent=text;});
  }
  window.addEventListener('kt-remote-host-selected',function(){joinedAt=Date.now();missingAt=0;paint();});
  window.addEventListener('kt-remote-host-left',function(){joinedAt=0;missingAt=Date.now();});
  window.ktGuestEntryElapsedText20261014=function(){return format(joinedAt?Date.now()-joinedAt:0);};
  setInterval(paint,500);
  try{var root=document.getElementById('screen');if(root)new MutationObserver(paint).observe(root,{childList:true,subtree:true,characterData:true});}catch(e){}
  paint();
})();

