/* K-Talk 총관리 전체 관리 현황 */
(function(){
  if(window.__ktTotalAdminOverview20260928)return;
  window.__ktTotalAdminOverview20260928=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFjZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';

  function owner(){
    try{return typeof window.ktIsOwnerAdmin==='function'&&window.ktIsOwnerAdmin();}catch(e){return false;}
  }
  function h(){return {apikey:KEY,Authorization:'Bearer '+KEY};}
  async function get(path){
    var r=await fetch(BASE+path,{headers:h()});
    if(!r.ok)throw new Error(String(r.status));
    return await r.json();
  }
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(x){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x];});}
  function num(v){var n=parseInt(v,10);return isFinite(n)?n:0;}
  function local(k,d){try{return localStorage.getItem(k)||d||'';}catch(e){return d||'';}}
  function style(){
    if(document.getElementById('ktTotalAdminOverviewStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktTotalAdminOverviewStyle20260928';
    s.textContent='.kt-admin-overview{color:#fff}.kt-admin-summary{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px;margin-bottom:10px}.kt-admin-summary div{padding:10px;border:1px solid #ffffff22;border-radius:12px;background:#101016}.kt-admin-summary b{display:block;font-size:10px;color:#bbb}.kt-admin-summary strong{display:block;margin-top:3px;font-size:20px;color:#ffe071}.kt-admin-tabs{display:flex;gap:5px;overflow-x:auto;margin-bottom:8px}.kt-admin-tabs button{flex:0 0 auto;height:34px;padding:0 10px;border-radius:10px;border:1px solid #ffffff22;background:#15151c;color:#fff;font-weight:900}.kt-admin-tabs button.on{border-color:#ffd35a;color:#ffd35a}.kt-admin-table-wrap{overflow:auto;max-height:58vh;border:1px solid #ffffff1c;border-radius:12px}.kt-admin-table{width:100%;border-collapse:collapse;min-width:620px;font-size:11px}.kt-admin-table th,.kt-admin-table td{padding:7px 8px;border-bottom:1px solid #ffffff12;border-right:1px solid #ffffff10;text-align:left;white-space:nowrap}.kt-admin-table th{position:sticky;top:0;background:#17171e;color:#ffe071;z-index:2}.kt-admin-note{margin-top:8px;color:#aaa;font-size:10px;line-height:1.45}';
    document.head.appendChild(s);
  }
  var data={members:[],rooms:[],events:[],cashouts:[],match:[],ranking:[]};

  async function load(){
    var out=await Promise.allSettled([
      get('ktalk_profiles?select=account_key,nickname,updated_at&order=updated_at.desc&limit=5000'),
      get('ktalk_live_rooms?select=id,host_id,host_name,room_name,active,started_at,updated_at&order=started_at.desc&limit=500')
    ]);
    data.members=out[0].status==='fulfilled'?out[0].value:[];
    data.rooms=out[1].status==='fulfilled'?out[1].value:[];
    data.cashouts=[{
      amount:num(local('ktalk_cashout_request_amount','0')),
      requested_at:local('ktalk_cashout_request_at',''),
      status:local('ktalk_cashout_request_amount','')?'관리자 확인 대기':'신청 없음'
    }];
    data.ranking=[{
      rank:num(local('ktalk_daily_rank','0')),
      name:'현재 기기 계정',
      type:'일일 랭킹'
    }];
    data.match=[{
      wins:num(local('ktalk_match_wins','0')),
      losses:num(local('ktalk_match_losses','0')),
      weekly:'주간 집계'
    }];
    data.events=[
      {name:'오늘의 운세',value:local('ktalk_daily_fortune_ladder_roses:default','0'),status:'기기 저장 기준'},
      {name:'7일 방송 보상',value:'50 코인',status:'환전 불가'},
      {name:'주간 매치',value:'1위100·2위70·3위50·4위30·5위20·6위10·7위5·8위3',status:'일요일 마감'}
    ];
  }

  function summary(){
    var today=new Date().toISOString().slice(0,10);
    var todayMembers=data.members.filter(function(x){return String(x.updated_at||'').slice(0,10)===today;}).length;
    var activeRooms=data.rooms.filter(function(x){return x.active===true;}).length;
    return '<div class="kt-admin-summary">'
      +'<div><b>총 가입자</b><strong>'+data.members.length+'명</strong></div>'
      +'<div><b>오늘 가입/갱신</b><strong>'+todayMembers+'명</strong></div>'
      +'<div><b>현재 방송</b><strong>'+activeRooms+'개</strong></div>'
      +'<div><b>환전 대기</b><strong>'+(data.cashouts[0]&&data.cashouts[0].amount?1:0)+'건</strong></div>'
      +'</div>';
  }
  function tableHead(cols){return '<table class="kt-admin-table"><thead><tr>'+cols.map(function(x){return '<th>'+x+'</th>';}).join('')+'</tr></thead><tbody>';}
  function memberTable(){
    var s=tableHead(['번호','닉네임','계정키','최근 갱신']);
    data.members.forEach(function(x,i){s+='<tr><td>'+(i+1)+'</td><td>'+esc(x.nickname||'')+'</td><td>'+esc(x.account_key||'')+'</td><td>'+esc(x.updated_at||'')+'</td></tr>';});
    return s+'</tbody></table>';
  }
  function rankingTable(){
    var s=tableHead(['구분','현재 순위','회원','상태']);
    data.ranking.forEach(function(x){s+='<tr><td>'+esc(x.type)+'</td><td>'+x.rank+'위</td><td>'+esc(x.name)+'</td><td>표시 중</td></tr>';});
    return s+'</tbody></table>';
  }
  function matchTable(){
    var s=tableHead(['승','패','주간 기준','보상']);
    data.match.forEach(function(x){s+='<tr><td>'+x.wins+'</td><td>'+x.losses+'</td><td>'+esc(x.weekly)+'</td><td>1위100 / 2위70 / 3위50 / 4위30 / 5위20 / 6위10 / 7위5 / 8위3</td></tr>';});
    return s+'</tbody></table>';
  }
  function eventTable(){
    var s=tableHead(['이벤트','내용','상태']);
    data.events.forEach(function(x){s+='<tr><td>'+esc(x.name)+'</td><td>'+esc(x.value)+'</td><td>'+esc(x.status)+'</td></tr>';});
    return s+'</tbody></table>';
  }
  function cashoutTable(){
    var s=tableHead(['신청 금액','신청 시각','상태']);
    data.cashouts.forEach(function(x){s+='<tr><td>'+Number(x.amount||0).toLocaleString('ko-KR')+'원</td><td>'+esc(x.requested_at||'-')+'</td><td>'+esc(x.status)+'</td></tr>';});
    return s+'</tbody></table>';
  }
  function broadcastTable(){
    var s=tableHead(['호스트','방','상태','시작','최근 갱신']);
    data.rooms.forEach(function(x){s+='<tr><td>'+esc(x.host_name||x.host_id||'')+'</td><td>'+esc(x.room_name||'')+'</td><td>'+(x.active?'방송중':'종료')+'</td><td>'+esc(x.started_at||'')+'</td><td>'+esc(x.updated_at||'')+'</td></tr>';});
    return s+'</tbody></table>';
  }

  window.ktAdminOverviewTab20260928=function(tab,btn){
    document.querySelectorAll('.kt-admin-tabs button').forEach(function(b){b.classList.remove('on');});
    if(btn)btn.classList.add('on');
    var box=document.getElementById('ktAdminOverviewTable20260928');if(!box)return;
    var html=tab==='members'?memberTable():tab==='ranking'?rankingTable():tab==='match'?matchTable():tab==='events'?eventTable():tab==='cashout'?cashoutTable():broadcastTable();
    box.innerHTML=html;
  };

  window.ktOpenTotalAdminOverview20260928=async function(){
    if(!owner())return false;
    style();
    if(typeof window.showSheet!=='function')return false;
    window.showSheet('📊 총관리 · 전체 관리 현황','<div class="rowbox">데이터 불러오는 중...</div>');
    try{await load();}catch(e){}
    var html='<div class="kt-admin-overview">'+summary()
      +'<div class="kt-admin-tabs">'
      +'<button class="on" onclick="ktAdminOverviewTab20260928(\'members\',this)">회원</button>'
      +'<button onclick="ktAdminOverviewTab20260928(\'ranking\',this)">랭킹</button>'
      +'<button onclick="ktAdminOverviewTab20260928(\'match\',this)">매치</button>'
      +'<button onclick="ktAdminOverviewTab20260928(\'events\',this)">이벤트</button>'
      +'<button onclick="ktAdminOverviewTab20260928(\'cashout\',this)">환전</button>'
      +'<button onclick="ktAdminOverviewTab20260928(\'broadcast\',this)">방송</button>'
      +'</div><div id="ktAdminOverviewTable20260928" class="kt-admin-table-wrap">'+memberTable()+'</div>'
      +'<div class="kt-admin-note">총 가입자·방송 현황은 서버 데이터 기준입니다. 랭킹·매치·일부 이벤트·환전은 현재 저장 구조가 기기 저장 방식인 항목이 있어, 서버 집계가 연결되기 전까지 해당 기기 기준으로 표시될 수 있습니다.</div>'
      +'</div>';
    window.showSheet('📊 총관리 · 전체 관리 현황',html);
    return false;
  };
})();