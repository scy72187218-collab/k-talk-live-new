/* K-Talk: 내 동영상 즉시 저장 + 점 세 개 메뉴. 다른 화면은 건드리지 않음. */
(function(){
  if(window.__ktMyVideoMenuFixLoaded)return;
  window.__ktMyVideoMenuFixLoaded=true;

  function openVideoDb(){
    if(typeof window.ktOpenVideoDB==='function')return window.ktOpenVideoDB();
    if(typeof ktOpenVideoDB==='function')return ktOpenVideoDB();
    return Promise.reject(new Error('video db unavailable'));
  }

  function esc(text){
    return String(text==null?'':text)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;');
  }

  function txDone(tx){
    return new Promise(function(resolve,reject){
      tx.oncomplete=resolve;
      tx.onerror=function(){reject(tx.error||new Error('db error'));};
      tx.onabort=function(){reject(tx.error||new Error('db abort'));};
    });
  }

  function closeMoreMenu(){
    var old=document.getElementById('ktVideoMoreMenu');
    if(old)old.remove();
  }
  window.ktCloseVideoMoreMenu=closeMoreMenu;

  window.handleMyVideoPick=async function(input){
    var file=input&&input.files&&input.files[0];
    if(!file)return;
    if(!String(file.type||'').startsWith('video/')){
      alert('동영상 파일을 선택해 주세요.');
      input.value='';
      return;
    }
    try{
      var db=await openVideoDb();
      var tx=db.transaction('videos','readwrite');
      tx.objectStore('videos').put({
        id:'video-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
        name:file.name||('내 동영상 '+new Date().toLocaleString('ko-KR')),
        type:file.type||'video/mp4',
        blob:file,
        createdAt:Date.now(),
        draft:false,
        posted:false
      });
      await txDone(tx);
      try{db.close();}catch(e){}
      try{if(window.closeCreator)window.closeCreator();}catch(e){}
      if(window.openMyVideoLibrary)window.openMyVideoLibrary();
    }catch(e){
      alert('이 기기에서는 동영상을 보관하지 못했습니다.');
    }finally{
      try{input.value='';}catch(e){}
    }
  };

  window.openMyVideoLibrary=async function(){
    closeMoreMenu();
    try{
      var db=await openVideoDb();
      var tx=db.transaction('videos','readonly');
      var req=tx.objectStore('videos').getAll();
      req.onsuccess=function(){
        var items=(req.result||[]).sort(function(a,b){return b.createdAt-a.createdAt;});
        var html='<div class="kt-myvideo-head"><b>🎬 내 동영상</b><button onclick="closeSheet();openCreator();setTimeout(openMyVideoPicker,120)">＋ 휴대폰 동영상 올리기</button></div>';
        if(!items.length){
          html+='<div class="rowbox"><b>아직 올린 동영상이 없습니다.</b><br>휴대폰에 찍어 놓은 동영상을 선택해서 올릴 수 있습니다.</div>';
        }else{
          html+='<div class="kt-myvideo-list">'+items.map(function(v){
            var d=new Date(v.createdAt);
            var status=v.posted?' · 게시됨':(v.draft?' · 임시 저장':'');
            var id=String(v.id||'');
            return '<div class="kt-myvideo-row" data-video-id="'+esc(id)+'">'
              +'<button type="button" class="play" data-play-video="'+esc(id)+'" onclick="playStoredVideo(\''+id+'\')"><span>▶</span><b>'+esc(v.name||'내 동영상')+'</b><small>'+d.toLocaleDateString('ko-KR')+status+'</small></button>'
              +'<button type="button" class="kt-video-more" aria-label="동영상 메뉴" onclick="event.preventDefault();event.stopPropagation();ktOpenVideoMoreMenu(\''+id+'\',this);return false;">⋮</button>'
              +'</div>';
          }).join('')+'</div>';
        }
        showSheet('내 동영상',html);
        try{db.close();}catch(e){}
      };
      req.onerror=function(){try{db.close();}catch(e){} alert('내 동영상을 불러오지 못했습니다.');};
    }catch(e){
      showSheet('내 동영상','<div class="rowbox"><b>휴대폰 동영상 선택</b><br>이 브라우저에서는 목록 저장이 제한될 수 있습니다.</div><button class="act" onclick="closeSheet();openCreator();setTimeout(openMyVideoPicker,120)">휴대폰 동영상 선택</button>');
    }
  };

  window.ktSetStoredVideoDraft=async function(id){
    closeMoreMenu();
    try{
      var db=await openVideoDb();
      var tx=db.transaction('videos','readwrite');
      var store=tx.objectStore('videos');
      var req=store.get(id);
      req.onsuccess=function(){
        var item=req.result;
        if(!item)return;
        item.draft=true;
        item.posted=false;
        try{delete item.postedAt;}catch(e){}
        store.put(item);
      };
      await txDone(tx);
      try{db.close();}catch(e){}
      if(window.openMyVideoLibrary)window.openMyVideoLibrary();
    }catch(e){alert('임시 저장하지 못했습니다.');}
  };

  window.ktPostStoredVideoFromMenu=async function(id){
    closeMoreMenu();
    try{
      var db=await openVideoDb();
      var tx=db.transaction('videos','readwrite');
      var store=tx.objectStore('videos');
      var req=store.get(id);
      req.onsuccess=function(){
        var item=req.result;
        if(!item)return;
        item.posted=true;
        item.draft=false;
        item.postedAt=Date.now();
        store.put(item);
      };
      await txDone(tx);
      try{db.close();}catch(e){}
      try{if(window.ktSpeak)window.ktSpeak('동영상을 올렸습니다.');}catch(e){}
      if(window.openMyVideoLibrary)window.openMyVideoLibrary();
    }catch(e){alert('동영상을 올리지 못했습니다.');}
  };

  window.ktDeleteStoredVideoFromMenu=function(id){
    closeMoreMenu();
    if(window.deleteStoredVideo)window.deleteStoredVideo(id,null,false);
  };

  window.ktOpenVideoMoreMenu=function(id,btn){
    closeMoreMenu();
    var menu=document.createElement('div');
    menu.id='ktVideoMoreMenu';
    menu.className='kt-video-more-menu';
    menu.innerHTML='<button type="button" class="danger">삭제하기</button>'
      +'<button type="button">임시 저장</button>'
      +'<button type="button" class="upload">동영상 올리기</button>';
    document.body.appendChild(menu);
    var r=btn.getBoundingClientRect();
    var top=Math.min(window.innerHeight-190,Math.max(12,r.bottom+6));
    var right=Math.max(10,window.innerWidth-r.right);
    menu.style.top=top+'px';
    menu.style.right=right+'px';
    var buttons=menu.querySelectorAll('button');
    buttons[0].onclick=function(e){e.stopPropagation();ktDeleteStoredVideoFromMenu(id);};
    buttons[1].onclick=function(e){e.stopPropagation();ktSetStoredVideoDraft(id);};
    buttons[2].onclick=function(e){e.stopPropagation();ktPostStoredVideoFromMenu(id);};
  };

  document.addEventListener('click',function(e){
    var menu=document.getElementById('ktVideoMoreMenu');
    if(!menu)return;
    if(menu.contains(e.target))return;
    if(e.target&&e.target.closest&&e.target.closest('.kt-video-more'))return;
    closeMoreMenu();
  },true);

  var style=document.createElement('style');
  style.id='ktMyVideoMenuFixStyle';
  style.textContent=''
    +'.kt-myvideo-row{position:relative!important}'
    +'.kt-myvideo-row .play{padding-right:54px!important}'
    +'.kt-video-more{position:absolute!important;top:7px!important;right:7px!important;z-index:5!important;width:42px!important;height:42px!important;border:0!important;border-radius:50%!important;background:rgba(10,10,14,.76)!important;color:#fff!important;font-size:30px!important;line-height:1!important;font-weight:900!important;display:grid!important;place-items:center!important;touch-action:manipulation!important}'
    +'.kt-video-more-menu{position:fixed!important;z-index:2147483647!important;width:180px!important;padding:8px!important;border-radius:16px!important;background:#17171d!important;border:1px solid rgba(255,255,255,.16)!important;box-shadow:0 12px 35px rgba(0,0,0,.55)!important}'
    +'.kt-video-more-menu button{display:block!important;width:100%!important;min-height:46px!important;padding:0 14px!important;border:0!important;border-radius:11px!important;background:transparent!important;color:#fff!important;text-align:left!important;font-size:15px!important;font-weight:850!important;touch-action:manipulation!important}'
    +'.kt-video-more-menu button+button{border-top:1px solid rgba(255,255,255,.08)!important}'
    +'.kt-video-more-menu .danger{color:#ff7373!important}'
    +'.kt-video-more-menu .upload{color:#79d8ff!important}';
  document.head.appendChild(style);
})();
