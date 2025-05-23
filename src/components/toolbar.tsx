import { EditorState } from "../types";
import { CheckBox } from "./checkbox";
import { Slider } from "./slider";
import ColorInput from "./colorinput";
import ImageInput from "./uploadimage";
import html2canvas from "html2canvas-pro";
import AdBanner from "./adbanner";
import domtoimage from "dom-to-image";
import useDeviceInfo from "../utils";

const backgroundPresets = [
  {
    name: "default",
    value: "url('/backgrounds/blue.jpg') no-repeat center center / cover",
  },
  {
    name: "blue",
    value: "#169ee7",
  },
  {
    name: "yellow",
    value: "#eaed00",
  },
  {
    name: "red",
    value: "#e71616",
  },
  {
    name: "purple",
    value: "#a716e7",
  },
  {
    name: "black",
    value: "#000000",
  },
  {
    name: "white",
    value: "#ffffff",
  },
  {
    name: "orange",
    value: "#FFA500",
  },
  {
    name: "gray",
    value: "#808080",
  },
];

const colorPresets = [
  {
    name: "default",
    value: "#eaed00",
  },
  {
    name: "blue",
    value: "#169ee7",
  },
  {
    name: "red",
    value: "#e71616",
  },
  {
    name: "purple",
    value: "#a716e7",
  },
  {
    name: "black",
    value: "#000000",
  },
  {
    name: "white",
    value: "#ffffff",
  },
  {
    name: "orange",
    value: "#FFA500",
  },
  {
    name: "gray",
    value: "#808080",
  },
];

export const effectPresets = [
  {
    name: "None",
    value: null,
  },
  {
    name: "Blood Splatter",
    value:
      "url('/effects/blood/splatter-1.png') no-repeat center center / cover",
  },
  {
    name: "Blood Splatter 2",
    value:
      "url('/effects/blood/splatter-2.png') no-repeat center center / cover",
    opacity: 0.8,
  },
  {
    name: "Blood Splatter 3",
    value:
      "url('/effects/blood/splatter-3.png') no-repeat center center / cover",
    opacity: 0.9,
  },
  {
    name: "Blood Splatter 4",
    value: "url('/effects/blood/level-1.png') no-repeat center center / cover",
    opacity: 0.8,
  },
  {
    name: "Blood Splatter 5",
    value: "url('/effects/blood/level-2.png') no-repeat center center / cover",
    opacity: 0.8,
  },
  {
    name: "Blood Splatter 6",
    value: "url('/effects/blood/level-3.png') no-repeat center center / cover",
    opacity: 0.8,
  },
  {
    name: "Blood Splatter 7",
    value: "url('/effects/blood/level-4.png') no-repeat center center / cover",
    opacity: 0.8,
  },
  {
    name: "Blood Splatter 8",
    value: "url('/effects/blood/level-5.png') no-repeat center center / cover",
    opacity: 0.8,
  },
  {
    name: "????",
    value: "url('/effects/sus.png') no-repeat center center / cover",
    opacity: 0.8,
  },
];

export const presets: (Partial<EditorState> & { name: string })[] = [
  {
    name: "Invincible",
    background: "url('/backgrounds/blue.jpg') no-repeat center center / cover",
    color: "#eaed00",
  },
  {
    name: "Invinciboy",
    background: "url('/backgrounds/blue.jpg') no-repeat center center / cover",
    color: "#000000",
  },
  {
    name: "Atom Eve",
    background: "#eb607a",
    color: "#f3cad2",
  },
  {
    name: "Omni Man",
    background: "#e1ebed",
    color: "#ca4230",
  },
  {
    name: "Allen the Alien",
    background: "#3936ed",
    color: "#2bffe1",
  },
  {
    name: "Immortal",
    background: "#3c3d53",
    color: "#e8c856",
  },
  {
    name: "Oliver",
    background: "#9a004f",
    color: "#95b38e",
  },
];

const Preset = (props: {
  selected: boolean;
  value: string | null;
  onChange: (value: string | null) => void;
  name: string;
}) => {
  return (
    <button
      className={`w-10 shrink-0 aspect-square rounded-xl cursor-pointer hover:-translate-y-1 transition-all border-2 flex items-center justify-center ${props.selected ? "border-white" : "border-white/20"}`}
      style={{
        background: props.value || "",
      }}
      onClick={() => props.onChange(props.value)}
      title={props.name}
    >
      {!props.value && <i className="far fa-ban text-2xl text-white" />}
    </button>
  );
};

export function Toolbar(props: {
  state: EditorState;
  setState: (state: EditorState) => void;
  canvasRef: React.RefObject<HTMLDivElement | null>;
}) {
  const { state, setState, canvasRef } = props;
  const device = useDeviceInfo();

  const download = async () => {
    if (!canvasRef.current) return;
    setState({ ...state, generating: true });
    const dataURL = await new Promise<string>((resolve) => {
      setTimeout(async () => {
        if (device.os === "ios" || device.browser === "safari") {
          const canvas = await html2canvas(canvasRef.current!, {
            allowTaint: true,
            useCORS: true,
            height: canvasRef.current!.clientHeight,
            width: canvasRef.current!.clientWidth,
            scale: 1,
          });
          resolve(canvas.toDataURL("image/png"));
        } else {
          const canvas = await domtoimage.toPng(canvasRef.current!, {
            height: canvasRef.current!.clientHeight,
            width: canvasRef.current!.clientWidth,
          });
          resolve(canvas);
        }
      }, 500);
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "title-card.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setState({ ...state, generating: false });
  };

  return (
    <div className="md:w-1/3 w-full md:max-h-[calc(100vh-150px)] md:overflow-auto">
      <div className="md:pl-4">
        <AdBanner
          data-ad-format="auto"
          data-ad-slot="8323722851"
          data-full-width-responsive="true"
          style={{
            minWidth: 150,
            minHeight: 150,
          }}
        />
        <br />
        <input
          type="text"
          value={state.text}
          onChange={(e) => setState({ ...state, text: e.target.value })}
          className="input w-full"
          placeholder="Enter text"
        />
        <input
          type="text"
          value={state.smallSubtitle}
          onChange={(e) =>
            setState({ ...state, smallSubtitle: e.target.value })
          }
          className="input w-full mt-2"
          placeholder="Subtitle 1"
        />
        <input
          type="text"
          value={state.subtitle}
          onChange={(e) => setState({ ...state, subtitle: e.target.value })}
          className="input w-full mt-2"
          placeholder="Subtitle 2"
        />
        <br />
        <br />
        <Slider
          label="Font Size"
          min={10}
          max={40}
          value={state.fontSize}
          onChange={(value) => setState({ ...state, fontSize: value })}
        />
        <Slider
          label="Outline"
          min={0}
          max={10}
          value={state.outline}
          onChange={(value) => setState({ ...state, outline: value })}
        />
        <br />
        <div className="mt-4 mb-1">Presets</div>
        <div className="flex gap-2 flex-wrap">
          {presets.map((preset) => (
            <button
              className="px-4 py-1 rounded-lg woodblock text-xl cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                setState({ ...state, ...preset });
              }}
              style={{
                background: preset.background,
                color: preset.color,
              }}
              key={preset.name}
            >
              {preset.name}
            </button>
          ))}
        </div>
        <div className="mt-4 mb-1">Backgrounds</div>
        <div className="flex gap-2 flex-wrap">
          {backgroundPresets.map((preset) => (
            <Preset
              key={preset.name}
              value={preset.value}
              selected={preset.value === state.background}
              onChange={(value) =>
                setState({ ...state, background: value || "" })
              }
              name={preset.name}
            />
          ))}
          <ColorInput
            value={state.background}
            onChange={(value) => setState({ ...state, background: value })}
          />
          <ImageInput
            value={state.background}
            onChange={(value) => setState({ ...state, background: value })}
          />
        </div>
        <div className="mt-4 mb-1">Text Color</div>
        <div className="flex gap-2 flex-wrap">
          {colorPresets.map((preset) => (
            <Preset
              key={preset.name}
              value={preset.value}
              selected={preset.value === state.color}
              onChange={(value) => setState({ ...state, color: value || "" })}
              name={preset.name}
            />
          ))}
          <ColorInput
            value={state.color}
            onChange={(value) => setState({ ...state, color: value })}
          />
        </div>
        <div className="mt-4 mb-1">Effects</div>
        <div className="flex gap-2 flex-wrap">
          {effectPresets.map((preset) => (
            <Preset
              key={preset.name}
              value={preset.value}
              selected={preset.value === state.effect}
              onChange={(value) => setState({ ...state, effect: value })}
              name={preset.name}
            />
          ))}
        </div>
        <br />
        <CheckBox
          label="Show Subtitles"
          value={state.showCredits}
          onChange={(value) => setState({ ...state, showCredits: value })}
        />
        <CheckBox
          label={
            <div className="group">
              Show Watermark
              <span className="group-hover:inline hidden ml-2">
                {state.showWatermark ? "🥹" : "😞"} 👉🏻👈🏻
              </span>
            </div>
          }
          value={state.showWatermark}
          onChange={(value) => setState({ ...state, showWatermark: value })}
        />
        <br />
        <AdBanner
          data-ad-format="auto"
          data-ad-slot="4811929231"
          data-full-width-responsive="true"
          style={{
            minWidth: 150,
            minHeight: 150,
          }}
        />
        <button
          className="button mt-4 px-4 py-3 bg-blue-500 text-yellow-200 font-bold hover:bg-blue-600 rounded-lg cursor-pointer w-full"
          onClick={download}
        >
          <i className="fas fa-download mr-2" />
          Download
        </button>
      </div>
    </div>
  );
}
