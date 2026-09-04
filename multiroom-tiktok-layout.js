/* K-Talk: 13-person + subscriber room layout only. Host + guest-seat grid. */
(function(){
  if(window.__ktMultiroomTikTokLayoutLoaded)return;
  window.__ktMultiroomTikTokLayoutLoaded=true;

  function getRoomType(){
    try{return (window.state&&state.liveRoomType)||'';}catch(e){return '';}
  }
  function isTargetRoom(){
    var t=getRoomType();
    return t==='group13'||t==='subscriber';
  }

  function applyLayout(){
    if(!isTargetRoom())return;
    var video=document.getElementById('ktLiveVideo');
    if(!video)return;
    var section=video.closest('section');
    if(!section)return;

    section.style.setProperty('background','#050505','important');

    /* Host occupies the left side. No empty black side bars. */
    video.style.setProperty('position','absolute','important');
    video.style.setProperty('left','0','important');
    video.style.setProperty('right','auto','important');
    video.style.setProperty('top','200px','important');
    video.style.setProperty('bottom','145px','important');
    video.style.setProperty('width','56%','important');
    video.style.setProperty('height','auto','important');
    video.style.setProperty('object-fit','cover','important');
    video.style.setProperty('object-position','50% 50%','important');
    video.style.setProperty('transform','scaleX(-1)','important');
    video.style.setProperty('transform-origin','50% 50%','important');
    video.style.setProperty('border-radius','10px','important');
    video.style.setProperty('background','#111','important');

    var layer=document.getElementById('ktLiveEffectLayer');
    if(layer){
      layer.style.setProperty('transform','none','important');
      layer.style.setProperty('transform-origin','50% 50%','important');
    }

    var max=13;
    try{
      var m=parseInt(state.liveRoomMax,10);
      if(m>1)max=m;
      else if(getRoomType()==='subscriber')max=10;
    }catch(e){if(getRoomType()==='subscriber')max=10;}
    var slots=Math.max(1,max-1);
    var rows=Math.ceil(slots/2);

    var grid=document.getElementById('ktMultiInviteGrid');
    if(!grid){
      grid=document.createElement('div');
      grid.id='ktMultiInviteGrid';
      section.appendChild(grid);
    }
    grid.style.cssText='position:absolute;z-index:3;left:56%;right:0;top:200px;bottom:145px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat('+rows+',minmax(0,1fr));gap:4px;padding:0 5px 0 4px;overflow:hidden;pointer-events:auto';

    if(grid.dataset.slots!==String(slots)||grid.children.length!==slots){
      grid.dataset.slots=String(slots);
      grid.innerHTML='';
      for(var i=0;i<slots;i++){
        var cell=document.createElement('div');
        cell.className='kt-multi-invite-cell';
        cell.innerHTML='<span style="display:block;font-size:12px;font-weight:900;letter-spacing:-.2px">게스트석</span>';
        cell.style.cssText='min-width:0;min-height:0;border:1px solid rgba(255,255,255,.12);border-radius:8px;background:linear-gradient(180deg,#17171b,#0b0b0e);color:#f5f5f5;display:grid;place-content:center;text-align:center;padding:2px;box-shadow:inset 0 0 12px rgba(255,255,255,.025)';
        grid.appendChild(cell);
      }
    }else{
      [].slice.call(grid.children).forEach(function(cell){
        if(cell.textContent.trim()!=='게스트석'||cell.querySelector('b')){
          cell.innerHTML='<span style="display:block;font-size:12px;font-weight:900;letter-spacing:-.2px">게스트석</span>';
        }
      });
    }

    var badge=document.getElementById('ktMultiHostBadge');
    if(!badge){
      badge=document.createElement('div');
      badge.id='ktMultiHostBadge';
      badge.textContent='호스트';
      section.appendChild(badge);
    }
    badge.style.cssText='position:absolute;z-index:6;left:7px;top:207px;padding:3px 7px;border-radius:6px;background:rgba(10,10,12,.72);border:1px solid rgba(255,255,255,.45);color:#fff;font-size:11px;font-weight:900;pointer-events:none';
  }

  window.ktApplyTikTokMultiRoomLayout=applyLayout;

  try{
    var obs=new MutationObserver(function(){
      if(isTargetRoom()&&document.getElementById('ktLiveVideo'))setTimeout(applyLayout,30);
    });
    obs.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  setInterval(function(){
    if(isTargetRoom()&&document.getElementById('ktLiveVideo'))applyLayout();
  },500);
})();

/* Creator camera compact fix: only camera framing and bottom capture controls. */
(function(){
  if(window.__ktCreatorCompact0904)return;
  window.__ktCreatorCompact0904=true;

  function installStyle(){
    if(document.getElementById('ktCreatorCompact0904Style'))return;
    var st=document.createElement('style');
    st.id='ktCreatorCompact0904Style';
    st.textContent='\
#creator.creator.camera-on:not(.creator-review) video#camera{object-fit:contain!important;object-position:50% 50%!important;background:#000!important;}\
#creator .creator-bottom{padding:0 12px calc(12px + env(safe-area-inset-bottom))!important;}\
#creator .creator-bottom .modes{gap:12px!important;margin-bottom:10px!important;}\
#creator .creator-bottom .modes span{font-size:14px!important;padding:4px 3px!important;line-height:1!important;}\
#creator .creator-bottom .modes .on{padding:6px 11px!important;}\
#creator .creator-bottom .recordrow{gap:18px!important;margin-bottom:10px!important;}\
#creator .creator-bottom .record{width:78px!important;height:78px!important;border-width:5px!important;font-size:0!important;}\
#creator .creator-bottom .fx{width:48px!important;height:48px!important;font-size:21px!important;}\
#creator .creator-bottom .fx small{font-size:9px!important;}\
#creator .creator-bottom .creator-foot{font-size:13px!important;margin-top:0!important;}\
#creator .creator-bottom .creator-foot span{padding:3px 6px!important;}\
#creator .kt-creator-room-shortcuts{width:min(90%,330px)!important;gap:4px!important;margin-bottom:5px!important;}\
#creator .kt-creator-room-shortcuts button{height:26px!important;font-size:9px!important;border-radius:8px!important;}';
    document.head.appendChild(st);
  }

  function fixModes(){
    try{
      var creator=document.getElementById('creator');
      if(!creator)return;
      var spans=creator.querySelectorAll('.creator-bottom .modes span');
      if(spans&&spans[0]){
        spans[0].textContent='10초';
        spans[0].onclick=function(){
          if(window.selectCreatorDuration)window.selectCreatorDuration(this,10000);
          else if(window.setCreatorDuration)window.setCreatorDuration(this,10);
        };
      }
    }catch(e){}
  }

  function applyCamera(){
    try{
      var creator=document.getElementById('creator');
      var cam=document.getElementById('camera');
      if(!creator||!cam||!creator.classList.contains('camera-on')||creator.classList.contains('creator-review'))return;
      cam.style.setProperty('object-fit','contain','important');
      cam.style.setProperty('object-position','50% 50%','important');
      cam.style.setProperty('background','#000','important');
    }catch(e){}
  }

  installStyle();
  fixModes();
  applyCamera();
  try{
    var ob=new MutationObserver(function(){fixModes();applyCamera();});
    ob.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
  setInterval(function(){fixModes();applyCamera();},700);
})();