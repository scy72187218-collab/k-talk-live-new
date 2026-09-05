/* K-Talk: camera recovery is handled by permission-reuse.js.
   This file only adds the three missing UI pieces to 1-person / 13-person / subscriber rooms.
   Password room and all other UI are intentionally untouched. */
(function(){
  window.__ktCameraRecoveryLoaded=true;
  if(window.__ktThreeRoomsMissingUiLoaded)return;
  window.__ktThreeRoomsMissingUiLoaded=true;

  var clockTimer=null;
  var startedAt=0;

  function roomType(){
    try{return String((window.state&&state.liveRoomType)||'');}catch(e){return '';}
  }

  function isTargetRoom(){
    var t=roomType();
    if(t==='password')return false;
    if(t==='solo'||t==='group'||t==='group13'||t==='general'||t==='subscriber')return true;
    try{
      var title=document.querySelector('#ktSept2Live .kt-s2-title b,#ktSoloHostLive .kt-s2-title b');
      var s=title?title.textContent:'';
      return /1인 방송|13명 방송|구독자 방송|구독자방/.test(s) && !/비밀/.test(s);
    }catch(e){return false;}
  }

  function host(){
    return document.getElementById('ktSept2Live')||document.getElementById('ktSoloHostLive');
  }

  function addCss(){
    if(document.getElementById('ktThreeRoomsMissingUiCss'))return;
    var st=document.createElement('style');
    st.id='ktThreeRoomsMissingUiCss';
    st.textContent='\
#ktThreeRoomsMissingUi{position:absolute;inset:0;z-index:40;pointer-events:none;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif;}\
#ktThreeRoomsMissingUi .kt3-onair{position:absolute;left:30px;top:148px;height:48px;padding:0 15px;border:1px solid rgba(255,255,255,.18);border-radius:15px;background:rgba(22,20,27,.82);display:flex;align-items:center;gap:8px;color:#fff;font-size:15px;font-weight:950;box-shadow:0 4px 16px rgba(0,0,0,.2);font-variant-numeric:tabular-nums;}\
#ktThreeRoomsMissingUi .kt3-onair .dot{width:14px;height:14px;border-radius:50%;background:#ff315f;box-shadow:0 0 12px #ff315f;}\
#ktThreeRoomsMissingUi .kt3-onair .air{color:#ff4f73;}\
#ktThreeRoomsMissingUi .kt3-att{position:absolute;right:30px;top:141px;min-width:205px;height:58px;padding:0 18px;border:2px solid #ff43c7;border-radius:14px;background-color:#150916;background-image:radial-gradient(circle,rgba(255,89,207,.45) 0 1.3px,transparent 1.8px);background-size:8px 8px;box-shadow:inset 0 0 12px rgba(255,55,196,.24),0 0 8px #ff40c9,0 0 20px rgba(255,42,185,.62);display:flex;align-items:center;justify-content:center;gap:8px;color:#ffd348;font-size:19px;font-weight:950;text-shadow:0 0 5px #ffad18,0 0 10px #ff6900;pointer-events:auto;}\
#ktThreeRoomsMissingUi .kt3-att .wing{font-size:24px;filter:drop-shadow(0 0 5px #ff50d4);}\
#ktThreeRoomsMissingUi .kt3-att .heart{color:#ff4fae;text-shadow:0 0 7px #ff43bf;}\
#ktThreeRoomsMissingUi .kt3-gifts{position:absolute;left:0;right:0;bottom:78px;height:76px;background:#030305;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;padding:3px 3px 4px;border-top:0!important;box-shadow:none!important;pointer-events:auto;overflow:hidden;}\
#ktThreeRoomsMissingUi .kt3-gift{min-width:0;border:1px solid rgba(255,255,255,.18);border-radius:8px;background:linear-gradient(180deg,#09090b,#030304);color:#fff;padding:2px 1px;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1;overflow:hidden;}\
#ktThreeRoomsMissingUi .kt3-gift img{display:block;width:38px;height:36px;object-fit:contain;filter:drop-shadow(0 0 5px rgba(255,70,150,.25));}\
#ktThreeRoomsMissingUi .kt3-gift .emoji{height:36px;display:grid;place-items:center;font-size:28px;line-height:1;}\
#ktThreeRoomsMissingUi .kt3-gift b{display:block;margin-top:1px;color:#ffe16c;font-size:10px;font-weight:950;white-space:nowrap;}\
#ktThreeRoomsMissingUi .kt3-gift small{display:block;margin-top:2px;color:#fff;font-size:8px;font-weight:900;white-space:nowrap;}\
#ktThreeRoomsMissingUi .kt3-gift.box b{color:#fff;}\
#ktThreeRoomsMissingUi .kt3-gift.box small{color:#ff62ca;}\
#ktSept2Live.kt-three-ui #myEarnHud,#ktSoloHostLive.kt-three-ui #myEarnHud{position:absolute!important;left:50%!important;right:auto!important;top:auto!important;bottom:158px!important;transform:translateX(-50%)!important;width:258px!important;max-width:58vw!important;z-index:42!important;margin:0!important;}\
@media(max-width:430px){#ktThreeRoomsMissingUi .kt3-onair{left:16px;top:124px;height:43px;padding:0 12px;font-size:13px;}#ktThreeRoomsMissingUi .kt3-att{right:16px;top:118px;min-width:178px;height:52px;padding:0 11px;font-size:16px;gap:5px;}#ktThreeRoomsMissingUi .kt3-att .wing{font-size:20px;}#ktThreeRoomsMissingUi .kt3-gifts{bottom:76px;height:72px;}#ktThreeRoomsMissingUi .kt3-gift img{width:33px;height:32px;}#ktThreeRoomsMissingUi .kt3-gift .emoji{height:32px;font-size:25px;}#ktThreeRoomsMissingUi .kt3-gift b{font-size:9px;}#ktThreeRoomsMissingUi .kt3-gift small{font-size:7px;}#ktSept2Live.kt-three-ui #myEarnHud,#ktSoloHostLive.kt-three-ui #myEarnHud{bottom:152px!important;width:238px!important;}}\
';
    document.head.appendChild(st);
  }

  function fmt(ms){
    var s=Math.max(0,Math.floor(ms/1000));
    var h=Math.floor(s/3600);s%=3600;
    var m=Math.floor(s/60),sec=s%60;
    return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(sec).padStart(2,'0');
  }

  function startClock(){
    if(!startedAt)startedAt=Date.now();
    clearInterval(clockTimer);
    function tick(){
      var el=document.getElementById('ktThreeRoomClock');
      if(!el){clearInterval(clockTimer);clockTimer=null;return;}
      el.textContent=fmt(Date.now()-startedAt);
    }
    tick();
    clockTimer=setInterval(tick,1000);
  }

  function gift(img,emoji,count,label,extraClass){
    var art=img?'<img src="'+img+'" alt="">':'<span class="emoji">'+emoji+'</span>';
    return '<button type="button" class="kt3-gift '+(extraClass||'')+'" onclick="if(window.openGifts)openGifts()">'+art+'<b>'+count+'</b><small>'+label+'</small></button>';
  }

  function install(){
    if(!isTargetRoom())return;
    var h=host();
    if(!h)return;
    if(document.getElementById('ktThreeRoomsMissingUi'))return;

    addCss();
    h.classList.add('kt-three-ui');

    var wrap=document.createElement('div');
    wrap.id='ktThreeRoomsMissingUi';
    wrap.innerHTML=''
      +'<div class="kt3-onair"><span class="dot"></span><span class="air">ON AIR</span><span id="ktThreeRoomClock">00:00:00</span></div>'
      +'<button type="button" class="kt3-att" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck();else if(window.openAttendanceBenefits)openAttendanceBenefits();"><span class="wing">🪽</span><span>출석체크</span><span class="heart">♥</span><span class="wing">🪽</span></button>'
      +'<div class="kt3-gifts" aria-label="선물 바로가기">'
        +gift('rose-single.svg','', '1개','장미','')
        +gift('rose-bouquet-50.svg','', '50개','장미다발','')
        +gift('rose-bouquet-100.svg','', '100개','특대장미','')
        +gift('', '💗','10개','하트','')
        +gift('', '👑','100개','왕관','')
        +gift('', '🏎️','50개','스포츠카','')
        +gift('gift-box.svg','', '선물상자','큰 선물 보기','box')
      +'</div>';
    h.appendChild(wrap);
    startClock();
  }

  function cleanIfNeeded(){
    if(isTargetRoom())return;
    var old=document.getElementById('ktThreeRoomsMissingUi');
    if(old)old.remove();
    var h=host();if(h)h.classList.remove('kt-three-ui');
    clearInterval(clockTimer);clockTimer=null;startedAt=0;
  }

  var pending=false;
  function schedule(){
    if(pending)return;
    pending=true;
    setTimeout(function(){pending=false;cleanIfNeeded();install();},70);
  }

  try{
    new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        if(muts[i].addedNodes&&muts[i].addedNodes.length){schedule();break;}
      }
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  document.addEventListener('click',function(){setTimeout(schedule,120);},true);
  setTimeout(schedule,100);
  setTimeout(schedule,600);
})();
