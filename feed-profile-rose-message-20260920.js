/* K-Talk 공개 동영상 오른쪽 버튼만 정리.
   순서: 프로필 사진(글씨 없음) -> 장미 1송이 -> 메시지 -> 공유하기.
   방송방/채팅/스위치/영상 연결은 변경하지 않음. */
(function(){
  if(window.__ktFeedProfileRoseMessage20260920)return;
  window.__ktFeedProfileRoseMessage20260920=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function profilePhoto(){
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

  function ensureProfile(box){
    var b=box.querySelector('.kt-feed-profile-button');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-feed-profile-button';
      b.setAttribute('aria-label','프로필');
      b.onclick=function(){
        try{if(typeof window.openProfileDirect==='function'){window.openProfileDirect();return;}}catch(e){}
        try{if(typeof window.openProfile==='function')window.openProfile();}catch(e){}
      };
      box.insertBefore(b,box.firstChild||null);
    }
    var src=profilePhoto();
    if(!b.querySelector('.kt-feed-profile-circle')){
      b.innerHTML=src
        ?'<span class="kt-feed-profile-circle"><img src="'+esc(src)+'" alt=""></span>'
        :'<span class="kt-feed-profile-circle kt-feed-profile-empty">👤</span>';
    }
    b.querySelectorAll('small').forEach(function(x){x.remove();});
    return b;
  }

  function videoId(box){
    var c=box.querySelector('button[onclick*="ktPublicComments"],button[onclick*="ktPublicSendRose"]');
    var s=String(c&&c.getAttribute('onclick')||'');
    var m=s.match(/ktPublic(?:Comments|SendRose)\(\s*['"]([^'"]+)['"]/);
    return m?m[1]:'';
  }

  function authorName(box){
    try{
      var sec=box.closest('section');
      var b=sec&&sec.querySelector('.vh-title b');
      return String(b&&b.textContent||'K-Talk').replace(/^\s*♛\s*/,'').trim()||'K-Talk';
    }catch(e){return 'K-Talk';}
  }

  function ensureRose(box,profile){
    var rose=box.querySelector('.kt-feed-one-rose');
    if(!rose){
      var id=videoId(box);
      if(!id)return null;
      rose=document.createElement('button');
      rose.type='button';
      rose.className='kt-feed-one-rose';
      rose.setAttribute('aria-label','장미 1송이');
      rose.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(x){}
        try{if(typeof window.ktPublicSendRose==='function')window.ktPublicSendRose(id,authorName(box),rose);}catch(x){}
      };
      rose.innerHTML='<small></small>';
    }
    if(profile&&profile.nextSibling!==rose)box.insertBefore(rose,profile.nextSibling);
    return rose;
  }

  function findMessage(box,profile,rose){
    var buttons=[].slice.call(box.querySelectorAll(':scope > button'));
    var msg=buttons.find(function(btn){
      if(btn===profile||btn===rose)return false;
      var oc=String(btn.getAttribute('onclick')||'');
      var txt=String(btn.textContent||'').replace(/\s+/g,'');
      return oc.indexOf('ktPublicComments')>-1||oc.indexOf('openComments')>-1||
             txt.indexOf('댓글')>-1||txt.indexOf('좋아요')>-1||
             btn.classList.contains('kt-feed-like-button');
    });
    if(!msg)return null;
    msg.classList.add('kt-feed-message-button');
    msg.setAttribute('aria-label','메시지');
    var sm=msg.querySelector('small');
    if(sm)sm.textContent='메시지';
    return msg;
  }

  function findShare(box){
    var buttons=[].slice.call(box.querySelectorAll(':scope > button'));
    return buttons.find(function(btn){
      var oc=String(btn.getAttribute('onclick')||'');
      var txt=String(btn.textContent||'');
      return oc.indexOf('ktPublicShare')>-1||oc.indexOf('shareApp')>-1||
             txt.indexOf('공유')>-1||txt.indexOf('↗')>-1;
    })||null;
  }

  function removeGift(box){
    [].slice.call(box.querySelectorAll(':scope > button')).forEach(function(btn){
      if(btn.classList.contains('kt-feed-one-rose')||btn.classList.contains('kt-feed-profile-button'))return;
      var oc=String(btn.getAttribute('onclick')||'');
      var txt=String(btn.textContent||'');
      if(oc.indexOf('openGifts')>-1||txt.indexOf('🎁')>-1){
        try{btn.remove();}catch(e){}
      }
    });
  }

  function arrange(box){
    if(!box)return;
    removeGift(box);
    var p=ensureProfile(box);
    var r=ensureRose(box,p);
    var m=findMessage(box,p,r);
    var s=findShare(box);
    [p,r,m,s].forEach(function(x){if(x)box.appendChild(x);});
  }

  function run(){
    try{document.querySelectorAll('.vh-actions').forEach(arrange);}catch(e){}
  }

  if(!document.getElementById('ktFeedProfileRoseMessageStyle')){
    var st=document.createElement('style');
    st.id='ktFeedProfileRoseMessageStyle';
    st.textContent=''
      +'.vh-actions{display:flex!important;flex-direction:column!important;align-items:center!important;gap:12px!important}'
      +'.vh-actions .kt-feed-profile-button small{display:none!important}'
      +'.vh-actions .kt-feed-profile-circle{display:flex!important;width:48px!important;height:48px!important;border-radius:50%!important;overflow:hidden!important;align-items:center!important;justify-content:center!important;border:2px solid #fff!important;background:#222!important;box-sizing:border-box!important;box-shadow:0 2px 8px rgba(0,0,0,.45)!important}'
      +'.vh-actions .kt-feed-profile-circle img{width:100%!important;height:100%!important;object-fit:cover!important;display:block!important}'
      +'.vh-actions .kt-feed-one-rose{min-width:52px!important;min-height:46px!important;background:transparent!important;border:0!important;color:#fff!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;text-shadow:0 1px 4px #000!important}'
      +'.vh-actions .kt-feed-one-rose:before{content:"🌹";font-size:31px!important;line-height:1!important}'
      +'.vh-actions .kt-feed-one-rose small{display:none!important}'
      +'.vh-actions .kt-feed-message-button small{display:none!important}'
      +'.vh-actions .kt-feed-message-button:after{content:"메시지";display:block!important;margin-top:2px!important;font-size:10px!important;line-height:1.1!important;font-weight:850!important;color:#fff!important;white-space:nowrap!important}'
      +'@media(max-width:390px){.vh-actions .kt-feed-profile-circle{width:44px!important;height:44px!important}.vh-actions .kt-feed-one-rose:before{font-size:28px!important}}';
    document.head.appendChild(st);
  }

  run();
  [80,220,500,1000,1800].forEach(function(ms){setTimeout(run,ms);});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktFeedProfileRoseMessageTimer);
      window.__ktFeedProfileRoseMessageTimer=setTimeout(run,20);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true,characterData:true});
  }catch(e){}
})();