import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AmbientRoom } from "@/components/AmbientRoom";
import { BookCover } from "@/components/BookCover";
import { Book } from "@/components/Book";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Ospravlnienie — list, ktorý prišiel neskoro" },
      {
        name: "description",
        content:
          "Tichá interaktívna kniha o ospravedlnení. Otvorte ju a listujte piatimi kapitolami.",
      },
      { property: "og:title", content: "Ospravlnienie" },
      {
        property: "og:description",
        content: "Interaktívna kniha — otvorte ju a listujte.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [opened, setOpened] = useState(false);

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center px-4 py-10">
      <AmbientRoom />

      <AnimatePresence mode="wait">
        {!opened ? (
          <motion.div
            key="cover"
            exit={{ opacity: 0, scale: 0.85, y: -40, filter: "blur(10px)" }}
            transition={{ duration: 0.9, ease: [0.4, 0, 0.2, 1] }}
            className="w-full"
          >
            <BookCover onOpen={() => setOpened(true)} />
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.4, duration: 0.8 }}
              className="mt-8 text-center font-display text-xs uppercase tracking-[0.4em] text-foreground/55"
            >
              kliknite na knihu — otvorí sa
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            key="book"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <Book onClose={() => setOpened(false)} />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
