/**
 * Product image/video upload/delete for the admin form. Uploads go straight
 * to the `product-images` Storage bucket using the service-role client —
 * the bucket has no anon/authenticated write policy, so this is the only
 * way writes can happen. (The bucket predates video uploads and keeps its
 * original name; it holds both media types now.) Every request re-checks
 * the session itself; this route is reachable independent of proxy.ts's
 * matcher.
 */
import { NextResponse } from "next/server";
import { getAdminUser } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  PRODUCT_IMAGES_BUCKET,
  storagePathFromPublicUrl,
} from "@/lib/supabase/storage";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024; // 8MB
const MAX_VIDEO_BYTES = 60 * 1024 * 1024; // 60MB

export async function POST(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  if (!isImage && !isVideo) {
    return NextResponse.json(
      { error: "Only image or video files are allowed." },
      { status: 400 }
    );
  }

  const maxBytes = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: isVideo
          ? "Video is too large (max 60MB)."
          : "Image is too large (max 8MB).",
      },
      { status: 400 }
    );
  }

  const extension = file.name.includes(".")
    ? file.name.slice(file.name.lastIndexOf("."))
    : "";
  const path = `${crypto.randomUUID()}${extension}`;

  const supabase = createAdminClient();
  const { error: uploadError } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(PRODUCT_IMAGES_BUCKET).getPublicUrl(path);

  return NextResponse.json({ url: publicUrl, path });
}

export async function DELETE(request: Request) {
  const user = await getAdminUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
  }

  const { url, path: pathFromBody } = await request
    .json()
    .catch(() => ({ url: undefined, path: undefined }));

  const path = pathFromBody || (url ? storagePathFromPublicUrl(url) : null);
  if (!path) {
    return NextResponse.json({ error: "No path or url provided." }, { status: 400 });
  }

  const supabase = createAdminClient();
  const { error } = await supabase.storage
    .from(PRODUCT_IMAGES_BUCKET)
    .remove([path]);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
