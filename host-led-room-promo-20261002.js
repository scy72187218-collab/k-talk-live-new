/* K-Talk LED 방 홍보: 호스트가 직접 누르면 10분 간격, 방송당 최대 3회.
   시청자는 LED 홍보를 누르면 해당 방송방으로 바로 입장.
   기존 방/채팅/스위치/배치는 변경하지 않고 별도 오버레이만 사용. */
(function(){
  if(window.__ktHostLedRoomPromo20261002)return;
  window.__ktHostLedRoomPromo20261002=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';
  var GAP=10*60*1000;
  var MAX=3;
  var SHOW_MS=9000;
  var pollTimer=null;
  var lastSeen='';

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  function hostId(){
    try{return String(localStorage.getItem('kt_live_device_id')||'');}catch(e){return '';}
  }
  function hostName(){
    try{
      if(window.ktProfileLoad){var p=window.ktProfileLoad()||{};if(p.name)return String(p.name);}
    }catch(e){}
    try{
      var s=window.state||{};
      return String(s.profileName||s.nickname||s.name||'K-Talk 호스트');
    }catch(e){return 'K-Talk 호스트';}
  }
  function roomName(){
    try{
      var s=window.state||{};
      return String(s.liveRoomName||s.currentLiveRoomTitle||s.roomName||'방송');
    }catch(e){return '방송';}
  }
  function isApprovedSeller(){
    try{
      var x=JSON.parse(localStorage.getItem('kt_ad_seller_application')||'null');
      return !!(x&&x.businessName);
    }catch(e){return false;}
  }
  function liveHostRoom(){
    try{
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      if(!isApprovedSeller())return false;
      return !!document.querySelector(
        '#screen .ktg13-room,#screen .ktsolo-room,#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .ktg9-room'
      );
    }catch(e){return false;}
  }
  function sessionKey(){
    var id=hostId()||'local';
    var token='';
    try{token=String(window.__ktHostRunToken||localStorage.getItem('kt_led_promo_session')||'');}catch(e){}
    if(!token){
      token=String(Date.now());
      try{localStorage.setItem('kt_led_promo_session',token);}catch(e){}
    }
    return 'kt_led_promo:'+id+':'+token;
  }
  function state(){
    try{
      var x=JSON.parse(localStorage.getItem(sessionKey())||'{}');
      return {count:Number(x.count||0),last:Number(x.last||0),draft:String(x.draft||'')};
    }catch(e){return {count:0,last:0,draft:''};}
  }
  function save(x){try{localStorage.setItem(sessionKey(),JSON.stringify(x));}catch(e){}}

  function ensureStyle(){
    if(document.getElementById('ktLedRoomPromoStyle20261002'))return;
    var st=document.createElement('style');
    st.id='ktLedRoomPromoStyle20261002';
    st.textContent=''
      +'.kt-led-promo-host-btn{position:fixed;right:10px;top:112px;z-index:10020;min-width:112px;height:36px;border:1px solid #ff45d7;border-radius:999px;background:#140813e8;color:#ffe25c;font-size:10px;font-weight:950;box-shadow:0 0 9px #ff28c477;pointer-events:auto;touch-action:manipulation;padding:0 10px;display:flex;align-items:center;justify-content:center;gap:7px}.kt-led-promo-host-btn:before{content:\'\';width:28px;height:16px;border-radius:999px;background:#4a4450;box-shadow:inset 0 0 0 1px #ffffff22;transition:.15s}.kt-led-promo-host-btn.kt-led-ready:before{background:#ff2fc7;box-shadow:0 0 8px #ff2fc788,inset 0 0 0 1px #fff3}.kt-led-promo-host-btn:after{content:\'\';position:absolute;left:12px;width:12px;height:12px;border-radius:50%;background:#fff;transition:.15s}.kt-led-promo-host-btn.kt-led-ready:after{left:26px}'
      +'.kt-led-promo-host-btn[disabled]{opacity:.45}'
      +'.kt-led-promo-view{position:fixed;left:50%;top:58px;transform:translateX(-50%);z-index:10030;width:min(92vw,520px);min-height:46px;border:2px solid #ff28c4;border-radius:18px;background:#140813f2;color:#ffe04f;box-shadow:0 0 12px #ff28c4,0 0 24px #ff28c455;display:flex;align-items:center;gap:8px;padding:7px 12px;overflow:hidden;cursor:pointer;touch-action:manipulation}'
      +'.kt-led-promo-view b{flex:0 0 auto;color:#ff67dc;font-size:11px}.kt-led-promo-view span{min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:13px;font-weight:950}.kt-led-promo-view small{margin-left:auto;flex:0 0 auto;color:#fff;font-size:9px;font-weight:900}';
    document.head.appendChild(st);
  }

  async function sendPromo(){
    if(!liveHostRoom())return false;
    var st=state(),now=Date.now();
    if(st.count>=MAX){alert('이번 방송 LED 홍보 3회를 모두 사용했습니다.');return false;}
    var id=hostId();
    if(!id){alert('방송 정보를 확인하지 못했습니다.');return false;}

    if(!st.draft){
      var promoText='';
      try{
        promoText=String(prompt('LED 홍보 글을 입력하세요.\n예: 오늘 딸기 1박스 15,000원 판매합니다.','')||'').trim();
      }catch(e){}
      if(!promoText)return false;
      if(promoText.length>80)promoText=promoText.slice(0,80);
      st.draft=promoText;
      save(st);
      alert('홍보 글을 저장했습니다.\nLED 홍보 버튼을 한 번 더 누르면 전송됩니다.');
      refreshHostButton();
      return true;
    }

    var left=GAP-(now-st.last);
    if(st.last&&left>0){
      var min=Math.ceil(left/60000);
      alert('다음 LED 홍보는 약 '+min+'분 뒤에 누를 수 있습니다.');
      return false;
    }

    var promoText=st.draft;
    var payload={
      host_id:id,
      sender_id:id,
      sender_name:hostName(),
      message:JSON.stringify({hostId:id,hostName:hostName(),roomName:roomName(),promoText:promoText,at:new Date().toISOString()}),
      message_type:'led_promo'
    };
    try{
      var r=await fetch(BASE+'ktalk_live_messages',{
        method:'POST',
        headers:headers({Prefer:'return=minimal'}),
        body:JSON.stringify(payload)
      });
      if(!r.ok)throw new Error(String(r.status));
      st.count++;st.last=now;st.draft='';save(st);
      alert('LED 방 홍보 '+st.count+'회 전송했습니다. 총 3회까지 가능합니다.');
      refreshHostButton();
      return true;
    }catch(e){
      alert('LED 홍보를 보내지 못했습니다. 인터넷 연결을 확인해 주세요.');
      return false;
    }
  }
  window.ktSendLedRoomPromo20261002=sendPromo;

  function refreshHostButton(){
    ensureStyle();
    var b=document.getElementById('ktLedPromoHostBtn20261002');
    if(!liveHostRoom()){if(b)b.remove();return;}
    var st=state(),now=Date.now();
    if(!b){
      b=document.createElement('button');
      b.id='ktLedPromoHostBtn20261002';
      b.className='kt-led-promo-host-btn';
      b.type='button';
      b.onclick=function(e){try{e.preventDefault();e.stopPropagation();}catch(x){}sendPromo();};
      document.body.appendChild(b);
    }
    b.classList.toggle('kt-led-ready',!!st.draft);
    if(st.count>=MAX){
      b.textContent='LED 완료 3/3';
      b.disabled=true;
      b.classList.remove('kt-led-ready');
      return;
    }
    if(st.draft){
      b.disabled=false;
      b.textContent='LED ON · 보내기 '+st.count+'/3';
      return;
    }
    var left=st.last?GAP-(now-st.last):0;
    if(left>0){
      b.disabled=true;
      b.textContent='LED 대기 '+st.count+'/3 · '+Math.ceil(left/60000)+'분';
    }else{
      b.disabled=false;
      b.textContent='LED OFF · 글쓰기 '+st.count+'/3';
    }
  }

  function showPromo(x){
    ensureStyle();
    if(!x||!x.hostId)return;
    var old=document.getElementById('ktLedPromoView20261002');if(old)old.remove();
    var d=document.createElement('div');
    d.id='ktLedPromoView20261002';
    d.className='kt-led-promo-view';
    d.innerHTML='<b>● LED</b><span>'+String(x.hostName||'K-Talk 호스트')+' · '+String(x.promoText||x.roomName||'방송')+'</span><small>눌러서 입장 ›</small>';
    d.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(z){}
      if(typeof window.ktEnterRemoteLive==='function')window.ktEnterRemoteLive(String(x.hostId));
    };
    document.body.appendChild(d);
    setTimeout(function(){if(d&&d.parentNode)d.remove();},SHOW_MS);
  }

  async function poll(){
    try{
      var cut=new Date(Date.now()-20000).toISOString();
      var url=BASE+'ktalk_live_messages?select=id,message,created_at&message_type=eq.led_promo&created_at=gte.'+enc(cut)+'&order=created_at.desc&limit=3';
      var r=await fetch(url,{headers:headers(),cache:'no-store'});
      if(!r.ok)return;
      var rows=await r.json();
      if(!Array.isArray(rows)||!rows.length)return;
      var row=rows[0];
      if(String(row.id||'')===lastSeen)return;
      lastSeen=String(row.id||'');
      var x=null;
      try{x=JSON.parse(row.message||'{}');}catch(e){}
      if(x&&String(x.hostId||'')!==hostId())showPromo(x);
    }catch(e){}
  }

  ensureStyle();
  refreshHostButton();
  setInterval(refreshHostButton,15000);
  poll();
  pollTimer=setInterval(poll,4000);
  try{
    new MutationObserver(function(){setTimeout(refreshHostButton,30);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();