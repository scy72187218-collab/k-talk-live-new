/* K-Talk 관리자 프로필 모니터링 스위치.
   태권1/하이네2 프로필에만 표시.
   ON 상태에서도 방장에게 '관리자 모니터링'으로 표시되며 몰래 감시하지 않음. */
(function(){
  if(window.__ktOwnerMonitorSwitch20260918)return;
  window.__ktOwnerMonitorSwitch20260918=true;

  var STORE='ktalk_admin_monitor_mode';

  function ownerKey(){
    try{
      if(typeof window.ktGetSelectedSubAccount==='function'){
        var k=window.ktGetSelectedSubAccount();
        if(k==='taekwon1'||k==='haine2')return k;
      }
    }catch(e){}
    return '';
  }

  function isOwner(){return !!ownerKey();}

  function enabled(){
    if(!isOwner())return false;
    try{return localStorage.getItem(STORE)==='1';}catch(e){return false;}
  }

  window.ktAdminMonitorModeEnabled=enabled;

  function ensureStyle(){
    if(document.getElementById('ktOwnerMonitorSwitchStyle'))return;
    var s=document.createElement('style');
    s.id='ktOwnerMonitorSwitchStyle';
    s.textContent=''
      +'.kt-owner-monitor{margin:10px 0;padding:11px 12px;border:1px solid rgba(86,176,255,.45);border-radius:15px;background:linear-gradient(135deg,rgba(8,30,54,.82),rgba(10,13,20,.9));color:#fff}'
      +'.kt-owner-monitor button{width:100%;padding:0;border:0;background:transparent;color:#fff;display:flex;align-items:center;gap:9px;text-align:left;touch-action:manipulation}'
      +'.kt-owner-monitor .ico{width:34px;height:34px;flex:0 0 34px;border-radius:50%;display:grid;place-items:center;background:#0d2740;border:1px solid #54aaff;font-size:17px}'
      +'.kt-owner-monitor .copy{flex:1;min-width:0}.kt-owner-monitor .copy b{display:block;color:#8dccff;font-size:14px}.kt-owner-monitor .copy small{display:block;margin-top:2px;color:#d1d6dc;font-size:10px;line-height:1.3}'
      +'.kt-owner-monitor .sw{width:48px;height:27px;flex:0 0 48px;padding:3px;border-radius:999px;background:#3b3d42;border:1px solid #ffffff30;display:flex;align-items:center}'
      +'.kt-owner-monitor .sw i{width:19px;height:19px;border-radius:50%;background:#fff;display:block;transition:.16s}'
      +'.kt-owner-monitor.on .sw{background:#2188ef}.kt-owner-monitor.on .sw i{transform:translateX(19px)}'
      +'.kt-monitor-live-badge{position:fixed;left:50%;top:12px;transform:translateX(-50%);z-index:100000;padding:7px 11px;border-radius:999px;background:rgba(10,36,64,.94);border:1px solid #55b2ff;color:#dff1ff;font-size:11px;font-weight:950;box-shadow:0 4px 16px #0008;pointer-events:none}';
    document.head.appendChild(s);
  }

  function blockHtml(){
    var on=enabled();
    return '<div id="ktOwnerMonitorSwitch" class="kt-owner-monitor '+(on?'on':'')+'">'
      +'<button type="button" onclick="ktToggleOwnerMonitorMode()">'
      +'<span class="ico">👁</span>'
      +'<span class="copy"><b>관리 모니터링</b><small>'+(on?'켜짐 · 방장에게 관리자 모니터링으로 표시':'꺼짐 · 일반 회원처럼 입장')+'</small></span>'
      +'<span class="sw"><i></i></span>'
      +'</button></div>';
  }

  window.ktToggleOwnerMonitorMode=function(){
    if(!isOwner())return false;
    var next=!enabled();
    try{localStorage.setItem(STORE,next?'1':'0');}catch(e){}
    var box=document.getElementById('ktOwnerMonitorSwitch');
    if(box){
      box.classList.toggle('on',next);
      var sm=box.querySelector('.copy small');
      if(sm)sm.textContent=next?'켜짐 · 방장에게 관리자 모니터링으로 표시':'꺼짐 · 일반 회원처럼 입장';
    }
    try{alert(next?'👁 관리 모니터링을 켰습니다.\n방에 들어가면 방장에게 관리자 모니터링으로 표시됩니다.':'관리 모니터링을 껐습니다.\n이제 일반 회원처럼 입장합니다.');}catch(e){}
    return false;
  };

  function wrapRender(){
    /* 프로필에 별도 스위치를 만들지 않음: 총관리 안에서만 사용 */
  }

  function addVisibleBadge(){
    var remote=document.documentElement.classList.contains('kt-remote-viewing');
    var old=document.getElementById('ktMonitorLiveBadge');
    if(remote&&enabled()){
      if(!old){
        var b=document.createElement('div');
        b.id='ktMonitorLiveBadge';
        b.className='kt-monitor-live-badge';
        b.textContent='👑 관리자 모니터링 중';
        document.body.appendChild(b);
      }
    }else if(old&&old.parentNode)old.parentNode.removeChild(old);
  }

  function install(){
    ensureStyle();
    wrapRender();
    try{
      var stray=document.getElementById('ktOwnerMonitorSwitch');
      if(stray&&stray.parentNode)stray.parentNode.removeChild(stray);
    }catch(e){}
    addVisibleBadge();
  }

  install();
  [80,220,500,1000,1800,3200].forEach(function(ms){setTimeout(install,ms);});
  new MutationObserver(function(){setTimeout(install,20);}).observe(document.documentElement,{childList:true,subtree:true});
})();