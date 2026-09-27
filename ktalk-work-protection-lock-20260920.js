/* Work-protection runtime intentionally disabled by owner request. */
(function(){
  window.__ktCurrentStateProtectionLock20260920=false;
  window.ktCurrentProtectionState=function(){return {};};
  window.ktIsWorkProtected=function(){return false;};
  window.ktLockCurrentApprovedState=function(){return true;};
  window.ktIsLiveSignalWorkAllowed=function(){return true;};
  window.ktUnlockCommunicationWork20260926=function(){return true;};
  try{
    localStorage.removeItem('ktalk_current_state_protection_20260920');
    document.documentElement.removeAttribute('data-kt-work-protected');
    document.querySelectorAll('[data-kt-work-protected]').forEach(function(el){
      el.removeAttribute('data-kt-work-protected');
    });
  }catch(e){}
})();
