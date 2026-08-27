# Thrift Hup — Website System Spec

## 1. Overview
**Brand:** Thrift Hup (clothing brand)
**Goal:** A stylish, aesthetic showcase site where visitors browse the catalog, get excited about pieces, and reach out via Contact / WhatsApp to order. Not a full checkout/cart system — it's a "look, feel, inquire" experience.

**Vibe:** Custom, aesthetic ("stat"/statement), friendly, not a generic template. Bold typography, generous whitespace, confident brand voice.

---

## 2. Core Features (v1)

### 2.1 Product Catalog
- Grid/gallery of available clothing items
- Each product: name, images (multiple angles), price, sizes available, short description, fabric/material info
- Filter/sort: by category (tops, bottoms, outerwear, etc.), size, price
- Product detail page per item with larger imagery

### 2.2 Contact / Order Flow
- No cart or payment processing
- "Order via WhatsApp" button on each product → pre-filled message (e.g. "Hi, I'm interested in [Product Name], size [X]") opens WhatsApp chat
- General Contact page/form (name, email, message) for wholesale/collab/other inquiries
- Contact details (WhatsApp number, email, social links) — **you provide these**

### 2.3 Admin / CMS Panel
- You log in to a private admin area to:
  - Add / edit / delete products
  - Upload product images
  - Toggle "in stock" / "sold out" / "coming soon"
  - Edit sizes, price, description per product
  - Reorder/feature products on homepage
- No coding required for routine updates

### 2.4 Homepage
- Hero section (brand statement/tagline, striking visual)
- Featured/new drops
- Brand story snippet
- Link into full catalog

### 2.5 Virtual Try-On — Phased
True photo-based try-on (upload your photo → see the garment realistically on your body) requires AI-based body segmentation + garment fitting. This is a distinct project phase, not a simple animation:

- **v1 (MVP, ships with launch):** Product page shows the item on a model with a smooth 3D-style rotate/zoom interaction — gives a premium, dynamic feel without needing per-user AI processing.
- **v2 (fast-follow):** "See it on you" — user uploads a photo, an AI image model overlays/fits the selected garment onto them. This needs a third-party AI image API, has real per-request cost, and needs quality testing before going live. I'd build and test this as its own module once the core site is live, rather than blocking launch on it.

---

## 3. Suggested Tech Stack
- **Frontend:** React (or Next.js if you want fast pages + easy image handling)
- **Styling:** Tailwind CSS for a fast, custom look
- **CMS/Admin:** Lightweight custom admin panel + database (e.g. Supabase or a headless CMS) so you can manage products without touching code
- **Hosting:** Vercel (pairs well with Next.js) or similar
- **WhatsApp integration:** `wa.me` deep links (no API cost, works instantly)

---

## 4. Data Model (Product)
```
Product {
  id
  name
  category        (e.g. tops, bottoms, outerwear)
  price
  sizes[]          (e.g. S, M, L, XL)
  description
  images[]
  status           (available | sold out | coming soon)
  featured         (boolean)
  createdAt
}
```

---

## 5. Brand Assets

### Logo
- Favicon / app icon: `apple-touch-icon.png`, `favicon.png` (provided)
- Full detailed logo lockup: dark circular badge, orange gift-tag mark with loop + punch hole + chevron detail, two-tone teal ribbon beneath the badge, "Thrift Hup" wordmark with teal underline

### Color Palette
| Role | Color | Hex |
|---|---|---|
| Primary / dark (badge, text) | Charcoal | `#3D4147` |
| Wordmark text | Near-black charcoal | `#26292C` |
| Accent — primary orange (light) | Warm orange | `#FFB84D` |
| Accent — primary orange (dark) | Deep orange | `#F5821F` |
| Accent — orange outline | Burnt orange | `#E8720F` |
| Accent — gold (loop/ring) | Gold | `#F0A500` |
| Accent — teal (light) | Mint teal | `#2DD4A7` |
| Accent — teal (dark) | Deep teal | `#17A184` |

Suggested usage: charcoal for headers/nav/footer backgrounds, orange gradient for CTAs and "order via WhatsApp" buttons, teal for highlights/badges (e.g. "new drop", "sold out" tags), white/off-white for body backgrounds to let the palette pop.

## 6. Still Needed From You
1. **Contact details:** WhatsApp number, email, Instagram/other socials
2. **Product photos:** actual clothing images for the catalog
3. **Copy:** Brand tagline / short "about" blurb
4. **Category list:** What product categories does Thrift Hup sell? (e.g. tees, hoodies, pants...)

---

## 7. Suggested Build Order
1. Homepage + catalog + product detail pages (static structure, placeholder data)
2. Admin panel wired to real database
3. WhatsApp contact flow + contact form
4. Styling pass for full "aesthetic/stat" polish
5. v2: AI virtual try-on module
