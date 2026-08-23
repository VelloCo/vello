import { Check, Sparkles, Zap } from 'lucide-react';
import { Container, Reveal } from './Primitives';
import { RevealComparison } from './RevealComparison';

export function Problem() {
  return (
    <section id="antes-depois" className="bg-ink py-24 text-paper md:py-32">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal className="lg:col-span-5">
            <span className="inline-flex rounded-md bg-white/10 px-2.5 py-1 font-mono text-[10px] font-medium text-paper/90">Compare</span>
            <h2 className="mt-5 max-w-[430px] font-display text-[34px] font-semibold leading-[1.05] tracking-[-0.03em] text-paper md:text-[48px]">A diferença fica clara.</h2>
            <p className="mt-5 max-w-[450px] font-body text-[16px] leading-relaxed text-paper/65 md:text-[17px]">Arraste o comparador e veja como a Vello transforma uma apresentação improvisada em uma experiência profissional.</p>

            <div className="mt-7 grid gap-3">
              <Highlight icon={<Check size={18} />} title="Mais clareza" description="Seu cliente encontra os imóveis certos sem procurar em dezenas de mensagens." />
              <Highlight icon={<Sparkles size={18} />} title="Mais confiança" description="Uma apresentação organizada faz o seu trabalho parecer tão bom quanto ele é." />
              <Highlight icon={<Zap size={18} />} title="Mais velocidade" description="Um link pronto para compartilhar reduz o caminho entre interesse e visita." />
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-7">
            <RevealComparison
              beforeLabel="Antes"
              afterLabel="Depois"
              before={<div className="h-full min-w-[560px] bg-white" />}
              after={<div className="h-full min-w-[560px] bg-white" />}
            />
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-paper/40">Arraste o controle para comparar</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Highlight({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <div className="rounded-[10px] bg-white/[0.1] p-4"><div className="flex items-start gap-3"><span className="mt-0.5 text-paper/65">{icon}</span><div><p className="font-body text-[13px] font-semibold text-paper">{title}</p><p className="mt-1 font-body text-[12px] leading-relaxed text-paper/60">{description}</p></div></div></div>;
}
