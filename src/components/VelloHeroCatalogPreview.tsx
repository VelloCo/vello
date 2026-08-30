import { Heart, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { appPath } from "../lib/paths";

const filters = ["Todos", "Comprar", "Alugar", "Tipo", "Quartos"];

export function VelloHeroCatalogPreview() {
  return <div className="min-w-[900px] overflow-hidden bg-[#faf9f6] font-sans text-[#0b0b0a] antialiased">
    <div className="flex h-[74px] items-center justify-between bg-[#0b0b0a] px-10 text-[#faf9f6]">
      <div className="flex items-center gap-3 text-[20px] font-semibold tracking-[-.05em]"><span className="grid h-8 w-8 place-items-center rounded-full bg-[#faf9f6] text-[10px] text-[#0b0b0a]">V</span>Vello</div>
      <div className="flex items-center gap-3 text-sm font-medium"><span className="rounded-full border border-white/30 px-5 py-3">Compartilhar</span><span className="rounded-full bg-[#faf9f6] px-5 py-3 text-[#0b0b0a]">Ver catálogo</span></div>
    </div>
    <div className="px-9 py-8">
      <section className="flex items-center justify-between rounded-[26px] bg-white px-7 py-5 shadow-[0_18px_38px_rgba(11,11,10,.07)]">
        <div className="flex items-center gap-4"><span className="grid h-14 w-14 place-items-center rounded-full bg-[#0b0b0a] text-base text-white">V</span><div><b className="block text-[18px] tracking-[-.04em]">Vello</b><span className="mt-1 block text-sm text-[#5c5a54]">Catálogo digital para imóveis</span><span className="mt-1 flex items-center gap-1 text-xs text-[#8b8880]"><MapPin size={12} /> Porto Alegre, RS</span></div></div>
        <span className="rounded-full bg-[#0b0b0a] px-5 py-3 text-sm font-semibold text-white">Conhecer Vello</span>
      </section>
      <div className="mt-12 grid grid-cols-[minmax(0,1fr)_300px] gap-12">
        <main>
          <p className="font-mono text-[11px] uppercase tracking-[.2em] text-[#8b8880]">Catálogo de imóveis</p>
          <h3 className="mt-3 text-[46px] font-semibold leading-none tracking-[-.07em]">Todos os imóveis</h3>
          <p className="mt-4 text-[18px] text-[#5c5a54]">Explore todas as opções disponíveis.</p>
          <div className="mt-8 border-y border-[#dedbd3] py-5">
            <div className="flex h-12 items-center gap-3 rounded-full border border-[#dedbd3] bg-white px-5 text-sm text-[#8b8880]"><Search size={18} /> Onde você quer morar?</div>
            <div className="mt-4 flex items-center gap-3">{filters.map((filter, index) => <span key={filter} className={`rounded-full border px-4 py-2 text-sm ${index === 0 ? "border-[#0b0b0a] bg-[#0b0b0a] text-white" : "border-[#dedbd3] text-[#5c5a54]"}`}>{filter}</span>)}<span className="ml-auto flex items-center gap-2 rounded-full border border-[#dedbd3] px-4 py-2 text-sm"><SlidersHorizontal size={15} /> Filtros</span></div>
          </div>
          <article className="mt-7 overflow-hidden rounded-[18px] border border-[#dedbd3] bg-white"><div className="relative h-[210px] overflow-hidden"><img src={appPath("/landing/property-real.png")} alt="Imóvel em destaque" className="h-full w-full object-cover" /><span className="absolute left-4 top-4 rounded-full bg-[#0b0b0a] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[.15em] text-white">Venda</span><Heart className="absolute right-4 top-4 rounded-full bg-white p-2" size={38} /></div><div className="flex items-end justify-between p-5"><div><h4 className="text-[21px] font-semibold tracking-[-.045em]">Casa contemporânea no Moinhos</h4><p className="mt-2 text-sm text-[#5c5a54]">Moinhos de Vento · Porto Alegre</p></div><b className="text-[18px]">R$ 1.890.000</b></div></article>
        </main>
        <aside className="border-l border-[#dedbd3] pl-8"><p className="font-mono text-[11px] uppercase tracking-[.18em] text-[#8b8880]">Destaques</p><div className="mt-5 space-y-4">{["3 quartos", "2 vagas", "124 m²", "Porto Alegre"].map((item, index) => <div key={item} className="rounded-2xl border border-[#dedbd3] bg-white p-4"><span className="text-xs text-[#8b8880]">0{index + 1}</span><b className="mt-3 block text-[17px] tracking-[-.04em]">{item}</b></div>)}</div></aside>
      </div>
    </div>
  </div>;
}
