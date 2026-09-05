/* K-Talk: 출석체크 LED 간판. 1인방/13명방/구독자방만, 다른 UI는 그대로. */
(function(){
  if(window.__ktAttendanceLed3Rooms)return;
  window.__ktAttendanceLed3Rooms=true;

  function roomType(){
    try{return (window.state&&state.liveRoomType)||'';}catch(e){return '';}
  }

  function markRoom(){
    var t=roomType();
    var ok=t==='solo'||t==='group'||t==='group13'||t==='subscriber';
    document.documentElement.classList.toggle('kt-att-led-target',ok);
    document.documentElement.classList.toggle('kt-compact-two-room',t==='group'||t==='group13'||t==='subscriber');
  }

  var s=document.createElement('style');
  s.id='ktAttendanceLed3RoomsStyle';
  s.textContent='\
.kt-att-led-target .kt-live-airclock{left:10px!important;right:auto!important;top:64px!important;z-index:21!important;}\
.kt-att-led-target .kt-live-attendance{left:142px!important;right:8px!important;top:60px!important;width:auto!important;height:42px!important;transform:none!important;z-index:22!important;border:2px solid #ff42c7!important;border-radius:8px!important;padding:0 8px!important;background-color:#100710!important;background-image:radial-gradient(circle,rgba(255,83,207,.42) 0 1px,transparent 1.5px)!important;background-size:6px 6px!important;box-shadow:inset 0 0 10px #ff37c43d,0 0 7px #ff40c9,0 0 16px #ff2ab99c!important;color:#ffd447!important;font-size:14px!important;font-weight:950!important;text-shadow:0 0 5px #ffad18,0 0 9px #ff6900!important;display:flex!important;align-items:center!important;justify-content:center!important;white-space:nowrap!important;}\
.kt-att-led-target .kt-live-attendance .wing{display:none!important;}\
.kt-att-led-target .kt-live-attendance .badge{width:100%!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;color:#ffd447!important;font-size:14px!important;font-weight:950!important;letter-spacing:.6px!important;}\
.kt-att-led-target .kt-live-attendance .heart{color:#ff5bc9!important;text-shadow:0 0 6px #ff42bf!important;}\
.kt-att-led-target .kt-live-attendance:before,.kt-att-led-target .kt-live-attendance:after{content:""!important;position:absolute!important;top:9px!important;width:22px!important;height:20px!important;border-top:3px solid #ff58d1!important;border-bottom:3px solid #ff58d1!important;filter:drop-shadow(0 0 4px #ff39c7)!important;}\
.kt-att-led-target .kt-live-attendance:before{left:-25px!important;transform:skewY(18deg)!important;border-left:3px solid #ff58d1!important;}\
.kt-att-led-target .kt-live-attendance:after{right:-25px!important;transform:skewY(-18deg)!important;border-right:3px solid #ff58d1!important;}\
#ktSoloHostLive .kt-sa-att{font-size:0!important;position:absolute!important;left:148px!important;right:48px!important;top:2px!important;width:auto!important;height:40px!important;margin:0!important;padding:0!important;border:2px solid #ff42c7!important;border-radius:8px!important;background-color:#100710!important;background-image:radial-gradient(circle,rgba(255,83,207,.42) 0 1px,transparent 1.5px)!important;background-size:6px 6px!important;box-shadow:inset 0 0 10px #ff37c43d,0 0 7px #ff40c9,0 0 16px #ff2ab99c!important;color:#ffd447!important;}\
#ktSoloHostLive .kt-sa-att:before{content:"출석체크  ♥"!important;font-size:13px!important;font-weight:950!important;letter-spacing:.5px!important;color:#ffd447!important;text-shadow:0 0 5px #ffad18,0 0 9px #ff6900!important;}\
#ktSoloHostLive .kt-sa-clock{order:-1!important;}\
html body #ktSept2Live.kt-added-ui-room{height:100vh!important;height:100svh!important;min-height:100vh!important;min-height:100svh!important;overflow:hidden!important;}\
html body #ktSept2Live.kt-added-ui-room #ktLiveVideo{transition:none!important;animation:none!important;will-change:auto!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-live{min-height:48px!important;padding:5px 9px!important;border-radius:15px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-left b{font-size:17px!important;gap:5px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-left small{font-size:11px!important;gap:4px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-left i{width:12px!important;height:12px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-left small i{width:8px!important;height:8px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-left strong{font-size:11px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-live>span{font-size:15px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-attendance-stack{position:absolute!important;top:0!important;left:0!important;right:0!important;transform:none!important;width:100%!important;max-width:none!important;margin:0!important;gap:0!important;z-index:12!important;display:flex!important;flex-direction:column!important;align-items:center!important;animation:none!important;transition:none!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-attendance-stack button{border-width:1px!important;background-size:6px 6px!important;box-shadow:inset 0 0 7px #ff37c43d,0 0 5px #ff40c9,0 0 10px #ff2ab990!important;animation:none!important;transition:none!important;transform:none!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-att-small{height:22px!important;min-width:0!important;width:128px!important;padding:0 6px!important;border-radius:10px!important;font-size:10px!important;margin:0!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-att-large{width:100%!important;height:30px!important;padding:0 7px!important;border-radius:12px!important;font-size:14px!important;margin-top:30px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row{left:5px!important;right:5px!important;bottom:72px!important;height:60px!important;gap:2px!important;padding:2px 2px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row button{height:54px!important;padding:1px 0!important;border-radius:7px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row .gift-img{width:22px!important;height:22px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row .gift-emoji{height:22px!important;font-size:18px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row b{margin-top:1px!important;font-size:8px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row small{margin-top:0!important;font-size:6px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row .gift-box+b{font-size:6px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-right{right:7px!important;bottom:150px!important;gap:6px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-like{width:46px!important;min-height:52px!important;border-radius:15px!important;font-size:18px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-circle{width:46px!important;height:46px!important;}\
html body #ktSept2Live.kt-added-ui-room #myEarnHud{position:fixed!important;left:50%!important;bottom:140px!important;transform:translateX(-50%)!important;width:40%!important;max-width:180px!important;padding:3px 6px!important;border-radius:10px!important;z-index:9!important;font-size:8px!important;}\
html body #ktSept2Live.kt-added-ui-room #myEarnHud #hudEarnNet{font-size:12px!important;}\
html body #ktSept2Live.kt-added-ui-room #myEarnHud #myEarnDetail{margin-top:1px!important;font-size:7px!important;}\
html.kt-compact-two-room body #ktSept2Live .kt-s2-gift-row{left:5px!important;right:5px!important;bottom:72px!important;height:60px!important;gap:2px!important;padding:2px!important;}\
html.kt-compact-two-room body #ktSept2Live .kt-s2-gift-row button{height:54px!important;padding:1px 0!important;border-radius:7px!important;}\
html.kt-compact-two-room body #ktSept2Live .kt-s2-gift-row .gift-img{width:22px!important;height:22px!important;}\
html.kt-compact-two-room body #ktSept2Live .kt-s2-gift-row .gift-emoji{height:22px!important;font-size:18px!important;}\
html.kt-compact-two-room body #ktSept2Live .kt-s2-gift-row b{margin-top:1px!important;font-size:8px!important;}\
html.kt-compact-two-room body #ktSept2Live .kt-s2-gift-row small{margin-top:0!important;font-size:6px!important;}\
html.kt-compact-two-room body #ktSept2Live #myEarnHud{position:fixed!important;left:50%!important;bottom:140px!important;transform:translateX(-50%)!important;width:40%!important;max-width:180px!important;padding:3px 6px!important;border-radius:10px!important;z-index:9!important;font-size:8px!important;}\
html.kt-compact-two-room body #ktSept2Live #myEarnHud #hudEarnNet{font-size:12px!important;}\
html.kt-compact-two-room body #ktSept2Live #myEarnHud #myEarnDetail{margin-top:1px!important;font-size:7px!important;}\
@media(max-width:380px){.kt-att-led-target .kt-live-attendance{left:130px!important;right:5px!important;font-size:12px!important}.kt-att-led-target .kt-live-attendance .badge{font-size:12px!important}#ktSoloHostLive .kt-sa-att{left:136px!important;right:44px!important}#ktSoloHostLive .kt-sa-att:before{font-size:12px!important}html body #ktSept2Live.kt-added-ui-room .kt-s2-att-small{width:116px!important}html body #ktSept2Live.kt-added-ui-room .kt-s2-att-large{font-size:13px!important}html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row small{font-size:6px!important}}\
';
  document.head.appendChild(s);

  function forceFrontCameraLayout(){
    var section=document.getElementById('ktSept2Live');
    var v=document.getElementById('ktLiveVideo');
    if(!section||!v||!section.classList.contains('kt-added-ui-room'))return;
    var stableH=(window.CSS&&CSS.supports&&CSS.supports('height','100svh'))?'100svh':'100vh';
    section.style.setProperty('padding','0','important');
    section.style.setProperty('margin','0','important');
    section.style.setProperty('width','100%','important');
    section.style.setProperty('height',stableH,'important');
    section.style.setProperty('min-height',stableH,'important');
    v.style.setProperty('position','absolute','important');
    v.style.setProperty('inset','0','important');
    v.style.setProperty('left','0','important');
    v.style.setProperty('top','0','important');
    v.style.setProperty('width','100%','important');
    v.style.setProperty('height','100%','important');
    v.style.setProperty('max-width','none','important');
    v.style.setProperty('max-height','none','important');
    v.style.setProperty('object-fit','cover','important');
    v.style.setProperty('object-position','50% 50%','important');
    v.style.setProperty('transform','scaleX(-1)','important');
    v.style.setProperty('border-radius','0','important');
    v.style.setProperty('transition','none','important');
    v.style.setProperty('animation','none','important');
    v.dataset.ktStableCamera='1';
  }

  function forceCompactTwoRooms(){
    var t=roomType();
    if(!(t==='group'||t==='group13'||t==='subscriber'))return;
    var gifts=document.querySelector('#ktSept2Live .kt-s2-gift-row');
    if(gifts&&!gifts.dataset.ktCompactTwoRoom){
      gifts.dataset.ktCompactTwoRoom='1';
      gifts.style.setProperty('left','5px','important');
      gifts.style.setProperty('right','5px','important');
      gifts.style.setProperty('height','60px','important');
      gifts.style.setProperty('padding','2px','important');
    }
    var hud=document.querySelector('#ktSept2Live #myEarnHud');
    if(hud&&!hud.dataset.ktCompactTwoRoom){
      hud.dataset.ktCompactTwoRoom='1';
      hud.style.setProperty('position','fixed','important');
      hud.style.setProperty('left','50%','important');
      hud.style.setProperty('bottom','140px','important');
      hud.style.setProperty('transform','translateX(-50%)','important');
      hud.style.setProperty('width','40%','important');
      hud.style.setProperty('max-width','180px','important');
      hud.style.setProperty('padding','3px 6px','important');
      hud.style.setProperty('font-size','8px','important');
    }
  }

  markRoom();
  forceFrontCameraLayout();
  forceCompactTwoRooms();
  setInterval(markRoom,700);

  var observer=new MutationObserver(function(){
    markRoom();
    var v=document.getElementById('ktLiveVideo');
    if(v&&!v.dataset.ktStableCamera)forceFrontCameraLayout();
    forceCompactTwoRooms();
  });
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();
