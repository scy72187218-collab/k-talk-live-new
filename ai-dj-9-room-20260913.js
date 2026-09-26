/* K-Talk AI DJ 음악 9명방.
   기존 9명방 통신/게스트 구조는 그대로 사용하고, 호스트 칸만 AI DJ 화면으로 꾸민다. */
(function(){
  if(window.__ktAiDj9Room20260927)return;
  window.__ktAiDj9Room20260927=true;

  function ensureStyle(){
    if(document.getElementById('ktAiDj9RoomStyle20260927'))return;
    var s=document.createElement('style');
    s.id='ktAiDj9RoomStyle20260927';
    s.textContent=''
      +'.kt-ai-dj-pick{width:100%!important;min-height:58px!important;margin:10px 0 0!important;border:1px solid #ffb55a99!important;border-radius:18px!important;background:linear-gradient(135deg,#241207,#6a3b12 58%,#9a5a19)!important;color:#fff!important;font-weight:950!important;font-size:16px!important;box-shadow:0 0 16px #ff9d2b35!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:7px!important;touch-action:manipulation!important;pointer-events:auto!important}'
      +'.ktg9-room.kt-ai-dj-room .ktg9-host{position:relative!important;overflow:hidden!important;background:#050505!important}'
      +'.ktg9-room.kt-ai-dj-room .ktg9-host>video{opacity:0!important;pointer-events:none!important}'
      +'.kt-ai-dj-stage{position:absolute!important;inset:0!important;z-index:8!important;background:#050505 center/cover no-repeat!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;pointer-events:none!important}'
      +'.kt-ai-dj-stage:before{content:"K-Talk  |  AI 음악방  |  ● LIVE";position:absolute!important;left:8px!important;right:8px!important;top:7px!important;z-index:2!important;color:#ffd497!important;background:rgba(0,0,0,.58)!important;border:1px solid #d58c3c66!important;border-radius:9px!important;padding:5px 7px!important;font:950 9px/1.1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;text-align:center!important}'
      +'.kt-ai-dj-wave{height:34px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;padding:0 7px 5px!important;background:linear-gradient(180deg,transparent,rgba(0,0,0,.75))!important}'
      +'.kt-ai-dj-wave i{display:block!important;width:3px!important;height:8px!important;border-radius:9px!important;background:linear-gradient(#ff3ba7,#ffb42d,#56e8ff)!important;animation:ktAiDjWave .68s ease-in-out infinite alternate!important}'
      +'.kt-ai-dj-wave i:nth-child(3n){animation-duration:.91s!important}.kt-ai-dj-wave i:nth-child(4n){animation-duration:.54s!important}'
      +'@keyframes ktAiDjWave{from{height:6px}to{height:29px}}'
      +'.kt-ai-dj-tools{position:absolute!important;left:7px!important;right:7px!important;bottom:8px!important;z-index:950!important;display:grid!important;grid-template-columns:1fr 1fr 1fr!important;gap:5px!important;pointer-events:auto!important}'
      +'.kt-ai-dj-tools button{min-height:34px!important;border:1px solid #ffffff2b!important;border-radius:11px!important;background:rgba(8,8,12,.88)!important;color:#fff!important;font:950 9px/1.15 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;padding:3px!important;touch-action:manipulation!important}'
      +'.kt-ai-dj-company{color:#ffd96a!important}'
      +'.kt-singer-lyric{position:absolute!important;left:50%!important;top:10px!important;transform:translateX(-50%)!important;z-index:1200!important;max-width:92%!important;padding:6px 11px!important;border-radius:999px!important;background:rgba(0,0,0,.72)!important;border:1px solid rgba(255,255,255,.34)!important;color:#fff!important;font:950 13px/1.2 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;text-align:center!important;text-shadow:0 1px 3px #000!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;pointer-events:none!important}'
      +'.kt-singer-lyric:empty{display:none!important}'
            group9';
      state.liveRoomName='AI 음악 9명방';
      state.liveRoomMax=9;
      var t=document.getElementById('liveTitle');
      if(t)t.value='AI 음악 9명방';
      if(typeof window.selectPrepRoom==='function'){
        var nine=[].slice.call(document.querySelectorAll('.prep-bottom button')).find(function(b){return /9명/.test(b.textContent||'');});
        if(nine)try{window.ktPickBottomRoom?window.ktPickBottomRoom(nine,'9명','group9','AI 음악 9명방',9):window.selectPrepRoom(nine,'group9','AI 음악 9명방',9);}catch(e){}
      }
    }catch(e){}
  }
  window.ktSelectAiDj9Room20260927=setMode;

  function installPick(){
    ensureStyle();
    var card=document.querySelector('#creator .live-prep .prep-card');
    if(!card)return;
    var row=card.querySelector('.room-switch-row');
    var start=card.querySelector('.prep-start');
    var btn=document.getElementById('ktAiDj9Pick20260927');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.id='ktAiDj9Pick20260927';
      btn.className='kt-ai-dj-pick';
      btn.innerHTML='<span style="font-size:22px">🎧</span><span>AI DJ 음악방</span>';
      btn.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(x){}
        setMode();
        try{
          document.querySelectorAll('#creator .room-switch').forEach(function(b){b.classList.remove('on');});
          btn.style.setProperty('box-shadow','0 0 0 3px rgba(255,181,90,.28),0 0 20px rgba(255,157,43,.48)','important');
        }catch(x){}
      };
    }
    /* 방 종류 버튼들 바로 아래, 라이브 시작 버튼 바로 위에 항상 둔다. */
    if(start&&btn.nextSibling!==start){
      card.insertBefore(btn,start);
    }else if(!btn.parentNode){
      card.appendChild(btn);
    }
  }

  function openRequest(){
    var html='<div class="rowbox"><b>🎵 신청곡 접수</b><br>노래 제목과 가수를 적어 주세요. 실제 재생은 사용 권한이 확인된 음원만 가능합니다.</div>'
      +'<input id="ktAiDjSongReq20260927" class="form" maxlength="80" placeholder="예: 노래 제목 / 가수">'
      +'<button class="act" onclick="ktAiDjSubmitSong20260927()">신청하기</button>';
    if(typeof window.showSheet==='function')window.showSheet('AI DJ 신청곡',html);
    setTimeout(function(){var i=document.getElementById('ktAiDjSongReq20260927');if(i)i.focus();},80);
  }
  window.ktAiDjOpenRequest20260927=openRequest;

  window.ktAiDjSubmitSong20260927=function(){
    var i=document.getElementById('ktAiDjSongReq20260927');
    var q=String(i&&i.value||'').trim();
    if(!q)return;
    try{
      var list=JSON.parse(localStorage.getItem('kt_ai_dj_song_requests_20260927')||'[]');
      list.push({text:q,at:Date.now()});
      if(list.length>100)list=list.slice(-100);
      localStorage.setItem('kt_ai_dj_song_requests_20260927',JSON.stringify(list));
    }catch(e){}
    try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
    try{if(typeof window.ktSpeak==='function')window.ktSpeak('신청곡 접수되었습니다. 사용 가능한 음원인지 확인한 뒤 안내하겠습니다.');}catch(e){}
  };

  function companyTotal(){
    var n=0;
    try{n=parseInt(localStorage.getItem('kt_ai_dj_company_coins_20260927')||'0',10)||0;}catch(e){}
    return n;
  }
  function showCompany(){
    var html='<div class="rowbox"><b>🏢 AI 음악방 회사 코인</b><br>현재 이 기기에 기록된 회사 집계: <b>'+companyTotal().toLocaleString('ko-KR')+' 코인</b></div>'
      +'<div class="note">실제 회사 계좌 입금은 결제·정산 서버 연결이 별도로 필요합니다. 이 화면은 방송 코인 집계용입니다.</div>';
    if(typeof window.showSheet==='function')window.showSheet('회사 코인',html);
  }
  window.ktAiDjShowCompany20260927=showCompany;

  function decorate(){
    if(!(window.state&&state.ktAiDjRoom))return;
    var room=document.querySelector('#screen .ktg9-room');
    if(!room)return;
    room.classList.add('kt-ai-dj-room');
    var host=room.querySelector('.ktg9-host');
    if(!host)return;
    if(!host.querySelector('.kt-ai-dj-stage')){
      var stage=document.createElement('div');
      stage.className='kt-ai-dj-stage';
      try{if(window.KT_AI_DJ_PHOTO)stage.style.backgroundImage='url("'+window.KT_AI_DJ_PHOTO+'")';}catch(e){}
      var wave=document.createElement('div');wave.className='kt-ai-dj-wave';
      var bars='';for(var x=0;x<36;x++)bars+='<i></i>';wave.innerHTML=bars;
      stage.appendChild(wave);
      host.appendChild(stage);
    }
    if(!room.querySelector('.kt-ai-dj-tools')){
      var tools=document.createElement('div');
      tools.className='kt-ai-dj-tools';
      tools.innerHTML='<button type="button" onclick="ktAiDjOpenRequest20260927()">🎵 신청곡</button>'
        +'<button type="button" onclick="if(window.ktSpeak)ktSpeak(\'안녕하세요. K-Talk AI 음악방입니다. 신청곡과 대화를 함께 즐겨 주세요.\')">🤖 AI 안내</button>'
        +'<button type="button" class="kt-ai-dj-company" onclick="ktAiDjShowCompany20260927()">🏢 회사 코인</button>'
        +'<div id="ktAiDjNowPlayingLabel20260927" style="grid-column:1/-1;min-height:24px;padding:5px 7px;border-radius:9px;background:rgba(0,0,0,.72);border:1px solid #ffffff1f;color:#ffe5a9;font:800 8px/1.35 system-ui,-apple-system,\"Noto Sans KR\",sans-serif;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">🎵 저작권 허용 음원 자동재생</div>';
      room.appendChild(tools);
    }
  }

  /* 방송이 종료되면 다음 일반 9명방까지 AI 화면이 남지 않도록 해제 */
  function cleanupFlag(){
    if(!document.querySelector('#screen .ktg9-room')&&document.body.classList.contains('kt-home')){
      try{if(window.state)state.ktAiDjRoom=false;}catch(e){}
    }
  }

  installPick();decorate();
  [100,300,700,1400,2500].forEach(function(ms){setTimeout(function(){installPick();decorate();},ms);});
  setInterval(function(){installPick();decorate();cleanupFlag();},900);
  try{
    new MutationObserver(function(){setTimeout(function(){installPick();decorate();},30);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
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
  s.textContent='#creator.creator.camera-on:not(.creator-review) video#camera{transform:scaleX(-1) scale(.84)!important;transform-origin:center center!important;}';
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
      camera.style.setProperty('transform','scaleX(-1) scale(.84)','important');
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

/* 2026-09-15 촬영 화면 스위치 작동 보강. 화면 배치/방/선물은 변경하지 않음. */
(function(){
  if(window.__ktCreatorEveryControlReady20260915)return;
  window.__ktCreatorEveryControlReady20260915=true;

  function ensureTouch(){
    var root=document.getElementById('creator');
    if(!root)return;
    root.querySelectorAll('button,.modes span,.creator-foot span').forEach(function(el){
      el.style.setProperty('pointer-events','auto','important');
      el.style.setProperty('touch-action','manipulation','important');
      el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
      if(el.tagName==='BUTTON'&&!el.type)el.type='button';
    });
  }

  function simpleSheet(title,html){
    try{
      if(typeof window.showSheet==='function')window.showSheet(title,'<div class="rowbox">'+html+'</div>');
      else alert(title);
    }catch(e){}
  }

  window.ktSetCreatorTimer=function(seconds){
    seconds=Math.max(0,Number(seconds)||0);
    try{state.creatorTimerSeconds=seconds;}catch(e){}
    var btn=document.querySelector('#creator .creator-tools button[aria-label="타이머"]');
    if(btn){
      btn.classList.toggle('on',seconds>0);
      btn.setAttribute('aria-pressed',seconds>0?'true':'false');
      btn.title=seconds?('촬영 타이머 '+seconds+'초'):'촬영 타이머 꺼짐';
    }
    try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
  };

  window.ktOpenCreatorTimer=function(){
    simpleSheet('타이머','<button type="button" onclick="ktSetCreatorTimer(3)">3초</button> <button type="button" onclick="ktSetCreatorTimer(10)">10초</button> <button type="button" onclick="ktSetCreatorTimer(0)">끄기</button>');
  };

  window.ktToggleCreatorFlash=async function(btn){
    try{
      var stream=(window.camera&&camera.srcObject)||(window.state&&state.stream)||null;
      var track=stream&&stream.getVideoTracks&&stream.getVideoTracks()[0];
      if(!track||!track.getCapabilities||!track.applyConstraints){
        simpleSheet('플래시','현재 카메라에서는 플래시를 사용할 수 없습니다. 후면 카메라에서 다시 눌러 주세요.');
        return;
      }
      var caps=track.getCapabilities();
      if(!caps||!caps.torch){
        simpleSheet('플래시','현재 카메라에서는 플래시를 사용할 수 없습니다. 후면 카메라에서 다시 눌러 주세요.');
        return;
      }
      state.creatorTorchOn=!state.creatorTorchOn;
      await track.applyConstraints({advanced:[{torch:!!state.creatorTorchOn}]});
      if(btn){
        btn.classList.toggle('on',!!state.creatorTorchOn);
        btn.setAttribute('aria-pressed',state.creatorTorchOn?'true':'false');
      }
    }catch(e){
      try{state.creatorTorchOn=false;}catch(_e){}
      simpleSheet('플래시','플래시를 켤 수 없습니다. 카메라를 전환한 뒤 다시 눌러 주세요.');
    }
  };

  window.ktOpenCreatorMore=function(){
    simpleSheet('더보기','<button type="button" onclick="if(window.toggleCreatorCamera)toggleCreatorCamera();closeSheet()">카메라 전환</button> <button type="button" onclick="closeSheet();setTimeout(function(){if(window.openBeautyPanel)openBeautyPanel();},30)">AI 보정</button> <button type="button" onclick="closeSheet();setTimeout(function(){if(window.openEditEffectPanel)openEditEffectPanel();},30)">편집효과</button> <button type="button" onclick="closeSheet();setTimeout(function(){if(window.openSoundPanel)openSoundPanel();},30)">사운드</button>');
  };

  function bindMissing(){
    ensureTouch();
    var root=document.getElementById('creator');
    if(!root)return;
    var flash=root.querySelector('.creator-tools button[aria-label="플래시"]');
    var timer=root.querySelector('.creator-tools button[aria-label="타이머"]');
    var more=root.querySelector('.creator-tools button[aria-label="더보기"]');
    if(flash&&!flash.dataset.ktCreatorBound){
      flash.dataset.ktCreatorBound='1';
      flash.addEventListener('click',function(){ktToggleCreatorFlash(flash);});
    }
    if(timer&&!timer.dataset.ktCreatorBound){
      timer.dataset.ktCreatorBound='1';
      timer.addEventListener('click',function(){ktOpenCreatorTimer();});
    }
    if(more&&!more.dataset.ktCreatorBound){
      more.dataset.ktCreatorBound='1';
      more.addEventListener('click',function(){ktOpenCreatorMore();});
    }

    var sound=document.getElementById('creatorSoundBtn');
    if(sound&&!sound.dataset.ktCreatorFallback){
      sound.dataset.ktCreatorFallback='1';
      sound.addEventListener('click',function(){
        if(typeof window.openSoundPanel!=='function')simpleSheet('사운드','사운드 기능을 준비 중입니다.');
      });
    }
  }

  if(typeof window.toggleCreatorCamera!=='function'){
    window.toggleCreatorCamera=async function(){
      try{
        state.cameraFacing=(state.cameraFacing==='environment')?'user':'environment';
        if(typeof window.ensureLiveCamera==='function')await window.ensureLiveCamera(state.cameraFacing);
        else if(typeof window.ensureCreatorPreviewCamera==='function')await window.ensureCreatorPreviewCamera(state.cameraFacing);
      }catch(e){}
    };
  }

  if(typeof window.startCreatorRecording==='function'&&!window.__ktCreatorTimerWrapped20260915){
    window.__ktCreatorTimerWrapped20260915=true;
    var originalStartCreatorRecording=window.startCreatorRecording;
    window.startCreatorRecording=function(){
      var args=arguments;
      var seconds=0;
      try{seconds=Number(state.creatorTimerSeconds)||0;}catch(e){}
      if(!seconds||window.__ktCreatorTimerRunning)return originalStartCreatorRecording.apply(this,args);
      window.__ktCreatorTimerRunning=true;
      var left=seconds;
      var badge=document.createElement('div');
      badge.id='ktCreatorTimerBadge';
      badge.style.cssText='position:absolute;z-index:9999;left:50%;top:42%;transform:translate(-50%,-50%);width:92px;height:92px;border-radius:50%;display:grid;place-items:center;background:rgba(0,0,0,.55);color:#fff;font:900 48px system-ui;pointer-events:none';
      badge.textContent=String(left);
      var root=document.getElementById('creator');
      if(root)root.appendChild(badge);
      var timer=setInterval(function(){
        left--;
        if(left>0){badge.textContent=String(left);return;}
        clearInterval(timer);
        if(badge&&badge.parentNode)badge.parentNode.removeChild(badge);
        window.__ktCreatorTimerRunning=false;
        originalStartCreatorRecording.apply(window,args);
      },1000);
    };
  }

  bindMissing();
  [100,300,700,1400,2500].forEach(function(ms){setTimeout(bindMissing,ms);});
  try{
    var observer=new MutationObserver(function(){clearTimeout(window.__ktCreatorControlTimer);window.__ktCreatorControlTimer=setTimeout(bindMissing,30);});
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 2026-09-15 공유 버튼을 눌렀을 때 AI 사용안내 인사말이 잘못 시작되는 현상만 차단. 공유 기능 자체는 그대로 둠. */
(function(){
  if(window.__ktShareNoAiGreeting20260915)return;
  window.__ktShareNoAiGreeting20260915=true;

  function isShareTarget(e){
    var el=e.target&&e.target.closest?e.target.closest('button,a,span,[role="button"]'):null;
    if(!el)return false;
    var text=String(el.textContent||el.getAttribute('aria-label')||'').replace(/\s+/g,'');
    var onclick=String(el.getAttribute('onclick')||'');
    return text.indexOf('공유')>-1||onclick.indexOf('shareApp')>-1;
  }

  function suppressGuideGreeting(e){
    if(!isShareTarget(e))return;
    var hadState=false,previous=true;
    try{
      hadState=!!window.state&&typeof state.aiVoiceOn!=='undefined';
      if(hadState){previous=state.aiVoiceOn;state.aiVoiceOn=false;}
    }catch(_e){}
    try{if(window.speechSynthesis)speechSynthesis.cancel();}catch(_e2){}
    setTimeout(function(){
      try{if(hadState)state.aiVoiceOn=previous;}catch(_e3){}
    },0);
  }

  document.addEventListener('touchend',suppressGuideGreeting,true);
  document.addEventListener('click',suppressGuideGreeting,true);
})();


/* AI DJ 자리비움 24시간 모드.
   호스트/운영진이 자리를 비울 때 공개도메인 음원 + AI DJ 화면으로 송출을 전환한다.
   브라우저/휴대폰이 실제로 켜져 있는 동안 연속 운영한다. */
(function(){
  if(window.__ktAiDj24hTakeover20260927)return;
  window.__ktAiDj24hTakeover20260927=true;

  var originalStream=null, aiStream=null, canvas=null, ctx=null, raf=0;
  var audio=null, audioCtx=null, audioSrc=null, audioDest=null;
  var wakeLock=null, active=false, trackIndex=0, djImage=null;
  var guestLyricState={};

  function isHostRoom(){
    if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
    return !!document.querySelector(
      '#screen .ktsolo-room,#screen .ktg9-room,#screen .ktg13-room,'+
      '#screen .ktsubscriber-room,#screen .ktsecret-room'
    );
  }
  function isOwner(){
    try{return typeof window.ktIsOwnerAdmin==='function'&&window.ktIsOwnerAdmin();}catch(e){return false;}
  }
  function allowedTracks(){
    try{
      return (window.ktCreatorTracks||[]).filter(function(t){
        if(!t||!t.url)return false;
        var src=String(t.source||'');
        /* AI 음악방은 앱에 라이선스가 명시된 곡만 자동재생:
           Public Domain 또는 CC BY / CC BY-SA. */
        return /퍼블릭도메인|CC BY(?:-SA)?/i.test(src);
      });
    }catch(e){return [];}
  }
  function ensureImage(){
    if(djImage)return;
    djImage=new Image();
    try{djImage.src=window.KT_AI_DJ_PHOTO||'';}catch(e){djImage.src='';}
  }
  function ensureCanvas(){
    if(canvas)return;
    canvas=document.createElement('canvas');
    canvas.width=720;canvas.height=1280;
    canvas.style.display='none';
    document.body.appendChild(canvas);
    ctx=canvas.getContext('2d',{alpha:false});
    ensureImage();
  }
  function draw(){
    if(!active||!ctx)return;
    var w=canvas.width,h=canvas.height;
    ctx.fillStyle='#050505';ctx.fillRect(0,0,w,h);
    try{
      if(djImage&&djImage.complete&&djImage.naturalWidth){
        var s=Math.max(w/djImage.naturalWidth,h/djImage.naturalHeight);
        var dw=djImage.naturalWidth*s,dh=djImage.naturalHeight*s;
        ctx.drawImage(djImage,(w-dw)/2,(h-dh)/2,dw,dh);
      }
    }catch(e){}
    var g=ctx.createLinearGradient(0,0,0,h);
    g.addColorStop(0,'rgba(0,0,0,.22)');
    g.addColorStop(.68,'rgba(0,0,0,.05)');
    g.addColorStop(1,'rgba(0,0,0,.72)');
    ctx.fillStyle=g;ctx.fillRect(0,0,w,h);

    ctx.fillStyle='rgba(0,0,0,.62)';
    ctx.fillRect(22,26,w-44,66);
    ctx.strokeStyle='rgba(255,181,90,.62)';ctx.lineWidth=2;ctx.strokeRect(22,26,w-44,66);
    ctx.fillStyle='#ffd79f';ctx.font='900 30px system-ui,sans-serif';ctx.textAlign='center';
    ctx.fillText('K-Talk  |  AI 음악방  |  ● LIVE',w/2,69);

    var base=h-92,t=Date.now()/180;
    for(var i=0;i<52;i++){
      var bh=18+Math.abs(Math.sin(t+i*.63))*70;
      var x=18+i*((w-36)/52);
      var hue=(i*7+Date.now()/40)%360;
      ctx.fillStyle='hsl('+hue+' 88% 58%)';
      ctx.fillRect(x,base-bh,8,bh);
    }
    ctx.fillStyle='rgba(0,0,0,.58)';ctx.fillRect(0,h-72,w,72);
    ctx.fillStyle='#fff';ctx.font='800 22px system-ui,sans-serif';ctx.textAlign='left';
    ctx.fillText('🎧 AI DJ 자동 방송 · 신청곡 접수',24,h-32);
    raf=requestAnimationFrame(draw);
  }

  async function acquireWake(){
    try{
      if('wakeLock' in navigator){
        wakeLock=await navigator.wakeLock.request('screen');
      }
    }catch(e){}
  }
  async function setupAudio(){
    var list=allowedTracks();
    if(!list.length)throw new Error('no public domain track');
    audio=new Audio();
    audio.crossOrigin='anonymous';
    audio.preload='auto';
    audio.volume=.92;
    audio.playsInline=true;

    audioCtx=new (window.AudioContext||window.webkitAudioContext)();
    if(audioCtx.state==='suspended')await audioCtx.resume();
    audioSrc=audioCtx.createMediaElementSource(audio);
    audioDest=audioCtx.createMediaStreamDestination();
    audioSrc.connect(audioDest);
    audioSrc.connect(audioCtx.destination);

    audio.addEventListener('ended',playNext);
    audio.addEventListener('error',function(){setTimeout(playNext,700);});
    await playNext();
  }
  async function playNext(){
    if(!active)return;
    var list=allowedTracks();
    if(!list.length)return;
    if(trackIndex>=list.length)trackIndex=0;
    var t=list[trackIndex++];
    try{
      audio.src=t.url;
      audio.load();
      await audio.play();
      try{
        window.__ktAiDjNowPlaying20260927=t.name||'';
        window.__ktAiDjNowSource20260927=t.source||'';
      }catch(e){}
      try{
        var np=document.getElementById('ktAiDjNowPlayingLabel20260927');
        if(np)np.textContent='🎵 '+String(t.name||'곡명 없음')+' · '+String(t.source||'라이선스 확인');
      }catch(e){}
      try{
        if(typeof window.ktSpeak==='function'){
          window.ktSpeak('지금 들려드리는 곡은 '+String(t.name||'음악')+' 입니다.');
        }
      }catch(e){}
    }catch(e){
      setTimeout(playNext,1000);
    }
  }

  function outputStream(){
    ensureCanvas();
    var cv=canvas.captureStream?canvas.captureStream(24):null;
    if(!cv)return null;
    var tracks=[];
    var vt=cv.getVideoTracks&&cv.getVideoTracks()[0];if(vt)tracks.push(vt);
    var at=audioDest&&audioDest.stream&&audioDest.stream.getAudioTracks&&audioDest.stream.getAudioTracks()[0];
    if(at)tracks.push(at);
    return new MediaStream(tracks);
  }
  function attachLocalPreview(stream){
    document.querySelectorAll(
      '#screen .ktsolo-room video,'+
      '#screen .ktg9-room .ktg9-host video,'+
      '#screen .ktg13-room .ktg13-host video,'+
      '#screen .ktsubscriber-room .ktsubscriber-host video,'+
      '#screen .ktsecret-room .host video,#screen .ktsecret-room .ktsecret-host video,#ktLiveVideo'
    ).forEach(function(v){
      try{v.style.opacity='1';v.srcObject=stream;var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    });
  }
  function dispatchStream(stream,replaceAudio){
    try{
      window.dispatchEvent(new CustomEvent('kt-local-video-stream-changed',{
        detail:{stream:stream,replaceAudio:!!replaceAudio,at:Date.now()}
      }));
    }catch(e){}
  }

  async function start(){
    if(active)return;
    if(!isHostRoom()){
      alert('AI 음악 9명방을 먼저 열고 이 버튼을 눌러 주세요.');
      return;
    }
    active=true;
    try{localStorage.setItem('kt_ai_dj_24h_mode_20260927','1');}catch(e){}
    try{
      if(window.state){
        state.ktAiDjRoom=true;
        state.ktAiDj24h=true;
        state.liveRoomName='AI 음악 9명방';
      }
    }catch(e){}
    originalStream=(window.state&&state.stream)||null;
    try{
      if(originalStream&&originalStream.getTracks){
        originalStream.getTracks().forEach(function(t){try{t.enabled=false;}catch(e){}});
      }
    }catch(e){}
    ensureCanvas();
    draw();
    try{await setupAudio();}catch(e){
      active=false;
      alert('AI 음악을 준비하지 못했습니다. 인터넷 연결을 확인해 주세요.');
      return;
    }
    aiStream=outputStream();
    if(!aiStream){
      active=false;alert('이 휴대폰에서는 AI 음악 송출을 만들 수 없습니다.');return;
    }
    try{if(window.state)state.stream=aiStream;}catch(e){}
    attachLocalPreview(aiStream);
    dispatchStream(aiStream,true);
    acquireWake();
    installControl();
    try{if(typeof window.ktSpeak==='function')window.ktSpeak('AI 음악 자동 방송으로 전환했습니다.');}catch(e){}
  }

  async function stop(){
    if(!active)return;
    active=false;
    try{localStorage.removeItem('kt_ai_dj_24h_mode_20260927');}catch(e){}
    try{if(window.state)state.ktAiDj24h=false;}catch(e){}
    if(raf){cancelAnimationFrame(raf);raf=0;}
    try{if(audio){audio.pause();audio.removeAttribute('src');audio.load();}}catch(e){}
    try{if(audioCtx)await audioCtx.close();}catch(e){}
    audio=null;audioCtx=null;audioSrc=null;audioDest=null;
    try{if(aiStream)aiStream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});}catch(e){}
    aiStream=null;
    try{if(wakeLock)await wakeLock.release();}catch(e){}
    wakeLock=null;

    if(originalStream){
      try{originalStream.getTracks().forEach(function(t){if(t.readyState==='live')t.enabled=true;});}catch(e){}
      try{if(window.state)state.stream=originalStream;}catch(e){}
      attachLocalPreview(originalStream);
      dispatchStream(originalStream,true);
    }
    originalStream=null;
    installControl();
  }

  function singerTile(role,viewerId){
    role=String(role||'guest').toLowerCase();
    viewerId=String(viewerId||'').trim();

    if(role==='host'||role==='operator'||role==='운영진'){
      return document.querySelector(
        '#screen .ktg9-room .ktg9-host,'+
        '#screen .ktsolo-room .ktsolo-main,'+
        '#screen .ktg13-room .ktg13-host,'+
        '#screen .ktsubscriber-room .ktsubscriber-host,'+
        '#screen .ktsecret-room .host,#screen .ktsecret-room .ktsecret-host'
      );
    }

    if(viewerId){
      var safe=viewerId.replace(/"/g,'\\\"');
      var q=[
        '[data-viewer-id="'+safe+'"]',
        '[data-guest-viewer-id="'+safe+'"]'
      ];
      for(var i=0;i<q.length;i++){
        try{
          var el=document.querySelector('#screen '+q[i]);
          if(el)return el.closest('.ktg9-guest,.kgh-cell,.kt-approved-guest-cell,.ktg13-guest,.ktsubscriber-guest,.ktsecret-guest-slot,.ktsecret-slot')||el;
        }catch(e){}
      }
    }

    /* viewer id가 없을 때 현재 선택된 게스트를 우선 사용 */
    try{
      var tgt=window.ktGuestGiftTarget||null;
      if(tgt&&tgt.viewerId)return singerTile('guest',tgt.viewerId);
    }catch(e){}
    return null;
  }

  function ensureSingerLyricLabel(tile,role,viewerId){
    if(!tile)return null;
    try{tile.style.setProperty('position','relative','important');}catch(e){}
    var el=tile.querySelector('.kt-singer-lyric');
    if(!el){
      el=document.createElement('div');
      el.className='kt-singer-lyric';
      el.dataset.role=String(role||'guest');
      el.dataset.viewerId=String(viewerId||'');
      tile.appendChild(el);
    }
    return el;
  }

  function singerKey(role,viewerId){
    return String(role||'guest')+':'+String(viewerId||'');
  }

  function clearSingerLyric(role,viewerId){
    var key=singerKey(role,viewerId),st=guestLyricState[key];
    if(st&&st.timer)clearInterval(st.timer);
    delete guestLyricState[key];
    var tile=singerTile(role,viewerId);
    var el=tile&&tile.querySelector('.kt-singer-lyric');
    if(el)el.textContent='';
  }

  window.ktAiDjSingerLyrics20260927=function(role,viewerId,trackName,lines,durationSeconds){
    role=String(role||'guest').toLowerCase();
    viewerId=String(viewerId||'').trim();

    var track=null;
    try{
      track=(window.ktCreatorTracks||[]).find(function(x){
        return String(x&&x.name||'')===String(trackName||'');
      })||null;
    }catch(e){}
    if(!track)return false;

    var src=String(track.source||'');
    if(!/퍼블릭도메인|CC BY(?:-SA)?/i.test(src))return false;

    var arr=Array.isArray(lines)?lines.map(function(x){return String(x||'').trim();}).filter(Boolean):[];
    if(!arr.length)return false;

    clearSingerLyric(role,viewerId);
    var tile=singerTile(role,viewerId);
    var el=ensureSingerLyricLabel(tile,role,viewerId);
    if(!el)return false;

    var idx=0;
    el.textContent=arr[0];

    var total=Math.max(0,Number(durationSeconds)||0);
    var ms=total>0?Math.max(2400,Math.min(9000,Math.floor(total*1000/arr.length))):5200;
    var key=singerKey(role,viewerId);

    var timer=setInterval(function(){
      var tileNow=singerTile(role,viewerId);
      var label=tileNow&&ensureSingerLyricLabel(tileNow,role,viewerId);
      if(!label){clearSingerLyric(role,viewerId);return;}
      idx++;
      if(idx>=arr.length){clearSingerLyric(role,viewerId);return;}
      label.textContent=arr[idx];
    },ms);

    guestLyricState[key]={timer:timer,trackName:String(trackName||''),lines:arr};
    return true;
  };

  window.ktAiDjClearSingerLyrics20260927=clearSingerLyric;

  /* 이전 게스트 전용 호출도 그대로 호환 */
  window.ktAiDjGuestLyrics20260927=function(viewerId,trackName,lines,durationSeconds){
    return window.ktAiDjSingerLyrics20260927('guest',viewerId,trackName,lines,durationSeconds);
  };
  window.ktAiDjClearGuestLyrics20260927=function(viewerId){
    return clearSingerLyric('guest',viewerId);
  };

  window.ktAiDjStart24h20260927=start;
  window.ktAiDjStop24h20260927=stop;
  window.ktAiDjToggle24h20260927=function(){return active?stop():start();};

  function installControl(){
    var old=document.getElementById('ktAiDjAway24hBtn20260927');
    if(!isHostRoom()&&!isOwner()){if(old)old.remove();return;}
    if(!old){
      old=document.createElement('button');
      old.id='ktAiDjAway24hBtn20260927';
      old.type='button';
      old.style.cssText='position:fixed;left:10px;top:104px;z-index:1800;min-width:96px;height:42px;padding:0 9px;border:1px solid #ffb45a99;border-radius:13px;background:rgba(31,17,6,.92);color:#fff;font:950 10px/1.15 system-ui,-apple-system,"Noto Sans KR",sans-serif;box-shadow:0 0 12px #ff9d2b33;touch-action:manipulation';
      old.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(x){}window.ktAiDjToggle24h20260927();};
      document.body.appendChild(old);
    }
    old.textContent=active?'⏹ AI 자동방송 종료':'🚶 자리 비움 → AI';
  }

  document.addEventListener('visibilitychange',function(){
    if(!document.hidden&&active)acquireWake();
  });
  installControl();
  setInterval(installControl,900);
  try{
    new MutationObserver(function(){setTimeout(installControl,20);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
