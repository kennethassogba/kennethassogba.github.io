export const profile = {
  name: "Kenneth Assogba",
  role: "Software Engineer",
  location: "Sceaux, France",
  employer: "Siemens EDA",
  prototypingArticle: "https://blogs.sw.siemens.com/hardware-assisted-verification/2024/10/16/fpga-based-prototyping-from-do-it-yourself-to-an-essential-soc-verification-and-system-validation-tool/",
  linkedin: "https://www.linkedin.com/in/kennethassogba/",
  github: "https://github.com/kennethassogba",
  email: "kennethassogba@gmail.com",
  intro: "I’m a software engineer at Siemens EDA. I build software that maps large chip designs onto programmable hardware (FPGAs), so teams can test them before manufacturing the chips. I also use AI for development and build agent skills and MCP integrations.",
  prototyping: "I work on the compiler for FPGA prototyping, which maps a chip design across multiple FPGAs.",
  focus: ["C++ & Python", "AI-assisted development", "Agent skills & MCP"],
  work: [
    { label: "Placement & partitioning", text: "I develop placement and partitioning algorithms that map a chip’s netlist across multiple FPGAs." },
    { label: "Netlist qualification", text: "I’ve recently started working on netlist qualification, including clock handling." },
    { label: "Performance optimization", text: "I redesigned circuit replication to run over 4× faster on production designs, and optimized graph pruning with speedups of up to 60× on large circuits." },
    { label: "AI-assisted development", text: "I write agent skills that explain our codebase and engineering practices, and integrate MCP servers into the development workflow." },
  ],
  projects: [
    { name: "La Bulle", category: "Team project", description: "A voice coaching app with an editable recap and optional Notion follow-up.", url: "https://github.com/kennethassogba/hodge-podge", demo: "https://bulle.hodge-podge.workers.dev/?lang=en", tags: ["Voice", "OpenAI", "Cloudflare"] },
    { name: "This website", category: "Personal project", description: "I’m making this website AI-native, following Cloudflare’s recommendations: Markdown pages, content discovery, and WebMCP tools for agents to search and read it.", url: "/notes/a-website-for-people-and-agents", demo: "/agents.html", tags: ["shadcn/ui", "Markdown", "WebMCP"] },
    { name: "cmake2graph", category: "Developer tool", description: "A Python tool for visualizing CMake target dependencies.", url: "https://github.com/kennethassogba/cmake2graph", tags: ["Python", "CMake"] },
  ],
};
