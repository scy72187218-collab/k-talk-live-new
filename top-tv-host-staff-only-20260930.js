/* K-Talk room top TV button visibility guard — 2026-09-30
   Show only to host / staff / admin. Hide from ordinary guests/viewers.
   Does not alter video, gifts, room layout, or bottom movie control. */
(function(){
  if(window.__ktTopTvHostStaffOnly20260930)return;
  window.__ktTopTvHostStaffOnly20260930=true;

  function norm(v){return String(v==null?'':v).replace(/\s+/g,'').toLowerCase();}

  function roleText(){
    var vals=[];
    try{
      var s=window.state||{};
      [s.role,s.userRole,s.memberRole,s.levelName,s.gradeName,s.rankName,s.membershipName,
       s.userGrade,s.accountRole,s.operatorRole,s.staffRole,s.nickname,s.displayName,s.name].forEach(function(v){if(v)vals.push(v);});
    }catch(e){}
    try{
      ['kt_role','kt_user_role','kt_member_role','kt_grade','kt_level_name','ktalk_role','ktalk_staff_role']
        .forEach(function(k){var v=localStorage.getItem(k);if(v)vals.push(v);});
    }catch(e){}
    return vals.join(' ');
  }

  function isOwnerAccount(){
    try{
      if(typeof window.ktGetSelectedSubAccount==='function'){
        var k=norm(window.ktGetSelectedSubAccount());
        if(k==='taekwon1'||k==='haine2'||k==='태권1'||k==='하이네2')return true;
      }
    }catch(e){}
    return false;
  }

  function isHostNow(){
    try{
      var s=window.state||{};
      if(s.isHost===true)return true;
      if(document.documentElement.classList.contains('kt-remote-viewing'))return false;
      var stream=s.stream;
      if(!stream||!stream.getVideoTracks||!stream.getVideoTracks().some(function(t){return t.readyState==='live';}))return false;
      var host=document.querySelector(
        '#screen .ktsolo-main video,'+
        '#screen .ktg13-host video,'+
        '#screen .ktg9-host video,'+
        '#screen .ktsubscriber-host video,'+
        '#screen .ktsecret-slot.host video,'+
        '#screen .ktsecret-host video'
      );
      return !!(host&&host.srcObject&&host.srcObject===stream);
    }catch(e){return false;}
  }

  function currentLevel(){
    var best=0;
    function num(v){
      var n=parseInt(String(v==null?'':v).replace(/[^0-9]/g,''),10);
      return isFinite(n)?n:0;
    }
    try{
      if(typeof window.ktLevelGetLevel==='function')best=Math.max(best,num(window.ktLevelGetLevel()));
    }catch(e){}
    try{
      if(typeof window.ktLevelInfo==='function')best=Math.max(best,num((window.ktLevelInfo()||{}).level));
    }catch(e){}
    try{
      var s=window.state||{};
      [s.level,s.userLevel,s.memberLevel,s.hostLevel].forEach(function(v){best=Math.max(best,num(v));});
    }catch(e){}
    try{
      ['ktalk_level','ktalk_user_level','ktalk_member_level','ktalk_host_level','level','userLevel','memberLevel','hostLevel']
        .forEach(function(k){best=Math.max(best,num(localStorage.getItem(k)));});
    }catch(e){}
    return best;
  }

  function isSubscriberMember(){
    try{
      var s=window.state||{};
      if(s.isSubscriber===true||s.subscriber===true||s.paidSubscriber===true||s.subscriptionActive===true)return true;
      var vals=[s.membershipName,s.memberType,s.membership,s.subscriptionType,s.planName,s.gradeName,s.rankName,s.role,s.userRole];
      if(vals.some(function(v){return /구독자|subscriber/i.test(String(v||''));}))return true;
    }catch(e){}
    try{
      var keys=['ktalk_member_type','ktalk_membership','ktalk_subscription','ktalk_subscription_type','ktalk_plan','memberType','membership','subscriptionType'];
      for(var i=0;i<keys.length;i++){
        var v=localStorage.getItem(keys[i]);
        if(/구독자|subscriber/i.test(String(v||'')))return true;
      }
    }catch(e){}
    return false;
  }

  function allowed(){
    try{
      var s=window.state||{};
      if(s.isAdmin===true||s.isOperator===true||s.isStaff===true||window.KT_IS_ADMIN===true||window.KT_IS_OPERATOR===true)return true;
    }catch(e){}
    if(isOwnerAccount())return true;
    if(/최고\s*운영자|운영진|운영자|관리자|admin|operator|staff/i.test(roleText()))return true;
    if(isHostNow())return true;
    if(isSubscriberMember())return true;
    return currentLevel()>=21;
  }

  function candidateText(el){
    var a='';
    try{a+=' '+(el.textContent||'')+' '+(el.getAttribute('aria-label')||'')+' '+(el.getAttribute('title')||'');}catch(e){}
    try{
      el.querySelectorAll('img').forEach(function(img){a+=' '+(img.alt||'')+' '+(img.title||'');});
    }catch(e){}
    return a;
  }

  function isTopTvButton(btn,room){
    if(!btn||!room)return false;
    var txt=candidateText(btn);
    if(!(/📺|텔레비전|티비|TV|모니터|monitor|television/i.test(txt)))return false;

    /* Never touch the bottom movie button. */
    if(btn.closest('.ktsolo-tools,.ktg13-tools,.ktsubscriber-tools,.ktsecret-tools,.kgh-tools,.kt-remote-bottom'))return false;
    if(/영화/.test(txt))return false;

    try{
      var rr=room.getBoundingClientRect(),br=btn.getBoundingClientRect();
      return br.top<=rr.top+155;
    }catch(e){return true;}
  }

  function apply(){
    var ok=allowed();
    document.querySelectorAll(
      '#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,'+
      '#screen .ktsubscriber-room,#screen .ktsecret-room,#screen .kt-guest-hostlike-room'
    ).forEach(function(room){
      room.querySelectorAll('button,[role="button"]').forEach(function(btn){
        if(!isTopTvButton(btn,room))return;
        btn.dataset.ktTopTvHostStaff='1';
        if(ok){
          btn.style.removeProperty('display');
          btn.style.removeProperty('visibility');
          btn.removeAttribute('aria-hidden');
        }else{
          btn.style.setProperty('display','none','important');
          btn.style.setProperty('visibility','hidden','important');
          btn.setAttribute('aria-hidden','true');
        }
      });
    });
  }

  apply();
  [80,220,500,1000,1800,3000].forEach(function(ms){setTimeout(apply,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktTopTvHostStaffOnlyTimer20260930);
      window.__ktTopTvHostStaffOnlyTimer20260930=setTimeout(apply,25);
    }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','aria-label','title']});
  }catch(e){}
  window.addEventListener('pageshow',apply);
  window.addEventListener('focus',apply);
})();