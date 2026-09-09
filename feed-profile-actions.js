/* K-Talk 공개 동영상 오른쪽 버튼 정리: 프로필 사진 → 좋아요 → 댓글 → 선물 → 공유. 기존 기능은 건드리지 않음. */
(function(){
  if(window.__ktFeedProfileActionsInstalled)return;
  window.__ktFeedProfileActionsInstalled=true;

  function getProfileImage(){
    var src='';
    try{
      src=localStorage.getItem('ktalk_profile_photo')||localStorage.getItem('ktalk_profile_image')||localStorage.getItem('ktalk_profile_avatar')||'';
    }catch(e){}
    if(src)return src;
    try{
      var el=document.querySelector('#profileAvatar img,.profile-avatar img,.profile-photo img,[data-profile-photo] img');
      if(el&&el.src)src=el.src;
    }catch(e){}
    return src;
  }

  function decorate(box){
    if(!box||box.querySelector('.kt-feed-profile-button'))return;
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-feed-profile-button';
    b.setAttribute('aria-label','프로필 사진');
    var src=getProfileImage();
    b.innerHTML=src
      ?'<span class="kt-feed-profile-circle"><img src="'+src.replace(/"/g,'&quot;')+'" alt="프로필 사진"></span><small>프로필</small>'
      :'<span class="kt-feed-profile-circle kt-feed-profile-empty">👤</span><small>프로필</small>';
    box.insertBefore(b,box.firstChild||null);
  }

  function run(){
    try{document.querySelectorAll('.vh-actions').forEach(decorate);}catch(e){}
  }

  if(!document.getElementById('ktFeedProfileActionsStyle')){
    var st=document.createElement('style');
    st.id='ktFeedProfileActionsStyle';
    st.textContent=''
      +'.vh-actions .kt-feed-profile-button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important}'
      +'.vh-actions .kt-feed-profile-circle{display:flex!important;width:48px!important;height:48px!important;border-radius:50%!important;overflow:hidden!important;align-items:center!important;justify-content:center!important;border:2px solid #fff!important;background:#222!important;font-size:28px!important;box-sizing:border-box!important}'
      +'.vh-actions .kt-feed-profile-circle img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}'
      +'.vh-actions .kt-feed-profile-button small{display:block!important;margin-top:3px!important;font-size:10px!important;font-weight:800!important;color:#fff!important;text-shadow:0 1px 3px #000!important}';
    document.head.appendChild(st);
  }

  run();
  try{new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
