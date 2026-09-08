/* K-Talk 13명 방송 참여자 안쪽 조작키만 추가: 호스트/게스트 마이크·쪽지·내 수익, 매치는 호스트만. 다른 화면은 변경하지 않음. */
(function(){
  if(window.__ktGroup13ParticipantControlsInstalled)return;
  window.__ktGroup13ParticipantControlsInstalled=true;

  window.ktGroup13DirectMessages=window.ktGroup13DirectMessages||{};
  window.ktGroup13GuestMicState=window.ktGroup13GuestMicState||{};

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot',"'":'&#39;'}[ch];
    });
  }

  function isHostView(){
    try{
      if(window.state){
        if(state.isHost===false)return false;
        var r=String(state.liveRole||state.role||state.currentRole||'').toLowerCase();
        if(r==='guest'||r==='viewer'||r==='audience')return false;
      }
    }catch(e){}
    return true;
  }

  function keyFor(role,index){
    return role==='host'?'host':'guest-'+String(index||1);
  }

  function messagesFor(role,index){
    var k=keyFor(role,index);
    if(!window.ktGroup13DirectMessages[k])window.ktGroup13DirectMessages[k]=[];
    return window.ktGroup13DirectMessages[k];
  }

  function guestStream(index){
    try{
      if(window.ktGroup13GuestStreams){
        if(Array.isArray(window.ktGroup13GuestStreams))return window.ktGroup13GuestStreams[index-1]||null;
        return window.ktGroup13GuestStreams[index]||window.ktGroup13GuestStreams[String(index)]||null;
      }
    }catch(e){}
    try{
      var g=document.querySelectorAll('.ktg13-guest')[index-1];
      var v=g&&g.querySelector('video');
      return v&&v.srcObject?v.srcObject:null;
    }catch(e){return null;}
  }

  function setMicTracks(stream,on){
    try{
      var a=stream&&stream.getAudioTracks?stream.getAudioTracks():[];
      if(!a||!a.length)return false;
      a.forEach(function(t){t.enabled=on;});
      return true;
    }catch(e){return false;}
  }

  window.ktGroup13TogglePersonMic=function(role,index,btn){
    var on=true;
    if(role==='host'){
      try{
        var stream=window.state&&state.stream;
        var tracks=stream&&stream.getAudioTracks?stream.getAudioTracks():[];
        if(tracks&&tracks.length){
          on=!tracks.some(function(t){return t.enabled;});
          tracks.forEach(function(t){t.enabled=on;});
        }else on=false;
      }catch(e){on=false;}
    }else{
      var current=window.ktGroup13GuestMicState[index];
      on=current===false;
      var gs=guestStream(index);
      if(gs){
        try{
          var at=gs.getAudioTracks?gs.getAudioTracks():[];
          if(at&&at.length)on=!at.some(function(t){return t.enabled;});
        }catch(e){}
        setMicTracks(gs,on);
      }
      window.ktGroup13GuestMicState[index]=on;
    }
    if(btn){
      btn.classList.toggle('off',!on);
      btn.innerHTML=on?'🎤':'🔇';
      btn.setAttribute('aria-label',on?'마이크 켜짐':'마이크 꺼짐');
      btn.title=on?'마이크 켜짐':'마이크 꺼짐';
    }
  };

  window.ktGroup13OpenDirectMessage=function(role,index){
    var name=role==='host'?'호스트':'게스트 '+String(index||1);
    var list=messagesFor(role,index);
    var history=list.slice(-6).map(function(m){
      var who=m.dir==='in'?'받음':'보냄';
      return '<div style="padding:7px 9px;margin:5px 0;border-radius:10px;background:rgba(255,255,255,.07);font-size:12px"><b style="color:'+(m.dir==='in'?'#75e6ff':'#ff8fd0')+'">'+who+'</b> '+esc(m.text)+'</div>';
    }).join('');
    if(!history)history='<div style="padding:10px;color:#aaa;font-size:11px">아직 주고받은 쪽지가 없습니다.</div>';
    if(typeof window.showSheet==='function'){
      showSheet('✉ '+name+' 쪽지',
        '<div class="rowbox"><b>쪽지 보내기 · 받기</b><br>'+name+'과 주고받은 쪽지를 여기서 확인합니다.</div>'+
        '<div style="max-height:130px;overflow:auto">'+history+'</div>'+
        '<input id="ktg13DirectMsgInput" class="form" maxlength="120" placeholder="쪽지 입력" onkeydown="if(event.key===\'Enter\')ktGroup13SendDirectMessage(\''+role+'\','+Number(index||0)+')">'+
        '<button class="act" onclick="ktGroup13SendDirectMessage(\''+role+'\','+Number(index||0)+')">쪽지 보내기</button>'
      );
      setTimeout(function(){var i=document.getElementById('ktg13DirectMsgInput');if(i)i.focus();},80);
    }
  };

  window.ktGroup13SendDirectMessage=function(role,index){
    var input=document.getElementById('ktg13DirectMsgInput');
    var text=String(input&&input.value||'').trim();
    if(!text)return;
    messagesFor(role,index).push({dir:'out',text:text,at:Date.now()});
    try{
      if(typeof window.ktSendGroup13DirectMessage==='function')window.ktSendGroup13DirectMessage({role:role,index:index,text:text});
    }catch(e){}
    if(typeof window.closeSheet==='function')closeSheet();
    setTimeout(function(){window.ktGroup13OpenDirectMessage(role,index);},20);
  };

  window.ktReceiveGroup13DirectMessage=function(role,index,text){
    text=String(text||'').trim();
    if(!text)return;
    messagesFor(role,index).push({dir:'in',text:text,at:Date.now()});
  };

  window.ktGroup13HostMatchOnly=function(){
    if(!isHostView())return;
    if(typeof window.openHostMatchArena==='function')window.openHostMatchArena('1대1');
  };

  window.ktGroup13MyEarnings=function(){
    try{
      if(typeof window.toggleMyEarnings==='function'){
        window.toggleMyEarnings();
        return;
      }
    }catch(e){}
    var net='0원',roses='🌹 0송이',rate='일반회원 · 35%';
    try{var a=document.getElementById('hudEarnNet');if(a&&a.textContent)net=a.textContent;}catch(e){}
    try{var b=document.getElementById('hudEarnRoses');if(b&&b.textContent)roses=b.textContent;}catch(e){}
    try{var c=document.getElementById('hudEarnRate');if(c&&c.textContent)rate=c.textContent;}catch(e){}
    if(typeof window.showSheet==='function'){
      showSheet('🔒 내 수익 · 본인만 보기','<div class="rowbox"><b>내 수익</b><br>이 금액은 본인 화면에서만 확인됩니다.</div><div style="padding:16px;border:1px solid #d7ad39;border-radius:14px;background:#17140b;text-align:center;color:#fff"><b style="font-size:22px;color:#ffe36a">'+net+'</b><div style="margin-top:7px;font-size:12px">'+roses+' · '+rate+'</div></div>');
    }
  };

  function addStyle(){
    if(document.getElementById('ktg13ParticipantControlsStyle'))return;
    var s=document.createElement('style');
    s.id='ktg13ParticipantControlsStyle';
    s.textContent=''
      +'.ktg13-host,.ktg13-guest{position:relative!important}'
      +'.ktg13-person-controls{position:absolute;z-index:12;display:flex;align-items:center;gap:4px;pointer-events:auto!important}'
      +'.ktg13-host .ktg13-person-controls{left:8px;right:8px;bottom:8px;justify-content:center}'
      +'.ktg13-guest .ktg13-person-controls{left:2px;right:2px;bottom:2px;justify-content:center;gap:2px}'
      +'.ktg13-person-btn{border:1px solid rgba(255,255,255,.28);background:rgba(8,8,12,.78);color:#fff;border-radius:999px;display:grid;place-items:center;box-shadow:0 1px 5px #0008;touch-action:manipulation!important;pointer-events:auto!important}'
      +'.ktg13-host .ktg13-person-btn{width:34px;height:34px;font-size:16px}'
      +'.ktg13-guest .ktg13-person-btn{width:23px;height:23px;font-size:11px}'
      +'.ktg13-person-btn.off{background:rgba(95,15,25,.88);border-color:#ff6a7f}'
      +'.ktg13-person-btn.match{border-color:#b86cff;background:rgba(52,18,80,.86)}'
      +'.ktg13-person-btn.earn{border-color:#d7ad39;background:rgba(48,38,7,.90);color:#ffe36a}'
      +'.ktg13-earn #myEarnHud{width:90%!important;min-width:0!important;margin-left:auto!important;padding:1px 5px!important;border-radius:9px!important}'
      +'@media(max-width:390px){.ktg13-host .ktg13-person-btn{width:31px;height:31px;font-size:14px}.ktg13-guest .ktg13-person-btn{width:21px;height:21px;font-size:10px}.ktg13-earn #myEarnHud{width:88%!important;padding:1px 4px!important}}';
    document.head.appendChild(s);
  }

  function button(icon,label,onclick,cls){
    return '<button type="button" class="ktg13-person-btn '+(cls||'')+'" aria-label="'+label+'" title="'+label+'" onclick="event.stopPropagation();'+onclick+'">'+icon+'</button>';
  }

  function enhance(){
    var room=document.querySelector('.ktg13-room');
    if(!room)return;
    addStyle();

    var host=room.querySelector('.ktg13-host');
    if(host&&!host.querySelector('.ktg13-person-controls')){
      var hc=document.createElement('div');
      hc.className='ktg13-person-controls';
      hc.innerHTML=button('🎤','호스트 마이크','ktGroup13TogglePersonMic(\'host\',0,this)','')
        +button('✉','호스트 쪽지','ktGroup13OpenDirectMessage(\'host\',0)','')
        +button('💰','내 수익 · 본인만 보기','ktGroup13MyEarnings()','earn')
        +(isHostView()?button('⚔','호스트 매치','ktGroup13HostMatchOnly()','match'):'');
      host.appendChild(hc);
    }

    room.querySelectorAll('.ktg13-guest').forEach(function(g,idx){
      if(g.querySelector('.ktg13-person-controls'))return;
      var n=idx+1;
      var gc=document.createElement('div');
      gc.className='ktg13-person-controls';
      gc.innerHTML=button('🎤','게스트 '+n+' 마이크','ktGroup13TogglePersonMic(\'guest\','+n+',this)','')
        +button('✉','게스트 '+n+' 쪽지','ktGroup13OpenDirectMessage(\'guest\','+n+')','')
        +button('💰','내 수익 · 본인만 보기','ktGroup13MyEarnings()','earn');
      g.appendChild(gc);
    });

    /* 이미 만들어진 조작키에도 내 수익이 없으면 메시지 옆에만 추가한다. */
    room.querySelectorAll('.ktg13-person-controls').forEach(function(c){
      if(c.querySelector('.ktg13-person-btn.earn'))return;
      var msg=null;
      c.querySelectorAll('.ktg13-person-btn').forEach(function(b){if(!msg&&String(b.getAttribute('aria-label')||'').indexOf('쪽지')>-1)msg=b;});
      var earn=document.createElement('button');
      earn.type='button';earn.className='ktg13-person-btn earn';earn.setAttribute('aria-label','내 수익 · 본인만 보기');earn.title='내 수익 · 본인만 보기';earn.innerHTML='💰';
      earn.onclick=function(e){e.stopPropagation();window.ktGroup13MyEarnings();};
      if(msg)msg.insertAdjacentElement('afterend',earn);else c.appendChild(earn);
    });

    if(!isHostView()){
      room.querySelectorAll('.ktg13-tool').forEach(function(b){
        if(String(b.textContent||'').indexOf('매치')>-1)b.style.display='none';
      });
    }
  }

  var obs=new MutationObserver(function(){enhance();});
  try{obs.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setInterval(enhance,500);
  setTimeout(enhance,0);
})();
