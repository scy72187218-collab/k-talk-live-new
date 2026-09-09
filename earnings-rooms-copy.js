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
