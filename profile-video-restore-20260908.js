/* K-Talk: 내 프로필에서 저장된 내 동영상이 사라져 보이지 않게 하는 표시 복구만 적용. 기존 저장 데이터는 건드리지 않음. */
(function(){
  if(window.__ktProfileVideoRestore20260908)return;
  window.__ktProfileVideoRestore20260908=true;

  var urls=[];
  var timer=0;

  function revokeUrls(){
    urls.forEach(function(u){try{URL.revokeObjectURL(u);}catch(e){}});
    urls=[];
  }

  function getDb(){
    try{
      if(typeof window.ktOpenVideoDB==='function')return window.ktOpenVideoDB();
      if(typeof ktOpenVideoDB==='function')return ktOpenVideoDB();
    }catch(e){}
    return Promise.reject(new Error('video db unavailable'));
  }

  async function allVideos(){
    try{
      var db=await getDb();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readonly');
        var req=tx.objectStore('videos').getAll();
        req.onsuccess=function(){
          var arr=(req.result||[]).filter(function(v){return v&&v.blob;}).sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);});
          try{db.close();}catch(e){}
          resolve(arr);
        };
        req.onerror=function(){try{db.close();}catch(e){}resolve([]);};
      });
    }catch(e){return [];}
  }

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }

  function ensureStyle(){
    if(document.getElementById('ktProfileVideoRestoreStyle'))return;
    var s=document.createElement('style');
    s.id='ktProfileVideoRestoreStyle';
    s.textContent=''
      +'#ktProfilePostedVideos{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:4px!important;margin-top:14px!important}'
      +'#ktProfilePostedVideos .kt-myvideo-row{position:relative!important;aspect-ratio:9/16!important;min-width:0!important;overflow:hidden!important;border-radius:8px!important;background:#111!important;border:1px solid rgba(255,255,255,.08)!important}'
      +'#ktProfilePostedVideos .kt-myvideo-row>video{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;background:#000!important}'
      +'#ktProfilePostedVideos .kt-profile-video-badge{position:absolute;left:5px;bottom:5px;z-index:3;padding:3px 6px;border-radius:999px;background:rgba(0,0,0,.68);color:#fff;font-size:9px;font-weight:850;max-width:calc(100% - 10px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      +'#ktProfilePostedVideos .kt-profile-video-empty{grid-column:1/-1;padding:18px 8px;text-align:center;color:#aaa;font-size:14px}'
      +'#ktProfilePostedVideos .kt-myvideo-more{z-index:8!important;transform:scale(.78);transform-origin:top right}'
      +'#ktProfilePostedVideos .kt-profile-video-head{grid-column:1/-1;display:flex;align-items:center;justify-content:space-between;padding:2px 2px 5px;color:#fff;font-size:13px;font-weight:900}'
      +'#ktProfilePostedVideos .kt-profile-video-head small{color:#aaa;font-size:10px;font-weight:700}';
    document.head.appendChild(s);
  }

  async function render(){
    var box=document.getElementById('ktProfilePostedVideos');
    if(!box)return;
    ensureStyle();
    var items=await allVideos();
    if(!document.body.contains(box))return;
    revokeUrls();

    if(!items.length){
      box.innerHTML='<div class="kt-profile-video-empty">아직 저장된 내 동영상이 없습니다.</div>';
      box.setAttribute('data-kt-profile-video-restored','1');
      return;
    }

    var html='<div class="kt-profile-video-head"><span>🎬 내 동영상</span><small>'+items.length+'개 · 내 기기에만 보임</small></div>';
    items.forEach(function(item){
      var u='';
      try{u=URL.createObjectURL(item.blob);urls.push(u);}catch(e){}
      var id=String(item.id||'');
      var name=esc(item.name||'내 동영상');
      var badge=item.draft?'임시 저장':(item.posted?'올린 동영상':'내 동영상');
      html+='<div class="kt-myvideo-row" data-video-id="'+esc(id)+'" onclick="if(window.playStoredVideo)playStoredVideo(\''+id.replace(/'/g,"\\'")+'\')">'
        +(u?'<video muted playsinline preload="metadata" src="'+esc(u)+'"></video>':'')
        +'<span class="kt-profile-video-badge">'+esc(badge)+' · '+name+'</span>'
        +'</div>';
    });
    box.innerHTML=html;
    box.setAttribute('data-kt-profile-video-restored','1');

    setTimeout(function(){
      try{
        document.querySelectorAll('#ktProfilePostedVideos .kt-myvideo-row').forEach(function(row){
          if(row.querySelector('.kt-myvideo-more'))return;
          var id=row.getAttribute('data-video-id');
          if(!id||typeof window.ktOpenMyVideoMore!=='function')return;
          var b=document.createElement('button');
          b.type='button';b.className='kt-myvideo-more';b.textContent='⋮';b.setAttribute('aria-label','동영상 더보기');
          b.onclick=function(ev){ev.preventDefault();ev.stopPropagation();window.ktOpenMyVideoMore(id,b,false);};
          row.appendChild(b);
        });
      }catch(e){}
    },30);
  }

  function schedule(){
    clearTimeout(timer);
    timer=setTimeout(function(){render();},80);
  }

  var oldRender=window.ktRenderProfilePostedVideos;
  if(typeof oldRender==='function'&&!oldRender.__ktAllLocalWrapped){
    var wrapped=function(){
      var r=oldRender.apply(this,arguments);
      setTimeout(schedule,30);
      return r;
    };
    wrapped.__ktAllLocalWrapped=true;
    window.ktRenderProfilePostedVideos=wrapped;
  }

  try{
    new MutationObserver(function(muts){
      var need=false;
      for(var i=0;i<muts.length;i++){
        var t=muts[i].target;
        if((t&&t.id==='ktProfilePostedVideos')||(document.getElementById('ktProfilePostedVideos')&&!document.getElementById('ktProfilePostedVideos').getAttribute('data-kt-profile-video-restored'))){need=true;break;}
      }
      if(need)schedule();
    }).observe(document.body,{childList:true,subtree:true});
  }catch(e){}

  document.addEventListener('click',function(){
    setTimeout(function(){if(document.getElementById('ktProfilePostedVideos'))schedule();},120);
  },true);

  setTimeout(function(){if(document.getElementById('ktProfilePostedVideos'))schedule();},0);
})();
