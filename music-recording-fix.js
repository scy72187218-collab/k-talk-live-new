/* K-Talk: record the selected in-app/free music together with mic audio. */
(function(){
  if(window.__ktMusicRecordingFixInstalled)return;
  window.__ktMusicRecordingFixInstalled=true;

  var oldSelect=window.selectCreatorSound;
  var oldSelectByIndex=window.selectCreatorSoundByIndex;
  var oldPlayRemote=window.ktPlayRemoteSound;
  var oldPlayPreview=window.ktPlaySoundPreview;
  var oldMake=window.makeEffectRecordingStream;
  var oldStart=window.startCreatorRecording;
  var oldStop=window.stopCreatorRecording;
  var oldDelete=window.deleteCreatorRecording;

  window.ktLastCreatorSoundPreviewUrl='';
  window.ktLastCreatorSoundPreviewName='';
  window.ktCreatorMusicCapture=null;

  function setChosen(name,url){
    try{
      state.creatorSound=name||state.creatorSound||'';
      state.creatorSoundUrl=url||'';
    }catch(e){}
    if(url){
      window.ktLastCreatorSoundPreviewUrl=url;
      window.ktLastCreatorSoundPreviewName=name||'';
    }
    try{
      var b=document.getElementById('creatorSoundBtn');
      if(b&&name)b.textContent='♪ '+name;
    }catch(e){}
  }

  if(typeof oldSelect==='function'){
    window.selectCreatorSound=function(name,url){
      var useUrl=url||'';
      if(!useUrl && name && name===window.ktLastCreatorSoundPreviewName){
        useUrl=window.ktLastCreatorSoundPreviewUrl||'';
      }
      setChosen(name,useUrl);
      return oldSelect.apply(this,[name]);
    };
  }

  if(typeof oldSelectByIndex==='function'){
    window.selectCreatorSoundByIndex=function(index,ev){
      var t=(window.ktCreatorTracks||[])[index];
      if(t && !t.searchOnly && t.url){
        setChosen(t.name,t.url);
        if(typeof oldSelect==='function')return oldSelect.call(this,t.name);
      }
      return oldSelectByIndex.apply(this,arguments);
    };
  }

  if(typeof oldPlayPreview==='function'){
    window.ktPlaySoundPreview=function(index,ev){
      var t=(window.ktCreatorTracks||[])[index];
      if(t && !t.searchOnly && t.url)setChosen(t.name,t.url);
      return oldPlayPreview.apply(this,arguments);
    };
  }

  if(typeof oldPlayRemote==='function'){
    window.ktPlayRemoteSound=function(url,ev){
      var name='';
      try{
        var row=ev&&ev.currentTarget&&ev.currentTarget.closest?ev.currentTarget.closest('.kt-sound-row'):null;
        var b=row&&row.querySelector?row.querySelector('.kt-sound-info b'):null;
        name=b?String(b.textContent||'').trim():'';
      }catch(e){}
      setChosen(name||'선택한 음악',url||'');
      return oldPlayRemote.apply(this,arguments);
    };
  }

  function stopCapture(closeContext){
    var c=window.ktCreatorMusicCapture;
    if(!c)return;
    try{c.audio.pause();}catch(e){}
    try{c.audio.currentTime=0;}catch(e){}
    if(closeContext){
      try{c.ctx.close();}catch(e){}
      try{c.audio.remove();}catch(e){}
      window.ktCreatorMusicCapture=null;
    }
  }

  function buildMixedStream(base,url){
    if(!base || !url)return base;
    var AC=window.AudioContext||window.webkitAudioContext;
    if(!AC)return base;
    try{
      stopCapture(true);
      var out=new MediaStream();
      base.getVideoTracks().forEach(function(t){out.addTrack(t);});

      var ctx=new AC();
      var dest=ctx.createMediaStreamDestination();
      var micTracks=base.getAudioTracks?base.getAudioTracks():[];
      if(!micTracks.length && window.state&&state.stream&&state.stream.getAudioTracks){
        micTracks=state.stream.getAudioTracks();
      }
      if(micTracks&&micTracks.length){
        var micStream=new MediaStream(micTracks);
        var micSource=ctx.createMediaStreamSource(micStream);
        var micGain=ctx.createGain();
        micGain.gain.value=1.0;
        micSource.connect(micGain);
        micGain.connect(dest);
      }

      var audio=document.createElement('audio');
      audio.id='ktCreatorMusicCapture';
      audio.preload='auto';
      audio.loop=true;
      audio.crossOrigin='anonymous';
      audio.src=url;
      audio.volume=1;
      audio.playsInline=true;
      document.body.appendChild(audio);

      var musicSource=ctx.createMediaElementSource(audio);
      var musicGain=ctx.createGain();
      musicGain.gain.value=0.62;
      musicSource.connect(musicGain);
      musicGain.connect(dest);
      musicGain.connect(ctx.destination);

      dest.stream.getAudioTracks().forEach(function(t){out.addTrack(t);});
      window.ktCreatorMusicCapture={ctx:ctx,audio:audio,dest:dest};
      return out;
    }catch(e){
      try{stopCapture(true);}catch(err){}
      return base;
    }
  }

  if(typeof oldMake==='function'){
    window.makeEffectRecordingStream=function(){
      var base=oldMake.apply(this,arguments);
      var url='';
      try{url=state.creatorSoundUrl||'';}catch(e){}
      if(!url)return base;
      return buildMixedStream(base,url);
    };
  }

  if(typeof oldStart==='function'){
    window.startCreatorRecording=async function(){
      var result=await oldStart.apply(this,arguments);
      var c=window.ktCreatorMusicCapture;
      if(c){
        try{if(c.ctx.state==='suspended')await c.ctx.resume();}catch(e){}
        try{c.audio.currentTime=0;}catch(e){}
        try{
          var p=c.audio.play();
          if(p&&p.catch)p.catch(function(){});
        }catch(e){}
      }
      return result;
    };
  }

  if(typeof oldStop==='function'){
    window.stopCreatorRecording=function(){
      var result=oldStop.apply(this,arguments);
      stopCapture(false);
      setTimeout(function(){stopCapture(true);},700);
      return result;
    };
  }

  if(typeof oldDelete==='function'){
    window.deleteCreatorRecording=function(){
      stopCapture(true);
      return oldDelete.apply(this,arguments);
    };
  }

  /* Sound-only playback fix: do not change any layout or other feature. */
  function soundOn(v){
    if(!v)return;
    try{
      v.defaultMuted=false;
      v.muted=false;
      v.volume=1;
      if(v.paused){
        var p=v.play();
        if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  document.addEventListener('click',function(ev){
    var v=null;
    try{v=ev.target&&ev.target.closest?ev.target.closest('.kt-public-video,#ktLibraryPlayer'):null;}catch(e){}
    if(!v)return;
    if(v.muted){
      try{ev.preventDefault();ev.stopImmediatePropagation();}catch(e){}
      soundOn(v);
    }
  },true);

  try{
    var observer=new MutationObserver(function(){
      document.querySelectorAll('.kt-public-video,#ktLibraryPlayer').forEach(function(v){
        try{v.defaultMuted=false;v.muted=false;v.volume=1;}catch(e){}
      });
    });
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* K-Talk: 사진 기준 출석체크 LED + 선물줄. 1인/13명/구독자 방송만 적용. */
(function(){
  if(window.__ktThreeRoomReferenceUiInstalled)return;
  window.__ktThreeRoomReferenceUiInstalled=true;

  function roomInfo(){
    var type='',name='',max=0;
    try{
      if(window.state){
        type=String(state.liveRoomType||'');
        name=String(state.liveRoomName||state.currentLiveRoomTitle||state.currentViewRoomTitle||'');
        max=Number(state.liveRoomMax||0);
      }
    }catch(e){}
    return {type:type,name:name,max:max};
  }

  function isTargetRoom(){
    var r=roomInfo();
    if(r.type==='password'||r.name.indexOf('비밀')>-1)return false;
    if(r.type==='solo'||r.type==='group'||r.type==='group13'||r.type==='subscriber')return true;
    if(r.name.indexOf('1인')>-1||r.name.indexOf('13명')>-1||r.name.indexOf('구독자')>-1)return true;
    return r.max===1;
  }

  var css=document.createElement('style');
  css.id='ktThreeRoomReferenceUiStyle';
  css.textContent='\
.kt-three-room-photo .kt-live-airclock{left:10px!important;top:62px!important;padding:5px 8px!important;gap:5px!important;font-size:10px!important;z-index:21!important;}\
.kt-three-room-photo .kt-live-attendance{left:134px!important;right:7px!important;top:58px!important;transform:none!important;width:auto!important;height:36px!important;padding:0 8px!important;border:2px solid #ff42c7!important;border-radius:10px!important;background-color:#110711!important;background-image:radial-gradient(circle,rgba(255,74,203,.62) 0 1px,transparent 1.5px)!important;background-size:6px 6px!important;box-shadow:inset 0 0 10px #ff37c43d,0 0 7px #ff40c9,0 0 15px #ff2ab99c!important;color:#ffd54d!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;z-index:22!important;}\
.kt-three-room-photo .kt-live-attendance .badge{padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;color:#ffd54d!important;font-size:12px!important;font-weight:950!important;letter-spacing:.4px!important;text-shadow:0 0 5px #ffad18,0 0 8px #ff6900!important;}\
.kt-three-room-photo .kt-live-attendance .wing{font-size:13px!important;color:#ff76df!important;filter:drop-shadow(0 0 4px #ff43cb)!important;}\
.kt-three-room-photo .kt-live-attendance .heart{color:#ff4fbf!important;text-shadow:0 0 6px #ff42bf!important;}\
#ktThreeRoomReferenceUi{position:absolute!important;inset:0!important;z-index:8!important;pointer-events:none!important;}\
#ktThreeRoomAttendanceBig{pointer-events:auto!important;position:absolute!important;left:8px!important;right:8px!important;top:102px!important;height:44px!important;border:2px solid #ff3bc8!important;border-radius:15px!important;background-color:#120813!important;background-image:radial-gradient(circle,rgba(255,70,205,.75) 0 1.1px,transparent 1.6px)!important;background-size:7px 7px!important;box-shadow:inset 0 0 13px #ff33c73d,0 0 8px #ff40c9,0 0 20px #ff2ab9b5!important;color:#ffbd28!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:5px!important;font-size:20px!important;font-weight:950!important;letter-spacing:.4px!important;text-shadow:0 0 5px #ffb51b,0 0 10px #ff5d00!important;}\
#ktThreeRoomAttendanceBig .kt3-wing{color:#ff7ce4!important;font-size:18px!important;text-shadow:0 0 7px #ff49d4!important;}\
#ktThreeRoomAttendanceBig .kt3-heart{color:#ff477e!important;font-size:21px!important;text-shadow:0 0 7px #ff2e71!important;}\
#ktThreeRoomGiftRow{pointer-events:auto!important;position:absolute!important;left:4px!important;right:4px!important;bottom:68px!important;height:62px!important;z-index:10!important;display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:2px!important;padding:2px!important;border:1px solid #ffffff22!important;border-radius:9px!important;background:rgba(2,2,6,.84)!important;box-shadow:0 -3px 14px #0008!important;}\
#ktThreeRoomGiftRow button{min-width:0!important;height:56px!important;padding:2px 1px!important;border:1px solid #ffffff2a!important;border-radius:7px!important;background:linear-gradient(180deg,#111116e8,#07070ae8)!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;}\
#ktThreeRoomGiftRow img{width:25px!important;height:25px!important;object-fit:contain!important;filter:drop-shadow(0 2px 4px #0009)!important;}\
#ktThreeRoomGiftRow .kt3-gift-emoji{height:25px!important;line-height:25px!important;font-size:20px!important;}\
#ktThreeRoomGiftRow b{display:block!important;width:100%!important;margin-top:1px!important;font-size:7.2px!important;line-height:1.05!important;font-weight:950!important;white-space:normal!important;word-break:keep-all!important;}\
#ktThreeRoomGiftRow small{display:block!important;margin-top:1px!important;font-size:5.8px!important;line-height:1!important;color:#ffd86b!important;font-weight:900!important;white-space:nowrap!important;}\
.kt-three-room-photo #myEarnHud{bottom:136px!important;width:170px!important;max-width:48vw!important;min-width:0!important;padding:5px 8px!important;border-radius:12px!important;z-index:11!important;}\
.kt-three-room-photo .kt-three-room-right-actions{bottom:148px!important;}\
@media(max-width:380px){.kt-three-room-photo .kt-live-attendance{left:126px!important;right:5px!important;padding:0 5px!important}.kt-three-room-photo .kt-live-attendance .badge{font-size:11px!important}#ktThreeRoomAttendanceBig{left:5px!important;right:5px!important;height:42px!important;font-size:18px!important}#ktThreeRoomGiftRow{left:2px!important;right:2px!important;gap:1px!important}#ktThreeRoomGiftRow b{font-size:6.4px!important}#ktThreeRoomGiftRow small{font-size:5.2px!important}.kt-three-room-photo #myEarnHud{width:154px!important;max-width:46vw!important}}\
';
  document.head.appendChild(css);

  function giftButton(img,label,sub,emoji){
    var art=img?'<img src="'+img+'" alt="">':'<span class="kt3-gift-emoji">'+emoji+'</span>';
    return '<button type="button" onclick="if(window.openGifts)openGifts()">'+art+'<b>'+label+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</button>';
  }

  function addReferenceUi(section){
    if(!section||section.querySelector('#ktThreeRoomReferenceUi'))return;
    var wrap=document.createElement('div');
    wrap.id='ktThreeRoomReferenceUi';
    wrap.innerHTML=''
      +'<button type="button" id="ktThreeRoomAttendanceBig" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()" aria-label="출석체크"><span class="kt3-wing">🪽</span><b>출석체크</b><span class="kt3-heart">♥</span><span class="kt3-wing">🪽</span></button>'
      +'<div id="ktThreeRoomGiftRow">'
      +giftButton('rose-single.svg','1개 장미','','')
      +giftButton('rose-bouquet-50.svg','50개 장미다발','','')
      +giftButton('rose-bouquet-100.svg','100개 특대장미','','')
      +giftButton('','10개 하트','','💗')
      +giftButton('','100개 왕관','','👑')
      +giftButton('','50개 스포츠카','','🏎️')
      +giftButton('gift-box.svg','선물상자','큰 선물 보기','')
      +'</div>';
    section.appendChild(wrap);
  }

  function markRightActions(section){
    if(!section)return;
    Array.prototype.forEach.call(section.children,function(el){
      if(!el||el.nodeType!==1||el.tagName!=='DIV'||!el.style)return;
      var hasLike=!!el.querySelector('#hostLikeCount');
      if(hasLike)el.classList.add('kt-three-room-right-actions');
    });
  }

  function decorateThreeRooms(){
    var video=document.getElementById('ktLiveVideo');
    var section=video&&video.closest?video.closest('section'):null;
    var target=!!section&&isTargetRoom();

    if(!section)return;
    section.classList.toggle('kt-three-room-photo',target);

    if(!target){
      var old=section.querySelector('#ktThreeRoomReferenceUi');
      if(old)old.remove();
      return;
    }

    addReferenceUi(section);
    markRightActions(section);
  }

  var oldStartBroadcast=window.startBroadcast;
  if(typeof oldStartBroadcast==='function'){
    window.startBroadcast=async function(){
      var result=await oldStartBroadcast.apply(this,arguments);
      setTimeout(decorateThreeRooms,20);
      return result;
    };
  }

  try{
    var observer=new MutationObserver(function(){decorateThreeRooms();});
    observer.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  decorateThreeRooms();
})();
