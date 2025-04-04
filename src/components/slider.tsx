export function Slider(props: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label: string;
}) {
  return (
    <label>
      <div className="flex items-center justify-between">
        <div>{props.label}</div>
        <div className="text-xs text-slate-200">{props.value}</div>
      </div>
      <input
        type="range"
        min={props.min}
        max={props.max}
        step={props.step}
        value={props.value}
        onChange={(e) => props.onChange(parseInt(e.target.value, 10))}
        className="w-full"
      />
    </label>
  );
}
