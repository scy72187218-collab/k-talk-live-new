/* K-Talk: 승인된 게스트 폰만 전체화면 시청에서 9/13명 방 격자로 전환. 다른 화면/기능은 변경하지 않음. */
(function(){
  if(window.__ktApprovedGuestRoomGridOnly20260917)return;
  window.__ktApprovedGuestRoomGridOnly20260917=true;

  function ensureStyle(){
    if(document.getElementById('ktApprovedGuestRoomGridOnlyStyle'))return;
    var s=document.createElement('style');
    s.id='ktApprovedGuestRoomGridOnlyStyle';
    s.textContent=''
      +'.kt-remote-live.kt-approved-guest-room{display:flex!important;flex-direction:column!important;gap:4px!important;padding:5px 6px calc(62px + env(safe-area-inset-bottom))!important;background:#000!important;overflow:hidden!important}'
      +'.kt-remote-live.kt-approved-guest-room>.kt-remote-top{position:relative!important;left:auto!important;right:auto!important;top:auto!important;flex:0 0 58px!important;border-radius:16px!important;padding:6px 9px!important;background:linear-gradient(180deg,#17171a,#0d0d10)!important}'
      +'.kt-remote-live.kt-approved-guest-room>.kt-remote-shade{display:none!important}'
      +'.kt-approved-guest-led{flex:0 0 44px!important;border:2px solid #ff28c4!important;border-radius:20px!important;background-color:#120712!important;background-image:radial-gradient(circle,#ff35ce 1.6px,transparent 2.4px)!important;background-size:12px 12px!important;box-shadow:0 0 9px #ff28c4,0 0 18px #ff28c455!important;color:#ffd62d!important;font-size:17px!important;font-weight:950!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;white-space:nowrap!important}'
      +'.kt-approved-guest-stats{flex:0 0 42px!important;display:grid!important;grid-template-columns:1fr 1fr 1.3fr!important;gap:5px!important}.kt-approved-guest-stats>div{border-radius:12px!important;background:#111114!important;color:#fff!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:11px!important;font-weight:900!important;white-space:nowrap!important}'
      +'.kt-approved-guest-grid{flex:1 1 0!important;min-height:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-rows:minmax(0,1fr)!important;gap:3px!important;overflow:hidden!important}.kt-approved-guest-grid.is13{grid-template-columns:repeat(4,minmax(0,1fr))!important}'
      +'.kt-approved-guest-cell{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important;border:1px solid #292a30!important;border-radius:8px!important;background:linear-gradient(145deg,#17181d,#0e0f13)!important;color:#bfc0c7!important;display:grid!important;place-items:center!important;font-size:12px!important;font-weight:900!important}'
      +'.kt-approved-guest-cell video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:contain!important;object-position:center center!important;background:#08090c!important}'
      +'.kt-approved-guest-cell.host video{transform:none!important}.kt-approved-guest-cell.self video{transform:none!important;-webkit-transform:none!important}'
      +'.kt-approved-guest-cell label{position:absolute!important;left:5px!important;bottom:5px!important;z-index:3!important;padding:2px 6px!important;border-radius:8px!important;background:#000b!important;color:#fff!important;font-size:8px!important;font-weight:950!important}.kt-approved-guest-cell.self{outline:2px solid #61d9ff!important;outline-offset:-2px!important}'
      +'.kt-remote-live.kt-approved-guest-room .kt-remote-attendance{top:69px!important;right:12px!important;height:29px!important;font-size:10px!important;padding:0 9px!important}'
      +'.kt-remote-live.kt-approved-guest-room .kt-remote-chat{bottom:60px!important;max-height:105px!important;right:58px!important}.kt-remote-live.kt-approved-guest-room .kt-remote-bottom{bottom:calc(5px + env(safe-area-inset-bottom))!important}'
      +'@media(max-width:390px){.kt-remote-live.kt-approved-guest-room{gap:3px!important;padding-left:4px!important;padding-right:4px!important}.kt-approved-guest-led{flex-basis:40px!important;font-size:15px!important}.kt-approved-guest-stats{flex-basis:39px!important}.kt-approved-guest-stats>div{font-size:10px!important}}';
    document.head.appendChild(s);
  }

  function roomText(){
    var m=document.querySelector('.kt-remote-meta');
    return m?String(m.textContent||''):'';
  }

  function cell(cls,label){
    var d=document.createElement('div');
    d.className='kt-approved-guest-cell '+(cls||'');
    if(label){var l=document.createElement('label');l.textContent=label;d.appendChild(l);}else d.textContent='게스트';
    return d;
  }

  function videoLive(v){
    try{
      var s=v&&v.srcObject,ts=s&&s.getVideoTracks?s.getVideoTracks():[];
      return !!(ts&&ts.some(function(t){return t.readyState==='live';}));
    }catch(e){return false;}
  }

  function keepStatusCorrect(){
    var root=document.querySelector('.kt-remote-live.kt-approved-guest-room');
    if(!root)return;
    var host=document.getElementById('ktRemoteLiveVideo');
    var st=document.getElementById('ktRemoteLiveStatus');
    if(st&&videoLive(host))st.style.display='none';
  }

  function apply(){
    try{
      ensureStyle();
      var root=document.querySelector('.kt-remote-live');
      if(!root)return;
      if(root.classList.contains('kt-approved-guest-room')){keepStatusCorrect();return;}

      var selfVideo=document.getElementById('ktRemoteLiveVideo');
      var hostPreview=document.getElementById('ktRemoteHostPreview');
      if(!selfVideo||!hostPreview)return; /* 이 조합은 게스트 승인 뒤에만 생김 */

      var txt=roomText();
      var is13=txt.indexOf('13명')>-1;
      var total=is13?13:9;
      var selfStream=selfVideo.srcObject||null;
      var hostStream=hostPreview.srcObject||null;
      if(!selfStream||!hostStream)return;

      selfVideo.id='ktRemoteGuestSelfVideo';
      selfVideo.className='';
      selfVideo.muted=true;
      selfVideo.autoplay=true;
      selfVideo.playsInline=true;
      selfVideo.style.cssText='';
      selfVideo.srcObject=selfStream;

      hostPreview.id='ktRemoteLiveVideo';
      hostPreview.className='';
      hostPreview.muted=false;
      hostPreview.autoplay=true;
      hostPreview.playsInline=true;
      hostPreview.style.cssText='';
      hostPreview.srcObject=hostStream;

      root.classList.add('kt-approved-guest-room');

      var led=document.createElement('div');
      led.className='kt-approved-guest-led';
      led.textContent='💗 K-Talk LIVE 환영합니다 ✨ 즐거운 방송';

      var stats=document.createElement('div');
      stats.className='kt-approved-guest-stats';
      stats.innerHTML='<div>🔥 일일 랭킹</div><div>🎯 미션</div><div>👁 함께 시청 중</div>';

      var grid=document.createElement('div');
      grid.className='kt-approved-guest-grid'+(is13?' is13':'');
      var hc=cell('host','호스트');hc.appendChild(hostPreview);grid.appendChild(hc);
      var sc=cell('self','나 · 게스트');sc.appendChild(selfVideo);grid.appendChild(sc);
      for(var i=2;i<total;i++)grid.appendChild(cell('',''));

      var top=root.querySelector('.kt-remote-top');
      if(top&&top.nextSibling)root.insertBefore(led,top.nextSibling);else root.appendChild(led);
      if(led.nextSibling)root.insertBefore(stats,led.nextSibling);else root.appendChild(stats);
      if(stats.nextSibling)root.insertBefore(grid,stats.nextSibling);else root.appendChild(grid);

      keepStatusCorrect();
      try{var a=hostPreview.play();if(a&&a.catch)a.catch(function(){});}catch(e){}
      try{var b=selfVideo.play();if(b&&b.catch)b.catch(function(){});}catch(e){}
    }catch(e){}
  }

  var mo=new MutationObserver(function(){setTimeout(apply,20);});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  setInterval(function(){apply();keepStatusCorrect();},500);
  setTimeout(apply,100);
})();
