/* K-Talk final lock: remove only 되돌리기 / 패키지상자 / 매치 controls.
   Keep 보물상자 and every other room control unchanged. 1150617 */
(function(){
  if(window.__ktRemoveUndoPackageMatchFinal20261005)return;
  window.__ktRemoveUndoPackageMatchFinal20261005=true;

  var roots='.ktsolo-room,.ktg9-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room,.kt-remote-live';

  function norm(x){
    return String(x||'').replace(/\s+/g,'').trim();
  }
  function unwanted(btn){
    if(!btn)return false;
    var t=norm(btn.textContent);
    var a=norm(btn.getAttribute&&btn.getAttribute('aria-label'));
    return t==='되돌리기'||a==='되돌리기'||
           t==='패키지상자'||a==='패키지상자'||
           t==='매치'||a==='매치';
  }
  function clean(root){
    try{
      (root||document).querySelectorAll('#screen '+roots).forEach(function(room){
        room.querySelectorAll('button').forEach(function(btn){
          if(unwanted(btn)){
            try{btn.remove();}catch(e){}
          }
        });
        room.querySelectorAll('.kt-live-top-quickbar').forEach(function(row){
          try{
            if(!row.querySelector('button'))row.remove();
          }catch(e){}
        });
      });
    }catch(e){}
  }

  var st=document.createElement('style');
  st.id='ktRemoveUndoPackageMatchFinalStyle20261005';
  st.textContent=
    '#screen :is('+roots+') button[aria-label="되돌리기"],'+
    '#screen :is('+roots+') button[aria-label="패키지 상자"],'+
    '#screen :is('+roots+') button[aria-label="패키지상자"],'+
    '#screen :is('+roots+') button[aria-label="매치"]{display:none!important;visibility:hidden!important;pointer-events:none!important}';
  (document.head||document.documentElement).appendChild(st);

  clean(document);
  try{
    var timer=0;
    new MutationObserver(function(muts){
      clearTimeout(timer);
      timer=setTimeout(function(){clean(document);},60);
    }).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();