import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { appPath } from '../lib/paths';

export function Hero() {
  return (
    <section
      id="top"
      className="relative w-full overflow-hidden bg-paper pb-44 pt-[166px] text-sm md:pt-[190px]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(250,249,246,0.35)_0%,rgba(250,249,246,0.82)_58%,#faf9f6_100%)]" />

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex max-w-[850px] flex-col items-center px-5 text-center"
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-paper/80 px-4 py-2 font-mono text-[10px] uppercase tracking-[0.1em] text-ash backdrop-blur-sm">
          <Sparkles size={13} strokeWidth={1.7} />
          A nova forma de apresentar imóveis
          <ArrowRight size={15} strokeWidth={1.8} />
        </div>

        <h1 className="balance mx-auto mt-8 max-w-[850px] font-display text-4xl font-semibold leading-[1.04] tracking-[-0.045em] text-ink md:text-7xl">
          Apresente seus imóveis.
          <br />
          <span className="text-ash">Venda com mais facilidade.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl px-2 font-body text-[15px] leading-relaxed text-ash md:text-base">
          Crie um catálogo digital bonito, organizado e fácil de compartilhar.
          A Vello cuida da apresentação para você focar no próximo negócio.
        </p>

        <div className="mx-auto mt-5 flex w-full items-center justify-center gap-3">
          <a
            href={appPath('/cadastro')}
            className="rounded-full bg-ink px-6 py-3 font-body text-[14px] font-medium text-paper transition hover:bg-charcoal"
          >
            Criar meu catálogo
          </a>
          <button
            onClick={() => document.querySelector('#como-funciona')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex items-center gap-2 rounded-full border border-line bg-paper/60 px-6 py-3 font-body text-[14px] font-medium text-ink transition hover:bg-paper"
          >
            <span>Ver como funciona</span>
            <ArrowRight size={15} strokeWidth={1.8} />
          </button>
        </div>
      </motion.div>
    </section>
  );
}
