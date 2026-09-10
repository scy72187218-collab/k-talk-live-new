/* K-Talk 혜택 센터: 와이파이는 건드리지 않고 AI 읽어주기 버튼만 추가. */
(function(){
  if(window.__ktBenefitAIReaderInstalled)return;
  window.__ktBenefitAIReaderInstalled=true;

  function stopReading(){
    try{if(window.speechSynthesis)window.speechSynthesis.cancel();}catch(e){}
    var btn=document.getElementById('ktBenefitReadBtn');
    if(btn){btn.textContent='🔊 AI 읽어주기';btn.setAttribute('aria-pressed','false');}
  }

  function readBenefits(){
    var btn=document.getElementById('ktBenefitReadBtn');
    try{
      if(window.speechSynthesis&&window.speechSynthesis.speaking){stopReading();return;}
      var home=document.querySelector('.kt-benefit-home');
      if(!home||!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;
      var text=(home.innerText||'').replace(/AI 읽어주기|읽기 중지/g,' ').replace(/\s+/g,' ').trim();
      if(!text)return;
      window.speechSynthesis.cancel();
      var u=new SpeechSynthesisUtterance(text);
      u.lang='ko-KR';u.rate=.96;u.pitch=1;u.volume=1;
      try{
        var voices=window.speechSynthesis.getVoices?window.speechSynthesis.getVoices():[];
        var ko=voices.find(function(v){return /^ko(-|_)/i.test(v.lang||'');});
        if(ko)u.voice=ko;
      }catch(e){}
      u.onend=stopReading;u.onerror=stopReading;
      if(btn){btn.textContent='■ 읽기 중지';btn.setAttribute('aria-pressed','true');}
      window.speechSynthesis.speak(u);
    }catch(e){stopReading();}
  }

  window.ktReadBenefitCenter=readBenefits;

  function addButton(){
    var home=document.querySelector('.kt-benefit-home');
    if(!home||document.getElementById('ktBenefitReadBtn'))return;
    var row=home.querySelector('.kt-benefit-headrow')||home;
    var btn=document.createElement('button');
    btn.id='ktBenefitReadBtn';
    btn.type='button';
    btn.textContent='🔊 AI 읽어주기';
    btn.setAttribute('aria-pressed','false');
    btn.style.cssText='min-height:34px;padding:7px 11px;border:1px solid rgba(117,228,255,.55);border-radius:12px;background:linear-gradient(135deg,#172033,#0b101c);color:#fff;font-size:11px;font-weight:900;white-space:nowrap;box-shadow:0 0 10px rgba(75,170,255,.24);touch-action:manipulation';
    btn.addEventListener('click',readBenefits);
    row.appendChild(btn);
  }

  var oldOpen=window.openBenefitHub;
  if(typeof oldOpen==='function'){
    window.openBenefitHub=function(){
      stopReading();
      var r=oldOpen.apply(this,arguments);
      setTimeout(addButton,0);
      return r;
    };
  }

  document.addEventListener('click',function(e){
    if(e.target&&e.target.closest&&e.target.closest('#sheet .sheet-head button'))stopReading();
  },true);
})();
