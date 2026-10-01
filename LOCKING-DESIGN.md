# Capture Concurrency - Internal Locking Design

Owner principle: **robustness over performance**. Every trade-off below is
resolved toward never-corrupt / never-lose-silently, even at the cost of speed,
extra reads, and aborted runs that must be retried.

## Threat model (all observed live or in production incidents)

- T-a: two capture commands in flight at once (parallel task runs, refired wakes).
- T-b: the user edits the same outline in his own window mid-capture.
- T-c: the user reorders or deletes nodes mid-capture.
- T-d: session reload / crash / network drop mid-capture.
- T-e: stale UI addressing (refs, coordinates, remembered positions) after any
  of the above shifts the DOM - the incident class that altered an existing node.
- T-f: duplicate command delivery (retry, double submission).

## Components

### C1 - Capture queue (serialization)
All capture commands for a target list enter one FIFO queue. Exactly one
capture executes at a time per target list. This removes T-a entirely on our
side: we can never race ourselves. Queue entries carry: capture id, text,
target list, target section, enqueued-at, attempt count.
Cost: captures take turns (seconds each). Accepted - robustness over speed.

### C2 - Single-writer mutex around the critical section
The executing capture holds an exclusive logical lock for the whole critical
section: `snapshot -> create -> verify caret -> type -> verify -> reload-verify`.
A second runner that finds the lock held queues instead of proceeding (never
"barges in"). The lock carries a timeout (e.g. 3 minutes); on expiry the next
runner does NOT continue the abandoned capture - it re-validates state from
scratch and re-queues the capture as a fresh attempt (C4 makes the retry safe).
This is a mutex over behavior, not over the shared page: the user is always a
concurrent writer we cannot lock out, which is what C3/C5 are for.

### C3 - Verify-state-before-write gates (hard gates, in order)
1. Fresh snapshot immediately before any action; refs/coordinates are used
   exactly once and never across a DOM mutation (reload, scroll, sync event).
2. Node creation ONLY via the fresh-node affordance; never by clicking into
   existing text when an add-only alternative exists.
3. **Caret gate**: before typing, prove the caret sits in a fresh blank node -
   empty text, editable content element, expected position, created by this
   run. Any mismatch: stop, do not type.
4. Type once. Screenshot + DOM-verify immediately.
5. **Sync gate**: wait for the outline to settle (own text present in a fresh
   re-read) before any reload, close, or handoff. (Direct fix for F1.)
6. Reload-verify: the capture appears exactly once, and the fingerprint diff
   shows no other change.

### C4 - Idempotency key per capture
Every capture gets a durable id (uuid) at enqueue time, before any write.
The key is derivable from the node we create: on retry/resume, the runner
first searches the target list for its own in-flight artifact (an own blank
node in the expected position, or the capture text already present):
- text present exactly once -> declare success, do nothing more;
- own blank found -> complete it (type the text), then verify;
- nothing found -> run the capture as new.
This makes every retry safe and turns CT-8 into a non-event, and makes crash
recovery resumable instead of blind. (Where a hidden marker is acceptable, the
relay API path can store the key in node metadata; the browser path uses the
search protocol above.)

### C5 - Conflict detection (list changed under us = abort, not force)
Fingerprint the visible outline (ordered node texts) at snapshot time. Re-check
before typing and after the sync gate. If structure changed in a way that
invalidates the plan (target section moved, sibling order shifted around the
insertion point, expected node missing): ABORT the capture attempt, re-plan
from a fresh snapshot, retry through the queue. Never force a write into a
layout that no longer matches assumptions. User edits are never an error -
they are a reason to re-plan. Deletes of our own in-flight node are detected
by the post-write verify and handled as a fresh re-attempt (C4).

### C6 - Anomaly protocol (unchanged, now enforced by the lock holder)
Any gate failure or unexpected state: stop immediately, leave all data
untouched (no revert, no delete, no repair), notify the owner, log the
incident, run the 5-whys. "Fix the algorithm, not the data."

### C7 - The structural fix: relay/API path
Browser concurrency control is mitigation, not cure. The relay endpoint
(direct create-bullet API) collapses the whole class:
- server-side queue = C1 for free, single process writer;
- atomic create-with-text = no caret, no coordinates, no T-e, no F1 gap;
- server-assigned node id returned synchronously = native idempotency handle;
- no UI state to go stale.
Until the relay ships, C1-C6 govern the browser path.

## Mapping: incidents -> components

| Incident | Root mechanism | Fixed by |
|----------|----------------|----------|
| Existing node altered by misplaced caret | stale addressing + skipped caret gate (T-e) | C3 gates 1-3, C5 |
| Captures landed in unexpected positions | local position assumptions under concurrency (O1) | C1, C5; order declared non-load-bearing |
| Capture text lost on reload | durability gap create vs sync (F1, T-d) | C3 gate 5, C4 |
| Risk of double-add on retry | no idempotency (T-f) | C4 |
| Two agents writing simultaneously | no serialization (T-a) | C1, C2 |

## Non-goals
- Locking the USER out of his own outline. Impossible and unwanted; we detect
  and re-plan instead.
- Preserving capture order or position. The owner declared order non-load-bearing;
  position assumptions are removed from the algorithm rather than defended.
