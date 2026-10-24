"""Conservative, global camera projection for photographic keyframes.

Drop-in API: PhotoMorph(a, b, key, mobile=False).frame(t), RGB uint8 arrays.
No dense flow, triangle mesh, or independent deformation of architectural detail.
The default texture handover is an opaque match cut at the shared camera pose.
Set instance.handover = 'blend' for a 4%-of-segment centred texture transition.
Both endpoints are byte-exact inputs, including the final fondue frame.

Standalone QA, without altering the production renderer or assets:
  PYTHONPATH=/tmp/schuetzen_flow_runtime python scripts/cinematic_camera.py
  PYTHONPATH=/tmp/schuetzen_flow_runtime python scripts/cinematic_camera.py --profile mobile
"""
from pathlib import Path
import argparse
import json
import math

import cv2
import numpy as np

ROOT = Path(__file__).resolve().parents[1]

# Zero-based row indices in the manual landmark JSON. Only one depth family is
# used to determine each global camera. Near rail/menu anchors are intentionally
# excluded from the distant awning/facade fit: they have different parallax.
SELECTIONS = {
    'approach:steps-low': ([0, 1, 11, 12, 13, 14], [3, 3, 1, 1, 2, 2]),
    'steps-low:steps-high': ([0, 1, 3, 4, 5, 6], [3, 3, 2, 2, 1, 1]),
    'steps-high:landing': ([0, 1, 2, 3, 4, 5, 6], [3, 3, 2, 2, 1, 1, 1]),
    'landing:terrace-turn': ([1, 2, 3, 4, 5, 6, 7], [2, 2, 2, 1, 1, 1, 1]),
    'terrace-turn:table-wide': (list(range(14)), [3]*7 + [0.6]*7),
    'table-wide:table-approach': (list(range(12)), [3]*7 + [0.6]*5),
    'table-approach:fondue': (list(range(11)), [3]*6 + [0.6]*5),
}


def _landmarks(key, width, height, mobile):
    documents = {}
    for name in ('morph-anchors-architecture.json', 'morph-anchors-table.json'):
        path = ROOT/'docs'/name
        if path.exists():
            documents.update(json.loads(path.read_text()))
    explicit_mobile = mobile and ('mobile:'+key) in documents
    rows = documents.get(('mobile:' if explicit_mobile else '')+key, [])
    indices, weights = SELECTIONS.get(key, (list(range(len(rows))), [1]*len(rows)))
    points_a, points_b, chosen_weights = [], [], []
    for i, weight in zip(indices, weights):
        if i >= len(rows):
            continue
        xa, ya, xb, yb = rows[i]
        if mobile and not explicit_mobile:
            xa = (xa-.5)*(16/9)/(width/height)+.5
            xb = (xb-.5)*(16/9)/(width/height)+.5
            # This pair enters the dedicated mobile table photograph. Its pot
            # anchors are the source coordinates of the next mobile pair.
            if key == 'terrace-turn:table-wide':
                mobile_next = documents.get('mobile:table-wide:table-approach', [])
                if i < min(7, len(mobile_next)):
                    xb, yb = mobile_next[i][:2]
                else:
                    continue
        if not all(-.30 <= v <= 1.30 for v in (xa, ya, xb, yb)):
            continue
        points_a.append([xa*(width-1), ya*(height-1)])
        points_b.append([xb*(width-1), yb*(height-1)])
        chosen_weights.append(weight)
    return (np.asarray(points_a, dtype=np.float64),
            np.asarray(points_b, dtype=np.float64),
            np.asarray(chosen_weights, dtype=np.float64))


def _fit_similarity(a, b, weights, max_rotation=math.radians(3.5)):
    """Weighted Procrustes: translation, uniform scale, bounded rotation."""
    weights = weights/weights.sum()
    ca = np.sum(a*weights[:, None], axis=0)
    cb = np.sum(b*weights[:, None], axis=0)
    x, y = a-ca, b-cb
    # The two sufficient statistics avoid introducing a skew/shear matrix.
    dot = np.sum(weights*(x[:, 0]*y[:, 0] + x[:, 1]*y[:, 1]))
    cross = np.sum(weights*(x[:, 0]*y[:, 1] - x[:, 1]*y[:, 0]))
    angle = float(np.clip(math.atan2(cross, dot), -max_rotation, max_rotation))
    c, s = math.cos(angle), math.sin(angle)
    rotation = np.array([[c, -s], [s, c]])
    rotated = x@rotation.T
    denominator = np.sum(weights*np.sum(x*x, axis=1))
    scale = np.sum(weights*np.sum(rotated*y, axis=1))/max(denominator, 1e-8)
    scale = float(np.clip(scale, .82, 2.8))
    residual = np.linalg.norm(rotated*scale+cb-b, axis=1)
    return ca, cb, scale, angle, residual


def _homogeneous(linear, translation):
    out = np.eye(3, dtype=np.float64)
    out[:2, :2] = linear
    out[:2, 2] = translation
    return out


class PhotoMorph:
    def __init__(self, a, b, key, mobile=False):
        if a.shape != b.shape or a.ndim != 3 or a.shape[2] != 3:
            raise ValueError('a and b must have the same RGB shape')
        self.a, self.b, self.key = a, b, key
        self.h, self.w = a.shape[:2]
        self.handover = 'cut'
        pa, pb, weights = _landmarks(key, self.w, self.h, mobile)
        self.points = self.manual = len(pa)
        self.tris = []  # Existing renderer reporting remains compatible.
        if len(pa) >= 2:
            # A single mild robustness pass reduces a mistracked object, while
            # preserving the dominant, intentionally selected structural plane.
            ca, cb, scale, angle, residual = _fit_similarity(pa, pb, weights)
            threshold = max(min(self.w, self.h)*.022, np.median(residual)*1.6)
            robust_weights = weights*np.minimum(1, threshold/np.maximum(residual, 1e-6))
            ca, cb, scale, angle, residual = _fit_similarity(pa, pb, robust_weights)
            self.residual_px = float(np.sqrt(np.average(residual**2, weights=robust_weights)))
        else:
            ca = cb = np.array([(self.w-1)/2, (self.h-1)/2], dtype=np.float64)
            scale, angle = 1., 0.
            self.residual_px = 0.
        self.ca, self.cb = ca, cb
        self.scale, self.angle = scale, angle
        c, s = math.cos(angle), math.sin(angle)
        linear = scale*np.array([[c, -s], [s, c]])
        self.H = _homogeneous(linear, cb-linear@ca)
        self.inverse = np.linalg.inv(self.H)
        self.center = np.array([(self.w-1)/2, (self.h-1)/2])
        self.corners = np.array([[0, 0, 1], [self.w-1, 0, 1],
                                 [self.w-1, self.h-1, 1], [0, self.h-1, 1]], dtype=np.float64)

    def _pose(self, t):
        # Log scale keeps forward magnification uniform; the shared target point
        # travels continuously. No vertex can fold because the map is global.
        scale = math.exp(math.log(self.scale)*t)
        angle = self.angle*t
        c, s = math.cos(angle), math.sin(angle)
        linear = scale*np.array([[c, -s], [s, c]])
        center = self.ca*(1-t)+self.cb*t
        return _homogeneous(linear, center-linear@self.ca)

    def _zoom_matrix(self, zoom):
        return _homogeneous(np.eye(2)*zoom, self.center*(1-zoom))

    def _covers(self, matrix):
        uv = self.corners@np.linalg.inv(matrix).T
        return (np.min(uv[:, 0]) >= -.25 and np.max(uv[:, 0]) <= self.w-.75 and
                np.min(uv[:, 1]) >= -.25 and np.max(uv[:, 1]) <= self.h-.75)

    def _required_zoom(self, matrices):
        # A modest overscan hides newly uncovered edges without reflected walls
        # or stretched border pixels. It is a second global camera transform.
        lo, hi = 1., 1.
        if all(self._covers(m) for m in matrices):
            return 1.
        while hi < 3.2 and not all(self._covers(self._zoom_matrix(hi)@m) for m in matrices):
            hi *= 1.12
        for _ in range(18):
            mid = (lo+hi)/2
            if all(self._covers(self._zoom_matrix(mid)@m) for m in matrices):
                hi = mid
            else:
                lo = mid
        return hi

    def _warps(self, t):
        ma = self._pose(t)
        mb = ma@self.inverse
        # Include both images briefly at the handover, with a soft overscan
        # envelope so choosing the opaque source never changes camera framing.
        za = self._required_zoom([ma])
        zb = self._required_zoom([mb])
        handover = math.exp(-((t-.5)/.095)**4)
        chosen = za if t < .5 else zb
        zoom = chosen*(1-handover)+max(za, zb)*handover
        z = self._zoom_matrix(zoom)
        return z@ma, z@mb

    def _warp(self, source, matrix):
        return cv2.warpAffine(source, matrix[:2].astype(np.float32),
                              (self.w, self.h), flags=cv2.INTER_CUBIC,
                              borderMode=cv2.BORDER_REPLICATE)

    def frame(self, t):
        t = float(np.clip(t, 0, 1))
        if t <= 1e-8:
            return self.a
        if t >= 1-1e-8:
            return self.b
        ma, mb = self._warps(t)
        if self.handover == 'blend' and .48 < t < .52:
            mix = (t-.48)/.04
            mix = mix*mix*(3-2*mix)
            return cv2.addWeighted(self._warp(self.a, ma), 1-mix,
                                   self._warp(self.b, mb), mix, 0)
        return self._warp(self.a, ma) if t < .5 else self._warp(self.b, mb)


def _main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--profile', choices=['desktop', 'mobile'], default='desktop')
    parser.add_argument('--handover', choices=['cut', 'blend'], default='cut')
    parser.add_argument('--output', default='/workspace/scratch/da58fe833176/camera-qa')
    args = parser.parse_args()
    from PIL import Image
    cv2.setNumThreads(2)
    mobile = args.profile == 'mobile'
    width, height = (900, 1350) if mobile else (1600, 900)
    manifest = json.loads((ROOT/'public/assets/cinematic/sequence.json').read_text())
    variants = manifest.get('mobile', {}).get('frames', []) if mobile else []
    frames = [{**frame, **next((v for v in variants if v['id'] == frame['id']), {})}
              for frame in manifest['frames']]

    def read(frame):
        with Image.open(ROOT/'public'/frame['src'].lstrip('/')) as image:
            image = image.convert('RGB')
            scale = max(width/image.width, height/image.height)
            left = (image.width-width/scale)/2
            top = (image.height-height/scale)/2
            return np.asarray(image.resize((width, height), Image.Resampling.LANCZOS,
                              box=(left, top, left+width/scale, top+height/scale))).copy()

    photos = {frame['id']: read(frame) for frame in frames}
    models = {}
    output = Path(args.output)
    output.mkdir(parents=True, exist_ok=True)

    def render(progress):
        i = next((j for j in range(len(frames)-1) if progress < frames[j+1]['p']), len(frames)-1)
        a, b = frames[i], frames[min(i+1, len(frames)-1)]
        if a is b:
            return photos[a['id']]
        key = a['id']+':'+b['id']
        if key not in models:
            model = PhotoMorph(photos[a['id']], photos[b['id']], key, mobile)
            model.handover = args.handover
            models[key] = model
            print(json.dumps({'pair': key, 'landmarks': model.points,
                              'scale': round(model.scale, 4),
                              'rotation_deg': round(math.degrees(model.angle), 3),
                              'residual_px': round(model.residual_px, 2)}), flush=True)
        t = (progress-a['p'])/(b['p']-a['p'])
        return models[key].frame(t)

    samples = [.19, .2375, .285, .3125, .34, .3675, .395, .405, .415,
               .425, .435, .4625, .49, .524, .558]
    for p in samples:
        Image.fromarray(render(p)).save(output/f'{args.profile}-{args.handover}-{p:.4f}.jpg', quality=93)
    # Additional neighbours expose discontinuities at the short texture switch.
    for p in [.2375, .3675, .405, .425]:
        for delta in [-.001, .001]:
            Image.fromarray(render(p+delta)).save(output/f'{args.profile}-{args.handover}-{p+delta:.4f}.jpg', quality=93)
    final = render(frames[-1]['p'])
    assert np.array_equal(final, photos[frames[-1]['id']])
    print(f'{args.profile}: {len(samples)+8} samples, exact final frame, output {output}', flush=True)


if __name__ == '__main__':
    _main()
