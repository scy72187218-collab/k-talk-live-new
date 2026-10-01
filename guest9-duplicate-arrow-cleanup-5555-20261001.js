/* K-Talk guest 9-room duplicate chat-arrow cleanup — 2026-10-01 — PIN 5555
   ONLY remove the extra duplicate arrow beside the chat input.
   Keep the original/current chat arrow, blue people, gift, share, layout, chat, earnings, signaling, approval, camera/mic, and all other UI untouched.
*/
(function(){
  if(window.__ktGuest9DuplicateArrowCleanup5555_20261001)return;
  window.__ktGuest9DuplicateArrowCleanup5555_20261001=true;

  function isNine(root){
    if(!root)return false;
    try{
      if(root.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]'))return true;
      if(root.classList.contains('kt-g9-final-5555'))return true;
      var txt=String(root.textContent||'');
      var st=window.state||{};
      txt+=' '+String(st.liveRoomName||'')+' '+String(st.liveRoomType||'')+' '+String(st.liveRoomMax||'');
      var last=window.__ktLastLiveRoom||{};
      txt+=' '+String(last.room_name||'')+' '+String(last.room_type||'');
      return /9\s*명|group9/i.test(txt);
    }catch(e){return false;}
  }

  function arrowLike(btn){
    if(!btn || btn.tagName!=='BUTTON')return false;
    var t=String(btn.textContent||'').trim();
    var a=String(btn.getAttribute('aria-label')||'');
    var c=String(btn.className||'');
    return /^(➤|▶|►|➢|✈|→)$/.test(t) || /채팅 보내기/.test(a) || /\bsend\b/.test(c);
  }

  function clean(root){
    var bar=root.querySelector(':scope > .kt-remote-bottom')||root.querySelector('.kt-remote-bottom');
    if(!bar)return;
    var input=bar.querySelector('input');
    if(!input)return;

    var children=[].slice.call(bar.children);
    var inputIndex=children.indexOf(input);
    if(inputIndex<0)return;

    /* Only inspect the buttons immediately following the input, stopping at first non-arrow action. */
    var arrows=[];
    for(var i=inputIndex+1;i<children.length;i++){
      var el=children[i];
      if(el.tagName!=='BUTTON')continue;
      if(arrowLike(el))arrows.push(el);
      else break;
    }

    /* Keep the first/original arrow only; remove duplicate arrow(s) beside it. */
    if(arrows.length>1){
      for(var j=1;j<arrows.length;j++){
        try{arrows[j].remove();}catch(e){}
      }
    }
  }

  function apply(){
    document.querySelectorAll('#screen .kt-remote-live').forEach(function(root){
      if(isNine(root))clean(root);
    });
  }

  apply();
  [20,60,120,250,500,900,1500,2500,4000].forEach(function(ms){setTimeout(apply,ms);});
  window.addEventListener('pageshow',function(){setTimeout(apply,50);});
  window.addEventListener('kt-guest-approval-received',function(){[20,80,200,500].forEach(function(ms){setTimeout(apply,ms);});});
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktGuest9DuplicateArrowCleanup5555Timer);
      window.__ktGuest9DuplicateArrowCleanup5555Timer=setTimeout(apply,25);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();