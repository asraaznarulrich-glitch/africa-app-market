// Serveur de production optionnel pour Render (Node Web Service).
// Usage : npm run build && node server.js  (npm i express au préalable)
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const dist = path.join(__dirname, "dist", "client");

app.get("/healthz", (_req, res) => res.json({ ok: true }));
app.use(express.static(dist, { maxAge: "1h", index: false }));
app.get("*", (_req, res) => res.sendFile(path.join(dist, "index.html")));

const port = process.env.PORT || 10000;
app.listen(port, () => console.log(`AfriStore en ligne sur :${port}`));
