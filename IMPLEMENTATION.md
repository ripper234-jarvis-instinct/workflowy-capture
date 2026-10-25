# Implementation status

The current behavioral contract is [CAPTURE-PROCEDURE.md](CAPTURE-PROCEDURE.md). This file does not define a second procedure.

## Established scope

Browser-based, sequential, add-only capture through private share links. No API or email fallback. Exact destination, top placement, payload, hierarchy and link checks are mandatory. Latest confirmed routing wins; an untagged task-like message is not an inbox capture.

## Requirements, not implementation claims

- One writer must own each attempt. Do not claim a deployed mutex or durable queue merely because this repository describes one.
- Keep the original request and truthful pending state in a private persistent record where available.
- Find a supported new-item control and prove fresh editor identity, parent and focus before typing.
- Read back after a save opportunity and reopening. A fixed delay is not a save acknowledgment.
- Reconcile a timeout or partial write read-only. Replacement copies and repairs need explicit authorization after a content change.

The v0.5 documentation review did not run capture, install a queue, implement idempotency, validate a top-add control or prove a safe long-input method. If a required capability cannot be established, the outcome is blocked or unverified, not success.

Historical API examples and earlier test passes are not evidence that these requirements are implemented today.
