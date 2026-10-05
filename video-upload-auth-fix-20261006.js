/* K-Talk 2026-10-06 — video upload auth repair only.
   Fixes stale Supabase legacy JWT on public video upload.
   No live room, guest, gift, chat, earnings or layout changes. */
(function(){
  if(window.__ktVideoUploadAuthFix20261006)return;
  window.__ktVideoUploadAuthFix20261006=true;

  var originalFetch=window.fetch.bind(window);
  var keyPromise=null;

  function currentPublishableKey(){
    if(keyPromise)return keyPromise;
    keyPromise=(async function(){
      try{
        var scripts=[].slice.call(document.scripts||[]);
        var src='';
        for(var i=0;i<scripts.length;i++){
          var s=String(scripts[i].src||'');
          if(s.indexOf('direct-realtime-webrtc-20260922.js')>-1){src=s;break;}
        }
        if(!src)src='/direct-realtime-webrtc-20260922.js';
        var r=await originalFetch(src,{cache:'no-store'});
        if(!r.ok)return '';
        var t=await r.text();
        var m=t.match(/sb_publishable_[A-Za-z0-9_-]+/);
        return m?m[0]:'';
      }catch(e){return '';}
    })();
    return keyPromise;
  }

  function isVideoUploadRequest(url,method){
    url=String(url||'');
    method=String(method||'GET').toUpperCase();
    if(method!=='POST')return false;
    return url.indexOf('zupwbfmacwzexyvznlzq.supabase.co/storage/v1/object/ktalk-videos/')>-1
      || url.indexOf('zupwbfmacwzexyvznlzq.supabase.co/rest/v1/ktalk_videos')>-1;
  }

  window.fetch=async function(input,init){
    var url=typeof input==='string'?input:(input&&input.url)||'';
    var method=(init&&init.method)||(input&&input.method)||'GET';
    if(!isVideoUploadRequest(url,method)){
      return originalFetch(input,init);
    }

    var key=await currentPublishableKey();
    if(!key)return originalFetch(input,init);

    var next=Object.assign({},init||{});
    var h=new Headers((init&&init.headers)||(input&&input.headers)||{});
    h.set('apikey',key);
    h.delete('Authorization');
    next.headers=h;

    return originalFetch(input,next);
  };
})();
