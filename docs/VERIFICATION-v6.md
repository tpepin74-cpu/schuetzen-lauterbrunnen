# Vérification du site HTML complet — 24 octobre 2026

## Périmètre

Refonte des sept pages de l’archive `hotel-schuetzen-site.zip` dans la direction photographique « carte postale suisse » : accueil, chambres, restaurant, vallée, maison, informations et réservation. Les entrées actives sont les sept fichiers HTML racine. `src/postcard-motion.js` anime uniquement les découpes décoratives avec Framer Motion ; `public/js/site.js` conserve les interactions métier. L’ancien carnet monopage est archivé dans `public/version-collage/`. Ses résultats de vérification sont conservés dans `VERIFICATION-v5.md`.

## Conservation de la source

Audit détaillé : `PRESERVATION.md`.

- Les 112 images de la source sont présentes, avec des empreintes SHA-256 identiques.
- Les neuf catégories de chambres et leurs descriptions complètes sont conservées.
- Carte du restaurant, prix, provenance et mention été 2026 sont conservés.
- Histoire, FAQ, horaires, coordonnées, accès, excursions, appartement Grosshorn et conditions de séjour sont conservés.
- `public/js/data.js` est identique au fichier fourni.
- Aucun ID dupliqué, fichier local manquant, lien de page cassé ou fragment sans cible relevé lors de l’audit du HTML actif. L’ancien décor cascade `h-win` a été retiré ; aucun lien restant ne le vise.

## Vérification visuelle dans Chrome

Les essais ont utilisé l’aperçu de développement dans le navigateur et des cadres de 390 et 360 pixels de largeur de contenu. Ce sont des vérifications de mise en page responsive, pas des essais sur des téléphones physiques.

- Accueil sur ordinateur : hôtel original reconnaissable, légende dégagée, cartes inclinées, géraniums, Saint-Bernard, téléphérique, timbre, Vichy rouge et billet de réservation lisibles.
- Catalogue découverte : trois cartes photographiques, liens vers chambres, restaurant et vallée, vache décorative dans la marge.
- Restaurant sur ordinateur : photo de la vraie salle, tablée détourée, fondue, nappe Vichy et liens vers carte/horaires.
- Chambres sur ordinateur : hero, accès à la rubrique Doubles, fiches complètes, photos et boutons de réservation.
- Les sept pages ont été ouvertes dans les cadres mobiles ; titres, contenus et commandes principales restent lisibles.
- Absence de débordement horizontal observée sur les largeurs contrôlées, dont accueil à 390 et 360 pixels après les corrections des découpes. Restaurant et chambres également contrôlés sur ordinateur.
- Le paramètre de QA `?motion=reduce` active bien le rendu statique ; le contenu reste visible. La préférence système de réduction des mouvements utilise le même chemin d’activation.
- Les derniers messages de console inspectés concernent l’extension Chrome, sans erreur applicative observée dans cet échantillon.

Aucune mesure de fréquence d’affichage, aucun score Lighthouse et aucun résultat sur téléphone physique ne sont revendiqués.

## Interactions effectivement vérifiées

- Menu mobile : ouverture et navigation vers les chambres.
- Ancres : accès au catalogue de découverte, aux catégories de chambres et aux informations d’accès. Le gestionnaire de défilement explicite laisse le lien d’évitement « Aller au contenu » à la navigation native.
- Carte du restaurant : passage À manger / À boire et retour au clavier avec la flèche gauche.
- Calendrier : sélection du 26 au 29 octobre 2026 dans le panneau de réservation.
- Voyageurs : sélection Double Supérieure, avertissement à trois adultes pour une capacité de deux, retour à deux adultes, ajout d’un bébé et choix de l’âge de deux ans.
- Lien Booking.com : dates, deux adultes, un enfant, âge 2, devise CHF et identifiant de catégorie présents dans l’URL générée. Aucun lien de transaction ouvert et aucune réservation effectuée.
- Fermeture du panneau de réservation avec Échap : focus rendu au bouton Réserver.
- Galerie Double Supérieure : ouverture, passage de `sch-chambre.webp` à `sch-ch-12.webp`, fermeture avec Échap et retour au bouton d’agrandissement.
- Formulaire groupe : validation de la borne minimale (5 personnes refusées), brouillon valide pour 20 personnes, lien mailto généré et retour à l’édition via Modifier. Aucun message envoyé.
- Petit guide : ouverture, réponse Restaurant & horaires, commandes visibles et fermeture. Son panneau tient dans le cadre mobile.

Les fenêtres disposent de gestion du focus, d’une fermeture par Échap et d’un arrière-plan inerte dans l’implémentation. Le cycle complet de tabulation de chaque fenêtre n’a pas été testé séparément.

## Construction et contrôles de code

- `node --check public/js/site.js` : réussi.
- `node --check src/postcard-motion.js` : réussi.
- `git diff --check` : réussi.
- Helper officiel Sites `build-site.mjs` : réussi, 422 modules transformés, les sept pages générées.
- Bundle décoratif partagé : JavaScript 72,00 Ko / 25,65 Ko gzip ; CSS 50,34 Ko / 11,77 Ko gzip. Ces valeurs excluent les scripts métier et la feuille de base copiés depuis `public/`.
- Vite avertit que les scripts classiques `js/data.js` et `js/site.js`, ainsi que `css/site-base.css`, restent résolus à l’exécution. Ils sont volontairement servis comme fichiers statiques depuis `public/`.
- Les directives `use client` de Framer Motion ignorées par Vite émettent des avertissements sans empêcher la construction.
- La page temporaire de contrôle responsive est retirée du répertoire publié.
- Audit de `dist/` : 10 HTML (sept pages et trois archives), cinq CSS, six JS et 447 références locales contrôlés ; aucun fichier manquant. `qa-postcards.html` est absent de tout le dossier publié.

## Limites des intégrations et de la publication

Les disponibilités réelles restent fournies par les liens externes du site source ; aucun inventaire de chambres n’est simulé localement. Le formulaire groupe prépare un brouillon de courriel, et le petit guide répond à partir du contenu local. Les réserves de la source sur les droits de certaines photos et l’affectation indicative des vues de chambres sont conservées dans la documentation d’origine.

Cette version conserve l’audience privée du Site et ses directives de non-indexation. Les URL canoniques et données structurées du domaine d’origine sont conservées pour la reprise du projet ; elles devront être revues lors d’une éventuelle migration vers le domaine officiel.

## Captures

Captures réelles du navigateur, non retouchées :

- `postcards-home-final.jpg` : accueil sur ordinateur.
- `postcards-discovery-final.jpg` : catalogue découverte.
- `postcards-restaurant-final.jpg` : restaurant sur ordinateur.
- `postcards-rooms-final.jpg` : fiche de chambre sur ordinateur.
- `postcards-mobile-final.jpg` : accueil à 390 et 360 pixels, et mode de mouvement réduit.
