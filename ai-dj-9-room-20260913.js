/* K-Talk AI DJ 음악방 비활성화. 다른 방/기능은 변경하지 않음. */
(function(){
  window.__ktAiDj9Room20260913=true;
})();

/* K-Talk 홈화면 아이콘 설치 전용. 다른 화면/방송 기능은 변경하지 않음. */
(function(){
  if(window.__ktPwaInstallOnly20260915)return;
  window.__ktPwaInstallOnly20260915=true;

  var deferredPrompt=null;

  function isInstalled(){
    try{
      return (window.matchMedia&&window.matchMedia('(display-mode: standalone)').matches)||(navigator.standalone===true);
    }catch(e){return false;}
  }

  function ensureManifest(){
    if(document.querySelector('link[rel="manifest"]'))return;
    var link=document.createElement('link');
    link.rel='manifest';
    link.href='/manifest.webmanifest?v=20260915-install2';
    document.head.appendChild(link);
  }

  function removeInstallBox(){
    var box=document.getElementById('ktPwaInstallBox');
    if(box&&box.parentNode)box.parentNode.removeChild(box);
  }

  function updateInstallBox(){
    var box=document.getElementById('ktPwaInstallBox');
    if(!box)return;
    var note=box.querySelector('[data-kt-install-note]');
    var btn=document.getElementById('ktPwaInstallBtn');
    if(deferredPrompt){
      if(note)note.textContent='설치를 누르면 홈 화면에 K-Talk 아이콘이 만들어집니다.';
      if(btn)btn.textContent='설치';
    }else{
      if(note)note.textContent='설치 버튼이 준비되면 한 번만 누르시면 됩니다.';
      if(btn)btn.textContent='설치 준비';
    }
  }

  function showInstallBox(){
    if(isInstalled()){removeInstallBox();return;}
    var existing=document.getElementById('ktPwaInstallBox');
    if(existing){updateInstallBox();return;}

    var box=document.createElement('div');
    box.id='ktPwaInstallBox';
    box.style.cssText='position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:100000;width:min(92vw,380px);display:flex;align-items:center;gap:10px;padding:10px 11px;border:1px solid rgba(255,92,207,.72);border-radius:17px;background:rgba(8,8,14,.96);box-shadow:0 8px 28px rgba(0,0,0,.55),0 0 16px rgba(255,76,196,.28);color:#fff;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif';
    box.innerHTML='<img src="/ktalk-icon.svg" alt="K-Talk" style="width:42px;height:42px;border-radius:11px;flex:0 0 42px"><div style="min-width:0;flex:1"><b style="display:block;font-size:13px">K-Talk 아이콘 설치</b><span data-kt-install-note style="display:block;margin-top:2px;color:#ddd;font-size:10px">설치 버튼을 준비하고 있습니다.</span></div><button id="ktPwaInstallBtn" type="button" style="height:38px;padding:0 14px;border:0;border-radius:12px;background:linear-gradient(135deg,#ff3ca6,#7b55ff);color:#fff;font-weight:950">설치 준비</button>';
    document.body.appendChild(box);

    var btn=document.getElementById('ktPwaInstallBtn');
    if(btn)btn.addEventListener('click',async function(){
      if(isInstalled()){removeInstallBox();return;}
      if(!deferredPrompt){
        var note=box.querySelector('[data-kt-install-note]');
        if(note)note.textContent='브라우저 설치 기능을 준비 중입니다. 잠시 후 다시 눌러 주세요.';
        try{
          if('serviceWorker' in navigator){
            var reg=await navigator.serviceWorker.ready;
            if(reg&&reg.update)reg.update().catch(function(){});
          }
        }catch(e){}
        return;
      }
      try{
        deferredPrompt.prompt();
        var choice=await deferredPrompt.userChoice;
        if(choice&&choice.outcome==='accepted')removeInstallBox();
      }catch(e){}
      deferredPrompt=null;
      updateInstallBox();
    });
    updateInstallBox();
  }

  ensureManifest();

  if('serviceWorker' in navigator){
    window.addEventListener('load',function(){
      navigator.serviceWorker.register('/sw.js?v=20260915-install2').then(function(){
        setTimeout(showInstallBox,250);
      }).catch(function(){
        setTimeout(showInstallBox,250);
      });
    },{once:true});
  }else{
    setTimeout(showInstallBox,500);
  }

  window.addEventListener('beforeinstallprompt',function(e){
    e.preventDefault();
    deferredPrompt=e;
    showInstallBox();
  });

  window.addEventListener('appinstalled',function(){
    deferredPrompt=null;
    removeInstallBox();
  });

  window.addEventListener('pageshow',function(){
    if(isInstalled())removeInstallBox();
    else setTimeout(showInstallBox,350);
  });

  setTimeout(showInstallBox,900);
})();

/* 2026-09-15 참고 영상과 비교해 촬영/방송 준비 카메라 구도만 조금 더 넓게. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktCreatorCameraSlightlySmaller20260915)return;
  window.__ktCreatorCameraSlightlySmaller20260915=true;
  if(document.getElementById('ktCreatorCameraSlightlySmaller20260915'))return;
  var s=document.createElement('style');
  s.id='ktCreatorCameraSlightlySmaller20260915';
  s.textContent='#creator.creator.camera-on:not(.creator-review) video#camera{transform:scaleX(-1) scale(.88)!important;transform-origin:center center!important;}';
  document.head.appendChild(s);

  function tryZoomOut(){
    try{
      if(!window.camera||!camera.srcObject)return;
      var tracks=camera.srcObject.getVideoTracks&&camera.srcObject.getVideoTracks();
      var track=tracks&&tracks[0];
      if(!track||!track.getCapabilities||!track.applyConstraints)return;
      var caps=track.getCapabilities();
      if(!caps||!caps.zoom)return;
      var z=typeof caps.zoom.min==='number'?caps.zoom.min:1;
      track.applyConstraints({advanced:[{zoom:z}]}).catch(function(){});
    }catch(e){}
  }
  [250,700,1400].forEach(function(ms){setTimeout(tryZoomOut,ms);});
  try{camera.addEventListener('loadedmetadata',tryZoomOut);}catch(e){}
})();

/* 2026-09-15 AI 보정만 강화: 피부 질감 완화 + 방송용 톤 프리셋. 다른 방/선물/버튼/사운드는 변경하지 않음. */
(function(){
  if(window.__ktSimpleBeautyPresets20260915)return;
  window.__ktSimpleBeautyPresets20260915=true;

  function ensureStyle(){
    if(document.getElementById('ktSimpleBeautyPresetsStyle20260915'))return;
    var s=document.createElement('style');
    s.id='ktSimpleBeautyPresetsStyle20260915';
    s.textContent=''
      +'.kt-simple-beauty{padding:8px 2px 4px}.kt-simple-beauty-note{margin:0 0 12px;padding:10px 12px;border-radius:12px;background:#ffffff0d;color:#ddd;font-size:12px;line-height:1.5}'
      +'.kt-simple-beauty-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.kt-simple-beauty-grid button{min-height:68px;border:1px solid #ffffff22;border-radius:16px;background:#12121a;color:#fff;font-size:15px;font-weight:950}'
      +'.kt-simple-beauty-grid button.on{border-color:#ff5ccf;box-shadow:0 0 0 2px #ff5ccf33,0 0 16px #ff5ccf33;background:linear-gradient(135deg,#2b1028,#16111f)}'
      +'.kt-simple-beauty-grid small{display:block;margin-top:5px;color:#cfcfd5;font-size:10px;font-weight:700}.kt-simple-beauty-apply{width:100%;height:46px;margin-top:12px;border:0;border-radius:14px;background:linear-gradient(135deg,#ff3ca6,#7b55ff);color:#fff;font-size:15px;font-weight:950}';
    document.head.appendChild(s);
  }

  var presets={
    off:{skin:1,tone:50,bright:50,sharp:50,filter:'none'},
    light:{skin:80,tone:56,bright:65,sharp:49,filter:'brightness(1.07) saturate(1.04) contrast(.95) blur(.18px)'},
    normal:{skin:90,tone:60,bright:72,sharp:46,filter:'brightness(1.10) saturate(1.06) contrast(.90) blur(.42px)'},
    strong:{skin:96,tone:64,bright:78,sharp:41,filter:'brightness(1.13) saturate(1.07) contrast(.85) blur(.70px)'},
    makeup:{skin:92,tone:68,bright:74,sharp:44,filter:'brightness(1.11) saturate(1.18) contrast(.89) sepia(.04) hue-rotate(-4deg) blur(.48px)'},
    makeupStrong:{skin:97,tone:72,bright:80,sharp:39,filter:'brightness(1.14) saturate(1.23) contrast(.84) sepia(.06) hue-rotate(-5deg) blur(.76px)'}
  };

  window.ktApplySimpleBeautyPreset=function(name){
    name=presets[name]?name:'normal';
    state.ktSimpleBeautyPreset=name;
    try{localStorage.setItem('ktalk_simple_beauty_preset',name);}catch(e){}
    var p=presets[name];
    if(name==='off'){
      state.beautyOn=false;
    }else{
      state.beautyOn=true;
      state.beautySkin=p.skin;
      state.beautyTone=p.tone;
      state.beautyBright=p.bright;
      state.beautySharp=p.sharp;
      state.beautyFace=50;
      state.beautyEyes=50;
      state.beautyNose=50;
      state.beautyMouth=50;
      try{if(typeof window.applyBeautyPreview==='function')window.applyBeautyPreview();}catch(e){}
    }
    if(camera){
      if(name==='off')camera.style.removeProperty('filter');
      else camera.style.setProperty('filter',p.filter,'important');
      camera.style.setProperty('transform','scaleX(-1) scale(.88)','important');
    }
    document.querySelectorAll('.kt-simple-beauty-grid button[data-beauty-preset]').forEach(function(b){
      b.classList.toggle('on',b.getAttribute('data-beauty-preset')===name);
    });
  };

  function savedPreset(){
    try{
      var v=localStorage.getItem('ktalk_simple_beauty_preset');
      if(v&&presets[v])return v;
    }catch(e){}
    return state.ktSimpleBeautyPreset||'normal';
  }

  window.openBeautyPanel=function(){
    ensureStyle();
    try{creator.classList.add('beauty-preview-open');}catch(e){}
    try{var lp=creator.querySelector('.live-prep');if(lp)lp.style.setProperty('display','none','important');}catch(e){}
    try{if(window.ensureLiveCamera)ensureLiveCamera(state.cameraFacing||'user').catch(function(){});}catch(e){}
    var current=savedPreset();
    var html='<div class="kt-simple-beauty">'
      +'<div class="kt-simple-beauty-note">참고 영상처럼 화면 여백을 조금 더 보이게 하고, 보정은 단계별로 바로 비교할 수 있게 했습니다.</div>'
      +'<div class="kt-simple-beauty-grid">'
        +'<button data-beauty-preset="off" class="'+(current==='off'?'on':'')+'" onclick="ktApplySimpleBeautyPreset(\'off\')">원본<small>보정 없음</small></button>'
        +'<button data-beauty-preset="light" class="'+(current==='light'?'on':'')+'" onclick="ktApplySimpleBeautyPreset(\'light\')">약하게<small>밝기·질감 가볍게</small></button>'
        +'<button data-beauty-preset="normal" class="'+(current==='normal'?'on':'')+'" onclick="ktApplySimpleBeautyPreset(\'normal\')">피부 보정<small>질감 더 부드럽게</small></button>'
        +'<button data-beauty-preset="strong" class="'+(current==='strong'?'on':'')+'" onclick="ktApplySimpleBeautyPreset(\'strong\')">강한 보정<small>방송용 부드러운 톤</small></button>'
        +'<button data-beauty-preset="makeup" class="'+(current==='makeup'?'on':'')+'" onclick="ktApplySimpleBeautyPreset(\'makeup\')">메이크업<small>화사한 색감·톤</small></button>'
        +'<button data-beauty-preset="makeupStrong" class="'+(current==='makeupStrong'?'on':'')+'" onclick="ktApplySimpleBeautyPreset(\'makeupStrong\')">강한 메이크업<small>조금 더 부드러운 방송 톤</small></button>'
      +'</div>'
      +'<button class="kt-simple-beauty-apply" onclick="closeSheet()">적용</button>'
      +'</div>';
    showSheet('AI 보정',html);
    sheet.classList.add('camera-effect-sheet','beauty-control-sheet');
    setTimeout(function(){ktApplySimpleBeautyPreset(current);},0);
  };

  try{
    camera.addEventListener('loadedmetadata',function(){
      var current=savedPreset();
      if(current!=='off')setTimeout(function(){ktApplySimpleBeautyPreset(current);},60);
    });
  }catch(e){}
})();

/* 2026-09-15 삼성/모바일 터치에서 라이브 준비 버튼들이 눌리지 않는 경우만 보강. 기존 클릭 기능을 그대로 호출하고 화면 배치는 변경하지 않음. */
(function(){
  if(window.__ktLivePrepTouchBridge20260915)return;
  window.__ktLivePrepTouchBridge20260915=true;

  function arm(){
    document.querySelectorAll('.live-prep button,.live-prep .prep-bottom span,.live-prep [role="switch"]').forEach(function(el){
      el.style.setProperty('pointer-events','auto','important');
      el.style.setProperty('touch-action','manipulation','important');
      el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
    });
  }

  document.addEventListener('touchend',function(e){
    var t=e.target&&e.target.closest?e.target.closest('.live-prep button,.live-prep .prep-bottom span,.live-prep [role="switch"]'):null;
    if(!t||!t.closest('.live-prep')||t.disabled)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    try{
      t.click();
    }catch(err){
      try{t.dispatchEvent(new MouseEvent('click',{bubbles:true,cancelable:true,view:window}));}catch(_e){}
    }
  },{capture:true,passive:false});

  arm();
  [120,350,800,1500].forEach(function(ms){setTimeout(arm,ms);});
  try{
    var mo=new MutationObserver(function(){clearTimeout(window.__ktLivePrepTouchArmTimer);window.__ktLivePrepTouchArmTimer=setTimeout(arm,30);});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
