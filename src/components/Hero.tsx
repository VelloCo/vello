import { motion } from "framer-motion";
import { appPath } from "../lib/paths";

export function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-[108svh] overflow-hidden bg-ink pt-[154px] text-sm text-paper md:min-h-[112svh] md:pt-[172px]"
    >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[61svh] overflow-hidden md:h-[64svh]">
        <picture className="absolute bottom-[-6%] left-1/2 h-[66svh] w-full max-w-[1100px] -translate-x-1/2 opacity-75 grayscale md:bottom-0 md:h-[64svh]">
          <source
            media="(min-width: 768px)"
            srcSet={appPath("/hero-vello-house-desktop.png")}
          />
          <img
            src={appPath("/hero-vello-house.png")}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover object-[center_58%] md:object-contain md:object-bottom"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 78% 70% at 50% 53%, black 34%, transparent 79%)",
              maskImage:
                "radial-gradient(ellipse 78% 70% at 50% 53%, black 34%, transparent 79%)",
            }}
          />
        </picture>
        <div className="absolute inset-y-0 left-0 hidden w-[28%] bg-gradient-to-r from-ink via-ink/80 to-transparent md:block" />
        <div className="absolute inset-y-0 right-0 hidden w-[28%] bg-gradient-to-l from-ink via-ink/80 to-transparent md:block" />
        <div className="absolute inset-0 hidden bg-[radial-gradient(ellipse_52%_82%_at_50%_60%,transparent_22%,#0b0b0a_84%)] md:block" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink via-ink/5 to-ink" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 mx-auto flex max-w-[720px] flex-col items-center px-5 text-center"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-paper/55 md:text-[11px]">
          Feito para corretores imobiliários
        </p>
        <h1 className="mt-5 max-w-[720px] font-display text-[40px] font-semibold leading-[1.01] tracking-[-0.05em] text-paper sm:text-5xl md:text-7xl">
          Seu catálogo. Seu jeito de apresentar imóveis.
        </h1>
        <p className="mt-6 max-w-[510px] font-body text-[15px] leading-relaxed text-paper/60 md:text-[17px]">
          Organize seus imóveis, monte seleções para cada cliente e compartilhe uma experiência que faz sentido abrir.
        </p>
        <div className="mt-6 flex items-center justify-center gap-5">
          <a
            href={appPath("/cadastro")}
            className="rounded-full bg-paper px-6 py-3 font-body text-[14px] font-semibold text-ink transition hover:bg-white"
          >
            Criar meu catálogo
          </a>
          <button
            onClick={() =>
              document
                .querySelector("#produto")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="font-body text-[14px] font-medium text-paper/80 transition hover:text-paper"
          >
            Conhecer a Vello
          </button>
        </div>
      </motion.div>
    </section>
  );
}
