import { useEffect } from "react";
import { EditorState } from "../types";
import { effectPresets } from "./toolbar";
import { CARD_HEIGHT, CARD_WIDTH, drawCard, prepareCard } from "../core/render";

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

  return (
    <div className="bg-slate-900 rounded-xl aspect-video overflow-hidden select-none relative shrink-0">
      <canvas
        ref={canvasRef}
        width={CARD_WIDTH}
        height={CARD_HEIGHT}
        className="block w-full h-full"
      />
    </div>
  );
}
