import { useEffect } from "react";
import { EditorState } from "../types";
import { effectPresets } from "./toolbar";
import { drawCard, getCardSize, prepareCard } from "../core/render";

export function Preview(props: {
  state: EditorState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const { state, canvasRef } = props;

  useEffect(() => {
    let cancelled = false;
    prepareCard(state).then((assets) => {
      if (cancelled || !canvasRef.current) return;
      const opacity =
        effectPresets.find((effect) => effect.value === state.effect)
          ?.opacity ?? 1;
      drawCard(canvasRef.current, state, assets, opacity);
    });
    return () => {
      cancelled = true;
    };
  }, [state, canvasRef]);

  const { width, height } = getCardSize(state.aspectRatio);
  const isPortrait = state.aspectRatio === "9:16";

  return (
    <div
      className={`bg-slate-900 rounded-xl overflow-hidden select-none relative shrink-0 mx-auto w-full ${isPortrait ? "max-w-sm" : ""}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="block w-full h-full"
      />
    </div>
  );
}
