/* SAVED SNAPSHOT — approved 13-person room at 2026-09-05 17:19 KST. Restore by copying this file over group13-reference-layout.js. */
/* K-Talk LIVE: 13명 방송 화면만 참고 화면처럼 호스트 + 게스트 3x4 배치. 다른 방/UI는 변경하지 않음. */
(function(){
  if(window.__ktGroup13ReferenceLayoutLoaded)return;
  window.__ktGroup13ReferenceLayoutLoaded=true;

  function roomType(){
    try{return (window.state&&state.liveRoomType)||'';}catch(e){return '';}
  }

  function isGroup13(){
    var t=roomType();
    return t==='group'||t==='group13'||t==='general';
  }

  function addCss(){
    if(document.getElementById('ktGroup13ReferenceCss'))return;
    var s=document.createElement('style');
    s.id='ktGroup13ReferenceCss';
    s.textContent='\
html.kt-group13-reference body #ktSept2Live{background:#000!important;}\
html.kt-group13-reference body #ktSept2Live .kt-live-guests{display:none!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-right{display:none!important;}\
html.kt-group13-reference body #ktSept2Live #ktGroup13TopControls{position:absolute!important;left:8px!important;right:8px!important;top:112px!important;height:34px!important;z-index:12!important;display:grid!important;grid-template-columns:.86fr 1fr 1.25fr!important;gap:8px!important;align-items:center!important;}\
html.kt-group13-reference body #ktSept2Live #ktGroup13TopControls button{height:34px!important;min-width:0!important;padding:0 9px!important;border:0!important;border-radius:10px!important;background:#17171a!important;color:#f5f5f5!important;font-family:inherit!important;font-size:12px!important;font-weight:900!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important;box-shadow:none!important;}\
html.kt-group13-reference body #ktSept2Live #ktGroup13HostFrame{position:absolute!important;left:7px!important;width:42%!important;top:158px!important;bottom:184px!important;z-index:4!important;overflow:hidden!important;border-radius:7px!important;background:#111!important;border:1px solid rgba(255,255,255,.08)!important;}\
html.kt-group13-reference body #ktSept2Live #ktGroup13HostFrame #ktLiveVideo{position:absolute!important;inset:0!important;left:0!important;top:0!important;right:0!important;bottom:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:contain!important;object-position:50% 50%!important;border-radius:0!important;background:#111!important;}\
html.kt-group13-reference body #ktSept2Live #ktGroup13GuestGrid{position:absolute!important;left:calc(42% + 6px)!important;right:7px!important;top:158px!important;bottom:184px!important;z-index:4!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:1px!important;pointer-events:auto!important;}\
html.kt-group13-reference body #ktSept2Live #ktGroup13GuestGrid .kt-group13-guest{min-width:0!important;min-height:0!important;border:1px solid rgba(255,255,255,.06)!important;border-radius:5px!important;background:linear-gradient(180deg,#202023,#171719)!important;color:#a8a8ad!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:13px!important;font-weight:900!important;letter-spacing:-.2px!important;box-shadow:none!important;}\
html.kt-group13-reference body #ktSept2Live #ktGroup13HostBadge{position:absolute!important;left:14px!important;top:165px!important;z-index:13!important;padding:3px 8px!important;border-radius:12px!important;background:rgba(35,35,38,.86)!important;color:#fff!important;font-size:12px!important;font-weight:950!important;line-height:1.2!important;border:1px solid rgba(255,255,255,.12)!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-att-small{height:20px!important;min-width:88px!important;padding:0 6px!important;border-radius:10px!important;font-size:8px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-att-large{height:38px!important;padding:0 8px!important;border-radius:17px!important;font-size:17px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-attendance-stack{gap:2px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row{display:grid!important;visibility:visible!important;opacity:1!important;left:7px!important;right:7px!important;bottom:61px!important;height:72px!important;z-index:28!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:2px!important;padding:3px 2px!important;background:rgba(2,2,5,.96)!important;border-radius:8px!important;overflow:hidden!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row button{height:64px!important;padding:2px 1px!important;border-radius:7px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row .gift-img{width:27px!important;height:27px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row .gift-emoji{height:27px!important;font-size:22px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row b{margin-top:1px!important;font-size:8px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row small{margin-top:1px!important;font-size:6px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-bottom{display:grid!important;visibility:visible!important;opacity:1!important;position:absolute!important;left:6px!important;right:6px!important;bottom:3px!important;height:56px!important;z-index:30!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;align-items:center!important;gap:5px!important;padding:0!important;background:transparent!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-bottom button{width:46px!important;height:46px!important;min-width:46px!important;min-height:46px!important;margin:0 auto!important;padding:0!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:50%!important;background:rgba(22,22,26,.92)!important;color:#fff!important;display:grid!important;place-items:center!important;font-size:22px!important;font-weight:900!important;line-height:1!important;}\
@media(max-width:380px){html.kt-group13-reference body #ktSept2Live #ktGroup13TopControls{left:5px!important;right:5px!important;gap:5px!important}html.kt-group13-reference body #ktSept2Live #ktGroup13TopControls button{padding:0 5px!important;font-size:10px!important}html.kt-group13-reference body #ktSept2Live #ktGroup13HostFrame{left:4px!important;width:43%!important}html.kt-group13-reference body #ktSept2Live #ktGroup13GuestGrid{left:calc(43% + 4px)!important;right:4px!important;gap:1px!important}html.kt-group13-reference body #ktSept2Live #ktGroup13GuestGrid .kt-group13-guest{font-size:12px!important;border-radius:4px!important}html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row{left:4px!important;right:4px!important;height:68px!important}html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row button{height:60px!important}html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row b{font-size:7px!important}html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row small{font-size:5px!important}}\
';
    document.head.appendChild(s);
  }

  function ensureTopControls(section){
    var row=document.getElementById('ktGroup13TopControls');
    if(row)return;
    row=document.createElement('div');
    row.id='ktGroup13TopControls';
    row.innerHTML=''
      +'<button type="button" class="rank">🔥 일일 랭킹</button>'
      +'<button type="button" class="add" onclick="if(window.shareApp)shareApp()">🎯 지금 추가</button>'
      +'<button type="button" class="viewers">시청자 4명이 🛩️</button>';
    section.appendChild(row);
  }

  function ensureHostFrame(section){
    var frame=document.getElementById('ktGroup13HostFrame');
    if(!frame){frame=document.createElement('div');frame.id='ktGroup13HostFrame';section.appendChild(frame);}
    var v=document.getElementById('ktLiveVideo');
    if(v&&v.parentNode!==frame)frame.appendChild(v);
  }

  function makeGrid(section){
    var grid=document.getElementById('ktGroup13GuestGrid');
    if(!grid){
      grid=document.createElement('div');grid.id='ktGroup13GuestGrid';
      var html='';for(var i=0;i<12;i++)html+='<div class="kt-group13-guest" aria-label="게스트 자리 '+(i+1)+'">게스트</div>';
      grid.innerHTML=html;section.appendChild(grid);
    }
    var badge=document.getElementById('ktGroup13HostBadge');
    if(!badge){badge=document.createElement('div');badge.id='ktGroup13HostBadge';badge.textContent='호스트';section.appendChild(badge);}
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

  function ensureBottomBar(section){
    var bar=section.querySelector('.kt-s2-bottom');if(!bar){bar=document.createElement('div');bar.className='kt-s2-bottom';section.appendChild(bar);}
    if(bar.dataset.ktGroup13Bottom==='1')return;bar.dataset.ktGroup13Bottom='1';
    bar.innerHTML=''
      +'<button class="kt-live-link" type="button" aria-label="연결" onclick="if(window.ktLiveBottomConnect)ktLiveBottomConnect();else if(window.openCommunicationPanel)openCommunicationPanel()">🔗</button>'
      +'<button type="button" aria-label="시청자 초대" onclick="if(window.ktLiveBottomAudience)ktLiveBottomAudience();else if(window.shareApp)shareApp()">👥</button>'
      +'<button type="button" aria-label="채팅" onclick="if(window.openComments)openComments()">💬</button>'
      +'<button class="kt-live-share" type="button" aria-label="공유" onclick="if(window.shareApp)shareApp()">↗</button>'
      +'<button type="button" aria-label="효과" onclick="if(window.ktLiveBottomEffects)ktLiveBottomEffects();else if(window.openEditEffectPanel)openEditEffectPanel()">🪄</button>'
      +'<button class="kt-live-more" type="button" aria-label="더보기" onclick="if(window.ktLiveBottomMore)ktLiveBottomMore();else if(window.openSiteGuide)openSiteGuide()">•••</button>';
  }

  function removeGroup13Extras(){
    var section=document.getElementById('ktSept2Live');var frame=document.getElementById('ktGroup13HostFrame');var v=document.getElementById('ktLiveVideo');
    if(frame&&v&&section&&v.parentNode===frame)section.insertBefore(v,section.firstChild||null);if(frame)frame.remove();
    var grid=document.getElementById('ktGroup13GuestGrid');if(grid)grid.remove();var badge=document.getElementById('ktGroup13HostBadge');if(badge)badge.remove();var row=document.getElementById('ktGroup13TopControls');if(row)row.remove();
  }

  function apply(){
    addCss();var section=document.getElementById('ktSept2Live');var active=!!(section&&isGroup13());document.documentElement.classList.toggle('kt-group13-reference',active);
    if(!active){removeGroup13Extras();return;}ensureTopControls(section);ensureHostFrame(section);makeGrid(section);ensureGiftRow(section);ensureBottomBar(section);
  }
  addCss();apply();setInterval(apply,350);var ob=new MutationObserver(apply);ob.observe(document.documentElement,{childList:true,subtree:true});
})();
