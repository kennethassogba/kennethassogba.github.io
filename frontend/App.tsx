import { useEffect, useState } from "react";
import { Check, Copy, FileText, Moon, Search, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { profile } from "./profile";
import { studio, projectCatalog, type Project } from "./projects";
import { entryTopics, filterByTopic, searchEntries } from "./lib/content";
import type { Entry, SiteData } from "./types";

export function dateLabel(date: string, full = false) {
  if (/^\d{4}$/.test(date)) return date;
  const options: Intl.DateTimeFormatOptions = { month: full ? "long" : "short", year: "numeric", timeZone: "UTC" };
  if (full) options.day = "numeric";
  return new Intl.DateTimeFormat(full ? "en-GB" : "en", options).format(new Date(date));
}

function ThemeButton() {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains("dark")); }, []);
  return <Button variant="ghost" size="icon-sm" className="client-control theme-button" aria-label={dark ? "Use light theme" : "Use dark theme"} onClick={() => {
    const next = !dark;
    document.documentElement.classList.toggle("dark", next);
    setDark(next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* Theme still works when storage is unavailable. */ }
  }}>{dark ? <Sun /> : <Moon />}</Button>;
}

function SearchDialog({ entries }: { entries: Entry[] }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const listener = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault(); setOpen(value => !value);
      }
    };
    document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, []);
  const results = searchEntries(entries, query);
  return <>
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button variant="ghost" size="icon-sm" aria-label="Search writing" className="client-control"><Search /></Button></DialogTrigger>
      <DialogContent className="search-dialog">
        <DialogHeader>
          <DialogTitle>Find a note</DialogTitle>
          <DialogDescription>Search notes and publications.</DialogDescription>
        </DialogHeader>
        <Input aria-label="Search notes and publications" value={query} onChange={e => setQuery(e.target.value)} placeholder="Try agents, C++, or MPI..." />
        <div className="search-results" aria-live="polite">
          {results.length ? results.map(entry => <a className="search-result" key={entry.slug} href={`/${entry.slug}`}>
            <span>{entry.title}</span><small>{entry.categories} · {dateLabel(entry.date)}</small>
          </a>) : <p className="muted">No matches. Try a different word.</p>}
        </div>
        <p className="search-hint">Your search runs in this browser. Open with ⌘ / Ctrl K; close with Esc.</p>
      </DialogContent>
    </Dialog>
  </>;
}

function MarkdownLink({ url }: { url: string }) {
  return <a className="quiet-link markdown-link" href={url}><FileText size={14} /> Read as Markdown</a>;
}

function Header({ data }: { data: SiteData }) {
  return <header className="site-header">
    <a className="identity" href="/" aria-label="Kenneth Assogba, home"><span>Kenneth Assogba.</span></a>
    <nav aria-label="Main navigation">
      <a href="/projects.html" aria-current={data.page.type === "projects" ? "page" : undefined}>Projects</a>
      <a href="/notes.html" aria-current={data.page.type === "notes" ? "page" : data.page.entry?.kind === "note" ? "location" : undefined}>Notes</a>
      <a href="/about.html" aria-current={data.page.type === "about" ? "page" : undefined}>About</a>
    </nav>
    <p className="sidebar-location">{profile.location}</p>
    <div className="sidebar-controls">
      <SearchDialog entries={data.entries} />
      <ThemeButton />
    </div>
  </header>;
}

function NoteRow({ entry }: { entry: Entry }) {
  return <li className="note-row">
    <div className="note-row-main">
      <a href={`/${entry.slug}`}><h3>{entry.title}</h3></a>
      <p>{entry.description}</p>
    </div>
    <div className="note-meta"><time dateTime={entry.date}>{dateLabel(entry.date)}</time><span>{entry.readingMinutes} min read</span>{entry.draft && <Badge variant="outline">Draft</Badge>}</div>
  </li>;
}

function Home({ data }: { data: SiteData }) {
  const notes = data.entries.filter(e => e.kind === "note" && !e.draft).slice(0, 3);
  return <>
    <section className="intro" aria-labelledby="intro-title">
      <p className="hello">Hey, I'm Kenneth.</p>
      <h1 id="intro-title">Software engineer<br /><span>at Siemens EDA.</span></h1>
      <p className="intro-copy">{profile.summary}</p>
      <ul className="focus-tags" aria-label="Engineering focus">{profile.focus.map(focus => <li key={focus}>{focus}</li>)}</ul>
    </section>

    <section id="work" className="work-section" aria-labelledby="work-title">
      <div className="section-heading"><h2 id="work-title">Work at Siemens EDA</h2><a className="quiet-link work-reference" href={profile.prototypingArticle}>Veloce proFPGA CS</a></div>
      <div className="work-list">{profile.work.slice(0, 3).map(item => <div className="work-line" key={item.label}><h3>{item.label}</h3><p>{item.text}</p></div>)}</div>
    </section>

    <section className="studio-section" aria-labelledby="studio-title">
      <div className="section-heading"><h2 id="studio-title">{studio.name}</h2><a className="quiet-link" href={studio.url}>Visit the studio</a></div>
      <p className="studio-intro">{studio.description}</p>
      <div className="studio-projects">{projectCatalog.filter(project => project.group === "scientific").map(project => <article key={project.id}>
        <p className="project-area">{project.area}</p>
        <h3><a className="quiet-link project-title-link" href={project.url}>{project.name}</a></h3>
        <p>{project.description}</p>
        {project.status && <p className="project-status">{project.status}</p>}
      </article>)}</div>
      <a className="quiet-link all-projects-link" href="/projects.html">All projects</a>
    </section>

    <section className="experiments-section" aria-labelledby="experiments-title">
      <div className="section-heading"><h2 id="experiments-title">Personal projects</h2></div>
      <div className="project-grid">
        {profile.projects.slice(0, 2).map((project, i) => <article className={`project project-${i}`} key={project.name}>
          <div className="project-heading"><h3>{project.name}</h3></div>
          <p>{project.description}</p>
          {project.details && <dl className="project-details">{project.details.map(detail => <div key={detail.label}><dt>{detail.label}</dt><dd>{detail.text}</dd></div>)}</dl>}
          <div className="project-links"><a className="quiet-link" href={project.demo}>{i === 0 ? "Try La Bulle" : "For agents"}</a><a className="quiet-link" aria-label={`How I built ${i === 0 ? "La Bulle" : "this website"}`} href={i === 0 ? "/notes/building-la-bulle" : project.url}>How I built it</a>{i === 0 && <a className="quiet-link" href={profile.hackathonUrl}>X-IA hackathon</a>}</div>
        </article>)}
      </div>
      <div className="tool-row"><a className="quiet-link" href={profile.projects[2].url}>cmake2graph</a><p>{profile.projects[2].description}</p></div>
    </section>

    <section className="writing-section" aria-labelledby="writing-title">
      <div className="section-heading"><h2 id="writing-title">Notes</h2><a className="quiet-link" href="/notes.html">All notes</a></div>
      <ul className="note-list">{notes.map(entry => <NoteRow key={entry.slug} entry={entry} />)}</ul>
    </section>

    <section className="contact-section"><p>Contact</p><a className="action-link" href={`mailto:${profile.email}`}>Say hello</a></section>
  </>;
}

function ProjectLinks({ project }: { project: Project }) {
  if (!project.url && !project.source) return null;
  return <div className="project-links">
    {project.url && <a className="quiet-link" href={project.url} aria-label={`Open project: ${project.name}`}>Open project</a>}
    {project.source && <a className="quiet-link" href={project.source} aria-label={`Source on GitHub: ${project.name}`}>Source on GitHub</a>}
    {project.id === "bulle" && <a className="quiet-link" href="/notes/building-la-bulle">How I built La Bulle</a>}
  </div>;
}

function Projects({ data }: { data: SiteData }) {
  const groups = [
    { id: "scientific", title: "Scientific computing & engineering" },
    { id: "experiences", title: "Apps & websites" },
    { id: "developer", title: "Developer tools" },
    { id: "experiments", title: "Research & experiments" },
    { id: "utilities", title: "Other tools" },
  ];
  const website = profile.projects.find(project => project.name === "This website")!;
  return <article className="projects-page">
    <h1>Projects</h1>
    <p className="page-lede">{studio.description} My projects also include developer tools, apps, and research experiments.</p>
    <a className="quiet-link studio-site-link" href={studio.url}>Visit {studio.name}</a>
    <nav className="project-index-nav" aria-label="Project categories">{groups.map(group => <a className="quiet-link" key={group.id} href={`/projects.html#${group.id}`}>{group.title}</a>)}</nav>
    {groups.map(group => <section className="project-group" key={group.id} aria-labelledby={group.id}>
      <h2 id={group.id}>{group.title}</h2>
      <ul className="catalog-list">{projectCatalog.filter(project => project.group === group.id).map(project => <li className="catalog-project" key={project.id}>
        <div className="catalog-heading"><h3>{project.name}</h3><p>{project.area}{project.status && ` / ${project.status}`}</p></div>
        <div className="catalog-description"><p>{project.description}</p><ProjectLinks project={project} /></div>
      </li>)}{group.id === "experiences" && <li className="catalog-project"><div className="catalog-heading"><h3>{website.name}</h3><p>Personal website</p></div><div className="catalog-description"><p>{website.description}</p><div className="project-links"><a className="quiet-link" href={website.url}>How I built this website</a><a className="quiet-link" href={website.demo}>For agents</a></div></div></li>}</ul>
    </section>)}
    <MarkdownLink url={data.page.markdownUrl} />
  </article>;
}

function Writing({ data }: { data: SiteData }) {
  const [topic, setTopic] = useState("All");
  const notes = data.entries.filter(entry => entry.kind === "note");
  const topics = ["All", ...new Set(notes.flatMap(entryTopics))];
  const visibleNotes = filterByTopic(notes, topic);
  return <section className="document-index">
    <h1>Notes</h1>
    <p className="page-lede">AI-assisted development, developer tools, C++, and scientific computing.</p>
    <div className="topics client-control" aria-label="Filter writing by topic">{topics.map(value => <Button key={value} variant={topic === value ? "default" : "ghost"} size="sm" aria-pressed={topic === value} onClick={() => setTopic(value)}>{value}</Button>)}</div>
    <p className="topic-count client-control" role="status" aria-live="polite" aria-atomic="true">{visibleNotes.length} {visibleNotes.length === 1 ? "note" : "notes"}{topic !== "All" && ` about ${topic}`}</p>
    <ul className="note-list">{visibleNotes.map(entry => <NoteRow entry={entry} key={entry.slug} />)}</ul>
    <div className="index-bottom"><a className="quiet-link" href="/feed.xml">Subscribe via RSS</a><MarkdownLink url={data.page.markdownUrl} /></div>
  </section>;
}

function About({ data }: { data: SiteData }) {
  return <article className="about-page">
    <div className="about-heading"><div><p className="hello">About</p><h1>Hi, I'm Kenneth.</h1></div><img src="/assets/img/portrait.png" width="176" height="176" alt="Kenneth Assogba" /></div>
    <div className="prose">
      <p>{profile.intro}</p>
      <h2>FPGA prototyping</h2>
      <p>{profile.prototyping} {profile.work[0].text}</p>
      <p>{profile.work[1].text}</p>
      <p>{profile.work[2].text}</p>
      <p><a href={profile.prototypingArticle}>Siemens' overview of Veloce proFPGA CS</a> explains the prototyping platform.</p>
      <h2>AI-assisted development</h2>
      <p>{profile.work[3].text}</p>
      <h2>{studio.name}</h2>
      <p>{studio.description} I'm working on nuclear-data tools, neutron-transport calculations, and IC floorplanning.</p>
      <p><a href={studio.url}>Visit {studio.name}</a> or <a href="/projects.html">see all my projects</a>.</p>
      <h2>Experience</h2>
      <p>Before Siemens, I built simulation software at CEA during my PhD in Applied Mathematics at École polytechnique.</p>
      <p>I grew up in Benin and now live in Sceaux, France.</p>
      <dl className="timeline"><div><dt>2023 - now</dt><dd><strong>Siemens EDA</strong><span>FPGA prototyping · Placement & partitioning · C++</span></dd></div><div><dt>2020 - 2023</dt><dd><strong>CEA / École polytechnique</strong><span>Simulation software · C++ · MPI & OpenMP · PhD</span></dd></div><div><dt>2020</dt><dd><strong>Total</strong><span>Wave propagation simulation and Python tooling</span></dd></div></dl>
      <h2>Publications</h2>
      <p>From my research at CEA.</p>
      <ul className="publication-list">{data.entries.filter(e => e.kind === "publication").map(e => <li key={e.slug}><a href={`/${e.slug}`}>{e.title}</a><small>{e.place} · {e.date}</small></li>)}</ul>
      <p><a href="https://scholar.google.com/citations?user=zumTckUAAAAJ">Google Scholar</a> · <a href="https://orcid.org/0000-0002-0635-7508">ORCID</a></p>
    </div>
    <MarkdownLink url={data.page.markdownUrl} />
  </article>;
}

function CopyMarkdown({ url }: { url: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "copied" | "error">("idle");
  return <><Button className="client-control" variant="ghost" size="sm" disabled={status === "loading"} onClick={async () => {
    setStatus("loading");
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Could not load Markdown");
      await navigator.clipboard.writeText(await response.text());
      setStatus("copied");
    } catch { setStatus("error"); }
  }}>{status === "copied" ? <Check /> : <Copy />}{status === "copied" ? "Copied" : status === "loading" ? "Copying..." : "Copy Markdown"}</Button><span className="copy-status" role="status">{status === "error" ? "Copy unavailable. Open the Markdown link instead." : status === "copied" ? "Markdown copied to clipboard." : ""}</span></>;
}

function Article({ data }: { data: SiteData }) {
  const entry = data.page.entry!;
  return <article className="article-page">
    <a className="quiet-link article-back" href={entry.kind === "note" ? "/notes.html" : "/about.html"}>{entry.kind === "note" ? "All notes" : "About Kenneth"}</a>
    <header className="article-heading"><div className="article-meta"><time dateTime={entry.date}>{dateLabel(entry.date, true)}</time><span>{entry.categories}</span><span>{entry.readingMinutes} min read</span>{entry.draft && <Badge variant="outline">Draft</Badge>}</div><h1>{entry.title}</h1><p className="page-lede">{entry.description}</p>{entry.authors && <p className="muted">{entry.authors}</p>}</header>
    {entry.draft && <aside className="draft-notice">An older working note. Some results and references are still unfinished.</aside>}
    {entry.headings && entry.headings.filter(heading => heading.level === 2).length >= 4 && <nav className="article-contents" aria-label="Article sections"><h2>Contents</h2><ul>{entry.headings.filter(heading => heading.level === 2).map(heading => <li key={heading.id}><a href={`${data.page.route}#${heading.id}`}>{heading.title}</a></li>)}</ul></nav>}
    <div className="prose" dangerouslySetInnerHTML={{ __html: entry.html }} />
    <Separator className="article-rule" />
    <div className="article-formats"><MarkdownLink url={data.page.markdownUrl} /><CopyMarkdown url={data.page.markdownUrl} /></div>
    <p className="article-signoff">Written by Kenneth Assogba. <a href={`mailto:${profile.email}`}>Email me</a></p>
  </article>;
}

function Agents({ data }: { data: SiteData }) {
  const resources = [
    ["Start here", "/llms.txt", "Page titles and Markdown links."],
    ["Everything in Markdown", "/llms-full.txt", "Profile, projects, notes, and publications in one file."],
    ["Content index", "/api/content.json", "Titles, topics, dates, URLs, and plain text for local search."],
    ["Profile", "/api/profile.json", "My work, projects, and contact details."],
    ["Projects", "/api/projects.json", "My studio and project descriptions, with public links."],
    ["API catalog", "/.well-known/api-catalog", "Read-only APIs and their OpenAPI description."],
    ["RSS feed", "/feed.xml", "Subscribe to new notes."],
  ];
  return <article className="agents-page">
    <h1>For agents</h1>
    <p className="page-lede">Markdown pages, content discovery, and WebMCP tools.</p>
    <div className="prose"><p>Every page is available as Markdown. You can also read the content index or use the browser tools below.</p></div>
    <dl className="resource-list">{resources.map(([name, url, description]) => <div key={url}><dt><a className="quiet-link" href={url}>{name}</a><code>{url}</code></dt><dd>{description}</dd></div>)}</dl>
    <div className="prose">
      <h2>Content Signals</h2>
      <p>I allow search, AI input, and model training in <a href="/robots.txt">robots.txt</a>. Content Signals declare these preferences to crawlers that support them.</p>
      <h2>WebMCP</h2>
      <p>In browsers with WebMCP support, <code>search_content</code> searches the notes and publications, and <code>read_page</code> reads a page as Markdown. Both tools are read-only.</p>
      <h2>Hosting</h2>
      <p>On GitHub Pages, use the explicit Markdown URLs. The optional Cloudflare adapter supports <code>Accept: text/markdown</code> and HTTP discovery headers. WebMCP support depends on the browser.</p>
      <p><a href="/notes/a-website-for-people-and-agents">Read the implementation note</a></p>
    </div>
    <MarkdownLink url={data.page.markdownUrl} />
  </article>;
}

export function App({ data }: { data: SiteData }) {
  return <div className="site-shell"><a className="skip-link" href={`${data.page.route}#main`}>Skip to content</a><Header data={data} /><main id="main">{data.page.type === "home" ? <Home data={data} /> : data.page.type === "about" ? <About data={data} /> : data.page.type === "projects" ? <Projects data={data} /> : data.page.type === "notes" ? <Writing data={data} /> : data.page.type === "agents" ? <Agents data={data} /> : data.page.type === "article" ? <Article data={data} /> : <section className="not-found"><h1>Page not found</h1><p>This page doesn't exist.</p><Button asChild><a href="/">Back home</a></Button></section>}</main><footer className="site-footer"><span>{profile.name}</span><div><a href={profile.github}>GitHub</a><a href={profile.linkedin}>LinkedIn</a><a href="/agents.html">For agents</a></div></footer></div>;
}
