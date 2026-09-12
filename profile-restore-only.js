/* K-Talk 내 프로필 복구 전용. 프로필 이름/소개/사진/링크만 복구하며 다른 화면과 기능은 변경하지 않음. */
(function(){
  if(window.__ktProfileRestoreOnlyInstalled)return;
  window.__ktProfileRestoreOnlyInstalled=true;

  var BASE='https://zupwbfmacwzexyvznlzq.supabase.co/rest/v1/';
  var KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp1cHdiZm1hY3d6ZXh5dnpubHpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODg0NjEwNzYsImV4cCI6MjEwNDAzNzA3Nn0.j9mKhX3f5kaILYhRisyng5SE8xIV06TG89XLXg-rtXo';

  function clean(v){return String(v==null?'':v).trim();}
  function canon(v){
    v=clean(v).replace(/\s+/g,'').toLowerCase();
    if(v==='태권이'||v==='태권1'||v==='k-톡태권'||v==='k톡태권'||v==='k-톡태권1'||v==='k톡태권1')return 'taekwon1';
    if(v==='하이네'||v==='하이네2'||v==='k-톡하이네'||v==='k톡하이네'||v==='k-톡하이네2'||v==='k톡하이네2')return 'haine2';
    return v;
  }
  function currentAccountKey(){
    try{if(typeof window.ktProfileAccountKey==='function'){var k=clean(window.ktProfileAccountKey());if(k)return k;}}catch(e){}
    try{var s=localStorage.getItem('ktalk_sub_account')||'';if(s)return 'sub:'+s;}catch(e){}
    return 'local';
  }
  function currentStorageKey(){
    try{if(typeof window.ktProfileStorageKey==='function'){var k=window.ktProfileStorageKey();if(k)return k;}}catch(e){}
    return 'ktalk_profile_v1:'+currentAccountKey();
  }
  function currentNames(){
    var out=[];
    try{var p=typeof window.ktProfileLoad==='function'?window.ktProfileLoad():null;if(p&&p.name)out.push(p.name);}catch(e){}
    try{var n=localStorage.getItem('ktalk_active_account_name');if(n)out.push(n);}catch(e){}
    try{var s=localStorage.getItem('ktalk_sub_account');if(s)out.push(s);}catch(e){}
    try{if(typeof window.ktCurrentVerifiedAccountName==='function'){var v=window.ktCurrentVerifiedAccountName();if(v)out.push(v);}}catch(e){}
    return out.filter(Boolean);
  }
  function read(key){
    try{return JSON.parse(localStorage.getItem(key)||'{}')||{};}catch(e){return {};}
  }
  function write(key,p){try{localStorage.setItem(key,JSON.stringify(p));}catch(e){}}

  function recoverLocal(){
    var key=currentStorageKey();
    var cur=read(key);
    var wanted=currentNames().map(canon).filter(Boolean);
    var accountCanon=canon(currentAccountKey().replace(/^sub:/,''));
    if(accountCanon)wanted.push(accountCanon);

    var best=null;
    try{
      for(var i=0;i<localStorage.length;i++){
        var k=localStorage.key(i)||'';
        if(k.indexOf('ktalk_profile_v1:')!==0||k===key)continue;
        var p=read(k);
        if(!p||(!p.name&&!p.photo&&!p.bio&&!p.link))continue;
        var c=canon(p.name||k.replace('ktalk_profile_v1:','').replace(/^sub:/,''));
        if(wanted.indexOf(c)>-1){best=p;break;}
      }
    }catch(e){}

    if(best){
      if(!clean(cur.name)&&clean(best.name))cur.name=best.name;
      if(!clean(cur.bio)&&clean(best.bio))cur.bio=best.bio;
      if(!clean(cur.photo)&&clean(best.photo))cur.photo=best.photo;
      if(!clean(cur.link)&&clean(best.link))cur.link=best.link;
      write(key,cur);
    }
    return cur;
  }

  async function recoverRemote(){
    var account=currentAccountKey();
    if(!account)return recoverLocal();
    var cur=recoverLocal();
    try{
      var url=BASE+'ktalk_profiles?account_key=eq.'+encodeURIComponent(account)+'&select=nickname,photo,bio,link&limit=1';
      var r=await fetch(url,{headers:{apikey:KEY,Authorization:'Bearer '+KEY}});
      if(r.ok){
        var rows=await r.json();
        var p=rows&&rows[0];
        if(p){
          if(!clean(cur.name)&&clean(p.nickname))cur.name=p.nickname;
          if(!clean(cur.photo)&&clean(p.photo))cur.photo=p.photo;
          if(!clean(cur.bio)&&clean(p.bio))cur.bio=p.bio;
          if(!clean(cur.link)&&clean(p.link))cur.link=p.link;
          write(currentStorageKey(),cur);
        }
      }
    }catch(e){}
    return cur;
  }

  function refreshVisible(p){
    p=p||recoverLocal();
    try{
      var name=document.getElementById('ktProfileName');if(name&&clean(p.name)&&document.activeElement!==name)name.value=p.name;
      var bio=document.getElementById('ktProfileBio');if(bio&&clean(p.bio)&&document.activeElement!==bio)bio.value=p.bio;
      var link=document.getElementById('ktProfileLink');if(link&&clean(p.link)&&document.activeElement!==link)link.value=p.link;
      document.querySelectorAll('.kt-profile-maininfo>b').forEach(function(el){if(clean(p.name))el.textContent=p.name;});
      var photo=document.querySelector('.kt-my-profile-photo');
      if(photo&&clean(p.photo)){
        var img=photo.querySelector('img');
        if(!img){img=document.createElement('img');img.alt='프로필 사진';photo.insertBefore(img,photo.firstChild);}
        img.src=p.photo;
      }
    }catch(e){}
  }

  async function restore(){var p=await recoverRemote();refreshVisible(p);return p;}
  window.ktRestoreMyProfileOnly=restore;

  function wrap(){
    if(typeof window.openProfileDirect==='function'&&!window.openProfileDirect.__ktProfileRestoreOnly){
      var old=window.openProfileDirect;
      var fn=function(){
        recoverLocal();
        var r=old.apply(this,arguments);
        setTimeout(function(){restore();},60);
        return r;
      };
      fn.__ktProfileRestoreOnly=true;
      window.openProfileDirect=fn;
    }
    if(typeof window.selectKTalkSubAccount==='function'&&!window.selectKTalkSubAccount.__ktProfileRestoreOnly){
      var oldSel=window.selectKTalkSubAccount;
      var sel=function(){var r=oldSel.apply(this,arguments);setTimeout(restore,100);return r;};
      sel.__ktProfileRestoreOnly=true;
      window.selectKTalkSubAccount=sel;
    }
  }

  recoverLocal();
  var n=0,t=setInterval(function(){n++;wrap();if(typeof window.ktProfileLoad==='function'){restore();if(n>12)clearInterval(t);}else if(n>50)clearInterval(t);},120);
  document.addEventListener('visibilitychange',function(){if(document.visibilityState==='visible')restore();});
})();
