CREATE TABLE public.apps (
  id text PRIMARY KEY,
  name text NOT NULL, tagline text NOT NULL DEFAULT '', description text NOT NULL DEFAULT '',
  developer text NOT NULL, category text NOT NULL, formats text[] NOT NULL DEFAULT '{}',
  country text NOT NULL, flag text NOT NULL DEFAULT '🌍', size_mb numeric NOT NULL DEFAULT 0,
  data_usage text NOT NULL DEFAULT 'Faible', rating numeric NOT NULL DEFAULT 0, featured boolean NOT NULL DEFAULT false,
  url text, download_url text, hue int NOT NULL DEFAULT 35,
  screenshots text[] NOT NULL DEFAULT ARRAY['Accueil','Tableau de bord','Paramètres'],
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.apps TO anon, authenticated;
GRANT ALL ON public.apps TO service_role;
ALTER TABLE public.apps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "apps public read" ON public.apps FOR SELECT USING (true);
CREATE POLICY "apps public submit" ON public.apps FOR INSERT WITH CHECK (featured = false AND rating = 0 AND length(name) BETWEEN 1 AND 80);

CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id text NOT NULL REFERENCES public.apps(id) ON DELETE CASCADE,
  author text NOT NULL, rating int NOT NULL CHECK (rating BETWEEN 1 AND 5), text text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.reviews TO anon, authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reviews public read" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "reviews public write" ON public.reviews FOR INSERT WITH CHECK (length(text) BETWEEN 1 AND 2000 AND length(author) BETWEEN 1 AND 60);

CREATE OR REPLACE FUNCTION public.refresh_app_rating() RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.apps SET rating = (SELECT round(avg(rating)::numeric, 1) FROM public.reviews WHERE app_id = NEW.app_id) WHERE id = NEW.app_id;
  RETURN NEW;
END $$;
CREATE TRIGGER reviews_rating AFTER INSERT ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.refresh_app_rating();

CREATE TABLE public.reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  app_id text NOT NULL, reason text NOT NULL, details text NOT NULL, email text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.reports TO anon, authenticated;
GRANT ALL ON public.reports TO service_role;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "reports public submit" ON public.reports FOR INSERT WITH CHECK (length(details) BETWEEN 1 AND 5000);

INSERT INTO public.apps (id,name,tagline,description,developer,category,formats,country,flag,size_mb,data_usage,rating,featured,url,download_url,hue) VALUES
('tontine-plus','Tontine+','Votre tontine digitale, simple et sûre','Gérez vos tontines familiales et associatives, cotisations Mobile Money et rappels automatiques.','Dakar Labs','Fintech','{PWA,APK}','SN','🇸🇳',4.2,'Faible',4.7,true,'https://example.com',null,35),
('ecole-mobile','École Mobile','Cours hors-ligne du primaire au lycée','Programmes officiels, quiz et vidéos compressées pour apprendre même sans connexion.','Abidjan EdTech','Éducation','{PWA,"Web App"}','CI','🇨🇮',12,'Faible',4.8,true,'https://example.com',null,150),
('afyaconnect','AfyaConnect','Téléconsultation en swahili et anglais','Consultez un médecin certifié par chat ou appel audio basse consommation.','Nairobi Health','Santé','{APK,IPA}','KE','🇰🇪',28,'Moyenne',4.5,true,null,null,0),
('naija-pay','NaijaPay','Transferts instantanés entre banques','Paiements QR, factures et transferts interbancaires en quelques secondes.','Lagos Fintech Co.','Fintech','{APK,IPA,PWA}','NG','🇳🇬',18,'Faible',4.4,false,'https://example.com',null,140),
('agrimeteo','AgriMétéo','Météo et prix des récoltes par SMS','Prévisions locales et prix du marché pour les agriculteurs, fonctionne en 2G.','Yaoundé Agri','Agritech','{"Web App",APK}','CM','🇨🇲',2.1,'Faible',4.6,false,'https://example.com',null,90),
('radio-sahel','Radio Sahel','100 radios africaines en streaming','Écoutez les radios du continent avec un mode économie de données.','Sahel Media','Médias','{PWA}','MA','🇲🇦',1.5,'Moyenne',4.3,false,'https://example.com',null,280),
('kigali-move','Kigali Move','Moto-taxis et bus en temps réel','Réservez une moto-taxi ou suivez les bus de la ville.','Rwanda Mobility','Mobilité','{APK,IPA}','RW','🇷🇼',22,'Moyenne',4.2,false,null,null,200),
('outils-malins','Outils Malins','Convertisseur FCFA, calculatrice, notes','La boîte à outils du quotidien, ultra-légère.','Cotonou Dev','Utilitaires','{PWA,"Web App"}','BJ','🇧🇯',0.8,'Faible',4.5,false,'https://example.com',null,50);