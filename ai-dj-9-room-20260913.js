/* K-Talk AI 여자 DJ 9명 음악방. 기존 방은 변경하지 않음. */
(function(){
  if(window.__ktAiDj9Room20260913)return;
  window.__ktAiDj9Room20260913=true;

  var DJ_PHOTO=window.KT_AI_DJ_PHOTO||'';
  var ROOM_TYPE='aidj9', ROOM_NAME='AI DJ 음악방';
  var BASE='',KEY='',apiPromise=null;
  var aiActive=false, queue=[], current=null, autoIndex=0, processed={}, greeted={};
  var pollTimer=null, drawTimer=null, nextTimer=null, companyRoses=0, likeCount=0;
  var audio=null,ctx=null,source=null,musicGain=null,dest=null,canvas=null,cx=null,djStream=null,djImage=null;
  var originalSpeak=window.ktSpeak, originalAddRoses=window.addMyEarnedRoses, originalAddLike=window.addHostLike;
  var originalStart=window.startBroadcast, originalEnd=window.endBroadcastEarnings;

  function clean(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
  function esc(v){return clean(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function norm(v){return clean(v).toLowerCase().replace(/[\s\-_.!?,~'"“”‘’()\[\]{}:：]/g,'');}
  function money(n){return Math.round(Number(n)||0).toLocaleString('ko-KR')+'원';}
  function deviceId(){var id='';try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}if(!id){id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);try{localStorage.setItem('kt_live_device_id',id);}catch(e){}}return id;}
  function isOwner(){try{return typeof window.ktIsOwnerAdmin==='function'&&window.ktIsOwnerAdmin();}catch(e){return false;}}
  function isSelected(){try{return !!(window.state&&(state.liveRoomType===ROOM_TYPE||state.liveRoomName===ROOM_NAME));}catch(e){return false;}}
  function hostRoom(){return document.querySelector('.ktg13-room.kt-aidj-room');}
  function remoteAi(){var m=document.querySelector('.kt-remote-meta');return !!(m&&/AI\s*DJ/i.test(m.textContent||''));}
  function inAiContext(){return aiActive||isSelected()||!!hostRoom()||remoteAi();}

  function pickFemaleVoice(){
    try{
      var vs=speechSynthesis.getVoices?speechSynthesis.getVoices():[];
      var ko=vs.filter(function(v){return /^ko[-_]/i.test(v.lang||'');});
      var pref=ko.find(function(v){return /(yuna|sora|sunhi|heami|seoyeon|female|여성)/i.test(v.name||'');});
      return pref||ko[0]||vs[0]||null;
    }catch(e){return null;}
  }
  function duck(on){
    try{if(musicGain)musicGain.gain.setTargetAtTime(on?0.16:0.78,ctx.currentTime,0.05);}catch(e){}
    try{var v=document.getElementById('ktRemoteLiveVideo');if(v&&remoteAi()){if(on){v.dataset.ktDjVol=String(v.volume);v.volume=.18;}else v.volume=Number(v.dataset.ktDjVol||1);}}catch(e){}
  }
  function djSpeak(text){
    text=clean(text);if(!text||!('speechSynthesis' in window))return;
    try{
      var u=new SpeechSynthesisUtterance(text);u.lang='ko-KR';u.rate=1.0;u.pitch=1.06;u.volume=1;
      var v=pickFemaleVoice();if(v)u.voice=v;
      u.onstart=function(){duck(true);};u.onend=function(){duck(false);};u.onerror=function(){duck(false);};
      speechSynthesis.speak(u);
    }catch(e){duck(false);}
  }
  window.ktSpeak=function(text){
    if(!inAiContext())return typeof originalSpeak==='function'?originalSpeak.apply(this,arguments):undefined;
    var t=clean(text);if(!t)return;
    if(/^AI\s*DJ님이\s*/i.test(t))t=t.replace(/^AI\s*DJ님이\s*/i,'');
    else if(/님이\s/.test(t))return;
    djSpeak(t);
  };

  function ensureStyle(){
    if(document.getElementById('ktAiDjStyle'))return;
    var s=document.createElement('style');s.id='ktAiDjStyle';s.textContent=''
      +'.kt-aidj-switch{border-color:#ff4ed8!important;color:#ffe67a!important;background:linear-gradient(135deg,#311042,#0d1830)!important}'
      +'.kt-aidj-room .ktg13-host>video{display:none!important}.kt-aidj-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center 30%;filter:brightness(.9) saturate(1.08)}'
      +'.kt-aidj-shade{position:absolute;inset:0;background:linear-gradient(180deg,transparent 35%,rgba(0,0,0,.76));pointer-events:none}.kt-aidj-hostname{position:absolute;left:8px;top:8px;z-index:6;padding:5px 9px;border-radius:999px;background:#180b24dd;border:1px solid #ff5ddd;color:#fff;font-size:11px;font-weight:950}'
      +'.kt-aidj-now{position:absolute;left:8px;right:8px;bottom:8px;z-index:6;padding:8px 9px;border-radius:11px;background:#08070ddd;border:1px solid #9d54ff99}.kt-aidj-now b{display:block;color:#ffe36c;font-size:11px}.kt-aidj-now span{display:block;margin-top:3px;color:#fff;font-size:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kt-aidj-now small{display:block;margin-top:3px;color:#7eeaff;font-size:8px}'
      +'.kt-aidj-play{margin-top:6px;width:100%;height:28px;border:0;border-radius:8px;background:linear-gradient(135deg,#ff3fa8,#7b51ff);color:#fff;font-size:10px;font-weight:950}.kt-aidj-play[hidden]{display:none!important}'
      +'.kt-aidj-room .ktg13-guest{position:relative}.kt-aidj-mic{position:absolute;right:3px;top:3px;padding:2px 4px;border-radius:999px;background:#000b;color:#ddd;font-size:8px}.kt-aidj-mic.open{color:#61f28e}.kt-aidj-room .kt-room-camera-flip,.kt-aidj-room .kt-solo-camera-flip{display:none!important}'
      +'.kt-aidj-company{height:100%;width:100%;border:1px solid #d8b83e;border-radius:10px;background:linear-gradient(135deg,#241c08,#11111a);color:#fff;padding:5px 7px;text-align:center}.kt-aidj-company b{display:block;color:#ffe36c;font-size:10px}.kt-aidj-company span{display:block;margin-top:2px;font-size:9px}.kt-aidj-company small{color:#7eeaff;font-size:7px}'
      +'.kt-aidj-queue-sheet .rowbox b{color:#ffe36c}.kt-aidj-remote-mark{position:absolute;left:10px;top:56px;z-index:12;padding:5px 8px;border-radius:999px;background:#6c1d78dd;color:#fff;font-size:10px;font-weight:950}'
      +'@media(max-width:390px){.kt-aidj-now{padding:6px}.kt-aidj-now b{font-size:10px}.kt-aidj-now span{font-size:9px}}';document.head.appendChild(s);
  }

  function ensureSwitch(){
    if(!isOwner())return;
    var row=document.querySelector('.live-prep .room-switch-row');if(!row||row.querySelector('.kt-aidj-switch'))return;
    var b=document.createElement('button');b.type='button';b.className='room-switch kt-aidj-switch';b.textContent='🎧 AI DJ 음악방';b.setAttribute('aria-pressed','false');
    b.addEventListener('click',function(e){e.preventDefault();e.stopPropagation();selectAiDj(b);unlockAudio();});
    var nine=[].slice.call(row.querySelectorAll('.room-switch')).find(function(x){return /^\s*9\s*명/.test(x.textContent||'');});
    if(nine)nine.insertAdjacentElement('afterend',b);else row.appendChild(b);
  }
  function selectAiDj(btn){
    document.querySelectorAll('.live-prep .room-switch').forEach(function(b){var on=b===btn;b.classList.toggle('on',on);b.setAttribute('aria-pressed',on?'true':'false');});
    if(window.state){state.liveRoomType=ROOM_TYPE;state.liveRoomName=ROOM_NAME;state.liveRoomMax=9;}
    var t=document.getElementById('liveTitle');if(t){t.value=ROOM_NAME;t.dataset.autoRoom='1';}
  }

  function ensureAudio(){
    if(audio)return;
    audio=document.createElement('audio');audio.id='ktAiDjAudio';audio.preload='auto';audio.crossOrigin='anonymous';audio.playsInline=true;audio.style.display='none';document.body.appendChild(audio);
    audio.addEventListener('ended',songEnded);audio.addEventListener('error',songError);
    var AC=window.AudioContext||window.webkitAudioContext;
    if(AC){try{ctx=new AC();source=ctx.createMediaElementSource(audio);musicGain=ctx.createGain();musicGain.gain.value=.78;dest=ctx.createMediaStreamDestination();source.connect(musicGain);musicGain.connect(ctx.destination);musicGain.connect(dest);}catch(e){}}
  }
  function unlockAudio(){ensureAudio();try{if(ctx&&ctx.state==='suspended')ctx.resume();}catch(e){} }
  function makeCanvasStream(){
    ensureAudio();if(!canvas){canvas=document.createElement('canvas');canvas.width=720;canvas.height=1280;canvas.style.display='none';document.body.appendChild(canvas);cx=canvas.getContext('2d');djImage=new Image();djImage.src=DJ_PHOTO;}
    if(drawTimer)clearInterval(drawTimer);drawScene();drawTimer=setInterval(drawScene,120);
    var cs=canvas.captureStream?canvas.captureStream(15):new MediaStream();var out=new MediaStream();
    try{cs.getVideoTracks().forEach(function(t){out.addTrack(t);});}catch(e){}
    try{if(dest)dest.stream.getAudioTracks().forEach(function(t){out.addTrack(t);});}catch(e){}
    djStream=out;return out;
  }
  function drawCover(img,w,h){if(!cx||!img||!img.complete||!img.naturalWidth)return false;var r=Math.max(w/img.naturalWidth,h/img.naturalHeight),dw=img.naturalWidth*r,dh=img.naturalHeight*r;cx.drawImage(img,(w-dw)/2,(h-dh)/2,dw,dh);return true;}
  function drawScene(){
    if(!cx||!canvas)return;var w=canvas.width,h=canvas.height;cx.fillStyle='#080611';cx.fillRect(0,0,w,h);drawCover(djImage,w,h);
    var g=cx.createLinearGradient(0,h*.3,0,h);g.addColorStop(0,'rgba(0,0,0,.02)');g.addColorStop(1,'rgba(0,0,0,.82)');cx.fillStyle=g;cx.fillRect(0,0,w,h);
    cx.textAlign='center';cx.fillStyle='#ffdf60';cx.font='bold 44px sans-serif';cx.fillText('K-Talk AI DJ',w/2,80);cx.fillStyle='#fff';cx.font='bold 31px sans-serif';cx.fillText(current?current.track.name:'24시간 음악방',w/2,h-190);
    cx.fillStyle='#7eeaff';cx.font='24px sans-serif';cx.fillText(current&&current.requester?current.requester+'님 신청곡':'채팅으로 신청곡을 남겨주세요',w/2,h-145);
    for(var i=0;i<22;i++){var bh=18+Math.abs(Math.sin(Date.now()/230+i*.7))*78;cx.fillStyle='hsl('+((i*18+Date.now()/35)%360)+',90%,62%)';cx.fillRect(90+i*25,h-90-bh,14,bh);}
  }

  function tracks(){return (window.ktCreatorTracks||[]).filter(function(t){return t&&t.url&&!t.searchOnly;});}
  function restrictedTracks(){return (window.ktCreatorTracks||[]).filter(function(t){return t&&(t.searchOnly||!t.url);});}
  function scoreTrack(t,q){var n=norm(q),name=norm(t.name),src=norm(t.source);if(!n)return 0;if(name===n)return 100;if(name.indexOf(n)>-1||n.indexOf(name)>-1)return 80;if(src.indexOf(n)>-1)return 35;return 0;}
  function bestTrack(list,q){var best=null,sc=0;(list||[]).forEach(function(t){var s=scoreTrack(t,q);if(s>sc){sc=s;best=t;}});return sc>=35?best:null;}
  function extractRequest(text){
    var raw=clean(text);if(!raw)return '';
    var ask=/(틀어\s*(줘|주세요|줘요|주라)|들려\s*(줘|주세요|줘요)|듣고\s*싶|신청곡|신청\s*(해|할)|노래\s*부탁|음악\s*부탁)/.test(raw);if(!ask)return '';
    var q=raw.replace(/^(신청곡|노래|음악)\s*[:：]?\s*/,'').replace(/(좀\s*)?(틀어\s*(줘|주세요|줘요|주라)|들려\s*(줘|주세요|줘요)|듣고\s*싶(어|어요|습니다)?|신청곡|신청\s*(해|할게|합니다)|노래\s*부탁(해|해요)?|음악\s*부탁(해|해요)?|부탁(해|해요|합니다)?)/g,' ').replace(/\b(노래|음악|곡)\b/g,' ');
    return clean(q);
  }
  function queueText(){return queue.slice(0,8).map(function(x,i){return '<div class="rowbox"><b>'+(i+1)+'. '+esc(x.track.name)+'</b><br>'+esc(x.requester||'AI DJ')+'님 신청</div>';}).join('')||'<div class="rowbox">대기 중인 신청곡이 없습니다.</div>';}
  window.ktAiDjOpenQueue=function(){if(typeof window.showSheet==='function'){showSheet('🎵 신청곡 대기 '+queue.length+'곡','<div class="kt-aidj-queue-sheet">'+queueText()+'</div>');}};
  function render(){
    var room=hostRoom();if(!room)return;
    var now=document.getElementById('ktAiDjNowTitle'),sub=document.getElementById('ktAiDjNowSub'),q=document.getElementById('ktAiDjQueueCount'),rev=document.getElementById('ktAiDjCompanyRevenue');
    if(now)now.textContent=current?current.track.name:'자동 선곡 준비 중';if(sub)sub.textContent=current&&current.requester?current.requester+'님 신청곡':'신청곡이 없으면 AI DJ가 자동 선곡합니다.';if(q)q.textContent='🎵 신청곡 '+queue.length+'곡';if(rev)rev.textContent='🌹 '+companyRoses.toLocaleString('ko-KR')+' · '+money(companyRoses*30);
  }
  function setMicLock(locked){
    var room=hostRoom();if(!room)return;window.ktAiDjGuestMicLocked=!!locked;
    room.querySelectorAll('.ktg13-guest').forEach(function(g){var b=g.querySelector('.kt-aidj-mic');if(!b){b=document.createElement('span');b.className='kt-aidj-mic';g.appendChild(b);}b.classList.toggle('open',!locked);b.textContent=locked?'🔇 음악중':'🎤 대화가능';});
    var m=document.getElementById('ktAiDjMicState');if(m)m.textContent=locked?'🔇 음악중 자동잠금':'🎤 곡 사이 대화가능';
  }
  function showPlayButton(show){var b=document.getElementById('ktAiDjPlayBtn');if(b)b.hidden=!show;}
  window.ktAiDjResumeMusic=function(){unlockAudio();if(current&&audio){audio.play().then(function(){showPlayButton(false);setMicLock(true);}).catch(function(){showPlayButton(true);});}else playNext();};

  function nextAuto(){var a=tracks();if(!a.length)return null;var t=a[autoIndex%a.length];autoIndex=(autoIndex+1)%a.length;return {track:t,requester:'AI DJ',auto:true};}
  function playNext(){
    clearTimeout(nextTimer);if(!aiActive)return;var item=queue.length?queue.shift():nextAuto();if(!item){current=null;render();reply('재생 가능한 사용 허가 음악이 아직 연결되지 않았어요.');return;}current=item;render();setMicLock(true);unlockAudio();audio.src=item.track.url;audio.currentTime=0;
    var intro=item.auto?'AI DJ 자동 선곡, '+item.track.name+' 들려드릴게요.':(item.requester+'님 신청곡 '+item.track.name+' 지금 들려드릴게요.');reply(intro);
    var p=audio.play();if(p&&p.then)p.then(function(){showPlayButton(false);}).catch(function(){showPlayButton(true);setMicLock(false);});
  }
  function songEnded(){if(!aiActive)return;setMicLock(false);current=null;render();nextTimer=setTimeout(playNext,4500);}
  function songError(){if(!aiActive)return;setMicLock(false);var failed=current&&current.track?current.track.name:'';current=null;render();reply((failed?failed+' 재생 연결을 확인할게요. ':'')+'다음 곡으로 넘어갈게요.');nextTimer=setTimeout(playNext,1800);}

  async function ensureApi(){
    if(BASE&&KEY)return true;if(apiPromise)return apiPromise;apiPromise=(async function(){try{var r=await fetch('live-presence.js?v=20260913-link2',{cache:'no-store'});var t=await r.text();var bm=t.match(/var BASE='([^']+)'/),km=t.match(/var KEY='([^']+)'/);if(bm&&km){BASE=bm[1];KEY=km[1];return true;}}catch(e){}return false;})();return apiPromise;
  }
  function headers(extra){var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});return h;}
  async function req(path,opt){if(!(await ensureApi()))throw new Error('api');opt=opt||{};opt.headers=headers(opt.headers);var r=await fetch(BASE+path,opt);if(!r.ok)throw new Error('api '+r.status);if(r.status===204)return null;var tx=await r.text();return tx?JSON.parse(tx):null;}
  async function postAi(text){if(!text)return;try{await req('ktalk_live_messages',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify({host_id:deviceId(),sender_id:'ai-dj',sender_name:'AI DJ',message:text,message_type:'chat'})});}catch(e){}if(!window.__ktChatBenefitAIReaderInstalled)djSpeak(text);}
  function reply(text){postAi(clean(text));}
  async function recordCompany(m,roses,gift){
    roses=parseInt(roses,10)||0;if(roses<=0)return;companyRoses+=roses;render();
    var k='aidj:'+String(m&&m.id!=null?m.id:(Date.now()+'-'+Math.random()));
    try{await req('ktalk_ai_dj_revenue?on_conflict=event_key',{method:'POST',headers:{Prefer:'resolution=ignore-duplicates,return=minimal'},body:JSON.stringify({event_key:k,room_host_id:deviceId(),sender_id:String(m&&m.sender_id||''),sender_name:String(m&&m.sender_name||''),gift_name:String(gift||'장미'),roses:roses,gross_won:roses*30,company_won:roses*30,company_rate:100})});}catch(e){}
  }
  function handleRequest(m){
    var name=clean(m.sender_name)||'회원',text=clean(m.message),q=extractRequest(text);if(!q)return;
    if(/^(아무거나|아무노래|신나는거|신나는노래|좋은노래)$/.test(norm(q))){var a=tracks();if(a.length){var t=a[Math.floor(Math.random()*a.length)];queue.push({track:t,requester:name});render();reply(name+'님, '+t.name+' 신청곡으로 넣었어요. 대기 '+queue.length+'번째예요.');if(!current)playNext();}return;}
    var t=bestTrack(tracks(),q);if(t){queue.push({track:t,requester:name});render();reply(name+'님, '+t.name+' 신청 받았어요. 대기 '+queue.length+'번째예요.');if(!current)playNext();return;}
    var locked=bestTrack(restrictedTracks(),q);if(locked){reply(name+'님, '+locked.name+'은 정식 음원 사용권 연결이 필요한 곡이라 지금 자동 재생은 할 수 없어요. 다른 신청곡을 말씀해 주세요.');return;}
    reply(name+'님, 곡 제목을 한 번 더 정확하게 적어 주세요. 예를 들면 오빠는 풍각쟁이 틀어줘, 이렇게 말씀하시면 돼요.');
  }
  function handleMessage(m){
    if(!m||processed[m.id])return;processed[m.id]=1;var type=String(m.message_type||''),name=clean(m.sender_name)||'회원';
    if(type==='system'&&/님이\s*들어왔습니다/.test(String(m.message||''))&&!greeted[m.sender_id||name]){greeted[m.sender_id||name]=1;reply(name+'님 어서 오세요. 어떤 음악 듣고 싶으세요? 채팅에 노래 제목하고 틀어줘라고 적어 주세요.');return;}
    if(type==='chat'&&String(m.sender_id||'')!=='ai-dj'){handleRequest(m);return;}
    if(type==='attendance'){recordCompany(m,1,'출석 장미');return;}
    if(type.indexOf('gift:')===0){var n=parseInt(type.slice(5),10)||0;var gm=String(m.message||'').match(/님이\s+(.+?)\s+[\d,]+개를\s+선물/);recordCompany(m,n,gm?gm[1]:'선물');return;}
  }
  async function poll(){if(!aiActive)return;try{var rows=await req('ktalk_live_messages?select=id,sender_id,sender_name,message,message_type,created_at&host_id=eq.'+encodeURIComponent(deviceId())+'&order=created_at.desc&limit=60');(rows||[]).reverse().forEach(handleMessage);}catch(e){}}
  function startPoll(){clearInterval(pollTimer);pollTimer=setInterval(poll,1300);poll();}

  function adaptRoom(){
    var room=document.querySelector('.ktg13-room');if(!room)return;room.classList.add('kt-aidj-room');room.setAttribute('data-kt-room','9');
    var air=room.querySelector('.ktg13-air strong');if(air)air.innerHTML='<i>●</i> AI DJ 음악방';var sub=room.querySelector('.ktg13-air small');if(sub)sub.innerHTML='<i>●</i> 24시간 자동 음악 · 신청곡';
    var led=room.querySelector('.ktg13-led-track');if(led)led.innerHTML='<span>🎧 <b>AI 여자 DJ</b> · 채팅에 “노래 제목 틀어줘”라고 신청해 주세요 · 음악 중 게스트 마이크 자동 잠금</span><span>🎧 <b>AI 여자 DJ</b> · 신청곡은 자동으로 순서가 올라가고 재생 후 내려갑니다</span>';
    var stats=room.querySelectorAll('.ktg13-stats > *');if(stats[0]){stats[0].id='ktAiDjQueueCount';stats[0].innerHTML='🎵 신청곡 '+queue.length+'곡';stats[0].onclick=function(){window.ktAiDjOpenQueue();};}if(stats[1]){stats[1].id='ktAiDjMicState';stats[1].innerHTML='🔇 음악중 자동잠금';stats[1].onclick=null;}
    var host=room.querySelector('.ktg13-host');if(host&&!host.querySelector('.kt-aidj-photo')){var img=document.createElement('img');img.className='kt-aidj-photo';img.src=DJ_PHOTO;host.appendChild(img);var sh=document.createElement('div');sh.className='kt-aidj-shade';host.appendChild(sh);var nm=document.createElement('div');nm.className='kt-aidj-hostname';nm.textContent='👩‍🎤 AI 여자 DJ';host.appendChild(nm);var now=document.createElement('div');now.className='kt-aidj-now';now.innerHTML='<b>NOW PLAYING</b><span id="ktAiDjNowTitle">자동 선곡 준비 중</span><small id="ktAiDjNowSub">신청곡이 없으면 AI DJ가 자동 선곡합니다.</small><button id="ktAiDjPlayBtn" class="kt-aidj-play" hidden onclick="ktAiDjResumeMusic()">▶ 음악 재생 시작</button>';host.appendChild(now);}
    room.querySelectorAll('.ktg13-guest').forEach(function(g){if(!g.querySelector('.kt-aidj-mic')){var b=document.createElement('span');b.className='kt-aidj-mic';g.appendChild(b);}});
    var earn=room.querySelector('.ktg13-earn');if(earn)earn.innerHTML='<div class="kt-aidj-company"><b>🏢 회사 수익 100%</b><span id="ktAiDjCompanyRevenue">🌹 0 · 0원</span><small>AI DJ·게스트 개인 정산 0원</small></div>';
    setMicLock(true);render();
  }

  function startAiStream(){
    var old=null;try{old=window.state&&state.stream;}catch(e){}var st=makeCanvasStream();try{if(old&&old!==st)old.getTracks().forEach(function(t){try{t.stop();}catch(e){}});}catch(e){}if(window.state)state.stream=st;var v=document.getElementById('ktLiveVideo');if(v){try{v.srcObject=st;v.muted=true;v.play().catch(function(){});}catch(e){}}
  }
  function requestWakeLock(){try{if(navigator.wakeLock&&navigator.wakeLock.request)navigator.wakeLock.request('screen').then(function(w){window.__ktAiDjWakeLock=w;}).catch(function(){});}catch(e){} }
  function stopAi(){aiActive=false;clearInterval(pollTimer);clearInterval(drawTimer);clearTimeout(nextTimer);pollTimer=drawTimer=nextTimer=null;try{if(audio){audio.pause();audio.removeAttribute('src');audio.load();}}catch(e){}try{if(window.__ktAiDjWakeLock)window.__ktAiDjWakeLock.release();}catch(e){}setMicLock(false);current=null;queue=[];}

  window.addMyEarnedRoses=function(count){if(aiActive||hostRoom())return;return typeof originalAddRoses==='function'?originalAddRoses.apply(this,arguments):undefined;};
  window.addHostLike=function(count){if(aiActive||hostRoom()){likeCount+=Math.max(1,parseInt(count,10)||1);var el=document.getElementById('hostLikeCount')||document.getElementById('ktg13LikeCount');if(el)el.textContent=likeCount.toLocaleString('ko-KR');return;}return typeof originalAddLike==='function'?originalAddLike.apply(this,arguments):undefined;};

  if(typeof originalStart==='function')window.startBroadcast=async function(){
    if(!isSelected())return originalStart.apply(this,arguments);
    if(!isOwner()){alert('AI DJ 음악방은 관리자 전용입니다.');return;}
    aiActive=true;queue=[];current=null;processed={};greeted={};companyRoses=0;likeCount=0;unlockAudio();var fake=makeCanvasStream(),realEnsure=window.ensureLiveCamera;
    try{
      if(window.state){state.stream=fake;state.liveRoomType='group9';state.liveRoomName='9명 방송';state.liveRoomMax=9;}
      window.ensureLiveCamera=async function(){return true;};
      var result=await originalStart.apply(this,arguments);
      if(window.state){state.liveRoomType=ROOM_TYPE;state.liveRoomName=ROOM_NAME;state.liveRoomMax=9;}
      window.ensureLiveCamera=realEnsure;startAiStream();[0,60,180,420,900].forEach(function(ms){setTimeout(adaptRoom,ms);});requestWakeLock();startPoll();
      setTimeout(function(){reply('AI DJ 음악방을 시작합니다. 신청곡이 없으면 재생 가능한 음악을 자동으로 계속 들려드릴게요.');playNext();},700);return result;
    }catch(err){window.ensureLiveCamera=realEnsure;aiActive=false;throw err;}
  };
  if(typeof originalEnd==='function')window.endBroadcastEarnings=function(){
    if(!aiActive)return originalEnd.apply(this,arguments);
    var roses=companyRoses,won=roses*30;stopAi();var r=originalEnd.apply(this,arguments);
    setTimeout(function(){if(typeof window.showSheet==='function')showSheet('🏢 AI DJ 방송 종료 · 회사 수익','<div class="rowbox" style="text-align:center"><b>회사 정산 100%</b><br><strong style="font-size:28px;color:#ffe36c">'+money(won)+'</strong></div><div class="rowbox">🌹 '+roses.toLocaleString('ko-KR')+'송이 × 30원<br>AI DJ·게스트 개인 정산 0원</div><button class="act" onclick="closeSheet();home()">확인</button>');},0);return r;
  };

  function watchRemote(){
    var box=document.getElementById('ktRemoteChatList');if(!box||box.__ktAiDjVoiceWatch)return;box.__ktAiDjVoiceWatch=1;var last='';
    new MutationObserver(function(){if(!remoteAi())return;var lines=box.querySelectorAll('.kt-remote-chat-line');var row=lines[lines.length-1];if(!row)return;var b=row.querySelector('b'),sp=row.querySelector('span');if(!b||!sp||clean(b.textContent)!=='AI DJ')return;var t=clean(sp.textContent);if(!t||t===last)return;last=t;djSpeak(t);}).observe(box,{childList:true,subtree:true,characterData:true});
    var root=document.querySelector('.kt-remote-live');if(root&&!root.querySelector('.kt-aidj-remote-mark')){var m=document.createElement('div');m.className='kt-aidj-remote-mark';m.textContent='👩‍🎤 AI DJ · 신청곡 가능';root.appendChild(m);}
  }

  ensureStyle();ensureSwitch();
  [100,300,700,1500,3000].forEach(function(ms){setTimeout(function(){ensureSwitch();watchRemote();},ms);});
  try{new MutationObserver(function(){ensureSwitch();watchRemote();}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
