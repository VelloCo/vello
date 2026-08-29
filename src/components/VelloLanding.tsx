import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Bell, Building2, FolderHeart, Heart, Home, MapPin, Menu, Palette, Plus, Search, Share2, SlidersHorizontal, Smartphone, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { appPath } from '../lib/paths';
import { Logo } from './Logo';
import { Container } from './Primitives';

const ease = [0.4, 0, 0.2, 1] as const;

const navigation = [
  { label: 'Início', href: '#inicio' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Contato', href: '#contato' },
];

export function VelloLanding() {
  return (
    <div className="overflow-x-hidden bg-[#070707] text-white">
      <LandingHeader />
      <main>
        <Hero />
        <Numbers />
        <FeatureCenter />
        <EverydayFeatures />
        <ClosingCall />
      </main>
      <LandingFooter />
    </div>
  );
}

function LandingHeader() {
  const [open, setOpen] = useState(false);

  const goTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="absolute inset-x-0 top-0 z-50 bg-[#070707]/90 backdrop-blur-xl">
      <Container className="flex h-[76px] items-center justify-between md:h-[82px]">
        <a href="#inicio" aria-label="Vello — início"><Logo variant="light" /></a>

        <nav className="hidden items-center gap-8 md:flex">
          {navigation.map((item, index) => (
            <button
              key={item.href}
              type="button"
              onClick={() => goTo(item.href)}
              className={`font-body text-[14px] transition-colors ${index === 0 ? 'font-semibold text-white' : 'text-white/62 hover:text-white'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <a href={appPath('/login')} className="font-body text-[14px] text-white/62 transition-colors hover:text-white">Entrar</a>
          <a href={appPath('/cadastro')} className="rounded-full bg-white px-5 py-3 font-body text-[14px] font-semibold text-black shadow-[0_0_28px_rgba(255,255,255,0.14)] transition-transform hover:scale-[1.02]">
            Criar catálogo
          </a>
        </div>

        <div className="flex items-center gap-3 md:hidden">
          <a href={appPath('/cadastro')} className="rounded-full bg-white px-4 py-2.5 font-body text-[12px] font-semibold text-black">Começar</a>
          <button type="button" aria-label={open ? 'Fechar menu' : 'Abrir menu'} onClick={() => setOpen((value) => !value)} className="grid h-10 w-10 place-items-center rounded-full border border-white/15">
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </Container>

      {open && (
        <div className="border-t border-white/10 bg-[#070707] px-6 py-7 md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
            {navigation.map((item) => <button key={item.href} type="button" onClick={() => goTo(item.href)} className="text-left font-display text-[27px] font-semibold tracking-[-0.045em]">{item.label}</button>)}
            <a href={appPath('/login')} className="pt-2 font-body text-[14px] text-white/55">Já tenho uma conta</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative min-h-[850px] overflow-hidden bg-[#070707] pt-[142px] sm:min-h-[920px] md:pt-[160px] lg:min-h-[980px]">
      <Container className="relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 22 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.58, ease }} className="relative z-20">
          <h1 className="mx-auto max-w-[1000px] font-display text-[clamp(43px,5.4vw,72px)] font-medium leading-[1.02] tracking-[-0.064em]">
            Apresente seus imóveis.<br />
            <span className="text-white drop-shadow-[0_0_22px_rgba(255,255,255,0.25)]">Conquiste mais confiança.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-[760px] font-body text-[15px] leading-relaxed text-white/52 md:text-[17px]">
            Catálogo, imóveis e seleções personalizadas em uma experiência simples, profissional e pronta para compartilhar.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href={appPath('/cadastro')} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-body text-[14px] font-semibold text-black shadow-[0_0_30px_rgba(255,255,255,0.16)] transition-transform hover:scale-[1.02]">
              Criar meu catálogo <ArrowRight size={15} />
            </a>
            <a href={appPath('/jose')} className="rounded-full border border-white/20 px-6 py-3.5 font-body text-[14px] font-medium text-white transition-colors hover:bg-white/10">Ver demonstração</a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 34 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.75, ease }} className="relative z-10 mx-auto mt-12 h-[410px] max-w-[1120px] sm:mt-14 sm:h-[500px] lg:h-[570px]">
          <PhoneStage mode="hero" />
        </motion.div>
      </Container>
    </section>
  );
}

function Numbers() {
  const items = [
    ['1 link', 'para apresentar seu catálogo e atender melhor'],
    ['3 passos', 'para configurar, cadastrar e compartilhar'],
    ['100%', 'pensado para funcionar no celular'],
  ];

  return (
    <section id="como-funciona" className="bg-[#070707] pb-28 pt-10 md:pb-40 md:pt-24">
      <Container>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Do cadastro ao compartilhamento</p>
          <h2 className="mx-auto mt-5 max-w-[930px] font-display text-[clamp(40px,4.9vw,66px)] font-medium leading-[1.03] tracking-[-0.06em]">
            Uma apresentação profissional, sem complicar sua rotina.
          </h2>
        </div>

        <div className="mt-20 grid gap-14 md:grid-cols-3 md:gap-0">
          {items.map(([number, description], index) => (
            <div key={number} className={`min-h-[190px] md:px-11 ${index > 0 ? 'md:border-l md:border-white/10' : ''} ${index === 1 ? 'md:pt-16' : ''}`}>
              <p className="font-display text-[clamp(54px,5.7vw,78px)] font-medium leading-none tracking-[-0.07em]">{number}</p>
              <p className="mt-4 max-w-[280px] font-body text-[15px] leading-relaxed text-white/46">{description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureCenter() {
  const features = [
    { icon: Smartphone, title: 'Painel inteligente', description: 'Gerencie imóveis e seleções em um só lugar.' },
    { icon: Building2, title: 'Imóveis organizados', description: 'Fotos, valores e detalhes sempre prontos.' },
    { icon: FolderHeart, title: 'Seleções por cliente', description: 'Uma página específica para cada oportunidade.' },
    { icon: Palette, title: 'Visual personalizável', description: 'Seu catálogo alinhado à sua apresentação.' },
  ];

  return (
    <section id="recursos" className="bg-[#070707] py-24 md:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.98fr_1.02fr] lg:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Tudo em um só lugar</p>
            <h2 className="mt-5 max-w-[640px] font-display text-[clamp(43px,4.8vw,64px)] font-medium leading-[1] tracking-[-0.06em]">
              Seu centro de apresentação imobiliária.
            </h2>

            <div className="mt-14 grid gap-x-10 gap-y-11 sm:grid-cols-2">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.title}>
                    <span className="grid h-12 w-12 place-items-center rounded-[13px] border border-white/35 bg-white text-black shadow-[0_0_26px_rgba(255,255,255,0.38)]"><Icon size={20} strokeWidth={1.9} /></span>
                    <h3 className="mt-5 font-display text-[21px] font-semibold tracking-[-0.04em]">{feature.title}</h3>
                    <p className="mt-2 max-w-[260px] font-body text-[14px] leading-relaxed text-white/44">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-[34px] border border-white/[0.08] bg-[#151515] sm:min-h-[640px]">
            <PhoneStage mode="panel" />
          </div>
        </div>
      </Container>
    </section>
  );
}

function EverydayFeatures() {
  return (
    <section className="bg-[#070707] py-24 md:py-36">
      <Container>
        <div className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Feito para o dia a dia</p>
          <h2 className="mx-auto mt-5 max-w-[930px] font-display text-[clamp(41px,4.7vw,64px)] font-medium leading-[1.02] tracking-[-0.058em]">
            Tudo o que você precisa para apresentar melhor.
          </h2>
          <p className="mx-auto mt-5 max-w-[690px] font-body text-[15px] leading-relaxed text-white/44">
            Do catálogo público às seleções personalizadas, cada recurso foi pensado para deixar a conversa com o cliente mais clara.
          </p>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <article className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#161616]">
            <NetworkGraphic />
            <div className="p-7 sm:p-9">
              <h3 className="font-display text-[28px] font-semibold tracking-[-0.05em]">Seu catálogo, uma visão.</h3>
              <p className="mt-3 max-w-[500px] font-body text-[14px] leading-relaxed text-white/44">Imóveis, filtros, perfil e atendimento reunidos em uma vitrine simples de navegar.</p>
            </div>
          </article>

          <article className="overflow-hidden rounded-[28px] border border-white/[0.08] bg-[#161616]">
            <SelectionGraphic />
            <div className="p-7 sm:p-9">
              <h3 className="font-display text-[28px] font-semibold tracking-[-0.05em]">Uma seleção para cada cliente.</h3>
              <p className="mt-3 max-w-[500px] font-body text-[14px] leading-relaxed text-white/44">Escolha as melhores opções e compartilhe uma página feita para aquela conversa.</p>
            </div>
          </article>
        </div>
      </Container>
    </section>
  );
}

function NetworkGraphic() {
  return (
    <div className="relative h-[330px] overflow-hidden border-b border-white/[0.08] bg-[#111] sm:h-[390px]">
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,.14)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.14)_1px,transparent_1px)] [background-size:64px_64px]" />
      <div className="absolute inset-x-[14%] top-1/2 h-px bg-white/18" />
      <div className="absolute left-1/2 top-[18%] h-[64%] w-px bg-white/18" />
      <span className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/50 bg-white text-black shadow-[0_0_52px_rgba(255,255,255,0.48)]"><Logo variant="dark" /></span>
      <span className="absolute left-[13%] top-[38%] grid h-14 w-14 place-items-center rounded-full border border-white/35 bg-white text-black shadow-[0_0_28px_rgba(255,255,255,0.34)]"><Share2 size={20} /></span>
      <span className="absolute right-[13%] top-[38%] grid h-14 w-14 place-items-center rounded-full border border-white/35 bg-white text-black shadow-[0_0_28px_rgba(255,255,255,0.34)]"><Building2 size={20} /></span>
      <span className="absolute left-1/2 top-[14%] grid h-14 w-14 -translate-x-1/2 place-items-center rounded-full border border-white/35 bg-white text-black shadow-[0_0_28px_rgba(255,255,255,0.34)]"><Search size={20} /></span>
    </div>
  );
}

function SelectionGraphic() {
  const bars = [42, 29, 70, 50, 25, 44];
  return (
    <div className="relative h-[330px] overflow-hidden border-b border-white/[0.08] bg-[#111] px-8 pb-8 pt-14 sm:h-[390px] sm:px-12">
      <div className="absolute left-[38%] top-8 z-10 rounded-[14px] border border-white/40 bg-white px-4 py-3 text-black shadow-[0_0_34px_rgba(255,255,255,0.42)]">
        <p className="font-mono text-[9px] uppercase tracking-[0.12em] text-black/50">Seleções criadas</p><p className="mt-1 font-display text-[22px] font-semibold">12</p>
      </div>
      <div className="absolute inset-x-8 bottom-8 top-14 flex items-end justify-between border-b border-white/15 sm:inset-x-12">
        {bars.map((height, index) => <span key={index} style={{ height: `${height}%` }} className={`w-[11%] rounded-t-[8px] ${index === 2 ? 'border border-white/50 bg-[repeating-linear-gradient(135deg,#fff_0,#fff_4px,#777_4px,#777_8px)] shadow-[0_0_34px_rgba(255,255,255,0.35)]' : 'bg-white/38'}`} />)}
      </div>
    </div>
  );
}

function ClosingCall() {
  return (
    <section id="contato" className="bg-[#070707] pb-8 pt-20 md:pb-10 md:pt-28">
      <Container>
        <div className="relative min-h-[820px] overflow-hidden rounded-[34px] border border-white/[0.08] bg-[#171717] p-7 sm:min-h-[760px] sm:p-12 lg:min-h-[450px] lg:p-14">
          <div className="relative z-20 max-w-[550px] lg:pt-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Sua vitrine começa aqui</p>
            <h2 className="mt-5 font-display text-[clamp(42px,4.7vw,62px)] font-medium leading-[1] tracking-[-0.062em]">Apresente seus imóveis melhor, a partir de hoje.</h2>
            <p className="mt-5 max-w-[450px] font-body text-[15px] leading-relaxed text-white/46">Crie sua conta, organize seu catálogo e transforme cada conversa em uma apresentação profissional.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={appPath('/cadastro')} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-body text-[14px] font-semibold text-black shadow-[0_0_28px_rgba(255,255,255,0.16)]">Criar meu catálogo <ArrowRight size={15} /></a>
              <a href={appPath('/jose')} className="rounded-full border border-white/20 px-6 py-3.5 font-body text-[14px] font-medium text-white">Ver demonstração</a>
            </div>
          </div>

          <PhoneStage mode="cta" />
        </div>
      </Container>
    </section>
  );
}

function PhoneStage({ mode }: { mode: 'hero' | 'panel' | 'cta' }) {
  const reduceMotion = useReducedMotion();
  const lineCenter = mode === 'cta'
    ? 'left-1/2 top-[82%] lg:left-[76%] lg:top-[55%]'
    : 'left-1/2 top-[56%]';
  const phones = mode === 'hero'
    ? 'bottom-[6px] left-1/2 w-[76%] max-w-[280px] -translate-x-1/2 sm:max-w-none sm:w-[340px] lg:w-[380px]'
    : mode === 'panel'
      ? 'bottom-[10px] left-1/2 w-[82%] max-w-[340px] -translate-x-1/2 sm:max-w-none sm:w-[400px]'
      : 'bottom-[12px] left-1/2 w-[80%] max-w-[300px] -translate-x-1/2 sm:max-w-none sm:w-[360px] lg:bottom-[4px] lg:left-[77%] lg:w-[270px]';
  const phoneFade = mode === 'hero'
    ? 'from-[#070707] via-[#070707]/92'
    : mode === 'panel'
      ? 'from-[#151515] via-[#151515]/92'
      : 'from-[#171717] via-[#171717]/92';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden={mode === 'hero' ? undefined : true}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_46%_at_50%_67%,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0.025)_34%,transparent_72%)]" />
      <div className={`absolute ${lineCenter} h-[310px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.11] sm:h-[430px] sm:w-[900px]`} />
      <div className={`absolute ${lineCenter} h-[235px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.09] sm:h-[330px] sm:w-[700px]`} />
      <div className={`absolute ${lineCenter} h-[160px] w-[350px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.07] sm:h-[230px] sm:w-[520px]`} />

      <span className="absolute left-[8%] top-[37%] grid h-10 w-10 place-items-center rounded-full border border-white/18 bg-[#171717] text-white/80 shadow-[0_0_22px_rgba(255,255,255,0.08)] sm:left-[14%] sm:h-12 sm:w-12"><SlidersHorizontal size={16} /></span>
      <span className="absolute right-[9%] top-[28%] grid h-10 w-10 place-items-center rounded-full border border-white/18 bg-[#171717] text-white/80 shadow-[0_0_22px_rgba(255,255,255,0.08)] sm:right-[14%] sm:h-12 sm:w-12"><MapPin size={17} /></span>
      <span className="absolute left-[3%] bottom-[23%] hidden h-12 w-12 place-items-center rounded-full border border-white/18 bg-[#171717] text-white/80 shadow-[0_0_22px_rgba(255,255,255,0.08)] sm:grid sm:left-[8%]"><Home size={18} /></span>
      <span className="absolute right-[2%] top-[54%] hidden h-12 w-12 place-items-center rounded-full border border-white/18 bg-[#171717] text-white/80 shadow-[0_0_22px_rgba(255,255,255,0.08)] sm:grid sm:right-[7%]"><Building2 size={18} /></span>
      <span className="absolute bottom-[14%] right-[5%] hidden h-12 w-12 place-items-center rounded-full border border-white/18 bg-[#171717] text-white/80 shadow-[0_0_22px_rgba(255,255,255,0.08)] sm:grid sm:right-[11%]"><Heart size={18} /></span>

      <span className="absolute left-[4%] top-[55%] h-2 w-2 rounded-full bg-white shadow-[0_0_18px_5px_rgba(255,255,255,0.48)] sm:left-[10%]" />
      <span className="absolute right-[14%] top-[18%] h-2 w-2 rounded-full bg-white shadow-[0_0_18px_5px_rgba(255,255,255,0.48)] sm:right-[22%]" />

      <div className={`absolute z-20 ${phones}`}>
        <motion.span
          aria-hidden="true"
          className="absolute -bottom-1 left-1/2 h-7 w-[70%] -translate-x-1/2 rounded-[50%] bg-black/70 blur-lg"
          animate={reduceMotion ? undefined : { opacity: [0.42, 0.26, 0.42], scaleX: [0.94, 1.04, 0.94] }}
          transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          role={mode === 'hero' ? 'img' : undefined}
          aria-label={mode === 'hero' ? 'Dashboard e catálogo público da Vello em celulares' : undefined}
          animate={reduceMotion ? undefined : { y: [0, -8, 0], rotate: [0, 0.35, 0] }}
          transition={{ duration: 6.4, repeat: Infinity, ease: 'easeInOut' }}
          className="relative z-10 aspect-[0.686/1] w-full [container-type:inline-size] drop-shadow-[0_34px_38px_rgba(0,0,0,0.72)]"
        >
          <CssPhonePair />
        </motion.div>
        <div className={`absolute inset-x-[-5%] bottom-[-2px] z-20 h-[24%] bg-gradient-to-t ${phoneFade} to-transparent`} />
      </div>
    </div>
  );
}

function CssPhonePair() {
  return (
    <div className="absolute inset-0">
      <PhoneShell className="left-[1%] top-[17%] z-10 h-[80%] w-[62%] -rotate-[1.4deg] opacity-95">
        <CatalogPhoneScreen />
      </PhoneShell>
      <PhoneShell className="left-[38%] top-0 z-20 h-[96%] w-[62%] rotate-[0.6deg]">
        <DashboardPhoneScreen />
      </PhoneShell>
    </div>
  );
}

function PhoneShell({ children, className }: { children: React.ReactNode; className: string }) {
  return (
    <div className={`absolute rounded-[10cqw] bg-[linear-gradient(110deg,#777_0%,#171717_8%,#050505_48%,#4a4a4a_96%)] p-[1.35cqw] shadow-[0_3cqw_8cqw_rgba(0,0,0,0.7),inset_0_0_0_0.22cqw_rgba(255,255,255,0.36)] ${className}`}>
      <span className="absolute -left-[0.55cqw] top-[15%] h-[9%] w-[0.8cqw] rounded-l-full bg-gradient-to-b from-[#676767] to-[#171717]" />
      <span className="absolute -left-[0.55cqw] top-[27%] h-[14%] w-[0.8cqw] rounded-l-full bg-gradient-to-b from-[#676767] to-[#171717]" />
      <div className="relative h-full overflow-hidden rounded-[8.6cqw] bg-[#090909] ring-[0.25cqw] ring-white/10">
        <div className="absolute left-1/2 top-[1.5cqw] z-30 h-[4.8cqw] w-[15cqw] -translate-x-1/2 rounded-full bg-black shadow-[inset_0_0_0_0.18cqw_rgba(255,255,255,0.04)]" />
        <div className="absolute inset-x-[5cqw] top-[2.05cqw] z-20 flex items-center justify-between font-mono text-[2.25cqw] font-semibold text-white/88">
          <span>9:41</span><span className="tracking-[-0.12em]">▮▮⌁</span>
        </div>
        {children}
      </div>
    </div>
  );
}

function PhoneHeader({ alert = false }: { alert?: boolean }) {
  return (
    <div className="flex items-center justify-between px-[4.2cqw] pt-[8.7cqw] text-white">
      <div className="flex items-center gap-[1.5cqw]"><span className="grid h-[5.5cqw] w-[5.5cqw] place-items-center rounded-full bg-white font-display text-[2.5cqw] font-black text-black">V</span><span className="font-display text-[3.2cqw] font-semibold tracking-[-0.04em]">Vello</span></div>
      {alert ? <Bell size="3.4cqw" strokeWidth={1.5} className="text-white/60" /> : <span className="grid h-[5.4cqw] w-[5.4cqw] place-items-center rounded-full border border-white/10 bg-white/[0.04]"><Share2 size="2.8cqw" /></span>}
    </div>
  );
}

function DashboardPhoneScreen() {
  return (
    <div className="h-full bg-[radial-gradient(circle_at_60%_25%,rgba(255,255,255,0.045),transparent_38%),#0a0a0a]">
      <PhoneHeader alert />
      <div className="px-[4.2cqw] pb-[12cqw] pt-[5.5cqw] text-white">
        <p className="font-body text-[2.45cqw] text-white/48">Boa tarde, Jose.</p>
        <h3 className="mt-[1cqw] font-display text-[5.4cqw] font-medium leading-[0.96] tracking-[-0.065em]">Seus imóveis estão<br />todos por aqui.</h3>
        <div className="mt-[4cqw] flex gap-[1.4cqw]">
          <span className="rounded-full border border-white/12 px-[2.4cqw] py-[1.45cqw] font-body text-[2cqw] font-semibold">Personalizar</span>
          <span className="flex items-center gap-[0.8cqw] rounded-full bg-white px-[2.5cqw] py-[1.45cqw] font-body text-[2cqw] font-semibold text-black"><Plus size="2.4cqw" /> Novo imóvel</span>
        </div>
        <div className="mt-[4cqw] grid grid-cols-2 gap-[1.5cqw]">
          {[['DISPONÍVEIS', '12'], ['RESERVADOS', '3'], ['VENDIDOS / ALUGADOS', '8'], ['TOTAL', '23']].map(([label, value]) => (
            <div key={label} className="rounded-[3.5cqw] border border-white/[0.08] bg-white/[0.035] p-[2.5cqw]">
              <p className="font-mono text-[1.45cqw] tracking-[0.1em] text-white/44">{label}</p>
              <p className="mt-[1.5cqw] font-display text-[5cqw] font-semibold tracking-[-0.05em]">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-[4.6cqw] flex items-end justify-between"><div><p className="font-display text-[4cqw] font-semibold tracking-[-0.045em]">Seus imóveis</p><p className="mt-[0.5cqw] font-body text-[2cqw] text-white/42">Os mais recentes do catálogo.</p></div><span className="border-b border-white/35 pb-[0.4cqw] font-body text-[1.8cqw]">Ver todos</span></div>
        <PropertyPhoneCard image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=90" />
      </div>
      <PhoneBottomNav />
    </div>
  );
}

function CatalogPhoneScreen() {
  return (
    <div className="h-full bg-[#0a0a0a]">
      <PhoneHeader />
      <div className="px-[4.2cqw] pb-[12cqw] pt-[4cqw] text-white">
        <div className="flex items-center gap-[2cqw] rounded-[4cqw] border border-white/10 bg-white/[0.035] p-[2.2cqw]"><span className="grid h-[7cqw] w-[7cqw] place-items-center rounded-full bg-white text-[3cqw] text-black">J</span><div><p className="font-display text-[2.8cqw] font-semibold">Jose</p><p className="font-body text-[1.7cqw] text-white/42">Corretor de imóveis · CRECI</p></div></div>
        <h3 className="mt-[5cqw] font-display text-[5cqw] font-medium tracking-[-0.06em]">Todos os imóveis</h3>
        <p className="mt-[1cqw] font-body text-[2cqw] text-white/42">Explore todas as opções disponíveis.</p>
        <div className="mt-[3.5cqw] flex items-center gap-[1.4cqw] rounded-full border border-white/10 bg-white/[0.04] px-[2.5cqw] py-[1.8cqw]"><Search size="2.4cqw" className="text-white/48" /><span className="font-body text-[1.9cqw] text-white/42">Onde você quer morar?</span></div>
        <div className="mt-[2cqw] flex gap-[1cqw]"><span className="rounded-full bg-white px-[2.3cqw] py-[1.25cqw] font-body text-[1.8cqw] font-semibold text-black">Todos</span>{['Comprar', 'Alugar'].map((item) => <span key={item} className="rounded-full border border-white/10 px-[2cqw] py-[1.25cqw] font-body text-[1.8cqw] text-white/55">{item}</span>)}</div>
        <div className="mt-[3.2cqw] space-y-[2cqw]">
          <CatalogPropertyCard image="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=90" title="Casa contemporânea" price="R$ 1.250.000" />
          <CatalogPropertyCard image="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=90" title="Apartamento no Moinhos" price="R$ 890.000" />
        </div>
      </div>
      <PhoneBottomNav />
    </div>
  );
}

function PropertyPhoneCard({ image }: { image: string }) {
  return <div className="relative mt-[2.5cqw] h-[20cqw] overflow-hidden rounded-[3.4cqw] border border-white/10"><img src={image} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" /><span className="absolute bottom-[2cqw] left-[2.2cqw] font-display text-[2.4cqw] font-semibold">Casa contemporânea</span><Heart size="3cqw" className="absolute right-[2cqw] top-[2cqw]" /></div>;
}

function CatalogPropertyCard({ image, title, price }: { image: string; title: string; price: string }) {
  return <div className="overflow-hidden rounded-[3.4cqw] border border-white/10 bg-white/[0.035]"><div className="relative h-[17cqw]"><img src={image} alt="" className="h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><Heart size="2.8cqw" className="absolute right-[1.8cqw] top-[1.6cqw]" /></div><div className="p-[2cqw]"><p className="font-display text-[2.5cqw] font-semibold">{title}</p><p className="mt-[0.7cqw] font-mono text-[2cqw] text-white/76">{price}</p></div></div>;
}

function PhoneBottomNav() {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex h-[10cqw] items-center justify-around border-t border-white/[0.07] bg-[#090909]/95 px-[2cqw] text-white/44 backdrop-blur-md">
      <Home size="3cqw" className="text-white" /><Building2 size="3cqw" /><span className="grid h-[7cqw] w-[7cqw] place-items-center rounded-full bg-white text-black"><Plus size="3.4cqw" /></span><Heart size="3cqw" /><UserRound size="3cqw" />
    </div>
  );
}

function LandingFooter() {
  return (
    <footer className="bg-[#070707] pb-5 pt-4">
      <Container>
        <div className="rounded-[30px] border border-white/[0.08] bg-[#171717] px-7 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr_0.65fr_1fr]">
            <div>
              <Logo variant="light" />
              <p className="mt-5 max-w-[330px] font-body text-[14px] leading-relaxed text-white/42">A plataforma para corretores apresentarem imóveis, criarem seleções e compartilharem oportunidades com mais profissionalismo.</p>
            </div>
            <FooterColumn title="Produto" links={[['Recursos', '#recursos'], ['Como funciona', '#como-funciona'], ['Demonstração', appPath('/jose')]]} />
            <FooterColumn title="Conta" links={[['Entrar', appPath('/login')], ['Criar conta', appPath('/cadastro')], ['Dashboard', appPath('/dashboard')]]} />
            <div>
              <p className="font-body text-[14px] font-semibold">Fale com a Vello</p>
              <a href="mailto:vellocorretores@gmail.com" className="mt-5 block font-body text-[14px] text-white/44 transition-colors hover:text-white">vellocorretores@gmail.com</a>
              <a href={appPath('/cadastro')} className="mt-6 inline-flex items-center gap-2 border-b border-white/30 pb-1 font-body text-[13px] font-semibold">Começar agora <ArrowRight size={13} /></a>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-3 border-t border-white/[0.08] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/28">© {new Date().getFullYear()} Vello</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-white/28">Feito para corretores que valorizam apresentação</p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: [string, string][] }) {
  return (
    <div>
      <p className="font-body text-[14px] font-semibold">{title}</p>
      <div className="mt-5 flex flex-col gap-3">
        {links.map(([label, href]) => <a key={label} href={href} className="font-body text-[14px] text-white/42 transition-colors hover:text-white">{label}</a>)}
      </div>
    </div>
  );
}
