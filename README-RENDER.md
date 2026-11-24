# Déployer AfriStore sur Render

Le dépôt est configuré pour déployer l'application TanStack Start comme **Web Service Node** sur Render.

## Configuration

Dans Render, utilisez le dépôt `asraaznarulrich-glitch/africa-app-market`, branche `main`, et laissez **Root Directory** vide.

- **Build Command** : `npm install && npm run build`
- **Start Command** : `node .output/server/index.mjs`
- **Health Check Path** : `/`

Le Blueprint `render.yaml` configure ces valeurs. Nitro est configuré pour générer un serveur Node (`node-server`) ; ne démarrez pas le vieux serveur Express de développement.

## Données et configuration facultative

Sans configuration supplémentaire, l'application démarre avec ses données de démonstration et la persistance du navigateur (`localStorage`). Ces données ne sont pas partagées entre appareils.

Pour connecter un backend REST, configurez `VITE_API_URL` dans les variables d'environnement du service Render et redéployez. L'API doit fournir `GET /apps`, `GET /apps/:id`, `POST /apps`, `POST /apps/:id/reviews` et `POST /reports`.

Si vous utilisez Lovable Cloud/Supabase, configurez les variables publiques `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` dans les variables d'environnement de build Render. Ne mettez jamais de clé secrète dans le code ou dans une variable `VITE_*`.
