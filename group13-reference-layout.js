/* K-Talk LIVE: 13명 방송 화면만 호스트 + 게스트 3x4 배치. 다른 방/UI는 변경하지 않음. */
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
html.kt-group13-reference body #ktSept2Live .kt-live-guests{display:none!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-right{display:none!important;}\
html.kt-group13-reference body #ktSept2Live #ktGroup13GuestGrid{position:absolute!important;left:calc(43% + 5px)!important;right:5px!important;top:112px!important;bottom:138px!important;z-index:4!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:1px!important;pointer-events:auto!important;}\
html.kt-group13-reference body #ktSept2Live #ktGroup13GuestGrid .kt-group13-guest{min-width:0!important;min-height:0!important;border:1px solid rgba(255,255,255,.06)!important;border-radius:6px!important;background:linear-gradient(180deg,#242427,#1d1d20)!important;color:#a5a5aa!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:14px!important;font-weight:900!important;letter-spacing:-.2px!important;box-shadow:none!important;}\
html.kt-group13-reference body #ktSept2Live #ktGroup13HostBadge{position:absolute!important;left:14px!important;top:120px!important;z-index:6!important;padding:3px 8px!important;border-radius:12px!important;background:rgba(35,35,38,.82)!important;color:#fff!important;font-size:12px!important;font-weight:950!important;line-height:1.2!important;border:1px solid rgba(255,255,255,.12)!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-att-small{height:25px!important;min-width:122px!important;padding:0 8px!important;border-radius:12px!important;font-size:11px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-att-large{height:40px!important;padding:0 8px!important;border-radius:17px!important;font-size:17px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-attendance-stack{gap:3px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row{display:grid!important;visibility:visible!important;opacity:1!important;left:7px!important;right:7px!important;bottom:61px!important;height:72px!important;z-index:28!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:2px!important;padding:3px 2px!important;background:rgba(2,2,5,.92)!important;border-radius:8px!important;overflow:hidden!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row button{height:64px!important;padding:2px 1px!important;border-radius:7px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row .gift-img{width:27px!important;height:27px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row .gift-emoji{height:27px!important;font-size:22px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row b{margin-top:1px!important;font-size:8px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row small{margin-top:1px!important;font-size:6px!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-bottom{display:grid!important;visibility:visible!important;opacity:1!important;position:absolute!important;left:6px!important;right:6px!important;bottom:3px!important;height:56px!important;z-index:30!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;align-items:center!important;gap:5px!important;padding:0!important;background:transparent!important;}\
html.kt-group13-reference body #ktSept2Live .kt-s2-bottom button{width:46px!important;height:46px!important;min-width:46px!important;min-height:46px!important;margin:0 auto!important;padding:0!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:50%!important;background:rgba(22,22,26,.92)!important;color:#fff!important;display:grid!important;place-items:center!important;font-size:22px!important;font-weight:900!important;line-height:1!important;}\
@media(max-width:380px){html.kt-group13-reference body #ktSept2Live #ktGroup13GuestGrid{left:calc(44% + 4px)!important;right:4px!important;gap:1px!important}html.kt-group13-reference body #ktSept2Live #ktGroup13GuestGrid .kt-group13-guest{font-size:12px!important;border-radius:5px!important}html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row{left:4px!important;right:4px!important;height:68px!important}html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row button{height:60px!important}html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row b{font-size:7px!important}html.kt-group13-reference body #ktSept2Live .kt-s2-gift-row small{font-size:5px!important}}\
';
    document.head.appendChild(s);
  }

  function makeGrid(section){
    var grid=document.getElementById('ktGroup13GuestGrid');
    if(!grid){
      grid=document.createElement('div');
      grid.id='ktGroup13GuestGrid';
      var html='';
      for(var i=0;i<12;i++)html+='<div class="kt-group13-guest" aria-label="게스트 자리 '+(i+1)+'">게스트</div>';
      grid.innerHTML=html;
      section.appendChild(grid);
    }
    var badge=document.getElementById('ktGroup13HostBadge');
    if(!badge){
      badge=document.createElement('div');
      badge.id='ktGroup13HostBadge';
      badge.textContent='호스트';
      section.appendChild(badge);
    }
  }

  function ensureGiftRow(section){
    var row=section.querySelector('.kt-s2-gift-row');
    if(row)return;
    row=document.createElement('div');
    row.className='kt-s2-gift-row';
    row.setAttribute('aria-label','선물 바로가기');
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
    var bar=section.querySelector('.kt-s2-bottom');
    if(!bar){
      bar=document.createElement('div');
      bar.className='kt-s2-bottom';
      section.appendChild(bar);
    }
    if(bar.dataset.ktGroup13Bottom==='1')return;
    bar.dataset.ktGroup13Bottom='1';
    bar.innerHTML=''
      +'<button class="kt-live-link" type="button" aria-label="연결" onclick="if(window.ktLiveBottomConnect)ktLiveBottomConnect();else if(window.openCommunicationPanel)openCommunicationPanel()">🔗</button>'
      +'<button type="button" aria-label="시청자 초대" onclick="if(window.ktLiveBottomAudience)ktLiveBottomAudience();else if(window.shareApp)shareApp()">👥</button>'
      +'<button type="button" aria-label="채팅" onclick="if(window.openComments)openComments()">💬</button>'
      +'<button class="kt-live-share" type="button" aria-label="공유" onclick="if(window.shareApp)shareApp()">↗</button>'
      +'<button type="button" aria-label="효과" onclick="if(window.ktLiveBottomEffects)ktLiveBottomEffects();else if(window.openEditEffectPanel)openEditEffectPanel()">🪄</button>'
      +'<button class="kt-live-more" type="button" aria-label="더보기" onclick="if(window.ktLiveBottomMore)ktLiveBottomMore();else if(window.openSiteGuide)openSiteGuide()">•••</button>';
  }

  function forceHostVideo(){
    var v=document.getElementById('ktLiveVideo');
    if(!v)return;
    v.style.setProperty('position','absolute','important');
    v.style.setProperty('inset','auto','important');
    v.style.setProperty('left','5px','important');
    v.style.setProperty('right','auto','important');
    v.style.setProperty('top','112px','important');
    v.style.setProperty('bottom','138px','important');
    v.style.setProperty('width','43%','important');
    v.style.setProperty('height','auto','important');
    v.style.setProperty('max-width','none','important');
    v.style.setProperty('max-height','none','important');
    v.style.setProperty('object-fit','cover','important');
    v.style.setProperty('object-position','50% 50%','important');
    v.style.setProperty('border-radius','7px','important');
    v.style.setProperty('background','#111','important');
  }

  function removeGrid(){
    var grid=document.getElementById('ktGroup13GuestGrid');if(grid)grid.remove();
    var badge=document.getElementById('ktGroup13HostBadge');if(badge)badge.remove();
  }

  function apply(){
    addCss();
    var section=document.getElementById('ktSept2Live');
    var active=!!(section&&isGroup13());
    document.documentElement.classList.toggle('kt-group13-reference',active);
    if(!active){removeGrid();return;}
    makeGrid(section);
    ensureGiftRow(section);
    ensureBottomBar(section);
    forceHostVideo();
  }

  addCss();
  apply();
  setInterval(apply,350);
  var ob=new MutationObserver(apply);
  ob.observe(document.documentElement,{childList:true,subtree:true});
})();
