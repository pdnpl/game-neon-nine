import assert from "node:assert/strict";
import { readdir, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const clientDirectory = path.resolve("dist", "client");

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(absolutePath)));
    } else if (entry.isFile()) {
      files.push(absolutePath);
    }
  }

  return files;
}

async function totalBytes(files) {
  const sizes = await Promise.all(files.map(async (file) => (await stat(file)).size));
  return sizes.reduce((total, size) => total + size, 0);
}

test("keeps the browser payload within the performance budget", async () => {
  const files = await collectFiles(clientDirectory);
  const scripts = files.filter((file) => file.endsWith(".js"));
  const styles = files.filter((file) => file.endsWith(".css"));
  const pageScripts = scripts.filter((file) => /[\\/]page-[^\\/]+\.js$/.test(file));

  assert.ok(await totalBytes(scripts) <= 420 * 1024, "client JavaScript exceeds 420 KiB");
  assert.ok(await totalBytes(styles) <= 24 * 1024, "client CSS exceeds 24 KiB");
  assert.ok(await totalBytes(pageScripts) <= 16 * 1024, "game page JavaScript exceeds 16 KiB");
});

test("keeps the social card outside the gameplay-critical budget", async () => {
  const socialCard = path.join(clientDirectory, "og.png");
  assert.ok((await stat(socialCard)).size <= 2 * 1024 * 1024, "social card exceeds 2 MiB");
});

