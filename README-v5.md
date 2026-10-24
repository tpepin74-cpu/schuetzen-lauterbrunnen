# Schützen · Lauterbrunnen

Un carnet de découverte photographique, composé comme un collage de papier découpé : le chalet original, du vichy rouge et blanc, des géraniums, un Saint-Bernard, une vache suisse, un téléphérique et une tablée autour d’une fondue. Le fond crème, les accents rouges et les petits éléments de fête accompagnent les photographies du lieu.

Le site est une page à défilement naturel avec des mouvements décoratifs Framer Motion. **Aucun film n’est utilisé par le site.** L’essai de traversée de la cascade et de travelling a été abandonné à la demande utilisateur.

## Démarrer et construire

```sh
npm ci
npm run dev
npm run build
```

La construction produit `dist/`, un export statique. Stack : React 19, Framer Motion 12, Vite 6, CSS et Lucide. Les fichiers de Cormorant Garamond et Manrope sont embarqués dans `public/assets/` ; les grands titres utilisent Georgia. L’application n’a pas de backend ni de clé API à fournir pour son exécution.

## Entrée et fichiers actifs

| Fichier | Rôle |
| --- | --- |
| `index.html` | Charge **`src/SwissCollageApp.jsx`**, définit les métadonnées et précharge les polices. |
| `src/SwissCollageApp.jsx` | Hero, catalogue de trois cartes, tablée, pied de page, textes FR/EN/DE, réservation et panneau d’information. |
| `src/swiss-collage.css` | Direction graphique, vichy rouge, compositions de papier, adaptations mobile et mouvement réduit. |
| `src/Gallery.jsx` et `src/Gallery.css` | Galerie des quatre photographies originales. |
| `public/assets/collage/` | Cinq découpes photographiques générées, au format WebP avec alpha. |

**Structure, mouvements, provenance des médias et maintenance : [docs/SCENARIO.md](docs/SCENARIO.md).**

## Parcours et médias

La photo principale est `original-1.webp`. Le catalogue présente `original-2.webp`, la composition `journey/fondue.webp`, puis `original-4.webp`. La première et la troisième carte ouvrent la photographie correspondante dans la galerie ; la carte fondue mène à la section « À table ».

Les quatre photographies originales restent intactes et consultables. Les cinq découpes sont `geranium.webp`, `cable-car.webp`, `bernard.webp`, `cow.webp` et `fondue-friends.webp`. Les animaux, objets et convives sont des créations photographiques pour le collage ; ils ne documentent pas les animaux, clients ou prestations actuels de l’hôtel. La photo de fondue du catalogue est également une création issue de la proposition précédente. Le panneau « À propos du collage » explique la provenance des découpes en français, anglais et allemand.

Les prompts et informations de préparation sont conservés dans [collage-animal-assets.md](docs/collage-animal-assets.md), [collage-decoration-assets.md](docs/collage-decoration-assets.md) et [collage-table-asset.md](docs/collage-table-asset.md). La composition de fondue réutilisée est documentée dans [fondue-assets.md](docs/fondue-assets.md).

## Navigation, langues et accessibilité

La page propose les ancres `#accueil`, `#decouvrir` et `#a-table`, une galerie et un panneau d’information. L’interface, la galerie et les descriptions alternatives des photographies disposent de textes FR/EN/DE ; le sélecteur met à jour la langue du document. Le choix est conservé pendant la session React et revient au français au rechargement.

Le mobile utilise des compositions redimensionnées et une colonne de cartes sous 560 px. `prefers-reduced-motion` et `?motion=reduce` désactivent les mouvements décoratifs liés au scroll et les entrées des cartes. La page conserve son contenu et sa navigation habituels. La galerie comprend des commandes clavier et une gestion du focus.

Les liens de réservation ouvrent la [fiche Booking.com existante](https://www.booking.com/hotel/ch/restaurant-schutzen-ag.html) dans un nouvel onglet. Aucun paiement ni formulaire de réservation n’est exécuté par cette proposition. `index.html` contient `noindex,nofollow`.

## Versions et vérification

La version précédente avec la chorégraphie de fondue est conservée dans `public/version-fondue/`, accessible à **`/version-fondue/`** depuis le panneau d’information. L’ancienne hero reste archivée à `/version-2/`.

Le scénario cinématique non publié a été déplacé dans [docs/SCENARIO-cinematic-experiment.md](docs/SCENARIO-cinematic-experiment.md). Les anciens composants `JourneyApp`, `CinematicFilm`, `FondueJourney` et les scripts de préparation du film ne constituent plus l’entrée active. Consulter `index.html` avant toute modification.

Ce README décrit les sources et ne constitue pas un résultat de test. Les contrôles à effectuer figurent dans le scénario ; les résultats effectivement observés relèvent de [docs/VERIFICATION.md](docs/VERIFICATION.md).
