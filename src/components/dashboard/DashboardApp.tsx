import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowUp,
  Archive,
  Building2,
  Check,
  ChevronLeft,
  Copy,
  ExternalLink,
  FolderHeart,
  Home,
  ImagePlus,
  LoaderCircle,
  LogOut,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Share2,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { appPath } from "../../lib/paths";
import { LoadingScreen } from "../LoadingScreen";
import { signOut, updatePassword } from "../../lib/auth";
import {
  brl,
  dateBR,
  deleteProperty,
  deleteSelection,
  getProfile,
  getProperties,
  getSelections,
  saveProfile,
  saveProperty,
  saveSelection,
  setSelectionStatus,
  slugify,
  uploadAvatar,
  uploadPropertyImages,
} from "../../lib/vello";
import type { CatalogTheme, Profile, Property, Selection } from "../../lib/vello";

type Props = { user: User; route: string };
const nav = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/dashboard/imoveis", label: "Imóveis", icon: Building2 },
  { href: "/dashboard/selecoes", label: "Seleções", icon: FolderHeart },
  { href: "/dashboard/catalogo", label: "Meu catálogo", icon: ExternalLink },
  { href: "/dashboard/personalizar", label: "Personalizar catálogo", icon: Palette },
  { href: "/dashboard/perfil", label: "Perfil", icon: UserRound },
];
const go = (href: string) => (window.location.href = appPath(href));
const cover = (p: Property) =>
  p.property_images?.find((i) => i.is_cover)?.image_url ||
  p.property_images?.[0]?.image_url;
const statusLabel: Record<Property["status"], string> = {
  available: "Disponível",
  reserved: "Reservado",
  sold: "Vendido",
  rented: "Alugado",
};

function Toast({ text }: { text: string | null }) {
  return (
    <AnimatePresence>
      {text && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
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
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 font-body text-sm font-semibold text-paper transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
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
  compact = false,
}: {
  property: Property;
  onEdit: () => void;
  onDelete?: () => void;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <article className="group relative overflow-hidden rounded-[22px] border border-line bg-white">
      <div
        className={`relative overflow-hidden bg-cream ${compact ? "aspect-[4/3]" : "aspect-[16/10]"}`}
      >
        {cover(property) ? (
          <img
            src={cover(property)}
            alt={property.title}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
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
          <div className="absolute right-3 top-12 z-20 w-40 rounded-xl border border-line bg-white p-1.5 text-left shadow-lg">
            <button
              onClick={onEdit}
              className="w-full rounded-lg px-3 py-2 text-left font-body text-sm hover:bg-cream"
            >
              Editar
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(
                  `${window.location.origin}${appPath(`/catalogo/${property.slug || property.id}`)}`,
                );
                setOpen(false);
              }}
              className="w-full rounded-lg px-3 py-2 text-left font-body text-sm hover:bg-cream"
            >
              Copiar link
            </button>
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
  const initials = (profile.professional_name || "V").slice(0, 1);
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[248px] border-r border-line bg-white p-5 lg:flex lg:flex-col">
      <a href={appPath("/dashboard")}>
        <span className="inline-flex items-center gap-2">
          <img
            src={`${appPath("/vello-logo.png")}?v=3`}
            className="h-8 w-8 object-contain mix-blend-multiply"
          />
          <b className="font-display text-xl text-ink">Vello</b>
        </span>
      </a>
      <nav className="mt-12 space-y-1">
        {nav.slice(0, 5).map((item) => (
          <NavItem
            key={item.href}
            item={item}
            active={
              route === item.href ||
              (item.href === "/dashboard/imoveis" &&
                route.startsWith("/dashboard/imoveis")) ||
              (item.href === "/dashboard/selecoes" &&
                route.startsWith("/dashboard/selecoes"))
            }
          />
        ))}
        <div className="h-6" />
        {nav.slice(5).map((item) => (
          <NavItem key={item.href} item={item} active={route === item.href} />
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
              initials
            )}
          </span>
          <span className="min-w-0">
            <b className="block truncate font-body text-sm text-ink">
              {profile.professional_name || "Seu perfil"}
            </b>
            <small className="block truncate font-mono text-[10px] text-stone">
              {profile.creci || "CRECI"}
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
      className={`flex h-11 items-center gap-3 rounded-xl px-3 font-body text-sm transition ${active ? "bg-ink font-semibold text-paper" : "text-ash hover:bg-cream hover:text-ink"}`}
    >
      <Icon size={17} strokeWidth={1.8} />
      {item.label}
    </a>
  );
}
function MobileNav({ route }: { route: string }) {
  const items = [nav[0], nav[1], nav[2], nav[5]];
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex h-[72px] items-center justify-around border-t border-line bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden">
      {items.slice(0, 2).map((i) => (
        <MobileItem key={i.href} item={i} active={route.startsWith(i.href)} />
      ))}
      <a
        href={appPath("/dashboard/imoveis/novo")}
        aria-label="Novo imóvel"
        className="-mt-8 grid h-14 w-14 place-items-center rounded-full bg-ink text-paper shadow-lg"
      >
        <Plus size={23} />
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
      className={`grid justify-items-center gap-1 px-2 font-body text-[10px] ${active ? "text-ink" : "text-stone"}`}
    >
      <Icon size={18} />
      <span>{item.label}</span>
    </a>
  );
}

function HomePage({
  profile,
  properties,
}: {
  profile: Profile;
  properties: Property[];
}) {
  const first = profile.professional_name?.split(" ")[0] || "corretor";
  const summary = [
    ["Disponíveis", properties.filter((p) => p.status === "available").length],
    ["Reservados", properties.filter((p) => p.status === "reserved").length],
    [
      "Vendidos / alugados",
      properties.filter((p) => ["sold", "rented"].includes(p.status)).length,
    ],
    ["Total", properties.length],
  ];
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="font-body text-sm text-ash">Boa tarde, {first}.</p>
          <h1 className="mt-1 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
            Seus imóveis estão todos por aqui.
          </h1>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:justify-end">
          <a
            href={appPath("/dashboard/personalizar")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-line bg-white px-4 font-body text-sm font-semibold text-ink transition hover:border-ink"
          >
            <Palette size={16} /> Personalizar catálogo
          </a>
          <Button onClick={() => go("/dashboard/imoveis/novo")}>
            <Plus size={17} /> Novo imóvel
          </Button>
        </div>
      </header>
      <section className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {summary.map(([label, value]) => (
          <button
            key={String(label)}
            onClick={() => go("/dashboard/imoveis")}
            className="rounded-2xl border border-line bg-white p-4 text-left transition hover:border-ink"
          >
            <span className="font-mono text-[10px] uppercase tracking-wide text-stone">
              {label}
            </span>
            <b className="mt-3 block font-display text-3xl text-ink">{value}</b>
          </button>
        ))}
      </section>
      <section className="mt-12">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display text-2xl font-semibold text-ink">
              Seus imóveis
            </p>
            <p className="mt-1 font-body text-sm text-ash">
              Os mais recentes do seu catálogo.
            </p>
          </div>
          <a
            href={appPath("/dashboard/imoveis")}
            className="font-body text-sm underline underline-offset-4"
          >
            Ver todos
          </a>
        </div>
        {properties.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {properties.slice(0, 6).map((p) => (
              <PropertyCard
                key={p.id}
                property={p}
                onEdit={() => go(`/dashboard/imoveis/${p.id}`)}
              />
            ))}
          </div>
        ) : (
          <Empty
            title="Seu catálogo ainda está vazio."
            text="Adicione seu primeiro imóvel para começar."
            action="Adicionar imóvel"
            onAction={() => go("/dashboard/imoveis/novo")}
          />
        )}
      </section>
      <section className="mt-12 grid gap-5 xl:grid-cols-[1.25fr_.75fr]">
        <div className="rounded-[24px] border border-line bg-white p-6">
          <p className="font-display text-xl font-semibold">Ações rápidas</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {[
              ["Adicionar imóvel", "/dashboard/imoveis/novo"],
              ["Criar seleção", "/dashboard/selecoes/nova"],
              ["Ver meu catálogo", "/dashboard/catalogo"],
              ["Copiar link do catálogo", "#"],
            ].map(([text, href]) => (
              <button
                key={text}
                onClick={() =>
                  href === "#"
                    ? navigator.clipboard.writeText(
                        `${window.location.origin}${appPath(`/catalogo/${profile.slug}`)}`,
                      )
                    : go(href)
                }
                className="flex items-center justify-between rounded-xl border border-line px-4 py-3 font-body text-sm text-ink hover:bg-cream"
              >
                {text}
                <span>→</span>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-[24px] bg-ink p-6 text-paper">
          <p className="font-mono text-[10px] uppercase tracking-wide text-paper/60">
            Seu catálogo
          </p>
          <p className="mt-3 font-display text-2xl">
            Pronto para compartilhar.
          </p>
          <p className="mt-2 font-body text-sm text-paper/70">
            {profile.slug
              ? `vello.com.br/${profile.slug}`
              : "Defina seu link público"}
          </p>
          <a
            href={appPath("/dashboard/catalogo")}
            className="mt-6 inline-flex rounded-full bg-white px-4 py-2 font-body text-sm font-semibold text-ink"
          >
            Abrir catálogo
          </a>
        </div>
      </section>
    </>
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
  properties,
  refresh,
  toast,
}: {
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
      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <label className="flex h-11 flex-1 items-center gap-2 rounded-xl border border-line bg-white px-3">
          <Search size={17} className="text-stone" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar imóvel..."
            className="min-w-0 flex-1 bg-transparent font-body text-sm outline-none"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto">
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
      const urls = await uploadPropertyImages(user.id, files);
      setImages((old) => [...old, ...urls.map((url) => ({ url }))]);
    } catch (error) {
      toast(error instanceof Error ? error.message : "Não foi possível enviar as fotos.");
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
      <span className="mb-2 block font-display text-xs font-extrabold uppercase tracking-tight">
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
      <span className="mb-2 block font-display text-xs font-extrabold uppercase tracking-tight">
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

function SelectionsPage({ selections, refresh, toast }: { selections: Selection[]; refresh: () => Promise<void>; toast: (value: string) => void }) {
  const [remove, setRemove] = useState<Selection | null>(null);
  const setStatus = async (selection: Selection, status: Selection["status"]) => {
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
              className="rounded-[22px] border border-line bg-white p-5"
            >
              <p className="font-display text-xl font-semibold">
                {s.client_name}
              </p>
              <p className="mt-2 font-body text-sm text-ash">
                {s.selection_properties?.length || 0} imóveis ·{" "}
                {dateBR(s.created_at)}
              </p>
              <span className={`mt-4 inline-flex rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide ${s.status === "active" ? "bg-cream text-stone" : "bg-stone/10 text-stone"}`}>
                {s.status === "active" ? "Ativa" : "Arquivada"}
              </span>
              <p className="mt-4 truncate font-mono text-xs text-stone">
                vello.com.br/s/{s.slug}
              </p>
              <div className="mt-6 flex flex-wrap gap-2">
                <button
                  onClick={() => go(`/dashboard/selecoes/${s.id}`)}
                  className="rounded-full bg-ink px-4 py-2 font-body text-sm text-paper"
                >
                  Abrir
                </button>
                <button
                  onClick={() =>
                    navigator.clipboard.writeText(
                      `${window.location.origin}${appPath(`/selecao/${s.slug}`)}`,
                    )
                  }
                  className="rounded-full border border-line px-4 py-2 font-body text-sm"
                >
                  Copiar link
                </button>
                {s.client_whatsapp && (
                  <a
                    href={`https://wa.me/${s.client_whatsapp.replace(/\D/g, "")}?text=${encodeURIComponent(`Oi ${s.client_name}! Separei alguns imóveis para você: ${window.location.origin}${appPath(`/selecao/${s.slug}`)}`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-line px-4 py-2 font-body text-sm"
                  >
                    WhatsApp
                  </a>
                )}
              </div>
              <div className="mt-3 flex items-center gap-4">
                <button onClick={() => setStatus(s, s.status === "active" ? "archived" : "active")} className="inline-flex items-center gap-1 font-body text-xs text-ash hover:text-ink">
                  <Archive size={14} /> {s.status === "active" ? "Arquivar" : "Reativar"}
                </button>
                <button onClick={() => setRemove(s)} className="inline-flex items-center gap-1 font-body text-xs text-red-700">
                  <Trash2 size={14} /> Excluir
                </button>
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
      {remove && <Dialog title="Excluir esta seleção?" text="O link deixará de funcionar e essa ação não poderá ser desfeita." confirm="Excluir seleção" danger onClose={() => setRemove(null)} onConfirm={async () => { try { await deleteSelection(remove.id); toast("Seleção excluída"); setRemove(null); await refresh(); } catch { toast("Não foi possível excluir a seleção."); } }} />}
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
          slug: selection?.slug || slugify(name),
        },
        selected,
      );
      await refresh();
      toast(selection ? "Seleção atualizada" : "Seleção criada");
      go(`/dashboard/selecoes/${id}`);
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
          <h1 className="font-display text-4xl font-semibold">
            {selection ? "Editar seleção" : "Nova seleção"}
          </h1>
          <p className="mt-2 font-body text-ash">
            Escolha os imóveis que mais combinam com o seu cliente.
          </p>
        </div>
        <Button onClick={save} disabled={saving}>
          {saving ? "Salvando..." : "Criar seleção"}
        </Button>
      </header>
      <div className="mt-9 grid gap-7 xl:grid-cols-[340px_1fr]">
        <aside className="rounded-[24px] border border-line bg-white p-5">
          <p className="font-display text-xl font-semibold">Cliente</p>
          <div className="mt-5 space-y-4">
            <Field label="Nome do cliente" value={name} onChange={setName} />
            <Field
              label="WhatsApp · opcional"
              value={whats}
              onChange={setWhats}
            />
            <label>
              <span className="mb-2 block font-display text-xs font-extrabold uppercase">
                Mensagem
              </span>
              <textarea
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
                className="min-h-32 w-full rounded-xl border border-line p-3 font-body text-sm"
              />
            </label>
          </div>
          <p className="mt-7 font-mono text-xs text-stone">
            {selected.length} imóveis selecionados
          </p>
          {selected.length > 0 && (
            <div className="mt-4 border-t border-line pt-4">
              <p className="font-mono text-[10px] uppercase tracking-wide text-stone">Ordem da seleção</p>
              <div className="mt-3 space-y-2">
                {selected.map((id, index) => {
                  const item = properties.find((property) => property.id === id);
                  if (!item) return null;
                  return <div key={id} className="flex items-center gap-2 rounded-xl bg-cream px-3 py-2"><span className="grid h-6 w-6 place-items-center rounded-full bg-white font-mono text-[10px]">{index + 1}</span><span className="min-w-0 flex-1 truncate font-body text-xs font-medium">{item.title}</span><button type="button" aria-label="Subir imóvel" disabled={index === 0} onClick={() => moveSelected(index, index - 1)} className="p-1 disabled:opacity-30"><ArrowUp size={14} /></button><button type="button" aria-label="Descer imóvel" disabled={index === selected.length - 1} onClick={() => moveSelected(index, index + 1)} className="p-1 disabled:opacity-30"><ArrowDown size={14} /></button></div>;
                })}
              </div>
            </div>
          )}
        </aside>
        <section>
          <div className="flex items-center justify-between">
            <p className="font-display text-2xl font-semibold">
              Escolher imóveis
            </p>
            <span className="font-body text-sm text-ash">
              Toque para selecionar
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
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
  properties,
  toast,
}: {
  profile: Profile;
  properties: Property[];
  toast: (s: string) => void;
}) {
  const link = `${window.location.origin}${appPath(`/catalogo/${profile.slug}`)}`;
  return (
    <>
      <header>
        <h1 className="font-display text-4xl font-semibold">Meu catálogo</h1>
        <p className="mt-2 font-body text-ash">
          Seu espaço público para apresentar imóveis com clareza.
        </p>
      </header>
      <div className="mt-9 grid gap-7 xl:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-[26px] border border-line bg-white">
          <div className="bg-ink p-7 text-paper">
            <p className="font-mono text-[10px] uppercase tracking-wide text-paper/60">
              Prévia do catálogo
            </p>
            <p className="mt-3 font-display text-3xl">
              {profile.professional_name}
            </p>
            <p className="mt-1 font-body text-sm text-paper/70">
              {profile.city}, {profile.state}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4">
            {properties
              .filter((p) => p.publication_status === "published")
              .slice(0, 4)
              .map((p) => (
                <div key={p.id} className="overflow-hidden rounded-xl bg-cream">
                  <div className="aspect-[4/3]">
                    {cover(p) && (
                      <img
                        src={cover(p)}
                        className="h-full w-full object-cover"
                      />
                    )}
                  </div>
                  <p className="truncate p-2 font-body text-xs">{p.title}</p>
                </div>
              ))}
          </div>
        </section>
        <aside className="rounded-[26px] border border-line bg-white p-6">
          <p className="font-display text-2xl font-semibold">Seu catálogo</p>
          <p className="mt-3 break-all font-mono text-sm text-ash">
            vello.com.br/{profile.slug}
          </p>
          <div className="mt-6 grid gap-3">
            <a
              href={appPath("/dashboard/personalizar")}
              className="flex h-12 items-center justify-center gap-2 rounded-full bg-ink font-body text-sm font-semibold text-paper transition hover:scale-[1.01]"
            >
              <Palette size={16} /> Personalizar catálogo
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
            {
              properties.filter(
                (p) =>
                  p.status === "available" &&
                  p.publication_status === "published",
              ).length
            }{" "}
            imóveis disponíveis
          </p>
        </aside>
      </div>
    </>
  );
}
function ProfilePage({
  user,
  profile,
  toast,
}: {
  user: User;
  profile: Profile;
  toast: (s: string) => void;
}) {
  const [form, setForm] = useState(profile);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [avatarSaving, setAvatarSaving] = useState(false);
  const avatarInput = useRef<HTMLInputElement>(null);
  const save = async () => {
    try {
      await saveProfile(user.id, form);
      toast("Alterações salvas");
    } catch {
      toast("Não foi possível salvar.");
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
      toast(error instanceof Error ? error.message : "Não foi possível enviar a foto.");
    } finally {
      setAvatarSaving(false);
    }
  };
  return (
    <>
      <header>
        <h1 className="font-display text-4xl font-semibold">
          Perfil
        </h1>
        <p className="mt-2 font-body text-ash">
          Seus dados e as preferências de exibição do catálogo.
        </p>
      </header>
      <section className="mt-9 max-w-2xl rounded-[24px] border border-line bg-white p-5 sm:p-7">
        <div className="mb-7 flex items-center gap-4 border-b border-line pb-7">
          <span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-cream font-display text-xl">
            {form.avatar_url ? <img src={form.avatar_url} alt="Foto de perfil" className="h-full w-full object-cover" /> : (form.professional_name || "V").slice(0, 1)}
          </span>
          <span>
            <b className="block font-body text-sm">Foto de perfil</b>
            <span className="mt-1 block font-body text-xs text-ash">JPG, PNG ou WebP · até 5 MB</span>
            <input ref={avatarInput} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(event) => changeAvatar(event.target.files?.[0])} />
            <button type="button" disabled={avatarSaving} onClick={() => avatarInput.current?.click()} className="mt-3 inline-flex items-center gap-1.5 font-body text-sm font-semibold underline underline-offset-4 disabled:opacity-50"><ImagePlus size={15} /> {avatarSaving ? "Enviando..." : form.avatar_url ? "Trocar foto" : "Adicionar foto"}</button>
          </span>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Nome profissional"
            value={form.professional_name || ""}
            onChange={(v) => setForm((x) => ({ ...x, professional_name: v }))}
          />
          <Field
            label="CRECI"
            value={form.creci || ""}
            onChange={(v) => setForm((x) => ({ ...x, creci: v }))}
          />
          <Field
            label="WhatsApp"
            value={form.whatsapp || ""}
            onChange={(v) => setForm((x) => ({ ...x, whatsapp: v }))}
          />
          <Field
            label="Cidade"
            value={form.city || ""}
            onChange={(v) => setForm((x) => ({ ...x, city: v }))}
          />
          <Field
            label="Instagram"
            value={form.instagram || ""}
            onChange={(v) => setForm((x) => ({ ...x, instagram: v }))}
          />
          <Field
            label="Link Vello"
            value={form.slug || ""}
            onChange={(v) => setForm((x) => ({ ...x, slug: slugify(v) }))}
          />
        </div>
        <label className="mt-5 block">
          <span className="mb-2 block font-display text-xs font-extrabold uppercase">
            Bio curta
          </span>
          <textarea
            value={form.bio || ""}
            onChange={(e) => setForm((x) => ({ ...x, bio: e.target.value }))}
            className="min-h-28 w-full rounded-xl border border-line p-3 font-body text-sm"
            placeholder="Especialista em imóveis residenciais..."
          />
        </label>
        <div className="mt-6 border-t border-line pt-6">
            <p className="font-display text-lg font-semibold">
              Exibição do catálogo
            </p>
            <label className="mt-4 flex justify-between font-body text-sm">
              Mostrar Instagram
              <input
                type="checkbox"
                checked={form.show_instagram}
                onChange={(e) =>
                  setForm((x) => ({ ...x, show_instagram: e.target.checked }))
                }
              />
            </label>
            <label className="mt-4 flex justify-between font-body text-sm">
              Mostrar CRECI
              <input
                type="checkbox"
                checked={form.show_creci}
                onChange={(e) =>
                  setForm((x) => ({ ...x, show_creci: e.target.checked }))
                }
              />
            </label>
            <label className="mt-4 flex justify-between font-body text-sm">
              Mostrar imóveis vendidos/alugados
              <input
                type="checkbox"
                checked={form.show_completed_properties}
                onChange={(e) =>
                  setForm((x) => ({
                    ...x,
                    show_completed_properties: e.target.checked,
                  }))
                }
              />
            </label>
            <div className="mt-8 rounded-xl bg-cream p-4 font-body text-sm text-ash">
              Plano atual: <b className="text-ink">Acesso de teste</b>
            </div>
        </div>
        <a href={appPath("/dashboard/personalizar")} className="mt-8 flex items-center justify-between rounded-2xl border border-line bg-cream p-5 transition hover:border-ink">
          <span><b className="block font-display text-lg">Personalize seu catálogo</b><span className="mt-1 block font-body text-sm text-ash">Escolha cores, faixa de perfil e estilo dos imóveis.</span></span><Palette size={20} />
        </a>
        <Button onClick={save} className="mt-7">
          Salvar alterações
        </Button>
        <section className="mt-9 border-t border-line pt-7">
          <p className="font-display text-lg font-semibold">Segurança</p>
          <p className="mt-1 font-body text-sm text-ash">Atualize a senha de acesso quando precisar.</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Nova senha" type="password" value={newPassword} onChange={setNewPassword} />
            <Field label="Confirmar nova senha" type="password" value={confirmPassword} onChange={setConfirmPassword} />
          </div>
          <button type="button" disabled={passwordSaving || !newPassword} onClick={changePassword} className="mt-4 h-10 rounded-full border border-line px-4 font-body text-sm font-medium transition hover:border-ink disabled:cursor-not-allowed disabled:opacity-50">
            {passwordSaving ? "Atualizando..." : "Atualizar senha"}
          </button>
        </section>
        <button
          onClick={async () => {
            await signOut();
            go("/login");
          }}
          className="mt-8 flex h-11 w-full items-center justify-center gap-2 rounded-full border border-red-200 font-body text-sm font-medium text-red-700 md:hidden"
        >
          <LogOut size={16} /> Sair da conta
        </button>
      </section>
    </>
  );
}
function CatalogCustomizationPage({ user, profile, properties, toast }: { user: User; profile: Profile; properties: Property[]; toast: (value: string) => void }) {
  const [theme, setTheme] = useState<CatalogTheme>(profile.catalog_theme || { palette: "warm", property_style: "editorial", profile_band: "light" });
  const [saving, setSaving] = useState(false);
  const update = <K extends keyof CatalogTheme>(key: K, value: CatalogTheme[K]) => setTheme((current) => ({ ...current, [key]: value }));
  const save = async () => { setSaving(true); try { await saveProfile(user.id, { catalog_theme: theme }); toast("Personalização salva"); } catch { toast("Não foi possível salvar."); } finally { setSaving(false); } };
  const property = properties[0];
  const pageColor = theme.background_color || ({ warm: "#f5f2ec", paper: "#ffffff", charcoal: "#191918" }[theme.palette]);
  const bandColor = theme.profile_color || ({ light: "#ffffff", contrast: "#e9e4da", dark: "#0b0b0a" }[theme.profile_band]);
  const surface = theme.palette === "charcoal" ? "bg-[#191918] text-paper" : theme.palette === "paper" ? "bg-white text-ink" : "bg-[#f5f2ec] text-ink";
  const band = theme.profile_band === "dark" ? "bg-ink text-paper border-white/10" : theme.profile_band === "contrast" ? "bg-[#e9e4da] text-ink border-[#d7d0c4]" : "bg-white text-ink border-black/10";
  const cardMode = theme.property_style;
  return <>
    <header className="flex flex-wrap items-end justify-between gap-5"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Seu catálogo</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.045em]">Personalizar</h1><p className="mt-2 max-w-xl font-body text-ash">Deixe o seu catálogo com a sua cara. A prévia muda enquanto você escolhe.</p></div><a href={appPath(`/${profile.slug || ''}`)} target="_blank" rel="noreferrer" className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 font-body text-sm font-medium hover:border-ink"><ExternalLink size={16} />Abrir catálogo</a></header>
    <div className="mt-9 grid items-start gap-8 xl:grid-cols-[minmax(0,.9fr)_minmax(430px,1.1fr)]">
      <div className="space-y-5">
        <section className="rounded-[24px] border border-line bg-white p-5 sm:p-7"><p className="font-display text-xl font-semibold">1. Escolha a atmosfera</p><p className="mt-1 font-body text-sm text-ash">A cor de fundo define a primeira sensação do seu catálogo.</p><label className="mt-5 flex items-center justify-between rounded-2xl border-2 border-ink bg-cream p-4 transition hover:bg-[#eee8dc]"><span><b className="block font-display text-lg">Sua cor</b><span className="mt-1 block font-body text-xs text-ash">Escolha livremente o fundo do catálogo.</span><small className="mt-2 block font-mono text-[11px] uppercase tracking-[.1em] text-stone">{pageColor}</small></span><input aria-label="Escolher cor de fundo" type="color" value={pageColor} onChange={(event) => update('background_color', event.target.value)} className="h-14 w-14 cursor-pointer rounded-xl border border-black/15 bg-transparent p-1" /></label><p className="mt-6 font-mono text-[10px] uppercase tracking-[.14em] text-stone">Ou comece por um tema</p><div className="mt-3 grid grid-cols-3 gap-3">{([['warm','Areia','O equilíbrio quente da Vello.','bg-[#f5f2ec]'],['paper','Claro','Minimalista e luminoso.','bg-white'],['charcoal','Noite','Sofisticado e marcante.','bg-ink']] as const).map(([value,label,description,swatch]) => <button key={value} type="button" onClick={() => update('palette',value)} className={`rounded-2xl border p-3 text-left transition ${theme.palette === value ? 'border-ink ring-1 ring-ink' : 'border-line hover:border-stone'}`}><span className={`block h-14 rounded-xl border border-black/10 ${swatch}`} /><b className="mt-3 block font-body text-sm">{label}</b><span className="mt-1 block font-body text-[11px] leading-relaxed text-ash">{description}</span></button>)}</div></section>
        <section className="rounded-[24px] border border-line bg-white p-5 sm:p-7"><p className="font-display text-xl font-semibold">2. Apresente os imóveis</p><p className="mt-1 font-body text-sm text-ash">Escolha o ritmo da lista que seus clientes vão navegar.</p><div className="mt-5 space-y-2">{([['editorial','Editorial','Fotos grandes e informações em camadas.'],['classic','Clássico','Leitura organizada, imagem e texto separados.'],['compact','Compacto','Mais opções na tela, sem perder clareza.']] as const).map(([value,label,description]) => <button key={value} type="button" onClick={() => update('property_style',value)} className={`flex w-full items-center gap-4 rounded-2xl border p-3 text-left transition ${theme.property_style === value ? 'border-ink bg-cream ring-1 ring-ink' : 'border-line hover:border-stone'}`}><span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl font-mono text-xs ${theme.property_style === value ? 'bg-ink text-paper' : 'bg-cream text-stone'}`}>0{value === 'editorial' ? '1' : value === 'classic' ? '2' : '3'}</span><span className="min-w-0"><b className="block font-body text-sm">{label}</b><span className="mt-1 block font-body text-xs text-ash">{description}</span></span><Check size={16} className={`ml-auto shrink-0 ${theme.property_style === value ? 'text-ink' : 'text-transparent'}`} /></button>)}</div></section>
        <section className="rounded-[24px] border border-line bg-white p-5 sm:p-7"><p className="font-display text-xl font-semibold">3. Faixa do seu perfil</p><p className="mt-1 font-body text-sm text-ash">O primeiro contato visual entre você e quem visita seu catálogo.</p><label className="mt-5 flex items-center justify-between rounded-2xl border-2 border-ink bg-cream p-4 transition hover:bg-[#eee8dc]"><span><b className="block font-display text-lg">Sua cor</b><span className="mt-1 block font-body text-xs text-ash">Dê identidade à sua faixa de apresentação.</span><small className="mt-2 block font-mono text-[11px] uppercase tracking-[.1em] text-stone">{bandColor}</small></span><input aria-label="Escolher cor da faixa do perfil" type="color" value={bandColor} onChange={(event) => update('profile_color', event.target.value)} className="h-14 w-14 cursor-pointer rounded-xl border border-black/15 bg-transparent p-1" /></label><p className="mt-6 font-mono text-[10px] uppercase tracking-[.14em] text-stone">Ou comece por um estilo</p><div className="mt-3 grid grid-cols-3 gap-3">{([['light','Leve','bg-white text-ink'],['contrast','Areia','bg-[#e9e4da] text-ink'],['dark','Escura','bg-ink text-paper']] as const).map(([value,label,appearance]) => <button key={value} type="button" onClick={() => update('profile_band',value)} className={`rounded-2xl border p-3 text-left transition ${theme.profile_band === value ? 'border-ink ring-1 ring-ink' : 'border-line hover:border-stone'}`}><span className={`flex h-12 items-center rounded-xl px-3 font-body text-[10px] font-semibold ${appearance}`}>{profile.professional_name || 'Seu perfil'}</span><b className="mt-3 block font-body text-sm">{label}</b></button>)}</div></section>
        <div className="flex gap-3"><Button onClick={save} disabled={saving}>{saving ? 'Salvando...' : 'Salvar personalização'}</Button><button type="button" onClick={() => setTheme(profile.catalog_theme || { palette: 'warm', property_style: 'editorial', profile_band: 'light' })} className="h-11 rounded-full px-4 font-body text-sm text-ash hover:text-ink">Desfazer alterações</button></div>
      </div>
      <aside className="xl:sticky xl:top-10"><div className="rounded-[28px] border border-line bg-white p-4 shadow-[0_18px_50px_rgba(11,11,10,.06)] sm:p-5"><div className="flex items-center justify-between"><p className="font-display text-lg font-semibold">Pré-visualização</p><span className="rounded-full bg-cream px-3 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-stone">Ao vivo</span></div><div style={{ backgroundColor: pageColor }} className={`mt-4 min-h-[540px] overflow-hidden rounded-[22px] p-3 transition-colors duration-300 sm:p-5 ${surface}`}><div style={{ backgroundColor: bandColor }} className={`flex items-center gap-3 rounded-full border p-3 transition-colors duration-300 ${band}`}><span className={`grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full font-display text-sm ${theme.profile_band === 'dark' ? 'bg-paper/15' : 'bg-cream'}`}>{profile.avatar_url ? <img src={profile.avatar_url} alt="" className="h-full w-full object-cover" /> : (profile.professional_name || 'V').slice(0,1)}</span><span className="min-w-0"><b className="block truncate font-body text-sm">{profile.professional_name || 'Seu nome profissional'}</b><small className="block truncate font-body text-[10px] opacity-60">CRECI {profile.creci || '000000'}</small></span></div><div className={`mt-8 grid gap-4 ${cardMode === 'compact' ? 'grid-cols-2' : ''}`}><div className={cardMode === 'classic' ? 'overflow-hidden rounded-[15px] bg-white text-ink' : ''}><div className={`overflow-hidden bg-cream ${cardMode === 'classic' ? 'aspect-[4/3]' : cardMode === 'compact' ? 'aspect-[4/3] rounded-[14px]' : 'aspect-[5/4] rounded-[18px]'}`}>{property && cover(property) ? <img src={cover(property)} alt="" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-[linear-gradient(135deg,#8f887e,#dbd2c5_45%,#6f6961)]" />}</div><div className={`${cardMode === 'editorial' ? '-mt-5 ml-4 rounded-[17px] bg-white p-4 text-ink shadow-lg' : cardMode === 'classic' ? 'p-4' : 'pt-2 text-paper'}`}><p className="font-display text-xl font-semibold leading-none">{property?.title || 'Seu próximo imóvel'}</p><p className="mt-2 font-body text-xs opacity-65">{property ? brl(property.price, property.transaction_type === 'rent') : 'Preço sob consulta'}</p><p className="mt-3 font-body text-[11px] opacity-60">{property ? `${property.neighborhood} · ${property.city}` : 'Bairro · Cidade'}</p></div></div>{cardMode === 'compact' && <div><div className="aspect-[4/3] rounded-[14px] bg-[linear-gradient(135deg,#746e67,#cfc6ba)]" /><div className="pt-2"><p className="font-display text-base font-semibold">Outro imóvel</p><p className="mt-1 font-body text-[10px] opacity-60">Ver detalhes</p></div></div>}</div></div></div></aside>
    </div>
  </>;
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
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[80] grid place-items-center bg-ink/45 p-5"
    >
      <div className="w-full max-w-sm rounded-[24px] bg-white p-6 shadow-2xl">
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
      </div>
    </div>
  );
}

export function DashboardApp({ user, route }: Props) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [selections, setSelections] = useState<Selection[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const say = (s: string) => {
    setToast(s);
    window.setTimeout(() => setToast(null), 2500);
  };
  const refresh = async () => {
    try {
      const [p, pr, s] = await Promise.all([
        getProfile(user.id),
        getProperties(user.id),
        getSelections(user.id),
      ]);
      setProfile(p);
      setProperties(pr);
      setSelections(s);
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
  if (loading || !profile) return <LoadingScreen label="Organizando seus imóveis" />;
  let page: React.ReactNode;
  if (route === "/dashboard")
    page = (
      <HomePage profile={profile} properties={properties} />
    );
  else if (route === "/dashboard/imoveis")
    page = (
      <PropertiesPage properties={properties} refresh={refresh} toast={say} />
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
    page = <SelectionsPage selections={selections} refresh={refresh} toast={say} />;
  else if (route === "/dashboard/selecoes/nova")
    page = <SelectionEditor user={user} properties={properties} toast={say} refresh={refresh} />;
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
    page = (
      <CatalogPage profile={profile} properties={properties} toast={say} />
    );
  else if (route === "/dashboard/personalizar")
    page = <CatalogCustomizationPage user={user} profile={profile} properties={properties} toast={say} />;
  else if (route === "/dashboard/perfil")
    page = <ProfilePage user={user} profile={profile} toast={say} />;
  else page = <ProfilePage user={user} profile={profile} toast={say} />;
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
