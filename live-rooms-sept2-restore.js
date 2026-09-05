/* K-Talk LIVE — restore ONLY the four live-room screens to the saved 2026-09-02 state. */
(function(){
  if(window.__ktSept2LiveRoomsRestoreLoaded)return;
  window.__ktSept2LiveRoomsRestoreLoaded=true;

  var ktRoomClockTimer=null;
  var ktRoomClockStartedAt=0;

  function esc(s){
    return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }

  function normalizeRoom(){
    var type='solo',name='1인 방송',max=1;
    try{
      type=(window.state&&state.liveRoomType)||'solo';
      if(type==='group13'||type==='general')type='group';
      if(type==='solo'){name='1인 방송';max=1;}
      else if(type==='group'){name='13명 방송';max=13;}
      else if(type==='subscriber'){name='구독자 방송';max=10;}
      else if(type==='password'){name='비밀방';max=7;}
      else {type='solo';name='1인 방송';max=1;}
      if(window.state){state.liveRoomType=type;state.liveRoomName=name;state.liveRoomMax=max;}
    }catch(e){}
    return {type:type,name:name,max:max};
  }

  function isAddedUiRoom(room){
    return !!room&&(room.type==='solo'||room.type==='group'||room.type==='subscriber');
  }

  /* Sept. 2 used "group" for the 13-person room. Keep the current buttons but restore that value. */
  var oldSelect=window.selectPrepRoom;
  if(typeof oldSelect==='function'){
    window.selectPrepRoom=function(el,type,label,max){
      if(type==='group13')type='group';
      return oldSelect.call(this,el,type,label,max);
    };
  }

  /* Do not let the later host/guest-grid skin overwrite the Sept. 2 room layout. */
  window.ktApplyTikTokMultiRoomLayout=function(){};

  var installedStart=window.startBroadcast;
  var baseStart=installedStart;
  if(baseStart&&baseStart.__ktSoloHostLiveOriginal)baseStart=baseStart.__ktSoloHostLiveOriginal;

  function guestStrip(room){
    if(room.type==='solo')return '';
    /* Exact saved Sept. 2 guest strip: six visible guest profile buttons. */
    var names=['게스트1','게스트2','게스트3','게스트4','게스트5','게스트6'];
    var faces=['🙂','😊','😎','👩','🧑','👨'];
    return '<div class="kt-live-guests">'+names.map(function(n,i){
      return '<button type="button" onclick="if(window.openGuestProfile)openGuestProfile(\'g'+(i+1)+'\',\''+n+'\',\''+faces[i]+'\')"><span>'+faces[i]+'</span><small>'+n+'</small></button>';
    }).join('')+'</div>';
  }

  function roomTitle(room){
    var t='';
    try{
      var input=document.getElementById('liveTitle');
      t=(window.state&&state.currentLiveRoomTitle)||(input&&input.value)||room.name;
    }catch(e){t=room.name;}
    if(!t||t==='오늘 라이브 제목을 입력하세요')t=room.name;
    return String(t).split(' · 후원계좌 ')[0]||room.name;
  }

  function formatRoomClock(ms){
    var sec=Math.max(0,Math.floor(ms/1000));
    var h=Math.floor(sec/3600);sec%=3600;
    var m=Math.floor(sec/60),s=sec%60;
    return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }

  function startRoomClock(room){
    clearInterval(ktRoomClockTimer);
    ktRoomClockTimer=null;
    if(!isAddedUiRoom(room))return;
    ktRoomClockStartedAt=Date.now();
    function tick(){
      var el=document.getElementById('ktS2RoomClock');
      if(el)el.textContent=formatRoomClock(Date.now()-ktRoomClockStartedAt);
    }
    tick();
    ktRoomClockTimer=setInterval(tick,1000);
  }

  function targetHeader(room){
    if(!isAddedUiRoom(room))return '';
    return '<div class="kt-s2-title kt-s2-title-live">'
      +'<div class="kt-s2-title-left"><b><i></i>'+esc(room.name)+'</b><small><i></i> ON AIR <strong id="ktS2RoomClock">00:00:00</strong></small></div>'
      +'<span>K-Talk LIVE</span>'
    +'</div>';
  }

  function attendanceSigns(room){
    if(!isAddedUiRoom(room))return '<div class="kt-attendance-wrap"><button id="ktAttendanceHeart" class="kt-attendance-heart" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck()"><span class="kt-attendance-label">출석체크</span><span class="kt-attendance-sub">하트 1개 · 30원</span><i class="kt-attendance-miniheart">💗</i></button></div>';
    return '<div class="kt-s2-attendance-stack">'
      +'<button type="button" class="kt-s2-att-small" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck()"><span>🪽</span><b>출석체크</b><span>🪽</span></button>'
      +'<button id="ktAttendanceHeart" type="button" class="kt-s2-att-large" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck()"><span>🪽</span><b>출석체크 <em>♥</em></b><span>🪽</span></button>'
    +'</div>';
  }

  function giftShortcutRow(room){
    if(!isAddedUiRoom(room))return '';
    return '<div class="kt-s2-gift-row" aria-label="선물 바로가기">'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-img"><img src="rose-single.svg" alt=""></span><b>1개</b><small>장미</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-img"><img src="rose-bouquet-50.svg" alt=""></span><b>50개</b><small>장미다발</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-img"><img src="rose-bouquet-100.svg" alt=""></span><b>100개</b><small>특대장미</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-emoji">💗</span><b>10개</b><small>하트</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-emoji">👑</span><b>100개</b><small>왕관</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-emoji">🏎️</span><b>50개</b><small>스포츠카</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-img gift-box"><img src="gift-box.svg" alt=""></span><b>선물상자</b><small>큰 선물 보기</small></button>'
    +'</div>';
  }

  function installSept2Css(){
    if(document.getElementById('ktSept2LiveCss'))return;
    var st=document.createElement('style');
    st.id='ktSept2LiveCss';
    st.textContent='\
#ktSept2Live{height:100dvh;min-height:620px;position:relative;overflow:hidden;background:#050309;color:#fff;}\
#ktSept2Live #ktLiveVideo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;object-position:50% 50%!important;background:#09070d!important;transform:scaleX(-1)!important;border-radius:0!important;}\
#ktSept2Live .kt-s2-shade{position:absolute;inset:0;background:linear-gradient(180deg,#00000045,transparent 34%,#00000018 62%,#000000d9 100%);pointer-events:none;}\
#ktSept2Live .kt-s2-top{position:absolute;left:10px;right:10px;top:12px;z-index:5;display:grid;gap:7px;}\
#ktSept2Live .kt-s2-title{display:flex;justify-content:space-between;align-items:center;gap:8px;padding:8px 10px;border:1px solid #ffffff22;border-radius:14px;background:#08080b77;}\
#ktSept2Live .kt-s2-title b{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\
#ktSept2Live .kt-s2-title span{color:#ff6788;font-weight:900;white-space:nowrap;}\
#ktSept2Live .kt-live-guests{display:flex;gap:7px;overflow-x:auto;padding:5px 4px 2px;scrollbar-width:none;}\
#ktSept2Live .kt-live-guests::-webkit-scrollbar{display:none;}\
#ktSept2Live .kt-live-guests button{flex:0 0 auto;width:46px;border:0;background:transparent;color:#fff;padding:0;text-align:center;}\
#ktSept2Live .kt-live-guests span{width:39px;height:39px;margin:0 auto 3px;border-radius:50%;display:grid;place-items:center;font-size:22px;background:linear-gradient(145deg,#2a2033,#111018);border:2px solid #ff66b5;box-shadow:0 0 10px #ff4fa433;}\
#ktSept2Live .kt-live-guests small{display:block;font-size:8px;color:#eee;font-weight:850;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\
#ktSept2Live #myEarnHud{width:100%;padding:8px 10px;border:1px solid #ffe07155;border-radius:14px;background:linear-gradient(135deg,#241b08d9,#16131ed9);color:#fff;text-align:left;}\
#ktSept2Live .kt-s2-right{position:absolute;right:10px;bottom:112px;z-index:5;display:grid;gap:9px;}\
#ktSept2Live .kt-s2-like{width:54px;min-height:62px;border-radius:18px;border:1px solid #ff65b788;background:#321024dd;color:#fff;font-size:22px;font-weight:950;line-height:1;}\
#ktSept2Live .kt-s2-circle{width:54px;height:54px;border-radius:50%;color:#fff;}\
#ktSept2Live .kt-s2-bottom{position:absolute;left:10px;right:10px;bottom:14px;z-index:5;display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;}\
#ktSept2Live .kt-s2-bottom button{padding:12px 5px;border-radius:15px;font-weight:950;font-size:12px;}\
#ktSept2Live .kt-attendance-wrap{z-index:6;}\
#ktSept2Live.kt-added-ui-room .kt-s2-title-live{min-height:58px;padding:7px 12px;background:rgba(9,9,12,.68);border-radius:18px;}\
#ktSept2Live.kt-added-ui-room .kt-s2-title-left{display:grid;gap:1px;}\
#ktSept2Live.kt-added-ui-room .kt-s2-title-left b{display:flex;align-items:center;gap:7px;font-size:20px;color:#fff;}\
#ktSept2Live.kt-added-ui-room .kt-s2-title-left small{display:flex;align-items:center;gap:6px;color:#ff5578;font-size:13px;font-weight:950;}\
#ktSept2Live.kt-added-ui-room .kt-s2-title-left i{display:inline-block;width:16px;height:16px;border-radius:50%;background:#ff315f;box-shadow:0 0 10px #ff315f;}\
#ktSept2Live.kt-added-ui-room .kt-s2-title-left small i{width:10px;height:10px;}\
#ktSept2Live.kt-added-ui-room .kt-s2-title-left strong{color:#fff;font-size:13px;font-variant-numeric:tabular-nums;}\
#ktSept2Live.kt-added-ui-room .kt-s2-title-live>span{font-size:18px;color:#ff5b88!important;}\
#ktSept2Live .kt-s2-attendance-stack{display:grid;justify-items:center;gap:4px;pointer-events:auto;}\
#ktSept2Live .kt-s2-attendance-stack button{font-family:inherit;color:#ffd13f;font-weight:950;letter-spacing:.2px;border:2px solid #ff42c7;background-color:#120712;background-image:radial-gradient(circle,rgba(255,83,207,.7) 0 1.5px,transparent 1.8px);background-size:8px 8px;box-shadow:inset 0 0 12px #ff37c44d,0 0 7px #ff40c9,0 0 18px #ff2ab9c7;text-shadow:0 0 5px #ffad18,0 0 9px #ff6900;}\
#ktSept2Live .kt-s2-att-small{height:34px;min-width:156px;padding:0 12px;border-radius:15px;font-size:15px;}\
#ktSept2Live .kt-s2-att-large{width:100%;height:48px;padding:0 12px;border-radius:20px;font-size:21px;}\
#ktSept2Live .kt-s2-attendance-stack button span{color:#d8ecff;text-shadow:0 0 6px #48a9ff;}\
#ktSept2Live .kt-s2-attendance-stack em{font-style:normal;color:#ff3c7c;text-shadow:0 0 9px #ff2b80;}\
#ktSept2Live .kt-s2-gift-row{position:absolute;left:0;right:0;bottom:72px;z-index:8;height:108px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;padding:5px 3px;background:rgba(2,2,5,.95);border-top:1px solid #ffffff24;border-bottom:1px solid #ffffff18;box-shadow:0 -7px 22px #0009;}\
#ktSept2Live .kt-s2-gift-row button{min-width:0;height:98px;padding:3px 1px;border:1px solid #ffffff1f;border-radius:9px;background:linear-gradient(180deg,#0d0d12,#07070b);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.05;}\
#ktSept2Live .kt-s2-gift-row .gift-img{width:40px;height:40px;display:grid;place-items:center;}\
#ktSept2Live .kt-s2-gift-row .gift-img img{max-width:100%;max-height:100%;object-fit:contain;}\
#ktSept2Live .kt-s2-gift-row .gift-emoji{height:40px;display:grid;place-items:center;font-size:31px;}\
#ktSept2Live .kt-s2-gift-row b{margin-top:2px;font-size:11px;color:#ffe675;white-space:nowrap;}\
#ktSept2Live .kt-s2-gift-row small{margin-top:3px;font-size:9px;color:#fff;font-weight:850;white-space:nowrap;}\
#ktSept2Live .kt-s2-gift-row .gift-box+ b{font-size:9px;color:#fff;}\
#ktSept2Live.kt-added-ui-room .kt-s2-right{bottom:190px;}\
@media(max-width:390px){#ktSept2Live.kt-added-ui-room .kt-s2-title-left b{font-size:17px}#ktSept2Live.kt-added-ui-room .kt-s2-title-live>span{font-size:15px}#ktSept2Live .kt-s2-att-large{font-size:18px}#ktSept2Live .kt-s2-gift-row b{font-size:10px}#ktSept2Live .kt-s2-gift-row small{font-size:8px}}\
';
    document.head.appendChild(st);
  }

  function enforceSept2Video(){
    var section=document.getElementById('ktSept2Live');
    var v=document.getElementById('ktLiveVideo');
    if(!section||!v)return;
    var grid=document.getElementById('ktMultiInviteGrid');if(grid)grid.remove();
    var badge=document.getElementById('ktMultiHostBadge');if(badge)badge.remove();
    v.style.setProperty('position','absolute','important');
    v.style.setProperty('inset','0','important');
    v.style.setProperty('left','0','important');
    v.style.setProperty('right','0','important');
    v.style.setProperty('top','0','important');
    v.style.setProperty('bottom','0','important');
    v.style.setProperty('width','100%','important');
    v.style.setProperty('height','100%','important');
    v.style.setProperty('object-fit','cover','important');
    v.style.setProperty('object-position','50% 50%','important');
    v.style.setProperty('transform','scaleX(-1)','important');
    v.style.setProperty('border-radius','0','important');
  }

  function renderSept2(room){
    installSept2Css();
    var screenEl=document.getElementById('screen')||window.screen;
    if(!screenEl)return;
    var title=roomTitle(room);
    var target=isAddedUiRoom(room);
    try{if(window.state){state.currentLiveRoomTitle=title;state.currentViewRoomTitle=title;}}
    catch(e){}

    screenEl.innerHTML='<section id="ktSept2Live" class="'+(target?'kt-added-ui-room':'')+'">'
      +'<video id="ktLiveVideo" autoplay playsinline muted></video>'
      +'<div class="kt-s2-shade"></div>'
      +'<div id="ktLiveEffectLayer" style="position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden"><div id="ktLiveFaceAnchor" class="kt-face-anchor"></div></div>'
      +'<div id="ktLiveTreasureZone" class="kt-live-treasure-zone"></div>'
      +'<div class="kt-like-milestones">💗 5천 · 1만 · 1만5천 · 2만 · 2만5천 <b>달성마다 🌹 1송이</b></div>'
      +'<div class="kt-s2-top">'
        +(target?targetHeader(room):'<div class="kt-s2-title"><b>🔴 '+esc(title)+'</b><span>K-Talk LIVE</span></div>')
        +attendanceSigns(room)
        +guestStrip(room)
        +'<button id="myEarnHud" type="button" onclick="if(window.toggleMyEarnings)toggleMyEarnings()">'
          +'<div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><span style="font-size:10px;color:#8fe8ff;font-weight:950">🔒 내 수익 · 본인만 표시</span><b id="hudEarnNet" style="font-size:18px;color:#ffe071">0원</b></div>'
          +'<div id="myEarnDetail" style="display:grid;grid-template-columns:1fr 1fr;gap:5px;margin-top:5px;font-size:10px;color:#ddd"><span id="hudEarnRoses">🌹 0송이</span><span id="hudEarnRate" style="text-align:right">일반회원 · 35%</span></div>'
        +'</button>'
      +'</div>'
      +'<div class="kt-s2-right">'
        +'<button class="kt-s2-like" type="button" onclick="if(window.addHostLike)addHostLike(1)">💗<small style="display:block;margin-top:4px;font-size:9px;color:#ffd8ef">좋아요</small><b id="hostLikeCount" style="display:block;margin-top:3px;font-size:10px;color:#fff">0</b></button>'
        +'<button class="kt-s2-circle" type="button" onclick="if(window.openGifts)openGifts()" style="border:1px solid #ffd65a88;background:#2b1c08dd;font-size:23px">🎁</button>'
        +'<button class="kt-s2-circle" type="button" onclick="if(window.openEditEffectPanel){var c=document.getElementById(\'creator\')||window.creator;if(c&&c.classList)c.classList.add(\'show\');openEditEffectPanel();}" style="border:1px solid #ffffff38;background:#09090ddd;font-size:11px;font-weight:900">✨ 효과</button>'
      +'</div>'
      +giftShortcutRow(room)
      +'<div class="kt-s2-bottom">'
        +'<button type="button" onclick="if(window.openGifts)openGifts()" style="border:1px solid #ffd86b66;background:linear-gradient(135deg,#332707,#7a5310);color:#ffe075">🎁 선물</button>'
        +'<button type="button" onclick="if(window.openTreasure)openTreasure()" style="border:1px solid #f2b94f88;background:linear-gradient(135deg,#48260d,#8c5512);color:#fff3a7">🗝️ 보물상자</button>'
        +'<button type="button" onclick="if(window.endBroadcastEarnings)endBroadcastEarnings()" style="border:0;background:linear-gradient(135deg,#ff315f,#ff4e91);color:#fff">■ 방송 종료</button>'
      +'</div>'
      +'</section>';

    var v=document.getElementById('ktLiveVideo');
    try{
      if(v&&window.state&&state.stream){
        v.srcObject=state.stream;
        var p=v.play();if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
    try{if(window.ktRenderTreasure)window.ktRenderTreasure();}catch(e){}
    try{if(window.ktUpdateTreasureLed)window.ktUpdateTreasureLed();}catch(e){}
    try{if(window.ktRenderAttendance)window.ktRenderAttendance();}catch(e){}
    try{if(window.ktSetLivePresence)window.ktSetLivePresence(true);}catch(e){}
    startRoomClock(room);

    enforceSept2Video();
    setTimeout(enforceSept2Video,80);
    setTimeout(enforceSept2Video,180);
    setTimeout(enforceSept2Video,420);
  }

  async function restoredStart(){
    var room=normalizeRoom();
    if(typeof baseStart!=='function')return;

    /* Sept. 2 began directly; bypass only the later added countdown while the saved starter initializes. */
    var oldCountdown=window.ktLiveStartCountdown;
    try{window.ktLiveStartCountdown=async function(){};}catch(e){}
    var out;
    try{out=await baseStart.apply(this,arguments);}
    finally{try{window.ktLiveStartCountdown=oldCountdown;}catch(e){}}

    renderSept2(room);
    return out;
  }
  restoredStart.__ktSoloHostLiveFixed=true;
  restoredStart.__ktSept2Restored=true;
  restoredStart.__ktSoloHostLiveOriginal=baseStart;
  window.startBroadcast=restoredStart;
})();
