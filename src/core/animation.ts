/** Total length of the title card animation, in seconds. */
export const ANIMATION_DURATION = 4.5;

/** Duration of the zoom-out; it eases to a stop and holds still after this. */
const ZOOM_END = 1.2;
/** Window during which the subtitles fade in, independent of the zoom. */
const CREDITS_START = 1;
const CREDITS_END = 2.2;
/** The blood-splatter effect wipes in quickly right after the subtitles land. */
export const EFFECT_START = CREDITS_END;
const EFFECT_DURATION = 0.35;
/** Point at which the fade-to-black begins. */
const HOLD_END = 3.5;

/** Card starts zoomed in and eases out to its resting scale. */
const START_SCALE = 1.15;
const REST_SCALE = 1;

function easeOutCubic(x: number): number {
  return 1 - Math.pow(1 - x, 3);
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export interface AnimationFrame {
  /** Zoom factor applied about the card's center. */
  scale: number;
  /** Opacity of the subtitle/credits block. */
  creditsOpacity: number;
  /** Progress (0-1) of the effect layer's bottom-left wipe reveal. */
  effectProgress: number;
  /** Opacity of the black overlay used for the final fade-out. */
  fadeOpacity: number;
}

/** Computes the animation state for a given time (seconds) into the clip. */
export function getAnimationFrame(t: number): AnimationFrame {
  const time = Math.min(Math.max(t, 0), ANIMATION_DURATION);

  // Zoom out once, easing to a stop, then hold at rest for the remainder.
  const zoomProgress = easeOutCubic(Math.min(time / ZOOM_END, 1));
  const scale = START_SCALE + (REST_SCALE - START_SCALE) * zoomProgress;

  const creditsOpacity =
    time <= CREDITS_START
      ? 0
      : time >= CREDITS_END
        ? 1
        : easeInOutCubic(
            (time - CREDITS_START) / (CREDITS_END - CREDITS_START),
          );

  const fadeOpacity =
    time > HOLD_END
      ? easeInOutCubic((time - HOLD_END) / (ANIMATION_DURATION - HOLD_END))
      : 0;

  const effectProgress = Math.min(
    Math.max((time - EFFECT_START) / EFFECT_DURATION, 0),
    1,
  );

  return { scale, creditsOpacity, effectProgress, fadeOpacity };
}
