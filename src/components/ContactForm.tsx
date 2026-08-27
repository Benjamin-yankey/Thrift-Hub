"use client";

import { useActionState, useEffect, useRef } from "react";
import { submitMessage, type ContactFormState } from "@/app/contact/actions";

const initialState: ContactFormState = { status: "idle", message: "" };

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(
    submitMessage,
    initialState
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.status === "success") {
      formRef.current?.reset();
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="name"
          className="font-tag text-xs font-bold uppercase tracking-wide text-ink/60"
        >
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="border border-ink/20 bg-white px-4 py-3 font-body text-sm text-ink outline-none focus:border-orange-deep"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="font-tag text-xs font-bold uppercase tracking-wide text-ink/60"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="border border-ink/20 bg-white px-4 py-3 font-body text-sm text-ink outline-none focus:border-orange-deep"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="font-tag text-xs font-bold uppercase tracking-wide text-ink/60"
        >
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Wholesale, collab, press, or just say hi..."
          className="border border-ink/20 bg-white px-4 py-3 font-body text-sm text-ink outline-none focus:border-orange-deep"
        />
      </div>

      {state.status !== "idle" ? (
        <p
          role="status"
          aria-live="polite"
          className={`font-body text-sm ${
            state.status === "success" ? "text-teal-deep" : "text-orange-deep"
          }`}
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="clip-ticket mt-1 inline-flex w-fit items-center gap-2 bg-gradient-to-r from-orange-light to-orange px-7 py-3.5 font-tag text-sm font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
