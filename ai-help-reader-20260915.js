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

  /* 각 안내는 그 화면에 들어갔을 때만 읽는다. */
  function isGuideTitle(title){
    title=clean(title);
    return /(사용방법|이용방법|이용·혜택|혜택|안내|구독|VIP|장미 충전|선물|보물상자|제비뽑기|투자자|광고|신고|수익률)/i.test(title);
  }
  function isFullGuideTitle(title){
    title=clean(title);
    return /(사용방법|이용방법|이용·혜택)/i.test(title);
  }

  function fullGuideHtml(){
    return '<section id="ktFullGuide20260915" style="margin:12px 0 4px;padding:13px;border:1px solid rgba(255,255,255,.14);border-radius:16px;background:rgba(10,10,16,.72);color:#fff;text-align:left;line-height:1.55">'
      +'<h3 style="margin:0 0 10px;font-size:17px;color:#ffd85a">📘 K-Talk 사용 방법 · 혜택</h3>'
      +'<div style="display:grid;gap:10px;font-size:13px">'
        +'<div><b style="color:#74e7ff">1. 방송 시작</b><br>방송하기를 누른 뒤 1인 방송, 9명 방송, 13명 방송, 구독자방, 비밀방 중 원하는 방을 선택합니다. 카메라와 마이크를 확인하고 방송 시작을 누르면 카운트 후 방송이 시작됩니다.</div>'
        +'<div><b style="color:#74e7ff">2. 비밀방</b><br>비밀방은 비밀번호를 설정해 입장할 사람을 제한할 수 있습니다. 비밀번호는 필요한 사람에게만 알려주세요.</div>'
        +'<div><b style="color:#74e7ff">3. AI 보정 · 편집효과</b><br>촬영 화면의 AI 보정 또는 편집효과를 눌러 얼굴 밝기, 색감, 화면 효과를 조절합니다. 너무 강하면 자연스럽지 않을 수 있으니 화면을 보면서 맞추면 됩니다.</div>'
        +'<div><b style="color:#74e7ff">4. 음악 · 사운드</b><br>사운드 추가에서 방송에 사용할 음악이나 소리를 선택합니다. 방송용 음악은 사용 권한이 있는 음원을 이용하는 것이 안전합니다.</div>'
        +'<div><b style="color:#74e7ff">5. 채팅 · 친구 · 메시지</b><br>방송 중 채팅으로 대화하고, 친구 추가와 메시지 기능으로 다시 연락할 수 있습니다. 채팅은 아래에서 위로 올라옵니다.</div>'
        +'<div><b style="color:#74e7ff">6. 선물</b><br>장미, 장미다발, 특대장미, 하트, 왕관, 스포츠카, 선물상자 등 화면에 표시된 선물을 선택해 보낼 수 있습니다. 선물 수량과 조건은 현재 화면에 표시된 내용을 기준으로 확인합니다.</div>'
        +'<div><b style="color:#74e7ff">7. 구독 · VIP 혜택</b><br>구독자와 VIP는 전용 방송이나 화면에 표시된 추가 혜택을 이용할 수 있습니다. 가격과 할인율 등은 앱에 표시된 최신 조건을 확인합니다.</div>'
        +'<div><b style="color:#74e7ff">8. 보물상자 · 이벤트</b><br>방송 중 보물상자와 이벤트가 열리면 안내에 따라 참여할 수 있습니다. 지급되는 보상은 해당 화면의 안내를 확인합니다.</div>'
        +'<div><b style="color:#74e7ff">9. 공유 · 효과 · 더보기</b><br>공유로 방송을 알릴 수 있고, 효과에서 화면 연출을 바꿀 수 있습니다. 더보기에는 추가 기능이 모여 있습니다.</div>'
        +'<div><b style="color:#74e7ff">10. AI 음성 안내</b><br>AI 음성 안내를 켜면 사용 방법과 혜택 화면의 내용을 한국어로 읽어줍니다. 글씨가 불편할 때 이용하면 됩니다.</div>'
        +'<div><b style="color:#74e7ff">11. 신고 · 안전</b><br>불편한 이용자나 문제가 있는 방송은 신고 기능을 이용하고, 개인 연락처나 비밀번호 같은 정보는 공개하지 않는 것이 좋습니다.</div>'
        +'<div><b style="color:#74e7ff">12. 홈 화면 아이콘</b><br>브라우저의 홈 화면에 추가 또는 앱 설치 기능을 이용하면 K-Talk 아이콘으로 바로 접속할 수 있습니다.</div>'
      +'</div>'
      +'<p style="margin:11px 0 0;font-size:11px;color:#bbb">※ 금액, 할인율, 보상 조건은 화면에 표시된 최신 내용을 기준으로 확인하세요.</p>'
    +'</section>';
  }

  function appendFullGuide(){
    var sheet=document.getElementById('sheet');
    if(!sheet||!sheet.classList.contains('show'))return;
    var title=document.getElementById('sheetTitle');
    var body=document.getElementById('sheetBody');
    var t=clean(title&&title.textContent);
    if(!body||!isFullGuideTitle(t)||body.querySelector('#ktFullGuide20260915'))return;
    try{body.insertAdjacentHTML('beforeend',fullGuideHtml());}catch(e){}
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
    appendFullGuide();
    var txt=currentSheetText();
    if(txt)speakAll(txt);
  }
  window.ktReadCurrentHelpSheet=readCurrentSheet;

  function install(){
    if(typeof window.showSheet==='function'&&!window.showSheet.__ktAiHelpWrapped){
      var oldShow=window.showSheet;
      var wrapped=function(title,html){
        var r=oldShow.apply(this,arguments);
        if(isGuideTitle(title))setTimeout(function(){
          appendFullGuide();
          readCurrentSheet();
        },90);
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
            /* 현재 안내 화면 안에 있을 때만 읽는다. 다른 화면에서는 혜택/안내를 읽지 않는다. */
            appendFullGuide();
            var txt=currentSheetText();
            if(txt)speakAll(txt);
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
      appendFullGuide();
      var txt=currentSheetText();
      if(txt)speakAll(txt);
    },140);
  },false);
})();