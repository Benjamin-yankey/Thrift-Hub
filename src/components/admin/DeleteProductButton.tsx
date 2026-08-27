"use client";

export default function DeleteProductButton({
  id,
  name,
  action,
}: {
  id: string;
  name: string;
  action: (id: string) => Promise<void>;
}) {
  return (
    <form
      action={() => action(id)}
      onSubmit={(e) => {
        if (!confirm(`Delete "${name}"? This also removes its images.`)) {
          e.preventDefault();
        }
      }}
    >
      <button type="submit" className="text-red-600 hover:underline">
        Delete
      </button>
    </form>
  );
}
