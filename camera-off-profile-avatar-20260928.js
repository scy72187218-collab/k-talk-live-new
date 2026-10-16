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
  {
    "id": "female1",
    "photo": "default-korean-woman-20261016.png",
    "label": "한국 여성"
  },
  {
    "id": "male1",
    "photo": "default-korean-man-20261016.png",
    "label": "한국 남성"
  },
  {
    "id": "dog",
    "photo": "default-animal-dog-20261016.png",
    "label": "강아지"
  },
  {
    "id": "cat",
    "photo": "default-animal-cat-20261016.png",
    "label": "고양이"
  },
  {
    "id": "tiger",
    "photo": "default-animal-tiger-20261016.png",
    "label": "호랑이"
  },
  {
    "id": "panda",
    "photo": "default-animal-panda-20261016.png",
    "label": "판다"
  },
  {
    "id": "car",
    "photo": "default-scene-car-20261016.png",
    "label": "자동차"
  },
  {
    "id": "castle",
    "photo": "default-scene-castle-20261016.png",
    "label": "성"
  },
  {
    "id": "yacht",
    "photo": "default-scene-yacht-20261016.png",
    "label": "요트"
  }
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
    try{return localStorage.getItem(photoStorageKey())||String(p.photo||'');}catch(e){return String(p.photo||'');}
  }
  function photoStorageKey(){return 'kt_camera_off_custom_photo:'+((typeof window.ktProfileStorageKey==='function'&&window.ktProfileStorageKey())||'local');}
  function safePhoto(url){url=String(url||'');return /^https:\/\//i.test(url)||(/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(url)&&url.length<=16000)?url:'';}
  function pickerStatus(text){var p=document.getElementById('ktCameraOffChoicePicker20260928'),s=p&&p.querySelector('[data-photo-status]');if(s)s.textContent=text;}
  function savePhoto(photo){
    if(!safePhoto(photo)){pickerStatus('사진을 준비하지 못했습니다. 다른 사진을 골라 주세요.');return;}
    try{localStorage.setItem(photoStorageKey(),photo);localStorage.setItem('kt_camera_off_choice_20260928','profile');}catch(e){pickerStatus('사진을 저장할 공간이 부족합니다.');return;}
    sendState(true,'profile');closePicker();
  }
  function preparePhoto(url){
    var image=new Image();image.onload=function(){
      try{var canvas=document.createElement('canvas'),size=192,encoded='';
        do{canvas.width=size;canvas.height=size;var ctx=canvas.getContext('2d'),scale=Math.max(size/image.width,size/image.height);ctx.drawImage(image,(size-image.width*scale)/2,(size-image.height*scale)/2,image.width*scale,image.height*scale);encoded=canvas.toDataURL('image/jpeg',.65);size-=32;}while(encoded.length>16000&&size>=64);
        savePhoto(encoded);
      }catch(e){if(/^https:\/\//i.test(url))savePhoto(url);else pickerStatus('사진을 읽지 못했습니다. 다른 사진을 골라 주세요.');}
    };image.onerror=function(){pickerStatus('사진을 읽지 못했습니다.');};image.src=url;
  }
  function pickPhoto(){
    var input=document.createElement('input');input.type='file';input.accept='image/*';
    input.onchange=function(){var f=input.files&&input.files[0];if(!f)return;if(!/^image\//i.test(f.type||'')||f.size>20*1024*1024){pickerStatus('20MB 이하의 사진 파일을 골라 주세요.');return;}var reader=new FileReader();reader.onload=function(){preparePhoto(String(reader.result||''));};reader.onerror=function(){pickerStatus('사진을 읽지 못했습니다.');};reader.readAsDataURL(f);};
    input.style.cssText='position:fixed;left:-9999px;width:1px;height:1px;opacity:0';document.body.appendChild(input);
    input.addEventListener('change',function(){setTimeout(function(){input.remove();},0);},{once:true});input.addEventListener('cancel',function(){input.remove();},{once:true});
    input.click();
  }
  function choiceId(){
    try{return localStorage.getItem('kt_camera_off_choice_20260928')||'female1';}catch(e){return 'female1';}
  }
  function choiceById(id){
    if(id==='female2')id='female1';if(id==='male2')id='male1';
    for(var i=0;i<CHOICES.length;i++)if(CHOICES[i].id===id)return CHOICES[i];
    return CHOICES[0];
  }
  function isHostLocal(){
    return !!document.querySelector(
      '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,#screen .ktsubscriber-room,#screen .ktsecret-room'
    )&&!document.querySelector('#screen .kt-remote-live')&&!document.documentElement.classList.contains('kt-remote-viewing');
  }
  function currentHost(){
    if(isHostLocal())return deviceId();
    var root=document.querySelector('#screen .kt-remote-live');var h=root&&root.getAttribute('data-kt-host-id')||'';if(h)return h;
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
    if(choice==='profile'&&safePhoto(photo)){
      return '<img src="'+photo.replace(/"/g,'&quot;')+'" alt="'+safeName+' 프로필">';
    }
    if(picked.photo)return '<img src="'+picked.photo+'" alt="'+picked.label+'">';
    return '<div class="kt-camera-off-face" style="background:'+picked.bg+'">'+picked.icon+'</div>';
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
    s.textContent+='.kt-camera-off-choice-picker-20260928{grid-template-columns:repeat(3,minmax(0,1fr))!important;max-height:70dvh!important;overflow:auto!important}.kt-camera-off-picker-head{grid-column:1/-1;display:flex;align-items:center;gap:8px}.kt-camera-off-picker-head button{height:38px!important;padding:0 10px!important}.kt-camera-off-picker-head b{font-size:12px!important}';
    s.textContent+=".kt-camera-off-choice-picker-20260928 button.kt-camera-off-preset{position:relative!important;height:100px!important;padding:0!important;display:block!important;overflow:hidden!important}.kt-camera-off-choice-picker-20260928 .kt-camera-off-preset-image{position:absolute!important;inset:0!important;display:block!important;width:100%!important;min-width:100%!important;height:100%!important;min-height:100%!important;max-height:none!important;object-fit:cover!important;object-position:center!important;border-radius:10px!important;flex:none!important;margin:0!important}.kt-camera-off-choice-picker-20260928 button.kt-camera-off-preset small{position:absolute!important;left:0!important;right:0!important;bottom:0!important;z-index:1!important;font-size:12px!important;line-height:18px!important;padding:2px!important;background:#0009!important}.kt-camera-off-avatar-20260928 img{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;aspect-ratio:auto!important;object-fit:cover!important;object-position:center!important;border-radius:0!important;border:0!important;box-shadow:none!important;max-width:none!important;max-height:none!important}.kt-camera-off-avatar-20260928 small{position:absolute!important;bottom:3px!important;left:3px!important;z-index:1!important}.kt-camera-off-avatar-20260928:after{content:none!important}";
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
    var selfStream=window.__ktApprovedGuestSelfStream;if(selfStream){document.querySelectorAll('#screen video').forEach(function(v){if(v.srcObject===selfStream){var t=v.closest('.ktg13-guest,.ktsubscriber-guest,.ktsecret-slot,.kgh-cell,.kt-approved-guest-cell,.kt-guest-room-cell');if(t)add(selfViewerId(),t);}});}
    var selfTile=document.querySelector(
      '#screen .kt-guest-hostlike-room .kgh-cell.self,'+
      '#screen .kt-approved-guest-grid .kt-approved-guest-cell.self,'+
      '#screen .kt-guest-room-grid .kt-guest-room-cell.self'
    );if(selfTile)add(selfViewerId(),selfTile);
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
        var html=avatarHtml(st.name||name,(id===self?photo:st.photo||''),id===self,st.choice||'female1');if(old.innerHTML!==html)old.innerHTML=html;
      }else if(old){
        old.remove();
      }
    });
  }

  async function sendState(off,choice){
    var host=currentHost(),participant=selfParticipant();
    if(!participant)return;
    choice=choice||choiceId();
    states[participant]={off:!!off,name:profileName(),choice:choice,photo:off&&choice==='profile'?safePhoto(profilePhoto()):'',at:Date.now()};
    render();
    if(!host)return;
    try{
      await fetch(BASE+'ktalk_live_messages',{
        method:'POST',
        headers:headers({Prefer:'return=minimal'}),
        body:JSON.stringify({
          host_id:host,
          sender_id:'camera:'+participant,
          sender_name:profileName(),
          message:JSON.stringify({participant:participant,off:!!off,name:profileName(),choice:choice,photo:off&&choice==='profile'?safePhoto(profilePhoto()):'',at:Date.now()}),
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
    var header=document.createElement('div');header.className='kt-camera-off-picker-head';
    var back=document.createElement('button');back.type='button';back.textContent='← 돌아가기';back.onclick=closePicker;header.appendChild(back);
    var title=document.createElement('b');title.textContent='카메라 대신 표시할 사진';header.appendChild(title);p.appendChild(header);
    var status=document.createElement('small');status.setAttribute('data-photo-status','');status.style.gridColumn='1 / -1';p.appendChild(status);
    var own=document.createElement('button');own.type='button';own.textContent='내 프로필 사진';own.onclick=function(){var photo=String(profile().photo||'');if(!photo){pickerStatus('등록된 프로필 사진이 없습니다. 사진첩에서 골라 주세요.');return;}preparePhoto(photo);};p.appendChild(own);
    var gallery=document.createElement('button');gallery.type='button';gallery.textContent='사진첩에서 고르기';gallery.onclick=pickPhoto;p.appendChild(gallery);
    var current=choiceId();
    CHOICES.forEach(function(ch){
      var b=document.createElement('button');
      b.type='button';
      b.className='kt-camera-off-preset'+(ch.id===current?' on':'');
      b.innerHTML='<img src="'+ch.photo+'" alt="'+ch.label+'" class="kt-camera-off-preset-image" loading="eager" decoding="async"><small>'+ch.label+'</small>';
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
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closePicker();});

  window.ktCameraOffAvatarState20260928=async function(off){
    var choice=choiceId();
    // Open locally before waiting for the camera-state request.
    if(off)openPicker();
    else closePicker();
    await sendState(!!off,choice);
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
            if(states[id]&&Number(states[id].at||0)>Number(d.at||0))return;
            states[id]={off:!!d.off,name:String(d.name||row.sender_name||'회원'),choice:String(d.choice||'female1'),photo:safePhoto(d.photo||''),at:Number(d.at||0)};
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