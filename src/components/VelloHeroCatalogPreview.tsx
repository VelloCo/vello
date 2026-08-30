import { Heart, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { appPath } from "../lib/paths";

const filters = ["Todos", "Comprar", "Alugar", "Casas", "Apartamentos", "Porto Alegre"];
const properties = [
  ["Casa contemporânea no Moinhos", "Moinhos de Vento", "R$ 1.890.000"],
  ["Apartamento alto com vista", "Petrópolis", "R$ 840.000"],
  ["Cobertura pronta para morar", "Bela Vista", "R$ 2.350.000"],
];

export function VelloHeroCatalogPreview() {
  return <div className="min-w-[1180px] overflow-hidden bg-[#faf9f6] font-sans text-[#0b0b0a] antialiased">
    <div className="flex h-[76px] items-center justify-between bg-[#0b0b0a] px-12 text-[#faf9f6]">
      <div className="flex items-center gap-3 text-[20px] font-semibold"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#faf9f6] text-[10px] text-[#0b0b0a]">V</span>Vello</div>
      <div className="flex items-center gap-7 text-sm text-[#faf9f6]/70"><span>Catálogo</span><span>Imóveis</span><span>Seleções</span><span>Contato</span></div>
      <div className="flex items-center gap-3 text-sm font-medium"><span className="rounded-full border border-white/30 px-5 py-3">Compartilhar</span><span className="rounded-full bg-[#faf9f6] px-5 py-3 text-[#0b0b0a]">Ver catálogo</span></div>
    </div>
    <div className="px-12 py-9">
      <section className="grid grid-cols-[1fr_auto] items-center gap-10 rounded-[28px] bg-white px-8 py-6 shadow-[0_18px_42px_rgba(11,11,10,.07)]">
        <div className="flex items-center gap-5"><span className="grid h-16 w-16 place-items-center rounded-full bg-[#0b0b0a] text-lg text-white">V</span><div><b className="block text-[22px]">Vello</b><span className="mt-1 block text-base text-[#5c5a54]">Catálogo digital para imóveis selecionados</span><span className="mt-1 flex items-center gap-1 text-sm text-[#8b8880]"><MapPin size={14} /> Porto Alegre, RS</span></div></div>
        <span className="rounded-full bg-[#0b0b0a] px-6 py-4 text-sm font-semibold text-white">Conhecer Vello</span>
      </section>
      <div className="mt-12 grid grid-cols-[minmax(0,1fr)_260px] gap-10">
        <main>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#8b8880]">Catálogo de imóveis</p>
          <div className="mt-3 flex items-end justify-between gap-10">
            <div><h3 className="text-[56px] font-semibold leading-none">Todos os imóveis</h3><p className="mt-4 text-[18px] text-[#5c5a54]">Explore todas as opções disponíveis no catálogo.</p></div>
            <div className="w-[330px]"><div className="flex h-12 items-center gap-3 rounded-full border border-[#dedbd3] bg-white px-5 text-sm text-[#8b8880]"><Search size={18} /> Onde você quer morar?</div></div>
          </div>
          <div className="mt-7 flex items-center gap-3 border-y border-[#dedbd3] py-5">{filters.map((filter, index) => <span key={filter} className={`rounded-full border px-4 py-2 text-sm ${index === 0 ? "border-[#0b0b0a] bg-[#0b0b0a] text-white" : "border-[#dedbd3] bg-white text-[#5c5a54]"}`}>{filter}</span>)}<span className="ml-auto flex items-center gap-2 rounded-full border border-[#dedbd3] bg-white px-4 py-2 text-sm"><SlidersHorizontal size={15} /> Filtros</span></div>
          <div className="mt-7 grid grid-cols-3 gap-5">
            {properties.map(([title, place, price]) => <article key={title} className="overflow-hidden rounded-[18px] border border-[#dedbd3] bg-white"><div className="relative h-[145px] overflow-hidden"><img src={appPath("/landing/property-real.png")} alt="Imóvel em destaque" className="h-full w-full object-cover" /><span className="absolute left-4 top-4 rounded-full bg-[#0b0b0a] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-white">Venda</span><Heart className="absolute right-4 top-4 rounded-full bg-white p-2" size={36} /></div><div className="p-5"><h4 className="text-[18px] font-semibold leading-tight">{title}</h4><p className="mt-2 text-sm text-[#5c5a54]">{place} · Porto Alegre</p><b className="mt-4 block text-[17px]">{price}</b></div></article>)}
          </div>
        </main>
        <aside className="border-l border-[#dedbd3] pl-8"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#8b8880]">Destaques</p><div className="mt-5 space-y-4">{["3 quartos", "2 vagas", "124 m²", "Pronto para visita"].map((item, index) => <div key={item} className="rounded-2xl border border-[#dedbd3] bg-white p-4"><span className="text-xs text-[#8b8880]">0{index + 1}</span><b className="mt-3 block text-[17px]">{item}</b></div>)}</div></aside>
      </div>
    </div>
  </div>;
}
