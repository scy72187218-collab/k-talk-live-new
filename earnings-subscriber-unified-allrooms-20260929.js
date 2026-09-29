/* K-Talk 수익률 통일: 구독자방 카드 기준
   적용: 1인방 / 9명방 / 13명방 / 비밀방, 호스트 + 게스트
   구독자방 자체는 기준으로 유지 */
(function(){
  if(window.__ktUnifiedEarningsSubscriberStyle20260929)return;
  window.__ktUnifiedEarningsSubscriberStyle20260929=true;

  var W=165,H=64,GAP=4;

  function rateInfo(){
    try{
      var name=String((window.state&&(state.nickname||state.userName||state.name))||localStorage.getItem('ktalk_nickname')||'');
      var key=name.replace(/\s+/g,'').toLowerCase();
      if(/태권|taekwon|하이네|haine/.test(key))return {rate:'대표 100%',pct:100};
      if(window.state&&(state.memberType==='agency'||state.agency===true))return {rate:'소속사 65%',pct:65};
      if(window.state&&(state.memberType==='subscriber'||state.subscribed===true||state.subscriptionActive===true))return {rate:'구독자회원 40%',pct:40};
    }catch(e){}
    return {rate:'일반회원 35%',pct:35};
  }

  function currentAmount(hud){
    var el=hud&&hud.querySelector('#hudEarnNet,#ktGuestEarnNet,#ktSubscriberEarnNet,b');
    return String(el&&el.textContent||'0원').trim()||'0원';
  }
  function currentRoses(hud){
    var el=hud&&hud.querySelector('#hudEarnRoses,#ktGuestEarnRoses,#ktSubscriberEarnRoses');
    var t=String(el&&el.textContent||'🌹 0송이').trim();
    return t||'🌹 0송이';
  }

  function subscriberMarkup(hud,isGuest){
    if(!hud)return;
    var r=rateInfo(), amount=currentAmount(hud), roses=currentRoses(hud);
    /* 같은 내용을 반복 덮어쓰지 않는다. */
    var sig=amount+'|'+roses+'|'+r.rate;
    if(hud.dataset.ktUnifiedEarnSig===sig)return;
    hud.dataset.ktUnifiedEarnSig=sig;
    hud.innerHTML=''
      +'<div class="kt-ue-top"><span>🔒 내 수익 · 본인만 표시</span><b class="kt-ue-net">'+amount+'</b></div>'
      +'<div class="kt-ue-detail">'
        +'<span class="kt-ue-roses">'+roses+'</span><span class="kt-ue-current">'+r.rate+'</span>'
        +'<span>구독자회원 40%</span><span>일반회원 35%</span>'
        +'<span class="kt-ue-full">소속사 65%</span>'
      +'</div>';
  }

  function styleHud(hud){
    if(!hud)return;
    [
      ['display','block'],['visibility','visible'],['opacity','1'],
      ['width',W+'px'],['min-width',W+'px'],['max-width',W+'px'],
      ['height',H+'px'],['min-height',H+'px'],['max-height',H+'px'],
      ['margin','0'],['padding','5px 8px'],['box-sizing','border-box'],
      ['border','1px solid rgba(210,169,54,.72)'],['border-radius','13px'],
      ['background','linear-gradient(135deg,#17140b,#0d0d12)'],
      ['color','#fff'],['overflow','hidden'],['text-align','center'],
      ['transform','none'],['animation','none'],['transition','none']
    ].forEach(function(p){hud.style.setProperty(p[0],p[1],'important');});
  }

  function pinHost(room,wrapper,hud,tools){
    if(!room||!wrapper||!hud||!tools)return;
    var rr=room.getBoundingClientRect(),tr=tools.getBoundingClientRect();
    if(!rr.width||!tr.width)return;
    var left=Math.round(rr.right-W-7);
    var top=Math.round(tr.top-H-GAP);
    [
      ['position','fixed'],['left',left+'px'],['right','auto'],['top',top+'px'],['bottom','auto'],
      ['width',W+'px'],['min-width',W+'px'],['max-width',W+'px'],
      ['height',H+'px'],['min-height',H+'px'],['max-height',H+'px'],
      ['margin','0'],['padding','0'],['transform','none'],['z-index','2147483000'],
      ['display','block'],['overflow','visible']
    ].forEach(function(p){wrapper.style.setProperty(p[0],p[1],'important');});
    styleHud(hud);
    subscriberMarkup(hud,false);
  }

  function normalizeHosts(){
    var room,wrap,hud,tools;

    room=document.querySelector('#screen .ktsolo-room');
    if(room){
      wrap=room.querySelector('.ktsolo-earn');hud=wrap&&wrap.querySelector('#myEarnHud');tools=room.querySelector('.ktsolo-tools');
      pinHost(room,wrap,hud,tools);
    }

    room=document.querySelector('#screen .ktg13-room');
    if(room){
      wrap=room.querySelector('.ktg13-earn');hud=wrap&&wrap.querySelector('#myEarnHud');tools=room.querySelector('.ktg13-tools');
      pinHost(room,wrap,hud,tools);
    }

    room=document.querySelector('#screen .ktsecret-room');
    if(room){
      wrap=room.querySelector('.ktsecret-earn-row');hud=wrap&&wrap.querySelector('#myEarnHud');tools=room.querySelector('.ktsecret-tools');
      pinHost(room,wrap,hud,tools);
    }
  }

  function normalizeGuests(){
    /* 승인 게스트 화면 */
    document.querySelectorAll('#screen .kt-guest-hostlike-room').forEach(function(room){
      var hud=room.querySelector('#ktGuestEarnHud,.kgh-earn');
      if(!hud)return;
      var tools=room.querySelector('.kgh-tools')||document.querySelector('#screen .kt-remote-bottom');
      var rr=room.getBoundingClientRect();
      var tr=tools&&tools.getBoundingClientRect();
      var left=Math.round(rr.right-W-7);
      var top=tr&&tr.width?Math.round(tr.top-H-GAP):Math.round(rr.bottom-H-62);
      [
        ['position','fixed'],['left',left+'px'],['right','auto'],['top',top+'px'],['bottom','auto'],
        ['z-index','2147483000']
      ].forEach(function(p){hud.style.setProperty(p[0],p[1],'important');});
      styleHud(hud);
      subscriberMarkup(hud,true);
    });

    /* 일반 원격 게스트 수익표 */
    document.querySelectorAll('#screen #ktAllRoomGuestEarnHud20260921,.kt-remote-live #ktGuestEarnHud').forEach(function(hud){
      var root=hud.closest('.kt-remote-live')||hud.parentElement;
      if(!root)return;
      var tools=root.querySelector('.kt-remote-bottom')||document.querySelector('#screen .kt-remote-bottom');
      var rr=root.getBoundingClientRect(),tr=tools&&tools.getBoundingClientRect();
      var left=Math.round(rr.right-W-7);
      var top=tr&&tr.width?Math.round(tr.top-H-GAP):Math.round(rr.bottom-H-62);
      [['position','fixed'],['left',left+'px'],['right','auto'],['top',top+'px'],['bottom','auto'],['z-index','2147483000']]
        .forEach(function(p){hud.style.setProperty(p[0],p[1],'important');});
      styleHud(hud);
      subscriberMarkup(hud,true);
    });
  }

  function ensureStyle(){
    if(document.getElementById('ktUnifiedEarningsSubscriberStyle20260929'))return;
    var s=document.createElement('style');
    s.id='ktUnifiedEarningsSubscriberStyle20260929';
    s.textContent=''
      +'.kt-ue-top{display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;white-space:nowrap!important}'
      +'.kt-ue-top span{font-size:8px!important;color:#8fe8ff!important;font-weight:950!important;line-height:1.05!important}'
      +'.kt-ue-top b{font-size:12px!important;color:#ffe071!important;font-weight:950!important;line-height:1.05!important}'
      +'.kt-ue-detail{display:grid!important;grid-template-columns:1fr 1fr!important;gap:2px 5px!important;margin-top:3px!important;font-size:7px!important;line-height:1.05!important;color:#ddd!important;white-space:nowrap!important;text-align:left!important}'
      +'.kt-ue-detail span:nth-child(even){text-align:right!important}'
      +'.kt-ue-detail .kt-ue-full{grid-column:1/-1!important;text-align:right!important}'
      +'@media(max-width:390px){.kt-ue-top span{font-size:7px!important}.kt-ue-top b{font-size:11px!important}.kt-ue-detail{font-size:6.4px!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function apply(){
    ensureStyle();
    normalizeHosts();
    normalizeGuests();
  }

  apply();
  [30,100,250,600,1200].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,900);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktUnifiedEarningsSubscriberStyleTimer20260929);
      window.__ktUnifiedEarningsSubscriberStyleTimer20260929=setTimeout(apply,25);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',function(){setTimeout(apply,30);});
  window.addEventListener('orientationchange',function(){setTimeout(apply,120);});
})();