/* K-Talk 13명방 채팅 위치 전용 (2026-09-19)
   채팅 영역을 하단 '메시지/장미' 버튼줄 바로 위에 붙인다.
   다른 방/카메라/게스트/선물/버튼 기능은 변경하지 않음. */
(function(){
  if(window.__ktGroup13ChatAboveTools20260919)return;
  window.__ktGroup13ChatAboveTools20260919=true;

  function install(){
    if(document.getElementById('ktGroup13ChatAboveTools20260919Style'))return;
    var s=document.createElement('style');
    s.id='ktGroup13ChatAboveTools20260919Style';
    s.textContent=''
      +'#screen .ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"]) .ktg13-gifts{order:40!important}'
      +'#screen .ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"]) .ktg13-mid{order:50!important;flex:0 0 82px!important;min-height:82px!important;margin:0!important;align-items:end!important}'
      +'#screen .ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"]) .ktg13-chat{height:82px!important;max-height:82px!important;justify-content:flex-end!important;padding-bottom:2px!important}'
      +'#screen .ktg13-room:not([data-kt-room="9"]):not([data-kt-room="15"]) .ktg13-tools{order:60!important;margin-top:0!important}';
    document.head.appendChild(s);
  }

  install();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  [100,350,800,1500].forEach(function(ms){setTimeout(install,ms);});
})();