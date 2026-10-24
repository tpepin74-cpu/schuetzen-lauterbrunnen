# Schützen · Parcours et direction graphique V7

Ce document décrit les sources actives et leur comportement prévu. Les résultats de navigateur, de construction et de publication relèvent de [VERIFICATION.md](VERIFICATION.md).

## Un catalogue de découverte, mis en scène comme un carnet

Le site reprend les photographies, informations hôtelières et parcours du HTML fourni, avec les corrections de chambres explicitement demandées par l’utilisateur. Les huit entrées de Vite chargent `public/css/site-base.css`, `public/js/data.js`, `public/js/site.js` et `src/postcard-motion.js`. Le contenu principal reste dans le HTML. Framer Motion déplace les découpes décoratives ; il ne remplace ni le défilement natif, ni la navigation entre pages.

Le vocabulaire visuel associe papier crème, vert sapin, rouge suisse et Vichy rouge. Cadres blancs, petites inclinaisons, rubans et cachets évoquent une carte postale. Les photographies de l’hôtel restent authentiques ; Saint-Bernard, vache, géraniums, téléphérique, fondue, train, edelweiss, cloche, cor des Alpes, chaussures et luge forment le décor. Les personnages du concierge et du postier sont fictifs.

L’ouverture conserve « La Suisse, comme on la rêve ». Le logo est agrandi à 171 px sur ordinateur et 132 px sur mobile, soit trois fois la hauteur précédente, puis se réduit visuellement au défilement. Le libellé adjacent est retiré. Le menu principal comprend Accueil, Chambres, Restaurant, Idées de séjour, La vallée, Le chalet et Infos & accès.

## Parcours de l’accueil

| Section | Intention et action |
| --- | --- |
| Hero et ticket | Donner envie, choisir une chambre et consulter les disponibilités. Le ticket affiche « Réservez votre séjour ». Le lien « Feuilleter le carnet » et la petite ligne de localisation ont été retirés. |
| Concierge en ligne | Six entrées directes : chambre, séjour, réservation, fondue, arrivée et question pratique. |
| Trois façons d’apprécier votre séjour | Rejoindre les chambres, le restaurant ou la vallée. |
| Idées de séjour | Filtrer six envies, consulter leur détail et conserver une idée dans le carnet local. |
| Présentation du chalet | Découvrir le lieu avec le bouton « Découvrez le chalet ». |
| Les chambres qui vous attendent | Consulter les catégories présentées et accéder au catalogue complet. |
| Restaurant | Lettres photographiques découpées « Notre restaurant », photographie du lieu, convives, horaires et spécialités. |
| La vallée | Poursuivre la découverte des lieux autour de Lauterbrunnen. Le bandeau statistique a été supprimé. |
| Grande carte postale | Préparer une réservation dans un cadre de papier avec relief, ombre, coin relevé et légende. |
| Postier jaune | Ouvrir le service officiel PostCard Creator avec le bouton tenu entre ses mains. Le texte du bouton est du HTML accessible, pas du texte imprimé dans l’image. |

Le pied de page commun affiche « Hâte de vous accueillir au Schützen ». Les textes de l’établissement utilisent « chalet » ou « hôtel-restaurant ». La route historique `maison.html` reste inchangée pour préserver les liens.

## Catalogue des chambres

Le catalogue actif compte **8 catégories** et conserve le total de **25 chambres de chalet**. Les capacités et la composition des chambres familiales suivent les corrections utilisateur :

| Catégorie | Surface | Capacité | Literie |
| --- | --- | --- | --- |
| Familiale | 27 m² | 5 personnes | 1 lit simple, 1 lit superposé et 1 grand lit double. |
| Familiale Supérieure | 29 m² | 6 couchages, 4 adultes maximum | 2 lits superposés et 1 grand lit double. |

**Basic Randonneur** est retirée du catalogue et des réservations actifs. Les choix proposés et les données `window.SCH` doivent refléter ces huit catégories ; ils ne constituent donc plus une copie à l’identique des données d’origine. Le nombre de couchages de la Familiale Supérieure ne doit pas être présenté comme une capacité de six adultes.

## Carte du restaurant et page Vallée

Le titre du restaurant est « L’appétit, les amis, la vie. ». La carte comprend 45 lignes (29 plats, 16 boissons) illustrées chacune par une photo découpée à liseré blanc, servie en WebP transparent. Les photos constituent des suggestions de présentation, pas une documentation des assiettes réellement servies. La mention correspondante reste lisible sous la carte. Les références combinées de boissons conservent leur regroupement d’origine.

Les onglets À manger / À boire et les catégories repliables permettent de parcourir l’ensemble. La grille utilise trois colonnes sur grand écran et se réorganise pour la tablette et le téléphone. Les découpes peuvent légèrement se redresser au survol ; les textes restent immobiles. Les noms, descriptions, régimes, prix, contenances et provenances ne sont pas remplacés par du texte dans les images.

La page Vallée conserve les neuf cartes « Neuf façons de s’émerveiller » ainsi que les liens utiles. Les anciennes sections Trajets et Saisons sont supprimées avec leurs ancres. Le concierge renvoie désormais vers les incontournables ou les idées de séjour.

## Les six inspirations

`src/stays.json` contient titres, saisons, durées suggérées, photographies, étapes, conseils et URL sources. `sejours.html` présente une section par envie : à deux, en famille, cascades, randonnée, sans voiture et hiver. Les durées de deux ou trois nuits sont des choix éditoriaux, pas une offre incluant les excursions.

Depuis l’accueil, les filtres répartissent les cartes par ambiance. Sur mobile, un rail à défilement horizontal natif et deux flèches permettent de les parcourir. Le marque-page ajoute ou retire une idée ; le filtre « Mon carnet » les retrouve sur le même appareil. Les identifiants sont limités à ceux du JSON. Si le stockage du navigateur est indisponible, le carnet fonctionne pour la visite en cours.

Les liens de réservation utilisent `reservation.html?sejour=<id>`. Un identifiant reconnu ajoute un rappel de l’idée et un lien de retour à son détail. Il ne modifie pas les dates, les voyageurs ou la chambre déjà préparés. Les activités et transports sont explicitement à organiser séparément. Voir [TOURISM_SOURCES.md](TOURISM_SOURCES.md).

## Le concierge et la réservation

Le concierge possède un grand portrait photographique découpé, un déclencheur visible sur ordinateur et une entrée dans la navigation mobile. Son panneau propose réponses, choix et liens vers le site, avec historique, Retour et Recommencer. Les questions hors parcours sont orientées vers les coordonnées réelles de réception. Aucun appel à un modèle de langage ni transfert de conversation n’est réalisé.

La réponse peut proposer des catégories de chambres ou un séjour, puis renvoyer vers la page appropriée. Elle ne remplace pas la vérification de disponibilité. Le panneau est modal sur mobile, avec arrière-plan inerte, confinement du focus et retour au déclencheur à la fermeture ; il reste non modal sur ordinateur. L’ouverture ne doit pas déclencher automatiquement le clavier logiciel.

La sélection des dates suit une boucle arrivée → départ → nouvelle arrivée. Une seconde date dépassant 30 nuits affiche le contact de la réception et prépare le prochain clic comme une nouvelle arrivée. « Effacer les dates » réinitialise uniquement arrivée et départ, dans tous les calendriers présents sur la page ; la chambre, les voyageurs et les âges sont conservés. Les boutons et les libellés des prestataires se resynchronisent.

La réservation utilise les données `window.SCH` corrigées selon les indications utilisateur, notamment les capacités familiales et le retrait de Basic Randonneur. Dates, voyageurs, bébés, âges et chambre sont préparés localement. Booking, Google et les contacts restent les destinations finales. Aucun prix en temps réel, inventaire disponible, paiement ou confirmation n’est produit sur le site. Le formulaire de groupe prépare un brouillon modifiable puis ouvre la messagerie du visiteur.

## Mobile, lecture et mouvements

La navigation fixe du bas comporte **Accueil, Séjours, Chambres, Concierge et Réserver**. Sa hauteur réelle est mesurée pour ménager l’espace nécessaire sous le contenu, même avec du texte agrandi. Le menu détaillé reste accessible en haut. Les contrôles principaux ont des zones tactiles généreuses et des focus visibles.

`src/readability.css`, chargé après les styles de composition, porte les paragraphes courants à 17–18 px et les commandes principales à 16 px. Les libellés, prix, horaires, notes de réservation et informations de pied de page ont des règles dédiées. Les légendes purement décoratives ne portent pas d’information essentielle. Dans Infos, une liste textuelle remplace le plan schématique réduit sur petits écrans.

Les choix de conception tiennent compte des recommandations W3C sur [l’agrandissement du texte](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [les espacements personnalisés](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html) et [le contraste](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html). Ces documents ne prescrivent pas une taille unique de 16 px et la refonte ne revendique pas un audit complet ou une certification WCAG.

Les attributs `data-paper-y` et `data-paper-rotate` règlent les déplacements des découpes. Les amplitudes sont modérées sur mobile. Le portrait du concierge effectue un bref accueil, sans animation continue nécessaire à la lecture. `prefers-reduced-motion` et `?motion=reduce` désactivent les mouvements concernés. Il n’y a pas de travelling, de cascade qui s’ouvre ou de défilement forcé.

## Sources, reconstruction et archives

Les **112 images originales restent inchangées**. `public/js/data.js` conserve sa fonction de source des données actives, avec les corrections utilisateur apportées aux chambres ; son contenu n’est plus identique à l’original. Les médias générés sont des décors ou des photographies culinaires d’illustration ; ils ne documentent pas des clients, employés ou assiettes actuellement servis. Les prompts récents sont consignés dans `swiss-cutout-prompts-v7.json`, `restaurant-lettering-prompt.json` et `postman-prompt.json`.

Le script `scripts/enrich-postcards.py` régénère la page Séjours et les blocs communs marqués V7 à partir du JSON, de l’accueil et du fragment de concierge. Les modifications éditoriales hors de ces blocs restent dans les HTML. Construire avec Vite une fois les sources stabilisées ; le helper d’hébergement gère la synchronisation et la publication.

Cette version conserve son accès privé et les directives de non-indexation. Avant une publication publique sur le domaine hôtelier, revoir ensemble les coordonnées, horaires, carte saisonnière, métadonnées et données structurées provenant de la source. Les réserves originales figurent dans [source-html/LISEZMOI-original.md](source-html/LISEZMOI-original.md).

Les exports `/version-collage/`, `/version-fondue/` et `/version-2/`, ainsi que les documents V5 et V6, restent préservés. Ne pas supprimer leurs médias communs dans `/assets/`. Le présent scénario décrit l’implémentation ; les vérifications effectivement réalisées doivent être consignées séparément.
