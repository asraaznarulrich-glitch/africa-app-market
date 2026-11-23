// Couche de données découplée. Priorité : VITE_API_URL > Lovable Cloud > mock local.
import { supabase } from "@/integrations/supabase/client";
export type Format = "PWA" | "Web App" | "APK" | "IPA";
export type Review = { author: string; rating: number; text: string; date: string };
export type AppItem = {
  id: string; name: string; tagline: string; description: string; developer: string;
  category: string; formats: Format[]; country: string; flag: string; sizeMb: number;
  dataUsage: "Faible" | "Moyenne" | "Élevée"; rating: number; featured?: boolean;
  url?: string; downloadUrl?: string; hue: number; screenshots: string[]; reviews: Review[];
};
export type Report = { appId: string; reason: string; details: string; email: string };

export const CATEGORIES = ["Fintech", "Éducation", "Santé", "Utilitaires", "Médias", "Agritech", "Mobilité"];
export const FORMATS: Format[] = ["PWA", "Web App", "APK", "IPA"];
export const COUNTRIES = [
  ["SN", "🇸🇳", "Sénégal"], ["CI", "🇨🇮", "Côte d'Ivoire"], ["NG", "🇳🇬", "Nigeria"], ["KE", "🇰🇪", "Kenya"],
  ["GH", "🇬🇭", "Ghana"], ["CM", "🇨🇲", "Cameroun"], ["MA", "🇲🇦", "Maroc"], ["RW", "🇷🇼", "Rwanda"],
  ["ZA", "🇿🇦", "Afrique du Sud"], ["BJ", "🇧🇯", "Bénin"],
] as const;

const shots = ["Accueil", "Tableau de bord", "Paramètres"];
const r = (a: string, n: number, t: string): Review => ({ author: a, rating: n, text: t, date: "2026-10-12" });
const SEED: AppItem[] = [
  { id: "tontine-plus", name: "Tontine+", tagline: "Votre tontine digitale, simple et sûre", description: "Gérez vos tontines familiales et associatives, cotisations Mobile Money et rappels automatiques.", developer: "Dakar Labs", category: "Fintech", formats: ["PWA", "APK"], country: "SN", flag: "🇸🇳", sizeMb: 4.2, dataUsage: "Faible", rating: 4.7, featured: true, url: "https://example.com", downloadUrl: "#", hue: 35, screenshots: shots, reviews: [r("Awa D.", 5, "Enfin ma tontine sans cahier !"), r("Moussa K.", 4, "Très léger, marche bien en 3G.")] },
  { id: "ecole-mobile", name: "École Mobile", tagline: "Cours hors-ligne du primaire au lycée", description: "Programmes officiels, quiz et vidéos compressées pour apprendre même sans connexion.", developer: "Abidjan EdTech", category: "Éducation", formats: ["PWA", "Web App"], country: "CI", flag: "🇨🇮", sizeMb: 12, dataUsage: "Faible", rating: 4.8, featured: true, url: "https://example.com", hue: 150, screenshots: shots, reviews: [r("Koffi A.", 5, "Mes enfants adorent.")] },
  { id: "afyaconnect", name: "AfyaConnect", tagline: "Téléconsultation en swahili et anglais", description: "Consultez un médecin certifié par chat ou appel audio basse consommation.", developer: "Nairobi Health", category: "Santé", formats: ["APK", "IPA"], country: "KE", flag: "🇰🇪", sizeMb: 28, dataUsage: "Moyenne", rating: 4.5, featured: true, downloadUrl: "#", hue: 0, screenshots: shots, reviews: [r("Wanjiru M.", 4, "Rapide et pro.")] },
  { id: "naija-pay", name: "NaijaPay", tagline: "Transferts instantanés entre banques", description: "Paiements QR, factures et transferts interbancaires en quelques secondes.", developer: "Lagos Fintech Co.", category: "Fintech", formats: ["APK", "IPA", "PWA"], country: "NG", flag: "🇳🇬", sizeMb: 18, dataUsage: "Faible", rating: 4.4, downloadUrl: "#", url: "https://example.com", hue: 140, screenshots: shots, reviews: [] },
  { id: "agrimeteo", name: "AgriMétéo", tagline: "Météo et prix des récoltes par SMS", description: "Prévisions locales et prix du marché pour les agriculteurs, fonctionne en 2G.", developer: "Yaoundé Agri", category: "Agritech", formats: ["Web App", "APK"], country: "CM", flag: "🇨🇲", sizeMb: 2.1, dataUsage: "Faible", rating: 4.6, url: "https://example.com", downloadUrl: "#", hue: 90, screenshots: shots, reviews: [] },
  { id: "radio-sahel", name: "Radio Sahel", tagline: "100 radios africaines en streaming", description: "Écoutez les radios du continent avec un mode économie de données.", developer: "Sahel Media", category: "Médias", formats: ["PWA"], country: "MA", flag: "🇲🇦", sizeMb: 1.5, dataUsage: "Moyenne", rating: 4.3, url: "https://example.com", hue: 280, screenshots: shots, reviews: [] },
  { id: "kigali-move", name: "Kigali Move", tagline: "Moto-taxis et bus en temps réel", description: "Réservez une moto-taxi ou suivez les bus de la ville.", developer: "Rwanda Mobility", category: "Mobilité", formats: ["APK", "IPA"], country: "RW", flag: "🇷🇼", sizeMb: 22, dataUsage: "Moyenne", rating: 4.2, downloadUrl: "#", hue: 200, screenshots: shots, reviews: [] },
  { id: "mbote-tools", name: "Outils Malins", tagline: "Convertisseur FCFA, calculatrice, notes", description: "La boîte à outils du quotidien, ultra-légère.", developer: "Cotonou Dev", category: "Utilitaires", formats: ["PWA", "Web App"], country: "BJ", flag: "🇧🇯", sizeMb: 0.8, dataUsage: "Faible", rating: 4.5, url: "https://example.com", hue: 50, screenshots: shots, reviews: [] },
];

const BASE = import.meta.env["VITE_API_URL"] as string | undefined;
const CLOUD = !BASE && !!import.meta.env["VITE_SUPABASE_URL"];
const BUCKET = "app-binaries";
type Row = { id: string; name: string; tagline: string; description: string; developer: string; category: string; formats: string[]; country: string; flag: string; size_mb: number; data_usage: string; rating: number; featured: boolean; url: string | null; download_url: string | null; hue: number; screenshots: string[] };
type RevRow = { author: string; rating: number; text: string; created_at: string };
async function resolveDownload(path: string | null): Promise<string | undefined> {
  if (!path) return undefined;
  if (!path.startsWith("storage:")) return path;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path.slice(8), 3600, { download: true });
  return data?.signedUrl;
}
function fromRow(r: Row, reviews: RevRow[] = []): AppItem {
  return { id: r.id, name: r.name, tagline: r.tagline, description: r.description, developer: r.developer, category: r.category, formats: r.formats as Format[], country: r.country, flag: r.flag, sizeMb: Number(r.size_mb), dataUsage: r.data_usage as AppItem["dataUsage"], rating: Number(r.rating), featured: r.featured, ...(r.url ? { url: r.url } : {}), hue: r.hue, screenshots: r.screenshots, reviews: reviews.map((x) => ({ author: x.author, rating: x.rating, text: x.text, date: x.created_at.slice(0, 10) })) };
}
const slug = (n: string) => n.toLowerCase().normalize("NFD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "-" + Date.now().toString(36);

const KEY = "afristore_apps_v1";
const RKEY = "afristore_reports_v1";
const canStore = () => typeof window !== "undefined" && !!window.localStorage;

function load(): AppItem[] {
  if (!canStore()) return SEED;
  try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) as AppItem[]; } catch { /* ignore */ }
  return SEED;
}
function save(list: AppItem[]) { if (canStore()) localStorage.setItem(KEY, JSON.stringify(list)); }
async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { headers: { "Content-Type": "application/json" }, ...init });
  if (!res.ok) throw new Error(`API ${res.status}`);
  return (await res.json()) as T;
}

export const api = {
  /** Héberge un APK/IPA. Retourne la valeur à mettre dans downloadUrl. */
  async uploadBinary(file: File): Promise<string> {
    if (!CLOUD) return URL.createObjectURL(file);
    const ext = file.name.toLowerCase().endsWith(".ipa") ? "ipa" : "apk";
    const path = `${Date.now().toString(36)}-${crypto.randomUUID()}.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, { contentType: "application/octet-stream" });
    if (error) throw new Error(error.message);
    return `storage:${path}`;
  },
  async listApps(): Promise<AppItem[]> {
    if (BASE) return http("/apps");
    if (CLOUD) {
      const { data, error } = await supabase.from("apps").select("*").order("featured", { ascending: false }).order("created_at", { ascending: false });
      if (!error && data) return (data as Row[]).map((r) => fromRow(r));
    }
    return load();
  },
  async getApp(id: string): Promise<AppItem | null> {
    if (BASE) return http(`/apps/${id}`);
    if (CLOUD) {
      const { data } = await supabase.from("apps").select("*").eq("id", id).maybeSingle();
      if (!data) return null;
      const { data: revs } = await supabase.from("reviews").select("author,rating,text,created_at").eq("app_id", id).order("created_at", { ascending: false });
      const app = fromRow(data as Row, (revs ?? []) as RevRow[]);
      const dl = await resolveDownload((data as Row).download_url);
      return dl ? { ...app, downloadUrl: dl } : app;
    }
    return load().find((a) => a.id === id) ?? null;
  },
  async submitApp(input: Omit<AppItem, "id" | "rating" | "reviews" | "screenshots" | "hue">): Promise<AppItem> {
    if (BASE) return http("/apps", { method: "POST", body: JSON.stringify(input) });
    const id = slug(input.name);
    if (CLOUD) {
      const row = { id, name: input.name, tagline: input.tagline, description: input.description, developer: input.developer, category: input.category, formats: input.formats, country: input.country, flag: input.flag, size_mb: input.sizeMb, data_usage: input.dataUsage, url: input.url || null, download_url: input.downloadUrl ?? null, hue: Math.floor(Math.random() * 360) };
      const { error } = await supabase.from("apps").insert(row);
      if (error) throw new Error(error.message);
      return { ...input, id, rating: 0, reviews: [], screenshots: shots, hue: row.hue };
    }
    const app: AppItem = { ...input, id, rating: 0, reviews: [], screenshots: shots, hue: Math.floor(Math.random() * 360) };
    save([app, ...load()]);
    return app;
  },
  async addReview(id: string, review: Review): Promise<void> {
    if (BASE) { await http(`/apps/${id}/reviews`, { method: "POST", body: JSON.stringify(review) }); return; }
    if (CLOUD) { const { error } = await supabase.from("reviews").insert({ app_id: id, author: review.author, rating: review.rating, text: review.text }); if (error) throw new Error(error.message); return; }
    const list = load().map((a) => {
      if (a.id !== id) return a;
      const reviews = [review, ...a.reviews];
      return { ...a, reviews, rating: Math.round((reviews.reduce((s, x) => s + x.rating, 0) / reviews.length) * 10) / 10 };
    });
    save(list);
  },
  async report(rep: Report): Promise<void> {
    if (BASE) { await http("/reports", { method: "POST", body: JSON.stringify(rep) }); return; }
    if (CLOUD) { const { error } = await supabase.from("reports").insert({ app_id: rep.appId, reason: rep.reason, details: rep.details, email: rep.email }); if (error) throw new Error(error.message); return; }
    if (!canStore()) return;
    const all = JSON.parse(localStorage.getItem(RKEY) || "[]") as Report[];
    localStorage.setItem(RKEY, JSON.stringify([...all, { ...rep, at: new Date().toISOString() }]));
  },
};
