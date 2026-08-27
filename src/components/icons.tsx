/**
 * Small functional/schematic icons only (nav glyphs, social links). Anything
 * with photographic quality or illustrative complexity lives in public/ as a
 * generated raster/SVG asset instead — see FeaturedDrops and BrandStory.
 */

export function TagGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M11 3H19C20.1046 3 21 3.89543 21 5V13L12.5 21.5C11.7189 22.2811 10.4526 22.2811 9.67157 21.5L2.5 14.3284C1.71895 13.5474 1.71895 12.281 2.5 11.5L11 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="15.5" cy="8.5" r="1.75" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12.04 2c-5.5 0-9.96 4.46-9.96 9.96 0 1.76.46 3.4 1.26 4.83L2 22l5.36-1.31a9.9 9.9 0 0 0 4.68 1.19h.01c5.5 0 9.96-4.46 9.96-9.96S17.54 2 12.04 2Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M8.9 7.6c-.2-.44-.4-.45-.6-.46h-.5c-.18 0-.46.07-.7.33-.24.26-.9.88-.9 2.15s.93 2.5 1.05 2.67c.13.18 1.8 2.87 4.43 3.9 2.19.87 2.63.7 3.11.65.48-.04 1.53-.62 1.75-1.22.22-.6.22-1.11.15-1.22-.07-.1-.24-.16-.5-.29-.26-.13-1.53-.75-1.77-.84-.24-.09-.4-.13-.58.13-.17.26-.66.84-.8.99-.15.16-.3.18-.55.06-.26-.13-1.08-.4-2.07-1.28-.76-.68-1.28-1.53-1.43-1.79-.15-.26-.02-.4.11-.53.11-.11.26-.3.38-.44.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.46-.06-.13-.56-1.42-.8-1.94Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function MailIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M5 12h14m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PlayIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M7 5.5v13a1 1 0 0 0 1.53.85l10.4-6.5a1 1 0 0 0 0-1.7l-10.4-6.5A1 1 0 0 0 7 5.5Z" fill="currentColor" />
    </svg>
  );
}

export function MenuIcon({ className, open }: { className?: string; open: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {open ? (
        <path
          d="M6 6l12 12M18 6 6 18"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      ) : (
        <path
          d="M4 7h16M4 12h16M4 17h16"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
