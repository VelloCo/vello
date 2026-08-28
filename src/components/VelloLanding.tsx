import { motion } from 'framer-motion';
import { ArrowRight, Check, Copy, Grid2X2, LayoutTemplate, Menu, Palette, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { appPath } from '../lib/paths';
import { Logo } from './Logo';
import { PhoneMockup } from './PhoneMockup';
import { Container, Eyebrow, Reveal } from './Primitives';

const navItems = [
  { label: 'Produto', href: '#produto' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Preços', href: '#precos' },
];

const inView = { once: true, margin: '-12% 0px' };
const reveal = { duration: 0.72, ease: [0.16, 1, 0.3, 1] as const };

export function VelloLanding() {
  return (
    <>
      <LandingHeader />
      <main>
        <LandingHero />
        <LinkStory />
        <ScatteredToOne />
        <FeatureStory />
        <ClientSelectionsStory />
        <SimpleComparison />
        <HowItWorks />
        <Pricing />
        <FinalCallToAction />
      </main>
      <LandingFooter />
    </>
  );
}

function LandingHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const moveTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return <header className={`fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-300 ${scrolled || open ? 'border-line/70 bg-paper/85 backdrop-blur-md' : 'border-transparent bg-transparent'}`}>
    <Container className="flex h-[72px] items-center justify-between">
      <button onClick={() => moveTo('#top')} className="flex items-center" aria-label="Voltar ao início"><Logo variant={scrolled || open ? 'dark' : 'light'} /></button>
      <nav className="hidden items-center gap-8 md:flex">
        {navItems.map((item) => <button key={item.href} onClick={() => moveTo(item.href)} className={`font-body text-[14px] transition-colors ${scrolled ? 'text-ash hover:text-ink' : 'text-paper/70 hover:text-paper'}`}>{item.label}</button>)}
      </nav>
      <div className="hidden items-center gap-5 md:flex">
        <a href={appPath('/login')} className={`font-body text-[14px] transition-colors ${scrolled ? 'text-ash hover:text-ink' : 'text-paper/70 hover:text-paper'}`}>Entrar</a>
        <a href={appPath('/cadastro')} className={`rounded-full px-5 py-2.5 font-body text-[14px] font-semibold transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98] ${scrolled ? 'bg-ink text-paper' : 'bg-paper text-ink'}`}>Criar meu catálogo</a>
      </div>
      <div className="flex items-center gap-3 md:hidden">
        <a href={appPath('/cadastro')} className={`rounded-full px-3.5 py-2 font-body text-[12px] font-semibold ${scrolled || open ? 'bg-ink text-paper' : 'bg-paper text-ink'}`}>Criar</a>
        <button onClick={() => setOpen((value) => !value)} className={`grid h-9 w-9 place-items-center ${scrolled || open ? 'text-ink' : 'text-paper'}`} aria-label={open ? 'Fechar menu' : 'Abrir menu'}>{open ? <X size={21} /> : <Menu size={21} />}</button>
      </div>
    </Container>
    {open && <nav className="border-t border-line/70 bg-paper px-6 py-7 md:hidden"><div className="mx-auto flex max-w-[1200px] flex-col gap-5">{navItems.map((item) => <button key={item.href} onClick={() => moveTo(item.href)} className="text-left font-display text-[22px] font-medium tracking-[-0.02em] text-ink">{item.label}</button>)}<a href={appPath('/login')} className="pt-2 font-body text-[15px] text-ash">Entrar</a></div></nav>}
  </header>;
}

function LandingHero() {
  return <section id="top" className="overflow-hidden bg-ink pb-0 pt-[158px] text-paper md:pt-[190px]">
    <Container>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reveal} className="mx-auto max-w-[1040px] text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">Catálogo digital para corretores</p>
        <h1 className="balance mt-6 font-display text-[clamp(44px,7.2vw,104px)] font-semibold leading-[0.95] tracking-[-0.065em] text-paper">Seus imóveis merecem mais<br className="hidden sm:block" /> do que um link no WhatsApp.</h1>
        <p className="mx-auto mt-7 max-w-[580px] font-body text-[16px] leading-relaxed text-paper/60 md:text-[18px]">Crie um catálogo profissional, organize seus imóveis e compartilhe tudo em um único link — sem precisar montar um site do zero.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4"><a href={appPath('/cadastro')} className="rounded-full bg-paper px-6 py-3.5 font-body text-[14px] font-semibold text-ink transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]">Criar meu catálogo</a><button onClick={() => document.querySelector('#demonstracao')?.scrollIntoView({ behavior: 'smooth' })} className="font-body text-[14px] font-medium text-paper/75 transition-colors hover:text-paper">Ver demonstração</button></div>
        <p className="mt-6 font-mono text-[10px] text-paper/40">Leva poucos minutos para começar.</p>
        <motion.div id="produto" initial={{ opacity: 0, y: 28, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.14, duration: 0.72, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto mt-14 flex h-[540px] max-w-[820px] items-end justify-center overflow-hidden sm:h-[620px]">
          <div className="absolute bottom-[-330px] h-[720px] w-[720px] rounded-full border border-white/10" />
          <div className="absolute bottom-[-220px] h-[520px] w-[520px] rounded-full border border-white/[0.07]" />
          <div className="absolute bottom-0 h-[260px] w-[min(100%,590px)] border border-white/10 bg-white/[0.025]" />
          <p className="absolute left-0 top-20 hidden font-mono text-[9px] uppercase tracking-[0.16em] text-paper/35 sm:block">Perfil · imóveis · contato</p>
          <p className="absolute right-0 top-36 hidden font-mono text-[9px] uppercase tracking-[0.16em] text-paper/35 sm:block">Toque para explorar</p>
          <PhoneMockup className="relative z-10 mb-[-54px] scale-[0.94] sm:scale-[1.1]" />
        </motion.div>
      </motion.div>
    </Container>
  </section>;
}

function LinkStory() {
  return <section className="border-y border-line bg-cream/55 py-24 md:py-32"><Container><div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:items-center"><Reveal><Eyebrow>Do interesse à decisão</Eyebrow><h2 className="balance mt-4 max-w-[510px] font-display text-[clamp(40px,5vw,66px)] font-semibold leading-[0.99] tracking-[-0.05em] text-ink">Seu Instagram gera interesse. A Vello organiza a decisão.</h2><p className="mt-5 max-w-[430px] font-body text-[16px] leading-relaxed text-ash">Um único link na bio leva o cliente para uma experiência muito mais organizada.</p></Reveal><Reveal delay={0.1}><div className="border-y border-line"><Flow label="Instagram" detail="A descoberta começa" /><Flow label="Vello" detail="Os imóveis se organizam" strong /><Flow label="Imóvel" detail="Os detalhes ficam claros" /><Flow label="WhatsApp" detail="A conversa continua" /></div></Reveal></div></Container></section>;
}

function Flow({ label, detail, strong = false }: { label: string; detail: string; strong?: boolean }) {
  return <div className={`grid grid-cols-[42px_1fr_auto] items-center gap-4 border-b border-line py-5 last:border-0 ${strong ? 'text-ink' : 'text-ash'}`}><span className="font-mono text-[11px]">↓</span><div><p className={`font-display text-[23px] tracking-[-0.025em] ${strong ? 'font-semibold' : 'font-medium'}`}>{label}</p><p className="mt-0.5 font-body text-[13px] text-stone">{detail}</p></div><span className={`h-2.5 w-2.5 rounded-full ${strong ? 'bg-ink' : 'bg-line'}`} /></div>;
}

function ScatteredToOne() {
  return <section id="recursos" className="overflow-hidden bg-paper py-28 md:py-40"><Container><Reveal><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone">Menos improviso</p><h2 className="balance mt-5 max-w-[900px] font-display text-[clamp(44px,6.2vw,84px)] font-semibold leading-[0.96] tracking-[-0.06em] text-ink">O que hoje fica espalhado,<br className="hidden md:block" /> na Vello fica inteiro.</h2></Reveal><div className="mt-16 grid gap-10 border-t border-line pt-8 lg:grid-cols-[1fr_68px_1fr] lg:items-center"><div className="grid grid-cols-2 gap-x-5 gap-y-7 text-[clamp(22px,2.5vw,35px)] font-display tracking-[-0.035em] text-ash"><span>Instagram</span><span>PDF</span><span>Fotos</span><span>WhatsApp</span><span>Links</span><span>Mensagens</span></div><div className="hidden justify-center lg:flex"><ArrowMark /></div><div className="border-l-2 border-ink pl-6 md:pl-9"><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone">Com a Vello</p><p className="mt-4 font-display text-[clamp(38px,4.8vw,64px)] font-semibold leading-[0.95] tracking-[-0.055em] text-ink">Um catálogo.<br />Tudo no lugar.</p><p className="mt-5 max-w-[330px] font-body text-[15px] leading-relaxed text-ash">Perfil, imóveis, filtros e contato em uma experiência que é sua.</p></div></div></Container></section>;
}

function ArrowMark() { return <span className="flex h-12 w-12 items-center justify-center rounded-full border border-line font-display text-[24px] text-ink">→</span>; }

function FeatureStory() {
  return <section className="bg-cream py-28 md:py-40"><Container><div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><Reveal><Eyebrow>Seu jeito de apresentar</Eyebrow><h2 className="balance mt-4 max-w-[520px] font-display text-[clamp(42px,5.4vw,70px)] font-semibold leading-[0.98] tracking-[-0.055em] text-ink">Uma marca que aparece em cada detalhe.</h2><p className="mt-5 max-w-[410px] font-body text-[16px] leading-relaxed text-ash">Escolha o clima do seu catálogo, o ritmo dos cards e a primeira impressão que seu cliente recebe.</p></Reveal><CatalogControlNotes /></div><div className="mt-28 grid gap-16 border-t border-line pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"><OrganizationConsole /><Reveal><Eyebrow>Organização real</Eyebrow><h2 className="balance mt-4 max-w-[490px] font-display text-[clamp(42px,5.4vw,70px)] font-semibold leading-[0.98] tracking-[-0.055em] text-ink">Cadastre, atualize e encontre cada imóvel.</h2><p className="mt-5 max-w-[410px] font-body text-[16px] leading-relaxed text-ash">Informações, fotos, preço e disponibilidade sempre organizados para você não perder tempo procurando.</p></Reveal></div></Container></section>;
}

function CatalogPlayground() {
  const [theme, setTheme] = useState<'areia' | 'claro' | 'noite'>('areia');
  const [view, setView] = useState<'editorial' | 'classico'>('editorial');
  const themes = {
    areia: { label: 'Areia', bg: '#F4F1EA', surface: '#FFFEFB', ink: '#10100F', muted: '#756F66', line: '#DED9CF', accent: '#10100F' },
    claro: { label: 'Claro', bg: '#FFFFFF', surface: '#F8F8F6', ink: '#10100F', muted: '#767676', line: '#E5E5E3', accent: '#10100F' },
    noite: { label: 'Noite', bg: '#111110', surface: '#1D1D1B', ink: '#F8F6F0', muted: '#AAA79F', line: '#3A3935', accent: '#F8F6F0' },
  } as const;
  const active = themes[theme];
  return <motion.div initial={{ opacity: 0, y: 26, scale: 0.96 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={inView} transition={{ duration: 0.72, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden border border-line bg-paper shadow-[0_38px_90px_-58px_rgba(11,11,10,0.36)]">
    <div className="flex items-center justify-between border-b border-line px-4 py-3 md:px-5"><div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /></div><p className="font-mono text-[9px] uppercase tracking-[0.15em] text-stone">Experimente a personalização</p><span className="hidden rounded-full border border-line px-2.5 py-1 font-mono text-[9px] text-stone sm:block">AO VIVO</span></div>
    <div className="grid lg:grid-cols-[270px_1fr]">
      <div className="border-b border-line bg-cream/45 p-5 lg:border-b-0 lg:border-r lg:p-7"><p className="font-display text-[22px] font-semibold tracking-[-0.04em] text-ink">Seu catálogo</p><p className="mt-1 font-body text-[13px] leading-relaxed text-ash">Escolha e veja a prévia mudar.</p><div className="mt-7"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-stone">Atmosfera</p><div className="mt-3 grid grid-cols-3 gap-2 lg:grid-cols-1">{(Object.keys(themes) as Array<keyof typeof themes>).map((key) => <button key={key} onClick={() => setTheme(key)} aria-pressed={theme === key} className={`flex items-center gap-2 rounded-xl border p-2.5 text-left transition-all duration-200 ${theme === key ? 'border-ink bg-paper shadow-[0_8px_18px_-15px_rgba(0,0,0,0.6)]' : 'border-line bg-transparent hover:border-stone'}`}><span className="h-5 w-5 shrink-0 rounded-full border border-black/10" style={{ backgroundColor: themes[key].bg }} /><span className="font-body text-[12px] font-medium text-ink">{themes[key].label}</span>{theme === key && <Check className="ml-auto hidden lg:block" size={14} />}</button>)}</div></div><div className="mt-6"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-stone">Imóveis</p><div className="mt-3 grid grid-cols-2 gap-2">{([{ key: 'editorial', label: 'Editorial', icon: LayoutTemplate }, { key: 'classico', label: 'Clássico', icon: Grid2X2 }] as const).map(({ key, label, icon: Icon }) => <button key={key} onClick={() => setView(key)} aria-pressed={view === key} className={`rounded-xl border p-3 text-left transition-all duration-200 ${view === key ? 'border-ink bg-ink text-paper' : 'border-line bg-paper text-ink hover:border-stone'}`}><Icon size={16} /><span className="mt-2 block font-body text-[12px] font-medium">{label}</span></button>)}</div></div></div>
      <motion.div layout transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }} style={{ backgroundColor: active.bg, color: active.ink }} className="min-h-[510px] p-4 sm:p-7 md:p-9"><div className="mx-auto max-w-[760px]"><div className="flex items-center justify-between"><p className="font-display text-[20px] font-semibold tracking-[-0.045em]">Vello</p><button type="button" className="rounded-full border px-3 py-1.5 font-body text-[11px] font-medium" style={{ borderColor: active.line }}>Compartilhar</button></div><motion.div layout transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }} className="mt-7 rounded-[22px] border p-4 sm:p-5" style={{ borderColor: active.line, backgroundColor: active.surface }}><div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full font-display text-[15px]" style={{ backgroundColor: active.accent, color: active.bg }}>C</div><div><p className="font-body text-[14px] font-semibold">Carlos Menezes</p><p className="mt-0.5 font-mono text-[9px]" style={{ color: active.muted }}>CRECI 123456-F · Porto Alegre, RS</p></div></div></motion.div><div className="mt-7"><p className="font-display text-[clamp(30px,4vw,45px)] font-semibold tracking-[-0.06em]">Imóveis selecionados</p><div className="mt-4 flex gap-2 overflow-hidden">{['Todos', 'Comprar', 'Alugar'].map((item, index) => <span key={item} className="whitespace-nowrap rounded-full border px-3 py-1.5 font-body text-[11px]" style={{ borderColor: active.line, backgroundColor: index === 0 ? active.accent : 'transparent', color: index === 0 ? active.bg : active.ink }}>{item}</span>)}</div></div><motion.div layout transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }} className={`mt-6 overflow-hidden rounded-[22px] border ${view === 'editorial' ? 'sm:grid sm:grid-cols-[1.12fr_0.88fr]' : ''}`} style={{ borderColor: active.line, backgroundColor: active.surface }}><img src={appPath('/hero-vello-house.png')} alt="Casa contemporânea exibida no catálogo" className={`block w-full object-cover ${view === 'editorial' ? 'h-[230px] sm:h-full' : 'h-[220px]'}`} /><div className="p-5"><p className="font-mono text-[9px] uppercase tracking-[0.14em]" style={{ color: active.muted }}>Venda</p><p className="mt-3 font-display text-[24px] font-semibold leading-[0.95] tracking-[-0.045em]">Casa contemporânea com jardim</p><p className="mt-3 font-body text-[12px]" style={{ color: active.muted }}>Três Figueiras · Porto Alegre</p><p className="mt-6 font-display text-[24px] font-semibold tracking-[-0.04em]">R$ 1.250.000</p><div className="mt-4 flex gap-3 font-mono text-[9px]" style={{ color: active.muted }}><span>3 quartos</span><span>2 vagas</span><span>218 m²</span></div></div></motion.div></div></motion.div>
    </div>
  </motion.div>;
}

void CatalogPlayground;

function CatalogControlNotes() {
  const notes = [{ icon: Palette, label: 'Cores livres', text: 'Escolha uma atmosfera ou a sua própria cor.' }, { icon: LayoutTemplate, label: 'Três estilos', text: 'Editorial, clássico ou compacto.' }, { icon: SlidersHorizontal, label: 'Prévia ao vivo', text: 'Veja o resultado antes de publicar.' }];
  return <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={reveal} className="border-y border-line">{notes.map(({ icon: Icon, label, text }) => <div key={label} className="grid grid-cols-[38px_1fr] gap-3 border-b border-line py-5 last:border-b-0"><span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-paper"><Icon size={14} /></span><div><p className="font-display text-[22px] font-semibold tracking-[-0.04em] text-ink">{label}</p><p className="mt-1 font-body text-[13px] leading-relaxed text-ash">{text}</p></div></div>)}</motion.div>;
}

function OrganizationConsole() {
  const [selected, setSelected] = useState(0);
  const homes = ['Casa contemporânea', 'Apartamento central', 'Cobertura ensolarada'];
  return <motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={reveal} className="overflow-hidden border border-line bg-paper shadow-[0_30px_80px_-54px_rgba(11,11,10,0.35)]"><div className="flex items-center justify-between border-b border-line px-5 py-4"><div><p className="font-display text-[20px] font-semibold tracking-[-0.04em] text-ink">Seus imóveis</p><p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-stone">Organize com clareza</p></div><span className="rounded-full bg-ink px-3 py-2 font-body text-[11px] font-semibold text-paper">+ Novo imóvel</span></div><div className="grid sm:grid-cols-[0.94fr_1.06fr]"><div className="border-b border-line p-3 sm:border-b-0 sm:border-r">{homes.map((home, index) => <button key={home} onClick={() => setSelected(index)} aria-pressed={selected === index} className={`flex w-full items-center justify-between rounded-xl px-3 py-3 text-left transition-colors duration-200 ${selected === index ? 'bg-cream text-ink' : 'text-ash hover:bg-cream/55'}`}><span><span className="block font-body text-[13px] font-semibold">{home}</span><span className="mt-1 block font-mono text-[9px]">{index === 0 ? 'DISPONÍVEL' : 'RASCUNHO'}</span></span>{selected === index && <ArrowRight size={15} />}</button>)}</div><motion.div key={selected} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }} className="p-6"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-stone">Detalhes do imóvel</p><p className="mt-3 font-display text-[28px] font-semibold leading-[0.95] tracking-[-0.045em] text-ink">{homes[selected]}</p><div className="mt-7 space-y-3">{['Fotos e capa', 'Preço e localização', 'Características e status'].map((detail, index) => <div key={detail} className="flex items-center justify-between border-b border-line pb-3"><span className="font-body text-[12px] text-ash">{detail}</span><span className={`h-2 w-2 rounded-full ${selected === 0 || index < 2 ? 'bg-ink' : 'bg-line'}`} /></div>)}</div><button type="button" className="mt-6 inline-flex items-center gap-2 font-body text-[12px] font-semibold text-ink">Editar imóvel <ArrowRight size={14} /></button></motion.div></div></motion.div>;
}

function ClientSelectionsStory() {
  const [copied, setCopied] = useState(false);
  const [active, setActive] = useState(0);
  const clients = ['Ana Ribeiro', 'Marcelo Costa'];
  const selectedHomes = ['Apartamento com vista para o Guaíba', 'Casa contemporânea com jardim', 'Loft ensolarado no Moinhos'];
  const copySelection = () => {
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return <section className="bg-paper py-28 md:py-40"><Container><div className="grid gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:items-center"><Reveal><Eyebrow>Para cada cliente</Eyebrow><h2 className="balance mt-4 max-w-[530px] font-display text-[clamp(42px,5.4vw,70px)] font-semibold leading-[0.98] tracking-[-0.055em] text-ink">Envie uma seleção que parece feita sob medida.</h2><p className="mt-5 max-w-[410px] font-body text-[16px] leading-relaxed text-ash">Escolha os imóveis certos, escreva uma mensagem e compartilhe uma página exclusiva para cada cliente.</p><p className="mt-7 font-mono text-[10px] uppercase tracking-[0.14em] text-stone">Clique em um cliente para ver a seleção</p></Reveal><motion.div initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={reveal} className="overflow-hidden border border-line bg-paper shadow-[0_30px_80px_-54px_rgba(11,11,10,0.35)]"><div className="flex items-center justify-between border-b border-line px-5 py-4"><div><p className="font-display text-[20px] font-semibold tracking-[-0.04em] text-ink">Seleções</p><p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-stone">Opções para seus clientes</p></div><span className="rounded-full bg-ink px-3 py-2 font-body text-[11px] font-semibold text-paper">+ Nova seleção</span></div><div className="grid sm:grid-cols-[185px_1fr]"><div className="border-b border-line p-3 sm:border-b-0 sm:border-r">{clients.map((client, index) => <button key={client} onClick={() => setActive(index)} aria-pressed={active === index} className={`w-full rounded-xl px-3 py-3 text-left transition-colors duration-150 ${active === index ? 'bg-cream text-ink' : 'text-ash hover:bg-cream/55'}`}><span className="block font-body text-[13px] font-semibold">{client}</span><span className="mt-1 block font-mono text-[9px]">{index === 0 ? '3 IMÓVEIS · PRONTA' : '2 IMÓVEIS · RASCUNHO'}</span></button>)}</div><motion.div key={active} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }} className="p-5 sm:p-6"><p className="font-mono text-[9px] uppercase tracking-[0.14em] text-stone">Para {clients[active]}</p><p className="mt-3 font-display text-[25px] font-semibold leading-[0.98] tracking-[-0.045em] text-ink">{active === 0 ? 'Opções com luz, varanda e vista.' : 'Opções para morar perto do trabalho.'}</p><div className="mt-6 space-y-2">{selectedHomes.slice(0, active === 0 ? 3 : 2).map((home, index) => <div key={home} className="flex items-center gap-3 border-b border-line pb-2.5"><span className="grid h-5 w-5 place-items-center rounded-full bg-ink font-mono text-[8px] text-paper">0{index + 1}</span><span className="font-body text-[12px] text-ash">{home}</span></div>)}</div><button onClick={copySelection} className={`mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2.5 font-body text-[12px] font-semibold transition-all duration-200 ${copied ? 'bg-ink text-paper' : 'border border-line text-ink hover:border-ink'}`}><Copy size={13} />{copied ? 'Link copiado' : 'Copiar link da seleção'}</button></motion.div></div></motion.div></div></Container></section>;
}

function MobileStory() {
  return <section className="overflow-hidden bg-ink py-28 text-paper md:py-40"><Container><div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><Reveal><Eyebrow>Feito para o celular</Eyebrow><h2 className="balance mt-4 max-w-[500px] font-display text-[clamp(46px,5.8vw,76px)] font-semibold leading-[0.97] tracking-[-0.06em] text-paper">Feito para impressionar também no celular.</h2><p className="mt-5 max-w-[400px] font-body text-[16px] leading-relaxed text-paper/60">Seu cliente abre, filtra e encontra o que procura de onde estiver.</p></Reveal><motion.div initial={{ opacity: 0, scale: 0.94, y: 26 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={inView} transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto flex min-h-[590px] w-full items-end justify-center md:min-h-[650px]"><div className="absolute bottom-0 h-[420px] w-[min(100%,620px)] border border-white/10 bg-white/[0.03]" /><PhoneMockup className="relative z-10 mb-[-70px] scale-[1.08] sm:scale-[1.18]" /></motion.div></div></Container></section>;
}

void MobileStory;

function SimpleComparison() {
  return <section className="bg-paper py-28 md:py-40"><Container><Reveal><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-stone">Antes e depois</p><h2 className="balance mt-5 max-w-[720px] font-display text-[clamp(46px,6vw,80px)] font-semibold leading-[0.96] tracking-[-0.06em] text-ink">Menos improviso.<br />Mais apresentação.</h2></Reveal><div className="mt-16 grid gap-px border border-line bg-line md:grid-cols-2"><ComparisonSide title="Sem Vello" tone="muted" items={['PDF', 'Prints', 'Fotos no WhatsApp', 'Links separados', 'Informações espalhadas']} /><ComparisonSide title="Com Vello" items={['Perfil', 'Catálogo', 'Imóveis', 'Filtros', 'Contato', 'Um link']} /></div><div id="demonstracao" className="mt-20 border-t border-line pt-8 text-center"><p className="font-display text-[clamp(32px,4.2vw,54px)] font-semibold tracking-[-0.05em] text-ink">Veja como seu catálogo pode ficar.</p><a href={appPath('/jose')} className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 font-body text-[14px] font-semibold text-paper transition-transform duration-150 hover:scale-[1.02]">Abrir demonstração <ArrowRight size={15} /></a></div></Container></section>;
}

function ComparisonSide({ title, items, tone = 'ink' }: { title: string; items: string[]; tone?: 'ink' | 'muted' }) {
  return <div className={`bg-paper p-7 md:p-10 ${tone === 'muted' ? 'text-stone' : 'text-ink'}`}><p className="font-mono text-[10px] uppercase tracking-[0.14em]">{title}</p><div className="mt-9 space-y-3">{items.map((item, index) => <motion.p key={item} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={inView} transition={{ delay: index * 0.045, duration: 0.35, ease: [0.16, 1, 0.3, 1] }} className="font-display text-[clamp(25px,3vw,40px)] tracking-[-0.04em]">{item}</motion.p>)}</div></div>;
}

function HowItWorks() {
  const steps = ['Crie seu perfil', 'Adicione seus imóveis', 'Personalize seu catálogo', 'Compartilhe seu link'];
  return <section id="como-funciona" className="border-t border-line bg-cream/55 py-28 md:py-40"><Container><Reveal><Eyebrow>Como funciona</Eyebrow><h2 className="balance mt-4 max-w-[700px] font-display text-[clamp(44px,5.6vw,72px)] font-semibold leading-[0.98] tracking-[-0.06em] text-ink">Do cadastro ao seu link em poucos passos.</h2></Reveal><div className="mt-16 border-t border-line">{steps.map((step, index) => <motion.div key={step} initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={{ delay: index * 0.07, ...reveal }} className="grid grid-cols-[68px_1fr] border-b border-line py-5 md:grid-cols-[150px_1fr] md:py-7"><span className="font-display text-[30px] tracking-[-0.04em] text-stone md:text-[42px]">0{index + 1}</span><p className="self-center font-display text-[clamp(26px,3.4vw,46px)] tracking-[-0.045em] text-ink">{step}</p></motion.div>)}</div></Container></section>;
}

function Pricing() {
  return <section id="precos" className="bg-paper py-28 md:py-40"><Container className="max-w-[960px]"><Reveal className="text-center"><Eyebrow>Preços</Eyebrow><h2 className="balance mt-4 font-display text-[clamp(42px,5.6vw,72px)] font-semibold leading-[0.98] tracking-[-0.06em] text-ink">Tudo que você precisa para apresentar seus imóveis melhor.</h2><p className="mx-auto mt-6 max-w-[480px] font-body text-[16px] leading-relaxed text-ash">A Vello está em acesso de teste enquanto preparamos o lançamento.</p><a href={appPath('/cadastro')} className="mt-8 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3.5 font-body text-[14px] font-semibold text-paper transition-transform duration-150 hover:scale-[1.02]">Começar agora <ArrowRight size={15} /></a></Reveal></Container></section>;
}

function FinalCallToAction() {
  return <section className="bg-ink py-28 text-paper md:py-40"><Container className="text-center"><Reveal><p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/40">Seu próximo catálogo começa aqui</p><h2 className="balance mt-5 font-display text-[clamp(52px,7vw,96px)] font-semibold leading-[0.93] tracking-[-0.07em]">Seus imóveis.<br />Sua marca.<br />Seu catálogo.</h2><a href={appPath('/cadastro')} className="mt-10 inline-flex items-center gap-2 rounded-full bg-paper px-7 py-4 font-body text-[15px] font-semibold text-ink transition-transform duration-150 hover:scale-[1.02]">Criar meu catálogo <ArrowRight size={16} /></a></Reveal></Container></section>;
}

function LandingFooter() {
  const links = [{ label: 'Produto', href: '#produto' }, { label: 'Preços', href: '#precos' }, { label: 'Entrar', href: appPath('/login') }, { label: 'Criar conta', href: appPath('/cadastro') }];
  return <footer className="border-t border-white/10 bg-ink py-10 text-paper"><Container className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between"><Logo variant="light" /><div className="flex flex-wrap gap-x-6 gap-y-3">{links.map((link) => <a key={link.label} href={link.href} className="font-body text-[13px] text-paper/55 transition-colors hover:text-paper">{link.label}</a>)}<a href="#" className="font-body text-[13px] text-paper/55 transition-colors hover:text-paper">Termos</a><a href="#" className="font-body text-[13px] text-paper/55 transition-colors hover:text-paper">Privacidade</a></div><p className="font-mono text-[10px] text-paper/35">© {new Date().getFullYear()} Vello</p></Container></footer>;
}
