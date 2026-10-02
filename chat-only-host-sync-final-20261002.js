/* K-Talk CHAT ONLY sync — 2026-10-02
   Guest chat -> host 9-room visible chat + host AI read.
   CHAT ONLY. No layout/video/grid/button/signaling changes.
*/
(function(){
  if(window.__ktChatOnlyHostSyncFinal20261002)return;
  window.__ktChatOnlyHostSyncFinal20261002=true;

  var API='/api/live-interaction-memory';
  var hostSeen={};
  var hostLastHtml='';

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function deviceId(){
    try{return String(localStorage.getItem('kt_live_device_id')||'').trim();}catch(e){return '';}
  }

  function guestHostId(){
    try{
      return String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||sessionStorage.getItem('kt_remote_host_id')||'').trim();
    }catch(e){return '';}
  }

  function guestName(){
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad()||{};
        return String(p.nickname||p.name||p.displayName||'게스트');
      }
    }catch(e){}
    try{return String(localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_profile_name')||'게스트');}catch(e){}
    return '게스트';
  }

  async function postMemory(hostId,text){
    if(!hostId||!text)return false;
    try{
      var r=await fetch(API+'?t='+Date.now(),{
        method:'POST',
        cache:'no-store',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
          action:'message',
          host_id:hostId,
          sender_id:'viewer_'+deviceId(),
          sender_name:guestName(),
          message:String(text).slice(0,300),
          message_type:'chat'
        })
      });
      return !!(r&&r.ok);
    }catch(e){return false;}
  }

  function wrapGuestSend(){
    var old=window.ktRemoteSendChat;
    if(typeof old!=='function'||old.__ktChatOnlyFinalWrapped)return;
    var fn=async function(){
      var input=document.getElementById('ktRemoteChatInput');
      var text=input?String(input.value||'').trim():'';
      var hostId=guestHostId();
      var result=old.apply(this,arguments);
      if(text&&hostId){
        try{await postMemory(hostId,text);}catch(e){}
      }
      return result;
    };
    fn.__ktChatOnlyFinalWrapped=true;
    window.ktRemoteSendChat=fn;
  }

  function hostChatBox(){
    return document.querySelector('#screen .ktg13-room[data-kt-room="9"] .ktg13-chat');
  }

  function msgKey(m){
    return String((m&&m.id!=null?m.id:'')+'|'+String(m&&m.sender_id||'')+'|'+String(m&&m.message||'')+'|'+String(m&&m.created_at||''));
  }

  async function fetchHostMessages(){
    var hid=deviceId();
    if(!hid||!hostChatBox())return [];
    try{
      var r=await fetch(API+'?action=messages&host_id='+encodeURIComponent(hid)+'&t='+Date.now(),{cache:'no-store'});
      if(!r.ok)return [];
      var j=await r.json();
      var rows=Array.isArray(j&&j.messages)?j.messages:[];
      return rows.filter(function(m){return String(m&&m.message_type||'')==='chat';})
                 .sort(function(a,b){return (Date.parse(a&&a.created_at)||0)-(Date.parse(b&&b.created_at)||0);})
                 .slice(-7);
    }catch(e){return [];}
  }

  function speakNew(rows){
    rows.forEach(function(m){
      var key=msgKey(m);
      if(hostSeen[key])return;
      hostSeen[key]=1;
      var text=String(m&&m.message||'').trim();
      if(!text)return;
      try{
        if(typeof window.ktSpeak==='function')window.ktSpeak(String(m.sender_name||'게스트')+'님, '+text);
        else if(typeof window.speakText==='function')window.speakText(String(m.sender_name||'게스트')+'님, '+text);
      }catch(e){}
    });
  }

  function paint(rows){
    var box=hostChatBox();
    if(!box||!rows.length)return;
    var html=rows.map(function(m){
      return '<div class="ktg13-chat-line"><b>'+esc(m.sender_name||'게스트')+'</b><span>'+esc(m.message||'')+'</span></div>';
    }).join('');
    if(html!==hostLastHtml){
      box.innerHTML=html;
      box.scrollTop=box.scrollHeight;
      hostLastHtml=html;
    }
  }

  async function hostPoll(){
    if(!hostChatBox())return;
    var rows=await fetchHostMessages();
    if(!rows.length)return;
    paint(rows);
    speakNew(rows);
  }

  function install(){
    wrapGuestSend();
    hostPoll();
  }

  install();
  setInterval(install,500);
  setInterval(hostPoll,700);
})();