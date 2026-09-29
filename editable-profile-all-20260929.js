/* K-Talk editable profile for all members: photo + nickname */
(function(){
  if(window.__ktEditableProfileAll20260929)return;
  window.__ktEditableProfileAll20260929=true;

  function esc(s){
    try{return window.ktProfileEscape?window.ktProfileEscape(s):String(s==null?'':s).replace(/[&<>"']/g,function(ch){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]})}catch(e){return String(s||'')}
  }
  function profileKey(){
    try{return window.ktProfileStorageKey?window.ktProfileStorageKey():'ktalk_profile_v1:local'}catch(e){return 'ktalk_profile_v1:local'}
  }
  function selectedSub(){
    try{return window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():''}catch(e){return ''}
  }
  function defaultName(){
    try{
      var sub=selectedSub();
      if(sub&&window.ktSubAccountInfo)return window.ktSubAccountInfo(sub).name;
      var o=window.ktVideoOwner?window.ktVideoOwner():null;
      if(o&&o.name&&o.name!=='내 계정')return String(o.name);
      if(window.ktCurrentVerifiedAccountName&&window.ktCurrentVerifiedAccountName())return String(window.ktCurrentVerifiedAccountName());
    }catch(e){}
    return 'K-Talk';
  }
  function load(){
    var base={name:'',bio:'',photo:'',followers:0,likes:0,link:'',level:0};
    try{
      var raw=localStorage.getItem(profileKey());
      if(raw){
        var p=JSON.parse(raw)||{};
        base.name=String(p.name||'');
        base.bio=String(p.bio||'');
        base.photo=String(p.photo||'');
        base.followers=parseInt(p.followers||0,10)||0;
        base.likes=parseInt(p.likes||0,10)||0;
        base.link=String(p.link||'');
        base.level=parseInt(p.level||0,10)||0;
      }
    }catch(e){}
    if(!base.name)base.name=defaultName();
    return base;
  }

  window.ktProfileLoad=load;

  window.ktProfileRender=function(){
    var p=load();
    var initial=(p.name||'K').trim().charAt(0)||'K';
    var photo=p.photo?'<img src="'+p.photo+'" alt="프로필 사진">':'<span>'+esc(initial)+'</span>';
    var linkText=p.link?esc(p.link):'링크를 등록해 주세요';
    var levelLine=p.level?'<small class="kt-editable-profile-level">Lv.'+Number(p.level).toLocaleString('ko-KR')+'</small>':'';
    return '<div class="kt-my-profile">'
      +'<div class="kt-profile-hero">'
        +'<div class="kt-profile-photo-wrap">'
          +'<button type="button" class="kt-my-profile-photo" onclick="document.getElementById(\'ktProfilePhotoInput\').click()" aria-label="프로필 사진 바꾸기">'+photo+'<em>사진 변경</em></button>'
          +'<input id="ktProfilePhotoInput" type="file" accept="image/*" hidden onchange="ktProfilePickPhoto(this)">'
          +'<button type="button" class="kt-profile-photo-change-visible" onclick="document.getElementById(\'ktProfilePhotoInput\').click()">📷 프로필 사진 바꾸기</button>'
        +'</div>'
        +'<div class="kt-profile-maininfo"><b>'+esc(p.name)+'</b>'+levelLine+'<small>'+esc(p.bio||'소개를 입력해 주세요')+'</small></div>'
      +'</div>'
      +'<div class="kt-profile-stats">'
        +'<div><b>'+Number(p.followers||0).toLocaleString('ko-KR')+'</b><small>팔로워</small></div>'
        +'<div><b>'+Number(p.likes||0).toLocaleString('ko-KR')+'</b><small>좋아요</small></div>'
      +'</div>'
      +'<button class="kt-profile-public-link" type="button" onclick="ktOpenProfileLink()"><span>🔗</span><b>'+linkText+'</b><em>›</em></button>'
      +'<label>닉네임<input id="ktProfileName" class="form" maxlength="20" value="'+esc(p.name)+'" placeholder="닉네임을 입력하세요"></label>'
      +'<label>소개<input id="ktProfileBio" class="form" maxlength="60" value="'+esc(p.bio)+'" placeholder="간단한 소개를 입력하세요"></label>'
      +'<label>프로필 링크<input id="ktProfileLink" class="form" maxlength="180" value="'+esc(p.link||'')+'" placeholder="https:// 또는 사이트 주소"></label>'
      +'<button class="act" type="button" onclick="ktProfileSave()">프로필 저장</button>'
      +(selectedSub()?'<button class="kt-profile-switch-btn" type="button" onclick="openAccountChooser()">⇄ 계정 선택</button>':'')
      +'<button class="kt-profile-video-btn" type="button" onclick="closeSheet();setTimeout(openMyVideoLibrary,80)">🎬 내 동영상 보기</button>'
      +'<small class="kt-profile-note">프로필 사진과 닉네임은 언제든 바꿀 수 있습니다.</small>'
      +'</div>';
  };

  window.ktProfileSave=function(){
    var old=load();
    var nameEl=document.getElementById('ktProfileName');
    var bioEl=document.getElementById('ktProfileBio');
    var linkEl=document.getElementById('ktProfileLink');
    var name=String(nameEl?nameEl.value:old.name||'').trim();
    if(!name)name=old.name||defaultName();
    var data={
      name:name,
      bio:String(bioEl?bioEl.value:old.bio||'').trim(),
      photo:old.photo||'',
      followers:old.followers||0,
      likes:old.likes||0,
      link:String(linkEl?linkEl.value:old.link||'').trim(),
      level:old.level||0
    };
    try{localStorage.setItem(profileKey(),JSON.stringify(data));}catch(e){alert('프로필을 저장하지 못했습니다. 다시 눌러 주세요.');return;}
    try{if(window.ktSpeak)window.ktSpeak('프로필을 저장했습니다.');}catch(e){}
    alert('✅ 프로필을 저장했습니다.');
    if(typeof window.openProfileDirect==='function')window.openProfileDirect();
  };

  var oldCard=window.ktSubProfileCard;
  if(typeof oldCard==='function'&&!oldCard.__editableAllPatched){
    var wrapped=function(k){
      var r=oldCard.apply(this,arguments)||{};
      try{
        var x=JSON.parse(localStorage.getItem('ktalk_profile_v1:sub:'+k)||'{}')||{};
        if(x.name)r.name=String(x.name);
        if(x.photo){
          r.avatar='<span class="kt-account-avatar '+k+' has-photo"><img src="'+String(x.photo)+'" alt="프로필"></span>';
        }
      }catch(e){}
      return r;
    };
    wrapped.__editableAllPatched=true;
    window.ktSubProfileCard=wrapped;
  }

  if(!document.getElementById('ktEditableProfileAllStyle20260929')){
    var s=document.createElement('style');
    s.id='ktEditableProfileAllStyle20260929';
    s.textContent='.kt-editable-profile-level{display:block!important;color:#ffe071!important;font-size:11px!important;font-weight:900!important;margin-top:2px!important}.kt-profile-photo-change-visible{display:block!important;margin:8px auto 0!important;padding:7px 10px!important;border:1px solid #5aa8ff!important;border-radius:10px!important;background:#121a2b!important;color:#dff1ff!important;font-size:12px!important;font-weight:900!important;pointer-events:auto!important;touch-action:manipulation!important}';
    document.head.appendChild(s);
  }
})();