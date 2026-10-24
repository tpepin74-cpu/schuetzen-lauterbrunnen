import { motion, useTransform } from 'framer-motion';
import './ImmersiveScene.css';

const DEFAULT_COPY = {
  eyebrow: 'HÔTEL & RESTAURANT · LAUTERBRUNNEN',
  title1: 'Le temps',
  title2: 'suspendu.',
  body: 'Une adresse. Un monde à part.',
  endline: 'Au plus près du Staubbach.',
};

/**
 * One continuous camera move. The real restaurant and street use the unedited
 * original photograph behind CSS silhouette masks. Only transforms animate.
 * Every opacity range ends at 1 to keep native scroll timelines clamped.
 */
export default function ImmersiveScene({ progress, mobile = false, quiet = false, copy, reducedMotion = false }) {
  const words = { ...DEFAULT_COPY, ...copy?.immersive };

  const backgroundScale = useTransform(progress, [0, .12, .72, 1], [1.015, 1.07, 1.72, 2.02]);
  const backgroundY = useTransform(progress, [0, .12, .72, 1], ['0svh', '0svh', '-2svh', '-3svh']);

  const restaurantX = useTransform(progress, [0, .08, .32, .64, .85, 1], ['0%', '1%', '19%', '87%', '177%', '210%']);
  const restaurantY = useTransform(progress, [0, .08, .32, .62, 1], ['0svh', '0svh', '7svh', '23svh', '43svh']);
  const restaurantScale = useTransform(progress, [0, .08, .32, .62, 1], [1, 1.035, 1.33, 1.83, 2.45]);

  const flowersLeftX = useTransform(progress, [0, .03, .32, 1], ['0vw', '0vw', '-65vw', '-160vw']);
  const flowersLeftY = useTransform(progress, [0, .03, .32, 1], ['0svh', '0svh', '35svh', '100svh']);
  const flowersScale = useTransform(progress, [0, .03, .32, 1], [1, 1.03, 1.8, 2.4]);
  const flowersRightX = useTransform(progress, [0, .03, .28, 1], ['0vw', '0vw', '60vw', '160vw']);
  const flowersRightY = useTransform(progress, [0, .03, .28, 1], ['0svh', '0svh', '34svh', '110svh']);

  const flagX = useTransform(progress, [0, .08, .43, 1], ['0vw', '0vw', '-44vw', '-120vw']);
  const flagY = useTransform(progress, [0, .08, .43, 1], ['0svh', '0svh', '14svh', '65svh']);
  const flagScale = useTransform(progress, [0, .08, .43, 1], [1, 1.04, 1.75, 2.5]);

  const cowsX = useTransform(progress, [0, .12, .6, 1], ['0vw', mobile ? '1vw' : '-1vw', mobile ? '45vw' : '-31vw', mobile ? '95vw' : '-74vw']);
  const cowsY = useTransform(progress, [0, .12, .6, 1], ['0svh', '0svh', '10svh', '35svh']);
  const cowsScale = useTransform(progress, [0, .12, .6, 1], [1, 1.06, 1.55, 1.95]);

  const titleY = useTransform(progress, [0, .06, .26, 1], ['0svh', '0svh', '-12svh', '-12svh']);
  const titleOpacity = useTransform(progress, [0, .06, .24, 1], [1, 1, 0, 0]);
  const endY = useTransform(progress, [0, .76, .94, 1], ['3svh', '3svh', '0svh', '0svh']);
  const endOpacity = useTransform(progress, [0, .76, .94, 1], [0, 0, 1, 1]);
  const shadeOpacity = useTransform(progress, [0, .25, 1], [1, .35, .55]);

  const hotelMotion = reducedMotion ? undefined : { x: restaurantX, y: restaurantY, scale: restaurantScale };

  return <div className={`immersive-scene${mobile ? ' immersive-scene-mobile' : ''}${reducedMotion ? ' immersive-scene-still' : ''}`}>
    <motion.div className="immersive-background" style={reducedMotion ? undefined : { scale: backgroundScale, y: backgroundY }}>
      <img src="/assets/immersive/waterfall-background.webp" width="1672" height="941" alt={words.backgroundAlt || 'La cascade du Staubbach et les falaises de Lauterbrunnen.'} fetchPriority="high" decoding="async" draggable="false" />
    </motion.div>

    <motion.div className="immersive-cows" style={reducedMotion ? undefined : { x: cowsX, y: cowsY, scale: cowsScale }} aria-hidden="true">
      <img src="/assets/immersive/cows.webp" alt="" decoding="async" draggable="false" />
    </motion.div>

    <motion.div className="immersive-restaurant" style={hotelMotion}>
      <img className="immersive-real-hotel" src="/assets/original-1.webp" width="1360" height="1020" alt={copy?.alts?.[2] || 'La véritable façade du restaurant Schützen, sa terrasse, ses enseignes, ses escaliers et la route.'} fetchPriority="high" decoding="async" draggable="false" />
      <img className="immersive-real-flag" src="/assets/original-1.webp" width="1360" height="1020" alt="" aria-hidden="true" decoding="async" draggable="false" />
    </motion.div>

    <motion.div className="immersive-swiss-flag" style={reducedMotion ? undefined : { x: flagX, y: flagY, scale: flagScale }} aria-hidden="true">
      <img src="/assets/immersive/swiss-flag.webp" alt="" decoding="async" draggable="false" />
    </motion.div>

    <motion.div className="immersive-flowers immersive-flowers-left" style={reducedMotion ? undefined : { x: flowersLeftX, y: flowersLeftY, scale: flowersScale }} aria-hidden="true">
      <img src="/assets/immersive/geraniums.webp" alt="" decoding="async" draggable="false" />
    </motion.div>
    <motion.div className="immersive-flowers immersive-flowers-right" style={reducedMotion ? undefined : { x: flowersRightX, y: flowersRightY, scale: flowersScale }} aria-hidden="true">
      <img src="/assets/immersive/geraniums.webp" alt="" decoding="async" draggable="false" />
    </motion.div>

    <motion.div className="immersive-reading-shade" style={reducedMotion ? undefined : { opacity: shadeOpacity }} aria-hidden="true" />
    <div className="immersive-atmosphere" aria-hidden="true" />

    <motion.div className="immersive-intro" style={reducedMotion ? undefined : { y: titleY, opacity: titleOpacity }}>
      <div className="immersive-copy-inner" style={{ opacity: quiet ? 0 : 1 }} aria-hidden={quiet}>
        <p className="immersive-eyebrow">{words.eyebrow}</p>
        <h2 className="immersive-headline"><span>{words.title1}</span><em>{words.title2}</em></h2>
        <p className="immersive-intro-body">{words.body}</p>
      </div>
    </motion.div>
    {!reducedMotion && <motion.div className="immersive-end" style={{ y: endY, opacity: endOpacity }}>
      <p className="immersive-copy-inner" style={{ opacity: quiet ? 0 : 1 }} aria-hidden={quiet}>{words.endline}</p>
    </motion.div>}
  </div>;
}
