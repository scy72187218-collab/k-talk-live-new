/* K-Talk 재미 얼굴 효과 20개 추가. 기존 방송/촬영/비밀번호 기능은 건드리지 않음. */
(function(){
  if(window.__ktFunFaceFiltersInstalled)return;
  window.__ktFunFaceFiltersInstalled=true;

  var extras=[
    ['crown2','👑','왕관','<span class="kt-fx top">👑</span>'],
    ['glasses2','🕶️','선글라스','<span class="kt-fx center" style="top:43%;font-size:clamp(48px,46%,96px)">🕶️</span>'],
    ['cap2','🧢','모자','<span class="kt-fx top">🧢</span>'],
    ['cat2','🐱','고양이','<span class="kt-fx top">🐱</span>'],
    ['bunny2','🐰','토끼','<span class="kt-fx top">🐰</span>'],
    ['puppy2','🐶','강아지','<span class="kt-fx top">🐶</span>'],
    ['angel2','😇','천사','<span class="kt-fx top">😇</span>'],
    ['butterfly2','🦋','나비','<span class="kt-fx side-left">🦋</span><span class="kt-fx side-right">🦋</span>'],
    ['rainbow2','🌈','무지개','<span class="kt-fx top">🌈</span>'],
    ['stars2','🌟','별빛','<span class="kt-fx spark1">🌟</span><span class="kt-fx spark2">⭐</span><span class="kt-fx spark3">✨</span><span class="kt-fx spark4">⭐</span>'],
    ['music2','🎵','음악','<span class="kt-fx side-left">🎵</span><span class="kt-fx side-right">🎶</span>'],
    ['fire2','🔥','불꽃','<span class="kt-fx side-left">🔥</span><span class="kt-fx side-right">🔥</span>'],
    ['snow2','❄️','눈꽃','<span class="kt-fx spark1">❄️</span><span class="kt-fx spark2">❄️</span><span class="kt-fx spark3">❄️</span><span class="kt-fx spark4">❄️</span>'],
    ['moon2','🌙','달빛','<span class="kt-fx top">🌙✨</span>'],
    ['cloud2','☁️','구름','<span class="kt-fx top">☁️☁️</span>'],
    ['confetti2','🎊','축하','<span class="kt-fx side-left">🎊</span><span class="kt-fx side-right">🎉</span>'],
    ['flower2','🌺','꽃왕관','<span class="kt-fx top">🌺🌼🌺</span>'],
    ['heart2','💖','하트빛','<span class="kt-fx top">💖</span><span class="kt-fx cheek left">💕</span><span class="kt-fx cheek right">💕</span>'],
    ['sparkle2','✨','반짝','<span class="kt-fx spark1">✨</span><span class="kt-fx spark2">💫</span><span class="kt-fx spark3">✨</span><span class="kt-fx spark4">💫</span>'],
    ['smile2','😊','스마일','<span class="kt-fx side-left">😊</span><span class="kt-fx side-right">😊</span>']
  ];

  var markup={};
  extras.forEach(function(it){markup[it[0]]=it[3];});

  var oldMarkup=window.ktFaceEffectMarkup;
  window.ktFaceEffectMarkup=function(name){
    if(markup[name])return markup[name];
    return typeof oldMarkup==='function'?oldMarkup.apply(this,arguments):'';
  };

  function addExtraButtons(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('camera-effect-sheet'))return;
      var grid=sheet.querySelector('.kt-face-effect-grid');
      if(!grid)return;
      extras.forEach(function(it){
        if(grid.querySelector('[data-face-effect="'+it[0]+'"]'))return;
        var b=document.createElement('button');
        b.className='kt-face-effect-card'+((window.state&&state.appliedEditEffect===it[0])?' on':'');
        b.setAttribute('data-face-effect',it[0]);
        b.innerHTML='<span>'+it[1]+'</span><b>'+it[2]+'</b>';
        b.onclick=function(){if(window.setEditEffect)window.setEditEffect(it[0],b);};
        grid.appendChild(b);
      });
      if(!grid.previousElementSibling||!grid.previousElementSibling.classList.contains('kt-fun-filter-note')){
        var note=document.createElement('div');
        note.className='kt-fun-filter-note';
        note.textContent='재미 얼굴 효과 20개';
        grid.parentNode.insertBefore(note,grid);
      }
    }catch(e){}
  }

  var oldOpen=window.openEditEffectPanel;
  if(typeof oldOpen==='function'){
    window.openEditEffectPanel=function(tab){
      var r=oldOpen.apply(this,arguments);
      if((tab||'face')==='face')setTimeout(addExtraButtons,0);
      return r;
    };
  }

  if(!document.getElementById('ktFunFaceFilterStyle')){
    var st=document.createElement('style');
    st.id='ktFunFaceFilterStyle';
    st.textContent=''
      +'#sheet.camera-effect-sheet .kt-face-effect-grid{grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:6px!important;max-height:46vh!important;overflow:auto!important;padding-bottom:4px!important}'
      +'#sheet.camera-effect-sheet .kt-face-effect-card{min-height:58px!important;padding:5px 2px!important;border-radius:11px!important}'
      +'#sheet.camera-effect-sheet .kt-face-effect-card span{font-size:22px!important}'
      +'#sheet.camera-effect-sheet .kt-face-effect-card b{font-size:8.5px!important;white-space:nowrap!important}'
      +'#sheet.camera-effect-sheet .kt-fun-filter-note{margin:3px 0 7px!important;color:#ddd!important;font-size:10px!important;font-weight:850!important;text-align:center!important}';
    document.head.appendChild(st);
  }
})();
