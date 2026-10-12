/* Scoped person-menu invitation and chat reactions; no room/media changes. */
(function(){
  if(window.__ktPersonMenuExtras20261013)return;
  window.__ktPersonMenuExtras20261013=true;
  var sending=false;
  function remote(){return document.documentElement.classList.contains('kt-remote-viewing')||!!document.querySelector('#screen .kt-remote-live,#screen .kt-guest-hostlike-room');}
  function chatRoute(){
    if(remote())return ['ktRemoteChatInput','ktRemoteSendChat'];
    if(document.querySelector('#screen .ktsolo-room'))return ['ktsoloChatInput','ktSoloSendChat'];
    if(document.querySelector('#screen .ktsubscriber-room'))return ['ktsubscriberChatInput','ktSubscriberSendChat'];
    if(document.querySelector('#screen .ktsecret-room'))return ['ktsecretChatInput','ktSecretSendChat'];
    if(document.querySelector('#screen .ktg13-room,#screen .ktg9-room'))return ['ktg13ChatInput','ktGroup13SendChat'];
    return null;
  }
  function inviteUrl(){
    var id='';
    try{id=remote()?String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||sessionStorage.getItem('kt_remote_host_id')||''):String(localStorage.getItem('kt_live_device_id')||'');}catch(e){}
    if(!id||id.length>80)return '';
    var u=new URL('/',location.origin);u.searchParams.set('kt_live_host',id);return u.href;
  }
  function button(text,fn){var b=document.createElement('button');b.type='button';b.textContent=text;b.style.cssText='font:700 16px system-ui;border:0;border-radius:16px;padding:16px;margin:4px;background:#333338;color:white;min-height:56px';b.onclick=fn;return b;}
  function mount(){
    var root=document.querySelector('#ktPersonMenu20261012 section');
    if(!root||root.dataset.ktExtras==='1')return;
    root.dataset.ktExtras='1';
    var status=document.createElement('p');status.setAttribute('role','status');status.style.cssText='font-size:14px;color:#ffd777';
    var reactions=document.createElement('div');reactions.setAttribute('aria-label','채팅 이모지');reactions.style.cssText='display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap';
    [['👏','박수'],['👍','좋아요'],['❤️','하트'],['😂','웃음']].forEach(function(item){
      var b=button(item[0],async function(){
        if(sending)return;
        var route=chatRoute();
        if(!route||typeof window[route[1]]!=='function'){status.textContent='현재 방송 채팅에 연결되지 않았습니다.';return;}
        var field=document.getElementById(route[0]),temporary=false;
        if(!field&&remote()){status.textContent='채팅 입력창을 찾지 못했습니다.';return;}
        if(field&&field.disabled){status.textContent='이전 채팅 전송을 기다려 주세요.';return;}
        if(!field){field=document.createElement('input');field.id=route[0];field.hidden=true;document.body.appendChild(field);temporary=true;}
        var draft=field.value;field.value=item[0];sending=true;
        reactions.querySelectorAll('button').forEach(function(x){x.disabled=true;});
        try{var ok=await window[route[1]]();status.textContent=ok===false?'이모지를 보내지 못했습니다. 다시 시도해 주세요.':'채팅 전송을 요청했습니다.';}
        catch(e){status.textContent='이모지를 보내지 못했습니다. 다시 시도해 주세요.';}
        finally{if(temporary)field.remove();else if(field.isConnected&&(field.value===''||field.value===item[0]))field.value=draft;sending=false;reactions.querySelectorAll('button').forEach(function(x){x.disabled=false;});}
      });
      b.setAttribute('aria-label',item[1]+' 채팅 보내기');b.style.fontSize='30px';reactions.appendChild(b);
    });
    var heading=root.querySelector('h2');if(heading)heading.insertAdjacentElement('afterend',reactions);else root.prepend(reactions);
    var invite=button('👥 초대',function(){
      if(root.querySelector('.kt-person-invite-link'))return;
      var url=inviteUrl();if(!url){status.textContent='현재 방송 주소를 확인하지 못했습니다.';return;}
      var box=document.createElement('div');box.className='kt-person-invite-link';
      var label=document.createElement('p');label.textContent='이 방송으로 초대할 링크입니다. 비밀방·구독방의 입장 조건은 그대로 적용됩니다.';
      var field=document.createElement('input');field.readOnly=true;field.value=url;field.setAttribute('aria-label','방송 초대 링크');field.style.cssText='box-sizing:border-box;width:100%;padding:12px;font-size:14px';
      box.append(label,field,button('링크 공유',async function(){
        try{if(navigator.share){await navigator.share({title:'K-Talk LIVE',text:'이 방송에 함께 들어오세요.',url:url});}
          else if(navigator.clipboard){await navigator.clipboard.writeText(url);status.textContent='초대 링크를 복사했습니다.';}
          else{field.select();status.textContent='표시된 링크를 복사해 보내 주세요.';}}
        catch(e){if(e.name!=='AbortError')status.textContent='표시된 링크를 복사해 보내 주세요.';}
      }));root.appendChild(box);
    });
    root.append(invite,status);
  }
  new MutationObserver(mount).observe(document.body,{childList:true,subtree:true});mount();
})();

