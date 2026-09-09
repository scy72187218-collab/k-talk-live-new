/* K-Talk 얼굴 효과 추가: 부위별 보정은 건드리지 않고 숏폼 스타일 효과만 확장 */
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
    ['star','🌟','스타']
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
      star:'<span class="kt-fx spark1">🌟</span><span class="kt-fx spark2">✨</span><span class="kt-fx spark3">⭐</span><span class="kt-fx spark4">✦</span>'
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
