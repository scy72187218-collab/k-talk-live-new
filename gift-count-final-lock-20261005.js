/* K-Talk 선물상자 수량 최종 복구 잠금 2026-10-05
   선물 이미지/이름/배치/기능은 건드리지 않고 수량(개)만 항상 표시 */
(function(){
  if(window.__ktGiftCountFinalLock20261005)return;
  window.__ktGiftCountFinalLock20261005=true;

  var fallback=[
    1,30,50,80,100,200,300,500,700,1000,
    10,20,40,60,120,150,180,250,400,600,
    800,1200,1500,2000,3000,3500,4000,4500,5000,6000,
    7000,8000,9000,10000,12000,14000,16000,18000,20000,22000,
    24000,25000,26000,27000,28000,29000,30000,31000,32000,33000
  ];

  function amountAt(i){
    try{
      var g=window.ktalkGifts&&window.ktalkGifts[i];
      var n=g?parseInt(String(g[1]).replace(/[^0-9]/g,''),10):NaN;
      if(isFinite(n))return n;
    }catch(e){}
    return fallback[i]||0;
  }

  function cardIndex(card,pos){
    var raw=card.getAttribute('data-index')||card.getAttribute('data-i');
    var n=parseInt(raw,10);
    if(isFinite(n))return n;
    var no=card.querySelector('.ktgf-no,.kt-gift-final-no,[class*="gift"][class*="no"]');
    if(no){
      n=parseInt(String(no.textContent||'').replace(/[^0-9]/g,''),10);
      if(isFinite(n)&&n>0)return n-1;
    }
    return pos;
  }

  function forceCount(card,i){
    var amount=amountAt(i);
    if(!amount)return;
    var strong=card.querySelector('strong');
    if(!strong){
      strong=document.createElement('strong');
      card.appendChild(strong);
    }
    strong.textContent=Number(amount).toLocaleString('ko-KR')+'개';
    [
      ['display','block'],['visibility','visible'],['opacity','1'],
      ['position','static'],['left','auto'],['right','auto'],['top','auto'],['bottom','auto'],
      ['width','auto'],['height','12px'],['min-height','12px'],['max-height','12px'],
      ['margin','1px 0 0'],['padding','0'],['font-size','9px'],['line-height','12px'],
      ['font-weight','950'],['color','#ffe06b'],['text-align','center'],
      ['white-space','nowrap'],['overflow','visible'],['transform','none']
    ].forEach(function(p){strong.style.setProperty(p[0],p[1],'important');});
    card.style.setProperty('overflow','visible','important');
  }

  function restore(){
    var cards=[].slice.call(document.querySelectorAll(
      '.ktgf-card,.kt-gift-final-card,.kt-gift-card,[data-index][class*="gift"],[data-i][class*="gift"]'
    ));
    cards.forEach(function(card,pos){forceCount(card,cardIndex(card,pos));});
  }

  function wrap(){
    var old=window.openGifts;
    if(typeof old!=='function'||old.__ktGiftCountFinalLock20261005)return;
    var w=function(){
      var r=old.apply(this,arguments);
      [0,20,60,150,350,800].forEach(function(ms){setTimeout(restore,ms);});
      return r;
    };
    w.__ktGiftCountFinalLock20261005=true;
    window.openGifts=w;
  }

  wrap(); restore();
  setInterval(function(){
    wrap();
    if(document.querySelector('.ktgf,.kt-gift-final,#sheet'))restore();
  },250);
  try{
    new MutationObserver(function(){setTimeout(restore,0);wrap();})
      .observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  }catch(e){}
})();