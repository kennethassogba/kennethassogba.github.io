import { readdir, readFile } from "node:fs/promises";
import { marked } from "marked";
import hljs from "highlight.js/lib/common";
import sanitizeHtml from "sanitize-html";
import type { Entry } from "../frontend/types";

export function parseContent(source: string, kind: Entry["kind"]): Entry {
  const frontmatter = source.match(/^<!--\s*\n([\s\S]*?)-->/);
  if (!frontmatter) throw new Error("Missing content frontmatter");
  const fields = Object.fromEntries(frontmatter[1].trim().split("\n").map(line => {
    const colon = line.indexOf(":");
    if (colon < 1) throw new Error(`Invalid frontmatter: ${line}`);
    return [line.slice(0, colon).trim(), line.slice(colon + 1).trim()];
  }));
  for (const key of ["title", "slug", "date", "description", "categories"]) {
    if (!fields[key]) throw new Error(`Missing ${key} in ${fields.slug || "entry"}`);
  }
  if (!/^(notes|publications)\/[a-z0-9-]+$/.test(fields.slug)) throw new Error(`Invalid slug: ${fields.slug}`);
  if (!/^\d{4}(-\d{2}-\d{2})?$/.test(fields.date) || Number.isNaN(Date.parse(fields.date))) throw new Error(`Invalid date: ${fields.date}`);
  let markdown = source.slice(frontmatter[0].length).trim();
  // Existing Markdown used H1s inside a page that already supplied the title.
  let fence: { marker: string; length: number } | undefined;
  markdown = markdown.split("\n").map(line => {
    const delimiter = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (delimiter && delimiter[1][0] === fence.marker && delimiter[1].length >= fence.length && !delimiter[2].trim()) fence = undefined;
      return line;
    }
    if (delimiter) { fence = { marker: delimiter[1][0], length: delimiter[1].length }; return line; }
    return line.replace(/^# /, "## ");
  }).join("\n");
  const renderer = new marked.Renderer();
  renderer.code = ({ text, lang }) => {
    const language = (lang || "text").split(/\s/)[0];
    const highlighted = hljs.getLanguage(language) ? hljs.highlight(text, { language }).value : text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return `<pre><code class="hljs language-${language.replace(/[^a-z0-9+-]/gi, "")}">${highlighted}</code></pre>`;
  };
  const raw = marked.parse(markdown, { renderer, async: false, gfm: true });
  let html = sanitizeHtml(raw, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, "img"],
    allowedAttributes: { ...sanitizeHtml.defaults.allowedAttributes, img: ["src", "alt", "title", "loading"], code: ["class"], span: ["class"] },
    allowedSchemes: ["https", "http", "mailto"],
    transformTags: { img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: "lazy" } }) },
  });
  html = html.replace(/<table>([\s\S]*?)<\/table>/g, '<div class="table-wrap" tabindex="0">$&</div>');
  const headings: NonNullable<Entry["headings"]> = [];
  const usedIds = new Set<string>();
  html = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level: string, body: string) => {
    const title = sanitizeHtml(body, { allowedTags: [], allowedAttributes: {} })
      .replace(/&(amp|lt|gt|quot|#39);/g, entity => ({ "&amp;": "&", "&lt;": "<", "&gt;": ">", "&quot;": '"', "&#39;": "'" }[entity]!));
    const stem = `section-${title.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "heading"}`;
    let id = stem;
    for (let suffix = 2; usedIds.has(id); suffix++) id = `${stem}-${suffix}`;
    usedIds.add(id);
    headings.push({ id, title, level: Number(level) });
    return `<h${level} id="${id}">${body}</h${level}>`;
  });
  const text = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} }).replace(/\s+/g, " ").trim();
  return {
    slug: fields.slug, title: fields.title, description: fields.description,
    date: fields.date, categories: fields.categories, authors: fields.authors, place: fields.place,
    kind, html, markdown, text, headings, readingMinutes: Math.max(1, Math.ceil(text.split(/\s+/).length / 220)),
    draft: fields.draft === "true" || /\(Draft\)|\[link\](?!\()|\[Table\](?!\()/i.test(markdown),
  };
}

export async function loadEntries() {
  const entries: Entry[] = [];
  for (const [directory, kind] of [["notes", "note"], ["publications", "publication"]] as const) {
    for (const filename of (await readdir(`content/${directory}`)).sort()) {
      if (filename.endsWith(".md")) entries.push(parseContent(await readFile(`content/${directory}/${filename}`, "utf8"), kind));
    }
  }
  if (new Set(entries.map(e => e.slug)).size !== entries.length) throw new Error("Duplicate content slug");
  return entries.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}
