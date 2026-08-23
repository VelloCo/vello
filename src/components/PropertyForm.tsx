import { ImagePlus, Sparkles } from 'lucide-react';
import { Container, Reveal, Eyebrow } from './Primitives';

const FIELDS = [
  { label: 'Título', value: 'Apartamento no Moinhos de Vento' },
  { label: 'Preço', value: 'R$ 890.000' },
  { label: 'Tipo', value: 'Apartamento' },
  { label: 'Venda / aluguel', value: 'Venda' },
  { label: 'Cidade', value: 'Porto Alegre' },
  { label: 'Bairro', value: 'Moinhos de Vento' },
  { label: 'Quartos', value: '3' },
  { label: 'Banheiros', value: '2' },
  { label: 'Vagas', value: '2' },
  { label: 'Área', value: '124 m²' },
];

export function PropertyForm() {
  return (
    <section className="py-24 md:py-32 bg-cream/60">
      <Container>
        <Reveal>
          <Eyebrow>Cadastro de imóvel</Eyebrow>
          <h2 className="balance mt-4 max-w-[600px] font-display text-[32px] font-semibold leading-[1.12] tracking-[-0.015em] text-ink md:text-[42px]">
            Seu próximo imóvel no ar em minutos.
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-14 grid gap-0 overflow-hidden rounded-[20px] border border-line/70 bg-white shadow-[0_40px_90px_-45px_rgba(11,11,10,0.35)] md:grid-cols-[0.9fr_1.1fr]">
            {/* Drag and drop */}
            <div className="flex flex-col justify-center border-b border-line/70 p-8 md:border-b-0 md:border-r md:p-10">
              <span className="font-mono text-[10.5px] uppercase tracking-wide text-stone">Fotos</span>
              <div className="mt-3 flex h-[220px] flex-col items-center justify-center gap-3 rounded-[16px] border border-dashed border-line bg-cream/50">
                <ImagePlus size={26} strokeWidth={1.4} className="text-stone" />
                <p className="font-body text-[13.5px] text-ash">Arraste as fotos aqui</p>
                <p className="font-mono text-[11px] text-stone">ou clique para selecionar</p>
              </div>
            </div>

            {/* Info fields */}
            <div className="p-8 md:p-10">
              <span className="font-mono text-[10.5px] uppercase tracking-wide text-stone">Informações</span>
              <div className="mt-3 grid grid-cols-2 gap-3">
                {FIELDS.map((f) => (
                  <div key={f.label} className="rounded-lg border border-line/70 px-3 py-2">
                    <p className="font-mono text-[9.5px] uppercase tracking-wide text-stone">{f.label}</p>
                    <p className="mt-0.5 truncate font-body text-[13px] text-ink">{f.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3 rounded-lg border border-line/70 px-3 py-2.5">
                <div className="flex items-center justify-between">
                  <p className="font-mono text-[9.5px] uppercase tracking-wide text-stone">Descrição</p>
                  <span className="inline-flex items-center gap-1 font-mono text-[10.5px] text-ash">
                    <Sparkles size={11} /> Gerar descrição
                  </span>
                </div>
                <p className="mt-1.5 font-body text-[13px] leading-relaxed text-ash">
                  Apartamento amplo e iluminado, a poucos passos do Parque Moinhos de Vento...
                </p>
              </div>

              <button className="mt-5 w-full rounded-full bg-ink py-3 font-body text-[14px] font-medium text-paper transition-transform hover:scale-[1.01] sm:w-auto sm:px-8">
                Publicar imóvel
              </button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
