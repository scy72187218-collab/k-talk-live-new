/* K-Talk approved guest -> direct realtime bridge (2026-09-22)
   Communications only. Detects an existing approved guest slot and forwards
   that approval into the direct realtime WebRTC path.
   Does not alter room layout, camera preview, chat, gifts, earnings or switches. */
(function(){
  if(window.__ktApprovedGuestDirectBridge20260922)return;
  window.__ktApprovedGuestDirectBridge20260922=true;

  var sent={};

  function guestName(slot){
    try{
      var el=slot.querySelector('.kt-guest-name,.kgh-label,label');
      var t=String(el&&el.textContent||'').replace(/^\s*👤\s*/,'').trim();
      return t||'게스트';
    }catch(e){return '게스트';}
  }

  function scan(){
    if(typeof window.ktDirectApproveGuest20260922!=='function')return;
    document.querySelectorAll('#screen .ktg13-room .ktg13-guest[data-kt-guest-viewer-id]').forEach(function(slot){
      var vid=String(slot.dataset.ktGuestViewerId||'').trim();
      if(!vid)return;
      var key=vid+':'+String(slot.isConnected);
      if(sent[key])return;
      sent[key]=Date.now();
      try{window.ktDirectApproveGuest20260922(vid,guestName(slot));}catch(e){}
    });
  }

  scan();
  [100,350,800,1500,2500].forEach(function(ms){setTimeout(scan,ms);});

  try{
    var target=document.getElementById('screen')||document.documentElement;
    new MutationObserver(function(){
      clearTimeout(window.__ktApprovedGuestDirectBridgeTimer20260922);
      window.__ktApprovedGuestDirectBridgeTimer20260922=setTimeout(scan,35);
    }).observe(target,{childList:true,subtree:true,attributes:true,attributeFilter:['data-kt-guest-viewer-id','class']});
  }catch(e){}

  window.addEventListener('focus',function(){setTimeout(scan,80);});
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)setTimeout(scan,80);
  });
})();