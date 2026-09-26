/* K-Talk rose sender history by tapping a person's received-rose number.
   Works across 1/9/13/subscriber/secret rooms without changing room layout. */
(function(){
  if(window.__ktRoseSenderHistory20260927)return;
  window.__ktRoseSenderHistory20260927=true;

  var BASE='',KEY='';

  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    return id;
  }
  async function config(){
    if(BASE&&KEY)return true;
    try{
      var r=await fetch('live-presence.js?v=20260926-followstatus16',{cache:'no-store'});
      if(!r.ok)return false;
      var t=await r.text(),b=t.match(/var BASE='([^']+)'/),k=t.match(/var KEY='([^']+)'/);
      if(!b||!k)return false;
      BASE=b[1];KEY=k[1];return true;
    }catch(e){return false;}
  }
  function headers(){return {apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};}
  async function req(path){
    if(!(await config()))throw new Error('rose history config');
    var r=await fetch(BASE+path,{headers:headers()});
    if(!r.ok)throw new Error('rose history api '+r.status);
    var t=await r.text();return t?JSON.parse(t):null;
  }

  function tile(el){
    return el&&el.closest?el.closest(
      '.ktsolo-main,'+
      '.ktg13-host,.ktg13-guest,'+
      '.ktg9-host,.ktg9-guest,'+
      '.ktsubscriber-host,.ktsubscriber-guest,'+
      '.ktsecret-slot,.ktsecret-host,.ktsecret-guest-slot,'+
      '.kgh-cell'
    ):null;
  }

  function personName(t){
    if(!t)return '회원';
    try{
      var n=t.querySelector('.kt-allhost-name,.kt-hg-name,.kt-guest-name,.kt-guest-nickname,.kt-person-name,[data-nickname]');
      if(n){
        var s=String((n.dataset&&n.dataset.nickname)||n.textContent||'').replace(/^\s*👤\s*/,'').trim();
        if(s)return s;
      }
    }catch(e){}
    try{
      var d=t.dataset||{};
      return String(d.nickname||d.guestName||d.hostName||d.name||'회원').trim()||'회원';
    }catch(e){}
    return '회원';
  }

  function viewerId(t){
    try{
      var d=t&&t.dataset||{};
      return String(d.ktGuestViewerId||d.viewerId||d.guestViewerId||d.participantId||d.userId||'');
    }catch(e){return '';}
  }

  function isHostTile(t){
    try{return !!(t&&t.matches('.ktsolo-main,.ktg13-host,.ktg9-host,.ktsubscriber-host,.ktsecret-slot.host,.ktsecret-host'));}catch(e){return false;}
  }

  function looksLikeRoseCount(el){
    if(!el||!tile(el))return false;
    if(el.closest('.kt-photo-zoom-overlay,.gift-grid,.kt-gift-row,.ktsecret-gifts,.ktsubscriber-gifts'))return false;
    var cls=String(el.className||'').toLowerCase();
    var id=String(el.id||'').toLowerCase();
    var txt=String(el.textContent||'').trim();
    var aria=String(el.getAttribute&&el.getAttribute('aria-label')||'');
    var title=String(el.getAttribute&&el.getAttribute('title')||'');
    var roseHint=/rose|장미/.test(cls+' '+id+' '+aria+' '+title+' '+txt);
    var numberHint=/\d/.test(txt);
    return roseHint&&numberHint;
  }

  function ensureStyle(){
    if(document.getElementById('ktRoseSenderHistoryStyle20260927'))return;
    var s=document.createElement('style');
    s.id='ktRoseSenderHistoryStyle20260927';
    s.textContent=''
      +'.kt-rose-history-sheet{position:fixed;inset:0;z-index:2147483647;background:rgba(0,0,0,.78);display:flex;align-items:flex-end;justify-content:center;padding:0}'
      +'.kt-rose-history-card{width:min(100%,560px);max-height:72dvh;overflow:auto;background:#111116;color:#fff;border-radius:24px 24px 0 0;padding:16px 14px 24px;border:1px solid #5c304a;border-bottom:0;box-shadow:0 -12px 38px #000a}'
      +'.kt-rose-history-head{display:flex;align-items:center;justify-content:space-between;gap:10px;margin-bottom:12px}.kt-rose-history-head b{font-size:17px}.kt-rose-history-close{width:38px;height:38px;border:0;border-radius:50%;background:#2a2a31;color:#fff;font-size:24px}'
      +'.kt-rose-history-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:11px 10px;border-bottom:1px solid #ffffff14}.kt-rose-history-row strong{font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.kt-rose-history-row span{font-size:12px;color:#ffd96a;font-weight:950}.kt-rose-history-empty{padding:22px 10px;text-align:center;color:#bbb;font-size:12px}';
    document.head.appendChild(s);
  }

  function close(){
    var x=document.getElementById('ktRoseSenderHistorySheet20260927');
    if(x)x.remove();
  }

  function show(name,rows){
    ensureStyle();close();
    var ov=document.createElement('div');
    ov.id='ktRoseSenderHistorySheet20260927';
    ov.className='kt-rose-history-sheet';
    var card=document.createElement('div');
    card.className='kt-rose-history-card';
    var html='<div class="kt-rose-history-head"><b>🌹 '+String(name||'회원')+' 받은 장미</b><button type="button" class="kt-rose-history-close">×</button></div>';
    if(!rows||!rows.length){
      html+='<div class="kt-rose-history-empty">아직 확인되는 장미 선물 내역이 없습니다.</div>';
    }else{
      rows.forEach(function(r){
        html+='<div class="kt-rose-history-row"><strong>'+escapeHtml(r.sender||'회원')+'</strong><span>🌹 '+Number(r.amount||1).toLocaleString('ko-KR')+'</span></div>';
      });
    }
    card.innerHTML=html;
    ov.appendChild(card);
    document.body.appendChild(ov);
    card.querySelector('.kt-rose-history-close').onclick=close;
    ov.addEventListener('click',function(e){if(e.target===ov)close();});
  }

  function escapeHtml(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});
  }

  async function historyFor(t){
    var name=personName(t),rows=[];
    try{
      var since=new Date(Date.now()-24*60*60*1000).toISOString();
      var q='';
      if(isHostTile(t)){
        var host=deviceId();
        try{
          if(window.__ktCurrentRemoteHostId&&!document.querySelector('.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room')){
            host=String(window.__ktCurrentRemoteHostId||host);
          }
        }catch(e){}
        q='ktalk_live_messages?select=sender_name,message,created_at&host_id=eq.'+enc(host)
          +'&message_type=eq.gift&created_at=gte.'+enc(since)+'&order=created_at.desc&limit=100';
      }else{
        var vid=viewerId(t);
        if(!vid){show(name,[]);return;}
        q='ktalk_live_messages?select=sender_name,message,created_at&message_type=eq.'+enc('host_gift:'+vid)
          +'&created_at=gte.'+enc(since)+'&order=created_at.desc&limit=100';
      }

      var raw=await req(q);
      var map={},order=[];
      (raw||[]).forEach(function(r){
        try{
          var d=JSON.parse(String(r.message||'{}'));
          var cost=parseInt(d.cost||0,10)||0;
          var giftName=String(d.name||'');
          /* 받은 숫자는 장미 환산 기준이므로 장미/선물 모두 실제 cost만큼 표시 */
          if(cost<=0)return;
          var sender=String(r.sender_name||'회원');
          if(!map[sender]){map[sender]=0;order.push(sender);}
          map[sender]+=cost;
        }catch(e){}
      });
      rows=order.map(function(sender){return {sender:sender,amount:map[sender]};});
    }catch(e){}
    show(name,rows);
  }

  document.addEventListener('click',function(e){
    var target=e.target;
    var hit=target&&target.closest?target.closest(
      '[class*="rose"],[id*="Rose"],[id*="rose"],[aria-label*="장미"],[title*="장미"]'
    ):null;
    if(!hit||!looksLikeRoseCount(hit))return;
    var t=tile(hit);if(!t)return;
    try{e.preventDefault();e.stopPropagation();if(e.stopImmediatePropagation)e.stopImmediatePropagation();}catch(x){}
    historyFor(t);
  },true);

  /* Give likely rose counters a clear click target without changing appearance. */
  function mark(){
    document.querySelectorAll(
      '#screen .ktsolo-room [class*="rose"],#screen .ktsolo-room [id*="Rose"],#screen .ktsolo-room [id*="rose"],'+
      '#screen .ktg13-room [class*="rose"],#screen .ktg13-room [id*="Rose"],#screen .ktg13-room [id*="rose"],'+
      '#screen .ktg9-room [class*="rose"],#screen .ktg9-room [id*="Rose"],#screen .ktg9-room [id*="rose"],'+
      '#screen .ktsubscriber-room [class*="rose"],#screen .ktsubscriber-room [id*="Rose"],#screen .ktsubscriber-room [id*="rose"],'+
      '#screen .ktsecret-room [class*="rose"],#screen .ktsecret-room [id*="Rose"],#screen .ktsecret-room [id*="rose"]'
    ).forEach(function(el){
      if(looksLikeRoseCount(el)){
        el.style.setProperty('pointer-events','auto','important');
        el.style.setProperty('touch-action','manipulation','important');
        el.style.setProperty('cursor','pointer','important');
        el.setAttribute('title','누가 장미를 줬는지 보기');
      }
    });
  }
  mark();
  setInterval(mark,1200);
})();
