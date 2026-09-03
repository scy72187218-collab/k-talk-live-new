/* K-Talk: posted video -> profile + local video feed only. Do not modify unrelated UI. */
(function(){
  var feedUrl='';
  function closeFeedUrl(){
    if(feedUrl){try{URL.revokeObjectURL(feedUrl);}catch(e){} feedUrl='';}
  }

  async function markNewestCreatorVideoPosted(){
    try{
      var db=await ktOpenVideoDB();
      var tx=db.transaction('videos','readwrite');
      var store=tx.objectStore('videos');
      var req=store.getAll();
      await new Promise(function(resolve){
        req.onsuccess=function(){
          var items=(req.result||[]).filter(function(v){return v&&!v.draft;}).sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);});
          var item=items[0];
          if(item){
            item.posted=true;
            item.postedAt=item.postedAt||Date.now();
            store.put(item);
          }
          resolve();
        };
        req.onerror=function(){resolve();};
      });
      await new Promise(function(resolve){tx.oncomplete=resolve;tx.onerror=resolve;tx.onabort=resolve;});
      try{db.close();}catch(e){}
      try{if(window.ktRenderProfilePostedVideos)window.ktRenderProfilePostedVideos();}catch(e){}
    }catch(e){}
  }

  var oldPost=window.postCreatorRecording;
  if(oldPost&&!oldPost.__ktAutoPosted){
    var wrapped=async function(){
      await oldPost.apply(this,arguments);
      await markNewestCreatorVideoPosted();
    };
    wrapped.__ktAutoPosted=true;
    window.postCreatorRecording=wrapped;
  }

  async function newestPostedVideo(){
    try{
      var db=await ktOpenVideoDB();
      var tx=db.transaction('videos','readonly');
      var req=tx.objectStore('videos').getAll();
      var items=await new Promise(function(resolve){req.onsuccess=function(){resolve(req.result||[]);};req.onerror=function(){resolve([]);};});
      try{db.close();}catch(e){}
      return items.filter(function(v){return !!v.posted&&v.blob;}).sort(function(a,b){return (b.postedAt||b.createdAt||0)-(a.postedAt||a.createdAt||0);})[0]||null;
    }catch(e){return null;}
  }

  function renderPostedVideo(item,label){
    closeFeedUrl();
    feedUrl=URL.createObjectURL(item.blob);
    document.body.classList.remove('kt-home');
    document.body.classList.add('kt-video-mode');
    var safeName=String(item.name||'내 동영상').replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});
    screen.innerHTML='<section class="video-home">'
      +'<video id="homeVideo" autoplay loop playsinline src="'+feedUrl+'"></video>'
      +'<div class="vh-shade"></div>'
      +'<div class="vh-tabs"><span>LIVE</span><span>커뮤니티</span><span>팔로잉</span><span class="on">추천</span><button aria-label="검색">⌕</button></div>'
      +'<div class="vh-title"><b>♛ K-Talk</b><span>'+safeName+'</span></div>'
      +'<div class="vh-actions">'
        +'<button onclick="needJoin(\'좋아요를 누르려면 가입해 주세요.\')">♡<small>좋아요</small></button>'
        +'<button onclick="openComments()">💬<small>댓글</small></button>'
        +'<button onclick="openGifts()">🎁<small>선물</small></button>'
        +'<button onclick="shareApp()">↗<small>공유</small></button>'
      +'</div>'
      +'</section>';
    var v=document.getElementById('homeVideo');
    if(v){
      v.addEventListener('click',function(){if(v.paused)v.play().catch(function(){});else v.pause();});
      v.play().catch(function(){});
    }
  }

  var fallbackHome=window.home;
  var fallbackMedia=window.media;
  window.ktShowNewestPostedFeed=async function(label,fallback){
    var item=await newestPostedVideo();
    if(item){renderPostedVideo(item,label);return;}
    closeFeedUrl();
    if(fallback)fallback();
  };
  window.home=function(){
    try{if(window.activate)activate('home');}catch(e){}
    ktShowNewestPostedFeed('추천 동영상',fallbackHome);
  };
  window.media=function(type){
    try{if(window.activate)activate(type);}catch(e){}
    ktShowNewestPostedFeed(type==='shorts'?'쇼츠':'동영상',function(){if(fallbackMedia)fallbackMedia(type);});
  };
})();
