/* K-Talk 호스트 -> 게스트 선물 대상 선택.
   화면 배치는 바꾸지 않고 연결된 게스트를 눌러 장미/선물 대상을 정한다. */
(function(){
  if(window.__ktHostGuestGiftTarget20260918)return;
  window.__ktHostGuestGiftTarget20260918=true;

  function ensureStyle(){
    if(document.getElementById('ktHostGuestGiftTargetStyle'))return;
    var s=document.createElement('style');
    s.id='ktHostGuestGiftTargetStyle';
    s.textContent=''
      +'.ktg13-guest.kt-gift-target{outline:2px solid #ffd75a!important;box-shadow:inset 0 0 15px #ffd75a55,0 0 10px #ffd75a55!important}'
      +'.ktg13-guest.kt-gift-target:after{content:"🎁 선물대상";position:absolute;right:4px;top:4px;z-index:9;padding:3px 6px;border-radius:9px;background:rgba(22,14,0,.86);border:1px solid #ffd75a;color:#ffe56e;font-size:8px;font-weight:950;pointer-events:none}';
    document.head.appendChild(s);
  }

  function guestName(slot){
    var n=slot&&slot.querySelector?slot.querySelector('.kt-guest-name'):null;
    var t=n?String(n.textContent||''):'';
    t=t.replace(/^\s*👤\s*/,'').trim();
    return t||'게스트';
  }

  function connected(){
    return [].slice.call(document.querySelectorAll('.ktg13-guest[data-kt-guest-viewer-id]'));
  }

  function select(slot,quiet){
    if(!slot||!slot.dataset||!slot.dataset.ktGuestViewerId)return;
    document.querySelectorAll('.ktg13-guest.kt-gift-target').forEach(function(x){x.classList.remove('kt-gift-target');});
    slot.classList.add('kt-gift-target');
    window.ktGuestGiftTarget={
      viewerId:String(slot.dataset.ktGuestViewerId||''),
      name:guestName(slot)
    };
    if(!quiet&&typeof window.showSmallGiftFx==='function'){
      window.showSmallGiftFx('선물 대상: '+window.ktGuestGiftTarget.name,'', '호스트');
    }
  }

  function reconcile(){
    ensureStyle();
    var list=connected();
    var target=window.ktGuestGiftTarget||null;
    var current=null;
    if(target&&target.viewerId){
      current=document.querySelector('.ktg13-guest[data-kt-guest-viewer-id="'+String(target.viewerId).replace(/"/g,'')+'"]');
    }
    if(current){current.classList.add('kt-gift-target');return;}
    window.ktGuestGiftTarget=null;
    document.querySelectorAll('.ktg13-guest.kt-gift-target').forEach(function(x){x.classList.remove('kt-gift-target');});
    if(list.length===1)select(list[0],true);
  }

  document.addEventListener('click',function(e){
    var slot=e.target&&e.target.closest?e.target.closest('.ktg13-guest[data-kt-guest-viewer-id]'):null;
    if(!slot)return;
    select(slot,false);
  },true);

  window.ktSelectGuestGiftTarget=function(slot){select(slot,false);};
  setInterval(reconcile,800);
  document.addEventListener('DOMContentLoaded',reconcile);
  if(document.readyState!=='loading')reconcile();
})();