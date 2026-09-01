"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Product } from "@/lib/site";
import { CATEGORY_LABEL } from "@/lib/site";
import ShopProductCard from "./ShopProductCard";
import Reveal from "./Reveal";

/**
 * Categories are free-form strings in the DB (see `CATEGORIES` in
 * lib/site.ts for the admin's suggested list), so a value the shop sees
 * might not be in `CATEGORY_LABEL` — e.g. a legacy or custom category.
 * Falls back to title-casing the raw slug ("cargo-pants" -> "Cargo Pants")
 * instead of showing it verbatim.
 */
function categoryLabel(value: string): string {
  if (CATEGORY_LABEL[value]) return CATEGORY_LABEL[value];
  return value
    .split("-")
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

type SortKey = "featured" | "price-asc" | "price-desc";

const SORT_OPTIONS: { key: SortKey; label: string; hint: string }[] = [
  {
    key: "featured",
    label: "Featured",
    hint: "Our curated pick order — not sorted by price.",
  },
  {
    key: "price-asc",
    label: "Price: Low to High",
    hint: "Cheapest piece first.",
  },
  {
    key: "price-desc",
    label: "Price: High to Low",
    hint: "Priciest piece first.",
  },
];

const SORT_HINT: Record<SortKey, string> = Object.fromEntries(
  SORT_OPTIONS.map((o) => [o.key, o.hint])
) as Record<SortKey, string>;

/**
 * Client-side filter/sort over a server-fetched product list, per the brand
 * spec's "filter by category, size, price" requirement (section 2.1). The
 * full list is small enough (one drop's worth of secondhand pieces) that
 * fetching everything up front and filtering in the browser is simpler than
 * URL-param-driven server filtering, with no loss of UX.
 */
export default function ShopGrid({ products }: { products: Product[] }) {
  const categories = useMemo(
    () => Array.from(new Set(products.map((p) => p.category))).sort(),
    [products]
  );
  const sizes = useMemo(
    () => Array.from(new Set(products.flatMap((p) => p.sizes))).sort(),
    [products]
  );

  const [category, setCategory] = useState<string>("all");
  const [size, setSize] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState<SortKey>("featured");

  const hasActiveFilters =
    category !== "all" ||
    size !== "all" ||
    query.trim() !== "" ||
    minPrice.trim() !== "" ||
    maxPrice.trim() !== "";

  function clearFilters() {
    setCategory("all");
    setSize("all");
    setQuery("");
    setMinPrice("");
    setMaxPrice("");
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const min = minPrice.trim() === "" ? null : Number(minPrice);
    const max = maxPrice.trim() === "" ? null : Number(maxPrice);

    let next = products.filter((p) => {
      if (category !== "all" && p.category !== category) return false;
      if (size !== "all" && !p.sizes.includes(size)) return false;
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (min !== null && !Number.isNaN(min) && p.price < min) return false;
      if (max !== null && !Number.isNaN(max) && p.price > max) return false;
      return true;
    });

    if (sort === "price-asc") {
      next = [...next].sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      next = [...next].sort((a, b) => b.price - a.price);
    }

    return next;
  }, [products, category, size, query, minPrice, maxPrice, sort]);

  return (
    <div>
      <div
        data-tour="shop-filters"
        className="flex flex-col gap-5 border-b border-paper-line pb-8"
      >
        <div className="flex flex-col gap-1.5 sm:max-w-sm">
          <label
            htmlFor="search"
            className="font-tag text-xs font-bold uppercase tracking-wide text-ink/50"
          >
            Search
          </label>
          <input
            id="search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name…"
            className="rounded-md border border-ink/20 bg-white px-3 py-2 font-tag text-xs font-bold uppercase tracking-wide text-ink outline-none placeholder:text-ink/30 focus:border-orange-deep"
          />
        </div>

        <div className="flex flex-wrap items-start gap-x-8 gap-y-5">
          <SearchDropdown
            label="Category"
            allLabel="All Categories"
            options={categories}
            value={category}
            onChange={setCategory}
            formatOption={categoryLabel}
            searchPlaceholder="Search categories…"
          />

          <SearchDropdown
            label="Size"
            allLabel="All Sizes"
            options={sizes}
            value={size}
            onChange={setSize}
            searchPlaceholder="Search sizes…"
          />

          <div className="flex flex-col gap-1.5">
            <span className="font-tag text-xs font-bold uppercase tracking-wide text-ink/50">
              Price (GHS)
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                aria-label="Minimum price"
                className="w-20 rounded-md border border-ink/20 bg-white px-2.5 py-2 font-tag text-xs font-bold text-ink outline-none placeholder:text-ink/30 focus:border-orange-deep"
              />
              <span className="text-ink/40" aria-hidden>
                –
              </span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                aria-label="Maximum price"
                className="w-20 rounded-md border border-ink/20 bg-white px-2.5 py-2 font-tag text-xs font-bold text-ink outline-none placeholder:text-ink/30 focus:border-orange-deep"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="sort"
              className="font-tag text-xs font-bold uppercase tracking-wide text-ink/50"
            >
              Sort by price
            </label>
            <select
              id="sort"
              value={sort}
              onChange={(e) => setSort(e.target.value as SortKey)}
              className="rounded-md border border-ink/20 bg-white px-3 py-2 font-tag text-xs font-bold uppercase tracking-wide text-ink outline-none focus:border-orange-deep"
            >
              {SORT_OPTIONS.map(({ key, label }) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <p className="max-w-[220px] font-tag text-[10px] normal-case leading-snug text-ink/40">
              {SORT_HINT[sort]}
            </p>
          </div>
        </div>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="self-start font-tag text-xs font-bold uppercase tracking-wide text-ink/50 underline decoration-ink/30 underline-offset-4 transition-colors hover:text-orange-deep"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <p className="mt-6 font-tag text-xs uppercase tracking-wide text-ink/50">
        {filtered.length} {filtered.length === 1 ? "piece" : "pieces"}
      </p>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="font-body text-base text-ink/60">
            Nothing matches those filters right now. Try widening your
            search.
          </p>
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 font-tag text-xs font-bold uppercase tracking-wide text-orange-deep underline decoration-orange-deep/40 underline-offset-4"
            >
              Clear all filters
            </button>
          ) : null}
        </div>
      ) : (
        <div
          data-tour="shop-grid"
          className="mt-6 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((product, i) => (
            <Reveal key={product.id} delay={Math.min(i, 5) * 70}>
              <ShopProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * A filter as a searchable dropdown rather than a chip row — used for both
 * Category and Size. With a growing category taxonomy (16+ garment types)
 * or every size a product might come in (numeric waists, shoe sizes,
 * letter sizes), a flat list of chips doesn't scale, so this pairs a text
 * search with the list to let a shopper jump straight to "Cargo Pants" or
 * "32" instead of scanning.
 */
function SearchDropdown({
  label,
  allLabel,
  options,
  value,
  onChange,
  formatOption = (v) => v,
  searchPlaceholder,
}: {
  label: string;
  allLabel: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
  formatOption?: (value: string) => string;
  searchPlaceholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handlePointerDown(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const filteredOptions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => formatOption(o).toLowerCase().includes(q));
  }, [options, query, formatOption]);

  function select(next: string) {
    onChange(next);
    setOpen(false);
    setQuery("");
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      <span className="font-tag text-xs font-bold uppercase tracking-wide text-ink/50">
        {label}
      </span>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex min-w-[160px] items-center justify-between gap-3 rounded-md border border-ink/20 bg-white px-3 py-2 font-tag text-xs font-bold uppercase tracking-wide text-ink outline-none focus:border-orange-deep"
      >
        {value === "all" ? allLabel : formatOption(value)}
        <span aria-hidden className="text-ink/40">
          {open ? "▴" : "▾"}
        </span>
      </button>

      {open ? (
        <div className="absolute top-full left-0 z-20 mt-1 w-56 overflow-hidden rounded-md border border-ink/20 bg-white shadow-lg">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            autoFocus
            className="w-full border-b border-ink/10 px-3 py-2 font-tag text-xs uppercase tracking-wide text-ink outline-none placeholder:text-ink/30"
          />
          <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
            <li role="option" aria-selected={value === "all"}>
              <button
                type="button"
                onClick={() => select("all")}
                className={`block w-full px-3 py-2 text-left font-tag text-xs font-bold uppercase tracking-wide ${
                  value === "all"
                    ? "bg-charcoal text-cloud"
                    : "text-ink/70 hover:bg-paper-dim"
                }`}
              >
                {allLabel}
              </button>
            </li>
            {filteredOptions.length === 0 ? (
              <li className="px-3 py-2 font-tag text-xs uppercase tracking-wide text-ink/40">
                No matches for &ldquo;{query}&rdquo;
              </li>
            ) : (
              filteredOptions.map((o) => (
                <li key={o} role="option" aria-selected={value === o}>
                  <button
                    type="button"
                    onClick={() => select(o)}
                    className={`block w-full px-3 py-2 text-left font-tag text-xs font-bold uppercase tracking-wide ${
                      value === o
                        ? "bg-charcoal text-cloud"
                        : "text-ink/70 hover:bg-paper-dim"
                    }`}
                  >
                    {formatOption(o)}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
