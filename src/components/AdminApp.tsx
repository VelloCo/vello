import { AlertTriangle, ArrowLeft, CalendarDays, CheckCircle2, ChevronRight, Clipboard, ExternalLink, LayoutDashboard, LoaderCircle, LogOut, RefreshCw, Search, Sparkles, UserPlus, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { appPath } from "../lib/paths";
import { requireSupabase } from "../lib/supabase";
import { mensagemDaFuncao } from "../lib/functionError";
import { Logo } from "./Logo";

type DashboardData = {
  metrics: { users: number; onboarded_users: number; new_users_7d: number; services?: number; published_services?: number; appointments_30d?: number; online_appointments_30d?: number };
  users: Array<{ id: string; name: string; slug: string | null; city: string | null; state: string | null; onboarding_completed: boolean; created_at: string }>;
  services?: Array<{ id: string; title: string; category: string; publication_status: string; owner: string; created_at: string }>;
  appointments?: Array<{ id: string; service_title: string; status: string; source: string; owner: string; starts_at: string; created_at: string }>;
};

const appointmentStatus: Record<string, string> = { pending: "Pendente", confirmed: "Confirmado", completed: "Concluído", cancelled: "Cancelado", no_show: "Faltou" };

type Invite = { id: string; email: string; name: string; created_at: string; expires_at: string; used_at: string | null; revoked_at: string | null; status: "pendente" | "aceito" | "expirado" | "cancelado" };

const inviteTone: Record<string, string> = {
  pendente: "bg-[#FFF1D6] text-[#8C5A11]",
  aceito: "bg-[#E8F6ED] text-[#276541]",
  expirado: "bg-cream text-stone",
  cancelado: "bg-cream text-stone",
};

const date = (value: string) => new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(value));

export function AdminApp() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [state, setState] = useState<"loading" | "ready" | "setup" | "denied" | "error">("loading");
  const [query, setQuery] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteLink, setInviteLink] = useState("");
  const [inviteState, setInviteState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [inviteError, setInviteError] = useState("");
  const [inviteHours, setInviteHours] = useState("48");
  const [inviteExpires, setInviteExpires] = useState("");
  const [invites, setInvites] = useState<Invite[]>([]);
  const [inviteReset, setInviteReset] = useState(false);
  const [contaExistente, setContaExistente] = useState(false);

  const refresh = async () => {
    setState("loading");
    try {
      const { data, error } = await requireSupabase().rpc("get_admin_dashboard");
      if (error) throw error;
      setData(data as DashboardData);
      setState("ready");
    } catch (error) {
      const message = String(error).toLowerCase();
      setState(message.includes("get_admin_dashboard") || message.includes("schema cache") || message.includes("function") ? "setup" : message.includes("admin access") ? "denied" : "error");
    }
  };

  const createInvite = async (event: FormEvent, allowExisting = false) => {
    event.preventDefault();
    setContaExistente(false);
    setInviteState("loading");
    setInviteError("");
    setInviteLink("");
    try {
      const { data, error } = await requireSupabase().functions.invoke("create-invite", { body: { email: inviteEmail, name: inviteName, hours: Number(inviteHours) || 48, allowExisting } });
      if (error || !data?.invite_link) throw error ?? new Error("Convite não gerado");
      setInviteEmail(String(data.email ?? inviteEmail));
      setInviteLink(String(data.invite_link));
      setInviteExpires(String(data.expires_at ?? ""));
      setInviteReset(Boolean(data.reset));
      void loadInvites();
      setInviteState("ready");
    } catch (causa) {
      const texto = await mensagemDaFuncao(causa, "Não foi possível gerar o convite. Confira o e-mail e tente de novo.");
      setInviteError(texto);
      setContaExistente(texto.includes("já tem conta"));
      setInviteState("error");
    }
  };

  const loadInvites = async () => {
    try {
      const { data, error } = await requireSupabase().rpc("list_beta_invites");
      if (error) throw error;
      setInvites((data ?? []) as Invite[]);
    } catch {
      setInvites([]);
    }
  };
  const revokeInvite = async (id: string) => {
    try {
      await requireSupabase().rpc("revoke_beta_invite", { p_id: id });
    } finally {
      void loadInvites();
    }
  };

  useEffect(() => { refresh(); void loadInvites(); }, []);
  const filteredUsers = useMemo(() => data?.users.filter(user => `${user.name} ${user.city ?? ""} ${user.state ?? ""}`.toLowerCase().includes(query.toLowerCase())) ?? [], [data, query]);
  if (state === "loading") return <Loading />;
  if (state !== "ready" || !data) return <AccessState state={state} />;

  const activation = data.metrics.users ? Math.round((data.metrics.onboarded_users / data.metrics.users) * 100) : 0;
  return <main className="min-h-screen bg-[#F4F8FB] text-ink">
    <aside className="fixed inset-y-0 left-0 hidden w-[248px] flex-col border-r border-line bg-white px-5 py-6 lg:flex"><a href={appPath("/")} className="px-2"><Logo className="origin-left scale-[.82]" /></a><div className="mt-12"><p className="px-3 font-mono text-[10px] uppercase tracking-[.14em] text-stone">Workspace</p><nav className="mt-3 space-y-1"><NavItem active icon={<LayoutDashboard size={17} />} label="Visão geral" /><NavItem icon={<Users size={17} />} label="Profissionais" count={data.metrics.users} /><NavItem icon={<Sparkles size={17} />} label="Serviços" count={data.metrics.services ?? 0} /><NavItem icon={<CalendarDays size={17} />} label="Agendamentos" count={data.metrics.appointments_30d ?? 0} /></nav></div><div className="mt-auto border-t border-line pt-5"><a href={appPath("/")} className="flex items-center gap-3 rounded-xl px-3 py-3 font-body text-[13px] font-medium text-ash transition hover:bg-paper hover:text-ink"><ArrowLeft size={16} />Voltar para a Vello</a><div className="mt-3 flex items-center gap-3 rounded-xl bg-paper p-3"><span className="grid h-8 w-8 place-items-center rounded-full bg-ink text-[12px] font-semibold text-paper">V</span><div className="min-w-0"><p className="truncate font-body text-[12px] font-semibold">Administrador</p><p className="font-mono text-[9px] uppercase tracking-[.08em] text-stone">Acesso total</p></div><LogOut size={14} className="ml-auto text-stone" /></div></div></aside>
    <div className="lg:pl-[248px]"><header className="sticky top-0 z-10 border-b border-line bg-[#F4F8FB]/90 backdrop-blur-xl"><div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-5 sm:px-8"><a href={appPath("/")} className="lg:hidden"><Logo className="origin-left scale-[.76]" /></a><div className="hidden items-center gap-2 font-body text-[12px] text-stone lg:flex"><span>Vello</span><ChevronRight size={13} /><span className="text-ink">Administração</span></div><div className="ml-auto flex items-center gap-2"><span className="hidden rounded-full border border-line bg-white px-3 py-2 font-mono text-[9px] uppercase tracking-[.12em] text-stone sm:inline">Produção</span><button onClick={refresh} aria-label="Atualizar painel" className="inline-flex h-9 items-center gap-2 rounded-[10px] border border-line bg-white px-3 font-body text-[12px] font-semibold transition hover:border-ink"><RefreshCw size={14} /><span className="hidden sm:inline">Atualizar</span></button></div></div></header>
      <div className="mx-auto max-w-[1280px] px-5 py-8 sm:px-8 lg:py-11"><div className="flex flex-wrap items-end justify-between gap-6"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Visão geral</p><h1 className="mt-3 font-display text-[clamp(36px,4vw,54px)] font-semibold leading-none tracking-[-.065em]">Bom dia, administrador.</h1><p className="mt-4 max-w-[580px] font-body text-[15px] leading-relaxed text-ash">Acompanhe o crescimento da Vello e veja como as primeiras estéticas estão usando o produto.</p></div><div className="flex w-full items-center gap-2 sm:w-auto"><div className="relative flex-1 sm:w-[220px]"><Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar profissional" className="h-10 w-full rounded-[10px] border border-line bg-white pl-9 pr-3 font-body text-[12px] outline-none placeholder:text-stone focus:border-ink" /></div></div></div>
        <section className="mt-9 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Metric icon={<Users size={17} />} label="Profissionais" value={data.metrics.users} detail={`+${data.metrics.new_users_7d} nos últimos 7 dias`} tone="dark" /><Metric icon={<CheckCircle2 size={17} />} label="Ativação" value={`${activation}%`} detail={`${data.metrics.onboarded_users} perfis concluídos`} progress={activation} /><Metric icon={<Sparkles size={17} />} label="Serviços publicados" value={data.metrics.published_services ?? 0} detail={`${data.metrics.services ?? 0} serviços no total`} /><Metric icon={<CalendarDays size={17} />} label="Agendamentos em 30 dias" value={data.metrics.appointments_30d ?? 0} detail={`${data.metrics.online_appointments_30d ?? 0} feitos pela página pública`} /></section>
        <InvitePanel name={inviteName} email={inviteEmail} link={inviteLink} state={inviteState} error={inviteError} hours={inviteHours} expires={inviteExpires} reset={inviteReset} existing={contaExistente} onName={setInviteName} onEmail={setInviteEmail} onHours={setInviteHours} onSubmit={createInvite} />
        <InviteList invites={invites} onRevoke={revokeInvite} />
        <section className="mt-8 grid gap-6 xl:grid-cols-[1.08fr_.92fr]"><Panel title="Novas profissionais" subtitle="Os cadastros mais recentes" action={`${filteredUsers.length} no total`}><div className="mb-2 hidden grid-cols-[1fr_auto] px-1 font-mono text-[9px] uppercase tracking-[.12em] text-stone sm:grid"><span>Perfil</span><span>Status</span></div>{filteredUsers.length ? filteredUsers.slice(0, 6).map(user => <div key={user.id} className="flex items-center justify-between gap-4 border-t border-line py-4"><div className="flex min-w-0 items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[#E6EFF6] font-body text-[12px] font-semibold">{user.name.slice(0, 1).toUpperCase()}</span><div className="min-w-0"><p className="truncate font-body text-[13px] font-semibold">{user.name}</p><p className="mt-1 truncate font-body text-[11px] text-ash">{[user.city, user.state].filter(Boolean).join(" · ") || "Localização não informada"}</p></div></div><div className="shrink-0 text-right"><span className={`inline-flex rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.08em] ${user.onboarding_completed ? "bg-ink text-paper" : "bg-cream text-ash"}`}>{user.onboarding_completed ? "Ativo" : "Onboarding"}</span><p className="mt-1 font-mono text-[9px] text-stone">{date(user.created_at)}</p></div></div>) : <Empty text={query ? "Nenhuma profissional encontrada." : "Nenhuma profissional cadastrada ainda."} />}</Panel><Panel title="Últimos serviços" subtitle="Criados recentemente">{(data.services ?? []).length ? (data.services ?? []).slice(0, 5).map(service => <div key={service.id} className="flex items-center justify-between gap-4 border-t border-line py-4"><div className="flex min-w-0 items-center gap-3"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-[10px] bg-[#E6EFF6]"><Sparkles size={16} className="text-ash" /></span><div className="min-w-0"><p className="truncate font-body text-[13px] font-semibold">{service.title}</p><p className="mt-1 truncate font-body text-[11px] text-ash">por {service.owner}</p></div></div><div className="shrink-0 text-right"><span className={`inline-flex rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.08em] ${service.publication_status === "published" ? "bg-ink text-paper" : "bg-cream text-ash"}`}>{service.publication_status === "published" ? "Publicado" : "Rascunho"}</span><p className="mt-1 font-mono text-[9px] text-stone">{date(service.created_at)}</p></div></div>) : <Empty text="Nenhum serviço criado ainda." />}</Panel></section>
        <section className="mt-6 grid gap-6 lg:grid-cols-[1fr_1fr]"><Panel title="Últimos agendamentos" subtitle="Sem dados das clientes" action={`${data.metrics.appointments_30d ?? 0} em 30 dias`}>{(data.appointments ?? []).length ? <div className="grid gap-x-7 md:grid-cols-2">{(data.appointments ?? []).slice(0, 6).map(appointment => <div key={appointment.id} className="flex items-center justify-between gap-3 border-t border-line py-4"><div className="min-w-0"><p className="truncate font-body text-[13px] font-semibold">{appointment.service_title}</p><p className="mt-1 truncate font-body text-[11px] text-ash">{appointment.owner} · {date(appointment.starts_at)}</p></div><span className="rounded-full bg-cream px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.08em] text-ash">{appointmentStatus[appointment.status] ?? appointment.status}</span></div>)}</div> : <Empty text="Nenhum agendamento ainda." />}</Panel><section className="rounded-[18px] border border-line bg-ink p-6 text-paper sm:p-7"><div className="flex items-start justify-between gap-4"><span className="grid h-10 w-10 place-items-center rounded-[12px] bg-white/10"><AlertTriangle size={18} /></span><span className="font-mono text-[9px] uppercase tracking-[.12em] text-white/50">Próximo passo</span></div><h2 className="mt-8 font-display text-[25px] font-semibold leading-tight tracking-[-.04em]">Prepare a Vello para os primeiros usuários.</h2><p className="mt-3 max-w-[430px] font-body text-[13px] leading-relaxed text-white/65">Valide um cadastro, um serviço publicado e um agendamento pela página pública antes de convidar novas estéticas.</p><a href={appPath("/dashboard")} className="mt-6 inline-flex h-10 items-center gap-2 rounded-[10px] bg-white px-4 font-body text-[12px] font-semibold text-ink">Abrir meu painel <ChevronRight size={14} /></a></section></section>
      </div></div>
  </main>;
}

function InvitePanel({ name, email, link, state, error, hours, expires, reset, existing, onName, onEmail, onHours, onSubmit }: { name: string; email: string; link: string; state: "idle" | "loading" | "ready" | "error"; error: string; hours: string; expires: string; reset: boolean; existing: boolean; onName: (value: string) => void; onEmail: (value: string) => void; onHours: (value: string) => void; onSubmit: (event: FormEvent, allowExisting?: boolean) => void }) {
  const validade = expires ? new Date(expires).toLocaleString("pt-BR", { day: "2-digit", month: "long", hour: "2-digit", minute: "2-digit" }) : "";
  const message = link ? `Oi${name ? `, ${name}` : ""}! Separei um convite para você testar a Vello. Abra o link, escolha sua senha e monte sua página: ${link}${validade ? `\n\nO convite vale até ${validade}.` : ""}` : "";
  const whatsapp = `https://wa.me/?text=${encodeURIComponent(message)}`;
  return <section className="mt-6 overflow-hidden rounded-[18px] border border-ink bg-white">
    <div className="grid lg:grid-cols-[.8fr_1.2fr]">
      <div className="bg-ink p-6 text-paper sm:p-7"><span className="grid h-10 w-10 place-items-center rounded-[12px] bg-white/10"><UserPlus size={18} /></span><p className="mt-7 font-mono text-[9px] uppercase tracking-[.14em] text-white/50">Beta fechado</p><h2 className="mt-2 font-display text-[28px] font-semibold leading-tight tracking-[-.05em]">Convide uma profissional.</h2><p className="mt-3 max-w-[360px] font-body text-[13px] leading-relaxed text-white/65">Gere um link individual. A pessoa escolhe a própria senha e entra direto no onboarding. Abrir o link não o consome, então pode mandar pelo WhatsApp sem medo. Gerar um novo convite para o mesmo e-mail cancela o anterior.</p></div>
      <form onSubmit={onSubmit} className="p-6 sm:p-7"><div className="grid gap-4 sm:grid-cols-2"><label className="font-body text-[12px] font-semibold text-ink">Nome <span className="font-normal text-stone">(opcional)</span><input value={name} onChange={event => onName(event.target.value)} placeholder="Nome da profissional" maxLength={120} className="mt-2 h-11 w-full rounded-[10px] border border-line px-3 font-body text-[13px] font-normal outline-none focus:border-ink" /></label><label className="font-body text-[12px] font-semibold text-ink">E-mail<input value={email} onChange={event => onEmail(event.target.value)} placeholder="profissional@email.com" type="email" required autoComplete="off" className="mt-2 h-11 w-full rounded-[10px] border border-line px-3 font-body text-[13px] font-normal outline-none focus:border-ink" /></label><label className="font-body text-[12px] font-semibold text-ink">Validade do link<select value={hours} onChange={event => onHours(event.target.value)} className="mt-2 h-11 w-full rounded-[10px] border border-line bg-white px-3 font-body text-[13px] font-normal outline-none focus:border-ink"><option value="24">24 horas</option><option value="48">48 horas</option><option value="168">7 dias</option><option value="720">30 dias</option></select></label></div><button disabled={state === "loading"} className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-sky px-5 font-body text-[13px] font-semibold text-ink disabled:opacity-60">{state === "loading" ? <LoaderCircle size={15} className="animate-spin" /> : <UserPlus size={15} />}{state === "loading" ? "Gerando..." : "Gerar convite"}</button>{state === "error" && <div role="alert" className="mt-3"><p className="font-body text-[12px] text-red-700">{error}</p>{existing && <button type="button" onClick={event => onSubmit(event, true)} className="mt-2 inline-flex h-9 items-center rounded-full border border-line px-4 font-body text-[12px] font-semibold text-ink transition hover:border-ink">Gerar mesmo assim (ela define uma senha nova)</button>}</div>}{state === "ready" && link && <div className="mt-5 rounded-[12px] border border-line bg-paper p-4"><p className="font-body text-[12px] font-semibold text-ink">Convite pronto para {email}</p>{reset && <p className="mt-1 font-body text-[11px] text-[#8C5A11]">Esse e-mail já tinha conta: ao abrir o link, ela define uma senha nova.</p>}<p className="mt-1 font-body text-[11px] text-ash">Envie apenas para essa pessoa. Se expirar antes do uso, gere outro.</p><input value={link} readOnly aria-label="Link de convite" className="mt-3 h-10 w-full rounded-[9px] border border-line bg-white px-3 font-mono text-[10px] text-ash outline-none" /><div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => void navigator.clipboard.writeText(link)} className="inline-flex h-9 items-center gap-2 rounded-[9px] border border-line bg-white px-3 font-body text-[12px] font-semibold"><Clipboard size={14} />Copiar link</button><a href={whatsapp} target="_blank" rel="noreferrer" className="inline-flex h-9 items-center gap-2 rounded-[9px] bg-[#25D366] px-3 font-body text-[12px] font-semibold text-[#082D17]"><ExternalLink size={14} />Enviar no WhatsApp</a></div></div>}</form>
    </div>
  </section>;
}

function InviteList({ invites, onRevoke }: { invites: Invite[]; onRevoke: (id: string) => void }) {
  if (!invites.length) return null;
  return <Panel title="Convites enviados" subtitle="Os 50 mais recentes" action={`${invites.filter(invite => invite.status === "pendente").length} pendentes`}>
    <div className="divide-y divide-line">
      {invites.map(invite => <div key={invite.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
        <div className="min-w-0">
          <p className="truncate font-body text-[13px] font-semibold">{invite.name || invite.email}</p>
          <p className="mt-0.5 truncate font-body text-[11px] text-ash">{invite.email} · criado em {date(invite.created_at)}{invite.status === "pendente" ? ` · vale até ${date(invite.expires_at)}` : ""}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 font-mono text-[9px] uppercase tracking-[.08em] ${inviteTone[invite.status] ?? "bg-cream text-stone"}`}>{invite.status}</span>
          {invite.status === "pendente" && <button type="button" onClick={() => onRevoke(invite.id)} className="rounded-full border border-line px-3 py-1 font-body text-[11px] text-ash transition hover:border-red-300 hover:text-red-700">Cancelar</button>}
        </div>
      </div>)}
    </div>
  </Panel>;
}

function Loading() { return <main className="grid min-h-screen place-items-center bg-paper"><div className="text-center"><span className="mx-auto grid h-11 w-11 animate-pulse place-items-center rounded-[14px] bg-ink text-paper"><LayoutDashboard size={18} /></span><p className="mt-4 font-mono text-[10px] uppercase tracking-[.16em] text-stone">Carregando administração</p></div></main>; }
function NavItem({ icon, label, count, active = false }: { icon: ReactNode; label: string; count?: number; active?: boolean }) { return <button type="button" disabled={!active} aria-current={active ? "page" : undefined} className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left font-body text-[13px] font-medium transition ${active ? "bg-ink text-paper" : "cursor-not-allowed text-ash/60"}`}>{icon}<span>{label}</span>{typeof count === "number" && <span className={`ml-auto font-mono text-[10px] ${active ? "text-white/60" : "text-stone"}`}>{count}</span>}</button>; }
function Metric({ icon, label, value, detail, progress, tone }: { icon: ReactNode; label: string; value: string | number; detail: string; progress?: number; tone?: "dark" }) { return <article className={`rounded-[16px] border p-5 ${tone === "dark" ? "border-ink bg-ink text-paper" : "border-line bg-white"}`}><span className={`grid h-9 w-9 place-items-center rounded-[10px] ${tone === "dark" ? "bg-white/10" : "bg-cream text-ink"}`}>{icon}</span><p className={`mt-5 font-mono text-[10px] uppercase tracking-[.12em] ${tone === "dark" ? "text-white/55" : "text-stone"}`}>{label}</p><p className="mt-2 font-display text-[34px] font-semibold tracking-[-.055em]">{value}</p><p className={`mt-2 font-body text-[12px] ${tone === "dark" ? "text-white/60" : "text-ash"}`}>{detail}</p>{typeof progress === "number" && <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-cream"><span className="block h-full rounded-full bg-ink" style={{ width: `${progress}%` }} /></div>}</article>; }
function Panel({ title, subtitle, action, children }: { title: string; subtitle: string; action?: string; children: ReactNode }) { return <section className="rounded-[18px] border border-line bg-white p-5 sm:p-6"><div className="flex items-start justify-between gap-4"><div><h2 className="font-display text-[21px] font-semibold tracking-[-.04em]">{title}</h2><p className="mt-1 font-body text-[12px] text-ash">{subtitle}</p></div>{action && <span className="shrink-0 pt-1 font-mono text-[9px] uppercase tracking-[.1em] text-stone">{action}</span>}</div><div className="mt-5">{children}</div></section>; }
function Empty({ text }: { text: string }) { return <p className="border-t border-line py-7 text-center font-body text-[13px] text-ash">{text}</p>; }
function AccessState({ state }: { state: "loading" | "ready" | "setup" | "denied" | "error" }) { const setup = state === "setup"; const denied = state === "denied"; return <main className="grid min-h-screen place-items-center bg-paper p-5"><section className="w-full max-w-[550px] rounded-[20px] border border-line bg-white p-7 shadow-[0_24px_70px_rgba(18,40,58,.08)]"><Logo className="origin-left scale-[.86]" /><p className="mt-10 font-mono text-[10px] uppercase tracking-[.14em] text-stone">Administração</p><h1 className="mt-3 font-display text-[38px] font-semibold leading-[.94] tracking-[-.06em]">{setup ? "Ativação necessária." : denied ? "Acesso restrito." : "Não foi possível abrir o painel."}</h1><p className="mt-5 font-body text-[15px] leading-relaxed text-ash">{setup ? "O painel já está publicado, mas o banco de produção ainda precisa receber a configuração administrativa." : denied ? "Esta área só é liberada para contas administradoras da Vello." : "Tente atualizar a página. Se o problema continuar, confira a configuração administrativa do projeto."}</p>{setup && <ol className="mt-7 list-decimal space-y-2 border-y border-line py-5 pl-5 font-body text-[13px] leading-relaxed text-ash"><li>Aplique a migration administrativa no Supabase.</li><li>Defina <code className="font-mono text-[11px] text-ink">vello_role: admin</code> no app metadata da sua conta.</li><li>Saia e entre novamente na Vello.</li></ol>}<a href={appPath("/")} className="mt-8 inline-flex h-11 items-center rounded-[10px] bg-ink px-4 font-body text-[13px] font-semibold text-paper">Voltar para a Vello</a></section></main>; }
