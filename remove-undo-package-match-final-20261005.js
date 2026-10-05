/* K-Talk final lock v2: remove ONLY duplicate row containing
   되돌리기 + 패키지상자 + 매치. Keep 보물상자 and all other controls.
   Lightweight observer only. 1150617 */
(function(){
  if(window.__ktRemoveUndoPackageMatchFinalV220261005)return;
  window.__ktRemoveUndoPackageMatchFinalV220261005=true;

  function norm(x){return String(x||'').replace(/\s+/g,'').trim();}

  function labelsIn(el){
    try{return [].slice.call(el.querySelectorAll('button')).map(function(b){return norm(b.textContent||b.getAttribute('aria-label')||'');});}
    catch(e){return [];}
  }

  function duplicateRowFrom(node){
    var el=node&&node.nodeType===1?node:null;
    for(var i=0;i<8&&el&&el.id!=='screen';i++,el=el.parentElement){
      var labs=labelsIn(el);
      if(!labs.length)continue;
      var hasPackage=labs.some(function(x){return x.indexOf('패키지상자')>-1;});
      if(!hasPackage)continue;
      var hasUndo=labs.some(function(x){return x.indexOf('되돌리기')>-1;});
      var hasMatch=labs.some(function(x){return x.indexOf('매치')>-1;});
      var hasTreasure=labs.some(function(x){return x.indexOf('보물상자')>-1;});
      if(hasPackage&&hasUndo&&hasMatch&&!hasTreasure)return el;
    }
    return null;
  }

  function cleanNode(node){
    if(!node||node.nodeType!==1)return;
    try{
      var candidates=[];
      if(node.matches&&node.matches('button'))candidates.push(node);
      if(node.querySelectorAll)candidates=candidates.concat([].slice.call(node.querySelectorAll('button')));
      candidates.forEach(function(btn){
        var t=norm(btn.textContent||btn.getAttribute('aria-label')||'');
        if(t.indexOf('패키지상자')<0)return;
        var row=duplicateRowFrom(btn);
        if(row){
          try{row.remove();}catch(e){}
        }else{
          // If structure changed, remove only package button; never touch treasure.
          try{btn.remove();}catch(e){}
        }
      });
    }catch(e){}
  }

  var screen=document.getElementById('screen')||document.documentElement;
  cleanNode(screen);
  try{
    new MutationObserver(function(muts){
      muts.forEach(function(m){
        [].slice.call(m.addedNodes||[]).forEach(cleanNode);
      });
    }).observe(screen,{childList:true,subtree:true});
  }catch(e){}
})();