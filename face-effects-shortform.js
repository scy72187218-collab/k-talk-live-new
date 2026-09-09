/* K-Talk 얼굴 효과 추가: 휴대폰에서만 숏폼 스타일 효과 확장. 부위별 보정은 건드리지 않음. */
(function(){
  function ktIsPhone(){
    try{
      var ua=String(navigator.userAgent||'');
      if(/iPhone|iPod|Android.*Mobile/i.test(ua))return true;
      var sw=Math.min((window.screen&&screen.width)||window.innerWidth||9999,(window.screen&&screen.height)||window.innerHeight||9999);
      return sw<=600 && (('ontouchstart' in window)||((navigator.maxTouchPoints||0)>0));
    }catch(e){return (window.innerWidth||9999)<=600;}
  }
  if(!ktIsPhone())return;
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

/* 같은 보정/얼굴효과를 4개 방송방 카메라에도 동시에 적용 */
(function(){
  if(document.querySelector('script[data-kt-fourroom-beauty-sync]'))return;
  var s=document.createElement('script');
  s.src='beauty-four-rooms-sync.js?v=20260910a';
  s.async=false;
  s.setAttribute('data-kt-fourroom-beauty-sync','1');
  document.head.appendChild(s);
})();

/* 공개 동영상 오른쪽: 프로필 사진 → 좋아요 → 댓글 → 선물 → 공유 순서만 보강 */
(function(){
  if(document.querySelector('script[data-kt-feed-profile-actions]'))return;
  var s=document.createElement('script');
  s.src='feed-profile-actions.js?v=20260910a';
  s.async=false;
  s.setAttribute('data-kt-feed-profile-actions','1');
  document.head.appendChild(s);
})();

/* 최신 기본 카메라 톤: 외모 형태는 자동 변경하지 않고 노출·색감·선명도만 자연스럽게 정리 */
(function(){
  if(document.querySelector('script[data-kt-camera-natural-look-v3]'))return;
  var s=document.createElement('script');
  s.src='camera-natural-look-v3.js?v=20260910b';
  s.async=false;
  s.setAttribute('data-kt-camera-natural-look-v3','1');
  document.head.appendChild(s);
})();