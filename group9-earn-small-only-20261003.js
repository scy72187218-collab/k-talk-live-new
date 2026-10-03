/* K-Talk 9명방 수익률 박스만 축소 - 다른 방/버튼/통신 건드리지 않음 */
(function(){
  if(window.__ktGroup9EarnSmallOnly20261003)return;
  window.__ktGroup9EarnSmallOnly20261003=true;

  var s=document.createElement('style');
  s.id='ktGroup9EarnSmallOnlyStyle20261003';
  s.textContent=''
    +'html body #screen .ktg13-room[data-kt-room="9"] .ktg13-mid{grid-template-columns:minmax(0,1fr) 84px!important;gap:4px!important}'
    +'html body #screen .ktg13-room[data-kt-room="9"] .ktg13-earn{width:84px!important;max-width:84px!important;height:48px!important;justify-self:end!important;align-items:flex-end!important;overflow:visible!important}'
    +'html body #screen .ktg13-room[data-kt-room="9"] .ktg13-earn #myEarnHud{width:84px!important;min-width:84px!important;max-width:84px!important;height:48px!important;max-height:48px!important;padding:1px 2px!important;border-radius:8px!important;box-sizing:border-box!important;overflow:hidden!important}'
    +'html body #screen .ktg13-room[data-kt-room="9"] .ktg13-earn #myEarnHud span{font-size:4.7px!important;line-height:1!important}'
    +'html body #screen .ktg13-room[data-kt-room="9"] .ktg13-earn #myEarnHud b{font-size:7px!important;line-height:1!important}'
    +'html body #screen .ktg13-room[data-kt-room="9"] .ktg13-earn #myEarnDetail{font-size:4.4px!important;line-height:1!important;gap:0 1px!important;margin-top:1px!important}'
    +'@media(max-width:390px){'
      +'html body #screen .ktg13-room[data-kt-room="9"] .ktg13-mid{grid-template-columns:minmax(0,1fr) 78px!important}'
      +'html body #screen .ktg13-room[data-kt-room="9"] .ktg13-earn,'
      +'html body #screen .ktg13-room[data-kt-room="9"] .ktg13-earn #myEarnHud{width:78px!important;min-width:78px!important;max-width:78px!important;height:46px!important;max-height:46px!important}'
    +'}';
  (document.head||document.documentElement).appendChild(s);
})();