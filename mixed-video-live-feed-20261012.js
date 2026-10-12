/* Home discovery only. Existing live-room renderers and entry checks are preserved. */
(function(){
  'use strict';
  if(window.__ktMixedVideoLiveFeed20261012)return;
  window.__ktMixedVideoLiveFeed20261012=true;
  var rooms=[],busy=false,entering=false,refreshTimer=0,refreshGeneration=0;
  var ownedSelector='.kt-public-video,#homeVideo,#ktPublicFirstPaintVideo';
  var roomSelector='#screen .ktsolo-room,#screen .ktg13-room,#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .kt-remote-live';
  function scroller(){return document.querySelector('#screen .kt-public-feed-scroller,#screen .kt-hard-video-scroller');}
  function blocked(){return document.hidden||entering||!!document.querySelector(roomSelector+',#creator.show,#sheet.show');}
  function pause(v){try{v.pause();}catch(e){}}
  function silence(){document.querySelectorAll(ownedSelector).forEach(pause);}
  function sections(sc){return Array.prototype.filter.call(sc.children,function(c){return c.tagName==='SECTION';});}
  function active(sc){
    if(!sc)return null;
    var box=sc.getBoundingClientRect(),center=box.top+box.height/2,best=null,distance=Infinity;
    sections(sc).forEach(function(c){
      if(c.style.display==='none')return;
      var r=c.getBoundingClientRect();
      if(r.height<=0||r.bottom<=box.top||r.top>=box.bottom)return;
      var d=Math.abs((r.top+r.bottom)/2-center);
      if(d<distance){best=c;distance=d;}
    });
    return best;
  }
  function enforce(){
    var sc=scroller(),card=!blocked()&&active(sc);
    var current=card&&card.querySelector('.kt-public-video');
    document.querySelectorAll(ownedSelector).forEach(function(v){if(v!==current)pause(v);});
  }
  function style(){
    if(document.getElementById('ktMixedFeedStyle'))return;
    var s=document.createElement('style');s.id='ktMixedFeedStyle';
    s.textContent='#screen .kt-public-feed-scroller,#screen .kt-hard-video-scroller{overscroll-behavior-y:contain;scroll-behavior:auto;scrollbar-width:none}#screen .kt-public-feed-scroller>section,#screen .kt-hard-video-scroller>section{min-height:0!important;height:100%!important;scroll-snap-align:start;scroll-snap-stop:always}#screen .kt-mixed-live-card{position:relative;overflow:hidden;background:radial-gradient(ellipse at 50% 35%,#4d1745,#12111d 55%,#050509);color:#fff;isolation:isolate}#screen .kt-mixed-live-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:.65}#screen .kt-mixed-live-shade{position:absolute;inset:0;background:linear-gradient(180deg,#0008,transparent 30%,#000d)}#screen .kt-mixed-live-top{position:absolute;top:20px;left:18px;right:18px;display:flex;align-items:center;justify-content:space-between;gap:10px;font-weight:900}#screen .kt-mixed-live-badge{background:#ee226b;border-radius:999px;padding:7px 12px;font-size:13px}#screen .kt-mixed-live-art{position:absolute;inset:20% 12% 35%;display:grid;place-items:center;font-size:90px;opacity:.8;pointer-events:none}#screen .kt-mixed-live-info{position:absolute;left:20px;right:20px;bottom:46px}#screen .kt-mixed-live-info h2{font-size:25px;margin:0 0 10px;overflow-wrap:anywhere}#screen .kt-mixed-live-info p{margin:6px 0 20px;color:#e1d7e6;font-size:14px}#screen .kt-mixed-live-enter{display:block;width:100%;border:0;border-radius:18px;min-height:54px;background:linear-gradient(100deg,#f22886,#9338ee);color:white;font:900 17px system-ui;cursor:pointer}#screen .kt-mixed-live-hint{display:block;text-align:center;margin-top:16px;color:#e1d7e6;font-size:12px}#screen .kt-mixed-live-ended{background:#39343d}';
    document.head.appendChild(s);
  }
  function text(tag,cls,value){var el=document.createElement(tag);el.className=cls;el.textContent=value;return el;}
  function card(room){
    var c=document.createElement('section');c.className='kt-mixed-live-card';c.dataset.ktMixedHost=String(room.host_id);
    c.setAttribute('aria-label',String(room.host_name||'K-Talk 방송자')+' 라이브 방송');
    var photo=String(room.host_photo||'');
    if(/^https:\/\//i.test(photo)){
      var im=document.createElement('img');im.className='kt-mixed-live-photo';im.src=photo;im.alt='';im.loading='lazy';im.onerror=function(){im.remove();};c.appendChild(im);
    }else c.appendChild(text('div','kt-mixed-live-art','◉'));
    c.appendChild(text('div','kt-mixed-live-shade',''));
    var top=text('div','kt-mixed-live-top','');top.appendChild(text('span','kt-mixed-live-badge','● LIVE'));top.appendChild(text('span','',String(room.room_name||'라이브 방송')));c.appendChild(top);
    var info=text('div','kt-mixed-live-info','');info.appendChild(text('h2','',String(room.title||room.room_name||'라이브 방송')));info.appendChild(text('p','',String(room.host_name||'K-Talk 방송자')+' · 방송 중'));
    var btn=text('button','kt-mixed-live-enter','방송 들어가기');btn.type='button';
    btn.addEventListener('click',function(){enter(room,btn);});info.appendChild(btn);info.appendChild(text('small','kt-mixed-live-hint','↑ 위아래로 넘겨 다른 동영상과 방송 보기'));c.appendChild(info);return c;
  }
  async function enter(room,btn){
    if(entering)return;
    if(typeof window.ktEnterRemoteLive!=='function'){btn.textContent='잠시 후 다시 눌러 주세요';return;}
    entering=true;silence();btn.disabled=true;
    try{
      // Preserve password/subscription/approval checks in the existing entry flow.
      await window.ktEnterRemoteLive(String(room.host_id));
    }catch(e){btn.textContent='입장을 다시 시도해 주세요';}
    finally{entering=false;if(btn.isConnected)btn.disabled=false;enforce();}
  }
  function merge(list){
    var sc=scroller();if(!sc||document.querySelector(roomSelector))return;
    var current=active(sc),offset=current?current.getBoundingClientRect().top-sc.getBoundingClientRect().top:0;
    var ids=new Set(list.map(function(r){return String(r.host_id);}));
    sc.querySelectorAll('.kt-mixed-live-card').forEach(function(c){
      if(!ids.has(c.dataset.ktMixedHost)){
        if(c===current){var b=c.querySelector('button');b.disabled=true;b.textContent='종료된 방송입니다';b.classList.add('kt-mixed-live-ended');}
        else c.remove();
      }
    });
    var videos=sections(sc).filter(function(c){return !c.classList.contains('kt-mixed-live-card');});
    list.slice(0,12).forEach(function(room,i){
      var id=String(room.host_id||'');if(!id)return;
      if(Array.prototype.some.call(sc.querySelectorAll('.kt-mixed-live-card'),function(c){return c.dataset.ktMixedHost===id;}))return;
      var node=card(room),after=videos[Math.min((i+1)*2-1,videos.length-1)];
      if(after)after.after(node);else sc.appendChild(node);
    });
    if(current&&current.isConnected){sc.scrollTop+=current.getBoundingClientRect().top-sc.getBoundingClientRect().top-offset;}
    bind(sc);enforce();
  }
  async function refresh(){
    if(busy||!scroller()||document.hidden||document.querySelector(roomSelector))return;
    if(typeof window.ktDiscoveryActiveRooms!=='function')return;
    busy=true;var generation=++refreshGeneration;
    try{
      var next=await window.ktDiscoveryActiveRooms();
      if(generation!==refreshGeneration||!scroller()||document.querySelector(roomSelector))return;
      rooms=Array.isArray(next)?next:[];merge(rooms);
    }catch(e){}finally{busy=false;}
  }
  function bind(sc){
    if(sc.dataset.ktMixedBound)return;sc.dataset.ktMixedBound='1';
    sc.addEventListener('scroll',enforce,{passive:true});
    sc.addEventListener('keydown',function(e){
      if(e.target!==sc||!['ArrowDown','ArrowUp','PageDown','PageUp'].includes(e.key))return;
      e.preventDefault();sc.scrollBy({top:sc.clientHeight*(/Down$/.test(e.key)?1:-1),behavior:'smooth'});
    });
    if(!sc.hasAttribute('tabindex'))sc.tabIndex=0;
  }
  function install(){var sc=scroller();if(!sc)return;style();bind(sc);merge(rooms);clearTimeout(refreshTimer);refreshTimer=setTimeout(refresh,150);}
  // Existing playback helpers may attempt to resume an off-screen video.
  document.addEventListener('play',function(e){
    var v=e.target;if(!v.matches||!v.matches(ownedSelector))return;
    var c=!blocked()&&active(scroller());
    if(!c||!c.contains(v)){pause(v);return;}
    document.querySelectorAll(ownedSelector).forEach(function(other){if(other!==v)pause(other);});
  },true);
  document.addEventListener('click',function(e){
    if(!scroller())return;
    var b=e.target.closest&&e.target.closest('button,a,[data-bottom]');
    if(b&&!b.closest('.kt-mixed-live-card'))silence();
  },true);
  document.addEventListener('visibilitychange',function(){if(document.hidden)silence();else install();});
  window.addEventListener('pagehide',silence);
  window.addEventListener('pageshow',install);
  var observer=new MutationObserver(function(records){
    records.forEach(function(rec){Array.prototype.forEach.call(rec.removedNodes,function(n){
      if(n.matches&&n.matches(ownedSelector))pause(n);
      if(n.querySelectorAll)n.querySelectorAll(ownedSelector).forEach(pause);
    });});
    enforce();
    if(records.some(function(rec){return Array.prototype.some.call(rec.addedNodes,function(n){return n.nodeType===1&&!n.closest('.kt-mixed-live-card');});}))install();
  });
  observer.observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  setInterval(refresh,10000);install();
})();