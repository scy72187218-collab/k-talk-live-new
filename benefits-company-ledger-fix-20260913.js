/* K-Talk 혜택 문구 + 회사 정산 장부 보정. 방 화면/선물/미션/버튼은 변경하지 않음. */
(function(){
  if(window.__ktBenefitsCompanyLedgerFix20260913)return;
  window.__ktBenefitsCompanyLedgerFix20260913=true;

  var roomSelector='.ktsolo-room,.ktg13-room,.ktsubscriber-room,.ktsecret-room';

  function visibleRoom(){
    var rooms=[].slice.call(document.querySelectorAll(roomSelector));
    for(var i=0;i<rooms.length;i++){
      try{
        var cs=getComputedStyle(rooms[i]);
        var r=rooms[i].getBoundingClientRect();
        if(cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>0&&r.height>0)return rooms[i];
      }catch(e){}
    }
    return null;
  }

  function num(v){
    var n=Number(v);
    return isFinite(n)?n:0;
  }

  function won(v){
    return Math.round(num(v)).toLocaleString('ko-KR')+'원';
  }

  function latestHostSummary(){
    var latest=null;
    try{
      for(var i=0;i<localStorage.length;i++){
        var key=localStorage.key(i)||'';
        if(key.indexOf('ktalk_last_earnings_')!==0)continue;
        try{
          var data=JSON.parse(localStorage.getItem(key)||'null');
          if(!data||!data.endedAt)continue;
          if(!latest||num(data.endedAt)>num(latest.endedAt))latest=data;
        }catch(e){}
      }
    }catch(e){}
    return latest;
  }

  function patchBenefitHub(){
    var body=document.getElementById('sheetBody');
    if(!body)return;

    try{
      var summary=latestHostSummary();
      var top=body.querySelector('.kt-benefit-top');
      if(top){
        var boxes=top.children;
        if(boxes[0]){
          var b0=boxes[0].querySelector('b'),s0=boxes[0].querySelector('strong');
          if(b0)b0.textContent='최근 방송 장미';
          if(s0)s0.textContent=summary?(num(summary.roses).toLocaleString('ko-KR')+'송이'):'0송이';
        }
        if(boxes[1]){
          var b1=boxes[1].querySelector('b'),s1=boxes[1].querySelector('strong');
          if(b1)b1.textContent='최근 방송 정산';
          if(s1)s1.textContent=summary?won(summary.mine):'0원';
        }
        if(boxes[2]){
          var b2=boxes[2].querySelector('b'),s2=boxes[2].querySelector('strong');
          if(b2)b2.textContent='내 정산율';
          if(s2)s2.textContent=summary?(Math.round(num(summary.rate))+'%'):'-';
        }
      }

      var note=body.querySelector('.kt-benefit-net-note');
      if(note)note.textContent='🔒 방송 정산은 실제 받은 장미와 회원 정산율로 계산합니다';

      body.querySelectorAll('.kt-benefit-room-grid button').forEach(function(btn){
        var b=btn.querySelector('b');
        if(!b)return;
        if(String(b.textContent||'').replace(/\s+/g,'').indexOf('출석·참여')>-1){
          b.textContent='방송방 출석 응원';
          var small=btn.querySelector('small');
          if(small)small.textContent='시청자가 누르면 호스트에게 장미 1송이';
        }
      });
    }catch(e){}
  }

  var oldAttendance=window.openAttendanceBenefits;
  window.openAttendanceBenefits=function(){
    if(visibleRoom()&&typeof oldAttendance==='function')return oldAttendance.apply(this,arguments);
    if(typeof window.showSheet==='function'){
      showSheet('✅ 방송방 출석 응원',
        '<div class="rowbox"><b>출석체크 뜻</b><br>방에 들어온 시청자가 출석체크를 누르면 그 방을 연 호스트에게 🌹 장미 1송이가 들어갑니다.</div>'
        +'<div class="rowbox"><b>시청자 보상 아님</b><br>시청자 본인에게 하트·현금·코인 출석 보상은 지급하지 않습니다.</div>'
        +'<div class="rowbox"><b>중복 지급 방지</b><br>같은 시청자가 같은 방송에서 반복해서 눌러도 장미가 계속 지급되지 않습니다.</div>');
    }
  };

  var oldHub=window.openBenefitHub;
  if(typeof oldHub==='function'){
    window.openBenefitHub=function(){
      var r=oldHub.apply(this,arguments);
      setTimeout(patchBenefitHub,0);
      return r;
    };
  }

  window.openReceiveBenefits=function(){
    if(typeof window.showSheet==='function'){
      showSheet('🎉 혜택 받기',
        '<div class="rowbox"><b>받을 수 있는 혜택</b><br>7일 방송 · 제비뽑기 · 미션 · 이벤트 · 랭킹 등 실제 운영 혜택을 확인합니다.</div>'
        +'<div class="rowbox"><b>출석체크 안내</b><br>방송방 출석체크는 시청자 보상이 아니라 호스트에게 장미 1송이를 보내는 응원 기능입니다.</div>'
        +'<div class="rowbox"><b>받는 방법</b><br>혜택 · 보상 센터에서 각 항목의 조건과 지급 여부를 확인합니다.</div>');
    }
  };

  var oldGuide=window.openSiteGuide;
  if(typeof oldGuide==='function'){
    window.openSiteGuide=function(){
      var r=oldGuide.apply(this,arguments);
      setTimeout(function(){
        try{
          var body=document.getElementById('sheetBody');
          if(!body)return;
          body.querySelectorAll('b').forEach(function(b){
            var t=String(b.textContent||'').replace(/\s+/g,'');
            if(t==='출석·참여보상'){
              b.textContent='방송방 출석 응원';
              var small=b.parentElement&&b.parentElement.querySelector('small');
              if(small)small.textContent='시청자가 출석체크하면 호스트에게 장미 1송이가 들어갑니다.';
            }
          });
        }catch(e){}
      },0);
      return r;
    };
  }

  function recordCompanyRevenue(){
    var s=latestHostSummary();
    if(!s||!s.endedAt)return;
    var key='ktalk_company_settlement_recorded:'+String(s.endedAt);
    try{if(localStorage.getItem(key)==='1')return;}catch(e){}

    var gross=Math.max(0,num(s.gross));
    var host=Math.max(0,num(s.mine));
    var hostRate=Math.max(0,Math.min(100,num(s.rate)));
    var company=Math.max(0,Math.round(gross-host));
    var companyRate=Math.max(0,100-hostRate);
    var row={
      endedAt:num(s.endedAt),
      memberType:String(s.memberType||'general'),
      roses:Math.max(0,num(s.roses)),
      gross:Math.round(gross),
      host:Math.round(host),
      hostRate:Math.round(hostRate),
      company:company,
      companyRate:Math.round(companyRate)
    };

    try{
      var ledger=[];
      try{ledger=JSON.parse(localStorage.getItem('ktalk_company_revenue_ledger')||'[]');}catch(e){ledger=[];}
      if(!Array.isArray(ledger))ledger=[];
      ledger.push(row);
      if(ledger.length>500)ledger=ledger.slice(ledger.length-500);
      var total=ledger.reduce(function(sum,x){return sum+Math.max(0,num(x&&x.company));},0);
      localStorage.setItem('ktalk_company_revenue_ledger',JSON.stringify(ledger));
      localStorage.setItem('ktalk_company_revenue_total',String(Math.round(total)));
      localStorage.setItem(key,'1');
    }catch(e){}
  }

  window.ktGetCompanyRevenueTotal=function(){
    try{return Math.max(0,num(localStorage.getItem('ktalk_company_revenue_total')||0));}catch(e){return 0;}
  };
  window.ktGetCompanyRevenueLedger=function(){
    try{
      var a=JSON.parse(localStorage.getItem('ktalk_company_revenue_ledger')||'[]');
      return Array.isArray(a)?a:[];
    }catch(e){return [];}
  };

  function installEndWrapper(){
    var oldEnd=window.endBroadcastEarnings;
    if(typeof oldEnd!=='function'||oldEnd.__ktCompanyLedgerWrapped)return;
    function wrappedEnd(){
      var before=latestHostSummary();
      var beforeAt=before?num(before.endedAt):0;
      var r=oldEnd.apply(this,arguments);
      setTimeout(function(){
        var now=latestHostSummary();
        if(now&&num(now.endedAt)>beforeAt)recordCompanyRevenue();
      },0);
      return r;
    }
    wrappedEnd.__ktCompanyLedgerWrapped=true;
    window.endBroadcastEarnings=wrappedEnd;
  }

  installEndWrapper();
  setTimeout(installEndWrapper,200);
  setTimeout(installEndWrapper,800);
})();
