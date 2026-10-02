/* K-Talk 홈쇼핑형 상품 판매/주문 — 2026-10-02
   판매자 신청 정보가 있는 사업자는 상품을 등록할 수 있고,
   방송이 끝난 뒤에도 대시보드의 홈쇼핑에서 상품을 계속 볼 수 있다.
   주문 시 구매자 연락처는 주문 확인용으로만 저장한다.
   현재 버전은 기기 저장(localStorage) 기반이다. */
(function(){
  if(window.__ktSellerMarketplace20261002)return;
  window.__ktSellerMarketplace20261002=true;

  var PRODUCT_KEY='ktalk_market_products_v1';
  var ORDER_KEY='ktalk_market_orders_v1';

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function won(v){return (parseInt(v,10)||0).toLocaleString('ko-KR')+'원';}
  function read(key){
    try{var a=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(a)?a:[];}catch(e){return [];}
  }
  function write(key,a){try{localStorage.setItem(key,JSON.stringify(a||[]));return true;}catch(e){return false;}}
  function seller(){
    try{
      var x=JSON.parse(localStorage.getItem('kt_ad_seller_application')||'null');
      return x&&x.businessName?x:null;
    }catch(e){return null;}
  }
  function uid(prefix){return prefix+'_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,8);}

  function style(){
    if(document.getElementById('ktSellerMarketStyle20261002'))return;
    var s=document.createElement('style');
    s.id='ktSellerMarketStyle20261002';
    s.textContent=''
      +'.kt-market-head{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:10px}.kt-market-head b{font-size:17px}.kt-market-head button{border:0;border-radius:10px;padding:9px 11px;background:#ffcf4a;color:#111;font-weight:950}'
      +'.kt-market-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.kt-market-card{overflow:hidden;border:1px solid #ffffff1d;border-radius:15px;background:#111117;color:#fff}.kt-market-photo{width:100%;aspect-ratio:1/1;display:grid;place-items:center;background:#202029;font-size:35px;overflow:hidden}.kt-market-photo img{width:100%;height:100%;object-fit:cover}.kt-market-copy{padding:9px}.kt-market-copy b{display:block;font-size:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kt-market-copy strong{display:block;margin-top:5px;color:#ffe071;font-size:16px}.kt-market-copy small{display:block;margin-top:4px;color:#aaa;font-size:9px;line-height:1.35;min-height:24px}.kt-market-buy{width:100%;height:38px;border:0;border-radius:10px;background:linear-gradient(135deg,#ff3d8f,#8b56ff);color:#fff;font-weight:950;margin-top:7px}'
      +'.kt-market-form{display:grid;gap:8px}.kt-market-form label{display:grid;gap:4px;color:#fff;font-size:11px;font-weight:900}.kt-market-form input,.kt-market-form textarea{width:100%;box-sizing:border-box;border:1px solid #ffffff22;border-radius:11px;background:#15151b;color:#fff;padding:11px;font-size:14px}.kt-market-form textarea{min-height:80px;resize:none}.kt-market-row{display:grid;grid-template-columns:1fr 1fr;gap:7px}.kt-market-submit{height:46px;border:0;border-radius:12px;background:linear-gradient(135deg,#ffd34f,#ff6f9e);color:#111;font-weight:950}'
      +'.kt-market-order{padding:10px;border:1px solid #ffffff18;border-radius:13px;background:#111117;margin-bottom:8px;color:#fff}.kt-market-order b{display:block}.kt-market-order small{display:block;margin-top:5px;color:#bbb;line-height:1.5}'
      +'.kt-market-dashboard-btn{width:100%!important;min-height:58px!important;border:1px solid #ffcf4a66!important;border-radius:15px!important;background:linear-gradient(135deg,#241907,#17121f)!important;color:#fff!important;font-weight:950!important}'
      +'@media(max-width:390px){.kt-market-grid{gap:6px}.kt-market-copy{padding:7px}.kt-market-copy strong{font-size:14px}}';
    document.head.appendChild(s);
  }

  function photoHtml(p){
    return p&&/^data:image\//.test(p)?'<img src="'+p+'" alt="">':'🛍️';
  }

  function products(){
    return read(PRODUCT_KEY).filter(function(x){return x&&x.active!==false;});
  }

  window.openSellerMarket20261002=function(){
    style();
    var list=products();
    var s=seller();
    var html='<div class="kt-market-head"><b>🛍 K-Talk 홈쇼핑</b>'
      +(s?'<button type="button" onclick="openSellerProductForm20261002()">＋ 상품 등록</button>':'<button type="button" onclick="openAd()">사업자 판매 신청</button>')
      +'</div>';
    if(!list.length){
      html+='<div class="rowbox"><b>등록된 상품이 없습니다.</b><br>사업자 판매자가 상품을 등록하면 방송이 끝난 뒤에도 이곳에서 계속 볼 수 있습니다.</div>';
    }else{
      html+='<div class="kt-market-grid">'+list.map(function(p){
        return '<div class="kt-market-card">'
          +'<div class="kt-market-photo">'+photoHtml(p.photo||'')+'</div>'
          +'<div class="kt-market-copy"><b>'+esc(p.title||'상품')+'</b><strong>'+won(p.price)+'</strong>'
          +'<small>'+esc(p.sellerName||'판매자')+(p.showPhone&&p.phone?' · '+esc(p.phone):'')+'</small>'
          +'<button type="button" class="kt-market-buy" onclick="openMarketOrder20261002(\''+esc(p.id)+'\')">구매하기</button></div>'
          +'</div>';
      }).join('')+'</div>';
    }
    if(s){
      html+='<button class="act" style="margin-top:10px" onclick="openSellerOrders20261002()">📦 주문 내역 보기</button>';
    }
    if(typeof window.showSheet==='function')window.showSheet('🛍 홈쇼핑 · 상품',html);
  };

  window.openSellerProductForm20261002=function(){
    style();
    var s=seller();
    if(!s){if(typeof window.openAd==='function')window.openAd();return;}
    var html='<div class="rowbox"><b>'+esc(s.businessName)+' 상품 등록</b><br>방송이 끝난 뒤에도 홈쇼핑에 계속 표시됩니다.</div>'
      +'<div class="kt-market-form">'
      +'<label>상품명<input id="ktMarketTitle" maxlength="60" placeholder="상품명을 입력하세요"></label>'
      +'<label>가격<input id="ktMarketPrice" inputmode="numeric" placeholder="예: 19900"></label>'
      +'<label>상품 사진<input id="ktMarketPhoto" type="file" accept="image/*"></label>'
      +'<label>상품 설명<textarea id="ktMarketDesc" maxlength="500" placeholder="상품 설명을 입력하세요"></textarea></label>'
      +'<label>판매자 연락처<input id="ktMarketPhone" type="tel" value="'+esc(s.phone||'')+'" placeholder="연락처"></label>'
      +'<label style="display:flex;grid-template-columns:auto 1fr;align-items:center;gap:8px"><input id="ktMarketShowPhone" type="checkbox" style="width:18px;height:18px">상품 화면에 판매자 전화번호 공개</label>'
      +'<button class="kt-market-submit" type="button" onclick="saveSellerProduct20261002()">상품 올리기</button>'
      +'</div>';
    if(typeof window.showSheet==='function')window.showSheet('🛍 상품 등록',html);
  };

  function readPhoto(file,done){
    if(!file){done('');return;}
    if(file.size>900000){alert('상품 사진은 900KB 이하로 올려 주세요.');done(null);return;}
    var r=new FileReader();
    r.onload=function(){done(String(r.result||''));};
    r.onerror=function(){done(null);};
    r.readAsDataURL(file);
  }

  window.saveSellerProduct20261002=function(){
    var s=seller();
    if(!s)return;
    var title=document.getElementById('ktMarketTitle');
    var price=document.getElementById('ktMarketPrice');
    var desc=document.getElementById('ktMarketDesc');
    var phone=document.getElementById('ktMarketPhone');
    var show=document.getElementById('ktMarketShowPhone');
    var file=document.getElementById('ktMarketPhoto');
    var t=title?String(title.value||'').trim():'';
    var pr=parseInt(String(price&&price.value||'').replace(/[^0-9]/g,''),10)||0;
    if(!t){alert('상품명을 입력해 주세요.');return;}
    if(pr<=0){alert('가격을 입력해 주세요.');return;}
    readPhoto(file&&file.files&&file.files[0],function(photo){
      if(photo===null)return;
      var list=read(PRODUCT_KEY);
      list.unshift({
        id:uid('p'),
        sellerName:s.businessName,
        businessNo:s.businessNo||'',
        title:t,
        price:pr,
        photo:photo||'',
        description:desc?String(desc.value||'').trim():'',
        phone:phone?String(phone.value||'').trim():'',
        showPhone:!!(show&&show.checked),
        active:true,
        createdAt:new Date().toISOString()
      });
      if(!write(PRODUCT_KEY,list)){alert('상품 저장 공간이 부족합니다. 사진 용량을 줄여 주세요.');return;}
      alert('상품을 등록했습니다. 방송이 끝나도 홈쇼핑에서 계속 볼 수 있습니다.');
      window.openSellerMarket20261002();
    });
  };

  window.openMarketOrder20261002=function(id){
    var p=products().find(function(x){return String(x.id)===String(id);});
    if(!p)return;
    var html='<div class="rowbox"><b>'+esc(p.title)+'</b><br><strong style="font-size:20px">'+won(p.price)+'</strong><br>'+esc(p.sellerName||'판매자')+'</div>'
      +'<div class="kt-market-form">'
      +'<label>구매자 이름<input id="ktOrderBuyerName" maxlength="40" placeholder="이름"></label>'
      +'<label>전화번호<input id="ktOrderBuyerPhone" type="tel" inputmode="tel" placeholder="010-1234-5678"></label>'
      +'<label>수량<input id="ktOrderQty" type="number" min="1" max="99" value="1"></label>'
      +'<label>배송/문의 메모<textarea id="ktOrderMemo" maxlength="300" placeholder="배송 요청이나 문의 내용을 적어 주세요"></textarea></label>'
      +'<label style="display:flex;grid-template-columns:auto 1fr;align-items:start;gap:8px"><input id="ktOrderAgree" type="checkbox" style="width:18px;height:18px"><span>주문 처리를 위해 이름과 전화번호를 판매자에게 전달하는 데 동의합니다.</span></label>'
      +'<button class="kt-market-submit" type="button" onclick="submitMarketOrder20261002(\''+esc(p.id)+'\')">구매 요청 보내기</button>'
      +'</div>';
    if(typeof window.showSheet==='function')window.showSheet('🛒 구매하기',html);
  };

  window.submitMarketOrder20261002=function(id){
    var p=products().find(function(x){return String(x.id)===String(id);});
    if(!p)return;
    var name=String((document.getElementById('ktOrderBuyerName')||{}).value||'').trim();
    var phone=String((document.getElementById('ktOrderBuyerPhone')||{}).value||'').trim();
    var qty=Math.max(1,parseInt(String((document.getElementById('ktOrderQty')||{}).value||'1'),10)||1);
    var memo=String((document.getElementById('ktOrderMemo')||{}).value||'').trim();
    var agree=document.getElementById('ktOrderAgree');
    if(!name){alert('구매자 이름을 입력해 주세요.');return;}
    if(!phone){alert('전화번호를 입력해 주세요.');return;}
    if(!agree||!agree.checked){alert('주문 연락처 전달에 동의해 주세요.');return;}
    var list=read(ORDER_KEY);
    list.unshift({
      id:uid('o'),productId:p.id,productTitle:p.title,sellerName:p.sellerName,
      buyerName:name,buyerPhone:phone,qty:qty,amount:(p.price||0)*qty,
      memo:memo,status:'신규 주문',createdAt:new Date().toISOString()
    });
    write(ORDER_KEY,list);
    alert('구매 요청이 저장되었습니다. 판매자가 주문 내역에서 확인할 수 있습니다.');
    window.openSellerMarket20261002();
  };

  window.openSellerOrders20261002=function(){
    style();
    var s=seller();
    if(!s){if(typeof window.openAd==='function')window.openAd();return;}
    var list=read(ORDER_KEY).filter(function(x){return x&&x.sellerName===s.businessName;});
    var html='<div class="rowbox"><b>📦 '+esc(s.businessName)+' 주문 내역</b><br>구매자가 남긴 주문과 전화번호를 확인합니다.</div>';
    if(!list.length)html+='<div class="rowbox">아직 주문이 없습니다.</div>';
    else html+=list.map(function(o){
      return '<div class="kt-market-order"><b>'+esc(o.productTitle)+' · '+won(o.amount)+'</b>'
        +'<small>구매자 '+esc(o.buyerName)+' · '+esc(o.buyerPhone)+'<br>수량 '+Number(o.qty||1)+'개 · '+esc(o.status||'신규 주문')
        +(o.memo?'<br>메모: '+esc(o.memo):'')+'</small></div>';
    }).join('');
    if(typeof window.showSheet==='function')window.showSheet('📦 판매 주문',html);
  };

  window.openSellerCenter=function(){
    style();
    var s=seller();
    var html='<div class="rowbox"><b>🛍 판매 · 홈쇼핑</b><br>사업자 판매자는 상품을 올리고, 구매 주문과 연락처를 확인할 수 있습니다.</div>'
      +'<button class="act" onclick="openSellerMarket20261002()">🛍 홈쇼핑 보기</button>'
      +(s?'<button class="act" onclick="openSellerProductForm20261002()">＋ 상품 등록</button><button class="act" onclick="openSellerOrders20261002()">📦 주문 내역</button>':'<button class="act" onclick="openAd()">📣 사업자 판매 신청</button>');
    if(typeof window.showSheet==='function')window.showSheet('🏷️ 판매 · 정산',html);
  };

  function installDashboard(){
    style();
    var dash=document.querySelector('.kt-dashboard');
    if(!dash||dash.querySelector('[data-kt-market-dashboard]'))return;
    var wide=dash.querySelector('.kt-wide')||dash.querySelector('.kt-shortcuts');
    if(!wide)return;
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-market-dashboard-btn';
    b.setAttribute('data-kt-market-dashboard','1');
    b.innerHTML='<b>🛍 홈쇼핑 · 상품</b><small style="display:block;margin-top:4px;color:#ddd">방송 종료 후에도 상품 보기 · 구매하기</small>';
    b.onclick=function(){window.openSellerMarket20261002();};
    wide.appendChild(b);
  }

  installDashboard();
  [100,300,700,1400,2400].forEach(function(ms){setTimeout(installDashboard,ms);});
  try{
    new MutationObserver(function(){setTimeout(installDashboard,30);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();