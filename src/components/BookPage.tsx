import { forwardRef, type ReactNode } from "react";

interface Props {
  number?: number;
  title?: string;
  children: ReactNode;
  side?: "left" | "right";
}

/** Jedna strana knihy — render-uje react-pageflip cez forwardRef. */
export const BookPage = forwardRef<HTMLDivElement, Props>(function BookPage(
  { number, title, children, side = "right" },
  ref,
) {
  return (
    <div ref={ref} className="paper-texture">
      <div className={`page-shell ${side}`}>
        {title && (
          <header className="mb-4 border-b border-ink/15 pb-3">
            <p className="font-display text-xs uppercase tracking-[0.4em] text-ink/55">
              Kapitola
            </p>
            <h2 className="font-display text-2xl font-semibold text-ink sm:text-3xl">
              {title}
            </h2>
          </header>
        )}

        <div
          className="page-scroll flex-1 overflow-y-auto pr-1 font-serif text-[0.88rem] leading-relaxed text-ink/85 sm:text-[0.95rem] [scrollbar-width:thin]"
          style={{
            overscrollBehavior: "contain",
            WebkitOverflowScrolling: "touch",
            touchAction: "pan-y",
          }}
          onTouchStartCapture={(e) => e.stopPropagation()}
          onTouchMoveCapture={(e) => e.stopPropagation()}
          onPointerDownCapture={(e) => {
            if (e.pointerType === "touch") e.stopPropagation();
          }}
        >
          {children}
        </div>

        {number !== undefined && (
          <footer className="mt-3 flex items-center justify-between border-t border-ink/15 pt-2 font-display text-xs uppercase tracking-[0.35em] text-ink/55">
            <span>Ospravlnienie</span>
            <span>· {number} ·</span>
          </footer>
        )}
      </div>
    </div>
  );
});
