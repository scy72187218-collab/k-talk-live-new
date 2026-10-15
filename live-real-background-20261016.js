/* Optional live photo backgrounds; raw camera and audio stay under the existing transport. */
(function(){
 if(window.__ktLiveBackground20261016)return;window.__ktLiveBackground20261016=true;
 var names={stage:'무대',sea:'바다',mountain:'산',autumn:'가을'},selected='',active=null,pending=null,version=0,busy=false,segLoad=null;
 function sourcePath(id){return 'live-background-'+id+'-20261016.jpg';}
 function status(t){var n=document.querySelector('#ktLiveBackgroundPanel small');if(n)n.textContent=t;}
 function timeout(p,ms){var timer;return Promise.race([p,new Promise(function(_,reject){timer=setTimeout(function(){reject(Error('timeout'));},ms);})]).finally(function(){clearTimeout(timer);});}
 async function loadSeg(){
  if(window.SelfieSegmentation)return;
  if(!segLoad)segLoad=timeout(new Promise(function(resolve,reject){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675465747/selfie_segmentation.js';s.onload=resolve;s.onerror=reject;document.head.appendChild(s);}),20000).catch(function(e){segLoad=null;throw e;});
  return segLoad;
 }
 function cover(ctx,image,w,h){var iw=image.videoWidth||image.naturalWidth||image.width,ih=image.videoHeight||image.naturalHeight||image.height;var scale=Math.max(w/iw,h/ih);ctx.drawImage(image,(w-iw*scale)/2,(h-ih*scale)/2,iw*scale,ih*scale);}
 function processor(id){
  var video,output,input,stream,seg,timer,watchdog,raw,dead=false,frames=0,last=0,firstResolve;
  var p={name:'kt-real-photo-background',processedTrack:null,
   async init(options){
    raw=options.track;await loadSeg();if(dead)throw Error('cancelled');
    var image=new Image();await timeout(new Promise(function(resolve,reject){image.onload=resolve;image.onerror=reject;image.src=sourcePath(id);}),10000);
    if(dead)throw Error('cancelled');
    video=document.createElement('video');video.muted=true;video.autoplay=true;video.playsInline=true;video.srcObject=new MediaStream([raw]);await timeout(video.play(),10000);
    if(dead)throw Error('cancelled');
    var w=480,h=Math.max(240,Math.min(640,Math.round(w*(video.videoHeight||640)/(video.videoWidth||480))));
    input=document.createElement('canvas');input.width=w;input.height=h;output=document.createElement('canvas');output.width=w;output.height=h;
    var ctx=output.getContext('2d'),ic=input.getContext('2d');if(!ctx||!ic||!output.captureStream)throw Error('unsupported');
    seg=new SelfieSegmentation({locateFile:function(f){return 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675465747/'+f;}});
    seg.setOptions({modelSelection:1,selfieMode:false});
    var first=new Promise(function(resolve){firstResolve=resolve;});
    seg.onResults(function(r){if(dead)return;ctx.save();ctx.clearRect(0,0,w,h);ctx.globalCompositeOperation='source-over';ctx.drawImage(r.segmentationMask,0,0,w,h);ctx.globalCompositeOperation='source-in';ctx.drawImage(r.image,0,0,w,h);ctx.globalCompositeOperation='destination-over';cover(ctx,image,w,h);ctx.restore();frames++;if(firstResolve){firstResolve();firstResolve=null;}});
    ic.drawImage(video,0,0,w,h);await timeout(seg.send({image:input}),15000);await timeout(first,5000);if(dead)throw Error('cancelled');
    stream=output.captureStream(15);p.processedTrack=stream.getVideoTracks()[0];p.processedTrack.enabled=raw.enabled;
    async function tick(){
     if(dead)return;
     if(raw.readyState!=='live'){window.ktLiveBackgroundDisable20261016();return;}
     if(p.processedTrack)p.processedTrack.enabled=raw.enabled;
     if(!raw.enabled){last=frames;timer=setTimeout(tick,150);return;}
     try{ic.drawImage(video,0,0,w,h);await seg.send({image:input});}catch(e){if(active&&active.processor===p){window.ktLiveBackgroundDisable20261016();status('배경 처리를 중단하고 원래 카메라로 돌아왔습니다.');}return;}
     if(!dead)timer=setTimeout(tick,80);
    }
    timer=setTimeout(tick,80);watchdog=setInterval(function(){if(!dead&&raw.enabled&&frames===last&&active&&active.processor===p){window.ktLiveBackgroundDisable20261016();status('배경이 멈춰 원래 카메라로 돌아왔습니다.');}last=frames;},10000);
   },
   async restart(options){await p.destroy();dead=false;frames=0;last=0;return p.init(options);},
   async destroy(){dead=true;clearTimeout(timer);clearInterval(watchdog);if(stream)stream.getTracks().forEach(function(t){t.stop();});if(video){video.pause();video.srcObject=null;}if(seg){try{var done=seg.close();if(done&&done.catch)done.catch(function(){});}catch(e){}seg=null;}p.processedTrack=null;}
  };return p;
 }
 function clearPreview(){document.querySelectorAll('.kt-live-bg-own-preview').forEach(function(v){v.srcObject=null;v.remove();});}
 window.ktLiveBackgroundDisable20261016=async function(){
  selected='';version++;var c=active;active=null;if(pending){pending.cancelled=true;await pending.processor.destroy();}clearPreview();
  if(c){try{await c.track.stopProcessor();}catch(e){await c.processor.destroy();}}
 };
 async function apply(track,raw){
  if(!selected||!track||!raw)return;
  if(active&&active.track===track)return;
  if(pending)return;
  var token=version,id=selected,p=processor(id),entry={processor:p,track:track,cancelled:false};pending=entry;
  try{
   await track.setProcessor(p,true);
   if(entry.cancelled||token!==version){await track.stopProcessor();return;}
   active={track:track,raw:raw,processor:p};status('배경을 적용했습니다.');
  }catch(e){try{if(track.getProcessor&&track.getProcessor()===p)await track.stopProcessor();}catch(_){}await p.destroy();if(token===version){selected='';status('배경을 적용하지 못했습니다. 원래 카메라로 볼 수 있습니다.');}}
  finally{if(pending===entry)pending=null;}
 }
 window.ktApplyLiveBackgroundToTrack20261016=async function(track,raw){if(active&&active.track!==track){var previous=active;active=null;await previous.track.stopProcessor().catch(function(){});clearPreview();}return apply(track,raw);};
 async function choose(id){
  if(busy)return;busy=true;
  try{
   await window.ktLiveBackgroundDisable20261016();
   if(!id){status('배경을 껐습니다.');return;}
   var own=window.ktGetLocalPublishedVideo20261016&&window.ktGetLocalPublishedVideo20261016();
   if(!own||!own.source.enabled){status('카메라를 켜고 방송을 시작하거나 게스트 승인을 받은 뒤 선택해 주세요.');return;}
   selected=id;status('배경을 준비하고 있습니다…');await apply(own.track,own.source);
  }finally{busy=false;}
 }
 window.ktOpenLiveBackground20261016=function(){
  var old=document.getElementById('ktLiveBackgroundPanel');if(old)old.remove();
  var p=document.createElement('div');p.id='ktLiveBackgroundPanel';p.style.cssText='position:fixed;left:3vw;right:3vw;bottom:max(20px,env(safe-area-inset-bottom));z-index:2147483647;padding:12px;border-radius:18px;background:#15151bf5;color:white;border:1px solid #777;display:grid;grid-template-columns:repeat(2,1fr);gap:8px;max-height:80dvh;overflow:auto';
  var title=document.createElement('b');title.textContent='카메라 켠 상태 · 실제 사진 뒷배경';title.style.gridColumn='1/-1';p.appendChild(title);
  Object.keys(names).forEach(function(id){var b=document.createElement('button');b.type='button';b.textContent=names[id];b.style.cssText='height:100px;border:1px solid #aaa;border-radius:10px;color:white;font-weight:900;font-size:18px;background:#222 url('+sourcePath(id)+') center/cover;text-shadow:0 1px 5px black';b.onclick=function(){choose(id);};p.appendChild(b);});
  var off=document.createElement('button');off.type='button';off.textContent='배경 끄기';off.onclick=function(){choose('');};p.appendChild(off);
  var close=document.createElement('button');close.type='button';close.textContent='닫기';close.onclick=function(){p.remove();};p.appendChild(close);
  var msg=document.createElement('small');msg.textContent='배경은 고정되고 사람만 움직입니다.';msg.style.gridColumn='1/-1';p.appendChild(msg);document.body.appendChild(p);
 };
 function updateOwnTiles(){
  var own=window.ktGetLocalPublishedVideo20261016&&window.ktGetLocalPublishedVideo20261016();
  if(!own){if(active||pending)window.ktLiveBackgroundDisable20261016();document.querySelectorAll('.kt-live-bg-own-button').forEach(function(b){b.remove();});return;}
  var raw=own.source;
  document.querySelectorAll('#screen video:not(.kt-live-bg-own-preview)').forEach(function(v){
   if(!v.srcObject||!v.srcObject.getVideoTracks||!v.srcObject.getVideoTracks().some(function(t){return t===raw||active&&t===active.processor.processedTrack;}))return;
   var tile=v.closest('.ktsolo-main,.ktg13-host,.ktg13-guest,.ktsubscriber-host,.ktsubscriber-guest,.ktsecret-slot,.ktsecret-host,.kgh-cell,.kt-approved-guest-cell,.kt-guest-room-cell');if(!tile)return;
   if(!tile.querySelector('.kt-live-bg-own-button')){var b=document.createElement('button');b.type='button';b.className='kt-live-bg-own-button';b.textContent='뒷배경';b.style.cssText='position:absolute;bottom:26px;right:3px;z-index:45;border:1px solid #aaa;border-radius:7px;background:#141019bb;color:white;font-weight:900;font-size:10px;padding:5px';b.onclick=function(e){e.stopPropagation();window.ktOpenLiveBackground20261016();};tile.appendChild(b);}
   if(!active||!active.processor.processedTrack)return;
   var processed=active.processor.processedTrack;processed.enabled=raw.enabled;
   var pv=tile.querySelector('.kt-live-bg-own-preview');if(!pv){pv=document.createElement('video');pv.className='kt-live-bg-own-preview';pv.muted=true;pv.autoplay=true;pv.playsInline=true;pv.style.cssText='position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transform:scaleX(-1);pointer-events:none;z-index:3';pv.srcObject=new MediaStream([processed]);tile.appendChild(pv);pv.play().catch(function(){});}pv.style.display=raw.enabled?'block':'none';
  });
 }
 ['kt-broadcast-ended','kt-remote-host-left','pagehide'].forEach(function(name){window.addEventListener(name,window.ktLiveBackgroundDisable20261016);});
 window.addEventListener('keydown',function(e){if(e.key==='Escape'){var p=document.getElementById('ktLiveBackgroundPanel');if(p)p.remove();}});
 setInterval(updateOwnTiles,600);
})();