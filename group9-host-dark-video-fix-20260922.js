/* K-Talk 9명방 호스트 어두운 영상 보정 (2026-09-22)
   9명방 호스트 영상 표시만 조정.
   카메라 스트림/촬영화면/게스트/채팅/수익률/버튼은 변경하지 않음. */
(function(){
  if(window.__ktGroup9HostDarkVideoFix20260922)return;
  window.__ktGroup9HostDarkVideoFix20260922=true;

  var seen=new WeakMap();

  function isNineHostVideo(v){
    try{return !!(v&&v.matches&&v.matches('#screen .ktg13-room[data-kt-room="9"] .ktg13-host > video'));}catch(e){return false;}
  }

  function chooseBrightness(lum){
    if(lum<42)return 1.80;
    if(lum<58)return 1.60;
    if(lum<76)return 1.42;
    if(lum<94)return 1.25;
    if(lum<112)return 1.14;
    return 1.08;
  }

  function sampleOnce(v){
    if(!isNineHostVideo(v)||!v.videoWidth||!v.videoHeight)return;
    var stream=v.srcObject||null;
    if(seen.get(v)===stream)return;

    try{
      var cv=document.createElement('canvas');
      cv.width=32;cv.height=18;
      var cx=cv.getContext('2d',{willReadFrequently:true});
      cx.drawImage(v,0,0,32,18);
      var d=cx.getImageData(0,0,32,18).data;
      var sum=0,n=0;
      for(var i=0;i<d.length;i+=16){
        sum+=(d[i]*0.2126+d[i+1]*0.7152+d[i+2]*0.0722);
        n++;
      }
      var lum=n?sum/n:100;
      var b=chooseBrightness(lum);
      var filter='brightness('+b.toFixed(2)+') contrast(.96) saturate(1.03)';
      v.style.setProperty('filter',filter,'important');
      v.style.setProperty('-webkit-filter',filter,'important');
      v.style.setProperty('opacity','1','important');
      v.style.setProperty('visibility','visible','important');
      v.style.setProperty('background','#101114','important');
      seen.set(v,stream);
    }catch(e){
      v.style.setProperty('filter','brightness(1.35) contrast(.96) saturate(1.03)','important');
      v.style.setProperty('-webkit-filter','brightness(1.35) contrast(.96) saturate(1.03)','important');
      seen.set(v,stream);
    }
  }

  function tune(v){
    if(!isNineHostVideo(v))return;
    var run=function(){setTimeout(function(){sampleOnce(v);},320);};
    if(v.readyState>=2)run();
    else{
      v.addEventListener('loadeddata',run,{once:true});
      v.addEventListener('playing',run,{once:true});
    }
  }

  function scan(){
    document.querySelectorAll('#screen .ktg13-room[data-kt-room="9"] .ktg13-host > video').forEach(tune);
  }

  scan();
  [100,350,800,1500].forEach(function(ms){setTimeout(scan,ms);});

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGroup9HostDarkVideoTimer20260922);
      window.__ktGroup9HostDarkVideoTimer20260922=setTimeout(scan,40);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['data-kt-room']});
  }catch(e){}
})();