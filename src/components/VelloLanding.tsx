import { motion } from 'framer-motion';
import {
  ArrowRight,
  Building2,
  FolderHeart,
  Menu,
  Palette,
  Search,
  Share2,
  Smartphone,
  UserRound,
  X,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { appPath } from '../lib/paths';
import { Logo } from './Logo';
import { PhoneMockup } from './PhoneMockup';
import { Container } from './Primitives';

const ease = [0.4, 0, 0.2, 1] as const;
const viewport = { once: true, margin: '-10% 0px' };

const navigation = [
  { label: 'Início', href: '#inicio' },
  { label: 'Recursos', href: '#recursos' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Contato', href: '#contato' },
];

export function VelloLanding() {
  return (
    <div className="overflow-x-hidden bg-black text-white">
      <LandingHeader />
      <main>
        <Hero />
        <Numbers />
        <FeatureCenter />
        <EverydayFeatures />
        <HowItWorks />
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
    <header className="absolute inset-x-0 top-0 z-50 border-b border-white/[0.06] bg-black/80 backdrop-blur-xl">
      <Container className="flex h-[78px] items-center justify-between lg:h-[88px]">
        <a href="#inicio" aria-label="Vello — início" className="shrink-0">
          <Logo variant="light" />
        </a>

        <nav className="hidden items-center gap-9 lg:flex">
          {navigation.map((item, index) => (
            <button
              key={item.href}
              type="button"
              onClick={() => goTo(item.href)}
              className={`font-body text-[14px] transition-colors duration-150 ${index === 0 ? 'font-semibold text-white' : 'text-white/55 hover:text-white'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-5 lg:flex">
          <a href={appPath('/login')} className="font-body text-[14px] text-white/55 transition-colors hover:text-white">
            Entrar
          </a>
          <a
            href={appPath('/cadastro')}
            className="rounded-full bg-white px-5 py-3 font-body text-[14px] font-semibold text-black transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
          >
            Criar catálogo
          </a>
        </div>

        <div className="flex items-center gap-3 lg:hidden">
          <a href={appPath('/cadastro')} className="rounded-full bg-white px-4 py-2.5 font-body text-[12px] font-semibold text-black">
            Começar
          </a>
          <button
            type="button"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            onClick={() => setOpen((current) => !current)}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </Container>

      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease }}
          className="border-t border-white/10 bg-black px-6 py-7 lg:hidden"
        >
          <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
            {navigation.map((item) => (
              <button key={item.href} type="button" onClick={() => goTo(item.href)} className="text-left font-display text-[27px] font-semibold tracking-[-0.045em]">
                {item.label}
              </button>
            ))}
            <a href={appPath('/login')} className="pt-2 font-body text-[14px] text-white/60">Já tenho uma conta</a>
          </div>
        </motion.div>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative min-h-screen overflow-hidden bg-black pt-[142px] md:pt-[174px]">
      <Container className="relative z-10 text-center">
        <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.62, ease }}>
          <h1 className="mx-auto max-w-[1080px] font-display text-[clamp(48px,7.1vw,94px)] font-medium leading-[0.98] tracking-[-0.07em]">
            Seus imóveis merecem uma apresentação que impressiona.
          </h1>
          <p className="mx-auto mt-6 max-w-[730px] font-body text-[15px] leading-relaxed text-white/52 sm:text-[17px]">
            A Vello reúne seu perfil, seus imóveis e as seleções de cada cliente em um catálogo profissional, pronto para compartilhar.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={appPath('/cadastro')}
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-body text-[14px] font-semibold text-black transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
            >
              Criar meu catálogo <ArrowRight size={15} />
            </a>
            <button
              type="button"
              onClick={() => document.querySelector('#recursos')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-full border border-white/18 px-6 py-3.5 font-body text-[14px] font-medium text-white transition-colors hover:bg-white/10"
            >
              Conhecer a Vello
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 44, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.12, duration: 0.82, ease }}
          className="relative mx-auto mt-12 h-[500px] max-w-[1120px] sm:h-[590px] lg:h-[650px]"
        >
          <div className="absolute left-1/2 top-[58%] h-[430px] w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/10 sm:h-[520px] sm:w-[1040px]" />
          <div className="absolute left-1/2 top-[60%] h-[300px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-[50%] border border-white/[0.07] sm:h-[390px] sm:w-[780px]" />
          <span className="absolute left-[5%] top-[43%] hidden h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_24px_rgba(255,255,255,0.75)] sm:block" />
          <span className="absolute right-[8%] top-[34%] hidden h-3 w-3 rounded-full bg-white/80 shadow-[0_0_26px_rgba(255,255,255,0.65)] sm:block" />
          <span className="absolute left-[14%] top-[26%] hidden rounded-full border border-white/12 bg-[#131313] p-4 text-white/72 sm:grid">
            <Share2 size={20} />
          </span>
          <span className="absolute right-[14%] top-[20%] hidden rounded-full border border-white/12 bg-[#131313] p-4 text-white/72 sm:grid">
            <Search size={20} />
          </span>

          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-[92px] z-10 -translate-x-[72%] scale-[0.78] sm:top-[74px] sm:-translate-x-[92%] sm:scale-[0.96] lg:top-[54px] lg:-translate-x-[98%] lg:scale-[1.08]"
          >
            <PhoneMockup>
              <img src={appPath('/landing/dashboard-real.png')} alt="Painel da Vello no celular" className="h-[560px] w-full object-cover object-top" />
            </PhoneMockup>
          </motion.div>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-[40px] z-20 -translate-x-[26%] scale-[0.86] sm:top-[34px] sm:translate-x-[-5%] sm:scale-[1.04] lg:top-[16px] lg:translate-x-[-2%] lg:scale-[1.18]"
          >
            <PhoneMockup>
              <img src={appPath('/landing/catalog-real.png')} alt="Catálogo público da Vello no celular" className="h-[560px] w-full object-cover object-top" />
            </PhoneMockup>
          </motion.div>
          <div className="absolute inset-x-0 bottom-0 z-30 h-44 bg-gradient-to-t from-black via-black/90 to-transparent" />
        </motion.div>
      </Container>
    </section>
  );
}

function Numbers() {
  const items = [
    ['1 link', 'para apresentar seu catálogo e atender melhor'],
    ['3 passos', 'para configurar o perfil, cadastrar e compartilhar'],
    ['100%', 'pensado para funcionar bem no celular'],
  ];

  return (
    <section className="bg-black pb-28 pt-10 md:pb-40 md:pt-20">
      <Container>
        <Reveal className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Do cadastro ao atendimento</p>
          <h2 className="mx-auto mt-5 max-w-[940px] font-display text-[clamp(42px,5.7vw,76px)] font-medium leading-[1] tracking-[-0.06em]">
            Uma rotina mais simples. Uma apresentação muito melhor.
          </h2>
        </Reveal>

        <div className="mt-20 grid gap-14 md:grid-cols-3 md:gap-0">
          {items.map(([number, description], index) => (
            <Reveal key={number} delay={index * 0.07}>
              <div className={`min-h-[180px] md:px-10 ${index > 0 ? 'md:border-l md:border-white/10' : ''} ${index === 1 ? 'md:pt-16' : ''}`}>
                <p className="font-display text-[clamp(55px,6vw,82px)] font-medium leading-none tracking-[-0.07em]">{number}</p>
                <p className="mt-4 max-w-[280px] font-body text-[15px] leading-relaxed text-white/48">{description}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeatureCenter() {
  const features = [
    { icon: Smartphone, title: 'Painel inteligente', description: 'Veja seus imóveis, seleções e acessos de um só lugar.' },
    { icon: Building2, title: 'Imóveis organizados', description: 'Fotos, valores e detalhes sempre prontos para apresentar.' },
    { icon: FolderHeart, title: 'Seleções por cliente', description: 'Monte uma página específica para cada oportunidade.' },
    { icon: Palette, title: 'Catálogo personalizável', description: 'Ajuste o visual para combinar com sua forma de trabalhar.' },
  ];

  return (
    <section id="recursos" className="bg-black py-24 md:py-36">
      <Container>
        <div className="grid gap-14 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
          <div>
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Tudo em um só lugar</p>
              <h2 className="mt-5 max-w-[650px] font-display text-[clamp(44px,5.3vw,72px)] font-medium leading-[0.98] tracking-[-0.065em]">
                Seu centro de apresentação imobiliária.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-x-9 gap-y-11 sm:grid-cols-2">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <Reveal key={feature.title} delay={index * 0.06}>
                    <article>
                      <span className="grid h-12 w-12 place-items-center rounded-[14px] border border-white/15 bg-white text-black shadow-[0_0_32px_rgba(255,255,255,0.12)]">
                        <Icon size={20} strokeWidth={1.8} />
                      </span>
                      <h3 className="mt-5 font-display text-[22px] font-semibold tracking-[-0.045em]">{feature.title}</h3>
                      <p className="mt-2 max-w-[265px] font-body text-[14px] leading-relaxed text-white/45">{feature.description}</p>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          </div>

          <Reveal className="relative min-h-[590px] overflow-hidden rounded-[34px] border border-white/[0.08] bg-[#141414] sm:min-h-[690px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.09),transparent_38%)]" />
            <div className="absolute left-1/2 top-[96px] z-10 -translate-x-[88%] rotate-[-7deg] scale-[0.86] opacity-65 sm:top-[82px] sm:-translate-x-[102%] sm:scale-[1.03]">
              <PhoneMockup>
                <img src={appPath('/landing/dashboard-real.png')} alt="Gestão de imóveis na Vello" className="h-[560px] w-full object-cover object-top" />
              </PhoneMockup>
            </div>
            <div className="absolute left-1/2 top-[44px] z-20 -translate-x-[16%] rotate-[4deg] scale-[0.94] sm:top-[38px] sm:-translate-x-[12%] sm:scale-[1.1]">
              <PhoneMockup>
                <img src={appPath('/landing/catalog-real.png')} alt="Catálogo Vello visto pelo cliente" className="h-[560px] w-full object-cover object-top" />
              </PhoneMockup>
            </div>
            <div className="absolute inset-x-0 bottom-0 z-30 h-48 bg-gradient-to-t from-[#141414] via-[#141414]/92 to-transparent" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function EverydayFeatures() {
  return (
    <section className="bg-black py-24 md:py-36">
      <Container>
        <Reveal className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">O essencial, bem resolvido</p>
          <h2 className="mx-auto mt-5 max-w-[900px] font-display text-[clamp(43px,5.3vw,72px)] font-medium leading-[0.98] tracking-[-0.06em]">
            Feito para o seu dia a dia. E para a tela do seu cliente.
          </h2>
          <p className="mx-auto mt-5 max-w-[650px] font-body text-[15px] leading-relaxed text-white/45">
            Uma experiência limpa para cadastrar, organizar, selecionar e apresentar imóveis sem complicar seu atendimento.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-2">
          <ProductCard
            image="/landing/catalog-real.png"
            eyebrow="Catálogo público"
            title="Todos os seus imóveis, em uma vitrine."
            description="Seu cliente encontra, filtra e abre cada imóvel em uma página preparada para gerar interesse."
          />
          <ProductCard
            image="/landing/customizer-real.png"
            eyebrow="Seleções personalizadas"
            title="Uma página certa para cada conversa."
            description="Escolha os imóveis, escreva uma mensagem e envie um link feito especialmente para aquele cliente."
            reverse
          />
        </div>
      </Container>
    </section>
  );
}

function ProductCard({ image, eyebrow, title, description, reverse = false }: { image: string; eyebrow: string; title: string; description: string; reverse?: boolean }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ duration: 0.56, ease }}
      className="group overflow-hidden rounded-[30px] border border-white/[0.08] bg-[#151515]"
    >
      <div className="relative h-[360px] overflow-hidden border-b border-white/[0.08] bg-[#101010] sm:h-[430px]">
        <div className={`absolute inset-0 ${reverse ? 'bg-[radial-gradient(circle_at_26%_28%,rgba(255,255,255,0.10),transparent_42%)]' : 'bg-[radial-gradient(circle_at_72%_30%,rgba(255,255,255,0.10),transparent_42%)]'}`} />
        <div className={`absolute top-10 transition-transform duration-500 group-hover:-translate-y-2 ${reverse ? 'left-1/2 -translate-x-[42%] rotate-[3deg] scale-[0.82] sm:scale-[0.9]' : 'left-1/2 -translate-x-1/2 scale-[0.82] sm:scale-[0.9]'}`}>
          <PhoneMockup>
            <img src={appPath(image)} alt={title} className="h-[560px] w-full object-cover object-top" />
          </PhoneMockup>
        </div>
        <span className="absolute left-8 top-8 grid h-12 w-12 place-items-center rounded-full border border-white/10 bg-white text-black">
          {reverse ? <UserRound size={19} /> : <Search size={19} />}
        </span>
      </div>
      <div className="p-7 sm:p-9">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/35">{eyebrow}</p>
        <h3 className="mt-4 max-w-[470px] font-display text-[31px] font-semibold leading-[1.02] tracking-[-0.055em] sm:text-[38px]">{title}</h3>
        <p className="mt-4 max-w-[490px] font-body text-[14px] leading-relaxed text-white/45">{description}</p>
      </div>
    </motion.article>
  );
}

function HowItWorks() {
  const steps = [
    ['01', 'Crie seu perfil', 'Adicione seus dados profissionais e deixe sua apresentação pronta.'],
    ['02', 'Cadastre os imóveis', 'Organize fotos, valores, diferenciais e informações importantes.'],
    ['03', 'Compartilhe', 'Envie seu catálogo ou uma seleção personalizada em um único link.'],
  ];

  return (
    <section id="como-funciona" className="bg-black py-24 md:py-36">
      <Container>
        <Reveal>
          <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Como funciona</p>
          <h2 className="mt-5 max-w-[800px] font-display text-[clamp(44px,5.5vw,74px)] font-medium leading-[0.98] tracking-[-0.065em]">
            Comece em três passos simples.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-12 md:grid-cols-3 md:gap-0">
          {steps.map(([number, title, description], index) => (
            <Reveal key={number} delay={index * 0.07}>
              <article className={`min-h-[245px] md:px-10 ${index > 0 ? 'md:border-l md:border-white/10' : ''} ${index === 0 ? 'md:pl-0' : ''}`}>
                <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-white font-display text-[17px] font-semibold text-black shadow-[0_0_30px_rgba(255,255,255,0.12)]">{number}</span>
                <h3 className="mt-12 font-display text-[29px] font-semibold tracking-[-0.05em]">{title}</h3>
                <p className="mt-3 max-w-[300px] font-body text-[14px] leading-relaxed text-white/45">{description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

function ClosingCall() {
  return (
    <section id="contato" className="bg-black pb-8 pt-14 md:pb-10 md:pt-24">
      <Container>
        <Reveal className="relative min-h-[600px] overflow-hidden rounded-[34px] border border-white/[0.08] bg-[#171717] p-7 sm:p-12 lg:min-h-[540px] lg:p-14">
          <div className="absolute right-0 top-0 h-full w-full bg-[radial-gradient(circle_at_88%_8%,rgba(255,255,255,0.15),transparent_36%)] lg:w-[58%]" />
          <div className="relative z-20 max-w-[550px] lg:pt-12">
            <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">Sua vitrine começa aqui</p>
            <h2 className="mt-5 font-display text-[clamp(43px,5.1vw,70px)] font-medium leading-[0.98] tracking-[-0.065em]">
              Apresente seus imóveis melhor, a partir de hoje.
            </h2>
            <p className="mt-5 max-w-[460px] font-body text-[15px] leading-relaxed text-white/48">
              Crie sua conta, organize seu catálogo e transforme cada conversa em uma apresentação profissional.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={appPath('/cadastro')} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3.5 font-body text-[14px] font-semibold text-black transition-transform duration-150 hover:scale-[1.02]">
                Criar meu catálogo <ArrowRight size={15} />
              </a>
              <a href={appPath('/jose')} className="rounded-full border border-white/18 px-6 py-3.5 font-body text-[14px] font-medium text-white hover:bg-white/10">
                Ver demonstração
              </a>
            </div>
          </div>

          <div className="absolute bottom-[-138px] right-[-92px] z-10 hidden rotate-[2deg] scale-[1.05] lg:block xl:right-[30px] xl:scale-[1.15]">
            <PhoneMockup>
              <img src={appPath('/landing/catalog-real.png')} alt="Catálogo Vello em um celular" className="h-[560px] w-full object-cover object-top" />
            </PhoneMockup>
          </div>
          <div className="absolute bottom-[-170px] right-[175px] z-0 hidden -rotate-[6deg] opacity-55 lg:block xl:right-[300px]">
            <PhoneMockup>
              <img src={appPath('/landing/property-real.png')} alt="Detalhe de um imóvel na Vello" className="h-[560px] w-full object-cover object-top" />
            </PhoneMockup>
          </div>

          <div className="absolute bottom-[-255px] left-1/2 z-10 -translate-x-1/2 scale-[0.78] lg:hidden">
            <PhoneMockup>
              <img src={appPath('/landing/catalog-real.png')} alt="Catálogo Vello em um celular" className="h-[560px] w-full object-cover object-top" />
            </PhoneMockup>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function LandingFooter() {
  return (
    <footer className="bg-black pb-5 pt-4 text-white">
      <Container>
        <div className="rounded-[30px] border border-white/[0.08] bg-[#171717] px-7 py-10 sm:px-10 lg:px-12 lg:py-12">
          <div className="grid gap-12 lg:grid-cols-[1.35fr_0.65fr_0.65fr_1fr]">
            <div>
              <Logo variant="light" />
              <p className="mt-5 max-w-[330px] font-body text-[14px] leading-relaxed text-white/42">
                A plataforma para corretores apresentarem imóveis, criarem seleções e compartilharem oportunidades com mais profissionalismo.
              </p>
            </div>
            <FooterColumn title="Produto" links={[['Recursos', '#recursos'], ['Como funciona', '#como-funciona'], ['Demonstração', appPath('/jose')]]} />
            <FooterColumn title="Conta" links={[['Entrar', appPath('/login')], ['Criar conta', appPath('/cadastro')], ['Dashboard', appPath('/dashboard')]]} />
            <div>
              <p className="font-body text-[14px] font-semibold">Fale com a Vello</p>
              <a href="mailto:vellocorretores@gmail.com" className="mt-5 block font-body text-[14px] text-white/45 transition-colors hover:text-white">vellocorretores@gmail.com</a>
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

function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewport}
      transition={{ delay, duration: 0.56, ease }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
