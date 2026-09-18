/* 태권1/하이네2 프로필 레벨 카드 단일 표시 전용.
   중복 레벨 카드를 하나로 묶고, 두 관리자 계정 표시만 고정.
   다른 프로필/방송/카메라/채팅 기능은 변경하지 않음. */
(function(){
  if(window.__ktOwnerSingleLevelCard20260918)return;
  window.__ktOwnerSingleLevelCard20260918=true;

  function isOwnerProfile(){
    try{
      if(typeof window.ktGetSelectedSubAccount!=='function')return false;
      var key=window.ktGetSelectedSubAccount();
      return key==='taekwon1'||key==='haine2';
    }catch(e){return false;}
  }

  function cardHtml(){
    return ''
      +'<div class="kt-level-card kt-owner-single-level-card" style="margin:10px 0;padding:13px;border:1px solid #ffb300;border-radius:16px;background:#0c0c13;color:#fff">'
      +'<div style="display:flex;align-items:center;gap:8px">'
      +'<b style="font-size:17px;color:#ffd84a">Lv.1000 👑 관리자</b>'
      +'<span style="margin-left:auto;color:#ffd84a;font-size:12px">🌹 50,000개</span>'
      +'</div>'
      +'<div style="height:8px;margin:9px 0 7px;border-radius:999px;background:#ffffff18;overflow:hidden">'
      +'<i style="display:block;height:100%;width:100%;background:linear-gradient(90deg,#ff3ca6,#7b55ff,#45d7ff)"></i>'
      +'</div>'
      +'<div style="font-size:11px;color:#d7d7df;line-height:1.45">장미 받은 개수 50,000개<br>관리자 레벨 1000 · 13명방 · 비밀방 사용 가능</div>'
      +'<button type="button" onclick="if(window.openLevelBenefits)openLevelBenefits()" style="width:100%;height:36px;margin-top:9px;border:0;border-radius:10px;background:#ffffff12;color:#fff;font-weight:900">레벨 혜택 보기</button>'
      +'</div>';
  }

  function merge(){
    if(!isOwnerProfile())return;

    var body=document.getElementById('sheetBody');
    var root=document.querySelector('.kt-my-profile');
    if(!body||!root)return;

    /* 프로필 위/안에 중복으로 생긴 기존 레벨 카드 전부 제거 */
    [].slice.call(body.querySelectorAll('.kt-level-card')).forEach(function(el){
      if(el&&el.parentNode)el.parentNode.removeChild(el);
    });

    /* 태권1/하이네2에는 최종 카드 딱 1개만 표시 */
    root.insertAdjacentHTML('beforebegin',cardHtml());
  }
  function install(){
    merge();
    [40,120,300,700,1400].forEach(function(ms){setTimeout(merge,ms);});
  }

  var screen=document.getElementById('screen');
  var sheet=document.getElementById('sheet');
  if(screen)new MutationObserver(function(){setTimeout(merge,0);}).observe(screen,{childList:true,subtree:true});
  if(sheet)new MutationObserver(function(){setTimeout(merge,0);}).observe(sheet,{childList:true,subtree:true});

  document.addEventListener('click',function(){setTimeout(merge,30);},true);
  install();
})();