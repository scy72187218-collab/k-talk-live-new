(function(){
  if(window.__ktRoseCountBadges)return;
  window.__ktRoseCountBadges=true;

  var hostCount=0, guestCounts={};

  function num(v){
    var m=String(v||'').replace(/,/g,'').match(/\d+/);
    return m?parseInt(m[0],10)||0:0;
  }
  function roomIsHost(){
    return !!document.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room');
  }
  function style(){
    if(document.getElementById('ktRoseCountBadgesStyle'))return;
    var s=document.createElement('style');
    s.id='ktRoseCountBadgesStyle';
    s.textContent='.kt-rose-count-badge{position:absolute!important;left:4px!important;top:4px!important;z-index:60!important;height:12px!important;min-width:22px!important;padding:0 3px!important;border-radius:999px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:1px!important;background:rgba(30,30,34,.9)!important;border:1px solid rgba(255,255,255,.5)!important;color:#fff!important;font:950 6.5px/1 system-ui,sans-serif!important;box-shadow:0 1px 4px #0008!important;pointer-events:none!important}.kt-rose-count-badge:before{content:"🌹";font-size:6px!important}';
    document.head.appendChild(s);
  }
  function badge(target,value){
    if(!target)return;
    try{if(getComputedStyle(target).position==='static')target.style.setProperty('position','relative','important');}catch(e){}
    var b=target.querySelector(':scope > .kt-rose-count-badge');
    if(!b){b=document.createElement('span');b.className='kt-rose-count-badge';target.appendChild(b);}
    b.textContent=Number(value||0).toLocaleString('ko-KR');
  }
  function hostTile(){
    var v=document.querySelector('#screen #ktLiveVideo');
    if(!v)return null;
    return v.closest('.ktg13-host')||v.parentElement;
  }
  function guestSelf(){
    return document.querySelector('.kt-guest-hostlike-room .kgh-cell.self');
  }
  function render(){
    style();
    var h=document.getElementById('hudEarnRoses')||document.getElementById('ktSubscriberEarnRoses');
    hostCount=Math.max(hostCount,num(h&&h.textContent));
    var ht=hostTile();
    if(ht)badge(ht,hostCount);

    var ge=document.getElementById('ktGuestEarnRoses');
    var self=guestSelf();
    if(self)badge(self,num(ge&&ge.textContent));

    document.querySelectorAll('.ktg13-guest[data-kt-guest-viewer-id]').forEach(function(t){
      var id=String(t.getAttribute('data-kt-guest-viewer-id')||'');
      badge(t,guestCounts[id]||0);
    });
  }
  function patchAnnounce(){
    var old=window.ktAnnounceEvent;
    if(typeof old!=='function'||old.__ktRoseCountWrapped)return;
    var fn=function(kind,data){
      try{
        if(kind==='gift'&&roomIsHost()&&data&&data.sender&&num(data.count)>0){
          hostCount+=num(data.count);
          render();
        }
      }catch(e){}
      return old.apply(this,arguments);
    };
    fn.__ktRoseCountWrapped=true;
    window.ktAnnounceEvent=fn;
  }
  function patchGiftSync(){
    var old=window.ktSyncGiftToHost;
    if(typeof old!=='function'||old.__ktRoseCountWrapped)return;
    var fn=function(name,cost,sender){
      var target=window.ktGuestGiftTarget;
      if(roomIsHost()&&target&&target.viewerId&&num(cost)>0){
        var id=String(target.viewerId);
        guestCounts[id]=(guestCounts[id]||0)+num(cost);
        render();
      }
      return old.apply(this,arguments);
    };
    fn.__ktRoseCountWrapped=true;
    window.ktSyncGiftToHost=fn;
  }

  setInterval(function(){patchAnnounce();patchGiftSync();render();},400);
  setTimeout(function(){patchAnnounce();patchGiftSync();render();},80);
})();