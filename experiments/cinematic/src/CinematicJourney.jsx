import { useEffect, useRef } from 'react';
import { cinematicVertexShader, cinematicFragmentShader } from './cinematicShaders';
import { createCinematicCanvas2D } from './cinematicCanvas';
import './CinematicJourney.css';

const clamp = (v, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, v));
const smooth = (a, b, v) => { const t = clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
const END = .578;
const DEFAULT_FRAMES = [
  ['approach', .19], ['steps-low', .285], ['steps-high', .34],
  ['landing', .395], ['table-wide', .435], ['table-approach', .49], ['fondue', .558],
].map(([id, p]) => ({ id, p, src: id === 'fondue' ? '/assets/journey/fondue.webp' : `/assets/cinematic/${id}.webp`, aspect: 16 / 9 }));
const DEFAULT_MANIFEST = {
  version: 1, logicalAspect: 16 / 9, flowRange: .5,
  cascade: { src: '/assets/journey/cascade.webp', aspect: 16 / 9 },
  water: { src: '/assets/cinematic/water-close.webp', aspect: 16 / 9 },
  frames: DEFAULT_FRAMES, transitions: [],
  mobile: { logicalAspect: 2 / 3, frames: [{ id: 'fondue', src: '/assets/journey/fondue-mobile.webp', aspect: 2 / 3 }] },
};

function prepareManifest(input, mobile) {
  const source = input && typeof input === 'object' ? input : DEFAULT_MANIFEST;
  const base = Array.isArray(source.frames) && source.frames.length > 1 ? source.frames : DEFAULT_FRAMES;
  const variant = mobile ? source.mobile || DEFAULT_MANIFEST.mobile : {};
  const overrides = new Map((variant.frames || []).map(frame => [frame.id, frame]));
  const frames = base.map((frame, i) => ({ ...DEFAULT_FRAMES[i], ...frame, ...(overrides.get(frame.id) || {}) }))
    .filter(frame => frame.id && typeof frame.src === 'string' && Number.isFinite(frame.p))
    .sort((a, b) => a.p - b.p);
  const transitions = new Map((source.transitions || []).map(item => [`${item.from}:${item.to}`, item]));
  for (const item of variant.transitions || []) transitions.set(`${item.from}:${item.to}`, item);
  return {
    frames, transitions,
    logicalAspect: Number(variant.logicalAspect || source.logicalAspect || (mobile ? 2 / 3 : 16 / 9)),
    flowRange: Number(source.flowRange) || .5,
    cascade: { ...DEFAULT_MANIFEST.cascade, ...(source.cascade || {}), ...(variant.cascade || {}) },
    water: { ...DEFAULT_MANIFEST.water, ...(source.water || {}), ...(variant.water || {}) },
  };
}

function segmentAt(frames, p) {
  let index = Math.max(0, frames.findIndex((frame, i) => i < frames.length - 1 && p < frames[i + 1].p));
  if (p >= frames.at(-1).p) index = frames.length - 1;
  const a = frames[index], b = frames[Math.min(index + 1, frames.length - 1)];
  return { index, a, b, t: a === b ? 0 : clamp((p - a.p) / (b.p - a.p)) };
}

function compile(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Cinematic shader: ${message}`);
  }
  return shader;
}

function createWebGL(canvas) {
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, premultipliedAlpha: false, preserveDrawingBuffer: false, powerPreference: 'low-power' });
  if (!gl) return null;
  const vertex = compile(gl, gl.VERTEX_SHADER, cinematicVertexShader);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, cinematicFragmentShader);
  const program = gl.createProgram();
  gl.attachShader(program, vertex); gl.attachShader(program, fragment); gl.linkProgram(program);
  gl.deleteShader(vertex); gl.deleteShader(fragment);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { const message = gl.getProgramInfoLog(program); gl.deleteProgram(program); throw new Error(message); }
  gl.useProgram(program);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, -1,1, 1,-1, 1,1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position); gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
  const uniform = {};
  for (const name of ['uImageA','uImageB','uForward','uBackward','uCascade','uWater','uProgress','uT','uHasFlow','uHasWater','uFlowRange','uViewAspect','uLogicalAspect','uAspectA','uAspectB','uCascadeAspect','uWaterAspect']) uniform[name] = gl.getUniformLocation(program, name);
  const fallback = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, fallback);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0,0,0,255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const float = (name, value) => gl.uniform1f(uniform[name], value);
  return {
    kind: 'webgl', gl,
    upload(image) {
      const texture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      return texture;
    },
    release(resource) { if (resource.texture) gl.deleteTexture(resource.texture); },
    draw(state) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      const assets = [state.a, state.b, state.forward, state.backward, state.cascade, state.water];
      ['uImageA','uImageB','uForward','uBackward','uCascade','uWater'].forEach((name, i) => {
        gl.activeTexture(gl.TEXTURE0 + i);
        gl.bindTexture(gl.TEXTURE_2D, assets[i]?.texture || fallback);
        gl.uniform1i(uniform[name], i);
      });
      float('uProgress', state.p); float('uT', state.t);
      float('uHasFlow', state.forward?.ready && state.backward?.ready ? 1 : 0);
      float('uHasWater', state.water?.ready ? 1 : 0);
      float('uFlowRange', state.range); float('uLogicalAspect', state.logicalAspect);
      float('uViewAspect', canvas.width / canvas.height);
      float('uAspectA', state.aspectA); float('uAspectB', state.aspectB);
      float('uCascadeAspect', state.cascadeAspect); float('uWaterAspect', state.waterAspect);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    },
    destroy() { gl.deleteTexture(fallback); gl.deleteBuffer(buffer); gl.deleteProgram(program); gl.getExtension('WEBGL_lose_context')?.loseContext(); },
  };
}

// Texture limits: four sequence photographs, two active flow maps, two water
// sources. Compressed next-flow requests warm HTTP cache without GPU uploads.
class AssetPool {
  constructor(backend, invalidate) { this.backend = backend; this.invalidate = invalidate; this.items = new Map(); this.prefetched = new Set(); this.prefetchControllers = new Set(); this.disposed = false; }
  ensure(src, category) {
    if (!src) return null;
    const key = `${category}:${src}`;
    if (this.items.has(key)) return this.items.get(key);
    const entry = { key, src, category, ready: false, failed: false, controller: new AbortController() };
    this.items.set(key, entry);
    this.load(entry);
    return entry;
  }
  async load(entry) {
    let bitmap;
    try {
      const binaryFlow = entry.category === 'flow' && this.backend.kind === '2d';
      const url = binaryFlow ? entry.src.replace(/\.png(?=$|\?)/i, '.bin') : entry.src;
      const response = await fetch(url, { signal: entry.controller.signal, cache: 'force-cache', priority: entry.category === 'special' ? 'high' : 'auto' });
      if (!response.ok) throw new Error(`Asset ${response.status}`);
      if (binaryFlow) {
        const buffer = await response.arrayBuffer();
        if (this.disposed || entry.controller.signal.aborted || !this.items.has(entry.key)) return;
        if (buffer.byteLength < 8) throw new Error('Invalid flow header');
        const view = new DataView(buffer), width = view.getUint16(0, true), height = view.getUint16(2, true);
        if (!width || !height || buffer.byteLength !== 4 + width * height * 4) throw new Error('Invalid flow dimensions');
        // Explicit little-endian decoding also works on a non-LE JS host.
        const data = new Uint16Array(width * height * 2);
        for (let i = 0; i < data.length; i++) data[i] = view.getUint16(4 + i * 2, true);
        entry.width = width; entry.height = height; entry.flow = { width, height, data };
        entry.ready = true; this.invalidate(); return;
      }
      const blob = await response.blob();
      if (typeof createImageBitmap === 'function') bitmap = await createImageBitmap(blob, { premultiplyAlpha: 'none', colorSpaceConversion: 'none' });
      else {
        // Flow alpha must remain byte-exact; leave flow morphing disabled on
        // browsers without a non-premultiplied bitmap decoder.
        if (entry.category === 'flow') throw new Error('Data texture decoding unavailable');
        const url = URL.createObjectURL(blob);
        try { bitmap = await new Promise((resolve, reject) => { const img = new Image(); img.onload = () => resolve(img); img.onerror = reject; img.src = url; }); }
        finally { URL.revokeObjectURL(url); }
      }
      if (this.disposed || entry.controller.signal.aborted || !this.items.has(entry.key)) { bitmap.close?.(); return; }
      entry.width = bitmap.width; entry.height = bitmap.height;
      if (this.backend.kind === 'webgl') { entry.texture = this.backend.upload(bitmap); bitmap.close?.(); }
      else entry.image = bitmap;
      entry.ready = true;
      this.invalidate();
    } catch (error) {
      bitmap?.close?.();
      if (!entry.controller.signal.aborted) { entry.failed = true; this.invalidate(); }
    }
  }
  prune(category, wanted) {
    for (const [key, entry] of this.items) if (entry.category === category && !wanted.has(entry.src)) {
      entry.controller.abort(); this.backend.release(entry); this.items.delete(key);
    }
  }
  warm(src) {
    if (!src || this.prefetched.has(src) || this.disposed) return;
    this.prefetched.add(src);
    const controller = new AbortController(); this.prefetchControllers.add(controller);
    const url = this.backend.kind === '2d' ? src.replace(/\.png(?=$|\?)/i, '.bin') : src;
    fetch(url, { signal: controller.signal, cache: 'force-cache' }).then(response => response.ok ? response.arrayBuffer() : null).catch(() => null).finally(() => this.prefetchControllers.delete(controller));
  }
  dispose() {
    this.disposed = true;
    for (const entry of this.items.values()) { entry.controller.abort(); this.backend.release(entry); }
    for (const controller of this.prefetchControllers) controller.abort();
    this.items.clear(); this.prefetchControllers.clear();
  }
}

function startRenderer(host, progress, mobile) {
  let disposed = false, raf = 0, manifest = prepareManifest(DEFAULT_MANIFEST, mobile), backend, pool, canvas;
  let cssWidth = 1, cssHeight = 1;
  let lastProgress = progress.get();
  const manifestController = new AbortController();
  const schedule = () => {
    if (disposed || raf || document.hidden) return;
    raf = requestAnimationFrame(draw);
  };
  const contextLost = event => { event.preventDefault(); if (!disposed) setup(true); };
  function setup(force2D = false) {
    if (pool) pool.dispose();
    if (canvas) canvas.removeEventListener('webglcontextlost', contextLost);
    backend?.destroy();
    canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    host.replaceChildren(canvas);
    try { backend = force2D ? null : createWebGL(canvas); delete host.dataset.rendererError; }
    catch (error) { backend = null; host.dataset.rendererError = String(error?.message || 'WebGL initialization failed'); }
    if (!backend) {
      // A canvas cannot switch context type after WebGL acquisition.
      canvas = document.createElement('canvas'); canvas.setAttribute('aria-hidden', 'true'); host.replaceChildren(canvas);
      backend = createCinematicCanvas2D(canvas);
    }
    canvas.addEventListener('webglcontextlost', contextLost);
    // An opaque WebGL drawing buffer starts black; leave the CSS photograph
    // visible until the first complete image has actually been drawn.
    canvas.style.opacity = '0';
    host.dataset.renderer = backend.kind;
    pool = new AssetPool(backend, schedule);
    resize();
  }
  function resize() {
    const box = host.getBoundingClientRect();
    cssWidth = Math.max(1, box.width); cssHeight = Math.max(1, box.height);
    // Cap both DPR and total pixel count, including wide desktop displays.
    const maxPixels = backend.kind === '2d' ? (mobile ? 550_000 : 1_280_000) : (mobile ? 1_150_000 : 2_800_000);
    const dpr = Math.min(window.devicePixelRatio || 1, backend.kind === '2d' ? 1 : mobile ? 1.5 : 1.65, Math.sqrt(maxPixels / (cssWidth * cssHeight)));
    canvas.width = Math.max(1, Math.round(cssWidth * dpr));
    canvas.height = Math.max(1, Math.round(cssHeight * dpr));
    schedule();
  }
  function draw() {
    raf = 0;
    if (disposed || document.hidden) return;
    const p = clamp(progress.get()); lastProgress = p;
    host.style.visibility = p >= END ? 'hidden' : 'visible';
    if (p >= END) return;
    const seg = segmentAt(manifest.frames, p);
    // Start the visible waterfall request before the four look-ahead photos.
    const cascade = pool.ensure(manifest.cascade.src, 'special');
    const water = p > .02 ? pool.ensure(manifest.water.src, 'special') : null;
    // Keep current pair and its nearest neighbours; never eagerly decode the
    // whole sequence. Initial scene photos load while the waterfall is seen.
    const start = clamp(seg.index - 1, 0, Math.max(0, manifest.frames.length - 4));
    const wantedFrames = manifest.frames.slice(start, start + 4);
    const wantedScene = new Set(wantedFrames.map(frame => frame.src));
    wantedScene.add(seg.a.src); wantedScene.add(seg.b.src);
    pool.prune('scene', wantedScene);
    for (const frame of wantedFrames) pool.ensure(frame.src, 'scene');
    const a = pool.ensure(seg.a.src, 'scene'), b = pool.ensure(seg.b.src, 'scene');
    const transition = manifest.transitions.get(`${seg.a.id}:${seg.b.id}`);
    const flowWanted = new Set([transition?.forward, transition?.backward].filter(Boolean));
    pool.prune('flow', flowWanted);
    const forward = pool.ensure(transition?.forward, 'flow');
    const backward = pool.ensure(transition?.backward, 'flow');
    const nextA = manifest.frames[seg.index + 1], nextB = manifest.frames[seg.index + 2];
    const nextFlow = nextA && nextB ? manifest.transitions.get(`${nextA.id}:${nextB.id}`) : null;
    pool.warm(nextFlow?.forward); pool.warm(nextFlow?.backward);

    // Preserve the last complete frame while an essential texture is loading;
    // image failures degrade to the nearest available photograph, never black.
    const available = [a, b, ...wantedFrames.map(frame => pool.ensure(frame.src, 'scene'))].find(item => item?.ready);
    if (!cascade.ready && p < .195) return;
    if (!available && p >= .12) return;
    const imageA = a.ready ? a : available || cascade;
    const imageB = b.ready ? b : imageA;
    const bothImagesReady = a.ready && b.ready;
    // Once the water has cleared, wait for the active data maps rather than
    // switching from a dissolve to a different warp midway through a shot.
    if (p >= .195 && transition?.forward && transition?.backward && bothImagesReady
      && (!forward?.ready || !backward?.ready) && !forward?.failed && !backward?.failed) return;
    const state = {
      p, t: bothImagesReady ? seg.t : 0,
      a: imageA, b: imageB, cascade: cascade.ready ? cascade : imageA, water: water?.ready ? water : null,
      forward: bothImagesReady && forward?.ready ? forward : null,
      backward: bothImagesReady && backward?.ready ? backward : null,
      logicalAspect: manifest.logicalAspect, range: Number(transition?.range) || manifest.flowRange,
      aspectA: imageA === a ? (Number(seg.a.aspect) || a.width / a.height) : imageA.width / imageA.height,
      aspectB: imageB === b ? (Number(seg.b.aspect) || b.width / b.height) : imageB.width / imageB.height,
      cascadeAspect: Number(manifest.cascade.aspect) || cascade.width / cascade.height,
      waterAspect: Number(manifest.water.aspect) || (water?.width / water?.height) || 16 / 9,
    };
    backend.draw(state);
    canvas.style.opacity = '1';
    host.dataset.segment = `${seg.a.id}:${seg.b.id}`;
    host.dataset.flow = seg.a === seg.b ? 'ready'
      : !transition?.forward || !transition?.backward || forward?.failed || backward?.failed ? 'fallback'
      : forward?.ready && backward?.ready ? 'ready' : 'pending';
  }
  setup();
  const unsubscribe = progress.on('change', value => {
    if (value === lastProgress) return;
    if (value >= END && lastProgress >= END) return;
    schedule();
  });
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  observer?.observe(host);
  window.addEventListener('resize', resize, { passive: true });
  const visible = () => { if (!document.hidden) schedule(); };
  document.addEventListener('visibilitychange', visible);
  fetch('/assets/cinematic/sequence.json', { signal: manifestController.signal, cache: 'no-cache' })
    .then(response => response.ok ? response.json() : null)
    .then(value => { if (value && !disposed) { manifest = prepareManifest(value, mobile); schedule(); } })
    .catch(() => {});
  return () => {
    disposed = true; cancelAnimationFrame(raf); unsubscribe(); observer?.disconnect();
    manifestController.abort(); window.removeEventListener('resize', resize); document.removeEventListener('visibilitychange', visible);
    canvas.removeEventListener('webglcontextlost', contextLost); pool.dispose(); backend.destroy(); host.replaceChildren();
  };
}

/** Continuous photographic arrival; the existing fondue rig takes over at .558. */
export default function CinematicJourney({ progress, mobile = false }) {
  const hostRef = useRef(null);
  useEffect(() => startRenderer(hostRef.current, progress, mobile), [progress, mobile]);
  return <div ref={hostRef} className="cinematic-journey" aria-hidden="true" />;
}
