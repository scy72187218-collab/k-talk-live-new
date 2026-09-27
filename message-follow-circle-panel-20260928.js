/* K-Talk real 1:1 direct messages.
   Uses followed member IDs. Phone number is collected at join but never exposed in messages.
   Share remains a separate in-app share feature. */
(function(){
  if(window.__ktRealDirectMessage20260928)return;
  window.__ktRealDirectMessage20260928=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var currentTarget=null;
  var pollTimer=0;
  var lastThreadKey='';

  function esc(s){
    return String(s||'').replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json','x-ktalk-user-id':myId()};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  function myId(){
    var id='';
    try{if(typeof window.ktProfileAccountKey==='function')id=String(window.ktProfileAccountKey()||'').trim();}catch(e){}
    if(!id||id==='default')try{id=String(localStorage.getItem('ktalk_member_id')||'').trim();}catch(e){}
    if(!id)try{id=String(localStorage.getItem('kt_live_device_id')||'').trim();}catch(e){}
    return id.slice(0,80);
  }
  function myName(){
    try{if(typeof window.ktProfileLoad==='function'){var p=window.ktProfileLoad()||{};if(p.name)return String(p.name);}}catch(e){}
    try{return String(localStorage.getItem('ktalk_nickname')||'K-Talk 회원');}catch(e){return 'K-Talk 회원';}
  }
  function followed(){
    try{
      var list=window.ktFollowedMembers20260928||JSON.parse(localStorage.getItem('ktalk_followed_members_v1')||'[]');
      if(!Array.isArray(list))return [];
      var seen={};
      return list.filter(function(x){
        var id=String(x&&x.id||'').trim();
        if(!id||id===myId()||seen[id])return false;
        seen[id]=1;return true;
      }).slice(0,50);
    }catch(e){return [];}
  }
  function pairKey(otherId){
    return 'dm:'+([myId(),String(otherId||'')].sort().join('|')).slice(0,180);
  }
  async function req(path,opt){
    opt=opt||{};
    opt.headers=headers(opt.headers);
    var r=await fetch(BASE+path,opt);
    if(!r.ok)throw new Error('dm '+r.status);
    if(r.status===204)return null;
    var t=await r.text();return t?JSON.parse(t):null;
  }

  function ensureStyle(){
    if(document.getElementById('ktRealDirectMessageStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktRealDirectMessageStyle20260928';
    s.textContent=''
      +'.kt-message-follow-title{font-size:14px!important;font-weight:950!important;color:#fff!important;margin:0 0 10px 2px!important}'
      +'.kt-message-follow-row{display:flex!important;gap:11px!important;overflow-x:auto!important;padding:2px 2px 12px!important;scrollbar-width:none!important}.kt-message-follow-row::-webkit-scrollbar{display:none!important}'
      +'.kt-message-follow-person{flex:0 0 64px!important;border:0!important;background:transparent!important;color:#fff!important;padding:0!important;display:flex!important;flex-direction:column!important;align-items:center!important;gap:6px!important;touch-action:manipulation!important}'
      +'.kt-message-follow-person .pic{width:58px!important;height:58px!important;border-radius:50%!important;display:grid!important;place-items:center!important;overflow:hidden!important;background:#24242b!important;border:2px solid #595963!important;font-size:28px!important;box-sizing:border-box!important}'
      +'.kt-message-follow-person .pic img{width:100%!important;height:100%!important;object-fit:cover!important}.kt-message-follow-person b{font-size:10px!important;max-width:64px!important;overflow:hidden!important;text-overflow:ellipsis!important;white-space:nowrap!important}'
      +'.kt-message-follow-person.on .pic{border-color:#ff4bc8!important;box-shadow:0 0 0 2px #37d9ff55,0 0 12px #ff4bc855!important}'
      +'.kt-dm-empty{padding:18px 8px!important;text-align:center!important;color:#bbb!important;font-size:12px!important}'
      +'.kt-dm-thread{height:220px!important;overflow-y:auto!important;padding:8px!important;border-radius:13px!important;background:#0d0d12!important;border:1px solid #ffffff16!important;display:flex!important;flex-direction:column!important;gap:7px!important}'
      +'.kt-dm-msg{max-width:82%!important;padding:8px 10px!important;border-radius:13px!important;font-size:12px!important;line-height:1.35!important;word-break:break-word!important}.kt-dm-msg.mine{align-self:flex-end!important;background:#7c2cff!important;color:#fff!important}.kt-dm-msg.theirs{align-self:flex-start!important;background:#24242b!important;color:#fff!important}.kt-dm-msg small{display:block!important;margin-top:3px!important;opacity:.66!important;font-size:8px!important}'
      +'.kt-dm-send{display:grid!important;grid-template-columns:minmax(0,1fr) 84px!important;gap:7px!important;margin-top:8px!important}.kt-dm-send input,.kt-dm-send button{margin:0!important}'
      +'@media(max-width:390px){.kt-message-follow-row{gap:7px!important}.kt-message-follow-person{flex-basis:54px!important}.kt-message-follow-person .pic{width:50px!important;height:50px!important}.kt-dm-thread{height:190px!important}}';
    document.head.appendChild(s);
  }

  function renderFollowers(){
    var row=document.getElementById('ktDmFollowers20260928');
    if(!row)return;
    var list=followed();
    if(!list.length){
      row.innerHTML='<div class="kt-dm-empty">팔로우한 사람이 없습니다.<br>방송에서 프로필을 눌러 팔로우하면 여기에 표시됩니다.</div>';
      return;
    }
    row.innerHTML=list.map(function(x,i){
      var photo=String(x.photo||'');
      var pic=photo?'<img src="'+esc(photo)+'" alt="">':esc((x.name||'K').charAt(0)||'K');
      return '<button type="button" class="kt-message-follow-person" data-idx="'+i+'"><span class="pic">'+pic+'</span><b>'+esc(x.name||'K-Talk 회원')+'</b></button>';
    }).join('');
    [].slice.call(row.querySelectorAll('.kt-message-follow-person')).forEach(function(b){
      b.onclick=function(){
        var i=parseInt(b.getAttribute('data-idx'),10)||0;
        choose(list[i],b);
      };
    });
  }

  async function choose(member,btn){
    if(!member||!member.id)return;
    currentTarget={id:String(member.id),name:String(member.name||'K-Talk 회원'),photo:String(member.photo||'')};
    document.querySelectorAll('.kt-message-follow-person').forEach(function(x){x.classList.remove('on');});
    if(btn)btn.classList.add('on');
    var title=document.getElementById('ktDmTarget20260928');
    if(title)title.textContent='💬 '+currentTarget.name+'님과 1:1 메시지';
    lastThreadKey=pairKey(currentTarget.id);
    await loadThread();
    var input=document.getElementById('ktDmInput20260928');if(input)input.focus();
  }

  async function loadThread(){
    var box=document.getElementById('ktDmThread20260928');
    if(!box)return;
    if(!currentTarget){
      box.innerHTML='<div class="kt-dm-empty">위에서 팔로우한 사람의 사진을 눌러 주세요.</div>';
      return;
    }
    try{
      var path='ktalk_live_messages?select=id,sender_id,sender_name,message,created_at'
        +'&host_id=eq.'+encodeURIComponent(pairKey(currentTarget.id))
        +'&message_type=eq.direct_message&order=created_at.asc&limit=100';
      var rows=await req(path);
      box.innerHTML=(rows||[]).map(function(r){
        var data={};try{data=JSON.parse(String(r.message||'{}'));}catch(e){}
        if(String(data.to||'')!==myId()&&String(r.sender_id||'')!==myId())return '';
        var mine=String(r.sender_id||'')===myId();
        var tm='';try{tm=new Date(r.created_at).toLocaleTimeString('ko-KR',{hour:'2-digit',minute:'2-digit'});}catch(e){}
        return '<div class="kt-dm-msg '+(mine?'mine':'theirs')+'">'+esc(data.text||'')+'<small>'+esc(mine?'나':(r.sender_name||currentTarget.name))+' · '+esc(tm)+'</small></div>';
      }).join('')||'<div class="kt-dm-empty">아직 메시지가 없습니다.</div>';
      box.scrollTop=box.scrollHeight;
    }catch(e){
      box.innerHTML='<div class="kt-dm-empty">메시지를 불러오지 못했습니다. 잠시 후 다시 눌러 주세요.</div>';
    }
  }

  async function send(){
    if(!currentTarget){try{alert('메시지 받을 사람의 사진을 먼저 눌러 주세요.');}catch(e){}return false;}
    var input=document.getElementById('ktDmInput20260928');
    var text=String(input&&input.value||'').trim();
    if(!text)return false;
    try{
      await req('ktalk_live_messages',{
        method:'POST',
        headers:{Prefer:'return=minimal'},
        body:JSON.stringify({
          host_id:pairKey(currentTarget.id),
          sender_id:myId(),
          sender_name:myName(),
          message:JSON.stringify({to:currentTarget.id,text:text}),
          message_type:'direct_message'
        })
      });
      if(input)input.value='';
      await loadThread();
    }catch(e){
      try{alert('메시지를 보내지 못했습니다. 다시 눌러 주세요.');}catch(_e){}
    }
    return false;
  }
  window.ktSendDirectMessage20260928=send;

  function open(){
    ensureStyle();
    var html='<div class="kt-message-follow-title">팔로우한 사람</div>'
      +'<div id="ktDmFollowers20260928" class="kt-message-follow-row"></div>'
      +'<div id="ktDmTarget20260928" style="font-weight:950;margin:2px 0 7px;color:#ffd86b">사진을 눌러 1:1 메시지 상대를 선택하세요.</div>'
      +'<div id="ktDmThread20260928" class="kt-dm-thread"><div class="kt-dm-empty">위에서 팔로우한 사람의 사진을 눌러 주세요.</div></div>'
      +'<div class="kt-dm-send"><input id="ktDmInput20260928" class="form" maxlength="300" placeholder="메시지 입력" onkeydown="if(event.key===\'Enter\')ktSendDirectMessage20260928()"><button class="act" type="button" onclick="ktSendDirectMessage20260928()">보내기</button></div>';
    if(typeof window.showSheet==='function')window.showSheet('메시지',html);
    setTimeout(renderFollowers,20);
    setTimeout(renderFollowers,120);
    clearInterval(pollTimer);
    pollTimer=setInterval(function(){
      if(!document.getElementById('ktDmThread20260928')){clearInterval(pollTimer);return;}
      if(currentTarget)loadThread();
    },1800);
  }
  window.ktOpenDirectMessages20260928=open;

  function install(){
    ensureStyle();
    if(typeof window.ktSoloOpenMessage==='function')window.ktSoloOpenMessage=open;
    if(typeof window.ktGroup13OpenMessage==='function')window.ktGroup13OpenMessage=open;
    if(typeof window.ktSubscriberOpenMessage==='function')window.ktSubscriberOpenMessage=open;
    if(typeof window.ktSecretOpenMessage==='function')window.ktSecretOpenMessage=open;
    if(typeof window.openMessages==='function')window.openMessages=open;
  }

  install();
  [100,300,700,1400,2400].forEach(function(ms){setTimeout(install,ms);});
  setInterval(install,1000);
})();