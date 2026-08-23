import { ArrowRight, Check, Sparkles } from 'lucide-react';
import { Container, Reveal } from './Primitives';
import { appPath } from '../lib/paths';

const FEATURES = [
  'Catálogo personalizado',
  'Cadastro ilimitado de imóveis',
  'Seleções para cada cliente',
  'Link pronto para compartilhar',
  'Integração com WhatsApp',
  'Perfil profissional do corretor',
];

export function Pricing() {
  return (
    <section id="precos" className="bg-paper px-4 py-24 md:py-32">
      <Container className="flex max-w-5xl flex-col items-center">
        <Reveal className="text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-stone">Preço simples</p>
          <h2 className="mt-4 font-display text-[36px] font-semibold leading-[1.04] tracking-[-0.04em] text-ink md:text-[52px]">Tudo que você precisa para vender melhor.</h2>
          <p className="mx-auto mt-5 max-w-[500px] font-body text-[16px] leading-relaxed text-ash">Uma experiência profissional para apresentar seus imóveis sem complicar sua rotina.</p>
        </Reveal>

        <Reveal delay={0.12} className="mt-12 w-full max-w-[520px]">
          <article className="relative overflow-hidden rounded-[26px] bg-ink p-7 text-paper shadow-[0_35px_90px_-35px_rgba(11,11,10,0.65)] md:p-9">
            <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/[0.07] blur-3xl" />
            <div className="relative">
              <div className="flex items-start justify-between gap-4"><div><div className="flex items-center gap-2"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"><Sparkles size={16} /></span><p className="font-mono text-[10px] uppercase tracking-[0.13em] text-paper/60">Plano completo</p></div><h3 className="mt-6 font-display text-[30px] font-semibold tracking-[-0.03em]">Vello Pro</h3></div><span className="rounded-full bg-paper px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-ink">Lançamento</span></div>
              <p className="mt-3 max-w-[390px] font-body text-[14px] leading-relaxed text-paper/60">Tudo para transformar seus imóveis em uma apresentação que o cliente entende e quer compartilhar.</p>
              <div className="mt-7 flex items-end gap-2 border-y border-white/10 py-6"><span className="font-display text-[56px] font-semibold leading-none tracking-[-0.05em]">R$ 49</span><span className="mb-1 font-mono text-[11px] text-paper/50">/ mês</span></div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">{FEATURES.map((feature) => <div key={feature} className="flex items-center gap-2.5 font-body text-[13px] text-paper/80"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-paper"><Check size={12} /></span>{feature}</div>)}</div>
              <a href={appPath('/cadastro')} className="group mt-8 flex items-center justify-center gap-2 rounded-full bg-paper py-4 font-body text-[14px] font-semibold text-ink transition-transform hover:scale-[1.02]">Criar meu catálogo <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" /></a>
              <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-paper/35">Valor ilustrativo · preço final será definido no lançamento</p>
            </div>
          </article>
        </Reveal>
      </Container>
    </section>
  );
}
