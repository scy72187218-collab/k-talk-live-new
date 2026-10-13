# Live entry and page music review — 2026-10-13

Reviewed runtime source: 88d6d0128d04c9786040d48c058c7f405070931f
Maintenance ID: 6748 (review candidate only; not a runtime password).
Main and production domain are unchanged.

## Changes
- Freshly discovered LIVE metadata is shared with entry, avoiding an extra beacon wait for a just-observed room. Stable/stale metadata does not receive a fake new timestamp.
- A later tap on another host supersedes the earlier pending entry. Navigating away invalidates delayed room loads and fallback callbacks.
- Unvalidated historical room data cannot create an empty viewer shell.
- First-frame reuse is scoped to the same selected host and a short handoff window. A previous member's cached stream and late peer tracks cannot paint the new member's room.
- A visible connection panel remains until a real selected-host video frame decodes; slow or unavailable connections offer retry and return controls rather than an unexplained black screen.
- Music stops when changing pages, hiding the app, going back or leaving. Detached players and pending play promises are retired so delayed automatic playback cannot restart them. Local capture tracks and muted live video playback are preserved.

## Verified
- Five Node regression scripts passed: entry races, playback lifecycle, frame handoff, direct stale-frame/peer rejection, and idempotent switch style writes.
- Two actual browser tabs used real RTCPeerConnection and the preview Vercel peer-signaling API, with a synthetic canvas source and controlled room metadata. No real camera or microphone was opened and no public room was registered.
- Actual received video: 640×360, readyState 4, playing, with advancing currentTime.
- Three successive entry/re-entry observations: 2,802 ms / 3,601 ms / 4,001 ms. These are controlled test timings, not a promise of instantaneous delivery on every device/network.
- A detached real HTMLAudioElement played a synthetic WAV, stopped immediately on page navigation, and its scheduled later play attempt was blocked. A new deliberate playback and another navigation-stop cycle passed.
- Full preview app loaded the new handlers, opened the friends page, and produced no captured console errors in the observed interval.
- Synthetic host/viewer sessions were ended after testing.

## Limits
- This is not physical-phone, actual-member-broadcast, LiveKit Cloud, TURN-across-networks, or every-room-renderer verification.
- Initial loading is shown until media arrives; unavailable networks still require reconnecting. Errors are handled, not concealed by pretending that video connected.
- Other previously recorded unfinished settings, moderator permissions, financial calculations/payment processing and gift recording work remain separate.
- Financial/help drafts in outputs/benefits-review are not part of this candidate.
- Production release remains pending explicit owner approval.

## Additional live observation and release hold
- An actual production 13-person room opened from the final preview's red live button, but its host video remained without a stream/frame during this test. Do not mark real-member live viewing complete.
- Preview/production Runtime Cache signaling is environment-isolated. Matching-preview physical-phone verification has been requested from the owner; the primary production transport was not diagnosed as working by this observation.
- The switch observer was changed to compare normalized CSS property values before writes, removing repeated identical style mutations. Its regression test passes; full browser responsiveness is rechecked on this candidate.
- Maintenance 6748 freezes reviewed source only. Production deployment and physical-device validation remain pending.
