import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Search, Star, Sparkles } from "lucide-react";
import { api, CATEGORIES, COUNTRIES, FORMATS, type AppItem } from "@/services/api";
import { AppIcon } from "@/components/AppIcon";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AfriStore — Apps africaines : PWA, Web Apps, APK, IPA" },
      { name: "description", content: "Le store alternatif des pépites tech africaines. Fintech, éducation, santé et plus, légères en données." },
      { property: "og:title", content: "AfriStore — Le store d'applications africain" },
      { property: "og:description", content: "Découvrez et installez les meilleures apps du continent." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const chip = (on: boolean) => `whitespace-nowrap rounded-full border px-3 py-1.5 text-sm transition ${on ? "border-ochre bg-ochre text-primary-foreground" : "bg-card text-muted-foreground hover:text-foreground"}`;

function Home() {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string | null>(null);
  const [fmt, setFmt] = useState<string | null>(null);
  const [country, setCountry] = useState("");
  useEffect(() => { api.listApps().then(setApps); }, []);
  const list = useMemo(() => apps.filter((a) =>
    (!q || `${a.name} ${a.tagline} ${a.developer}`.toLowerCase().includes(q.toLowerCase())) &&
    (!cat || a.category === cat) && (!fmt || a.formats.includes(fmt as AppItem["formats"][number])) && (!country || a.country === country)), [apps, q, cat, fmt, country]);
  const featured = apps.filter((a) => a.featured);
  const filtering = q || cat || fmt || country;

  return (
    <div>
      <section className="relative overflow-hidden border-b" style={{ backgroundImage: "var(--gradient-hero)" }}>
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <p className="inline-flex items-center gap-2 rounded-full border bg-card/60 px-3 py-1 text-xs text-ochre"><Sparkles className="h-3 w-3" /> Fait en Afrique, pour l'Afrique</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">Les apps du continent, <span className="text-ochre">légères</span> et <span className="text-terracotta">libres</span>.</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">PWA, Web Apps, APK et IPA — sans passer par les grands stores. Taille et consommation data affichées pour chaque app.</p>
          <label className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border bg-card px-4 py-3 focus-within:border-ochre">
            <Search className="h-5 w-5 text-muted-foreground" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une app, un développeur…" aria-label="Rechercher" className="w-full bg-transparent outline-none placeholder:text-muted-foreground" />
          </label>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4">
        <div className="mt-6 space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1"><button className={chip(!cat)} onClick={() => setCat(null)}>Toutes</button>{CATEGORIES.map((c) => <button key={c} className={chip(cat === c)} onClick={() => setCat(cat === c ? null : c)}>{c}</button>)}</div>
          <div className="flex flex-wrap items-center gap-2">
            {FORMATS.map((f) => <button key={f} className={chip(fmt === f)} onClick={() => setFmt(fmt === f ? null : f)}>{f}</button>)}
            <select value={country} onChange={(e) => setCountry(e.target.value)} aria-label="Pays" className="rounded-full border bg-card px-3 py-1.5 text-sm">
              <option value="">🌍 Tous les pays</option>{COUNTRIES.map(([c, f, n]) => <option key={c} value={c}>{f} {n}</option>)}
            </select>
          </div>
        </div>

        {!filtering && featured.length > 0 && (
          <section className="mt-10"><h2 className="text-2xl font-bold">Pépites tech africaines</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">{featured.map((a) => (
              <Link key={a.id} to="/app/$id" params={{ id: a.id }} className="group rounded-2xl border bg-card p-5 transition hover:border-ochre">
                <div className="flex items-center gap-3"><AppIcon name={a.name} hue={a.hue} /><div><p className="font-display font-bold">{a.name}</p><p className="text-xs text-muted-foreground">{a.flag} {a.developer}</p></div></div>
                <p className="mt-3 text-sm text-muted-foreground">{a.tagline}</p>
                <Meta a={a} />
              </Link>))}</div>
          </section>
        )}

        <section className="mt-10"><h2 className="text-2xl font-bold">{filtering ? `${list.length} résultat(s)` : "Toutes les applications"}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{list.map((a) => (
            <Link key={a.id} to="/app/$id" params={{ id: a.id }} className="flex gap-3 rounded-2xl border bg-card p-4 transition hover:border-ochre">
              <AppIcon name={a.name} hue={a.hue} /><div className="min-w-0 flex-1"><p className="truncate font-semibold">{a.name} <span className="ml-1">{a.flag}</span></p><p className="truncate text-sm text-muted-foreground">{a.tagline}</p><Meta a={a} /></div>
            </Link>))}</div>
          {list.length === 0 && <p className="mt-6 text-muted-foreground">Aucune app ne correspond à ces filtres.</p>}
        </section>
      </div>
    </div>
  );
}

function Meta({ a }: { a: AppItem }) {
  return (
    <div className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
      <span className="inline-flex items-center gap-1 text-ochre"><Star className="h-3 w-3 fill-current" />{a.rating || "—"}</span>
      <span className="text-muted-foreground">· {a.sizeMb} Mo · data {a.dataUsage.toLowerCase()}</span>
      {a.formats.map((f) => <span key={f} className="rounded bg-muted px-1.5 py-0.5">{f}</span>)}
    </div>
  );
}
