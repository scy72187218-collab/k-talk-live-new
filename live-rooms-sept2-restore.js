/* K-Talk LIVE — apply ONLY the approved style to 1-person, 13-person and subscriber rooms. */
(function(){
  if(window.__ktSept2LiveRoomsRestoreLoaded)return;
  window.__ktSept2LiveRoomsRestoreLoaded=true;

  function esc(s){
    return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }
  function roomInfo(){
    var type='solo';
    try{type=(window.state&&state.liveRoomType)||'solo';}catch(e){}
    if(type==='group13'||type==='general')type='group';
    if(type==='solo')return {type:'solo',name:'1인방',max:1};
    if(type==='group')return {type:'group',name:'13명방',max:13};
    if(type==='subscriber')return {type:'subscriber',name:'구독자방',max:10};
    return {type:type,name:'',max:0};
  }

  var oldSelect=window.selectPrepRoom;
  if(typeof oldSelect==='function'){
    window.selectPrepRoom=function(el,type,label,max){
      if(type==='group13')type='group';
      return oldSelect.call(this,el,type,label,max);
    };
  }

  /* Later multi-room skin must not overwrite these three approved room screens. */
  window.ktApplyTikTokMultiRoomLayout=function(){};

  var installedStart=window.startBroadcast;
  var baseStart=installedStart;
  if(baseStart&&baseStart.__ktSoloHostLiveOriginal)baseStart=baseStart.__ktSoloHostLiveOriginal;

  function installCss(){
    if(document.getElementById('ktApprovedThreeRoomCss'))return;
    var st=document.createElement('style');
    st.id='ktApprovedThreeRoomCss';
    st.textContent=`
#ktApprovedRoom{position:relative;width:100%;height:100%;min-height:560px;overflow:hidden;background:#05070e;color:#fff;font-family:system-ui,-apple-system,'Noto Sans KR',sans-serif}
#ktApprovedRoom *{box-sizing:border-box}
#ktApprovedRoom .ktr-head{position:absolute;z-index:20;left:8px;right:8px;top:7px;height:58px;display:flex;align-items:center;gap:7px;padding:5px 7px;border-radius:18px;background:rgba(6,8,18,.88);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(10px);box-shadow:0 5px 24px #0009}
#ktApprovedRoom .ktr-back{width:34px;height:42px;border:0;background:transparent;color:#fff;font-size:35px;line-height:1;padding:0}
#ktApprovedRoom .ktr-roomname{padding:7px 13px;border-radius:13px;border:2px solid #b63fff;background:#12091e;color:#fff;font-size:19px;font-weight:950;white-space:nowrap;box-shadow:0 0 14px #a72cff88,inset 0 0 10px #8e29ff30}
#ktApprovedRoom.group .ktr-roomname{border-color:#2cabff;box-shadow:0 0 14px #23a3ff77;color:#dff4ff}
#ktApprovedRoom.subscriber .ktr-roomname{border-color:#f5c43b;box-shadow:0 0 14px #f6b90066;color:#ffeaa0}
#ktApprovedRoom .ktr-onair{display:flex;align-items:center;gap:6px;color:#ff5879;font-weight:950;font-size:12px;white-space:nowrap}
#ktApprovedRoom .ktr-dot{width:10px;height:10px;border-radius:50%;background:#ff315f;box-shadow:0 0 12px #ff315f}
#ktApprovedRoom .ktr-time{font-size:15px;font-weight:950;letter-spacing:.4px;white-space:nowrap}
#ktApprovedRoom .ktr-attend{margin-left:auto;min-width:145px;height:48px;padding:0 12px;border-radius:11px;border:2px solid #ff42bc;background:linear-gradient(180deg,#35102f,#120817);color:#ffd32a;font-size:19px;font-weight:950;letter-spacing:1px;box-shadow:0 0 16px #ff3abf,inset 0 0 13px #ff3abf35;text-shadow:0 0 7px #ff6b4f}
#ktApprovedRoom .ktr-attend:before,#ktApprovedRoom .ktr-attend:after{color:#efb6ff;font-size:18px}.ktr-attend:before{content:'🪽 ';}.ktr-attend:after{content:' 🪽';}
#ktApprovedRoom .ktr-more{width:20px;color:#fff;font-size:25px;font-weight:900;text-align:center}
#ktApprovedRoom .ktr-stage{position:absolute;left:7px;right:7px;top:72px;bottom:91px;border-radius:16px;overflow:hidden;background:#0a0d16;border:1px solid rgba(255,255,255,.11)}
#ktApprovedRoom .ktr-host-video{width:100%;height:100%;object-fit:cover;object-position:50% 50%;transform:scaleX(-1);background:#06070b}
#ktApprovedRoom .ktr-solo-shade{position:absolute;inset:0;background:linear-gradient(180deg,transparent 58%,rgba(0,0,0,.38));pointer-events:none}
#ktApprovedRoom .ktr-gifts{position:absolute;z-index:25;left:7px;right:7px;bottom:7px;height:78px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;padding:4px;border-radius:13px;background:rgba(3,4,8,.94);border:1px solid rgba(255,255,255,.16);box-shadow:0 -5px 20px #000b}
#ktApprovedRoom .ktr-gift{min-width:0;border:1px solid #ffffff2c;border-radius:10px;background:linear-gradient(180deg,#0d0f16,#050609);color:#fff;padding:3px 1px 4px;font-weight:900;text-align:center;overflow:hidden}
#ktApprovedRoom .ktr-gift i{display:block;font-style:normal;font-size:25px;line-height:28px;filter:drop-shadow(0 0 6px #ff4a9a66)}
#ktApprovedRoom .ktr-gift b{display:block;color:#ffd84d;font-size:9px;line-height:11px;white-space:nowrap}
#ktApprovedRoom .ktr-gift small{display:block;color:#fff;font-size:7.5px;line-height:9px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#ktApprovedRoom .ktr-gift.last small{color:#ff67d8}
#ktApprovedRoom .ktr-grid13{height:100%;padding:5px;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));grid-template-rows:repeat(3,minmax(0,1fr));gap:4px;background:radial-gradient(circle at 50% 18%,#15172b,#070911 68%)}
#ktApprovedRoom .ktr-seat{position:relative;min-width:0;min-height:0;border-radius:9px;overflow:hidden;background:linear-gradient(145deg,#20232d,#0c0e14);border:1px solid #ffffff26;display:flex;align-items:center;justify-content:center;color:#c7c7cd;font-size:9px;font-weight:900}
#ktApprovedRoom .ktr-seat.host{border:2px solid #ff4eb6;box-shadow:0 0 12px #ff3daf77;background:#090a0f}
#ktApprovedRoom .ktr-seat.host video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 50%;transform:scaleX(-1)}
#ktApprovedRoom .ktr-seat .num{position:absolute;left:4px;top:4px;z-index:2;width:19px;height:19px;border-radius:50%;display:grid;place-items:center;background:#ffffffc9;color:#222;font-size:10px;font-weight:950}
#ktApprovedRoom .ktr-seat.host .num{background:#ffd44c;color:#451400}
#ktApprovedRoom .ktr-seat .label{position:absolute;left:5px;right:5px;bottom:4px;z-index:2;color:#fff;text-shadow:0 1px 3px #000;font-size:8px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
#ktApprovedRoom .ktr-note{grid-column:4 / span 2;grid-row:3;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;color:#c3c7df;font-size:10px;line-height:1.4;border:0;background:transparent}
#ktApprovedRoom.subscriber{background:#090804}
#ktApprovedRoom.subscriber .ktr-stage{border-color:#d8ae32aa;box-shadow:inset 0 0 30px #c38a171a,0 0 14px #d6a92d33}
#ktApprovedRoom .ktr-sub-wrap{height:100%;padding:7px;display:grid;grid-template-columns:100px minmax(0,1.55fr) minmax(0,1fr) 96px;gap:6px;background:radial-gradient(circle at 50% 30%,#241b08,#090804 67%)}
#ktApprovedRoom .ktr-sub-side{padding:10px 5px;color:#ffe391;font-size:9px;line-height:1.45;display:flex;flex-direction:column;justify-content:center;text-align:center}
#ktApprovedRoom .ktr-sub-side b{font-size:11px;color:#ffd452;margin-bottom:8px}.ktr-script{font-family:cursive;font-size:18px;color:#eabf53;margin-top:14px}
#ktApprovedRoom .ktr-sub-host{position:relative;border:2px solid #e8be43;border-radius:12px;overflow:hidden;background:#080808;box-shadow:0 0 14px #dba62955}
#ktApprovedRoom .ktr-sub-host video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 50%;transform:scaleX(-1)}
#ktApprovedRoom .ktr-sub-host span{position:absolute;left:7px;bottom:6px;padding:3px 7px;border-radius:8px;background:#0009;color:#ffeaa1;font-size:9px;font-weight:950}
#ktApprovedRoom .ktr-sub-guests{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:1fr 1fr;gap:5px}
#ktApprovedRoom .ktr-sub-guest{position:relative;border:1px solid #d8ad42;border-radius:9px;background:linear-gradient(145deg,#2a2414,#0d0c08);display:flex;align-items:center;justify-content:center;color:#e5ca78;font-size:9px;font-weight:900}
#ktApprovedRoom .ktr-sub-guest span{position:absolute;left:4px;bottom:3px;color:#fff;font-size:8px}
@media(max-width:390px){
 #ktApprovedRoom .ktr-head{left:4px;right:4px;gap:4px;padding:4px}.ktr-roomname{font-size:16px!important;padding:6px 9px!important}.ktr-time{font-size:12px!important}.ktr-onair{font-size:10px!important}.ktr-attend{min-width:121px!important;height:43px!important;font-size:16px!important;padding:0 6px!important}.ktr-more{font-size:21px!important}
 #ktApprovedRoom .ktr-stage{left:4px;right:4px;top:68px;bottom:85px}.ktr-gifts{left:4px!important;right:4px!important;height:72px!important}.ktr-gift i{font-size:22px!important;line-height:24px!important}.ktr-gift b{font-size:8px!important}.ktr-gift small{font-size:6.7px!important}
 #ktApprovedRoom .ktr-sub-wrap{grid-template-columns:72px minmax(0,1.45fr) minmax(0,.9fr) 66px;gap:4px;padding:5px}.ktr-sub-side{font-size:7.5px!important;padding:6px 2px!important}.ktr-sub-side b{font-size:9px!important}.ktr-script{font-size:14px!important}
}
`;
    document.head.appendChild(st);
  }

  function giftRow(){
    var gifts=[
      ['🌹','1개','장미'],['💐','50개','장미다발'],['💐','100개','특대장미'],['💗','10개','하트'],['👑','100개','왕관'],['🏎️','50개','스포츠카'],['🎁','','선물상자']
    ];
    return '<div class="ktr-gifts">'+gifts.map(function(g,i){
      return '<button type="button" class="ktr-gift'+(i===6?' last':'')+'" onclick="if(window.openGifts)openGifts()"><i>'+g[0]+'</i><b>'+g[1]+'</b><small>'+g[2]+(i===6?'<br>큰 선물 보기':'')+'</small></button>';
    }).join('')+'</div>';
  }

  function header(room){
    return '<div class="ktr-head">'
      +'<button class="ktr-back" type="button" onclick="if(window.endBroadcastEarnings)endBroadcastEarnings()">‹</button>'
      +'<div class="ktr-roomname">'+(room.type==='subscriber'?'👑 ':'')+esc(room.name)+'</div>'
      +'<div class="ktr-onair"><span class="ktr-dot"></span>ON AIR</div>'
      +'<div id="ktrElapsed" class="ktr-time">00:00:00</div>'
      +'<button class="ktr-attend" type="button" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck()">출석체크</button>'
      +'<div class="ktr-more">⋮</div>'
      +'</div>';
  }

  function soloBody(){
    return '<div class="ktr-stage">'
      +'<video id="ktLiveVideo" class="ktr-host-video" autoplay playsinline muted></video>'
      +'<div class="ktr-solo-shade"></div>'
      +'<div id="ktLiveEffectLayer" style="position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden"><div id="ktLiveFaceAnchor" class="kt-face-anchor"></div></div>'
      +'</div>';
  }

  function groupBody(){
    var cells='';
    for(var i=1;i<=13;i++){
      if(i===1){
        cells+='<div class="ktr-seat host"><video id="ktLiveVideo" autoplay playsinline muted></video><b class="num">1</b><span class="label">호스트</span></div>';
      }else{
        cells+='<div class="ktr-seat"><b class="num">'+i+'</b><span>게스트석</span><span class="label">게스트석</span></div>';
      }
    }
    cells+='<div class="ktr-note">좋은 사람들과<br>행복한 시간 ♡</div>';
    return '<div class="ktr-stage"><div class="ktr-grid13">'+cells+'</div><div id="ktLiveEffectLayer" style="position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden"><div id="ktLiveFaceAnchor" class="kt-face-anchor"></div></div></div>';
  }

  function subscriberBody(){
    return '<div class="ktr-stage">'
      +'<div class="ktr-sub-wrap">'
        +'<div class="ktr-sub-side"><b>👑 VIP 전용 공간</b><span>항상 함께해 주셔서<br>감사합니다 ♡</span><div class="ktr-script">Premium ♡</div></div>'
        +'<div class="ktr-sub-host"><video id="ktLiveVideo" autoplay playsinline muted></video><span>👑 호스트</span></div>'
        +'<div class="ktr-sub-guests"><div class="ktr-sub-guest">게스트석<span>게스트석</span></div><div class="ktr-sub-guest">게스트석<span>게스트석</span></div><div class="ktr-sub-guest">게스트석<span>게스트석</span></div><div class="ktr-sub-guest">게스트석<span>게스트석</span></div></div>'
        +'<div class="ktr-sub-side"><b>👑</b><span>구독자와<br>더 특별한 시간</span><div class="ktr-script">Always<br>Together ♡</div></div>'
      +'</div>'
      +'<div id="ktLiveEffectLayer" style="position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden"><div id="ktLiveFaceAnchor" class="kt-face-anchor"></div></div>'
      +'</div>';
  }

  function bindStream(){
    var v=document.getElementById('ktLiveVideo');
    try{
      if(v&&window.state&&state.stream){
        v.srcObject=state.stream;
        var p=v.play();if(p&&p.catch)p.catch(function(){});
      }
    }catch(e){}
  }

  function startTimer(){
    try{clearInterval(window.__ktApprovedRoomTimer);}catch(e){}
    var started=Date.now();
    try{
      if(window.state&&state.ktApprovedRoomStartedAt)started=state.ktApprovedRoomStartedAt;
      else if(window.state)state.ktApprovedRoomStartedAt=started;
    }catch(e){}
    function tick(){
      var el=document.getElementById('ktrElapsed');if(!el)return;
      var sec=Math.max(0,Math.floor((Date.now()-started)/1000));
      var h=String(Math.floor(sec/3600)).padStart(2,'0');
      var m=String(Math.floor((sec%3600)/60)).padStart(2,'0');
      var s=String(sec%60).padStart(2,'0');
      el.textContent=h+':'+m+':'+s;
    }
    tick();window.__ktApprovedRoomTimer=setInterval(tick,1000);
  }

  function render(room){
    if(room.type!=='solo'&&room.type!=='group'&&room.type!=='subscriber')return;
    installCss();
    try{
      if(window.state){state.liveRoomType=room.type;state.liveRoomName=room.name;state.liveRoomMax=room.max;state.currentLiveRoomTitle=room.name;}
    }catch(e){}
    var screenEl=document.getElementById('screen')||window.screen;if(!screenEl)return;
    screenEl.style.setProperty('padding','0','important');
    screenEl.style.setProperty('margin','0','important');
    screenEl.style.setProperty('height','calc(100dvh - 68px)','important');
    screenEl.style.setProperty('min-height','0','important');
    screenEl.style.setProperty('overflow','hidden','important');
    screenEl.style.setProperty('background','#05070e','important');
    var body=room.type==='solo'?soloBody():(room.type==='group'?groupBody():subscriberBody());
    screenEl.innerHTML='<section id="ktApprovedRoom" class="'+esc(room.type)+'">'+header(room)+body+giftRow()+'</section>';
    bindStream();
    startTimer();
    try{if(window.ktSetLivePresence)window.ktSetLivePresence(true);}catch(e){}
  }

  async function approvedStart(){
    var room=roomInfo();
    if(typeof baseStart!=='function')return;
    if(room.type!=='solo'&&room.type!=='group'&&room.type!=='subscriber')return baseStart.apply(this,arguments);

    var oldCountdown=window.ktLiveStartCountdown;
    try{window.ktLiveStartCountdown=async function(){};}catch(e){}
    var out;
    try{out=await baseStart.apply(this,arguments);}
    finally{try{window.ktLiveStartCountdown=oldCountdown;}catch(e){}}
    render(room);
    return out;
  }

  approvedStart.__ktSoloHostLiveFixed=true;
  approvedStart.__ktSept2Restored=true;
  approvedStart.__ktSoloHostLiveOriginal=baseStart;
  window.startBroadcast=approvedStart;
})();
