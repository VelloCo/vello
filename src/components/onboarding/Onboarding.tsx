import type { User } from "@supabase/supabase-js";
import { Check, ChevronLeft, ImagePlus } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { appPath, PUBLIC_SITE_ORIGIN } from "../../lib/paths";
import { requireSupabase } from "../../lib/supabase";
import { replaceBusinessHours, saveService, slugify, uploadAvatar } from "../../lib/vello";
import type { Service } from "../../lib/vello";
import { LoadingScreen } from "../LoadingScreen";
import { Logo } from "../Logo";
import { AvatarCropper } from "./AvatarCropper";

type Step = 1 | 2 | 3 | 4;
type Form = {
  professionalName: string; businessType: "autonoma" | "clinica"; whatsapp: string; instagram: string; avatarUrl: string;
  city: string; state: string; neighborhood: string; address: string; showAddress: boolean; slug: string;
  serviceTitle: string; serviceCategory: Service["category"]; serviceDuration: string; servicePrice: string; servicePriceType: Service["price_type"]; serviceDescription: string;
  bookingEnabled: boolean; autoConfirm: boolean;
};
const blank: Form = { professionalName: "", businessType: "autonoma", whatsapp: "", instagram: "", avatarUrl: "", city: "", state: "", neighborhood: "", address: "", showAddress: false, slug: "", serviceTitle: "", serviceCategory: "facial", serviceDuration: "60", servicePrice: "", servicePriceType: "fixed", serviceDescription: "", bookingEnabled: true, autoConfirm: true };
const weekdays = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const categories: Array<[Service["category"], string]> = [["facial", "Facial"], ["corporal", "Corporal"], ["depilacao", "Depilação"], ["sobrancelhas_cilios", "Sobrancelhas e cílios"], ["unhas", "Unhas"], ["cabelo", "Cabelo"], ["massagem", "Massagem"], ["harmonizacao", "Harmonização"], ["outros", "Outros"]];
const field = "h-12 w-full rounded-xl border border-line bg-white px-4 font-body text-sm text-ink outline-none transition focus:border-ink focus:ring-4 focus:ring-ink/[.06]";
const label = "mb-2 block font-body text-[11px] font-medium uppercase tracking-[.08em] text-ash";
const cleanPhone = (value: string) => value.replace(/\D/g, "").slice(0, 13);
const publicLink = (slug: string) => `${PUBLIC_SITE_ORIGIN}/${slug}`;

function Stepper({ step }: { step: Step }) {
  return <div className="flex items-center gap-2" aria-label={`Etapa ${step} de 4`}>{[1, 2, 3, 4].map((item) => <span key={item} className={`h-1.5 flex-1 rounded-full ${item <= step ? "bg-ink" : "bg-line"}`} />)}</div>;
}
function PrimaryButton({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-ink px-6 font-body text-sm font-semibold text-paper transition hover:bg-[#245D85] disabled:cursor-not-allowed disabled:opacity-60">{children}</button>;
}

export function Onboarding({ user }: { user: User }) {
  const params = new URLSearchParams(window.location.search);
  const preview = params.get("preview") === "1";
  const requested = Number(params.get("step"));
  const [step, setStep] = useState<Step>([1, 2, 3, 4].includes(requested) ? requested as Step : 1);
  const [form, setForm] = useState<Form>(blank);
  const [hours, setHours] = useState(() => weekdays.map((_, weekday) => ({ weekday, enabled: weekday > 0 && weekday < 6, start_time: "09:00", end_time: "18:00" })));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [avatarCandidate, setAvatarCandidate] = useState<File | null>(null);
  const avatarInput = useRef<HTMLInputElement>(null);
  const update = <K extends keyof Form>(key: K, value: Form[K]) => setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    let active = true;
    Promise.resolve(requireSupabase().from("profiles").select("*").eq("user_id", user.id).maybeSingle()).then(({ data }) => {
      if (!active) return;
      if (data?.onboarding_completed && !preview) { window.location.replace(appPath("/dashboard")); return; }
      const name = data?.professional_name || String(user.user_metadata.full_name || "").trim();
      setForm({ ...blank, professionalName: name, businessType: data?.business_type || "autonoma", whatsapp: cleanPhone(data?.whatsapp || ""), instagram: data?.instagram || "", avatarUrl: data?.avatar_url || "", city: data?.city || "", state: data?.state || "", neighborhood: data?.neighborhood || "", address: data?.address || "", showAddress: data?.show_address || false, slug: data?.slug || slugify(name), bookingEnabled: data?.booking_enabled ?? true, autoConfirm: data?.booking_auto_confirm ?? true });
      setLoading(false);
    }).catch(() => { if (active) { setNotice("Não foi possível carregar seu perfil. Tente novamente."); setLoading(false); } });
    return () => { active = false; };
  }, [preview, user.id, user.user_metadata.full_name]);

  const next = () => { setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); setStep((current) => Math.min(4, current + 1) as Step); };
  const previous = () => { setNotice(""); window.scrollTo({ top: 0, behavior: "smooth" }); setStep((current) => Math.max(1, current - 1) as Step); };
  const checkFirst = () => {
    if (!form.professionalName || cleanPhone(form.whatsapp).length < 10) { setNotice("Informe o nome da estética e um WhatsApp válido com DDD."); return; }
    if (!form.slug) update("slug", slugify(form.professionalName));
    next();
  };
  const checkLocation = () => {
    if (!form.city || form.state.length !== 2 || !form.slug) { setNotice("Informe cidade, estado e um link para sua página pública."); return; }
    next();
  };
  const checkService = () => {
    if (!form.serviceTitle || !form.serviceDuration || (form.servicePriceType !== "on_request" && !form.servicePrice)) { setNotice("Preencha nome, duração e preço do seu primeiro serviço."); return; }
    next();
  };
  const upload = async (file: File) => {
    const avatarUrl = await uploadAvatar(user.id, file);
    update("avatarUrl", avatarUrl);
    setAvatarCandidate(null);
  };
  const finish = async () => {
    if (hours.some((hour) => hour.enabled && hour.end_time <= hour.start_time)) { setNotice("O horário final precisa ser maior que o inicial."); return; }
    setSaving(true); setNotice("");
    try {
      const profilePayload = { user_id: user.id, full_name: form.professionalName, professional_name: form.professionalName, avatar_url: form.avatarUrl || null, business_type: form.businessType, whatsapp: cleanPhone(form.whatsapp), instagram: form.instagram || null, city: form.city, state: form.state.toUpperCase(), neighborhood: form.neighborhood || null, address: form.address || null, show_address: form.showAddress, slug: slugify(form.slug), booking_enabled: form.bookingEnabled, booking_auto_confirm: form.autoConfirm, onboarding_completed: true, onboarding_step: 3 };
      const { error } = await requireSupabase().from("profiles").upsert(profilePayload, { onConflict: "user_id" });
      if (error) throw error;
      await saveService(user.id, { title: form.serviceTitle, description: form.serviceDescription, category: form.serviceCategory, duration_minutes: Number(form.serviceDuration), price_type: form.servicePriceType, price: form.servicePriceType === "on_request" ? null : Number(form.servicePrice.replace(",", ".")), publication_status: "published", bookable: form.bookingEnabled, position: 0 }, []);
      await replaceBusinessHours(user.id, hours.filter((hour) => hour.enabled).map(({ weekday, start_time, end_time }) => ({ weekday, start_time, end_time })));
      window.location.href = appPath("/dashboard");
    } catch (error) {
      setNotice(error instanceof Error && error.message.includes("unique") ? "Este link já está sendo usado. Escolha outro." : "Não foi possível concluir agora. Tente novamente.");
    } finally { setSaving(false); }
  };
  if (loading) return <LoadingScreen label="Preparando sua estética" />;

  return <main className="min-h-screen bg-[#F7FAFC] px-5 py-6 text-ink sm:px-8 sm:py-10"><div className="mx-auto max-w-[760px]"><header className="flex items-center justify-between"><a href={appPath("/")}><Logo className="origin-left scale-[.82]" /></a><a href={appPath("/dashboard")} className="font-body text-sm text-ash underline underline-offset-4">Sair e continuar depois</a></header><section className="mt-10 rounded-[28px] border border-line bg-white p-5 shadow-[0_22px_70px_-48px_rgba(18,40,58,.34)] sm:p-9"><div className="flex items-center justify-between gap-5"><p className="font-mono text-[10px] uppercase tracking-[.15em] text-stone">Etapa {step} de 4</p><p className="font-body text-xs text-ash">Configuração inicial</p></div><div className="mt-4"><Stepper step={step} /></div>
    {step === 1 && <section className="mt-10"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#3A739C]">Sua identidade</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.055em]">Vamos apresentar sua estética.</h1><p className="mt-3 max-w-xl font-body leading-relaxed text-ash">Essas informações aparecem na sua página pública e ajudam novas clientes a reconhecer seu atendimento.</p><div className="mt-8 flex items-center gap-4 rounded-2xl bg-[#E8F1F8] p-4"><span className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-2xl bg-white">{form.avatarUrl ? <img src={form.avatarUrl} alt="Prévia" className="h-full w-full object-cover" /> : <img src={appPath("/vello-logo.png")} alt="Vello" className="h-10 w-10 object-contain" />}</span><div><p className="font-body text-sm font-semibold">Foto do perfil</p><p className="mt-1 font-body text-xs text-ash">Você pode usar sua foto, da equipe ou da fachada.</p><input ref={avatarInput} className="hidden" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => { const file = event.target.files?.[0]; if (file) setAvatarCandidate(file); event.currentTarget.value = ""; }} /><button type="button" onClick={() => avatarInput.current?.click()} className="mt-2 inline-flex items-center gap-1 font-body text-xs font-semibold underline underline-offset-4"><ImagePlus size={13} />{form.avatarUrl ? "Trocar foto" : "Adicionar foto"}</button></div></div><div className="mt-7 grid gap-5 sm:grid-cols-2"><label><span className={label}>Nome da estética ou profissional</span><input className={field} value={form.professionalName} placeholder="Ex.: Studio Ana Rocha" onChange={(event) => { update("professionalName", event.target.value); if (!form.slug) update("slug", slugify(event.target.value)); }} /></label><label><span className={label}>WhatsApp</span><input className={field} inputMode="tel" value={form.whatsapp} placeholder="11999999999" onChange={(event) => update("whatsapp", cleanPhone(event.target.value))} /></label><label><span className={label}>Instagram · opcional</span><input className={field} value={form.instagram} placeholder="@suaestetica" onChange={(event) => update("instagram", event.target.value)} /></label></div><p className={`${label} mt-7`}>Qual é o seu negócio?</p><div className="grid gap-3 sm:grid-cols-2">{([['autonoma','Profissional autônoma','Você atende por conta própria.'],['clinica','Clínica ou espaço','Você representa um local de atendimento.']] as const).map(([value,title,detail]) => <button key={value} type="button" onClick={() => update("businessType", value)} className={`rounded-2xl border p-4 text-left transition ${form.businessType === value ? "border-ink bg-[#E8F1F8] ring-1 ring-ink" : "border-line hover:border-[#7EAFD0]"}`}><b className="block font-body text-sm">{title}</b><span className="mt-1 block font-body text-xs text-ash">{detail}</span></button>)}</div><div className="mt-9 flex justify-end"><PrimaryButton onClick={checkFirst}>Continuar</PrimaryButton></div></section>}
    {step === 2 && <section className="mt-10"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#3A739C]">Onde você atende</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.055em]">Deixe sua página encontrável.</h1><p className="mt-3 font-body leading-relaxed text-ash">Mostramos cidade e bairro. O endereço completo só aparece se você permitir.</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><label><span className={label}>Cidade</span><input className={field} value={form.city} onChange={(event) => update("city", event.target.value)} /></label><label><span className={label}>Estado</span><input className={field} maxLength={2} placeholder="SP" value={form.state} onChange={(event) => update("state", event.target.value.toUpperCase())} /></label><label><span className={label}>Bairro · opcional</span><input className={field} value={form.neighborhood} onChange={(event) => update("neighborhood", event.target.value)} /></label><label><span className={label}>Endereço · opcional</span><input className={field} value={form.address} onChange={(event) => update("address", event.target.value)} /></label></div><label className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-line bg-[#F7FAFC] p-4 font-body text-sm"><span><b className="block">Mostrar endereço completo</b><small className="mt-1 block text-xs text-ash">Deixe desligado se preferir informar apenas depois do contato.</small></span><input type="checkbox" checked={form.showAddress} onChange={(event) => update("showAddress", event.target.checked)} /></label><label className="mt-7 block"><span className={label}>Seu link Vello</span><div className="flex h-12 items-center overflow-hidden rounded-xl border border-line bg-white focus-within:border-ink"><span className="shrink-0 border-r border-line bg-[#F7FAFC] px-3 font-body text-xs text-ash">vello/</span><input className="min-w-0 flex-1 px-3 font-body text-sm outline-none" value={form.slug} onChange={(event) => update("slug", slugify(event.target.value))} /></div><small className="mt-2 block font-body text-xs text-ash">{form.slug ? publicLink(form.slug) : "Escolha o endereço da sua página pública."}</small></label><div className="mt-9 flex items-center justify-between"><button type="button" onClick={previous} className="inline-flex items-center gap-1 font-body text-sm text-ash"><ChevronLeft size={16} />Voltar</button><PrimaryButton onClick={checkLocation}>Continuar</PrimaryButton></div></section>}
    {step === 3 && <section className="mt-10"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#3A739C]">Primeiro serviço</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.055em]">O que suas clientes podem agendar?</h1><p className="mt-3 font-body leading-relaxed text-ash">Comece com um serviço. Você poderá adicionar fotos e outros cuidados no painel.</p><div className="mt-8 grid gap-5 sm:grid-cols-2"><label><span className={label}>Nome do serviço</span><input className={field} value={form.serviceTitle} placeholder="Ex.: Limpeza de pele" onChange={(event) => update("serviceTitle", event.target.value)} /></label><label><span className={label}>Categoria</span><select className={field} value={form.serviceCategory} onChange={(event) => update("serviceCategory", event.target.value as Service["category"])}>{categories.map(([value,name]) => <option key={value} value={value}>{name}</option>)}</select></label><label><span className={label}>Duração em minutos</span><input className={field} min="5" max="600" type="number" value={form.serviceDuration} onChange={(event) => update("serviceDuration", event.target.value)} /></label><label><span className={label}>Como cobrar</span><select className={field} value={form.servicePriceType} onChange={(event) => update("servicePriceType", event.target.value as Service["price_type"])}><option value="fixed">Preço fixo</option><option value="from">A partir de</option><option value="on_request">Sob consulta</option></select></label>{form.servicePriceType !== "on_request" && <label><span className={label}>Preço em R$</span><input className={field} inputMode="decimal" value={form.servicePrice} placeholder="120,00" onChange={(event) => update("servicePrice", event.target.value)} /></label>}</div><label className="mt-5 block"><span className={label}>Descrição · opcional</span><textarea className={`${field} min-h-28 py-3`} value={form.serviceDescription} placeholder="Conte para quem é indicado e o que está incluso." onChange={(event) => update("serviceDescription", event.target.value)} /></label><div className="mt-9 flex items-center justify-between"><button type="button" onClick={previous} className="inline-flex items-center gap-1 font-body text-sm text-ash"><ChevronLeft size={16} />Voltar</button><PrimaryButton onClick={checkService}>Continuar</PrimaryButton></div></section>}
    {step === 4 && <section className="mt-10"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-[#3A739C]">Sua agenda</p><h1 className="mt-3 font-display text-4xl font-semibold tracking-[-.055em]">Quando você atende?</h1><p className="mt-3 font-body leading-relaxed text-ash">Esses horários serão usados para disponibilizar a agenda online.</p><div className="mt-8 space-y-3">{hours.map((hour, index) => <div key={hour.weekday} className="grid items-center gap-3 rounded-2xl border border-line p-3 sm:grid-cols-[1fr_120px_120px]"><label className="flex items-center gap-3 font-body text-sm font-semibold"><input type="checkbox" checked={hour.enabled} onChange={(event) => setHours((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, enabled: event.target.checked } : item))} />{weekdays[hour.weekday]}</label><input type="time" className="h-10 rounded-xl border border-line px-3 font-body text-sm disabled:opacity-40" disabled={!hour.enabled} value={hour.start_time} onChange={(event) => setHours((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, start_time: event.target.value } : item))} /><input type="time" className="h-10 rounded-xl border border-line px-3 font-body text-sm disabled:opacity-40" disabled={!hour.enabled} value={hour.end_time} onChange={(event) => setHours((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, end_time: event.target.value } : item))} /></div>)}</div><label className="mt-6 flex items-center justify-between gap-4 rounded-2xl border border-line bg-[#E8F1F8] p-4 font-body text-sm"><span><b className="block">Aceitar agendamentos online</b><small className="mt-1 block text-xs text-ash">Clientes poderão escolher um horário na sua página.</small></span><input type="checkbox" checked={form.bookingEnabled} onChange={(event) => update("bookingEnabled", event.target.checked)} /></label><label className="mt-3 flex items-center justify-between gap-4 rounded-2xl border border-line bg-[#F7FAFC] p-4 font-body text-sm"><span><b className="block">Confirmar automaticamente</b><small className="mt-1 block text-xs text-ash">Desligue para aprovar cada pedido manualmente.</small></span><input type="checkbox" checked={form.autoConfirm} onChange={(event) => update("autoConfirm", event.target.checked)} /></label><div className="mt-9 flex items-center justify-between"><button type="button" onClick={previous} className="inline-flex items-center gap-1 font-body text-sm text-ash"><ChevronLeft size={16} />Voltar</button><PrimaryButton disabled={saving} onClick={finish}>{saving ? "Salvando..." : <><Check size={16} />Concluir configuração</>}</PrimaryButton></div></section>}
    {notice && <p role="alert" className="mt-6 rounded-xl bg-red-50 px-4 py-3 font-body text-sm text-red-700">{notice}</p>}
    </section></div>{avatarCandidate && <AvatarCropper file={avatarCandidate} onCancel={() => setAvatarCandidate(null)} onConfirm={upload} />}</main>;
}
