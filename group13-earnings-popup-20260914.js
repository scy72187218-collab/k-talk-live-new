/* 13명 방 수익률 터치 확대 보기 전용. 다른 방/기능은 변경하지 않음. */
(function(){
  if(window.__ktGroup13EarningsPopup20260914)return;
  window.__ktGroup13EarningsPopup20260914=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[c];
    });
  }

  window.ktGroup13ShowEarningsBig=function(){
    var net=(document.getElementById('hudEarnNet')||{}).textContent||'0원';
    var roses=(document.getElementById('hudEarnRoses')||{}).textContent||'🌹 0송이';
    var current=(document.getElementById('hudEarnRate')||{}).textContent||'일반회원 35%';
    var html=''
      +'<div style="padding:8px 2px;color:#fff;text-align:center">'
      +'<div style="padding:17px 12px;border-radius:20px;background:linear-gradient(145deg,#21152c,#0c111b);border:1px solid #b85cff;box-shadow:0 0 18px rgba(167,71,255,.28)">'
      +'<div style="font-size:13px;color:#8fe8ff;font-weight:900">🔒 내 수익 · 본인만 표시</div>'
      +'<div style="margin-top:9px;font-size:31px;color:#ffe071;font-weight:950">'+esc(net)+'</div>'
      +'<div style="margin-top:8px;font-size:18px;color:#ff9bd3;font-weight:900">'+esc(roses)+'</div>'
      +'</div>'
      +'<div style="display:grid;gap:9px;margin-top:12px;text-align:left">'
      +'<div class="rowbox" style="font-size:18px;line-height:1.5"><b style="color:#ffe071">일반회원 수익률</b><br>35%</div>'
      +'<div class="rowbox" style="font-size:18px;line-height:1.5"><b style="color:#8fe8ff">구독자회원 수익률</b><br>40%</div>'
      +'<div class="rowbox" style="font-size:18px;line-height:1.5"><b style="color:#d9a3ff">소속사 회원 수익률</b><br>65%</div>'
      +'</div>'
      +'<div style="margin-top:10px;color:#ffe071;font-size:13px">현재 표시: '+esc(current)+'</div>'
      +'</div>';
    if(typeof window.showSheet==='function')window.showSheet('💰 13명 방 수익률',html);
  };

  window.addEventListener('click',function(e){
    var target=e.target&&e.target.closest?e.target.closest('.ktg13-room #myEarnHud'):null;
    if(!target)return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    window.ktGroup13ShowEarningsBig();
  },true);
})();

/* 친구 화면 방송상태/쪽지 모듈 로더만 추가. 기존 기능은 변경하지 않음. */
(function(){
  if(window.__ktFriendsLiveMessageLoader20260915)return;
  window.__ktFriendsLiveMessageLoader20260915=true;
  try{
    var s=document.createElement('script');
    s.src='friends-live-message-status-20260915.js?v=20260915-status1';
    s.async=true;
    document.head.appendChild(s);
  }catch(e){}
})();

/* 이용방법·혜택 AI 음성 읽기 모듈 로더만 추가. 기존 기능은 변경하지 않음. */
(function(){
  if(window.__ktAiHelpReaderLoader20260915)return;
  window.__ktAiHelpReaderLoader20260915=true;
  try{
    var s=document.createElement('script');
    s.src='ai-help-reader-20260915.js?v=20260915-voice1';
    s.async=true;
    document.head.appendChild(s);
  }catch(e){}
})();

/* 사운드 목록: 자유 이용 보컬곡 20곡 전용 로더. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktFreeVocal20Loader20260915)return;
  window.__ktFreeVocal20Loader20260915=true;
  try{
    var s=document.createElement('script');
    s.src='sound-free-vocals-20-20260915.js?v=20260915-vocal20-1';
    s.async=true;
    document.head.appendChild(s);
  }catch(e){}
})();

/* 방송방 상단 퀵버튼/LED 높이 조정 모듈 로더만 추가. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktTopQuickBarLoader20260915)return;
  window.__ktTopQuickBarLoader20260915=true;
  try{
    var s=document.createElement('script');
    s.src='live-top-quickbar-20260915.js?v=20260915-topbar1';
    s.async=true;
    document.head.appendChild(s);
  }catch(e){}
})();

/* 2026-09-15: 방송 진입을 막는 K-Talk 아이콘 설치 안내를 항상 제거. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktRemoveInstallOffer20260915)return;
  window.__ktRemoveInstallOffer20260915=true;

  function removeInstallOffer(){
    try{
      ['ktFirstJoinIconOffer','ktInstallOffer','ktInstallPrompt','ktHomeInstallBanner'].forEach(function(id){
        var el=document.getElementById(id);
        if(el)el.remove();
      });
      document.querySelectorAll('[data-kt-install-offer],[data-kt-install-banner]').forEach(function(el){el.remove();});
      document.querySelectorAll('body *').forEach(function(el){
        if(!el||!el.textContent)return;
        var t=String(el.textContent).replace(/\s+/g,' ').trim();
        if((t.indexOf('K-Talk 아이콘 설치')>-1||t.indexOf('K-Talk 새 아이콘')>-1) &&
           (t.indexOf('설치 준비')>-1||t.indexOf('홈 화면')>-1||t.indexOf('아이콘 추가')>-1)){
          var box=el;
          while(box&&box.parentElement&&box.parentElement!==document.body){
            var cs='';
            try{cs=getComputedStyle(box).position;}catch(e){}
            if(cs==='fixed'||cs==='sticky')break;
            box=box.parentElement;
          }
          if(box&&box!==document.body)box.remove();
        }
      });
    }catch(e){}
  }

  removeInstallOffer();
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',removeInstallOffer,{once:true});
  setTimeout(removeInstallOffer,50);
  setTimeout(removeInstallOffer,250);
  setTimeout(removeInstallOffer,1000);
  try{
    var mo=new MutationObserver(removeInstallOffer);
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 2026-09-15: 동영상 게시 시 휴대폰 저장 모듈 로더. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktGallerySaveLoader20260915)return;
  window.__ktGallerySaveLoader20260915=true;
  try{
    var s=document.createElement('script');
    s.src='gallery-save-on-post-20260915.js?v=20260915-gallery1';
    s.async=true;
    document.head.appendChild(s);
  }catch(e){}
})();

/* 2026-09-15: 장미 레벨 시스템 로더. 기존 방 UI와 선물 UI는 변경하지 않음. */
(function(){
  if(window.__ktLevelSystemLoader20260915)return;
  window.__ktLevelSystemLoader20260915=true;
  try{
    var s=document.createElement('script');
    s.src='level-system-20260915.js?v=20260915-level1';
    s.async=true;
    document.head.appendChild(s);
  }catch(e){}
})();
