/* K-Talk TV access working-state lock marker
   Date: 2026-09-30
   Locked rule:
   - Subscriber: allowed at any level
   - Host: allowed at level 21+
   - Staff/admin/operator: allowed at level 21+
   - Ordinary members: hidden
   Snapshot marker only; does not alter runtime behavior.
*/
(function(){
  window.__ktTvAccessWorkingLock20260930={
    locked:true,
    tvRuleSha:"79939d45eddc2232bc6c4f5e663fe182615b313d",
    indexSha:"38245a148ee6532ac0456f72706ed6607535dc93",
    tvRuleCommit:"a00e7777c4e25c9f48c2372a60c63b37623015bc",
    indexCommit:"a944bb680377cbbf73c54e96142f73a77794c1d6",
    note:"Preserve this TV-button permission rule unless the user explicitly asks to change it."
  };
})();