/* K-Talk 자리 이동 표시 정리: 번호는 숨기고 호스트/운영진이 사람 사진을 눌러 자리 위/아래 이동만 사용. */
(function(){
  if(window.__ktRoomPersonLayoutNoNumberInstalled)return;
  window.__ktRoomPersonLayoutNoNumberInstalled=true;

  function addStyle(){
    if(document.getElementById('ktRoomPersonLayoutNoNumberStyle'))return;
    var s=document.createElement('style');
    s.id='ktRoomPersonLayoutNoNumberStyle';
    s.textContent='.kt-person-seat-number{display:none!important}.kt-person-layout-panel #ktPersonSeatTarget,.kt-person-layout-panel [data-act="seatGo"]{display:none!important}';
    document.head.appendChild(s);
  }

  function clean(){
    addStyle();
    document.querySelectorAll('.kt-person-seat-number').forEach(function(n){n.remove();});
    var input=document.getElementById('ktPersonSeatTarget');
    if(input)input.style.setProperty('display','none','important');
    var go=document.querySelector('#ktPersonLayoutPanel [data-act="seatGo"]');
    if(go)go.style.setProperty('display','none','important');
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

  clean();
  [100,350,800,1500].forEach(function(ms){setTimeout(clean,ms);});
  try{
    var mo=new MutationObserver(function(){clean();});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
