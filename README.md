# Schützen · Cartes postales suisses — V10

## Publication publique sur GitHub Pages, sans indexation

La cible GitHub Pages est `https://tpepin74-cpu.github.io/schuetzen-lauterbrunnen/`. Le workflow publie uniquement le résultat de `npm run build:github` : les 64 pages et la page 404 portent `noindex,nofollow,noimageindex`, avec des liens et médias adaptés au sous-répertoire du projet. La compilation vérifie les huit langues et les références locales avant déploiement.

Le site est accessible par son lien. La consigne de non-indexation concerne ses pages ; l’interface du dépôt GitHub public reste visible et recherchable. Les instructions et limites sont détaillées dans [GITHUB-PAGES.md](docs/GITHUB-PAGES.md).

La configuration du build standard conserve le Site privé existant.

Le site reprend le catalogue fourni dans `hotel-schuetzen-site.zip` et le présente sous forme de cartes postales suisses : photographies découpées à bord blanc, papier crème, rouge suisse, vert sapin, Vichy rouge, géraniums et petits souvenirs alpins. Le contenu de découverte et le parcours de réservation restent au centre.

La V10 étend les surprises interactives à **101 occurrences photographiques sur les huit pages de référence** : **56 collages répartis en 14 motifs**, et **45 photos de carte réparties en 9 familles d’animation**. Elle ajoute un concierge qui fait un clin d’œil, une fourchette à fondue photographique, un nouveau postier jaune à grande barbe blanche, un blason d’en-tête deux fois plus grand que celui de la V8 et le crédit commun vers **cerfalunettes.ch**.

Le site possède désormais une architecture de **huit langues et 64 pages statiques**. Les sept traductions sont construites à partir du français et d’un catalogue de **1 380 chaînes par langue**. **La validation locale responsive, multilingue et fonctionnelle est terminée.** Les résultats détaillés figurent dans `docs/VERIFICATION-V10.md`, les rapports de rendu et les relevés de poids de fichiers ; aucun score Lighthouse n’est déduit de ces mesures.

## Exécuter et construire

```sh
npm ci
npm run dev
npm run build
```

Vite appelle `emitLocaleResources()` depuis `vite.config.js`. Le développement émet les ressources des langues ; la compilation de production active le contrôle strict des traductions et produit les **64 entrées HTML** dans `dist/`. Une traduction absente ou vide empêche la construction stricte.

Le rendu repose sur HTML, CSS, JavaScript natif et l’API DOM de Framer Motion. Aucune clé API ni aucun serveur applicatif n’est nécessaire. Les anciens composants React et expériences cinématiques restent des sources historiques, pas l’entrée active du site.

Pour régénérer les variantes d’images et leur manifeste, avec Python et Pillow :

```sh
python scripts/optimize-images.py
```

Ce script écrit les dérivés et `docs/performance-assets.json` ; il préserve les originaux. Il ne réécrit pas les HTML, les styles ou le JavaScript. L’intégration des candidats `srcset` est assurée par le compilateur de pages et par les chemins des variantes utilisés au runtime.

## Pages et sources actives

| Source française | Rôle |
| --- | --- |
| `index.html` | Accueil, catalogue découverte, concierge, chambres, restaurant, séjours, carte postale et postier. |
| `chambres.html` | Huit catégories, équipements, galeries et choix de chambre. |
| `restaurant.html` | Horaires, spécialités, 45 photos de plats/boissons et groupes. |
| `sejours.html` | Six inspirations avec étapes, conseils et sources touristiques. |
| `vallee.html` | Neuf cartes de découverte et ressources utiles. |
| `maison.html` | Page visible « Le chalet » ; nom historique du fichier conservé. |
| `infos.html` | Contacts, accès, repères lisibles de la vallée et FAQ. |
| `reservation.html` | Dates, voyageurs, chambre, liens externes et demande de groupe. |

| Fichier ou dossier | Responsabilité |
| --- | --- |
| `public/js/data.js` | Données métier `window.SCH` issues du ZIP, corrigées selon les demandes utilisateur. |
| `public/js/site.js` | Réservation, calendrier, galeries, navigation, demandes de groupe et concierge guidé. |
| `src/stays.json`, `src/experience.js` | Six séjours, filtres, favoris locaux, navigation mobile et contexte de réservation. |
| `src/guide-panel.html`, `src/guide.css` | Structure et présentation du Concierge en ligne. |
| `src/postcard.css`, `src/stay-experience.css`, `src/readability.css` | Composition, sections et lisibilité. |
| `src/header-shield.css`, `src/site-credit.css`, `src/localization.css` | Blason débordant, crédit de réalisation et interfaces multilingues. |
| `src/postcard-motion.js` | Styles et mouvements décoratifs au défilement. |
| `src/easter-eggs.js`, `src/easter-eggs.css` | Détection des photos, boutons, arrêt commun, audio, variantes et annonces accessibles. |
| `src/easter-scenes.js`, `src/easter-scenes.css` | Petites scènes des collages : téléphérique, train, fleurs, courrier, etc. |
| `src/menu-easter-eggs.js`, `src/menu-easter-eggs.css` | Neuf familles d’animation appliquées aux 45 photos culinaires. |
| `src/menu-photos.json`, `src/menu-gallery.css` | Inventaire de la carte et grille photographique. |
| `scripts/decorate-menu.py` | Ajout idempotent des photos sans remplacer noms, descriptions et prix. |
| `scripts/enrich-postcards.py` | Régénération des blocs historiques marqués V7. |
| `src/i18n/`, `scripts/localize-site.mjs` | Catalogues de traduction et compilation des pages et ressources localisées. |

Les scripts historiques lisent les fichiers existants ; ils ne reconstruisent pas à eux seuls toutes les évolutions V10. Modifier la source concernée et examiner le diff avant de régénérer un bloc V7.

## Langues, URLs et provenance éditoriale

| Langue | Code | Racine publique |
| --- | --- | --- |
| Français de Suisse | `fr-CH` | `/fr/` |
| Allemand de Suisse | `de-CH` | `/` |
| Anglais britannique | `en-GB` | `/en/` |
| Chinois simplifié | `zh-Hans` | `/zh/` |
| Russe | `ru` | `/ru/` |
| Coréen | `ko` | `/ko/` |
| Italien | `it` | `/it/` |
| Espagnol | `es` | `/es/` |

Le français des huit HTML source reste la source éditoriale ; le build publie l’allemand de Suisse à la racine, et le français sous `/fr/`. Le contrat des sept catalogues traduits est de **1 069 entrées statiques + 311 entrées runtime = 1 380 chaînes** : textes, SEO, attributs accessibles, formulaires, calendrier, concierge, messages et e-mails préparés. Les IDs techniques, références Booking, montants, capacités et placeholders sont conservés.

`scripts/localize-site.mjs` produit les HTML des sept répertoires de langues, les fichiers `public/locales/{lang}/runtime.js`, `data.js`, `site.js` et le lettrage SVG localisé du restaurant. `scripts/i18n-js.mjs` traduit les textes du JavaScript à partir de son AST ; `scripts/locale-runtime.js` fournit les pluriels et la substitution des messages ; `public/js/site.js` formate les dates et nombres dans la langue active. Les fichiers générés ne sont pas les sources à modifier manuellement.

Le contenu traduit est présent dans le HTML statique. Le sélecteur de langue rejoint la même page, avec le contexte de séjour et l’ancre. Les URL techniques comme `chambres.html` restent stables ; seuls les préfixes de langue changent. Les ressources sont référencées depuis la racine, y compris les candidats des galeries créés au runtime.

Les rapports `docs/i18n-de-en.md`, `docs/i18n-it-es.md` et `docs/localization-verification.json` consignent les choix et l’état de couverture. Le dernier rapport doit être régénéré et relu lors de la construction stricte ; un rapport intermédiaire n’est pas une validation de publication.

## Changements visibles

### Un blason qui dépasse de l’en-tête

Le logo adjacent aux anciens textes a été remplacé par le blason seul, avec **Accueil** dans le menu. La V10 double sa taille par rapport à la V8. `src/header-shield.css` conserve son rapport **547 / 694** et laisse le blason dépasser sous la barre :

| Réglage | Bureau, au-dessus de 760 px | Mobile, jusqu’à 760 px |
| --- | --- | --- |
| Hauteur initiale du logo | 342 px | 264 px |
| Largeur CSS réservée au blason | 269,56 px | 208,08 px |
| Échelle après défilement | 0,43 | 0,44 |
| Hauteur visible après réduction | 147,06 px | 116,16 px |
| Hauteur de la barre d’en-tête | 90 px | 76 px |
| Emprise du lien dans la navigation | 145 × 76 px | 110 × 67 px |
| Espace supérieur permanent de la hero | 286 px | 218 px |

Le logo est positionné dans `.top__shield`, sans élargir la navigation. La marge des ancres tient compte du débordement compact : largeur réservée de 116 px + 22 px sur bureau, 92 px + 18 px sur mobile, en plus de `--side`. Le menu mobile reçoit aussi un dégagement supérieur. Le `sizes` du logo d’en-tête est `(max-width:760px) 209px, 270px`, avec le fichier haute définition de 547 px conservé. Le logo du pied de page n’est pas agrandi.

### Textes, concierge et cartes postales

L’accueil affiche « Réservez votre séjour », « Trois façons d’apprécier votre séjour », « Les chambres qui vous attendent » et « Découvrez le chalet ». Le bandeau statistique demandé a été retiré ; les textes de l’établissement emploient « chalet » ou « hôtel-restaurant ». Le pied de page conserve « Hâte de vous accueillir au Schützen ».

Le grand **Concierge en ligne** propose les choix de séjour et de réservation. Son lanceur porte maintenant **« Vous avez une question ? »** dans les huit HTML français et dans le bloc commun. Sa photographie découpée peut faire un clin d’œil. Les huit boutons déjà chargés d’ouvrir le concierge ne sont pas transformés en boutons d’Easter egg imbriqués.

Les huit pieds de page français portent **« Réalisé par Le Cerf à Lunettes · cerfalunettes.ch »**, avec le lien `https://cerfalunettes.ch`. Le compilateur conserve ce crédit sur les pages traduites et adapte son libellé.

La carte postale de réservation garde ses ombres et son coin relevé. Un nouveau postier fictif, joufflu, très souriant, vêtu de jaune et doté d’une grande barbe blanche remplace le précédent visuel. Ses mains encadrent le vrai lien HTML **PostCard Creator** de La Poste. Le clic sur sa photo déclenche une autre petite scène de courrier ; il reste distinct du lien de service. Aucune API postale ni affiliation commerciale n’est intégrée.

Le restaurant conserve « L’appétit, les amis, la vie. » et son lettrage découpé. Dans les langues traduites, un SVG porte le titre localisé ; `data-original-src` garde la référence de l’image française afin de reconnaître la surprise. La Vallée conserve ses neuf excursions ; les anciennes sections Trajets et Saisons restent retirées.

### Catalogue conservé

Le catalogue présente **25 chambres de chalet et 8 catégories**. La **Familiale, 27 m²**, accueille **5 personnes** avec un lit simple, un lit superposé et un grand lit double. La **Familiale Supérieure, 29 m²**, dispose de **6 couchages pour 4 adultes maximum**, avec deux lits superposés et un grand lit double. **Basic Randonneur** reste retirée du catalogue actif.

La carte comprend **29 références de plats et 16 références de boissons** avec photos d’illustration, organisées par catégories et onglets À manger / À boire. Les prix, descriptions, indications alimentaires, contenances et provenances fournis sont conservés. Une mention indique que la présentation peut varier.

## Surprises photographiques

Les 101 occurrences sont comptées sur les huit pages françaises de référence, **sans multiplier ce nombre par les traductions**. Les vues localisées reprennent ces emplacements. Le restaurant en comporte 51, dont ses 45 photos culinaires. Inventaire détaillé : [EASTER_EGGS.md](docs/EASTER_EGGS.md), `docs/easter-v9-inventory.json` et `docs/easter-v9-menu.json` ; leurs noms V9 restent des références de fichiers historiques.

Le Saint-Bernard tend la patte, la vache meugle, la cloche tinte, le téléphérique grimpe, le train part, les fleurs s’éveillent, les chaussures marchent, la luge glisse, les convives trinquent et le postier fait apparaître une carte. Les photos de la carte montrent notamment du fromage qui file, des graines qui rebondissent, de la vapeur, des bulles et des glaçons.

Les surprises partent d’un clic, d’un toucher ou d’une activation clavier. Une seule scène et un seul son jouent à la fois. Un second clic, Échap, un clic ailleurs, la sortie de la zone visible ou la mise en arrière-plan arrêtent l’effet. Le survol et le focus peuvent préparer une image, sans jouer la surprise. Les transformations du parent animé par Framer Motion restent séparées de celles des éléments de la scène.

## Parcours et limites

Les six séjours sont des **suggestions éditoriales**, pas des forfaits vendus par l’hôtel. Activités, transports et ouvertures s’organisent séparément. Les favoris sont enregistrés sous `sch.stay-favorites` sur l’appareil, sans compte ni synchronisation distante.

Le concierge est un parcours guidé avec choix, réponses préparées, retour et recommencement. Il utilise aussi des mots-clés multilingues pour orienter une question libre. Il ne transmet pas la conversation à la réception et ne confirme pas les disponibilités.

Le calendrier conserve le séjour sous `sch.booking`. Premier clic : arrivée ; deuxième : départ ; clic suivant : nouvelle arrivée. Au-delà de 30 nuits, il propose de contacter la réception et permet de recommencer. **Effacer les dates** retire arrivée et départ sans supprimer les voyageurs ni la chambre. Les liens externes reprennent les dates, voyageurs, âges des bébés et catégorie choisis.

**La disponibilité en direct reste non configurée.** Le site ne calcule ni inventaire ni tarifs en temps réel. La demande de groupe prépare un e-mail et ouvre la messagerie du visiteur. Aucun paiement, envoi serveur ou confirmation de réservation ne se déroule sur le site.

## Médias, coûts de fichiers et provenance

Les photographies fournies restent conservées dans `public/img/`, avec les archives du ZIP dans `docs/source-html/`. Les photos culinaires et personnages générés sont des illustrations ; les personnages ne représentent pas des employés réels.

Les prompts et sources des nouveaux visuels sont conservés dans `docs/easter-v9-sprites.json`, `docs/postman-friendly-prompt.json` et `docs/asset-sources/`. La pose du chien et le son de vache gardent leurs références dans `docs/easter-dog-asset.json` et `docs/easter-audio-sources.md`. Les 45 photos de menu sont documentées dans `docs/menu-photos-*.json`. Les droits et réserves des photographies fournies restent ceux de [LISEZMOI-original.md](docs/source-html/LISEZMOI-original.md).

Le manifeste [performance-assets.json](docs/performance-assets.json), daté du 24 octobre 2026, mesure les octets de fichiers et vérifie dimensions, alpha et intégrité des sources. Exemple de trois médias V10 :

| Média | Original WebP | Petit candidat | Candidat intermédiaire |
| --- | ---: | ---: | ---: |
| Concierge, clin d’œil | 185 188 octets, 800 × 1200 | 24 554 octets, 240 × 360 | 66 006 octets, 480 × 720 |
| Fourchette à fondue | 33 276 octets, 640 × 640 | 4 522 octets, 160 × 160 | 10 968 octets, 320 × 320 |
| Nouveau postier | 148 732 octets, 1200 × 1200 | 19 140 octets, 320 × 320 | 50 476 octets, 640 × 640 |

Les **45 originaux du menu** totalisent **3 465 418 octets** ; leurs petits candidats totalisent **1 157 526 octets**, et les intermédiaires **2 257 634 octets**. Il s’agit de sommes de fichiers, pas d’un téléchargement simultané : le navigateur choisit un candidat selon la largeur, le DPR, `sizes`, le cache et le chargement différé.

Le runtime utilise la variante du clin d’œil de 480 px et la fourchette de 320 px ; la pose du chien est servie en 640 px. Les scènes SVG/CSS ne demandent pas de nouvelles photos. Le son de vache fait 35 467 octets et est chargé à la demande. Les autres accents sonores sont synthétisés localement.

Les archives `version-2`, `version-collage`, `version-fondue` et les anciens médias cinématiques restent dans les sources historiques mais sont exclus du `dist/` actif par `finishBuild()`. Cette exclusion réduit le poids de l’archive de sortie ; elle ne constitue pas une mesure du chargement d’une page.

## Lisibilité et état de validation

Manrope sert au corps et aux commandes, Georgia aux titres, Cormorant aux notes. Les règles de lisibilité visent un corps de 17–18 px, des commandes principales de 16 px et des libellés mobiles de 14 px. Les mouvements respectent `prefers-reduced-motion` et `?motion=reduce`, avec une représentation statique des surprises. Ces choix ne constituent pas une certification WCAG.

Les 64 pages ont été parcourues à 360, 768 et 1293 px, puis un contrôle complémentaire de 80 cas a validé les accordéons corrigés à 360/768 px et les 64 pages à 1600 px. Le postier a aussi été vérifié à 320 et 390 px. Les essais fonctionnels portent sur le calendrier mobile anglais, la conservation des dates lors du passage au russe, le concierge coréen, le menu mobile et les surprises photographiques. Des contrôles ciblés avec texte doublé ont vérifié le reflow de la réservation russe et de la carte française. Voir `docs/VERIFICATION-V10.md` pour le périmètre exact. Aucun score Lighthouse, mesure Core Web Vitals ou temps de chargement réseau n’est déduit de ces tailles ; les rapports antérieurs restent historiques.

Voir [SCENARIO.md](docs/SCENARIO.md), [TOURISM_SOURCES.md](docs/TOURISM_SOURCES.md), [VERIFICATION.md](docs/VERIFICATION.md) et les rapports de compilation pour les parcours, sources et vérifications effectivement consignées.

## Visibilité et passage en production

`src/seo-config.json` reste configuré avec **`indexable: false`** et **`audience: "owner-private"`**. Le compilateur produit les canonical, hreflang, métadonnées sociales, données structurées, `sitemap.xml` et `robots.txt` depuis cette configuration. Dans l’état privé, les pages portent `noindex,follow` et le fichier robots exclut l’exploration. Ces instructions ne remplacent pas la protection d’accès de l’hébergement.

Le passage en production demande une remise explicite : origine publique définitive, visibilité d’hébergement, politique d’indexation, catalogues complets, validation des parcours et résultat des contrôles responsive/performance. Le site ne doit pas être rendu indexable simplement en réutilisant une sortie privée. **Cette documentation n’atteste aucun déploiement V10.**
