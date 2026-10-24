# Swiss animal collage assets

Generated on 2026-10-24 with the built-in ImageGen tool, with `transparent_background: true`. These are generated photorealistic animals, not documentary photographs of animals at the restaurant. No external reference photograph was used for these two assets.

## Deliverables

| Asset | Active WebP | Dimensions | WebP size | Fully transparent pixels |
| --- | --- | --- | --- | --- |
| Saint-Bernard | `public/assets/collage/bernard.webp` | 1254 × 1254 | 262,944 bytes | 56.49% |
| Simmental cow | `public/assets/collage/cow.webp` | 1536 × 1024 | 294,998 bytes | 54.01% |

Source PNGs are kept outside the repository in `/workspace/scratch/da58fe833176/assets-work/swiss-collage/bernard-source.png` and `/workspace/scratch/da58fe833176/assets-work/swiss-collage/cow-source.png`.

## Prompt direction

Shared instruction: one isolated animal, full body with all paws or hooves visible, believable anatomy, ordinary natural fur, warm neutral daylight from the upper left. Photographic editorial detail, never illustration, CGI, or a painted texture. The animal is presented as a photograph cut out of paper, with a thin, slightly irregular matte white paper border of approximately 8–12 pixels and a restrained nearby shadow. Genuine transparent alpha outside the cutout; no ground, landscape, text, logo, watermark, or people.

**Saint-Bernard:** seated in a gentle three-quarter view, looking toward the viewer; broad head, natural jowls, white chest and paws, chestnut-red coat and dark face mask, soft eyes, slightly open mouth. One small cotton neckerchief in red and white gingham provides the seasonal accent. No costume, hat, or barrel.

**Cow:** Swiss Simmental standing in three-quarter view and turning its head toward the viewer; cream-white and chestnut-red patches, white face, pink mottled muzzle, short curved horns, natural fur, sturdy legs and visible udder. One modest leather collar with an aged brass bell and a small red ribbon. No costume or ceremonial headgear.

## Processing and checks

The generated PNGs were copied without image edits. WebP conversion used Pillow at quality 90, method 6, with alpha quality 100 and unchanged dimensions. Each output was written to a temporary file, reopened and validated, then renamed atomically to its active filename.

Both WebPs reopen as RGBA, contain nonzero image data, and have fully transparent corner pixels. The Saint-Bernard alpha range is 0–255; the cow alpha range is 0–254, matching its generated source. Both source images and optimized outputs were visually inspected for the intended animal, photographic texture, red accent, complete body and white paper edge.

Use the existing alpha channel when compositing on cream, red gingham, or photographic page sections. RGB values in completely transparent pixels are not visible content and must not be interpreted as an opaque background.
