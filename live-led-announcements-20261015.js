/* Live LED notices and solo full-camera layout. Read-only notice data; no gift sending or credit changes. */
(function(){
 if(window.__ktLiveLedNotices20261015)return;window.__ktLiveLedNotices20261015=true;
 var queue=[],active=null,seen=Object.create(null),recent=Object.create(null),since=Date.now(),startedAt=Date.now(),busy=false,configPromise=null,roomCache={};
 var style=document.createElement('style');style.id='ktSoloFullCameraAndLiveLed20261015';style.textContent="\nhtml:not(.kt-host-media-sharing) body #screen .ktsolo-room{position:relative!important;padding:0!important;gap:0!important;isolation:isolate!important;background:#000!important}\nhtml:not(.kt-host-media-sharing) body #screen .ktsolo-room>.ktsolo-main{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;min-height:0!important;flex:none!important;z-index:0!important;background:#000!important}\nhtml:not(.kt-host-media-sharing) body #screen .ktsolo-room>.ktsolo-main>video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important}\nhtml:not(.kt-host-media-sharing) body #screen .ktsolo-room>.ktsolo-head{position:absolute!important;top:env(safe-area-inset-top,0px)!important;left:0!important;right:0!important;min-height:64px!important;height:auto!important;z-index:30!important;border-radius:0!important;background:linear-gradient(#0009,#0000)!important;box-shadow:none!important;padding:8px!important}\nhtml:not(.kt-host-media-sharing) body #screen .ktsolo-room>.ktsolo-head .ktsolo-brand{font-size:14px!important}\nhtml:not(.kt-host-media-sharing) body #screen .ktsolo-room>.ktsolo-led{position:absolute!important;top:84px!important;left:8px!important;right:8px!important;height:44px!important;min-height:44px!important;z-index:31!important}\nhtml:not(.kt-host-media-sharing) body #screen .ktsolo-room>.ktsolo-tools{z-index:32!important;background:linear-gradient(#0000,#0007)!important}\nhtml:not(.kt-host-media-sharing) body #screen .ktsolo-room .ktsolo-tool i{background:#19191c99!important;backdrop-filter:blur(5px)!important}\nhtml:not(.kt-host-media-sharing) body #screen .ktsolo-room>.kt-fresh-three-1111,html:not(.kt-host-media-sharing) body #screen .ktsolo-room>.kt-three-quick-row{position:absolute!important;top:140px!important;left:8px!important;right:8px!important;z-index:25!important;background:transparent!important}\nhtml:not(.kt-host-media-sharing) body #screen .ktsolo-room>.kt-room-stats-copy,html:not(.kt-host-media-sharing) body #screen .ktsolo-room>.ktsolo-stats{position:absolute!important;top:190px!important;left:8px!important;right:8px!important;z-index:24!important;background:transparent!important}\n#screen .ktsolo-led:not([data-kt-important-led=\"1\"]){display:none!important}\n#screen [data-kt-led-announcement=\"1\"]{position:relative}\n#screen [data-kt-led-announcement=\"1\"]>*:not(.kt-live-led-notice){visibility:hidden!important}\n#screen .kt-live-led-notice{position:absolute!important;inset:0!important;overflow:hidden!important;display:flex!important;align-items:center!important;white-space:nowrap!important;z-index:10!important;pointer-events:none!important}\n#screen .kt-live-led-notice>span{display:inline-block!important;padding-left:100%!important;white-space:nowrap!important;animation:ktLiveLedNotice var(--kt-led-duration,10s) linear 1!important;color:#ffe55c!important;text-shadow:0 0 7px #ff9200!important;font:950 20px/1.1 system-ui!important}\n@keyframes ktLiveLedNotice{from{transform:translateX(0)}to{transform:translateX(-100%)}}\n\nhtml:not(.kt-host-media-sharing) body #screen .ktsolo-room>.kt-room-stats-copy{width:calc(100% - 16px)!important;max-width:calc(100% - 16px)!important}\nhtml:not(.kt-host-media-sharing) body #screen .ktsolo-room>.kt-room-stats-copy>*,html:not(.kt-host-media-sharing) body #screen .ktsolo-room>.kt-fresh-three-1111>button{background:#17171b88!important;backdrop-filter:blur(5px)!important}\n\nhtml:not(.kt-host-media-sharing) body #screen .kt-remote-live[data-kt-solo-guest-header]{position:relative!important;padding:0!important;gap:0!important;isolation:isolate!important;background:#000!important}\nhtml:not(.kt-host-media-sharing) body #screen .kt-remote-live[data-kt-solo-guest-header]>#ktRemoteLiveVideo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;min-height:0!important;flex:none!important;object-fit:cover!important;z-index:0!important}\nhtml:not(.kt-host-media-sharing) body #screen .kt-remote-live[data-kt-solo-guest-header]>.kt-solo-guest-header{position:absolute!important;top:env(safe-area-inset-top,0px)!important;left:0!important;right:0!important;z-index:30!important;padding:0 8px!important}\nhtml:not(.kt-host-media-sharing) body #screen .kt-remote-live[data-kt-solo-guest-header] .ktsgv-head{background:linear-gradient(#0009,#0000)!important;border-radius:0!important}\nhtml:not(.kt-host-media-sharing) body #screen .kt-remote-live[data-kt-solo-guest-header] .kt-room-stats-copy{background:transparent!important}\nhtml:not(.kt-host-media-sharing) body #screen .kt-remote-live[data-kt-solo-guest-header] .kt-room-stats-copy>*,html:not(.kt-host-media-sharing) body #screen .kt-remote-live[data-kt-solo-guest-header] .kt-fresh-three-1111>button{background:#17171b88!important;backdrop-filter:blur(5px)!important}\n#screen .ktsgv-led:not([data-kt-important-led=\"1\"]){display:none!important}\n";document.head.appendChild(style);
 function stamp(v){return Date.parse(v||'')||0;}
 function roomRoot(){return document.querySelector('#screen .kt-remote-live,#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,#screen .ktsubscriber-room,#screen .ktsecret-room');}
 function leds(){return [].slice.call(document.querySelectorAll('#screen .ktsolo-led,#screen .ktg13-led,#screen .ktg9-led,#screen .ktsubscriber-led,#screen .ktsecret-led,#screen .kt-prejoin-room-led,#screen .kgh-led,#screen .ktsgv-led'));}
 function restore(){leds().forEach(function(el){el.removeAttribute('data-kt-led-announcement');el.querySelectorAll('.kt-live-led-notice').forEach(function(n){n.remove();});});active=null;}
 function paint(){
   leds().forEach(function(el){
     var ownText=Array.from(el.children).filter(function(n){return !n.classList.contains('kt-live-led-notice');}).map(function(n){return n.textContent||'';}).join('');
     var important=!!active||/광고|긴급|공지|중요/.test(ownText)||!!(ownText.trim()&&!/환영합니다|즐거운\s*방송|^K-Talk LIVE$/.test(ownText.trim()));
     if(important)el.setAttribute('data-kt-important-led','1');else el.removeAttribute('data-kt-important-led');
     if(!active)return;
     el.setAttribute('data-kt-led-announcement','1');
     var n=el.querySelector('.kt-live-led-notice');
     if(!n){n=document.createElement('div');n.className='kt-live-led-notice';var text=document.createElement('span');text.textContent=active.text;n.appendChild(text);n.style.setProperty('--kt-led-duration',active.duration+'ms');el.appendChild(n);}
   });
 }
 function enqueue(item){
   if(!item||!item.id||seen[item.id]||item.at<startedAt-2000)return;
   seen[item.id]=true;
   var prior=recent[item.key]||0;if(prior&&Math.abs(item.at-prior)<2000)return;
   recent[item.key]=item.at;
   queue.push(item);if(queue.length>20)queue.shift();next();
 }
 function next(){
   if(active||!queue.length||!roomRoot())return;
   active=queue.shift();active.duration=Math.max(8000,Math.min(16000,active.text.length*170));paint();
   setTimeout(function(){restore();paint();next();},active.duration);
 }
 async function config(){
   if(configPromise)return configPromise;
   configPromise=fetch('live-presence.js',{cache:'no-store'}).then(function(r){if(!r.ok)throw Error('config');return r.text();}).then(function(t){var b=t.match(/var BASE='([^']+)'/),k=t.match(/var KEY='([^']+)'/);if(!b||!k)throw Error('config');return {base:b[1],headers:{apikey:k[1],Authorization:'Bearer '+k[1]}};}).catch(function(){configPromise=null;return null;});return configPromise;
 }
 function parseGift(m){
   var type=String(m.message_type||''),name='',amount=0,target='';
   if(type.indexOf('gift:')===0){
     amount=parseInt(type.slice(5),10)||0;
     var text=String(m.message||''),names=(window.ktalkGifts||[]).map(function(g){return String(g[0]);}).sort(function(a,b){return b.length-a.length;});
     name=names.find(function(n){return text.indexOf('님이 '+n+' ')>=0;})||'선물';
   }else{
     try{var data=JSON.parse(m.message||'{}');amount=parseInt(data.cost,10)||0;name=String(data.name||'선물');target=String(data.targetName||'');}catch(e){return null;}
   }
   if(amount<500)return null;
   return {row:m,name:name,amount:amount,target:target,priority:target?2:(type==='gift'?1:0)};
 }
 async function poll(){
   if(busy||!roomRoot()||document.hidden)return;busy=true;
   var ctrl=typeof AbortController==='function'?new AbortController():null,timer=ctrl?setTimeout(function(){ctrl.abort();},4000):null;
   try{
     var c=await config();if(!c)return;
     var cut=new Date(Math.max(startedAt-2000,since-2000)).toISOString();
     var path='ktalk_live_messages?select=id,host_id,sender_id,sender_name,message,message_type,created_at&created_at=gte.'+encodeURIComponent(cut)+'&or=(message_type.like.gift:*,message_type.eq.gift,message_type.like.host_gift:*,message_type.like.guest_gift:*)&order=created_at.asc&limit=200';
     var r=await fetch(c.base+path,{headers:c.headers,cache:'no-store',signal:ctrl&&ctrl.signal});if(!r.ok)return;
     var rows=await r.json(),gifts=(Array.isArray(rows)?rows:[]).map(parseGift).filter(Boolean);
     var ids=Array.from(new Set(gifts.map(function(g){return String(g.row.host_id||'');}))).filter(function(id){return !roomCache[id]||Date.now()-roomCache[id].cachedAt>30000;});
     if(ids.length){
       var rr=await fetch(c.base+'ktalk_live_rooms?select=host_id,host_name,room_name,title,started_at&host_id=in.('+ids.map(encodeURIComponent).join(',')+')&order=started_at.desc&limit=100',{headers:c.headers,cache:'no-store',signal:ctrl&&ctrl.signal});
       if(rr.ok){var found=await rr.json(),added={};(found||[]).forEach(function(x){if(!added[x.host_id]){added[x.host_id]=true;x.cachedAt=Date.now();roomCache[x.host_id]=x;}});}
     }
     gifts.sort(function(a,b){return b.priority-a.priority;});
     var targeted=Object.create(null);
     gifts.forEach(function(g){
       var m=g.row,at=stamp(m.created_at),host=roomCache[m.host_id]||{},sender=String(m.sender_name||'회원'),target=g.target||String(host.host_name||'호스트'),room=String(host.room_name||host.title||'방송방');
       var senderKey=String(m.sender_id||sender).replace(/^(?:viewer_|gift:|guestgift:|hostgift:)/,'');
       var base=String(m.host_id)+'|'+senderKey+'|'+g.name+'|'+g.amount;
       if(g.target)targeted[base]=at;
       if(g.priority===0&&targeted[base]&&Math.abs(at-targeted[base])<2000)return;
       base+='|'+target;
       enqueue({id:'gift:'+m.id,at:at,key:base,text:'🎁 '+sender+'님이 '+room+'에서 '+target+'님에게 '+g.name+' '+g.amount+'개를 선물했습니다.'});
     });
     if(rows&&rows.length)since=Math.max(since,...rows.map(function(m){return stamp(m.created_at);}));
   }catch(e){}finally{if(timer)clearTimeout(timer);busy=false;}
 }
 window.addEventListener('kt-live-treasure-events',function(e){
   (e&&e.detail&&e.detail.events||[]).forEach(function(ev){enqueue({id:'treasure:'+ev.id,at:stamp(ev.placed_at),key:'treasure:'+ev.id,text:'🎁 '+String(ev.host_name||'호스트')+'님의 '+String(ev.room_title||'방송방')+'에 보물상자가 올라왔습니다.'});});
 });
 window.ktShowImportantLiveLed20261015=function(text){enqueue({id:'notice:'+Date.now(),at:Date.now(),key:String(text),text:String(text||'')});};
 setInterval(function(){paint();next();},500);setInterval(poll,1800);setTimeout(poll,1200);
})();
