import { forwardRef } from "react";
import zajkoPhoto from "@/assets/IMG_20260603_174725172.jpg";

interface Props {
  caption?: string;
  side?: "left" | "right";
}

const rightColText =
  "ivet toto je to naše trdlo ušate ak budeš niekedy chcete s ním stráviť chvíľou tak kľudne daj vedieť donesiem ti ho alebo ak bude pretrvávať tvoja nechuť vo mna tak si ho OK kľudne pošlem po niekom na víkend alebo ako budeš potrebovať alebo chcieť";

const bottomText =
  "nechcem aby mojou chybou si to odniesol ešte Bubo alebo tým tým že budeš mať znemožnené sa s ním stretnúť alebo tiež ho mať keďže to je spoločné a veľmi ľutujem že som to musel takto zničiť a aby sa toto stalo";

export const PhotoPage = forwardRef<HTMLDivElement, Props>(function PhotoPage(
  { caption = "zajko — tichá spomienka" },
  ref,
) {
  return (
    <div ref={ref} className="paper-texture">
      <div className="page-shell right relative flex flex-col overflow-hidden">
        <header className="relative mb-3 border-b border-ink/15 pb-2">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-ink/55">
            Spomienka
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink">
            Na trdlo ušaté
          </h2>
        </header>

        <div className="flex flex-1 flex-col gap-3">
          <div className="flex gap-4">
            {/* Left column — photo frame */}
            <div className="w-[42%] shrink-0">
              <div
                className="rounded-sm bg-[oklch(0.97_0.02_85)] p-1.5 pb-5 shadow-xl"
                style={{
                  boxShadow:
                    "0 10px 22px -8px oklch(0 0 0 / 0.55), 0 3px 8px oklch(0 0 0 / 0.22)",
                }}
              >
                <img
                  src={zajkoPhoto}
                  alt={caption}
                  className="block h-auto w-full object-cover"
                  style={{ aspectRatio: "3/4" }}
                  loading="eager"
                />
                <p
                  className="mt-1 text-center text-[10px] text-ink/70"
                  style={{ fontFamily: "'Caveat', 'Cormorant Garamond', serif" }}
                >
                  {caption}
                </p>
              </div>
            </div>

            {/* Right column — text starting at top right of photo */}
            <div className="flex-1">
              <p className="font-serif text-justify text-sm leading-relaxed text-ink/85 sm:text-base">
                {rightColText}
              </p>
            </div>
          </div>

          {/* Full-width text below the photo */}
          <div className="w-full">
            <p className="font-serif text-justify text-sm leading-relaxed text-ink/85 sm:text-base">
              {bottomText}
            </p>
          </div>
        </div>

        <footer className="relative mt-auto flex items-center justify-between border-t border-ink/15 pt-2 font-display text-xs uppercase tracking-[0.35em] text-ink/55">
          <span>Ospravedlnenie</span>
          <span>· spomienka ·</span>
        </footer>
      </div>
    </div>
  );
});
