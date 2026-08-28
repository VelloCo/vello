import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, ChevronLeft, FolderHeart, Home, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { appPath } from "../../lib/paths";

const tips = [
  {
    icon: Home,
    eyebrow: "Primeira parada · início",
    title: "Veja o que pede sua atenção.",
    text: "Aqui você acompanha seus imóveis e encontra os atalhos que mais vai usar no dia a dia.",
    href: "/dashboard",
  },
  {
    icon: Building2,
    eyebrow: "Segunda parada · imóveis",
    title: "Cadastre e organize seus imóveis.",
    text: "Fotos, detalhes, preço e status ficam em um só lugar — e entram no catálogo quando você publicar.",
    href: "/dashboard/imoveis",
  },
  {
    icon: FolderHeart,
    eyebrow: "Terceira parada · seleções",
    title: "Envie opções certas para cada cliente.",
    text: "Monte uma seleção, organize a ordem dos imóveis e compartilhe tudo em um único link.",
    href: "/dashboard/selecoes",
  },
  {
    icon: Palette,
    eyebrow: "Última parada · catálogo",
    title: "Deixe a apresentação com a sua cara.",
    text: "Escolha cores e estilos para que o seu catálogo fique profissional, memorável e pronto para compartilhar.",
    href: "/dashboard/personalizar",
  },
] as const;

export function DashboardTour({ userId, preview = false, currentRoute }: { userId: string; preview?: boolean; currentRoute: string }) {
  const storageKey = `vello-dashboard-tour-${userId}`;
  const [open, setOpen] = useState(() => preview || localStorage.getItem(storageKey) !== "done");
  const [step] = useState(() => {
    const requestedStep = Number(new URLSearchParams(window.location.search).get("tourStep"));
    return preview && Number.isInteger(requestedStep) && requestedStep >= 0 && requestedStep < tips.length ? requestedStep : 0;
  });
  const tip = tips[step];
  const Icon = tip.icon;

  const close = () => {
    localStorage.setItem(storageKey, "done");
    setOpen(false);
    if (preview) window.history.replaceState({}, "", appPath(currentRoute));
  };
  const goToStep = (nextStep: number) => {
    window.location.href = `${appPath(tips[nextStep].href)}?tutorial=1&tourStep=${nextStep}`;
  };

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        localStorage.setItem(storageKey, "done");
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [storageKey]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[90] flex items-end justify-center bg-ink/50 p-3 backdrop-blur-[3px] sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dashboard-tour-title"
        >
          <motion.div
            className="w-full max-w-md overflow-hidden rounded-[30px] border border-white/15 bg-[#141412] text-paper shadow-[0_28px_90px_rgba(0,0,0,.35)]"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 330, damping: 30 }}
          >
            <div className="relative min-h-32 overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_72%_12%,rgba(255,255,255,.16),transparent_34%),linear-gradient(135deg,#252520,#0c0c0b)] px-6 pt-5">
              <button onClick={close} className="relative z-10 font-body text-sm text-paper/65 transition hover:text-paper">
                Pular dicas
              </button>
              <img
                src={appPath("/vello-mascot.png")}
                alt="Mascote da Vello"
                className="absolute -bottom-14 right-5 h-48 w-48 object-contain object-top"
              />
            </div>
            <div className="p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-ink">
                  <Icon size={19} strokeWidth={1.8} />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-[.16em] text-paper/50">
                  {step + 1} de {tips.length}
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.18 }}
                >
                  <p className="mt-7 font-mono text-[10px] uppercase tracking-[.16em] text-paper/55">{tip.eyebrow}</p>
                  <h2 id="dashboard-tour-title" className="mt-3 font-display text-[29px] font-semibold leading-[1.04] tracking-[-.04em] sm:text-[33px]">{tip.title}</h2>
                  <p className="mt-4 max-w-sm font-body text-[15px] leading-relaxed text-paper/65">{tip.text}</p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-8 flex items-center justify-between gap-4">
                <div className="flex gap-1.5" aria-label={`Etapa ${step + 1} de ${tips.length}`}>
                  {tips.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${index === step ? "w-6 bg-paper" : "w-1.5 bg-paper/25"}`} />)}
                </div>
                <div className="flex items-center gap-2">
                  {step > 0 && <button onClick={() => goToStep(step - 1)} aria-label="Dica anterior" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-paper transition hover:bg-white/10"><ChevronLeft size={17} /></button>}
                  <button onClick={() => step === tips.length - 1 ? close() : goToStep(step + 1)} className="inline-flex h-10 items-center gap-2 rounded-full bg-paper px-4 font-body text-sm font-semibold text-ink transition hover:scale-[1.02]">
                    {step === tips.length - 1 ? "Concluir" : "Mostrar próxima"} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
