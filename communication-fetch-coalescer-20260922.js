/* K-Talk communications-only request coalescer (2026-09-22)
   Scope: GET signaling endpoints only. No UI/layout/chat/gift/switch changes. */
(function(){
  if(window.__ktCommFetchCoalescer20260922)return;
  window.__ktCommFetchCoalescer20260922=true;

  var nativeFetch=window.fetch.bind(window);
  var inflight=new Map();
  var TARGETS={
    '/api/live-peer-memory':1,
    '/api/live-beacon-memory':1,
    '/api/live-interaction-memory':1
  };

  function requestKey(input,init){
    try{
      var method=String((init&&init.method)||(input&&input.method)||'GET').toUpperCase();
      if(method!=='GET')return '';
      var raw=typeof input==='string'?input:(input&&input.url)||'';
      var u=new URL(raw,location.href);
      if(!TARGETS[u.pathname])return '';
      u.searchParams.delete('t');
      return method+' '+u.pathname+'?'+u.searchParams.toString();
    }catch(e){return '';}
  }

  window.fetch=function(input,init){
    var key=requestKey(input,init);
    if(!key)return nativeFetch(input,init);

    var active=inflight.get(key);
    if(active){
      return active.then(function(r){return r.clone();});
    }

    var ctrl=typeof AbortController!=='undefined'?new AbortController():null;
    var opts=Object.assign({},init||{});
    var timer=null;
    if(ctrl){
      opts.signal=ctrl.signal;
      timer=setTimeout(function(){try{ctrl.abort();}catch(e){}},2600);
    }

    var p=nativeFetch(input,opts).then(function(r){return r;}).finally(function(){
      if(timer)clearTimeout(timer);
      if(inflight.get(key)===p)inflight.delete(key);
    });
    inflight.set(key,p);
    return p.then(function(r){return r.clone();});
  };
})();