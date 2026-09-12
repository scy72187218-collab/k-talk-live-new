/* K-Talk 1인방 오른쪽 중복 버튼만 정리: 효과 1개, 보물상자 1개만 유지. 다른 UI는 건드리지 않음. */
(function(){
  if(window.__ktSoloRightDedupeInstalled)return;
  window.__ktSoloRightDedupeInstalled=true;

  /* 1인 방송 오른쪽 버튼 묶음만 조금 아래로 내린다. 13명/구독자/비밀방은 변경하지 않음. */
  if(!document.getElementById('ktSoloRightLower20260912')){
    var st=document.createElement('style');
    st.id='ktSoloRightLower20260912';
    st.textContent='html.kt-att-led-target:not(.kt-compact-two-room) body #ktSept2Live.kt-added-ui-room .kt-s2-right{bottom:135px!important;}';
    document.head.appendChild(st);
  }

  function buttonKind(btn){
    var text=String(btn.textContent||'').replace(/\s+/g,'');
    var onclick=String(btn.getAttribute('onclick')||'');
    if(text.indexOf('효과')>-1||text.indexOf('✨')>-1||onclick.indexOf('ktSoloEffect')>-1||onclick.indexOf('openEditEffectPanel')>-1)return 'effect';
    if(text.indexOf('보물상자')>-1||text.indexOf('🎁')>-1||onclick.indexOf('openTreasure')>-1||onclick.indexOf('openGifts')>-1||onclick.indexOf('ktRenderTreasure')>-1)return 'treasure';
    return '';
  }

  function dedupe(){
    var box=document.querySelector('.ktsolo-right');
    if(!box)return;
    var seen={effect:false,treasure:false};
    Array.prototype.slice.call(box.querySelectorAll('button')).forEach(function(btn){
      var kind=buttonKind(btn);
      if(!kind)return;
      if(seen[kind])btn.remove();
      else seen[kind]=true;
    });
  }

  dedupe();
  setTimeout(dedupe,60);
  setTimeout(dedupe,250);
  var observer=new MutationObserver(function(){dedupe();});
  observer.observe(document.documentElement,{childList:true,subtree:true});
})();

/* 방송방 출석체크는 안내창을 열지 않고 장미 1송이 지급만 실행한다. */
(function(){
  if(window.__ktAttendanceDirectRoseNoPopupInstalled)return;
  window.__ktAttendanceDirectRoseNoPopupInstalled=true;

  var selector='.ktsolo-att,.ktg13-attend,.ktsubscriber-att,.ktsecret-att';

  function fixAttendanceButtons(){
    try{
      document.querySelectorAll(selector).forEach(function(btn){
        if(btn.dataset.ktAttendanceDirectRose==='1')return;
        btn.dataset.ktAttendanceDirectRose='1';
        btn.removeAttribute('onclick');
        btn.onclick=function(ev){
          if(ev)ev.preventDefault();
          return false;
        };
      });
    }catch(e){}
  }

  fixAttendanceButtons();
  [40,120,300,700,1200].forEach(function(ms){setTimeout(fixAttendanceButtons,ms);});
  try{
    new MutationObserver(function(){fixAttendanceButtons();}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
