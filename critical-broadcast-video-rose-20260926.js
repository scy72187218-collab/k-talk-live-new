/* K-Talk critical tap recovery for broadcast / public video / rose (2026-09-26).
   Only these controls are repaired. No layout, transport, room, chat, or gift logic changes. */
(function(){
  if(window.__ktCriticalBroadcastVideoRose20260926)return;
  window.__ktCriticalBroadcastVideoRose20260926=true;

  var selector=[
    '.plus',
    '.kt-bottom .livebtn',
    '[onclick*="quickStartBroadcast"]',
    '.kt-public-video',
    '.video-home video',
    '#homeVideo',
    '#ktPublicFirstPaintVideo',
    '.vh-actions',
    '.vh-actions button',
    '.kt-feed-final-rose',
    '.kt-feed-one-rose'
  ].join(',');

  function enable(el){
    if(!el)return;
    try{
      if(el.disabled)el.disabled=false;
      el.removeAttribute('disabled');
      if(el.getAttribute('aria-disabled')==='true')el.setAttribute('aria-disabled','false');
      if(el.hasAttribute('inert'))el.removeAttribute('inert');
      el.style.setProperty('pointer-events','auto','important');
      el.style.setProperty('touch-action','manipulation','important');
      el.style.setProperty('-webkit-tap-highlight-color','transparent','important');
    }catch(e){}
  }

  function repair(){
    try{document.querySelectorAll(selector).forEach(enable);}catch(e){}
  }

  function videoToggle(v){
    if(!v||String(v.tagName).toUpperCase()!=='VIDEO')return false;
    try{
      if(v.paused||v.ended){
        var p=v.play();
        if(p&&p.catch)p.catch(function(){});
      }else{
        v.pause();
      }
      return true;
    }catch(e){return false;}
  }

  function roseId(btn){
    try{
      var box=btn.closest('.vh-actions');
      var sec=btn.closest('section');
      var id=String(box&&box.dataset&&box.dataset.ktFeedVideoId||'');
      if(!id&&sec)id=String(sec.getAttribute('data-kt-feed-video-id')||'');
      if(!id){
        var oc=String(btn.getAttribute('onclick')||'');
        var m=oc.match(/ktPublicSendRose\(\s*['"]([^'"]+)['"]/);
        if(m)id=m[1];
      }
      return id;
    }catch(e){return '';}
  }

  function author(btn){
    try{
      var sec=btn.closest('section');
      var b=sec&&sec.querySelector('.vh-title b');
      return String(b&&b.textContent||'동영상 게시자').replace(/^\s*♛\s*/,'').trim()||'동영상 게시자';
    }catch(e){return '동영상 게시자';}
  }

  var lastEl=null,lastAt=0;
  function activate(e){
    var t=e.target&&e.target.closest?e.target.closest(selector):null;
    if(!t)return;

    var now=Date.now();
    if(lastEl===t&&now-lastAt<350)return;

    var handled=false;

    try{
      if(t.matches('.plus,.kt-bottom .livebtn,[onclick*="quickStartBroadcast"]')){
        if(typeof window.quickStartBroadcast==='function'){
          window.quickStartBroadcast(e);
          handled=true;
        }else if(typeof window.openCreator==='function'){
          window.openCreator();
          handled=true;
        }
      }else if(t.matches('.kt-feed-final-rose,.kt-feed-one-rose')){
        var id=roseId(t);
        if(id&&typeof window.ktPublicSendRose==='function'){
          window.ktPublicSendRose(id,author(t),t);
          handled=true;
        }
      }else if(String(t.tagName).toUpperCase()==='VIDEO'){
        handled=videoToggle(t);
      }
    }catch(x){}

    if(handled){
      lastEl=t;lastAt=now;
      try{
        e.preventDefault();
        e.stopPropagation();
        if(e.stopImmediatePropagation)e.stopImmediatePropagation();
      }catch(x){}
    }
  }

  repair();
  [50,150,350,800,1500,2600].forEach(function(ms){setTimeout(repair,ms);});
  window.addEventListener('pageshow',repair);
  window.addEventListener('focus',repair);
  window.addEventListener('pointerdown',activate,true);
  if(!window.PointerEvent)window.addEventListener('touchstart',activate,true);

  try{
    new MutationObserver(function(records){
      records.forEach(function(r){
        [].slice.call(r.addedNodes||[]).forEach(function(n){
          if(!n||n.nodeType!==1)return;
          try{if(n.matches&&n.matches(selector))enable(n);}catch(e){}
          try{if(n.querySelectorAll)n.querySelectorAll(selector).forEach(enable);}catch(e){}
        });
      });
    }).observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();
