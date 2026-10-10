export type Entry = {
  slug: string;
  title: string;
  description: string;
  date: string;
  categories: string;
  kind: "note" | "publication";
  html: string;
  markdown: string;
  text: string;
  readingMinutes: number;
  draft: boolean;
  authors?: string;
  place?: string;
  headings?: { id: string; title: string; level: number }[];
};

export type Page = {
  route: string;
  type: "home" | "about" | "projects" | "notes" | "agents" | "article" | "404";
  title: string;
  description: string;
  markdownUrl: string;
  entry?: Entry;
};

export type SiteData = { page: Page; entries: Entry[]; origin: string };
