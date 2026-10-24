export const cinematicVertexShader = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = aPosition * .5 + .5;
  gl_Position = vec4(aPosition, 0., 1.);
}`;

export const cinematicFragmentShader = `
precision highp float;
varying vec2 vUv;
uniform sampler2D uImageA;
uniform sampler2D uImageB;
uniform sampler2D uForward;
uniform sampler2D uBackward;
uniform sampler2D uCascade;
uniform sampler2D uWater;
uniform float uProgress;
uniform float uT;
uniform float uHasFlow;
uniform float uHasWater;
uniform float uFlowRange;
uniform float uViewAspect;
uniform float uLogicalAspect;
uniform float uAspectA;
uniform float uAspectB;
uniform float uCascadeAspect;
uniform float uWaterAspect;

// UVs are top-left based throughout. Flow PNG alpha is data, not opacity.
vec2 coverUv(vec2 uv, float sourceAspect, float targetAspect) {
  vec2 span = vec2(1.);
  if (targetAspect < sourceAspect) span.x = targetAspect / sourceAspect;
  else span.y = sourceAspect / targetAspect;
  return (uv - .5) * span + .5;
}
vec2 safeUv(vec2 uv) { return clamp(uv, vec2(.0001), vec2(.9999)); }
vec2 decodeFlow(vec4 channels) {
  vec2 encoded = vec2(channels.r * 65280. + channels.g * 255., channels.b * 65280. + channels.a * 255.) / 65535.;
  return (encoded - .5) * (2. * uFlowRange);
}
vec2 forwardAt(vec2 uv) { return decodeFlow(texture2D(uForward, safeUv(uv))); }
vec2 backwardAt(vec2 uv) { return decodeFlow(texture2D(uBackward, safeUv(uv))); }
vec3 imageA(vec2 logicalUv) { return texture2D(uImageA, safeUv(coverUv(logicalUv, uAspectA, uLogicalAspect))).rgb; }
vec3 imageB(vec2 logicalUv) { return texture2D(uImageB, safeUv(coverUv(logicalUv, uAspectB, uLogicalAspect))).rgb; }

vec3 sequenceAt(vec2 q) {
  float t = clamp(uT, 0., 1.);
  if (t < .00001) return imageA(q);
  if (t > .99999) return imageB(q);
  if (uHasFlow < .5) {
    // A short dissolve is the deliberate low-capability/loading fallback.
    return mix(imageA(q), imageB(q), smoothstep(.34, .66, t));
  }
  vec2 a = q;
  vec2 b = q;
  // Inverse transport: solve q = a + t F(a), q = b + (1-t) B(b).
  // Two fixed iterations keep cost bounded and the scrubbing deterministic.
  for (int i = 0; i < 2; i++) {
    a = q - t * forwardAt(a);
    b = q - (1. - t) * backwardAt(b);
  }
  vec2 fa = forwardAt(a);
  vec2 bb = backwardAt(b);
  float ea = length((fa + backwardAt(a + fa)) * vec2(uLogicalAspect, 1.));
  float eb = length((bb + forwardAt(b + bb)) * vec2(uLogicalAspect, 1.));
  float ca = 1. - smoothstep(.008, .065, ea);
  float cb = 1. - smoothstep(.008, .065, eb);
  float wa = (1. - t) * mix(.28, 1., ca);
  float wb = t * mix(.28, 1., cb);
  return (imageA(a) * wa + imageB(b) * wb) / max(.00001, wa + wb);
}

float hash(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * .1031);
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.x + p3.y) * p3.z);
}
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3. - 2. * f);
  return mix(mix(hash(i), hash(i + vec2(1.,0.)), f.x), mix(hash(i + vec2(0.,1.)), hash(i + vec2(1.)), f.x), f.y);
}
float fbm(vec2 p) {
  return noise(p) * .57 + noise(p * 2.07 + 7.1) * .28 + noise(p * 4.13 + 19.8) * .15;
}

void main() {
  vec2 screenUv = vec2(vUv.x, 1. - vUv.y);
  vec2 q = coverUv(screenUv, uLogicalAspect, uViewAspect);
  float p = clamp(uProgress, 0., 1.);
  if (p >= .195) {
    gl_FragColor = vec4(sequenceAt(q), 1.);
    return;
  }

  // The rocks stay whole. Only the camera approaches, then real water moves
  // into the foreground and an irregular aperture opens within that water.
  float approach = smoothstep(0., .105, p);
  float zoom = exp(log(4.) * approach);
  vec2 cascadeUv = coverUv(q, uCascadeAspect, uLogicalAspect);
  cascadeUv = (cascadeUv - .5) / zoom + vec2(.5, mix(.5, .67, approach));
  vec3 cliff = texture2D(uCascade, safeUv(cascadeUv)).rgb;
  if (p <= .068) { gl_FragColor = vec4(cliff, 1.); return; }

  float immerse = smoothstep(.068, .118, p);
  float opening = smoothstep(.12, .195, p);
  float flowing = fbm(q * vec2(5.4, 8.2) + vec2(p * 9., -p * 29.));
  float ripple = sin(q.y * 12. + p * 32.) * .060
               + sin(q.y * 29. - p * 22.) * .023
               + (flowing - .5) * .104;
  float radius = mix(-.20, .83, opening);
  float oval = pow(abs((q.y - .54) * 1.6), 1.5) * .18 * (1. - opening);
  float edge = abs(q.x - .5) - radius + ripple + oval;
  float aperture = 1. - smoothstep(-.028, .035, edge);
  vec2 refract = vec2(flowing - .5, sin(q.y * 37. + p * 78.) * .30) * .022 * immerse * (1. - opening);
  vec3 destination = sequenceAt(q + refract);

  vec2 waterUv = coverUv(q, uWaterAspect, uLogicalAspect);
  waterUv = (waterUv - .5) * .68 + vec2(.5, .39 + p * .66);
  waterUv.x += sign(q.x - .5) * opening * .17 + (flowing - .5) * .012;
  waterUv.y += sin(q.x * 17. + p * 38.) * .008;
  vec3 water = uHasWater > .5 ? texture2D(uWater, safeUv(waterUv)).rgb : cliff;

  // Small lens droplets and pale turbulence accompany the immersion. They
  // depend on p, never wall-clock time, so they reverse with the camera.
  vec2 dropGrid = q * vec2(16. * uLogicalAspect, 16.) - vec2(0., p * 35.);
  vec2 cell = floor(dropGrid);
  vec2 local = fract(dropGrid) - vec2(.5);
  float drop = length(local / vec2(.12, .22));
  float droplet = exp(-pow((drop - 1.) * 5., 2.)) * step(.71, hash(cell + 29.));
  water += vec3(.065, .077, .080) * droplet * immerse * (1. - opening);

  float width = mix(.02, 1.08, immerse);
  float waterCover = (1. - smoothstep(width - .06, width + .06, abs(q.x - .5) + ripple * .3)) * immerse;
  vec3 result = mix(cliff, water, waterCover);
  result = mix(result, destination, aperture * immerse);
  float fineMist = exp(-abs(edge) * 38.) * .085 * immerse * (1. - opening);
  result = mix(result, vec3(.91,.96,.96), fineMist);
  gl_FragColor = vec4(result, 1.);
}`;
