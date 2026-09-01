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
  if (typeof navigator === "undefined" || !navigator.share || !navigator.canShare) {
    return "clipboard";
  }
  try {
    const probe = new File(["x"], "probe.png", { type: "image/png" });
    return navigator.canShare({ files: [probe] }) ? "share" : "clipboard";
  } catch {
    return "clipboard";
  }
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
 * - Everywhere else (desktop browsers, mainly): there's no share-sheet path
 *   at all, so this copies the photo to the clipboard instead — WhatsApp
 *   Web/Desktop both accept a pasted image straight into the chat — and
 *   opens the chat with the text pre-filled, ready for that one paste.
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
  let imageBlob: Blob | null = null;
  if (imageUrl) {
    try {
      const response = await fetch(imageUrl);
      imageBlob = await response.blob();
    } catch {
      // Couldn't fetch the photo — proceed text-only below.
    }
  }

  if (imageBlob && typeof navigator !== "undefined" && navigator.share) {
    const ext = imageBlob.type.split("/")[1]?.split("+")[0] || "jpg";
    const file = new File([imageBlob], `product.${ext}`, {
      type: imageBlob.type,
    });
    if (navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({ text, files: [file] });
        return { imageCopiedToClipboard: false };
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") {
          return { imageCopiedToClipboard: false };
        }
        // Share failed for some other reason — fall through to the link below.
      }
    }
  }

  let imageCopiedToClipboard = false;
  if (
    imageBlob &&
    typeof navigator !== "undefined" &&
    navigator.clipboard?.write &&
    typeof ClipboardItem !== "undefined"
  ) {
    try {
      const pngBlob = await toPngBlob(imageBlob);
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngBlob }),
      ]);
      imageCopiedToClipboard = true;
    } catch {
      // Clipboard image write unsupported or failed — proceed text-only.
    }
  }

  window.open(whatsappHref, "_blank", "noopener,noreferrer");
  return { imageCopiedToClipboard };
}
