const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync(__dirname+'/../../direct-realtime-webrtc-20260922.js','utf8');
const start=source.indexOf('  function ktStartRemoteHostVideoNow20261003('),end=source.indexOf('  window.ktStartRemoteHostVideoNow20261003=',start);
const old={getVideoTracks:()=>[{readyState:'live'}]},attached=[];
const c={window:{__ktRemoteHostStream:old,__ktLastApprovedGuestHostStream:old,__ktEntryHostStream20260925:old},activeHostId:'A',remoteHostId:()=> 'B',lastRemoteHost:'A',viewerWatchToken:'',viewerConnected:false,lastWatchAt:0,document:{querySelector:()=>null},sid:()=> 'watch',connect:id=>{c.activeHostId=id;},ensureViewerWatch(){},clearViewerConnectTimer(){},attachRemoteStreamNow:s=>attached.push(s||c.window.__ktRemoteHostStream),setTimeout(){},Date};
const fn=vm.runInNewContext('(function(){'+source.slice(start,end)+';return ktStartRemoteHostVideoNow20261003;})()',c);
assert.equal(fn('B',old),true);assert.equal(c.window.__ktRemoteHostStream,null);assert.ok(attached.every(x=>x!==old),'old member frame must not attach on new member');
const marker='var pc=new RTCPeerConnection(rtcConfig());viewerPc=pc;';const onStart=source.indexOf('    pc.ontrack=function(ev){',source.indexOf(marker));const onEnd=source.indexOf('    pc.onicecandidate=',onStart);
const callbackSource=source.slice(onStart,onEnd).replace('    pc.ontrack=','');let closed=false,painted=false;const pc={};
const guard={pc,viewerPc:{},viewerSession:'new',session:'old',remoteHostId:()=> 'B',hid:'A',closePc:()=>{closed=true;},window:{},showRemoteStream:()=>{painted=true;}};
const callback=vm.runInNewContext('('+callbackSource.trim().replace(/;$/,'')+')',guard);callback({});assert.equal(closed,true);assert.equal(painted,false);
console.log('PASS: cross-host direct cache cleared; late old-peer track ignored');

