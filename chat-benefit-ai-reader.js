/* K-Talk AI 읽기 전용: 새 채팅과 혜택/보상 화면 내용만 음성으로 읽는다. 다른 기능/UI는 변경하지 않음. */
(function(){
  if(window.__ktChatBenefitAIReaderInstalled)return;
  window.__ktChatBenefitAIReaderInstalled=true;

  function clean(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
  function speak(text){
    text=clean(text);
    if(!text)return;
    try{
      if(typeof window.ktSpeak==='function'){
        window.ktSpeak(text);
        return;
      }
    }catch(e){}
    try{
      if(!('speechSynthesis' in window))return;
      var u=new SpeechSynthesisUtterance(text);
      u.lang='ko-KR';u.rate=1.02;u.pitch=1;u.volume=1;
      window.speechSynthesis.speak(u);
    }catch(e){}
  }

  function lineText(el){
    if(!el)return '';
    var name=clean((el.querySelector('b,strong')||{}).textContent||'');
    var msg=clean((el.querySelector('span')||{}).textContent||'');
    if(!msg){
      var all=clean(el.textContent||'');
      if(name&&all.indexOf(name)===0)msg=clean(all.slice(name.length));
      else msg=all;
    }
    if(!msg||/채팅.*표시|메시지가.*표시|입력하면/.test(msg))return '';
    if(name&&name!=='나')return name+'님이 '+msg;
    if(name==='나')return '내 메시지 '+msg;
    return msg;
  }

  function getLines(box){
    if(!box)return [];
    var lines=[].slice.call(box.querySelectorAll('.ktsolo-chat-line,.ktsubscriber-chat-line,.ktg13-chat-line,.ktsecret-chat-line,.ktg9-chat-line,[class*="-chat-line"]'));
    return lines.map(function(el){return {key:clean(el.textContent||''),say:lineText(el)};}).filter(function(x){return x.key&&x.say;});
  }

  var snapshots=new WeakMap();
  function overlap(prev,cur){
    var max=Math.min(prev.length,cur.length);
    for(var n=max;n>=0;n--){
      var ok=true;
      for(var i=0;i<n;i++){
        if(prev[prev.length-n+i]!==cur[i]){ok=false;break;}
      }
      if(ok)return n;
    }
    return 0;
  }

  function watchChatBox(box){
    if(!box||box.__ktAIChatWatched)return;
    box.__ktAIChatWatched=true;
    snapshots.set(box,getLines(box).map(function(x){return x.key;}));
    var mo=new MutationObserver(function(){
      setTimeout(function(){
        var rows=getLines(box);
        var cur=rows.map(function(x){return x.key;});
        var prev=snapshots.get(box)||[];
        var start=overlap(prev,cur);
        for(var i=start;i<rows.length;i++)speak(rows[i].say);
        snapshots.set(box,cur);
      },35);
    });
    mo.observe(box,{childList:true,subtree:true,characterData:true});
  }

  function installChatWatchers(root){
    root=root||document;
    var sel='#ktsoloChatList,#ktsubscriberChatList,#ktg13ChatList,#ktsecretChatList,#ktg9ChatList,.ktsolo-chat,.ktsubscriber-chat,.ktg13-chat,.ktsecret-chat,.ktg9-chat';
    try{
      if(root.matches&&root.matches(sel))watchChatBox(root);
      if(root.querySelectorAll)root.querySelectorAll(sel).forEach(watchChatBox);
    }catch(e){}
  }

  installChatWatchers(document);
  try{
    var pageMo=new MutationObserver(function(ms){
      ms.forEach(function(m){[].slice.call(m.addedNodes||[]).forEach(function(n){if(n&&n.nodeType===1)installChatWatchers(n);});});
    });
    pageMo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}

  /* 혜택·보상 화면이 열리면 화면 내용을 한 번 자동으로 읽는다. */
  var lastBenefitKey='';
  var benefitTimer=null;
  function readBenefitIfOpen(){
    clearTimeout(benefitTimer);
    benefitTimer=setTimeout(function(){
      try{
        var sheet=document.getElementById('sheet');
        var titleEl=document.getElementById('sheetTitle');
        var body=document.getElementById('sheetBody');
        if(!sheet||!titleEl||!body||!sheet.classList.contains('show'))return;
        var title=clean(titleEl.textContent||'');
        if(!/(혜택|보상)/.test(title))return;
        var clone=body.cloneNode(true);
        clone.querySelectorAll('button,input,select,textarea,video,audio').forEach(function(el){el.remove();});
        var text=clean(clone.textContent||'');
        if(!text)return;
        var key=title+'|'+text;
        if(key===lastBenefitKey)return;
        lastBenefitKey=key;
        speak(title+'. '+text.slice(0,1500));
      }catch(e){}
    },180);
  }

  try{
    var sheet=document.getElementById('sheet');
    if(sheet){
      var sheetMo=new MutationObserver(readBenefitIfOpen);
      sheetMo.observe(sheet,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['class']});
    }
  }catch(e){}
})();
