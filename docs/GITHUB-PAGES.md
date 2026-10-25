# Publication GitHub Pages sans indexation

Le site public est compilé pour le sous-répertoire `/schuetzen-lauterbrunnen/` de l’hôte `https://tpepin74-cpu.github.io`.

```sh
npm ci
npm run build:github
```

Ce build impose `SITE_INDEXABLE=false` et `SITE_AUDIENCE=public-unlisted`. Les 64 pages de contenu et la page 404 contiennent `noindex,nofollow,noimageindex` dans le HTML envoyé au navigateur. Le sitemap et `llms.txt` sont exclus. La validation des URL, des ressources, des manifests, des huit langues et de la politique de non-indexation bloque la publication en cas d’erreur.

Le workflow `.github/workflows/pages.yml` compile le projet et publie uniquement `dist/` sur GitHub Pages après chaque modification de `main`. Les sources et documents ne sont pas copiés dans l’hébergement web.

Le build standard `npm run build` conserve la configuration du Site privé existant. Les chemins logiques `data-original-src` ne sont pas modifiés : les surprises des photos de la carte continuent à fonctionner sous le préfixe GitHub.

## Robots et limites

Les moteurs doivent pouvoir charger les pages pour lire `noindex`. Le fichier robots effectif d’un site GitHub Pages de projet est celui de la racine de l’hôte, `https://tpepin74-cpu.github.io/robots.txt`. Une autorisation limitée à `/schuetzen-lauterbrunnen/` est nécessaire si cette racine interdit actuellement toute exploration. Les règles des autres projets sont conservées.

La directive de non-indexation s’applique au site publié. Un dépôt GitHub public reste visible et recherchable sur GitHub ; le propriétaire ne peut pas ajouter une directive robots à l’interface de GitHub. `noindex` est une consigne pour les moteurs compatibles, pas une protection d’accès.

Références :
- https://developers.google.com/search/docs/crawling-indexing/block-indexing
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
