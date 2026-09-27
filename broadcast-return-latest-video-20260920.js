/* K-Talk 방송 종료 후 최신 동영상으로 바로 복귀
   - 예전 꽃/로컬 캐시 화면을 거치지 않음
   - 방송방/채팅/스위치 레이아웃은 변경하지 않음 */
(function(){
  if(window.__ktBroadcastReturnLatestVideo20260920)return;
  window.__ktBroadcastReturnLatestVideo20260920=true;

  function stopCamera(){
    try{
      if(window.state&&state.stream){
        state.stream.getTracks().forEach(function(t){try{t.stop();}catch(e){}});
        state.stream=null;
      }
    }catch(e){}
    try{
      var c=document.getElementById('creator');
      if(c)c.classList.remove('show','camera-on','live-prep-open','creator-recording','creator-review');
    }catch(e){}
  }

  function latestVideoNow(){
    try{if(window.closeSheet)window.closeSheet();}catch(e){}
    stopCamera();

    /* 방송 종료 직후 검은 로딩 화면을 만들지 않는다.
       캐시된 첫 공개 동영상을 즉시 화면에 붙이고, 전체 목록은 뒤에서 이어 붙인다. */
    try{
      var s=document.getElementById('screen');
      if(s){
        var u='';
        try{
          var fast=JSON.parse(localStorage.getItem('ktalk_fast_feed')||'[]');
          if(Array.isArray(fast)&&fast[0]&&fast[0].video_url)u=String(fast[0].video_url||'');
        }catch(_e){}
        if(!u)u='https://zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/public/ktalk-videos/guest/1788516618159-4ep5ki.mp4';

        s.innerHTML='<section id="ktBroadcastReturnFirstFrame" style="height:calc(100dvh - 78px);min-height:560px;position:relative;background:#000;overflow:hidden">'
          +'<video id="ktPublicFirstPaintVideo" class="kt-public-video" autoplay muted loop playsinline preload="auto" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000"></video>'
          +'</section>';

        var v=document.getElementById('ktPublicFirstPaintVideo');
        if(v){
          v.src=u;
          v.muted=true;
          v.defaultMuted=true;
          v.playsInline=true;
          v.setAttribute('autoplay','');
          v.setAttribute('muted','');
          v.setAttribute('loop','');
          v.setAttribute('playsinline','');
          v.setAttribute('webkit-playsinline','');
          window.__ktPublicFirstPaintVideo20260924=v;
          window.__ktPublicFirstPaintUrl20260924=u;
          try{
            var pp=v.play();
            if(pp&&pp.catch)pp.catch(function(){});
          }catch(_e){}
        }
      }
      document.body.classList.remove('kt-home');
      document.body.classList.add('kt-video-mode');
    }catch(e){}

    try{
      if(typeof window.ktStopHostPresence==='function')window.ktStopHostPresence();
    }catch(e){}

    /* 이미 띄운 첫 동영상은 그대로 유지하고, 전체 목록만 즉시 뒤에서 연결 */
    try{
      if(typeof window.ktShowSharedServerFeed==='function'){
        setTimeout(function(){
          try{window.ktShowSharedServerFeed();}catch(e){}
        },0);
        return;
      }
      if(typeof window.ktForceHomeVideoRecovery==='function'){
        window.ktForceHomeVideoRecovery(true);
        setTimeout(function(){
          try{window.ktForceHomeVideoRecovery(true);}catch(e){}
        },180);
        return;
      }
    }catch(e){}

    try{
      if(typeof window.home==='function')window.home();
    }catch(e){}
  }

  window.ktReturnLatestVideoAfterBroadcast=latestVideoNow;

  /* 방송 종료 수익창의 확인 버튼은 예전 home() 대신 최신 서버 동영상으로 직행 */
  function patchEndSheet(){
    try{
      var title=document.getElementById('sheetTitle');
      var sheet=document.getElementById('sheet');
      var text=String(title&&title.textContent||'')+' '+String(sheet&&sheet.textContent||'');
      if(text.indexOf('방송 종료')<0)return;

      var buttons=[].slice.call((sheet||document).querySelectorAll('button'));
      var ok=buttons.find(function(b){
        var t=String(b.textContent||'').replace(/\s+/g,'');
        return t==='확인'||t.indexOf('확인')===0;
      });
      if(!ok)return;

      ok.removeAttribute('onclick');
      ok.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(x){}
        latestVideoNow();
      };
    }catch(e){}
  }

  function wrapEnd(){
    var oldEnd=window.endBroadcastEarnings;
    if(typeof oldEnd!=='function'||oldEnd.__ktLatestVideoReturn)return;
    var wrapped=function(){
      var r=oldEnd.apply(this,arguments);
      /* 방송 종료를 누르면 수익창에 머물지 않고 바로 동영상으로 복귀 */
      setTimeout(latestVideoNow,0);
      return r;
    };
    wrapped.__ktLatestVideoReturn=true;
    window.endBroadcastEarnings=wrapped;
  }

  function wrapLeave(){
    var oldLeave=window.leaveBroadcastToDashboard;
    if(typeof oldLeave!=='function'||oldLeave.__ktLatestVideoReturn)return;
    var wrapped=function(){
      var r=oldLeave.apply(this,arguments);
      setTimeout(latestVideoNow,0);
      return r;
    };
    wrapped.__ktLatestVideoReturn=true;
    window.leaveBroadcastToDashboard=wrapped;
  }

  wrapEnd();wrapLeave();
  setInterval(function(){wrapEnd();wrapLeave();},500);

  /* 다른 방에서 뒤로/나가기 버튼으로 방송을 닫는 경우도 최신 동영상으로 복귀 */
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('button,.ktg13-back,.ktsolo-back,.ktsubscriber-back,.ktsecret-back'):null;
    if(!b)return;
    var isBack=!!(b.matches&&b.matches('.ktg13-back,.ktsolo-back,.ktsubscriber-back,.ktsecret-back'));
    var txt=String(b.textContent||'').replace(/\s+/g,'');
    if(!isBack&&txt.indexOf('방송종료')<0)return;
    setTimeout(latestVideoNow,0);
  },true);
})();