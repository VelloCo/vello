/*
 * Partes da página pública usadas também na pré-visualização de
 * Personalizar catálogo. Usam container queries (@2xl etc.) em vez de sm:,
 * para a prévia no painel mostrar o layout de celular mesmo em tela grande.
 * O elemento pai precisa da classe `@container`.
 */
import { CalendarDays, Clock3, MapPin } from "lucide-react";
import { appPath } from "../../lib/paths";
import {
  categoryCoverStyle,
  serviceCategoryNames,
  type Accent,
} from "../../lib/catalogStyle";

export type CardService = {
  id: string;
  title: string;
  description: string;
  category: string;
  price: string;
  minutes: number;
  imageUrl?: string;
};

export type HeaderProfile = {
  name: string;
  businessType: "autonoma" | "clinica" | null | undefined;
  location: string;
  bio: string | null | undefined;
  avatarUrl: string | null | undefined;
};

export function ProfileHeaderCard({ profile, accent }: { profile: HeaderProfile; accent: Accent }) {
  return (
    <div
      className="relative overflow-hidden rounded-[28px] border p-5 shadow-[0_24px_60px_-48px_rgba(18,40,58,.42)] @2xl:rounded-[34px] @2xl:p-8"
      style={{ backgroundColor: accent.header, borderColor: accent.border }}
    >
      <div aria-hidden="true" className="absolute -right-12 -top-20 h-52 w-52 rounded-full bg-white/45 blur-2xl" />
      <div
        aria-hidden="true"
        className="absolute -bottom-24 right-1/4 h-44 w-44 rounded-full opacity-45 blur-3xl"
        style={{ backgroundColor: accent.glow }}
      />
      <div className="relative flex max-w-3xl items-center gap-4 @2xl:gap-6">
        <span className="grid h-[76px] w-[76px] shrink-0 place-items-center overflow-hidden rounded-full bg-white ring-4 ring-white/80 shadow-[0_14px_30px_-20px_rgba(18,40,58,.55)] @2xl:h-24 @2xl:w-24">
          <img
            src={profile.avatarUrl || appPath("/vello-onboarding-avatar-v2.jpg")}
            alt={profile.avatarUrl ? "Foto de " + profile.name : "Imagem padrão da Vello"}
            className="h-full w-full object-cover"
          />
        </span>
        <div className="min-w-0 flex-1">
          <p
            className="inline-flex rounded-full border border-white/80 bg-white/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[.14em] shadow-[0_6px_20px_-18px_rgba(18,40,58,.5)]"
            style={{ color: accent.tag }}
          >
            {profile.businessType === "clinica" ? "Clínica de estética" : "Estética e bem-estar"}
          </p>
          <h1 className="mt-2 truncate font-display text-[clamp(30px,5cqi,48px)] font-semibold leading-[1.02] tracking-[-.04em]">
            {profile.name}
          </h1>
          {profile.location && (
            <p className="mt-2 flex items-center gap-1.5 font-body text-sm font-medium" style={{ color: accent.muted }}>
              <MapPin size={14} aria-hidden="true" />
              {profile.location}
            </p>
          )}
        </div>
      </div>
      {profile.bio && (
        <p
          className="relative mt-5 max-w-2xl border-t border-white/70 pt-4 font-body text-[15px] leading-relaxed @2xl:ml-[120px] @2xl:mt-4"
          style={{ color: accent.muted }}
        >
          {profile.bio}
        </p>
      )}
    </div>
  );
}

function BookButton({ accent, compact = false, onClick }: { accent: Accent; compact?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        "vello-primary inline-flex items-center justify-center gap-2 rounded-full font-body text-sm font-semibold " +
        (compact ? "h-10 shrink-0 px-4 @2xl:h-11 @2xl:px-5" : "h-11 w-full px-4")
      }
      style={{ backgroundColor: accent.button, color: accent.buttonText }}
    >
      <CalendarDays size={16} />
      {compact ? (
        <span>
          Agendar<span className="hidden @2xl:inline"> horário</span>
        </span>
      ) : (
        "Agendar horário"
      )}
    </button>
  );
}

function Cover({ service, list }: { service: CardService; list: boolean }) {
  const size = list ? "aspect-square h-24 w-24 shrink-0 self-start rounded-[18px] @2xl:h-40 @2xl:w-40" : "aspect-square w-full";
  return service.imageUrl ? (
    <img src={service.imageUrl} alt={service.title} className={size + " object-cover"} />
  ) : (
    <div
      role="img"
      aria-label={"Imagem de " + (serviceCategoryNames[service.category] || "estética")}
      className={size + " bg-[#E8F1F8]"}
      style={categoryCoverStyle(service.category)}
    />
  );
}

function Meta({ service, list }: { service: CardService; list: boolean }) {
  return (
    <div className={"flex items-center justify-between gap-3 " + (list ? "flex-wrap gap-y-1" : "")}>
      <p className="font-mono text-[10px] uppercase tracking-[.12em] text-stone">
        {serviceCategoryNames[service.category] || "Estética"}
      </p>
      <span className="inline-flex shrink-0 items-center gap-1 font-body text-xs text-ash">
        <Clock3 size={13} />
        {service.minutes} min
      </span>
    </div>
  );
}

export function ServiceCard({
  service,
  style,
  accent,
  onBook,
}: {
  service: CardService;
  style: "editorial" | "classic";
  accent: Accent;
  onBook?: () => void;
}) {
  if (style === "classic")
    return (
      <article className="flex gap-3 rounded-[24px] border border-line bg-white p-3 shadow-[0_18px_45px_-40px_rgba(18,40,58,.28)] @2xl:gap-5 @2xl:p-4">
        <Cover service={service} list />
        <div className="flex min-w-0 flex-1 flex-col py-0.5 @2xl:py-1">
          <Meta service={service} list />
          <h3 className="mt-1.5 font-display text-lg font-semibold leading-tight @2xl:mt-2 @2xl:text-2xl">
            {service.title}
          </h3>
          {service.description && (
            <p className="mt-1.5 line-clamp-2 font-body text-[13px] leading-relaxed text-ash @2xl:mt-2 @2xl:text-sm">
              {service.description}
            </p>
          )}
          <div className="mt-auto flex items-end justify-between gap-3 pt-3">
            <p className="min-w-0 font-body text-[15px] font-semibold leading-tight @2xl:text-base">{service.price}</p>
            <BookButton accent={accent} compact onClick={onBook} />
          </div>
        </div>
      </article>
    );
  return (
    <article className="overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_18px_45px_-40px_rgba(18,40,58,.28)]">
      <Cover service={service} list={false} />
      <div className="flex min-h-64 flex-1 flex-col p-5">
        <Meta service={service} list={false} />
        <h3 className="mt-3 font-display text-2xl font-semibold">{service.title}</h3>
        {service.description && (
          <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-ash">{service.description}</p>
        )}
        <div className="mt-auto pt-6">
          <p className="font-body text-base font-semibold">{service.price}</p>
          <div className="mt-4">
            <BookButton accent={accent} onClick={onBook} />
          </div>
        </div>
      </div>
    </article>
  );
}

export function ServiceList({
  services,
  style,
  accent,
  onBook,
}: {
  services: CardService[];
  style: "editorial" | "classic";
  accent: Accent;
  onBook?: (service: CardService) => void;
}) {
  return (
    <div className={style === "classic" ? "grid max-w-3xl gap-4" : "grid gap-5 @2xl:grid-cols-2 @5xl:grid-cols-3"}>
      {services.map((service) => (
        <ServiceCard
          key={service.id}
          service={service}
          style={style}
          accent={accent}
          onBook={onBook ? () => onBook(service) : undefined}
        />
      ))}
    </div>
  );
}
