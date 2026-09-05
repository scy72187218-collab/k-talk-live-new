/* K-Talk: active LIVE card should be the first item in the outside feed. */
(function(){
  if(window.__ktLiveFirstFeedFix)return;
  window.__ktLiveFirstFeedFix=true;

  function moveLiveFirst(){
    var feed=document.getElementById('ktUnifiedFeed');
    if(!feed)return;
    var live=feed.querySelector('.kt-live-feed-card');
    if(!live)return;
    if(feed.firstElementChild!==live){
      try{feed.insertBefore(live,feed.firstElementChild);}catch(e){}
    }
    try{feed.scrollTop=0;}catch(e){}
  }

  setTimeout(moveLiveFirst,120);
  setInterval(moveLiveFirst,1800);
  try{
    new MutationObserver(function(){setTimeout(moveLiveFirst,40);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
