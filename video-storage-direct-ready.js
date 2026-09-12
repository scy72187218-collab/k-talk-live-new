/* K-Talk 동영상 별도 저장소 직결 준비 파일.
   현재 화면/방송/프로필에는 자동 연결하지 않음.
   배포 제한이 풀린 뒤 필요한 위치에서 명시적으로 호출할 때만 사용. */
(function(){
  if(window.ktVideoStorageDirect)return;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var MAX=100*1024*1024;

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }

  function currentUser(){
    var name='K-Talk',id='guest';
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad();
        if(p&&p.name)name=p.name;
      }
    }catch(e){}
    try{name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;}catch(e){}
    try{id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    return {name:String(name||'K-Talk').slice(0,80),id:String(id||'guest').slice(0,80)};
  }

  function mime(file){
    var t=String(file&&file.type||'').toLowerCase();
    var n=String(file&&file.name||'').toLowerCase();
    if(t==='video/mp4'||t==='video/quicktime'||t==='video/x-m4v'||t==='video/webm')return t;
    if(/\.mov$/.test(n))return 'video/quicktime';
    if(/\.m4v$/.test(n))return 'video/x-m4v';
    if(/\.webm$/.test(n))return 'video/webm';
    return 'video/mp4';
  }

  function ext(t){
    if(t==='video/quicktime')return 'mov';
    if(t==='video/x-m4v')return 'm4v';
    if(t==='video/webm')return 'webm';
    return 'mp4';
  }

  async function uploadFile(file,meta){
    if(!file)throw new Error('동영상 파일이 없습니다.');
    if(Number(file.size||0)>MAX)throw new Error('100MB보다 큰 동영상은 올릴 수 없습니다.');

    meta=meta||{};
    var user=currentUser();
    var type=mime(file);
    var clean=String(user.id||'guest').replace(/[^a-zA-Z0-9_-]/g,'_')||'guest';
    var path=clean+'/'+Date.now()+'-'+Math.random().toString(36).slice(2,8)+'.'+ext(type);

    var up=await fetch(SB+'/storage/v1/object/ktalk-videos/'+path,{
      method:'POST',
      headers:headers({'Content-Type':type,'x-upsert':'false'}),
      body:file
    });
    if(!up.ok)throw new Error('동영상 저장 실패 '+up.status);

    var url=SB+'/storage/v1/object/public/ktalk-videos/'+path;
    var row={
      author_id:String(meta.authorId||user.id||'guest').slice(0,80),
      author_name:String(meta.authorName||user.name||'K-Talk').slice(0,80),
      title:String(meta.title||file.name||'K-Talk 동영상').slice(0,200),
      video_path:path,
      video_url:url
    };

    var ins=await fetch(SB+'/rest/v1/ktalk_videos',{
      method:'POST',
      headers:headers({'Content-Type':'application/json','Prefer':'return=representation'}),
      body:JSON.stringify(row)
    });
    if(!ins.ok)throw new Error('동영상 목록 등록 실패 '+ins.status);

    var rows=await ins.json();
    try{localStorage.removeItem('ktalk_fast_feed');}catch(e){}
    return rows&&rows[0]?rows[0]:row;
  }

  async function listLatest(limit){
    limit=Math.max(1,Math.min(100,Number(limit||40)));
    var r=await fetch(SB+'/rest/v1/ktalk_videos?select=id,author_id,author_name,title,video_url,created_at,likes&order=created_at.desc&limit='+limit,{headers:headers()});
    if(!r.ok)throw new Error('동영상 목록 불러오기 실패 '+r.status);
    return await r.json();
  }

  window.ktVideoStorageDirect={
    uploadFile:uploadFile,
    listLatest:listLatest,
    maxUploadBytes:MAX
  };
})();
