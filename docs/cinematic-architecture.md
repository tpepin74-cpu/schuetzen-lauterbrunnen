# Architecture et raccords photographiques du parcours cinématique

## Périmètre et sources

Cette série remplace les vues rapprochées antérieures qui élargissaient l’escalier, ajoutaient une seconde rambarde et modifiaient le mobilier. Elle conserve les repères reconnaissables de la photo source : escalier étroit légèrement désaxé, rambarde gauche, panneau-menu à droite, enseigne, store rayé et façade vitrée du Schützen.

Les quatre photographies originales ont été examinées. **`public/assets/original-1.webp` reste le master architectural**, inchangé dans le dépôt. Les autres originales servent de contrôle du lieu ; leurs états de lumière et d’aménagement différents ne sont pas fusionnés dans un nouveau chalet. `public/assets/journey/fondue.webp`, validée comme destination, sert de référence de couleur à la première image.

Les cinq images ci-dessous sont générées avec l’outil intégré de génération d’images. Elles visent une continuité photographique, sans constituer un relevé géométrique ni un reportage des aménagements actuels. Les générations n’ont pas modifié les fichiers originaux.

## Fichiers et chaîne de référence

| Asset publié | Références de génération | Taille native | Octets WebP |
|---|---|---:|---:|
| `public/assets/cinematic/approach.webp` | original-1 + fondue validée, cette dernière pour la couleur uniquement | 1672 × 941 | 512 676 |
| `public/assets/cinematic/steps-low.webp` | original-1 + approach | 1672 × 941 | 531 206 |
| `public/assets/cinematic/steps-high.webp` | original-1 + steps-low | 1672 × 941 | 507 168 |
| `public/assets/cinematic/landing.webp` | original-1 + steps-high | 1672 × 941 | 543 004 |
| `public/assets/cinematic/terrasse-turn.webp` | landing + table-wide + original-1 | 1672 × 941 | 509 746 |

Les fichiers PNG sources correspondants sont dans `/workspace/scratch/da58fe833176/assets-work/cinematic/`, hors du dépôt. Les WebP utilisent une compression de qualité 91 sans suréchantillonnage. La sortie native est 1672 × 941 malgré la demande de définition supérieure dans les prompts.

`table-wide.webp` appartient au segment suivant et n’a pas été modifié pendant ce travail. Le relais `terrasse-turn.webp` a été demandé après la première série de quatre images.

## Trajectoire proposée

1. **Approach** : vue de rue reconnaissable, lumière naturelle rapprochée de celle du plan de fondue.
2. **Steps-low** : caméra au pied du véritable escalier ; son axe devient central, la rambarde reste à gauche et le menu à droite.
3. **Steps-high** : caméra montée de plusieurs marches, deux dernières marches visibles, panneau et enseigne sortant latéralement du champ.
4. **Landing** : arrivée au palier puis légère orientation vers l’allée côté vallée ; mobilier noir avec coussins rouges à droite.
5. **Terrasse-turn** : avance d’environ un mètre et petite rotation vers la table cible. Le poteau passe au premier plan gauche ; la table bois, le caquelon rouge, le panier, l’assiette et le verre sont déjà visibles au centre droit.
6. **Table-wide** : début du segment suivant, approche frontale de la même table.

Le raccord final proposé par le renderer est **landing à `p=.395` → terrasse-turn à `p=.415` → table-wide à `p=.435`**. Ces valeurs décrivent le raccord convenu, pas des secondes ni une vérification de la timeline du renderer.

## Points de calage

Les coordonnées ci-dessous sont des **points de travail relevés visuellement dans les images natives**, avant `object-fit`, zoom ou recadrage d’écran. Elles permettent de choisir une origine de mouvement et de contrôler les raccords ; les détails générés ne sont pas des correspondances photogrammétriques exactes. Affiner de quelques pixels lors du rendu plein écran.

| Image | Axe / cible de caméra | Extrémité haute du poteau de store | Pied du poteau de store | Sommet de rambarde gauche |
|---|---|---|---|---|
| original-1, 1360 × 1020 | Centre du haut d’escalier ≈ (601, 720) | ≈ (556, 503) | ≈ (558, 720), en partie masqué | ≈ (548, 668) |
| approach | Haut d’escalier ≈ (758, 671) ; pied ≈ (715, 844) | ≈ (705, 418) | ≈ (699, 671) | ≈ (684, 590) |
| steps-low | Haut d’escalier ≈ (833, 589) ; pied ≈ (790, 932) | ≈ (719, 224) | ≈ (717, 586) | ≈ (681, 445) |
| steps-high | Palier ≈ (832, 719) | ≈ (685, 132) | ≈ (669, 674) | ≈ (558, 456) |
| landing | Allée ≈ (811, 715) | ≈ (979, 93) | ≈ (978, 757) | ≈ (421, 741) |
| terrasse-turn | Fromage dans le caquelon ≈ (1017, 548) | Poteau proche coupé par le bord supérieur | Poteau proche ≈ (278, 923) | Derrière la caméra, hors champ |

### Landmarks de l’escalier

Le sommet du petit toit du menu est vers **(896, 622)** dans approach et **(1222, 445)** dans steps-low. Il sort par le bord droit dans steps-high, puis se retrouve derrière la caméra dans landing. La rambarde se rapproche du bord gauche au fil de l’ascension. Ne pas les recentrer artificiellement lors des raccords : leur sortie latérale sert la sensation d’avancée.

### Calage de la table

| Repère | terrasse-turn | table-wide |
|---|---:|---:|
| Centre de la surface de fromage | ≈ (1017, 548), soit 60,8 % / 58,2 % | ≈ (844, 510), soit 50,5 % / 54,2 % |
| Centre du panier de pain | ≈ (835, 589) | ≈ (562, 548) |
| Centre du verre de vin | ≈ (1202, 574) | ≈ (1086, 520) |
| Centre du brasero | ≈ (640, 505) | ≈ (612, 478) |
| Bord avant de la table, au centre | ≈ y=706 | ≈ y=677 |

Le corps du caquelon dans table-wide est environ **1,25 fois** celui de terrasse-turn. La table glisse du centre droit vers le centre au fur et à mesure que la caméra se place face à elle. La grande différence de déplacement du poteau au premier plan ne doit pas être imposée au fond : c’est un mouvement de parallaxe proche.

## Points qui restent à surveiller

- Les quatre étapes d’approche conservent les repères de la vraie entrée. Des détails fins de texte, de végétation, de reflets ou de maçonnerie changent entre générations ; éviter les promesses de reproduction pixel à pixel.
- Le changement de hauteur dans l’escalier est réel dans la composition : le palier ne doit pas être fixé au même y écran entre steps-low et steps-high, sinon la montée ressemble à un zoom stationnaire.
- Landing ouvre le regard vers la vallée ; terrasse-turn revient vers la table. Conserver une rotation douce, sans basculer brutalement d’un point de fuite à l’autre.
- Le sol est en grandes dalles dans landing / terrasse-turn et apparaît plus irrégulier dans table-wide. Le raccord doit privilégier le caquelon et le plateau, avec une transition courte sur le bas du champ.
- La façade vitrée proche de l’entrée et le fond architectural de table-wide ne sont pas identiques en tous détails. Le relais améliore la continuité du mobilier et du sujet, mais ne supprime pas cette différence géométrique.
- Une série d’images n’est pas à elle seule une vidéo continue. Des fondus longs peuvent révéler les doubles contours. Le renderer doit contrôler les points de calage, les changements de profondeur et les parties occultées.
- Aucun code, aucune timeline applicative ni aucun asset du segment de table n’a été modifié dans ce sous-travail.

## Validation des fichiers

Les cinq WebP ont été entièrement décodés avec Pillow après écriture. Landing et terrasse-turn ont été publiés par fichier temporaire puis renommage atomique, après vérification du fichier temporaire. Cela valide leur intégrité d’image, pas leur rendu animé dans le navigateur.

## Prompts exacts

### approach

```text
Use case: precise-object-edit / photorealistic-natural. Create ONE cinematic photographic frame for a continuous real-camera approach. OUTPUT: landscape 16:9, ideally 2304x1296 or 2560x1440, no text overlay or graphics. Reference 1 is the IMMUTABLE ARCHITECTURAL MASTER: actual Hotel Schützen street view in Lauterbrunnen. Reference 2 is ONLY the destination lighting/color reference (the fondue table), NOT an architecture reference. Retain the exact recognizable building geometry and camera position of reference1: dark aged wooden chalet on the right, actual roof silhouette, exact window count and spacing, muted green-blue shutters, projecting upper balcony with existing Grill Room Bar sign, real glazed ground-floor frontage, red-striped awning to its left, hotel schutzen sign behind plants. The short NARROW slightly off-center concrete entrance stair is essential: from sidewalk to raised terrace, one slim left-hand steel rail, plain pale concrete sidewall left, menu display on the RIGHT of the stair, irregular grey street and sidewalk at its foot. Do NOT widen the stair or make it symmetrical. Preserve its actual location around lower center-left, roughly 43% frame x, and retain the menu board, nearby parking sign, flagpole and streetlamp as familiar landmarks. Keep the curved concrete roadside drain/parapet in the near right foreground. Preserve real cliff shape behind the hotel. The image is a faithful high-quality photographic restatement of reference1 at the SAME initial position, allowing only a small lateral outpaint to reach 16:9; do not redesign anything or create a different terrace. Harmonize illumination gently toward natural clear afternoon light of reference2: neutral sky, soft warm highlights, believable grey concrete, brown wood, no orange golden-hour filter. Do not put snow peaks where absent from reference1. Do not enlarge flowers or add symmetrical balustrades. Original1 remains authoritative over all architectural details. Real camera photograph, fine imperfect surfaces, not CGI, not a painting, no new people, no invented luxury furniture.
```

### steps-low

```text
Use case: photorealistic-natural, strict architectural continuity. Produce ONE 16:9 landscape film frame (prefer 2304x1296 or larger) that comes IMMEDIATELY AFTER reference2 in a continuous walking shot. Reference1 is the immutable real Hotel Schützen photograph and controls all architecture. Reference2 is the preceding frame and controls exact light, texture, framing logic and object placement. Physically move the camera forward along the sidewalk to the FOOT of the SAME narrow concrete staircase, directly aligned with its slightly oblique axis, looking gently upwards toward the landing. Keep the same lens character and same sunny natural afternoon exposure; do not change season or time. The staircase now occupies about the center 40% of the frame, starting at bottom center and leading to an opening around 49% x and 51% y. It remains a short narrow asymmetric existing staircase, SAME step count, width and grey concrete materials as reference2; NOT a broad hotel staircase. Retain ONLY the slender steel HANDRAIL ON THE LEFT. Retain the planted pale concrete wall and existing black/yellow hotel schutzen sign to the left; the existing red-framed MENU DISPLAY with its little brown roof is immediately to the RIGHT of the stair and becomes a close prominent landmark at the right edge. Keep its unchanged shape, materials and contents, do not turn it into a plant pot. The same actual red-striped awning and its black support pole stand beyond the landing. The same dark wooden glazed hotel ground floor remains on the right, with the Grill Room Bar balcony above; window spacing and timber beams unchanged. Only perspective changes from camera translation. Retain small existing black chairs on the landing, leave the walking opening clear. Include the bottom pavement and first several treads in the lower foreground. No new symmetric railing, no grand stairs, no new façade, no red carpet, no furniture redesign, no new flags or flowers, no people. Do not show a different part of the hotel. Natural detailed concrete, real metal and glass reflections, highly realistic continuous documentary-style camera shot.
```

### steps-high

```text
Use case: photorealistic-natural. ONE 16:9 landscape cinematic keyframe for a continuous real walking shot, ideally 2304x1296 or larger. Reference1 is the immutable real Hotel Schützen architecture. Reference2 is the IMMEDIATELY PREVIOUS frame at the foot of its stair and must dictate exact furnishings, texture, lens, light, color, and perspective continuity. Move the same camera UP the same narrow concrete staircase by several steps, almost reaching its landing. Two or three of the SAME remaining steps occupy the lower 25–30% of frame. Human eye height above the new step, looking toward the actual terrace, not from ground level. Do not widen, symmetrize or redesign this existing staircase. The left metal handrail now exits at the LOWER LEFT, with its upper curved termination still visible. The existing red-framed menu case that was to the right is now very close at the far RIGHT edge and is partly cropped, seen in perspective from slightly above. The existing black hotel schutzen sign and planter are close at the LEFT edge and partly cropped as the camera passes them. Retain SAME red-striped retractable awning pole ahead, same actual glazed ground floor and Grill Room Bar balcony on the right, same precise timber/window geometry. The SAME black wicker chairs with reddish seat pads from reference2 remain ahead, now shift to the center-right as the camera looks a very gentle 6 degrees toward the open aisle on their LEFT. Keep a credible clear walking line from the top stair to the left of those chairs. The red-striped awning extends upper left, actual pale limestone cliff visible beyond; keep same valley direction, no relocated waterfall, no invented mountains. Warm natural clear afternoon light matches reference2 exactly. Preserve objects and their physical positions; only camera height, forward position and a tiny leftward gaze change. No new fire bowl yet, no new tablecloths, no new furniture, no new doors, no right-hand staircase rail, no giant flags, no people. Finely detailed real concrete treads, warm aged wood, truthful glass reflections and imperfect planting. Photographic, not CGI, no captions, no decorative borders.
```

### landing

```text
Use case: photorealistic-natural, continuous real-camera shot. ONE cinematic 16:9 landscape photograph (prefer 2304x1296 or larger). Reference1 is the immutable real Hotel Schützen architecture; reference2 is the immediately previous step in this SAME camera journey. The camera has now climbed the last two concrete steps and stands ON THE SAME TERRACE LANDING at adult eye height, taking one small forward step then looking about 16 degrees to the LEFT toward the valley-side terrace aisle. Preserve the exact established afternoon lighting, materials, furniture and lens. The old staircase is now BELOW and behind the camera; show only a very narrow bottom strip of its last concrete tread if needed, NOT a new wide staircase. The existing single LEFT metal handrail terminates at lower left and drops away behind. The large hotel schutzen sign is passed and disappears to far left; the menu case is passed and disappears to far right. Do not retain them floating ahead. The exact same black wicker chairs with red pads and the same small dark tables from reference2 are now along the RIGHT of the clear walking aisle, seen from eye level and from a little closer. The existing wood/glazed restaurant façade remains at the right side with matching beams, window count, timber, green-blue shutters and Grill Room Bar balcony above. Retain the SAME red-striped retractable canopy and its SAME metal pole, now toward the right side of the aisle, naturally shifted by the camera's left turn, not a newly designed giant awning. The center and lower left show authentic plain grey paved terrace, clear enough to continue walking gently toward a table on the valley side. Existing flower planters, natural scarlet geraniums and the authentic Swiss flag near the front edge remain plausible, restrained. The real pale cliff and green valley seen from this restaurant are in the upper-left distance; no newly invented snow panorama. The view must look like the next frame after reference2: unchanged building, unchanged objects, camera higher and slightly forward with a gentle left turn. No fire bowl or fondue in this frame yet, no white tablecloths, no new chairs, no grand resort terrace, no people, no typography. True photograph, no stylized render, real wood grain, natural glass reflections, patinated paving and believable scale.
```

### terrasse-turn

```text
Use case: photorealistic-natural / precise compositing for continuity. Produce ONE highly realistic landscape 16:9 frame lying HALFWAY between references1 and2 in a continuous film-like walk. Reference1 is the current landing view and controls the exact actual terrace architecture, striped awning, metal canopy pole, glass-fronted chalet, black wicker chairs with red cushions, grey pavement, lighting and camera lens. Reference2 is the next destination shot and controls the EXACT identifiable wooden dining table and red fondue setup we are approaching. Reference3 is the immutable original hotel photo, authoritative for real building identity. Move the camera just ONE METRE forward from reference1 along the existing terrace aisle and rotate its gaze gently RIGHT by about 8 degrees toward the destination table, keeping photographic perspective and scale plausible. The selected rectangular thick WEATHERED WOOD TABLE from reference2 is now clearly visible in center-right, taking about 48% of image width, from x40% to88%, at middle-lower frame. It is farther away and smaller than in reference2. On that SAME table: the SAME red enamel fondue caquelon with cream interior and handle pointing right, SAME black circular burner under it, SAME bread basket with red-white checked cloth on its left, SAME off-white plate in front-left, SAME stemmed white-wine glass to its right. Exact object identities and arrangement must survive the next approach. Table's front edge around 76% image height; pot center near 63% x / 62% y. The clear grey terrace walking aisle still leads toward it in the lower-left foreground. The EXISTING awning pole from reference1 moves naturally toward the left edge as we pass it; the existing striped retractable awning and real glazed dark-timber facade remain across upper-right, no new architecture, no changed windows or new doors. Retain existing black chairs with red cushions around neighboring tables. The modest metal fire bowl from reference2 is visible behind-left of the target table, with the same warm flame; red geraniums and genuine small Swiss flag along the valley-side edge. Keep real Lauterbrunnen valley and cliff direction coherent with reference1; do not invent a second waterfall or different mountain wall. Daylight, color, shadows and materials match BOTH frames, without changing time of day. No people or hands. Do not make a new table, new fondue, new terrace or giant resort. This is an intermediate camera translation and small turn, not a separate postcard. Ultra-photographic surfaces, believable optics and continuous scene geometry, no text, no borders, no stylization.
```

