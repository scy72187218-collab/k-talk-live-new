/* K-Talk 9명방 하단 도구줄만 조금 아래로 이동.
   매치/친구/메시지/장미/선물/공유/효과/더보기 외 다른 화면은 변경하지 않음. */
(function(){
  if(window.__ktGroup9BottomToolsLower20260919)return;
  window.__ktGroup9BottomToolsLower20260919=true;

  function install(){
    if(document.getElementById('ktGroup9BottomToolsLowerStyle'))return;
    var s=document.createElement('style');
    s.id='ktGroup9BottomToolsLowerStyle';
    s.textContent=''
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-tools{'
      +'transform:translateY(10px)!important;'
      +'}'
      +'#screen .ktg13-room[data-kt-room="9"] .ktg13-tool span{'
      +'color:#fff!important;'
      +'position:relative!important;'
      +'z-index:32!important;'
      +'}';
    document.head.appendChild(s);
  }

  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();

/* 9명방 하단 8개 버튼 터치 복구만 */
(function(){
  if(window.__ktG9BottomTapFix20260919)return;
  window.__ktG9BottomTapFix20260919=true;
  var last='',at=0;

  function isNine(){
    try{
      var r=document.querySelector('#screen .ktg13-room[data-kt-room="9"]');
      if(r)return true;
      var t=String((window.state&&state.liveRoomType)||'');
      var n=String((window.state&&state.liveRoomName)||'');
      return t==='group9'||n.indexOf('9명')>-1;
    }catch(e){return false;}
  }
  function box(){
    if(!isNine())return null;
    return document.querySelector('#screen .ktg13-room[data-kt-room="9"] .ktg13-tools')||
           document.querySelector('#screen .ktg13-room .ktg13-tools');
  }
  function btnAt(e){
    var b=box(); if(!b)return null;
    try{
      var d=e.target&&e.target.closest?e.target.closest('.ktg13-tool'):null;
      if(d&&b.contains(d))return d;
    }catch(x){}
    var p=(e.changedTouches&&e.changedTouches[0])||e;
    var x=p&&p.clientX,y=p&&p.clientY;
    if(typeof x!=='number'||typeof y!=='number')return null;
    var list=b.querySelectorAll('.ktg13-tool');
    for(var i=0;i<list.length;i++){
      var r=list[i].getBoundingClientRect();
      if(x>=r.left&&x<=r.right&&y>=r.top&&y<=r.bottom)return list[i];
    }
    return null;
  }
  function label(b){
    var s=b.querySelector('span');
    return String((s&&s.textContent)||b.textContent||'').replace(/\s+/g,'');
  }
  function show(title,html){
    try{if(typeof window.showSheet==='function'){window.showSheet(title,html);return true;}}catch(e){}
    return false;
  }
  function run(b){
    var k=label(b);
    try{
      if(k.indexOf('매치')>-1){
        if(typeof window.openHostMatchArena==='function'){window.openHostMatchArena('1대1');return true;}
      }else if(k.indexOf('친구')>-1){
        if(typeof window.ktGroup9Friends==='function'){window.ktGroup9Friends();return true;}
        if(typeof window.ktGroup13Friends==='function'){window.ktGroup13Friends();return true;}
      }else if(k.indexOf('메시지')>-1){
        if(typeof window.ktGroup13OpenMessage==='function'){window.ktGroup13OpenMessage();return true;}
      }else if(k.indexOf('장미')>-1){
        if(typeof window.giftSend==='function'){window.giftSend('장미',1);return true;}
        if(typeof window.ktAnnounceEvent==='function'){window.ktAnnounceEvent('gift',{name:'장미',count:1});return true;}
      }else if(k.indexOf('선물')>-1){
        if(typeof window.openGifts==='function'){window.openGifts();return true;}
      }else if(k.indexOf('공유')>-1){
        if(typeof window.shareApp==='function'){window.shareApp();return true;}
      }else if(k.indexOf('효과')>-1){
        return show('효과','<div class="rowbox"><b>방송 효과</b><br>효과 버튼이 정상 작동합니다.</div>');
      }else if(k.indexOf('더보기')>-1){
        if(typeof window.ktGroup13More==='function'){window.ktGroup13More();return true;}
      }
    }catch(e){}
    return false;
  }
  function tap(e){
    var b=btnAt(e); if(!b)return;
    var k=label(b),now=Date.now();
    if(last===k&&now-at<500){try{e.preventDefault();e.stopPropagation();}catch(x){};return;}
    if(!run(b))return;
    last=k;at=now;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
  }
  window.addEventListener('pointerdown',tap,true);
  window.addEventListener('touchstart',tap,{capture:true,passive:false});

  function unlock(){
    var b=box(); if(!b)return;
    b.style.setProperty('pointer-events','auto','important');
    b.style.setProperty('z-index','200','important');
    b.querySelectorAll('.ktg13-tool').forEach(function(x){
      x.disabled=false;
      x.setAttribute('aria-disabled','false');
      x.style.setProperty('pointer-events','auto','important');
      x.style.setProperty('touch-action','manipulation','important');
      x.style.setProperty('position','relative','important');
      x.style.setProperty('z-index','201','important');
    });
  }
  [0,80,220,500,1000,1800].forEach(function(ms){setTimeout(unlock,ms);});
  try{new MutationObserver(function(){setTimeout(unlock,20);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
