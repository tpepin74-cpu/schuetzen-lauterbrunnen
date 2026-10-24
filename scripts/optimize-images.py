#!/usr/bin/env python3
"""Create responsive WebP derivatives; keep all source photographs unchanged.

This script does not rewrite application files. Consumers keep each original `src`
for the Easter-egg matching and use the manifest's `srcset`/`sizes` candidates.
"""
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from hashlib import sha256
from html.parser import HTMLParser
from pathlib import Path
import json
import re

from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = ROOT / 'public'
QUALITY = 84


def record(path, role='full'):
    with Image.open(path) as image:
        width, height = image.size
        alpha = 'A' in image.getbands()
    return {'url': '/' + path.relative_to(PUBLIC).as_posix(), 'width': width,
            'height': height, 'bytes': path.stat().st_size, 'alpha': alpha, 'role': role}


def optimize(source):
    original = record(source)
    original_hash = sha256(source.read_bytes()).hexdigest()
    relative = source.relative_to(PUBLIC)
    if relative.parts[0] == 'img':
        group, widths = 'photograph', [480, 960, 1440]
        destination = PUBLIC / 'img' / 'optimized'
    else:
        group = relative.parts[1]
        widths = ([160, 320] if group == 'easter' else [320, 480] if group == 'menu'
                  else [240, 480] if source.stem.startswith('concierge') else [320, 640, 960])
        destination = PUBLIC / 'assets' / 'optimized' / group
    destination.mkdir(parents=True, exist_ok=True)
    variants = []
    with Image.open(source) as raw:
        image = ImageOps.exif_transpose(raw).convert('RGBA' if original['alpha'] else 'RGB')
        for index, width in enumerate(widths):
            if width >= image.width:
                continue
            height = max(1, round(image.height * width / image.width))
            target = destination / f'{source.stem}-{width}.webp'
            valid = False
            if target.exists() and target.stat().st_mtime >= source.stat().st_mtime:
                try:
                    with Image.open(target) as cached:
                        valid = cached.size == (width, height)
                        cached.verify()
                except (OSError, ValueError):
                    valid = False
            if not valid:
                resized = image.resize((width, height), Image.Resampling.LANCZOS)
                options = {'format': 'WEBP', 'quality': QUALITY, 'method': 6, 'exact': True}
                if raw.info.get('icc_profile'):
                    options['icc_profile'] = raw.info['icc_profile']
                temporary = target.with_suffix('.tmp.webp')
                resized.save(temporary, **options)
                temporary.replace(target)
            candidate = record(target, ['small', 'medium', 'large'][index])
            mobile = source.with_name(source.stem + '-m.webp')
            if relative.parts[0] == 'img' and mobile.exists():
                existing = record(mobile, candidate['role'])
                if (existing['width'], existing['height']) == (width, height) and existing['bytes'] <= candidate['bytes']:
                    target.unlink()
                    candidate = existing
            if candidate['bytes'] < original['bytes']:
                variants.append(candidate)
            elif candidate['url'].startswith('/img/optimized/') or candidate['url'].startswith('/assets/optimized/'):
                target.unlink(missing_ok=True)
    assert sha256(source.read_bytes()).hexdigest() == original_hash, f'Source changed: {source}'
    candidates = variants + [original]
    candidates.sort(key=lambda item: item['width'])
    return original['url'], {
        'group': group, 'original': {**original, 'sha256': original_hash},
        'small': candidates[0], 'medium': candidates[min(1, len(candidates)-1)],
        'full': original, 'candidates': candidates,
        'srcset': ', '.join(f"{item['url']} {item['width']}w" for item in candidates),
    }


class PageImages(HTMLParser):
    def __init__(self):
        super().__init__()
        self.images = []
        self.resources = []
    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if tag == 'img':
            if data.get('src'):
                self.images.append(data)
        if tag == 'link' and data.get('rel') == 'stylesheet':
            self.resources.append({'kind': 'stylesheet', 'url': data.get('href', '')})
        if tag == 'script' and data.get('src'):
            self.resources.append({'kind': 'module' if data.get('type') == 'module' else 'script', 'url': data['src']})


def total_tree(path):
    files = [item for item in path.rglob('*') if item.is_file()]
    return {'files': len(files), 'bytes': sum(item.stat().st_size for item in files)}


def audit_loaded_sources():
    pages, modules, css = {}, set(), set()
    def visit(path):
        if not path.exists() or path in modules:
            return
        modules.add(path)
        for relative in re.findall(r"^import\s+(?:[^;]*?\sfrom\s+)?['\"](\.[^'\"]+)['\"]", path.read_text(), re.M):
            child = (path.parent / relative).resolve()
            if child.suffix == '.css':
                css.add(child)
            elif child.suffix in ('.js', '.jsx', '.ts', '.tsx'):
                visit(child)
    for path in sorted(ROOT.glob('*.html')):
        parser = PageImages()
        parser.feed(path.read_text())
        resources = []
        for item in parser.resources:
            url = item['url']
            source = ROOT / url.lstrip('/') if url.startswith('/src/') else PUBLIC / url.lstrip('/')
            resources.append({**item, 'local_bytes': source.stat().st_size if source.exists() else None})
            if item['kind'] == 'module':
                visit(source)
        pages[path.name] = {'html_bytes': path.stat().st_size, 'declared_resources': resources}
    return {
        'note': 'Source-file bytes before production minification/compression. Module imports are bundled by Vite; do not add these totals to the production bundle. External package sizes are not measured here. Browser transfer depends on compression, caching and language selection.',
        'pages': pages,
        'active_imported_css': [{'file': str(path.relative_to(ROOT)), 'bytes': path.stat().st_size} for path in sorted(css)],
        'active_imported_css_total': sum(path.stat().st_size for path in css),
        'active_local_js_modules': [{'file': str(path.relative_to(ROOT)), 'bytes': path.stat().st_size} for path in sorted(modules)],
        'fonts': [{'file': str(path.relative_to(PUBLIC)), 'bytes': path.stat().st_size} for path in sorted((PUBLIC/'assets').glob('*.woff'))],
    }


def main():
    public_before = sum(p.stat().st_size for p in PUBLIC.rglob('*') if p.is_file() and 'optimized' not in p.parts)
    sources = list((PUBLIC / 'assets' / 'collage').glob('*.webp'))
    sources += list((PUBLIC / 'assets' / 'menu').glob('*.webp'))
    sources += list((PUBLIC / 'assets' / 'easter').glob('*.webp'))
    sources += [p for p in (PUBLIC / 'img').glob('*.webp')
                if not p.stem.endswith('-m') and not p.stem.startswith('logo')]
    with ThreadPoolExecutor(max_workers=4) as executor:
        images = dict(executor.map(optimize, sorted(sources)))
    # Existing 960 px mobile originals reuse the new derivatives of their full photo.
    for mobile in sorted((PUBLIC / 'img').glob('*-m.webp')):
        base_url = '/img/' + mobile.stem[:-2] + '.webp'
        if base_url not in images:
            continue
        original = record(mobile)
        choices = [c for c in images[base_url]['candidates'] if c['width'] < original['width']]
        choices.append(original)
        images[original['url']] = {
            'group': 'photograph-mobile-original', 'original': original,
            'small': choices[0], 'medium': choices[-1], 'full': original,
            'candidates': choices,
            'srcset': ', '.join(f"{item['url']} {item['width']}w" for item in choices),
        }
    groups = {}
    for url, item in images.items():
        if item['group'].endswith('-original'):
            continue
        data = groups.setdefault(item['group'], {'sources': 0, 'original_bytes': 0, 'small_bytes': 0, 'medium_bytes': 0})
        data['sources'] += 1
        data['original_bytes'] += item['original']['bytes']
        data['small_bytes'] += item['small']['bytes']
        data['medium_bytes'] += item['medium']['bytes']
    for group in groups.values():
        group['small_reduction_percent'] = round(100 * (1-group['small_bytes']/group['original_bytes']), 1)
        group['medium_reduction_percent'] = round(100 * (1-group['medium_bytes']/group['original_bytes']), 1)
    pages = {}
    for path in sorted(ROOT.glob('*.html')):
        parser = PageImages()
        parser.feed(path.read_text())
        eager = {('/' + image['src'].lstrip('/')) for image in parser.images if image.get('loading') != 'lazy'}
        eligible = sorted(url for url in eager if url in images)
        pages[path.name] = {
            'html_image_count': len(parser.images), 'eager_unique_images_with_variants': eligible,
            'eager_src_original_bytes': sum(images[url]['original']['bytes'] for url in eligible),
            'eager_small_candidate_bytes': sum(images[url]['small']['bytes'] for url in eligible),
            'eager_medium_candidate_bytes': sum(images[url]['medium']['bytes'] for url in eligible),
        }
    archives = {str(path.relative_to(PUBLIC)): total_tree(path)
                for path in sorted(PUBLIC.glob('version-*')) if path.is_dir()}
    inactive_assets = {str(path.relative_to(PUBLIC)): total_tree(path)
                       for path in [PUBLIC/'assets'/'immersive', PUBLIC/'assets'/'journey'] if path.exists()}
    inactive_assets['assets/original-*.webp'] = {
        'files': len(list((PUBLIC/'assets').glob('original-*.webp'))),
        'bytes': sum(p.stat().st_size for p in (PUBLIC/'assets').glob('original-*.webp')),
    }
    report = {
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'method': {'library': 'Pillow', 'format': 'WebP', 'quality': QUALITY, 'method': 6,
                   'resize': 'Lanczos, no upscaling', 'alpha_preserved': True, 'originals_preserved': True,
                   'candidate_policy': 'Discard derivatives heavier than the full original; reuse an existing mobile file when it has identical dimensions and fewer bytes.'},
        'integration': 'Keep original src paths for Easter-egg matching; add the candidate srcset and a sizes attribute appropriate to the actual CSS width. No HTML/JS/CSS was changed by this script.',
        'measurement_limit': 'Static file sizes and declared eager image candidates, not measured browser transfers, Lighthouse results or Core Web Vitals. srcset selection depends on viewport, DPR and sizes; lazy images load later.',
        'public_original_bytes': public_before,
        'optimized_generated': {
            'assets': total_tree(PUBLIC/'assets'/'optimized'),
            'photographs': total_tree(PUBLIC/'img'/'optimized'),
        },
        'groups': groups, 'pages': pages,
        'loaded_source_audit': audit_loaded_sources(),
        'inactive_public_versions': archives, 'inactive_public_assets': inactive_assets,
        'build_exclusions_recommended': ['version-2/**', 'version-collage/**', 'version-fondue/**',
            'assets/immersive/**', 'assets/journey/**', 'assets/original-*.webp'],
        'build_exclusion_note': 'Keep these historical sources in Git. They are not referenced by the active pages; excluding them from dist reduces deployment/archive weight, not the initial page transfer. Apply exclusions only in the build, never remove originals as part of this script.',
        'images': dict(sorted(images.items())),
    }
    target = ROOT/'docs'/'performance-assets.json'
    target.write_text(json.dumps(report, ensure_ascii=False, indent=2)+'\n')
    print(json.dumps({'manifest': str(target), 'images': len(images), 'groups': groups,
                      'generated': report['optimized_generated'], 'archives': archives}, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
