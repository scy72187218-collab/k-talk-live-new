/* K-Talk LIVE: 비밀방만 현재 승인된 방송 스타일로 배치. 13명방/1인방/구독자방은 건드리지 않음. */
(function(){
  if(window.__ktPasswordReferenceLayoutLoaded)return;
  window.__ktPasswordReferenceLayoutLoaded=true;

  var startedAt=Date.now(),timer=null;
  function roomType(){try{return (window.state&&state.liveRoomType)||'';}catch(e){return '';}}
  function active(){return roomType()==='password';}
  function fmt(ms){var s=Math.max(0,Math.floor(ms/1000)),h=Math.floor(s/3600);s%=3600;var m=Math.floor(s/60);s%=60;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');}

  function addCss(){
    if(document.getElementById('ktPasswordReferenceCss'))return;
    var s=document.createElement('style');s.id='ktPasswordReferenceCss';
    s.textContent='\
html.kt-password-reference body #ktSept2Live{background:#000!important;}\
html.kt-password-reference body #ktSept2Live .kt-live-guests{display:none!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-right{display:none!important;}\
html.kt-password-reference body #ktSept2Live .kt-attendance-wrap{display:none!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-top{left:10px!important;right:10px!important;top:12px!important;z-index:8!important;display:block!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-top>.kt-s2-title{height:58px!important;box-sizing:border-box!important;display:flex!important;align-items:center!important;padding:7px 12px!important;border-radius:18px!important;background:rgba(9,9,12,.82)!important;border:1px solid rgba(255,255,255,.13)!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-top>.kt-s2-title b{font-size:20px!important;color:#fff!important;font-weight:950!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-top>.kt-s2-title span{font-size:18px!important;color:#ff5b88!important;font-weight:950!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordStatus{position:absolute!important;left:22px!important;top:41px!important;z-index:12!important;color:#ff5578!important;font-size:12px!important;font-weight:950!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordAttendance{position:absolute!important;left:10px!important;right:10px!important;top:73px!important;z-index:11!important;display:grid!important;justify-items:center!important;gap:2px!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordAttendance button{font-family:inherit!important;color:#ffd13f!important;font-weight:950!important;border:2px solid #ff42c7!important;background-color:#120712!important;background-image:radial-gradient(circle,rgba(255,83,207,.7) 0 1.5px,transparent 1.8px)!important;background-size:8px 8px!important;box-shadow:inset 0 0 12px #ff37c44d,0 0 7px #ff40c9,0 0 18px #ff2ab9c7!important;text-shadow:0 0 5px #ffad18,0 0 9px #ff6900!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordAttendance .small{height:20px!important;min-width:88px!important;padding:0 6px!important;border-radius:10px!important;font-size:8px!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordAttendance .large{width:100%!important;height:38px!important;padding:0 8px!important;border-radius:17px!important;font-size:17px!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordAttendance span{color:#d8ecff!important;text-shadow:0 0 6px #48a9ff!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordTopControls{position:absolute!important;left:8px!important;right:8px!important;top:133px!important;height:34px!important;z-index:12!important;display:grid!important;grid-template-columns:.86fr 1fr 1.25fr!important;gap:8px!important;align-items:center!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordTopControls button{height:34px!important;min-width:0!important;padding:0 8px!important;border:0!important;border-radius:10px!important;background:#17171a!important;color:#f5f5f5!important;font-family:inherit!important;font-size:12px!important;font-weight:900!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordHostFrame{position:absolute!important;left:7px!important;width:54%!important;top:179px!important;bottom:184px!important;z-index:4!important;overflow:hidden!important;border-radius:8px!important;background:#111!important;border:1px solid rgba(255,215,96,.34)!important;box-shadow:0 0 8px rgba(255,210,70,.08)!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordHostFrame #ktLiveVideo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;object-position:50% 50%!important;border-radius:0!important;background:#111!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordGuestGrid{position:absolute!important;left:calc(54% + 6px)!important;right:7px!important;top:179px!important;bottom:184px!important;z-index:4!important;display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr))!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:1px!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordGuestGrid .guest{min-width:0!important;min-height:0!important;border:1px solid rgba(255,215,96,.22)!important;border-radius:6px!important;background:linear-gradient(180deg,#222224,#19191b)!important;color:#aaa!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;font-weight:900!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordGuestGrid .guest b{font-size:26px!important;line-height:1!important;color:#a5a5a9!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordGuestGrid .guest small{margin-top:5px!important;font-size:12px!important;color:#a5a5a9!important;}\
html.kt-password-reference body #ktSept2Live #ktPasswordHostBadge{position:absolute!important;left:14px!important;top:186px!important;z-index:13!important;padding:3px 8px!important;border-radius:12px!important;background:rgba(35,35,38,.86)!important;color:#fff!important;font-size:12px!important;font-weight:950!important;border:1px solid rgba(255,215,96,.28)!important;}\
html.kt-password-reference body #ktSept2Live #myEarnHud{position:absolute!important;left:50%!important;bottom:137px!important;transform:translateX(-50%)!important;width:164px!important;z-index:27!important;padding:6px 8px!important;border-radius:12px!important;}\
html.kt-password-reference body #ktSept2Live #myEarnHud span{font-size:8px!important;}\
html.kt-password-reference body #ktSept2Live #myEarnHud #hudEarnNet{font-size:14px!important;}\
html.kt-password-reference body #ktSept2Live #myEarnHud #myEarnDetail{font-size:8px!important;margin-top:3px!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-gift-row{display:grid!important;visibility:visible!important;opacity:1!important;position:absolute!important;left:7px!important;right:7px!important;bottom:61px!important;height:72px!important;z-index:28!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:2px!important;padding:3px 2px!important;background:rgba(2,2,5,.96)!important;border-radius:8px!important;overflow:hidden!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-gift-row button{height:64px!important;padding:2px 1px!important;border-radius:7px!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-gift-row .gift-img{width:27px!important;height:27px!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-gift-row .gift-emoji{height:27px!important;font-size:22px!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-gift-row b{margin-top:1px!important;font-size:8px!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-gift-row small{margin-top:1px!important;font-size:6px!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-bottom{display:grid!important;visibility:visible!important;opacity:1!important;position:absolute!important;left:6px!important;right:6px!important;bottom:3px!important;height:56px!important;z-index:30!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;align-items:center!important;gap:5px!important;padding:0!important;background:transparent!important;}\
html.kt-password-reference body #ktSept2Live .kt-s2-bottom button{width:46px!important;height:46px!important;min-width:46px!important;min-height:46px!important;margin:0 auto!important;padding:0!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:50%!important;background:rgba(22,22,26,.92)!important;color:#fff!important;display:grid!important;place-items:center!important;font-size:22px!important;font-weight:900!important;line-height:1!important;}\
@media(max-width:380px){html.kt-password-reference body #ktSept2Live #ktPasswordTopControls{left:5px!important;right:5px!important;gap:5px!important}html.kt-password-reference body #ktSept2Live #ktPasswordTopControls button{font-size:10px!important;padding:0 4px!important}html.kt-password-reference body #ktSept2Live #ktPasswordHostFrame{left:4px!important;width:54%!important}html.kt-password-reference body #ktSept2Live #ktPasswordGuestGrid{left:calc(54% + 4px)!important;right:4px!important}html.kt-password-reference body #ktSept2Live #ktPasswordGuestGrid .guest b{font-size:23px!important}html.kt-password-reference body #ktSept2Live #ktPasswordGuestGrid .guest small{font-size:10px!important}}\
';document.head.appendChild(s);
  }

  function ensureHeader(section){
    var top=section.querySelector('.kt-s2-top');if(!top)return;
    var title=top.querySelector('.kt-s2-title');
    if(title){var b=title.querySelector('b');if(b)b.textContent='🔒 비밀방';}
    var status=document.getElementById('ktPasswordStatus');
    if(!status){status=document.createElement('div');status.id='ktPasswordStatus';status.innerHTML='🔴 ON AIR <strong id="ktPasswordClock">00:00:00</strong>';section.appendChild(status);startedAt=Date.now();}
    if(!timer){timer=setInterval(function(){var e=document.getElementById('ktPasswordClock');if(e)e.textContent=fmt(Date.now()-startedAt);},1000);}
  }

  function ensureAttendance(section){
    if(document.getElementById('ktPasswordAttendance'))return;
    var w=document.createElement('div');w.id='ktPasswordAttendance';w.innerHTML=''
      +'<button type="button" class="small" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck()"><span>🪽</span> 출석체크 <span>🪽</span></button>'
      +'<button type="button" class="large" onclick="if(window.ktAttendanceCheck)ktAttendanceCheck()"><span>🪽</span> 출석체크 💗 <span>🪽</span></button>';
    section.appendChild(w);
  }

  function ensureControls(section){
    if(document.getElementById('ktPasswordTopControls'))return;
    var r=document.createElement('div');r.id='ktPasswordTopControls';r.innerHTML=''
      +'<button type="button">🔥 일일 랭킹</button>'
      +'<button type="button" onclick="if(window.shareApp)shareApp()">🎯 지금 추가</button>'
      +'<button type="button">시청자 4명이 🛩️</button>';
    section.appendChild(r);
  }

  function ensureHost(section){
    var f=document.getElementById('ktPasswordHostFrame');
    if(!f){f=document.createElement('div');f.id='ktPasswordHostFrame';section.appendChild(f);}
    var v=document.getElementById('ktLiveVideo');if(v&&v.parentNode!==f)f.appendChild(v);
    if(!document.getElementById('ktPasswordHostBadge')){var b=document.createElement('div');b.id='ktPasswordHostBadge';b.textContent='호스트';section.appendChild(b);}
  }

  function ensureGuests(section){
    if(document.getElementById('ktPasswordGuestGrid'))return;
    var g=document.createElement('div');g.id='ktPasswordGuestGrid';var h='';
    for(var i=0;i<6;i++)h+='<button type="button" class="guest" aria-label="게스트 초대 '+(i+1)+'" onclick="if(window.shareApp)shareApp()"><b>＋</b><small>초대</small></button>';
    g.innerHTML=h;section.appendChild(g);
  }

  function ensureGiftRow(section){
    var row=section.querySelector('.kt-s2-gift-row');if(row)return;
    row=document.createElement('div');row.className='kt-s2-gift-row';row.setAttribute('aria-label','선물 바로가기');
    row.innerHTML=''
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-img"><img src="rose-single.svg" alt=""></span><b>1개</b><small>장미</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-img"><img src="rose-bouquet-50.svg" alt=""></span><b>50개</b><small>장미다발</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-img"><img src="rose-bouquet-100.svg" alt=""></span><b>100개</b><small>특대장미</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-emoji">💗</span><b>10개</b><small>하트</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-emoji">👑</span><b>100개</b><small>왕관</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-emoji">🏎️</span><b>50개</b><small>스포츠카</small></button>'
      +'<button type="button" onclick="if(window.openGifts)openGifts()"><span class="gift-img gift-box"><img src="gift-box.svg" alt=""></span><b>선물상자</b><small>큰 선물 보기</small></button>';
    section.appendChild(row);
  }

  function ensureBottom(section){
    var bar=section.querySelector('.kt-s2-bottom');if(!bar){bar=document.createElement('div');bar.className='kt-s2-bottom';section.appendChild(bar);}
    if(bar.dataset.ktPasswordBottom==='1')return;bar.dataset.ktPasswordBottom='1';
    bar.innerHTML=''
      +'<button type="button" aria-label="연결" onclick="if(window.ktLiveBottomConnect)ktLiveBottomConnect();else if(window.openCommunicationPanel)openCommunicationPanel()">🔗</button>'
      +'<button type="button" aria-label="시청자 초대" onclick="if(window.shareApp)shareApp()">👥</button>'
      +'<button type="button" aria-label="채팅" onclick="if(window.openComments)openComments()">💬</button>'
      +'<button type="button" aria-label="공유" onclick="if(window.shareApp)shareApp()">↗</button>'
      +'<button type="button" aria-label="효과" onclick="if(window.openEditEffectPanel)openEditEffectPanel()">🪄</button>'
      +'<button type="button" aria-label="더보기" onclick="if(window.openSiteGuide)openSiteGuide()">•••</button>';
  }

  function moveEarn(section){var e=document.getElementById('myEarnHud');if(e&&e.parentNode!==section)section.appendChild(e);}

  function cleanup(){
    var section=document.getElementById('ktSept2Live');var f=document.getElementById('ktPasswordHostFrame'),v=document.getElementById('ktLiveVideo');
    if(f&&v&&section&&v.parentNode===f)section.insertBefore(v,section.firstChild||null);
    ['ktPasswordHostFrame','ktPasswordHostBadge','ktPasswordGuestGrid','ktPasswordTopControls','ktPasswordAttendance','ktPasswordStatus'].forEach(function(id){var e=document.getElementById(id);if(e)e.remove();});
    if(timer){clearInterval(timer);timer=null;}
  }

  function apply(){
    addCss();var section=document.getElementById('ktSept2Live');var on=!!(section&&active());document.documentElement.classList.toggle('kt-password-reference',on);
    if(!on){cleanup();return;}
    ensureHeader(section);ensureAttendance(section);ensureControls(section);ensureHost(section);ensureGuests(section);moveEarn(section);ensureGiftRow(section);ensureBottom(section);
  }

  addCss();apply();setInterval(apply,350);var ob=new MutationObserver(apply);ob.observe(document.documentElement,{childList:true,subtree:true});
})();
