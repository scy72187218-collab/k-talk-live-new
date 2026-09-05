/* K-Talk LIVE: subscriber room title only — keep the full title readable and away from the centered attendance badge. */
(function(){
  if(window.__ktSubscriberTitlePositionFixLoaded)return;
  window.__ktSubscriberTitlePositionFixLoaded=true;

  var st=document.createElement('style');
  st.id='ktSubscriberTitlePositionFixCss';
  st.textContent='\
#ktSept2Live.kt-subscriber-title-fix .kt-s2-title-left{padding-left:2px!important;min-width:0!important;max-width:48%!important;}\
#ktSept2Live.kt-subscriber-title-fix .kt-s2-title-left b{font-size:18px!important;gap:5px!important;white-space:nowrap!important;overflow:visible!important;text-overflow:clip!important;letter-spacing:-.5px!important;}\
#ktSept2Live.kt-subscriber-title-fix .kt-s2-title-left b i{width:14px!important;height:14px!important;flex:0 0 14px!important;}\
#ktSept2Live.kt-subscriber-title-fix .kt-s2-title-left small{font-size:12px!important;white-space:nowrap!important;}\
';
  document.head.appendChild(st);

  function apply(){
    var root=document.getElementById('ktSept2Live');
    if(!root)return;
    var isSub=false;
    try{isSub=!!(window.state&&state.liveRoomType==='subscriber');}catch(e){}
    if(!isSub){
      var b=root.querySelector('.kt-s2-title-left b');
      isSub=!!(b&&String(b.textContent||'').indexOf('구독자')>-1);
    }
    root.classList.toggle('kt-subscriber-title-fix',isSub);
  }

  apply();
  var mo=new MutationObserver(apply);
  try{mo.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setInterval(apply,900);
})();
