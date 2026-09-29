/* K-Talk: 운영진 지정 표시만 단순화.
   - 호스트 '호스트' 글자는 숨김(닉네임 + 레벨 유지)
   - 운영진으로 지정된 사람은 닉네임/레벨 옆에 '운영진' 표시
   - 다른 방송/선물/장미/스위치 기능은 변경하지 않음. */
(function(){
  if(window.__ktRoomStaffBadgeSimple20260929)return;
  window.__ktRoomStaffBadgeSimple20260929=true;

  var STAFF_KEY='ktalk_room_staff_v1';

  function loadMap(){
    try{return JSON.parse(localStorage.getItem(STAFF_KEY)||'{}')||{};}catch(e){return {};}
  }
  function saveMap(m){
    try{localStorage.setItem(STAFF_KEY,JSON.stringify(m||{}));}catch(e){}
  }
  function idOf(tile){
    if(!tile||!tile.dataset)return '';
    var d=tile.dataset;
    return String(
      d.ktGuestViewerId||d.viewerId||d.userId||d.participantId||d.memberId||
      d.uid||d.guestId||d.profileId||d.accountKey||d.nickname||d.name||''
    ).trim();
  }
  function isHost(tile){
    if(!tile||!tile.matches)return false;
    return tile.matches('.ktsolo-main,.ktg13-host,.ktg9-host,.ktsubscriber-host,.ktsecret-host,.ktsecret-slot.host');
  }
  function isStaff(tile){
    if(!tile||!tile.dataset||isHost(tile))return false;
    var d=tile.dataset;
    var vals=[
      d.ktStaff,d.staff,d.isStaff,d.admin,d.isAdmin,d.moderator,d.isModerator,
      d.operator,d.isOperator,d.role,d.memberRole,d.userRole
    ].map(function(v){return String(v||'').toLowerCase();});
    if(vals.some(function(v){return v==='1'||v==='true'||v==='staff'||v==='admin'||v==='moderator'||v==='operator'||v==='운영진';}))return true;
    var id=idOf(tile),m=loadMap();
    return !!(id&&m[id]);
  }
  function ensureStyle(){
    if(document.getElementById('ktRoomStaffBadgeSimpleStyle20260929'))return;
    var s=document.createElement('style');
    s.id='ktRoomStaffBadgeSimpleStyle20260929';
    s.textContent=
      '#screen .kt-room-staff-badge{display:inline-flex!important;align-items:center!important;justify-content:center!important;height:12px!important;padding:0 4px!important;border-radius:5px!important;background:#2f6fff!important;color:#fff!important;font:950 7px/11px system-ui,-apple-system,"Noto Sans KR",sans-serif!important;white-space:nowrap!important;flex:none!important;box-shadow:0 1px 3px #0008!important}'+
      '#screen .kt-allguest-profile .kt-room-staff-badge{margin-left:1px!important}'+
      '#screen .kt-guest-identity .kt-room-staff-badge{margin-left:2px!important}'+
      '#screen .ktg13-host-label,#screen .ktg9-host-label,#screen .ktsubscriber-host-label,#screen .ktsecret-host-label,#screen .ktsecret-slot.host>.ktsecret-slot-label{display:none!important}'+
      '@media(max-width:390px){#screen .kt-room-staff-badge{height:11px!important;padding:0 3px!important;font-size:6.5px!important}}';
    document.head.appendChild(s);
  }
  function profileBox(tile){
    return tile.querySelector(':scope > .kt-allguest-profile,:scope > .kt-guest-identity,:scope > .kt-hg-host-identity');
  }
  function paint(tile){
    if(!tile||isHost(tile)){
      var old=tile&&tile.querySelector?tile.querySelector(':scope > .kt-room-staff-badge'):null;
      if(old)old.remove();
      return;
    }
    var staff=isStaff(tile);
    var box=profileBox(tile);
    var badge=(box&&box.querySelector('.kt-room-staff-badge'))||tile.querySelector(':scope > .kt-room-staff-badge');
    if(!staff){if(badge)badge.remove();return;}
    if(!badge){
      badge=document.createElement('span');
      badge.className='kt-room-staff-badge';
      badge.textContent='운영진';
      if(box)box.appendChild(badge);
      else{
        badge.style.position='absolute';
        badge.style.left='4px';
        badge.style.bottom='20px';
        badge.style.zIndex='99';
        tile.appendChild(badge);
      }
    }
  }
  function tiles(){
    return [].slice.call(document.querySelectorAll(
      '#screen .ktg13-guest,#screen .ktg9-guest,#screen .ktsubscriber-guest,'+
      '#screen .ktsecret-slot:not(.host),#screen .ktsecret-guest-slot:not(.host),'+
      '#screen .kgh-cell,#screen .kt-approved-guest-cell,#screen .kt-guest-room-cell'
    ));
  }
  function apply(){
    ensureStyle();
    tiles().forEach(paint);
  }

  /* 운영진 지정 기능이 있는 곳에서 이 함수 하나만 호출하면 즉시 표시됨. */
  window.ktSetRoomStaff=function(target,on){
    var tile=typeof target==='string'?document.querySelector(target):target;
    if(!tile||!tile.dataset)return false;
    var id=idOf(tile);
    tile.dataset.ktStaff=on===false?'0':'1';
    if(id){
      var m=loadMap();
      if(on===false)delete m[id]; else m[id]=1;
      saveMap(m);
    }
    paint(tile);
    try{document.dispatchEvent(new CustomEvent('kt-room-staff-changed',{detail:{tile:tile,id:id,on:on!==false}}));}catch(e){}
    return true;
  };

  document.addEventListener('kt-room-staff-changed',apply);
  document.addEventListener('kt-guest-profile',apply);
  document.addEventListener('kt-guest-joined',apply);

  apply();
  [100,300,700,1400].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktRoomStaffBadgeTimer20260929);
      window.__ktRoomStaffBadgeTimer20260929=setTimeout(apply,35);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:[
      'data-kt-staff','data-staff','data-is-staff','data-admin','data-is-admin',
      'data-moderator','data-role','data-member-role','data-user-role','data-nickname','data-user-id'
    ]});
  }catch(e){}
})();
