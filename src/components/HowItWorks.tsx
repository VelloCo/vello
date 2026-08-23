import { Upload, LayoutGrid, Send } from 'lucide-react';
import { motion } from 'framer-motion';
import { Container, Reveal, Eyebrow } from './Primitives';

const STEPS = [
  {
    n: '01',
    title: 'Cadastre',
    text: 'Adicione fotos e as principais informações do imóvel.',
    icon: Upload,
  },
  {
    n: '02',
    title: 'Organize',
    text: 'A Vello transforma tudo em um catálogo bonito e fácil de navegar.',
    icon: LayoutGrid,
  },
  {
    n: '03',
    title: 'Compartilhe',
    text: 'Envie um único link pelo WhatsApp.',
    icon: Send,
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 md:py-32">
      <Container>
        <Reveal>
          <Eyebrow>Como funciona</Eyebrow>
          <h2 className="balance mt-4 max-w-[560px] font-display text-[32px] font-semibold leading-[1.12] tracking-[-0.015em] text-ink md:text-[42px]">
            Do imóvel ao cliente em poucos minutos.
          </h2>
        </Reveal>

        <div className="relative mt-16 grid gap-10 md:grid-cols-3 md:gap-6">
          {/* connecting line */}
          <div className="pointer-events-none absolute left-0 right-0 top-[26px] hidden h-px bg-line md:block">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformOrigin: 'left' }}
              className="h-px w-full bg-ink"
            />
          </div>

          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.12}>
              <div className="relative">
                <div className="flex items-center gap-3">
                  <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full border border-ink bg-paper font-mono text-[13px] text-ink">
                    {s.n}
                  </span>
                  <s.icon size={20} strokeWidth={1.5} className="text-ash md:hidden" />
                </div>
                <h3 className="mt-5 font-display text-[21px] font-semibold text-ink">{s.title}</h3>
                <p className="mt-2 max-w-[260px] font-body text-[15px] leading-relaxed text-ash">
                  {s.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
