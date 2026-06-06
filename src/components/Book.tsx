import { useEffect, useRef, useState, useCallback } from "react";
import HTMLFlipBook from "react-pageflip";
import { motion } from "framer-motion";
import { BookPage } from "./BookPage";
import { PhotoPage } from "./PhotoPage";
import { Book3DOverlay } from "../3d-book/Book3DOverlay";
import type { FlipState } from "../3d-book/Book3DScene";
import { pageTextureCache } from "../3d-book/PageTextureCache";
import { chapters } from "@/lib/book-content";

interface Props {
  onClose: () => void;
}

const PHOTO_AFTER_CHAPTER = 3;

export function Book({ onClose }: Props) {
  const bookRef = useRef<any>(null);
  const bookElRef = useRef<HTMLElement | null>(null);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState({ w: 520, h: 680 });
  const totalPages = chapters.length + 15;

  // 3D overlay state
  const [showOverlay, setShowOverlay] = useState(false);
  const [flipState, setFlipState] = useState<FlipState | null>(null);
  const [leftPageIndex, setLeftPageIndex] = useState(0);
  const [rightPageIndex, setRightPageIndex] = useState(1);
  const [bookElement, setBookElement] = useState<HTMLElement | null>(null);

  // Mobile-first responsive book dimensions
  useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 760;
      const maxW = Math.min(vw * (isMobile ? 0.92 : 0.86), 1100);
      const maxH = Math.min(vh * 0.78, 760);
      let w: number;
      let h: number;
      if (isMobile) {
        w = Math.min(maxW, 420);
        h = Math.min(maxH, w * 1.45);
      } else {
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

  // Compute left/right page indices from current page number
  // Desktop: page 0→{0,1}, page 1→{0,1}, page 2→{2,3}, page 3→{2,3}...
  // Mobile / portrait is handled by the library too; we just map the current page
  const computeSpread = useCallback((pageIndex: number) => {
    const spreadStart = pageIndex % 2 === 0 ? pageIndex : pageIndex - 1;
    const left = spreadStart;
    const right = spreadStart + 1;
    setLeftPageIndex(left);
    setRightPageIndex(right);
  }, []);

  useEffect(() => {
    computeSpread(page);
  }, [page, computeSpread]);

  // Capture book DOM element for texture cache initialization
  const captureBookElement = useCallback(() => {
    const api = bookRef.current?.pageFlip?.();
    if (!api) return;
    const el = api.getUI()?.getDistElement?.() as HTMLElement | undefined;
    if (el) {
      bookElRef.current = el;
      setBookElement(el);
    }
  }, []);

  // Custom 3D page turn using pre-rendered textures
  const turn = useCallback(
    async (dir: 1 | -1) => {
      if (!bookRef.current || flipState !== null) return;
      const api = bookRef.current.pageFlip?.();
      if (!api) return;

      const cur = api.getCurrentPageIndex();
      const max = api.getPageCount() - 1;
      if (dir === 1 && cur >= max) return;
      if (dir === -1 && cur <= 0) return;

      // Ensure book element is captured for texture cache
      if (!bookElRef.current) {
        const el = api.getUI()?.getDistElement?.() as HTMLElement | undefined;
        if (!el) return;
        bookElRef.current = el;
        setBookElement(el);
      }

      const sourceIndex = cur;
      const targetIndex = cur + dir;

      // Try pre-rendered textures
      const usePrerendered =
        pageTextureCache.isInitialized &&
        pageTextureCache.has(sourceIndex) &&
        pageTextureCache.has(targetIndex);

      if (!usePrerendered) {
        // Fallback: use library's built-in flip
        if (dir === 1) api.flipNext();
        else api.flipPrev();
        return;
      }

      // Start 3D overlay flip
      setFlipState({
        direction: dir,
        progress: 0,
        sourcePageIndex: sourceIndex,
        targetPageIndex: targetIndex,
      });
      setShowOverlay(true);

      // Hide HTML book after a brief delay (let 3D scene render first frame)
      const hideTimer = setTimeout(() => {
        if (bookElRef.current) {
          bookElRef.current.style.visibility = "hidden";
        }
      }, 80);

      // Animate: 1000ms ease-out cubic
      const duration = 1000;
      const startTime = performance.now();

      const animate = (now: number) => {
        const elapsed = now - startTime;
        const t = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);

        setFlipState({
          direction: dir,
          progress: eased,
          sourcePageIndex: sourceIndex,
          targetPageIndex: targetIndex,
        });

        if (t < 1) {
          requestAnimationFrame(animate);
        } else {
          clearTimeout(hideTimer);
          if (bookElRef.current) {
            bookElRef.current.style.visibility = "visible";
          }

          // Advance the HTMLFlipBook to the target page
          api.turnToPage(targetIndex);

          // Clean up overlay
          setFlipState(null);
          setShowOverlay(false);
        }
      };

      requestAnimationFrame(animate);
    },
    [flipState],
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1.1, ease: [0.2, 0.8, 0.2, 1] }}
      className="relative flex w-full flex-col items-center"
    >
      {/* Table shadow under the book */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-10 mx-auto h-24 max-w-[92vw] rounded-[50%]"
        style={{
          background:
            "radial-gradient(ellipse, oklch(0 0 0 / 0.35), transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      <div className="book-container-3d">
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
          flippingTime={2800}
          usePortrait
          startPage={0}
          showCover={false}
          mobileScrollSupport={true}
          maxShadowOpacity={0.85}
          className="book-shadow"
          style={{}}
          startZIndex={0}
          autoSize
          clickEventForward
          useMouseEvents
          swipeDistance={50}
          showPageCorners
          disableFlipByClick={false}
          onFlip={(e: any) => {
            setPage(e.data);
            captureBookElement();
          }}
        >
          {/* Úvodná strana */}
          <BookPage side="right">
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-display text-xs uppercase tracking-[0.5em] text-ink/50">
                Predslov
              </p>
              <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
                Ospravedlnenie
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
              ].map((p, j) => (
                <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                  {p}
                </p>
              ))}
            </div>
          </BookPage>

          {/* Nová strana č. 3 */}
          <BookPage number={3} side="left">
            <div className="space-y-3">
              {[
                "Ivet, prosím ťa, toto som ti spravil len ako kvázi prezentačnú formu toho, ako mi to je naozaj ľúto. Neviem sa s tebou už nijak spojiť a povedať ti, ako ma to veľmi mrzí, čo všetko som ti spravil a koľko vecí sa stalo len kvôli tomu, že som nevedel proste počkať a byť viac trpezlivý a nechať ťa vychladnúť, keď proste situácia bola vyhrotená. A vyhrotená bola len a len kvôli mne, lebo som nevedel proste byť viac dospelý a komunikovať na úrovni dospelého.",
              ].map((p, j) => (
                <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                  {p}
                </p>
              ))}
            </div>
          </BookPage>

          {/* Nová strana č. 4 */}
          <BookPage number={4} side="right">
            <div className="space-y-3">
              {[
                "Ivetka, verím tomu, že som ťa musel hrozne sklamať tým, ako si čítala — ak si čítala — tie správy a veci ohľadom mojej rodiny a podobne. Veľmi prosím ťa, že toto sú jedny z najhorších vecí, ktoré prežívam.",
              ].map((p, j) => (
                <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                  {p}
                </p>
              ))}
            </div>
          </BookPage>

          {/* Nová strana č. 5 */}
          <BookPage number={5} side="left">
            <div className="space-y-3">
              {[
                "Ivet, viem že som napísal aj veľa vecí, ktorými som ťa obviňoval z mojich neúspechov alebo zlyhaní, a dával ti za vinu niečo, čo ani zďaleka nemôže byť nikoho iného vina, ako len moja.",
              ].map((p, j) => (
                <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                  {p}
                </p>
              ))}
            </div>
          </BookPage>

          {/* Nová strana č. 6 */}
          <BookPage number={6} side="right">
            <div className="space-y-3">
              {[
                "Ivet, ja viem, že počas tohto obdobia, ktoré je tak hnusne depresívne a škaredé — ale môžem si zaňho sám svojou vinou — som povedal a napísal veľa vecí, kde som sa aj priamo zo začiatku, keď som spravil najhoršiu a najväčšiu chybu môjho života, vyhrážal alebo kvázi dával najavo to, že chcem ukončiť život alebo si nejako ublížiť.",
              ].map((p, j) => (
                <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                  {p}
                </p>
              ))}
            </div>
          </BookPage>

          {/* Nová strana č. 7 */}
          <BookPage number={7} side="left">
            <div className="space-y-3">
              {[
                "Ivetka, chcel by som ti povedať, že neskutočne veľmi ľutujem všetky tie veci, ktorými som ťa veľmi musel uraziť a veľmi ti ublížiť a sám seba zmeniť v tvojich očiach na niečo hrozné.",
              ].map((p, j) => (
                <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                  {p}
                </p>
              ))}
            </div>
          </BookPage>

          {/* Nová strana č. 8 */}
          <BookPage number={8} side="right">
            <div className="space-y-3">
              {[
                "Ivet, chcel by som ťa požiadať o jednu vec, ak by som náhodou už nemal ja možnosť, alebo ak by sa už nedalo. A to je to, že prosím ťa, odkaz raz hodou, ak budeš mať tú možnosť alebo sa ti vyskytne situácia, kde by sa to dalo — prosím ťa, povedz našim, mojim, to, že ma veľmi mrzí, ako som im teraz tie tri mesiace musel ničiť život.",
              ].map((p, j) => (
                <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                  {p}
                </p>
              ))}
            </div>
          </BookPage>

          {/* Nová strana č. 9 */}
          <BookPage number={9} side="left">
            <div className="space-y-3">
              {[
                "A Ivet, uvedomujem si, že po tom všetkom, čo som spravil, napísal, povedal a koľko chýb a problémov som spravil za celé obdobie a do koľkých nepríjemných situácií a pocitov som ťa dostal, ako veľa zlých pocitov som ti dal — a to oprávnene — tak sa bojím z toho najviac na svete, že bohužiaľ som sa pripravil o možnosť s tebou už vôbec len porozprávať.",
              ].map((p, j) => (
                <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                  {p}
                </p>
              ))}
            </div>
          </BookPage>

          {/* Nová strana č. 10 */}
          <BookPage number={10} side="right">
            <div className="space-y-3">
              {[
                "Iveta, chcel by som ti povedať — viem, že sa tomu dá vôbec ťažko veriť, ale naozaj by som ti to chcel povedať a dúfať, že tomu úprimne veríš — a to je to, že naozaj som ťa vždy ľúbil, úprimne.",
              ].map((p, j) => (
                <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                  {p}
                </p>
              ))}
            </div>
          </BookPage>

          {/* Nová strana č. 11 */}
          <BookPage number={11} side="left">
            <div className="space-y-3">
              {[
                "Ani neviem čo presne k tomu dodať, keďže konverzácia v messengeri nasvedčuje tomu, že som zrejme čistý blázon — a to už len z toho hľadiska, že si píšem sám so sebou a v čistom zúfalstve a depresii jak čakám nejakú zázračnú odpoveď od osoby, ktorej som tak veľmi ublížil, že v tých stavoch a tých správach, ktoré tam píšem, mi zrejme ani nedokáže odpovedať.",
              ].map((p, j) => (
                <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                  {p}
                </p>
              ))}
            </div>
          </BookPage>

          {/* Nová strana č. 12 */}
          <BookPage number={12} side="right">
            <div className="space-y-3">
              {[
                "A veľmi ľutujem to, koľko si odo mňa pýtala niečo, a že som to nedokázal spraviť. A veľmi — ale že veľmi — ma to mrzí, lebo ty si bola tá, čo mi dala nový dych tým, že mi kúpila kurz od Marka, ktorý stál celý film mesačný príjem, ktorý si dostávala na život.",
              ].map((p, j) => (
                <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                  {p}
                </p>
              ))}
            </div>
          </BookPage>

          {/* Nová strana č. 13 */}
          <BookPage number={13} side="left">
            <div className="space-y-3">
              {[
                "Iveta, nechal som tu proste aj veci, ktoré som písal o tom, ako som cítil, ktoré boli proste staršieho dátumu — teda čerstvo po tom, čo som to pokašľal.",
              ].map((p, j) => (
                <p key={j} className="text-justify first-letter:font-display first-letter:text-3xl first-letter:font-semibold first-letter:text-leather">
                  {p}
                </p>
              ))}
            </div>
          </BookPage>

          {chapters.flatMap((ch, i) => {
            const pages = [
              <BookPage key={`ch-${i}`} number={i + 14} title={ch.title} side={i % 2 === 0 ? "left" : "right"}>
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

        {/* 3D overlay with multi-layer compositing */}
        <Book3DOverlay
          pageWidth={size.w}
          pageHeight={size.h}
          flipState={flipState}
          leftPageIndex={leftPageIndex}
          rightPageIndex={rightPageIndex}
          visible={showOverlay}
          bookElement={bookElement}
        />
      </div>

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
