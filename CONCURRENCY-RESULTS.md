# Concurrency Test Results - Run R1

Environment: cloud browser (config-c, read lease), two tabs as two independent
synced clients on the anonymous full-access share. All writes add-only with
`CONC-TEST-*` strings at the outline root bottom, far from active sections.
Baseline fingerprint: 12 visible root nodes. Final: 18 (baseline + 6 test
nodes), verified by exact DOM diff AND screenshot. Zero pre-existing nodes
altered, moved, or lost at any point.

| Test | Status | Result |
|------|--------|--------|
| CT-1 baseline | EXECUTED LIVE | PASS |
| CT-2 two simultaneous captures | EXECUTED LIVE | PASS with observation O1 |
| CT-3 remote insert mid-capture | EXECUTED LIVE | PASS with observation O2 |
| CT-4a reload immediately after typing | EXECUTED LIVE | **FAIL (F1)** - text lost |
| CT-4b reload after create, before type | COVERED BY CT-4a | orphan-blank behavior observed in F1 |
| CT-5 stale ref / verify gate | EXECUTED LIVE | PASS |
| CT-6 user reorders/deletes | ANALYSIS ONLY | see suite doc + design C5 |
| CT-7 rapid sequential captures | NOT RUN this run | scheduled for next run |
| CT-8 duplicate delivery | ANALYSIS ONLY | needs idempotency keys (C4) |

## Failures

**F1 - Reload/crash between node-create and text-sync loses the capture text.**
CT-4a: node created, text typed, page reloaded immediately. After reload the
fresh node existed but was EMPTY; the typed text never reached the server.
Result: an orphan blank node and a silently lost capture. This is the same
durability gap that a real crash, tab close, or network drop would hit.
Recovery demonstrated: the orphaned own-blank node was located by
re-verification (empty + last position + caret gate) and completed with its
intended text - i.e. resume-by-completion works, but only because the node was
findable. Without an idempotency marker, an automated retry could just as
easily double-add. Root fix: design components C3/C4.

## Observations

**O1 - Concurrent creates can invert expected order.** CT-2: client A created
its blank first, client B second; after both typed, B's text sat ABOVE A's.
Cause: each client's "add at bottom" is computed against its local view before
the other's create syncs in; the server resolves the collision by its own
ordering, not by click order. Harmless under the owner's "order is not an
issue" rule, but it proves local position assumptions are void under
concurrency - never reason from remembered positions.

**O2 - Caret survives remote inserts (in this build).** CT-3: client A's armed
caret stayed in its own fresh blank node while client B's node synced in, and
A's text landed correctly. Good news, but this is empirically version-dependent
browser behavior, not an API guarantee - the verify-caret gate remains
mandatory because an earlier incident showed the failure mode is real when the
gate is skipped.

**O3 - Stale references are hard-rejected.** CT-5: a ref from a pre-reload
snapshot returned `unknown ref`. The harness layer protects against stale
REFS; it cannot protect against stale COORDINATES or stale visual position,
which is exactly how an existing node got altered earlier (misplaced caret).
Defense is procedural: fresh snapshot before every action + verify caret in a
fresh blank node before typing.

**O4 - Real-time sync between clients is fast (<2s observed)** and echoes
blank nodes both ways. A second writer's un-typed blank node is visible to the
other client, so two writers can mistake each other's blanks for their own if
they identify nodes by "the empty one at the bottom". Node identity must be
established at creation time (position + emptiness + recency), never assumed.

## Integrity statement
Run R1 added exactly 6 marked nodes (CONC-TEST-1, -2, -3, -4, -5, -U1) and one
pre-existing blank node remained as found. They are left in place per the
no-delete rule; the owner can hand-remove them whenever convenient.
