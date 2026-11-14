import { readdirSync, readFileSync, existsSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import assert from "node:assert/strict";

const walk = (root) =>
  readdirSync(root, { withFileTypes: true }).flatMap((item) => {
    const path = join(root, item.name);
    assert(!item.isSymbolicLink(), `Unexpected symlink: ${path}`);
    return item.isDirectory() ? walk(path) : [path];
  });
for (const name of [
  "src/app/api",
  "src/app/admin",
  "src/app/agent",
  "src/lib/server",
  ".env",
  ".env.local",
]) {
  assert(!existsSync(name), `Private/server path present: ${name}`);
}
const source = walk("src");
for (const path of source) {
  const text = readFileSync(path, "utf8");
  assert(
    !/\bfetch\s*\(|\bXMLHttpRequest\b|\bWebSocket\s*\(|\bsendBeacon\s*\(/.test(
      text,
    ),
    `Network code in demo: ${path}`,
  );
  assert(
    !/fonts\.googleapis|fonts\.gstatic|@import\s+url|VIDNEST_BACKEND|DJANGO_SECRET|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY/.test(
      text,
    ),
    `External or private configuration: ${path}`,
  );
  assert(
    !/https?:\/\/(?:127\.0\.0\.1|192\.168\.|localhost)/.test(text),
    `Local service reference: ${path}`,
  );
}
const catalog = JSON.parse(readFileSync("src/data/catalog.json", "utf8"));
assert.equal(new Set(catalog.map((d) => d.id)).size, catalog.length);
for (const drama of catalog) {
  assert(drama.image.startsWith("/posters/"));
  assert(existsSync(join("public", drama.image)));
  assert.equal(drama.episodeList.length, drama.episodes);
}
if (existsSync("out")) {
  for (const file of walk("out")) {
    const name = relative("out", file).replaceAll("\\", "/");
    assert(
      !/^(admin|agent|api)(\/|$)|(^|\/)\.env(?:\.|\/|$)|\.map$/.test(name),
      `Unexpected output: ${name}`,
    );
    assert(
      statSync(file).size < 15 * 1024 * 1024,
      `Unexpected large asset: ${name}`,
    );
  }
  assert(existsSync("out/index.html"));
  assert(existsSync("out/about/index.html"));
}
console.log(
  `Public boundary audit passed: ${source.length} source files, ${catalog.length} fictional entries; no business network requests.`,
);
