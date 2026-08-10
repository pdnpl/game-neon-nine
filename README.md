# Neon Nine

Neon Nine is a focused, local two-player tic-tac-toe game for the browser. It
pairs an obsidian, cyan, and magenta visual system with semantic controls,
responsive sizing, and intentionally small game logic.

There are no accounts, scores, leaderboards, analytics, APIs, or saved user
data. Every round runs entirely in the browser.

## Play

- Select an empty cell to place the current player's mark.
- Connect three marks horizontally, vertically, or diagonally to win.
- Use **Play again** or **Restart round** to clear the board.
- With a keyboard, Tab into the board, use the Arrow keys to move, and press
  Enter or Space to place a mark. Home and End move within the current row.

## Technology

- React and TypeScript
- vinext and Vite
- CSS Grid and CSS-drawn marks
- Cloudflare Worker-compatible ESM output through the Sites Vite integration
- Node's built-in test runner and ESLint

The app contains no application-owned server endpoint or Cloudflare data
binding. The Worker entry point serves only the vinext application shell and
static assets; all game state remains client-side.

## Local development

Requires Node.js 22.13 or newer.

```bash
npm ci
npm run dev
```

## Quality checks

```bash
npm run lint
npm test
```

`npm test` verifies the pure game rules, creates the production Cloudflare
build, checks the rendered HTML and accessibility-critical structure, and
enforces explicit JavaScript, CSS, page, and social-card size budgets.

## Delivery

Changes use `agent/*` branches and reach `main` through a pull request. The
repository ruleset requires the `quality` GitHub Actions check, an up-to-date
branch, resolved conversations, linear history, and squash merging. Force
pushes and deletion of `main` are blocked.

Material decisions and their trade-offs are recorded in
[docs/adr](docs/adr/README.md).
