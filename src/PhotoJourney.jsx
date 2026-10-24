import { motion, useTransform } from 'framer-motion';
import './PhotoJourney.css';

const FALLBACK_SCENES = [
  { eyebrow: 'Hôtel Schützen · Lauterbrunnen', line1: 'Un lieu.', line2: 'Une présence.', body: 'Le chalet, sa terrasse, ses escaliers. Tout commence ici.' },
  { eyebrow: 'Le Staubbach', line1: 'Lever', line2: 'les yeux.', body: 'La cascade et la falaise, juste derrière le chalet.' },
  { eyebrow: 'Bienvenue au Schützen', line1: 'Vous', line2: 'y êtes.', body: 'Une adresse au cœur de Lauterbrunnen.' },
];

function SceneText({ scene, number, quiet, active, style, className }) {
  return (
    <motion.div
      className={`journey-copy journey-copy-${number} ${className || ''}`}
      style={style}
      aria-hidden={quiet || !active}
    >
      <div className="journey-copy-content" style={{ opacity: quiet ? 0 : 1 }}>
        <p className="journey-eyebrow"><span aria-hidden="true">{String(number + 1).padStart(2, '0')}</span>{scene.eyebrow}</p>
        <h2 className="journey-heading"><span>{scene.line1}</span><em>{scene.line2}</em></h2>
        {scene.body && <p className="journey-body">{scene.body}</p>}
      </div>
    </motion.div>
  );
}

export default function PhotoJourney({ progress, mobile = false, quiet = false, copy, chapter = 0 }) {
  const scenes = copy?.scenes || FALLBACK_SCENES;

  const firstX = useTransform(progress, [0, .12, .44], ['0vw', '0vw', mobile ? '-12vw' : '-14vw']);
  const firstY = useTransform(progress, [0, .12, .44], ['0vh', '0vh', '-22vh']);
  const firstScale = useTransform(progress, [0, .12, .44], [1, 1, .86]);
  const firstOpacity = useTransform(progress, [0, .24, .40, .46, 1], [1, 1, .12, 0, 0]);
  const firstTextY = useTransform(progress, [0, .08, .33], ['0vh', '0vh', '-62vh']);
  const firstTextOpacity = useTransform(progress, [0, .11, .27, 1], [1, 1, 0, 0]);

  const secondY = useTransform(progress, [0, .14, .43, .58, .88, 1], ['110vh', '110vh', '0vh', '0vh', '-110vh', '-110vh']);
  const secondX = useTransform(progress, [0, .43, .58, .88, 1], ['0vw', '0vw', '0vw', mobile ? '5vw' : '8vw', mobile ? '5vw' : '8vw']);
  const secondScale = useTransform(progress, [0, .14, .43, .58, .88, 1], [.82, .82, 1, 1, .88, .88]);
  const secondOpacity = useTransform(progress, [0, .14, .21, .72, .88, 1], [0, 0, 1, 1, 0, 0]);
  const secondTextY = useTransform(progress, [0, .23, .43, .55, .77, 1], ['85vh', '85vh', '0vh', '-2vh', '-125vh', '-125vh']);
  const secondTextOpacity = useTransform(progress, [0, .24, .36, .57, .72, 1], [0, 0, 1, 1, 0, 0]);

  const thirdY = useTransform(progress, [0, .56, .88, 1], ['120vh', '120vh', '0vh', '0vh']);
  const thirdX = useTransform(progress, [0, .56, .88, 1], [mobile ? '6vw' : '-7vw', mobile ? '6vw' : '-7vw', '0vw', '0vw']);
  const thirdScale = useTransform(progress, [0, .56, .88, 1], [.84, .84, 1, 1]);
  const thirdOpacity = useTransform(progress, [0, .56, .64, 1], [0, 0, 1, 1]);
  const thirdTextY = useTransform(progress, [0, .65, .88, 1], ['100vh', '100vh', '0vh', '0vh']);
  const thirdTextOpacity = useTransform(progress, [0, .66, .82, 1], [0, 0, 1, 1]);

  return (
    <div className={`journey-root${mobile ? ' journey-mobile' : ''}`}>
      <motion.figure
        className="journey-photo journey-photo-first"
        style={{ x: firstX, y: firstY, scale: firstScale, opacity: firstOpacity }}
        aria-hidden={chapter !== 0}
      >
        <img src="/assets/original-2.webp" width="1360" height="891"
          alt={copy?.alts?.[0] || 'La façade originale du Schützen, sa terrasse et ses escaliers au bord de la route.'}
          fetchPriority="high" decoding="async" draggable="false" />
        <div className="journey-first-shade" aria-hidden="true" />
      </motion.figure>

      <motion.figure
        className="journey-photo journey-photo-second"
        style={{ x: secondX, y: secondY, scale: secondScale, opacity: secondOpacity }}
        aria-hidden={chapter !== 1}
      >
        <img src="/assets/original-3.webp" width="765" height="1020"
          alt={copy?.alts?.[1] || 'La cascade du Staubbach derrière la terrasse et le chalet du Schützen, photographiés depuis la rue.'}
          decoding="async" draggable="false" />
      </motion.figure>

      <motion.figure
        className="journey-photo journey-photo-third"
        style={{ x: thirdX, y: thirdY, scale: thirdScale, opacity: thirdOpacity }}
        aria-hidden={chapter !== 2}
      >
        <img src="/assets/original-1.webp" width="1360" height="1020"
          alt={copy?.alts?.[2] || 'Le restaurant Schützen avec sa route, son escalier d’entrée, sa terrasse et la falaise.'}
          decoding="async" draggable="false" />
      </motion.figure>

      <SceneText scene={scenes[0] || FALLBACK_SCENES[0]} number={0} quiet={quiet} active={chapter === 0} style={{ y: firstTextY, opacity: firstTextOpacity }} />
      <SceneText scene={scenes[1] || FALLBACK_SCENES[1]} number={1} quiet={quiet} active={chapter === 1} style={{ y: secondTextY, opacity: secondTextOpacity }} />
      <SceneText scene={scenes[2] || FALLBACK_SCENES[2]} number={2} quiet={quiet} active={chapter === 2} style={{ y: thirdTextY, opacity: thirdTextOpacity }} />
    </div>
  );
}
