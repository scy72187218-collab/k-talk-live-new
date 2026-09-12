/* K-Talk 내 방송방 호스트 화면 터치: 한 번 누를 때마다 하트 1개가 길게 위로 올라가고 좋아요 숫자 +1. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktLocalHostHeartRiseFixInstalled)return;
  window.__ktLocalHostHeartRiseFixInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktLocalHostHeartRiseStyle'))return;
    var s=document.createElement('style');
    s.id='ktLocalHostHeartRiseStyle';
    s.textContent=''
      +'.kt-local-host-heart-rise{position:fixed;z-index:2147483000;pointer-events:none;font-size:38px;line-height:1;color:#ff4f9e;text-shadow:0 0 10px #ff3c91,0 2px 5px #000;animation:ktLocalHostHeartRise 1.35s cubic-bezier(.18,.72,.28,1) forwards}'
      +'@keyframes ktLocalHostHeartRise{0%{opacity:.2;transform:translate(-50%,0) scale(.70)}12%{opacity:1;transform:translate(-50%,-18px) scale(1)}72%{opacity:1;transform:translate(calc(-50% + 12px),-205px) scale(1.18)}100%{opacity:0;transform:translate(calc(-50% - 8px),-285px) scale(1.34)}}';
    document.head.appendChild(s);
  }

  function roomRoot(target){
    if(!target||!target.closest)return null;
    return target.closest('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.ktg9-room');
  }

  function hostArea(target){
    if(!target||!target.closest)return null;
    return target.closest('.ktsolo-main,.ktg13-host,.ktsubscriber-host,.ktsecret-host,.ktg9-host,#ktLiveVideo');
  }

  function blocked(target){
    if(!target||!target.closest)return true;
    return !!target.closest('button,input,textarea,a,.ktsolo-right,.ktsolo-gifts,.ktsolo-chat,.ktsolo-earn,.ktg13-right,.ktg13-gifts,.ktg13-chat,.ktsubscriber-right,.ktsubscriber-gifts,.ktsubscriber-chat,.ktsecret-right,.ktsecret-gifts,.ktsecret-chat,.ktg9-right,.ktg9-gifts,.ktg9-chat');
  }

  function popHeart(x,y){
    ensureStyle();
    var h=document.createElement('div');
    h.className='kt-local-host-heart-rise';
    h.textContent='♥';
    h.style.left=Math.max(28,Math.min(innerWidth-28,Number(x)||innerWidth*.48))+'px';
    h.style.top=Math.max(110,Math.min(innerHeight-90,Number(y)||innerHeight*.58))+'px';
    document.body.appendChild(h);
    setTimeout(function(){if(h.parentNode)h.remove();},1450);
  }

  function numberOf(el){
    if(!el)return 0;
    var m=String(el.textContent||'').match(/(\d[\d,]*)/);
    return m?parseInt(m[1].replace(/,/g,''),10)||0:0;
  }

  function bumpLike(){
    var el=document.getElementById('hostLikeCount');
    var before=numberOf(el);
    var usedNative=false;
    try{
      if(typeof window.addHostLike==='function'){
        usedNative=true;
        window.addHostLike(1);
      }
    }catch(e){usedNative=false;}
    setTimeout(function(){
      var now=numberOf(el);
      if(el&&(!usedNative||now<=before))el.textContent=(before+1).toLocaleString('ko-KR');
    },80);
  }

  var lastAt=0;
  function handleTap(e){
    var t=e.target;
    if(!roomRoot(t)||!hostArea(t)||blocked(t))return;
    var now=Date.now();
    if(now-lastAt<220)return;
    lastAt=now;
    popHeart(e.clientX||innerWidth*.48,e.clientY||innerHeight*.56);
    bumpLike();
  }

  if(window.PointerEvent){
    document.addEventListener('pointerup',handleTap,true);
  }else{
    document.addEventListener('touchend',function(e){
      var touch=e.changedTouches&&e.changedTouches[0];
      handleTap({target:e.target,clientX:touch?touch.clientX:innerWidth*.48,clientY:touch?touch.clientY:innerHeight*.56});
    },true);
  }

  ensureStyle();
})();
