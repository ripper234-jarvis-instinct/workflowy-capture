![Workflowy Capture banner](banner.svg)

# Workflowy capture

Save requested chat notes and tasks as new Workflowy bullets through the browser and private share links.

## Current contract

**Read [CAPTURE-PROCEDURE.md](CAPTURE-PROCEDURE.md), v0.5, reviewed 2026-10-25.** It is the single current operating protocol, including routing, hierarchy, voice archival, add-only constraints, verification, retry limits and outcome reporting. Later explicit user instructions take precedence. Do not assemble a procedure from older incident fixes.

The revised protocol is safer documentation, not proof that capture works. There is no demonstrated current top-add procedure in this review. If a supported new-item control cannot establish a fresh editor under the correct parent, stop and report. Do not manufacture a row with Enter in a heading or existing text. No Workflowy writes were made for this review.

## Repository map

- [Capture protocol](CAPTURE-PROCEDURE.md): current browser workflow and all gates.
- [Review](REVIEW.md): evaluation, conflicts resolved and validation limits.
- [Implementation status](IMPLEMENTATION.md): what is required versus not established.
- [Test plan](TEST-PLAN.md): proposed acceptance cases; no test authorization.
- [Versions](VERSIONS.md): current version and historical milestones.
- [Incidents](INCIDENTS.md), [test results](TEST-RESULTS.md), [concurrency tests](CONCURRENCY-TESTS.md), [concurrency results](CONCURRENCY-RESULTS.md) and [locking design](LOCKING-DESIGN.md): historical evidence/design, not current execution instructions.
- [API guide](V0.2-DIRECT-API.md) and `examples/create-bullet.mjs`: retained historical developer material, not the active capture route. APIs are unavailable for this workflow; do not run the example as a fallback.

## Non-negotiable boundaries

Add only; never edit, delete, move, complete or clean up existing content. One writer. Exact payload and hierarchy. Top placement unless explicitly changed. No untagged-task inbox default. Prompt failure notice with actual partial state. No blind retry after any content change. A manual-entry instruction closes the pending request.

No private share links, destination identifiers, user payloads, recordings or credentials belong in this public repository, issues, screenshots or history. Keep actual pending requests in an appropriate private record, not here.
