"use server";

/**
 * Public contact form submission. Unlike the admin product actions, this
 * has no auth check — anyone can submit the contact form — but it still
 * writes through the service-role client rather than relying on the
 * `messages` table's anon insert RLS policy, matching the "all writes go
 * through the admin client" pattern used everywhere else (see
 * src/app/admin/actions.ts). Reads of `messages` are service-role only,
 * from /admin/messages.
 */
import { createAdminClient } from "@/lib/supabase/admin";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function submitMessage(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();

  if (!name || !email || !message) {
    return { status: "error", message: "Please fill in every field." };
  }
  if (!EMAIL_RE.test(email)) {
    return { status: "error", message: "That email address doesn't look right." };
  }

  const supabase = createAdminClient();
  const { error } = await supabase.from("messages").insert({
    name,
    email,
    message,
  });

  if (error) {
    console.error("Failed to save contact message:", error.message);
    return {
      status: "error",
      message: "Something went wrong on our end. Please try again, or message us on WhatsApp instead.",
    };
  }

  return {
    status: "success",
    message: "Thanks! We've got your message and will get back to you soon.",
  };
}
