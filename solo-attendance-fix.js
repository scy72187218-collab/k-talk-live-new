/* K-Talk: 출석체크 LED 간판. 1인방/13명방/구독자방만, 다른 UI는 그대로. */
(function(){
  if(window.__ktAttendanceLed3Rooms)return;
  window.__ktAttendanceLed3Rooms=true;

  function markRoom(){
    var t='';
    try{t=(window.state&&state.liveRoomType)||'';}catch(e){}
    var ok=t==='solo'||t==='group'||t==='group13'||t==='subscriber';
    document.documentElement.classList.toggle('kt-att-led-target',ok);
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
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-live{min-height:48px!important;padding:5px 9px!important;border-radius:15px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-left b{font-size:17px!important;gap:5px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-left small{font-size:11px!important;gap:4px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-left i{width:12px!important;height:12px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-left small i{width:8px!important;height:8px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-left strong{font-size:11px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-title-live>span{font-size:15px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-attendance-stack{position:absolute!important;top:0!important;left:50%!important;transform:translateX(-50%)!important;width:42%!important;max-width:190px!important;margin:0!important;gap:0!important;z-index:12!important;align-items:center!important;animation:none!important;transition:none!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-attendance-stack button{border-width:1px!important;background-size:6px 6px!important;box-shadow:inset 0 0 7px #ff37c43d,0 0 5px #ff40c9,0 0 10px #ff2ab990!important;animation:none!important;transition:none!important;transform:none!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-att-small{height:22px!important;min-width:0!important;width:62%!important;padding:0 6px!important;border-radius:10px 10px 0 0!important;font-size:10px!important;margin:0!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-att-large{width:100%!important;height:30px!important;padding:0 7px!important;border-radius:0 0 12px 12px!important;font-size:14px!important;margin-top:-1px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row{left:3px!important;right:3px!important;bottom:72px!important;height:70px!important;gap:2px!important;padding:3px 2px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row button{height:62px!important;padding:2px 0!important;border-radius:7px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row .gift-img{width:26px!important;height:26px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row .gift-emoji{height:26px!important;font-size:21px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row b{margin-top:1px!important;font-size:9px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row small{margin-top:1px!important;font-size:7px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row .gift-box+b{font-size:7px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-right{right:7px!important;bottom:150px!important;gap:6px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-like{width:46px!important;min-height:52px!important;border-radius:15px!important;font-size:18px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-circle{width:46px!important;height:46px!important;}\
html body #ktSept2Live.kt-added-ui-room #myEarnHud{position:fixed!important;left:50%!important;bottom:148px!important;transform:translateX(-50%)!important;width:46%!important;max-width:210px!important;padding:4px 7px!important;border-radius:11px!important;z-index:9!important;font-size:9px!important;}\
html body #ktSept2Live.kt-added-ui-room #myEarnHud #hudEarnNet{font-size:13px!important;}\
html body #ktSept2Live.kt-added-ui-room #myEarnHud #myEarnDetail{margin-top:2px!important;font-size:8px!important;}\
@media(max-width:380px){.kt-att-led-target .kt-live-attendance{left:130px!important;right:5px!important;font-size:12px!important}.kt-att-led-target .kt-live-attendance .badge{font-size:12px!important}#ktSoloHostLive .kt-sa-att{left:136px!important;right:44px!important}#ktSoloHostLive .kt-sa-att:before{font-size:12px!important}html body #ktSept2Live.kt-added-ui-room .kt-s2-attendance-stack{width:40%!important}html body #ktSept2Live.kt-added-ui-room .kt-s2-att-large{font-size:13px!important}html body #ktSept2Live.kt-added-ui-room .kt-s2-gift-row small{font-size:6px!important}}\
';
  document.head.appendChild(s);

  function forceFrontCameraLayout(){
    var section=document.getElementById('ktSept2Live');
    var v=document.getElementById('ktLiveVideo');
    if(!section||!v||!section.classList.contains('kt-added-ui-room'))return;
    section.style.setProperty('padding','0','important');
    section.style.setProperty('margin','0','important');
    section.style.setProperty('width','100%','important');
    section.style.setProperty('height','100dvh','important');
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
  }

  markRoom();
  forceFrontCameraLayout();
  setInterval(function(){markRoom();forceFrontCameraLayout();},500);
})();
