/* K-Talk: 동영상 게시 시 휴대폰에도 자동 저장 시도. 게시/방송의 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktGallerySaveOnPost20260915)return;
  window.__ktGallerySaveOnPost20260915=true;

  var seen=(typeof WeakSet!=='undefined')?new WeakSet():null;
  var savedIds={};

  function enabled(){
    try{
      var v=localStorage.getItem('ktalk_save_to_gallery_on_post');
      if(v===null){localStorage.setItem('ktalk_save_to_gallery_on_post','1');return true;}
      return v!=='0';
    }catch(e){return true;}
  }

  window.ktSetSaveToGalleryOnPost=function(on){
    try{localStorage.setItem('ktalk_save_to_gallery_on_post',on===false?'0':'1');}catch(e){}
    return on!==false;
  };
  window.ktSaveToGalleryOnPostEnabled=enabled;

  function extension(blob,name){
    var n=String(name||'').toLowerCase();
    if(/\.mp4(?:$|\?)/.test(n))return 'mp4';
    if(/\.mov(?:$|\?)/.test(n))return 'mov';
    if(/\.m4v(?:$|\?)/.test(n))return 'm4v';
    if(/\.webm(?:$|\?)/.test(n))return 'webm';
    var t=String(blob&&blob.type||'').toLowerCase();
    if(t.indexOf('mp4')>-1)return 'mp4';
    if(t.indexOf('quicktime')>-1)return 'mov';
    if(t.indexOf('m4v')>-1)return 'm4v';
    return 'webm';
  }

  function fileName(blob,name){
    var base=String(name||'K-Talk 동영상')
      .replace(/[\\/:*?"<>|]+/g,' ')
      .replace(/\.(mp4|mov|m4v|webm)$/i,'')
      .replace(/\s+/g,' ')
      .trim()
      .slice(0,70)||'K-Talk 동영상';
    var d=new Date();
    var stamp=d.getFullYear()+String(d.getMonth()+1).padStart(2,'0')+String(d.getDate()).padStart(2,'0')+'-'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+String(d.getSeconds()).padStart(2,'0');
    return base+'-'+stamp+'.'+extension(blob,name);
  }

  function toast(text){
    try{
      var old=document.getElementById('ktGallerySaveToast');
      if(old)old.remove();
      var el=document.createElement('div');
      el.id='ktGallerySaveToast';
      el.textContent=text;
      el.style.cssText='position:fixed;left:50%;bottom:96px;transform:translateX(-50%);z-index:2147483646;max-width:88vw;padding:11px 16px;border-radius:999px;background:rgba(8,8,14,.94);border:1px solid rgba(255,255,255,.25);color:#fff;font:900 13px system-ui,-apple-system,Noto Sans KR,sans-serif;box-shadow:0 8px 26px rgba(0,0,0,.45);white-space:nowrap';
      document.body.appendChild(el);
      setTimeout(function(){try{el.remove();}catch(e){}},2200);
    }catch(e){}
  }

  function downloadBlob(blob,name,key){
    if(!enabled()||!blob)return false;
    try{
      if(key&&savedIds[key])return false;
      if(seen&&seen.has(blob))return false;
      if(key)savedIds[key]=1;
      if(seen)seen.add(blob);

      var url=URL.createObjectURL(blob);
      var a=document.createElement('a');
      a.href=url;
      a.download=fileName(blob,name);
      a.rel='noopener';
      a.style.display='none';
      document.body.appendChild(a);
      a.click();
      setTimeout(function(){
        try{a.remove();}catch(e){}
        try{URL.revokeObjectURL(url);}catch(e){}
      },3000);
      toast('📱 게시 동영상을 휴대폰에 저장했습니다');
      return true;
    }catch(e){return false;}
  }

  window.ktSaveVideoBlobToGallery=function(blob,name){return downloadBlob(blob,name,'');};

  function currentBlob(){
    try{if(window.ktCreatorBlob)return window.ktCreatorBlob;}catch(e){}
    try{if(typeof ktCreatorBlob!=='undefined'&&ktCreatorBlob)return ktCreatorBlob;}catch(e){}
    return null;
  }
  function currentName(){
    try{if(window.ktImportedVideoName)return window.ktImportedVideoName;}catch(e){}
    try{if(typeof ktImportedVideoName!=='undefined'&&ktImportedVideoName)return ktImportedVideoName;}catch(e){}
    return 'K-Talk 동영상';
  }

  var oldPost=window.postCreatorRecording;
  if(typeof oldPost==='function'&&!oldPost.__ktGallerySave20260915){
    var postWrap=async function(){
      var blob=currentBlob();
      var name=currentName();
      if(blob)downloadBlob(blob,name,'creator-'+Date.now());
      return await oldPost.apply(this,arguments);
    };
    postWrap.__ktGallerySave20260915=true;
    window.postCreatorRecording=postWrap;
  }

  async function storedItem(id){
    try{
      if(typeof window.ktOpenVideoDB!=='function')return null;
      var db=await window.ktOpenVideoDB();
      return await new Promise(function(resolve){
        try{
          var tx=db.transaction('videos','readonly');
          var rq=tx.objectStore('videos').get(id);
          rq.onsuccess=function(){var x=rq.result||null;try{db.close();}catch(e){}resolve(x);};
          rq.onerror=function(){try{db.close();}catch(e){}resolve(null);};
        }catch(e){try{db.close();}catch(x){}resolve(null);}
      });
    }catch(e){return null;}
  }

  var oldStored=window.postStoredVideo;
  if(typeof oldStored==='function'&&!oldStored.__ktGallerySave20260915){
    var storedWrap=async function(id){
      try{
        var item=await storedItem(id);
        if(item&&item.blob)downloadBlob(item.blob,item.name||'K-Talk 동영상','stored-'+String(id));
      }catch(e){}
      return await oldStored.apply(this,arguments);
    };
    storedWrap.__ktGallerySave20260915=true;
    window.postStoredVideo=storedWrap;
  }
})();
