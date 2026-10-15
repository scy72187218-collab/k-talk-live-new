/* Live cards among public videos. No room entry, approval, chat or media capture until explicit entry. */
(function(){
  if(window.__ktLiveFeedPreview20261015)return;
  window.__ktLiveFeedPreview20261015=true;
  var catalog=[],active=null,connection=null,refreshing=false,lastFetch=0,installTimer=0;
  var watched=new WeakSet(),tracks=new Map();
  function scroller(){return document.querySelector('#screen .kt-public-feed-scroller,#screen .kt-hard-video-scroller');}
  function inRoom(){return !!document.querySelector('#screen .kt-remote-live,#screen .ktsolo-room,#screen .ktg9-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room')||Array.from(document.querySelectorAll('.creator')).some(function(el){return el.getClientRects().length>0&&getComputedStyle(el).display!=='none';});}
  function canPreview(room){
    var type=String(room.room_type||'').toLowerCase(),name=String(room.room_name||'');
    if(/secret|password|subscriber/.test(type)||/비밀|구독/.test(name))return false;
    return /^(solo|group9|group13)$/.test(type)||/^(1인|9명|13명)/.test(name.replace(/\s/g,''));
  }
  function selectedCard(){
    var sc=scroller();if(!sc||inRoom()||document.hidden)return null;
    var box=sc.getBoundingClientRect(),center=box.top+box.height/2;
    return Array.from(sc.querySelectorAll('[data-kt-live-feed-host]')).find(function(card){
      var r=card.getBoundingClientRect();return r.height>0&&r.top<=center&&r.bottom>center;
    })||null;
  }
  window.ktIsLiveFeedPreviewVisible20261015=function(){return !!selectedCard();};
  function status(card,message){var el=card&&card.querySelector('.ktlf-status');if(el&&el.textContent!==message)el.textContent=message;}
  function stop(){
    var old=connection;connection=null;active=null;
    if(old)old.stop();
    tracks.forEach(function(item){try{item.track.detach(item.video);item.video.pause();item.video.srcObject=null;}catch(e){}item.cell.remove();});
    tracks.clear();
  }
  function removeTrack(track,pub,person){
    var id=String(person&&person.identity||''),item=tracks.get(id);
    if(!item||item.track!==track)return;
    try{item.track.detach(item.video);item.video.srcObject=null;}catch(e){}
    item.cell.remove();tracks.delete(id);updateGrid(active);
  }
  function updateGrid(card){if(card){var grid=card.querySelector('.ktlf-grid');if(grid)grid.classList.toggle('multiple',tracks.size>1);}}
  function addTrack(card,track,pub,person){
    if(active!==card||!card.isConnected)return;
    var id=String(person&&person.identity||'');if(!id)return;
    var old=tracks.get(id);if(old&&old.track===track)return;
    if(old)removeTrack(old.track,null,{identity:id});
    if(tracks.size>=15)return;
    var cell=document.createElement('div');cell.className='ktlf-cell';
    var video=document.createElement('video');video.autoplay=true;video.muted=true;video.defaultMuted=true;video.playsInline=true;video.setAttribute('playsinline','');
    var label=document.createElement('span');label.textContent=id===card.dataset.ktLiveFeedHost?card.dataset.hostName:String(person.name||'게스트');
    if(id===card.dataset.ktLiveFeedHost)cell.style.order='-1';
    cell.appendChild(video);cell.appendChild(label);card.querySelector('.ktlf-grid').appendChild(cell);
    tracks.set(id,{track:track,video:video,cell:cell});
    try{track.attach(video);var p=video.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    updateGrid(card);status(card,'');
  }
  function select(){
    var card=selectedCard();
    if(card===active)return;
    stop();if(!card)return;
    active=card;
    document.querySelectorAll('#screen .kt-public-video,#screen #homeVideo').forEach(function(v){try{v.pause();}catch(e){}});
    if(card.dataset.previewAllowed!=='1'){status(card,'입장 조건 확인 후 시청할 수 있습니다.');return;}
    if(typeof window.ktOpenLiveFeedPreview20261015!=='function'){status(card,'방송 준비 중 · 라이브 시청을 눌러 주세요.');return;}
    status(card,'실시간 방송 연결 중…');
    connection=window.ktOpenLiveFeedPreview20261015(card.dataset.ktLiveFeedHost,{
      track:function(track,pub,person){addTrack(card,track,pub,person);},
      removed:function(track,pub,person){if(active===card)removeTrack(track,pub,person);},
      status:function(message){if(active===card)status(card,message||(!tracks.size?'방송 화면을 기다리고 있습니다.':''));},
      error:function(){if(active===card)status(card,'연결이 늦습니다. 라이브 시청을 눌러 주세요.');}
    });
  }
  function enter(card){
    if(typeof window.ktEnterRemoteLive!=='function'){status(card,'입장 준비 중입니다. 잠시 후 다시 눌러 주세요.');return;}
    var id=card.dataset.ktLiveFeedHost;stop();window.ktEnterRemoteLive(id);
  }
  function createCard(room){
    var card=document.createElement('section');card.className='kt-live-feed-preview';
    card.dataset.ktLiveFeedHost=String(room.host_id);card.dataset.hostName=String(room.host_name||'K-Talk 방송자');card.dataset.previewAllowed=canPreview(room)?'1':'0';
    card.setAttribute('aria-label',card.dataset.hostName+' 실시간 방송 미리보기');
    var poster=document.createElement('img');poster.className='ktlf-poster';poster.alt='';
    if(/^(https?:\/\/|data:image\/)/.test(String(room.host_photo||'')))poster.src=room.host_photo;
    else poster.hidden=true;
    var grid=document.createElement('div');grid.className='ktlf-grid';
    var top=document.createElement('div');top.className='ktlf-top';
    var badge=document.createElement('b');badge.textContent='● LIVE';var name=document.createElement('span');name.textContent=card.dataset.hostName;
    name.className='ktlf-host-name';
    var heading=document.createElement('span');heading.className='ktlf-heading';heading.textContent=String(room.title||room.room_name||'실시간 방송');heading.setAttribute('title',heading.textContent);
    top.appendChild(badge);top.appendChild(name);top.appendChild(heading);
    var bottom=document.createElement('div');bottom.className='ktlf-bottom';
    var title=document.createElement('strong');title.textContent=String(room.title||room.room_name||'실시간 방송');
    var message=document.createElement('p');message.className='ktlf-status';message.textContent=canPreview(room)?'실시간 방송 미리보기':'입장 조건 확인 후 시청할 수 있습니다.';
    var buttons=document.createElement('div');buttons.className='ktlf-buttons';
    var join=document.createElement('button');join.type='button';join.className='ktlf-enter';join.textContent='라이브 시청 ›';join.onclick=function(e){e.preventDefault();e.stopPropagation();enter(card);};
    var follow=document.createElement('button');follow.type='button';follow.className='ktlf-follow';follow.textContent='+ 팔로우';
    follow.disabled=true;
    buttons.appendChild(join);buttons.appendChild(follow);bottom.appendChild(title);bottom.appendChild(message);bottom.appendChild(buttons);
    card.__ktFollowPerson={id:String(room.host_id),name:card.dataset.hostName,photo:String(room.host_photo||'')};
    card.appendChild(poster);card.appendChild(grid);card.appendChild(top);card.appendChild(bottom);return card;
  }
  function style(){
    if(document.getElementById('ktLiveFeedPreviewStyle20261015'))return;
    var s=document.createElement('style');s.id='ktLiveFeedPreviewStyle20261015';
    s.textContent='.kt-live-feed-preview{height:calc(100dvh - 78px);min-height:520px;position:relative;scroll-snap-align:start;overflow:hidden;background:#09090d;color:#fff}.kt-live-feed-preview .ktlf-poster{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.45}.kt-live-feed-preview .ktlf-grid{position:absolute;inset:0;display:grid;grid-template-columns:1fr;grid-template-rows:1fr;gap:4px}.kt-live-feed-preview .ktlf-grid.multiple{inset:75px 8px 170px;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:minmax(0,1fr);grid-template-rows:none}.kt-live-feed-preview .ktlf-cell{min-width:0;min-height:0;position:relative;overflow:hidden;background:#101015;border-radius:10px}.kt-live-feed-preview .ktlf-cell video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scaleX(-1);filter:none}.kt-live-feed-preview .ktlf-cell>span{position:absolute;left:6px;bottom:6px;max-width:90%;font-size:11px;text-shadow:0 1px 4px #000;background:#0008;border-radius:8px;padding:2px 5px}.kt-live-feed-preview .ktlf-top{position:absolute;top:18px;left:14px;right:14px;display:flex;align-items:center;gap:10px;text-shadow:0 1px 4px #000}.kt-live-feed-preview .ktlf-top b{background:#ed2057;padding:6px 10px;border-radius:8px;font-size:14px}.kt-live-feed-preview .ktlf-top span{font-weight:800}.kt-live-feed-preview .ktlf-bottom{position:absolute;left:14px;right:14px;bottom:22px;padding:20px 12px 12px;border-radius:18px;background:linear-gradient(transparent,#000c 35%);text-shadow:0 1px 4px #000}.kt-live-feed-preview .ktlf-status{font-size:13px;line-height:1.4;min-height:18px}.kt-live-feed-preview .ktlf-buttons{display:flex;gap:10px}.kt-live-feed-preview button{border:0;border-radius:999px;padding:12px 18px;font-size:15px;font-weight:800;color:#fff;touch-action:manipulation}.kt-live-feed-preview .ktlf-enter{background:#ed2057;flex:0 0 46%;max-width:46%;padding:9px 10px;font-size:13px}.kt-live-feed-preview .ktlf-follow{background:#333;padding:9px 12px;font-size:13px}.kt-live-feed-preview .ktlf-follow.following{background:#265746}.kt-live-feed-preview .ktlf-follow:disabled{opacity:.6}.kt-live-feed-preview [hidden]{display:none!important}';
    s.textContent+='body.kt-live-feed-cards #ktFollowLiveStrip{display:none!important}';
    s.textContent+='.kt-live-feed-preview .ktlf-top b{flex-shrink:0}.kt-live-feed-preview .ktlf-host-name{flex:0 1 auto;max-width:28%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kt-live-feed-preview .ktlf-top .ktlf-heading{flex:1;min-width:0;max-height:3em;overflow:hidden;overflow-wrap:anywhere;font-size:14px;line-height:1.4;padding:5px 8px;border-radius:9px;background:#0009;color:#ffe589}';
    document.head.appendChild(s);
  }
  function install(){
    var sc=scroller();
    document.body.classList.toggle('kt-live-feed-cards',!!sc&&!inRoom()&&catalog.length>0);
    if(!sc||inRoom()){stop();return;}
    style();
    var originals=Array.from(sc.children).filter(function(n){return !n.hasAttribute('data-kt-live-feed-host')&&n.querySelector('.kt-public-video');});
    if(!originals.length)return;
    var ids=new Set(catalog.map(function(r){return String(r.host_id);}));
    Array.from(sc.querySelectorAll('[data-kt-live-feed-host]')).forEach(function(card){if(!ids.has(card.dataset.ktLiveFeedHost)){if(card===active)stop();card.remove();}});
    catalog.forEach(function(room,i){
      var id=String(room.host_id),exists=Array.from(sc.querySelectorAll('[data-kt-live-feed-host]')).some(function(card){return card.dataset.ktLiveFeedHost===id;});
      if(exists){
        var existing=Array.from(sc.querySelectorAll('[data-kt-live-feed-host]')).find(function(card){return card.dataset.ktLiveFeedHost===id;});
        var text=String(room.title||room.room_name||'실시간 방송');
        var heading=existing&&existing.querySelector('.ktlf-heading'),caption=existing&&existing.querySelector('.ktlf-bottom strong');
        if(heading&&heading.textContent!==text){heading.textContent=text;heading.setAttribute('title',text);}
        if(caption&&caption.textContent!==text)caption.textContent=text;
        return;
      }
      var card=createCard(room),anchor=originals[Math.min(i*2,originals.length-1)];
      while(anchor.nextElementSibling&&anchor.nextElementSibling.hasAttribute('data-kt-live-feed-host'))anchor=anchor.nextElementSibling;
      anchor.insertAdjacentElement('afterend',card);
    });
    sc.querySelectorAll('[data-kt-live-feed-host]').forEach(function(card){
      var button=card.querySelector('.ktlf-follow');
      if(button&&!card.__ktFollowBound&&typeof window.ktBindPersonFollowMenu20261015==='function'){
        card.__ktFollowBound=true;window.ktBindPersonFollowMenu20261015(card.__ktFollowPerson,button);
      }
    });
    if(!watched.has(sc)){watched.add(sc);sc.addEventListener('scroll',select,{passive:true});sc.addEventListener('touchend',select,{passive:true});}
    select();
  }
  async function refresh(){
    if(refreshing||document.hidden||inRoom()||!scroller()||typeof window.ktListLiveFeedRooms20261015!=='function')return;
    if(Date.now()-lastFetch<5000){install();return;}lastFetch=Date.now();refreshing=true;
    try{var rows=await window.ktListLiveFeedRooms20261015();catalog=Array.isArray(rows)?rows.filter(function(r){return r&&r.host_id;}).slice(0,15):[];install();}catch(e){}finally{refreshing=false;}
  }
  function schedule(){clearTimeout(installTimer);installTimer=setTimeout(function(){install();refresh();},120);}
  new MutationObserver(function(records){if(records.some(function(r){return Array.from(r.addedNodes).concat(Array.from(r.removedNodes)).some(function(n){return n.nodeType===1&&(n.matches('.kt-public-feed-scroller,.kt-hard-video-scroller,.kt-public-video,.kt-remote-live')||n.querySelector('.kt-public-feed-scroller,.kt-hard-video-scroller,.kt-public-video,.kt-remote-live'));});}))schedule();}).observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});
  document.addEventListener('visibilitychange',function(){if(document.hidden)stop();else schedule();});
  window.addEventListener('pagehide',stop);window.addEventListener('kt-broadcast-ended',schedule);
  window.addEventListener('kt-remote-live-enter',stop);
  setInterval(function(){if(active&&(!active.isConnected||inRoom()))stop();refresh();},5000);
  schedule();
})();