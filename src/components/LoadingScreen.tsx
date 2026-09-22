import { Logo } from "./Logo";

// Animações em CSS (index.css) para não puxar a biblioteca de animação no
// carregamento inicial.
export function LoadingScreen({ label = "Preparando seu espaço" }: { label?: string }) {
  return (
    <main className="grid min-h-screen place-items-center bg-[#F7FAFC] px-6">
      <section
        className="vello-loading-in flex w-full max-w-sm flex-col items-center text-center"
        aria-live="polite"
        aria-busy="true"
      >
        <div className="relative grid h-28 w-28 place-items-center">
          <span className="vello-loading-ring absolute inset-0 rounded-full border border-[#7EAFD0]/25" />
          <span className="vello-loading-ring vello-loading-ring-reverse absolute inset-3 rounded-full border border-[#7EAFD0]/35" />
          <div className="relative grid h-20 w-20 place-items-center rounded-full border border-white bg-white shadow-[0_18px_55px_rgba(18,40,58,.10)]">
            <Logo className="scale-[.78] [&_span]:sr-only" />
          </div>
        </div>

        <p className="mt-8 font-display text-2xl font-semibold tracking-[-.035em] text-ink">
          {label}
        </p>
        <p className="mt-2 max-w-[260px] font-body text-sm leading-relaxed text-ash">
          Só um instante enquanto a Vello organiza seus dados.
        </p>
        <div className="mt-6 flex items-center gap-2" aria-label="Carregando">
          <i className="vello-loading-dot h-1.5 w-1.5 rounded-full bg-ink" />
          <i className="vello-loading-dot h-1.5 w-1.5 rounded-full bg-[#7EAFD0] [animation-delay:.16s]" />
          <i className="vello-loading-dot h-1.5 w-1.5 rounded-full bg-ink/35 [animation-delay:.32s]" />
        </div>
      </section>
    </main>
  );
}
