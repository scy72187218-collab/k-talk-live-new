/* K-Talk remote 9-room bottom fixed lock — 2026-10-01 — 5555
   VISUAL ONLY for side/remote 9-room screens.
   Lock chat input, chat messages, and earnings so they never jump vertically.
   Do not touch host room, signaling, approval, camera/mic, grid, gifts, or button actions.
*/
(function(){
  if(window.__ktRemote9BottomFixed5555_20261001)return;
  window.__ktRemote9BottomFixed5555_20261001=true;

  function ktSecretGuestWipe20261004(){
    try{
      if(!document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var r=window.__ktLastLiveRoom||{};
      var t=[r.room_type,r.room_name,r.title,window.__ktRemoteRoomName,window.__ktRemoteRoomType].filter(Boolean).join(' ').toLowerCase();
      return /비밀|secret|password/.test(t);
    }catch(e){return false;}
  }

  function style(){
    if(document.getElementById('ktRemote9BottomFixed5555Style'))return;
    var s=document.createElement('style');
    s.id='ktRemote9BottomFixed5555Style';
    s.textContent=''
      +'#screen .kt-remote-live.kt-g9-bottom-fixed-5555{position:relative!important;}'
      /* bottom input row: always fixed at bottom */
      +'#screen .kt-remote-live.kt-g9-bottom-fixed-5555>.kt-remote-bottom{'
        +'position:absolute!important;'
        +'left:6px!important;right:6px!important;'
        +'bottom:calc(6px + env(safe-area-inset-bottom))!important;'
        +'top:auto!important;'
        +'height:44px!important;min-height:44px!important;max-height:44px!important;'
        +'padding:0!important;margin:0!important;'
        +'align-items:center!important;'
        +'transform:none!important;'
        +'z-index:2147482500!important;'
      +'}'
      /* chat messages: fixed directly above bottom input row */
      +'#screen .kt-remote-live.kt-g9-bottom-fixed-5555>.kt-remote-chat{'
        +'position:absolute!important;'
        +'left:8px!important;right:92px!important;'
        +'bottom:58px!important;top:auto!important;'
        +'height:62px!important;min-height:62px!important;max-height:62px!important;'
        +'margin:0!important;transform:none!important;'
        +'overflow:hidden!important;'
        +'z-index:2147482300!important;'
      +'}'
      /* generic guest earnings: fixed at lower-right beside chat, never follow chat height */
      +'#screen .kt-remote-live.kt-g9-bottom-fixed-5555>#ktAllRoomGuestEarnHud20260921{'
        +'position:absolute!important;'
        +'right:6px!important;left:auto!important;'
        +'bottom:62px!important;top:auto!important;'
        +'width:82px!important;min-width:82px!important;max-width:82px!important;'
        +'height:40px!important;min-height:40px!important;max-height:40px!important;'
        +'margin:0!important;transform:none!important;'
        +'z-index:2147482400!important;'
      +'}'
      /* approved-hostlike earnings box: also fixed to same lower-right position */
      +'#screen .kt-remote-live.kt-g9-bottom-fixed-5555 .kgh-earn{'
        +'position:absolute!important;'
        +'right:6px!important;left:auto!important;'
        +'bottom:62px!important;top:auto!important;'
        +'width:82px!important;min-width:82px!important;max-width:82px!important;'
        +'height:40px!important;min-height:40px!important;max-height:40px!important;'
        +'margin:0!important;transform:none!important;'
        +'z-index:2147482400!important;'
      +'}'
      +'@media(max-width:390px){'
        +'#screen .kt-remote-live.kt-g9-bottom-fixed-5555>.kt-remote-bottom{height:42px!important;min-height:42px!important;max-height:42px!important;bottom:calc(5px + env(safe-area-inset-bottom))!important;}'
        +'#screen .kt-remote-live.kt-g9-bottom-fixed-5555>.kt-remote-chat{bottom:54px!important;right:88px!important;height:58px!important;min-height:58px!important;max-height:58px!important;}'
        +'#screen .kt-remote-live.kt-g9-bottom-fixed-5555>#ktAllRoomGuestEarnHud20260921,'
        +'#screen .kt-remote-live.kt-g9-bottom-fixed-5555 .kgh-earn{right:5px!important;bottom:58px!important;width:78px!important;min-width:78px!important;max-width:78px!important;height:39px!important;min-height:39px!important;max-height:39px!important;}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  function isNine(root){
    if(!root)return false;
    try{
      if(root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]'))return true;
      if(root.classList.contains('kt-g9-final-5555'))return true;
      var txt=String(root.textContent||'');
      var st=window.state||{};
      txt+=' '+String(st.liveRoomName||'')+' '+String(st.liveRoomType||'')+' '+String(st.liveRoomMax||'');
      var last=window.__ktLastLiveRoom||{};
      txt+=' '+String(last.room_name||'')+' '+String(last.room_type||'');
      return /9\s*명|group9/i.test(txt);
    }catch(e){return false;}
  }

  function apply(){
    if(ktSecretGuestWipe20261004())return;
    style();
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      if(isNine(root))root.classList.add('kt-g9-bottom-fixed-5555');
      else root.classList.remove('kt-g9-bottom-fixed-5555');
    });
  }

  apply();
  [30,100,250,600,1200,2200].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('pageshow',function(){setTimeout(apply,50);});
  window.addEventListener('kt-guest-approval-received',function(){setTimeout(apply,40);setTimeout(apply,180);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktRemote9BottomFixed5555Timer);
      window.__ktRemote9BottomFixed5555Timer=setTimeout(apply,40);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});
  }catch(e){}
})();