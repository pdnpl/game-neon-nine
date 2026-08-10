import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the Neon Nine game shell", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Neon Nine/);
  assert.match(html, /Neon Nine/);
  assert.match(html, /Tic-tac-toe board/);
  assert.match(html, /role="grid"/);
  assert.match(html, /role="status"/);
  assert.match(html, /Restart round/);
  assert.equal((html.match(/data-cell-index=/g) ?? []).length, 9);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Building your site/i);
});

test("ships the accessible game instead of starter preview infrastructure", async () => {
  const [page, game, css, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/game.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /aria-label="Tic-tac-toe board"/);
  assert.match(page, /aria-rowcount=\{3\}/);
  assert.match(page, /handleCellKeyDown/);
  assert.match(page, /aria-disabled=\{unavailable\}/);
  assert.match(game, /WINNING_LINES/);
  assert.match(game, /state\.result\.winner/);
  assert.match(css, /touch-action:\s*manipulation/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /forced-colors:\s*active/);
  assert.match(css, /\.mark-x::before/);
  assert.match(css, /\.mark-o/);
  assert.match(layout, /Neon Nine/);
  assert.match(layout, /\/og\.png/);
  assert.doesNotMatch(layout, /next\/font|codex-preview|Starter Project/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(new URL("../app/_sites-preview", import.meta.url)));
});
