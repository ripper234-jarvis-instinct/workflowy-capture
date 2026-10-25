# Protocol review: 2026-10-25

## Judgment

The supplied eight-part protocol is a better safety contract than the accumulated earlier guidance. Adopted as v0.5, with established routing, voice archival, hierarchy and response preferences integrated into one document. It reduces user interaction by making safe stops and pending state explicit instead of relying on repeated recovery questions.

It does not solve browser focus, persistence or long-input limits by itself. A stricter contract may block captures that formerly used unsafe insertion or retry fallbacks. That is preferable to damaging existing content or claiming incomplete work was saved.

## Conflicts resolved

| Earlier guidance | Current resolution |
| --- | --- |
| README said order did not matter; later user instruction requires top placement | Top unless explicitly changed; no silent bottom fallback |
| Implementation sent untagged task-like notes to inbox | Latest confirmed routes only; no untagged-task default |
| Create-and-type immediately / assume caret stays fresh | Reinspect after creation and prove editor identity, parent and focus |
| Title-End/Enter or existing-row insertion | Prohibited in existing content; supported new-item control only |
| Complete orphan blank / recreate after user deletion / retry by matching text | No inferred identity or automatic repair/replacement; uncertainty reconciled read-only |
| Change method or compress payload on retry | No silent compression; one zero-change retry only, otherwise explicit recovery authorization |
| Wait a fixed time or local text read proves sync | Save opportunity plus reopened exact read-back, with limits stated |
| Earlier tests mean capture works now | Historical observations preserved, not a current reliability claim |
| Queue/idempotency design described as if implemented | Requirements/design only until implementation is actually established |
| Older typed success reaction-only rule | Latest supplied protocol requests a brief destination/item-link reply when available |
| API route promoted as current alternative | Retained historical material, unavailable for present workflow |

## Failure coverage

The contract addresses observed wrong-focus/title corruption, heading splits, ambiguous blanks, wrong bucket, newline/hierarchy failures, contaminated payloads, unclickable links, missing nested/audio children, reload loss, uncertain timeouts and duplicate partial retries. Existing public issues #1-#3 and historical results inform the review; their recovery descriptions are not new permissions.

Potential mechanisms such as delayed sync or uncommitted input remain hypotheses where not directly observed. Neither a vendor outage nor a single universal cause is established. Known save-loss and long-input incidents prevent a claim of dependable capture parity.

## Validation performed and not performed

Performed: read current repository documents and open incidents; compared them against the supplied protocol and recovered failure history; checked current document links, consistency, privacy and changed-file scope.

Not performed: Workflowy navigation, capture writes, live tests, cleanup, credential changes, API calls, deployed locking/queue implementation or a production reliability trial. No private share links or user task contents added. Existing history, license and API example retained, not deleted.

## Operational handoff

Use CAPTURE-PROCEDURE.md as the single current contract. If a supported top-add control cannot be demonstrated, keep the original request pending and report blocked. A separately authorized test area and measured acceptance results are needed before describing any unfamiliar insertion or long-input method as working.
