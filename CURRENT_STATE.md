# K-Talk LIVE shared current state

Updated2026-10-14. User-facing URL: https://k-talk-live-final.vercel.app/

Latest deployed runtime commit: 45a51056906ab3769e86f57da16ec2965bc21c3d
Latest runtime production deployment: dpl_Ac3U2cBRiUTzg3JDC6vUnSvQjXX5

Owner confirms all five rooms display normally and requests freezing current host and guest behavior under maintenance lock5061. Read AGENTS.md and LOCK_ALL_FIVE_ROOMS_5061_20261014.json before any changes. No runtime modifications are authorized by this lock-recording request. Preserve prior independent locks/passwords.

Completed: solo viewer header reuses host header without attendance/two hearts; creator-target rescue isolation; SFU SDK video Track.attach, previous-room disconnect race fix, singlePeerConnection:false browser compatibility; guest request photo script extra-brace fix and actual loader cache refresh.

Verification: official solo viewer connected=true,error empty, video180x320 readyState4 paused=false, currentTime advanced15.205377 to37.439414; screenshot shows actual camera scene. Owner reports all five rooms normal. Agent has not independently verified all five physical rooms or complete stage approval flow.

Preserve viewing -> participation -> friends button -> host approval. No auto approval. Never deploy stale local work folder or experimental branches. Inspect actual main and production, update refs with expected_sha. Old deployments do not duplicate runtime. Keep recoverable history; delete files only after proving unused. Financial rules remain separately locked and untouched. Do not claim all outstanding historical issues fixed.


## Scoped release5062 (2026-10-14)
Owner explicitly requests deployment of guest elapsed broadcast timers in all rooms, all-room attendance synchronization, and guest gift-box opening. Runtime base a68b0a228bd393d360fba357a103047e3fbd6faa. Fix repeated gift wrapper growth and idempotent gift observer updates; bind guest timers to host session start, not join or wall clock; route guest attendance through existing remote message path and update host display. Video transport, sizing, approval, access and financial rules unchanged. Source checks and repeated-wrapper/timer/dedup tests passed. Real production UI verification follows deployment; do not claim all-room physical verification from these tests.


## Production verification and relock5062
Runtime6cdbcf2a15a95d561bc914f92a9b3a1a5825243a, deploymentdpl_C2x7yvha1QPpB6XrRQV6vtEZdWxV READY on official alias. See LOCK_GUEST_CONTROLS_5062_20261014.json. Actual guest timer advancement, attendance0->1 and gift-box opening verified in solo,9,13,subscriber. Secret entry blocked by mutual-follow/invite rule; did not bypass. Secret internal UI still requires invited-account verification. Host-side physical display and actual paid sending not tested. Current repaired scope re-locked under5062, all other5061 protections intact.


## Gift layout correction2026-10-14
Owner requests bottom gift sheet aligned below chat, selected recipient face/name, actions temporarily invisible only while gifts open, and other-person photo -> gift menu -> gift box flow. Scoped files: gift-pretty, gift-recipient-picker-scroll, all-room-person-gift-target, index cache versions. No media acquisition/transport/sizing, attendance, timers, approval, access or financial rule changes. Candidate syntax and current-host/selected-guest/stale-target tests passed; actual UI verification pending release.


## Photo/chat likes and9-room attendance heart
Owner added explicit request during gift verification. Photo target menu also records one existing remote like; blank chat container routes existing like handler, excluding inputs/controls/messages. Host-photo double counting guarded across existing handlers. Nine guest attendance heart uses existing attendance aggregate; host visible counter is reconstructed from attendance messages independently of processed reward events. No reward/payout logic change. Source checks and blank-chat interaction tests passed; production UI verification pending.


## Final verified gift/like/attendance state2026-10-14
Runtime45a51056906ab3769e86f57da16ec2965bc21c3d is deployed READY on official alias. At390x844 actual group9 hostkt_muuyyz3u_dhwqu808: attendance button and heart side by side, existing attendance1 displayed as 💗1명. Photo opens recipient menu; menu gift-box opens bottom panel with recipient 태권1 and face. Chat bottom472.640625 equals gift panel top472.640625; panel bottom844. Host video cell rect unchanged across opening. Actions hidden while open and visible on close; chat returns bottom839. Empty chat-side background native tap triggered like message delivery; photo also triggered like delivery. Primary/memory duplicate like deliveries suppressed within500ms for host counter. Paid sending and physical host-counter increment were not tested. Secret entry remains mutual-follow/invitation gated, no bypass. Prior four-room timers/attendance/gift checks remain recorded above. Preserve current approved scope under5062; all other5061 locks remain.
Evidence locally outputs/scope5062/official-final-gift-layout.png and official-final-attendance-heart.png. Never deploy stale local work folder; current source is GitHub main.


## Repeated attendance and DOM stability correction
Owner requests per-press attendance/rose rewards, immediate feedback, and adjacent hearts in all rooms. Existing once-per-person gate removed for new attendance:<unique-id> events; primary/memory duplicates and replay deduplicated at reward processing. Press queue preserves fast presses; optimistic UI rolls back failed writes. Hearts no longer reposition to camera/like areas. User also reports host/viewer refresh errors; one computer tab observed 'This page crashed'. Found chat send-icon observer rewrote identicalinnerHTML and requeued itself; guard identical icon/counter writes. Unit tests:3rapidpresses=3immediate/3persisted/3totalrewards despite duplicate/replayed channels; failedsendrollsback;10000samechat sweeps=1iconwrite. This is not proof every disconnect is fixed or a7-8minute physical phone soak test.
Camera quality candidate b35d00eb59f43a9d651715454eaa168b5821b21d on codex/camera-quality-review-20261014 remains unapproved/undeployed; do not merge. Only existing camera settings stay in production.


## Match overlay control visibility correction2026-10-14
Owner supplies match screenshot: common undo/treasure/match row and underlying camera/mic/friends/message/movie/share/more obstruct match. Hide only underlying live-room action/footer controls while #sheet.show.match-arena-sheet is open; restore automatically on exit. Raise match sheet above old controls. No media/stream changes, no layout geometry changes, no match scoring or benefit changes. Camera/mic malfunction and longer-running connection/crash report remain under investigation. Main2be5d986 includes independent follow-up fixes after3122; preserve them. Do not merge unapproved camera-quality review branch.


## Broadcast likes reset 2026-10-14
Owner requests clock-side broadcast likes to reset to zero at end and new broadcast, not accumulate by room type. all-room-clock-like now stores by host run identity, ignores legacy room-type totals and old visible badge counts, and zeros on broadcast end. Tests cover old total ignored, same-run retain, new-run zero and end zero. Does not alter attendance, rose balances, lifetime profile likes or reward percentages. Physical phone UI pending. Owner confirms camera/mic report was before refreshing; previous host-button repair is already production and needs new-page actual verification.


## Host bottom media reacquisition2026-10-14
Owner authorized direct button testing and repair. Official tab10 current version had no host video srcObject/videoWidth0; both clicks produced no status change. Existing mic acquisition discarded captured audio when no base stream; camera helper depended on creator preview and swallowed failure. Host bottom buttons now acquire only missing requested media, reuse existing live stream, remove ended tracks before adding replacement, retain mic-only stream in state, toggle existing live tracks, guard concurrent same-button requests, and show permission/device failure. No room framing, transport settings, guest controls, approval or payout changes. Mock tests pass empty-stream microphone retained/camera added/off-on/permission denied notification. Actual computer hardware capture and phone transmission pending.


## Owner movie theater scope2026-10-14
Owner requests movie button in solo/9/13/subscriber/secret to present large TV like solo, chat below TV, existing people area below chat, restore original room on close. Added temporary host movie theater class/player with existing media source and no moving or deleting original person nodes. Movie selection sheet closes once source activated; exit stops share through existing restoration. Existing level/subscriber permission gates preserved. Five-room mocked open/close restoration tests and syntax pass; physical media playback and responsive visual QA pending, do not claim complete phone or viewer layout verification. Remote viewer theater layout signaling not added by this host UI change; existing broadcast video transport unchanged.


## Movie guest theater synchronization2026-10-14
Owner explicitly requests completion and deployment of guest movie view in all five rooms. Host emits movie_mode on/off through existing dual message paths, with sender=host device. Viewer fetches latest host mode independently of limited chat window, filters current broadcast start, applies only current host response, hides control payloads from normal chat. Existing viewer video stream is reused in muted large TV; original participant nodes remain, with temporary people/chat area classes removed on exit. Viewer close restores own layout without stopping host; changing host/ending resets mode. Five host open/close mocked restoration and latest-mode/late-join/close-old-open/foreign-sender tests pass; syntax passed. Actual physical phone movie playback and multi-device visual verification remain pending. YouTube URL/music integration not implemented; existing local file and screen share only. Existing permission/level gates remain. No media acquisition/transport/auth/approval/finance edits.


## Movie entry and owner level correction2026-10-14
Official UI actual movie clicks remained no-op. DOM showed undefined ktBottomMovieOpen inline function and duplicate movie source (old subscriber benefits dynamic loader plus current static script); old global guard could suppress current code. Remove subscriber-benefits dynamic movie load, version its level-rules loader, use current theater-specific guard compatible with old guard, provide direct movie/camera/mic inline handler exports, and raise movie options sheet above footer. Owner explicitly corrects eligibility: general host/operator level20+, every paid subscriber no level restriction. Movie preview opens with visible eligibility note; playback acquisition still checks canUse. Tests general19 deny/general20 allow/subscriber1 allow and entry/guard pass. No other benefit/payout/auth changes. UI verification after deployment pending; do not claim finished from build alone.


## Owner movie/video footer hiding2026-10-14
Owner explicitly requests bottom camera/mic/friends/messages/movie/share/more absent while movie or video theater is open (host and guest); photo recipient gift flow remains. Hide only toolbar containers under temporary movie class; for viewer mixed composer rows hide action buttons but preserve text input/send. Removal of temporary theater class restores original controls. CSS only; no photo/menu/gift handlers, transport, sizing, eligibility or finance changes. Actual movie open had been observed in official9room; physical viewer UI remains unverified.


## Movie host self-photo tools2026-10-14
Owner requests host self photo contains hidden footer tools during movie/video. While local host tile is inside temporary movie theater only, self-photo tap opens tools menu referencing existing hidden bottom buttons via original click plus gift-box entry. Other person recipient menus and self-gift exclusion outside movie remain unchanged. No new media implementation or permissions, no other-room layout changes. Syntax checked; physical host photo menu verification pending. Footer hiding commit7f0d1e13 production READY.


## Phone movie touch release correction2026-10-14
Owner reports all phone movie buttons still no-open. Earlier official browser movie opened on Enter but not pointer click; do not equate that with phone verification. Add local host footer movie-only pointerup path (touchend fallback without PointerEvent), keeping existing click/keyboard path; throttle shared movie invocation500ms to deduplicate generated click. No acquisition, camera/mic behavior, movie eligibility, guest access or layout changes. Test pointer release without click opens once; subsequent click dedup; remote viewer excluded passes. Actual phone retest pending.


# Owner approved and locked movie/video theater (2026-10-14)
Owner confirms on their phone: movie button opened successfully, thanks assistant and explicitly requests locking this state. Approved runtime commit: 2bb6077ebeaf6e69d20fa83f821fe6750ceee1b6. Preserve all five host room movie/video theater layouts, viewer movie mode synchronization, pointer-release opening and click dedup, host self-photo tool menu, hidden bottom toolbars during theater with restoration on close, photo gift access, existing media selection/share/TV behavior and blue/yellow friends icons. General host/operator movie sharing eligibility is level20+, all paid subscribers without level restriction. Do not modify this approved movie scope directly or through shared files without explicit owner authorization. Existing room locks5061/5062 and other policies remain. This is a maintenance change lock, not runtime password/access denial; all controls remain usable. User phone opening was reported successful; this does not establish every room playback, TV cast or multi-device viewer playback was independently tested. Camera/mic capture and other outstanding issues must not be represented as resolved by this approval.


## Owner scoped movie compact people and face correction2026-10-14
Owner screenshot: three common buttons over movie and bottom people clipped; explicitly requests all five movie rooms to hide action/footer rows, raise/shrink all people, use full uncropped main movie and no movie duplication in lower host tile. Add movie-class-only high specificity stylesheet: movie45dvh, chat7dvh, people remaining48dvh with all seats packed3x3(9),4x4(13/subscriber),3x2(secret); preserve original DOM/click recipients and normal room state. Remove excessive old direct-child exclusion which hid nested chat parent. Local host face overlay uses original pre-share camera stream, not broadcast movie; remote viewer uses available profile/poster (separate live camera track is not transmitted). Main movie contain/center/none. Face test passed camera !=movie; syntax passed. Phone visual and viewer multi-device playback remain unverified. Prior movie lock narrowly superseded for this owner requested correction only.


# Owner separate movie functionality and layout locks2026-10-14
Owner explicitly requests separate locks for movie functionality and movie layout. Both approved baseline runtime b63cc2110ce21300543b0714a2c8acea489ae05d. See LOCK_MOVIE_FUNCTION_20261014.json and LOCK_MOVIE_LAYOUT_20261014.json. Preserve movie open/touch/eligibility/source/share/close and self-photo tools independently from movie-only TV/chat/compact people geometry, hidden action/footer rows and lower host/guest fill. No changes without owner scoped authorization. This lock is documentation only, not runtime access restriction. Current separate authorized investigation concerns attendance and camera/microphone; do not alter movie or layout as collateral work. Prior physical phone movie-open confirmation stands; other verification limits remain.
