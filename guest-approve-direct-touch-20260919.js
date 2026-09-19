/* K-Talk 9명방 호스트: 참여 신청 '올리기' 버튼 터치 보강.
   다른 방/레이아웃/채팅/카메라는 변경하지 않음. */
(function(){
  if(window.__ktGuestApproveDirectTouch20260919)return;
  window.__ktGuestApproveDirectTouch20260919=true;

  var selected=null,lastAt=0;

  function cleanName(s){
    return String(s||'게스트')
      .replace(/^[^가-힣A-Za-z0-9]+/,'')
      .replace(/\s*참여\s*신청.*$/,'')
      .replace(/\s*눌러서\s*선택.*$/,'')
      .trim()||'게스트';
  }

  function rememberFromLine(line){
    if(!line)return;
    var vid=String(line.getAttribute('data-viewer-id')||'');
    if(!vid)return;
    var b=line.querySelector('b');
    selected={vid:vid,name:cleanName(b?b.textContent:line.textContent)};
  }

  document.addEventListener('pointerdown',function(e){
    var line=e.target&&e.target.closest?e.target.closest('.ktGuestPendingLine[data-viewer-id]'):null;
    if(line)rememberFromLine(line);
  },true);

  document.addEventListener('click',function(e){
    var line=e.target&&e.target.closest?e.target.closest('.ktGuestPendingLine[data-viewer-id]'):null;
    if(line)rememberFromLine(line);
  },true);

  function resolveChoice(btn){
    var box=btn&&btn.closest?btn.closest('#ktGuestHostChoice'):null;
    if(box){
      var v=String(box.dataset.viewerId||'');
      if(v)return {vid:v,name:String(box.dataset.viewerName||'게스트')};
    }
    if(selected&&selected.vid)return selected;
    var lines=[].slice.call(document.querySelectorAll('.ktGuestPendingLine[data-viewer-id]'));
    if(lines.length===1){
      rememberFromLine(lines[0]);
      return selected;
    }
    return null;
  }

  function approveNow(e){
    var btn=e.target&&e.target.closest?e.target.closest('#ktGuestHostChoice .approve'):null;
    if(!btn)return;
    var now=Date.now();
    if(now-lastAt<450){
      try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(z){}
      return;
    }
    var x=resolveChoice(btn);
    if(!x||!x.vid)return;
    lastAt=now;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(z){}

    btn.disabled=false;
    btn.style.setProperty('pointer-events','auto','important');
    btn.style.setProperty('touch-action','manipulation','important');

    var tries=0;
    var run=function(){
      tries++;
      try{
        if(typeof window.ktApproveGuest==='function'){
          window.ktApproveGuest(x.vid,x.name,null);
          var box=document.getElementById('ktGuestHostChoice');
          if(box)box.remove();
          return;
        }
      }catch(z){}
      if(tries<20)setTimeout(run,120);
    };
    run();
  }

  window.addEventListener('pointerdown',approveNow,true);
  window.addEventListener('touchstart',approveNow,{capture:true,passive:false});

  function unlock(){
    try{
      document.querySelectorAll('#ktGuestHostChoice button,.ktGuestPendingLine').forEach(function(el){
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
        if('disabled' in el)el.disabled=false;
      });
    }catch(e){}
  }
  unlock();
  setInterval(unlock,500);
})();