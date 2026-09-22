import { useEffect, useState, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowRight,
  AtSign,
  BellRing,
  CalendarCheck,
  CheckCheck,
  Eye,
  Feather,
  Hand,
  HandHeart,
  Headset,
  LayoutGrid,
  Link2,
  MapPin,
  MessageCircle,
  PersonStanding,
  Plus,
  QrCode,
  Scissors,
  Send,
  Share2,
  ShieldCheck,
  Sparkles,
  Syringe,
  Zap,
} from "lucide-react";
import { appPath, PUBLIC_CATALOG_DOMAIN } from "../lib/paths";
import { setJsonLd } from "../lib/seo";
import { Logo } from "./Logo";
import { Reveal } from "./Primitives";
import {
  AgendaScreen,
  AvailabilityCard,
  BookingDialogScreen,
  PublicCatalogScreen,
  PublicPhoneScreen,
  ReservationsCard,
  Scaled,
} from "./landing/AppScreens";

const signup = appPath("/cadastro");
const login = appPath("/login");
const support = appPath("/suporte");
const PRICE = 65.9;

type Category = { label: string; Icon: LucideIcon; tone: string; examples: string };

const categories: Category[] = [
  { label: "Facial", Icon: Sparkles, tone: "bg-sky-soft text-sky-deep", examples: "Limpeza de pele, peeling, hidratação" },
  { label: "Corporal", Icon: PersonStanding, tone: "bg-sky-soft text-sky-deep", examples: "Drenagem, modeladora, radiofrequência" },
  { label: "Depilação", Icon: Feather, tone: "bg-sky-soft text-sky-deep", examples: "Cera, laser, fotodepilação" },
  { label: "Sobrancelhas e cílios", Icon: Eye, tone: "bg-sky-soft text-sky-deep", examples: "Design, henna, lash lifting" },
  { label: "Unhas", Icon: Hand, tone: "bg-sky-soft text-sky-deep", examples: "Manicure, alongamento, spa dos pés" },
  { label: "Cabelo", Icon: Scissors, tone: "bg-sky-soft text-sky-deep", examples: "Corte, escova, hidratação capilar" },
  { label: "Massagem", Icon: HandHeart, tone: "bg-sky-soft text-sky-deep", examples: "Relaxante, pedras quentes, shiatsu" },
  { label: "Harmonização", Icon: Syringe, tone: "bg-sky-soft text-sky-deep", examples: "Toxina, preenchimento, bioestimulador" },
];

function CategoryIcon({ label, size = 40 }: { label: string; size?: number }) {
  const { Icon, tone } = categories.find((item) => item.label === label) ?? categories[0];
  return (
    <span className={`grid shrink-0 place-items-center rounded-[12px] ${tone}`} style={{ width: size, height: size }}>
      <Icon size={Math.round(size * 0.46)} strokeWidth={1.8} />
    </span>
  );
}

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
        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href={login}
            className="inline-flex h-10 items-center whitespace-nowrap rounded-full border border-line bg-white px-4 max-[359px]:px-3 transition active:scale-[.97] font-body text-[14px] font-semibold text-ink sm:h-auto sm:border-0 sm:bg-transparent sm:px-0 sm:text-[15px] sm:font-medium sm:text-ash sm:hover:text-ink"
          >
            Entrar
          </a>
          <span aria-hidden="true" className="hidden h-8 w-px bg-line sm:block" />
          <a
            href={signup}
            className="vello-action inline-flex h-10 items-center gap-2 whitespace-nowrap rounded-full bg-sky px-4 max-[359px]:px-3 font-body text-[14px] font-semibold text-ink md:h-11 md:px-5 md:text-[15px]"
          >
            <span>
              Começar<span className="max-[359px]:hidden"> grátis</span>
            </span>
            <ArrowRight className="vello-action-arrow max-[379px]:hidden" size={16} />
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

function DashboardMock() {
  return (
    <div className="absolute left-[18%] top-0 hidden w-[760px] overflow-hidden rounded-[16px] border border-line bg-white shadow-[0_40px_90px_-50px_rgba(18,40,58,.55)] lg:block">
      <Scaled scale={760 / 1180}>
        <AgendaScreen />
      </Scaled>
    </div>
  );
}

function PhoneMock() {
  return (
    <div className="absolute left-1/2 top-2 w-[270px] -translate-x-1/2 rounded-[40px] border-[7px] border-white bg-white shadow-[0_40px_80px_-40px_rgba(18,40,58,.7)] ring-1 ring-line lg:left-0 lg:top-24 lg:translate-x-0">
      <div className="relative h-[520px] overflow-hidden rounded-[33px] bg-[#F7FAFC]">
        <div aria-hidden="true" className="flex h-8 items-center justify-between px-6 font-body text-[11px] font-semibold">
          <span>9:41</span>
          <span className="h-5 w-20 rounded-full bg-ink" />
          <span className="text-[10px]">5G</span>
        </div>
        <Scaled scale={256 / 390}>
          <PublicPhoneScreen />
        </Scaled>
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
            <p className="mt-4 font-mono text-[12px] text-stone">{PUBLIC_CATALOG_DOMAIN}/seu-nome</p>
          </Reveal>
        </div>
        <div className="grid border-t border-mist md:grid-cols-2">
          <ShareCard
            title="Sua vitrine de serviços"
            text="Cada serviço com categoria, duração e preço. A cliente filtra e encontra o que procura em segundos."
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
  return (
    <div className="absolute left-8 top-10 origin-top-left -rotate-[3deg] overflow-hidden rounded-[16px] border border-line shadow-[0_30px_70px_-40px_rgba(18,40,58,.5)] md:left-12 md:top-12">
      <Scaled scale={0.56}>
        <PublicCatalogScreen />
      </Scaled>
    </div>
  );
}

function BookingVisual() {
  return (
    <div className="absolute inset-0 grid place-items-center">
      <div className="absolute h-[260px] w-[260px] rounded-full bg-sky/40 blur-[70px]" />
      <div className="relative scale-[.82] md:scale-100">
        <Scaled scale={0.6}>
          <BookingDialogScreen />
        </Scaled>
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
            text="Cada horário reservado sai da lista na hora. Você confirma, conclui ou cancela cada reserva com um toque."
            visual={
              <Scaled scale={0.56} className="w-[520px]">
                <ReservationsCard limit={2} />
              </Scaled>
            }
          />
          <SuiteCard
            border
            title="Seus horários, suas regras."
            text="Defina os dias e horários de atendimento. A página só oferece o que realmente está livre."
            visual={
              <Scaled scale={0.56}>
                <AvailabilityCard />
              </Scaled>
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
  const rows = [categories, [...categories].reverse()];
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
                {[...row, ...row].map(({ label, examples }, i) => (
                  <div
                    key={`${label}-${i}`}
                    aria-hidden={i >= row.length}
                    className="flex w-[300px] shrink-0 items-center gap-4 rounded-[14px] border border-line bg-white p-3 md:w-[360px]"
                  >
                    <CategoryIcon label={label} size={56} />
                    <span className="min-w-0">
                      <b className="block font-display text-[18px] font-medium tracking-[-.02em]">{label}</b>
                      <span className="block truncate font-body text-[13px] text-stone">{examples}</span>
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
        <div className="grid min-h-[420px] place-items-center overflow-hidden bg-[linear-gradient(160deg,#E8F1F8,#A9CDE6)] px-5 py-12 md:min-h-[480px]">
          <SupportChat />
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

const supportMessages = [
  { mine: true, text: "Oi! Como libero os horários de sábado?", time: "10:02" },
  { mine: false, text: "Oi! Em Configurações, abra Disponibilidade, ative o sábado e escolha o horário.", time: "10:03" },
  { mine: true, text: "Deu certo, já apareceu na minha página!", time: "10:05" },
  { mine: false, text: "Perfeito! Qualquer coisa é só chamar.", time: "10:05" },
];

function SupportChat() {
  return (
    <div
      aria-hidden="true"
      className="w-full max-w-[380px] overflow-hidden rounded-[22px] border border-white bg-white/90 shadow-[0_30px_70px_-36px_rgba(18,40,58,.6)] backdrop-blur"
    >
      <div className="flex items-center gap-3 border-b border-mist px-4 py-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-ink text-white">
          <Headset size={18} />
        </span>
        <span>
          <b className="block font-body text-[14px] font-semibold">Suporte Vello</b>
          <span className="flex items-center gap-1.5 font-body text-[12px] text-stone">
            <span className="h-2 w-2 rounded-full bg-[#2FB36B]" /> online agora
          </span>
        </span>
      </div>
      <div className="space-y-2.5 bg-paper/70 px-4 py-5">
        {supportMessages.map(({ mine, text, time }) => (
          <div key={text} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-[16px] px-3.5 py-2.5 font-body text-[13px] leading-snug text-ink ${
                mine ? "rounded-br-[4px] bg-sky" : "rounded-bl-[4px] border border-mist bg-white"
              }`}
            >
              {text}
              <span className="ml-2 inline-flex items-center gap-0.5 align-bottom text-[10px] text-ink/55">
                {time}
                {mine && <CheckCheck size={12} />}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 border-t border-mist px-3 py-3">
        <span className="flex-1 rounded-full bg-paper px-4 py-2.5 font-body text-[13px] text-stone">Escreva sua dúvida…</span>
        <span className="grid h-9 w-9 place-items-center rounded-full bg-ink text-white">
          <Send size={15} />
        </span>
      </div>
    </div>
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
      "Cada serviço tem categoria, duração e preço fixo, a partir de ou sob consulta. Fotos são opcionais.",
    ],
    [
      "Funciona para clínica com várias profissionais?",
      "Hoje cada conta tem uma agenda. Agendas para várias profissionais na mesma clínica estão nos nossos próximos passos.",
    ],
    ["Quanto custa?", `R$ ${money(PRICE)} por mês, sem taxa por agendamento. Os primeiros 7 dias são grátis.`],
  ];
  useEffect(
    () =>
      setJsonLd("vello-faq", {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map(([name, text]) => ({
          "@type": "Question",
          name,
          acceptedAnswer: { "@type": "Answer", text },
        })),
      }),
    // As perguntas são fixas; o efeito roda uma vez.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );
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
        <div className="relative flex flex-col overflow-hidden bg-[#CBE8FD] md:block">
          <img
            src={appPath("/landing/vello-cta-final.webp")}
            alt="Ilustração de uma mulher leve e feliz, cercada por fitas azuis e folhas"
            loading="lazy"
            className="order-last aspect-[4/3] w-full object-cover object-[82%_50%] md:absolute md:inset-0 md:aspect-auto md:h-full md:object-[right_center]"
          />
          <Reveal className="relative px-6 pb-4 pt-16 md:max-w-[560px] md:px-16 md:py-28">
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
