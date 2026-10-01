/* K-Talk current working-state lock marker — 2026-10-01
   Snapshot only. It does not alter runtime behavior.
   USER LOCKED CURRENT STATE:
   - red LIVE appearing
   - broadcast entry
   - broadcast exit
   - host video connection
   Do not modify these areas unless the user explicitly says "풀어 주세요".
*/
(function(){
  window.__ktFullWorkingStateLock20260930={
    locked:true,
    created:"2026-09-30",
    relocked:"2026-10-01",
    current_state_locked:"2026-10-01",
    locked_areas:[
      "red LIVE signal publish/receive",
      "red LIVE room entry",
      "broadcast exit/return",
      "host video connection"
    ],
    snapshot:{
      "live-signal-publisher-20260929.js":"def3f0e495dd6a6055209f0665b9c058df4a751e",
      "red-live-signal-receiver-lock-20260930.js":"0c1baf2b1010500ee826b85e4b3eb9ac7dc4245f",
      "red-live-entry-hard-fix-20260928.js":"0f52f533b951d949bacba4c341f9f6c9cdd85043",
      "live-entry-exit-lock-20260929.js":"c782d708fca3362ecfa3dc534d565135d04691f0",
      "live-peer-fallback-20260921.js":"efd0e814ef502db56ca0cf591908a1a32ed3080c",
      "live-presence.js":"fd2387e6af89a46cc53bbda3118076940a5e6b19",
      "all-device-broadcast-end-sync-20260921.js":"8a10f4a1dc005c4e58fff8c350f3cff74b3a6676",
      "direct-realtime-webrtc-20260922.js":"90d3fef402a10e91a8dbcbc694781dce5aa6fec0"
    },
    note:"User explicitly locked the current red-LIVE / entry / exit / host-video state on 2026-10-01. Never modify these files/areas without explicit unlock permission."
  };
})();