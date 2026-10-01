![Workflowy Capture banner](banner.svg)

# Workflowy Capture

Capturing notes and tasks from the assistant chat into the user's Workflowy lists.

The user drops thoughts and tasks into the chat (typed or as voice notes). The assistant routes each capture to the right Workflowy list and writes it as a new bullet. This repo documents the plan, the implementation as it exists today, a test plan, the executed results, and the incidents that shaped the rules.

## Routing rules

| Capture form | Destination |
| --- | --- |
| `#0 <text>` | PP0 (priority list 0, current-day section) |
| `#1 <text>` | PP1 |
| `#2 <text>` | PP2 |
| no hashtag, task-like | PInbox |

Order inside a list does not matter. Captures are never moved after creation.

## Hard rules

- **Add-only.** Every capture is a fresh node. The assistant never deletes, edits, moves, or crosses off an existing node, and never types into an existing or blank row.
- **Sync before reload.** After typing, wait until the text has synced to the server before any reload or verification reload. Reloading right after typing can lose the text. This gate is mandatory.
- **Mistakes stay untouched.** If a capture goes wrong, do not revert, restore, or merge. Report it and log it.
- **No private links in this repo.** Share links and credentials live only with the user, never in files or history.

## Assistant reply for hashtagged voice captures

When the capture input is a voice recording that starts with a hashtag (for example `#0`, `#1`, or any other hashtag that routes to its matching list), reply with:

```text
✅ <hashtag>

<transcription of the voice recording>
```

A recording starting with `#0` gets a reply whose first line is `✅ #0`, then one blank line, then the transcription. A plain-text capture message keeps the checkmark-only rule: no reply.

## Long-term direction

A small hosted relay: an append-only endpoint that proxies Workflowy's create-bullet API.

- The user's API key stays server-side with the relay and is never handed to the assistant or any client.
- A per-user unguessable token is the only auth boundary; requests are rate-limited.
- Append-only: the relay can create bullets and nothing else. No read access, no edits, no deletes.
- The assistant calls the endpoint instead of driving a browser, which removes the UI-fragility class of failures.

## v0.2: direct API capture

For developers who want to replace the browser path with a direct API write, see [V0.2-DIRECT-API.md](V0.2-DIRECT-API.md). It has the create-bullet contract, the reference write code, and the operational rules (token handling, check-before-write, read-back, add-only). A runnable client is in [examples/create-bullet.mjs](examples/create-bullet.mjs).

## Docs

- [IMPLEMENTATION.md](IMPLEMENTATION.md): how capture works, the procedure, and the rules.
- [TEST-PLAN.md](TEST-PLAN.md): functional, robustness, concurrency, security and performance tests.
- [TEST-RESULTS.md](TEST-RESULTS.md): executed results.
- [INCIDENTS.md](INCIDENTS.md): anonymized incident learnings.
- [CONCURRENCY-TESTS.md](CONCURRENCY-TESTS.md): concurrency test suite.
- [CONCURRENCY-RESULTS.md](CONCURRENCY-RESULTS.md): concurrency run results.
- [LOCKING-DESIGN.md](LOCKING-DESIGN.md): proposed serialization and locking design.
- [V0.2-DIRECT-API.md](V0.2-DIRECT-API.md): direct API capture guide for developers.
