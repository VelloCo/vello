import { motion } from "framer-motion";
import { Logo } from "./Logo";

export function LoadingScreen({ label = "Preparando seu espaço" }: { label?: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F7FAFC] px-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
        className="flex w-full max-w-sm flex-col items-center text-center"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="relative grid h-28 w-28 place-items-center">
          <motion.span
            className="absolute inset-0 rounded-full border border-[#7EAFD0]/25"
            animate={{ scale: [0.92, 1.08, 0.92], opacity: [0.45, 1, 0.45] }}
            transition={{ duration: 1.9, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.span
            className="absolute inset-3 rounded-full border border-[#7EAFD0]/35"
            animate={{ scale: [1.04, 0.94, 1.04], opacity: [0.8, 0.38, 0.8] }}
            transition={{ duration: 1.9, ease: "easeInOut", repeat: Infinity }}
          />
          <div className="relative grid h-20 w-20 place-items-center rounded-full border border-white bg-white shadow-[0_18px_55px_rgba(18,40,58,.10)]">
            <Logo className="scale-[.78] [&_span]:sr-only" />
          </div>
        </div>

        <p className="mt-8 font-display text-2xl font-semibold tracking-[-.035em] text-ink">
          {label}
        </p>
        <p className="mt-2 max-w-[260px] font-body text-sm leading-relaxed text-ash">
          Só um instante enquanto a Vello organiza seus dados.
        </p>
        <div className="mt-6 flex items-center gap-2" aria-label="Carregando">
          <motion.i
            className="h-1.5 w-1.5 rounded-full bg-ink"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
          />
          <motion.i
            className="h-1.5 w-1.5 rounded-full bg-[#7EAFD0]"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, delay: 0.16 }}
          />
          <motion.i
            className="h-1.5 w-1.5 rounded-full bg-ink/35"
            animate={{ opacity: [0.25, 1, 0.25] }}
            transition={{ duration: 1, ease: "easeInOut", repeat: Infinity, delay: 0.32 }}
          />
        </div>
      </motion.section>
    </main>
  );
}
