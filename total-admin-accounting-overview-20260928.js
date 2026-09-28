(function(){
  if(window.__ktTotalAdminAccounting20260928)return;
  window.__ktTotalAdminAccounting20260928=true;

  var KEY='ktalk_admin_accounting_ledger_v1';
  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var APIKEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJIUzI1NiIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';

  function isOwner(){
    try{
      var k=String(window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'').toLowerCase();
      if(k==='taekwon1'||k==='haine2')return true;
    }catch(e){}
    try{return !!(window.ktIsOwnerAdmin&&window.ktIsOwnerAdmin());}catch(e){}
    return false;
  }
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function money(v){return (parseInt(v,10)||0).toLocaleString('ko-KR')+'원';}
  function now(){return new Date().toISOString();}
  function ledger(){
    try{
      var a=JSON.parse(localStorage.getItem(KEY)||'[]');
      return Array.isArray(a)?a:[];
    }catch(e){return [];}
  }
  function save(a){try{localStorage.setItem(KEY,JSON.stringify(a.slice(-3000)));}catch(e){}}
  function identity(){
    var name='회원',id='';
    try{
      var s=window.state||{};
      name=s.profileName||s.nickname||s.displayName||s.name||name;
      id=s.profileId||s.accountId||'';
    }catch(e){}
    try{
      name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;
      id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;
    }catch(e){}
    return {name:name,id:id};
  }

  window.ktAccountingRecord20260928=function(x){
    x=x||{};
    var a=ledger(),me=identity();
    var row={
      id:x.id||('tx_'+Date.now()+'_'+Math.random().toString(36).slice(2,7)),
      at:x.at||now(),
      member:x.member||me.name,
      memberId:x.memberId||me.id,
      type:x.type||'기타',
      moneyIn:Math.max(0,parseInt(x.moneyIn,10)||0),
      moneyOut:Math.max(0,parseInt(x.moneyOut,10)||0),
      requested:Math.max(0,parseInt(x.requested,10)||0),
      status:x.status||'확인',
      memo:x.memo||''
    };
    a.push(row); save(a); return row;
  };

  window.ktRecordCashoutRequest20260928=function(amount){
    var me=identity();
    return window.ktAccountingRecord20260928({
      member:me.name,memberId:me.id,type:'환전 신청',
      requested:amount,status:'관리자 확인 대기',
      memo:'방송 실제 수익 환전 신청'
    });
  };

  window.ktMarkAccountingPaid20260928=function(id){
    if(!isOwner())return false;
    var a=ledger(),found=false;
    a.forEach(function(x){
      if(x.id===id&&x.type==='환전 신청'&&x.status!=='지급완료'){
        x.moneyOut=parseInt(x.requested,10)||0;
        x.status='지급완료';
        x.paidAt=now();
        found=true;
      }
    });
    if(found)save(a);
    window.ktOpenTotalAdminOverview20260928();
    return false;
  };

  window.ktAdminAddAccounting20260928=function(kind){
    if(!isOwner())return false;
    var member=prompt('이름 또는 닉네임','')||'';
    var amount=parseInt((prompt(kind==='입금'?'실제 들어온 금액':'실제 빠져나간 금액','')||'').replace(/[^0-9]/g,''),10)||0;
    if(amount<=0){alert('금액을 확인해 주세요.');return false;}
    var memo=prompt('거래 내용 또는 메모','')||'';
    window.ktAccountingRecord20260928({
      member:member||'직접 입력',type:kind,
      moneyIn:kind==='입금'?amount:0,
      moneyOut:kind==='지출'?amount:0,
      status:'확인완료',memo:memo
    });
    window.ktOpenTotalAdminOverview20260928();
    return false;
  };

  async function countRows(table,extra){
    try{
      var r=await fetch(BASE+table+'?select=id'+(extra||'')+'&limit=1',{
        headers:{apikey:APIKEY,Authorization:'Bearer '+APIKEY,Prefer:'count=exact',Range:'0-0'}
      });
      var cr=r.headers.get('content-range')||'';
      var m=cr.match(/\/(\d+)$/);
      return m?parseInt(m[1],10):0;
    }catch(e){return 0;}
  }

  function totals(a){
    var o={moneyIn:0,moneyOut:0,pending:0,paid:0};
    a.forEach(function(x){
      o.moneyIn+=parseInt(x.moneyIn,10)||0;
      o.moneyOut+=parseInt(x.moneyOut,10)||0;
      if(x.type==='환전 신청'&&x.status!=='지급완료')o.pending+=parseInt(x.requested,10)||0;
      if(x.type==='환전 신청'&&x.status==='지급완료')o.paid+=parseInt(x.requested,10)||0;
    });
    return o;
  }

  function rowsHtml(a){
    if(!a.length)return '<tr><td colspan="8" style="padding:16px;text-align:center;color:#aaa">아직 기록된 거래가 없습니다.</td></tr>';
    return a.slice().reverse().map(function(x){
      var action=(x.type==='환전 신청'&&x.status!=='지급완료')
        ?'<button type="button" onclick="ktMarkAccountingPaid20260928(\''+esc(x.id)+'\')" style="border:0;border-radius:8px;padding:5px 7px;background:#2d9b55;color:#fff;font-weight:900">지급완료</button>'
        :'';
      return '<tr>'
        +'<td>'+esc(String(x.at||'').replace('T',' ').slice(0,16))+'</td>'
        +'<td>'+esc(x.member||'')+'</td>'
        +'<td>'+esc(x.type||'')+'</td>'
        +'<td style="text-align:right">'+(x.moneyIn?money(x.moneyIn):'-')+'</td>'
        +'<td style="text-align:right">'+(x.moneyOut?money(x.moneyOut):'-')+'</td>'
        +'<td style="text-align:right">'+(x.requested?money(x.requested):'-')+'</td>'
        +'<td>'+esc(x.status||'')+' '+action+'</td>'
        +'<td>'+esc(x.memo||'')+'</td>'
        +'</tr>';
    }).join('');
  }

  window.ktExportAccountingCsv20260928=function(){
    if(!isOwner())return false;
    var a=ledger();
    var lines=[['날짜','이름','구분','들어온돈','빠져나간돈','환전신청','상태','내용']];
    a.forEach(function(x){
      lines.push([x.at||'',x.member||'',x.type||'',x.moneyIn||0,x.moneyOut||0,x.requested||0,x.status||'',x.memo||'']);
    });
    var csv='\ufeff'+lines.map(function(r){return r.map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');
    var blob=new Blob([csv],{type:'text/csv;charset=utf-8'});
    var url=URL.createObjectURL(blob),aEl=document.createElement('a');
    aEl.href=url;
    aEl.download='K-Talk_세무정산_'+new Date().toISOString().slice(0,10)+'.csv';
    document.body.appendChild(aEl);aEl.click();aEl.remove();
    setTimeout(function(){URL.revokeObjectURL(url);},1000);
    return false;
  };

  window.ktOpenTotalAdminOverview20260928=async function(){
    if(!isOwner())return false;
    var a=ledger(),t=totals(a);
    var company=0;
    try{company=parseInt(localStorage.getItem('ktalk_company_revenue_total')||'0',10)||0;}catch(e){}
    var rank=0,wins=0,losses=0;
    try{rank=parseInt(localStorage.getItem('ktalk_daily_rank')||'0',10)||0;}catch(e){}
    try{wins=parseInt(localStorage.getItem('ktalk_match_wins')||'0',10)||0;losses=parseInt(localStorage.getItem('ktalk_match_losses')||'0',10)||0;}catch(e){}
    var html='<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:7px">'
      +'<div class="rowbox"><b>👥 총 가입자</b><br><strong id="ktAdminMemberCount20260928">확인 중</strong></div>'
      +'<div class="rowbox"><b>🔴 현재 방송</b><br><strong id="ktAdminLiveCount20260928">확인 중</strong></div>'
      +'<div class="rowbox"><b>💵 실제 들어온 돈</b><br><strong>'+money(t.moneyIn)+'</strong></div>'
      +'<div class="rowbox"><b>💸 실제 빠져나간 돈</b><br><strong>'+money(t.moneyOut)+'</strong></div>'
      +'<div class="rowbox"><b>⏳ 환전 신청 대기</b><br><strong>'+money(t.pending)+'</strong></div>'
      +'<div class="rowbox"><b>✅ 환전 지급 완료</b><br><strong>'+money(t.paid)+'</strong></div>'
      +'<div class="rowbox"><b>🏢 회사 수익 계산액</b><br><strong>'+money(company)+'</strong></div>'
      +'<div class="rowbox"><b>📊 현재 일일 랭킹</b><br><strong>'+rank+'위</strong></div>'
      +'<div class="rowbox"><b>⚔ 매치</b><br><strong>승 '+wins+' / 패 '+losses+'</strong></div>'
      +'<div class="rowbox"><b>🧾 장부 잔액</b><br><strong>'+money(t.moneyIn-t.moneyOut)+'</strong></div>'
      +'</div>'
      +'<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin:10px 0">'
      +'<button class="act" onclick="ktAdminAddAccounting20260928(\'입금\')">＋ 입금 기록</button>'
      +'<button class="act" onclick="ktAdminAddAccounting20260928(\'지출\')">－ 지출 기록</button>'
      +'<button class="act" onclick="ktExportAccountingCsv20260928()">📥 엑셀용 CSV</button>'
      +'</div>'
      +'<div class="rowbox"><b>📑 세무·정산 거래표</b><br>실제 입금·출금과 환전 신청을 구분해서 기록합니다. 세금 신고 시 은행 내역·영수증·세금계산서 같은 증빙과 함께 확인하세요.</div>'
      +'<div style="overflow:auto;max-height:48vh;border:1px solid #ffffff22;border-radius:12px;margin-top:8px">'
      +'<table style="border-collapse:collapse;width:100%;min-width:900px;color:#fff;font-size:11px">'
      +'<thead><tr style="background:#17171d;position:sticky;top:0"><th>날짜</th><th>이름</th><th>구분</th><th>들어온 돈</th><th>빠져나간 돈</th><th>환전 신청</th><th>상태</th><th>내용</th></tr></thead>'
      +'<tbody>'+rowsHtml(a)+'</tbody></table></div>';
    if(typeof window.showSheet==='function')window.showSheet('📊 총관리 · 세무/정산 현황',html);

    Promise.all([
      countRows('ktalk_profiles',''),
      countRows('ktalk_live_rooms','&active=eq.true')
    ]).then(function(v){
      var m=document.getElementById('ktAdminMemberCount20260928');
      var l=document.getElementById('ktAdminLiveCount20260928');
      if(m)m.textContent=(v[0]||0).toLocaleString('ko-KR')+'명';
      if(l)l.textContent=(v[1]||0).toLocaleString('ko-KR')+'개';
    });
    return false;
  };
})();