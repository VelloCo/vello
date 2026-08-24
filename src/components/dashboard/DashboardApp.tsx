import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import {
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
  Plus,
  Search,
  Share2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { appPath } from "../../lib/paths";
import { LoadingScreen } from "../LoadingScreen";
import { signOut } from "../../lib/auth";
import {
  brl,
  dateBR,
  deleteProperty,
  getProfile,
  getProperties,
  getSelections,
  saveProfile,
  saveProperty,
  saveSelection,
  slugify,
  uploadPropertyImages,
} from "../../lib/vello";
import type { CatalogTheme, Profile, Property, Selection } from "../../lib/vello";

type Props = { user: User; route: string };
const nav = [
  { href: "/dashboard", label: "Início", icon: Home },
  { href: "/dashboard/imoveis", label: "Imóveis", icon: Building2 },
  { href: "/dashboard/selecoes", label: "Seleções", icon: FolderHeart },
  { href: "/dashboard/catalogo", label: "Meu catálogo", icon: ExternalLink },
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
        {nav.slice(0, 4).map((item) => (
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
        {nav.slice(4).map((item) => (
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
  const items = [nav[0], nav[1], nav[2], nav[4]];
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
        <Button onClick={() => go("/dashboard/imoveis/novo")}>
          <Plus size={17} /> Novo imóvel
        </Button>
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
}: {
  user: User;
  property?: Property;
  toast: (s: string) => void;
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
    const urls = await uploadPropertyImages(user.id, files);
    setImages((old) => [...old, ...urls.map((url) => ({ url }))]);
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

function SelectionsPage({ selections }: { selections: Selection[] }) {
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
              <p className="mt-4 truncate font-mono text-xs text-stone">
                vello.com.br/s/{s.slug}
              </p>
              <div className="mt-6 flex gap-2">
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
    </>
  );
}
function SelectionEditor({
  user,
  properties,
  selection,
  toast,
}: {
  user: User;
  properties: Property[];
  selection?: Selection;
  toast: (s: string) => void;
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
      toast("Seleção criada");
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
              href={link}
              target="_blank"
              className="flex h-11 items-center justify-center gap-2 rounded-full bg-ink font-body text-sm font-semibold text-paper"
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
  const theme: CatalogTheme = form.catalog_theme || {
    palette: "warm",
    property_style: "editorial",
    profile_band: "light",
  };
  const updateTheme = <K extends keyof CatalogTheme>(key: K, value: CatalogTheme[K]) =>
    setForm((current) => ({
      ...current,
      catalog_theme: { ...theme, [key]: value },
    }));
  const save = async () => {
    try {
      await saveProfile(user.id, form);
      toast("Alterações salvas");
    } catch {
      toast("Não foi possível salvar.");
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
        <div className="mt-8 border-t border-line pt-7">
          <p className="font-display text-lg font-semibold">Personalize seu catálogo</p>
          <p className="mt-1 font-body text-sm leading-relaxed text-ash">Defina a atmosfera da página pública sem precisar editar seus imóveis.</p>
          <div className="mt-6">
            <p className="font-mono text-[10px] uppercase tracking-[.15em] text-stone">Cores do catálogo</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {([['warm', 'Areia', 'bg-[#f5f2ec]'], ['paper', 'Claro', 'bg-white'], ['charcoal', 'Noite', 'bg-ink']] as const).map(([value, label, color]) => <button key={value} type="button" onClick={() => updateTheme('palette', value)} className={`rounded-xl border p-2 text-left transition ${theme.palette === value ? 'border-ink ring-1 ring-ink' : 'border-line hover:border-stone'}`}><span className={`block h-8 rounded-lg border border-black/10 ${color}`} /><span className="mt-2 block font-body text-xs font-medium">{label}</span></button>)}
            </div>
          </div>
          <div className="mt-6">
            <p className="font-mono text-[10px] uppercase tracking-[.15em] text-stone">Estilo dos imóveis</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              {([['editorial', 'Editorial', 'Fotos protagonistas e informações sobrepostas.'], ['classic', 'Clássico', 'Card tradicional, com leitura mais direta.'], ['compact', 'Compacto', 'Mais imóveis visíveis de uma só vez.']] as const).map(([value, label, description]) => <button key={value} type="button" onClick={() => updateTheme('property_style', value)} className={`rounded-xl border p-3 text-left transition ${theme.property_style === value ? 'border-ink bg-cream ring-1 ring-ink' : 'border-line hover:border-stone'}`}><span className="block font-body text-sm font-semibold">{label}</span><span className="mt-1 block font-body text-xs leading-relaxed text-ash">{description}</span></button>)}
            </div>
          </div>
          <div className="mt-6">
            <p className="font-mono text-[10px] uppercase tracking-[.15em] text-stone">Faixa do seu perfil</p>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {([['light', 'Leve', 'bg-white text-ink'], ['contrast', 'Areia', 'bg-[#e9e4da] text-ink'], ['dark', 'Escura', 'bg-ink text-paper']] as const).map(([value, label, appearance]) => <button key={value} type="button" onClick={() => updateTheme('profile_band', value)} className={`rounded-xl border p-2 text-left transition ${theme.profile_band === value ? 'border-ink ring-1 ring-ink' : 'border-line hover:border-stone'}`}><span className={`block h-8 rounded-lg ${appearance}`} /><span className="mt-2 block font-body text-xs font-medium">{label}</span></button>)}
            </div>
          </div>
          <div className="mt-7 border-t border-line pt-6">
            <div className="flex items-center justify-between gap-4">
              <p className="font-display text-base font-semibold">Pré-visualização</p>
              <span className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">Ao vivo</span>
            </div>
            <div className={`mt-3 overflow-hidden rounded-[20px] border p-3 transition-colors duration-300 ${theme.palette === 'charcoal' ? 'border-white/10 bg-[#1b1b19]' : theme.palette === 'paper' ? 'border-line bg-white' : 'border-[#e1dbd1] bg-[#f5f2ec]'}`}>
              <div className={`flex items-center gap-2 rounded-full border p-2.5 transition-colors duration-300 ${theme.profile_band === 'dark' ? 'border-white/10 bg-ink text-paper' : theme.profile_band === 'contrast' ? 'border-[#d7d0c4] bg-[#e9e4da] text-ink' : 'border-black/10 bg-white text-ink'}`}>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full font-display text-xs ${theme.profile_band === 'dark' ? 'bg-paper/15' : 'bg-cream'}`}>{(form.professional_name || 'V').slice(0, 1)}</span>
                <span className="min-w-0"><b className="block truncate font-body text-[11px]">{form.professional_name || 'Seu nome profissional'}</b><small className="block truncate font-body text-[9px] opacity-60">CRECI {form.creci || '000000'}</small></span>
              </div>
              <div className={`mx-auto mt-4 max-w-[310px] ${theme.property_style === 'compact' ? 'grid grid-cols-2 gap-2' : ''}`}>
                <div className={`${theme.property_style === 'classic' ? 'rounded-[10px] bg-white pb-3' : theme.property_style === 'compact' ? 'rounded-[12px] bg-white p-2' : ''}`}>
                  <div className={`aspect-[5/3] bg-[linear-gradient(135deg,#a9a39a,#e5ded1_45%,#81796f)] ${theme.property_style === 'classic' ? 'rounded-t-[10px]' : theme.property_style === 'compact' ? 'rounded-[8px]' : 'rounded-[14px]'}`} />
                  <div className={`${theme.property_style === 'editorial' ? '-mt-3 ml-3 rounded-[12px] bg-white p-3 shadow-sm' : theme.property_style === 'classic' ? 'px-3 pt-3' : 'pt-2'}`}><p className="font-display text-sm font-semibold leading-none text-ink">Seu imóvel</p><p className="mt-1 font-body text-[10px] text-ash">Preço sob consulta</p></div>
                </div>
                {theme.property_style === 'compact' && <div className="rounded-[12px] bg-white p-2"><div className="aspect-[5/3] rounded-[8px] bg-[linear-gradient(135deg,#7c756d,#cfc7bc)]" /><div className="pt-2"><p className="font-display text-sm font-semibold leading-none text-ink">Outro imóvel</p><p className="mt-1 font-body text-[10px] text-ash">Ver detalhes</p></div></div>}
              </div>
            </div>
          </div>
        </div>
        <Button onClick={save} className="mt-7">
          Salvar alterações
        </Button>
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
    page = <PropertyEditor user={user} toast={say} />;
  else if (route.startsWith("/dashboard/imoveis/")) {
    const p = properties.find((x) => x.id === route.split("/").pop());
    page = p ? (
      <PropertyEditor user={user} property={p} toast={say} />
    ) : (
      <Empty
        title="Imóvel não encontrado."
        text="Ele pode ter sido removido."
        action="Voltar aos imóveis"
        onAction={() => go("/dashboard/imoveis")}
      />
    );
  } else if (route === "/dashboard/selecoes")
    page = <SelectionsPage selections={selections} />;
  else if (route === "/dashboard/selecoes/nova")
    page = <SelectionEditor user={user} properties={properties} toast={say} />;
  else if (route.startsWith("/dashboard/selecoes/")) {
    const s = selections.find((x) => x.id === route.split("/").pop());
    page = s ? (
      <SelectionEditor
        user={user}
        properties={properties}
        selection={s}
        toast={say}
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
