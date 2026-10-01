# Incidents

Anonymized learnings from operating the browser capture path. No personal names, no user data, no specifics beyond what is needed for the learning.

## I1: Keyboard insert-at-top created stray blank nodes

**What happened:** To place a capture at the top of a list, the agent clicked into the first existing bullet, pressed Home, then Enter to open a new row above it, then typed. Across attempts this intermittently jumped focus and produced stray blank bullets and, on one occasion, duplicate bullets.

**Repair attempt made it worse:** On one retry the agent typed the capture text into a stray blank row left by an earlier attempt. The capture landed, but two separate actions (the failed insert and the new capture) had been entangled into one edit, making the state hard to reason about.

**Learnings:**
- Keyboard-driven insert-at-top in this editor is not deterministic. Dropped.
- Never reuse an existing or blank row for a new action. Every action creates its own fresh node.
- Verify with a screenshot after every micro-step, not just at the end.
- On the first anomaly: stop, change nothing more, notify.

## I2: Obscured click target on first attempt

**What happened:** The first attempt to click into the shared outline failed because the target was obscured (page overlay/toast). The agent stopped without typing or changing anything and reported with a screenshot.

**Learnings:**
- The stop-and-report rule worked as designed: zero unwanted mutations.
- Wait for full render and dismiss overlays before interacting with target nodes.

## I3: Cleanup by deletion

**What happened:** After the duplicate/blank-node incident, stray rows were removed manually to "clean up". The user ruled this out: cleanup is dangerous because an agent can delete too much, and deletion of real data is unrecoverable.

**Learnings:**
- Prevention over cleanup: verify every micro-step so stray nodes never appear.
- Absolute rule: NEVER delete anything, never cross off anything. Errors are reported to the user, not repaired by the agent.

## I4: Uncommitted node lost when the browser session ended

**What happened:** A blank node created during an insert sequence was visible in one screenshot but gone after the browser session was released and the page reloaded. The node had never been committed by the editor.

**Learnings:**
- A visible row is not a persisted row. Only a reload-and-reverify proves a write.
- Session loss mid-flow leaves no partial state behind, but also no completed write: always re-verify after reload before reporting success.

## I5: Enter inside a node title split it into two rows

**What happened:** During a capture, the agent clicked a node's text and pressed Enter before zooming in. The node title ("X / Y") split into two separate rows - existing content was altered. The agent stopped immediately and reported.

**User ruling:** No restore, no merge, no touch. The split stays exactly as-is. Absolute rule going forward: NEVER revert, restore, or merge; a mistake is left untouched and reported both to the user and to this incident log.

**Learnings:**
- Never type or press keys until the header confirms you are zoomed into the right node.
- Never click node TEXT to navigate; click the bullet dot or use the fragment link.
- No repair by the agent, ever - report to the user and to the incident log, leave the state as-is.

## I6: Obscured/off-viewport click focused an existing node's text

**What happened:** During a test capture, the agent clicked a "new node" button ref captured before scrolling. The element was off-viewport (obscured); the click landed inside an existing node's text and placed the caret there. Because the rule is screenshot-verify before typing, no text was entered and no content changed. The agent pressed Escape to blur, re-located the button on-screen, and completed the capture cleanly.

**Learnings:**
- Refs go stale after scroll: re-read and click only elements with verified on-screen bounds.
- A click landing in existing content is one keystroke away from corruption: verify caret location before ANY typing.
- The verify-before-type discipline turned a potential corruption into a non-event.

## I7: A short capture came out altered ("Japan66666")

**What happened:** A short capture was typed and the saved text ended up with extra repeated characters appended. The text did not match what was sent.

**Learnings:**
- Verify the exact saved string against the intended string, not just that a node exists.
- The altered node was left untouched under the no-touch rule and reported.

## I8: Blank child created under a weekday node ("Monday")

**What happened:** An action left a blank child node under an existing weekday-named node. No text was lost, but the outline gained a stray empty row.

**Learnings:**
- Never reuse the blank row for the next capture.
- The blank stays untouched and is reported.

## I9: Capture landed in an unexpected position ("555455")

**What happened:** A numeric capture appeared at a different position in the list than the agent expected.

**Learnings:**
- Position assumptions are unreliable. Order does not matter for captures, so verify presence and exact text, not position.

## I10: Reload right after typing lost the node text (F1)

**What happened:** In a concurrency test, a node was created, text was typed, and the page was reloaded immediately. After the reload the node existed but was empty; the typed text never reached the server.

**Learnings:**
- Reload right after typing loses the capture text. This is the same gap a crash, tab close, or network drop would hit.
- The sync-wait gate is now mandatory in the capture procedure: wait for sync before any reload.

## I11: Duplicate capture ("BBBBBB")

**What happened:** Attempt 1 synced late. The reload used for verification happened too early and showed nothing, so the agent retried, and the retry added a second copy. Both copies were left untouched under the no-touch rule and reported.

**Learnings:**
- Verification reload before sync completes gives a false negative.
- Retrying on a false negative creates duplicates. Wait for sync first; if a retry is needed, check for the first copy after sync settles.
- An idempotency marker per capture would make retries safe.
