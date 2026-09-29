/* K-Talk 오늘의 행운 2026-09-29 - robust */
(function(){
  if(window.__ktTodayFortune20260929v2)return;
  window.__ktTodayFortune20260929v2=true;

  function accountKey(){
    try{
      if(window.ktGetSelectedSubAccount){
        var k=window.ktGetSelectedSubAccount();
        if(k)return String(k);
      }
    }catch(e){}
    return 'guest';
  }
  function todayKey(){
    var d=new Date();
    return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
  }
  function hash(s){
    var h=2166136261;
    for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}
    return h>>>0;
  }
  function pick(a,n){return a[n%a.length];}
  function fortune(){
    var seed=hash(todayKey()+'|'+accountKey());
    var messages=[
      '좋은 소식이 들어올 수 있는 날입니다.',
      '작은 기회가 큰 흐름으로 이어질 수 있습니다.',
      '사람과의 대화에서 좋은 힌트를 얻을 수 있습니다.',
      '서두르지 않고 차분하게 하면 결과가 좋아집니다.',
      '오늘은 시작한 일을 끝까지 밀어붙이기 좋은 날입니다.',
      '기분 좋은 연락이나 만남이 생길 수 있습니다.',
      '평소 생각해 둔 일을 하나 실행해 보기 좋은 날입니다.'
    ];
    var colors=['파랑','금색','초록','보라','하늘색','주황'];
    var scores=[72,76,79,82,85,88,91,94];
    var nums=[];
    var x=seed||1;
    while(nums.length<6){
      x=(Math.imul(x,1664525)+1013904223)>>>0;
      var n=1+(x%45);
      if(nums.indexOf(n)<0)nums.push(n);
    }
    nums.sort(function(a,b){return a-b;});
    return {msg:pick(messages,seed),numbers:nums,color:pick(colors,seed>>>6),score:pick(scores,seed>>>9)};
  }

  var __ktFortuneLastSpeakAt=0;
  function readTodayFortune20260930(f){
    try{
      var synth=window.speechSynthesis;
      var U=window.SpeechSynthesisUtterance;
      if(!synth||typeof U!=='function')return;
      var text='오늘의 행운. '+f.score+'점. '+f.msg+' 행운 숫자는 '+f.numbers.join(', ')+' 입니다. 행운 색은 '+f.color+' 입니다.';
      var speakNow=function(){
        try{
          var now=Date.now();
          if(now-__ktFortuneLastSpeakAt<900)return;
          __ktFortuneLastSpeakAt=now;
          var u=new U(text);
          u.lang='ko-KR';
          u.rate=0.95;
          u.pitch=1;
          try{
            var voices=synth.getVoices()||[];
            var ko=voices.find(function(v){return /^ko(-|_)/i.test(String(v.lang||''));});
            if(ko)u.voice=ko;
          }catch(e){}
          try{synth.resume();}catch(e){}
          synth.speak(u);
        }catch(e){}
      };
      /* 안드로이드에서는 클릭 동작 안에서 바로 speak 해야 소리가 나는 경우가 많다. */
      speakNow();
      /* 음성 목록이 늦게 준비되는 기기만 한 번 더 보완한다. */
      try{
        if(!(synth.getVoices()||[]).length){
          var once=function(){
            try{synth.removeEventListener('voiceschanged',once);}catch(e){}
            try{speakNow();}catch(e){}
          };
          synth.addEventListener('voiceschanged',once);
          setTimeout(function(){try{synth.removeEventListener('voiceschanged',once);}catch(e){}},1800);
        }
      }catch(e){}
    }catch(e){}
  }

  window.openTodayFortune=function(){
    var f=fortune();
    var body=''
      +'<div style="padding:8px 2px 4px">'
      +'<div style="text-align:center;padding:18px 10px;border-radius:20px;background:linear-gradient(145deg,#16142a,#080910);border:1px solid rgba(255,215,92,.35)">'
      +'<div style="font-size:48px">🍀</div>'
      +'<b style="display:block;margin-top:4px;font-size:22px;color:#ffe071">오늘의 행운</b>'
      +'<strong style="display:block;margin-top:12px;font-size:36px;color:#fff">'+f.score+'점</strong>'
      +'<p style="margin:12px 8px 4px;color:#fff;font-size:15px;line-height:1.55">'+f.msg+'</p>'
      +'</div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">'
      +'<div class="rowbox" style="text-align:center"><b>🔢 행운 숫자 6개</b><br><strong style="font-size:15px;letter-spacing:2px">'+f.numbers.join(' · ')+'</strong></div>'
      +'<div class="rowbox" style="text-align:center"><b>🎨 행운 색</b><br><strong style="font-size:22px">'+f.color+'</strong></div>'
      +'</div>'
      +'<button type="button" class="act" onclick="if(window.ktOpenDailyFortuneLadder20260928)ktOpenDailyFortuneLadder20260928()" style="margin-top:10px;width:100%;background:linear-gradient(135deg,#ff4f88,#ff9c2a)!important;color:#fff!important;font-weight:950!important">🎯 사다리 타고 장미 받기</button>'
      +'<small style="display:block;text-align:center;margin-top:8px;color:#aaa">사다리 결과는 🌹1·2·3·4·5송이 또는 꽝 1칸입니다. 하루 1회 참여합니다.</small>'
      +'<small style="display:block;text-align:center;margin-top:6px;color:#aaa">오늘 하루 같은 계정에서는 같은 운세 결과가 표시됩니다.</small>'
      +'</div>';

    if(typeof window.showSheet==='function'){
      window.showSheet('🍀 오늘의 행운',body);
      readTodayFortune20260930(f);
      return;
    }
    var title=document.getElementById('sheetTitle');
    var sb=document.getElementById('sheetBody');
    var sheet=document.getElementById('sheet');
    if(title)title.textContent='🍀 오늘의 행운';
    if(sb)sb.innerHTML=body;
    if(sheet)sheet.classList.add('show');
    readTodayFortune20260930(f);
  };

  function addButton(){
    try{
      var sheet=document.getElementById('sheet');
      var body=document.getElementById('sheetBody');
      var title=document.getElementById('sheetTitle');
      if(!sheet||!body||!title)return;
      var t=String(title.textContent||'');
      var isMenu=t.indexOf('K-Talk')>=0||t.indexOf('사용방법')>=0||t.indexOf('안내')>=0;
      if(!isMenu)return;
      if(document.getElementById('ktTodayFortuneBtn20260929'))return;
      var b=document.createElement('button');
      b.id='ktTodayFortuneBtn20260929';
      b.type='button';
      b.className='act';
      b.style.cssText='margin-top:10px!important;background:linear-gradient(135deg,#1fa66a,#75d65b)!important;color:#fff!important;font-weight:950!important;pointer-events:auto!important;touch-action:manipulation!important';
      b.innerHTML='🍀 오늘의 행운';
      body.appendChild(b);
    }catch(e){}
  }

  var oldOpenMenu=window.openMenu;
  if(typeof oldOpenMenu==='function'&&!oldOpenMenu.__ktFortunePatchedV2){
    var wrap=function(){
      var r=oldOpenMenu.apply(this,arguments);
      [0,30,100,250].forEach(function(ms){setTimeout(addButton,ms);});
      return r;
    };
    wrap.__ktFortunePatchedV2=true;
    window.openMenu=wrap;
  }

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('#ktTodayFortuneBtn20260929'):null;
    if(!b)return;
    try{e.preventDefault();e.stopPropagation();}catch(err){}
    window.openTodayFortune();
  },true);

  try{
    new MutationObserver(function(){setTimeout(addButton,10);}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();