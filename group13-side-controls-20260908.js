/* K-Talk 13명 방송: 승인된 화면은 그대로 두고 오른쪽에 좋아요/선물상자/매치/효과음만 추가. */
(function(){
  if(window.__ktGroup13SideControls20260908)return;
  window.__ktGroup13SideControls20260908=true;

  function isGroup13Room(){
    var room=document.querySelector('.ktg13-room');
    if(room)return room;
    try{
      var t=(window.state&&state.liveRoomType)||'';
      var n=(window.state&&state.liveRoomName)||'';
      if((t==='group'||t==='group13'||n==='13명 방송')&&document.getElementById('ktSept2Live'))return document.getElementById('ktSept2Live');
    }catch(e){}
    return null;
  }

  function openEffectsSound(){
    try{if(window.openSoundPanel){window.openSoundPanel();return;}}catch(e){}
    try{if(window.ktGroup13Effect){window.ktGroup13Effect();return;}}catch(e){}
    try{if(window.showSheet)window.showSheet('효과음','<div class="rowbox"><b>🔊 효과음</b><br>방송 중 사용할 효과음을 선택합니다.</div>');}catch(e){}
  }
  window.ktGroup13OpenEffectsSound=openEffectsSound;

  function install(){
    var room=isGroup13Room();
    if(!room)return;
    if(document.getElementById('ktGroup13SideControls'))return;
    try{if(getComputedStyle(room).position==='static')room.style.position='relative';}catch(e){room.style.position='relative';}

    var style=document.getElementById('ktGroup13SideControlsStyle');
    if(!style){
      style=document.createElement('style');
      style.id='ktGroup13SideControlsStyle';
      style.textContent='\
#ktGroup13SideControls{position:absolute;right:8px;top:43%;transform:translateY(-50%);z-index:90;display:grid;gap:9px;pointer-events:auto;}\
#ktGroup13SideControls button{width:58px;height:66px;border-radius:22px;border:1px solid #ffffff35;background:rgba(11,9,16,.82);color:#fff;display:grid;place-items:center;padding:5px 2px;box-shadow:0 3px 14px #0009,inset 0 0 12px #ffffff09;font-family:inherit;font-weight:950;}\
#ktGroup13SideControls button b{display:block;font-size:24px;line-height:1;}\
#ktGroup13SideControls button span{display:block;margin-top:3px;font-size:9px;line-height:1.05;white-space:nowrap;}\
#ktGroup13SideControls .like{border-color:#ff4fa777;background:linear-gradient(155deg,#45132fdd,#180b16e8);}\
#ktGroup13SideControls .gift{border-color:#ffd34d77;background:linear-gradient(155deg,#4a320ddd,#171006e8);}\
#ktGroup13SideControls .match{border-color:#a75cff77;background:linear-gradient(155deg,#2c154bdd,#12091ee8);}\
#ktGroup13SideControls .fx{border-color:#6f6fff77;background:linear-gradient(155deg,#1d1d4add,#0c0c1ee8);}\
@media(max-width:390px){#ktGroup13SideControls{right:5px;gap:7px}#ktGroup13SideControls button{width:52px;height:60px;border-radius:19px}#ktGroup13SideControls button b{font-size:21px}#ktGroup13SideControls button span{font-size:8px}}';
      document.head.appendChild(style);
    }

    var box=document.createElement('div');
    box.id='ktGroup13SideControls';
    box.innerHTML=''
      +'<button type="button" class="like" onclick="if(window.addHostLike)window.addHostLike(1)"><b>💗</b><span>좋아요</span></button>'
      +'<button type="button" class="gift" onclick="if(window.openGifts)window.openGifts()"><b>🎁</b><span>선물상자</span></button>'
      +'<button type="button" class="match" onclick="if(window.openHostMatchArena)window.openHostMatchArena(\'1대1\');else if(window.openMatch)window.openMatch()"><b>⚔</b><span>매치</span></button>'
      +'<button type="button" class="fx" onclick="if(window.ktGroup13OpenEffectsSound)window.ktGroup13OpenEffectsSound()"><b>🔊</b><span>효과음</span></button>';
    room.appendChild(box);
  }

  var mo=new MutationObserver(function(){setTimeout(install,20);});
  try{mo.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  setTimeout(install,0);
  setTimeout(install,120);
  setTimeout(install,500);
  setInterval(install,1200);
})();
