/* K-Talk approved guest self-video direction hard lock (2026-09-23)
   First-photo orientation is the reference.
   Only the approved guest's OWN video is affected.
   Host video, remote guest tiles, layout, chat, gifts, approval and transport are untouched. */
(function(){
  if(window.__ktGuestSelfVideoDirectionLock20260923)return;
  window.__ktGuestSelfVideoDirectionLock20260923=true;

  var SEL=[
    '#screen .kt-guest-hostlike-room .kgh-cell.self video',
    '#screen .kt-approved-guest-grid .kt-approved-guest-cell.self video',
    '#screen .kt-prejoin-room-grid .kt-prejoin-room-cell.self video',
    '#screen .kt-guest-room-grid .kt-guest-room-cell.self video',
    '#ktRemoteGuestSelfVideo'
  ].join(',');

  function style(){
    if(document.getElementById('ktGuestSelfVideoDirectionLockStyle20260923'))return;
    var s=document.createElement('style');
    s.id='ktGuestSelfVideoDirectionLockStyle20260923';
    s.textContent=SEL+'{transform:none!important;-webkit-transform:none!important;transform-origin:50% 50%!important;}';
    document.head.appendChild(s);
  }

  function fix(v){
    if(!v)return;
    try{
      v.style.setProperty('transform','none','important');
      v.style.setProperty('-webkit-transform','none','important');
      v.style.setProperty('transform-origin','50% 50%','important');
    }catch(e){}
  }

  function scan(){
    style();
    try{document.querySelectorAll(SEL).forEach(fix);}catch(e){}
    try{
      var self=window.__ktApprovedGuestSelfStream;
      if(self){
        document.querySelectorAll('#screen video').forEach(function(v){
          try{if(v.srcObject===self)fix(v);}catch(e){}
        });
      }
    }catch(e){}
  }

  scan();
  [0,40,100,220,500,900,1600,3000].forEach(function(ms){setTimeout(scan,ms);});
  setInterval(scan,500);

  try{
    new MutationObserver(function(){scan();}).observe(document.documentElement,{
      childList:true,subtree:true,attributes:true,attributeFilter:['style','class']
    });
  }catch(e){}
})();
