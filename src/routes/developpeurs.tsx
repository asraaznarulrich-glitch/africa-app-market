import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Upload } from "lucide-react";
import { api, CATEGORIES, COUNTRIES, FORMATS, type Format } from "@/services/api";

export const Route = createFileRoute("/developpeurs")({
  head: () => ({
    meta: [
      { title: "Espace Développeurs — Publier une app | AfriStore" },
      { name: "description", content: "Soumettez votre PWA, Web App, APK ou IPA sur AfriStore et touchez tout le continent." },
      { property: "og:title", content: "Publiez votre app sur AfriStore" },
      { property: "og:description", content: "Portail de soumission pour développeurs africains." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dev,
});

const input = "w-full rounded-lg border bg-background px-3 py-2";

function Dev() {
  const [f, setF] = useState({ name: "", tagline: "", description: "", developer: "", category: CATEGORIES[0]!, country: "SN", url: "", sizeMb: 5, dataUsage: "Faible" as const });
  const [formats, setFormats] = useState<Format[]>(["PWA"]);
  const [file, setFile] = useState<File | null>(null);
  const [legal, setLegal] = useState({ rights: false, malware: false, charter: false });
  const [done, setDone] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const ok = legal.rights && legal.malware && legal.charter && formats.length > 0;
  const native = formats.some((x) => x === "APK" || x === "IPA");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!ok || busy) return;
    setBusy(true); setErr("");
    try {
    const flag = COUNTRIES.find((c) => c[0] === f.country)?.[1] ?? "🌍";
    const app = await api.submitApp({ ...f, flag, formats, sizeMb: file ? Math.round((file.size / 1048576) * 10) / 10 : f.sizeMb, ...(file ? { downloadUrl: await api.uploadBinary(file) } : {}) });
    setDone(app.id);
    } catch (x) { setErr(x instanceof Error ? x.message : "Échec de l'envoi"); } finally { setBusy(false); }
  };

  if (done) return <div className="mx-auto max-w-xl px-4 py-16 text-center"><h1 className="text-3xl font-bold">Merci ! 🎉</h1><p className="mt-3 text-muted-foreground">Votre application est soumise et visible dans le catalogue de démonstration.</p><Link to="/app/$id" params={{ id: done }} className="mt-6 inline-block rounded-xl bg-emerald px-5 py-3 font-semibold text-emerald-foreground">Voir la fiche</Link></div>;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold md:text-4xl">Espace <span className="text-ochre">Développeurs</span></h1>
      <p className="mt-2 text-muted-foreground">Publiez votre app en quelques minutes. Formats acceptés : PWA, Web App, APK, IPA.</p>
      <form onSubmit={submit} className="mt-8 space-y-6">
        <fieldset className="grid gap-3 rounded-2xl border bg-card p-5 sm:grid-cols-2">
          <legend className="px-2 font-display font-bold">Métadonnées</legend>
          <input required placeholder="Nom de l'app" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={input} />
          <input required placeholder="Développeur / Société" value={f.developer} onChange={(e) => setF({ ...f, developer: e.target.value })} className={input} />
          <input required placeholder="Accroche courte" value={f.tagline} onChange={(e) => setF({ ...f, tagline: e.target.value })} className={`${input} sm:col-span-2`} />
          <textarea required placeholder="Description" value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} className={`${input} sm:col-span-2`} rows={4} />
          <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} aria-label="Catégorie" className={input}>{CATEGORIES.map((c) => <option key={c}>{c}</option>)}</select>
          <select value={f.country} onChange={(e) => setF({ ...f, country: e.target.value })} aria-label="Pays" className={input}>{COUNTRIES.map(([c, fl, n]) => <option key={c} value={c}>{fl} {n}</option>)}</select>
          <select value={f.dataUsage} onChange={(e) => setF({ ...f, dataUsage: e.target.value as typeof f.dataUsage })} aria-label="Consommation data" className={input}>{["Faible", "Moyenne", "Élevée"].map((d) => <option key={d}>{d}</option>)}</select>
          <input type="number" min={0} step={0.1} value={f.sizeMb} onChange={(e) => setF({ ...f, sizeMb: +e.target.value })} aria-label="Taille en Mo" className={input} />
        </fieldset>
        <fieldset className="space-y-3 rounded-2xl border bg-card p-5">
          <legend className="px-2 font-display font-bold">Format & fichier</legend>
          <div className="flex flex-wrap gap-2">{FORMATS.map((x) => <label key={x} className={`cursor-pointer rounded-full border px-3 py-1.5 text-sm ${formats.includes(x) ? "border-ochre bg-ochre text-primary-foreground" : ""}`}><input type="checkbox" className="sr-only" checked={formats.includes(x)} onChange={() => setFormats(formats.includes(x) ? formats.filter((y) => y !== x) : [...formats, x])} />{x}</label>)}</div>
          <input type="url" placeholder="Lien de la PWA / Web App (https://…)" value={f.url} onChange={(e) => setF({ ...f, url: e.target.value })} className={input} />
          {native && <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed p-4 text-sm text-muted-foreground"><Upload className="h-5 w-5" />{file ? file.name : "Téléverser le fichier .apk ou .ipa"}<input type="file" accept=".apk,.ipa" className="sr-only" onChange={(e) => setFile(e.target.files?.[0] ?? null)} /></label>}
        </fieldset>
        <fieldset className="space-y-3 rounded-2xl border-2 border-amber-legal/60 bg-card p-5">
          <legend className="px-2 font-display font-bold text-amber-legal">📙 Engagement juridique obligatoire</legend>
          {([["rights", "Je détiens tous les droits nécessaires sur cette application et son contenu."], ["malware", "Je garantis que l'application ne contient aucun malware, spyware ni code malveillant, et respecte les lois applicables."], ["charter", "J'accepte la Charte Développeurs et assume l'entière responsabilité de l'app ; j'indemnise AfriStore, simple hébergeur technique, contre toute réclamation."]] as const).map(([k, t]) => (
            <label key={k} className="flex gap-3 text-sm"><input type="checkbox" required checked={legal[k]} onChange={(e) => setLegal({ ...legal, [k]: e.target.checked })} className="mt-0.5 h-5 w-5 shrink-0 accent-amber-legal" />{t}</label>))}
          <Link to="/legal" hash="developpeurs" className="text-sm text-amber-legal underline">Lire la Charte Développeurs</Link>
        </fieldset>
        {err && <p className="text-sm text-destructive">{err}</p>}
        <button disabled={!ok || busy} className="w-full rounded-xl bg-emerald py-3 font-semibold text-emerald-foreground disabled:opacity-40">{busy ? "Envoi en cours…" : "Soumettre l'application"}</button>
      </form>
    </div>
  );
}
