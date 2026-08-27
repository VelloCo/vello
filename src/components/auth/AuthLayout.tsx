import { Logo } from '../Logo';
import { motion } from 'framer-motion';
import { appPath } from '../../lib/paths';

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return <main className="relative min-h-screen overflow-hidden bg-paper"><section className="relative z-10 mx-auto flex min-h-screen max-w-[560px] flex-col px-5 py-7 pb-40 sm:px-10 lg:py-10 lg:pb-48"><motion.a href={appPath('/')} aria-label="Voltar para a Vello" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: 'easeOut' }}><Logo /></motion.a><motion.div className="mx-auto flex w-full max-w-[430px] flex-1 items-center py-12" initial={{ opacity: 0, y: 18, filter: 'blur(5px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.5, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}>{children}</motion.div></section><motion.div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-40 bg-ink sm:h-48" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.2 }}><svg className="absolute -top-1 left-0 h-32 w-full sm:h-40" viewBox="0 0 600 160" preserveAspectRatio="none" aria-hidden="true"><path className="auth-wave" d="M0 78 C90 12 170 20 255 66 C350 118 423 122 496 58 C540 20 570 18 600 38 V0 H0 Z" fill="#FAF9F6" /></svg></motion.div></main>;
}
