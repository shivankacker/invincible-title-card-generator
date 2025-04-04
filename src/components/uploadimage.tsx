export default function ImageInput(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  const { onChange } = props;

  return (
    <label
      className={`w-10 shrink-0 aspect-square rounded-xl cursor-pointer hover:-translate-y-1 transition-all border-2 flex items-center justify-center bg-slate-800`}
      title={"Upload Image"}
    >
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
              onChange(`url(${reader.result}) no-repeat center center / cover`);
            };
            reader.readAsDataURL(file);
          }
        }}
        onClick={(e) => {
          // Reset the input value to allow re-uploading the same file
          (e.target as HTMLInputElement).value = "";
        }}
      />
      <i className="fas fa-upload text-lg" />
    </label>
  );
}
