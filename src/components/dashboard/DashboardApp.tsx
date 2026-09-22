import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Archive,
  Ban,
  Building2,
  CalendarDays,
  Check,
  ChevronLeft,
  Clock3,
  Copy,
  ExternalLink,
  FolderHeart,
  Home,
  ImagePlus,
  LoaderCircle,
  LogOut,
  MessageCircle,
  MoreHorizontal,
  Palette,
  PencilLine,
  Plus,
  Search,
  Settings2,
  Share2,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  appPath,
  publicCatalogLabel,
  PUBLIC_SITE_ORIGIN,
} from "../../lib/paths";
import { LoadingScreen } from "../LoadingScreen";
import { signOut, updatePassword } from "../../lib/auth";
import {
  brl,
  brlCents,
  dateBR,
  deleteProperty,
  deleteService,
  deleteSelection,
  getAppointments,
  getBusinessHours,
  getProfile,
  getProperties,
  getSelections,
  getServices,
  replaceBusinessHours,
  saveService,
  saveProfile,
  saveProperty,
  saveSelection,
  setAppointmentStatus,
  setSelectionStatus,
  slugify,
  uploadAvatar,
  uploadPropertyImages,
  uploadServiceImages,
} from "../../lib/vello";
import type {
  Appointment,
  BusinessHour,
  CatalogTheme,
  Profile,
  Property,
  Selection,
  Service,
} from "../../lib/vello";

type Props = { user: User; route: string };
const nav = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/dashboard/servicos", label: "Serviços", icon: Sparkles },
  { href: "/dashboard/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/dashboard/catalogo", label: "Meu catálogo", icon: ExternalLink },
  {
    href: "/dashboard/personalizar",
    label: "Personalizar catálogo",
    icon: Palette,
  },
  { href: "/dashboard/perfil", label: "Perfil", icon: UserRound },
  { href: "/dashboard/configuracoes", label: "Configurações", icon: Settings2 },
];
const go = (href: string) => (window.location.href = appPath(href));
const publicCatalogUrl = (slug?: string | null) =>
  `${PUBLIC_SITE_ORIGIN}/${(slug || "").replace(/^\/+|\/+$/g, "")}`;
const publicPropertyPath = (catalogSlug: string, property: Property) =>
  appPath(`/${catalogSlug}/imovel/${property.slug || property.id}`);
const displayCreci = (creci?: string | null) =>
  (creci || "").replace(/^CRECI\s*/i, "");
const cover = (p: Property) =>
  p.property_images?.find((i) => i.is_cover)?.image_url ||
  p.property_images?.[0]?.image_url;
const serviceCover = (service: Service) =>
  service.service_images?.find((image) => image.is_cover)?.image_url ||
  service.service_images?.[0]?.image_url;
const serviceCoverAsset: Record<Service["category"], string> = {
  facial: "/service-covers/facial-v2.jpg",
  corporal: "/service-covers/corporal-v2.jpg",
  depilacao: "/service-covers/depilacao-v2.jpg",
  sobrancelhas_cilios: "/service-covers/sobrancelhas-cilios-v2.jpg",
  unhas: "/service-covers/unhas-v2.jpg",
  cabelo: "/service-covers/cabelo-v2.jpg",
  massagem: "/service-covers/massagem-v2.jpg",
  harmonizacao: "/service-covers/harmonizacao-v2.jpg",
  outros: "/service-covers/outros-v2.jpg",
};
const serviceCoverStyle = (category: Service["category"]) => {
  return {
    backgroundColor: "#E8F1F8",
    backgroundImage: `url(${appPath(serviceCoverAsset[category])})`,
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };
};
const statusLabel: Record<Property["status"], string> = {
  available: "Disponível",
  reserved: "Reservado",
  sold: "Vendido",
  rented: "Alugado",
};
const serviceCategoryLabel: Record<Service["category"], string> = {
  facial: "Facial",
  corporal: "Corporal",
  depilacao: "Depilação",
  sobrancelhas_cilios: "Sobrancelhas e cílios",
  unhas: "Unhas",
  cabelo: "Cabelo",
  massagem: "Massagem",
  harmonizacao: "Harmonização",
  outros: "Outros",
};
const appointmentStatusLabel: Record<Appointment["status"], string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  cancelled: "Cancelado",
  completed: "Concluído",
  no_show: "Não compareceu",
};
const weekdays = [
  "Domingo",
  "Segunda",
  "Terça",
  "Quarta",
  "Quinta",
  "Sexta",
  "Sábado",
];

function Toast({ text }: { text: string | null }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.p
          initial={{
            opacity: 0,
            transform: "translate(-50%, 12px) scale(.97)",
          }}
          animate={{ opacity: 1, transform: "translate(-50%, 0) scale(1)" }}
          exit={{ opacity: 0, transform: "translate(-50%, 8px) scale(.98)" }}
          transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
          className="fixed bottom-24 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-ink px-5 py-3 font-body text-sm text-paper shadow-xl"
        >
          ✓ {text}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
function Button({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`vello-action vello-action-dark inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 font-body text-sm font-semibold text-paper disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {children}
    </button>
  );
}
function Badge({ status }: { status: Property["status"] }) {
  const tone =
    status === "available"
      ? "bg-stone-100 text-stone-700"
      : status === "reserved"
        ? "bg-amber-50 text-amber-800"
        : "bg-zinc-200 text-zinc-700";
  return (
    <span
      className={`rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${tone}`}
    >
      {statusLabel[status]}
    </span>
  );
}

function PropertyCard({
  property,
  onEdit,
  onDelete,
  catalogSlug,
  compact = false,
}: {
  property: Property;
  onEdit: () => void;
  onDelete?: () => void;
  catalogSlug?: string | null;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article className="vello-surface group relative overflow-hidden rounded-[22px] border border-line bg-white">
      <div
        className={`relative overflow-hidden bg-cream ${compact ? "aspect-[4/3]" : "aspect-[16/10]"}`}
      >
        {cover(property) ? (
          <img
            src={cover(property)}
            alt={property.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = appPath("/hero-vello-house.png");
            }}
            className="vello-card-image h-full w-full object-cover"
          />
        ) : (
          <div className="grid h-full place-items-center text-stone">
            <Building2 size={26} />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge status={property.status} />
        </div>
        <button
          aria-label={`Ações para ${property.title}`}
          onClick={() => setOpen(!open)}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink shadow-sm"
        >
          <MoreHorizontal size={17} />
        </button>
        {open && (
          <div className="vello-popover absolute right-3 top-12 z-20 w-40 rounded-xl border border-line bg-white p-1.5 text-left shadow-[0_18px_48px_-18px_rgba(18,40,58,.28)]">
            <button
              onClick={onEdit}
              className="w-full rounded-lg px-3 py-2 text-left font-body text-sm hover:bg-cream"
            >
              Editar
            </button>
            {catalogSlug && (
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${window.location.origin}${publicPropertyPath(catalogSlug, property)}`,
                  );
                  setOpen(false);
                }}
                className="w-full rounded-lg px-3 py-2 text-left font-body text-sm hover:bg-cream"
              >
                Copiar link
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="w-full rounded-lg px-3 py-2 text-left font-body text-sm text-red-700 hover:bg-red-50"
              >
                Excluir
              </button>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-display text-lg font-semibold text-ink">
            {property.title}
          </h3>
          {property.publication_status === "draft" && (
            <span className="rounded-full border border-line px-2 py-1 font-mono text-[9px] text-stone">
              Rascunho
            </span>
          )}
        </div>
        <p className="mt-1 font-mono text-sm text-ink">
          {brl(property.price, property.transaction_type === "rent")}
        </p>
        <p className="mt-2 line-clamp-1 font-body text-sm text-ash">
          {property.neighborhood} · {property.city}
        </p>
        <p className="mt-3 font-body text-xs text-ash">
          {property.bedrooms} quartos · {property.area} m²
        </p>
      </div>
    </article>
  );
}

function Sidebar({ profile, route }: { profile: Profile; route: string }) {
  const [account, setAccount] = useState(false);
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-line bg-white p-5 lg:flex lg:flex-col">
      <a href={appPath("/dashboard")}>
        <span className="inline-flex items-center gap-2">
          <img
            src={`${appPath("/vello-logo.png")}?v=4`}
            alt=""
            className="h-7 w-7 object-contain"
          />
          <b className="font-display text-xl text-ink">Vello</b>
        </span>
      </a>
      <nav className="mt-12 space-y-1">
        {nav.slice(0, 4).map((item) => (
          <NavItem
            key={item.href}
            item={item}
            active={
              route === item.href ||
              (item.href === "/dashboard/servicos" &&
                route.startsWith("/dashboard/servicos")) ||
              (item.href === "/dashboard/agenda" &&
                route.startsWith("/dashboard/agenda"))
            }
          />
        ))}
        <div className="h-6" />
        {nav.slice(4).map((item) => (
          <NavItem
            key={item.href}
            item={item}
            active={
              route === item.href ||
              (item.href === "/dashboard/perfil" &&
                route.startsWith("/dashboard/perfil"))
            }
          />
        ))}
      </nav>
      <div className="relative mt-auto border-t border-line pt-4">
        <button
          onClick={() => setAccount(!account)}
          className="flex w-full items-center gap-3 text-left"
        >
          <span className="grid h-9 w-9 place-items-center overflow-hidden rounded-full bg-cream font-display text-sm">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                className="h-full w-full object-cover"
              />
            ) : (
              <img
                src={appPath("/vello-mascot.png")}
                alt="Mascote da Vello"
                className="h-full w-full object-cover object-top"
              />
            )}
          </span>
          <span className="min-w-0">
            <b className="block truncate font-body text-sm text-ink">
              {profile.professional_name || "Seu perfil"}
            </b>
            <small className="block truncate font-mono text-[10px] text-stone">
              {profile.business_type === "clinica"
                ? "Clínica"
                : "Profissional autônoma"}
            </small>
          </span>
        </button>
        {account && (
          <div className="absolute bottom-16 left-0 w-full rounded-2xl border border-line bg-white p-2 shadow-xl">
            <a
              href={appPath("/dashboard/perfil")}
              className="block rounded-lg px-3 py-2 font-body text-sm hover:bg-cream"
            >
              Perfil
            </a>
            <button
              onClick={async () => {
                await signOut();
                go("/login");
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 font-body text-sm text-red-700 hover:bg-red-50"
            >
              <LogOut size={14} /> Sair
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
function NavItem({
  item,
  active,
}: {
  item: (typeof nav)[number];
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <a
      href={appPath(item.href)}
      className={`flex h-11 items-center gap-3 rounded-xl px-3 font-body text-sm transition-colors ${active ? "bg-ink font-semibold text-paper" : "text-ash hover:bg-cream hover:text-ink"}`}
    >
      <Icon size={17} strokeWidth={1.8} />
      {item.label}
    </a>
  );
}
function MobileNav({ route }: { route: string }) {
  const items = [nav[0], nav[1], nav[2], nav[5]];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 grid h-[72px] grid-cols-5 items-center border-t border-line bg-white/95 px-1 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {items.slice(0, 2).map((i) => (
        <MobileItem
          key={i.href}
          item={i}
          active={
            i.href === "/dashboard"
              ? route === i.href
              : route.startsWith(i.href)
          }
        />
      ))}
      <a
        href={appPath("/dashboard/servicos/novo")}
        aria-label="Novo serviço"
        className="-mt-8 grid h-14 w-14 place-self-center place-items-center rounded-full bg-ink text-paper shadow-[0_10px_24px_rgba(18,40,58,.28)] transition hover:bg-[#245D85]"
      >
        <Plus size={22} strokeWidth={2} />
      </a>
      {items.slice(2).map((i) => (
        <MobileItem key={i.href} item={i} active={route.startsWith(i.href)} />
      ))}
    </nav>
  );
}
function MobileItem({
  item,
  active,
}: {
  item: (typeof nav)[number];
  active: boolean;
}) {
  const Icon = item.icon;
  return (
    <a
      href={appPath(item.href)}
      aria-current={active ? "page" : undefined}
      className={`grid w-full justify-items-center gap-1 px-1 font-body text-[10px] leading-none ${active ? "text-ink" : "text-stone"}`}
    >
      <Icon size={18} strokeWidth={1.9} />
      <span>{item.label}</span>
    </a>
  );
}

function Empty({
  title,
  text,
  action,
  onAction,
}: {
  title: string;
  text: string;
  action: string;
  onAction: () => void;
}) {
  return (
    <div className="mt-6 rounded-[24px] border border-dashed border-line bg-white p-9 text-center">
      <Building2 className="mx-auto text-stone" size={27} />
      <h2 className="mt-4 font-display text-2xl font-semibold">{title}</h2>
      <p className="mx-auto mt-2 max-w-sm font-body text-sm leading-relaxed text-ash">
        {text}
      </p>
      <Button onClick={onAction} className="mt-6">
        {action}
      </Button>
    </div>
  );
}

function PropertiesPage({
  profile,
  properties,
  refresh,
  toast,
}: {
  profile: Profile;
  properties: Property[];
  refresh: () => void;
  toast: (s: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [remove, setRemove] = useState<Property | null>(null);
  const filtered = properties.filter(
    (p) =>
      (status === "all" || p.status === status) &&
      `${p.title} ${p.neighborhood} ${p.city}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Imóveis
          </h1>
          <p className="mt-2 font-body text-ash">
            Gerencie tudo o que está no seu catálogo.
          </p>
        </div>
        <Button onClick={() => go("/dashboard/imoveis/novo")}>
          <Plus size={17} /> Novo imóvel
        </Button>
      </header>
      <div className="mt-8">
        <label className="flex h-14 w-full items-center gap-3 rounded-2xl border border-line bg-white p-1.5 pr-3 shadow-[0_8px_22px_rgba(18,40,58,.035)] transition focus-within:border-ink focus-within:shadow-[0_10px_26px_rgba(18,40,58,.07)]">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream text-ash">
            <Search size={18} strokeWidth={1.8} />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busque por imóvel, bairro ou cidade"
            className="min-w-0 flex-1 bg-transparent font-body text-sm text-ink outline-none placeholder:text-stone"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
              className="grid h-8 w-8 place-items-center rounded-full text-stone transition hover:bg-cream hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </label>
        <div className="vello-scrollbar-hidden mt-3 flex gap-2 overflow-x-auto pb-1">
          {[
            ["all", "Todos"],
            ["available", "Disponíveis"],
            ["reserved", "Reservados"],
            ["sold", "Vendidos"],
            ["rented", "Alugados"],
          ].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setStatus(v)}
              className={`h-11 whitespace-nowrap rounded-full border px-4 font-body text-sm ${status === v ? "border-ink bg-ink text-paper" : "border-line bg-white text-ash"}`}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-6 font-mono text-xs text-stone">
        {filtered.length} imóveis
      </p>
      {filtered.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <PropertyCard
              key={p.id}
              property={p}
              catalogSlug={profile.slug}
              onEdit={() => go(`/dashboard/imoveis/${p.id}`)}
              onDelete={() => setRemove(p)}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="Nenhum imóvel encontrado."
          text="Tente outro filtro ou adicione um novo imóvel."
          action="Adicionar imóvel"
          onAction={() => go("/dashboard/imoveis/novo")}
        />
      )}
      {remove && (
        <Dialog
          title="Excluir este imóvel?"
          text="Essa ação não poderá ser desfeita."
          confirm="Excluir imóvel"
          danger
          onClose={() => setRemove(null)}
          onConfirm={async () => {
            await deleteProperty(remove.id);
            toast("Imóvel excluído");
            setRemove(null);
            refresh();
          }}
        />
      )}
    </>
  );
}

function PropertyEditor({
  user,
  property,
  toast,
  refresh,
}: {
  user: User;
  property?: Property;
  toast: (s: string) => void;
  refresh: () => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<Property>>(
    property || {
      title: "",
      description: "",
      transaction_type: "sale",
      property_type: "Apartamento",
      price: 0,
      city: "",
      neighborhood: "",
      bedrooms: 0,
      suites: 0,
      bathrooms: 0,
      parking_spaces: 0,
      area: 0,
      features: [],
      status: "available",
      publication_status: "published",
      show_full_address: false,
    },
  );
  const [images, setImages] = useState<Array<{ url: string; id?: string }>>(
    (property?.property_images || []).map((i) => ({
      url: i.image_url,
      id: i.id,
    })),
  );
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const update = (key: keyof Property, value: unknown) =>
    setForm((f) => ({ ...f, [key]: value }));
  const upload = async (files: FileList | null) => {
    if (!files) return;
    try {
      const urls = await uploadPropertyImages(
        user.id,
        files,
        12 - images.length,
      );
      setImages((old) => [...old, ...urls.map((url) => ({ url }))]);
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar as fotos.",
      );
    }
  };
  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= images.length) return;
    setImages((current) => {
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };
  const save = async () => {
    if (!form.title || !form.city || !form.neighborhood) {
      toast("Preencha título, cidade e bairro");
      return;
    }
    setSaving(true);
    try {
      const id = await saveProperty(user.id, form, images);
      toast(
        form.publication_status === "draft" ? "Rascunho salvo" : "Imóvel salvo",
      );
      await refresh();
      go(`/dashboard/imoveis/${id}`);
    } catch {
      toast("Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <button
        onClick={() => go("/dashboard/imoveis")}
        className="mb-7 inline-flex items-center gap-1 font-body text-sm text-ash"
      >
        <ChevronLeft size={16} /> Imóveis
      </button>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            {property ? "Editar imóvel" : "Novo imóvel"}
          </h1>
          <p className="mt-2 font-body text-ash">
            {property
              ? "Atualize as informações que aparecem no catálogo."
              : "Cadastre tudo em poucos minutos."}
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? (
            <LoaderCircle className="animate-spin" size={16} />
          ) : (
            <Check size={16} />
          )}{" "}
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </header>
      <div className="mt-9 grid gap-7 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-[24px] border border-line bg-white p-5 sm:p-6">
            <p className="font-display text-xl font-semibold">Fotos</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(e) => upload(e.target.files)}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-4 flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-cream/40 font-body text-sm text-ash hover:border-ink"
            >
              <ImagePlus size={23} />
              <span className="mt-2">Adicionar fotos</span>
            </button>
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((image, i) => (
                  <div
                    key={image.url}
                    className="relative aspect-square overflow-hidden rounded-xl"
                  >
                    <img
                      src={image.url}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() =>
                        setImages((xs) => xs.filter((_, n) => n !== i))
                      }
                      className="absolute right-1 top-1 rounded-full bg-white p-1.5"
                    >
                      <X size={13} />
                    </button>
                    <div className="absolute bottom-1 right-1 flex gap-1">
                      <button
                        type="button"
                        aria-label="Mover foto para trás"
                        disabled={i === 0}
                        onClick={() => moveImage(i, i - 1)}
                        className="rounded-full bg-white p-1.5 text-ink shadow disabled:opacity-40"
                      >
                        <ArrowUp size={12} />
                      </button>
                      <button
                        type="button"
                        aria-label="Mover foto para frente"
                        disabled={i === images.length - 1}
                        onClick={() => moveImage(i, i + 1)}
                        className="rounded-full bg-white p-1.5 text-ink shadow disabled:opacity-40"
                      >
                        <ArrowDown size={12} />
                      </button>
                    </div>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-ink px-1.5 py-1 font-mono text-[9px] text-paper">
                        CAPA
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="rounded-[24px] border border-line bg-white p-5 sm:p-6">
            <p className="font-display text-xl font-semibold">Informações</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="Título"
                value={form.title || ""}
                onChange={(v) => update("title", v)}
                className="sm:col-span-2"
              />
              <SelectField
                label="Finalidade"
                value={form.transaction_type || "sale"}
                onChange={(v) => update("transaction_type", v)}
                options={[
                  ["sale", "Venda"],
                  ["rent", "Aluguel"],
                ]}
              />
              <Field
                label="Tipo"
                value={form.property_type || ""}
                onChange={(v) => update("property_type", v)}
              />
              <Field
                label="Preço"
                type="number"
                value={String(form.price || "")}
                onChange={(v) => update("price", Number(v))}
              />
              <SelectField
                label="Status comercial"
                value={form.status || "available"}
                onChange={(v) => update("status", v)}
                options={Object.entries(statusLabel)}
              />
              <Field
                label="Cidade"
                value={form.city || ""}
                onChange={(v) => update("city", v)}
              />
              <Field
                label="Bairro"
                value={form.neighborhood || ""}
                onChange={(v) => update("neighborhood", v)}
              />
              <Field
                label="Endereço"
                value={form.address || ""}
                onChange={(v) => update("address", v)}
                className="sm:col-span-2"
              />
            </div>
          </section>
        </div>
        <aside className="space-y-6">
          <section className="rounded-[24px] border border-line bg-white p-5">
            <p className="font-display text-xl font-semibold">
              Características
            </p>
            <div className="mt-5 grid grid-cols-2 gap-3">
              {[
                ["bedrooms", "Quartos"],
                ["suites", "Suítes"],
                ["bathrooms", "Banheiros"],
                ["parking_spaces", "Vagas"],
                ["area", "Área m²"],
              ].map(([key, label]) => (
                <Field
                  key={key}
                  label={label}
                  type="number"
                  value={String(form[key as keyof Property] || "")}
                  onChange={(v) => update(key as keyof Property, Number(v))}
                />
              ))}
            </div>
          </section>
          <section className="rounded-[24px] border border-line bg-white p-5">
            <label className="font-body text-sm font-semibold">Descrição</label>
            <textarea
              value={form.description || ""}
              onChange={(e) => update("description", e.target.value)}
              className="mt-3 min-h-40 w-full rounded-xl border border-line p-3 font-body text-sm outline-none focus:border-ink"
              placeholder="Conte os principais diferenciais deste imóvel..."
            />
            <label className="mt-4 flex items-center justify-between font-body text-sm">
              Publicar no catálogo
              <input
                type="checkbox"
                checked={form.publication_status === "published"}
                onChange={(e) =>
                  update(
                    "publication_status",
                    e.target.checked ? "published" : "draft",
                  )
                }
                className="h-4 w-4 accent-black"
              />
            </label>
          </section>
        </aside>
      </div>
    </>
  );
}
function Field({
  label,
  value,
  onChange,
  className = "",
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  type?: string;
}) {
  return (
    <label className={className}>
      <span className="mb-3 block font-body text-[11px] font-medium uppercase tracking-[0.08em] text-ash">
        {label}
      </span>
      <input
        type={type}
        inputMode={type === "number" ? "numeric" : undefined}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-line px-3 font-body text-sm outline-none focus:border-ink"
      />
    </label>
  );
}
function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[][];
}) {
  return (
    <label>
      <span className="mb-3 block font-body text-[11px] font-medium uppercase tracking-[0.08em] text-ash">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-xl border border-line bg-white px-3 font-body text-sm outline-none"
      >
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </label>
  );
}

function formatServicePrice(service: Pick<Service, "price_type" | "price">) {
  if (service.price_type === "on_request") return "Sob consulta";
  const price = brlCents(service.price);
  return service.price_type === "from" ? `A partir de ${price}` : price;
}

function appointmentTime(value: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function EsteticaHomePage({
  profile,
  services,
  appointments,
}: {
  profile: Profile;
  services: Service[];
  appointments: Appointment[];
}) {
  const first = profile.professional_name?.split(" ")[0] || "profissional";
  const today = new Date().toISOString().slice(0, 10);
  const todaysAppointments = appointments.filter((appointment) =>
    appointment.starts_at.startsWith(today),
  );
  const published = services.filter(
    (service) => service.publication_status === "published",
  ).length;
  const pending = appointments.filter(
    (appointment) => appointment.status === "pending",
  ).length;
  const nextAppointment = appointments.find((appointment) =>
    ["pending", "confirmed"].includes(appointment.status),
  );

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-body text-sm text-ash">Boa tarde, {first}.</p>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Sua agenda e seus serviços ficam por aqui.
          </h1>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
          <a
            href={appPath("/dashboard/agenda")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-4 font-body text-sm font-semibold text-ink transition hover:border-ink"
          >
            <CalendarDays size={16} /> Ver agenda
          </a>
          <Button onClick={() => go("/dashboard/servicos/novo")}>
            <Plus size={17} /> Novo serviço
          </Button>
        </div>
      </header>

      <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          ["Serviços publicados", published],
          ["Total de serviços", services.length],
          ["Agendamentos hoje", todaysAppointments.length],
          ["Pendentes", pending],
        ].map(([label, value]) => (
          <button
            key={String(label)}
            onClick={() =>
              String(label).includes("Serviços")
                ? go("/dashboard/servicos")
                : go("/dashboard/agenda")
            }
            className="rounded-2xl border border-line bg-white p-4 text-left transition hover:border-ink"
          >
            <span className="font-mono text-[10px] uppercase tracking-wide text-stone">
              {label}
            </span>
            <b className="mt-3 block font-display text-3xl text-ink">{value}</b>
          </button>
        ))}
      </section>

      <section className="mt-12 grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-[24px] border border-line bg-white p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl font-semibold text-ink">
                Próximos horários
              </p>
              <p className="mt-1 font-body text-sm text-ash">
                O que precisa da sua atenção agora.
              </p>
            </div>
            <a
              href={appPath("/dashboard/agenda")}
              className="font-body text-sm underline underline-offset-4"
            >
              Abrir agenda
            </a>
          </div>
          {appointments.length ? (
            <div className="mt-5 divide-y divide-line">
              {appointments.slice(0, 5).map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
                  <div>
                    <p className="font-body text-sm font-semibold text-ink">
                      {appointment.client_name}
                    </p>
                    <p className="mt-1 font-body text-xs text-ash">
                      {appointment.service_title} ·{" "}
                      {appointmentTime(appointment.starts_at)}
                    </p>
                  </div>
                  <span className="rounded-full bg-cream px-3 py-1 font-mono text-[10px] uppercase tracking-wide text-stone">
                    {appointmentStatusLabel[appointment.status]}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <Empty
              title="Nenhum agendamento ainda."
              text="Quando a página pública estiver com agendamento ativo, os horários aparecem aqui."
              action="Configurar agenda"
              onAction={() => go("/dashboard/agenda")}
            />
          )}
        </div>

        <div className="rounded-[24px] bg-ink p-6 text-paper">
          <p className="font-mono text-[10px] uppercase tracking-wide text-paper/60">
            Catálogo público
          </p>
          <p className="mt-3 font-display text-2xl">
            {nextAppointment
              ? `Próximo atendimento: ${appointmentTime(nextAppointment.starts_at)}`
              : "Pronto para receber serviços."}
          </p>
          <p className="mt-2 font-body text-sm text-paper/70">
            {profile.slug
              ? publicCatalogLabel(profile.slug)
              : "Defina seu link público no perfil"}
          </p>
          <div className="mt-6 grid gap-2">
            {[
              ["Adicionar serviço", "/dashboard/servicos/novo"],
              ["Horários de atendimento", "/dashboard/agenda"],
              ["Abrir catálogo", publicCatalogUrl(profile.slug)],
            ].map(([text, href]) => (
              <button
                key={text}
                onClick={() =>
                  href.startsWith("http")
                    ? (window.location.href = href)
                    : go(href)
                }
                className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 font-body text-sm text-paper hover:bg-white/10"
              >
                {text}
                <span>→</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ServiceCard({
  service,
  onEdit,
  onDelete,
}: {
  service: Service;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article className="vello-surface group relative overflow-hidden rounded-[22px] border border-line bg-white">
      <div className="relative aspect-square overflow-hidden bg-cream">
        {serviceCover(service) ? (
          <img
            src={serviceCover(service)}
            alt={service.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="vello-card-image h-full w-full object-cover"
          />
        ) : (
          <div
            aria-label={`Imagem padrão da categoria ${serviceCategoryLabel[service.category]}`}
            role="img"
            className="h-full w-full bg-[#E8F1F8]"
            style={serviceCoverStyle(service.category)}
          />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-white/90 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-ink">
            {serviceCategoryLabel[service.category]}
          </span>
          {service.publication_status === "draft" && (
            <span className="rounded-full bg-ink/85 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-paper">
              Rascunho
            </span>
          )}
        </div>
        <button
          aria-label={`Ações para ${service.title}`}
          onClick={() => setOpen(!open)}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/90 text-ink shadow-sm"
        >
          <MoreHorizontal size={17} />
        </button>
        {open && (
          <div className="vello-popover absolute right-3 top-12 z-20 w-40 rounded-xl border border-line bg-white p-1.5 text-left shadow-[0_18px_48px_-18px_rgba(18,40,58,.28)]">
            <button
              onClick={onEdit}
              className="w-full rounded-lg px-3 py-2 text-left font-body text-sm hover:bg-cream"
            >
              Editar
            </button>
            <button
              onClick={onDelete}
              className="w-full rounded-lg px-3 py-2 text-left font-body text-sm text-red-700 hover:bg-red-50"
            >
              Excluir
            </button>
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-display text-lg font-semibold text-ink">
            {service.title}
          </h3>
          <span className="shrink-0 rounded-full border border-line px-2 py-1 font-mono text-[9px] text-stone">
            {service.duration_minutes} min
          </span>
        </div>
        <p className="mt-1 font-mono text-sm text-ink">
          {formatServicePrice(service)}
        </p>
        <p className="mt-2 line-clamp-2 min-h-10 font-body text-sm text-ash">
          {service.description || "Sem descrição cadastrada."}
        </p>
        <p className="mt-3 font-body text-xs text-ash">
          Agendamento pelo catálogo
        </p>
      </div>
    </article>
  );
}

function ServicesPage({
  services,
  refresh,
  toast,
}: {
  services: Service[];
  refresh: () => Promise<void>;
  toast: (s: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [remove, setRemove] = useState<Service | null>(null);
  const filtered = services.filter(
    (service) =>
      (category === "all" || service.category === category) &&
      `${service.title} ${service.description} ${service.category}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Serviços
          </h1>
          <p className="mt-2 font-body text-ash">
            Organize o que aparece no catálogo e o que pode ser agendado.
          </p>
        </div>
        <Button onClick={() => go("/dashboard/servicos/novo")}>
          <Plus size={17} /> Novo serviço
        </Button>
      </header>
      <div className="mt-8">
        <label className="flex h-14 w-full items-center gap-3 rounded-2xl border border-line bg-white p-1.5 pr-3 shadow-[0_8px_22px_rgba(18,40,58,.035)] transition focus-within:border-ink focus-within:shadow-[0_10px_26px_rgba(18,40,58,.07)]">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-cream text-ash">
            <Search size={18} strokeWidth={1.8} />
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Busque por serviço, descrição ou categoria"
            className="min-w-0 flex-1 bg-transparent font-body text-sm text-ink outline-none placeholder:text-stone"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label="Limpar busca"
              className="grid h-8 w-8 place-items-center rounded-full text-stone transition hover:bg-cream hover:text-ink"
            >
              <X size={16} />
            </button>
          )}
        </label>
        <div className="vello-scrollbar-hidden mt-3 flex gap-2 overflow-x-auto pb-1">
          {[["all", "Todos"], ...Object.entries(serviceCategoryLabel)].map(
            ([value, label]) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`h-11 whitespace-nowrap rounded-full border px-4 font-body text-sm ${category === value ? "border-ink bg-ink text-paper" : "border-line bg-white text-ash"}`}
              >
                {label}
              </button>
            ),
          )}
        </div>
      </div>
      <p className="mt-6 font-mono text-xs text-stone">
        {filtered.length} serviços
      </p>
      {filtered.length ? (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onEdit={() => go(`/dashboard/servicos/${service.id}`)}
              onDelete={() => setRemove(service)}
            />
          ))}
        </div>
      ) : (
        <Empty
          title="Nenhum serviço encontrado."
          text="Cadastre tratamentos, procedimentos ou atendimentos para montar o catálogo."
          action="Adicionar serviço"
          onAction={() => go("/dashboard/servicos/novo")}
        />
      )}
      {remove && (
        <Dialog
          title="Excluir este serviço?"
          text="Ele deixará de aparecer no catálogo. Agendamentos antigos continuam preservados com o nome do serviço."
          confirm="Excluir serviço"
          danger
          onClose={() => setRemove(null)}
          onConfirm={async () => {
            try {
              await deleteService(remove.id);
              toast("Serviço excluído");
              setRemove(null);
              await refresh();
            } catch {
              toast("Não foi possível excluir o serviço.");
            }
          }}
        />
      )}
    </>
  );
}

function ServiceEditor({
  user,
  service,
  toast,
  refresh,
}: {
  user: User;
  service?: Service;
  toast: (s: string) => void;
  refresh: () => Promise<void>;
}) {
  const [form, setForm] = useState<Partial<Service>>(
    service || {
      title: "",
      description: "",
      category: "facial",
      price_type: "fixed",
      price: 0,
      duration_minutes: 60,
      publication_status: "published",
      bookable: true,
      position: 0,
    },
  );
  const [images, setImages] = useState<Array<{ url: string; id?: string }>>(
    (service?.service_images || []).map((image) => ({
      url: image.image_url,
      id: image.id,
    })),
  );
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const update = (key: keyof Service, value: unknown) =>
    setForm((current) => ({ ...current, [key]: value }));
  const upload = async (files: FileList | null) => {
    if (!files) return;
    try {
      const urls = await uploadServiceImages(user.id, files, 8 - images.length);
      setImages((old) => [...old, ...urls.map((url) => ({ url }))]);
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar as fotos.",
      );
    }
  };
  const save = async () => {
    if (!form.title || !form.duration_minutes) {
      toast("Preencha nome e duração do serviço.");
      return;
    }
    if (form.price_type !== "on_request" && Number(form.price || 0) < 0) {
      toast("Informe um preço válido.");
      return;
    }
    setSaving(true);
    try {
      const id = await saveService(
        user.id,
        { ...form, bookable: true },
        images,
      );
      toast(
        form.publication_status === "draft"
          ? "Rascunho salvo"
          : "Serviço salvo",
      );
      await refresh();
      go(`/dashboard/servicos/${id}`);
    } catch {
      toast("Não foi possível salvar o serviço.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <button
        onClick={() => go("/dashboard/servicos")}
        className="mb-7 inline-flex items-center gap-1 font-body text-sm text-ash"
      >
        <ChevronLeft size={16} /> Serviços
      </button>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            {service ? "Editar serviço" : "Novo serviço"}
          </h1>
          <p className="mt-2 font-body text-ash">
            Defina o que a cliente verá e poderá agendar.
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? (
            <LoaderCircle className="animate-spin" size={16} />
          ) : (
            <Check size={16} />
          )}{" "}
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </header>
      <div className="mt-9 grid gap-7 xl:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          <section className="rounded-[24px] border border-line bg-white p-5 sm:p-6">
            <p className="font-display text-xl font-semibold">Fotos</p>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={(event) => upload(event.target.files)}
            />
            <button
              onClick={() => fileRef.current?.click()}
              className="mt-4 flex min-h-36 w-full flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-cream/40 font-body text-sm text-ash hover:border-ink"
            >
              <ImagePlus size={23} />
              <span className="mt-2">Adicionar fotos do serviço</span>
              <span className="mt-1 text-xs">
                Sem foto, usaremos uma capa da categoria.
              </span>
            </button>
            {images.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-3">
                {images.map((image, index) => (
                  <div
                    key={image.url}
                    className="relative aspect-square overflow-hidden rounded-xl"
                  >
                    <img
                      src={image.url}
                      className="h-full w-full object-cover"
                    />
                    <button
                      onClick={() =>
                        setImages((items) =>
                          items.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                      className="absolute right-1 top-1 rounded-full bg-white p-1.5"
                    >
                      <X size={13} />
                    </button>
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-ink px-1.5 py-1 font-mono text-[9px] text-paper">
                        CAPA
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
          <section className="rounded-[24px] border border-line bg-white p-5 sm:p-6">
            <p className="font-display text-xl font-semibold">Informações</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="Nome do serviço"
                value={form.title || ""}
                onChange={(value) => update("title", value)}
                className="sm:col-span-2"
              />
              <SelectField
                label="Categoria"
                value={form.category || "facial"}
                onChange={(value) => update("category", value)}
                options={Object.entries(serviceCategoryLabel)}
              />
              <Field
                label="Duração em minutos"
                type="number"
                value={String(form.duration_minutes || "")}
                onChange={(value) => update("duration_minutes", Number(value))}
              />
              <SelectField
                label="Tipo de preço"
                value={form.price_type || "fixed"}
                onChange={(value) => update("price_type", value)}
                options={[
                  ["fixed", "Preço fixo"],
                  ["from", "A partir de"],
                  ["on_request", "Sob consulta"],
                ]}
              />
              <Field
                label="Preço"
                type="number"
                value={String(form.price || "")}
                onChange={(value) => update("price", Number(value))}
              />
            </div>
            <label className="mt-5 block">
              <span className="mb-3 block font-body text-[11px] font-medium uppercase tracking-[0.08em] text-ash">
                Descrição
              </span>
              <textarea
                value={form.description || ""}
                onChange={(event) => update("description", event.target.value)}
                className="min-h-36 w-full rounded-xl border border-line p-3 font-body text-sm outline-none focus:border-ink"
                placeholder="Explique para quem é indicado, o que está incluso e qualquer cuidado importante."
              />
            </label>
          </section>
        </div>
        <aside className="space-y-6">
          <section className="rounded-[24px] border border-line bg-white p-5">
            <p className="font-display text-xl font-semibold">Publicação</p>
            <label className="mt-5 flex items-center justify-between font-body text-sm">
              Publicar no catálogo
              <input
                type="checkbox"
                checked={form.publication_status === "published"}
                onChange={(event) =>
                  update(
                    "publication_status",
                    event.target.checked ? "published" : "draft",
                  )
                }
                className="h-4 w-4 accent-black"
              />
            </label>
            <p className="mt-4 rounded-xl bg-[#E8F1F8] p-3 font-body text-xs leading-relaxed text-ash">
              Serviços publicados ficam disponíveis para agendamento direto pelo
              catálogo.
            </p>
            <Field
              label="Ordem"
              type="number"
              value={String(form.position || 0)}
              onChange={(value) => update("position", Number(value))}
              className="mt-5 block"
            />
          </section>
          <section className="rounded-[24px] bg-ink p-5 text-paper">
            <p className="font-display text-xl font-semibold">Prévia</p>
            <p className="mt-4 font-body text-sm text-paper/70">
              {form.title || "Nome do serviço"}
            </p>
            <p className="mt-2 font-mono text-sm">
              {formatServicePrice({
                price_type: form.price_type || "fixed",
                price: form.price ?? null,
              })}
            </p>
            <p className="mt-2 font-body text-xs text-paper/60">
              {form.duration_minutes || 0} min ·{" "}
              {
                serviceCategoryLabel[
                  (form.category || "facial") as Service["category"]
                ]
              }
            </p>
          </section>
        </aside>
      </div>
    </>
  );
}

function AgendaPage({
  appointments,
  refresh,
  toast,
}: {
  appointments: Appointment[];
  refresh: () => Promise<void>;
  toast: (s: string) => void;
}) {
  const [appointmentFilter, setAppointmentFilter] = useState<
    "upcoming" | "today" | "pending" | "history"
  >("pending");
  const now = new Date();
  const calendarKey = (date: Date) =>
    `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  const todayKey = calendarKey(now);
  const isToday = (appointment: Appointment) =>
    calendarKey(new Date(appointment.starts_at)) === todayKey;
  const activeAppointments = appointments.filter((appointment) =>
    ["pending", "confirmed"].includes(appointment.status),
  );
  const pendingAppointments = appointments.filter(
    (appointment) => appointment.status === "pending",
  );
  const todayAppointments = activeAppointments.filter(isToday);
  const visibleAppointments = appointments.filter((appointment) => {
    const startsAt = new Date(appointment.starts_at);
    if (appointmentFilter === "today") return isToday(appointment);
    if (appointmentFilter === "pending")
      return appointment.status === "pending";
    if (appointmentFilter === "history")
      return (
        startsAt < now || !["pending", "confirmed"].includes(appointment.status)
      );
    return (
      startsAt >= now && ["pending", "confirmed"].includes(appointment.status)
    );
  });
  const changeStatus = async (
    appointment: Appointment,
    status: Appointment["status"],
  ) => {
    try {
      await setAppointmentStatus(appointment.id, status);
      toast("Agendamento atualizado");
      await refresh();
    } catch {
      toast("Não foi possível atualizar o agendamento.");
    }
  };
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">
            Atendimentos
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.045em]">
            Sua agenda
          </h1>
          <p className="mt-2 font-body text-ash">
            Comece confirmando pedidos e acompanhe os próximos atendimentos.
          </p>
        </div>
        <a
          href={appPath("/dashboard/configuracoes")}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 font-body text-sm font-medium text-ash transition hover:border-ink hover:text-ink"
        >
          <Settings2 size={15} /> Configurar agenda
        </a>
      </header>
      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        {[
          [
            "Para confirmar",
            pendingAppointments.length,
            pendingAppointments.length === 1
              ? "pedido aguardando sua resposta"
              : "pedidos aguardando sua resposta",
            "bg-[#FFF7E8]",
          ],
          [
            "Hoje",
            todayAppointments.length,
            todayAppointments.length === 1
              ? "atendimento agendado"
              : "atendimentos agendados",
            "bg-[#E8F1F8]",
          ],
        ].map(([label, value, detail, tone]) => (
          <div
            key={String(label)}
            className={`rounded-[20px] border border-line p-5 ${tone}`}
          >
            <p className="font-mono text-[10px] uppercase tracking-[.14em] opacity-60">
              {label}
            </p>
            <p className="mt-3 font-display text-3xl font-semibold tracking-[-.04em]">
              {value}
            </p>
            <p className="mt-1 font-body text-xs opacity-65">{detail}</p>
          </div>
        ))}
      </section>
      <div className="mt-7">
        <section className="rounded-[24px] border border-line bg-white p-5 shadow-[0_18px_45px_-38px_rgba(18,40,58,.28)] sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-2xl font-semibold tracking-[-.035em]">
                Reservas
              </p>
              <p className="mt-1 font-body text-sm text-ash">
                Confira primeiro o que precisa da sua ação.
              </p>
            </div>
          </div>
          <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
            {(
              [
                ["pending", "Para confirmar", pendingAppointments.length],
                ["today", "Hoje", todayAppointments.length],
                [
                  "upcoming",
                  "Próximas",
                  activeAppointments.filter(
                    (appointment) => new Date(appointment.starts_at) >= now,
                  ).length,
                ],
                [
                  "history",
                  "Histórico",
                  appointments.filter(
                    (appointment) =>
                      new Date(appointment.starts_at) < now ||
                      !["pending", "confirmed"].includes(appointment.status),
                  ).length,
                ],
              ] as const
            ).map(([value, label, count]) => (
              <button
                key={value}
                type="button"
                onClick={() => setAppointmentFilter(value)}
                className={`shrink-0 rounded-full border px-3 py-2 font-body text-xs font-medium transition ${appointmentFilter === value ? "border-ink bg-ink text-paper" : "border-line bg-white text-ash hover:border-ink hover:text-ink"}`}
              >
                {label} <span className="ml-1 opacity-65">{count}</span>
              </button>
            ))}
          </div>
          {visibleAppointments.length ? (
            <div className="mt-5 divide-y divide-line">
              {visibleAppointments.map((appointment) => (
                <article key={appointment.id} className="py-5 first:pt-0">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="flex min-w-0 gap-3">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#E8F1F8] font-display text-sm font-semibold text-ink">
                        {appointment.client_name.slice(0, 1).toUpperCase()}
                      </span>
                      <div className="min-w-0">
                        <p className="font-body text-sm font-semibold text-ink">
                          {appointment.client_name}
                        </p>
                        <p className="mt-1 font-body text-xs text-ash">
                          {appointment.service_title}
                        </p>
                        <p className="mt-1 font-mono text-[11px] uppercase tracking-[.06em] text-stone">
                          {appointmentTime(appointment.starts_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${appointment.status === "pending" ? "bg-[#FFF1D6] text-[#8C5A11]" : appointment.status === "confirmed" ? "bg-[#E8F1F8] text-[#245D85]" : appointment.status === "completed" ? "bg-[#E8F6ED] text-[#276541]" : "bg-cream text-stone"}`}
                    >
                      {appointmentStatusLabel[appointment.status]}
                    </span>
                  </div>
                  {appointment.client_notes && (
                    <p className="mt-3 rounded-xl bg-cream px-3 py-2 font-body text-xs leading-relaxed text-ash">
                      {appointment.client_notes}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <a
                      href={`https://wa.me/${appointment.client_whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 font-body text-xs text-ash transition hover:border-ink hover:text-ink"
                    >
                      <MessageCircle size={14} /> WhatsApp
                    </a>
                    {appointment.status === "pending" && (
                      <button
                        onClick={() => changeStatus(appointment, "confirmed")}
                        className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 font-body text-xs"
                      >
                        <Check size={14} /> Confirmar
                      </button>
                    )}
                    {["pending", "confirmed"].includes(appointment.status) && (
                      <button
                        onClick={() => changeStatus(appointment, "completed")}
                        className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 font-body text-xs"
                      >
                        <Clock3 size={14} /> Concluir
                      </button>
                    )}
                    {["pending", "confirmed"].includes(appointment.status) && (
                      <button
                        onClick={() => changeStatus(appointment, "cancelled")}
                        className="inline-flex h-9 items-center gap-1 rounded-full border border-red-200 px-3 font-body text-xs text-red-700"
                      >
                        <Ban size={14} /> Cancelar
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <Empty
              title={
                appointmentFilter === "pending"
                  ? "Nenhum pedido para confirmar."
                  : appointmentFilter === "upcoming"
                    ? "Nenhum atendimento próximo."
                    : "Nenhuma reserva nesta lista."
              }
              text={
                appointmentFilter === "pending"
                  ? "Novas reservas feitas pelo catálogo aparecerão aqui para você decidir."
                  : appointmentFilter === "upcoming"
                    ? "Assim que uma cliente reservar pelo catálogo, ela aparecerá aqui."
                    : "Use os filtros para consultar outras reservas."
              }
              action="Ver serviços"
              onAction={() => go("/dashboard/servicos")}
            />
          )}
        </section>
      </div>
    </>
  );
}

function SelectionsPage({
  selections,
  refresh,
  toast,
}: {
  selections: Selection[];
  refresh: () => Promise<void>;
  toast: (value: string) => void;
}) {
  const [remove, setRemove] = useState<Selection | null>(null);
  const [copiedSelection, setCopiedSelection] = useState<string | null>(null);
  const setStatus = async (
    selection: Selection,
    status: Selection["status"],
  ) => {
    try {
      await setSelectionStatus(selection.id, status);
      toast(status === "archived" ? "Seleção arquivada" : "Seleção reativada");
      await refresh();
    } catch {
      toast("Não foi possível atualizar a seleção.");
    }
  };
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Seleções
          </h1>
          <p className="mt-2 font-body text-ash">
            Separe os imóveis certos para cada cliente e envie tudo em um único
            link.
          </p>
        </div>
        <Button onClick={() => go("/dashboard/selecoes/nova")}>
          <Plus size={17} /> Nova seleção
        </Button>
      </header>
      {selections.length ? (
        <div className="mt-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {selections.map((s) => (
            <article
              key={s.id}
              className="flex min-h-[250px] flex-col rounded-[20px] border border-line bg-white p-5 shadow-[0_18px_45px_-38px_rgba(18,40,58,.28)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_55px_-38px_rgba(18,40,58,.34)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate font-display text-xl font-medium">
                    {s.client_name}
                  </p>
                  <p className="mt-2 font-body text-sm text-ash">
                    {s.selection_properties?.length || 0} imóveis ·{" "}
                    {dateBR(s.created_at)}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${s.status === "active" ? "bg-cream text-stone" : "bg-stone/10 text-stone"}`}
                >
                  {s.status === "active" ? "Ativa" : "Arquivada"}
                </span>
              </div>
              <div className="mt-5 rounded-[14px] border border-line bg-cream/55 px-3 py-2">
                <p className="truncate font-mono text-[11px] text-stone">
                  /selecao/{s.slug}
                </p>
              </div>
              <div className="mt-auto pt-6">
                <button
                  onClick={() => go(`/dashboard/selecoes/${s.id}`)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-4 font-body text-sm font-semibold text-paper transition hover:scale-[1.01]"
                >
                  <PencilLine size={15} /> Editar seleção
                </button>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <button
                    onClick={async () => {
                      await navigator.clipboard.writeText(
                        `${window.location.origin}${appPath(`/selecao/${s.slug}`)}`,
                      );
                      setCopiedSelection(s.id);
                      toast("Link copiado");
                      window.setTimeout(
                        () =>
                          setCopiedSelection((current) =>
                            current === s.id ? null : current,
                          ),
                        1800,
                      );
                    }}
                    className="flex h-10 items-center justify-center gap-2 rounded-full border border-line px-3 font-body text-xs font-medium transition hover:border-ink"
                  >
                    {copiedSelection === s.id ? (
                      <>
                        <Check size={14} /> Copiado
                      </>
                    ) : (
                      <>
                        <Copy size={14} /> Copiar
                      </>
                    )}
                  </button>
                  {s.client_whatsapp ? (
                    <a
                      href={`https://wa.me/${s.client_whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Oi ${s.client_name}! Separei alguns imóveis para você: ${window.location.origin}${appPath(`/selecao/${s.slug}`)}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-10 items-center justify-center gap-2 rounded-full border border-line px-3 font-body text-xs font-medium transition hover:border-ink"
                    >
                      <MessageCircle size={14} /> Enviar
                    </a>
                  ) : (
                    <button
                      onClick={() => go(`/dashboard/selecoes/${s.id}`)}
                      className="flex h-10 items-center justify-center gap-2 rounded-full border border-line px-3 font-body text-xs font-medium text-ash transition hover:border-ink hover:text-ink"
                    >
                      <Plus size={14} /> WhatsApp
                    </button>
                  )}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3">
                  <button
                    onClick={() =>
                      setStatus(
                        s,
                        s.status === "active" ? "archived" : "active",
                      )
                    }
                    className="inline-flex items-center gap-1.5 font-body text-xs text-ash hover:text-ink"
                  >
                    <Archive size={14} />{" "}
                    {s.status === "active" ? "Arquivar" : "Reativar"}
                  </button>
                  <button
                    onClick={() => setRemove(s)}
                    className="inline-flex items-center gap-1.5 font-body text-xs text-red-700"
                  >
                    <Trash2 size={14} /> Excluir
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          title="Nenhuma seleção por aqui ainda."
          text="Quando um cliente disser o que procura, monte uma seleção só para ele."
          action="Criar seleção"
          onAction={() => go("/dashboard/selecoes/nova")}
        />
      )}
      {remove && (
        <Dialog
          title="Excluir esta seleção?"
          text="O link deixará de funcionar e essa ação não poderá ser desfeita."
          confirm="Excluir seleção"
          danger
          onClose={() => setRemove(null)}
          onConfirm={async () => {
            try {
              await deleteSelection(remove.id);
              toast("Seleção excluída");
              setRemove(null);
              await refresh();
            } catch {
              toast("Não foi possível excluir a seleção.");
            }
          }}
        />
      )}
    </>
  );
}
function SelectionEditor({
  user,
  properties,
  selection,
  toast,
  refresh,
}: {
  user: User;
  properties: Property[];
  selection?: Selection;
  toast: (s: string) => void;
  refresh: () => Promise<void>;
}) {
  const initial =
    selection?.selection_properties
      ?.sort((a, b) => a.position - b.position)
      .map((x) => x.property_id) || [];
  const [name, setName] = useState(selection?.client_name || "");
  const [whats, setWhats] = useState(selection?.client_whatsapp || "");
  const [msg, setMsg] = useState(
    selection?.intro_message ||
      "Separei algumas opções que combinam com o que você procura.",
  );
  const [selected, setSelected] = useState(initial);
  const [saving, setSaving] = useState(false);
  const toggle = (id: string) =>
    setSelected((x) =>
      x.includes(id) ? x.filter((y) => y !== id) : [...x, id],
    );
  const moveSelected = (from: number, to: number) => {
    if (to < 0 || to >= selected.length) return;
    setSelected((current) => {
      const next = [...current];
      [next[from], next[to]] = [next[to], next[from]];
      return next;
    });
  };
  const save = async () => {
    if (!name || !selected.length) {
      toast("Informe o cliente e selecione ao menos um imóvel");
      return;
    }
    setSaving(true);
    try {
      const id = await saveSelection(
        user.id,
        {
          ...selection,
          client_name: name,
          client_whatsapp: whats,
          intro_message: msg,
          status: "active",
          slug: selection?.slug || "",
        },
        selected,
      );
      await refresh();
      toast(selection ? "Seleção atualizada" : "Seleção criada");
      go(selection ? `/dashboard/selecoes/${id}` : "/dashboard/selecoes");
    } catch {
      toast("Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };
  return (
    <>
      <button
        onClick={() => go("/dashboard/selecoes")}
        className="mb-7 inline-flex items-center gap-1 font-body text-sm text-ash"
      >
        <ChevronLeft size={16} /> Seleções
      </button>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="mb-3 inline-flex rounded-full border border-line bg-white px-3 py-1 font-mono text-[10px] uppercase tracking-[.12em] text-stone">
            {selection ? "Modo edição" : "Nova conversa"}
          </span>
          <h1 className="font-display text-4xl font-medium tracking-[-.04em]">
            {selection ? "Editar seleção" : "Nova seleção"}
          </h1>
          <p className="mt-2 font-body text-ash">
            Escolha os imóveis que mais combinam com o seu cliente.
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving
            ? "Salvando..."
            : selection
              ? "Salvar seleção"
              : "Criar seleção"}
        </Button>
      </header>
      <div className="mt-9 grid gap-7 xl:grid-cols-[340px_1fr]">
        <aside className="rounded-[20px] border border-line bg-white p-5 shadow-[0_18px_45px_-40px_rgba(18,40,58,.35)] sm:p-6">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-xl font-medium">
                Dados da seleção
              </p>
              <p className="mt-1 font-body text-xs leading-relaxed text-ash">
                Essas informações aparecem no link enviado ao cliente.
              </p>
            </div>
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-cream">
              <FolderHeart size={16} />
            </span>
          </div>
          <div className="space-y-5">
            <Field label="Nome do cliente" value={name} onChange={setName} />
            <Field
              label="WhatsApp · opcional"
              value={whats}
              onChange={setWhats}
            />
            <label>
              <span className="mb-3 block font-body text-[11px] font-medium uppercase tracking-[0.08em] text-ash">
                Mensagem
              </span>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="min-h-32 w-full rounded-xl border border-line p-3 font-body text-sm outline-none focus:border-ink"
              />
            </label>
          </div>
          <div className="mt-8 flex items-center justify-between rounded-[14px] bg-cream px-4 py-3">
            <span className="font-body text-sm text-ash">
              Imóveis na seleção
            </span>
            <span className="font-mono text-xs text-ink">
              {selected.length}
            </span>
          </div>
          {selected.length > 0 && (
            <div className="mt-4 border-t border-line pt-4">
              <p className="font-body text-[11px] font-medium uppercase tracking-[0.08em] text-ash">
                Ordem da seleção
              </p>
              <div className="mt-3 space-y-2">
                {selected.map((id, index) => {
                  const item = properties.find(
                    (property) => property.id === id,
                  );
                  if (!item) return null;
                  return (
                    <div
                      key={id}
                      className="flex items-center gap-2 rounded-xl border border-line bg-white px-3 py-2"
                    >
                      <span className="grid h-6 w-6 place-items-center rounded-full bg-cream font-mono text-[10px]">
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-body text-xs font-medium">
                        {item.title}
                      </span>
                      <button
                        type="button"
                        aria-label="Subir imóvel"
                        disabled={index === 0}
                        onClick={() => moveSelected(index, index - 1)}
                        className="grid h-7 w-7 place-items-center rounded-full hover:bg-cream disabled:opacity-30"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        aria-label="Descer imóvel"
                        disabled={index === selected.length - 1}
                        onClick={() => moveSelected(index, index + 1)}
                        className="grid h-7 w-7 place-items-center rounded-full hover:bg-cream disabled:opacity-30"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </aside>
        <section>
          <div className="flex items-end justify-between gap-4 border-b border-line pb-4">
            <div>
              <p className="font-display text-2xl font-medium tracking-[-.03em]">
                Escolher imóveis
              </p>
              <p className="mt-1 font-body text-sm text-ash">
                Toque nos imóveis para montar o link do cliente.
              </p>
            </div>
            <span className="shrink-0 font-mono text-[10px] uppercase tracking-[.12em] text-stone">
              {
                properties.filter((p) => p.publication_status === "published")
                  .length
              }{" "}
              publicados
            </span>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {properties
              .filter((p) => p.publication_status === "published")
              .map((p) => (
                <button
                  key={p.id}
                  onClick={() => toggle(p.id)}
                  className={`relative overflow-hidden rounded-[20px] border text-left transition ${selected.includes(p.id) ? "border-ink ring-2 ring-ink" : "border-line bg-white"}`}
                >
                  <div className="aspect-[16/9] bg-cream">
                    {cover(p) && (
                      <img
                        src={cover(p)}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="font-display font-semibold">{p.title}</p>
                    <p className="mt-1 font-mono text-sm">{brl(p.price)}</p>
                    <p className="mt-2 font-body text-xs text-ash">
                      {p.neighborhood} · {p.bedrooms} quartos
                    </p>
                  </div>
                  {selected.includes(p.id) && (
                    <span className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-ink text-paper">
                      <Check size={16} />
                    </span>
                  )}
                </button>
              ))}
          </div>
        </section>
      </div>
    </>
  );
}
function CatalogPage({
  profile,
  services,
  toast,
}: {
  profile: Profile;
  services: Service[];
  toast: (s: string) => void;
}) {
  const link = publicCatalogUrl(profile.slug);
  const published = services.filter(
    (service) => service.publication_status === "published",
  );
  return (
    <>
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">
          Página pública
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.045em]">
          Meus serviços
        </h1>
        <p className="mt-2 font-body text-ash">
          Uma página pronta para apresentar seus cuidados e receber novos
          contatos.
        </p>
      </header>
      <div className="mt-9 grid gap-7 xl:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-[26px] border border-line bg-white">
          <div className="bg-ink p-7 text-paper sm:p-8">
            <p className="font-mono text-[10px] uppercase tracking-wide text-paper/60">
              Prévia da página pública
            </p>
            <p className="mt-3 font-display text-3xl tracking-[-.04em]">
              {profile.professional_name}
            </p>
            <p className="mt-1 font-body text-sm text-paper/70">
              {[profile.neighborhood, profile.city, profile.state]
                .filter(Boolean)
                .join(" · ") || "Sua localização"}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:p-5">
            {published.slice(0, 4).map((service) => (
              <div
                key={service.id}
                className="overflow-hidden rounded-2xl border border-line bg-white"
              >
                <div className="aspect-square bg-[#E8F1F8]">
                  {serviceCover(service) ? (
                    <img
                      src={serviceCover(service)}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={serviceCoverStyle(service.category)}
                    />
                  )}
                </div>
                <div className="p-3">
                  <p className="truncate font-body text-xs font-semibold">
                    {service.title}
                  </p>
                  <p className="mt-1 font-body text-[11px] text-ash">
                    {formatServicePrice(service)} · {service.duration_minutes}{" "}
                    min
                  </p>
                </div>
              </div>
            ))}
            {!published.length && (
              <div className="col-span-2 rounded-2xl border border-dashed border-line bg-[#F7FAFC] p-8 text-center">
                <p className="font-display text-xl font-semibold">
                  Seus serviços aparecerão aqui.
                </p>
                <a
                  href={appPath("/dashboard/servicos/novo")}
                  className="mt-3 inline-flex font-body text-sm font-semibold underline underline-offset-4"
                >
                  Cadastrar primeiro serviço
                </a>
              </div>
            )}
          </div>
        </section>
        <aside className="rounded-[26px] border border-line bg-white p-6">
          <p className="font-display text-2xl font-semibold">
            Seu link público
          </p>
          <p className="mt-3 break-all font-mono text-sm text-ash">
            {publicCatalogLabel(profile.slug)}
          </p>
          <div className="mt-6 grid gap-3">
            <a
              href={appPath("/dashboard/servicos")}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-ink font-body text-sm font-semibold text-paper transition hover:scale-[1.01]"
            >
              <Sparkles size={16} /> Gerenciar serviços
            </a>
            <a
              href={link}
              target="_blank"
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-line font-body text-sm font-medium transition hover:border-ink"
            >
              <ExternalLink size={15} /> Abrir catálogo
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast("Link copiado");
              }}
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-line font-body text-sm"
            >
              <Copy size={15} /> Copiar link
            </button>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`Confira meu catálogo Vello: ${link}`)}`}
              target="_blank"
              className="flex h-11 items-center justify-center gap-2 rounded-full border border-line font-body text-sm"
            >
              <Share2 size={15} /> Compartilhar no WhatsApp
            </a>
          </div>
          <p className="mt-7 font-body text-sm text-ash">
            {published.length}{" "}
            {published.length === 1
              ? "serviço publicado"
              : "serviços publicados"}
          </p>
        </aside>
      </div>
    </>
  );
}
function ProfilePage({
  user,
  profile,
  businessHours,
  refresh,
  toast,
  initialView = "identity",
  settingsMode = false,
  fixedView = false,
}: {
  user: User;
  profile: Profile;
  businessHours: BusinessHour[];
  refresh: () => Promise<void>;
  toast: (s: string) => void;
  initialView?: "identity" | "public" | "availability" | "security";
  settingsMode?: boolean;
  fixedView?: boolean;
}) {
  const [form, setForm] = useState(profile);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const profileView = initialView;
  const [hours, setHours] = useState(() =>
    weekdays.map((_, weekday) => {
      const found = businessHours.find((hour) => hour.weekday === weekday);
      return {
        weekday,
        enabled: Boolean(found),
        start_time: found?.start_time?.slice(0, 5) || "09:00",
        end_time: found?.end_time?.slice(0, 5) || "18:00",
      };
    }),
  );
  const [bookingSettings, setBookingSettings] = useState({
    booking_enabled: profile.booking_enabled ?? true,
    booking_auto_confirm: profile.booking_auto_confirm ?? true,
    booking_slot_minutes: String(profile.booking_slot_minutes || 30),
    booking_min_notice_minutes: String(
      profile.booking_min_notice_minutes || 120,
    ),
    booking_max_days_ahead: String(profile.booking_max_days_ahead || 60),
  });
  const [availabilitySaving, setAvailabilitySaving] = useState(false);
  const avatarInput = useRef<HTMLInputElement>(null);
  const save = async () => {
    setSaving(true);
    try {
      await saveProfile(user.id, form);
      toast("Alterações salvas");
    } catch {
      toast("Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };
  const changePassword = async () => {
    if (newPassword.length < 8) {
      toast("Use uma senha com pelo menos 8 caracteres.");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast("As senhas não coincidem.");
      return;
    }
    setPasswordSaving(true);
    try {
      await updatePassword(newPassword);
      setNewPassword("");
      setConfirmPassword("");
      toast("Senha atualizada");
    } catch {
      toast("Não foi possível atualizar a senha.");
    } finally {
      setPasswordSaving(false);
    }
  };
  const changeAvatar = async (file?: File) => {
    if (!file) return;
    setAvatarSaving(true);
    try {
      const avatarUrl = await uploadAvatar(user.id, file);
      await saveProfile(user.id, { avatar_url: avatarUrl });
      setForm((current) => ({ ...current, avatar_url: avatarUrl }));
      toast("Foto atualizada");
    } catch (error) {
      toast(
        error instanceof Error
          ? error.message
          : "Não foi possível enviar a foto.",
      );
    } finally {
      setAvatarSaving(false);
    }
  };
  const saveAvailability = async () => {
    const selected = hours
      .filter((hour) => hour.enabled)
      .map((hour) => ({
        weekday: hour.weekday,
        start_time: hour.start_time,
        end_time: hour.end_time,
      }));
    if (selected.some((hour) => hour.end_time <= hour.start_time)) {
      toast("O horário final precisa ser maior que o inicial.");
      return;
    }
    setAvailabilitySaving(true);
    try {
      await saveProfile(user.id, {
        booking_enabled: true,
        booking_auto_confirm: bookingSettings.booking_auto_confirm,
        booking_slot_minutes: Number(bookingSettings.booking_slot_minutes),
        booking_min_notice_minutes: Number(
          bookingSettings.booking_min_notice_minutes,
        ),
        booking_max_days_ahead: Number(bookingSettings.booking_max_days_ahead),
      });
      await replaceBusinessHours(user.id, selected);
      await refresh();
      toast("Disponibilidade salva");
    } catch {
      toast("Não foi possível salvar a disponibilidade.");
    } finally {
      setAvailabilitySaving(false);
    }
  };
  return (
    <>
      <header>
        <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">
          Sua estética
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.045em]">
          {settingsMode ? "Configurações" : "Perfil"}
        </h1>
        <p className="mt-2 font-body text-ash">
          {settingsMode
            ? "Defina sua disponibilidade, as regras das reservas e a segurança da conta."
            : "Seus dados e as informações que aparecem para clientes no catálogo."}
        </p>
      </header>
      <section className="mt-7 max-w-3xl rounded-[24px] border border-line bg-white p-5 sm:p-7">
        {profileView === "identity" && (
          <>
            <div className="flex items-center gap-4 border-b border-line pb-7">
              <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-cream font-display text-xl">
                {form.avatar_url ? (
                  <img
                    src={form.avatar_url}
                    alt="Foto do perfil"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={appPath("/vello-logo.png")}
                    alt="Logo Vello"
                    className="h-10 w-10 object-contain"
                  />
                )}
              </span>
              <span>
                <b className="block font-body text-sm">Foto de perfil</b>
                <span className="mt-1 block font-body text-xs text-ash">
                  Use uma foto sua, da equipe ou da fachada. JPG, PNG ou WebP ·
                  até 5 MB.
                </span>
                <input
                  ref={avatarInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(event) => changeAvatar(event.target.files?.[0])}
                />
                <button
                  type="button"
                  disabled={avatarSaving}
                  onClick={() => avatarInput.current?.click()}
                  className="mt-3 inline-flex items-center gap-1.5 font-body text-sm font-semibold underline underline-offset-4 disabled:opacity-50"
                >
                  <ImagePlus size={15} />{" "}
                  {avatarSaving
                    ? "Enviando..."
                    : form.avatar_url
                      ? "Trocar foto"
                      : "Adicionar foto"}
                </button>
              </span>
            </div>
            <div className="mb-7 rounded-2xl bg-[#E8F1F8] p-4">
              <p className="font-body text-sm font-semibold text-ink">
                Qual é o seu negócio?
              </p>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {(
                  [
                    [
                      "autonoma",
                      "Profissional autônoma",
                      "Você atende por conta própria.",
                    ],
                    [
                      "clinica",
                      "Clínica ou espaço",
                      "Você representa um local de atendimento.",
                    ],
                  ] as const
                ).map(([value, label, detail]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() =>
                      setForm((current) => ({
                        ...current,
                        business_type: value,
                      }))
                    }
                    className={`rounded-xl border p-3 text-left transition ${form.business_type === value || (!form.business_type && value === "autonoma") ? "border-ink bg-white ring-1 ring-ink" : "border-transparent bg-white/60 hover:border-[#7EAFD0]"}`}
                  >
                    <b className="block font-body text-sm">{label}</b>
                    <span className="mt-1 block font-body text-xs text-ash">
                      {detail}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
        <div className="grid gap-5 sm:grid-cols-2">
          {profileView === "identity" && (
            <Field
              label="Nome da estética ou profissional"
              value={form.professional_name || ""}
              onChange={(v) => setForm((x) => ({ ...x, professional_name: v }))}
            />
          )}
          {profileView === "identity" && (
            <Field
              label="WhatsApp"
              value={form.whatsapp || ""}
              onChange={(v) => setForm((x) => ({ ...x, whatsapp: v }))}
            />
          )}
          {profileView === "identity" && (
            <div className="mt-2 border-t border-line pt-5 sm:col-span-2">
              <p className="font-display text-lg font-semibold">
                Página pública
              </p>
              <p className="mt-1 font-body text-sm text-ash">
                Esses dados aparecem para clientes no seu catálogo.
              </p>
            </div>
          )}
          {profileView === "identity" && (
            <Field
              label="Cidade"
              value={form.city || ""}
              onChange={(v) => setForm((x) => ({ ...x, city: v }))}
            />
          )}
          {profileView === "identity" && (
            <Field
              label="Estado"
              value={form.state || ""}
              onChange={(v) =>
                setForm((x) => ({ ...x, state: v.toUpperCase().slice(0, 2) }))
              }
            />
          )}
          {profileView === "identity" && (
            <Field
              label="Bairro"
              value={form.neighborhood || ""}
              onChange={(v) => setForm((x) => ({ ...x, neighborhood: v }))}
            />
          )}
          {profileView === "identity" && (
            <Field
              label="Instagram"
              value={form.instagram || ""}
              onChange={(v) => setForm((x) => ({ ...x, instagram: v }))}
            />
          )}
          {profileView === "identity" && (
            <Field
              label="Link Vello"
              value={form.slug || ""}
              onChange={(v) => setForm((x) => ({ ...x, slug: slugify(v) }))}
            />
          )}
        </div>
        {profileView === "identity" && (
          <>
            <label className="mt-5 block">
              <span className="mb-3 block font-body text-[11px] font-medium uppercase tracking-[.08em] text-ash">
                Endereço do atendimento
              </span>
              <input
                value={form.address || ""}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    address: event.target.value,
                  }))
                }
                placeholder="Rua, número, complemento"
                className="h-11 w-full rounded-xl border border-line px-3 font-body text-sm outline-none transition focus:border-ink"
              />
              <span className="mt-2 block font-body text-xs text-ash">
                O endereço completo só aparece na página pública se você
                autorizar abaixo.
              </span>
            </label>
            <label className="mt-5 block">
              <span className="mb-3 block font-display text-xs font-extrabold uppercase">
                Sobre seu atendimento
              </span>
              <textarea
                value={form.bio || ""}
                onChange={(e) =>
                  setForm((x) => ({ ...x, bio: e.target.value }))
                }
                className="min-h-28 w-full rounded-xl border border-line p-3 font-body text-sm"
                placeholder="Conte brevemente sobre sua especialidade e sua forma de atender..."
              />
            </label>
            <div className="mt-6 border-t border-line pt-6">
              <p className="font-display text-lg font-semibold">
                O que aparece na sua página
              </p>
              <p className="mt-1 font-body text-sm text-ash">
                Você mantém o controle sobre as informações visíveis para
                clientes.
              </p>
              <label className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3 font-body text-sm">
                <span>
                  <b className="block">Mostrar Instagram</b>
                  <small className="mt-1 block text-xs text-ash">
                    Exibe um atalho para seu perfil.
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={form.show_instagram}
                  onChange={(e) =>
                    setForm((x) => ({ ...x, show_instagram: e.target.checked }))
                  }
                />
              </label>
              <label className="mt-3 flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3 font-body text-sm">
                <span>
                  <b className="block">Mostrar endereço completo</b>
                  <small className="mt-1 block text-xs text-ash">
                    Se desligado, mostramos apenas cidade e bairro.
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={form.show_address ?? false}
                  onChange={(e) =>
                    setForm((x) => ({ ...x, show_address: e.target.checked }))
                  }
                />
              </label>
              <div className="mt-5 rounded-xl bg-cream p-4 font-body text-sm text-ash">
                Horários e regras de reserva ficam em{" "}
                <a
                  href={appPath("/dashboard/configuracoes")}
                  className="font-semibold text-ink underline underline-offset-4"
                >
                  Configurações
                </a>
                .{" "}
                <a
                  href={publicCatalogUrl(form.slug)}
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 font-semibold text-ink underline underline-offset-4"
                >
                  Abrir minha página
                </a>
                .
              </div>
            </div>
          </>
        )}
        {profileView === "identity" && (
          <Button onClick={save} disabled={saving} className="mt-7">
            {saving ? "Salvando..." : "Salvar alterações"}
          </Button>
        )}
        {fixedView && !settingsMode && profileView === "identity" && (
          <a
            href={appPath("/dashboard/configuracoes")}
            className="mt-7 flex items-center justify-between gap-4 rounded-2xl border border-line bg-[#F7FAFC] p-4 transition hover:border-ink"
          >
            <span>
              <b className="block font-body text-sm">Configurações</b>
              <span className="mt-1 block font-body text-xs text-ash">
                Disponibilidade, reservas e segurança.
              </span>
            </span>
            <Settings2 size={18} className="shrink-0 text-ash" />
          </a>
        )}
        {(profileView === "availability" || settingsMode) && (
          <section>
            {settingsMode && (
              <a
                href={appPath("/dashboard/catalogo")}
                className="mb-7 flex items-center justify-between gap-4 rounded-2xl border border-line bg-[#F7FAFC] p-4 transition hover:border-ink"
              >
                <span>
                  <b className="block font-body text-sm">Meu catálogo</b>
                  <span className="mt-1 block font-body text-xs text-ash">
                    Abra, copie ou compartilhe seu link.
                  </span>
                </span>
                <ExternalLink size={18} className="shrink-0 text-ash" />
              </a>
            )}
            <p className="font-display text-xl font-semibold">
              Agenda e reservas
            </p>
            <p className="mt-1 font-body text-sm text-ash">
              Escolha quando clientes podem reservar e como cada reserva é
              confirmada.
            </p>
            <div className="mt-5 space-y-3">
              {hours.map((hour, index) => (
                <div
                  key={hour.weekday}
                  className="grid gap-3 rounded-2xl border border-line p-3 sm:grid-cols-[1fr_120px_120px]"
                >
                  <label className="flex items-center gap-3 font-body text-sm font-semibold">
                    <input
                      type="checkbox"
                      checked={hour.enabled}
                      onChange={(event) =>
                        setHours((current) =>
                          current.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, enabled: event.target.checked }
                              : item,
                          ),
                        )
                      }
                      className="h-4 w-4 accent-black"
                    />
                    {weekdays[hour.weekday]}
                  </label>
                  <input
                    type="time"
                    value={hour.start_time}
                    disabled={!hour.enabled}
                    onChange={(event) =>
                      setHours((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, start_time: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="h-11 rounded-xl border border-line px-3 font-body text-sm disabled:opacity-45"
                  />
                  <input
                    type="time"
                    value={hour.end_time}
                    disabled={!hour.enabled}
                    onChange={(event) =>
                      setHours((current) =>
                        current.map((item, itemIndex) =>
                          itemIndex === index
                            ? { ...item, end_time: event.target.value }
                            : item,
                        ),
                      )
                    }
                    className="h-11 rounded-xl border border-line px-3 font-body text-sm disabled:opacity-45"
                  />
                </div>
              ))}
            </div>
            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              <Field
                label="Intervalo (minutos)"
                type="number"
                value={bookingSettings.booking_slot_minutes}
                onChange={(value) =>
                  setBookingSettings((current) => ({
                    ...current,
                    booking_slot_minutes: value,
                  }))
                }
              />
              <Field
                label="Aviso mínimo (minutos)"
                type="number"
                value={bookingSettings.booking_min_notice_minutes}
                onChange={(value) =>
                  setBookingSettings((current) => ({
                    ...current,
                    booking_min_notice_minutes: value,
                  }))
                }
              />
              <Field
                label="Agenda aberta (dias)"
                type="number"
                value={bookingSettings.booking_max_days_ahead}
                onChange={(value) =>
                  setBookingSettings((current) => ({
                    ...current,
                    booking_max_days_ahead: value,
                  }))
                }
              />
            </div>
            <div className="mt-6 border-t border-line pt-6">
              <p className="rounded-2xl bg-[#E8F1F8] p-4 font-body text-sm text-ash">
                <b className="block text-ink">Agendamento pelo catálogo</b>
                <span className="mt-1 block text-xs">
                  Clientes escolhem serviço, dia e horário diretamente na sua
                  página Vello.
                </span>
              </p>
              <label className="mt-3 flex items-center justify-between gap-4 rounded-2xl border border-line bg-cream/45 p-4 font-body text-sm">
                <span>
                  <b className="block">Confirmar automaticamente</b>
                  <small className="mt-1 block text-xs text-ash">
                    Caso desligado, cada reserva fica pendente até sua
                    confirmação.
                  </small>
                </span>
                <input
                  type="checkbox"
                  checked={bookingSettings.booking_auto_confirm}
                  onChange={(event) =>
                    setBookingSettings((current) => ({
                      ...current,
                      booking_auto_confirm: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 accent-black"
                />
              </label>
            </div>
            <Button
              onClick={saveAvailability}
              disabled={availabilitySaving}
              className="mt-7"
            >
              {availabilitySaving ? "Salvando..." : "Salvar disponibilidade"}
            </Button>
          </section>
        )}
        {(profileView === "security" || settingsMode) && (
          <section className="mt-10 border-t border-line pt-8">
            <p className="font-display text-xl font-semibold">Segurança</p>
            <p className="mt-1 font-body text-sm text-ash">
              Atualize a senha de acesso quando precisar.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field
                label="Nova senha"
                type="password"
                value={newPassword}
                onChange={setNewPassword}
              />
              <Field
                label="Confirmar nova senha"
                type="password"
                value={confirmPassword}
                onChange={setConfirmPassword}
              />
            </div>
            <button
              type="button"
              disabled={passwordSaving || !newPassword}
              onClick={changePassword}
              className="mt-4 h-10 rounded-full border border-line px-4 font-body text-sm font-medium transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {passwordSaving ? "Atualizando..." : "Atualizar senha"}
            </button>
          </section>
        )}
        {(profileView === "security" || settingsMode) && (
          <button
            onClick={async () => {
              await signOut();
              go("/login");
            }}
            className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-red-200 font-body text-sm font-medium text-red-700 md:hidden"
          >
            <LogOut size={16} /> Sair da conta
          </button>
        )}
      </section>
    </>
  );
}
function CatalogCustomizationPage({
  user,
  profile,
  properties,
  toast,
}: {
  user: User;
  profile: Profile;
  properties: Property[];
  toast: (value: string) => void;
}) {
  const defaultTheme: CatalogTheme = {
    palette: "warm",
    property_style: "editorial",
    profile_band: "light",
  };
  const [savedTheme, setSavedTheme] = useState<CatalogTheme>(
    profile.catalog_theme || defaultTheme,
  );
  const [theme, setTheme] = useState<CatalogTheme>(
    profile.catalog_theme || defaultTheme,
  );
  const [saving, setSaving] = useState(false);
  const hasChanges = JSON.stringify(theme) !== JSON.stringify(savedTheme);
  const update = <K extends keyof CatalogTheme>(
    key: K,
    value: CatalogTheme[K],
  ) => setTheme((current) => ({ ...current, [key]: value }));
  const save = async () => {
    setSaving(true);
    try {
      await saveProfile(user.id, { catalog_theme: theme });
      setSavedTheme(theme);
      toast("Personalização salva");
    } catch {
      toast("Não foi possível salvar.");
    } finally {
      setSaving(false);
    }
  };
  const property = properties[0];
  const pageColor =
    theme.background_color ||
    { warm: "#EFF5FA", paper: "#ffffff", charcoal: "#191918" }[theme.palette];
  const bandColor =
    theme.profile_color ||
    { light: "#ffffff", contrast: "#E3EDF5", dark: "#12283A" }[
      theme.profile_band
    ];
  const surface =
    theme.palette === "charcoal"
      ? "bg-[#191918] text-paper"
      : theme.palette === "paper"
        ? "bg-white text-ink"
        : "bg-[#EFF5FA] text-ink";
  const band =
    theme.profile_band === "dark"
      ? "bg-ink text-paper border-white/10"
      : theme.profile_band === "contrast"
        ? "bg-[#E3EDF5] text-ink border-[#d7d0c4]"
        : "bg-white text-ink border-black/10";
  const cardMode = theme.property_style;
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">
            Seu catálogo
          </p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.045em]">
            Personalizar aparência
          </h1>
          <p className="mt-2 max-w-xl font-body text-ash">
            Escolha o estilo dos imóveis e depois a cor. Uma decisão não altera
            a outra.
          </p>
        </div>
        <a
          href={publicCatalogUrl(profile.slug)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 font-body text-sm font-medium hover:border-ink"
        >
          <ExternalLink size={16} />
          Abrir catálogo
        </a>
      </header>
      <div className="mt-6 rounded-2xl border border-line bg-[#EFF5FA] px-5 py-4 font-body text-sm text-ash">
        <span className="font-semibold text-ink">Como funciona:</span> estilo
        define o formato dos cards; cor define o fundo e a identidade visual.
      </div>
      <div className="mt-9 grid items-start gap-8 xl:grid-cols-[minmax(0,.9fr)_minmax(430px,1.1fr)]">
        <div className="space-y-5">
          <section className="rounded-[24px] border border-line bg-white p-5 sm:p-7">
            <p className="font-display text-xl font-semibold">
              1. Estilo do catálogo
            </p>
            <p className="mt-1 font-body text-sm text-ash">
              Escolha entre cards em grade ou uma lista de serviços mais direta.
            </p>
            <div className="mt-5 space-y-2">
              {(
                [
                  [
                    "editorial",
                    "Editorial",
                    "Card claro: informações organizadas abaixo da foto.",
                  ],
                  [
                    "classic",
                    "Lista",
                    "Uma lista clara, com foto à esquerda e decisão rápida.",
                  ],
                ] as const
              ).map(([value, label, description], optionIndex) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={theme.property_style === value}
                  onClick={() => update("property_style", value)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition duration-200 active:scale-[.99] ${theme.property_style === value ? "border-ink bg-cream ring-1 ring-ink" : "border-line hover:border-stone"}`}
                >
                  <span
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-mono text-xs ${theme.property_style === value ? "bg-ink text-paper" : "bg-cream text-stone"}`}
                  >
                    0{optionIndex + 1}
                  </span>
                  <span className="min-w-0">
                    <b className="block font-body text-sm">{label}</b>
                    <span className="mt-1 block font-body text-xs text-ash">
                      {description}
                    </span>
                  </span>
                  <Check
                    size={16}
                    className={`ml-auto shrink-0 ${theme.property_style === value ? "text-ink" : "text-transparent"}`}
                  />
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-[24px] border border-line bg-white p-5 sm:p-7">
            <p className="font-display text-xl font-semibold">
              2. Cor do catálogo
            </p>
            <p className="mt-1 font-body text-sm text-ash">
              Agora escolha o fundo. A cor é independente do estilo dos imóveis.
            </p>
            <label className="mt-5 flex items-center justify-between rounded-2xl border border-line bg-cream p-4 transition hover:border-ink">
              <span>
                <b className="block font-display text-lg">Cor personalizada</b>
                <span className="mt-1 block font-body text-xs text-ash">
                  Escolha livremente o fundo do catálogo.
                </span>
                <small className="mt-2 block font-mono text-[11px] uppercase tracking-[.1em] text-stone">
                  {pageColor}
                </small>
              </span>
              <input
                aria-label="Escolher cor de fundo"
                type="color"
                value={pageColor}
                onChange={(event) =>
                  update("background_color", event.target.value)
                }
                className="h-14 w-14 cursor-pointer rounded-xl border border-black/15 bg-transparent p-1"
              />
            </label>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[.14em] text-stone">
              Paletas prontas
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {(
                [
                  ["warm", "Areia", "Equilíbrio quente.", "bg-[#EFF5FA]"],
                  ["paper", "Claro", "Minimalista e luminoso.", "bg-white"],
                  ["charcoal", "Noite", "Sofisticado e marcante.", "bg-ink"],
                ] as const
              ).map(([value, label, description, swatch]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={
                    theme.palette === value && !theme.background_color
                  }
                  onClick={() =>
                    setTheme((current) => ({
                      ...current,
                      palette: value,
                      background_color: undefined,
                    }))
                  }
                  className={`rounded-2xl border p-3 text-left transition duration-200 active:scale-[.99] ${theme.palette === value && !theme.background_color ? "border-ink ring-1 ring-ink" : "border-line hover:border-stone"}`}
                >
                  <span
                    className={`block h-14 rounded-xl border border-black/10 ${swatch}`}
                  />
                  <b className="mt-3 block font-body text-sm">{label}</b>
                  <span className="mt-1 block font-body text-[11px] leading-relaxed text-ash">
                    {description}
                  </span>
                </button>
              ))}
            </div>
          </section>
          <section className="rounded-[24px] border border-line bg-white p-5 sm:p-7">
            <p className="font-display text-xl font-semibold">
              3. Cabeçalho do perfil
            </p>
            <p className="mt-1 font-body text-sm text-ash">
              Personalize apenas a faixa com seu nome e CRECI.
            </p>
            <label className="mt-5 flex items-center justify-between rounded-2xl border border-line bg-cream p-4 transition hover:border-ink">
              <span>
                <b className="block font-display text-lg">Cor personalizada</b>
                <span className="mt-1 block font-body text-xs text-ash">
                  Escolha a cor da sua apresentação.
                </span>
                <small className="mt-2 block font-mono text-[11px] uppercase tracking-[.1em] text-stone">
                  {bandColor}
                </small>
              </span>
              <input
                aria-label="Escolher cor do cabeçalho do perfil"
                type="color"
                value={bandColor}
                onChange={(event) =>
                  update("profile_color", event.target.value)
                }
                className="h-14 w-14 cursor-pointer rounded-xl border border-black/15 bg-transparent p-1"
              />
            </label>
            <p className="mt-6 font-mono text-[10px] uppercase tracking-[.14em] text-stone">
              Cores prontas
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {(
                [
                  ["light", "Leve", "bg-white text-ink"],
                  ["contrast", "Areia", "bg-[#E3EDF5] text-ink"],
                  ["dark", "Escuro", "bg-ink text-paper"],
                ] as const
              ).map(([value, label, appearance]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={
                    theme.profile_band === value && !theme.profile_color
                  }
                  onClick={() =>
                    setTheme((current) => ({
                      ...current,
                      profile_band: value,
                      profile_color: undefined,
                    }))
                  }
                  className={`rounded-2xl border p-3 text-left transition duration-200 active:scale-[.99] ${theme.profile_band === value && !theme.profile_color ? "border-ink ring-1 ring-ink" : "border-line hover:border-stone"}`}
                >
                  <span
                    className={`flex h-12 items-center rounded-xl px-3 font-body text-[10px] font-semibold ${appearance}`}
                  >
                    {profile.professional_name || "Seu perfil"}
                  </span>
                  <b className="mt-3 block font-body text-sm">{label}</b>
                </button>
              ))}
            </div>
          </section>
          {hasChanges && (
            <div className="sticky bottom-20 z-40 flex items-center gap-3 rounded-2xl border border-line bg-white/95 p-3 shadow-[0_12px_35px_rgba(18,40,58,.12)] backdrop-blur sm:bottom-5">
              <Button onClick={save} disabled={saving}>
                {saving ? "Salvando..." : "Salvar alterações"}
              </Button>
              <button
                type="button"
                onClick={() => setTheme(savedTheme)}
                className="h-11 rounded-full px-4 font-body text-sm font-medium text-ash transition-colors hover:bg-cream hover:text-ink active:scale-[.98]"
              >
                Descartar
              </button>
              <span className="ml-auto hidden font-body text-xs text-stone sm:block">
                As mudanças só aparecem no catálogo após salvar.
              </span>
            </div>
          )}
        </div>
        <aside className="xl:sticky xl:top-10">
          <div className="rounded-[28px] border border-line bg-white p-4 shadow-[0_18px_50px_rgba(18,40,58,.06)] sm:p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-lg font-semibold">
                Pré-visualização
              </p>
              <span className="rounded-full bg-cream px-3 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-stone">
                Ao vivo
              </span>
            </div>
            <div
              style={{ backgroundColor: pageColor }}
              className={`mt-4 min-h-[540px] overflow-hidden rounded-[22px] p-3 transition-colors duration-300 sm:p-5 ${surface}`}
            >
              <div
                style={{ backgroundColor: bandColor }}
                className={`flex items-center gap-3 rounded-full border p-3 transition-colors duration-300 ${band}`}
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full font-display text-sm ${theme.profile_band === "dark" ? "bg-paper/15" : "bg-cream"}`}
                >
                  {profile.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <img
                      src={appPath("/vello-mascot.png")}
                      alt="Mascote da Vello"
                      className="h-full w-full object-cover object-top"
                    />
                  )}
                </span>
                <span className="min-w-0">
                  <b className="block truncate font-body text-sm">
                    {profile.professional_name || "Seu nome profissional"}
                  </b>
                  <small className="block truncate font-body text-[10px] opacity-60">
                    CRECI {displayCreci(profile.creci) || "000000"}
                  </small>
                </span>
              </div>
              <div
                className={`mt-8 grid gap-4 ${cardMode === "compact" ? "grid-cols-2" : ""}`}
              >
                <div
                  className={
                    cardMode === "classic"
                      ? "overflow-hidden rounded-[15px] bg-white text-ink"
                      : ""
                  }
                >
                  <div
                    className={`overflow-hidden bg-cream ${cardMode === "classic" ? "aspect-[4/3]" : cardMode === "compact" ? "aspect-[4/3] rounded-[14px]" : "aspect-[5/4] rounded-[18px]"}`}
                  >
                    {property && cover(property) ? (
                      <img
                        src={cover(property)}
                        alt=""
                        referrerPolicy="no-referrer"
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = appPath(
                            "/hero-vello-house.png",
                          );
                        }}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-[linear-gradient(135deg,#8f887e,#dbd2c5_45%,#6f6961)]" />
                    )}
                  </div>
                  <div
                    className={`${cardMode === "editorial" ? "-mt-5 ml-4 rounded-[17px] bg-white p-4 text-ink shadow-lg" : cardMode === "classic" ? "p-4" : "pt-2 text-paper"}`}
                  >
                    <p className="font-display text-xl font-semibold leading-none">
                      {property?.title || "Seu próximo imóvel"}
                    </p>
                    <p className="mt-2 font-body text-xs opacity-65">
                      {property
                        ? brl(
                            property.price,
                            property.transaction_type === "rent",
                          )
                        : "Preço sob consulta"}
                    </p>
                    <p className="mt-3 font-body text-[11px] opacity-60">
                      {property
                        ? `${property.neighborhood} · ${property.city}`
                        : "Bairro · Cidade"}
                    </p>
                  </div>
                </div>
                {cardMode === "compact" && (
                  <div>
                    <div className="aspect-[4/3] rounded-[14px] bg-[linear-gradient(135deg,#746e67,#cfc6ba)]" />
                    <div className="pt-2">
                      <p className="font-display text-base font-semibold">
                        Outro imóvel
                      </p>
                      <p className="mt-1 font-body text-[10px] opacity-60">
                        Ver detalhes
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
function Dialog({
  title,
  text,
  confirm,
  onClose,
  onConfirm,
  danger = false,
}: {
  title: string;
  text: string;
  confirm: string;
  onClose: () => void;
  onConfirm: () => void;
  danger?: boolean;
}) {
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
      className="fixed inset-0 z-[80] grid place-items-center bg-ink/45 p-5"
    >
      <motion.div
        initial={{ opacity: 0, transform: "translateY(10px) scale(.97)" }}
        animate={{ opacity: 1, transform: "translateY(0) scale(1)" }}
        transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
        className="w-full max-w-sm rounded-[24px] border border-line bg-white p-6 shadow-[0_28px_80px_-30px_rgba(18,40,58,.55)]"
      >
        <h2 className="font-display text-2xl font-semibold">{title}</h2>
        <p className="mt-3 font-body text-sm leading-relaxed text-ash">
          {text}
        </p>
        <div className="mt-7 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-full px-4 py-2 font-body text-sm"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className={`rounded-full px-4 py-2 font-body text-sm font-semibold text-white ${danger ? "bg-red-700" : "bg-ink"}`}
          >
            {confirm}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export function DashboardApp({ user, route }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const say = (s: string) => {
    setToast(s);
    window.setTimeout(() => setToast(null), 2500);
  };
  const refresh = async () => {
    try {
      const [p, pr, s, sv, ap, bh] = await Promise.all([
        getProfile(user.id),
        getProperties(user.id),
        getSelections(user.id),
        getServices(user.id),
        getAppointments(user.id),
        getBusinessHours(user.id),
      ]);
      setProfile(p);
      setProperties(pr);
      setSelections(s);
      setServices(sv);
      setAppointments(ap);
      setBusinessHours(bh);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    refresh();
  }, [user.id]);
  useEffect(() => {
    const close = (e: KeyboardEvent) => e.key === "Escape" && setToast(null);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);
  if (loading || !profile)
    return <LoadingScreen label="Organizando sua agenda" />;
  let page: React.ReactNode;
  if (route === "/dashboard")
    page = (
      <EsteticaHomePage
        profile={profile}
        services={services}
        appointments={appointments}
      />
    );
  else if (route === "/dashboard/servicos")
    page = <ServicesPage services={services} refresh={refresh} toast={say} />;
  else if (route === "/dashboard/servicos/novo")
    page = <ServiceEditor user={user} toast={say} refresh={refresh} />;
  else if (route.startsWith("/dashboard/servicos/")) {
    const service = services.find((item) => item.id === route.split("/").pop());
    page = service ? (
      <ServiceEditor
        user={user}
        service={service}
        toast={say}
        refresh={refresh}
      />
    ) : (
      <Empty
        title="Serviço não encontrado."
        text="Ele pode ter sido removido."
        action="Voltar aos serviços"
        onAction={() => go("/dashboard/servicos")}
      />
    );
  } else if (route === "/dashboard/agenda")
    page = (
      <AgendaPage appointments={appointments} refresh={refresh} toast={say} />
    );
  else if (route === "/dashboard/imoveis")
    page = (
      <PropertiesPage
        profile={profile}
        properties={properties}
        refresh={refresh}
        toast={say}
      />
    );
  else if (route === "/dashboard/imoveis/novo")
    page = <PropertyEditor user={user} toast={say} refresh={refresh} />;
  else if (route.startsWith("/dashboard/imoveis/")) {
    const p = properties.find((x) => x.id === route.split("/").pop());
    page = p ? (
      <PropertyEditor user={user} property={p} toast={say} refresh={refresh} />
    ) : (
      <Empty
        title="Imóvel não encontrado."
        text="Ele pode ter sido removido."
        action="Voltar aos imóveis"
        onAction={() => go("/dashboard/imoveis")}
      />
    );
  } else if (route === "/dashboard/selecoes")
    page = (
      <SelectionsPage selections={selections} refresh={refresh} toast={say} />
    );
  else if (route === "/dashboard/selecoes/nova")
    page = (
      <SelectionEditor
        user={user}
        properties={properties}
        toast={say}
        refresh={refresh}
      />
    );
  else if (route.startsWith("/dashboard/selecoes/")) {
    const s = selections.find((x) => x.id === route.split("/").pop());
    page = s ? (
      <SelectionEditor
        user={user}
        properties={properties}
        selection={s}
        toast={say}
        refresh={refresh}
      />
    ) : (
      <Empty
        title="Seleção não encontrada."
        text="Ela pode ter sido removida."
        action="Voltar às seleções"
        onAction={() => go("/dashboard/selecoes")}
      />
    );
  } else if (route === "/dashboard/catalogo")
    page = <CatalogPage profile={profile} services={services} toast={say} />;
  else if (route === "/dashboard/personalizar")
    page = (
      <CatalogCustomizationPage
        user={user}
        profile={profile}
        properties={properties}
        toast={say}
      />
    );
  else if (route === "/dashboard/perfil")
    page = (
      <ProfilePage
        user={user}
        profile={profile}
        businessHours={businessHours}
        refresh={refresh}
        toast={say}
        fixedView
      />
    );
  else if (route === "/dashboard/perfil/pagina")
    page = (
      <ProfilePage
        user={user}
        profile={profile}
        businessHours={businessHours}
        refresh={refresh}
        toast={say}
        fixedView
      />
    );
  else if (route === "/dashboard/configuracoes")
    page = (
      <ProfilePage
        user={user}
        profile={profile}
        businessHours={businessHours}
        refresh={refresh}
        toast={say}
        initialView="availability"
        settingsMode
      />
    );
  else
    page = (
      <ProfilePage
        user={user}
        profile={profile}
        businessHours={businessHours}
        refresh={refresh}
        toast={say}
      />
    );
  return (
    <div className="min-h-screen bg-paper">
      <Sidebar profile={profile} route={route} />
      <main className="min-h-screen px-5 pb-28 pt-7 lg:ml-[248px] lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">{page}</div>
      </main>
      <MobileNav route={route} />
      <Toast text={toast} />
    </div>
  );
}
