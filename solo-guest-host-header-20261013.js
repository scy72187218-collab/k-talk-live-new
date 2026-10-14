/* Solo guest header from host markup; never replaces video or chat. */
(function(){
 if(window.__ktSoloGuestHostHeader20261013)return;window.__ktSoloGuestHostHeader20261013=true;
 function esc(v){return String(v||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
 function install(){
 var root=document.querySelector('#screen .kt-remote-live');if(!root)return;
 var kind=root.getAttribute('data-kt-room-type')||'',name=root.getAttribute('data-kt-room-name')||'';
 if(kind!=='solo'&&!(/^(?:general|group)?$/.test(kind)&&/1\s*인/.test(name)))return;
 if(root.querySelector(':scope > .kt-solo-guest-header'))return;
 if(!window.ktCreateSharedRoomActions20261013||!window.ktCreateSharedRoomStats20261013)return;
 var room=window.__ktLastLiveRoom||{},start=String(room.host_id||'')===String(root.getAttribute('data-kt-host-id')||'')?Date.parse(room.started_at||''):NaN;
 var clock='00:00:00',pane=document.createElement('section');pane.className='kt-solo-guest-header';
 pane.innerHTML='<div class="ktsgv-head"><div class="kt-host-unified-column"><div class="ktsgv-left"><button class="ktsgv-back" onclick="if(window.ktLeaveRemoteLive)ktLeaveRemoteLive()">‹</button><div class="ktsgv-title"><i>●</i> 1인 방송</div></div><div class="ktsgv-air"><span class="on">● ON AIR</span><span data-solo-viewer-clock>'+esc(clock)+'</span></div></div><div class="ktsgv-brand">K-Talk LIVE</div></div>'+'<div class="ktsgv-led"><div class="ktsgv-led-track"><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span><span>💗 ✨ <b>K-Talk LIVE</b> 환영합니다 ✨ 💗</span></div></div>';
 var row=window.ktCreateSharedRoomStats20261013();var viewerNumber=row.querySelector('.kt-room-viewers-copy b');if(viewerNumber)viewerNumber.textContent='0';pane.appendChild(row);
 var actions=window.ktCreateSharedRoomActions20261013();pane.appendChild(actions);
 var buttons=actions.querySelectorAll('button');
 buttons[0].onclick=function(){if(window.ktLeaveRemoteLive)window.ktLeaveRemoteLive();};
 buttons[1].onclick=function(){if(window.openTreasure)window.openTreasure();else if(window.openTreasureBox)window.openTreasureBox();};
 buttons[2].onclick=function(){if(window.openMatch)window.openMatch();else if(window.openMatchArena)window.openMatchArena('1대1');};
 var count=root.querySelector('#ktRemoteViewerCount');if(count){count.hidden=true;pane.appendChild(count);}
 root.querySelectorAll(':scope > .kt-remote-top,:scope > #ktRemoteAttendance,:scope > .kt-prejoin-room-led,:scope > .kt-prejoin-room-stats,:scope > .kt-room-stats-copy,:scope > .kt-fresh-three-1111').forEach(function(el){el.remove();});
 if(Number.isFinite(start))pane.setAttribute('data-start',String(start));
 root.insertBefore(pane,root.firstChild);root.setAttribute('data-kt-solo-guest-header','1');
 }
 var st=document.createElement('style');st.textContent=`
 #screen .kt-remote-live[data-kt-solo-guest-header]{display:flex!important;flex-direction:column!important;padding:4px 7px 65px!important;gap:4px!important}
 .kt-solo-guest-header{position:relative;z-index:30;flex:none;color:#fff}
 .ktsgv-head{height:64px;border-radius:16px;padding:5px 10px;background:linear-gradient(#17171a,#0d0d10);display:flex;justify-content:space-between;align-items:center}
 .ktsgv-left,.ktsgv-air{display:flex;align-items:center;gap:7px}.ktsgv-title{font-size:18px;font-weight:950}.ktsgv-back{background:#111;border:1px solid #ffffff35;border-radius:50%;color:white;font-size:24px}.ktsgv-brand,.ktsgv-air .on{color:#ff3d78;font-weight:950}.ktsgv-air{margin-top:6px;font-weight:900;font-size:13px}
 .ktsgv-led{height:52px;margin:4px 0;border:2px solid #ff28c4;border-radius:22px;background:#120712 radial-gradient(circle,#ff35ce 2px,transparent 2.7px);background-size:13px 13px;overflow:hidden;position:relative;box-shadow:0 0 9px #ff28c4}
 .ktsgv-led-track{position:absolute;display:flex;align-items:center;height:100%;white-space:nowrap;animation:ktsgvMarquee 12s linear infinite;font-size:22px;font-weight:950;color:#ffd62d}.ktsgv-led-track span{padding-right:80px}.ktsgv-led-track b{color:#ff59c9}@keyframes ktsgvMarquee{from{transform:translateX(45%)}to{transform:translateX(-100%)}}
 #screen .kt-remote-live[data-kt-solo-guest-header] > #ktRemoteLiveVideo{position:relative!important;inset:auto!important;flex:1!important;min-height:0!important;width:100%!important;height:0!important}
 #screen .kt-remote-live[data-kt-solo-guest-header] > :is(.kt-remote-top,#ktRemoteAttendance,.kt-room-stats-copy,.kt-fresh-three-1111,.kt-remote-shade){display:none!important}
 .kt-solo-guest-header .kt-room-stats-copy{margin:4px 0!important}
 `;document.head.appendChild(st);
 var timer;new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(install,60);}).observe(document.getElementById('screen'),{childList:true,subtree:true});
 window.addEventListener('kt-remote-host-selected',install);setInterval(function(){install();var root=document.querySelector('#screen .kt-remote-live[data-kt-solo-guest-header]');if(!root)return;var out=root.querySelector('[data-solo-viewer-clock]'),source=root.querySelector('#ktLiveClock');if(out&&source&&out.textContent!==source.textContent)out.textContent=source.textContent;
 var pane=root.querySelector('.kt-solo-guest-header'),start=Number(pane&&pane.getAttribute('data-start'));if(out&&!source&&start>0){var sec=Math.max(0,Math.floor((Date.now()-start)/1000));out.textContent=[Math.floor(sec/3600),Math.floor(sec/60)%60,sec%60].map(function(n){return String(n).padStart(2,'0');}).join(':');}
 var count=root.querySelector('#ktRemoteViewerCount'),shown=root.querySelector('.kt-room-viewers-copy b');if(count&&shown){var n=String(count.textContent||'').match(/\d+/);shown.textContent=n?n[0]:'0';}},1000);install();
})();