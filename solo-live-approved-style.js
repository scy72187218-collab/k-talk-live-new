/* K-Talk: approved 1-person live room UI only. Other rooms are untouched. */
(function(){
  if(window.__ktSoloApprovedStyleLoaded)return;
  window.__ktSoloApprovedStyleLoaded=true;

  function isSolo(){
    try{return !!window.state && state.liveRoomType==='solo' && !!document.getElementById('ktSoloHostLive');}
    catch(e){return false;}
  }

  function esc(s){
    return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }

  function addStyle(){
    if(document.getElementById('ktSoloApprovedStyleCss'))return;
    var st=document.createElement('style');
    st.id='ktSoloApprovedStyleCss';
    st.textContent='\
#ktSoloHostLive{background:radial-gradient(circle at 25% 20%,#341033 0,transparent 34%),radial-gradient(circle at 78% 28%,#102d48 0,transparent 32%),#08050d!important;}\
#ktSoloHostLive #ktSoloAttendance{display:none!important;}\
#ktSoloHostLive .kt-sa{position:absolute;z-index:30;color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-sizing:border-box;}\
#ktSoloHostLive .kt-sa button{font:inherit;color:inherit;}\
#ktSoloHostLive .kt-sa-top{left:8px;right:8px;top:max(6px,env(safe-area-inset-top));height:46px;display:flex;align-items:center;gap:6px;}\
#ktSoloHostLive .kt-sa-logo{font-size:15px;font-weight:950;white-space:nowrap;text-shadow:0 0 8px #ff4bb9;}\
#ktSoloHostLive .kt-sa-onair{margin-left:auto;padding:7px 9px;border:1px solid #ff4b77;border-radius:12px;background:#7b102eaa;box-shadow:0 0 12px #ff2d5570;font-size:12px;font-weight:950;white-space:nowrap;}\
#ktSoloHostLive .kt-sa-att{border:1px solid #d177ff;border-radius:13px;background:#24112fcc;padding:7px 8px;box-shadow:0 0 12px #bf4cff77;font-size:11px;font-weight:950;white-space:nowrap;}\
#ktSoloHostLive .kt-sa-close{width:36px;height:36px;border:0;border-radius:50%;background:#09090bcc;font-size:22px;font-weight:500;}\
#ktSoloHostLive .kt-sa-meta{left:10px;right:10px;top:max(56px,calc(env(safe-area-inset-top) + 52px));display:flex;align-items:center;gap:6px;}\
#ktSoloHostLive .kt-sa-host{max-width:45%;padding:6px 8px;border-radius:14px;background:#08080ba8;border:1px solid #ffffff1c;font-size:11px;font-weight:900;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\
#ktSoloHostLive .kt-sa-view{margin-left:auto;padding:6px 8px;border-radius:999px;background:#08080bbd;font-size:11px;font-weight:900;}\
#ktSoloHostLive .kt-sa-clock{padding:6px 8px;border-radius:999px;background:#08080bbd;font-size:11px;font-weight:950;font-variant-numeric:tabular-nums;}\
#ktSoloHostLive .kt-sa-led{left:10px;right:72px;transform:none;top:max(91px,calc(env(safe-area-inset-top) + 87px));width:auto;padding:5px 8px;border:1px solid #7257ff;border-radius:11px;background:#0a071699;box-shadow:0 0 12px #5d42ff66;text-align:center;}\
#ktSoloHostLive .kt-sa-led-title{font-size:11px;line-height:1.15;font-weight:950;color:#ff66d7;text-shadow:0 0 8px #ff37ba;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}\
#ktSoloHostLive .kt-sa-led-counts{display:flex;justify-content:center;gap:12px;margin-top:2px;font-size:9px;line-height:1.1;font-weight:950;}\
#ktSoloHostLive .kt-sa-led-counts b{color:#ffd84d;font-size:11px;}\
#ktSoloHostLive .kt-sa-right{right:7px;top:40%;display:flex;flex-direction:column;gap:6px;}\
#ktSoloHostLive .kt-sa-act{width:46px;min-height:46px;border:1px solid #ffffff32;border-radius:50%;background:#09090ba8;display:grid;place-items:center;padding:4px;font-size:19px;font-weight:900;box-shadow:0 0 8px #0007;}\
#ktSoloHostLive .kt-sa-act small{display:block;font-size:8px;line-height:1;margin-top:-4px;}\
#ktSoloHostLive .kt-sa-chat{left:10px;right:68px;bottom:211px;display:flex;flex-direction:column;gap:4px;pointer-events:none;}\
#ktSoloHostLive .kt-sa-msg{align-self:flex-start;max-width:76%;padding:5px 8px;border-radius:12px;background:#0a0a0a9e;font-size:10px;font-weight:750;white-space:normal;}\
#ktSoloHostLive .kt-sa-eq{left:8px;right:8px;bottom:179px;height:24px;display:flex;align-items:center;justify-content:center;gap:1px;padding:0 3px;pointer-events:none;overflow:hidden;}\
#ktSoloHostLive .kt-sa-eq i{display:block;width:2px;border-radius:5px;background:linear-gradient(180deg,#ff59d7 0 25%,#56d9ff 25% 55%,#ffd64f 55% 100%);box-shadow:0 0 5px #7adfff99;animation:ktSaEq 680ms ease-in-out infinite alternate;}\
@keyframes ktSaEq{from{height:3px}to{height:19px}}\
#ktSoloHostLive .kt-sa-input{left:10px;right:66px;bottom:136px;height:39px;display:flex;gap:6px;}\
#ktSoloHostLive .kt-sa-input input{min-width:0;flex:1;border:1px solid #ffffff42;border-radius:20px;background:#09090b9f;color:#fff;padding:0 13px;outline:0;font-size:11px;}\
#ktSoloHostLive .kt-sa-input button{width:39px;border:1px solid #ffffff42;border-radius:50%;background:#09090b9f;font-size:17px;}\
#ktSoloHostLive .kt-sa-gifts{left:7px;right:7px;bottom:68px;height:60px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:3px;}\
#ktSoloHostLive .kt-sa-gift{min-width:0;border:1px solid #ffffff26;border-radius:9px;background:#09090bc9;padding:3px 1px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:16px;line-height:1;}\
#ktSoloHostLive .kt-sa-gift b{font-size:9px;margin-top:3px;white-space:nowrap;}\
#ktSoloHostLive .kt-sa-gift em{font-size:8px;color:#ffd84d;font-style:normal;margin-top:2px;white-space:nowrap;}\
#ktSoloHostLive .kt-sa-nav{left:0;right:0;bottom:0;height:60px;background:#050507e8;border-top:1px solid #ffffff12;display:grid;grid-template-columns:repeat(5,1fr);align-items:center;padding-bottom:env(safe-area-inset-bottom);}\
#ktSoloHostLive .kt-sa-nav button{height:52px;border:0;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:18px;gap:2px;}\
#ktSoloHostLive .kt-sa-nav small{font-size:8px;font-weight:800;}\
#ktSoloHostLive .kt-sa-nav .start{font-size:28px;color:#fff;text-shadow:0 0 12px #8a63ff;}\
#ktSoloHostLive>div[style*="left: 12px"][style*="right: 12px"][style*="top: 12px"],\
#ktSoloHostLive>div[style*="left:12px"][style*="right:12px"][style*="top:12px"]{opacity:0!important;pointer-events:none!important;}\
#ktSoloHostLive #ktSoloLiveStatus{display:none!important;}\
';
    document.head.appendChild(st);
  }

  function makeEq(){
    var s='';
    for(var i=0;i<84;i++)s+='<i style="animation-delay:'+((i%14)*42)+'ms"></i>';
    return s;
  }

  function roomTitle(){
    try{return esc((state.currentLiveRoomTitle||state.liveRoomName||'1인 방송').split(' · 후원계좌 ')[0]);}
    catch(e){return '1인 방송';}
  }

  function render(){
    if(!isSolo())return;
    addStyle();
    var host=document.getElementById('ktSoloHostLive');
    if(!host || document.getElementById('ktSoloApprovedUi'))return;

    var wrap=document.createElement('div');
    wrap.id='ktSoloApprovedUi';
    wrap.innerHTML=''
      +'<div class="kt-sa kt-sa-top">'
        +'<div class="kt-sa-logo">👑 K-Talk LIVE</div>'
        +'<div class="kt-sa-onair">● ON AIR</div>'
        +'<button class="kt-sa-att" type="button" onclick="if(window.openAttendanceBenefits)openAttendanceBenefits()">🪽 출석체크 ♥</button>'
        +'<button class="kt-sa-close" type="button" onclick="if(window.ktEndSoloHostLive)ktEndSoloHostLive()">×</button>'
      +'</div>'
      +'<div class="kt-sa kt-sa-meta">'
        +'<div class="kt-sa-host">👑 '+roomTitle()+'</div>'
        +'<div class="kt-sa-view">👁 <span id="ktSaViewCount">0</span></div>'
        +'<div class="kt-sa-clock" id="ktSaClock">00:00</div>'
      +'</div>'
      +'<div class="kt-sa kt-sa-led">'
        +'<div class="kt-sa-led-title">💖 K-Talk LIVE · 함께하는 즐거움 💖</div>'
        +'<div class="kt-sa-led-counts"><span>👑 왕관 <b>100개</b></span><span>🏎️ 스포츠카 <b>50개</b></span></div>'
      +'</div>'
      +'<div class="kt-sa kt-sa-right">'
        +'<button class="kt-sa-act" type="button" onclick="this.querySelector(\'small\').textContent=String((parseInt(this.querySelector(\'small\').textContent)||0)+1)">💗<small>0</small></button>'
        +'<button class="kt-sa-act" type="button" onclick="if(window.openComments)openComments()">💬<small>댓글</small></button>'
        +'<button class="kt-sa-act" type="button" onclick="if(window.shareApp)shareApp()">↗<small>공유</small></button>'
        +'<button class="kt-sa-act" type="button" onclick="if(window.openGifts)openGifts()">🎁<small>선물</small></button>'
        +'<button class="kt-sa-act" type="button" onclick="if(window.openSiteGuide)openSiteGuide()">•••<small>더보기</small></button>'
      +'</div>'
      +'<div class="kt-sa kt-sa-chat" id="ktSaChat"></div>'
      +'<div class="kt-sa kt-sa-eq">'+makeEq()+'</div>'
      +'<div class="kt-sa kt-sa-input"><input id="ktSaInput" type="text" maxlength="80" placeholder="메시지 입력..."><button type="button" id="ktSaSend">😊</button></div>'
      +'<div class="kt-sa kt-sa-gifts">'
        +'<button class="kt-sa-gift" type="button" onclick="if(window.giftSend)giftSend(\'장미\',\'1\')">🌹<b>장미</b><em>1개</em></button>'
        +'<button class="kt-sa-gift" type="button" onclick="if(window.giftSend)giftSend(\'장미다발\',\'50\')">💐<b>장미다발</b><em>50개</em></button>'
        +'<button class="kt-sa-gift" type="button" onclick="if(window.giftSend)giftSend(\'특대장미\',\'100\')">🌹<b>특대장미</b><em>100개</em></button>'
        +'<button class="kt-sa-gift" type="button" onclick="if(window.giftSend)giftSend(\'하트\',\'10\')">💖<b>하트</b><em>10개</em></button>'
        +'<button class="kt-sa-gift" type="button" onclick="if(window.giftSend)giftSend(\'왕관\',\'100\')">👑<b>왕관</b><em>100개</em></button>'
        +'<button class="kt-sa-gift" type="button" onclick="if(window.giftSend)giftSend(\'스포츠카\',\'50\')">🏎️<b>스포츠카</b><em>50개</em></button>'
        +'<button class="kt-sa-gift" type="button" onclick="if(window.openGifts)openGifts()">🎁<b>선물상자</b><em>더보기</em></button>'
      +'</div>'
      +'<div class="kt-sa kt-sa-nav">'
        +'<button type="button"><span>⌂</span><small>홈</small></button>'
        +'<button type="button" onclick="if(window.friends)friends()"><span>👥</span><small>친구</small></button>'
        +'<button type="button" class="start"><span>＋</span><small>방송하기</small></button>'
        +'<button type="button" onclick="if(window.openSiteGuide)openSiteGuide()"><span>?</span><small>사용방법</small></button>'
        +'<button type="button" onclick="if(window.openProfile)openProfile()"><span>♙</span><small>프로필</small></button>'
      +'</div>';
    host.appendChild(wrap);

    var input=document.getElementById('ktSaInput');
    var send=document.getElementById('ktSaSend');
    function sendLocal(){
      if(!input)return;
      var t=String(input.value||'').trim();
      if(!t)return;
      var c=document.getElementById('ktSaChat');
      if(c){
        var d=document.createElement('div');
        d.className='kt-sa-msg';
        d.textContent='나 · '+t;
        c.appendChild(d);
        while(c.children.length>4)c.removeChild(c.firstChild);
      }
      input.value='';
    }
    if(send)send.onclick=sendLocal;
    if(input)input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();sendLocal();}});

    function tick(){
      var started=0;
      try{started=Number(state.soloLiveStartedAt||0);}catch(e){}
      var el=document.getElementById('ktSaClock');
      if(!el)return;
      if(!started){el.textContent='준비';return;}
      var sec=Math.max(0,Math.floor((Date.now()-started)/1000));
      el.textContent=String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0');
    }
    tick();
    if(!window.__ktSaClockTimer)window.__ktSaClockTimer=setInterval(tick,1000);
  }

  function watch(){
    if(isSolo())render();
  }

  try{
    new MutationObserver(function(muts){
      for(var i=0;i<muts.length;i++){
        for(var j=0;j<muts[i].addedNodes.length;j++){
          var n=muts[i].addedNodes[j];
          if(n&&n.nodeType===1&&(n.id==='ktSoloHostLive'||(n.querySelector&&n.querySelector('#ktSoloHostLive')))){
            setTimeout(render,30);return;
          }
        }
      }
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setTimeout(watch,80);
})();