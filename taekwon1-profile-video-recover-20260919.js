/* K-Talk 태권1 내 프로필 동영상 복구 전용 (2026-09-19)
   - 태권1 프로필의 '내 동영상' 목록만 복구
   - 휴대폰 IndexedDB + 마지막 정상 피드 캐시 + 서버 공개목록을 합쳐 표시
   - 방송방/채팅/스위치/레이아웃/잠금은 변경하지 않음 */
(function(){
  if(window.__ktTaekwon1ProfileVideoRecover20260919)return;
  window.__ktTaekwon1ProfileVideoRecover20260919=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function isTaekwon1(){
    try{return typeof window.ktGetSelectedSubAccount==='function'&&window.ktGetSelectedSubAccount()==='taekwon1';}
    catch(e){return false;}
  }
  function legacyMine(x){
    if(!x||!x.video_url)return false;
    var id=String(x.author_id||'').toLowerCase();
    var name=String(x.author_name||'').replace(/\s+/g,'').toLowerCase();
    return id==='taekwon1'||id==='sub:taekwon1'||id==='guest'||
           name==='태권1'||name==='태권이'||name==='k-talk'||name==='k-talklive';
  }

  async function localRows(){
    if(typeof window.ktOpenVideoDB!=='function')return [];
    try{
      var db=await window.ktOpenVideoDB();
      return await new Promise(function(resolve){
        try{
          var tx=db.transaction('videos','readonly');
          var req=tx.objectStore('videos').getAll();
          req.onsuccess=function(){
            var a=(req.result||[]).sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);});
            try{db.close();}catch(e){}
            resolve(a);
          };
          req.onerror=function(){try{db.close();}catch(e){}resolve([]);};
        }catch(e){try{db.close();}catch(x){}resolve([]);}
      });
    }catch(e){return [];}
  }

  function cachedRows(){
    try{
      var a=JSON.parse(localStorage.getItem('ktalk_fast_feed')||'[]');
      if(!Array.isArray(a))return [];
      return a.filter(function(x){
        if(!x||!x.video_url)return false;
        var n=String(x.author_name||'').replace(/\s+/g,'').toLowerCase();
        return !x.author_id||legacyMine(x)||n==='k-talk'||n==='태권1'||n==='태권이';
      });
    }catch(e){return [];}
  }

  async function serverRows(){
    try{
      var ctl=('AbortController' in window)?new AbortController():null;
      var timer=ctl?setTimeout(function(){try{ctl.abort();}catch(e){}},3500):0;
      var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit=60',{
        cache:'no-store',
        signal:ctl?ctl.signal:void 0,
        headers:{apikey:KEY,Authorization:'Bearer '+KEY}
      });
      if(timer)clearTimeout(timer);
      if(!r.ok)return [];
      var a=await r.json();
      a=Array.isArray(a)?a.filter(legacyMine):[];
      if(a.length){
        try{localStorage.setItem('ktalk_fast_feed',JSON.stringify(a));}catch(e){}
      }
      return a;
    }catch(e){return [];}
  }

  function uniqueRemote(list,local){
    var seen={};
    (local||[]).forEach(function(v){
      var u=String(v&&v.publicVideoUrl||'');
      if(u)seen[u]=1;
    });
    var out=[];
    (list||[]).forEach(function(v){
      var u=String(v&&v.video_url||'');
      var k=u||String(v&&v.id||'');
      if(!k||seen[k])return;
      seen[k]=1;out.push(v);
    });
    return out;
  }

  function remoteCard(v,i){
    var title=esc(v.title||('게시 동영상 '+(i+1)));
    var url=esc(v.video_url||'');
    var d='';
    try{d=new Date(v.created_at||Date.now()).toLocaleDateString('ko-KR');}catch(e){}
    return '<div class="kt-myvideo-row kt-recovered-server-video" style="display:grid;grid-template-columns:116px minmax(0,1fr);gap:10px;align-items:center;padding:10px;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:#111118">'
      +'<button type="button" onclick="ktPlayRecoveredProfileVideo(\''+String(v.id||'').replace(/'/g,"\\'")+'\')" style="width:116px;height:132px;padding:0;border:0;border-radius:12px;overflow:hidden;background:#050508;position:relative">'
        +'<video muted playsinline preload="metadata" src="'+url+'" style="width:100%;height:100%;object-fit:cover;pointer-events:none;background:#000"></video>'
        +'<span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:42px;height:42px;border-radius:50%;display:grid;place-items:center;background:#0009;color:#fff;font-size:22px">▶</span>'
      +'</button>'
      +'<div style="min-width:0"><b style="display:block;color:#fff;font-size:14px;word-break:break-word">'+title+'</b>'
        +'<small style="display:block;margin-top:6px;color:#aaa">'+esc(d)+' · 게시됨</small>'
        +'<button type="button" onclick="ktPlayRecoveredProfileVideo(\''+String(v.id||'').replace(/'/g,"\\'")+'\')" style="width:100%;height:40px;margin-top:10px;border:0;border-radius:10px;background:#24242d;color:#fff;font-weight:900">재생</button>'
      +'</div>'
    +'</div>';
  }

  var recoveredMap={};
  window.ktPlayRecoveredProfileVideo=function(id){
    var v=recoveredMap[String(id||'')];
    if(!v||!v.video_url)return;
    var title=esc(v.title||'내 동영상');
    var url=esc(v.video_url);
    if(typeof window.showSheet!=='function')return;
    window.showSheet('동영상 재생','<div style="padding:0 0 8px">'
      +'<video controls autoplay playsinline preload="auto" src="'+url+'" style="display:block;width:100%;height:calc(100dvh - 330px);min-height:420px;max-height:720px;object-fit:cover;background:#000;border-radius:16px"></video>'
      +'<b style="display:block;padding:11px 2px 8px;color:#fff">'+title+'</b>'
      +'<button type="button" onclick="openMyVideoLibrary()" style="width:100%;height:42px;border:0;border-radius:11px;background:#24242d;color:#fff;font-weight:900">← 내 동영상</button>'
    +'</div>');
  };

  function localCard(v,i){
    var id=String(v.id||'').replace(/'/g,"\\'");
    var label='동영상 '+(i+1);
    var d='';
    try{d=new Date(v.createdAt||Date.now()).toLocaleDateString('ko-KR');}catch(e){}
    return '<div class="kt-myvideo-row" style="padding:10px;border:1px solid rgba(255,255,255,.12);border-radius:14px;background:#111118">'
      +'<button type="button" onclick="playStoredVideo(\''+id+'\')" style="width:100%;height:44px;border:0;border-radius:10px;background:#24242d;color:#fff;font-weight:900">▶ '+esc(label)+'</button>'
      +'<small style="display:block;margin-top:7px;color:#aaa">'+esc(d)+(v.posted?' · 게시됨':'')+'</small>'
    +'</div>';
  }

  function render(local,remote){
    if(typeof window.showSheet!=='function')return;
    recoveredMap={};
    remote.forEach(function(v){recoveredMap[String(v.id||'')]=v;});

    var html='<div style="display:grid;gap:10px">';
    if(local.length){
      html+='<div style="font-weight:950;color:#fff">휴대폰에 저장된 동영상</div>'
        +local.map(localCard).join('');
    }
    if(remote.length){
      html+='<div style="font-weight:950;color:#ffd85a;margin-top:'+(local.length?'6':'0')+'px">태권1 게시 동영상 '+remote.length+'개</div>'
        +remote.map(remoteCard).join('');
    }
    if(!local.length&&!remote.length){
      html+='<div class="rowbox"><b>아직 표시할 동영상이 없습니다.</b><br>서버 연결이 되면 태권1 게시 동영상을 자동으로 다시 불러옵니다.</div>';
    }
    html+='</div>';
    window.showSheet('🎬 태권1 내 동영상',html);
  }

  async function openRecovered(){
    if(!isTaekwon1())return false;

    var local=await localRows();
    var cached=uniqueRemote(cachedRows(),local);
    render(local,cached);

    var fresh=await serverRows();
    if(fresh.length){
      var merged=uniqueRemote(fresh,local);
      render(local,merged);
    }
    return true;
  }

  var oldOpen=window.openMyVideoLibrary;
  window.openMyVideoLibrary=async function(){
    if(isTaekwon1()){
      return openRecovered();
    }
    if(typeof oldOpen==='function')return oldOpen.apply(this,arguments);
  };
})();