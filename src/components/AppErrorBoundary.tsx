import { Component, type ReactNode } from 'react';
import { appPath } from '../lib/paths';

export class AppErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return <main className="grid min-h-screen place-items-center bg-paper p-6 text-ink">
      <section className="w-full max-w-lg rounded-2xl border border-line bg-white p-8">
        <p className="font-display text-xl">Vello</p>
        <h1 className="mt-8 font-display text-3xl">Não conseguimos abrir esta tela.</h1>
        <p className="mt-4 font-body text-ash">Recarregue a página para tentar novamente. Se o problema continuar, entre em contato com o suporte.</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-6 min-h-12 w-full rounded-xl bg-ink px-4 text-paper">Tentar novamente</button>
        <a href={appPath('/suporte')} className="mt-3 flex min-h-12 items-center justify-center rounded-xl border border-line">Falar com suporte</a>
        <a href={appPath('/')} className="mt-5 block text-center underline">Voltar para o início</a>
      </section>
    </main>;
  }
}
