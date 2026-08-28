import { motion } from "framer-motion";
import { Logo } from "./Logo";

export function LoadingScreen({ label = "Preparando seu espaço" }: { label?: string }) {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-paper px-6 py-8">
      <div className="pointer-events-none absolute -right-32 top-0 h-[45vh] w-[45vh] rounded-full bg-cream/70 blur-3xl" />
      <div className="relative mx-auto flex w-full max-w-[680px] flex-col">
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <Logo className="origin-top-left scale-[.78]" />
        </motion.div>
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.08 }} className="my-auto max-w-md pb-16" aria-live="polite">
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Vello está preparando tudo</p>
          <h1 className="mt-5 font-display text-4xl font-semibold leading-[.98] tracking-[-.045em] text-ink sm:text-5xl">Um momento.<br />Seu espaço está quase pronto.</h1>
          <p className="mt-5 font-body text-[15px] leading-relaxed text-ash">{label}</p>
          <div className="mt-10 h-2 overflow-hidden rounded-full bg-mist" aria-label="Carregando">
            <motion.span className="block h-full w-[42%] rounded-full bg-ink" animate={{ x: ["-105%", "245%"] }} transition={{ duration: 1.35, ease: "easeInOut", repeat: Infinity }} />
          </div>
          <p className="mt-4 font-mono text-[10px] uppercase tracking-[.14em] text-stone">Organizando sua experiência</p>
        </motion.section>
        <div className="flex items-center gap-3 pb-2 font-mono text-[10px] uppercase tracking-[.14em] text-stone"><span className="h-px w-9 bg-line" /> Vello</div>
      </div>
    </main>
  );
}
