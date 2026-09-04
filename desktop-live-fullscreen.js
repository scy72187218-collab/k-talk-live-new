/* K-Talk desktop-only live layout fix. Mobile is intentionally untouched. */
(function(){
  if(window.__ktDesktopLiveFullscreenLoaded)return;
  window.__ktDesktopLiveFullscreenLoaded=true;

  function isDesktop(){return window.matchMedia&&window.matchMedia('(min-width: 768px)').matches;}
  function roomType(){try{return (window.state&&state.liveRoomType)||'';}catch(e){return '';}}

  function apply(){
    if(!isDesktop())return;

    var app=document.querySelector('.app');
    if(app){
      app.style.setProperty('max-width','none','important');
      app.style.setProperty('width','100vw','important');
      app.style.setProperty('margin','0','important');
    }
    var screenEl=document.getElementById('screen');
    if(screenEl){
      screenEl.style.setProperty('width','100%','important');
      screenEl.style.setProperty('padding','0','important');
    }

    /* Viewer on a computer: fill the browser instead of leaving a small phone-sized black area. */
    var remote=document.getElementById('ktRemoteLive');
    if(remote){
      remote.style.setProperty('position','absolute','important');
      remote.style.setProperty('inset','0','important');
      remote.style.setProperty('width','100%','important');
      remote.style.setProperty('height','100%','important');
      remote.style.setProperty('object-fit','cover','important');
      remote.style.setProperty('object-position','50% 50%','important');
      remote.style.setProperty('background','#000','important');
    }

    /* Host on a computer. 13-person/subscriber rooms keep their TikTok-style host + invite grid. */
    var live=document.getElementById('ktLiveVideo');
    if(live){
      var t=roomType();
      if(t==='group13'||t==='subscriber'){
        if(window.ktApplyTikTokMultiRoomLayout)window.ktApplyTikTokMultiRoomLayout();
      }else{
        live.style.setProperty('position','absolute','important');
        live.style.setProperty('inset','0','important');
        live.style.setProperty('width','100%','important');
        live.style.setProperty('height','100%','important');
        live.style.setProperty('object-fit','cover','important');
        live.style.setProperty('object-position','50% 50%','important');
        live.style.setProperty('transform','scaleX(-1)','important');
        live.style.setProperty('transform-origin','50% 50%','important');
        live.style.setProperty('background','#000','important');
        var layer=document.getElementById('ktLiveEffectLayer');
        if(layer){
          layer.style.setProperty('transform','none','important');
          layer.style.setProperty('transform-origin','50% 50%','important');
        }
      }
    }
  }

  try{
    var obs=new MutationObserver(function(){setTimeout(apply,20);});
    obs.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',apply);
  setInterval(apply,700);
  setTimeout(apply,100);
})();
