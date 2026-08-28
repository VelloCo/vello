import { Container, Eyebrow, Reveal } from './Primitives';
import { appPath } from '../lib/paths';

export function Catalog() {
  return (
    <section id="produto" className="overflow-hidden bg-paper py-24 md:py-36">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.74fr_1.26fr] lg:items-end lg:gap-16">
          <Reveal>
            <Eyebrow>Seu espaço na internet</Eyebrow>
            <h2 className="balance mt-4 max-w-[520px] font-display text-[38px] font-semibold leading-[1.04] tracking-[-0.045em] text-ink md:text-[56px]">
              Um catálogo que parece seu. E funciona como deveria.
            </h2>
            <p className="mt-5 max-w-[440px] font-body text-[16px] leading-relaxed text-ash md:text-[17px]">
              O cliente encontra os imóveis, entende o que importa e chega na conversa já interessado.
            </p>
            <div className="mt-9 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.1em] text-stone">
              <span className="h-px w-9 bg-line" />
              Tela real da Vello
            </div>
          </Reveal>
          <Reveal className="min-w-0">
            <div className="overflow-hidden rounded-[24px] border border-line bg-cream shadow-[0_32px_90px_-46px_rgba(11,11,10,0.42)]">
              <img src={appPath('/landing/catalog-real.png')} alt="Catálogo público da Vello mostrando o perfil do corretor e os filtros de imóveis" className="block w-full" />
            </div>
          </Reveal>
        </div>

        <div className="mt-20 grid gap-10 border-t border-line pt-8 md:grid-cols-3 md:gap-7">
          <ProductPoint number="01" title="Cadastre uma vez" text="Fotos, características, preço e status sempre no mesmo lugar." />
          <ProductPoint number="02" title="Personalize seu espaço" text="Cores, estilo dos cards e faixa de perfil sem desmontar o design." />
          <ProductPoint number="03" title="Compartilhe o que importa" text="Catálogo, imóvel ou seleção prontos para abrir no WhatsApp." />
        </div>
      </Container>
    </section>
  );
}

function ProductPoint({ number, title, text }: { number: string; title: string; text: string }) {
  return <Reveal><div className="flex gap-4"><span className="pt-1 font-mono text-[10px] text-stone">{number}</span><div><p className="font-display text-[20px] font-semibold tracking-[-0.025em] text-ink">{title}</p><p className="mt-2 max-w-[270px] font-body text-[14px] leading-relaxed text-ash">{text}</p></div></div></Reveal>;
}
