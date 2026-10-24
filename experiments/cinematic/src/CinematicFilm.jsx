import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useTransform } from 'framer-motion';
import './CinematicFilm.css';

const END = .578;
const FRAME_COUNT = 384;
const FPS = 24;
const POSTER = '/assets/journey/cascade.webp';
const clamp = value => Math.max(0, Math.min(1, value));
const frameForProgress = value => Math.round(clamp(value / END) * (FRAME_COUNT - 1));

const STILL_STOPS = [0, .105, .195, .285, .34, .395, .415, .435, .49, .558];
const STILL_NAMES = ['cascade', 'water-close', 'approach', 'steps-low', 'steps-high', 'landing', 'terrasse-turn', 'table-wide', 'table-approach', 'fondue'];
const stillAt = value => Math.max(0, STILL_STOPS.findLastIndex(stop => value >= stop));

// A failed media decoder leaves the journey usable, without an expensive
// second renderer or deformed optical-flow transitions.
function StillFallback({ progress, mobile }) {
  const [index, setIndex] = useState(() => stillAt(progress.get()));
  useMotionValueEvent(progress, 'change', value => {
    const next = stillAt(value);
    setIndex(current => current === next ? current : next);
  });
  const name = STILL_NAMES[index];
  const portrait = mobile && ['table-wide', 'table-approach', 'fondue'].includes(name);
  const folder = name === 'cascade' || name === 'fondue' ? 'journey' : 'cinematic';
  return <img className="cinematic-film-still" src={`/assets/${folder}/${name}${portrait ? '-mobile' : ''}.webp`} alt="" />;
}

/** A paused, frame-indexed film. Scroll changes seek targets, never playback. */
export default function CinematicFilm({ progress, mobile = false }) {
  const hostRef = useRef(null);
  const videoRef = useRef(null);
  const [failedSource, setFailedSource] = useState(null);
  const [revision, setRevision] = useState(0);
  const source = mobile ? '/assets/cinematic/journey-mobile.mp4' : '/assets/cinematic/journey-desktop.mp4';
  const failed = failedSource === source;
  const visibility = useTransform(progress, value => value >= END ? 'hidden' : 'visible');

  useEffect(() => { setFailedSource(null); }, [source]);

  // New media written during development can replace an initially absent MP4.
  // Production only retries an actual failed resource when connectivity returns.
  useEffect(() => {
    const retry = () => {
      if (failedSource !== source) return;
      setFailedSource(null);
      setRevision(value => value + 1);
    };
    window.addEventListener('online', retry);
    if (import.meta.hot) import.meta.hot.on('vite:afterUpdate', retry);
    return () => {
      window.removeEventListener('online', retry);
      if (import.meta.hot) import.meta.hot.off('vite:afterUpdate', retry);
    };
  }, [failedSource, source]);

  useEffect(() => {
    if (failed) return;
    const host = hostRef.current, video = videoRef.current;
    if (!host || !video) return;
    let disposed = false, raf = 0, seeking = false, metadataReady = false;
    let desiredFrame = frameForProgress(progress.get());
    let presentedFrame = -1;
    let lastTime = (FRAME_COUNT - 1) / FPS;

    host.dataset.renderer = 'video';
    host.dataset.ready = 'false';
    host.dataset.frame = '0';
    delete host.dataset.mediaError;
    video.style.opacity = '0';
    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.pause();

    const markReady = () => {
      if (disposed || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) return;
      host.dataset.ready = 'true';
      video.style.opacity = '1';
    };
    const publishFrame = () => {
      presentedFrame = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(video.currentTime / lastTime * (FRAME_COUNT - 1))));
      host.dataset.frame = String(presentedFrame);
      markReady();
    };
    const schedule = () => {
      if (disposed || raf || document.hidden) return;
      raf = requestAnimationFrame(seekLatest);
    };
    function seekLatest() {
      raf = 0;
      if (disposed || !metadataReady || document.hidden || seeking || video.seeking) return;
      if (desiredFrame === presentedFrame) return;
      const targetTime = desiredFrame / (FRAME_COUNT - 1) * lastTime;
      // Repeated scroll events inside the same frame never restart its seek.
      if (Math.abs(video.currentTime - targetTime) < 1 / FPS * .08) {
        presentedFrame = desiredFrame;
        host.dataset.frame = String(desiredFrame);
        markReady();
        return;
      }
      seeking = true;
      try {
        video.pause();
        video.currentTime = targetTime;
      } catch {
        seeking = false;
        // A media failure, rather than a busy decoder, activates the fallback.
        if (video.error) onError();
      }
    }
    function onMetadata() {
      if (disposed) return;
      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : FRAME_COUNT / FPS;
      lastTime = Math.max(1 / FPS, duration - 1 / FPS);
      metadataReady = true;
      schedule();
    }
    function onLoadedData() {
      if (disposed) return;
      markReady();
      if (!metadataReady) onMetadata();
      if (!video.seeking) publishFrame();
      schedule();
    }
    function onSeeked() {
      if (disposed) return;
      seeking = false;
      publishFrame();
      // The desired target may have changed many times while decoding. Only
      // that latest target is submitted after the previous seek has completed.
      if (presentedFrame !== desiredFrame) schedule();
    }
    function onError() {
      if (disposed) return;
      cancelAnimationFrame(raf); raf = 0;
      host.dataset.mediaError = String(video.error?.code || 'media');
      host.dataset.ready = 'false';
      video.pause();
      setFailedSource(source);
    }
    const onVisibility = () => { if (!document.hidden) schedule(); };
    const preventPlayback = () => video.pause();
    const unsubscribe = progress.on('change', value => {
      const nextFrame = frameForProgress(value);
      if (nextFrame === desiredFrame) return;
      desiredFrame = nextFrame;
      schedule();
    });

    video.addEventListener('loadedmetadata', onMetadata);
    video.addEventListener('loadeddata', onLoadedData);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    video.addEventListener('play', preventPlayback);
    document.addEventListener('visibilitychange', onVisibility);
    // Explicit load also covers a new HMR revision of a previously missing file.
    video.setAttribute('src', source);
    video.load();
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onMetadata();
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onLoadedData();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      unsubscribe();
      document.removeEventListener('visibilitychange', onVisibility);
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('loadeddata', onLoadedData);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      video.removeEventListener('play', preventPlayback);
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [progress, source, revision, failed]);

  return (
    <motion.div
      ref={hostRef}
      className={`cinematic-film${mobile ? ' cinematic-film-mobile' : ''}`}
      style={{ visibility }}
      data-renderer={failed ? 'fallback' : 'video'}
      data-ready="false"
      data-frame="0"
      aria-hidden="true"
    >
      {failed ? <StillFallback progress={progress} mobile={mobile} /> : (
        <video
          key={`${source}:${revision}`}
          ref={videoRef}
          src={source}
          poster={POSTER}
          muted
          playsInline
          preload="auto"
          controls={false}
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-hidden="true"
        />
      )}
    </motion.div>
  );
}
