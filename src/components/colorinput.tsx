export default function ColorInput(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { value, onChange } = props;

  return (
    <label
      className={`w-10 shrink-0 aspect-square rounded-xl cursor-pointer hover:-translate-y-1 transition-all border-2 flex items-center justify-center`}
      style={{
        background: `linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)`,
      }}
      title={"Choose Color"}
    >
      <input
        type="color"
        className="hidden"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </label>
  );
}
