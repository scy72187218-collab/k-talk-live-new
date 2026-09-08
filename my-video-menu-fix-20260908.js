/* K-Talk: 내 동영상 점 3개 메뉴 + 페이지 이동 시 동영상 소리 정지. 다른 화면은 건드리지 않음. */
(function(){
  if(window.__ktMyVideoMenuFix20260908)return;
  window.__ktMyVideoMenuFix20260908=true;

  var currentStoredVideoId='';
  var openMenuEl=null;

  function stopVideoAudio(){
    try{
      document.querySelectorAll('#ktLibraryPlayer,.kt-public-video').forEach(function(v){
        try{v.pause();v.muted=true;}catch(e){}
      });
    }catch(e){}
  }
  window.ktStopVideoAudioOnLeave=stopVideoAudio;

  function getDb(){
    try{
      if(typeof window.ktOpenVideoDB==='function')return window.ktOpenVideoDB();
      if(typeof ktOpenVideoDB==='function')return ktOpenVideoDB();
    }catch(e){}
    return Promise.reject(new Error('video db unavailable'));
  }

  async function getItem(id){
    try{
      var db=await getDb();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readonly');
        var req=tx.objectStore('videos').get(id);
        req.onsuccess=function(){var item=req.result||null;try{db.close();}catch(e){}resolve(item);};
        req.onerror=function(){try{db.close();}catch(e){}resolve(null);};
      });
    }catch(e){return null;}
  }

  async function putItem(item){
    try{
      var db=await getDb();
      await new Promise(function(resolve,reject){
        var tx=db.transaction('videos','readwrite');
        tx.objectStore('videos').put(item);
        tx.oncomplete=resolve;
        tx.onerror=function(){reject(tx.error);};
        tx.onabort=function(){reject(tx.error);};
      });
      try{db.close();}catch(e){}
      return true;
    }catch(e){return false;}
  }

  function closeMenu(){
    if(openMenuEl&&openMenuEl.parentNode)openMenuEl.parentNode.removeChild(openMenuEl);
    openMenuEl=null;
  }

  function ensureStyle(){
    if(document.getElementById('ktMyVideoMoreStyle'))return;
    var s=document.createElement('style');
    s.id='ktMyVideoMoreStyle';
    s.textContent='\n'
      +'.kt-myvideo-row{position:relative!important;}\n'
      +'.kt-myvideo-more{position:absolute;top:7px;right:7px;z-index:6;width:38px;height:38px;border:0;border-radius:50%;background:rgba(0,0,0,.58);color:#fff;font-size:28px;line-height:34px;font-weight:900;display:grid;place-items:center;padding:0;box-shadow:0 2px 10px rgba(0,0,0,.35)}\n'
      +'.kt-myvideo-player{position:relative!important;}\n'
      +'.kt-myvideo-player .kt-myvideo-more{top:10px;right:10px;}\n'
      +'.kt-myvideo-more-menu{position:fixed;z-index:10050;min-width:210px;padding:7px;border-radius:15px;background:rgba(20,20,24,.98);border:1px solid rgba(255,255,255,.18);box-shadow:0 12px 32px rgba(0,0,0,.48);overflow:hidden}\n'
      +'.kt-myvideo-more-menu button{display:block;width:100%;border:0;background:transparent;color:#fff;text-align:left;padding:13px 14px;font-size:16px;font-weight:850;border-radius:10px}\n'
      +'.kt-myvideo-more-menu button:active{background:rgba(255,255,255,.12)}\n'
      +'.kt-myvideo-more-menu button.delete{color:#ff7b86}\n';
    document.head.appendChild(s);
  }

  window.ktOpenMyVideoMore=function(id,btn,fromPlayer){
    closeMenu();
    ensureStyle();
    var menu=document.createElement('div');
    menu.className='kt-myvideo-more-menu';

    var del=document.createElement('button');
    del.className='delete';
    del.textContent='🗑 삭제';
    del.onclick=function(ev){
      ev.stopPropagation();
      closeMenu();
      if(typeof window.deleteStoredVideo==='function')window.deleteStoredVideo(id,null,!!fromPlayer);
    };

    var draft=document.createElement('button');
    draft.textContent='▣ 임시 저장';
    draft.onclick=async function(ev){
      ev.stopPropagation();
      closeMenu();
      var item=await getItem(id);
      if(!item){alert('동영상을 찾지 못했습니다.');return;}
      item.draft=true;
      item.draftAt=Date.now();
      var ok=await putItem(item);
      alert(ok?'✅ 임시 저장했습니다.':'임시 저장하지 못했습니다.');
    };

    var share=document.createElement('button');
    share.textContent='↗ 친구에게 공유하기';
    share.onclick=async function(ev){
      ev.stopPropagation();
      closeMenu();
      var item=await getItem(id);
      if(!item||!item.blob){alert('공유할 동영상을 찾지 못했습니다.');return;}
      try{
        var type=item.type||item.blob.type||'video/webm';
        var ext=type.indexOf('mp4')>-1?'mp4':(type.indexOf('quicktime')>-1?'mov':'webm');
        var file=new File([item.blob],(item.name||'K-Talk 동영상')+'.'+ext,{type:type});
        if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
          await navigator.share({files:[file],title:item.name||'K-Talk 동영상',text:'친구에게 공유하는 K-Talk 동영상입니다.'});
        }else{
          alert('이 휴대폰에서는 바로 공유가 안 됩니다. 동영상을 저장한 뒤 친구에게 보내 주세요.');
        }
      }catch(e){if(!e||e.name!=='AbortError')alert('동영상을 공유하지 못했습니다.');}
    };

    menu.appendChild(del);
    menu.appendChild(draft);
    menu.appendChild(share);
    document.body.appendChild(menu);
    openMenuEl=menu;

    var r=btn.getBoundingClientRect();
    var w=220;
    var left=Math.max(8,Math.min(window.innerWidth-w-8,r.right-w));
    var top=Math.min(window.innerHeight-190,r.bottom+5);
    menu.style.left=left+'px';
    menu.style.top=Math.max(8,top)+'px';
  };

  function addMoreButton(host,id,fromPlayer){
    if(!host||!id||host.querySelector('.kt-myvideo-more'))return;
    ensureStyle();
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-myvideo-more';
    b.setAttribute('aria-label','동영상 더보기');
    b.textContent='⋮';
    b.onclick=function(ev){ev.preventDefault();ev.stopPropagation();window.ktOpenMyVideoMore(id,b,fromPlayer);};
    host.appendChild(b);
  }

  function decorateLibrary(){
    try{
      document.querySelectorAll('.kt-myvideo-row[data-video-id]').forEach(function(row){
        addMoreButton(row,row.getAttribute('data-video-id'),false);
      });
    }catch(e){}
  }

  function decoratePlayer(){
    try{
      var p=document.querySelector('.kt-myvideo-player');
      if(p&&currentStoredVideoId)addMoreButton(p,currentStoredVideoId,true);
    }catch(e){}
  }

  var oldPlay=window.playStoredVideo;
  if(typeof oldPlay==='function'&&!oldPlay.__ktMoreWrapped){
    var wrappedPlay=function(id){
      currentStoredVideoId=id;
      var out=oldPlay.apply(this,arguments);
      setTimeout(decoratePlayer,60);
      setTimeout(decoratePlayer,220);
      return out;
    };
    wrappedPlay.__ktMoreWrapped=true;
    window.playStoredVideo=wrappedPlay;
  }

  function wrapNav(name){
    var fn=window[name];
    if(typeof fn!=='function'||fn.__ktVideoStopWrapped)return;
    var wrapped=function(){stopVideoAudio();closeMenu();return fn.apply(this,arguments);};
    wrapped.__ktVideoStopWrapped=true;
    window[name]=wrapped;
  }

  ['home','media','friends','openCreator'].forEach(wrapNav);

  document.addEventListener('click',function(ev){
    try{
      if(ev.target.closest('.kt-myvideo-more,.kt-myvideo-more-menu'))return;
      closeMenu();
      var player=document.getElementById('ktLibraryPlayer');
      if(player&&!ev.target.closest('#sheet'))stopVideoAudio();
      if(document.querySelector('.kt-public-video')&&!ev.target.closest('#screen')&&!ev.target.closest('#sheet'))stopVideoAudio();
    }catch(e){}
  },true);

  try{
    new MutationObserver(function(){decorateLibrary();decoratePlayer();}).observe(document.body,{childList:true,subtree:true});
  }catch(e){}
  setTimeout(decorateLibrary,0);
  setTimeout(decoratePlayer,0);
})();
