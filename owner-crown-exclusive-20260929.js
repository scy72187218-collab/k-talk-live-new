/* K-Talk owner-only crown reservation
   The special crown profile/badge is reserved for owner accounts only.
   Other members/subscribers/sellers must never receive this crown automatically.
*/
(function(){
  if(window.__ktOwnerCrownExclusive20260929)return;
  window.__ktOwnerCrownExclusive20260929=true;

  var OWNER_KEYS={taekwon1:true,haine2:true};

  window.ktIsOwnerCrownAccount20260929=function(){
    try{
      var k=window.ktGetSelectedSubAccount?String(window.ktGetSelectedSubAccount()||''):'';
      return !!OWNER_KEYS[k];
    }catch(e){return false;}
  };

  window.ktCanUseSpecialCrown20260929=function(accountKey){
    return !!OWNER_KEYS[String(accountKey||'')];
  };

  window.ktSpecialCrownPolicy20260929={
    exclusive:true,
    ownerAccounts:['taekwon1','haine2'],
    note:'특별 왕관은 태권1/하이네2 전용'
  };

  /* Safety net: if a generic crown badge class is ever added later,
     hide it for non-owner accounts by default. */
  function guard(){
    var allowed=false;
    try{allowed=window.ktIsOwnerCrownAccount20260929();}catch(e){}
    if(allowed)return;
    document.querySelectorAll('.kt-special-owner-crown,[data-kt-owner-crown="1"]').forEach(function(el){
      try{el.remove();}catch(e){el.style.display='none';}
    });
  }

  [100,400,900].forEach(function(ms){setTimeout(guard,ms);});
  setInterval(guard,1800);
})();