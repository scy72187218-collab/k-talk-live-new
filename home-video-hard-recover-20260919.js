/* K-Talk 첫 화면 공개 동영상 강제 복구
   - 홈 첫 화면이 검게 비는 경우 공개 동영상을 직접 다시 불러온다.
   - 방송 5개/채팅/스위치/레이아웃/잠금은 변경하지 않음. */
(function(){
  if(window.__ktHomeVideoHardRecover20260919)return;
  window.__ktHomeVideoHardRecover20260919=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var rendering=false;
  var lastRender=0;
  var initialServerRefreshDone=false;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function busyElsewhere(){
    try{
      if(document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .kt-remote-live'))return true;
      var creator=document.getElementById('creator');
      if(creator&&creator.classList.contains('show'))return true;
      /* 숨겨진 시트 상태는 홈 동영상 복구를 막지 않는다. */
    }catch(e){}
    return false;
  }

  async function localRows(){
    try{
      if(!('indexedDB' in window))return [];
      return await new Promise(function(resolve){
        var req=indexedDB.open('KTALK_VIDEO_DB',1);
        req.onerror=function(){resolve([]);};
        req.onupgradeneeded=function(){
          try{
            var db=req.result;
            if(!db.objectStoreNames.contains('videos'))db.createObjectStore('videos',{keyPath:'id'});
          }catch(e){}
        };
        req.onsuccess=function(){
          var db=req.result;
          try{
            var tx=db.transaction('videos','readonly');
            var q=tx.objectStore('videos').getAll();
            q.onerror=function(){try{db.close();}catch(e){}resolve([]);};
            q.onsuccess=function(){
              var list=(q.result||[])
                .filter(function(v){return v&&v.blob&&(v.posted||v.publicPosted||!v.draft);})
                .sort(function(a,b){return (b.postedAt||b.createdAt||0)-(a.postedAt||a.createdAt||0);})
                .slice(0,40)
                .map(function(v){
                  var u='';
                  try{u=URL.createObjectURL(v.blob);}catch(e){}
                  return {
                    id:v.id||('local-'+Date.now()),
                    author_name:'K-Talk',
                    title:v.name||'내 동영상',
                    video_url:u,
                    created_at:new Date(v.createdAt||Date.now()).toISOString(),
                    likes:0,
                    _local:true
                  };
                })
                .filter(function(v){return !!v.video_url;});
              try{db.close();}catch(e){}
              resolve(list);
            };
          }catch(e){try{db.close();}catch(x){}resolve([]);}
        };
      });
    }catch(e){return [];}
  }

  async function fetchRows(url,headersObj,timeoutMs){
    var ctl=('AbortController' in window)?new AbortController():null;
    var timer=ctl?setTimeout(function(){try{ctl.abort();}catch(e){}},timeoutMs||4500):0;
    try{
      var r=await fetch(url,{
        cache:'no-store',
        signal:ctl?ctl.signal:void 0,
        headers:headersObj||{}
      });
      if(timer)clearTimeout(timer);
      if(!r.ok)return [];
      var a=await r.json();
      return Array.isArray(a)?a:[];
    }catch(e){
      if(timer)clearTimeout(timer);
      return [];
    }
  }

  async function rows(){
    var a=[];

    /* 1차: K-Talk 전용 서버 */
    a=await fetchRows('https://zupwbfmacwzexyvznlzq.supabase.co/functions/v1/ktalk-video-feed',{'x-ktalk-feed':'shared-public-v1'},4500);

    /* 2차: 직접 공개목록 */
    if(!a.length){
      a=await fetchRows('https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/ktalk_videos?select=id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit=40',{apikey:KEY,Authorization:'Bearer '+KEY,'Cache-Control':'no-cache'},4500);
    }

    if(a.length){
      try{
        localStorage.setItem('ktalk_fast_feed',JSON.stringify(a));
        localStorage.setItem('ktalk_fast_feed_saved_at',String(Date.now()));
      }catch(e){}
      return a;
    }

    /* 3차: 마지막 정상 공용 목록 */
    try{
      var cached=JSON.parse(localStorage.getItem('ktalk_fast_feed')||'[]');
      if(Array.isArray(cached)&&cached.length)return cached;
    }catch(e){}
    return [];
  }

  function card(x,i){
    var u=esc(x.video_url||'');
    var name=esc(x.author_name||'K-Talk');
    var title=esc(x.title||'K-Talk 동영상');
    return '<section class="kt-hard-video-card" style="height:calc(100dvh - 78px);min-height:520px;position:relative;scroll-snap-align:start;background:#000;overflow:hidden">'
      +'<video class="kt-public-video kt-hard-public-video" '+(i===0?'autoplay ':'')+'muted loop playsinline preload="'+(i===0?'auto':'metadata')+'" src="'+u+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000"></video>'
      +'<div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(0,0,0,.08),transparent 35%,transparent 62%,rgba(0,0,0,.58))"></div>'
      +'<div style="position:absolute;left:14px;right:82px;bottom:24px;color:#fff;text-shadow:0 2px 6px #000;z-index:3"><b style="display:block;color:#ffe079;font-size:17px">♛ '+name+'</b><span style="display:block;margin-top:5px;font-size:12px">'+title+'</span></div>'
      +'</section>';
  }

  function playVisible(){
    if(document.hidden)return;
    var list=[].slice.call(document.querySelectorAll('#screen .kt-hard-public-video'));
    if(!list.length)return;
    var cy=(innerHeight||document.documentElement.clientHeight||0)/2,best=null,dist=Infinity;
    list.forEach(function(v){
      try{
        var r=v.getBoundingClientRect();
        var d=Math.abs((r.top+r.bottom)/2-cy);
        if(r.bottom>0&&r.top<(innerHeight||0)&&d<dist){dist=d;best=v;}
      }catch(e){}
    });
    if(!best)best=list[0];
    list.forEach(function(v){if(v!==best){try{v.pause();}catch(e){}}});
    try{
      best.muted=true;best.defaultMuted=true;best.volume=0;
      var p=best.play();if(p&&p.catch)p.catch(function(){});
    }catch(e){}
  }

  function bind(){
    var list=[].slice.call(document.querySelectorAll('#screen .kt-hard-public-video'));
    list.forEach(function(v){
      if(v.dataset.ktHardBound==='1')return;
      v.dataset.ktHardBound='1';
      v.addEventListener('click',function(){
        try{
          if(v.paused){v.muted=false;v.volume=1;var p=v.play();if(p&&p.catch)p.catch(function(){});}
          else{v.pause();}
        }catch(e){}
      });
      v.addEventListener('error',function(){
        try{
          var card=v.closest('.kt-hard-video-card');
          if(card)card.style.display='none';
          setTimeout(playVisible,30);
        }catch(e){}
      });
    });
    var scroller=document.querySelector('#screen .kt-hard-video-scroller');
    if(scroller&&!scroller.dataset.ktHardScrollBound){
      scroller.dataset.ktHardScrollBound='1';
      scroller.addEventListener('scroll',function(){
        clearTimeout(window.__ktHardVideoScrollTimer);
        window.__ktHardVideoScrollTimer=setTimeout(playVisible,70);
      },{passive:true});
    }
    [0,80,220,500,900].forEach(function(ms){setTimeout(playVisible,ms);});
  }

  async function forceHome(forceServer){
    if(busyElsewhere())return;
    if(rendering){
      if(forceServer){
        clearTimeout(window.__ktHardVideoQueuedRefresh);
        window.__ktHardVideoQueuedRefresh=setTimeout(function(){try{forceHome(true);}catch(e){}},180);
      }
      return;
    }
    try{
      var existing=document.querySelector('#screen .kt-public-video,#screen #homeVideo,#screen .kt-hard-public-video');
      if(existing&&!forceServer){
        playVisible();
        return;
      }
    }catch(e){}
    var now=Date.now();
    if(now-lastRender<350)return;
    lastRender=now;
    rendering=true;
    try{
      var screen=document.getElementById('screen');
      if(!screen)return;

      document.body.classList.remove('kt-home');
      document.body.classList.add('kt-video-mode');

      /* 서버 응답을 기다리는 동안 검은 로딩 화면을 보여주지 않는다.
         마지막 정상 공용목록이 있으면 즉시 먼저 표시한다. */
      var cached=[];
      try{
        cached=JSON.parse(localStorage.getItem('ktalk_fast_feed')||'[]');
        if(!Array.isArray(cached))cached=[];
      }catch(e){cached=[];}

      if(cached.length){
        screen.innerHTML='<div class="kt-hard-video-scroller" data-kt-instant-cache="1" style="height:calc(100dvh - 78px);overflow-y:auto;scroll-snap-type:y mandatory;background:#000">'+cached.map(card).join('')+'</div>';
        bind();
      }else{
        screen.innerHTML='<div style="height:calc(100dvh - 78px);display:grid;place-items:center;background:#000;color:#bbb;font-size:14px">동영상 연결 중...</div>';
      }

      var a=await rows();
      if(!a.length){
        /* 이미 마지막 정상목록을 띄웠으면 그대로 유지한다. */
        if(cached.length)return;
        screen.innerHTML='<div style="height:calc(100dvh - 78px);display:grid;place-items:center;background:#000;color:#ddd;text-align:center;padding:24px"><div><b style="font-size:16px">동영상 연결을 다시 확인하고 있습니다.</b><br><span style="font-size:12px;opacity:.75">잠시만 기다려 주세요.</span></div></div>';
        return;
      }

      screen.innerHTML='<div class="kt-hard-video-scroller" style="height:calc(100dvh - 78px);overflow-y:auto;scroll-snap-type:y mandatory;background:#000">'+a.map(card).join('')+'</div>';
      bind();
    }catch(e){
      try{
        var screen=document.getElementById('screen');
        if(screen)screen.innerHTML='<div style="height:calc(100dvh - 78px);display:grid;place-items:center;background:#000;color:#ddd">동영상 다시 불러오는 중...</div>';
      }catch(x){}
    }finally{
      rendering=false;
    }
  }

  /* 홈 버튼은 검은 빈 화면 대신 이 복구 홈을 가장 먼저 실행 */
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('[data-bottom="home"]'):null;
    if(!b)return;
    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(x){}
    forceHome();
  },true);

  window.ktForceHomeVideoRecovery=forceHome;

  function ensureHomeOnce(){
    try{
      if(busyElsewhere()||document.hidden)return;
      var s=document.getElementById('screen');
      if(!s)return;

      /* 앱 아이콘으로 새로 연 첫 진입은 기기 로컬 캐시보다 서버 최신 목록을 우선한다. */
      if(!initialServerRefreshDone){
        initialServerRefreshDone=true;
        forceHome(true);
        return;
      }

      var v=s.querySelector('.kt-public-video,#homeVideo,.kt-hard-public-video');
      if(v){
        playVisible();
        return;
      }
      forceHome(false);
    }catch(e){}
  }

  /* 앱 첫 진입 때 방송방이 아니면 서버 최신 공개 동영상부터 연다 */
  [120,350,800,1500].forEach(function(ms){
    setTimeout(ensureHomeOnce,ms);
  });

  window.addEventListener('pageshow',function(){setTimeout(ensureHomeOnce,120);});
  document.addEventListener('visibilitychange',function(){
    if(!document.hidden)setTimeout(ensureHomeOnce,120);
  });

  window.__ktHomeVideoHardWatch20260919=setInterval(function(){
    try{
      if(document.hidden||busyElsewhere())return;
      var s=document.getElementById('screen');
      if(!s)return;
      var hasVideo=!!s.querySelector('.kt-public-video,#homeVideo,.kt-hard-public-video');
      var hasFallback=String(s.textContent||'').indexOf('동영상을 불러오지 못했습니다')>-1;
      if(!hasVideo&&!hasFallback)forceHome();
      else if(hasVideo)playVisible();
    }catch(e){}
  },1000);
})();