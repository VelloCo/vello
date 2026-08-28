import { motion } from "framer-motion";
import { appPath } from "../lib/paths";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink pb-20 pt-[126px] text-sm text-paper md:min-h-[94svh] md:pt-[132px]"
    >
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
