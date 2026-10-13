const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync(__dirname+'/../../livekit-sfu-bridge-20260924.js','utf8');
async function run(remote){
  const events={},intervals=[],tokens=[],published=[];
  const stream={getTracks:()=>[{readyState:'live'}],getVideoTracks:()=>[{id:'local-camera',readyState:'live'}],getAudioTracks:()=>[]};
  const candidate={closest:()=>remote?{}:null,getClientRects:()=>[{}],querySelector:()=>null};
  const w={state:{stream},addEventListener:(n,f)=>events[n]=f,dispatchEvent(){},LivekitClient:{Room:class{
    constructor(){this.state='new';this.remoteParticipants=new Map();this.localParticipant={publishTrack:async t=>published.push(t),trackPublications:new Map()};}
    on(){} prepareConnection(){} async connect(){this.state='connected';} async disconnect(){this.state='disconnected';}
  },RoomEvent:{},Track:{Source:{Camera:'camera',Microphone:'microphone'}},LocalVideoTrack:class{constructor(t){this.mediaStreamTrack=t;}}}};
  const doc={querySelectorAll:()=>[candidate],querySelector:()=>candidate,addEventListener(){},getElementById:()=>null,contains:()=>false};
  vm.runInNewContext(source,{window:w,document:doc,localStorage:{getItem:()=> 'local-device',setItem(){}},sessionStorage:{getItem:()=>''},getComputedStyle:()=>({display:'block',visibility:'visible'}),setTimeout:()=>0,clearTimeout(){},setInterval:f=>intervals.push(f),Date,Promise,Object,String,console,CustomEvent:class{},fetch:async url=>{tokens.push(url);return{ok:true,json:async()=>({ok:true,token:'test',url:'wss://test.invalid'})};}});
  if(remote)events['kt-remote-host-selected']({detail:{host_id:'selected-host'}});
  await intervals[0]();return{tokens,published,w};
}
(async()=>{let x=await run(true);assert.equal(x.tokens.length,1);assert.match(x.tokens[0],/room=ktalk_selected-host/);assert.match(x.tokens[0],/identity=viewer_local-device/);assert.equal(x.published.length,0,'viewer must not publish prepared local camera');
  x=await run(false);assert.match(x.tokens[0],/room=ktalk_local-device/);assert.match(x.tokens[0],/identity=local-device/);assert.equal(x.published.length,1,'real host still publishes shared stream');console.log('PASS: shared viewer renderer connects to selected host; local host still publishes');
})().catch(e=>{console.error(e);process.exitCode=1;});
