// This file is also recognized by TanStack/Nitro as the server entry based on its
// conventional root-level name. Re-export the app's intended SSR entry so the
// bundler finds the required default export. Render starts Nitro's built Node server.
export { default } from "./src/server.ts";
