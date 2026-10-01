/* K-Talk 9-room guest PRE-APPROVAL bottom order lock — 2026-10-01 — PIN 5555
   Applies ONLY to the 9-room guest screen BEFORE approval/entry.
   Exact order: chat input -> send arrow -> people -> rose -> gift -> share.
   Approved in-room guest screen is left unchanged.
   Does not touch grid, video, approval/signaling, earnings, host room, or other rooms.
*/
(function(){
  if(window.__ktGuest9TwoPageBottomOrder5555_20261001)return;
  window.__ktGuest9TwoPageBottomOrder5555_20261001=true;

  function isNine(root){
    if(!root)return false;
    try{
      if(root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]'))return true;
      if(root.classList.contains('kt-g9-final-5555'))return true;
      var txt=String(root.textContent||'');
      var st=window.state||{};
      txt+=' '+String(st.liveRoomName||'')+' '+String(st.liveRoomType||'')+' '+String(st.liveRoomMax||'');
      var last=window.__ktLastLiveRoom||{};
      txt+=' '+String(last.room_name||'')+' '+String(last.room_type||'');
      return /9\s*명|group9/i.test(txt);
    }catch(e){return false;}
  }

  function iconButton(cls,text,label){
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-remote-action '+cls;
    b.textContent=text;
    b.setAttribute('aria-label',label);
    b.setAttribute('title',label);
    return b;
  }

  function ensureStyle(){
    if(document.getElementById('ktGuest9TwoPageBottomOrder5555Style'))return;
    var s=document.createElement('style');
    s.id='ktGuest9TwoPageBottomOrder5555Style';
    s.textContent=''
      +'#screen .kt-remote-live.kt-g9-six-order-5555>.kt-remote-bottom{display:flex!important;align-items:center!important;gap:5px!important}'
      +'#screen .kt-remote-live.kt-g9-six-order-5555>.kt-remote-bottom>input{order:1!important;flex:1 1 auto!important;min-width:0!important}'
      +'#screen .kt-remote-live.kt-g9-six-order-5555>.kt-remote-bottom>[data-kt-g9-order="send"]{order:2!important}'
      +'#screen .kt-remote-live.kt-g9-six-order-5555>.kt-remote-bottom>[data-kt-g9-order="people"]{order:3!important}'
      +'#screen .kt-remote-live.kt-g9-six-order-5555>.kt-remote-bottom>[data-kt-g9-order="rose"]{order:4!important}'
      +'#screen .kt-remote-live.kt-g9-six-order-5555>.kt-remote-bottom>[data-kt-g9-order="gift"]{order:5!important}'
      +'#screen .kt-remote-live.kt-g9-six-order-5555>.kt-remote-bottom>[data-kt-g9-order="share"]{order:6!important}'
      +'#screen .kt-remote-live.kt-g9-six-order-5555>.kt-remote-bottom>[data-kt-g9-order]{'
        +'flex:0 0 40px!important;width:40px!important;height:40px!important;min-width:40px!important;'
        +'display:grid!important;place-items:center!important;border-radius:50%!important;padding:0!important;'
        +'font-size:18px!important;line-height:1!important;touch-action:manipulation!important}'
      +'#screen .kt-remote-live.kt-g9-six-order-5555>.kt-remote-bottom>[data-kt-g9-order="people"]{color:#57e6ff!important}'
      +'@media(max-width:390px){'
        +'#screen .kt-remote-live.kt-g9-six-order-5555>.kt-remote-bottom{gap:4px!important}'
        +'#screen .kt-remote-live.kt-g9-six-order-5555>.kt-remote-bottom>[data-kt-g9-order]{width:37px!important;height:37px!important;min-width:37px!important;flex-basis:37px!important;font-size:17px!important}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  function byText(bar,re){
    return [].slice.call(bar.querySelectorAll('button')).find(function(b){
      return re.test(String(b.textContent||'').replace(/\s+/g,''));
    })||null;
  }

  function isApprovedInside(root){
    try{
      return root.classList.contains('kt-guest-hostlike-active')||
        root.classList.contains('kt-approved-guest-room')||
        !!root.querySelector('.kt-guest-hostlike-room,.kt-approved-guest-grid');
    }catch(e){return false;}
  }

  function ensure(root){
    /* Owner request: third-photo layout ONLY before approval/entry.
       Once approval changes to the in-room guest layout, do not touch it. */
    if(!isNine(root)||isApprovedInside(root)){
      root.classList.remove('kt-g9-six-order-5555');
      return;
    }
    var bar=root.querySelector(':scope > .kt-remote-bottom')||root.querySelector('.kt-remote-bottom');
    if(!bar)return;
    var input=bar.querySelector('input');
    if(!input)return;

    root.classList.add('kt-g9-six-order-5555');

    var send=document.getElementById('ktRemoteChatSend')||
      bar.querySelector('.kt-remote-action.send,[data-kt-send-plane-5555],[data-kt-send-plane-hard-5555]');
    if(!send){
      send=iconButton('send','➤','채팅 보내기');
      send.onclick=function(){try{if(typeof window.ktRemoteSendChat==='function')window.ktRemoteSendChat();}catch(e){}};
    }

    var people=document.getElementById('ktRemoteGuestRequest')||
      bar.querySelector('.kt-remote-guest-request')||
      byText(bar,/👥|👤/);
    if(!people){
      people=iconButton('kt-remote-guest-request','👥','게스트');
    }

    var rose=document.getElementById('ktRemoteRoseButton')||
      bar.querySelector('.kt-remote-rose')||
      byText(bar,/🌹/);
    if(!rose){
      rose=iconButton('kt-remote-rose','🌹','장미');
      rose.onclick=function(){try{if(typeof window.ktRemoteOpenGifts==='function')window.ktRemoteOpenGifts();}catch(e){}};
    }

    var gift=bar.querySelector('.kt-remote-action.gift,[data-kt-gift],#ktRemoteGiftButton')||
      byText(bar,/🎁|선물/);
    if(!gift){
      gift=iconButton('gift','🎁','선물상자');
      gift.onclick=function(){
        try{
          if(typeof window.ktRemoteOpenGifts==='function')return window.ktRemoteOpenGifts();
          if(typeof window.openGifts==='function')return window.openGifts();
        }catch(e){}
      };
    }

    var share=bar.querySelector('.kt-remote-action.share,[data-kt-share],#ktRemoteShareButton')||
      byText(bar,/↗|공유/);
    if(!share){
      share=iconButton('share','↗','공유');
      share.onclick=function(){
        try{
          if(typeof window.shareApp==='function')return window.shareApp();
          if(navigator.share)navigator.share({title:'K-Talk LIVE',url:location.href}).catch(function(){});
        }catch(e){}
      };
    }

    [send,people,rose,gift,share].forEach(function(b){if(b&&b.parentElement!==bar)bar.appendChild(b);});
    send.setAttribute('data-kt-g9-order','send');
    people.setAttribute('data-kt-g9-order','people');
    rose.setAttribute('data-kt-g9-order','rose');
    gift.setAttribute('data-kt-g9-order','gift');
    share.setAttribute('data-kt-g9-order','share');

    /* PRE-APPROVAL 9-room must have exactly SIX bottom controls.
       Remove every other direct button from this bottom bar so old copies
       cannot remain before the input or duplicate after it. */
    var keep=[send,people,rose,gift,share];
    [].slice.call(bar.children).forEach(function(el){
      if(!el||el===input||keep.indexOf(el)>=0)return;
      if(el.tagName==='BUTTON'){
        try{el.remove();}catch(e){}
      }
    });

    /* Exact DOM order: input -> send -> people -> rose -> gift -> share. */
    bar.appendChild(input);
    bar.appendChild(send);
    bar.appendChild(people);
    bar.appendChild(rose);
    bar.appendChild(gift);
    bar.appendChild(share);
  }

  function apply(){
    ensureStyle();
    document.querySelectorAll('#screen .kt-remote-live,.kt-remote-live').forEach(ensure);
  }

  apply();
  [20,60,120,250,500,900,1500,2500,4000].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('pageshow',function(){setTimeout(apply,40);});
  window.addEventListener('kt-guest-approval-received',function(){[10,40,100,220,500].forEach(function(ms){setTimeout(apply,ms);});});
  window.addEventListener('kt-any-guest-approved',function(){[10,60,180].forEach(function(ms){setTimeout(apply,ms);});});
  window.addEventListener('kt-three-person-sync-now',function(){setTimeout(apply,30);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest9TwoPageBottomOrder5555Timer);
      window.__ktGuest9TwoPageBottomOrder5555Timer=setTimeout(apply,25);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();