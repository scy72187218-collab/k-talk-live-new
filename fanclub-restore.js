/* K-Talk 팬클럽 화면만 복구: 기존 팬 목록 유지 + 등급/혜택/도구/슈퍼팬/배지/이벤트 표시 */
(function(){
  if(window.__ktFanClubRestoreInstalled)return;
  window.__ktFanClubRestoreInstalled=true;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];});
  }

  function fanData(){
    var fans=[];
    try{
      if(Array.isArray(window.ktFanClubFans))fans=window.ktFanClubFans.slice();
      if(!fans.length){
        var raw=localStorage.getItem('kt_fanclub_fans');
        if(raw){var parsed=JSON.parse(raw);if(Array.isArray(parsed))fans=parsed;}
      }
    }catch(e){}
    var support=0,superfans=0;
    fans.forEach(function(f){
      support+=Number(f.support||f.cheer||0)||0;
      if(String(f.grade||f.level||'').indexOf('슈퍼')>-1||f.superfan===true)superfans++;
    });
    return {fans:fans,support:support,superfans:superfans};
  }

  function ensureStyle(){
    if(document.getElementById('ktFanClubRestoreStyle'))return;
    var s=document.createElement('style');
    s.id='ktFanClubRestoreStyle';
    s.textContent=''
      +'#sheet .ktrfan{color:#fff;padding:2px 0 18px;font-family:system-ui,-apple-system,"Noto Sans KR",sans-serif}'
      +'#sheet .ktrfan-hero{padding:16px;border-radius:22px;background:linear-gradient(135deg,#2b1632,#101b31);border:1px solid #ffffff18;box-shadow:inset 0 0 28px #ffba4720}'
      +'#sheet .ktrfan-top{display:flex;align-items:center;gap:10px}.ktrfan-crown{font-size:35px}.ktrfan-title{min-width:0;flex:1}.ktrfan-title b{display:block;color:#ffd36b;font-size:22px;font-weight:950}.ktrfan-title span{display:block;margin-top:3px;color:#d8d8de;font-size:12px}.ktrfan-help{width:42px;height:42px;border-radius:50%;border:1px solid #ffffff35;background:#1a1b24;color:#fff;font-size:22px;font-weight:900}'
      +'#sheet .ktrfan-stats{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;margin-top:14px;border:1px solid #ffffff15;border-radius:18px;overflow:hidden;background:#ffffff10}.ktrfan-stats div{padding:13px 4px;text-align:center;background:#090a10}.ktrfan-stats b{display:block;font-size:27px}.ktrfan-stats span{display:block;margin-top:3px;color:#d7d7dd;font-size:11px}'
      +'#sheet .ktrfan-grow{width:100%;margin-top:12px;padding:12px 14px;border:0;border-radius:18px;background:linear-gradient(135deg,#ffd24a,#ff9e32);color:#24180b;display:flex;align-items:center;gap:11px;text-align:left}.ktrfan-grow>span{width:48px;height:48px;border-radius:15px;background:#ffffff66;display:grid;place-items:center;font-size:28px}.ktrfan-grow div{flex:1}.ktrfan-grow b{display:block;font-size:17px;font-weight:950}.ktrfan-grow small{display:block;margin-top:3px;font-size:11px;font-weight:750}.ktrfan-grow em{font-style:normal;font-size:28px}'
      +'#sheet .ktrfan-summary{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px}.ktrfan-summary div{padding:10px 11px;border-radius:14px;background:#0c0d14;border:1px solid #ffffff15}.ktrfan-summary b{display:block;color:#ffd870;font-size:12px}.ktrfan-summary span{display:block;margin-top:4px;font-size:11px;color:#eee;line-height:1.4}'
      +'#sheet .ktrfan-tabs{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:13px 0 9px}.ktrfan-tabs button{height:44px;border:0;border-radius:14px;background:#171820;color:#bfc0c9;font-size:15px;font-weight:900}.ktrfan-tabs button.on{color:#fff;background:#24252f;box-shadow:inset 0 -3px #ffd45c}'
      +'#sheet .ktrfan-list{min-height:170px}.ktrfan-empty{min-height:170px;border:1px dashed #ffffff26;border-radius:18px;display:grid;place-items:center;text-align:center;padding:22px;background:#0a0b11}.ktrfan-empty span{font-size:42px}.ktrfan-empty b{font-size:16px}.ktrfan-empty small{color:#a9aab2;font-size:12px}.ktrfan-person{display:grid;grid-template-columns:44px 1fr auto;gap:10px;align-items:center;padding:10px;border-radius:15px;background:#0d0e15;border:1px solid #ffffff15;margin-bottom:7px}.ktrfan-avatar{width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:#2a2231;font-size:24px}.ktrfan-person b{display:block}.ktrfan-person small{display:block;color:#aaa;margin-top:2px}.ktrfan-badge{padding:5px 8px;border-radius:999px;background:#3a2d0d;color:#ffd86a;font-size:10px;font-weight:900}'
      +'#sheet .ktrfan-tools{display:grid;grid-template-columns:1fr 1fr;gap:8px}.ktrfan-tool{min-height:104px;padding:12px;border:1px solid #ffffff18;border-radius:16px;background:linear-gradient(155deg,#171723,#0b0c13);color:#fff;text-align:left}.ktrfan-tool>span{display:block;font-size:27px}.ktrfan-tool b{display:block;margin-top:6px;font-size:14px}.ktrfan-tool small{display:block;margin-top:3px;color:#bbb;font-size:10px;line-height:1.35}'
      +'#sheet .ktrfan-benefits{margin-top:10px;padding:12px;border-radius:17px;background:linear-gradient(135deg,#28153b,#10213a);border:1px solid #b979ff44}.ktrfan-benefits h4{margin:0 0 9px;color:#ffe171;font-size:14px}.ktrfan-benefit{display:grid;grid-template-columns:26px 1fr;gap:8px;align-items:start;padding:7px 0;border-top:1px solid #ffffff12}.ktrfan-benefit:first-of-type{border-top:0}.ktrfan-benefit span{font-size:20px}.ktrfan-benefit b{display:block;font-size:12px}.ktrfan-benefit small{display:block;color:#bbb;font-size:10px;line-height:1.45;margin-top:2px}'
      +'#sheet .ktrfan-levels{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.ktrfan-level{padding:12px 6px;border-radius:15px;text-align:center;background:#101119;border:1px solid #ffffff17}.ktrfan-level span{display:block;font-size:28px}.ktrfan-level b{display:block;margin-top:5px;font-size:12px}.ktrfan-level small{display:block;margin-top:3px;color:#aaa;font-size:9px;line-height:1.3}'
      +'#sheet .ktrfan-note{margin-top:10px;padding:10px;border-radius:13px;background:#ffffff0c;color:#cfcfd5;font-size:10px;line-height:1.5}'
      +'@media(max-width:390px){#sheet .ktrfan-tools{grid-template-columns:1fr 1fr}.ktrfan-title b{font-size:20px!important}.ktrfan-summary{grid-template-columns:1fr!important}}';
    document.head.appendChild(s);
  }

  function listHtml(){
    var d=fanData();
    if(!d.fans.length)return '<div class="ktrfan-empty"><span>💛</span><b>아직 등록된 팬이 없습니다</b><small>팬이 참여하면 여기에 표시됩니다.</small></div>';
    return d.fans.map(function(f,i){
      var name=esc(f.name||f.nickname||('팬 '+(i+1)));
      var grade=esc(f.grade||f.level||'팬');
      var avatar=esc(f.emoji||'💛');
      return '<div class="ktrfan-person"><div class="ktrfan-avatar">'+avatar+'</div><div><b>'+name+'</b><small>응원 '+(Number(f.support||f.cheer||0)||0)+' · 팬 활동</small></div><span class="ktrfan-badge">'+grade+'</span></div>';
    }).join('');
  }

  function toolHtml(){
    return '<div class="ktrfan-tools">'
      +'<button class="ktrfan-tool" onclick="ktFanClubToolInfo(\'join\')"><span>💛</span><b>팬 가입 안내</b><small>내 방송 팬이 되는 방법과 팬 표시</small></button>'
      +'<button class="ktrfan-tool" onclick="ktFanClubToolInfo(\'grade\')"><span>🏅</span><b>팬 등급 · 레벨</b><small>팬 → 열성팬 → 슈퍼팬 성장</small></button>'
      +'<button class="ktrfan-tool" onclick="ktFanClubToolInfo(\'badge\')"><span>👑</span><b>팬 전용 배지</b><small>등급에 맞는 팬 표시와 특별 배지</small></button>'
      +'<button class="ktrfan-tool" onclick="ktFanClubToolInfo(\'gift\')"><span>🎁</span><b>팬 전용 선물</b><small>팬 선물 · 구독자 할인 혜택 확인</small></button>'
      +'<button class="ktrfan-tool" onclick="ktFanClubToolInfo(\'chat\')"><span>💬</span><b>팬 전용 채팅</b><small>팬끼리 참여하는 특별 채팅 기능</small></button>'
      +'<button class="ktrfan-tool" onclick="ktFanClubToolInfo(\'event\')"><span>🎉</span><b>팬 이벤트</b><small>팬 전용 이벤트와 참여 보상</small></button>'
      +'<button class="ktrfan-tool" onclick="ktFanClubToolInfo(\'super\')"><span>⭐</span><b>슈퍼팬</b><small>오랫동안 응원한 팬을 따로 표시</small></button>'
      +'<button class="ktrfan-tool" onclick="ktFanClubToolInfo(\'host\')"><span>📣</span><b>호스트 팬 관리</b><small>팬 현황과 팬클럽 운영 기능</small></button>'
      +'</div>'
      +'<div class="ktrfan-benefits"><h4>팬클럽 전용 혜택</h4>'
        +'<div class="ktrfan-benefit"><span>🎁</span><div><b>선물 · 할인</b><small>팬 전용 선물과 구독자 할인 혜택을 한곳에서 확인합니다.</small></div></div>'
        +'<div class="ktrfan-benefit"><span>💬</span><div><b>전용 채팅</b><small>팬 전용 채팅과 특별 소통 기능을 이용합니다.</small></div></div>'
        +'<div class="ktrfan-benefit"><span>🎉</span><div><b>이벤트 · 보상</b><small>팬클럽 이벤트와 활동 보상을 확인합니다.</small></div></div>'
        +'<div class="ktrfan-benefit"><span>👑</span><div><b>등급 · 배지</b><small>활동이 쌓이면 팬 레벨이 올라가고 슈퍼팬과 전용 배지가 표시됩니다.</small></div></div>'
      +'</div>';
  }

  window.ktFanClubTab=function(tab){
    var list=document.getElementById('ktrfanList');
    var all=document.getElementById('ktrfanTabAll');
    var tools=document.getElementById('ktrfanTabTools');
    if(!list)return;
    var isTools=tab==='tools';
    if(all)all.classList.toggle('on',!isTools);
    if(tools)tools.classList.toggle('on',isTools);
    list.innerHTML=isTools?toolHtml():listHtml();
  };

  window.ktFanClubToolInfo=function(kind){
    var map={
      join:['💛 팬 가입 안내','방송에 참여하고 응원한 팬을 팬클럽에 등록해 팬 목록에서 확인할 수 있습니다.'],
      grade:['🏅 팬 등급 · 레벨','팬 활동이 쌓이면 팬 → 열성팬 → 슈퍼팬 순으로 성장하도록 관리합니다.'],
      badge:['👑 팬 전용 배지','팬 등급에 맞는 전용 배지를 표시해 방송과 팬클럽에서 쉽게 알아볼 수 있게 합니다.'],
      gift:['🎁 팬 전용 선물 · 할인','팬 전용 선물과 구독자 할인 등 팬에게 제공되는 혜택을 확인하는 공간입니다.'],
      chat:['💬 팬 전용 채팅','팬클럽 구성원끼리 특별 채팅과 소통 기능을 이용하는 공간입니다.'],
      event:['🎉 팬 이벤트','팬 전용 이벤트, 참여 보상, 특별 혜택을 확인하는 공간입니다.'],
      super:['⭐ 슈퍼팬','오랫동안 방송을 응원하고 활동한 팬을 슈퍼팬으로 따로 표시합니다.'],
      host:['📣 호스트 팬 관리','호스트가 팬 현황, 등급, 슈퍼팬, 팬 혜택을 한곳에서 확인하는 관리 공간입니다.']
    };
    var v=map[kind]||map.host;
    if(window.showSheet)showSheet(v[0],'<div class="rowbox"><b>'+v[0]+'</b><br>'+v[1]+'</div><button class="act" onclick="openSubs()">← 팬클럽으로 돌아가기</button>');
  };

  window.openFanGrow=function(){
    ensureStyle();
    var html='<div class="ktrfan">'
      +'<div class="ktrfan-levels">'
        +'<div class="ktrfan-level"><span>💛</span><b>팬</b><small>방송 참여 · 기본 응원</small></div>'
        +'<div class="ktrfan-level"><span>🔥</span><b>열성팬</b><small>꾸준한 참여 · 선물 · 응원</small></div>'
        +'<div class="ktrfan-level"><span>⭐</span><b>슈퍼팬</b><small>장기 응원 · 높은 팬 활동</small></div>'
      +'</div>'
      +'<div class="ktrfan-benefits"><h4>팬 레벨을 올리는 활동</h4>'
        +'<div class="ktrfan-benefit"><span>📺</span><div><b>방송 참여</b><small>방송에 꾸준히 참여하면 팬 활동이 쌓입니다.</small></div></div>'
        +'<div class="ktrfan-benefit"><span>💛</span><div><b>응원 · 좋아요</b><small>호스트를 응원하고 소통하면 팬 활동에 반영됩니다.</small></div></div>'
        +'<div class="ktrfan-benefit"><span>🎁</span><div><b>선물 활동</b><small>선물과 팬 활동을 통해 팬클럽 성장에 참여할 수 있습니다.</small></div></div>'
        +'<div class="ktrfan-benefit"><span>👑</span><div><b>등급 혜택</b><small>등급이 올라가면 전용 배지·채팅·이벤트 등 팬 혜택을 확인할 수 있습니다.</small></div></div>'
      +'</div>'
      +'<button class="act" onclick="openSubs()">← 팬클럽으로 돌아가기</button>'
      +'</div>';
    if(window.showSheet)showSheet('🌱 팬클럽 성장하기',html);
  };

  window.openFanHelp=function(){
    ensureStyle();
    var html='<div class="ktrfan"><div class="ktrfan-benefits"><h4>K-Talk 팬클럽 안내</h4>'
      +'<div class="ktrfan-benefit"><span>💛</span><div><b>팬 가입</b><small>방송을 응원하는 팬을 등록하고 팬 목록에서 확인합니다.</small></div></div>'
      +'<div class="ktrfan-benefit"><span>🏅</span><div><b>팬 등급</b><small>팬 · 열성팬 · 슈퍼팬 단계와 팬 레벨을 확인합니다.</small></div></div>'
      +'<div class="ktrfan-benefit"><span>🎁</span><div><b>팬 혜택</b><small>팬 전용 선물·할인·채팅·이벤트·배지를 확인합니다.</small></div></div>'
      +'<div class="ktrfan-benefit"><span>⭐</span><div><b>슈퍼팬</b><small>오랫동안 응원한 팬은 슈퍼팬으로 따로 관리할 수 있습니다.</small></div></div>'
      +'</div><button class="act" onclick="openSubs()">← 팬클럽으로 돌아가기</button></div>';
    if(window.showSheet)showSheet('팬클럽 안내',html);
  };

  window.openSubs=function(){
    ensureStyle();
    var d=fanData();
    var html='<div class="ktrfan">'
      +'<div class="ktrfan-hero">'
        +'<div class="ktrfan-top"><span class="ktrfan-crown">👑</span><div class="ktrfan-title"><b>K-Talk 팬클럽</b><span>내 방송을 응원하는 팬 모임</span></div><button class="ktrfan-help" onclick="openFanHelp()">?</button></div>'
        +'<div class="ktrfan-stats"><div><b>'+d.fans.length+'</b><span>팬</span></div><div><b>'+d.support+'</b><span>응원</span></div><div><b>'+d.superfans+'</b><span>슈퍼팬</span></div></div>'
        +'<button class="ktrfan-grow" onclick="openFanGrow()"><span>🌱</span><div><b>팬클럽 성장하기</b><small>방송 참여와 선물로 팬클럽을 키워보세요</small></div><em>›</em></button>'
        +'<div class="ktrfan-summary"><div><b>팬 등급</b><span>팬 → 열성팬 → 슈퍼팬</span></div><div><b>팬 전용 혜택</b><span>선물 · 할인 · 채팅 · 이벤트 · 배지</span></div></div>'
      +'</div>'
      +'<div class="ktrfan-tabs"><button id="ktrfanTabAll" class="on" onclick="ktFanClubTab(\'all\')">모든 팬</button><button id="ktrfanTabTools" onclick="ktFanClubTab(\'tools\')">팬클럽 도구</button></div>'
      +'<div id="ktrfanList" class="ktrfan-list">'+listHtml()+'</div>'
      +'</div>';
    if(window.showSheet)showSheet('팬클럽',html);
  };
})();
