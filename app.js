var state={joined:false,adult:false,stream:null,raffle:3,saved:false,mic:true,ai:true};
var screen=document.getElementById('screen');
var creator=document.getElementById('creator');
var camera=document.getElementById('camera');
var sheet=document.getElementById('sheet');
var sheetTitle=document.getElementById('sheetTitle');
var sheetBody=document.getElementById('sheetBody');

state.aiVoiceOn=true;
try{
  var savedVoice=localStorage.getItem('ktalk_ai_voice');
  if(savedVoice==='off')state.aiVoiceOn=false;
}catch(e){}

window.ktSpeak=function(text){
  if(!state.aiVoiceOn||!text||!('speechSynthesis' in window))return;
  try{
    var u=new SpeechSynthesisUtterance(String(text));
    u.lang='ko-KR';
    u.rate=1.02;
    u.pitch=1;
    u.volume=1;
    var voices=speechSynthesis.getVoices?speechSynthesis.getVoices():[];
    var ko=voices.find(function(v){return /^ko(-|_)/i.test(v.lang||'');});
    if(ko)u.voice=ko;
    speechSynthesis.speak(u);
  }catch(e){}
};

window.toggleAIVoice=function(btn){
  state.aiVoiceOn=!state.aiVoiceOn;
  try{localStorage.setItem('ktalk_ai_voice',state.aiVoiceOn?'on':'off');}catch(e){}
  if(btn){
    btn.classList.toggle('on',state.aiVoiceOn);
    btn.setAttribute('aria-pressed',state.aiVoiceOn?'true':'false');
  }
  if(state.aiVoiceOn)ktSpeak('에이아이 음성 안내를 켰습니다.');
};

window.ktAnnounceEvent=function(type,data){
  data=data||{};
  if(type==='gift'){
    var who=data.sender?data.sender+'님이 ':'';
    var count=data.count?String(data.count).replace(/,/g,'')+'개 ':'';
    ktSpeak(who+(data.name||'선물')+' '+count+'선물했습니다.');
  }else if(type==='reward'){
    ktSpeak(data.text||'보상이 지급되었습니다.');
  }else if(type==='join'){
    ktSpeak((data.name?data.name+'님, ':'')+'K-Talk에 오신 것을 환영합니다.');
  }else if(type==='notice'){
    ktSpeak(data.text||'알림이 있습니다.');
  }
};

window.ktTodayKey=function(){
  var d=new Date();
  return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
};

window.ktAttendanceHeartCount=function(){
  try{return parseInt(localStorage.getItem('ktalk_attendance_hearts')||'0',10)||0;}catch(e){return state.attendanceHearts||0;}
};

window.ktAttendanceCheckedToday=function(){
  try{return localStorage.getItem('ktalk_attendance_date')===ktTodayKey();}catch(e){return state.attendanceDate===ktTodayKey();}
};

window.ktRenderAttendance=function(){
  var btn=document.getElementById('ktAttendanceHeart');
  if(!btn)return;
  var done=ktAttendanceCheckedToday();
  btn.classList.toggle('done',done);
  var label=btn.querySelector('.kt-attendance-label');
  var sub=btn.querySelector('.kt-attendance-sub');
  if(label)label.textContent=done?'출석 완료':'출석체크';
  if(sub)sub.textContent=done?'오늘 보상 받음':'하트 1개 · 30원';
};

window.ktAttendanceCheck=function(){
  if(ktAttendanceCheckedToday()){
    ktSpeak('오늘 출석 보상은 이미 받았습니다.');
    alert('오늘 출석 보상은 이미 받았습니다.');
    ktRenderAttendance();
    return;
  }
  var count=ktAttendanceHeartCount()+1;
  state.attendanceHearts=count;
  state.attendanceDate=ktTodayKey();
  try{
    localStorage.setItem('ktalk_attendance_hearts',String(count));
    localStorage.setItem('ktalk_attendance_date',ktTodayKey());
  }catch(e){}
  ktAnnounceEvent('reward',{text:'출석 체크 완료. 하트 1개, 30원 상당 보상을 받았습니다.'});
  alert('💗 출석 완료! 하트 1개(30원) 받았습니다.');
  ktRenderAttendance();
};

window.ktGuestRewards=window.ktGuestRewards||{};

window.ktGuestRewardKey=function(id){
  return String(state.currentLiveRoomTitle||state.currentViewRoomTitle||'room')+'::'+String(id||'guest');
};

window.ktGetGuestReward=function(id){
  var key=ktGuestRewardKey(id);
  var now=Date.now();
  var data=window.ktGuestRewards[key];
  if(!data){
    data={startedAt:now,likes:0,roses:0,lastRewardAt:0,hourIndex:0};
    window.ktGuestRewards[key]=data;
  }
  return data;
};

window.ktGuestHourInfo=function(data){
  var now=Date.now();
  var elapsed=Math.max(0,now-data.startedAt);
  var hourIndex=Math.min(4,Math.floor(elapsed/3600000));
  var finished=elapsed>=5*3600000 || data.roses>=5;
  var nextAt=data.startedAt+(hourIndex+1)*3600000;
  return {hourIndex:hourIndex,finished:finished,nextAt:nextAt,elapsed:elapsed};
};

window.addGuestLike=function(id,name,emoji){
  var data=ktGetGuestReward(id);
  var info=ktGuestHourInfo(data);
  if(info.finished){
    ktSpeak('게스트 좋아요 보상 5시간이 끝났습니다.');
    alert('게스트 좋아요 보상은 5시간 종료되었습니다.');
    openGuestProfile(id,name,emoji);
    return;
  }
  if(data.hourIndex!==info.hourIndex){
    data.hourIndex=info.hourIndex;
    data.likes=0;
  }
  data.likes++;
  if(data.likes>=30){
    if(data.lastRewardAt < data.startedAt+(info.hourIndex*3600000)){
      data.roses++;
      data.lastRewardAt=Date.now();
      data.likes=0;
      ktAnnounceEvent('reward',{text:(name||'게스트')+'님이 좋아요 30개를 받아 장미 1송이를 받았습니다.'});
      alert('🌹 '+(name||'게스트')+' 좋아요 30개 달성! 장미 1송이 지급');
    }else{
      data.likes=30;
      alert('이번 1시간 보상은 이미 받았습니다. 다음 시간에 다시 받을 수 있습니다.');
    }
  }
  openGuestProfile(id,name,emoji);
};

window.openGuestProfile=function(id,name,emoji){
  name=name||'게스트';
  emoji=emoji||'🙂';
  var data=ktGetGuestReward(id);
  var info=ktGuestHourInfo(data);
  var remain=info.finished?0:Math.max(0,info.nextAt-Date.now());
  var mins=Math.floor(remain/60000);
  var secs=Math.floor((remain%60000)/1000);
  var time=String(mins).padStart(2,'0')+':'+String(secs).padStart(2,'0');
  var safeId=String(id).replace(/'/g,"\\'");
  var safeName=String(name).replace(/'/g,"\\'");
  var safeEmoji=String(emoji).replace(/'/g,"\\'");
  var html='<div class="kt-guest-profile">'
    +'<div class="kt-guest-profile-top">'
      +'<div class="kt-guest-avatar">'+emoji+'</div>'
      +'<div class="kt-guest-name"><b>'+name+'</b><small>게스트 프로필</small></div>'
      +(info.finished
        ?'<button class="kt-guest-heart done" disabled aria-label="좋아요 보상 종료">💗</button>'
        :'<button class="kt-guest-heart" onclick="addGuestLike(\''+safeId+'\',\''+safeName+'\',\''+safeEmoji+'\')" aria-label="좋아요">💗</button>')
    +'</div>'
    +'<div class="kt-guest-like-box">'
      +'<strong>💗 '+Math.min(data.likes,30)+' / 30</strong>'
      +'<span>좋아요 30개 달성하면 🌹 장미 1송이</span>'
      +'<small>1시간에 1번 · 최대 5시간 · 최대 장미 5송이</small>'
    +'</div>'
    +'<div class="kt-guest-progress"><div style="width:'+(Math.min(data.likes,30)/30*100)+'%"></div></div>'
    +'<div class="kt-guest-stats"><span>받은 장미 <b>'+data.roses+'송이</b></span><span>'+(info.finished?'5시간 종료':'이번 시간 '+time+' 남음')+'</span></div>'
    +'<div class="kt-guest-like-note">'+(info.finished?'좋아요 보상 5시간 종료':'사진 옆 하트를 눌러주세요')+'</div>'
    +'</div>';
  showSheet('게스트 프로필',html);
};




window.activate=function(name){document.querySelectorAll('[data-tab]').forEach(function(b){b.classList.toggle('active',b.dataset.tab===name);});};
window.ktStopSheetMedia=function(){
  try{
    [].slice.call(sheetBody.querySelectorAll('video,audio')).forEach(function(m){
      try{
        m.pause();
        m.muted=true;
        m.currentTime=0;
        m.removeAttribute('autoplay');
        m.removeAttribute('src');
        m.srcObject=null;
        m.load();
      }catch(e){}
    });
  }catch(e){}
  try{
    var preview=document.getElementById('ktCreatorPreview');
    if(preview){
      preview.pause();
      preview.muted=true;
      try{preview.currentTime=0;}catch(e){}
    }
  }catch(e){}
  if(typeof ktLibraryPlayUrl!=='undefined'&&ktLibraryPlayUrl){
    try{URL.revokeObjectURL(ktLibraryPlayUrl);}catch(e){}
    ktLibraryPlayUrl='';
  }
};
window.showSheet=function(title,html){
  ktStopSheetMedia();
  sheet.classList.remove('camera-effect-sheet');
  sheet.classList.remove('gift-shop25');
  sheet.classList.remove('gift-final-v1');
  sheetTitle.innerHTML=title;
  sheetBody.innerHTML=html;
  sheet.classList.add('show');
};
window.closeSheet=function(){
  ktStopSheetMedia();
  try{creator.classList.remove('beauty-preview-open');}catch(e){}
  try{var lp=creator.querySelector('.live-prep');if(lp)lp.style.removeProperty('display');}catch(e){}
  try{sheetBody.innerHTML='';}catch(e){}
  sheet.classList.remove('show');
  sheet.classList.remove('gift-exact');
  sheet.classList.remove('gift-shop25');
  sheet.classList.remove('gift-final-v1');
  sheet.classList.remove('camera-effect-sheet');
};

window.home=function(){
  document.body.classList.remove('kt-home');
  screen.innerHTML='<section class="media"><div class="play">▶</div><div class="host-meta"><b>♛ K-Talk</b><span>홈 동영상 보기</span></div><div class="right-actions"><button onclick="needJoin(\'좋아요를 누르려면 가입해 주세요.\')">♡<small>좋아요</small></button><button onclick="openComments()">💬<small>댓글</small></button><button onclick="openGifts()">🎁<small>선물</small></button><button onclick="shareApp()">↗<small>공유</small></button></div></section>';
};
window.media=function(type){
  document.body.classList.remove('kt-home');
  var label=type==='shorts'?'쇼츠':'동영상';
  screen.innerHTML='<section class="media"><div class="play">▶</div><div class="host-meta"><b>♛ K-Talk</b><span>'+label+' 보기 화면</span></div><div class="right-actions"><button onclick="needJoin(\'좋아요를 누르려면 가입해 주세요.\')">♡<small>좋아요</small></button><button onclick="openComments()">💬<small>댓글</small></button><button onclick="openGifts()">🎁<small>선물</small></button><button onclick="shareApp()">↗<small>공유</small></button></div></section>';
};
window.friends=function(){document.body.classList.remove('kt-home');screen.innerHTML='<section class="friends-page"><div class="friends-head"><b>방송목록</b></div><div class="friends-list"><div class="friend-row"><div class="friend-info"><b>현재 방송목록</b><span>방송이 시작되면 여기에 표시됩니다.</span></div></div></div></section>';};

state.cameraFacing=state.cameraFacing||'user';
state.beautyOn=!!state.beautyOn;
state.effectOn=!!state.effectOn;

window.ktStopBackgroundMedia=function(){
  try{
    document.querySelectorAll('video,audio').forEach(function(media){
      if(media===camera||media.id==='cameraBg'||media.id==='ktCreatorPreview')return;
      try{
        media.pause();
        media.muted=true;
        media.volume=0;
      }catch(e){}
    });
  }catch(e){}
  try{window.ktStopSheetMedia&&window.ktStopSheetMedia();}catch(e){}
  try{window.speechSynthesis&&window.speechSynthesis.cancel();}catch(e){}
};

if(!window.__ktCreatorMediaStopInstalled){
  window.__ktCreatorMediaStopInstalled=true;
  document.addEventListener('play',function(e){
    var media=e.target;
    if(!creator.classList.contains('show')||media===camera||media.id==='cameraBg'||media.id==='ktCreatorPreview')return;
    try{media.pause();media.muted=true;media.volume=0;}catch(err){}
  },true);
}

window.openCreator=async function(){
  ktStopBackgroundMedia();
  creator.classList.add('show');
  creator.classList.remove('creator-review','creator-recording','live-prep-open');
  if(window.ensureLiveCamera){
    try{await ensureLiveCamera(state.cameraFacing||'user');}catch(e){}
  }else if(window.ensureCreatorPreviewCamera){
    try{await ensureCreatorPreviewCamera(state.cameraFacing||'user');}catch(e){}
  }
};
window.closeCreator=function(){
  if(ktCreatorRecording)stopCreatorRecording();
  creator.classList.remove('show','camera-on','creator-recording','creator-review');
  try{
    var p=document.getElementById('ktCreatorPreview');
    if(p){p.pause();p.removeAttribute('src');p.load();p.style.display='none';}
  }catch(e){}
  if(ktCreatorBlobUrl){try{URL.revokeObjectURL(ktCreatorBlobUrl);}catch(e){}}
  ktCreatorBlobUrl='';ktCreatorBlob=null;ktCreatorChunks=[];
  if(state.stream){state.stream.getTracks().forEach(function(t){t.stop();});state.stream=null;if(camera)camera.srcObject=null;}
};

window.applyBaseCameraLook=function(){
  if(!camera)return;
  if(!state.editFilter && !state.beautyMode){
    camera.style.filter='brightness(1.12) contrast(.95) saturate(1.02)';
  }
};

window.ktAttachCreatorCamera=async function(stream){
  if(!camera||!stream)return false;
  var cameraBg=document.getElementById('cameraBg');
  try{
    camera.pause();
    camera.srcObject=null;
  }catch(e){}
  try{
    camera.autoplay=true;
    camera.muted=true;
    camera.defaultMuted=true;
    camera.playsInline=true;
    camera.setAttribute('autoplay','');
    camera.setAttribute('muted','');
    camera.setAttribute('playsinline','');
    camera.disablePictureInPicture=true;
  }catch(e){}
  camera.srcObject=stream;
  if(cameraBg){
    cameraBg.autoplay=true;
    cameraBg.muted=true;
    cameraBg.defaultMuted=true;
    cameraBg.playsInline=true;
    cameraBg.srcObject=stream;
    try{cameraBg.play().catch(function(){});}catch(e){}
  }
  creator.classList.add('camera-on');
  applyBaseCameraLook();

  try{
    var videoTrack=stream.getVideoTracks&&stream.getVideoTracks()[0];
    var caps=videoTrack&&videoTrack.getCapabilities?videoTrack.getCapabilities():null;
    if(caps&&caps.zoom&&typeof caps.zoom.min==='number'){
      await videoTrack.applyConstraints({advanced:[{zoom:caps.zoom.min}]});
    }
  }catch(e){}

  try{
    await new Promise(function(resolve){
      var done=false;
      function finish(){if(done)return;done=true;resolve();}
      if(camera.readyState>=1)finish();
      else{
        camera.addEventListener('loadedmetadata',finish,{once:true});
        setTimeout(finish,500);
      }
    });
  }catch(e){}

  try{await camera.play();}catch(e){}
  setTimeout(function(){
    try{
      if(camera.paused||camera.readyState<2)camera.play().catch(function(){});
    }catch(e){}
  },250);
  return true;
};

window.ensureCreatorPreviewCamera=async function(facing){
  if(window.ensureLiveCamera){
    return await ensureLiveCamera(facing||state.cameraFacing||'user');
  }
  return false;
};

window.ensureLiveCamera=async function(facing){
  try{
    var videoLive=state.stream&&state.stream.getVideoTracks&&state.stream.getVideoTracks().some(function(t){return t.readyState==='live';});
    var audioLive=state.stream&&state.stream.getAudioTracks&&state.stream.getAudioTracks().some(function(t){return t.readyState==='live';});

    /* 이미 화면이 나오고 있으면 카메라는 끊지 않고 마이크만 추가합니다. */
    if(videoLive){
      if(!audioLive){
        try{
          var audioStream=await navigator.mediaDevices.getUserMedia({
            audio:{
              echoCancellation:true,
              noiseSuppression:true,
              autoGainControl:true,
              sampleRate:{ideal:48000},
              channelCount:{ideal:1}
            },
            video:false
          });
          var at=audioStream.getAudioTracks&&audioStream.getAudioTracks()[0];
          if(at)state.stream.addTrack(at);
        }catch(e){}
      }
      await ktAttachCreatorCamera(state.stream);
      return true;
    }

    if(state.stream){
      try{state.stream.getTracks().forEach(function(t){t.stop();});}catch(e){}
      state.stream=null;
      if(camera)camera.srcObject=null;
    }

    state.cameraFacing=facing||state.cameraFacing||'user';

    try{
      state.stream=await navigator.mediaDevices.getUserMedia({
        video:{
          facingMode:state.cameraFacing,
          width:{ideal:1920},
          height:{ideal:1080},
          frameRate:{ideal:30,max:30}
        },
        audio:{
          echoCancellation:true,
          noiseSuppression:true,
          autoGainControl:true,
          sampleRate:{ideal:48000},
          channelCount:{ideal:1}
        }
      });
    }catch(firstErr){
      state.stream=await navigator.mediaDevices.getUserMedia({
        video:{width:{ideal:1920},height:{ideal:1080},frameRate:{ideal:30,max:30}},
        audio:{
          echoCancellation:true,
          noiseSuppression:true,
          autoGainControl:true,
          sampleRate:{ideal:48000},
          channelCount:{ideal:1}
        }
      });
    }

    var track=state.stream.getVideoTracks&&state.stream.getVideoTracks()[0];
    if(track){
      try{track.contentHint='detail';}catch(e){}
      try{
        var caps=track.getCapabilities?track.getCapabilities():{};
        if(caps.focusMode&&caps.focusMode.indexOf('continuous')>-1){
          await track.applyConstraints({advanced:[{focusMode:'continuous'}]});
        }
      }catch(e){}
    }

    return await ktAttachCreatorCamera(state.stream);
  }catch(e){
    creator.classList.remove('camera-on');
    return false;
  }
};

window.startBroadcast=async function(){
  var ok=await ensureLiveCamera(state.cameraFacing||'user');
  if(!ok)return;
};

var ktCreatorRecorder=null;
var ktCreatorChunks=[];
var ktCreatorBlob=null;
var ktCreatorBlobUrl='';
var ktCreatorRecording=false;
var ktAutoPlayReview=false;
var ktEffectRecordCanvas=null;
var ktEffectRecordFrame=0;
var ktEffectRecordStream=null;
var ktCreatorDuration=600000;
var ktCreatorDurationTimer=0;

window.selectCreatorDuration=function(el,duration){
  ktCreatorDuration=duration;
  document.querySelectorAll('.creator-bottom .modes span').forEach(function(s){s.classList.remove('on');});
  if(el)el.classList.add('on');
};

window.stopEffectRecordingCanvas=function(){
  if(ktEffectRecordFrame)cancelAnimationFrame(ktEffectRecordFrame);
  ktEffectRecordFrame=0;
  if(ktEffectRecordStream){
    try{ktEffectRecordStream.getVideoTracks().forEach(function(t){t.stop();});}catch(e){}
  }
  ktEffectRecordStream=null;
  ktEffectRecordCanvas=null;
};

window.makeEffectRecordingStream=function(){
  var selected=state.appliedEditEffect||state.pendingEditEffect||'off';
  if(selected==='off'||!camera||!camera.videoWidth)return state.stream;

  var canvas=document.createElement('canvas');
  canvas.width=1080;canvas.height=1920;
  var ctx=canvas.getContext('2d');
  if(!ctx||!canvas.captureStream)return state.stream;
  ktEffectRecordCanvas=canvas;

  function draw(){
    if(!ktCreatorRecording&&ktCreatorRecorder&&ktCreatorRecorder.state==='inactive')return;
    var sw=camera.videoWidth||1920,sh=camera.videoHeight||1080;
    var scale=Math.max(canvas.width/sw,canvas.height/sh);
    var dw=sw*scale,dh=sh*scale,dx=(canvas.width-dw)/2,dy=(canvas.height-dh)/2;
    ctx.save();ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.translate(canvas.width,0);ctx.scale(-1,1);
    try{ctx.drawImage(camera,dx,dy,dw,dh);}catch(e){}
    ctx.restore();

    var anchor=document.getElementById('ktFaceAnchor');
    var cr=creator.getBoundingClientRect();
    var ar=anchor&&anchor.getBoundingClientRect();
    var cx=canvas.width*.5,cy=canvas.height*.38,fw=canvas.width*.32,fh=fw*1.18;
    if(ar&&cr.width&&cr.height){
      cx=((ar.left-cr.left)+(ar.width/2))/cr.width*canvas.width;
      cy=((ar.top-cr.top)+(ar.height/2))/cr.height*canvas.height;
      fw=ar.width/cr.width*canvas.width;fh=ar.height/cr.height*canvas.height;
    }
    var icons={puppy:'🐶',cat:'😺',bunny:'🐰',heart:'💕',flower:'🌸🌼🌸',sparkle:'✨',angel:'😇',party:'🎉🥳🎉'};
    ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.42)';ctx.shadowBlur=12;
    if(selected==='sunglasses'){
      ctx.font=Math.max(76,fw*.64)+'px sans-serif';ctx.fillText('🕶️',cx,cy-fh*.12);
    }else if(selected==='cap'){
      ctx.font=Math.max(84,fw*.68)+'px sans-serif';ctx.fillText('🧢',cx,cy-fh*.58);
    }else if(icons[selected]){
      ctx.font=Math.max(78,fw*.58)+'px sans-serif';
      var iy=(selected==='flower'||selected==='angel'||selected==='party')?cy-fh*.57:selected==='heart'?cy-fh*.42:cy;
      ctx.fillText(icons[selected],cx,iy);
    }
    ctx.shadowBlur=0;
    ktEffectRecordFrame=requestAnimationFrame(draw);
  }
  draw();
  var canvasStream=canvas.captureStream(30);
  try{state.stream.getAudioTracks().forEach(function(t){canvasStream.addTrack(t);});}catch(e){}
  ktEffectRecordStream=canvasStream;
  return canvasStream;
};

window.startCreatorRecording=async function(){
  if(ktCreatorRecording){ stopCreatorRecording(); return; }
  ktStopBackgroundMedia();
  if(!('MediaRecorder' in window)){
    alert('이 기기에서는 동영상 촬영 기능을 사용할 수 없습니다.');
    return;
  }
  var ok=await ensureLiveCamera(state.cameraFacing||'user');
  if(!ok)return;

  ktCreatorChunks=[];
  ktCreatorBlob=null;
  ktImportedVideoName='';
  if(ktCreatorBlobUrl){try{URL.revokeObjectURL(ktCreatorBlobUrl);}catch(e){} ktCreatorBlobUrl='';}

  try{
    /* 브라우저가 자기 기기에서 가장 안정적인 영상 형식을 직접 선택하게 합니다. */
    ktCreatorRecorder=new MediaRecorder(makeEffectRecordingStream());
  }catch(e){
    try{
      ktCreatorRecorder=new MediaRecorder(makeEffectRecordingStream(),{mimeType:'video/webm;codecs=vp8,opus'});
    }catch(err){
      alert('동영상 촬영을 시작할 수 없습니다.');
      return;
    }
  }

  ktCreatorRecorder.ondataavailable=function(e){
    if(e.data&&e.data.size)ktCreatorChunks.push(e.data);
  };

  ktCreatorRecorder.onstop=function(){
    if(ktCreatorDurationTimer){clearTimeout(ktCreatorDurationTimer);ktCreatorDurationTimer=0;}
    ktCreatorRecording=false;
    stopEffectRecordingCanvas();
    var firstType=(ktCreatorChunks[0]&&ktCreatorChunks[0].type)||'';
    var type=firstType||(ktCreatorRecorder&&ktCreatorRecorder.mimeType)||'video/webm';
    ktCreatorBlob=new Blob(ktCreatorChunks,{type:type});

    if(!ktCreatorBlob || ktCreatorBlob.size<1500){
      creator.classList.remove('creator-recording','creator-review');
      creator.classList.add('camera-on');
      alert('영상이 너무 짧게 촬영되었습니다. 1초 이상 찍은 뒤 화면을 눌러 종료해 주세요.');
      return;
    }

    ktCreatorBlobUrl=URL.createObjectURL(ktCreatorBlob);
    var preview=document.getElementById('ktCreatorPreview');
    var fallback=document.getElementById('ktCreatorPreviewFallback');

    if(fallback)fallback.style.display='none';
    if(preview){
      preview.pause();
      preview.muted=!ktAutoPlayReview;
      preview.controls=true;
      preview.playsInline=true;
      preview.onerror=function(){
        preview.style.display='none';
        if(fallback)fallback.style.display='grid';
      };
      preview.onloadedmetadata=function(){
        try{
          if(isFinite(preview.duration)&&preview.duration>0){
            preview.currentTime=Math.min(.08,Math.max(.01,preview.duration/10));
          }
        }catch(e){}
      };
      preview.src=ktCreatorBlobUrl;
      preview.load();
      preview.style.display='block';
      if(ktAutoPlayReview){
        preview.oncanplay=function(){
          preview.oncanplay=null;
          preview.muted=false;
          preview.volume=1;
          preview.play().catch(function(){});
        };
      }
    }

    creator.classList.remove('creator-recording');
    creator.classList.add('creator-review');
    ktAutoPlayReview=false;
  };

  try{
    ktCreatorRecorder.start(500);
    ktCreatorRecording=true;
    if(ktCreatorDurationTimer)clearTimeout(ktCreatorDurationTimer);
    ktCreatorDurationTimer=setTimeout(function(){if(ktCreatorRecording)stopCreatorRecording();},ktCreatorDuration);
    creator.classList.remove('creator-review','live-prep-open');
    creator.classList.add('creator-recording','camera-on');
  }catch(e){
    ktCreatorRecording=false;
    alert('동영상 촬영을 시작할 수 없습니다.');
  }
};

window.stopCreatorRecording=function(){
  if(!ktCreatorRecording||!ktCreatorRecorder)return;
  if(ktCreatorDurationTimer){clearTimeout(ktCreatorDurationTimer);ktCreatorDurationTimer=0;}
  try{
    if(ktCreatorRecorder.state!=='inactive'){
      try{ktCreatorRecorder.requestData();}catch(e){}
      ktCreatorRecorder.stop();
    }
  }catch(e){}
};

window.confirmCreatorRecording=function(){
  if(!ktCreatorRecording)return;
  ktAutoPlayReview=true;
  stopCreatorRecording();
};

window.deleteCreatorRecording=function(){
  try{
    var p=document.getElementById('ktCreatorPreview');
    var f=document.getElementById('ktCreatorPreviewFallback');
    if(p){p.pause();p.onerror=null;p.onloadedmetadata=null;p.removeAttribute('src');p.load();p.style.display='none';}
    if(f)f.style.display='none';
  }catch(e){}
  if(ktCreatorBlobUrl){try{URL.revokeObjectURL(ktCreatorBlobUrl);}catch(e){}}
  ktCreatorBlobUrl='';
  ktCreatorBlob=null;
  ktCreatorChunks=[];
  creator.classList.remove('creator-review');
  creator.classList.add('camera-on');
  try{if(camera&&state.stream){camera.srcObject=state.stream;camera.play().catch(function(){});}}catch(e){}
};

window.saveCreatorRecording=async function(){
  if(!ktCreatorBlob||!ktCreatorBlobUrl){alert('저장할 동영상이 없습니다.');return;}
  try{
    var ext=(ktCreatorBlob.type||'').indexOf('mp4')>-1?'mp4':'webm';
    var filename='K-Talk_'+Date.now()+'.'+ext;
    var file=new File([ktCreatorBlob],filename,{type:ktCreatorBlob.type||('video/'+ext)});

    if(window.showSaveFilePicker){
      var handle=await showSaveFilePicker({
        suggestedName:filename,
        types:[{description:'K-Talk 동영상',accept:{[file.type]:['.'+ext]}}]
      });
      var writable=await handle.createWritable();
      await writable.write(ktCreatorBlob);
      await writable.close();
      ktSpeak('동영상을 저장했습니다.');
      return;
    }

    if(navigator.share && navigator.canShare && navigator.canShare({files:[file]})){
      await navigator.share({files:[file],title:'K-Talk 동영상'});
      return;
    }

    var a=document.createElement('a');
    a.href=ktCreatorBlobUrl;
    a.download=filename;
    a.rel='noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    ktSpeak('동영상을 저장했습니다.');
  }catch(e){
    if(e&&e.name==='AbortError')return;
    alert('동영상 저장을 완료하지 못했습니다.');
  }
};

var ktImportedVideoName='';
var ktLibraryPlayUrl='';

window.openMyVideoPicker=function(){
  var input=document.getElementById('ktMyVideoInput');
  if(input){
    input.value='';
    input.click();
  }
};

window.playCreatorPreviewWithSound=function(){
  var preview=document.getElementById('ktCreatorPreview');
  var btn=document.getElementById('ktCreatorSoundPlay');
  if(!preview)return;
  try{
    preview.defaultMuted=false;
    preview.muted=false;
    preview.removeAttribute('muted');
    preview.volume=1;
  }catch(e){}
  var p=preview.play();
  if(p&&p.then){
    p.then(function(){
      if(btn){
        btn.style.display='flex';
        btn.textContent='🔊 소리 켜짐';
        setTimeout(function(){if(!preview.paused)btn.style.display='none';},900);
      }
    }).catch(function(){
      if(btn){
        btn.style.display='flex';
        btn.textContent='🔊 눌러서 소리 재생';
      }
    });
  }
};

window.handleMyVideoPick=function(input){
  var file=input&&input.files&&input.files[0];
  if(!file)return;
  if(!String(file.type||'').startsWith('video/')){
    alert('동영상 파일을 선택해 주세요.');
    return;
  }
  if(ktCreatorBlobUrl){try{URL.revokeObjectURL(ktCreatorBlobUrl);}catch(e){}}
  ktCreatorBlob=file;
  ktImportedVideoName=file.name||('내 동영상 '+Date.now());
  ktCreatorBlobUrl=URL.createObjectURL(file);

  var preview=document.getElementById('ktCreatorPreview');
  var fallback=document.getElementById('ktCreatorPreviewFallback');
  if(fallback)fallback.style.display='none';
  if(preview){
    var soundBtn=document.getElementById('ktCreatorSoundPlay');
    preview.pause();
    try{
      preview.defaultMuted=false;
      preview.muted=false;
      preview.removeAttribute('muted');
      preview.volume=1;
    }catch(e){}
    preview.controls=true;
    preview.playsInline=true;
    preview.preload='metadata';
    preview.onerror=function(){
      preview.style.display='none';
      if(soundBtn)soundBtn.style.display='none';
      if(fallback)fallback.style.display='grid';
    };
    preview.onloadedmetadata=function(){
      try{
        var t=(isFinite(preview.duration)&&preview.duration>0)?Math.min(0.08,Math.max(0.02,preview.duration/30)):0.03;
        preview.currentTime=t;
      }catch(e){}
      preview.pause();
      preview.style.display='block';
      if(soundBtn){
        soundBtn.style.display='flex';
        soundBtn.textContent='🔊 눌러서 소리 재생';
      }
    };
    preview.onloadeddata=function(){
      preview.pause();
      preview.style.display='block';
      if(soundBtn){
        soundBtn.style.display='flex';
        soundBtn.textContent='🔊 눌러서 소리 재생';
      }
    };
    preview.onplay=function(){
      try{
        preview.defaultMuted=false;
        preview.muted=false;
        preview.removeAttribute('muted');
        preview.volume=1;
      }catch(e){}
      if(soundBtn){
        soundBtn.style.display='flex';
        soundBtn.textContent='🔊 소리 켜짐';
        setTimeout(function(){if(!preview.paused)soundBtn.style.display='none';},900);
      }
    };
    preview.onpause=function(){
      if(!preview.ended&&soundBtn){
        soundBtn.style.display='flex';
        soundBtn.textContent='🔊 눌러서 소리 재생';
      }
    };
    preview.src=ktCreatorBlobUrl;
    preview.load();
    preview.style.display='block';
  }
  creator.classList.remove('creator-recording','live-prep-open','camera-on');
  creator.classList.add('show','creator-review');
};

function ktOpenVideoDB(){
  return new Promise(function(resolve,reject){
    if(!('indexedDB' in window)){reject(new Error('indexedDB unavailable'));return;}
    var req=indexedDB.open('KTALK_VIDEO_DB',1);
    req.onupgradeneeded=function(){
      var db=req.result;
      if(!db.objectStoreNames.contains('videos')){
        db.createObjectStore('videos',{keyPath:'id'});
      }
    };
    req.onsuccess=function(){resolve(req.result);};
    req.onerror=function(){reject(req.error||new Error('db error'));};
  });
}

window.saveCreatorDraft=async function(){
  if(!ktCreatorBlob){alert('임시 저장할 동영상이 없습니다.');return;}
  try{
    var db=await ktOpenVideoDB();
    var tx=db.transaction('videos','readwrite');
    tx.objectStore('videos').put({
      id:'draft-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
      name:'임시 저장 동영상 '+new Date().toLocaleString('ko-KR'),
      type:ktCreatorBlob.type||'video/webm',blob:ktCreatorBlob,createdAt:Date.now(),draft:true
    });
    await new Promise(function(resolve,reject){tx.oncomplete=resolve;tx.onerror=function(){reject(tx.error);};tx.onabort=function(){reject(tx.error);};});
    db.close();
    alert('✅ 임시 저장했습니다.');
  }catch(e){alert('이 기기에서는 임시 저장하지 못했습니다.');}
};

window.shareCreatorRecording=async function(){
  if(!ktCreatorBlob){alert('보낼 동영상이 없습니다.');return;}
  try{
    var ext=(ktCreatorBlob.type||'').indexOf('mp4')>-1?'mp4':'webm';
    var file=new File([ktCreatorBlob],'K-Talk_'+Date.now()+'.'+ext,{type:ktCreatorBlob.type||('video/'+ext)});
    if(navigator.share&&navigator.canShare&&navigator.canShare({files:[file]})){
      await navigator.share({files:[file],title:'K-Talk 동영상',text:'친구에게 보내는 K-Talk 동영상입니다.'});
    }else{
      alert('이 휴대폰에서는 공유 기능을 사용할 수 없습니다. 저장한 뒤 친구에게 보내 주세요.');
    }
  }catch(e){if(!e||e.name!=='AbortError')alert('동영상을 보내지 못했습니다.');}
};

window.postCreatorRecording=async function(){
  if(!ktCreatorBlob){alert('올릴 동영상이 없습니다.');return;}
  try{
    var db=await ktOpenVideoDB();
    var tx=db.transaction('videos','readwrite');
    var store=tx.objectStore('videos');
    var item={
      id:'video-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
      name:ktImportedVideoName||('K-Talk 동영상 '+new Date().toLocaleString('ko-KR')),
      type:ktCreatorBlob.type||'video/webm',
      blob:ktCreatorBlob,
      createdAt:Date.now()
    };
    store.put(item);
    await new Promise(function(resolve,reject){
      tx.oncomplete=resolve;
      tx.onerror=function(){reject(tx.error||new Error('save error'));};
      tx.onabort=function(){reject(tx.error||new Error('save abort'));};
    });
    db.close();
    ktSpeak('내 동영상에 올렸습니다.');
    alert('✅ 내 동영상에 올렸습니다.');
    closeCreator();
    if(window.openMyVideoLibrary)openMyVideoLibrary();
  }catch(e){
    alert('이 기기에서는 동영상을 보관하지 못했습니다.');
  }
};

window.openMyVideoLibrary=async function(){
  try{
    var db=await ktOpenVideoDB();
    var tx=db.transaction('videos','readonly');
    var req=tx.objectStore('videos').getAll();
    req.onsuccess=function(){
      var items=(req.result||[]).sort(function(a,b){return b.createdAt-a.createdAt;});
      var html='<div class="kt-myvideo-head"><b>🎬 내 동영상</b><button onclick="closeSheet();openCreator();setTimeout(openMyVideoPicker,120)">＋ 휴대폰 동영상 올리기</button></div>';
      if(!items.length){
        html+='<div class="rowbox"><b>아직 올린 동영상이 없습니다.</b><br>휴대폰에 찍어 놓은 동영상을 선택해서 올릴 수 있습니다.</div>';
      }else{
        html+='<div class="kt-myvideo-list">'+items.map(function(v){
          var d=new Date(v.createdAt);
          return '<div class="kt-myvideo-row" data-video-id="'+v.id+'">'
            +'<button type="button" class="play" data-play-video="'+v.id+'" onclick="playStoredVideo(\''+v.id+'\')"><span>▶</span><b>'+String(v.name||'내 동영상').replace(/</g,'&lt;')+'</b><small>'+d.toLocaleDateString('ko-KR')+(v.posted?' · 게시됨':'')+'</small></button>'
            +'<div class="kt-myvideo-row-actions"><button type="button" class="upload" onclick="event.preventDefault();event.stopPropagation();postStoredVideo(\''+v.id+'\',this);return false;">'+(v.posted?'✓ 올림':'올리기')+'</button><button type="button" class="trash" data-delete-video="'+v.id+'">삭제</button></div>'
            +'</div>';
        }).join('')+'</div>';
      }
      showSheet('내 동영상',html);
      db.close();
    };
    req.onerror=function(){db.close();alert('내 동영상을 불러오지 못했습니다.');};
  }catch(e){
    showSheet('내 동영상','<div class="rowbox"><b>휴대폰 동영상 선택</b><br>이 브라우저에서는 목록 저장이 제한될 수 있습니다.</div><button class="act" onclick="closeSheet();openCreator();setTimeout(openMyVideoPicker,120)">휴대폰 동영상 선택</button>');
  }
};

window.playStoredVideo=async function(id){
  try{
    var db=await ktOpenVideoDB();
    var tx=db.transaction('videos','readonly');
    var req=tx.objectStore('videos').get(id);
    req.onsuccess=function(){
      var item=req.result;
      db.close();
      if(!item||!item.blob){alert('동영상을 찾지 못했습니다.');return;}
      if(ktLibraryPlayUrl){try{URL.revokeObjectURL(ktLibraryPlayUrl);}catch(e){}}
      ktLibraryPlayUrl=URL.createObjectURL(item.blob);
      var safeName=String(item.name||'내 동영상').replace(/</g,'&lt;');
      showSheet('동영상 재생','<div class="kt-myvideo-player">'
        +'<video id="ktLibraryPlayer" controls autoplay playsinline src="'+ktLibraryPlayUrl+'"></video>'
        +'<b>'+safeName+'</b>'
        +'<div class="kt-myvideo-player-actions">'
          +'<button class="back" onclick="openMyVideoLibrary()">← 내 동영상</button>'
          +'<button class="upload" onclick="postStoredVideo(\''+id+'\',this)">⬆ 동영상 올리기</button>'
        +'</div>'
        +'<button type="button" class="kt-myvideo-player-delete" onclick="deleteStoredVideo(\''+id+'\',this,true)">🗑 삭제</button>'
      +'</div>');
    };
    req.onerror=function(){db.close();alert('동영상을 재생하지 못했습니다.');};
  }catch(e){alert('동영상을 재생하지 못했습니다.');}
};

window.postStoredVideo=async function(id,btn){
  try{
    var db=await ktOpenVideoDB();
    var tx=db.transaction('videos','readwrite');
    var store=tx.objectStore('videos');
    var req=store.get(id);
    req.onsuccess=function(){
      var item=req.result;
      if(!item){db.close();alert('동영상을 찾지 못했습니다.');return;}
      item.posted=true;
      item.postedAt=Date.now();
      store.put(item);
    };
    tx.oncomplete=function(){
      db.close();
      if(btn){
        btn.textContent='✓ 올리기 완료';
        btn.classList.add('done');
      }
      ktSpeak('동영상을 올렸습니다.');
      alert('✅ 동영상을 올렸습니다.');
    };
    tx.onerror=function(){db.close();alert('동영상을 올리지 못했습니다.');};
  }catch(e){alert('동영상을 올리지 못했습니다.');}
};

window.deleteStoredVideo=async function(id,btn,fromPlayer){
  try{
    ktStopSheetMedia();
    if(btn){
      btn.disabled=true;
      btn.textContent='삭제 중...';
    }

    var db=await ktOpenVideoDB();
    await new Promise(function(resolve,reject){
      var tx=db.transaction('videos','readwrite');
      tx.objectStore('videos').delete(id);
      tx.oncomplete=resolve;
      tx.onerror=function(){reject(tx.error||new Error('delete error'));};
      tx.onabort=function(){reject(tx.error||new Error('delete abort'));};
    });

    var gone=await new Promise(function(resolve,reject){
      var tx=db.transaction('videos','readonly');
      var req=tx.objectStore('videos').get(id);
      req.onsuccess=function(){resolve(!req.result);};
      req.onerror=function(){reject(req.error||new Error('verify error'));};
    });

    try{db.close();}catch(e){}
    if(!gone)throw new Error('delete verify failed');

    if(fromPlayer){
      try{ktSpeak('동영상을 삭제했습니다.');}catch(e){}
      openMyVideoLibrary();
      return;
    }

    var row=btn&&btn.closest?btn.closest('.kt-myvideo-row'):document.querySelector('.kt-myvideo-row[data-video-id="'+id+'"]');
    if(row)row.remove();

    var list=document.querySelector('.kt-myvideo-list');
    if(list&&!list.querySelector('.kt-myvideo-row')){
      list.innerHTML='<div class="rowbox"><b>동영상이 모두 삭제되었습니다.</b></div>';
    }
    try{ktSpeak('동영상을 삭제했습니다.');}catch(e){}
  }catch(e){
    if(btn){
      btn.disabled=false;
      btn.textContent='삭제';
    }
    alert('삭제하지 못했습니다. 다시 한 번 눌러 주세요.');
  }
};
if(!window.__ktVideoDeleteCapture){
  window.__ktVideoDeleteCapture=true;
  document.addEventListener('click',function(e){
    var btn=e.target&&e.target.closest?e.target.closest('[data-delete-video]'):null;
    if(!btn)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    var id=btn.getAttribute('data-delete-video');
    if(id)deleteStoredVideo(id,btn,false);
  },true);
}

window.prepTap=async function(el,name){
  if(el){el.classList.add('test-active');setTimeout(function(){el.classList.remove('test-active');},180);}
  if(name==='보정'||name==='뷰티'){
    openBeautyPanel();
    return;
  }
  if(name==='편집효과'){
    openEditEffectPanel();
    return;
  }
  if(name==='전환'){
    state.cameraFacing=(state.cameraFacing==='environment')?'user':'environment';
    try{
      if(state.stream){state.stream.getTracks().forEach(function(t){t.stop();});state.stream=null;}
      if(camera)camera.srcObject=null;
      await ensureLiveCamera(state.cameraFacing);
    }catch(e){}
    return;
  }
  if(name==='설정'){ openLiveSettings(); return; }
  if(name==='멀티게스트'){ if(window.openRoomTypeChooser)openRoomTypeChooser(); return; }
  if(name==='서비스'){ showSheet('서비스+','<div class="rowbox"><b>K-Talk 라이브 서비스+</b><br>라이브 방송 관련 기능을 이용할 수 있습니다.</div>'); return; }
  if(name==='팬클럽'){ if(window.openSubs)openSubs(); return; }
  if(name==='소통하기'){ openCommunicationPanel(); return; }
  if(name==='공유'){ if(window.shareApp)shareApp(); return; }
  if(name==='프로모션'){ showSheet('🔥 프로모션','<div class="rowbox"><b>방송 홍보</b><br>방송을 더 많은 사람에게 알리는 기능입니다.</div>'); return; }
  if(name==='라이브 보상'||name==='코인 리워드'){ openBenefitHub(); return; }
};

window.openBeautyPanel=function(){
  creator.classList.add('beauty-preview-open');
  try{var lp=creator.querySelector('.live-prep');if(lp)lp.style.setProperty('display','none','important');}catch(e){}
  try{if(window.ensureLiveCamera)ensureLiveCamera(state.cameraFacing||'user').catch(function(){});}catch(e){}
  var controls=[['skin','💧','부드럽게',state.beautySkin||35],['face','☺','얼굴형',state.beautyFace||50],['eyes','◉','눈',state.beautyEyes||50],['nose','♢','코',state.beautyNose||50],['mouth','💋','입술',state.beautyMouth||50],['tone','✨','피부',state.beautyTone||35],['bright','☀','밝기',state.beautyBright||25],['sharp','✦','선명도',state.beautySharp||20]];
  var selected=state.beautyControl||'skin';
  var active=controls.filter(function(c){return c[0]===selected;})[0]||controls[0];
  var controlButtons=controls.map(function(c){return '<button class="'+(c[0]===selected?'on':'')+'" onclick="selectBeautyControl(\''+c[0]+'\')"><b>'+c[1]+'</b><span>'+c[2]+'</span></button>';}).join('');
  var html='<div class="kt-beauty-panel">'
    +'<div class="kt-panel-tabs"><button class="on">Beauty</button><button onclick="openEditEffectPanel()">편집효과</button><button onclick="resetBeautyAll()">↺ 초기화</button></div>'
    +'<div class="kt-beauty-controls">'+controlButtons+'</div>'
    +'<div class="kt-beauty-one-slider"><div><span id="beautyControlName">'+active[2]+'</span><b id="beautyControlValue">'+active[3]+'</b></div><div class="kt-beauty-range-line"><button type="button" onclick="adjustBeautyControl(-1)" aria-label="줄이기">−</button><input id="beautyControlRange" type="range" min="1" max="100" value="'+active[3]+'" oninput="setBeautyControlValue(this.value)"><button type="button" onclick="adjustBeautyControl(1)" aria-label="늘리기">＋</button></div></div>'
    +'</div>';
  showSheet('뷰티',html);
  sheet.classList.add('camera-effect-sheet');
};

window.selectBeautyControl=function(kind){
  state.beautyControl=kind;
  openBeautyPanel();
};

window.setBeautyControlValue=function(value){
  var kind=state.beautyControl||'skin';
  value=Math.max(1,Math.min(100,parseInt(value||1,10)));
  var labels={skin:'부드럽게',face:'얼굴형',eyes:'눈',nose:'코',mouth:'입술',tone:'피부',bright:'밝기',sharp:'선명도'};
  var keys={skin:'beautySkin',face:'beautyFace',eyes:'beautyEyes',nose:'beautyNose',mouth:'beautyMouth',tone:'beautyTone',bright:'beautyBright',sharp:'beautySharp'};
  state[keys[kind]]=value;
  applyBeautyPreview();
  var n=document.getElementById('beautyControlName'),v=document.getElementById('beautyControlValue');
  if(n)n.textContent=labels[kind]||'뷰티';
  if(v)v.textContent=value;
};

window.applyBeautyPreview=function(){
  if(!camera)return;
  var skin=Number(state.beautySkin||1),bright=Number(state.beautyBright||1),sharp=Number(state.beautySharp||1);
  var face=Number(state.beautyFace||50),eyes=Number(state.beautyEyes||50),nose=Number(state.beautyNose||50);
  var mouth=Number(state.beautyMouth||50),tone=Number(state.beautyTone||1);
  var brightness=.96+(bright*.0024)+(eyes-50)*.0007;
  var saturation=.94+(sharp*.0016)+(mouth-50)*.0032;
  var contrast=.94+(sharp*.0015)+(eyes-50)*.0012+(nose-50)*.0009;
  var blur=Math.max(0,(skin-1)*.006);
  var sepia=Math.max(0,(tone-50)*.0025);
  var faceScale=1+(face-50)*.0012;
  camera.style.setProperty('filter','brightness('+brightness.toFixed(3)+') saturate('+saturation.toFixed(3)+') contrast('+contrast.toFixed(3)+') blur('+blur.toFixed(2)+'px) sepia('+sepia.toFixed(3)+')','important');
  camera.style.setProperty('transform','scaleX(-1) scale('+faceScale.toFixed(3)+')','important');
};

window.adjustBeautyControl=function(step){
  var range=document.getElementById('beautyControlRange');
  if(!range)return;
  var next=Math.max(1,Math.min(100,parseInt(range.value||1,10)+step));
  range.value=next;
  setBeautyControlValue(next);
};

window.setBeautyMode=function(mode,char){
  state.beautyMode=mode;
  creator.classList.remove('beauty-natural','beauty-bright','beauty-soft','beauty-glow');
  if(mode!=='off')creator.classList.add('beauty-'+mode);
  if(char)creator.setAttribute('data-beauty-char',char);
  else if(mode==='off')creator.removeAttribute('data-beauty-char');
  var btn=[].slice.call(document.querySelectorAll('.prep-item')).find(function(b){return b.textContent.indexOf('보정')>-1;});
  if(btn)btn.classList.toggle('prep-on',mode!=='off'||!!char);
};

window.setBeautySticker=function(char){
  if(char)creator.setAttribute('data-beauty-char',char);
  else creator.removeAttribute('data-beauty-char');
};

window.setBeautySlider=function(kind,value){
  value=parseInt(value||0,10);
  if(kind==='skin')state.beautySkin=value;
  if(kind==='bright')state.beautyBright=value;
  if(kind==='sharp')state.beautySharp=value;
  applyBeautyPreview();
  var val=document.getElementById(kind==='skin'?'beautySkinVal':kind==='bright'?'beautyBrightVal':'beautySharpVal');
  if(val)val.textContent=value;
};

window.resetBeautyAll=function(){
  state.beautyMode='off';state.beautyControl='skin';state.beautySkin=1;state.beautyFace=50;state.beautyEyes=50;state.beautyNose=50;state.beautyMouth=50;state.beautyTone=1;state.beautyBright=1;state.beautySharp=1;
  creator.classList.remove('beauty-natural','beauty-bright','beauty-soft','beauty-glow');
  creator.removeAttribute('data-beauty-char');
  if(camera){camera.style.removeProperty('filter');camera.style.removeProperty('transform');}
  openBeautyPanel();
};

window.clearAllFaceEffects=function(){
  try{ if(window.ktFaceLoopRAF)cancelAnimationFrame(window.ktFaceLoopRAF); }catch(e){}
  window.ktFaceLoopRAF=null;
  window.ktFaceMeshBusy=false;
  window.ktFaceSmooth=null;
  window.ktPartSmooth={};

  var layer=document.getElementById('ktFaceEffectLayer');
  if(layer)layer.remove();

  var tray=document.getElementById('ktLiveEffects');
  if(tray)tray.remove();

  var st=document.getElementById('ktRealFaceEffectStyle');
  if(st)st.remove();

  state.editFilter='';
  state.editSticker='';
  state.pendingEditEffect='off';
  state.appliedEditEffect='off';

  var filterClasses=['fx-glow','fx-soft','fx-rainbow','fx-cool','fx-warm','fx-night','fx-cinema','fx-mono','fx-pink','fx-blue','fx-star','fx-party','fx-disco','fx-dream'];
  if(creator)creator.classList.remove.apply(creator.classList,filterClasses);
  if(camera)camera.style.filter='brightness(1.12) contrast(.95) saturate(1.02)';
};

window.renderFaceEffect=function(){
  clearAllFaceEffects();
};

window.previewEditEffect=function(){
  clearAllFaceEffects();
};

window.setEditEffect=function(){
  clearAllFaceEffects();
};

window.applyEditEffect=function(){
  clearAllFaceEffects();
};

window.closeEditEffectPanel=function(){
  clearAllFaceEffects();
  if(state.effectReturnBeauty){state.effectReturnBeauty=false;openBeautyPanel();}
};

window.switchEditEffectTab=function(){};

window.openEditEffectPanel=function(){
  clearAllFaceEffects();
};

window.toggleLiveSetting=function(btn){
  if(!btn)return;
  btn.classList.toggle('on');
  btn.setAttribute('aria-pressed',btn.classList.contains('on')?'true':'false');
};

window.openLiveSettings=function(){
  var html='<div class="kt-live-settings">'
    +'<button class="kt-setting-row"><span>🌐</span><b>시청 가능 범위</b><em>모두 ›</em></button>'
    +'<button class="kt-setting-row"><span>🎥</span><b>라이브 화질</b><em>1080p ›</em></button>'
    +'<div class="kt-setting-row"><span>🔊</span><b>노이즈 억제</b><button class="kt-switch" onclick="toggleLiveSetting(this)" aria-pressed="false"></button></div>'
    +'<div class="kt-setting-row"><span>🗣️</span><b>AI 음성 안내</b><button class="kt-switch '+(state.aiVoiceOn?'on':'')+'" onclick="toggleAIVoice(this)" aria-pressed="'+(state.aiVoiceOn?'true':'false')+'"></button></div>'
    +'<div class="kt-setting-row"><span>🚀</span><b>안정적 방송</b><button class="kt-switch on" onclick="toggleLiveSetting(this)" aria-pressed="true"></button></div>'
    +'<button class="kt-setting-row"><span>💬</span><b>댓글 안전</b><em>›</em></button>'
    +'<button class="kt-setting-row"><span>👤</span><b>모더레이터</b><em>›</em></button>'
    +'<div class="kt-setting-row"><span>🎁</span><b>라이브 선물</b><button class="kt-switch on" onclick="toggleLiveSetting(this)" aria-pressed="true"></button></div>'
    +'</div>';
  showSheet('⚙ 설정',html);
};

window.openCommunicationPanel=function(){
  var html='<div class="kt-communication-panel">'
    +'<button onclick="openViewerMission()"><span>🎁</span><b>시청자 미션</b><em>›</em></button>'
    +'<button onclick="openGuideBook()"><span>📖</span><b>가이드 북</b><em>›</em></button>'
    +'<button onclick="openTextVote()"><span>☰</span><b>텍스트 투표</b><em>›</em></button>'
    +'</div>';
  showSheet('소통하기',html);
};

window.openBenefitHub=function(){
  var html='<div class="kt-benefit-home">'
    +'<div class="kt-benefit-headrow"><div class="kt-benefit-banner">📢 K-Talk 혜택 · 보상 · 사용방법을 한 번에 확인하세요</div><button class="kt-benefit-reward-btn" onclick="openReceiveBenefits()">🎁 보상 혜택</button></div>'
    +'<div class="kt-benefit-top">'
      +'<div><span>🌹</span><b>내 장미</b><strong>10,000개</strong></div>'
      +'<div><span>🎁</span><b>받은 보상</b><strong>200개</strong></div>'
      +'<div><span>💰</span><b>정산 금액</b><strong>105,000원</strong></div>'
    +'</div>'
    +'<div class="kt-benefit-net-note">🔒 회사 수수료 차감 후 본인 정산 금액만 표시합니다</div>'
    +'<div class="kt-benefit-room-grid">'
      +'<button class="pink" onclick="openWeeklyBroadcastReward()"><span>📅</span><b>7일 방송 보상</b><small>7일 방송하면 코인 10개</small><em>›</em></button>'
      +'<button class="purple" onclick="openRaffleGuide()"><span>🎯</span><b>제비뽑기</b><small>아침 · 점심 · 저녁 하루 3번</small><em>›</em></button>'
      +'<button class="gold" onclick="openAttendanceBenefits()"><span>✅</span><b>출석 · 참여</b><small>출석과 참여 보상 안내</small><em>›</em></button>'
      +'<button class="violet" onclick="openSubscriberBenefits()"><span>💎</span><b>구독자 혜택</b><small>충전 · 모든 방 입장 · 방 만들기</small><em>›</em></button>'
      +'<button class="blue" onclick="openChargeBenefits()"><span>🪙</span><b>장미 · 코인 충전</b><small>충전 방법과 추가 혜택</small><em>›</em></button>'
      +'<button class="cyan" onclick="openRoomBenefits()"><span>🚪</span><b>방 이용 혜택</b><small>방 입장 · 방송방 만들기</small><em>›</em></button>'
      +'<button class="pink" onclick="openGifts()"><span>🌹</span><b>장미 · 선물</b><small>장미와 선물 보내기</small><em>›</em></button>'
      +'<button class="purple" onclick="openGiveBenefits()"><span>💝</span><b>혜택 주기</b><small>팬에게 보상 보내기</small><em>›</em></button>'
      +'<button class="gold" onclick="openRewardCenter()"><span>🏆</span><b>미션 · 랭킹</b><small>이벤트와 순위 보상</small><em>›</em></button>'
      +'<button class="violet" onclick="openSubs()"><span>👑</span><b>팬클럽 혜택</b><small>팬 · 응원 · 슈퍼팬 관리</small><em>›</em></button>'
      +'<button class="blue" onclick="openSellerCenter()"><span>🏷️</span><b>판매 · 정산</b><small>상품 · 광고 · 정산 확인</small><em>›</em></button>'
      +'<button class="cyan" onclick="openBenefitAlerts()"><span>🔔</span><b>혜택 알림</b><small>지급 · 수령 · 정산 알림</small><em>›</em></button>'
    +'</div>'
    +'<button class="kt-benefit-guide-btn" onclick="openSiteGuide()">❔ 전체 사용방법 · 혜택 자세히 보기</button>'
    +'</div>';
  showSheet('혜택 · 보상 센터',html);
  sheet.classList.add('benefit-center-sheet');
};

window.openWeeklyBroadcastReward=function(){
  showSheet('📅 7일 방송 보상',
    '<div class="rowbox"><b>보상</b><br>일주일 동안 방송하면 코인 10개를 보상으로 받습니다.</div>'
    +'<div class="rowbox"><b>사용 방법</b><br>라이브 방송을 진행하고 7일 방송 조건을 채우면 보상 대상에 표시됩니다.</div>'
    +'<div class="rowbox"><b>확인 위치</b><br>혜택 · 보상 센터 → 7일 방송 보상에서 진행 상태와 지급 여부를 확인합니다.</div>');
};

window.openRaffleGuide=function(){
  showSheet('🎯 제비뽑기',
    '<div class="rowbox"><b>하루 3번 참여</b><br>아침 1회 · 점심 1회 · 저녁 1회 참여할 수 있습니다.</div>'
    +'<div class="rowbox"><b>사용 방법</b><br>각 시간대에 제비뽑기 버튼을 눌러 참여합니다. 이미 참여한 시간대는 다시 참여할 수 없습니다.</div>'
    +'<div class="rowbox"><b>당첨 보상</b><br>꽝 또는 장미 1~5개 중 하나가 나오는 방식입니다.</div>'
    +'<button class="act" onclick="openRaffle()">🎯 제비뽑기 바로가기</button>');
};

window.openAttendanceBenefits=function(){
  showSheet('✅ 출석 · 참여 보상',
    '<div class="rowbox"><b>출석 보상</b><br>매일 접속하고 출석하면 출석 보상을 받을 수 있습니다.</div>'
    +'<div class="rowbox"><b>방송 참여 보상</b><br>라이브 방송 참여, 미션, 이벤트 조건을 달성하면 받을 수 있는 보상이 표시됩니다.</div>'
    +'<div class="rowbox"><b>받는 방법</b><br>혜택 · 보상 센터에서 받을 수 있는 보상을 확인한 뒤 보상 버튼을 눌러 받습니다.</div>');
};

window.openChargeBenefits=function(){
  showSheet('🪙 장미 · 코인 충전 혜택',
    '<div class="rowbox"><b>기본 충전</b><br>장미와 코인을 필요한 수량만큼 충전해서 선물과 방송 기능에 사용할 수 있습니다.</div>'
    +'<div class="rowbox"><b>구독자 추가 혜택</b><br>구독자는 충전할 때 일반회원보다 추가 혜택을 받을 수 있습니다.</div>'
    +'<div class="rowbox"><b>사용 방법</b><br>충전 수량을 고르고 결제 전 최종 지급 수량과 혜택을 확인합니다.</div>'
    +'<button class="act" onclick="openCharge()">🪙 충전 화면 열기</button>');
};

window.openRoomBenefits=function(){
  showSheet('🚪 방송방 이용 혜택',
    '<div class="rowbox"><b>방 입장</b><br>1인 방송 · 일반 13명방 · 구독자방 · 비밀방 등 이용 가능한 방을 선택해서 들어갑니다.</div>'
    +'<div class="rowbox"><b>구독자 혜택</b><br>구독자는 이용 가능한 방송방에 자유롭게 들어가고 원하는 방송 종류를 직접 만들 수 있습니다.</div>'
    +'<div class="rowbox"><b>방 만들기</b><br>라이브 준비 화면에서 방송 종류를 선택하고 라이브 시작을 누르면 됩니다.</div>');
};

window.openReceiveBenefits=function(){
  showSheet('🎉 혜택 받기',
    '<div class="rowbox"><b>받을 수 있는 혜택</b><br>출석 · 7일 방송 · 제비뽑기 · 미션 · 이벤트 · 랭킹 보상을 확인합니다.</div>'
    +'<div class="rowbox"><b>받는 방법</b><br>혜택 · 보상 센터에서 원하는 항목을 눌러 조건을 확인하고 받을 수 있는 보상을 수령합니다.</div>');
};

window.openSubscriberBenefits=function(){
  var html='<div class="kt-subscriber-benefits">'
    +'<div class="kt-sub-hero"><span>💎</span><div><b>K-Talk 구독자 혜택</b><small>충전부터 방송방 이용까지 한 번에</small></div></div>'
    +'<div class="kt-sub-benefit-list">'
      +'<div><span>🪙</span><b>장미·코인 충전 혜택</b><small>구독자는 충전할 때 일반회원보다 추가 혜택을 받을 수 있습니다.</small></div>'
      +'<div><span>🚪</span><b>모든 방송방 입장</b><small>1인 방송 · 13명 방송 · 구독자방 · 비밀방 등 이용 가능한 방에 자유롭게 들어갈 수 있습니다.</small></div>'
      +'<div><span>🎥</span><b>모든 방송방 만들기</b><small>구독자는 방송 종류를 골라 직접 방을 만들 수 있습니다.</small></div>'
      +'<div><span>👑</span><b>구독자 전용 혜택</b><small>구독자 전용방과 팬클럽 · 이벤트 · 보상 기능을 이용할 수 있습니다.</small></div>'
    +'</div>'
    +'<button class="act" onclick="openCharge()">🪙 충전 혜택 보러가기</button>'
    +'</div>';
  showSheet('💎 구독자 혜택',html);
};

window.openGiveBenefits=function(){
  showSheet('💝 혜택 주기',
    '<div class="rowbox"><b>팬에게 혜택 보내기</b><br>장미 · 선물 · 이벤트 보상을 팬에게 보낼 수 있습니다.</div>'
    +'<div class="rowbox"><b>사용 방법</b><br>보낼 혜택을 고르고 받을 사람을 선택한 다음 보내기를 누릅니다.</div>'
    +'<button class="act" onclick="openGifts()">🌹 장미·선물 보내기</button>');
};

window.openSellerCenter=function(){
  showSheet('🏷️ 판매 · 정산',
    '<div class="rowbox"><b>판매 등록</b><br>상품이나 광고를 등록하고 판매 내역을 관리합니다.</div>'
    +'<div class="rowbox"><b>정산 확인</b><br>판매가 발생하면 판매 금액과 정산 내역을 확인할 수 있습니다.</div>'
    +'<div class="rowbox"><b>사용 방법</b><br>판매 항목 등록 → 판매 내역 확인 → 정산 확인 순서로 이용합니다.</div>');
};

window.openRewardCenter=function(){
  showSheet('🏆 미션 · 랭킹 · 이벤트',
    '<div class="rowbox"><b>미션 보상</b><br>방송 참여와 시청자 미션을 달성하면 받을 수 있는 보상이 표시됩니다.</div>'
    +'<div class="rowbox"><b>랭킹 보상</b><br>매치전과 랭킹 결과에 따라 정해진 보상을 받을 수 있습니다.</div>'
    +'<div class="rowbox"><b>이벤트 보상</b><br>진행 중인 이벤트가 있으면 조건과 지급 보상을 이곳에서 확인합니다.</div>'
    +'<div class="rowbox"><b>지급 내역</b><br>받은 장미 · 코인 · 이벤트 보상 내역을 확인합니다.</div>');
};

window.openBenefitAlerts=function(){
  showSheet('🔔 혜택 알림',
    '<div class="rowbox"><b>혜택 지급</b><br>코인 · 장미 · 이벤트 보상이 지급되면 알림으로 확인합니다.</div>'
    +'<div class="rowbox"><b>선물 수령</b><br>받은 장미와 선물 알림을 확인합니다.</div>'
    +'<div class="rowbox"><b>판매 정산</b><br>판매 금액과 정산 완료 알림을 확인합니다.</div>');
};

window.openViewerMission=function(){
  showSheet('🎁 시청자 미션','<div class="rowbox"><b>시청자 미션</b><br>방송 중 시청자에게 간단한 미션을 안내할 수 있습니다.</div>');
};
window.openGuideBook=function(){
  showSheet('📖 가이드 북','<div class="rowbox"><b>가이드 북</b><br>방송 진행에 필요한 간단한 안내를 확인할 수 있습니다.</div>');
};
window.openTextVote=function(){
  showSheet('☰ 텍스트 투표','<div class="rowbox"><b>텍스트 투표</b><br>질문과 선택지를 만들어 시청자 의견을 받을 수 있습니다.</div>');
};

window.selectPrepRoom=function(el,type,label,max){
  state.liveRoomType=type;
  state.liveRoomName=label;
  state.liveRoomMax=max;
  document.querySelectorAll('.room-switch').forEach(function(b){b.classList.remove('on');});
  if(el)el.classList.add('on');
  var title=document.getElementById('liveTitle');
  if(title && (!title.value || title.value==='오늘 라이브 제목을 입력하세요' || title.dataset.autoRoom==='1')){
    title.value=label;
    title.dataset.autoRoom='1';
  }
};

window.prepBottomTap=function(el,name){
  document.querySelectorAll('.prep-bottom span').forEach(function(s){s.classList.remove('on');});
  if(el)el.classList.add('on');
};

window.needJoin=function(msg){showSheet('가입하기','<div class="note">'+msg+'</div><button class="act social naver" onclick="join(\'네이버\')">네이버로 계속하기</button><button class="act social kakao" onclick="join(\'카카오\')">카카오로 계속하기</button><button class="act social google" onclick="join(\'Google\')">Google로 계속하기</button><div class="note">현재는 화면 작동 확인용 테스트입니다.</div>');};
window.join=function(provider){showSheet('로그인 확인','<div class="rowbox"><b>'+provider+' 로그인 버튼 작동 확인</b></div><button class="act" onclick="closeSheet()">확인</button>');};
window.finishJoin=function(){closeSheet();};

function helpCard(edge,glow,icon,title,sub,action){
  return '<button onclick="'+action+'" style="min-height:68px;border-radius:16px;padding:8px 9px;display:flex;align-items:center;gap:8px;text-align:left;color:#fff;background:linear-gradient(145deg,#11121b,#07070d);border:1.3px solid '+edge+';box-shadow:0 0 10px '+glow+'66,inset 0 0 16px '+glow+'22">'
    +'<span style="width:36px;height:36px;flex:0 0 36px;border-radius:50%;display:grid;place-items:center;font-size:20px;background:#111;box-shadow:0 0 12px '+glow+'99">'+icon+'</span>'
    +'<span style="min-width:0"><b style="display:block;color:'+edge+';font-size:13px;line-height:1.05;white-space:nowrap">'+title+'</b><small style="display:block;color:#c9c9d1;font-size:9px;margin-top:3px;white-space:nowrap">'+sub+'</small></span></button>';
}
window.openMenu=function(){
  var html='<div style="padding:0 0 2px">'
    +'<div style="text-align:center;font-size:19px;font-weight:950;color:#fff;margin:0 0 8px;text-shadow:0 0 12px #ff43c9,0 0 20px #438dff">♛ K-Talk 안내</div>'
    +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px">'
    +helpCard('#d0a2ff','#803cff','❔','이용·혜택 안내','한 페이지에 모두','openSiteGuide()')
    +helpCard('#ff8fc8','#ff2d8a','🚩','신고 게시판','신고·문의','report()')
    +helpCard('#75e4ff','#1bbfff','📣','광고 문의','광고·판매자','openAd()')
    +helpCard('#ffe071','#ffb500','💼','투자자 안내','방송수익 정산','openInvestorInfo()')
    +helpCard('#c3b7ff','#6558ff','👑','구독·VIP 혜택','할인·입장방','openSubs()')
    +helpCard('#ffb09a','#ff633f','🎁','선물·보물상자','선물 종류','openGifts()')
    +helpCard('#ff9baa','#ff405d','🌹','장미 충전','충전 수량','openCharge()')
    +helpCard('#91f3ee','#31cfc7','🎯','제비뽑기','이벤트','openRaffle()')
    +helpCard('#a8d0ff','#4a9aff','✉','쪽지','메시지','openMessages()')
    +helpCard('#8ff6ad','#2bd365','♛','프로필','내 정보','openProfile()')
    +'</div></div>';
  showSheet('K-Talk 사용방법·혜택',html);
};

window.openSiteGuide=function(){
  var html='<div class="kt-guide-page">'
    +'<div class="kt-guide-hero"><span>♛</span><div><b>K-Talk 이용방법 · 혜택</b><small>방송부터 보상, 장미, 판매까지 한 페이지에서 확인하세요</small></div></div>'

    +'<div class="kt-guide-title">📱 기본 사용방법</div>'
    +'<div class="kt-guide-cards">'
      +'<div><span>🏠</span><b>홈</b><small>추천 동영상과 쇼츠를 바로 봅니다.</small></div>'
      +'<div><span>🎥</span><b>방송하기</b><small>＋ 버튼을 눌러 카메라와 라이브 준비 화면으로 들어갑니다.</small></div>'
      +'<div><span>👥</span><b>방송 선택</b><small>1인 · 13명 · 구독자 · 비밀방 중에서 선택합니다.</small></div>'
      +'<div><span>✨</span><b>보정 · 효과</b><small>뷰티, 편집효과, 설정, 멀티게스트를 방송 전에 고릅니다.</small></div>'
      +'<div><span>💬</span><b>소통</b><small>채팅, 시청자 미션, 투표, 공유 기능을 이용합니다.</small></div>'
      +'<div><span>🎁</span><b>선물</b><small>장미와 선물을 보내거나 받을 수 있습니다.</small></div>'
    +'</div>'

    +'<div class="kt-guide-title">🎉 보상 · 무료 혜택</div>'
    +'<div class="kt-guide-list">'
      +'<div><span>🗓️</span><section><b>7일 방송 보상</b><small>일주일 동안 방송하면 보상으로 코인 10개를 받습니다.</small></section><em>+10</em></div>'
      +'<div><span>🎯</span><section><b>제비뽑기 하루 3번</b><small>아침 1회 · 점심 1회 · 저녁 1회 참여할 수 있습니다.</small></section><em>3회</em></div>'
      +'<div><span>✅</span><section><b>출석 · 참여 보상</b><small>출석과 방송 참여로 받을 수 있는 보상을 확인합니다.</small></section><em>보상</em></div>'
      +'<div><span>🏆</span><section><b>미션 · 랭킹 · 이벤트</b><small>방송 미션과 이벤트 보상, 랭킹 혜택을 한곳에서 확인합니다.</small></section><em>EVENT</em></div>'
    +'</div>'

    +'<div class="kt-guide-title">💎 구독자 혜택</div>'
    +'<div class="kt-guide-list">'
      +'<div><span>🪙</span><section><b>장미·코인 충전 혜택</b><small>구독자는 충전할 때 일반회원보다 추가 혜택을 받을 수 있습니다.</small></section><em>혜택</em></div>'
      +'<div><span>🚪</span><section><b>모든 방송방 입장</b><small>1인 · 13명 · 구독자방 · 비밀방 등 이용 가능한 방에 들어갈 수 있습니다.</small></section><em>입장</em></div>'
      +'<div><span>📹</span><section><b>모든 방송방 만들기</b><small>구독자는 원하는 방송 종류를 골라 직접 방을 만들 수 있습니다.</small></section><em>생성</em></div>'
      +'<div><span>👑</span><section><b>팬클럽 · 전용 혜택</b><small>구독자 전용방과 팬클럽, 이벤트 혜택을 이용합니다.</small></section><em>VIP</em></div>'
    +'</div>'

    +'<div class="kt-guide-title">🌹 장미 · 혜택 주고받기</div>'
    +'<div class="kt-guide-cards">'
      +'<button onclick="openGifts()"><span>🌹</span><b>장미 주기</b><small>장미와 선물을 보냅니다.</small></button>'
      +'<button onclick="openReceiveBenefits()"><span>🎉</span><b>혜택 받기</b><small>받을 수 있는 보상을 확인합니다.</small></button>'
      +'<button onclick="openGiveBenefits()"><span>💝</span><b>혜택 주기</b><small>팬에게 보상과 선물을 보냅니다.</small></button>'
      +'<button onclick="openCharge()"><span>🪙</span><b>충전</b><small>장미·코인을 충전합니다.</small></button>'
    +'</div>'

    +'<div class="kt-guide-title">🏷️ 판매 · 팬클럽 · 정산</div>'
    +'<div class="kt-guide-list">'
      +'<button onclick="openSellerCenter()"><span>🏷️</span><section><b>판매 센터</b><small>상품과 광고를 등록하고 판매 내역을 확인합니다.</small></section><em>›</em></button>'
      +'<button onclick="openSubs()"><span>👑</span><section><b>팬클럽</b><small>팬, 응원, 슈퍼팬과 팬클럽 혜택을 관리합니다.</small></section><em>›</em></button>'
      +'<button onclick="openBenefitHub()"><span>🎁</span><section><b>혜택 · 보상 센터</b><small>받기 · 주기 · 장미 · 판매 · 보상을 한 번에 봅니다.</small></section><em>›</em></button>'
    +'</div>'
    +'<div class="kt-guide-note">※ 실제 지급 조건과 수량은 운영 정책에 따라 변경될 수 있으며, 앱 안의 최신 안내를 기준으로 적용합니다.</div>'
    +'</div>';
  showSheet('K-Talk 이용방법 · 혜택',html);
};
window.openInvestorInfo=function(){
  showSheet('💼 투자자 안내','<div class="rowbox"><b>📅 정산일</b><br>투자자 수익금 정산은 매달 1일 진행하는 방식으로 안내합니다.</div><div class="rowbox"><b>📡 정산 대상</b><br>K-Talk 방송에서 발생한 방송 관련 수익만 투자자 수익 분배 대상에 포함합니다.</div><div class="rowbox"><b>🚫 제외 수익</b><br>광고 수익, 상품 판매 수익, 외부 업체와 별도로 체결한 계약에서 발생한 수익은 투자자 분배 대상에서 제외합니다.</div><div class="rowbox"><b>💰 수익금 분배</b><br>방송 수익을 기준으로 계약서에 정한 지분과 정산 기준에 따라 분배하며 실제 금액은 해당 월의 방송 실적에 따라 달라질 수 있습니다.</div><div class="note">투자에는 손실 위험이 있으며 원금이나 수익을 확정적으로 보장할 수 없습니다.</div>');
};
window.openSubs=function(){
  var html='<div class="kt-fanclub">'
    +'<div class="kt-fan-head"><div><b>👑 K-Talk 팬클럽</b><span>내 방송을 응원하는 팬 모임</span></div><button onclick="openFanHelp()">?</button></div>'
    +'<div class="kt-fan-stats">'
      +'<div><b>0</b><span>팬</span></div>'
      +'<div><b>0</b><span>응원</span></div>'
      +'<div><b>0</b><span>슈퍼팬</span></div>'
    +'</div>'
    +'<button class="kt-fan-grow" onclick="openFanGrow()"><span>🌱</span><div><b>팬클럽 성장하기</b><small>방송 참여와 선물로 팬클럽을 키워보세요</small></div><em>›</em></button>'
    +'<div class="kt-fan-tabs"><button class="on">모든 팬</button><button>팬클럽 도구</button></div>'
    +'<div class="kt-fan-list">'
      +'<div class="kt-fan-empty"><span>💛</span><b>아직 등록된 팬이 없습니다</b><small>팬이 참여하면 여기에 표시됩니다.</small></div>'
    +'</div>'
    +'</div>';
  showSheet('팬클럽',html);
};
window.openFanGrow=function(){
  showSheet('🌱 팬클럽 성장하기','<div class="rowbox"><b>팬클럽 성장</b><br>방송 참여, 응원, 선물 활동으로 팬클럽을 키우는 화면입니다.</div><div class="rowbox"><b>등급 안내</b><br>팬 · 열성팬 · 슈퍼팬처럼 단계별로 구성할 수 있습니다.</div>');
};
window.openFanHelp=function(){
  showSheet('팬클럽 안내','<div class="rowbox"><b>K-Talk 팬클럽</b><br>팬 관리와 팬클럽 혜택을 확인하는 공간입니다.</div>');
};

window.showHostCrown=function(kind){var old=document.getElementById('hostGiftCrown');if(old)old.remove();var badge=document.createElement('div');badge.id='hostGiftCrown';badge.textContent=(kind==='다이아 왕관'||kind==='다이아몬드 왕관')?'💎👑':'👑';badge.style.cssText='position:fixed;z-index:9999;top:86px;left:50%;transform:translateX(-50%);font-size:52px;filter:drop-shadow(0 0 15px #ffd85a);pointer-events:none';document.body.appendChild(badge);setTimeout(function(){if(badge&&badge.parentNode)badge.remove();},6000);};
window.giftSend=function(name,cost,sender){
  if(name.indexOf('왕관')>-1||name.indexOf('크라운')>-1){showHostCrown(name);}
  ktAnnounceEvent('gift',{sender:sender||'',name:name,count:cost});
  alert(name+' · '+cost+'개 선물을 선택했습니다.');
};
window.ktalkGifts=[
  ['장미','1','🌹','꽃/하트'],
  ['하트','30','💖','꽃/하트'],
  ['꽃다발','50','💐','꽃/하트'],
  ['풍선','80','💗','꽃/하트'],
  ['보물상자','100','🎁','보물/패키지'],
  ['왕관','200','👑','프리미엄'],
  ['다이아 왕관','300','♛','프리미엄'],
  ['럭셔리 자동차','500','🏎️','럭셔리'],
  ['요트','700','🛥️','럭셔리'],
  ['성','1000','🏰','프리미엄'],
  ['초콜릿','10','🍫','연출/특수'],
  ['향수','20','🧴','연출/특수'],
  ['케이크','40','🎂','꽃/하트'],
  ['불꽃놀이','60','🎆','연출/특수'],
  ['백조','120','🦢','연출/특수'],
  ['트로피','150','🏆','연출/특수'],
  ['별빛','180','⭐','연출/특수'],
  ['하트 폭죽','250','💥','연출/특수'],
  ['다이아 하트','400','💎','럭셔리'],
  ['럭셔리 무대','600','🎇','럭셔리'],
  ['달','800','🌕','럭셔리'],
  ['별 패키지','1200','🌟','보물/패키지'],
  ['골드 패키지','1500','🎁','보물/패키지'],
  ['프리미엄 반지','2000','💍','프리미엄'],
  ['VIP 크라운','3000','👑','VIP 전용']
];

window.giftSendByIndex=function(i){
  var g=window.ktalkGifts[i];
  if(!g)return;
  giftSend(g[0],g[1]);
};

window.filterGift25=function(category,btn){
  var wrap=document.querySelector('.kt-gift-final-grid');
  if(!wrap)return;
  var picks={
    '꽃/하트':[0,1,2,3,12],
    '프리미엄':[5,6,9,23,24],
    '연출/특수':[10,11,13,14,16,17],
    '럭셔리':[7,8,18,19,20],
    '보물/패키지':[4,21,22],
    'VIP 전용':[24]
  };
  [].slice.call(document.querySelectorAll('.kt-gift-final-cat')).forEach(function(b){b.classList.remove('on');});
  if(btn)btn.classList.add('on');

  [].slice.call(wrap.querySelectorAll('.kt-gift-final-card')).forEach(function(card){
    var idx=parseInt(card.getAttribute('data-index'),10);
    var show=category==='전체'||(picks[category]&&picks[category].indexOf(idx)>-1);
    card.classList.toggle('is-hidden',!show);
  });

  var title=document.querySelector('.kt-gift-final-current');
  if(title)title.textContent=category;
};

window.openGiftHistory=function(){
  var html='<div class="rowbox"><b>🎁 선물 내역</b><br>보낸 선물 내역은 실제 회원 계정과 서버가 연결되면 여기에 표시됩니다.</div>';
  showSheet('선물 내역',html);
};

window.openGifts=function(){
  var cards=window.ktalkGifts.map(function(g,i){
    return '<button type="button" class="kt-gift-final-card" data-index="'+i+'" onclick="giftSendByIndex('+i+')">'
      +'<span class="kt-gift-final-no">'+(i+1)+'</span>'
      +'<span class="kt-gift-final-art">'+g[2]+'</span>'
      +'<b>'+g[0]+'</b>'
      +'<strong>'+String(g[1]).replace(/\B(?=(\d{3})+(?!\d))/g,',')+'개</strong>'
      +'</button>';
  }).join('');

  var html='<div class="kt-gift-final">'
    +'<div class="kt-gift-final-head">'
      +'<div class="kt-gift-final-brand">'
        +'<span class="kt-gift-final-logo">🎁</span>'
        +'<div><h2>K-Talk 선물상자</h2><p>✦ 마음을 전하는 특별한 선물 ✦</p></div>'
      +'</div>'
      +'<button type="button" class="kt-gift-final-close" onclick="closeSheet()">닫기</button>'
    +'</div>'
    +'<div class="kt-gift-final-main">'
      +'<aside class="kt-gift-final-side">'
        +'<button type="button" class="kt-gift-final-cat on" onclick="filterGift25(\'전체\',this)"><i>🎁</i><span>전체</span></button>'
        +'<button type="button" class="kt-gift-final-cat" onclick="filterGift25(\'꽃/하트\',this)"><i>🌹</i><span>꽃/하트</span></button>'
        +'<button type="button" class="kt-gift-final-cat" onclick="filterGift25(\'프리미엄\',this)"><i>👑</i><span>프리미엄</span></button>'
        +'<button type="button" class="kt-gift-final-cat" onclick="filterGift25(\'연출/특수\',this)"><i>✨</i><span>연출/특수</span></button>'
        +'<button type="button" class="kt-gift-final-cat" onclick="filterGift25(\'럭셔리\',this)"><i>💎</i><span>럭셔리</span></button>'
        +'<button type="button" class="kt-gift-final-cat" onclick="filterGift25(\'보물/패키지\',this)"><i>🧰</i><span>보물/패키지</span></button>'
        +'<button type="button" class="kt-gift-final-cat vip" onclick="filterGift25(\'VIP 전용\',this)"><i>👑</i><span>VIP 전용</span></button>'
      +'</aside>'
      +'<section class="kt-gift-final-content">'
        +'<div class="kt-gift-final-current">전체</div>'
        +'<div class="kt-gift-final-grid">'+cards+'</div>'
      +'</section>'
    +'</div>'
    +'<div class="kt-gift-final-pager"><button type="button" aria-label="이전">‹</button><b>1 / 1</b><button type="button" aria-label="다음">›</button></div>'
    +'<div class="kt-gift-final-foot">'
      +'<span>💗 선물은 라이브 방송 중에만 보낼 수 있습니다.</span>'
      +'<button type="button" onclick="openGiftHistory()">☷ 선물 내역</button>'
    +'</div>'
  +'</div>';

  showSheet('',html);
  sheet.classList.remove('gift-exact');
  sheet.classList.add('gift-shop25','gift-final-v1');
};

window.ktTreasureTimer=null;

window.ktTreasureArt=function(){
  return '<span class="kt-chest-art"><i class="kt-chest-lid"></i><i class="kt-chest-body"></i><b class="kt-chest-lock">◆</b><em class="kt-chest-shine">✦</em></span>';
};

window.ktTreasureFormat=function(ms){
  var s=Math.max(0,Math.ceil(ms/1000));
  var m=Math.floor(s/60);
  s=s%60;
  return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
};

window.ktGetTreasure=function(){
  try{
    var raw=localStorage.getItem('ktalk_active_treasure');
    return raw?JSON.parse(raw):null;
  }catch(e){return state.activeTreasure||null;}
};

window.ktGetTreasureQueue=function(){
  try{
    var raw=localStorage.getItem('ktalk_treasure_queue');
    return raw?JSON.parse(raw):[];
  }catch(e){return state.treasureQueue||[];}
};

window.ktSaveTreasureQueue=function(q){
  state.treasureQueue=q||[];
  try{localStorage.setItem('ktalk_treasure_queue',JSON.stringify(state.treasureQueue));}catch(e){}
};

window.ktSaveTreasure=function(t){
  state.activeTreasure=t||null;
  try{
    if(t)localStorage.setItem('ktalk_active_treasure',JSON.stringify(t));
    else localStorage.removeItem('ktalk_active_treasure');
  }catch(e){}
  ktRenderTreasure();
  ktUpdateTreasureLed();
};

window.ktStartNextTreasure=function(){
  var q=ktGetTreasureQueue();
  if(!q.length){ktSaveTreasure(null);return;}
  var next=q.shift();
  ktSaveTreasureQueue(q);
  next.placedAt=Date.now();
  next.unlockAt=Date.now()+150000;
  next.claimed=false;
  ktSaveTreasure(next);
  ktSpeak('새 보물상자가 올라왔습니다. 2분 30초 후 받을 수 있습니다.');
};

window.placeTreasureChest=function(n,sender,roomTitle){
  n=parseInt(n,10)||50;
  var title=roomTitle||(state.currentLiveRoomTitle||state.currentViewRoomTitle||'K-Talk LIVE');
  var item={
    id:'treasure-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),
    amount:n,
    sender:sender||'게스트',
    roomTitle:title,
    placedAt:Date.now(),
    unlockAt:Date.now()+150000,
    claimed:false
  };
  var current=ktGetTreasure();
  if(current&&!current.claimed){
    var q=ktGetTreasureQueue();
    q.push(item);
    ktSaveTreasureQueue(q);
    ktUpdateTreasureLed();
    ktRenderTreasure();
    ktSpeak('보물상자가 대기열에 추가되었습니다.');
    alert('보물상자가 호스트 방에 추가되었습니다. 앞 상자가 끝나면 이어서 열립니다.');
    return;
  }
  ktSaveTreasure(item);
  ktSpeak('보물상자가 올라왔습니다. 2분 30초 후 누구든지 받을 수 있습니다.');
  alert('보물상자가 호스트 방에 올라갔습니다. 2분 30초 후 받을 수 있습니다.');
};

window.selectTreasure=function(n){
  closeSheet();
  placeTreasureChest(n,'게스트',state.currentLiveRoomTitle||state.currentViewRoomTitle||'K-Talk LIVE');
};

window.openTreasure=function(){
  var chest=function(n){
    return '<button class="kt-treasure-pick" onclick="selectTreasure('+n+')">'
      +ktTreasureArt()
      +'<b>보물상자 '+n+'</b>'
      +'<small>호스트 방에 올리기</small>'
      +'</button>';
  };
  var html='<div class="kt-treasure-shop">'
    +'<div class="kt-treasure-help"><b>🗝️ 보물상자</b><span>호스트 머리 위에 2분 30초 동안 표시됩니다.<br>시간이 끝나면 누구든지 눌러 받을 수 있습니다.</span></div>'
    +'<div class="kt-treasure-picks">'+chest(10)+chest(50)+chest(100)+'</div>'
    +'</div>';
  showSheet('보물상자 올리기',html);
};

window.ktTreasureStatus=function(t){
  if(!t)return null;
  var left=t.unlockAt-Date.now();
  return {left:left,ready:left<=0};
};

window.ktUpdateTreasureLed=function(){
  var led=document.getElementById('globalLed');
  if(!led)return;
  var t=ktGetTreasure();
  if(!t){
    led.classList.remove('treasure-on','treasure-ready');
    led.innerHTML='♛ K-Talk · 신곡 광고 신청하세요! 🎵 🎤';
    return;
  }
  var st=ktTreasureStatus(t);
  var q=ktGetTreasureQueue();
  led.classList.add('treasure-on');
  led.classList.toggle('treasure-ready',st.ready);
  led.innerHTML=st.ready
    ?'🗝️ 보물상자 열렸습니다! 지금 누르면 방으로 이동'+(q.length?' · 대기 '+q.length+'개':'')
    :'🗝️ 보물상자 떴습니다 · '+ktTreasureFormat(st.left)+' · 누르면 방으로 이동'+(q.length?' · 대기 '+q.length+'개':'');
};

window.handleLedClick=function(){
  var t=ktGetTreasure();
  if(t){goToTreasureRoom();return;}
  if(window.openAd)openAd();
};

window.goToTreasureRoom=function(){
  var t=ktGetTreasure();
  if(!t){if(window.openAd)openAd();return;}
  if(document.getElementById('ktLiveTreasureZone')){
    var z=document.getElementById('ktLiveTreasureZone');
    z.classList.add('attention');
    setTimeout(function(){z.classList.remove('attention');},1200);
    ktRenderTreasure();
    return;
  }
  state.currentViewRoomTitle=t.roomTitle;
  document.body.classList.remove('kt-home');
  screen.innerHTML='<section class="kt-treasure-view-room">'
    +'<div class="kt-view-room-head"><b>🔴 '+t.roomTitle+'</b><button onclick="home()">나가기</button></div>'
    +'<div class="kt-view-host"><div class="kt-view-host-avatar">♛</div><b>HOST LIVE</b><span>보물상자 이벤트 진행 중</span></div>'
    +'<div id="ktViewerTreasureZone" class="kt-live-treasure-zone viewer-zone"></div>'
    +'<div class="kt-view-room-note">상단 보물상자가 열릴 때까지 기다린 뒤 눌러서 받으세요.</div>'
    +'</section>';
  ktRenderTreasure();
};

window.claimTreasureChest=function(){
  var t=ktGetTreasure();
  if(!t)return;
  var st=ktTreasureStatus(t);
  if(!st.ready){
    var msg='아직 '+ktTreasureFormat(st.left)+' 남았습니다.';
    ktSpeak(msg);
    alert(msg);
    return;
  }
  t.claimed=true;
  t.claimedAt=Date.now();
  ktSpeak('보물상자 '+t.amount+'개를 받았습니다.');
  alert('🎉 보물상자 '+t.amount+'개를 받았습니다!');
  ktSaveTreasure(null);
  setTimeout(function(){ktStartNextTreasure();},900);
};

window.ktRenderTreasure=function(){
  clearInterval(window.ktTreasureTimer);
  var t=ktGetTreasure();
  var zones=[
    document.getElementById('ktLiveTreasureZone'),
    document.getElementById('ktViewerTreasureZone')
  ].filter(Boolean);
  if(!zones.length){
    ktUpdateTreasureLed();
    if(t){
      window.ktTreasureTimer=setInterval(function(){
        ktUpdateTreasureLed();
        var active=ktGetTreasure();
        if(!active)clearInterval(window.ktTreasureTimer);
        else if(ktTreasureStatus(active).ready&&!active.readyAnnounced){
          active.readyAnnounced=true;
          try{localStorage.setItem('ktalk_active_treasure',JSON.stringify(active));}catch(e){}
          ktSpeak('보물상자가 열렸습니다. 지금 눌러서 받을 수 있습니다.');
        }
      },1000);
    }
    return;
  }
  if(!t){
    zones.forEach(function(z){z.innerHTML='';});
    ktUpdateTreasureLed();
    return;
  }
  var render=function(){
    var active=ktGetTreasure();
    if(!active){zones.forEach(function(z){z.innerHTML='';});clearInterval(window.ktTreasureTimer);ktUpdateTreasureLed();return;}
    var st=ktTreasureStatus(active);
    var q=ktGetTreasureQueue();
    zones.forEach(function(z){
      z.innerHTML='<button class="kt-live-treasure '+(st.ready?'ready':'locked')+'" onclick="claimTreasureChest()">'
        +'<span class="kt-treasure-caption">'+(st.ready?'지금 받기':'기다려 주세요')+'</span>'
        +ktTreasureArt()
        +'<strong>'+active.amount+'개</strong>'
        +'<b class="kt-treasure-time">'+(st.ready?'열림!':ktTreasureFormat(st.left))+'</b>'
        +(q.length?'<small>다음 상자 '+q.length+'개 대기</small>':'')
        +'</button>';
    });
    ktUpdateTreasureLed();
    if(st.ready&&!active.readyAnnounced){
      active.readyAnnounced=true;
      try{localStorage.setItem('ktalk_active_treasure',JSON.stringify(active));}catch(e){}
      ktSpeak('보물상자가 열렸습니다. 지금 눌러서 받을 수 있습니다.');
    }
  };
  render();
  window.ktTreasureTimer=setInterval(render,1000);
};

window.addEventListener('storage',function(e){
  if(e.key==='ktalk_active_treasure'||e.key==='ktalk_treasure_queue'){
    ktRenderTreasure();
    ktUpdateTreasureLed();
  }
});

setTimeout(function(){ktUpdateTreasureLed();ktRenderTreasure();},300);
window.selectCoinCharge=function(amount,base,bonus){
  var total=base+bonus;
  ktSpeak('장미 '+base.toLocaleString('ko-KR')+'개, 보너스 '+bonus.toLocaleString('ko-KR')+'개, 총 '+total.toLocaleString('ko-KR')+'개입니다.');
  alert(Number(amount).toLocaleString('ko-KR')+'원 · 기본 장미 '+base.toLocaleString('ko-KR')+'개 · 보너스 '+bonus.toLocaleString('ko-KR')+'개 · 총 '+total.toLocaleString('ko-KR')+'개');
};
window.openCharge=function(){
  var packs=[
    {base:300},
    {base:500},
    {base:1000},
    {base:1500},
    {base:2000},
    {base:2500},
    {base:3000},
    {base:3300}
  ];
  var html='<div class="coin-charge-note">'
    +'<div style="font-size:16px;font-weight:950;color:#fff">🌹 장미 충전</div>'
    +'<div style="margin-top:7px;color:#ffe17b;font-weight:950">장미 1개 = 30원</div>'
    +'<div style="margin-top:5px;color:#ffd86b">500개부터 500개마다 <b style="color:#fff">보너스 +10개</b></div>'
    +'<div style="margin-top:5px;color:#bbb">최대 충전 100,000원</div>'
    +'</div>'
    +'<div class="coin-charge-grid">'+packs.map(function(p){
      var amount=p.base*30;
      var bonus=p.base>=500?Math.floor(p.base/500)*10:0;
      var total=p.base+bonus;
      return '<button class="coin-charge-card" onclick="selectCoinCharge('+amount+','+p.base+','+bonus+')">'
        +'<span class="coin-art">🌹</span>'
        +'<b>'+p.base.toLocaleString('ko-KR')+'개</b>'
        +'<small style="font-size:13px;color:#fff">'+amount.toLocaleString('ko-KR')+'원</small>'
        +(bonus>0
          ?'<span class="charge-bonus-badge">🎁 보너스 +'+bonus.toLocaleString('ko-KR')+'개</span>'
          :'<span class="charge-bonus-none">보너스 없음</span>')
        +'<small style="color:#ffe17b;font-weight:950">총 '+total.toLocaleString('ko-KR')+'개 지급</small>'
        +'</button>';
    }).join('')+'</div>';
  showSheet('🌹 장미 충전',html);
};
window.openRaffle=function(){showSheet('🎯 제비뽑기','<div class="raffle">꽝 · 1 · 2 · 3 · 4 · 5</div><button class="act" onclick="raffle()">제비뽑기</button>');};
window.raffle=function(){if(state.raffle<=0){ktSpeak('오늘 참여 횟수를 모두 사용했습니다.');alert('오늘 참여 횟수를 모두 사용했습니다.');return;}state.raffle--;var p=[0,0,1,2,3,4,5];var x=p[Math.floor(Math.random()*p.length)];var msg=x?'장미 '+x+'개 당첨!':'꽝입니다.';ktAnnounceEvent('reward',{text:msg});alert(msg);};
window.openMessages=function(){showSheet('✉ 쪽지','<div class="rowbox"><b>쪽지 화면</b><br>메시지 기능 버튼이 정상 작동합니다.</div>');};
window.openComments=function(){showSheet('💬 댓글','<div class="rowbox"><b>댓글 화면</b><br>댓글 버튼이 정상 작동합니다.</div>');};
window.ktGetSelectedSubAccount=function(){
  try{
    var key=localStorage.getItem('ktalk_sub_account')||'';
    if(key==='taekwon1'||key==='haine2')return key;
  }catch(e){}
  return '';
};
window.ktSubAccountInfo=function(key){
  if(key==='haine2')return {key:'haine2',name:'K-톡 하이네2',icon:'H'};
  return {key:'taekwon1',name:'K-톡 태권1',icon:'T'};
};
window.ktCurrentSubAccountInfo=function(){
  return ktSubAccountInfo(ktGetSelectedSubAccount()||'taekwon1');
};
window.selectKTalkSubAccount=function(key){
  if(key!=='taekwon1'&&key!=='haine2')return;
  try{localStorage.setItem('ktalk_sub_account',key);}catch(e){}
  state.ktSubAccount=key;
  var info=ktSubAccountInfo(key);
  var storage='ktalk_profile_v1:sub:'+key;
  try{
    if(!localStorage.getItem(storage)){
      localStorage.setItem(storage,JSON.stringify({name:info.name,bio:'',photo:''}));
    }
  }catch(e){}
  closeSheet();
  setTimeout(function(){openProfileDirect();},60);
};
window.ktSubProfileCard=function(key){
  var info=ktSubAccountInfo(key);
  var p={name:info.name,photo:''};
  try{
    var raw=localStorage.getItem('ktalk_profile_v1:sub:'+key);
    if(raw){
      var x=JSON.parse(raw)||{};
      if(x.name)p.name=String(x.name);
      if(x.photo)p.photo=String(x.photo);
    }
  }catch(e){}
  var initial=(p.name||info.name||'K').trim().charAt(0)||'K';
  var avatar=p.photo
    ?'<span class="kt-account-avatar '+key+' has-photo"><img src="'+p.photo+'" alt="'+ktProfileEscape(p.name)+' 프로필"></span>'
    :'<span class="kt-account-avatar '+key+'">'+ktProfileEscape(initial)+'</span>';
  return {name:p.name,avatar:avatar};
};
window.openAccountChooser=function(){
  var current=ktGetSelectedSubAccount();
  var t=ktSubProfileCard('taekwon1');
  var h=ktSubProfileCard('haine2');
  var html='<div class="kt-account-choice">'
    +'<div class="kt-account-choice-title">사용할 계정을 선택하세요</div>'
    +'<div class="kt-account-split">'
      +'<button class="kt-account-half '+(current==='taekwon1'?'on':'')+'" onclick="selectKTalkSubAccount(\'taekwon1\')">'
        +t.avatar+'<b>'+ktProfileEscape(t.name)+'</b><small>태권1 계정으로 들어가기</small>'
      +'</button>'
      +'<button class="kt-account-half '+(current==='haine2'?'on':'')+'" onclick="selectKTalkSubAccount(\'haine2\')">'
        +h.avatar+'<b>'+ktProfileEscape(h.name)+'</b><small>하이네2 계정으로 들어가기</small>'
      +'</button>'
    +'</div>'
    +'<div class="kt-account-note">사진은 가운데 맞춰 표시되고 살짝 움직이게 했습니다.</div>'
    +'</div>';
  showSheet('계정 선택',html);
};

window.ktProfileAccountKey=function(){
  var sub=ktGetSelectedSubAccount();
  if(sub)return 'sub:'+sub;
  try{
    var owner=window.ktVideoOwner?ktVideoOwner():null;
    if(owner&&owner.id)return String(owner.id);
    if(owner&&owner.name)return String(owner.name);
  }catch(e){}
  return 'local';
};
window.ktProfileStorageKey=function(){
  return 'ktalk_profile_v1:'+ktProfileAccountKey();
};
window.ktProfileLoad=function(){
  var base={name:'',bio:'',photo:'',followers:0,likes:0,link:''};
  try{
    var raw=localStorage.getItem(ktProfileStorageKey());
    if(raw){
      var p=JSON.parse(raw)||{};
      base.name=String(p.name||'');
      base.bio=String(p.bio||'');
      base.photo=String(p.photo||'');
      base.followers=parseInt(p.followers||0,10)||0;
      base.likes=parseInt(p.likes||0,10)||0;
      base.link=String(p.link||'');
    }
  }catch(e){}
  if(!base.name){
    try{
      var sub=ktGetSelectedSubAccount();
      if(sub)base.name=ktSubAccountInfo(sub).name;
      else{
        var owner=window.ktVideoOwner?ktVideoOwner():null;
        if(owner&&owner.name&&owner.name!=='내 계정')base.name=owner.name;
        else if(window.ktCurrentVerifiedAccountName&&ktCurrentVerifiedAccountName())base.name=ktCurrentVerifiedAccountName();
      }
    }catch(e){}
  }
  if(base.name==='태권이'||base.name==='K-톡태권')base.name='K-톡 태권1';
  if(base.name==='하이네'||base.name==='K-톡하이네')base.name='K-톡 하이네2';
  if(!base.name)base.name='K-Talk';
  return base;
};
window.ktProfileEscape=function(s){
  return String(s==null?'':s).replace(/[&<>"']/g,function(ch){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
  });
};
window.ktProfileRender=function(){
  var p=ktProfileLoad();
  var initial=(p.name||'K').trim().charAt(0)||'K';
  var photo=p.photo
    ?'<img src="'+p.photo+'" alt="프로필 사진">'
    :'<span>'+ktProfileEscape(initial)+'</span>';
  var linkText=p.link?ktProfileEscape(p.link):'링크를 등록해 주세요';
  return '<div class="kt-my-profile">'
    +'<div class="kt-profile-hero">'
      +'<div class="kt-profile-photo-wrap">'
        +'<button type="button" class="kt-my-profile-photo" onclick="document.getElementById(\'ktProfilePhotoInput\').click()" aria-label="프로필 사진 바꾸기">'+photo+'<em>사진 변경</em></button>'
        +'<input id="ktProfilePhotoInput" type="file" accept="image/*" hidden onchange="ktProfilePickPhoto(this)">'
      +'</div>'
      +'<div class="kt-profile-maininfo"><b>'+ktProfileEscape(p.name)+'</b><small>'+ktProfileEscape(p.bio||'소개를 입력해 주세요')+'</small></div>'
    +'</div>'
    +'<div class="kt-profile-stats">'
      +'<div><b>'+(p.followers||0).toLocaleString('ko-KR')+'</b><small>팔로워</small></div>'
      +'<div><b>'+(p.likes||0).toLocaleString('ko-KR')+'</b><small>좋아요</small></div>'
    +'</div>'
    +'<button class="kt-profile-public-link" type="button" onclick="ktOpenProfileLink()"><span>🔗</span><b>'+linkText+'</b><em>›</em></button>'
    +'<label>닉네임<input id="ktProfileName" class="form" maxlength="20" value="'+ktProfileEscape(p.name)+'" placeholder="닉네임"></label>'
    +'<label>소개<input id="ktProfileBio" class="form" maxlength="60" value="'+ktProfileEscape(p.bio)+'" placeholder="간단한 소개를 입력하세요"></label>'
    +'<label>프로필 링크<input id="ktProfileLink" class="form" maxlength="180" value="'+ktProfileEscape(p.link||'')+'" placeholder="https:// 또는 사이트 주소"></label>'
    +'<button class="act" type="button" onclick="ktProfileSave()">프로필 저장</button>'
    +'<button class="kt-profile-switch-btn" type="button" onclick="openAccountChooser()">⇄ 계정 선택</button>'
    +'<button class="kt-profile-video-btn" type="button" onclick="closeSheet();setTimeout(openMyVideoLibrary,80)">🎬 내 동영상 보기</button>'
    +'<small class="kt-profile-note">프로필 사진은 누르지 않아도 바로 보이게 표시됩니다.</small>'
    +'</div>';
};

window.ktOpenProfileLink=function(){
  var p=ktProfileLoad();
  var url=String(p.link||'').trim();
  if(!url){alert('프로필 링크를 먼저 입력해 주세요.');return;}
  if(!/^https?:\/\//i.test(url))url='https://'+url;
  try{window.open(url,'_blank','noopener');}catch(e){location.href=url;}
};

window.openProfileDirect=function(){
  var info=ktCurrentSubAccountInfo();
  showSheet('♛ '+info.name+' 프로필',ktProfileRender());
};
window.openProfile=function(){
  openAccountChooser();
};
window.ktProfileSave=function(){
  var old=ktProfileLoad();
  var nameEl=document.getElementById('ktProfileName');
  var bioEl=document.getElementById('ktProfileBio');
  var linkEl=document.getElementById('ktProfileLink');
  var name=String(nameEl?nameEl.value:'').trim();
  var bio=String(bioEl?bioEl.value:'').trim();
  var link=String(linkEl?linkEl.value:'').trim();
  if(!name){alert('닉네임을 입력해 주세요.');return;}
  var data={name:name,bio:bio,photo:old.photo||'',followers:old.followers||0,likes:old.likes||0,link:link};
  try{localStorage.setItem(ktProfileStorageKey(),JSON.stringify(data));}catch(e){
    alert('프로필을 저장하지 못했습니다. 다시 눌러 주세요.');return;
  }
  ktSpeak('프로필을 저장했습니다.');
  alert('✅ 프로필을 저장했습니다.');
  openProfileDirect();
};
window.ktProfilePickPhoto=function(input){
  var file=input&&input.files&&input.files[0];
  if(!file)return;
  if(!/^image\//i.test(file.type||'')){alert('사진 파일을 선택해 주세요.');return;}
  var reader=new FileReader();
  reader.onload=function(){
    var img=new Image();
    img.onload=function(){
      try{
        var size=420;
        var canvas=document.createElement('canvas');
        canvas.width=size;canvas.height=size;
        var ctx=canvas.getContext('2d');
        var scale=Math.max(size/img.width,size/img.height);
        var w=img.width*scale,h=img.height*scale;
        ctx.drawImage(img,(size-w)/2,(size-h)/2,w,h);
        var photo=canvas.toDataURL('image/jpeg',0.84);
        var p=ktProfileLoad();
        p.photo=photo;
        var nameEl=document.getElementById('ktProfileName');
        var bioEl=document.getElementById('ktProfileBio');
        var linkEl=document.getElementById('ktProfileLink');
        if(nameEl&&nameEl.value.trim())p.name=nameEl.value.trim();
        if(bioEl)p.bio=bioEl.value.trim();
        if(linkEl)p.link=linkEl.value.trim();
        localStorage.setItem(ktProfileStorageKey(),JSON.stringify(p));
        openProfileDirect();
      }catch(e){alert('사진을 등록하지 못했습니다. 다른 사진으로 다시 해 주세요.');}
    };
    img.onerror=function(){alert('사진을 읽지 못했습니다.');};
    img.src=reader.result;
  };
  reader.onerror=function(){alert('사진을 읽지 못했습니다.');};
  reader.readAsDataURL(file);
};
window.ktAddProfileFollower=function(n){
  var p=ktProfileLoad();p.followers=Math.max(0,(p.followers||0)+(parseInt(n||1,10)||1));
  try{localStorage.setItem(ktProfileStorageKey(),JSON.stringify(p));}catch(e){}
};
window.ktAddProfileLike=function(n){
  var p=ktProfileLoad();p.likes=Math.max(0,(p.likes||0)+(parseInt(n||1,10)||1));
  try{localStorage.setItem(ktProfileStorageKey(),JSON.stringify(p));}catch(e){}
};
window.openAI=function(){
  var html='<div class="rowbox"><b>🗣️ AI 음성 안내</b><br>선물 · 보물상자 · 당첨 보상 · 주요 알림을 한국어 음성으로 읽어줍니다.</div>'
    +'<div class="rowbox"><b>현재 상태</b><br>'+(state.aiVoiceOn?'켜짐':'꺼짐')+'</div>'
    +'<button class="act" onclick="toggleAIVoice();closeSheet();openAI()">'+(state.aiVoiceOn?'AI 음성 끄기':'AI 음성 켜기')+'</button>'
    +'<button class="act" onclick="ktSpeak(\'K-Talk AI 음성 안내 테스트입니다.\')">🔊 음성 테스트</button>';
  showSheet('🔊 AI 읽기',html);
};
window.setCreatorMode=function(el,name){
  document.querySelectorAll('.creator-foot span').forEach(function(s){s.classList.remove('on');});
  if(el)el.classList.add('on');
  if(name==='게시'||name==='창작하기'){
    if(window.creator)creator.classList.remove('live-prep-open');
  }
};

window.selectCreatorSound=function(name){
  state.creatorSound=name;
  var btn=document.getElementById('creatorSoundBtn');
  if(btn)btn.textContent='♪ '+name;
  closeSheet();
};

window.openSoundPanel=function(){
  var tracks=[
    ['오늘의 설렘','K-Talk 추천','2:10'],
    ['밤하늘 산책','K-Talk Music','1:00'],
    ['신나는 하루','Various Creators','1:00'],
    ['웃으며 시작','K-Talk 추천','1:15'],
    ['감성 드라이브','K-Talk Music','2:00'],
    ['따뜻한 오후','Various Creators','1:30']
  ];
  var list=tracks.map(function(t,i){
    return '<button class="kt-sound-row" onclick="selectCreatorSound(\''+t[0]+'\')">'
      +'<span class="kt-sound-cover">'+(i+1)+'</span>'
      +'<span class="kt-sound-info"><b>'+t[0]+'</b><small>'+t[1]+' · '+t[2]+'</small></span>'
      +'<span class="kt-sound-play">▶</span>'
      +'</button>';
  }).join('');
  var html='<div class="kt-sound-panel">'
    +'<div class="kt-sound-search">⌕ <input placeholder="사운드 검색" aria-label="사운드 검색"></div>'
    +'<div class="kt-sound-tabs"><button>인기</button><button class="on">맞춤 추천</button><button>즐겨찾기</button><button>최근</button></div>'
    +'<div class="kt-sound-list">'+list+'</div>'
    +'</div>';
  showSheet('사운드 추가',html);
};

window.openSong=function(){openSoundPanel();};
window.report=function(){showSheet('🚩 신고 게시판','<div class="rowbox"><b>신고 접수 화면</b></div>');};
window.openAd=function(){showSheet('📣 광고·판매자 등록','<div class="rowbox"><b>광고 문의 화면</b></div>');};
window.toggleSave=function(btn){state.saved=!state.saved;if(btn)btn.style.color=state.saved?'#ffe07a':'#fff';};
window.toggleMic=function(btn){state.mic=!state.mic;if(btn)btn.textContent=state.mic?'🎤 마이크':'🔇 마이크';};
window.shareToTarget=async function(target){
  var url=location.href;
  if(target==='copy'){
    try{await navigator.clipboard.writeText(url);alert('링크를 복사했습니다.');}catch(e){alert(url);}
    return;
  }
  if(navigator.share){
    try{await navigator.share({title:'K-Talk LIVE',text:'K-Talk LIVE 방송을 함께 보세요.',url:url});}catch(e){}
  }else{
    try{await navigator.clipboard.writeText(url);alert('링크를 복사했습니다.');}catch(e){alert(url);}
  }
};
window.shareWithFollow=function(name){
  alert(name+'님에게 공유할 준비가 되었습니다.');
};
window.shareApp=function(){
  var html='<div class="kt-share-panel">'
    +'<div class="kt-share-follow-title">팔로우한 사람</div>'
    +'<div class="kt-share-follow">'
      +'<button onclick="shareWithFollow(\'친구1\')"><span>🙂</span><b>친구1</b></button>'
      +'<button onclick="shareWithFollow(\'친구2\')"><span>😊</span><b>친구2</b></button>'
      +'<button onclick="shareWithFollow(\'친구3\')"><span>😎</span><b>친구3</b></button>'
      +'<button onclick="shareWithFollow(\'친구4\')"><span>👩</span><b>친구4</b></button>'
      +'<button onclick="shareWithFollow(\'친구5\')"><span>👨</span><b>친구5</b></button>'
    +'</div>'
    +'<div class="kt-share-divider"></div>'
    +'<div class="kt-share-apps">'
      +'<button onclick="shareToTarget(\'kakao\')"><span class="kakao">TALK</span><b>카카오톡</b></button>'
      +'<button onclick="shareToTarget(\'facebook\')"><span class="facebook">f</span><b>Facebook</b></button>'
      +'<button onclick="shareToTarget(\'copy\')"><span class="copy">🔗</span><b>링크 복사</b></button>'
      +'<button onclick="shareToTarget(\'messenger\')"><span class="messenger">✉</span><b>Messenger</b></button>'
      +'<button onclick="shareToTarget(\'instagram\')"><span class="instagram">◎</span><b>Instagram</b></button>'
    +'</div>'
    +'</div>';
  showSheet('공유',html);
};
window.render=function(name){if(name==='home')home();else if(name==='shorts'||name==='video')media(name);else if(name==='profile')openProfile();};

document.addEventListener('click',function(e){var tab=e.target.closest('[data-tab]');if(tab){activate(tab.dataset.tab);render(tab.dataset.tab);return;}var bottom=e.target.closest('[data-bottom]');if(bottom){var k=bottom.dataset.bottom;if(k==='home'){activate('home');home();}else if(k==='friends'){friends();}else if(k==='plus'){openCreator();}else if(k==='help'){openMenu();}else if(k==='profile'){openProfile();}}});

home();

setTimeout(function(){
  var directCreator=window.openCreator;
  window.openRoomTypeChooser=function(){
    var html='<div class="kt-multi-layouts">'
      +'<button onclick="selectMultiGuestLayout(this,\'grid\')"><span class="layout-preview grid"><i></i><i></i><i></i><i></i><i></i><i></i></span><b>격자형</b><small>여러 명을 한눈에</small></button>'
      +'<button onclick="selectMultiGuestLayout(this,\'side\')"><span class="layout-preview side"><i></i><i></i></span><b>나란히</b><small>두 화면을 크게</small></button>'
      +'<button onclick="selectMultiGuestLayout(this,\'spotlight\')"><span class="layout-preview spot"><i></i><i></i><i></i><i></i></span><b>스포트라이트</b><small>호스트 크게 · 게스트 아래</small></button>'
      +'</div>';
    showSheet('멀티 게스트 설정',html);
  };
  window.selectMultiGuestLayout=function(el,type){
    state.multiGuestLayout=type;
    document.querySelectorAll('.kt-multi-layouts button').forEach(function(b){b.classList.remove('on');});
    if(el)el.classList.add('on');
    setTimeout(function(){closeSheet();},120);
  };
  window.selectLiveRoom=function(name,max,type){state.liveRoomType=type;state.liveRoomName=name;state.liveRoomMax=max;closeSheet();directCreator();var title=document.getElementById('liveTitle');if(title)title.value=name+' · 최대 '+max+'명';};
  window.openPasswordRoomSetup=function(){showSheet('🔒 비밀번호방 설정','<div class="note">방에 들어올 때 사용할 비밀번호를 설정하세요.</div><input id="roomPasswordInput" class="form" type="password" inputmode="numeric" maxlength="8" placeholder="비밀번호 입력"><button class="act" onclick="confirmPasswordRoom()">비밀번호 설정하고 계속</button>');};
  window.confirmPasswordRoom=function(){var input=document.getElementById('roomPasswordInput');var pw=input?input.value.trim():'';if(pw.length<4){alert('비밀번호를 4자리 이상 입력해 주세요.');return;}state.roomPassword=pw;state.liveRoomType='password';state.liveRoomName='비밀번호방';state.liveRoomMax=7;closeSheet();directCreator();var title=document.getElementById('liveTitle');if(title)title.value='비밀번호방 · 호스트 1 + 게스트 6';};
  var oldPrepBottom=window.prepBottomTap;
  window.prepBottomTap=function(el,name){if(oldPrepBottom)oldPrepBottom(el,name);};
},0);
