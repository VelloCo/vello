import { Logo } from './Logo';
import { Container } from './Primitives';
import { appPath } from '../lib/paths';

const LINKS = [
  { label: 'Produto', href: '#produto' },
  { label: 'A diferença', href: '#antes-depois' },
  { label: 'Preços', href: '#precos' },
  { label: 'Entrar', href: appPath('/login') },
];

const SOCIAL = [
  { label: 'Contato', href: 'mailto:vellocorretores@gmail.com' },
  { label: 'Instagram', href: '#' },
  { label: 'Termos', href: appPath('/termos') },
  { label: 'Privacidade', href: appPath('/privacidade') },
];

export function Footer() {
  const scrollTo = (href: string) => {
    if (href.startsWith('#')) {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="border-t border-line/70 py-10">
      <Container className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo />

        <nav className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={(e) => {
                if (l.href.startsWith('#')) {
                  e.preventDefault();
                  scrollTo(l.href);
                }
              }}
              className="font-body text-[13.5px] text-ash hover:text-ink transition-colors"
            >
              {l.label}
            </a>
          ))}
          {SOCIAL.map((l) => (
            <a key={l.label} href={l.href} className="font-body text-[13.5px] text-ash hover:text-ink transition-colors">
              {l.label}
            </a>
          ))}
        </nav>

        <p className="font-mono text-[11px] text-stone">© {new Date().getFullYear()} Vello</p>
      </Container>
    </footer>
  );
}
