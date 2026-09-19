/* K-Talk 내 프로필 2026-09-18 14:47 KST 복구 전용
   기준 배포: ebc72d9025d6f7e252a0620932417f0e7fc90686 (14:46:33 KST, 14:47 직전)
   프로필 화면/진입/프로필 게시동영상 표시만 당시 방식으로 복구.
   방송방/채팅/스위치/카메라/배치는 변경하지 않음. */
(function(){
  if(window.__ktProfileRestore202609181447)return;
  window.__ktProfileRestore202609181447=true;

  function esc(s){
    return String(s==null?'':s).replace(/[&<>"']/g,function(ch){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch];
    });
  }

  /* 14:47 이후 프로필에 추가된 표시만 화면에서 숨김 */
  function oldProfileStyle(){
    if(document.getElementById('ktProfileRestore1447Style'))return;
    var s=document.createElement('style');
    s.id='ktProfileRestore1447Style';
    s.textContent=''
      +'.kt-my-profile~.kt-owner-single-level-card,.kt-owner-single-level-card{display:none!important}'
      +'#ktTotalAdminWrap,.kt-profile-round-qr,#ktOwnerMonitorSwitch{display:none!important}';
    document.head.appendChild(s);
  }

  window.ktProfileLoad=function(){
    var base={name:'',bio:'',photo:'',followers:0,likes:0,link:''};
    try{
      var raw=localStorage.getItem(ktProfileStorageKey());
      if(raw){
        var p=JSON.parse(raw)||{};
        base.name=String(p.name||'');
        base.bio=String(p.bio||'');
        base.photo=String(p.photo||'');
        base.followers=parseInt(p.followers||0,10)||0;
        base.likes=parseInt(p.likes||0,10)||0;
        base.link=String(p.link||'');
      }
    }catch(e){}
    if(!base.name){
      try{
        var sub=ktGetSelectedSubAccount();
        if(sub)base.name=ktSubAccountInfo(sub).name;
        else{
          var owner=window.ktVideoOwner?ktVideoOwner():null;
          if(owner&&owner.name&&owner.name!=='내 계정')base.name=owner.name;
          else if(window.ktCurrentVerifiedAccountName&&ktCurrentVerifiedAccountName())base.name=ktCurrentVerifiedAccountName();
        }
      }catch(e){}
    }
    if(base.name==='태권이'||base.name==='K-톡태권')base.name='K-톡 태권1';
    if(base.name==='하이네'||base.name==='K-톡하이네')base.name='K-톡 하이네2';
    if(!base.name)base.name='K-Talk';
    return base;
  };

  window.ktProfileRender=function(){
    var p=ktProfileLoad();
    var initial=(p.name||'K').trim().charAt(0)||'K';
    var photo=p.photo
      ?'<img src="'+p.photo+'" alt="프로필 사진">'
      :'<span>'+esc(initial)+'</span>';
    var linkText=p.link?esc(p.link):'링크를 등록해 주세요';
    return '<div class="kt-my-profile">'
      +'<div class="kt-profile-hero">'
        +'<div class="kt-profile-photo-wrap">'
          +'<button type="button" class="kt-my-profile-photo" onclick="document.getElementById(\'ktProfilePhotoInput\').click()" aria-label="프로필 사진 바꾸기">'+photo+'<em>사진 변경</em></button>'
          +'<input id="ktProfilePhotoInput" type="file" accept="image/*" hidden onchange="ktProfilePickPhoto(this)">'
        +'</div>'
        +'<div class="kt-profile-maininfo"><b>'+esc(p.name)+'</b><small>'+esc(p.bio||'소개를 입력해 주세요')+'</small></div>'
      +'</div>'
      +'<div class="kt-profile-stats">'
        +'<div><b>'+(p.followers||0).toLocaleString('ko-KR')+'</b><small>팔로워</small></div>'
        +'<div><b>'+(p.likes||0).toLocaleString('ko-KR')+'</b><small>좋아요</small></div>'
      +'</div>'
      +'<button class="kt-profile-public-link" type="button" onclick="ktOpenProfileLink()"><span>🔗</span><b>'+linkText+'</b><em>›</em></button>'
      +'<label>닉네임<input id="ktProfileName" class="form" maxlength="20" value="'+esc(p.name)+'" placeholder="닉네임"></label>'
      +'<label>소개<input id="ktProfileBio" class="form" maxlength="60" value="'+esc(p.bio)+'" placeholder="간단한 소개를 입력하세요"></label>'
      +'<label>프로필 링크<input id="ktProfileLink" class="form" maxlength="180" value="'+esc(p.link||'')+'" placeholder="https:// 또는 사이트 주소"></label>'
      +'<button class="act" type="button" onclick="ktProfileSave()">프로필 저장</button>'
      +'<button class="kt-profile-switch-btn" type="button" onclick="openAccountChooser()">⇄ 계정 선택</button>'
      +'<button class="kt-profile-video-btn" type="button" onclick="closeSheet();setTimeout(openMyVideoLibrary,80)">🎬 내 동영상 보기</button>'
      +'<small class="kt-profile-note">프로필 사진은 누르지 않아도 바로 보이게 표시됩니다.</small>'
      +'</div>';
  };
  /* 14:47 이후 총관리 래퍼가 다시 붙지 않게 프로필 렌더만 고정 */
  window.ktProfileRender.__ktTotalAdminWrapped=true;

  window.ktProfileSave=function(){
    var old=ktProfileLoad();
    var nameEl=document.getElementById('ktProfileName');
    var bioEl=document.getElementById('ktProfileBio');
    var linkEl=document.getElementById('ktProfileLink');
    var name=String(nameEl?nameEl.value:'').trim();
    var bio=String(bioEl?bioEl.value:'').trim();
    var link=String(linkEl?linkEl.value:'').trim();
    if(!name){alert('닉네임을 입력해 주세요.');return;}
    var data={name:name,bio:bio,photo:old.photo||'',followers:old.followers||0,likes:old.likes||0,link:link};
    try{localStorage.setItem(ktProfileStorageKey(),JSON.stringify(data));}
    catch(e){alert('프로필을 저장하지 못했습니다. 다시 눌러 주세요.');return;}
    try{if(window.ktSpeak)ktSpeak('프로필을 저장했습니다.');}catch(e){}
    alert('✅ 프로필을 저장했습니다.');
    openProfileDirect();
  };

  window.ktProfilePickPhoto=function(input){
    var file=input&&input.files&&input.files[0];
    if(!file)return;
    if(!/^image\//i.test(file.type||'')){alert('사진 파일을 선택해 주세요.');return;}
    var reader=new FileReader();
    reader.onload=function(){
      var img=new Image();
      img.onload=function(){
        try{
          var size=420;
          var canvas=document.createElement('canvas');
          canvas.width=size;canvas.height=size;
          var ctx=canvas.getContext('2d');
          var scale=Math.max(size/img.width,size/img.height);
          var w=img.width*scale,h=img.height*scale;
          ctx.drawImage(img,(size-w)/2,(size-h)/2,w,h);
          var photo=canvas.toDataURL('image/jpeg',0.84);
          var p=ktProfileLoad();
          p.photo=photo;
          var nameEl=document.getElementById('ktProfileName');
          var bioEl=document.getElementById('ktProfileBio');
          var linkEl=document.getElementById('ktProfileLink');
          if(nameEl&&nameEl.value.trim())p.name=nameEl.value.trim();
          if(bioEl)p.bio=bioEl.value.trim();
          if(linkEl)p.link=linkEl.value.trim();
          localStorage.setItem(ktProfileStorageKey(),JSON.stringify(p));
          openProfileDirect();
        }catch(e){alert('사진을 등록하지 못했습니다. 다른 사진으로 다시 해 주세요.');}
      };
      img.onerror=function(){alert('사진을 읽지 못했습니다.');};
      img.src=reader.result;
    };
    reader.onerror=function(){alert('사진을 읽지 못했습니다.');};
    reader.readAsDataURL(file);
  };

  async function renderPosted1447(){
    if(!document.querySelector('.kt-my-profile'))return;
    var body=window.sheetBody||document.getElementById('sheetBody');
    if(!body||typeof window.ktOpenVideoDB!=='function')return;
    var box=document.getElementById('ktProfilePostedVideos');
    if(!box){
      box=document.createElement('div');
      box.id='ktProfilePostedVideos';
      box.style.cssText='display:grid;grid-template-columns:repeat(3,1fr);gap:3px;margin-top:14px';
      body.appendChild(box);
    }
    try{
      var db=await window.ktOpenVideoDB();
      var tx=db.transaction('videos','readonly');
      var req=tx.objectStore('videos').getAll();
      req.onsuccess=function(){
        var items=(req.result||[]).filter(function(v){return v.posted;})
          .sort(function(a,b){return (b.postedAt||b.createdAt||0)-(a.postedAt||a.createdAt||0);});
        box.innerHTML=items.length?'':'<div style="grid-column:1/-1;padding:16px;text-align:center;color:#aaa">아직 올린 동영상이 없습니다.</div>';
        items.forEach(function(v){
          if(!v||!v.blob)return;
          var u=URL.createObjectURL(v.blob);
          var b=document.createElement('button');
          b.type='button';
          b.style.cssText='position:relative;aspect-ratio:9/16;border:0;padding:0;overflow:hidden;border-radius:8px;background:#111';
          b.innerHTML='<video muted playsinline preload="metadata" src="'+u+'" style="width:100%;height:100%;object-fit:cover"></video><span style="position:absolute;left:7px;bottom:6px;color:#fff">▶</span>';
          b.onclick=function(){if(window.playStoredVideo)playStoredVideo(v.id);};
          box.appendChild(b);
        });
        try{db.close();}catch(e){}
      };
      req.onerror=function(){try{db.close();}catch(e){}};
    }catch(e){}
  }

  window.openProfileDirect=function(){
    var info=ktCurrentSubAccountInfo();
    showSheet('♛ '+info.name+' 프로필',ktProfileRender());
    setTimeout(renderPosted1447,80);
  };
  window.openProfile=function(){openAccountChooser();};

  oldProfileStyle();

  /* 다른 후기 코드가 openProfile을 바꾸더라도 14:47 방식 유지 */
  function keep1447(){
    oldProfileStyle();
    if(window.ktProfileRender!==arguments.callee.render){
      /* 함수는 아래 고정 참조로만 복원 */
    }
  }
  var render1447=window.ktProfileRender;
  var direct1447=window.openProfileDirect;
  var open1447=window.openProfile;
  function restoreFns(){
    if(window.ktProfileRender!==render1447)window.ktProfileRender=render1447;
    window.ktProfileRender.__ktTotalAdminWrapped=true;
    if(window.openProfileDirect!==direct1447)window.openProfileDirect=direct1447;
    if(window.openProfile!==open1447)window.openProfile=open1447;
  }
  [50,180,500,1200,2500,4000].forEach(function(ms){setTimeout(restoreFns,ms);});
  window.addEventListener('focus',restoreFns);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')restoreFns();});
})();