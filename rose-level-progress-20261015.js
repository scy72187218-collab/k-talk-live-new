/* Equal non-monetary level progress for confirmed sent/received gifts. Never changes balances or payout. */
(function(){
 if(window.__ktRoseLevelProgress20261015)return;window.__ktRoseLevelProgress20261015=true;
 function count(v){var n=Number(String(v==null?0:v).replace(/,/g,''));return Number.isFinite(n)?Math.max(0,Math.floor(n)):0;}
 function threshold(level){level=Math.max(1,count(level));if(level<=10)return (level-1)*1000;if(level===11)return 14000;return 14000+(level-11)*15000;}
 function fromTotal(total){total=count(total);if(total<9000)return 1+Math.floor(total/1000);if(total<14000)return 10;return 11+Math.floor((total-14000)/15000);}
 function cost(target){target=Math.max(2,count(target));return target<=10?1000:target===11?5000:15000;}
 function account(){try{if(window.ktProfileAccountKey){var id=String(window.ktProfileAccountKey()||'');if(id)return id;}}catch(e){}try{return localStorage.getItem('kt_live_device_id')||'local';}catch(e){return 'local';}}
 var activatedAt=Date.now(),initialAccount=account();
 function key(accountKey){return 'kt_rose_level_v2:'+(accountKey||account());}
 function load(accountKey){var selected=accountKey||account(),d;try{d=JSON.parse(localStorage.getItem(key(selected))||'null');}catch(e){}if(d&&typeof d==='object')return d;
  var total=null,floor=1;try{var migrationOwner=localStorage.getItem('kt_level_legacy_import_owner');if(!migrationOwner&&selected===initialAccount){migrationOwner=selected;localStorage.setItem('kt_level_legacy_import_owner',selected);}if(migrationOwner===selected){var old=localStorage.getItem('ktalk_level_rose_total');if(old!==null)total=count(old);floor=count(localStorage.getItem('ktalk_level')||localStorage.getItem('ktalk_user_level')||1)||1;}}catch(e){}
  d={roses:total===null?0:total,floor:total===null?floor:1,seen:{},since:activatedAt};persist(d,selected);return d;
 }
 function persist(d,accountKey){try{localStorage.setItem(key(accountKey),JSON.stringify(d));return true;}catch(e){return false;}}
 function owner(){try{return !!(window.ktIsOwnerLevelExempt&&window.ktIsOwnerLevelExempt());}catch(e){return false;}}
 function info(){var d=load(),base=threshold(Math.max(1,count(d.floor))),progress=base+count(d.roses),level=owner()?1000:fromTotal(progress);return {total:count(d.roses),baseRoses:base,level:level,nextLevel:level+1,nextThreshold:threshold(level+1),need:Math.max(0,threshold(level+1)-progress),step:cost(level+1)};}
 function update(){var i=info();if(!owner()){var st=window.state||{};['level','userLevel','memberLevel','hostLevel'].forEach(function(k){st[k]=i.level;});['ktalk_level','ktalk_user_level','ktalk_member_level','ktalk_host_level'].forEach(function(k){try{localStorage.setItem(k,String(i.level));}catch(e){}});}try{window.dispatchEvent(new CustomEvent('kt-level-updated',{detail:i}));}catch(e){}return i;}
 window.ktLevelThresholdFor20261015=threshold;window.ktLevelFromRoses20261015=fromTotal;window.ktLevelUpCostForTarget=cost;window.ktNextLevelCost=function(level){return cost(count(level)+1);};window.ktLevelInfo=info;window.ktLevelGetTotal=function(){return info().total;};window.ktLevelGetLevel=function(){return info().level;};
 window.ktLevelAccountKey20261015=account;
 window.ktNewLevelGiftReceipt20261015=function(){return 'level_'+Date.now().toString(36)+'_'+Math.random().toString(36).slice(2,12);};
 window.ktLevelCreditGiftReceipt20261015=function(receipt){
  if(!receipt||!/^level_[a-z0-9]+_[a-z0-9]+$/.test(String(receipt.id||''))||['sent','received'].indexOf(receipt.direction)<0)return false;var n=count(receipt.count);if(!n)return false;
  var creditedAccount=String(receipt.account||account()),d=load(creditedAccount),id=String(receipt.id),stamp=Date.parse(receipt.createdAt||'');if(Number.isFinite(stamp)&&stamp<d.since)return false;
  d.seen=d.seen&&typeof d.seen==='object'?d.seen:{};if(d.seen[id])return false;d.seen[id]=Date.now();d.roses=count(d.roses)+n;if(!persist(d,creditedAccount))return false;if(creditedAccount===account())update();return true;
 };
 window.openLevelBenefits=function(){if(!window.showSheet)return;var i=info(),rows='';for(var lv=1;lv<=21;lv++)rows+='<div class="rowbox">레벨 '+lv+' · 누적 장미 '+threshold(lv).toLocaleString('ko-KR')+'송이</div>';window.showSheet('장미 · 레벨 기준','<div class="rowbox">현재 레벨 '+i.level+' · 새 기준으로 기록된 장미 '+i.total.toLocaleString('ko-KR')+'송이<br>준 사람과 받은 사람에게 같은 기준을 적용합니다.<br>레벨 2~10: 단계마다 1,000송이<br>레벨 11: 5,000송이 추가<br>레벨 12부터: 단계마다 15,000송이 추가</div>'+rows);};
 var activeAccount=account();setInterval(function(){var next=account();if(next!==activeAccount){activeAccount=next;update();}},1000);
 document.addEventListener('DOMContentLoaded',update);window.addEventListener('storage',function(e){if(e.key===key())update();});
})();