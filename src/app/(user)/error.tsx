"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error(error.message);
  return (
    <div>
      <h2>エラー</h2>
      <p>{error.message}</p>
    </div>
  );
}
