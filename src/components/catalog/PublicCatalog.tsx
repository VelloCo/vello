import {
  AtSign,
  Bath,
  BedDouble,
  Car,
  ChevronLeft,
  Heart,
  MapPin,
  Search,
  Share2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { appPath } from "../../lib/paths";
import { requireSupabase } from "../../lib/supabase";
import { LoadingScreen } from "../LoadingScreen";
import { Logo } from "../Logo";

type Image = { image_url: string; position: number };
type Property = {
  id: string;
  slug: string;
  title: string;
  description: string;
  transaction_type: "sale" | "rent";
  property_type: string;
  price: number;
  city: string;
  neighborhood: string;
  address: string | null;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking_spaces: number;
  area: number;
  features: string[];
  status: string;
  images: Image[];
};
type Catalog = {
  profile: {
    professional_name: string;
    avatar_url: string | null;
    creci: string | null;
    whatsapp: string | null;
    city: string | null;
    state: string | null;
    instagram: string | null;
    slug: string;
    bio: string;
  };
  properties: Property[];
};
type Filters = {
  query: string;
  transaction: "all" | "sale" | "rent";
  type: string;
  bedrooms: number;
  min: string;
  max: string;
  sort: "recent" | "low" | "high";
};
const initial: Filters = {
  query: "",
  transaction: "all",
  type: "",
  bedrooms: 0,
  min: "",
  max: "",
  sort: "recent",
};
const money = (price: number, rent = false) =>
  `${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(price)}${rent ? "/mês" : ""}`;
const phone = (value: string | null) => (value || "").replace(/\D/g, "");
const propertyImage = (property: Property) => property.images?.[0]?.image_url;

function waLink(catalog: Catalog, property?: Property) {
  const name = catalog.profile.professional_name.split(" ")[0] || "corretor";
  const text = property
    ? `Oi ${name}! Vi este imóvel no seu catálogo Vello e gostaria de saber mais: ${property.title} — ${money(property.price, property.transaction_type === "rent")}. ${window.location.href}`
    : `Oi ${name}! Vi seu catálogo na Vello e gostaria de saber mais sobre seus imóveis.`;
  return `https://wa.me/${phone(catalog.profile.whatsapp)}?text=${encodeURIComponent(text)}`;
}

function Share({ catalog }: { catalog: Catalog }) {
  const [copied, setCopied] = useState(false);
  const share = async () => {
    const data = {
      title: `Imóveis de ${catalog.profile.professional_name}`,
      text: `Confira os imóveis disponíveis de ${catalog.profile.professional_name}.`,
      url: window.location.href,
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(data.url);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      /* User cancelled the native share sheet. */
    }
  };
  return (
    <button
      onClick={share}
      aria-label="Compartilhar catálogo"
      className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 font-body text-sm font-medium text-ink transition hover:border-ink"
    >
      <Share2 size={16} />{" "}
      <span className="hidden sm:inline">
        {copied ? "Link copiado" : "Compartilhar"}
      </span>
    </button>
  );
}

function Favorite({ id }: { id: string }) {
  const key = "vello:favorites";
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    setSaved(JSON.parse(localStorage.getItem(key) || "[]").includes(id));
  }, [id]);
  const toggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    const list: string[] = JSON.parse(localStorage.getItem(key) || "[]");
    const next = saved ? list.filter((x) => x !== id) : [...list, id];
    localStorage.setItem(key, JSON.stringify(next));
    setSaved(!saved);
  };
  return (
    <button
      onClick={toggle}
      aria-label={saved ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      className="grid h-10 w-10 place-items-center rounded-full bg-white/90 text-ink shadow-sm transition hover:scale-105"
    >
      <Heart size={18} fill={saved ? "currentColor" : "none"} />
    </button>
  );
}

function PropertyCard({
  property,
  catalog,
}: {
  property: Property;
  catalog: Catalog;
}) {
  const href = appPath(
    `/${catalog.profile.slug}/imovel/${property.slug}`,
  );
  return (
    <motion.a
      layout
      href={href}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="group block overflow-hidden rounded-[22px] bg-white outline-none focus-visible:ring-2 focus-visible:ring-ink"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-cream">
        {propertyImage(property) ? (
          <img
            src={propertyImage(property)}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.025]"
          />
        ) : (
          <div className="grid h-full place-items-center font-mono text-xs text-stone">
            Vello
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-ink/85 px-2.5 py-1 font-mono text-[9px] uppercase tracking-wide text-paper">
          {property.transaction_type === "sale" ? "Venda" : "Aluguel"}
        </span>
        <div className="absolute right-3 top-3">
          <Favorite id={property.id} />
        </div>
      </div>
      <div className="px-1 pb-2 pt-4">
        <h2 className="line-clamp-1 font-display text-[21px] font-semibold leading-tight text-ink">
          {property.title}
        </h2>
        <p className="mt-2 line-clamp-1 font-body text-sm text-ash">
          {property.neighborhood} · {property.city}
        </p>
        <p className="mt-4 font-display text-xl font-semibold text-ink">
          {money(property.price, property.transaction_type === "rent")}
        </p>
        <p className="mt-3 font-body text-sm text-ash">
          {property.bedrooms} quartos <span className="px-1 text-stone">·</span>{" "}
          {property.parking_spaces} vagas{" "}
          <span className="px-1 text-stone">·</span> {property.area} m²
        </p>
      </div>
    </motion.a>
  );
}

function FilterControls({
  filters,
  setFilters,
  total,
}: {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  total: number;
}) {
  const types = [
    "Apartamento",
    "Casa",
    "Cobertura",
    "Studio",
    "Terreno",
    "Comercial",
  ];
  const [sheet, setSheet] = useState(false);
  const reset = () => setFilters(initial);
  return (
    <>
      <div className="mt-7 flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() =>
            setFilters((f) => ({
              ...f,
              transaction: f.transaction === "sale" ? "all" : "sale",
            }))
          }
          className={`h-10 whitespace-nowrap rounded-full border px-4 font-body text-sm ${filters.transaction === "sale" ? "border-ink bg-ink text-paper" : "border-line bg-white text-ash"}`}
        >
          Comprar
        </button>
        <button
          onClick={() =>
            setFilters((f) => ({
              ...f,
              transaction: f.transaction === "rent" ? "all" : "rent",
            }))
          }
          className={`h-10 whitespace-nowrap rounded-full border px-4 font-body text-sm ${filters.transaction === "rent" ? "border-ink bg-ink text-paper" : "border-line bg-white text-ash"}`}
        >
          Alugar
        </button>
        <select
          aria-label="Tipo de imóvel"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className="h-10 rounded-full border border-line bg-white px-4 font-body text-sm text-ash outline-none"
        >
          <option value="">Tipo</option>
          {types.map((type) => (
            <option key={type}>{type}</option>
          ))}
        </select>
        <select
          aria-label="Quantidade de quartos"
          value={filters.bedrooms}
          onChange={(e) =>
            setFilters((f) => ({ ...f, bedrooms: Number(e.target.value) }))
          }
          className="h-10 rounded-full border border-line bg-white px-4 font-body text-sm text-ash outline-none"
        >
          <option value="0">Quartos</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}+ quartos
            </option>
          ))}
        </select>
        <button
          onClick={() => setSheet(true)}
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-white px-4 font-body text-sm text-ash"
        >
          <SlidersHorizontal size={15} /> Mais filtros
        </button>
      </div>
      <AnimatePresence>
        {sheet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-ink/35 p-4 sm:grid sm:place-items-center"
            onClick={() => setSheet(false)}
          >
            <motion.div
              initial={{ y: 32 }}
              animate={{ y: 0 }}
              exit={{ y: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="absolute inset-x-0 bottom-0 rounded-t-[28px] bg-paper p-6 shadow-2xl sm:relative sm:w-full sm:max-w-md sm:rounded-[28px]"
            >
              <div className="mx-auto mb-5 h-1 w-10 rounded-full bg-line sm:hidden" />
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl font-semibold">Filtros</h3>
                <button
                  onClick={() => setSheet(false)}
                  aria-label="Fechar filtros"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="mt-7 grid grid-cols-2 gap-4">
                <label className="font-body text-sm">
                  Preço mínimo
                  <input
                    inputMode="numeric"
                    value={filters.min}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        min: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    placeholder="R$ 0"
                    className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-3 outline-none"
                  />
                </label>
                <label className="font-body text-sm">
                  Preço máximo
                  <input
                    inputMode="numeric"
                    value={filters.max}
                    onChange={(e) =>
                      setFilters((f) => ({
                        ...f,
                        max: e.target.value.replace(/\D/g, ""),
                      }))
                    }
                    placeholder="Sem limite"
                    className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-3 outline-none"
                  />
                </label>
              </div>
              <div className="mt-7 flex items-center justify-between">
                <button
                  onClick={reset}
                  className="font-body text-sm underline underline-offset-4"
                >
                  Limpar filtros
                </button>
                <button
                  onClick={() => setSheet(false)}
                  className="rounded-full bg-ink px-5 py-3 font-body text-sm font-semibold text-paper"
                >
                  Ver {total} imóveis
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function CatalogHeader({ catalog }: { catalog: Catalog }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 38);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const contact = catalog.profile.whatsapp ? waLink(catalog) : null;
  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? "border-b border-line/70 bg-paper/90 backdrop-blur-md" : "bg-paper/70"}`}
    >
      <div className="mx-auto flex h-16 max-w-[1320px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <Share catalog={catalog} />
          {contact && (
            <a
              href={contact}
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 items-center rounded-full bg-ink px-4 font-body text-sm font-semibold text-paper sm:flex"
            >
              Falar com {catalog.profile.professional_name.split(" ")[0]}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}

function CatalogHome({ catalog }: { catalog: Catalog }) {
  const [filters, setFilters] = useState<Filters>(initial);
  const [visible, setVisible] = useState(12);
  const properties = useMemo(() => {
    const words = filters.query.toLowerCase().split(" ").filter(Boolean);
    const min = Number(filters.min || 0);
    const max = Number(filters.max || Infinity);
    return catalog.properties
      .filter(
        (p) =>
          (filters.transaction === "all" ||
            p.transaction_type === filters.transaction) &&
          (!filters.type || p.property_type === filters.type) &&
          p.bedrooms >= filters.bedrooms &&
          p.price >= min &&
          p.price <= max &&
          words.every((word) =>
            `${p.title} ${p.neighborhood} ${p.city} ${p.property_type} ${p.bedrooms} quartos`
              .toLowerCase()
              .includes(word),
          ),
      )
      .sort((a, b) =>
        filters.sort === "low"
          ? a.price - b.price
          : filters.sort === "high"
            ? b.price - a.price
            : 0,
      );
  }, [catalog.properties, filters]);
  const contact = catalog.profile.whatsapp ? waLink(catalog) : null;
  return (
    <>
      <CatalogHeader catalog={catalog} />
      <main className="pb-28">
        <section className="mx-auto max-w-[1320px] px-5 pb-14 pt-10 sm:px-8 sm:pb-20 sm:pt-16">
          <div className="max-w-3xl">
            <div className="flex items-start gap-5">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-[24px] bg-cream sm:h-28 sm:w-28">
                {catalog.profile.avatar_url ? (
                  <img
                    src={catalog.profile.avatar_url}
                    alt={`Foto de ${catalog.profile.professional_name}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="grid h-full place-items-center font-display text-2xl">
                    {catalog.profile.professional_name.slice(0, 1)}
                  </div>
                )}
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">
                  Catálogo imobiliário
                </p>
                <h1 className="mt-2 font-display text-4xl font-semibold tracking-tight text-ink sm:text-6xl">
                  {catalog.profile.professional_name}
                </h1>
                <p className="mt-2 font-body text-sm text-ash">
                  Corretor de imóveis
                  {catalog.profile.creci ? ` · ${catalog.profile.creci}` : ""}
                </p>
                <p className="mt-1 flex items-center gap-1 font-body text-sm text-ash">
                  <MapPin size={14} />
                  {catalog.profile.city}
                  {catalog.profile.state ? `, ${catalog.profile.state}` : ""}
                </p>
              </div>
            </div>
            {catalog.profile.bio && (
              <p className="mt-8 max-w-2xl font-display text-2xl leading-snug text-ink sm:text-3xl">
                {catalog.profile.bio}
              </p>
            )}
            <div className="mt-7 flex flex-wrap gap-3">
              {contact && (
                <a
                  href={contact}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center rounded-full bg-ink px-5 font-body text-sm font-semibold text-paper"
                >
                  Falar com {catalog.profile.professional_name.split(" ")[0]}
                </a>
              )}
              {catalog.profile.instagram && (
                <a
                  href={`https://instagram.com/${catalog.profile.instagram.replace("@", "")}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-12 items-center gap-2 rounded-full border border-line bg-white px-5 font-body text-sm text-ink"
                >
                  <AtSign size={16} /> Instagram
                </a>
              )}
            </div>
          </div>
        </section>
        <section className="mx-auto max-w-[1320px] px-5 sm:px-8">
          <div className="border-t border-line pt-10 sm:pt-14">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-4xl font-semibold tracking-tight text-ink">
                  Imóveis disponíveis
                </h2>
                <p className="mt-2 font-body text-ash">
                  Encontre uma opção que combine com você.
                </p>
              </div>
              <span className="font-mono text-xs text-stone">
                {properties.length} imóveis
              </span>
            </div>
            <label className="mt-8 flex h-14 items-center gap-3 rounded-2xl border border-line bg-white px-4 transition focus-within:border-ink">
              <Search size={19} className="text-stone" />
              <input
                value={filters.query}
                onChange={(e) => {
                  setFilters((f) => ({ ...f, query: e.target.value }));
                  setVisible(12);
                }}
                placeholder="Buscar por bairro, cidade ou imóvel"
                className="min-w-0 flex-1 bg-transparent font-body text-[15px] text-ink outline-none placeholder:text-stone"
              />
              <select
                value={filters.sort}
                aria-label="Ordenar imóveis"
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    sort: e.target.value as Filters["sort"],
                  }))
                }
                className="hidden bg-transparent font-body text-sm text-ash outline-none sm:block"
              >
                <option value="recent">Mais recentes</option>
                <option value="low">Menor preço</option>
                <option value="high">Maior preço</option>
              </select>
            </label>
            <FilterControls
              filters={filters}
              setFilters={setFilters}
              total={properties.length}
            />
            {properties.length ? (
              <motion.div
                layout
                className="mt-8 grid gap-x-5 gap-y-9 md:grid-cols-2 xl:grid-cols-3"
              >
                {properties.slice(0, visible).map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    catalog={catalog}
                  />
                ))}
              </motion.div>
            ) : (
              <div className="mt-8 rounded-[24px] border border-dashed border-line bg-white p-10 text-center">
                <h3 className="font-display text-2xl font-semibold">
                  Nenhum imóvel encontrado.
                </h3>
                <p className="mt-2 font-body text-sm text-ash">
                  Tente alterar os filtros para encontrar outras opções.
                </p>
                <button
                  onClick={() => setFilters(initial)}
                  className="mt-6 rounded-full bg-ink px-5 py-3 font-body text-sm font-semibold text-paper"
                >
                  Limpar filtros
                </button>
              </div>
            )}
            {visible < properties.length && (
              <div className="mt-12 text-center">
                <button
                  onClick={() => setVisible((v) => v + 12)}
                  className="rounded-full border border-line bg-white px-6 py-3 font-body text-sm font-semibold text-ink"
                >
                  Ver mais imóveis
                </button>
              </div>
            )}
          </div>
        </section>
      </main>
      {contact && (
        <a
          href={contact}
          target="_blank"
          rel="noreferrer"
          className="fixed inset-x-5 bottom-4 z-50 flex h-14 items-center justify-center rounded-full bg-ink font-body text-[15px] font-semibold text-paper shadow-xl sm:hidden"
        >
          Falar com {catalog.profile.professional_name.split(" ")[0]}
        </a>
      )}
      <footer className="border-t border-line px-5 py-8 pb-24 text-center font-body text-xs text-stone sm:px-8 sm:pb-8">
        {catalog.profile.professional_name}
        {catalog.profile.creci ? ` · ${catalog.profile.creci}` : ""}
        <span className="px-2">·</span>Catálogo criado com Vello
      </footer>
    </>
  );
}

function PropertyDetail({
  catalog,
  property,
}: {
  catalog: Catalog;
  property: Property;
}) {
  const [image, setImage] = useState(0);
  const contact = catalog.profile.whatsapp ? waLink(catalog, property) : null;
  return (
    <>
      <CatalogHeader catalog={catalog} />
      <main className="mx-auto max-w-[1320px] px-5 pb-28 pt-7 sm:px-8 sm:pt-10">
        <a
          href={appPath(`/${catalog.profile.slug}`)}
          className="inline-flex items-center gap-1 font-body text-sm text-ash"
        >
          <ChevronLeft size={16} /> Voltar ao catálogo
        </a>
        <div className="mt-7 grid gap-10 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,.7fr)]">
          <section>
            <div className="aspect-[4/3] overflow-hidden rounded-[26px] bg-cream">
              {property.images[image] ? (
                <img
                  src={property.images[image].image_url}
                  alt={property.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="grid h-full place-items-center text-stone">
                  Vello
                </div>
              )}
            </div>
            {property.images.length > 1 && (
              <div className="mt-3 flex gap-2 overflow-x-auto">
                {property.images.map((item, index) => (
                  <button
                    key={item.image_url}
                    onClick={() => setImage(index)}
                    className={`h-16 w-20 shrink-0 overflow-hidden rounded-xl border ${index === image ? "border-ink" : "border-transparent"}`}
                  >
                    <img
                      src={item.image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </section>
          <aside>
            <p className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">
              {property.transaction_type === "sale" ? "À venda" : "Para alugar"}
            </p>
            <h1 className="mt-3 font-display text-4xl font-semibold leading-tight tracking-tight">
              {property.title}
            </h1>
            <p className="mt-5 font-display text-3xl font-semibold">
              {money(property.price, property.transaction_type === "rent")}
            </p>
            <p className="mt-5 flex items-center gap-1.5 font-body text-sm text-ash">
              <MapPin size={15} />
              {property.address ||
                `${property.neighborhood} · ${property.city}`}
            </p>
            <div className="mt-7 grid grid-cols-3 gap-3 border-y border-line py-5 font-body text-sm text-ash">
              <span className="flex items-center gap-1">
                <BedDouble size={16} />
                {property.bedrooms} quartos
              </span>
              <span className="flex items-center gap-1">
                <Bath size={16} />
                {property.bathrooms} banheiros
              </span>
              <span className="flex items-center gap-1">
                <Car size={16} />
                {property.parking_spaces} vagas
              </span>
            </div>
            {property.description && (
              <p className="mt-7 font-body leading-relaxed text-ash">
                {property.description}
              </p>
            )}
            {property.features.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {property.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full border border-line px-3 py-2 font-body text-sm text-ash"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            )}
            {contact && (
              <a
                href={contact}
                target="_blank"
                rel="noreferrer"
                className="mt-9 flex h-13 items-center justify-center rounded-full bg-ink font-body text-sm font-semibold text-paper"
              >
                Tenho interesse
              </a>
            )}
          </aside>
        </div>
      </main>
      {contact && (
        <a
          href={contact}
          target="_blank"
          rel="noreferrer"
          className="fixed inset-x-5 bottom-4 z-50 flex h-14 items-center justify-center rounded-full bg-ink font-body text-[15px] font-semibold text-paper shadow-xl sm:hidden"
        >
          Tenho interesse
        </a>
      )}
    </>
  );
}

export function PublicCatalog({
  slug,
  propertySlug,
}: {
  slug: string;
  propertySlug?: string;
}) {
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
          <h1 className="mt-10 font-display text-4xl font-semibold">
            Este catálogo não foi encontrado.
          </h1>
          <p className="mt-3 font-body text-ash">
            Confira o link ou volte para a Vello.
          </p>
          <a
            href={appPath("/")}
            className="mt-7 inline-flex rounded-full bg-ink px-5 py-3 font-body text-sm text-paper"
          >
            Conhecer a Vello
          </a>
        </div>
      </main>
    );
  const property = propertySlug
    ? catalog.properties.find(
        (item) => item.slug === propertySlug || item.id === propertySlug,
      )
    : undefined;
  if (propertySlug && !property)
    return (
      <main className="grid min-h-screen place-items-center bg-paper px-5 text-center">
        <div>
          <Logo />
          <h1 className="mt-10 font-display text-4xl font-semibold">
            Imóvel não encontrado.
          </h1>
          <a
            href={appPath(`/${slug}`)}
            className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-body text-sm text-paper"
          >
            Voltar ao catálogo
          </a>
        </div>
      </main>
    );
  return property ? (
    <PropertyDetail catalog={catalog} property={property} />
  ) : (
    <CatalogHome catalog={catalog} />
  );
}
