/* K-Talk: 동영상 화면의 '공유' 바로 아래에 오늘의 운세 버튼만 추가. 방송 쪽 기존 운세는 그대로 둠. */
(function(){
  if(window.__ktFortuneVideoShareButton20260929)return;
  window.__ktFortuneVideoShareButton20260929=true;

  function isShareButton(b){
    return !!b && String(b.textContent||'').replace(/\s+/g,'').indexOf('공유')>-1;
  }

  function addFortune(container){
    if(!container || container.querySelector('.kt-video-fortune-below-share'))return;
    var buttons=Array.prototype.slice.call(container.querySelectorAll('button'));
    var share=buttons.find(isShareButton);
    if(!share)return;

    var b=document.createElement('button');
    b.type='button';
    b.className='kt-video-fortune-below-share';
    b.innerHTML='🍀<small>오늘의 운세</small>';
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      if(typeof window.ktOpenDailyFortuneLadder20260928==='function'){
        window.ktOpenDailyFortuneLadder20260928();
      }
      return false;
    };
    share.insertAdjacentElement('afterend',b);
  }

  function scan(){
    document.querySelectorAll('.right-actions,.vh-actions').forEach(addFortune);
  }

  document.addEventListener('DOMContentLoaded',scan);
  document.addEventListener('click',function(){setTimeout(scan,0);},true);
  new MutationObserver(scan).observe(document.documentElement,{childList:true,subtree:true});
  setInterval(scan,1200);
  setTimeout(scan,0);
})();
