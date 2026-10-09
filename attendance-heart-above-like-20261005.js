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
    try{
      var room=document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,'+
        '#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .kt-remote-live');
      if(!room)return;
      /* 9-person guest: retain the one main attendance button; do not create
         extra heart/attendance counters that accumulate on rerender. */
      var guest9=document.querySelector('#screen .kt-remote-live.kt-g9-host-copy');
      if(guest9){
        guest9.querySelectorAll('.kt-attendance-like-count').forEach(function(el){el.remove();});
        var buttons=guest9.querySelectorAll('.ktg13-attend');
        for(var k=1;k<buttons.length;k++)buttons[k].remove();
        return;
      }
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
