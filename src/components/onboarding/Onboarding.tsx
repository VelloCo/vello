import type { User } from "@supabase/supabase-js";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  Copy,
  ImagePlus,
  LoaderCircle,
  LogOut,
  Pencil,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { appPath } from "../../lib/paths";
import { requireSupabase } from "../../lib/supabase";
import { Logo } from "../Logo";
import { LoadingScreen } from "../LoadingScreen";
import { AvatarCropper } from "./AvatarCropper";

type Photo = { id: string; url: string; name: string };
type Profile = {
  fullName: string;
  professionalName: string;
  creci: string;
  whatsapp: string;
  city: string;
  state: string;
  instagram: string;
  slug: string;
  avatarUrl: string;
};
type Property = {
  transaction: "sale" | "rent";
  type: string;
  title: string;
  price: string;
  city: string;
  neighborhood: string;
  address: string;
  showAddress: boolean;
  bedrooms: string;
  suites: string;
  bathrooms: string;
  parking: string;
  area: string;
  description: string;
  features: string[];
};

const blankProfile: Profile = {
  fullName: "",
  professionalName: "",
  creci: "",
  whatsapp: "",
  city: "",
  state: "RS",
  instagram: "",
  slug: "",
  avatarUrl: "",
};
const blankProperty: Property = {
  transaction: "sale",
  type: "Apartamento",
  title: "",
  price: "",
  city: "",
  neighborhood: "",
  address: "",
  showAddress: false,
  bedrooms: "",
  suites: "",
  bathrooms: "",
  parking: "",
  area: "",
  description: "",
  features: [],
};
const features = [
  "Sacada",
  "Churrasqueira",
  "Piscina",
  "Academia",
  "Elevador",
  "Portaria",
  "Mobiliado",
  "Aceita pets",
  "Condomínio fechado",
  "Vista panorâmica",
];

const field =
  "h-12 w-full rounded-xl border border-line bg-white px-4 font-body text-[14px] text-ink outline-none transition placeholder:text-stone focus:border-ink";
const label =
  "mb-2 block font-display text-[12px] font-extrabold uppercase tracking-[-0.01em] text-ink";

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
function money(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits
    ? new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0,
      }).format(Number(digits))
    : "";
}
function creci(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits ? `CRECI ${digits}` : "";
}
function completedCreci(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return digits ? `CRECI ${digits}${digits.length >= 5 ? "-F" : ""}` : "";
}
function whatsapp(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits ? `(${digits}` : "";
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}
function number(value: string) {
  return Number(value.replace(/\D/g, "")) || 0;
}
function publicLink(slug: string) {
  return `${window.location.origin}${appPath(`/${slug}`)}`;
}

async function optimizeImage(file: File) {
  if (file.size < 1_800_000 || !file.type.startsWith("image/")) return file;
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1920 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/webp", 0.84),
  );
  return blob
    ? new File([blob], `${file.name.replace(/\.[^.]+$/, "")}.webp`, {
        type: "image/webp",
      })
    : file;
}

export function Onboarding({ user }: { user: User }) {
  const params = new URLSearchParams(window.location.search);
  const preview = params.get("preview") === "1";
  const requestedStep = Number(params.get("step")) as 1 | 2 | 3;
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [profile, setProfile] = useState<Profile>(blankProfile);
  const [property, setProperty] = useState<Property>(blankProperty);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [avatarCandidate, setAvatarCandidate] = useState<File | null>(null);
  const [slugStatus, setSlugStatus] = useState<
    "idle" | "checking" | "available" | "taken"
  >("idle");

  useEffect(() => {
    const restore = async () => {
      const db = requireSupabase();
      const { data } = await db
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();
      const saved = localStorage.getItem(
        `vello-onboarding-property-${user.id}`,
      );
      if (saved) setProperty({ ...blankProperty, ...JSON.parse(saved) });
      if (data) {
        if (data.onboarding_completed && !preview) {
          window.location.replace(appPath("/dashboard"));
          return;
        }
        setStep(
          [1, 2, 3].includes(requestedStep)
            ? requestedStep
            : (data.onboarding_step as 1 | 2 | 3),
        );
        setProfile({
          fullName: data.full_name ?? "",
          professionalName: data.professional_name ?? "",
          creci: data.creci ?? "",
          whatsapp: data.whatsapp ?? "",
          city: data.city ?? "",
          state: data.state ?? "RS",
          instagram: data.instagram ?? "",
          slug: data.slug ?? "",
          avatarUrl: data.avatar_url ?? "",
        });
      } else {
        const name = String(user.user_metadata.full_name ?? "").trim();
        setProfile((p) => ({
          ...p,
          fullName: name,
          professionalName: name,
          slug: slugify(name),
        }));
      }
      setLoading(false);
    };
    restore().catch(() => {
      setNotice("Não foi possível carregar seu progresso. Tente novamente.");
      setLoading(false);
    });
  }, [user.id, user.user_metadata.full_name, preview, requestedStep]);

  useEffect(() => {
    if (!loading)
      localStorage.setItem(
        `vello-onboarding-property-${user.id}`,
        JSON.stringify(property),
      );
  }, [property, user.id, loading]);
  useEffect(() => {
    if (!profile.slug || !/^[a-z0-9-]+$/.test(profile.slug)) {
      setSlugStatus("idle");
      return;
    }
    setSlugStatus("checking");
    const timer = window.setTimeout(async () => {
      const { data, error } = await requireSupabase().rpc("is_slug_available", {
        candidate: profile.slug,
      });
      setSlugStatus(!error && data ? "available" : "taken");
    }, 350);
    return () => window.clearTimeout(timer);
  }, [profile.slug]);

  const updateProfile = (key: keyof Profile, value: string) =>
    setProfile((old) => ({
      ...old,
      [key]: key === "whatsapp" ? whatsapp(value) : value,
    }));
  const updateProperty = (
    key: keyof Property,
    value: string | boolean | string[],
  ) => setProperty((old) => ({ ...old, [key]: value }));

  function transitionTo(nextStep: 1 | 2 | 3) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.setTimeout(() => setStep(nextStep), 180);
  }

  async function uploadAvatar(file: File) {
    if (!file.type.startsWith("image/")) return;
    setSaving(true);
    try {
      const optimized = await optimizeImage(file);
      const path = `${user.id}/avatar-${Date.now()}.${optimized.name.split(".").pop() || "jpg"}`;
      const { error } = await requireSupabase()
        .storage.from("avatars")
        .upload(path, optimized, { upsert: true, contentType: optimized.type });
      if (error) throw error;
      const { data } = requireSupabase()
        .storage.from("avatars")
        .getPublicUrl(path);
      updateProfile("avatarUrl", data.publicUrl);
      setAvatarCandidate(null);
    } catch {
      setNotice("Não foi possível enviar a foto. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function saveProfile() {
    if (
      !profile.professionalName ||
      !profile.creci ||
      !profile.whatsapp ||
      !profile.city ||
      !profile.slug ||
      slugStatus !== "available"
    ) {
      setNotice(
        "Preencha os campos obrigatórios e escolha um link disponível.",
      );
      return;
    }
    setSaving(true);
    setNotice("");
    const { error } = await requireSupabase()
      .from("profiles")
      .upsert(
        {
          user_id: user.id,
          full_name: profile.fullName || profile.professionalName,
          professional_name: profile.professionalName,
          avatar_url: profile.avatarUrl || null,
          creci: profile.creci,
          whatsapp: profile.whatsapp,
          city: profile.city,
          state: profile.state,
          instagram: profile.instagram || null,
          slug: profile.slug,
          onboarding_step: 2,
        },
        { onConflict: "user_id" },
      );
    setSaving(false);
    if (error) {
      setNotice(
        error.message.includes("unique")
          ? "Este link já está sendo usado."
          : "Não foi possível salvar agora.",
      );
      return;
    }
    transitionTo(2);
  }

  async function uploadPhotos(files: FileList | null) {
    if (!files?.length) return;
    setSaving(true);
    setNotice("Enviando fotos...");
    try {
      const newPhotos: Photo[] = [];
      for (const file of Array.from(files).slice(0, 12 - photos.length)) {
        if (!file.type.startsWith("image/")) continue;
        const optimized = await optimizeImage(file);
        const path = `${user.id}/draft/${crypto.randomUUID()}-${optimized.name.replace(/[^a-zA-Z0-9.-]/g, "-")}`;
        const { error } = await requireSupabase()
          .storage.from("property-images")
          .upload(path, optimized, { contentType: optimized.type });
        if (error) throw error;
        const { data } = requireSupabase()
          .storage.from("property-images")
          .getPublicUrl(path);
        newPhotos.push({
          id: crypto.randomUUID(),
          url: data.publicUrl,
          name: file.name,
        });
      }
      setPhotos((old) => [...old, ...newPhotos]);
      setNotice("");
    } catch {
      setNotice("Não foi possível enviar esta imagem. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  async function publish() {
    if (
      !photos.length ||
      !property.title ||
      !property.type ||
      !property.price ||
      !property.city ||
      !property.neighborhood
    ) {
      setNotice(
        "Adicione uma foto e preencha título, tipo, preço, cidade e bairro.",
      );
      return;
    }
    setSaving(true);
    setNotice("Publicando imóvel...");
    const db = requireSupabase();
    const { data: created, error } = await db
      .from("properties")
      .insert({
        user_id: user.id,
        title: property.title,
        description: property.description,
        transaction_type: property.transaction,
        property_type: property.type,
        price: Number(property.price.replace(/\D/g, "")),
        city: property.city,
        neighborhood: property.neighborhood,
        address: property.address || null,
        show_full_address: property.showAddress,
        bedrooms: number(property.bedrooms),
        suites: number(property.suites),
        bathrooms: number(property.bathrooms),
        parking_spaces: number(property.parking),
        area: number(property.area),
        features: property.features,
      })
      .select("id")
      .single();
    if (!error && created) {
      const imageError = await db
        .from("property_images")
        .insert(
          photos.map((photo, position) => ({
            property_id: created.id,
            image_url: photo.url,
            position,
            is_cover: position === 0,
          })),
        );
      if (!imageError.error)
        await db
          .from("profiles")
          .update({ onboarding_step: 3 })
          .eq("user_id", user.id);
      else setNotice("O imóvel foi criado, mas houve um problema nas fotos.");
    }
    setSaving(false);
    if (error) {
      setNotice("Não foi possível publicar agora.");
      return;
    }
    localStorage.removeItem(`vello-onboarding-property-${user.id}`);
    setNotice("");
    transitionTo(3);
  }

  async function skipProperty() {
    setSaving(true);
    setNotice("");
    const { error } = await requireSupabase()
      .from("profiles")
      .update({ onboarding_step: 3 })
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      setNotice("Não foi possível pular esta etapa agora.");
      return;
    }
    localStorage.removeItem(`vello-onboarding-property-${user.id}`);
    transitionTo(3);
  }

  async function finish() {
    await requireSupabase()
      .from("profiles")
      .update({ onboarding_completed: true, onboarding_step: 3 })
      .eq("user_id", user.id);
    window.location.href = appPath("/dashboard");
  }

  const link = publicLink(profile.slug || "seu-link");
  const page = useMemo(
    () =>
      step === 1 ? (
        <ProfileStep
          profile={profile}
          update={updateProfile}
          saving={saving}
          slugStatus={slugStatus}
          onAvatar={setAvatarCandidate}
          onRemoveAvatar={() => updateProfile("avatarUrl", "")}
          onContinue={saveProfile}
        />
      ) : step === 2 ? (
        <PropertyStep
          property={property}
          update={updateProperty}
          photos={photos}
          setPhotos={setPhotos}
          saving={saving}
          onUpload={uploadPhotos}
          onBack={() => setStep(1)}
          onPublish={publish}
          onSkip={skipProperty}
        />
      ) : (
        <SuccessStep
          profile={profile}
          property={property}
          photos={photos}
          link={link}
          onDashboard={finish}
        />
      ),
    [step, profile, property, photos, saving, slugStatus],
  );

  if (loading) return <LoadingScreen label="Preparando seu catálogo" />;
  return (
    <main className="min-h-screen bg-paper pb-10">
      <div className="mx-auto max-w-[900px] px-5 py-7 sm:px-8 lg:py-10">
        <div className="flex items-center justify-between">
          <a href={appPath("/")}>
            <Logo />
          </a>
          <button
            onClick={() => (window.location.href = appPath("/dashboard"))}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-line bg-white px-4 font-body text-sm font-medium text-ash transition hover:border-ink hover:text-ink active:scale-[0.98]"
          >
            <LogOut size={14} strokeWidth={1.8} /> Sair
          </button>
        </div>
        <Progress
          step={step}
          onSelect={(nextStep) => {
            if ((step === 2 || preview) && nextStep < step)
              setStep(nextStep as 1 | 2 | 3);
          }}
        />
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.28 }}
          >
            {page}
          </motion.div>
        </AnimatePresence>
        {notice && (
          <p className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full bg-ink px-5 py-3 font-body text-sm text-paper shadow-lg">
            {notice}
          </p>
        )}
      </div>
      {avatarCandidate && (
        <AvatarCropper
          file={avatarCandidate}
          onCancel={() => setAvatarCandidate(null)}
          onConfirm={uploadAvatar}
        />
      )}
    </main>
  );
}

function Progress({
  step,
  onSelect,
}: {
  step: number;
  onSelect: (step: number) => void;
}) {
  const items = ["Perfil", "Imóvel", "Pronto"];
  return (
    <div className="mx-auto mt-9 flex max-w-[720px] items-center justify-between rounded-2xl border border-line/80 bg-white/70 px-4 py-3 sm:px-5">
      <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-ash">
        Etapa <b className="text-ink">{step}</b> de 3
      </span>
      <div
        className="flex items-center gap-2"
        aria-label={`Etapa ${step} de 3`}
      >
        {items.map((item, index) => {
          const itemStep = index + 1;
          const completed = itemStep < step;
          const current = itemStep === step;
          const enabled = itemStep < step && step < 3;
          return (
            <button
              key={item}
              type="button"
              title={item}
              onClick={() => enabled && onSelect(itemStep)}
              disabled={!enabled}
              aria-current={current ? "step" : undefined}
              className={`h-2.5 rounded-full transition-all duration-300 ${current ? "w-10 bg-ink" : completed ? "w-2.5 bg-ink/50 hover:bg-ink" : "w-2.5 bg-line"} ${enabled ? "cursor-pointer" : "cursor-default"}`}
            />
          );
        })}
      </div>
    </div>
  );
}

function ProfileStep({
  profile,
  update,
  saving,
  slugStatus,
  onAvatar,
  onRemoveAvatar,
  onContinue,
}: {
  profile: Profile;
  update: (key: keyof Profile, value: string) => void;
  saving: boolean;
  slugStatus: string;
  onAvatar: (file: File) => void;
  onRemoveAvatar: () => void;
  onContinue: () => void;
}) {
  return (
    <section className="mx-auto max-w-[720px] py-12 sm:py-16">
      <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-stone">
        Seu perfil
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Vamos deixar seu catálogo com a sua cara.
      </h1>
      <p className="mt-4 max-w-xl font-body text-[16px] leading-relaxed text-ash">
        Essas informações aparecerão para seus clientes no seu perfil Vello.
      </p>
      <div className="mt-10">
        <label className={label}>Foto de perfil</label>
        <div className="flex items-center gap-4">
          <span className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-full border border-line bg-cream">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt="Sua foto de perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <img src={appPath("/vello-mascot.png")} alt="Mascote temporário da Vello" className="h-full w-full object-cover object-top" />
            )}
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-full border border-line bg-white px-4 font-body text-sm font-semibold text-ink transition hover:border-ink active:scale-[0.98]">
                {profile.avatarUrl ? <Pencil size={14} /> : <ImagePlus size={15} />}
                {profile.avatarUrl ? "Trocar" : "Adicionar foto"}
                <input
                  className="hidden"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) onAvatar(file);
                    event.target.value = "";
                  }}
                />
              </label>
              {profile.avatarUrl && (
                <button
                  type="button"
                  onClick={onRemoveAvatar}
                  className="inline-flex h-10 items-center gap-2 rounded-full px-3 font-body text-sm font-medium text-ash transition hover:bg-red-50 hover:text-red-700 active:scale-[0.98]"
                >
                  <Trash2 size={14} /> Remover
                </button>
              )}
            </div>
            <small className="mt-2 block font-body text-xs text-stone">
              JPG, PNG ou WebP · você poderá ajustar o recorte. Sem foto, usamos o mascote Vello por enquanto.
            </small>
          </div>
        </div>
      </div>
      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        <Input
          label="Nome profissional"
          value={profile.professionalName}
          placeholder="Carlos Almeida"
          onChange={(v) => {
            update("professionalName", v);
            if (!profile.slug) update("slug", slugify(v));
          }}
        />
        <Input
          label="CRECI"
          value={profile.creci}
          placeholder="CRECI 12345-F"
          inputMode="numeric"
          onChange={(v) => update("creci", creci(v))}
          onBlur={() => update("creci", completedCreci(profile.creci))}
        />
        <Input
          label="WhatsApp"
          value={profile.whatsapp}
          placeholder="(51) 99999-9999"
          type="tel"
          onChange={(v) =>
            update(
              "whatsapp",
              v
                .replace(/\D/g, "")
                .replace(/(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2")
                .slice(0, 15),
            )
          }
        />
        <Input
          label="Cidade"
          value={profile.city}
          placeholder="Porto Alegre"
          onChange={(v) => update("city", v)}
        />
        <Select
          label="Estado"
          value={profile.state}
          onChange={(v) => update("state", v)}
          options={["RS", "SC", "PR", "SP", "RJ", "MG", "BA", "PE"]}
        />
        <Input
          label="Instagram · opcional"
          value={profile.instagram}
          placeholder="@seuinstagram"
          onChange={(v) => update("instagram", v)}
        />
      </div>
      <div className="mt-8 rounded-2xl border border-line bg-white p-5">
        <label className={label}>Seu link Vello</label>
        <div className="flex items-center overflow-hidden rounded-xl border border-line bg-paper">
          <span className="whitespace-nowrap border-r border-line px-4 py-3 font-body text-sm text-ash">
            vello.com.br/
          </span>
          <input
            value={profile.slug}
            onChange={(e) => update("slug", slugify(e.target.value))}
            className="min-w-0 flex-1 bg-transparent px-3 py-3 font-body text-sm text-ink outline-none"
            placeholder="carlos-almeida"
          />
        </div>
        <p className="mt-3 font-body text-sm text-ash">
          Preview:{" "}
          <span className="text-ink">
            vello.com.br/{profile.slug || "seu-link"}
          </span>
        </p>
        <p
          className={`mt-2 font-body text-sm ${slugStatus === "available" ? "text-emerald-700" : slugStatus === "taken" ? "text-red-600" : "text-stone"}`}
        >
          {slugStatus === "available"
            ? "✓ Link disponível"
            : slugStatus === "taken"
              ? "Este link já está sendo usado."
              : slugStatus === "checking"
                ? "Verificando link..."
                : "Use letras, números e hífen."}
        </p>
      </div>
      <Button className="mt-9" loading={saving} onClick={onContinue}>
        Continuar
      </Button>
    </section>
  );
}

function PropertyStep({
  property,
  update,
  photos,
  setPhotos,
  saving,
  onUpload,
  onBack,
  onPublish,
  onSkip,
}: {
  property: Property;
  update: (key: keyof Property, value: string | boolean | string[]) => void;
  photos: Photo[];
  setPhotos: React.Dispatch<React.SetStateAction<Photo[]>>;
  saving: boolean;
  onUpload: (files: FileList | null) => void;
  onBack: () => void;
  onPublish: () => void;
  onSkip: () => void;
}) {
  const toggle = (name: string) =>
    update(
      "features",
      property.features.includes(name)
        ? property.features.filter((x) => x !== name)
        : [...property.features, name],
    );
  return (
    <section className="mx-auto max-w-[900px] py-12 sm:py-16">
      <div className="mb-8 flex items-center justify-between gap-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 font-body text-sm text-ash hover:text-ink"
        >
          <ChevronLeft size={16} /> Voltar
        </button>
        <button
          type="button"
          onClick={onSkip}
          disabled={saving}
          className="font-body text-sm font-medium text-ash underline underline-offset-4 transition hover:text-ink disabled:opacity-50"
        >
          Pular por enquanto
        </button>
      </div>
      <h1 className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Agora, adicione seu primeiro imóvel.
      </h1>
      <p className="mt-4 max-w-xl font-body text-[16px] leading-relaxed text-ash">
        Leva só alguns minutos. Depois disso, seu catálogo já estará pronto para
        compartilhar.
      </p>
      <div className="mt-10">
        <label className={label}>Fotos do imóvel</label>
        <label className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-white p-8 text-center transition hover:border-ink">
          <Upload size={24} className="mb-3 text-ash" />
          <b className="font-body text-[15px] text-ink">
            Arraste as fotos do imóvel para cá
          </b>
          <span className="mt-1 font-body text-sm text-ash">
            ou clique para selecionar
          </span>
          <input
            className="hidden"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => onUpload(e.target.files)}
          />
        </label>
        {photos.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-5">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative aspect-square overflow-hidden rounded-xl border border-line bg-cream"
              >
                <img src={photo.url} className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-ink px-2 py-1 font-mono text-[9px] text-paper">
                    Capa
                  </span>
                )}
                <button
                  onClick={() =>
                    setPhotos((old) => old.filter((p) => p.id !== photo.id))
                  }
                  className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-full bg-white text-ink"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="mt-10 grid gap-5">
        <div>
          <label className={label}>Negociação</label>
          <div className="inline-flex rounded-xl border border-line bg-white p-1">
            <Segment
              active={property.transaction === "sale"}
              onClick={() => update("transaction", "sale")}
            >
              Venda
            </Segment>
            <Segment
              active={property.transaction === "rent"}
              onClick={() => update("transaction", "rent")}
            >
              Aluguel
            </Segment>
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <Select
            label="Tipo"
            value={property.type}
            onChange={(v) => update("type", v)}
            options={[
              "Apartamento",
              "Casa",
              "Cobertura",
              "Terreno",
              "Comercial",
              "Studio",
              "Sobrado",
              "Outro",
            ]}
          />
          <Input
            label="Preço"
            value={property.price}
            placeholder={
              property.transaction === "sale" ? "R$ 890.000" : "R$ 4.500"
            }
            inputMode="numeric"
            onChange={(v) => update("price", money(v))}
          />
        </div>
        <Input
          label="Título"
          value={property.title}
          placeholder="Apartamento moderno no Moinhos de Vento"
          onChange={(v) => update("title", v)}
        />
        <div className="rounded-2xl border border-line bg-white p-5">
          <p className={label}>Localização</p>
          <div className="grid gap-5 sm:grid-cols-2">
            <Input
              label="Cidade"
              value={property.city}
              placeholder="Porto Alegre"
              onChange={(v) => update("city", v)}
            />
            <Input
              label="Bairro"
              value={property.neighborhood}
              placeholder="Moinhos de Vento"
              onChange={(v) => update("neighborhood", v)}
            />
          </div>
          <div className="mt-5">
            <Input
              label="Endereço · opcional"
              value={property.address}
              placeholder="Rua Exemplo, 123"
              onChange={(v) => update("address", v)}
            />
            <label className="mt-4 flex items-center gap-2 font-body text-sm text-ash">
              <input
                type="checkbox"
                checked={property.showAddress}
                onChange={(e) => update("showAddress", e.target.checked)}
                className="h-4 w-4 accent-ink"
              />{" "}
              Exibir endereço completo no catálogo
            </label>
          </div>
        </div>
        <div>
          <label className={label}>Características</label>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
            <Input
              label="Quartos"
              value={property.bedrooms}
              inputMode="numeric"
              onChange={(v) => update("bedrooms", v)}
            />
            <Input
              label="Suítes"
              value={property.suites}
              inputMode="numeric"
              onChange={(v) => update("suites", v)}
            />
            <Input
              label="Banheiros"
              value={property.bathrooms}
              inputMode="numeric"
              onChange={(v) => update("bathrooms", v)}
            />
            <Input
              label="Vagas"
              value={property.parking}
              inputMode="numeric"
              onChange={(v) => update("parking", v)}
            />
            <Input
              label="Área m²"
              value={property.area}
              inputMode="numeric"
              onChange={(v) => update("area", v)}
            />
          </div>
        </div>
        <div>
          <label className={label}>Descrição</label>
          <textarea
            className={`${field} min-h-36 resize-y py-3`}
            value={property.description}
            placeholder="Conte os principais diferenciais deste imóvel..."
            onChange={(e) => update("description", e.target.value)}
          />
          <button
            type="button"
            onClick={() =>
              update(
                "description",
                `Conheça este ${property.type.toLowerCase()} em ${property.neighborhood || property.city || "uma localização especial"}, com ambientes pensados para viver bem.`,
              )
            }
            className="mt-3 font-body text-sm text-ash underline underline-offset-4 hover:text-ink"
          >
            Gerar descrição
          </button>
        </div>
        <div>
          <label className={label}>Diferenciais</label>
          <div className="flex flex-wrap gap-2">
            {features.map((name) => (
              <button
                key={name}
                onClick={() => toggle(name)}
                className={`rounded-full border px-4 py-2 font-body text-sm transition ${property.features.includes(name) ? "border-ink bg-ink text-paper" : "border-line bg-white text-ash hover:border-ink"}`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
      </div>
      <Button className="mt-10" loading={saving} onClick={onPublish}>
        Publicar imóvel
      </Button>
    </section>
  );
}

function SuccessStep({
  profile,
  property,
  photos,
  link,
  onDashboard,
}: {
  profile: Profile;
  property: Property;
  photos: Photo[];
  link: string;
  onDashboard: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const share = `Confira meus imóveis disponíveis na Vello: ${link}`;
  return (
    <section className="mx-auto max-w-[760px] py-14 text-center sm:py-20">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-ink text-paper">
        <Check size={27} />
      </div>
      <p className="mt-7 font-mono text-[10px] uppercase tracking-[0.12em] text-stone">
        Seu primeiro imóvel foi publicado
      </p>
      <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl">
        Seu catálogo está no ar.
      </h1>
      <p className="mx-auto mt-4 max-w-xl font-body text-[16px] leading-relaxed text-ash">
        Seu primeiro imóvel já está publicado e sua página Vello está pronta
        para compartilhar.
      </p>
      <div className="mx-auto mt-10 max-w-sm overflow-hidden rounded-[24px] border border-line bg-white text-left shadow-[0_24px_60px_rgba(11,11,10,0.1)]">
        <div className="aspect-[16/9] bg-cream">
          {photos[0] ? (
            <img src={photos[0].url} className="h-full w-full object-cover" />
          ) : null}
        </div>
        <div className="p-5">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-cream">
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  className="h-full w-full object-cover"
                />
              ) : (
                <img src={appPath("/vello-mascot.png")} alt="Mascote temporário da Vello" className="h-full w-full object-cover object-top" />
              )}
            </span>
            <div>
              <b className="block font-body text-sm text-ink">
                {profile.professionalName}
              </b>
              <span className="font-body text-xs text-ash">
                Corretor de imóveis · {profile.creci}
              </span>
            </div>
          </div>
          <h2 className="mt-5 font-display text-xl font-semibold text-ink">
            {property.title}
          </h2>
          <p className="mt-2 font-mono text-sm text-ink">{property.price}</p>
          <p className="mt-3 font-body text-sm text-ash">
            {property.bedrooms || "0"} quartos · {property.parking || "0"} vagas
            · {property.area || "0"} m²
          </p>
        </div>
      </div>
      <p className="mt-7 font-mono text-[11px] text-ash">{link}</p>
      <div className="mx-auto mt-6 grid max-w-sm gap-3">
        <a
          href={link}
          className="flex h-12 items-center justify-center rounded-xl bg-ink font-body text-sm font-semibold text-paper"
        >
          Ver meu catálogo
        </a>
        <button
          onClick={() => {
            navigator.clipboard.writeText(link);
            setCopied(true);
            window.setTimeout(() => setCopied(false), 1800);
          }}
          className="flex h-12 items-center justify-center gap-2 rounded-xl border border-line bg-white font-body text-sm font-medium text-ink"
        >
          <Copy size={15} /> {copied ? "Link copiado" : "Copiar link"}
        </button>
        <a
          href={`https://wa.me/?text=${encodeURIComponent(share)}`}
          target="_blank"
          rel="noreferrer"
          className="font-body text-sm text-ash underline underline-offset-4 hover:text-ink"
        >
          Compartilhar pelo WhatsApp
        </a>
        <button
          onClick={onDashboard}
          className="mt-2 font-body text-sm text-ash hover:text-ink"
        >
          Ir para o dashboard
        </button>
      </div>
      <p className="mt-10 font-body text-sm text-stone">Tá bonito, hein?</p>
    </section>
  );
}

function Input({
  label: text,
  value,
  onChange,
  ...props
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  onBlur?: () => void;
}) {
  return (
    <label>
      <span className={label}>{text}</span>
      <input
        className={field}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </label>
  );
}
function Select({
  label: text,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label>
      <span className={label}>{text}</span>
      <select
        className={field}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </label>
  );
}
function Segment({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-lg px-5 py-2.5 font-body text-sm transition ${active ? "bg-ink text-paper" : "text-ash hover:text-ink"}`}
    >
      {children}
    </button>
  );
}
function Button({
  children,
  loading,
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  loading: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      disabled={loading}
      onClick={onClick}
      className={`flex h-13 w-full items-center justify-center gap-2 rounded-xl bg-ink px-5 font-body text-sm font-semibold text-paper transition hover:bg-charcoal disabled:opacity-70 ${className}`}
    >
      {loading && <LoaderCircle size={16} className="animate-spin" />}
      {loading ? "Salvando..." : children}
    </button>
  );
}
