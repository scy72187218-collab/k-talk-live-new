/* K-Talk 보정 전용 보강: AI 자동 보정, 메이크업 스위치, 초기화, 나가기. 다른 기능은 건드리지 않음. */
(function(){
  if(window.__ktBeautyAIActionsInstalled)return;
  window.__ktBeautyAIActionsInstalled=true;

  function clamp(v,d){
    v=parseInt(v,10);
    if(!isFinite(v))v=d;
    return Math.max(1,Math.min(100,v));
  }

  function getMakeupOn(){
    try{
      if(window.state&&typeof state.beautyMakeup==='boolean')return state.beautyMakeup;
      var saved=localStorage.getItem('kt_beauty_makeup');
      if(saved!==null)return saved==='on';
    }catch(e){}
    return false;
  }

  function saveMakeup(on){
    try{if(window.state)state.beautyMakeup=!!on;}catch(e){}
    try{localStorage.setItem('kt_beauty_makeup',on?'on':'off');}catch(e){}
  }

  function applyMakeup(){
    var on=getMakeupOn();
    var extra=on?'saturate(1.055) brightness(1.018) contrast(.992)':'';
    ['camera','cameraBg'].forEach(function(id){
      var el=document.getElementById(id);
      if(!el)return;
      try{
        var prev=el.getAttribute('data-kt-makeup-extra')||'';
        var base=String(el.style.filter||'').trim();
        if(prev)base=base.split(prev).join(' ').replace(/\s+/g,' ').trim();
        el.setAttribute('data-kt-makeup-extra',extra);
        el.style.filter=(base+(base&&extra?' ':'')+extra).trim();
      }catch(e){}
    });
  }

  function updateMakeupButton(){
    var b=document.querySelector('#sheet.beauty-control-sheet .kt-beauty-makeup-switch');
    if(!b)return;
    var on=getMakeupOn();
    b.classList.toggle('on',on);
    b.setAttribute('aria-pressed',on?'true':'false');
    var s=b.querySelector('.kt-makeup-state');
    if(s)s.textContent=on?'ON':'OFF';
  }

  window.ktToggleBeautyMakeup=function(){
    saveMakeup(!getMakeupOn());
    try{if(window.applyBeautyPreview)window.applyBeautyPreview();}catch(e){applyMakeup();}
    applyMakeup();
    updateMakeupButton();
  };

  window.ktBeautyAIAuto=function(){
    try{
      if(window.state){
        state.beautyOn=true;
        state.beautyOverall=82;
        state.beautySkin=92;
        state.beautyWrinkle=78;
        state.beautyBright=73;
        state.beautyTone=61;
        state.beautySharp=50;
        state.beautyFace=52;
        state.beautyEyes=54;
        state.beautyNose=51;
        state.beautyMouth=53;
        state.beautyJaw=50;
        state.beautyControl='overall';
      }
      saveMakeup(true);
      if(window.applyBeautyPreview)window.applyBeautyPreview();
      applyMakeup();
      var label=document.getElementById('beautySingleLabel');
      var range=document.getElementById('beautySingleRange');
      var val=document.getElementById('beautySingleValue');
      if(label)label.textContent='전체 보정';
      if(range)range.value=82;
      if(val)val.textContent='82';
      var btn=document.querySelector('.kt-beauty-ai-auto');
      if(btn){var old=btn.textContent;btn.textContent='✓ 적용됨';setTimeout(function(){if(btn)btn.textContent=old;},900);}
      updateMakeupButton();
    }catch(e){}
  };

  window.ktBeautyResetAndStay=function(){
    try{if(window.resetBeautyAll)window.resetBeautyAll();}catch(e){}
    try{
      if(window.state){
        state.beautyOn=true;
        state.beautyOverall=72;
        state.beautyControl='overall';
      }
    }catch(e){}
    saveMakeup(false);
    try{if(window.ktSetBeautyPhotoLook)window.ktSetBeautyPhotoLook('natural');}catch(e){}
    try{if(window.applyBeautyPreview)window.applyBeautyPreview();}catch(e){}
    applyMakeup();
    var label=document.getElementById('beautySingleLabel');
    var range=document.getElementById('beautySingleRange');
    var val=document.getElementById('beautySingleValue');
    if(label)label.textContent='전체 보정';
    if(range)range.value=72;
    if(val)val.textContent='72';
    updateMakeupButton();
    setTimeout(decorate,0);
  };

  window.ktBeautyExit=function(){
    try{if(window.closeSheet)window.closeSheet();else{var s=document.getElementById('sheet');if(s)s.classList.remove('show');}}catch(e){}
  };

  function decorate(){
    try{
      var sheet=document.getElementById('sheet');
      if(!sheet||!sheet.classList.contains('beauty-control-sheet'))return;
      var pro=sheet.querySelector('.kt-beauty-pro');
      if(!pro)return;

      var oldNone=pro.querySelector('.kt-beauty-none-exit');
      if(oldNone)oldNone.style.setProperty('display','none','important');

      if(!pro.querySelector('.kt-beauty-ai-box')){
        var box=document.createElement('div');
        box.className='kt-beauty-ai-box';
        box.innerHTML=''
          +'<button type="button" class="kt-beauty-ai-auto" onclick="ktBeautyAIAuto()">✨ AI 자동 보정</button>'
          +'<button type="button" class="kt-beauty-makeup-switch" aria-pressed="false" onclick="ktToggleBeautyMakeup()"><span>💄 메이크업</span><b class="kt-makeup-track"><i></i></b><strong class="kt-makeup-state">OFF</strong></button>'
          +'<div class="kt-beauty-bottom-actions"><button type="button" onclick="ktBeautyResetAndStay()">↻ 초기화</button><button type="button" class="exit" onclick="ktBeautyExit()">✓ 나가기</button></div>';
        pro.appendChild(box);
      }
      updateMakeupButton();
    }catch(e){}
  }

  if(!document.getElementById('ktBeautyAIActionsStyle')){
    var st=document.createElement('style');
    st.id='ktBeautyAIActionsStyle';
    st.textContent=''
      +'#sheet.beauty-control-sheet .kt-beauty-ai-box{margin-top:8px!important;padding:8px!important;border-radius:13px!important;background:rgba(12,12,18,.86)!important;border:1px solid rgba(255,255,255,.12)!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-ai-auto{width:100%!important;height:40px!important;border:0!important;border-radius:11px!important;background:linear-gradient(135deg,#7b49ff,#ff48a9)!important;color:#fff!important;font-size:14px!important;font-weight:950!important;touch-action:manipulation!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-makeup-switch{width:100%!important;height:42px!important;margin-top:7px!important;padding:0 10px!important;border:1px solid rgba(255,255,255,.16)!important;border-radius:11px!important;background:rgba(255,255,255,.07)!important;color:#fff!important;display:grid!important;grid-template-columns:1fr 42px 32px!important;align-items:center!important;gap:7px!important;text-align:left!important;font-size:13px!important;font-weight:900!important;touch-action:manipulation!important}'
      +'#sheet.beauty-control-sheet .kt-makeup-track{width:40px!important;height:22px!important;border-radius:999px!important;background:#555!important;padding:2px!important;display:block!important;transition:.16s!important}.kt-makeup-track i{display:block!important;width:18px!important;height:18px!important;border-radius:50%!important;background:#fff!important;transform:translateX(0)!important;transition:.16s!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-makeup-switch.on .kt-makeup-track{background:#ff4aa8!important}.kt-beauty-makeup-switch.on .kt-makeup-track i{transform:translateX(18px)!important}.kt-beauty-makeup-switch .kt-makeup-state{text-align:right!important;font-size:10px!important;color:#bbb!important}.kt-beauty-makeup-switch.on .kt-makeup-state{color:#ff79be!important}'
      +'#sheet.beauty-control-sheet .kt-beauty-bottom-actions{display:grid!important;grid-template-columns:1fr 1fr!important;gap:7px!important;margin-top:7px!important}.kt-beauty-bottom-actions button{height:40px!important;border-radius:11px!important;border:1px solid rgba(255,255,255,.18)!important;background:#2c2c34!important;color:#fff!important;font-size:13px!important;font-weight:900!important;touch-action:manipulation!important}.kt-beauty-bottom-actions .exit{background:#fff!important;color:#111!important}';
    document.head.appendChild(st);
  }

  function installApplyWrapper(){
    if(typeof window.applyBeautyPreview!=='function'||window.applyBeautyPreview.__ktMakeupWrapped)return false;
    var old=window.applyBeautyPreview;
    var wrapped=function(){
      var r=old.apply(this,arguments);
      applyMakeup();
      return r;
    };
    wrapped.__ktMakeupWrapped=true;
    window.applyBeautyPreview=wrapped;
    return true;
  }

  var observer=new MutationObserver(function(){
    installApplyWrapper();
    decorate();
  });
  try{observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['class']});}catch(e){}

  var tries=0;
  var timer=setInterval(function(){
    tries++;
    installApplyWrapper();
    decorate();
    if(tries>120)clearInterval(timer);
  },100);

  setTimeout(function(){installApplyWrapper();applyMakeup();decorate();},0);
})();
