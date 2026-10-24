# Vérification du collage suisse — 24 octobre 2026

## Périmètre effectivement contrôlé

La nouvelle entrée active est `src/SwissCollageApp.jsx`. Les contrôles ci-dessous concernent le carnet photographique en papier découpé, après l’abandon explicite du travelling dans la cascade. Les résultats de la version précédente sont conservés dans `VERIFICATION-v4.md`.

## Navigateur

Contrôle visuel dans Chrome sur l’aperçu de développement, avec captures de 1348 × 926 pixels et des cadres dont les largeurs de contenu ont été vérifiées à **390 px** et **360 px**. Ces cadres sont des simulations de mise en page responsive, pas des essais sur des téléphones physiques.

- Hero : photo originale reconnaissable, texte lisible, géraniums, téléphérique, Saint-Bernard et motif vichy rouge correctement détourés.
- Lien « Feuilleter le carnet » : arrivée au catalogue. Les cartes restent visibles et la vache apparaît derrière leur bord en mobile.
- Carte fondue et navigation « À table » : arrivée à la tablée ; les trois visages, le caquelon, la nappe et le bouton restent visibles sur les deux petites largeurs.
- Absence de débordement horizontal : `scrollWidth === clientWidth`, 390 et 360 px.
- Mode explicite `?motion=reduce` : contenu et liens utilisables avec découpes statiques.
- Passage FR → DE dans le cadre réduit : titres, libellés et textes alternatifs traduits observés ; aucun texte de la hero coupé à 390 px.
- Ouverture du panneau « À propos du collage », présence du lien vers `/version-fondue/`, fermeture par Échap.
- Galerie originale : ouverture, passage à la photo suivante, fermeture par Échap, retour du focus au bouton « Les 4 photos originales ».
- Les cinq images de collage ont chargé dans le navigateur. Les erreurs de console relevées dans cet échantillon concernent l’extension du navigateur ; aucune erreur applicative n’a été observée.

Les mouvements sont liés au défilement avec Framer Motion. Aucune mesure de fréquence d’affichage ou performance sur téléphone physique n’est revendiquée.

## Sources et construction

- Comparaison binaire des quatre fichiers `original-1.webp` à `original-4.webp` avec le commit de départ : inchangés.
- Décodage complet des cinq WebP de collage : RGBA, données non vides, pixels de fond transparents. L’alpha de la vache atteint 254, comme dans son PNG source ; les quatre autres atteignent 255.
- Références locales des deux versions archivées contrôlées : aucun asset référencé absent.
- Correction des noms accessibles des liens Booking pour conserver le texte visible du bouton ; descriptions alternatives FR/EN/DE dans le composant.
- Construction de production réussie avec le helper Sites : React/Vite, 1982 modules, bundle JavaScript 390,13 Ko (124,64 Ko gzip) et CSS 30,21 Ko (7,53 Ko gzip).
- Avertissements connus de bundling Framer Motion sur les directives `use client` ignorées par Vite ; pas d’échec de construction.
- La page temporaire de QA et les assets cinématiques expérimentaux sont absents de `dist/`.

Le lien Booking.com a été conservé et son adresse contrôlée dans le DOM ; aucune réservation ni transaction n’a été effectuée.

## Captures du rendu

- `collage-hero-final.jpg` : hero sur ordinateur.
- `collage-fondue-final.jpg` : tablée photographique et Vichy rouge sur ordinateur.
- `collage-mobile-check.jpg` : tablée à 390 et 360 px, avec un cadre de mouvement réduit.

Les captures proviennent du navigateur et n’ont pas été retouchées.
