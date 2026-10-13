/* Entry feedback is visible until a real selected-host video frame is decoded. */
(function(){
  'use strict';
  if(window.__ktLiveEntryFeedback20261013)return;
  window.__ktLiveEntryFeedback20261013=true;
  var active=null,sequence=0;
  function remove(){
    if(active){clearTimeout(active.timer);clearInterval(active.poll);}
    var old=document.getElementById('ktLiveEntryFeedback20261013');if(old)old.remove();
    active=null;
  }
  function selectedHost(){return String(window.__ktRemoteHostId||window.__ktCurrentRemoteHostId||'');}
  function check(){
    if(!active)return;
    if(active.nav!==Number(window.__ktPageNavigationEpoch20261013||0)){remove();return;}
    var root=document.querySelector('#screen .kt-remote-live');
    if(!root||root.getAttribute('data-kt-host-id')!==active.id)return;
    var videos=root.querySelectorAll('video');
    for(var i=0;i<videos.length;i++){
      var v=videos[i];
      if(v.readyState>=2&&v.videoWidth>0&&!v.paused&&!v.error){
        var host=v.id==='ktRemoteLiveVideo'||v.id==='ktRemoteHostPreview'||v.closest('.ktg13-host,.ktg9-host,.ktsubscriber-host,.ktsecret-slot.host,.kgh-cell.host,.kt-approved-guest-cell.host');
        if(host){remove();return;}
      }
    }
  }
  function begin(id,room){
    remove();
    id=String(id||'');if(!id)return;
    var pane=document.createElement('div');pane.id='ktLiveEntryFeedback20261013';
    pane.style.cssText='position:fixed;inset:0 0 82px;z-index:90;display:grid;place-items:center;padding:24px;background:radial-gradient(ellipse at 50% 35%,#43254e,#151424 65%);color:#fff;font-family:system-ui;box-sizing:border-box';
    var card=document.createElement('section');card.style.cssText='width:min(100%,420px);padding:28px;border:1px solid #ffffff30;border-radius:24px;background:#15111dcc;text-align:center;box-sizing:border-box';
    var title=document.createElement('h2');title.textContent=String(room&&room.host_name||'K-Talk LIVE');title.style.margin='0 0 14px';
    var status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');status.textContent='방송 영상을 연결하고 있습니다…';
    var controls=document.createElement('div');controls.style.cssText='display:flex;justify-content:center;gap:10px;margin-top:20px';
    function button(label,fn){var b=document.createElement('button');b.type='button';b.textContent=label;b.style.cssText='padding:12px 16px;border:1px solid #ffffff45;border-radius:12px;background:#34233e;color:white;font:inherit';b.onclick=fn;return b;}
    controls.appendChild(button('다시 연결',function(){
      var idNow=active&&active.id;if(!idNow)return;
      if(typeof window.ktEnterRemoteLive==='function')Promise.resolve(window.ktEnterRemoteLive(idNow)).catch(function(){if(active)active.status.textContent='방송을 연결하지 못했습니다. 다시 연결하거나 목록으로 돌아가 주세요.';});
    }));
    controls.appendChild(button('목록으로',function(){
      remove();
      if(typeof window.ktLeaveRemoteLive==='function')Promise.resolve(window.ktLeaveRemoteLive()).catch(function(){if(typeof window.friends==='function')window.friends();});
      else if(typeof window.friends==='function')window.friends();
    }));
    card.appendChild(title);card.appendChild(status);card.appendChild(controls);pane.appendChild(card);document.body.appendChild(pane);
    var state={id:id,nav:Number(window.__ktPageNavigationEpoch20261013||0),seq:++sequence,status:status};
    active=state;
    state.timer=setTimeout(function(){if(active===state)status.textContent='연결이 늦어지고 있습니다. 다시 연결하거나 목록으로 돌아갈 수 있습니다.';},8000);
    state.poll=setInterval(check,200);check();
  }
  window.ktBeginLiveEntryFeedback20261013=begin;
  window.ktCancelLiveEntryFeedback20261013=remove;
  window.ktLiveEntryUnavailable20261013=function(id){
    if(active&&active.id===String(id))active.status.textContent='방송 상태를 확인하지 못했습니다. 다시 연결하거나 목록으로 돌아가 주세요.';
  };
  document.addEventListener('playing',check,true);
  document.addEventListener('loadeddata',check,true);
  window.addEventListener('pagehide',remove);
  var screen=document.getElementById('screen');
  if(screen)new MutationObserver(check).observe(screen,{childList:true,subtree:true});
})();