export function CheckBox(props: {
  value: boolean;
  onChange: (value: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <div className="flex items-center">
      <label className="flex items-center cursor-pointer gap-2">
        <input
          type="checkbox"
          className="form-checkbox h-5 w-5 text-blue-600"
          checked={props.value}
          onChange={(e) => props.onChange(e.target.checked)}
        />
        {props.label}
      </label>
    </div>
  );
}
