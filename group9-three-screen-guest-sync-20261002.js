/* K-Talk 9-room three-screen guest sync — names/photos only. */
(function(){
  if(window.__ktG9ThreeScreenGuestSync20261002)return;
  window.__ktG9ThreeScreenGuestSync20261002=true;

  function localViewerId(){
    try{
      var d=String(localStorage.getItem('kt_live_device_id')||'').trim();
      return d?'viewer_'+d:'';
    }catch(e){return '';}
  }

  function syncApprovedGuestCells(){
    var room=document.querySelector('#screen .kt-guest-hostlike-room[data-kt-room="9"]');
    if(!room)return;

    var map=window.__ktApprovedGuestIds20260924||{};
    var names=window.__ktApprovedGuestNames20260924||{};
    var photos=window.__ktApprovedGuestPhotos20261002||{};
    var self=localViewerId();
    var ids=Object.keys(map).filter(function(id){return map[id]===true&&id!==self;});

    var cells=[].slice.call(room.querySelectorAll('.kgh-main>.kgh-cell')).filter(function(c){
      return !c.classList.contains('host')&&!c.classList.contains('self');
    });

    cells.forEach(function(cell,i){
      var id=ids[i]||'';
      if(!id){
        cell.removeAttribute('data-kt-roster-viewer-id');
        cell.style.removeProperty('background-image');
        cell.style.removeProperty('background-size');
        cell.style.removeProperty('background-position');
        var old=cell.querySelector('.kgh-roster-name');
        if(old)old.remove();
        if(!cell.querySelector('video'))cell.textContent='게스트';
        return;
      }

      cell.setAttribute('data-kt-roster-viewer-id',id);
      if(!cell.querySelector('video'))cell.textContent='';

      var label=cell.querySelector('.kgh-roster-name');
      if(!label){
        label=document.createElement('span');
        label.className='kgh-label kgh-roster-name';
        cell.appendChild(label);
      }
      label.textContent=String(names[id]||'게스트');

      var frame=String(photos[id]||'');
      if(frame.indexOf('data:image/jpeg;base64,')===0&&frame.length<32000&&!cell.querySelector('video')){
        cell.style.setProperty('background-image','url("'+frame+'")','important');
        cell.style.setProperty('background-size','cover','important');
        cell.style.setProperty('background-position','center','important');
      }
    });
  }

  ['kt-any-guest-approved','kt-three-person-sync-now','kt-approved-guest-stream-ready','kt-guest-approval-received'].forEach(function(n){
    window.addEventListener(n,function(){setTimeout(syncApprovedGuestCells,0);setTimeout(syncApprovedGuestCells,80);});
  });
  setInterval(syncApprovedGuestCells,400);
  syncApprovedGuestCells();
})();