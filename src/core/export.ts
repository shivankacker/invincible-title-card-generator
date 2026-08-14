import { GIFEncoder, quantize, applyPalette } from "gifenc";
import { EditorState } from "../types";
import { CardAssets, drawAnimatedCard, getCardSize } from "./render";
import {
  ANIMATION_DURATION,
  EFFECT_START,
  getAnimationFrame,
} from "./animation";
import { getEffectConfig } from "./effects";

const SOUND_SRC = "/title-card.mp3";
const VIDEO_FPS = 30;
// MediaRecorder has no true "lossless" mode, so we max out the bitrate the
// encoder will accept to get as close to visually lossless as possible.
const VIDEO_BITS_PER_SECOND = 100_000_000;
const AUDIO_BITS_PER_SECOND = 320_000;
const GIF_FPS = 15;
/** GIFs get huge fast, so export them at a capped resolution. */
const GIF_MAX_WIDTH = 720;

const VIDEO_MIME_CANDIDATES = [
  "video/mp4;codecs=avc1.42E01E,mp4a.40.2",
  "video/mp4",
  "video/webm;codecs=vp9,opus",
  "video/webm;codecs=vp8,opus",
  "video/webm",
];

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function pickVideoMimeType(): string | null {
  for (const type of VIDEO_MIME_CANDIDATES) {
    if (MediaRecorder.isTypeSupported(type)) return type;
  }
  return null;
}

async function loadAudioBuffer(
  context: AudioContext,
  src: string,
): Promise<AudioBuffer | null> {
  try {
    const response = await fetch(src);
    const data = await response.arrayBuffer();
    return await context.decodeAudioData(data);
  } catch {
    return null;
  }
}

/** Records the title card animation (with sound) and downloads it as a video. */
export async function exportVideo(
  state: EditorState,
  assets: CardAssets,
  effectOpacity: number,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const mimeType = pickVideoMimeType();
  if (!mimeType) {
    throw new Error("Video recording isn't supported in this browser.");
  }

  const { width, height } = getCardSize(state.aspectRatio);
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const audioContext = new AudioContext();
  const audioBuffer = await loadAudioBuffer(audioContext, SOUND_SRC);
  const splatterBuffer = assets.effect
    ? await loadAudioBuffer(audioContext, getEffectConfig(state.effect).sound)
    : null;
  const destination = audioContext.createMediaStreamDestination();
  let source: AudioBufferSourceNode | null = null;
  if (audioBuffer) {
    source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(destination);
  }
  let splatterSource: AudioBufferSourceNode | null = null;
  if (splatterBuffer) {
    splatterSource = audioContext.createBufferSource();
    splatterSource.buffer = splatterBuffer;
    splatterSource.connect(destination);
  }

  const stream = canvas.captureStream(VIDEO_FPS);
  destination.stream
    .getAudioTracks()
    .forEach((track) => stream.addTrack(track));

  const chunks: BlobPart[] = [];
  const recorder = new MediaRecorder(stream, {
    mimeType,
    videoBitsPerSecond: VIDEO_BITS_PER_SECOND,
    audioBitsPerSecond: AUDIO_BITS_PER_SECOND,
  });
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };
  const finished = new Promise<void>((resolve) => {
    recorder.onstop = () => resolve();
  });

  recorder.start();
  await audioContext.resume();
  source?.start();
  splatterSource?.start(audioContext.currentTime + EFFECT_START);

  const startTime = performance.now();
  await new Promise<void>((resolve) => {
    const step = () => {
      const elapsed = (performance.now() - startTime) / 1000;
      drawAnimatedCard(
        canvas,
        state,
        assets,
        effectOpacity,
        getAnimationFrame(elapsed),
      );
      onProgress?.(Math.min(elapsed / ANIMATION_DURATION, 1));
      if (elapsed >= ANIMATION_DURATION) {
        resolve();
        return;
      }
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });

  source?.stop();
  splatterSource?.stop();
  recorder.stop();
  await finished;
  await audioContext.close();

  const extension = mimeType.startsWith("video/mp4") ? "mp4" : "webm";
  const blob = new Blob(chunks, { type: mimeType.split(";")[0] });
  triggerDownload(blob, `title-card.${extension}`);
}

/** Renders the title card animation frame-by-frame and downloads it as a GIF. */
export async function exportGif(
  state: EditorState,
  assets: CardAssets,
  effectOpacity: number,
  onProgress?: (progress: number) => void,
): Promise<void> {
  const { width: cardWidth, height: cardHeight } = getCardSize(
    state.aspectRatio,
  );
  const scale = Math.min(1, GIF_MAX_WIDTH / cardWidth);
  const width = Math.max(1, Math.round(cardWidth * scale));
  const height = Math.max(1, Math.round(cardHeight * scale));

  const fullCanvas = document.createElement("canvas");
  const scaledCanvas = document.createElement("canvas");
  scaledCanvas.width = width;
  scaledCanvas.height = height;
  const scaledCtx = scaledCanvas.getContext("2d", { willReadFrequently: true });
  if (!scaledCtx) throw new Error("Canvas isn't supported in this browser.");

  const gif = GIFEncoder();
  const frameCount = Math.ceil(ANIMATION_DURATION * GIF_FPS);
  const delay = 1000 / GIF_FPS;

  for (let i = 0; i < frameCount; i++) {
    const frame = getAnimationFrame(i / GIF_FPS);
    drawAnimatedCard(fullCanvas, state, assets, effectOpacity, frame);
    scaledCtx.clearRect(0, 0, width, height);
    scaledCtx.drawImage(fullCanvas, 0, 0, width, height);

    const { data } = scaledCtx.getImageData(0, 0, width, height);
    const palette = quantize(data, 256);
    const index = applyPalette(data, palette);
    gif.writeFrame(index, width, height, { palette, delay });

    onProgress?.((i + 1) / frameCount);
    // Yield so the UI stays responsive during the (CPU-heavy) encode loop.
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  gif.finish();
  const blob = new Blob([gif.bytes()], { type: "image/gif" });
  triggerDownload(blob, "title-card.gif");
}
