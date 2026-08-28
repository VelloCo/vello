import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';

export function PasswordInput({ label, error, confirmation: _confirmation, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; confirmation?: string }) {
  const [visible, setVisible] = useState(false);
  return <label className="block"><span className="mb-3 block font-body text-[13px] font-medium text-ink">{label}</span><span className="relative block"><input {...props} type={visible ? 'text' : 'password'} className={`h-12 w-full rounded-[10px] border bg-white px-4 pr-12 font-body text-[14px] text-ink outline-none transition placeholder:text-stone/70 focus:border-ink focus:ring-2 focus:ring-ink/10 ${error ? 'border-red-400' : 'border-line'}`} /><button type="button" onClick={() => setVisible((value) => !value)} aria-label={visible ? 'Esconder senha' : 'Mostrar senha'} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone transition hover:text-ink">{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{error && <span className="mt-1.5 block font-body text-[12px] text-red-600">{error}</span>}</label>;
}
