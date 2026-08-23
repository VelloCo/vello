import type { Property } from '../data/properties';

export function PropertyCard({
  property,
  compact = false,
  liked = false,
}: {
  property: Property;
  compact?: boolean;
  liked?: boolean;
}) {
  return (
    <div className="group overflow-hidden rounded-[14px] bg-white border border-line/70 transition-shadow hover:shadow-[0_20px_40px_-24px_rgba(11,11,10,0.35)]">
      <div className={`relative overflow-hidden ${compact ? 'h-[120px]' : 'h-[170px]'}`}>
        <img
          src={property.image}
          alt={property.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[600ms] ease-out group-hover:scale-[1.035]"
          onError={(e) => {
            (e.target as HTMLImageElement).style.background = '#E7E4DD';
          }}
        />
        <span className="absolute left-2.5 top-2.5 rounded-full bg-ink/85 px-2.5 py-1 font-mono text-[10px] tracking-wide text-paper backdrop-blur-sm">
          {property.type}
        </span>
        {liked && (
          <span className="absolute right-2.5 top-2.5 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-[12px]">
            ❤️
          </span>
        )}
      </div>
      <div className={compact ? 'p-3' : 'p-4'}>
        <p className={`font-display font-medium text-ink leading-snug ${compact ? 'text-[13px]' : 'text-[15px]'}`}>
          {property.title}
        </p>
        <p className="mt-0.5 font-mono text-[11px] text-stone">
          {property.neighborhood} · {property.city}
        </p>
        <p className={`mt-2 font-mono font-medium text-ink ${compact ? 'text-[14px]' : 'text-[17px]'}`}>
          {property.price}
        </p>
        <p className="mt-1.5 font-mono text-[11px] text-ash">
          {property.bedrooms} quartos · {property.parking} {property.parking === 1 ? 'vaga' : 'vagas'} · {property.area} m²
        </p>
      </div>
    </div>
  );
}
