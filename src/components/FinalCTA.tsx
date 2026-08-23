import { ArrowRight } from 'lucide-react';
import { appPath } from '../lib/paths';
import { Container, Reveal } from './Primitives';

/**
 * MASCOTE: aguardando o arquivo oficial. Quando disponível, o mascote branco
 * deve aparecer grande, parcialmente cortado, atrás/ao lado da headline —
 * troque o placeholder abaixo por <img src="/vello-mascote-branco.png" />.
 */
export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-ink py-28 md:py-40">
      <div className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-white/[0.03] blur-3xl md:h-[560px] md:w-[560px]" />

      <Container className="relative flex flex-col items-center text-center">
        <Reveal>
          <h2 className="balance font-display text-[38px] font-semibold leading-[1.06] tracking-[-0.02em] text-paper sm:text-[52px] md:text-[64px]">
            Seus imóveis merecem
            <br />
            uma apresentação melhor.
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <a
            href={appPath('/cadastro')}
            className="group mt-10 inline-flex items-center gap-2.5 rounded-full bg-paper px-8 py-4 font-body text-[16px] font-medium text-ink transition-transform hover:scale-[1.03] active:scale-[0.98]"
          >
            Criar meu catálogo
            <ArrowRight size={17} className="transition-transform group-hover:translate-x-0.5" />
          </a>
          <p className="mt-5 font-mono text-[12px] text-paper/45">
            Seu primeiro catálogo pode estar pronto em poucos minutos.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
