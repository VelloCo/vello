import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Building2, ChevronLeft, FolderHeart, Home, Palette } from "lucide-react";
import { useEffect, useState } from "react";
import { appPath } from "../../lib/paths";

const tips = [
  {
    icon: Home,
    eyebrow: "1 · início",
    title: "Seu resumo diário.",
    text: "Comece sempre por aqui.",
    focus: "Veja quantos imóveis estão disponíveis e o que mudou.",
    spotlightLabel: "Resumo do catálogo",
    href: "/dashboard",
    spotlight: { mobile: { top: "20px", left: "12px", right: "12px", height: "300px" }, desktop: { top: "32px", left: "268px", right: "40px", height: "260px" } },
  },
  {
    icon: Building2,
    eyebrow: "2 · imóveis",
    title: "Adicione um imóvel.",
    text: "É por aqui que um imóvel nasce.",
    focus: "Use “Novo imóvel” para incluir fotos, dados e publicar quando estiver pronto.",
    spotlightLabel: "Comece aqui",
    href: "/dashboard/imoveis",
    spotlight: { mobile: { top: "20px", left: "12px", right: "12px", height: "170px" }, desktop: { top: "32px", left: "268px", right: "40px", height: "150px" } },
  },
  {
    icon: Building2,
    eyebrow: "3 · imóveis",
    title: "Encontre rápido.",
    text: "Tudo fica organizado na mesma lista.",
    focus: "Busque por nome, bairro ou cidade e use os filtros quando sua carteira crescer.",
    spotlightLabel: "Busca e filtros",
    href: "/dashboard/imoveis",
    spotlight: { mobile: { top: "155px", left: "12px", right: "12px", height: "200px" }, desktop: { top: "145px", left: "268px", right: "40px", height: "185px" } },
  },
  {
    icon: FolderHeart,
    eyebrow: "4 · seleções",
    title: "Monte uma seleção.",
    text: "Um link para cada cliente.",
    focus: "Escolha os imóveis certos e organize a ordem em que eles serão vistos.",
    spotlightLabel: "Seleções para clientes",
    href: "/dashboard/selecoes",
    spotlight: { mobile: { top: "20px", left: "12px", right: "12px", height: "170px" }, desktop: { top: "32px", left: "268px", right: "40px", height: "150px" } },
  },
  {
    icon: Palette,
    eyebrow: "5 · catálogo",
    title: "Compartilhe seu catálogo.",
    text: "Seu espaço público está pronto.",
    focus: "Abra, copie o link ou mande pelo WhatsApp sempre que quiser.",
    spotlightLabel: "Seu catálogo público",
    href: "/dashboard/catalogo",
    spotlight: { mobile: { top: "20px", left: "12px", right: "12px", height: "270px" }, desktop: { top: "32px", left: "268px", right: "40px", height: "230px" } },
  },
  {
    icon: Palette,
    eyebrow: "6 · personalização",
    title: "Deixe com a sua cara.",
    text: "Cores e estilos sem complicação.",
    focus: "A prévia muda enquanto você escolhe — experimente à vontade.",
    spotlightLabel: "Prévia em tempo real",
    href: "/dashboard/personalizar",
    spotlight: { mobile: { top: "20px", left: "12px", right: "12px", height: "290px" }, desktop: { top: "32px", left: "268px", right: "40px", height: "250px" } },
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
  const spotlight = window.innerWidth < 1024 ? tip.spotlight.mobile : tip.spotlight.desktop;
  const spotlightBottom = `calc(${spotlight.top} + ${spotlight.height})`;

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
          className="fixed inset-0 z-[90] flex items-end justify-end p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="dashboard-tour-title"
        >
          <>
            <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
              <div className="absolute left-0 right-0 top-0 bg-ink/20 backdrop-blur-[2px]" style={{ height: spotlight.top }} />
              <div className="absolute bottom-0 left-0 right-0 bg-ink/20 backdrop-blur-[2px]" style={{ top: spotlightBottom }} />
              <div className="absolute left-0 bg-ink/20 backdrop-blur-[2px]" style={{ top: spotlight.top, bottom: `calc(100% - ${spotlightBottom})`, width: spotlight.left }} />
              <div className="absolute right-0 bg-ink/20 backdrop-blur-[2px]" style={{ top: spotlight.top, bottom: `calc(100% - ${spotlightBottom})`, width: spotlight.right }} />
              <div className="absolute rounded-[22px] border-2 border-white/90 bg-white/[.025] shadow-[0_0_0_4px_rgba(11,11,10,.12),0_12px_30px_rgba(255,255,255,.1)]" style={{ top: spotlight.top, left: spotlight.left, right: spotlight.right, height: spotlight.height }}>
                <span className="absolute -top-3 left-4 rounded-full bg-white px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.12em] text-ink shadow-sm">{tip.spotlightLabel}</span>
              </div>
            </div>
            <motion.div
            className="relative z-10 w-full max-w-[312px] overflow-hidden rounded-[22px] border border-white/15 bg-[#141412] text-paper shadow-[0_20px_60px_rgba(0,0,0,.3)]"
            initial={{ opacity: 0, y: 28, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 330, damping: 30 }}
          >
            <div className="relative min-h-20 overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_72%_12%,rgba(255,255,255,.16),transparent_34%),linear-gradient(135deg,#252520,#0c0c0b)] px-4 pt-3">
              <button onClick={close} className="relative z-10 font-body text-sm text-paper/65 transition hover:text-paper">
                Pular dicas
              </button>
              <img
                src={appPath("/vello-mascot.png")}
                alt="Mascote da Vello"
                className="absolute -bottom-9 right-4 h-24 w-24 object-contain object-top"
              />
            </div>
            <div className="p-4">
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
                  transition={{ duration: 0.28 }}
                >
                  <p className="mt-4 font-mono text-[8px] uppercase tracking-[.16em] text-paper/55">{tip.eyebrow}</p>
                  <h2 id="dashboard-tour-title" className="mt-2 font-display text-[21px] font-semibold leading-[1.04] tracking-[-.04em]">{tip.title}</h2>
                  <p className="mt-2 max-w-sm font-body text-xs leading-relaxed text-paper/65">{tip.text}</p>
                  <div className="mt-3 border-l border-paper/35 pl-2.5">
                    <p className="font-mono text-[9px] uppercase tracking-[.16em] text-paper/45">Onde olhar</p>
                    <p className="mt-1 font-body text-[11px] leading-relaxed text-paper/80">{tip.focus}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="flex gap-1.5" aria-label={`Etapa ${step + 1} de ${tips.length}`}>
                  {tips.map((_, index) => <span key={index} className={`h-1.5 rounded-full transition-all ${index === step ? "w-6 bg-paper" : "w-1.5 bg-paper/25"}`} />)}
                </div>
                <div className="flex items-center gap-2">
                  {step > 0 && <button onClick={() => goToStep(step - 1)} aria-label="Dica anterior" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-paper transition hover:bg-white/10"><ChevronLeft size={16} /></button>}
                  <button onClick={() => step === tips.length - 1 ? close() : goToStep(step + 1)} className="inline-flex h-9 items-center gap-1.5 rounded-full bg-paper px-3.5 font-body text-xs font-semibold text-ink transition hover:scale-[1.02]">
                    {step === tips.length - 1 ? "Concluir" : "Mostrar próxima"} <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </div>
            </motion.div>
          </>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
