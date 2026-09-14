/* K-Talk 이용방법·혜택 음성 읽기 전용. 다른 화면/기능은 변경하지 않음. */
(function(){
  if(window.__ktAiHelpReader20260915)return;
  window.__ktAiHelpReader20260915=true;

  var speakingToken=0;

  function voiceOn(){
    try{return !!(window.state&&state.aiVoiceOn);}catch(e){return true;}
  }
  function clean(v){
    return String(v==null?'':v)
      .replace(/[♛🌹🎁📱📘✅👤💰🪙🎯📣🚩❔✉👑]/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }
  function pickVoice(){
    try{
      var vs=speechSynthesis.getVoices?speechSynthesis.getVoices():[];
      return vs.find(function(v){return /^ko(-|_)/i.test(v.lang||'');})||null;
    }catch(e){return null;}
  }
  function chunks(text){
    text=clean(text);
    if(!text)return [];
    var parts=text.split(/(?<=[.!?。]|다\.|요\.|니다\.)\s+/);
    var out=[],buf='';
    parts.forEach(function(p){
      p=clean(p);if(!p)return;
      if((buf+' '+p).trim().length>170){if(buf)out.push(buf);buf=p;}else buf=(buf+' '+p).trim();
    });
    if(buf)out.push(buf);
    if(!out.length){for(var i=0;i<text.length;i+=150)out.push(text.slice(i,i+150));}
    return out;
  }
  function speakAll(text){
    if(!voiceOn()||!('speechSynthesis' in window))return;
    var q=chunks(text);if(!q.length)return;
    var token=++speakingToken;
    try{speechSynthesis.cancel();}catch(e){}
    var voice=pickVoice();
    function next(){
      if(token!==speakingToken||!q.length||!voiceOn())return;
      var u=new SpeechSynthesisUtterance(q.shift());
      u.lang='ko-KR';u.rate=1.02;u.pitch=1;u.volume=1;if(voice)u.voice=voice;
      u.onend=function(){setTimeout(next,30);};
      u.onerror=function(){setTimeout(next,40);};
      try{speechSynthesis.speak(u);}catch(e){}
    }
    setTimeout(next,60);
  }
  function isGuideTitle(title){
    title=clean(title);
    return /(사용방법|이용방법|이용·혜택|혜택|안내|구독|VIP|장미 충전|선물|보물상자|제비뽑기|투자자|광고|신고|수익률)/i.test(title);
  }
  function currentSheetText(){
    var sheet=document.getElementById('sheet');
    if(!sheet||!sheet.classList.contains('show'))return '';
    var title=document.getElementById('sheetTitle');
    var body=document.getElementById('sheetBody');
    var t=clean(title&&title.textContent);
    if(!isGuideTitle(t))return '';
    return clean(t+' '+(body&&body.innerText||body&&body.textContent||''));
  }
  function readCurrentSheet(){
    var txt=currentSheetText();
    if(txt)speakAll(txt);
  }
  window.ktReadCurrentHelpSheet=readCurrentSheet;

  function install(){
    if(typeof window.showSheet==='function'&&!window.showSheet.__ktAiHelpWrapped){
      var oldShow=window.showSheet;
      var wrapped=function(title,html){
        var r=oldShow.apply(this,arguments);
        if(isGuideTitle(title))setTimeout(readCurrentSheet,90);
        return r;
      };
      wrapped.__ktAiHelpWrapped=true;
      window.showSheet=wrapped;
    }
    if(typeof window.toggleAIVoice==='function'&&!window.toggleAIVoice.__ktAiHelpWrapped){
      var oldToggle=window.toggleAIVoice;
      var t=function(btn){
        var r=oldToggle.apply(this,arguments);
        setTimeout(function(){
          if(voiceOn()){
            var txt=currentSheetText();
            if(txt)speakAll(txt);else speakAll('에이아이 음성 안내를 켰습니다. 사용 방법과 혜택 화면을 누르면 내용을 끝까지 읽어드립니다.');
          }else{
            speakingToken++;
            try{speechSynthesis.cancel();}catch(e){}
          }
        },100);
        return r;
      };
      t.__ktAiHelpWrapped=true;
      window.toggleAIVoice=t;
    }
  }

  install();
  setTimeout(install,300);
  setTimeout(install,1200);
  setInterval(install,2500);

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('#sheet button'):null;
    if(!b||!voiceOn())return;
    setTimeout(function(){
      var txt=currentSheetText();
      if(txt)speakAll(txt);
    },140);
  },false);
})();