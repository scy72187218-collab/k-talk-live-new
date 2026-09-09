/* K-Talk 얼굴 효과 추가: 부위별 보정은 건드리지 않고 숏폼 스타일 재미 효과만 확장 */
(function(){
  if(window.__ktShortformFaceEffectsInstalled)return;
  window.__ktShortformFaceEffectsInstalled=true;

  var extraEffects=[
    ['sunglasses','🕶️','선글라스'],
    ['cap','🧢','모자'],
    ['cat','😺','고양이'],
    ['puppy','🐶','강아지'],
    ['bunny','🐰','토끼'],
    ['angel','😇','천사'],
    ['crown','👑','왕관'],
    ['star','🌟','스타'],
    ['butterfly','🦋','나비'],
    ['rainbow','🌈','무지개'],
    ['music','🎵','음악'],
    ['fire','🔥','불꽃'],
    ['snow','❄️','눈꽃'],
    ['moon','🌙','달빛'],
    ['cloud','☁️','구름'],
    ['confetti','🎊','축하'],
    ['flowercrown','🌺','꽃왕관'],
    ['heartglow','💖','하트빛'],
    ['sparkleplus','✨','반짝'],
    ['smile','😊','스마일']
  ];
  var extraNames=extraEffects.map(function(x){return x[0];});

  var oldMarkup=window.ktFaceEffectMarkup;
  window.ktFaceEffectMarkup=function(name){
    var map={
      sunglasses:'<span class="kt-fx center" style="top:39%;font-size:clamp(54px,48%,98px)">🕶️</span>',
      cap:'<span class="kt-fx top" style="top:-10%">🧢</span>',
      cat:'<span class="kt-fx top" style="top:-7%">🐱</span><span class="kt-fx cheek left">✨</span><span class="kt-fx cheek right">✨</span>',
      puppy:'<span class="kt-fx top" style="top:-7%">🐶</span><span class="kt-fx cheek left">🐾</span><span class="kt-fx cheek right">🐾</span>',
      bunny:'<span class="kt-fx top" style="top:-11%;font-size:clamp(58px,50%,104px)">🐰</span>',
      angel:'<span class="kt-fx top" style="top:-11%">😇</span><span class="kt-fx spark1">✨</span><span class="kt-fx spark2">✨</span>',
      crown:'<span class="kt-fx top" style="top:-12%">👑</span><span class="kt-fx spark1">✨</span><span class="kt-fx spark2">✨</span>',
      star:'<span class="kt-fx spark1">🌟</span><span class="kt-fx spark2">✨</span><span class="kt-fx spark3">⭐</span><span class="kt-fx spark4">✦</span>',
      butterfly:'<span class="kt-fx side-left">🦋</span><span class="kt-fx side-right">🦋</span>',
      rainbow:'<span class="kt-fx top">🌈</span>',
      music:'<span class="kt-fx side-left">🎵</span><span class="kt-fx side-right">🎶</span>',
      fire:'<span class="kt-fx side-left">🔥</span><span class="kt-fx side-right">🔥</span>',
      snow:'<span class="kt-fx spark1">❄️</span><span class="kt-fx spark2">❄️</span><span class="kt-fx spark3">❄️</span><span class="kt-fx spark4">❄️</span>',
      moon:'<span class="kt-fx top">🌙✨</span>',
      cloud:'<span class="kt-fx top">☁️☁️</span>',
      confetti:'<span class="kt-fx side-left">🎊</span><span class="kt-fx side-right">🎉</span>',
      flowercrown:'<span class="kt-fx top">🌺🌼🌺</span>',
      heartglow:'<span class="kt-fx top">💖</span><span class="kt-fx cheek left">💕</span><span class="kt-fx cheek right">💕</span>',
      sparkleplus:'<span class="kt-fx spark1">✨</span><span class="kt-fx spark2">💫</span><span class="kt-fx spark3">✨</span><span class="kt-fx spark4">💫</span>',
      smile:'<span class="kt-fx side-left">😊</span><span class="kt-fx side-right">😊</span>'
    };
    if(map[name])return map[name];
    return typeof oldMarkup==='function'?oldMarkup.apply(this,arguments):'';
  };

  var oldApply=window.ktApplyFaceEffect;
  window.ktApplyFaceEffect=function(name,el){
    name=name||'off';
    if(extraNames.indexOf(name)===-1){
      return typeof oldApply==='function'?oldApply.apply(this,arguments):undefined;
    }
    try{
      state.editFilter='';
      state.editSticker=name;
      state.pendingEditEffect=name;
      state.appliedEditEffect=name;
      if(window.ktEnsureFaceEffectStyle)ktEnsureFaceEffectStyle();
      var creator=document.getElementById('creator');
      var camera=document.getElementById('camera');
      if(!creator)return;
      var layer=document.getElementById('ktFaceEffectLayer');
      if(!layer){
        layer=document.createElement('div');
        layer.id='ktFaceEffectLayer';
        layer.innerHTML='<div id="ktFaceAnchor"></div>';
        creator.appendChild(layer);
      }
      var anchor=document.getElementById('ktFaceAnchor');
      if(anchor)anchor.innerHTML=window.ktFaceEffectMarkup(name);
      document.querySelectorAll('.kt-face-effect-card').forEach(function(btn){
        btn.classList.toggle('on',btn.getAttribute('data-face-effect')===name);
      });
      if(camera&&layer&&anchor&&window.ktStartFaceTrackingFor)ktStartFaceTrackingFor(camera,layer,anchor,'creator');
    }catch(e){}
  };

  if(!document.getElementById('ktShortformFaceEffectsStyle')){
    var st=document.createElement('style');
    st.id='ktShortformFaceEffectsStyle';
    st.textContent=''
      +'#sheet.camera-effect-sheet .kt-face-effect-grid{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:6px!important;max-height:46vh!important;overflow:auto!important;padding-bottom:4px!important}'
      +'#sheet.camera-effect-sheet .kt-face-effect-card{min-height:58px!important;padding:5px 2px!important;border-radius:11px!important}'
      +'#sheet.camera-effect-sheet .kt-face-effect-card span{font-size:22px!important}'
      +'#sheet.camera-effect-sheet .kt-face-effect-card b{font-size:8.5px!important;white-space:nowrap!important}';
    document.head.appendChild(st);
  }

  var oldOpen=window.openEditEffectPanel;
  if(typeof oldOpen==='function'){
    window.openEditEffectPanel=function(tab){
      var r=oldOpen.apply(this,arguments);
      if((tab||'face')!=='face')return r;
      setTimeout(function(){
        try{
          var grid=document.querySelector('#sheet .kt-face-effect-grid');
          if(!grid)return;
          extraEffects.forEach(function(it){
            if(grid.querySelector('[data-face-effect="'+it[0]+'"]'))return;
            var b=document.createElement('button');
            b.className='kt-face-effect-card'+((window.state&&state.appliedEditEffect===it[0])?' on':'');
            b.setAttribute('data-face-effect',it[0]);
            b.innerHTML='<span>'+it[1]+'</span><b>'+it[2]+'</b>';
            b.onclick=function(){if(window.setEditEffect)window.setEditEffect(it[0],b);};
            grid.appendChild(b);
          });
        }catch(e){}
      },0);
      return r;
    };
  }
})();
