export type WipeDirection =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right";

export interface EffectConfig {
  /** Corner the reveal wipe grows out from. */
  wipeDirection: WipeDirection;
  /** Sound played (in video exports) when the wipe starts. */
  sound: string;
}

const DEFAULT_EFFECT_CONFIG: EffectConfig = {
  wipeDirection: "bottom-left",
  sound: "/splatter.mp3",
};

/**
 * Per-effect overrides, keyed by the CSS `background` value stored in
 * `EditorState.effect`. Every effect currently shares the default wipe
 * direction/sound, but each one can be customized individually here as new
 * effects are added.
 */
const EFFECT_OVERRIDES: Record<string, Partial<EffectConfig>> = {
  "url('/effects/blood/splatter-1.png') no-repeat center center / cover": {},
  "url('/effects/blood/splatter-2.png') no-repeat center center / cover": {},
  "url('/effects/blood/splatter-3.png') no-repeat center center / cover": {
    wipeDirection: "bottom-right",
  },
  "url('/effects/blood/level-1.png') no-repeat center center / cover": {},
  "url('/effects/blood/level-2.png') no-repeat center center / cover": {},
  "url('/effects/blood/level-3.png') no-repeat center center / cover": {},
  "url('/effects/blood/level-4.png') no-repeat center center / cover": {},
  "url('/effects/blood/level-5.png') no-repeat center center / cover": {
    wipeDirection: "bottom-right",
  },
  "url('/effects/sus.png') no-repeat center center / cover": {},
};

export function getEffectConfig(value: string | null): EffectConfig {
  if (!value) return DEFAULT_EFFECT_CONFIG;
  return { ...DEFAULT_EFFECT_CONFIG, ...EFFECT_OVERRIDES[value] };
}
