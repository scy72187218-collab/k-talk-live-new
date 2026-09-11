/* K-Talk 보물상자 정산 결과: 호스트만 누가 몇 개 받았는지 확인. 다른 기능은 변경하지 않음. */
(function(){
  if(window.__ktTreasureHostResultsInstalled)return;
  window.__ktTreasureHostResultsInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';

  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    return id;
  }

  async function rpc(name,body){
    var r=await fetch(BASE+'rpc/'+name,{
      method:'POST',
      headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'},
      body:JSON.stringify(body||{})
    });
    if(!r.ok)throw new Error('treasure host results '+r.status);
    var t=await r.text();
    return t?JSON.parse(t):null;
  }

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function saveActiveEvent(){
    var b=document.getElementById('ktGlobalTreasureHostBadge');
    if(!b||!b.dataset.eventId)return;
    try{
      localStorage.setItem('ktalk_treasure_last_host_result_event',String(b.dataset.eventId));
      localStorage.setItem('ktalk_treasure_last_host_result_time',String(Date.now()));
    }catch(e){}
  }

  function lastEventId(){
    try{
      var ts=parseInt(localStorage.getItem('ktalk_treasure_last_host_result_time')||'0',10)||0;
      if(!ts||Date.now()-ts>21600000)return '';
      return localStorage.getItem('ktalk_treasure_last_host_result_event')||'';
    }catch(e){return '';}
  }

  function hostBox(){
    return document.querySelector('.ktsolo-main,.ktg13-host,.ktsubscriber-host,.ktsecret-host,.ktg9-host');
  }

  function ensureStyle(){
    if(document.getElementById('ktTreasureHostResultsStyle'))return;
    var s=document.createElement('style');
    s.id='ktTreasureHostResultsStyle';
    s.textContent=''
      +'.kt-treasure-host-results-btn{position:absolute!important;right:6px!important;top:28px!important;z-index:81!important;width:62px!important;min-height:58px!important;border:1px solid #7ff7ff!important;border-radius:16px!important;background:rgba(6,24,28,.94)!important;color:#fff!important;padding:4px 3px!important;font:950 9px/1.05 system-ui,-apple-system,"Noto Sans KR",sans-serif!important;box-shadow:0 0 12px #36e7ff88!important;display:flex!important;flex-direction:column!important;align-items:center!important;justify-content:center!important;gap:2px!important}'
      +'.kt-treasure-host-results-btn b{font-size:18px!important;line-height:1!important}.kt-treasure-host-results-btn small{font-size:8px!important;color:#7ff7ff!important;font-weight:950!important}'
      +'.kt-treasure-result-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 12px;margin:7px 0;border:1px solid #ffffff20;border-radius:14px;background:#121217;color:#fff}.kt-treasure-result-row.host{border-color:#ffd45b;background:#211a08}.kt-treasure-result-row b{font-size:14px}.kt-treasure-result-row strong{color:#ffe052;font-size:15px}'
      +'@media(max-width:390px){.kt-treasure-host-results-btn{right:4px!important;width:56px!important;min-height:54px!important}}';
    document.head.appendChild(s);
  }

  async function getRows(id){
    if(!id||!deviceId())return [];
    try{
      var rows=await rpc('ktalk_treasure_host_results',{p_event_id:id,p_host_id:deviceId()});
      return Array.isArray(rows)?rows:[];
    }catch(e){return [];}
  }

  async function showResults(id){
    var rows=await getRows(id);
    if(!rows.length){
      try{alert('아직 보물상자 정산이 끝나지 않았습니다.');}catch(e){}
      return;
    }
    var total=0;
    var html='<div class="rowbox"><b>🎁 보물상자 정산 결과</b><br>호스트만 볼 수 있습니다.</div>';
    rows.forEach(function(r){
      var n=parseInt(r.reward||0,10)||0;total+=n;
      html+='<div class="kt-treasure-result-row'+(r.is_host?' host':'')+'"><b>'+esc(r.viewer_name||'K-Talk 회원')+(r.is_host?' · 호스트':'')+'</b><strong>🌹 '+n+'개</strong></div>';
    });
    html+='<div class="rowbox"><b>총 '+total+'개 분배 완료</b></div>';
    try{
      if(typeof window.showSheet==='function')window.showSheet('🎁 보물상자 받은 내역',html);
      else alert(rows.map(function(r){return (r.viewer_name||'K-Talk 회원')+' '+r.reward+'개';}).join('\n'));
    }catch(e){}
  }

  async function refresh(){
    saveActiveEvent();
    ensureStyle();
    var active=document.getElementById('ktGlobalTreasureHostBadge');
    var old=document.getElementById('ktTreasureHostResultsBtn');
    if(active){if(old)old.remove();return;}

    var id=lastEventId(),box=hostBox();
    if(!id||!box){if(old)old.remove();return;}
    var rows=await getRows(id);
    if(!rows.length){if(old)old.remove();return;}

    var b=old;
    if(!b){
      b=document.createElement('button');
      b.type='button';
      b.id='ktTreasureHostResultsBtn';
      b.className='kt-treasure-host-results-btn';
      b.innerHTML='<b>🎁</b><small>받은 내역</small>';
      b.onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}showResults(this.dataset.eventId);};
      box.appendChild(b);
    }
    if(b.parentElement!==box)box.appendChild(b);
    b.dataset.eventId=id;
  }

  document.addEventListener('click',function(e){
    var t=e.target&&e.target.closest?e.target.closest('#ktGlobalTreasureHostBadge'):null;
    if(!t)return;
    saveActiveEvent();
    setTimeout(function(){showResults(t.dataset.eventId);},0);
  },true);

  ensureStyle();
  setTimeout(refresh,500);
  setInterval(refresh,1200);
})();
