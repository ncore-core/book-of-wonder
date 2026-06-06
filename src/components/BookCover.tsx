import { motion } from "framer-motion";

interface Props {
  onOpen: () => void;
}

/** Veľká kniha pred otvorením — animované privítanie + tlačidlo otvorenia. */
export function BookCover({ onOpen }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.85, rotateX: 35 }}
      animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
      transition={{ duration: 1.4, ease: [0.2, 0.8, 0.2, 1] }}
      style={{ perspective: 1800 }}
      className="relative mx-auto flex h-[78vh] max-h-[640px] w-[88vw] max-w-[460px] items-center justify-center"
    >
      <motion.div
        whileHover={{ rotateY: -8, rotateX: 2, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
        className="bg-leather relative h-full w-full rounded-[6px] book-shadow"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Chrbát */}
        <div className="spine-decor absolute left-0 top-0 h-full w-5 rounded-l-[6px] bg-gradient-to-b from-black/30 via-transparent to-black/30" />

        {/* Zlaté ohraničenie */}
        <div className="absolute inset-4 rounded-[3px] border border-gold/50" />
        <div className="absolute inset-6 rounded-[2px] border border-gold/25" />

        {/* Obsah obálky */}
        <div className="relative z-10 flex h-full flex-col items-center justify-between px-6 py-12 text-center">
          <p className="font-display text-sm uppercase tracking-[0.5em] text-gold/85">
            Kniha
          </p>

          <div className="space-y-4">
            <h1 className="font-display text-5xl font-semibold leading-tight text-gold sm:text-6xl" style={{ textShadow: "0 2px 12px oklch(0 0 0 / 0.6)" }}>
              Ospravlnienie
            </h1>
            <div className="mx-auto h-px w-24 bg-gold/60" />
            <p className="font-serif text-base italic text-gold/70 sm:text-lg">
              tichý list, ktorý nikdy<br />nedostal odpoveď
            </p>
          </div>

          <motion.button
            onClick={onOpen}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="group relative rounded-full border border-gold/60 bg-black/20 px-8 py-3 font-serif text-sm uppercase tracking-[0.3em] text-gold/90 backdrop-blur-sm transition hover:border-gold hover:text-gold"
          >
            <span className="relative z-10">Otvoriť knihu</span>
            <span className="absolute inset-0 animate-glow rounded-full bg-gold/15" />
          </motion.button>
        </div>

        {/* Lesk */}
        <div
          className="pointer-events-none absolute inset-0 rounded-[6px] opacity-50"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, oklch(0.95 0.05 85 / 0.18) 50%, transparent 60%)",
          }}
        />
      </motion.div>
    </motion.div>
  );
}
