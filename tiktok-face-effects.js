/* K-Talk 얼굴 효과 확장: 기존 편집효과/배경/방송 기능은 그대로 두고 얼굴 따라다니는 효과만 추가 */
(function(){
  if(window.__ktTikTokFaceEffectsInstalled)return;
  window.__ktTikTokFaceEffectsInstalled=true;

  var oldMarkup=window.ktFaceEffectMarkup;
  if(typeof oldMarkup==='function'){
    window.ktFaceEffectMarkup=function(name){
      var extra={
        glasses:'<span class="kt-fx center" style="top:43%;font-size:clamp(46px,46%,92px)">😎</span>',
        hatfx:'<span class="kt-fx top" style="top:-10%;font-size:clamp(56px,50%,104px)">🧢</span>',
        crownfx:'<span class="kt-fx top" style="top:-11%;font-size:clamp(58px,52%,108px)">👑</span>',
        catfx:'<span class="kt-fx top" style="top:-8%;font-size:clamp(54px,48%,100px)">🐱</span><span class="kt-fx cheek left">💗</span><span class="kt-fx cheek right">💗</span>',
        puppyfx:'<span class="kt-fx top" style="top:-8%;font-size:clamp(54px,48%,100px)">🐶</span><span class="kt-fx center" style="top:60%;font-size:clamp(24px,22%,46px)">🐾</span>',
        bunnyfx:'<span class="kt-fx top" style="top:-16%;font-size:clamp(60px,55%,112px)">🐰</span>',
        angelfx:'<span class="kt-fx top" style="top:-13%;font-size:clamp(62px,56%,114px)">😇</span><span class="kt-fx spark1">✨</span><span class="kt-fx spark2">✨</span>',
        neonfx:'<span class="kt-fx side-left">💜</span><span class="kt-fx side-right">💙</span><span class="kt-fx spark1">✨</span><span class="kt-fx spark2">✨</span>',
        lovefx:'<span class="kt-fx top">💖💗💖</span><span class="kt-fx cheek left">💕</span><span class="kt-fx cheek right">💕</span>',
        starfx:'<span class="kt-fx top">⭐🌟⭐</span><span class="kt-fx spark3">✨</span><span class="kt-fx spark4">✨</span>',
        party2fx:'<span class="kt-fx top">🎀</span><span class="kt-fx side-left">✨</span><span class="kt-fx side-right">✨</span>',
        flower2fx:'<span class="kt-fx top">🌺🌼🌺</span><span class="kt-fx cheek left">🌸</span><span class="kt-fx cheek right">🌸</span>'
      };
      if(extra[name])return extra[name];
      return oldMarkup.apply(this,arguments);
    };
  }

  function decorateFaceGrid(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('camera-effect-sheet'))return;
      var grid=sheet.querySelector('.kt-face-effect-grid');
      if(!grid)return;
      var current=(window.state&&state.appliedEditEffect)||'off';
      var items=[
        ['off','⊘','없음'],['heart','💕','하트'],['flower','🌸','꽃'],['sparkle','✨','반짝이'],
        ['party','🎉','파티'],['glasses','😎','선글라스'],['hatfx','🧢','모자'],['crownfx','👑','왕관'],
        ['catfx','🐱','고양이'],['puppyfx','🐶','강아지'],['bunnyfx','🐰','토끼'],['angelfx','😇','천사'],
        ['lovefx','💖','러브'],['starfx','🌟','별빛'],['neonfx','💜','네온'],['flower2fx','🌺','꽃관'],
        ['party2fx','🎀','리본']
      ];
      grid.innerHTML=items.map(function(it){
        return '<button class="kt-face-effect-card '+(current===it[0]?'on':'')+'" data-face-effect="'+it[0]+'" onclick="setEditEffect(\''+it[0]+'\',this)"><span>'+it[1]+'</span><b>'+it[2]+'</b></button>';
      }).join('');
      grid.style.setProperty('grid-template-columns','repeat(4,minmax(0,1fr))','important');
      grid.style.setProperty('max-height','45vh','important');
      grid.style.setProperty('overflow-y','auto','important');
    }catch(e){}
  }

  var oldOpen=window.openEditEffectPanel;
  if(typeof oldOpen==='function'){
    window.openEditEffectPanel=function(tab){
      var r=oldOpen.apply(this,arguments);
      if((tab||'face')==='face')setTimeout(decorateFaceGrid,0);
      return r;
    };
  }

  var oldSwitch=window.switchEditEffectTab;
  if(typeof oldSwitch==='function'){
    window.switchEditEffectTab=function(tab){
      var r=oldSwitch.apply(this,arguments);
      if(tab==='face')setTimeout(decorateFaceGrid,0);
      return r;
    };
  }
})();
