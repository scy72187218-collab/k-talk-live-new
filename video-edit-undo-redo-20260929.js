/* K-Talk video edit effect history: undo / redo / reset */
(function(){
  if(window.__ktVideoEditHistory20260929)return;
  window.__ktVideoEditHistory20260929=true;

  var history=['off'], index=0, replaying=false;

  function current(){
    try{
      return String((window.state&&(state.pendingEditEffect||state.appliedEditEffect||state.editSticker))||'off');
    }catch(e){return 'off';}
  }
  function push(name){
    name=String(name||'off');
    if(replaying)return;
    if(history[index]===name)return;
    history=history.slice(0,index+1);
    history.push(name);
    if(history.length>30)history.shift();
    index=history.length-1;
    updateButtons();
  }
  function apply(name){
    replaying=true;
    try{
      if(typeof window.setEditEffect==='function')window.setEditEffect(name);
      else if(typeof window.applyEditEffect==='function')window.applyEditEffect(name);
    }finally{
      setTimeout(function(){replaying=false;updateButtons();},0);
    }
  }

  window.ktUndoEditEffect20260929=function(){
    if(index<=0)return;
    index--;
    apply(history[index]);
  };
  window.ktRedoEditEffect20260929=function(){
    if(index>=history.length-1)return;
    index++;
    apply(history[index]);
  };
  window.ktResetEditEffect20260929=function(){
    var before=current();
    if(before!=='off')push('off');
    apply('off');
  };

  function updateButtons(){
    var u=document.getElementById('ktEditUndoBtn20260929');
    var r=document.getElementById('ktEditRedoBtn20260929');
    if(u)u.disabled=index<=0;
    if(r)r.disabled=index>=history.length-1;
  }

  function installBar(){
    var sheet=document.getElementById('sheet');
    if(!sheet||!sheet.classList.contains('camera-effect-sheet'))return;
    if(sheet.querySelector('.kt-edit-history-bar-20260929')){updateButtons();return;}
    var grid=sheet.querySelector('.kt-face-effect-grid');
    if(!grid)return;

    var bar=document.createElement('div');
    bar.className='kt-edit-history-bar-20260929';
    bar.innerHTML=''
      +'<button id="ktEditUndoBtn20260929" type="button">↶ 되돌리기</button>'
      +'<button id="ktEditRedoBtn20260929" type="button">↷ 다시실행</button>'
      +'<button id="ktEditResetBtn20260929" type="button">⟲ 효과초기화</button>';
    grid.insertBefore(bar,grid.firstChild);

    bar.querySelector('#ktEditUndoBtn20260929').onclick=window.ktUndoEditEffect20260929;
    bar.querySelector('#ktEditRedoBtn20260929').onclick=window.ktRedoEditEffect20260929;
    bar.querySelector('#ktEditResetBtn20260929').onclick=window.ktResetEditEffect20260929;
    updateButtons();
  }

  function ensureStyle(){
    if(document.getElementById('ktVideoEditHistoryStyle20260929'))return;
    var s=document.createElement('style');
    s.id='ktVideoEditHistoryStyle20260929';
    s.textContent=''
      +'#sheet.camera-effect-sheet .kt-edit-history-bar-20260929{grid-column:1/-1!important;display:grid!important;grid-template-columns:1fr 1fr 1fr!important;gap:6px!important;margin:0 0 8px!important}'
      +'#sheet.camera-effect-sheet .kt-edit-history-bar-20260929 button{min-height:38px!important;border:1px solid rgba(255,255,255,.18)!important;border-radius:11px!important;background:#242631!important;color:#fff!important;font-size:11px!important;font-weight:900!important;padding:7px 4px!important}'
      +'#sheet.camera-effect-sheet .kt-edit-history-bar-20260929 button:disabled{opacity:.35!important}'
      +'#sheet.camera-effect-sheet .kt-edit-history-bar-20260929 button:not(:disabled):active{transform:scale(.98)!important}';
    document.head.appendChild(s);
  }

  function patch(){
    if(window.setEditEffect&&!window.setEditEffect.__ktHistoryPatched){
      var old=window.setEditEffect;
      var wrapped=function(name,el){
        var n=String(name||'off');
        var out=old.apply(this,arguments);
        push(n);
        return out;
      };
      wrapped.__ktHistoryPatched=true;
      window.setEditEffect=wrapped;
    }
    if(window.previewEditEffect&&!window.previewEditEffect.__ktHistoryPatched){
      var oldPreview=window.previewEditEffect;
      var wrappedPreview=function(name,el){
        var n=String(name||'off');
        var out=oldPreview.apply(this,arguments);
        push(n);
        return out;
      };
      wrappedPreview.__ktHistoryPatched=true;
      window.previewEditEffect=wrappedPreview;
    }
  }

  history=[current()]; index=0;
  ensureStyle();
  patch();
  installBar();

  [100,300,700,1400].forEach(function(ms){setTimeout(function(){patch();installBar();},ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktVideoEditHistoryTimer20260929);
      window.__ktVideoEditHistoryTimer20260929=setTimeout(function(){patch();installBar();},50);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
})();