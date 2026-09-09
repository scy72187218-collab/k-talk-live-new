/* K-Talk 1인 방송 첫 번째 사진 구성 고정: 좋아요/효과/보물상자/매치 + 기존 하단 선물/도구 유지. 다른 방은 건드리지 않음. */
(function(){
  if(window.__ktSoloFirstPhotoLockInstalled)return;
  window.__ktSoloFirstPhotoLockInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktSoloFirstPhotoLockStyle'))return;
    var s=document.createElement('style');
    s.id='ktSoloFirstPhotoLockStyle';
    s.textContent=''
      +'.ktsolo-room .ktsolo-right.kt-solo-first-photo-lock{display:grid!important;gap:6px!important;z-index:42!important;pointer-events:auto!important}'
      +'.ktsolo-room .ktsolo-right.kt-solo-first-photo-lock button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;width:44px!important;height:44px!important;border-radius:50%!important;border:1px solid rgba(255,255,255,.24)!important;background:rgba(18,18,22,.92)!important;color:#fff!important;padding:0!important;font-weight:950!important;touch-action:manipulation!important}'
      +'.ktsolo-room .ktsolo-right.kt-solo-first-photo-lock .like{height:50px!important;border-radius:16px!important;border-color:rgba(255,83,174,.62)!important;background:rgba(65,22,49,.94)!important}'
      +'.ktsolo-room .ktsolo-right.kt-solo-first-photo-lock .treasure{border-color:rgba(255,205,70,.68)!important;background:linear-gradient(145deg,rgba(92,63,13,.97),rgba(37,27,9,.97))!important}'
      +'.ktsolo-room .ktsolo-right.kt-solo-first-photo-lock b{font-size:17px!important;line-height:1!important}'
      +'.ktsolo-room .ktsolo-right.kt-solo-first-photo-lock small{display:block!important;font-size:8px!important;line-height:1.05!important;margin-top:2px!important;white-space:nowrap!important}'
      +'.ktsolo-room .ktsolo-gifts{display:grid!important;visibility:visible!important;opacity:1!important}'
      +'.ktsolo-room .ktsolo-tools{display:grid!important;visibility:visible!important;opacity:1!important}'
      +'@media(max-width:390px){.ktsolo-room .ktsolo-right.kt-solo-first-photo-lock button{width:40px!important;height:40px!important}.ktsolo-room .ktsolo-right.kt-solo-first-photo-lock .like{height:46px!important}}';
    document.head.appendChild(s);
  }

  function like(){
    try{if(window.addHostLike){window.addHostLike(1);return;}}catch(e){}
  }
  function effect(){
    try{if(window.ktSoloEffect){window.ktSoloEffect();return;}}catch(e){}
    try{if(window.openEditEffectPanel)window.openEditEffectPanel();}catch(e){}
  }
  function treasure(){
    try{if(window.openTreasure){window.openTreasure();return;}}catch(e){}
    try{if(window.openGifts)window.openGifts();}catch(e){}
  }
  function match(){
    try{if(window.openHostMatchArena){window.openHostMatchArena('1대1');return;}}catch(e){}
    try{if(window.openMatchArena){window.openMatchArena('1대1');return;}}catch(e){}
  }

  window.ktSoloFirstLike=like;
  window.ktSoloFirstEffect=effect;
  window.ktSoloFirstTreasure=treasure;
  window.ktSoloFirstMatch=match;

  function lock(){
    var room=document.querySelector('.ktsolo-room');
    if(!room)return;
    ensureStyle();

    var box=room.querySelector('.ktsolo-right');
    if(box){
      box.classList.add('kt-solo-first-photo-lock','kt-synced-actions');
      box.setAttribute('data-kt-actions','same4');
      if(box.getAttribute('data-kt-first-photo')!=='1'){
        box.setAttribute('data-kt-first-photo','1');
        box.innerHTML=''
          +'<button class="like" type="button" onclick="ktSoloFirstLike()" aria-label="좋아요"><b>💗</b><small>좋아요</small><em id="hostLikeCount" style="font-style:normal;display:block;font-size:8px">0</em></button>'
          +'<button type="button" onclick="ktSoloFirstEffect()" aria-label="효과"><b>✨</b><small>효과</small></button>'
          +'<button class="treasure" type="button" onclick="ktSoloFirstTreasure()" aria-label="보물상자"><b>🎁</b><small>보물상자</small></button>'
          +'<button type="button" onclick="ktSoloFirstMatch()" aria-label="매치"><b>⚔</b><small>매치</small></button>';
      }
    }

    var gifts=room.querySelector('.ktsolo-gifts');
    if(gifts){gifts.style.setProperty('display','grid','important');gifts.style.setProperty('visibility','visible','important');gifts.style.setProperty('opacity','1','important');}
    var tools=room.querySelector('.ktsolo-tools');
    if(tools){tools.style.setProperty('display','grid','important');tools.style.setProperty('visibility','visible','important');tools.style.setProperty('opacity','1','important');}
  }

  try{new MutationObserver(lock).observe(document.body,{childList:true,subtree:true});}catch(e){}
  setInterval(lock,700);
  setTimeout(lock,0);
})();
