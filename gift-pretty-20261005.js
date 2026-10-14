/* K-Talk gift panel visual polish only - 2026-10-05
   Scope: gift sheet appearance only. No gift logic, room layout, chat, transport or payout changes. */
(function(){
  if(window.__ktGiftPretty20261005)return;
  window.__ktGiftPretty20261005=true;

  function ensure(){
    if(document.getElementById('ktGiftPretty20261005Style'))return;
    var s=document.createElement('style');
    s.id='ktGiftPretty20261005Style';
    s.textContent=''
      +'#sheet.kt-gift-force .sheet-inner{background:linear-gradient(180deg,#171419 0%,#0d0b0f 48%,#070608 100%)!important;border:1px solid rgba(255,255,255,.10)!important;box-shadow:0 -18px 48px rgba(0,0,0,.72)!important}'
      +'.ktgf{padding:10px 9px 12px!important}'
      +'.ktgf-head{min-height:76px!important;padding:6px 4px 11px!important;border-bottom:1px solid rgba(255,255,255,.08)!important}'
      +'.ktgf-logo{background:linear-gradient(145deg,#4a2644,#21141f)!important;border:1px solid rgba(255,170,220,.34)!important;box-shadow:0 6px 20px rgba(0,0,0,.26)!important}'
      +'.ktgf-brand h2{color:#fff!important;font-size:24px!important;text-shadow:none!important}'
      +'.ktgf-brand p{color:#cfc5cb!important;font-weight:800!important}'
      +'.ktgf-close{background:#262127!important;border:1px solid rgba(255,255,255,.12)!important;color:#fff!important;box-shadow:none!important}'
      +'.ktgf-main{grid-template-columns:82px minmax(0,1fr)!important;gap:8px!important;margin-top:9px!important}'
      +'.ktgf-side{border:1px solid rgba(255,255,255,.08)!important;background:#121014!important;border-radius:18px!important;padding:5px!important;box-shadow:none!important}'
      +'.ktgf-cat{min-height:66px!important;border-radius:14px!important;color:#bfb6bd!important}'
      +'.ktgf-cat.on{color:#fff!important;border-color:rgba(255,112,191,.45)!important;background:linear-gradient(145deg,rgba(255,76,171,.18),rgba(123,84,255,.11))!important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.03)!important}'
      +'.ktgf-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:7px!important}'
      +'.ktgf-card{height:136px!important;padding:5px 4px 7px!important;border-radius:16px!important;border:1px solid rgba(255,255,255,.09)!important;background:linear-gradient(180deg,#242025 0%,#171419 100%)!important;box-shadow:0 7px 18px rgba(0,0,0,.20)!important;overflow:hidden!important}'
      +'.ktgf-card:active{transform:scale(.97)!important;border-color:rgba(255,106,190,.62)!important}'
      +'.ktgf-art{height:78px!important;margin:0 auto 3px!important;border-radius:13px!important;filter:none!important}'
      +'.ktgf-card b{min-height:23px!important;font-size:9.5px!important;line-height:1.08!important;color:#f7f4f6!important;font-weight:900!important}'
      +'.ktgf-card strong{display:inline-flex!important;align-items:center!important;justify-content:center!important;min-width:44px!important;height:20px!important;margin-top:2px!important;padding:0 7px!important;border-radius:999px!important;background:rgba(255,190,62,.10)!important;border:1px solid rgba(255,208,92,.16)!important;color:#ffd86a!important;font-size:10px!important;font-weight:950!important;line-height:1!important}'
      +'.ktgf-card strong:before{content:"🌹 ";font-size:9px}'
      +'.ktgf-no{opacity:.72!important;background:rgba(0,0,0,.44)!important;border:1px solid rgba(255,255,255,.12)!important;color:#fff!important}'
      +'.kt-gift-balance-bar{border:1px solid rgba(255,208,92,.20)!important;background:linear-gradient(135deg,#211a14,#151216)!important;box-shadow:none!important;border-radius:16px!important}'
      +'.kt-gift-balance-bar button{background:linear-gradient(135deg,#ff5aa9,#8a67ff)!important;border-radius:12px!important;box-shadow:none!important}'
      +'.kt-treasure-inside-gifts{border:1px solid rgba(255,208,92,.18)!important;background:#17130f!important;border-radius:16px!important}'
      +'@media(max-width:410px){'
      +'.ktgf{padding:6px 5px 8px!important}.ktgf-head{min-height:58px!important;padding-bottom:6px!important}'
      +'.ktgf-logo{width:42px!important;height:42px!important;flex-basis:42px!important;font-size:24px!important;border-radius:13px!important}'
      +'.ktgf-brand h2{font-size:18px!important}.ktgf-brand p{font-size:7px!important;margin-top:3px!important}'
      +'.ktgf-close{min-width:54px!important;height:36px!important;font-size:12px!important;border-radius:12px!important}'
      +'.ktgf-main{grid-template-columns:58px minmax(0,1fr)!important;gap:5px!important;margin-top:6px!important}'
      +'.ktgf-side{padding:3px!important;gap:2px!important;border-radius:13px!important}.ktgf-cat{min-height:52px!important;padding:3px 1px!important;border-radius:10px!important}.ktgf-cat i{font-size:18px!important}.ktgf-cat span{font-size:6.8px!important;margin-top:3px!important}'
      +'.ktgf-grid{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:4px!important}'
      +'.ktgf-card{height:104px!important;padding:3px 2px 4px!important;border-radius:11px!important}'
      +'.ktgf-art{height:56px!important;margin-bottom:1px!important;border-radius:9px!important}'
      +'.ktgf-card b{font-size:6.8px!important;min-height:18px!important;line-height:1.02!important}'
      +'.ktgf-card strong{min-width:36px!important;height:16px!important;padding:0 4px!important;margin-top:1px!important;font-size:7.8px!important}'
      +'.ktgf-card strong:before{font-size:7px!important}'
      +'.ktgf-no{left:2px!important;top:2px!important;min-width:14px!important;height:14px!important;font-size:7px!important;border-radius:5px!important}'
      +'}'
      +'#sheet.kt-gift-force{background:transparent!important;backdrop-filter:none!important;pointer-events:none!important;display:flex!important;align-items:flex-end!important;justify-content:center!important}'
      +'#sheet.kt-gift-force .sheet-inner{height:52dvh!important;max-height:52dvh!important;min-height:0!important;border-radius:24px 24px 0 0!important;pointer-events:auto!important;overflow:hidden!important}'
      +'#sheet.kt-gift-force #sheetBody{height:100%!important;overflow:hidden!important}'
      +'.ktgf{height:100%!important;display:flex!important;flex-direction:column!important;overflow:hidden!important}'
      +'.ktgf-head{flex:0 0 auto!important}'
      +'.ktgf-main{flex:1 1 auto!important;min-height:0!important;overflow:hidden!important}'
      +'.ktgf-main>section{min-height:0!important;overflow:hidden!important}'
      +'.ktgf-grid{height:100%!important;overflow-y:auto!important;overflow-x:hidden!important;align-content:start!important;padding-bottom:18px!important;overscroll-behavior:contain!important;-webkit-overflow-scrolling:touch!important}'
      +'.ktgf-side{height:100%!important;overflow-y:auto!important;overscroll-behavior:contain!important}'
      +'@media(max-width:410px){#sheet.kt-gift-force .sheet-inner{height:50dvh!important;max-height:50dvh!important}.ktgf-grid{padding-bottom:12px!important}}'
;
    s.textContent+=
      '#sheet.kt-gift-force.show{position:fixed!important;inset:0!important;align-items:flex-end!important;justify-content:center!important;padding:0!important;z-index:2147483640!important;background:transparent!important;backdrop-filter:none!important}'+
      '#sheet.kt-gift-force.show .sheet-inner{margin:0 auto!important;align-self:flex-end!important;height:44dvh!important;max-height:44dvh!important;min-height:0!important;padding-bottom:env(safe-area-inset-bottom)!important;box-sizing:border-box!important}'+
      'body:has(#sheet.kt-gift-force.show) #screen :is(.kt-fresh-three-1111,.ktg13-quick,.ktg13-actions,.ktsolo-actions,.kt-sgfh-actions){visibility:hidden!important;pointer-events:none!important}'+
      'body:has(#sheet.kt-gift-force.show) #screen :is(#ktRemoteBottom,.kt-sgfh-bottom){bottom:44dvh!important;z-index:2147483641!important}'+
      'body:has(#sheet.kt-gift-force.show) #screen #ktRemoteChatList{bottom:calc(44dvh + 54px)!important}'+
      '#sheet.kt-gift-force.show .ktgf-head{min-height:48px!important;padding:4px!important}'+
      '#sheet.kt-gift-force.show .ktgf-logo{width:34px!important;height:34px!important;flex-basis:34px!important;font-size:21px!important}'+
      '#sheet.kt-gift-force.show .ktgf-brand h2{font-size:17px!important}'+
      '#sheet.kt-gift-force.show .ktgf-brand p{display:none!important}'+
      '#sheet.kt-gift-force.show .ktgf-close{height:32px!important;min-width:48px!important;font-size:12px!important}'+
      '#sheet.kt-gift-force.show .kt-gift-recipient-bar-20261006{flex:0 0 auto!important;margin:3px 0!important;padding:4px 8px!important;min-height:42px!important}'+
      '#sheet.kt-gift-force.show .ktgf-main{margin-top:4px!important}'+
      '#sheet.kt-gift-force.show .ktgf-main>section{height:100%!important;max-height:none!important;overflow:hidden!important}'+
      '#sheet.kt-gift-force.show .ktgf-foot{display:none!important}';
    s.textContent+='#sheet.kt-person-gift-menu-open.show{align-items:flex-end!important;background:transparent!important;backdrop-filter:none!important;z-index:2147483640!important}#sheet.kt-person-gift-menu-open.show .sheet-inner{margin:0 auto!important;padding:12px!important;max-height:38dvh!important}#sheet.kt-person-gift-menu-open .sheet-head{display:none!important}.kt-person-gift-menu-head{display:flex;align-items:center;gap:12px;margin-bottom:12px}.kt-person-gift-menu-head>b{flex:1;color:#fff;font-size:18px}.kt-person-gift-menu-head button{border:0;border-radius:12px;padding:9px 14px;color:#fff;background:#303036}.kt-person-gift-menu-face{width:54px;height:54px;border-radius:50%;overflow:hidden;display:grid;place-items:center;flex:none;background:#24242c;font-size:28px}.kt-person-gift-menu-face img,.kt-person-gift-menu-face video{width:100%;height:100%;object-fit:cover}.kt-person-gift-menu>button{width:100%;padding:20px;border:1px solid #ffd66b66;border-radius:16px;color:#fff;background:#3b2b16;font-weight:900;font-size:18px}';
    document.head.appendChild(s);
  }

  ensure();
  document.addEventListener('DOMContentLoaded',ensure,{once:true});
})();
