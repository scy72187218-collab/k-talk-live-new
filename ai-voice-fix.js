/* K-Talk AI 한국어 음성 읽기 안정화: 기존 기능만 보강. */
(function(){
  if(window.__ktAiVoiceFixInstalled)return;
  window.__ktAiVoiceFixInstalled=true;

  var synth=window.speechSynthesis;
  var queue=[];
  var speaking=false;

  function getKoVoice(){
    if(!synth||!synth.getVoices)return null;
    var voices=synth.getVoices()||[];
    return voices.find(function(v){return /^ko(-|_)/i.test(v.lang||'');})
      || voices.find(function(v){return /korean|한국/i.test((v.name||'')+' '+(v.lang||''));})
      || null;
  }

  function normalize(text){
    return String(text==null?'':text).replace(/\s+/g,' ').trim().slice(0,280);
  }

  function speakNow(text){
    text=normalize(text);
    if(!text||!synth||typeof window.SpeechSynthesisUtterance!=='function')return false;
    try{
      if(synth.paused&&synth.resume)synth.resume();
      var u=new SpeechSynthesisUtterance(text);
      u.lang='ko-KR';
      u.rate=0.98;
      u.pitch=1.02;
      u.volume=1;
      var v=getKoVoice();
      if(v)u.voice=v;
      speaking=true;
      u.onend=function(){speaking=false;drain();};
      u.onerror=function(){speaking=false;setTimeout(drain,80);};
      synth.speak(u);
      return true;
    }catch(e){speaking=false;return false;}
  }

  function drain(){
    if(speaking||!queue.length)return;
    speakNow(queue.shift());
  }

  window.ktSpeak=function(text){
    try{if(window.state&&state.aiVoiceOn===false)return false;}catch(e){}
    text=normalize(text);
    if(!text)return false;
    if(!synth||typeof window.SpeechSynthesisUtterance!=='function')return false;
    queue.push(text);
    if(queue.length>4)queue=queue.slice(-4);
    drain();
    return true;
  };

  window.ktTestAIVoice=function(){
    try{if(window.state)state.aiVoiceOn=true;}catch(e){}
    try{localStorage.setItem('ktalk_ai_voice','on');}catch(e){}
    try{if(synth&&synth.cancel)synth.cancel();}catch(e){}
    speaking=false;queue=[];
    var msg='K-Talk AI 음성 안내 테스트입니다.';
    var ok=window.ktSpeak(msg);
    if(!ok)alert('이 브라우저에서 음성 읽기를 사용할 수 없습니다. 크롬에서 다시 실행해 주세요.');
    return ok;
  };

  var oldToggle=window.toggleAIVoice;
  window.toggleAIVoice=function(btn){
    if(typeof oldToggle==='function'){
      var r=oldToggle.apply(this,arguments);
      try{if(window.state&&state.aiVoiceOn){setTimeout(function(){window.ktSpeak('에이아이 음성 안내를 켰습니다.');},60);}}catch(e){}
      return r;
    }
    try{state.aiVoiceOn=!state.aiVoiceOn;localStorage.setItem('ktalk_ai_voice',state.aiVoiceOn?'on':'off');}catch(e){}
  };

  var oldOpenAI=window.openAI;
  if(typeof oldOpenAI==='function'){
    window.openAI=function(){
      var r=oldOpenAI.apply(this,arguments);
      setTimeout(function(){
        var body=document.getElementById('sheetBody');
        if(!body)return;
        var buttons=body.querySelectorAll('button');
        buttons.forEach(function(b){
          if((b.textContent||'').indexOf('음성 테스트')>-1){
            b.setAttribute('onclick','ktTestAIVoice()');
          }
        });
      },0);
      return r;
    };
  }

  if(synth&&'onvoiceschanged' in synth){
    try{synth.onvoiceschanged=function(){try{synth.getVoices();}catch(e){}};}catch(e){}
  }
  try{if(synth&&synth.getVoices)synth.getVoices();}catch(e){}
})();

/* 방송방 출석체크 AI: 출석 버튼을 누른 사람의 닉네임 + 감사 인사를 터치 즉시 읽는다. 다른 기능/UI는 건드리지 않음. */
(function(){
  if(window.__ktAttendanceNicknameVoiceInstalled)return;
  window.__ktAttendanceNicknameVoiceInstalled=true;

  function nickname(){
    var name='';
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad()||{};
        name=String(p.nickname||p.name||p.displayName||'').trim();
      }
    }catch(e){}
    if(!name){
      try{
        var sub=typeof window.ktGetSelectedSubAccount==='function'?window.ktGetSelectedSubAccount():'';
        if(sub&&typeof window.ktSubProfileCard==='function'){
          var sp=window.ktSubProfileCard(sub)||{};
          name=String(sp.nickname||sp.name||'').trim();
        }
      }catch(e){}
    }
    if(!name){
      try{
        ['ktalk_nickname','ktalk_profile_name','nickname','profileName','displayName'].some(function(k){
          var v=String(localStorage.getItem(k)||'').trim();
          if(v){name=v;return true;}
          return false;
        });
      }catch(e){}
    }
    return name||'회원';
  }

  function attendanceSpeak(){
    var msg=nickname()+'님, 출석 체크해 주셔서 감사합니다.';
    try{if(window.state)state.aiVoiceOn=true;}catch(e){}
    try{localStorage.setItem('ktalk_ai_voice','on');}catch(e){}
    try{if(window.speechSynthesis&&window.speechSynthesis.cancel)window.speechSynthesis.cancel();}catch(e){}
    try{
      if(typeof window.ktSpeak==='function'&&window.ktSpeak(msg))return;
    }catch(e){}
    try{
      if(!window.speechSynthesis||typeof window.SpeechSynthesisUtterance!=='function')return;
      var u=new SpeechSynthesisUtterance(msg);
      u.lang='ko-KR';
      u.rate=0.98;
      u.pitch=1.02;
      u.volume=1;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  document.addEventListener('pointerdown',function(e){
    var t=e.target;
    if(!t||!t.closest)return;
    var btn=t.closest('.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att,.kt-live-attendance');
    if(!btn)return;
    attendanceSpeak();
  },true);
})();
