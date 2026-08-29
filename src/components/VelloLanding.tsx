import { motion } from 'framer-motion';
import { ArrowRight, Building2, FolderHeart, Heart, Home, MapPin, Menu, Palette, Search, Share2, SlidersHorizontal, Smartphone, X } from 'lucide-react';
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
        <div className="relative min-h-[560px] overflow-hidden rounded-[34px] border border-white/[0.08] bg-[#171717] p-7 sm:p-12 lg:min-h-[450px] lg:p-14">
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
  const lineCenter = mode === 'cta'
    ? 'left-1/2 top-[82%] lg:left-[76%] lg:top-[55%]'
    : 'left-1/2 top-[56%]';
  const phonePosition = mode === 'hero'
    ? 'bottom-[-105px] w-[430px] sm:bottom-[-170px] sm:w-[600px] lg:bottom-[-205px] lg:w-[640px]'
    : mode === 'panel'
      ? 'bottom-[-40px] w-[500px] sm:bottom-[-25px] sm:w-[610px]'
      : 'bottom-[-245px] w-[500px] lg:bottom-[-175px] lg:left-[76%] lg:w-[560px]';

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden={mode === 'hero' ? undefined : true}>
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
      <span className="absolute bottom-[-60px] left-1/2 h-32 w-[72%] -translate-x-1/2 rounded-[50%] bg-white/15 blur-[55px]" />

      <img
        src={appPath('/landing/vello-phones-cutout-trimmed.png')}
        alt={mode === 'hero' ? 'Dois celulares exibindo o catálogo imobiliário da Vello' : ''}
        className={`absolute left-1/2 z-10 max-w-none -translate-x-1/2 ${phonePosition}`}
      />
      <div className={`absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t ${mode === 'hero' ? 'from-[#070707]' : mode === 'panel' ? 'from-[#151515]' : 'from-[#171717]'} to-transparent`} />
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
