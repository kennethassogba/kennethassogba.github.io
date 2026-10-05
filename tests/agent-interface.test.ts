import assert from "node:assert/strict";
import test from "node:test";
import { readFile, access } from "node:fs/promises";
import { markdownPath, serveRepresentation, wantsMarkdown } from "../edge/representations";
import { createAgentTools } from "../frontend/lib/webmcp";
import { parseContent, loadEntries } from "../scripts/content";
import type { SiteData } from "../frontend/types";

test("negotiation respects explicit media types, quality weights and exclusions", () => {
  assert.equal(wantsMarkdown("text/html,application/xhtml+xml,*/*;q=0.8"), false);
  assert.equal(wantsMarkdown("text/markdown"), true);
  assert.equal(wantsMarkdown("text/markdown;q=0, text/html"), false);
  assert.equal(wantsMarkdown("text/html;q=1, text/markdown;q=0.5"), false);
  assert.equal(wantsMarkdown("text/html;q=.5, text/markdown;q=1"), true);
  assert.equal(wantsMarkdown("text/markdown;q=garbage"), false);
  assert.equal(wantsMarkdown("text/*"), false);
  assert.equal(markdownPath("/notes/a-website-for-people-and-agents.html"), "/notes/a-website-for-people-and-agents/index.md");
  assert.equal(markdownPath("/assets/photo.jpg"), null);
});

test("HTML and Markdown get correct discovery, MIME and cache headers; HEAD has no body", async () => {
  const fetchAsset = async (request: Request) => new Response(request.url.endsWith(".md") ? "# Hello" : "<h1>Hello</h1>", { headers: { "Content-Type": request.url.endsWith(".md") ? "application/octet-stream" : "text/html", "Vary": "Origin" } });
  const markdown = await serveRepresentation(new Request("https://example.com/", { headers: { Accept: "text/markdown" } }), fetchAsset);
  assert.match(markdown.headers.get("Content-Type")!, /^text\/markdown/);
  assert.equal(markdown.headers.get("Content-Location"), "/index.md");
  assert.equal(markdown.headers.get("Vary"), "Origin, Accept");
  assert.match(markdown.headers.get("Link")!, /rel="api-catalog"/);
  assert.equal(await markdown.text(), "# Hello");
  const html = await serveRepresentation(new Request("https://example.com/"), fetchAsset);
  assert.match(html.headers.get("Content-Type")!, /text\/html/);
  const head = await serveRepresentation(new Request("https://example.com/", { method: "HEAD", headers: { Accept: "text/markdown" } }), fetchAsset);
  assert.equal(await head.text(), "");
  assert.match(head.headers.get("Content-Type")!, /text\/markdown/);
  const post = await serveRepresentation(new Request("https://example.com/", { method: "POST" }), fetchAsset);
  assert.equal(post.status, 405);
});

test("adapter preserves missing-page status and maps legacy extensionless routes", async () => {
  const calls: string[] = [];
  const response = await serveRepresentation(new Request("https://example.com/notes/absent", { headers: { Accept: "text/markdown" } }), async request => { calls.push(new URL(request.url).pathname); return new Response("Not found", { status: 404, headers: { "Content-Type": "text/html" } }); });
  assert.deepEqual(calls, ["/notes/absent/index.md", "/notes/absent.html"]);
  assert.equal(response.status, 404);
  assert.match(response.headers.get("Content-Type")!, /text\/html/);
});

test("every preserved article has matching Markdown and working local references", async () => {
  const entries = await loadEntries();
  assert.equal(entries.filter(e => e.kind === "publication").length, 3);
  assert.equal(entries.filter(e => e.kind === "note").length, 7);
  for (const entry of entries) {
    const html = await readFile(`dist/${entry.slug}.html`, "utf8");
    const markdown = await readFile(`dist/${entry.slug}/index.md`, "utf8");
    assert.equal((html.match(/<h1[ >]/g) || []).length, 1, entry.slug);
    const expectedBody = entry.markdown.replace(/\]\((\/(?!\/)[^)\s]+|assets\/[^)\s]+)([^)]*)\)/g, (_, target: string, rest: string) => `](${new URL(target, "https://kennethassogba.github.io/").href}${rest})`);
    assert.ok(markdown.includes(expectedBody), `${entry.slug}: Markdown preserves the complete body`);
    assert.ok(html.includes(`content="https://kennethassogba.github.io/${entry.slug}"`));
    assert.ok(html.includes("BlogPosting") || html.includes("ScholarlyArticle"));
    const jsonLd = JSON.parse(html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)![1]);
    assert.equal(jsonLd.headline, entry.title);
    for (const match of html.matchAll(/(?:href|src)="([^"#]+)"/g)) {
      const url = match[1].split(/[?#]/)[0];
      if (/^(https?:|mailto:|data:)/.test(url)) continue;
      const target = url === "/" ? "dist/index.html" : `dist/${url.replace(/^\//, "")}`;
      try { await access(target); } catch { await access(`${target}.html`); }
    }
  }
});

test("browser tools share actual search and refuse arbitrary fetches", async () => {
  const entries = await loadEntries();
  const data: SiteData = { origin: "https://example.com", entries, page: { route: "/", type: "home", title: "Home", description: "", markdownUrl: "/index.md" } };
  const reads: string[] = [];
  const tools = createAgentTools(data, async path => { reads.push(path); return "# Read"; });
  const search = tools.find(tool => tool.name === "search_content")!;
  const found = JSON.parse(await search.execute({ query: "agent skills" }));
  assert.ok(found.some((entry: { title: string }) => entry.title === "Agent skills for a large codebase"));
  assert.ok(found.every((entry: { markdown: string }) => entry.markdown.endsWith("/index.md")));
  const read = tools.find(tool => tool.name === "read_page")!;
  assert.equal(await read.execute({ path: "/about.html" }), "# Read");
  await assert.rejects(() => read.execute({ path: "https://example.org/private" }));
  await assert.rejects(() => read.execute({ path: "/notes/../../etc/passwd" }));
  for (const path of ["/constructor", "constructor", "__proto__", "toString"]) await assert.rejects(() => read.execute({ path }));
  await assert.rejects(() => search.execute({ query: "hi", limit: -2 }));
  assert.deepEqual(reads, ["/about/index.md"]);
});

test("content parsing rejects unsafe routes and strips executable markup", () => {
  const source = (slug: string) => `<!--\ntitle: Example\nslug: ${slug}\ndate: 2026-10-05\ndescription: Example\ncategories: Test\n-->\n<script>alert(1)</script><img src="javascript:alert(1)" onerror="alert(1)">\n# Inner heading`;
  assert.throws(() => parseContent(source("notes/../../etc"), "note"));
  const entry = parseContent(source("notes/example"), "note");
  assert.ok(!entry.html.includes("<script"));
  assert.ok(!entry.html.includes("javascript:"));
  assert.ok(!entry.html.includes("onerror"));
  assert.ok(!entry.html.includes("<h1"));
  const code = parseContent(source("notes/example") + '\n\n```unknown-language\n# A code comment\nstd::vector<T> & value;\n```', "note");
  assert.ok(code.html.includes("std::vector&lt;T&gt; &amp; value;"));
  assert.ok(code.markdown.includes("\n# A code comment\n"));
  assert.equal(parseContent(source("publications/example") + '\n\n[Link](https://example.com/paper)', "publication").draft, false);
});

test("discovery files agree on URLs and the chosen usage policy", async () => {
  const robots = await readFile("dist/robots.txt", "utf8");
  assert.match(robots, /search=yes, ai-input=yes, ai-train=yes/);
  const content = JSON.parse(await readFile("dist/api/content.json", "utf8"));
  for (const entry of content.entries) {
    assert.equal(new URL(entry.url).hostname, "kennethassogba.github.io");
    await access(`dist${new URL(entry.markdownUrl).pathname}`);
  }
  const catalog = JSON.parse(await readFile("dist/.well-known/api-catalog", "utf8"));
  assert.ok(catalog.linkset[0]["service-desc"][0].href.endsWith("/api/openapi.json"));
  const sitemap = await readFile("dist/sitemap.xml", "utf8");
  assert.ok(!sitemap.includes("404.html"));
  assert.ok(!sitemap.includes("fragments"));
  const feed = await readFile("dist/feed.xml", "utf8");
  assert.ok(feed.includes("a-website-for-people-and-agents"));
  assert.ok(!feed.includes("async-communications"));
});
