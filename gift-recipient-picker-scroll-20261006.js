/* K-Talk 2026-10-06 — selected-person gift panel only.
   Scope: show chosen recipient face/name in gift sheet + make gift list vertically swipeable.
   Existing gift sending, room layout, chat, guest approval, earnings and transport are untouched. */
(function(){
  if(window.__ktGiftRecipientPickerScroll20261006)return;
  window.__ktGiftRecipientPickerScroll20261006=true;

  function selectedTile(){
    try{return document.querySelector('.kt-person-gift-target-20260928');}catch(e){return null;}
  }
  function selectedTarget(){
    try{
      var t=window.ktGiftTarget20260928||null;
      if(t&&(t.kind==='host'||(t.kind==='guest'&&t.viewerId)))return t;
      var g=window.ktGuestGiftTarget||null;
      if(g&&g.viewerId)return {kind:'guest',viewerId:g.viewerId,name:g.name||'게스트'};
    }catch(e){}
    return null;
  }
  function targetName(){
    var t=selectedTarget();
    return String(t&&t.name||'선물 받을 사람').trim()||'선물 받을 사람';
  }
  function targetMedia(tile){
    if(!tile)return null;
    try{
      var img=tile.querySelector('img.kt-allhost-photo,img.kt-hg-photo,img.kt-guest-profile-photo,img.kt-profile-photo,img[class*="avatar"],img[class*="profile"]');
      if(img&&(img.currentSrc||img.src))return {kind:'img',src:img.currentSrc||img.src};
      var v=tile.querySelector('video');
      if(v){
        if(v.srcObject)return {kind:'video',stream:v.srcObject,poster:v.poster||''};
        if(v.currentSrc||v.src)return {kind:'video-src',src:v.currentSrc||v.src,poster:v.poster||''};
        if(v.poster)return {kind:'img',src:v.poster};
      }
      var d=tile.dataset||{};
      var s=d.profilePhoto||d.profileImage||d.avatar||d.avatarUrl||d.photo||d.photoUrl||d.image||'';
      if(s)return {kind:'img',src:s};
    }catch(e){}
    return null;
  }
  function style(){
    var id='ktGiftRecipientPickerScroll20261006Style';
    if(document.getElementById(id))return;
    var s=document.createElement('style');s.id=id;
    s.textContent=''
      +'#sheet.kt-gift-force .kt-gift-recipient-bar-20261006{display:flex!important;align-items:center!important;gap:10px!important;margin:7px 4px 2px!important;padding:8px 10px!important;border-radius:15px!important;border:1px solid rgba(255,215,90,.38)!important;background:linear-gradient(135deg,rgba(48,31,8,.88),rgba(23,14,24,.88))!important;color:#fff!important}'
      +'#sheet.kt-gift-force .kt-gift-recipient-face-20261006{width:42px!important;height:42px!important;flex:0 0 42px!important;border-radius:50%!important;overflow:hidden!important;display:grid!important;place-items:center!important;background:#17171d!important;border:2px solid #ffd75a!important;box-shadow:0 0 12px rgba(255,215,90,.35)!important}'
      +'#sheet.kt-gift-force .kt-gift-recipient-face-20261006 img,#sheet.kt-gift-force .kt-gift-recipient-face-20261006 video{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important;background:#111!important}'
      +'#sheet.kt-gift-force .kt-gift-recipient-face-20261006 span{font-size:23px!important}'
      +'#sheet.kt-gift-force .kt-gift-recipient-copy-20261006{min-width:0!important}'
      +'#sheet.kt-gift-force .kt-gift-recipient-copy-20261006 small{display:block!important;color:#ffd86b!important;font-size:9px!important;font-weight:950!important;margin-bottom:2px!important}'
      +'#sheet.kt-gift-force .kt-gift-recipient-copy-20261006 b{display:block!important;color:#fff!important;font-size:14px!important;font-weight:950!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
      +'#sheet.kt-gift-force .ktgf-main>section{max-height:34dvh!important;overflow-y:auto!important;overflow-x:hidden!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important;scroll-snap-type:y proximity!important;padding-right:2px!important}'
      +'#sheet.kt-gift-force .ktgf-card{scroll-snap-align:start!important}'
      +'#sheet.kt-gift-force .ktgf-main>section::-webkit-scrollbar{width:4px!important}'
      +'#sheet.kt-gift-force .ktgf-main>section::-webkit-scrollbar-thumb{background:#8e456f!important;border-radius:999px!important}'
      +'@media(max-width:410px){#sheet.kt-gift-force .kt-gift-recipient-bar-20261006{margin:4px 2px 1px!important;padding:6px 8px!important;gap:7px!important}#sheet.kt-gift-force .kt-gift-recipient-face-20261006{width:34px!important;height:34px!important;flex-basis:34px!important}#sheet.kt-gift-force .kt-gift-recipient-copy-20261006 b{font-size:11px!important}#sheet.kt-gift-force .kt-gift-recipient-copy-20261006 small{font-size:7px!important}#sheet.kt-gift-force .ktgf-main>section{max-height:31dvh!important}}';
    (document.head||document.documentElement).appendChild(s);
  }
  function mountRecipient(){
    try{
      var root=document.querySelector('#sheet.kt-gift-force .ktgf');
      if(!root)return;
      var old=root.querySelector('.kt-gift-recipient-bar-20261006');
      if(old)old.remove();

      var t=selectedTarget();
      if(!t)return;

      var bar=document.createElement('div');
      bar.className='kt-gift-recipient-bar-20261006';

      var face=document.createElement('div');
      face.className='kt-gift-recipient-face-20261006';
      var media=targetMedia(selectedTile());
      if(media&&media.kind==='img'){
        var img=document.createElement('img');img.alt='선물 받을 사람';img.src=media.src;face.appendChild(img);
      }else if(media&&media.kind==='video'){
        var v=document.createElement('video');v.autoplay=true;v.muted=true;v.playsInline=true;
        try{v.srcObject=media.stream;var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
        if(media.poster)v.poster=media.poster;
        face.appendChild(v);
      }else if(media&&media.kind==='video-src'){
        var v2=document.createElement('video');v2.autoplay=true;v2.muted=true;v2.playsInline=true;v2.src=media.src;if(media.poster)v2.poster=media.poster;
        try{var q=v2.play();if(q&&q.catch)q.catch(function(){});}catch(e){}
        face.appendChild(v2);
      }else{
        var sp=document.createElement('span');sp.textContent=t.kind==='host'?'🎙️':'👤';face.appendChild(sp);
      }

      var copy=document.createElement('div');
      copy.className='kt-gift-recipient-copy-20261006';
      copy.innerHTML='<small>🎁 선물 받을 사람</small><b></b>';
      copy.querySelector('b').textContent=targetName();

      bar.appendChild(face);bar.appendChild(copy);

      var head=root.querySelector('.ktgf-head');
      if(head&&head.parentNode===root)head.insertAdjacentElement('afterend',bar);
      else root.insertBefore(bar,root.firstChild);
    }catch(e){}
  }
  function resetGiftScroll(){
    try{
      var sc=document.querySelector('#sheet.kt-gift-force .ktgf-main>section');
      if(sc)sc.scrollTop=0;
    }catch(e){}
  }
  function wrapOpen(){
    var old=window.openGifts;
    if(typeof old!=='function'||old.__ktRecipientPickerScroll20261006)return;
    var wrapped=function(){
      var r=old.apply(this,arguments);
      [0,20,80].forEach(function(ms){setTimeout(function(){style();mountRecipient();resetGiftScroll();},ms);});
      return r;
    };
    wrapped.__ktRecipientPickerScroll20261006=true;
    wrapped.__ktRecipientPickerScrollOld=old;
    window.openGifts=wrapped;
  }

  style();
  wrapOpen();
  [80,220,600,1200].forEach(function(ms){setTimeout(wrapOpen,ms);});
  try{
    new MutationObserver(function(){
      wrapOpen();
      if(document.querySelector('#sheet.kt-gift-force .ktgf'))setTimeout(function(){mountRecipient();},0);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
