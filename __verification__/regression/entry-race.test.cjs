const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync(__dirname+'/../../live-peer-fallback-20260921.js','utf8');
const begin=source.indexOf('  window.ktEnterRemoteLive=async'),end=source.indexOf('  window.ktCloseRemoteFallbackInApp20260923',begin);
const current=source.slice(source.indexOf('  function entryCurrent('),source.indexOf('\n',source.indexOf('  function entryCurrent(')));
function deferred(){let resolve;return {promise:new Promise(r=>resolve=r),resolve:v=>resolve(v)};}
function fixture(beacon){const renders=[],timers=[],unavailable=[];const w={__ktPageNavigationEpoch20261013:0,ktStopPageMedia(){},ktBeginLiveEntryFeedback20261013(){},ktLiveEntryUnavailable20261013:id=>unavailable.push(id),dispatchEvent(){}};
const c={window:w,entryEpoch:0,enterBusy:false,viewer:null,remoteEndHost:'',remoteEndMisses:0,remoteEndArmed:false,beaconRoom:beacon,renderRemote:r=>{renders.push(r.host_id);return true;},closeViewer(){c.viewer=null;},enterMemory:async()=>{c.memoryCalls++;return true;},memoryCalls:0,document:{querySelector:()=>null},sessionStorage:{setItem(){}},CustomEvent:function(){},setTimeout:fn=>timers.push(fn),Date};
vm.runInNewContext(current+'\n'+source.slice(begin,end),c);return {w,c,renders,timers,unavailable,enter:id=>w.ktEnterRemoteLive(id)};}
(async()=>{
 let calls=0,x=fixture(async()=>{calls++;return null;});x.w.__ktLiveEntryRooms20261011={at:Date.now(),rooms:{A:{host_id:'A'}}};assert.equal(await x.enter('A'),true);assert.deepEqual(x.renders,['A']);assert.equal(calls,0);
 const a=deferred();x=fixture(id=>id==='A'?a.promise:Promise.resolve({host_id:id}));const first=x.enter('A');await x.enter('B');a.resolve({host_id:'A'});assert.equal(await first,false);assert.deepEqual(x.renders,['B'],'late A must not replace B');
 const p=deferred();x=fixture(()=>p.promise);const pending=x.enter('A');x.w.__ktPageNavigationEpoch20261013++;p.resolve({host_id:'A'});assert.equal(await pending,false);assert.deepEqual(x.renders,[],'navigation cancels delayed entry');
 x=fixture(async()=>null);x.w.__ktLastLiveRoom={host_id:'A'};assert.equal(await x.enter('A'),false);assert.deepEqual(x.renders,[],'unvalidated historical room must not render');assert.deepEqual(x.unavailable,['A']);
 x=fixture(async()=>({host_id:'A'}));await x.enter('A');x.w.__ktRemoteHostId='';for(const fn of x.timers)await fn();assert.equal(x.c.memoryCalls,0,'delayed fallback cannot re-enter after leaving');
 calls=0;x=fixture(async()=>{calls++;return null;});x.w.__ktLiveEntryRooms20261011={at:Date.now()-6000,rooms:{A:{host_id:'A'}}};assert.equal(await x.enter('A'),false);assert.equal(calls,1,'stale metadata must revalidate');
 console.log('PASS: fresh fast entry, A/B race, navigation cancellation, stale room rejection, delayed fallback cancellation, metadata revalidation');
})().catch(e=>{console.error(e);process.exitCode=1;});

