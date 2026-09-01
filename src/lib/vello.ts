import { requireSupabase } from "./supabase";

export type CatalogTheme = {
  palette: "warm" | "paper" | "charcoal";
  property_style: "editorial" | "classic" | "compact";
  profile_band: "light" | "contrast" | "dark";
  background_color?: string;
  profile_color?: string;
};

export type Profile = {
  id: string;
  user_id: string;
  professional_name: string;
  full_name: string;
  avatar_url: string | null;
  creci: string | null;
  whatsapp: string | null;
  city: string | null;
  state: string | null;
  instagram: string | null;
  slug: string | null;
  bio: string;
  onboarding_completed: boolean;
  show_instagram: boolean;
  show_creci: boolean;
  show_completed_properties: boolean;
  catalog_theme: CatalogTheme;
};
export type PropertyImage = {
  id: string;
  image_url: string;
  position: number;
  is_cover: boolean;
};
export type Property = {
  id: string;
  user_id: string;
  title: string;
  description: string;
  transaction_type: "sale" | "rent";
  property_type: string;
  price: number;
  city: string;
  neighborhood: string;
  address: string | null;
  show_full_address: boolean;
  bedrooms: number;
  suites: number;
  bathrooms: number;
  parking_spaces: number;
  area: number;
  features: string[];
  status: "available" | "reserved" | "sold" | "rented";
  publication_status: "draft" | "published";
  slug: string | null;
  created_at: string;
  updated_at: string;
  property_images: PropertyImage[];
};
export type Selection = {
  id: string;
  user_id: string;
  client_name: string;
  client_whatsapp: string | null;
  slug: string;
  intro_message: string;
  status: "active" | "archived";
  created_at: string;
  selection_properties?: Array<{
    property_id: string;
    position: number;
    properties: Property;
  }>;
};
export const brl = (value: number, monthly = false) =>
  `${new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 }).format(Number(value || 0))}${monthly ? "/mês" : ""}`;
export const dateBR = (value: string) =>
  new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
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
export async function getProperties(userId: string) {
  const { data, error } = await requireSupabase()
    .from("properties")
    .select("*,property_images(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return ((data || []) as Property[]).map((p) => ({
    ...p,
    property_images: [...(p.property_images || [])].sort(
      (a, b) => a.position - b.position,
    ),
  }));
}
export async function getProperty(id: string) {
  const { data, error } = await requireSupabase()
    .from("properties")
    .select("*,property_images(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  return {
    ...(data as Property),
    property_images: [...((data as Property).property_images || [])].sort(
      (a, b) => a.position - b.position,
    ),
  };
}
export async function saveProperty(
  userId: string,
  property: Partial<Property>,
  images: Array<{ url: string; id?: string }>,
) {
  const payload = {
    ...property,
    user_id: userId,
    slug: property.slug || slugify(property.title || "imovel"),
  };
  delete (payload as Partial<Property>).property_images;
  const client = requireSupabase();
  const { data, error } = property.id
    ? await client
        .from("properties")
        .update(payload)
        .eq("id", property.id)
        .select()
        .single()
    : await client.from("properties").insert(payload).select().single();
  if (error) throw error;
  const id = data.id;
  await client.from("property_images").delete().eq("property_id", id);
  if (images.length) {
    const { error: imagesError } = await client
      .from("property_images")
      .insert(
        images.map((image, position) => ({
          property_id: id,
          image_url: image.url,
          position,
          is_cover: position === 0,
        })),
      );
    if (imagesError) throw imagesError;
  }
  return id as string;
}
export async function deleteProperty(id: string) {
  const { error } = await requireSupabase()
    .from("properties")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function deleteSelection(id: string) {
  const { error } = await requireSupabase()
    .from("selections")
    .delete()
    .eq("id", id);
  if (error) throw error;
}

export async function setSelectionStatus(
  id: string,
  status: Selection["status"],
) {
  const { error } = await requireSupabase()
    .from("selections")
    .update({ status })
    .eq("id", id);
  if (error) throw error;
}
export async function uploadPropertyImages(
  userId: string,
  files: FileList | File[],
  remainingSlots = 12,
) {
  const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
  const maxSize = 10 * 1024 * 1024;
  const list = [...files];
  if (!list.length) return [];
  if (remainingSlots <= 0 || list.length > remainingSlots) {
    throw new Error(`Você pode ter no máximo 12 fotos por imóvel.`);
  }
  if (list.some((file) => !acceptedTypes.includes(file.type))) {
    throw new Error("Use apenas imagens JPG, PNG ou WebP.");
  }
  if (list.some((file) => file.size > maxSize)) {
    throw new Error("Cada imagem deve ter no máximo 10 MB.");
  }
  const client = requireSupabase();
  const uploads = await Promise.all(
    list.map(async (file) => {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${userId}/${crypto.randomUUID()}.${ext}`;
      const { error } = await client.storage
        .from("property-images")
        .upload(path, file, { upsert: false });
      if (error) throw error;
      return client.storage.from("property-images").getPublicUrl(path).data
        .publicUrl;
    }),
  );
  return uploads;
}

export async function uploadAvatar(userId: string, file: File) {
  const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
  if (!acceptedTypes.includes(file.type)) {
    throw new Error("Use uma foto JPG, PNG ou WebP.");
  }
  if (file.size > 5 * 1024 * 1024) {
    throw new Error("A foto deve ter no máximo 5 MB.");
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
export async function getSelections(userId: string) {
  const { data, error } = await requireSupabase()
    .from("selections")
    .select(
      "*,selection_properties(property_id,position,properties(*,property_images(*)))",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []) as unknown as Selection[];
}
export async function getSelection(id: string) {
  const { data, error } = await requireSupabase()
    .from("selections")
    .select(
      "*,selection_properties(property_id,position,properties(*,property_images(*)))",
    )
    .eq("id", id)
    .single();
  if (error) throw error;
  return data as unknown as Selection;
}
export async function saveSelection(
  userId: string,
  selection: Partial<Selection>,
  propertyIds: string[],
) {
  const client = requireSupabase();
  const payload = {
    ...selection,
    user_id: userId,
    slug:
      selection.slug ||
      `${slugify(selection.client_name || "selecao")}-${crypto.randomUUID().slice(0, 8)}`,
  };
  delete (payload as Partial<Selection>).selection_properties;
  const { data, error } = selection.id
    ? await client
        .from("selections")
        .update(payload)
        .eq("id", selection.id)
        .select()
        .single()
    : await client.from("selections").insert(payload).select().single();
  if (error) throw error;
  await client
    .from("selection_properties")
    .delete()
    .eq("selection_id", data.id);
  if (propertyIds.length) {
    const { error: itemError } = await client
      .from("selection_properties")
      .insert(
        propertyIds.map((property_id, position) => ({
          selection_id: data.id,
          property_id,
          position,
        })),
      );
    if (itemError) throw itemError;
  }
  return data.id as string;
}
