/* Retired: do not recreate extra 9-room quick buttons.
   Remove only this script's own rows. No other room/UI/signaling changes. 1150617 */
(function(){
  try{
    document.querySelectorAll(
      '#screen .kt-g9-host-top3-restore-20261005,'+
      '#screen .kt-g9-host-utm-20261005'
    ).forEach(function(x){x.remove();});
  }catch(e){}
})();