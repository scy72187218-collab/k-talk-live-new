/* K-Talk 프로필용 실제 접속 QR 전용.
   프로필 사진 옆에 작은 원형 QR 버튼만 추가. 다른 방/카메라/채팅은 변경하지 않음. */
(function(){
  if(window.__ktProfileRoundQr20260918)return;
  window.__ktProfileRoundQr20260918=true;

  function siteUrl(){
    try{
      var u=location.origin+location.pathname;
      if(/localhost|127\.0\.0\.1/i.test(u))return 'https://k-talk-live-final.vercel.app';
      return u;
    }catch(e){
      return 'https://k-talk-live-final.vercel.app';
    }
  }

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  function qrUrl(size){
    var url=siteUrl();
    size=size||260;
    return 'https://api.qrserver.com/v1/create-qr-code/?size='+size+'x'+size+'&margin=12&data='+encodeURIComponent(url);
  }

  function ensureStyle(){
    if(document.getElementById('ktProfileRoundQrStyle'))return;
    var s=document.createElement('style');
    s.id='ktProfileRoundQrStyle';
    s.textContent=''
      +'.kt-profile-photo-wrap{position:relative!important}'
      +'.kt-profile-round-qr{position:absolute!important;right:-7px!important;bottom:-5px!important;width:62px!important;height:62px!important;border-radius:50%!important;border:3px solid #ffd24a!important;background:#fff!important;padding:7px!important;box-shadow:0 0 0 2px #171717,0 3px 14px #0009,0 0 16px #ffd24a88!important;overflow:hidden!important;z-index:15!important}'
      +'.kt-profile-round-qr img{display:block!important;width:100%!important;height:100%!important;object-fit:contain!important;background:#fff!important;border-radius:7px!important}'
      +'.kt-profile-qr-sheet{text-align:center;color:#fff}'
      +'.kt-profile-qr-frame{width:250px;height:250px;max-width:78vw;margin:8px auto 12px;padding:14px;border-radius:28px;background:#fff;border:5px solid #ffd24a;box-shadow:0 0 0 3px #171717,0 0 24px #ffd24a55}'
      +'.kt-profile-qr-frame img{display:block;width:100%;height:100%;object-fit:contain;background:#fff}'
      +'.kt-profile-qr-url{padding:9px 10px;border-radius:11px;background:#0c0c12;border:1px solid #ffffff1d;font-size:10px;word-break:break-all;color:#d9eaff}'
      +'.kt-profile-qr-go{width:100%;height:42px;margin-top:9px;border:0;border-radius:12px;background:linear-gradient(135deg,#8a3dff,#ff3e9b);color:#fff;font-weight:950}';
    document.head.appendChild(s);
  }

  window.ktOpenProfileQr=function(){
    ensureStyle();
    var url=siteUrl();
    var safe=esc(url);
    var html='<div class="kt-profile-qr-sheet">'
      +'<b style="font-size:18px">📱 K-Talk 실제 접속 QR</b>'
      +'<div class="kt-profile-qr-frame"><img src="'+qrUrl(320)+'" alt="K-Talk 실제 접속 QR"></div>'
      +'<div class="kt-profile-qr-url">'+safe+'</div>'
      +'<button class="kt-profile-qr-go" type="button" onclick="location.href=\''+url.replace(/'/g,"\\'")+'\'">바로가기</button>'
      +'</div>';
    if(typeof window.showSheet==='function')window.showSheet('▣ 프로필 QR',html);
    return false;
  };

  function install(){
    ensureStyle();
    var wrap=document.querySelector('.kt-my-profile .kt-profile-photo-wrap');
    if(!wrap)return;
    if(wrap.querySelector('.kt-profile-round-qr'))return;
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-profile-round-qr';
    b.setAttribute('aria-label','K-Talk 접속 QR');
    b.innerHTML='<img src="'+qrUrl(120)+'" alt="K-Talk QR">';
    b.onclick=function(e){
      try{e.preventDefault();e.stopPropagation();}catch(x){}
      window.ktOpenProfileQr();
      return false;
    };
    wrap.appendChild(b);
  }

  var mo=new MutationObserver(function(){setTimeout(install,0);});
  mo.observe(document.documentElement,{childList:true,subtree:true});
  document.addEventListener('click',function(){setTimeout(install,30);},true);
  [0,120,350,800,1600].forEach(function(ms){setTimeout(install,ms);});
})();