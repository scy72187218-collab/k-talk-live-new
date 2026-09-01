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
window.showSheet=function(title,html){sheet.classList.remove('camera-effect-sheet');sheetTitle.innerHTML=title;sheetBody.innerHTML=html;sheet.classList.add('show');};
window.closeSheet=function(){sheet.classList.remove('show');sheet.classList.remove('gift-exact');sheet.classList.remove('camera-effect-sheet');};

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

window.openCreator=function(){
  creator.classList.add('show');
  var live=state.stream&&state.stream.getTracks&&state.stream.getTracks().some(function(t){return t.readyState==='live';});
  if(live){
    camera.srcObject=state.stream;
    creator.classList.add('camera-on');
    try{camera.play();}catch(e){}
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

window.ensureLiveCamera=async function(facing){
  try{
    var live=state.stream&&state.stream.getTracks&&state.stream.getTracks().some(function(t){return t.readyState==='live';});
    if(live){
      camera.srcObject=state.stream;
      creator.classList.add('camera-on');
      applyBaseCameraLook();
      try{await camera.play();}catch(e){}
      return true;
    }
    state.cameraFacing=facing||state.cameraFacing||'user';
    state.stream=await navigator.mediaDevices.getUserMedia({
      video:{
        facingMode:{ideal:state.cameraFacing},
        width:{ideal:1920},
        height:{ideal:1080},
        frameRate:{ideal:30,max:60}
      },
      audio:true
    });
    camera.srcObject=state.stream;
    camera.muted=true;
    camera.setAttribute('playsinline','');
    creator.classList.add('camera-on');

    var track=state.stream.getVideoTracks&&state.stream.getVideoTracks()[0];
    if(track){
      try{track.contentHint='detail';}catch(e){}
      try{
        var caps=track.getCapabilities?track.getCapabilities():{};
        var adv={};
        if(caps.focusMode&&caps.focusMode.indexOf('continuous')>-1)adv.focusMode='continuous';
        if(Object.keys(adv).length)await track.applyConstraints({advanced:[adv]});
      }catch(e){}
    }

    applyBaseCameraLook();
    try{await camera.play();}catch(e){}
    return true;
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

window.startCreatorRecording=async function(){
  if(ktCreatorRecording){ stopCreatorRecording(); return; }
  if(!('MediaRecorder' in window)){
    alert('이 기기에서는 동영상 촬영 기능을 사용할 수 없습니다.');
    return;
  }
  var ok=await ensureLiveCamera(state.cameraFacing||'user');
  if(!ok)return;

  ktCreatorChunks=[];
  ktCreatorBlob=null;
  if(ktCreatorBlobUrl){try{URL.revokeObjectURL(ktCreatorBlobUrl);}catch(e){} ktCreatorBlobUrl='';}

  var opts={};
  try{
    if(MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus'))opts.mimeType='video/webm;codecs=vp9,opus';
    else if(MediaRecorder.isTypeSupported('video/webm;codecs=vp8,opus'))opts.mimeType='video/webm;codecs=vp8,opus';
    else if(MediaRecorder.isTypeSupported('video/mp4'))opts.mimeType='video/mp4';
  }catch(e){}

  try{
    ktCreatorRecorder=new MediaRecorder(state.stream,opts);
  }catch(e){
    try{ktCreatorRecorder=new MediaRecorder(state.stream);}catch(err){alert('동영상 촬영을 시작할 수 없습니다.');return;}
  }

  ktCreatorRecorder.ondataavailable=function(e){
    if(e.data&&e.data.size)ktCreatorChunks.push(e.data);
  };
  ktCreatorRecorder.onstop=function(){
    var type=(ktCreatorRecorder&&ktCreatorRecorder.mimeType)||'video/webm';
    ktCreatorBlob=new Blob(ktCreatorChunks,{type:type});
    ktCreatorBlobUrl=URL.createObjectURL(ktCreatorBlob);
    var preview=document.getElementById('ktCreatorPreview');
    if(preview){
      preview.src=ktCreatorBlobUrl;
      preview.style.display='block';
      preview.play().catch(function(){});
    }
    creator.classList.remove('creator-recording');
    creator.classList.add('creator-review');
    ktCreatorRecording=false;
  };

  try{
    ktCreatorRecorder.start(250);
    ktCreatorRecording=true;
    creator.classList.remove('creator-review','live-prep-open');
    creator.classList.add('creator-recording','camera-on');
  }catch(e){
    ktCreatorRecording=false;
    alert('동영상 촬영을 시작할 수 없습니다.');
  }
};

window.stopCreatorRecording=function(){
  if(!ktCreatorRecording||!ktCreatorRecorder)return;
  try{
    if(ktCreatorRecorder.state!=='inactive')ktCreatorRecorder.stop();
  }catch(e){}
};

window.deleteCreatorRecording=function(){
  try{
    var p=document.getElementById('ktCreatorPreview');
    if(p){p.pause();p.removeAttribute('src');p.load();p.style.display='none';}
  }catch(e){}
  if(ktCreatorBlobUrl){try{URL.revokeObjectURL(ktCreatorBlobUrl);}catch(e){}}
  ktCreatorBlobUrl='';
  ktCreatorBlob=null;
  ktCreatorChunks=[];
  creator.classList.remove('creator-review');
  creator.classList.add('camera-on');
  try{if(camera&&state.stream){camera.srcObject=state.stream;camera.play().catch(function(){});}}catch(e){}
};

window.saveCreatorRecording=function(){
  if(!ktCreatorBlob||!ktCreatorBlobUrl){alert('저장할 동영상이 없습니다.');return;}
  try{
    var ext=(ktCreatorBlob.type||'').indexOf('mp4')>-1?'mp4':'webm';
    var a=document.createElement('a');
    a.href=ktCreatorBlobUrl;
    a.download='K-Talk_'+Date.now()+'.'+ext;
    document.body.appendChild(a);
    a.click();
    a.remove();
    ktSpeak('동영상을 저장했습니다.');
  }catch(e){
    alert('동영상 저장을 완료하지 못했습니다.');
  }
};

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
  var html='<div class="kt-beauty-panel">'
    +'<div class="kt-panel-tabs"><button class="on">Beauty</button><button onclick="openEditEffectPanel()">편집효과</button><button onclick="resetBeautyAll()">↺ 초기화</button></div>'
    +'<div class="kt-beauty-presets">'
      +'<button onclick="setBeautyMode(\'soft\',\'\')"><b>💧</b><span>부드럽게</span></button>'
      +'<button onclick="setBeautyMode(\'natural\',\'\')"><b>☺</b><span>자연</span></button>'
      +'<button onclick="setBeautyMode(\'bright\',\'\')"><b>☀</b><span>밝게</span></button>'
      +'<button onclick="setBeautyMode(\'glow\',\'\')"><b>✨</b><span>화사하게</span></button>'
    +'</div>'
    +'<div class="kt-slider-row"><span>피부</span><input type="range" min="0" max="100" value="'+(state.beautySkin||35)+'" oninput="setBeautySlider(\'skin\',this.value)"><b id="beautySkinVal">'+(state.beautySkin||35)+'</b></div>'
    +'<div class="kt-slider-row"><span>밝기</span><input type="range" min="0" max="100" value="'+(state.beautyBright||25)+'" oninput="setBeautySlider(\'bright\',this.value)"><b id="beautyBrightVal">'+(state.beautyBright||25)+'</b></div>'
    +'<div class="kt-slider-row"><span>선명도</span><input type="range" min="0" max="100" value="'+(state.beautySharp||20)+'" oninput="setBeautySlider(\'sharp\',this.value)"><b id="beautySharpVal">'+(state.beautySharp||20)+'</b></div>'
    +'<div class="kt-beauty-face-row">'
      +'<button onclick="setBeautySticker(\'✨\')"><b>✨</b><span>반짝임</span></button>'
      +'<button onclick="setBeautySticker(\'👓\')"><b>👓</b><span>안경</span></button>'
      +'<button onclick="setBeautySticker(\'👑\')"><b>👑</b><span>왕관</span></button>'
      +'<button onclick="setBeautySticker(\'😄\')"><b>😄</b><span>웃긴표정</span></button>'
      +'<button onclick="setBeautySticker(\'\')"><b>⊘</b><span>없음</span></button>'
    +'</div>'
    +'</div>';
  showSheet('뷰티',html);
  sheet.classList.add('camera-effect-sheet');
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
  var skin=state.beautySkin||0, bright=state.beautyBright||0, sharp=state.beautySharp||0;
  var brightness=(1+bright/260).toFixed(2);
  var saturation=(1+sharp/350).toFixed(2);
  var contrast=(1+sharp/500).toFixed(2);
  var blur=(skin/180).toFixed(2);
  if(camera)camera.style.filter='brightness('+brightness+') saturate('+saturation+') contrast('+contrast+') blur('+blur+'px)';
  var val=document.getElementById(kind==='skin'?'beautySkinVal':kind==='bright'?'beautyBrightVal':'beautySharpVal');
  if(val)val.textContent=value;
};

window.resetBeautyAll=function(){
  state.beautyMode='off';state.beautySkin=0;state.beautyBright=0;state.beautySharp=0;
  creator.classList.remove('beauty-natural','beauty-bright','beauty-soft','beauty-glow');
  creator.removeAttribute('data-beauty-char');
  if(camera)camera.style.filter='brightness(1.12) contrast(.95) saturate(1.02)';
  openBeautyPanel();
};

window.ensureFaceEffectLayer=function(){
  var layer=document.getElementById('ktFaceEffectLayer');
  if(!layer){
    layer=document.createElement('div');
    layer.id='ktFaceEffectLayer';
    layer.className='kt-face-effect-layer';
    creator.appendChild(layer);
  }
  layer.style.cssText='position:absolute!important;inset:0!important;z-index:9!important;display:block!important;pointer-events:none!important;overflow:hidden!important;';
  var anchor=document.getElementById('ktFaceAnchor');
  if(!anchor){
    anchor=document.createElement('div');
    anchor.id='ktFaceAnchor';
    anchor.className='kt-face-anchor';
    layer.appendChild(anchor);
  }
  return layer;
};

window.ktFaceDetector=null;
window.ktFaceTrackTimer=null;

window.placeFaceAnchorFallback=function(){
  var anchor=document.getElementById('ktFaceAnchor');
  if(!anchor||!camera)return;
  var cr=creator.getBoundingClientRect();
  var vr=camera.getBoundingClientRect();
  var w=Math.min(vr.width*.46,220);
  var h=w*1.18;
  var cx=(vr.left-cr.left)+(vr.width*.50);
  var cy=(vr.top-cr.top)+(vr.height*.39);
  anchor.style.left=cx+'px';
  anchor.style.top=cy+'px';
  anchor.style.width=w+'px';
  anchor.style.height=h+'px';
};

window.trackFaceOnce=async function(){
  var anchor=document.getElementById('ktFaceAnchor');
  if(!anchor||!camera||!camera.videoWidth||!camera.videoHeight){
    placeFaceAnchorFallback();
    return;
  }

  if(!('FaceDetector' in window)){
    placeFaceAnchorFallback();
    return;
  }

  try{
    if(!window.ktFaceDetector)window.ktFaceDetector=new FaceDetector({fastMode:true,maxDetectedFaces:1});
    var faces=await window.ktFaceDetector.detect(camera);
    if(!faces||!faces.length){placeFaceAnchorFallback();return;}

    var box=faces[0].boundingBox;
    var cr=creator.getBoundingClientRect();
    var vr=camera.getBoundingClientRect();
    var vw=camera.videoWidth, vh=camera.videoHeight;
    var scale=Math.max(vr.width/vw,vr.height/vh);
    var drawW=vw*scale, drawH=vh*scale;
    var offX=(vr.width-drawW)/2;
    var offY=(vr.height-drawH)/2;
    var bw=box.width*scale, bh=box.height*scale;
    var bx=offX+(box.x*scale);
    if((state.cameraFacing||'user')!=='environment'){
      bx=vr.width-offX-((box.x+box.width)*scale);
    }
    var by=offY+(box.y*scale);

    var cx=(vr.left-cr.left)+bx+(bw/2);
    var cy=(vr.top-cr.top)+by+(bh/2);

    anchor.style.left=cx+'px';
    anchor.style.top=cy+'px';
    anchor.style.width=Math.max(120,bw)+'px';
    anchor.style.height=Math.max(145,bh)+'px';
  }catch(e){
    placeFaceAnchorFallback();
  }
};

window.startKTFaceTracking=function(){
  ensureFaceEffectLayer();
  clearInterval(window.ktFaceTrackTimer);
  trackFaceOnce();
  window.ktFaceTrackTimer=setInterval(function(){
    if(creator&&creator.classList.contains('show'))trackFaceOnce();
  },260);
};

window.stopKTFaceTracking=function(){
  clearInterval(window.ktFaceTrackTimer);
  window.ktFaceTrackTimer=null;
};

window.renderFaceEffect=function(name){
  var layer=ensureFaceEffectLayer();
  var anchor=document.getElementById('ktFaceAnchor');
  anchor.innerHTML='';
  anchor.className='kt-face-anchor';

  var filterClasses=['fx-glow','fx-soft','fx-rainbow','fx-cool','fx-warm','fx-night','fx-cinema','fx-mono','fx-pink','fx-blue','fx-star','fx-party','fx-disco','fx-dream'];
  creator.classList.remove.apply(creator.classList,filterClasses);

  if(!name||name==='off'){
    state.editFilter='';
    state.editSticker='';
    if(camera)camera.style.filter='brightness(1.12) contrast(.95) saturate(1.02)';
    return;
  }

  state.editFilter='';
  state.editSticker=name;

  if(name==='sunglasses'){
    anchor.innerHTML='<div class="fx-sunglasses-mask"><i></i><i></i><b></b></div>';
  }else if(name==='glasses'){
    anchor.innerHTML='<div class="fx-glasses-mask"><i></i><i></i><b></b></div>';
  }else if(name==='beard'){
    anchor.innerHTML='<div class="fx-beard-mask"><span>〰</span><b></b></div>';
  }else if(name==='cap'){
    anchor.innerHTML='<div class="fx-cap-mask"><i></i><b></b></div>';
  }else if(name==='sparkle'){
    anchor.innerHTML='<div class="fx-sparkles-mask"><span>✦</span><span>✧</span><span>✦</span><span>✧</span></div>';
  }else if(name==='mono'){
    state.editFilter='mono';
    creator.classList.add('fx-mono');
  }else if(name==='warm'){
    state.editFilter='warm';
    creator.classList.add('fx-warm');
  }else if(name==='cool'){
    state.editFilter='cool';
    creator.classList.add('fx-cool');
  }else if(name==='soft'){
    state.editFilter='dream';
    creator.classList.add('fx-dream');
  }else if(name==='studio'){
    state.editFilter='studio';
    if(camera)camera.style.filter='brightness(1.16) contrast(.94) saturate(.98)';
  }else if(name==='night'){
    state.editFilter='night';
    creator.classList.add('fx-night');
  }

  startKTFaceTracking();
};

window.syncEditEffectButtons=function(){
  document.querySelectorAll('.kt-live-effect-item[data-effect]').forEach(function(btn){
    var n=btn.getAttribute('data-effect');
    btn.classList.toggle('on',n===state.pendingEditEffect);
  });
  var label=document.getElementById('ktEffectSelected');
  if(label){
    var map={off:'해제',sunglasses:'선글라스',glasses:'안경',beard:'수염',cap:'캡모자',sparkle:'별빛',warm:'웜톤',cool:'쿨톤',soft:'소프트',studio:'스튜디오',night:'야간',mono:'흑백'};
    label.textContent=map[state.pendingEditEffect||'off']||'효과';
  }
};

window.previewEditEffect=function(name){
  state.pendingEditEffect=name;
  renderFaceEffect(name);
  syncEditEffectButtons();
};

window.setEditEffect=function(name){
  previewEditEffect(name);
};

window.applyEditEffect=function(){
  state.appliedEditEffect=state.pendingEditEffect||'off';
  renderFaceEffect(state.appliedEditEffect);
  var tray=document.getElementById('ktLiveEffects');
  if(tray)tray.classList.remove('show');
};

window.closeEditEffectPanel=function(){
  state.pendingEditEffect=state.appliedEditEffect||'off';
  renderFaceEffect(state.pendingEditEffect);
  var tray=document.getElementById('ktLiveEffects');
  if(tray)tray.classList.remove('show');
};

window.openEditEffectPanel=function(){
  var tray=document.getElementById('ktLiveEffects');
  if(!tray){
    tray=document.createElement('div');
    tray.id='ktLiveEffects';
    tray.className='kt-live-effects';
    creator.appendChild(tray);
  }

  if(!state.appliedEditEffect)state.appliedEditEffect='off';
  state.pendingEditEffect=state.appliedEditEffect;

  var effects=[
    ['↺','해제','off'],
    ['🕶️','선글라스','sunglasses'],
    ['👓','안경','glasses'],
    ['〰','수염','beard'],
    ['🧢','캡모자','cap'],
    ['✦','별빛','sparkle'],
    ['☀️','웜톤','warm'],
    ['🧊','쿨톤','cool'],
    ['☁️','소프트','soft'],
    ['💡','스튜디오','studio'],
    ['🌙','야간','night'],
    ['◐','흑백','mono']
  ];

  tray.innerHTML='<div class="kt-live-effects-head"><b>편집효과</b><button onclick="closeEditEffectPanel()">✕</button></div>'
    +'<div class="kt-live-effects-tabs"><button class="on">추천</button><button>얼굴</button><button>분위기</button></div>'
    +'<div class="kt-live-effects-scroll">'
    +effects.map(function(e){
      return '<button class="kt-live-effect-item" data-effect="'+e[2]+'" onclick="previewEditEffect(\''+e[2]+'\')">'
        +'<span>'+e[0]+'</span><small>'+e[1]+'</small></button>';
    }).join('')
    +'</div>'
    +'<div class="kt-effect-applybar"><span>선택: <b id="ktEffectSelected">효과</b></span><button onclick="applyEditEffect()">✓ 적용</button></div>';

  tray.classList.add('show');
  ensureFaceEffectLayer();
  renderFaceEffect(state.pendingEditEffect);
  syncEditEffectButtons();
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
  ['장미','1'],['장미 꽃다발','5'],['장미 박스','10'],['장미 20송이','20'],['장미 50송이','50'],
  ['장미 100송이','100'],['장미 200송이','200'],['장미 300송이','300'],['장미 400송이','400'],['장미 500송이','500'],
  ['로열 장미','1,000'],['보라 장미','2,000'],['핑크 장미','3,000'],['레전드 장미','5,000'],['황금 장미','10,000'],
  ['킹 크라운','100'],['다이아 왕관','200'],['럭셔리 자동차','300'],['로열 요트','400'],['골든 캐슬','500'],
  ['갤럭시 무대','1,000'],['프리미엄 로즈','1'],['로즈 부케','5'],['로즈 박스','10'],['골든 부케','50'],
  ['로열 하트','100'],['황금 왕관','200'],['사랑 하트','300'],['다이아 하트','500'],['K-Talk 카드','700'],
  ['VIP 크라운','1,000'],['골드 패키지','1,500'],['로열 패키지','2,000'],['프리미엄 캐슬','3,000'],['프라이빗 제트','5,000'],
  ['황금 드래곤','500,000'],['황제 궁전','300,000'],['초대형 크루즈','200,000'],['달 착륙선','150,000'],['황금 열차','30,000']
];
window.giftSendByIndex=function(i){
  var g=window.ktalkGifts[i];
  if(!g)return;
  giftSend(g[0],g[1]);
};
window.openGifts=function(){
  var buttons=window.ktalkGifts.map(function(g,i){
    return '<button class="gift-exact-hit" onclick="giftSendByIndex('+i+')" aria-label="'+g[0]+'"></button>';
  }).join('');
  var html='<div class="gift-exact-wrap">'
    +'<img class="gift-exact-img" src="gift-panel-exact.svg?v=20260831-1527" alt="K-Talk 선물 40종">'
    +'<button class="gift-exact-close" onclick="closeSheet()" aria-label="닫기"></button>'
    +'<div class="gift-exact-hotspots">'+buttons+'</div>'
    +'</div>';
  showSheet('',html);
  sheet.classList.add('gift-exact');
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
window.openProfile=function(){showSheet('♛ 프로필','<div class="profile-pic">K</div><div style="text-align:center"><h3 style="color:#ffe07a">K-Talk</h3></div>');};
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

