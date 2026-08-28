import Image from "next/image";
import Reveal from "./Reveal";

export default function BrandStory() {
  return (
    <section id="story" className="bg-cloud py-20 sm:py-28">
      <div className="mx-auto grid max-w-[1800px] gap-12 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center lg:gap-16">
        <Reveal className="order-2 lg:order-1">
          <div
            className="relative mx-auto max-w-sm lg:mx-0"
            style={{ transform: "rotate(-2deg)" }}
          >
            <div className="stitch-v absolute -left-4 top-3 bottom-3 hidden text-ink/20 sm:block" />
            <Image
              src="/brand/rework-bench.svg"
              alt="Illustration of a reworking bench with a needle, thread, and a jacket sleeve mid-repair"
              width={720}
              height={720}
              className="w-full"
            />
          </div>
        </Reveal>

        <Reveal delay={100} className="order-1 lg:order-2">
          <h2 className="font-display text-4xl leading-[0.95] text-ink sm:text-5xl">
            <span className="text-orange-deep">
              where fashion meets affordability.
            </span>
          </h2>
          <div className="mt-6 space-y-4 font-body text-base leading-relaxed text-ink/75 sm:text-lg">
            <p>
              Every piece gets pulled by hand out of a bale, and lands on our
              bench before it ever reaches a rack. We shorten what runs long,
              patch what&apos;s torn on purpose, and re-lace what needed it.
              Nothing here was made for us. We just made it wearable again.
            </p>
            <p>
              That&apos;s why drops are small and why sizing runs one piece
              deep. When it&apos;s gone, we&apos;re not restocking the exact
              same jacket, we&apos;re out finding the next one.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
