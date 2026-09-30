/* K-Talk FULL working-state lock marker — updated 2026-10-01
   Snapshot only. It does not alter runtime behavior.
   Preserve these working areas unless the user explicitly authorizes a change:
   - Taekwon/Haine owner level = 50000 across profile, live start, room displays, and access checks
   - Top TV access rules currently approved
   - Viewer gift effects
   - Host video / LIVE receiver restored from 2026-09-30 known-good state
   - Current index script versions
*/
(function(){
  window.__ktFullWorkingStateLock20260930={
    locked:true,
    created:"2026-09-30",
    relocked:"2026-10-01",
    snapshot:{
      "owner-admin-room-bypass-20260928.js":"18a65acbcb928d7af9e129414b0881563052d5ad",
      "owner-admin-all-access-20260913.js":"a698655d2d5ac10f2009db0252c84b024dd07bd7",
      "level-rules.js":"c66de5b8a35c9ec50e3293ec41b8333d92d9ebb3",
      "level-system-20260915.js":"d130337630b41007d667f4f2472078f58e764c34",
      "ktalk-final-room-access-rules-20260928.js":"2cc4e5ed4c61e063efedae06620daa55a0cc5eca",
      "taekwon1-single-level-card-20260918.js":"c5bc0337cefb36f62759424172626251c73119be",
      "top-tv-host-staff-only-20260930.js":"ef3499418654ba4186f86e8fd67865e3c53e0f86",
      "gift-host-sync-20260918.js":"7b4ba7f81d8c2068c2fafb5e8f606d80b65262c4",
      "live-peer-fallback-20260921.js":"efd0e814ef502db56ca0cf591908a1a32ed3080c",
      "red-live-signal-receiver-lock-20260930.js":"0c1baf2b1010500ee826b85e4b3eb9ac7dc4245f"
    },
    note:"User explicitly re-locked this restored host-video / red-LIVE state on 2026-10-01. Do not modify these locked areas without explicit user approval."
  };
})();