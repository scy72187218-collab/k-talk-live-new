/* 태권1/하이네2 프로필 전용 총관리 스위치.
   다른 계정/방송/카메라/채팅 기능은 변경하지 않음. */
(function(){
  var KT_DEFAULT_ADMIN_PIN_20261002='7510';
  try{
    if(!String(localStorage.getItem('ktalk_total_admin_lock_pin')||'').trim()){
      localStorage.setItem('ktalk_total_admin_lock_pin',KT_DEFAULT_ADMIN_PIN_20261002);
    }
  }catch(e){}
  if(window.__ktOwnerTotalAdminSwitch20260918)return;
  window.__ktOwnerTotalAdminSwitch20260918=true;

  function ownerKey(){
    try{
      if(typeof window.ktGetSelectedSubAccount!=='function')return '';
      var k=window.ktGetSelectedSubAccount();
      return (k==='taekwon1'||k==='haine2')?k:'';
    }catch(e){return '';}
  }
  function isOwner(){return !!ownerKey();}

  function ensureStyle(){
    if(document.getElementById('ktTaekwon1AdminSwitchStyle'))return;
    var s=document.createElement('style');
    s.id='ktTaekwon1AdminSwitchStyle';
    s.textContent=''
      +'.kt-total-admin-wrap{margin:12px 0 8px;padding:11px 12px;border:1px solid rgba(255,206,72,.42);border-radius:15px;background:linear-gradient(135deg,rgba(41,27,4,.72),rgba(16,13,9,.88));color:#fff;box-shadow:0 0 15px rgba(255,190,55,.12)}'
      +'.kt-total-admin-row{width:100%;border:0;background:transparent;color:#fff;display:flex;align-items:center;gap:9px;padding:0;text-align:left;touch-action:manipulation}'
      +'.kt-total-admin-row .kt-admin-icon{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:#2b2108;border:1px solid #e7b83d;font-size:17px}'
      +'.kt-total-admin-row .kt-admin-copy{flex:1;min-width:0}.kt-total-admin-row .kt-admin-copy b{display:block;font-size:14px;color:#ffe37c}.kt-total-admin-row .kt-admin-copy small{display:block;margin-top:2px;color:#cfcfcf;font-size:10px}'
      +'.kt-admin-toggle{width:48px;height:27px;border-radius:999px;background:#3d3d44;border:1px solid #ffffff2b;padding:3px;display:flex;align-items:center;transition:.16s}'
      +'.kt-admin-toggle i{display:block;width:19px;height:19px;border-radius:50%;background:#fff;box-shadow:0 2px 5px #0008;transition:.16s}'
      +'.kt-total-admin-wrap.open .kt-admin-toggle{background:#d99d18}.kt-total-admin-wrap.open .kt-admin-toggle i{transform:translateX(19px)}'
      +'.kt-total-admin-panel{display:none;margin-top:10px;padding-top:9px;border-top:1px solid #ffffff18;grid-template-columns:1fr;gap:7px}'
      +'.kt-total-admin-wrap.open .kt-total-admin-panel{display:grid}'
      +'.kt-total-admin-panel button{height:42px;border-radius:11px;border:1px solid rgba(255,255,255,.16);background:#121218;color:#fff;font-weight:900;font-size:13px;text-align:left;padding:0 13px;touch-action:manipulation}'
      +'.kt-total-admin-panel button span{float:right;color:#ffd76a}'
      +'.kt-admin-locked-note{font-size:10px;color:#bdbdc6;line-height:1.35;padding:2px 3px 0}';
    document.head.appendChild(s);
  }

  function panelHtml(){
    var label=ownerKey()==='haine2'?'하이네2':'태권1';
    return '<div class="kt-total-admin-wrap" id="ktTotalAdminWrap">'
      +'<button class="kt-total-admin-row" type="button" onclick="ktToggleTotalAdminPanel()">'
      +'<span class="kt-admin-icon">🛡️</span>'
      +'<span class="kt-admin-copy"><b>총관리</b><small>'+label+' 관리자 전용</small></span>'
      +'<span class="kt-admin-toggle" aria-hidden="true"><i></i></span>'
      +'</button>'
      +'<div class="kt-total-admin-panel">'
      +'<button type="button" onclick="ktTotalAdminAction(\'overview\')">📊 전체 관리 현황 <span>›</span></button>'
      +'<button type="button" onclick="ktTotalAdminAction(\'coin\')">🪙 회원 코인 지급 <span>›</span></button>'
      +'<button type="button" onclick="ktTotalAdminAction(\'suspend\')">⛔ 회원 정지 <span>›</span></button>'
      +'<button type="button" onclick="ktTotalAdminAction(\'release\')">✅ 정지 해제 <span>›</span></button>'
      +'<button type="button" onclick="ktTotalAdminAction(\'monitor\')">👁 방송 모니터링 <span>›</span></button>'
      +'<button type="button" onclick="ktTotalAdminAction(\'profilelink\')">🔗 프로필 링크 <span>›</span></button>'
      +'<button type="button" onclick="ktTotalAdminAction(\'content\')">📣 광고·동영상 승인 <span>›</span></button>'
      +'<button type="button" onclick="ktTotalAdminAction(\'lock\')">🔒 전체 잠금 <span>›</span></button>'
      +'<div class="kt-admin-locked-note">관리 기능은 총관리 스위치 안에서만 사용합니다.</div>'
      +'</div></div>';
  }

  window.ktToggleTotalAdminPanel=function(){
    if(!isOwner())return false;
    var box=document.getElementById('ktTotalAdminWrap');
    if(box)box.classList.toggle('open');
    return false;
  };

  window.ktTotalAdminAction=function(kind){
    if(!isOwner())return false;
    if(kind==='overview'){
      try{if(typeof window.ktOpenTotalAdminOverview20260928==='function')window.ktOpenTotalAdminOverview20260928();}catch(e){}
      return false;
    }
    if(kind==='profilelink'){
      try{
        var id='';
        try{
          if(window.__ktCurrentRemoteHostId)id=String(window.__ktCurrentRemoteHostId||'').trim();
        }catch(e){}
        if(!id){
          try{
            var card=document.querySelector('[data-host][data-live="1"],[data-host].live,[data-host].on');
            if(card)id=String(card.getAttribute('data-host')||'').trim();
          }catch(e){}
        }
        if(id){
          try{localStorage.setItem('kt_admin_profile_link_target',id);}catch(e){}
          if(typeof window.closeSheet==='function')window.closeSheet();
          if(typeof window.openProfileDirect==='function'){
            try{window.openProfileDirect(id);return false;}catch(e){}
          }
          if(typeof window.openProfile==='function'){
            try{window.openProfile(id);return false;}catch(e){}
          }
        }
        if(typeof window.showSheet==='function'){
          window.showSheet('🔗 프로필 링크',
            '<div class="rowbox"><b>방송자 프로필 바로가기</b><br>방송 목록에서 방송자 프로필 사진을 눌러 프로필을 열 수 있습니다.</div>'
            +'<button class="act" type="button" onclick="closeSheet();if(window.friends)friends();">방송 목록 보기</button>');
        }
      }catch(e){}
      return false;
    }
    if(kind==='content'){
      try{if(typeof window.ktOpenContentApprovalAdmin==='function')window.ktOpenContentApprovalAdmin();}catch(e){}
      return false;
    }
    if(kind==='lock'){
      try{
        if(typeof window.showSheet==='function'){
          var saved='';
          try{saved=String(localStorage.getItem('ktalk_total_admin_lock_pin')||'').trim();}catch(e){}
          window.showSheet('🔒 전체 잠금',
            '<div class="rowbox"><b>🔒 현재 K-Talk 전체 잠금</b><br>현재 설정과 기능을 보호하는 관리자 잠금입니다.</div>'
            +'<input id="ktAdminLockPin20260928" class="form" type="password" inputmode="numeric" maxlength="4" placeholder="'+(saved?'관리 비밀번호 입력':'새 관리자 비밀번호 4자리')+'">'
            +'<button class="act" type="button" onclick="ktConfirmAdminLock20260928()">'+(saved?'잠그기':'비밀번호 저장 후 잠그기')+'</button>'
            +(saved?'<button class="act" type="button" onclick="ktUnlockAdminLock20261002()" style="margin-top:8px;background:linear-gradient(135deg,#2b7a4b,#39a86a)">🔓 비밀번호 확인 후 열기</button>':'')
            +(saved?'<button class="act" type="button" onclick="ktOpenAdminPinChange20261002()" style="margin-top:8px;background:#25252d">🔑 비밀번호 바꾸기</button>':'')
          );
        }
      }catch(e){}
      return false;
    }
    if(kind==='monitor'){
      try{
        /* 관리자 입장/투명 모드는 쓰지 않고 현재 방송 목록만 확인 */
        try{localStorage.removeItem('ktalk_admin_monitor_mode');}catch(e){}
        if(typeof window.closeSheet==='function')window.closeSheet();
        if(typeof window.friends==='function')window.friends();
        if(typeof window.ktRefreshLiveCards==='function'){
          setTimeout(function(){try{window.ktRefreshLiveCards();}catch(e){}},80);
          setTimeout(function(){try{window.ktRefreshLiveCards();}catch(e){}},500);
        }
      }catch(e){}
      return false;
    }
    var name=kind==='coin'?'회원 코인 지급':(kind==='suspend'?'회원 정지':'정지 해제');
    try{alert('🔐 '+name+' 관리 화면입니다.\n보안 관리코드 설정 후 실제 처리 기능을 연결합니다.');}catch(e){}
    return false;
  };

  window.ktConfirmAdminLock20260928=function(){
    var el=document.getElementById('ktAdminLockPin20260928');
    var pin=String(el&&el.value||'').trim();
    if(!/^\d{4}$/.test(pin)){
      try{alert('관리 비밀번호는 숫자 4자리로 입력해 주세요.');}catch(e){}
      return false;
    }
    var savedPin='';
    try{savedPin=String(localStorage.getItem('ktalk_total_admin_lock_pin')||'').trim();}catch(e){}
    if(!savedPin){
      try{
        localStorage.setItem('ktalk_total_admin_lock_pin',pin);
        localStorage.setItem('ktalk_total_admin_locked','1');
      }catch(e){}
      try{alert('🔒 관리자 비밀번호를 저장하고 전체 잠금을 설정했습니다.');}catch(e){}
      try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
      return false;
    }
    if(pin!==savedPin){
      try{alert('비밀번호가 맞지 않습니다.');}catch(e){}
      return false;
    }
    try{localStorage.setItem('ktalk_total_admin_locked','1');}catch(e){}
    try{alert('🔒 전체 잠금이 설정되었습니다.');}catch(e){}
    try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
    return false;
  };

  window.ktUnlockAdminLock20261002=function(){
    var el=document.getElementById('ktAdminLockPin20260928');
    var pin=String(el&&el.value||'').trim();
    var saved='';
    try{saved=String(localStorage.getItem('ktalk_total_admin_lock_pin')||'').trim();}catch(e){}
    if(!saved){
      try{alert('먼저 관리자 비밀번호를 저장해 주세요.');}catch(e){}
      return false;
    }
    if(pin!==saved){
      try{alert('비밀번호가 맞지 않습니다.');}catch(e){}
      return false;
    }
    try{localStorage.setItem('ktalk_total_admin_locked','0');}catch(e){}
    try{alert('🔓 전체 잠금을 열었습니다.');}catch(e){}
    try{
      if(typeof window.showSheet==='function'){
        window.showSheet('🔓 관리자 잠금 해제',
          '<div class="rowbox"><b>관리자 잠금이 해제되었습니다.</b><br>현재 비밀번호를 바꾸려면 아래 버튼을 누르세요.</div>'
          +'<button class="act" type="button" onclick="ktOpenAdminPinChange20261002()">🔑 비밀번호 바꾸기</button>');
      }else if(typeof window.closeSheet==='function'){
        window.closeSheet();
      }
    }catch(e){}
    return false;
  };

  window.ktOpenAdminPinChange20261002=function(){
    try{
      if(typeof window.showSheet!=='function')return false;
      window.showSheet('🔑 관리자 비밀번호 바꾸기',
        '<input id="ktAdminOldPin20261002" class="form" type="password" inputmode="numeric" maxlength="4" placeholder="현재 비밀번호 4자리">'
        +'<input id="ktAdminNewPin20261002" class="form" type="password" inputmode="numeric" maxlength="4" placeholder="새 비밀번호 4자리">'
        +'<input id="ktAdminNewPin2_20261002" class="form" type="password" inputmode="numeric" maxlength="4" placeholder="새 비밀번호 다시 입력">'
        +'<button class="act" type="button" onclick="ktChangeAdminPin20261002()">비밀번호 바꾸기</button>');
    }catch(e){}
    return false;
  };

  window.ktChangeAdminPin20261002=function(){
    var oldPin=String((document.getElementById('ktAdminOldPin20261002')||{}).value||'').trim();
    var newPin=String((document.getElementById('ktAdminNewPin20261002')||{}).value||'').trim();
    var newPin2=String((document.getElementById('ktAdminNewPin2_20261002')||{}).value||'').trim();
    var saved='';
    try{saved=String(localStorage.getItem('ktalk_total_admin_lock_pin')||'').trim();}catch(e){}
    if(!saved||oldPin!==saved){try{alert('현재 비밀번호가 맞지 않습니다.');}catch(e){} return false;}
    if(!/^\d{4}$/.test(newPin)){try{alert('새 비밀번호는 숫자 4자리로 입력해 주세요.');}catch(e){} return false;}
    if(newPin!==newPin2){try{alert('새 비밀번호가 서로 다릅니다.');}catch(e){} return false;}
    try{localStorage.setItem('ktalk_total_admin_lock_pin',newPin);}catch(e){}
    try{alert('✅ 관리자 비밀번호를 바꿨습니다.');}catch(e){}
    try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
    return false;
  };

  function wrapRender(){
    if(typeof window.ktProfileRender!=='function'||window.ktProfileRender.__ktTotalAdminWrapped)return;
    var old=window.ktProfileRender;
    var fn=function(){
      var html=String(old.apply(this,arguments));
      if(!isOwner()||html.indexOf('kt-total-admin-wrap')>-1)return html;
      var marker='<button class="kt-profile-switch-btn"';
      var pos=html.indexOf(marker);
      if(pos>-1)return html.slice(0,pos)+panelHtml()+html.slice(pos);
      var end=html.lastIndexOf('</div>');
      return end>-1?html.slice(0,end)+panelHtml()+html.slice(end):html+panelHtml();
    };
    fn.__ktTotalAdminWrapped=true;
    window.ktProfileRender=fn;
  }

  function install(){
    ensureStyle();
    wrapRender();
    try{
      if(isOwner()&&document.querySelector('.kt-my-profile')&&!document.getElementById('ktTotalAdminWrap')){
        var target=document.querySelector('.kt-profile-switch-btn');
        if(target)target.insertAdjacentHTML('beforebegin',panelHtml());
      }
    }catch(e){}
  }

  install();
  [80,220,500,1000,1800,3200].forEach(function(ms){setTimeout(install,ms);});
  document.addEventListener('click',function(){setTimeout(install,20);},true);
})();