# Fondue scene assets

Generated with the built-in image generation tool, using the four original Schützen photographs as architectural references. These are artistic scene reconstructions for an interactive prototype, not documentary photographs of the actual terrace arrangement or food service.

## Files

| File | Canvas | Use |
| --- | --- | --- |
| fondue-base.webp | 1672 × 941 | Photographic terrace and table scene, no hands |
| fondue-mobile.webp | 1024 × 1536 | Dedicated portrait table scene, no hands, about 459 KB |
| left-bread.webp | 1536 × 1024 | Left hand holding bread |
| left-empty.webp | 1536 × 1024 | Same left hand after releasing bread |
| right-fork.webp | 1536 × 1024 | Right hand holding bare fondue fork |
| right-cheese.webp | 1536 × 1024 | Same right hand/fork with coated bread |
| bread-cube.webp | 1254 × 1254 | Separate plain bread for transfer animation |

PNG originals are retained with the working assets. Alpha transparency is retained for all hand and bread sprites. The two files with `-initial` are preliminary working variants; prefer the final filenames above. Published files are in `public/assets/journey/`: `fondue-base.webp` is named `fondue.webp` there, and `bread-cube.webp` is named `bread.webp`.

The desktop rig uses a 1600 × 900 SVG coordinate space; the mobile rig uses a dedicated 900 × 1350 coordinate space with the portrait background, separate hand positions and pot masks. Bread ownership changes instantly at progress `.739`. The right wrist rotates to approximately −38° on desktop and −60° on mobile during the dip and stir so that the grip remains above the caquelon. These are implementation coordinates, separate from the source-image anchors below.

## Anchors

Coordinates use each source canvas before transforms.

- Base fondue opening center: approximately (852, 596), or (0.510, 0.633). Opening ellipse spans roughly x=540–1180, y=520–663.
- Left hand bread center: approximately (875, 330). Empty hand has the same pinch gap and pose.
- Bare right fork extreme tip: approximately (63, 84). Grip approximately (1025, 655).
- Coated bread on right fork: center approximately (109, 132); cheese tail reaches y≈305. Right hand and shaft are preserved from the empty-fork reference.

## Prompt set

1. **Terrace fondue base.** Hyperreal natural photograph in first-person view at a table on the actual Schützen terrace, matching the four provided reference photographs: timber chalet, green shutters, Swiss flags, red geraniums, real Lauterbrunnen cliff and Staubbach waterfall. Warm afternoon daylight, red caquelon with molten cheese in the lower center, bread basket left, wine glass right, discreet fire bowl behind. No hands or forks. Leave foreground clear for compositing.
2. **Left hand with bread.** Isolated first-person left hand and beige knit cuff entering from bottom left, naturally pinching one rustic bread cube. Natural skin texture and five fingers, warm side lighting matching the base. Transparent background, no scene.
3. **Right hand with fork.** Isolated first-person right hand and same beige cuff from bottom right, holding a long straight stainless steel two-prong fondue fork with dark wooden handle. Empty tip points diagonally upper left. Photographic anatomy and lighting, transparent background.
4. **Alpha cleanup.** Preserve each sprite's exact pose, shape, scale and material, remove background glow and shadow beyond the true object silhouette. Clean alpha transparency outside hand, sleeve, bread and fork.
5. **Right fork with cheese.** Preserve exact right hand, fork and cuff. Add rustic bread cube on the upper-left fork prongs, lightly coated with glossy pale melted cheese and a short thin cheese strand. No other changes, transparent alpha.
6. **Left hand release.** Preserve exact left hand and cuff pose, scale and lighting; remove only the bread, leaving the pinch gap transparent, fingers unchanged.
7. **Separate bread cube.** Isolate the same rustic bread texture, crust, shape and angle into a standalone transparent cutout, no hands, fork or cheese.

The files were optimized through format conversion only; no pixel content editing was performed outside the image generation tool.
