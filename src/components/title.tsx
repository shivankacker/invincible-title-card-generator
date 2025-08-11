import React, { useEffect, useRef } from "react";
import { Canvas } from "glsl-canvas-js";
import fragment from "./title.frag?raw";
import useDeviceInfo from "../utils";

interface ShaderTextProps {
  text: string;
  color: string;
  fontSize: number;
  outlineColor?: string;
  outline?: number;
  width: number;
}

const Title: React.FC<ShaderTextProps> = ({
  text,
  color,
  fontSize,
  outlineColor = "transparent",
  outline = 0,
  width,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const device = useDeviceInfo();

  useEffect(() => {
    if (!canvasRef.current) return;

    // word-wrap utility (breaks on spaces, respects \n, hard-breaks very long words)
    function wrapLines(
      ctx: CanvasRenderingContext2D,
      raw: string,
      maxWidth: number,
      hyphenateLongWords = true,
    ) {
      const paragraphs = raw.split(/\n/);
      const lines: string[] = [];
      for (const para of paragraphs) {
        if (para.trim() === "") {
          lines.push(""); // blank line
          continue;
        }
        const words = para.split(/\s+/);
        let line = "";
        for (let w of words) {
          const test = line ? line + " " + w : w;
          if (ctx.measureText(test).width <= maxWidth) {
            line = test;
            continue;
          }
          if (!line) {
            // word longer than maxWidth; hard-break
            if (hyphenateLongWords) {
              let start = 0;
              while (start < w.length) {
                let lo = 1,
                  hi = w.length - start,
                  cut = 1;
                while (lo <= hi) {
                  const mid = (lo + hi) >> 1;
                  const chunk =
                    w.slice(start, start + mid) +
                    (start + mid < w.length ? "-" : "");
                  if (ctx.measureText(chunk).width <= maxWidth) {
                    cut = mid;
                    lo = mid + 1;
                  } else {
                    hi = mid - 1;
                  }
                }
                const chunk =
                  w.slice(start, start + cut) +
                  (start + cut < w.length ? "-" : "");
                lines.push(chunk);
                start += cut;
              }
              line = "";
            } else {
              lines.push(w);
              line = "";
            }
          } else {
            lines.push(line);
            line = w;
          }
        }
        if (line) lines.push(line);
      }
      return lines;
    }

    async function updateCanvas() {
      const canvas = canvasRef.current!;
      const dpr = window.devicePixelRatio || 1;

      // Offscreen canvas for text
      const textCanvas = document.createElement("canvas");
      const ctx = textCanvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      // Use unscaled ctx to measure in CSS px
      ctx.font = `${fontSize}px "Woodblock"`;
      const lineHeight = Math.ceil(fontSize * 0.8);

      // Calculate wrapped lines for given width (CSS px)
      const lines = wrapLines(ctx, text, width);

      // Set backing store size in device pixels
      textCanvas.width = Math.max(1, width * dpr);
      textCanvas.height = Math.max(1, lines.length * lineHeight * dpr);

      // Now draw at 1 CSS px scale
      const drawCtx = textCanvas.getContext("2d", { alpha: true })!;
      drawCtx.scale(dpr, dpr);
      drawCtx.clearRect(0, 0, textCanvas.width, textCanvas.height);
      drawCtx.font = `${fontSize}px "Woodblock"`;
      drawCtx.textAlign = "center";
      drawCtx.textBaseline = "top";

      const centerX = width / 2;

      for (let i = 0; i < lines.length; i++) {
        const y = i * lineHeight;
        if (outline > 0 && outlineColor !== "transparent") {
          drawCtx.lineWidth = outline;
          drawCtx.strokeStyle = outlineColor;
          drawCtx.lineJoin = "round";
          drawCtx.miterLimit = 2;
          drawCtx.strokeText(lines[i], centerX, y);
        }
        drawCtx.fillStyle = color;
        drawCtx.fillText(lines[i], centerX, y);
      }

      // Size the visible WebGL canvas to match (CSS px)
      const cssHeight = Math.max(1, lines.length * lineHeight);
      canvas.style.width = `${width}px`;
      const heightOffset =
        lines.length *
        2.7 *
        (fontSize /
          (device.os === "ios" || device.browser === "safari" ? 12 : 6));
      canvas.style.height = `${cssHeight + heightOffset}px`;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(cssHeight * dpr));

      // Init shader and pass the text texture
      const gl = new Canvas(canvas, {
        fragmentString: fragment,
        preserveDrawingBuffer: true,
      });

      gl.setTexture("u_texture", textCanvas, {
        UNPACK_PREMULTIPLY_ALPHA_WEBGL: 1,
      });
    }

    document.fonts.ready.then(updateCanvas);
  }, [text, color, fontSize, outline, outlineColor, width]);

  return <canvas ref={canvasRef} className="block -translate-y-5" />;
};

export default Title;
