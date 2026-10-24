# Carnet suisse — catalogue photographique en papier découpé

## Direction et rendu actif

`index.html` charge **`src/SwissCollageApp.jsx`**, qui importe `src/swiss-collage.css` et la galerie existante. La page présente un catalogue de découverte du Schützen à Lauterbrunnen, avec des photographies du lieu et des découpes photoréalistes. Le papier crème, le vichy rouge et blanc, les croix suisses, les petites étoiles et les accents de fête composent la direction graphique.

Le défilement est celui d’une page ordinaire, sans section de voyage épinglée ni interception de la molette. Framer Motion fait bouger certains éléments du collage pendant le passage dans les sections. **Aucun film n’est utilisé par le site.** Il n’y a plus de parcours cascade → escalier → fondue, de découpage du paysage ou de gestes de dégustation à piloter.

Ce document décrit l’implémentation observée dans les sources. Il ne constitue pas une validation sur appareil ou navigateur ; les résultats de vérification sont consignés séparément dans `VERIFICATION.md`.

## Structure et actions

| Zone | Contenu | Action principale |
| --- | --- | --- |
| En-tête | Marque Schützen, navigation, langue FR/EN/DE, réservation. | Ancres du catalogue et de la tablée, galerie, Booking. |
| Hero `#accueil` | Titre « La Suisse, à savourer. », carte postale avec `original-1.webp`, géranium, téléphérique et Saint-Bernard. | « Feuilleter le carnet » mène à `#decouvrir`. La photo et « Le lieu en photos » ouvrent la galerie sur `original-1.webp`. |
| Ruban | Trois messages courts séparés par des croix suisses. | Décoratif, masqué aux technologies d’assistance. |
| Catalogue `#decouvrir` | Trois cartes photographiques, accompagnées de la vache Simmental. | Carte chalet : galerie sur `original-2.webp`. Carte fondue : `#a-table`. Carte Alpes : galerie sur `original-4.webp`. |
| Tablée `#a-table` | Découpe de trois convives autour d’une fondue, vichy rouge, note de papier et texte. | Préparer un séjour sur Booking. |
| Pied de page | Invitation à revenir, réservation, quatre originaux, provenance du collage. | Galerie, panneau d’information et retour en haut. |

Le lien Booking commun est `https://www.booking.com/hotel/ch/restaurant-schutzen-ag.html`. `BookLink` utilise `target="_blank"` et `rel="noopener noreferrer"`. Son libellé accessible reprend le texte visible du bouton puis ajoute le contexte traduit « Booking.com, nouvel onglet ». La page n’exécute aucune transaction.

## Images et provenance

### Photographies conservées

Les fichiers `public/assets/original-1.webp` à `original-4.webp` sont les quatre photographies originales. Ils restent disponibles dans la galerie, dont l’ordre est **2, 3, 1, 4** : chalet au crépuscule, cascade et chalet, vue au pied de la falaise, terrasse sur la vallée. Les cadrages CSS de la page ne modifient pas les fichiers.

La hero utilise `original-1.webp`. Les trois cartes utilisent respectivement `original-2.webp`, `journey/fondue.webp` et `original-4.webp`. La photo de fondue est une composition générée reprise de la version précédente, documentée dans `fondue-assets.md` ; elle ne doit pas être présentée comme une photographie documentaire du service actuel.

### Découpes du collage

Les cinq WebP de `public/assets/collage/` possèdent un canal alpha et un fin bord blanc intégré. Le CSS ajoute une ombre portée ; le vichy, les rubans et les petits éléments graphiques sont construits en CSS ou SVG.

| Fichier | Sujet et emplacement | Dimensions |
| --- | --- | --- |
| `geranium.webp` | Géranium rouge en pot, en haut de la carte postale. | 1254 × 1254 |
| `cable-car.webp` | Cabine rouge suspendue, au-dessus de la photo. | 1254 × 1254 |
| `bernard.webp` | Saint-Bernard au petit foulard vichy, devant la carte postale. | 1254 × 1254 |
| `cow.webp` | Simmental avec cloche de laiton et petit ruban rouge, près du catalogue. | 1536 × 1024 |
| `fondue-friends.webp` | Trois adultes fictifs autour d’un caquelon rouge et d’une nappe vichy. | 1448 × 1086 |

Ce sont des créations ImageGen à caractère photographique. Elles ne représentent pas des animaux, convives, objets ou prestations attestés dans l’établissement. Le panneau « À propos du collage » donne cette explication dans les trois langues. Les prompts, références éventuelles, conversions et contrôles des assets figurent dans `collage-animal-assets.md`, `collage-decoration-assets.md` et `collage-table-asset.md`.

La photo principale bénéficie de `fetchPriority="high"`. Les trois découpes de hero sont chargées immédiatement ; les cartes, la vache et la tablée utilisent le chargement différé. Les découpes sont décoratives (`alt=""`, `aria-hidden`, sans capture des clics).

## Mouvements décoratifs

Les progressions sont **locales à chaque section**, et ne représentent pas une chronologie globale. `useScroll` fournit la valeur, `useSpring` la lisse et `useTransform` pilote les déplacements. Aucun fichier vidéo, moteur de morphing ou sprite de main n’est importé par l’entrée active.

| Section | Progression locale et ressort | Mouvements |
| --- | --- | --- |
| Hero | `['start start', 'end start']` ; rigidité 110, amortissement 26, masse 0,35. | Carte postale : rotation 3° → −3°, déplacement vertical 0 → −45 px. Géranium : jusqu’à −85 px. Chien : petite montée et rotation de −8° → 3°. Cabine : −105 px à l’horizontale, +42 px à la verticale, léger balancement. |
| Catalogue | `['start end', 'center start']` ; rigidité 115, amortissement 25. | Vache : déplacement vertical 90 → 0 → −24 px et rotation 16° → −5° → −8°. |
| Tablée | `['start end', 'end start']` ; rigidité 95, amortissement 24. | Groupe : déplacement vertical 65 → 0 → −25 px et rotation −5° → 2°. |

Les cartes apparaissent une fois lorsqu’environ 15 % de leur surface entre dans le viewport : opacité, translation de 45 px et légère rotation, avec 60 ms de décalage entre cartes. Le survol les relève et le clic applique un bref retour visuel. Les transformations ne changent pas les liens ni les photographies affichées.

## Mobile, langues et accessibilité

Les principaux seuils CSS sont 1100, 800, 560 et 370 px, avec un ajustement pour les écrans d’au moins 1600 px. Sous 800 px, la hero et la tablée passent sur une colonne, la navigation centrale est masquée, et la langue ainsi que la réservation restent dans l’en-tête. Sous 560 px, les trois cartes sont empilées. Les tailles et positions des découpes sont adaptées aux petits écrans ; elles ne nécessitent pas de médias portrait distincts.

`COPY` contient les textes d’interface FR/EN/DE, ainsi que les textes alternatifs de la photo principale et des trois cartes. Le changement de langue met à jour `document.documentElement.lang`, ces descriptions et les textes de la galerie, qui possède également ses traductions. Le choix est un état React, sans persistance au rechargement.

Le mode réduit est activé par `useReducedMotion()` ou par `?motion=reduce`. Les valeurs de mouvement des découpes et de la carte postale deviennent des positions fixes, et l’entrée animée des cartes est désactivée. `MotionConfig` reçoit `reducedMotion="always"`. L’attribut `data-reduced` supprime le scroll fluide et certaines transitions CSS ; la règle système `prefers-reduced-motion` réduit également les animations et transitions CSS. Le contenu et les actions restent identiques. Ce mode ne remplace pas la page par une autre expérience.

Un lien d’évitement mène au catalogue et les contrôles ont des styles `:focus-visible`. La galerie gère Échap, les flèches gauche/droite, le confinement du focus, le blocage du scroll d’arrière-plan et le retour au contrôle d’origine. Le panneau d’information utilise un `<dialog>` natif. Le contenu de la page reçoit `inert` lorsqu’une fenêtre est ouverte. Ces comportements sont décrits d’après le code ; leur validation clavier et mobile relève des contrôles manuels.

## Maintenance et versions

```sh
npm ci
npm run dev
npm run build
```

Vite construit l’export statique dans `dist/`. La pile active est React 19, Framer Motion 12, Lucide et CSS. Cormorant et Manrope sont fournis localement ; les titres principaux utilisent Georgia. Aucune préparation Python, interpolation d’image ou génération de film n’est nécessaire au catalogue. Les métadonnées de `index.html` décrivent le carnet photographique et contiennent `noindex,nofollow`.

La version précédente est figée dans `public/version-fondue/`, accessible à **`/version-fondue/`** depuis le panneau d’information. L’ancienne hero à trois vues reste à `/version-2/`. Ne pas modifier ces exports historiques lors d’un ajustement du catalogue.

L’essai cinématique a été archivé dans [SCENARIO-cinematic-experiment.md](SCENARIO-cinematic-experiment.md), avec l’en-tête **« Essai abandonné à la demande utilisateur, non publié »**. Ses anciens composants, images de travail, scripts et notes ne définissent pas le site actif. Les autres documents historiques restent disponibles pour provenance ; vérifier l’entrée de `index.html` avant de choisir un fichier à maintenir.

## Contrôles manuels à effectuer

- Vérifier la composition et l’absence de débordement horizontal sur ordinateur et mobile, dans les trois langues.
- Parcourir les ancres, les trois cartes, la galerie et le panneau d’information au clavier ; contrôler le retour du focus.
- Vérifier les découpes sur le fond crème et le vichy, ainsi que le chargement de la photo principale et des quatre originaux.
- Comparer le scroll normal, la préférence système de mouvement réduit et `?motion=reduce`.
- Contrôler les destinations Booking et `/version-fondue/`, sans exécuter de réservation.
- Exécuter la construction et consigner uniquement les résultats observés dans `VERIFICATION.md`.
