/* K-Talk 1인방 오른쪽 중복 버튼만 정리: 효과 1개, 보물상자 1개만 유지. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktSoloRightDedupeInstalled)return;
  window.__ktSoloRightDedupeInstalled=true;

  /* 1인 방송 오른쪽 버튼 묶음만 조금 아래로 내린다. 13명/구독자/비밀방은 변경하지 않음. */
  if(!document.getElementById('ktSoloRightLower20260912')){
    var st=document.createElement('style');
    st.id='ktSoloRightLower20260912';
    st.textContent='html.kt-att-led-target:not(.kt-compact-two-room) body #ktSept2Live.kt-added-ui-room .kt-s2-right{bottom:135px!important;}';
    document.head.appendChild(st);
  }

  function buttonKind(btn){
    var text=String(btn.textContent||'').replace(/\s+/g,'');
    var onclick=String(btn.getAttribute('onclick')||'');
    if(text.indexOf('효과')>-1||text.indexOf('✨')>-1||onclick.indexOf('ktSoloEffect')>-1||onclick.indexOf('openEditEffectPanel')>-1)return 'effect';
    if(text.indexOf('보물상자')>-1||text.indexOf('🎁')>-1||onclick.indexOf('openTreasure')>-1||onclick.indexOf('openGifts')>-1||onclick.indexOf('ktRenderTreasure')>-1)return 'treasure';
    return '';
  }

  function dedupe(){
    var box=document.querySelector('.ktsolo-right');
    if(!box)return;
    var seen={effect:false,treasure:false};
    Array.prototype.slice.call(box.querySelectorAll('button')).forEach(function(btn){
      var kind=buttonKind(btn);
      if(!kind)return;
      if(seen[kind])btn.remove();
      else seen[kind]=true;
    });
  }

  dedupe();
  setTimeout(dedupe,60);
  setTimeout(dedupe,250);
  var observer=new MutationObserver(function(){dedupe();});
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();

/* 내 프로필 복구 전용 파일만 연결. 다른 화면/기능은 변경하지 않음. */
(function(){
  if(document.querySelector('script[data-kt-profile-restore-only]'))return;
  var s=document.createElement('script');
  s.src='profile-restore-only.js?v=20260912-profile1';
  s.async=false;
  s.setAttribute('data-kt-profile-restore-only','1');
  document.head.appendChild(s);
})();

/* 프로필 사진만 예전 저장값에서 복구하고, 프로필을 닫으면 뒤에 보던 영상만 다시 재생한다. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktProfilePhotoAndReturnFixInstalled)return;
  window.__ktProfilePhotoAndReturnFixInstalled=true;

  function clean(v){return String(v==null?'':v).trim();}
  function validPhoto(v){v=clean(v);return !!v&&(v.indexOf('data:image/')===0||v.indexOf('blob:')===0||/^https?:\/\//i.test(v));}

  function findLegacyPhoto(){
    var direct=['ktalk_profile_photo','ktalk_profile_image','ktalk_profile_avatar','profile_photo','profile_image','profile_avatar'];
    try{
      for(var i=0;i<direct.length;i++){
        var v=localStorage.getItem(direct[i])||'';
        if(validPhoto(v))return v;
      }
    }catch(e){}

    try{
      for(var j=0;j<localStorage.length;j++){
        var key=localStorage.key(j)||'';
        if(key.indexOf('ktalk_profile_v1:')!==0)continue;
        var raw=localStorage.getItem(key)||'';
        if(!raw)continue;
        var p=JSON.parse(raw)||{};
        if(validPhoto(p.photo))return p.photo;
      }
    }catch(e){}

    var jsonKeys=['ktalk_profile','ktalkProfile','profile','user_profile','ktalk_user_profile'];
    try{
      for(var k=0;k<jsonKeys.length;k++){
        var r=localStorage.getItem(jsonKeys[k]);
        if(!r)continue;
        var x=JSON.parse(r)||{};
        var img=x.photo||x.image||x.avatar||x.profilePhoto||x.profile_image||'';
        if(validPhoto(img))return img;
      }
    }catch(e){}
    return '';
  }

  function restorePhoto(){
    try{
      if(typeof window.ktProfileLoad!=='function'||typeof window.ktProfileStorageKey!=='function')return;
      var p=window.ktProfileLoad()||{};
      if(validPhoto(p.photo))return;
      var found=findLegacyPhoto();
      if(!found)return;
      p.photo=found;
      localStorage.setItem(window.ktProfileStorageKey(),JSON.stringify(p));
      var box=document.querySelector('.kt-my-profile-photo');
      if(box){
        var img=box.querySelector('img');
        if(!img){img=document.createElement('img');img.alt='프로필 사진';box.insertBefore(img,box.firstChild);}
        img.src=found;
      }
    }catch(e){}
  }

  function resumeVisibleVideo(){
    try{
      var list=document.querySelectorAll('.kt-public-video,#homeVideo');
      for(var i=0;i<list.length;i++){
        var v=list[i];
        if(!v||!v.isConnected)continue;
        var r=v.getBoundingClientRect();
        var vh=window.innerHeight||document.documentElement.clientHeight||0;
        var vw=window.innerWidth||document.documentElement.clientWidth||0;
        if(r.width>1&&r.height>1&&r.bottom>0&&r.right>0&&r.top<vh&&r.left<vw){
          var play=v.play();
          if(play&&play.catch)play.catch(function(){});
          break;
        }
      }
    }catch(e){}
  }

  function install(){
    if(typeof window.openProfileDirect==='function'&&!window.openProfileDirect.__ktPhotoReturnFix){
      var oldOpen=window.openProfileDirect;
      var open=function(){
        window.__ktProfileWasOpened=true;
        restorePhoto();
        var r=oldOpen.apply(this,arguments);
        setTimeout(restorePhoto,60);
        return r;
      };
      open.__ktPhotoReturnFix=true;
      window.openProfileDirect=open;
    }

    if(typeof window.closeSheet==='function'&&!window.closeSheet.__ktPhotoReturnFix){
      var oldClose=window.closeSheet;
      var close=function(){
        var wasProfile=!!window.__ktProfileWasOpened;
        var r=oldClose.apply(this,arguments);
        if(wasProfile){
          window.__ktProfileWasOpened=false;
          resumeVisibleVideo();
          setTimeout(resumeVisibleVideo,80);
        }
        return r;
      };
      close.__ktPhotoReturnFix=true;
      window.closeSheet=close;
    }
  }

  restorePhoto();
  install();
  [100,300,700,1500].forEach(function(ms){setTimeout(function(){install();restorePhoto();},ms);});
})();
