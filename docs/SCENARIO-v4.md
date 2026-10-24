# Archive — hero avant le travelling vidéo

Cette fiche décrit la version conservée à `/version-fondue/`, pas le rendu actif.

# Scénario et maintenance de la hero

## Architecture

Le projet présente **une seule hero épinglée**, de la cascade à la première bouchée de fondue. Les photographies, découpes et éléments SVG se superposent dans le même écran ; leurs transformations suivent le défilement. Ce parcours n’est pas une vidéo.

`index.html` charge `src/JourneyApp.jsx`, qui monte `EnvironmentJourney`, `FondueJourney`, l’interface, les textes, la galerie et le panneau d’information. Les anciens `main.jsx` et `PhotoJourney.jsx` ne sont plus l’entrée active.

`useScroll({ target: sectionRef, offset: ['start start', 'end end'] })` normalise le voyage entre **0 et 1**. Un `useSpring` partagé (`stiffness: 180`, `damping: 34`, `mass: .32`) lisse les changements. Le scroll reste natif et réversible, sans interception de la molette.

La section mesure `1450svh` sur ordinateur et `1250svh` sous 760 px. Son écran intérieur utilise `position: sticky`, `top: 0` et `height: 100svh`.

## Progression de la scène

Les plages ci-dessous décrivent les valeurs du code. Les chevauchements permettent les fondus entre les plans. Les nombres ne représentent pas des secondes.

| Progression | Action / composition | Réglages principaux |
|---|---|---|
| `0 → .035` | Cascade encore réunie et texte d’ouverture. | `LandscapeHalf`, `StoryText` |
| `.035 → .198` | Les deux moitiés de falaise et d’eau s’écartent ; un liseré clair suit la découpe. Le chalet apparaît derrière. | `LandscapeHalf`, `SEAM`, `LEFT`, `RIGHT` |
| `.14 → .315` | Approche de la photo originale, agrandissement et translation vers les escaliers. Le plan disparaît entre `.29` et `.325`. | `houseScale`, `houseX`, `houseY`, `houseOpacity` |
| `.271 → .413` | Entrée de la vue rapprochée des marches, puis montée vers le palier. Une petite oscillation liée au scroll suggère les pas. | `stairOpacity`, `stairScale`, `stairY` |
| `.372 → .56` | Arrivée sur la terrasse avec géraniums, drapeaux et feu ; rapprochement vers la table. | `terraceOpacity`, `terraceScale`, `terraceY` |
| `.50 → .575` | Fondu vers la fondue et stabilisation du cadrage. Les environnements sont masqués après `.56`. | `FondueJourney.opacity`, `cameraScale`, `cameraY` |
| `.585 → .658` | La main gauche vient du panier vers le centre en tenant le pain. | `leftPose`, `leftOpacity` |
| `.65 → .739` | La main droite amène la fourchette vers le morceau tenu à gauche. | `forkPose`, `rightOpacity` |
| `.739` | Transfert instantané : la main gauche devient vide exactement lorsque le pain séparé apparaît sur la fourchette. Une seule main porte le pain de part et d’autre de ce seuil. | `leftBreadOpacity`, `leftEmptyOpacity`, `breadOpacity` |
| `.755 → .798` | La main gauche se retire ; fourchette et pain descendent dans le caquelon. Le pot et sa surface masquent les éléments immergés. | `leftPose`, `forkPose`, `submergedOpacity` |
| `.795 → .90` | Brassage elliptique, calculé avec `sin` et `cos` à partir du scroll. | Branche de brassage de `forkPose` |
| `.894 → .957` | Passage à l’image de bouchée enrobée ; un filament relie brièvement la bouchée au pot pendant sa remontée. | `coatedForkOpacity`, `strandPath`, `strandOpacity` |
| `.94 → 1` | La bouchée revient vers le spectateur et grossit ; léger flou du fond, texte final à partir d’environ `.945`. | `forkPose`, `backgroundBlur`, dernier `StoryText` |

Les cinq boutons de chapitre utilisent **`STOPS = [0, .225, .34, .455, .595]`** : cascade, chalet, marches, terrasse, fondue. Le bouton de progression ajoute des arrêts pour les gestes : `.68`, `.735`, `.82`, `.94`, puis `1`. À la fin, il ramène au départ.

Les indications de geste utilisent `PHASE_BREAKS = [.17, .29, .39, .52, .625, .70, .755, .90, .975]` dans `JourneyApp.jsx`. Elles sont indépendantes des repères de transformation des photographies.

## Images originales et créations

Les quatre photographies `public/assets/original-1.webp` à `original-4.webp` sont conservées et accessibles dans la galerie.

| Fichier | Contenu | Usage |
|---|---|---|
| `original-1.webp` | Chalet depuis la route, escaliers, terrasse et falaise. | Photographie intacte de l’approche et référence architecturale. |
| `original-2.webp` | Façade frontale et terrasse au crépuscule. | Galerie et référence architecturale. |
| `original-3.webp` | Staubbach derrière le restaurant, vue verticale. | Galerie et référence de la chute, du lieu et des accès. |
| `original-4.webp` | Terrasse, façade fleurie et vallée. | Galerie et référence des matières et de l’ambiance. |

Les cadrages CSS ne modifient pas le fichier de l’approche. Certaines parties sortent du cadre lorsque la caméra se rapproche.

Les assets de diffusion sont dans **`public/assets/journey/`**. Les fonds ont été générés avec l’outil intégré de génération d’images, à partir des **quatre photographies du lieu**. Les vues et gestes complémentaires emploient également des créations précédentes comme références de continuité.

| Asset | Contenu |
|---|---|
| `cascade.webp` | Panorama généré du Staubbach, centré pour la séparation des deux plans. |
| `stairs.webp` | Vue générée dans les marches ; références : quatre originales et terrasse générée. |
| `terrace.webp` | Arrivée générée sur la terrasse avec feu, fleurs et drapeaux. |
| `fondue.webp` | Vue subjective à table sur ordinateur, sans mains intégrées au fond. |
| `fondue-mobile.webp` | Composition portrait dédiée au mobile, 1024 × 1536 pixels, environ 459 Ko. |
| `left-bread.webp` / `left-empty.webp` | Main gauche avec pain, puis main correspondante vide ; alpha transparent. |
| `right-fork.webp` / `right-cheese.webp` | Main droite avec fourchette nue, puis bouchée enrobée ; alpha transparent. |
| `bread.webp` | Pain séparé utilisé pendant le transfert sur la fourchette. |

Ces créations sont des images de concept, **pas un reportage des installations ou services actuels de l’hôtel**. Le panneau d’information explique cette distinction dans les trois langues. Les trois fonds d’environnement mesurent **1672 × 941 pixels**. Les créations publiées représentent **10 fichiers WebP, environ 3,2 Mo**, en complément des quatre photographies originales. Les PNG de travail sont conservés séparément des assets publiés.

### Prompts d’environnement, résumé

- **Cascade :** photo grand angle réaliste du Staubbach, mince chute naturelle centrée, calcaire strié, frange de forêt, lumière diurne et texture photographique ; aucune cascade fantastique.
- **Terrasse :** arrivée au sommet de l’escalier, bois ancien, volets verts, store rayé bordeaux, vitrages, pavage, géraniums rouges, drapeaux suisses et brasero discret ; matières et lumière crédibles.
- **Marches :** vue subjective à mi-escalier, béton patiné et rails métalliques convergeant vers le palier, même store et terrasse que la vue suivante, progression centrale lisible.

Les prompts de fondue, les dimensions et les coordonnées sources sont détaillés dans `docs/fondue-assets.md` et `docs/fondue-asset-metadata.json`. Les noms de travail `fondue-base.webp` et `bread-cube.webp` y correspondent aux assets publiés `fondue.webp` et `bread.webp`. Les PNG et variantes initiales mentionnés par cette fiche appartiennent au dossier de travail, pas à `public/assets/journey/`.

## Assemblage des gestes

`FondueJourney.jsx` utilise un SVG **1600 × 900 sur ordinateur** et **900 × 1350 sur mobile**, avec `preserveAspectRatio="xMidYMid slice"`. Chaque format possède ses positions et masques, exprimés dans son propre espace. `forkPose()` et `leftPose()` renvoient position, rotation et échelle ; `sample()` interpole leurs repères avec une courbe douce.

La pointe de la fourchette sert d’origine au groupe de droite. Le pain reste attaché à ce groupe après le transfert à `.739`. Pendant l’immersion et le brassage, le poignet est incliné d’environ **−38° sur ordinateur** et **−60° sur mobile**, afin de garder la main au-dessus du caquelon. Les masques `fondue-cheese-surface` et `fondue-pot-front` recopient des fragments du fond devant les éléments plongés. Le filament de fromage est un chemin SVG dont l’extrémité suit la pointe. Un filtre SVG crée un liseré très fin autour des mains ; le contour des falaises est un autre tracé SVG.

Lors d’un changement d’asset, vérifier ensemble les dimensions, décalages `x`/`y`, points d’ancrage, ellipse de surface et masque du pot. Remplacer uniquement l’image peut décaler le contact pain/fourchette ou faire passer le geste devant le caquelon.

L’eau et le feu appartiennent aux photographies générées. L’implémentation ne contient pas de vidéo ni de simulation physique des fluides ; le déplacement provient des plans, du cadrage et du geste composé.

## Mobile, mode réduit et accessibilité

Le seuil React/CSS est **760 px**. Le mobile adapte la course totale, les cadrages, les origines de zoom et l’écartement des falaises. La fondue utilise `fondue-mobile.webp` et une composition portrait propre : positions de mains, rotations, échelles, ellipse de surface, masque du pot et filament sont adaptés à un espace **900 × 1350**. Les cinq repères restent disponibles, avec le seul libellé actif affiché en petite largeur.

`prefers-reduced-motion: reduce` active automatiquement le mode d’accessibilité statique ; **`?motion=reduce`** le force explicitement, même si le système ne le demande pas. Les composants animés sont remplacés par une photographie fixe, sélectionnable parmi les cinq étapes. La section mesure alors `100svh`. Les boutons changent la vue ; le parcours de mains et les grands zooms ne sont pas exécutés. Les transitions CSS sont également réduites lorsque la préférence système est active.

L’interface comporte un titre accessible, des boutons étiquetés, `aria-current="step"`, des descriptions des vues fixes et des indicateurs de focus. Les couches animées sont décoratives (`aria-hidden`). Les modales sont placées hors du `<main>` rendu inerte pendant leur ouverture.

## Exécution et version précédente

À la racine du projet :

```sh
npm ci
npm run dev
npm run build
```

`dist/` est l’export statique à servir à la racine d’un domaine. Les assets emploient des chemins absolus `/assets/`. Pour un sous-répertoire, adapter ces chemins et la configuration de base ; modifier seulement Vite ne réécrit pas les chemins présents dans les composants.

La configuration Sites est dans `.openai/hosting.json` : préserver son identité et ses accès. Ne pas ajouter de token au dépôt. Les commandes ci-dessus ne publient pas le site. Le lien réel de réservation est centralisé dans `BOOKING`, les traductions dans `COPY`, dans `JourneyApp.jsx`.

**`public/version-2/`** contient un export figé de la hero précédente à trois vues. Vite le copie dans `dist/version-2/` ; son adresse est **`/version-2/`**. Le panneau d’information y renvoie. Pour modifier cette archive, repartir explicitement de son état source ; ne pas supposer que l’ancien `main.jsx` reconstruit à lui seul l’export archivé.

## Contrôles après modification

Cette liste indique les vérifications à réaliser, sans attester de leur exécution sur un appareil particulier.

- Parcourir le scroll dans les deux sens, lentement puis rapidement ; inspecter les raccords de cascade, d’approche, de marches et de table.
- Examiner le contact pain/fourchette autour de `.739`, l’immersion vers `.80`, le brassage et la sortie vers `.90`, puis le rapprochement final.
- Vérifier un ordinateur large, un téléphone de 360–390 px et un écran bas en paysage ; garder pot, prise des mains et navigation visibles.
- Tester les cinq chapitres, la progression, le retour au début, les trois langues et le mode contemplation.
- Tester les modales au clavier, Échap, le retour du focus et le mode réduit.
- Vérifier les quatre originaux, `/version-2/`, les images absentes, les erreurs de console et le lien Booking.com sans effectuer de transaction.
- Construire après modification de source ou d’assets, puis inspecter les fichiers produits avant publication.
