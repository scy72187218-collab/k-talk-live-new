/* K-Talk: camera off -> profile/avatar instead of black video.
   Host + approved guests, all live rooms. No gender-based appearance rules. */
(function(){
  if(window.__ktCameraOffProfileAvatar20260928)return;
  window.__ktCameraOffProfileAvatar20260928=true;

  var REF='zupwbfmacwzexyvznlzq';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var BASE='https://'+REF+'.supabase.co/rest/v1/';
  var states={};
  var polling=false;
  var CHOICES=[
    {id:'female1',icon:'👩🏻',label:'여성 캐릭터 1',bg:'linear-gradient(145deg,#ffd9ea,#f4b6d0)'},
    {id:'female2',icon:'👩🏽',label:'여성 캐릭터 2',bg:'linear-gradient(145deg,#ffe5c6,#d9b48f)'},
    {id:'male1',icon:'👨🏻',label:'남성 캐릭터 1',bg:'linear-gradient(145deg,#d9e7ff,#a8c2ee)'},
    {id:'male2',icon:'👨🏽',label:'남성 캐릭터 2',bg:'linear-gradient(145deg,#d6d7ff,#a9abe8)'},
    {id:'stage',icon:'🌃',label:'배경 화면',bg:'linear-gradient(145deg,#17213d,#5c3f82)'}
  ];

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    return id;
  }
  function selfViewerId(){
    var d=deviceId();return d?'viewer_'+d:'';
  }
  function profile(){
    try{if(typeof window.ktProfileLoad==='function')return window.ktProfileLoad()||{};}catch(e){}
    return {};
  }
  function profileName(){
    var p=profile();
    return String(p.nickname||p.name||p.displayName||'회원').slice(0,40);
  }
  function profilePhoto(){
    var p=profile();
    return String(p.photo||'');
  }
  function choiceId(){
    try{return localStorage.getItem('kt_camera_off_choice_20260928')||'female1';}catch(e){return 'female1';}
  }
  function choiceById(id){
    for(var i=0;i<CHOICES.length;i++)if(CHOICES[i].id===id)return CHOICES[i];
    return CHOICES[0];
  }
  function isHostLocal(){
    return !!document.querySelector(
      '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,#screen .ktsubscriber-room,#screen .ktsecret-room'
    )&&!document.documentElement.classList.contains('kt-remote-viewing');
  }
  function currentHost(){
    if(isHostLocal())return deviceId();
    var h='';
    try{h=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||sessionStorage.getItem('kt_remote_host_id')||'').trim();}catch(e){}
    return h;
  }
  function selfParticipant(){
    return isHostLocal()?'host':selfViewerId();
  }

  function avatarHtml(name,photo,isSelf,choice){
    var safeName=String(name||'회원').replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
    var picked=choiceById(choice||choiceId());
    if(isSelf&&choice==='profile'&&photo){
      return '<img src="'+photo.replace(/"/g,'&quot;')+'" alt="'+safeName+' 프로필"><small>'+safeName+'</small>';
    }
    return '<div class="kt-camera-off-face" style="background:'+picked.bg+'">'+picked.icon+'</div><small>'+picked.label+'</small>';
  }

  function style(){
    if(document.getElementById('ktCameraOffAvatarStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktCameraOffAvatarStyle20260928';
    s.textContent=''
      +'.kt-camera-off-avatar-20260928{position:absolute!important;inset:0!important;z-index:34!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:5px!important;background:linear-gradient(145deg,#1b1b22,#0d0d12)!important;pointer-events:none!important;overflow:hidden!important}'
      +'.kt-camera-off-avatar-20260928 img{width:58%!important;height:auto!important;aspect-ratio:1/1!important;object-fit:cover!important;border-radius:50%!important;border:2px solid rgba(255,255,255,.55)!important;box-shadow:0 0 18px rgba(255,255,255,.14)!important}'
      +'.kt-camera-off-avatar-20260928 .kt-camera-off-face{width:min(54%,92px)!important;aspect-ratio:1/1!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:linear-gradient(145deg,#ffdd9b,#ffc7da)!important;font-size:clamp(30px,9vw,62px)!important;border:2px solid rgba(255,255,255,.55)!important;box-shadow:0 0 18px rgba(255,255,255,.14)!important}'
      +'.kt-camera-off-avatar-20260928 small{font-size:10px!important;font-weight:950!important;color:#fff!important;background:rgba(0,0,0,.55)!important;border-radius:999px!important;padding:3px 7px!important}'
      +'.kt-camera-off-avatar-20260928:after{content:"카메라 꺼짐";font-size:8px!important;font-weight:900!important;color:#ddd!important}'
      +'.kt-camera-off-choice-picker-20260928{position:fixed!important;left:50%!important;bottom:max(16px,calc(env(safe-area-inset-bottom) + 10px))!important;transform:translateX(-50%)!important;z-index:2147483646!important;width:min(94vw,520px)!important;padding:10px!important;border-radius:18px!important;background:rgba(10,10,14,.97)!important;border:1px solid rgba(255,255,255,.2)!important;box-shadow:0 12px 40px rgba(0,0,0,.6)!important;display:grid!important;grid-template-columns:repeat(5,minmax(0,1fr))!important;gap:6px!important}'
      +'.kt-camera-off-choice-picker-20260928 button{min-width:0!important;height:72px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:13px!important;background:#1c1c22!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:4px!important;font-weight:900!important;touch-action:manipulation!important}'
      +'.kt-camera-off-choice-picker-20260928 button b{font-size:29px!important;line-height:1!important}.kt-camera-off-choice-picker-20260928 button small{font-size:7px!important;line-height:1.1!important;text-align:center!important;color:#fff!important}'
      +'.kt-camera-off-choice-picker-20260928 button.on{border-color:#ffd75a!important;box-shadow:0 0 12px #ffd75a55!important;background:#29231a!important}';
    document.head.appendChild(s);
  }

  function tileMap(){
    var out={};
    function add(id,el){if(id&&el)out[id]=el;}
    add('host',document.querySelector(
      '#screen .ktsolo-room .ktsolo-main,'+
      '#screen .ktg13-room .ktg13-host,'+
      '#screen .ktg9-room .ktg9-host,'+
      '#screen .ktsubscriber-room .ktsubscriber-host,'+
      '#screen .ktsecret-room .ktsecret-slot.host,'+
      '#screen .ktsecret-room .ktsecret-host,'+
      '#screen .kt-guest-hostlike-room .kgh-cell.host,'+
      '#screen .kt-approved-guest-grid .kt-approved-guest-cell.host,'+
      '#screen .kt-guest-room-grid .kt-guest-room-cell.host'
    ));
    document.querySelectorAll(
      '#screen [data-kt-guest-viewer-id],'+
      '#screen [data-kt-direct-guest],'+
      '#screen [data-kt-peer-viewer]'
    ).forEach(function(el){
      var d=el.dataset||{};
      add(String(d.ktGuestViewerId||d.ktDirectGuest||d.ktPeerViewer||''),el);
    });
    add(selfViewerId(),document.querySelector(
      '#screen .kt-guest-hostlike-room .kgh-cell.self,'+
      '#screen .kt-approved-guest-grid .kt-approved-guest-cell.self,'+
      '#screen .kt-guest-room-grid .kt-guest-room-cell.self'
    ));
    return out;
  }

  function render(){
    style();
    var map=tileMap(),self=selfParticipant(),photo=profilePhoto(),name=profileName();

    Object.keys(map).forEach(function(id){
      var tile=map[id];if(!tile)return;
      try{tile.style.setProperty('position','relative','important');}catch(e){}
      var old=tile.querySelector(':scope > .kt-camera-off-avatar-20260928');
      var st=states[id]||null;
      if(st&&st.off){
        if(!old){
          old=document.createElement('div');
          old.className='kt-camera-off-avatar-20260928';
          tile.appendChild(old);
        }
        old.innerHTML=avatarHtml(st.name||name,(id===self?photo:''),id===self,st.choice||'female1');
      }else if(old){
        old.remove();
      }
    });
  }

  async function sendState(off,choice){
    var host=currentHost(),participant=selfParticipant();
    if(!host||!participant)return;
    choice=choice||choiceId();
    states[participant]={off:!!off,name:profileName(),choice:choice,at:Date.now()};
    render();
    try{
      await fetch(BASE+'ktalk_live_messages',{
        method:'POST',
        headers:headers({Prefer:'return=minimal'}),
        body:JSON.stringify({
          host_id:host,
          sender_id:'camera:'+participant,
          sender_name:profileName(),
          message:JSON.stringify({participant:participant,off:!!off,name:profileName(),choice:choice,at:Date.now()}),
          message_type:'camera_state'
        })
      });
    }catch(e){}
  }

  function closePicker(){
    var old=document.getElementById('ktCameraOffChoicePicker20260928');
    if(old)old.remove();
  }

  function openPicker(){
    closePicker();
    var p=document.createElement('div');
    p.id='ktCameraOffChoicePicker20260928';
    p.className='kt-camera-off-choice-picker-20260928';
    var current=choiceId();
    CHOICES.forEach(function(ch){
      var b=document.createElement('button');
      b.type='button';
      b.className=ch.id===current?'on':'';
      b.innerHTML='<b>'+ch.icon+'</b><small>'+ch.label+'</small>';
      b.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        try{localStorage.setItem('kt_camera_off_choice_20260928',ch.id);}catch(_e){}
        p.querySelectorAll('button').forEach(function(x){x.classList.remove('on');});
        b.classList.add('on');
        sendState(true,ch.id);
        setTimeout(closePicker,220);
      };
      p.appendChild(b);
    });
    document.body.appendChild(p);
  }

  window.ktCameraOffChoicePicker20260928=openPicker;

  window.ktCameraOffAvatarState20260928=async function(off){
    var choice=choiceId();
    await sendState(!!off,choice);
    if(off)setTimeout(openPicker,30);
    else closePicker();
  };

  async function poll(){
    if(polling)return;
    var host=currentHost();if(!host)return;
    polling=true;
    try{
      var rows=await fetch(
        BASE+'ktalk_live_messages?select=id,sender_name,message,created_at&host_id=eq.'+enc(host)+
        '&message_type=eq.camera_state&order=created_at.desc&limit=80',
        {cache:'no-store',headers:headers()}
      );
      if(rows&&rows.ok){
        var list=await rows.json(),latest={};
        (list||[]).forEach(function(row){
          try{
            var d=JSON.parse(String(row.message||'{}'));
            var id=String(d.participant||'');
            if(!id||latest[id])return;
            latest[id]=1;
            states[id]={off:!!d.off,name:String(d.name||row.sender_name||'회원'),choice:String(d.choice||'female1'),at:Number(d.at||0)};
          }catch(e){}
        });
      }
    }catch(e){}
    polling=false;
    render();
  }

  style();
  render();
  poll();
  [100,350,800,1600].forEach(function(ms){setTimeout(function(){render();poll();},ms);});
  setInterval(poll,800);
  setInterval(render,500);
})();