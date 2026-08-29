import { motion } from 'framer-motion';
import { ArrowRight, Check, Copy, Menu, X } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { appPath } from '../lib/paths';
import { Logo } from './Logo';
import { PhoneMockup } from './PhoneMockup';
import { Container } from './Primitives';

const ease = [0.16, 1, 0.3, 1] as const;
const reveal = { once: true, margin: '-12% 0px' };
const navItems = [
  { label: 'Produto', href: '#produto' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Como funciona', href: '#como-funciona' },
];

export function VelloLanding() {
  return (
    <div className="overflow-x-hidden bg-ink text-paper">
      <LandingHeader />
      <main>
        <Hero />
        <ProductStory />
        <AppInAction />
        <ClientSelections />
        <FeatureGrid />
        <HowItWorks />
        <FinalCall />
      </main>
      <Footer />
    </div>
  );
}

function LandingHeader() {
  const [open, setOpen] = useState(false);
  const moveTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="absolute inset-x-0 top-0 z-30 bg-ink/85 backdrop-blur-sm">
      <Container className="flex h-[76px] items-center justify-between">
        <a href="#top" aria-label="Vello" className="flex items-center"><Logo variant="light" /></a>
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <button key={item.href} onClick={() => moveTo(item.href)} className="font-body text-[14px] text-paper/70 transition-colors hover:text-paper">
              {item.label}
            </button>
          ))}
        </nav>
        <div className="hidden items-center gap-5 md:flex">
          <a href={appPath('/login')} className="font-body text-[14px] text-paper/70 transition-colors hover:text-paper">Entrar</a>
          <a href={appPath('/cadastro')} className="rounded-full bg-paper px-5 py-2.5 font-body text-[14px] font-semibold text-ink transition-transform duration-150 hover:scale-[1.02]">Criar catálogo</a>
        </div>
        <div className="flex items-center gap-3 md:hidden">
          <a href={appPath('/cadastro')} className="rounded-full bg-paper px-3.5 py-2 font-body text-[12px] font-semibold text-ink">Criar</a>
          <button aria-label={open ? 'Fechar menu' : 'Abrir menu'} onClick={() => setOpen((value) => !value)} className="text-paper">
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </Container>
      {open && (
        <div className="border-t border-white/10 bg-ink px-6 py-6 md:hidden">
          <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
            {navItems.map((item) => (
              <button key={item.href} onClick={() => moveTo(item.href)} className="text-left font-display text-[25px] font-semibold tracking-[-0.04em] text-paper">
                {item.label}
              </button>
            ))}
            <a href={appPath('/login')} className="font-body text-[15px] text-paper/65">Entrar</a>
          </div>
        </div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-ink pt-[146px] md:pt-[174px]">
      <Container className="relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease }} className="mx-auto max-w-[1040px] text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.19em] text-paper/45">Catálogo digital para corretores</p>
          <h1 className="mt-6 font-display text-[clamp(52px,7.8vw,110px)] font-semibold leading-[0.89] tracking-[-0.078em]">
            Seus imóveis, apresentados como merecem.
          </h1>
          <p className="mx-auto mt-7 max-w-[630px] font-body text-[16px] leading-relaxed text-paper/60 md:text-[18px]">
            Crie um catálogo que organiza seu perfil, seus imóveis e cada conversa com seus clientes.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href={appPath('/cadastro')} className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3.5 font-body text-[14px] font-semibold text-ink transition-transform duration-150 hover:scale-[1.02]">
              Criar meu catálogo <ArrowRight size={15} />
            </a>
            <button onClick={() => document.querySelector('#produto')?.scrollIntoView({ behavior: 'smooth' })} className="rounded-full border border-white/20 px-6 py-3.5 font-body text-[14px] font-medium text-paper transition-colors hover:bg-white/10">
              Conhecer a Vello
            </button>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 42, scale: 0.975 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.14, duration: 0.86, ease }} className="relative mx-auto mt-10 h-[465px] max-w-[1180px] overflow-hidden sm:mt-12 sm:h-[570px] lg:h-[620px]">
          <img src={appPath('/landing/vello-hero-stage.png')} alt="Catálogo imobiliário Vello em dois celulares sobre uma composição escura" className="absolute bottom-0 left-1/2 w-[700px] max-w-none -translate-x-1/2 grayscale sm:w-[1060px] lg:w-[1180px]" />
        </motion.div>
      </Container>
    </section>
  );
}

function ProductStory() {
  return (
    <section id="produto" className="bg-white py-24 text-ink md:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.76fr_1.24fr] lg:items-center">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone">O seu espaço público</p>
            <h2 className="mt-4 max-w-[540px] font-display text-[clamp(46px,5.5vw,76px)] font-semibold leading-[0.94] tracking-[-0.065em]">Uma vitrine com a sua cara. E com foco no imóvel.</h2>
            <p className="mt-6 max-w-[420px] font-body text-[16px] leading-relaxed text-ash">Seu perfil vem primeiro, a navegação é simples e cada imóvel recebe a atenção que precisa para gerar interesse.</p>
            <a href={appPath('/jose')} className="mt-8 inline-flex items-center gap-2 font-body text-[14px] font-semibold text-ink">Abrir catálogo de demonstração <ArrowRight size={15} /></a>
          </Reveal>
          <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={reveal} transition={{ duration: 0.62, ease }} className="overflow-hidden rounded-[30px] border border-line bg-white shadow-[0_42px_90px_-66px_rgba(11,11,10,0.7)]">
            <div className="flex items-center justify-between border-b border-line bg-white px-5 py-4">
              <div className="flex gap-2"><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /></div>
              <p className="font-mono text-[9px] uppercase tracking-[0.15em] text-stone">Catálogo Vello</p>
              <span className="h-2 w-9" />
            </div>
            <div className="grid min-h-[445px] sm:grid-cols-[174px_1fr]">
              <aside className="border-b border-line bg-white p-5 sm:border-b-0 sm:border-r">
                <p className="font-display text-[20px] font-semibold tracking-[-0.05em]">Carlos M.</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.13em] text-stone">CRECI · Porto Alegre</p>
                <div className="mt-10 space-y-2">
                  {['Meu catálogo', 'Imóveis', 'Seleções'].map((item, index) => <span key={item} className={`block rounded-xl px-3 py-2.5 font-body text-[12px] ${index === 0 ? 'bg-ink font-semibold text-paper' : 'text-ash'}`}>{item}</span>)}
                </div>
                <p className="mt-12 font-mono text-[9px] uppercase leading-relaxed tracking-[0.13em] text-stone">Seu trabalho, mais fácil de apresentar.</p>
              </aside>
              <div className="p-5 sm:p-7">
                <div className="flex items-start justify-between gap-4">
                  <div><p className="font-display text-[30px] font-semibold tracking-[-0.055em]">Imóveis disponíveis</p><p className="mt-1 font-body text-[12px] text-ash">Tudo o que seus clientes precisam ver, sem ruído.</p></div>
                  <span className="rounded-full bg-ink px-3 py-2 font-body text-[11px] font-semibold text-paper">Compartilhar</span>
                </div>
                <div className="mt-6 flex gap-2"><span className="rounded-full bg-ink px-3 py-1.5 font-body text-[11px] text-paper">Todos</span><span className="rounded-full border border-line bg-white px-3 py-1.5 font-body text-[11px] text-ash">Venda</span><span className="rounded-full border border-line bg-white px-3 py-1.5 font-body text-[11px] text-ash">Aluguel</span></div>
                <div className="mt-6 overflow-hidden rounded-[19px] border border-line bg-white sm:grid sm:grid-cols-[1.05fr_0.95fr]">
                  <img src={appPath('/hero-vello-house.png')} alt="Casa contemporânea apresentada em um catálogo Vello" className="h-[190px] w-full object-cover sm:h-full" />
                  <div className="p-5"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-stone">Venda</p><p className="mt-3 font-display text-[25px] font-semibold leading-[0.96] tracking-[-0.048em]">Casa contemporânea com jardim</p><p className="mt-3 font-body text-[11px] text-ash">Três Figueiras · Porto Alegre</p><p className="mt-6 font-display text-[22px] font-semibold tracking-[-0.04em]">R$ 1.250.000</p></div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function AppInAction() {
  const screens = [
    { label: 'Catálogo público', image: '/landing/catalog-real.png' },
    { label: 'Dashboard', image: '/landing/dashboard-real.png' },
    { label: 'Personalização', image: '/landing/customizer-real.png' },
  ];
  const [active, setActive] = useState(0);
  const previous = (active + screens.length - 1) % screens.length;
  const next = (active + 1) % screens.length;
  const goNext = () => setActive((current) => (current + 1) % screens.length);
  const goPrevious = () => setActive((current) => (current + screens.length - 1) % screens.length);

  return (
    <section className="overflow-hidden bg-white pb-24 pt-8 text-ink md:pb-36 md:pt-14">
      <Container className="text-center">
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone">Veja a Vello em ação</p>
          <h2 className="mx-auto mt-4 max-w-[720px] font-display text-[clamp(44px,5.4vw,74px)] font-semibold leading-[0.94] tracking-[-0.065em]">Cada parte do seu trabalho, no lugar certo.</h2>
          <p className="mx-auto mt-5 max-w-[540px] font-body text-[16px] leading-relaxed text-ash">Arraste para conhecer o catálogo público, o painel de gestão e a personalização da sua vitrine.</p>
        </Reveal>
      </Container>
      <motion.div initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={reveal} transition={{ duration: 0.7, ease }} className="relative mx-auto mt-14 h-[492px] max-w-[1180px] touch-pan-y sm:h-[590px]">
        <motion.button type="button" aria-label={`Ver ${screens[previous].label}`} onClick={goPrevious} animate={{ x: '-182%', scale: 0.77, opacity: 0.45 }} transition={{ duration: 0.45, ease }} className="absolute left-1/2 top-[72px] hidden cursor-pointer sm:block">
          <PhoneMockup><img src={appPath(screens[previous].image)} alt="" className="h-[560px] w-full object-cover object-top" /></PhoneMockup>
        </motion.button>
        <motion.div drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.12} onDragEnd={(_, info) => { if (info.offset.x < -45 || info.velocity.x < -300) goNext(); if (info.offset.x > 45 || info.velocity.x > 300) goPrevious(); }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.45, ease }} className="absolute left-1/2 top-0 z-10 -translate-x-1/2 cursor-grab active:cursor-grabbing">
          <PhoneMockup><motion.img key={screens[active].image} initial={{ opacity: 0.25, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.32, ease }} src={appPath(screens[active].image)} alt={`${screens[active].label} da Vello`} className="h-[560px] w-full select-none object-cover object-top" draggable={false} /></PhoneMockup>
        </motion.div>
        <motion.button type="button" aria-label={`Ver ${screens[next].label}`} onClick={goNext} animate={{ x: '82%', scale: 0.77, opacity: 0.45 }} transition={{ duration: 0.45, ease }} className="absolute left-1/2 top-[72px] hidden cursor-pointer sm:block">
          <PhoneMockup><img src={appPath(screens[next].image)} alt="" className="h-[560px] w-full object-cover object-top" /></PhoneMockup>
        </motion.button>
        <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center gap-2">{screens.map((screen, index) => <button key={screen.label} type="button" aria-label={`Mostrar ${screen.label}`} aria-pressed={active === index} onClick={() => setActive(index)} className={`h-2 rounded-full transition-all ${active === index ? 'w-7 bg-ink' : 'w-2 bg-ink/25 hover:bg-ink/45'}`} />)}</div>
      </motion.div>
    </section>
  );
}

function ClientSelections() {
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const clients = [
    { name: 'Ana Ribeiro', title: 'Opções para morar perto do parque.', count: 3 },
    { name: 'Marcelo Costa', title: 'Casas com espaço para receber.', count: 2 },
    { name: 'Juliana Alves', title: 'Imóveis para investir no centro.', count: 4 },
  ];
  const copy = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <section id="recursos" className="bg-[#111110] py-24 md:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/45">Seleções para clientes</p>
            <h2 className="mt-4 max-w-[570px] font-display text-[clamp(46px,5.5vw,76px)] font-semibold leading-[0.94] tracking-[-0.065em]">Uma página certa para cada conversa.</h2>
            <p className="mt-6 max-w-[430px] font-body text-[16px] leading-relaxed text-paper/60">Monte uma seleção, deixe uma mensagem e compartilhe opções que realmente combinam com o que cada pessoa procura.</p>
            <ul className="mt-8 space-y-3 font-body text-[14px] text-paper/72">
              {['Selecione imóveis em segundos', 'Escreva uma mensagem pessoal', 'Envie um único link profissional'].map((item) => <li key={item} className="flex items-center gap-3"><span className="grid h-5 w-5 place-items-center rounded-full bg-paper text-ink"><Check size={12} strokeWidth={2.5} /></span>{item}</li>)}
            </ul>
          </Reveal>
          <motion.div initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={reveal} transition={{ duration: 0.62, ease }} className="overflow-hidden rounded-[30px] border border-white/10 bg-white text-ink shadow-[0_42px_90px_-65px_rgba(0,0,0,0.9)]">
            <div className="flex items-center justify-between border-b border-line px-5 py-4"><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-stone">Seleção personalizada</p><span className="rounded-full bg-ink px-3 py-2 font-body text-[11px] font-semibold text-paper">+ Nova seleção</span></div>
            <div className="grid min-h-[365px] sm:grid-cols-[178px_1fr]">
              <div className="border-b border-line p-3 sm:border-b-0 sm:border-r">
                {clients.map((client, index) => <button key={client.name} onClick={() => setActive(index)} aria-pressed={active === index} className={`w-full rounded-xl px-3 py-3 text-left transition-colors ${active === index ? 'bg-ink text-paper' : 'text-ash hover:bg-black/[0.04]'}`}><span className="block font-body text-[13px] font-semibold">{client.name}</span><span className="mt-1 block font-mono text-[9px] opacity-60">{client.count} IMÓVEIS</span></button>)}
              </div>
              <motion.div key={active} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28, ease }} className="p-5 sm:p-6">
                <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-stone">Para {clients[active].name}</p>
                <p className="mt-3 max-w-[390px] font-display text-[30px] font-semibold leading-[0.96] tracking-[-0.05em]">{clients[active].title}</p>
                <div className="mt-7 space-y-2.5">
                  {['Apartamento com vista para o Guaíba', 'Casa contemporânea com jardim', 'Loft ensolarado', 'Studio no centro'].slice(0, clients[active].count).map((home, index) => <div key={home} className="flex items-center gap-3 border-b border-line pb-2.5"><span className="grid h-5 w-5 place-items-center rounded-full bg-black/[0.04] font-mono text-[8px] text-stone">0{index + 1}</span><span className="font-body text-[12px] text-ash">{home}</span></div>)}
                </div>
                <button onClick={copy} className={`mt-7 inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-body text-[12px] font-semibold transition-all ${copied ? 'bg-ink text-paper' : 'border border-line text-ink hover:bg-black/[0.04]'}`}><Copy size={13} />{copied ? 'Link copiado' : 'Copiar link da seleção'}</button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

function FeatureGrid() {
  const features = [
    ['Seu catálogo, seu endereço', 'Um link direto para colocar no WhatsApp, na bio e nos anúncios.'],
    ['Perfil que apresenta você', 'Nome, CRECI, localização e atendimento já organizados para inspirar confiança.'],
    ['Imóveis com contexto', 'Fotos, preço, detalhes e localização aparecem do jeito certo em qualquer tela.'],
    ['Visual personalizável', 'Ajuste cores, estilos e a faixa do perfil sem transformar o catálogo em um site complexo.'],
  ];

  return (
    <section className="bg-ink py-24 md:py-36">
      <Container>
        <Reveal>
          <div className="max-w-[770px]"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40">Feito para o dia a dia</p><h2 className="mt-4 font-display text-[clamp(46px,5.8vw,80px)] font-semibold leading-[0.94] tracking-[-0.065em]">O essencial para trabalhar melhor e apresentar mais.</h2></div>
        </Reveal>
        <div className="mt-16 grid gap-3 md:grid-cols-2">
          {features.map(([title, description], index) => (
            <motion.article key={title} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={reveal} transition={{ delay: index * 0.06, duration: 0.48, ease }} className="group min-h-[270px] rounded-[28px] border border-white/10 bg-white/[0.035] p-7 transition-colors hover:bg-white/[0.07] md:p-9">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-white font-display text-[18px] font-semibold text-ink">0{index + 1}</span>
              <h3 className="mt-12 font-display text-[31px] font-semibold tracking-[-0.053em]">{title}</h3>
              <p className="mt-3 max-w-[400px] font-body text-[15px] leading-relaxed text-paper/55">{description}</p>
            </motion.article>
          ))}
        </div>
        <div className="mt-3 overflow-hidden rounded-[28px] border border-white/10 bg-[#171716] p-5 sm:p-8">
          <div className="grid items-center gap-8 md:grid-cols-[0.82fr_1.18fr]">
            <div><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40">Visualização real</p><h3 className="mt-4 max-w-[430px] font-display text-[clamp(34px,4.4vw,58px)] font-semibold leading-[0.95] tracking-[-0.06em]">O cliente entende o imóvel antes de perguntar.</h3><p className="mt-5 max-w-[400px] font-body text-[15px] leading-relaxed text-paper/55">A Vello coloca o que importa na ordem certa: foto, preço, detalhes e uma forma simples de entrar em contato.</p></div>
            <div className="overflow-hidden rounded-[20px] border border-white/10 bg-white"><img src={appPath('/landing/property-real.png')} alt="Página de imóvel real exibida pela Vello" className="w-full object-cover object-top" /></div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    ['Crie seu perfil', 'Preencha suas informações profissionais e deixe seu atendimento pronto para aparecer no catálogo.'],
    ['Adicione imóveis', 'Cadastre fotos, valores e detalhes uma vez. O catálogo organiza a apresentação para você.'],
    ['Compartilhe e converse', 'Envie seu link ou uma seleção personalizada em qualquer conversa com clientes.'],
  ];

  return (
    <section id="como-funciona" className="bg-white py-24 text-ink md:py-36">
      <Container>
        <Reveal><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone">Comece em minutos</p><h2 className="mt-4 max-w-[790px] font-display text-[clamp(46px,5.8vw,80px)] font-semibold leading-[0.94] tracking-[-0.065em]">Três passos para transformar sua apresentação.</h2></Reveal>
        <div className="mt-16 grid gap-10 md:grid-cols-3 md:gap-0">
          {steps.map(([title, description], index) => <Reveal key={title} delay={index * 0.07}><article className="border-t border-line pt-5 md:min-h-[268px] md:px-8 md:first:pl-0 md:not-last:border-r md:last:pr-0"><span className="font-display text-[48px] tracking-[-0.065em] text-stone">0{index + 1}</span><h3 className="mt-10 max-w-[260px] font-display text-[30px] font-semibold tracking-[-0.05em]">{title}</h3><p className="mt-3 max-w-[300px] font-body text-[15px] leading-relaxed text-ash">{description}</p></article></Reveal>)}
        </div>
      </Container>
    </section>
  );
}

function FinalCall() {
  return (
    <section className="bg-ink py-28 text-paper md:py-40">
      <Container className="text-center">
        <Reveal><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40">Sua próxima vitrine começa aqui</p><h2 className="mx-auto mt-5 max-w-[940px] font-display text-[clamp(52px,7vw,104px)] font-semibold leading-[0.9] tracking-[-0.075em]">Seus imóveis merecem uma apresentação melhor.</h2><p className="mx-auto mt-6 max-w-[520px] font-body text-[16px] leading-relaxed text-paper/58">Crie seu catálogo, compartilhe com segurança e deixe a próxima conversa começar mais preparada.</p><a href={appPath('/cadastro')} className="mt-10 inline-flex items-center gap-2 rounded-full bg-paper px-7 py-4 font-body text-[15px] font-semibold text-ink transition-transform duration-150 hover:scale-[1.02]">Criar meu catálogo <ArrowRight size={16} /></a></Reveal>
      </Container>
    </section>
  );
}

function Footer() {
  return <footer className="border-t border-white/10 bg-ink py-10 text-paper"><Container className="flex flex-col gap-7 sm:flex-row sm:items-center sm:justify-between"><Logo variant="light" /><div className="flex flex-wrap gap-x-6 gap-y-3 font-body text-[13px] text-paper/55"><a href="#produto" className="hover:text-paper">Produto</a><a href="#recursos" className="hover:text-paper">Recursos</a><a href={appPath('/login')} className="hover:text-paper">Entrar</a><a href={appPath('/cadastro')} className="hover:text-paper">Criar conta</a></div><p className="font-mono text-[10px] text-paper/35">© {new Date().getFullYear()} Vello</p></Container></footer>;
}

function Reveal({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={reveal} transition={{ delay, duration: 0.58, ease }}>{children}</motion.div>;
}
