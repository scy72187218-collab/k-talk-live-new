/* K-Talk: 관리자 비밀번호 해제 후 전체 목록 -> 하위 목록 -> 세부 화면 */
(function(){
  if(window.__ktAdminUnlockFullMenu20261004)return;
  window.__ktAdminUnlockFullMenu20261004=true;

  function btn(label,action){
    return '<button class="act" type="button" onclick="'+action+'" style="margin-top:7px;text-align:left">'+label+' <span style="float:right">›</span></button>';
  }

  window.ktAdminOpenMainMenu20261004=function(){
    try{
      if(typeof window.showSheet!=='function')return false;
      var html=''
        +'<div class="rowbox"><b>🛡 총 관리자</b><br>원하는 항목을 하나씩 눌러 들어가세요.</div>'
        +btn('📊 전체 관리 현황',"ktAdminOpenSection20261004('overview')")
        +btn('👥 회원 관리',"ktAdminOpenSection20261004('members')")
        +btn('🔴 방송 관리',"ktAdminOpenSection20261004('broadcast')")
        +btn('💵 수익 · 정산 · 세무',"ktAdminOpenSection20261004('finance')")
        +btn('📣 광고 · 동영상 승인',"ktAdminOpenSection20261004('content')")
        +btn('🔒 보안 · 전체 잠금',"ktAdminOpenSection20261004('security')");
      window.showSheet('🛡 총 관리자 · 전체 목록',html);
    }catch(e){}
    return false;
  };

  window.ktAdminOpenSection20261004=function(section){
    try{
      if(section==='overview'){
        if(typeof window.ktOpenTotalAdminOverview20260928==='function')window.ktOpenTotalAdminOverview20260928();
        return false;
      }
      if(typeof window.showSheet!=='function')return false;
      var back='<button class="act" type="button" onclick="ktAdminOpenMainMenu20261004()" style="margin-bottom:8px;background:#25252d">← 전체 목록</button>';
      var html=back;

      if(section==='members'){
        html+='<div class="rowbox"><b>👥 회원 관리</b><br>아래에서 다시 한 항목을 눌러 들어가세요.</div>'
          +btn('🪙 회원 코인 지급',"ktTotalAdminAction('coin')")
          +btn('⛔ 회원 정지',"ktTotalAdminAction('suspend')")
          +btn('✅ 정지 해제',"ktTotalAdminAction('release')")
          +btn('🔗 회원/방송자 프로필',"ktTotalAdminAction('profilelink')");
        window.showSheet('👥 회원 관리',html);
        return false;
      }

      if(section==='broadcast'){
        html+='<div class="rowbox"><b>🔴 방송 관리</b><br>방송 목록이나 전체 방송 현황으로 들어갈 수 있습니다.</div>'
          +btn('👁 현재 방송 모니터링',"ktTotalAdminAction('monitor')")
          +btn('📊 방송 현황/기록',"ktOpenTotalAdminOverview20260928()");
        window.showSheet('🔴 방송 관리',html);
        return false;
      }

      if(section==='finance'){
        html+='<div class="rowbox"><b>💵 수익 · 정산 · 세무</b><br>입금·지출·환전 신청과 회사 수익을 확인합니다.</div>'
          +btn('📒 정산/세무 전체 현황',"ktOpenTotalAdminOverview20260928()");
        window.showSheet('💵 수익 · 정산 · 세무',html);
        return false;
      }

      if(section==='content'){
        html+='<div class="rowbox"><b>📣 광고 · 동영상 승인</b><br>승인할 콘텐츠를 확인합니다.</div>'
          +btn('📣 승인 관리 화면',"ktTotalAdminAction('content')");
        window.showSheet('📣 콘텐츠 관리',html);
        return false;
      }

      if(section==='security'){
        html+='<div class="rowbox"><b>🔒 보안 · 전체 잠금</b><br>관리자 잠금과 비밀번호 설정으로 들어갑니다.</div>'
          +btn('🔒 전체 잠금',"ktTotalAdminAction('lock')");
        window.showSheet('🔒 보안 · 설정',html);
        return false;
      }
    }catch(e){}
    return false;
  };

  function openFullMenu(){
    try{
      if(typeof window.ktAdminOpenMainMenu20261004==='function'){
        window.ktAdminOpenMainMenu20261004();
        return false;
      }
    }catch(e){}
    return false;
  }

  function install(){
    if(typeof window.ktEnterAdminAfterUnlock20261002!=='function')return;
    if(window.ktEnterAdminAfterUnlock20261002.__ktFullMenuFirst)return;
    var fn=function(){return openFullMenu();};
    fn.__ktFullMenuFirst=true;
    window.ktEnterAdminAfterUnlock20261002=fn;
  }

  install();
  [100,300,800,1500,2600].forEach(function(ms){setTimeout(install,ms);});
  window.addEventListener('pageshow',install);
})();