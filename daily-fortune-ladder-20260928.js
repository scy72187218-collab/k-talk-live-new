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
    '오늘은 작은 행운이 자연스럽게 따라오는 날입니다.',
    '좋은 사람과 좋은 이야기가 이어질 수 있는 날입니다.',
    '기다리던 소식이 기분 좋게 들어올 수 있습니다.',
    '천천히 움직일수록 좋은 결과를 만날 가능성이 큽니다.',
    '오늘의 선택이 내일의 좋은 기회로 이어질 수 있습니다.',
    '웃는 일이 한 번 더 생길 수 있는 따뜻한 하루입니다.',
    '주변 사람의 도움이나 응원이 힘이 되는 날입니다.',
    '작게 시작한 일이 생각보다 좋은 흐름으로 이어질 수 있습니다.',
    '기분 좋은 우연을 만날 수 있는 날입니다.',
    '오늘은 새로운 생각이 좋은 결과를 불러올 수 있습니다.',
    '마음 편하게 움직이면 좋은 흐름을 탈 수 있는 날입니다.',
    '대화 속에서 반가운 기회가 생길 수 있습니다.',
    '오늘은 서두르지 않아도 좋은 일이 찾아올 수 있습니다.',
    '작은 배려가 큰 기쁨으로 돌아올 수 있는 날입니다.',
    '하고 싶었던 일을 가볍게 시작해 보기 좋은 날입니다.',
    '오늘은 웃을 일이 하나쯤 생길 가능성이 높은 날입니다.',
    '좋은 인연과 좋은 소식이 가까이 있는 날입니다.',
    '평소보다 기분 좋은 결과를 만날 수 있는 날입니다.'
  ];

  function shuffle(a){
    a=a.slice();
    for(var i=a.length-1;i>0;i--){
      var j=Math.floor(Math.random()*(i+1));
      var t=a[i];a[i]=a[j];a[j]=t;
    }
    return a;
  }

  function buildLadderData(){
    var xs=[30,84,138,192,246,300];
    var ys=[50,90,130,170,210,250,290];
    var links=[];
    ys.forEach(function(y,idx){
      var order=shuffle([0,1,2,3,4]);
      var used={};
      var count=idx%2===0?2:1;
      for(var k=0;k<order.length&&count>0;k++){
        var a=order[k];
        if(used[a]||used[a+1])continue;
        used[a]=used[a+1]=true;
        links.push({a:a,b:a+1,y:y});
        count--;
      }
    });
    return {xs:xs,ys:ys,links:links};
  }

  function tracePath(data,startIndex){
    var idx=startIndex;
    var pts=[{x:data.xs[idx],y:24}];
    data.ys.forEach(function(y){
      pts.push({x:data.xs[idx],y:y});
      var link=data.links.find(function(r){return r.y===y&&(r.a===idx||r.b===idx);});
      if(link){
        idx=(link.a===idx)?link.b:link.a;
        pts.push({x:data.xs[idx],y:y});
      }
    });
    pts.push({x:data.xs[idx],y:305});
    return {endIndex:idx,points:pts};
  }

  function ladderSvg(data){
    data=data||buildLadderData();
    var xs=data.xs,ys=data.ys,rungRows=data.links;
    var s='<svg id="ktFortuneLadderSvg20260928" viewBox="0 0 330 330" width="100%" height="330" aria-label="6줄 사다리">';
    xs.forEach(function(x){s+='<line x1="'+x+'" y1="24" x2="'+x+'" y2="305" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>';});
    rungRows.forEach(function(r){s+='<line x1="'+xs[r.a]+'" y1="'+r.y+'" x2="'+xs[r.b]+'" y2="'+r.y+'" stroke="currentColor" stroke-width="5" stroke-linecap="round"/>';});
    xs.forEach(function(x,i){s+='<text x="'+x+'" y="18" text-anchor="middle" font-size="13" font-weight="900" fill="currentColor">'+(i+1)+'</text>';});
    s+='<polyline id="ktFortunePath20260928" points="" fill="none" stroke="#ff4fa3" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>';
    s+='<circle id="ktFortuneDot20260928" cx="0" cy="0" r="7" fill="#ffd84f" stroke="#fff" stroke-width="2" opacity="0"/>';
    s+='</svg>';
    return s;
  }

  function luckyNumbers20260928(){
    var nums=[];
    while(nums.length<6){
      var n=1+Math.floor(Math.random()*99);
      if(nums.indexOf(n)<0)nums.push(n);
    }
    nums.sort(function(a,b){return a-b;});
    return nums;
  }

  function outcomeLabels(){
    return ['🌹 1개','🌹 2개','🌹 3개','🌹 4개','🌹 5개','꽝'];
  }

  function weightedOutcomeSlot20260929(){
    var r=Math.random()*100;
    if(r<30)return 0;   // 1송이 30%
    if(r<56)return 1;   // 2송이 26%
    if(r<78)return 2;   // 3송이 22%
    if(r<84)return 3;   // 4송이 6%
    if(r<87)return 4;   // 5송이 3%
    return 5;           // 꽝 13%
  }

  function buildWeightedLadderForStart20260929(startIndex){
    var target=weightedOutcomeSlot20260929();
    var best=null;
    for(var n=0;n<120;n++){
      var data=buildLadderData();
      var trace=tracePath(data,startIndex);
      if(!best)best={data:data,trace:trace};
      if(trace.endIndex===target)return {data:data,trace:trace};
    }
    return best;
  }

  function eventHtml(){
    var used=alreadyUsed();
    window.__ktFortuneLadderData20260928=buildLadderData();
    var d=window.__ktFortuneLadderData20260928;
    return ''
      +'<div class="rowbox" style="text-align:center"><b>🎯 오늘의 운세 · 장미따먹기</b><br>무료 이벤트 · 하루에 한 번 참여할 수 있습니다.</div>'
      +'<div class="rowbox"><b>번호 하나를 골라주세요</b><br>고른 번호에서 사다리가 실제로 내려가서 마지막 결과에 도착합니다.</div>'+'<div class="rowbox" style="border-color:#ffd84f;background:rgba(255,216,79,.08)"><b>🎁 2주 행운 추첨</b><br>하루에 한 번 무료로 참여할 수 있습니다.<br>사다리타기에 참여하면 <strong>2주 행운 추첨에 자동 응모</strong>됩니다.<br><strong>행운 숫자 6개를 맞힐 필요 없습니다.</strong><br>2주에 한 번, 2주 동안 참여한 사람 중에서 1등·2등·3등을 추첨합니다.<br>1등 이벤트 장미 100개 · 2등 50개 · 3등 30개<br><small>오늘의 행운 숫자 6개는 재미로 보는 숫자입니다. 이벤트 장미는 현금 환전 불가입니다.</small></div>'
      +'<div style="display:grid;grid-template-columns:repeat(6,1fr);gap:5px;margin:8px 0">'
      +[1,2,3,4,5,6].map(function(n){return '<button type="button" '+(used?'disabled':'')+' onclick="ktPlayDailyFortuneLadder20260928('+n+',this)" style="height:42px;border:1px solid #ffffff33;border-radius:10px;background:#1a1a22;color:#fff;font-weight:950">'+n+'번</button>';}).join('')
      +'</div>'
      +'<div id="ktFortuneLadder20260928" style="margin:10px 0;padding:10px;border-radius:16px;background:#0c0c13;color:#ffe071;border:1px solid #ffffff22">'+ladderSvg(d)+'</div>'
      +'<div style="margin:6px 0 12px;padding:10px;border-radius:12px;background:#181820;text-align:center;font-size:11px;font-weight:900;color:#ddd">🔒 장미 결과는 사다리가 끝난 뒤 공개됩니다.</div>'
      +(used?'<div class="rowbox"><b>오늘 참여 완료</b><br>내일 다시 참여할 수 있습니다.</div>':'')
      +'<div class="rowbox" style="margin-top:10px;border-color:#65d6ff;background:rgba(40,160,255,.08)"><b>📡 하이네통신</b><br>인터넷 · CCTV · LAN · 키폰 · 네트워크 설치<br><strong>🤖 AI 24시간 상담 · 예상견적 안내</strong><br><button type="button" onclick="window.open(\'https://nextnet-it-solutions-24-7-ai-consultant.ai.studio\',\'_blank\',\'noopener\')" style="margin-top:8px;width:100%;height:42px;border:0;border-radius:10px;background:#1e8fff;color:#fff;font-weight:950">하이네통신 바로가기</button></div>';
  }

  window.ktOpenDailyFortuneLadder20260928=function(){
    try{
      if(typeof window.showSheet==='function')window.showSheet('🎯 오늘의 운세',eventHtml());
      var guide='오늘의 운세 장미 사다리 이벤트입니다. 하루에 한 번 무료로 참여할 수 있습니다. 1번부터 6번 중 하나를 선택하세요. 사다리 결과는 장미 1송이부터 5송이 또는 꽝 한 칸입니다. 참여하면 2주 행운 추첨에 자동 응모됩니다.';
      if(typeof window.ktSpeak==='function')window.ktSpeak(guide);
    }catch(e){}
    return false;
  };

  window.ktPlayDailyFortuneLadder20260928=function(startNumber,btn){
    if(alreadyUsed()){
      try{alert('오늘 이벤트는 이미 참여했습니다. 내일 다시 참여해 주세요.');}catch(e){}
      return false;
    }
    var startIndex=Math.max(0,Math.min(5,(parseInt(startNumber,10)||1)-1));
    var weighted=buildWeightedLadderForStart20260929(startIndex);
    var d=weighted&&weighted.data?weighted.data:(window.__ktFortuneLadderData20260928||buildLadderData());
    var trace=weighted&&weighted.trace?weighted.trace:tracePath(d,startIndex);
    window.__ktFortuneLadderData20260928=d;
    try{
      var wrap=document.getElementById('ktFortuneLadder20260928');
      if(wrap)wrap.innerHTML=ladderSvg(d);
    }catch(e){}
    markUsed();

    try{
      document.querySelectorAll('[onclick^="ktPlayDailyFortuneLadder20260928"]').forEach(function(b){b.disabled=true;b.style.opacity='.55';});
      if(btn){btn.style.opacity='1';btn.textContent=startNumber+'번 선택';}
    }catch(e){}

    var path=document.getElementById('ktFortunePath20260928');
    var dot=document.getElementById('ktFortuneDot20260928');
    var pts=trace.points;
    var poly=pts.map(function(p){return p.x+','+p.y;}).join(' ');
    if(path){path.setAttribute('points',poly);path.setAttribute('opacity','1');}
    if(dot){dot.setAttribute('opacity','1');dot.setAttribute('cx',String(pts[0].x));dot.setAttribute('cy',String(pts[0].y));}

    var i=0;
    function step(){
      if(i>=pts.length){
        var slot=trace.endIndex;
        var reward=slot===5?0:slot+1;
        var fortune=fortunes[Math.floor(Math.random()*fortunes.length)]||fortunes[0];
        var lucky=luckyNumbers20260928();
        var result=reward?('🌹 장미 '+reward+'송이 당첨!'):'꽝! 오늘은 좋은 운세를 받아가세요.';
        if(reward)addRoses(reward);
        setTimeout(function(){
          var html=''
            +'<div class="rowbox" style="text-align:center;border-color:#ffe071;background:rgba(255,224,113,.08)"><b>🎉 '+startNumber+'번에서 출발해 '+(slot+1)+'번에 도착</b><br><span style="font-size:18px;font-weight:950">'+result+'</span></div>'
            +'<div class="rowbox"><b>🔮 오늘의 운세</b><br>'+fortune+'</div>'
            +'<div class="rowbox"><b>✨ 오늘의 행운 숫자</b><br><span style="font-size:17px;font-weight:950;letter-spacing:3px">'+lucky.join(' · ')+'</span><br><small>재미로 보는 운세용 숫자입니다.</small></div>'
            +'<div class="rowbox"><b>참여 완료</b><br>오늘은 1회 참여가 끝났습니다. 내일 다시 이용할 수 있습니다.</div>';
          try{
            if(typeof window.showSheet==='function')window.showSheet('🎯 오늘의 운세 결과',html);
            var spokenResult=reward
              ? ('축하합니다. '+startNumber+'번에서 출발해 '+(slot+1)+'번에 도착했습니다. 장미 '+reward+'송이 당첨입니다. 오늘의 행운 숫자는 '+lucky.join(', ')+' 입니다.')
              : ('아쉽게도 꽝입니다. '+startNumber+'번에서 출발해 '+(slot+1)+'번에 도착했습니다. 오늘의 행운 숫자는 '+lucky.join(', ')+' 입니다.');
            if(typeof window.ktSpeak==='function')window.ktSpeak(spokenResult);
            if(typeof window.ktAnnounceEvent==='function')window.ktAnnounceEvent('reward',{text:reward?'오늘의 운세 장미 '+reward+'송이 당첨':'오늘의 운세 이벤트 완료'});
          }catch(e){}
        },350);
        return;
      }
      if(dot){
        dot.setAttribute('cx',String(pts[i].x));
        dot.setAttribute('cy',String(pts[i].y));
      }
      i++;
      setTimeout(step,260);
    }
    step();
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