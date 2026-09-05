/* K-Talk LIVE: add only the missing live-screen UI from the approved reference.
   Phone status bar / browser navigation bars are intentionally NOT part of this code. */
(function(){
  if(window.__ktLiveScreenPhotoAdditionsLoaded)return;
  window.__ktLiveScreenPhotoAdditionsLoaded=true;

  function isMobile(){
    return !window.matchMedia || window.matchMedia('(max-width: 767px)').matches;
  }

  function isLiveScreen(){
    if(!isMobile())return false;
    return !!(document.getElementById('ktLiveVideo') && document.getElementById('myEarnHud'));
  }

  function ensureStyle(){
    if(document.getElementById('ktLivePhotoAdditionsStyle'))return;
    var st=document.createElement('style');
    st.id='ktLivePhotoAdditionsStyle';
    st.textContent=`
      .kt-live-attendance{
        position:fixed!important;
        left:50%!important;
        top:72px!important;
        transform:translateX(-50%)!important;
        z-index:10020!important;
        border:0!important;
        background:transparent!important;
        color:#ffd432!important;
        font-weight:950!important;
        font-size:14px!important;
        white-space:nowrap!important;
        display:flex!important;
        align-items:center!important;
        gap:4px!important;
        text-shadow:0 0 6px #ff38d1,0 0 10px #8b2dff!important;
      }
      .kt-live-attendance .badge{
        padding:5px 13px!important;
        border-radius:999px!important;
        background:rgba(24,5,25,.82)!important;
        border:2px solid #ff47dd!important;
        box-shadow:0 0 0 2px rgba(255,53,214,.18),0 0 10px #ff33cc,inset 0 0 10px rgba(255,42,220,.22)!important;
      }
      .kt-live-attendance .wing{
        color:#7bdfff!important;
        font-size:17px!important;
        line-height:1!important;
        filter:drop-shadow(0 0 4px #ff46db)!important;
      }
      .kt-live-attendance .heart{color:#ff3b75!important;margin-left:2px!important}

      #ktLiveAttendanceLarge{
        position:fixed!important;
        left:12px!important;
        right:12px!important;
        top:108px!important;
        z-index:10019!important;
        height:42px!important;
        border:2px solid #ff42da!important;
        border-radius:999px!important;
        background:
          radial-gradient(circle,#ff62ee 1.5px,transparent 2px) 0 0/13px 13px,
          rgba(29,3,27,.88)!important;
        color:#ffd128!important;
        font:950 22px/1 system-ui,-apple-system,'Noto Sans KR',sans-serif!important;
        letter-spacing:-1px!important;
        display:flex!important;
        align-items:center!important;
        justify-content:center!important;
        gap:8px!important;
        box-shadow:0 0 7px #ff4ae2,0 0 17px rgba(255,45,206,.85),inset 0 0 12px rgba(255,55,218,.45)!important;
        text-shadow:0 0 5px #ff3ed6!important;
      }
      #ktLiveAttendanceLarge .w{color:#80ddff;font-size:19px;filter:drop-shadow(0 0 4px #ff49d9)}
      #ktLiveAttendanceLarge .h{color:#ff3f70;font-size:22px;filter:drop-shadow(0 0 4px #ff4bcf)}

      #ktLiveGiftRail{
        position:fixed!important;
        left:0!important;
        right:0!important;
        bottom:68px!important;
        z-index:10018!important;
        height:96px!important;
        display:grid!important;
        grid-template-columns:repeat(7,minmax(74px,1fr))!important;
        gap:3px!important;
        padding:4px 3px 5px!important;
        overflow-x:auto!important;
        overflow-y:hidden!important;
        background:rgba(1,1,4,.96)!important;
        border-top:1px solid rgba(255,255,255,.18)!important;
        border-bottom:1px solid rgba(255,255,255,.12)!important;
        -webkit-overflow-scrolling:touch!important;
        scrollbar-width:none!important;
      }
      #ktLiveGiftRail::-webkit-scrollbar{display:none!important}
      #ktLiveGiftRail .ktg{
        min-width:74px!important;
        height:86px!important;
        padding:2px 2px 3px!important;
        border:1px solid rgba(255,255,255,.25)!important;
        border-radius:7px!important;
        background:linear-gradient(180deg,#09090e,#020204)!important;
        color:#fff!important;
        display:flex!important;
        flex-direction:column!important;
        align-items:center!important;
        justify-content:flex-start!important;
        font-family:system-ui,-apple-system,'Noto Sans KR',sans-serif!important;
        box-shadow:inset 0 0 12px rgba(255,255,255,.025)!important;
      }
      #ktLiveGiftRail .art{
        width:52px!important;
        height:48px!important;
        display:block!important;
        overflow:hidden!important;
        flex:0 0 48px!important;
      }
      #ktLiveGiftRail .art svg{width:100%!important;height:100%!important;display:block!important}
      #ktLiveGiftRail .emoji{
        height:48px!important;
        display:grid!important;
        place-items:center!important;
        font-size:36px!important;
        line-height:1!important;
        filter:drop-shadow(0 0 8px rgba(255,49,210,.45))!important;
      }
      #ktLiveGiftRail .ktg b{
        display:block!important;
        margin-top:1px!important;
        color:#fff!important;
        font-size:10px!important;
        line-height:1.02!important;
        font-weight:950!important;
        white-space:nowrap!important;
      }
      #ktLiveGiftRail .ktg small{
        display:block!important;
        margin-top:2px!important;
        color:#f2f2f2!important;
        font-size:9px!important;
        line-height:1!important;
        font-weight:850!important;
        white-space:nowrap!important;
      }
      body.kt-live-photo-ui #myEarnHud{
        bottom:171px!important;
        width:172px!important;
        padding:7px 10px!important;
        border-color:#ffe07188!important;
      }
      body.kt-live-photo-ui #myEarnHud > div:first-child span{font-size:10px!important}
      body.kt-live-photo-ui #myEarnHud > div:first-child b{font-size:14px!important}
      body.kt-live-photo-ui #myEarnDetail{display:grid!important;font-size:10px!important;margin-top:4px!important}

      @media (max-width:390px){
        #ktLiveAttendanceLarge{left:8px!important;right:8px!important;top:106px!important;font-size:20px!important}
        #ktLiveGiftRail{grid-template-columns:repeat(7,minmax(69px,1fr))!important}
        #ktLiveGiftRail .ktg{min-width:69px!important}
      }
    `;
    document.head.appendChild(st);
  }

  function cropArt(viewBox,label){
    return '<span class="art" role="img" aria-label="'+label+'"><svg viewBox="'+viewBox+'" preserveAspectRatio="xMidYMid slice"><image href="gift-source.svg?v=1" width="864" height="1536"></image></svg></span>';
  }

  function callGift(name,count){
    try{
      if(typeof window.giftSend==='function'){
        window.giftSend(name,count);
        return;
      }
    }catch(e){}
    try{if(typeof window.openGifts==='function')window.openGifts();}catch(e){}
  }
  window.ktQuickGift=function(name,count){callGift(name,count);};

  function ensureLargeAttendance(){
    var old=document.getElementById('ktLiveAttendanceLarge');
    if(old)return old;
    var b=document.createElement('button');
    b.id='ktLiveAttendanceLarge';
    b.type='button';
    b.setAttribute('aria-label','출석체크');
    b.innerHTML='<span class="w">🪽</span><span>출석체크</span><span class="h">♥</span><span class="w">🪽</span>';
    b.onclick=function(){try{if(typeof window.openAttendanceBenefits==='function')window.openAttendanceBenefits();}catch(e){}};
    document.body.appendChild(b);
    return b;
  }

  function ensureGiftRail(){
    var rail=document.getElementById('ktLiveGiftRail');
    if(rail)return rail;
    rail=document.createElement('div');
    rail.id='ktLiveGiftRail';
    rail.setAttribute('aria-label','빠른 선물');
    rail.innerHTML=''
      +'<button class="ktg" type="button" onclick="ktQuickGift(\'장미\',1)">'+cropArt('175 205 125 130','장미')+'<b>1개</b><small>장미</small></button>'
      +'<button class="ktg" type="button" onclick="ktQuickGift(\'장미다발\',50)">'+cropArt('445 205 125 130','장미다발')+'<b>50개</b><small>장미다발</small></button>'
      +'<button class="ktg" type="button" onclick="ktQuickGift(\'특대장미\',100)">'+cropArt('445 205 125 130','특대장미')+'<b>100개</b><small>특대장미</small></button>'
      +'<button class="ktg" type="button" onclick="ktQuickGift(\'하트\',10)"><span class="emoji">💗</span><b>10개</b><small>하트</small></button>'
      +'<button class="ktg" type="button" onclick="ktQuickGift(\'왕관\',100)">'+cropArt('175 475 125 130','왕관')+'<b>100개</b><small>왕관</small></button>'
      +'<button class="ktg" type="button" onclick="ktQuickGift(\'스포츠카\',50)">'+cropArt('445 475 125 130','스포츠카')+'<b>50개</b><small>스포츠카</small></button>'
      +'<button class="ktg" type="button" onclick="if(window.openGifts)openGifts()"><span class="emoji">🎁</span><b>선물상자</b><small>큰 선물 보기</small></button>';
    document.body.appendChild(rail);
    return rail;
  }

  function cleanup(){
    document.body.classList.remove('kt-live-photo-ui');
    var a=document.getElementById('ktLiveAttendanceLarge');
    var r=document.getElementById('ktLiveGiftRail');
    if(a)a.remove();
    if(r)r.remove();
  }

  function apply(){
    ensureStyle();
    if(!isLiveScreen()){
      cleanup();
      return;
    }
    document.body.classList.add('kt-live-photo-ui');

    var small=document.querySelector('.kt-live-attendance');
    if(small){
      small.style.setProperty('display','flex','important');
      small.style.setProperty('visibility','visible','important');
    }

    ensureLargeAttendance();
    ensureGiftRail();
  }

  try{
    var obs=new MutationObserver(function(){setTimeout(apply,20);});
    obs.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',apply);
  setInterval(apply,900);
  setTimeout(apply,80);
})();
