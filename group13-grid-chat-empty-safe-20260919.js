/* K-Talk 13명방 전용
   목표: 두 번째 참고 사진처럼 4-4-4-1 동일 크기 13칸,
   칸은 조금 더 크게, 채팅은 그리드 아래 하단으로 배치.
   다른 방/스위치/방송연결/선물/카메라/마이크는 변경하지 않음. */
(function(){
  if(window.__ktGroup13GridChatBottom20260920)return;
  window.__ktGroup13GridChatBottom20260920=true;

  function isExact13HostRoom(room){
    if(!room)return false;
    if(room.getAttribute('data-kt-room')==='9'||room.getAttribute('data-kt-room')==='15')return false;
    var guests=room.querySelectorAll('.ktg13-guests .ktg13-guest,.ktg13-main>.ktg13-guest');
    if(guests.length!==12)return false;
    try{
      var n=String((window.state&&state.liveRoomName)||'');
      var t=String((window.state&&state.liveRoomType)||'');
      if(n==='13명 방송'||t==='group13'||t==='group')return true;
    }catch(e){}
    try{return String(room.textContent||'').indexOf('13명 방송')>-1;}catch(e){return false;}
  }

  function setImp(el,name,val){
    if(el)el.style.setProperty(name,val,'important');
  }
  function clearImp(el,name){
    if(el)el.style.removeProperty(name);
  }

  function forceLayout(){
    try{
      var room=document.querySelector('#screen .ktg13-room');
      if(!isExact13HostRoom(room))return;

      var main=room.querySelector('.ktg13-main');
      var host=room.querySelector('.ktg13-host');
      var guests=room.querySelector('.ktg13-guests');
      var mid=room.querySelector('.ktg13-mid');
      var chat=document.getElementById('ktg13ChatList')||room.querySelector('.ktg13-chat');
      if(!main||!host||!guests||!mid||!chat)return;

      /* 두 번째 사진처럼 호스트 1 + 게스트 12 = 4-4-4-1 */
      setImp(main,'position','relative');
      setImp(main,'display','grid');
      setImp(main,'grid-template-columns','repeat(4,minmax(0,1fr))');
      setImp(main,'grid-template-rows','repeat(4,minmax(0,1fr))');
      setImp(main,'gap','2px');
      setImp(main,'overflow','hidden');
      setImp(main,'min-height','0');
      setImp(main,'flex','1 1 0');

      setImp(host,'grid-column','1');
      setImp(host,'grid-row','1');
      setImp(host,'width','auto');
      setImp(host,'height','auto');
      setImp(host,'min-width','0');
      setImp(host,'min-height','0');
      setImp(host,'margin','0');
      setImp(host,'align-self','stretch');
      setImp(host,'justify-self','stretch');

      setImp(guests,'display','contents');
      room.querySelectorAll('.ktg13-guest').forEach(function(tile){
        setImp(tile,'width','auto');
        setImp(tile,'height','auto');
        setImp(tile,'min-width','0');
        setImp(tile,'min-height','0');
        setImp(tile,'margin','0');
        setImp(tile,'align-self','stretch');
        setImp(tile,'justify-self','stretch');
      });

      /* 채팅을 빈 3칸에서 빼고, 두 번째 사진처럼 그리드 아래 하단으로 내림.
         중간줄을 조금 줄여서 13개 칸이 약간 더 커지게 함. */
      if(chat.parentElement!==mid)mid.insertBefore(chat,mid.firstChild);
      setImp(mid,'flex','0 0 58px');
      setImp(mid,'min-height','58px');
      setImp(mid,'height','58px');
      setImp(mid,'grid-template-columns','minmax(0,1fr) 34%');
      setImp(mid,'gap','6px');
      setImp(mid,'align-items','end');

      clearImp(chat,'grid-column');
      clearImp(chat,'grid-row');
      setImp(chat,'position','relative');
      setImp(chat,'left','auto');
      setImp(chat,'right','auto');
      setImp(chat,'top','auto');
      setImp(chat,'bottom','auto');
      setImp(chat,'width','100%');
      setImp(chat,'height','58px');
      setImp(chat,'min-height','58px');
      setImp(chat,'max-height','58px');
      setImp(chat,'margin','0');
      setImp(chat,'padding','1px 6px 2px');
      setImp(chat,'display','flex');
      setImp(chat,'flex-direction','column');
      setImp(chat,'justify-content','flex-end');
      setImp(chat,'overflow','hidden');
      setImp(chat,'background','transparent');
      setImp(chat,'border','0');
      setImp(chat,'box-shadow','none');
      setImp(chat,'transform','none');
      setImp(chat,'z-index','18');
      setImp(chat,'pointer-events','none');

      room.setAttribute('data-kt-13-grid','4441-chat-bottom');
    }catch(e){}
  }

  forceLayout();
  [40,100,200,400,800,1400,2400].forEach(function(ms){setTimeout(forceLayout,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup13GridChatBottomTimer20260920);
      window.__ktGroup13GridChatBottomTimer20260920=setTimeout(forceLayout,20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',function(){setTimeout(forceLayout,30);});
  window.addEventListener('orientationchange',function(){setTimeout(forceLayout,120);});
})();