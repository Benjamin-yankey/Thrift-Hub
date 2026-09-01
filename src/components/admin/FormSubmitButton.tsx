"use client";

import { useFormStatus } from "react-dom";
import type { ButtonHTMLAttributes } from "react";

/**
 * A submit button that visibly disables itself the instant its form starts
 * submitting, instead of just sitting there with no feedback until the
 * server action's round-trip finishes. `useFormStatus` only sees the
 * nearest enclosing `<form>`, so this only works rendered inside one — each
 * move/featured-toggle button already gets its own dedicated form.
 */
export default function FormSubmitButton({
  className = "",
  disabled,
  children,
  ...rest
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={disabled || pending}
      aria-busy={pending}
      className={`${className} ${pending ? "cursor-wait opacity-50" : ""}`}
      {...rest}
    >
      {children}
    </button>
  );
}
