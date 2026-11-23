import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Star, Flag, Download, Globe, Wifi, HardDrive, ShieldAlert } from "lucide-react";
import { api, COUNTRIES, type AppItem } from "@/services/api";
import { AppIcon } from "@/components/AppIcon";

export const Route = createFileRoute("/app/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.id} — Fiche application | AfriStore` },
      { name: "description", content: "Fiche détaillée : captures, avis, taille, consommation data et installation." },
      { property: "og:title", content: "Application sur AfriStore" },
      { property: "og:description", content: "Découvrez et installez cette application africaine." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AppPage,
});

function AppPage() {
  const { id } = Route.useParams();
  const [app, setApp] = useState<AppItem | null | undefined>(undefined);
  const [report, setReport] = useState(false);
  const [rev, setRev] = useState({ author: "", rating: 5, text: "" });
  const reload = () => api.getApp(id).then(setApp);
  useEffect(() => { reload(); }, [id]);
  if (app === undefined) return <p className="p-10 text-center text-muted-foreground">Chargement…</p>;
  if (!app) return <div className="p-10 text-center"><p>Application introuvable.</p><Link to="/" className="text-ochre underline">Retour au catalogue</Link></div>;
  const country = COUNTRIES.find((c) => c[0] === app.country)?.[2] ?? app.country;
  const ld = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: app.name, description: app.description, applicationCategory: app.category, operatingSystem: app.formats.join(", "), fileSize: `${app.sizeMb}MB`, author: { "@type": "Organization", name: app.developer }, countryOfOrigin: country, offers: { "@type": "Offer", price: 0, priceCurrency: "XOF" }, ...(app.reviews.length ? { aggregateRating: { "@type": "AggregateRating", ratingValue: app.rating, reviewCount: app.reviews.length } } : {}) };
  const native = app.formats.filter((f) => f === "APK" || f === "IPA");

  return (
    <article className="mx-auto max-w-5xl px-4 py-8" itemScope itemType="https://schema.org/SoftwareApplication">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
        <AppIcon name={app.name} hue={app.hue} size="h-24 w-24 text-3xl" />
        <div className="flex-1">
          <h1 className="text-3xl font-extrabold" itemProp="name">{app.name}</h1>
          <p className="text-muted-foreground">{app.developer}</p>
          <div className="mt-2 flex flex-wrap gap-2 text-xs">
            <span className="rounded-full border px-2 py-1">{app.flag} {country}</span>
            <span className="rounded-full border px-2 py-1">{app.category}</span>
            {app.formats.map((f) => <span key={f} className="rounded-full bg-muted px-2 py-1">{f}</span>)}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {app.url && (app.formats.includes("PWA") || app.formats.includes("Web App")) && <a href={app.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald px-5 py-3 font-semibold text-emerald-foreground"><Globe className="h-4 w-4" />Ouvrir / Installer la PWA</a>}
          {native.map((f) => <a key={f} href={app.downloadUrl ?? "#"} download className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald px-5 py-3 font-semibold text-emerald"><Download className="h-4 w-4" />Télécharger l'{f}</a>)}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-3 text-center">
        <Stat icon={<Star className="h-4 w-4" />} label="Note" value={app.rating ? `${app.rating}/5` : "—"} />
        <Stat icon={<HardDrive className="h-4 w-4" />} label="Taille" value={`${app.sizeMb} Mo`} />
        <Stat icon={<Wifi className="h-4 w-4" />} label="Data" value={app.dataUsage} />
      </div>

      {native.length > 0 && <p className="mt-4 flex gap-2 rounded-xl border border-amber-legal/40 bg-card p-3 text-xs text-muted-foreground"><ShieldAlert className="h-4 w-4 shrink-0 text-amber-legal" />Fichier fourni par le développeur sous sa seule responsabilité (Charte Développeurs). AfriStore agit comme hébergeur technique. Installez uniquement si vous faites confiance à l'éditeur.</p>}

      <h2 className="mt-8 text-xl font-bold">Captures d'écran</h2>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2">{app.screenshots.map((s, i) => (
        <div key={s} className="flex h-72 w-40 shrink-0 flex-col justify-end rounded-2xl border p-3 text-sm font-semibold" style={{ background: `linear-gradient(${160 + i * 30}deg, oklch(0.45 0.12 ${app.hue}), oklch(0.22 0.03 260))` }}>{s}</div>))}</div>

      <h2 className="mt-8 text-xl font-bold">À propos</h2>
      <p className="mt-2 text-muted-foreground" itemProp="description">{app.description}</p>

      <h2 className="mt-8 text-xl font-bold">Avis ({app.reviews.length})</h2>
      <form className="mt-3 grid gap-2 rounded-2xl border bg-card p-4 sm:grid-cols-[1fr_auto]" onSubmit={async (e) => { e.preventDefault(); if (!rev.author || !rev.text) return; await api.addReview(app.id, { ...rev, date: new Date().toISOString().slice(0, 10) }); setRev({ author: "", rating: 5, text: "" }); reload(); }}>
        <input required value={rev.author} onChange={(e) => setRev({ ...rev, author: e.target.value })} placeholder="Votre prénom" className="rounded-lg border bg-background px-3 py-2" />
        <select value={rev.rating} onChange={(e) => setRev({ ...rev, rating: +e.target.value })} aria-label="Note" className="rounded-lg border bg-background px-3 py-2">{[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"★".repeat(n)}</option>)}</select>
        <textarea required value={rev.text} onChange={(e) => setRev({ ...rev, text: e.target.value })} placeholder="Votre avis" className="rounded-lg border bg-background px-3 py-2 sm:col-span-2" />
        <button className="rounded-lg bg-emerald py-2 font-semibold text-emerald-foreground sm:col-span-2">Publier l'avis</button>
      </form>
      <ul className="mt-4 space-y-3">{app.reviews.map((r, i) => <li key={i} className="rounded-xl border p-4"><p className="font-semibold">{r.author} <span className="text-ochre">{"★".repeat(r.rating)}</span></p><p className="text-sm text-muted-foreground">{r.text}</p></li>)}</ul>

      <button onClick={() => setReport(true)} className="mt-10 inline-flex items-center gap-2 text-sm text-destructive underline"><Flag className="h-4 w-4" />Signaler un abus (Notice & Takedown)</button>
      {report && <ReportDialog appId={app.id} onClose={() => setReport(false)} />}
    </article>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl border bg-card p-3"><div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">{icon}{label}</div><p className="mt-1 font-display font-bold">{value}</p></div>;
}

function ReportDialog({ appId, onClose }: { appId: string; onClose: () => void }) {
  const [f, setF] = useState({ reason: "Malware / sécurité", details: "", email: "" });
  const [sent, setSent] = useState(false);
  return (
    <div role="dialog" aria-modal="true" aria-label="Signaler un abus" className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur sm:items-center" onClick={onClose}>
      <form className="w-full max-w-md space-y-3 rounded-2xl border bg-card p-6" onClick={(e) => e.stopPropagation()} onSubmit={async (e) => { e.preventDefault(); await api.report({ appId, ...f }); setSent(true); }}>
        <h2 className="text-xl font-bold">Notice & Takedown</h2>
        {sent ? <><p className="text-sm text-muted-foreground">Signalement reçu. Notre équipe l'examine promptement et retirera le contenu s'il est manifestement illicite.</p><button type="button" onClick={onClose} className="w-full rounded-lg bg-secondary py-2">Fermer</button></> : <>
          <select value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} aria-label="Motif" className="w-full rounded-lg border bg-background px-3 py-2">{["Malware / sécurité", "Violation de droits d'auteur", "Contenu illicite", "Fraude / arnaque", "Autre"].map((r) => <option key={r}>{r}</option>)}</select>
          <textarea required value={f.details} onChange={(e) => setF({ ...f, details: e.target.value })} placeholder="Décrivez précisément le problème" className="w-full rounded-lg border bg-background px-3 py-2" />
          <input required type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} placeholder="Votre e-mail de contact" className="w-full rounded-lg border bg-background px-3 py-2" />
          <div className="grid grid-cols-2 gap-2"><button type="button" onClick={onClose} className="rounded-lg bg-secondary py-2">Annuler</button><button className="rounded-lg bg-destructive py-2 font-semibold text-destructive-foreground">Envoyer</button></div>
        </>}
      </form>
    </div>
  );
}
