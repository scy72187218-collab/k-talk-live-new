/* K-Talk 오늘의 운세 AI 읽기 전용 잠금 2026-09-30
   범위: 오늘의 운세 열기 함수의 현재 정상 동작만 보호.
   다른 화면/방송/입퇴장/버튼은 변경하지 않음. */
(function(){
  if(window.__ktFortuneAiVoiceLock20260930)return;
  window.__ktFortuneAiVoiceLock20260930=true;

  var savedOpen=null;

  function capture(){
    try{
      if(!savedOpen&&typeof window.ktOpenDailyFortuneLadder20260928==='function'){
        savedOpen=window.ktOpenDailyFortuneLadder20260928;
      }
    }catch(e){}
  }

  function restore(){
    capture();
    try{
      if(savedOpen&&window.ktOpenDailyFortuneLadder20260928!==savedOpen){
        window.ktOpenDailyFortuneLadder20260928=savedOpen;
      }
    }catch(e){}
  }

  capture();
  [50,150,350,800,1500,2500].forEach(function(ms){setTimeout(restore,ms);});
  setInterval(restore,1200);
  window.addEventListener('pageshow',restore);
  window.addEventListener('focus',restore);
  document.addEventListener('visibilitychange',function(){
    if(document.visibilityState==='visible')restore();
  });
})();