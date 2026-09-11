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
      +'html body #screen .ktsubscriber-room .ktsubscriber-people{grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;grid-auto-flow:row!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-host{grid-column:1!important;grid-row:1/span 2!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-guest{grid-column:auto!important;grid-row:auto!important;min-width:0!important;min-height:0!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-guest>span{font-size:18px!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-guest>b{font-size:7px!important;left:3px!important;bottom:3px!important;padding:2px 4px!important}';
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
