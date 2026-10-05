/* Remove only obsolete duplicate controls. 1150617 */
(function(){
  if(window.__ktRemoveLegacyOldControls20261005)return;
  window.__ktRemoveLegacyOldControls20261005=true;

  var s=document.createElement('style');
  s.id='ktRemoveLegacyOldControlsStyle20261005';
  s.textContent=''
    +'#ktPersonLayoutLaunch,#ktPersonLayoutPanel,.kt-person-layout-launch,.kt-person-layout-panel{display:none!important}'
    +'#screen .kt-room-second-stats-row-20260927{display:none!important}';
  (document.head||document.documentElement).appendChild(s);

  function clean(){
    try{
      document.querySelectorAll(
        '#ktPersonLayoutLaunch,#ktPersonLayoutPanel,'+
        '#screen .kt-room-second-stats-row-20260927'
      ).forEach(function(x){x.remove();});
    }catch(e){}
  }
  clean();
  setTimeout(clean,300);
  setTimeout(clean,1000);
})();