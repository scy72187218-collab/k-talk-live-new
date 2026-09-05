/* K-Talk: keep all other screens untouched; match only solo / 13-person / subscriber LIVE overlays to the approved reference. */
(function(){
  window.__ktCameraRecoveryLoaded=true;
  if(window.__ktLastChanceUiLoaded)return;
  window.__ktLastChanceUiLoaded=true;

  function type(){
    var t='';
    try{t=(window.state&&state.liveRoomType)||'';}catch(e){}
    if(t==='group13'||t==='general')t='group';
    return t;
  }
  function allowed(){var t=type();return t==='solo'||t==='group'||t==='subscriber';}
  function roomLabel(){var t=type();return t==='group'?'13명 방송':(t==='subscriber'?'구독자 방송':'1인 방송');}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

  function addCss(){
    if(document.getElementById('ktLastChanceCss'))return;
    var s=document.createElement('style');
    s.id='ktLastChanceCss';
    s.textContent='\
#ktSept2Live.kt-lc-ui{overflow:hidden!important;background:#050309!important;}\
#ktSept2Live.kt-lc-ui #ktLiveVideo{position:absolute!important;inset:0!important;left:0!important;right:0!important;top:0!important;bottom:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;object-position:50% 50%!important;border-radius:0!important;transform:scaleX(-1)!important;}\
#ktSept2Live.kt-lc-ui .kt-s2-top{left:10px!important;right:10px!important;top:12px!important;gap:5px!important;z-index:30!important;}\
#ktSept2Live.kt-lc-ui .kt-s2-title{min-height:52px!important;padding:0!important;border:0!important;border-radius:0!important;background:transparent!important;box-shadow:none!important;backdrop-filter:none!important;display:flex!important;align-items:flex-start!important;justify-content:space-between!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-status{display:grid!important;gap:2px!important;line-height:1.05!important;min-width:205px!important;padding:8px 13px!important;border-radius:22px!important;background:rgba(8,8,12,.70)!important;border:1px solid rgba(255,255,255,.18)!important;box-shadow:0 2px 10px rgba(0,0,0,.24)!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-room{font-size:18px!important;font-weight:950!important;color:#fff!important;white-space:nowrap!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-air{font-size:14px!important;font-weight:950!important;color:#ff4f79!important;white-space:nowrap!important;font-variant-numeric:tabular-nums!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-air strong{color:#fff!important;margin-left:5px!important;}\
#ktSept2Live.kt-lc-ui .kt-s2-title>.kt-lc-brand{margin-left:auto!important;margin-top:11px!important;margin-right:8px!important;color:#ff6788!important;font-size:18px!important;font-weight:950!important;white-space:nowrap!important;text-shadow:0 1px 5px rgba(0,0,0,.45)!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-marquee{position:absolute!important;left:7px!important;right:7px!important;top:76px!important;height:36px!important;z-index:29!important;border:2px solid #ff35c8!important;border-radius:18px!important;background:linear-gradient(180deg,#21101fef,#09060bea)!important;box-shadow:0 0 10px #ff2fc4,0 0 22px #ff2fc466,inset 0 0 14px #d3238a44!important;display:flex!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;color:#ffc53d!important;font-size:18px!important;font-weight:950!important;text-shadow:0 0 7px #ff9c00!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-marquee:before,#ktSept2Live.kt-lc-ui .kt-lc-marquee:after{content:""!important;position:absolute!important;inset:4px!important;border-radius:13px!important;background-image:radial-gradient(circle,#ff43c9 1.5px,transparent 1.8px)!important;background-size:12px 12px!important;opacity:.74!important;pointer-events:none!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-marquee span{position:relative!important;z-index:2!important;padding:0 18px!important;background:#120914d9!important;}\
#ktSept2Live.kt-lc-ui .kt-attendance-wrap{position:absolute!important;left:50%!important;right:auto!important;top:118px!important;bottom:auto!important;transform:translateX(-50%)!important;width:auto!important;z-index:31!important;margin:0!important;}\
#ktSept2Live.kt-lc-ui .kt-attendance-heart{min-width:132px!important;height:30px!important;padding:0 10px!important;border:2px solid #ff35c8!important;border-radius:16px!important;background:#160a16ee!important;box-shadow:0 0 8px #ff35c8,0 0 14px #ff35c855!important;color:#ffc53d!important;font-size:12px!important;font-weight:950!important;display:flex!important;align-items:center!important;justify-content:center!important;}\
#ktSept2Live.kt-lc-ui .kt-attendance-heart .kt-attendance-sub,#ktSept2Live.kt-lc-ui .kt-attendance-heart .kt-attendance-miniheart{display:none!important;}\
#ktSept2Live.kt-lc-ui .kt-attendance-label{font-size:12px!important;color:#ffc53d!important;white-space:nowrap!important;}\
#ktSept2Live.kt-lc-ui.kt-lc-group .kt-lc-marquee,#ktSept2Live.kt-lc-ui.kt-lc-subscriber .kt-lc-marquee{top:120px!important;}\
#ktSept2Live.kt-lc-ui.kt-lc-group .kt-attendance-wrap,#ktSept2Live.kt-lc-ui.kt-lc-subscriber .kt-attendance-wrap{top:162px!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-gifts{position:absolute!important;left:0!important;right:0!important;bottom:78px!important;height:102px!important;z-index:32!important;background:#030305!important;display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:2px!important;padding:4px 3px!important;border-top:1px solid rgba(255,255,255,.18)!important;border-bottom:1px solid rgba(255,255,255,.12)!important;box-sizing:border-box!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-gift{min-width:0!important;border:1px solid rgba(255,255,255,.20)!important;border-radius:8px!important;background:linear-gradient(180deg,#0b0b0e,#030304)!important;color:#fff!important;padding:3px 1px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;overflow:hidden!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-gift img{width:46px!important;height:46px!important;object-fit:contain!important;display:block!important;filter:drop-shadow(0 2px 4px #000)!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-gift .kt-lc-emoji{height:46px!important;display:flex!important;align-items:center!important;justify-content:center!important;font-size:34px!important;line-height:1!important;filter:drop-shadow(0 2px 4px #000)!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-gift b{font-size:10px!important;color:#ffd84a!important;line-height:1.05!important;margin-top:2px!important;white-space:nowrap!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-gift small{font-size:8px!important;color:#fff!important;line-height:1.05!important;margin-top:2px!important;white-space:nowrap!important;}\
#ktSept2Live.kt-lc-ui .kt-lc-gift:last-child small{color:#ff69c9!important;}\
#ktSept2Live.kt-lc-ui #myEarnHud.kt-lc-earn{position:absolute!important;left:50%!important;right:auto!important;top:auto!important;bottom:186px!important;transform:translateX(-50%)!important;width:220px!important;z-index:33!important;margin:0!important;padding:8px 12px!important;border-radius:22px!important;background:linear-gradient(135deg,#2b2209df,#1a1420e8)!important;}\
#ktSept2Live.kt-lc-ui .kt-s2-right{right:10px!important;bottom:212px!important;z-index:34!important;}\
#ktSept2Live.kt-lc-ui .kt-s2-bottom{display:none!important;}\
@media(max-width:430px){#ktSept2Live.kt-lc-ui .kt-lc-gifts{height:96px!important;bottom:78px!important;}#ktSept2Live.kt-lc-ui #myEarnHud.kt-lc-earn{bottom:178px!important;width:210px!important;}#ktSept2Live.kt-lc-ui .kt-s2-right{bottom:205px!important;}#ktSept2Live.kt-lc-ui .kt-lc-gift img{width:42px!important;height:42px!important;}#ktSept2Live.kt-lc-ui .kt-lc-gift .kt-lc-emoji{height:42px!important;font-size:31px!important;}}\
';
    document.head.appendChild(s);
  }

  function giftButton(icon,label,count,action,isImg){
    var art=isImg?'<img src="'+icon+'" alt="">':'<span class="kt-lc-emoji">'+icon+'</span>';
    return '<button class="kt-lc-gift" type="button" onclick="'+action+'">'+art+'<b>'+esc(count)+'</b><small>'+esc(label)+'</small></button>';
  }

  function updateClocks(){
    var now=Date.now();
    document.querySelectorAll('#ktSept2Live.kt-lc-ui .kt-lc-time').forEach(function(el){
      var live=el.closest('#ktSept2Live');
      var start=Number(live&&live.dataset.ktLcStart||now);
      var sec=Math.max(0,Math.floor((now-start)/1000));
      var h=String(Math.floor(sec/3600)).padStart(2,'0');
      var m=String(Math.floor((sec%3600)/60)).padStart(2,'0');
      var ss=String(sec%60).padStart(2,'0');
      el.textContent=h+':'+m+':'+ss;
    });
  }

  function enforceVideo(live){
    var v=live&&live.querySelector('#ktLiveVideo');
    if(!v)return;
    v.style.setProperty('position','absolute','important');
    v.style.setProperty('inset','0','important');
    v.style.setProperty('width','100%','important');
    v.style.setProperty('height','100%','important');
    v.style.setProperty('max-width','none','important');
    v.style.setProperty('max-height','none','important');
    v.style.setProperty('object-fit','cover','important');
    v.style.setProperty('object-position','50% 50%','important');
    v.style.setProperty('border-radius','0','important');
  }

  function apply(){
    var live=document.getElementById('ktSept2Live');
    if(!live||!allowed())return;
    if(live.dataset.ktLcApplied==='1'){enforceVideo(live);return;}
    live.dataset.ktLcApplied='1';
    live.dataset.ktLcStart=String(Date.now());
    addCss();
    live.classList.add('kt-lc-ui','kt-lc-'+type());

    var title=live.querySelector('.kt-s2-title');
    if(title){
      title.innerHTML='<div class="kt-lc-status"><div class="kt-lc-room">🔴 '+esc(roomLabel())+'</div><div class="kt-lc-air">● ON AIR <strong class="kt-lc-time">00:00:00</strong></div></div><span class="kt-lc-brand">K-Talk LIVE</span>';
    }

    var marquee=document.createElement('div');
    marquee.className='kt-lc-marquee';
    marquee.innerHTML='<span>🪽 출석체크 💗 🪽</span>';
    live.appendChild(marquee);

    var aw=live.querySelector('.kt-attendance-wrap');
    var ab=live.querySelector('#ktAttendanceHeart');
    if(aw&&ab){
      ab.innerHTML='<span class="kt-attendance-label">🪽 출석체크 💗 🪽</span>';
      live.appendChild(aw);
    }

    var earn=live.querySelector('#myEarnHud');
    if(earn){earn.classList.add('kt-lc-earn');live.appendChild(earn);}

    var gifts=document.createElement('div');
    gifts.className='kt-lc-gifts';
    gifts.innerHTML=''
      +giftButton('rose-single.svg','장미','1개',"if(window.giftSend)giftSend('장미','1');else if(window.openGifts)openGifts();",true)
      +giftButton('rose-bouquet-50.svg','장미다발','50개',"if(window.giftSend)giftSend('장미다발','50');else if(window.openGifts)openGifts();",true)
      +giftButton('rose-bouquet-100.svg','특대장미','100개',"if(window.giftSend)giftSend('특대장미','100');else if(window.openGifts)openGifts();",true)
      +giftButton('💗','하트','10개',"if(window.giftSend)giftSend('하트','10');else if(window.openGifts)openGifts();",false)
      +giftButton('👑','왕관','100개',"if(window.giftSend)giftSend('왕관','100');else if(window.openGifts)openGifts();",false)
      +giftButton('🏎️','스포츠카','50개',"if(window.giftSend)giftSend('스포츠카','50');else if(window.openGifts)openGifts();",false)
      +giftButton('gift-box.svg','선물상자','큰 선물 보기',"if(window.openGifts)openGifts();",true);
    live.appendChild(gifts);

    enforceVideo(live);
    setTimeout(function(){enforceVideo(live);},80);
    setTimeout(function(){enforceVideo(live);},250);
    updateClocks();
  }

  var mo=new MutationObserver(function(){setTimeout(apply,0);});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',function(){setTimeout(apply,120);});
  document.addEventListener('click',function(){setTimeout(apply,80);},true);
  setInterval(updateClocks,1000);
  setInterval(function(){var live=document.getElementById('ktSept2Live');if(live&&allowed())enforceVideo(live);},1200);
  setTimeout(apply,250);
})();
