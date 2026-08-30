import { ArrowLeft, MessageCircle, Search, SlidersHorizontal } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { properties } from '../data/properties';
import { useState, type ReactNode } from 'react';

export function PhoneMockup({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return (
    <div
      className={`relative w-[280px] rounded-[36px] border-[6px] border-ink bg-ink shadow-[0_50px_100px_-30px_rgba(11,11,10,0.55)] ${className}`}
    >
      <div className="absolute left-1/2 top-0 z-10 h-[22px] w-[110px] -translate-x-1/2 rounded-b-[14px] bg-ink" />
      <div className="overflow-hidden rounded-[30px] bg-paper">
        {children ?? <CatalogScreen />}
      </div>
    </div>
  );
}

export function CatalogScreen({ initialSelectedId = null }: { initialSelectedId?: string | null } = {}) {
  const [selectedId, setSelectedId] = useState<string | null>(initialSelectedId);
  const selected = properties.find((property) => property.id === selectedId);

  return <div className="h-[560px] overflow-hidden bg-paper">
    <AnimatePresence mode="wait" initial={false}>
      {selected ? <PropertyDetail key="detail" property={selected} onBack={() => setSelectedId(null)} /> : <CatalogList key="catalog" onOpen={setSelectedId} />}
    </AnimatePresence>
  </div>;
}

type CatalogProperty = (typeof properties)[number];

function CatalogList({ onOpen }: { onOpen: (id: string) => void }) {
  return <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }} className="h-full overflow-hidden bg-paper">
    <div className="bg-cream px-3 pb-4 pt-8">
      <div className="flex items-center gap-2.5 rounded-[18px] bg-white p-2.5 shadow-[0_12px_24px_-20px_rgba(11,11,10,0.55)] ring-1 ring-line/80">
        <div className="h-10 w-10 shrink-0 rounded-full bg-mist bg-[url('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80')] bg-cover bg-center ring-1 ring-line" />
        <div className="min-w-0 flex-1"><p className="font-display text-[13px] font-semibold leading-tight text-ink">Carlos Menezes</p><p className="mt-0.5 font-mono text-[8.5px] leading-tight text-stone">CRECI 34.812-F · Porto Alegre, RS</p></div>
        <span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper"><MessageCircle size={12} /></span>
      </div>
      <div className="mt-3.5 flex items-center gap-2"><div className="flex flex-1 items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2"><Search size={12} className="shrink-0 text-stone" /><span className="font-body text-[10.5px] text-stone">Buscar imóvel</span></div><div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-line bg-white"><SlidersHorizontal size={12} className="text-ink" /></div></div>
      <div className="mt-3 flex gap-1.5">{['Todos', 'Venda', 'Aluguel'].map((filter, index) => <span key={filter} className={`rounded-full px-2.5 py-1 font-mono text-[9px] ${index === 0 ? 'bg-ink text-paper' : 'border border-line bg-white text-ash'}`}>{filter}</span>)}</div>
    </div>
    <div className="space-y-3 px-4 pb-6 pt-4">{properties.slice(0, 2).map((property) => <motion.button key={property.id} type="button" onClick={() => onOpen(property.id)} whileTap={{ scale: 0.985 }} className="block w-full overflow-hidden rounded-[16px] border border-line/70 bg-white text-left shadow-[0_10px_24px_-22px_rgba(11,11,10,0.5)]"><div className="h-[105px] bg-cover bg-center" style={{ backgroundImage: `url(${property.image})` }} /><div className="p-3"><p className="font-display text-[12.5px] font-medium leading-snug text-ink">{property.title}</p><p className="mt-0.5 font-mono text-[9.5px] text-stone">{property.neighborhood}</p><div className="mt-2 flex items-center justify-between"><p className="font-mono text-[13px] font-medium text-ink">{property.price}</p><span className="font-mono text-[8.5px] text-ash">{property.bedrooms}q · {property.parking}v · {property.area}m²</span></div><p className="mt-2.5 font-mono text-[8.5px] uppercase tracking-[0.12em] text-stone">Toque para ver detalhes →</p></div></motion.button>)}</div>
  </motion.div>;
}

function PropertyDetail({ property, onBack }: { property: CatalogProperty; onBack: () => void }) {
  return <motion.div initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="h-full overflow-hidden bg-paper"><div className="relative h-[232px] bg-cover bg-center" style={{ backgroundImage: `url(${property.image})` }}><button type="button" onClick={onBack} aria-label="Voltar ao catálogo" className="absolute left-3 top-7 grid h-8 w-8 place-items-center rounded-full bg-paper text-ink shadow-sm"><ArrowLeft size={14} /></button><span className="absolute bottom-3 left-3 rounded-full bg-ink px-2.5 py-1 font-mono text-[8.5px] uppercase tracking-[0.13em] text-paper">Venda</span></div><div className="p-4"><p className="font-display text-[20px] font-semibold leading-[0.98] tracking-[-0.04em] text-ink">{property.title}</p><p className="mt-2 font-body text-[10px] text-stone">{property.neighborhood}</p><p className="mt-5 font-display text-[22px] font-semibold tracking-[-0.04em] text-ink">{property.price}</p><div className="mt-4 grid grid-cols-3 border-y border-line py-3 font-mono text-[8.5px] text-ash"><span>{property.bedrooms} quartos</span><span>{property.parking} vagas</span><span>{property.area} m²</span></div><button type="button" className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-full bg-ink py-2.5 font-mono text-[9.5px] text-paper"><MessageCircle size={10} /> Tenho interesse</button></div></motion.div>;
}
