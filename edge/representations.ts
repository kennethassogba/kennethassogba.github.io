export function wantsMarkdown(accept: string | null) {
  if (!accept) return false;
  const ranges = accept.toLowerCase().split(",").map(value => {
    const [type, ...parameters] = value.trim().split(";");
    const parameter = parameters.map(p => p.trim()).find(p => p.startsWith("q="));
    const raw = parameter ? Number(parameter.slice(2)) : 1;
    return { type: type.trim(), q: Number.isFinite(raw) && raw >= 0 && raw <= 1 ? raw : 0 };
  });
  // Only an explicit Markdown request opts in. Respect explicit exclusions and preference.
  const markdown = ranges.find(range => range.type === "text/markdown")?.q || 0;
  const html = ranges.find(range => range.type === "text/html")?.q
    ?? ranges.find(range => range.type === "text/*")?.q
    ?? ranges.find(range => range.type === "*/*")?.q ?? 0;
  return markdown > 0 && markdown >= html;
}

export function markdownPath(path: string) {
  if (path === "/" || path === "/index.html") return "/index.md";
  const normalized = path.replace(/\.html$/, "").replace(/\/$/, "");
  if (/^\/(about|projects|notes|agents)$/.test(normalized) || /^\/(notes|publications)\/[a-z0-9-]+$/.test(normalized)) return `${normalized}/index.md`;
  return null;
}

export async function serveRepresentation(request: Request, fetchAsset: (request: Request) => Promise<Response>) {
  if (!["GET", "HEAD"].includes(request.method)) return new Response("Method not allowed", { status: 405, headers: { Allow: "GET, HEAD" } });
  const url = new URL(request.url);
  const alternate = markdownPath(url.pathname);
  const htmlRequest = alternate && url.pathname !== "/" && !url.pathname.endsWith(".html")
    ? new Request(new URL(`${url.pathname.replace(/\/$/, "")}.html${url.search}`, url), request)
    : request;
  let response: Response;
  if (alternate && wantsMarkdown(request.headers.get("Accept"))) {
    const markdown = new URL(alternate, url);
    response = await fetchAsset(new Request(markdown, { method: request.method, headers: request.headers }));
    // A missing Markdown file must not replace a real HTML page with a 404.
    if (response.status === 404) response = await fetchAsset(htmlRequest);
  } else response = await fetchAsset(htmlRequest);
  if (response.status >= 300 && response.status < 400) return response;
  const headers = new Headers(response.headers);
  if (alternate) {
    const vary = (headers.get("Vary") || "").split(",").map(value => value.trim()).filter(Boolean);
    if (!vary.some(value => value.toLowerCase() === "accept" || value === "*")) vary.push("Accept");
    headers.set("Vary", vary.join(", "));
  }
  const links = ['</llms.txt>; rel="describedby"; type="text/plain"', '</.well-known/api-catalog>; rel="api-catalog"; type="application/linkset+json"', '</sitemap.xml>; rel="sitemap"; type="application/xml"', '</feed.xml>; rel="alternate"; type="application/rss+xml"'];
  if (alternate) links.push(`<${alternate}>; rel="alternate"; type="text/markdown"`);
  headers.append("Link", links.join(", "));
  headers.set("X-Content-Type-Options", "nosniff");
  // Static hosts often serve Markdown as octet-stream; correct the representation MIME.
  const contentLocation = alternate && wantsMarkdown(request.headers.get("Accept")) && response.ok && !(headers.get("Content-Type") || "").includes("text/html") ? alternate : url.pathname;
  if (contentLocation.endsWith(".md")) headers.set("Content-Type", "text/markdown; charset=utf-8");
  if (url.pathname === "/.well-known/api-catalog") headers.set("Content-Type", "application/linkset+json; charset=utf-8");
  if (url.pathname === "/api/openapi.json") headers.set("Content-Type", "application/vnd.oai.openapi+json; charset=utf-8");
  headers.set("Content-Location", contentLocation);
  return new Response(request.method === "HEAD" ? null : response.body, { status: response.status, statusText: response.statusText, headers });
}
