/* K-Talk 편집효과: 한국 남자/한국 여자 실제 사진 프리셋. 사진을 누르면 카메라 톤이 즉시 바뀜. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktKoreanFacePresetsInstalled)return;
  window.__ktKoreanFacePresetsInstalled=true;

  var PHOTO={
    male:'https://images.unsplash.com/photo-1544032527-816db7031a16?auto=format&fit=crop&w=360&h=360&q=82',
    female:'https://images.unsplash.com/photo-1699273379193-ab9b36f5078b?auto=format&fit=crop&w=360&h=360&q=82'
  };

  function avatar(kind){
    return kind==='male'?PHOTO.male:PHOTO.female;
  }

  function applyVisiblePhotoEffect(kind){
    var list=[document.getElementById('camera'),document.getElementById('cameraBg')];
    list.forEach(function(v){
      if(!v)return;
      try{
        v.style.setProperty('transition','filter .18s ease','important');
        if(kind==='male'){
          v.style.setProperty('filter','brightness(1.055) contrast(1.060) saturate(1.035)','important');
        }else{
          v.style.setProperty('filter','brightness(1.075) contrast(1.000) saturate(1.045)','important');
        }
      }catch(e){}
    });
  }

  function applyPreset(kind,el){
    try{
      if(window.state){
        state.beautyOn=true;
        if(kind==='male'){
          state.beautyStrength=74;
          state.beautySkin=86;
          state.beautyWrinkle=76;
          state.beautyBright=69;
          state.beautyTone=56;
          state.beautySharp=54;
          state.beautyEyes=52;
          state.beautyNose=50;
          state.beautyMouth=50;
          state.ktKoreanPhotoPreset='male';
        }else{
          state.beautyStrength=76;
          state.beautySkin=88;
          state.beautyWrinkle=78;
          state.beautyBright=72;
          state.beautyTone=59;
          state.beautySharp=50;
          state.beautyEyes=53;
          state.beautyNose=50;
          state.beautyMouth=51;
          state.ktKoreanPhotoPreset='female';
        }
      }
      if(typeof window.applyBeautyPreview==='function')window.applyBeautyPreview();
      applyVisiblePhotoEffect(kind);
      requestAnimationFrame(function(){applyVisiblePhotoEffect(kind);});
      setTimeout(function(){applyVisiblePhotoEffect(kind);},80);
      setTimeout(function(){applyVisiblePhotoEffect(kind);},220);
      if(window.ktSyncBeautyToFourRooms)setTimeout(function(){try{window.ktSyncBeautyToFourRooms();}catch(e){}},0);
      document.querySelectorAll('.kt-korean-photo-card').forEach(function(b){b.classList.remove('on');b.setAttribute('aria-pressed','false');});
      if(el){el.classList.add('on');el.setAttribute('aria-pressed','true');}
    }catch(e){}
  }
  window.ktApplyKoreanPhotoPreset=applyPreset;

  /* 다른 보정 코드가 필터를 다시 계산해도 선택한 사진 프리셋이 유지되게 마지막에 한 번 더 적용 */
  var oldBeauty=window.applyBeautyPreview;
  if(typeof oldBeauty==='function'&&!oldBeauty.__ktKoreanPresetWrapped){
    var wrappedBeauty=function(){
      var r=oldBeauty.apply(this,arguments);
      try{
        var chosen=(window.state&&state.ktKoreanPhotoPreset)||'';
        if(chosen==='male'||chosen==='female')applyVisiblePhotoEffect(chosen);
      }catch(e){}
      return r;
    };
    wrappedBeauty.__ktKoreanPresetWrapped=true;
    window.applyBeautyPreview=wrappedBeauty;
  }

  function ensureStyle(){
    if(document.getElementById('ktKoreanPhotoPresetStyle'))return;
    var st=document.createElement('style');
    st.id='ktKoreanPhotoPresetStyle';
    st.textContent=''
      +'.kt-korean-photo-card{touch-action:manipulation!important;cursor:pointer!important;position:relative!important;z-index:30!important;pointer-events:auto!important}'
      +'.kt-korean-photo-card *{pointer-events:none!important}'
      +'.kt-korean-photo-card.on{outline:3px solid #ff2f92!important;outline-offset:2px!important;box-shadow:0 0 0 2px rgba(255,255,255,.55),0 0 18px rgba(255,47,146,.7)!important}'
      +'.kt-korean-photo-card.on::after{content:"적용됨";position:absolute;right:4px;top:4px;padding:2px 5px;border-radius:8px;background:#ff2f92;color:#fff;font-size:9px;font-weight:900;z-index:3}'
      +'.kt-korean-photo-card .kt-real-look-photo{background:#111!important}'
      +'.kt-korean-photo-card img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center 30%!important;filter:none!important}';
    document.head.appendChild(st);
  }

  function addCards(){
    try{
      ensureStyle();
      var sheet=document.getElementById('sheet');
      var grid=sheet&&sheet.querySelector('.kt-face-effect-grid');
      if(!grid)return;
      if(!grid.querySelector('.kt-korean-photo-card')){
        var wrap=document.createElement('div');
        wrap.style.display='contents';
        wrap.innerHTML=''
          +'<button class="kt-face-effect-card kt-real-look-card kt-korean-photo-card" data-kt-kind="male" type="button" aria-pressed="false" onclick="ktApplyKoreanPhotoPreset(\'male\',this)"><span class="kt-real-look-photo"><img alt="한국 남자 실제 사진 프리셋" src="'+avatar('male')+'" loading="eager"></span><b>한국 남자</b><small>누르면 바로 적용</small></button>'
          +'<button class="kt-face-effect-card kt-real-look-card kt-korean-photo-card" data-kt-kind="female" type="button" aria-pressed="false" onclick="ktApplyKoreanPhotoPreset(\'female\',this)"><span class="kt-real-look-photo"><img alt="한국 여자 실제 사진 프리셋" src="'+avatar('female')+'" loading="eager"></span><b>한국 여자</b><small>누르면 바로 적용</small></button>';
        var nodes=[].slice.call(wrap.children);
        for(var i=nodes.length-1;i>=0;i--)grid.insertBefore(nodes[i],grid.firstChild);
      }
      var chosen='';
      try{chosen=(window.state&&state.ktKoreanPhotoPreset)||'';}catch(e){}
      grid.querySelectorAll('.kt-korean-photo-card').forEach(function(btn){
        var k=btn.getAttribute('data-kt-kind')||'';
        var on=k===chosen;
        btn.classList.toggle('on',on);
        btn.setAttribute('aria-pressed',on?'true':'false');
      });
    }catch(e){}
  }

  var oldOpen=window.openEditEffectPanel;
  if(typeof oldOpen==='function'){
    window.openEditEffectPanel=function(tab){
      var r=oldOpen.apply(this,arguments);
      if((tab||'face')==='face'){
        setTimeout(addCards,20);
        setTimeout(addCards,90);
      }
      return r;
    };
  }

  /* 인앱 브라우저에서도 사진 카드 터치가 빠지지 않게 보강 */
  document.addEventListener('pointerup',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('.kt-korean-photo-card'):null;
    if(!btn)return;
    var kind=btn.getAttribute('data-kt-kind');
    if(kind==='male'||kind==='female')applyPreset(kind,btn);
  },true);

  var observer=new MutationObserver(function(){
    try{
      var sheet=document.getElementById('sheet');
      if(sheet&&sheet.classList.contains('stage-effect-sheet'))addCards();
    }catch(e){}
  });
  try{observer.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
