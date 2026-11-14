import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { resolve, join, extname, sep } from "node:path";
const root = resolve("out"),
  port = Number(process.env.PORT || 4173),
  base = (process.env.NEXT_PUBLIC_BASE_PATH || "").replace(/\/$/, "");
const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".ico": "image/x-icon",
};
createServer(async (req, res) => {
  try {
    let pathname = decodeURIComponent(
      new URL(req.url, "http://localhost").pathname,
    );
    if (base) {
      if (pathname !== base && !pathname.startsWith(base + "/"))
        throw Error("not found");
      pathname = pathname.slice(base.length) || "/";
    }
    let file = resolve(root, "." + pathname);
    if (file !== root && !file.startsWith(root + sep)) throw Error("not found");
    if ((await stat(file)).isDirectory()) file = join(file, "index.html");
    const bytes = await readFile(file);
    res.writeHead(200, {
      "Content-Type": types[extname(file)] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
    });
    res.end(bytes);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
  }
}).listen(port, "127.0.0.1", () =>
  console.log(`Preview http://localhost:${port}${base}/`),
);
