# 13-room owner change lock (5052; preserves prior 5050 snapshot)

The owner froze the current 13-person host and guest state on 2026-10-11. See `LOCK_GROUP13_HOST_GUEST_5050_20261011.json` for the exact recoverable commit and protected file blob hashes.

Preserve all 13-room host and guest layout, chat display area and input, separate circular icons, attendance counter heart, clock-side likes, approved guest video fill, camera/mic, approval, gifts, roses and business connections. Do not refactor, replace, or change these as collateral work. Edit protected 13-room behavior only when the user explicitly authorizes the specific change. An explicitly authorized fix is scoped to that fix. Changes to other rooms in shared files must preserve this 13-room behavior.

5052 is the owner's current change lock identifier, explicitly reaffirmed on 2026-10-11. The previous 5050 policy and recoverable snapshot remain preserved. This is a maintenance policy and recoverable Git snapshot, not a runtime password or GitHub branch protection. Chat, hearts, camera/mic, gifts and other runtime controls must remain usable.

Do not claim phone UI verification from source tests or successful deployment alone.

# 9-room owner change lock (5051)

The owner froze the current 9-person host and guest state on 2026-10-11. See `LOCK_GROUP9_HOST_GUEST_5051_20261011.json` for the recoverable source commit and file blob hashes.

Preserve the 9-room header above the LED, attendance and separate like counters, host and guest layout, video fill, chat area and input, icons, camera/mic, guest approval and existing business connections. Change protected 9-room behavior only when the owner explicitly authorizes the specific change. Shared files may be changed for other rooms only while preserving 9-room behavior. Existing 13-room lock remains in effect.

5051 is a maintenance policy identifier, not a runtime password or repository access control. All runtime room controls remain usable. Do not claim phone verification from deployment or source checks.

# Subscriber-room owner change lock (5053)

The owner explicitly locked the subscriber room on 2026-10-11 under change lock identifier 5053.

Preserve the subscriber-room host and guest screens, video layout, header, chat display and input, buttons, camera/microphone, approval, gifts, subscriptions, access rules, and existing communication connections. Do not modify, refactor, or replace subscriber-room behavior without explicit owner authorization for the specific change. Changes in shared files for other rooms must preserve subscriber-room behavior. Existing room locks remain in effect.

5053 is a maintenance change-policy identifier, not a runtime password or repository access control. All existing runtime controls remain usable. This policy does not declare the current runtime bug-free or phone-verified, and does not authorize fixes or deployment.

# Owner reaffirmation: three locked rooms (2026-10-11)

The owner explicitly reaffirmed all three change locks: 9-person room 5051, 13-person room 5052, and subscriber room 5053. Do not modify any of these rooms or their behavior through shared code without explicit owner authorization for that specific change. This instruction authorizes policy recording only; it does not authorize runtime code changes, repairs, or release actions.

# Secret-room owner change lock (5054)

The owner approved and locked the current secret-room state on 2026-10-11 under maintenance identifier 5054. Recoverable runtime source commit: `682558343f7bdf8954d498846f8d1efa5bd28d20`.

Preserve the secret room's host 1 + guest 5 (six total) seats. The last guest seat must remain one full cell; do not recreate the split pair or a sixth guest. Preserve secret-room layout, video, chat, buttons, password, invitation/follow conditions, camera/microphone, guest approval, gifts, and communications. Preserve the owner-authorized removal of broadcast room level gates. Change this locked behavior only when the owner explicitly authorizes the specific change; changes in shared files must preserve it. Existing 5051, 5052, and 5053 locks remain in effect.

5054 is a maintenance change lock and recoverable source reference, not a room password or runtime access restriction. All existing runtime controls remain usable. This record does not claim phone broadcast verification. This request authorizes policy recording only.

# Solo-room owner change lock (5155)

The owner explicitly saved and locked the current solo broadcast state on 2026-10-11 under maintenance identifier 5155. Recoverable runtime source commit: `84a8efb01bc94830100a3dcedc51e8f6942288aa`.

Preserve the current solo host camera, full-frame video fill, person size, background, header, chat display and input, buttons, camera/microphone controls, attendance, likes, gifts, earnings, and existing communication connections. Preserve the startup camera stability fix. The person-shrinking/background compositor was reverted at the owner's request and must remain removed; do not reintroduce it or change camera/person sizing without explicit owner authorization for that specific change. Shared-file changes for other rooms must preserve this solo-room state. Existing room locks 5051, 5052, 5053 and 5054 remain in effect.

5155 is a maintenance change lock and recoverable source reference, not a runtime password or an access restriction. Runtime controls remain usable. This request authorizes policy recording only, not runtime modifications, and does not claim phone verification beyond what the owner reported.

# Subscriber-room lock released by owner (2026-10-11)

The owner explicitly released subscriber-room maintenance lock 5053 and authorized another narrowly scoped investigation, repair, verification and deployment of subscriber-room broadcast video connections. This supersedes the subscriber 5053 freeze and its reaffirmation above. Preserve all unrelated subscriber UI, layout, chat, buttons, camera/person sizing and access rules. All other room locks remain in effect. This releases a maintenance policy only; it does not remove runtime authentication or subscription requirements. Do not claim phone verification without actual evidence.

# Subscriber viewer state saved by owner (2026-10-12)

The owner approved the current subscriber viewer layout and requested saving it without further changes. Recoverable runtime commit: `cfefe06e3ff1ea82fcb787dc6f1e718450ce4a53`. Preserve four columns and four rows, with the host at the left spanning two rows; retain existing guest seats, chat and participation controls. Subscriber viewers have no attendance controls or bottom rose/crown gift strip and show only the existing single guest earnings HUD. Host and viewer use the one shared renderer in `subscriber-approved-room.js`. The separate `subscriber-viewer-host-layout-20261012.js` file and its script load were deleted; do not reintroduce a legacy subscriber viewer layout or duplicate attendance/earnings overlays. Preserve other rooms and the subscriber host screen. Further changes require explicit owner authorization for the specific change. This saves the approved layout only and does not claim the outstanding LiveKit connection-key issue is resolved.


# 13-person host room saved and locked by owner (2026-10-12)

The owner explicitly approved saving and locking the current 13-person host room after the host video black-margin correction. Recoverable runtime commit: `6b93d4a9831ea1aa25290a05736cf68e75003b8e`; `group13-approved-room.js` blob: `701b3c82329b295edf78a25acc9dc7058ae873be`. Preserve the host-only full-cell video rule (`object-fit:cover; transform:none`) scoped to `.ktg13-room[data-kt-approved13="1"][data-kt-room="13"]`, plus the existing host layout, guest seats, camera/microphone, chat, buttons and communications. Do not change this state without explicit owner authorization for the specific change. All other room locks remain in force. This is a maintenance change lock, not a runtime password; existing room controls remain usable. This policy recording does not claim phone UI verification or authorize additional runtime changes.


# Owner saved and separately locked all five rooms (2026-10-12)

The owner explicitly approved the current state after removal of the colored host video borders and requested separate maintenance locks for every room. Recoverable runtime commit for all five locks: `9a46ea67c8c6ed37d55334701dea6279c0deee4e`. Preserve transparent host borders and removal of the reddish inset effect in `all-five-room-host-mini-no-wave-20260921.js` (blob `bcaba90b4c7bf0e1fd14b7ae4f837066ded6b6f7`). The following locks supersede earlier releases for these rooms. Each lock is independent; authorization to change one room does not authorize changes to another. These are maintenance change locks, not runtime passwords or access restrictions. This record does not claim the outstanding LiveKit connection-key issue is resolved.

## Solo room separately locked (5155)

Preserve the current solo host and viewer screens, full-frame camera and current person sizing. Preserve current video dimensions, framing, backgrounds, headers, chat, buttons, camera/microphone, attendance and earnings where currently present, guest approval, gifts, access rules and communications. Do not modify this room directly or through shared files without explicit owner authorization for the specific change. Existing runtime controls remain usable. Saving this lock authorizes policy recording only, not additional runtime changes or deployment.

## 9-person room separately locked (5051)

Preserve the current 9-person host and viewer screens and approved seat layout. Preserve current video dimensions, framing, backgrounds, headers, chat, buttons, camera/microphone, attendance and earnings where currently present, guest approval, gifts, access rules and communications. Do not modify this room directly or through shared files without explicit owner authorization for the specific change. Existing runtime controls remain usable. Saving this lock authorizes policy recording only, not additional runtime changes or deployment.

## 13-person room separately locked (5052)

Preserve the current 13-person host and viewer screens, including the host-only full-cell video correction. Preserve current video dimensions, framing, backgrounds, headers, chat, buttons, camera/microphone, attendance and earnings where currently present, guest approval, gifts, access rules and communications. Do not modify this room directly or through shared files without explicit owner authorization for the specific change. Existing runtime controls remain usable. Saving this lock authorizes policy recording only, not additional runtime changes or deployment.

## Subscriber room separately locked (5053)

Preserve the current subscriber host screen and approved four-column, four-row viewer layout with the host spanning two rows, no viewer attendance or gift strip, and one guest earnings HUD. Preserve current video dimensions, framing, backgrounds, headers, chat, buttons, camera/microphone, attendance and earnings where currently present, guest approval, gifts, access rules and communications. Do not modify this room directly or through shared files without explicit owner authorization for the specific change. Existing runtime controls remain usable. Saving this lock authorizes policy recording only, not additional runtime changes or deployment.

## Secret room separately locked (5054)

Preserve the current secret host and viewer screens with one host and five guest seats. Preserve current video dimensions, framing, backgrounds, headers, chat, buttons, camera/microphone, attendance and earnings where currently present, guest approval, gifts, access rules and communications. Do not modify this room directly or through shared files without explicit owner authorization for the specific change. Existing runtime controls remain usable. Saving this lock authorizes policy recording only, not additional runtime changes or deployment.


# Solo startup state saved and relocked by owner (2026-10-12)

The owner requested saving the current solo-room state after the narrowly scoped startup reattachment fixes. Recoverable approved runtime commit: `c756a600eccd523c28150d7653afc83b43da5ec5` (includes prior solo host remote-stream exclusion commit `aa2d83fd32a7a2899cb508cbfb7c3e1a14ecaa79`). Preserve the solo-only guards that reuse the prepared live camera/microphone, avoid reassigning the same stream during solo startup, and exclude solo host video from remote viewer first-frame painting. Preserve current video framing, person size, border removal, layout, controls and communications. Solo maintenance lock 5155 is reaffirmed independently of every other room lock. Further changes require explicit owner authorization for the specific change. The owner accepted saving this state; this does not assert startup is entirely flicker-free. This records a maintenance policy only, not a runtime password or permission to make further runtime changes.

# Subscriber guest screen saved and locked (5056; 2026-10-12)

The owner explicitly requested saving the current subscriber guest screen under maintenance change-lock identifier 5056. Approved recoverable runtime commit: `044f52d225f296c76465199d6380b0a104c9b979`. Subscriber renderer file: `subscriber-approved-room.js`, blob `de8420fd4322f7072ce998ebbcb00c5cb29cace2`.

Preserve the shared host-renderer-based subscriber guest screen: four columns and four rows, host at the left spanning two rows, fourteen guest seats with blue person placeholders, existing guest chat and participation controls, no guest attendance or bottom gift strip, and one existing guest earnings HUD. Preserve the subscriber-only fallback that recognizes an empty room type from the subscriber room name, so older host sessions do not fall back to the full-screen single-video viewer. Preserve the existing remote video element and communication handlers.

Do not change this saved subscriber guest behavior without explicit owner authorization for the specific change. Other room locks and the subscriber host screen remain independently protected. 5056 is a maintenance change lock and recoverable source reference, not a runtime password or access restriction. This request authorizes documentation only, no additional runtime edits or deployment. Grid rendering was observed; host video connection remained unverified and the LiveKit authentication error was not resolved by this screen change.

# Secret guest screen saved and locked (5057; 2026-10-12)

The owner explicitly requested saving and locking the secret-room guest screen after the duplicate bottom chat-row correction, under maintenance identifier 5057. Recoverable runtime commit: `3a6be051a3f698ed4e06a78d92992ad1f98ca6dd`. File: `secret-guest-from-host-20261004.js`, blob `3535af7594a56b4cef99551298a0661c03248b68`.

Preserve the secret guest's existing custom bottom chat input and buttons. Keep the common `.kt-remote-bottom` hidden only within `#screen .kt-remote-live[data-kt-sgfh-built="1"]`, so the two bottom rows do not overlap. Preserve the one-host/five-guest layout, yellow empty-seat person placeholders, all custom chat send and participation handlers, media, host screen and access rules. Do not change this saved behavior without explicit owner authorization for the specific change. All other room locks, including subscriber guest 5056, remain independently protected.

5057 is a maintenance change lock and recoverable source reference, not a runtime password or access restriction. This request authorizes documentation only, not further runtime modifications or deployment. The correction was deployed and source/syntax checked; final phone display was not independently verified.


# Owner phone approval and scoped 9-room review (2026-10-12)

The owner approved the 13-person host room shown in their 09:04 phone screenshot and requested preserving it under maintenance lock 5052. Recoverable runtime source: 8c88fd512ec561fb272be95d60c1c63fc5850e6b (same runtime tree as production 4062265ec13d65ca99b2594afb88978d3f2c35c4). Preserve its current framing, full-cell host video, seats, layout and all controls. Other existing room locks remain independent.

The owner subsequently explicitly authorized the 9-person room to use smaller cells like the 13-person room. This review changes only the 9-room grid columns from three to four, keeping nine seats, three rows and the current overall grid height, plus removes the old host scale(.78) rule in favor of the full-cell cover/none rule used by the approved 13-room host. Do not change other rooms, chat, controls, media acquisition, signaling or room entry. This candidate is for review; production release requires a new explicit owner approval after review. Source checks do not establish actual phone video framing.


# Owner correction: restore 9-room three-column layout (2026-10-12)

The owner rejected the four-column 9-room layout because people looked too small, and explicitly requested three cells per row. This supersedes the four-column review direction above. Restore three columns and three rows for the existing nine seats, without changing video-area height, full-cell cover framing, controls, chat, communications, or any other room. This candidate does not authorize production deployment; request owner release approval after reporting checks. The secret-room size request remains pending and is not implemented in this change.


# Owner approval: 9-room saved and relocked (5051; 2026-10-12)

After production release, the owner thanked the assistant and explicitly requested locking the current 9-person room. Approved recoverable runtime commit: `43e76baa295619b2cab511ab08d676a6f798ed4e`; runtime tree: `6f6968d876c1472ea8eea63927f9640ca78f836c`; production deployment: `dpl_4tpR185Kuv9CMGwXFvHM6ZehrR5e` at `k-talk-live-final.vercel.app`.

Preserve three columns and three rows, nine total seats, current video-area height, full-cell host cover framing without the old scale(.78), current borders, host/viewer behavior, chat, controls, camera/microphone, room entry and communications. This supersedes the rejected four-column 9-room direction. Do not alter this state directly or via shared files without explicit owner authorization for the specific change. Other room locks remain independent, especially the approved 13-room 5052 state. The outstanding secret-room request is separate and does not authorize changing this 9-room state.

5051 is a maintenance change policy and recoverable source record, not a runtime password or disabled control. This request authorizes documentation only, no runtime edits or additional deployment. The owner accepted the released state; do not represent that as independent physical-device testing by the assistant.


# Scoped subscriber size review authorized (2026-10-12)

The owner clarified the requested room is the 15-person subscriber room and explicitly requested implementing a slight size reduction. This review reduces only `.ktsubscriber-people` width and height to 90% inside the unchanged stage, centered. Preserve existing host and viewer seat count, column and row rules, host spans, full-cell video fit, controls, chat, camera, microphone, access rules and communications. Do not alter locked 9-room 5051 or 13-room 5052, or implement the independent secret-room request in this candidate. The runtime renderer gains one scoped CSS rule only. Syntax/source checks passed; actual phone appearance remains unverified. Production release requires a fresh explicit owner approval.
