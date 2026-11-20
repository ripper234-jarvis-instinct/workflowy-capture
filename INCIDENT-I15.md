# Incident I15: Capture text appended to a list title

**Date:** 2026-11-20

**Observed:** During an attempted capture into PP0, the new text appeared appended to the list title instead of in a new bullet. The intended capture was not filed. The mistaken title was left unchanged, and no existing bullets were edited.

## Five whys

1. **Why was no new bullet created?** The text went into the title field, not a bullet.
2. **Why did it go into the title?** The insertion gesture left the title as the active editing target.
3. **Why was that not caught before typing?** The page was not rechecked to confirm a fresh bullet and its active editor.
4. **Why was the page not rechecked?** The insertion shortcut was treated as if it guaranteed the next typing target.
5. **Why did that assumption fail?** The UI did not establish a new top-level bullet through that gesture. The specific reason the focus differed from prior attempts is unknown.

## Prevention

Do not use a list title or existing bullet to create a capture. Use only a supported control that clearly creates a new top-level bullet. Before typing, inspect the page and confirm the fresh bullet is under the intended list and is the active editor. If the UI cannot establish that, stop and report the note as not filed. Leave any mistaken title untouched.
