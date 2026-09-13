/* K-Talk 보물상자 전용: 다른 방 UI/버튼은 건드리지 않고 보물상자 알림·방입장·받기만 연결. */
(function(){
  if(window.__ktGlobalTreasureRoomInstalled)return;
  window.__ktGlobalTreasureRoomInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var latestEvents=[];
  var pollTimer=null;
  var viewerEventId='';
  var settling={};

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  async function req(path,opt){
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('treasure api '+r.status);
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }
  async function rpc(name,body){
    return req('rpc/'+name,{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify(body||{})});
  }
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function deviceId(){
    var id='';try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('kt_live_device_id',id);}catch(e){}}
    return id;
  }
  function profile(){
    var p={name:'K-Talk 회원'};
    try{if(window.ktProfileLoad){var x=window.ktProfileLoad()||{};p.name=String(x.name||p.name);}}catch(e){}
    try{
      var sub=window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'';
      if(sub&&window.ktSubProfileCard){var s=window.ktSubProfileCard(sub)||{};p.name=String(s.name||p.name);}
    }catch(e){}
    try{p.name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||p.name;}catch(e){}
    return p;
  }
  function roomType(){try{return String((window.state&&state.liveRoomType)||'solo');}catch(e){return 'solo';}}
  function now(){return Date.now();}
  function ms(iso){var n=Date.parse(iso||'');return isNaN(n)?0:n;}
  function fmt(left){
    var s=Math.max(0,Math.ceil(left/1000)),m=Math.floor(s/60);s%=60;
    return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }
  function eventById(id){return latestEvents.find(function(e){return String(e.id)===String(id);})||null;}

  function ensureStyle(){
    if(document.getElementById('ktGlobalTreasureRoomStyle'))return;
    var s=document.createElement('style');s.id='ktGlobalTreasureRoomStyle';
    s.textContent=''
      +'.kt-global-treasure-alert{position:fixed;left:50%;top:76px;transform:translateX(-50%);z-index:99990;width:min(92vw,430px);min-height:42px;border:2px solid #ff2fc5;border-radius:18px;background-color:#120712;background-image:radial-gradient(circle,#ff35ce 1.5px,transparent 2px);background-size:9px 9px;box-shadow:0 0 10px #ff2fc5,0 0 24px #ff2fc577;color:#ffe047;font:950 13px/1.2 system-ui,-apple-system,"Noto Sans KR",sans-serif;padding:7px 12px;display:flex;align-items:center;justify-content:center;gap:7px;text-align:center;touch-action:manipulation}'
      +'.kt-global-treasure-alert b{color:#fff}.kt-global-treasure-alert .chest{font-size:23px;filter:drop-shadow(0 0 6px #ffb000)}.kt-global-treasure-alert .time{color:#7ff7ff}'
      +'.kt-global-treasure-hostbadge{position:absolute!important;right:6px!important;top:28px!important;z-index:80!important;width:56px!important;min-height:58px!important;border:1px solid #ffd45b!important;border-radius:16px!important;background:rgba(26,16,5,.92)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:1px!important;padding:4px 3px!important;box-shadow:0 0 10px #ffb00099!important;font:950 9px/1.05 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;touch-action:manipulation!important}'
      +'.kt-global-treasure-hostbadge .ico{font-size:25px!important;line-height:1!important}.kt-global-treasure-hostbadge strong{font-size:9px!important;color:#ffe052!important}.kt-global-treasure-hostbadge small{font-size:8px!important;color:#fff!important}.kt-global-treasure-hostbadge.ready{animation:ktTreasurePulse .8s ease-in-out infinite alternate!important}'
      +'@keyframes ktTreasurePulse{from{box-shadow:0 0 8px #ffb00099}to{box-shadow:0 0 20px #ffe500}}'
      +'.kt-global-treasure-viewbadge{position:absolute!important;right:10px!important;top:76px!important;z-index:20!important;width:66px!important;min-height:72px!important;border:2px solid #ffd45b!important;border-radius:18px!important;background:rgba(26,16,5,.92)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;padding:5px!important;box-shadow:0 0 13px #ffb00099!important;font:950 10px/1.05 system-ui,-apple-system,"Noto Sans KR",sans-serif!important}'
      +'.kt-global-treasure-viewbadge .ico{font-size:31px!important}.kt-global-treasure-viewbadge strong{color:#ffe052!important}.kt-global-treasure-viewbadge.ready{animation:ktTreasurePulse .8s ease-in-out infinite alternate!important}'
      +'.kt-global-treasure-led{cursor:pointer!important}'
      +'@media(max-width:390px){.kt-global-treasure-alert{top:68px;font-size:12px;padding:6px 9px}.kt-global-treasure-hostbadge{width:51px!important;min-height:54px!important;right:4px!important}.kt-global-treasure-viewbadge{width:60px!important;min-height:66px!important;right:7px!important}}';
    document.head.appendChild(s);
  }

  function localMarker(localId){try{return localStorage.getItem('ktalk_treasure_global_id:'+String(localId||''))||'';}catch(e){return '';}}
  function saveLocalMarker(localId,id){try{localStorage.setItem('ktalk_treasure_global_id:'+String(localId||''),String(id||''));}catch(e){}}

  async function publishLocalTreasure(t){
    if(!t||!t.id||localMarker(t.id))return;
    var p=profile(),hid=deviceId();
    try{
      var out=await rpc('ktalk_publish_treasure',{
        p_local_id:String(t.id),
        p_host_id:hid,
        p_host_name:p.name||'K-Talk 방송자',
        p_room_title:String(t.roomTitle||((window.state&&(state.currentLiveRoomTitle||state.liveRoomName))||'K-Talk LIVE')),
        p_room_type:roomType(),
        p_amount:Math.max(1,parseInt(t.amount||50,10)||50),
        p_unlock_at:new Date(Number(t.unlockAt||Date.now()+150000)).toISOString()
      });
      var id=Array.isArray(out)?out[0]:out;
      if(id&&typeof id==='object')id=id.ktalk_publish_treasure||id.id||'';
      if(id){saveLocalMarker(t.id,id);refreshEvents();}
    }catch(e){}
  }

  function installPublishWraps(){
    var place=window.placeTreasureChest;
    if(typeof place==='function'&&!place.__ktGlobalTreasureWrapped){
      var wrapped=function(){
        var before=null;try{before=window.ktGetTreasure?ktGetTreasure():null;}catch(e){}
        var r=place.apply(this,arguments);
        setTimeout(function(){
          try{
            var after=window.ktGetTreasure?ktGetTreasure():null;
            if(after&&(!before||String(after.id)!==String(before.id)))publishLocalTreasure(after);
          }catch(e){}
        },60);
        return r;
      };
      wrapped.__ktGlobalTreasureWrapped=true;window.placeTreasureChest=wrapped;
    }
    var next=window.ktStartNextTreasure;
    if(typeof next==='function'&&!next.__ktGlobalTreasureWrapped){
      var wrappedNext=function(){
        var r=next.apply(this,arguments);
        setTimeout(function(){try{var t=window.ktGetTreasure?ktGetTreasure():null;if(t)publishLocalTreasure(t);}catch(e){}},80);
        return r;
      };
      wrappedNext.__ktGlobalTreasureWrapped=true;window.ktStartNextTreasure=wrappedNext;
    }
  }

  async function fetchEvents(){
    try{
      var iso=new Date().toISOString();
      var path='ktalk_treasure_events?select=id,local_id,host_id,host_name,room_title,room_type,amount,placed_at,unlock_at,claim_close_at,active,settled&active=eq.true&claim_close_at=gt.'+enc(iso)+'&order=placed_at.desc&limit=8';
      var rows=await req(path);
      latestEvents=Array.isArray(rows)?rows:[];
    }catch(e){latestEvents=[];}
    return latestEvents;
  }

  function roomRoot(){return document.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.ktg9-room');}
  function hostBox(root){
    if(!root)return null;
    return root.querySelector('.ktsolo-main,.ktg13-host,.ktsubscriber-host,.ktsecret-host,.ktg9-host')||root;
  }
  function roomLed(root){
    if(!root)return null;
    return root.querySelector('.ktsolo-led-track span,.ktg13-led-track span,.ktsubscriber-led-track span,.ktsecret-led-track span,.ktg9-led-track span');
  }
  function ownEvent(){var hid=deviceId();return latestEvents.find(function(e){return String(e.host_id)===hid;})||null;}

  function restoreLed(){
    document.querySelectorAll('[data-kt-treasure-led-original]').forEach(function(el){
      if(el.dataset.ktTreasureLedOriginal!=null)el.innerHTML=el.dataset.ktTreasureLedOriginal;
      delete el.dataset.ktTreasureLedOriginal;delete el.dataset.ktTreasureEventId;
      var p=el.parentElement;if(p)p.classList.remove('kt-global-treasure-led');
    });
  }
  function paintOwnRoom(ev){
    var root=roomRoot();
    if(!root||!ev){
      var old=document.getElementById('ktGlobalTreasureHostBadge');if(old)old.remove();
      restoreLed();return;
    }
    var box=hostBox(root);if(!box)return;
    var b=document.getElementById('ktGlobalTreasureHostBadge');
    if(!b){b=document.createElement('button');b.type='button';b.id='ktGlobalTreasureHostBadge';b.className='kt-global-treasure-hostbadge';box.appendChild(b);}
    if(b.parentElement!==box)box.appendChild(b);
    b.dataset.eventId=ev.id;
    var left=ms(ev.unlock_at)-now(),ready=left<=0;
    b.classList.toggle('ready',ready);
    b.innerHTML='<span class="ico">🎁</span><strong>'+ev.amount+'개</strong><small>'+(ready?'지금 열림':fmt(left))+'</small>';
    var led=roomLed(root);
    if(led){
      if(led.dataset.ktTreasureLedOriginal==null)led.dataset.ktTreasureLedOriginal=led.innerHTML;
      led.dataset.ktTreasureEventId=ev.id;
      led.innerHTML='🎁 보물상자 '+ev.amount+'개 떴습니다 · '+(ready?'지금 받기':'열림 '+fmt(left))+' · 눌러서 참여';
      if(led.parentElement)led.parentElement.classList.add('kt-global-treasure-led');
    }
  }

  function isViewing(ev){return !!(ev&&viewerEventId&&String(viewerEventId)===String(ev.id)&&document.querySelector('.kt-remote-live'));}
  function paintViewerBadge(){
    var ev=eventById(viewerEventId),root=document.querySelector('.kt-remote-live');
    var old=document.getElementById('ktGlobalTreasureViewBadge');
    if(!ev||!root){if(old)old.remove();return;}
    var b=old;
    if(!b){b=document.createElement('button');b.type='button';b.id='ktGlobalTreasureViewBadge';b.className='kt-global-treasure-viewbadge';root.appendChild(b);}
    if(b.parentElement!==root)root.appendChild(b);
    b.dataset.eventId=ev.id;
    var left=ms(ev.unlock_at)-now(),ready=left<=0;
    b.classList.toggle('ready',ready);
    var joined=false;try{joined=localStorage.getItem('ktalk_treasure_joined:'+ev.id)==='1';}catch(e){}
    b.innerHTML='<span class="ico">🎁</span><strong>'+ev.amount+'개</strong><small>'+(joined?'참여완료':(ready?'지금 받기':fmt(left)))+'</small>';
  }

  function paintGlobalAlert(){
    ensureStyle();
    var hid=deviceId();
    var inOwnRoom=!!roomRoot();
    var available=latestEvents.filter(function(ev){
      if(!ev)return false;
      if(inOwnRoom&&String(ev.host_id)===hid)return false;
      if(isViewing(ev))return false;
      return true;
    }).slice(0,3);
    var keep={};
    var small=false;
    try{small=!!(window.matchMedia&&window.matchMedia('(max-width:390px)').matches);}catch(e){}
    var baseTop=small?68:76;
    available.forEach(function(ev,i){
      var id='ktGlobalTreasureAlert_'+String(ev.id).replace(/[^a-zA-Z0-9_-]/g,'');
      keep[id]=1;
      var a=document.getElementById(id);
      if(!a){
        a=document.createElement('button');
        a.type='button';
        a.id=id;
        a.className='kt-global-treasure-alert';
        document.body.appendChild(a);
      }
      a.style.setProperty('top',(baseTop+(i*58))+'px','important');
      a.dataset.eventId=ev.id;
      var left=ms(ev.unlock_at)-now(),ready=left<=0;
      a.innerHTML='<span class="chest">🎁</span><span><b>'+String(ev.host_name||'호스트')+' 방</b> 보물상자 '+ev.amount+'개 떴습니다<br><span class="time">'+(ready?'지금 받으러 가기':'열림까지 '+fmt(left))+'</span> · 눌러서 방송방 입장</span>';
    });
    document.querySelectorAll('.kt-global-treasure-alert').forEach(function(a){
      if(!keep[a.id])a.remove();
    });
  }

  async function enterEvent(id){
    var ev=eventById(id);
    if(!ev){await fetchEvents();ev=eventById(id);}
    if(!ev)return;
    if(String(ev.host_id)===deviceId()){
      var b=document.getElementById('ktGlobalTreasureHostBadge');
      if(b){b.classList.add('ready');setTimeout(function(){b.classList.remove('ready');},900);}
      return;
    }
    viewerEventId=ev.id;
    try{sessionStorage.setItem('ktalk_treasure_viewing_event',ev.id);}catch(e){}
    try{
      if(typeof window.ktEnterRemoteLive==='function'){
        await Promise.resolve(window.ktEnterRemoteLive(ev.host_id));
        setTimeout(paintViewerBadge,150);
        return;
      }
    }catch(e){}
    try{if(window.goToTreasureRoom)window.goToTreasureRoom();}catch(e){}
  }

  async function settleAndReward(ev){
    if(!ev||settling[ev.id])return;
    settling[ev.id]=true;
    try{
      await rpc('ktalk_settle_treasure',{p_event_id:ev.id});
      var viewer='viewer_'+deviceId();
      var out=await rpc('ktalk_treasure_my_reward',{p_event_id:ev.id,p_viewer_id:viewer});
      var row=Array.isArray(out)?out[0]:out;
      if(row&&row.settled){
        var reward=parseInt(row.reward||0,10)||0;
        var seen='';try{seen=localStorage.getItem('ktalk_treasure_reward_seen:'+ev.id)||'';}catch(e){}
        if(!seen){
          try{localStorage.setItem('ktalk_treasure_reward_seen:'+ev.id,'1');}catch(e){}
          if(reward>0){
            var total=0;try{total=parseInt(localStorage.getItem('ktalk_treasure_roses')||'0',10)||0;localStorage.setItem('ktalk_treasure_roses',String(total+reward));}catch(e){}
            alert('🎉 보물상자에서 장미 '+reward+'송이를 받았습니다!');
          }
        }
      }
    }catch(e){}finally{delete settling[ev.id];}
  }

  async function claimEvent(id){
    var ev=eventById(id);if(!ev){await fetchEvents();ev=eventById(id);}if(!ev)return;
    var left=ms(ev.unlock_at)-now();
    if(left>0){alert('🎁 아직 '+fmt(left)+' 남았습니다.');return;}
    if(now()>=ms(ev.claim_close_at)){alert('이 보물상자는 마감되었습니다.');return;}
    var p=profile(),viewer='viewer_'+deviceId();
    try{
      var out=await rpc('ktalk_claim_treasure',{p_event_id:ev.id,p_viewer_id:viewer,p_viewer_name:p.name||'K-Talk 회원'});
      var row=Array.isArray(out)?out[0]:out;
      if(row&&row.ok){
        try{localStorage.setItem('ktalk_treasure_joined:'+ev.id,'1');}catch(e){}
        paintViewerBadge();
        alert('🎁 보물상자 참여 완료! 시간이 끝나면 장미가 나눠집니다.');
        var delay=Math.max(600,ms(ev.claim_close_at)-now()+700);
        setTimeout(function(){settleAndReward(ev);},delay);
      }else if(row&&row.state==='waiting')alert('아직 보물상자가 열리지 않았습니다.');
      else if(row&&row.state==='full')alert('보물상자 참여 인원이 다 찼습니다.');
      else alert('보물상자가 마감되었습니다.');
    }catch(e){}
  }

  document.addEventListener('click',function(e){
    var t=e.target;if(!t||!t.closest)return;
    var a=t.closest('.kt-global-treasure-alert');
    if(a){e.preventDefault();e.stopPropagation();enterEvent(a.dataset.eventId);return;}
    var v=t.closest('#ktGlobalTreasureViewBadge');
    if(v){e.preventDefault();e.stopPropagation();claimEvent(v.dataset.eventId);return;}
    var h=t.closest('#ktGlobalTreasureHostBadge');
    if(h){
      e.preventDefault();e.stopPropagation();
      var ev=eventById(h.dataset.eventId);if(ev){var left=ms(ev.unlock_at)-now();alert('🎁 보물상자 '+ev.amount+'개 · '+(left<=0?'지금 열렸습니다.':'열림까지 '+fmt(left)));}
      return;
    }
    var led=t.closest('.kt-global-treasure-led');
    if(led){
      var span=led.querySelector('[data-kt-treasure-event-id]');
      if(span&&String((eventById(span.dataset.ktTreasureEventId)||{}).host_id)!==deviceId())enterEvent(span.dataset.ktTreasureEventId);
    }
  },true);

  async function refreshEvents(){
    installPublishWraps();
    try{var local=window.ktGetTreasure?ktGetTreasure():null;if(local)publishLocalTreasure(local);}catch(e){}
    await fetchEvents();
    paintOwnRoom(ownEvent());
    paintGlobalAlert();
    paintViewerBadge();
    latestEvents.forEach(function(ev){
      var joined=false;try{joined=localStorage.getItem('ktalk_treasure_joined:'+ev.id)==='1';}catch(e){}
      if(joined&&now()>=ms(ev.claim_close_at))settleAndReward(ev);
    });
  }

  try{viewerEventId=sessionStorage.getItem('ktalk_treasure_viewing_event')||'';}catch(e){}
  ensureStyle();
  installPublishWraps();
  setTimeout(refreshEvents,350);
  pollTimer=setInterval(refreshEvents,1400);
  setInterval(function(){paintOwnRoom(ownEvent());paintGlobalAlert();paintViewerBadge();},500);
})();