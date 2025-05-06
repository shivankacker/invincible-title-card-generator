import React, { useEffect, useRef } from "react";
import { Canvas } from "glsl-canvas-js";
import fragment from "./title.frag?raw";

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

  useEffect(() => {
    async function updateCanvas() {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const pixelRatio = window.devicePixelRatio || 1;

      // Create offscreen canvas for text rendering
      const textCanvas = document.createElement("canvas");
      const scaledWidth = width * pixelRatio;
      const scaledFontSize = fontSize * pixelRatio;

      // Set the actual canvas sizes in pixels
      canvas.width = textCanvas.width = scaledWidth;
      textCanvas.height = scaledFontSize;
      canvas.height = scaledFontSize * 1.2;

      // Set the CSS size to maintain visual dimensions
      canvas.style.width = `${width}px`;
      canvas.style.height = `${fontSize * 1.2}px`;

      const ctx = textCanvas.getContext("2d", { alpha: true });
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);

      // Scale all drawing operations
      ctx.scale(pixelRatio, pixelRatio);

      // Set text properties
      ctx.font = `${fontSize}px "Woodblock"`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const centerX = width / 2;
      const centerY = fontSize / 2;

      // Draw the text
      ctx.fillStyle = color;
      ctx.fillText(text, centerX, centerY);

      // Draw the outline on top of the text
      if (outline > 0 && outlineColor !== "transparent") {
        ctx.lineWidth = outline;
        ctx.strokeStyle = outlineColor;
        ctx.lineJoin = "round";
        ctx.miterLimit = 2;
        ctx.strokeText(text, centerX, centerY);
      }

      // Set up WebGL shader
      const gl = new Canvas(canvas, {
        fragmentString: fragment,
        preserveDrawingBuffer: true, // Allow to copy the canvas when using toDataURL
      });

      // Pass the text canvas to the shader
      gl.setTexture("u_texture", textCanvas, {
        UNPACK_PREMULTIPLY_ALPHA_WEBGL: 1, // Makes text look less aliased
      });
    }

    // Wait for font to load before rendering
    document.fonts.ready.then(() => {
      updateCanvas();
    });
  }, [text, color, fontSize, outline, outlineColor, width]);

  return <canvas ref={canvasRef} className="w-full" />;
};

export default Title;
