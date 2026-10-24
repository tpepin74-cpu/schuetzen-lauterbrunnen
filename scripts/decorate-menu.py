"""Add photographic cutouts without changing the restaurant's supplied menu data."""
from pathlib import Path
from html import escape, unescape
import json
import re

ROOT = Path(__file__).resolve().parents[1]
page = ROOT / "restaurant.html"
entries = json.loads((ROOT / "src/menu-photos.json").read_text())
source = page.read_text()
rows = list(re.finditer(r'<li class="dish(?: dish--photo)?"[^>]*>(.*?)</li>', source, re.S))
assert len(rows) == len(entries) == 45


def plain(markup):
    return unescape(re.sub(r'<[^>]+>', '', markup)).strip()


replacements = []
for row, entry in zip(rows, entries):
    content = row.group(1)
    title = re.search(r'<h4 class="dish__n">.*?</h4>', content, re.S).group()
    title_without_tag = re.sub(r'<span class="dish__tag".*?</span>', '', title, flags=re.S)
    assert plain(title_without_tag) == entry['name'], entry['id']
    price = re.search(r'<span class="dish__p">(.*?)</span>', content, re.S)
    assert plain(price.group(1)) == entry['price'], entry['id']
    description = re.search(r'<p class="dish__d">.*?</p>', content, re.S)
    description = description.group() if description else ''
    assert plain(description) == entry['description'], entry['id']
    image_file = ROOT / 'public' / entry['image'].lstrip('/')
    width = height = 640
    if image_file.exists():
        from PIL import Image
        with Image.open(image_file) as image:
            width, height = image.size
    currency = '<span class="dish__currency">CHF</span>' if entry['price'] != 'offert' else ''
    replacement = f'''<li class="dish dish--photo" data-menu-item="{entry['id']}">
  <div class="dish__visual"><img src="{entry['image']}" width="{width}" height="{height}" alt="{escape(entry['name'], quote=True)} — suggestion de présentation" loading="lazy" decoding="async" draggable="false"></div>
  <div class="dish__body"><div class="dish__h">{title}</div>{description}<div class="dish__price">{currency}{price.group()}</div></div>
</li>'''
    replacements.append((row.start(), row.end(), replacement))

for start, end, replacement in reversed(replacements):
    source = source[:start] + replacement + source[end:]
source = source.replace('<div class="carte" data-carte>', '<div class="carte carte--illustrated" data-carte>')
if 'carte__photo-note' not in source:
    source = source.replace('<div class="carte carte--illustrated" data-carte>', '<div class="carte carte--illustrated" data-carte>\n    <p class="carte__intro">Les spécialités du chalet et de quoi trinquer. Faites votre choix, à votre rythme.</p>')
    source = source.replace('<div class="carte__foot">', '<p class="carte__photo-note">Photographies d’illustration ; la présentation peut varier.</p>\n    <div class="carte__foot">')

# Keep native, independently expandable category sections. The first view features
# the chalet specialties, exactly as in the original page.
start = source.index('id="carte-food"')
end = source.index('<dl class="carte__origin"', start)
menu = source[start:end]
menu = re.sub(r'<summary>(?!<span class="menu-category")(.*?) <small>(.*?)</small></summary>', r'<summary><span class="menu-category">\1<small>\2</small></span></summary>', menu)
source = source[:start] + menu + source[end:]
page.write_text(source)
print(f"Decorated {len(entries)} menu entries; original names, descriptions and prices preserved.")
