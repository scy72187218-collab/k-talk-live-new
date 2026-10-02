/* K-Talk 구독자방만: 16명 방: 호스트 1칸 + 게스트 15칸으로 4x4 전체 채움. 다른 방/기능은 건드리지 않음. */
(function(){
  if(window.__ktSubscriber16LayoutInstalled)return;
  window.__ktSubscriber14GuestsLayoutInstalled=true;

  function addStyle(){
    if(document.getElementById('ktSubscriber16LayoutStyle'))return;
    var s=document.createElement('style');
    s.id='ktSubscriber14GuestsLayoutStyle';
    s.textContent=''
      +'html body #screen .ktsubscriber-room .ktsubscriber-people{grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-template-rows:repeat(4,minmax(0,1fr))!important;grid-auto-flow:row!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-host{grid-column:auto!important;grid-row:auto!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-guest{grid-column:auto!important;grid-row:auto!important;min-width:0!important;min-height:0!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-guest>span{font-size:18px!important}'
      +'html body #screen .ktsubscriber-room .ktsubscriber-guest>b{font-size:7px!important;left:3px!important;bottom:3px!important;padding:2px 4px!important}';
    document.head.appendChild(s);
  }

  function ensure(){
    var people=document.querySelector('.ktsubscriber-room .ktsubscriber-people');
    if(!people)return;
    addStyle();
    var guests=[].slice.call(people.querySelectorAll(':scope > .ktsubscriber-guest'));
    while(guests.length>14){
      var extra=guests.pop();
      if(extra)extra.remove();
    }
    for(var i=guests.length+1;i<=14;i++){
      var d=document.createElement('div');
      d.className='ktsubscriber-guest';
      d.setAttribute('data-guest-slot',String(i));
      d.innerHTML='<span>👤</span><b>게스트</b>';
      people.appendChild(d);
    }
  }

  ensure();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(ensure,ms);});
  try{
    var mo=new MutationObserver(function(){ensure();});
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
