/**
 * "See it worn" — a stylized, on-brand illustrated toy figure showing
 * roughly where a piece sits on a body, per the brand spec's virtual
 * try-on ask (thrift-hup-system.md section 2.5). This is deliberately NOT
 * a photorealistic try-on: no AI image generation, no per-product cost,
 * and no compositing the actual uploaded photo onto a figure (fragile —
 * an arbitrary garment photo can't be reliably fit to a pose). Instead
 * it's a small jointed-wood-mannequin illustration, faceless and generic
 * on purpose, with a simple colored garment shape placed on the body
 * region the product's category maps to.
 */

type WornRegion = "torso" | "dress" | "legs" | "feet" | "bag";

const CATEGORY_REGION: Record<string, WornRegion> = {
  shirts: "torso",
  "t-shirts": "torso",
  jackets: "torso",
  outerwear: "torso",
  "hoodies-sweatshirts": "torso",
  dresses: "dress",
  trousers: "legs",
  jeans: "legs",
  "cargo-pants": "legs",
  shorts: "legs",
  skirts: "legs",
  sneakers: "feet",
  boots: "feet",
  footwear: "feet",
  bags: "bag",
  accessories: "bag",
  // Legacy taxonomy (see migration 0004) — a product still tagged with one
  // of the original four broad buckets should still land on a sensible
  // body region instead of silently falling back to "torso".
  tops: "torso",
  bottoms: "legs",
};

const REGION_COLOR: Record<WornRegion, string> = {
  torso: "#F5821F",
  dress: "#C16C22",
  legs: "#17A184",
  feet: "#3D4147",
  bag: "#F0A500",
};

const REGION_CAPTION: Record<WornRegion, string> = {
  torso: "Worn up top",
  dress: "Worn as a dress",
  legs: "Worn on the bottom",
  feet: "Worn on your feet",
  bag: "Carried",
};

function regionForCategory(category: string): WornRegion {
  return CATEGORY_REGION[category] ?? "torso";
}

export function wornCaptionForCategory(category: string): string {
  return REGION_CAPTION[regionForCategory(category)];
}

const WOOD = "#F7F5F0";
const DOWEL = "#4B5058";
const JOINT = "#26292C";

export default function WornMannequin({ category }: { category: string }) {
  const region = regionForCategory(category);
  const color = REGION_COLOR[region];

  return (
    <svg
      viewBox="0 0 300 400"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-hidden="true"
      className="animate-mannequin-turn h-full w-full"
    >
      <rect width="300" height="400" fill="#F1EBDD" />

      {/* stand */}
      <ellipse cx="150" cy="385" rx="42" ry="8" fill={DOWEL} opacity="0.5" />
      <line x1="150" y1="378" x2="150" y2="232" stroke={DOWEL} strokeWidth="5" />

      {/* bare legs */}
      <path d="M150,232 L136,300 L140,365" fill="none" stroke={DOWEL} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M150,232 L164,300 L160,365" fill="none" stroke={DOWEL} strokeWidth="13" strokeLinecap="round" strokeLinejoin="round" />
      {region !== "feet" ? (
        <>
          <ellipse cx="140" cy="368" rx="12" ry="6" fill={DOWEL} />
          <ellipse cx="160" cy="368" rx="12" ry="6" fill={DOWEL} />
        </>
      ) : null}
      <circle cx="136" cy="300" r="4" fill={JOINT} />
      <circle cx="164" cy="300" r="4" fill={JOINT} />

      {/* pelvis joint */}
      <circle cx="150" cy="232" r="10" fill={JOINT} />

      {/* bare torso */}
      <rect x="128" y="120" width="44" height="100" rx="20" fill={WOOD} stroke={JOINT} strokeWidth="2" />

      {/* arms */}
      <path d="M132,128 L108,175 L100,225" fill="none" stroke={DOWEL} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M168,128 L192,175 L200,225" fill="none" stroke={DOWEL} strokeWidth="11" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="100" cy="225" r="7" fill={DOWEL} />
      <circle cx="200" cy="225" r="7" fill={DOWEL} />
      <circle cx="108" cy="175" r="4" fill={JOINT} />
      <circle cx="192" cy="175" r="4" fill={JOINT} />
      <circle cx="132" cy="128" r="5" fill={JOINT} />
      <circle cx="168" cy="128" r="5" fill={JOINT} />

      {/* neck + head */}
      <rect x="142" y="104" width="16" height="20" fill={DOWEL} />
      <circle cx="150" cy="90" r="22" fill={WOOD} stroke={JOINT} strokeWidth="2" />

      {/* garment overlay, per category region */}
      {region === "torso" || region === "dress" ? (
        <g fill={color}>
          <path
            d={
              region === "dress"
                ? "M128,124 L172,124 C177,124 179,129 178,136 L188,300 L112,300 L122,136 C121,129 123,124 128,124 Z"
                : "M128,124 L172,124 C177,124 179,129 178,136 L174,222 L126,222 L122,136 C121,129 123,124 128,124 Z"
            }
          />
          {region === "torso" ? (
            <>
              <path d="M132,128 L106,172 L118,180 L142,138 Z" />
              <path d="M168,128 L194,172 L182,180 L158,138 Z" />
            </>
          ) : null}
        </g>
      ) : null}
      {region === "torso" || region === "dress" ? (
        <path d="M142,124 L150,136 L158,124" fill="none" stroke={JOINT} strokeWidth="2" opacity="0.4" />
      ) : null}

      {region === "legs" ? (
        <g fill={color}>
          <rect x="134" y="222" width="32" height="14" rx="6" />
          <path d="M150,232 L136,300 L140,365" fill="none" stroke={color} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M150,232 L164,300 L160,365" fill="none" stroke={color} strokeWidth="15" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      ) : null}

      {region === "feet" ? (
        <g>
          <ellipse cx="140" cy="368" rx="14" ry="7" fill={color} />
          <ellipse cx="160" cy="368" rx="14" ry="7" fill={color} />
          <rect x="128" y="372" width="24" height="3" rx="1.5" fill="#F0A500" opacity="0.8" />
          <rect x="148" y="372" width="24" height="3" rx="1.5" fill="#F0A500" opacity="0.8" />
        </g>
      ) : null}

      {region === "bag" ? (
        <g>
          <path d="M168,128 L228,168" fill="none" stroke={color} strokeWidth="2.5" />
          <rect x="210" y="162" width="30" height="26" rx="4" fill={color} />
          <rect x="218" y="155" width="14" height="8" rx="4" fill="none" stroke={color} strokeWidth="2.5" />
        </g>
      ) : null}
    </svg>
  );
}
