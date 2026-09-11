/* K-Talk 구독자방 전용: 다른 화면은 건드리지 않고 호스트/게스트 사람 칸만 표시한다. */
(function(){
  if(window.__ktSubscriberPeopleOnly20260911)return;
  window.__ktSubscriberPeopleOnly20260911=true;

  function isSubscriberLive(){
    try{
      var s=document.getElementById('screen');
      if(!s)return false;
      var text=String(s.innerText||s.textContent||'');
      var type=(window.state&&state.liveRoomType)||'';
      return (type==='subscriber'||text.indexOf('구독자 방송')>-1) && text.indexOf('ON AIR')>-1;
    }catch(e){return false;}
  }

  function ensureStyle(){
    if(document.getElementById('ktSubscriberPeopleOnlyStyle'))return;
    var st=document.createElement('style');
    st.id='ktSubscriberPeopleOnlyStyle';
    st.textContent=''
      +'#screen.kt-subscriber-people-active{position:relative!important;overflow:hidden!important}'
      +'#ktSubscriberPeopleOnly{position:absolute;left:8px;right:58px;top:20%;bottom:25%;z-index:24;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));grid-template-rows:repeat(4,minmax(0,1fr));gap:4px;padding:0;background:#050507;border-radius:10px;overflow:hidden;pointer-events:none}'
      +'#ktSubscriberPeopleOnly .kt-sub-tile{position:relative;min-width:0;min-height:0;overflow:hidden;border:2px solid #ff27be;border-radius:9px;background:linear-gradient(145deg,#17181d,#0e0f13);box-shadow:0 0 7px rgba(255,39,190,.23);display:flex;align-items:center;justify-content:center}'
      +'#ktSubscriberPeopleOnly .kt-sub-host{grid-column:1/3;grid-row:1/3}'
      +'#ktSubscriberPeopleOnly .kt-sub-guest:nth-child(1){grid-column:3/5;grid-row:1}'
      +'#ktSubscriberPeopleOnly .kt-sub-guest:nth-child(2){grid-column:5/7;grid-row:1}'
      +'#ktSubscriberPeopleOnly .kt-sub-guest:nth-child(3){grid-column:3/5;grid-row:2}'
      +'#ktSubscriberPeopleOnly .kt-sub-guest:nth-child(4){grid-column:5/7;grid-row:2}'
      +'#ktSubscriberPeopleOnly .kt-sub-guest:nth-child(5){grid-column:1/3;grid-row:3}'
      +'#ktSubscriberPeopleOnly .kt-sub-guest:nth-child(6){grid-column:3/5;grid-row:3}'
      +'#ktSubscriberPeopleOnly .kt-sub-guest:nth-child(7){grid-column:5/7;grid-row:3}'
      +'#ktSubscriberPeopleOnly .kt-sub-guest:nth-child(8){grid-column:1/4;grid-row:4}'
      +'#ktSubscriberPeopleOnly .kt-sub-guest:nth-child(9){grid-column:4/7;grid-row:4}'
      +'#ktSubscriberPeopleOnly .kt-sub-host video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;transform:scaleX(-1)!important;background:#111!important}'
      +'#ktSubscriberPeopleOnly .kt-sub-host-label{position:absolute;left:7px;top:7px;z-index:2;padding:4px 10px;border-radius:12px;background:#ff315f;color:#fff;font-size:11px;font-weight:950}'
      +'#ktSubscriberPeopleOnly .kt-sub-guest span{display:block;text-align:center;font-size:24px;line-height:1;color:#ddd;opacity:.82}'
      +'#ktSubscriberPeopleOnly .kt-sub-guest b{position:absolute;left:6px;bottom:5px;padding:3px 7px;border-radius:10px;background:rgba(0,0,0,.72);color:#fff;font-size:9px;font-weight:900}'
      +'@media(max-width:390px){#ktSubscriberPeopleOnly{left:5px;right:50px;top:19%;bottom:25%;gap:3px}#ktSubscriberPeopleOnly .kt-sub-tile{border-width:1.5px;border-radius:7px}#ktSubscriberPeopleOnly .kt-sub-guest span{font-size:20px}#ktSubscriberPeopleOnly .kt-sub-guest b{font-size:8px;left:4px;bottom:4px;padding:2px 5px}}';
    document.head.appendChild(st);
  }

  function sameParent(items){
    var p=null;
    for(var i=0;i<items.length;i++){
      if(!items[i])continue;
      if(!p)p=items[i].parentElement;
      else if(items[i].parentElement!==p)return null;
    }
    return p;
  }

  function arrangeRightButtons(){
    try{
      var s=document.getElementById('screen');
      if(!s)return;
      var buttons=[].slice.call(s.querySelectorAll('button'));
      var like=buttons.find(function(b){return String(b.textContent||'').indexOf('좋아요')>-1;});
      var effect=buttons.find(function(b){return String(b.textContent||'').indexOf('효과')>-1;});
      var match=buttons.find(function(b){return String(b.textContent||'').indexOf('매치')>-1;});
      var gift=buttons.find(function(b){
        var t=String(b.textContent||'');
        var oc=String(b.getAttribute('onclick')||'');
        return t.indexOf('보물상자')>-1||t.indexOf('선물')>-1||oc.indexOf('openGifts')>-1;
      });
      var p=sameParent([like,effect,gift,match]);
      if(!p)return;
      if(gift&&String(gift.textContent||'').indexOf('보물상자')<0)gift.innerHTML='🎁<small>보물상자</small>';
      [like,effect,gift,match].forEach(function(b){if(b)p.appendChild(b);});
    }catch(e){}
  }

  function attachHostVideo(host){
    var v=document.createElement('video');
    v.autoplay=true;
    v.muted=true;
    v.playsInline=true;
    try{
      var stream=(window.state&&state.stream)||null;
      if(!stream){
        var live=[].slice.call(document.querySelectorAll('video')).find(function(x){
          try{return x.srcObject&&x.videoWidth>0;}catch(e){return false;}
        });
        if(live)stream=live.srcObject;
      }
      if(stream)v.srcObject=stream;
    }catch(e){}
    host.appendChild(v);
    try{var p=v.play();if(p&&p.catch)p.catch(function(){});}catch(e){}
  }

  function buildPeople(){
    if(!isSubscriberLive())return;
    var s=document.getElementById('screen');
    if(!s)return;
    ensureStyle();
    s.classList.add('kt-subscriber-people-active');
    arrangeRightButtons();

    var old=document.getElementById('ktSubscriberPeopleOnly');
    if(old){
      var hv=old.querySelector('.kt-sub-host video');
      try{if(hv&&window.state&&state.stream&&hv.srcObject!==state.stream)hv.srcObject=state.stream;}catch(e){}
      return;
    }

    var wrap=document.createElement('div');
    wrap.id='ktSubscriberPeopleOnly';

    var host=document.createElement('div');
    host.className='kt-sub-tile kt-sub-host';
    attachHostVideo(host);
    var hl=document.createElement('span');
    hl.className='kt-sub-host-label';
    hl.textContent='호스트';
    host.appendChild(hl);
    wrap.appendChild(host);

    for(var i=1;i<=9;i++){
      var g=document.createElement('div');
      g.className='kt-sub-tile kt-sub-guest';
      g.innerHTML='<span>👤</span><b>게스트 '+i+'</b>';
      wrap.appendChild(g);
    }

    s.appendChild(wrap);
  }

  function cleanupIfNeeded(){
    if(isSubscriberLive())return;
    var old=document.getElementById('ktSubscriberPeopleOnly');
    if(old)old.remove();
    var s=document.getElementById('screen');
    if(s)s.classList.remove('kt-subscriber-people-active');
  }

  setInterval(function(){buildPeople();cleanupIfNeeded();},300);
  if('MutationObserver' in window){
    var ob=new MutationObserver(function(){buildPeople();cleanupIfNeeded();});
    ob.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  }
})();
