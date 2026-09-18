/* 태권1/하이네2 프로필 전용 총관리 스위치.
   다른 계정/방송/카메라/채팅 기능은 변경하지 않음. */
(function(){
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
      +'.kt-total-admin-row .kt-admin-copy{flex:1;min-width:0}.kt-total-admin-row .kt-admin-copy b{display:flex;align-items:center;gap:6px;font-size:14px;color:#ffe37c}.kt-total-admin-row .kt-admin-copy small{display:block;margin-top:2px;color:#cfcfcf;font-size:10px}.kt-admin-lock-state{font-size:15px;line-height:1}'
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
    var monitorOn=false;
    try{monitorOn=!!(window.ktAdminMonitorModeEnabled&&window.ktAdminMonitorModeEnabled());}catch(e){}
    return '<div class="kt-total-admin-wrap" id="ktTotalAdminWrap">'
      +'<button class="kt-total-admin-row" type="button" onclick="ktToggleTotalAdminPanel()">'
      +'<span class="kt-admin-icon">🛡️</span>'
      +'<span class="kt-admin-copy"><b>총관리 <span class="kt-admin-lock-state">🔒</span></b><small>'+label+' 관리자 전용 · 잠김</small></span>'
      +'<span class="kt-admin-toggle" aria-hidden="true"><i></i></span>'
      +'</button>'
      +'<div class="kt-total-admin-panel">'
      +'<button type="button" onclick="ktTotalAdminAction(\'coin\')">🪙 회원 코인 지급 <span>›</span></button>'
      +'<button type="button" onclick="ktTotalAdminAction(\'suspend\')">⛔ 회원 정지 <span>›</span></button>'
      +'<button type="button" onclick="ktTotalAdminAction(\'release\')">✅ 정지 해제 <span>›</span></button>'
      +'<button type="button" onclick="ktTotalAdminAction(\'monitor\')">👁 관리 모니터링 '+(monitorOn?'켜짐':'꺼짐')+' <span>›</span></button>'
      +'<button type="button" onclick="ktTotalAdminAction(\'content\')">📣 광고·동영상 승인 <span>›</span></button>'
      +'<div class="kt-admin-locked-note">관리 기능은 총관리 스위치 안에서만 사용합니다.</div>'
      +'</div></div>';
  }

  var adminLockTimer=0;

  function syncLockState(box){
    if(!box)return;
    var open=box.classList.contains('open');
    var icon=box.querySelector('.kt-admin-lock-state');
    var sub=box.querySelector('.kt-admin-copy small');
    if(icon)icon.textContent=open?'🔑':'🔒';
    if(sub){
      var label=ownerKey()==='haine2'?'하이네2':'태권1';
      sub.textContent=label+' 관리자 전용 · '+(open?'열림':'잠김');
    }
  }

  function armAutoLock(box){
    clearTimeout(adminLockTimer);
    if(!box||!box.classList.contains('open'))return;
    adminLockTimer=setTimeout(function(){
      try{
        var current=document.getElementById('ktTotalAdminWrap');
        if(current){
          current.classList.remove('open');
          syncLockState(current);
        }
      }catch(e){}
    },5*60*1000);
  }

  window.ktToggleTotalAdminPanel=function(){
    if(!isOwner())return false;
    var box=document.getElementById('ktTotalAdminWrap');
    if(box){
      box.classList.toggle('open');
      syncLockState(box);
      armAutoLock(box);
    }
    return false;
  };

  window.ktTotalAdminAction=function(kind){
    if(!isOwner())return false;
    if(kind==='content'){
      try{if(typeof window.ktOpenContentApprovalAdmin==='function')window.ktOpenContentApprovalAdmin();}catch(e){}
      return false;
    }
    if(kind==='monitor'){
      try{
        if(typeof window.ktToggleOwnerMonitorMode==='function'){
          window.ktToggleOwnerMonitorMode();
          setTimeout(function(){
            var old=document.getElementById('ktTotalAdminWrap');
            if(old&&old.parentNode)old.outerHTML=panelHtml();
            var fresh=document.getElementById('ktTotalAdminWrap');
            if(fresh){fresh.classList.add('open');syncLockState(fresh);armAutoLock(fresh);}
          },30);
        }
      }catch(e){}
      return false;
    }
    var name=kind==='coin'?'회원 코인 지급':(kind==='suspend'?'회원 정지':'정지 해제');
    try{alert('🔐 '+name+' 관리 화면입니다.\n보안 관리코드 설정 후 실제 처리 기능을 연결합니다.');}catch(e){}
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
      var box=document.getElementById('ktTotalAdminWrap');
      if(box)syncLockState(box);
    }catch(e){}
  }

  install();
  [80,220,500,1000,1800,3200].forEach(function(ms){setTimeout(install,ms);});
  document.addEventListener('click',function(){setTimeout(install,20);},true);
})();