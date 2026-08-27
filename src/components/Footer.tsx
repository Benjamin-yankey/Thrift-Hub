import Image from "next/image";
import Link from "next/link";
import {
  SITE,
  buildWhatsAppLink,
} from "@/lib/site";
import { WhatsAppIcon, InstagramIcon, MailIcon } from "./icons";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Footer() {
  const whatsappHref = buildWhatsAppLink(
    "Hi! I'd like to know more about the current Thrift Hub drop."
  );

  return (
    <footer id="contact" className="bg-charcoal text-cloud">
      <div className="mx-auto max-w-[1800px] px-5 py-16 sm:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/brand/logo-badge-large.png"
                alt="Thrift Hub badge mark"
                width={48}
                height={48}
                className="h-11 w-11"
              />
              <span className="flex flex-col leading-none">
                <span className="font-display text-2xl tracking-wide text-cloud">
                  Thrift Hub
                </span>
                <span className="mt-1 h-[3px] w-full bg-teal" aria-hidden="true" />
              </span>
            </div>
            <p className="mt-5 max-w-xs font-body text-sm leading-relaxed text-cloud/70">
              A curated drop of reworked secondhand clothing. Look, feel,
              and message us before it&apos;s gone.
            </p>
          </div>

          <div>
            <p className="font-tag text-xs font-bold uppercase tracking-[0.15em] text-cloud/70">
              Find your way
            </p>
            <nav className="mt-4 flex flex-col gap-3" aria-label="Footer">
              {LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-body text-sm text-cloud/80 transition-colors hover:text-orange-light"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div>
            <p className="font-tag text-xs font-bold uppercase tracking-[0.15em] text-cloud/70">
              Reach us
            </p>
            <ul className="mt-4 flex flex-col gap-3">
              <li>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 font-body text-sm text-cloud/80 transition-colors hover:text-orange-light"
                >
                  <WhatsAppIcon className="h-4 w-4 text-teal-light" />
                  {SITE.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="flex items-center gap-2.5 font-body text-sm text-cloud/80 transition-colors hover:text-orange-light"
                >
                  <MailIcon className="h-4 w-4 text-teal-light" />
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={SITE.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 font-body text-sm text-cloud/80 transition-colors hover:text-orange-light"
                >
                  <InstagramIcon className="h-4 w-4 text-teal-light" />
                  {SITE.instagramHandle}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
