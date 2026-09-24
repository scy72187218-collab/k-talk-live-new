/* K-Talk 이용방법·혜택 음성 읽기 전용. 다른 화면/기능은 변경하지 않음. */
(function(){
  if(window.__ktAiHelpReader20260915)return;
  window.__ktAiHelpReader20260915=true;

  var speakingToken=0;
  var benefitContext=false;

  function voiceOn(){
    try{return !!(window.state&&state.aiVoiceOn);}catch(e){return true;}
  }
  function stopGuideVoice(){
    speakingToken++;
    try{speechSynthesis.cancel();}catch(e){}
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
    try{speechSynthesis.cancel();speechSynthesis.resume();}catch(e){}
    var voice=pickVoice();
    function next(){
      if(token!==speakingToken||!q.length||!voiceOn())return;
      var part=q.shift();
      var u=new SpeechSynthesisUtterance(part);
      u.lang='ko-KR';u.rate=1.00;u.pitch=1;u.volume=1;if(voice)u.voice=voice;
      u.onend=function(){setTimeout(next,70);};
      u.onerror=function(ev){
        var err=ev&&ev.error||'';
        if(err==='canceled'||err==='interrupted')return;
        setTimeout(next,140);
      };
      try{speechSynthesis.speak(u);}catch(e){setTimeout(next,180);}
    }
    setTimeout(next,80);
  }

  function greetingText(){
    return 'K-Talk 혜택 안내입니다. 화면에 있는 혜택 내용을 읽어드리겠습니다.';
  }

  function isBenefitRoot(title){
    title=clean(title);
    return /^(K-Talk 사용방법·혜택|K-Talk 사용방법 · 혜택|K-Talk 이용방법·혜택|K-Talk 이용방법 · 혜택|사이트 사용방법|혜택 · 보상 센터)$/i.test(title);
  }
  function isBenefitChild(title){
    title=clean(title);
    return /(7일 방송 보상|제비뽑기|출석 · 참여 보상|출석 · 참여|장미 · 코인 충전 혜택|방송방 이용 혜택|혜택 받기|구독자 혜택|혜택 주기|혜택 알림|미션 · 랭킹|팬클럽 혜택|구독·VIP 혜택|구독 · VIP 혜택)/i.test(title);
  }
  function isBenefitTitle(title){
    title=clean(title);
    return isBenefitRoot(title)||isBenefitChild(title);
  }
  function isFullGuideTitle(title){
    title=clean(title);
    return /^(K-Talk 사용방법·혜택|K-Talk 사용방법 · 혜택|K-Talk 이용방법·혜택|K-Talk 이용방법 · 혜택)$/i.test(title);
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
    if(!isBenefitTitle(t))return '';
    return clean(t+' '+(body&&body.innerText||body&&body.textContent||''));
  }
  function readCurrentSheet(){
    appendFullGuide();
    var txt=currentSheetText();
    if(txt)speakAll(greetingText()+' '+txt);
  }
  window.ktReadCurrentHelpSheet=readCurrentSheet;
  window.ktAiGreetingOnce=function(){
    var txt=currentSheetText();
    if(txt)readCurrentSheet();
  };

  function install(){
    if(typeof window.openSiteGuide==='function'&&!window.openSiteGuide.__ktAiHelpDirectWrapped){
      var oldGuide=window.openSiteGuide;
      var guideWrapped=function(){
        try{
          if(window.state)state.aiVoiceOn=true;
          localStorage.setItem('ktalk_ai_voice','on');
        }catch(e){}
        var r=oldGuide.apply(this,arguments);
        setTimeout(function(){
          try{
            document.querySelectorAll('.kt-public-video,#homeVideo,#ktLibraryPlayer').forEach(function(v){try{v.pause();v.muted=true;}catch(e){}});
          }catch(e){}
          readCurrentSheet();
        },20);
        return r;
      };
      guideWrapped.__ktAiHelpDirectWrapped=true;
      window.openSiteGuide=guideWrapped;
    }
    if(typeof window.showSheet==='function'&&!window.showSheet.__ktAiHelpWrapped){
      var oldShow=window.showSheet;
      var wrapped=function(title,html){
        var t=clean(title);
        if(isBenefitRoot(t))benefitContext=true;
        else if(isBenefitChild(t))benefitContext=true;
        else benefitContext=false;
        var r=oldShow.apply(this,arguments);
        if(benefitContext&&isBenefitTitle(t))setTimeout(readCurrentSheet,120);
        else stopGuideVoice();
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
          if(voiceOn()&&currentSheetText())readCurrentSheet();
          else if(!voiceOn())stopGuideVoice();
        },120);
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
})();

/* 방송 중 프로필 사진을 누르면 그 사람에게 선물할 수 있게 연결. 자기 사진에는 선물 버튼을 만들지 않음. */
(function(){
  if(window.__ktProfileTargetGift20260915)return;
  window.__ktProfileTargetGift20260915=true;

  var target=null;

  function text(v){return v==null?'':String(v).trim();}
  function ensureStyle(){
    if(document.getElementById('ktProfileTargetGiftStyle20260915'))return;
    var s=document.createElement('style');
    s.id='ktProfileTargetGiftStyle20260915';
    s.textContent=''
      +'.kt-live-profile-gift{width:min(330px,88%)!important;height:48px!important;margin-top:10px!important;border:0!important;border-radius:7px!important;background:linear-gradient(135deg,#ff3c92,#8b5cff)!important;color:#fff!important;font-size:17px!important;font-weight:950!important;touch-action:manipulation!important}'
      +'.kt-target-gift-pop{position:fixed!important;inset:0!important;z-index:2147483646!important;background:rgba(0,0,0,.74)!important;display:grid!important;place-items:end center!important;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif!important}'
      +'.kt-target-gift-box{width:min(100%,520px)!important;padding:16px 12px calc(18px + env(safe-area-inset-bottom))!important;border-radius:22px 22px 0 0!important;background:#0a0a0f!important;color:#fff!important;border-top:1px solid #333!important}'
      +'.kt-target-gift-head{display:flex!important;align-items:center!important;justify-content:space-between!important;margin:0 3px 12px!important}.kt-target-gift-head b{font-size:16px!important}.kt-target-gift-close{width:36px!important;height:36px!important;border:0!important;border-radius:50%!important;background:#222!important;color:#fff!important;font-size:22px!important}'
      +'.kt-target-gift-grid{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:7px!important}.kt-target-gift-grid button{min-height:82px!important;border:1px solid #333!important;border-radius:13px!important;background:#111118!important;color:#fff!important;font-weight:900!important;font-size:11px!important;line-height:1.2!important;touch-action:manipulation!important}.kt-target-gift-grid strong{display:block!important;font-size:29px!important;line-height:1.05!important;margin-bottom:5px!important}.kt-target-gift-grid em{display:block!important;color:#ffe23e!important;font-style:normal!important;font-size:12px!important}'
      +'@media(max-width:390px){.kt-target-gift-grid{gap:5px!important}.kt-target-gift-grid button{min-height:76px!important;font-size:10px!important}.kt-target-gift-grid strong{font-size:25px!important}}';
    document.head.appendChild(s);
  }

  function viewerName(){
    try{if(typeof window.ktProfileLoad==='function'){var p=window.ktProfileLoad()||{};return text(p.name||p.nickname)||'K-Talk 사용자';}}catch(e){}
    return 'K-Talk 사용자';
  }

  function targetFromCard(card){
    if(!card)return null;
    var name=text((card.querySelector('.kt-live-profile-name')||{}).textContent)||'상대방';
    var id=text((card.querySelector('.kt-live-profile-id')||{}).textContent).replace(/^@/,'');
    var img=card.querySelector('.kt-live-profile-avatar img');
    return {id:id,name:name,photo:img?text(img.currentSrc||img.src):''};
  }

  function setTarget(t){
    target=t||null;
    window.__ktGiftTarget=target;
    try{if(window.state)state.giftTarget=target;}catch(e){}
  }

  function toast(msg){
    var old=document.getElementById('ktTargetGiftToast');if(old)old.remove();
    var d=document.createElement('div');d.id='ktTargetGiftToast';d.textContent=msg;
    d.style.cssText='position:fixed;left:50%;bottom:105px;transform:translateX(-50%);z-index:2147483647;max-width:88vw;padding:11px 16px;border-radius:999px;background:rgba(20,8,24,.96);color:#fff;border:1px solid #ff5a99;font:900 13px system-ui;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    document.body.appendChild(d);setTimeout(function(){if(d.parentNode)d.remove();},2200);
  }

  function closeGift(){var p=document.getElementById('ktTargetGiftPop');if(p)p.remove();}
  window.ktCloseTargetGift=closeGift;

  window.ktSendTargetGift=function(name,count){
    if(!target)return;
    var t=target;
    setTarget(t);
    var sent=false;
    try{
      if(typeof window.giftSend==='function'){
        window.giftSend(name,count,t);
        sent=true;
      }
    }catch(e){}
    try{document.dispatchEvent(new CustomEvent('kt-target-gift-sent',{detail:{target:t,name:name,count:count,sender:viewerName()}}));}catch(e){}
    if(!sent){
      try{if(typeof window.ktAnnounceEvent==='function')window.ktAnnounceEvent('gift',{sender:viewerName(),name:name,count:count,target:t.name});}catch(e){}
    }
    closeGift();
    toast(t.name+'님에게 '+name+' '+count+'개를 선택했습니다.');
  };

  window.ktOpenTargetGift=function(t){
    if(!t)return;
    ensureStyle();setTarget(t);closeGift();
    var p=document.createElement('div');p.id='ktTargetGiftPop';p.className='kt-target-gift-pop';
    p.innerHTML='<div class="kt-target-gift-box">'
      +'<div class="kt-target-gift-head"><b>🎁 '+text(t.name)+'님에게 선물</b><button type="button" class="kt-target-gift-close" onclick="ktCloseTargetGift()">×</button></div>'
      +'<div class="kt-target-gift-grid">'
        +'<button type="button" onclick="ktSendTargetGift(\'장미\',1)"><strong>🌹</strong><em>1개</em>장미</button>'
        +'<button type="button" onclick="ktSendTargetGift(\'장미다발\',50)"><strong>💐</strong><em>50개</em>장미다발</button>'
        +'<button type="button" onclick="ktSendTargetGift(\'특대장미\',100)"><strong>💐</strong><em>100개</em>특대장미</button>'
        +'<button type="button" onclick="ktSendTargetGift(\'하트\',10)"><strong>💗</strong><em>10개</em>하트</button>'
        +'<button type="button" onclick="ktSendTargetGift(\'왕관\',100)"><strong>👑</strong><em>100개</em>왕관</button>'
        +'<button type="button" onclick="ktSendTargetGift(\'스포츠카\',50)"><strong>🏎️</strong><em>50개</em>스포츠카</button>'
        +'<button type="button" onclick="if(window.openGifts)openGifts()"><strong>🎁</strong><em>더보기</em>큰 선물</button>'
      +'</div></div>';
    p.addEventListener('click',function(e){if(e.target===p)closeGift();});
    document.body.appendChild(p);
  };

  function inject(){
    ensureStyle();
    var card=document.getElementById('ktLiveProfileCard');
    if(!card)return;
    var follow=card.querySelector('.kt-live-profile-follow');
    if(!follow||follow.dataset.self==='1')return;
    if(card.querySelector('.kt-live-profile-gift'))return;
    var btn=document.createElement('button');
    btn.type='button';btn.className='kt-live-profile-gift';btn.textContent='🎁 선물하기';
    btn.onclick=function(){
      var t=targetFromCard(card);
      if(!t)return;
      try{if(typeof window.ktCloseLiveProfileCard==='function')window.ktCloseLiveProfileCard();}catch(e){}
      window.ktOpenTargetGift(t);
    };
    follow.insertAdjacentElement('afterend',btn);
  }

  ensureStyle();
  inject();
  [100,300,700,1400].forEach(function(ms){setTimeout(inject,ms);});
  try{new MutationObserver(function(){setTimeout(inject,0);}).observe(document.body,{childList:true,subtree:true});}catch(e){}
})();