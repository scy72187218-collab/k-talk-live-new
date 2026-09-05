/* K-Talk LIVE: live-room bottom tools like the reference screen. Only active live rooms are affected. */
(function(){
  if(window.__ktLiveBottomTikTokLoaded)return;
  window.__ktLiveBottomTikTokLoaded=true;

  function addCss(){
    if(document.getElementById('ktLiveBottomTikTokCss'))return;
    var st=document.createElement('style');
    st.id='ktLiveBottomTikTokCss';
    st.textContent='\
html.kt-live-bottom-active body .app>.bottom{display:none!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-bottom{position:absolute!important;left:8px!important;right:8px!important;bottom:4px!important;height:58px!important;z-index:30!important;display:grid!important;grid-template-columns:repeat(6,minmax(0,1fr))!important;align-items:center!important;gap:6px!important;padding:0!important;margin:0!important;background:transparent!important;border:0!important;pointer-events:auto!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-bottom button{width:48px!important;height:48px!important;min-width:48px!important;min-height:48px!important;margin:0 auto!important;padding:0!important;border:1px solid rgba(255,255,255,.12)!important;border-radius:50%!important;background:rgba(22,22,26,.88)!important;color:#fff!important;display:grid!important;place-items:center!important;font-size:23px!important;font-weight:900!important;line-height:1!important;box-shadow:0 3px 14px rgba(0,0,0,.45)!important;backdrop-filter:blur(7px)!important;-webkit-backdrop-filter:blur(7px)!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-bottom button.kt-live-link{font-size:25px!important;text-shadow:0 0 9px #ff45c8,0 0 12px #4d8dff!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-bottom button.kt-live-share{font-size:29px!important;}\
html body #ktSept2Live.kt-added-ui-room .kt-s2-bottom button.kt-live-more{font-size:22px!important;letter-spacing:1px!important;}\
.kt-live-more-menu{display:grid;gap:9px;padding:4px 0;}\
.kt-live-more-menu button{width:100%;min-height:48px;border:1px solid #ffffff20;border-radius:14px;background:#111116;color:#fff;font-size:15px;font-weight:900;text-align:left;padding:0 14px;}\
.kt-live-more-menu button.danger{border-color:#ff4b6f66;background:#351018;color:#ffb7c5;}\
.kt-live-audience-card{padding:14px;border:1px solid #ffffff20;border-radius:16px;background:#101015;color:#fff;}\
.kt-live-audience-card b{display:block;font-size:17px;margin-bottom:7px;}\
.kt-live-audience-card p{margin:0 0 12px;color:#ddd;line-height:1.45;font-size:13px;}\
.kt-live-audience-card button{width:100%;min-height:46px;border:0;border-radius:13px;background:linear-gradient(135deg,#ff3f8f,#8b5cff);color:#fff;font-weight:900;font-size:14px;}\
@media(max-width:370px){html body #ktSept2Live.kt-added-ui-room .kt-s2-bottom{gap:3px!important;left:4px!important;right:4px!important}html body #ktSept2Live.kt-added-ui-room .kt-s2-bottom button{width:44px!important;height:44px!important;min-width:44px!important;min-height:44px!important;font-size:21px!important}}\
';
    document.head.appendChild(st);
  }

  window.ktLiveBottomConnect=function(){
    try{
      if(window.openCommunicationPanel){openCommunicationPanel();return;}
      if(window.showSheet){showSheet('연결','<div class="kt-live-audience-card"><b>🔗 소통 연결</b><p>방송 중 시청자와 소통할 기능을 선택할 수 있습니다.</p></div>');return;}
    }catch(e){}
  };

  window.ktLiveBottomAudience=function(){
    try{
      if(window.showSheet){
        showSheet('시청자 · 초대','<div class="kt-live-audience-card"><b>👥 시청자 초대</b><p>친구에게 방송을 공유해서 시청자로 초대할 수 있습니다.</p><button type="button" onclick="if(window.shareApp)shareApp()">↗ 공유해서 초대</button></div>');
        return;
      }
      if(window.shareApp)shareApp();
    }catch(e){}
  };

  window.ktLiveBottomEffects=function(){
    try{
      var btn=document.querySelector('#ktSept2Live .kt-s2-right button:last-child');
      if(btn){btn.click();return;}
      if(window.openEditEffectPanel){
        var c=document.getElementById('creator')||window.creator;
        if(c&&c.classList)c.classList.add('show');
        openEditEffectPanel();
      }
    }catch(e){}
  };

  window.ktLiveBottomMore=function(){
    try{
      if(window.showSheet){
        var html='<div class="kt-live-more-menu">'
          +'<button type="button" onclick="if(window.closeSheet)closeSheet();if(window.openTreasure)openTreasure()">🗝️ 보물상자</button>'
          +'<button type="button" onclick="if(window.closeSheet)closeSheet();if(window.openLiveSettings)openLiveSettings();else if(window.openSiteGuide)openSiteGuide()">⚙️ 방송 설정</button>'
          +'<button type="button" class="danger" onclick="if(window.closeSheet)closeSheet();if(window.endBroadcastEarnings)endBroadcastEarnings()">■ 방송 종료</button>'
          +'</div>';
        showSheet('더보기',html);
        return;
      }
      if(window.openSiteGuide)openSiteGuide();
    }catch(e){}
  };

  function installBar(){
    var section=document.getElementById('ktSept2Live');
    var active=!!(section&&section.classList.contains('kt-added-ui-room'));
    document.documentElement.classList.toggle('kt-live-bottom-active',active);
    if(!active)return;

    var bar=section.querySelector('.kt-s2-bottom');
    if(!bar)return;
    if(bar.dataset.ktTikBottom==='1')return;
    bar.dataset.ktTikBottom='1';
    bar.innerHTML=''
      +'<button class="kt-live-link" type="button" aria-label="연결" onclick="if(window.ktLiveBottomConnect)ktLiveBottomConnect()">🔗</button>'
      +'<button type="button" aria-label="시청자 초대" onclick="if(window.ktLiveBottomAudience)ktLiveBottomAudience()">👥</button>'
      +'<button type="button" aria-label="채팅" onclick="if(window.openComments)openComments()">💬</button>'
      +'<button class="kt-live-share" type="button" aria-label="공유" onclick="if(window.shareApp)shareApp()">↗</button>'
      +'<button type="button" aria-label="효과" onclick="if(window.ktLiveBottomEffects)ktLiveBottomEffects()">🪄</button>'
      +'<button class="kt-live-more" type="button" aria-label="더보기" onclick="if(window.ktLiveBottomMore)ktLiveBottomMore()">•••</button>';
  }

  addCss();
  installBar();
  setInterval(installBar,700);
  var ob=new MutationObserver(installBar);
  ob.observe(document.documentElement,{childList:true,subtree:true});
})();
