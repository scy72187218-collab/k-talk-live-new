/* K-Talk 월 300,000원 판매방송 판매자 도구
   - 사업자/연락처/정산계좌/안내문구 등록
   - 방송 중 시청자 주문 접수
   - 판매자 화면 오른쪽 주문목록 자동 정리
   - 주문카드 클릭 시 크게 열어 캡처하기 쉽게 표시
*/
(function(){
  if(window.__ktSellerLiveOrderPanel20260929)return;
  window.__ktSellerLiveOrderPanel20260929=true;

  var REF='zupwbfmacwzexyvznlzq';
  var APIKEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var BASE='https://'+REF+'.supabase.co/rest/v1/';
  var PROFILE_KEY='ktalk_seller300_profile_v1';
  var ORDER_KEY='ktalk_seller300_orders_v1';
  var pollBusy=false,lastOrderId='';

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }
  function isOwner(){try{return !!(window.ktIsOwnerAdmin&&window.ktIsOwnerAdmin());}catch(e){return false;}}
  function isHost(){
    try{
      return !!document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,#screen .ktsubscriber-room,#screen .ktsecret-room')
        && !document.documentElement.classList.contains('kt-remote-viewing');
    }catch(e){return false;}
  }
  function remoteHostId(){
    var id='';
    try{id=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'').trim();}catch(e){}
    if(!id)try{id=String(sessionStorage.getItem('kt_remote_host_id')||'').trim();}catch(e){}
    return id;
  }
  function readProfile(){
    try{
      var x=JSON.parse(localStorage.getItem(PROFILE_KEY)||'{}');
      return x&&typeof x==='object'?x:{};
    }catch(e){return {};}
  }
  function saveProfile(x){try{localStorage.setItem(PROFILE_KEY,JSON.stringify(x||{}));}catch(e){}}
  function sellerActive(){
    var x=readProfile();
    if(isOwner())return true;
    return !!(x&&x.active);
  }
  function readOrders(){
    try{
      var a=JSON.parse(localStorage.getItem(ORDER_KEY)||'[]');
      return Array.isArray(a)?a:[];
    }catch(e){return [];}
  }
  function saveOrders(a){try{localStorage.setItem(ORDER_KEY,JSON.stringify((a||[]).slice(-300)));}catch(e){}}

  function ensureStyle(){
    if(document.getElementById('ktSeller300Style20260929'))return;
    var st=document.createElement('style');
    st.id='ktSeller300Style20260929';
    st.textContent=''
      +'#screen .kt-seller-float-20260929{position:absolute!important;top:105px!important;right:8px!important;z-index:187!important;width:min(250px,43vw)!important;max-height:62vh!important;display:flex!important;flex-direction:column!important;gap:6px!important;pointer-events:none!important;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif!important}'
      +'#screen .kt-seller-info-20260929{padding:8px 9px!important;border-radius:13px!important;background:rgba(8,8,12,.80)!important;border:1px solid rgba(255,215,100,.52)!important;color:#fff!important;box-shadow:0 6px 20px rgba(0,0,0,.32)!important;pointer-events:auto!important}'
      +'#screen .kt-seller-info-20260929 b{display:block!important;color:#ffe071!important;font-size:11px!important}#screen .kt-seller-info-20260929 span,#screen .kt-seller-info-20260929 small{display:block!important;font-size:9px!important;line-height:1.35!important;color:#eee!important;word-break:break-all!important}'
      +'#screen .kt-seller-order-btn-20260929{width:100%!important;border:0!important;border-radius:10px!important;padding:7px!important;background:#ffcc43!important;color:#17130a!important;font-weight:950!important;font-size:11px!important;pointer-events:auto!important}'
      +'#screen .kt-seller-orders-20260929{display:flex!important;flex-direction:column!important;gap:4px!important;overflow:auto!important;pointer-events:auto!important}'
      +'#screen .kt-seller-order-card-20260929{border:1px solid rgba(255,255,255,.18)!important;border-radius:10px!important;background:rgba(10,10,14,.84)!important;color:#fff!important;padding:7px!important;text-align:left!important;font-size:9px!important;line-height:1.35!important;width:100%!important;cursor:pointer!important}'
      +'#screen .kt-seller-order-card-20260929 strong{display:block!important;color:#ffe071!important;font-size:10px!important}'
      +'#screen .kt-seller-order-card-20260929 em{font-style:normal!important;color:#9ee7ff!important}'
      +'@media(max-width:390px){#screen .kt-seller-float-20260929{top:92px!important;right:4px!important;width:min(205px,48vw)!important;max-height:58vh!important}#screen .kt-seller-info-20260929{padding:6px!important}#screen .kt-seller-info-20260929 b{font-size:10px!important}#screen .kt-seller-info-20260929 span,#screen .kt-seller-info-20260929 small,#screen .kt-seller-order-card-20260929{font-size:8px!important}}';
    document.head.appendChild(st);
  }

  function orderSummary(o){
    var bits=[];
    if(o.product)bits.push(o.product);
    if(o.option)bits.push(o.option);
    if(o.qty)bits.push('수량 '+o.qty);
    return bits.join(' · ');
  }

  window.ktOpenSellerOrderDetail20260929=function(id){
    var o=readOrders().filter(function(x){return String(x.id)===String(id);})[0];
    if(!o||!window.showSheet)return false;
    var html='<div class="rowbox" style="font-size:16px;line-height:1.8"><b>🧾 주문 '+esc(o.no||'')+'</b><br>'
      +'상품: <strong>'+esc(o.product||'-')+'</strong><br>'
      +'옵션: '+esc(o.option||'-')+'<br>'
      +'수량: '+esc(o.qty||'1')+'<br>'
      +'주문자: '+esc(o.name||'-')+'<br>'
      +'연락처: '+esc(o.phone||'-')+'<br>'
      +'배송/전달 메모: '+esc(o.memo||'-')+'<br>'
      +'<small>'+esc(o.createdText||'')+'</small></div>'
      +'<div class="rowbox"><b>📸 캡처용</b><br>이 화면을 크게 띄운 상태에서 휴대폰 캡처 기능을 사용하면 주문 내용을 한 장으로 보관할 수 있습니다.</div>'
      +'<button class="act" onclick="ktMarkSellerOrderDone20260929(\''+esc(String(o.id))+'\')">처리 완료 표시</button>';
    window.showSheet('🧾 주문 상세',html);
    return false;
  };

  window.ktMarkSellerOrderDone20260929=function(id){
    var a=readOrders();
    a.forEach(function(o){if(String(o.id)===String(id))o.status='처리완료';});
    saveOrders(a);renderSellerPanel();
    try{if(window.closeSheet)window.closeSheet();}catch(e){}
    return false;
  };

  function renderSellerPanel(){
    ensureStyle();
    var screen=document.getElementById('screen');
    if(!screen)return;
    var p=readProfile();
    var old=document.querySelector('#screen .kt-seller-float-20260929');
    var host=isHost();

    if(host && !sellerActive()){
      if(old)old.remove();
      return;
    }
    if(!host && !p.livePublic){
      /* 원격 시청자는 서버에서 판매자 정보가 올 때까지 표시하지 않음 */
      if(!old)return;
    }
    if(!old){
      old=document.createElement('div');
      old.className='kt-seller-float-20260929';
      screen.appendChild(old);
    }

    var info='';
    if(p.shopName||p.phone||p.account||p.message){
      var lines=[];
      if(p.shopName)lines.push('<b>🛍️ '+esc(p.shopName)+'</b>');
      if(p.phone)lines.push('<span>☎ '+esc(p.phone)+'</span>');
      if(p.bank||p.account||p.holder)lines.push('<span>'+esc([p.bank,p.account,p.holder].filter(Boolean).join(' · '))+'</span>');
      if(p.message)lines.push('<small>'+esc(p.message)+'</small>');
      info='<div class="kt-seller-info-20260929">'+lines.join('')+'</div>';
    }

    if(host){
      var orders=readOrders().slice().reverse().slice(0,30);
      var list=orders.length?orders.map(function(o){
        return '<button class="kt-seller-order-card-20260929" onclick="ktOpenSellerOrderDetail20260929(\''+esc(String(o.id))+'\')">'
          +'<strong>주문 '+esc(o.no||'')+' · '+esc(o.status||'접수')+'</strong>'
          +'<span>'+esc(orderSummary(o)||'-')+'</span>'
          +'<em>'+esc(o.name||'')+' · '+esc(o.phone||'')+'</em>'
          +'</button>';
      }).join(''):'<div class="kt-seller-order-card-20260929">아직 들어온 주문이 없습니다.</div>';
      old.innerHTML=info+'<div class="kt-seller-orders-20260929">'+list+'</div>';
    }else{
      old.innerHTML=info+'<button class="kt-seller-order-btn-20260929" onclick="ktOpenLiveOrderForm20260929()">🛒 주문하기</button>';
    }
  }

  async function broadcastProfile(){
    if(!isHost()||!sellerActive())return;
    var p=readProfile();p.livePublic=true;
    try{
      await fetch(BASE+'ktalk_live_messages',{
        method:'POST',
        headers:{apikey:APIKEY,Authorization:'Bearer '+APIKEY,'Content-Type':'application/json',Prefer:'return=minimal'},
        body:JSON.stringify({
          host_id:deviceId(),
          sender_id:'seller:'+deviceId(),
          sender_name:p.shopName||'판매자',
          message:JSON.stringify(p),
          message_type:'seller_live_profile'
        })
      });
    }catch(e){}
  }

  window.ktOpenSeller300Setup20260929=function(){
    if(!window.showSheet)return false;
    var p=readProfile();
    var html='<div class="rowbox"><b>🛍️ 월 300,000원 판매방송 판매자</b><br>사업자 정보를 등록한 판매자가 방송 중 연락처·정산계좌·안내문구를 표시하고 주문을 자동으로 받아볼 수 있습니다.</div>'
      +'<div class="rowbox"><b>상호명</b><input id="ktSellerShop20260929" value="'+esc(p.shopName||'')+'" placeholder="상호명" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px"></div>'
      +'<div class="rowbox"><b>사업자등록번호</b><input id="ktSellerBiz20260929" value="'+esc(p.bizNo||'')+'" placeholder="사업자등록번호" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px"></div>'
      +'<div class="rowbox"><b>전화번호</b><input id="ktSellerPhone20260929" value="'+esc(p.phone||'')+'" placeholder="전화번호" inputmode="tel" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px"></div>'
      +'<div class="rowbox"><b>은행 · 계좌번호 · 예금주</b><input id="ktSellerBank20260929" value="'+esc(p.bank||'')+'" placeholder="은행" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px"><input id="ktSellerAccount20260929" value="'+esc(p.account||'')+'" placeholder="계좌번호" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px"><input id="ktSellerHolder20260929" value="'+esc(p.holder||'')+'" placeholder="예금주" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px"></div>'
      +'<div class="rowbox"><b>방송 안내 문구</b><textarea id="ktSellerMessage20260929" placeholder="예: 상품명과 수량을 선택해서 주문해 주세요." style="width:100%;min-height:70px;box-sizing:border-box;margin-top:6px;padding:9px">'+esc(p.message||'')+'</textarea></div>'
      +'<div class="rowbox"><b>주문 정리</b><br>시청자가 주문하면 판매자 방송 화면 오른쪽에 주문번호·상품·수량·주문자·전화번호가 순서대로 쌓입니다. 주문을 누르면 크게 열려 캡처할 수 있습니다.</div>'
      +'<button class="act" onclick="ktSaveSeller300Setup20260929()">판매자 정보 저장 · 방송에 표시</button>';
    window.showSheet('🛍️ 판매방송 설정',html);
    return false;
  };

  window.ktSaveSeller300Setup20260929=function(){
    function v(id){var e=document.getElementById(id);return e?String(e.value||'').trim():'';}
    var p={
      active:true,
      plan:300000,
      shopName:v('ktSellerShop20260929'),
      bizNo:v('ktSellerBiz20260929'),
      phone:v('ktSellerPhone20260929'),
      bank:v('ktSellerBank20260929'),
      account:v('ktSellerAccount20260929'),
      holder:v('ktSellerHolder20260929'),
      message:v('ktSellerMessage20260929'),
      livePublic:true,
      updatedAt:Date.now()
    };
    if(!p.shopName||!p.bizNo||!p.phone){alert('상호명, 사업자등록번호, 전화번호를 입력해 주세요.');return false;}
    saveProfile(p);
    renderSellerPanel();
    broadcastProfile();
    alert('판매자 정보가 저장되었습니다.');
    return false;
  };

  window.ktOpenLiveOrderForm20260929=function(){
    if(!window.showSheet)return false;
    var html='<div class="rowbox"><b>🛒 방송 상품 주문</b><br>방송에서 안내한 상품명과 주문 내용을 입력해 주세요.</div>'
      +'<div class="rowbox"><b>상품명</b><input id="ktOrderProduct20260929" placeholder="상품명" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px"></div>'
      +'<div class="rowbox"><b>옵션 · 색상 · 사이즈</b><input id="ktOrderOption20260929" placeholder="옵션" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px"></div>'
      +'<div class="rowbox"><b>수량</b><input id="ktOrderQty20260929" type="number" min="1" value="1" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px"></div>'
      +'<div class="rowbox"><b>주문자 이름</b><input id="ktOrderName20260929" placeholder="이름" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px"></div>'
      +'<div class="rowbox"><b>전화번호</b><input id="ktOrderPhone20260929" placeholder="전화번호" inputmode="tel" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px"></div>'
      +'<div class="rowbox"><b>배송/전달 메모</b><textarea id="ktOrderMemo20260929" placeholder="배송이나 전달에 필요한 메모" style="width:100%;min-height:60px;box-sizing:border-box;margin-top:6px;padding:9px"></textarea></div>'
      +'<button class="act" onclick="ktSubmitLiveOrder20260929()">주문 접수</button>';
    window.showSheet('🛒 주문하기',html);
    return false;
  };

  window.ktSubmitLiveOrder20260929=async function(){
    var host=remoteHostId();
    if(!host){alert('방송 연결을 확인해 주세요.');return false;}
    function v(id){var e=document.getElementById(id);return e?String(e.value||'').trim():'';}
    var o={
      id:'ord_'+Date.now()+'_'+Math.random().toString(36).slice(2,7),
      product:v('ktOrderProduct20260929'),
      option:v('ktOrderOption20260929'),
      qty:v('ktOrderQty20260929')||'1',
      name:v('ktOrderName20260929'),
      phone:v('ktOrderPhone20260929'),
      memo:v('ktOrderMemo20260929'),
      status:'접수',
      createdAt:Date.now(),
      createdText:new Date().toLocaleString('ko-KR')
    };
    if(!o.product||!o.name||!o.phone){alert('상품명, 주문자 이름, 전화번호를 입력해 주세요.');return false;}
    try{
      var r=await fetch(BASE+'ktalk_live_messages',{
        method:'POST',
        headers:{apikey:APIKEY,Authorization:'Bearer '+APIKEY,'Content-Type':'application/json',Prefer:'return=minimal'},
        body:JSON.stringify({
          host_id:host,
          sender_id:'order:'+deviceId(),
          sender_name:o.name,
          message:JSON.stringify(o),
          message_type:'seller_live_order'
        })
      });
      if(!r.ok)throw new Error('order');
      alert('주문이 접수되었습니다.');
      try{if(window.closeSheet)window.closeSheet();}catch(e){}
    }catch(e){alert('주문 접수 중 오류가 났습니다. 다시 눌러 주세요.');}
    return false;
  };

  async function pollSellerProfile(){
    if(isHost())return;
    var host=remoteHostId();if(!host)return;
    try{
      var since=new Date(Date.now()-20000).toISOString();
      var url=BASE+'ktalk_live_messages?select=id,message,created_at'
        +'&host_id=eq.'+enc(host)
        +'&message_type=eq.seller_live_profile'
        +'&created_at=gte.'+enc(since)
        +'&order=created_at.desc&limit=1';
      var r=await fetch(url,{cache:'no-store',headers:{apikey:APIKEY,Authorization:'Bearer '+APIKEY}});
      if(r&&r.ok){
        var rows=await r.json(),row=rows&&rows[0];
        if(row){
          var p={};try{p=JSON.parse(row.message||'{}')||{};}catch(e){}
          p.livePublic=true;saveProfile(p);renderSellerPanel();
        }
      }
    }catch(e){}
  }

  async function pollOrders(){
    if(pollBusy||!isHost()||!sellerActive())return;
    pollBusy=true;
    try{
      var since=new Date(Date.now()-90000).toISOString();
      var url=BASE+'ktalk_live_messages?select=id,message,created_at'
        +'&host_id=eq.'+enc(deviceId())
        +'&message_type=eq.seller_live_order'
        +'&created_at=gte.'+enc(since)
        +'&order=created_at.asc&limit=100';
      var r=await fetch(url,{cache:'no-store',headers:{apikey:APIKEY,Authorization:'Bearer '+APIKEY}});
      if(r&&r.ok){
        var rows=await r.json();
        var a=readOrders(),known={};
        a.forEach(function(o){known[String(o.id)]=1;});
        (rows||[]).forEach(function(row){
          if(String(row.id)===lastOrderId)return;
          lastOrderId=String(row.id||lastOrderId);
          var o={};try{o=JSON.parse(row.message||'{}')||{};}catch(e){}
          if(!o.id)o.id='msg_'+String(row.id||Date.now());
          if(known[String(o.id)])return;
          o.no=String(a.length+1).padStart(3,'0');
          a.push(o);known[String(o.id)]=1;
        });
        saveOrders(a);renderSellerPanel();
      }
    }catch(e){}
    pollBusy=false;
  }

  function patchSellerCenter(){
    var old=window.openSellerCenter;
    if(typeof old!=='function'||old.__ktSeller300Patched)return;
    var fn=function(){
      old.apply(this,arguments);
      setTimeout(function(){
        try{
          var body=document.getElementById('sheetBody');
          if(!body||body.querySelector('.kt-seller300-entry-20260929'))return;
          var box=document.createElement('div');
          box.className='rowbox kt-seller300-entry-20260929';
          box.style.marginTop='8px';
          box.innerHTML='<b>🛍️ 월 300,000원 판매방송</b><br>사업자 판매자는 전화번호·계좌번호·안내문구를 방송에 표시하고, 시청자 주문을 오른쪽 주문목록으로 자동 정리해 받을 수 있습니다. 주문을 누르면 크게 열어 캡처할 수 있습니다.<br><button class="act" style="margin-top:7px" onclick="ktOpenSeller300Setup20260929()">판매방송 설정</button>';
          body.appendChild(box);
        }catch(e){}
      },30);
      return false;
    };
    fn.__ktSeller300Patched=true;
    window.openSellerCenter=fn;
  }

  function tick(){
    patchSellerCenter();
    renderSellerPanel();
    if(isHost()){pollOrders();broadcastProfile();}
    else pollSellerProfile();
  }
  patchSellerCenter();
  [150,500,1100,2200].forEach(function(ms){setTimeout(tick,ms);});
  setInterval(tick,2500);
})();