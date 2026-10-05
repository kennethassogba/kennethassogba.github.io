import { hydrateRoot } from "react-dom/client";
import { App } from "./App";
import { registerAgentTools } from "./lib/webmcp";
import type { SiteData } from "./types";
import "./styles.css";

const element = document.getElementById("site-data");
const root = document.getElementById("root");
if (element?.textContent && root) {
  const data: SiteData = JSON.parse(element.textContent);
  document.documentElement.classList.add("js");
  hydrateRoot(root, <App data={data} />);
  void registerAgentTools(data);
}
