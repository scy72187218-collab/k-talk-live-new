/* K-Talk 회사 게시판: 블로그 댓글 캡처 인증 접수. 공개 동영상 장미 보내기와 분리. */
(function(){
  if(window.__ktBlogCommentRewardBoard20260915)return;
  window.__ktBlogCommentRewardBoard20260915=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var selectedProofFile=null;

  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }

  function first(obj,keys){
    obj=obj||{};
    for(var i=0;i<keys.length;i++){
      var v=obj[keys[i]];
      if(v!=null&&String(v).trim())return String(v).trim();
    }
    return '';
  }

  function profile(){
    var p={};
    try{if(typeof window.ktProfileLoad==='function')p=window.ktProfileLoad()||{};}catch(e){}
    var id=first(window.state||{},['profileId','currentAccountId','accountId','userId','id']);
    var name=first(p,['nickname','name','displayName','username'])||first(window.state||{},['nickname','profileName','displayName','accountName','username']);
    var photo=first(p,['photo','profilePhoto','profileImage','avatar','avatarUrl'])||first(window.state||{},['profilePhoto','profileImage','avatar','avatarUrl','photo']);

    try{id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;}catch(e){}
    try{name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_nickname')||name;}catch(e){}
    try{photo=localStorage.getItem('ktalk_profile_photo')||localStorage.getItem('ktalk_profile_image')||photo;}catch(e){}

    if(!id){
      try{id=localStorage.getItem('kt_live_device_id')||'';}catch(e){}
      if(!id){
        id='kt_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,10);
        try{localStorage.setItem('kt_live_device_id',id);}catch(e){}
      }
    }
    return {id:String(id).slice(0,80),name:String(name||'').slice(0,80),photo:String(photo||'')};
  }

  function ensureStyle(){
    if(document.getElementById('ktBlogRewardBoardStyle20260915'))return;
    var s=document.createElement('style');
    s.id='ktBlogRewardBoardStyle20260915';
    s.textContent=''
      +'.kt-blog-board{padding:4px 0 12px;color:#fff}'
      +'.kt-blog-board-card{padding:14px;margin-bottom:10px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:#15151b}'
      +'.kt-blog-board-title{font-size:16px;font-weight:950;color:#ffd85a;margin-bottom:7px}'
      +'.kt-blog-board-note{font-size:12px;line-height:1.55;color:#e5e5e8}'
      +'.kt-blog-profile{display:flex;align-items:center;gap:10px;margin-top:11px;padding:10px;border-radius:13px;background:#0c0c10}'
      +'.kt-blog-profile img,.kt-blog-profile .fallback{width:46px;height:46px;border-radius:50%;object-fit:cover;display:grid;place-items:center;background:#282832;border:1px solid #555;font-size:22px}'
      +'.kt-blog-profile b{display:block;font-size:14px}.kt-blog-profile small{display:block;margin-top:3px;color:#aaa;font-size:10px}'
      +'.kt-blog-proof-label{display:block;margin:10px 0 6px;font-size:13px;font-weight:900}'
      +'.kt-blog-proof-input{width:100%;padding:11px;border-radius:12px;border:1px dashed #ff5ccf;background:#0b0b10;color:#fff}'
      +'.kt-blog-proof-preview{display:none;width:100%;max-height:260px;object-fit:contain;margin-top:10px;border-radius:12px;background:#08080b}'
      +'.kt-blog-submit{width:100%;height:48px;margin-top:12px;border:0;border-radius:14px;background:linear-gradient(135deg,#ff3ca6,#7957ff);color:#fff;font-size:15px;font-weight:950}'
      +'.kt-blog-submit:disabled{opacity:.55}'
      +'.kt-blog-status{margin-top:10px;padding:10px;border-radius:12px;background:#0a1720;color:#8ee6ff;font-size:12px;line-height:1.5;font-weight:800}'
      +'#ktPublicFeedMorePopover .kt-blog-board-menu{color:#ffd85a!important}';
    document.head.appendChild(s);
  }

  window.ktOpenBlogCommentRewardBoard=function(){
    ensureStyle();
    selectedProofFile=null;
    var p=profile();
    var avatar=p.photo?'<img src="'+esc(p.photo)+'" alt="프로필 사진">':'<span class="fallback">👤</span>';
    var html=''
      +'<div class="kt-blog-board">'
      +'<div class="kt-blog-board-card">'
      +'<div class="kt-blog-board-title">📷 블로그 댓글 인증 · 장미 30개</div>'
      +'<div class="kt-blog-board-note">블로그에 직접 작성한 댓글이 보이도록 화면을 캡처해서 올려 주세요. 회사 AI가 댓글 화면과 현재 프로필 닉네임·프로필 사진 정보를 확인한 뒤 승인되면 장미 30개가 자동 지급되도록 접수됩니다.</div>'
      +'<div class="kt-blog-profile">'+avatar+'<div><b>'+esc(p.name||'닉네임 없음')+'</b><small>현재 K-Talk 프로필</small></div></div>'
      +'<label class="kt-blog-proof-label" for="ktBlogProofFile">블로그 댓글 캡처 사진</label>'
      +'<input id="ktBlogProofFile" class="kt-blog-proof-input" type="file" accept="image/jpeg,image/png,image/webp">'
      +'<img id="ktBlogProofPreview" class="kt-blog-proof-preview" alt="인증 사진 미리보기">'
      +'<button id="ktBlogProofSubmit" class="kt-blog-submit" type="button">회사 게시판에 올리기</button>'
      +'<div id="ktBlogProofStatus" class="kt-blog-status">중복 사진은 한 번만 접수됩니다. 승인 전에는 장미가 지급되지 않습니다.</div>'
      +'</div></div>';

    if(typeof window.showSheet==='function')window.showSheet('🏢 회사 게시판',html);
    else return;

    var input=document.getElementById('ktBlogProofFile');
    var preview=document.getElementById('ktBlogProofPreview');
    var submit=document.getElementById('ktBlogProofSubmit');
    if(input)input.addEventListener('change',function(){
      selectedProofFile=input.files&&input.files[0]?input.files[0]:null;
      if(!selectedProofFile||!preview)return;
      try{
        var url=URL.createObjectURL(selectedProofFile);
        preview.src=url;
        preview.style.display='block';
        preview.onload=function(){try{URL.revokeObjectURL(url);}catch(e){}};
      }catch(e){}
    });
    if(submit)submit.addEventListener('click',window.ktSubmitBlogCommentRewardProof);
  };

  async function sha256(file){
    var buf=await file.arrayBuffer();
    if(window.crypto&&crypto.subtle){
      var digest=await crypto.subtle.digest('SHA-256',buf);
      return Array.from(new Uint8Array(digest)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');
    }
    return String(file.size)+'-'+String(file.lastModified)+'-'+String(file.name||'proof');
  }

  function extension(file){
    var t=String(file.type||'').toLowerCase();
    if(t==='image/png')return 'png';
    if(t==='image/webp')return 'webp';
    return 'jpg';
  }

  async function uploadProof(file,path){
    var r=await fetch(SB+'/storage/v1/object/ktalk-blog-proof/'+path.split('/').map(encodeURIComponent).join('/'),{
      method:'POST',
      headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':file.type||'image/jpeg','x-upsert':'false'},
      body:file
    });
    if(!r.ok){
      var txt='';try{txt=await r.text();}catch(e){}
      throw new Error(txt||'upload failed');
    }
    return true;
  }

  async function submitRow(p,path,hash){
    var r=await fetch(SB+'/rest/v1/rpc/ktalk_submit_blog_comment_reward',{
      method:'POST',
      headers:{apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'},
      body:JSON.stringify({
        p_user_id:p.id,
        p_nickname:p.name,
        p_profile_photo:p.photo||'',
        p_proof_path:path,
        p_proof_hash:hash
      })
    });
    if(!r.ok){
      var txt='';try{txt=await r.text();}catch(e){}
      throw new Error(txt||'submit failed');
    }
    return await r.json();
  }

  window.ktSubmitBlogCommentRewardProof=async function(){
    var status=document.getElementById('ktBlogProofStatus');
    var btn=document.getElementById('ktBlogProofSubmit');
    var p=profile();

    if(!p.name){alert('프로필 닉네임을 먼저 등록해 주세요.');return;}
    if(!p.photo){alert('프로필 사진을 먼저 등록해 주세요.');return;}
    if(!selectedProofFile){alert('블로그 댓글 캡처 사진을 선택해 주세요.');return;}
    if(selectedProofFile.size>5*1024*1024){alert('사진은 5MB 이하로 올려 주세요.');return;}
    if(!/^image\/(jpeg|png|webp)$/i.test(selectedProofFile.type||'')){alert('JPG, PNG, WEBP 사진만 올릴 수 있습니다.');return;}

    if(btn){btn.disabled=true;btn.textContent='접수 중...';}
    if(status)status.textContent='사진을 안전하게 전송하고 있습니다.';

    try{
      var hash=await sha256(selectedProofFile);
      var safeId=p.id.replace(/[^a-zA-Z0-9_-]/g,'_').slice(0,60)||'user';
      var path=safeId+'/'+Date.now()+'-'+hash.slice(0,20)+'.'+extension(selectedProofFile);
      await uploadProof(selectedProofFile,path);
      var submissionId=await submitRow(p,path,hash);
      try{localStorage.setItem('ktalk_last_blog_reward_submission',String(submissionId||''));}catch(e){}
      if(status)status.innerHTML='✅ 회사 게시판 접수 완료<br>회사 AI 확인 대기 중입니다. 승인되면 <b>장미 30개</b>가 현재 프로필에 자동 지급됩니다.';
      if(btn){btn.textContent='접수 완료';btn.disabled=true;}
    }catch(e){
      if(status)status.textContent='접수하지 못했습니다. 같은 사진을 이미 올렸거나 네트워크 상태를 확인해 주세요.';
      if(btn){btn.disabled=false;btn.textContent='회사 게시판에 올리기';}
    }
  };

  function addCompanyBoardMenu(){
    var pop=document.getElementById('ktPublicFeedMorePopover');
    if(!pop||pop.querySelector('.kt-blog-board-menu'))return;
    var b=document.createElement('button');
    b.type='button';
    b.className='kt-blog-board-menu';
    b.textContent='🏢  회사 게시판 · 댓글 인증';
    b.onclick=function(e){
      e.preventDefault();e.stopPropagation();
      try{pop.remove();}catch(x){}
      window.ktOpenBlogCommentRewardBoard();
    };
    pop.appendChild(b);
  }

  ensureStyle();
  try{
    new MutationObserver(function(){addCompanyBoardMenu();}).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  setTimeout(addCompanyBoardMenu,300);
})();
