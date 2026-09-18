/* K-Talk 광고/동영상 게시 승인 요청 + 관리자 승인함.
   방송/카메라/채팅/방 기능은 변경하지 않음. */
(function(){
  if(window.__ktContentApprovalWorkflow20260918)return;
  window.__ktContentApprovalWorkflow20260918=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY,'Content-Type':'application/json'};
    Object.keys(extra||{}).forEach(function(k){h[k]=extra[k];});
    return h;
  }
  function esc(v){
    return String(v==null?'':v).replace(/[&<>"']/g,function(c){
      return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
    });
  }
  function ownerKey(){
    try{
      var k=window.ktGetSelectedSubAccount?window.ktGetSelectedSubAccount():'';
      return (k==='taekwon1'||k==='haine2')?k:'';
    }catch(e){return '';}
  }
  function isOwner(){return !!ownerKey();}
  function me(){
    var id='',name='';
    try{
      id=localStorage.getItem('ktalk_member_id')||
         localStorage.getItem('ktalk_active_account')||
         localStorage.getItem('ktalk_profile_id')||'';
      name=localStorage.getItem('ktalk_nickname')||
           localStorage.getItem('ktalk_profile_name')||
           localStorage.getItem('ktalk_active_account_name')||'';
    }catch(e){}
    try{
      if(!id&&window.state)id=state.profileId||state.currentAccountId||state.accountId||'';
      if(!name&&window.state)name=state.profileName||state.currentProfileName||state.accountName||'';
    }catch(e){}
    return {id:String(id||'').slice(0,120),name:String(name||'K-Talk 회원').slice(0,80)};
  }
  function joined(){
    if(isOwner())return true;
    try{return localStorage.getItem('ktalk_joined')==='1'&&!!me().id;}catch(e){return false;}
  }
  async function rpc(name,body){
    var r=await fetch(SB+'/rest/v1/rpc/'+name,{method:'POST',headers:headers(),body:JSON.stringify(body||{})});
    if(!r.ok)throw new Error(name+' '+r.status);
    var t=await r.text();
    return t?JSON.parse(t):null;
  }
  function ensureStyle(){
    if(document.getElementById('ktContentApprovalStyle'))return;
    var s=document.createElement('style');
    s.id='ktContentApprovalStyle';
    s.textContent=''
      +'.kt-content-request{display:grid;gap:9px;padding:2px 0}'
      +'.kt-content-request .tabs{display:grid;grid-template-columns:1fr 1fr;gap:7px}'
      +'.kt-content-request .tabs button{height:42px;border-radius:12px;border:1px solid #ffffff28;background:#111119;color:#fff;font-weight:950}'
      +'.kt-content-request .tabs button.on{border-color:#ff5ccf;background:#35102f;color:#ffe27a}'
      +'.kt-content-request input,.kt-content-request textarea{width:100%;border-radius:12px;border:1px solid #ffffff25;background:#0d0d13;color:#fff;padding:11px;font:inherit}'
      +'.kt-content-request textarea{min-height:95px;resize:vertical}'
      +'.kt-content-request .send{height:46px;border:0;border-radius:13px;background:linear-gradient(135deg,#7b2cff,#ff3f9e);color:#fff;font-weight:950;font-size:15px}'
      +'.kt-content-request .status{padding:9px 10px;border-radius:11px;background:#111118;border:1px solid #ffffff17;font-size:11px;line-height:1.45;color:#ddd}'
      +'.kt-admin-requests{display:grid;gap:9px}'
      +'.kt-admin-request{padding:10px;border-radius:13px;border:1px solid #ffffff1e;background:#0e0e14;color:#fff}'
      +'.kt-admin-request b{display:block;font-size:13px;color:#ffe27a}.kt-admin-request small{display:block;margin-top:4px;color:#bfc0ca;line-height:1.4}'
      +'.kt-admin-request .actions{display:grid;grid-template-columns:1fr 1fr;gap:7px;margin-top:9px}'
      +'.kt-admin-request .actions button{height:38px;border-radius:10px;border:1px solid #ffffff22;color:#fff;font-weight:950}'
      +'.kt-admin-request .approve{background:#124c2a}.kt-admin-request .reject{background:#4b171d}';
    document.head.appendChild(s);
  }

  window.ktOpenContentRequest=function(type){
    ensureStyle();
    if(!joined()){
      try{
        if(window.ktOpenEntryJoin)window.ktOpenEntryJoin();
        else alert('먼저 가입해 주세요.');
      }catch(e){}
      return false;
    }
    type=type==='ad'?'ad':'video';
    var title=type==='ad'?'광고 신청':'동영상 게시 승인 신청';
    var html='<div class="kt-content-request">'
      +'<div class="tabs">'
        +'<button type="button" class="'+(type==='ad'?'on':'')+'" onclick="ktOpenContentRequest(\'ad\')">📣 광고</button>'
        +'<button type="button" class="'+(type==='video'?'on':'')+'" onclick="ktOpenContentRequest(\'video\')">🎬 동영상</button>'
      +'</div>'
      +'<input id="ktContentReqTitle" maxlength="120" placeholder="'+(type==='ad'?'광고 제목/업체명':'올릴 동영상 제목')+'">'
      +'<textarea id="ktContentReqDetails" maxlength="1000" placeholder="'+(type==='ad'?'광고 내용과 연락 내용을 적어 주세요.':'어떤 동영상인지 간단히 적어 주세요.')+'"></textarea>'
      +'<button class="send" type="button" onclick="ktSubmitContentRequest(\''+type+'\')">관리자에게 승인 요청</button>'
      +'<div id="ktContentReqStatus" class="status">요청을 보내면 태권1·하이네2 총관리에서 승인할 수 있습니다.</div>'
      +'</div>';
    if(window.showSheet)showSheet('📨 '+title,html);
    setTimeout(function(){try{window.ktLoadMyContentRequestStatus();}catch(e){}},60);
    return false;
  };

  window.ktSubmitContentRequest=async function(type){
    var a=me();
    if(!a.id){alert('먼저 가입해 주세요.');return false;}
    var title=String((document.getElementById('ktContentReqTitle')||{}).value||'').trim();
    var details=String((document.getElementById('ktContentReqDetails')||{}).value||'').trim();
    if(!title){alert('제목을 입력해 주세요.');return false;}
    var st=document.getElementById('ktContentReqStatus');
    if(st)st.textContent='요청 보내는 중...';
    try{
      await rpc('ktalk_submit_content_request',{
        p_requester_id:a.id,
        p_requester_name:a.name,
        p_request_type:type==='ad'?'ad':'video',
        p_title:title,
        p_details:details
      });
      if(st)st.textContent='✅ 승인 요청을 보냈습니다. 관리자가 수락하면 사용할 수 있습니다.';
    }catch(e){
      if(st)st.textContent='요청을 보내지 못했습니다. 다시 눌러 주세요.';
    }
    return false;
  };

  window.ktLoadMyContentRequestStatus=async function(){
    var a=me(),box=document.getElementById('ktContentReqStatus');
    if(!a.id||!box)return;
    try{
      var rows=await rpc('ktalk_content_request_status',{p_requester_id:a.id});
      rows=Array.isArray(rows)?rows:[];
      if(!rows.length)return;
      var x=rows[0],lab=x.request_type==='ad'?'광고':'동영상';
      var st=x.status==='approved'?'승인 완료':(x.status==='rejected'?'거절':'승인 대기');
      box.innerHTML='최근 요청: <b>'+esc(lab)+'</b> · '+esc(st);
    }catch(e){}
  };

  window.ktHasVideoUploadApproval=async function(){
    if(isOwner())return true;
    var a=me();
    if(!a.id)return false;
    try{return !!(await rpc('ktalk_has_video_upload_approval',{p_requester_id:a.id}));}catch(e){return false;}
  };

  window.ktOpenContentApprovalAdmin=async function(){
    ensureStyle();
    var k=ownerKey();
    if(!k)return false;
    if(window.showSheet)showSheet('📣 광고·동영상 승인','<div id="ktAdminContentQueue" class="kt-admin-requests"><div class="rowbox">승인 요청을 불러오는 중...</div></div>');
    try{
      var rows=await rpc('ktalk_admin_content_requests',{p_owner_key:k});
      rows=Array.isArray(rows)?rows:[];
      var box=document.getElementById('ktAdminContentQueue');
      if(!box)return false;
      var pending=rows.filter(function(x){return x.status==='pending';});
      if(!pending.length){box.innerHTML='<div class="rowbox"><b>대기 중인 승인 요청이 없습니다.</b></div>';return false;}
      box.innerHTML=pending.map(function(x){
        var kind=x.request_type==='ad'?'📣 광고':'🎬 동영상';
        return '<div class="kt-admin-request">'
          +'<b>'+kind+' · '+esc(x.requester_name||'K-Talk 회원')+'</b>'
          +'<small><strong>'+esc(x.title||'')+'</strong><br>'+esc(x.details||'')+'</small>'
          +'<div class="actions">'
            +'<button class="approve" onclick="ktReviewContentRequest(\''+esc(x.id)+'\',\'approved\')">✅ 수락</button>'
            +'<button class="reject" onclick="ktReviewContentRequest(\''+esc(x.id)+'\',\'rejected\')">✕ 거절</button>'
          +'</div>'
        +'</div>';
      }).join('');
    }catch(e){
      var box=document.getElementById('ktAdminContentQueue');
      if(box)box.innerHTML='<div class="rowbox">승인 요청을 불러오지 못했습니다.</div>';
    }
    return false;
  };

  window.ktReviewContentRequest=async function(id,action){
    var k=ownerKey();
    if(!k)return false;
    try{
      await rpc('ktalk_review_content_request',{p_owner_key:k,p_request_id:id,p_action:action});
      await window.ktOpenContentApprovalAdmin();
    }catch(e){alert('처리하지 못했습니다. 다시 눌러 주세요.');}
    return false;
  };

  var oldAd=window.openAd;
  window.openAd=function(){return window.ktOpenContentRequest('ad');};

  function wrapUploads(){
    if(typeof window.postStoredVideo==='function'&&!window.postStoredVideo.__ktApprovalWrapped){
      var oldStored=window.postStoredVideo;
      var s=async function(){
        if(!isOwner()){
          var ok=await window.ktHasVideoUploadApproval();
          if(!ok){window.ktOpenContentRequest('video');return false;}
        }
        return oldStored.apply(this,arguments);
      };
      s.__ktApprovalWrapped=true;
      window.postStoredVideo=s;
    }
    if(typeof window.postCreatorRecording==='function'&&!window.postCreatorRecording.__ktApprovalWrapped){
      var oldPost=window.postCreatorRecording;
      var p=async function(){
        if(!isOwner()){
          var ok=await window.ktHasVideoUploadApproval();
          if(!ok){window.ktOpenContentRequest('video');return false;}
        }
        return oldPost.apply(this,arguments);
      };
      p.__ktApprovalWrapped=true;
      window.postCreatorRecording=p;
    }
  }

  wrapUploads();
  [100,300,700,1400,2600].forEach(function(ms){setTimeout(wrapUploads,ms);});
})();