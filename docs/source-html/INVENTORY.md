# Source HTML inventory — Hotel Schützen Lauterbrunnen

Attachment `upload/hotel-schuetzen-site.zip` was safely extracted (path traversal and symlinks rejected) to `source-html/hotel-schuetzen-site/`. These extracted files are the unmodified source. Audit date: 24 October 2026. No active repository files were modified.

## Scope and companion files

Seven French HTML pages, static CSS/JS, no backend, no video. Shared files: `css/site.css`, `js/site.js`, `js/data.js`. External dependencies: Google Fonts Instrument Sans; Lenis 1.1.13 from jsDelivr. The attachment includes 112 image files totaling 12,203,229 bytes; most photographs have desktop and `-m.webp` versions.

| Audit file | Contents |
| --- | --- |
| `page-sections.json` | Top-level main-section tags, IDs, classes and headings, all 7 pages |
| `parsed-pages.json` | All page headings, links, IDs, image attributes, forms and metadata |
| `source-data.json` | Pretty-printed `window.SCH`: site settings, 9 rooms, 11 FAQ answers, 6 events, 7 pages |
| `asset-inventory.json` | 112 image paths, sizes, dimensions and modes |
| `external-links.json` | 14 unique external/tel/mailto links with originating pages |
| `*-text.txt` | Main-content plaintext for each of the seven pages |

## Page hierarchy

| Page | Main sections, in order |
| --- | --- |
| `index.html` | `#top.hero--home`; `.window` cascade scene; `#chambres.sec`; `#restaurant.sec--alt`; `.stats`; `#vallee.sec`; `.cta` |
| `chambres.html` | `#top.hero--page`; `.anchors`; `.perks`; `#doubles.sec--rlist`; `#familles.sec--rlist`; `#solo.sec--rlist`; `#bon-a-savoir.sec--info`; `.suite` |
| `restaurant.html` | hero; anchors; `#horaires.hours`; `#specialites`; `#carte.sec--paper`; `#groupes`; suite |
| `vallee.html` | hero; anchors; `#incontournables`; `#trajets.sec--paper`; `#saisons`; `#liens.sec--paper`; suite |
| `maison.html` | hero; anchors; `#histoire`; `#valeurs.sec--paper`; `#reperes`; `#galerie.sec--paper`; suite |
| `infos.html` | hero-short; anchors; `#contact`; `#acces.sec--paper`; `#distances`; `#faq.sec--paper`; suite |
| `reservation.html` | hero-short; anchors; `#chambre.sec--paper`; `#restaurant-info`; `#groupe.sec--paper`; suite |

Shared header, mobile menu, footer, booking sheet, lightbox and concierge appear on every page. `.suite` is the next-page navigation. Stable room and excursion IDs support deep links and concierge cards.

## Content to preserve

### Home

Hero subtitle: 25 rooms, Staubbach, Jungfrau Region. Arrival/departure/guest picker. Three featured rooms (Double Supérieure, Familiale Supérieure, Double). Restaurant and hours, four dish cards. Four metrics (25 rooms; 297 m waterfall; 5 minutes to station; 1671 shield). Four excursion previews. Booking CTA.

### Rooms

All nine categories include detailed copy, size, capacity, beds, view, equipment, ideal audience, thumbnail galleries and booking actions. `data-pick-room` links room selection to the booking sheet.

| ID | Name | Area | Capacity | Beds | Booking ID |
| --- | --- | --- | --- | --- | --- |
| double-superieure | Double Supérieure | 17 m² | 2 | 1 grand lit double | 6627402 |
| double | Double | 16 m² | 2 | 1 grand lit double | 6627411 |
| economique | Double ou twin Économique | 15 m² | 2 | 1 grand lit ou 2 lits simples | 6627413 |
| triple | Triple | 22 m² | 3 | 1 grand lit + 1 lit simple | 6627403 |
| quadruple | Quadruple | 24 m² | 4 | 1 grand lit + 2 lits simples | 6627404 |
| familiale | Familiale | 27 m² | 4 | 1 grand lit + 1 lit simple + 1 lit superposé | 6627414 |
| familiale-superieure | Familiale Supérieure | 29 m² | 4 | 1 grand lit + 2 lits superposés | 6627412 |
| simple | Simple Économique | 10 m² | 1 | 1 lit simple | 6627401 |
| basic | Basic Randonneur | 6,5 à 22 m² | 1–4 | Selon la chambre | Direct reception only |

All except Basic: private bathroom, free Wi-Fi, flat-screen TV, coffee machine/kettle, non-smoking. Double and both superior categories have balconies; superior categories specifically face Staubbach. Basic has a room sink and shared showers/toilets on the second floor. Room-photo assignments are explicitly indicative in the source README.

“Bon à savoir” covers arrival, breakfast, children/cots, view, parking/access, pets, payment/tax, and Chalet Grosshorn. Apartment: 3.5 rooms, 4–5 people, ground-floor bathroom/kitchen/living room/balcony bedroom, steep stairs to second bedroom, nearby bus/Talmuseum/minigolf/tennis, offered by Paul & Alice von Allmen through reception.

### Restaurant

Hours, about 100 seats, wheelchair access, fireplace in winter, terrace in summer. Four specialty cards: fondue CHF 27 per person (minimum 2); raclette CHF 24.50; farmer's rösti CHF 26.50; bratwurst XL CHF 28.50.

Full food/drink menu is static HTML, controlled by tabs. Food categories: soup, salads, 7 Swiss specialties, 4 meat/fish dishes, 5 burgers, 3 flammkuchen, 2 wraps, 2 children's dishes. Drinks: house water/iced tea/syrup, beers/cider, 3 Swiss wines, aperitifs/digestifs, coffee/chocolate/iced coffee. Exact names, descriptions and prices in `restaurant-text.txt`.

Menu explicitly labeled “Carte d’été 2026”, CHF, 8.1% VAT included, subject to change, allergen questions to staff. Provenance: meat/poultry Switzerland; chicken nuggets Brazil/Argentina; fish nuggets Alaska; salmon Norway; perch Germany. Group section links to `reservation.html#groupe` and restaurant email.

### Valley

9 excursions: Staubbach (5 min walk, 297 m); Trümmelbach (10 min bus, April–November); Mürren (25 min, 1,638 m); Jungfraujoch (1 h 45, 3,454 m); Wengen (15 min train, 1,274 m); Schilthorn (1 h, 2,970 m); Kleine Scheidegg (50 min train, 2,061 m); lakes Thun/Brienz (20 min to Interlaken); Bachalpsee (day excursion from Grindelwald).

Travel durations are explicitly indicative with SBB/Jungfrau links. Season content: summer, autumn, winter, night. Activities include hiking, skiing, via ferrata, paragliding, stargazing. Events: Lauberhorn (January), Inferno Mürren (January), Tell-Spiele (summer), Inferno Triathlon (August), Swiss National Day (1 August), Jungfrau Marathon (September). No exact year-specific event dates; instruction to verify with organizers. Official resource links for Jungfrau, Schilthorn, Trümmelbach, Interlaken, SBB and MySwitzerland.

### Hotel / maison

Motto “Ihr Ziel, unsere Heimat”; Claude Müller and team; German/English/French hospitality. Values: Gemütlichkeit, tradition/modernity, hospitality, local roots. Timeline: 1671 shield; 2010 restaurant refit; 2012 Ländler evenings and Best of Swiss Gastro “Typical Swiss”; 2013 hotel refit; 2025 refresh; today Claude Müller. These historical claims were not independently verified.

### Infos and reservation

Contact, practical details, car/train/air access, indicative train duration table, 12 FAQ answers. Reservation page: room selector, calendar, adult/infant/room steppers, summary, Booking.com, Google offers, direct email; restaurant no-reservation notice; group inquiry form.

## Practical facts exactly as supplied

- Hotel Schützen Lauterbrunnen AG, Fuhren 439, CH-3822 Lauterbrunnen.
- Phone +41 33 855 50 50; hotel email holidays@hotelschuetzen.com; restaurant info@restaurantschuetzen.com.
- Five-minute walk from station; bus stop in front. JS coordinates 46.5948196, 7.9070895.
- Breakfast daily 7h30–10h, open to public; included or optional according to rate.
- Restaurant daily 11h–21h; hot food 12h–20h; no table reservations.
- Check-in 14h–19h30; checkout until 11h; notify reception for arrival after 20h.
- Free Wi-Fi, free front/back parking, lift, non-smoking rooms, accessible restaurant.
- Pets not admitted to bedrooms, welcome in restaurant/on terrace.
- Children from age 4 count as adults; cot for ages 0–3 upon request, CHF 50 per stay.
- Payment Amex, Diners, Maestro, Mastercard, PostFinance, Visa, cash. Tourist tax extra; cancellation terms depend on rate.
- No room prices, ratings, testimonials or actual availability data are supplied.

## Existing behavior and integrations

`js/site.js` implements mobile menu, desktop dock, anchor navigation, booking sheet, two-month calendar, steppers, room thumbnail selection, lightbox with arrows/swipe, menu tabs, FAQ details, clipboard contacts, group email preparation and a rule-based concierge.

Booking state lives in `localStorage["sch.booking"]`: `in/out/adults/kids/rooms/room`. Limits: adults 1–12, babies 0–4, rooms 1–6, stay up to 30 nights. Past dates disabled. Persisted past arrival cleared. Capacity warnings offer larger rooms. Basic room has direct-only warning.

`window.SCH.site.availability` is blank, so there is no live availability check. Optional endpoint contract: GET `checkin/checkout/adults/rooms`, response `{"available":["6627402",...]}`.

Booking URL `https://www.booking.com/hotel/ch/restaurant-schutzen-ag.fr.html` receives dates, `group_adults`, `group_children`, repeated `age` (currently hardcoded 1), `no_rooms`, CHF, French locale, and `#RD<room-ID>` or `#availability_target`. Google Maps URL uses proprietary `data=` syntax with dates/nights/adults and gplace `0x478fa1b4311f9af5:0xf674aafa936932bc`. Direct mail prepopulates the requested stay. No transaction tested or performed.

Group form collects event type, person count (default 20, min 6, max 120), date, room need, name/company, email and project. It prepares `mailto:holidays@hotelschuetzen.com` and a copy button. It does not send or confirm. Existing `novalidate` implementation only checks name/email; count/date constraints should be validated. Existing confirmation uses innerHTML with count, so enforce numeric bounds or use textContent.

Concierge is local keyword routing with canned answers, no LLM/backend or human chat. It prepopulates booking dates, recommends room categories and links to hotel pages. One answer says “Voici les chambres libres…” before linking out, despite no live availability; change this wording to “Consultez les disponibilités…” if touching the source.

## Source caveats and verification

`LISEZMOI.md` calls this a working version and states:

1. Hotel photos came from Google Maps, some uploaded by visitors; rights for final publication need hotel confirmation.
2. Room photos originally 679 px were upscaled, and assignment to categories is indicative pending hotel validation.
3. Regional landscapes and breakfast are Unsplash images; original URLs/licensing details are absent.
4. Phone and GPS are marked to verify.
5. Source is French only, no DE/EN pages.
6. Restaurant menu is summer 2026, so current prices may differ.

There is no legal/terms/privacy page or cookie banner supplied. Cancellation is only “depends on selected rate”. No analytics, payment handler or backend are configured.

Primary official lookup, 24 October 2026:

- https://restaurantschuetzen.com/ confirms restaurant 11–21 daily, hot meals 12–20, breakfast public 7h30–10, no table reservations, Auf den Fuhren 439 / 3822 Lauterbrunnen, +41 33 855 50 50, info@restaurantschuetzen.com. Web source `turn4view1`; parent must open before citing. Site still lists a past 1 April 2026 closure, which should not be added as upcoming.
- https://www.hotelschuetzen.com/ failed with a redirect loop (`turn4view0`). Hotel policies/history and detailed rooms remain supplied-source facts rather than independently verified facts.

No active booking, contact message, payment or third-party write performed.
