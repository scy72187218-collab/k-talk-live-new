/* K-Talk host video true-direction guard (2026-09-22)
   Communications display only.
   Owner-confirmed mirrored display on all live camera tiles, host and viewers alike.
   Host tone remains neutral. Movie media, layout, controls, chat and gifts are untouched. */
(function(){
  if(window.__ktHostVideoTrueDirection20260922)return;
  window.__ktHostVideoTrueDirection20260922=true;

  var HOST_SEL=[
    '#screen .ktg13-room .ktg13-host > video',
    '#screen .ktsolo-room .ktsolo-host > video',
    '#screen .ktsolo-room .ktsolo-main > video',
    '#screen #ktRemoteLiveVideo',
    '#screen .ktsecret-room .ktsecret-slot.host > video',
    '#screen .ktsubscriber-room .ktsubscriber-host > video',
    '#screen .ktsecret-room .ktsecret-host > video',
    '.kt-guest-hostlike-room .kgh-cell.host > video',
    '.kt-approved-guest-grid .kt-approved-guest-cell.host > video',
    '.kt-prejoin-room-grid .kt-prejoin-room-cell.host > video',
    '.kt-guest-room-grid .kt-guest-room-cell.host > video',
    '#ktRemoteHostPreview'
  ].join(',');
  var SEL=HOST_SEL+','+[
    '#screen .ktg13-guest>video','#screen .ktg9-guest>video',
    '#screen .ktsubscriber-guest>video','#screen .ktsecret-slot>video',
    '#screen .kgh-cell>video','#screen .kt-approved-guest-cell>video',
    '#screen .kt-prejoin-room-cell>video','#screen .kt-guest-room-cell>video',
    '#screen .kt-sub6666-cell>video'
  ].join(',');

  function ensureDirectionLockStyle(){
    if(document.getElementById('ktHostVideoDirectionHardLock20260923'))return;
    var s=document.createElement('style');
    s.id='ktHostVideoDirectionHardLock20260923';
    s.textContent=SEL+'{transform-origin:50% 50%!important;}';
    document.head.appendChild(s);
  }

  function apply(v){
    if(document.documentElement.classList.contains('kt-host-media-sharing'))return;
    if(!v||!v.srcObject||!v.srcObject.getVideoTracks||!v.srcObject.getVideoTracks().length)return;
    try{
      if(v.matches(HOST_SEL)&&v.style.getPropertyValue('filter')!=='none')v.style.setProperty('filter','none','important');
      if(v.matches(HOST_SEL)&&v.style.getPropertyValue('-webkit-filter')!=='none')v.style.setProperty('-webkit-filter','none','important');
      if(v.style.getPropertyValue('transform')!=='scaleX(-1)')v.style.setProperty('transform','scaleX(-1)','important');
      if(v.style.getPropertyValue('-webkit-transform')!=='scaleX(-1)')v.style.setProperty('-webkit-transform','scaleX(-1)','important');
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