export const studio = {
  name: "k_eff",
  url: "https://keff.uk/",
  description: "I'm developing k_eff, an independent software studio focused on scientific computing and engineering tools.",
};

export type Project = {
  id: string;
  name: string;
  group: "scientific" | "experiences" | "developer" | "experiments" | "utilities";
  area: string;
  description: string;
  url?: string;
  source?: string;
  status?: string;
};

export const projectCatalog: Project[] = [
  { id: "xs", name: "XS", group: "scientific", area: "Nuclear data",
    description: "A browser application for exploring nuclear cross-section data, preparing multigroup cross sections, and comparing and exporting the results. Projects stay on your device.",
    url: "https://xs.keff.uk/" },
  { id: "forge", name: "Forge", group: "scientific", area: "IC floorplanning",
    description: "An interactive IC floorplanner with thermal and IR-drop analysis. Move blocks and adjust power to see how the modeled temperature and voltage-drop maps change.",
    url: "https://forge.keff.uk/" },
  { id: "mc", name: "mc", group: "scientific", area: "Neutron transport",
    description: "A Monte Carlo neutron-transport research application. Configure reactor geometry and run calculations on your GPU through WebGPU, in the browser.",
    url: "https://mc.keff.uk/", status: "Research prototype" },
  { id: "bulle", name: "La Bulle", group: "experiences", area: "Voice coaching",
    description: "A voice coaching app I built for the X-IA hackathon. Talk through a situation, then edit the recap, send it by email, or start a Notion follow-up.",
    url: "https://bulle.hodge-podge.workers.dev/?lang=en", source: "https://github.com/kennethassogba/hodge-podge" },
  { id: "model-card", name: "Model Card", group: "experiences", area: "Collectible cards",
    description: "A collectible card game about AI models, their tools, and the people building them.",
    url: "https://card.keff.uk/" },
  { id: "amata", name: "AMATA°", group: "experiences", area: "Coffee storefront",
    description: "The storefront I'm developing for AMATA°, an East African coffee brand.",
    url: "https://amata.coffee/" },
  { id: "cmake2graph", name: "cmake2graph", group: "developer", area: "CMake",
    description: "A Python tool that draws the dependencies between CMake targets.",
    source: "https://github.com/kennethassogba/cmake2graph" },
  { id: "human-mpi", name: "human.mpi", group: "developer", area: "C++ & MPI",
    description: "A header-only C++ wrapper for MPI. Send strings and vectors without manually managing the receiving buffer size.",
    source: "https://github.com/kennethassogba/human.mpi" },
  { id: "buildray", name: "buildray", group: "developer", area: "C++ builds",
    description: "A planned tool for analyzing C++ build times from compiler traces, include graphs, and CMake dependencies. The repository currently contains the project outline and tooling configuration.",
    source: "https://github.com/kennethassogba/buildray", status: "Planning" },
  { id: "demeter", name: "Demeter", group: "experiments", area: "Neutron transport",
    description: "A deterministic multigroup neutron-transport project in C++, with Python bindings. Geometry and material support are in place; the solver and benchmarks are still on the roadmap.",
    source: "https://github.com/kennethassogba/Demeter", status: "In development" },
  { id: "lattice", name: "Lattice", group: "experiments", area: "Neutron transport",
    description: "A C++23 project for two-dimensional multigroup pin-cell transport.", status: "Prototype" },
  { id: "heat", name: "heat", group: "experiments", area: "Parallel computing",
    description: "A C++ heat-diffusion experiment for studying parallelism and performance.",
    source: "https://github.com/kennethassogba/heat" },
  { id: "pinn", name: "pinn-experiment", group: "experiments", area: "Scientific machine learning",
    description: "Experiments with physics-informed neural networks, based on janblechschmidt/PDEsByNNs.",
    source: "https://github.com/kennethassogba/pinn-experiment" },
  { id: "cross-section-plot", name: "cross-section-plot", group: "experiments", area: "Nuclear data",
    description: "Plots of neutron cross sections against incident energy, using tabulated ENDF/B-VIII.0 data from the IAEA at 293 K.",
    source: "https://github.com/kennethassogba/cross-section-plot" },
  { id: "dequantization", name: "dequantization", group: "experiments", area: "Zig",
    description: "A Zig dequantization prototype with a basic implementation and unit tests. Real-data tests, benchmarks, and SIMD optimization are planned.", status: "Prototype" },
  { id: "clash-report", name: "Clash Royale War Report", group: "utilities", area: "Python automation",
    description: "A Python script that reads clan war statistics from the Clash Royale API and posts a report to Discord. It needs a machine with a whitelisted static IP.",
    source: "https://github.com/kennethassogba/ClashRoyaleWarReport" },
];
