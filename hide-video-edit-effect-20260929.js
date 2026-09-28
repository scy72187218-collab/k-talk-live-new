/* K-Talk: hide only video edit-effect button; keep beauty correction active */
(function(){
  if(window.__ktHideEditEffectOnly20260929)return;
  window.__ktHideEditEffectOnly20260929=true;

  function clean(){
    try{
      document.querySelectorAll('.prep-item,.creator-tools button,.creator-bottom button,button').forEach(function(el){
        var t=String(el.textContent||'').replace(/\s+/g,'').trim();
        if(t==='편집효과'||t.indexOf('편집효과')===0){
          el.style.setProperty('display','none','important');
          el.setAttribute('aria-hidden','true');
          el.disabled=true;
        }
      });
    }catch(e){}
  }

  clean();
  [100,300,700,1400].forEach(function(ms){setTimeout(clean,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktHideEditEffectTimer20260929);
      window.__ktHideEditEffectTimer20260929=setTimeout(clean,50);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();