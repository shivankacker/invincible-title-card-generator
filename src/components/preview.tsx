import { useEffect, useState } from "react";
import { EditorState } from "../types";
import useDeviceInfo from "../utils";
import { effectPresets } from "./toolbar";

export function Preview(props: {
  state: EditorState;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { state, canvasRef } = props;
  const [_canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });

  const device = useDeviceInfo();

  const canvasDimensions = state.generating
    ? {
        width: 1920,
        height: 1080,
      }
    : _canvasDimensions;

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        setCanvasDimensions({
          width: canvasRef.current.clientWidth,
          height: canvasRef.current.clientHeight,
        });
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [canvasRef]);

  return (
    <div className="bg-slate-900 rounded-xl aspect-video overflow-hidden select-none relative">
      {state.generating && (
        <div className="absolute inset-0 bg-slate-900 flex items-center justify-center z-10">
          Generating
        </div>
      )}
      <div
        className="relative flex flex-col items-center justify-center gap-[5%]"
        ref={canvasRef}
        style={{
          width: !state.generating ? "100%" : "1920px",
          height: !state.generating ? "100%" : "1080px",
          background: state.background,
        }}
      >
        <div
          className={`woodblock w-full outline-0 bg-transparent text-center ${(device.os === "ios" || device.browser === "safari") && state.generating ? "" : "curved-text"}`}
          style={{
            lineHeight: 0.8,
            fontSize: `${(canvasDimensions.width / 100) * state.fontSize}px`,
            color: state.color,
            WebkitTextStroke: `${state.outline}px ${state.outlineColor}`,
            marginTop: state.showCredits ? "5%" : "0",
          }}
        >
          {state.text}
        </div>
        {state.effect && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{
              opacity:
                effectPresets.find((e) => e.value === state.effect)?.opacity ||
                1,
              background: state.effect,
            }}
          />
        )}
        {state.showCredits && (
          <div
            style={{
              color: state.color,
            }}
            className="text-center"
          >
            <div
              style={{
                fontSize: `${(canvasDimensions.width / 100) * 1.9}px`,
                fontWeight: canvasDimensions.width * 0.3,
              }}
            >
              {state.smallSubtitle}
            </div>
            <div
              style={{
                fontSize: `${(canvasDimensions.width / 100) * 3}px`,
                fontWeight: canvasDimensions.width * 0.3,
              }}
            >
              {state.subtitle}
            </div>
          </div>
        )}
        {state.showWatermark && (
          <div
            className="absolute bottom-0 right-0 text-white opacity-50 whitespace-nowrap"
            style={{
              fontSize: `${(canvasDimensions.width / 100) * 1.5}px`,
              padding: `${(canvasDimensions.width / 100) * 1}px`,
            }}
          >
            Made with invincible.shivank.dev
          </div>
        )}
      </div>
    </div>
  );
}
