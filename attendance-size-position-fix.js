/* K-Talk LIVE: enlarge only the yellow attendance text and move attendance boards slightly lower in all 4 rooms. */
(function(){
  if(window.__ktAttendanceSizePositionFixLoaded)return;
  window.__ktAttendanceSizePositionFixLoaded=true;

  var st=document.createElement('style');
  st.id='ktAttendanceSizePositionFixCss';
  st.textContent='\
/* 1인/13명/구독자 방송 */\
#ktSept2Live .kt-s2-attendance-stack{transform:translateY(5px)!important;}\
#ktSept2Live .kt-s2-attendance-stack .kt-s2-att-small{font-size:11px!important;font-weight:950!important;}\
#ktSept2Live .kt-s2-attendance-stack .kt-s2-att-large{font-size:22px!important;font-weight:950!important;line-height:1!important;}\
#ktSept2Live .kt-s2-attendance-stack .kt-s2-att-large b{font-size:22px!important;font-weight:950!important;}\
/* 비밀방 */\
html.kt-password-reference body #ktSept2Live #ktPasswordAttendance{transform:translateY(5px)!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordAttendance .small{font-size:11px!important;font-weight:950!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordAttendance .large{font-size:22px!important;font-weight:950!important;line-height:1!important;}\
';
  document.head.appendChild(st);
})();
