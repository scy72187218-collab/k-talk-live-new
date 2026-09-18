/* K-Talk 레벨 시스템: 장미 누적 5,000개마다 1레벨, 레벨 20부터 13명방 개설 허용. 기존 구독/VIP/출석 혜택은 건드리지 않음. */
(function(){
  if(window.__ktLevelSystem20260915)return;
  window.__ktLevelSystem20260915=true;

  var STEP=5000;
  var UNLOCK_13_LEVEL=20;
  var STORE='ktalk_level_rose_total';

  function n(v){
    v=parseInt(String(v==null?0:v).replace(/[^0-9]/g,''),10);
    return isFinite(v)&&v>0?v:0;
  }
  function fmt(v){return n(v).toLocaleString('ko-KR');}
  function getTotal(){
    try{return n(localStorage.getItem(STORE));}catch(e){return 0;}
  }
  function setTotal(v){
    v=n(v);
    try{localStorage.setItem(STORE,String(v));}catch(e){}
    return v;
  }
  function getLevelFromTotal(total){return Math.floor(n(total)/STEP);}
  function getLevel(){return getLevelFromTotal(getTotal());}
  function nextNeed(level){return Math.max(0,(level+1)*STEP-getTotal());}
  function badge(level){
    if(level>=21)return {name:'👑 크라운',color:'#ffd84a',edge:'#ffb300'};
    if(level>=15)return {name:'💎 다이아',color:'#9fe8ff',edge:'#45cfff'};
    if(level>=10)return {name:'🥇 골드',color:'#ffe27a',edge:'#ffba24'};
    if(level>=5)return {name:'🥈 실버',color:'#e6ebf4',edge:'#9ba8bd'};
    if(level>=1)return {name:'🥉 브론즈',color:'#ffbd8a',edge:'#c97842'};
    return {name:'🌱 시작 전',color:'#b8ffcf',edge:'#4cd67b'};
  }
  function benefitText(level){
    if(level>=20)return '13명 방송 · 비밀방 사용 가능 · 기존 구독/VIP/출석 혜택 유지';
    if(level>=15)return '일반 방송 이용 · 다이아 레벨 배지 · 기존 구독/VIP/출석 혜택 유지';
    if(level>=10)return '일반 방송 이용 · 골드 레벨 배지 · 기존 구독/VIP/출석 혜택 유지';
    if(level>=5)return '일반 방송 이용 · 실버 레벨 배지 · 기존 구독/VIP/출석 혜택 유지';
    if(level>=1)return '일반 방송 이용 · 브론즈 레벨 배지 · 기존 구독/VIP/출석 혜택 유지';
    return '장미 누적 5,000개부터 레벨 1 시작 · 기존 회원 혜택은 그대로 유지';
  }

  window.ktLevelGetTotal=getTotal;
  window.ktLevelGetLevel=getLevel;
  window.ktLevelInfo=function(){
    var total=getTotal();
    var level=getLevelFromTotal(total);
    return {
      total:total,
      level:level,
      nextLevel:level+1,
      nextThreshold:(level+1)*STEP,
      need:Math.max(0,(level+1)*STEP-total),
      canOpen13:level>=UNLOCK_13_LEVEL,
      unlock13At:UNLOCK_13_LEVEL*STEP,
      badge:badge(level),
      benefit:benefitText(level)
    };
  };

  function levelUpNotice(oldLevel,newLevel){
    if(newLevel<=oldLevel)return;
    var msg='레벨 '+newLevel+' 달성!';
    if(newLevel===20)msg+=' 13명 방송과 비밀방 사용이 열렸습니다.';
    else msg+=' 다음 레벨까지 장미 '+fmt(STEP)+'개입니다.';
    try{if(typeof window.ktSpeak==='function')window.ktSpeak(msg);}catch(e){}
    try{
      var toast=document.createElement('div');
      toast.textContent='🌹 '+msg;
      toast.style.cssText='position:fixed;left:50%;top:18%;transform:translateX(-50%);z-index:999999;max-width:88vw;padding:12px 17px;border:1px solid #ff64c8;border-radius:999px;background:rgba(8,8,14,.96);color:#fff;font-weight:950;font-size:14px;box-shadow:0 0 18px rgba(255,65,188,.45);text-align:center';
      document.body.appendChild(toast);
      setTimeout(function(){if(toast&&toast.parentNode)toast.remove();},2600);
    }catch(e){}
  }

  window.ktLevelAddRoses=function(count){
    count=n(count);
    if(!count)return getTotal();
    var before=getTotal();
    var oldLevel=getLevelFromTotal(before);
    var total=setTotal(before+count);
    var newLevel=getLevelFromTotal(total);
    levelUpNotice(oldLevel,newLevel);
    return total;
  };

  function installGiftCounter(){
    if(typeof window.giftSend!=='function'||window.giftSend.__ktLevelWrapped)return;
    var original=window.giftSend;
    var wrapped=function(name,cost,sender){
      var result=original.apply(this,arguments);
      if(result!==false){
        var amount=n(cost);
        if(amount>0)window.ktLevelAddRoses(amount);
      }
      return result;
    };
    wrapped.__ktLevelWrapped=true;
    wrapped.__ktLevelOriginal=original;
    window.giftSend=wrapped;
  }

  function is13Type(type,name,max){
    var t=String(type||'').toLowerCase();
    var nm=String(name||'');
    return t==='group13'||t==='group'||max===13||/13\s*명/.test(nm);
  }
  function deny13(){
    var info=window.ktLevelInfo();
    var need=Math.max(0,UNLOCK_13_LEVEL*STEP-info.total);
    var msg='13명 방송은 레벨 20부터 열 수 있습니다. 현재 레벨 '+info.level+' · 장미 '+fmt(info.total)+'개 · '+fmt(need)+'개 더 필요합니다.';
    try{if(typeof window.ktSpeak==='function')window.ktSpeak(msg);}catch(e){}
    try{alert(msg);}catch(e){}
    return false;
  }
  /* 레벨 20부터 13명방 개설. 관리자 계정은 기존 1000레벨 우회 유지. */
  window.ktLevelCanOpen13=function(){
    try{if(typeof window.ktIsOwnerLevelExempt==='function'&&window.ktIsOwnerLevelExempt())return true;}catch(e){}
    return getLevel()>=UNLOCK_13_LEVEL;
  };

  function installRoomGate(){
    if(typeof window.selectPrepRoom==='function'&&!window.selectPrepRoom.__ktLevelGate){
      var originalSelect=window.selectPrepRoom;
      var wrappedSelect=function(btn,type,name,max){
        if(is13Type(type,name,max)&&!window.ktLevelCanOpen13())return deny13();
        return originalSelect.apply(this,arguments);
      };
      wrappedSelect.__ktLevelGate=true;
      window.selectPrepRoom=wrappedSelect;
    }
    if(typeof window.startBroadcast==='function'&&!window.startBroadcast.__ktLevelGate){
      var originalStart=window.startBroadcast;
      var wrappedStart=function(){
        try{
          var s=window.state||{};
          var type=s.liveRoomType||s.prepRoomType||s.roomType||'';
          var name=s.liveRoomName||s.prepRoomName||'';
          var max=s.liveRoomMax||s.prepRoomMax||0;
          if(is13Type(type,name,max)&&!window.ktLevelCanOpen13())return deny13();
        }catch(e){}
        return originalStart.apply(this,arguments);
      };
      wrappedStart.__ktLevelGate=true;
      window.startBroadcast=wrappedStart;
    }
  }

  document.addEventListener('click',function(e){
    var el=e.target&&e.target.closest?e.target.closest('.live-prep .room-switch,.kt-creator-room-shortcuts button'):null;
    if(!el)return;
    var text=String(el.textContent||'').replace(/\s+/g,'');
    if(text.indexOf('13명')<0||window.ktLevelCanOpen13())return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation)e.stopImmediatePropagation();
    deny13();
  },true);

  function levelCard(){
    var info=window.ktLevelInfo();
    var b=info.badge;
    var progress=info.level>=UNLOCK_13_LEVEL?100:Math.max(0,Math.min(100,(info.total%STEP)/STEP*100));
    var next=info.level>=UNLOCK_13_LEVEL?'13명 방송 개설 가능':'다음 레벨까지 '+fmt(info.need)+'개';
    return '<div class="kt-level-card" style="margin:10px 0;padding:13px;border:1px solid '+b.edge+';border-radius:16px;background:#0c0c13;color:#fff">'
      +'<div style="display:flex;align-items:center;gap:8px"><b style="font-size:17px;color:'+b.color+'">Lv.'+info.level+' '+b.name+'</b><span style="margin-left:auto;color:#ffd84a;font-size:12px">🌹 '+fmt(info.total)+'개</span></div>'
      +'<div style="height:8px;margin:9px 0 7px;border-radius:999px;background:#ffffff18;overflow:hidden"><i style="display:block;height:100%;width:'+progress+'%;background:linear-gradient(90deg,#ff3ca6,#7b55ff,#45d7ff)"></i></div>'
      +'<div style="font-size:11px;color:#d7d7df;line-height:1.45">'+next+'<br>'+benefitText(info.level)+'</div>'
      +'<button type="button" onclick="openLevelBenefits()" style="width:100%;height:36px;margin-top:9px;border:0;border-radius:10px;background:#ffffff12;color:#fff;font-weight:900">레벨 혜택 보기</button>'
      +'</div>';
  }

  window.openLevelBenefits=function(){
    var info=window.ktLevelInfo();
    var rows='';
    for(var lv=1;lv<=21;lv++){
      var special='일반 방송';
      if(lv===5)special='일반 방송 · 실버 배지';
      if(lv===10)special='일반 방송 · 골드 배지';
      if(lv===15)special='일반 방송 · 다이아 배지';
      if(lv===20)special='13명 방송 · 비밀방 사용 가능';
      if(lv===21)special='13명 방송 · 비밀방 사용 가능 · 크라운 배지';
      rows+='<div style="display:grid;grid-template-columns:52px 92px 1fr;gap:8px;padding:9px 8px;border-bottom:1px solid #ffffff12;align-items:center"><b>Lv.'+lv+'</b><span style="color:#ffd84a">🌹 '+fmt(lv*STEP)+'</span><span style="font-size:11px;color:#ddd">'+special+'</span></div>';
    }
    var html='<div style="padding:4px 0;color:#fff">'
      +'<div class="rowbox"><b>현재 레벨 '+info.level+'</b><br>누적 장미 '+fmt(info.total)+'개<br>레벨은 장미 5,000개마다 1단계 올라갑니다.</div>'
      +'<div class="rowbox"><b>13명 방송</b><br>레벨 20 · 누적 장미 100,000개부터 개설할 수 있습니다.</div>'
      +'<div style="margin-top:8px;border:1px solid #ffffff1e;border-radius:14px;overflow:hidden;background:#0c0c12">'+rows+'</div>'
      +'<div class="rowbox" style="margin-top:10px"><b>기존 혜택</b><br>구독자 · VIP · 출석 · 이벤트 등 기존 혜택은 레벨과 별도로 그대로 적용됩니다.</div>'
      +'</div>';
    if(typeof window.showSheet==='function')window.showSheet('🌹 레벨 · 혜택',html);
    else try{alert('레벨 '+info.level+' · 장미 '+fmt(info.total)+'개');}catch(e){}
  };

  function installProfileCard(){
    if(typeof window.ktProfileRender==='function'&&!window.ktProfileRender.__ktLevelWrapped){
      var original=window.ktProfileRender;
      var wrapped=function(){
        var html=original.apply(this,arguments);
        return levelCard()+html;
      };
      wrapped.__ktLevelWrapped=true;
      window.ktProfileRender=wrapped;
    }
  }

  function install(){
    installGiftCounter();
    installRoomGate();
    installProfileCard();
  }
  install();
  [100,300,700,1500,3000].forEach(function(ms){setTimeout(install,ms);});
})();
