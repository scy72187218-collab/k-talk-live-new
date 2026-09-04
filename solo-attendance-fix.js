/* K-Talk: 출석체크 LED 간판. 1인방/13명방/구독자방만, 다른 UI는 그대로. */
(function(){
  if(window.__ktAttendanceLed3Rooms)return;
  window.__ktAttendanceLed3Rooms=true;

  function markRoom(){
    var t='';
    try{t=(window.state&&state.liveRoomType)||'';}catch(e){}
    var ok=t==='solo'||t==='group13'||t==='subscriber';
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
@media(max-width:380px){.kt-att-led-target .kt-live-attendance{left:130px!important;right:5px!important;font-size:12px!important}.kt-att-led-target .kt-live-attendance .badge{font-size:12px!important}#ktSoloHostLive .kt-sa-att{left:136px!important;right:44px!important}#ktSoloHostLive .kt-sa-att:before{font-size:12px!important}}\
';
  document.head.appendChild(s);
  markRoom();
  setInterval(markRoom,700);
})();
