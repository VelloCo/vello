import { useState, type ReactNode } from "react";
import {
  ArrowRight,
  AtSign,
  BellRing,
  CalendarCheck,
  CalendarClock,
  Check,
  Clock,
  LayoutGrid,
  Link2,
  MapPin,
  MessageCircle,
  MousePointer2,
  Plus,
  QrCode,
  Share2,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { appPath } from "../lib/paths";
import { Logo } from "./Logo";
import { Reveal } from "./Primitives";

const signup = appPath("/cadastro");
const login = appPath("/login");
const support = appPath("/suporte");
const PRICE = 65.9;

const covers = [
  ["Facial", "facial"],
  ["Corporal", "corporal"],
  ["Depilação", "depilacao"],
  ["Sobrancelhas e cílios", "sobrancelhas-cilios"],
  ["Unhas", "unhas"],
  ["Cabelo", "cabelo"],
  ["Massagem", "massagem"],
] as const;

const cover = (file: string) => appPath(`/service-covers/${file}.jpg`);
const money = (value: number) => value.toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function VelloLandingEstetica() {
  return (
    <div className="min-h-screen overflow-x-clip bg-white pb-20 text-ink sm:pb-0">
      <Header />
      <main>
        <Hero />
        <Features />
        <PriceTeaser />
        <Hatch wide />
        <Share />
        <Hatch wide />
        <Suite />
        <Hatch wide />
        <Calculator />
        <Hatch wide />
        <Categories />
        <Hatch wide />
        <SupportBlock />
        <Hatch wide />
        <Faq />
        <Hatch wide />
        <Closing />
        <Hatch wide />
      </main>
      <Footer />
      <a
        href={signup}
        className="vello-action fixed inset-x-4 bottom-4 z-30 flex h-12 items-center justify-center gap-2 rounded-full bg-sky font-body text-[15px] font-semibold text-ink shadow-[0_18px_44px_rgba(18,40,58,.26)] sm:hidden"
      >
        Começar 7 dias grátis <ArrowRight className="vello-action-arrow" size={16} />
      </a>
    </div>
  );
}

/* ---------- Moldura ---------- */

function Frame({ children, className = "", wide = false }: { children: ReactNode; className?: string; wide?: boolean }) {
  return (
    <div className={`relative mx-auto w-full border-x border-mist ${wide ? "max-w-[1376px]" : "max-w-[1264px]"} ${className}`}>
      {children}
    </div>
  );
}

function Diamond({ className }: { className: string }) {
  return <span aria-hidden="true" className={`absolute z-10 h-[7px] w-[7px] rotate-45 border border-line bg-white ${className}`} />;
}

function Hatch({ wide = false }: { wide?: boolean }) {
  return (
    <div className="border-y border-mist">
      <Frame wide={wide} className="vello-hatch h-10 md:h-16">
        <Diamond className="-left-1 -top-1" />
        <Diamond className="-right-1 -top-1" />
        <Diamond className="-bottom-1 -left-1" />
        <Diamond className="-bottom-1 -right-1" />
      </Frame>
    </div>
  );
}

function Pill({ children, dark = false }: { children: ReactNode; dark?: boolean }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3.5 py-1.5 font-body text-[13px] font-medium ${
        dark ? "border-white/15 text-white/80" : "border-line bg-white text-ink"
      }`}
    >
      {children}
    </span>
  );
}

function PrimaryButton({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      className={`vello-action inline-flex h-12 items-center gap-3 rounded-full bg-sky pl-5 pr-3 font-body text-[15px] font-semibold text-ink shadow-[0_10px_24px_-14px_rgba(58,115,156,.8)] ${className}`}
    >
      {children}
      <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-white">
        <ArrowRight className="vello-action-arrow" size={14} strokeWidth={2.4} />
      </span>
    </a>
  );
}

function Heading({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={`balance font-display text-[clamp(36px,4.6vw,58px)] font-medium leading-[1.02] tracking-[-.045em] ${className}`}>
      {children}
    </h2>
  );
}

/* ---------- Cabeçalho ---------- */

function Header() {
  const links = [
    ["Recursos", "#recursos"],
    ["Divulgação", "#divulgacao"],
    ["Preço", "#preco"],
    ["Dúvidas", "#duvidas"],
  ];
  return (
    <header className="sticky top-0 z-40 border-b border-mist bg-white/85 backdrop-blur-xl">
      <Frame className="flex h-[72px] items-center justify-between px-5 md:h-[88px] md:px-10">
        <a href="#inicio" aria-label="Vello - início">
          <Logo className="origin-left scale-[.86]" />
        </a>
        <nav className="hidden items-center gap-9 font-body text-[15px] font-medium text-ash lg:flex">
          {links.map(([label, href]) => (
            <a key={href} href={href} className="vello-nav-link">
              {label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a href={login} className="hidden font-body text-[15px] font-medium text-ash hover:text-ink sm:inline">
            Entrar
          </a>
          <span aria-hidden="true" className="hidden h-8 w-px bg-line sm:block" />
          <a
            href={signup}
            className="vello-action inline-flex h-10 items-center gap-2 rounded-full bg-sky px-4 font-body text-[14px] font-semibold text-ink md:h-11 md:px-5 md:text-[15px]"
          >
            Começar grátis <ArrowRight className="vello-action-arrow" size={16} />
          </a>
        </div>
        <Diamond className="-bottom-1 -left-1" />
        <Diamond className="-bottom-1 -right-1" />
      </Frame>
    </header>
  );
}

/* ---------- Hero ---------- */

function Hero() {
  return (
    <section id="inicio">
      <Frame className="overflow-hidden rounded-b-[18px] bg-[linear-gradient(180deg,#fff_0%,#fff_46%,#E8F1F8_60%,#B9D6EA_78%,#7EAFD0_92%,#5F97C1_100%)]">
        <div className="grid gap-12 px-5 pb-0 pt-12 md:px-10 md:pt-20 lg:min-h-[720px] lg:grid-cols-[1fr_1.05fr] lg:gap-6 lg:pb-16">
          <Reveal y={14} className="relative z-10 lg:pt-10">
            <span className="inline-flex items-center gap-3 rounded-full border border-line bg-white py-2 pl-2 pr-4 font-body text-[13px] text-ash shadow-[0_6px_18px_-12px_rgba(18,40,58,.3)] md:text-[14px]">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-sky-soft text-sky-deep">
                <CalendarCheck size={15} />
              </span>
              <span>
                <b className="font-semibold text-ink">Novo:</b> agendamento online incluso no plano
              </span>
            </span>
            <h1 className="balance mt-8 font-display text-[clamp(40px,4.3vw,60px)] font-medium leading-[1.02] tracking-[-.05em]">
              Sua estética com agenda cheia.
              <span className="block text-sky-strong">A gente cuida do resto.</span>
            </h1>
            <p className="mt-7 max-w-[520px] font-body text-[17px] leading-relaxed text-ash md:text-[19px]">
              Página de serviços, agendamento online e agenda organizada para estéticas e profissionais da beleza.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <PrimaryButton href={signup}>Começar agora</PrimaryButton>
              <a
                href="#recursos"
                className="vello-action inline-flex h-12 items-center rounded-full border border-transparent bg-white px-5 font-body text-[15px] font-medium text-ink shadow-[0_8px_20px_-14px_rgba(18,40,58,.35)]"
              >
                Ver como funciona
              </a>
            </div>
            <div className="mt-12 grid max-w-[520px] gap-6 sm:grid-cols-2">
              <HeroPoint icon={<Zap size={18} />} title="Rápido" text="Sua página pronta em minutos." />
              <HeroPoint icon={<ShieldCheck size={18} />} title="Sem comissão" text="Nenhuma taxa por agendamento." />
            </div>
          </Reveal>
          <Reveal delay={0.1} y={24} className="relative min-h-[520px] lg:min-h-0">
            <DashboardMock />
            <PhoneMock />
          </Reveal>
        </div>
      </Frame>
    </section>
  );
}

function HeroPoint({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-white text-ink shadow-[0_6px_14px_-10px_rgba(18,40,58,.5)]">{icon}</span>
      <span>
        <b className="block font-display text-[16px] font-semibold">{title}</b>
        <span className="mt-1 block font-body text-[14px] text-charcoal">{text}</span>
      </span>
    </div>
  );
}

const agenda = [
  ["09:00", "Limpeza de pele profunda", "Ana Paula", true],
  ["10:30", "Design de sobrancelhas", "Juliana M.", false],
  ["14:00", "Drenagem linfática", "Carla S.", true],
  ["16:00", "Massagem relaxante", "Beatriz R.", true],
] as const;

function DashboardMock() {
  const week = [42, 58, 50, 74, 66, 88, 60];
  return (
    <div
      aria-hidden="true"
      className="absolute left-[18%] top-0 hidden w-[760px] overflow-hidden rounded-[16px] border border-line bg-white shadow-[0_40px_90px_-50px_rgba(18,40,58,.55)] lg:block"
    >
      <div className="flex">
        <div className="w-[180px] shrink-0 border-r border-mist bg-paper p-4">
          <img src={`${appPath("/vello-logo.png")}?v=4`} alt="" className="h-7 w-7 object-contain" />
          <div className="mt-5 rounded-[8px] border border-line bg-white px-3 py-2 font-body text-[11px] text-stone">Pesquisar</div>
          <div className="mt-5 space-y-1 font-body text-[12px] text-ash">
            {["Início", "Serviços", "Agenda", "Configurações"].map((item) => (
              <div key={item} className={`rounded-[8px] px-3 py-2 ${item === "Agenda" ? "bg-sky-soft font-semibold text-ink" : ""}`}>
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 p-6">
          <p className="font-body text-[12px] font-semibold text-ink">Agenda</p>
          <div className="mt-5 grid grid-cols-2 gap-4 border-b border-mist pb-5">
            <div>
              <p className="font-body text-[11px] text-stone">Atendimentos hoje</p>
              <p className="mt-1 font-display text-[30px] font-semibold tracking-[-.04em]">8</p>
            </div>
            <div>
              <p className="font-body text-[11px] text-stone">Previsto no dia</p>
              <p className="mt-1 font-display text-[30px] font-semibold tracking-[-.04em]">R$ 1.240,00</p>
            </div>
          </div>
          <div className="mt-4 flex gap-1 font-body text-[11px] text-ash">
            {["Para confirmar", "Hoje", "Esta semana", "Histórico"].map((tab, i) => (
              <span key={tab} className={`rounded-[6px] px-2.5 py-1 ${i === 1 ? "border border-line bg-white font-semibold text-ink" : ""}`}>
                {tab}
              </span>
            ))}
          </div>
          <div className="mt-4 rounded-[12px] border border-mist p-4">
            <p className="font-body text-[11px] text-stone">Agendamentos na semana</p>
            <div className="mt-3 flex h-[92px] items-end gap-3">
              {week.map((h, i) => (
                <div key={i} className="flex h-full flex-1 flex-col items-center justify-end gap-1.5">
                  <div className={`w-full rounded-t-[5px] ${i === 5 ? "bg-sky-strong" : "bg-sky/60"}`} style={{ height: `${h}%` }} />
                  <span className="font-body text-[9px] text-stone">{["S", "T", "Q", "Q", "S", "S", "D"][i]}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 divide-y divide-mist rounded-[12px] border border-mist">
            {agenda.slice(0, 3).map(([time, service, client, confirmed]) => (
              <div key={time} className="flex items-center gap-3 px-4 py-2.5 font-body text-[11px]">
                <span className="w-10 font-semibold text-ink">{time}</span>
                <span className="flex-1 text-ink">
                  {service} <span className="text-stone">· {client}</span>
                </span>
                <StatusChip confirmed={confirmed} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusChip({ confirmed, small = false }: { confirmed: boolean; small?: boolean }) {
  return (
    <span
      className={`shrink-0 rounded-full font-body font-medium ${small ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-0.5 text-[10px]"} ${
        confirmed ? "bg-sky-soft text-sky-deep" : "bg-[#FFF4E0] text-[#8A5A00]"
      }`}
    >
      {confirmed ? "Confirmado" : "Para confirmar"}
    </span>
  );
}

function PhoneMock() {
  const slots = ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"];
  return (
    <div
      aria-hidden="true"
      className="absolute left-1/2 top-2 w-[270px] -translate-x-1/2 rounded-[40px] border-[7px] border-white bg-white shadow-[0_40px_80px_-40px_rgba(18,40,58,.7)] ring-1 ring-line lg:left-0 lg:top-24 lg:translate-x-0"
    >
      <div className="overflow-hidden rounded-[33px] bg-paper">
        <div className="flex items-center justify-between px-6 pt-3 font-body text-[11px] font-semibold">
          <span>9:41</span>
          <span className="h-5 w-20 rounded-full bg-ink" />
          <span className="text-[10px]">5G</span>
        </div>
        <div className="flex items-center gap-2.5 px-4 pt-4">
          <span className="h-9 w-9 overflow-hidden rounded-full bg-sky-soft">
            <img src={appPath("/vello-onboarding-avatar.png")} alt="" className="h-full w-full object-cover" />
          </span>
          <span>
            <b className="block font-display text-[13px] font-semibold leading-tight">Studio Aurora</b>
            <span className="block font-body text-[10px] text-stone">Estética facial e corporal</span>
          </span>
        </div>
        <div className="mx-3 mt-3 overflow-hidden rounded-[16px] bg-white shadow-[0_8px_20px_-14px_rgba(18,40,58,.4)]">
          <img src={cover("facial")} alt="" className="h-[92px] w-full object-cover" />
          <div className="p-3">
            <p className="font-display text-[13px] font-semibold leading-tight">Limpeza de pele profunda</p>
            <p className="mt-1 flex items-center gap-1.5 font-body text-[10px] text-stone">
              <Clock size={10} /> 60 min · <b className="font-semibold text-ink">R$ 150,00</b>
            </p>
          </div>
        </div>
        <div className="px-3 pt-3">
          <p className="font-body text-[10px] font-semibold uppercase tracking-[.08em] text-stone">Escolha o dia</p>
          <div className="mt-2 grid grid-cols-4 gap-1.5">
            {[["Seg", "22"], ["Ter", "23"], ["Qua", "24"], ["Qui", "25"]].map(([d, n], i) => (
              <span key={n} className={`rounded-[10px] py-1.5 text-center font-body ${i === 1 ? "bg-ink text-white" : "bg-white text-ink"}`}>
                <span className="block text-[9px] opacity-70">{d}</span>
                <span className="block text-[13px] font-semibold">{n}</span>
              </span>
            ))}
          </div>
          <p className="mt-3 font-body text-[10px] font-semibold uppercase tracking-[.08em] text-stone">Horários livres</p>
          <div className="mt-2 grid grid-cols-3 gap-1.5">
            {slots.map((slot) => (
              <span
                key={slot}
                className={`rounded-[8px] border py-1.5 text-center font-body text-[11px] font-medium ${
                  slot === "14:00" ? "border-sky-strong bg-sky-soft text-ink" : "border-line bg-white text-ash"
                }`}
              >
                {slot}
              </span>
            ))}
          </div>
        </div>
        <div className="p-3 pb-5">
          <div className="rounded-full bg-sky py-2.5 text-center font-body text-[12px] font-semibold text-ink">Agendar terça, 14:00</div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Recursos ---------- */

function Features() {
  const items = [
    [<CalendarCheck key="a" size={22} />, "Agendamento online", "A cliente escolhe o serviço, o dia e um horário livre direto na sua página. Sem baixar app, sem criar conta."],
    [<LayoutGrid key="b" size={22} />, "Página de serviços", "Categorias, fotos, duração e preço fixo, a partir de ou sob consulta. Tudo pronto para abrir no celular."],
    [<BellRing key="c" size={22} />, "Confirmação do seu jeito", "Aceite os pedidos automaticamente ou confirme um por um. Você decide como a sua agenda funciona."],
  ] as const;
  return (
    <section id="recursos" className="scroll-mt-24">
      <Frame className="grid px-5 pt-16 md:grid-cols-3 md:px-10 md:pt-12">
        {items.map(([icon, title, text], i) => (
          <Reveal
            key={title}
            delay={i * 0.06}
            className={`pb-12 md:min-h-[300px] md:border-dashed md:border-line md:pb-0 ${i < 2 ? "md:border-r" : ""} ${i ? "md:pl-6" : ""} md:pr-6`}
          >
            <div className="border-l-[3px] border-sky pl-5 text-ink">
              <span className="block py-3">{icon}</span>
            </div>
            <h3 className="mt-8 pl-5 font-display text-[22px] font-medium tracking-[-.03em]">{title}</h3>
            <p className="mt-3 max-w-[340px] pl-5 font-body text-[15px] leading-[1.7] text-ash">{text}</p>
          </Reveal>
        ))}
      </Frame>
    </section>
  );
}

function PriceTeaser() {
  return (
    <section className="border-t border-mist">
      <Frame className="grid items-center gap-8 overflow-hidden px-5 py-16 md:grid-cols-[1fr_auto] md:px-16 md:py-24">
        <div aria-hidden="true" className="vello-dots absolute inset-y-0 right-0 w-1/2 [mask-image:linear-gradient(90deg,transparent,#000)]" />
        <Reveal className="relative">
          <h2 className="font-display text-[clamp(40px,4.6vw,56px)] font-medium tracking-[-.045em] text-sky-strong">Quanto custa?</h2>
          <p className="mt-4 font-body text-[17px] text-ash md:text-[18px]">Menos do que um atendimento por mês. Sem taxa por agendamento.</p>
        </Reveal>
        <a href="#preco" className="group relative inline-flex items-center gap-3 font-body text-[17px] font-semibold text-sky-deep">
          Ver o plano
          <span className="grid h-6 w-6 place-items-center rounded-full bg-sky-deep text-white transition-transform duration-200 group-hover:translate-x-1">
            <ArrowRight size={14} strokeWidth={2.4} />
          </span>
        </a>
      </Frame>
    </section>
  );
}

/* ---------- Divulgação ---------- */

function Share() {
  const chips = [
    [<AtSign key="i" size={16} />, "Instagram", "left-[6%] top-[14%]", "bg-[#FDE8F1] text-[#B4236A]"],
    [<MessageCircle key="w" size={16} />, "WhatsApp", "right-[7%] top-[9%]", "bg-[#E3F7EA] text-[#1E7B43]"],
    [<Link2 key="l" size={16} />, "Link na bio", "left-[2%] top-[46%]", "bg-sky-soft text-sky-deep"],
    [<QrCode key="q" size={16} />, "QR Code", "right-[3%] top-[40%]", "bg-[#EFEAFD] text-[#5B3FB3]"],
    [<MapPin key="m" size={16} />, "Google", "left-[11%] top-[74%]", "bg-[#FFF1E0] text-[#9A5A00]"],
    [<Share2 key="s" size={16} />, "Qualquer conversa", "right-[10%] top-[70%]", "bg-paper text-ink"],
  ] as const;
  return (
    <section id="divulgacao" className="scroll-mt-24">
      <Frame wide className="vello-dots overflow-hidden">
        <div className="relative px-5 py-20 text-center md:py-28">
          {chips.map(([icon, label, pos, tone]) => (
            <span
              key={label}
              className={`absolute hidden items-center gap-2.5 rounded-full border border-line bg-white py-2.5 pl-2.5 pr-5 font-body text-[17px] text-ink shadow-[0_14px_30px_-18px_rgba(18,40,58,.45)] xl:inline-flex ${pos}`}
            >
              <span className={`grid h-7 w-7 place-items-center rounded-full ${tone}`}>{icon}</span>
              {label}
            </span>
          ))}
          <Reveal className="relative mx-auto max-w-[720px]">
            <Pill>Divulgação</Pill>
            <Heading className="mt-6">
              Divulgue onde sua cliente já está. <span className="text-sky-strong">Ela agenda sozinha.</span>
            </Heading>
            <p className="mx-auto mt-6 max-w-[560px] font-body text-[17px] leading-relaxed text-ash">
              Um link só para o Instagram, o WhatsApp e o Google. Quem clica vê seus serviços e já escolhe o horário.
            </p>
            <div className="mt-9 flex justify-center">
              <PrimaryButton href={signup}>Criar minha página</PrimaryButton>
            </div>
            <p className="mt-4 font-mono text-[12px] text-stone">vellocorretores.vercel.app/seu-nome</p>
          </Reveal>
        </div>
        <div className="grid border-t border-mist md:grid-cols-2">
          <ShareCard
            title="Sua vitrine de serviços"
            text="Cada serviço com capa, duração e preço. Sem foto? A Vello usa uma capa ilustrada da categoria."
            visual={<CatalogVisual />}
          />
          <ShareCard
            title="Agendamento em três toques"
            text="Serviço, dia e horário. A cliente informa nome e WhatsApp e o pedido cai direto na sua Agenda."
            visual={<BookingVisual />}
            border
          />
        </div>
      </Frame>
    </section>
  );
}

function ShareCard({ title, text, visual, border = false }: { title: string; text: string; visual: ReactNode; border?: boolean }) {
  return (
    <Reveal className={`bg-white ${border ? "border-t border-mist md:border-l md:border-t-0" : ""}`}>
      <div className="relative h-[320px] overflow-hidden bg-paper/70 md:h-[400px]">{visual}</div>
      <div className="border-t border-mist px-6 py-7 md:px-8">
        <h3 className="font-display text-[22px] font-medium tracking-[-.03em]">{title}</h3>
        <p className="mt-2 max-w-[520px] font-body text-[15px] leading-[1.7] text-ash">{text}</p>
      </div>
    </Reveal>
  );
}

function CatalogVisual() {
  const services = [
    ["Limpeza de pele", "facial", "R$ 150"],
    ["Drenagem linfática", "corporal", "R$ 120"],
    ["Design de sobrancelhas", "sobrancelhas-cilios", "R$ 60"],
    ["Massagem relaxante", "massagem", "a partir de R$ 130"],
  ];
  return (
    <div
      aria-hidden="true"
      className="absolute left-8 top-10 w-[620px] origin-top-left -rotate-[4deg] rounded-[16px] border border-line bg-white p-5 shadow-[0_30px_70px_-40px_rgba(18,40,58,.5)] md:left-12 md:top-14"
    >
      <p className="font-body text-[10px] font-semibold uppercase tracking-[.1em] text-sky-deep">Studio Aurora</p>
      <p className="mt-1 font-display text-[22px] font-semibold tracking-[-.04em]">Nossos serviços</p>
      <div className="mt-3 flex gap-1.5">
        {["Todos", "Facial", "Corporal", "Sobrancelhas"].map((f, i) => (
          <span key={f} className={`rounded-full px-3 py-1 font-body text-[10px] ${i ? "border border-line text-ash" : "bg-ink text-white"}`}>
            {f}
          </span>
        ))}
      </div>
      <div className="mt-4 grid grid-cols-4 gap-2.5">
        {services.map(([name, file, price]) => (
          <div key={name} className="overflow-hidden rounded-[10px] border border-mist">
            <img src={cover(file)} alt="" className="aspect-square w-full object-cover" />
            <div className="p-2">
              <p className="font-body text-[10px] font-semibold leading-tight text-ink">{name}</p>
              <p className="mt-1 font-body text-[9px] text-stone">{price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingVisual() {
  return (
    <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
      <div className="absolute h-[260px] w-[260px] rounded-full bg-sky/40 blur-[70px]" />
      <div className="relative w-[340px] rounded-[20px] border border-white bg-white/90 p-5 shadow-[0_30px_70px_-36px_rgba(18,40,58,.55)] backdrop-blur">
        <p className="font-body text-[11px] text-stone">Terça, 23 de setembro</p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"].map((slot) => (
            <span
              key={slot}
              className={`rounded-[10px] border py-2 text-center font-body text-[13px] font-medium ${
                slot === "14:00" ? "border-sky-strong bg-sky-soft text-ink" : "border-line text-ash"
              }`}
            >
              {slot}
            </span>
          ))}
        </div>
        <div className="mt-4 flex items-center justify-between rounded-[12px] bg-paper px-3 py-2.5">
          <span className="font-body text-[12px] text-ash">Maria Clara · (51) 9••••-4821</span>
          <Check size={15} className="text-sky-deep" />
        </div>
        <div className="relative mt-4 rounded-full bg-sky py-3 text-center font-body text-[13px] font-semibold text-ink">
          Confirmar agendamento
          <MousePointer2 size={26} className="absolute -bottom-5 right-10 fill-white text-ink" />
        </div>
      </div>
    </div>
  );
}

/* ---------- Suíte ---------- */

function Suite() {
  return (
    <section>
      <Frame className="grid gap-8 px-5 py-20 md:grid-cols-2 md:items-center md:px-16 md:py-28">
        <Reveal>
          <Heading>
            Tudo o que a sua{" "}
            <span className="relative inline-block">
              estética
              <svg
                aria-hidden="true"
                viewBox="0 0 220 80"
                preserveAspectRatio="none"
                className="pointer-events-none absolute -left-5 -top-3 h-[calc(100%+24px)] w-[calc(100%+40px)] text-sky"
              >
                <path
                  d="M24 52C8 40 20 16 70 10C130 3 200 12 208 34C215 58 150 72 90 70C44 68 12 58 18 40"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            precisa num lugar só.
          </Heading>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="max-w-[540px] font-body text-[17px] leading-[1.75] text-ash">
            Serviços, horários de atendimento, pedidos e clientes organizados no mesmo painel. Menos tempo respondendo
            “tem horário?” no direct e mais tempo atendendo.
          </p>
        </Reveal>
      </Frame>
      <div className="border-t border-mist">
        <Frame className="grid md:grid-cols-2">
          <SuiteCard
            title="Nada de horário duplicado."
            text="Cada horário reservado sai da lista na hora. Duas clientes nunca marcam o mesmo horário."
            visual={
              <div className="relative w-[300px] space-y-2">
                {agenda.map(([time, service, client, confirmed], i) => (
                  <div
                    key={time}
                    className={`flex items-center gap-3 rounded-[12px] border border-line bg-white px-4 py-3 font-body text-[12px] shadow-[0_10px_24px_-20px_rgba(18,40,58,.6)] ${i === 1 ? "translate-x-5" : ""}`}
                  >
                    <span className="font-semibold">{time}</span>
                    <span className="flex-1 truncate text-ash">
                      {service} · {client}
                    </span>
                    <StatusChip confirmed={confirmed} small />
                  </div>
                ))}
              </div>
            }
          />
          <SuiteCard
            border
            title="Seus horários, suas regras."
            text="Defina os dias e horários de atendimento. A página só oferece o que realmente está livre."
            visual={
              <div className="w-[300px] rounded-[16px] border border-line bg-white p-4 shadow-[0_14px_30px_-22px_rgba(18,40,58,.6)]">
                {[
                  ["Segunda a sexta", "09:00 – 19:00", true],
                  ["Sábado", "09:00 – 14:00", true],
                  ["Domingo", "Fechado", false],
                ].map(([day, hours, on]) => (
                  <div key={String(day)} className="flex items-center justify-between border-b border-mist py-3 last:border-0">
                    <span>
                      <b className="block font-body text-[13px] font-semibold">{day}</b>
                      <span className="font-body text-[11px] text-stone">{hours}</span>
                    </span>
                    <span className={`flex h-6 w-11 items-center rounded-full p-0.5 ${on ? "justify-end bg-sky-strong" : "bg-line"}`}>
                      <span className="h-5 w-5 rounded-full bg-white shadow" />
                    </span>
                  </div>
                ))}
              </div>
            }
          />
        </Frame>
      </div>
    </section>
  );
}

function SuiteCard({ title, text, visual, border = false }: { title: string; text: string; visual: ReactNode; border?: boolean }) {
  return (
    <Reveal className={border ? "border-t border-mist md:border-l md:border-t-0" : ""}>
      <div className="vello-dots grid h-[300px] place-items-center overflow-hidden md:h-[340px]">{visual}</div>
      <div className="border-t border-mist px-6 py-7 md:px-8">
        <h3 className="font-display text-[22px] font-medium tracking-[-.03em]">{title}</h3>
        <p className="mt-2 font-body text-[15px] leading-[1.7] text-ash">{text}</p>
      </div>
    </Reveal>
  );
}

/* ---------- Calculadora (seção escura) ---------- */

function Calculator() {
  const [count, setCount] = useState(40);
  const perVisit = PRICE / count;
  return (
    <section id="preco" className="scroll-mt-24 bg-ink text-white">
      <div className="vello-dots-dark">
        <div className="mx-auto max-w-[1264px] px-5 py-20 text-center md:px-10 md:py-28">
          <Reveal>
            <h2 className="balance mx-auto max-w-[900px] font-display text-[clamp(36px,4.6vw,58px)] font-medium leading-[1.04] tracking-[-.045em]">
              Faça as contas e veja <span className="text-sky">quanto custa de verdade.</span>
            </h2>
            <p className="mx-auto mt-6 max-w-[560px] font-body text-[17px] leading-relaxed text-white/70">
              R$ {money(PRICE)} por mês, sem taxa por agendamento. Os primeiros 7 dias são grátis.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <PrimaryButton href={signup}>Começar 7 dias grátis</PrimaryButton>
              <a
                href={support}
                className="vello-action inline-flex h-12 items-center gap-2 rounded-full border border-white/25 px-5 font-body text-[15px] font-medium text-white hover:border-white"
              >
                <MessageCircle size={17} /> Falar com a gente
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.1} className="mx-auto mt-14 max-w-[720px] rounded-[20px] border border-white/15 bg-white/[.07] p-4 text-left backdrop-blur md:p-6">
            <div className="rounded-[14px] border border-white/10 bg-white/[.05] p-5 md:p-6">
              <label htmlFor="vello-atendimentos" className="font-body text-[14px] text-white/70">
                Quantos atendimentos você faz por mês?
              </label>
              <p className="mt-2 font-display text-[40px] font-semibold tracking-[-.04em]">
                {count} <span className="text-[20px] font-medium text-white/60">atendimentos</span>
              </p>
              <input
                id="vello-atendimentos"
                type="range"
                min={5}
                max={200}
                step={5}
                value={count}
                onChange={(event) => setCount(Number(event.target.value))}
                className="mt-4 w-full accent-[#7EAFD0]"
              />
            </div>
            <div className="mt-3 rounded-[14px] border border-white/10 bg-white/[.05] p-5 md:p-6">
              <p className="font-body text-[16px] font-semibold">A Vello sai por atendimento</p>
              <p className="mt-1 font-body text-[13px] text-white/55">Plano mensal dividido pelos seus atendimentos</p>
              <p className="mt-3 font-display text-[52px] font-semibold leading-none tracking-[-.045em] text-sky">
                <span className="mr-1 text-[24px]">R$</span>
                {money(perVisit)}
              </p>
              <div className="mt-5 space-y-2 border-t border-white/10 pt-4 font-body text-[13px]">
                <Row label="Plano Vello" value={`R$ ${money(PRICE)} / mês`} />
                <Row label="Taxa por agendamento" value="R$ 0,00" />
                <Row label="Primeira semana" value="Grátis" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-white/60">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

/* ---------- Categorias ---------- */

function Categories() {
  const rows = [covers, [...covers].reverse()];
  return (
    <section>
      <Frame wide className="vello-dots">
        <Reveal className="mx-auto max-w-[720px] px-5 py-20 text-center md:py-24">
          <Pill>Para quem é</Pill>
          <Heading className="mt-6">Feita para quem vive de cuidar da beleza.</Heading>
          <p className="mx-auto mt-6 max-w-[540px] font-body text-[17px] leading-relaxed text-ash">
            Autônomas, studios e clínicas de estética. Escolha as categorias e a Vello monta sua página.
          </p>
        </Reveal>
        <div className="space-y-4 border-t border-mist bg-paper/80 py-12">
          {rows.map((row, r) => (
            <div key={r} className="vello-marquee-row vello-fade-x overflow-hidden">
              <div className={`vello-marquee flex w-max gap-4 ${r ? "vello-marquee-reverse" : ""}`}>
                {[...row, ...row].map(([label, file], i) => (
                  <div
                    key={`${file}-${i}`}
                    aria-hidden={i >= row.length}
                    className="flex w-[300px] shrink-0 items-center gap-4 rounded-[14px] border border-line bg-white p-3 md:w-[360px]"
                  >
                    <img src={cover(file)} alt="" loading="lazy" className="h-16 w-16 rounded-[10px] object-cover" />
                    <span>
                      <b className="block font-display text-[18px] font-medium tracking-[-.02em]">{label}</b>
                      <span className="font-body text-[13px] text-stone">Capa pronta para os seus serviços</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Frame>
    </section>
  );
}

/* ---------- Suporte ---------- */

function SupportBlock() {
  return (
    <section>
      <Frame wide className="grid md:grid-cols-2">
        <div className="relative grid min-h-[360px] place-items-center overflow-hidden bg-[linear-gradient(160deg,#E8F1F8,#A9CDE6)] md:min-h-[480px]">
          <img
            src={appPath("/vello-onboarding-avatar.png")}
            alt="Ilustração de uma profissional de estética"
            loading="lazy"
            className="absolute bottom-0 h-[92%] w-auto object-contain"
          />
          <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 font-body text-[13px] font-medium shadow-[0_10px_24px_-16px_rgba(18,40,58,.6)] md:left-10 md:top-10">
            <Sparkles size={15} className="text-sky-deep" /> Oi! Posso ajudar?
          </span>
        </div>
        <Reveal className="flex flex-col justify-center px-6 py-16 md:px-16">
          <div>
            <Pill>Suporte</Pill>
          </div>
          <h2 className="balance mt-6 max-w-[420px] font-display text-[clamp(32px,3.6vw,44px)] font-medium leading-[1.08] tracking-[-.04em]">
            E tudo isso com um suporte que te responde de verdade.
          </h2>
          <p className="mt-5 max-w-[400px] font-body text-[16px] leading-[1.75] text-ash">
            Ficou com dúvida na configuração? A gente ajuda você a deixar sua página e sua agenda prontas.
          </p>
          <a href={support} className="mt-10 inline-flex items-center gap-1.5 font-body text-[15px] font-semibold text-sky-deep hover:underline">
            Falar com o suporte <ArrowRight size={15} />
          </a>
        </Reveal>
      </Frame>
    </section>
  );
}

/* ---------- Dúvidas ---------- */

function Faq() {
  const questions = [
    [
      "O que é a Vello e para quem ela serve?",
      "A Vello é uma página de serviços com agendamento online e agenda para estéticas: profissionais autônomas, studios e clínicas.",
    ],
    [
      "A cliente precisa baixar aplicativo ou criar conta?",
      "Não. Ela abre o seu link, escolhe o serviço, o dia e o horário e informa nome e WhatsApp. Pronto.",
    ],
    [
      "Posso aprovar cada agendamento antes?",
      "Sim. Você escolhe entre confirmação automática ou manual. Na manual, os pedidos ficam em “Para confirmar” na sua Agenda.",
    ],
    [
      "Como mostro os meus serviços e preços?",
      "Cada serviço tem categoria, duração, fotos e preço fixo, a partir de ou sob consulta. Sem foto, a Vello usa uma capa ilustrada da categoria.",
    ],
    [
      "Funciona para clínica com várias profissionais?",
      "Hoje cada conta tem uma agenda. Agendas para várias profissionais na mesma clínica estão nos nossos próximos passos.",
    ],
    ["Quanto custa?", `R$ ${money(PRICE)} por mês, sem taxa por agendamento. Os primeiros 7 dias são grátis.`],
  ];
  return (
    <section id="duvidas" className="scroll-mt-24">
      <Frame wide className="grid gap-12 px-5 py-20 md:px-16 md:py-28 lg:grid-cols-2">
        <Reveal>
          <Heading className="max-w-[520px]">Tem dúvidas? Relaxa, a gente responde.</Heading>
          <p className="mt-6 max-w-[480px] font-body text-[17px] leading-relaxed text-ash">
            Separamos as perguntas que mais recebemos. Não achou a sua?{" "}
            <a href={support} className="font-semibold text-sky-deep hover:underline">
              Fale com a gente
            </a>
            .
          </p>
        </Reveal>
        <Reveal delay={0.08} className="self-start border border-line">
          {questions.map(([question, answer]) => (
            <details key={question} className="group border-b border-line last:border-0">
              <summary className="flex cursor-pointer list-none items-center gap-5 px-6 py-6 font-display text-[18px] font-medium tracking-[-.02em] marker:hidden md:px-7">
                <Plus size={18} className="shrink-0 text-sky-strong transition-transform duration-200 group-open:rotate-45" />
                {question}
              </summary>
              <p className="-mt-2 px-6 pb-6 pl-[64px] font-body text-[15px] leading-[1.7] text-ash md:pl-[70px]">{answer}</p>
            </details>
          ))}
        </Reveal>
      </Frame>
    </section>
  );
}

/* ---------- Fechamento ---------- */

function Closing() {
  return (
    <section>
      <Frame wide className="px-0 md:px-[104px]">
        <div className="relative grid overflow-hidden bg-sky md:grid-cols-2">
          <div aria-hidden="true" className="vello-dots absolute inset-y-0 right-0 w-1/2 opacity-60 [mask-image:linear-gradient(90deg,transparent,#000)]" />
          <Reveal className="relative px-6 py-16 md:px-16 md:py-24">
            <h2 className="balance font-display text-[clamp(38px,4.4vw,54px)] font-medium leading-[1.02] tracking-[-.045em]">
              Chegou até aqui? Sua agenda merece a Vello.
            </h2>
            <p className="mt-6 max-w-[420px] font-body text-[17px] leading-relaxed text-charcoal">
              Crie sua conta, cadastre seus serviços e compartilhe o link hoje mesmo. Os 7 primeiros dias são por nossa conta.
            </p>
            <a
              href={signup}
              className="vello-action mt-10 inline-flex h-12 items-center gap-3 rounded-full bg-white pl-5 pr-3 font-body text-[15px] font-semibold text-ink"
            >
              Criar minha conta grátis
              <span className="grid h-6 w-6 place-items-center rounded-full bg-ink text-white">
                <ArrowRight className="vello-action-arrow" size={14} strokeWidth={2.4} />
              </span>
            </a>
          </Reveal>
          <div className="relative flex min-h-[320px] items-end justify-center">
            <div className="absolute right-8 top-10 hidden rotate-[4deg] items-center gap-3 rounded-[14px] bg-white p-3 pr-5 shadow-[0_18px_40px_-24px_rgba(18,40,58,.7)] sm:flex">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-sky-soft text-sky-deep">
                <CalendarClock size={18} />
              </span>
              <span>
                <b className="block font-body text-[13px] font-semibold">Novo agendamento</b>
                <span className="font-body text-[12px] text-stone">Terça, 14:00 · Limpeza de pele</span>
              </span>
            </div>
            <img
              src={appPath("/vello-onboarding-avatar.png")}
              alt=""
              aria-hidden="true"
              loading="lazy"
              className="relative h-[300px] w-auto object-contain md:h-[380px]"
            />
          </div>
        </div>
      </Frame>
    </section>
  );
}

function Footer() {
  const columns = [
    ["Conta", [["Criar conta", signup], ["Entrar", login]]],
    ["Produto", [["Agendamento online", "#recursos"], ["Página de serviços", "#divulgacao"], ["Preço", "#preco"], ["Dúvidas", "#duvidas"]]],
    ["Suporte", [["Central de suporte", support], ["Instagram", "https://instagram.com/velloestetica"]]],
    ["Legal", [["Termos de uso", appPath("/termos")], ["Privacidade", appPath("/privacidade")]]],
  ] as const;
  return (
    <footer>
      <Frame wide className="px-5 md:px-16">
        <div className="grid grid-cols-2 gap-10 py-16 md:grid-cols-4 md:py-20">
          {columns.map(([title, links]) => (
            <div key={title}>
              <h3 className="font-body text-[14px] font-semibold text-ink">{title}</h3>
              <ul className="mt-5 space-y-3.5">
                {links.map(([label, href]) => (
                  <li key={label}>
                    <a
                      href={href}
                      {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                      className="font-body text-[16px] text-ash hover:text-ink"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-4 border-t border-dashed border-line py-10 text-center">
          <Logo />
          <p className="font-body text-[13px] text-stone">© {new Date().getFullYear()} Vello · Agenda e serviços para estéticas</p>
        </div>
      </Frame>
    </footer>
  );
}
