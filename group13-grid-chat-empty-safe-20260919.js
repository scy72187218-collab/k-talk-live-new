/* K-Talk 13명방 호스트 화면만 안전 수정
   목표: 두 번째 참고 사진처럼 4-4-4-1 동일 크기 13칸 + 마지막 줄 빈 3칸 채팅
   스위치/방송연결/선물/카메라/마이크/다른 방은 변경하지 않음 */
(function(){
  if(window.__ktGroup13GridChatEmptySafe20260919V2)return;
  window.__ktGroup13GridChatEmptySafe20260919V2=true;

  function isExact13HostRoom(room){
    if(!room)return false;
    if(room.getAttribute('data-kt-room')==='9'||room.getAttribute('data-kt-room')==='15')return false;
    var guests=room.querySelectorAll('.ktg13-guests .ktg13-guest,.ktg13-main>.ktg13-guest');
    if(guests.length!==12)return false;
    try{
      var txt=String(room.textContent||'');
      if(txt.indexOf('13명 방송')>-1)return true;
    }catch(e){}
    try{
      var n=String((window.state&&state.liveRoomName)||'');
      var t=String((window.state&&state.liveRoomType)||'');
      return n==='13명 방송'||t==='group13'||t==='group';
    }catch(e){return false;}
  }

  function setImp(el,name,val){
    if(el)el.style.setProperty(name,val,'important');
  }

  function forceLayout(){
    try{
      var room=document.querySelector('#screen .ktg13-room');
      if(!isExact13HostRoom(room))return;

      var main=room.querySelector('.ktg13-main');
      var host=room.querySelector('.ktg13-host');
      var guests=room.querySelector('.ktg13-guests');
      var chat=document.getElementById('ktg13ChatList')||room.querySelector('.ktg13-chat');
      if(!main||!host||!guests||!chat)return;

      /* 13칸을 실제 4x4 한 그리드로 강제. 호스트가 첫 칸, 게스트 12명이 다음 12칸. */
      setImp(main,'position','relative');
      setImp(main,'display','grid');
      setImp(main,'grid-template-columns','repeat(4,minmax(0,1fr))');
      setImp(main,'grid-template-rows','repeat(4,minmax(0,1fr))');
      setImp(main,'gap','2px');
      setImp(main,'overflow','hidden');
      setImp(main,'min-height','0');

      setImp(host,'grid-column','1');
      setImp(host,'grid-row','1');
      setImp(host,'width','auto');
      setImp(host,'height','auto');
      setImp(host,'min-width','0');
      setImp(host,'min-height','0');
      setImp(host,'margin','0');
      setImp(host,'align-self','stretch');
      setImp(host,'justify-self','stretch');

      /* wrapper는 칸을 차지하지 않고 12개 게스트가 main 그리드의 직접 항목처럼 배치됨 */
      setImp(guests,'display','contents');

      var tiles=room.querySelectorAll('.ktg13-guest');
      tiles.forEach(function(tile){
        setImp(tile,'width','auto');
        setImp(tile,'height','auto');
        setImp(tile,'min-width','0');
        setImp(tile,'min-height','0');
        setImp(tile,'margin','0');
        setImp(tile,'align-self','stretch');
        setImp(tile,'justify-self','stretch');
      });

      /* 채팅은 마지막 줄의 남는 2~4열에만 표시 */
      if(chat.parentElement!==main)main.appendChild(chat);
      setImp(chat,'grid-column','2 / 5');
      setImp(chat,'grid-row','4');
      setImp(chat,'position','relative');
      setImp(chat,'left','auto');
      setImp(chat,'right','auto');
      setImp(chat,'top','auto');
      setImp(chat,'bottom','auto');
      setImp(chat,'width','100%');
      setImp(chat,'height','100%');
      setImp(chat,'min-height','0');
      setImp(chat,'max-height','none');
      setImp(chat,'margin','0');
      setImp(chat,'padding','5px 7px');
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

      room.setAttribute('data-kt-13-grid','4441-chat-empty');
    }catch(e){}
  }

  forceLayout();
  [40,100,200,400,800,1400,2400].forEach(function(ms){setTimeout(forceLayout,ms);});
  try{
    var mo=new MutationObserver(function(){
      clearTimeout(window.__ktGroup13GridChatEmptySafeTimerV2);
      window.__ktGroup13GridChatEmptySafeTimerV2=setTimeout(forceLayout,20);
    });
    mo.observe(document.documentElement,{childList:true,subtree:true});
  }catch(e){}
  window.addEventListener('resize',function(){setTimeout(forceLayout,30);});
  window.addEventListener('orientationchange',function(){setTimeout(forceLayout,120);});
})();