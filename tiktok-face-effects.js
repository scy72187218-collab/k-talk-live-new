/* K-Talk 얼굴 필터 확장: 기존 편집효과에 얼굴 따라 움직이는 필터만 추가. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktTikTokLikeFaceEffectsInstalled)return;
  window.__ktTikTokLikeFaceEffectsInstalled=true;

  var extra={
    sunglasses:{icon:'🕶️',label:'선글라스',html:'<span class="kt-fx center">🕶️</span>'},
    cap:{icon:'🧢',label:'모자',html:'<span class="kt-fx top">🧢</span>'},
    puppy:{icon:'🐶',label:'강아지',html:'<span class="kt-fx top">🐶</span><span class="kt-fx cheek left">🐾</span><span class="kt-fx cheek right">🐾</span>'},
    cat:{icon:'😺',label:'고양이',html:'<span class="kt-fx top">😺</span><span class="kt-fx cheek left">🐾</span><span class="kt-fx cheek right">🐾</span>'},
    bunny:{icon:'🐰',label:'토끼',html:'<span class="kt-fx top">🐰</span><span class="kt-fx cheek left">💗</span><span class="kt-fx cheek right">💗</span>'},
    angel:{icon:'😇',label:'천사',html:'<span class="kt-fx top">😇</span><span class="kt-fx spark1">✨</span><span class="kt-fx spark2">✨</span>'}
  };

  var oldMarkup=window.ktFaceEffectMarkup;
  window.ktFaceEffectMarkup=function(name){
    if(extra[name])return extra[name].html;
    return typeof oldMarkup==='function'?oldMarkup.apply(this,arguments):'';
  };

  var oldApply=window.ktApplyFaceEffect;
  window.ktApplyFaceEffect=function(name,el){
    name=name||'off';
    if(!extra[name]){
      return typeof oldApply==='function'?oldApply.apply(this,arguments):undefined;
    }
    try{
      state.editFilter='';
      state.editSticker=name;
      state.pendingEditEffect=name;
      state.appliedEditEffect=name;
      if(window.ktEnsureFaceEffectStyle)window.ktEnsureFaceEffectStyle();
      var creator=document.getElementById('creator');
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
      var camera=document.getElementById('camera');
      if(camera&&layer&&anchor&&window.ktStartFaceTrackingFor){
        window.ktStartFaceTrackingFor(camera,layer,anchor,'creator');
      }
    }catch(e){}
  };

  function injectCards(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('stage-effect-sheet'))return;
      var grid=sheet.querySelector('.kt-face-effect-grid');
      if(!grid)return;
      Object.keys(extra).forEach(function(name){
        if(grid.querySelector('[data-face-effect="'+name+'"]'))return;
        var info=extra[name];
        var btn=document.createElement('button');
        btn.className='kt-face-effect-card'+((window.state&&state.appliedEditEffect===name)?' on':'');
        btn.setAttribute('data-face-effect',name);
        btn.innerHTML='<span>'+info.icon+'</span><b>'+info.label+'</b>';
        btn.onclick=function(){if(window.setEditEffect)window.setEditEffect(name,btn);};
        grid.appendChild(btn);
      });
    }catch(e){}
  }

  var oldOpen=window.openEditEffectPanel;
  if(typeof oldOpen==='function'){
    window.openEditEffectPanel=function(tab){
      var r=oldOpen.apply(this,arguments);
      if(!tab||tab==='face')setTimeout(injectCards,0);
      return r;
    };
  }

  var style=document.createElement('style');
  style.id='ktTikTokLikeFaceEffectsStyle';
  style.textContent=''
    +'#sheet.stage-effect-sheet .kt-face-effect-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:7px!important}'
    +'#sheet.stage-effect-sheet .kt-face-effect-card{min-height:68px!important;padding:7px 3px!important}'
    +'#sheet.stage-effect-sheet .kt-face-effect-card span{font-size:28px!important}'
    +'#sheet.stage-effect-sheet .kt-face-effect-card b{font-size:9px!important}';
  document.head.appendChild(style);
})();
