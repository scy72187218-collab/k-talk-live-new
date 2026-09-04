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
#ktSoloHostLive{background:#000!important;}\
#ktSoloHostLive #ktSoloAttendance{display:none!important;}\
#ktSoloHostLive .kt-sa{position:absolute;z-index:30;color:#fff;font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;box-sizing:border-box;}\
#ktSoloHostLive .kt-sa button{font:inherit;color:inherit;}\
#ktSoloHostLive .kt-sa-top{left:10px;right:10px;top:max(8px,env(safe-area-inset-top));height:54px;display:flex;align-items:center;gap:8px;}\
#ktSoloHostLive .kt-sa-logo{font-size:18px;font-weight:950;white-space:nowrap;text-shadow:0 0 9px #ff4bb9;}\
#ktSoloHostLive .kt-sa-onair{margin-left:auto;padding:9px 13px;border:1px solid #ff4b77;border-radius:13px;background:#7b102eaa;box-shadow:0 0 13px #ff2d5570;font-weight:950;white-space:nowrap;}\
#ktSoloHostLive .kt-sa-att{border:1px solid #d177ff;border-radius:16px;background:#24112fcc;padding:9px 11px;box-shadow:0 0 14px #bf4cff77;font-weight:950;white-space:nowrap;}\
#ktSoloHostLive .kt-sa-close{width:42px;height:42px;border:0;border-radius:50%;background:#09090bcc;font-size:26px;font-weight:500;}\
#ktSoloHostLive .kt-sa-meta{left:12px;right:12px;top:max(70px,calc(env(safe-area-inset-top) + 66px));display:flex;align-items:center;gap:8px;}\
#ktSoloHostLive .kt-sa-host{max-width:48%;padding:7px 10px;border-radius:16px;background:#08080ba8;border:1px solid #ffffff1c;font-weight:900;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}\
#ktSoloHostLive .kt-sa-view{margin-left:auto;padding:7px 10px;border-radius:999px;background:#08080bbd;font-weight:900;}\
#ktSoloHostLive .kt-sa-clock{padding:7px 10px;border-radius:999px;background:#08080bbd;font-weight:950;font-variant-numeric:tabular-nums;}\
#ktSoloHostLive .kt-sa-led{left:50%;transform:translateX(-50%);top:max(116px,calc(env(safe-area-inset-top) + 112px));width:min(76vw,420px);padding:8px 12px;border:2px solid #7257ff;border-radius:15px;background:#0a0716c9;box-shadow:0 0 16px #5d42ff88;text-align:center;}\
#ktSoloHostLive .kt-sa-led-title{font-size:16px;font-weight:950;color:#ff66d7;text-shadow:0 0 10px #ff37ba;}\
#ktSoloHostLive .kt-sa-led-counts{display:flex;justify-content:center;gap:22px;margin-top:3px;font-size:14px;font-weight:950;}\
#ktSoloHostLive .kt-sa-led-counts b{color:#ffd84d;font-size:17px;}\
#ktSoloHostLive .kt-sa-right{right:10px;top:37%;display:flex;flex-direction:column;gap:8px;}\
#ktSoloHostLive .kt-sa-act{width:54px;min-height:54px;border:1px solid #ffffff3a;border-radius:50%;background:#09090bbf;display:grid;place-items:center;padding:5px;font-size:22px;font-weight:900;box-shadow:0 0 10px #0008;}\
#ktSoloHostLive .kt-sa-act small{display:block;font-size:9px;line-height:1;margin-top:-5px;}\
#ktSoloHostLive .kt-sa-chat{left:12px;right:78px;bottom:220px;display:flex;flex-direction:column;gap:5px;pointer-events:none;}\
#ktSoloHostLive .kt-sa-msg{align-self:flex-start;max-width:82%;padding:6px 9px;border-radius:14px;background:#0a0a0ab8;font-size:12px;font-weight:750;white-space:normal;}\
#ktSoloHostLive .kt-sa-eq{left:0;right:0;bottom:187px;height:33px;display:flex;align-items:end;justify-content:center;gap:3px;padding:0 9px;pointer-events:none;}\
#ktSoloHostLive .kt-sa-eq i{display:block;width:4px;border-radius:5px;background:linear-gradient(#ff46cd,#53d7ff,#ffe24c);box-shadow:0 0 7px currentColor;animation:ktSaEq 850ms ease-in-out infinite alternate;}\
@keyframes ktSaEq{from{height:8px}to{height:31px}}\
#ktSoloHostLive .kt-sa-input{left:12px;right:12px;bottom:139px;height:43px;display:flex;gap:7px;}\
#ktSoloHostLive .kt-sa-input input{min-width:0;flex:1;border:1px solid #ffffff48;border-radius:22px;background:#09090bb8;color:#fff;padding:0 15px;outline:0;font-size:13px;}\
#ktSoloHostLive .kt-sa-input button{width:43px;border:1px solid #ffffff48;border-radius:50%;background:#09090bb8;font-size:19px;}\
#ktSoloHostLive .kt-sa-gifts{left:8px;right:8px;bottom:70px;height:64px;display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:4px;}\
#ktSoloHostLive .kt-sa-gift{min-width:0;border:1px solid #ffffff2b;border-radius:10px;background:#09090bd9;padding:4px 2px;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:18px;line-height:1;}\
#ktSoloHostLive .kt-sa-gift b{font-size:10px;margin-top:3px;white-space:nowrap;}\
#ktSoloHostLive .kt-sa-gift em{font-size:9px;color:#ffd84d;font-style:normal;margin-top:2px;white-space:nowrap;}\
#ktSoloHostLive .kt-sa-nav{left:0;right:0;bottom:0;height:64px;background:#050507e8;border-top:1px solid #ffffff12;display:grid;grid-template-columns:repeat(5,1fr);align-items:center;padding-bottom:env(safe-area-inset-bottom);}\
#ktSoloHostLive .kt-sa-nav button{height:56px;border:0;background:transparent;display:flex;flex-direction:column;align-items:center;justify-content:center;font-size:19px;gap:2px;}\
#ktSoloHostLive .kt-sa-nav small{font-size:9px;font-weight:800;}\
#ktSoloHostLive .kt-sa-nav .start{font-size:31px;color:#fff;text-shadow:0 0 13px #8a63ff;}\
#ktSoloHostLive>div[style*="left: 12px"][style*="right: 12px"][style*="top: 12px"],\
#ktSoloHostLive>div[style*="left:12px"][style*="right:12px"][style*="top:12px"]{opacity:0!important;pointer-events:none!important;}\
#ktSoloHostLive #ktSoloLiveStatus{display:none!important;}\
';
    document.head.appendChild(st);
  }

  function makeEq(){
    var s='';
    for(var i=0;i<46;i++)s+='<i style="animation-delay:'+((i%9)*70)+'ms"></i>';
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
      +'<div class="kt-sa kt-sa-chat" id="ktSaChat"><div class="kt-sa-msg">💬 채팅 메시지가 여기에 표시됩니다.</div></div>'
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
