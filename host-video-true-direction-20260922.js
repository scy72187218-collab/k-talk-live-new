/* K-Talk host video true-direction guard (2026-09-22)
   Communications display only.
   Host video is never horizontally mirrored on 9-room host view or guest-side host view.
   Guest/self video, room layout, controls, chat, gifts and countdowns are untouched. */
(function(){
  if(window.__ktHostVideoTrueDirection20260922)return;
  window.__ktHostVideoTrueDirection20260922=true;

  var SEL=[
    '#screen .ktg13-room .ktg13-host > video',
    '#screen .ktsolo-room .ktsolo-host > video',
    '#screen .ktsubscriber-room .ktsubscriber-host > video',
    '#screen .ktsecret-room .ktsecret-host > video',
    '.kt-guest-hostlike-room .kgh-cell.host > video',
    '.kt-approved-guest-grid .kt-approved-guest-cell.host > video',
    '.kt-prejoin-room-grid .kt-prejoin-room-cell.host > video',
    '.kt-guest-room-grid .kt-guest-room-cell.host > video',
    '#ktRemoteHostPreview'
  ].join(',');

  function ensureDirectionLockStyle(){
    if(document.getElementById('ktHostVideoDirectionHardLock20260923'))return;
    var s=document.createElement('style');
    s.id='ktHostVideoDirectionHardLock20260923';
    s.textContent=SEL+'{transform:scaleX(-1)!important;-webkit-transform:scaleX(-1)!important;transform-origin:50% 50%!important;}';
    document.head.appendChild(s);
  }

  function apply(v){
    if(!v)return;
    try{
      v.style.setProperty('transform','scaleX(-1)','important');
      v.style.setProperty('-webkit-transform','scaleX(-1)','important');
      v.style.setProperty('transform-origin','50% 50%','important');
    }catch(e){}
  }

  function scan(){
    try{document.querySelectorAll(SEL).forEach(apply);}catch(e){}
  }

  ensureDirectionLockStyle();
  scan();
  [0,60,180,420,900,1600,3000].forEach(function(ms){setTimeout(scan,ms);});
  setInterval(scan,600);

  try{
    new MutationObserver(function(){ensureDirectionLockStyle();scan();}).observe(document.documentElement,{
      childList:true,subtree:true,attributes:true,attributeFilter:['style','class','data-kt-room']
    });
  }catch(e){}
})();