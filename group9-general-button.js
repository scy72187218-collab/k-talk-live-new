/* 9명 일반방 버튼만 방송 선택에 보이게 정리. 다른 방 기능은 변경하지 않음. */
(function(){
  if(window.__ktGroup9GeneralButtonInstalled)return;
  window.__ktGroup9GeneralButtonInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktGroup9GeneralButtonStyle'))return;
    var st=document.createElement('style');
    st.id='ktGroup9GeneralButtonStyle';
    st.textContent=''
      +'.live-prep .kt-room9-general{min-height:52px!important;padding:7px 3px!important;font-size:12px!important;border-radius:14px!important;border:1px solid rgba(255,255,255,.12)!important;background:rgba(255,255,255,.07)!important;color:#d8d8df!important;font-weight:900!important;touch-action:manipulation!important}'
      +'.live-prep .kt-room9-general.on{color:#fff!important;border-color:#ff63b6!important;background:linear-gradient(135deg,#ff315f,#b14cff 65%,#704cff)!important;box-shadow:0 0 16px rgba(255,71,171,.35)!important}'
      +'.kt-creator-room-shortcuts.kt-has-room9{grid-template-columns:repeat(5,minmax(0,1fr))!important;width:min(98%,430px)!important}'
      +'.kt-creator-room-shortcuts .kt-room9-general-shortcut{font-size:9px!important;padding:0 1px!important}';
    document.head.appendChild(st);
  }

  function installPrepButton(){
    var prep=document.querySelector('.live-prep');
    if(!prep)return;
    var row=prep.querySelector('.room-switch-row');
    if(!row)return;
    ensureStyle();

    var thirteen=[].slice.call(row.querySelectorAll('.room-switch')).find(function(b){
      return String(b.textContent||'').replace(/\s+/g,'').indexOf('13명')>-1;
    });
    if(!thirteen)return;

    var b=row.querySelector('.kt-room9-switch,.kt-room9-general');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-room9-switch kt-room9-general';
      b.setAttribute('aria-pressed','false');
    }else{
      b.classList.remove('room-switch');
      b.classList.add('kt-room9-switch','kt-room9-general');
    }
    b.textContent='9명 일반방';
    b.removeAttribute('onclick');
    if(b.nextElementSibling!==thirteen)row.insertBefore(b,thirteen);
  }

  function selectNine(){
    try{
      if(window.state){
        state.liveRoomType='group9';
        state.liveRoomName='9명 일반방';
        state.liveRoomMax=9;
      }
      var title=document.getElementById('liveTitle');
      if(title){title.value='9명 일반방';title.dataset.autoRoom='1';}
      var box=document.getElementById('ktSecretPasswordBox');
      if(box){box.classList.remove('on');box.style.setProperty('display','none','important');}
    }catch(err){}
  }

  function installCreatorShortcut(){
    var row=document.querySelector('.kt-creator-room-shortcuts');
    if(!row)return;
    ensureStyle();
    row.classList.add('kt-has-room9');

    var buttons=[].slice.call(row.querySelectorAll('button'));
    var thirteen=buttons.find(function(b){
      return String(b.textContent||'').replace(/\s+/g,'').indexOf('13명')>-1;
    });
    if(!thirteen)return;

    var b=row.querySelector('.kt-room9-general-shortcut');
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.className='kt-room9-general-shortcut';
      b.textContent='9명 일반방';
      b.onclick=function(){
        selectNine();
        if(window.openTikLivePrep)window.openTikLivePrep();
        setTimeout(function(){
          installPrepButton();
          var p=document.querySelector('.live-prep .kt-room9-general,.live-prep .kt-room9-switch');
          if(p&&p.click)p.click();
        },30);
      };
    }
    if(b.nextElementSibling!==thirteen)row.insertBefore(b,thirteen);
  }

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.kt-room9-general'):null;
    if(!b)return;
    e.preventDefault();
    e.stopPropagation();
    try{
      document.querySelectorAll('.live-prep .room-switch,.live-prep .kt-room9-general').forEach(function(x){
        x.classList.toggle('on',x===b);
        x.setAttribute('aria-pressed',x===b?'true':'false');
      });
      selectNine();
    }catch(err){}
  },true);

  function install(){
    installPrepButton();
    installCreatorShortcut();
  }

  install();
  [60,160,350,700,1200].forEach(function(ms){setTimeout(install,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup9GeneralButtonTimer);
      window.__ktGroup9GeneralButtonTimer=setTimeout(install,20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();