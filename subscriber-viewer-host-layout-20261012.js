/* Subscriber viewers reuse the host template; signaling and guest controls stay owned by their existing modules. */
(function(){
  if(window.__ktSubscriberViewerHostLayout20261012)return;
  window.__ktSubscriberViewerHostLayout20261012=true;
  function sync(){
    var root=document.querySelector('#screen .kt-remote-live');
    if(!root||root.getAttribute('data-kt-room-type')!=='subscriber')return;
    if(root.querySelector('[data-kt-subscriber-viewer="1"]'))return;
    var build=window.ktBuildSubscriberViewerTemplate20261012;
    var video=root.querySelector('#ktRemoteLiveVideo');
    if(typeof build!=='function'||!video)return;
    var template=build(),room=template.querySelector('.ktsubscriber-room');
    var style=template.querySelector('#ktSubscriberApprovedStyle');
    if(!room||!style)return;
    // A viewer must not match the host-role selector used by media publishers.
    room.classList.replace('ktsubscriber-room','kt-subscriber-viewer-room');
    room.setAttribute('data-kt-subscriber-viewer','1');
    style.id='ktSubscriberViewerTemplateStyle20261012';
    style.textContent=style.textContent.replace(/\.ktsubscriber-room/g,'.kt-subscriber-viewer-room');
    style.textContent+=' .kt-remote-live .kt-subscriber-viewer-room{height:calc(100dvh - 78px);padding-bottom:4px}.kt-remote-live:has([data-kt-subscriber-viewer="1"])>.kt-remote-top{display:none!important}.kt-remote-live .ktsubscriber-host #ktRemoteLiveVideo{position:absolute!important;inset:0!important;width:100%!important;height:100%!important;object-fit:cover!important;transform:none!important}.kt-remote-live:has([data-kt-subscriber-viewer="1"])>.kt-remote-status{top:48%;pointer-events:none}';
    room.querySelectorAll('.ktsubscriber-tools,.ktsubscriber-info,.ktsubscriber-gifts').forEach(function(el){el.remove();});
    var placeholder=room.querySelector('#ktLiveVideo');
    if(!placeholder)return;
    placeholder.replaceWith(video);
    var back=room.querySelector('.ktsubscriber-back');
    if(back)back.setAttribute('onclick','if(window.ktLeaveRemoteLive)ktLeaveRemoteLive()');
    var oldStyle=root.querySelector('#ktSubscriberViewerTemplateStyle20261012');
    if(oldStyle)oldStyle.remove();
    root.prepend(style,room);
  }
  var queued=false;
  function schedule(){if(queued)return;queued=true;setTimeout(function(){queued=false;sync();},0);}
  new MutationObserver(schedule).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});
  ['kt-remote-host-selected','kt-approved-guest-stream-ready'].forEach(function(name){window.addEventListener(name,schedule);});
  setInterval(sync,500);
  schedule();
})();