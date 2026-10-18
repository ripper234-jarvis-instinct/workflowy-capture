# Capture procedure (v0.4)

The current standing procedure for browser capture. It tightens v0.3: create-and-type in one sequence is not enough on its own, because a stale element ref or stolen focus puts the text in a title or the search box instead of the fresh node (see I13 and I14 in [INCIDENTS.md](INCIDENTS.md)).

## Steps

1. **Target the zoomed page.** Open the zoomed page of the destination list (PP0, PP1, PP2 or PInbox), never the full outline. The page title proves the parent, so there is no outline-position ambiguity.
2. **Create the node with the page's own add control.** After the click, re-read the page and use the fresh textbox ref. A ref captured before the click is stale - never reuse it.
3. **Verify the caret before typing.** Confirm from the freshly read page state that the caret is in the new empty bullet. No typing and no Enter until this holds. Verification is by page state (which element has focus), not by visually picking "your" blank node among strays. If the caret cannot be verified: stop on the first error and report. Do not retry the same method unchanged.
4. **Type, wait for sync, verify by content.** Type the capture text immediately after the caret check, wait for sync, then take a fresh screenshot and check that the exact capture text exists as a child on the destination page. This is also the verification behind the confirmation reaction. For a hashtagged voice capture, verify that the inline `[audio](https://drive.google.com/file/d/<id>/view)` link is also present in the same capture.
5. **Wrong landing: stop and report.** If the text landed wrong (inside an existing node, in a title, in the search box, on the wrong page), touch nothing and report immediately with the screenshot. Titles are never edited. Cleanup belongs to the user, per the add-only rule.
6. **Ignore stray blank nodes.** Empty nodes left by earlier incidents are not blockers and are never reported as such. Nothing is ever deleted or edited to clear them.

## Hashtagged voice notes

Only hashtagged voice notes route to Workflowy. Before capturing one, upload its original recording unchanged to the user's private Google Drive media archive. Keep the file private. Put the inline Markdown link `[audio](https://drive.google.com/file/d/<id>/view)` with the transcript in the same capture, without a separate link sub-bullet or `authuser` query parameter. Untagged voice notes are not Workflowy captures and should not be archived as part of this workflow.

The per-capture confirmation protocol is unchanged.

## Failure alerting

On any failed capture the user gets a ⚠️ reaction AND a separate text message immediately - not after a retry. The report includes the exact text of every capture that has not landed, so the user can add the items by hand if the failure persists.

## Known residual risk

Focus can still be stolen between the caret check and the first keystroke. The mitigation is detection by content verification plus stop-and-report. The procedure never auto-fixes.

## Why this design

- The caret check replaces assumed focus with verified focus: refs are re-read after every click, and typing starts only when the caret is confirmed in a fresh bullet.
- Verification by content does not depend on screenshots of ambiguous empty rows.
- Add-only and no-touch stay intact: no step edits, moves or deletes existing nodes, and titles are never edited.
