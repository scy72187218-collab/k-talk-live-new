/* K-Talk approved guest bottom camera/mic controls.
   Shows only to the approved guest in live rooms.
   Does not change host/viewer controls, layout, transport, or room structure. */
(function(){
  if(window.__ktGuestBottomCameraMic20260928)return;
  window.__ktGuestBottomCameraMic20260928=true;

  function approvedRoot(){
    var root=document.querySelector('.kt-remote-live');
    if(!root)return null;
    if(root.classList.contains('kt-guest-hostlike-active')||
       root.classList.contains('kt-approved-guest-room')||
       root.querySelector('.kt-guest-hostlike-room,.kt-approved-guest-grid')){
      return root;
    }
    return null;
  }

  function guestStream(){
    var list=[
      window.__ktLocalGuestCameraStream20260926,
      window.__ktApprovedGuestSelfStream
    ];
    try{
      if(window.state&&state.stream)list.push(state.stream);
    }catch(e){}
    try{
      var v=document.querySelector('.kt-guest-hostlike-room .kgh-cell.self video,#ktRemoteLiveVideo[data-kt-local-guest-view="1"]');
      if(v&&v.srcObject)list.unshift(v.srcObject);
    }catch(e){}
    for(var i=0;i<list.length;i++){
      var s=list[i];
      if(s&&s.getTracks)return s;
    }
    return null;
  }

  function ensureStyle(){
    if(document.getElementById('ktGuestBottomCameraMicStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktGuestBottomCameraMicStyle20260928';
    s.textContent=''
      +'.kt-remote-live.kt-guest-controls-on #ktRemoteBottom{gap:5px!important}'
      +'.kt-remote-live.kt-guest-controls-on #ktRemoteBottom input{min-width:72px!important}'
      +'.kt-guest-self-media-btn{width:44px!important;height:44px!important;flex:0 0 44px!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:14px!important;background:rgba(28,28,34,.94)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:1px!important;padding:0!important;touch-action:manipulation!important}'
      +'.kt-guest-self-media-btn b{font-size:19px!important;line-height:1!important}.kt-guest-self-media-btn small{font-size:7px!important;line-height:1!important;color:#fff!important;font-weight:900!important}'
      +'.kt-guest-self-media-btn.off{background:rgba(88,20,28,.95)!important;border-color:#ff596c88!important}.kt-guest-self-media-btn.off b{filter:grayscale(.25)!important;opacity:.8!important}'
      +'@media(max-width:390px){.kt-guest-self-media-btn{width:40px!important;height:40px!important;flex-basis:40px!important;border-radius:12px!important}.kt-guest-self-media-btn b{font-size:17px!important}.kt-guest-self-media-btn small{font-size:6px!important}.kt-remote-live.kt-guest-controls-on #ktRemoteBottom input{min-width:58px!important;padding-left:9px!important;padding-right:9px!important}}';
    document.head.appendChild(s);
  }

  function tracks(kind){
    var s=guestStream();
    if(!s)return [];
    try{
      return kind==='video'?(s.getVideoTracks?s.getVideoTracks():[]):(s.getAudioTracks?s.getAudioTracks():[]);
    }catch(e){return [];}
  }

  function enabled(kind){
    var ts=tracks(kind);
    if(!ts.length)return false;
    return ts.some(function(t){return t.enabled!==false&&t.readyState!=='ended';});
  }

  function refresh(){
    var c=document.getElementById('ktGuestBottomCamera20260928');
    var m=document.getElementById('ktGuestBottomMic20260928');
    if(c){
      var on=enabled('video');
      c.classList.toggle('off',!on);
      c.querySelector('b').textContent=on?'📷':'🚫';
      c.querySelector('small').textContent=on?'카메라':'카메라 끔';
      c.setAttribute('aria-pressed',on?'false':'true');
    }
    if(m){
      var mon=enabled('audio');
      m.classList.toggle('off',!mon);
      m.querySelector('b').textContent=mon?'🎤':'🔇';
      m.querySelector('small').textContent=mon?'마이크':'마이크 잠금';
      m.setAttribute('aria-pressed',mon?'false':'true');
    }
  }

  function toggle(kind){
    var ts=tracks(kind);
    if(!ts.length)return;
    var on=ts.some(function(t){return t.enabled!==false;});
    ts.forEach(function(t){
      try{t.enabled=!on;}catch(e){}
    });
    refresh();
  }

  function make(id,icon,label,kind){
    var b=document.createElement('button');
    b.type='button';
    b.id=id;
    b.className='kt-guest-self-media-btn';
    b.innerHTML='<b>'+icon+'</b><small>'+label+'</small>';
    b.addEventListener('click',function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      toggle(kind);
    });
    return b;
  }

  function ensure(){
    ensureStyle();
    var root=approvedRoot();
    var oldC=document.getElementById('ktGuestBottomCamera20260928');
    var oldM=document.getElementById('ktGuestBottomMic20260928');

    if(!root){
      if(oldC)oldC.remove();
      if(oldM)oldM.remove();
      document.querySelectorAll('.kt-remote-live.kt-guest-controls-on').forEach(function(x){x.classList.remove('kt-guest-controls-on');});
      return;
    }

    var bar=root.querySelector('#ktRemoteBottom,.kt-remote-bottom');
    if(!bar)return;
    root.classList.add('kt-guest-controls-on');

    if(!oldC){
      oldC=make('ktGuestBottomCamera20260928','📷','카메라','video');
      var input=bar.querySelector('input');
      if(input)bar.insertBefore(oldC,input);
      else bar.insertBefore(oldC,bar.firstChild);
    }else if(oldC.parentElement!==bar){
      bar.insertBefore(oldC,bar.firstChild);
    }

    if(!oldM){
      oldM=make('ktGuestBottomMic20260928','🎤','마이크','audio');
      if(oldC.nextSibling)bar.insertBefore(oldM,oldC.nextSibling);
      else bar.appendChild(oldM);
    }else if(oldM.parentElement!==bar){
      if(oldC.nextSibling)bar.insertBefore(oldM,oldC.nextSibling);
      else bar.appendChild(oldM);
    }

    refresh();
  }

  window.ktGuestToggleSelfCamera20260928=function(){toggle('video');};
  window.ktGuestToggleSelfMic20260928=function(){toggle('audio');};

  ensure();
  [60,140,300,600,1000,1800].forEach(function(ms){setTimeout(ensure,ms);});
  setInterval(function(){ensure();refresh();},700);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuestBottomCameraMicTimer20260928);
      window.__ktGuestBottomCameraMicTimer20260928=setTimeout(ensure,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();