/* 내 동영상 목록: 파일명 대신 실제 동영상 미리보기 썸네일을 보여 준다. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktMyVideoThumbnailFixInstalled)return;
  window.__ktMyVideoThumbnailFixInstalled=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  var urls=[];
  function clearUrls(){
    urls.splice(0).forEach(function(u){try{URL.revokeObjectURL(u);}catch(e){}});
  }

  function addStyle(){
    if(document.getElementById('ktMyVideoThumbnailFixStyle'))return;
    var st=document.createElement('style');
    st.id='ktMyVideoThumbnailFixStyle';
    st.textContent=''
      +'#sheet .kt-myvideo-list.kt-thumb-list{display:grid!important;gap:14px!important}'
      +'#sheet .kt-myvideo-row.kt-thumb-row{display:grid!important;grid-template-columns:132px minmax(0,1fr)!important;gap:12px!important;align-items:center!important;padding:12px!important;min-height:174px!important}'
      +'#sheet .kt-myvideo-preview{position:relative!important;width:132px!important;height:150px!important;padding:0!important;border:0!important;border-radius:16px!important;overflow:hidden!important;background:#09090d!important;display:block!important}'
      +'#sheet .kt-myvideo-preview video{display:block!important;width:100%!important;height:100%!important;object-fit:cover!important;background:#09090d!important;pointer-events:none!important}'
      +'#sheet .kt-myvideo-playmark{position:absolute!important;left:50%!important;top:50%!important;transform:translate(-50%,-50%)!important;width:46px!important;height:46px!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:rgba(0,0,0,.48)!important;color:#fff!important;font-size:24px!important;text-shadow:0 1px 3px #000!important}'
      +'#sheet .kt-myvideo-info{min-width:0!important;display:flex!important;flex-direction:column!important;gap:7px!important}'
      +'#sheet .kt-myvideo-info b{font-size:18px!important;color:#fff!important;font-weight:950!important}'
      +'#sheet .kt-myvideo-info small{font-size:12px!important;color:#aaa!important}'
      +'#sheet .kt-myvideo-row-actions{display:grid!important;gap:8px!important;margin-top:7px!important}'
      +'#sheet .kt-myvideo-row-actions button{width:100%!important;min-height:42px!important}'
      +'@media(max-width:390px){#sheet .kt-myvideo-row.kt-thumb-row{grid-template-columns:118px minmax(0,1fr)!important;gap:10px!important;padding:10px!important;min-height:158px!important}#sheet .kt-myvideo-preview{width:118px!important;height:136px!important}}';
    document.head.appendChild(st);
  }

  function install(){
    if(typeof window.openMyVideoLibrary!=='function'||typeof window.ktOpenVideoDB!=='function')return false;
    if(window.openMyVideoLibrary.__ktThumbWrapped)return true;

    var wrapped=async function(){
      clearUrls();
      try{
        var db=await window.ktOpenVideoDB();
        var tx=db.transaction('videos','readonly');
        var req=tx.objectStore('videos').getAll();
        req.onsuccess=function(){
          var items=(req.result||[]).sort(function(a,b){return (b.createdAt||0)-(a.createdAt||0);});
          var html='<div class="kt-myvideo-head"><b>🎬 내 동영상</b><button onclick="closeSheet();openCreator();setTimeout(openMyVideoPicker,120)">＋ 휴대폰 동영상 올리기</button></div>';
          if(!items.length){
            html+='<div class="rowbox"><b>아직 올린 동영상이 없습니다.</b><br>휴대폰에 찍어 놓은 동영상을 선택해서 올릴 수 있습니다.</div>';
          }else{
            html+='<div class="kt-myvideo-list kt-thumb-list">'+items.map(function(v,i){
              var d=new Date(v.createdAt||Date.now());
              var id=esc(v.id);
              var label='동영상 '+(i+1);
              return '<div class="kt-myvideo-row kt-thumb-row" data-video-id="'+id+'">'
                +'<button type="button" class="kt-myvideo-preview" onclick="playStoredVideo(\''+id+'\')" aria-label="'+label+' 재생">'
                  +'<video class="kt-myvideo-thumb-video" data-thumb-video="'+id+'" muted playsinline preload="metadata"></video>'
                  +'<span class="kt-myvideo-playmark">▶</span>'
                +'</button>'
                +'<div class="kt-myvideo-info"><b>'+label+'</b><small>'+d.toLocaleDateString('ko-KR')+(v.posted?' · 게시됨':'')+'</small>'
                  +'<div class="kt-myvideo-row-actions">'
                    +'<button type="button" class="upload" onclick="event.preventDefault();event.stopPropagation();postStoredVideo(\''+id+'\',this);return false;">'+(v.posted?'✓ 올림':'올리기')+'</button>'
                    +'<button type="button" class="trash" onclick="event.preventDefault();event.stopPropagation();deleteStoredVideo(\''+id+'\',this);return false;">삭제</button>'
                  +'</div>'
                +'</div>'
              +'</div>';
            }).join('')+'</div>';
          }

          if(typeof window.showSheet==='function')window.showSheet('내 동영상',html);
          try{db.close();}catch(e){}

          items.forEach(function(v){
            if(!v||!v.blob)return;
            var el=document.querySelector('.kt-myvideo-thumb-video[data-thumb-video="'+String(v.id).replace(/"/g,'\\"')+'"]');
            if(!el)return;
            try{
              var u=URL.createObjectURL(v.blob);
              urls.push(u);
              el.src=u;
              el.muted=true;
              el.setAttribute('playsinline','');
              el.addEventListener('loadedmetadata',function(){
                try{if(isFinite(el.duration)&&el.duration>0.15)el.currentTime=Math.min(0.15,el.duration/4);}catch(e){}
              },{once:true});
            }catch(e){}
          });
        };
        req.onerror=function(){try{db.close();}catch(e){};alert('동영상을 불러오지 못했습니다.');};
      }catch(e){
        alert('동영상을 불러오지 못했습니다.');
      }
    };
    wrapped.__ktThumbWrapped=true;
    window.openMyVideoLibrary=wrapped;
    addStyle();
    window.addEventListener('beforeunload',clearUrls);
    return true;
  }

  if(!install()){
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      if(install()||tries>40)clearInterval(timer);
    },100);
  }
})();
