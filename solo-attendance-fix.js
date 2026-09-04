/* K-Talk: add the same attendance-check control to the mobile 1-person host screen only. */
(function(){
  if(window.__ktSoloAttendanceFixLoaded)return;
  window.__ktSoloAttendanceFixLoaded=true;

  function isSolo(){
    try{
      return !!document.getElementById('ktSoloHostLive') && !!window.state && (state.liveRoomType==='solo' || state.liveRoomName==='1인 방송');
    }catch(e){return false;}
  }

  function addSoloAttendance(){
    if(!isSolo())return;
    var host=document.getElementById('ktSoloHostLive');
    if(!host || document.getElementById('ktSoloAttendance'))return;

    var btn=document.createElement('button');
    btn.id='ktSoloAttendance';
    btn.className='kt-live-attendance';
    btn.type='button';
    btn.setAttribute('aria-label','출석체크');
    btn.innerHTML='<span class="wing">🪽</span><span class="badge">출석체크 <span class="heart">♥</span></span><span class="wing">🪽</span>';
    btn.onclick=function(){
      try{if(window.openAttendanceBenefits)window.openAttendanceBenefits();}catch(e){}
    };
    host.appendChild(btn);
  }

  try{
    var obs=new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        for(var j=0;j<muts[i].addedNodes.length;j++){
          var n=muts[i].addedNodes[j];
          if(n && n.nodeType===1 && (n.id==='ktSoloHostLive' || (n.querySelector && n.querySelector('#ktSoloHostLive')))){
            setTimeout(addSoloAttendance,30);
            return;
          }
        }
      }
    });
    obs.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  setTimeout(addSoloAttendance,50);
})();
