/* K-Talk 편집효과: 틱톡식 사진 카드에 한국 남자/한국 여자 프리셋 2개만 추가. 기존 얼굴효과/보정은 그대로 유지. */
(function(){
  if(window.__ktKoreanFacePresetsInstalled)return;
  window.__ktKoreanFacePresetsInstalled=true;

  function avatar(kind){
    var male=kind==='male';
    var bg=male?'#2b344a':'#493246';
    var hair=male?'#17191f':'#25171d';
    var shirt=male?'#3d6fa8':'#9a5f86';
    var hairPath=male
      ?'<path d="M34 46c4-21 18-30 32-30 19 0 29 12 31 31-8-7-17-11-28-11-13 0-24 4-35 10z" fill="'+hair+'"/>'
      :'<path d="M29 49c1-25 16-35 36-35 22 0 36 14 37 39-2 22-8 35-15 45l-8-11c8-10 10-22 8-35-4-14-12-21-24-21-14 0-23 8-27 24-2 14 1 26 8 36l-9 10c-7-13-9-31-6-52z" fill="'+hair+'"/>';
    var svg='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">'
      +'<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+bg+'"/><stop offset="1" stop-color="#11151f"/></linearGradient></defs>'
      +'<rect width="128" height="128" rx="18" fill="url(#g)"/>'
      +'<circle cx="64" cy="61" r="31" fill="#f0c3a5"/>'
      +hairPath
      +'<path d="M45 60c5-4 10-4 15 0M69 60c5-4 10-4 15 0" fill="none" stroke="#4b352d" stroke-width="2.3" stroke-linecap="round"/>'
      +'<circle cx="53" cy="64" r="2.1" fill="#2a2524"/><circle cx="76" cy="64" r="2.1" fill="#2a2524"/>'
      +'<path d="M63 67c-2 5-2 8 2 9" fill="none" stroke="#b77f69" stroke-width="2" stroke-linecap="round"/>'
      +'<path d="M54 82c7 5 15 5 21 0" fill="none" stroke="#9f5f60" stroke-width="2.2" stroke-linecap="round"/>'
      +'<path d="M27 128c3-25 18-38 37-38s35 13 38 38" fill="'+shirt+'"/>'
      +'</svg>';
    return 'data:image/svg+xml;charset=UTF-8,'+encodeURIComponent(svg);
  }

  function applyPreset(kind,el){
    try{
      if(window.state){
        state.beautyOn=true;
        if(kind==='male'){
          state.beautyStrength=72;
          state.beautySkin=86;
          state.beautyWrinkle=76;
          state.beautyBright=68;
          state.beautyTone=56;
          state.beautySharp=52;
          state.ktKoreanPhotoPreset='male';
        }else{
          state.beautyStrength=76;
          state.beautySkin=90;
          state.beautyWrinkle=80;
          state.beautyBright=72;
          state.beautyTone=60;
          state.beautySharp=48;
          state.ktKoreanPhotoPreset='female';
        }
      }
      if(typeof window.ktApplyRealLook==='function')window.ktApplyRealLook(kind==='male'?'real-clear':'real-soft');
      if(typeof window.applyBeautyPreview==='function')window.applyBeautyPreview();
      document.querySelectorAll('.kt-korean-photo-card').forEach(function(b){b.classList.remove('on');});
      if(el)el.classList.add('on');
    }catch(e){}
  }
  window.ktApplyKoreanPhotoPreset=applyPreset;

  function addCards(){
    try{
      var sheet=document.getElementById('sheet');
      var grid=sheet&&sheet.querySelector('.kt-face-effect-grid');
      if(!grid||grid.querySelector('.kt-korean-photo-card'))return;
      var wrap=document.createElement('div');
      wrap.style.display='contents';
      wrap.innerHTML=''
        +'<button class="kt-face-effect-card kt-real-look-card kt-korean-photo-card" type="button" onclick="ktApplyKoreanPhotoPreset(\'male\',this)"><span class="kt-real-look-photo"><img alt="한국 남자 스타일 프리셋" src="'+avatar('male')+'"></span><b>한국 남자</b><small>사진 프리셋</small></button>'
        +'<button class="kt-face-effect-card kt-real-look-card kt-korean-photo-card" type="button" onclick="ktApplyKoreanPhotoPreset(\'female\',this)"><span class="kt-real-look-photo"><img alt="한국 여자 스타일 프리셋" src="'+avatar('female')+'"></span><b>한국 여자</b><small>사진 프리셋</small></button>';
      var nodes=[].slice.call(wrap.children);
      for(var i=nodes.length-1;i>=0;i--)grid.insertBefore(nodes[i],grid.firstChild);
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

  var observer=new MutationObserver(function(){
    try{
      var sheet=document.getElementById('sheet');
      if(sheet&&sheet.classList.contains('stage-effect-sheet'))addCards();
    }catch(e){}
  });
  try{observer.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
