/* K-Talk: 13-person + subscriber room layout only. TikTok-style host + invite grid. */
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

    if(grid.dataset.slots!==String(slots)){
      grid.dataset.slots=String(slots);
      grid.innerHTML='';
      for(var i=0;i<slots;i++){
        var cell=document.createElement('div');
        cell.className='kt-multi-invite-cell';
        cell.innerHTML='<b style="font-size:28px;line-height:1">＋</b><span style="display:block;margin-top:2px;font-size:12px;font-weight:900">초대</span>';
        cell.style.cssText='min-width:0;min-height:0;border:1px solid rgba(255,255,255,.12);border-radius:8px;background:linear-gradient(180deg,#17171b,#0b0b0e);color:#f5f5f5;display:grid;place-content:center;text-align:center;padding:2px;box-shadow:inset 0 0 12px rgba(255,255,255,.025)';
        grid.appendChild(cell);
      }
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
