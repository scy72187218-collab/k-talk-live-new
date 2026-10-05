/* Retired 2026-10-05 - 1150617
   Do not recreate the obsolete lower quick row.
   Removes only the old row. Other room controls, 보물상자, chat, gifts and signaling untouched. */
(function(){
  try{
    document.querySelectorAll('#screen .kt-room-second-stats-row-20260927').forEach(function(x){x.remove();});
  }catch(e){}
})();