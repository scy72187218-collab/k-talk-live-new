/* K-Talk 13명 방송: 참여 신청이 채팅에만 보일 때 호스트용 '올리기' 버튼만 보강. */
(function(){
  if(window.__ktGuestRequestHostActionFix)return;
  window.__ktGuestRequestHostActionFix=true;

  var BASE='',KEY='',timer=null;

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    return id;
  }
  async function ensureConfig(){
    if(BASE&&KEY)return true;
    try{
      var r=await fetch('live-presence.js?v=20260914-hostaction',{cache:'no-store'});
      if(!r.ok)return false;
      var t=await r.text();
      var bm=t.match(/var BASE='([^']+)'/),km=t.match(/var KEY='([^']+)'/);
      if(!bm||!km)return false;
      BASE=bm[1];KEY=km[1];
      return true;
    }catch(e){return false;}
  }
  function headers(){return {apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};}
  async function req(path){
    if(!(await ensureConfig()))throw new Error('config');
    var r=await fetch(BASE+path,{headers:headers(),cache:'no-store'});
    if(!r.ok)throw new Error('api '+r.status);
    var t=await r.text();
    return t?JSON.parse(t):[];
  }

  function ensureStyle(){
    if(document.getElementById('ktGuestHostActionStyle'))return;
    var s=document.createElement('style');
    s.id='ktGuestHostActionStyle';
    s.textContent=''
      +'.ktg13-mid{position:relative!important}'
      +'#ktGuestHostActionBar{position:absolute!important;left:6px!important;bottom:4px!important;z-index:40!important;display:flex!important;gap:5px!important;max-width:58%!important;overflow-x:auto!important;pointer-events:auto!important;scrollbar-width:none!important}'
      +'#ktGuestHostActionBar::-webkit-scrollbar{display:none!important}'
      +'.ktGuestHostActionBtn{flex:0 0 auto!important;height:30px!important;max-width:132px!important;padding:0 10px!important;border:1px solid #57e4ff!important;border-radius:15px!important;background:#07151eeF!important;color:#fff!important;font-size:9px!important;font-weight:950!important;box-shadow:0 0 9px #38d8ff66!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:ellipsis!important}'
      +'.ktGuestHostActionBtn b{color:#7deaff!important}'
      +'@media(max-width:390px){#ktGuestHostActionBar{max-width:62%!important}.ktGuestHostActionBtn{height:28px!important;max-width:112px!important;font-size:8px!important}}';
    document.head.appendChild(s);
  }

  function removeBar(){var b=document.getElementById('ktGuestHostActionBar');if(b)b.remove();}

  function render(pending){
    var mid=document.querySelector('.ktg13-mid');
    if(!mid||!pending.length){removeBar();return;}
    var bar=document.getElementById('ktGuestHostActionBar');
    if(!bar){bar=document.createElement('div');bar.id='ktGuestHostActionBar';mid.appendChild(bar);}
    bar.innerHTML='';
    pending.forEach(function(x){
      var btn=document.createElement('button');
      btn.type='button';
      btn.className='ktGuestHostActionBtn';
      btn.innerHTML='👤 <b>'+esc(x.name)+'</b> 올리기';
      btn.onclick=function(e){
        if(e){e.preventDefault();e.stopPropagation();}
        if(typeof window.ktApproveGuest==='function'){
          window.ktApproveGuest(x.vid,x.name,null);
          btn.disabled=true;
          btn.textContent='올리는 중…';
          setTimeout(tick,350);
        }
      };
      bar.appendChild(btn);
    });
  }

  async function tick(){
    ensureStyle();
    if(!document.querySelector('.ktg13-room')){removeBar();return;}
    var hid=deviceId();
    if(!hid)return;
    try{
      var roomRows=await req('ktalk_live_rooms?select=started_at&host_id=eq.'+enc(hid)+'&active=eq.true&order=started_at.desc&limit=1');
      var room=roomRows&&roomRows[0];
      if(!room){removeBar();return;}
      var path='ktalk_live_messages?select=sender_id,sender_name,message_type,created_at&host_id=eq.'+enc(hid);
      if(room.started_at)path+='&created_at=gte.'+enc(room.started_at);
      path+='&order=created_at.desc&limit=80';
      var rows=await req(path),latest={};
      (rows||[]).forEach(function(m){
        var t=String(m.message_type||''),vid='';
        if(t.indexOf('guest_request:')===0){vid=t.slice(14);if(vid&&!latest[vid])latest[vid]={state:'request',name:String(m.sender_name||'게스트')};}
        else if(t.indexOf('guest_approved:')===0){vid=t.slice(15);if(vid&&!latest[vid])latest[vid]={state:'approved',name:String(m.sender_name||'게스트')};}
      });
      var pending=[];
      Object.keys(latest).forEach(function(vid){if(latest[vid].state==='request')pending.push({vid:vid,name:latest[vid].name||'게스트'});});
      render(pending);
    }catch(e){}
  }

  timer=setInterval(tick,900);
  setTimeout(tick,150);
  window.addEventListener('pagehide',function(){clearInterval(timer);});
})();
