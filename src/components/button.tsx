export default function Button({
  caption,
  type,
  onClick,
}: {
  caption: string;
  type: "primary" | "secondary" | "danger";
  onClick?: () => void;
}) {
  const bgColor =
    type === "primary"
      ? "bg-blue-500"
      : type === "secondary"
      ? "bg-gray-500"
      : "bg-red-500";
  return (
    <button
      className={`${bgColor} text-white text-sm px-4 py-2 rounded-md`}
      onClick={onClick}
    >
      {caption}
    </button>
  );
}
