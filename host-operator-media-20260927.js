/* K-Talk host/operator media controls (2026-09-27)
   Host-side only: YouTube/direct video playback + TV Remote Playback when supported.
   Does not change guest/video transport, camera placement, mic placement, or room layout. */
(function(){
  if(window.__ktHostOperatorMedia20260927)return;
  window.__ktHostOperatorMedia20260927=true;

  var currentMediaVideo=null;

  function isHostSide(){
    return !!document.querySelector(
      '#screen .ktsolo-room,'+
      '#screen .ktg9-room,'+
      '#screen .ktg13-room:not(.kt-remote-live),'+
      '#screen .ktsubscriber-room,'+
      '#screen .ktsecret-room'
    );
  }

  function ensureStyle(){
    if(document.getElementById('ktHostOperatorMediaStyle20260927'))return;
    var s=document.createElement('style');
    s.id='ktHostOperatorMediaStyle20260927';
    s.textContent=''
      +'.kt-host-media-launch{position:fixed!important;right:12px!important;top:108px!important;z-index:1500!important;width:58px!important;height:58px!important;border-radius:18px!important;border:1px solid #5ddcff88!important;background:rgba(5,16,24,.90)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important;font-weight:950!important;font-size:9px!important;pointer-events:auto!important;touch-action:manipulation!important;box-shadow:0 0 14px #36d9ff33!important}'
      +'.kt-host-media-launch b{font-size:21px!important;line-height:1!important}'
      +'.kt-host-media-player{position:fixed!important;inset:0!important;z-index:2147483646!important;background:#000!important;display:flex!important;flex-direction:column!important}'
      +'.kt-host-media-player-head{height:52px!important;flex:0 0 52px!important;background:#0d0d12!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:space-between!important;padding:6px 10px!important;border-bottom:1px solid #ffffff22!important}'
      +'.kt-host-media-player-head b{font-size:14px!important}.kt-host-media-player-head div{display:flex!important;gap:7px!important}.kt-host-media-player-head button{height:38px!important;min-width:42px!important;border:1px solid #ffffff26!important;border-radius:12px!important;background:#24242c!important;color:#fff!important;font-weight:950!important;padding:0 10px!important}'
      +'.kt-host-media-player iframe,.kt-host-media-player video{flex:1!important;width:100%!important;min-height:0!important;border:0!important;background:#000!important;object-fit:contain!important}'
      +'.kt-host-media-sheet input{width:100%!important;height:46px!important;margin-top:8px!important;padding:0 12px!important;border-radius:12px!important;border:1px solid #ffffff25!important;background:#15151b!important;color:#fff!important;box-sizing:border-box!important}'
      +'.kt-host-media-sheet .act{width:100%!important;height:44px!important;margin-top:8px!important;border:0!important;border-radius:12px!important;background:linear-gradient(135deg,#117dff,#7c55ff)!important;color:#fff!important;font-weight:950!important}'
      +'.kt-host-media-sheet .note{margin-top:9px!important;font-size:10px!important;color:#bbb!important;line-height:1.45!important}';
    document.head.appendChild(s);
  }

  function youtubeId(url){
    try{
      var u=new URL(url,location.href),h=u.hostname.replace(/^www\./,'');
      if(h==='youtu.be')return u.pathname.replace(/^\//,'').split('/')[0];
      if(h==='youtube.com'||h==='m.youtube.com'){
        if(u.pathname==='/watch')return u.searchParams.get('v')||'';
        var m=u.pathname.match(/^\/(?:shorts|embed)\/([^/?#]+)/);
        if(m)return m[1];
      }
    }catch(e){}
    return '';
  }

  function closePlayer(){
    var old=document.getElementById('ktHostMediaPlayer20260927');
    if(old){
      try{
        old.querySelectorAll('video').forEach(function(v){v.pause();v.removeAttribute('src');v.load();});
        old.querySelectorAll('iframe').forEach(function(f){f.src='about:blank';});
      }catch(e){}
      old.remove();
    }
    currentMediaVideo=null;
  }
  window.ktCloseHostMedia20260927=closePlayer;

  async function requestTv(){
    try{
      if(currentMediaVideo&&currentMediaVideo.remote&&typeof currentMediaVideo.remote.prompt==='function'){
        await currentMediaVideo.remote.prompt();
        return;
      }
    }catch(e){}
    alert('이 영상은 현재 브라우저에서 TV 직접 연결을 지원하지 않습니다. YouTube 영상은 YouTube 플레이어의 TV/전송 기능을 이용해 주세요.');
  }
  window.ktHostMediaTv20260927=requestTv;

  function playUrl(url){
    url=String(url||'').trim();
    if(!url)return;
    ensureStyle();closePlayer();

    var wrap=document.createElement('div');
    wrap.id='ktHostMediaPlayer20260927';
    wrap.className='kt-host-media-player';

    var head=document.createElement('div');
    head.className='kt-host-media-player-head';
    head.innerHTML='<b>🎬 호스트 · 운영진 영상</b><div><button type="button" class="tv">TV 연결</button><button type="button" class="close">×</button></div>';
    wrap.appendChild(head);
    head.querySelector('.close').onclick=closePlayer;
    head.querySelector('.tv').onclick=requestTv;

    var yid=youtubeId(url);
    if(yid){
      var iframe=document.createElement('iframe');
      iframe.allow='autoplay; encrypted-media; picture-in-picture; fullscreen';
      iframe.allowFullscreen=true;
      iframe.referrerPolicy='strict-origin-when-cross-origin';
      iframe.src='https://www.youtube.com/embed/'+encodeURIComponent(yid)+'?autoplay=1&playsinline=1&rel=0';
      wrap.appendChild(iframe);
    }else{
      var v=document.createElement('video');
      v.controls=true;v.autoplay=true;v.playsInline=true;
      v.src=url;
      try{v.disableRemotePlayback=false;}catch(e){}
      currentMediaVideo=v;
      wrap.appendChild(v);
      try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    }
    document.body.appendChild(wrap);
  }
  window.ktPlayHostMedia20260927=playUrl;

  function openPanel(){
    if(!isHostSide())return;
    ensureStyle();
    var html='<div class="kt-host-media-sheet">'
      +'<div class="rowbox"><b>🎬 호스트 · 운영진 전용</b><br>유튜브 주소 또는 재생 가능한 영상 주소를 넣으면 바로 재생합니다.</div>'
      +'<input id="ktHostMediaUrl20260927" type="url" placeholder="YouTube 또는 영상 주소 붙여넣기">'
      +'<button class="act" onclick="var u=document.getElementById(\'ktHostMediaUrl20260927\').value;closeSheet();ktPlayHostMedia20260927(u)">▶ 바로 재생</button>'
      +'<button class="act" onclick="ktHostMediaTv20260927()" style="background:linear-gradient(135deg,#1f5669,#236f5c)">📺 TV 연결</button>'
      +'<div class="note">이 버튼은 호스트 화면에만 표시됩니다. 일반 시청자·게스트 화면에는 표시하지 않습니다. TV 직접 연결은 휴대폰/브라우저가 Remote Playback을 지원하는 영상에서 작동합니다.</div>'
      +'</div>';
    if(typeof window.showSheet==='function')window.showSheet('운영진 영상',html);
  }
  window.ktOpenHostOperatorMedia20260927=openPanel;

  function install(){
    ensureStyle();
    var room=hostRoom();
    var old=document.querySelector('.kt-host-media-launch');
    if(!room){
      if(old)old.remove();
      return;
    }
    if(old)return;
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-host-media-launch';
    b.innerHTML='<b>🎬</b><span>영상·TV</span>';
    b.setAttribute('aria-label','호스트 운영진 영상 TV');
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(x){}
      openPanel();
    };
    document.body.appendChild(b);
  }

  install();
  setInterval(install,900);
  try{
    new MutationObserver(function(){setTimeout(install,20);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
