/* Retired 2026-10-06 by 1111 request.
   The duplicate 되돌리기 / 보물상자(패키지상자) / 매치 row must not appear
   below the room because these controls already exist above.
   Scope: all live rooms only; no room/video/chat/gift/signaling changes. */
(function(){
  function removeDuplicateThree(){
    try{
      document.querySelectorAll('#screen .kt-canonical-three-7777,[data-kt-canonical-three="7777"]').forEach(function(el){el.remove();});
    }catch(e){}
  }
  function hide(){
    if(document.getElementById('ktNoDuplicateThreeBottom20261006'))return;
    var s=document.createElement('style');
    s.id='ktNoDuplicateThreeBottom20261006';
    s.textContent='#screen .kt-canonical-three-7777,#screen [data-kt-canonical-three="7777"]{display:none!important}';
    (document.head||document.documentElement).appendChild(s);
  }
  hide();
  removeDuplicateThree();
  [0,20,60,120,250,500,1000,1800].forEach(function(ms){setTimeout(removeDuplicateThree,ms);});
  try{new MutationObserver(removeDuplicateThree).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
