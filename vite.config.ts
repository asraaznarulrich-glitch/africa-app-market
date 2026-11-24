// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only), VITE_* env injection, @ path alias, React/TanStack dedupe,
//     error logger plugins, and sandbox detection (port/host/strictPort).
// Never set ssr.external or resolve.external: the Worker has no runtime module resolution, so
// the build fails. Never add compression (compressPublicAssets, vite-plugin-compression):
// hosting already compresses at the edge.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Netlify runs the SSR server as a Netlify Function. The `netlify` preset
  // emits static assets to `dist/` (the publish directory in netlify.toml)
  // and the server handler to `.netlify/functions-internal`, which Netlify
  // deploys automatically. Pinned explicitly so every build targets the same
  // output layout instead of relying on platform auto-detection.
  nitro: { preset: "netlify" },
  tanstackStart: {
    // Use the SSR error wrapper in src/server.ts.
    server: { entry: "src/server.ts" },
  },
});
