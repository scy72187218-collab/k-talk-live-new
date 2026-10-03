/* K-Talk secret-room guest cleanup.
   Secret guest view only: remove old 9-room/approved guest shells and keep one simple guest bottom bar.
   Does not touch host view or non-secret rooms. */
(function(){
  if(window.__ktSecretGuestCleanBottom20261003)return;
  window.__ktSecretGuestCleanBottom20261003=true;

  function isSecretRemote(){
    try{
      if(!document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var r=window.__ktLastLiveRoom||{};
      var t=[r.room_type,r.room_name,r.title].filter(Boolean).join(' ').toLowerCase();
      return /비밀|secret|password/.test(t);
    }catch(e){return false;}
  }

  function actionButton(cls,icon,label,fn){
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-remote-action '+cls;
    b.innerHTML='<i>'+icon+'</i><span>'+label+'</span>';
    b.onclick=fn;
    return b;
  }

  function clean(){
    try{
      if(!isSecretRemote())return;
      var root=document.querySelector('#screen .kt-remote-live');
      if(!root)return;

      /* remove old 9-person / approved-guest shells from secret guest view */
      root.classList.remove(
        'kt-g9-host-copy','kt-g9-chat-bottom-5555','kt-g9-six-order-5555',
        'kt-guest-hostlike-active','kt-approved-guest-room','kt-prejoin-room-view'
      );
      root.querySelectorAll(
        '.kt-guest-hostlike-room,.kt-approved-guest-grid,.kt-approved-guest-led,'+
        '.kt-approved-guest-stats,.kt-prejoin-room-grid,.kt-prejoin-room-led,'+
        '.kt-prejoin-room-stats,.ktg13-room'
      ).forEach(function(el){try{el.remove();}catch(e){}});

      /* remove leftover duplicated controls from older secret/9-room guest layers */
      var screen=document.getElementById('screen')||root;
      screen.querySelectorAll('button,.kt-remote-action').forEach(function(el){
        try{
          if(el.closest('.kt-remote-bottom'))return;
          if(el.classList&&el.classList.contains('kt-remote-back'))return;
          var t=String(el.textContent||'').replace(/\s+/g,'');
          if(/퇴장|되돌리기|패키지상자|매치|출석체크/.test(t))el.remove();
        }catch(e){}
      });
      screen.querySelectorAll(
        '.kt-remote-guest-request,.kt-remote-rose,.kt-remote-action.gift,.kt-remote-action.share,'+
        '#ktRemoteGuestRequest,#ktRemoteRoseButton,#ktRemoteGiftButton,#ktRemoteShareButton'
      ).forEach(function(el){
        try{if(!el.closest('.kt-remote-bottom'))el.remove();}catch(e){}
      });

      var bar=root.querySelector(':scope > .kt-remote-bottom')||root.querySelector('.kt-remote-bottom');
      if(!bar){
        bar=document.createElement('div');
        bar.className='kt-remote-bottom';
        root.appendChild(bar);
      }

      var input=bar.querySelector('input');
      if(!input){
        input=document.createElement('input');
        input.type='text';
        input.placeholder='입력하세요...';
      }
      input.placeholder='입력하세요...';

      var send=actionButton('send','➤','',function(){
        try{if(typeof window.ktRemoteSendChat==='function')window.ktRemoteSendChat();}catch(e){}
      });
      var people=actionButton('guest','👥','',function(){
        try{if(typeof window.ktRequestGuestJoin==='function')window.ktRequestGuestJoin();}catch(e){}
      });
      people.id='ktRemoteGuestRequest';
      var rose=actionButton('rose','🌹','',function(){
        try{if(typeof window.ktRemoteOpenGifts==='function')window.ktRemoteOpenGifts();else if(typeof window.openGifts==='function')window.openGifts();}catch(e){}
      });
      var gift=actionButton('gift','🎁','',function(){
        try{if(typeof window.ktRemoteOpenGifts==='function')window.ktRemoteOpenGifts();else if(typeof window.openGifts==='function')window.openGifts();}catch(e){}
      });
      var share=actionButton('share','↗','',function(){
        try{if(typeof window.shareApp==='function')window.shareApp();else if(navigator.share)navigator.share({title:'K-Talk LIVE',url:location.href}).catch(function(){});}catch(e){}
      });

      bar.innerHTML='';
      bar.appendChild(input);
      bar.appendChild(send);
      bar.appendChild(people);
      bar.appendChild(rose);
      bar.appendChild(gift);
      bar.appendChild(share);

      root.classList.add('kt-secret-guest-clean-20261003');
    }catch(e){}
  }

  function style(){
    if(document.getElementById('ktSecretGuestCleanBottomStyle20261003'))return;
    var s=document.createElement('style');
    s.id='ktSecretGuestCleanBottomStyle20261003';
    s.textContent=
      '#screen .kt-remote-live.kt-secret-guest-clean-20261003>.kt-remote-bottom{position:fixed!important;left:8px!important;right:8px!important;bottom:calc(8px + env(safe-area-inset-bottom))!important;display:flex!important;align-items:center!important;gap:7px!important;z-index:2147482500!important;background:transparent!important}'+
      '#screen .kt-remote-live.kt-secret-guest-clean-20261003>.kt-remote-bottom>input{flex:1 1 auto!important;min-width:0!important;height:46px!important;border-radius:24px!important;border:1px solid #42434c!important;background:#1b1b20!important;color:#fff!important;padding:0 18px!important;font-size:16px!important;font-weight:800!important}'+
      '#screen .kt-remote-live.kt-secret-guest-clean-20261003>.kt-remote-bottom>button{width:48px!important;height:48px!important;min-width:48px!important;flex:0 0 48px!important;border-radius:50%!important;border:1px solid #3c3d45!important;background:#17171d!important;color:#fff!important;display:grid!important;place-items:center!important;padding:0!important}'+
      '#screen .kt-remote-live.kt-secret-guest-clean-20261003>.kt-remote-bottom>button i{font-style:normal!important;font-size:23px!important;line-height:1!important}'+
      '#screen .kt-remote-live.kt-secret-guest-clean-20261003>.kt-remote-bottom>button span{display:none!important}';
    document.head.appendChild(s);
  }

  style();
  clean();
  [60,180,400,900,1600].forEach(function(ms){setTimeout(clean,ms);});
  window.addEventListener('kt-remote-host-selected',function(){[80,220,500].forEach(function(ms){setTimeout(clean,ms);});});
  window.addEventListener('kt-guest-approval-received',function(){[20,80,220].forEach(function(ms){setTimeout(clean,ms);});});
  setInterval(clean,800);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSecretGuestCleanTimer20261003);
      window.__ktSecretGuestCleanTimer20261003=setTimeout(clean,40);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
})();