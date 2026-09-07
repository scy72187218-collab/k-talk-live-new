/* K-Talk 비밀방 가운데 인원 배치 전용. 위/아래 UI와 채팅/선물은 건드리지 않음. */
(function(){
  if(window.__ktSecretCenterPeopleInstalled)return;
  window.__ktSecretCenterPeopleInstalled=true;

  function styleOnce(){
    if(document.getElementById('ktSecretCenterPeopleStyle'))return;
    var s=document.createElement('style');
    s.id='ktSecretCenterPeopleStyle';
    s.textContent=''
      +'.ktsecret-main .ktsecret-center-people{position:absolute!important;left:4px!important;right:56px!important;top:4px!important;bottom:146px!important;z-index:3!important;display:grid!important;grid-template-columns:minmax(0,46%) minmax(0,54%)!important;gap:6px!important;pointer-events:none!important}'
      +'.ktsecret-main .ktsecret-host-person{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important;border:1px solid rgba(255,63,197,.72)!important;border-radius:11px!important;background:#09090d!important;box-shadow:0 0 9px rgba(255,45,190,.22)!important;pointer-events:auto!important}'
      +'.ktsecret-main .ktsecret-host-person #ktLiveVideo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:50% 50%!important;transform:scaleX(-1)!important;background:#111!important;z-index:1!important}'
      +'.ktsecret-main .ktsecret-host-label{position:absolute!important;left:7px!important;bottom:6px!important;z-index:3!important;padding:3px 7px!important;border-radius:999px!important;background:rgba(0,0,0,.62)!important;color:#fff!important;font-size:10px!important;font-weight:950!important}'
      +'.ktsecret-main .ktsecret-guest-grid{min-width:0!important;min-height:0!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:5px!important}'
      +'.ktsecret-main .ktsecret-guest-card{position:relative!important;min-width:0!important;min-height:0!important;overflow:hidden!important;border:1px solid rgba(255,255,255,.20)!important;border-radius:9px!important;background:linear-gradient(160deg,#181820,#08080c)!important;box-shadow:inset 0 0 16px rgba(255,255,255,.025)!important;pointer-events:auto!important}'
      +'.ktsecret-main .ktsecret-guest-card video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;transform:none!important;background:#111!important;z-index:1!important}'
      +'.ktsecret-main .ktsecret-guest-placeholder{position:absolute!important;inset:0!important;z-index:0!important;display:grid!important;place-items:center!important;color:rgba(255,255,255,.48)!important;font-size:26px!important}'
      +'.ktsecret-main .ktsecret-guest-name{position:absolute!important;left:5px!important;right:5px!important;bottom:4px!important;z-index:3!important;display:flex!important;align-items:center!important;justify-content:space-between!important;gap:3px!important;color:#fff!important;font-size:9px!important;font-weight:900!important;text-shadow:0 1px 3px #000!important}'
      +'.ktsecret-main .ktsecret-guest-name b{min-width:0!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}'
      +'.ktsecret-main .ktsecret-guest-name span{font-size:9px!important;color:#bbb!important}'
      +'@media(max-width:390px){.ktsecret-main .ktsecret-center-people{right:50px!important;bottom:140px!important;grid-template-columns:minmax(0,44%) minmax(0,56%)!important;gap:4px!important}.ktsecret-main .ktsecret-guest-grid{gap:3px!important}.ktsecret-main .ktsecret-host-label{font-size:9px!important}.ktsecret-main .ktsecret-guest-name{font-size:8px!important;left:3px!important;right:3px!important}}';
    document.head.appendChild(s);
  }

  function makeGuest(i){
    var card=document.createElement('div');
    card.className='ktsecret-guest-card';
    card.setAttribute('data-kt-secret-guest',String(i));
    card.innerHTML='<div class="ktsecret-guest-placeholder">👤</div>'
      +'<video id="ktSecretGuestVideo'+i+'" autoplay playsinline muted></video>'
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
    var hostLabel=document.createElement('div');
    hostLabel.className='ktsecret-host-label';
    hostLabel.textContent='● ON AIR · 호스트';
    host.appendChild(live);
    host.appendChild(hostLabel);

    var grid=document.createElement('div');
    grid.className='ktsecret-guest-grid';
    for(var i=1;i<=6;i++)grid.appendChild(makeGuest(i));

    center.appendChild(host);
    center.appendChild(grid);
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
