"use client";

import "@uiw/react-md-editor/markdown-editor.css";
import { useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { ProductRow } from "@/lib/products";
import type { ProductStatus } from "@/lib/site";
import { CATEGORIES, STATUS_LABEL } from "@/lib/site";

// MDEditor touches `document` on import, so it can only render on the
// client — this file is already "use client", which is required for
// `next/dynamic(..., { ssr: false })` to be allowed in the App Router.
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

const STATUSES: ProductStatus[] = [
  "new",
  "low-stock",
  "last-one",
  "sold-out",
  "coming-soon",
];

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

export default function ProductForm({
  product,
  action,
}: {
  product?: ProductRow;
  action: (formData: FormData) => void | Promise<void>;
}) {
  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(product));
  const [description, setDescription] = useState(product?.description ?? "");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [video, setVideo] = useState<string | null>(
    product?.video_url || null
  );
  const [videoUploading, setVideoUploading] = useState(false);
  const [videoUploadError, setVideoUploadError] = useState<string | null>(
    null
  );
  // Which uploader is showing right now — a product can still end up with
  // both photos and a video (switching tabs doesn't clear the other one's
  // data, see the `hidden` classes below), this just decides what's in
  // front by default: a video-only product reopens on its video instead
  // of an empty photo picker.
  const [mediaTab, setMediaTab] = useState<"photos" | "video">(
    product?.video_url && product.images.length === 0 ? "video" : "photos"
  );

  // A product tagged with an old/custom category (e.g. from before this
  // taxonomy existed) keeps showing that value as a selectable option
  // instead of silently jumping to whatever's first in the list.
  const categoryOptions =
    product?.category && !CATEGORIES.some((c) => c.value === product.category)
      ? [...CATEGORIES, { value: product.category, label: product.category }]
      : CATEGORIES;

  function handleNameChange(value: string) {
    setName(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setUploadError(null);
    setUploading(true);

    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        const json = await res.json();
        if (!res.ok) {
          setUploadError(json.error ?? "Upload failed.");
          continue;
        }
        setImages((prev) => [...prev, json.url as string]);
      } catch {
        setUploadError("Upload failed. Check your connection and try again.");
      }
    }

    setUploading(false);
  }

  async function handleVideoFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setVideoUploadError(null);
    setVideoUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) {
        setVideoUploadError(json.error ?? "Upload failed.");
      } else {
        setVideo(json.url as string);
      }
    } catch {
      setVideoUploadError(
        "Upload failed. Check your connection and try again."
      );
    }

    setVideoUploading(false);
  }

  function moveImage(index: number, direction: "left" | "right") {
    setImages((prev) => {
      const next = [...prev];
      const swapWith = direction === "left" ? index - 1 : index + 1;
      if (swapWith < 0 || swapWith >= next.length) return prev;
      [next[index], next[swapWith]] = [next[swapWith], next[index]];
      return next;
    });
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <form action={action} className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="name" className="text-sm font-medium text-ink">
            Name
          </label>
          <input
            id="name"
            name="name"
            required
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            className="rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-orange-deep"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="slug" className="text-sm font-medium text-ink">
            Slug
          </label>
          <input
            id="slug"
            name="slug"
            required
            value={slug}
            onChange={(e) => {
              setSlugTouched(true);
              setSlug(e.target.value);
            }}
            className="rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-orange-deep"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="category" className="text-sm font-medium text-ink">
            Category
          </label>
          <select
            id="category"
            name="category"
            required
            defaultValue={product?.category ?? ""}
            className="rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-orange-deep"
          >
            {!product ? (
              <option value="" disabled>
                Select a category…
              </option>
            ) : null}
            {categoryOptions.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="price" className="text-sm font-medium text-ink">
            Price (GHS)
          </label>
          <input
            id="price"
            name="price"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={product?.price ?? ""}
            className="rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-orange-deep"
          />
          <input type="hidden" name="currency" value="GHS" />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="sizes" className="text-sm font-medium text-ink">
            Sizes (comma-separated)
          </label>
          <input
            id="sizes"
            name="sizes"
            placeholder="S, M, L"
            defaultValue={product?.sizes.join(", ") ?? ""}
            className="rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-orange-deep"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="material" className="text-sm font-medium text-ink">
            Material / fabric
          </label>
          <input
            id="material"
            name="material"
            placeholder="100% cotton, reworked denim..."
            defaultValue={product?.material ?? ""}
            className="rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-orange-deep"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="status" className="text-sm font-medium text-ink">
            Status
          </label>
          <select
            id="status"
            name="status"
            defaultValue={product?.status ?? "new"}
            className="rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-orange-deep"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="image_alt" className="text-sm font-medium text-ink">
            Image alt text
          </label>
          <input
            id="image_alt"
            name="image_alt"
            defaultValue={product?.image_alt ?? ""}
            placeholder="Describe the primary photo for screen readers"
            className="rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-orange-deep"
          />
        </div>

        {product ? (
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sort_order"
              className="text-sm font-medium text-ink"
            >
              Sort order
            </label>
            <input
              id="sort_order"
              name="sort_order"
              type="number"
              defaultValue={product.sort_order}
              className="rounded-md border border-paper-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-orange-deep"
            />
          </div>
        ) : null}

        <div className="flex items-center gap-2 pt-6">
          <input
            id="featured"
            name="featured"
            type="checkbox"
            defaultChecked={product?.featured ?? false}
            className="h-4 w-4"
          />
          <label htmlFor="featured" className="text-sm font-medium text-ink">
            Featured on homepage
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-sm font-medium text-ink">Description</label>
        <div data-color-mode="light">
          <MDEditor
            value={description}
            onChange={(v) => setDescription(v ?? "")}
            height={220}
            preview="edit"
          />
        </div>
        <input type="hidden" name="description" value={description} />
      </div>

      <div className="flex flex-col gap-3">
        <label className="text-sm font-medium text-ink">Media</label>
        <div className="inline-flex w-fit overflow-hidden rounded-md border border-paper-line">
          <button
            type="button"
            onClick={() => setMediaTab("photos")}
            aria-pressed={mediaTab === "photos"}
            className={`px-4 py-1.5 text-sm font-medium transition-colors ${
              mediaTab === "photos"
                ? "bg-orange-deep text-white"
                : "bg-white text-ink/70 hover:bg-paper-dim"
            }`}
          >
            Photos
          </button>
          <button
            type="button"
            onClick={() => setMediaTab("video")}
            aria-pressed={mediaTab === "video"}
            className={`border-l border-paper-line px-4 py-1.5 text-sm font-medium transition-colors ${
              mediaTab === "video"
                ? "bg-orange-deep text-white"
                : "bg-white text-ink/70 hover:bg-paper-dim"
            }`}
          >
            Video
          </button>
        </div>

        <div className={mediaTab === "photos" ? "flex flex-col gap-2" : "hidden"}>
        <p className="text-xs text-ink/50">
          First image is the primary/cover photo. Use the arrows to reorder.
        </p>

        {images.length > 0 ? (
          <div className="flex flex-wrap gap-3">
            {images.map((url, index) => (
              <div
                key={url}
                className="relative w-28 rounded-md border border-paper-line bg-white p-2"
              >
                <div className="relative h-24 w-full overflow-hidden rounded bg-cloud">
                  <Image
                    src={url}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                {index === 0 ? (
                  <span className="mt-1 block text-center text-[10px] font-bold uppercase tracking-wide text-teal-deep">
                    Primary
                  </span>
                ) : null}
                <div className="mt-1 flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, "left")}
                    disabled={index === 0}
                    className="rounded border border-paper-line px-1.5 text-xs disabled:opacity-30"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, "right")}
                    disabled={index === images.length - 1}
                    className="rounded border border-paper-line px-1.5 text-xs disabled:opacity-30"
                  >
                    →
                  </button>
                </div>
                <input type="hidden" name="images" value={url} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-ink/50">No images uploaded yet.</p>
        )}

        <div className="mt-2">
          <input
            type="file"
            accept="image/*"
            multiple
            disabled={uploading}
            onChange={(e) => handleFiles(e.target.files)}
            className="text-sm"
          />
          {uploading ? (
            <p className="mt-1 text-xs text-ink/50">Uploading…</p>
          ) : null}
          {uploadError ? (
            <p className="mt-1 text-xs text-red-600">{uploadError}</p>
          ) : null}
        </div>
        </div>

        <div className={mediaTab === "video" ? "flex flex-col gap-2" : "hidden"}>
        <p className="text-xs text-ink/50">
          A short clip shown on the product page — plays muted and on
          repeat, no photos needed alongside it.
        </p>

        {video ? (
          <div className="w-full max-w-xs">
            <video
              src={video}
              controls
              className="w-full rounded-md border border-paper-line bg-black"
            />
            <button
              type="button"
              onClick={() => setVideo(null)}
              className="mt-1.5 text-xs text-red-600 hover:underline"
            >
              Remove video
            </button>
          </div>
        ) : (
          <p className="text-sm text-ink/50">No video uploaded yet.</p>
        )}

        <div className="mt-2">
          <input
            type="file"
            accept="video/*"
            disabled={videoUploading}
            onChange={(e) => handleVideoFile(e.target.files)}
            className="text-sm"
          />
          {videoUploading ? (
            <p className="mt-1 text-xs text-ink/50">Uploading…</p>
          ) : null}
          {videoUploadError ? (
            <p className="mt-1 text-xs text-red-600">{videoUploadError}</p>
          ) : null}
        </div>
        <input type="hidden" name="video_url" value={video ?? ""} />
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={uploading || videoUploading}
          className="rounded-md bg-orange-deep px-5 py-2.5 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {product ? "Save changes" : "Add product"}
        </button>
      </div>
    </form>
  );
}
