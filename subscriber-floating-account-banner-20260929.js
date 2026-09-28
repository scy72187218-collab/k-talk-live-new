/* K-Talk 구독자 상단 플로팅 계좌/문구 배너 */
(function(){
  if(window.__ktSubscriberFloatingBanner20260929)return;
  window.__ktSubscriberFloatingBanner20260929=true;

  var REF='zupwbfmacwzexyvznlzq';
  var APIKEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var BASE='https://'+REF+'.supabase.co/rest/v1/';
  var KEY='ktalk_subscriber_floating_banner_v1';
  var pollBusy=false,lastRemoteId='';

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function owner(){try{return !!(window.ktIsOwnerAdmin&&window.ktIsOwnerAdmin());}catch(e){return false;}}
  function sub19900(){
    if(owner())return true;
    var s=window.state||{};
    var vals=[s.memberType,s.membership,s.plan,s.subscription,s.subscriptionPlan,s.subscriber,s.isSubscriber,s.vip,s.memberGrade];
    try{
      ['ktalk_member_type','ktalk_membership','ktalk_plan','ktalk_subscription','ktalk_subscription_plan','ktalk_subscriber','ktalk_member_grade']
      .forEach(function(k){vals.push(localStorage.getItem(k));});
    }catch(e){}
    return vals.some(function(v){
      var x=String(v==null?'':v).trim().toLowerCase();
      return x==='subscriber'||x==='subscriber19900'||x==='19900'||x==='19,900'||x==='구독자'||x==='구독자19900'||x==='구독자 19900';
    });
  }
  function deviceId(){
    var id='';
    try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
    if(!id){
      id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
      try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
    }
    return id;
  }
  function isLocalHost(){
    try{
      return !!document.querySelector('#screen .ktsolo-room,#screen .ktg13-room,#screen .ktg9-room,#screen .ktsubscriber-room,#screen .ktsecret-room')
        && !document.documentElement.classList.contains('kt-remote-viewing');
    }catch(e){return false;}
  }
  function remoteHostId(){
    var id='';
    try{id=String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'').trim();}catch(e){}
    if(!id)try{id=String(sessionStorage.getItem('kt_remote_host_id')||'').trim();}catch(e){}
    return id;
  }
  function read(){
    try{
      var x=JSON.parse(localStorage.getItem(KEY)||'{}');
      return x&&typeof x==='object'?x:{};
    }catch(e){return {};}
  }
  function write(x){try{localStorage.setItem(KEY,JSON.stringify(x||{}));}catch(e){}}
  function ensureStyle(){
    if(document.getElementById('ktSubscriberFloatingBannerStyle20260929'))return;
    var st=document.createElement('style');
    st.id='ktSubscriberFloatingBannerStyle20260929';
    st.textContent=''
      +'#screen .kt-sub-float-banner-20260929{position:absolute!important;top:54px!important;left:50%!important;transform:translateX(-50%)!important;z-index:188!important;max-width:min(92%,620px)!important;padding:7px 13px!important;border:1px solid rgba(255,216,107,.58)!important;border-radius:16px!important;background:rgba(8,8,12,.78)!important;backdrop-filter:blur(7px)!important;color:#fff!important;box-shadow:0 5px 20px rgba(0,0,0,.35)!important;text-align:center!important;pointer-events:none!important;font:800 11px/1.35 system-ui,-apple-system,"Noto Sans KR",sans-serif!important}'
      +'#screen .kt-sub-float-banner-20260929 b{color:#ffe071!important;font-size:12px!important}'
      +'#screen .kt-sub-float-banner-20260929 span{display:block!important;white-space:normal!important;word-break:keep-all!important}'
      +'#screen .kt-sub-float-banner-20260929 small{display:block!important;margin-top:2px!important;color:#ddd!important;font-size:10px!important}'
      +'@media(max-width:390px){#screen .kt-sub-float-banner-20260929{top:48px!important;max-width:94%!important;padding:6px 9px!important;font-size:9px!important}#screen .kt-sub-float-banner-20260929 b{font-size:10px!important}}';
    document.head.appendChild(st);
  }
  function render(x){
    ensureStyle();
    var old=document.querySelector('#screen .kt-sub-float-banner-20260929');
    if(!x||!x.enabled||(!x.account&&!x.holder&&!x.message)){
      if(old)old.remove();
      return;
    }
    if(!old){
      old=document.createElement('div');
      old.className='kt-sub-float-banner-20260929';
      var screen=document.getElementById('screen');
      if(screen)screen.appendChild(old);
    }
    if(!old)return;
    var line=[];
    if(x.bank)line.push(esc(x.bank));
    if(x.account)line.push(esc(x.account));
    if(x.holder)line.push(esc(x.holder));
    old.innerHTML='<b>💎 구독자 안내</b><span>'+line.join(' · ')+'</span>'+(x.message?'<small>'+esc(x.message)+'</small>':'');
  }

  async function postBanner(x){
    if(!isLocalHost()||!sub19900())return;
    try{
      await fetch(BASE+'ktalk_live_messages',{
        method:'POST',
        headers:{apikey:APIKEY,Authorization:'Bearer '+APIKEY,'Content-Type':'application/json',Prefer:'return=minimal'},
        body:JSON.stringify({
          host_id:deviceId(),
          sender_id:'subbanner:'+deviceId(),
          sender_name:'구독자',
          message:JSON.stringify(x||{}),
          message_type:'subscriber_floating_banner'
        })
      });
    }catch(e){}
  }

  window.ktSaveSubscriberFloatingBanner20260929=function(){
    if(!sub19900()){alert('19,900원 구독자 전용입니다.');return false;}
    var bank=document.getElementById('ktSubFloatBank20260929');
    var account=document.getElementById('ktSubFloatAccount20260929');
    var holder=document.getElementById('ktSubFloatHolder20260929');
    var message=document.getElementById('ktSubFloatMessage20260929');
    var x={
      enabled:true,
      bank:bank?String(bank.value||'').trim():'',
      account:account?String(account.value||'').trim():'',
      holder:holder?String(holder.value||'').trim():'',
      message:message?String(message.value||'').trim():'',
      updatedAt:Date.now()
    };
    if(!x.account&&!x.holder&&!x.message){alert('계좌번호, 이름 또는 문구를 하나 이상 입력해 주세요.');return false;}
    write(x);render(x);postBanner(x);
    alert('상단에 띄울 내용을 저장했습니다.');
    return false;
  };
  window.ktClearSubscriberFloatingBanner20260929=function(){
    var x=read();x.enabled=false;x.updatedAt=Date.now();write(x);render(x);postBanner(x);return false;
  };

  window.ktOpenSubscriberFloatingBanner20260929=function(){
    if(!sub19900()){
      if(window.showSheet)window.showSheet('🔒 구독자 전용','<div class="rowbox"><b>월 19,900원 구독자 전용 기능입니다.</b></div>');
      return false;
    }
    var x=read();
    var html='<div class="rowbox"><b>💎 방송 상단 안내 띄우기</b><br>리모컨 없이 방송 화면 위쪽에 공중에 뜬 것처럼 고정해서 보여줍니다.</div>'
      +'<div class="rowbox"><b>은행</b><input id="ktSubFloatBank20260929" value="'+esc(x.bank||'')+'" placeholder="은행명" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px;border-radius:8px;border:1px solid #ffffff22;background:#101016;color:#fff"></div>'
      +'<div class="rowbox"><b>계좌번호</b><input id="ktSubFloatAccount20260929" value="'+esc(x.account||'')+'" placeholder="계좌번호" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px;border-radius:8px;border:1px solid #ffffff22;background:#101016;color:#fff"></div>'
      +'<div class="rowbox"><b>이름 · 예금주</b><input id="ktSubFloatHolder20260929" value="'+esc(x.holder||'')+'" placeholder="이름 또는 예금주" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px;border-radius:8px;border:1px solid #ffffff22;background:#101016;color:#fff"></div>'
      +'<div class="rowbox"><b>문구</b><textarea id="ktSubFloatMessage20260929" placeholder="방송 위에 띄울 문구" style="width:100%;min-height:68px;box-sizing:border-box;margin-top:6px;padding:9px;border-radius:8px;border:1px solid #ffffff22;background:#101016;color:#fff">'+esc(x.message||'')+'</textarea></div>'
      +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px"><button class="act" onclick="ktSaveSubscriberFloatingBanner20260929()">저장 · 위에 띄우기</button><button class="act" onclick="ktClearSubscriberFloatingBanner20260929()">표시 끄기</button></div>';
    if(window.showSheet)window.showSheet('📌 구독자 상단 안내',html);
    return false;
  };

  function patchBenefits(){
    var old=window.openSubscriberBenefits;
    if(typeof old!=='function'||old.__ktFloatBannerPatched)return;
    var fn=function(){
      old.apply(this,arguments);
      setTimeout(function(){
        try{
          var body=document.getElementById('sheetBody');
          if(!body||body.querySelector('.kt-sub-float-benefit-20260929'))return;
          var box=document.createElement('div');
          box.className='rowbox kt-sub-float-benefit-20260929';
          box.style.marginTop='8px';
          box.innerHTML='<b>📌 방송 위 계좌 · 이름 · 문구 띄우기</b><br>19,900원 구독자는 계좌번호, 이름, 안내 문구를 직접 넣고 방송 화면 위쪽에 공중에 뜬 것처럼 고정해서 표시할 수 있습니다. 별도 리모컨은 없습니다.<br><button class="act" style="margin-top:7px" onclick="ktOpenSubscriberFloatingBanner20260929()">상단 안내 설정</button>';
          body.appendChild(box);
        }catch(e){}
      },30);
      return false;
    };
    fn.__ktFloatBannerPatched=true;
    window.openSubscriberBenefits=fn;
  }

  async function pollRemote(){
    if(pollBusy||isLocalHost())return;
    var host=remoteHostId();
    if(!host)return;
    pollBusy=true;
    try{
      var since=new Date(Date.now()-25000).toISOString();
      var url=BASE+'ktalk_live_messages?select=id,message,created_at'
        +'&host_id=eq.'+enc(host)
        +'&message_type=eq.subscriber_floating_banner'
        +'&created_at=gte.'+enc(since)
        +'&order=created_at.desc&limit=1';
      var r=await fetch(url,{cache:'no-store',headers:{apikey:APIKEY,Authorization:'Bearer '+APIKEY}});
      if(r&&r.ok){
        var rows=await r.json(),row=rows&&rows[0];
        if(row&&String(row.id)!==lastRemoteId){
          lastRemoteId=String(row.id||'');
          var x={};try{x=JSON.parse(row.message||'{}')||{};}catch(e){}
          render(x);
        }
      }
    }catch(e){}
    pollBusy=false;
  }
  function tick(){
    patchBenefits();
    if(isLocalHost()){
      var x=read();
      if(sub19900()&&x&&x.enabled){render(x);}
      else render(null);
    }else{
      pollRemote();
    }
  }
  patchBenefits();
  [100,350,800,1500].forEach(function(ms){setTimeout(tick,ms);});
  setInterval(function(){
    tick();
    if(isLocalHost()&&sub19900()){
      var x=read();
      if(x&&x.enabled)postBanner(x);
    }
  },5000);
})();