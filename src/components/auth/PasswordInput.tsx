import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import type { InputHTMLAttributes } from 'react';

type PasswordProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; confirmation?: string };

export function PasswordInput({ label, error, confirmation, value, ...props }: PasswordProps) {
  const [visible, setVisible] = useState(false);
  const password = String(value ?? '');
  const comparing = confirmation !== undefined && confirmation.length > 0 && password.length > 0;
  const matches = comparing && confirmation === password;
  return <label className="block"><span className="mb-2 block font-body text-[13px] font-medium text-ink">{label}</span><span className="relative block"><input {...props} value={value} type={visible || comparing ? 'text' : 'password'} className={`h-12 w-full rounded-[10px] border bg-white px-4 pr-12 font-body text-[14px] text-ink outline-none transition placeholder:text-stone/70 focus:border-ink focus:ring-2 focus:ring-ink/10 ${comparing && !visible ? 'text-transparent caret-ink' : ''} ${error ? 'border-red-400' : matches ? 'border-emerald-500' : 'border-line'}`} />{comparing && !visible && <motion.span className="pointer-events-none absolute inset-y-0 left-4 flex items-center gap-1" animate={{ scale: matches ? [1, 1.04, 1] : 1 }} transition={{ duration: 0.25 }}>{password.split('').map((letter, index) => <span key={`${letter}-${index}`} className={`h-2 w-2 rounded-full transition-colors ${confirmation[index] ? confirmation[index] === letter ? 'bg-emerald-500' : 'bg-red-400' : 'bg-ink'}`} />)}</motion.span>}<button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? 'Esconder senha' : 'Mostrar senha'} className="absolute right-3 top-1/2 -translate-y-1/2 text-stone transition hover:text-ink">{visible ? <EyeOff size={17} /> : <Eye size={17} />}</button></span>{matches && <span className="mt-1.5 block font-body text-[12px] text-emerald-700">Senhas iguais</span>}{error && <span className="mt-1.5 block font-body text-[12px] text-red-600">{error}</span>}</label>;
}
