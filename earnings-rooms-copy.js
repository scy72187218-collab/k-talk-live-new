/* K-Talk: 13명 방의 내 수익 지급표를 1인/구독자/비밀방에도 동일하게 표시. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktEarningsRoomsCopyInstalled)return;
  window.__ktEarningsRoomsCopyInstalled=true;

  function isTargetRoom(){
    return !!document.querySelector('.ktsolo-room,.ktsubscriber-room,.ktsecret-room');
  }

  function applyEarningsCopy(){
    if(!isTargetRoom())return;
    var hud=document.getElementById('myEarnHud');
    if(!hud||hud.getAttribute('data-kt-earnings-copy')==='1')return;

    var netEl=document.getElementById('hudEarnNet');
    var rosesEl=document.getElementById('hudEarnRoses');
    var net=netEl?netEl.textContent:'0원';
    var roses=rosesEl?rosesEl.textContent:'🌹 0송이';

    hud.innerHTML=''
      +'<div style="display:flex;align-items:center;justify-content:center;gap:4px">'
        +'<span style="font-size:8px;color:#8fe8ff;font-weight:950;white-space:nowrap">🔒 내 수익 · 본인만 표시</span>'
        +'<b id="hudEarnNet" style="font-size:12px;color:#ffe071;white-space:nowrap">'+net+'</b>'
      +'</div>'
      +'<div id="myEarnDetail" style="display:grid;grid-template-columns:1fr auto;gap:1px 4px;margin-top:1px;font-size:7px;color:#ddd;line-height:1.15">'
        +'<span id="hudEarnRoses">'+roses+'</span>'
        +'<span id="hudEarnRate" style="text-align:right;white-space:nowrap">일반회원 35%</span>'
        +'<span style="grid-column:1/-1;text-align:right;white-space:nowrap">구독자회원 40% · 소속사 65%</span>'
        +'<span style="grid-column:1/-1;text-align:right;color:#ffe071;white-space:nowrap">소속사 가입은 소속사가 결정</span>'
      +'</div>';
    hud.setAttribute('data-kt-earnings-copy','1');
  }

  var obs=new MutationObserver(function(){setTimeout(applyEarningsCopy,0);});
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',applyEarningsCopy);
  setTimeout(applyEarningsCopy,0);
})();

/* 1인·구독자·비밀방 오른쪽: 기존 선물 버튼만 숨기고, 효과 바로 아래에 보물상자만 추가. */
(function(){
  if(window.__ktEffectTreasureRightSideInstalled)return;
  window.__ktEffectTreasureRightSideInstalled=true;

  window.ktRoomQuickTreasure=function(){
    try{if(window.openTreasure){window.openTreasure();return;}}catch(e){}
    try{if(window.openGifts)window.openGifts();}catch(e){}
  };

  function fixSide(selector,effectFn){
    var side=document.querySelector(selector);
    if(!side)return;

    var buttons=Array.from(side.children).filter(function(el){return el&&el.tagName==='BUTTON';});
    var like=buttons.find(function(b){return b.classList.contains('like');})||null;
    var effect=buttons.find(function(b){return String(b.getAttribute('onclick')||'').indexOf(effectFn)>-1;})||null;
    var match=buttons.find(function(b){return String(b.getAttribute('onclick')||'').indexOf('openHostMatchArena')>-1;})||null;

    buttons.forEach(function(btn){
      var oc=String(btn.getAttribute('onclick')||'');
      if(oc.indexOf('openGifts')>-1 && !btn.hasAttribute('data-kt-quick-treasure')){
        btn.style.setProperty('display','none','important');
      }
    });

    if(!effect){
      effect=document.createElement('button');
      effect.type='button';
      effect.setAttribute('onclick','if(window.'+effectFn+')window.'+effectFn+'()');
      effect.innerHTML='✨<small>효과</small>';
    }
    effect.style.removeProperty('display');

    var chest=side.querySelector('[data-kt-quick-treasure]');
    if(!chest){
      chest=document.createElement('button');
      chest.type='button';
      chest.setAttribute('data-kt-quick-treasure','1');
      chest.setAttribute('aria-label','보물상자');
      chest.setAttribute('onclick','ktRoomQuickTreasure()');
      chest.innerHTML='🎁<small>보물상자</small>';
    }

    if(like && like.nextElementSibling!==effect){
      side.insertBefore(effect,like.nextElementSibling);
    }else if(!like && effect.parentNode!==side){
      side.insertBefore(effect,side.firstChild);
    }

    if(effect.nextElementSibling!==chest){
      side.insertBefore(chest,effect.nextElementSibling);
    }

    if(match && chest.nextElementSibling!==match){
      side.insertBefore(match,chest.nextElementSibling);
    }
  }

  function applyRightSide(){
    fixSide('.ktsolo-right','ktSoloEffect');
    fixSide('.ktsubscriber-right','ktSubscriberEffect');
    fixSide('.ktsecret-right','ktSecretEffect');
  }

  var obs2=new MutationObserver(function(){setTimeout(applyRightSide,0);});
  obs2.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('DOMContentLoaded',applyRightSide);
  setTimeout(applyRightSide,0);
})();