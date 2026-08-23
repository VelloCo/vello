import { Check, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Reveal, Eyebrow } from './Primitives';
import { properties } from '../data/properties';
import { PropertyCard } from './PropertyCard';

export function Selections() {
  return (
    <section id="recursos" className="py-24 md:py-32">
      <Container>
        <Reveal>
          <Eyebrow>Seleções personalizadas</Eyebrow>
          <h2 className="balance mt-4 max-w-[620px] font-display text-[32px] font-semibold leading-[1.12] tracking-[-0.015em] text-ink md:text-[44px]">
            Não mande todos os imóveis.
            <br />
            Mande os imóveis certos.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
          {/* Step 1: builder UI */}
          <Reveal delay={0.05}>
            <div className="rounded-[18px] border border-line/70 bg-white p-6 shadow-[0_30px_70px_-40px_rgba(11,11,10,0.3)]">
              <div className="flex items-center justify-between">
                <span className="font-display text-[15px] font-semibold text-ink">Nova seleção</span>
                <span className="font-mono text-[10px] text-stone">passo 1 de 1</span>
              </div>

              <div className="mt-5">
                <label className="font-mono text-[10.5px] uppercase tracking-wide text-stone">Cliente</label>
                <div className="mt-1.5 rounded-lg border border-line px-3 py-2.5 font-body text-[14px] text-ink">
                  Mariana Costa
                </div>
              </div>

              <div className="mt-5">
                <label className="font-mono text-[10.5px] uppercase tracking-wide text-stone">Imóveis</label>
                <div className="mt-2 space-y-2">
                  {properties.map((p) => (
                    <div key={p.id} className="flex items-center gap-2.5 rounded-lg border border-line/70 px-3 py-2">
                      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] bg-ink text-paper">
                        <Check size={11} />
                      </span>
                      <span className="truncate font-body text-[13px] text-ink">{p.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button className="mt-6 w-full rounded-full bg-ink py-3 font-body text-[14px] font-medium text-paper transition-transform hover:scale-[1.02]">
                Criar seleção
              </button>
            </div>
          </Reveal>

          {/* Arrow / transform */}
          <Reveal delay={0.15} className="flex flex-col items-center gap-3 lg:px-2">
            <motion.div
              className="hidden lg:flex h-10 w-10 items-center justify-center rounded-full border border-line bg-paper text-ash"
              initial={{ rotate: -6 }}
              whileInView={{ rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <ArrowRight size={16} />
            </motion.div>
            <div className="rounded-full border border-line bg-white px-4 py-2 font-mono text-[12px] text-ash shadow-sm">
              vello.com.br/carlos/mariana
            </div>
          </Reveal>

          {/* Step 2: client view */}
          <Reveal delay={0.25}>
            <div className="rounded-[18px] bg-ink p-6">
              <div className="rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3 font-body text-[13.5px] leading-snug text-paper">
                Mariana, separei 4 imóveis para você.
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {properties.map((p) => (
                  <PropertyCard key={p.id} property={p} compact />
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
