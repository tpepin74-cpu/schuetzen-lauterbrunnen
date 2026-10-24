const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };

function makeLayer() {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 1;
  return { canvas, ctx: canvas.getContext('2d', { alpha: true }) };
}

function fitLayer(layer, width, height) {
  if (layer.canvas.width !== width || layer.canvas.height !== height) {
    layer.canvas.width = width; layer.canvas.height = height;
  }
  layer.ctx.setTransform(1, 0, 0, 1, 0, 0);
  layer.ctx.globalAlpha = 1;
  layer.ctx.globalCompositeOperation = 'source-over';
  layer.ctx.clearRect(0, 0, width, height);
}

// Bilinear sampling of byte-exact Uint16 flow values in logical image space.
function meshFlow(resource, columns, rows, range) {
  const flow = resource.flow;
  const key = `${columns}:${rows}:${range}`;
  if (flow.mesh?.key === key) return flow.mesh.values;
  const values = new Float32Array((columns + 1) * (rows + 1) * 2);
  const { width, height, data } = flow;
  for (let row = 0; row <= rows; row++) for (let column = 0; column <= columns; column++) {
    const x = clamp(column / columns * width - .5, 0, width - 1);
    const y = clamp(row / rows * height - .5, 0, height - 1);
    const x0 = Math.floor(x), y0 = Math.floor(y), x1 = Math.min(x0 + 1, width - 1), y1 = Math.min(y0 + 1, height - 1);
    const tx = x - x0, ty = y - y0;
    const a = (y0 * width + x0) * 2, b = (y0 * width + x1) * 2;
    const c = (y1 * width + x0) * 2, d = (y1 * width + x1) * 2;
    const at = (row * (columns + 1) + column) * 2;
    for (let axis = 0; axis < 2; axis++) {
      const upper = data[a + axis] * (1 - tx) + data[b + axis] * tx;
      const lower = data[c + axis] * (1 - tx) + data[d + axis] * tx;
      values[at + axis] = (((upper * (1 - ty) + lower * ty) / 65535) - .5) * 2 * range;
    }
  }
  flow.mesh = { key, values };
  return values;
}

function triangle(ctx, bitmap, mesh, i0, i1, i2) {
  const { sx, sy, dx, dy } = mesh;
  const x0 = dx[i0], y0 = dy[i0], x1 = dx[i1], y1 = dy[i1], x2 = dx[i2], y2 = dy[i2];
  if (Math.max(x0,x1,x2) < -1 || Math.min(x0,x1,x2) > ctx.canvas.width + 1 || Math.max(y0,y1,y2) < -1 || Math.min(y0,y1,y2) > ctx.canvas.height + 1) return;
  const du1 = sx[i1] - sx[i0], dv1 = sy[i1] - sy[i0], du2 = sx[i2] - sx[i0], dv2 = sy[i2] - sy[i0];
  const det = du1 * dv2 - du2 * dv1;
  const screenArea = (x1 - x0) * (y2 - y0) - (x2 - x0) * (y1 - y0);
  // Inconsistent/occluded flow cells must not turn the photograph inside out.
  if (Math.abs(det) < .001 || screenArea * det <= .001) return;
  const a = ((x1 - x0) * dv2 - (x2 - x0) * dv1) / det;
  const c = ((x2 - x0) * du1 - (x1 - x0) * du2) / det;
  const b = ((y1 - y0) * dv2 - (y2 - y0) * dv1) / det;
  const d = ((y2 - y0) * du1 - (y1 - y0) * du2) / det;
  const e = x0 - a * sx[i0] - c * sy[i0], f = y0 - b * sx[i0] - d * sy[i0];
  const cx = (x0 + x1 + x2) / 3, cy = (y0 + y1 + y2) / 3;
  const bleed = .55;
  ctx.save(); ctx.beginPath();
  for (const index of [i0, i1, i2]) {
    const vx = dx[index] - cx, vy = dy[index] - cy, length = Math.hypot(vx, vy) || 1;
    const x = dx[index] + vx / length * bleed, y = dy[index] + vy / length * bleed;
    if (index === i0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  }
  ctx.closePath(); ctx.clip();
  ctx.setTransform(a, b, c, d, e, f);
  ctx.drawImage(bitmap, 0, 0);
  ctx.restore();
}

/** One visible Canvas2D; private buffers are reused for seam-free compositing. */
export function createCinematicCanvas2D(canvas) {
  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error('Canvas unavailable');
  const blend = makeLayer(), reveal = makeLayer(), mask = makeLayer();
  const workspaces = new Map();

  function drawImage(asset, target, alpha, logicalAspect, zoom = 1, focusY = .5, sourceAspect = asset?.width / asset?.height) {
    if (!asset?.image || alpha <= 0) return;
    const w = target.canvas.width, h = target.canvas.height, viewport = w / h;
    let spanX = Math.min(1, logicalAspect / sourceAspect);
    let spanY = Math.min(1, sourceAspect / logicalAspect);
    spanX *= Math.min(1, viewport / logicalAspect) / zoom;
    spanY *= Math.min(1, logicalAspect / viewport) / zoom;
    target.globalAlpha = alpha;
    target.drawImage(asset.image, (.5 - spanX / 2) * asset.width, clamp(focusY - spanY / 2, 0, 1 - spanY) * asset.height,
      spanX * asset.width, spanY * asset.height, 0, 0, w, h);
    target.globalAlpha = 1;
  }

  function drawMesh(asset, map, fraction, state, target, sourceAspect) {
    const logicalAspect = state.logicalAspect;
    const columns = logicalAspect < 1 ? 12 : 20;
    const rows = logicalAspect < 1 ? 18 : 12;
    const key = `${columns}:${rows}`;
    let mesh = workspaces.get(key);
    if (!mesh) {
      const count = (columns + 1) * (rows + 1);
      mesh = { sx: new Float32Array(count), sy: new Float32Array(count), dx: new Float32Array(count), dy: new Float32Array(count) };
      workspaces.set(key, mesh);
    }
    const vector = meshFlow(map, columns, rows, state.range);
    const iw = asset.width, ih = asset.height, w = target.canvas.width, h = target.canvas.height;
    const sourceX = Math.min(1, logicalAspect / sourceAspect), sourceY = Math.min(1, sourceAspect / logicalAspect);
    const viewportX = Math.min(1, w / h / logicalAspect), viewportY = Math.min(1, logicalAspect / (w / h));
    for (let row = 0; row <= rows; row++) for (let column = 0; column <= columns; column++) {
      const index = row * (columns + 1) + column;
      const qx = column / columns, qy = row / rows;
      mesh.sx[index] = (.5 + (qx - .5) * sourceX) * iw;
      mesh.sy[index] = (.5 + (qy - .5) * sourceY) * ih;
      mesh.dx[index] = (.5 + (qx + vector[index * 2] * fraction - .5) / viewportX) * w;
      mesh.dy[index] = (.5 + (qy + vector[index * 2 + 1] * fraction - .5) / viewportY) * h;
    }
    for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) {
      const topLeft = row * (columns + 1) + column;
      const topRight = topLeft + 1, bottomLeft = topLeft + columns + 1, bottomRight = bottomLeft + 1;
      triangle(target, asset.image, mesh, topLeft, topRight, bottomRight);
      triangle(target, asset.image, mesh, topLeft, bottomRight, bottomLeft);
    }
  }

  function sequence(state, target = ctx) {
    const t = clamp(state.t);
    if (t <= .00001 || state.a === state.b) { drawImage(state.a, target, 1, state.logicalAspect, 1, .5, state.aspectA); return; }
    if (t >= .99999) { drawImage(state.b, target, 1, state.logicalAspect, 1, .5, state.aspectB); return; }
    drawImage(state.a, target, 1, state.logicalAspect, 1, .5, state.aspectA);
    if (!state.forward?.flow || !state.backward?.flow) {
      drawImage(state.b, target, smooth(.34, .66, t), state.logicalAspect, 1, .5, state.aspectB);
      return;
    }
    // A is projected forward by t. B is projected backwards by 1-t.
    // Compose B once as a complete layer, keeping triangle overlap invisible.
    drawMesh(state.a, state.forward, t, state, target, state.aspectA);
    fitLayer(blend, target.canvas.width, target.canvas.height);
    drawMesh(state.b, state.backward, 1 - t, state, blend.ctx, state.aspectB);
    target.globalAlpha = t;
    target.drawImage(blend.canvas, 0, 0);
    target.globalAlpha = 1;
  }

  function aperturePath(target, state, opening) {
    const w = target.canvas.width, h = target.canvas.height, ratio = w / h;
    const spanX = Math.min(1, ratio / state.logicalAspect), spanY = Math.min(1, state.logicalAspect / ratio);
    const radius = -.20 + opening * 1.03;
    const side = (screenY, direction) => {
      const y = .5 + (screenY - .5) * spanY;
      const irregular = Math.sin(y * 12 + state.p * 32) * .060 + Math.sin(y * 29 - state.p * 22) * .023 + Math.sin(y * 61 + state.p * 55) * .015;
      const oval = Math.pow(Math.abs((y - .54) * 1.6), 1.5) * .18 * (1 - opening);
      const halfWidth = Math.max(0, radius - irregular - oval);
      return (.5 + direction * halfWidth / spanX) * w;
    };
    target.beginPath();
    for (let i = 0; i <= 56; i++) { const y = i / 56, x = side(y, -1); if (!i) target.moveTo(x, -12); else target.lineTo(x, y * h); }
    target.lineTo(side(1, -1), h + 12); target.lineTo(side(1, 1), h + 12);
    for (let i = 56; i >= 0; i--) { const y = i / 56; target.lineTo(side(y, 1), y * h); }
    target.lineTo(side(0, 1), -12); target.closePath();
  }

  return {
    kind: '2d', upload(bitmap) { return bitmap; },
    release(resource) { resource.image?.close?.(); resource.flow = null; },
    draw(state) {
      ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (state.p >= .195) {
        if (reveal.canvas.width > 1) { reveal.canvas.width = reveal.canvas.height = 1; mask.canvas.width = mask.canvas.height = 1; }
        sequence(state); return;
      }
      const approach = smooth(0, .105, state.p);
      drawImage(state.cascade, ctx, 1, state.logicalAspect, Math.exp(Math.log(4) * approach), .5 + approach * .17, state.cascadeAspect);
      const immerse = smooth(.068, .118, state.p);
      drawImage(state.water || state.cascade, ctx, immerse, state.logicalAspect, 1.10 + immerse * .13, .43 + state.p * .43, state.waterAspect);
      const opening = smooth(.12, .195, state.p);
      if (opening <= 0) return;
      if (opening > .997) { sequence(state); return; }

      const w = canvas.width, h = canvas.height;
      fitLayer(reveal, w, h); sequence(state, reveal.ctx);
      // A half-resolution blurred alpha mask gives water a feathered edge;
      // there is no rigid clipping seam, even without WebGL.
      fitLayer(mask, Math.max(1, Math.round(w / 2)), Math.max(1, Math.round(h / 2)));
      mask.ctx.filter = `blur(${Math.max(3, mask.canvas.width * .007)}px)`;
      mask.ctx.fillStyle = '#fff'; aperturePath(mask.ctx, state, opening); mask.ctx.fill(); mask.ctx.filter = 'none';
      reveal.ctx.globalCompositeOperation = 'destination-in';
      reveal.ctx.drawImage(mask.canvas, 0, 0, w, h);
      reveal.ctx.globalCompositeOperation = 'source-over';
      ctx.drawImage(reveal.canvas, 0, 0);

      ctx.save();
      ctx.filter = `blur(${Math.max(4, w * .006)}px)`;
      ctx.strokeStyle = `rgba(226,242,243,${.13 * immerse * (1 - opening)})`;
      ctx.lineWidth = Math.max(3, w * .004);
      aperturePath(ctx, state, opening); ctx.stroke(); ctx.restore();
    },
    destroy() { for (const layer of [blend, reveal, mask]) layer.canvas.width = layer.canvas.height = 1; workspaces.clear(); },
  };
}
