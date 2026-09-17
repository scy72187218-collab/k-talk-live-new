/* K-Talk: 촬영 화면 크기는 그대로 두고 카메라 속 사람만 덜 크게 보이게. 다른 화면/방송방은 변경하지 않음. */
(function(){
  if(window.__ktCreatorPersonSmallerOnly20260917)return;
  window.__ktCreatorPersonSmallerOnly20260917=true;

  function ensureStyle(){
    if(document.getElementById('ktCreatorPersonSmallerOnly20260917Style'))return;
    var s=document.createElement('style');
    s.id='ktCreatorPersonSmallerOnly20260917Style';
    s.textContent=''
      +'.creator.camera-on video#camera{object-fit:contain!important;object-position:center center!important;}';
    document.head.appendChild(s);
  }

  async function setMinimumCameraZoom(){
    try{
      var v=document.getElementById('camera');
      if(!v||!v.srcObject||!v.srcObject.getVideoTracks)return;
      var t=v.srcObject.getVideoTracks()[0];
      if(!t||!t.getCapabilities||!t.applyConstraints)return;
      var c=t.getCapabilities()||{};
      if(!c.zoom)return;
      var min=Number(c.zoom.min);
      if(!isFinite(min))return;
      var st=t.getSettings?t.getSettings():{};
      if(Number(st.zoom)!==min)await t.applyConstraints({advanced:[{zoom:min}]});
    }catch(e){}
  }

  function apply(){
    ensureStyle();
    setMinimumCameraZoom();
  }

  apply();
  [100,300,700,1400].forEach(function(ms){setTimeout(apply,ms);});
  try{
    var mo=new MutationObserver(function(){setTimeout(apply,30);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
