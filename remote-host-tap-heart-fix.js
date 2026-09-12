/* K-Talk 내 방송방 호스트 터치 전용: 한 번 누르면 하트 1개가 화면 위까지 올라가고 상단 좋아요 숫자 +1. 원격 방송은 기존 서버 좋아요 코드에 맡김. */
(function(){
  if(window.__ktLocalHostTapHeartFinalInstalled)return;
  window.__ktLocalHostTapHeartFinalInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktLocalHostTapHeartFinalStyle'))return;
    var s=document.createElement('style');
    s.id='ktLocalHostTapHeartFinalStyle';
    s.textContent=''
      +'.ktsolo-main,.ktg13-host,.ktsubscriber-host,.ktsecret-host,.ktg9-host,#ktLiveVideo{-webkit-touch-callout:none!important;-webkit-user-select:none!important;user-select:none!important;touch-action:manipulation!important}'
      +'.kt-host-tap-heart{display:none!important}'
      +'.kt-host-direct-heart{position:fixed;z-index:2147483000;pointer-events:none;font-size:40px;line-height:1;color:#ff4f9e;text-shadow:0 0 10px #ff3c91,0 2px 5px #000;animation:ktLocalHostHeartToTop 1.55s cubic-bezier(.18,.72,.25,1) forwards}'
      +'@keyframes ktLocalHostHeartToTop{0%{opacity:.25;transform:translate(-50%,0) scale(.72)}10%{opacity:1;transform:translate(-50%,-18px) scale(1)}72%{opacity:1;transform:translate(calc(-50% + 12px),-300px) scale(1.12)}100%{opacity:0;transform:translate(calc(-50% - 6px),-430px) scale(1.28)}}';
    document.head.appendChild(s);
  }

  function isLocalHostArea(t){
    if(!t||!t.closest)return false;
    var room=t.closest('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.ktg9-room');
    if(!room)return false;
    var area=t.closest('.ktsolo-main,.ktg13-host,.ktsubscriber-host,.ktsecret-host,.ktg9-host,#ktLiveVideo');
    if(!area)return false;
    if(t.closest('button,input,textarea,a,.ktsolo-right,.ktsolo-gifts,.ktsolo-chat,.ktsolo-earn,.ktg13-right,.ktg13-gifts,.ktg13-chat,.ktsubscriber-right,.ktsubscriber-gifts,.ktsubscriber-chat,.ktsecret-right,.ktsecret-gifts,.ktsecret-chat,.ktg9-right,.ktg9-gifts,.ktg9-chat'))return false;
    return true;
  }

  function prepareVideos(){
    document.querySelectorAll('#ktLiveVideo,.ktsolo-main video,.ktg13-host video,.ktsubscriber-host video,.ktsecret-host video,.ktg9-host video').forEach(function(v){
      try{
        v.disablePictureInPicture=true;
        v.setAttribute('disablepictureinpicture','');
        v.setAttribute('controlsList','nodownload noremoteplayback');
        v.setAttribute('draggable','false');
        v.oncontextmenu=function(e){e.preventDefault();return false;};
      }catch(e){}
    });
  }

  function popHeart(x,y){
    ensureStyle();
    var h=document.createElement('div');
    h.className='kt-host-direct-heart';
    h.textContent='♥';
    h.style.left=Math.max(28,Math.min(innerWidth-28,Number(x)||innerWidth*.50))+'px';
    h.style.top=Math.max(160,Math.min(innerHeight-100,Number(y)||innerHeight*.58))+'px';
    document.body.appendChild(h);
    setTimeout(function(){if(h.parentNode)h.remove();},1650);
  }

  function num(el){
    if(!el)return 0;
    var m=String(el.textContent||'').match(/(\d[\d,]*)/);
    return m?parseInt(m[1].replace(/,/g,''),10)||0:0;
  }

  function bumpLocalLike(){
    var el=document.getElementById('hostLikeCount');
    var before=num(el);
    var changed=false;
    try{
      if(typeof window.addHostLike==='function'){
        window.addHostLike(1);
        changed=true;
      }
    }catch(e){changed=false;}
    setTimeout(function(){
      if(!el)return;
      var now=num(el);
      if(!changed||now<=before)el.textContent=(before+1).toLocaleString('ko-KR');
    },80);
  }

  var lastAt=0;
  function onTap(e){
    if(!isLocalHostArea(e.target))return;
    var now=Date.now();
    if(now-lastAt<260)return;
    lastAt=now;
    popHeart(e.clientX||innerWidth*.50,e.clientY||innerHeight*.58);
    bumpLocalLike();
  }

  document.addEventListener('contextmenu',function(e){
    if(isLocalHostArea(e.target)){
      e.preventDefault();
      e.stopPropagation();
    }
  },true);
  document.addEventListener('dragstart',function(e){if(isLocalHostArea(e.target))e.preventDefault();},true);

  if(window.PointerEvent){
    document.addEventListener('pointerup',onTap,true);
  }else{
    document.addEventListener('touchend',function(e){
      var p=e.changedTouches&&e.changedTouches[0];
      onTap({target:e.target,clientX:p?p.clientX:innerWidth*.50,clientY:p?p.clientY:innerHeight*.58});
    },true);
  }

  ensureStyle();
  prepareVideos();
  setTimeout(prepareVideos,300);
  setTimeout(prepareVideos,1200);
  setInterval(prepareVideos,2500);
})();

/* 추천 동영상 사이에 실제 방송 중 LIVE를 섞어 보여주는 연결 */
(function(){
  if(document.querySelector('script[data-kt-live-feed-bootstrap]'))return;
  var s=document.createElement('script');
  s.src='live-feed-bootstrap.js?v=20260912-livefeed1';
  s.async=false;
  s.setAttribute('data-kt-live-feed-bootstrap','1');
  document.head.appendChild(s);
})();
