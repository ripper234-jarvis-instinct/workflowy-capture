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
| `# <text>` (hash + space, typed) | PInbox |
| `#f <text>` | Follow-up folder |

- Only typed notes that start exactly with `# ` (hash + space) go to PInbox. Typed notes without a hashtag are not captured anywhere.
- Hashtagged voice notes route exactly like the typed forms above. An untagged voice note is not captured unless the user explicitly says where it goes (for example "add this to P zero").

Order inside a list does not matter. Captures are never moved after creation.

## Hard rules

- **Add-only.** Every capture is a fresh node. The assistant never deletes, edits, moves, or crosses off an existing node, and never types into an existing or blank row. Titles are never edited.
- **Verify the caret before typing.** After any click, re-read the page and use the fresh element ref; confirm the caret is in a fresh bullet before typing or pressing Enter. Stale refs and assumed focus are how text ends up in a title or the search box.
- **Stop on the first error.** No retry loops with the same method. A failed capture gets an immediate ⚠️ alert (see Confirmations and alerts).
- **Sync before reload.** After typing, wait until the text has synced to the server before any reload or verification reload. Reloading right after typing can lose the text. This gate is mandatory.
- **Mistakes stay untouched.** If a capture goes wrong, do not revert, restore, or merge. Report it and log it.
- **No private links in this repo.** Share links and credentials live only with the user, never in files or history.

## Hashtagged voice-note capture and archival

- Only a voice note that starts with a hashtag is routed to Workflowy. Untagged voice notes are not Workflowy captures, even when they sound like a task or request - unless the user explicitly names the destination.
- For a hashtagged voice note that is captured to Workflowy, upload the original audio recording to the user's private Google Drive media archive and include its Drive link inline in the captured transcript as Markdown: `[audio](https://drive.google.com/file/d/<id>/view)`. Do not use a separate sub-bullet for the link and do not include query parameters such as `authuser`. Keep the archive private; do not enable public sharing.
- Preserve the audio unchanged. Keep the transcript and inline audio link together in the same capture.
- Do not archive or capture a voice note unless it is actually being routed to Workflowy.

## Assistant reply for hashtagged voice captures

When the capture input is a voice recording that starts with a hashtag (for example `#0`, `#1`, or any other hashtag that routes to its matching list), reply with:

```text
✅ <hashtag>

<transcription of the voice recording>
```

A recording starting with `#0` gets a reply whose first line is `✅ #0`, then one blank line, then the transcription. A plain-text capture message keeps the checkmark-only rule: no reply.

## Confirmations and alerts

- **Typed capture (with or without hashtag):** a ✅ emoji reaction only, no text reply, and only after the capture is verified in Workflowy.
- **Hashtagged voice note:** the `✅ <hashtag>` + blank line + transcription reply described above.
- **Failed capture:** a ⚠️ reaction AND a separate text message immediately, even when a retry is planned. Never hold the verdict while waiting on a retry.
- **In progress:** a 👀 reaction on anything the assistant has started, until it is finished.
- **Never 👍.** A thumbs-up is not a valid capture acknowledgement.

## Long-term direction

A small hosted relay: an append-only endpoint that proxies Workflowy's create-bullet API.

- The user's API key stays server-side with the relay and is never handed to the assistant or any client.
- A per-user unguessable token is the only auth boundary; requests are rate-limited.
- Append-only: the relay can create bullets and nothing else. No read access, no edits, no deletes.
- The assistant calls the endpoint instead of driving a browser, which removes the UI-fragility class of failures.

## v0.2: direct API capture

For developers who want to replace the browser path with a direct API write, see [V0.2-DIRECT-API.md](V0.2-DIRECT-API.md). It has the create-bullet contract, the reference write code, and the operational rules (token handling, check-before-write, read-back, add-only). A runnable client is in [examples/create-bullet.mjs](examples/create-bullet.mjs).


## Capture failure analysis and next steps

Recent capture failures cluster into a few families:

- **Wrong focus / wrong destination:** stale or misleading controls can put text in a list title or in Workflowy's Search field instead of a bullet. The Oct 19 Search-landing failure came from typing through a form ref that resolved to Search; visually seeing a blank outline row is not proof that the editor has focus.
- **Ambiguous empty rows:** earlier retries left stray blank bullets, making it hard to tell which empty row was newly created. Empty rows can remain; Ron says they are acceptable and not a blocker or stop condition. Do not touch or clean them up.
- **Sync and verification races:** text can sync late; reloading too early may show a false negative or lose unsynced text, and an immediate retry can create duplicates. Wait for sync before checking or retrying; verify exact content.
- **Multi-line / nested-content loss:** multiline input or nested audio links can split or disappear. Prefer a single-line capture where possible and verify the full intended text.

Options from the Oct 19 capture analysis:

- **Option A (near-term):** use a coordinate click on the first real bullet, confirm the caret on a fresh screenshot, capture one line, and verify exact content after about 60 seconds. Use one canary at a time.
- **Option B (failure response):** if the capture fails, send the failure alert promptly with the unlanded item; do not let a planned retry delay the verdict. Any retry should change the method or compress the capture to one line.
- **Option D (long-term):** consider a Fredo-hosted append-only capture form/relay as the durable fix; this needs explicit go-ahead before implementation.

These notes summarize observed failure modes and proposed options; existing routing, add-only, and verification details remain in the sections above.
