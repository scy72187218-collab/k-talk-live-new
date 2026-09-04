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
    var isGroup13=getRoomType()==='group13';
    var roomTop=isGroup13?'40px':'200px';
    video.style.setProperty('position','absolute','important');
    video.style.setProperty('left','0','important');
    video.style.setProperty('right','auto','important');
    video.style.setProperty('top',roomTop,'important');
    video.style.setProperty('bottom','145px','important');
    video.style.setProperty('width','56%','important');
    video.style.setProperty('height',isGroup13?'calc(100% - 185px)':'auto','important');
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
    if(!isGroup13){
      try{
        var m=parseInt(state.liveRoomMax,10);
        if(m>1)max=m;
        else if(getRoomType()==='subscriber')max=10;
      }catch(e){if(getRoomType()==='subscriber')max=10;}
    }
    var slots=Math.max(1,max-1);
    var rows=Math.ceil(slots/2);

    var grid=document.getElementById('ktMultiInviteGrid');
    if(!grid){
      grid=document.createElement('div');
      grid.id='ktMultiInviteGrid';
      section.appendChild(grid);
    }
    grid.style.cssText='position:absolute;z-index:3;left:56%;right:0;top:'+roomTop+';bottom:145px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat('+rows+',minmax(0,1fr));gap:4px;padding:0 5px 0 4px;overflow:hidden;pointer-events:auto';

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
    badge.style.cssText='position:absolute;z-index:6;left:7px;top:'+(isGroup13?'47px':'207px')+';padding:3px 7px;border-radius:6px;background:rgba(10,10,12,.72);border:1px solid rgba(255,255,255,.45);color:#fff;font-size:11px;font-weight:900;pointer-events:none';
  }

  window.ktApplyTikTokMultiRoomLayout=applyLayout;

  var lastAppliedVideo=null;
  function applyForNewVideo(){
    if(!isTargetRoom())return;
    var v=document.getElementById('ktLiveVideo');
    if(!v||v===lastAppliedVideo)return;
    lastAppliedVideo=v;
    setTimeout(function(){
      if(v===document.getElementById('ktLiveVideo'))applyLayout();
    },30);
  }

  try{
    var obs=new MutationObserver(applyForNewVideo);
    obs.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  applyForNewVideo();
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

/* Subscriber-only host settings: custom room title + support account. General members are locked. */
(function(){
  if(window.__ktSubscriberHostSettingsLoaded)return;
  window.__ktSubscriberHostSettingsLoaded=true;

  function isSubscriber(){
    try{
      if(localStorage.getItem('ktalk_member_type')==='subscriber')return true;
    }catch(e){}
    try{
      if(window.state&&(state.memberType==='subscriber'||state.subscribed===true||state.subscriptionActive===true))return true;
    }catch(e){}
    return false;
  }

  function accountKey(){
    var id='guest';
    try{id=(window.state&&(state.profileId||state.currentAccountId||state.accountId))||id;}catch(e){}
    try{id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    return 'ktalk_host_support_account_'+String(id).replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,80);
  }

  function defaultRoomTitle(){
    try{return String((window.state&&state.liveRoomName)||'1인 방송');}catch(e){return '1인 방송';}
  }

  function ensureSupportField(){
    var title=document.getElementById('liveTitle');
    if(!title)return;
    var prep=title.closest('.live-prep');
    if(!prep)return;
    var topic=title.closest('.prep-topic')||title.parentElement;
    var sub=isSubscriber();
    var box=document.getElementById('ktSubscriberSupportAccount');
    var note=document.getElementById('ktGeneralHostLockedNote');

    if(sub){
      title.readOnly=false;
      title.disabled=false;
      title.style.removeProperty('opacity');
      title.style.removeProperty('cursor');
      title.placeholder='내 방송 제목을 입력하세요';
      if(note)note.remove();
      if(!box){
        box=document.createElement('div');
        box.id='ktSubscriberSupportAccount';
        box.style.cssText='margin:8px 4px 0;padding:9px 11px;border-radius:16px;background:rgba(14,14,20,.52);border:1px solid rgba(255,216,90,.35)';
        box.innerHTML='<label for="ktHostSupportAccount" style="display:block;margin-bottom:5px;color:#ffd85a;font-size:12px;font-weight:900">구독자 전용 · 후원 계좌</label><input id="ktHostSupportAccount" type="text" maxlength="60" autocomplete="off" placeholder="은행명 / 계좌번호 / 예금주" style="width:100%;padding:9px 11px;border-radius:12px;border:1px solid rgba(255,255,255,.12);outline:0;background:rgba(255,255,255,.08);color:#fff;font-size:14px;font-weight:800">';
        if(topic&&topic.parentNode)topic.parentNode.insertBefore(box,topic.nextSibling);
      }
      var inp=document.getElementById('ktHostSupportAccount');
      if(inp&&!inp.dataset.loaded){
        inp.dataset.loaded='1';
        try{inp.value=localStorage.getItem(accountKey())||'';}catch(e){}
        inp.addEventListener('input',function(){try{localStorage.setItem(accountKey(),String(inp.value||'').slice(0,60));}catch(e){}});
      }
      if(box)box.style.display='block';
    }else{
      title.readOnly=true;
      title.disabled=false;
      title.style.setProperty('opacity','.72');
      title.style.setProperty('cursor','not-allowed');
      title.value=defaultRoomTitle();
      if(box)box.style.display='none';
      if(!note){
        note=document.createElement('div');
        note.id='ktGeneralHostLockedNote';
        note.textContent='방 제목 · 후원 계좌 등록은 구독자만 이용할 수 있습니다.';
        note.style.cssText='margin:7px 4px 0;padding:8px 10px;border-radius:12px;background:rgba(255,255,255,.07);color:#e0e0e5;font-size:11px;font-weight:800;text-align:center';
        if(topic&&topic.parentNode)topic.parentNode.insertBefore(note,topic.nextSibling);
      }
    }
  }

  function prepareBeforeLiveStart(){
    var title=document.getElementById('liveTitle');
    if(!title)return;
    if(!isSubscriber()){
      var def=defaultRoomTitle();
      title.value=def;
      try{if(window.state){state.currentLiveRoomTitle=def;state.liveHostSupportAccount='';}}catch(e){}
      return;
    }

    var raw=String(title.value||'').trim();
    if(!raw||raw==='오늘 라이브 제목을 입력하세요')raw=defaultRoomTitle();
    raw=raw.split(' · 후원계좌 ')[0].trim();
    var bank='';
    var inp=document.getElementById('ktHostSupportAccount');
    if(inp)bank=String(inp.value||'').trim().slice(0,60);
    try{if(bank)localStorage.setItem(accountKey(),bank);}catch(e){}
    var published=bank?(raw+' · 후원계좌 '+bank):raw;
    title.value=published;
    try{if(window.state){state.currentLiveRoomTitle=published;state.liveHostSupportAccount=bank;}}catch(e){}
  }

  document.addEventListener('click',function(e){
    var t=e.target;
    if(t&&t.closest&&t.closest('.prep-start'))prepareBeforeLiveStart();
  },true);

  document.addEventListener('focusin',function(e){
    if(e.target&&e.target.id==='liveTitle'&&!isSubscriber()){
      try{e.target.blur();}catch(_e){}
      ensureSupportField();
    }
  },true);

  ensureSupportField();
  try{
    new MutationObserver(function(){setTimeout(ensureSupportField,0);}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
  setInterval(ensureSupportField,800);
})();

/* Stop ordinary video/music immediately when the user leaves the video page. LIVE/camera streams are not touched. */
(function(){
  if(window.__ktStopMediaOnPageChangeLoaded)return;
  window.__ktStopMediaOnPageChangeLoaded=true;

  function stopPlayback(){
    try{
      if(typeof window.ktStopBackgroundMedia==='function'&&!document.getElementById('ktLiveVideo')&&!document.getElementById('ktRemoteLive')){
        window.ktStopBackgroundMedia();
        return;
      }
    }catch(e){}
    try{
      document.querySelectorAll('video,audio').forEach(function(m){
        if(m.id==='camera'||m.id==='cameraBg'||m.id==='ktLiveVideo'||m.id==='ktRemoteLive')return;
        try{m.pause();m.muted=true;m.volume=0;}catch(e){}
      });
    }catch(e){}
  }

  window.ktStopPagePlayback=stopPlayback;

  function wrap(name){
    var fn=window[name];
    if(typeof fn!=='function'||fn.__ktStopsPageMedia)return;
    function wrapped(){
      stopPlayback();
      return fn.apply(this,arguments);
    }
    wrapped.__ktStopsPageMedia=true;
    wrapped.__ktOriginal=fn;
    window[name]=wrapped;
  }

  function install(){
    ['home','media','friends','openDashboard','openBroadcastList','openProfile','openCreator','openLiveRoom','openRoomPrep','quickStartBroadcast','ktJoinLive'].forEach(wrap);
  }

  document.addEventListener('click',function(e){
    try{
      var el=e.target&&e.target.closest?e.target.closest('button,[data-tab]'):null;
      if(!el)return;
      if(el.closest('.bottom,.kt-bottom')){stopPlayback();return;}
      var oc=el.getAttribute('onclick')||'';
      if(/\b(home|media|friends|openDashboard|openBroadcastList|openProfile|openCreator|openLiveRoom|openRoomPrep|quickStartBroadcast|ktJoinLive)\s*\(/.test(oc))stopPlayback();
    }catch(err){}
  },true);

  window.addEventListener('popstate',stopPlayback);
  install();
  setTimeout(install,120);
  setInterval(install,1200);
})();

/* Fan club page: keep the existing fan list and show all fan-club benefits in the same page. */
(function(){
  if(window.__ktFanClubBenefitsFullLoaded)return;
  window.__ktFanClubBenefitsFullLoaded=true;

  function install(){
    if(typeof window.showSheet!=='function')return;

    window.openSubs=function(){
      var html='<div class="kt-fanclub">'
        +'<div class="kt-fan-head"><div><b>👑 K-Talk 팬클럽</b><span>내 방송을 응원하는 팬 모임</span></div><button onclick="openFanHelp()">?</button></div>'
        +'<div class="kt-fan-stats">'
          +'<div><b>0</b><span>팬</span></div>'
          +'<div><b>0</b><span>응원</span></div>'
          +'<div><b>0</b><span>슈퍼팬</span></div>'
        +'</div>'
        +'<button class="kt-fan-grow" onclick="openFanGrow()"><span>🌱</span><div><b>팬클럽 성장하기</b><small>방송 참여와 응원 활동으로 팬클럽을 키워보세요</small></div><em>›</em></button>'
        +'<div style="margin:15px 0 8px;font-size:17px;font-weight:950;color:#ffd85a">🎁 팬클럽 혜택</div>'
        +'<div style="display:grid;gap:8px">'
          +'<div class="rowbox"><b>👥 팬 자동 모아보기</b><br>내 방송을 자주 보고 응원하는 팬을 한곳에서 확인할 수 있습니다.</div>'
          +'<div class="rowbox"><b>💛 응원 활동 확인</b><br>방송 참여와 응원 활동이 팬클럽 성장에 반영되도록 안내합니다.</div>'
          +'<div class="rowbox"><b>👑 팬 등급 관리</b><br>팬 · 열성팬 · 슈퍼팬처럼 활동에 따라 팬 등급을 구분해 관리할 수 있습니다.</div>'
          +'<div class="rowbox"><b>🔔 팬클럽 소식 알림</b><br>방송 시작, 팬클럽 공지, 혜택 안내처럼 팬에게 필요한 소식을 확인할 수 있습니다.</div>'
          +'<div class="rowbox"><b>🎥 방송 참여 혜택</b><br>팬클럽 팬은 방송 참여 기록과 응원 활동을 모아서 확인할 수 있습니다.</div>'
          +'<div class="rowbox"><b>🎁 팬 혜택 보내기</b><br>운영 중인 장미 · 선물 · 이벤트 보상 등 제공 가능한 혜택을 팬에게 안내하고 보낼 수 있습니다.</div>'
          +'<div class="rowbox"><b>💎 구독자 연동 혜택</b><br>구독 상태가 활성화된 회원은 구독자 전용 기능과 팬클럽 혜택을 함께 확인할 수 있습니다.</div>'
          +'<div class="rowbox"><b>📊 팬클럽 성장 확인</b><br>팬 수 · 응원 · 슈퍼팬 현황을 위에서 바로 확인하고 팬클럽 성장 상태를 볼 수 있습니다.</div>'
        +'</div>'
        +'<div class="kt-fan-tabs" style="margin-top:14px"><button class="on">모든 팬</button><button>팬클럽 도구</button></div>'
        +'<div class="kt-fan-list">'
          +'<div class="kt-fan-empty"><span>💛</span><b>아직 등록된 팬이 없습니다</b><small>팬이 참여하면 여기에 표시됩니다.</small></div>'
        +'</div>'
      +'</div>';
      showSheet('팬클럽',html);
    };

    window.openFanHelp=function(){
      showSheet('팬클럽 안내',
        '<div class="rowbox"><b>👑 K-Talk 팬클럽</b><br>팬 관리와 팬클럽 혜택을 한곳에서 확인하는 공간입니다.</div>'
        +'<div class="rowbox"><b>팬클럽에서 확인하는 내용</b><br>팬 · 응원 · 슈퍼팬 현황, 팬 등급, 팬클럽 소식, 방송 참여 기록, 팬 혜택을 확인합니다.</div>');
    };
  }

  install();
  setTimeout(install,100);
  setTimeout(install,600);
})();

/* K-Talk: compact multiroom live controls above guest seats. */
(function(){
  if(window.__ktMultiroomCompactControlsLoaded)return;
  window.__ktMultiroomCompactControlsLoaded=true;

  function roomType(){try{return (window.state&&state.liveRoomType)||'';}catch(e){return '';}}
  function isTarget(){var t=roomType();return t==='group13'||t==='subscriber';}

  function textOf(el){return String((el&&el.textContent)||'').replace(/\s+/g,' ').trim();}
  function matchesControl(txt){
    return txt.indexOf('좋아요')>=0||txt.indexOf('선물')>=0||txt.indexOf('매치')>=0||txt.indexOf('효과')>=0;
  }

  function hideOldControls(section){
    if(!section)return;
    section.querySelectorAll('button,[role="button"]').forEach(function(el){
      if(el.id==='ktMultiCompactMenuBtn'||el.closest('#ktMultiCompactMenu'))return;
      if(el.closest('.bottom,.kt-bottom'))return;
      var txt=textOf(el);
      if(!matchesControl(txt))return;
      var cs=null;
      try{cs=getComputedStyle(el);}catch(e){}
      var pos=cs&&cs.position;
      if(pos!=='absolute'&&pos!=='fixed')return;
      if(!el.dataset.ktMultiOldDisplay)el.dataset.ktMultiOldDisplay=el.style.display||'__empty__';
      el.dataset.ktMultiHiddenControl='1';
      el.style.setProperty('display','none','important');
    });
  }

  function restoreOldControls(){
    document.querySelectorAll('[data-kt-multi-hidden-control="1"]').forEach(function(el){
      var old=el.dataset.ktMultiOldDisplay;
      el.style.removeProperty('display');
      if(old&&old!=='__empty__')el.style.display=old;
      delete el.dataset.ktMultiHiddenControl;
      delete el.dataset.ktMultiOldDisplay;
    });
    var b=document.getElementById('ktMultiCompactMenuBtn');
    if(b)b.remove();
  }

  function clickOriginal(label){
    var section=document.getElementById('ktLiveVideo');
    section=section&&section.closest('section');
    if(section){
      var found=null;
      section.querySelectorAll('[data-kt-multi-hidden-control="1"]').forEach(function(el){
        if(found)return;
        var txt=textOf(el);
        if(label==='효과'){
          if(txt.indexOf('효과')>=0)found=el;
        }else if(txt.indexOf(label)>=0)found=el;
      });
      if(found){try{found.click();return true;}catch(e){}}
    }
    if(label==='선물'&&typeof window.openGifts==='function'){window.openGifts();return true;}
    if(label==='매치'&&typeof window.openHostMatchArena==='function'){window.openHostMatchArena('1대1');return true;}
    if(label==='효과'&&typeof window.openEditEffectPanel==='function'){window.openEditEffectPanel();return true;}
    return false;
  }

  window.ktOpenMultiCompactMenu=function(){
    if(typeof window.showSheet!=='function')return;
    var html='<div id="ktMultiCompactMenu" style="display:grid;grid-template-columns:1fr 1fr;gap:10px">'
      +'<button class="act" onclick="closeSheet();ktMultiCompactAction(\'좋아요\')">💗 좋아요</button>'
      +'<button class="act" onclick="closeSheet();ktMultiCompactAction(\'선물\')">🎁 선물</button>'
      +'<button class="act" onclick="closeSheet();ktMultiCompactAction(\'매치\')">⚔ 매치</button>'
      +'<button class="act" onclick="closeSheet();ktMultiCompactAction(\'효과\')">✨ 효과</button>'
      +'</div>';
    showSheet('방송 기능',html);
  };

  window.ktMultiCompactAction=function(label){
    setTimeout(function(){clickOriginal(label);},40);
  };

  function ensureButton(section){
    var b=document.getElementById('ktMultiCompactMenuBtn');
    if(!b){
      b=document.createElement('button');
      b.id='ktMultiCompactMenuBtn';
      b.type='button';
      b.innerHTML='⋮ <span>기능</span>';
      b.onclick=function(e){e.preventDefault();e.stopPropagation();window.ktOpenMultiCompactMenu();};
      section.appendChild(b);
    }
    b.style.cssText='position:absolute;z-index:12;right:8px;top:154px;width:76px;height:38px;border:1px solid rgba(255,255,255,.28);border-radius:999px;background:rgba(12,12,18,.82);color:#fff;font-size:16px;font-weight:950;display:flex;align-items:center;justify-content:center;gap:5px;box-shadow:0 4px 14px rgba(0,0,0,.35);touch-action:manipulation';
    var sp=b.querySelector('span');
    if(sp)sp.style.cssText='font-size:11px;font-weight:900';
  }

  function apply(){
    if(!isTarget()){restoreOldControls();return;}
    var video=document.getElementById('ktLiveVideo');
    if(!video)return;
    var section=video.closest('section');
    if(!section)return;
    hideOldControls(section);
    ensureButton(section);
  }

  try{new MutationObserver(function(){setTimeout(apply,20);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setTimeout(apply,80);
  setInterval(apply,500);
})();
