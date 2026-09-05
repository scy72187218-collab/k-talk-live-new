/* K-Talk LIVE: 비밀방 호스트 영상만 칸에 자연스럽게 꽉 채움. 다른 방/UI는 변경하지 않음. */
(function(){
  if(window.__ktPasswordHostCoverFixLoaded)return;
  window.__ktPasswordHostCoverFixLoaded=true;

  function isPasswordRoom(){
    try{return !!(window.state&&state.liveRoomType==='password');}catch(e){return false;}
  }

  function installCss(){
    if(document.getElementById('ktPasswordHostCoverFixCss'))return;
    var st=document.createElement('style');
    st.id='ktPasswordHostCoverFixCss';
    st.textContent='\
html.kt-password-reference body #ktSept2Live #ktPasswordHostFrame #ktLiveVideo{\
  position:absolute!important;\
  inset:0!important;\
  width:100%!important;\
  height:100%!important;\
  max-width:none!important;\
  max-height:none!important;\
  object-fit:cover!important;\
  object-position:50% 50%!important;\
  background:#111!important;\
}\
';
    document.head.appendChild(st);
  }

  function apply(){
    if(!isPasswordRoom())return;
    installCss();
    var v=document.getElementById('ktLiveVideo');
    if(!v)return;
    v.style.setProperty('object-fit','cover','important');
    v.style.setProperty('object-position','50% 50%','important');
    v.style.setProperty('width','100%','important');
    v.style.setProperty('height','100%','important');
  }

  installCss();
  apply();
  setInterval(apply,350);
  new MutationObserver(apply).observe(document.documentElement,{childList:true,subtree:true});
})();
