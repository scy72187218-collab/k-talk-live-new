/* K-Talk 광고·판매자 등록: 기존에 정한 사업자 신청 항목만 표시. 다른 화면은 건드리지 않음. */
(function(){
  if(window.__ktAdSellerRegistrationInstalled)return;
  window.__ktAdSellerRegistrationInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktAdSellerRegistrationStyle'))return;
    var s=document.createElement('style');
    s.id='ktAdSellerRegistrationStyle';
    s.textContent=''
      +'#sheet.kt-ad-seller-sheet .sheet-body{padding-bottom:18px!important}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-form{display:grid;gap:9px;padding:2px 0 4px}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-field{display:grid;gap:5px}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-field label{font-size:12px;font-weight:900;color:#fff}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-field input,#sheet.kt-ad-seller-sheet .kt-ad-field select{width:100%;height:44px;border:1px solid rgba(255,255,255,.14);border-radius:12px;background:#17171d;color:#fff;padding:0 12px;font-size:14px;outline:none}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-field input[type=file]{height:auto;min-height:44px;padding:10px;font-size:12px}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-fee{padding:12px;border-radius:14px;background:linear-gradient(135deg,rgba(255,192,62,.16),rgba(255,88,155,.10));border:1px solid rgba(255,205,92,.28)}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-fee b{display:block;color:#ffe17a;font-size:14px;margin-bottom:4px}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-fee strong{font-size:19px;color:#fff}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-fee small{display:block;margin-top:4px;color:#cfcfd6;font-size:11px;line-height:1.45}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-services{display:grid;grid-template-columns:1fr 1fr;gap:6px}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-services span{padding:8px 6px;border-radius:10px;background:#18181f;border:1px solid rgba(255,255,255,.08);font-size:10px;font-weight:800;color:#eee;text-align:center}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-agree{display:flex;align-items:flex-start;gap:8px;padding:4px 1px;color:#ddd;font-size:11px;line-height:1.4}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-agree input{width:18px;height:18px;flex:0 0 18px;margin:0}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-submit{height:48px;border:0;border-radius:14px;background:linear-gradient(135deg,#ffb62f,#ff4f9c);color:#111;font-size:16px;font-weight:950}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-contact{text-align:center;color:#d7d7dd;font-size:11px;line-height:1.6}'
      +'#sheet.kt-ad-seller-sheet .kt-ad-contact a{color:#ffe17a;font-weight:900;text-decoration:none}';
    document.head.appendChild(s);
  }

  window.ktSubmitAdSeller=function(){
    var ids=['ktAdBusinessName','ktAdBusinessNo','ktAdOwner','ktAdType','ktAdAddress','ktAdDetailAddress','ktAdPhone'];
    var labels=['사업자명','사업자 등록번호','대표자명','업종','사업장 주소','상세 주소','연락처'];
    for(var i=0;i<ids.length;i++){
      var el=document.getElementById(ids[i]);
      if(!el||!String(el.value||'').trim()){
        alert(labels[i]+'을(를) 입력해 주세요.');
        if(el)el.focus();
        return;
      }
    }
    var no=document.getElementById('ktAdBusinessNo');
    if(no){no.value=String(no.value||'').replace(/\D/g,'').slice(0,10);if(no.value.length!==10){alert('사업자 등록번호 10자리를 입력해 주세요.');no.focus();return;}}
    var agree=document.getElementById('ktAdAgree');
    if(!agree||!agree.checked){alert('이용약관 및 개인정보 처리방침에 동의해 주세요.');return;}
    var cert=document.getElementById('ktAdCert');
    var data={
      businessName:document.getElementById('ktAdBusinessName').value.trim(),
      businessNo:document.getElementById('ktAdBusinessNo').value.trim(),
      owner:document.getElementById('ktAdOwner').value.trim(),
      type:document.getElementById('ktAdType').value,
      address:document.getElementById('ktAdAddress').value.trim(),
      detailAddress:document.getElementById('ktAdDetailAddress').value.trim(),
      phone:document.getElementById('ktAdPhone').value.trim(),
      certificateName:(cert&&cert.files&&cert.files[0])?cert.files[0].name:'',
      submittedAt:new Date().toISOString()
    };
    try{localStorage.setItem('kt_ad_seller_application',JSON.stringify(data));}catch(e){}
    alert('광고·판매자 신청 내용이 저장되었습니다.\n문의: 010-7510-7218');
  };

  window.openAd=function(){
    ensureStyle();
    var html='<div class="kt-ad-form">'
      +'<div class="kt-ad-services"><span>🛍 상품 판매 기능</span><span>📣 사업자 마케팅 지원</span><span>👥 고객 관리</span><span>💰 안전한 정산</span></div>'
      +'<div class="kt-ad-field"><label>사업자명</label><input id="ktAdBusinessName" autocomplete="organization" placeholder="사업자명을 입력하세요"></div>'
      +'<div class="kt-ad-field"><label>사업자 등록번호</label><input id="ktAdBusinessNo" inputmode="numeric" maxlength="10" placeholder="- 없이 숫자만 입력" oninput="this.value=this.value.replace(/\\D/g,\'\').slice(0,10)"></div>'
      +'<div class="kt-ad-field"><label>대표자명</label><input id="ktAdOwner" autocomplete="name" placeholder="대표자명을 입력하세요"></div>'
      +'<div class="kt-ad-field"><label>업종</label><select id="ktAdType"><option value="">업종을 선택하세요</option><option>상품 판매</option><option>음식·식품</option><option>미용·패션</option><option>생활·서비스</option><option>숙박·여행</option><option>기타</option></select></div>'
      +'<div class="kt-ad-field"><label>사업장 주소</label><input id="ktAdAddress" autocomplete="street-address" placeholder="사업장 주소를 입력하세요"></div>'
      +'<div class="kt-ad-field"><label>상세 주소</label><input id="ktAdDetailAddress" placeholder="상세 주소를 입력하세요"></div>'
      +'<div class="kt-ad-field"><label>연락처</label><input id="ktAdPhone" type="tel" inputmode="tel" autocomplete="tel" placeholder="010-1234-5678"></div>'
      +'<div class="kt-ad-field"><label>사업자등록증</label><input id="ktAdCert" type="file" accept="image/*,.pdf"><small style="color:#aaa;font-size:10px">사업자 판매·홍보 방송 신청 시 사업자등록증을 확인합니다.</small></div>'
      +'<div class="kt-ad-fee"><b>이용료 안내</b><strong>월 300,000원</strong><small>부가세 별도 · 매월 자동 결제<br>광고비 입금 → K-Talk 확인·승인 → 광고판 게시</small></div>'
      +'<label class="kt-ad-agree"><input id="ktAdAgree" type="checkbox"><span>이용약관 및 개인정보 처리방침에 동의합니다.</span></label>'
      +'<button class="kt-ad-submit" type="button" onclick="ktSubmitAdSeller()">신청하기</button>'
      +'<div class="kt-ad-contact">광고·판매 문의 <a href="tel:01075107218">010-7510-7218</a><br>K-Talk 대표 송충영 · 사업자번호 787-48-01170</div>'
      +'</div>';
    showSheet('📣 광고·판매자 등록',html);
    try{sheet.classList.add('kt-ad-seller-sheet');}catch(e){}
  };

  var oldClose=window.closeSheet;
  if(typeof oldClose==='function'){
    window.closeSheet=function(){
      try{var sh=document.getElementById('sheet');if(sh)sh.classList.remove('kt-ad-seller-sheet');}catch(e){}
      return oldClose.apply(this,arguments);
    };
  }
})();

/* 사용방법 메뉴에 카메라·보정 안내만 추가로 연결 */
(function(){
  if(document.querySelector('script[data-kt-help-beauty-guide]'))return;
  var s=document.createElement('script');
  s.src='help-guide-benefits-20260910.js?v=20260910a';
  s.async=false;
  s.setAttribute('data-kt-help-beauty-guide','1');
  document.head.appendChild(s);
})();

/* 동영상과 방송 화면에서도 우측 장미 위 네트워크 표시 연결 */
(function(){
  if(document.querySelector('script[data-kt-wifi-status]'))return;
  var s=document.createElement('script');
  s.src='wifi-status-indicator.js?v=20260910b';
  s.async=false;
  s.setAttribute('data-kt-wifi-status','1');
  document.head.appendChild(s);
})();

/* AI 한국어 음성 읽기 안정화 파일만 추가 연결 */
(function(){
  if(document.querySelector('script[data-kt-ai-voice-fix]'))return;
  var s=document.createElement('script');
  s.src='ai-voice-fix.js?v=20260910a';
  s.async=false;
  s.setAttribute('data-kt-ai-voice-fix','1');
  document.head.appendChild(s);
})();

/* 방송방 선택 스위치 터치 보강만 연결 */
(function(){
  if(document.querySelector('script[data-kt-room-switch-fix]'))return;
  var s=document.createElement('script');
  s.src='room-switch-fix-20260910.js?v=20260911-income2';
  s.async=false;
  s.setAttribute('data-kt-room-switch-fix','1');
  document.head.appendChild(s);
})();

/* 4개 방송방 카메라 안쪽 무지개 파장만 연결 */
(function(){
  if(document.querySelector('script[data-kt-wave-camera-bars]'))return;
  var s=document.createElement('script');
  s.src='wave-camera-bars-20260911.js?v=20260911-wave10';
  s.async=false;
  s.setAttribute('data-kt-wave-camera-bars','1');
  document.head.appendChild(s);
})();

/* 현재 방송자 표시·친구 방송목록·다른 기기 실시간 입장 기능만 연결 */
(function(){
  if(document.querySelector('script[data-kt-live-presence]'))return;
  var s=document.createElement('script');
  s.src='live-presence.js?v=20260910-live1';
  s.async=false;
  s.setAttribute('data-kt-live-presence','1');
  s.onload=function(){
    if(document.querySelector('script[data-kt-live-video-discovery]'))return;
    var v=document.createElement('script');
    v.src='live-video-discovery.js?v=20260910-live1';
    v.async=false;
    v.setAttribute('data-kt-live-video-discovery','1');
    document.head.appendChild(v);
  };
  document.head.appendChild(s);
})();

/* 첫 페이지가 비어 있을 때만 다시 열고 홈 화면 아이콘 메타를 연결 */
(function(){
  if(document.querySelector('script[data-kt-first-page-icon]'))return;
  var s=document.createElement('script');
  s.src='first-page-icon-bootstrap.js?v=20260910-icon2';
  s.async=false;
  s.setAttribute('data-kt-first-page-icon','1');
  document.head.appendChild(s);
})();

/* 친구/원격 방송에 채팅·좋아요·선물·공유와 입장 닉네임 표시만 연결 */
(function(){
  if(document.querySelector('script[data-kt-live-viewer-interactions]'))return;
  var s=document.createElement('script');
  s.src='live-viewer-interactions.js?v=20260910-chat1';
  s.async=false;
  s.setAttribute('data-kt-live-viewer-interactions','1');
  document.head.appendChild(s);
})();

/* 방송방이 열렸는데 목록 등록이 빠질 때만 실시간 등록을 보강 */
(function(){
  if(document.querySelector('script[data-kt-live-watchdog]'))return;
  var s=document.createElement('script');
  s.src='live-presence-watchdog.js?v=20260912-live1';
  s.async=false;
  s.setAttribute('data-kt-live-watchdog','1');
  document.head.appendChild(s);
})();
