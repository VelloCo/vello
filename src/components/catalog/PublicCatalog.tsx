import { Bath, BedDouble, Car, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { Logo } from "../Logo";
import { LoadingScreen } from "../LoadingScreen";
import { requireSupabase } from "../../lib/supabase";

type Catalog = {
  profile: {
    professional_name: string;
    avatar_url: string | null;
    creci: string;
    city: string;
    state: string;
    instagram: string | null;
  };
  properties: Array<{
    id: string;
    title: string;
    description: string;
    price: number;
    city: string;
    neighborhood: string;
    bedrooms: number;
    bathrooms: number;
    parking_spaces: number;
    area: number;
    images: Array<{ image_url: string }>;
  }>;
};

export function PublicCatalog({ slug }: { slug: string }) {
  const [catalog, setCatalog] = useState<Catalog | null | undefined>(undefined);
  useEffect(() => {
    requireSupabase()
      .rpc("get_catalog", { catalog_slug: slug })
      .then(({ data }) => setCatalog(data as Catalog | null));
  }, [slug]);
  if (catalog === undefined) return <LoadingScreen label="Abrindo catálogo" />;
  if (!catalog)
    return (
      <main className="grid min-h-screen place-items-center bg-paper px-5 text-center">
        <div>
          <Logo />
          <h1 className="mt-12 font-display text-4xl font-semibold text-ink">
            Catálogo não encontrado.
          </h1>
        </div>
      </main>
    );
  return (
    <main className="min-h-screen bg-paper">
      <header className="border-b border-line bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <Logo />
          <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone">
            Catálogo Vello
          </p>
        </div>
      </header>
      <section className="mx-auto max-w-6xl px-5 py-14 sm:py-20">
        <div className="flex items-center gap-4">
          <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-cream">
            {catalog.profile.avatar_url ? (
              <img
                src={catalog.profile.avatar_url}
                className="h-full w-full object-cover"
              />
            ) : (
              <MapPin size={20} />
            )}
          </span>
          <div>
            <p className="font-display text-3xl font-semibold text-ink">
              {catalog.profile.professional_name}
            </p>
            <p className="mt-1 font-body text-sm text-ash">
              Corretor de imóveis · {catalog.profile.creci}
            </p>
          </div>
        </div>
        <h1 className="mt-14 max-w-2xl font-display text-5xl font-semibold tracking-tight text-ink">
          Imóveis selecionados para você.
        </h1>
        <p className="mt-4 font-body text-[16px] text-ash">
          {catalog.profile.city}, {catalog.profile.state}
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {catalog.properties.map((property) => (
            <article
              key={property.id}
              className="overflow-hidden rounded-[24px] border border-line bg-white"
            >
              <div className="aspect-[16/10] bg-cream">
                {property.images[0] && (
                  <img
                    src={property.images[0].image_url}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <p className="font-display text-2xl font-semibold text-ink">
                  {property.title}
                </p>
                <p className="mt-3 font-mono text-lg text-ink">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                    maximumFractionDigits: 0,
                  }).format(property.price)}
                </p>
                <p className="mt-3 flex items-center gap-1.5 font-body text-sm text-ash">
                  <MapPin size={14} /> {property.neighborhood}, {property.city}
                </p>
                <div className="mt-5 flex gap-4 font-body text-sm text-ash">
                  <span className="flex items-center gap-1">
                    <BedDouble size={15} /> {property.bedrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath size={15} /> {property.bathrooms}
                  </span>
                  <span className="flex items-center gap-1">
                    <Car size={15} /> {property.parking_spaces}
                  </span>
                  <span>{property.area} m²</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
