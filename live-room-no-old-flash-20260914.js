/* K-Talk 방송 시작 때 예전 방 화면이 잠깐 보이는 현상만 가림. 다른 UI/기능 변경 없음. */
(function(){
  if(window.__ktLiveRoomNoOldFlash20260914)return;
  window.__ktLiveRoomNoOldFlash20260914=true;

  var coverId='ktLiveRoomNoOldFlashCover20260914';
  var fallbackTimer=0;

  function showCover(){
    var cover=document.getElementById(coverId);
    if(!cover){
      cover=document.createElement('div');
      cover.id=coverId;
      cover.setAttribute('aria-hidden','true');
      cover.style.cssText='position:fixed;inset:0;z-index:2147483646;background:#000;pointer-events:none;opacity:1;';
      document.body.appendChild(cover);
    }
    cover.style.display='block';
    cover.style.opacity='1';
    clearTimeout(fallbackTimer);
    fallbackTimer=setTimeout(hideCover,8000);
  }

  function hideCover(){
    clearTimeout(fallbackTimer);
    var cover=document.getElementById(coverId);
    if(cover)cover.style.display='none';
  }

  function hideAfterNewRoomPaint(){
    setTimeout(function(){
      requestAnimationFrame(function(){requestAnimationFrame(hideCover);});
    },320);
  }

  /* 라이브 시작 버튼을 누르는 순간 먼저 가려서 구버전 화면이 한 프레임도 보이지 않게 한다. */
  document.addEventListener('click',function(e){
    var t=e.target&&e.target.closest?e.target.closest('.prep-start,[onclick*="startBroadcast"]'):null;
    if(t)showCover();
  },true);

  /* 현재 방송 시작 함수만 감싼다. 방 내용/배치/기능은 수정하지 않는다. */
  var current=window.startBroadcast;
  if(typeof current==='function'){
    window.startBroadcast=async function(){
      showCover();
      try{
        return await current.apply(this,arguments);
      }finally{
        hideAfterNewRoomPaint();
      }
    };
  }
})();
