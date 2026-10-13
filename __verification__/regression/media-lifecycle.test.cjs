const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const source=fs.readFileSync(__dirname+'/../../page-media-lifecycle-20261013.js','utf8');
class Media{constructor(tag='AUDIO'){this.tagName=tag;this.id='';this.paused=true;this.isConnected=true;this.calls=0;this.muted=false;}pause(){this.paused=true;}play(){this.calls++;if(this.defer)return new Promise(r=>{this.finish=()=>{this.paused=false;r();};});this.paused=false;return Promise.resolve();}getBoundingClientRect(){return {width:300,height:200};}}
const docEvents={},winEvents={},dom=[];let observer;
const w={addEventListener:(k,f)=>winEvents[k]=f,friends(){},state:{stream:{}},ktStopSoundPreview(){throw Error('must not send song controls when no preview is playing');}};
const doc={hidden:false,querySelectorAll:()=>dom,getElementById:()=>({}),documentElement:{},addEventListener:(k,f)=>docEvents[k]=f};
vm.runInNewContext(source,{window:w,document:doc,HTMLMediaElement:Media,MutationObserver:class{constructor(f){observer=f;}observe(){}},setInterval(){},DOMException,Promise,Set,WeakSet,Object,Number});
(async()=>{
 const song=new Media();dom.push(song);await song.play();assert.equal(song.paused,false);w.friends();assert.equal(song.paused,true);await assert.rejects(song.play(),e=>e.name==='AbortError');
 const detached=new Media();detached.isConnected=false;await detached.play();w.ktStopPageMedia();assert.equal(detached.paused,true);await assert.rejects(detached.play(),e=>e.name==='AbortError');
 const delayed=new Media();delayed.defer=true;const waiting=delayed.play();w.friends();delayed.finish();await waiting;assert.equal(delayed.paused,true,'late play promise cannot resurrect sound');
 const camera=new Media('VIDEO');camera.srcObject=w.state.stream;dom.push(camera);await camera.play();w.friends();assert.equal(camera.paused,false,'local capture playback preserved');
 const remote=new Media('VIDEO');remote.srcObject={};remote.muted=true;dom.push(remote);await remote.play();w.ktStopPageMedia();assert.equal(remote.paused,false,'muted live frame preserved');
 const nextSong=new Media();await nextSong.play();assert.equal(nextSong.paused,false,'new page can deliberately play new media');
 const epoch=w.__ktPageNavigationEpoch20261013;doc.hidden=true;docEvents.visibilitychange();assert.equal(nextSong.paused,true);assert.equal(w.__ktPageNavigationEpoch20261013,epoch,'backgrounding does not cancel live negotiation');await assert.rejects(new Media().play(),e=>e.name==='AbortError');
 console.log('PASS: navigation stop, detached audio, delayed playback suppression, retired-player block, capture preservation, muted live preservation, new playback, hidden audio stop');
})().catch(e=>{console.error(e);process.exitCode=1;});

