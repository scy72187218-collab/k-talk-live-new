/* K-Talk 파장 자동 생성만 수정: 13명방/구독자방/비밀방은 사람이 들어온 칸에만 파장 1개 자동 생성, 나가면 자동 제거. 다른 UI/기능은 변경하지 않음. */
(function(){
  if(window.__ktAutoParticipantWaveV8)return;
  window.__ktAutoParticipantWaveV8=true;

  function addStyle(){
    if(document.getElementById('ktAutoParticipantWaveV8Style'))return;
    var s=document.createElement('style');
    s.id='ktAutoParticipantWaveV8Style';
    s.textContent=`
      @keyframes ktAutoParticipantWaveMove{0%{transform:scaleY(.52)}45%{transform:scaleY(.82)}100%{transform:scaleY(1)}}

      /* 기존 비밀방 게스트6 빈칸 배치는 그대로 유지 */
      html body #screen .ktsecret-room .ktsecret-extra-pair{
        display:grid!important;
        grid-template-columns:minmax(0,1fr)!important;
        grid-template-rows:repeat(2,minmax(0,1fr))!important;
        gap:2px!important;
        min-width:0!important;
        min-height:0!important;
        overflow:hidden!important;
      }
      html body #screen .ktsecret-room .ktsecret-extra-pair>.ktsecret-slot{
        width:100%!important;
        height:100%!important;
        min-width:0!important;
        min-height:0!important;
      }

      /* 기존 아래쪽 공용 파장만 숨김. 사람 칸 파장만 사용 */
      html body #screen .ktsubscriber-room .ktsubscriber-wave,
      html body #screen .ktsecret-room .ktsecret-wave,
      html body #screen .ktsecret-room .kt-secret-wave,
      html body #screen .ktsecret-room .secret-wave,
      html body #screen .ktg13-main>.ktg13-wave-bars,
      html body #screen .ktg13-main .ktg13-wave-bars,
      html body #screen .ktsubscriber-room .kt-person-live-wave,
      html body #screen .ktsecret-room .kt-person-live-wave{
        display:none!important;
        animation:none!important;
      }
      html body #screen .ktg13-main::after{content:none!important;display:none!important}

      /* 파장은 사람 칸 안쪽 아래에만 표시 */
      html body #screen .ktg13-host,
      html body #screen .ktg13-guest{position:relative!important;overflow:hidden!important}

      html body #screen .ktg13-host>.kt-open-camera-wave,
      html body #screen .ktg13-guest>.kt-open-camera-wave,
      html body #screen .ktsubscriber-host>.kt-open-camera-wave,
      html body #screen .ktsubscriber-guest>.kt-open-camera-wave,
      html body #screen .ktsecret-slot>.kt-open-camera-wave,
      html body #screen .ktsecret-guest-slot>.kt-open-camera-wave{
        position:absolute!important;
        left:0!important;
        right:0!important;
        bottom:0!important;
        width:auto!important;
        height:42px!important;
        z-index:8!important;
        display:block!important;
        padding:0!important;
        overflow:hidden!important;
        pointer-events:none!important;
        opacity:.98!important;
        background:none!important;
        filter:drop-shadow(0 0 5px rgba(255,45,220,.55))!important;
        animation:none!important;
      }
      html body #screen .ktg13-host>.kt-open-camera-wave:before,
      html body #screen .ktg13-guest>.kt-open-camera-wave:before,
      html body #screen .ktsubscriber-host>.kt-open-camera-wave:before,
      html body #screen .ktsubscriber-guest>.kt-open-camera-wave:before,
      html body #screen .ktsecret-slot>.kt-open-camera-wave:before,
      html body #screen .ktsecret-guest-slot>.kt-open-camera-wave:before{
        content:""!important;
        position:absolute!important;
        left:0!important;
        right:0!important;
        top:0!important;
        bottom:0!important;
        background-image:url("k-talk-rainbow-waveform.svg?v=20260911-auto8")!important;
        background-repeat:no-repeat!important;
        background-position:center bottom!important;
        background-size:100% 100%!important;
        transform-origin:center bottom!important;
        will-change:transform!important;
        animation:ktAutoParticipantWaveMove var(--kt-wave-speed,.22s) ease-in-out var(--kt-wave-delay,0s) infinite alternate!important;
      }
      html body #screen .ktg13-host>.kt-open-camera-wave i,
      html body #screen .ktg13-guest>.kt-open-camera-wave i,
      html body #screen .ktsubscriber-host>.kt-open-camera-wave i,
      html body #screen .ktsubscriber-guest>.kt-open-camera-wave i,
      html body #screen .ktsecret-slot>.kt-open-camera-wave i,
      html body #screen .ktsecret-guest-slot>.kt-open-camera-wave i{display:none!important}

      @media(max-width:390px){
        html body #screen .ktg13-host>.kt-open-camera-wave,
        html body #screen .ktg13-guest>.kt-open-camera-wave,
        html body #screen .ktsubscriber-host>.kt-open-camera-wave,
        html body #screen .ktsubscriber-guest>.kt-open-camera-wave,
        html body #screen .ktsecret-slot>.kt-open-camera-wave,
        html body #screen .ktsecret-guest-slot>.kt-open-camera-wave{height:38px!important}
      }
    `;
    document.head.appendChild(s);
  }

  function liveVideo(v){
    if(!v||!v.isConnected)return false;
    try{
      var st=v.srcObject;
      if(st&&st.getVideoTracks){
        var tr=st.getVideoTracks();
        for(var i=0;i<tr.length;i++){
          if(tr[i]&&tr[i].readyState==='live'&&tr[i].enabled!==false)return true;
        }
      }
    }catch(e){}
    try{return v.readyState>=2&&!!(v.currentSrc||v.src);}catch(e){return false;}
  }

  function hasRealPhoto(tile){
    if(!tile)return false;
    var imgs=tile.querySelectorAll('img');
    for(var i=0;i<imgs.length;i++){
      var src=String(imgs[i].getAttribute('src')||'').trim();
      if(src)return true;
    }
    return false;
  }

  function hasJoinedFlag(tile){
    if(!tile)return false;
    var attrs=['data-user-id','data-guest-id','data-participant-id','data-live-user','data-occupied','data-connected'];
    for(var i=0;i<attrs.length;i++){
      var v=tile.getAttribute(attrs[i]);
      if(v!==null&&v!==''&&v!=='0'&&v!=='false')return true;
    }
    return tile.classList.contains('occupied')||tile.classList.contains('joined')||tile.classList.contains('connected')||tile.classList.contains('has-user')||tile.classList.contains('active-user');
  }

  function tileHasPerson(tile){
    if(!tile)return false;
    var videos=tile.querySelectorAll('video');
    for(var i=0;i<videos.length;i++)if(liveVideo(videos[i]))return true;
    if(hasRealPhoto(tile))return true;
    if(hasJoinedFlag(tile))return true;
    return false;
  }

  function ensureSecretSeventhSlot(){
    var grid=document.querySelector('.ktsecret-room .ktsecret-six-grid');
    if(!grid)return;
    if(grid.querySelector(':scope > .ktsecret-extra-pair'))return;
    var slots=[].slice.call(grid.querySelectorAll(':scope > .ktsecret-slot'));
    if(slots.length<6)return;
    var last=slots[slots.length-1];
    var pair=document.createElement('div');
    pair.className='ktsecret-extra-pair';
    grid.insertBefore(pair,last);
    pair.appendChild(last);
    var extra=document.createElement('div');
    extra.className='ktsecret-slot ktsecret-extra-slot';
    extra.innerHTML='<div class="ktsecret-guest-wait"><b>+</b><span>게스트 6</span></div>';
    pair.appendChild(extra);
  }

  function directWaves(tile){
    var out=[];
    if(!tile)return out;
    for(var i=0;i<tile.children.length;i++){
      var c=tile.children[i];
      if(c.classList&&c.classList.contains('kt-open-camera-wave'))out.push(c);
    }
    return out;
  }

  function setOneWave(tile,on,index){
    if(!tile)return;
    var waves=directWaves(tile);
    if(!on){
      waves.forEach(function(w){try{w.remove();}catch(e){}});
      return;
    }
    var wave=waves.shift();
    waves.forEach(function(extra){try{extra.remove();}catch(e){}});
    if(!wave){
      wave=document.createElement('div');
      wave.className='kt-open-camera-wave';
      wave.setAttribute('aria-hidden','true');
      tile.appendChild(wave);
    }
    wave.innerHTML='';
    var speeds=['.18s','.21s','.24s','.19s','.23s','.20s','.22s'];
    var delays=['-.03s','-.11s','-.17s','-.07s','-.14s','-.20s','-.09s'];
    wave.style.setProperty('--kt-wave-speed',speeds[index%speeds.length]);
    wave.style.setProperty('--kt-wave-delay',delays[index%delays.length]);
  }

  function sync(){
    addStyle();
    ensureSecretSeventhSlot();
    var idx=0;

    /* 13명방: 호스트/게스트에 사람이 들어온 칸만 자동 파장 */
    document.querySelectorAll('.ktg13-room .ktg13-host,.ktg13-room .ktg13-guest').forEach(function(tile){
      setOneWave(tile,tileHasPerson(tile),idx++);
    });

    /* 구독자방: 사람이 들어온 칸만 자동 파장 */
    document.querySelectorAll('.ktsubscriber-room .ktsubscriber-host,.ktsubscriber-room .ktsubscriber-guest').forEach(function(tile){
      setOneWave(tile,tileHasPerson(tile),idx++);
    });

    /* 비밀방: 사람이 들어온 칸만 자동 파장. 빈 게스트5/6에는 미리 만들지 않음 */
    document.querySelectorAll('.ktsecret-room .ktsecret-slot,.ktsecret-room .ktsecret-guest-slot').forEach(function(tile){
      setOneWave(tile,tileHasPerson(tile),idx++);
    });
  }

  sync();
  [80,220,500,900,1500].forEach(function(ms){setTimeout(sync,ms);});
  document.addEventListener('play',function(e){if(e.target&&e.target.tagName==='VIDEO')setTimeout(sync,0);},true);
  document.addEventListener('loadeddata',function(e){if(e.target&&e.target.tagName==='VIDEO')setTimeout(sync,0);},true);
  document.addEventListener('emptied',function(e){if(e.target&&e.target.tagName==='VIDEO')setTimeout(sync,0);},true);
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktAutoParticipantWaveTimer);
      window.__ktAutoParticipantWaveTimer=setTimeout(sync,30);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','class','data-user-id','data-guest-id','data-participant-id','data-live-user','data-occupied','data-connected']});
  }catch(e){}
})();
