/* K-Talk 선물 연출: 보낸 사람 화면이 아니라 실제 받는 사람 화면에만 표시 2026-10-04 */
(function(){
  if(window.__ktGiftRecipientOnly20261004)return;
  window.__ktGiftRecipientOnly20261004=true;

  function isRemoteViewer(){
    try{
      return document.documentElement.classList.contains('kt-remote-viewing')||
        !!document.querySelector('#screen .kt-remote-live');
    }catch(e){return false;}
  }
  function selectedTarget(){
    try{
      var t=window.ktGiftTarget20260928||null;
      if(t&&(t.kind==='host'||(t.kind==='guest'&&t.viewerId)))return t;
      var g=window.ktGuestGiftTarget||null;
      if(g&&g.viewerId)return {kind:'guest',viewerId:g.viewerId,name:g.name||'게스트'};
    }catch(e){}
    return null;
  }

  function install(){
    var old=window.giftSend;
    if(typeof old!=='function'||old.__ktRecipientOnly20261004)return;

    var wrapped=function(name,cost,sender){
      var c=parseInt(cost||0,10)||0;
      if(c<=0)return;

      var target=selectedTarget();

      /* 원격 시청자/게스트가 보내는 선물은 기본적으로 호스트가 받음.
         사람을 직접 선택한 경우에는 그 선택된 사람만 받음.
         이때 보낸 사람 폰에는 선물 연출을 띄우지 않는다. */
      if(isRemoteViewer()||target){
        try{
          if(typeof window.ktSyncGiftToHost==='function'){
            window.ktSyncGiftToHost(String(name||'선물'),c,String(sender||''));
          }
        }catch(e){}
        return true;
      }

      /* 호스트가 대상 지정 없이 자기 방에서 누르는 기존 동작은 유지 */
      return old.apply(this,arguments);
    };
    wrapped.__ktRecipientOnly20261004=true;
    wrapped.__ktRecipientOnlyOld=old;
    window.giftSend=wrapped;
  }

  install();
  [50,180,500,1200].forEach(function(ms){setTimeout(install,ms);});
})();