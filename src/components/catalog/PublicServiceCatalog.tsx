import {
  CalendarDays,
  Check,
  Clock3,
  LoaderCircle,
  MapPin,
  Share2,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { appPath } from "../../lib/paths";
import { requireSupabase } from "../../lib/supabase";
import { LoadingScreen } from "../LoadingScreen";
import { Logo } from "../Logo";

type Service = {
  id: string;
  title: string;
  description: string;
  category: string;
  price_type: "fixed" | "from" | "on_request";
  price: number | string | null;
  duration_minutes: number;
  images: Array<{ image_url: string }>;
};
type Page = {
  profile: {
    professional_name: string;
    avatar_url: string | null;
    business_type: "autonoma" | "clinica";
    city: string | null;
    state: string | null;
    neighborhood: string | null;
    address: string | null;
    bio: string;
    catalog_theme?: { property_style?: "editorial" | "classic" };
  };
  services: Service[];
};

const categories: Record<string, string> = {
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
const serviceCoverAsset: Record<string, string> = {
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
const categoryCover = (category: string) => {
  return {
    backgroundColor: "#E8F1F8",
    backgroundImage:
      "url(" + appPath(serviceCoverAsset[category] || serviceCoverAsset.outros) + ")",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
  };
};
const localDate = (date: Date) =>
  date.getFullYear() +
  "-" +
  String(date.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(date.getDate()).padStart(2, "0");
const dateLabel = (day: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(day + "T12:00:00"));
const timeLabel = (slot: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(slot));
const price = (service: Service) => {
  if (service.price_type === "on_request") return "Sob consulta";
  const value = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(service.price || 0));
  return service.price_type === "from" ? "A partir de " + value : value;
};

function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 text-center">
      <div>
        <Logo />
        <h1 className="mt-10 font-display text-4xl font-semibold">
          Esta página não foi encontrada.
        </h1>
        <p className="mt-3 font-body text-ash">
          Confira o link ou volte para a Vello.
        </p>
        <a
          href={appPath("/")}
          className="vello-primary bg-sky text-ink mt-7 inline-flex rounded-full px-5 py-3 font-body text-sm font-semibold"
        >
          Conhecer a Vello
        </a>
      </div>
    </main>
  );
}

function BookingDialog({
  slug,
  service,
  onClose,
}: {
  slug: string;
  service: Service;
  onClose: () => void;
}) {
  const [day, setDay] = useState(localDate(new Date()));
  const [slots, setSlots] = useState<string[]>([]);
  const [slot, setSlot] = useState("");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<"pending" | "confirmed" | null>(null);
  useEffect(() => {
    let active = true;
    void (async () => {
      setLoading(true);
      setSlot("");
      setError("");
      try {
        const { data, error: rpcError } = await requireSupabase().rpc(
          "get_available_slots",
          { p_slug: slug, p_service_id: service.id, p_day: day },
        );
        if (active) {
          if (rpcError) setError("Não foi possível buscar horários agora.");
          else setSlots(Array.isArray(data) ? (data as string[]) : []);
        }
      } catch {
        if (active) setError("Não foi possível buscar horários agora.");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [day, service.id, slug]);
  const book = async () => {
    if (!slot || !name.trim() || !whatsapp.trim()) {
      setError("Escolha um horário e informe seu nome e WhatsApp.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const { data, error: rpcError } = await requireSupabase().rpc(
        "book_appointment",
        {
          p_slug: slug,
          p_service_id: service.id,
          p_starts_at: slot,
          p_client_name: name.trim(),
          p_client_whatsapp: whatsapp,
          p_client_notes: notes.trim(),
        },
      );
      if (rpcError) throw rpcError;
      setDone((data as { status: "pending" | "confirmed" }).status);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Não foi possível concluir sua reserva.",
      );
    } finally {
      setSaving(false);
    }
  };
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={"Agendar " + service.title}
      className="fixed inset-0 z-[100] overflow-y-auto bg-ink/45 p-4 sm:p-8"
    >
      <div className="mx-auto my-4 w-full max-w-xl rounded-[28px] bg-white p-5 shadow-[0_28px_80px_rgba(18,40,58,.28)] sm:my-10 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">
              Agendar online
            </p>
            <h2 className="mt-2 font-display text-3xl font-semibold">
              {service.title}
            </h2>
            <p className="mt-2 font-body text-sm text-ash">
              {service.duration_minutes} min · {price(service)}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar agendamento"
            className="grid h-10 w-10 place-items-center rounded-full border border-line text-ash"
          >
            <X size={18} />
          </button>
        </div>
        {done ? (
          <div className="mt-7 rounded-2xl bg-[#E8F6ED] p-5">
            <Check size={22} className="text-[#276541]" />
            <h3 className="mt-3 font-display text-2xl font-semibold">
              {done === "confirmed" ? "Horário confirmado!" : "Pedido enviado!"}
            </h3>
            <p className="mt-2 font-body text-sm text-ash">
              {done === "confirmed"
                ? "Seu horário ficou reservado para " +
                  dateLabel(day) +
                  " às " +
                  timeLabel(slot) +
                  "."
                : "A profissional vai confirmar seu horário em breve."}
            </p>
            <button
              onClick={onClose}
              className="vello-primary bg-sky text-ink mt-5 h-11 rounded-full px-5 font-body text-sm font-semibold"
            >
              Concluir
            </button>
          </div>
        ) : (
          <>
            <label className="mt-7 block">
              <span className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[.08em] text-ash">
                Escolha o dia
              </span>
              <input
                type="date"
                min={localDate(new Date())}
                value={day}
                onChange={(event) => setDay(event.target.value)}
                className="h-12 w-full rounded-xl border border-line px-3 font-body text-sm"
              />
            </label>
            <div className="mt-5">
              <p className="font-body text-[11px] font-medium uppercase tracking-[.08em] text-ash">
                Horários em {dateLabel(day)}
              </p>
              {loading ? (
                <p className="mt-3 flex items-center gap-2 font-body text-sm text-ash">
                  <LoaderCircle size={16} className="animate-spin" /> Buscando
                  horários
                </p>
              ) : slots.length ? (
                <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setSlot(value)}
                      className={
                        "h-11 rounded-xl border font-body text-sm font-medium " +
                        (slot === value
                          ? "border-ink bg-ink text-paper"
                          : "border-line")
                      }
                    >
                      {timeLabel(value)}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="mt-3 rounded-xl bg-[#F7FAFC] p-4 font-body text-sm text-ash">
                  Não há horários livres neste dia. Escolha outra data.
                </p>
              )}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label>
                <span className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[.08em] text-ash">
                  Seu nome
                </span>
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="h-12 w-full rounded-xl border border-line px-3 font-body text-sm"
                />
              </label>
              <label>
                <span className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[.08em] text-ash">
                  WhatsApp
                </span>
                <input
                  inputMode="tel"
                  value={whatsapp}
                  onChange={(event) => setWhatsapp(event.target.value)}
                  className="h-12 w-full rounded-xl border border-line px-3 font-body text-sm"
                />
              </label>
            </div>
            <label className="mt-4 block">
              <span className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[.08em] text-ash">
                Observação opcional
              </span>
              <textarea
                value={notes}
                maxLength={500}
                onChange={(event) => setNotes(event.target.value)}
                className="min-h-24 w-full rounded-xl border border-line p-3 font-body text-sm"
              />
            </label>
            {error && (
              <p
                role="alert"
                className="mt-4 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-700"
              >
                {error}
              </p>
            )}
            <button
              type="button"
              disabled={saving || loading || !slot}
              onClick={book}
              className="vello-primary bg-sky text-ink mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 font-body text-sm font-semibold disabled:opacity-45"
            >
              {saving ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <CalendarDays size={17} />
              )}
              {saving ? "Confirmando..." : "Confirmar agendamento"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export function PublicServiceCatalog({ slug }: { slug: string }) {
  const [page, setPage] = useState<Page | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [booking, setBooking] = useState<Service | null>(null);
  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const { data } = await requireSupabase().rpc("get_public_page", {
          p_slug: slug,
        });
        if (active) setPage(data as Page | null);
      } catch {
        if (active) setPage(null);
      }
    })();
    return () => {
      active = false;
    };
  }, [slug]);
  if (page === undefined) return <LoadingScreen label="Abrindo serviços" />;
  if (!page) return <NotFound />;
  const location = [
    page.profile.address,
    page.profile.neighborhood,
    page.profile.city,
    page.profile.state,
  ]
    .filter(Boolean)
    .join(" · ");
  const share = async () => {
    try {
      if (navigator.share)
        await navigator.share({
          title: page.profile.professional_name,
          url: window.location.href,
        });
      else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {}
  };
  const catalogStyle =
    page.profile.catalog_theme?.property_style === "classic"
      ? "classic"
      : "editorial";
  return (
    <main className="min-h-screen bg-[#F7FAFC] text-ink">
      <header className="bg-[#F7FAFC]">
        <div className="mx-auto flex h-16 max-w-[1180px] items-center justify-between px-5 sm:h-[72px] sm:px-8">
          <a href={appPath("/")}>
            <Logo className="origin-left scale-[.78]" />
          </a>
          <button
            onClick={share}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 font-body text-sm font-medium shadow-[0_8px_24px_-20px_rgba(18,40,58,.55)] transition active:scale-[.97]"
          >
            <Share2 size={16} />{" "}
            <span className="hidden sm:inline">
              {copied ? "Link copiado" : "Compartilhar"}
            </span>
          </button>
        </div>
      </header>
      <section className="px-5 pb-6 pt-2 sm:px-8 sm:pb-8 sm:pt-4">
        <motion.div
          initial={{ opacity: 0, transform: "translateY(10px)" }}
          animate={{ opacity: 1, transform: "translateY(0)" }}
          transition={{ duration: 0.35, ease: [0.23, 1, 0.32, 1] }}
          className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[28px] border border-[#CFE0EB] bg-[#E8F1F8] p-5 shadow-[0_24px_60px_-48px_rgba(18,40,58,.42)] sm:rounded-[34px] sm:p-8"
        >
          <div aria-hidden="true" className="absolute -right-12 -top-20 h-52 w-52 rounded-full bg-white/45 blur-2xl" />
          <div aria-hidden="true" className="absolute -bottom-24 right-1/4 h-44 w-44 rounded-full bg-[#BFD9EB]/45 blur-3xl" />
          <div className="relative flex max-w-3xl items-center gap-4 sm:gap-6">
            <span className="grid h-[76px] w-[76px] shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-4 ring-white/80 shadow-[0_14px_30px_-20px_rgba(18,40,58,.55)] sm:h-24 sm:w-24">
              {page.profile.avatar_url ? (
                <img
                  src={page.profile.avatar_url}
                  alt={"Foto de " + page.profile.professional_name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img
                  src={appPath("/vello-onboarding-avatar-v2.jpg")}
                  alt="Imagem padrão da Vello"
                  className="h-full w-full object-cover"
                />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <p className="inline-flex rounded-full border border-white/80 bg-white/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[.14em] text-[#356D95] shadow-[0_6px_20px_-18px_rgba(18,40,58,.5)]">
                {page.profile.business_type === "clinica"
                  ? "Clínica de estética"
                  : "Estética e bem-estar"}
              </p>
              <h1 className="mt-2 truncate font-display text-[clamp(30px,5vw,48px)] font-semibold leading-[1.02] tracking-[-.04em]">
                {page.profile.professional_name}
              </h1>
              {location && (
                <p className="mt-2 flex items-center gap-1.5 font-body text-sm font-medium text-[#46677E]">
                  <MapPin size={14} aria-hidden="true" />
                  {location}
                </p>
              )}
            </div>
          </div>
          {page.profile.bio && (
            <p className="relative mt-5 max-w-2xl border-t border-white/70 pt-4 font-body text-[15px] leading-relaxed text-[#46677E] sm:ml-[120px] sm:mt-4">
              {page.profile.bio}
            </p>
          )}
        </motion.div>
      </section>
      <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">
            Serviços
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold">
            Escolha seu cuidado.
          </h2>
        </div>
        {page.services.length ? (
          <div className={catalogStyle === "classic" ? "mt-10 grid max-w-3xl gap-4" : "mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"}>
            {page.services.map((service) => (
              <article
                key={service.id}
                className={"overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_18px_45px_-40px_rgba(18,40,58,.28)] " + (catalogStyle === "classic" ? "sm:flex" : "")}
              >
                {service.images[0] ? (
                  <img
                    src={service.images[0].image_url}
                    alt={service.title}
                    className={"aspect-square w-full object-cover " + (catalogStyle === "classic" ? "sm:w-56 sm:shrink-0" : "")}
                  />
                ) : (
                  <div
                    role="img"
                    aria-label={
                      "Imagem de " +
                      (categories[service.category] || "estética")
                    }
                    className={"aspect-square w-full bg-[#E8F1F8] " + (catalogStyle === "classic" ? "sm:w-56 sm:shrink-0" : "")}
                    style={categoryCover(service.category)}
                  />
                )}
                <div className={"flex min-h-64 flex-1 flex-col p-5 " + (catalogStyle === "classic" ? "sm:min-h-0" : "")}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-mono text-[10px] uppercase tracking-[.12em] text-stone">
                      {categories[service.category] || "Estética"}
                    </p>
                    <span className="inline-flex shrink-0 items-center gap-1 font-body text-xs text-ash">
                      <Clock3 size={13} />
                      {service.duration_minutes} min
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-2xl font-semibold">
                    {service.title}
                  </h3>
                  {service.description && (
                    <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-ash">
                      {service.description}
                    </p>
                  )}
                  <div className="mt-auto pt-6">
                    <p className="font-body text-base font-semibold">
                      {price(service)}
                    </p>
                    <button
                      type="button"
                      onClick={() => setBooking(service)}
                      className="vello-primary bg-sky text-ink mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full px-4 font-body text-sm font-semibold"
                    >
                      <CalendarDays size={16} />
                      Agendar horário
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[24px] border border-dashed border-line bg-white p-8 text-center sm:p-12">
            <p className="font-display text-2xl font-semibold">
              Novos cuidados em breve.
            </p>
            <p className="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-ash">
              Esta estética ainda está preparando os serviços que vai
              disponibilizar por aqui.
            </p>
          </div>
        )}
      </section>
      {booking && (
        <BookingDialog
          slug={slug}
          service={booking}
          onClose={() => setBooking(null)}
        />
      )}
    </main>
  );
}
