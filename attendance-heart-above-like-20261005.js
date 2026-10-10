/* K-Talk attendance heart counter above Like only - 1150617
   Scope: adds one small counter above an existing 좋아요 control.
   No room layout, gift, chat, earnings, signaling or existing button logic changes. */
(function(){
  if(window.__ktAttendanceAboveLike20261005)return;
  window.__ktAttendanceAboveLike20261005=true;

  function count(){
    try{
      if(typeof window.ktAttendanceHeartCount==='function')return Number(window.ktAttendanceHeartCount()||0);
      return parseInt(localStorage.getItem('ktalk_attendance_hearts')||'0',10)||0;
    }catch(e){return 0;}
  }

  function findLike(root){
    var all=(root||document).querySelectorAll('button,[role="button"],.kt-remote-action,.ktsolo-tools>*,'+
      '.ktg13-tools>*,.ktsubscriber-tools>*,.ktsecret-tools>*');
    for(var i=0;i<all.length;i++){
      var el=all[i];
      var t=String(el.textContent||el.getAttribute('aria-label')||'').replace(/\s+/g,'').trim();
      if(t.indexOf('좋아요')>-1)return el;
    }
    return null;
  }

  function paint(){
    if(document.documentElement.classList.contains('kt-remote-viewing'))return;
    try{
      var room=document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,'+
        '#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .kt-remote-live');
      if(!room)return;
      /* Guest rooms must not create an additional attendance-heart control. */
      if(document.documentElement.classList.contains('kt-remote-viewing') ||
         room.closest('.kt-remote-live,.kt-guest-room,.kt-approved-guest-room,.kt-prejoin-room,.kt-guest-hostlike-room'))return;
      var like=findLike(room);
      if(!like)return;

      var holder=like.parentElement||room;
      if(getComputedStyle(holder).position==='static')holder.style.setProperty('position','relative');

      var b=holder.querySelector(':scope > .kt-attendance-like-count');
      if(!b){
        b=document.createElement('button');
        b.type='button';
        b.className='kt-attendance-like-count';
        b.setAttribute('aria-label','하트 출석체크');
        b.innerHTML='<span>♥</span> <b data-kt-attendance-like-number>0</b>';
        b.addEventListener('click',function(e){
          try{e.preventDefault();e.stopPropagation();}catch(_e){}
          try{
            if(typeof window.ktAttendanceCheck==='function')window.ktAttendanceCheck();
          }catch(_e){}
          setTimeout(paint,30);
          setTimeout(paint,250);
        });
        holder.appendChild(b);
      }

      var lr=like.getBoundingClientRect(),hr=holder.getBoundingClientRect();
      if(lr.width&&hr.width){
        var left=Math.max(2,Math.round(lr.left-hr.left+(lr.width/2)-28));
        var top=Math.max(2,Math.round(lr.top-hr.top-28));
        b.style.setProperty('left',left+'px','important');
        b.style.setProperty('top',top+'px','important');
      }
      var n=b.querySelector('[data-kt-attendance-like-number]');
      if(n)n.textContent=String(count());
    }catch(e){}
  }

  function style(){
    if(document.getElementById('ktAttendanceAboveLikeStyle20261005'))return;
    var s=document.createElement('style');
    s.id='ktAttendanceAboveLikeStyle20261005';
    s.textContent=''
      +'.kt-attendance-like-count{position:absolute!important;z-index:850!important;width:56px!important;height:24px!important;'
      +'padding:0 7px!important;border-radius:999px!important;border:1px solid rgba(255,92,177,.65)!important;'
      +'background:rgba(18,10,18,.88)!important;color:#fff!important;display:flex!important;align-items:center!important;'
      +'justify-content:center!important;gap:3px!important;font:950 11px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;'
      +'box-shadow:0 0 9px rgba(255,70,174,.38)!important;touch-action:manipulation!important}'
      +'.kt-attendance-like-count span{color:#ff5bac!important;font-size:13px!important;text-shadow:0 0 5px #ff4ca7!important}'
      +'.kt-attendance-like-count b{font:950 11px/1 inherit!important;color:#ffe5f4!important}';
    document.head.appendChild(s);
  }

  style();
  paint();

  var oldRender=window.ktRenderAttendance;
  if(typeof oldRender==='function'&&!oldRender.__ktAboveLikeWrapped){
    var fn=function(){
      var r=oldRender.apply(this,arguments);
      setTimeout(paint,0);
      return r;
    };
    fn.__ktAboveLikeWrapped=true;
    window.ktRenderAttendance=fn;
  }

  [50,150,350,700,1200].forEach(function(ms){setTimeout(paint,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktAttendanceAboveLikeTimer);
      window.__ktAttendanceAboveLikeTimer=setTimeout(paint,60);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',paint);
  window.addEventListener('kt-attendance-heart-updated',function(){
    setTimeout(paint,0);
    setTimeout(paint,80);
  });
})();

/* 9999: hide duplicate attendance UI in guest views only; do not remove nodes or affect hosts. */
(function(){
  if(document.getElementById('kt-guest-attendance-hide-9999'))return;
  var s=document.createElement('style');
  s.id='kt-guest-attendance-hide-9999';
  var guest='html.kt-remote-viewing #screen ';
  var scoped=['.kt-live-attendance','.kgh-attend','.kt-attendance-check','.kt-attendance-btn','.kt-attendance-like-count','[data-kt-attendance]','[aria-label="하트 출석체크"]'];
  var selectors=[];
  scoped.forEach(function(x){selectors.push(guest+x);});
  ['.kt-guest-room','.kt-approved-guest-room','.kt-prejoin-room','.kt-guest-hostlike-room','.kt-remote-live'].forEach(function(root){scoped.forEach(function(x){selectors.push('#screen '+root+' '+x);});});
  s.textContent=selectors.join(',')+'{display:none!important;visibility:hidden!important;pointer-events:none!important}';
  (document.head||document.documentElement).appendChild(s);
  /* Hide text-only duplicate attendance controls in every guest room, without removing DOM nodes. */
  function hideGuestDuplicates(){
    try{
      var roots=[].slice.call(document.querySelectorAll('#screen .kt-remote-live,#screen .kt-guest-room,#screen .kt-approved-guest-room,#screen .kt-prejoin-room,#screen .kt-guest-hostlike-room'));
      if(document.documentElement.classList.contains('kt-remote-viewing')){
        var screen=document.getElementById('screen');if(screen)roots.push(screen);
      }
      roots.forEach(function(root){
        root.querySelectorAll('button,[role="button"],a,.kt-live-attendance,.kgh-attend,.kt-attendance-check,.kt-attendance-btn').forEach(function(el){
          var label=String(el.getAttribute('aria-label')||'');
          var text=String(el.textContent||'').replace(/\s+/g,'').trim();
          if(/출석\s*체크/.test(label)||(/^.{0,16}출석체크.{0,16}$/.test(text))||/하트출석체크/.test(label)){
            el.style.setProperty('display','none','important');
          }
        });
      });
    }catch(e){}
  }
  var scheduled=false;
  function scheduleGuestHide(){
    if(scheduled)return;scheduled=true;
    setTimeout(function(){scheduled=false;hideGuestDuplicates();},70);
  }
  hideGuestDuplicates();
  new MutationObserver(scheduleGuestHide).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  window.addEventListener('kt-room-entered',scheduleGuestHide);
})();
