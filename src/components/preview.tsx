import { useEffect, useRef, useState } from "react";
import { EditorState } from "../types";

export function Preview(props: {
  state: EditorState;
  canvasRef: React.RefObject<HTMLDivElement | null>;
  setState: (state: EditorState) => void;
}) {
  const { state, setState, canvasRef } = props;
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: 0,
    height: 0,
  });

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
    <div className="bg-slate-900 rounded-xl aspect-video w-full md:w-2/3 overflow-hidden select-none">
      <div
        className="relative w-full h-full flex flex-col items-center justify-center gap-[5%]"
        ref={canvasRef}
        style={{
          background: state.background,
        }}
      >
        <div
          className="woodblock w-full outline-0 bg-transparent text-center curved-text"
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
                fontWeight: "lighter",
              }}
            >
              BASED ON THE COMIC BOOK BY
            </div>
            <div
              style={{
                fontSize: `${(canvasDimensions.width / 100) * 3}px`,
              }}
            >
              Robert Kirkman, Cory Walker, & Ryan Ottley
            </div>
          </div>
        )}
        {state.showWatermark && (
          <div className="absolute bottom-0 right-0 p-2 text-xs text-white opacity-50">
            Made with invincible.shivank.dev
          </div>
        )}
      </div>
    </div>
  );
}
