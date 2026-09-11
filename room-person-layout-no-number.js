/* K-Talk 자리 이동 표시 정리: 번호는 숨기고, 빈자리는 '게스트'만 표시. 실제 사람이 들어오면 글자는 자동 숨김. */
(function(){
  if(window.__ktRoomPersonLayoutNoNumberInstalled)return;
  window.__ktRoomPersonLayoutNoNumberInstalled=true;

  function addStyle(){
    if(document.getElementById('ktRoomPersonLayoutNoNumberStyle'))return;
    var s=document.createElement('style');
    s.id='ktRoomPersonLayoutNoNumberStyle';
    s.textContent=''
      +'.kt-person-seat-number{display:none!important}'
      +'.kt-person-layout-panel #ktPersonSeatTarget,.kt-person-layout-panel [data-act="seatGo"]{display:none!important}'
      +'.kt-guest-label-hidden{display:none!important}'
      +'html body:has(#screen .ktsubscriber-room) .kt-person-layout-launch{display:none!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-stage{position:relative!important;display:block!important;overflow:hidden!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-people{width:100%!important;height:100%!important;grid-template-columns:29% repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;grid-auto-flow:row!important;padding-right:0!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-host{grid-column:1!important;grid-row:1/span 2!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-guest{grid-column:auto!important;grid-row:auto!important;min-width:0!important;min-height:0!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-guest>span{font-size:18px!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-guest>b{font-size:7px!important;left:3px!important;bottom:3px!important;padding:2px 4px!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-right{position:absolute!important;right:1px!important;top:50%!important;transform:translateY(-50%)!important;z-index:25!important;width:40px!important;gap:3px!important;pointer-events:none!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-right button{pointer-events:auto!important;width:40px!important;height:40px!important;font-size:14px!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-right .like{height:48px!important;border-radius:17px!important}'
      +'@media(max-width:390px){html body #screen .ktsubscriber-room .ktsubscriber-right{width:36px!important;right:1px!important;gap:2px!important}html body #screen .ktsubscriber-room .ktsubscriber-right button{width:36px!important;height:36px!important;font-size:13px!important}html body #screen .ktsubscriber-room .ktsubscriber-right .like{height:44px!important}}';
    document.head.appendChild(s);
  }

  function ensureSubscriber14(){
    var people=document.querySelector('.ktsubscriber-room .ktsubscriber-people');
    if(!people)return;
    var guests=[].slice.call(people.querySelectorAll(':scope > .ktsubscriber-guest'));
    for(var i=guests.length+1;i<=14;i++){
      var d=document.createElement('div');
      d.className='ktsubscriber-guest';
      d.setAttribute('data-guest-slot',String(i));
      d.innerHTML='<span>👤</span><b>게스트</b>';
      people.appendChild(d);
    }
  }

  function hasLiveVideo(tile){
    var videos=tile?tile.querySelectorAll('video'):[];
    for(var i=0;i<videos.length;i++){
      var v=videos[i];
      try{
        if(v.srcObject&&v.srcObject.getTracks&&v.srcObject.getTracks().some(function(t){return t.readyState==='live';}))return true;
      }catch(e){}
      if(v.currentSrc&&v.readyState>=2)return true;
    }
    return false;
  }

  function hasRealParticipant(tile){
    if(!tile)return false;
    if(hasLiveVideo(tile))return true;
    if(tile.querySelector('img[data-kt-live-person],video[data-kt-live-person],[data-kt-remote-person="1"]'))return true;
    return false;
  }

  function setGuestLabel(tile){
    if(!tile)return;
    var occupied=hasRealParticipant(tile);

    if(tile.matches('.ktg13-guest')){
      var g=tile.querySelector(':scope > span');
      if(g){
        if(g.textContent!=='게스트')g.textContent='게스트';
        g.classList.toggle('kt-guest-label-hidden',occupied);
      }
    }

    if(tile.matches('.ktsubscriber-guest')){
      var icon=tile.querySelector(':scope > span');
      var b=tile.querySelector(':scope > b');
      if(b){
        if(b.textContent!=='게스트')b.textContent='게스트';
        b.classList.toggle('kt-guest-label-hidden',occupied);
      }
      if(icon)icon.classList.toggle('kt-guest-label-hidden',occupied);
    }

    if(tile.matches('.ktsecret-slot:not(.host),.ktsecret-guest-slot:not(.host)')){
      var label=tile.querySelector(':scope > .ktsecret-slot-label');
      if(label){
        if(label.textContent!=='게스트')label.textContent='게스트';
        label.classList.toggle('kt-guest-label-hidden',occupied);
      }
      var wait=tile.querySelector(':scope > .ktsecret-guest-wait');
      if(wait){
        var txt=wait.querySelector('span');
        if(txt&&txt.textContent!=='게스트')txt.textContent='게스트';
        wait.classList.toggle('kt-guest-label-hidden',occupied);
      }
    }
  }

  function clean(){
    addStyle();
    ensureSubscriber14();
    document.querySelectorAll('.kt-person-seat-number').forEach(function(n){n.remove();});
    var input=document.getElementById('ktPersonSeatTarget');
    if(input)input.style.setProperty('display','none','important');
    var go=document.querySelector('#ktPersonLayoutPanel [data-act="seatGo"]');
    if(go)go.style.setProperty('display','none','important');

    document.querySelectorAll('.ktg13-guest,.ktsubscriber-guest,.ktsecret-slot:not(.host),.ktsecret-guest-slot:not(.host)').forEach(setGuestLabel);
  }

  document.addEventListener('click',function(e){
    var tile=e.target&&e.target.closest&&e.target.closest('.ktg13-host,.ktg13-guest,.ktsubscriber-host,.ktsubscriber-guest,.ktsecret-slot,.ktsecret-guest-slot');
    if(!tile)return;
    setTimeout(function(){
      clean();
      var t=document.getElementById('ktPersonLayoutSelectedText');
      if(t)t.textContent=tile.matches('.ktg13-host,.ktsubscriber-host,.ktsecret-slot.host')?'호스트 선택':'선택한 사람';
    },0);
  },true);

  ['play','loadeddata','emptied'].forEach(function(name){
    document.addEventListener(name,function(){setTimeout(clean,0);},true);
  });

  clean();
  [100,350,800,1500].forEach(function(ms){setTimeout(clean,ms);});
  try{
    var mo=new MutationObserver(function(){clean();});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 1인방·13명방 출석체크만 비밀방 출석체크 코드/크기와 똑같이 맞춘다. */
(function(){
  if(window.__ktSoloGroup13SecretAttendanceInstalled)return;
  window.__ktSoloGroup13SecretAttendanceInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktSoloGroup13SecretAttendanceStyle'))return;
    var s=document.createElement('style');
    s.id='ktSoloGroup13SecretAttendanceStyle';
    s.textContent='\
      #screen .ktsolo-room .ktsolo-att.kt-secret-att-copy,#screen .ktg13-room .ktg13-attend.kt-secret-att-copy{justify-self:center!important;height:29px!important;min-width:88px!important;width:auto!important;padding:0 3px!important;border-radius:18px!important;border:2px solid #ff2bbd!important;background-color:#130714!important;background-image:radial-gradient(circle,#ff35ce 1.4px,transparent 2px)!important;background-size:8px 8px!important;color:#ffd52f!important;font-size:11px!important;font-weight:950!important;box-shadow:0 0 8px #ff2bbd!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:1px!important;white-space:nowrap!important;line-height:1!important;}\
      #screen .ktsolo-room .ktsolo-att.kt-secret-att-copy img,#screen .ktg13-room .ktg13-attend.kt-secret-att-copy img{width:14px!important;height:14px!important;object-fit:contain!important;margin:0!important;}\
      #screen .ktsolo-room .ktsolo-att.kt-secret-att-copy span,#screen .ktg13-room .ktg13-attend.kt-secret-att-copy span{display:inline!important;margin:0!important;padding:0!important;font-size:inherit!important;line-height:1!important;}\
      @media(max-width:390px){#screen .ktsolo-room .ktsolo-att.kt-secret-att-copy,#screen .ktg13-room .ktg13-attend.kt-secret-att-copy{min-width:82px!important;height:27px!important;font-size:10px!important}#screen .ktsolo-room .ktsolo-att.kt-secret-att-copy img,#screen .ktg13-room .ktg13-attend.kt-secret-att-copy img{width:13px!important;height:13px!important}}';
    document.head.appendChild(s);
  }

  function applyOne(btn){
    if(!btn)return;
    btn.classList.add('kt-secret-att-copy');
    btn.innerHTML='<img src="attendance-wing.svg" alt=""><span>출석체크</span><img src="attendance-wing.svg" alt="">';
    btn.onclick=function(){
      try{
        if(window.openAttendanceBenefits){window.openAttendanceBenefits();return;}
        if(window.ktAttendanceCheck)window.ktAttendanceCheck();
      }catch(e){}
    };
  }

  function apply(){
    ensureStyle();
    applyOne(document.querySelector('.ktsolo-room .ktsolo-att'));
    applyOne(document.querySelector('.ktg13-room .ktg13-attend'));
  }

  apply();
  [60,180,420,900,1500].forEach(function(ms){setTimeout(apply,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktSoloGroup13SecretAttendanceTimer);
      window.__ktSoloGroup13SecretAttendanceTimer=setTimeout(apply,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
