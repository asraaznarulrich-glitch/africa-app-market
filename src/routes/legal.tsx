import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/legal")({
  head: () => ({
    meta: [
      { title: "Centre légal — CGU, Charte, Confidentialité, Cookies | AfriStore" },
      { name: "description", content: "Conditions, charte développeurs, confidentialité et cookies d'AfriStore, hébergeur technique intermédiaire." },
      { property: "og:title", content: "Centre légal AfriStore" },
      { property: "og:description", content: "Les 4 contrats qui encadrent AfriStore." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Legal,
});

const DOCS = [
  { id: "cgu", icon: "📘", title: "Conditions Générales d'Utilisation", tone: "border-slate-legal text-slate-legal", body: [
    ["Objet", "AfriStore est un annuaire et un service d'hébergement technique permettant à des développeurs tiers de publier des applications (PWA, Web Apps, APK, IPA)."],
    ["Statut d'hébergeur", "AfriStore agit en qualité d'hébergeur technique intermédiaire. Il n'exerce aucun contrôle éditorial préalable et n'est pas l'auteur des applications. Sa responsabilité ne peut être engagée que s'il n'a pas agi promptement après notification d'un contenu manifestement illicite."],
    ["Usage", "L'utilisateur installe les applications à ses propres risques et s'engage à respecter les lois de son pays."],
    ["Limitation de responsabilité", "Le service est fourni « en l'état ». AfriStore ne garantit ni la disponibilité, ni la sécurité, ni l'adéquation des applications tierces."],
    ["Notice & Takedown", "Tout contenu peut être signalé via le bouton présent sur chaque fiche. Les signalements sont examinés et le contenu manifestement illicite est retiré."],
  ] },
  { id: "developpeurs", icon: "📙", title: "Charte Développeurs & Décharge APK/IPA", tone: "border-amber-legal text-amber-legal", body: [
    ["Responsabilité", "Le développeur est seul responsable de son application, de son contenu, de sa conformité légale et des données qu'elle traite."],
    ["Garantie anti-malware", "Le développeur garantit l'absence de tout code malveillant, spyware, mineur de cryptomonnaie ou collecte cachée."],
    ["Fichiers APK/IPA", "Les fichiers binaires sont distribués tels que fournis. AfriStore décline toute responsabilité quant à leur fonctionnement ou leurs effets."],
    ["Indemnisation", "Le développeur garantit et indemnise AfriStore contre toute réclamation liée à son application."],
    ["Retrait", "AfriStore peut retirer sans préavis toute application signalée ou suspecte."],
  ] },
  { id: "confidentialite", icon: "🟣", title: "Politique de Confidentialité", tone: "border-indigo-legal text-indigo-legal", body: [
    ["Minimisation", "Aucun compte n'est requis pour parcourir le catalogue. Nous ne collectons que le strict nécessaire."],
    ["Données stockées sur votre appareil", "En mode démonstration, vos avis, soumissions et signalements sont enregistrés uniquement dans le stockage local de votre navigateur. Votre choix de cookies y est conservé jusqu'à 12 mois."],
    ["Signalements", "L'e-mail saisi lors d'un signalement sert uniquement à traiter la demande."],
    ["Mesure d'audience", "Lovable collecte pour nous des statistiques de visite sans cookies, sans rien stocker sur votre appareil, sans conserver les adresses IP et sans vous identifier : pages vues, provenance, pays, navigateur, système, type d'appareil, durée, vitesse de chargement et erreurs. Les clics ne sont mesurés qu'après votre accord. Données détaillées conservées 90 jours, résumés quotidiens un an. La politique de confidentialité de Lovable (https://lovable.dev/privacy) explique comment elle les traite."],
    ["Services tiers", "Les polices de caractères sont chargées depuis Google Fonts, qui reçoit votre adresse IP lors du chargement."],
    ["Vos droits", "Vous pouvez effacer vos données locales à tout moment en vidant le stockage de votre navigateur."],
  ] },
  { id: "cookies", icon: "🟢", title: "Politique de Cookies & Traceurs", tone: "border-emerald-legal text-emerald-legal", body: [
    ["Par défaut", "Aucune mesure optionnelle n'est activée avant votre choix. Le bandeau propose « Tout refuser » et « Tout accepter » avec le même poids."],
    ["Nécessaires", "Stockage local pour mémoriser votre choix et le fonctionnement du catalogue de démonstration."],
    ["Mesure d'audience", "Les visites sont comptées sans cookies pour tous. Les clics et actions ne sont mesurés qu'après acceptation, jamais si votre navigateur envoie le signal Global Privacy Control."],
    ["Modifier vos choix", "Utilisez « Paramètres des cookies » en bas de chaque page."],
  ] },
];

function Legal() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold md:text-4xl">Centre <span className="text-ochre">légal</span></h1>
      <p className="mt-2 text-muted-foreground">Quatre contrats, un code couleur. AfriStore est un hébergeur technique intermédiaire.</p>
      <div className="mt-6 grid gap-2 sm:grid-cols-4">{DOCS.map((d) => <a key={d.id} href={`#${d.id}`} className={`rounded-xl border-2 bg-card p-3 text-sm font-semibold ${d.tone}`}>{d.icon} {d.title}</a>)}</div>
      {DOCS.map((d) => (
        <section key={d.id} id={d.id} className={`mt-10 scroll-mt-24 rounded-2xl border-l-4 bg-card p-6 ${d.tone.split(" ")[0]}`}>
          <h2 className={`text-2xl font-bold ${d.tone.split(" ")[1]}`}>{d.icon} {d.title}</h2>
          <dl className="mt-4 space-y-4">{d.body.map(([t, b]) => <div key={t}><dt className="font-semibold">{t}</dt><dd className="mt-1 text-sm text-muted-foreground">{b}</dd></div>)}</dl>
        </section>
      ))}
      <section id="takedown" className="mt-10 scroll-mt-24 rounded-2xl border bg-card p-6"><h2 className="text-xl font-bold">Notice & Takedown</h2><p className="mt-2 text-sm text-muted-foreground">Pour signaler un contenu, utilisez le bouton « Signaler un abus » sur la fiche concernée. Ces textes sont un modèle : faites-les valider par un juriste selon les pays visés.</p></section>
    </div>
  );
}
