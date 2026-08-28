import { motion } from "framer-motion";
import { appPath } from "../lib/paths";
import { Logo } from "./Logo";

export function LoadingScreen({ label = "Preparando seu espaço" }: { label?: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-6">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex w-full max-w-sm flex-col items-center text-center"
        aria-live="polite"
      >
        <Logo className="origin-center scale-[.8]" />
        <motion.img
          src={appPath("/vello-loading-mascot.png")}
          alt="Mascote da Vello preparando seu espaço"
          className="mt-9 h-48 w-48 object-contain sm:h-56 sm:w-56"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2.2, ease: "easeInOut", repeat: Infinity }}
        />
        <p className="mt-7 font-body text-[15px] text-ash">{label}</p>
        <div className="mt-4 flex items-center gap-1.5" aria-label="Carregando">
          <i className="h-1.5 w-1.5 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-ink" />
          <i className="h-1.5 w-1.5 animate-[pulse_1s_ease-in-out_.15s_infinite] rounded-full bg-ink/55" />
          <i className="h-1.5 w-1.5 animate-[pulse_1s_ease-in-out_.3s_infinite] rounded-full bg-ink/25" />
        </div>
      </motion.section>
    </main>
  );
}
