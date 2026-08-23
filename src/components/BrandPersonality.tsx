import { Container, Reveal } from './Primitives';

export function BrandPersonality() {
  return (
    <section className="relative overflow-hidden py-24 md:py-36">
      <Container className="grid items-center gap-14 md:grid-cols-2">
        <Reveal>
          <h2 className="balance font-display text-[34px] font-semibold leading-[1.1] tracking-[-0.015em] text-ink md:text-[46px]">
            Bonito para o cliente.
            <br />
            Simples para o corretor.
          </h2>
          <p className="balance mt-6 max-w-[420px] font-body text-[17px] leading-relaxed text-ash">
            A Vello tira o trabalho de organizar e apresentar seus imóveis para
            que você possa focar no que realmente importa: vender.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="relative flex justify-center md:justify-end">
          <div className="relative h-[320px] w-[320px] overflow-hidden rounded-[28px] bg-paper md:h-[380px] md:w-[380px] md:translate-x-10">
            <img
              src="/vello-logo.png"
              alt="Mascote da Vello"
              className="h-full w-full object-cover"
            />
            <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-14 -left-10 h-52 w-52 rounded-full bg-white/[0.04] blur-2xl" />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
