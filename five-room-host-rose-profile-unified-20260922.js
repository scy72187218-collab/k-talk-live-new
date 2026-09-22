/* K-Talk 5개 방송방 호스트 표시 통일 (2026-09-22)
   대상: 1인방 / 9명방 / 13명방 / 구독방 / 비밀방
   변경: 호스트 칸 좌상단 작은 장미 수량, 좌하단 닉네임 + 레벨.
   방 배치/통신/채팅/선물/수익률/버튼은 변경하지 않음. */
(function(){
  if(window.__ktFiveRoomHostRoseProfileUnified20260922)return;
  window.__ktFiveRoomHostRoseProfileUnified20260922=true;

  function hostTiles(){
    return [].slice.call(document.querySelectorAll(
      '#screen .ktsolo-room .ktsolo-main,'+
      '#screen .ktg13-room .ktg13-host,'+
      '#screen .ktsubscriber-room .ktsubscriber-host,'+
      '#screen .ktsecret-room .ktsecret-slot.host,'+
      '#screen .ktsecret-room .ktsecret-host,'+
      '#screen .ktg9-room .ktg9-host'
    ));
  }

  function num(v){
    var m=String(v==null?'':v).replace(/,/g,'').match(/\d+/);
    return m?parseInt(m[0],10)||0:0;
  }

  function profile(){
    try{if(typeof window.ktProfileLoad==='function')return window.ktProfileLoad()||{};}catch(e){}
    return {};
  }

  function nameFor(tile){
    var d=tile&&tile.dataset?tile.dataset:{};
    var keys=['nickname','displayName','userName','username','name','hostName','profileName'];
    for(var i=0;i<keys.length;i++){
      var v=d[keys[i]];
      if(v!=null&&String(v).trim())return String(v).trim();
    }
    try{
      var s=window.state||{};
      for(var j=0;j<keys.length;j++){
        var x=s[keys[j]];
        if(x!=null&&String(x).trim())return String(x).trim();
      }
    }catch(e){}
    var p=profile();
    return String(p.nickname||p.name||p.displayName||'K-Talk');
  }

  function levelFor(tile){
    var d=tile&&tile.dataset?tile.dataset:{};
    var raw=d.level||d.userLevel||d.memberLevel||d.hostLevel||'';
    if(!raw){
      try{
        var s=window.state||{};
        raw=s.level||s.userLevel||s.memberLevel||s.hostLevel||'';
      }catch(e){}
    }
    if(!raw){
      var p=profile();
      raw=p.level||p.userLevel||p.memberLevel||p.hostLevel||'';
    }
    if(!raw){
      try{raw=localStorage.getItem('ktalk_level')||localStorage.getItem('level')||'1';}catch(e){raw='1';}
    }
    var n=parseInt(String(raw).replace(/[^0-9]/g,''),10);
    if(!isFinite(n)||n<1)n=1;
    try{if(typeof window.ktEffectiveLevel==='function')n=window.ktEffectiveLevel(n);}catch(e){}
    return n;
  }

  function roseCount(){
    var el=document.getElementById('hudEarnRoses')||
           document.getElementById('ktSubscriberEarnRoses')||
           document.getElementById('ktGuestEarnRoses');
    return num(el&&el.textContent);
  }

  function ensureStyle(){
    if(document.getElementById('ktFiveRoomHostRoseProfileUnifiedStyle20260922'))return;
    var s=document.createElement('style');
    s.id='ktFiveRoomHostRoseProfileUnifiedStyle20260922';
    s.textContent=''
      +'#screen .kt-five-host-rose{position:absolute!important;left:4px!important;top:4px!important;z-index:90!important;height:15px!important;min-width:28px!important;padding:0 5px!important;border-radius:999px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:2px!important;background:rgba(30,30,34,.90)!important;border:1px solid rgba(255,255,255,.48)!important;color:#fff!important;font:950 8px/1 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;box-shadow:0 1px 4px #0008!important;pointer-events:none!important}'
      +'#screen .kt-five-host-rose:before{content:"🌹";font-size:8px!important;line-height:1!important}'
      +'#screen .kt-five-host-profile{position:absolute!important;left:3px!important;right:auto!important;top:auto!important;bottom:2px!important;z-index:90!important;height:14px!important;max-width:calc(100% - 6px)!important;padding:0 4px!important;border-radius:7px!important;display:flex!important;align-items:center!important;gap:3px!important;background:rgba(0,0,0,.60)!important;color:#fff!important;overflow:hidden!important;pointer-events:none!important;box-sizing:border-box!important}'
      +'#screen .kt-five-host-profile .kt-five-host-name{display:block!important;max-width:58px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font:950 7px/12px system-ui,-apple-system,"Noto Sans KR",sans-serif!important;color:#fff!important}'
      +'#screen .kt-five-host-profile .kt-five-host-level{display:inline-flex!important;align-items:center!important;height:11px!important;padding:0 3px!important;border-radius:4px!important;background:rgba(18,18,22,.86)!important;color:#fff!important;font:950 7px/10px system-ui,-apple-system,"Noto Sans KR",sans-serif!important;white-space:nowrap!important}'
      +'#screen .ktsolo-main,#screen .ktg13-host,#screen .ktsubscriber-host,#screen .ktsecret-slot.host,#screen .ktsecret-host,#screen .ktg9-host{position:relative!important}'
      +'#screen .kt-allhost-profile{display:none!important}'
      +'#screen .kt-hg-host-identity{display:none!important}'
      +'@media(max-width:390px){#screen .kt-five-host-rose{left:3px!important;top:3px!important;height:14px!important;min-width:26px!important;padding:0 4px!important;font-size:7px!important}#screen .kt-five-host-rose:before{font-size:7px!important}#screen .kt-five-host-profile{left:2px!important;bottom:1px!important;height:13px!important;padding:0 3px!important;gap:2px!important}#screen .kt-five-host-profile .kt-five-host-name,#screen .kt-five-host-profile .kt-five-host-level{font-size:6.5px!important}}';
    document.head.appendChild(s);
  }

  function renderTile(tile){
    if(!tile)return;
    try{tile.style.setProperty('position','relative','important');}catch(e){}
    var rose=tile.querySelector(':scope > .kt-five-host-rose');
    if(!rose){
      rose=document.createElement('span');
      rose.className='kt-five-host-rose';
      tile.appendChild(rose);
    }
    rose.textContent=String(roseCount());

    var box=tile.querySelector(':scope > .kt-five-host-profile');
    if(!box){
      box=document.createElement('div');
      box.className='kt-five-host-profile';
      box.innerHTML='<span class="kt-five-host-name"></span><span class="kt-five-host-level"></span>';
      tile.appendChild(box);
    }
    var nm=box.querySelector('.kt-five-host-name');
    var lv=box.querySelector('.kt-five-host-level');
    if(nm)nm.textContent=nameFor(tile);
    if(lv)lv.textContent='Lv.'+levelFor(tile);
  }

  function apply(){
    ensureStyle();
    hostTiles().forEach(renderTile);
  }

  apply();
  [50,150,350,700,1400].forEach(function(ms){setTimeout(apply,ms);});
  setInterval(apply,700);

  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktFiveRoomHostRoseProfileUnifiedTimer20260922);
      window.__ktFiveRoomHostRoseProfileUnifiedTimer20260922=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();