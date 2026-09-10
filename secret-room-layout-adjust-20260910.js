/* K-Talk 비밀방 화면 전용 배치: 사용자가 보낸 비밀방 참고 화면에 맞춰 호스트 크게 + 참여자 5명 + 하단 채팅/이벤트/선물로 정리. 다른 방은 건드리지 않음. */
(function(){
  if(window.__ktSecretRoomLayoutAdjust20260910Installed)return;
  window.__ktSecretRoomLayoutAdjust20260910Installed=true;

  var style=document.createElement('style');
  style.id='ktSecretRoomLayoutAdjust20260910Style';
  style.textContent=''
    +'body.kt-secret-layout-adjust .ktsecret-room{padding:5px!important;gap:4px!important;background:#000!important}'
    +'body.kt-secret-layout-adjust .ktsecret-head{flex:0 0 50px!important;border:1px solid rgba(255,64,205,.34)!important;border-radius:13px!important;background:linear-gradient(180deg,#0b0b0f,#040406)!important;padding:4px 8px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-title{font-size:15px!important;color:#ff65d4!important}'
    +'body.kt-secret-layout-adjust .ktsecret-brand{font-size:17px!important;color:#ffd568!important;text-shadow:0 0 9px rgba(255,188,44,.48)!important}'
    +'body.kt-secret-layout-adjust .ktsecret-att{height:26px!important;min-width:82px!important;font-size:10px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-airrow{flex:0 0 30px!important;height:30px!important;padding:0 5px!important;font-size:11px!important;gap:6px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-airrow .on{font-size:11px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-lock{padding:4px 8px!important;font-size:9px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-led{flex:0 0 32px!important;height:32px!important;border-radius:10px!important;border-width:1px!important;background:#07070b!important;box-shadow:0 0 7px rgba(255,40,205,.35)!important}'
    +'body.kt-secret-layout-adjust .ktsecret-led-track{font-size:12px!important;animation-duration:16s!important}'
    +'body.kt-secret-layout-adjust .ktsecret-main{position:relative!important;overflow:hidden!important;border:1px solid rgba(255,56,211,.55)!important;border-radius:9px!important;background:#050507!important}'

    /* 위쪽: 왼쪽 호스트 크게, 오른쪽 참여자 5명 3x2. 마지막 한 칸은 잠금 안내 */
    +'body.kt-secret-layout-adjust .ktsecret-six-grid{position:absolute!important;top:3px!important;left:3px!important;right:3px!important;bottom:116px!important;display:grid!important;grid-template-columns:minmax(0,46%) repeat(3,minmax(0,1fr))!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:3px!important;padding:0!important;inset:auto!important;z-index:2!important}'
    +'body.kt-secret-layout-adjust .ktsecret-slot{min-width:0!important;min-height:0!important;border:1px solid rgba(255,89,219,.45)!important;border-radius:7px!important;background:linear-gradient(145deg,#17171c,#08080b)!important}'
    +'body.kt-secret-layout-adjust .ktsecret-slot.host{grid-column:1!important;grid-row:1 / 3!important;border-color:#ff35d1!important;box-shadow:0 0 10px rgba(255,40,206,.30),inset 0 0 0 1px rgba(255,216,90,.18)!important}'
    +'body.kt-secret-layout-adjust .ktsecret-slot video{object-fit:cover!important;object-position:center 35%!important}'
    +'body.kt-secret-layout-adjust .ktsecret-slot-label{left:5px!important;bottom:5px!important;font-size:8px!important;padding:2px 5px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-guest-wait{font-size:8px!important;gap:2px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-guest-wait b{width:24px!important;height:24px!important;font-size:16px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-six-grid::after{content:"🔒\\A구독자 전용 입장";white-space:pre;grid-column:4;grid-row:2;display:grid;place-items:center;text-align:center;min-width:0;min-height:0;border:1px solid rgba(255,89,219,.45);border-radius:7px;background:linear-gradient(145deg,#111117,#060609);color:#d6d6df;font-size:8px;font-weight:900;line-height:1.35;box-shadow:inset 0 0 12px rgba(255,44,205,.08)}'

    /* 참고 화면과 겹치지 않게 기존 우측 원형 버튼은 영상 오른쪽 위에 작게 */
    +'body.kt-secret-layout-adjust .ktsecret-right{top:8px!important;right:8px!important;bottom:auto!important;left:auto!important;display:flex!important;flex-direction:column!important;gap:4px!important;z-index:12!important}'
    +'body.kt-secret-layout-adjust .ktsecret-right button{width:32px!important;height:32px!important;min-height:32px!important;font-size:11px!important;border-radius:50%!important;background:rgba(5,5,9,.72)!important}'
    +'body.kt-secret-layout-adjust .ktsecret-right .like{height:38px!important;min-height:38px!important;border-radius:12px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-right small,body.kt-secret-layout-adjust .ktsecret-right b{font-size:6px!important}'

    /* 파장은 호스트 영상 아래쪽에만 얇게 */
    +'body.kt-secret-layout-adjust .ktsecret-wave{left:8px!important;right:54%!important;bottom:119px!important;height:22px!important;z-index:5!important;opacity:.95!important}'

    /* 아래쪽: 채팅 / 출석·제비 / 선물. 한 화면에서 겹치지 않게 */
    +'body.kt-secret-layout-adjust .ktsecret-chat{left:4px!important;right:auto!important;width:27%!important;bottom:4px!important;height:106px!important;max-height:106px!important;padding:7px 6px 6px!important;background:linear-gradient(180deg,rgba(20,10,28,.90),rgba(7,7,12,.96))!important;border:1px solid rgba(130,91,255,.48)!important;border-radius:8px!important;z-index:9!important;overflow:hidden!important}'
    +'body.kt-secret-layout-adjust .ktsecret-chat:before{content:"💬 채팅"!important;display:block!important;margin-bottom:4px!important;color:#d8c9ff!important;font-size:9px!important;font-weight:950!important}'
    +'body.kt-secret-layout-adjust .ktsecret-chat:empty:after{content:"메시지를 입력하면 아래에서 위로 올라옵니다";display:block;color:#9e9eaa;font-size:7px;font-weight:700;line-height:1.3}'
    +'body.kt-secret-layout-adjust .ktsecret-chat-line{margin-top:2px!important;font-size:8px!important;line-height:1.18!important}'
    +'body.kt-secret-layout-adjust .ktsecret-chat-line b,body.kt-secret-layout-adjust .ktsecret-chat-line span{font-size:8px!important}'

    +'body.kt-secret-layout-adjust .ktsecret-ref-events{position:absolute;left:27.8%;width:35.2%;bottom:4px;height:106px;z-index:10;display:grid;grid-template-columns:1fr 1fr;gap:4px;pointer-events:auto}'
    +'body.kt-secret-layout-adjust .ktsecret-ref-card{min-width:0;border:1px solid rgba(160,96,255,.48);border-radius:8px;background:linear-gradient(180deg,rgba(31,11,43,.94),rgba(8,7,13,.97));padding:6px 4px;text-align:center;color:#fff;overflow:hidden}'
    +'body.kt-secret-layout-adjust .ktsecret-ref-card b{display:block;color:#ff7be0;font-size:9px;line-height:1.15;margin-bottom:5px}'
    +'body.kt-secret-layout-adjust .ktsecret-ref-times{display:flex;justify-content:center;gap:4px;color:#ffe66f;font-size:7px;line-height:1.25;margin-bottom:5px}'
    +'body.kt-secret-layout-adjust .ktsecret-ref-card button{width:92%;height:30px;border:1px solid #8d55ff;border-radius:8px;background:linear-gradient(135deg,#381059,#7f1aff);color:#fff;font-size:9px;font-weight:950;box-shadow:0 0 8px rgba(163,66,255,.34)}'
    +'body.kt-secret-layout-adjust .ktsecret-ref-card small{display:block;margin-top:4px;color:#cfc9dc;font-size:6.5px;line-height:1.2}'

    +'body.kt-secret-layout-adjust .ktsecret-gifts{left:auto!important;right:4px!important;bottom:4px!important;width:36.2%!important;height:106px!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-auto-rows:minmax(0,1fr)!important;gap:3px!important;padding:5px 4px!important;border:1px solid rgba(151,86,255,.48)!important;border-radius:8px!important;background:linear-gradient(180deg,rgba(28,10,40,.94),rgba(7,7,11,.97))!important;z-index:11!important}'
    +'body.kt-secret-layout-adjust .ktsecret-gifts::before{content:"선물 / 후원";grid-column:1/-1;color:#ff7be0;font-size:9px;font-weight:950;text-align:center;line-height:1}'
    +'body.kt-secret-layout-adjust .ktsecret-gift{min-height:0!important;padding:1px!important;border-radius:6px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-gift img{width:22px!important;height:18px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-emoji{height:18px!important;font-size:16px!important}'
    +'body.kt-secret-layout-adjust .ktsecret-gift b{font-size:6.5px!important}.ktsecret-gift small{font-size:5.5px!important}'

    /* 수익표는 호스트 영상 안 왼쪽 아래로 작게 이동 */
    +'body.kt-secret-layout-adjust .ktsecret-earn{left:8px!important;right:auto!important;bottom:142px!important;width:118px!important;max-width:42%!important;z-index:10!important}'
    +'body.kt-secret-layout-adjust .ktsecret-earn #myEarnHud{padding:3px 5px!important;border-radius:9px!important;background:rgba(10,8,13,.74)!important}'
    +'body.kt-secret-layout-adjust .ktsecret-earn #myEarnDetail{font-size:6px!important}'

    /* 다른 비밀방 보강 파일이 추가한 중복 게스트 패널은 숨기고 기본 6칸만 사용 */
    +'body.kt-secret-layout-adjust .ktsecret-guest-panel,body.kt-secret-layout-adjust .ktsecret-host-tag{display:none!important}'
    +'body.kt-secret-layout-adjust #ktWifiStatusIndicator{left:auto!important;right:8px!important;top:54px!important;bottom:auto!important;height:22px!important;padding:0 5px!important;font-size:7px!important;gap:2px!important;z-index:40!important}'

    +'@media(max-width:390px){'
      +'body.kt-secret-layout-adjust .ktsecret-six-grid{grid-template-columns:minmax(0,45%) repeat(3,minmax(0,1fr))!important;bottom:108px!important;gap:2px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-chat{width:28%!important;height:99px!important;max-height:99px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-ref-events{left:28.7%!important;width:34.6%!important;height:99px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-gifts{width:35.8%!important;height:99px!important;grid-template-columns:repeat(4,minmax(0,1fr))!important}'
      +'body.kt-secret-layout-adjust .ktsecret-wave{bottom:111px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-earn{bottom:132px!important;width:106px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-ref-card{padding:5px 2px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-ref-card b{font-size:8px!important}'
      +'body.kt-secret-layout-adjust .ktsecret-ref-card button{height:27px!important;font-size:8px!important}'
    +'}';
  document.head.appendChild(style);

  function addReferenceEvents(){
    try{
      var main=document.querySelector('.ktsecret-room .ktsecret-main');
      if(!main||main.querySelector('.ktsecret-ref-events'))return;
      var box=document.createElement('div');
      box.className='ktsecret-ref-events';
      box.innerHTML=''
        +'<div class="ktsecret-ref-card"><b>출석체크 이벤트</b><div class="ktsecret-ref-times"><span>아침<br>09:00</span><span>점심<br>13:00</span><span>저녁<br>20:00</span></div><button type="button" data-ktsecret-att>✓ 출석체크</button><small>매일 출석 시 보상 지급</small></div>'
        +'<div class="ktsecret-ref-card"><b>제비뽑기 이벤트</b><div class="ktsecret-ref-times"><span>하루<br>2~3회</span><span>행운<br>뽑기</span></div><button type="button" data-ktsecret-raffle>🎟 뽑기</button><small>행운을 뽑아보세요</small></div>';
      main.appendChild(box);
      var att=box.querySelector('[data-ktsecret-att]');
      if(att)att.onclick=function(){
        if(window.openAttendanceBenefits){window.openAttendanceBenefits();return;}
        if(window.showSheet)window.showSheet('출석체크','<div class="rowbox">출석체크 이벤트입니다.</div>');
      };
      var raffle=box.querySelector('[data-ktsecret-raffle]');
      if(raffle)raffle.onclick=function(){
        if(window.openRaffle){window.openRaffle();return;}
        if(window.openRaffleDraw){window.openRaffleDraw();return;}
        if(window.showSheet)window.showSheet('제비뽑기','<div class="rowbox">제비뽑기 이벤트입니다.</div>');
      };
    }catch(e){}
  }

  function sync(){
    try{
      var on=!!document.querySelector('.ktsecret-room');
      document.body.classList.toggle('kt-secret-layout-adjust',on);
      if(on)addReferenceEvents();
    }catch(e){}
  }
  sync();
  if(document.body){
    var mo=new MutationObserver(sync);
    mo.observe(document.body,{childList:true,subtree:true});
  }else{
    document.addEventListener('DOMContentLoaded',sync,{once:true});
  }
})();