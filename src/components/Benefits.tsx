import { Link2, MessageCircle, Sparkles } from 'lucide-react';
import { Container, Eyebrow, Reveal } from './Primitives';

const BENEFITS = [
  { icon: Sparkles, title: 'Pareça tão profissional quanto você é', text: 'Seu catálogo organiza a apresentação e coloca sua marca no centro da experiência.' },
  { icon: MessageCircle, title: 'Converse com contexto', text: 'Envie uma seleção pronta em vez de mandar fotos soltas e repetir as mesmas informações.' },
  { icon: Link2, title: 'Um link para cada cliente', text: 'Compartilhe uma experiência simples, bonita e feita para avançar a conversa.' },
];

export function Benefits() {
  return (
    <section className="bg-cream/60 py-20 md:py-24">
      <Container>
        <Reveal>
          <Eyebrow>Por que a Vello</Eyebrow>
          <h2 className="balance mt-4 max-w-[620px] font-display text-[32px] font-semibold leading-[1.08] tracking-[-0.025em] text-ink md:text-[44px]">Menos trabalho para você. Mais clareza para o cliente.</h2>
        </Reveal>
        <div className="mt-10 grid gap-3 md:grid-cols-3">
          {BENEFITS.map(({ icon: Icon, title, text }, index) => (
            <Reveal key={title} delay={index * 0.08}>
              <div className="h-full rounded-[18px] border border-line/70 bg-paper p-5 md:p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-paper"><Icon size={18} strokeWidth={1.6} /></div>
                <h3 className="mt-6 font-display text-[19px] font-semibold leading-tight text-ink">{title}</h3>
                <p className="mt-3 font-body text-[14px] leading-relaxed text-ash">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
