/* K-Talk profile QR cleanup 2026-09-29 */
(function(){
  if(window.__ktProfileQrCleanup20260929)return;
  window.__ktProfileQrCleanup20260929=true;
  function clean(){
    try{
      document.querySelectorAll('.kt-profile-round-qr,.kt-profile-qr-sheet,.kt-profile-qr-frame,.kt-profile-qr-url,.kt-profile-qr-go').forEach(function(el){el.remove();});
      var st=document.getElementById('ktProfileRoundQrStyle');
      if(st)st.remove();
    }catch(e){}
  }
  clean();
  [50,200,500,1000].forEach(function(ms){setTimeout(clean,ms);});
  try{
    new MutationObserver(function(){setTimeout(clean,0);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();