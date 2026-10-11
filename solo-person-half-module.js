/* Solo only: keep a full-size frame and composite the segmented person at 50%. */
(function(){
  if(window.ktSoloPersonHalfPrepare)return;
  var session=null,loading=null;
  var ROOT='https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1.1675465747/';
  function active(){return !!document.querySelector('#screen .ktsolo-room');}
  function load(){
    if(window.SelfieSegmentation)return Promise.resolve();
    if(loading)return loading;
    loading=new Promise(function(resolve,reject){
      var script=document.createElement('script');script.src=ROOT+'selfie_segmentation.js';
      script.onload=resolve;script.onerror=function(){loading=null;script.remove();reject(new Error('Person effect unavailable'));};
      document.head.appendChild(script);
    });return loading;
  }
  function canvas(w,h){var c=document.createElement('canvas');c.width=w;c.height=h;return c;}
  function cover(ctx,img,w,h){
    var iw=img.videoWidth||img.width,ih=img.videoHeight||img.height;
    var z=Math.max(w/iw,h/ih);ctx.drawImage(img,(w-iw*z)/2,(h-ih*z)/2,iw*z,ih*z);
  }
  function stop(s){
    if(!s||s.stopped)return;s.stopped=true;clearTimeout(s.timer);clearInterval(s.watch);
    if(window.state&&state.stream===s.output)state.stream=s.raw;
    if(s.output)s.output.getVideoTracks().forEach(function(t){t.stop();});
    if(s.output&&session===s&&window.state&&state.stream!==s.raw)s.raw.getVideoTracks().forEach(function(t){t.stop();});
    s.video.pause();s.video.srcObject=null;
    try{Promise.resolve(s.segmenter.close()).catch(function(){});}catch(e){}
    if(session===s)session=null;
  }
  function draw(s,r){
    if(s.stopped||!active())return;
    var w=s.frame.width,h=s.frame.height,c=s.frame.getContext('2d');
    var fg=s.person.getContext('2d');fg.clearRect(0,0,w,h);
    fg.globalCompositeOperation='source-over';cover(fg,r.segmentationMask,w,h);
    fg.globalCompositeOperation='source-in';cover(fg,r.image,w,h);
    fg.globalCompositeOperation='source-over';
    // Fill foreground holes using visible background pixels, never a second enlarged person.
    var tiny=s.background.getContext('2d',{willReadFrequently:true});
    tiny.clearRect(0,0,48,84);cover(tiny,r.image,48,84);
    var pixels=tiny.getImageData(0,0,48,84);
    var mask=s.mask.getContext('2d',{willReadFrequently:true});mask.clearRect(0,0,48,84);cover(mask,r.segmentationMask,48,84);
    var alpha=mask.getImageData(0,0,48,84).data;
    for(var y=0;y<84;y++){
      var known=[];for(var x=0;x<48;x++)if(alpha[(y*48+x)*4+3]<80)known.push(x);
      for(var x=0;x<48;x++)if(alpha[(y*48+x)*4+3]>=80){
        var nearest=-1,dist=99;known.forEach(function(k){if(Math.abs(k-x)<dist){dist=Math.abs(k-x);nearest=k;}});
        var i=(y*48+x)*4,j=(y*48+nearest)*4;
        for(var ch=0;ch<3;ch++)pixels.data[i+ch]=nearest<0?(s.lastBackground?s.lastBackground.data[i+ch]:32):pixels.data[j+ch];
        pixels.data[i+3]=255;
      }
    }
    s.lastBackground=pixels;tiny.putImageData(pixels,0,0);
    c.save();c.filter='blur(14px)';c.drawImage(s.background,-20,-20,w+40,h+40);c.restore();
    c.drawImage(s.person,w*.25,h*.25,w*.5,h*.5);
    s.frames++;
  }
  window.ktSoloPersonHalfPrepare=async function(){
    if(!active()||!window.state||!state.stream)return false;
    if(session&&state.stream===session.output)return true;
    var raw=state.stream,track=raw.getVideoTracks&&raw.getVideoTracks()[0];
    if(!track||track.readyState!=='live'||track.enabled===false)return false;
    var s=null;
    try{
      await Promise.race([load(),new Promise(function(_,reject){setTimeout(function(){reject(new Error('Person effect load timeout'));},12000);})]);
      if(!active()||state.stream!==raw)return false;
      var video=document.createElement('video');video.muted=true;video.playsInline=true;video.srcObject=raw;
      await video.play();
      s={raw:raw,video:video,frame:canvas(360,640),person:canvas(360,640),background:canvas(48,84),mask:canvas(48,84),frames:0,stopped:false};
      s.segmenter=new SelfieSegmentation({locateFile:function(file){return ROOT+file;}});
      s.segmenter.setOptions({modelSelection:1,selfieMode:false});s.segmenter.onResults(function(r){draw(s,r);});
      await Promise.race([s.segmenter.send({image:video}),new Promise(function(_,reject){setTimeout(function(){reject(new Error('Person effect initialization timeout'));},8000);})]);
      if(!s.frames||!active()||state.stream!==raw){stop(s);return false;}
      s.output=s.frame.captureStream(15);
      raw.getAudioTracks().forEach(function(t){s.output.addTrack(t);});
      s.output.getVideoTracks()[0].__ktFrontVerified=true;
      if(session)stop(session);session=s;state.stream=s.output;
      var v=document.querySelector('#screen .ktsolo-room #ktLiveVideo');
      if(v){v.srcObject=s.output;v.style.removeProperty('display');v.play().catch(function(){});}
      function next(){
        if(s.stopped)return;
        if(!active()||state.stream!==s.output||track.readyState!=='live'||s.output.getVideoTracks()[0].readyState!=='live'){stop(s);return;}
        Promise.resolve(s.segmenter.send({image:video})).then(function(){if(!s.stopped)s.timer=setTimeout(next,66);}).catch(function(){stop(s);if(v&&v.isConnected){v.srcObject=state.stream;v.play().catch(function(){});}});
      }
      s.watch=setInterval(function(){if(!active()||state.stream!==s.output)stop(s);},300);
      next();return true;
    }catch(e){if(s)stop(s);console.warn('Solo person effect: keeping original camera',e);return false;}
  };
})();
