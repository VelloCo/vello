import { appPath } from '../lib/paths';

interface LogoProps {
  variant?: 'dark' | 'light';
  className?: string;
}

export function Logo({ variant = 'dark', className = '' }: LogoProps) {
  const color = variant === 'dark' ? 'text-ink' : 'text-paper';
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <img
        src={appPath('/vello-logo.png')}
        alt=""
        aria-hidden="true"
        className={`h-14 w-14 object-contain ${variant === 'light' ? 'invert' : 'mix-blend-multiply'}`}
      />
      <span className={`font-display text-[22px] font-semibold tracking-[-0.02em] ${color}`}>
        Vello
      </span>
    </span>
  );
}
