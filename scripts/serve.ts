import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { serveRepresentation } from "../edge/representations";

const root = path.resolve("dist");
const port = Number(process.env.PORT || 4173);
const mime: Record<string, string> = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".md": "text/markdown", ".xml": "application/xml", ".txt": "text/plain", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".ico": "image/x-icon", ".woff2": "font/woff2", ".pdf": "application/pdf" };

async function assets(request: Request): Promise<Response> {
  let pathname: string;
  try { pathname = decodeURIComponent(new URL(request.url).pathname); } catch { return new Response("Bad path", { status: 400 }); }
  let file = path.resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
  if (!file.startsWith(`${root}/`)) return new Response("Not found", { status: 404 });
  try {
    let bytes: Buffer;
    try { bytes = await readFile(file); }
    catch {
      if (path.extname(file)) throw new Error("Not found");
      file += ".html"; bytes = await readFile(file);
    }
    return new Response(request.method === "HEAD" ? null : new Uint8Array(bytes), { headers: { "Content-Type": `${mime[path.extname(file)] || "application/octet-stream"}${[".html", ".md", ".txt", ".xml", ".json"].includes(path.extname(file)) ? "; charset=utf-8" : ""}` } });
  } catch {
    return new Response(request.method === "HEAD" ? null : new Uint8Array(await readFile(path.join(root, "404.html"))), { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } });
  }
}

http.createServer(async (incoming, outgoing) => {
  try {
    const headers = new Headers();
    for (const [name, value] of Object.entries(incoming.headers)) if (value) headers.set(name, Array.isArray(value) ? value.join(", ") : value);
    const request = new Request(`http://localhost:${port}${incoming.url}`, { method: incoming.method, headers });
    const response = await serveRepresentation(request, assets);
    outgoing.writeHead(response.status, Object.fromEntries(response.headers));
    outgoing.end(Buffer.from(await response.arrayBuffer()));
  } catch (error) { console.error(error); outgoing.writeHead(500); outgoing.end("Preview error"); }
}).listen(port, "127.0.0.1", () => console.log(`Preview: http://localhost:${port} (includes the optional edge behavior)`));
