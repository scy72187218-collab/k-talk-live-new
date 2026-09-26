/* K-Talk: host-photo like + ON AIR heart for all 5 live rooms (2026-09-27)
   1인/9명/13명/구독자/비밀방 공통.
   A viewer tap is a LIKE only. It does not spend/send viewer roses.
   Company milestone rewards are granted on the host side by addHostLike:
   5,000 / 10,000 / 15,000 / 20,000 / 25,000 -> company rose 1 each, then stop. */
(function(){
  if(window.__ktAllRoomHostLikeHeart20260927)return;
  window.__ktAllRoomHostLikeHeart20260927=true;

  var BASE='',KEY='',seen={},polling=false;
  var MILESTONES=[5000,10000,15000,20000,25000];

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }

  function senderName(){
    try{
      var p=window.ktProfileLoad?window.ktProfileLoad():null;
      if(p&&(p.nickname||p.name||p.displayName))return String(p.nickname||p.name||p.displayName);
    }catch(e){}
    try{return localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_nickname')||'K-Talk 회원';}catch(e){}
    return 'K-Talk 회원';
  }

  async function config(){
    if(BASE&&KEY)return true;
    try{
      var r=await fetch('live-presence.js?v=20260926-followstatus16',{cache:'no-store'});
      if(!r.ok)return false;
      var t=await r.text();
      var b=t.match(/var BASE='([^']+)'/),k=t.match(/var KEY='([^']+)'/);
      if(!b||!k)return false;
      BASE=b[1];KEY=k[1];return true;
    }catch(e){return false;}
  }

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }

  async function req(path,opt){
    if(!(await config()))throw new Error('like config');
    opt=opt||{};opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('like api '+r.status);
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }

  function enc(v){return encodeURIComponent(String(v==null?'':v));}

  function isHostRoom(){
    return !!document.querySelector(
      '.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'
    );
  }

  async function currentRemoteHostId(){
    try{
      var vid='viewer_'+deviceId();
      var rows=await req(
        'ktalk_live_viewers?select=host_id&viewer_id=eq.'+enc(vid)+
        '&active=eq.true&order=updated_at.desc&limit=1'
      );
      return rows&&rows[0]?String(rows[0].host_id||''):'';
    }catch(e){return '';}
  }

  function currentCount(){
    try{
      var a=document.getElementById('hostLikeCount');
      if(a){
        var n=parseInt(String(a.textContent||'0').replace(/[^0-9]/g,''),10)||0;
        return Math.min(25000,n);
      }
    }catch(e){}
    return 0;
  }

  function syncHeartCount(){
    var n=currentCount();
    document.querySelectorAll('.kt-air-like-count').forEach(function(el){
      el.textContent=n.toLocaleString('ko-KR');
    });
  }

  function pulse(){
    try{
      var b=document.querySelector('.kt-air-like-heart');
      if(!b)return;
      b.classList.remove('pop');
      void b.offsetWidth;
      b.classList.add('pop');
      setTimeout(function(){b.classList.remove('pop');},240);
    }catch(e){}
  }

  function localLike(count){
    var n=parseInt(count,10)||1;
    if(n<1)n=1;
    try{
      if(typeof window.addHostLike==='function')window.addHostLike(n);
    }catch(e){}
    setTimeout(syncHeartCount,0);
    pulse();
  }

  async function sendViewerLike(){
    try{
      var host=await currentRemoteHostId();
      if(!host)return;
      await req('ktalk_live_messages',{
        method:'POST',
        headers:{Prefer:'return=minimal'},
        body:JSON.stringify({
          host_id:host,
          sender_id:'like:'+deviceId(),
          sender_name:senderName(),
          message:JSON.stringify({count:1,source:'host_photo'}),
          message_type:'host_like'
        })
      });
      pulse();
    }catch(e){}
  }

  function tapLike(){
    if(isHostRoom())localLike(1);
    else sendViewerLike();
  }
  window.ktTapHostLike20260927=tapLike;

  function ensureStyle(){
    if(document.getElementById('ktAllRoomHostLikeHeartStyle20260927'))return;
    var s=document.createElement('style');
    s.id='ktAllRoomHostLikeHeartStyle20260927';
    s.textContent=''
      +'.kt-air-like-heart{margin-left:7px!important;min-width:55px!important;height:28px!important;padding:0 8px!important;border:1px solid #ff5a9b99!important;border-radius:999px!important;background:rgba(39,8,28,.86)!important;color:#fff!important;display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:4px!important;font-weight:950!important;font-size:14px!important;line-height:1!important;pointer-events:auto!important;touch-action:manipulation!important;box-shadow:0 0 10px #ff3b8b44!important}'
      +'.kt-air-like-heart .kt-air-like-count{font-size:9px!important;color:#fff!important;min-width:15px!important;text-align:left!important}'
      +'.kt-air-like-heart.pop{animation:ktLikePop20260927 .22s ease!important}'
      +'@keyframes ktLikePop20260927{0%{transform:scale(1)}50%{transform:scale(1.25)}100%{transform:scale(1)}}'
      +'.kt-allhost-profile{pointer-events:none!important}'
      +'.kt-allhost-profile .kt-allhost-photo,.kt-allhost-profile .kt-allhost-fallback{pointer-events:auto!important;touch-action:manipulation!important;cursor:pointer!important}';
    document.head.appendChild(s);
  }

  function ensureHeart(){
    ensureStyle();
    var clock=document.getElementById('ktLiveClock');
    if(!clock||!clock.parentElement)return;
    var row=clock.parentElement;
    if(row.querySelector('.kt-air-like-heart')){syncHeartCount();return;}
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-air-like-heart';
    b.setAttribute('aria-label','호스트 좋아요');
    b.innerHTML='💗 <span class="kt-air-like-count">'+currentCount().toLocaleString('ko-KR')+'</span>';
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(x){}
      tapLike();
    };
    if(clock.nextSibling)row.insertBefore(b,clock.nextSibling);
    else row.appendChild(b);
  }

  function bindHostPhotos(root){
    root=root||document;
    var list=[];
    try{
      if(root.matches&&root.matches('.kt-allhost-photo,.kt-allhost-fallback'))list.push(root);
      if(root.querySelectorAll)list=list.concat([].slice.call(root.querySelectorAll('.kt-allhost-photo,.kt-allhost-fallback')));
    }catch(e){}
    list.forEach(function(el){
      if(!el||el.dataset.ktHostLikeBound20260927==='1')return;
      el.dataset.ktHostLikeBound20260927='1';
      el.setAttribute('title','좋아요 +1');
      el.addEventListener('click',function(e){
        try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
        tapLike();
      },true);
    });
  }

  async function pollHostLikes(){
    if(polling||!isHostRoom())return;
    polling=true;
    try{
      var host=deviceId();
      var since=new Date(Date.now()-12000).toISOString();
      var rows=await req(
        'ktalk_live_messages?select=id,sender_id,sender_name,message,created_at&host_id=eq.'+enc(host)+
        '&message_type=eq.host_like&created_at=gte.'+enc(since)+
        '&order=created_at.asc&limit=100'
      );
      (rows||[]).forEach(function(row){
        var id=String(row.id||'');
        if(!id||seen[id])return;
        seen[id]=1;
        var n=1;
        try{var d=JSON.parse(String(row.message||'{}'));n=parseInt(d.count,10)||1;}catch(e){}
        localLike(Math.max(1,Math.min(20,n)));
      });
    }catch(e){}
    polling=false;
  }

  function install(){
    ensureHeart();
    bindHostPhotos(document);
    syncHeartCount();
  }

  install();
  [80,200,500,1000,1800,3000].forEach(function(ms){setTimeout(install,ms);});
  setInterval(function(){install();pollHostLikes();},900);

  try{
    new MutationObserver(function(records){
      records.forEach(function(r){
        [].slice.call(r.addedNodes||[]).forEach(function(n){
          if(n&&n.nodeType===1)bindHostPhotos(n);
        });
      });
      clearTimeout(window.__ktHostLikeInstallTimer20260927);
      window.__ktHostLikeInstallTimer20260927=setTimeout(install,35);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('pageshow',install);
  window.addEventListener('focus',install);
})();
