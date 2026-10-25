# Proposed v0.5 acceptance plan

NOT EXECUTED. This plan grants no permission to write. Obtain separate authorization for an isolated test area, exact payloads, permitted actions and test bounds. Never experiment in real task lists. No cleanup or destructive test is authorized by this plan.

All tests must follow [CAPTURE-PROCEDURE.md](CAPTURE-PROCEDURE.md). Stop on unexpected changes and report the actual state. Preserve before/after evidence privately; publish sanitized results only.

| Case | Acceptance evidence |
| --- | --- |
| Supported top-add | New control clearly targets parent and first-child position without editing an existing heading/task; fresh editor identity, emptiness and focus established |
| Wrong focus | Search, heading or existing-row focus detected before payload entry; no probe character |
| Exact text | Hebrew/English, punctuation and emoji match original after reopening |
| Existing similar text | Distinguish another request from this attempt; no false success from matching text alone |
| Multiline/nesting | One parent and each requested child verified separately, no literal backslash-n or extra top-level fragments |
| Long text | Full exact payload, no truncation or dispatch ambiguity; length limit must be measured, not inferred from a short test |
| Links/audio | Actual clickable targets, intended resource and correct private access; no missing audio or separate unintended link child |
| Save/reopen | Save opportunity recorded, no active-editor immediate reload; complete structure survives reopening parent and bucket |
| Timeout/interruption | Uncertain write classified correctly; read-only reconciliation; no automatic replacement or blank reuse |
| Retry boundaries | One retry only after zero content change and resolved cause; blank/partial/uncertain attempt requires explicit recovery authorization |
| Routing | All established routes, explicit destination and no untagged inbox default; dated parent/task child |
| Filters/tall lists | Identity and duplicate checks remain valid; filtered absence not treated as proof of absence |
| Sequential requests | No overlapping writes; truthful queue/mutex status; human changes lead to reinspection rather than forced writes |
| Manual entry | Pending request closed, no later retry |
| Reporting | Immediate warning plus explanation for failure; complete verification before success; no partial-child success |

Report executed, failed, blocked and analysis-only cases separately. A small passing run is not a reliability rate or permanent-fix claim. Concurrency experiments involving another writer, deletion or reordering need their own explicit authorization and must not be run as part of ordinary capture.
