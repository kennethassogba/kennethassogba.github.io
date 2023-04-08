import { interpolate } from "@prpl/core";
import { resolveHTMLImports } from "@prpl/plugin-html-imports";
import { highlightCode } from "@prpl/plugin-code-highlight";
import { generateSitemap } from "@prpl/plugin-sitemap";

await interpolate({
  options: {
    noClientJS: true,
  },
});

await resolveHTMLImports();

await highlightCode();

const origin = "https://kennethassogba.github.io";

await generateSitemap({
  origin,
  ignoreDirRegex: new RegExp("dist/fragments"),
});
