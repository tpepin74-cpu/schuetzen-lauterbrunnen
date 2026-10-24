# Vérification V7 — 24 octobre 2026

## Périmètre

Huit pages HTML actives : accueil, chambres, restaurant, idées de séjour, vallée, chalet, informations et réservation. Revue de lisibilité, navigation, collage photographique, concierge guidé et nouveaux parcours de séjour. Les anciennes versions restent archivées.

## Construction et intégrité

- Construction finale de production par le helper officiel Sites / Vite : code de sortie 0, 429 modules traités.
- Syntaxe JavaScript et `git diff --check` vérifiés.
- Audit des huit sources HTML : aucun identifiant dupliqué ; les 45 noms, descriptions et prix de la carte sont conformes à son manifeste. Catalogue de huit catégories après les corrections des chambres.
- Audit final de `dist/` : 934 références locales, 136 ancres ; huit entrées HTML ; aucune référence cassée ni identifiant dupliqué. Les 45 photos de la carte, les données, le script métier et la feuille de base sont présents.
- Les avertissements Vite concernant les scripts classiques, la feuille CSS du dossier public et les directives `use client` de Framer Motion ne bloquent pas la construction. Les fichiers concernés sont bien copiés dans le résultat statique.
- 112 photographies originales sur 112 identiques au ZIP fourni. Les 45 prix de carte sont inchangés. Dans `public/js/data.js`, seules les corrections de chambres demandées par l’utilisateur modifient les données fournies : Familiale à 5, détail des couchages des deux familiales, retrait Basic. Les autres données métier sont identiques (comparaison structurée).
- Aucun écran de QA ni cache Python temporaire dans les fichiers publiés.

## Vérifications dans le navigateur

Contrôles dans le navigateur de prévisualisation : fenêtre ordinateur de 1348 px utiles, tablette à 768 px et cadres mobiles de 390 et 360 px. Il s’agit de vérifications de mise en page dans Chromium, pas de tests sur appareils iOS/Android physiques.

- Logo initial mesuré à 171 px de haut sur ordinateur et 132 px sur téléphone ; réduction visuelle au défilement pour conserver une navigation compacte. Wordmark retiré et Accueil ajouté.
- Les nouvelles formulations, la suppression de la ligne de localisation et de Feuilleter le carnet, ainsi que le retrait des statistiques d’accueil sont contrôlés.
- Texte courant à 17–18 px, actions principales à 16 px, informations secondaires généralement à 14–16 px. Navigation mobile à 13–14 px selon la largeur. Les inscriptions purement décoratives des timbres ne portent pas d’information essentielle.
- Agrandissement du texte à 200 % simulé sur l’accueil, et espacements utilisateur testés. Correction des retours à la ligne, du lien d’évitement, des cartes touristiques et de la hauteur de navigation. Ce contrôle ciblé n’est pas un audit WCAG exhaustif.
- Plan d’accès complété par des repères textuels lisibles, affichés à la place du petit schéma sur mobile.
- Concierge mobile ouvert à 360 et 390 px : choix, retour au menu, fermeture par Échap et retour du focus au déclencheur vérifiés. Pas de clavier affiché automatiquement à l’ouverture.
- Parcours concierge « Imaginer mon séjour » → cascades → réservation vérifié. L’idée choisie est affichée sur la réservation. Les dates et la composition existantes (deux adultes et un bébé dans le jeu de vérification) sont conservées.
- Favori ajouté sur une page séjour, retrouvé dans Mon carnet sur l’accueil, puis retiré. Le retrait laisse l’état vide attendu. Défilement du carrousel mobile et filtre vérifiés.
- Panneau de réservation ouvert depuis la carte postale ; calendrier, voyageurs et accès aux prestataires présents. Aucun paiement, message ou réservation réelle effectué.
- Le grand déclencheur du concierge évite les commandes de réservation et de contact lorsqu’elles se trouvent sous sa position habituelle.
- Bandeau Notre restaurant, carte postale en relief et postier photographique vérifiés. Bouton postal à 16 px et 73 px de haut dans le cadre de 390 px, placé entre les mains du personnage.
- Lien du postier dirigé vers la page officielle française PostCard Creator de La Poste. Aucune API postale ni fonction d’envoi interne ajoutée.

## Dernières demandes — Vallée et calendrier

- Dans La Vallée, les sections `trajets` et `saisons` sont supprimées. Le navigateur confirme les trois sections restantes (`top`, `incontournables`, `liens`) et les neuf cartes de découverte. Les liens de navigation et du concierge vers les sections retirées ont été corrigés.
- Le bouton « Effacer les dates » a été vérifié dans le calendrier de la page et dans le panneau global. Les deux calendriers présents sur une même page se synchronisent.
- Cas observés : arrivée seule, départ valide, troisième clic qui redéfinit l’arrivée, 30 nuits acceptées, 31 nuits refusées, message persistant et lien téléphonique, nouveau clic après dépassement, effacement après dépassement.
- Après effacement, les dates et les paramètres de dates des liens prestataires disparaissent. Deux adultes, un bébé de deux ans et la Double Supérieure du jeu de vérification sont conservés.
- À 360 et 390 px, bouton d’effacement à 16 px et 48 px de haut ; aucun élément du calendrier contrôlé hors du cadre. Les deux blocs de dates restent côte à côte en adaptant les retours à la ligne.
- Capture `v7-calendar-mobile.jpg` : message de limite et sélection complète sur deux tailles de mobile.

## Carte photographique

- 45 photos d’illustration intégrées : 29 références de plats et 16 références de boissons. Chaque fichier a été inspecté visuellement par l’agent chargé de sa création, puis contrôlé pour ses dimensions et son alpha.
- WebP qualité 84, bord maximal 640 px, alpha réel 0–255 ; poids total 3 465 418 octets. Dimensions intrinsèques renseignées, chargement différé et décodage asynchrone.
- Fonds et éclairage cohérents, contour blanc, légères inclinaisons et touches de Vichy rouge. Fondue, raclette, rösti du paysan et bratwurst prennent les photographies originales comme références.
- Grille observée : trois colonnes sur ordinateur, deux à 768 px, une à 360 et 390 px. Noms à 19 px, descriptions à 16 px, prix à 18 px ; contenu des cartes flexible, sans hauteur de texte imposée.
- Les onglets À manger / À boire, l’ouverture et la fermeture des catégories et le chargement de plusieurs photographies de chaque onglet ont été vérifiés.
- Sur mobile à 200 % avec espacements personnalisés, aucun texte des cartes ouvertes ne dépasse du cadre. Le tarif à quatre valeurs du rosé reste lisible et se répartit sur plusieurs lignes. Les photos ne sont pas recadrées.
- Le déclencheur du concierge prend en compte les zones de texte de la carte pour choisir sa position ; son cadre s’agrandit avec le texte. À 200 %, titre et sous-titre restent dans son bouton.
- Le texte « Photographies d’illustration ; la présentation peut varier. » distingue les nouveaux visuels des photographies originales du lieu.
- Manifestes et provenance : `menu-photos-food-a.json`, `menu-photos-food-b.json`, `menu-photos-drinks.json`, `menu-assets-verification.json`.

## Corrections finales des chambres

- Catalogue actif ramené à huit catégories, avec 25 chambres annoncées au total. Basic Randonneur supprimée du catalogue, des neuf sélecteurs, du concierge et du JSON-LD actif ; huit fiches restent disponibles.
- Familiale de 27 m² : cinq personnes, un lit simple, un lit superposé et un grand lit double. Capacité du sélecteur et de la vérification de voyageurs portée à cinq.
- Familiale Supérieure de 29 m² : quatre adultes maximum, six couchages, deux lits superposés et un grand lit double. La capacité adulte reste quatre, y compris dans les données structurées.
- Vérification navigateur : huit fiches ; sélecteurs avec les huit catégories ; Familiale acceptée pour cinq adultes ; Supérieure signalée pour cinq adultes et alternative Familiale proposée. Le lien Booking préparé utilise cinq adultes et la référence existante de la Familiale (`RD6627414`). Aucune réservation réelle effectuée.
- Réponse du concierge vérifiée dans le navigateur : les deux familiales et leurs capacités exactes sont présentées. La Basic n’est plus proposée en solo. À 360 et 390 px, les nouvelles informations de capacité et de lits restent dans les cadres de leurs fiches.
- `room-corrections-v7.json` consigne les différences de données. Les originaux et versions archivées restent conservés.

## Contrastes de la palette principale

Calcul sRGB selon la formule de luminance WCAG, pour les aplats indiqués. Les rapports ne constituent pas un audit de chaque photographie ou état interactif.

| Texte / fond | Rapport |
| --- | ---: |
| Vert `#193a2d` / crème `#f8f4e9` | 11,34:1 |
| Texte secondaire `#526052` / crème | 6,06:1 |
| Texte `#344d40` / crème | 8,37:1 |
| Blanc `#fffdf7` / rouge `#b92e2d` | 5,91:1 |

Références consultées : [redimensionnement du texte](https://www.w3.org/WAI/WCAG22/Understanding/resize-text.html), [espacements du texte](https://www.w3.org/WAI/WCAG22/Understanding/text-spacing.html), [contraste minimal](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).

## Captures de contrôle

- `v7-home-header.jpg` : accueil, logo et hiérarchie.
- `v7-mobile-restaurant-concierge.jpg` : restaurant à 390 px et concierge à 360 px.
- `v7-postcard-relief.jpg` : carte postale, épaisseur de papier et coin relevé.
- `v7-postier-desktop.jpg` et `v7-postier-mobile.jpg` : personnage et vrai lien HTML tenu entre les mains.
- `v7-menu-mobile.jpg` : photos, noms, descriptions et prix sur 390 et 360 px.
- `v7-menu-desktop.jpg` : première rangée des spécialités en trois colonnes.

## Limites réelles du produit

Le concierge suit des réponses prévues ; aucune personne ni aucun modèle de langage n’est connecté en direct. Les séjours sont des suggestions éditoriales, sans activités ou transports inclus. Les favoris et le séjour sont mémorisés sur l’appareil. Les disponibilités, prix et confirmations restent chez les prestataires de réservation. Le formulaire de groupe prépare un message dans la messagerie du visiteur.

La version conserve son audience privée et son référencement `noindex,nofollow`. Il n’est pas revendiqué de conformité WCAG complète ; les lecteurs d’écran et les appareils physiques restent hors du périmètre de cette passe.
