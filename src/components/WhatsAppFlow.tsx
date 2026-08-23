import { Container, Reveal, Eyebrow } from './Primitives';
import { properties } from '../data/properties';

export function WhatsAppFlow() {
  return (
    <section className="py-24 md:py-32">
      <Container>
        <Reveal>
          <Eyebrow>Integração com WhatsApp</Eyebrow>
          <h2 className="balance mt-4 max-w-[560px] font-display text-[32px] font-semibold leading-[1.12] tracking-[-0.015em] text-ink md:text-[42px]">
            Feito para onde seus clientes já estão.
          </h2>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={0}>
            <StepCard n="1" label="Corretor envia">
              <div className="rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 font-body text-[12.5px] leading-snug text-ink shadow-sm">
                Oi Mariana! Separei alguns imóveis que combinam com o que você
                procura 👇
              </div>
              <div className="mt-2 inline-block rounded-2xl rounded-tl-sm bg-ink px-3.5 py-2 font-mono text-[11px] text-paper">
                vello.com.br/carlos/mariana
              </div>
            </StepCard>
          </Reveal>

          <Reveal delay={0.1}>
            <StepCard n="2" label="Mariana abre a Vello">
              <div className="overflow-hidden rounded-[12px] border border-line/70 bg-white">
                <div
                  className="h-[86px] bg-cover bg-center"
                  style={{ backgroundImage: `url(${properties[0].image})` }}
                />
                <div className="p-2.5">
                  <p className="font-display text-[11.5px] font-medium text-ink leading-tight">
                    {properties[0].title}
                  </p>
                  <p className="mt-1 font-mono text-[11.5px] text-ink">{properties[0].price}</p>
                </div>
              </div>
            </StepCard>
          </Reveal>

          <Reveal delay={0.2}>
            <StepCard n="3" label="Ela escolhe">
              <div className="flex gap-2">
                <span className="flex-1 rounded-full border border-line bg-white px-3 py-2 text-center font-body text-[12.5px] text-ink">
                  ❤️ Gostei
                </span>
                <span className="flex-1 rounded-full bg-ink px-3 py-2 text-center font-body text-[12.5px] text-paper">
                  Quero visitar
                </span>
              </div>
            </StepCard>
          </Reveal>

          <Reveal delay={0.3}>
            <StepCard n="4" label="Volta pro WhatsApp">
              <div className="rounded-2xl rounded-tr-sm bg-ink px-3.5 py-2.5 font-body text-[12.5px] leading-snug text-paper">
                Oi Carlos! Gostei do apartamento no Moinhos de Vento e gostaria
                de marcar uma visita.
              </div>
            </StepCard>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function StepCard({
  n,
  label,
  children,
}: {
  n: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col rounded-[18px] border border-line/70 bg-cream/50 p-5">
      <div className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-ink font-mono text-[11px] text-paper">
          {n}
        </span>
        <span className="font-mono text-[11px] text-stone">{label}</span>
      </div>
      <div className="mt-4 flex-1">{children}</div>
    </div>
  );
}
