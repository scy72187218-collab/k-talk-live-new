/* 1111 2026-10-06: old undo / treasure(package) / match quickbar retired.
   Remove it from host and guest/viewer rooms. Do not recreate it.
   Other room UI/features remain untouched. */
(function(){
  function removeOld(){
    try{
      document.querySelectorAll(
        '#screen .kt-live-top-quickbar,'+
        '#screen .kgh-quick,'+
        '#screen .ktg13-quick,'+
        '#screen .ktsolo-quick,'+
        '#screen .ktsubscriber-quick,'+
        '#screen .ktsecret-quick,'+
        '#screen .kt-canonical-three-7777,'+
        '#screen [data-kt-canonical-three="7777"]'
      ).forEach(function(el){try{el.remove();}catch(e){}});
    }catch(e){}
  }
  if(!document.getElementById('ktRetireOldQuickbars1111')){
    var s=document.createElement('style');
    s.id='ktRetireOldQuickbars1111';
    s.textContent='#screen .kt-live-top-quickbar,#screen .kgh-quick,#screen .ktg13-quick,#screen .ktsolo-quick,#screen .ktsubscriber-quick,#screen .ktsecret-quick,#screen .kt-canonical-three-7777,#screen [data-kt-canonical-three="7777"]{display:none!important}';
    (document.head||document.documentElement).appendChild(s);
  }
  removeOld();
  [0,20,60,120,250,500,1000,1800,3000].forEach(function(ms){setTimeout(removeOld,ms);});
  try{new MutationObserver(removeOld).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});}catch(e){}
})();

/* 1인방·9명방·13명방·구독자방·비밀방 선물줄만 동일한 아이콘/글씨 스타일로 통일. 외부 이미지 파일을 쓰지 않아 글씨 깨짐/이미지 깨짐을 방지. */
(function(){
  if(window.__ktUnifiedGiftIconsFiveRooms20260915)return;
  window.__ktUnifiedGiftIconsFiveRooms20260915=true;

  var old=document.getElementById('ktCopySoloGiftStyle20260915');
  if(old)old.remove();

  if(!document.getElementById('ktUnifiedGiftIconsFiveRoomsStyle20260915')){
    var st=document.createElement('style');
    st.id='ktUnifiedGiftIconsFiveRoomsStyle20260915';
    st.textContent=''
      +'#screen .ktsolo-gifts,#screen .ktg13-gifts,#screen .ktsubscriber-gifts,#screen .ktsecret-gifts{display:grid!important;grid-template-columns:repeat(7,minmax(0,1fr))!important;gap:3px!important}'
      +'#screen .kt-unified-gift{min-width:0!important;border:1px solid rgba(255,255,255,.22)!important;border-radius:8px!important;background:linear-gradient(180deg,#111116,#09090c)!important;color:#fff!important;padding:2px 1px!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:flex-end!important;overflow:hidden!important;box-sizing:border-box!important;touch-action:manipulation!important}'
      +'#screen .kt-unified-gift-art{height:30px!important;display:grid!important;place-items:center!important;font-size:26px!important;line-height:1!important;filter:drop-shadow(0 1px 4px rgba(0,0,0,.9))!important}'
      +'#screen .kt-unified-gift-art.big{font-size:29px!important}'
      +'#screen .kt-unified-gift b{display:block!important;color:#ffe33d!important;font-size:10px!important;line-height:1!important;font-weight:950!important;white-space:nowrap!important}'
      +'#screen .kt-unified-gift small{display:block!important;margin-top:2px!important;color:#fff!important;font-size:8px!important;line-height:1.05!important;font-weight:900!important;text-align:center!important;white-space:normal!important}'
      +'@media(max-width:390px){#screen .kt-unified-gift-art{height:27px!important;font-size:23px!important}#screen .kt-unified-gift-art.big{font-size:26px!important}#screen .kt-unified-gift b{font-size:9px!important}#screen .kt-unified-gift small{font-size:7px!important}}';
    document.head.appendChild(st);
  }

  function item(prefix,icon,count,label,big){
    return '<button type="button" class="'+prefix+'-gift kt-unified-gift" onclick="if(window.openGifts)openGifts()">'
      +'<span class="kt-unified-gift-art'+(big?' big':'')+'">'+icon+'</span>'
      +'<b>'+count+'</b><small>'+label+'</small></button>';
  }

  function markup(prefix){
    return ''
      +item(prefix,'🌹','1개','장미',false)
      +item(prefix,'💐','50개','장미다발',false)
      +item(prefix,'💐','100개','특대장미',true)
      +item(prefix,'💗','10개','하트',false)
      +item(prefix,'👑','100개','왕관',false)
      +item(prefix,'🏎️','50개','스포츠카',false)
      +item(prefix,'🎁','선물상자','큰 선물 보기',false);
  }

  function apply(selector,prefix){
    document.querySelectorAll(selector).forEach(function(row){
      var wanted=markup(prefix);
      if(row.dataset.ktUnifiedGiftIcons==='1'&&row.innerHTML===wanted)return;
      row.innerHTML=wanted;
      row.dataset.ktUnifiedGiftIcons='1';
    });
  }

  function normalize(){
    apply('.ktsolo-room .ktsolo-gifts','ktsolo');
    apply('.ktg13-room:not([data-kt-room="15"]) .ktg13-gifts','ktg13');
    apply('.ktsubscriber-room .ktsubscriber-gifts','ktsubscriber');
    apply('.ktsecret-room .ktsecret-gifts','ktsecret');
  }

  normalize();
  [30,90,180,350,700,1300,2200].forEach(function(ms){setTimeout(normalize,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktUnifiedGiftIconsFiveRoomsTimer20260915);
      window.__ktUnifiedGiftIconsFiveRoomsTimer20260915=setTimeout(normalize,25);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();

/* 비밀방만: 아까 승인한 5칸 배치(큰 호스트 1 + 오른쪽 게스트 4)로 복구. 선물/다른 방/기능은 건드리지 않음. */
(function(){
  if(window.__ktSecretFivePanelRestore20260915)return;
  window.__ktSecretFivePanelRestore20260915=true;
  var st=document.createElement('style');
  st.id='ktSecretFivePanelRestoreStyle20260915';
  st.textContent=''
    +'#screen .ktsecret-room .ktsecret-six-grid{grid-template-columns:40% 30% 30%!important;grid-template-rows:repeat(2,minmax(0,1fr))!important;gap:3px!important;padding:3px!important}'
    +'#screen .ktsecret-room .ktsecret-six-grid>.ktsecret-slot.host{grid-column:1!important;grid-row:1 / 3!important}'
    +'#screen .ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(2){grid-column:2!important;grid-row:1!important}'
    +'#screen .ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(3){grid-column:3!important;grid-row:1!important}'
    +'#screen .ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(4){grid-column:2!important;grid-row:2!important}'
    +'#screen .ktsecret-room .ktsecret-six-grid>.ktsecret-slot:nth-child(5){grid-column:3!important;grid-row:2!important}'
    +'#screen .ktsecret-room .ktsecret-main{min-height:0!important;flex:1 1 0!important}';
  document.head.appendChild(st);
})();
