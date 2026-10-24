# Essai abandonné à la demande utilisateur, non publié

Ce document conserve le scénario de l’expérience cinématique abandonnée. Il décrit un état de travail historique, pas le site actif. Aucun film n’est utilisé par le catalogue actuel ; son entrée est `src/SwissCollageApp.jsx` et sa documentation est [SCENARIO.md](SCENARIO.md). Les indications de « rendu actif » ci-dessous appartiennent à cet instantané archivé et ne doivent pas être suivies pour maintenir le catalogue.

---

# Hero photographique — travelling au scroll

## Rendu actif

`index.html` charge `src/JourneyApp.jsx`. Une seule section épinglée contient `CinematicFilm`, `FondueJourney`, les textes et l’interface. Le scroll natif reste réversible ; aucune molette ni interaction tactile n’est interceptée.

`useScroll({target: sectionRef, offset: ['start start', 'end end']})` fournit la progression normalisée. Un ressort commun (`stiffness: 180`, `damping: 34`, `mass: .32`) adoucit les mouvements. La section mesure **1750svh sur ordinateur**, **1550svh sous 760 px** ; la scène intérieure reste à `100svh`.

### Film photographique

Les fichiers `public/assets/cinematic/journey-desktop.mp4` et `journey-mobile.mp4` sont des rendus muets de **384 images à 24 images/s**, soit **16 secondes encodées**. Le temps réel de visite dépend entièrement du scroll.

- Paysage : 1600 × 900 ; portrait : 900 × 1350.
- MP4 H.264, `yuv420p`, index placé en tête du fichier, groupes de six images et aucune image B pour limiter le travail de décodage à chaque déplacement.
- `CinematicFilm.jsx` ne lance jamais la lecture. Il transforme la progression `0 → .578` en indice d’image `0 → 383`, puis modifie `currentTime`.
- Un seul seek reste en cours. Les déplacements reçus pendant le décodage remplacent la cible attendue ; `seeked` rattrape la dernière position.
- Le fichier portrait est sélectionné sous 760 px. Le navigateur ne reçoit pas les deux films simultanément.
- Une erreur du décodeur active des vues fixes des étapes ; le site et les gestes de fondue restent utilisables. Ce repli n’effectue pas de morphing déformant.
- Le composant annule ses RAF, écouteurs et chargements lors de son démontage. Aucun moteur WebGL n’est requis.

La cadence du fichier ne garantit pas une fréquence d’affichage donnée sur tout appareil. Le film est une animation photographique calculée, **pas une prise de vue continue du lieu**. Les changements de perspective entre les photographies peuvent encore se percevoir. Ajouter des images interpolées ne transforme pas des références indépendantes en une reconstruction métrique du bâtiment.

## Trajet

| Progression | Action |
|---|---|
| `0 → .105` | Approche progressive de la chute par un zoom orienté vers l’eau. |
| `.068 → .118` | Immersion dans une photographie d’eau en gros plan ; les falaises disparaissent derrière l’eau. |
| `.12 → .195` | Ouverture irrégulière et douce de l’eau, avec déformation locale, reflets et brume. La roche n’est plus divisée en deux panneaux. |
| `.195 → .285` | Vue du restaurant depuis la rue, rapprochement vers les marches. |
| `.285 → .34` | Montée depuis le bas de l’escalier vers les dernières marches. |
| `.34 → .395` | Arrivée sur le palier de la terrasse. |
| `.395 → .435` | Changement d’angle vers la table. |
| `.435 → .49` | Approche de la table, du feu et du caquelon. |
| `.49 → .558` | Rapprochement vers la composition de fondue finale. |
| `.556 → .575` | Relais vers le SVG photographique ; la dernière photo et le cadrage sont communs aux deux rendus. |
| `.585 → .658` | La main gauche prend et présente le pain. |
| `.65 → .739` | La main droite approche la fourchette. |
| `.739` | Transfert instantané du pain sur la fourchette et remplacement de la main gauche par la version vide. |
| `.755 → .798` | Retrait de la main gauche et plongée dans le caquelon. |
| `.795 → .90` | Mouvement elliptique de brassage lié à la progression. |
| `.894 → .957` | Remontée de la bouchée enrobée et filament de fromage. |
| `.94 → 1` | Bouchée ramenée vers le spectateur, profondeur de champ réduite et texte final. |

Les repères de navigation restent `[0, .225, .34, .455, .595]`. Le bouton de poursuite ajoute les arrêts `.68`, `.735`, `.82`, `.94` et `1`. Les cinq chapitres restent accessibles sans parcourir toute la course.

## Sources et visuels

Les quatre originaux `public/assets/original-1.webp` à `original-4.webp` sont conservés sans retouche dans la galerie. Ils servent aux références architecturales, aux couleurs, au mobilier et au contexte du lieu.

Dix nouveaux WebP se trouvent dans `public/assets/cinematic/` :

- `approach`, `steps-low`, `steps-high`, `landing` et `terrasse-turn` : cinq vues de l’approche et de l’accès réel étroit, cohérentes avec les photos de référence.
- `table-wide` et `table-approach` : deux relais vers la fondue paysage.
- `table-wide-mobile` et `table-approach-mobile` : deux compositions portrait dédiées, raccordées au fond de fondue mobile existant.
- `water-close` : eau photographique utilisée pour la traversée de la cascade.

Les prompts, références, dimensions et limites de fidélité sont dans `cinematic-architecture.md` et `cinematic-table.md`. La cascade initiale et les photos finales de fondue se trouvent toujours dans `public/assets/journey/`. Les cinq sprites photographiques des mains, de la fourchette et du pain n’ont pas été remplacés.

Toutes les créations sont des images de concept. Le panneau d’information le précise en français, anglais et allemand ; elles ne documentent pas les prestations ou les installations actuelles de l’hôtel.

## Reproduction du film

`public/assets/cinematic/sequence.json` définit les vues et leurs positions. `scripts/render-cinematic-film.py` compose l’eau, la caméra puis encode les deux formats avec FFmpeg. Le module de caméra associé décrit les raccords. Les sources WebP restent inchangées ; les transformations ne concernent que les images du film.

Prérequis de préparation : Python, NumPy, Pillow, OpenCV et FFmpeg avec `libx264`. Ils ne sont pas nécessaires dans le navigateur. Un environnement OpenCV séparé peut être passé avec `--opencv-path`.

```sh
python scripts/render-cinematic-film.py --profile desktop
python scripts/render-cinematic-film.py --profile mobile
```

`--samples-only` produit les images de contrôle sans réencoder le film. Le script écrit d’abord un fichier temporaire puis le remplace une fois l’encodage terminé. Contrôler le raccord final et les vues intermédiaires avant de publier ; un fichier MP4 valide ne prouve pas la cohérence visuelle de la caméra.

## Gestes et mobile

`FondueJourney.jsx` conserve les gestes approuvés : SVG 1600 × 900 sur ordinateur, 900 × 1350 sur mobile, avec `preserveAspectRatio="xMidYMid slice"`. L’origine du groupe de droite se trouve à la pointe de la fourchette. Les masques du caquelon et de la surface du fromage passent devant le pain immergé. L’inclinaison pendant la plongée est de −38° en paysage et −60° en portrait.

Le liseré fin des mains est conservé. Il ne contourne plus les falaises comme deux panneaux. Les coordonnées, masques et origines sont liés aux photos finales : leur remplacement exige de recalibrer le geste.

`prefers-reduced-motion: reduce` ou `?motion=reduce` remplace le voyage par cinq photographies fixes sélectionnables. Aucun film ni geste animé n’est monté dans ce mode. La section mesure alors `100svh`. Les textes peuvent être masqués avec le mode contemplation.

## Maintenance et versions

Le mode `?inspect` est strictement réservé au serveur de développement : son champ « Position du travelling » permet de vérifier un point précis par une véritable action de scroll. Il est supprimé de la construction de production.

La version précédente est conservée à `/version-fondue/`, avec son export et ses médias propres. La hero plus ancienne à trois vues reste à `/version-2/`. Les fiches historiques sont `SCENARIO-v4.md` et `VERIFICATION-v4.md`. Les anciens composants d’environnement restent dans l’historique et ne constituent pas le rendu actif.

Construire avec le helper Sites depuis le dépôt, conserver `.openai/hosting.json` et publier le commit exact. Aucun token n’appartient aux sources. Le bouton Booking.com ouvre uniquement le lien existant ; aucun formulaire ni paiement n’est exécuté par cette proposition.
