# Déployer AfriStore sur Render

Le dépôt est configuré pour créer **un seul Static Site Render**, nommé `afristore`. C'est l'option la plus simple pour publier l'interface sans serveur Node ni dépendance Express.

## Déploiement

1. Dans Render, choisissez **New → Blueprint**.
2. Connectez GitHub et sélectionnez `asraaznarulrich-glitch/africa-app-market`.
3. Vérifiez le Blueprint puis cliquez sur **Apply**. Render lit `render.yaml`, installe les dépendances et exécute `npm run build`.
4. À la fin du déploiement, ouvrez l'URL `onrender.com` fournie par Render.

Le site publie `dist/client` et réécrit les routes de l'application vers `index.html`, afin que les liens directs et le rechargement des pages fonctionnent. Node 22 est indiqué pour le build.

## Données et configuration facultative

Sans configuration supplémentaire, l'application démarre avec ses données de démonstration et la persistance du navigateur (`localStorage`). Les données locales ne sont pas partagées entre appareils et peuvent être effacées par le navigateur.

Pour connecter un backend REST, ajoutez `VITE_API_URL` dans les variables d'environnement du service Render, puis redéployez. L'API doit fournir `GET /apps`, `GET /apps/:id`, `POST /apps`, `POST /apps/:id/reviews` et `POST /reports`.

Si vous utilisez Lovable Cloud/Supabase, configurez aussi les variables publiques `VITE_SUPABASE_URL` et `VITE_SUPABASE_PUBLISHABLE_KEY` dans les variables d'environnement de build Render. Ne mettez jamais de clé secrète dans le code ou dans une variable `VITE_*`.

## Dépannage

- Si le build échoue, consultez les journaux du dernier déploiement Render et vérifiez que le build produit bien `dist/client`.
- Après une modification des variables d'environnement, lancez un nouveau déploiement pour reconstruire les fichiers du frontend.
