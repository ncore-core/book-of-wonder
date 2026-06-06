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
  const totalPages = chapters.length + 15; // intro + 12 nových strán + chapters + photo + záver

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

        {/* Nová strana č. 3 */}
        <BookPage number={3} side="left">
          <div className="space-y-3">
            {[
              "Ivet, prosím ťa, toto som ti spravil len ako kvázi prezentačnú formu toho, ako mi to je naozaj ľúto. Neviem sa s tebou už nijak spojiť a povedať ti, ako ma to veľmi mrzí, čo všetko som ti spravil a koľko vecí sa stalo len kvôli tomu, že som nevedel proste počkať a byť viac trpezlivý a nechať ťa vychladnúť, keď proste situácia bola vyhrotená. A vyhrotená bola len a len kvôli mne, lebo som nevedel proste byť viac dospelý a komunikovať na úrovni dospelého.",
              "Prepáč, že som bol toľkokrát taký precitlivený, alebo som si myslel, že mi chceš zle, pritom ty si bola vždy tá, čo chcela len dobre a pomôcť. Nechal som tu viacero útržkov z viacerých dní, ktoré sú tu dokonca zo začiatkov — teda asi zhruba tri mesiace staré. Veľmi mi je smutno za tebou, denne ľutujem to, čo som ti spôsobil, a pociťujem prázdnotu po tebe.",
              "Hrozne ma trápi, že toľko šancí od teba som dostal a že väčšina bola kvôli hlúpemu alkoholu, ktorý som nikdy ani nemal piť, ani som ho nezvládol. A ľutujem, že si mi nedala takúto lekciu alebo ešte neviem čo to je, ale kvázi že si toto nespravila hneď na začiatku, keď som si vypil a bol ako kretén. Vtedy by som potreboval tú lekciu, aby som pochopil skôr, o čo som prišiel a čo si pre mňa bola.",
              "Je mi ľúto, že toľkokrát som ťa bral ako nejakú samozrejmosť a nie ako super partnerku, kamarátku, ktorá mi vždy chcela pomôcť a byť pre mňa. Mrzí ma, že som sa nesnažil viac hlavne po tej stránke ako tvoj partner. A mrzí ma, že už aj ako kamarát kvázi som nedokázal byť k tebe úprimný a povedať ti všetky moje problémy a starosti, keď si sama toľkokrát pýtala a chcela a zaujímala si sa. Čo by som teraz dal všetko na svete.",
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
              "Ivetka, verím tomu, že som ťa musel hrozne sklamať tým, ako si čítala — ak si čítala — tie správy a veci ohľadom mojej rodiny a podobne. Veľmi prosím ťa, že toto sú jedny z najhorších vecí, ktoré prežívam. A vstáva sa mi to fakt väčšinou večer a už skoro vždy, že normálne počujem, jak mi niekto chce zle, alebo jak ma ľudia ohovárajú, alebo sa mi posmievajú. A neustále počujem tie čudné hlasy v hlave so všetkými tými výčitkami a bolesťami.",
              "Že som neskutočne hrozný človek, ktorý urobil neskutočne hrozné veci a veľmi ma to ničí. A normálne mám už z toho traumu a nočné mory — normálne bojím toho, čo príde, alebo čo sa deje. A som taký unavený, až sa mi chce vypnúť. Je mi naozaj hrozne z toho, čo som tam písal, ale potom som aj napísal a priznal to, že to môžu byť len moje halucinácie alebo že si to úplne domýšľam z toho ticha, čo je doma, keď je noc.",
              "Naozaj viem, že ak si to čítala, tak ťa to muselo veľmi zaraziť. A mrzí ma, že si o mne musíš asi zrejme myslieť, že som nejaký falošný parchant alebo neviem niečo podobné. Ale veľmi ťa prosím, ja nechcem naozaj nikomu zle. A je mi naozaj extrémne hrozne a cítim sa normálne tak opustene a sám. Prepáč mi, že to takto muselo vyzerať, a nechcem, aby si o mne musela myslieť tieto veci.",
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
              "Ivet, viem že som napísal aj veľa vecí, ktorými som ťa obviňoval z mojich neúspechov alebo zlyhaní, a dával ti za vinu niečo, čo ani zďaleka nemôže byť nikoho iného vina, ako len moja. A hrozne mi je ľúto, že práve tebe som to dával za vinu a spôsobil ti tým veľkú bolesť — a pritom ty si bola tá, ktorá počas celého toho obdobia bola pri mne, vždy stála za mnou a chcela mi pomôcť a vždy myslela na moje dobro.",
              "Je mi hrozne pri pomyslení na to, že ty si potom musela odniesť takéto hnusné slová a obvinenia z mojej strany, kde som ťa veľmi hnusne zhodil a dal som ti to, čo si rozhodne nezaslúžiš. A rozhodne som to nemal povedať nikomu a na nikoho iného dávať, ako len na seba a sebe dávať za vinu. A je mi veľmi ľúto, že som ti týmto ublížil a že som si dovolil niečo také, čo sa nedá ani len tak ľahko pochopiť.",
              "A veľmi ma mrzí, že som bol k tebe takýto. Viem, že to nie je žiadne ospravedlnenie, ale prosím, cháp, že v poslednom období som na tom veľmi zle — čo takisto nie je žiadne ospravedlnenie, lebo ty si bola jediná, ktorá mi ponúkala možnosť a chcela a mala záujem sa so mnou porozprávať a pomôcť mi a chcela pochopiť, čo ma trápi. A pritom ja som bol ten zbabelec, ktorý sa tváril, že mu nič nie je a nemá žiadny problém a že je dokonalý. A to veľmi ľutujem.",
              "Že som sa s tebou — ako jedinou osobou, na ktorej mi takto záleží a bez ktorej som tri mesiace a cítim sa úplne najhoršie za celý život — nedokázal ani poradiť a povedať jej, teda tebe, čo ma skutočne trápi, a nechať si pomôcť. Aj to veľmi ľutujem, Ivetka, že som ti týmto ublížil a bol takýto k tebe.",
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
              "Ivet, ja viem, že počas tohto obdobia, ktoré je tak hnusne depresívne a škaredé — ale môžem si zaňho sám svojou vinou — som povedal a napísal veľa vecí, kde som sa aj priamo zo začiatku, keď som spravil najhoršiu a najväčšiu chybu môjho života, vyhrážal alebo kvázi dával najavo to, že chcem ukončiť život alebo si nejako ublížiť. Veľmi ľutujem, že takto proste znelo a že takéto pocity som ti dával, ktoré si už absolútne nezaslúžiš a nemal by som ich ani vypustiť z úst alebo napísať.",
              "Neskôr som si ale všimol, že keď som si čítal nejaké veci po sebe, tak aj takéto správy dávali aj tento význam — áno, áno, áno. Chcel by som ti povedať, že v poslednom období, aj keď to možno dávalo takýto zmysel to, čo som napísal, tak som to tak naozaj nemyslel. A je mi veľmi ľúto, že som ti niečo také vôbec napísal. Pričom vina je len moja a môžem si za ňu len sám — svojím nechovaním, nezodpovedným správaním a tým, že som si život neplánoval viac dopredu a nevážil si to, čo mám. A to si bola ty — tá, ktorá pri mne vždy chcela stáť a pomáhať mi a išla by so mnou aj na koniec sveta.",
              "A chcem, aby si vedela, že aj keď si možno postrehla — keď si vôbec čítala správy odo mňa — že je tam veľmi premenlivé chovanie, teda osobnostne, chcem ti povedať, že naozaj to nie je nič vážne. Je len proste to, že to nezvládam, a niekedy už neviem ovládať, keď to na mňa príde. A je to veľmi hrozné zažiť na vlastnej koži. A pamätám, koľkokrát si mi povedala, že máš úzkosť alebo depku, a ja som nechápal, ako to je možné, alebo z čoho to máš, a že to môže byť vôbec také vážne. Pritom teraz zisťujem, že to je niečo neskutočne hrozné. A hrozne ľutujem, že som si vôbec niekedy dovolil zasmiať sa nad tým, keď si to povedala, alebo to nebrať úplne vážne a nepristupovať k tomu ako partner, ktorý to berie vážne.",
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
              "Ivetka, chcel by som ti povedať, že neskutočne veľmi ľutujem všetky tie veci, ktorými som ťa veľmi musel uraziť a veľmi ti ublížiť a sám seba zmeniť v tvojich očiach na niečo hrozné. Ale samozrejme, že ľutujem aj tie veci, čo som povedal a ktoré zapríčinili tento spád. A taktiež ľutujem celkovo všetky veci, ktoré sa stali a ktoré som povedal za celé obdobie, čo ťa poznám — ktoré je pre mňa jedno z tých najdôležitejších — a ja som si ho zničil svojím debilným chovaním a tým, že som nevedel byť ten úprimný a riešiť svoje problémy.",
              "Ver, že všetko to, čo som ti napísal za tie tri mesiace, všetko to zlé — že to naozaj ľutujem. A uvedomujem si vážnosť toho, čo som napísal. Čítam si to naozaj každý večer skoro a je mi z toho naozaj zle, že som to dokázal napísať práve tebe. Ale bolo by mi na nič aj keby som to napísal niekomu inému, lebo je to úplne hrozné a hanbím sa za to. Ale bohužiaľ, je to moje a napísal som to ja. Chcel by som sa ti veľmi ospravedlniť za toto všetko — chovanie, stavy, paniky a záchvaty, pri ktorých som písal ako blázon.",
              "A naozaj sa denne modlím, každé ráno keď sa zobudím, že uvidím správu od teba, alebo zmeškaný hovor, alebo prichádzajúci — lebo nedokážem normálne žiť s vedomím, že som prišiel o teba, o tú najlepšiu osobu v mojom živote, a že som ti takto hrozne ublížil a hrozným spôsobom ťa urazil a zhodil, ako keby som si ťa vôbec ani nevážil. A ľutujem ten moment, keď som si vôbec dovolil povedať niečo také a napísať niečo také. A viem, že nie je ospravedlnenie to, v akom stave som to písal a v akých pocitoch som to písal. A viem, že nikdy by som neurobil túto chybu.",
              "A ľutujem to, že toľko šancí som premárnil na hnusný alkohol, ktorý už ani nepijem a nepamätám si, kedy naposledy som si vôbec dal pivo alebo mal chuť na pivo. A nevieš si predstaviť, ako veľmi ľutujem všetky tie momenty a premárnené šance na hlúpy alkohol, pri ktorom som kvázi len naťahoval to, čo sa stalo naposledy. Teraz by som chcel, aby si vedela, že neskutočne veľmi to ľutujem a naozaj sa tým veľmi trápim, lebo viem, že to je len moja vina, za ktorú si dávam sám vinu. A chápem to, že som to prehnal.",
              "A neskutočne veľmi dúfam, že sa mi naozaj ozveš a dáš mi len tú možnosť rozhovoru, aby som ti mohol úprimne a zodpovedne odpovedať na všetky tvoje otázky a povedať všetko, čo sa dialo a prečo som bol taký — a to všetko zo srdca a pravdivo, a pritom sa ti pozerať do očí. Viem, ako to musí vyzerať poslednú dobu, keď si všímaš moje správy náhodou. A úprimne — dnes som na tom vôbec veľmi dobre, ale neviem v zmysle tom, že by som teraz chodil ako nejaký seriálov. Ale naozaj mi je hrozne a nedokážem sa pohnúť ďalej, čo beriem asi ako nejaký typ trestu za to, aký som bol za celé tie štyri roky. Proste nedokážem rozmýšľať nad ničím iným a stále mi ide v hlave len to, ako som ti ublížil a napísal všetky tie svinstvá, za ktoré môžem ja tým, že som bol zbabelec.",
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
              "Ivet, chcel by som ťa požiadať o jednu vec, ak by som náhodou už nemal ja možnosť, alebo ak by sa už nedalo. A to je to, že prosím ťa, odkaz raz hodou, ak budeš mať tú možnosť alebo sa ti vyskytne situácia, kde by sa to dalo — prosím ťa, povedz našim, mojim, to, že ma veľmi mrzí, ako som im teraz tie tri mesiace musel ničiť život a koľko problémov a starostí som im musel spôsobiť už len tým, keď sa na mňa museli pozerať, v akom stave som. Je mi naozaj ľúto, ako som na tom. Len bohužiaľ neviem s tým nijako veľmi čo spraviť. Nedokážem proste z hlavy dostať tie všetky veci a tie pocity a všetko sa len stupňuje a stupňuje.",
              "A veľmi nechcem, ale bohužiaľ musím si priznať, že doma sa snažím nebyť, hlavne kvôli tomu, aby sa na mňa nemuseli pozerať v akom som rozpoložení a aby sa nemuseli trápiť tým, ako som na tom a čo zo mňa bude a aký bude mať život. A naozaj som im veľmi vďačný za to, koľkokrát mi v Bratislave pomohli, ale aj celkovo za život, čo mi všetko dali. A taktiež ma mrzí to, ako sa musia cítiť súrodenci, hlavne Kytka, keďže veľa si toho odniesla kvôli mojim chybám, ale aj Nicko, podľa mňa niečo tuší, aj keď sa tvári, že on nič — ale on je taký vždy.",
              "Celkovo ma mrzí, ako celá domácnosť u nás dopadla s mojím stavom. A som ti veľmi vďačný za všetky tie krásne chvíle a veľmi ľutujem, že som ti dal aj toľko, možno aj viac, z tých zlých. Naozaj nikdy nebol zámer. Ani som nemal tú najmenšiu predstavu, že by to mohlo takto skončiť a že ti môžem až takto ublížiť a spôsobiť takéto starosti a trápenia. Teraz spomínam, že najväčšou radosťou na prvý deň, keď som ťa spoznal, to bol deň, kedy sa mi zmenil život k lepšiemu. A bohužiaľ, len mojou chybou som ho nevyužil naplno.",
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
              "A Ivet, uvedomujem si, že po tom všetkom, čo som spravil, napísal, povedal a koľko chýb a problémov som spravil za celé obdobie a do koľkých nepríjemných situácií a pocitov som ťa dostal, ako veľa zlých pocitov som ti dal — a to oprávnene — tak sa bojím z toho najviac na svete, že bohužiaľ som sa pripravil o možnosť s tebou už vôbec len porozprávať. A že som spôsobil to najhoršie, čo som mohol, a to je to, že už ťa nikdy neuvidím ani nebudem počuť. A môžem si len predstavovať to a keby to mohlo byť, a keď viem, že to je len moja chyba, za ktorú si môžem sám svojou nezodpovednosťou. A že to, čo som robil, má aj následky.",
              "Naozaj dúfam, že dostanem aspoň tú malú možnosť — pre mňa malú, ale pritom veľmi veľkú ochotu z tvojej strany. Keď po tom všetkom si ešte dokázala mi dať možnosť, tak je to naozaj ten najväčší ústupok a šanca, ktorá vôbec môže byť na tomto svete. Lebo naozaj viem, že už toho bolo veľa, aj veľa tých šancí, a že už ťa nebavilo neustále byť v neistote z toho, kedy niečo príde na mňa, alebo mi sadne nálada, a sa pohádame a ja zas poviem niečo hnusné, škaredé, čo budem ľutovať a prosiť sa o ďalšiu šancu. Viem, že som taký — alebo skôr, že som taký bol. A pevne verím, že už taký nie som, lebo tie tri mesiace mi dali riadnu školu a lekciu do života.",
              "A to, ako sa cítim hrozne, už naozaj nechcem nikdy ani zďaleka čo najmenej cítiť. Ale chápem a verím tomu, že musíš si to nechať prejsť hlavou a že som tomu rozhodne nepomohol tým, ako som ťa otravoval a snažil sa ťa nútiť do niečoho, čo sa nedá robiť na tvoje srdce. A viem, že toto je skôr absurdné, ale naozaj — nič ti nedávam za vinu. A dokonca si ani veľa nevyčitaj, že ty si spravila veľa chýb — a myslím si, že si dostala málo, lebo ty si nespravila žiadnu chybu. A viac-menej, keď si to prirovnáme k mojim chybám, tak tie veci, čo si ty spravila, boli absolútne banality. A ja som spravil tie chyby a nechal teba bojovať za nás oboch.",
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
              "Iveta, chcel by som ti povedať — viem, že sa tomu dá vôbec ťažko veriť, ale naozaj by som ti to chcel povedať a dúfať, že tomu úprimne veríš — a to je to, že naozaj som ťa vždy ľúbil, úprimne. A viem, že aj keď to veľakrát tak nevyzeralo, ale vždy som sa snažil pre nás, aby sme raz mohli niečo mať. Ale uvedomujem si, že som do toho išiel bezhlavo a bez rozumu a bez nejakého plánu, čím som začal to, že som to všetko zničil. A nenechal som si nikdy poradiť a išiel som si tvrdohlavo za tým, čo nedávalo vôbec zmysel a ani hlavu ani pätu — len by som bol nešťastný, aj keby som to nevedel. A aby si zistila, keby si si myslela, že to bolo naopak.",
              "Lebo naozaj ťa budem mať navždy rád. Navždy ťa budem ľúbiť. Navždy mi bude na tebe záležať. A to aj keď už ťa možno nikdy nestretnem, alebo ťa nebudem počuť — tak budem ťa mať vždy za tú najlepšiu na svete a veriť tomu, že lepšia žena už ani nemôže byť. A je mi ľúto aj toho, že všetci sa o mňa len trápia a že som spôsobil veľké nešťastie a zlé pocity svojim rodičom zo mňa.",
              "A naozaj som nejakým spôsobom asi zrejme vadný, alebo je to len dané situáciou. Ale naozaj nikdy som nechcel nikomu úmyselne spôsobiť nejaké trápenie alebo starosti. Ale pritom keď sa pozriem okolo, tak len toto som zrejme vedel. A neviem sa z toho už dostať, lebo už som asi toľko toho spôsobil, aj keď veľa toho nevedome mi príde, alebo neviem, ako sa to mohlo všetko takto zrútiť. Ale jediné, čo viem, je, že chyba je vo mne a v nikom inom.",
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
              "Ani neviem čo presne k tomu dodať, keďže konverzácia v messengeri nasvedčuje tomu, že som zrejme čistý blázon — a to už len z toho hľadiska, že si píšem sám so sebou a v čistom zúfalstve a depresii jak čakám nejakú zázračnú odpoveď od osoby, ktorej som tak veľmi ublížil, že v tých stavoch a tých správach, ktoré tam píšem, mi zrejme ani nedokáže odpovedať. A zrejme už som podľahol tým najhorším stavom a pocitom. Neviem, komu by som mohol dôverovať, pritom viem, komu mám dôverovať. A mám paranoju z toho, že všetci mi chcú zle, pritom vnútorne tuším, že všetci mi chcú dobre. A úplne sa v tom strácam.",
              "Nahrávky, ktoré si myslím, že niečo dokazujú, dokazujú to, že som blázon. A zrejme som úplne hrozný človek, ktorý neznesie to, čo spôsobil, a nedokáže sa s tým zmieriť, že prišiel o tú najlepšiu možnosť v živote — a to je stretnúť tú najlepšiu ženu, ktorá vôbec môže byť pre chlapca. A to už len z toho hľadiska, že vždy si mi chcela dobre, vždy si bola úprimná ku mne a za nás, kde si sa snažila, aby sme boli šťastní. A to už len tým, že si sa vždy snažila hociktorou maličkosťou urobiť život krajším. Bola si úžasná, si úžasná a navždy budeš úžasná.",
              "A ľutujem, že som ti nasľuboval hory-doly, aký bude život so mnou úžasný, a ukážka bola skôr opak — prevažne to, čo som ti dal za slovo, že budem. Ďalšie strany od týchto tejto sú už len staré stránky, ktoré som tu nechal len v princípe toho, že verím, že to ukáže nejakú úprimnosť, ale pritom to asi ani nedáva hlavu ani pätu. Ale nechcem proste už prilepšovať ani robiť niečo z ničoho, čo nie je. To som zrejme skazil už aj prečítaním. Držím palce s gramatikou.",
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
              "A veľmi ľutujem to, koľko si odo mňa pýtala niečo, a že som to nedokázal spraviť. A veľmi — ale že veľmi — ma to mrzí, lebo ty si bola tá, čo mi dala nový dych tým, že mi kúpila kurz od Marka, ktorý stál celý film mesačný príjem, ktorý si dostávala na život. A veľmi si to vážim, aj keď som to možno nikdy nedal priamo najavo, ale bol to ten najlepší darček v mojom živote.",
              "A je mi hrozne z toho, že som ti nedokázal skôr dokončiť to, čo si chcela. Len toľkokrát som to načal a ani nedokázal to ťahať dopredu a nútiť ťa to dokončiť. A veľmi ľutujem, že som to dokončil už keď bolo neskoro a že už si stratila záujem v to. A beriem to ako hroznú lekciu toho môjho hrozného prístupu a toho, že som si ťa mal vážiť oveľa viacej a dávať to oveľa viacej najavo.",
              "A sľubujem ti, že hocikedy som pripravený ti s tým pomôcť a spustiť to do niekoľkých hodín do prevádzky. A budem ti s tým pomáhať do konca, jak len dlho budeš chcieť. Som ti vďačný za to všetko, čo si mi dala. Sú to neskutočne veľmi pekné pocity a spomienky. A mrzí ma, že som ti na narodeniny nič nedal, aj keď som veľmi chcel. Že som bol taký debil, debilný, a je mi to veľmi ľúto, že som to takto spravil ako nevďačný parchant. To naozaj veľmi ľúto.",
              "A viem, že to nič neznamená, že mi je ľúto toto. A chápem, že sa mi už asi zrejme nedá ani odpustiť a pozrieť sa na mňa. A potom naozaj — si tá najlepšia žena. Nikto nemôže mať väčšie šťastie ako ten, čo ťa má po boku.",
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
              "Iveta, nechal som tu proste aj veci, ktoré som písal o tom, ako som cítil, ktoré boli proste staršieho dátumu — teda čerstvo po tom, čo som to pokašľal. A budú to ďalšie od tejto strany. Naozaj chcem byť k tebe úprimný a myslím to úplne vážne. A chcem, aby si videla a vedela, že už nikdy ti nebudem nič zatĺkať alebo zľahčovať nejakú situáciu, ktorá je vážna alebo môže sa stať vážnou.",
              "Naozaj by som dal čokoľvek za tú možnosť, aby si videla, že už si ťa vážim a že už viem, čo to je prísť o niekoho dôležitého a byť tým vinný. Naozaj je mi ľúto, ako som to celé bral na ľahkú váhu a ako som ťa bral ako samozrejmosť, akoby si nič nebola. Naozaj mi je ľúto, že som nemyslel aj na tvoje pocity a že som nebol viac zodpovedný a nebral ťa viac a nevážil si ťa viacej. Pritom som si namýšľal, že som dokonalý a robím všetko pre teba a neviem čo všetko možné — a realita bola úplný opak toho. A veľmi to ľutujem.",
              "A veľmi mi chýbaš každý deň. Naozaj veľmi, veľmi, veľmi. Pri predstave, aký je dátum, keď som proste mal v hlave, že tento dátum — no, keď skončíš školu, že sa niekde vydáme spolu — a nakoniec sedím depresiák v aute v Kežmarku. Toto je realita toho, že som to pokazil len ja. Naozaj nikdy v živote by som ti neprial nič zlé a nechcel ti nijakým spôsobom ublížiť a už nikdy spôsobiť nejaké trápenie, čomu môžeš naozaj veriť, lebo to, ako mi je teraz tie tri mesiace, by som nikdy nikomu naozaj neprial nič podobné. A už nechcem vrátiť do týchto pocitov a stavov, ktoré som si sám zavinil tým, ako som si nevážil to, čo mám, a nepristupoval som k tomu zodpovedne.",
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
