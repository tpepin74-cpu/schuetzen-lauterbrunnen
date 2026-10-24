# Cinematic table relay assets

## Dedicated portrait relay frames

These two images were generated ONLY from the approved portrait `fondue-mobile.webp` and each other. They avoid the architectural discontinuity introduced by cropping the desktop panoramas into a portrait.

| Mobile asset | Canvas | Mouth center | Mouth bounds |
| --- | --- | --- | --- |
| `public/assets/cinematic/table-wide-mobile.webp` | 1024 × 1536 | (529, 886) = (0.5166, 0.5768) | x≈417–640, y≈857–914 |
| `public/assets/cinematic/table-approach-mobile.webp` | 1024 × 1536 | (524, 898) = (0.5117, 0.5846) | x≈347–700, y≈852–943 |
| Existing `public/assets/journey/fondue-mobile.webp` | 1024 × 1536 | (515, 918) = (0.5029, 0.5977) | x≈268–761, y≈840–995 |

Actual generated pot-mouth widths are approximately 21.8%, 34.5% and 48.1%; use these measured values rather than prompt targets. Approximate mouth matching scales are wide→approach 1.58× and approach→final 1.40×. Background architecture remains in nearly the same frame position while the table and objects enlarge; separate near/far matching is advisable. Original final portrait remains untouched.

Selected PNGs: `/workspace/scratch/da58fe833176/assets-work/cinematic/table-approach-mobile.png` and `table-wide-mobile.png`.

### Exact mobile approach prompt

Use case: precise-object-edit. Asset type: PORTRAIT photographic relay frame for a mobile cinematic camera approaching a fondue table. Output exactly 1024x1536, portrait 2:3. IMAGE 1 is the IMMUTABLE FINAL PORTRAIT FRAME; preserve its entire scene, architecture and composition identity. Create the immediately preceding camera viewpoint, only about half a metre farther back, same lens, same camera axis, same height and tilt except a very gentle reframing to keep the pot centered. This is NOT a new composition and NOT based on a landscape photo. Same natural warm afternoon exposure and white balance. Preserve exact red fondue caquelon, black burner, wooden table texture/shape, bread basket and white plate left, wine glass right, fire bowl behind-left, Swiss flag left, red geraniums, green shutters, wooden chalet RIGHT, Staubbach cliff and waterfall. All objects remain in the same places in the world. Only the camera moves backward slightly. Mouth of the pot should be about 38–40% of canvas width instead of current 48%, mouth center at x=50.3%,y=58%. Show a little more wooden tabletop in front and sides, and the same background slightly farther away. Do not add chairs or new foreground furniture. No cloth on the tabletop, no new objects, no removal, no hands, no forks, no people, no text, no lettering, no watermarks. Photographic reality with original natural imperfections; strictly preserve material and architectural continuity so a forward zoom and matched transition can land on exactly the reference image.

### Exact mobile wide prompt

Use case: precise-object-edit. Asset type: PORTRAIT photographic relay frame for a continuous mobile forward camera move. Output exactly 1024x1536, 2:3 portrait. IMAGE 1 is the IMMUTABLE FINAL PORTRAIT FRAME. IMAGE 2 is the preceding approach frame of the SAME table and SAME architecture. Make a WIDER frame just before image 2, by stepping the camera backward on exactly the same axis, same lens, with a very slightly higher standing-guest viewpoint. This must be the same real-world setup, not a new arrangement. Keep the precise chalet roof slope, windows, green shutters, Swiss flags, geraniums, waterfall/cliff silhouette, fire bowl, parasols and background tables from these PORTRAIT references. Keep exact same warm natural afternoon lighting and colors. Keep same rustic bare wooden table shape/material, red enamel fondue pot with handle right, black burner, bread basket and white plate on left, wine glass right. All these objects stay in their original world positions. Mouth of the pot should occupy 26–28% of the canvas width, centered about x=50.3%,y=55%; it must remain recognizable and unobstructed. The table should now be fully visible with its front edge and simple wooden legs, some existing stone terrace paving around it and in foreground at bottom. Camera is further back, it does not rotate to another side. No new chairs in the foreground, no new furniture, no changed objects, no tablecloth, no people, no hands, no forks, no text, no watermarks. Ultra-realistic natural photography. Strict architecture/object continuity to both reference images. Do not use or recreate any landscape composition.

---


Generated with the built-in image generation tool. Existing `public/assets/journey/fondue.webp` and `fondue-mobile.webp` remain untouched and are the visual references for these two relay frames.

## Files

| Asset | Canvas | Mouth center | Mouth approximate bounds |
| --- | --- | --- | --- |
| `public/assets/cinematic/table-wide.webp` | 1672 × 940 | (843, 511) = (50.42%, 54.36%) | x=750–937, y=489–533 |
| `public/assets/cinematic/table-approach.webp` | 1672 × 941 | (850, 557) = (50.84%, 59.19%) | x=682–1019, y=513–602 |
| Existing `public/assets/journey/fondue.webp` | 1672 × 941 | (852, 596) = (50.96%, 63.34%) | x≈540–1180, y≈520–663 |

Selected original PNGs are preserved in `/workspace/scratch/da58fe833176/assets-work/cinematic/table-wide.png` and `table-approach.png`.

## Camera matching notes

All three frames face the same table along approximately the same axis. The fondue pot, its right-pointing handle, basket and white plate at left, wine glass at right, fire bowl behind-left, chalet, cliff, flags and geraniums remain present.

For the camera rig, use the actual mouth centers above instead of the requested prompt positions. Approximate matching scales based on pot-mouth width: wide → approach 1.80×; approach → existing close view 1.90×. Translation is still needed to align mouth centers when crossfading. The real source image remains the final destination, with its existing fondue interaction untouched.

These images are generated relay views, not actual footage or a metrically exact reconstruction. The generator introduces small background/table differences; keep any crossfade brief and moving. Both photos are daylight with the same warm balance and bare wooden tabletop.

## Exact approach prompt

Use case: precise-object-edit. Asset type: photorealistic 16:9 landscape relay frame for a smooth cinematic forward camera move into image 1. Output 2304x1296 or similar high-resolution 16:9 landscape. Image 1 is the IMMUTABLE FINAL CAMERA FRAME and the scene must match it exactly. Image 2 is only a portrait reference of the same setup. Produce the immediately preceding camera position, about ONE METRE farther back and only slightly higher, looking along EXACTLY THE SAME AXIS, not from a different side. Reframe outward without changing the scene: same weathered bare WOODEN TABLE with no tablecloth, same red enamel fondue caquelon with its handle pointing RIGHT, same black burner, same cream cheese, same bread basket with red-white cloth at LEFT, same white plate lower left, same wine glass at RIGHT, same black fire bowl behind LEFT, same red geraniums and Swiss flag, same wooden chalet and green shutters on RIGHT, same cliff and Staubbach waterfall, same mountain background. Keep positions relative to each other, warm photographic daylight and white balance identical. Camera height about 1.45m, gently looking down. We now see a little more of the wooden tabletop and its front edge, some terrace paving at the very bottom, and slightly wider surroundings. The fondue mouth is centered near x=51%, y=63% of the full image and is about 24–27% of image width; the pot is smaller than in image 1 (there it is ~38% wide). Preserve the table's perspective and realistic texture. No new objects. No new lamps, no new furniture in foreground, no change of food or crockery, no tablecloth, NO hands, NO forks, NO people, NO lettering. Real ultra-realistic photography with natural imperfections, not 3D. This must feel like a camera walking toward the SAME table, not a new styled photo shoot.

## Exact wide prompt

Use case: precise-object-edit. Asset type: photorealistic 16:9 landscape relay frame in one continuous forward camera travelling sequence. Output 2304x1296 or similar 16:9. IMAGE 1 is the APPROACH frame to preserve. IMAGE 2 is the final closeup of the same setup. Create the earlier, WIDER camera position about THREE METRES farther back than image 2, at an arriving guest's standing eye height around 1.6m. Look along EXACTLY THE SAME AXIS toward the SAME table; no sideways angle, no restyling. Preserve all objects and architecture of image 1: same weathered bare wooden rectangular table, same red enamel fondue pot on its black burner centered on table with handle pointing right, same bread basket and white plate left, same wine glass right. The pot is already clearly recognizable, mouth center at about x=51%,y=63% of whole image, but mouth is only 12–14% of total image width. We can now see the whole table with sturdy legs and a little terrace stone paving foreground in the bottom 25% of image. Leave the approach route clear; do not add chairs in foreground, no tablecloth or new objects. Same black fire bowl behind-left of the table, same wooden railing and geraniums left, same Swiss flag, same timber chalet with green shutters on the right, same real Staubbach waterfall and cliff and mountains. Keep natural warm afternoon light and white balance exactly matching both references. Everything should form a real plausible perspective with the table positioned in front of the viewer, ready for a straight walk to it. Do NOT add or remove objects already on the table, do NOT change the background into a new scene. No people, no hands, no fork, no captions or lettering, no logos, no watermarks. Extremely realistic photograph with naturally textured timber, small surface imperfections, restrained real colors. An earlier frame of the exact same camera path, not a different restaurant table.

