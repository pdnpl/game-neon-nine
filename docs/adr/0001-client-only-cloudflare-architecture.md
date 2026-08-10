# ADR-0001: Client-only Cloudflare-compatible architecture

- Status: Accepted
- Date: 2026-08-10

## Context

Neon Nine is a self-contained, local two-player tic-tac-toe game. It needs no
accounts, API, database, leaderboard, remote synchronization, or durable game
state. The primary architectural goals are immediate interaction, predictable
behavior, a small maintenance surface, and direct deployment to Cloudflare
Workers.

## Decision

Build the game with React 19 and TypeScript using the bundled vinext and Vite
toolchain. Retain the Sites Vite integration so the production output is
Cloudflare Worker-compatible ESM and can be deployed through the established
Sites workflow.

All game state and rules run in the browser. Keep the rules in a pure
TypeScript module and render the board as semantic HTML. Do not add an
application API, authentication, D1, R2, KV, Durable Objects, analytics,
third-party data, a router, or a global state library. A refresh begins a new
round by design.

## Consequences

- Gameplay has no network dependency after the application loads.
- The game remains deterministic and easy to test.
- Cloudflare can serve the application globally from Worker-compatible output.
- The repository contains deployment scaffolding, but no app-owned server API
  or server-maintained game state.
- Multiplayer, accounts, stored scores, or server authority require a new ADR.

## Alternatives considered

### Cloudflare Workers Static Assets without a Worker entry point

This is the leanest Cloudflare-native option for a static SPA and remains a
valid future simplification. It was not selected because the established Sites
workflow already provides validated Worker-compatible builds, private preview,
and production deployment without adding product-facing backend behavior.

### Canvas or WebGL

Rejected because a 3-by-3 board benefits more from semantic controls, native
focus behavior, responsive CSS, and lower rendering complexity.

### Animation, routing, or global-state frameworks

Rejected because the game has one screen, nine cells, and a tiny deterministic
state model. These dependencies would add weight without product value.

