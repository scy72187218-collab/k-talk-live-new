/* 구독자방만 수정: 15명 표시, 수익은 방송 본인에게만 표시, 호스트 닉네임·레벨·왕관 표시. 다른 방/버튼은 변경하지 않음. */
(function(){
  if(window.__ktSubscriberHeader15SpacingInstalled)return;
  window.__ktSubscriberHeader15SpacingInstalled=true;

  function ensureStyle(){
    if(document.getElementById('ktSubscriberHeader15SpacingStyle'))return;
    var s=document.createElement('style');
    s.id='ktSubscriberHeader15SpacingStyle';
    s.textContent=''
      +'.ktsubscriber-room .ktsubscriber-att{transform:translateX(16px)!important}'
      +'.ktsubscriber-room .ktsubscriber-host-label{max-width:92%!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important;padding:3px 7px!important}'
      +'@media(max-width:390px){.ktsubscriber-room .ktsubscriber-att{transform:translateX(10px)!important}.ktsubscriber-room .ktsubscriber-host-label{font-size:8px!important;padding:2px 5px!important}}';
    document.head.appendChild(s);
  }

  function ownBroadcast(room){
    try{
      var stream=window.state&&state.stream;
      if(!stream)return false;
      var video=room.querySelector('.ktsubscriber-host video,#ktLiveVideo');
      return !!(video&&video.srcObject&&video.srcObject===stream);
    }catch(e){return false;}
  }

  function currentName(){
    var name='';
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad()||{};
        name=String(p.name||p.nickname||'').trim();
      }
    }catch(e){}
    if(!name){
      try{
        var sub=window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'';
        if(sub&&window.ktSubProfileCard){
          var c=window.ktSubProfileCard(sub)||{};
          name=String(c.name||'').trim();
        }
      }catch(e){}
    }
    if(!name){
      try{name=String((window.state&&(state.nickname||state.userName||state.profileName||state.name))||'').trim();}catch(e){}
    }
    return name||'K-Talk';
  }

  function currentLevel(){
    var values=[];
    try{
      if(window.state)values=[state.level,state.userLevel,state.memberLevel,state.hostLevel];
    }catch(e){}
    try{
      ['ktalk_level','ktalk_user_level','ktalk_member_level','ktalk_host_level','level','userLevel','memberLevel','hostLevel'].forEach(function(k){values.push(localStorage.getItem(k));});
    }catch(e){}
    for(var i=0;i<values.length;i++){
      var n=parseInt(values[i],10);
      if(isFinite(n)&&n>0)return n;
    }
    return 1;
  }

  function apply(){
    ensureStyle();
    var room=document.querySelector('.ktsubscriber-room');
    if(!room)return;

    var title=room.querySelector('.ktsubscriber-title');
    if(title&&title.textContent.indexOf('15명')<0){
      title.innerHTML='<i>●</i> 구독자 방송 15명';
    }

    var own=ownBroadcast(room);
    var earn=room.querySelector('.ktsubscriber-earn');
    if(earn){
      if(own)earn.style.removeProperty('display');
      else earn.style.setProperty('display','none','important');
    }

    if(own){
      var label=room.querySelector('.ktsubscriber-host-label');
      if(label){
        label.textContent='👑 '+currentName()+' · LV '+currentLevel();
      }
    }
  }

  apply();
  setTimeout(apply,80);
  setTimeout(apply,250);
  setTimeout(apply,700);
  var ob=new MutationObserver(function(){apply();});
  try{ob.observe(document.body,{childList:true,subtree:true});}catch(e){}
  setInterval(apply,700);
})();