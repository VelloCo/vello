import { ArrowRight, Check, Share2 } from "lucide-react";
import { appPath } from "../lib/paths";
import { Logo } from "./Logo";
import { Container, Eyebrow, Reveal } from "./Primitives";

const signup = appPath("/cadastro");
const login = appPath("/login");
const propertyImages = ["/landing/property-photo-1.png", "/landing/property-photo-2.png", "/landing/property-photo-3.png"];

export function VelloLandingMinimal() {
  return <div className="min-h-screen overflow-hidden bg-paper pb-20 text-ink sm:pb-0">
    <Header />
    <main>
      <Hero />
      <OnboardingFlow />
      <CatalogSection />
      <Pricing />
      <Faq />
      <Closing />
    </main>
    <Footer />
    <a href={signup} className="vello-action fixed inset-x-4 bottom-4 z-30 flex h-12 items-center justify-center rounded-[10px] bg-ink font-body text-[14px] font-semibold text-paper shadow-[0_18px_44px_rgba(11,11,10,.26)] sm:hidden">Criar meu catálogo <ArrowRight className="vello-action-arrow ml-2" size={16} /></a>
  </div>;
}

function Header() {
  return <header className="border-b border-line bg-paper"><Container className="flex h-[68px] items-center justify-between"><a href="#inicio" aria-label="Vello - início"><Logo className="origin-left scale-[.78]" /></a><nav className="hidden items-center gap-8 font-body text-[14px] text-ash md:flex"><a href="#como-funciona" className="vello-nav-link">Como funciona</a><a href="#catalogo" className="vello-nav-link">Catálogo</a><a href="#plano" className="vello-nav-link">Plano</a><a href="#perguntas" className="vello-nav-link">Dúvidas</a></nav><a href={login} className="vello-action rounded-full border border-line px-4 py-2.5 font-body text-[13px] font-medium text-ink">Entrar</a></Container></header>;
}

function Hero() {
  return <section id="inicio" className="border-b border-line bg-paper"><Container className="grid min-h-[calc(100dvh-68px)] gap-12 py-12 md:py-16 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-16 lg:py-16"><Reveal y={14}><Eyebrow>Catálogo digital para corretores</Eyebrow><h1 className="mt-5 max-w-[580px] font-display text-[clamp(48px,5.5vw,76px)] font-semibold leading-[.91] tracking-[-.07em]">Imóveis bem apresentados. Conversas mais fáceis.</h1><p className="mt-7 max-w-[430px] font-body text-[17px] leading-relaxed text-ash">Organize imóveis, monte seu catálogo e compartilhe uma presença profissional em minutos.</p><div className="mt-9 flex flex-wrap gap-3"><a href={signup} className="vello-action vello-action-dark inline-flex h-12 items-center gap-2 rounded-full bg-ink px-5 font-body text-[14px] font-semibold text-paper">Criar catálogo <ArrowRight className="vello-action-arrow" size={16} /></a><a href="#como-funciona" className="vello-action inline-flex h-12 items-center rounded-full border border-line bg-white px-5 font-body text-[14px] font-medium">Ver como funciona</a></div><p className="mt-8 font-mono text-[10px] uppercase tracking-[.13em] text-stone">Feito para abrir bem no celular.</p></Reveal><Reveal delay={.08} y={18}><HeroVisual /></Reveal></Container></section>;
}

function HeroVisual() { return <div className="vello-hero-visual group relative overflow-hidden rounded-[20px] bg-cream shadow-[0_28px_80px_-46px_rgba(11,11,10,.38)]"><img src={appPath("/landing/vello-editorial-house.png")} alt="Casa contemporânea cercada por vegetação" className="aspect-[4/3] w-full object-cover" /><div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 bg-gradient-to-t from-black/70 via-black/20 to-transparent px-5 pb-5 pt-16 text-paper sm:px-7 sm:pb-6"><div><p className="font-mono text-[9px] uppercase tracking-[.16em] text-paper/65">Destaque da semana</p><p className="mt-2 font-display text-[21px] font-semibold tracking-[-.045em] sm:text-[25px]">Casa no Moinhos</p></div><span className="shrink-0 rounded-full border border-white/30 bg-black/20 px-3 py-1.5 font-body text-[11px] backdrop-blur-sm">Venda</span></div></div>; }

function OnboardingFlow() {
  const steps = [["01", "Crie seu perfil", "Suas informações profissionais e seu link público."], ["02", "Adicione seus imóveis", "Fotos, detalhes e valores organizados com clareza."], ["03", "Compartilhe", "Um catálogo pronto para abrir em qualquer tela."]];
  return <section id="como-funciona" className="bg-cream py-24 md:py-32"><Container><Reveal><h2 className="max-w-[660px] font-display text-[clamp(42px,5vw,68px)] font-semibold leading-[.91] tracking-[-.065em]">Uma rotina simples para apresentar melhor.</h2><p className="mt-6 max-w-[470px] font-body text-[16px] leading-relaxed text-ash">Da primeira foto ao link que abre na conversa com o cliente.</p></Reveal><div className="mt-14 grid border-y border-line md:grid-cols-3">{steps.map(([number, title, text], index) => <Reveal key={number} delay={index * .08} className={`py-8 md:min-h-[230px] md:py-10 ${index ? "border-t border-line md:border-l md:border-t-0 md:pl-9" : "md:pr-9"}`}><p className="font-mono text-[11px] uppercase tracking-[.14em] text-stone">{number}</p><h3 className="mt-10 font-display text-[27px] font-semibold tracking-[-.045em]">{title}</h3><p className="mt-3 max-w-[290px] font-body text-[15px] leading-relaxed text-ash">{text}</p></Reveal>)}</div></Container></section>;
}

function CatalogSection() {
  return <section id="catalogo" className="bg-paper py-24 md:py-32"><Container className="grid gap-14 lg:grid-cols-[.75fr_1.25fr] lg:items-center"><Reveal><h2 className="max-w-[500px] font-display text-[clamp(43px,5vw,68px)] font-semibold leading-[.91] tracking-[-.065em]">Um catálogo que parece seu.</h2><p className="mt-6 max-w-[430px] font-body text-[16px] leading-relaxed text-ash">Escolha a aparência, organize os imóveis e compartilhe uma página que deixa seu trabalho fácil de entender.</p><ul className="mt-8 space-y-3 border-t border-line pt-5 font-body text-[14px] text-ash"><li className="flex gap-3"><Check size={17} className="shrink-0 text-ink" />Perfil profissional e contato sempre visíveis.</li><li className="flex gap-3"><Check size={17} className="shrink-0 text-ink" />Filtros para o cliente encontrar o que procura.</li><li className="flex gap-3"><Check size={17} className="shrink-0 text-ink" />Seleções prontas para cada conversa.</li></ul></Reveal><Reveal delay={.12}><CatalogPreview /></Reveal></Container></section>;
}

function Pricing() {
  const features = [
    "Seu catálogo público com identidade profissional",
    "Imóveis, fotos e informações sempre organizados",
    "Seleções prontas para cada cliente",
    "Link compartilhável e contato em destaque",
    "Painel simples para atualizar quando quiser",
  ];
  return <section id="plano" className="border-y border-line bg-cream py-24 md:py-32"><Container><Reveal className="mx-auto max-w-[620px] text-center"><Eyebrow>Um plano, sem complicação</Eyebrow><h2 className="mt-5 font-display text-[clamp(42px,5vw,68px)] font-semibold leading-[.91] tracking-[-.065em]">Tudo que você precisa para apresentar melhor.</h2><p className="mx-auto mt-6 max-w-[460px] font-body text-[16px] leading-relaxed text-ash">Uma assinatura simples para organizar o seu portfólio e enviar uma Vello profissional para cada cliente.</p></Reveal><Reveal delay={.08} className="mx-auto mt-12 max-w-[760px]"><div className="overflow-hidden rounded-[24px] border border-ink bg-paper shadow-[0_28px_80px_-48px_rgba(11,11,10,.42)]"><div className="grid lg:grid-cols-[.9fr_1.1fr]"><div className="bg-ink p-7 text-paper sm:p-10"><p className="font-mono text-[10px] uppercase tracking-[.15em] text-paper/55">Plano Vello</p><p className="mt-8 font-body text-[15px] text-paper/55 line-through">R$ 65,90 por mês</p><p className="mt-2 font-display text-[clamp(54px,7vw,82px)] font-semibold leading-none tracking-[-.075em]">R$ 0</p><p className="mt-2 font-body text-[15px] text-paper/65">na primeira semana</p><p className="mt-8 max-w-[280px] font-body text-[16px] leading-relaxed text-paper/75">A estrutura profissional para o seu catálogo estar pronto quando a oportunidade chegar.</p><a href={signup} className="vello-action mt-9 inline-flex h-12 items-center gap-2 rounded-[10px] bg-paper px-5 font-body text-[14px] font-semibold text-ink">Criar minha conta <ArrowRight className="vello-action-arrow" size={16} /></a></div><div className="p-7 sm:p-10"><p className="font-display text-[24px] font-semibold tracking-[-.045em]">Inclui tudo para começar</p><ul className="mt-8 space-y-4 border-t border-line pt-6">{features.map((feature) => <li key={feature} className="flex items-start gap-3 font-body text-[14px] leading-relaxed text-ash"><Check size={17} className="mt-0.5 shrink-0 text-ink" />{feature}</li>)}</ul><p className="mt-8 border-t border-line pt-5 font-body text-[12px] leading-relaxed text-stone">Sem planos confusos: a Vello cresce junto com a sua rotina.</p></div></div></div></Reveal></Container></section>;
}

function CatalogPreview() {
  return <div className="overflow-hidden rounded-[24px] border border-line bg-[#f5f2ec] shadow-[0_28px_80px_-48px_rgba(11,11,10,.36)]"><div className="flex h-14 items-center justify-between border-b border-black/10 bg-ink px-5 text-paper"><span className="font-display text-[15px] font-semibold">Vello</span><span className="hidden font-body text-[11px] text-paper/65 sm:inline">Catálogo &nbsp;&nbsp; Imóveis &nbsp;&nbsp; Seleções</span><Share2 size={16} /></div><div className="p-5 sm:p-7"><div className="flex items-center gap-3 rounded-[14px] bg-white p-3 shadow-[0_12px_28px_rgba(11,11,10,.06)]"><span className="grid h-9 w-9 place-items-center rounded-full bg-ink font-display text-xs text-paper">J</span><span><b className="block font-body text-[12px]">Jose</b><small className="block font-body text-[10px] text-ash">Catálogo digital para imóveis</small></span></div><div className="mt-8 flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[9px] uppercase tracking-[.14em] text-stone">Catálogo de imóveis</p><h3 className="mt-2 font-display text-[30px] font-semibold tracking-[-.055em] sm:text-[37px]">Todos os imóveis</h3></div><span className="rounded-full border border-line bg-white px-4 py-2 font-body text-[11px] text-ash">Onde você quer morar?</span></div><div className="mt-5 flex gap-2 overflow-hidden">{["Todos", "Comprar", "Alugar", "Casas"].map((filter, index) => <span key={filter} className={`shrink-0 rounded-full px-3 py-2 font-body text-[10px] ${index === 0 ? "bg-ink text-paper" : "border border-line bg-white text-ash"}`}>{filter}</span>)}</div><div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">{propertyImages.map((image, index) => <article key={image} className="vello-property-card overflow-hidden rounded-[12px] bg-white"><img src={appPath(image)} alt="Imóvel no catálogo" className="aspect-[1.2/1] w-full object-cover" /><div className="p-3"><p className="font-display text-[14px] font-semibold leading-tight">{["Casa contemporânea", "Apartamento alto", "Cobertura pronta"][index]}</p><p className="mt-2 font-body text-[10px] text-ash">Porto Alegre · RS</p></div></article>)}</div></div></div>;
}

function Faq() {
  const questions = [
    ["Preciso saber criar site?", "Não. A Vello já entrega um catálogo com seu perfil, imóveis e formas de contato."],
    ["O cliente precisa criar uma conta?", "Não. Ele abre o link do catálogo ou da seleção diretamente no navegador."],
    ["Posso atualizar os imóveis depois?", "Sim. Você pode editar informações, fotos, valores e disponibilidade pelo painel."],
    ["Cada cliente pode receber uma seleção diferente?", "Sim. Crie uma seleção com os imóveis certos e envie um link próprio para a conversa."],
    ["Funciona bem no celular?", "Sim. O catálogo foi pensado para ser aberto e compartilhado pelo celular."],
  ];
  return <section id="perguntas" className="border-t border-line bg-cream py-24 md:py-32"><Container className="grid gap-12 lg:grid-cols-[.7fr_1.3fr]"><Reveal><Eyebrow>Perguntas frequentes</Eyebrow><h2 className="mt-5 max-w-[420px] font-display text-[clamp(42px,5vw,66px)] font-semibold leading-[.91] tracking-[-.065em]">Tudo para começar com clareza.</h2></Reveal><div className="border-t border-line">{questions.map(([question, answer]) => <details key={question} className="group border-b border-line py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-5 font-display text-[20px] font-semibold tracking-[-.035em] marker:hidden"><span>{question}</span><span aria-hidden="true" className="text-ash transition-transform duration-200 group-open:rotate-45">+</span></summary><p className="max-w-[580px] pt-4 font-body text-[15px] leading-relaxed text-ash">{answer}</p></details>)}</div></Container></section>;
}

function Closing() { return <section className="bg-ink py-24 text-paper md:py-32"><Container><Reveal className="max-w-[760px]"><Eyebrow>Sua Vello</Eyebrow><h2 className="mt-5 font-display text-[clamp(48px,6vw,78px)] font-semibold leading-[.9] tracking-[-.07em]">Seu trabalho merece<br />ser bem apresentado.</h2><p className="mt-7 max-w-[520px] font-body text-[16px] leading-relaxed text-paper/65">Crie uma conta, organize seu portfólio e tenha um catálogo pronto para enviar.</p><a href={signup} className="vello-action mt-9 inline-flex h-12 items-center gap-2 rounded-[10px] bg-paper px-5 font-body text-[14px] font-semibold text-ink">Criar meu catálogo <ArrowRight className="vello-action-arrow" size={16} /></a></Reveal></Container></section>; }

function Footer() { return <footer className="border-t border-paper/10 bg-ink pb-9 text-paper"><Container className="flex flex-col justify-between gap-7 border-t border-paper/10 pt-9 sm:flex-row sm:items-center"><Logo variant="light" className="origin-left scale-[.82]" /><div className="flex flex-wrap gap-x-5 gap-y-2 font-body text-[12px] text-paper/60"><a href={appPath("/suporte")} className="hover:text-paper">Suporte</a><a href={appPath("/termos")} className="hover:text-paper">Termos</a><a href={appPath("/privacidade")} className="hover:text-paper">Privacidade</a><a href={appPath("/login")} className="hover:text-paper">Entrar</a></div><p className="font-mono text-[10px] uppercase tracking-[.12em] text-paper/40">© {new Date().getFullYear()} Vello</p></Container></footer>; }
