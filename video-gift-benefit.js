/* K-Talk 공개 동영상 선물 표시 + 혜택 장미 1송이=30원. 다른 화면/기능은 건드리지 않음. */
(function(){
  if(window.__ktVideoGiftBenefitInstalled)return;
  window.__ktVideoGiftBenefitInstalled=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function currentGiver(sender){
    if(sender)return String(sender);
    var name='';
    try{name=state.profileName||state.currentProfileName||state.accountName||'';}catch(e){}
    try{name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;}catch(e){}
    return String(name||'시청자');
  }

  function videoSections(){
    return [].slice.call(document.querySelectorAll('#screen section')).filter(function(sec){
      return !!(sec.querySelector('.kt-public-video')||sec.querySelector('#homeVideo')||sec.classList.contains('video-home')||sec.classList.contains('media'));
    });
  }

  function activeVideoSection(){
    var list=videoSections();
    if(!list.length)return null;
    var best=null,bestScore=-1;
    list.forEach(function(sec){
      var r=sec.getBoundingClientRect();
      var visible=Math.max(0,Math.min(r.bottom,window.innerHeight)-Math.max(r.top,0));
      if(visible>bestScore){best=sec;bestScore=visible;}
    });
    return best;
  }

  function ensureRateBadge(){
    videoSections().forEach(function(sec){
      if(sec.querySelector('.kt-video-rose-rate'))return;
      if(getComputedStyle(sec).position==='static')sec.style.position='relative';
      var badge=document.createElement('div');
      badge.className='kt-video-rose-rate';
      badge.innerHTML='<span>🌹</span><b>혜택 장미 1송이 = 30원</b>';
      sec.appendChild(badge);
    });
  }

  function showNotice(name,cost,sender){
    var sec=activeVideoSection();
    if(!sec)return;
    var old=sec.querySelector('.kt-video-gift-toast');
    if(old)old.remove();
    var giver=currentGiver(sender);
    var c=parseInt(cost||0,10)||0;
    var detail=esc(name||'선물');
    if(c>0)detail+=' <strong>'+c.toLocaleString('ko-KR')+'개</strong>';
    var toast=document.createElement('div');
    toast.className='kt-video-gift-toast';
    toast.innerHTML='<div class="kt-video-gift-avatar">🎁</div><div><b>'+esc(giver)+'님이 선물했어요</b><span>'+detail+'</span></div>';
    sec.appendChild(toast);
    requestAnimationFrame(function(){toast.classList.add('show');});
    setTimeout(function(){toast.classList.remove('show');},2800);
    setTimeout(function(){if(toast.parentNode)toast.remove();},3400);
  }

  var style=document.createElement('style');
  style.id='ktVideoGiftBenefitStyle';
  style.textContent=''
    +'.kt-video-rose-rate{position:absolute;left:12px;top:62px;z-index:18;display:flex;align-items:center;gap:5px;padding:5px 9px;border-radius:999px;background:rgba(12,8,18,.74);border:1px solid rgba(255,90,160,.55);color:#fff;box-shadow:0 0 10px rgba(255,55,145,.28);pointer-events:none}'
    +'.kt-video-rose-rate span{font-size:14px}.kt-video-rose-rate b{font-size:10px;font-weight:900;white-space:nowrap}'
    +'.kt-video-gift-toast{position:absolute;left:12px;right:74px;bottom:120px;z-index:40;display:flex;align-items:center;gap:9px;padding:9px 11px;border-radius:15px;background:linear-gradient(90deg,rgba(84,19,92,.94),rgba(24,17,39,.92));border:1px solid rgba(255,110,207,.72);box-shadow:0 8px 24px rgba(0,0,0,.35),0 0 14px rgba(255,73,188,.3);color:#fff;opacity:0;transform:translateY(12px);transition:.2s ease;pointer-events:none}'
    +'.kt-video-gift-toast.show{opacity:1;transform:translateY(0)}'
    +'.kt-video-gift-avatar{width:34px;height:34px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.12);font-size:20px;flex:0 0 34px}'
    +'.kt-video-gift-toast b{display:block;font-size:12px;font-weight:950;color:#ffd95e}.kt-video-gift-toast span{display:block;margin-top:2px;font-size:11px;font-weight:800;color:#fff}.kt-video-gift-toast strong{color:#ff8fd1}'
    +'@media(max-width:390px){.kt-video-rose-rate{top:56px;left:9px;padding:4px 7px}.kt-video-rose-rate b{font-size:9px}.kt-video-gift-toast{left:8px;right:66px;bottom:112px;padding:8px 9px}}';
  document.head.appendChild(style);

  function hookGiftSend(){
    var old=window.giftSend;
    if(typeof old!=='function'||old.__ktVideoGiftHook)return false;
    var wrapped=function(name,cost,sender){
      var r=old.apply(this,arguments);
      setTimeout(function(){showNotice(name,cost,sender);},60);
      return r;
    };
    wrapped.__ktVideoGiftHook=true;
    window.giftSend=wrapped;
    return true;
  }

  var tries=0;
  var timer=setInterval(function(){
    tries++;
    hookGiftSend();
    ensureRateBadge();
    if(tries>40)clearInterval(timer);
  },250);

  if('MutationObserver' in window){
    var ob=new MutationObserver(function(){ensureRateBadge();hookGiftSend();});
    var host=document.getElementById('screen');
    if(host)ob.observe(host,{childList:true,subtree:true});
  }

  window.ktShowVideoGiftNotice=showNotice;
  setTimeout(function(){ensureRateBadge();hookGiftSend();},0);
})();
