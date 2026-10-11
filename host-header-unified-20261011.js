/* Owner-authorized host header only. Reuse attendance and like counters and handlers. */
(function(){
  if(window.__ktHostHeaderUnified20261011)return;
  window.__ktHostHeaderUnified20261011=true;
  function style(el,values){
    if(!el)return;
    Object.keys(values).forEach(function(k){if(el.style.getPropertyValue(k)!==values[k])el.style.setProperty(k,values[k],'important');});
  }
  function apply(room){
    if(room.matches('.ktg13-room[data-kt-room="13"]'))return;
    if(room.closest('.kt-remote-live,.kt-guest-hostlike-room')||room.hasAttribute('data-kt-remote13'))return;
    var head=room.querySelector('.ktsolo-head,.ktg13-head,.ktg9-head,.ktsubscriber-head,.ktsecret-head');
    var attend=head&&head.querySelector('.ktsolo-att,.ktg13-attend,.kt-live-attendance,.ktsubscriber-att,.ktsecret-att');
    var brand=head&&head.querySelector('.ktsolo-brand,.ktg13-brand,.ktg9-brand,.ktsubscriber-brand,.ktsecret-brand');
    var title=head&&head.querySelector('.ktsolo-title,.ktg13-title-row,.ktg13-air strong,.ktg9-title,.ktsubscriber-title,.ktsecret-title');
    if(!head||!attend||!brand||!title)return;
    var row=head.querySelector('.kt-host-unified-title');
    if(!row&&head.querySelector('.kt-host-unified-column')){row=title.parentNode;row.classList.add('kt-host-unified-title');}
    if(!row){
      if(title.classList.contains('ktg13-title-row'))row=title;
      else{
        row=document.createElement('div');
        title.parentNode.insertBefore(row,title);
        row.appendChild(title);
      }
      row.classList.add('kt-host-unified-title');
    }
    if(attend.parentNode!==row)row.appendChild(attend);
    var column=head.querySelector('.kt-host-unified-column');
    if(!column){
      column=document.createElement('div');column.className='kt-host-unified-column';
      head.insertBefore(column,head.firstChild);
      var left=head.querySelector('.ktsolo-left,.ktsubscriber-left,.ktsecret-left');
      var air=head.querySelector('.ktg13-air');
      column.appendChild(left||air||row);
    }
    var clock=room.querySelector('#ktLiveClock');
    if(clock){
      var clockRow=clock.closest('small,.ktsolo-air,.ktsubscriber-air,.ktsecret-airrow,.ktg9-air');
      if(clockRow&&clockRow.parentNode!==column)column.appendChild(clockRow);
      style(clockRow,{display:'flex','align-items':'center',gap:'4px',margin:'5px 0 0',height:'24px','min-height':'24px','flex-basis':'auto','font-size':'12px','font-weight':'900'});
    }
    style(head,{display:'grid','grid-template-columns':'minmax(0,1fr) auto',gap:'4px',padding:'5px 6px',height:'64px','min-height':'64px','max-height':'64px','flex-basis':'64px','box-sizing':'border-box','align-items':'center'});
    style(column,{'min-width':'0'});
    style(row,{display:'flex','align-items':'center','flex-wrap':'nowrap',gap:'4px','min-width':'0','white-space':'nowrap'});
    style(row.querySelector('strong,.ktsolo-title,.ktg9-title,.ktsubscriber-title,.ktsecret-title'),{'font-size':'clamp(14px,4vw,18px)','font-weight':'950',margin:'0','min-width':'0',overflow:'hidden','text-overflow':'ellipsis','white-space':'nowrap',flex:'0 1 auto'});
    style(attend,{flex:'0 0 auto','min-width':'72px',width:'80px','max-width':'80px',height:'29px','min-height':'29px','max-height':'29px',padding:'0 3px','font-size':'10px',margin:'0','box-sizing':'border-box'});
    style(brand,{'font-size':'12px','white-space':'nowrap','justify-self':'end'});
    var heart=room.querySelector('.kt-attendance-heart-badge');
    if(heart){
      if(heart.previousElementSibling!==attend)attend.insertAdjacentElement('afterend',heart);
      style(heart,{position:'static',transform:'none',flex:'0 0 auto','min-width':'30px',width:'auto',height:'29px',padding:'0 5px',margin:'0','line-height':'1','z-index':'auto','font-size':'11px','box-sizing':'border-box'});
    }
    var like=room.querySelector('.kt-clock-like-20260927');
    if(clock&&like){
      if(like.previousElementSibling!==clock)clock.insertAdjacentElement('afterend',like);
      style(like,{width:'auto','min-width':'36px',height:'24px',padding:'0 5px'});
      style(like.querySelector('b'),{'font-size':'20px'});
    }
  }
  function sync(){document.querySelectorAll('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,#screen .ktsubscriber-room,#screen .ktsecret-room').forEach(apply);}
  window.ktSyncHostHeaders20261011=sync;
  sync();
  var timer;
  new MutationObserver(function(){if(timer)return;timer=setTimeout(function(){timer=null;sync();},30);}).observe(document.documentElement,{childList:true,subtree:true});
  window.addEventListener('resize',sync);
})();
