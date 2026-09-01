async function toPngBlob(blob: Blob): Promise<Blob> {
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2D canvas context unavailable");
  ctx.drawImage(bitmap, 0, 0);
  return await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) =>
        result ? resolve(result) : reject(new Error("canvas.toBlob failed")),
      "image/png"
    );
  });
}

function canShareFiles(): boolean {
  if (typeof navigator === "undefined" || !navigator.share || !navigator.canShare) {
    return false;
  }
  try {
    const probe = new File(["x"], "probe.png", { type: "image/png" });
    return navigator.canShare({ files: [probe] });
  } catch {
    return false;
  }
}

/**
 * Which of the two `shareProductToWhatsApp` paths this browser will
 * actually take for an image order — used purely to word the "here's what
 * happens when you tap this" hint next to the button correctly per device.
 * Probes with a throwaway file rather than checking screen size/user-agent,
 * since that's the exact same capability the share function itself branches
 * on — a device can't be sorted into "mobile" or "desktop" as a proxy for
 * this without risking a wrong guess on tablets, foldables, etc.
 */
export function whatsAppShareMode(): "share" | "clipboard" {
  return canShareFiles() ? "share" : "clipboard";
}

export type ShareOutcome = {
  /**
   * True when the photo was copied to the clipboard for the shopper to
   * paste in manually — the desktop fallback, since a wa.me link has no
   * parameter that attaches an image (there's no way around that one).
   */
  imageCopiedToClipboard: boolean;
};

/**
 * wa.me links only support pre-filled text — there's no URL parameter for
 * attaching an image, on any device or browser. Two different ways of
 * getting the photo there regardless, depending on what the browser can do:
 *
 * - Mobile with file-sharing support: hand WhatsApp the actual photo
 *   through the native share sheet, text and image together in one share.
 *   This path unavoidably waits on fetching the photo first — Web Share
 *   needs the file in hand before it can share it.
 * - Everywhere else (desktop browsers, mainly): opens WhatsApp immediately
 *   — before fetching anything — rather than making the click sit there
 *   waiting through a network fetch and an image re-encode with nothing
 *   visibly happening. The photo then gets copied to the clipboard in the
 *   background (WhatsApp Web/Desktop both accept a pasted image straight
 *   into the chat), landing a moment after the chat's already open.
 */
export async function shareProductToWhatsApp({
  text,
  whatsappHref,
  imageUrl,
}: {
  text: string;
  whatsappHref: string;
  imageUrl?: string | null;
}): Promise<ShareOutcome> {
  if (imageUrl && canShareFiles()) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const ext = blob.type.split("/")[1]?.split("+")[0] || "jpg";
      const file = new File([blob], `product.${ext}`, { type: blob.type });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ text, files: [file] });
        return { imageCopiedToClipboard: false };
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return { imageCopiedToClipboard: false };
      }
      // Fetch failed, or share failed for some other reason — fall through
      // to the immediate-open path below rather than leaving the click
      // hanging.
    }
  }

  window.open(whatsappHref, "_blank", "noopener,noreferrer");

  let imageCopiedToClipboard = false;
  if (
    imageUrl &&
    typeof navigator !== "undefined" &&
    navigator.clipboard?.write &&
    typeof ClipboardItem !== "undefined"
  ) {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const pngBlob = await toPngBlob(blob);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob }),
      ]);
      imageCopiedToClipboard = true;
    } catch {
      // Fetch, decode, or clipboard write failed/unsupported — WhatsApp is
      // already open with the text either way.
    }
  }

  return { imageCopiedToClipboard };
}
