/* K-Talk 1인방 우측 옛 버튼 제거 + 하단 새 버튼 + 상단 출석하트 */
(function(){
 if(window.__ktSoloControlsRebuild20261006)return; window.__ktSoloControlsRebuild20261006=true;
 function stream(room){try{if(window.state&&state.stream)return state.stream}catch(e){} var v=room.querySelector('video');return v&&v.srcObject||null}
 function cam(b,r){var s=stream(r),a=s&&s.getVideoTracks?s.getVideoTracks():[];if(!a.length&&window.toggleCreatorCamera)return window.toggleCreatorCamera();var on=a.some(t=>t.enabled!==false);a.forEach(t=>t.enabled=!on);b.classList.toggle('off',on)}
 function mic(b,r){var s=stream(r),a=s&&s.getAudioTracks?s.getAudioTracks():[];var on=a.some(t=>t.enabled!==false);a.forEach(t=>t.enabled=!on);b.classList.toggle('off',on)}
 function btn(icon,label,fn){var b=document.createElement('button');b.type='button';b.innerHTML='<b>'+icon+'</b><small>'+label+'</small>';b.onclick=function(e){e.preventDefault();e.stopPropagation();fn(b)};return b}
 function run(){
  var r=document.querySelector('#screen .ktsolo-room'); if(!r)return;
  /* 1111: 1인방 하단 홈/친구/방송하기/사용방법/프로필 + 선물/마이크/카메라 전부 삭제 */
  document.querySelectorAll('.kt-solo-new-bottom-20261006').forEach(function(x){x.remove();});
  document.querySelectorAll('nav,footer,.bottom-nav,.bottomnav,.app-bottom-nav,#bottomNav').forEach(function(x){
    var t=String(x.textContent||'').replace(/\s+/g,'');
    if(t.indexOf('홈')>=0&&t.indexOf('친구')>=0&&t.indexOf('방송하기')>=0&&t.indexOf('프로필')>=0)x.remove();
  });
  /* 기존 우측 선물/카메라/마이크는 DOM에서 제거 */
  r.querySelectorAll('.ktsolo-right').forEach(function(box){Array.from(box.children).forEach(function(x){var t=(x.textContent||'').replace(/\s+/g,'');if(/선물|카메라|마이크/.test(t))x.remove()})});
  return;\n  var bar=r.querySelector('.kt-solo-new-bottom-20261006');
  if(!bar){bar=document.createElement('div');bar.className='kt-solo-new-bottom-20261006';bar.appendChild(btn('📷','카메라',b=>cam(b,r)));bar.appendChild(btn('🎤','마이크',b=>mic(b,r)));bar.appendChild(btn('🎁','선물',()=>{if(window.openGifts)window.openGifts()}));var chat=r.querySelector('.ktsolo-chat,.ktsolo-chatbar,.ktsolo-bottom,.ktsolo-tools');(chat&&chat.parentNode?chat.parentNode:r).insertBefore(bar,chat?chat.nextSibling:null)}
  var h=r.querySelector('.kt-solo-top-attendance-20261006');if(!h){h=document.createElement('button');h.className='kt-solo-top-attendance-20261006';h.innerHTML='♥ <b>출석체크</b>';h.onclick=function(e){e.stopPropagation();if(window.ktAttendanceCheck)window.ktAttendanceCheck()};r.appendChild(h)}
 }
 var s=document.createElement('style');s.textContent='.kt-solo-new-bottom-20261006{display:flex!important;gap:8px!important;align-items:center!important;justify-content:flex-end!important;padding:4px 8px!important;z-index:500!important}.kt-solo-new-bottom-20261006 button{width:52px!important;height:42px!important;border-radius:50%!important;background:#17171d!important;color:#fff!important;border:1px solid #555!important}.kt-solo-new-bottom-20261006 b{display:block!important;font-size:17px!important}.kt-solo-new-bottom-20261006 small{font-size:8px!important}.kt-solo-top-attendance-20261006{position:absolute!important;top:8px!important;left:50%!important;transform:translateX(-50%)!important;z-index:900!important;border-radius:999px!important;padding:7px 12px!important;background:rgba(20,10,18,.88)!important;color:#ff65ad!important;border:1px solid #ff65ad!important;font-weight:900!important}';document.head.appendChild(s);
 run();setInterval(run,500);new MutationObserver(run).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
})();