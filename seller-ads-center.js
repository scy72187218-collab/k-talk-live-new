/* K-Talk 광고·판매자 센터: 정면 광고 / 광고 동영상 / 월 판매자 계약. 기존 방송 기능은 변경하지 않음. */
(function(){
  if(window.__ktSellerAdsCenterInstalled)return;
  window.__ktSellerAdsCenterInstalled=true;

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function save(key,val){try{localStorage.setItem(key,JSON.stringify(val));return true;}catch(e){return false;}}
  function load(key,fallback){try{var v=localStorage.getItem(key);return v?JSON.parse(v):fallback;}catch(e){return fallback;}}

  function ensureStyle(){
    if(document.getElementById('ktSellerAdsStyle'))return;
    var s=document.createElement('style');
    s.id='ktSellerAdsStyle';
    s.textContent=''
      +'.kt-biz-center{display:grid;gap:10px;padding:2px 0 8px}.kt-biz-card{border:1px solid rgba(255,255,255,.13);border-radius:16px;padding:13px;background:linear-gradient(160deg,rgba(255,255,255,.08),rgba(255,255,255,.035));color:#fff}.kt-biz-card h3{margin:0 0 5px;font-size:16px}.kt-biz-card p{margin:0 0 9px;color:#ddd;font-size:12px;line-height:1.45}.kt-biz-card strong.price{display:block;margin:3px 0 9px;font-size:21px;color:#ffd75a}.kt-biz-btn{width:100%;min-height:42px;border:0;border-radius:12px;background:linear-gradient(135deg,#7b4dff,#ff3f8f);color:#fff;font-weight:950;font-size:14px}.kt-biz-btn.gold{background:linear-gradient(135deg,#ffcf45,#ff8a2b);color:#211500}.kt-biz-form{display:grid;gap:8px}.kt-biz-form label{font-size:11px;color:#ddd}.kt-biz-form input,.kt-biz-form textarea{width:100%;box-sizing:border-box;margin-top:4px;border:1px solid rgba(255,255,255,.16);border-radius:11px;background:#17171c;color:#fff;padding:10px;font-size:13px}.kt-biz-form textarea{min-height:78px;resize:vertical}.kt-biz-note{font-size:10px!important;color:#aaa!important}.kt-biz-status{margin-top:8px;padding:8px 10px;border-radius:10px;background:rgba(65,205,129,.11);font-size:11px;color:#caffdf}.kt-profile-business-btn{width:100%;margin-top:9px;min-height:42px;border:1px solid rgba(255,211,86,.45);border-radius:12px;background:rgba(255,186,45,.11);color:#ffe17a;font-weight:950;font-size:13px}';
    document.head.appendChild(s);
  }

  window.openKTalkBusinessCenter=function(){
    ensureStyle();
    var seller=load('kt_seller_contract_application',null);
    var sellerStatus=seller?'<div class="kt-biz-status">판매자 계약 신청 저장됨 · 월 300,000원 · 결제/승인 연결 대기</div>':'';
    var html='<div class="kt-biz-center">'
      +'<div class="kt-biz-card"><h3>📌 정면 광고</h3><p>첫 화면·메인 영역에 정면으로 노출하는 광고 신청입니다.</p><button class="kt-biz-btn" onclick="ktOpenFrontAdForm()">정면 광고 신청</button></div>'
      +'<div class="kt-biz-card"><h3>🎬 광고 동영상</h3><p>광고용 동영상을 선택해 제목과 설명을 등록하는 방식입니다.</p><button class="kt-biz-btn" onclick="ktOpenVideoAdForm()">광고 동영상 등록</button></div>'
      +'<div class="kt-biz-card"><h3>🛍 판매자 월 계약</h3><strong class="price">월 300,000원</strong><p>1개월 계약으로 방송 중 상품을 소개하고 판매할 수 있는 판매자 기능입니다.</p><button class="kt-biz-btn gold" onclick="ktOpenSellerContract()">판매자 계약 신청</button>'+sellerStatus+'<p class="kt-biz-note">이용 시작 후 환불은 관련 법령과 실제 이용약관에 따라 처리하도록 표시합니다.</p></div>'
      +'</div>';
    if(window.showSheet)showSheet('📣 광고·판매자',html);
  };

  window.ktOpenFrontAdForm=function(){
    var html='<div class="kt-biz-form"><label>광고 제목<input id="ktFrontAdTitle" maxlength="40" placeholder="광고 제목"></label><label>광고 문구<textarea id="ktFrontAdText" maxlength="160" placeholder="메인에 노출할 광고 문구"></textarea></label><label>연결 주소<input id="ktFrontAdLink" maxlength="220" placeholder="https://"></label><button class="kt-biz-btn" onclick="ktSaveFrontAd()">정면 광고 신청 저장</button></div>';
    if(window.showSheet)showSheet('📌 정면 광고',html);
  };
  window.ktSaveFrontAd=function(){
    var data={title:(document.getElementById('ktFrontAdTitle')||{}).value||'',text:(document.getElementById('ktFrontAdText')||{}).value||'',link:(document.getElementById('ktFrontAdLink')||{}).value||'',createdAt:Date.now(),status:'신청'};
    if(!data.title.trim()){alert('광고 제목을 입력해 주세요.');return;}
    save('kt_front_ad_application',data); alert('정면 광고 신청 내용을 저장했습니다.'); openKTalkBusinessCenter();
  };

  window.ktOpenVideoAdForm=function(){
    var html='<div class="kt-biz-form"><label>광고 제목<input id="ktVideoAdTitle" maxlength="40" placeholder="광고 제목"></label><label>광고 동영상<input id="ktVideoAdFile" type="file" accept="video/*"></label><label>설명<textarea id="ktVideoAdText" maxlength="160" placeholder="광고 설명"></textarea></label><button class="kt-biz-btn" onclick="ktSaveVideoAd()">광고 동영상 신청 저장</button><p class="kt-biz-note">현재 화면에서는 파일 선택과 신청정보를 준비합니다. 실제 서버 업로드·광고 송출은 저장공간/결제 연결 후 작동합니다.</p></div>';
    if(window.showSheet)showSheet('🎬 광고 동영상',html);
  };
  window.ktSaveVideoAd=function(){
    var f=(document.getElementById('ktVideoAdFile')||{}).files; var file=f&&f[0];
    var data={title:(document.getElementById('ktVideoAdTitle')||{}).value||'',text:(document.getElementById('ktVideoAdText')||{}).value||'',fileName:file?file.name:'',createdAt:Date.now(),status:'신청'};
    if(!data.title.trim()){alert('광고 제목을 입력해 주세요.');return;}
    if(!file){alert('광고 동영상을 선택해 주세요.');return;}
    save('kt_video_ad_application',data); alert('광고 동영상 신청 내용을 저장했습니다.'); openKTalkBusinessCenter();
  };

  window.ktOpenSellerContract=function(){
    var old=load('kt_seller_contract_application',{});
    var html='<div class="kt-biz-form"><div class="kt-biz-card"><strong class="price">월 300,000원</strong><p>계약 기간 1개월 · 방송 중 상품 판매 기능 사용</p></div><label>판매자명<input id="ktSellerName" maxlength="30" value="'+esc(old.name||'')+'" placeholder="판매자 또는 상호명"></label><label>연락처<input id="ktSellerContact" maxlength="40" value="'+esc(old.contact||'')+'" placeholder="연락 가능한 번호/계정"></label><label>판매 품목<textarea id="ktSellerItems" maxlength="200" placeholder="판매할 상품 종류">'+esc(old.items||'')+'</textarea></label><button class="kt-biz-btn gold" onclick="ktSaveSellerContract()">월 판매자 계약 신청 저장</button><button class="kt-biz-btn" onclick="ktOpenSellerProducts()">상품 등록 화면</button><p class="kt-biz-note">실제 300,000원 결제와 계약 활성화는 결제 시스템을 연결해야 완료됩니다.</p></div>';
    if(window.showSheet)showSheet('🛍 판매자 월 계약',html);
  };
  window.ktSaveSellerContract=function(){
    var data={name:(document.getElementById('ktSellerName')||{}).value||'',contact:(document.getElementById('ktSellerContact')||{}).value||'',items:(document.getElementById('ktSellerItems')||{}).value||'',price:300000,periodDays:30,createdAt:Date.now(),status:'결제·승인 대기'};
    if(!data.name.trim()){alert('판매자명을 입력해 주세요.');return;}
    save('kt_seller_contract_application',data); alert('판매자 월 계약 신청을 저장했습니다.'); openKTalkBusinessCenter();
  };

  window.ktOpenSellerProducts=function(){
    var arr=load('kt_seller_products',[]);
    var list=arr.length?arr.map(function(x,i){return '<div class="kt-biz-status"><b>'+esc(x.name)+'</b> · '+Number(x.price||0).toLocaleString('ko-KR')+'원 <button onclick="ktDeleteSellerProduct('+i+')">삭제</button></div>';}).join(''):'<p class="kt-biz-note">등록한 상품이 없습니다.</p>';
    var html='<div class="kt-biz-form"><label>상품명<input id="ktSellerProductName" maxlength="40" placeholder="상품명"></label><label>판매가<input id="ktSellerProductPrice" inputmode="numeric" maxlength="12" placeholder="가격"></label><label>상품 설명<textarea id="ktSellerProductText" maxlength="180" placeholder="상품 설명"></textarea></label><button class="kt-biz-btn gold" onclick="ktSaveSellerProduct()">상품 등록</button>'+list+'<p class="kt-biz-note">판매자 계약이 실제 승인된 계정만 방송에 상품을 노출하도록 연결할 수 있습니다.</p></div>';
    if(window.showSheet)showSheet('🛒 판매 상품 등록',html);
  };
  window.ktSaveSellerProduct=function(){
    var name=(document.getElementById('ktSellerProductName')||{}).value||''; var p=String((document.getElementById('ktSellerProductPrice')||{}).value||'').replace(/[^0-9]/g,''); var text=(document.getElementById('ktSellerProductText')||{}).value||'';
    if(!name.trim()||!p){alert('상품명과 가격을 입력해 주세요.');return;}
    var arr=load('kt_seller_products',[]); arr.push({name:name.trim(),price:parseInt(p,10)||0,text:text,createdAt:Date.now()}); save('kt_seller_products',arr); ktOpenSellerProducts();
  };
  window.ktDeleteSellerProduct=function(i){var arr=load('kt_seller_products',[]);arr.splice(i,1);save('kt_seller_products',arr);ktOpenSellerProducts();};

  function addProfileButton(){
    ensureStyle();
    var box=document.querySelector('#sheet .kt-my-profile');
    if(!box||box.querySelector('.kt-profile-business-btn'))return;
    var b=document.createElement('button'); b.type='button'; b.className='kt-profile-business-btn'; b.textContent='📣 광고·판매자'; b.onclick=function(){window.openKTalkBusinessCenter();}; box.appendChild(b);
  }

  var oldOpenProfileDirect=window.openProfileDirect;
  if(typeof oldOpenProfileDirect==='function'){
    window.openProfileDirect=function(){var r=oldOpenProfileDirect.apply(this,arguments);setTimeout(addProfileButton,0);return r;};
  }
  document.addEventListener('click',function(){setTimeout(addProfileButton,20);},true);
})();
