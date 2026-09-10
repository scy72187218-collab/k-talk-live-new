/* K-Talk 얼굴 효과: 그림/이모지 카드 대신 실제 인물 사진 기반 REAL LOOK 프리셋. 기존 보정·방송 기능은 그대로 유지. */
(function(){
  if(window.__ktRealLookFaceEffectsInstalled)return;
  window.__ktRealLookFaceEffectsInstalled=true;

  var looks=[
    ['real-original','https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=360&q=82','원본',''],
    ['real-natural','https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=360&q=82','내추럴','brightness(1.015) saturate(1.018) contrast(.995)'],
    ['real-soft','https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=360&q=82','소프트','brightness(1.035) saturate(1.015) contrast(.965)'],
    ['real-studio','https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=360&q=82','스튜디오','brightness(1.025) saturate(1.035) contrast(1.035)'],
    ['real-warm','https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=360&q=82','웜','brightness(1.025) saturate(1.07) sepia(.035)'],
    ['real-cool','https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=360&q=82','쿨','brightness(1.015) saturate(.965) contrast(1.025) hue-rotate(-4deg)'],
    ['real-cinema','https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=360&q=82','시네마','brightness(.995) saturate(.93) contrast(1.085)'],
    ['real-clear','https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=360&q=82','클리어','brightness(1.03) saturate(1.025) contrast(1.05)']
  ];
  var lookMap={};
  looks.forEach(function(it){lookMap[it[0]]=it;});

  function currentLook(){
    try{return String((window.state&&state.ktRealLook)||'real-natural');}catch(e){return 'real-natural';}
  }

  function applyLookFilter(){
    try{
      var name=currentLook();
      var extra=(lookMap[name]||lookMap['real-natural'])[3]||'';
      ['camera','cameraBg'].forEach(function(id){
        var v=document.getElementById(id);
        if(!v)return;
        var base=(v.style&&v.style.getPropertyValue('filter'))||'';
        base=String(base||'').replace(/\s*var\(--kt-real-look-extra\)[^;]*/g,'').trim();
        if(extra)v.style.setProperty('filter',(base+' '+extra).trim(),'important');
      });
    }catch(e){}
  }

  var oldBeautyApply=window.applyBeautyPreview;
  if(typeof oldBeautyApply==='function'&&!oldBeautyApply.__ktRealLookWrapped){
    var wrappedBeauty=function(){
      var r=oldBeautyApply.apply(this,arguments);
      applyLookFilter();
      return r;
    };
    wrappedBeauty.__ktRealLookWrapped=true;
    window.applyBeautyPreview=wrappedBeauty;
  }

  window.ktApplyRealLook=function(name,el){
    if(!lookMap[name])name='real-natural';
    try{
      if(window.state){
        state.ktRealLook=name;
        state.editSticker='';
        state.editFilter='';
        state.pendingEditEffect=name;
        state.appliedEditEffect=name;
      }
      var anchor=document.getElementById('ktFaceAnchor');
      if(anchor)anchor.innerHTML='';
      document.querySelectorAll('.kt-face-effect-card').forEach(function(btn){
        btn.classList.toggle('on',btn.getAttribute('data-face-effect')===name);
      });
      if(typeof window.applyBeautyPreview==='function')window.applyBeautyPreview();
      else applyLookFilter();
      if(window.ktSyncBeautyToFourRooms)setTimeout(function(){try{window.ktSyncBeautyToFourRooms();}catch(e){}},0);
    }catch(e){}
  };

  var oldClear=window.clearAllFaceEffects;
  if(typeof oldClear==='function'){
    window.clearAllFaceEffects=function(){
      try{if(window.state)state.ktRealLook='real-original';}catch(e){}
      var r=oldClear.apply(this,arguments);
      try{if(typeof window.applyBeautyPreview==='function')window.applyBeautyPreview();}catch(e){}
      return r;
    };
  }

  function renderRealLookPanel(){
    try{
      var sheet=document.getElementById('sheet');
      var grid=sheet&&sheet.querySelector('.kt-face-effect-grid');
      if(!grid)return;
      var current=currentLook();
      grid.innerHTML=looks.map(function(it){
        return '<button class="kt-face-effect-card kt-real-look-card '+(current===it[0]?'on':'')+'" data-face-effect="'+it[0]+'" type="button" onclick="ktApplyRealLook(\''+it[0]+'\',this)">'
          +'<span class="kt-real-look-photo"><img src="'+it[1]+'" alt="'+it[2]+' 인물 예시" loading="lazy"></span>'
          +'<b>'+it[2]+'</b><small>실제 인물 톤</small></button>';
      }).join('');
      var title=sheet.querySelector('.kt-stage-title');
      if(title)title.innerHTML='<b>REAL LOOK · 실제 인물 프리셋</b><span>그림 대신 실제 인물 예시로 보고 선택합니다. 보정 1~100은 그대로 사용할 수 있습니다.</span>';
      var mainTitle=document.getElementById('sheetTitle');
      if(mainTitle)mainTitle.textContent='편집 효과 · REAL LOOK';
    }catch(e){}
  }

  if(!document.getElementById('ktRealLookFaceEffectStyle')){
    var st=document.createElement('style');
    st.id='ktRealLookFaceEffectStyle';
    st.textContent=''
      +'#sheet.stage-effect-sheet .kt-face-effect-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:8px!important}'
      +'#sheet.stage-effect-sheet .kt-real-look-card{position:relative!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;justify-content:flex-start!important;min-height:116px!important;padding:4px!important;border-radius:15px!important;overflow:hidden!important;background:linear-gradient(180deg,rgba(20,22,30,.96),rgba(8,9,14,.98))!important;border:1px solid rgba(255,255,255,.14)!important;box-shadow:inset 0 0 18px rgba(255,255,255,.025),0 5px 16px rgba(0,0,0,.30)!important}'
      +'#sheet.stage-effect-sheet .kt-real-look-card.on{border-color:#ff4f96!important;box-shadow:0 0 0 2px rgba(255,79,150,.19),0 0 18px rgba(125,92,255,.35)!important}'
      +'#sheet.stage-effect-sheet .kt-real-look-photo{display:block!important;width:100%!important;height:72px!important;border-radius:11px!important;overflow:hidden!important;background:#111!important}'
      +'#sheet.stage-effect-sheet .kt-real-look-photo img{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center 32%!important;filter:none!important}'
      +'#sheet.stage-effect-sheet .kt-real-look-card b{display:block!important;margin-top:5px!important;color:#fff!important;font-size:11px!important;line-height:1.1!important;font-weight:950!important;text-align:center!important}'
      +'#sheet.stage-effect-sheet .kt-real-look-card small{display:block!important;margin-top:2px!important;color:#9fdcff!important;font-size:8px!important;line-height:1!important;text-align:center!important}'
      +'#sheet.stage-effect-sheet .kt-stage-title{padding:9px 10px!important;border-radius:13px!important;background:linear-gradient(135deg,rgba(103,64,255,.18),rgba(0,210,255,.10))!important;border:1px solid rgba(153,130,255,.22)!important}'
      +'#sheet.stage-effect-sheet .kt-stage-title b{color:#fff!important;letter-spacing:.2px!important}'
      +'@media(max-width:390px){#sheet.stage-effect-sheet .kt-face-effect-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:6px!important}#sheet.stage-effect-sheet .kt-real-look-card{min-height:105px!important}#sheet.stage-effect-sheet .kt-real-look-photo{height:63px!important}}';
    document.head.appendChild(st);
  }

  var oldOpen=window.openEditEffectPanel;
  if(typeof oldOpen==='function'){
    window.openEditEffectPanel=function(tab){
      var r=oldOpen.apply(this,arguments);
      if((tab||'face')==='face')setTimeout(renderRealLookPanel,0);
      return r;
    };
  }

  try{
    if(window.state&&!state.ktRealLook)state.ktRealLook='real-natural';
    setTimeout(function(){try{if(typeof window.applyBeautyPreview==='function')window.applyBeautyPreview();}catch(e){}},0);
  }catch(e){}
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

/* AI 보정·편집 효과: 각 화면에 눈에 보이는 나가기 버튼 하나씩 표시 */
(function(){
  if(window.__ktBeautyEditExitButtonInstalled)return;
  window.__ktBeautyEditExitButtonInstalled=true;

  function setExitButton(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('show'))return;
      var titleEl=document.getElementById('sheetTitle');
      var title=String((titleEl&&titleEl.textContent)||'');
      var isBeauty=sheet.classList.contains('beauty-control-sheet')||title.indexOf('보정')>-1;
      var isEdit=sheet.classList.contains('stage-effect-sheet')||sheet.classList.contains('camera-effect-sheet')||title.indexOf('편집 효과')>-1;
      if(!isBeauty&&!isEdit)return;
      var head=sheet.querySelector('.sheet-head');
      if(!head)return;
      var btn=head.querySelector('button');
      if(!btn){
        btn=document.createElement('button');
        head.insertBefore(btn,head.firstChild||null);
      }
      btn.type='button';
      btn.textContent='← 나가기';
      btn.setAttribute('aria-label',isBeauty?'AI 보정 나가기':'편집 효과 나가기');
      btn.title='나가기';
      btn.style.setProperty('min-width','72px','important');
      btn.style.setProperty('height','36px','important');
      btn.style.setProperty('padding','0 10px','important');
      btn.style.setProperty('border-radius','12px','important');
      btn.style.setProperty('font-size','13px','important');
      btn.style.setProperty('font-weight','900','important');
      btn.style.setProperty('white-space','nowrap','important');
      btn.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(err){}
        try{if(window.closeSheet)window.closeSheet();}catch(err){}
      };
    }catch(e){}
  }

  var beautyOpen=window.openBeautyPanel;
  if(typeof beautyOpen==='function'){
    window.openBeautyPanel=function(){
      var r=beautyOpen.apply(this,arguments);
      setTimeout(setExitButton,0);
      return r;
    };
  }

  var editOpen=window.openEditEffectPanel;
  if(typeof editOpen==='function'){
    window.openEditEffectPanel=function(){
      var r=editOpen.apply(this,arguments);
      setTimeout(setExitButton,0);
      return r;
    };
  }
})();
