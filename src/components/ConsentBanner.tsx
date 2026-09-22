import { useState } from "react";
import { appPath } from "../lib/paths";
import { getConsent, setConsent, type Consent } from "../lib/analytics";

// Aviso de cookies de medição (LGPD). Aparece até o visitante escolher.
export function ConsentBanner() {
  const [open, setOpen] = useState(() => getConsent() === null);
  if (!open) return null;
  const choose = (value: Consent) => {
    setConsent(value);
    setOpen(false);
  };
  return (
    <div
      role="dialog"
      aria-label="Aviso de cookies"
      className="fixed inset-x-3 bottom-3 z-[90] mx-auto max-w-[560px] rounded-[20px] border border-line bg-white/95 p-4 shadow-[0_24px_60px_-30px_rgba(18,40,58,.55)] backdrop-blur sm:bottom-5 sm:p-5"
    >
      <p className="font-body text-[13px] leading-relaxed text-ash sm:text-sm">
        Usamos cookies de medição (Google Analytics) para entender como a Vello é usada e melhorar o
        produto. Você pode aceitar ou recusar.{" "}
        <a href={appPath("/privacidade")} className="font-semibold text-ink underline underline-offset-4">
          Saiba mais
        </a>
        .
      </p>
      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={() => choose("granted")}
          className="vello-primary h-10 rounded-full bg-sky px-5 font-body text-sm font-semibold text-ink"
        >
          Aceitar
        </button>
        <button
          type="button"
          onClick={() => choose("denied")}
          className="h-10 rounded-full border border-line px-5 font-body text-sm font-medium text-ink transition hover:border-ink"
        >
          Recusar
        </button>
      </div>
    </div>
  );
}
