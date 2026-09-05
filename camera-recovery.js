/* K-Talk LIVE: apply ONLY the approved reference layout to solo / 13-person / subscriber live rooms. */
(function(){
  window.__ktCameraRecoveryLoaded=true;
  if(window.__ktApprovedReferenceLayoutLoaded)return;
  window.__ktApprovedReferenceLayoutLoaded=true;

  function roomType(){
    var t='';
    try{t=(window.state&&state.liveRoomType)||'';}catch(e){}
    if(t==='group13'||t==='general')t='group';
    return t;
  }
  function allowed(){var t=roomType();return t==='solo'||t==='group'||t==='subscriber';}
  function roomName(){var t=roomType();return t==='group'?'13명 방송':(t==='subscriber'?'구독자 방송':'1인 방송');}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

  function css(){
    if(document.getElementById('ktApprovedReferenceCss'))return;
    var st=document.createElement('style');
    st.id='ktApprovedReferenceCss';
    st.textContent='\
#ktSept2Live.kt-ref-layout{overflow:hidden!important;background:#000!important;}\
#ktSept2Live.kt-ref-layout #ktLiveVideo{position:absolute!important;inset:0!important;left:0!important;right:0!important;top:0!important;bottom:0!important;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;object-fit:cover!important;object-position:50% 50%!important;border-radius:0!important;}\
#ktSept2Live.kt-ref-layout .kt-s2-shade{inset:0!important;}\
#ktSept2Live.kt-ref-layout .kt-s2-top{left:12px!important;right:12px!important;top:12px!important;z-index:40!important;display:block!important;}\
#ktSept2Live.kt-ref-layout .kt-s2-title{height:70px!important;min-height:70px!important;padding:7px 13px!important;border-radius:18px!important;border:1px solid rgba(255,255,255,.18)!important;background:rgba(7,7,10,.66)!important;backdrop-filter:blur(5px)!important;display:flex!important;align-items:center!important;justify-content:space-between!important;}\
#ktSept2Live.kt-ref-layout .kt-ref-status{display:grid;gap:2px;line-height:1.02;}\
#ktSept2Live.kt-ref-layout .kt-ref-room{font-size:19px;font-weight:950;color:#fff;white-space:nowrap;}\
#ktSept2Live.kt-ref-layout .kt-ref-air{font-size:14px;font-weight:950;color:#ff4770;white-space:nowrap;}\
#ktSept2Live.kt-ref-layout .kt-ref-air strong{color:#fff;margin-left:6px;font-variant-numeric:tabular-nums;}\
#ktSept2Live.kt-ref-layout .kt-ref-brand{color:#ff6386!important;font-size:18px!important;font-weight:950!important;white-space:nowrap;}\
#ktSept2Live.kt-ref-layout .kt-live-guests{margin-top:4px!important;padding:2px 3px!important;}\
#ktSept2Live.kt-ref-layout .kt-ref-attendance-big{position:absolute;left:8px;right:8px;top:108px;height:54px;z-index:39;border:2px solid #ff35c8;border-radius:22px;background:linear-gradient(180deg,rgba(33,14,31,.96),rgba(8,4,10,.96));box-shadow:0 0 12px #ff2fc4,0 0 28px #ff2fc477,inset 0 0 18px #d3238a44;display:flex;align-items:center;justify-content:center;overflow:hidden;color:#ffc43d;font-size:19px;font-weight:950;text-shadow:0 0 8px #ff9c00;}\
#ktSept2Live.kt-ref-layout .kt-ref-attendance-big:before{content:"";position:absolute;inset:5px;border-radius:15px;background-image:radial-gradient(circle,#ff43c9 1.7px,transparent 1.9px);background-size:12px 12px;opacity:.8;}\
#ktSept2Live.kt-ref-layout .kt-ref-attendance-big span{position:relative;z-index:2;padding:0 16px;background:rgba(16,7,17,.88);}\
#ktSept2Live.kt-ref-layout .kt-attendance-wrap{position:absolute!important;left:50%!important;right:auto!important;top:168px!important;bottom:auto!important;transform:translateX(-50%)!important;width:auto!important;margin:0!important;z-index:41!important;}\
#ktSept2Live.kt-ref-layout .kt-attendance-heart{min-width:138px!important;height:38px!important;padding:0 12px!important;border:2px solid #ff35c8!important;border-radius:18px!important;background:rgba(20,7,19,.94)!important;box-shadow:0 0 9px #ff35c8,0 0 18px #ff35c866!important;color:#ffc43d!important;font-size:13px!important;font-weight:950!important;display:flex!important;align-items:center!important;justify-content:center!important;}\
#ktSept2Live.kt-ref-layout .kt-attendance-heart .kt-attendance-sub,#ktSept2Live.kt-ref-layout .kt-attendance-heart .kt-attendance-miniheart{display:none!important;}\
#ktSept2Live.kt-ref-layout .kt-attendance-label{font-size:13px!important;color:#ffc43d!important;}\
#ktSept2Live.kt-ref-layout.kt-ref-group .kt-ref-attendance-big,#ktSept2Live.kt-ref-layout.kt-ref-subscriber .kt-ref-attendance-big{top:148px;}\
#ktSept2Live.kt-ref-layout.kt-ref-group .kt-attendance-wrap,#ktSept2Live.kt-ref-layout.kt-ref-subscriber .kt-attendance-wrap{top:208px!important;}\
#ktSept2Live.kt-ref-layout .kt-s2-right{position:absolute!important;right:10px!important;bottom:238px!important;z-index:44!important;display:grid!important;gap:9px!important;}\
#ktSept2Live.kt-ref-layout .kt-s2-like{width:58px!important;min-height:68px!important;border-radius:20px!important;}\
#ktSept2Live.kt-ref-layout .kt-s2-circle{width:58px!important;height:58px!important;}\
#ktSept2Live.kt-ref-layout #myEarnHud.kt-ref-earn{position:absolute!important;left:50%!important;right:auto!important;top:auto!important;bottom:184px!important;transform:translateX(-50%)!important;width:220px!important;z-index:45!important;margin:0!important;padding:8px 12px!important;border-radius:22px!important;background:linear-gradient(135deg,rgba(45,31,6,.90),rgba(24,17,28,.94))!important;}\
#ktSept2Live.kt-ref-layout .kt-ref-gifts{position:absolute;left:0;right:0;bottom:78px;height:100px;z-index:43;background:#020204;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:2px;padding:4px 3px;border-top:1px solid rgba(255,255,255,.18);border-bottom:1px solid rgba(255,255,255,.12);box-sizing:border-box;}\
#ktSept2Live.kt-ref-layout .kt-ref-gift{min-width:0;border:1px solid rgba(255,255,255,.20);border-radius:8px;background:linear-gradient(180deg,#0b0b0e,#030304);color:#fff;padding:3px 1px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;}\
#ktSept2Live.kt-ref-layout .kt-ref-gift img{width:44px;height:44px;object-fit:contain;display:block;}\
#ktSept2Live.kt-ref-layout .kt-ref-gift .emoji{height:44px;display:flex;align-items:center;justify-content:center;font-size:32px;line-height:1;}\
#ktSept2Live.kt-ref-layout .kt-ref-gift b{font-size:10px;color:#ffd84a;line-height:1.05;margin-top:2px;white-space:nowrap;}\
#ktSept2Live.kt-ref-layout .kt-ref-gift small{font-size:8px;color:#fff;line-height:1.05;margin-top:2px;white-space:nowrap;}\
#ktSept2Live.kt-ref-layout .kt-s2-bottom{display:none!important;}\
@media(max-width:430px){#ktSept2Live.kt-ref-layout .kt-ref-attendance-big{top:106px;height:52px;font-size:18px;}#ktSept2Live.kt-ref-layout .kt-attendance-wrap{top:164px!important;}#ktSept2Live.kt-ref-layout.kt-ref-group .kt-ref-attendance-big,#ktSept2Live.kt-ref-layout.kt-ref-subscriber .kt-ref-attendance-big{top:146px;}#ktSept2Live.kt-ref-layout.kt-ref-group .kt-attendance-wrap,#ktSept2Live.kt-ref-layout.kt-ref-subscriber .kt-attendance-wrap{top:204px!important;}#ktSept2Live.kt-ref-layout .kt-ref-gifts{height:96px;}#ktSept2Live.kt-ref-layout #myEarnHud.kt-ref-earn{bottom:180px!important;width:210px!important;}#ktSept2Live.kt-ref-layout .kt-s2-right{bottom:232px!important;}#ktSept2Live.kt-ref-layout .kt-ref-gift img{width:41px;height:41px;}#ktSept2Live.kt-ref-layout .kt-ref-gift .emoji{height:41px;font-size:30px;}}\
';
    document.head.appendChild(st);
  }

  function gift(icon,label,count,action,img){
    var art=img?'<img src="'+icon+'" alt="">':'<span class="emoji">'+icon+'</span>';
    return '<button type="button" class="kt-ref-gift" onclick="'+action+'">'+art+'<b>'+esc(count)+'</b><small>'+esc(label)+'</small></button>';
  }

  function clocks(){
    var now=Date.now();
    document.querySelectorAll('#ktSept2Live.kt-ref-layout .kt-ref-time').forEach(function(el){
      var live=el.closest('#ktSept2Live');
      var start=Number(live&&live.dataset.ktRefStart||now);
      var sec=Math.max(0,Math.floor((now-start)/1000));
      var h=String(Math.floor(sec/3600)).padStart(2,'0');
      var m=String(Math.floor((sec%3600)/60)).padStart(2,'0');
      var s=String(sec%60).padStart(2,'0');
      el.textContent=h+':'+m+':'+s;
    });
  }

  function apply(){
    var live=document.getElementById('ktSept2Live');
    if(!live||!allowed()||live.dataset.ktRefApplied==='1')return;
    live.dataset.ktRefApplied='1';
    live.dataset.ktRefStart=String(Date.now());
    css();
    live.classList.add('kt-ref-layout','kt-ref-'+roomType());

    var video=live.querySelector('#ktLiveVideo');
    if(video){
      video.style.setProperty('position','absolute','important');
      video.style.setProperty('inset','0','important');
      video.style.setProperty('width','100%','important');
      video.style.setProperty('height','100%','important');
      video.style.setProperty('max-width','none','important');
      video.style.setProperty('object-fit','cover','important');
      video.style.setProperty('object-position','50% 50%','important');
      video.style.setProperty('border-radius','0','important');
    }

    var title=live.querySelector('.kt-s2-title');
    if(title){
      title.innerHTML='<div class="kt-ref-status"><div class="kt-ref-room">🔴 '+esc(roomName())+'</div><div class="kt-ref-air">● ON AIR <strong class="kt-ref-time">00:00:00</strong></div></div><span class="kt-ref-brand">K-Talk LIVE</span>';
    }

    var big=document.createElement('div');
    big.className='kt-ref-attendance-big';
    big.innerHTML='<span>🪽 출석체크 💗 🪽</span>';
    live.appendChild(big);

    var aw=live.querySelector('.kt-attendance-wrap');
    var ab=live.querySelector('#ktAttendanceHeart');
    if(aw&&ab){
      var label=ab.querySelector('.kt-attendance-label');
      if(label)label.textContent='🪽 출석체크 💗 🪽';
      live.appendChild(aw);
    }

    var earn=live.querySelector('#myEarnHud');
    if(earn){earn.classList.add('kt-ref-earn');live.appendChild(earn);}

    var gifts=document.createElement('div');
    gifts.className='kt-ref-gifts';
    gifts.innerHTML=''
      +gift('rose-single.svg','장미','1개',"if(window.giftSend)giftSend('장미','1');else if(window.openGifts)openGifts();",true)
      +gift('rose-bouquet-50.svg','장미다발','50개',"if(window.giftSend)giftSend('장미다발','50');else if(window.openGifts)openGifts();",true)
      +gift('rose-bouquet-100.svg','특대장미','100개',"if(window.giftSend)giftSend('특대장미','100');else if(window.openGifts)openGifts();",true)
      +gift('💗','하트','10개',"if(window.giftSend)giftSend('하트','10');else if(window.openGifts)openGifts();",false)
      +gift('👑','왕관','100개',"if(window.giftSend)giftSend('왕관','100');else if(window.openGifts)openGifts();",false)
      +gift('🏎️','스포츠카','50개',"if(window.giftSend)giftSend('스포츠카','50');else if(window.openGifts)openGifts();",false)
      +gift('gift-box.svg','선물상자','큰 선물 보기',"if(window.openGifts)openGifts();",true);
    live.appendChild(gifts);

    clocks();
  }

  var mo=new MutationObserver(function(){setTimeout(apply,0);});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('load',function(){setTimeout(apply,120);});
  document.addEventListener('click',function(){setTimeout(apply,80);},true);
  setInterval(clocks,1000);
  setTimeout(apply,250);
})();
