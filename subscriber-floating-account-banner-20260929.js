/* K-Talk 구독자 방송 상단 플로팅 안내 + 선물 바로가기
   19,900원: 계좌/이름/문구 + 선물 4개
   14,900원: 문구 + 선물 3개 (계좌 표시 불가) */
(function(){
  if(window.__ktSubscriberFloatingBanner20260929)return;
  window.__ktSubscriberFloatingBanner20260929=true;

  var REF='zupwbfmacwzexyvznlzq';
  var APIKEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var BASE='https://'+REF+'.supabase.co/rest/v1/';
  var KEY='ktalk_subscriber_floating_banner_v2';
  var pollBusy=false,lastRemoteId='';

  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function enc(v){return encodeURIComponent(String(v==null?'':v));}
  function owner(){try{return !!(window.ktIsOwnerAdmin&&window.ktIsOwnerAdmin());}catch(e){return false;}}

  function tier(){
    if(owner())return 19900;
    var s=window.state||{};
    var vals=[
      s.memberType,s.membership,s.plan,s.subscription,s.subscriptionPlan,
      s.subscriber,s.isSubscriber,s.vip,s.memberGrade,s.grade,s.memberClass
    ];
    try{
      ['ktalk_member_type','ktalk_membership','ktalk_plan','ktalk_subscription','ktalk_subscription_plan',
       'ktalk_subscriber','ktalk_member_grade','ktalk_grade','ktalk_member_class']
      .forEach(function(k){vals.push(localStorage.getItem(k));});
    }catch(e){}
    var norm=vals.map(function(v){return String(v==null?'':v).replace(/\s+/g,'').toLowerCase();});
    if(norm.some(function(x){
      return x==='14900'||x==='14,900'||x==='중회원'||x==='middle'||x==='mid'||x==='subscriber14900'||x==='구독자14900';
    }))return 14900;
    if(norm.some(function(x){
      return x==='19900'||x==='19,900'||x==='vip'||x==='subscriber19900'||x==='구독자19900'||x==='subscriber'||x==='구독자';
    }))return 19900;
    return 0;
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

  function giftDefs(t){
    return t===19900
      ?[{i:0,e:'🌹',n:'장미'},{i:1,e:'💖',n:'하트'},{i:2,e:'💐',n:'꽃다발'},{i:3,e:'💗',n:'풍선'}]
      :[{i:0,e:'🌹',n:'장미'},{i:1,e:'💖',n:'하트'},{i:2,e:'💐',n:'꽃다발'}];
  }

  function ensureStyle(){
    if(document.getElementById('ktSubscriberFloatingBannerStyle20260929'))return;
    var st=document.createElement('style');
    st.id='ktSubscriberFloatingBannerStyle20260929';
    st.textContent=''
      +'#screen .kt-sub-float-wrap-20260929{position:absolute!important;top:54px!important;left:50%!important;transform:translateX(-50%)!important;z-index:188!important;display:flex!important;align-items:center!important;gap:6px!important;max-width:min(96%,720px)!important;pointer-events:none!important}'
      +'#screen .kt-sub-float-banner-20260929{min-width:0!important;max-width:560px!important;padding:7px 13px!important;border:1px solid rgba(255,216,107,.58)!important;border-radius:16px!important;background:rgba(8,8,12,.78)!important;backdrop-filter:blur(7px)!important;color:#fff!important;box-shadow:0 5px 20px rgba(0,0,0,.35)!important;text-align:center!important;pointer-events:none!important;font:800 11px/1.35 system-ui,-apple-system,"Noto Sans KR",sans-serif!important}'
      +'#screen .kt-sub-float-banner-20260929 b{color:#ffe071!important;font-size:12px!important}'
      +'#screen .kt-sub-float-banner-20260929 span{display:block!important;white-space:normal!important;word-break:keep-all!important}'
      +'#screen .kt-sub-float-banner-20260929 small{display:block!important;margin-top:2px!important;color:#ddd!important;font-size:10px!important}'
      +'#screen .kt-sub-float-gifts-20260929{display:flex!important;gap:4px!important;pointer-events:auto!important}'
      +'#screen .kt-sub-float-gifts-20260929 button{width:38px!important;height:38px!important;border-radius:12px!important;border:1px solid rgba(255,255,255,.24)!important;background:rgba(15,15,20,.88)!important;color:#fff!important;font-size:19px!important;display:grid!important;place-items:center!important;cursor:pointer!important;touch-action:manipulation!important;padding:0!important}'
      +'#screen .kt-sub-float-gifts-20260929 button:active{transform:scale(.94)!important}'
      +'@media(max-width:390px){#screen .kt-sub-float-wrap-20260929{top:48px!important;max-width:97%!important;gap:4px!important}#screen .kt-sub-float-banner-20260929{max-width:255px!important;padding:6px 8px!important;font-size:9px!important}#screen .kt-sub-float-banner-20260929 b{font-size:10px!important}#screen .kt-sub-float-gifts-20260929{gap:2px!important}#screen .kt-sub-float-gifts-20260929 button{width:31px!important;height:31px!important;border-radius:9px!important;font-size:16px!important}}';
    document.head.appendChild(st);
  }

  window.ktSendFloatingGift20260929=function(idx){
    try{
      if(typeof window.giftSendByIndex==='function'){window.giftSendByIndex(parseInt(idx,10)||0);return false;}
      if(typeof window.openGifts==='function')window.openGifts();
    }catch(e){}
    return false;
  };

  function render(x){
    ensureStyle();
    var old=document.querySelector('#screen .kt-sub-float-wrap-20260929');
    if(!x||!x.enabled||(!x.account&&!x.holder&&!x.message)){
      if(old)old.remove();
      return;
    }
    if(!old){
      old=document.createElement('div');
      old.className='kt-sub-float-wrap-20260929';
      var screen=document.getElementById('screen');
      if(screen)screen.appendChild(old);
    }
    if(!old)return;

    var t=parseInt(x.tier,10)||14900;
    var accountLine=[];
    if(t===19900){
      if(x.bank)accountLine.push(esc(x.bank));
      if(x.account)accountLine.push(esc(x.account));
      if(x.holder)accountLine.push(esc(x.holder));
    }
    var gifts=giftDefs(t).map(function(g){
      return '<button type="button" title="'+esc(g.n)+' 바로 선물" aria-label="'+esc(g.n)+' 바로 선물" onclick="return ktSendFloatingGift20260929('+g.i+')">'+g.e+'</button>';
    }).join('');

    old.innerHTML='<div class="kt-sub-float-banner-20260929">'
      +'<b>💎 '+(t===19900?'19,900원':'14,900원')+' 구독자</b>'
      +(accountLine.length?'<span>'+accountLine.join(' · ')+'</span>':'')
      +(x.message?'<small>'+esc(x.message)+'</small>':'')
      +'</div><div class="kt-sub-float-gifts-20260929">'+gifts+'</div>';
  }

  async function postBanner(x){
    if(!isLocalHost()||tier()===0)return;
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
    var t=tier();
    if(!t){alert('14,900원 또는 19,900원 구독자 전용입니다.');return false;}
    var bank=document.getElementById('ktSubFloatBank20260929');
    var account=document.getElementById('ktSubFloatAccount20260929');
    var holder=document.getElementById('ktSubFloatHolder20260929');
    var message=document.getElementById('ktSubFloatMessage20260929');
    var x={
      enabled:true,
      tier:t,
      bank:t===19900&&bank?String(bank.value||'').trim():'',
      account:t===19900&&account?String(account.value||'').trim():'',
      holder:t===19900&&holder?String(holder.value||'').trim():'',
      message:message?String(message.value||'').trim():'',
      updatedAt:Date.now()
    };
    if(t===19900&&!x.account&&!x.holder&&!x.message){alert('계좌번호, 이름 또는 문구를 하나 이상 입력해 주세요.');return false;}
    if(t===14900&&!x.message){alert('띄울 문구를 입력해 주세요.');return false;}
    write(x);render(x);postBanner(x);
    alert('방송 위 안내와 선물을 저장했습니다.');
    return false;
  };
  window.ktClearSubscriberFloatingBanner20260929=function(){
    var x=read();x.enabled=false;x.updatedAt=Date.now();write(x);render(x);postBanner(x);return false;
  };

  window.ktOpenSubscriberFloatingBanner20260929=function(){
    var t=tier();
    if(!t){
      if(window.showSheet)window.showSheet('🔒 구독자 전용','<div class="rowbox"><b>월 14,900원 또는 19,900원 구독자 전용 기능입니다.</b></div>');
      return false;
    }
    var x=read();
    var accountFields=t===19900
      ?'<div class="rowbox"><b>은행</b><input id="ktSubFloatBank20260929" value="'+esc(x.bank||'')+'" placeholder="은행명" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px;border-radius:8px;border:1px solid #ffffff22;background:#101016;color:#fff"></div>'
       +'<div class="rowbox"><b>계좌번호</b><input id="ktSubFloatAccount20260929" value="'+esc(x.account||'')+'" placeholder="계좌번호" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px;border-radius:8px;border:1px solid #ffffff22;background:#101016;color:#fff"></div>'
       +'<div class="rowbox"><b>이름 · 예금주</b><input id="ktSubFloatHolder20260929" value="'+esc(x.holder||'')+'" placeholder="이름 또는 예금주" style="width:100%;box-sizing:border-box;margin-top:6px;padding:9px;border-radius:8px;border:1px solid #ffffff22;background:#101016;color:#fff"></div>'
      :'<div class="rowbox"><b>🔒 계좌번호 기능</b><br>14,900원 구독자는 계좌번호를 띄울 수 없습니다. 문구와 선물 3개만 사용할 수 있습니다.</div>';

    var html='<div class="rowbox"><b>💎 '+(t===19900?'19,900원':'14,900원')+' 방송 상단 안내</b><br>'
      +(t===19900?'계좌·이름·문구와 선물 4개를':'문구와 선물 3개를')
      +' 방송 위쪽에 공중에 뜬 것처럼 보여줍니다. 별도 리모컨은 없습니다.</div>'
      +accountFields
      +'<div class="rowbox"><b>문구</b><textarea id="ktSubFloatMessage20260929" placeholder="방송 위에 띄울 문구" style="width:100%;min-height:68px;box-sizing:border-box;margin-top:6px;padding:9px;border-radius:8px;border:1px solid #ffffff22;background:#101016;color:#fff">'+esc(x.message||'')+'</textarea></div>'
      +'<div class="rowbox"><b>🎁 바로 선물</b><br>'+(t===19900?'🌹 장미 · 💖 하트 · 💐 꽃다발 · 💗 풍선':'🌹 장미 · 💖 하트 · 💐 꽃다발')+'이 안내판 옆에 항상 뜹니다. 시청자가 누르면 바로 해당 선물이 보내집니다.</div>'
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
          box.innerHTML='<b>📌 방송 위 안내 · 바로 선물</b><br><strong>19,900원:</strong> 계좌번호·이름·문구 + 선물 4개<br><strong>14,900원:</strong> 문구 + 선물 3개, 계좌번호는 사용 불가<br>방송 위쪽에 공중에 뜬 것처럼 표시하고 별도 리모컨은 없습니다.<br><button class="act" style="margin-top:7px" onclick="ktOpenSubscriberFloatingBanner20260929()">상단 안내 설정</button>';
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
      var x=read(),t=tier();
      if(t&&x&&x.enabled){
        x.tier=t;
        if(t===14900){x.bank='';x.account='';x.holder='';}
        render(x);
      }else render(null);
    }else pollRemote();
  }

  patchBenefits();
  [100,350,800,1500].forEach(function(ms){setTimeout(tick,ms);});
  setInterval(function(){
    tick();
    if(isLocalHost()&&tier()){
      var x=read(),t=tier();
      if(x&&x.enabled){
        x.tier=t;
        if(t===14900){x.bank='';x.account='';x.holder='';}
        postBanner(x);
      }
    }
  },5000);
})();