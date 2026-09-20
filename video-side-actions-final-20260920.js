/* K-Talk 공개 동영상 오른쪽 표시 최종 정리.
   이 파일은 .vh-actions 내부만 만진다.
   동영상 재생/방송방/채팅/스위치/통신은 변경하지 않는다. */
(function(){
  if(window.__ktVideoSideActionsFinal20260920)return;
  window.__ktVideoSideActionsFinal20260920=true;

  function txt(el){return String(el&&el.textContent||'').replace(/\s+/g,'').trim();}
  function directButtons(box){
    var out=[];
    try{
      var kids=box&&box.children?box.children:[];
      for(var i=0;i<kids.length;i++){
        if(kids[i]&&String(kids[i].tagName||'').toUpperCase()==='BUTTON')out.push(kids[i]);
      }
    }catch(e){}
    return out;
  }
  function onclickText(el){return String(el&&el.getAttribute&&el.getAttribute('onclick')||'');}
  function firstNumber(v){
    var m=String(v||'').replace(/,/g,'').match(/\d+/);
    return m?parseInt(m[0],10)||0:0;
  }
  function currentPhoto(){
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad()||{};
        if(p.photo)return String(p.photo);
      }
    }catch(e){}
    try{
      return localStorage.getItem('ktalk_profile_photo')||
        localStorage.getItem('ktalk_profile_image')||
        localStorage.getItem('ktalk_profile_avatar')||'';
    }catch(e){return '';}
  }
  function videoId(box){
    var list=[].slice.call(box.querySelectorAll('button'));
    for(var i=0;i<list.length;i++){
      var s=onclickText(list[i]);
      var m=s.match(/ktPublic(?:Comments|SendRose)\(\s*['"]([^'"]+)['"]/);
      if(m)return m[1];
    }
    return '';
  }
  function authorName(box){
    try{
      var sec=box.closest('section');
      var b=sec&&sec.querySelector('.vh-title b');
      return String(b&&b.textContent||'K-Talk').replace(/^\s*♛\s*/,'').trim()||'K-Talk';
    }catch(e){return 'K-Talk';}
  }

  function findProfile(box){
    var b=box.querySelector('.kt-feed-profile-button');
    if(b)return b;
    var list=directButtons(box);
    b=list.find(function(x){
      var a=String(x.getAttribute('aria-label')||'');
      return /프로필/.test(a)||/프로필/.test(txt(x))||!!x.querySelector('img');
    });
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-feed-profile-button';
      b.setAttribute('aria-label','프로필');
      b.onclick=function(){
        try{if(typeof window.openProfileDirect==='function'){window.openProfileDirect();return;}}catch(e){}
        try{if(typeof window.openProfile==='function')window.openProfile();}catch(e){}
      };
    }
    b.classList.add('kt-feed-profile-button');
    return b;
  }

  function renderProfile(b,box){
    if(!b)return;
    var photo=currentPhoto();
    var circle=b.querySelector('.kt-feed-profile-circle');
    if(!circle){
      circle=document.createElement('span');
      circle.className='kt-feed-profile-circle';
      b.innerHTML='';
      b.appendChild(circle);
    }
    if(photo){
      if(!circle.querySelector('img')||circle.querySelector('img').getAttribute('src')!==photo){
        circle.innerHTML='<img alt="">';
        circle.querySelector('img').src=photo;
      }
    }else if(!circle.textContent&&!circle.querySelector('img')){
      circle.textContent='👤';
    }
    var label=b.querySelector('.kt-feed-profile-name');
    if(!label){
      label=document.createElement('small');
      label.className='kt-feed-profile-name';
      b.appendChild(label);
    }
    label.textContent=authorName(box||b.closest('.vh-actions'));
  }

  function findOldRoseCount(box){
    var n=0;
    directButtons(box).forEach(function(b){
      var s=onclickText(b),t=txt(b);
      if(/ktPublicSendRose/.test(s)||/장미|🌹/.test(t)){
        n=Math.max(n,firstNumber(t));
      }
      if(/좋아요/.test(t)){
        n=Math.max(n,firstNumber(t));
      }
    });
    return n;
  }

  function ensureRose(box){
    var rose=box.querySelector('.kt-feed-final-rose');
    var id=videoId(box);
    if(!rose){
      rose=document.createElement('button');
      rose.type='button';
      rose.className='kt-feed-final-rose';
      rose.setAttribute('aria-label','장미');
      rose.innerHTML='<span class="kt-feed-final-rose-icon">🌹</span><small>0</small>';
      rose.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(x){}
        if(!id)return;
        try{
          if(typeof window.ktPublicSendRose==='function'){
            window.ktPublicSendRose(id,authorName(box),rose);
          }
        }catch(x){}
      };
    }
    var sm=rose.querySelector('small');
    if(sm){
      var old=Math.max(firstNumber(sm.textContent),findOldRoseCount(box));
      sm.textContent=old.toLocaleString('ko-KR');
    }
    return rose;
  }

  function findMessage(box){
    var list=directButtons(box);
    var b=list.find(function(x){
      var s=onclickText(x),t=txt(x);
      return /ktPublicComments|openComments/.test(s)||/댓글|메시지/.test(t);
    });
    if(!b){
      b=list.find(function(x){return /좋아요/.test(txt(x))||/kt-feed-like-button/.test(String(x.className||''));});
    }
    if(!b){
      var id=videoId(box);
      b=document.createElement('button');
      b.type='button';
      b.onclick=function(){try{if(id&&typeof window.ktPublicComments==='function')window.ktPublicComments(id);}catch(e){}};
    }
    b.classList.add('kt-feed-final-message');
    b.setAttribute('aria-label','메시지');
    b.innerHTML='💬<small>메시지</small>';
    return b;
  }

  function findShare(box){
    var list=directButtons(box);
    return list.find(function(x){
      var s=onclickText(x),t=txt(x);
      return /ktPublicShare|shareApp/.test(s)||/공유|↗/.test(t);
    })||null;
  }

  function removeExtras(box,keep){
    directButtons(box).forEach(function(b){
      if(keep.indexOf(b)>=0)return;
      var s=onclickText(b),t=txt(b);
      if(/openGifts/.test(s)||/선물|🎁/.test(t)||/좋아요/.test(t)){
        try{b.remove();}catch(e){}
      }
    });
  }

  function apply(box){
    if(!box)return;

    var oldButtons=directButtons(box);
    var count=0,id='',shareUrl='',commentId='';
    var existingProfile=box.querySelector('.kt-feed-profile-circle img');
    var photo=existingProfile&&existingProfile.src?existingProfile.src:currentPhoto();

    oldButtons.forEach(function(b){
      var s=onclickText(b),t=txt(b);
      count=Math.max(count,firstNumber(t));
      var m=s.match(/ktPublicSendRose\(\s*['"]([^'"]+)['"]/);
      if(m&&!id)id=m[1];
      var cm=s.match(/ktPublicComments\(\s*['"]([^'"]+)['"]/);
      if(cm&&!commentId)commentId=cm[1];
      var sm=s.match(/ktPublicShare\(\s*['"]([^'"]+)['"]/);
      if(sm&&!shareUrl)shareUrl=sm[1];
    });

    if(!id)id=commentId||videoId(box);

    var profile=document.createElement('button');
    profile.type='button';
    profile.className='kt-feed-profile-button';
    profile.setAttribute('aria-label','프로필');
    profile.onclick=function(){
      try{if(typeof window.openProfileDirect==='function'){window.openProfileDirect();return;}}catch(e){}
      try{if(typeof window.openProfile==='function')window.openProfile();}catch(e){}
    };
    var circle=document.createElement('span');
    circle.className='kt-feed-profile-circle';
    if(photo){
      var img=document.createElement('img');
      img.alt='';
      img.src=photo;
      circle.appendChild(img);
    }else{
      circle.textContent='👤';
    }
    profile.appendChild(circle);

    var rose=document.createElement('button');
    rose.type='button';
    rose.className='kt-feed-final-rose';
    rose.setAttribute('aria-label','장미');
    rose.innerHTML='<span class="kt-feed-final-rose-icon">🌹</span><small>'+count.toLocaleString('ko-KR')+'</small>';
    rose.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(x){}
      if(!id)return;
      try{if(typeof window.ktPublicSendRose==='function')window.ktPublicSendRose(id,authorName(box),rose);}catch(x){}
    };

    var message=document.createElement('button');
    message.type='button';
    message.className='kt-feed-final-message';
    message.setAttribute('aria-label','메시지');
    message.innerHTML='💬<small>메시지</small>';
    message.onclick=function(){
      try{
        var useId=commentId||id;
        if(useId&&typeof window.ktPublicComments==='function')window.ktPublicComments(useId);
        else if(typeof window.openComments==='function')window.openComments();
      }catch(e){}
    };

    var share=document.createElement('button');
    share.type='button';
    share.className='kt-feed-final-share';
    share.setAttribute('aria-label','공유');
    share.innerHTML='↗<small>공유</small>';
    share.onclick=function(){
      try{
        if(shareUrl&&typeof window.ktPublicShare==='function')window.ktPublicShare(shareUrl);
        else if(typeof window.shareApp==='function')window.shareApp();
      }catch(e){}
    };

    /* 오른쪽 영역만 교체: 프로필 사진 → 장미/개수 → 메시지 → 공유 */
    while(box.firstChild)box.removeChild(box.firstChild);
    box.appendChild(profile);
    box.appendChild(rose);
    box.appendChild(message);
    box.appendChild(share);
  }

  function run(){
    try{document.querySelectorAll('.vh-actions').forEach(apply);}catch(e){}
  }

  if(!document.getElementById('ktVideoSideActionsFinalStyle20260920')){
    var s=document.createElement('style');
    s.id='ktVideoSideActionsFinalStyle20260920';
    s.textContent=''
      +'.vh-actions{display:flex!important;position:absolute!important;right:12px!important;bottom:105px!important;z-index:24!important;flex-direction:column!important;align-items:center!important;gap:11px!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important}'
      +'.vh-actions>button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;min-width:52px!important;min-height:48px!important;border:0!important;background:transparent!important;color:#fff!important;visibility:visible!important;opacity:1!important;pointer-events:auto!important;text-shadow:0 1px 4px #000!important}'
      +'.vh-actions>button:not(.kt-feed-profile-button){font-size:31px!important}'
      +'.vh-actions>button small{display:block!important;margin-top:2px!important;font-size:10px!important;line-height:1.1!important;font-weight:850!important;color:#fff!important;white-space:nowrap!important}'
      +'.vh-actions>.kt-feed-profile-button{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;background:transparent!important;border:0!important;padding:0!important;min-width:52px!important;min-height:48px!important}'
      +'.vh-actions .kt-feed-profile-circle{display:flex!important;width:48px!important;height:48px!important;border-radius:50%!important;overflow:hidden!important;align-items:center!important;justify-content:center!important;border:2px solid #fff!important;background:#222!important;font-size:26px!important;box-sizing:border-box!important;box-shadow:0 2px 8px rgba(0,0,0,.45)!important}'
      +'.vh-actions .kt-feed-profile-circle img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}'
      +'.vh-actions .kt-feed-profile-name{display:none!important}'
      +'.vh-actions .kt-feed-profile-name{display:block!important;margin-top:3px!important;max-width:66px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;font-size:10px!important;font-weight:850!important;color:#fff!important;text-shadow:0 1px 4px #000!important}'
      +'.vh-actions>.kt-feed-final-rose{display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;background:transparent!important;border:0!important;color:#fff!important;min-width:52px!important;min-height:54px!important;padding:0!important;text-shadow:0 1px 4px #000!important}'
      +'.vh-actions .kt-feed-final-rose-icon{display:block!important;font-size:31px!important;line-height:1!important}'
      +'.vh-actions>.kt-feed-final-rose small{display:block!important;margin-top:4px!important;font-size:11px!important;line-height:1!important;font-weight:950!important;color:#fff!important}'
      +'.vh-actions>.kt-feed-final-message small{display:block!important;font-size:10px!important;font-weight:850!important;color:#fff!important}'
      +'@media(max-width:390px){.vh-actions{right:8px!important;bottom:98px!important;gap:10px!important}.vh-actions .kt-feed-profile-circle{width:44px!important;height:44px!important}.vh-actions .kt-feed-final-rose-icon{font-size:28px!important}.vh-actions>button:not(.kt-feed-profile-button){font-size:28px!important}}';
    document.head.appendChild(s);
  }

  run();
  [60,180,420,900,1600,2600].forEach(function(ms){setTimeout(run,ms);});
  try{
    if(!window.__ktVideoSideActionsFinalInterval){
      window.__ktVideoSideActionsFinalInterval=setInterval(run,400);
    }
  }catch(e){}
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktVideoSideActionsFinalTimer);
      window.__ktVideoSideActionsFinalTimer=setTimeout(run,20);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true,characterData:true});
  }catch(e){}
})();