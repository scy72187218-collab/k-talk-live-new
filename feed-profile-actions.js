/* K-Talk 공개 동영상 오른쪽 버튼: 프로필 사진 → 장미 → 좋아요 → 댓글 → 선물 → 공유. 이 영역만 보강. */
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

  function normalizeLikeText(like){
    if(!like)return;
    try{
      like.classList.add('kt-feed-like-button');
      like.setAttribute('aria-label','좋아요');
      for(var n=like.firstChild;n;n=n.nextSibling){
        if(n.nodeType===3){
          var t=String(n.nodeValue||'');
          if(t.indexOf('🌹')>-1||t.indexOf('♥')>-1||t.indexOf('♡')>-1){
            var next=t.replace('🌹','♡').replace('♥','♡');
            if(next!==t)n.nodeValue=next;
            break;
          }
        }
      }
      var small=like.querySelector('small');
      if(small){
        var txt=String(small.textContent||'');
        var m=txt.match(/(\d+)/);
        var nextLabel='좋아요 '+(m?m[1]:'0');
        if(txt!==nextLabel)small.textContent=nextLabel;
      }
    }catch(e){}
  }

  function bindLike(like){
    if(!like)return;
    normalizeLikeText(like);
    if(like.getAttribute('data-kt-heart-bound')==='1')return;
    like.setAttribute('data-kt-heart-bound','1');
    like.addEventListener('click',function(){
      window.__ktFeedHeartClickUntil=Date.now()+3500;
      [0,120,350,800,1500,2800].forEach(function(ms){setTimeout(function(){normalizeLikeText(like);},ms);});
    },true);
    try{
      new MutationObserver(function(){normalizeLikeText(like);}).observe(like,{childList:true,subtree:true,characterData:true});
    }catch(e){}
  }

  function recipientName(box){
    try{
      var card=box&&box.closest?box.closest('section'):null;
      var title=card&&card.querySelector?card.querySelector('.vh-title b'):null;
      var name=title?String(title.textContent||''):'';
      name=name.replace(/^♛\s*/,'').trim();
      return name||'동영상 게시자';
    }catch(e){return '동영상 게시자';}
  }

  function showRoseToast(name){
    try{
      var old=document.querySelector('.kt-feed-rose-toast');
      if(old)old.remove();
      var toast=document.createElement('div');
      toast.className='kt-feed-rose-toast';
      toast.style.cssText='position:fixed;left:50%;bottom:110px;transform:translateX(-50%);z-index:99999;padding:12px 18px;border-radius:999px;background:rgba(24,8,28,.94);border:1px solid #ff5aaf;color:#fff;font-weight:950;box-shadow:0 0 18px rgba(255,54,150,.45);white-space:nowrap;max-width:88vw;overflow:hidden;text-overflow:ellipsis';
      toast.textContent='🌹 '+(name||'동영상 게시자')+'님에게 장미 1송이를 보냈습니다';
      document.body.appendChild(toast);
      setTimeout(function(){if(toast&&toast.parentNode)toast.remove();},2200);
    }catch(e){}
  }

  function sendOneRose(box){
    var name=recipientName(box);
    try{
      if(typeof window.giftSend==='function')window.giftSend('장미',1);
      else if(typeof window.ktAnnounceEvent==='function')window.ktAnnounceEvent('gift',{name:'장미',count:1});
    }catch(e){}
    showRoseToast(name);
  }

  function ensureRose(box,profile,like){
    var rose=box.querySelector(':scope > .kt-feed-rose-button');
    if(!rose){
      rose=document.createElement('button');
      rose.type='button';
      rose.className='kt-feed-rose-button';
      rose.setAttribute('aria-label','장미');
      rose.innerHTML='🌹<small>장미</small>';
    }
    rose.onclick=function(e){
      try{if(e){e.preventDefault();e.stopPropagation();}}catch(x){}
      sendOneRose(box);
      return false;
    };
    if(like){
      if(rose.nextSibling!==like)box.insertBefore(rose,like);
    }else if(profile&&profile.nextSibling!==rose){
      box.insertBefore(rose,profile.nextSibling||null);
    }
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

    var buttons=[].slice.call(box.querySelectorAll(':scope > button:not(.kt-feed-profile-button):not(.kt-feed-rose-button)'));
    var like=buttons[0]||null;
    bindLike(like);
    ensureRose(box,b,like);
  }

  function run(){
    try{document.querySelectorAll('.vh-actions').forEach(decorate);}catch(e){}
  }

  function fixHeartToast(node){
    try{
      if(Date.now()>Number(window.__ktFeedHeartClickUntil||0))return;
      if(!node||node.nodeType!==1)return;
      if(node.classList&&node.classList.contains('kt-feed-rose-toast'))return;
      var txt=String(node.textContent||'');
      if(txt.indexOf('장미 1송이를 보냈습니다')===-1)return;
      node.textContent='💗 좋아요를 눌렀습니다';
      window.__ktFeedHeartClickUntil=0;
    }catch(e){}
  }

  function watchHeartToast(){
    if(!document.body||window.__ktFeedHeartToastObserver)return;
    try{
      window.__ktFeedHeartToastObserver=new MutationObserver(function(list){
        list.forEach(function(m){[].slice.call(m.addedNodes||[]).forEach(fixHeartToast);});
      });
      window.__ktFeedHeartToastObserver.observe(document.body,{childList:true});
    }catch(e){}
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
  watchHeartToast();
  setTimeout(run,80);
  setTimeout(run,300);
  setTimeout(watchHeartToast,0);
  try{new MutationObserver(run).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  window.addEventListener('storage',run);
})();