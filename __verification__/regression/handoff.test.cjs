const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync(__dirname+'/../../instant-first-frame-five-rooms-20261006.js','utf8');
function stream(id){return{id,getVideoTracks:()=>[{readyState:'live'}]};}
function video(s){return{srcObject:s,readyState:2,getBoundingClientRect:()=>({width:300,height:200}),play:()=>Promise.resolve()};}
function fixture(id){let host=id,v=video(stream(id)),intervals=[],timeouts=[];const w={__ktRemoteHostId:id,__ktPageNavigationEpoch20261013:0,addEventListener(){}};
const root={getAttribute:()=>host,querySelectorAll:()=>[v]};w.ktEnterRemoteLive=function(next){host=next;w.__ktRemoteHostId=next;v=video(null);return true;};const doc={querySelector:()=>root,getElementById:()=>({}),documentElement:{classList:{contains:()=>true}}};
vm.runInNewContext(source,{window:w,document:doc,Date,Promise,Object,setInterval:f=>intervals.push(f),clearInterval(){},setTimeout:f=>timeouts.push(f),MutationObserver:class{observe(){}}});intervals[0]();return{w,get v(){return v;},timeouts};}
(async()=>{let x=fixture('A');x.w.__ktEntryHostStream20260925=stream('A');await x.w.ktEnterRemoteLive('B');await Promise.resolve();for(const f of x.timeouts)f();assert.equal(x.v.srcObject,null,'A must never paint on B');
x=fixture('A');await x.w.ktEnterRemoteLive('A');await Promise.resolve();for(const f of x.timeouts)f();assert.equal(x.v.srcObject.id,'A','same selected host may reuse live frame');
x=fixture('A');await x.w.ktEnterRemoteLive('A');await Promise.resolve();await x.w.ktEnterRemoteLive('B');for(const f of x.timeouts)f();assert.equal(x.v.srcObject,null,'late A handoff cannot replace B');
console.log('PASS: no cross-host cached frame, same-host frame handoff, late handoff cancellation');})().catch(e=>{console.error(e);process.exitCode=1;});

