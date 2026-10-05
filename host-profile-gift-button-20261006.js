/* K-Talk 2026-10-06 — host profile gift button only.
   When a remote guest taps the host profile photo, keep that host selected
   and add one gift-box button inside the existing profile card.
   No room layout, guest approval, chat, earnings, transport or other profile logic changes. */
(function(){
  if(window.__ktHostProfileGiftButton20261006)return;
  window.__ktHostProfileGiftButton20261006=true;

  function isRemoteViewer(){
    try{
      return document.documentElement.classList.contains('kt-remote-viewing')||
        !!document.querySelector('#screen .kt-remote-live,.kt-guest-hostlike-room');
    }catch(e){return false;}
  }

  function selectedHost(){
    try{
      var t=window.ktGiftTarget20260928||null;
      return !!(t&&t.kind==='host');
    }catch(e){return false;}
  }

  function ensureStyle(){
    if(document.getElementById('ktHostProfileGiftButtonStyle20261006'))return;
    var s=document.createElement('style');
    s.id='ktHostProfileGiftButtonStyle20261006';
    s.textContent=''
      +'#ktLiveProfileCard .kt-host-profile-gift-20261006{'
      +'width:100%!important;min-height:46px!important;margin:9px 0 0!important;'
      +'border:1px solid rgba(255,215,90,.55)!important;border-radius:14px!important;'
      +'background:linear-gradient(135deg,#3a2608,#6b4510)!important;color:#fff3a0!important;'
      +'display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;'
      +'font:950 14px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;'
      +'box-shadow:0 0 12px rgba(255,207,76,.16)!important;touch-action:manipulation!important;pointer-events:auto!important}'
      +'#ktLiveProfileCard .kt-host-profile-gift-20261006 b{font-size:20px!important;line-height:1!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function mount(){
    try{
      var card=document.getElementById('ktLiveProfileCard');
      if(!card||!isRemoteViewer()||!selectedHost())return;
      var body=card.querySelector('.kt-live-profile-body');
      if(!body||body.querySelector('.kt-host-profile-gift-20261006'))return;

      var btn=document.createElement('button');
      btn.type='button';
      btn.className='kt-host-profile-gift-20261006';
      btn.innerHTML='<b>🎁</b><span>호스트에게 선물하기</span>';
      btn.addEventListener('click',function(e){
        try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
        try{if(typeof window.ktCloseLiveProfileCard==='function')window.ktCloseLiveProfileCard();}catch(_e){}
        setTimeout(function(){
          try{if(typeof window.openGifts==='function')window.openGifts();}catch(_e){}
        },20);
      });

      var follow=body.querySelector('.kt-live-profile-follow');
      if(follow&&follow.parentNode===body)follow.insertAdjacentElement('afterend',btn);
      else body.appendChild(btn);
    }catch(e){}
  }

  ensureStyle();
  document.addEventListener('click',function(e){
    try{
      var p=e.target&&e.target.closest?e.target.closest('.kt-allhost-photo,.kt-allhost-fallback'):null;
      if(!p||!isRemoteViewer())return;
      setTimeout(mount,0);setTimeout(mount,50);setTimeout(mount,140);
    }catch(_e){}
  },true);

  try{
    new MutationObserver(function(){
      if(document.getElementById('ktLiveProfileCard'))setTimeout(mount,0);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  [100,300,700].forEach(function(ms){setTimeout(mount,ms);});
})();
