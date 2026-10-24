# Petites surprises suisses — V10

## Périmètre

La V10 rend interactives **101 occurrences de photographies sur les huit pages françaises de référence** : **56 collages, 14 motifs**, et **45 photos de plats et de boissons, 9 familles d’effets**. Ce nombre décrit les emplacements du catalogue de référence ; il n’est pas multiplié par les huit langues. Les pages traduites reprennent les mêmes emplacements.

Les photographies restent le support principal. Les effets apparaissent seulement à la demande et n’ajoutent ni bandeau, ni score, ni parcours obligatoire. Les noms, descriptions, prix et onglets de la carte restent du contenu HTML ordinaire.

Les huit images déjà intégrées au bouton d’ouverture du concierge sont exclues de l’enrichissement pour éviter des boutons imbriqués. Les neuf autres occurrences du personnage — la grande présentation d’accueil et les avatars du panneau — reçoivent le clin d’œil.

## Les 14 motifs de collage

| Motif | Occurrences | Réaction |
| --- | ---: | --- |
| Saint-Bernard | 5 | Fondu vers la pose où le chien tend la patte, message « Tope là ! », puis retour au repos. |
| Vache | 3 | Petit mouvement de la photo, véritable meuglement bref et message d’accueil. |
| Cloche d’alpage | 5 | Balancement et tintement de bronze synthétisé. |
| Téléphérique | 4 | Montée de la cabine, câble et petits nuages découpés. |
| Train | 4 | Départ du train, rails, billet et bref sifflement synthétisé. |
| Géraniums | 6 | Mouvement du bouquet et envol de pétales. |
| Edelweiss | 6 | Apparition d’une constellation étoilée. |
| Chaussures de randonnée | 5 | Petits pas et empreintes qui les accompagnent. |
| Luge | 1 | Glissade, trace de neige et flocons. |
| Cor des Alpes | 4 | Ondes dessinées et quelques notes synthétisées. |
| Convives autour de la fondue | 2 | Verres qui trinquent, scintillement et vapeur. |
| Postier jaune | 1 | Petite carte postale qui sort, cachet et accent sonore d’oblitération. |
| Lettrage du restaurant | 1 | Mouvement du papier, ruban Vichy et couverts. |
| Concierge | 9 | Clin d’œil photographique, léger mouvement et étoiles. |
| **Total collages** | **56** | |

Le personnage du postier est désormais joufflu, très joyeux, avec une grande barbe blanche, une tenue et une casquette jaunes. Il reste une photographie fictive découpée, placée de façon à laisser lisible le lien PostCard Creator entre ses mains. L’effet de la photo et le lien de service restent deux commandes distinctes.

## Les 45 photos de la carte

| Famille | Photos | Effet |
| --- | ---: | --- |
| `menu-hot` | 12 | Vapeur et léger mouvement du plat chaud. |
| `menu-fresh` | 6 | Feuilles qui dansent autour des salades et wraps. |
| `menu-cheese` | 3 | Fourchette photographique et fils de fromage : fondue, raclette et macaronis. |
| `menu-burger` | 5 | Rebond du burger et petits grains de sésame. |
| `menu-tarte` | 3 | Rotation courte de la tarte flambée et herbes. |
| `menu-bubbles` | 5 | Bulles dans l’eau, le sirop, les bières et le cidre. |
| `menu-frost` | 2 | Danse des glaçons autour du thé froid et des cafés glacés. |
| `menu-toast` | 6 | Verres qui trinquent et petit tintement. |
| `menu-warm` | 3 | Volutes et cœur de vapeur pour les boissons chaudes. |
| **Total carte** | **45** | |

Chaque photo possède un libellé d’action, un libellé d’arrêt et une courte réplique adaptée au plat ou à la boisson. Les associations exactes sont consignées dans [easter-v9-menu.json](easter-v9-menu.json) et mises en œuvre dans `src/menu-easter-eggs.js`.

### Répartition par page

| Page source | Collages | Carte | Total |
| --- | ---: | ---: | ---: |
| Accueil | 13 | 0 | 13 |
| Chambres | 6 | 0 | 6 |
| Restaurant | 6 | 45 | 51 |
| Séjours | 9 | 0 | 9 |
| La Vallée | 4 | 0 | 4 |
| Le chalet | 6 | 0 | 6 |
| Infos | 6 | 0 | 6 |
| Réservation | 6 | 0 | 6 |
| **Total** | **56** | **45** | **101** |

[easter-v9-inventory.json](easter-v9-inventory.json) conserve le détail des images, parents et motifs. Son nom historique est conservé, mais son contenu décrit la V10.

## Interaction et accessibilité

- Vrais boutons nommés, utilisables au clic, au toucher, avec Entrée et Espace. Aucun départ automatique, au survol, au focus ou au défilement.
- Le survol ou le focus peuvent charger une variante photographique pour préparer le premier clic ; ils ne déclenchent ni son ni animation.
- Une seule surprise et un seul son jouent à la fois. Une nouvelle activation arrête et nettoie la scène précédente.
- Second clic/toucher, Échap, clic ailleurs, sortie de la zone visible, changement d’onglet ou départ de la page : arrêt de la scène et du son.
- Les animations temporaires sont annulées, les éléments ajoutés retirés et le libellé initial restauré. Les réponses asynchrones et minuteries restent liées à leur instance.
- Les transformations du parent Framer Motion sont conservées. Les mouvements au clic concernent les enfants de la photo.
- `prefers-reduced-motion` et `?motion=reduce` donnent une représentation statique sans trajectoire ni fondu. Le message et le changement de pose restent disponibles ; le son demande toujours une activation explicite.
- Les boutons ont un contour de focus. Les anciens `aria-hidden` sont retirés seulement autour des commandes rendues interactives ; les détails graphiques d’une scène restent décoratifs.
- La bulle est placée dans la fenêtre en tenant compte de l’en-tête et de la barre mobile. Une région de statut indépendante annonce le message ; le concierge possède aussi sa région à l’intérieur du panneau modal.
- La photographie initiale reste visible pendant le chargement d’une pose de remplacement. Si la variante échoue, un petit message de repli est affiché.
- Sans JavaScript, les photos restent visibles et le contenu du catalogue reste lisible.

Les durées sont bornées : six secondes pour la patte, 3,4 secondes pour la vache, la cloche et le concierge, 3,9 secondes pour les photos de menu et 4,6 secondes par défaut pour les autres collages. Le clin d’œil revient à sa pose initiale après environ 950 ms ; sa scène peut continuer jusqu’à son arrêt prévu.

## Modules et localisation

`src/easter-eggs.js` fournit la détection, les boutons, le cycle de vie commun, le son et les poses. `src/easter-scenes.js` construit les accompagnements graphiques. `src/menu-easter-eggs.js` associe les références du menu aux neuf familles. Leurs styles sont dans les trois fichiers CSS de même nom.

Le module est chargé avant `src/experience.js`. Les huit boutons existants du lanceur restent réservés à l’ouverture du concierge. Les textes de la scène, actions accessibles et noms de plats sont localisés via la compilation et `window.SCH_I18N`. Les clés et IDs de contenu sont conservés.

La V10 possède huit langues, soit 64 pages statiques. Les sept catalogues traduits ont un contrat de 1 380 chaînes chacun. La compilation est assurée par `scripts/localize-site.mjs`, avec les huit HTML français comme source ; les scripts et HTML générés ne doivent pas être corrigés séparément.

Le titre photographique français du restaurant est remplacé, dans les pages traduites, par `/locales/{lang}/restaurant-lettering.svg`. Son `data-original-src` conserve `/assets/collage/restaurant-lettering.webp`. La détection des motifs et du menu utilise cet attribut en priorité, pour rester stable lorsque le navigateur choisit un fichier `srcset` optimisé.

## Médias photographiques et provenance

| Média | Source servie conservée | Dimensions de l’original WebP | Provenance |
| --- | --- | --- | --- |
| Chien donnant la patte, hérité de V8 | `public/assets/collage/bernard-paw.webp` | 1254 × 1254 | `easter-dog-asset.json`, PNG dans `asset-sources/`. |
| Concierge faisant un clin d’œil | `public/assets/collage/concierge-wink.webp` | 800 × 1200 | `easter-v9-sprites.json`, PNG dans `asset-sources/`. |
| Fourchette à fondue et pain | `public/assets/easter/fondue-fork.webp` | 640 × 640 | `easter-v9-sprites.json`, PNG dans `asset-sources/`. |
| Postier jaune à barbe blanche | `public/assets/collage/postman-friendly.webp` | 1200 × 1200 | `postman-friendly-prompt.json`, PNG dans `asset-sources/`. |

Ces images ont été générées avec l’outil image_gen intégré, puis encodées en WebP en conservant l’alpha. Le chien, le concierge et le postier sont des variantes depuis leurs images de référence. La fourchette est un nouveau visuel. Le contour blanc et l’éclairage chaleureux restent cohérents avec le collage ; les personnages ne sont pas présentés comme des employés réels.

Les prompts complets, références, transformations mécaniques, dimensions et observations visuelles restent dans leurs documents de provenance. La pose du concierge est suffisamment proche pour un fondu court, mais n’est pas décrite comme une retouche pixel à pixel. Le postier conserve le cadrage et l’espace du bouton entre les mains.

Les 45 photographies de plats et de boissons gardent les documents `menu-photos-food-a.json`, `menu-photos-food-b.json` et `menu-photos-drinks.json`. Ce sont des illustrations ; la présentation servie peut varier. Les photos historiques de l’hôtel conservent les droits et réserves du contenu fourni dans `source-html/LISEZMOI-original.md`.

## Audio et licence

Le seul enregistrement externe est `public/assets/easter/cow-moo.mp3` : **« Cow moos #4 » de Joseph SARDIN, BigSoundBank, licence CC0**. La source et la licence déjà vérifiées sont documentées dans [easter-audio-sources.md](easter-audio-sources.md) et `easter-audio-sources.json`.

- [Page de l’enregistrement](https://bigsoundbank.com/cow-moos-4-s2384.html).
- [Conditions de licence de l’éditeur](https://bigsoundbank.com/licenses.html).
- [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/).

Le fichier fait **35 467 octets**, pour **2,88 secondes d’audio décodé**. Le pic a été ramené à −8 dBFS, avec de petits fondus aux extrémités ; le volume de lecture est 0,7, sans boucle. Ce son n’est pas présenté comme un enregistrement effectué en Suisse.

Cloche, cor, sifflement du train, verres et oblitération utilisent de brefs sons Web Audio synthétisés localement. Le contexte audio est créé uniquement après une activation. Aucun service audio externe n’est appelé.

## Poids mesurés et chargement

Les valeurs ci-dessous proviennent du manifeste [performance-assets.json](performance-assets.json) et des fichiers au 24 octobre 2026 :

| Média | Octets de l’original | Variante utilisée par le runtime |
| --- | ---: | --- |
| Patte du chien | 184 108 | 640 px, 54 288 octets |
| Clin d’œil du concierge | 185 188 | 480 px, 66 006 octets |
| Fourchette à fondue | 33 276 | 320 px, 10 968 octets |
| Nouveau postier | 148 732 | `srcset` : 320, 640, 960 et 1200 px ; candidat 320 px de 19 140 octets, 640 px de 50 476 octets |
| Meuglement | 35 467 | MP3 inchangé, chargé à la demande |

Les deux nouveaux sprites clin d’œil + fourchette représentent **218 464 octets d’originaux**, contre **76 974 octets pour leurs deux variantes runtime actuelles**. Le postier est un remplacement d’image dans une section existante, pas une quatrième animation à précharger globalement.

Les variantes sont générées par `scripts/optimize-images.py` : WebP, qualité 84, réduction Lanczos sans agrandissement, alpha conservé, SHA-256 des originaux inchangé. Un dérivé plus lourd que l’original est écarté ; une variante mobile existante plus légère peut être réutilisée. Les images affichées déclarent `srcset` et `sizes`, et les scènes servent les variantes adaptées à leurs dimensions. Les chemins des candidats runtime sont absolus depuis la racine, pour fonctionner également sous les préfixes de langues.

**Ces valeurs sont des tailles statiques de fichiers.** Elles ne mesurent ni les transferts réels du navigateur, ni le cache, ni un score Lighthouse, ni les Core Web Vitals. La sélection dépend du viewport, du DPR, des dimensions déclarées et du chargement différé.

## Autres modifications autorisées dans les HTML

L’inventaire V10 décrit explicitement les modifications associées à cette passe :

- Crédit `https://cerfalunettes.ch` dans les huit pieds de page.
- Sous-texte du lanceur : « Vous avez une question ? ».
- `sizes` du blason d’en-tête : `(max-width:760px) 209px, 270px`, en accord avec l’agrandissement ×2 et le débordement sous l’en-tête.
- Remplacement du postier de l’accueil par `postman-friendly.webp`.

L’ancien indicateur `only_footer_credit_changed` ne décrit donc plus cette version. Il est remplacé par une liste `authorized_html_changes` dans l’inventaire.

## Validation et état de livraison

**La validation finale responsive et performance V10 est en cours.** Les compteurs de l’inventaire et les mesures du manifeste sont des contrôles statiques. Ils ne suffisent pas à affirmer que les 64 pages ont été validées dans chaque navigateur et chaque langue.

Les contrôles V8 documentés dans `easter-build-verification.json`, `easter-mobile-proof.jpg` et la documentation audio restent un historique pour les trois premiers motifs : activation au clavier/toucher, interruption, décodage du MP3 et mode réduit. Ils ne constituent pas des résultats de validation du périmètre V10 étendu.

La passe finale doit consolider le rendu mobile et bureau, les menus de langue, les collisions avec l’en-tête agrandi, les boutons du concierge, le lien tenu par le postier, les variantes de galeries, les modes réduits, les sons et l’arrêt des scènes. Les éventuels rapports doivent indiquer les actions réellement observées et leurs limites. Aucun essai de réservation réelle ni aucun envoi de formulaire n’est nécessaire pour ces contrôles.

`src/seo-config.json` conserve `indexable: false` et `audience: "owner-private"`. Le passage vers une production publique nécessite la remise de la configuration d’origine, de la visibilité et des rapports finaux. **Ce document n’annonce aucun déploiement V10.**
