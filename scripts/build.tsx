import { mkdir, writeFile, readFile, cp } from "node:fs/promises";
import path from "node:path";
import { build } from "vite";
import { renderToString } from "react-dom/server";
import TurndownService from "turndown";
import sharp from "sharp";
import { App } from "../frontend/App";
import { profile } from "../frontend/profile";
import { loadEntries } from "./content";
import type { Page, SiteData } from "../frontend/types";

const origin = (process.env.SITE_ORIGIN || "https://kennethassogba.github.io").replace(/\/$/, "");
if (!/^https?:\/\//.test(origin)) throw new Error("SITE_ORIGIN must be an HTTP(S) origin");
const entries = await loadEntries();
await build();
await cp("src/assets", "dist/assets", { recursive: true });
await cp("src/google893fc2e22167f035.html", "dist/google893fc2e22167f035.html");
const manifest = JSON.parse(await readFile("dist/.vite/manifest.json", "utf8"));
const bundle = manifest["frontend/client.tsx"];
if (!bundle?.file || !bundle.css?.length) throw new Error("Missing client assets");
const escape = (text: string) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const json = (value: unknown) => JSON.stringify(value).replace(/</g, "\\u003c");
const pages: Page[] = [
  { route: "/", type: "home", title: "Kenneth Assogba — Software engineer, AI in the loop", description: profile.intro, markdownUrl: "/index.md" },
  { route: "/about.html", type: "about", title: "About — Kenneth Assogba", description: "FPGA prototyping, placement and partitioning, netlist qualification, and AI-assisted development.", markdownUrl: "/about/index.md" },
  { route: "/notes.html", type: "notes", title: "Notes — Kenneth Assogba", description: "Notes on AI-assisted engineering, agent skills, developer tools, and C++.", markdownUrl: "/notes/index.md" },
  { route: "/agents.html", type: "agents", title: "For agents — Kenneth Assogba", description: "Markdown, a content index, read-only APIs, and experimental WebMCP tools.", markdownUrl: "/agents/index.md" },
  ...entries.map(entry => ({ route: `/${entry.slug}`, type: "article" as const, title: `${entry.title} — Kenneth Assogba`, description: entry.description, markdownUrl: `/${entry.slug}/index.md`, entry })),
  { route: "/404.html", type: "404", title: "Page not found — Kenneth Assogba", description: "This page does not exist.", markdownUrl: "/404/index.md" },
];
async function output(filename: string, content: string) {
  const file = path.join("dist", filename.replace(/^\//, ""));
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, content);
}
const turndown = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced", bulletListMarker: "-" });
turndown.remove(node => ["button", "svg"].includes(node.nodeName.toLowerCase()));
turndown.addRule("inlineSpacing", { filter: ["span", "time"], replacement: content => ` ${content} ` });
turndown.addRule("smallText", { filter: "small", replacement: content => ` · ${content}` });
turndown.addRule("definitionTerm", { filter: "dt", replacement: content => `\n- ${content}: ` });
turndown.addRule("definitionValue", { filter: "dd", replacement: content => `${content}\n` });
turndown.addRule("absoluteImages", {
  filter: "img",
  replacement: (_, node) => {
    const src = node.getAttribute("src");
    return src ? `![${node.getAttribute("alt") || ""}](${new URL(src, `${origin}/`).href})` : "";
  },
});
turndown.addRule("absoluteLinks", {
  filter: "a",
  replacement: (content, node) => {
    const href = node.getAttribute("href");
    return href ? `[${content}](${new URL(href, `${origin}/`).href})` : content;
  },
});
const markdownPages: { route: string; markdownUrl: string; title: string; text: string }[] = [];
const themeScript = `try{const t=localStorage.getItem('theme');if(t==='dark'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch{}`;

for (const page of pages) {
  const data: SiteData = { origin, page, entries };
  const app = renderToString(<App data={data} />);
  const clientData: SiteData = { ...data, entries: entries.map(entry => ({ ...entry, html: "", markdown: "" })) };
  const canonical = `${origin}${page.route}`;
  const person = { "@type": "Person", "@id": `${origin}/#person`, name: profile.name, jobTitle: profile.role, url: `${origin}/`, sameAs: [profile.linkedin, profile.github, "https://orcid.org/0000-0002-0635-7508"] };
  const structured = page.entry ? { "@context": "https://schema.org", "@type": page.entry.kind === "publication" ? "ScholarlyArticle" : "BlogPosting", headline: page.entry.title, description: page.description, url: canonical, ...(/^\d{4}$/.test(page.entry.date) ? { temporalCoverage: page.entry.date } : { datePublished: page.entry.date }), author: person } : { "@context": "https://schema.org", "@type": "ProfilePage", mainEntity: person, url: canonical };
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><base href="/"><title>${escape(page.title)}</title><meta name="description" content="${escape(page.description)}"><link rel="canonical" href="${canonical}"><meta property="og:title" content="${escape(page.title)}"><meta property="og:description" content="${escape(page.description)}"><meta property="og:url" content="${canonical}"><meta property="og:type" content="${page.entry ? "article" : "website"}"><meta property="og:image" content="${origin}/assets/meta/open-graph-card.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Kenneth Assogba. Software engineer. AI in the loop."><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/meta/favicon.ico"><link rel="alternate" type="text/markdown" href="${page.markdownUrl}" title="Markdown"><link rel="alternate" type="application/rss+xml" href="/feed.xml" title="Kenneth’s writing"><link rel="describedby" href="/llms.txt" type="text/plain"><link rel="api-catalog" href="/.well-known/api-catalog" type="application/linkset+json">${page.type === "404" ? '<meta name="robots" content="noindex">' : ""}${bundle.css.map((css: string) => `<link rel="stylesheet" href="/${css}">`).join("")}<script>${themeScript}</script><script type="application/ld+json">${json(structured)}</script></head><body><div id="root">${app}</div><script id="site-data" type="application/json">${json(clientData)}</script><script type="module" src="/${bundle.file}"></script></body></html>`;
  await output(page.route === "/" ? "index.html" : page.route.endsWith(".html") ? page.route : `${page.route}.html`, html);
  let markdown: string;
  if (page.entry) {
    const entry = page.entry;
    markdown = `# ${entry.title}\n\n${entry.description}\n\nAuthor: Kenneth Assogba${entry.authors ? `\nAuthors: ${entry.authors}` : ""}\nDate: ${entry.date}\nTopic: ${entry.categories}\nURL: ${canonical}\n${entry.draft ? "Status: Draft\n" : ""}\n${entry.markdown}\n`;
    markdown = markdown.replace(/\]\((\/(?!\/)[^)\s]+|assets\/[^)\s]+)([^)]*)\)/g, (_, target: string, rest: string) => `](${new URL(target, `${origin}/`).href}${rest})`);
  } else {
    const main = app.match(/<main id="main">([\s\S]*?)<\/main>/)?.[1] || "";
    markdown = `${turndown.turndown(main)}\n\nCanonical: ${canonical}\n`;
  }
  await output(page.markdownUrl, markdown);
  markdownPages.push({ route: page.route, markdownUrl: page.markdownUrl, title: page.title, text: markdown });
}
const publicPages = pages.filter(page => page.type !== "404");
await output(".nojekyll", "");
await output("robots.txt", `User-agent: *\nAllow: /\nContent-Signal: search=yes, ai-input=yes, ai-train=yes\n\nSitemap: ${origin}/sitemap.xml\n`);
await output("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${publicPages.map(page => `<url><loc>${escape(`${origin}${page.route}`)}</loc></url>`).join("")}</urlset>`);
await output("feed.xml", `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Kenneth Assogba — Notes</title><link>${origin}/notes.html</link><description>Software engineering, AI-assisted development, and developer tools.</description>${entries.filter(entry => entry.kind === "note" && !entry.draft).map(entry => `<item><title>${escape(entry.title)}</title><link>${origin}/${entry.slug}</link><guid isPermaLink="true">${origin}/${entry.slug}</guid><pubDate>${new Date(entry.date).toUTCString()}</pubDate><description>${escape(entry.description)}</description></item>`).join("")}</channel></rss>`);
await output("llms.txt", `# Kenneth Assogba\n\n> Software engineer at Siemens EDA. FPGA prototyping compiler: placement and partitioning, plus recent work on netlist qualification and clock handling. AI-assisted development, agent skills and MCP. Based in Sceaux, France.\n\n## Pages\n${publicPages.map(page => `- [${page.title}](${origin}${page.markdownUrl}): ${page.description}`).join("\n")}\n\n## Data\n- [Complete text](${origin}/llms-full.txt)\n- [Content index](${origin}/api/content.json)\n- [Profile](${origin}/api/profile.json)\n- [API catalog](${origin}/.well-known/api-catalog)\n- [RSS](${origin}/feed.xml)\n\nSearch, AI input and training are permitted in robots.txt. Linked research papers retain their own rights. WebMCP is experimental. On GitHub Pages, use the explicit Markdown URLs; HTTP negotiation requires the optional edge adapter.\n`);
await output("llms-full.txt", markdownPages.filter(page => page.route !== "/404.html").map(page => page.text).join("\n\n---\n\n"));
const index = entries.map(({ html: _html, markdown: _markdown, ...entry }) => ({ ...entry, url: `${origin}/${entry.slug}`, markdownUrl: `${origin}/${entry.slug}/index.md` }));
await output("api/content.json", JSON.stringify({ version: 1, entries: index }, null, 2));
await output("api/profile.json", JSON.stringify({ ...profile, source: profile.linkedin, reviewed: "2026-10-05" }, null, 2));
await output("api/pages.json", JSON.stringify(publicPages.map(page => ({ path: page.route, title: page.title, markdown: page.markdownUrl }))));
await output("api/openapi.json", JSON.stringify({ openapi: "3.1.0", info: { title: "Kenneth’s public content", version: "1.0.0", description: "Static read-only content APIs. Search client-side over the returned text. No authentication or write operations." }, servers: [{ url: origin }], paths: Object.fromEntries(["content", "profile", "pages"].map(name => [`/api/${name}.json`, { get: { operationId: `get_${name}`, summary: `Read public ${name}`, responses: { "200": { description: "Public data", content: { "application/json": { schema: { type: name === "pages" ? "array" : "object" } } } } } } }])) }, null, 2));
await output(".well-known/api-catalog", JSON.stringify({ linkset: [{ anchor: `${origin}/api/`, "service-desc": [{ href: `${origin}/api/openapi.json`, type: "application/vnd.oai.openapi+json" }], "service-doc": [{ href: `${origin}/agents.html`, type: "text/html" }], describedby: [{ href: `${origin}/llms.txt`, type: "text/plain" }] }] }, null, 2));
// Rasterizers need sRGB; derive it from the shared light-theme OKLCH tokens.
const lightTokens = (await readFile("tokens.css", "utf8")).split(".dark")[0];
function socialColor(name: string) {
  const match = lightTokens.match(new RegExp(`${name}:\\s*oklch\\(([\\d.]+)% ([\\d.]+) ([\\d.]+)\\)`));
  if (!match) throw new Error(`Missing social-preview color: ${name}`);
  const light = Number(match[1]) / 100, chroma = Number(match[2]), radians = Number(match[3]) * Math.PI / 180;
  const a = chroma * Math.cos(radians), b = chroma * Math.sin(radians);
  const l = (light + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (light - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (light - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s, -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s, -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s];
  return `#${rgb.map(channel => Math.round(255 * Math.max(0, Math.min(1, channel <= 0.0031308 ? 12.92 * channel : 1.055 * channel ** (1 / 2.4) - 0.055))).toString(16).padStart(2, "0")).join("")}`;
}
await output("assets/meta/open-graph-card.svg", `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${socialColor("--color-paper")}"/><rect x="64" y="174" width="1072" height="278" rx="32" fill="${socialColor("--color-lavender")}"/><text x="100" y="120" font-family="sans-serif" font-size="28" fill="${socialColor("--color-ink")}">Kenneth Assogba</text><text x="100" y="282" font-family="sans-serif" font-size="68" fill="${socialColor("--color-ink")}">Software engineer.</text><text x="100" y="376" font-family="sans-serif" font-size="68" fill="${socialColor("--color-accent")}">AI in the loop.</text><rect x="100" y="500" width="170" height="48" rx="24" fill="${socialColor("--color-mint")}"/><rect x="286" y="500" width="224" height="48" rx="24" fill="${socialColor("--color-blue")}"/><rect x="526" y="500" width="330" height="48" rx="24" fill="${socialColor("--color-peach")}"/><g font-family="sans-serif" font-size="21" fill="${socialColor("--color-ink")}"><text x="120" y="531">C++ · Python</text><text x="306" y="531">FPGA prototyping</text><text x="546" y="531">AI-assisted development</text></g></svg>`);
await sharp(await readFile("dist/assets/meta/open-graph-card.svg")).png().toFile("dist/assets/meta/open-graph-card.png");
console.log(`Built ${pages.length} HTML pages, matching Markdown, RSS, sitemap and content APIs.`);
