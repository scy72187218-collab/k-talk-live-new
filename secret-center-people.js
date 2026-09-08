/* K-Talk 비밀방 가운데 인원 배치 전용. 위/아래 UI와 채팅/선물은 건드리지 않음. */
(function(){
  if(window.__ktSecretCenterPeopleInstalled)return;
  window.__ktSecretCenterPeopleInstalled=true;

  function styleOnce(){
    if(document.getElementById('ktSecretCenterPeopleStyle'))return;
    var s=document.createElement('style');
    s.id='ktSecretCenterPeopleStyle';
    s.textContent=''
      +'.ktsecret-main .ktsecret-center-people{position:absolute!important;left:4px!important;right:56px!important;top:4px!important;bottom:146px!important;z-index:3!important;display:grid!important;grid-template-columns:minmax(0,48%) minmax(0,52%)!important;gap:7px!important;pointer-events:none!important}'
      +'.ktsecret-main .ktsecret-host-person{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important;border:2px solid rgba(255,43,194,.92)!important;border-radius:13px!important;background:linear-gradient(160deg,#17071a,#08080d)!important;box-shadow:0 0 12px rgba(255,43,194,.46),inset 0 0 18px rgba(255,43,194,.09)!important;pointer-events:auto!important}'
      +'.ktsecret-main .ktsecret-host-person #ktLiveVideo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:50% 50%!important;transform:scaleX(-1)!important;background:#111!important;z-index:1!important}'
      +'.ktsecret-main .ktsecret-host-person:before{content:"● ON AIR";position:absolute!important;left:9px!important;top:8px!important;z-index:4!important;color:#ff315f!important;font-size:11px!important;font-weight:950!important;text-shadow:0 0 7px rgba(255,49,95,.75)!important}'
      +'.ktsecret-main .ktsecret-host-person:after{content:"";position:absolute!important;inset:0!important;z-index:2!important;pointer-events:none!important;background:linear-gradient(180deg,transparent 56%,rgba(0,0,0,.08) 70%,rgba(0,0,0,.52) 100%)!important}'
      +'.ktsecret-main .ktsecret-host-label{position:absolute!important;left:8px!important;bottom:7px!important;z-index:4!important;padding:4px 8px!important;border-radius:999px!important;background:rgba(0,0,0,.68)!important;border:1px solid rgba(255,255,255,.18)!important;color:#fff!important;font-size:10px!important;font-weight:950!important;box-shadow:0 0 7px rgba(0,0,0,.35)!important}'
      +'.ktsecret-main .ktsecret-guest-panel{min-width:0!important;min-height:0!important;display:flex!important;flex-direction:column!important;gap:5px!important;pointer-events:auto!important}'
      +'.ktsecret-main .ktsecret-guest-head{flex:0 0 25px!important;min-height:25px!important;display:flex!important;align-items:center!important;padding:0 7px!important;border-radius:9px!important;border:1px solid rgba(255,197,73,.36)!important;background:linear-gradient(180deg,rgba(21,21,28,.94),rgba(10,10,15,.94))!important;color:#ffe071!important;font-size:10px!important;font-weight:950!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
      +'.ktsecret-main .ktsecret-guest-head b{color:#fff!important;margin-left:4px!important;font-weight:850!important}'
      +'.ktsecret-main .ktsecret-guest-grid{flex:1 1 0!important;min-width:0!important;min-height:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:5px!important}'
      +'.ktsecret-main .ktsecret-guest-card{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important;border:1.4px solid rgba(255,71,201,.60)!important;border-radius:10px!important;background:linear-gradient(160deg,#1b1b23,#09090e)!important;box-shadow:inset 0 0 16px rgba(255,255,255,.025),0 0 6px rgba(255,52,194,.15)!important;pointer-events:auto!important}'
      +'.ktsecret-main .ktsecret-guest-card.on{border-color:rgba(255,202,73,.88)!important;box-shadow:0 0 8px rgba(255,202,73,.28),inset 0 0 14px rgba(255,255,255,.03)!important}'
      +'.ktsecret-main .ktsecret-guest-card video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;transform:none!important;background:#111!important;z-index:1!important}'
      +'.ktsecret-main .ktsecret-guest-placeholder{position:absolute!important;inset:0!important;z-index:0!important;display:grid!important;place-items:center!important;color:rgba(255,255,255,.34)!important;font-size:24px!important;background:radial-gradient(circle at 50% 36%,rgba(255,56,198,.09),transparent 42%)!important}'
      +'.ktsecret-main .ktsecret-guest-no{position:absolute!important;left:5px!important;top:5px!important;z-index:4!important;display:grid!important;place-items:center!important;width:21px!important;height:21px!important;border-radius:6px!important;background:linear-gradient(145deg,#ffbf25,#ff8c20)!important;color:#fff!important;font-size:11px!important;font-weight:950!important;box-shadow:0 0 6px rgba(255,178,37,.35)!important}'
      +'.ktsecret-main .ktsecret-guest-card:nth-child(2) .ktsecret-guest-no,.ktsecret-main .ktsecret-guest-card:nth-child(4) .ktsecret-guest-no{background:linear-gradient(145deg,#c7c7cd,#8f9098)!important}.ktsecret-main .ktsecret-guest-card:nth-child(5) .ktsecret-guest-no{background:linear-gradient(145deg,#38c8ff,#1988d7)!important}.ktsecret-main .ktsecret-guest-card:nth-child(6) .ktsecret-guest-no{background:linear-gradient(145deg,#a751ff,#6f2bd9)!important}'
      +'.ktsecret-main .ktsecret-guest-mic{position:absolute!important;right:5px!important;top:5px!important;z-index:4!important;display:grid!important;place-items:center!important;width:21px!important;height:21px!important;border-radius:7px!important;background:rgba(0,0,0,.58)!important;color:#fff!important;font-size:10px!important}'
      +'.ktsecret-main .ktsecret-guest-name{position:absolute!important;left:5px!important;right:24px!important;bottom:5px!important;z-index:4!important;display:flex!important;flex-direction:column!important;align-items:flex-start!important;gap:1px!important;color:#fff!important;text-shadow:0 1px 3px #000!important}'
      +'.ktsecret-main .ktsecret-guest-name b{display:block!important;max-width:100%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:9px!important;font-weight:950!important}'
      +'.ktsecret-main .ktsecret-guest-status{font-size:8px!important;color:#ffc9e8!important;font-weight:850!important}'
      +'.ktsecret-main .ktsecret-guest-card.on .ktsecret-guest-status{color:#ffe071!important}'
      +'.ktsecret-main .ktsecret-guest-rose{position:absolute!important;right:4px!important;bottom:4px!important;z-index:4!important;font-size:15px!important;filter:drop-shadow(0 0 4px rgba(255,0,70,.48))!important}'
      +'@media(max-width:390px){.ktsecret-main .ktsecret-center-people{right:50px!important;bottom:140px!important;grid-template-columns:minmax(0,47%) minmax(0,53%)!important;gap:4px!important}.ktsecret-main .ktsecret-guest-panel{gap:3px!important}.ktsecret-main .ktsecret-guest-head{flex-basis:22px!important;min-height:22px!important;font-size:9px!important;padding:0 5px!important}.ktsecret-main .ktsecret-guest-grid{gap:3px!important}.ktsecret-main .ktsecret-host-label{font-size:9px!important;left:5px!important;bottom:5px!important}.ktsecret-main .ktsecret-host-person:before{left:6px!important;top:6px!important;font-size:9px!important}.ktsecret-main .ktsecret-guest-no,.ktsecret-main .ktsecret-guest-mic{width:18px!important;height:18px!important;font-size:9px!important}.ktsecret-main .ktsecret-guest-name b{font-size:8px!important}.ktsecret-main .ktsecret-guest-status{font-size:7px!important}.ktsecret-main .ktsecret-guest-rose{font-size:13px!important}}';
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
      +'<div class="ktsecret-guest-name"><b>참여자 '+i+'</b><span class="ktsecret-guest-status">대기</span></div>'
      +'<div class="ktsecret-guest-rose">🌹</div>';
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
    var hostLabel=document.createElement('div');
    hostLabel.className='ktsecret-host-label';
    hostLabel.textContent='● ON AIR · 호스트';
    host.appendChild(live);
    host.appendChild(hostLabel);

    var guestPanel=document.createElement('div');
    guestPanel.className='ktsecret-guest-panel';
    var guestHead=document.createElement('div');
    guestHead.className='ktsecret-guest-head';
    guestHead.innerHTML='🔒 비밀방 <b>(최대 6명)</b>';
    var grid=document.createElement('div');
    grid.className='ktsecret-guest-grid';
    for(var i=1;i<=6;i++)grid.appendChild(makeGuest(i));
    guestPanel.appendChild(guestHead);
    guestPanel.appendChild(grid);

    center.appendChild(host);
    center.appendChild(guestPanel);
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
      var st=card.querySelector('.ktsecret-guest-status');
      if(nm&&name)nm.textContent=String(name);
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
