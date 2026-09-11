/* K-Talk 13명방 전용: 호스트를 위 3줄 높이로 줄이고, 그 아래 빈 게스트 1칸만 추가. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktGroup13HostThreeRowsInstalled)return;
  window.__ktGroup13HostThreeRowsInstalled=true;

  function addStyle(){
    if(document.getElementById('ktGroup13HostThreeRowsStyle'))return;
    var s=document.createElement('style');
    s.id='ktGroup13HostThreeRowsStyle';
    s.textContent='\
      #screen .ktg13-room .ktg13-main{grid-template-rows:repeat(4,minmax(0,1fr))!important;}\
      #screen .ktg13-room .ktg13-host{grid-column:1!important;grid-row:1/4!important;}\
      #screen .ktg13-room .ktg13-guests{grid-column:2!important;grid-row:1/5!important;}\
      #screen .ktg13-room .ktg13-host-extra{grid-column:1!important;grid-row:4!important;display:grid!important;place-items:center!important;min-width:0!important;min-height:0!important;}';
    document.head.appendChild(s);
  }

  function apply(){
    var room=document.querySelector('.ktg13-room');
    if(!room)return;
    addStyle();
    var main=room.querySelector('.ktg13-main');
    var host=room.querySelector('.ktg13-host');
    var guests=room.querySelector('.ktg13-guests');
    if(!main||!host||!guests)return;
    if(!main.querySelector('.ktg13-host-extra')){
      var extra=document.createElement('div');
      extra.className='ktg13-guest ktg13-host-extra';
      extra.innerHTML='<span>게스트</span>';
      main.insertBefore(extra,guests);
    }
  }

  apply();
  [50,150,350,700,1200].forEach(function(ms){setTimeout(apply,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup13HostThreeRowsTimer);
      window.__ktGroup13HostThreeRowsTimer=setTimeout(apply,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
