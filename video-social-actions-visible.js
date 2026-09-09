/* K-Talk 동영상 화면: 좋아요/댓글/선물/공유 표시만 항상 보이게. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktVideoSocialActionsVisibleInstalled)return;
  window.__ktVideoSocialActionsVisibleInstalled=true;

  var style=document.createElement('style');
  style.id='ktVideoSocialActionsVisibleStyle';
  style.textContent=''
    +'body.kt-video-mode #screen section{position:relative!important}'
    +'body.kt-video-mode #screen .kt-public-video{z-index:1!important}'
    +'body.kt-video-mode #screen .vh-shade{position:absolute!important;inset:0!important;z-index:2!important;pointer-events:none!important}'
    +'body.kt-video-mode #screen .vh-tabs{z-index:20!important}'
    +'body.kt-video-mode #screen .vh-title{z-index:20!important}'
    +'body.kt-video-mode #screen .vh-actions{position:absolute!important;right:10px!important;bottom:30px!important;z-index:30!important;display:flex!important;flex-direction:column!important;gap:10px!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}'
    +'body.kt-video-mode #screen .vh-actions button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;width:56px!important;height:56px!important;padding:0!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.22)!important;background:rgba(5,5,10,.68)!important;color:#fff!important;font-size:23px!important;line-height:1!important;text-shadow:0 1px 4px #000!important;box-shadow:0 2px 10px rgba(0,0,0,.28)!important;pointer-events:auto!important;touch-action:manipulation!important}'
    +'body.kt-video-mode #screen .vh-actions small{display:block!important;margin-top:3px!important;color:#fff!important;font-size:8px!important;font-weight:850!important;line-height:1.05!important;white-space:nowrap!important;text-shadow:0 1px 3px #000!important}'
    +'@media(max-width:390px){body.kt-video-mode #screen .vh-actions{right:8px!important;bottom:26px!important;gap:8px!important}body.kt-video-mode #screen .vh-actions button{width:52px!important;height:52px!important;font-size:21px!important}}';
  document.head.appendChild(style);
})();
