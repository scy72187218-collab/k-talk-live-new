/* K-Talk signup consent + invite/share entry.
   Keeps the existing signup/login flow: consent first, then hands back to original needJoin().
   SMS opens the phone's message composer. "카카오톡 등 공유" uses the device share sheet,
   where KakaoTalk can be selected when installed. */
(function(){
  if(window.__ktSignupConsentShare20260926)return;
  window.__ktSignupConsentShare20260926=true;

  var oldNeedJoin=window.needJoin;
  var oldShareApp=window.shareApp;
  var proceeding=false;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function appUrl(){
    try{return location.origin+location.pathname;}catch(e){return 'https://k-talk-live-final.vercel.app';}
  }
  function inviteText(){
    return 'K-Talk LIVE 같이 해요! 방송·친구·라이브를 함께 즐겨보세요. '+appUrl();
  }
  function toast(msg){
    var d=document.getElementById('ktJoinShareToast');if(d)d.remove();
    d=document.createElement('div');d.id='ktJoinShareToast';d.textContent=msg;
    d.style.cssText='position:fixed;left:50%;bottom:92px;transform:translateX(-50%);z-index:2147483647;max-width:88vw;padding:10px 15px;border-radius:999px;background:#101117;color:#fff;border:1px solid #5a8cff;font:900 12px system-ui;white-space:nowrap;overflow:hidden;text-overflow:ellipsis';
    document.body.appendChild(d);setTimeout(function(){try{d.remove();}catch(e){}},2200);
  }

  function checked(id){var x=document.getElementById(id);return !!(x&&x.checked);}
  window.ktJoinConsentAll20260926=function(el){
    ['ktJoinTerms20260926','ktJoinPrivacy20260926','ktJoinInvite20260926'].forEach(function(id){
      var x=document.getElementById(id);if(x)x.checked=!!(el&&el.checked);
    });
  };

  window.ktJoinShareSms20260926=function(){
    var body=encodeURIComponent(inviteText());
    try{location.href='sms:?&body='+body;}catch(e){toast('문자 앱을 열 수 없습니다.');}
  };

  window.ktJoinShareDevice20260926=async function(){
    var data={title:'K-Talk LIVE',text:'K-Talk LIVE 같이 해요!',url:appUrl()};
    try{
      if(navigator.share){await navigator.share(data);return;}
    }catch(e){if(e&&e.name==='AbortError')return;}
    try{
      await navigator.clipboard.writeText(inviteText());
      toast('초대 문구와 주소를 복사했습니다.');
    }catch(e){toast('공유 기능을 사용할 수 없습니다.');}
  };

  window.ktJoinCopyInvite20260926=async function(){
    try{await navigator.clipboard.writeText(inviteText());toast('초대 문구와 주소를 복사했습니다.');}
    catch(e){toast(inviteText());}
  };

  function consentHtml(message){
    return '<div class="kt-join-consent">'
      +'<div class="kt-join-welcome"><b>👤 K-Talk 가입 / 로그인</b><span>'+esc(message||'가입을 계속해 주세요.')+'</span></div>'
      +'<label class="kt-join-all"><input id="ktJoinAll20260926" type="checkbox" onchange="ktJoinConsentAll20260926(this)"> <b>전체 동의</b></label>'
      +'<label><input id="ktJoinTerms20260926" type="checkbox"> <b>[필수]</b> 이용약관에 동의합니다.</label>'
      +'<label><input id="ktJoinPrivacy20260926" type="checkbox"> <b>[필수]</b> 개인정보 수집·이용에 동의합니다.</label>'
      +'<label><input id="ktJoinInvite20260926" type="checkbox"> <b>[선택]</b> 친구 초대·이벤트 안내에 동의합니다.</label>'
      +'<div class="kt-join-note">필수 항목에 동의해야 가입/로그인을 계속할 수 있습니다. 친구 초대는 본인이 공유 버튼을 누를 때만 실행됩니다.</div>'
      +'<button class="kt-join-go" type="button" onclick="ktJoinContinue20260926()">동의하고 가입 / 로그인 계속</button>'
      +'<div class="kt-join-share-title">친구에게 K-Talk 보내기</div>'
      +'<div class="kt-join-share-grid">'
        +'<button type="button" onclick="ktJoinShareSms20260926()">💬<b>문자로 보내기</b></button>'
        +'<button type="button" onclick="ktJoinShareDevice20260926()">🟡<b>카카오톡 등 공유</b></button>'
        +'<button type="button" onclick="ktJoinCopyInvite20260926()">🔗<b>주소 복사</b></button>'
      +'</div>'
      +'<div class="kt-join-note">카카오톡이 설치된 휴대폰에서는 ‘카카오톡 등 공유’를 누른 뒤 공유 목록에서 카카오톡을 선택할 수 있습니다.</div>'
      +'</div>';
  }

  function ensureStyle(){
    if(document.getElementById('ktJoinConsentStyle20260926'))return;
    var s=document.createElement('style');s.id='ktJoinConsentStyle20260926';
    s.textContent=''
      +'.kt-join-consent{display:grid;gap:9px;color:#fff}.kt-join-welcome{padding:12px;border-radius:14px;background:linear-gradient(135deg,#1c1632,#10131e);border:1px solid #7c63ff55}.kt-join-welcome b{display:block;font-size:17px}.kt-join-welcome span{display:block;margin-top:5px;color:#cfd1da;font-size:11px}'
      +'.kt-join-consent label{display:flex;align-items:flex-start;gap:8px;padding:10px 11px;border:1px solid #ffffff1f;border-radius:12px;background:#11131a;font-size:12px;line-height:1.35}.kt-join-consent input{width:19px;height:19px;flex:none;accent-color:#ff3d85}.kt-join-consent .kt-join-all{border-color:#ff4b9277;background:#251322}'
      +'.kt-join-note{padding:0 3px;color:#aeb3c0;font-size:9px;line-height:1.45}.kt-join-go{height:48px;border:0;border-radius:13px;background:linear-gradient(135deg,#ff315f,#8b55ff);color:#fff;font-size:14px;font-weight:950}'
      +'.kt-join-share-title{margin-top:5px;font-size:13px;font-weight:950;color:#8ee8ff}.kt-join-share-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:7px}.kt-join-share-grid button{min-height:68px;border:1px solid #ffffff24;border-radius:13px;background:#11141c;color:#fff;font-size:22px}.kt-join-share-grid b{display:block;margin-top:5px;font-size:9px}'
      +'@media(max-width:390px){.kt-join-share-grid{gap:5px}.kt-join-share-grid button{min-height:64px}}';
    document.head.appendChild(s);
  }

  var pendingMessage='';
  window.ktJoinContinue20260926=function(){
    if(!checked('ktJoinTerms20260926')||!checked('ktJoinPrivacy20260926')){
      toast('필수 동의 2개를 먼저 체크해 주세요.');return;
    }
    try{
      localStorage.setItem('ktalk_terms_agreed_20260926','yes');
      localStorage.setItem('ktalk_privacy_agreed_20260926','yes');
      localStorage.setItem('ktalk_invite_notice_agreed_20260926',checked('ktJoinInvite20260926')?'yes':'no');
      localStorage.setItem('ktalk_consent_at_20260926',new Date().toISOString());
    }catch(e){}
    if(proceeding)return;
    proceeding=true;
    try{if(typeof window.closeSheet==='function')window.closeSheet();}catch(e){}
    setTimeout(function(){
      proceeding=false;
      if(typeof oldNeedJoin==='function'){
        try{oldNeedJoin(pendingMessage||'K-Talk 가입/로그인을 진행해 주세요.');}catch(e){}
      }
    },40);
  };

  window.needJoin=function(message){
    if(proceeding&&typeof oldNeedJoin==='function')return oldNeedJoin.apply(this,arguments);
    ensureStyle();
    pendingMessage=String(message||'K-Talk 가입/로그인을 진행해 주세요.');
    if(typeof window.showSheet==='function'){
      window.showSheet('K-Talk 가입 · 동의 · 공유',consentHtml(pendingMessage));
      return;
    }
    if(typeof oldNeedJoin==='function')return oldNeedJoin.apply(this,arguments);
  };

  window.shareApp=function(){
    ensureStyle();
    if(typeof window.showSheet==='function'){
      window.showSheet('K-Talk 친구 초대',consentHtml('친구에게 K-Talk을 문자나 카카오톡 등으로 보낼 수 있습니다.'));
      return;
    }
    if(typeof oldShareApp==='function')return oldShareApp.apply(this,arguments);
    return window.ktJoinShareDevice20260926();
  };

  ensureStyle();
})();
