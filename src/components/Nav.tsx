"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { buildWhatsAppLink } from "@/lib/site";
import { MenuIcon, WhatsAppIcon } from "./icons";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);
  const whatsappHref = buildWhatsAppLink(
    "Hi! I'd like to know more about the current Thrift Hub drop."
  );

  return (
    <header className="sticky top-0 z-50 bg-charcoal text-cloud">
      <div className="mx-auto flex h-[72px] max-w-[1800px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <Image
            src="/brand/logo-badge-large.png"
            alt="Thrift Hub badge mark"
            width={44}
            height={44}
            priority
            className="h-10 w-10 sm:h-11 sm:w-11"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-xl tracking-wide text-cloud sm:text-2xl">
              Thrift Hub
            </span>
            <span className="mt-1 h-[3px] w-full bg-teal" aria-hidden="true" />
          </span>
        </Link>

        <nav
          className="hidden items-center gap-8 md:flex"
          aria-label="Primary"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="font-body text-[15px] font-medium text-cloud/80 transition-colors hover:text-orange-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="clip-ticket hidden items-center gap-2 bg-gradient-to-r from-orange-light to-orange px-5 py-2.5 font-tag text-[13px] font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5 sm:inline-flex"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Order via WhatsApp
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center text-cloud md:hidden"
          >
            <MenuIcon open={open} className="h-6 w-6" />
          </button>
        </div>
      </div>

      <div
        id="mobile-nav"
        className={`overflow-hidden bg-charcoal transition-[max-height] duration-300 ease-out md:hidden ${
          open ? "max-h-80" : "max-h-0"
        }`}
      >
        <nav
          className="flex flex-col gap-1 px-5 pb-5"
          aria-label="Mobile"
        >
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="border-t border-cloud/10 py-3 font-body text-base font-medium text-cloud/85"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="clip-ticket mt-3 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-orange-light to-orange px-5 py-3 font-tag text-[13px] font-bold uppercase tracking-wide text-ink"
          >
            <WhatsAppIcon className="h-4 w-4" />
            Order via WhatsApp
          </a>
        </nav>
      </div>
    </header>
  );
}
