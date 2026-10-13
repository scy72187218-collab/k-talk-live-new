/* First tap watches outside; only explicit Enter uses the existing room entry flow. */
(function(){
  if(window.__ktOutsideLivePreview20261013)return;
  window.__ktOutsideLivePreview20261013=true;
  var sequence=0,host='',box=null;
  function close(keepTransport){
    sequence++;var previous=host;host='';
    if(box){box.querySelectorAll('video').forEach(function(v){try{v.pause();v.srcObject=null;}catch(e){}});box.remove();box=null;}
    if(previous&&!keepTransport)window.dispatchEvent(new CustomEvent('kt-live-preview-closed',{detail:{host_id:previous}}));
  }
  window.ktPreviewRemoteLive=async function(id){
    id=String(id||'').trim();if(!id)return false;
    close(false);var request=sequence;host=id;
    if(window.ktStopPageMedia)window.ktStopPageMedia();
    box=document.createElement('section');box.id='ktOutsideLivePreview';box.setAttribute('aria-label','방송 미리보기');
    box.style.cssText='position:fixed;inset:0;z-index:2147483500;background:#08080d;color:white;display:flex;flex-direction:column;padding:16px;box-sizing:border-box';
    var top=document.createElement('div');top.style.cssText='display:flex;justify-content:space-between;align-items:center';
    var title=document.createElement('b');title.textContent='● LIVE · 방송 미리보기';top.appendChild(title);
    var back=document.createElement('button');back.textContent='닫기';back.onclick=function(){close(false);};top.appendChild(back);box.appendChild(top);
    var video=document.createElement('video');video.id='ktRemoteHostPreview';video.autoplay=true;video.playsInline=true;video.muted=false;video.style.cssText='width:100%;flex:1;min-height:0;object-fit:contain;background:#111';box.appendChild(video);
    var note=document.createElement('p');note.textContent='방송 상태를 확인하고 있습니다…';box.appendChild(note);
    var enter=document.createElement('button');enter.type='button';enter.textContent='방송 입장하기';enter.style.cssText='border:0;border-radius:16px;padding:18px;background:#ec286c;color:white;font-size:18px;font-weight:bold';box.appendChild(enter);
    enter.onclick=async function(){
      if(enter.disabled||host!==id)return;enter.disabled=true;
      try{var ok=await window.ktEnterRemoteLive(id);if(ok!==false&&host===id)close(true);else note.textContent='입장 조건이나 방송 상태를 확인해 주세요.';}
      catch(e){note.textContent='입장을 다시 시도해 주세요.';}
      finally{enter.disabled=false;}
    };
    document.body.appendChild(box);
    try{
      var list=typeof window.ktDiscoveryActiveRooms==='function'?await window.ktDiscoveryActiveRooms():[];
      if(request!==sequence||host!==id)return false;
      var room=(list||[]).find(function(r){return String(r.host_id||'')===id;});
      if(!room){note.textContent='현재 방송을 찾을 수 없습니다.';enter.disabled=true;return false;}
      title.textContent='● LIVE · '+String(room.host_name||'방송자');
      var restricted=/password|secret|비밀|subscriber|구독/i.test([room.room_type,room.room_name].join(' '));
      note.textContent=restricted?'입장 조건을 확인한 뒤 방송을 볼 수 있습니다.':'바깥에서 시청 중 · 입장 후 사람 버튼으로 참여 신청할 수 있습니다.';
      if(!restricted)window.dispatchEvent(new CustomEvent('kt-live-preview-selected',{detail:{host_id:id}}));
      return true;
    }catch(e){if(request===sequence&&box)note.textContent='방송 목록을 다시 확인해 주세요.';return false;}
  };
  document.addEventListener('click',function(e){if(box&&e.target.closest&&e.target.closest('[data-bottom]'))close(false);},true);
  window.addEventListener('pagehide',function(){close(false);});
})();
