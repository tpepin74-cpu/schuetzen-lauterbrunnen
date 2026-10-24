# Preservation audit — Swiss postcard site

**Result: no broken functional content identified in the focused static comparison.**

Audit date: 24 October 2026. This was read-only for the active repository. It compares the original ZIP extraction at `source-html/hotel-schuetzen-site/` against the seven current HTML files and `public/` assets in `schuetzen-journey/`. No browser interaction, live booking, email or payment was performed by this audit.

## Content preserved

| Scope | Static result |
| --- | --- |
| Seven original page URLs | All present: index, chambres, restaurant, vallee, maison, infos, reservation |
| Nine room categories | All stable room IDs present; complete textual room bodies exactly match source |
| Room data | `public/js/data.js` byte-for-byte identical to source `js/data.js` |
| Restaurant menu | Entire `#carte` textual subtree exactly matches source, including food, drinks, prices, provenance, summer-2026 label and allergen note |
| Room practical information | Entire `#bon-a-savoir` text exactly matches source, including Chalet Grosshorn and conditions |
| FAQ | Question/answer text exactly retained; only section heading restyled |
| Restaurant hours | Exact content retained |
| Hotel contact, access and train-duration table | Exact content retained |
| Reservation and group content | Exact substantive content retained |
| Hotel values and timeline | Exact content retained |
| Valley durations and external resources | Exact content retained |
| Excursion and seasonal content | Existing descriptions remain; section headings are retitled |

Nine unchanged room IDs: `double-superieure`, `double`, `economique`, `triple`, `quadruple`, `familiale`, `familiale-superieure`, `simple`, `basic`.

The source practical limitations remain source facts rather than new verification: seasonal menu, indicative room-photo assignment, source copyright/provenance notes, no configured live availability service. The preservation audit does not certify current hotel policy or prices.

## Links, IDs and assets

- **112 of 112 original image files** in `public/img/` match source SHA-256 hashes. None missing or altered.
- No missing local image `src` or `srcset` targets across seven pages.
- No missing stylesheet, script, font preload, icon or manifest references checked from the seven HTML heads/bodies.
- All dynamic room-gallery image names and `-m.webp` variants exist.
- All `data-lb`, `data-lb-set` and `data-src` gallery targets exist.
- No duplicate HTML IDs across any individual page.
- No broken local page links or fragment targets across the seven pages.
- All original external, `mailto:` and `tel:` destinations remain somewhere in the site.
- All source IDs remain except `index.html#h-win`, the heading for the deliberately removed waterfall window decoration. No retained link points to it.

## Interaction markup contract

All seven pages retain the required booking sheet, calendar, room selector, scrim, lightbox, image/caption nodes, mobile navigation, guide dialog/form/log/chips and header hooks. Source `data-page` values and stable IDs remain usable.

Removed hooks belong to the old visual effects: waterfall veil, animated dock, logo snow, hero slideshow, photo/window parallax and steam controller. A small number of redundant booking-sheet triggers disappeared when the hero was rewritten, while the header/footer/sheet and booking page remain wired. The removed mobile booking-bar text hook has no required dependency; its update query safely matches zero nodes.

The functional JavaScript has been intentionally hardened separately. Static inspection is consistent with `docs/INTERACTION_CHANGES.md`: date validation, real infant ages, safer group form, focus management, keyboard tabs, and more accurate concierge availability language. Runtime behavior still requires the parent's browser verification.

## New hero/catalogue consistency

Home H1: **“La Suisse, comme on la rêve.”**

Home intro: “Un chalet de bois, des sommets à la fenêtre et de la fondue à partager. Bienvenue au Schützen.” This is atmospheric copy consistent with supplied content, without introducing a room price, availability claim or invented service.

The three new discovery cards link to the existing rooms, restaurant and valley pages. They supplement the substantive home sections, which retain featured room cards, restaurant hours and menu previews, hotel metrics, excursion previews and booking entry points.

Each page has exactly one H1. New display headings are editorial changes; original factual details remain in their existing sections. The new name is consistently Schützen / Lauterbrunnen, preserving the actual location from the supplied site.

## Evidence artifacts

`preservation-audit.json` records the first-pass page-level ID, link, local-asset and data-hook comparison. Follow-up checks found exact textual matches for all nine room blocks, full menu, room conditions, practical/access/booking/group content, hotel values/timeline, and valley durations/resource links.

**No action required from the static preservation audit.** This result does not replace visual responsive QA or actual browser interaction checks.
