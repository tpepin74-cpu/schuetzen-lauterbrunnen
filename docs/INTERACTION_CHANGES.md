# Interactions for the Swiss postcard redesign

Ready to copy: `site.js` in this directory. It retains the existing seven-page HTML site's data-* contract and the local `window.SCH` data source. Root owns HTML/CSS integration and browser verification.

## Removed

- Lenis scroll smoothing and its perpetual animation loop.
- Staubbach waterfall page-transition curtain and link interception.
- Hero autoplay slideshow.
- Liquid animated bottom dock, logo snowfall, old photo parallax and full-screen valley window.
- Old scroll-window updates. Native scrolling remains, with a light requestAnimationFrame handler only for current header/anchor state.

Remove the external Lenis script, inline `sch.veil` startup script and `data-veil` markup from HTML. The JS clears previous transition session markers defensively. It has no CDN or GSAP dependency. The optional old `data-dock` HTML may be removed; simple links still work if retained.

## Preserved and corrected

- Calendar, stay persistence, guest/room counts, room choice, external Booking and Google URLs, direct e-mail preparation, capacity warnings and optional actual availability endpoint.
- Room galleries and lightbox: focus returns to the opener, background is inert while open, keyboard left/right and touch swipe work, current caption is announced.
- Booking sheet and mobile menu: background inert, focus contained and restored, Escape closes, delayed animation cleanup cannot hide a newly reopened panel.
- Mobile concierge is modal at 860px and below; desktop remains a nonmodal dialogue. Switching width updates semantics. Keyboard return and focus management added.
- Calendar retains focused date / month control when it renders again.
- Restaurant food/drinks tabs use a single tab stop and left/right/Home/End keyboard controls.
- Group form validates name, email, integer guest count and non-past date; an editable result opens an e-mail draft only. User input is inserted with DOM textContent/dataset instead of unsafe innerHTML. The group form retains the source limits (6–120) and optional date.
- Stored booking dates are validated. Invalid/impossible/past dates and stays longer than 30 nights are reset safely.
- Actual baby ages (0–3) are requested when baby count is nonzero, stored in `sch.booking.ages`, and forwarded as Booking `age` parameters. The source previously hardcoded every baby to age 1. Child fields reuse `.field` / `.select` and sit in `.child-ages` immediately after the baby `.stepper`; root may add spacing via CSS. No other new HTML required.
- Concierge wording now directs visitors to external sites for availability/prices without claiming the unconfigured endpoint knows room availability.
- `prefers-reduced-motion` and `?motion=reduce` both set `html[data-reduced="true"]`.

## Retained markup assumptions

- `data-sheet="book"`, inner `data-cal`, `data-scrim`, lightbox, all `data-cg-*` nodes remain present on every page.
- `data-anchors` retains its `.anchors__pill`, `.anchors__wrap`, `.anchors__list`, `.anchors__toggle`, `data-anchor-cur` and `.anchors__progress i` children. Remove `data-anchors` if replacing its entire implementation.
- Mobile main menu changes to desktop at 1101px; concierge modal breakpoint is 860px.
- No room filtering control existed in the source. The nine categories were section anchors plus booking room selection.

## Completed checks

- `node --check site.js`: pass.
- Focused evaluation of actual date-parser and Booking URL functions: impossible/invalid dates rejected; leap date accepted; date, adult, child and distinct baby-age parameters preserved; unavailable room ID falls back to `#availability_target`.
- No live message, e-mail, booking or payment sent.

## Browser checks for root after integration

1. Open/close booking from header and mobile menu, Tab/Shift-Tab containment, Escape, return focus.
2. Change calendar months/dates, counts, baby ages; inspect outgoing Booking href without completing reservation.
3. Open a room gallery, next/previous/keyboard/Escape, return focus.
4. Food/drinks tabs by mouse and arrow keys.
5. Group invalid input, valid draft, edit again; confirm it has not actually sent a message.
6. Concierge desktop and mobile, Escape, transition to calendar, and reduced-motion query.
