/* K-Talk 사람 화면 배치 조절 전용: 13명방/구독자방/비밀방만. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktRoomPersonLayoutControlsInstalled)return;
  window.__ktRoomPersonLayoutControlsInstalled=true;

  var selected=null;
  var drag=null;

  function roomInfo(){
    var room=document.querySelector('.ktg13-room');
    if(room)return {room:room,key:'group13',tiles:'.ktg13-host,.ktg13-guest'};
    room=document.querySelector('.ktsubscriber-room');
    if(room)return {room:room,key:'subscriber',tiles:'.ktsubscriber-host,.ktsubscriber-guest'};
    room=document.querySelector('.ktsecret-room');
    if(room)return {room:room,key:'secret',tiles:'.ktsecret-slot,.ktsecret-guest-slot'};
    return null;
  }

  function mediaOf(tile){
    if(!tile)return null;
    return tile.querySelector('video,img');
  }

  function tileIndex(info,tile){
    var list=[].slice.call(info.room.querySelectorAll(info.tiles));
    return Math.max(0,list.indexOf(tile));
  }

  function stateKey(info,tile){
    return 'kt_person_layout_'+info.key+'_'+tileIndex(info,tile);
  }

  function readState(info,tile){
    var base={x:50,y:50,zoom:1,shape:1};
    try{
      var v=JSON.parse(localStorage.getItem(stateKey(info,tile))||'null');
      if(v&&typeof v==='object'){
        if(isFinite(v.x))base.x=Math.max(0,Math.min(100,Number(v.x)));
        if(isFinite(v.y))base.y=Math.max(0,Math.min(100,Number(v.y)));
        if(isFinite(v.zoom))base.zoom=Math.max(.75,Math.min(1.65,Number(v.zoom)));
        if(isFinite(v.shape))base.shape=Math.max(1,Math.min(3,Number(v.shape)));
      }
    }catch(e){}
    return base;
  }

  function writeState(info,tile,st){
    try{localStorage.setItem(stateKey(info,tile),JSON.stringify(st));}catch(e){}
  }

  function shapeRadius(n){
    if(n===1)return '7px';
    if(n===2)return '18px';
    return '32px';
  }

  function applyState(info,tile,st){
    if(!tile)return;
    var m=mediaOf(tile);
    tile.style.setProperty('border-radius',shapeRadius(st.shape),'important');
    if(m){
      m.style.setProperty('object-position',st.x+'% '+st.y+'%','important');
      try{m.style.setProperty('scale',String(st.zoom),'important');}catch(e){}
      m.dataset.ktPersonLayout='1';
    }
    tile.dataset.ktPersonX=String(st.x);
    tile.dataset.ktPersonY=String(st.y);
    tile.dataset.ktPersonZoom=String(st.zoom);
    tile.dataset.ktPersonShape=String(st.shape);
  }

  function currentState(info,tile){
    var st=readState(info,tile);
    if(tile&&tile.dataset){
      if(tile.dataset.ktPersonX)st.x=Number(tile.dataset.ktPersonX)||50;
      if(tile.dataset.ktPersonY)st.y=Number(tile.dataset.ktPersonY)||50;
      if(tile.dataset.ktPersonZoom)st.zoom=Number(tile.dataset.ktPersonZoom)||1;
      if(tile.dataset.ktPersonShape)st.shape=Number(tile.dataset.ktPersonShape)||1;
    }
    return st;
  }

  function selectTile(tile){
    var info=roomInfo();
    if(!info||!tile)return;
    if(selected)selected.classList.remove('kt-person-layout-selected');
    selected=tile;
    selected.classList.add('kt-person-layout-selected');
    var st=currentState(info,tile);
    applyState(info,tile,st);
  }

  function changeSelected(kind,value){
    var info=roomInfo();
    if(!info||!selected||!info.room.contains(selected))return;
    var st=currentState(info,selected);
    if(kind==='up')st.y=Math.max(0,st.y-7);
    if(kind==='down')st.y=Math.min(100,st.y+7);
    if(kind==='left')st.x=Math.max(0,st.x-7);
    if(kind==='right')st.x=Math.min(100,st.x+7);
    if(kind==='bigger')st.zoom=Math.min(1.65,Math.round((st.zoom+.1)*100)/100);
    if(kind==='smaller')st.zoom=Math.max(.75,Math.round((st.zoom-.1)*100)/100);
    if(kind==='shape')st.shape=value;
    if(kind==='reset'){st={x:50,y:50,zoom:1,shape:1};}
    applyState(info,selected,st);
    writeState(info,selected,st);
  }

  function addStyle(){
    if(document.getElementById('ktPersonLayoutControlsStyle'))return;
    var s=document.createElement('style');
    s.id='ktPersonLayoutControlsStyle';
    s.textContent=`
      .kt-person-layout-launch{position:fixed!important;right:7px!important;top:45%!important;z-index:2147482000!important;width:44px!important;height:36px!important;border:1px solid #ffffff45!important;border-radius:13px!important;background:#111d!important;color:#fff!important;font-size:11px!important;font-weight:950!important;box-shadow:0 2px 12px #0009!important}
      .kt-person-layout-panel{position:fixed!important;right:7px!important;top:calc(45% + 42px)!important;z-index:2147482000!important;width:154px!important;padding:7px!important;border:1px solid #ffffff38!important;border-radius:14px!important;background:#0d0d11f2!important;box-shadow:0 8px 28px #000c!important;display:none!important;grid-template-columns:repeat(3,1fr)!important;gap:5px!important}
      .kt-person-layout-panel.on{display:grid!important}
      .kt-person-layout-panel button{height:34px!important;border:1px solid #ffffff2b!important;border-radius:10px!important;background:#1b1b22!important;color:#fff!important;font-size:11px!important;font-weight:900!important;padding:0 4px!important}
      .kt-person-layout-panel .wide{grid-column:span 3!important}
      .kt-person-layout-selected{outline:2px solid #ffd43b!important;outline-offset:-2px!important}
      .ktg13-host,.ktg13-guest,.ktsubscriber-host,.ktsubscriber-guest,.ktsecret-slot,.ktsecret-guest-slot{touch-action:none}
    `;
    document.head.appendChild(s);
  }

  function ensurePanel(){
    var info=roomInfo();
    var oldBtn=document.getElementById('ktPersonLayoutLaunch');
    var oldPanel=document.getElementById('ktPersonLayoutPanel');
    if(!info){
      if(oldBtn)oldBtn.remove();
      if(oldPanel)oldPanel.remove();
      selected=null;
      return;
    }
    addStyle();
    if(!oldBtn){
      var b=document.createElement('button');
      b.id='ktPersonLayoutLaunch';
      b.className='kt-person-layout-launch';
      b.type='button';
      b.textContent='배치';
      b.onclick=function(e){
        e.stopPropagation();
        var p=document.getElementById('ktPersonLayoutPanel');
        if(p)p.classList.toggle('on');
      };
      document.body.appendChild(b);
    }
    if(!oldPanel){
      var p=document.createElement('div');
      p.id='ktPersonLayoutPanel';
      p.className='kt-person-layout-panel';
      p.innerHTML=''
        +'<button data-act="shape" data-v="1">박스1</button><button data-act="shape" data-v="2">박스2</button><button data-act="shape" data-v="3">박스3</button>'
        +'<button data-act="left">←</button><button data-act="up">↑</button><button data-act="right">→</button>'
        +'<button data-act="smaller">작게</button><button data-act="down">↓</button><button data-act="bigger">크게</button>'
        +'<button class="wide" data-act="reset">원래대로</button>';
      p.addEventListener('click',function(e){
        var btn=e.target.closest('button');
        if(!btn)return;
        e.stopPropagation();
        var act=btn.dataset.act;
        if(act==='shape')changeSelected('shape',Number(btn.dataset.v)||1);
        else changeSelected(act);
      });
      document.body.appendChild(p);
    }

    var tiles=info.room.querySelectorAll(info.tiles);
    tiles.forEach(function(tile){
      if(tile.dataset.ktPersonLayoutBound==='1')return;
      tile.dataset.ktPersonLayoutBound='1';
      var st=readState(info,tile);
      applyState(info,tile,st);

      tile.addEventListener('click',function(e){
        var panel=document.getElementById('ktPersonLayoutPanel');
        if(!panel||!panel.classList.contains('on'))return;
        if(e.target.closest('button'))return;
        e.stopPropagation();
        selectTile(tile);
      },true);

      tile.addEventListener('pointerdown',function(e){
        var panel=document.getElementById('ktPersonLayoutPanel');
        if(!panel||!panel.classList.contains('on'))return;
        if(!mediaOf(tile))return;
        selectTile(tile);
        var cur=currentState(info,tile);
        drag={tile:tile,startX:e.clientX,startY:e.clientY,x:cur.x,y:cur.y};
        try{tile.setPointerCapture(e.pointerId);}catch(err){}
        e.preventDefault();
      },true);

      tile.addEventListener('pointermove',function(e){
        if(!drag||drag.tile!==tile)return;
        var r=tile.getBoundingClientRect();
        if(!r.width||!r.height)return;
        var st=currentState(info,tile);
        st.x=Math.max(0,Math.min(100,drag.x+(e.clientX-drag.startX)/r.width*100));
        st.y=Math.max(0,Math.min(100,drag.y+(e.clientY-drag.startY)/r.height*100));
        applyState(info,tile,st);
        e.preventDefault();
      },true);

      function finishDrag(){
        if(!drag||drag.tile!==tile)return;
        var st=currentState(info,tile);
        writeState(info,tile,st);
        drag=null;
      }
      tile.addEventListener('pointerup',finishDrag,true);
      tile.addEventListener('pointercancel',finishDrag,true);
    });
  }

  ensurePanel();
  [100,350,800,1500].forEach(function(ms){setTimeout(ensurePanel,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktPersonLayoutTimer);
      window.__ktPersonLayoutTimer=setTimeout(ensurePanel,45);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
