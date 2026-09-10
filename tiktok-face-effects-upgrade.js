/* K-Talk 편집효과 전용 업그레이드: 기존 사진 프리셋은 그대로 두고 틱톡식 얼굴 추적 효과 24개를 추가. */
(function(){
  if(window.__ktTikTokFaceEffectsUpgradeInstalled)return;
  window.__ktTikTokFaceEffectsUpgradeInstalled=true;

  var effects=[
    ['off','⊘','없음'],
    ['sunglasses','😎','선글라스'],
    ['cap','🧢','모자'],
    ['cat','🐱','고양이'],
    ['puppy','🐶','강아지'],
    ['bunny','🐰','토끼'],
    ['angel','😇','천사'],
    ['crown','👑','왕관'],
    ['heart','💕','하트'],
    ['flower','🌸','꽃'],
    ['sparkle','✨','반짝이'],
    ['party','🎉','파티'],
    ['blush','🩷','볼터치'],
    ['star','⭐','별'],
    ['snow','❄️','눈꽃'],
    ['flame','🔥','불꽃'],
    ['devil','😈','악마'],
    ['bear','🐻','곰돌이'],
    ['frog','🐸','개구리'],
    ['kiss','💋','키스'],
    ['ribbon','🎀','리본'],
    ['butterfly','🦋','나비'],
    ['rainbow','🌈','무지개'],
    ['diamond','💎','다이아']
  ];

  var supported={};
  effects.forEach(function(e){supported[e[0]]=true;});

  function markup(name){
    var map={
      sunglasses:'<span class="kt-fx center ktfx-glasses">🕶️</span>',
      cap:'<span class="kt-fx top ktfx-cap">🧢</span>',
      cat:'<span class="kt-fx top ktfx-ears">🐱</span>',
      puppy:'<span class="kt-fx top ktfx-ears">🐶</span>',
      bunny:'<span class="kt-fx top ktfx-bunny">🐰</span>',
      angel:'<span class="kt-fx top ktfx-halo">😇</span>',
      crown:'<span class="kt-fx top ktfx-crown">👑</span>',
      heart:'<span class="kt-fx top">💕</span><span class="kt-fx cheek left">💗</span><span class="kt-fx cheek right">💗</span>',
      flower:'<span class="kt-fx top">🌸🌼🌸</span>',
      sparkle:'<span class="kt-fx spark1">✨</span><span class="kt-fx spark2">✨</span><span class="kt-fx spark3">✦</span><span class="kt-fx spark4">✧</span>',
      party:'<span class="kt-fx side-left">🎉</span><span class="kt-fx side-right">🎊</span><span class="kt-fx top">🥳</span>',
      blush:'<span class="kt-fx cheek left ktfx-cheek">🩷</span><span class="kt-fx cheek right ktfx-cheek">🩷</span>',
      star:'<span class="kt-fx top">⭐🌟⭐</span><span class="kt-fx spark1">✨</span><span class="kt-fx spark2">✨</span>',
      snow:'<span class="kt-fx top">❄️❄️</span><span class="kt-fx side-left">❄️</span><span class="kt-fx side-right">❄️</span>',
      flame:'<span class="kt-fx top">🔥🔥🔥</span>',
      devil:'<span class="kt-fx top ktfx-ears">😈</span>',
      bear:'<span class="kt-fx top ktfx-ears">🐻</span>',
      frog:'<span class="kt-fx top ktfx-ears">🐸</span>',
      kiss:'<span class="kt-fx cheek left">💋</span><span class="kt-fx cheek right">💋</span>',
      ribbon:'<span class="kt-fx top ktfx-ribbon">🎀</span>',
      butterfly:'<span class="kt-fx side-left">🦋</span><span class="kt-fx side-right">🦋</span><span class="kt-fx top">✨</span>',
      rainbow:'<span class="kt-fx top ktfx-rainbow">🌈</span>',
      diamond:'<span class="kt-fx top">💎</span><span class="kt-fx spark1">✨</span><span class="kt-fx spark2">✨</span><span class="kt-fx spark3">💎</span>'
    };
    return map[name]||'';
  }

  function ensureStyle(){
    if(document.getElementById('ktTikTokFaceEffectsStyle'))return;
    var st=document.createElement('style');
    st.id='ktTikTokFaceEffectsStyle';
    st.textContent=''
      +'#sheet.camera-effect-sheet .kt-face-effect-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:7px!important;max-height:45vh!important;overflow-y:auto!important;padding:2px 2px 8px!important}'
      +'#sheet.camera-effect-sheet .kt-tiktok-effect-card{min-height:68px!important;padding:7px 3px!important;border-radius:14px!important}'
      +'#sheet.camera-effect-sheet .kt-tiktok-effect-card span{font-size:27px!important}'
      +'#sheet.camera-effect-sheet .kt-tiktok-effect-card b{font-size:9px!important;white-space:nowrap!important}'
      +'#sheet.camera-effect-sheet .kt-tiktok-effect-label{grid-column:1/-1!important;display:block!important;margin:5px 0 1px!important;padding:6px 8px!important;border-radius:10px!important;background:rgba(255,255,255,.06)!important;color:#fff!important;font-size:11px!important;font-weight:900!important;text-align:left!important}'
      +'#ktFaceAnchor .ktfx-glasses{top:40%!important;font-size:70px!important}'
      +'#ktFaceAnchor .ktfx-cap{top:-8%!important;font-size:72px!important}'
      +'#ktFaceAnchor .ktfx-ears{top:-8%!important;font-size:72px!important}'
      +'#ktFaceAnchor .ktfx-bunny{top:-13%!important;font-size:78px!important}'
      +'#ktFaceAnchor .ktfx-halo{top:-10%!important;font-size:70px!important}'
      +'#ktFaceAnchor .ktfx-crown{top:-9%!important;font-size:72px!important}'
      +'#ktFaceAnchor .ktfx-cheek{font-size:30px!important;opacity:.78!important}'
      +'#ktFaceAnchor .ktfx-ribbon{top:-7%!important;font-size:68px!important}'
      +'#ktFaceAnchor .ktfx-rainbow{top:-8%!important;font-size:72px!important}';
    document.head.appendChild(st);
  }

  function ensureLayer(){
    try{if(window.ktEnsureFaceEffectStyle)window.ktEnsureFaceEffectStyle();}catch(e){}
    ensureStyle();
    var layer=document.getElementById('ktFaceEffectLayer');
    if(!layer){
      layer=document.createElement('div');
      layer.id='ktFaceEffectLayer';
      layer.innerHTML='<div id="ktFaceAnchor"></div>';
      var creator=document.getElementById('creator');
      var camera=document.getElementById('camera');
      if(creator&&camera&&camera.parentNode===creator)creator.insertBefore(layer,camera.nextSibling);
      else if(creator)creator.appendChild(layer);
    }
    return {layer:layer,anchor:document.getElementById('ktFaceAnchor')};
  }

  var oldSet=window.setEditEffect;
  var oldPreview=window.previewEditEffect;
  var oldApply=window.applyEditEffect;
  var oldRender=window.renderFaceEffect;

  function applyEffect(name,el){
    name=name||'off';
    if(name==='off'){
      try{if(window.clearAllFaceEffects)window.clearAllFaceEffects();}catch(e){}
      return;
    }
    if(!supported[name])return;
    try{
      if(window.state){
        state.ktRealLook='real-original';
        state.ktKoreanPhotoPreset='';
        state.editFilter='';
        state.editSticker=name;
        state.pendingEditEffect=name;
        state.appliedEditEffect=name;
      }
      if(typeof window.applyBeautyPreview==='function')window.applyBeautyPreview();
    }catch(e){}
    var p=ensureLayer();
    if(p.anchor)p.anchor.innerHTML=markup(name);
    document.querySelectorAll('.kt-face-effect-card').forEach(function(btn){
      btn.classList.toggle('on',btn.getAttribute('data-face-effect')===name);
    });
    try{
      var camera=document.getElementById('camera');
      if(camera&&p.layer&&p.anchor&&window.ktStartFaceTrackingFor)window.ktStartFaceTrackingFor(camera,p.layer,p.anchor,'creator');
    }catch(e){}
  }

  window.setEditEffect=function(name,el){
    if(supported[name])return applyEffect(name,el);
    if(typeof oldSet==='function')return oldSet.apply(this,arguments);
  };
  window.previewEditEffect=function(name,el){
    if(supported[name])return applyEffect(name,el);
    if(typeof oldPreview==='function')return oldPreview.apply(this,arguments);
  };
  window.applyEditEffect=function(name,el){
    name=name||(window.state&&state.pendingEditEffect)||(window.state&&state.appliedEditEffect)||'off';
    if(supported[name])return applyEffect(name,el);
    if(typeof oldApply==='function')return oldApply.apply(this,arguments);
  };
  window.renderFaceEffect=function(name){
    name=name||(window.state&&state.appliedEditEffect)||'off';
    if(supported[name])return applyEffect(name);
    if(typeof oldRender==='function')return oldRender.apply(this,arguments);
  };

  function addTikTokCards(){
    ensureStyle();
    var sheet=document.getElementById('sheet');
    if(!sheet||!sheet.classList.contains('camera-effect-sheet'))return;
    var grid=sheet.querySelector('.kt-face-effect-grid');
    if(!grid||grid.querySelector('.kt-tiktok-effect-label'))return;

    var label=document.createElement('div');
    label.className='kt-tiktok-effect-label';
    label.textContent='얼굴 따라가는 재미 효과';
    grid.appendChild(label);

    var current=(window.state&&state.appliedEditEffect)||'off';
    effects.forEach(function(it){
      if(it[0]==='off'&&grid.querySelector('[data-face-effect="off"]'))return;
      var b=document.createElement('button');
      b.type='button';
      b.className='kt-face-effect-card kt-tiktok-effect-card '+(current===it[0]?'on':'');
      b.setAttribute('data-face-effect',it[0]);
      b.innerHTML='<span>'+it[1]+'</span><b>'+it[2]+'</b>';
      b.onclick=function(){window.setEditEffect(it[0],b);};
      grid.appendChild(b);
    });
  }

  var oldOpen=window.openEditEffectPanel;
  if(typeof oldOpen==='function'){
    window.openEditEffectPanel=function(tab){
      var which=tab||'face';
      var r=oldOpen.apply(this,arguments);
      if(which!=='background'){
        setTimeout(addTikTokCards,120);
        setTimeout(addTikTokCards,220);
      }
      return r;
    };
  }

  var observer=new MutationObserver(function(){
    try{
      var sheet=document.getElementById('sheet');
      if(sheet&&sheet.classList.contains('camera-effect-sheet'))setTimeout(addTikTokCards,130);
    }catch(e){}
  });
  try{observer.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  ensureStyle();
})();
