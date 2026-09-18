import { Heart, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { appPath } from "../lib/paths";

const filters = ["Todos", "Comprar", "Alugar", "Casas", "Apartamentos", "Porto Alegre"];
const properties = [
  ["Casa contemporânea no Moinhos", "Moinhos de Vento", "R$ 1.890.000", "/landing/property-photo-1.png"],
  ["Apartamento alto com vista", "Petrópolis", "R$ 840.000", "/landing/property-photo-2.png"],
  ["Cobertura pronta para morar", "Bela Vista", "R$ 2.350.000", "/landing/property-photo-3.png"],
];

export function VelloHeroCatalogPreview() {
  return <div className="min-w-[1180px] overflow-hidden bg-[#F7FAFD] font-sans text-[#12283A] antialiased">
    <div className="flex h-[76px] items-center justify-between bg-[#12283A] px-12 text-[#F7FAFD]">
      <div className="flex items-center gap-3 text-[20px] font-semibold"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#F7FAFD] text-[10px] text-[#12283A]">V</span>Vello</div>
      <div className="flex items-center gap-7 text-sm text-[#F7FAFD]/70"><span>Catálogo</span><span>Imóveis</span><span>Seleções</span><span>Contato</span></div>
      <div className="flex items-center gap-3 text-sm font-medium"><span className="rounded-full border border-white/30 px-5 py-3">Compartilhar</span><span className="rounded-full bg-[#F7FAFD] px-5 py-3 text-[#12283A]">Ver catálogo</span></div>
    </div>
    <div className="px-12 py-9">
      <section className="grid grid-cols-[1fr_auto] items-center gap-10 rounded-[28px] bg-white px-8 py-6 shadow-[0_18px_42px_rgba(18,40,58,.07)]">
        <div className="flex items-center gap-5"><span className="grid h-16 w-16 place-items-center rounded-full bg-[#12283A] text-lg text-white">V</span><div><b className="block text-[22px]">Vello</b><span className="mt-1 block text-base text-[#4A5D6C]">Catálogo digital para imóveis selecionados</span><span className="mt-1 flex items-center gap-1 text-sm text-[#6B7E8D]"><MapPin size={14} /> Porto Alegre, RS</span></div></div>
        <span className="rounded-full bg-[#12283A] px-6 py-4 text-sm font-semibold text-white">Conhecer Vello</span>
      </section>
      <div className="mt-12">
        <main>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#6B7E8D]">Catálogo de imóveis</p>
          <div className="mt-3 flex items-end justify-between gap-10">
            <div><h3 className="text-[56px] font-semibold leading-none">Todos os imóveis</h3><p className="mt-4 text-[18px] text-[#4A5D6C]">Explore todas as opções disponíveis no catálogo.</p></div>
            <div className="w-[330px]"><div className="flex h-12 items-center gap-3 rounded-full border border-[#D6E3ED] bg-white px-5 text-sm text-[#6B7E8D]"><Search size={18} /> Onde você quer morar?</div></div>
          </div>
          <div className="mt-7 flex items-center gap-3 border-y border-[#D6E3ED] py-5">{filters.map((filter, index) => <span key={filter} className={`rounded-full border px-4 py-2 text-sm ${index === 0 ? "border-[#12283A] bg-[#12283A] text-white" : "border-[#D6E3ED] bg-white text-[#4A5D6C]"}`}>{filter}</span>)}<span className="ml-auto flex items-center gap-2 rounded-full border border-[#D6E3ED] bg-white px-4 py-2 text-sm"><SlidersHorizontal size={15} /> Filtros</span></div>
          <div className="mt-7 grid grid-cols-3 gap-5">
            {properties.map(([title, place, price, photo]) => <article key={title} className="overflow-hidden rounded-[18px] border border-[#D6E3ED] bg-white"><div className="relative h-[145px] overflow-hidden"><img src={appPath(photo)} alt="Imóvel em destaque" className="h-full w-full object-cover" /><span className="absolute left-4 top-4 rounded-full bg-[#12283A] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-white">Venda</span><Heart className="absolute right-4 top-4 rounded-full bg-white p-2" size={36} /></div><div className="p-5"><h4 className="text-[18px] font-semibold leading-tight">{title}</h4><p className="mt-2 text-sm text-[#4A5D6C]">{place} · Porto Alegre</p><b className="mt-4 block text-[17px]">{price}</b></div></article>)}
          </div>
        </main>
      </div>
    </div>
  </div>;
}
