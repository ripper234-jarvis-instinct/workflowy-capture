# Concurrency Test Suite

Scope: the capture feature writes bullets into shared Workflowy outlines while the
user (or another agent run) may be editing the same outline at the same time.
This suite proves the capture path cannot corrupt the outline under concurrency,
and documents where it currently can lose or misplace data.

Design principle (owner): **robustness over performance** - never corrupt, never
touch existing nodes; slower is fine.

## Hard rules for every live test

1. Add-only: create a fresh node, type the text, done. Never delete, never edit,
   never drag, never reposition existing nodes.
2. Verify the caret is inside a FRESH blank node before typing anything.
3. Only clearly-marked test strings (`CONC-TEST-*`).
4. Stop and notify on any anomaly. No data repair - mistakes stay untouched and
   get reported ("fix the algorithm, not the data").
5. Fingerprint the visible outline before and after the run; the only allowed
   diff is the addition of the test's own nodes.

## Harness

- Cloud browser, anonymous full-access share of a test/working outline.
- Two tabs on the same share URL act as two independent clients with real-time
  sync (one plays "the capture agent", the other plays "the user editing").
- Node creation: the outline's "+ New node" affordance (fresh bottom node,
  caret inside it). Typing: per-character keystrokes into the focused node.
- Verification: DOM text snapshot + screenshot after every micro-step, and a
  full reload-verify at the end of each test.

## Tests

### CT-1 Baseline single capture (control)
One capture, no concurrency. Steps: fingerprint, create node, verify caret,
type once, screenshot-verify, reload, verify exactly once, fingerprint diff.
Pass: node persisted exactly once; zero changes to pre-existing nodes.

### CT-2 Two captures at the same time (writer/writer race)
Two clients each create a blank node, then type interleaved.
Pass: both texts land intact, exactly once each, no merged/garbled text,
no lost node, no existing node altered.
Watch for: ordering surprises, dropped blank nodes, sync echo confusion
(each client seeing the other's blank node as its own).

### CT-3 Capture while the user edits the same outline (remote insert mid-capture)
Client A creates its blank node and pauses (caret armed, not yet typed).
Client B inserts its own node and types immediately. A then types.
Pass: A's caret survives B's inbound sync; both nodes persist intact.
Watch for: caret theft, caret node deleted by sync, caret silently retargeted
to an existing node (the known incident class).

### CT-4 Session reload / crash mid-capture
- CT-4a: create node, type, reload IMMEDIATELY (race the sync).
- CT-4b: create node, reload BEFORE typing.
Pass (target behavior after mitigation): no duplicate, no orphan blank,
capture either fully present or cleanly resumable/retryable.
Documents the durability gap between "node created" and "text synced".

### CT-5 Stale reference / stale coordinates safety
Take a snapshot (refs + coordinates), mutate the DOM (reload or remote edit),
then attempt to act on the stale ref/coordinate WITHOUT typing.
Pass: stale refs are rejected (unknown ref), and the verify-caret gate refuses
typing into anything that is not a fresh blank node.

### CT-6 Capture while the user reorders/deletes elsewhere - ANALYSIS ONLY
Cannot be executed under the hard rules (we never reorder or delete, even in
simulation). Covered by design: fingerprint-based conflict detection
(LOCKING-DESIGN.md, component C5) must treat any unexpected structural change
as abort-and-replan, never force. Residual risk: if the user deletes the exact
fresh node mid-capture, the capture is lost; detection = post-write reload-verify,
recovery = re-run the capture as new (idempotency key makes the retry safe).

### CT-7 Rapid sequential captures (queue pressure)
Fire N captures back-to-back from one client with no pauses.
Pass: all N present exactly once after reload, in some order, nothing else changed.
Currently expected to expose interleaving risk when more than one capture task
runs at once (the reason for the serialization lock).

### CT-8 Duplicate command delivery (at-least-once submission)
Submit the SAME capture command twice (retry, double-tap, wake refire).
Pass: exactly one node results. Requires idempotency keys
(LOCKING-DESIGN.md, component C4). Analysis until the key mechanism lands.

## Status legend
EXECUTED LIVE / ANALYSIS ONLY / BLOCKED-BY-RULES, per run, in CONCURRENCY-RESULTS.md.
