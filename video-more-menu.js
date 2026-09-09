/* K-Talk 내 동영상 점 세 개 메뉴: 삭제 / 임시 저장 / 친구에게 공유. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktVideoMoreMenuInstalled)return;
  window.__ktVideoMoreMenuInstalled=true;

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function closeMenu(){var m=document.getElementById('ktVideoMorePopover');if(m)m.remove();}

  async function getItem(id){
    try{
      var db=await window.ktOpenVideoDB();
      return await new Promise(function(resolve){
        var tx=db.transaction('videos','readonly');
        var rq=tx.objectStore('videos').get(id);
        rq.onsuccess=function(){var x=rq.result||null;try{db.close();}catch(e){}resolve(x);};
        rq.onerror=function(){try{db.close();}catch(e){}resolve(null);};
      });
    }catch(e){return null;}
  }

  async function putItem(item){
    try{
      var db=await window.ktOpenVideoDB();
      await new Promise(function(resolve){
        var tx=db.transaction('videos','readwrite');
        tx.objectStore('videos').put(item);
        tx.oncomplete=function(){try{db.close();}catch(e){}resolve();};
        tx.onerror=tx.onabort=function(){try{db.close();}catch(e){}resolve();};
      });
      return true;
    }catch(e){return false;}
  }

  window.ktVideoSaveDraft=async function(id){
    closeMenu();
    var item=await getItem(id);
    if(!item){alert('동영상을 찾지 못했습니다.');return;}
    item.draft=true;
    item.posted=false;
    item.draftAt=Date.now();
    var ok=await putItem(item);
    if(ok){
      alert('✅ 임시 저장했습니다.');
      try{if(window.openMyVideoLibrary)window.openMyVideoLibrary();}catch(e){}
    }else alert('임시 저장하지 못했습니다.');
  };

  window.ktVideoShareFriend=async function(id){
    closeMenu();
    var item=await getItem(id);
    if(!item){alert('동영상을 찾지 못했습니다.');return;}
    try{
      if(item.blob && navigator.share && navigator.canShare){
        var ext=(String(item.blob.type||'').indexOf('mp4')>-1)?'mp4':'webm';
        var file=new File([item.blob],(item.name||'K-Talk-동영상')+'.'+ext,{type:item.blob.type||'video/webm'});
        if(navigator.canShare({files:[file]})){
          await navigator.share({title:item.name||'K-Talk 동영상',text:'K-Talk 동영상',files:[file]});
          return;
        }
      }
      if(item.publicVideoUrl && navigator.share){
        await navigator.share({title:item.name||'K-Talk 동영상',url:item.publicVideoUrl});
        return;
      }
      if(item.publicVideoUrl && navigator.clipboard){
        await navigator.clipboard.writeText(item.publicVideoUrl);
        alert('친구에게 보낼 동영상 주소를 복사했습니다.');
        return;
      }
      alert('이 기기에서는 동영상 파일 공유를 지원하지 않습니다.');
    }catch(e){}
  };

  window.ktVideoDeleteFromMenu=function(id){
    closeMenu();
    if(!confirm('이 동영상을 삭제할까요?'))return;
    try{
      if(typeof window.deleteStoredVideo==='function'){
        window.deleteStoredVideo(id,null,true);
        return;
      }
    }catch(e){}
  };

  window.ktOpenVideoMoreMenu=function(id,anchor){
    closeMenu();
    var pop=document.createElement('div');
    pop.id='ktVideoMorePopover';
    pop.innerHTML=''
      +'<button type="button" class="danger" onclick="ktVideoDeleteFromMenu(\''+String(id).replace(/'/g,"\\'")+'\')">🗑 <span>동영상 삭제하기</span></button>'
      +'<button type="button" onclick="ktVideoSaveDraft(\''+String(id).replace(/'/g,"\\'")+'\')">📥 <span>임시 저장</span></button>'
      +'<button type="button" onclick="ktVideoShareFriend(\''+String(id).replace(/'/g,"\\'")+'\')">↗ <span>친구한테 공유</span></button>';
    document.body.appendChild(pop);
    try{
      var r=anchor.getBoundingClientRect();
      var w=Math.min(250,Math.max(190,window.innerWidth-24));
      pop.style.width=w+'px';
      pop.style.left=Math.max(12,Math.min(window.innerWidth-w-12,r.right-w))+'px';
      pop.style.top=Math.min(window.innerHeight-190,r.bottom+7)+'px';
    }catch(e){}
  };

  function addRowDots(){
    document.querySelectorAll('.kt-myvideo-row').forEach(function(row){
      if(row.querySelector('.kt-video-more-btn'))return;
      var id=row.getAttribute('data-video-id');
      if(!id)return;
      var actions=row.querySelector('.kt-myvideo-row-actions')||row;
      var b=document.createElement('button');
      b.type='button';
      b.className='kt-video-more-btn';
      b.setAttribute('aria-label','동영상 더보기');
      b.textContent='⋮';
      b.onclick=function(e){e.preventDefault();e.stopPropagation();window.ktOpenVideoMoreMenu(id,b);};
      actions.appendChild(b);
    });
  }

  function addPlayerDots(id){
    var player=document.querySelector('.kt-myvideo-player');
    if(!player)return false;
    player.style.position='relative';
    if(player.querySelector('.kt-video-player-more'))return true;
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-video-player-more kt-video-more-btn';
    b.setAttribute('aria-label','동영상 더보기');
    b.textContent='⋮';
    b.onclick=function(e){e.preventDefault();e.stopPropagation();window.ktOpenVideoMoreMenu(id,b);};
    player.appendChild(b);
    return true;
  }

  var oldLibrary=window.openMyVideoLibrary;
  if(typeof oldLibrary==='function'){
    window.openMyVideoLibrary=async function(){
      var r=await oldLibrary.apply(this,arguments);
      setTimeout(addRowDots,40);setTimeout(addRowDots,180);
      return r;
    };
  }

  var oldPlay=window.playStoredVideo;
  if(typeof oldPlay==='function'){
    window.playStoredVideo=function(id){
      var r=oldPlay.apply(this,arguments);
      var n=0,t=setInterval(function(){n++;if(addPlayerDots(id)||n>15)clearInterval(t);},60);
      return r;
    };
  }

  document.addEventListener('click',function(e){
    var p=document.getElementById('ktVideoMorePopover');
    if(!p)return;
    if(p.contains(e.target)||e.target.closest('.kt-video-more-btn'))return;
    closeMenu();
  },true);

  var st=document.createElement('style');
  st.id='ktVideoMoreMenuStyle';
  st.textContent=''
    +'.kt-video-more-btn{border:0!important;background:rgba(20,20,24,.82)!important;color:#fff!important;border-radius:12px!important;min-width:36px!important;height:36px!important;padding:0 10px!important;font-size:25px!important;font-weight:950!important;line-height:1!important;display:inline-grid!important;place-items:center!important;touch-action:manipulation!important}'
    +'.kt-video-player-more{position:absolute!important;right:12px!important;top:12px!important;z-index:20!important;width:42px!important;height:42px!important;border-radius:50%!important;background:rgba(0,0,0,.62)!important;font-size:28px!important}'
    +'#ktVideoMorePopover{position:fixed;z-index:100000;background:#17171b;color:#fff;border:1px solid rgba(255,255,255,.14);border-radius:16px;padding:7px;box-shadow:0 12px 36px rgba(0,0,0,.5)}'
    +'#ktVideoMorePopover button{width:100%;height:48px;border:0;border-radius:11px;background:transparent;color:#fff;display:flex;align-items:center;gap:10px;padding:0 12px;text-align:left;font-size:15px;font-weight:850;touch-action:manipulation}'
    +'#ktVideoMorePopover button:active{background:rgba(255,255,255,.1)}#ktVideoMorePopover button.danger{color:#ff7c8f}'
    +'.kt-myvideo-row-actions{display:flex!important;align-items:center!important;gap:5px!important}';
  document.head.appendChild(st);

  setTimeout(addRowDots,250);
})();
