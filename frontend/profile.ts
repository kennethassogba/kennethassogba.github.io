import { studio, projectCatalog } from "./projects";
import { contributions } from "./contributions";

const summary = "I write software that maps large chip designs onto FPGAs so teams can test them before manufacturing. I use AI in my development work, write agent skills, and connect development tools through MCP.";

export const profile = {
  studio,
  projectCatalog,
  contributions,
  shortBio: "I build compiler software that maps chip designs onto FPGAs so engineers can test them before manufacturing. I write C++ and Python.",
  background: "I also work on agent skills and MCP integrations for AI-assisted development. Before Siemens, I built simulation software at CEA during my PhD at École polytechnique.",
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
};
