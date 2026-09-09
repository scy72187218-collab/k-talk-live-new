/* K-Talk: 13명 방송 오른쪽 좋아요 주변 중복 보정 버튼만 숨김. 1인/구독자/비밀방은 건드리지 않음. */
(function(){
  if(window.__ktTopBeautyDuplicateFixInstalled)return;
  window.__ktTopBeautyDuplicateFixInstalled=true;

  function visible(el){
    try{
      var r=el.getBoundingClientRect();
      var cs=getComputedStyle(el);
      return cs.display!=='none'&&cs.visibility!=='hidden'&&parseFloat(cs.opacity||'1')>0&&r.width>=20&&r.height>=20;
    }catch(e){return false;}
  }

  function isLike(btn){
    var txt=String(btn.textContent||'').replace(/\s+/g,'');
    var oc=String(btn.getAttribute('onclick')||'');
    return txt.indexOf('좋아요')>-1||oc.indexOf('addHostLike')>-1;
  }

  function isBeautySparkle(btn){
    var txt=String(btn.textContent||'').replace(/\s+/g,'');
    var oc=String(btn.getAttribute('onclick')||'');
    if(txt.indexOf('좋아요')>-1||txt.indexOf('효과')>-1||txt.indexOf('선물')>-1||txt.indexOf('매치')>-1)return false;
    return txt==='✨'||txt==='✦'||txt==='✨보정'||txt==='보정'||txt.indexOf('AI보정')>-1||oc.indexOf('openBeautyPanel')>-1;
  }

  function freezeLike(btn){
    try{
      btn.style.setProperty('animation','none','important');
      btn.style.setProperty('transition','none','important');
      btn.style.setProperty('visibility','visible','important');
      btn.style.setProperty('opacity','1','important');
      btn.style.setProperty('filter','none','important');
      btn.style.setProperty('will-change','auto','important');
      btn.setAttribute('data-kt-like-steady','1');
    }catch(e){}
  }

  function fix(){
    var screen=document.getElementById('screen');
    if(!screen)return;
    if(!screen.querySelector('.ktg13-room'))return;

    var buttons=Array.prototype.slice.call(screen.querySelectorAll('button'));
    var likes=buttons.filter(function(b){return isLike(b)&&visible(b);});
    likes.forEach(function(like){
      freezeLike(like);
      var lr=like.getBoundingClientRect();
      buttons.forEach(function(btn){
        if(btn===like||!isBeautySparkle(btn)||!visible(btn))return;
        var r=btn.getBoundingClientRect();
        var sameRight=Math.abs(r.right-lr.right)<45||Math.abs((r.left+r.width/2)-(lr.left+lr.width/2))<45;
        var justAbove=r.top<lr.top&&r.bottom>=lr.top-90;
        var overlapping=r.bottom>lr.top-8&&r.top<lr.bottom;
        if(sameRight&&(justAbove||overlapping)){
          btn.style.setProperty('display','none','important');
          btn.setAttribute('data-kt-hidden-top-beauty-duplicate','1');
        }
      });
    });
  }

  var timer=0;
  function schedule(){clearTimeout(timer);timer=setTimeout(fix,20);}
  var obs=new MutationObserver(schedule);
  obs.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',schedule,true);
  window.addEventListener('resize',schedule);
  setTimeout(fix,60);
  setTimeout(fix,250);
})();