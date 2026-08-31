import {
  ArrowUpRight,
  AtSign,
  Bath,
  BedDouble,
  Car,
  ChevronLeft,
  Heart,
  MapPin,
  MessageCircle,
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
type CatalogTheme = {
  palette: "warm" | "paper" | "charcoal";
  property_style: "editorial" | "classic" | "compact";
  profile_band: "light" | "contrast" | "dark";
  background_color?: string;
  profile_color?: string;
};
const defaultCatalogTheme: CatalogTheme = { palette: "warm", property_style: "editorial", profile_band: "light" };
const hexColor = (color?: string) => /^#[0-9a-f]{6}$/i.test(color || "") ? color : undefined;
const darkColor = (color?: string) => {
  const value = hexColor(color)?.slice(1);
  if (!value) return false;
  const [r, g, b] = [0, 2, 4].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
  return (r * 299 + g * 587 + b * 114) / 1000 < 150;
};
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
    catalog_theme?: CatalogTheme;
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
const money = (price: number, rent = false) => {
  if (!Number.isFinite(price) || price <= 0) return "Preço sob consulta";
  return `${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(price)}${rent ? "/mês" : ""}`;
};
const phone = (value: string | null) => (value || "").replace(/\D/g, "");
const propertyImage = (property: Property) => property.images?.[0]?.image_url;
const propertySpecs = (property: Property) =>
  [
    property.bedrooms > 0 && `${property.bedrooms} ${property.bedrooms === 1 ? "quarto" : "quartos"}`,
    property.parking_spaces > 0 && `${property.parking_spaces} ${property.parking_spaces === 1 ? "vaga" : "vagas"}`,
    property.area >= 10 && `${property.area} m²`,
  ].filter(Boolean) as string[];
const propertyLocation = (property: Property) =>
  [property.neighborhood, property.city].filter(Boolean).join(" · ");
const displayTitle = (title: string) =>
  title === title.toUpperCase()
    ? title.toLocaleLowerCase("pt-BR").replace(/^\S/, (letter) => letter.toUpperCase())
    : title;
const displayCreci = (creci: string | null) =>
  (creci || "").replace(/^CRECI\s*/i, "");
const propertyHref = (catalog: Catalog, property: Property) =>
  appPath(`/${catalog.profile.slug}/imovel/${property.slug || property.id}`);

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
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      setSaved(Array.isArray(value) && value.includes(id));
    } catch {
      localStorage.removeItem(key);
      setSaved(false);
    }
  }, [id]);
  const toggle = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    let list: string[] = [];
    try {
      const value = JSON.parse(localStorage.getItem(key) || "[]");
      list = Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
    } catch {
      localStorage.removeItem(key);
    }
    const next = saved ? list.filter((x) => x !== id) : [...list, id];
    localStorage.setItem(key, JSON.stringify(next));
    setSaved(!saved);
  };
  return (
    <motion.button
      onClick={toggle}
      aria-label={saved ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      whileTap={{ scale: 0.9 }}
      animate={{ scale: saved ? 1.06 : 1 }}
      transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
      className="grid h-10 w-10 place-items-center rounded-full border border-black/5 bg-[#f5f2ec]/95 text-ink shadow-[0_4px_16px_rgba(0,0,0,.08)] transition hover:scale-105"
    >
      <Heart size={18} fill={saved ? "currentColor" : "none"} />
    </motion.button>
  );
}

function PropertyCard({
  property,
  catalog,
  index = 0,
  style = "editorial",
}: {
  property: Property;
  catalog: Catalog;
  index?: number;
  style?: CatalogTheme["property_style"];
}) {
  const href = propertyHref(catalog, property);
  const specs = propertySpecs(property);
  const hasBedrooms = property.bedrooms > 0;
  const hasParking = property.parking_spaces > 0;
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.07, 0.28), ease: [0.22, 1, 0.36, 1] }}
      className="group relative"
    >
      <div className={`relative overflow-hidden bg-cream ${style === "classic" ? "aspect-[4/3] rounded-[14px]" : style === "compact" ? "aspect-[16/10] rounded-[16px]" : "aspect-[5/4] rounded-[18px] sm:rounded-[22px]"}`}>
        <a href={href} aria-label={`Conhecer ${property.title}`} className="absolute inset-0 z-10 rounded-[18px] focus-visible:ring-2 focus-visible:ring-ink sm:rounded-[22px]" />
        {propertyImage(property) ? (
          <img
            src={propertyImage(property)}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <div className="grid h-full place-items-center font-mono text-xs text-stone">
            Vello
          </div>
        )}
        <span className="pointer-events-none absolute left-3 top-3 z-10 rounded-full bg-black/70 px-2.5 py-1 font-mono text-[8px] uppercase tracking-[.16em] text-paper backdrop-blur-sm">
          {property.transaction_type === "sale" ? "Venda" : "Aluguel"}
        </span>
        <div className="absolute right-3 top-3 z-20">
          <Favorite id={property.id} />
        </div>
      </div>
      <a href={href} className={`relative z-20 block bg-[#f5f2ec] px-5 pb-5 pt-5 transition duration-300 group-hover:-translate-y-0.5 sm:px-6 ${style === "classic" ? "mt-0 rounded-b-[14px] border-x border-b border-black/10" : style === "compact" ? "-mt-3 ml-3 rounded-[16px] shadow-[0_12px_24px_rgba(11,11,10,.05)] sm:ml-4" : "-mt-5 ml-4 rounded-[20px] shadow-[0_14px_30px_rgba(11,11,10,.05)] sm:ml-5"}`} aria-hidden="true" tabIndex={-1}>
        <div className="flex items-start justify-between gap-5">
          <div>
            <h2 className="line-clamp-2 font-display text-[27px] font-medium leading-[.98] tracking-[-.04em] text-ink sm:text-[32px]">
              {displayTitle(property.title)}
            </h2>
          </div>
          <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-black/15 text-ink transition duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:bg-ink group-hover:text-paper"><ArrowUpRight size={17} /></span>
        </div>
        {propertyLocation(property) && <p className="mt-3 flex items-center gap-1.5 font-body text-sm text-ash"><MapPin size={15} strokeWidth={1.7} />{propertyLocation(property)}</p>}
        <div className="mt-7"><p className="font-mono text-[9px] uppercase tracking-[.16em] text-stone">Valor do imóvel</p><p className="mt-2 font-display text-[28px] font-semibold leading-none tracking-[-.045em] text-ink">{money(property.price, property.transaction_type === "rent")}</p></div>
        {specs.length > 0 && <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 font-body text-sm text-ash">{hasBedrooms && <span className="inline-flex items-center gap-1.5"><BedDouble size={15} strokeWidth={1.7} />{property.bedrooms} {property.bedrooms === 1 ? "quarto" : "quartos"}</span>}{hasParking && <span className="inline-flex items-center gap-1.5"><Car size={15} strokeWidth={1.7} />{property.parking_spaces} {property.parking_spaces === 1 ? "vaga" : "vagas"}</span>}{property.area >= 10 && <span>{property.area} m²</span>}</div>}
      </a>
    </motion.article>
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
      <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          onClick={reset}
          className={`h-10 whitespace-nowrap rounded-full border px-4 font-body text-sm transition ${filters.transaction === "all" && !filters.type && !filters.bedrooms && !filters.min && !filters.max ? "border-ink bg-ink text-paper" : "border-line bg-transparent text-ash hover:border-ink hover:text-ink"}`}
        >
          Todos
        </button>
        <button
          onClick={() =>
            setFilters((f) => ({
              ...f,
              transaction: f.transaction === "sale" ? "all" : "sale",
            }))
          }
          className={`h-10 whitespace-nowrap rounded-full border px-4 font-body text-sm transition ${filters.transaction === "sale" ? "border-ink bg-ink text-paper" : "border-line bg-transparent text-ash hover:border-ink hover:text-ink"}`}
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
          className={`h-10 whitespace-nowrap rounded-full border px-4 font-body text-sm transition ${filters.transaction === "rent" ? "border-ink bg-ink text-paper" : "border-line bg-transparent text-ash hover:border-ink hover:text-ink"}`}
        >
          Alugar
        </button>
        <select
          aria-label="Tipo de imóvel"
          value={filters.type}
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          className="hidden h-10 rounded-full border border-line bg-transparent px-4 font-body text-sm text-ash outline-none sm:block"
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
          className="hidden h-10 rounded-full border border-line bg-transparent px-4 font-body text-sm text-ash outline-none sm:block"
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
          className="inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full border border-line bg-transparent px-4 font-body text-sm text-ash transition hover:border-ink hover:text-ink"
        >
          <SlidersHorizontal size={15} /> Filtros
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
              <div className="mt-4 grid grid-cols-2 gap-4 sm:hidden">
                <label className="font-body text-sm">
                  Tipo
                  <select value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))} className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-3 text-ash outline-none">
                    <option value="">Todos</option>
                    {types.map((type) => <option key={type}>{type}</option>)}
                  </select>
                </label>
                <label className="font-body text-sm">
                  Quartos
                  <select value={filters.bedrooms} onChange={(e) => setFilters((f) => ({ ...f, bedrooms: Number(e.target.value) }))} className="mt-2 h-12 w-full rounded-xl border border-line bg-white px-3 text-ash outline-none">
                    <option value="0">Todos</option>
                    {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}+ quartos</option>)}
                  </select>
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

function CatalogHeader({
  catalog,
  onHero = false,
}: {
  catalog: Catalog;
  onHero?: boolean;
}) {
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
      className={`sticky top-0 z-40 transition-all duration-500 ${scrolled ? "border-b border-line/70 bg-[#f5f2ec]/90 backdrop-blur-md" : onHero ? "bg-[#f5f2ec]" : "bg-paper"}`}
    >
      <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-5 sm:px-8">
        <Logo />
        <div className="flex items-center gap-2">
          <Share catalog={catalog} />
          {contact && (
            <a
              href={contact}
              target="_blank"
              rel="noreferrer"
              className="hidden h-10 items-center rounded-full bg-ink px-4 font-body text-sm font-semibold text-paper transition hover:bg-charcoal sm:flex"
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
  const theme = catalog.profile.catalog_theme || defaultCatalogTheme;
  const palette = {
    warm: { page: "bg-[#f5f2ec]", heading: "text-ink", copy: "text-ash" },
    paper: { page: "bg-white", heading: "text-ink", copy: "text-ash" },
    charcoal: { page: "bg-[#1b1b19]", heading: "text-paper", copy: "text-paper/60" },
  }[theme.palette];
  const profileBand = {
    light: "border-black/10 bg-white text-ink",
    contrast: "border-[#d7d0c4] bg-[#e9e4da] text-ink",
    dark: "border-white/10 bg-ink text-paper",
  }[theme.profile_band];
  const customBackground = hexColor(theme.background_color);
  const customProfileColor = hexColor(theme.profile_color);
  const profileText = darkColor(customProfileColor) ? "text-paper" : "text-ink";
  const darkPage = theme.palette === "charcoal" || darkColor(customBackground);
  const filterBackground = customBackground
    ? ""
    : theme.palette === "charcoal"
      ? "bg-[#1b1b19]/95"
      : theme.palette === "paper"
        ? "bg-white/95"
        : "bg-[#f5f2ec]/95";
  return (
    <>
      <CatalogHeader catalog={catalog} />
      <main className={`overflow-hidden pb-28 ${palette.page}`} style={customBackground ? { backgroundColor: customBackground } : undefined}>
        <section className="px-5 pb-3 pt-7 sm:px-8 sm:pb-6 sm:pt-10">
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} style={customProfileColor ? { backgroundColor: customProfileColor } : undefined} className={`mx-auto flex max-w-[1400px] items-center gap-3 rounded-[28px] border p-3 shadow-[0_14px_35px_rgba(11,11,10,.055)] sm:gap-5 sm:rounded-full sm:p-3.5 ${profileBand} ${customProfileColor ? profileText : ""}`}>
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-ink sm:h-[72px] sm:w-[72px]">
              {catalog.profile.avatar_url ? <img src={catalog.profile.avatar_url} alt={`Foto de ${catalog.profile.professional_name}`} className="h-full w-full object-cover" /> : <img src={appPath("/vello-mascot.png")} alt="Mascote da Vello" className="h-full w-full object-cover object-top" />}
            </div>
            <div className="min-w-0 flex-1 py-0.5">
              <p className="truncate font-display text-[19px] font-semibold leading-none tracking-[-.035em] sm:text-2xl">{catalog.profile.professional_name}</p>
              <p className="mt-1.5 truncate font-body text-[12px] opacity-65 sm:text-sm">Corretor de imóveis{catalog.profile.creci ? ` · CRECI ${displayCreci(catalog.profile.creci)}` : ""}</p>
              {(catalog.profile.city || catalog.profile.state) && <p className="mt-1 flex items-center gap-1 truncate font-body text-[11px] opacity-55 sm:text-xs"><MapPin size={12} />{[catalog.profile.city, catalog.profile.state].filter(Boolean).join(", ")}</p>}
            </div>
            {contact && <a href={contact} target="_blank" rel="noreferrer" className="hidden h-11 shrink-0 items-center gap-2 rounded-full bg-ink px-5 font-body text-sm font-semibold text-paper transition hover:bg-charcoal sm:inline-flex"><MessageCircle size={16} />Falar com {catalog.profile.professional_name.split(" ")[0]}</a>}
          </motion.div>
        </section>

        <section id="imoveis" className="scroll-mt-20 px-5 pb-16 pt-10 sm:px-8 sm:pb-24 sm:pt-14">
          <div className="mx-auto max-w-[1400px]">
            <div className="border-b border-black/10 pb-8">
              <div><h2 className={`font-display text-[42px] font-medium leading-[.92] tracking-[-.05em] sm:text-6xl ${palette.heading}`}>Todos os imóveis</h2><p className={`mt-4 font-body text-[16px] ${palette.copy}`}>Explore todas as opções disponíveis.</p></div>
            </div>
            <div style={customBackground ? { backgroundColor: customBackground } : undefined} className={`sticky top-[68px] z-30 -mx-5 px-5 py-4 shadow-[0_8px_18px_rgba(11,11,10,.035)] backdrop-blur-md sm:-mx-8 sm:px-8 ${filterBackground}`}><div className="mx-auto max-w-[1400px]"><label className="flex h-12 max-w-xl items-center gap-3 rounded-full border border-black/10 bg-white/65 px-4 font-body text-sm transition focus-within:border-black/40 focus-within:bg-white"><Search size={18} className="text-stone" /><input value={filters.query} onChange={(e) => { setFilters((filter) => ({ ...filter, query: e.target.value })); setVisible(12); }} placeholder="Onde você quer morar?" className="min-w-0 flex-1 bg-transparent text-ink outline-none placeholder:text-stone" /></label><div className="mt-3"><FilterControls filters={filters} setFilters={setFilters} total={properties.length} /></div></div></div>
            {properties.length > 0 ? <motion.div layout className={`mt-10 grid gap-x-7 gap-y-14 ${properties.length === 1 ? "max-w-[920px]" : theme.property_style === "compact" ? "sm:grid-cols-2 xl:grid-cols-3" : theme.property_style === "classic" ? "sm:grid-cols-2 xl:grid-cols-3" : "md:grid-cols-2"}`}>
              {properties.slice(0, visible).map((property, index) => <PropertyCard key={property.id} property={property} catalog={catalog} index={index} style={theme.property_style} />)}
            </motion.div> : <div className="mt-12 max-w-2xl border-y border-black/10 py-16"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-stone">Sem resultados</p><h3 className="mt-5 font-display text-4xl font-semibold tracking-[-.05em]">Novas oportunidades em breve.</h3><p className="mt-5 max-w-lg font-body leading-relaxed text-ash">No momento não há imóveis que combinem com essa busca. Se você procura algo específico, fale diretamente com {catalog.profile.professional_name}.</p><button onClick={() => setFilters(initial)} className="mt-8 font-body text-sm font-semibold underline underline-offset-4">Limpar filtros</button></div>}
            {visible < properties.length && <div className="mt-14"><button onClick={() => setVisible((value) => value + 12)} className="rounded-full border border-ink px-6 py-3 font-body text-sm font-semibold transition hover:bg-ink hover:text-paper">Ver mais imóveis</button></div>}
          </div>
        </section>

        {contact && <section className="relative overflow-hidden bg-ink px-5 py-24 text-paper sm:px-8 sm:py-32"><div className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-white/[0.03] blur-3xl" /><div className="relative mx-auto flex max-w-[760px] flex-col items-center text-center"><h2 className="font-display text-[38px] font-semibold leading-[1.06] tracking-[-.02em] sm:text-[52px]">Gostou de algum imóvel?</h2><a href={contact} target="_blank" rel="noreferrer" className="group mt-10 inline-flex items-center gap-2.5 rounded-full bg-paper px-8 py-4 font-body text-[16px] font-medium text-ink transition-transform hover:scale-[1.03] active:scale-[.98]"><MessageCircle size={17} />Falar com {catalog.profile.professional_name.split(" ")[0]} <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5" /></a><p className="mt-5 font-mono text-[12px] text-paper/45">Tire suas dúvidas ou marque uma visita pelo WhatsApp.</p></div></section>}
      </main>
      {contact && (
        <a
          href={contact}
          target="_blank"
          rel="noreferrer"
          className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 flex h-14 items-center justify-center gap-2 rounded-full bg-ink font-body text-[15px] font-semibold text-paper shadow-2xl sm:hidden"
        >
          <MessageCircle size={17} /> Falar com {catalog.profile.professional_name.split(" ")[0]}
        </a>
      )}
      <footer style={customBackground ? { backgroundColor: customBackground } : undefined} className={`border-t px-5 py-8 pb-24 text-center font-body text-xs sm:px-8 sm:pb-8 ${darkPage ? "border-white/10 text-paper/55" : "border-black/10 bg-[#f5f2ec] text-stone"}`}>
        {catalog.profile.professional_name}{catalog.profile.creci ? ` · CRECI ${displayCreci(catalog.profile.creci)}` : ""}{catalog.profile.instagram && <a href={`https://instagram.com/${catalog.profile.instagram.replace("@", "")}`} target="_blank" rel="noreferrer" className="ml-3 inline-flex items-center gap-1 underline underline-offset-4"><AtSign size={12} />Instagram</a>}<span className="px-2">·</span>Criado com Vello
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
  const specs = [
    property.bedrooms > 0 && { icon: BedDouble, label: `${property.bedrooms} ${property.bedrooms === 1 ? "quarto" : "quartos"}` },
    property.bathrooms > 0 && { icon: Bath, label: `${property.bathrooms} ${property.bathrooms === 1 ? "banheiro" : "banheiros"}` },
    property.parking_spaces > 0 && { icon: Car, label: `${property.parking_spaces} ${property.parking_spaces === 1 ? "vaga" : "vagas"}` },
    property.area > 0 && { icon: null, label: `${property.area} m²` },
  ].filter(Boolean) as { icon: typeof BedDouble | typeof Bath | typeof Car | null; label: string }[];
  return (
    <>
      <CatalogHeader catalog={catalog} />
      <main className="min-h-screen bg-[#f5f2ec] px-5 pb-28 pt-7 sm:px-8 sm:pt-10">
        <div className="mx-auto max-w-[1400px]">
        <a
          href={appPath(`/${catalog.profile.slug}`)}
          className="inline-flex items-center gap-1 font-body text-sm text-ash"
        >
          <ChevronLeft size={16} /> Voltar ao catálogo
        </a>
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,.65fr)] lg:gap-16">
          <section>
            <div className="aspect-[4/3] overflow-hidden rounded-[22px] bg-cream sm:rounded-[30px]">
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
          <aside className="lg:pt-10">
            <p className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">
              {property.transaction_type === "sale" ? "À venda" : "Para alugar"}
            </p>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[.9] tracking-[-.055em] sm:text-6xl">
              {property.title}
            </h1>
            <p className="mt-8 font-display text-3xl font-semibold tracking-[-.035em]">
              {money(property.price, property.transaction_type === "rent")}
            </p>
            <p className="mt-6 flex items-center gap-1.5 font-body text-sm text-ash">
              <MapPin size={15} />
              {property.address ||
                `${property.neighborhood} · ${property.city}`}
            </p>
            {specs.length > 0 && <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 border-y border-line py-5 font-body text-sm text-ash">{specs.map(({ icon: Icon, label }) => <span key={label} className="flex items-center gap-1.5">{Icon && <Icon size={16} />}{label}</span>)}</div>}
            {property.description && (
              <p className="mt-8 font-body leading-relaxed text-ash">
                {property.description}
              </p>
            )}
            {property.features.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
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
                className="mt-10 flex h-14 items-center justify-center gap-2 rounded-full bg-ink font-body text-sm font-semibold text-paper transition hover:bg-charcoal"
              >
                <MessageCircle size={17} /> Tenho interesse
              </a>
            )}
          </aside>
        </div>
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
