import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { ArrowIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Page not found  Thrift Hub",
  description: "The page you're looking for doesn't exist or has moved.",
};

export default function NotFound() {
  return (
    <div className="flex min-h-full flex-col bg-paper">
      <Nav />
      <main className="flex flex-1 items-center justify-center px-5 py-24 text-center sm:px-8">
        <div>
          <p className="clip-ticket inline-block bg-charcoal px-4 py-2 font-tag text-[12px] font-bold uppercase tracking-[0.15em] text-orange-light">
            404
          </p>
          <h1 className="mt-6 font-display text-4xl leading-[0.95] text-ink sm:text-5xl">
            Sold out of this page.
          </h1>
          <p className="mx-auto mt-4 max-w-md font-body text-base text-ink/70">
            We couldn&apos;t find what you were looking for. It may have been
            moved, renamed, or never existed in the first place.
          </p>
          <Link
            href="/"
            className="clip-ticket mt-8 inline-flex items-center gap-2 bg-gradient-to-r from-orange-light to-orange px-6 py-3 font-tag text-[13px] font-bold uppercase tracking-wide text-ink transition-transform hover:-translate-y-0.5"
          >
            Back to Home
            <ArrowIcon className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
