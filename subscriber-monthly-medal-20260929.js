/* K-Talk 월 구독자 메달 표시
   14,900원 = 은메달 🥈
   19,900원 = 금메달 🥇
   닉네임 옆에 항상 표시
*/
(function(){
  if(window.__ktSubscriberMonthlyMedal20260929)return;
  window.__ktSubscriberMonthlyMedal20260929=true;

  function tier(){
    var vals=[];
    try{
      var s=window.state||{};
      vals=[s.memberType,s.membership,s.plan,s.subscription,s.subscriptionPlan,s.subscriber,s.vip,s.memberGrade,s.grade,s.memberClass];
      ['ktalk_member_type','ktalk_membership','ktalk_plan','ktalk_subscription','ktalk_subscription_plan',
       'ktalk_subscriber','ktalk_member_grade','ktalk_grade','ktalk_member_class']
      .forEach(function(k){vals.push(localStorage.getItem(k));});
    }catch(e){}
    var norm=vals.map(function(v){return String(v==null?'':v).replace(/\s+/g,'').toLowerCase();});
    if(norm.some(function(x){
      return x==='19900'||x==='19,900'||x==='vip'||x==='subscriber19900'||x==='구독자19900'||x==='subscriber'||x==='구독자';
    }))return 19900;
    if(norm.some(function(x){
      return x==='14900'||x==='14,900'||x==='중회원'||x==='middle'||x==='mid'||x==='subscriber14900'||x==='구독자14900';
    }))return 14900;
    return 0;
  }
  function medal(){
    var t=tier();
    return t===19900?'🥇':(t===14900?'🥈':'');
  }
  function rawName(){
    var n='';
    try{
      if(typeof window.ktProfileLoad==='function'){
        var p=window.ktProfileLoad()||{};
        n=String(p.name||p.nickname||p.displayName||'');
      }
    }catch(e){}
    if(!n){
      try{n=String(localStorage.getItem('ktalk_nickname')||localStorage.getItem('ktalk_profile_name')||'');}catch(e){}
    }
    return n.replace(/\s*[🥈🥇]\s*$/u,'').trim();
  }
  function ensureStyle(){
    if(document.getElementById('ktSubMedalStyle20260929'))return;
    var s=document.createElement('style');
    s.id='ktSubMedalStyle20260929';
    s.textContent=''
      +'.kt-sub-medal-20260929{display:inline-block!important;margin-left:4px!important;vertical-align:middle!important;font-size:.95em!important;line-height:1!important;filter:drop-shadow(0 1px 2px rgba(0,0,0,.45))!important}'
      +'.kt-sub-medal-benefit-20260929{margin-top:8px!important}';
    document.head.appendChild(s);
  }
  function decorate(){
    ensureStyle();
    var m=medal(),name=rawName();
    if(!m||!name||name==='K-Talk')return;
    var selectors=[
      '.kt-profile-maininfo b','#ktProfileNameFixed',
      '.host-meta b','.kt-host-name','.kt-guest-name','.ktsecret-guest-name',
      '.kgh-name','.ktg13-name','.ktg9-name','.ktsubscriber-name',
      '.kt-live-list-info b','.kt-live-card strong','.kt-remote-meta b',
      '[data-kt-nickname]','[data-nickname]'
    ].join(',');
    document.querySelectorAll(selectors).forEach(function(el){
      try{
        if(el.querySelector&&el.querySelector('.kt-sub-medal-20260929'))return;
        var txt=String(el.textContent||'').replace(/[🥈🥇]/g,'').trim();
        if(txt.indexOf(name)<0)return;
        var sp=document.createElement('span');
        sp.className='kt-sub-medal-20260929';
        sp.textContent=m;
        sp.title=(m==='🥇'?'19,900원 금메달 구독자':'14,900원 은메달 구독자');
        el.appendChild(sp);
      }catch(e){}
    });
  }

  function patchBenefits(){
    var old=window.openSubscriberBenefits;
    if(typeof old!=='function'||old.__ktMonthlyMedalPatched)return;
    var fn=function(){
      old.apply(this,arguments);
      setTimeout(function(){
        try{
          var body=document.getElementById('sheetBody');
          if(!body||body.querySelector('.kt-sub-medal-benefit-20260929'))return;
          var box=document.createElement('div');
          box.className='rowbox kt-sub-medal-benefit-20260929';
          box.innerHTML='<b>🏅 월 구독자 메달</b><br>'
            +'<strong>14,900원 구독자 = 🥈 은메달</strong><br>'
            +'<strong>19,900원 구독자 = 🥇 금메달</strong><br>'
            +'구독 상태가 유지되는 동안 닉네임 옆에 메달이 항상 표시됩니다.';
          body.appendChild(box);
        }catch(e){}
      },40);
      return false;
    };
    fn.__ktMonthlyMedalPatched=true;
    window.openSubscriberBenefits=fn;
  }

  window.ktRefreshSubscriberMedal20260929=function(){decorate();};
  patchBenefits();decorate();

  var mo=new MutationObserver(function(){decorate();});
  try{mo.observe(document.documentElement,{subtree:true,childList:true});}catch(e){}
  setInterval(function(){patchBenefits();decorate();},1500);
})();