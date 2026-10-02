/* K-Talk live-prep top button touch rescue.
   Exact scope: only .live-prep .prep-item / .prep-reward.
   Existing prepTap behavior is reused; no layout/room/broadcast logic changed. */
(function(){
  if(window.__ktLivePrepButtonTouchRescue20261002)return;
  window.__ktLivePrepButtonTouchRescue20261002=true;

  function prepName(btn){
    if(!btn)return '';
    var txt=String(btn.textContent||'').replace(/\s+/g,'');
    if(btn.classList.contains('prep-reward'))return '코인 리워드';
    if(txt.indexOf('편집효과')>-1)return '편집효과';
    if(txt.indexOf('멀티게스트')>-1)return '멀티게스트';
    if(txt.indexOf('서비스')>-1)return '서비스';
    if(txt.indexOf('팬클럽')>-1)return '팬클럽';
    if(txt.indexOf('소통하기')>-1)return '소통하기';
    if(txt.indexOf('공유')>-1)return '공유';
    if(txt.indexOf('설정')>-1)return '설정';
    if(txt.indexOf('전환')>-1)return '전환';
    return '';
  }

  function unlock(){
    try{
      document.querySelectorAll('#creator .live-prep .prep-item,#creator .live-prep .prep-reward').forEach(function(btn){
        btn.disabled=false;
        btn.removeAttribute('inert');
        btn.setAttribute('aria-disabled','false');
        btn.style.setProperty('pointer-events','auto','important');
        btn.style.setProperty('touch-action','manipulation','important');
        btn.style.setProperty('position','relative','important');
        btn.style.setProperty('z-index','8','important');
      });
    }catch(e){}
  }

  function rescue(e){
    var btn=e.target&&e.target.closest?e.target.closest('#creator .live-prep .prep-item,#creator .live-prep .prep-reward'):null;
    if(!btn)return;
    var creator=document.getElementById('creator');
    if(!creator||!creator.classList.contains('show')||!creator.classList.contains('live-prep-open'))return;
    var name=prepName(btn);
    if(!name||typeof window.prepTap!=='function')return;
    try{
      e.preventDefault();
      e.stopPropagation();
      if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    }catch(_e){}
    try{window.prepTap(btn,name);}catch(_e){}
  }

  document.addEventListener('pointerdown',rescue,true);
  if(!window.PointerEvent)document.addEventListener('touchstart',rescue,true);

  unlock();
  [80,220,500,900,1600].forEach(function(ms){setTimeout(unlock,ms);});
  try{
    new MutationObserver(function(){setTimeout(unlock,0);})
      .observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();