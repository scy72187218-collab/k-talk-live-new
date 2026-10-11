# 13-room owner change lock (5050)

The owner froze the current 13-person host and guest state on 2026-10-11. See `LOCK_GROUP13_HOST_GUEST_5050_20261011.json` for the exact recoverable commit and protected file blob hashes.

Preserve all 13-room host and guest layout, chat display area and input, separate circular icons, attendance counter heart, clock-side likes, approved guest video fill, camera/mic, approval, gifts, roses and business connections. Do not refactor, replace, or change these as collateral work. Edit protected 13-room behavior only when the user explicitly authorizes the specific change. An explicitly authorized fix is scoped to that fix. Changes to other rooms in shared files must preserve this 13-room behavior.

5050 is the owner's change lock identifier. This is a maintenance policy and recoverable Git snapshot, not a runtime password or GitHub branch protection. Chat, hearts, camera/mic, gifts and other runtime controls must remain usable.

Do not claim phone UI verification from source tests or successful deployment alone.

# 9-room owner change lock (5051)

The owner froze the current 9-person host and guest state on 2026-10-11. See `LOCK_GROUP9_HOST_GUEST_5051_20261011.json` for the recoverable source commit and file blob hashes.

Preserve the 9-room header above the LED, attendance and separate like counters, host and guest layout, video fill, chat area and input, icons, camera/mic, guest approval and existing business connections. Change protected 9-room behavior only when the owner explicitly authorizes the specific change. Shared files may be changed for other rooms only while preserving 9-room behavior. Existing 13-room lock remains in effect.

5051 is a maintenance policy identifier, not a runtime password or repository access control. All runtime room controls remain usable. Do not claim phone verification from deployment or source checks.
