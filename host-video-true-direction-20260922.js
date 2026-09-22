/* K-Talk host video true-direction guard (2026-09-22)
   Video direction only.
   1인/9명/13명/구독자/비밀방의 호스트 영상은 좌우반전 없이 실제 방향 그대로 표시.
   게스트/방배치/버튼/채팅/선물/카운트다운은 건드리지 않음. */
(function(){
  if(window.__ktHostVideoTrueDirection20260922)return;
  window.__ktHostVideoTrueDirection20260922=true;

  var SEL=[
    '#screen .ktsolo-room .ktsolo-main #ktLiveVideo',
    '#screen .ktg13-room .ktg13-host > video',
    '#screen .ktsubscriber-room .ktsubscriber-host > video',
    '#screen .ktsecret-room .ktsecret-slot.host > video',
    '.kt-guest-hostlike-room .kgh-cell.host > video',
    '.kt-approved-guest-grid .kt-approved-guest-cell.host > video',
    '.kt-prejoin-room-grid .kt-prejoin-room-cell.host > video',
    '.kt-guest-room-grid .kt-guest-room-cell.host > video',
    '#ktRemoteHostPreview'
  ].join(',');

  function ensureStyle(){
    var id='ktHostVideoTrueDirectionStyle20260922';
    var s=document.getElementById(id);
    if(!s){s=document.createElement('style');s.id=id;document.head.appendChild(s);}
    s.textContent=SEL+'{transform:none!important;-webkit-transform:none!important;transform-origin:50% 50%!important;}';
  }

  function apply(v){
    if(!v)return;
    try{
      v.style.setProperty('transform','none','important');
      v.style.setProperty('-webkit-transform','none','important');
      v.style.setProperty('transform-origin','50% 50%','important');
    }catch(e){}
  }

  function scan(){
    ensureStyle();
    try{document.querySelectorAll(SEL).forEach(apply);}catch(e){}
  }

  scan();
  [0,60,180,420,900,1600,3000].forEach(function(ms){setTimeout(scan,ms);});
  setInterval(scan,650);

  try{
    new MutationObserver(function(){scan();}).observe(document.documentElement,{
      childList:true,subtree:true
    });
  }catch(e){}
})();