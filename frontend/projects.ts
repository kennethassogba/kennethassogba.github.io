export const studio = {
  name: "k_eff",
  url: "https://keff.uk/",
  description: "I'm developing k_eff, an independent software studio focused on scientific computing and engineering tools.",
};

export type Project = {
  id: string;
  name: string;
  description: string;
  url: string;
  source?: string;
};

export const projectCatalog: Project[] = [
  {
    id: "buildray",
    name: "Buildray",
    description: "A tool for measuring C++ builds and removing unused includes and library dependencies. Each patch is tested in a separate copy of the project.",
    url: "https://kennethassogba.github.io/buildray/",
    source: "https://github.com/kennethassogba/buildray",
  },
  {
    id: "keff",
    name: studio.name,
    description: "My independent software studio for scientific computing and engineering tools.",
    url: studio.url,
  },
];
