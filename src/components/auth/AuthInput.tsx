import type { InputHTMLAttributes } from 'react';

export function AuthInput({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return (
    <label className="block">
      <span className="mb-3 block font-body text-[13px] font-medium text-ink">{label}</span>
      <input {...props} aria-invalid={Boolean(error)} className={`vello-field h-12 w-full rounded-[12px] border bg-white px-4 font-body text-[14px] text-ink outline-none placeholder:text-stone/70 focus:border-ink focus:ring-4 focus:ring-ink/[0.06] ${error ? 'border-red-400' : 'border-line'}`} />
      {error && <span className="mt-1.5 block font-body text-[12px] text-red-600">{error}</span>}
    </label>
  );
}
