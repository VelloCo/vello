import { Search, SlidersHorizontal, MessageCircle } from 'lucide-react';
import { properties } from '../data/properties';
import type { ReactNode } from 'react';

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

export function CatalogScreen() {
  return (
    <div className="h-[560px] overflow-hidden bg-paper">
      {/* profile header */}
      <div className="px-4 pt-9 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="h-11 w-11 shrink-0 rounded-full bg-mist bg-[url('https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=120&q=80')] bg-cover bg-center ring-1 ring-line" />
          <div className="min-w-0">
            <p className="font-display text-[13.5px] font-semibold text-ink leading-tight">Carlos Menezes</p>
            <p className="font-mono text-[9.5px] text-stone leading-tight mt-0.5">CRECI 34.812-F</p>
          </div>
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <div className="flex flex-1 items-center gap-1.5 rounded-full border border-line bg-white px-3 py-2">
            <Search size={12} className="text-stone shrink-0" />
            <span className="font-body text-[10.5px] text-stone">Buscar imóvel</span>
          </div>
          <div className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border border-line bg-white">
            <SlidersHorizontal size={12} className="text-ink" />
          </div>
        </div>

        <div className="mt-3 flex gap-1.5">
          {['Todos', 'Venda', 'Aluguel', 'Lançamento'].map((f, i) => (
            <span
              key={f}
              className={`rounded-full px-2.5 py-1 font-mono text-[9px] whitespace-nowrap ${
                i === 0 ? 'bg-ink text-paper' : 'bg-white text-ash border border-line'
              }`}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* listing */}
      <div className="space-y-3 px-4 pb-6">
        {properties.slice(0, 2).map((p) => (
          <div key={p.id} className="overflow-hidden rounded-[16px] bg-white border border-line/70">
            <div
              className="h-[108px] bg-cover bg-center"
              style={{ backgroundImage: `url(${p.image})` }}
            />
            <div className="p-3">
              <p className="font-display text-[12.5px] font-medium text-ink leading-snug">{p.title}</p>
              <p className="font-mono text-[9.5px] text-stone mt-0.5">{p.neighborhood}</p>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-mono text-[13px] font-medium text-ink">{p.price}</p>
                <span className="font-mono text-[8.5px] text-ash">
                  {p.bedrooms}q · {p.parking}v · {p.area}m²
                </span>
              </div>
              <button className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-full bg-ink py-2 font-mono text-[9.5px] text-paper">
                <MessageCircle size={10} /> Tenho interesse
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
