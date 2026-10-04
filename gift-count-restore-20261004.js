/* K-Talk 선물상자 수량 표시 복구 전용 2026-10-04
   선물 이름/이미지/배치/기능은 건드리지 않고 수량 글자만 복구 */
(function(){
  if(window.__ktGiftCountRestore20261004V2)return;
  window.__ktGiftCountRestore20261004V2=true;

  var counts=[
    1,30,50,80,100,200,300,500,700,1000,
    10,20,40,60,120,150,180,250,400,600,
    800,1200,1500,2000,3000,3500,4000,4500,5000,6000,
    7000,8000,9000,10000,12000,14000,16000,18000,20000,22000,
    24000,25000,26000,27000,28000,29000,30000,31000,32000,33000
  ];

  function style(){
    var id='ktGiftCountRestoreStyle20261004V2';
    var s=document.getElementById(id);
    if(!s){
      s=document.createElement('style');
      s.id=id;
      (document.head||document.documentElement).appendChild(s);
    }
    s.textContent=''
      +'.ktgf-card strong{'
      +'display:block!important;visibility:visible!important;opacity:1!important;'
      +'position:static!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;'
      +'height:auto!important;min-height:10px!important;max-height:none!important;'
      +'margin:2px 0 0!important;padding:0!important;'
      +'font-size:10px!important;line-height:11px!important;font-weight:950!important;'
      +'color:#ffe06b!important;text-align:center!important;white-space:nowrap!important;'
      +'overflow:visible!important;text-overflow:clip!important;transform:none!important;'
      +'}'
      +'@media(max-width:410px){.ktgf-card strong{font-size:8.8px!important;line-height:10px!important;min-height:10px!important;margin-top:0!important}}';
  }

  function restore(){
    style();
    document.querySelectorAll('.ktgf-card').forEach(function(card){
      var i=parseInt(card.getAttribute('data-i'),10);
      if(!isFinite(i)||i<0||i>=counts.length)return;
      var strong=card.querySelector('strong');
      if(!strong){
        strong=document.createElement('strong');
        card.appendChild(strong);
      }
      strong.textContent=Number(counts[i]).toLocaleString('ko-KR')+'개';
    });
  }

  function wrapOpen(){
    var old=window.openGifts;
    if(typeof old!=='function'||old.__ktGiftCountRestoreWrapped)return;
    var wrapped=function(){
      var r=old.apply(this,arguments);
      setTimeout(restore,0);
      setTimeout(restore,30);
      setTimeout(restore,120);
      return r;
    };
    wrapped.__ktGiftCountRestoreWrapped=true;
    window.openGifts=wrapped;
  }

  wrapOpen();
  restore();
  [60,180,400,900].forEach(function(ms){setTimeout(function(){wrapOpen();restore();},ms);});
  try{
    new MutationObserver(function(){
      if(document.querySelector('.ktgf-card'))setTimeout(restore,0);
      wrapOpen();
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();