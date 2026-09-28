/* K-Talk 2026-09-28
   승인 게스트: 본인 사진을 눌러 그 칸에서 카메라 ON/OFF.
   모든 방송방: 채팅을 TikTok처럼 더 크게 표시.
   방송/통신/게스트 승인 로직은 변경하지 않음. */
(function(){
  if(window.__ktGuestSelfPhotoBigChat20260928)return;
  window.__ktGuestSelfPhotoBigChat20260928=true;

  function profilePhoto(){
    var p='';
    try{
      if(typeof window.ktProfileLoad==='function'){
        var x=window.ktProfileLoad()||{};
        p=String(x.photo||x.image||x.avatar||'');
      }
    }catch(e){}
    if(!p){
      try{
        p=String(localStorage.getItem('ktalk_profile_photo')||
                 localStorage.getItem('ktalk_profile_image')||
                 localStorage.getItem('ktalk_profile_avatar')||'');
      }catch(e){}
    }
    return p;
  }

  function selfVideo(){
    try{
      return document.querySelector(
        '.kt-guest-hostlike-room .kgh-cell.self video,'+
        '.kt-approved-guest-cell.self video,'+
        '.kt-guest-room-cell.self video,'+
        '.kt-prejoin-room-cell.self video,'+
        '#ktRemoteLiveVideo[data-kt-local-guest-view="1"]'
      );
    }catch(e){return null;}
  }
  function selfCell(){
    try{
      return document.querySelector(
        '.kt-guest-hostlike-room .kgh-cell.self,'+
        '.kt-approved-guest-cell.self,'+
        '.kt-guest-room-cell.self,'+
        '.kt-prejoin-room-cell.self'
      );
    }catch(e){return null;}
  }
  function selfStream(){
    try{
      var v=selfVideo();
      if(v&&v.srcObject)return v.srcObject;
    }catch(e){}
    try{
      return window.__ktLocalGuestCameraStream20260926||
             window.__ktApprovedGuestSelfStream||
             (window.state&&state.stream)||null;
    }catch(e){return null;}
  }

  function attachSelfCameraNow(){
    var s=selfStream(),v=selfVideo();
    if(!s||!v)return false;
    try{
      var live=s.getVideoTracks&&s.getVideoTracks().some(function(t){
        return t&&t.readyState==='live'&&t.enabled!==false;
      });
      if(!live)return false;
      if(v.srcObject!==s)v.srcObject=s;
      v.autoplay=true;v.playsInline=true;v.muted=true;
      var p=v.play();if(p&&p.catch)p.catch(function(){});
      return true;
    }catch(e){return false;}
  }

  function cameraOn(){
    var s=selfStream();
    try{
      var ts=s&&s.getVideoTracks?s.getVideoTracks():[];
      return !!(ts&&ts.some(function(t){return t.readyState!=='ended'&&t.enabled!==false;}));
    }catch(e){return false;}
  }

  function toggleCamera(){
    var before=cameraOn();
    if(typeof window.ktGuestToggleSelfCamera20260928==='function'){
      try{
        window.ktGuestToggleSelfCamera20260928();
        if(!before&&typeof window.ktEnsureApprovedGuestCamera20260928==='function'){
          var q=window.ktEnsureApprovedGuestCamera20260928();
          if(q&&q.then)q.then(function(){
            [0,40,120,260,500].forEach(function(ms){
              setTimeout(function(){attachSelfCameraNow();refreshSelfPhoto();},ms);
            });
          });
        }else{
          [20,100,220].forEach(function(ms){setTimeout(function(){attachSelfCameraNow();refreshSelfPhoto();},ms);});
        }
        return;
      }catch(e){}
    }
    if(!before&&typeof window.ktEnsureApprovedGuestCamera20260928==='function'){
      try{
        var p=window.ktEnsureApprovedGuestCamera20260928();
        if(p&&p.then)p.then(function(){
          [0,40,120,260,500].forEach(function(ms){setTimeout(function(){attachSelfCameraNow();refreshSelfPhoto();},ms);});
        });
        return;
      }catch(e){}
    }
    var s=selfStream();
    if(!s||!s.getVideoTracks)return;
    var ts=s.getVideoTracks(),on=ts.some(function(t){return t.enabled!==false;});
    ts.forEach(function(t){try{t.enabled=!on;}catch(e){}});
    attachSelfCameraNow();
  }

  function ensureSelfPhoto(){
    var cell=selfCell();
    if(!cell)return;
    if(!cell.dataset.ktSelfCellTap20260928){
      cell.dataset.ktSelfCellTap20260928='1';
      cell.addEventListener('click',function(e){
        if(e.target&&e.target.closest&&e.target.closest('.kt-self-photo-camera-toggle'))return;
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        toggleCamera();
      });
    }
    var btn=cell.querySelector('.kt-self-photo-camera-toggle');
    if(!btn){
      btn=document.createElement('button');
      btn.type='button';
      btn.className='kt-self-photo-camera-toggle';
      btn.setAttribute('aria-label','내 사진 눌러 카메라 켜기/끄기');
      btn.addEventListener('click',function(e){
        try{e.preventDefault();e.stopPropagation();}catch(_e){}
        toggleCamera();
        setTimeout(refreshSelfPhoto,20);
        setTimeout(refreshSelfPhoto,120);
      });
      cell.appendChild(btn);
    }
    var photo=profilePhoto();
    if(photo){
      var img=btn.querySelector('img');
      if(!img){
        btn.innerHTML='<img alt="내 사진">';
        img=btn.querySelector('img');
      }
      if(img&&img.src!==photo)img.src=photo;
    }else{
      btn.innerHTML='<span>👤</span>';
    }
    refreshSelfPhoto();
  }

  function refreshSelfPhoto(){
    var cell=selfCell();
    if(!cell)return;
    var btn=cell.querySelector('.kt-self-photo-camera-toggle');
    if(!btn)return;
    var on=cameraOn();
    cell.classList.toggle('kt-self-camera-on',on);
    cell.classList.toggle('kt-self-camera-off',!on);
    btn.title=on?'내 사진 누르면 카메라 끄기':'내 사진 누르면 카메라 켜기';
  }

  function installStyle(){
    if(document.getElementById('ktGuestSelfPhotoBigChatStyle20260928'))return;
    var s=document.createElement('style');
    s.id='ktGuestSelfPhotoBigChatStyle20260928';
    s.textContent=`
/* 본인 사진 = 카메라 버튼. 카메라는 같은 자기 칸 안에서만 보임 */
.kt-guest-hostlike-room .kgh-cell.self{cursor:pointer!important}
.kt-guest-hostlike-room .kgh-cell.self .kt-self-photo-camera-toggle{
  position:absolute!important;right:5px!important;bottom:5px!important;z-index:12!important;
  width:38px!important;height:38px!important;border-radius:50%!important;padding:0!important;
  border:2px solid #55dfff!important;background:#15151a!important;color:#fff!important;
  overflow:hidden!important;display:grid!important;place-items:center!important;
  box-shadow:0 0 10px rgba(85,223,255,.7)!important;touch-action:manipulation!important
}
.kt-guest-hostlike-room .kgh-cell.self .kt-self-photo-camera-toggle img{
  width:100%!important;height:100%!important;object-fit:cover!important;display:block!important
}
.kt-guest-hostlike-room .kgh-cell.self .kt-self-photo-camera-toggle span{font-size:21px!important}
.kt-guest-hostlike-room .kgh-cell.self.kt-self-camera-off>video{opacity:0!important}
.kt-guest-hostlike-room .kgh-cell.self.kt-self-camera-off .kt-self-photo-camera-toggle{
  left:50%!important;right:auto!important;top:50%!important;bottom:auto!important;
  width:62px!important;height:62px!important;transform:translate(-50%,-50%)!important
}
.kt-guest-hostlike-room .kgh-cell.self.kt-self-camera-on>video{opacity:1!important}

/* 채팅: 모든 방에서 TikTok처럼 넓고 크게, 검은 박스 없이 영상 위에 표시 */
.ktsolo-chat,.ktg13-chat,.ktsubscriber-chat,.ktsecret-chat,
.kt-guest-hostlike-room .kgh-chatbox,.kt-remote-live .kt-remote-chat{
  font-size:13px!important;line-height:1.38!important;
}
.ktsolo-chat-line,.ktg13-chat-line,.ktsubscriber-chat-line,.ktsecret-chat-line,
.kt-guest-hostlike-room .kgh-chatbox>div,.kt-remote-live .kt-remote-chat *{
  font-size:13px!important;line-height:1.38!important;
  text-shadow:0 1px 3px #000,0 0 5px #000!important;
}
.ktsolo-chat{max-height:210px!important;right:82px!important}
.ktg13-room .ktg13-chat{max-height:160px!important;right:28%!important}
.ktsubscriber-room .ktsubscriber-chat{max-height:160px!important;right:84px!important}
.ktsecret-room .ktsecret-chat{max-height:60%!important;right:36%!important}

/* 승인된 게스트 화면은 기존 64px 줄 대신 영상 위 넓은 채팅으로 */
.kt-guest-hostlike-room{position:relative!important}
.kt-guest-hostlike-room .kgh-chat{
  position:absolute!important;left:6px!important;right:6px!important;bottom:62px!important;
  height:132px!important;max-height:132px!important;min-height:0!important;
  z-index:32!important;background:transparent!important;pointer-events:none!important;
  display:flex!important;align-items:flex-end!important;padding:0 112px 5px 4px!important
}
.kt-guest-hostlike-room .kgh-chatbox{
  width:100%!important;max-height:126px!important;overflow:hidden!important;
  display:flex!important;flex-direction:column!important;justify-content:flex-end!important
}
.kt-remote-live .kt-remote-chat{
  min-height:52px!important;max-height:132px!important;background:transparent!important
}
@media(max-width:390px){
  .ktsolo-chat-line,.ktg13-chat-line,.ktsubscriber-chat-line,.ktsecret-chat-line,
  .kt-guest-hostlike-room .kgh-chatbox>div,.kt-remote-live .kt-remote-chat *{
    font-size:12px!important
  }
  .ktg13-room .ktg13-chat,.ktsubscriber-room .ktsubscriber-chat{max-height:145px!important}
  .kt-guest-hostlike-room .kgh-chat{height:118px!important;max-height:118px!important}
  .kt-guest-hostlike-room .kgh-chatbox{max-height:112px!important}
}
`;
    (document.head||document.documentElement).appendChild(s);
  }

  function ensure(){
    installStyle();
    ensureSelfPhoto();
    refreshSelfPhoto();
  }

  ensure();
  [50,120,250,500,900,1500].forEach(function(ms){setTimeout(ensure,ms);});
  setInterval(ensure,500);
  try{
    new MutationObserver(function(){
      clearTimeout(window.__ktSelfPhotoBigChatTimer20260928);
      window.__ktSelfPhotoBigChatTimer20260928=setTimeout(ensure,30);
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();