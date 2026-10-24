# Schützen · Sept pages de cartes postales suisses

## Périmètre actif

La refonte reprend le site HTML complet fourni dans `hotel-schuetzen-site.zip`. Les sept fichiers HTML à la racine sont les entrées actives de Vite. Ils chargent la base `public/css/site-base.css`, les données `public/js/data.js`, les interactions `public/js/site.js` et le module `src/postcard-motion.js`, qui importe `src/postcard.css`.

Le contenu reste dans le HTML. Framer Motion anime les éléments décoratifs via son API DOM ; aucune application React ne remplace les pages ni leur navigation. Les anciens composants `SwissCollageApp`, `JourneyApp` et leurs variantes ne définissent plus le rendu actif.

Ce document décrit les sources et les comportements prévus. Les observations de navigateur, résultats de construction et limites de vérification relèvent de [VERIFICATION.md](VERIFICATION.md).

## Direction graphique

Le site devient un carnet de vacances à Lauterbrunnen : papier crème, vert sapin, rouge suisse, petits accents dorés, Vichy rouge et blanc. Les photos de l’hôtel et de la région composent des cartes postales légèrement inclinées, avec bord blanc, ruban adhésif, légendes manuscrites, timbres et cachets. Les titres en Georgia donnent une présence éditoriale ; Manrope sert à la lecture et aux commandes, et Cormorant italique aux notes.

Chaque page possède sa composition d’ouverture. Les découpes photoréalistes sont des clins d’œil décoratifs : Saint-Bernard, vache à cloche, géraniums, cabine rouge, convives autour d’une fondue, train et edelweiss. Les branches de sapin et le Vichy donnent la touche festive. Les informations de séjour, photographies et actions restent lisibles et prioritaires.

Le défilement est naturel. Il n’y a plus de cascade qui s’ouvre, de travelling vers le chalet, de vidéo de fondue, de rideau entre les pages ni de défilement forcé.

## Pages et parcours

| Page | Contenu principal conservé | Parcours |
| --- | --- | --- |
| `index.html` | Accueil « La Suisse, comme on la rêve », trois cartes de découverte, présentation de la maison, sélection de chambres, restaurant et excursions. | Découvrir les pages internes, choisir ses dates ou parcourir les détails. |
| `chambres.html` | Neuf catégories réparties entre doubles, familles et solo/budget ; surfaces, capacités, équipements, descriptions et photos. | Ancres de catégories, miniatures, galerie agrandie, choix de chambre puis calendrier. |
| `restaurant.html` | Horaires, spécialités, carte à manger/à boire, informations de groupes. | Onglets de carte, accordéons, accès aux demandes de groupe. La politique de table fournie est conservée. |
| `vallee.html` | Staubbach, Trümmelbach, Mürren, Jungfraujoch, Wengen, Schilthorn, Kleine Scheidegg, lacs, Bachalpsee ; trajets et saisons. | Ancres et liens vers les ressources touristiques fournis. |
| `maison.html` | Histoire, valeurs, repères et galerie du lieu. | Photos agrandies et continuité vers les autres pages. |
| `infos.html` | Contacts, arrivée/départ, services, accès, distances et FAQ. | Téléphone, e-mail, copie de coordonnées, itinéraire, liens de transport et concierge. |
| `reservation.html` | Choix du séjour, résumé, possibilités de réservation externe, restaurant et formulaire de groupe. | Préparer le séjour, consulter une offre externe ou ouvrir une demande par e-mail. |

L’en-tête commun, le menu mobile, les barres d’ancres, les liens de poursuite de visite et le pied de page relient les sept pages. Les URLs HTML d’origine et les identifiants utiles des sections sont conservés. Le catalogue de chambres original fonctionne par ancres ; il ne possédait pas de filtre de catalogue séparé.

Le site complet est en français (`fr-CH`). Les libellés allemands ponctuels sont des éléments éditoriaux du thème suisse, pas une traduction de l’interface. Les versions FR/EN/DE de la proposition courte restent dans `/version-collage/`.

## Réservation, formulaires et concierge

`public/js/data.js` conserve les données `window.SCH` du ZIP, notamment chambres, FAQ, liens et identifiants Booking. Le séjour est mémorisé dans `localStorage`, sous `sch.booking`. Le calendrier contrôle la validité des dates ; les compteurs gèrent adultes, bébés et chambres. Les âges des bébés sont demandés et transmis dans les paramètres Booking, au lieu de l’âge unique utilisé dans le script fourni.

Les liens externes reprennent les dates et les paramètres de séjour. Les alertes de capacité utilisent les capacités fournies. Le champ `site.availability` étant vide, le site n’annonce pas de disponibilités issues d’un inventaire réel et ne calcule pas les tarifs. Une intégration de disponibilité nécessiterait un service serveur et sa configuration explicite. Le site actuel ne confirme pas de réservation et ne traite pas de paiement.

La demande de groupe vérifie les coordonnées, le nombre de personnes et la date éventuelle. Elle produit un brouillon que le visiteur peut modifier, copier ou ouvrir dans sa messagerie. Aucun envoi serveur n’a lieu. Les plafonds et options du formulaire sont ceux du fichier fourni et doivent être maintenus avec le contenu hôtelier.

Le concierge est un guide local à réponses prédéfinies : il oriente vers les chambres, dates, horaires, accès et excursions. Ses réponses de disponibilité invitent à consulter Booking ou Google ; elles ne constituent pas un inventaire en direct. Il ne transmet pas la conversation à un employé de l’hôtel.

## Médias et provenance

Les médias d’origine du ZIP sont dans `public/img/`, avec leurs variantes mobiles, le logo et les icônes. Leur réutilisation dans les cadres de papier n’altère pas les fichiers. Les données métier du ZIP sont conservées à l’identique dans `public/js/data.js`.

Les sept découpes WebP avec transparence sont dans `public/assets/collage/`. Elles ont été créées pour le décor photographique ; elles ne documentent pas des clients, animaux ou équipements actuels de l’hôtel. Le train et l’edelweiss complètent les cinq découpes précédentes. Les prompts récents figurent dans [postcard-asset-prompts.json](postcard-asset-prompts.json) ; les autres sont documentés dans `collage-animal-assets.md`, `collage-decoration-assets.md` et `collage-table-asset.md`.

La provenance et les réserves du site fourni restent dans [source-html/INVENTORY.md](source-html/INVENTORY.md) et [source-html/LISEZMOI-original.md](source-html/LISEZMOI-original.md). Le document original indique notamment une attribution indicative des photos aux catégories de chambres, des vérifications de droits sur certaines images publiées par des visiteurs, une carte saisonnière et des coordonnées à confirmer. Ces réserves sont des points de maintenance internes ; la refonte ne constitue pas une nouvelle validation de ces faits.

## Mouvements, mobile et accessibilité

`src/postcard-motion.js` cible les éléments `data-paper`. Pour chaque découpe, `animate` construit une transformation et `scroll` la lie au passage de sa section, de `start end` à `end start`. Les attributs `data-paper-y` et `data-paper-rotate` règlent le déplacement et la rotation. Les amplitudes verticales sont divisées par deux lorsque la composition est initialisée à une largeur mobile. Les animations sont nettoyées au changement de page et restaurées au retour depuis le cache du navigateur.

`prefers-reduced-motion` et `?motion=reduce` désactivent les mouvements décoratifs et les transitions concernées. Les textes, photos, liens et commandes restent disponibles. La préférence système est aussi écoutée par le module de mouvement. Les cadres disposent de légers retours au survol ; la lecture ne dépend pas d’une animation d’apparition.

Le CSS adapte les compositions, cartes, tableaux et commandes aux petits écrans. Les photographies principales sont prioritaires et les images secondaires utilisent les attributs de chargement du HTML. Le lien d’évitement, les libellés et les styles de focus sont conservés.

Les fenêtres de réservation, la galerie et le menu mobile contiennent le focus et rendent leur arrière-plan inerte pendant leur ouverture. Échap ferme la fenêtre et le focus revient au contrôle d’origine. La galerie possède des commandes précédent/suivant, les flèches clavier et le balayage tactile. Le calendrier garde le focus après un changement de mois ou de date. Les onglets du restaurant disposent d’un seul arrêt de tabulation et des commandes flèches, Début et Fin. Le concierge est modal sur mobile et non modal sur ordinateur. Voir [INTERACTION_CHANGES.md](INTERACTION_CHANGES.md) pour les détails du JavaScript.

## Construction, référencement et archives

`npm run build` produit un export statique multipage dans `dist/`, à partir des sept entrées de `vite.config.js`. Les médias et scripts de `public/` sont copiés dans l’export. Aucune préparation d’images ou génération de film n’est nécessaire pour reconstruire le site.

Cette version privée utilise `noindex,nofollow` sur les pages et `Disallow: /` dans `robots.txt`. Les métadonnées, canonical et données structurées du domaine hôtelier proviennent de la source. Avant une mise en production publique, mettre en cohérence textes, données métier, horaires, carte saisonnière, coordonnées, métadonnées et `llms.txt`, puis décider de l’indexabilité pour le domaine retenu. L’accès privé est géré par l’hébergement, distinctement des directives destinées aux robots.

Les exports historiques sont conservés à `/version-collage/`, `/version-fondue/` et `/version-2/`. Le premier possède ses JS/CSS compilés mais utilise les images et polices stables de `/assets/` ; ne pas supprimer ou remplacer ces médias communs sans vérifier les archives. `README-v5.md` et `SCENARIO-v5.md` décrivent la proposition courte antérieure. L’essai cinématique non publié demeure archivé séparément et ne fait pas partie des entrées actives.

Les contrôles avant livraison couvrent les sept pages, les ancres, les liens de réservation, les dates et âges, le formulaire de groupe, les galeries, les onglets, le menu mobile, le clavier, les médias et le mouvement réduit. Consigner uniquement les résultats effectivement constatés dans `VERIFICATION.md`.
