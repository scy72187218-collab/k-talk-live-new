/* K-Talk 첫 화면 동영상 전용 보강: 검은 화면 지연 제거 + 실제 공개 동영상 우선 재생. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktHomeVideoInstantFixBoot)return;
  window.__ktHomeVideoInstantFixBoot=true;

  /* requested-fixes의 오래된 첫화면 억제 블록은 실행하지 않게 하고, 이 파일이 최종 홈 재생을 맡는다. */
  window.__ktHomeFeedAudioFixInstalled=true;
  try{document.body.classList.add('kt-home');}catch(e){}

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function cached(){
    try{var a=JSON.parse(localStorage.getItem('ktalk_fast_feed')||'[]');return Array.isArray(a)?a.filter(function(x){return x&&x.video_url;}):[];}catch(e){return [];}
  }
  function save(a){try{if(a&&a.length)localStorage.setItem('ktalk_fast_feed',JSON.stringify(a));}catch(e){}}
  async function fetchFeed(){
    try{
      var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit=40',{headers:{apikey:KEY,Authorization:'Bearer '+KEY}});
      if(!r.ok)return [];
      var a=await r.json();
      return Array.isArray(a)?a.filter(function(x){return x&&x.video_url;}):[];
    }catch(e){return [];}
  }
  function card(x,i){
    var id=esc(x.id||''),u=esc(x.video_url||''),name=esc(x.author_name||'K-Talk'),title=esc(x.title||'K-Talk 동영상');
    return '<section class="kt-fast-feed-card" style="height:calc(100dvh - 78px);min-height:560px;position:relative;scroll-snap-align:start;background:#000;overflow:hidden">'
      +'<video class="kt-public-video" '+(i===0?'autoplay ':'')+'muted loop playsinline webkit-playsinline preload="auto" src="'+u+'" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#000"></video>'
      +'<div class="vh-shade"></div>'
      +'<div class="vh-tabs"><span>LIVE</span><span>커뮤니티</span><span>팔로잉</span><span class="on">추천</span><button>⌕</button></div>'
      +'<div class="vh-title"><b>♛ '+name+'</b><span>'+title+'</span></div>'
      +'<div class="vh-actions">'
        +'<button onclick="if(window.ktPublicLike)ktPublicLike(\''+id+'\',this)">♡<small>좋아요 '+Number(x.likes||0)+'</small></button>'
        +'<button onclick="if(window.ktPublicComments)ktPublicComments(\''+id+'\')">💬<small>댓글</small></button>'
        +'<button onclick="if(window.openGifts)openGifts()">🎁<small>선물</small></button>'
        +'<button onclick="if(window.ktPublicShare)ktPublicShare(\''+u+'\')">↗<small>공유</small></button>'
      +'</div>'
    +'</section>';
  }
  function loading(){
    var host=document.getElementById('screen');if(!host)return;
    document.body.classList.remove('kt-home');document.body.classList.add('kt-video-mode');
    host.innerHTML='<section style="height:calc(100dvh - 78px);display:grid;place-items:center;background:#000;color:#fff;font-weight:900"><div>동영상 불러오는 중…</div></section>';
  }
  function bind(){
    var vs=[].slice.call(document.querySelectorAll('.kt-public-video'));
    if(!vs.length)return;
    vs.forEach(function(v,idx){
      v.muted=true;v.defaultMuted=true;v.setAttribute('playsinline','');v.setAttribute('webkit-playsinline','');v.preload='auto';
      var playNow=function(){if(idx!==0)return;try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}};
      if(v.readyState>=2)playNow();else{v.addEventListener('loadeddata',playNow,{once:true});v.addEventListener('canplay',playNow,{once:true});}
      v.addEventListener('error',function(){
        try{var sec=v.closest('.kt-fast-feed-card');if(sec)sec.style.display='none';}catch(e){}
        var next=vs[idx+1];if(next){try{var p=next.play();if(p&&p.catch)p.catch(function(){});}catch(e){}}
      });
      v.addEventListener('click',function(e){
        e.preventDefault();e.stopPropagation();
        try{v.muted=false;v.defaultMuted=false;v.volume=1;if(v.paused){var p=v.play();if(p&&p.catch)p.catch(function(){});}else{v.pause();}}catch(err){}
      });
    });
    if('IntersectionObserver' in window){
      var ob=new IntersectionObserver(function(es){es.forEach(function(e){try{if(e.isIntersecting&&e.intersectionRatio>.55)e.target.play().catch(function(){});else e.target.pause();}catch(err){}});},{threshold:[.55]});
      vs.forEach(function(v){ob.observe(v);});
    }
  }
  function render(a){
    var host=document.getElementById('screen');if(!host||!a||!a.length)return false;
    document.body.classList.remove('kt-home');document.body.classList.add('kt-video-mode');
    host.innerHTML='<div style="height:calc(100dvh - 78px);overflow-y:auto;scroll-snap-type:y mandatory;background:#000">'+a.map(card).join('')+'</div>';
    bind();
    return true;
  }
  function install(){
    if(window.__ktHomeVideoInstantFixInstalled)return;
    window.__ktHomeVideoInstantFixInstalled=true;
    var fallback=window.home;
    window.home=function(){
      try{if(window.activate)activate('home');}catch(e){}
      var a=cached();
      if(a.length){
        render(a);
        fetchFeed().then(function(fresh){if(fresh.length)save(fresh);});
        return;
      }
      loading();
      fetchFeed().then(function(fresh){
        if(fresh.length){save(fresh);render(fresh);return;}
        try{if(fallback)fallback();}catch(e){}
      });
    };
    try{document.body.classList.remove('kt-home');}catch(e){}
    setTimeout(function(){try{window.home();}catch(e){}},0);
  }
  function wait(n){
    if(window.__ktRequestedFixes20260907Installed||n>50){install();return;}
    setTimeout(function(){wait(n+1);},20);
  }
  wait(0);
})();
