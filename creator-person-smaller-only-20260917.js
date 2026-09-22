/* K-Talk: 촬영 화면 크기는 그대로 두고 카메라 속 사람만 덜 크게 보이게.
   2026-09-22 stability: camera constraints are applied once per video track only.
   다른 화면/방송방은 변경하지 않음. */
(function(){
  if(window.__ktCreatorPersonSmallerOnly20260917)return;
  window.__ktCreatorPersonSmallerOnly20260917=true;

  var lastTrack=null;

  function ensureStyle(){
    if(document.getElementById('ktCreatorPersonSmallerOnly20260917Style'))return;
    var s=document.createElement('style');
    s.id='ktCreatorPersonSmallerOnly20260917Style';
    s.textContent=''
      +'.creator.camera-on video#camera{'
      +'object-fit:contain!important;'
      +'object-position:center center!important;'
      +'transform-origin:50% 50%!important;'
      +'transition:none!important;'
      +'animation:none!important;'
      +'-webkit-backface-visibility:hidden!important;'
      +'backface-visibility:hidden!important;'
      +'}';
    document.head.appendChild(s);
  }

  async function stabilizeTrackOnce(){
    try{
      var v=document.getElementById('camera');
      if(!v||!v.srcObject||!v.srcObject.getVideoTracks)return;
      var t=v.srcObject.getVideoTracks()[0];
      if(!t||t===lastTrack||t.readyState!=='live')return;
      lastTrack=t;

      if(!t.getCapabilities||!t.applyConstraints)return;
      var caps=t.getCapabilities()||{},adv={};

      if(caps.zoom){
        var min=Number(caps.zoom.min);
        if(isFinite(min))adv.zoom=min;
      }

      /* 연속 초점이 화면을 들썩이게 하는 기기에서는 한 번 초점을 잡고 고정한다. */
      if(Array.isArray(caps.focusMode)&&caps.focusMode.indexOf('single-shot')>-1){
        adv.focusMode='single-shot';
      }

      if(Object.keys(adv).length)await t.applyConstraints({advanced:[adv]});
    }catch(e){}
  }

  function apply(){
    ensureStyle();
    stabilizeTrackOnce();
  }

  apply();
  [80,250,700].forEach(function(ms){setTimeout(apply,ms);});

  var cam=document.getElementById('camera');
  if(cam){
    cam.addEventListener('loadedmetadata',apply);
    cam.addEventListener('playing',apply);
  }

  /* 화면 전체 DOM 변화는 감시하지 않는다. 새 카메라 트랙이 붙을 때만 확인한다. */
  try{
    var c=document.getElementById('creator');
    if(c&&window.MutationObserver){
      var mo=new MutationObserver(function(){
        if(c.classList.contains('show'))setTimeout(apply,40);
      });
      mo.observe(c,{attributes:true,attributeFilter:['class']});
    }
  }catch(e){}

  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')setTimeout(apply,80);
  });
})();