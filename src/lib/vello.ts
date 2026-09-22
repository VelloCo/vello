import { compressImage, isAcceptedImage } from "./image";
import { requireSupabase } from "./supabase";

export type CatalogTheme = {
  palette: "warm" | "paper" | "charcoal";
  property_style: "editorial" | "classic" | "compact";
  profile_band: "light" | "contrast" | "dark";
  background_color?: string;
  profile_color?: string;
  /** Cor de destaque da página pública (ver `src/lib/catalogStyle.ts`). */
  accent?: "sky" | "rose" | "sage" | "lilac" | "sand" | "graphite";
};

export type Profile = {
  id: string;
  user_id: string;
  professional_name: string;
  full_name: string;
  avatar_url: string | null;
  whatsapp: string | null;
  city: string | null;
  state: string | null;
  instagram: string | null;
  slug: string | null;
  bio: string;
  onboarding_completed: boolean;
  show_instagram: boolean;
  catalog_theme: CatalogTheme;
  business_type?: "autonoma" | "clinica";
  neighborhood?: string | null;
  address?: string | null;
  show_address?: boolean;
  timezone?: string;
  booking_enabled?: boolean;
  booking_auto_confirm?: boolean;
  booking_slot_minutes?: number;
  booking_min_notice_minutes?: number;
  booking_max_days_ahead?: number;
  before_after_terms_accepted_at?: string | null;
};
export type ServiceImage = {
  id: string;
  image_url: string;
  position: number;
  is_cover: boolean;
};
export type Service = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category:
    | "facial"
    | "corporal"
    | "depilacao"
    | "sobrancelhas_cilios"
    | "unhas"
    | "cabelo"
    | "massagem"
    | "harmonizacao"
    | "outros";
  price_type: "fixed" | "from" | "on_request";
  price: number | null;
  duration_minutes: number;
  publication_status: "draft" | "published";
  bookable: boolean;
  position: number;
  slug: string | null;
  created_at: string;
  updated_at: string;
  service_images: ServiceImage[];
};
export type BusinessHour = {
  id: string;
  user_id: string;
  weekday: number;
  start_time: string;
  end_time: string;
  created_at: string;
};
export type Appointment = {
  id: string;
  user_id: string;
  service_id: string | null;
  service_title: string;
  client_name: string;
  client_whatsapp: string;
  client_notes: string;
  starts_at: string;
  ends_at: string;
  status: "pending" | "confirmed" | "cancelled" | "completed" | "no_show";
  source: "online" | "manual";
  created_at: string;
  updated_at: string;
};
export const brlCents = (value: number | null | undefined) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
export const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function getProfile(userId: string) {
  const { data, error } = await requireSupabase()
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data as Profile;
}
export async function saveProfile(userId: string, values: Partial<Profile>) {
  const { error } = await requireSupabase()
    .from("profiles")
    .update(values)
    .eq("user_id", userId);
  if (error) throw error;
}
export async function getServices(userId: string) {
  const { data, error } = await requireSupabase()
    .from("services")
    .select("*,service_images(*)")
    .eq("user_id", userId)
    .order("position", { ascending: true })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data || []) as Service[]).map((service) => ({
    ...service,
    service_images: [...(service.service_images || [])].sort(
      (a, b) => a.position - b.position,
    ),
  }));
}
export async function saveService(
  userId: string,
  service: Partial<Service>,
  images: Array<{ url: string; id?: string }>,
) {
  const payload = {
    ...service,
    user_id: userId,
    slug: service.slug || slugify(service.title || "servico"),
    price: service.price_type === "on_request" ? null : Number(service.price || 0),
  };
  delete (payload as Partial<Service>).service_images;
  const client = requireSupabase();
  const { data, error } = service.id
    ? await client
        .from("services")
        .update(payload)
        .eq("id", service.id)
        .select()
        .single()
    : await client.from("services").insert(payload).select().single();
  if (error) throw error;
  const id = data.id;
  await client.from("service_images").delete().eq("service_id", id);
  if (images.length) {
    const { error: imagesError } = await client
      .from("service_images")
      .insert(
        images.map((image, position) => ({
          service_id: id,
          image_url: image.url,
          position,
          is_cover: position === 0,
        })),
      );
    if (imagesError) throw imagesError;
  }
  return id as string;
}
export async function deleteService(id: string) {
  const { error } = await requireSupabase()
    .from("services")
    .delete()
    .eq("id", id);
  if (error) throw error;
}
const uploadTypes = ["image/jpeg", "image/png", "image/webp"];
export async function uploadServiceImages(
  userId: string,
  files: FileList | File[],
  remainingSlots = 8,
) {
  const original = [...files];
  if (!original.length) return [];
  if (remainingSlots <= 0 || original.length > remainingSlots) {
    throw new Error("Você pode ter no máximo 8 fotos por serviço.");
  }
  if (original.some((file) => !isAcceptedImage(file))) {
    throw new Error("Use apenas imagens JPG, PNG ou WebP.");
  }
  if (original.some((file) => file.size > 30 * 1024 * 1024)) {
    throw new Error("Cada imagem deve ter no máximo 30 MB.");
  }
  const list = await Promise.all(
    original.map((file) => compressImage(file, { maxSide: 1600 })),
  );
  if (list.some((file) => !uploadTypes.includes(file.type))) {
    throw new Error("Não foi possível ler uma das fotos. Tente JPG, PNG ou WebP.");
  }
  if (list.some((file) => file.size > 10 * 1024 * 1024)) {
    throw new Error("Uma das fotos continua grande demais. Tente outra foto.");
  }
  const client = requireSupabase();
  const uploads = await Promise.all(
    list.map(async (file) => {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await client.storage
        .from("service-images")
        .upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      return client.storage.from("service-images").getPublicUrl(path).data
        .publicUrl;
    }),
  );
  return uploads;
}
export async function getBusinessHours(userId: string) {
  const { data, error } = await requireSupabase()
    .from("business_hours")
    .select("*")
    .eq("user_id", userId)
    .order("weekday", { ascending: true })
    .order("start_time", { ascending: true });
  if (error) throw error;
  return (data || []) as BusinessHour[];
}
export async function replaceBusinessHours(
  userId: string,
  hours: Array<Pick<BusinessHour, "weekday" | "start_time" | "end_time">>,
) {
  const client = requireSupabase();
  const { error: deleteError } = await client
    .from("business_hours")
    .delete()
    .eq("user_id", userId);
  if (deleteError) throw deleteError;
  if (!hours.length) return;
  const { error } = await client.from("business_hours").insert(
    hours.map((hour) => ({
      ...hour,
      user_id: userId,
    })),
  );
  if (error) throw error;
}
export async function getAppointments(userId: string) {
  const from = new Date();
  from.setDate(from.getDate() - 30);
  const { data, error } = await requireSupabase()
    .from("appointments")
    .select("*")
    .eq("user_id", userId)
    .gte("starts_at", from.toISOString())
    .order("starts_at", { ascending: true });
  if (error) throw error;
  return (data || []) as Appointment[];
}
export async function setAppointmentStatus(
  id: string,
  status: Appointment["status"],
) {
  const { error } = await requireSupabase()
    .from("appointments")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}
export async function uploadAvatar(userId: string, picked: File) {
  if (!isAcceptedImage(picked)) {
    throw new Error("Use uma foto JPG, PNG ou WebP.");
  }
  if (picked.size > 30 * 1024 * 1024) {
    throw new Error("A foto deve ter no máximo 30 MB.");
  }
  const file = await compressImage(picked, { maxSide: 512, quality: 0.85 });
  if (!uploadTypes.includes(file.type)) {
    throw new Error("Não foi possível ler esta foto. Tente JPG, PNG ou WebP.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("A foto continua grande demais. Tente outra foto.");
  }
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/avatar-${crypto.randomUUID()}.${ext}`;
  const client = requireSupabase();
  const { error } = await client.storage
    .from("avatars")
    .upload(path, file, { upsert: false, contentType: file.type });
  if (error) throw error;
  return client.storage.from("avatars").getPublicUrl(path).data.publicUrl;
}
