export function GoogleAuthButton({ onClick, loading = false }: { onClick: () => void; loading?: boolean }) {
  return <button type="button" onClick={onClick} disabled={loading} className="vello-action flex h-12 w-full items-center justify-center gap-3 rounded-[12px] border border-line bg-white font-body text-[14px] font-medium text-ink hover:border-ink hover:bg-cream/45 disabled:cursor-wait disabled:opacity-60"><span className="grid h-5 w-5 place-items-center rounded-full bg-white font-semibold text-[14px]">G</span>{loading ? 'Conectando...' : 'Continuar com Google'}</button>;
}
