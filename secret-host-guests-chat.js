/* K-Talk 비밀방: 호스트·게스트·채팅 3가지만 보강. 선물/출석/수익/버튼 등 기존 UI는 변경하지 않음. */
(function(){
  if(window.__ktSecretHostGuestsChatInstalled)return;
  window.__ktSecretHostGuestsChatInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktSecretHostGuestsChatStyle'))return;
    var s=document.createElement('style');
    s.id='ktSecretHostGuestsChatStyle';
    s.textContent=''
      +'.ktsecret-main{position:relative!important}'
      +'.ktsecret-host-tag{position:absolute;left:10px;top:10px;z-index:21;display:inline-flex;align-items:center;gap:5px;padding:5px 9px;border-radius:10px;border:1px solid rgba(255,75,215,.75);background:rgba(20,8,22,.72);box-shadow:0 0 10px rgba(255,35,205,.38);color:#fff;font-size:11px;font-weight:950;pointer-events:none}'
      +'.ktsecret-host-tag b{color:#ffd86a}.ktsecret-host-tag span{color:#ff71dd}'
      +'.ktsecret-guest-panel{position:absolute;right:8px;top:8px;z-index:20;width:min(46%,230px);display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:4px;pointer-events:auto}'
      +'.ktsecret-guest-slot{position:relative;aspect-ratio:3/4;min-height:66px;overflow:hidden;border:1px solid rgba(255,87,219,.56);border-radius:9px;background:linear-gradient(160deg,rgba(32,32,38,.94),rgba(12,12,16,.96));box-shadow:0 0 6px rgba(255,40,205,.22)}'
      +'.ktsecret-guest-slot video{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;transform:none!important;background:#15151a!important}'
      +'.ktsecret-guest-empty{position:absolute;inset:0;display:grid;place-items:center;text-align:center;color:#d4d4dc;font-size:18px;font-weight:900}.ktsecret-guest-empty small{display:block;margin-top:2px;color:#aaa;font-size:8px}'
      +'.ktsecret-guest-name{position:absolute;left:4px;right:4px;bottom:4px;z-index:2;padding:3px 5px;border-radius:7px;background:rgba(0,0,0,.58);color:#fff;font-size:8px;font-weight:900;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      +'.ktsecret-chat{left:8px!important;right:48%!important;bottom:70px!important;max-height:48%!important;height:auto!important;min-height:0!important;padding:0 5px 6px!important;background:transparent!important;border-radius:0!important;display:flex!important;flex-direction:column!important;justify-content:flex-end!important;overflow:hidden!important;z-index:22!important;pointer-events:none!important}'
      +'.ktsecret-chat:empty:before{content:"💬 채팅을 입력하면 아래에서 위로 올라옵니다"!important;color:rgba(255,255,255,.72)!important;font-size:10px!important;font-weight:850!important;text-shadow:0 1px 3px #000,0 0 5px #000!important}'
      +'.ktsecret-chat-line{display:flex!important;align-items:flex-start!important;gap:6px!important;margin-top:5px!important;padding:0!important;font-size:11px!important;line-height:1.28!important;font-weight:850!important;text-shadow:0 1px 3px #000,0 0 5px #000!important}'
      +'.ktsecret-chat-line b{flex:0 0 auto!important;color:#63d8ff!important;font-size:11px!important;white-space:nowrap!important}.ktsecret-chat-line span{min-width:0!important;color:#fff!important;font-size:11px!important;white-space:normal!important;overflow-wrap:anywhere!important}'
      +'@media(max-width:390px){.ktsecret-guest-panel{right:5px;top:7px;width:45%;gap:3px}.ktsecret-guest-slot{min-height:58px;border-radius:7px}.ktsecret-host-tag{left:7px;top:7px;padding:4px 7px;font-size:10px}.ktsecret-chat{left:6px!important;right:47%!important;bottom:64px!important;max-height:46%!important}.ktsecret-chat-line,.ktsecret-chat-line b,.ktsecret-chat-line span{font-size:10px!important}}'
      +'@media(min-width:700px) and (orientation:landscape){.ktsecret-guest-panel{width:42%;max-width:420px;grid-template-columns:repeat(3,minmax(0,1fr))}.ktsecret-chat{right:44%!important;max-height:52%!important}}';
    document.head.appendChild(s);
  }

  function streamList(){
    var lists=[];
    try{if(Array.isArray(window.ktSecretGuestStreams))lists=window.ktSecretGuestStreams;}catch(e){}
    try{if(!lists.length&&window.state&&Array.isArray(state.secretGuestStreams))lists=state.secretGuestStreams;}catch(e){}
    try{if(!lists.length&&window.state&&Array.isArray(state.guestStreams))lists=state.guestStreams;}catch(e){}
    try{if(!lists.length&&Array.isArray(window.ktGuestStreams))lists=window.ktGuestStreams;}catch(e){}
    return lists||[];
  }

  function guestName(item,index){
    if(item&&typeof item==='object'&&!(item instanceof MediaStream))return item.name||item.nickname||('게스트 '+(index+1));
    return '게스트 '+(index+1);
  }
  function guestStream(item){
    if(!item)return null;
    if(typeof MediaStream!=='undefined'&&item instanceof MediaStream)return item;
    if(item.stream)return item.stream;
    return null;
  }

  function syncGuestStreams(){
    var panel=document.querySelector('.ktsecret-guest-panel');
    if(!panel)return;
    var list=streamList();
    panel.querySelectorAll('.ktsecret-guest-slot').forEach(function(slot,i){
      var item=list[i];
      var stream=guestStream(item);
      var video=slot.querySelector('video');
      var empty=slot.querySelector('.ktsecret-guest-empty');
      var name=slot.querySelector('.ktsecret-guest-name');
      if(name)name.textContent=guestName(item,i);
      if(video&&stream){
        if(video.srcObject!==stream)video.srcObject=stream;
        video.muted=false;
        video.setAttribute('playsinline','');
        video.play().catch(function(){});
        if(empty)empty.style.display='none';
      }else{
        if(video&&video.srcObject)video.srcObject=null;
        if(empty)empty.style.display='grid';
      }
    });
  }

  window.ktSetSecretGuestStream=function(index,stream,name){
    index=Math.max(0,Math.min(4,parseInt(index,10)||0));
    window.ktSecretGuestStreams=window.ktSecretGuestStreams||[];
    window.ktSecretGuestStreams[index]={stream:stream||null,name:name||('게스트 '+(index+1))};
    syncGuestStreams();
  };

  function enhance(){
    ensureStyle();
    var main=document.querySelector('.ktsecret-room .ktsecret-main');
    if(!main)return;
    if(!main.querySelector('.ktsecret-host-tag')){
      var host=document.createElement('div');
      host.className='ktsecret-host-tag';
      host.innerHTML='<b>♛</b><span>호스트</span>';
      main.appendChild(host);
    }
    if(!main.querySelector('.ktsecret-guest-panel')){
      var panel=document.createElement('div');
      panel.className='ktsecret-guest-panel';
      var html='';
      for(var i=0;i<5;i++){
        html+='<div class="ktsecret-guest-slot" data-guest-index="'+i+'"><video autoplay playsinline></video><div class="ktsecret-guest-empty">👤<small>게스트 '+(i+1)+'</small></div><div class="ktsecret-guest-name">게스트 '+(i+1)+'</div></div>';
      }
      panel.innerHTML=html;
      main.appendChild(panel);
    }
    syncGuestStreams();
  }

  var obs=new MutationObserver(function(){enhance();});
  obs.observe(document.documentElement,{childList:true,subtree:true});
  ensureStyle();
  setTimeout(enhance,0);
  setInterval(function(){if(document.querySelector('.ktsecret-room .ktsecret-main'))syncGuestStreams();},1000);
})();
