/* K-Talk 프로필 동기화 전용: 같은 계정의 닉네임/사진을 여러 기기에서 동일하게 표시. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktProfileDeviceSyncInstalled)return;
  window.__ktProfileDeviceSyncInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var busy={};
  var lastRemoteStamp={};

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('profile sync '+r.status);
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function cleanKey(v){return String(v==null?'':v).trim().slice(0,120);}
  function currentKey(){
    try{if(typeof window.ktProfileAccountKey==='function')return cleanKey(window.ktProfileAccountKey());}catch(e){}
    try{
      var sub=window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'';
      if(sub)return 'sub:'+sub;
    }catch(e){}
    return 'default';
  }
  function storageKey(key){return 'ktalk_profile_v1:'+cleanKey(key);}
  function defaultName(key,name){
    key=cleanKey(key);name=String(name||'').trim();
    if(key==='sub:taekwon1'&&(!name||name==='K-톡 태권1'||name==='태권1'))return '태권이';
    if(key==='sub:haine2'&&(!name||name==='K-톡 하이네2'||name==='하이네2'))return '하이네';
    return name;
  }
  function readLocal(key){
    var p={name:'',bio:'',photo:'',followers:0,likes:0,link:''};
    try{
      var raw=localStorage.getItem(storageKey(key));
      if(raw){
        var x=JSON.parse(raw)||{};
        p.name=String(x.name||'');p.bio=String(x.bio||'');p.photo=String(x.photo||'');
        p.followers=parseInt(x.followers||0,10)||0;p.likes=parseInt(x.likes||0,10)||0;p.link=String(x.link||'');
      }
    }catch(e){}
    p.name=defaultName(key,p.name);
    return p;
  }
  function writeLocal(key,p){
    if(!key||!p)return;
    var old=readLocal(key);
    var next={
      name:defaultName(key,p.nickname!=null?p.nickname:(p.name!=null?p.name:old.name)),
      bio:String(p.bio!=null?p.bio:old.bio||''),
      photo:String(p.photo!=null?p.photo:old.photo||''),
      followers:old.followers||0,
      likes:old.likes||0,
      link:String(p.link!=null?p.link:old.link||'')
    };
    try{localStorage.setItem(storageKey(key),JSON.stringify(next));}catch(e){}
    return next;
  }
  function visibleRefresh(key,p){
    try{
      if(cleanKey(key)!==currentKey())return;
      var name=p.name||p.nickname||'';
      document.querySelectorAll('.kt-profile-maininfo>b').forEach(function(el){el.textContent=name;});
      var input=document.getElementById('ktProfileName');
      if(input&&document.activeElement!==input)input.value=name;
      var wrap=document.querySelector('.kt-my-profile-photo');
      if(wrap&&p.photo){
        var img=wrap.querySelector('img');
        if(!img){img=document.createElement('img');img.alt='프로필 사진';wrap.insertBefore(img,wrap.firstChild);}
        img.src=p.photo;
      }
    }catch(e){}
  }
  async function fetchRemote(key){
    key=cleanKey(key);if(!key)return null;
    var rows=await req('ktalk_profiles?account_key=eq.'+enc(key)+'&select=account_key,nickname,photo,bio,link,updated_at&limit=1');
    return Array.isArray(rows)&&rows[0]?rows[0]:null;
  }
  async function pushRemote(key,p){
    key=cleanKey(key);if(!key)return;
    p=p||readLocal(key);
    var body={account_key:key,nickname:defaultName(key,p.name||p.nickname||''),photo:String(p.photo||''),bio:String(p.bio||''),link:String(p.link||''),updated_at:new Date().toISOString()};
    var out=await req('ktalk_profiles?on_conflict=account_key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=representation'},body:JSON.stringify(body)});
    var row=Array.isArray(out)&&out[0]?out[0]:body;
    lastRemoteStamp[key]=String(row.updated_at||body.updated_at||'');
  }
  async function syncKey(key,refresh){
    key=cleanKey(key);if(!key||busy[key])return;
    busy[key]=true;
    try{
      var remote=await fetchRemote(key);
      var local=readLocal(key);
      if(remote){
        var stamp=String(remote.updated_at||'');
        if(stamp!==lastRemoteStamp[key]){
          var merged=writeLocal(key,remote)||local;
          lastRemoteStamp[key]=stamp;
          if(refresh!==false)visibleRefresh(key,merged);
        }
      }else{
        if(!local.name)local.name=defaultName(key,'');
        await pushRemote(key,local);
        writeLocal(key,local);
        if(refresh!==false)visibleRefresh(key,local);
      }
    }catch(e){}
    busy[key]=false;
  }
  async function pushCurrent(){
    var key=currentKey();
    try{
      var p=typeof window.ktProfileLoad==='function'?window.ktProfileLoad():readLocal(key);
      p=p||readLocal(key);
      p.name=defaultName(key,p.name||'');
      writeLocal(key,p);
      await pushRemote(key,p);
    }catch(e){}
  }

  window.ktSyncProfileNow=function(){return syncKey(currentKey(),true);};
  window.ktSyncProfileAccount=function(key){return syncKey(key,true);};

  function wrapFunctions(){
    if(typeof window.ktProfileSave==='function'&&!window.ktProfileSave.__ktSynced){
      var oldSave=window.ktProfileSave;
      var save=function(){
        var r=oldSave.apply(this,arguments);
        setTimeout(pushCurrent,100);
        return r;
      };
      save.__ktSynced=true;window.ktProfileSave=save;
    }
    if(typeof window.selectKTalkSubAccount==='function'&&!window.selectKTalkSubAccount.__ktSynced){
      var oldSelect=window.selectKTalkSubAccount;
      var select=function(key){
        var r=oldSelect.apply(this,arguments);
        setTimeout(function(){syncKey('sub:'+key,true);},80);
        return r;
      };
      select.__ktSynced=true;window.selectKTalkSubAccount=select;
    }
    if(typeof window.openProfileDirect==='function'&&!window.openProfileDirect.__ktSynced){
      var oldOpen=window.openProfileDirect;
      var open=function(){
        var r=oldOpen.apply(this,arguments);
        setTimeout(function(){syncKey(currentKey(),true);},60);
        return r;
      };
      open.__ktSynced=true;window.openProfileDirect=open;
    }
    if(typeof window.openAccountChooser==='function'&&!window.openAccountChooser.__ktSynced){
      var oldChooser=window.openAccountChooser;
      var chooser=function(){
        var r=oldChooser.apply(this,arguments);
        setTimeout(function(){syncKey('sub:taekwon1',false);syncKey('sub:haine2',false);},80);
        return r;
      };
      chooser.__ktSynced=true;window.openAccountChooser=chooser;
    }
  }

  document.addEventListener('change',function(e){
    var t=e.target;
    if(t&&t.id==='ktProfilePhotoInput')setTimeout(pushCurrent,1200);
  },true);

  var tries=0;
  var ready=setInterval(function(){
    tries++;wrapFunctions();
    if(typeof window.ktProfileLoad==='function'&&typeof window.ktProfileSave==='function'){
      clearInterval(ready);
      syncKey('sub:taekwon1',false);
      syncKey('sub:haine2',false);
      syncKey(currentKey(),true);
    }else if(tries>50)clearInterval(ready);
  },120);

  setInterval(function(){syncKey(currentKey(),true);},6000);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')syncKey(currentKey(),true);});
})();
