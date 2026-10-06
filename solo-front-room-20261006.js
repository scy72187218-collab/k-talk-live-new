/* K-Talk 1인방 전용 복구 2026-10-06
   13명방 게스트방의 상단/하단 구성을 가져오고,
   가운데는 호스트 전면 카메라만 크게 표시한다.
   다른 방은 건드리지 않는다. */
(function(){
  if(window.__ktSoloFrontRoom20261006)return;
  window.__ktSoloFrontRoom20261006=true;

  function css(){
    if(document.getElementById('ktSoloFrontRoomStyle20261006'))return;
    var s=document.createElement('style'); s.id='ktSoloFrontRoomStyle20261006';
    s.textContent=`
#screen .ktsolo-room{position:fixed!important;inset:0!important;z-index:70!important;background:#050507!important;color:#fff!important;display:flex!important;flex-direction:column!important;overflow:hidden!important;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif!important}
.ktsolo-top{height:72px;flex:0 0 72px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:8px 12px;background:#111116;border-bottom:1px solid #ffffff18}
.ktsolo-title{font-size:22px;font-weight:950}.ktsolo-title small{display:block;margin-top:3px;color:#ff516d;font-size:10px}.ktsolo-att{padding:8px 14px;border:2px solid #ff45d4;border-radius:999px;background:#261126;color:#ffd94d;font-size:12px;font-weight:950;box-shadow:0 0 13px #ff2fd7}.ktsolo-brand{text-align:right;color:#ff527d;font-size:17px;font-weight:950}
.ktsolo-led{height:52px;flex:0 0 52px;margin:4px 8px;border:3px solid #ff43cf;border-radius:22px;display:flex;align-items:center;justify-content:center;background:#211020;color:#ffd93d;font-size:17px;font-weight:950;white-space:nowrap;overflow:hidden;box-shadow:0 0 16px #ff2ed1,inset 0 0 14px #ff2ed155}
.ktsolo-three{height:42px;flex:0 0 42px;display:grid;grid-template-columns:repeat(3,1fr);gap:5px;padding:0 8px 4px}.ktsolo-three button{border:1px solid #ffffff22;border-radius:10px;background:#17171b;color:#fff;font-size:12px;font-weight:950}
.ktsolo-video{position:relative;flex:1 1 auto;min-height:0;margin:0 8px;background:#000;overflow:hidden;border-radius:8px}.ktsolo-video video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:center center;transform:scaleX(-1);background:#000}.ktsolo-video .solo-label{position:absolute;left:8px;bottom:8px;z-index:2;padding:4px 8px;border-radius:10px;background:#0009;font-size:10px;font-weight:900}
.ktsolo-bottom{height:66px;flex:0 0 66px;display:grid;grid-template-columns:minmax(120px,1fr) repeat(5,48px);gap:5px;align-items:center;padding:6px 8px calc(6px + env(safe-area-inset-bottom));background:#09090d;border-top:1px solid #ffffff22}
.ktsolo-chat{height:46px;border:1px solid #ffffff2e;border-radius:23px;background:#17171d;color:#fff;padding:0 14px;font-size:14px;font-weight:800;outline:0}.ktsolo-bottom button{width:46px;height:46px;border:1px solid #ffffff22;border-radius:50%;background:#15151a;color:#fff;font-size:21px}.ktsolo-bottom .gift{background:#5b351d}
@media(max-width:380px){.ktsolo-bottom{grid-template-columns:minmax(100px,1fr) repeat(5,42px);gap:3px}.ktsolo-bottom button{width:40px;height:40px}.ktsolo-led{font-size:15px}}
`;
    (document.head||document.documentElement).appendChild(s);
  }
  function call(names){
    for(var i=0;i<names.length;i++){try{if(typeof window[names[i]]==='function')return window[names[i]]();}catch(e){}}
  }
  async function camera(){
    var st=null;
    try{
      if(window.state&&state.stream&&state.stream.getVideoTracks().some(function(t){return t.readyState==='live';}))st=state.stream;
    }catch(e){}
    if(!st)try{
      st=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:true});
      if(window.state)state.stream=st;
    }catch(e){alert('카메라와 마이크를 허용해 주세요.');}
    var v=document.getElementById('ktSoloFrontVideo');
    if(v&&st){v.srcObject=st;v.muted=true;v.defaultMuted=true;try{await v.play();}catch(e){}}
  }
  function leave(){
    try{if(window.state&&state.stream){state.stream.getTracks().forEach(function(t){t.stop();});state.stream=null;}}catch(e){}
    try{if(typeof window.home==='function')return window.home();}catch(e){}
    location.reload();
  }
  function render(){
    css();
    try{document.body.classList.remove('kt-home','kt-video-mode');}catch(e){}
    var sc=document.getElementById('screen'); if(!sc)return false;
    sc.innerHTML='<section class="ktsolo-room" data-kt-room="solo">'
      +'<div class="ktsolo-top"><div class="ktsolo-title">🔴 1인 방송<small>● ON AIR</small></div><button class="ktsolo-att" type="button">💗 출석체크</button><div class="ktsolo-brand">K-Talk LIVE</div></div>'
      +'<div class="ktsolo-led">💗 K-Talk LIVE 환영합니다 ✨ 즐거운 방송 되세요</div>'
      +'<div class="ktsolo-three"><button type="button" id="ktSoloFlip">↻ 되돌리기</button><button type="button" id="ktSoloTreasure">🎁 보물상자</button><button type="button" id="ktSoloMatch">⚔ 매치</button></div>'
      +'<div class="ktsolo-video"><video id="ktSoloFrontVideo" autoplay muted playsinline></video><span class="solo-label">호스트</span></div>'
      +'<div class="ktsolo-bottom"><input id="ktSoloChat" class="ktsolo-chat" placeholder="입력하세요..." /><button id="ktSoloSend" type="button">➤</button><button id="ktSoloPeople" type="button">👥</button><button id="ktSoloRose" type="button">🌹</button><button id="ktSoloGift" class="gift" type="button">🎁</button><button id="ktSoloShare" type="button">↗</button></div>'
      +'</section>';
    document.getElementById('ktSoloFlip').onclick=function(){call(['ktUnifiedQuickFlip','ktAllRoomsFlipCamera','flipCamera']);};
    document.getElementById('ktSoloTreasure').onclick=function(){call(['placeTreasureChest','openTreasureBox','openTreasure','openPackageBox']);};
    document.getElementById('ktSoloMatch').onclick=function(){call(['openMatch','openMatchArena']);};
    document.getElementById('ktSoloPeople').onclick=function(){call(['openViewerList','openParticipants','openPeople']);};
    document.getElementById('ktSoloRose').onclick=function(){call(['openGifts','openGiftSheet']);};
    document.getElementById('ktSoloGift').onclick=function(){call(['openGifts','openGiftSheet']);};
    document.getElementById('ktSoloShare').onclick=function(){call(['shareApp','shareLive']);};
    document.getElementById('ktSoloSend').onclick=function(){
      var i=document.getElementById('ktSoloChat'); if(!i||!i.value.trim())return;
      try{if(typeof window.sendChat==='function')window.sendChat(i.value.trim());}catch(e){}
      i.value='';
    };
    camera(); return true;
  }
  window.ktOpenSoloFrontRoom20261006=render;
  var old=window.ktStartRoomNow;
  window.ktStartRoomNow=function(type,name,max){
    if(type==='solo'||Number(max)===1||/1인/.test(String(name||''))){
      try{if(window.state){state.liveRoomType='solo';state.liveRoomName='1인 방송';state.liveRoomMax=1;}}catch(e){}
      return render();
    }
    return typeof old==='function'?old.apply(this,arguments):false;
  };
  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('button'):null;if(!b)return;
    if(/1인 방송/.test(String(b.textContent||''))){
      setTimeout(function(){
        try{
          var prep=document.querySelector('.live-prep');
          if(prep&&!prep.querySelector('[data-kt-solo-start]')){
            var start=prep.querySelector('.prep-start');
            if(start){start.setAttribute('data-kt-solo-start','1');start.textContent='1인 방송 시작';start.onclick=function(ev){ev.preventDefault();ev.stopPropagation();window.ktStartRoomNow('solo','1인 방송',1);return false;};}
          }
        }catch(_e){}
      },50);
    }
  },true);
})();