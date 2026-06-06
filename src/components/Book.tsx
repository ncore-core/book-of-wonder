import { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion } from "framer-motion";
import { BookPage } from "./BookPage";
import { PhotoPage } from "./PhotoPage";
import { chapters } from "@/lib/book-content";

interface Props {
  onClose: () => void;
}

// Index kapitoly, po ktorej sa vloží stránka s nástenkou (fotka).
const PHOTO_AFTER_CHAPTER = 3;

export function Book({ onClose }: Props) {
  const bookRef = useRef<any>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState({ w: 520, h: 680 });
  const totalPages = chapters.length + 4; // intro + nová strana + chapters + photo + záver

  // Mobile-first responzívne rozmery knihy
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 760;
      // ponechaj okolie viditeľné: max 86% šírky, 78% výšky
      const maxW = Math.min(vw * (isMobile ? 0.92 : 0.86), 1100);
      const maxH = Math.min(vh * 0.78, 760);
      let w: number;
      let h: number;
      if (isMobile) {
        // single page
        w = Math.min(maxW, 420);
        h = Math.min(maxH, w * 1.45);
      } else {
        // double page — use w as single-page width
        const totalW = Math.min(maxW, 1080);
        h = Math.min(maxH, totalW * 0.62);
        w = h / 1.4;
      }
      setSize({ w: Math.round(w), h: Math.round(h) });
    };
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  const turn = (dir: 1 | -1) => {
    if (!bookRef.current) return;
    const api = bookRef.current.pageFlip?.();
    if (!api) return;
    if (dir === 1) api.flipNext();
    else api.flipPrev();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative flex w-full flex-col items-center"
    >
      {/* Stôl pod knihou */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-10 mx-auto h-24 max-w-[92vw] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0 0 0 / 0.35), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <HTMLFlipBook
        ref={bookRef}
        width={size.w}
        height={size.h}
        size="stretch"
        minWidth={280}
        maxWidth={620}
        minHeight={400}
        maxHeight={820}
        drawShadow
        flippingTime={2200}
        usePortrait
        startPage={0}
        showCover={false}
        mobileScrollSupport={true}
        maxShadowOpacity={0.65}
        className="book-shadow"
        style={{}}
        startZIndex={0}
        autoSize
        clickEventForward
        useMouseEvents
        swipeDistance={70}
        showPageCorners
        disableFlipByClick={false}
        onFlip={(e: any) => setPage(e.data)}
      >
        {/* Úvodná strana */}
        <BookPage side="right">
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="font-display text-xs uppercase tracking-[0.5em] text-ink/50">
              Predslov
            </p>
            <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Ospravlnienie
            </h1>
            <div className="my-5 h-px w-20 bg-ink/30" />
            <p className="max-w-[26ch] font-serif italic text-ink/70 sm:text-lg">
              Päť kapitol o slove, ktoré prišlo neskoro — ale predsa prišlo.
            </p>
            <p className="mt-10 font-display text-[10px] uppercase tracking-[0.4em] text-ink/45">
              listujte ťahaním rohu
            </p>
          </div>
        </BookPage>

        {/* Nová strana č. 2 */}
        <BookPage number={2} side="right">
          <div className="space-y-3">
            {[
              "Ivetka, chcel by som ti len povedať a venovať pár slov, aby sme to mali jasno. Lebo uvedomujem si, že veľa vecí, ktoré som napísal a povedal, bolo veľmi zlých, a verím tomu, že ti určite ublížili a zranili tvoje city. A verím tomu, že nejaké ťa až zarazili. Chcel by som ti povedať toľko: k tomu dosť veľa vecí, ktoré som napísal, som si mal spätne prečítať, a videl som, že naozaj majú viacero významov a možno to vyzerá oveľa ináč a horšie, ako je.",
              "A určite to, čo som ti písal napríklad včera, nebolo myslené ani nijak dané tomu, aby si sa cítila nejakým spôsobom vystresovaná, alebo že som sa ti vyhrážal neviem s čím. Len proste naozaj som bol na dne a zúfalý, a mohol som si za to sám.",
              "A teraz k veci. Uvedomujem si, že celé toto tu, a to ako mi je, a to že som ti ublížil, a že sa so mnou nechceš baviť, a že ma máš škatulkovaného zrejme ako nejakého hajzla alebo parchanta, alebo že sa na mňa ani nevieš pozrieť a zavolať mi — tak viem, že si za to môžem sám svojimi činmi a rozhodnutiami, ktoré som spravil, a že som ti nevedel dať ani vydýchnuť a nechať ťa vychladnúť.",
              "Ale prosím, cháp že som nezvládol ani fakt ten deň, lebo od toho momentu, keď som to absolútne posral a povedal ti tie hnusné veci a aj napísal, za ktoré sa veľmi hanbím — ale bohužiaľ, napísal som ich ja svojou slobodnou vôľou a veľmi to ľutujem. Od toho momentu, keď som to spravil, sa môj život extrémne zmenil a neviem sa odvtedy dať dokopy, lebo pre mňa samého to bol šok, čo som ti dokázal napísať a povedať v tom hneve, za ktorý si môžem sám. A takisto aj pocit neúspechu a plno starostí, ktoré som si spôsobil takisto sám — nechal som to v sebe proste nahromadiť a odniesla si to tým najviac práve ty, ktorá si za nič nemohla a vždy si stála pri mne a chcela mi ísť len tou najlepšou cestou. A veľmi ľutujem, že si to bola práve ty, ktorá toto už odniesla a trpela moje nálady a zlú energiu, ktorú som dával zo seba v poslednej dobe.",
              "Ale prosím veľmi, že určite som sa ti nejakým spôsobom — aj keď to mohlo veľakrát tak vyzerať — nevyhrážal, a určite by som ti nejakým spôsobom neublížil alebo nejak ťa neohrozil. Len som proste úplný debil, ktorý nevie zniesť to, čo spravil. A ľutujem to veľmi. Som v takom šoku už tri mesiace, že neviem proste prestať myslieť na to zle a neustále sa mi to prehráva v hlave a mám už z toho traumu normálne. Viem, že to nie je žiadne ospravedlnenie, lebo si za to môžem sám, ale bohužiaľ neviem prestať. Snažím sa, ale neviem zvládnuť ani ten jeden deň ti nenapísať.",
              "Veľmi mi chýbaš. Veľmi ľutujem to, ako si sa musela cítiť a koľko bolestí som ti musel spraviť a starostí ti narobiť. Ale naozaj nikdy to nebol môj cieľ alebo nejaký zámer — len hlúpa zhoda okolností plus moja tvrdohlavosť. A veľmi prepáč, že som ťa nepočúval už dávno a nešiel vtedy sa dať dokopy do Kežmarku, a že som si myslel, že sama chceš, aby som sa zbavil — bola to absolútna hlúposť, vtedy som už to pokazil definitívne. Pritom si mi chcela len dobre, aby som mal menej starostí, a ja som to nechápal, lebo som zase len žiarlil.",
              "Prepáč, ak som spôsobil šok alebo nejakým spôsobom typ traumy, alebo ťa len nahneval tým, ako som ťa mojím extrémnym spamovaním žiadal o odpoveď, ktorá už zrejme nikdy nepríde. A veľmi to ľutujem, že to je tak. Naozaj som ti nechcel nejako uškodiť, prisahám — ale aj keď nie som veriaci, tak.",
            ].map((p, j) => (
              <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                {p}
              </p>
            ))}
          </div>
        </BookPage>

        {chapters.flatMap((ch, i) => {
          const pages = [
            <BookPage key={`ch-${i}`} number={i + 3} title={ch.title} side={i % 2 === 0 ? "left" : "right"}>
              <div className="space-y-3">
                {ch.paragraphs.map((p, j) => (
                  <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                    {p}
                  </p>
                ))}
              </div>
            </BookPage>,
          ];
          if (i === PHOTO_AFTER_CHAPTER) {
            pages.push(
              <PhotoPage
                key={`photo-${i}`}
                side={(i + 1) % 2 === 0 ? "left" : "right"}
                caption="zajko — tichá spomienka"
              />,
            );
          }
          return pages;
        })}

        {/* Záver */}
        <BookPage side="left">
          <div className="flex h-full flex-col items-center justify-center text-center">
            <p className="font-display text-xs uppercase tracking-[0.5em] text-ink/50">
              Doslov
            </p>
            <h2 className="mt-4 font-display text-3xl font-semibold text-ink">Koniec knihy</h2>
            <div className="my-5 h-px w-16 bg-ink/30" />
            <p className="max-w-[26ch] font-serif italic text-ink/70">
              Ak ste dočítali až sem — ďakujem. Zatvorte knihu, alebo ju nechajte otvorenú. Obidve majú svoju cenu.
            </p>
          </div>
        </BookPage>
      </HTMLFlipBook>

      {/* Ovládanie */}
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={() => turn(-1)}
          disabled={page === 0}
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 bg-card/70 text-foreground backdrop-blur-sm transition hover:border-foreground/50 hover:bg-card disabled:opacity-30"
          aria-label="Predchádzajúca strana"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>

        <div className="flex min-w-[140px] flex-col items-center font-display">
          <span className="text-[10px] uppercase tracking-[0.4em] text-foreground/55">strana</span>
          <span className="text-sm tabular-nums text-foreground">
            {String(page + 1).padStart(2, "0")} / {String(totalPages).padStart(2, "0")}
          </span>
        </div>

        <button
          onClick={() => turn(1)}
          disabled={page >= totalPages - 1}
          className="group flex h-11 w-11 items-center justify-center rounded-full border border-foreground/20 bg-card/70 text-foreground backdrop-blur-sm transition hover:border-foreground/50 hover:bg-card disabled:opacity-30"
          aria-label="Nasledujúca strana"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>

        <button
          onClick={onClose}
          className="ml-3 rounded-full border border-foreground/20 bg-card/70 px-4 py-2 font-display text-[11px] uppercase tracking-[0.3em] text-foreground/80 backdrop-blur-sm transition hover:border-foreground/50 hover:text-foreground"
        >
          Zavrieť
        </button>
      </div>

      {/* Indikátor postupu */}
      <div className="mt-5 flex gap-2">
        {Array.from({ length: totalPages }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === page ? "w-8 bg-leather" : "w-1.5 bg-foreground/25"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
