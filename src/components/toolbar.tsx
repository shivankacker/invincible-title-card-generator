import domtoimage from "dom-to-image";
import { EditorState } from "../types";
import { CheckBox } from "./checkbox";
import { Slider } from "./slider";
import ColorInput from "./colorinput";
import ImageInput from "./uploadimage";
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

const effectPresets = [
  {
    name: "None",
    value: null,
  },
  {
    name: "Blood Splatter",
    value: "url('/effects/blood-splatter.png') no-repeat center center / cover",
  },
  {
    name: "????",
    value: "url('/effects/sus.png') no-repeat center center / cover",
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

  const download = async () => {
    if (!canvasRef.current) return;
    setState({ ...state, generating: true });
    const dataURL = await domtoimage.toPng(canvasRef.current, {
      height: 1080,
      width: 1920,
    });

    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "title-card.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setState({ ...state, generating: false });
  };

  const device = useDeviceInfo();

  return (
    <div className="md:w-1/3 w-full md:max-h-[calc(100vh-200px)] md:overflow-auto">
      <div className="md:p-8">
        {device.browser.includes("safari") && (
          <div className="text-red-500 text-sm mb-2">
            <i className="fas fa-exclamation-triangle mr-2" />
            Safari is not supported. Please use Chrome or Firefox.
          </div>
        )}
        <input
          type="text"
          value={state.text}
          onChange={(e) => setState({ ...state, text: e.target.value })}
          className="input w-full"
          placeholder="Enter text"
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
        <button
          className="button mt-4 px-4 py-2 bg-blue-500 text-yellow-200 font-bold hover:bg-blue-600 rounded-lg cursor-pointer"
          onClick={download}
        >
          Download
        </button>
      </div>
    </div>
  );
}
