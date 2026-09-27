/* K-Talk: 받은 장미 숫자를 누르면 누가 몇 개 줬는지 표시.
   모든 방송방 공통. 호스트/승인 게스트 본인 수령 내역을 기록한다. */
(function(){
  if(window.__ktReceivedRoseSenderHistory20260928)return;
  window.__ktReceivedRoseSenderHistory20260928=true;

  var entries=[];
  var totals={};

  function num(v){
    var n=parseInt(String(v==null?'':v).replace(/[^0-9]/g,''),10);
    return isFinite(n)?Math.max(0,n):0;
  }

  function cleanName(v){
    v=String(v||'회원').replace(/\s+/g,' ').trim();
    return v||'회원';
  }

  window.ktRecordReceivedRose=function(sender,count,giftName,role){
    var n=num(count);
    if(!n)return;
    var who=cleanName(sender);
    entries.push({
      sender:who,
      count:n,
      gift:String(giftName||'장미'),
      role:String(role||''),
      at:Date.now()
    });
    if(entries.length>300)entries=entries.slice(-300);
    totals[who]=(totals[who]||0)+n;
    save();
  };

  function save(){
    try{
      sessionStorage.setItem('kt_received_rose_history_20260928',JSON.stringify({entries:entries,totals:totals}));
    }catch(e){}
  }

  function load(){
    try{
      var raw=sessionStorage.getItem('kt_received_rose_history_20260928');
      if(!raw)return;
      var d=JSON.parse(raw);
      if(d&&Array.isArray(d.entries))entries=d.entries.slice(-300);
      if(d&&d.totals&&typeof d.totals==='object')totals=d.totals;
    }catch(e){}
  }

  function totalCount(){
    return Object.keys(totals).reduce(function(sum,k){return sum+num(totals[k]);},0);
  }

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function openHistory(){
    if(typeof window.showSheet!=='function')return;

    var names=Object.keys(totals).sort(function(a,b){return num(totals[b])-num(totals[a]);});
    var html='';

    if(!names.length){
      html='<div class="rowbox"><b>🌹 받은 장미 내역</b><br>아직 기록된 장미 선물이 없습니다.</div>';
    }else{
      html+='<div class="rowbox" style="border-color:#ffd75a;background:rgba(255,215,90,.08)"><b>🌹 받은 장미 총 '+totalCount().toLocaleString('ko-KR')+'개</b><br>보낸 사람별 받은 수량입니다.</div>';
      names.forEach(function(name){
        html+='<div class="rowbox"><b>👤 '+esc(name)+'</b><br>🌹 '+num(totals[name]).toLocaleString('ko-KR')+'개</div>';
      });
      var recent=entries.slice(-20).reverse();
      if(recent.length){
        html+='<div class="note"><b>최근 내역</b><br>'+recent.map(function(x){
          return esc(x.sender)+' · '+esc(x.gift)+' · '+num(x.count).toLocaleString('ko-KR')+'개';
        }).join('<br>')+'</div>';
      }
    }

    window.showSheet('🌹 누가 장미를 줬나요?',html);
  }
  window.ktOpenReceivedRoseHistory=openHistory;

  function ensureStyle(){
    if(document.getElementById('ktReceivedRoseSenderHistoryStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktReceivedRoseSenderHistoryStyle20260928';
    s.textContent=''
      +'#screen .kt-five-host-rose,#screen .kt-rose-count-badge,#screen .kt-allguest-rose,#screen #hudEarnRoses,#screen #ktSubscriberEarnRoses,#screen #ktGuestEarnRoses{pointer-events:auto!important;cursor:pointer!important;touch-action:manipulation!important}'
      +'#screen .kt-five-host-rose,#screen .kt-rose-count-badge{box-shadow:0 0 0 1px rgba(255,215,90,.22),0 1px 4px #0008!important}';
    document.head.appendChild(s);
  }

  function isOwnRoseTarget(el){
    if(!el)return false;
    if(el.matches('#hudEarnRoses,#ktSubscriberEarnRoses,#ktGuestEarnRoses'))return true;
    if(el.matches('.kt-five-host-rose'))return true;
    if(el.matches('.kt-rose-count-badge')){
      var tile=el.parentElement;
      if(tile&&(
        tile.matches('.ktg13-host,.ktg9-host,.ktsubscriber-host,.ktsolo-main,.ktsecret-slot.host,.ktsecret-host')||
        tile.matches('.kgh-cell.self')
      ))return true;
    }
    return false;
  }

  document.addEventListener('click',function(e){
    var el=e.target&&e.target.closest?e.target.closest(
      '#hudEarnRoses,#ktSubscriberEarnRoses,#ktGuestEarnRoses,.kt-five-host-rose,.kt-rose-count-badge'
    ):null;
    if(!el||!isOwnRoseTarget(el))return;
    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(_e){}
    openHistory();
  },true);

  load();
  ensureStyle();
  [100,400,900,1800].forEach(function(ms){setTimeout(ensureStyle,ms);});
})();