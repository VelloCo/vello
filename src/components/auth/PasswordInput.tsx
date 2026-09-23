import { Eye, EyeOff } from 'lucide-react';
import { useId, useState } from 'react';
import type { InputHTMLAttributes } from 'react';

export function PasswordInput({ label, error, confirmation: _confirmation, id, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; confirmation?: string }) {
  const [visible, setVisible] = useState(false);
  const generated = useId();
  // O botão fica fora do <label> para não entrar no nome do campo nem
  // roubar o clique da etiqueta.
  const fieldId = id || generated;
  return (
    <div className="block">
      <label htmlFor={fieldId} className="mb-3 block font-body text-[13px] font-medium text-ink">{label}</label>
      <span className="relative block">
        <input
          {...props}
          id={fieldId}
          aria-invalid={Boolean(error)}
          type={visible ? 'text' : 'password'}
          className={`vello-field h-12 w-full rounded-[12px] border bg-white px-4 pr-12 font-body text-[14px] text-ink outline-none placeholder:text-stone/70 focus:border-ink focus:ring-4 focus:ring-ink/[0.06] ${error ? 'border-red-400' : 'border-line'}`}
        />
        <button
          type="button"
          onClick={() => setVisible((value) => !value)}
          aria-label={visible ? 'Esconder senha' : 'Mostrar senha'}
          aria-controls={fieldId}
          className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-[8px] text-stone hover:bg-cream hover:text-ink"
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </span>
      {error && <span className="mt-1.5 block font-body text-[12px] text-red-600">{error}</span>}
    </div>
  );
}
