/* K-Talk 13명방 보호 잠금 - 2026-09-27
   사용자가 현재 13명방 상태를 그대로 유지하도록 요청함.
   보호 범위:
   - 13명방 화면/배치
   - 5→4→3→2→1 카운트
   - 호스트 카메라/영상 연결
   - 13명방 버튼/채팅/선물/수익표
   다른 작업에서는 이 플래그가 true인 동안 13명방 코드를 변경하지 않는다.
   이 파일 자체는 UI나 동작을 변경하지 않는 보호 표시용이다. */
(function(){
  window.__ktGroup13ProtectedLock20260927=true;
  window.__ktGroup13ProtectedVersion20260927='room-visible-countdown5';
})();
