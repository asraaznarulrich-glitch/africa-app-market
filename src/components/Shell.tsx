import { Link } from "@tanstack/react-router";
import { LogoMark } from "./Logo";
import { InstallButton } from "./InstallButton";
import { openCookieSettings } from "./CookieBanner";

export function Header() {
  const nav = "rounded-full px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground";
  return (
    <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold"><LogoMark /><span>Afri<span className="text-ochre">Store</span></span></Link>
        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          <Link to="/" className={nav} activeOptions={{ exact: true }} activeProps={{ className: "text-foreground" }}>Catalogue</Link>
          <Link to="/developpeurs" className={nav} activeProps={{ className: "text-foreground" }}>Développeurs</Link>
          <Link to="/legal" className={nav} activeProps={{ className: "text-foreground" }}>Centre légal</Link>
        </nav>
        <div className="ml-auto md:ml-2"><InstallButton /></div>
      </div>
      <nav className="flex justify-around border-t py-2 text-sm md:hidden" aria-label="Navigation mobile">
        <Link to="/" activeOptions={{ exact: true }} activeProps={{ className: "text-ochre" }}>Catalogue</Link>
        <Link to="/developpeurs" activeProps={{ className: "text-ochre" }}>Développeurs</Link>
        <Link to="/legal" activeProps={{ className: "text-ochre" }}>Légal</Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 border-t pattern-kente">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 text-sm text-muted-foreground md:grid-cols-3">
        <div><p className="font-display font-bold text-foreground">AfriStore</p><p className="mt-2">Hébergeur technique intermédiaire : les applications sont publiées sous la seule responsabilité de leurs développeurs.</p></div>
        <div className="flex flex-col gap-1">
          <Link to="/legal" hash="cgu" className="text-slate-legal">📘 CGU</Link>
          <Link to="/legal" hash="developpeurs" className="text-amber-legal">📙 Charte Développeurs</Link>
          <Link to="/legal" hash="confidentialite" className="text-indigo-legal">🟣 Confidentialité</Link>
          <Link to="/legal" hash="cookies" className="text-emerald-legal">🟢 Cookies</Link>
        </div>
        <div className="flex flex-col items-start gap-2"><button onClick={openCookieSettings} className="underline">Paramètres des cookies</button><Link to="/legal" hash="takedown" className="underline">Signaler un contenu (Notice & Takedown)</Link><p>© 2026 AfriStore</p></div>
      </div>
    </footer>
  );
}
