import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

type BIP = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

export function InstallButton() {
  const [evt, setEvt] = useState<BIP | null>(null);
  const [open, setOpen] = useState(false);
  const [installed, setInstalled] = useState(false);
  useEffect(() => {
    const h = (e: Event) => { e.preventDefault(); setEvt(e as BIP); };
    window.addEventListener("beforeinstallprompt", h);
    window.addEventListener("appinstalled", () => setInstalled(true));
    if (window.matchMedia("(display-mode: standalone)").matches) setInstalled(true);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);
  if (installed) return null;
  const click = async () => {
    if (evt) { await evt.prompt(); await evt.userChoice; setEvt(null); } else setOpen(true);
  };
  return (
    <>
      <button onClick={click} className="inline-flex items-center gap-2 rounded-full bg-emerald px-4 py-2 text-sm font-semibold text-emerald-foreground shadow-lg transition hover:brightness-110">
        <Download className="h-4 w-4" /> <span className="hidden sm:inline">Installer AfriStore</span><span className="sm:hidden">Installer</span>
      </button>
      {open && (
        <div role="dialog" aria-modal="true" aria-label="Installer AfriStore" className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 p-4 backdrop-blur sm:items-center" onClick={() => setOpen(false)}>
          <div className="w-full max-w-md rounded-2xl border bg-card p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between"><h2 className="text-xl font-bold">Installer AfriStore</h2><button aria-label="Fermer" onClick={() => setOpen(false)}><X className="h-5 w-5" /></button></div>
            <div className="mt-4 space-y-4 text-sm">
              <section><h3 className="font-semibold text-ochre">iPhone / iPad (Safari)</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground"><li>Ouvrez AfriStore dans Safari.</li><li>Touchez le bouton Partager (carré avec flèche).</li><li>Choisissez « Sur l'écran d'accueil ».</li><li>Touchez « Ajouter ».</li></ol></section>
              <section><h3 className="font-semibold text-ochre">Android (Chrome)</h3>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-muted-foreground"><li>Ouvrez le menu ⋮ en haut à droite.</li><li>Touchez « Installer l'application » ou « Ajouter à l'écran d'accueil ».</li><li>Confirmez.</li></ol></section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
