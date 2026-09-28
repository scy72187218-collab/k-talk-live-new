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
    var numbers=[3,5,7,9,11,17,21,27,33,41,50];
    var colors=['파랑','금색','초록','보라','하늘색','주황'];
    var scores=[72,76,79,82,85,88,91,94];
    return {msg:pick(messages,seed),number:pick(numbers,seed>>>3),color:pick(colors,seed>>>6),score:pick(scores,seed>>>9)};
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
      +'<div class="rowbox" style="text-align:center"><b>🔢 행운 숫자</b><br><strong style="font-size:22px">'+f.number+'</strong></div>'
      +'<div class="rowbox" style="text-align:center"><b>🎨 행운 색</b><br><strong style="font-size:22px">'+f.color+'</strong></div>'
      +'</div>'
      +'<small style="display:block;text-align:center;margin-top:10px;color:#aaa">오늘 하루 같은 계정에서는 같은 결과가 표시됩니다.</small>'
      +'</div>';

    if(typeof window.showSheet==='function'){
      window.showSheet('🍀 오늘의 행운',body);
      return;
    }
    var title=document.getElementById('sheetTitle');
    var sb=document.getElementById('sheetBody');
    var sheet=document.getElementById('sheet');
    if(title)title.textContent='🍀 오늘의 행운';
    if(sb)sb.innerHTML=body;
    if(sheet)sheet.classList.add('show');
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
      b.setAttribute('onclick','openTodayFortune()');
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