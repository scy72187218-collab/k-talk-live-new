/* K-Talk 라이브 호스트 터치: 원격/내 방송방 모두 한 번 누를 때마다 하트 1개가 길게 위로 올라가고, 내 방송방 좋아요 숫자도 +1. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktRemoteHostTapHeartFixInstalledV2)return;
  window.__ktRemoteHostTapHeartFixInstalledV2=true;

  function ensureStyle(){
    if(document.getElementById('ktRemoteHostTapHeartFixStyle'))return;
    var s=document.createElement('style');
    s.id='ktRemoteHostTapHeartFixStyle';
    s.textContent=''
      +'.kt-host-direct-heart{position:fixed;z-index:2147483000;pointer-events:none;font-size:38px;line-height:1;color:#ff4f9e;text-shadow:0 0 10px #ff3c91,0 2px 5px #000;animation:ktHostDirectHeartUp 1.35s cubic-bezier(.18,.72,.28,1) forwards}'
      +'@keyframes ktHostDirectHeartUp{0%{opacity:.2;transform:translate(-50%,0) scale(.70)}12%{opacity:1;transform:translate(-50%,-18px) scale(1)}72%{opacity:1;transform:translate(calc(-50% + 12px),-205px) scale(1.18)}100%{opacity:0;transform:translate(calc(-50% - 8px),-285px) scale(1.34)}}';
    document.head.appendChild(s);
  }

  function popHeart(e){
    ensureStyle();
    var x=(e&&e.clientX)||Math.round(innerWidth*.50);
    var y=(e&&e.clientY)||Math.round(innerHeight*.58);
    var h=document.createElement('div');
    h.className='kt-host-direct-heart';
    h.textContent='♥';
    h.style.left=Math.max(28,Math.min(innerWidth-28,x))+'px';
    h.style.top=Math.max(110,Math.min(innerHeight-90,y))+'px';
    document.body.appendChild(h);
    setTimeout(function(){if(h.parentNode)h.remove();},1450);
  }

  function num(el){
    if(!el)return 0;
    var m=String(el.textContent||'').match(/(\d[\d,]*)/);
    return m?parseInt(m[1].replace(/,/g,''),10)||0:0;
  }

  function bumpLocalLike(){
    var el=document.getElementById('hostLikeCount');
    var before=num(el);
    var nativeUsed=false;
    try{
      if(typeof window.addHostLike==='function'){
        nativeUsed=true;
        window.addHostLike(1);
      }
    }catch(e){nativeUsed=false;}
    setTimeout(function(){
      if(!el)return;
      var now=num(el);
      if(!nativeUsed||now<=before)el.textContent=(before+1).toLocaleString('ko-KR');
    },100);
  }

  function isRemoteHostArea(t){
    if(!t||!t.closest)return false;
    var root=t.closest('.kt-remote-live');
    if(!root)return false;
    if(t.closest('button,input,textarea,a,.kt-remote-top,.kt-remote-bottom,.kt-remote-chat'))return false;
    return true;
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

  var lastAt=0;
  function onTap(e){
    var t=e.target;
    var remote=isRemoteHostArea(t);
    var local=isLocalHostArea(t);
    if(!remote&&!local)return;
    var now=Date.now();
    if(now-lastAt<220)return;
    lastAt=now;
    popHeart(e);
    if(local)bumpLocalLike();
  }

  if(window.PointerEvent){
    document.addEventListener('pointerup',onTap,true);
  }else{
    document.addEventListener('touchend',function(e){
      var p=e.changedTouches&&e.changedTouches[0];
      onTap({target:e.target,clientX:p?p.clientX:innerWidth*.50,clientY:p?p.clientY:innerHeight*.58});
    },true);
  }

  ensureStyle();
})();
