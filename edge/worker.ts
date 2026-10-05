import { serveRepresentation } from "./representations";

export default {
  fetch(request, env) {
    return serveRepresentation(request, assetRequest => env.ASSETS.fetch(assetRequest));
  },
} satisfies ExportedHandler<Env>;
