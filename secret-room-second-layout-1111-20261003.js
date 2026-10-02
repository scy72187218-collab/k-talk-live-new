/* Secret room only: reference-2 layout, password 1111. Do not touch other rooms. */
(function(){
  if(window.__ktSecretSecondLayout1111_20261003)return;
  window.__ktSecretSecondLayout1111_20261003=true;

  function ensureStyle(){
    if(document.getElementById('ktSecretSecondLayout1111Style'))return;
    var s=document.createElement('style');
    s.id='ktSecretSecondLayout1111Style';
    s.textContent=
      '#screen .ktsecret-room.kt-secret-ref2{gap:4px!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-main{flex:0 0 46%!important;min-height:0!important;overflow:hidden!important;border:2px solid #ff29c7!important;border-radius:12px!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-six-grid{position:absolute!important;inset:0!important;display:grid!important;grid-template-columns:minmax(0,1.35fr) minmax(0,.68fr) minmax(0,.68fr)!important;grid-template-rows:repeat(3,minmax(0,1fr))!important;gap:3px!important;padding:3px!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-slot.host{grid-column:1!important;grid-row:1 / 4!important;border-color:#ff2ac7!important;box-shadow:0 0 0 1px #ff2ac755 inset!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-slot:not(.host){min-height:0!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-wave{display:none!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-earn-row{right:8px!important;bottom:8px!important;z-index:35!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-lower{flex:1 1 auto!important;min-height:190px!important;display:grid!important;grid-template-columns:1.18fr .82fr!important;gap:5px!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-chat,'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-gifts{min-width:0!important;min-height:0!important;border:2px solid #ff29c7!important;border-radius:12px!important;background:#08080d!important;overflow:hidden!important;box-shadow:0 0 10px #ff29c733!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-tabs{height:34px!important;display:grid!important;grid-template-columns:repeat(4,1fr)!important;border-bottom:1px solid #ff29c766!important;background:#0c0b10!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-tabs span{display:grid!important;place-items:center!important;color:#ddd!important;font-size:10px!important;font-weight:900!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-tabs span:first-child{color:#fff!important;background:linear-gradient(90deg,#ff22bd,#b31fff)!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 #ktsecretChatList{position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;width:auto!important;height:calc(100% - 74px)!important;min-height:0!important;max-height:none!important;z-index:2!important;padding:6px 7px!important;pointer-events:auto!important;overflow:hidden!important;background:transparent!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-chatbar{height:40px!important;display:grid!important;grid-template-columns:minmax(0,1fr) 58px!important;gap:4px!important;padding:4px!important;border-top:1px solid #ff29c744!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-chatbar input{min-width:0!important;border:1px solid #3e7cff88!important;border-radius:9px!important;background:#0a111c!important;color:#fff!important;padding:0 8px!important;font-size:10px!important;outline:none!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-chatbar button{border:0!important;border-radius:9px!important;background:linear-gradient(135deg,#7b22ff,#e228ff)!important;color:#fff!important;font-weight:950!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-gifthead{height:34px!important;display:flex!important;align-items:center!important;justify-content:space-between!important;padding:0 8px!important;border-bottom:1px solid #ff29c766!important;color:#fff!important;font-size:12px!important;font-weight:950!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-gifts{position:relative!important;left:auto!important;right:auto!important;bottom:auto!important;z-index:2!important;height:calc(100% - 34px)!important;display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;grid-auto-rows:minmax(0,1fr)!important;gap:4px!important;padding:5px!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-gift{border:1px solid #ffce32aa!important;border-radius:8px!important;background:#0c0b10!important;justify-content:center!important;padding:3px!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-gift b{display:none!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-gift small{font-size:7px!important;margin-top:2px!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-gift img{height:31px!important;}'+
      '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-tools{flex:0 0 52px!important;}'+
      '@media(max-width:390px){'+
        '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-main{flex-basis:44%!important;}'+
        '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-lower{min-height:176px!important;grid-template-columns:1.16fr .84fr!important;}'+
        '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-tabs{height:31px!important;}'+
        '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-gifthead{height:31px!important;font-size:11px!important;}'+
        '#screen .ktsecret-room.kt-secret-ref2 #ktsecretChatList{height:calc(100% - 68px)!important;}'+
        '#screen .ktsecret-room.kt-secret-ref2 .ktsecret-ref2-chatbar{height:37px!important;}'+
      '}';
    document.head.appendChild(s);
  }

  function apply(){
    var room=document.querySelector('#screen .ktsecret-room');
    if(!room)return;
    ensureStyle();
    room.classList.add('kt-secret-ref2');

    var main=room.querySelector('.ktsecret-main');
    var tools=room.querySelector('.ktsecret-tools');
    var chat=room.querySelector('#ktsecretChatList');
    var gifts=room.querySelector('.ktsecret-gifts');
    if(!main||!tools||!chat||!gifts)return;

    var lower=room.querySelector('.ktsecret-ref2-lower');
    if(!lower){
      lower=document.createElement('div');
      lower.className='ktsecret-ref2-lower';

      var chatPanel=document.createElement('div');
      chatPanel.className='ktsecret-ref2-chat';
      chatPanel.innerHTML='<div class="ktsecret-ref2-tabs"><span>채팅</span><span>참가자</span><span>팬클럽</span><span>공지</span></div>';
      var bar=document.createElement('div');
      bar.className='ktsecret-ref2-chatbar';
      bar.innerHTML='<input id="ktsecretChatInput" maxlength="100" placeholder="메시지를 입력하세요..."><button type="button">전송</button>';
      bar.querySelector('button').onclick=function(){try{window.ktSecretSendChat&&window.ktSecretSendChat();}catch(e){}};
      bar.querySelector('input').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();try{window.ktSecretSendChat&&window.ktSecretSendChat();}catch(_e){}}});
      chatPanel.appendChild(chat);
      chatPanel.appendChild(bar);

      var giftPanel=document.createElement('div');
      giftPanel.className='ktsecret-ref2-gifts';
      giftPanel.innerHTML='<div class="ktsecret-ref2-gifthead"><span>🎁 선물 / 후원</span><span>후원 랭킹 ›</span></div>';
      giftPanel.appendChild(gifts);

      lower.appendChild(chatPanel);
      lower.appendChild(giftPanel);
      room.insertBefore(lower,tools);
    }else{
      var cp=lower.querySelector('.ktsecret-ref2-chat');
      var gp=lower.querySelector('.ktsecret-ref2-gifts');
      if(cp&&chat.parentElement!==cp)cp.insertBefore(chat,cp.querySelector('.ktsecret-ref2-chatbar'));
      if(gp&&gifts.parentElement!==gp)gp.appendChild(gifts);
    }

    gifts.querySelectorAll('b').forEach(function(b){b.style.setProperty('display','none','important');});
  }

  var mo=new MutationObserver(function(){setTimeout(apply,0);});
  try{mo.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  [0,80,220,500,1000,1800].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('pageshow',apply);
})();