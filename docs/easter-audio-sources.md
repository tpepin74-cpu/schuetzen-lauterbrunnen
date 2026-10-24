# Easter egg audio — Schützen

## Cow

- Local file: `public/assets/easter/cow-moo.mp3`
- Original: [Cow moos #4 — BigSoundBank](https://bigsoundbank.com/cow-moos-4-s2384.html), recorded by **Joseph SARDIN**.
- Media URL: https://bigsoundbank.com/UPLOAD/mp3/2384.mp3
- License verified on 24 October 2026: **CC0**, permitting commercial use, editing and redistribution. Attribution is not required; provenance is retained here.
- [Publisher licensing information](https://bigsoundbank.com/licenses.html) · [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/)
- The publisher describes this as a real outdoor cow recording. It is not advertised as recorded in Switzerland.

## Preparation

The complete short call was retained. Gain was reduced by 7.5 dB, an 8 ms fade-in and 140 ms fade-out were added, and the file was encoded to mono MP3 at 44.1 kHz / 96 kbps. Original metadata was removed. No music or additional call was added.

The delivered file is **35,467 bytes**, with **2.88 seconds of decoded audio** (MP3 container duration: 2.926 seconds). The decoded peak is **−8.0 dBFS**, mean volume **−20.9 dBFS**. File hashes and processing settings are in `easter-audio-sources.json`.

## Integration

Play only after deliberate activation of the cow. Do not autoplay or loop; stop or suppress overlapping triggers and stop audio on navigation/hidden page. Use a visible « Meuh ! » response so the interaction remains understandable without sound. The output already has a moderate peak; a playback volume near 0.65 provides further restraint.

## Verification

The source page and license were read directly. The downloaded MP3 was decoded and re-encoded successfully, and `ffprobe` / `ffmpeg volumedetect` checked format, duration and output peak. Subjective listening was unavailable in this agent runtime, so no claim of an auditory review is made.
