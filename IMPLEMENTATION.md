# Implementation

## Overview
1. The user sends a capture in the assistant chat: a typed message or a voice note (transcribed).
2. The assistant routes it by the rules in the README: `#0` to PP0, `#1` to PP1, `#2` to PP2, and untagged task-like captures to PInbox.
3. The assistant writes the capture as a new bullet in the target list.

## Privacy rule
Live share links are never inserted into this repository. They stay with the user only. Use placeholders in examples and keep private destinations out of project files and version history.

## The add-only rule
Capture is strictly additive.

- Create a fresh node for every capture (fresh-node creation).
- Never delete, modify, move, or cross off an existing node.
- Never type into an existing row or a blank row left by an earlier action.
- Every action is separate; do not entangle two actions in one edit.
- Do not clean up. If something looks wrong, stop, report it, and leave it as it is.

## Capture procedure
1. Take a fresh snapshot of the target list. Do not rely on remembered positions or old element references.
2. Create a fresh node.
3. Verify the caret is inside that fresh, blank node. If not, stop and report.
4. Type the capture text once.
5. **Sync-wait gate (mandatory).** Wait until the typed text has synced to the server. Do not reload, navigate away, or end the session before this.
6. Only then reload and verify the text appears exactly once, with the surrounding content unchanged.
7. If verification fails, stop and report. Do not retry blindly: a late sync followed by a retry creates a second copy.

## Reply format for hashtagged voice captures
For a voice recording that starts with a hashtag, the reply is:

```text
✅ <hashtag>

<transcription of the voice recording>
```

First line is the checkmark and the hashtag, then exactly one blank line, then the transcription. Plain-text captures get no reply.

## Safe operation principles
- Use only a user-authorized connection or integration.
- One capture at a time. No parallel writers on one outline.
- Robustness over performance.
- A visible row is not a saved row. Only a post-sync reload verification proves a write.

## Avoid
- Reusing an existing or blank row for a new capture.
- Deleting content to clean up duplicates or stray blanks.
- Typing before confirming the destination and the fresh node.
- Reloading right after typing.
