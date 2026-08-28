import { motion } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
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
        <ProductReveal />
        <LinkStory />
        <ScatteredToOne />
        <FeatureStory />
        <MobileStory />
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
  return <section id="top" className="overflow-hidden bg-ink pb-20 pt-[158px] text-paper md:pb-28 md:pt-[190px]">
    <Container>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={reveal} className="mx-auto max-w-[1040px] text-center">
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/50">Catálogo digital para corretores</p>
        <h1 className="balance mt-6 font-display text-[clamp(44px,7.2vw,104px)] font-semibold leading-[0.95] tracking-[-0.065em] text-paper">Seus imóveis merecem mais<br className="hidden sm:block" /> do que um link no WhatsApp.</h1>
        <p className="mx-auto mt-7 max-w-[580px] font-body text-[16px] leading-relaxed text-paper/60 md:text-[18px]">Crie um catálogo profissional, organize seus imóveis e compartilhe tudo em um único link — sem precisar montar um site do zero.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-4"><a href={appPath('/cadastro')} className="rounded-full bg-paper px-6 py-3.5 font-body text-[14px] font-semibold text-ink transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]">Criar meu catálogo</a><button onClick={() => document.querySelector('#demonstracao')?.scrollIntoView({ behavior: 'smooth' })} className="font-body text-[14px] font-medium text-paper/75 transition-colors hover:text-paper">Ver demonstração</button></div>
        <p className="mt-6 font-mono text-[10px] text-paper/40">Leva poucos minutos para começar.</p>
      </motion.div>
    </Container>
  </section>;
}

function ProductReveal() {
  return <section id="produto" className="bg-paper pb-28 pt-10 md:pb-40 md:pt-16">
    <Container className="max-w-[1400px]">
      <motion.div initial={{ opacity: 0, y: 26, scale: 0.94 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} viewport={inView} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden border border-line bg-cream shadow-[0_38px_90px_-58px_rgba(11,11,10,0.36)]">
        <div className="flex h-11 items-center border-b border-line px-4"><div className="flex gap-1.5"><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /><span className="h-2 w-2 rounded-full bg-line" /></div><div className="mx-auto rounded-full bg-paper px-4 py-1 font-mono text-[9px] text-stone">vello.com.br/seu-catalogo</div></div>
        <img src={appPath('/landing/catalog-real.png')} alt="Catálogo público real da Vello" className="block w-full" />
      </motion.div>
      <div className="mt-20 grid gap-8 md:grid-cols-[1fr_0.65fr] md:items-end"><Reveal><Eyebrow>Uma experiência completa</Eyebrow><h2 className="balance mt-4 max-w-[780px] font-display text-[clamp(42px,5.8vw,76px)] font-semibold leading-[0.98] tracking-[-0.055em] text-ink">Tudo que seu cliente precisa ver. Em um único link.</h2></Reveal><Reveal delay={0.1}><p className="max-w-[390px] font-body text-[16px] leading-relaxed text-ash">Seu nome, seus imóveis, filtros, detalhes e contato — sem precisar procurar em várias conversas.</p></Reveal></div>
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
  return <section className="bg-cream py-28 md:py-40"><Container><div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center"><Reveal><Eyebrow>Sua identidade</Eyebrow><h2 className="balance mt-4 max-w-[520px] font-display text-[clamp(42px,5.4vw,70px)] font-semibold leading-[0.98] tracking-[-0.055em] text-ink">Seu catálogo. Com a sua identidade.</h2><p className="mt-5 max-w-[410px] font-body text-[16px] leading-relaxed text-ash">Escolha cores, estilo dos imóveis e o jeito de apresentar seu perfil — sem perder a elegância.</p></Reveal><FeatureImage src="/landing/catalog-real.png" alt="Perfil e catálogo público da Vello" /></div><div className="mt-28 grid gap-16 border-t border-line pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center"><FeatureImage src="/landing/property-real.png" alt="Página de imóvel da Vello" /><Reveal><Eyebrow>Organização real</Eyebrow><h2 className="balance mt-4 max-w-[490px] font-display text-[clamp(42px,5.4vw,70px)] font-semibold leading-[0.98] tracking-[-0.055em] text-ink">Cadastre, atualize e encontre cada imóvel.</h2><p className="mt-5 max-w-[410px] font-body text-[16px] leading-relaxed text-ash">Informações, fotos, preço e disponibilidade sempre organizados para você não perder tempo procurando.</p></Reveal></div></Container></section>;
}

function FeatureImage({ src, alt }: { src: string; alt: string }) {
  return <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={inView} transition={reveal} className="overflow-hidden border border-line bg-paper shadow-[0_30px_80px_-54px_rgba(11,11,10,0.35)]"><img src={appPath(src)} alt={alt} loading="lazy" className="block w-full" /></motion.div>;
}

function MobileStory() {
  return <section className="overflow-hidden bg-ink py-28 text-paper md:py-40"><Container><div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr] lg:items-center"><Reveal><Eyebrow>Feito para o celular</Eyebrow><h2 className="balance mt-4 max-w-[500px] font-display text-[clamp(46px,5.8vw,76px)] font-semibold leading-[0.97] tracking-[-0.06em] text-paper">Feito para impressionar também no celular.</h2><p className="mt-5 max-w-[400px] font-body text-[16px] leading-relaxed text-paper/60">Seu cliente abre, filtra e encontra o que procura de onde estiver.</p></Reveal><motion.div initial={{ opacity: 0, scale: 0.94, y: 26 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={inView} transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1] }} className="relative mx-auto flex min-h-[590px] w-full items-end justify-center md:min-h-[650px]"><div className="absolute bottom-0 h-[420px] w-[min(100%,620px)] border border-white/10 bg-white/[0.03]" /><PhoneMockup className="relative z-10 mb-[-70px] scale-[1.08] sm:scale-[1.18]" /></motion.div></div></Container></section>;
}

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
  return <section className="overflow-hidden bg-ink pt-28 text-paper md:pt-40"><Container className="text-center"><Reveal><h2 className="balance font-display text-[clamp(52px,7vw,96px)] font-semibold leading-[0.93] tracking-[-0.07em]">Seus imóveis.<br />Sua marca.<br />Seu catálogo.</h2><a href={appPath('/cadastro')} className="mt-10 inline-flex items-center gap-2 rounded-full bg-paper px-7 py-4 font-body text-[15px] font-semibold text-ink transition-transform duration-150 hover:scale-[1.02]">Criar meu catálogo <ArrowRight size={16} /></a></Reveal><motion.div initial={{ opacity: 0, y: 34 }} whileInView={{ opacity: 0.65, y: 0 }} viewport={inView} transition={{ delay: 0.2, ...reveal }} className="mx-auto mt-20 max-w-[1050px] overflow-hidden border border-white/10 border-b-0"><img src={appPath('/landing/property-real.png')} alt="Prévia de imóvel da Vello" loading="lazy" className="block w-full" /></motion.div></Container></section>;
}

function LandingFooter() {
  const links = [{ label: 'Produto', href: '#produto' }, { label: 'Preços', href: '#precos' }, { label: 'Entrar', href: appPath('/login') }, { label: 'Criar conta', href: appPath('/cadastro') }];
  return <footer className="border-t border-white/10 bg-ink py-10 text-paper"><Container className="flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between"><Logo variant="light" /><div className="flex flex-wrap gap-x-6 gap-y-3">{links.map((link) => <a key={link.label} href={link.href} className="font-body text-[13px] text-paper/55 transition-colors hover:text-paper">{link.label}</a>)}<a href="#" className="font-body text-[13px] text-paper/55 transition-colors hover:text-paper">Termos</a><a href="#" className="font-body text-[13px] text-paper/55 transition-colors hover:text-paper">Privacidade</a></div><p className="font-mono text-[10px] text-paper/35">© {new Date().getFullYear()} Vello</p></Container></footer>;
}
