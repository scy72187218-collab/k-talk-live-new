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
      +'}';
    document.head.appendChild(s);
  }

  ensure();
  document.addEventListener('DOMContentLoaded',ensure,{once:true});
})();
