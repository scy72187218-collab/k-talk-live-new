/* 9명방 호스트의 프로필 사진·레벨·닉네임만 더 작게 정리. 다른 방/기능은 건드리지 않음. */
(function(){
  if(window.__ktNineHostProfileCompactInstalled)return;
  window.__ktNineHostProfileCompactInstalled=true;
  var s=document.createElement('style');
  s.id='ktNineHostProfileCompactStyle';
  s.textContent=''
    +'.ktg13-room[data-kt-room="9"] .ktg13-host>.ktg13-host-label{left:4px!important;top:5px!important;padding:2px 4px!important;border-radius:7px!important;font-size:8px!important;line-height:1!important}'
    +'.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity{left:43px!important;top:4px!important;max-width:calc(100% - 47px)!important;gap:1px!important;padding:1px 3px 1px 1px!important}'
    +'.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-photo,.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-fallback{width:15px!important;height:15px!important;min-width:15px!important;font-size:8px!important}'
    +'.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-level{height:11px!important;padding:0 2px!important;font-size:6px!important}'
    +'.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-name{max-width:38px!important;font-size:7px!important}'
    +'@media(max-width:390px){.ktg13-room[data-kt-room="9"] .ktg13-host>.ktg13-host-label{left:3px!important;top:4px!important;padding:2px 3px!important;font-size:7.5px!important}.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity{left:39px!important;top:3px!important;max-width:calc(100% - 42px)!important;gap:1px!important;padding:1px 2px 1px 1px!important}.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-photo,.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-fallback{width:14px!important;height:14px!important;min-width:14px!important;font-size:7px!important}.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-level{height:10px!important;padding:0 2px!important;font-size:5.5px!important}.ktg13-room[data-kt-room="9"] .ktg13-host>.kt-hg-host-identity .kt-hg-name{max-width:34px!important;font-size:6.5px!important}}';
  document.head.appendChild(s);
})();
