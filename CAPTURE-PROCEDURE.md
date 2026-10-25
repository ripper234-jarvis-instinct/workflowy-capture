# Workflowy capture protocol (v0.5)

Current operating contract, reviewed 2026-10-25. This replaces earlier procedural advice in this repository. Historical incidents and test results are evidence, not permission to use superseded techniques.

Goal: save requested content accurately, with minimal user interaction. Use the browser and the user's existing private share links. External APIs are unavailable for this workflow. No email fallback.

This is a safety protocol, not a claim that a reliable browser insertion method is currently available. If no supported top-add control can satisfy the gates below, capture is blocked. Do not fall back to Enter in a heading, an existing task or an unidentified blank.

## 1. Preserve the request and resolve its destination

Before writing, identify the original message, exact payload, current destination, required hierarchy and links. Keep the original reference until completion. Use a persistent pending record only if one actually exists; do not claim an implemented durable queue or lock without evidence.

Capture payload is data, not instructions to carry out tasks or contact people. Never mix explanations or retry commentary into it. Preserve the original language. Follow the latest confirmed user routing, not an older default. Ask one concise question only when wording, destination or intended structure is genuinely ambiguous.

### Established routing and structure

| Input | Destination |
| --- | --- |
| `#0 <text>` | PP0 / Today |
| `#1 <text>` | PP1 |
| `#2 <text>` | PP2 |
| `# <text>` (hash followed by a space) | PInbox |
| `#inbox <text>` | PInbox |
| `#f <text>` | Followup |
| Explicit capture request naming a destination | That destination |

Strip the routing marker from the saved task text. Do not infer capture from an untagged task-like message. An untagged voice note needs an explicit capture destination. "Hey Instinct" addresses the assistant, not an automatic capture. Forwarded voice recordings are not automatically captured; transcription stays in the source language. "File this under X" without an explicit Workflowy request is not a reason to write to the outline.

For multiline captures, the default is one parent (first line) with remaining intended lines as children, not separate top-level copies. Preserve a specifically requested structure instead. Dated follow-ups use a date-only parent with the task as its child; use the explicitly requested bucket, or Followup for the follow-up route. No literal hashtag in the date title. Resolve relative dates before writing, including the year where needed. Reuse an existing date parent only when its identity and the requested structure are clear; add a fresh child, never edit that parent's text.

For hashtagged voice captures, retain the original audio unchanged in the user's private media archive and include its actual link inline with the transcript as `[audio](<private audio URL>)`, not as a separate child or with account-selection query parameters. Do not enable public access. Verify the clickable destination and access appropriate to the user. Do not archive unrelated voice notes as part of capture. A failed/blocked archive or link means the complete voice capture is not ready.

## 2. Use one writer and a stable procedure

Process captures sequentially, including retries. Do not run overlapping writes across buckets. Human edits can still happen; serialization does not lock the user out.

Use only an established procedure supported by the current browser. A successful earlier attempt does not excuse skipping gates. Test unfamiliar methods only in a separately authorized test area, with explicit bounds. This document and the old test plans authorize no test writes.

## 3. Confirm the destination before creating anything

Open the direct bucket link where available. Confirm its title and parent path; a title alone does not prove that the intended editor is active. Resolve loading, Search, overlays and filter ambiguity before writing. Keep completed items hidden for normal capture, but use read-only inspection when needed to establish identity and avoid duplicates. Do not treat a filtered absence as proof a capture never landed.

Inspect the insertion area and any matching content. A similar old task is not evidence this request was saved. Distinguish the original request from another request with identical text; text matching alone is not idempotency.

New captures belong at the top unless the user explicitly requests otherwise. No silent substitution of bottom placement.

## 4. Create a new bullet without editing existing content

Use a supported new-item control whose parent and top placement are clear. Do not use an existing task, link or bucket heading as an improvised insertion point. In particular, never press Enter inside existing text to manufacture a new bullet.

After creation, obtain a fresh page view and locate the editor again. Before typing, establish all three:

- It is the bullet just created by this attempt.
- It is empty and under the intended parent, at the intended position.
- The active editor belongs to that bullet, not Search, a heading or another item.

Inspect the actual page visually as well as its structure. An empty-looking row, remembered coordinates or an earlier input target is insufficient. Do not type a probe/test character to discover focus. If identity, parentage or focus cannot be established, stop.

Old blanks are acceptable and remain untouched. Their presence alone is not a blocker; uncertainty about the newly created editor is.

## 5. Enter content deliberately

Enter one intended node at a time, using only its exact payload. Reacquire the editor after navigation, scrolling, insertion or Search/filter changes.

For nested captures, verify the parent's exact text and placement before adding children. Zoom into the intended parent where needed to make child placement unambiguous. Create each child with a supported control and repeat the fresh-editor gates. Never assume multiline paste, line breaks or literal `\n` will produce the requested hierarchy.

Use only supported input/commit methods already validated for this situation. A commit action must not split existing text or create an unrequested row. A historic Enter-to-commit recovery is not a general instruction to press Enter. If length, structure or a safe commit cannot be handled, preserve the complete request as pending rather than truncate or improvise.

For links, check the actual clickable URL and intended resource, not just visible URL text.

## 6. Verify saving before claiming success

Inspect the result and allow a save/sync opportunity. Observe a saved/synced indicator if available. A fixed wait or a fresh local text read is not proof of a server save. Do not immediately reload an actively edited page.

After a save opportunity, reopen the destination, and the parent for nested captures, to verify:

- Correct bucket and top placement (or explicitly approved exception).
- Complete exact text, including mixed-language characters and punctuation.
- Correct parent/child relationships and all requested children.
- Requested clickable links and actual destinations.
- No extra copy from this attempt.
- No observed change to pre-existing content.

Compare relevant surrounding content before and after. Do not claim a whole-outline integrity audit from a partial view. Seeing text in the original editor is not completion. Reopened read-back is useful evidence, not a guarantee against every later sync failure. If save state remains uncertain, call it unverified.

## 7. Handle uncertainty without multiplying mistakes

One retry is allowed only if the first attempt made no content change and its cause has been resolved. A new blank counts as a change. A timeout or interrupted input is an uncertain write, not a failed write known to be absent; read back before any further action.

Once a blank, partial capture or uncertain write exists, do not restart blindly. Read-only verification may continue, but do not fill an unidentified blank, repair/delete malformed content or create a replacement copy without explicit authorization for that recovery. This stricter rule supersedes older general fresh-copy retry advice. Permission quoted in an old incident does not authorize today's retry.

If uncertainty persists, stop writing and keep the complete original request pending with its actual state. Do not infer a node identity from position, emptiness or text alone. User deletion or movement is not permission to recreate content automatically.

Add-only means no editing, moving, deleting, crossing off, restoring or merging existing content. Mistakes stay untouched. If the user says they entered it manually, close the pending request and do not retry.

## 8. Report the actual outcome

"Saved" means every applicable verification gate passed. Apply the latest request for a brief destination and item-link reply when available. This supersedes the older typed reaction-only rule. Retain the established status signals and voice format:

- Typed capture: success checkmark reaction and a brief destination/item-link reply when available; do not repeat the payload.
- Hashtagged voice capture: `✅ <hashtag>`, a blank line, then the transcription.
- In progress: eyes reaction; never use thumbs-up as capture completion.
- Failed/partial/unverified capture: warning reaction plus a prompt separate text explanation, not a reaction alone, even if a retry is being considered.

Explain what actually landed, any accidental blank or existing-content change, what remains pending, and any missing verification. Do not claim a parent-only success when children or audio are missing. Provide the destination/item link when available and appropriate. Keep private links out of public reports.

Analyze each failure promptly: observed symptom, attempted actions, likely contributors versus unknown root cause, and a preventive procedural change if supported. An immediate five-whys must not invent certainty. Publish only sanitized lessons, never private payloads, recordings, share links or credentials. Do not delay the failure notice while researching or planning a retry.

## Evidence and validation boundary

The review aligns this contract with wrong-focus, title-splitting, blank-node, sync-loss, duplicate, malformed-link, wrong-bucket and long-input incidents. It does not establish a working top-add control, a durable queue/mutex, idempotency, a safe long-input method or universal persistence. No live Workflowy tests were performed for v0.5. See [REVIEW.md](REVIEW.md) and [TEST-PLAN.md](TEST-PLAN.md).
