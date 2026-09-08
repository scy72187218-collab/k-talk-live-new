/* K-Talk 비밀방 가운데 호스트/게스트 배치 전용. 위/아래 UI는 절대 건드리지 않음. */
(function(){
  if(window.__ktSecretCenterPeopleInstalled)return;
  window.__ktSecretCenterPeopleInstalled=true;

  function getHostName(){
    try{
      if(window.state){
        var n=state.nickname||state.userName||state.name||'';
        if(n)return String(n);
      }
      var saved=localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_user_name')||'';
      if(saved)return String(saved);
    }catch(e){}
    return '호스트';
  }

  function styleOnce(){
    if(document.getElementById('ktSecretCenterPeopleStyle'))return;
    var s=document.createElement('style');
    s.id='ktSecretCenterPeopleStyle';
    s.textContent=''
      +'/* 비밀방 가운데 사람 배치만 */'
      +'.ktsecret-main .ktsecret-center-people{position:absolute!important;left:4px!important;right:56px!important;top:4px!important;bottom:164px!important;z-index:5!important;display:grid!important;grid-template-columns:minmax(0,47%) minmax(0,53%)!important;gap:6px!important;pointer-events:none!important}'
      +'.ktsecret-main .ktsecret-host-person{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important;border:2px solid #ff32c6!important;border-radius:12px!important;background:#09090d!important;box-shadow:0 0 10px rgba(255,45,190,.34)!important;pointer-events:auto!important}'
      +'.ktsecret-main .ktsecret-host-person #ktLiveVideo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:50% 50%!important;transform:scaleX(-1)!important;background:#111!important;z-index:1!important}'
      +'.ktsecret-main .ktsecret-host-air{position:absolute!important;left:8px!important;top:8px!important;z-index:4!important;color:#ff416d!important;font-size:11px!important;font-weight:950!important;text-shadow:0 0 8px rgba(255,45,95,.75)!important}'
      +'.ktsecret-main .ktsecret-host-meta{position:absolute!important;left:7px!important;right:7px!important;bottom:7px!important;z-index:4!important;display:grid!important;gap:4px!important;justify-items:start!important;pointer-events:none!important}'
      +'.ktsecret-main .ktsecret-host-label{padding:4px 8px!important;border-radius:999px!important;background:rgba(0,0,0,.70)!important;color:#fff!important;font-size:10px!important;font-weight:950!important;border:1px solid rgba(255,255,255,.18)!important}'
      +'.ktsecret-main .ktsecret-host-name{padding:2px 5px!important;border-radius:7px!important;background:rgba(0,0,0,.38)!important;color:#fff!important;font-size:10px!important;font-weight:950!important;text-shadow:0 1px 3px #000!important}'
      +'.ktsecret-main .ktsecret-guests-panel{min-width:0!important;min-height:0!important;display:grid!important;grid-template-rows:28px minmax(0,1fr)!important;gap:4px!important;pointer-events:auto!important}'
      +'.ktsecret-main .ktsecret-guests-title{display:flex!important;align-items:center!important;padding:0 7px!important;border:1px solid rgba(255,208,83,.45)!important;border-radius:8px!important;background:linear-gradient(180deg,#17151b,#0b0a0e)!important;color:#fff!important;font-size:9px!important;font-weight:950!important;white-space:nowrap!important;overflow:hidden!important}'
      +'.ktsecret-main .ktsecret-guests-title b{color:#ffd75c!important;margin-right:4px!important}'
      +'.ktsecret-main .ktsecret-guest-grid{min-width:0!important;min-height:0!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:4px!important}'
      +'.ktsecret-main .ktsecret-guest-card{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important;border:1px solid rgba(255,55,199,.62)!important;border-radius:9px!important;background:linear-gradient(160deg,#181820,#08080c)!important;box-shadow:inset 0 0 16px rgba(255,255,255,.025)!important;pointer-events:auto!important}'
      +'.ktsecret-main .ktsecret-guest-card.on{border-color:#ff36c8!important;box-shadow:0 0 8px rgba(255,48,198,.30)!important}'
      +'.ktsecret-main .ktsecret-guest-card video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;transform:none!important;background:#111!important;z-index:1!important}'
      +'.ktsecret-main .ktsecret-guest-placeholder{position:absolute!important;inset:0!important;z-index:0!important;display:grid!important;place-items:center!important;color:rgba(255,255,255,.46)!important;font-size:24px!important}'
      +'.ktsecret-main .ktsecret-guest-no{position:absolute!important;left:4px!important;top:4px!important;z-index:4!important;min-width:20px!important;height:20px!important;padding:0 4px!important;display:grid!important;place-items:center!important;border-radius:6px!important;background:#ffb426!important;color:#fff!important;font-size:9px!important;font-weight:950!important;box-shadow:0 1px 4px #0008!important}'
      +'.ktsecret-main .ktsecret-guest-card:nth-child(2) .ktsecret-guest-no,.ktsecret-main .ktsecret-guest-card:nth-child(4) .ktsecret-guest-no{background:#8b8e98!important}.ktsecret-main .ktsecret-guest-card:nth-child(3) .ktsecret-guest-no{background:#f27a22!important}.ktsecret-main .ktsecret-guest-card:nth-child(5) .ktsecret-guest-no{background:#23aee8!important}.ktsecret-main .ktsecret-guest-card:nth-child(6) .ktsecret-guest-no{background:#8a36ff!important}'
      +'.ktsecret-main .ktsecret-guest-mic{position:absolute!important;right:4px!important;top:4px!important;z-index:4!important;width:20px!important;height:20px!important;display:grid!important;place-items:center!important;border-radius:6px!important;background:rgba(25,25,29,.82)!important;color:#ddd!important;font-size:10px!important}'
      +'.ktsecret-main .ktsecret-guest-name{position:absolute!important;left:5px!important;right:5px!important;bottom:4px!important;z-index:4!important;display:flex!important;align-items:end!important;justify-content:space-between!important;gap:3px!important;color:#fff!important;font-size:8.5px!important;font-weight:900!important;text-shadow:0 1px 3px #000!important}'
      +'.ktsecret-main .ktsecret-guest-name b{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}'
      +'.ktsecret-main .ktsecret-guest-name span{font-size:7.5px!important;color:#ffd5ef!important;white-space:nowrap!important}'
      +'/* 요청대로 비밀방 가운데 아래 파장만 숨김 */'
      +'.ktsecret-main>.ktsecret-wave{display:none!important}'
      +'@media(max-width:390px){.ktsecret-main .ktsecret-center-people{right:50px!important;bottom:158px!important;grid-template-columns:minmax(0,46%) minmax(0,54%)!important;gap:4px!important}.ktsecret-main .ktsecret-guests-panel{grid-template-rows:25px minmax(0,1fr)!important;gap:3px!important}.ktsecret-main .ktsecret-guests-title{font-size:8px!important;padding:0 4px!important}.ktsecret-main .ktsecret-guest-grid{gap:3px!important}.ktsecret-main .ktsecret-host-label,.ktsecret-main .ktsecret-host-name{font-size:8px!important}.ktsecret-main .ktsecret-host-air{font-size:9px!important}.ktsecret-main .ktsecret-guest-name{font-size:7px!important;left:3px!important;right:3px!important}.ktsecret-main .ktsecret-guest-name span{font-size:6.5px!important}.ktsecret-main .ktsecret-guest-no,.ktsecret-main .ktsecret-guest-mic{width:18px!important;min-width:18px!important;height:18px!important;font-size:8px!important}}';
    document.head.appendChild(s);
  }

  function makeGuest(i){
    var card=document.createElement('div');
    card.className='ktsecret-guest-card';
    card.setAttribute('data-kt-secret-guest',String(i));
    card.innerHTML='<div class="ktsecret-guest-placeholder">👤</div>'
      +'<video id="ktSecretGuestVideo'+i+'" autoplay playsinline muted></video>'
      +'<div class="ktsecret-guest-no">'+i+'</div>'
      +'<div class="ktsecret-guest-mic">🔇</div>'
      +'<div class="ktsecret-guest-name"><b>참여자 '+i+'</b><span>대기</span></div>';
    return card;
  }

  function installIntoRoom(){
    styleOnce();
    var main=document.querySelector('.ktsecret-main');
    if(!main)return false;
    if(main.querySelector('.ktsecret-center-people'))return true;
    var live=document.getElementById('ktLiveVideo');
    if(!live)return false;

    var center=document.createElement('div');
    center.className='ktsecret-center-people';

    var host=document.createElement('div');
    host.className='ktsecret-host-person';
    var hostAir=document.createElement('div');
    hostAir.className='ktsecret-host-air';
    hostAir.textContent='● ON AIR';
    var hostMeta=document.createElement('div');
    hostMeta.className='ktsecret-host-meta';
    hostMeta.innerHTML='<div class="ktsecret-host-label">● ON AIR · 호스트</div><div class="ktsecret-host-name">'+getHostName()+'</div>';
    host.appendChild(live);
    host.appendChild(hostAir);
    host.appendChild(hostMeta);

    var panel=document.createElement('div');
    panel.className='ktsecret-guests-panel';
    panel.innerHTML='<div class="ktsecret-guests-title"><b>🔒 비밀방</b><span>(최대 6명)</span></div>';
    var grid=document.createElement('div');
    grid.className='ktsecret-guest-grid';
    for(var i=1;i<=6;i++)grid.appendChild(makeGuest(i));
    panel.appendChild(grid);

    center.appendChild(host);
    center.appendChild(panel);
    main.insertBefore(center,main.firstChild);
    try{live.play().catch(function(){});}catch(e){}
    return true;
  }

  window.ktSecretAttachGuestStream=function(slot,stream,name){
    slot=Math.max(1,Math.min(6,parseInt(slot,10)||1));
    var video=document.getElementById('ktSecretGuestVideo'+slot);
    var card=document.querySelector('.ktsecret-guest-card[data-kt-secret-guest="'+slot+'"]');
    if(!video||!card)return false;
    try{
      video.srcObject=stream||null;
      if(stream)video.play().catch(function(){});
      var nm=card.querySelector('.ktsecret-guest-name b');
      var st=card.querySelector('.ktsecret-guest-name span');
      if(nm)nm.textContent=name?String(name):('참여자 '+slot);
      if(st)st.textContent=stream?'입장':'대기';
      card.classList.toggle('on',!!stream);
      return true;
    }catch(e){return false;}
  };

  var mo=new MutationObserver(function(){
    if(document.querySelector('.ktsecret-main'))setTimeout(installIntoRoom,0);
  });
  try{mo.observe(document.getElementById('screen')||document.body,{childList:true,subtree:true});}catch(e){}
  setTimeout(installIntoRoom,0);
})();
