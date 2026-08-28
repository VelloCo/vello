import { Check, ListChecks, MessageCircle, ShieldCheck, Timer } from 'lucide-react';
import { Container, Reveal } from './Primitives';
import { RevealComparison } from './RevealComparison';
import { properties } from '../data/properties';

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
              <Highlight icon={<ListChecks size={17} />} title="Mais clareza" description="Seu cliente encontra os imóveis certos sem procurar em dezenas de mensagens." />
              <Highlight icon={<ShieldCheck size={17} />} title="Mais confiança" description="Uma apresentação organizada faz o seu trabalho parecer tão bom quanto ele é." />
              <Highlight icon={<Timer size={17} />} title="Mais velocidade" description="Um link pronto para compartilhar reduz o caminho entre interesse e visita." />
            </div>
          </Reveal>

          <Reveal delay={0.12} className="lg:col-span-7">
            <RevealComparison
              beforeLabel="Antes"
              afterLabel="Depois"
              before={<BeforeState />}
              after={<AfterState />}
            />
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.12em] text-paper/40">Arraste o controle para comparar</p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function BeforeState() {
  return <div className="h-full min-w-[560px] bg-[#e9e5dc] p-8 text-ink"><div className="mx-auto max-w-[390px] rounded-[18px] bg-white p-4 shadow-[0_20px_45px_-25px_rgba(11,11,10,0.3)]"><div className="flex items-center gap-3 border-b border-line pb-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-ink font-mono text-[10px] text-paper">CM</span><div><p className="font-body text-[12px] font-semibold">Cliente interessado</p><p className="font-mono text-[9px] text-stone">online agora</p></div></div><p className="mt-4 ml-auto w-fit rounded-xl rounded-tr-sm bg-[#dcebd6] px-3 py-2 font-body text-[11px]">Tem opções na Bela Vista?</p><div className="mt-3 flex items-end gap-2"><div className="rounded-xl rounded-tl-sm bg-cream p-2"><img src={properties[1].image} alt="" className="h-20 w-24 rounded-md object-cover" /><p className="mt-2 font-body text-[10px] font-semibold">Apartamento Bela Vista</p><p className="mt-1 font-mono text-[9px] text-stone">R$ 645.000</p></div><span className="mb-2 font-mono text-[8px] text-stone">15:42</span></div><p className="mt-3 w-fit rounded-xl rounded-tl-sm bg-cream px-3 py-2 font-body text-[11px]">Também tenho essa outra, mas preciso confirmar o valor.</p><div className="mt-3 flex items-center gap-2 rounded-full border border-line px-3 py-2 text-stone"><MessageCircle size={12} /><span className="font-body text-[10px]">Digite uma mensagem</span></div></div></div>;
}

function AfterState() {
  return <div className="h-full min-w-[560px] bg-paper p-8 text-ink"><div className="mx-auto max-w-[430px]"><div className="flex items-center justify-between"><div><p className="font-display text-[18px] font-semibold">Carlos Menezes</p><p className="mt-1 font-mono text-[9px] text-stone">CRECI 34.812-F · Porto Alegre</p></div><span className="rounded-full bg-ink px-3 py-2 font-mono text-[9px] text-paper">Falar com Carlos</span></div><p className="mt-7 font-display text-[25px] font-semibold tracking-[-0.03em]">Imóveis para você conhecer.</p><div className="mt-4 grid grid-cols-2 gap-3">{properties.slice(0, 2).map((property) => <div key={property.id} className="overflow-hidden rounded-[12px] border border-line"><img src={property.image} alt="" className="h-[108px] w-full object-cover" /><div className="p-2.5"><p className="truncate font-body text-[10px] font-semibold">{property.title}</p><p className="mt-2 font-mono text-[10px]">{property.price}</p><p className="mt-1 flex items-center gap-1 font-mono text-[8px] text-stone"><Check size={9} /> disponível</p></div></div>)}</div></div></div>;
}

function Highlight({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return <div className="rounded-[10px] bg-white/[0.1] p-4"><div className="flex items-start gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/10 text-paper">{icon}</span><div><p className="font-body text-[13px] font-semibold text-paper">{title}</p><p className="mt-1 font-body text-[12px] leading-relaxed text-paper/60">{description}</p></div></div></div>;
}
