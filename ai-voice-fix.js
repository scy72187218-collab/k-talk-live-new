/* K-Talk AI 한국어 음성 읽기 안정화: 기존 기능만 보강. */
(function(){
  if(window.__ktAiVoiceFixInstalled)return;
  window.__ktAiVoiceFixInstalled=true;

  var synth=window.speechSynthesis;
  var queue=[];
  var speaking=false;
  var spokenOnce=Object.create(null);

  function isLiveOrCreatorMedia(media){
    if(!media)return false;
    if(media.id==='camera'||media.id==='cameraBg'||media.id==='ktLiveVideo')return true;
    try{
      return !!(media.closest&&media.closest('#creator,.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room'));
    }catch(e){return false;}
  }

  function isNormalPlaybackMedia(media){
    if(!media||!media.tagName)return false;
    var tag=String(media.tagName).toUpperCase();
    if(tag!=='VIDEO'&&tag!=='AUDIO')return false;
    return !isLiveOrCreatorMedia(media);
  }

  function playbackActive(){
    try{
      return [].slice.call(document.querySelectorAll('video,audio')).some(function(media){
        return isNormalPlaybackMedia(media)&&!media.paused&&!media.ended&&media.readyState>=2;
      });
    }catch(e){return false;}
  }

  window.ktAiPlaybackBlocking=playbackActive;

  function stopForPlayback(){
    queue=[];
    speaking=false;
    try{if(synth&&synth.cancel)synth.cancel();}catch(e){}
  }

  document.addEventListener('play',function(e){
    if(isNormalPlaybackMedia(e.target))stopForPlayback();
  },true);

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
    if(playbackActive())return false;
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
    if(playbackActive()){queue=[];speaking=false;return;}
    if(speaking||!queue.length)return;
    speakNow(queue.shift());
  }

  window.ktSpeak=function(text){
    try{if(window.state&&state.aiVoiceOn===false)return false;}catch(e){}
    if(playbackActive())return false;
    text=normalize(text);
    if(!text)return false;
    if(!synth||typeof window.SpeechSynthesisUtterance!=='function')return false;
    /* 같은 문구가 화면에서 사라졌다 다시 생겨도 이번 접속에서는 한 번만 읽는다. */
    if(spokenOnce[text])return true;
    spokenOnce[text]=1;
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
    delete spokenOnce[normalize(msg)];
    var ok=window.ktSpeak(msg);
    if(!ok&&!playbackActive())alert('이 브라우저에서 음성 읽기를 사용할 수 없습니다. 크롬에서 다시 실행해 주세요.');
    return ok;
  };

  var oldToggle=window.toggleAIVoice;
  window.toggleAIVoice=function(btn){
    if(typeof oldToggle==='function'){
      var r=oldToggle.apply(this,arguments);
      try{if(window.state&&state.aiVoiceOn&&!playbackActive()){setTimeout(function(){window.ktSpeak('에이아이 음성 안내를 켰습니다.');},60);}}catch(e){}
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
    try{if(window.ktAiPlaybackBlocking&&window.ktAiPlaybackBlocking())return;}catch(e){}
    var msg=nickname()+'님, 출석 체크해 주셔서 감사합니다.';
    try{if(window.state)state.aiVoiceOn=true;}catch(e){}
    try{localStorage.setItem('ktalk_ai_voice','on');}catch(e){}
    try{if(window.speechSynthesis&&window.speechSynthesis.cancel)window.speechSynthesis.cancel();}catch(e){}
    try{
      if(typeof window.ktSpeak==='function'){
        window.ktSpeak(msg);
        return;
      }
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

/* 9명방 수익표: 내용은 그대로 두고 너무 작지 않게 중간 크기로 조정. */
(function(){
  if(window.__ktNineEarningsCompactInstalled)return;
  window.__ktNineEarningsCompactInstalled=true;
  function apply(){
    var room=document.querySelector('.ktg13-room[data-kt-room="9"]');
    if(!room)return;
    var hud=room.querySelector('#myEarnHud');
    if(hud){
      hud.style.setProperty('width','210px','important');
      hud.style.setProperty('max-width','210px','important');
      hud.style.setProperty('transform','scale(.72)','important');
      hud.style.setProperty('transform-origin','top right','important');
      hud.style.setProperty('margin-left','auto','important');
    }
    var detail=room.querySelector('#myEarnDetail');
    if(detail){
      detail.style.setProperty('grid-template-columns','max-content max-content','important');
      detail.style.setProperty('justify-content','end','important');
      detail.style.setProperty('font-size','8px','important');
      detail.style.setProperty('line-height','1.18','important');
      [].slice.call(detail.querySelectorAll('span')).forEach(function(el){
        el.style.setProperty('white-space','nowrap','important');
      });
    }
  }
  apply();
  try{
    var mo=new MutationObserver(function(){setTimeout(apply,0);});
    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-kt-room','style']});
  }catch(e){}
})();

/* 방송목록 연동 파일이 빠진 경우에만 최신 파일을 다시 연결. */
(function(){
  function load(src,attr){
    if(document.querySelector('script['+attr+']'))return;
    var s=document.createElement('script');
    s.src=src;
    s.async=false;
    s.setAttribute(attr,'1');
    document.head.appendChild(s);
  }
  function ensure(){
    if(!window.__ktLivePresenceInstalled){
      load('live-presence.js?v=20260913-ai-link1','data-kt-ai-live-presence');
    }
    if(!window.__ktLivePresenceWatchdogInstalled){
      load('live-presence-watchdog.js?v=20260913-ai-link1','data-kt-ai-live-watchdog');
    }
  }
  ensure();
  document.addEventListener('pointerdown',function(e){
    var t=e.target;
    if(t&&t.closest&&t.closest('.prep-start'))ensure();
  },true);
})();

/* 2026-09-15 촬영 화면의 사운드/우측 도구/하단 조작만 삼성 모바일에서도 확실히 실행. 다른 화면은 변경하지 않음. */
(function(){
  if(window.__ktCreatorDirectControlBridge20260915)return;
  window.__ktCreatorDirectControlBridge20260915=true;

  function stopEvent(e){
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(_e){}
  }

  function text(el){return String((el&&el.textContent)||'').replace(/\s+/g,'').trim();}

  function runRoomShortcut(btn){
    var t=text(btn);
    var type='solo',name='1인 방송',max=1;
    if(t.indexOf('13명')>-1){type='group13';name='13명 방송';max=13;}
    else if(t.indexOf('구독자')>-1){type='subscriber';name='구독자 방송';max=10;}
    else if(t.indexOf('비밀')>-1){type='password';name='비밀방';max=7;}
    try{
      if(window.state){state.liveRoomType=type;state.liveRoomName=name;state.liveRoomMax=max;}
      var title=document.getElementById('liveTitle');if(title)title.value=name;
      if(typeof window.openTikLivePrep==='function')window.openTikLivePrep();
      setTimeout(function(){
        try{
          var list=[].slice.call(document.querySelectorAll('.live-prep .room-switch'));
          var b=list.find(function(x){return text(x).indexOf(name.replace(' 방송','').replace('방',''))>-1;})||list[0];
          if(typeof window.selectPrepRoom==='function')window.selectPrepRoom(b,type==='group13'?'group':type,name,max);
        }catch(e){}
      },30);
    }catch(e){}
  }

  window.addEventListener('click',function(e){
    var target=e.target&&e.target.closest?e.target.closest('#creator button,#creator .modes span,#creator .creator-foot span'):null;
    if(!target)return;

    if(target.id==='creatorSoundBtn'){
      stopEvent(e);
      if(typeof window.openSoundPanel==='function')window.openSoundPanel();
      return;
    }

    if(target.classList.contains('creator-rotate')){
      stopEvent(e);
      if(typeof window.toggleCreatorCamera==='function')window.toggleCreatorCamera();
      return;
    }

    var tool=target.closest('.creator-tools button');
    if(tool){
      var label=String(tool.getAttribute('aria-label')||'');
      stopEvent(e);
      if(label.indexOf('플래시')>-1){if(typeof window.ktToggleCreatorFlash==='function')window.ktToggleCreatorFlash(tool);return;}
      if(label.indexOf('타이머')>-1){if(typeof window.ktOpenCreatorTimer==='function')window.ktOpenCreatorTimer();return;}
      if(label.indexOf('방송 선택')>-1){if(typeof window.openRoomTypeChooser==='function')window.openRoomTypeChooser();return;}
      if(label.indexOf('AI 보정')>-1){if(typeof window.openBeautyPanel==='function')window.openBeautyPanel();return;}
      if(label.indexOf('편집')>-1){if(typeof window.openEditEffectPanel==='function')window.openEditEffectPanel();return;}
      if(label.indexOf('더보기')>-1){if(typeof window.ktOpenCreatorMore==='function')window.ktOpenCreatorMore();return;}
      return;
    }

    var mode=target.closest('.creator-bottom .modes span,.creator-bottom .modes button');
    if(mode){
      stopEvent(e);
      var m=text(mode);
      if(m.indexOf('10분')>-1&&typeof window.selectCreatorDuration==='function')window.selectCreatorDuration(mode,600000);
      else if(m.indexOf('60초')>-1&&typeof window.selectCreatorDuration==='function')window.selectCreatorDuration(mode,60000);
      else if(m.indexOf('15초')>-1&&typeof window.selectCreatorDuration==='function')window.selectCreatorDuration(mode,15000);
      else if(m.indexOf('라이브')>-1&&typeof window.openTikLivePrep==='function')window.openTikLivePrep();
      return;
    }

    var shortcut=target.closest('.kt-creator-room-shortcuts button');
    if(shortcut){
      stopEvent(e);
      runRoomShortcut(shortcut);
      return;
    }

    if(target.closest('.creator-bottom .record')){
      stopEvent(e);
      if(typeof window.startCreatorRecording==='function')window.startCreatorRecording();
      return;
    }

    if(target.closest('.creator-bottom .myvideo')){
      stopEvent(e);
      if(typeof window.openMyVideoPicker==='function')window.openMyVideoPicker();
      return;
    }

    var foot=target.closest('.creator-bottom .creator-foot span');
    if(foot){
      stopEvent(e);
      var f=text(foot);
      if(f.indexOf('라이브')>-1){if(typeof window.openTikLivePrep==='function')window.openTikLivePrep();}
      else if(typeof window.setCreatorMode==='function')window.setCreatorMode(foot,f);
      return;
    }
  },true);
})();
