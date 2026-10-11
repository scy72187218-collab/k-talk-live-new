/* Live opener owns its entire gesture: releasing over a newly visible room must not select it. */
(function(){
  if(window.__ktLiveChooserGesture20261011)return;
  window.__ktLiveChooserGesture20261011=true;
  var opening=false, openedAt=0;
  function liveControl(target){
    var el=target&&target.closest?target.closest('.creator-bottom .modes span,.creator-bottom .modes button,.creator-bottom .creator-foot span,.creator-bottom .creator-foot button'):null;
    return el&&String(el.textContent||'').replace(/\s+/g,'')==='라이브';
  }
  function stop(e){e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}
  function open(e){
    if(typeof window.openTikLivePrep!=='function')return;
    stop(e);opening=true;openedAt=Date.now();window.openTikLivePrep();
  }
  window.addEventListener('pointerdown',function(e){
    opening=false;
    if(liveControl(e.target))open(e);
  },true);
  ['pointerup','touchend','click'].forEach(function(name){
    window.addEventListener(name,function(e){
      if(opening&&Date.now()-openedAt<900){stop(e);return;}
      opening=false;
      if(name==='click'&&liveControl(e.target))open(e);
    },true);
  });
  window.addEventListener('pointercancel',function(){opening=false;},true);
})();
