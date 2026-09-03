(function(){
  var testMessages=[];

  function stopLocalStream(){
    try{
      if(window.state && state.stream){
        state.stream.getTracks().forEach(function(track){track.stop();});
        state.stream=null;
      }
      if(window.camera)camera.srcObject=null;
    }catch(e){}
  }

  function renderMessages(){
    var box=document.getElementById('ktTestChatList');
    if(!box)return;
    box.innerHTML=testMessages.map(function(m){
      return '<div style="margin:5px 0;padding:7px 9px;border-radius:12px;background:#ffffff12;color:#fff;font-size:13px"><b style="color:#ffdc70">'+m.name+'</b> '+m.text+'</div>';
    }).join('');
    box.scrollTop=box.scrollHeight;
  }

  var testFaceTimer=null;
  var testFaceDetector=null;

  /* AI 보정만 자연스럽게 조정합니다. 다른 화면/기능은 건드리지 않습니다. */
  window.getBeautyControlInfo=function(kind){
    var map={
      skin:{label:'피부 부드러움',key:'beautySkin',def:56},
      face:{label:'얼굴형 조절',key:'beautyFace',def:50},
      eyes:{label:'눈 조절',key:'beautyEyes',def:50},
      nose:{label:'코 조절',key:'beautyNose',def:50},
      mouth:{label:'턱선 조절',key:'beautyMouth',def:50}
    };
    return map[kind]||map.skin;
  };

  window.applyBeautyPreview=function(){
    if(!window.camera)return;
    var skin=Math.max(1,Math.min(100,Number(state.beautySkin||56)));
    var bright=Math.max(1,Math.min(100,Number(state.beautyBright||60)));
    var sharp=Math.max(1,Math.min(100,Number(state.beautySharp||52)));
    var face=Math.max(1,Math.min(100,Number(state.beautyFace||50)));
    var eyes=Math.max(1,Math.min(100,Number(state.beautyEyes||50)));
    var nose=Math.max(1,Math.min(100,Number(state.beautyNose||50)));
    var mouth=Math.max(1,Math.min(100,Number(state.beautyMouth||50)));
    var tone=Math.max(1,Math.min(100,Number(state.beautyTone||54)));

    var brightness=.995+(bright*.00115)+(eyes-50)*.00025;
    var saturation=.99+(sharp*.00055)+(mouth-50)*.00045;
    var contrast=.975+(sharp*.00042)+(nose-50)*.00022;
    var blur=Math.max(0,(skin-38)*.0022);
    var sepia=Math.max(0,(tone-50)*.0007);
    var faceScale=1+(face-50)*.00045;

    camera.style.setProperty(
      'filter',
      'brightness('+brightness.toFixed(3)+') saturate('+saturation.toFixed(3)+') contrast('+contrast.toFixed(3)+') blur('+blur.toFixed(2)+'px) sepia('+sepia.toFixed(3)+')',
      'important'
    );
    camera.style.setProperty('transform','scaleX(-1) scale('+faceScale.toFixed(3)+')','important');
  };

  window.applyAIBeautyPreset=async function(){
    if(!window.camera)return;
    try{if(window.ensureLiveCamera)await ensureLiveCamera(state.cameraFacing||'user');}catch(e){}

    var targetBright=60,targetSkin=56,targetSharp=52,targetTone=54;
    try{
      var engine=window.ktLoadFaceDetector?await ktLoadFaceDetector():null;
      if(engine&&camera.readyState>=2&&camera.videoWidth){
        var box=null;
        if(engine.type==='mediapipe'){
          var result=engine.detector.detectForVideo(camera,Math.round(performance.now()));
          if(result&&result.detections&&result.detections.length)box=result.detections[0].boundingBox;
        }else{
          var faces=await engine.detector.detect(camera);
          if(faces&&faces.length)box=faces[0].boundingBox;
        }

        var c=document.createElement('canvas');
        c.width=160;c.height=90;
        var ctx=c.getContext('2d',{willReadFrequently:true});
        ctx.drawImage(camera,0,0,c.width,c.height);
        var sx=45,sy=18,sw=70,sh=54;
        if(box&&camera.videoWidth&&camera.videoHeight){
          sx=Math.max(0,Math.min(c.width-1,Math.round((box.originX!=null?box.originX:box.x||0)/camera.videoWidth*c.width)));
          sy=Math.max(0,Math.min(c.height-1,Math.round((box.originY!=null?box.originY:box.y||0)/camera.videoHeight*c.height)));
          sw=Math.max(12,Math.min(c.width-sx,Math.round((box.width||camera.videoWidth*.4)/camera.videoWidth*c.width)));
          sh=Math.max(12,Math.min(c.height-sy,Math.round((box.height||camera.videoHeight*.5)/camera.videoHeight*c.height)));
        }
        var data=ctx.getImageData(sx,sy,sw,sh).data;
        var lum=0,sat=0,count=0;
        for(var p=0;p<data.length;p+=16){
          var r=data[p],g=data[p+1],b=data[p+2];
          var mx=Math.max(r,g,b),mn=Math.min(r,g,b);
          lum+=(r*.2126+g*.7152+b*.0722);
          sat+=(mx-mn);
          count++;
        }
        if(count){
          lum/=count;sat/=count;
          targetBright=Math.round(Math.max(54,Math.min(68,60+(138-lum)*.10)));
          targetSkin=Math.round(Math.max(48,Math.min(62,56+(128-lum)*.025)));
          targetSharp=Math.round(Math.max(48,Math.min(58,52+(25-sat)*.04)));
          targetTone=Math.round(Math.max(50,Math.min(58,54+(20-sat)*.025)));
        }
      }
    }catch(e){}

    state.beautyMode='natural';
    state.beautyControl='skin';
    state.beautySkin=targetSkin;
    state.beautyFace=50;
    state.beautyEyes=50;
    state.beautyNose=50;
    state.beautyMouth=50;
    state.beautyTone=targetTone;
    state.beautyBright=targetBright;
    state.beautySharp=targetSharp;
    applyBeautyPreview();

    var range=document.getElementById('beautySingleRange');
    var val=document.getElementById('beautySingleValue');
    var label=document.getElementById('beautySingleLabel');
    if(range)range.value=targetSkin;
    if(val)val.textContent=targetSkin;
    if(label)label.textContent='피부 부드러움';
    document.querySelectorAll('.kt-beauty-controls-pro button').forEach(function(btn){
      btn.classList.toggle('on',btn.getAttribute('data-beauty-kind')==='skin');
    });
  };

  window.resetBeautyAll=function(){
    state.beautyMode='off';
    state.beautyControl='skin';
    state.beautySkin=1;
    state.beautyFace=50;
    state.beautyEyes=50;
    state.beautyNose=50;
    state.beautyMouth=50;
    state.beautyTone=50;
    state.beautyBright=1;
    state.beautySharp=1;
    try{
      creator.classList.remove('beauty-natural','beauty-bright','beauty-soft','beauty-glow');
      creator.removeAttribute('data-beauty-char');
    }catch(e){}
    if(window.camera){camera.style.removeProperty('filter');camera.style.removeProperty('transform');}
    if(window.openBeautyPanel)openBeautyPanel();
  };

  function testEffectMarkup(name){
    var markup={
      mustache:'<div class="fx-mustache-mask"><span>〰</span></div>',
      beard:'<div class="fx-beard-mask"><span>〰</span><b></b></div>',
      crown:'<div class="fx-crown-mask">👑</div>',
      blush:'<div class="fx-cheek-mask blush"><i></i><i></i></div>',
      heart:'<div class="fx-cheek-mask heart"><i>♥</i><i>♥</i></div>',
      sparkle:'<div class="fx-sparkles-mask"><span>✦</span><span>✧</span><span>✦</span><span>✧</span></div>',
      tears:'<div class="fx-tears-mask"><i></i><i></i></div>',
      flower:'<div style="position:absolute;left:50%;top:-5%;transform:translate(-50%,-50%);font-size:52px;white-space:nowrap">🌸🌼🌸</div>',
      party:'<div style="position:absolute;left:50%;top:0;transform:translate(-50%,-50%);font-size:52px;white-space:nowrap">🎉🥳🎊</div>',
      fire:'<div class="fx-fire-mask">🔥🔥🔥</div>',
      facepaint:'<div class="fx-facepaint-mask"><i></i><i></i></div>',
      mask:'<div class="fx-eye-mask"></div>',
      butterfly:'<div class="fx-butterfly-mask"><span>🦋</span><span>🦋</span></div>'
    };
    return markup[name]||'';
  }

  function applyTestVideoFilter(name){
    var v=document.getElementById('ktTestVideo');
    if(!v)return;

    var bright=58,sharp=52,skin=54;
    try{
      if(window.state){
        bright=Math.max(1,Math.min(100,Number(state.beautyBright||58)));
        sharp=Math.max(1,Math.min(100,Number(state.beautySharp||52)));
        skin=Math.max(1,Math.min(100,Number(state.beautySkin||54)));
      }
    }catch(e){}

    var brightness=.99+(bright*.0014);
    var saturation=.99+(sharp*.00065);
    var contrast=.97+(sharp*.0005);
    var blur=Math.max(0,(skin-35)*.0027);
    var base='brightness('+brightness.toFixed(3)+') contrast('+contrast.toFixed(3)+') saturate('+saturation.toFixed(3)+') blur('+blur.toFixed(2)+'px)';

    if(name==='mono')v.style.filter='grayscale(1) contrast(1.03) brightness(1.04)';
    else if(name==='warm')v.style.filter=base+' sepia(.08) saturate(1.05)';
    else if(name==='cool')v.style.filter=base+' saturate(.98) hue-rotate(3deg)';
    else if(name==='soft')v.style.filter=base;
    else if(name==='studio')v.style.filter='brightness('+(brightness+.025).toFixed(3)+') contrast('+contrast.toFixed(3)+') saturate('+saturation.toFixed(3)+') blur('+Math.min(.22,blur+.03).toFixed(2)+'px)';
    else if(name==='night')v.style.filter='brightness(.92) contrast(1.02) saturate(.94)';
    else v.style.filter=base;
  }

  function placeTestFaceFallback(){
    var layer=document.getElementById('ktTestEffectLayer');
    var anchor=document.getElementById('ktTestFaceAnchor');
    var v=document.getElementById('ktTestVideo');
    if(!layer||!anchor||!v)return;
    var lr=layer.getBoundingClientRect();
    var vr=v.getBoundingClientRect();
    var w=Math.min(vr.width*.44,220);
    var h=w*1.18;
    anchor.style.left=((vr.left-lr.left)+(vr.width*.50))+'px';
    anchor.style.top=((vr.top-lr.top)+(vr.height*.40))+'px';
    anchor.style.width=w+'px';
    anchor.style.height=h+'px';
  }

  async function trackTestFaceOnce(){
    var v=document.getElementById('ktTestVideo');
    var layer=document.getElementById('ktTestEffectLayer');
    var anchor=document.getElementById('ktTestFaceAnchor');
    if(!v||!layer||!anchor||!v.videoWidth||!v.videoHeight){placeTestFaceFallback();return;}
    if(!('FaceDetector' in window)){placeTestFaceFallback();return;}
    try{
      if(!testFaceDetector)testFaceDetector=new FaceDetector({fastMode:true,maxDetectedFaces:1});
      var faces=await testFaceDetector.detect(v);
      if(!faces||!faces.length){placeTestFaceFallback();return;}
      var box=faces[0].boundingBox;
      var lr=layer.getBoundingClientRect();
      var vr=v.getBoundingClientRect();
      var scale=Math.max(vr.width/v.videoWidth,vr.height/v.videoHeight);
      var drawW=v.videoWidth*scale,drawH=v.videoHeight*scale;
      var offX=(vr.width-drawW)/2,offY=(vr.height-drawH)/2;
      var bw=box.width*scale,bh=box.height*scale;
      var bx=offX+(box.x*scale);
      bx=vr.width-offX-((box.x+box.width)*scale);
      var by=offY+(box.y*scale);
      anchor.style.left=((vr.left-lr.left)+bx+(bw/2))+'px';
      anchor.style.top=((vr.top-lr.top)+by+(bh/2))+'px';
      anchor.style.width=Math.max(120,bw)+'px';
      anchor.style.height=Math.max(145,bh)+'px';
    }catch(e){placeTestFaceFallback();}
  }

  function applySelectedEffectToTest(){
    var name=(window.state&&(state.appliedEditEffect||state.pendingEditEffect))||'off';
    if(['sunglasses','glasses','cap','pirate','cat','dog','puppy','rabbit','bunny','halo','angel'].indexOf(name)>-1)name='off';
    var anchor=document.getElementById('ktTestFaceAnchor');
    var layer=document.getElementById('ktTestEffectLayer');
    var v=document.getElementById('ktTestVideo');
    if(anchor)anchor.innerHTML=testEffectMarkup(name);
    applyTestVideoFilter(name);
    clearInterval(testFaceTimer);
    testFaceTimer=null;
    try{if(window.ktStopFaceTrackingFor)ktStopFaceTrackingFor('test-live');}catch(e){}
    if(name!=='off'&&['mono','warm','cool','soft'].indexOf(name)===-1){
      if(window.ktStartFaceTrackingFor&&v&&layer&&anchor){
        ktStartFaceTrackingFor(v,layer,anchor,'test-live');
      }else{
        trackTestFaceOnce();
        testFaceTimer=setInterval(trackTestFaceOnce,150);
      }
    }
  }

  window.sendTestChat=function(){
    var input=document.getElementById('ktTestChatInput');
    if(!input)return;
    var text=input.value.trim();
    if(!text)return;
    testMessages.push({name:'나',text:text});
    input.value='';
    renderMessages();
  };

  window.toggleTestMic=function(btn){
    try{
      var tracks=state.stream?state.stream.getAudioTracks():[];
      if(!tracks.length)return;
      tracks.forEach(function(t){t.enabled=!t.enabled;});
      btn.textContent=tracks[0].enabled?'🎤 마이크':'🔇 음소거';
    }catch(e){}
  };

  window.toggleTestCamera=function(btn){
    try{
      var tracks=state.stream?state.stream.getVideoTracks():[];
      if(!tracks.length)return;
      tracks.forEach(function(t){t.enabled=!t.enabled;});
      btn.textContent=tracks[0].enabled?'📷 카메라':'🚫 카메라';
    }catch(e){}
  };

  window.endTestBroadcast=function(){
    try{if(window.ktStopFaceTrackingFor)ktStopFaceTrackingFor('test-live');}catch(e){}
    clearInterval(testFaceTimer);
    testFaceTimer=null;
    stopLocalStream();
    testMessages=[];
    if(window.home)window.home();
  };

  window.startTestBroadcast=async function(){
    var titleEl=document.getElementById('liveTitle');
    var title=titleEl&&titleEl.value?titleEl.value:'K-Talk 테스트 방송';
    var ok=true;
    if(window.ensureLiveCamera){
      ok=await window.ensureLiveCamera((window.state&&state.cameraFacing)||'user');
    }

    if(window.creator)creator.classList.remove('show');
    document.body.classList.remove('kt-home');

    testMessages=[
      {name:'K-Talk',text:'테스트 방송방입니다. 실제 외부 송출은 되지 않습니다.'},
      {name:'시청자1',text:'채팅 화면 확인 중입니다.'}
    ];

    screen.innerHTML='<section style="height:100dvh;min-height:620px;position:relative;overflow:hidden;background:#050309;color:#fff">'
      +'<div style="position:absolute;inset:0;background:radial-gradient(circle at 25% 20%,#4c124f55,transparent 32%),radial-gradient(circle at 80% 30%,#0f497755,transparent 30%),#050309"></div>'
      +'<video id="ktTestVideo" autoplay playsinline muted style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;background:#09070d;transform:scaleX(-1)"></video>'
      +'<div style="position:absolute;inset:0;background:linear-gradient(180deg,#00000055,transparent 35%,#00000022 58%,#000000dd 100%);pointer-events:none"></div>'
      +'<div id="ktTestEffectLayer" style="position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden"><div id="ktTestFaceAnchor" class="kt-face-anchor"></div></div>'
      +'<div style="position:absolute;left:12px;right:12px;top:12px;z-index:3;display:flex;align-items:center;gap:8px">'
      +'<span style="padding:7px 10px;border-radius:999px;background:#ff315f;font-size:12px;font-weight:950">● TEST LIVE</span>'
      +'<div style="min-width:0;flex:1"><b style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+title.replace(/</g,'&lt;')+'</b><small style="color:#ddd">외부 송출 없음 · 내 화면 테스트</small></div>'
      +'<button onclick="endTestBroadcast()" style="width:40px;height:40px;border-radius:50%;border:1px solid #ffffff44;background:#111a;color:#fff;font-size:20px">×</button>'
      +'</div>'
      +'<div style="position:absolute;right:10px;bottom:118px;z-index:4;display:grid;gap:9px">'
      +'<button onclick="openGifts()" style="width:52px;height:52px;border-radius:50%;border:1px solid #ffd65a88;background:#2b1c08dd;color:#fff;font-size:22px">🎁</button>'
      +'<button onclick="toggleTestMic(this)" style="width:52px;height:52px;border-radius:50%;border:1px solid #ffffff38;background:#09090ddd;color:#fff;font-size:12px;font-weight:900">🎤 마이크</button>'
      +'<button onclick="toggleTestCamera(this)" style="width:52px;height:52px;border-radius:50%;border:1px solid #ffffff38;background:#09090ddd;color:#fff;font-size:12px;font-weight:900">📷 카메라</button>'
      +'</div>'
      +'<div style="position:absolute;left:10px;right:72px;bottom:78px;z-index:4">'
      +'<div id="ktTestChatList" style="max-height:155px;overflow:auto;padding-right:3px"></div>'
      +'</div>'
      +'<div style="position:absolute;left:10px;right:10px;bottom:14px;z-index:5;display:flex;gap:8px;align-items:center">'
      +'<input id="ktTestChatInput" onkeydown="if(event.key===\'Enter\')sendTestChat()" placeholder="테스트 채팅 입력" style="flex:1;min-width:0;height:48px;border-radius:24px;border:1px solid #ffffff33;background:#0c0b10dd;color:#fff;padding:0 16px;outline:0;font-size:14px">'
      +'<button onclick="sendTestChat()" style="height:48px;padding:0 18px;border:0;border-radius:24px;background:linear-gradient(135deg,#ff3f8f,#875dff);color:#fff;font-weight:950">전송</button>'
      +'<button onclick="endTestBroadcast()" style="height:48px;padding:0 14px;border:0;border-radius:24px;background:#e02d4c;color:#fff;font-weight:950">종료</button>'
      +'</div>'
      +'</section>';

    var video=document.getElementById('ktTestVideo');
    if(ok && video && window.state && state.stream){
      video.srcObject=state.stream;
      try{await video.play();}catch(e){}
      applySelectedEffectToTest();
    }else if(video){
      video.style.display='none';
      var fallback=document.createElement('div');
      fallback.style.cssText='position:absolute;inset:0;display:grid;place-items:center;text-align:center;color:#fff;background:radial-gradient(circle,#51245f,#111018 58%,#060608);font-size:18px;font-weight:900';
      fallback.innerHTML='📷<br><span style="font-size:14px;color:#ddd">카메라 권한이 없으면 이 배경으로 테스트합니다.</span>';
      video.parentNode.insertBefore(fallback,video.nextSibling);
    }
    renderMessages();
  };
})();
