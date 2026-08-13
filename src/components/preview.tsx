import { useEffect, useState } from "react";
import { EditorState } from "../types";
import { effectPresets } from "./toolbar";
import { CARD_HEIGHT, CARD_WIDTH, drawCard, prepareCard } from "../core/render";

export function Preview(props: {
  state: EditorState;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}) {
  const { state, canvasRef } = props;
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    // Cached assets redraw instantly, so only announce loading if it drags on.
    const timer = setTimeout(() => setLoading(true), 150);
    prepareCard(state).then((assets) => {
      clearTimeout(timer);
      if (cancelled || !canvasRef.current) return;
      const opacity =
        effectPresets.find((effect) => effect.value === state.effect)
          ?.opacity ?? 1;
      drawCard(canvasRef.current, state, assets, opacity);
      setLoading(false);
    });
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [state, canvasRef]);

  return (
    <div className="bg-slate-900 rounded-xl aspect-video overflow-hidden select-none relative shrink-0">
      <canvas
        ref={canvasRef}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        className="block w-full h-full"
      />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 pointer-events-none">
          <i className="fas fa-circle-notch animate-spin text-3xl text-slate-100" />
        </div>
      )}
    </div>
  );
}
