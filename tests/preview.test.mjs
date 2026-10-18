import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

test("preview serves versioned CSS, project routes and styled 404s without caching old assets", { timeout: 10000 }, async () => {
  const server = spawn("python3", ["scripts/preview_server.py"], { env: { ...process.env, PORT: "0" }, stdio: ["ignore", "pipe", "pipe"] });
  try {
    const port = await new Promise((resolve, reject) => {
      server.once("error", reject);
      server.once("exit", (code) => reject(new Error(`Preview exited: ${code}`)));
      server.stdout.on("data", (data) => {
        const match = String(data).match(/0\.0\.0\.0:(\d+)/);
        if (match) resolve(match[1]);
      });
    });
    const base = `http://127.0.0.1:${port}`;
    const home = await fetch(`${base}/`);
    const html = await home.text();
    assert.equal(home.status, 200);
    assert.equal(home.headers.get("cache-control"), "no-store");
    const cssPath = html.match(/href="(\/assets\/css\/style\.css\?v=[^"]+)"/)[1];
    const css = await fetch(`${base}${cssPath}`);
    assert.equal(css.status, 200);
    assert.match(css.headers.get("content-type"), /text\/css/);
    assert.equal(css.headers.get("cache-control"), "no-store");
    assert.match(await css.text(), /\.contact-layout/);
    const project = await fetch(`${base}/projects/jaime-gaming/wave/`);
    assert.equal(project.status, 200);
    assert.match(await project.text(), /id="projectDetail"/);
    const missing = await fetch(`${base}/no-such-page/`);
    assert.equal(missing.status, 404);
    assert.match(await missing.text(), /\/assets\/css\/style\.css\?v=/);
    const asset = await fetch(`${base}/assets/no-such-file.css`);
    assert.equal(asset.status, 404);
  } finally { server.kill("SIGTERM"); }
});
