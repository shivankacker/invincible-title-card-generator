import { EditorState } from "../types";
import { maxTextureSize, warpText } from "./warp";

export const CARD_WIDTH = 1920;
export const CARD_HEIGHT = 1080;

const TITLE_FONT = "Woodblock";
const BODY_FONT = "Futura";
/** Line box a browser gives Futura at `line-height: normal`. */
const LINE_HEIGHT = 1.5;
/** The warped title is drawn into a box taller than the text it distorts. */
const TITLE_HEIGHT = 1.25;
const TITLE_OFFSET = 0.021;
const CREDITS_GAP = 0.05;
const SMALL_SUBTITLE_SIZE = 0.019;
const SUBTITLE_SIZE = 0.03;
const WATERMARK_SIZE = 0.015;
const WATERMARK_PADDING = 0.01;
const WATERMARK_TEXT = "Made with invincible.shivank.dev";

export interface Layer {
  color: string | null;
  image: HTMLImageElement | null;
}

export interface CardAssets {
  background: Layer;
  effect: Layer | null;
}

const images = new Map<string, Promise<HTMLImageElement | null>>();
let fonts: Promise<unknown> | null = null;

function loadFonts(): Promise<unknown> {
  if (!fonts) {
    fonts = Promise.all([
      document.fonts.load(`100px "${TITLE_FONT}"`),
      document.fonts.load(`100px "${BODY_FONT}"`),
    ]).then(() => document.fonts.ready);
  }
  return fonts;
}

function loadImage(src: string): Promise<HTMLImageElement | null> {
  let image = images.get(src);
  if (!image) {
    image = new Promise<HTMLImageElement | null>((resolve) => {
      const element = new Image();
      element.crossOrigin = "anonymous";
      element.onload = () => resolve(element);
      element.onerror = () => resolve(null);
      element.src = src;
    });
    images.set(src, image);
  }
  return image;
}

/** Splits a CSS `background` shorthand into the parts we can paint on a canvas. */
async function parseLayer(value: string): Promise<Layer> {
  const url = /url\((['"]?)(.*?)\1\)/.exec(value);
  if (url) return { color: null, image: await loadImage(url[2]) };
  const color = value.trim();
  return {
    color: color && CSS.supports("color", color) ? color : null,
    image: null,
  };
}

export async function prepareCard(state: EditorState): Promise<CardAssets> {
  const [background, effect] = await Promise.all([
    parseLayer(state.background),
    state.effect ? parseLayer(state.effect) : null,
    loadFonts(),
  ]);
  return { background, effect };
}

function wrapLines(
  ctx: CanvasRenderingContext2D,
  raw: string,
  maxWidth: number,
): string[] {
  const lines: string[] = [];
  for (const paragraph of raw.split(/\n/)) {
    if (paragraph.trim() === "") {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of paragraph.split(/\s+/)) {
      const candidate = line ? `${line} ${word}` : word;
      if (ctx.measureText(candidate).width <= maxWidth) {
        line = candidate;
        continue;
      }
      if (line) {
        lines.push(line);
        line = word;
        continue;
      }
      // A single word wider than the card: hyphenate it into chunks.
      let start = 0;
      while (start < word.length) {
        let low = 1;
        let high = word.length - start;
        let cut = 1;
        while (low <= high) {
          const mid = (low + high) >> 1;
          const chunk =
            word.slice(start, start + mid) +
            (start + mid < word.length ? "-" : "");
          if (ctx.measureText(chunk).width <= maxWidth) {
            cut = mid;
            low = mid + 1;
          } else {
            high = mid - 1;
          }
        }
        lines.push(
          word.slice(start, start + cut) +
            (start + cut < word.length ? "-" : ""),
        );
        start += cut;
      }
      line = "";
    }
    if (line) lines.push(line);
  }
  return lines.length ? lines : [""];
}

function renderTitle(
  state: EditorState,
  lines: string[],
  fontSize: number,
  lineHeight: number,
): HTMLCanvasElement | null {
  const height = lines.length * lineHeight;
  const limit = maxTextureSize();
  const scale = Math.min(1, limit / Math.max(CARD_WIDTH, height));

  const text = document.createElement("canvas");
  text.width = Math.max(1, Math.round(CARD_WIDTH * scale));
  text.height = Math.max(1, Math.round(height * scale));

  const ctx = text.getContext("2d");
  if (!ctx) return null;
  ctx.scale(scale, scale);
  ctx.font = `${fontSize}px "${TITLE_FONT}"`;
  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;

  lines.forEach((line, index) => {
    const y = index * lineHeight;
    if (state.outline > 0 && state.outlineColor !== "transparent") {
      ctx.lineWidth = state.outline;
      ctx.strokeStyle = state.outlineColor;
      ctx.strokeText(line, CARD_WIDTH / 2, y);
    }
    ctx.fillStyle = state.color;
    ctx.fillText(line, CARD_WIDTH / 2, y);
  });

  return warpText(text, text.width, text.height * TITLE_HEIGHT);
}

function drawLayer(
  ctx: CanvasRenderingContext2D,
  layer: Layer,
  opacity: number,
) {
  ctx.save();
  ctx.globalAlpha = opacity;
  if (layer.color) {
    ctx.fillStyle = layer.color;
    ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  }
  if (layer.image) {
    // `background-size: cover` with `background-position: center`.
    const scale = Math.max(
      CARD_WIDTH / layer.image.width,
      CARD_HEIGHT / layer.image.height,
    );
    const width = layer.image.width * scale;
    const height = layer.image.height * scale;
    ctx.drawImage(
      layer.image,
      (CARD_WIDTH - width) / 2,
      (CARD_HEIGHT - height) / 2,
      width,
      height,
    );
  }
  ctx.restore();
}

/** Draws one line of body text inside a `line-height: normal` line box. */
function drawTextLine(
  ctx: CanvasRenderingContext2D,
  text: string,
  fontSize: number,
  x: number,
  top: number,
) {
  ctx.font = `${fontSize}px "${BODY_FONT}"`;
  const metrics = ctx.measureText(text);
  const ascent = metrics.fontBoundingBoxAscent || fontSize * 0.8;
  const descent = metrics.fontBoundingBoxDescent || fontSize * 0.2;
  const leading = (fontSize * LINE_HEIGHT - (ascent + descent)) / 2;
  ctx.fillText(text, x, top + leading + ascent);
}

export function drawCard(
  canvas: HTMLCanvasElement,
  state: EditorState,
  assets: CardAssets,
  effectOpacity = 1,
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  canvas.width = CARD_WIDTH;
  canvas.height = CARD_HEIGHT;
  ctx.clearRect(0, 0, CARD_WIDTH, CARD_HEIGHT);
  drawLayer(ctx, assets.background, 1);

  const fontSize = (CARD_WIDTH / 100) * state.fontSize;
  const lineHeight = Math.ceil(fontSize);
  ctx.font = `${fontSize}px "${TITLE_FONT}"`;
  const lines = wrapLines(ctx, state.text, CARD_WIDTH);

  const smallSubtitleSize = CARD_WIDTH * SMALL_SUBTITLE_SIZE;
  const subtitleSize = CARD_WIDTH * SUBTITLE_SIZE;
  const titleHeight = lines.length * lineHeight * TITLE_HEIGHT;
  const creditsHeight = state.showCredits
    ? (smallSubtitleSize + subtitleSize) * LINE_HEIGHT
    : 0;
  const creditsGap = state.showCredits
    ? CARD_HEIGHT * CREDITS_GAP +
      (CARD_WIDTH * (state.subtitleOffset - 5)) / 100
    : 0;
  const top = (CARD_HEIGHT - (titleHeight + creditsGap + creditsHeight)) / 2;

  const title = renderTitle(state, lines, fontSize, lineHeight);
  if (title) {
    ctx.drawImage(
      title,
      0,
      top - CARD_WIDTH * TITLE_OFFSET,
      CARD_WIDTH,
      titleHeight,
    );
  }

  if (state.showCredits) {
    const creditsTop = top + titleHeight + creditsGap;
    ctx.fillStyle = state.color;
    ctx.textAlign = "center";
    ctx.textBaseline = "alphabetic";
    drawTextLine(
      ctx,
      state.smallSubtitle,
      smallSubtitleSize,
      CARD_WIDTH / 2,
      creditsTop,
    );
    drawTextLine(
      ctx,
      state.subtitle,
      subtitleSize,
      CARD_WIDTH / 2,
      creditsTop + smallSubtitleSize * LINE_HEIGHT,
    );
  }

  if (assets.effect) drawLayer(ctx, assets.effect, effectOpacity);

  if (state.showWatermark) {
    const size = CARD_WIDTH * WATERMARK_SIZE;
    const padding = CARD_WIDTH * WATERMARK_PADDING;
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "right";
    ctx.textBaseline = "alphabetic";
    drawTextLine(
      ctx,
      WATERMARK_TEXT,
      size,
      CARD_WIDTH - padding,
      CARD_HEIGHT - padding - size * LINE_HEIGHT,
    );
    ctx.restore();
  }
}
