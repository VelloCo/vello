import { ArrowUpRight, Heart, Link2, MessageCircle, Search, SlidersHorizontal } from 'lucide-react';
import { Container, Eyebrow, Reveal } from './Primitives';
import { properties } from '../data/properties';

export function Catalog() {
  return (
    <section id="produto" className="overflow-hidden bg-paper py-24 md:py-32">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.76fr_1.24fr] lg:items-center lg:gap-16">
          <Reveal>
            <Eyebrow>O produto</Eyebrow>
            <h2 className="balance mt-4 max-w-[510px] font-display text-[36px] font-semibold leading-[1.05] tracking-[-0.04em] text-ink md:text-[52px]">
              Do primeiro imóvel ao link que o cliente abre.
            </h2>
            <p className="mt-5 max-w-[440px] font-body text-[16px] leading-relaxed text-ash md:text-[17px]">
              A Vello reúne o essencial para o corretor cuidar da apresentação — sem planilha, conversa perdida ou catálogo genérico.
            </p>
            <div className="mt-9 border-t border-line">
              <ProductStep number="01" title="Cadastre com clareza" text="Fotos, detalhes e preço em um só lugar." />
              <ProductStep number="02" title="Deixe com a sua cara" text="Seu perfil e seu catálogo, sem perder o profissionalismo." />
              <ProductStep number="03" title="Compartilhe em segundos" text="Um link bonito para catálogo, imóvel ou seleção." />
            </div>
          </Reveal>
          <Reveal className="min-w-0">
            <div className="overflow-hidden rounded-[24px] border border-line/70 bg-white shadow-[0_35px_90px_-45px_rgba(11,11,10,0.28)]">
              <div className="flex items-center gap-2 border-b border-line/70 bg-cream/70 px-4 py-3">
                <div className="flex gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" /><span className="h-2.5 w-2.5 rounded-full bg-line" /></div>
                <div className="ml-3 flex-1 rounded-md bg-white px-3 py-1 font-mono text-[10px] text-stone">vello.com.br/carlos</div>
              </div>
              <div className="p-5 sm:p-7">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-ink font-display text-[17px] font-semibold text-paper">CM</div>
                    <div><p className="font-display text-[15px] font-semibold text-ink">Carlos Menezes</p><p className="font-mono text-[10px] text-stone">CRECI 34.812-F · Porto Alegre</p></div>
                  </div>
                  <a href="#" className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3.5 py-2 font-mono text-[10px] text-paper"><MessageCircle size={12} /> Falar no WhatsApp</a>
                </div>
                <div className="mt-5 flex items-center gap-2"><div className="flex flex-1 items-center gap-2 rounded-full border border-line px-3.5 py-2"><Search size={13} className="text-stone" /><span className="font-body text-[12px] text-stone">Buscar por bairro, tipo, preço...</span></div><div className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-line"><SlidersHorizontal size={13} className="text-ink" /></div></div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {properties.slice(0, 2).map((p) => <div key={p.id} className="overflow-hidden rounded-[14px] border border-line/70"><div className="relative h-[132px] bg-cover bg-center" style={{ backgroundImage: `url(${p.image})` }}><span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-white/90"><Heart size={12} className="text-ink" /></span></div><div className="p-3"><p className="font-display text-[12px] font-medium leading-tight text-ink">{p.title}</p><p className="mt-2 font-mono text-[13px] text-ink">{p.price}</p><p className="mt-1 font-mono text-[9px] text-ash">{p.bedrooms}q · {p.parking}v · {p.area}m²</p></div></div>)}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Reveal delay={0.08}><div className="flex min-h-[152px] flex-col justify-between rounded-[20px] bg-ink p-6 text-paper"><div><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-paper/50">Seleções</span><p className="mt-3 max-w-[330px] font-display text-[22px] font-semibold leading-tight">Mostre só o que combina com cada cliente.</p></div><div className="flex items-center justify-between font-mono text-[10px] text-paper/60"><span>Mariana · 3 imóveis</span><ArrowUpRight size={15} /></div></div></Reveal>
          <Reveal delay={0.16}><div className="flex min-h-[152px] flex-col justify-between rounded-[20px] border border-line bg-cream/45 p-6"><div><span className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone">Compartilhe</span><p className="mt-3 max-w-[330px] font-display text-[22px] font-semibold leading-tight text-ink">Um link pronto para deixar a conversa avançar.</p></div><div className="flex items-center gap-2 font-mono text-[10px] text-ash"><Link2 size={13} className="text-ink" /> vello.com.br/carlos</div></div></Reveal>
        </div>
      </Container>
    </section>
  );
}

function ProductStep({ number, title, text }: { number: string; title: string; text: string }) {
  return <div className="grid grid-cols-[38px_1fr] gap-3 border-b border-line py-4"><span className="pt-0.5 font-mono text-[10px] text-stone">{number}</span><div><p className="font-body text-[14px] font-semibold text-ink">{title}</p><p className="mt-1 font-body text-[13px] text-ash">{text}</p></div></div>;
}
