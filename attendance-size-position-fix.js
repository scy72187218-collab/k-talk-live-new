/* K-Talk LIVE: keep attendance boards consistent in all 4 rooms — narrower center board, slightly lower/bolder yellow text, animated LED. */
(function(){
  if(window.__ktAttendanceSizePositionFixLoaded)return;
  window.__ktAttendanceSizePositionFixLoaded=true;

  var st=document.createElement('style');
  st.id='ktAttendanceSizePositionFixCss';
  st.textContent='\
@keyframes ktAttendanceLedChase{\
  0%{background-position:0 0;box-shadow:inset 0 0 12px #ff37c44d,0 0 7px #ff40c9,0 0 18px #ff2ab9c7;}\
  35%{background-position:12px 0;box-shadow:inset 0 0 16px #ff62dc80,0 0 11px #ff5bd4,0 0 25px #ff2ab9e8;}\
  70%{background-position:24px 8px;box-shadow:inset 0 0 13px #ff37c45f,0 0 8px #ff40c9,0 0 20px #ff2ab9d8;}\
  100%{background-position:32px 8px;box-shadow:inset 0 0 12px #ff37c44d,0 0 7px #ff40c9,0 0 18px #ff2ab9c7;}\
}\
@keyframes ktAttendanceTextGlow{\
  0%,100%{text-shadow:0 0 5px #ffad18,0 0 9px #ff6900;}\
  50%{text-shadow:0 0 8px #ffe24d,0 0 14px #ff8a00,0 0 20px #ff5b00;}\
}\
/* 1인/13명/구독자 방송 */\
#ktSept2Live .kt-s2-attendance-stack{transform:translateY(9px)!important;}\
#ktSept2Live .kt-s2-attendance-stack .kt-s2-att-small{font-size:11px!important;font-weight:950!important;}\
#ktSept2Live .kt-s2-attendance-stack .kt-s2-att-large{width:92%!important;max-width:650px!important;justify-self:center!important;font-size:22px!important;font-weight:1000!important;line-height:1!important;animation:ktAttendanceLedChase 1.15s linear infinite!important;}\
#ktSept2Live .kt-s2-attendance-stack .kt-s2-att-large b{display:inline-block!important;transform:translateY(2px)!important;font-size:23px!important;font-weight:1000!important;letter-spacing:.1px!important;animation:ktAttendanceTextGlow 1.15s ease-in-out infinite!important;}\
/* 비밀방 */\
html.kt-password-reference body #ktSept2Live #ktPasswordAttendance{transform:translateY(9px)!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordAttendance .small{font-size:11px!important;font-weight:950!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordAttendance .large{width:92%!important;max-width:650px!important;margin-left:auto!important;margin-right:auto!important;font-size:23px!important;font-weight:1000!important;line-height:1!important;padding-top:2px!important;animation-name:ktAttendanceLedChase,ktAttendanceTextGlow!important;animation-duration:1.15s,1.15s!important;animation-timing-function:linear,ease-in-out!important;animation-iteration-count:infinite,infinite!important;}\
';
  document.head.appendChild(st);
})();
