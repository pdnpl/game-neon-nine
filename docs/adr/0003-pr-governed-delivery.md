# ADR-0003: PR-governed delivery with automated quality gates

- Status: Accepted
- Date: 2026-08-10

## Context

The repository must support unattended development while preventing untested
changes from landing directly on the default branch. The same GitHub identity
creates and reviews the initial pull request, and GitHub does not permit an
author to approve their own pull request.

## Decision

Keep the repository public so GitHub's branch rules are enforceable on the
owner's current plan; the project contains no secrets, user data, or private
business logic. Protect `main` with a repository ruleset that requires a pull request, the
`quality` status check, an up-to-date branch, resolved conversations, linear
history, and protection from force pushes and deletion. Require zero approving
reviews so a single authenticated automation identity is not deadlocked.

Every pull request runs deterministic dependency installation, lint, game-rule
tests, rendered-output tests, and the production build. The author performs an
explicit diff and check review, records the result as a non-approving review
comment, and squash-merges only after required checks pass. Direct feature work
on `main` is prohibited; changes use `agent/*` branches.

Deploy the exact merged source revision. Keep credentials ephemeral and out of
the repository. Document future material architecture, UX, security, and
delivery changes as new ADRs.

## Consequences

- Every merged change has reviewable history and automated evidence.
- Source code and ADRs are publicly readable; write access remains restricted.
- A single-identity autonomous workflow remains possible without weakening the
  PR or status-check requirement.
- Independent approval requires adding a distinct reviewer or bot identity and
  then raising the required approval count.
- Making the repository private without upgrading the GitHub plan would disable
  the enforced ruleset and therefore requires a superseding delivery decision.

## Alternatives considered

### Require one approving review from the PR author

Rejected because GitHub prevents self-approval, which would permanently block
the requested autonomous merge flow.

### Push completed work directly to `main`

Rejected because it bypasses the requested PR policy and removes the safest
point for automated checks and review.

### Keep the repository private on the current GitHub plan

Rejected because GitHub returned that repository rulesets for a private
personal repository require GitHub Pro. Public visibility preserves the
requested enforcement without adding a subscription dependency.

### Keep a long-lived deployment credential in GitHub

Rejected because the initial deployment can use short-lived credentials and
the game has no runtime secrets. Any later CI deployment credential should use
the narrowest available scope and GitHub secret storage.
