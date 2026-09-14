/* K-Talk 공개 동영상 오른쪽 버튼: 프로필 사진 → 좋아요 → 댓글 → 선물 → 공유. 이 영역만 보강. */
(function(){
  if(window.__ktFeedProfileActionsInstalledV2)return;
  window.__ktFeedProfileActionsInstalledV2=true;

  function getProfileImage(){
    var src='';
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad();
        if(p&&p.photo)src=String(p.photo);
      }
    }catch(e){}
    if(src)return src;

    try{
      if(typeof window.ktProfileStorageKey==='function'){
        var raw=localStorage.getItem(window.ktProfileStorageKey())||'';
        if(raw){var x=JSON.parse(raw)||{};if(x.photo)src=String(x.photo);}
      }
    }catch(e){}
    if(src)return src;

    try{
      var sub=localStorage.getItem('ktalk_sub_account')||'';
      if(sub){
        var raw2=localStorage.getItem('ktalk_profile_v1:sub:'+sub)||'';
        if(raw2){var y=JSON.parse(raw2)||{};if(y.photo)src=String(y.photo);}
      }
    }catch(e){}
    if(src)return src;

    try{
      src=localStorage.getItem('ktalk_profile_photo')||localStorage.getItem('ktalk_profile_image')||localStorage.getItem('ktalk_profile_avatar')||'';
    }catch(e){}
    return src;
  }

  function profileHtml(src){
    return src
      ?'<span class="kt-feed-profile-circle"><img src="'+String(src).replace(/"/g,'&quot;')+'" alt="프로필 사진"></span><small>프로필</small>'
      :'<span class="kt-feed-profile-circle kt-feed-profile-empty">👤</span><small>프로필</small>';
  }

  function decorate(box){
    if(!box)return;
    var b=box.querySelector('.kt-feed-profile-button');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-feed-profile-button';
      b.setAttribute('aria-label','프로필 사진');
      b.onclick=function(){
        try{if(typeof window.openProfileDirect==='function'){window.openProfileDirect();return;}}catch(e){}
        try{if(typeof window.openProfile==='function')window.openProfile();}catch(e){}
      };
      box.insertBefore(b,box.firstChild||null);
    }else if(box.firstChild!==b){
      box.insertBefore(b,box.firstChild||null);
    }
    var src=getProfileImage();
    var old=b.getAttribute('data-photo-src')||'';
    if(old!==src||!b.firstChild){
      b.setAttribute('data-photo-src',src);
      b.innerHTML=profileHtml(src);
    }
  }

  function run(){
    try{document.querySelectorAll('.vh-actions').forEach(decorate);}catch(e){}
  }

  if(!document.getElementById('ktFeedProfileActionsStyleV2')){
    var st=document.createElement('style');
    st.id='ktFeedProfileActionsStyleV2';
    st.textContent=''
      +'.vh-actions{display:flex!important;position:absolute!important;right:12px!important;bottom:105px!important;z-index:24!important;flex-direction:column!important;align-items:center!important;gap:12px!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}'
      +'.vh-actions>button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;min-width:52px!important;min-height:48px!important;border:0!important;background:transparent!important;color:#fff!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;text-shadow:0 1px 4px #000!important}'
      +'.vh-actions>button:not(.kt-feed-profile-button){font-size:31px!important}'
      +'.vh-actions>button small{display:block!important;margin-top:2px!important;font-size:10px!important;line-height:1.1!important;font-weight:850!important;color:#fff!important;white-space:nowrap!important}'
      +'.vh-actions .kt-feed-profile-circle{display:flex!important;width:48px!important;height:48px!important;border-radius:50%!important;overflow:hidden!important;align-items:center!important;justify-content:center!important;border:2px solid #fff!important;background:#222!important;font-size:28px!important;box-sizing:border-box!important;box-shadow:0 2px 8px rgba(0,0,0,.45)!important}'
      +'.vh-actions .kt-feed-profile-circle img{width:100%!important;height:100%!important;object-fit:cover!important;object-position:center!important;display:block!important}'
      +'.vh-actions .kt-feed-profile-button small{display:block!important;margin-top:3px!important;font-size:10px!important;font-weight:850!important;color:#fff!important}'
      +'@media(max-width:390px){.vh-actions{right:8px!important;bottom:98px!important;gap:10px!important}.vh-actions .kt-feed-profile-circle{width:44px!important;height:44px!important}.vh-actions>button:not(.kt-feed-profile-button){font-size:28px!important}}';
    document.head.appendChild(st);
  }

  run();
  setTimeout(run,80);
  setTimeout(run,300);
  try{new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  window.addEventListener('storage',run);
})();