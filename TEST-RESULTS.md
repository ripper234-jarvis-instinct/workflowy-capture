# Test Results

Executed against two live shared outlines (PInbox and Actions LST) with an anonymous cloud-browser session (no Workflowy login). Constraint honored: reads plus exactly ONE test write, into PInbox only. All hard rules were in force during the run. No user content was read into this document; structural facts only.

Legend: PASS (executed), OBSERVED-PASS (verified from real behavior observed earlier), ANALYSIS (evaluated without live execution, by design).

## 1. Functional

| # | Result | Evidence |
| --- | --- | --- |
| F1 | PASS | PInbox share URL rendered the full outline anonymously. No login wall; "Add to account" shown (anonymous view). |
| F2 | PASS | Actions LST share URL rendered anonymously the same way. |
| F3 | PASS | Fragment URL zoomed directly into the PP0 current-day node (header showed the expected breadcrumb). the earlier test captures were all present, each exactly once. |
| F4 | PASS | Anonymous edit capability confirmed: "+ new node" affordance present and nodes editable with no account. |
| F5 | PASS | One fresh node created in PInbox via the "+" affordance; exact intended text landed under the intended parent. Verified by screenshot and DOM read (exact string match, 201 chars). |
| F6 | PASS | Hebrew, emoji and punctuation all survived verbatim in the test bullet. |
| F7 | PASS | 201-character bullet accepted with no truncation. |
| F8 | PASS | After a full reload, exactly one occurrence of the complete test text. Persistence confirmed. |

## 2. Robustness

| # | Result | Evidence |
| --- | --- | --- |
| R1 | PASS | Cold loads resolved from loading screen to rendered outline in ~5s each (including tool overhead). No hangs. |
| R2 | OBSERVED-PASS | Two real cases earlier: an obscured target stopped the agent before any mutation (see INCIDENTS I2), and an off-viewport click placed the caret in an existing node - caught by verify-before-type, zero harm (INCIDENTS I6). |
| R3 | OBSERVED-PASS | Uncommitted blank node was gone after the browser session ended: no partial state persisted (INCIDENTS I4). |
| R4 | OBSERVED-PASS | After the type-once/verify discipline was adopted, every capture landed exactly once (verified in the outline). |
| R5 | PASS | Screenshot verification after each micro-step caught the one focus anomaly in this run before any damage. |

## 3. Concurrency

| # | Result | Evidence |
| --- | --- | --- |
| C1 | OBSERVED-PASS | Multiple capture commands arrived within minutes earlier. They were processed serially (one agent, one list at a time, state re-verified per capture) and all landed in the correct order. Serialization is the mitigation; it held. |
| C2 | ANALYSIS | Not executed live (simulating it risks the corruption it studies). Risk stands: the user's own edits can move a target row mid-capture. Mitigations: verify-after-every-micro-step + stop-on-anomaly; the relay removes the class entirely (atomic API append, no shared cursor). |

## 4. Security

| # | Result | Evidence |
| --- | --- | --- |
| S1 | PASS | Bogus share URL returned a generic 404 ("no longer there or you don't have permission"). No outline data leaked. |
| S2 | ANALYSIS | Full-access links are bearer capabilities with edit AND delete power. Controls in force: links never appear in this repository or its history, and never in externally shared screenshots. |
| S3 | ANALYSIS | Not executed (revoking the live links would break capture). Workflowy share settings allow link rotation, which invalidates old links. Recommendation: rotate on any suspected exposure. |
| S4 | PASS | The whole flow ran with zero login: no Workflowy credentials exist in the browser profile. "Sign up / Log in" and "Add to account" prompts confirm the anonymous state. |

## 5. Performance

| # | Result | Evidence |
| --- | --- | --- |
| P1 | PASS | ~5s from navigation to rendered outline on a cold session, for both share links (includes automation overhead; human-perceived render is faster). |
| P2 | PASS | Happy-path capture latency ~30s (fresh node, type once, verify). This run took ~70s wall-clock including the anomaly pause in R2 - still acceptable for chat capture, and the anomaly handling is the safety feature, not overhead. |
| P3 | ANALYSIS | A relay call is one API request (~1s) vs the multi-step browser flow (30-60s). The browser path remains the bottleneck until the relay exists. |

## Summary

- Executed live: 12 tests - 12 PASS, 0 FAIL.
- Observed from observed real behavior: 5 tests - 5 OBSERVED-PASS.
- Analysis only (deliberately not executed): 4 items (C2, S2, S3, P3).
- Anomalies encountered during the run: 1 (off-viewport click, R2/I6) - contained by the hard rules, zero user-content impact.
- One test bullet written as planned, clearly marked "TEST capture ... safe to ignore", left untouched at the bottom of PInbox per the no-delete rule.

## Verdict

The browser capture path works now and the hard rules demonstrably contain its failure modes. Its ceilings are structural: UI fragility, the full-access bearer link, and 30-60s latency. The hosted relay (append-only, per-user token, server-side key) remains the correct long-term fix.
