/* K-Talk 원격 라이브: 호스트 화면을 한 번 누를 때마다 하트 1개를 즉시 위로 표시. 다른 UI는 변경하지 않음. */
(function(){
  if(window.__ktRemoteHostTapHeartFixInstalled)return;
  window.__ktRemoteHostTapHeartFixInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktRemoteHostTapHeartFixStyle'))return;
    var s=document.createElement('style');
    s.id='ktRemoteHostTapHeartFixStyle';
    s.textContent=''
      +'.kt-host-direct-heart{position:fixed;z-index:2147483000;pointer-events:none;font-size:36px;line-height:1;color:#ff4f9e;text-shadow:0 0 8px #ff3c91,0 2px 5px #000;animation:ktHostDirectHeartUp .9s ease-out forwards}'
      +'@keyframes ktHostDirectHeartUp{0%{opacity:.15;transform:translate(-50%,-10%) scale(.72)}18%{opacity:1}100%{opacity:0;transform:translate(-50%,-115px) scale(1.42)}}';
    document.head.appendChild(s);
  }

  function popHeart(e){
    ensureStyle();
    var x=(e&&e.clientX)||Math.round(innerWidth*.58);
    var y=(e&&e.clientY)||Math.round(innerHeight*.48);
    var h=document.createElement('div');
    h.className='kt-host-direct-heart';
    h.textContent='♥';
    h.style.left=Math.max(24,Math.min(innerWidth-24,x))+'px';
    h.style.top=Math.max(80,Math.min(innerHeight-70,y))+'px';
    document.body.appendChild(h);
    setTimeout(function(){if(h.parentNode)h.remove();},1050);
  }

  function isHostArea(t){
    if(!t||!t.closest)return false;
    var root=t.closest('.kt-remote-live');
    if(!root)return false;
    if(t.closest('button,input,textarea,a,.kt-remote-top,.kt-remote-bottom,.kt-remote-chat'))return false;
    return true;
  }

  function onTap(e){
    if(!isHostArea(e.target))return;
    popHeart(e);
  }

  if(window.PointerEvent)document.addEventListener('pointerup',onTap,true);
  else document.addEventListener('click',onTap,true);

  ensureStyle();
})();