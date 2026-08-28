import { ArrowDown, Check } from 'lucide-react';
import { Container, Eyebrow, Reveal } from './Primitives';
import { appPath } from '../lib/paths';

export function Problem() {
  return (
    <section id="antes-depois" className="overflow-hidden bg-ink py-24 text-paper md:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-16">
          <Reveal className="order-2 lg:order-1">
            <div className="overflow-hidden rounded-[24px] border border-white/10 bg-charcoal shadow-[0_40px_100px_-42px_rgba(0,0,0,0.9)]">
              <img src={appPath('/landing/property-real.png')} alt="Página pública de um imóvel na Vello com foto, preço e detalhes" className="block w-full" />
            </div>
          </Reveal>
          <Reveal className="order-1 lg:order-2">
            <Eyebrow>Apresentação que aproxima</Eyebrow>
            <h2 className="balance mt-4 max-w-[500px] font-display text-[38px] font-semibold leading-[1.03] tracking-[-0.045em] text-paper md:text-[56px]">Cada imóvel pode ter uma página à altura dele.</h2>
            <p className="mt-5 max-w-[440px] font-body text-[16px] leading-relaxed text-paper/60 md:text-[17px]">Uma experiência clara para o cliente e simples para você manter atualizada.</p>
            <div className="mt-9 space-y-4 border-t border-white/15 pt-5">
              <Feature text="Fotos em destaque, sem distrações" />
              <Feature text="Preço, localização e informações bem organizados" />
              <Feature text="Contato direto quando o interesse acontece" />
            </div>
            <div className="mt-9 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.12em] text-paper/45"><ArrowDown size={13} /> Role e conheça o imóvel</div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Feature({ text }: { text: string }) {
  return <p className="flex items-center gap-3 font-body text-[14px] text-paper/80"><span className="grid h-6 w-6 place-items-center rounded-full bg-white/10"><Check size={12} /></span>{text}</p>;
}
