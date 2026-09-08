/* K-Talk 13명 방송: 메시지 옆 '모니터' 버튼 + 본인에게만 보이는 로컬 화면. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktPrivateSelfMonitor20260908Installed)return;
  window.__ktPrivateSelfMonitor20260908Installed=true;

  function getLocalStream(){
    try{
      var live=document.getElementById('ktLiveVideo');
      if(live&&live.srcObject)return live.srcObject;
    }catch(e){}
    try{
      if(window.state&&state.stream)return state.stream;
    }catch(e){}
    return null;
  }

  function closePrivateMonitor(){
    var old=document.getElementById('ktPrivateSelfMonitor');
    if(old){
      try{var v=old.querySelector('video');if(v){v.pause();v.srcObject=null;}}catch(e){}
      old.remove();
    }
  }
  window.ktClosePrivateMonitor=closePrivateMonitor;

  window.ktGroup13PrivateMonitor=function(){
    var existing=document.getElementById('ktPrivateSelfMonitor');
    if(existing){closePrivateMonitor();return;}

    var stream=getLocalStream();
    if(!stream){
      alert('카메라 화면이 아직 준비되지 않았습니다. 방송 화면이 켜진 뒤 다시 눌러 주세요.');
      return;
    }

    var wrap=document.createElement('div');
    wrap.id='ktPrivateSelfMonitor';
    wrap.setAttribute('data-private-self-view','1');
    wrap.innerHTML=''
      +'<div class="kt-private-monitor-card">'
        +'<div class="kt-private-monitor-head"><b>👁 내 화면 모니터</b><span>🔒 나만 보기</span><button type="button" aria-label="닫기">×</button></div>'
        +'<div class="kt-private-monitor-video"><video autoplay muted playsinline></video><div class="kt-private-monitor-badge">외부 노출 안 됨 · 내 기기에서만 표시</div></div>'
      +'</div>';

    var style=document.getElementById('ktPrivateSelfMonitorStyle');
    if(!style){
      style=document.createElement('style');
      style.id='ktPrivateSelfMonitorStyle';
      style.textContent=''
        +'#ktPrivateSelfMonitor{position:fixed;inset:0;z-index:2147483000;display:grid;place-items:center;padding:18px;background:rgba(0,0,0,.74);backdrop-filter:blur(6px)}'
        +'#ktPrivateSelfMonitor .kt-private-monitor-card{width:min(92vw,520px);max-height:88dvh;border:2px solid #9b5cff;border-radius:22px;overflow:hidden;background:#050509;box-shadow:0 0 28px rgba(155,92,255,.48)}'
        +'#ktPrivateSelfMonitor .kt-private-monitor-head{height:54px;display:flex;align-items:center;gap:8px;padding:0 10px 0 14px;background:linear-gradient(135deg,#151020,#08080d);color:#fff}'
        +'#ktPrivateSelfMonitor .kt-private-monitor-head b{font-size:16px;font-weight:950;white-space:nowrap}'
        +'#ktPrivateSelfMonitor .kt-private-monitor-head span{margin-left:auto;padding:5px 8px;border:1px solid #56d88e;border-radius:999px;color:#7df0aa;font-size:11px;font-weight:900;white-space:nowrap}'
        +'#ktPrivateSelfMonitor .kt-private-monitor-head button{width:36px;height:36px;border:0;border-radius:50%;background:#202027;color:#fff;font-size:25px;line-height:1}'
        +'#ktPrivateSelfMonitor .kt-private-monitor-video{position:relative;width:100%;height:min(72dvh,640px);background:#111;overflow:hidden}'
        +'#ktPrivateSelfMonitor video{width:100%;height:100%;display:block;object-fit:cover;transform:scaleX(-1);background:#111}'
        +'#ktPrivateSelfMonitor .kt-private-monitor-badge{position:absolute;left:10px;right:10px;bottom:10px;padding:9px 10px;border-radius:12px;background:rgba(0,0,0,.66);color:#fff;text-align:center;font-size:12px;font-weight:900;backdrop-filter:blur(5px)}'
        +'.ktg13-tools.kt-private-monitor-ready{grid-template-columns:repeat(7,minmax(0,1fr))!important}'
        +'.ktg13-monitor-tool i{box-shadow:0 0 12px rgba(92,214,255,.5),inset 0 0 13px rgba(255,255,255,.08)!important}'
        +'@media(max-width:390px){#ktPrivateSelfMonitor{padding:10px}#ktPrivateSelfMonitor .kt-private-monitor-head b{font-size:14px}#ktPrivateSelfMonitor .kt-private-monitor-head span{font-size:9px;padding:4px 6px}.ktg13-tool span{font-size:7px!important}}';
      document.head.appendChild(style);
    }

    document.body.appendChild(wrap);
    var video=wrap.querySelector('video');
    try{video.srcObject=stream;video.muted=true;video.setAttribute('playsinline','');var p=video.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
    wrap.querySelector('button').addEventListener('click',closePrivateMonitor);
    wrap.addEventListener('click',function(e){if(e.target===wrap)closePrivateMonitor();});
  };

  function addMonitorButton(){
    var tools=document.querySelector('.ktg13-tools');
    if(!tools)return;
    if(tools.querySelector('.ktg13-monitor-tool')){
      tools.classList.add('kt-private-monitor-ready');
      return;
    }

    var messageBtn=null;
    tools.querySelectorAll('button').forEach(function(btn){
      if(messageBtn)return;
      var txt=String(btn.textContent||'').replace(/\s+/g,'');
      var oc=String(btn.getAttribute('onclick')||'');
      if(txt.indexOf('메시지')>-1||oc.indexOf('ktGroup13OpenMessage')>-1)messageBtn=btn;
    });
    if(!messageBtn)return;

    var btn=document.createElement('button');
    btn.type='button';
    btn.className='ktg13-tool ktg13-monitor-tool';
    btn.setAttribute('aria-label','내 화면 모니터');
    btn.innerHTML='<i>👁</i><span>모니터</span>';
    btn.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();window.ktGroup13PrivateMonitor();});
    messageBtn.insertAdjacentElement('afterend',btn);
    tools.classList.add('kt-private-monitor-ready');
  }

  var observer=new MutationObserver(function(){addMonitorButton();});
  if(document.body)observer.observe(document.body,{childList:true,subtree:true});
  else document.addEventListener('DOMContentLoaded',function(){observer.observe(document.body,{childList:true,subtree:true});addMonitorButton();});
  setTimeout(addMonitorButton,0);
  setTimeout(addMonitorButton,250);
  setTimeout(addMonitorButton,1000);

  document.addEventListener('click',function(e){
    var leave=e.target&&e.target.closest?e.target.closest('.ktg13-back,.ktsolo-back,.ktsecret-back'):null;
    if(leave)closePrivateMonitor();
  },true);
})();
