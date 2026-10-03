# Capture procedure (v0.3)

The current standing procedure for browser capture. It replaces the earlier verify-the-blank-node loop (see I12 in [INCIDENTS.md](INCIDENTS.md)).

## Steps

1. **Target the zoomed page.** Open the zoomed page of the destination list (PP0, PP1, PP2 or PInbox), never the full outline. The page title proves the parent, so there is no outline-position ambiguity.
2. **Create and type in one uninterrupted sequence.** Use the page's own add control, then type the capture text immediately. No screenshot between create and type. The editor puts the caret in the node it just created, and that is the identification of the node. Never try to re-identify "your" blank node visually afterward.
3. **Verify by content.** After typing, wait for sync, then take a fresh screenshot and check that the exact capture text exists as a child on the destination page. This is also the verification behind the confirmation reaction.
4. **Wrong landing: stop and report.** If the text landed wrong (inside an existing node, wrong page), touch nothing and report immediately with the screenshot. Cleanup belongs to the user, per the add-only rule.
5. **Ignore stray blank nodes.** Empty nodes left by earlier incidents are not blockers and are never reported as such. Nothing is ever deleted or edited to clear them.

The per-capture confirmation protocol is unchanged.

## Known residual risk

If focus is stolen between create and type, the text could land in an existing node. The mitigation is detection by content verification plus stop-and-report. The procedure never auto-fixes.

## Why this design

- Identification by caret-at-creation does not depend on how many blank nodes exist, so stray blanks stop mattering.
- Verification by content does not depend on screenshots of ambiguous empty rows.
- Add-only and no-touch stay intact: no step edits, moves or deletes existing nodes.
