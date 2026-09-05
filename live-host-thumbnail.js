/* K-Talk LIVE: publish a small host camera thumbnail while broadcasting. No room layout changes. */
(function(){
  if(window.__ktLiveHostThumbnailLoaded)return;
  window.__ktLiveHostThumbnailLoaded=true;
  window.__ktManualLiveEntryOnly=true;

  var SB='https://zupwbfmacwzexyvznlzq.supabase.co';
  var KEY='sb_publishable_AnyCMi4rAgSR2uWg_u1pvw_hHyqWlm3';
  var lastPhoto='';
  var busy=false;

  function headers(extra){
    var h={apikey:KEY,Authorization:'Bearer '+KEY};
    if(extra)Object.keys(extra).forEach(function(k){h[k]=extra[k];});
    return h;
  }

  function who(){
    var id='guest',name='K-Talk';
    try{
      id=state.profileId||state.currentAccountId||state.accountId||id;
      name=state.profileName||state.currentProfileName||state.accountName||name;
    }catch(e){}
    try{
      id=localStorage.getItem('ktalk_active_account')||localStorage.getItem('ktalk_profile_id')||id;
      name=localStorage.getItem('ktalk_profile_name')||localStorage.getItem('ktalk_active_account_name')||name;
      var sub=localStorage.getItem('ktalk_sub_account')||'';
      if(sub){
        var raw=localStorage.getItem('ktalk_profile_v1:sub:'+sub);
        if(raw){
          var p=JSON.parse(raw);
          if(p&&p.name)name=String(p.name);
        }else if(window.ktSubAccountInfo){
          var si=ktSubAccountInfo(sub);if(si&&si.name)name=String(si.name);
        }
      }
    }catch(e){}
    return {id:String(id||'guest').slice(0,80),name:String(name||'K-Talk').slice(0,80)};
  }

  function liveVideo(){
    return document.getElementById('ktLiveVideo')||document.querySelector('#ktSept2Live video')||document.getElementById('camera')||null;
  }

  function capture(){
    var v=liveVideo();
    if(!v||!v.videoWidth||!v.videoHeight||v.readyState<2)return '';
    try{
      var c=document.createElement('canvas');
      c.width=120;c.height=160;
      var ctx=c.getContext('2d');
      if(!ctx)return '';
      var sw=v.videoWidth,sh=v.videoHeight;
      var target=c.width/c.height,src=sw/sh;
      var sx=0,sy=0,sww=sw,shh=sh;
      if(src>target){sww=sh*target;sx=(sw-sww)/2;}
      else{shh=sw/target;sy=(sh-shh)/2;}
      ctx.save();ctx.translate(c.width,0);ctx.scale(-1,1);
      ctx.drawImage(v,sx,sy,sww,shh,0,0,c.width,c.height);
      ctx.restore();
      return c.toDataURL('image/jpeg',0.46);
    }catch(e){return '';}
  }

  async function currentRoom(me){
    try{
      var u=SB+'/rest/v1/ktalk_live_rooms?select=id,host_id,host_name&active=eq.true&order=updated_at.desc&limit=8';
      var r=await fetch(u,{headers:headers(),cache:'no-store'});
      if(!r.ok)return null;
      var a=await r.json();
      if(!Array.isArray(a)||!a.length)return null;
      return a.find(function(x){return String(x.host_id||'')===me.id;})
        ||a.find(function(x){return String(x.host_id||'')==='guest';})
        ||a[0];
    }catch(e){return null;}
  }

  async function publish(){
    if(busy||!document.getElementById('ktSept2Live'))return;
    var photo=capture();
    if(!photo||photo===lastPhoto)return;
    busy=true;
    try{
      var me=who();
      var row=await currentRoom(me);
      if(!row||!row.id){busy=false;return;}
      var r=await fetch(SB+'/rest/v1/ktalk_live_rooms?id=eq.'+encodeURIComponent(row.id),{
        method:'PATCH',
        headers:headers({'Content-Type':'application/json','Prefer':'return=minimal'}),
        body:JSON.stringify({host_name:me.name,host_photo:photo})
      });
      if(r.ok)lastPhoto=photo;
    }catch(e){}
    busy=false;
  }

  setTimeout(publish,1800);
  setInterval(publish,15000);
  try{new MutationObserver(function(){setTimeout(publish,700);}).observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
})();
