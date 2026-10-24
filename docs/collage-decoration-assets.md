# Découpes décoratives — collage suisse

Deux photographies de synthèse générées avec l’outil intégré imagegen, en sortie transparente. Elles sont destinées au collage éditorial et ne documentent pas des objets présents dans l’établissement.

| Élément | Fichier livré | Dimensions | Poids | Pixels entièrement transparents |
| --- | --- | --- | --- | --- |
| Géranium rouge, pot de terre cuite patiné | `public/assets/collage/geranium.webp` | 1254 × 1254 | 507 392 octets | 39,88 % |
| Cabine rouge vintage, vue trois quarts | `public/assets/collage/cable-car.webp` | 1254 × 1254 | 230 202 octets | 62,72 % |

Les contours blancs sont intégrés aux images. Le fond est un véritable canal alpha RGBA, sans aplat. Les originaux PNG sont conservés dans `/workspace/scratch/da58fe833176/assets-work/swiss-collage/`, sous les noms `geranium-source.png` et `cable-car-source.png`. Export WebP qualité 90 ; alpha conservé pixel pour pixel. Contrôles : inspection visuelle, dimensions, canal alpha 0–255, contenu non vide, comparaison exacte de l’alpha avant et après export.

## Prompts de génération

### Géranium

Use case: photorealistic-natural. Asset type: isolated photographic cutout for a Swiss editorial paper collage website. Create one extremely realistic photograph of a lush small flowering red geranium plant in a weathered terracotta pot. Dense vivid scarlet flower heads, individually detailed petals, natural green lobed leaves, visible fine veins and slightly irregular stems, some leaves overhanging the pot. Real matte earthenware with subtle age and mineral traces, natural everyday proportions, not a plastic plant. Three-quarter front view at pot level, complete object wholly in frame, roughly square composition with 7 percent transparent margin around the entire irregular silhouette. Clean natural daylight with realistic surface detail and soft self-shadowing. The photograph itself must look completely real, like a carefully extracted high resolution camera photograph. Add a very thin approximately 8 pixel off-white cut paper edge immediately following the outer irregular contour of the plant and pot. It should feel like a real printed photograph cut out with scissors, not an illustration or outlined vector. Background is genuinely completely transparent alpha, including the surrounding empty space. No floor, no wall, no ground shadow, no background, no lettering, no logos, no extra objects, no holiday ornaments, no cartoon, no painting, no CGI, no 3D render.

### Téléphérique

Use case: photorealistic-natural. Asset type: isolated photographic cutout for a Swiss editorial paper collage website. Create one extremely realistic photograph of a small vintage Swiss aerial cable car cabin, seen from a three-quarter front and side angle, suspended and fully visible. Rich traditional Swiss red painted metal body with authentic slight weathering, dark nearly black glazed windows with subtle real sky reflections, clear thin metal window frames, believable metal suspension arm and compact upper attachment mechanism. Show a small short segment of actual steel cable above the attachment, entirely contained within the frame. Real mechanically plausible cabin of an alpine gondola, photographed at normal scale, not a toy. Entire cabin and cable assembly visible with 7 percent empty transparent margin, approximately square composition. Natural bright daylight and real crisp photographic material texture, modest highlights. Add a very thin approximately 8 pixel warm-white cut paper edge immediately following the full irregular outer silhouette, like a real printed photograph carefully cut out with scissors. The cabin within the cutout remains completely photographic. Background is genuine transparent alpha. No scenery, no mountains, no sky backdrop, no ground, no cast shadow onto a background, no passengers, no text, no number, no logos or brand, no festive ornaments, no cartoon, no drawing, no CGI, no 3D render.

