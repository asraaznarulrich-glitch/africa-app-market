# Africa App Market

Créer AfriStore, une plateforme et store d'applications alternatif à l'africaine (PWA, Web Apps, APK Android, IPA iOS), optimisé pour un hébergement autonome complet sur Render.

Architecture & Compatibilité Render :
- Fichier de configuration Render Blueprint (`render.yaml`) et guide de déploiement `README-RENDER.md` détaillant le déploiement en 1 clic sur Render (en tant que Static Site ou Web Service).
- Couche de données et API modulaire et découplée dans `src/services/api.ts` (utilisant `VITE_API_URL` avec mock de démonstration complet et persistance locale intégrée, prête à être branchée sur un backend Render personnalisé sans modifier l'UI).
- Script serveur de production Node.js/Express optionnel (`server.js`) pour ceux qui souhaitent déployer comme Node Web Service sur Render en plus du mode Static Site.

Emballage PWA installable :
- Manifeste PWA complet (`public/manifest.webmanifest`), meta-tags Apple/Android, et service worker pour mode hors-ligne.
- Bouton bien visible « Installer AfriStore » dans la barre de navigation avec déclencheur natif `beforeinstallprompt` et modale guidée pas-à-pas pour iOS/Safari et Android.

Catalogue & Fiches d'applications :
- Page d'accueil avec recherche instantanée, mise en avant des pépites tech africaines, catégories (Fintech, Éducation, Santé, Utilitaires, Médias...) et filtres par format (PWA, Web App, APK, IPA) et pays d'Afrique.
- Fiches d'applications détaillées : screenshots, avis, badge pays, indicateur de consommation data / taille de fichier, bouton d'installation PWA ou téléchargement direct de l'APK/IPA.
- Bouton de signalement d'abus (Notice & Takedown) sur chaque fiche d'application.

Espace Développeurs :
- Portail de soumission d'applications (PWA, APK, IPA) avec upload ou lien, saisie des métadonnées, et engagement juridique obligatoire du développeur garantissant la conformité légale et l'absence de malwares.

Bouclier juridique anti-poursuites :
- Centre légal avec 4 contrats distincts dotés d'un code couleur dédié pour une visibilité immédiate :
  * 📘 Conditions Générales d'Utilisation (CGU - Bleu ardoise)
  * 📙 Charte Développeurs & Décharge de responsabilité APK/IPA (Ambre)
  * 🟣 Politique de Confidentialité (Indigo) avec minimisation stricte des données
  * 🟢 Politique de Cookies & Traceurs (Émeraude)
- Statut d'hébergeur technique intermédiaire (protection légale hébergeur / safe harbor).
- Bandeau de consentement cookies granulaire bloquant par défaut.
- Double UX : interface soignée pour humains et balisage sémantique pour agents IA (Schema.org / JSON-LD, métadonnées structurées et robots.txt).

Identité visuelle & Design :
- Thème sombre moderne (fond ardoise/obsidienne), accents ambre/ocre et terre cuite, boutons d'action vert émeraude.
- Favicon et logo : symbole du « Play » facetté néo-africain.
- Typographie géométrique moderne et design ultra fluide sur mobile.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6e7060f1-9981-4a0a-bef0-4772ad3847e2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
