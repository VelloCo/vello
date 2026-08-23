import { X, Check } from 'lucide-react';
import { Container, Reveal, Eyebrow } from './Primitives';

const WITHOUT = [
  'Fotos soltas',
  'Informações espalhadas',
  'Links diferentes',
  'Dificuldade para comparar',
  'Apresentação genérica',
];

const WITH = [
  'Um único link',
  'Catálogo organizado',
  'Seleções personalizadas',
  'Contato imediato',
  'Experiência profissional',
];

export function Comparison() {
  return (
    <section className="py-24 md:py-32 bg-cream/60">
      <Container>
        <Reveal>
          <Eyebrow>O antes e o depois</Eyebrow>
          <h2 className="balance mt-4 max-w-[500px] font-display text-[32px] font-semibold leading-[1.12] tracking-[-0.015em] text-ink md:text-[40px]">
            A mesma apresentação, dois resultados diferentes.
          </h2>
        </Reveal>

        <div className="mt-14 overflow-hidden rounded-[20px] border border-line/70">
          <div className="grid md:grid-cols-2">
            <Reveal delay={0} className="h-full">
              <div className="h-full bg-white p-8 md:p-10">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-stone">Sem Vello</span>
                <ul className="mt-5 space-y-3.5">
                  {WITHOUT.map((item) => (
                    <li key={item} className="flex items-center gap-3 font-body text-[15px] text-ash">
                      <X size={15} className="shrink-0 text-stone" strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.1} className="h-full">
              <div className="h-full bg-ink p-8 md:p-10">
                <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-paper/50">Com Vello</span>
                <ul className="mt-5 space-y-3.5">
                  {WITH.map((item) => (
                    <li key={item} className="flex items-center gap-3 font-body text-[15px] text-paper">
                      <Check size={15} className="shrink-0 text-paper" strokeWidth={2} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
