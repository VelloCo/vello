/*
 * Réplicas estáticas das telas reais da Vello para a landing.
 * Copiam as classes de DashboardApp (Sidebar, AgendaPage, disponibilidade)
 * e PublicServiceCatalog (página pública e BookingDialog). Ao mudar essas
 * telas no app, atualize aqui também.
 */
import type { CSSProperties, ReactNode } from "react";
import {
  Ban,
  CalendarDays,
  Check,
  Clock3,
  ExternalLink,
  Home,
  MapPin,
  MessageCircle,
  Palette,
  Settings2,
  Share2,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";
import { appPath } from "../../lib/paths";
import { Logo } from "../Logo";

const logo = `${appPath("/vello-logo.png")}?v=4`;

/* Renderiza a tela no tamanho real e reduz com zoom, mantendo o texto nítido. */
export function Scaled({ scale, children, className = "", style }: { scale: number; children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div aria-hidden="true" className={className} style={{ zoom: scale, ...style }}>
      {children}
    </div>
  );
}

/* Capa padrão da Vello quando o serviço não tem foto (fundo azul com o símbolo). */
function ServiceCover({ className = "" }: { className?: string }) {
  return (
    <div
      className={`aspect-[4/3] w-full bg-[#E8F1F8] ${className}`}
      style={{ backgroundImage: `url(${logo})`, backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "30%" }}
    />
  );
}

/* ---------- Painel: Agenda ---------- */

const nav = [
  ["Início", Home],
  ["Serviços", Sparkles],
  ["Agenda", CalendarDays],
  ["Meu catálogo", ExternalLink],
] as const;
const navBottom = [
  ["Personalizar catálogo", Palette],
  ["Perfil", UserRound],
  ["Configurações", Settings2],
] as const;

const demoAppointments = [
  { name: "Mariana Costa", service: "Limpeza de pele profunda", time: "23 de set., 10:00", status: "pending", note: "Primeira vez, tenho pele sensível." },
  { name: "Juliana Alves", service: "Design de sobrancelhas", time: "23 de set., 14:00", status: "pending", note: "" },
  { name: "Carla Souza", service: "Drenagem linfática", time: "23 de set., 16:30", status: "confirmed", note: "" },
] as const;

const statusLabel = { pending: "Pendente", confirmed: "Confirmado" } as const;
const statusTone = { pending: "bg-[#FFF1D6] text-[#8C5A11]", confirmed: "bg-[#E8F1F8] text-[#245D85]" } as const;

function Sidebar() {
  return (
    <aside className="flex w-[248px] shrink-0 flex-col border-r border-line bg-white p-5">
      <span className="inline-flex items-center gap-2">
        <img src={logo} alt="" className="h-7 w-7 object-contain" />
        <b className="font-display text-xl text-ink">Vello</b>
      </span>
      <nav className="mt-12 space-y-1">
        {nav.map(([label, Icon]) => (
          <span
            key={label}
            className={`flex h-11 items-center gap-3 rounded-xl px-3 font-body text-sm ${label === "Agenda" ? "bg-ink font-semibold text-paper" : "text-ash"}`}
          >
            <Icon size={17} strokeWidth={1.8} />
            {label}
          </span>
        ))}
        <div className="h-6" />
        {navBottom.map(([label, Icon]) => (
          <span key={label} className="flex h-11 items-center gap-3 rounded-xl px-3 font-body text-sm text-ash">
            <Icon size={17} strokeWidth={1.8} />
            {label}
          </span>
        ))}
      </nav>
      <div className="mt-auto flex items-center gap-3 border-t border-line pt-4">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-cream font-display text-sm font-semibold">S</span>
        <span className="min-w-0">
          <b className="block truncate font-body text-sm text-ink">Studio Aurora</b>
          <small className="block truncate font-mono text-[10px] text-stone">Clínica</small>
        </span>
      </div>
    </aside>
  );
}

function AppointmentRow({ appointment }: { appointment: (typeof demoAppointments)[number] }) {
  const pending = appointment.status === "pending";
  return (
    <article className="py-5 first:pt-0">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#E8F1F8] font-display text-sm font-semibold text-ink">
            {appointment.name.slice(0, 1)}
          </span>
          <div className="min-w-0">
            <p className="font-body text-sm font-semibold text-ink">{appointment.name}</p>
            <p className="mt-1 font-body text-xs text-ash">{appointment.service}</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[.06em] text-stone">{appointment.time}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 font-mono text-[10px] uppercase tracking-wide ${statusTone[appointment.status]}`}>
          {statusLabel[appointment.status]}
        </span>
      </div>
      {appointment.note && <p className="mt-3 rounded-xl bg-cream px-3 py-2 font-body text-xs leading-relaxed text-ash">{appointment.note}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 font-body text-xs text-ash">
          <MessageCircle size={14} /> WhatsApp
        </span>
        {pending && (
          <span className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 font-body text-xs">
            <Check size={14} /> Confirmar
          </span>
        )}
        <span className="inline-flex h-9 items-center gap-1 rounded-full border border-line px-3 font-body text-xs">
          <Clock3 size={14} /> Concluir
        </span>
        <span className="inline-flex h-9 items-center gap-1 rounded-full border border-red-200 px-3 font-body text-xs text-red-700">
          <Ban size={14} /> Cancelar
        </span>
      </div>
    </article>
  );
}

export function ReservationsCard({ limit = 3 }: { limit?: number }) {
  return (
    <section className="rounded-[24px] border border-line bg-white p-6 shadow-[0_18px_45px_-38px_rgba(18,40,58,.28)]">
      <p className="font-display text-2xl font-semibold tracking-[-.035em]">Reservas</p>
      <p className="mt-1 font-body text-sm text-ash">Confira primeiro o que precisa da sua ação.</p>
      <div className="mt-5 flex gap-2">
        {[
          ["Para confirmar", 2, true],
          ["Hoje", 3, false],
          ["Próximas", 8, false],
          ["Histórico", 24, false],
        ].map(([label, count, active]) => (
          <span
            key={String(label)}
            className={`shrink-0 rounded-full border px-3 py-2 font-body text-xs font-medium ${active ? "border-ink bg-ink text-paper" : "border-line bg-white text-ash"}`}
          >
            {label} <span className="ml-1 opacity-65">{count}</span>
          </span>
        ))}
      </div>
      <div className="mt-5 divide-y divide-line">
        {demoAppointments.slice(0, limit).map((appointment) => (
          <AppointmentRow key={appointment.name} appointment={appointment} />
        ))}
      </div>
    </section>
  );
}

export function AgendaScreen() {
  return (
    <div className="flex w-[1180px] overflow-hidden bg-paper text-ink" style={{ height: 820 }}>
      <Sidebar />
      <main className="flex-1 px-10 py-10">
        <header className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Atendimentos</p>
            <h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.045em]">Sua agenda</h1>
            <p className="mt-2 font-body text-ash">Comece confirmando pedidos e acompanhe os próximos atendimentos.</p>
          </div>
          <span className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 font-body text-sm font-medium text-ash">
            <Settings2 size={15} /> Configurar agenda
          </span>
        </header>
        <section className="mt-8 grid grid-cols-2 gap-3">
          {[
            ["Para confirmar", 2, "pedidos aguardando sua resposta", "bg-[#FFF7E8]"],
            ["Hoje", 3, "atendimentos agendados", "bg-[#E8F1F8]"],
          ].map(([label, value, detail, tone]) => (
            <div key={String(label)} className={`rounded-[20px] border border-line p-5 ${tone}`}>
              <p className="font-mono text-[10px] uppercase tracking-[.14em] opacity-60">{label}</p>
              <p className="mt-3 font-display text-3xl font-semibold tracking-[-.04em]">{value}</p>
              <p className="mt-1 font-body text-xs opacity-65">{detail}</p>
            </div>
          ))}
        </section>
        <div className="mt-7">
          <ReservationsCard limit={2} />
        </div>
      </main>
    </div>
  );
}

/* ---------- Configurações: disponibilidade ---------- */

export function AvailabilityCard() {
  const hours = [
    ["Segunda", "09:00", "19:00", true],
    ["Terça", "09:00", "19:00", true],
    ["Quarta", "09:00", "19:00", true],
    ["Sábado", "09:00", "14:00", true],
    ["Domingo", "", "", false],
  ] as const;
  return (
    <div className="w-[560px] rounded-[24px] border border-line bg-white p-6 text-ink shadow-[0_18px_45px_-38px_rgba(18,40,58,.28)]">
      <p className="font-display text-xl font-semibold">Agenda e reservas</p>
      <p className="mt-1 font-body text-sm text-ash">Escolha quando clientes podem reservar e como cada reserva é confirmada.</p>
      <div className="mt-5 space-y-3">
        {hours.map(([day, start, end, on]) => (
          <div key={day} className="grid grid-cols-[1fr_120px_120px] gap-3 rounded-2xl border border-line p-3">
            <span className="flex items-center gap-3 font-body text-sm font-semibold">
              <span className={`grid h-4 w-4 place-items-center rounded-[4px] border ${on ? "border-black bg-black text-white" : "border-[#767676] bg-white"}`}>
                {on && <Check size={11} strokeWidth={3} />}
              </span>
              {day}
            </span>
            <span className={`flex h-11 items-center rounded-xl border border-line px-3 font-body text-sm ${on ? "" : "opacity-45"}`}>{start || "--:--"}</span>
            <span className={`flex h-11 items-center rounded-xl border border-line px-3 font-body text-sm ${on ? "" : "opacity-45"}`}>{end || "--:--"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Página pública ---------- */

const demoServices = [
  { title: "Limpeza de pele profunda", category: "Facial", minutes: 60, price: "R$ 150,00", description: "Extração, esfoliação e hidratação para uma pele limpa e renovada." },
  { title: "Drenagem linfática", category: "Corporal", minutes: 50, price: "R$ 120,00", description: "Massagem suave que reduz o inchaço e melhora a circulação." },
  { title: "Design de sobrancelhas", category: "Sobrancelhas e cílios", minutes: 40, price: "A partir de R$ 60,00", description: "Desenho personalizado respeitando o formato do seu rosto." },
];

function ServiceArticle({ service }: { service: (typeof demoServices)[number] }) {
  return (
    <article className="overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_18px_45px_-40px_rgba(18,40,58,.28)]">
      <ServiceCover />
      <div className="flex min-h-64 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-[.12em] text-stone">{service.category}</p>
          <span className="inline-flex shrink-0 items-center gap-1 font-body text-xs text-ash">
            <Clock3 size={13} />
            {service.minutes} min
          </span>
        </div>
        <h3 className="mt-3 font-display text-2xl font-semibold">{service.title}</h3>
        <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-ash">{service.description}</p>
        <div className="mt-auto pt-6">
          <p className="font-body text-base font-semibold">{service.price}</p>
          <span className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-4 font-body text-sm font-semibold text-paper">
            <CalendarDays size={16} />
            Agendar horário
          </span>
        </div>
      </div>
    </article>
  );
}

function PublicHeader({ mobile = false }: { mobile?: boolean }) {
  return (
    <header className="bg-[#F7FAFC]">
      <div className={`flex items-center justify-between ${mobile ? "h-16 px-5" : "h-[72px] px-8"}`}>
        <Logo className="origin-left scale-[.78]" />
        <span className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 font-body text-sm font-medium shadow-[0_8px_24px_-20px_rgba(18,40,58,.55)]">
          <Share2 size={16} />
          {!mobile && "Compartilhar"}
        </span>
      </div>
    </header>
  );
}

function PublicIntro({ mobile = false }: { mobile?: boolean }) {
  return (
    <section className={mobile ? "px-5 pb-6 pt-2" : "px-8 pb-8 pt-4"}>
      <div className={`relative overflow-hidden border border-[#CFE0EB] bg-[#E8F1F8] shadow-[0_24px_60px_-48px_rgba(18,40,58,.42)] ${mobile ? "rounded-[28px] p-5" : "rounded-[34px] p-8"}`}>
        <div className="absolute -right-12 -top-20 h-52 w-52 rounded-full bg-white/45 blur-2xl" />
        <div className="absolute -bottom-24 right-1/4 h-44 w-44 rounded-full bg-[#BFD9EB]/45 blur-3xl" />
        <div className={`relative flex items-center ${mobile ? "gap-4" : "gap-6"}`}>
          <span
            className={`grid shrink-0 place-items-center rounded-full bg-white font-display font-semibold text-ink ring-4 ring-white/80 shadow-[0_14px_30px_-20px_rgba(18,40,58,.55)] ${mobile ? "h-[76px] w-[76px] text-xl" : "h-24 w-24 text-2xl"}`}
          >
            SA
          </span>
          <div className="min-w-0 flex-1">
            <p className="inline-flex rounded-full border border-white/80 bg-white/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[.14em] text-[#356D95]">
              Clínica de estética
            </p>
            <h1 className={`mt-2 truncate font-display font-semibold leading-[1.02] tracking-[-.04em] ${mobile ? "text-[30px]" : "text-[48px]"}`}>Studio Aurora</h1>
            <p className="mt-2 flex items-center gap-1.5 font-body text-sm font-medium text-[#46677E]">
              <MapPin size={14} />
              Moinhos de Vento · Porto Alegre · RS
            </p>
          </div>
        </div>
        <p className={`relative mt-5 border-t border-white/70 pt-4 font-body text-[15px] leading-relaxed text-[#46677E] ${mobile ? "" : "ml-[120px] mt-4"}`}>
          Cuidados faciais e corporais com atendimento personalizado.
        </p>
      </div>
    </section>
  );
}

export function PublicPhoneScreen() {
  return (
    <div className="w-[390px] overflow-hidden bg-[#F7FAFC] text-ink" style={{ height: 1060 }}>
      <PublicHeader mobile />
      <PublicIntro mobile />
      <section className="px-5 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Serviços</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">Escolha seu cuidado.</h2>
          </div>
        </div>
        <p className="mt-3 font-body text-sm text-ash">3 serviços disponíveis</p>
        <div className="mt-8">
          <ServiceArticle service={demoServices[0]} />
        </div>
      </section>
    </div>
  );
}

export function PublicCatalogScreen() {
  return (
    <div className="w-[1120px] overflow-hidden bg-[#F7FAFC] text-ink">
      <PublicHeader />
      <section className="px-8 py-12">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Serviços</p>
            <h2 className="mt-3 font-display text-4xl font-semibold">Escolha seu cuidado.</h2>
          </div>
          <p className="font-body text-sm text-ash">3 serviços disponíveis</p>
        </div>
        <div className="mt-10 grid grid-cols-3 gap-5">
          {demoServices.map((service) => (
            <ServiceArticle key={service.title} service={service} />
          ))}
        </div>
      </section>
    </div>
  );
}

export function BookingDialogScreen() {
  const slots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  return (
    <div className="w-[576px] rounded-[28px] bg-white p-7 text-ink shadow-[0_28px_80px_rgba(18,40,58,.28)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.14em] text-stone">Agendar online</p>
          <h2 className="mt-2 font-display text-3xl font-semibold">Limpeza de pele profunda</h2>
          <p className="mt-2 font-body text-sm text-ash">60 min · R$ 150,00</p>
        </div>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-line text-ash">
          <X size={18} />
        </span>
      </div>
      <span className="mt-7 block">
        <span className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[.08em] text-ash">Escolha o dia</span>
        <span className="flex h-12 w-full items-center justify-between rounded-xl border border-line px-3 font-body text-sm">
          23/09/2026 <CalendarDays size={16} className="text-ash" />
        </span>
      </span>
      <div className="mt-5">
        <p className="font-body text-[11px] font-medium uppercase tracking-[.08em] text-ash">Horários em terça-feira, 23 de setembro</p>
        <div className="mt-3 grid grid-cols-4 gap-2">
          {slots.map((slot) => (
            <span
              key={slot}
              className={`grid h-11 place-items-center rounded-xl border font-body text-sm font-medium ${slot === "14:00" ? "border-ink bg-ink text-paper" : "border-line"}`}
            >
              {slot}
            </span>
          ))}
        </div>
      </div>
      <div className="mt-6 grid grid-cols-2 gap-4">
        {[
          ["Seu nome", "Maria Clara"],
          ["WhatsApp", "(51) 99999-4821"],
        ].map(([label, value]) => (
          <span key={label}>
            <span className="mb-2 block font-body text-[11px] font-medium uppercase tracking-[.08em] text-ash">{label}</span>
            <span className="flex h-12 w-full items-center rounded-xl border border-line px-3 font-body text-sm">{value}</span>
          </span>
        ))}
      </div>
      <span className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-ink px-5 font-body text-sm font-semibold text-paper">
        <CalendarDays size={17} />
        Confirmar agendamento
      </span>
    </div>
  );
}
