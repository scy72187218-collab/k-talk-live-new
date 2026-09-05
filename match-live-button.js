/* K-Talk LIVE: add Match button next to Share in every live-room bottom bar. */
(function(){
  if(window.__ktMatchLiveButtonInstalled)return;
  window.__ktMatchLiveButtonInstalled=true;

  function addCss(){
    if(document.getElementById('ktMatchLiveButtonCss'))return;
    var st=document.createElement('style');
    st.id='ktMatchLiveButtonCss';
    st.textContent='\
html body #ktSept2Live .kt-s2-bottom.kt-match-added{grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:3px!important;}\
html body #ktSept2Live .kt-s2-bottom.kt-match-added button{width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;}\
html body #ktSept2Live .kt-s2-bottom .kt-live-match{font-size:22px!important;text-shadow:0 0 9px #ff4b72,0 0 12px #ffc14d!important;}\
@media(min-width:390px){html body #ktSept2Live .kt-s2-bottom.kt-match-added button{width:46px!important;height:46px!important;min-width:46px!important;min-height:46px!important;}}\
';
    document.head.appendChild(st);
  }

  window.ktLiveBottomMatch=function(){
    try{
      if(window.openHostMatchArena){openHostMatchArena('1대1');return;}
      if(window.showSheet){showSheet('매치','<div style="padding:18px;color:#fff;font-weight:900">⚔ 매치 기능을 준비 중입니다.</div>');}
    }catch(e){}
  };

  function install(){
    var bar=document.querySelector('#ktSept2Live .kt-s2-bottom');
    if(!bar)return;
    bar.classList.add('kt-match-added');
    if(bar.querySelector('.kt-live-match'))return;
    var share=bar.querySelector('.kt-live-share')||bar.querySelector('button[aria-label="공유"]');
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-live-match';
    b.setAttribute('aria-label','매치');
    b.setAttribute('title','매치');
    b.textContent='⚔';
    b.onclick=function(){if(window.ktLiveBottomMatch)ktLiveBottomMatch();};
    if(share&&share.parentNode){
      if(share.nextSibling)share.parentNode.insertBefore(b,share.nextSibling);
      else share.parentNode.appendChild(b);
    }else{
      bar.appendChild(b);
    }
  }

  addCss();
  install();
  setInterval(install,500);
  try{
    var ob=new MutationObserver(install);
    ob.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
