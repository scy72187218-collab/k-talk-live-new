/* K-Talk: put premium-gift recording access inside More menu only. */
(function(){
  if(window.__ktMoreMenuRecordings20261002)return;
  window.__ktMoreMenuRecordings20261002=true;

  function addRecordingCard(){
    try{
      var body=document.getElementById('sheetBody');
      if(!body||body.querySelector('[data-kt-recordings-more]'))return;
      var grid=body.querySelector('div[style*="grid-template-columns:1fr 1fr"]');
      if(!grid)return;
      var b=document.createElement('button');
      b.type='button';
      b.setAttribute('data-kt-recordings-more','1');
      b.style.cssText='min-height:68px;border-radius:16px;padding:8px 9px;display:flex;align-items:center;gap:8px;text-align:left;color:#fff;background:linear-gradient(145deg,#11121b,#07070d);border:1.3px solid #ff879f;box-shadow:0 0 10px #ff405d66,inset 0 0 16px #ff405d22';
      b.innerHTML='<span style="width:36px;height:36px;flex:0 0 36px;border-radius:50%;display:grid;place-items:center;font-size:20px;background:#111;box-shadow:0 0 12px #ff405d99">🎥</span><span style="min-width:0"><b style="display:block;color:#ff9baa;font-size:13px;line-height:1.05;white-space:nowrap">녹화</b><small style="display:block;color:#c9c9d1;font-size:9px;margin-top:3px;white-space:nowrap">큰 선물 자동 녹화</small></span>';
      b.onclick=function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        if(typeof window.ktOpenPremiumRecordedVideos20261002==='function'){
          window.ktOpenPremiumRecordedVideos20261002();
        }
      };
      grid.appendChild(b);
    }catch(e){}
  }

  function wrap(){
    if(typeof window.openMenu!=='function'||window.openMenu.__ktRecordingsWrapped)return;
    var old=window.openMenu;
    var fn=function(){
      var r=old.apply(this,arguments);
      [0,30,100].forEach(function(ms){setTimeout(addRecordingCard,ms);});
      return r;
    };
    fn.__ktRecordingsWrapped=true;
    window.openMenu=fn;
  }

  wrap();
  [100,300,700,1400].forEach(function(ms){setTimeout(wrap,ms);});
})();