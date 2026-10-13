const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const s=fs.readFileSync(__dirname+'/../../all-switches-runtime-final-20261002.js','utf8');
let writes=0,observer;const values=new Map(),priorities=new Map();
function canonical(k,v){return k==='-webkit-tap-highlight-color'&&v==='transparent'?'rgba(0, 0, 0, 0)':v;}
const el={disabled:false,getAttribute:()=>null,style:{getPropertyValue:k=>values.get(k)||'',getPropertyPriority:k=>priorities.get(k)||'',setProperty(k,v,p){writes++;values.set(k,canonical(k,v));priorities.set(k,p);}}};
const ctx={window:{addEventListener(){}},document:{createElement:()=>{const map=new Map();return{style:{setProperty:(k,v)=>map.set(k,canonical(k,v)),getPropertyValue:k=>map.get(k)||''}};},querySelectorAll:()=>[el],getElementById:()=>null,addEventListener(){},documentElement:{}},localStorage:{getItem:()=> '1'},MutationObserver:class{constructor(f){observer=f;}observe(){}},setTimeout:f=>{f();return 1;},clearTimeout(){},setInterval(){}};
vm.runInNewContext(s,ctx);assert.equal(writes,4,'only initial properties should be written');for(let i=0;i<20;i++)observer();assert.equal(writes,4,'observer must not trigger repeated identical style mutations');
console.log('PASS: switch enable pass is idempotent; no repeated style mutation loop');

