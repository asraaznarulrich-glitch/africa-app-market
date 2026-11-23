# Déployer AfriStore sur Render

## Déploiement en 1 clic (Blueprint)
1. Poussez ce dépôt sur GitHub.
2. Sur Render : **New → Blueprint**, sélectionnez le dépôt. `render.yaml` est détecté.
3. Choisissez le service voulu :
   - `afristore` : **Node Web Service** (`node server.js`, Express). Ajoutez `express` : `npm i express`.
   - `afristore-static` : **Static Site** publié depuis `dist/client`, réécriture SPA vers `index.html`.
4. (Optionnel) Renseignez `VITE_API_URL` pour brancher votre backend.

## Couche de données
`src/services/api.ts` : sans `VITE_API_URL`, un mock complet avec persistance locale (localStorage) est utilisé.
Avec `VITE_API_URL`, les mêmes fonctions appellent votre API REST :
`GET /apps`, `GET /apps/:id`, `POST /apps`, `POST /apps/:id/reviews`, `POST /reports`.

## Remarques
- Le projet est construit avec TanStack Start. Selon la cible de build, vérifiez que `dist/client/index.html` existe pour le mode Static Site ; sinon utilisez le Web Service.
- Vérifiez le build en local (`npm run build`) avant le premier déploiement.

## Lovable Cloud
Quand les variables `VITE_SUPABASE_URL` / `VITE_SUPABASE_PUBLISHABLE_KEY` sont présentes, le catalogue, les avis et les signalements sont synchronisés dans la base Lovable Cloud, et les APK/IPA sont stockés dans le compartiment privé `app-binaries` (liens de téléchargement signés, valides 1 h). Ajoutez ces deux variables dans Render pour garder la synchronisation.
