/* K-Talk 9명방 승인 전/후 하단 6개 — 2026-10-01 — PIN 5555
   ONLY target: 9명방 게스트 화면의 승인 전/승인 후 하단.
   유지 순서: 채팅창 → 화살표 → 사람 → 장미 → 선물상자 → 공유.
   다른 방/그리드/카메라/마이크/승인 로직/수익률/통신은 건드리지 않음.
*/
(function(){
  if(window.__ktG9ApprovalSixbar5555_20261001)return;
  window.__ktG9ApprovalSixbar5555_20261001=true;

  function isNine(root){
    if(!root)return false;
    try{
      if(root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]'))return true;
      if(root.classList.contains('kt-g9-final-5555')||root.classList.contains('kt-g9-chat-bottom-5555'))return true;
      var t=String(root.textContent||'');
      var s=window.state||{}, last=window.__ktLastLiveRoom||{};
      t+=' '+String(s.liveRoomName||'')+' '+String(s.liveRoomType||'')+' '+String(s.liveRoomMax||'');
      t+=' '+String(last.room_name||'')+' '+String(last.room_type||'');
      return /9\s*명|group9/i.test(t);
    }catch(e){return false;}
  }

  function callFirst(names,arg){
    for(var i=0;i<names.length;i++){
      try{
        var f=window[names[i]];
        if(typeof f==='function')return arg===undefined?f():f(arg);
      }catch(e){}
    }
  }

  function viewers(){
    var r=callFirst(['ktGroup13OpenViewers','openViewerList','openViewers','ktOpenViewers']);
    if(r!==undefined)return r;
    try{
      if(typeof window.showSheet==='function')window.showSheet('👥 사람','<div class="rowbox">현재 방송 참여자와 시청자를 확인하는 자리입니다.</div>');
    }catch(e){}
  }
  function rose(){ callFirst(['openRoseGift','openRoseGifts','openGifts']); }
  function gift(){ callFirst(['openGifts','openGiftBox','openGiftPanel']); }
  function share(){ callFirst(['shareApp','shareCurrentLive','ktShareLive']); }

  function ensureStyle(){
    if(document.getElementById('ktG9ApprovalSixbar5555Style'))return;
    var s=document.createElement('style');
    s.id='ktG9ApprovalSixbar5555Style';
    s.textContent=''
      +'#screen .kt-remote-live.kt-g9-sixbar-5555>.kt-remote-bottom{'
        +'display:flex!important;align-items:center!important;gap:4px!important;'
        +'height:44px!important;min-height:44px!important;max-height:44px!important;'
        +'padding:0!important;overflow:visible!important;}'
      +'#screen .kt-remote-live.kt-g9-sixbar-5555>.kt-remote-bottom input{'
        +'flex:1 1 auto!important;min-width:72px!important;height:38px!important;'
        +'border-radius:20px!important;padding:0 12px!important;}'
      +'#screen .kt-remote-live.kt-g9-sixbar-5555>.kt-remote-bottom .kt-g9-six-icon-5555,'
      +'#screen .kt-remote-live.kt-g9-sixbar-5555>.kt-remote-bottom [data-kt-g9-six-send-5555]{'
        +'flex:0 0 36px!important;width:36px!important;height:36px!important;min-width:36px!important;'
        +'padding:0!important;border-radius:50%!important;display:grid!important;place-items:center!important;'
        +'font-size:17px!important;line-height:1!important;white-space:nowrap!important;}'
      +'@media(max-width:390px){'
        +'#screen .kt-remote-live.kt-g9-sixbar-5555>.kt-remote-bottom{gap:3px!important;}'
        +'#screen .kt-remote-live.kt-g9-sixbar-5555>.kt-remote-bottom input{min-width:60px!important;padding:0 9px!important;}'
        +'#screen .kt-remote-live.kt-g9-sixbar-5555>.kt-remote-bottom .kt-g9-six-icon-5555,'
        +'#screen .kt-remote-live.kt-g9-sixbar-5555>.kt-remote-bottom [data-kt-g9-six-send-5555]{'
          +'flex-basis:34px!important;width:34px!important;height:34px!important;min-width:34px!important;font-size:16px!important;}'
      +'}';
    (document.head||document.documentElement).appendChild(s);
  }

  function mk(label,icon,fn,key){
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-g9-six-icon-5555';
    b.setAttribute('data-kt-g9-six-'+key+'-5555','1');
    b.setAttribute('aria-label',label);
    b.setAttribute('title',label);
    b.textContent=icon;
    b.addEventListener('click',function(e){
      try{e.preventDefault();e.stopPropagation();}catch(_e){}
      fn();
    });
    return b;
  }

  function ensureBar(root){
    if(!isNine(root))return;
    var bar=root.querySelector(':scope > .kt-remote-bottom')||root.querySelector('.kt-remote-bottom');
    if(!bar)return;
    var input=bar.querySelector('input');
    if(!input)return;

    root.classList.add('kt-g9-sixbar-5555');

    var send=(input.nextElementSibling&&input.nextElementSibling.tagName==='BUTTON')?input.nextElementSibling:null;
    if(!send){
      send=bar.querySelector('.kt-remote-action.send,[data-kt-g9-final="send"],[data-kt-send-plane-hard-5555],[data-kt-single-send-5555],[data-kt-preapproval-single-send-5555]');
    }
    if(send){
      send.setAttribute('data-kt-g9-six-send-5555','1');
      send.setAttribute('aria-label','채팅 보내기');
      send.setAttribute('title','채팅 보내기');
    }

    var order=[
      ['person','사람','👥',viewers],
      ['rose','장미','🌹',rose],
      ['gift','선물상자','🎁',gift],
      ['share','공유','↗',share]
    ];
    order.forEach(function(x){
      if(!bar.querySelector('[data-kt-g9-six-'+x[0]+'-5555]')){
        bar.appendChild(mk(x[1],x[2],x[3],x[0]));
      }
    });

    /* 정확한 순서만 정리: input → 기존 화살표 → 사람 → 장미 → 선물 → 공유 */
    var person=bar.querySelector('[data-kt-g9-six-person-5555]');
    var roseB=bar.querySelector('[data-kt-g9-six-rose-5555]');
    var giftB=bar.querySelector('[data-kt-g9-six-gift-5555]');
    var shareB=bar.querySelector('[data-kt-g9-six-share-5555]');
    try{
      bar.appendChild(input);
      if(send)bar.appendChild(send);
      if(person)bar.appendChild(person);
      if(roseB)bar.appendChild(roseB);
      if(giftB)bar.appendChild(giftB);
      if(shareB)bar.appendChild(shareB);
    }catch(e){}
  }

  function apply(){
    ensureStyle();
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      if(isNine(root))ensureBar(root);
    });
  }

  apply();
  [20,60,120,250,500,900,1500,2500,4000].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('pageshow',function(){setTimeout(apply,50);});
  window.addEventListener('kt-guest-approval-received',function(){[20,80,180,400].forEach(function(ms){setTimeout(apply,ms);});});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktG9ApprovalSixbar5555Timer);
      window.__ktG9ApprovalSixbar5555Timer=setTimeout(apply,30);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();