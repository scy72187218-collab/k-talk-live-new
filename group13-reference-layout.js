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
html.kt-group13-reference body #ktSept2Live #ktGroup13GuestGrid{position:absolute!important;left:calc(43% + 12px)!important;right:64px!important;top:112px!important;bottom:198px!important;z-index:4!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;gap:4px!important;pointer-events:auto!important;}\
html.kt-group13-reference body #ktSept2Live #ktGroup13GuestGrid .kt-group13-guest{min-width:0!important;min-height:0!important;border:1px solid rgba(255,255,255,.08)!important;border-radius:10px!important;background:linear-gradient(180deg,#242427,#1d1d20)!important;color:#9b9b9f!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:13px!important;font-weight:900!important;letter-spacing:-.2px!important;box-shadow:inset 0 1px 0 rgba(255,255,255,.025)!important;}\
html.kt-group13-reference body #ktSept2Live #ktGroup13HostBadge{position:absolute!important;left:16px!important;top:120px!important;z-index:6!important;padding:3px 8px!important;border-radius:12px!important;background:rgba(35,35,38,.82)!important;color:#fff!important;font-size:12px!important;font-weight:950!important;line-height:1.2!important;border:1px solid rgba(255,255,255,.12)!important;}\
@media(max-width:380px){html.kt-group13-reference body #ktSept2Live #ktGroup13GuestGrid{left:calc(44% + 8px)!important;right:58px!important;gap:3px!important}html.kt-group13-reference body #ktSept2Live #ktGroup13GuestGrid .kt-group13-guest{font-size:11px!important;border-radius:8px!important}}\
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

  function forceHostVideo(){
    var v=document.getElementById('ktLiveVideo');
    if(!v)return;
    v.style.setProperty('position','absolute','important');
    v.style.setProperty('inset','auto','important');
    v.style.setProperty('left','8px','important');
    v.style.setProperty('right','auto','important');
    v.style.setProperty('top','112px','important');
    v.style.setProperty('bottom','198px','important');
    v.style.setProperty('width','43%','important');
    v.style.setProperty('height','auto','important');
    v.style.setProperty('max-width','none','important');
    v.style.setProperty('max-height','none','important');
    v.style.setProperty('object-fit','cover','important');
    v.style.setProperty('object-position','50% 50%','important');
    v.style.setProperty('border-radius','10px','important');
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
    forceHostVideo();
  }

  addCss();
  apply();
  setInterval(apply,350);
  var ob=new MutationObserver(apply);
  ob.observe(document.documentElement,{childList:true,subtree:true});
})();
