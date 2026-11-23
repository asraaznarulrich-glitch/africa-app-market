import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { readChoice, saveChoices, onConsentChange } from "@/lib/consent";

export function openCookieSettings() { window.dispatchEvent(new Event("afristore:cookies")); }

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const [settings, setSettings] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [gpc, setGpc] = useState(false);
  useEffect(() => {
    const g = (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
    setGpc(g);
    if (!g && readChoice("analytics") === null) setShow(true);
    const open = () => { setAnalytics(readChoice("analytics") === "granted"); setSettings(true); setShow(true); };
    window.addEventListener("afristore:cookies", open);
    const off = onConsentChange(() => setAnalytics(readChoice("analytics") === "granted"));
    return () => { window.removeEventListener("afristore:cookies", open); off(); };
  }, []);
  if (!show) return null;
  const done = (c: "granted" | "denied") => { saveChoices({ analytics: c }); setShow(false); setSettings(false); };
  return (
    <div role="region" aria-label="Consentement cookies" className="fixed inset-x-3 bottom-3 z-40 mx-auto max-w-2xl rounded-2xl border-2 border-emerald-legal/50 bg-card p-5 shadow-2xl">
      <h2 className="text-base font-bold">🟢 Vos choix de confidentialité</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Rien n'est activé par défaut. Nous comptons les visites sans cookies. Si vous acceptez, nous mesurons aussi les clics et autres actions.{" "}
        <Link to="/legal" hash="cookies" className="underline text-emerald-legal">Politique de cookies</Link>
      </p>
      {settings && (
        <div className="mt-4 space-y-2 text-sm">
          {gpc && <p className="text-amber-legal">Le signal de confidentialité de votre navigateur (GPC) s'applique : la mesure reste désactivée.</p>}
          <div className="flex items-center justify-between rounded-lg bg-muted p-3"><span>Nécessaires (toujours actifs)</span></div>
          <label className="flex items-center justify-between rounded-lg bg-muted p-3">
            <span>Mesure d'audience, fournie par Lovable</span>
            <input type="checkbox" disabled={gpc} checked={analytics && !gpc} onChange={(e) => setAnalytics(e.target.checked)} className="h-5 w-5 accent-emerald" />
          </label>
          <button onClick={() => done(analytics && !gpc ? "granted" : "denied")} className="w-full rounded-lg bg-emerald py-2 font-semibold text-emerald-foreground">Enregistrer</button>
        </div>
      )}
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button autoFocus onClick={() => done("denied")} className="rounded-lg border bg-secondary py-2 text-sm font-semibold">Tout refuser</button>
        <button onClick={() => done("granted")} className="rounded-lg border bg-secondary py-2 text-sm font-semibold">Tout accepter</button>
      </div>
      {!settings && <button onClick={() => setSettings(true)} className="mt-2 w-full text-sm underline text-muted-foreground">Paramètres des cookies</button>}
    </div>
  );
}
