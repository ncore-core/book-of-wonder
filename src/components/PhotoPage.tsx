import { forwardRef } from "react";
import photo0 from "@/assets/ivetka-zajko.svg";
import photo1 from "@/assets/IMG_0076.svg";
import photo2 from "@/assets/IMG_0933.svg";
import photo3 from "@/assets/IMG_1189.svg";

interface Props {
  caption?: string;
  side?: "left" | "right";
}

const photos = [
  { src: photo0, caption: "zajko — tichá spomienka", rotate: -6, delay: 0 },
  { src: photo1, caption: "tie chvíle", rotate: 4.5, delay: 0.8 },
  { src: photo2, caption: "spomienka", rotate: -3, delay: 1.6 },
  { src: photo3, caption: "navždy", rotate: 5.5, delay: 2.4 },
];

/** Strana ako nástenka — viaceré polaroidy pripnuté špendlíkmi. */
export const PhotoPage = forwardRef<HTMLDivElement, Props>(function PhotoPage(
  _props,
  ref,
) {
  return (
    <div ref={ref} className="paper-texture">
      <div
        className="page-shell right relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, oklch(0.72 0.06 65 / 0.4), oklch(0.55 0.05 50 / 0.28)), repeating-linear-gradient(45deg, oklch(0.45 0.06 45 / 0.07) 0 2px, transparent 2px 8px)",
        }}
      >
        {/* korková textúra */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              "radial-gradient(oklch(0.35 0.05 45 / 0.18) 1px, transparent 1px), radial-gradient(oklch(0.25 0.04 40 / 0.15) 1px, transparent 1px)",
            backgroundSize: "11px 11px, 17px 17px",
            backgroundPosition: "0 0, 6px 8px",
          }}
        />

        <header className="relative mb-3 border-b border-ink/15 pb-2">
          <p className="font-display text-xs uppercase tracking-[0.4em] text-ink/55">
            Nástenka
          </p>
          <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
            Spomienky
          </h2>
        </header>

        <div className="relative flex flex-1 items-center justify-center">
          <div className="grid w-full grid-cols-2 gap-3 px-1 sm:gap-4">
            {photos.map((p, i) => (
              <div
                key={i}
                className="relative flex items-center justify-center"
                style={{
                  transform: `rotate(${p.rotate}deg)`,
                  animation: `polaroid-sway ${7 + i}s ease-in-out ${p.delay}s infinite`,
                }}
              >
                {/* špendlík */}
                <span
                  aria-hidden
                  className="absolute left-1/2 -top-1.5 z-20 h-3 w-3 -translate-x-1/2 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at 30% 30%, oklch(0.85 0.18 25), oklch(0.45 0.18 25) 70%, oklch(0.25 0.12 25))",
                    boxShadow:
                      "0 2px 4px oklch(0 0 0 / 0.45), inset -1px -1px 2px oklch(0 0 0 / 0.3)",
                  }}
                />
                {/* polaroid */}
                <div
                  className="rounded-sm bg-[oklch(0.97_0.02_85)] p-1.5 pb-5 shadow-xl"
                  style={{
                    boxShadow:
                      "0 10px 22px -8px oklch(0 0 0 / 0.55), 0 3px 8px oklch(0 0 0 / 0.22)",
                  }}
                >
                  <img
                    src={p.src}
                    alt={p.caption}
                    className="block h-auto w-full object-cover"
                    style={{ aspectRatio: "3/4" }}
                    loading="lazy"
                  />
                  <p
                    className="mt-1 text-center text-[10px] text-ink/70"
                    style={{ fontFamily: "'Caveat', 'Cormorant Garamond', serif" }}
                  >
                    {p.caption}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="relative mt-3 flex items-center justify-between border-t border-ink/15 pt-2 font-display text-xs uppercase tracking-[0.35em] text-ink/55">
          <span>Ospravlnienie</span>
          <span>· nástenka ·</span>
        </footer>
      </div>
    </div>
  );
});
