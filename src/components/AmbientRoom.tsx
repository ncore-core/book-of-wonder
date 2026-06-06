import { motion } from "framer-motion";

/** Atmosférické pozadie miestnosti — plávajúce svetelné častice. */
export function AmbientRoom() {
  const motes = Array.from({ length: 22 });
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Teplé svetlo lampy */}
      <motion.div
        className="absolute -top-40 left-1/2 h-[80vh] w-[80vh] -translate-x-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.92 0.09 80 / 0.45), transparent 60%)",
          filter: "blur(40px)",
        }}
        animate={{ opacity: [0.55, 0.8, 0.55] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-20%] right-[-10%] h-[60vh] w-[60vh] rounded-full"
        style={{
          background:
            "radial-gradient(circle, oklch(0.55 0.08 40 / 0.35), transparent 65%)",
          filter: "blur(60px)",
        }}
        animate={{ opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      {motes.map((_, i) => (
        <span
          key={i}
          className="animate-ambient absolute block rounded-full bg-gold/40"
          style={{
            top: `${(i * 53) % 100}%`,
            left: `${(i * 37) % 100}%`,
            width: 3 + ((i * 7) % 6),
            height: 3 + ((i * 7) % 6),
            background:
              "radial-gradient(circle, oklch(0.92 0.13 85 / 0.85), transparent 70%)",
            animationDelay: `${(i % 9) * 0.7}s`,
            animationDuration: `${7 + (i % 5)}s`,
          }}
        />
      ))}
    </div>
  );
}
