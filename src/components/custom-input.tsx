export default function CustomInput({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={name} className="text-sm font-medium">
        {label}
      </label>
      <input
        name={name}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-md px-2 py-1"
      />
    </div>
  );
}
