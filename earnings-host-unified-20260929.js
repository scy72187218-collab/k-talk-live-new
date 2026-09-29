/* K-Talk 호스트 수익률 단일 통합본 2026-09-29
   적용: 1인방 / 9명방 / 13명방 / 구독자방 / 비밀방
   원칙: 호스트 화면만, 크기/두께/위치 모두 동일, 하단 버튼 바로 위 중앙.
   다른 수익률 위치 보정 스크립트는 index.html에서 제거한다. */
(function(){
  if(window.__ktHostEarningsUnified20260929)return;
  window.__ktHostEarningsUnified20260929=true;

  var W=92,H=44,GAP=6;

  function textOf(el,fallback){
    var t=String(el&&el.textContent||'').trim();
    return t||fallback;
  }

  function normalizeMarkup(hud,isSubscriber){
    if(!hud||hud.dataset.ktHostEarnMarkup==='1')return;

    var net=textOf(
      hud.querySelector(isSubscriber?'#ktSubscriberEarnNet':'#hudEarnNet'),
      '0원'
    );
    var roses=textOf(
      hud.querySelector(isSubscriber?'#ktSubscriberEarnRoses':'#hudEarnRoses'),
      '🌹 0송이'
    );

    if(isSubscriber){
      hud.innerHTML=''
        +'<div class="kt-he-top"><span>🔒 내 수익 · 본인만 표시</span><b id="ktSubscriberEarnNet">'+net+'</b></div>'
        +'<div id="ktSubscriberEarnDetail" class="kt-he-detail">'
          +'<span id="ktSubscriberEarnRoses">'+roses+'</span><span>일반회원 35%</span>'
          +'<span>구독자회원 40%</span><span>소속사 65%</span>'
        +'</div>';
    }else{
      hud.innerHTML=''
        +'<div class="kt-he-top"><span>🔒 내 수익 · 본인만 표시</span><b id="hudEarnNet">'+net+'</b></div>'
        +'<div id="myEarnDetail" class="kt-he-detail">'
          +'<span id="hudEarnRoses">'+roses+'</span><span id="hudEarnRate">일반회원 35%</span>'
          +'<span>구독자회원 40%</span><span>소속사 65%</span>'
        +'</div>';
    }
    hud.dataset.ktHostEarnMarkup='1';
  }

  function styleOne(wrapper,hud,tools,isSubscriber){
    if(!wrapper||!hud||!tools)return;
    var tr=tools.getBoundingClientRect();
    if(!tr.width)return;

    normalizeMarkup(hud,isSubscriber);

    var top=Math.max(8,Math.round(tr.top-H-GAP));
    [
      ['position','fixed'],['left','50%'],['right','auto'],
      ['top',top+'px'],['bottom','auto'],
      ['width',W+'px'],['min-width',W+'px'],['max-width',W+'px'],
      ['height',H+'px'],['min-height',H+'px'],['max-height',H+'px'],
      ['margin','0'],['padding','0'],
      ['transform','translateX(-50%)'],
      ['display','block'],['overflow','visible'],
      ['z-index','2147483000']
    ].forEach(function(p){wrapper.style.setProperty(p[0],p[1],'important');});

    [
      ['position','static'],['left','auto'],['right','auto'],['top','auto'],['bottom','auto'],
      ['width',W+'px'],['min-width',W+'px'],['max-width',W+'px'],
      ['height',H+'px'],['min-height',H+'px'],['max-height',H+'px'],
      ['margin','0'],['padding','3px 5px'],
      ['box-sizing','border-box'],
      ['border','1px solid rgba(210,169,54,.78)'],
      ['border-radius','10px'],
      ['background','linear-gradient(135deg,#17140b,#0d0d12)'],
      ['color','#fff'],['text-align','center'],
      ['overflow','hidden'],['transform','none'],
      ['transition','none'],['animation','none'],
      ['display','block'],['visibility','visible'],['opacity','1']
    ].forEach(function(p){hud.style.setProperty(p[0],p[1],'important');});

    var topRow=hud.querySelector('.kt-he-top');
    if(topRow){
      topRow.style.setProperty('display','flex','important');
      topRow.style.setProperty('align-items','center','important');
      topRow.style.setProperty('justify-content','center','important');
      topRow.style.setProperty('gap','3px','important');
      topRow.style.setProperty('white-space','nowrap','important');
      var label=topRow.querySelector('span');
      var amount=topRow.querySelector('b');
      if(label){
        label.style.setProperty('font-size','5.4px','important');
        label.style.setProperty('line-height','1','important');
        label.style.setProperty('font-weight','950','important');
        label.style.setProperty('color','#8fe8ff','important');
      }
      if(amount){
        amount.style.setProperty('font-size','8px','important');
        amount.style.setProperty('line-height','1','important');
        amount.style.setProperty('font-weight','950','important');
        amount.style.setProperty('color','#ffe071','important');
      }
    }

    var detail=hud.querySelector('.kt-he-detail');
    if(detail){
      detail.style.setProperty('display','grid','important');
      detail.style.setProperty('grid-template-columns','1fr 1fr','important');
      detail.style.setProperty('gap','1px 4px','important');
      detail.style.setProperty('margin-top','3px','important');
      detail.style.setProperty('font-size','5.2px','important');
      detail.style.setProperty('line-height','1.05','important');
      detail.style.setProperty('color','#ddd','important');
      detail.style.setProperty('white-space','nowrap','important');
      Array.from(detail.children).forEach(function(el,i){
        el.style.setProperty('font-size','5.2px','important');
        el.style.setProperty('line-height','1.05','important');
        el.style.setProperty('text-align',i%2?'right':'left','important');
      });
    }
  }

  function apply(){
    try{
      var room,wrap,hud,tools;

      room=document.querySelector('#screen .ktsolo-room');
      if(room){
        wrap=room.querySelector('.ktsolo-earn');
        hud=wrap&&wrap.querySelector('#myEarnHud');
        tools=room.querySelector('.ktsolo-tools');
        styleOne(wrap,hud,tools,false);
      }

      room=document.querySelector('#screen .ktg13-room');
      if(room){
        wrap=room.querySelector('.ktg13-earn');
        hud=wrap&&wrap.querySelector('#myEarnHud');
        tools=room.querySelector('.ktg13-tools');
        styleOne(wrap,hud,tools,false);
      }

      room=document.querySelector('#screen .ktsubscriber-room');
      if(room){
        wrap=room.querySelector('.ktsubscriber-earn');
        hud=wrap&&wrap.querySelector('#ktSubscriberEarnHud');
        tools=room.querySelector('.ktsubscriber-tools');
        styleOne(wrap,hud,tools,true);
      }

      room=document.querySelector('#screen .ktsecret-room');
      if(room){
        wrap=room.querySelector('.ktsecret-earn-row');
        hud=wrap&&wrap.querySelector('#myEarnHud');
        tools=room.querySelector('.ktsecret-tools');
        styleOne(wrap,hud,tools,false);
      }
    }catch(e){}
  }

  apply();
  [20,80,180,400,900,1600].forEach(function(ms){setTimeout(apply,ms);});
  try{
    var screen=document.getElementById('screen');
    if(screen){
      new MutationObserver(function(){
        clearTimeout(window.__ktHostEarningsUnifiedTimer20260929);
        window.__ktHostEarningsUnifiedTimer20260929=setTimeout(apply,40);
      }).observe(screen,{childList:true});
    }
  }catch(e){}
  window.addEventListener('resize',function(){setTimeout(apply,60);});
  window.addEventListener('orientationchange',function(){setTimeout(apply,140);});
})();