import { AlertCircle, LoaderCircle, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { AuthLayout } from './AuthLayout';
import { AuthInput } from './AuthInput';
import { PasswordInput } from './PasswordInput';
import { login } from '../../lib/auth';
import { appPath } from '../../lib/paths';
import { requireSupabase } from '../../lib/supabase';
import { mensagemDaFuncao } from '../../lib/functionError';

type Convite = { email: string; name: string; expires_at: string };

function Shell({ children }: { children: React.ReactNode }) {
  return <AuthLayout><div className="w-full">{children}</div></AuthLayout>;
}

function Aviso({ text }: { text: string }) {
  return <div role="alert" className="mb-5 flex items-start gap-2.5 rounded-[12px] border border-red-200 bg-red-50 px-3.5 py-3 text-[13px] text-red-700"><AlertCircle size={16} className="mt-0.5 shrink-0" />{text}</div>;
}

const prazo = (iso: string) => {
  const horas = Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 3600_000));
  if (horas >= 24) return `Válido por mais ${Math.round(horas / 24)} ${Math.round(horas / 24) === 1 ? 'dia' : 'dias'}.`;
  return horas <= 1 ? 'Vale por pouco tempo ainda.' : `Válido por mais ${horas} horas.`;
};

export function AcceptInvitePage({ token }: { token: string }) {
  const [convite, setConvite] = useState<Convite | null | undefined>(undefined);
  const [erroConvite, setErroConvite] = useState('');
  const [nome, setNome] = useState('');
  const [senha, setSenha] = useState('');
  const [confirma, setConfirma] = useState('');
  const [aceite, setAceite] = useState(false);
  const [erro, setErro] = useState('');
  const [salvando, setSalvando] = useState(false);

  // Só confere o convite; não consome.
  useEffect(() => {
    let ativo = true;
    void (async () => {
      try {
        const { data, error } = await requireSupabase().functions.invoke('accept-invite', { body: { token, check: true } });
        if (!ativo) return;
        if (error || !data?.email) throw error ?? new Error('convite');
        setConvite(data as Convite);
        setNome((data as Convite).name || '');
      } catch (causa) {
        const texto = await mensagemDaFuncao(causa, 'Convite não encontrado. Confira se o link veio completo.');
        if (!ativo) return;
        setErroConvite(texto);
        setConvite(null);
      }
    })();
    return () => { ativo = false; };
  }, [token]);

  const enviar = async (event: FormEvent) => {
    event.preventDefault();
    setErro('');
    if (senha.length < 8 || !/[A-Za-z]/.test(senha) || !/\d/.test(senha)) {
      setErro('A senha precisa ter no mínimo 8 caracteres, uma letra e um número.');
      return;
    }
    if (senha !== confirma) { setErro('As senhas não coincidem.'); return; }
    if (!aceite) { setErro('Aceite os termos para continuar.'); return; }
    setSalvando(true);
    try {
      const { data, error } = await requireSupabase().functions.invoke('accept-invite', {
        body: { token, password: senha, name: nome },
      });
      if (error || !data?.email) throw error ?? new Error('convite');
      await login(String(data.email), senha);
      window.location.href = appPath('/onboarding');
    } catch (causa) {
      setErro(await mensagemDaFuncao(causa, 'Não foi possível concluir o convite. Tente novamente.'));
      setSalvando(false);
    }
  };

  if (convite === undefined) {
    return <Shell><p className="flex items-center gap-2 font-body text-[15px] text-ash"><LoaderCircle size={16} className="animate-spin" /> Abrindo seu convite...</p></Shell>;
  }

  if (!convite) {
    return <Shell>
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper"><AlertCircle size={22} /></div>
      <h1 className="font-display text-[34px] font-semibold leading-[1.04] tracking-[-0.035em] text-ink">Convite indisponível.</h1>
      <p className="mt-4 font-body text-[15px] leading-relaxed text-ash">{erroConvite}</p>
      <a href={appPath('/login')} className="vello-primary bg-sky text-ink mt-7 flex h-12 w-full items-center justify-center rounded-full font-body text-[14px] font-semibold">Ir para o login</a>
    </Shell>;
  }

  return <Shell>
    <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-ink text-paper"><ShieldCheck size={22} /></div>
    <h1 className="font-display text-[34px] font-semibold leading-[1.04] tracking-[-0.035em] text-ink">Seu convite chegou.</h1>
    <p className="mt-4 font-body text-[15px] leading-relaxed text-ash">
      Crie sua senha para entrar na Vello com o e-mail <b className="text-ink">{convite.email}</b>. {prazo(convite.expires_at)}
    </p>
    {erro && <div className="mt-6"><Aviso text={erro} /></div>}
    <form onSubmit={enviar} className="mt-6 space-y-4">
      <AuthInput label="Seu nome" value={nome} onChange={(event) => setNome(event.target.value)} placeholder="Como quer ser chamada" autoComplete="name" maxLength={120} required />
      <PasswordInput label="Senha" value={senha} onChange={(event) => setSenha(event.target.value)} placeholder="Crie uma senha segura" autoComplete="new-password" required />
      <PasswordInput label="Confirmar senha" value={confirma} onChange={(event) => setConfirma(event.target.value)} placeholder="Repita sua senha" autoComplete="new-password" required />
      <div className="flex items-start gap-2 pt-1">
        <input id="termos" type="checkbox" checked={aceite} onChange={(event) => setAceite(event.target.checked)} className="mt-0.5 h-4 w-4 accent-ink" />
        <label htmlFor="termos" className="font-body text-[12px] leading-relaxed text-ash">
          Li e aceito os <a href={appPath('/termos')} className="text-ink underline">Termos de Uso</a> e a <a href={appPath('/privacidade')} className="text-ink underline">Política de Privacidade</a>.
        </label>
      </div>
      <button disabled={salvando} aria-busy={salvando} className="vello-primary bg-sky text-ink vello-action flex h-12 w-full items-center justify-center gap-2 rounded-full font-body text-[14px] font-semibold disabled:cursor-wait disabled:opacity-70">
        {salvando && <LoaderCircle size={16} className="animate-spin" />}
        {salvando ? 'Criando sua conta...' : 'Aceitar convite'}
      </button>
    </form>
  </Shell>;
}
