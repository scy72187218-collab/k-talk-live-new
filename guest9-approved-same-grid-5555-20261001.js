/* 9-room approved guest grid follows pre-entry grid size. 5555 */
(function(){
if(window.__g9SameGrid5555)return;window.__g9SameGrid5555=1;
var ratio=0;
function pre(){
  var r=document.querySelector('#screen .kt-remote-live');
  if(!r||r.querySelector('.kt-guest-hostlike-room[data-kt-room="9"]'))return;
  var g=r.querySelector('.kt-prejoin-room-grid,.kt-guest-room-grid,.kt-approved-guest-grid');
  if(!g)return;
  var a=g.getBoundingClientRect();
  if(a.width>180&&a.height>180){
    ratio=a.height/a.width;
    try{sessionStorage.setItem('g9_pre_ratio_5555',String(ratio));}catch(e){}
  }
}
function getRatio(){
  if(ratio>0)return ratio;
  try{ratio=parseFloat(sessionStorage.getItem('g9_pre_ratio_5555')||'0')||0;}catch(e){}
  return ratio;
}
function approved(){
  var g=document.querySelector('#screen .kt-guest-hostlike-room[data-kt-room="9"] .kgh-main');
  if(!g)return;
  var x=getRatio(); if(!(x>0))return;
  var a=g.getBoundingClientRect(); if(a.width<180)return;
  var h=Math.round(a.width*x)+'px';
  g.style.setProperty('display','grid','important');
  g.style.setProperty('grid-template-columns','repeat(3,minmax(0,1fr))','important');
  g.style.setProperty('grid-template-rows','repeat(3,minmax(0,1fr))','important');
  g.style.setProperty('gap','2px','important');
  g.style.setProperty('height',h,'important');
  g.style.setProperty('min-height',h,'important');
  g.style.setProperty('max-height',h,'important');
  g.style.setProperty('flex','0 0 '+h,'important');
}
function run(){pre();approved();}
run();
[50,150,350,700,1200,2200].forEach(function(ms){setTimeout(run,ms);});
['kt-guest-approval-received','kt-any-guest-approved','kt-approved-guest-stream-ready','pageshow','resize'].forEach(function(n){
  window.addEventListener(n,function(){setTimeout(run,30);setTimeout(run,180);});
});
try{new MutationObserver(function(){clearTimeout(window.__g9SameGridT);window.__g9SameGridT=setTimeout(run,40);}).observe(document.getElementById('screen')||document.documentElement,{childList:true,subtree:true});}catch(e){}
})();