import type { Metadata } from "next";
import { Anton, Space_Mono, Work_Sans } from "next/font/google";
import SiteTour from "@/components/SiteTour";
import FaqBot from "@/components/FaqBot";
import "./globals.css";

// Heavy, condensed, poster-voiced — carries the "stat"/statement headlines
// the brand spec calls for. Deliberately not a serif or Inter-style default.
const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

// The typewriter/label-gun face. Echoes the hangtag lettering in the hero
// illustration and does double duty as the site's "spec sheet" voice: nav
// eyebrows, prices, sizes, and drop numbers all read in this face.
const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  weight: ["400", "700"],
  subsets: ["latin"],
});

// Warm, humanist body face for paragraphs and UI copy — quiet enough not to
// compete with the two characterful faces above.
const workSans = Work_Sans({
  variable: "--font-work-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Thrift Hub",
  description:
    "Thrift Hub is a curated drop of reworked secondhand clothing. Browse the current drop and order pieces straight through WhatsApp no cart, no checkout, just first pick.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${anton.variable} ${spaceMono.variable} ${workSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        {children}
        <SiteTour />
        <FaqBot />
      </body>
    </html>
  );
}
