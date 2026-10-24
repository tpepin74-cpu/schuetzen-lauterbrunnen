# Vérification de la V10 — 24 octobre 2026

## Périmètre

Huit pages de référence, en français et dans sept traductions : allemand de Suisse, anglais, chinois simplifié, russe, coréen, italien et espagnol. La compilation produit 64 pages HTML autonomes. Les contrôles ont porté sur la sortie de production servie par l’aperçu officiel, dans Chromium.

## Rendu responsive

- Premier parcours : 192 cas, soit les 64 pages à 360, 768 et 1293 pixels réellement mesurés. Le banc demandait 1440 pixels pour le dernier format, mais sa première version réduisait l’iframe ; le rapport conserve les deux valeurs au lieu de présenter ce passage comme un vrai 1440 pixels.
- Aucun débordement horizontal de page, aucune image chargée en erreur et un H1 unique dans ces 192 cas.
- Un dépassement interne de 9 pixels provenait du pseudo-élément tourné des accordéons du restaurant. L’icône ouverte a été remplacée par un signe moins sans rotation.
- Après correction du banc et de l’accordéon : 80 cas supplémentaires, soit les huit restaurants à 360 et 768 pixels, puis les 64 pages à 1600 pixels réels. Aucun défaut mesuré dans ce passage.
- Contrôles ciblés du postier à 320 et 390 pixels, du menu mobile, du logo et de son dégagement. Le bouton tenu par le postier reste lisible et son lien postal est conservé.
- Lecture agrandie : reflow initial de la réservation russe et de la carte française à 360 pixels, avec les tailles typographiques doublées par le banc. Aucun débordement de page ni texte coupé mesuré dans les contenus inspectés. Ce contrôle ne constitue pas une certification WCAG ni un test de tous les réglages système.

Les rapports bruts sont `responsive-matrix-initial-v10.json` et `responsive-corrections-v10.json`. Le banc est conservé dans `scripts/qa-responsive.html`, hors du dossier public et de la livraison.

## Parcours vérifiés dans le navigateur

- Calendrier anglais mobile : arrivée le 27 octobre, départ le 29, nouveau clic le 30 qui recommence la sélection ; tentative de départ le 30 novembre refusée au-delà de 30 nuits ; effacement des dates possible immédiatement.
- Séjour du 2 au 5 novembre conservé en passant de l’anglais au russe par le menu de langues. Le lien Booking contient les bonnes dates, cinq adultes, la catégorie Familiale et le paramètre de langue russe. Aucun lien de réservation n’a été soumis et aucune réservation n’a été effectuée.
- Concierge coréen : une question libre sur la fondue oriente vers le restaurant, sa carte et les horaires, dans la langue choisie. Interface mobile, choix et champ de saisie visibles.
- Postier : le clavier déclenche la carte animée, Échap l’arrête, le lien PostCard Creator reste distinct.
- Saint-Bernard : la variante avec patte levée se charge et s’affiche après activation.
- Restaurant : les 45 photos sont enrichies. La fondue utilise la fourchette photographique optimisée ; une seule scène est active et Échap supprime la scène.
- Les autres scènes, les annonces accessibles, la fin automatique et l’option de réduction des mouvements ont également été contrôlées au cours de l’intégration. Le son reste déclenché uniquement par une action du visiteur.

## Traductions et référencement

Chaque catalogue comporte 1380 chaînes. La compilation stricte refuse les chaînes absentes ou vides. Les textes statiques, menus, attributs accessibles, messages, dates, pluriels et données interactives sont localisés. Les pluriels russes disposent des formes supplémentaires nécessaires. Les rapports linguistiques et `runtime-language-verification.json` consignent les contrôles des huit environnements.

Le rapport `seo-link-audit-v10.json` porte sur les 64 pages, les titres et descriptions du catalogue SEO, les métadonnées de partage, canonical, hreflang, données structurées, références locales, ancres et légendes. Les métadonnées Open Graph initialement absentes de la page Séjours ont été ajoutées au compilateur puis recompilées.

Le catalogue conserve 25 chambres et huit catégories : Familiale à cinq personnes ; Familiale Supérieure à quatre adultes maximum et six couchages ; Basic Randonneur retirée. Ces informations restent cohérentes dans les huit langues et le fichier `llms.txt`.

Le site reste privé. Les canonical, hreflang et sitemap sont préparés, mais `noindex` et les règles de robots empêchent volontairement l’indexation de l’aperçu. Une mise en production publique devra définir l’origine définitive et une politique d’indexation cohérente avec la visibilité de l’hébergement.

## Poids et limites des mesures

Les variantes WebP sont sélectionnées par `srcset` et `sizes`. Les images secondaires sont différées ; les variantes de surprises et les sons se chargent à la demande. Les ressources de langue sont chargées uniquement pour la langue active. Les anciennes expériences cinématiques ne sont pas incluses dans la sortie livrée.

Comparaison des sommes de fichiers originaux et des petits candidats : collages −90,2 %, photos de la carte −66,6 %, photographies du site −80,9 %. Ces gains comparent des variantes de fichiers ; le navigateur choisit selon la largeur et la densité de pixels et ne télécharge pas toutes les variantes.

Le relevé final `performance-build-v10.json` mesure 459185 octets pour le HTML, les CSS et les JavaScript référencés par l’accueil français, soit une estimation gzip locale de 123124 octets, hors images et fontes. Aucun temps de chargement réseau, score Lighthouse ou Core Web Vitals n’est déduit de ce chiffre. Les appareils physiques et tous les moteurs de navigateur n’ont pas été testés.

## Construction et preuves

La dernière compilation officielle se termine sans erreur. `git diff --check` ne signale pas d’erreur d’espacement. Les captures `v10-postier-suisse.jpg` et `v10-concierge-coreen-mobile.jpg` montrent le rendu réellement observé. Les prompts des visuels générés et les sources d’images sont conservés dans les rapports de provenance.
