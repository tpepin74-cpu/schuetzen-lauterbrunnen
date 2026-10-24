# Hotel Schützen Lauterbrunnen — site refondu (version de travail)

Site statique multi-pages, sans dépendance : HTML + css/site.css + js/site.js + js/data.js + img/.

Logo : img/logo.webp (détouré depuis le logo officiel, liseré blanc), img/logo-s.webp (en-tête), img/logo-snow.png (masque de la zone de ciel pour la neige animée de l’accueil), favicon et icônes. À remplacer par le fichier vectoriel de l’hôtel s’il existe, en gardant les mêmes noms.

## À brancher avant mise en ligne
1. **Réservation** : les dates, hôtes et la chambre choisis sont mémorisés (localStorage, clé sch.booking). Booking.com (fiche restaurant-schutzen-ag) s’ouvre à ces dates directement sur la chambre choisie grâce à son identifiant Booking (champ `bk` de chaque chambre dans build/data.mjs, ancre #RD…) ; sans chambre choisie, sur le tableau des disponibilités. Disponibilités en temps réel : renseigner `SITE.availability` (build/data.mjs) avec une adresse qui répond `{ "available": ["6627402", …] }` pour `?checkin&checkout&adults&rooms` (API Demand de Booking.com via un compte partenaire affilié, ou le channel manager de l’hôtel, appelés côté serveur). Le site indique alors avant l’ouverture de Booking si la chambre est complète et propose celles encore libres. Fonctions `bookingURL`, `googleURL` et `checkAvail` de js/site.js.
2. **Restaurant** : pas de réservation de table (comme sur restaurantschuetzen.com) ; horaires et carte d’été 2026 dans build/data.mjs (RESTO, MENU) à mettre à jour à chaque saison. Groupes : formulaire préparé par e-mail.
3. **Photos** : les visuels de l’hôtel (fichiers img/sch-*.webp : façade, terrasse, chambres, restaurant, cheminée, plats) proviennent de la fiche Google Maps « Hotel Restaurant Schützen », utilisées avec l’autorisation de l’hôtel. Une partie de ces photos a été publiée par des visiteurs : vérifier les droits avant la mise en ligne définitive. Les chambres en 679 px d’origine ont été agrandies (EDSR ×2 ou Lanczos) ; les remplacer en priorité par le shooting de l’hôtel, en gardant les mêmes noms de fichiers. L’attribution des photos aux catégories de chambres est indicative et doit être validée par l’hôtel. Restent en images libres de droits Unsplash : les paysages de la région (Jungfraujoch, Mürren, Wengen, lacs, train jaune…) et le petit-déjeuner.
4. **Coordonnées** : vérifier le téléphone (+41 33 855 50 50) et les coordonnées GPS dans build/data.mjs.
5. **Langues** : version française ; ajouter DE et EN puis compléter les balises hreflang.
6. **Animations** : trois effets, pas plus. À l’ouverture de l’accueil, la photo s’ouvre depuis un mince filet vertical (comme le Staubbach) et le titre monte ligne par ligne. Plus bas, une photo de la vallée s’agrandit jusqu’au plein écran pendant le défilement, le texte passant du noir au blanc là où il croise l’image. Entre deux pages, un voile tombe et porte le nom de la page suivante (sessionStorage `sch.veil`). Neige légère sur l’écusson de l’en-tête, léger parallaxe des photos sur ordinateur. Aucun contenu n’apparaît au défilement ; tout est coupé si l’utilisateur a choisi « réduire les animations ».
7. **Typographie** : Instrument Sans (une seule famille, bâton) via Google Fonts ; à auto-héberger si la politique RGPD/nLPD de l’hôtel l’exige.

## SEO / GEO inclus
- Titres, descriptions, canonical, Open Graph, Twitter cards par page
- JSON-LD : Hotel, Restaurant, HotelRoom, TouristAttraction, FAQPage, BreadcrumbList, WebSite
- sitemap.xml (avec images), robots.txt (ouvert aux robots IA), llms.txt (résumé factuel pour moteurs de réponse)
- FAQ et « Bon à savoir » rédigés en réponses directes, en accordéons (contenu présent dans le HTML)
