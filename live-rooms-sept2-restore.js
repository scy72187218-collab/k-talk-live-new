/* K-Talk LIVE — restore ONLY the four live-room screens to the saved 2026-09-02 state. */
(function(){
  if(window.__ktSept2LiveRoomsRestoreLoaded)return;
  window.__ktSept2LiveRoomsRestoreLoaded=true;

  var refClockTimer=null;
  var refStartedAt=0;

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

  function isReferenceRoom(room){
    return !!room && (room.type==='solo'||room.type==='group'||room.type==='subscriber');
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

  function referenceTop(room){
    return '<div class="kt-s2-refbar">'
      +'<div class="kt-s2-room-pill">'+esc(room.name)+'</div>'
      +'<div class="kt-live-airclock"><span class="air">● ON AIR</span><span id="ktLiveClock" class="clock">00:00:00</span></div>'
      +'<button id="ktAttendanceHeart" class="kt-live-attendance kt-attendance-heart" type="button" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck()" aria-label="출석체크">'
        +'<span class="wing">🪽</span><span class="badge"><span class="kt-attendance-label">출석체크</span> <span class="heart">♥</span><span class="kt-attendance-sub">하트 1개 · 30원</span></span><span class="wing">🪽</span>'
      +'</button>'
    +'</div>';
  }

  function referenceGiftRow(room){
    if(!isReferenceRoom(room))return '';
    return '<div class="kt-s2-gift-row" aria-label="선물 바로가기">'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-img"><img src="rose-single.svg" alt=""></span><b>1개</b><small>장미</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-img"><img src="rose-bouquet-50.svg" alt=""></span><b>50개</b><small>장미다발</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-img"><img src="rose-bouquet-100.svg" alt=""></span><b>100개</b><small>특대장미</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-emoji heart">💗</span><b>10개</b><small>하트</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-emoji crown">👑</span><b>100개</b><small>왕관</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-emoji car">🏎️</span><b>50개</b><small>스포츠카</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-img box"><img src="gift-box.svg" alt=""></span><b>선물상자</b><small>큰 선물 보기</small></button>'
    +'</div>';
  }

  function formatClock(ms){
    var sec=Math.max(0,Math.floor(ms/1000));
    var h=Math.floor(sec/3600);sec%=3600;
    var m=Math.floor(sec/60);var s=sec%60;
    return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }

  function startReferenceClock(room){
    clearInterval(refClockTimer);
    refClockTimer=null;
    if(!isReferenceRoom(room))return;
    if(!refStartedAt)refStartedAt=Date.now();
    function tick(){
      var el=document.getElementById('ktLiveClock');
      if(el)el.textContent=formatClock(Date.now()-refStartedAt);
    }
    tick();
    refClockTimer=setInterval(tick,1000);
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
#ktSept2Live.kt-ref-room .kt-s2-refbar{height:48px;display:flex;align-items:center;gap:7px;padding:4px 5px;border:1px solid #ffffff22;border-radius:14px;background:rgba(5,5,10,.80);box-shadow:0 4px 18px #0008;}\
#ktSept2Live.kt-ref-room .kt-s2-room-pill{flex:0 0 auto;height:38px;display:flex;align-items:center;padding:0 11px;border-radius:12px;border:1px solid #b755ff;color:#f0ceff;background:#160720;font-size:14px;font-weight:950;white-space:nowrap;box-shadow:0 0 10px #8f39ff55;}\
#ktSept2Live.kt-ref-room .kt-live-airclock{position:static!important;left:auto!important;right:auto!important;top:auto!important;transform:none!important;z-index:auto!important;display:flex!important;align-items:center!important;gap:5px!important;min-width:0!important;white-space:nowrap!important;background:none!important;border:0!important;padding:0!important;box-shadow:none!important;font-size:11px!important;font-weight:950!important;}\
#ktSept2Live.kt-ref-room .kt-live-airclock .air{color:#ff5472!important;text-shadow:0 0 7px #ff315f!important;animation:ktS2AirBlink 1.05s ease-in-out infinite;}\
#ktSept2Live.kt-ref-room .kt-live-airclock .clock{color:#fff!important;letter-spacing:.2px!important;font-variant-numeric:tabular-nums!important;}\
#ktSept2Live.kt-ref-room .kt-live-attendance{position:relative!important;left:auto!important;right:auto!important;top:auto!important;transform:none!important;margin-left:auto!important;flex:1 1 auto!important;min-width:104px!important;max-width:190px!important;height:38px!important;padding:0 7px!important;border:2px solid #ff42c7!important;border-radius:8px!important;background-color:#100710!important;background-image:radial-gradient(circle,rgba(255,83,207,.42) 0 1px,transparent 1.5px)!important;background-size:6px 6px!important;box-shadow:inset 0 0 10px #ff37c43d,0 0 7px #ff40c9,0 0 16px #ff2ab99c!important;color:#ffd447!important;display:flex!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important;}\
#ktSept2Live.kt-ref-room .kt-live-attendance .wing{display:none!important;}\
#ktSept2Live.kt-ref-room .kt-live-attendance .badge{font-size:13px!important;font-weight:950!important;letter-spacing:.3px!important;color:#ffd447!important;text-shadow:0 0 5px #ffad18,0 0 9px #ff6900!important;}\
#ktSept2Live.kt-ref-room .kt-live-attendance .kt-attendance-sub{display:none!important;}\
#ktSept2Live.kt-ref-room .kt-live-attendance .heart{color:#ff5bc9!important;text-shadow:0 0 6px #ff42bf!important;}\
#ktSept2Live.kt-ref-room .kt-live-attendance:before,#ktSept2Live.kt-ref-room .kt-live-attendance:after{content:""!important;position:absolute!important;top:8px!important;width:16px!important;height:18px!important;border-top:2px solid #ff58d1!important;border-bottom:2px solid #ff58d1!important;filter:drop-shadow(0 0 4px #ff39c7)!important;}\
#ktSept2Live.kt-ref-room .kt-live-attendance:before{left:-18px!important;transform:skewY(18deg)!important;border-left:2px solid #ff58d1!important;}\
#ktSept2Live.kt-ref-room .kt-live-attendance:after{right:-18px!important;transform:skewY(-18deg)!important;border-right:2px solid #ff58d1!important;}\
#ktSept2Live.kt-ref-room .kt-s2-right{bottom:164px!important;}\
#ktSept2Live .kt-s2-gift-row{position:absolute;left:7px;right:7px;bottom:68px;z-index:7;height:88px;display:flex;gap:5px;padding:5px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;border:1px solid #ffffff24;border-radius:15px;background:rgba(3,3,7,.92);box-shadow:0 8px 24px #000c;}\
#ktSept2Live .kt-s2-gift-row::-webkit-scrollbar{display:none;}\
#ktSept2Live .kt-s2-gift-row button{flex:0 0 70px;height:76px;padding:3px 2px;border:1px solid #ffffff1e;border-radius:10px;background:linear-gradient(180deg,#0d0d12,#07070b);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.05;box-shadow:inset 0 0 10px #ffffff08;}\
#ktSept2Live .kt-s2-gift-row .gift-img{width:38px;height:31px;display:grid;place-items:center;margin-bottom:2px;}\
#ktSept2Live .kt-s2-gift-row .gift-img img{max-width:38px;max-height:31px;display:block;filter:drop-shadow(0 0 5px rgba(255,64,145,.30));}\
#ktSept2Live .kt-s2-gift-row .gift-emoji{height:31px;display:grid;place-items:center;margin-bottom:2px;font-size:29px;filter:drop-shadow(0 0 6px rgba(255,74,197,.45));}\
#ktSept2Live .kt-s2-gift-row b{font-size:10px;color:#ffd66d;font-weight:950;}\
#ktSept2Live .kt-s2-gift-row small{margin-top:2px;font-size:8px;color:#efefef;font-weight:850;white-space:nowrap;}\
#ktSept2Live .kt-s2-gift-row button:last-child b,#ktSept2Live .kt-s2-gift-row button:last-child small{color:#ff7fd8;}\
@keyframes ktS2AirBlink{0%,100%{opacity:1}50%{opacity:.48}}\
@media(max-width:390px){#ktSept2Live.kt-ref-room .kt-s2-room-pill{padding:0 8px;font-size:12px}#ktSept2Live.kt-ref-room .kt-live-airclock{font-size:9px!important;gap:3px!important}#ktSept2Live.kt-ref-room .kt-live-attendance{min-width:88px!important;padding:0 4px!important}#ktSept2Live.kt-ref-room .kt-live-attendance .badge{font-size:11px!important}#ktSept2Live .kt-s2-gift-row button{flex-basis:66px}}\
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
    var target=isReferenceRoom(room);
    try{if(window.state){state.currentLiveRoomTitle=title;state.currentViewRoomTitle=title;}}
    catch(e){}

    screenEl.innerHTML='<section id="ktSept2Live"'+(target?' class="kt-ref-room"':'')+'>'
      +'<video id="ktLiveVideo" autoplay playsinline muted></video>'
      +'<div class="kt-s2-shade"></div>'
      +'<div id="ktLiveEffectLayer" style="position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden"><div id="ktLiveFaceAnchor" class="kt-face-anchor"></div></div>'
      +'<div id="ktLiveTreasureZone" class="kt-live-treasure-zone"></div>'
      +(target?'':'<div class="kt-attendance-wrap"><button id="ktAttendanceHeart" class="kt-attendance-heart" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck()"><span class="kt-attendance-label">출석체크</span><span class="kt-attendance-sub">하트 1개 · 30원</span><i class="kt-attendance-miniheart">💗</i></button></div>')
      +'<div class="kt-like-milestones">💗 5천 · 1만 · 1만5천 · 2만 · 2만5천 <b>달성마다 🌹 1송이</b></div>'
      +'<div class="kt-s2-top">'
        +(target?referenceTop(room):'<div class="kt-s2-title"><b>🔴 '+esc(title)+'</b><span>K-Talk LIVE</span></div>')
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
      +referenceGiftRow(room)
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

    startReferenceClock(room);
    enforceSept2Video();
    setTimeout(enforceSept2Video,80);
    setTimeout(enforceSept2Video,180);
    setTimeout(enforceSept2Video,420);
  }

  async function restoredStart(){
    var room=normalizeRoom();
    if(typeof baseStart!=='function')return;
    refStartedAt=Date.now();

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
