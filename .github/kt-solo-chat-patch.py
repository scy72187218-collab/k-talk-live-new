from pathlib import Path

p=Path('solo-live-approved-style.js')
s=p.read_text(encoding='utf-8')

old_msg="#ktSoloHostLive .kt-sa-msg{align-self:flex-start;max-width:76%;padding:5px 8px;border-radius:12px;background:#0a0a0a9e;font-size:10px;font-weight:750;white-space:normal;}\\\n"
new_msg="#ktSoloHostLive .kt-sa-msg{align-self:flex-start;max-width:76%;padding:5px 8px;border-radius:12px;background:#0a0a0a9e;font-size:10px;font-weight:750;white-space:normal;animation:ktSaMsgUp .28s ease-out both;}\\\n"
if old_msg in s:
    s=s.replace(old_msg,new_msg,1)

old_key="@keyframes ktSaEq{from{height:3px}to{height:19px}}\\\n"
new_key="@keyframes ktSaEq{from{height:3px}to{height:19px}}\\\n@keyframes ktSaMsgUp{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}\\\n"
if old_key in s and '@keyframes ktSaMsgUp' not in s:
    s=s.replace(old_key,new_key,1)

old_block="""    var input=document.getElementById('ktSaInput');
    var send=document.getElementById('ktSaSend');
    function sendLocal(){
      if(!input)return;
      var t=String(input.value||'').trim();
      if(!t)return;
      var c=document.getElementById('ktSaChat');
      if(c){
        var d=document.createElement('div');
        d.className='kt-sa-msg';
        d.textContent='나 · '+t;
        c.appendChild(d);
        while(c.children.length>4)c.removeChild(c.firstChild);
      }
      input.value='';
    }
"""
new_block="""    var input=document.getElementById('ktSaInput');
    var send=document.getElementById('ktSaSend');
    function pushChat(name,text){
      var t=String(text||'').trim();
      if(!t)return;
      var c=document.getElementById('ktSaChat');
      if(!c)return;
      var d=document.createElement('div');
      d.className='kt-sa-msg';
      d.textContent=(name?String(name)+'  ':'')+t;
      c.appendChild(d);
      while(c.children.length>5)c.removeChild(c.firstChild);
    }
    window.ktSoloPushMessage=pushChat;
    function sendLocal(){
      if(!input)return;
      var t=String(input.value||'').trim();
      if(!t)return;
      pushChat('나',t);
      input.value='';
    }
"""
if old_block in s:
    s=s.replace(old_block,new_block,1)

anchor="""    if(send)send.onclick=sendLocal;
    if(input)input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();sendLocal();}});

    function tick(){
"""
inject="""    if(send)send.onclick=sendLocal;
    if(input)input.addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();sendLocal();}});

    if(!window.__ktSaAnnounceWrapped && typeof window.ktAnnounceEvent==='function'){
      window.__ktSaAnnounceWrapped=true;
      var oldAnnounce=window.ktAnnounceEvent;
      window.ktAnnounceEvent=function(type,data){
        var out=oldAnnounce.apply(this,arguments);
        try{
          data=data||{};
          if(isSolo() && window.ktSoloPushMessage){
            if(type==='gift'){
              window.ktSoloPushMessage('🎁 '+(data.sender||'선물'),(data.name||'선물')+(data.count?' '+data.count+'개':'')+' 선물했습니다!');
            }else if(type==='join'){
              window.ktSoloPushMessage('👋 '+(data.name||'새 시청자'),'방송에 들어왔습니다.');
            }else if(type==='reward'){
              window.ktSoloPushMessage('🎉',data.text||'보상이 지급되었습니다.');
            }else if(type==='notice'){
              window.ktSoloPushMessage('📢',data.text||'알림이 있습니다.');
            }
          }
        }catch(e){}
        return out;
      };
    }

    function tick(){
"""
if anchor in s and '__ktSaAnnounceWrapped' not in s:
    s=s.replace(anchor,inject,1)

p.write_text(s,encoding='utf-8')

idx=Path('index.html')
h=idx.read_text(encoding='utf-8')
h=h.replace('solo-live-approved-style.js?v=20260905-solo-approved01','solo-live-approved-style.js?v=20260905-solo-chat02')
h=h.replace('solo-live-approved-style.js?v=20260905-solo-chat01','solo-live-approved-style.js?v=20260905-solo-chat02')
idx.write_text(h,encoding='utf-8')

Path('.github/kt-solo-chat-patch.py').unlink(missing_ok=True)
Path('.github/workflows/solo-live-chat-rise-20260905.yml').unlink(missing_ok=True)
Path('.github/workflows/solo-live-chat-rise-run-20260905.yml').unlink(missing_ok=True)
