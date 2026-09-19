/* K-Talk 동영상 상단 LIVE 카드: + 버튼과 종 버튼만 제거.
   프로필/이름/LIVE/방송 입장/다른 화면은 건드리지 않음. */
(function(){
  if(window.__ktLivePeekRemovePlusBell20260919)return;
  window.__ktLivePeekRemovePlusBell20260919=true;

  function removeOnlyPlusBell(root){
    root=root||document;
    var peek=null;
    try{
      peek=(root.id==='ktVideoLivePeek'?root:(root.querySelector?root.querySelector('#ktVideoLivePeek'):null))
        ||document.getElementById('ktVideoLivePeek');
    }catch(e){}
    if(!peek)return;

    try{
      peek.querySelectorAll('.ktvl-follow,.ktvl-bell,[data-kt-follow],[data-kt-bell]').forEach(function(b){
        try{b.remove();}catch(e){if(b.parentNode)b.parentNode.removeChild(b);}
      });
    }catch(e){}

    try{
      [].slice.call(peek.querySelectorAll('button')).forEach(function(b){
        if(b.classList.contains('ktvl-person')||b.classList.contains('ktvl-live'))return;
        var txt=String(b.textContent||'').replace(/\s+/g,'');
        var aria=String(b.getAttribute('aria-label')||'').replace(/\s+/g,'');
        var title=String(b.getAttribute('title')||'').replace(/\s+/g,'');
        var isPlus=txt==='+'||txt==='＋'||aria.indexOf('팔로우')>-1||title.indexOf('팔로우')>-1;
        var isBell=txt.indexOf('🔔')>-1||aria.indexOf('알림')>-1||title.indexOf('알림')>-1;
        if(isPlus||isBell){
          try{b.remove();}catch(e){if(b.parentNode)b.parentNode.removeChild(b);}
        }
      });
    }catch(e){}
  }

  function ensureStyle(){
    if(document.getElementById('ktLivePeekNoPlusBellStyle'))return;
    var s=document.createElement('style');
    s.id='ktLivePeekNoPlusBellStyle';
    s.textContent='#ktVideoLivePeek .ktvl-follow,#ktVideoLivePeek .ktvl-bell{display:none!important;visibility:hidden!important;pointer-events:none!important}';
    document.head.appendChild(s);
  }

  function refresh(){ensureStyle();removeOnlyPlusBell(document);}
  refresh();
  [100,300,700,1200,2200,4000].forEach(function(ms){setTimeout(refresh,ms);});

  try{
    new MutationObserver(function(records){
      var hit=false;
      records.forEach(function(r){
        [].slice.call(r.addedNodes||[]).forEach(function(n){
          if(n&&n.nodeType===1){
            if(n.id==='ktVideoLivePeek'||(n.querySelector&&n.querySelector('#ktVideoLivePeek,.ktvl-follow,.ktvl-bell')))hit=true;
          }
        });
      });
      if(hit)setTimeout(refresh,0);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  window.addEventListener('pageshow',refresh);
  window.addEventListener('focus',refresh);
})();