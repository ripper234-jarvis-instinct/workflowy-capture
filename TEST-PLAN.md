# Test Plan

Scope constraint for live execution: all tests are non-destructive. Reads are unrestricted; at most ONE clearly-marked test capture bullet is written, into PInbox only. The hard rules from IMPLEMENTATION.md apply to the tests themselves. The single write is designed to carry several cases at once (exact text, Unicode, length, persistence).

## 1. Functional

| # | Test | Method | Expected | Risks if it fails |
| --- | --- | --- | --- | --- |
| F1 | PInbox share link renders anonymously | Open the share URL in a fresh browser session with no Workflowy login | Outline renders, no login wall | Capture path dead on arrival |
| F2 | Actions LST share link renders anonymously | Same, for the Actions LST share URL | Outline renders | Priority-list routing dead |
| F3 | Target node reachable via fragment link | Open the PP0 current-day fragment URL | View zooms to the target node as root | Captures could land at the wrong level |
| F4 | Anonymous edit capability present | Inspect the shared page UI for editable content without login | Bullets are editable/focusable without an account | Capture silently impossible |
| F5 | Single capture: exact text, exact parent | Create one fresh node in PInbox via the verified technique, type once | Bullet exists with the exact intended text under the intended parent | Core feature broken |
| F6 | Unicode and punctuation in capture text | The one test bullet carries Hebrew, emoji and punctuation | All characters survive verbatim | Real user captures (mixed HE/EN) corrupt |
| F7 | Long capture text | The same bullet carries a long string (~200 chars) | No truncation | Long voice-note transcripts truncated |
| F8 | Persistence across reload | Reload after the write, re-verify text and position | Identical after reload | Uncommitted/local-only writes lost |

## 2. Robustness

| # | Test | Method | Expected | Risks |
| --- | --- | --- | --- | --- |
| R1 | Fresh-session loading screen | Open share URL in a cold session, observe | Dark loading screen resolves to outline; agent waits, does not act early | Acting on a boot screen = clicks into void |
| R2 | Obscured click target | Observe whether toasts/overlays can cover target nodes | Agent detects obscured target, waits/dismisses, does not click blind | Writes into the wrong node |
| R3 | Browser session ending mid-flow | (Analysis + observed behavior) | Uncommitted node reverts; no partial text persisted; agent re-verifies on next session | Phantom bullets believed written but gone |
| R4 | Duplicate prevention | Verify-before-type and type-once discipline | One bullet per capture, always | Duplicate spam the user must not have to clean (deletion is banned) |
| R5 | Focus loss during typing | Screenshot after every micro-step | Any anomaly triggers stop + notify | Garbled or misplaced text |

## 3. Concurrency

| # | Test | Method | Expected | Risks |
| --- | --- | --- | --- | --- |
| C1 | Multiple capture commands arriving at the same time | Analysis + observation of real queued captures | Captures serialize: one agent, one lease, one list at a time; each capture verifies the current state before its own write and re-verifies after | Interleaved writes, nodes created from stale reads, wrong ordering |
| C2 | Capture running while the user edits Workflowy in another window | Analysis (deliberately not executed live: simulating it risks exactly the corruption it studies) | Workflowy realtime sync merges independent appends; the agent's verify-after-every-micro-step catches drifted targets and stops | Node identity drift (the row the agent is about to type into moved or changed), typing into the wrong row, fighting the user's cursor |

Analysis: C1 is the realistic case (burst of voice notes). Mitigation: a capture queue, never parallel writers on one outline, and state re-verification immediately before each write. C2 is rarer but nastier: the user's own edits can move or change the row an agent resolved seconds earlier. The stop-on-anomaly rule is the safety net; the relay endpoint removes the class entirely (no shared cursor, API append is atomic).

## 4. Security

| # | Test | Method | Expected | Risks |
| --- | --- | --- | --- | --- |
| S1 | Invalid/revoked link behavior | Open a bogus share URL | Error page, no outline data leaked | Enumeration or partial access |
| S2 | Full-access link exposure | Analysis | Links treated as secrets: never committed to any repo, never in screenshots shared externally, never in chat logs beyond the user's own channel | Anyone with a link can edit OR DELETE the whole shared outline |
| S3 | Revocation path | Analysis (not executed: revoking the live links would break capture) | Rotating the share link in Workflowy settings instantly invalidates old links | Old links linger after a leak |
| S4 | No-login surface | Verify the share page works without any account | No credentials in the browser profile at all for this flow | Credential theft surface reduced to zero |

Analysis: the full-access anonymous link is the weakest point of the current design: it is a bearer capability with edit AND delete power over real user data. The compensating controls are secrecy, the no-delete discipline on the agent side, and revocation-on-suspected-leak. The long-term relay is strictly better: append-only, per-user token, server-side key, rate-limited, revocable per token without touching the user's Workflowy sharing setup.

## 5. Performance

| # | Test | Method | Expected | Risks |
| --- | --- | --- | --- | --- |
| P1 | Share page cold-load time | Time from navigation to rendered outline, fresh session | Seconds, not tens of seconds | Slow boot times out capture flows |
| P2 | Capture end-to-end latency | Time from starting the write flow to reload-verified bullet | Tens of seconds acceptable for chat capture | User perceives loss if confirmation lags |
| P3 | Relay comparison | Analysis | One API call (~1s) vs multi-step browser flow (30-60s) | Browser path stays the bottleneck until relay exists |

## 6. Trade-off analysis

| Option | Works now | Robustness | Security | Speed | Cost |
| --- | --- | --- | --- | --- | --- |
| Anonymous shared-link browser capture (current) | Yes | Fragile (UI automation, focus, overlays) | Weak (full-access bearer link) | 30-60s per capture | Zero setup |
| Hosted relay proxying WF API (target) | Needs the developer (~small service) | Strong (one atomic API call) | Strong (append-only, per-user token, no read access) | ~1s | Build + host + maintain |
| Direct API from the assistant | No (no outbound API surface for vault secrets) | - | - | - | Blocked by platform |
| Email capture (fallback) | Yes | Strong | Fine | Minutes | Manual triage into Workflowy |

Conclusion: keep the browser path as the working bridge, hold the hard rules as the safety net, and treat the relay as the real fix.
