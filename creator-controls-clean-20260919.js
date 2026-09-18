/* K-Talk 촬영화면 오른쪽 도구 정리 (2026-09-19)
   요청대로: 되돌리기 / AI 보정 / 편집효과만 보이게 하고,
   되돌리기는 기존보다 아래로 내림.
   다른 방송방/게스트/채팅/스위치/하단 촬영 기능은 건드리지 않음. */
(function(){
  if(window.__ktCreatorControlsClean20260919)return;
  window.__ktCreatorControlsClean20260919=true;

  function install(){
    var creator=document.getElementById('creator');
    if(!creator)return;

    var rotate=creator.querySelector('.creator-top .creator-rotate');
    if(rotate){
      rotate.setAttribute('aria-label','되돌리기');
      rotate.innerHTML='<b aria-hidden="true">↻</b><small>되돌리기</small>';
    }

    if(!document.getElementById('ktCreatorControlsClean20260919Style')){
      var s=document.createElement('style');
      s.id='ktCreatorControlsClean20260919Style';
      s.textContent=`
/* 촬영화면 오른쪽: 되돌리기 + AI 보정 + 편집효과만 */
#creator:not(.live-prep-open) .creator-tools > button:not(.creator-tool-text){
  display:none!important;
}
#creator:not(.live-prep-open) .creator-tools{
  right:15px!important;
  top:230px!important;
  gap:18px!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
}
#creator:not(.live-prep-open) .creator-tools .creator-tool-text{
  width:62px!important;
  height:72px!important;
  min-width:62px!important;
  min-height:72px!important;
  padding:7px 3px!important;
  border-radius:31px!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:center!important;
  gap:2px!important;
  background:rgba(0,0,0,.24)!important;
  color:#fff!important;
  text-shadow:0 1px 5px #000!important;
}
#creator:not(.live-prep-open) .creator-tools .creator-tool-text b{
  display:block!important;
  font-size:27px!important;
  line-height:1!important;
}
#creator:not(.live-prep-open) .creator-tools .creator-tool-text small{
  display:block!important;
  margin-top:2px!important;
  font-size:10px!important;
  line-height:1.05!important;
  font-weight:950!important;
  white-space:nowrap!important;
  color:#fff!important;
}

/* 맨 위 되돌리기 버튼을 아래로 이동 */
#creator:not(.live-prep-open) .creator-top .creator-rotate{
  position:absolute!important;
  right:0!important;
  top:125px!important;
  width:62px!important;
  height:72px!important;
  min-width:62px!important;
  min-height:72px!important;
  padding:7px 3px!important;
  border-radius:31px!important;
  display:flex!important;
  flex-direction:column!important;
  align-items:center!important;
  justify-content:center!important;
  gap:2px!important;
  background:rgba(0,0,0,.24)!important;
  color:#fff!important;
  text-shadow:0 1px 5px #000!important;
  z-index:9!important;
}
#creator:not(.live-prep-open) .creator-top .creator-rotate b{
  display:block!important;
  font-size:29px!important;
  line-height:1!important;
  font-weight:800!important;
}
#creator:not(.live-prep-open) .creator-top .creator-rotate small{
  display:block!important;
  margin-top:2px!important;
  font-size:10px!important;
  line-height:1.05!important;
  font-weight:950!important;
  white-space:nowrap!important;
  color:#fff!important;
}
`;
      document.head.appendChild(s);
    }
  }

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',install,{once:true});
  }else{
    install();
  }
  setTimeout(install,200);
})();
