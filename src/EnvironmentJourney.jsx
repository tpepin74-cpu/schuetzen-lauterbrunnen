import { motion, useTransform } from 'framer-motion';
import './EnvironmentJourney.css';

// Both halves share the very same edge. Their initial pixels therefore join
// exactly, and reversing the scroll closes the landscape without a seam.
const SEAM = 'M 505 0 L 500 80 L 507 170 L 495 260 L 504 355 L 496 455 L 508 555 L 494 665 L 503 775 L 497 890 L 505 1000';
const LEFT = 'polygon(0 0,50.5% 0,50% 8%,50.7% 17%,49.5% 26%,50.4% 35.5%,49.6% 45.5%,50.8% 55.5%,49.4% 66.5%,50.3% 77.5%,49.7% 89%,50.5% 100%,0 100%)';
const RIGHT = 'polygon(50.5% 0,100% 0,100% 100%,50.5% 100%,49.7% 89%,50.3% 77.5%,49.4% 66.5%,50.8% 55.5%,49.6% 45.5%,50.4% 35.5%,49.5% 26%,50.7% 17%,50% 8%)';

function Seam({ opacity }) {
  return (
    <motion.svg className="ej-cut-edge" viewBox="0 0 1000 1000" preserveAspectRatio="none" style={{ opacity }}>
      <path d={SEAM} fill="none" stroke="rgba(255,253,245,.85)" strokeWidth="1.75" vectorEffect="non-scaling-stroke" />
    </motion.svg>
  );
}

function LandscapeHalf({ side, progress, mobile, reducedMotion, edgeOpacity }) {
  const direction = side === 'left' ? -1 : 1;
  const x = useTransform(progress, [0, .035, .072, .12, .19],
    ['0vw', '0vw', `${direction * 5}vw`, `${direction * 27}vw`, `${direction * (mobile ? 86 : 82)}vw`]);
  const scale = useTransform(progress, [0, .035, .11, .19], [1.025, 1.025, 1.11, 1.29]);
  const rotate = useTransform(progress, [0, .04, .19], [0, 0, direction * (mobile ? 2.5 : 3.5)]);
  const y = useTransform(progress, [0, .04, .19], ['0vh', '0vh', '5vh']);
  const opacity = useTransform(progress, [0, .17, .198, 1], [1, 1, 0, 0]);
  const visibility = useTransform(progress, value => value >= .2 ? 'hidden' : 'visible');
  return (
    <motion.div className={`ej-landscape-half ej-landscape-${side}`} style={{
      x: reducedMotion ? 0 : x,
      y: reducedMotion ? 0 : y,
      rotate: reducedMotion ? 0 : rotate,
      scale: reducedMotion ? 1 : scale,
      opacity, visibility,
    }}>
      <div className="ej-cliff-cut" style={{ clipPath: side === 'left' ? LEFT : RIGHT }}>
        <img src="/assets/journey/cascade.webp" className="ej-photo ej-cascade-photo" alt="" fetchPriority="high" decoding="async" draggable="false" />
      </div>
      {!reducedMotion && <Seam opacity={edgeOpacity} />}
    </motion.div>
  );
}

/**
 * One fixed photographic stage. The parent owns scroll and the sticky shell.
 * Camera progress: cliffs → actual façade → stair landing → terrace.
 * The fondue stage overlays the terrace between .50 and .56.
 */
export default function EnvironmentJourney({ progress, mobile = false, reducedMotion = false }) {
  const rootOpacity = useTransform(progress, [0, .545, .56, 1], [1, 1, 0, 0]);
  const rootVisibility = useTransform(progress, value => value >= .56 ? 'hidden' : 'visible');
  const edgeOpacity = useTransform(progress, [0, .037, .061, .15, .19], [0, 0, .95, .95, 0]);

  // The original photograph stays intact. Its real staircase is the vanishing
  // point; moving that point to centre produces the feeling of walking closer.
  const houseScale = useTransform(progress, [0, .14, .19, .25, .315], [1.035, 1.035, 1.12, 1.58, mobile ? 2.05 : 2.4]);
  const houseX = useTransform(progress, [0, .17, .25, .315], ['0vw', '0vw', mobile ? '3vw' : '5vw', mobile ? '6vw' : '8vw']);
  const houseY = useTransform(progress, [0, .17, .25, .315], ['0vh', '0vh', mobile ? '-8vh' : '-9vh', mobile ? '-17vh' : '-22vh']);
  const houseOpacity = useTransform(progress, [0, .29, .325, 1], [1, 1, 0, 0]);
  const houseVisibility = useTransform(progress, value => value >= .33 ? 'hidden' : 'visible');

  const stairOpacity = useTransform(progress, [0, .271, .308, .382, .413, 1], [0, 0, 1, 1, 0, 0]);
  const stairScale = useTransform(progress, [0, .275, .315, .397, .418], [1.04, 1.04, 1.12, 1.52, 1.66]);
  const stairY = useTransform(progress, value => {
    const walk = Math.max(0, Math.min(1, (value - .296) / .106));
    // Tiny gait accents are derived from scroll, never from a clock.
    const step = Math.sin(walk * Math.PI * 7) * Math.sin(walk * Math.PI) * .65;
    return `${-walk * (mobile ? 8 : 10) + step}vh`;
  });
  const stairVisibility = useTransform(progress, value => value < .265 || value >= .42 ? 'hidden' : 'visible');

  const terraceOpacity = useTransform(progress, [0, .372, .412, 1], [0, 0, 1, 1]);
  const terraceScale = useTransform(progress, [0, .38, .43, .51, .56], [1.035, 1.035, 1.08, 1.30, 1.42]);
  const terraceY = useTransform(progress, [0, .38, .44, .56], ['2vh', '2vh', '0vh', '-5vh']);
  const terraceVisibility = useTransform(progress, value => value < .37 || value >= .56 ? 'hidden' : 'visible');

  const mistOpacity = useTransform(progress, [0, .055, .105, .17, .205], [0, 0, .24, .1, 0]);
  const mistScale = useTransform(progress, [.05, .19], [.3, 2.8]);

  return (
    <motion.div
      className={`environment-journey${mobile ? ' ej-mobile' : ''}${reducedMotion ? ' ej-reduced' : ''}`}
      style={{ opacity: rootOpacity, visibility: rootVisibility }}
      aria-hidden="true"
    >
      <motion.div className="ej-scene ej-house" style={{
        scale: reducedMotion ? 1 : houseScale,
        x: reducedMotion ? 0 : houseX,
        y: reducedMotion ? 0 : houseY,
        opacity: houseOpacity, visibility: houseVisibility,
      }}>
        <img src="/assets/original-1.webp" className="ej-photo ej-house-photo" alt="" width="1360" height="1020" decoding="async" draggable="false" />
      </motion.div>

      <motion.div className="ej-scene ej-stairs" style={{
        scale: reducedMotion ? 1 : stairScale,
        y: reducedMotion ? 0 : stairY,
        opacity: stairOpacity, visibility: stairVisibility,
      }}>
        <img src="/assets/journey/stairs.webp" className="ej-photo" alt="" decoding="async" draggable="false" />
      </motion.div>

      <motion.div className="ej-scene ej-terrace" style={{
        scale: reducedMotion ? 1 : terraceScale,
        y: reducedMotion ? 0 : terraceY,
        opacity: terraceOpacity, visibility: terraceVisibility,
      }}>
        <img src="/assets/journey/terrace.webp" className="ej-photo" alt="" decoding="async" draggable="false" />
      </motion.div>

      <LandscapeHalf side="left" progress={progress} mobile={mobile} reducedMotion={reducedMotion} edgeOpacity={edgeOpacity} />
      <LandscapeHalf side="right" progress={progress} mobile={mobile} reducedMotion={reducedMotion} edgeOpacity={edgeOpacity} />
      {!reducedMotion && <motion.div className="ej-parting-mist" style={{ opacity: mistOpacity, scaleX: mistScale }} />}
    </motion.div>
  );
}
