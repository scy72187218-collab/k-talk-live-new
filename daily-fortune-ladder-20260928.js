/* K-Talk 하루 1회 무료 오늘의 운세 · 장미 사다리 이벤트
   - 방 만들기 room-switch-row에서 비밀방 바로 옆에 표시
   - 6줄 사다리
   - 무료, 하루 1회
   - 결과: 장미 1/2/3/4/5송이 또는 꽝
   - 다른 방 선택/방송 기능은 변경하지 않음.
*/
(function(){
  if(window.__ktDailyFortuneLadder20260928)return;
  window.__ktDailyFortuneLadder20260928=true;

  var USED_PREFIX='ktalk_daily_fortune_ladder_used:';
  var REWARD_PREFIX='ktalk_daily_fortune_ladder_roses:';

  function todayKey(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function accountKey(){
    try{
      if(typeof window.ktGetSelectedSubAccount==='function'){
        var s=String(window.ktGetSelectedSubAccount()||'').trim();
        if(s)return 'sub:'+s;
      }
    }catch(e){}
    try{
      if(typeof window.ktProfileAccountKey==='function'){
        var k=String(window.ktProfileAccountKey()||'').trim();
        if(k)return k;
      }
    }catch(e){}
    try{
      var id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||localStorage.getItem('ktalk_device_user_id')||'default';
      return String(id);
    }catch(e){return 'default';}
  }
  function usedKey(){return USED_PREFIX+accountKey()+':'+todayKey();}
  function alreadyUsed(){try{return localStorage.getItem(usedKey())==='1';}catch(e){return false;}}
  function markUsed(){try{localStorage.setItem(usedKey(),'1');}catch(e){}}

  function addRoses(n){
    n=Math.max(0,parseInt(n,10)||0); if(!n)return 0;
    var keys=['ktalk_rose_balance','ktalk_roses','ktalk_received_roses','roseBalance','roses'];
    var current=0;
    try{
      keys.forEach(function(k){
        var v=parseInt(localStorage.getItem(k)||'0',10)||0;
        if(v>current)current=v;
      });
    }catch(e){}
    var next=current+n;
    try{keys.forEach(function(k){localStorage.setItem(k,String(next));});}catch(e){}
    try{
      var rewardKey=REWARD_PREFIX+accountKey();
      var total=parseInt(localStorage.getItem(rewardKey)||'0',10)||0;
      localStorage.setItem(rewardKey,String(total+n));
    }catch(e){}
    try{
      if(window.state){
        state.roses=next;
        state.roseBalance=next;
        state.receivedRoses=next;
      }
    }catch(e){}
    try{
      var el=document.getElementById('hudEarnRoses')||document.getElementById('ktSubscriberEarnRoses')||document.getElementById('ktGuestEarnRoses');
      if(el)el.textContent='🌹 '+next.toLocaleString('ko-KR')+'송이';
    }catch(e){}
    try{
      if(typeof window.ktLevelAddRoses==='function')window.ktLevelAddRoses(n);
    }catch(e){}
    return next;
  }

  var fortunes=[
    '작은 행운이 먼저 찾아오는 날입니다.',
    '반가운 소식이 들어올 수 있는 날입니다.',
    '천천히 움직이면 좋은 결과가 생기는 날입니다.',
    '사람과의 인연에서 좋은 기운이 들어오는 날입니다.',
    '기분 좋은 일이 하나 생길 수 있는 날입니다.',
    '오늘은 무리하지 말고 다음 행운을 기다려 보세요.'
  ];

  function shuffle(a){
    a=a.slice();
    for(var i=a.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1));
      var t=a[i];a[i]=a[j];a[j]=t;
    }
    return a;
  }

  function ladderSvg(){
    var xs=[30,84,138,192,246,300];
    var ys=[50,90,130,170,210,250,290];
    var pairs=[[0,1],[1,2],[2,3],[3,4],[4,5]];
    var rungRows=[];
    ys.forEach(function(y,idx){
      var usable=shuffle(pairs).slice(0,idx%2===0?2:1);
      usable.forEach(function(p){rungRows.push({a:p[0],b:p[1],y:y});});
    });
    var s='<svg viewBox="0 0 330 330" width="100%" height="330" aria-label="6줄 사다리">';
    xs.forEach(function(x){s+='<line x1="'+x+'" y1="24" x2="'+x+'" y2="305" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>';});
    rungRows.forEach(function(r){s+='<line x1="'+xs[r.a]+'" y1="'+r.y+'" x2="'+xs[r.b]+'" y2="'+r.y+'" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>';});
    xs.forEach(function(x,i){s+='<text x="'+x+'" y="18" text-anchor="middle" font-size="13" font-weight="900" fill="currentColor">'+(i+1)+'</text>';});
    s+='</svg>';
    return s;
  }

  function outcomeLabels(){
    return ['🌹 1개','🌹 2개','🌹 3개','🌹 4개','🌹 5개','꽝'];
  }

  function eventHtml(){
    var used=alreadyUsed();
    return ''
      +'<div class="rowbox" style="text-align:center"><b>🎯 오늘의 운세 · 장미따먹기</b><br>무료 이벤트 · 하루에 한 번 참여할 수 있습니다.</div>'
      +'<div id="ktFortuneLadder20260928" style="margin:10px 0;padding:10px;border-radius:16px;background:#0c0c13;color:#ffe071;border:1px solid #ffffff22">'+ladderSvg()+'</div>'
      +'<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:4px;margin:6px 0 12px">'
      +outcomeLabels().map(function(x,i){return '<div style="padding:7px 1px;border-radius:9px;background:#181820;text-align:center;font-size:9px;font-weight:900">'+(i+1)+'번<br>'+x+'</div>';}).join('')
      +'</div>'
      +'<div class="rowbox"><b>결과</b><br>어느 번호가 나올지는 시작하기 전에는 알 수 없습니다.</div>'
      +(used
        ?'<button class="act" type="button" disabled style="opacity:.55">오늘 이벤트 참여 완료</button>'
        :'<button class="act" type="button" onclick="ktPlayDailyFortuneLadder20260928(this)">🎲 오늘의 운세 시작</button>');
  }

  window.ktOpenDailyFortuneLadder20260928=function(){
    try{
      if(typeof window.showSheet==='function')window.showSheet('🎯 오늘의 운세',eventHtml());
    }catch(e){}
    return false;
  };

  window.ktPlayDailyFortuneLadder20260928=function(btn){
    if(alreadyUsed()){
      try{alert('오늘 이벤트는 이미 참여했습니다. 내일 다시 참여해 주세요.');}catch(e){}
      return false;
    }
    if(btn){btn.disabled=true;btn.textContent='사다리 타는 중...';}
    var slot=Math.floor(Math.random()*6); // 0~5
    var reward=slot===5?0:slot+1;
    markUsed();

    setTimeout(function(){
      var fortune=fortunes[slot]||fortunes[0];
      var result=reward?('🌹 장미 '+reward+'송이 당첨!'):'꽝! 오늘은 운세만 받아가세요.';
      if(reward)addRoses(reward);
      var html=''
        +'<div class="rowbox" style="text-align:center;border-color:#ffe071;background:rgba(255,224,113,.08)"><b>🎉 '+(slot+1)+'번 결과</b><br><span style="font-size:18px;font-weight:950">'+result+'</span></div>'
        +'<div class="rowbox"><b>🔮 오늘의 운세</b><br>'+fortune+'</div>'
        +'<div class="rowbox"><b>참여 완료</b><br>오늘은 1회 참여가 끝났습니다. 내일 다시 이용할 수 있습니다.</div>';
      try{
        if(typeof window.showSheet==='function')window.showSheet('🎯 오늘의 운세 결과',html);
        if(typeof window.ktAnnounceEvent==='function')window.ktAnnounceEvent('reward',{text:reward?'오늘의 운세 장미 '+reward+'송이 당첨':'오늘의 운세 꽝'});
      }catch(e){}
    },900);
    return false;
  };

  function makeButton(){
    var b=document.createElement('button');
    b.type='button';
    b.className='room-switch kt-daily-fortune-room-switch';
    b.innerHTML='<span style="font-size:15px">🎯</span><b style="display:block">오늘의 운세</b><small style="display:block;font-size:8px">하루 1번 무료</small>';
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
      window.ktOpenDailyFortuneLadder20260928();
      return false;
    };
    return b;
  }

  function install(){
    var row=document.querySelector('.live-prep .room-switch-row');
    if(!row)return;
    if(row.querySelector('.kt-daily-fortune-room-switch'))return;
    var secret=[].slice.call(row.querySelectorAll('.room-switch')).find(function(b){
      return String(b.textContent||'').replace(/\s+/g,'').indexOf('비밀')>-1;
    });
    var b=makeButton();
    if(secret&&secret.nextSibling)row.insertBefore(b,secret.nextSibling);
    else if(secret)row.appendChild(b);
    else row.appendChild(b);
  }

  install();
  [100,300,700,1400,2600].forEach(function(ms){setTimeout(install,ms);});
  try{
    new MutationObserver(function(){setTimeout(install,20);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();