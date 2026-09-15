/* K-Talk 선물상자 잔액 표시 전용. 선물상자를 열면 본인 보유 장미 수량을 보여주고, 선물 사용 시 차감합니다. 다른 화면/배치는 변경하지 않음. */
(function(){
  if(window.__ktGiftBalanceBox20260915)return;
  window.__ktGiftBalanceBox20260915=true;

  var apiPromise=null;
  var sendBusy=false;

  function val(v){return v==null?'':String(v).trim();}

  function currentUserId(){
    var id='';
    try{if(typeof window.ktProfileAccountKey==='function')id=val(window.ktProfileAccountKey());}catch(e){}
    if(!id||id==='default'){
      try{var sub=window.ktGetSelectedSubAccount?val(window.ktGetSelectedSubAccount()):'';if(sub)id='sub:'+sub;}catch(e){}
    }
    if(!id||id==='default'){
      try{id=val(localStorage.getItem('kt_live_device_id'));}catch(e){}
      if(!id){
        id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
        try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
      }
    }
    return id.slice(0,80);
  }

  function apiConfig(){
    if(apiPromise)return apiPromise;
    apiPromise=fetch('profile-device-sync.js?v=20260914-profile2',{cache:'no-store'})
      .then(function(r){if(!r.ok)throw new Error('config');return r.text();})
      .then(function(t){
        var bm=t.match(/var BASE='([^']+)'/);
        var km=t.match(/var KEY='([^']+)'/);
        if(!bm||!km)throw new Error('config');
        return {base:bm[1],key:km[1]};
      });
    return apiPromise;
  }

  async function rpc(name,body){
    var c=await apiConfig();
    var r=await fetch(c.base+'rpc/'+name,{
      method:'POST',
      headers:{apikey:c.key,Authorization:'Bearer '+c.key,'Content-Type':'application/json','x-ktalk-user-id':currentUserId()},
      body:JSON.stringify(body||{})
    });
    if(!r.ok)throw new Error('rpc '+r.status);
    var t=await r.text();
    return t?JSON.parse(t):null;
  }

  function numberOf(v){
    var n=parseInt(String(v==null?'0':v).replace(/[^0-9-]/g,''),10);
    return isFinite(n)&&n>0?n:0;
  }

  function ensureStyle(){
    if(document.getElementById('ktGiftBalanceBoxStyle20260915'))return;
    var s=document.createElement('style');
    s.id='ktGiftBalanceBoxStyle20260915';
    s.textContent=''
      +'.kt-gift-balance-bar{display:flex!important;align-items:center!important;justify-content:space-between!important;gap:10px!important;margin:8px 10px 10px!important;padding:10px 12px!important;border:1px solid rgba(255,216,90,.55)!important;border-radius:14px!important;background:linear-gradient(135deg,rgba(48,28,4,.94),rgba(19,13,6,.96))!important;color:#fff!important;box-shadow:0 0 14px rgba(255,196,44,.14)!important}'
      +'.kt-gift-balance-bar span{font-size:13px!important;font-weight:850!important}.kt-gift-balance-bar b{color:#ffe15a!important;font-size:18px!important;font-weight:950!important}'
      +'.kt-gift-balance-bar button{height:38px!important;padding:0 13px!important;border:0!important;border-radius:11px!important;background:linear-gradient(135deg,#ff3ca6,#7b55ff)!important;color:#fff!important;font-size:12px!important;font-weight:950!important;touch-action:manipulation!important}'
      +'.kt-gift-balance-bar.loading b{font-size:13px!important;color:#ddd!important}'
      +'@media(max-width:390px){.kt-gift-balance-bar{margin:7px 7px 9px!important;padding:9px 10px!important}.kt-gift-balance-bar span{font-size:12px!important}.kt-gift-balance-bar b{font-size:17px!important}.kt-gift-balance-bar button{height:36px!important;padding:0 11px!important}}';
    document.head.appendChild(s);
  }

  function balanceBar(){
    var gift=document.querySelector('#sheet .kt-gift-final');
    if(!gift)return null;
    var bar=gift.querySelector('.kt-gift-balance-bar');
    if(bar)return bar;
    bar=document.createElement('div');
    bar.className='kt-gift-balance-bar loading';
    bar.innerHTML='<span>🌹 보유 장미 <b data-kt-gift-balance>확인 중…</b><em data-kt-gift-unit style="font-style:normal"> 개</em></span><button type="button">충전하기</button>';
    var btn=bar.querySelector('button');
    if(btn)btn.addEventListener('click',function(){try{if(typeof window.openCharge==='function')window.openCharge();}catch(e){}});
    var head=gift.querySelector('.kt-gift-final-head');
    if(head&&head.nextSibling)gift.insertBefore(bar,head.nextSibling);else if(head)head.insertAdjacentElement('afterend',bar);else gift.insertBefore(bar,gift.firstChild);
    return bar;
  }

  function paintBalance(n){
    n=numberOf(n);
    try{window.state&&(state.roseBalance=n);}catch(e){}
    try{localStorage.setItem('ktalk_last_rose_balance',String(n));}catch(e){}
    var bar=balanceBar();
    if(!bar)return;
    bar.classList.remove('loading');
    var b=bar.querySelector('[data-kt-gift-balance]');
    if(b)b.textContent=n.toLocaleString('ko-KR');
  }

  async function refreshBalance(){
    ensureStyle();
    var bar=balanceBar();
    if(bar){
      bar.classList.add('loading');
      var b=bar.querySelector('[data-kt-gift-balance]');
      if(b)b.textContent='확인 중…';
    }
    try{
      var out=await rpc('ktalk_get_my_rose_balance',{});
      paintBalance(numberOf(out));
      return numberOf(out);
    }catch(e){
      var cached=0;
      try{cached=numberOf(localStorage.getItem('ktalk_last_rose_balance'));}catch(x){}
      paintBalance(cached);
      return cached;
    }
  }
  window.ktRefreshGiftRoseBalance=refreshBalance;

  function install(){
    ensureStyle();

    if(typeof window.openGifts==='function'&&!window.openGifts.__ktBalanceWrapped){
      var oldOpen=window.openGifts;
      var open=function(){
        var r=oldOpen.apply(this,arguments);
        setTimeout(function(){balanceBar();refreshBalance();},30);
        return r;
      };
      open.__ktBalanceWrapped=true;
      window.openGifts=open;
    }

    if(typeof window.giftSend==='function'&&!window.giftSend.__ktBalanceWrapped){
      var oldSend=window.giftSend;
      var send=async function(name,cost,sender){
        var amount=numberOf(cost);
        if(amount<=0)return oldSend.apply(this,arguments);
        if(sendBusy)return;
        sendBusy=true;
        try{
          var out=await rpc('ktalk_spend_my_roses',{p_amount:amount});
          var row=Array.isArray(out)?out[0]:out;
          var ok=!!(row&&row.success);
          var balance=numberOf(row&&row.balance);
          paintBalance(balance);
          if(!ok){
            alert('🌹 보유 장미가 부족합니다. 현재 '+balance.toLocaleString('ko-KR')+'개 남았습니다. 충전해 주세요.');
            setTimeout(function(){try{if(typeof window.openCharge==='function')window.openCharge();}catch(e){}},80);
            return;
          }
          oldSend.call(this,name,cost,sender);
          setTimeout(refreshBalance,180);
        }catch(e){
          alert('장미 잔액을 확인하지 못했습니다. 잠시 후 다시 눌러 주세요.');
        }finally{
          sendBusy=false;
        }
      };
      send.__ktBalanceWrapped=true;
      window.giftSend=send;
    }
  }

  install();
  setTimeout(install,250);
  setTimeout(install,900);
  setInterval(install,2500);
})();