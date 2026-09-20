import { ArrowUpRight, Clock3, MapPin, MessageCircle, Share2 } from "lucide-react";
import { useEffect, useState } from "react";
import { appPath } from "../../lib/paths";
import { requireSupabase } from "../../lib/supabase";
import { LoadingScreen } from "../LoadingScreen";
import { Logo } from "../Logo";

type PublicService = {
  id: string;
  title: string;
  description: string;
  category: string;
  price_type: "fixed" | "from" | "on_request";
  price: number | string | null;
  duration_minutes: number;
  bookable: boolean;
  images: Array<{ image_url: string; position: number }>;
};

type PublicPage = {
  profile: {
    professional_name: string;
    avatar_url: string | null;
    business_type: "autonoma" | "clinica";
    whatsapp: string | null;
    city: string | null;
    state: string | null;
    neighborhood: string | null;
    address: string | null;
    instagram: string | null;
    slug: string;
    bio: string;
  };
  services: PublicService[];
};

const categoryLabel: Record<string, string> = {
  facial: "Facial", corporal: "Corporal", depilacao: "Depilação", sobrancelhas_cilios: "Sobrancelhas e cílios", unhas: "Unhas", cabelo: "Cabelo", massagem: "Massagem", harmonizacao: "Harmonização", outros: "Outros",
};
const price = (service: PublicService) => {
  if (service.price_type === "on_request") return "Sob consulta";
  const value = Number(service.price);
  const formatted = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number.isFinite(value) ? value : 0);
  return service.price_type === "from" ? `A partir de ${formatted}` : formatted;
};
const phone = (value: string | null) => (value || "").replace(/\D/g, "");

function NotFound() {
  return <main className="grid min-h-screen place-items-center bg-paper px-5 text-center"><div><Logo /><h1 className="mt-10 font-display text-4xl font-semibold tracking-[-.05em]">Esta página não foi encontrada.</h1><p className="mt-3 font-body text-ash">Confira o link ou volte para a Vello.</p><a href={appPath("/")} className="mt-7 inline-flex rounded-full bg-ink px-5 py-3 font-body text-sm font-semibold text-paper">Conhecer a Vello</a></div></main>;
}

export function PublicServiceCatalog({ slug }: { slug: string }) {
  const [page, setPage] = useState<PublicPage | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    let active = true;
    Promise.resolve(requireSupabase().rpc("get_public_page", { p_slug: slug })).then(({ data }) => {
      if (active) setPage(data as PublicPage | null);
    }).catch(() => { if (active) setPage(null); });
    return () => { active = false; };
  }, [slug]);
  if (page === undefined) return <LoadingScreen label="Abrindo serviços" />;
  if (!page) return <NotFound />;
  const location = [page.profile.address, page.profile.neighborhood, page.profile.city, page.profile.state].filter(Boolean).join(" · ");
  const contact = phone(page.profile.whatsapp);
  const share = async () => {
    try {
      if (navigator.share) await navigator.share({ title: page.profile.professional_name, text: `Confira os serviços de ${page.profile.professional_name}.`, url: window.location.href });
      else { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
    } catch { /* Native share sheet closed. */ }
  };
  const whatsapp = (service?: PublicService) => `https://wa.me/${contact}?text=${encodeURIComponent(`Olá! Vi ${service ? `o serviço ${service.title}` : "seus serviços"} na Vello e gostaria de agendar.`)}`;
  return <main className="min-h-screen bg-[#F7FAFC] text-ink">
    <header className="border-b border-line bg-white"><div className="mx-auto flex h-[72px] max-w-[1180px] items-center justify-between px-5 sm:px-8"><a href={appPath("/")}><Logo className="origin-left scale-[.78]" /></a><button onClick={share} className="inline-flex h-10 items-center gap-2 rounded-full border border-line px-4 font-body text-sm font-medium transition hover:border-ink"><Share2 size={16} /> <span className="hidden sm:inline">{copied ? "Link copiado" : "Compartilhar"}</span></button></div></header>
    <section className="border-b border-line bg-white px-5 py-10 sm:px-8 sm:py-16"><div className="mx-auto max-w-[1180px]"><div className="flex max-w-3xl flex-col gap-6 sm:flex-row sm:items-center"><span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-[26px] bg-[#E8F1F8]">{page.profile.avatar_url ? <img src={page.profile.avatar_url} alt={`Foto de ${page.profile.professional_name}`} className="h-full w-full object-cover" /> : <img src={appPath("/vello-logo.png")} alt="Vello" className="h-12 w-12 object-contain" />}</span><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">{page.profile.business_type === "clinica" ? "Clínica de estética" : "Estética e bem-estar"}</p><h1 className="mt-3 font-display text-[clamp(38px,6vw,62px)] font-semibold leading-none tracking-[-.06em]">{page.profile.professional_name}</h1>{page.profile.bio && <p className="mt-4 max-w-2xl font-body text-[16px] leading-relaxed text-ash">{page.profile.bio}</p>} {location && <p className="mt-4 flex items-center gap-2 font-body text-sm text-ash"><MapPin size={15} />{location}</p>}</div></div></div></section>
    <section className="mx-auto max-w-[1180px] px-5 py-12 sm:px-8 sm:py-16"><div className="flex flex-wrap items-end justify-between gap-4"><div><p className="font-mono text-[10px] uppercase tracking-[.16em] text-stone">Serviços</p><h2 className="mt-3 font-display text-4xl font-semibold tracking-[-.05em]">Escolha seu cuidado.</h2></div><p className="font-body text-sm text-ash">{page.services.length} {page.services.length === 1 ? "serviço disponível" : "serviços disponíveis"}</p></div>{page.services.length ? <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{page.services.map((service) => <article key={service.id} className="flex overflow-hidden rounded-[24px] border border-line bg-white shadow-[0_18px_45px_-40px_rgba(18,40,58,.28)]"><div className="flex min-w-0 flex-1 flex-col">{service.images[0] && <img src={service.images[0].image_url} alt={service.title} className="aspect-[4/3] w-full object-cover" />}<div className="flex flex-1 flex-col p-5"><div className="flex items-start justify-between gap-3"><p className="font-mono text-[10px] uppercase tracking-[.12em] text-stone">{categoryLabel[service.category] || "Estética"}</p><span className="inline-flex shrink-0 items-center gap-1 font-body text-xs text-ash"><Clock3 size={13} />{service.duration_minutes} min</span></div><h3 className="mt-3 font-display text-2xl font-semibold tracking-[-.035em]">{service.title}</h3>{service.description && <p className="mt-3 line-clamp-3 font-body text-sm leading-relaxed text-ash">{service.description}</p>}<div className="mt-auto pt-6"><p className="font-body text-base font-semibold">{price(service)}</p>{contact && <a href={whatsapp(service)} target="_blank" rel="noreferrer" className="mt-4 inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-ink px-4 font-body text-sm font-semibold text-paper transition hover:bg-[#245D85]"><MessageCircle size={16} />{service.bookable ? "Quero agendar" : "Tirar dúvidas"}<ArrowUpRight size={15} /></a>}</div></div></div></article>)}</div> : <div className="mt-10 rounded-[24px] border border-dashed border-line bg-white p-8 text-center sm:p-12"><p className="font-display text-2xl font-semibold">Novos cuidados em breve.</p><p className="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed text-ash">Esta estética ainda está preparando os serviços que vai disponibilizar por aqui.</p>{contact && <a href={whatsapp()} target="_blank" rel="noreferrer" className="mt-6 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 font-body text-sm font-semibold text-paper"><MessageCircle size={16} />Falar pelo WhatsApp</a>}</div>}</section>
    {contact && <section className="bg-ink px-5 py-16 text-paper sm:px-8 sm:py-24"><div className="mx-auto max-w-2xl text-center"><p className="font-mono text-[10px] uppercase tracking-[.16em] text-paper/55">Atendimento personalizado</p><h2 className="mt-4 font-display text-4xl font-semibold tracking-[-.05em]">Quer tirar uma dúvida antes?</h2><a href={whatsapp()} target="_blank" rel="noreferrer" className="mt-8 inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 font-body text-sm font-semibold text-ink"><MessageCircle size={17} />Conversar no WhatsApp</a></div></section>}
  </main>;
}
