import { searchEntries } from "./content";
import type { SiteData } from "../types";

type Tool = { name: string; title: string; description: string; inputSchema: object; annotations: { readOnlyHint: boolean }; execute: (args: Record<string, unknown>) => Promise<string> };
type ModelContext = { registerTool: (tool: Tool) => void | Promise<void> };

export function createAgentTools(data: SiteData, readMarkdown: (path: string) => Promise<string> = async path => {
  const response = await fetch(path);
  if (!response.ok) throw new Error("Page could not be read");
  return response.text();
}) {
  const tools: Tool[] = [
    {
      name: "search_content", title: "Search Kenneth's writing",
      description: "Search this site's public notes and publications. Returns titles, summaries and Markdown URLs. Read-only; does not contact external services.",
      inputSchema: { type: "object", properties: { query: { type: "string", maxLength: 200 }, limit: { type: "integer", minimum: 1, maximum: 20 } }, required: ["query"], additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: async ({ query, limit }) => {
        if (typeof query !== "string" || query.length > 200) throw new Error("A query of at most 200 characters is required");
        if (limit !== undefined && (typeof limit !== "number" || !Number.isInteger(limit) || limit < 1 || limit > 20)) throw new Error("Limit must be between 1 and 20");
        return JSON.stringify(searchEntries(data.entries, query, typeof limit === "number" ? limit : 10).map(entry => ({ title: entry.title, description: entry.description, date: entry.date, url: `${data.origin}/${entry.slug}`, markdown: `${data.origin}/${entry.slug}/index.md` })));
      },
    },
    {
      name: "read_page", title: "Read a page as Markdown",
      description: "Read the Markdown of this site's homepage, about page, writing index, agent directory or an existing note/publication. Accepts only a known local page path.",
      inputSchema: { type: "object", properties: { path: { type: "string", maxLength: 200 } }, required: ["path"], additionalProperties: false },
      annotations: { readOnlyHint: true },
      execute: async ({ path }) => {
        if (typeof path !== "string" || path.length > 200) throw new Error("A known local page path is required");
        const routes: Record<string, string> = { "/": "/index.md", "/index.html": "/index.md", "/about.html": "/about/index.md", "/notes.html": "/notes/index.md", "/agents.html": "/agents/index.md" };
        for (const entry of data.entries) {
          routes[`/${entry.slug}`] = `/${entry.slug}/index.md`;
          routes[`/${entry.slug}.html`] = `/${entry.slug}/index.md`;
        }
        if (!Object.hasOwn(routes, path)) throw new Error("Unknown page. Use search_content to find a page first.");
        return readMarkdown(routes[path]);
      },
    },
  ];
  return tools;
}

export async function registerAgentTools(data: SiteData) {
  // Current draft uses document.modelContext; older implementations use navigator.
  const context = (document as Document & { modelContext?: ModelContext }).modelContext
    ?? (navigator as Navigator & { modelContext?: ModelContext }).modelContext;
  if (!context?.registerTool) return;
  const tools = createAgentTools(data);
  for (const tool of tools) {
    try { await context.registerTool(tool); }
    catch (error) { console.warn(`WebMCP ${tool.name} unavailable`, error); }
  }
}
