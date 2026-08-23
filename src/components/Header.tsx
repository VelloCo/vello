import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';
import { Container } from './Primitives';
import { appPath } from '../lib/paths';

const NAV = [
  { label: 'Produto', href: '#produto' },
  { label: 'Como funciona', href: '#como-funciona' },
  { label: 'Preços', href: '#precos' },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight - 96);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-paper/80 backdrop-blur-md border-b border-line/60' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <Container className="flex h-[72px] items-center justify-between">
        <a href="#top" className="flex items-center" onClick={(e) => { e.preventDefault(); scrollTo('#top'); }}>
          <Logo variant={scrolled ? 'dark' : 'light'} />
        </a>

        <nav className="hidden md:flex items-center gap-9">
          {NAV.map((n) => (
            <button
              key={n.href}
              onClick={() => scrollTo(n.href)}
              className={`font-body text-[14.5px] transition-colors ${scrolled ? 'text-ash hover:text-ink' : 'text-paper/70 hover:text-paper'}`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-5">
          <a href={appPath('/login')} className={`font-body text-[14.5px] transition-colors ${scrolled ? 'text-ink/80 hover:text-ink' : 'text-paper/80 hover:text-paper'}`}>
            Entrar
          </a>
          <a
            href={appPath('/cadastro')}
            className={`rounded-full px-5 py-2.5 font-body text-[14px] font-medium transition-transform hover:scale-[1.03] active:scale-[0.98] ${scrolled ? 'bg-ink text-paper' : 'bg-paper text-ink'}`}
          >
            Criar meu catálogo
          </a>
        </div>

        <button
          className={`md:hidden flex h-10 w-10 items-center justify-center ${scrolled ? 'text-ink' : 'text-paper'}`}
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto border-t border-line/60 bg-paper px-6 py-8 md:hidden">
          <div className="flex min-h-full flex-col gap-6">
            {NAV.map((n) => (
              <button
                key={n.href}
                onClick={() => scrollTo(n.href)}
                className="text-left font-display text-[17px] text-ink"
              >
                {n.label}
              </button>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              <a href={appPath('/login')} className="font-body text-[15px] text-ash">Entrar</a>
              <a
                href={appPath('/cadastro')}
                className="rounded-full bg-ink px-5 py-3 text-center font-body text-[15px] font-medium text-paper"
              >
                Criar meu catálogo
              </a>
            </div>
          </div>
        </div>
      )}

    </header>
    {!open && <a href={appPath('/cadastro')} className="fixed bottom-3 left-1/2 z-40 flex h-14 w-[calc(100%-2.5rem)] max-w-sm -translate-x-1/2 items-center justify-center rounded-full border border-ink/15 bg-white px-5 font-body text-[15px] font-semibold text-ink shadow-[0_12px_30px_rgba(11,11,10,0.18)] transition-transform active:scale-[0.98] md:hidden">Criar meu catálogo</a>}
    </>
  );
}
