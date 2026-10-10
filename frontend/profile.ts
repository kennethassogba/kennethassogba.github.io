import { studio, projectCatalog } from "./projects";

const summary = "I write software that maps large chip designs onto FPGAs so teams can test them before manufacturing. I use AI in my development work, write agent skills, and connect development tools through MCP.";

export const profile = {
  studio,
  projectCatalog,
  name: "Kenneth Assogba",
  role: "Software Engineer",
  location: "Sceaux, France",
  employer: "Siemens EDA",
  prototypingArticle: "https://blogs.sw.siemens.com/hardware-assisted-verification/2024/10/16/fpga-based-prototyping-from-do-it-yourself-to-an-essential-soc-verification-and-system-validation-tool/",
  linkedin: "https://www.linkedin.com/in/kennethassogba/",
  github: "https://github.com/kennethassogba",
  email: "kennethassogba@gmail.com",
  hackathonUrl: "https://ax.polytechnique.org/fr/event/x-ia-hachathon-1-rise-of-agents-x/2026/09/27/3147",
  intro: `I'm a software engineer at Siemens EDA. ${summary}`,
  summary,
  prototyping: "I work on the compiler for FPGA prototyping, which maps a chip design across multiple FPGAs.",
  focus: ["C++ & Python", "EDA", "AI-assisted development", "Agent skills & MCP"],
  work: [
    { label: "Placement & partitioning", text: "I write placement and partitioning algorithms for the compiler that distributes a chip's netlist across multiple FPGAs." },
    { label: "Netlist qualification", text: "I've recently started working on netlist qualification, including clock handling." },
    { label: "Performance optimization", text: "I redesigned circuit replication to run over 4× faster on production designs, and optimized graph pruning with speedups of up to 60× on large circuits." },
    { label: "AI-assisted development", text: "I document our codebase and engineering practices in agent skills, and connect development tools through MCP servers." },
  ],
  projects: [
    { name: "La Bulle", category: "Team project", description: "I built this voice coaching app for the X-IA hackathon. You talk through a situation, then get a recap you can edit.", details: [
      { label: "During the session", text: "The coach asks one question at a time. You can interrupt it or ask for time to think." },
      { label: "After the call", text: "Edit the recap, send it by email, or use it to start the optional Notion follow-up." },
    ], url: "https://github.com/kennethassogba/hodge-podge", demo: "https://bulle.hodge-podge.workers.dev/?lang=en", tags: ["OpenAI Realtime", "Workers & D1", "Resend"] },
    { name: "This website", category: "Personal project", description: "I'm following Cloudflare's recommendations to make this site readable by agents. Each page has a Markdown version, and agents can find, search, and read the content through indexes and WebMCP tools.", url: "/notes/a-website-for-people-and-agents", demo: "/agents.html", tags: ["shadcn/ui", "Markdown", "WebMCP"] },
    { name: "cmake2graph", category: "Developer tool", description: "A Python tool that draws the dependencies between CMake targets.", url: "https://github.com/kennethassogba/cmake2graph", tags: ["Python", "CMake"] },
  ],
};
