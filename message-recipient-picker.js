/* K-Talk 메시지 전용: 메시지를 누르면 먼저 받는 사람을 고르고, 선택한 사람에게만 입력/보내기 화면을 연다. */
(function(){
  if(window.__ktMessageRecipientPickerInstalled)return;
  window.__ktMessageRecipientPickerInstalled=true;

  var people=[
    {id:'friend1',name:'친구1',emoji:'🙂'},
    {id:'friend2',name:'친구2',emoji:'😊'},
    {id:'friend3',name:'친구3',emoji:'😎'},
    {id:'friend4',name:'친구4',emoji:'👩'},
    {id:'friend5',name:'친구5',emoji:'👨'}
  ];

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function ensureStyle(){
    if(document.getElementById('ktMessageRecipientPickerStyle'))return;
    var s=document.createElement('style');
    s.id='ktMessageRecipientPickerStyle';
    s.textContent=''
      +'.kt-msg-pick{padding:4px 2px 10px;color:#fff}'
      +'.kt-msg-pick h4{margin:4px 4px 14px;font-size:13px;color:#ddd}'
      +'.kt-msg-people{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px}'
      +'.kt-msg-person{border:0;background:none;color:#fff;min-width:0;padding:2px 0;display:flex;flex-direction:column;align-items:center;gap:6px;font-weight:900}'
      +'.kt-msg-avatar{width:54px;height:54px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(145deg,#2a2b31,#111217);border:1px solid #ffffff26;font-size:31px;box-shadow:inset 0 0 12px #ffffff08}'
      +'.kt-msg-person span:last-child{font-size:10px;white-space:nowrap}'
      +'.kt-msg-compose{padding:2px 0 8px;color:#fff}'
      +'.kt-msg-to{display:flex;align-items:center;gap:10px;padding:9px 10px;margin-bottom:10px;border:1px solid #ffffff1d;border-radius:14px;background:#101116}'
      +'.kt-msg-to .kt-msg-avatar{width:44px;height:44px;font-size:25px;flex:0 0 44px}'
      +'.kt-msg-to b{display:block;font-size:14px}.kt-msg-to small{display:block;margin-top:3px;color:#aaa;font-size:9px}'
      +'.kt-msg-back{margin-left:auto;border:1px solid #ffffff24;border-radius:10px;background:#1b1c22;color:#fff;padding:7px 9px;font-size:10px;font-weight:900}'
      +'.kt-msg-history{min-height:84px;max-height:190px;overflow:auto;padding:8px;border-radius:14px;background:#090a0e;border:1px solid #ffffff13;margin-bottom:9px}'
      +'.kt-msg-empty{color:#888;font-size:10px;padding:20px 4px;text-align:center}'
      +'.kt-msg-bubble{margin:5px 0 5px auto;max-width:82%;padding:8px 10px;border-radius:14px 14px 4px 14px;background:linear-gradient(135deg,#ff2e9b,#8b4cff);font-size:11px;line-height:1.35;color:#fff;word-break:break-word}'
      +'.kt-msg-sendrow{display:grid;grid-template-columns:minmax(0,1fr) 86px;gap:7px}'
      +'.kt-msg-input{width:100%;height:46px;border:1px solid #ffffff2c;border-radius:13px;background:#101116;color:#fff;padding:0 12px;font-size:13px;outline:none}'
      +'.kt-msg-send{height:46px;border:0;border-radius:13px;background:linear-gradient(135deg,#ff2f9d,#9552ff);color:#fff;font-size:14px;font-weight:950}'
      +'@media(max-width:390px){.kt-msg-avatar{width:48px;height:48px;font-size:27px}.kt-msg-people{gap:4px}.kt-msg-person span:last-child{font-size:9px}}';
    document.head.appendChild(s);
  }

  function keyFor(id){return 'ktalk_messages_'+String(id||'friend');}

  function readMessages(id){
    try{
      var v=JSON.parse(localStorage.getItem(keyFor(id))||'[]');
      return Array.isArray(v)?v:[];
    }catch(e){return [];}
  }

  function saveMessages(id,list){
    try{localStorage.setItem(keyFor(id),JSON.stringify(list.slice(-50)));}catch(e){}
  }

  function renderHistory(person){
    var list=readMessages(person.id);
    if(!list.length)return '<div class="kt-msg-empty">아직 보낸 메시지가 없습니다.</div>';
    return list.map(function(m){return '<div class="kt-msg-bubble">'+esc(m.text||'')+'</div>';}).join('');
  }

  window.ktOpenMessageRecipientPicker=function(){
    ensureStyle();
    var cards=people.map(function(p){
      return '<button type="button" class="kt-msg-person" onclick="ktOpenMessageComposer(\''+p.id+'\')">'
        +'<span class="kt-msg-avatar">'+p.emoji+'</span><span>'+p.name+'</span></button>';
    }).join('');
    var html='<div class="kt-msg-pick"><h4>메시지를 보낼 사람을 선택하세요</h4><div class="kt-msg-people">'+cards+'</div></div>';
    if(window.showSheet)showSheet('메시지',html);
  };

  window.ktOpenMessageComposer=function(id){
    ensureStyle();
    var person=people.find(function(p){return p.id===id;})||people[0];
    var html='<div class="kt-msg-compose">'
      +'<div class="kt-msg-to"><span class="kt-msg-avatar">'+person.emoji+'</span><div><b>'+person.name+'</b><small>받는 사람</small></div>'
      +'<button type="button" class="kt-msg-back" onclick="ktOpenMessageRecipientPicker()">사람 변경</button></div>'
      +'<div id="ktMsgHistory" class="kt-msg-history">'+renderHistory(person)+'</div>'
      +'<div class="kt-msg-sendrow"><input id="ktMsgInput" class="kt-msg-input" maxlength="200" placeholder="메시지 입력" onkeydown="if(event.key===\'Enter\')ktSendMessageTo(\''+person.id+'\')">'
      +'<button type="button" class="kt-msg-send" onclick="ktSendMessageTo(\''+person.id+'\')">보내기</button></div></div>';
    if(window.showSheet)showSheet('메시지 · '+person.name,html);
    setTimeout(function(){var i=document.getElementById('ktMsgInput');if(i)i.focus();},80);
  };

  window.ktSendMessageTo=function(id){
    var input=document.getElementById('ktMsgInput');
    if(!input)return;
    var text=String(input.value||'').trim();
    if(!text)return;
    var list=readMessages(id);
    list.push({text:text,at:Date.now()});
    saveMessages(id,list);
    input.value='';
    var person=people.find(function(p){return p.id===id;})||people[0];
    var box=document.getElementById('ktMsgHistory');
    if(box){box.innerHTML=renderHistory(person);box.scrollTop=box.scrollHeight;}
  };

  /* 홈 쪽지와 구독자방 메시지 버튼 둘 다 같은 받는 사람 선택 화면을 사용한다. */
  window.openMessages=window.ktOpenMessageRecipientPicker;
  window.ktSubscriberOpenMessage=window.ktOpenMessageRecipientPicker;
})();
