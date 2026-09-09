/* K-Talk loader: keep the existing music fix unchanged, then load the approved 13-person room preview. */
(function(){
  function load(src){
    var s=document.createElement('script');
    s.src=src;
    s.async=false;
    document.head.appendChild(s);
  }
  load('music-recording-base.js?v=20260907-group13');
  load('group13-approved-room.js?v=20260907-group13');
  load('room-transition-no-old-flash.js?v=20260909-roomflash1');
  load('earnings-rooms-copy.js?v=20260909-earnings-restore1');
  load('mobile-open-compat.js?v=20260909-mobile1');
  load('video-more-menu.js?v=20260909-video-more1');
  load('public-feed-three-dot.js?v=20260909-feedmore1');
  load('video-duplicate-delete-fix.js?v=20260909-videofix1');
})();

/* 촬영 화면의 편집효과 바로 아래 V(더보기) 버튼만 제거. 다른 버튼/기능은 건드리지 않음. */
(function(){
  var btn=document.querySelector('#creator .creator-tools > button[aria-label="더보기"]');
  if(btn)btn.remove();
})();

/* 방송 화면 오른쪽 버튼 중복만 정리: 효과 1개, 보물상자 1개, 좋아요 뒤 겹친 그림자 제거. */
(function(){
  if(window.__ktLiveSideDuplicateCleanupInstalled)return;
  window.__ktLiveSideDuplicateCleanupInstalled=true;

  function kindOf(btn){
    var txt=String(btn.textContent||'').replace(/\s+/g,'');
    var oc=String(btn.getAttribute('onclick')||'');
    if(txt.indexOf('좋아요')>-1||oc.indexOf('addHostLike')>-1)return 'like';
    if(txt.indexOf('보물상자')>-1||oc.indexOf('openTreasure')>-1)return 'treasure';
    if(txt.indexOf('효과')>-1||oc.indexOf('openEditEffectPanel')>-1||/Effect\s*\(/.test(oc))return 'effect';
    return '';
  }

  function liveScreen(){
    var screen=document.getElementById('screen');
    if(!screen)return null;
    return screen.querySelector('#ktSept2Live,.ktsolo-room,.ktsubscriber-room,.ktsecret-room,.ktg13-room,.live-view')?screen:null;
  }

  function isVisibleRight(btn){
    try{
      var r=btn.getBoundingClientRect();
      var cs=getComputedStyle(btn);
      if(cs.display==='none'||cs.visibility==='hidden'||parseFloat(cs.opacity||'1')===0)return false;
      if(r.width<20||r.height<20)return false;
      return r.left>window.innerWidth*.55 && r.right>window.innerWidth*.72 && r.top>55 && r.bottom<window.innerHeight-35;
    }catch(e){return false;}
  }

  function stackScore(el){
    var score=0,n=el,depth=0;
    try{
      while(n&&n!==document.documentElement&&depth<8){
        var z=parseInt(getComputedStyle(n).zIndex,10);
        if(isFinite(z))score+=z*100;
        n=n.parentElement;depth++;
      }
    }catch(e){}
    return score;
  }

  function cleanup(){
    var screen=liveScreen();
    if(!screen)return;
    var groups={like:[],treasure:[],effect:[]};
    Array.prototype.forEach.call(screen.querySelectorAll('button'),function(btn){
      var k=kindOf(btn);
      if(k&&isVisibleRight(btn))groups[k].push(btn);
    });

    ['like','treasure','effect'].forEach(function(k){
      var list=groups[k];
      if(!list.length)return;
      list.sort(function(a,b){
        var d=stackScore(b)-stackScore(a);
        if(d)return d;
        return Array.prototype.indexOf.call(screen.querySelectorAll('button'),b)-Array.prototype.indexOf.call(screen.querySelectorAll('button'),a);
      });
      var keep=list[0];
      list.slice(1).forEach(function(btn){
        btn.style.setProperty('display','none','important');
        btn.setAttribute('data-kt-hidden-duplicate-side',k);
      });
      if(k==='like'&&keep){
        keep.style.setProperty('box-shadow','none','important');
        keep.style.setProperty('filter','none','important');
      }
    });
  }

  var timer=0;
  function schedule(){clearTimeout(timer);timer=setTimeout(cleanup,30);}
  document.addEventListener('click',schedule,true);
  window.addEventListener('resize',schedule);
  var obs=new MutationObserver(schedule);
  obs.observe(document.documentElement,{childList:true,subtree:true});
  setTimeout(cleanup,80);
  setTimeout(cleanup,350);
})();
