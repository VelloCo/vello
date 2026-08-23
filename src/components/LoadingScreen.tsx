import { motion } from 'framer-motion';
import { Logo } from './Logo';

export function LoadingScreen({ label = 'Preparando seu espaço' }: { label?: string }) {
  return <main className="relative grid min-h-screen place-items-center overflow-hidden bg-paper px-6"><div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-cream/70 to-transparent" /><motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }} className="relative flex flex-col items-center text-center"><Logo /><div className="mt-10 flex items-end gap-1.5" aria-label="Carregando"><i className="h-2 w-2 animate-[pulse_1s_ease-in-out_infinite] rounded-full bg-ink" /><i className="h-2 w-2 animate-[pulse_1s_ease-in-out_.15s_infinite] rounded-full bg-ink/60" /><i className="h-2 w-2 animate-[pulse_1s_ease-in-out_.3s_infinite] rounded-full bg-ink/30" /></div><p className="mt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">{label}</p></motion.div></main>;
}
