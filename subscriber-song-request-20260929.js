/* K-Talk 19,900원 구독자 전용 노래 신청 · 50:50 정산 안내/잠금 */
(function(){
  if(window.__ktSubscriberSongRequest20260929)return;
  window.__ktSubscriberSongRequest20260929=true;

  function owner(){
    try{return !!(window.ktIsOwnerAdmin&&window.ktIsOwnerAdmin());}catch(e){return false;}
  }
  function val(v){return String(v==null?'':v).trim().toLowerCase();}
  function subscriber19900(){
    if(owner())return true;
    var s=window.state||{};
    var values=[
      s.memberType,s.membership,s.plan,s.subscription,s.subscriptionPlan,
      s.subscriber,s.isSubscriber,s.vip,s.memberGrade
    ].map(val);
    try{
      ['ktalk_member_type','ktalk_membership','ktalk_plan','ktalk_subscription','ktalk_subscription_plan','ktalk_subscriber','ktalk_member_grade']
        .forEach(function(k){values.push(val(localStorage.getItem(k)));});
    }catch(e){}
    return values.some(function(x){
      return x==='subscriber'||x==='subscriber19900'||x==='19900'||x==='19,900'||x==='구독자'||x==='구독자19900'||x==='구독자 19900';
    });
  }

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  window.ktOpenSubscriberSongRequest20260929=function(){
    if(typeof window.showSheet!=='function')return false;
    if(!subscriber19900()){
      window.showSheet('🔒 구독자 전용 노래 신청',
        '<div class="rowbox"><b>월 19,900원 구독자 전용</b><br>노래 신청 기능은 19,900원 구독자에게만 열립니다.</div>'
        +'<div class="rowbox"><b>정산 기준</b><br>노래 신청 결제금액은 회사 50% · 노래를 부른 사람 50%로 정산합니다.</div>'
        +'<button class="act" onclick="if(window.openSubs)openSubs();else if(window.openSubscriberBenefits)openSubscriberBenefits()">구독 확인하기</button>');
      return false;
    }

    window.showSheet('🎤 구독자 노래 신청',
      '<div class="rowbox" style="border-color:#ffd76a"><b>💎 19,900원 구독자 혜택</b><br>구독자는 노래 신청을 이용할 수 있습니다.</div>'
      +'<div class="rowbox"><b>💰 정산</b><br>신청곡 결제금액의 <strong>50%는 회사 · 50%는 노래를 부른 사람</strong>에게 정산합니다.</div>'
      +'<div class="rowbox"><b>🎵 신청곡</b><br><input id="ktSongReqTitle20260929" placeholder="노래 제목" style="width:100%;box-sizing:border-box;margin-top:6px;padding:10px;border-radius:9px;border:1px solid #ffffff22;background:#101016;color:#fff"><input id="ktSongReqSinger20260929" placeholder="가수 또는 원하는 노래 부르는 사람" style="width:100%;box-sizing:border-box;margin-top:6px;padding:10px;border-radius:9px;border:1px solid #ffffff22;background:#101016;color:#fff"></div>'
      +'<div class="rowbox"><b>결제 금액</b><br>곡별 금액은 결제 단계에서 확인한 뒤 신청됩니다. 결제가 확인된 금액만 50:50 정산에 반영합니다.</div>'
      +'<button class="act" onclick="ktSaveSubscriberSongRequest20260929()">노래 신청 저장</button>');
    return false;
  };

  window.ktSaveSubscriberSongRequest20260929=function(){
    if(!subscriber19900()){
      alert('19,900원 구독자 전용 기능입니다.');
      return false;
    }
    var title=document.getElementById('ktSongReqTitle20260929');
    var singer=document.getElementById('ktSongReqSinger20260929');
    var t=title?String(title.value||'').trim():'';
    var s=singer?String(singer.value||'').trim():'';
    if(!t){alert('노래 제목을 입력해 주세요.');return false;}
    var list=[];
    try{list=JSON.parse(localStorage.getItem('ktalk_subscriber_song_requests_v1')||'[]');}catch(e){}
    if(!Array.isArray(list))list=[];
    list.push({id:'song_'+Date.now(),title:t,singer:s,createdAt:Date.now(),status:'결제 확인 대기',companyRate:50,performerRate:50});
    try{localStorage.setItem('ktalk_subscriber_song_requests_v1',JSON.stringify(list.slice(-300)));}catch(e){}
    alert('노래 신청이 저장되었습니다. 결제 확인 후 진행됩니다.');
    try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
    return false;
  };

  function patchSubscriberBenefits(){
    var old=window.openSubscriberBenefits;
    if(typeof old!=='function'||old.__ktSongPatched)return;
    var fn=function(){
      old.apply(this,arguments);
      setTimeout(function(){
        try{
          var body=document.getElementById('sheetBody');
          if(!body||body.querySelector('.kt-song-sub-benefit-20260929'))return;
          var box=document.createElement('div');
          box.className='rowbox kt-song-sub-benefit-20260929';
          box.style.marginTop='8px';
          box.innerHTML='<b>🎤 19,900원 구독자 노래 신청</b><br>19,900원 구독자만 노래 신청을 이용합니다. 신청곡 결제금액은 회사 50% · 노래를 부른 사람 50%로 정산합니다.<br><button class="act" style="margin-top:7px" onclick="ktOpenSubscriberSongRequest20260929()">노래 신청하기</button>';
          body.appendChild(box);
        }catch(e){}
      },30);
      return false;
    };
    fn.__ktSongPatched=true;
    window.openSubscriberBenefits=fn;
  }

  function patchGuide(){
    var old=window.openSiteGuide;
    if(typeof old!=='function'||old.__ktSongPatched)return;
    var fn=function(){
      old.apply(this,arguments);
      setTimeout(function(){
        try{
          var body=document.getElementById('sheetBody');
          if(!body||body.querySelector('.kt-song-guide-20260929'))return;
          var box=document.createElement('div');
          box.className='rowbox kt-song-guide-20260929';
          box.innerHTML='<b>🎤 구독자 노래 신청</b><br>월 19,900원 구독자 전용입니다. 노래를 신청하고 결제가 확인되면 진행하며, 결제금액은 회사 50% · 노래를 부른 사람 50%로 정산합니다. 일반회원에게는 잠겨 있습니다.';
          body.appendChild(box);
        }catch(e){}
      },30);
      return false;
    };
    fn.__ktSongPatched=true;
    window.openSiteGuide=fn;
  }

  function install(){patchSubscriberBenefits();patchGuide();}
  install();
  [100,300,700,1400,2500].forEach(function(ms){setTimeout(install,ms);});
})();