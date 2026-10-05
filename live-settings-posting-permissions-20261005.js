/* K-Talk live settings posting permissions - 2026-10-05
   Adds settings entries only. Does not change room layout, gifts, chat layout, earnings, media, or signaling. */
(function(){
  if(window.__ktLiveSettingsPosting20261005)return;
  window.__ktLiveSettingsPosting20261005=true;

  var KEYS={
    text:'kt_live_setting_text',
    bank:'kt_live_setting_bank',
    phone:'kt_live_setting_phone',
    gift:'kt_live_setting_gift'
  };

  function level(){
    var vals=[];
    try{
      var s=window.state||{};
      vals.push(s.level,s.userLevel,s.memberLevel,s.hostLevel);
    }catch(e){}
    try{
      ['ktalk_level','ktalk_user_level','ktalk_member_level','ktalk_host_level','level','userLevel','memberLevel','hostLevel']
        .forEach(function(k){var v=localStorage.getItem(k);if(v!=null)vals.push(v);});
    }catch(e){}
    var n=0;
    vals.forEach(function(v){var x=parseInt(v,10);if(isFinite(x)&&x>n)n=x;});
    try{if(typeof window.ktEffectiveLevel==='function')n=Number(window.ktEffectiveLevel(n||1))||n;}catch(e){}
    return n||1;
  }

  function subscriber(){
    try{if(typeof window.ktIsPaidSubscriber==='function'&&window.ktIsPaidSubscriber())return true;}catch(e){}
    try{
      var s=window.state||{};
      if(s.isSubscriber===true||s.subscriber===true||s.vip===true)return true;
    }catch(e){}
    try{
      var v=String(localStorage.getItem('ktalk_subscription')||localStorage.getItem('ktalk_subscriber')||'').toLowerCase();
      if(v==='1'||v==='true'||v==='active'||v==='paid'||v==='vip')return true;
    }catch(e){}
    return false;
  }

  function postingPass3000(){
    try{return localStorage.getItem('kt_live_posting_pass_3000')==='1';}catch(e){return false;}
  }
  function phonePass5000(){
    try{return localStorage.getItem('kt_live_phone_pass_5000')==='1';}catch(e){return false;}
  }
  function bankPass5000(){
    try{return localStorage.getItem('kt_live_bank_pass_5000')==='1';}catch(e){return false;}
  }

  /* Payment/entitlement bridges. Each pass is kept separate. */
  window.ktSetPostingPass3000=function(on){
    try{localStorage.setItem('kt_live_posting_pass_3000',on?'1':'0');}catch(e){}
    return !!on;
  };
  window.ktSetPhonePass5000=function(on){
    try{localStorage.setItem('kt_live_phone_pass_5000',on?'1':'0');}catch(e){}
    return !!on;
  };
  window.ktSetBankPass5000=function(on){
    try{localStorage.setItem('kt_live_bank_pass_5000',on?'1':'0');}catch(e){}
    return !!on;
  };

  function allowed(kind){
    if(subscriber())return true;
    var lv=level();
    if(lv>=31)return true;
    if(kind==='text'||kind==='gift'){
      return lv>=1&&lv<=30&&postingPass3000();
    }
    if(kind==='phone'){
      return lv>=1&&lv<=30&&phonePass5000();
    }
    if(kind==='bank'){
      return lv>=1&&lv<=30&&bankPass5000();
    }
    return false;
  }

  function label(kind){
    return {text:'문구',bank:'계좌번호',phone:'전화번호',gift:'선물 안내'}[kind]||'설정';
  }

  function icon(kind){
    return {text:'📝',bank:'🏦',phone:'📞',gift:'🎁'}[kind]||'⚙';
  }

  function read(kind){
    try{return String(localStorage.getItem(KEYS[kind])||'');}catch(e){return '';}
  }

  function write(kind,v){
    try{localStorage.setItem(KEYS[kind],String(v||''));}catch(e){}
  }

  function denied(kind){
    var lv=level();
    if(lv>=1&&lv<=30){
      if(kind==='text'||kind==='gift'){
        alert(label(kind)+' 올리기는 일반 회원 Lv.1~30은 3,000원 이용권이 필요합니다. 구독자는 이용권 없이 사용할 수 있습니다.');
        return;
      }
      if(kind==='phone'){
        alert('전화번호 올리기는 일반 회원 Lv.1~30은 전화번호 전용 5,000원 이용권이 필요합니다. 구독자는 이용권 없이 사용할 수 있습니다.');
        return;
      }
      if(kind==='bank'){
        alert('계좌번호 올리기는 일반 회원 Lv.1~30은 계좌번호 전용 5,000원 이용권이 필요합니다. 구독자는 이용권 없이 사용할 수 있습니다.');
        return;
      }
    }
    alert(label(kind)+' 올리기를 사용할 수 없습니다.');
  }

  function maskPreview(kind,v){
    v=String(v||'');
    if(!v)return '미등록';
    if(kind==='bank'||kind==='phone'){
      var tail=v.replace(/\D/g,'').slice(-4);
      return '등록됨'+(tail?' · 끝 '+tail:'');
    }
    return v.length>18?v.slice(0,18)+'…':v;
  }

  async function saveAndPost(kind){
    if(!allowed(kind)){denied(kind);return;}
    var old=read(kind);
    var title=label(kind);
    var guide=kind==='text'?'방송에 올릴 문구를 입력하세요.'
      :kind==='gift'?'방송에 올릴 선물 안내 문구를 입력하세요.'
      :kind==='bank'?'계좌번호는 개인정보입니다. 공개가 필요한 경우에만 입력하세요.'
      :'전화번호는 개인정보입니다. 공개가 필요한 경우에만 입력하세요.';
    var v=prompt(guide,old);
    if(v==null)return;
    v=String(v).trim();
    if(!v)return;
    if((kind==='bank'||kind==='phone')&&!confirm(title+'는 방송 중 다른 사람에게 보일 수 있습니다. 정말 올리시겠습니까?'))return;
    write(kind,v);

    var prefix=kind==='text'?'📢 ':kind==='bank'?'🏦 계좌 안내: ':kind==='phone'?'📞 연락처: ':'🎁 선물 안내: ';
    var posted=false;
    try{
      if(typeof window.ktPostHostSettingMessage==='function'){
        posted=await window.ktPostHostSettingMessage(prefix+v);
      }
    }catch(e){}
    if(posted)alert(title+'를 방송에 올렸습니다.');
    else alert(title+'를 저장했습니다. 방송 중에 다시 누르면 바로 올릴 수 있습니다.');
  }

  window.ktLiveSettingPost20261005=function(kind){saveAndPost(String(kind||''));};

  function row(kind,need){
    var ok=allowed(kind),v=read(kind),lv=level(),status='';
    if(subscriber())status='구독자 사용 가능';
    else if(kind==='text'||kind==='gift'){
      if(lv>=31)status='Lv.31+ 사용 가능';
      else status=postingPass3000()?'3,000원 이용권 사용 중':'Lv.1~30 · 3,000원 이용권 필요';
    }else if(kind==='phone'){
      if(lv>=31)status='Lv.31+ 사용 가능';
      else status=phonePass5000()?'전화번호 5,000원 이용권 사용 중':'Lv.1~30 · 전화번호 5,000원 이용권 필요';
    }else if(kind==='bank'){
      if(lv>=31)status='Lv.31+ 사용 가능';
      else status=bankPass5000()?'계좌번호 5,000원 이용권 사용 중':'Lv.1~30 · 계좌번호 5,000원 이용권 필요';
    }else{
      status=ok?'사용 가능':'사용 불가';
    }
    return '<button type="button" class="kt-setting-row kt-posting-setting" onclick="ktLiveSettingPost20261005(\''+kind+'\')">'
      +'<span>'+icon(kind)+'</span><b>'+label(kind)+'</b>'
      +'<em>'+maskPreview(kind,v)+' · '+status+' ›</em></button>';
  }

  function inject(){
    var root=document.querySelector('#sheetBody .kt-live-settings');
    if(!root||root.querySelector('.kt-posting-settings-title'))return;
    var title=document.createElement('div');
    title.className='kt-posting-settings-title';
    title.style.cssText='padding:10px 4px 6px;font-size:11px;font-weight:900;color:#ffd86b';
    title.textContent='방송에 올리기';
    root.appendChild(title);

    var box=document.createElement('div');
    box.innerHTML=
      row('text',20)+
      row('bank',30)+
      row('phone',30)+
      row('gift',20)+
      '<div style="padding:7px 4px 2px;color:#aaa;font-size:9px;line-height:1.45">일반 회원 Lv.1~30: 문구·선물 3,000원 이용권 · 전화번호 5,000원 전용 이용권 · 계좌번호 5,000원 전용 이용권 · 각 이용권은 서로 별도 · Lv.31+: 이용권 없이 사용 · 구독자: 모두 이용권 없이 사용 가능</div>';
    while(box.firstChild)root.appendChild(box.firstChild);
  }

  var old=window.openLiveSettings;
  if(typeof old==='function'&&!old.__ktPostingWrapped20261005){
    var fn=function(){
      var r=old.apply(this,arguments);
      setTimeout(inject,0);
      setTimeout(inject,60);
      return r;
    };
    fn.__ktPostingWrapped20261005=true;
    window.openLiveSettings=fn;
  }

  document.addEventListener('click',function(e){
    var b=e.target&&e.target.closest?e.target.closest('.live-prep .prep-item'):null;
    if(!b)return;
    var t=String(b.textContent||'').replace(/\s+/g,'');
    if(t.indexOf('설정')>-1)setTimeout(inject,30);
  },false);
})();