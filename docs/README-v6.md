# Schützen · Le carnet de voyage suisse

Refonte complète des **sept pages HTML** de `hotel-schuetzen-site.zip`, dans la direction photographique du collage précédent : cartes postales, papier crème, Vichy rouge et blanc, timbres suisses, photographies encadrées et découpes décoratives. Le catalogue de l’hôtel, de ses chambres, du restaurant et de la vallée reste le contenu principal.

Les pages actives sont en **français**, comme le site HTML fourni. Les photographies, les données métier et les parcours du fichier source ont été repris ; les textes d’accroche et leur mise en scène ont été adaptés au carnet de voyage. L’ancienne proposition courte multilingue reste consultable dans les archives.

## Démarrer et construire

```sh
npm ci
npm run dev
npm run build
```

Vite construit les sept entrées HTML dans `dist/`. Le site actif utilise du HTML, du CSS, du JavaScript natif et l’API DOM de Framer Motion. Il n’a ni backend, ni clé API nécessaire à son exécution. Les anciennes dépendances et sources React restent présentes pour l’historique ; `SwissCollageApp.jsx` n’est plus l’entrée active.

## Pages et fichiers actifs

| Fichier | Contenu ou rôle |
| --- | --- |
| `index.html` | Accueil, carnet de découverte, chambres, spécialités et idées dans la vallée. |
| `chambres.html` | Neuf catégories, équipements, galeries et informations de séjour. |
| `restaurant.html` | Spécialités, horaires, carte à manger et à boire, groupes. |
| `vallee.html` | Neuf excursions, trajets, saisons et liens utiles. |
| `maison.html` | Histoire de l’hôtel, valeurs, repères et galerie. |
| `infos.html` | Contacts, accès, distances et questions fréquentes. |
| `reservation.html` | Calendrier, séjour, réservation externe et demande de groupe. |
| `public/js/data.js` | Données `window.SCH` conservées à l’identique depuis le ZIP. |
| `public/js/site.js` | Interactions métier, fenêtres, calendrier, galeries et concierge local. |
| `public/css/site-base.css` | Base CSS issue du site fourni. |
| `src/postcard.css` | Direction carte postale, compositions, responsive et mouvement réduit. |
| `src/postcard-motion.js` | Découpes animées au scroll, avec `animate` et `scroll` de Framer Motion. |
| `vite.config.js` | Configuration de construction multipage. |

Les médias du ZIP sont conservés dans `public/img/`. Les sept découpes photographiques se trouvent dans `public/assets/collage/` : Saint-Bernard, vache, géraniums, téléphérique, tablée de fondue, train et edelweiss. Les polices Manrope et Cormorant sont locales ; les grands titres utilisent Georgia.

## Parcours et limites réelles

Le calendrier mémorise le séjour sur l’appareil, transmet les dates, hôtes et choix de chambre à Booking.com, et propose les liens Google et de contact fournis. Les âges des bébés sont demandés avant la redirection. **L’URL de disponibilité en direct reste vide** dans les données : aucun inventaire ni prix en temps réel n’est calculé par ce site.

Le formulaire de groupe prépare une demande modifiable et ouvre la messagerie du visiteur. Il ne transmet pas de message au serveur. Le concierge est un guide local à réponses prévues ; il ne contacte pas la réception. Le site ne traite ni paiement ni confirmation de réservation.

Les contenus factuels proviennent du fichier fourni. Ses réserves de maintenance sont conservées dans [LISEZMOI-original.md](docs/source-html/LISEZMOI-original.md), notamment la carte saisonnière, l’attribution indicative des photographies aux catégories de chambres, les droits de certaines photos et les coordonnées à confirmer. Ces notes sont destinées à l’équipe qui maintient le site.

## Versions, référencement et vérification

Les sept pages portent `noindex,nofollow` et `public/robots.txt` interdit l’exploration : cette version reste une prévisualisation privée. Les canonical, données structurées et informations touristiques provenant de l’original doivent être revus ensemble avant une éventuelle mise en production sur le domaine de l’hôtel.

Les versions précédentes sont préservées : **`/version-collage/`**, **`/version-fondue/`** et **`/version-2/`**. L’archive du collage utilise ses propres fichiers JS/CSS construits et les médias stables de `/assets/` ; ne pas supprimer ces médias communs. Les documents de la version courte ont été archivés dans `README-v5.md` et `docs/SCENARIO-v5.md`.

Voir [SCENARIO.md](docs/SCENARIO.md) pour les parcours, les mouvements et la maintenance, [INTERACTION_CHANGES.md](docs/INTERACTION_CHANGES.md) pour les corrections du JavaScript, et [VERIFICATION.md](docs/VERIFICATION.md) pour les seuls résultats effectivement observés. Ce README ne constitue pas un compte rendu de tests navigateur.
