/* K-Talk: 메시지 화면을 공유 화면과 같은 팔로우 원형 프로필 방식으로 통일.
   방송 채팅 설명 문구 제거. 모든 방송방 메시지 버튼에 적용. */
(function(){
  if(window.__ktMessageFollowCirclePanel20260928)return;
  window.__ktMessageFollowCirclePanel20260928=true;

  var currentTarget='';

  function esc(s){
    return String(s||'').replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function followers(){
    return [
      {name:'친구1',icon:'🙂'},
      {name:'친구2',icon:'😊'},
      {name:'친구3',icon:'😎'},
      {name:'친구4',icon:'👩'},
      {name:'친구5',icon:'👨'}
    ];
  }

  function ensureStyle(){
    if(document.getElementById('ktMessageFollowCircleStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktMessageFollowCircleStyle20260928';
    s.textContent=''
      +'.kt-message-follow-panel{padding:2px 0 4px!important}'
      +'.kt-message-follow-title{font-size:14px!important;font-weight:950!important;color:#fff!important;margin:0 0 10px 2px!important}'
      +'.kt-message-follow-row{display:flex!important;gap:11px!important;overflow-x:auto!important;padding:2px 2px 12px!important;scrollbar-width:none!important}'
      +'.kt-message-follow-row::-webkit-scrollbar{display:none!important}'
      +'.kt-message-follow-person{flex:0 0 64px!important;border:0!important;background:transparent!important;color:#fff!important;padding:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:6px!important;touch-action:manipulation!important}'
      +'.kt-message-follow-person span{width:58px!important;height:58px!important;border-radius:50%!important;display:grid!important;place-items:center!important;background:#24242b!important;border:2px solid #595963!important;font-size:30px!important;box-sizing:border-box!important}'
      +'.kt-message-follow-person b{font-size:10px!important;max-width:64px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}'
      +'.kt-message-follow-person.on span{border-color:#ff4bc8!important;box-shadow:0 0 0 2px #37d9ff55,0 0 12px #ff4bc855!important}'
      +'.kt-message-target-line{min-height:30px!important;margin:2px 0 8px!important;padding:7px 10px!important;border-radius:10px!important;background:#16161c!important;color:#ffd86b!important;font-size:11px!important;font-weight:900!important}'
      +'.kt-message-send-row{display:grid!important;grid-template-columns:minmax(0,1fr) 92px!important;gap:8px!important;align-items:center!important}'
      +'.kt-message-send-row input{margin:0!important;min-width:0!important}'
      +'.kt-message-send-row .act{margin:0!important;height:46px!important}'
      +'@media(max-width:390px){.kt-message-follow-row{gap:7px!important}.kt-message-follow-person{flex-basis:54px!important}.kt-message-follow-person span{width:50px!important;height:50px!important;font-size:25px!important}.kt-message-send-row{grid-template-columns:minmax(0,1fr) 78px!important}}';
    document.head.appendChild(s);
  }

  window.ktPickMessageFollow20260928=function(name,btn){
    currentTarget=String(name||'');
    try{
      document.querySelectorAll('.kt-message-follow-person').forEach(function(x){x.classList.remove('on');});
      if(btn)btn.classList.add('on');
      var line=document.getElementById('ktMessageTargetLine20260928');
      if(line)line.textContent=currentTarget?'💬 '+currentTarget+'님에게 메시지':'사진을 눌러 메시지 받을 사람을 선택하세요.';
      var input=document.getElementById('ktMessageFollowInput20260928');
      if(input)input.focus();
    }catch(e){}
    return false;
  };

  function send(roomKind){
    var input=document.getElementById('ktMessageFollowInput20260928');
    var text=String(input&&input.value||'').trim();
    if(!currentTarget){
      try{alert('메시지 받을 사람의 사진을 먼저 눌러 주세요.');}catch(e){}
      return false;
    }
    if(!text)return false;

    /* 현재 방송 채팅 전송 기능을 그대로 사용하되 선택한 사람 이름을 붙여 대상을 명확히 표시한다. */
    try{
      if(roomKind==='solo'&&window.ktSoloChatMessages){
        window.ktSoloChatMessages.push({name:'나 → '+currentTarget,text:text});
        if(typeof window.ktSoloRenderChat==='function')window.ktSoloRenderChat();
      }else if(roomKind==='group'&&window.ktGroup13ChatMessages){
        window.ktGroup13ChatMessages.push({name:'나 → '+currentTarget,text:text});
        if(typeof window.ktGroup13RenderChat==='function')window.ktGroup13RenderChat();
      }else if(roomKind==='subscriber'&&window.ktSubscriberChatMessages){
        window.ktSubscriberChatMessages.push({name:'나 → '+currentTarget,text:text});
        if(typeof window.ktSubscriberRenderChat==='function')window.ktSubscriberRenderChat();
      }else if(roomKind==='secret'&&window.ktSecretChatMessages){
        window.ktSecretChatMessages.push({name:'나 → '+currentTarget,text:text});
        if(typeof window.ktSecretRenderChat==='function')window.ktSecretRenderChat();
      }
    }catch(e){}
    if(input)input.value='';
    try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
    return false;
  }
  window.ktSendMessageFollow20260928=send;

  function html(kind){
    currentTarget='';
    var people=followers().map(function(f){
      return '<button type="button" class="kt-message-follow-person" onclick="return ktPickMessageFollow20260928(\''+esc(f.name)+'\',this)">'
        +'<span>'+f.icon+'</span><b>'+esc(f.name)+'</b></button>';
    }).join('');
    return '<div class="kt-message-follow-panel">'
      +'<div class="kt-message-follow-title">팔로우한 사람</div>'
      +'<div class="kt-message-follow-row">'+people+'</div>'
      +'<div id="ktMessageTargetLine20260928" class="kt-message-target-line">사진을 눌러 메시지 받을 사람을 선택하세요.</div>'
      +'<div class="kt-message-send-row">'
      +'<input id="ktMessageFollowInput20260928" class="form" maxlength="100" placeholder="메시지 입력" onkeydown="if(event.key===\'Enter\')ktSendMessageFollow20260928(\''+kind+'\')">'
      +'<button class="act" type="button" onclick="return ktSendMessageFollow20260928(\''+kind+'\')">보내기</button>'
      +'</div></div>';
  }

  function install(){
    ensureStyle();

    if(typeof window.ktSoloOpenMessage==='function'&&!window.ktSoloOpenMessage.__ktFollowCircle){
      var fn1=function(){if(typeof window.showSheet==='function')window.showSheet('메시지',html('solo'));};
      fn1.__ktFollowCircle=true;window.ktSoloOpenMessage=fn1;
    }
    if(typeof window.ktGroup13OpenMessage==='function'&&!window.ktGroup13OpenMessage.__ktFollowCircle){
      var fn2=function(){if(typeof window.showSheet==='function')window.showSheet('메시지',html('group'));};
      fn2.__ktFollowCircle=true;window.ktGroup13OpenMessage=fn2;
    }
    if(typeof window.ktSubscriberOpenMessage==='function'&&!window.ktSubscriberOpenMessage.__ktFollowCircle){
      var fn3=function(){if(typeof window.showSheet==='function')window.showSheet('메시지',html('subscriber'));};
      fn3.__ktFollowCircle=true;window.ktSubscriberOpenMessage=fn3;
    }
    if(typeof window.ktSecretOpenMessage==='function'&&!window.ktSecretOpenMessage.__ktFollowCircle){
      var fn4=function(){if(typeof window.showSheet==='function')window.showSheet('메시지',html('secret'));};
      fn4.__ktFollowCircle=true;window.ktSecretOpenMessage=fn4;
    }
  }

  install();
  [100,300,700,1400,2400].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,900);
})();